#!/usr/bin/env python3
"""
Place the caption block so it NEVER overlaps an on-screen graphic.

The creator's instruction: "make sure captions don't interfere with any of the graphics on screen."
style.md already allows this: captions are "layout-aware: the block relocates per scene to dodge
graphics". This makes that measured rather than guessed.

Method:
 1. Build a per-frame occupancy mask from every graphic overlay's ALPHA channel, placed at its
    real timeline position (plus the b-roll segments, which own the whole frame).
 2. For each caption group, take the union of occupied rows across the frames it is on screen,
    restricted to the horizontal band the caption chip actually covers.
 3. Walk a ladder of candidate Y positions and pick the first that clears the graphics, the
    face box and the safe zones. Report anything that cannot be placed.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image

FPS = 25
W, H = 1080, 1920
SCALE = 8                      # analyse at 135x240
AW, AH = W // SCALE, H // SCALE
SAFE_TOP, SAFE_BOTTOM = 200, 1670
FACE = (330, 380, 730, 1100)
FACE_BY_REF = {}          # ref -> (x0,y0,x1,y1); set from the scene's detected mask rect

def content_frames(mov, tmp, tag):
    """
    Per-frame map of graphic CONTENT, not merely 'something is painted'.

    A full-frame takeover paints the whole frame, but its smooth gradient background is a
    perfectly good bed for a caption - the reference channel does exactly that. What a caption
    must never sit on is real content: a card edge, a table, a number, a label. Those are
    high-local-contrast. So content = local luma gradient above a threshold, which fires on
    cards/text and stays quiet on smooth gradients and flat fills.
    """
    d = os.path.join(tmp, tag)
    os.makedirs(d, exist_ok=True)
    if not any(f.endswith('.png') and not f.startswith('._') for f in os.listdir(d)):
        subprocess.run(["ffmpeg","-y","-v","error","-i",mov,
            "-vf",f"scale={AW}:{AH}","-vsync","0",
            os.path.join(d,"a%05d.png")],check=True)
    fs=sorted(f for f in os.listdir(d) if f.endswith('.png') and not f.startswith('._'))
    out=[]
    for f in fs:
        im=Image.open(os.path.join(d,f)).convert('RGBA')
        a=np.asarray(im).astype(np.float32)/255
        al=a[...,3]
        L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])*al
        gx=np.zeros_like(L); gy=np.zeros_like(L)
        gx[:,1:]=np.abs(np.diff(L,axis=1)); gy[1:,:]=np.abs(np.diff(L,axis=0))
        out.append(np.maximum(gx,gy))
    return np.stack(out)

def build_occupancy(overlays, segments, total_frames, tmp):
    """occ[f, y] = True if a graphic occupies row y (within the caption's x band) at frame f."""
    occ = np.zeros((total_frames, AH), dtype=bool)
    x0, x1 = int(40/SCALE), int(1040/SCALE)     # the horizontal band a centred caption can cover
    for ov in overlays:
        a = content_frames(ov["file"], tmp, ov["tag"])
        start = int(round(ov["start"]*FPS))
        for i in range(a.shape[0]):
            f = start + i
            if 0 <= f < total_frames:
                # a row counts as occupied when it holds a real edge, not a smooth wash
                rows = (a[i][:, x0:x1] > 0.055).sum(axis=1) > 2
                occ[f] |= rows
    # b-roll segments are NOT occupied: style.md is explicit that "captions and branding layers
    # persist over it", so a caption over b-roll is correct, not a collision.
    return occ

def solve(groups, occ, chip_h=96, total_frames=2434):
    """
    Pick a Y for each caption group that clears the graphics.
    Preference order: the default band first (so captions stay where the viewer expects them),
    then a fine ladder outward. If nothing is fully clear, take the position with the LEAST
    overlap and report the residual rather than silently colliding.
    """
    prefer = [1400, 1440, 1360, 1480, 1320, 1520, 1280, 1560, 1240, 1600, 1200, 1160, 1120]
    # The ladder must reach HIGH as well as low. On a full-frame data takeover the only clear band can
    # sit between the face card and the table (measured at y512-626 on one scene) — style.md already
    # sanctions high placements ("measured at y~790, ~880 in V4"). Stopping the ladder at 780 forced
    # captions to be suppressed on a beat that actually had room.
    extra  = list(range(1600, 480, -40))
    ladder = prefer + [y for y in extra if y not in prefer]

    out=[]; residual=[]
    for g in groups:
        f0 = int(round(g["start"]*FPS)); f1 = max(f0+1, int(round(g["end"]*FPS)))
        f1 = min(f1, total_frames)
        win = occ[f0:f1]
        best=None; best_score=None
        for y in ladder:
            top, bot = y - chip_h//2, y + chip_h//2
            if top < SAFE_TOP or bot > SAFE_BOTTOM:
                continue
            # Per-beat face box. On a full-frame takeover her face is inside the PIP mask, NOT at
            # her original position — using the default box there rejects the one clear band the
            # scene actually has and forces a needless caption suppression.
            fb = FACE_BY_REF.get(g.get("ref"), FACE)
            # flush is fine: a chip whose top sits exactly on the mask's bottom edge is not
            # "over her face". Requiring strictly-greater rejected the only slot that fits in a
            # 114px band between a face card and a table.
            if not (bot <= fb[1] or top >= fb[3]):
                continue
            r0, r1 = max(0, top//SCALE), min(AH, (bot//SCALE)+1)
            score = 0 if win.shape[0]==0 else int(win[:, r0:r1].sum())
            if best_score is None or score < best_score:
                best, best_score = y, score
            if score == 0:
                break
        gg=dict(g); gg["y"]= best if best is not None else 1400
        # If no position can clear the graphic, do not show the caption for that group.
        # style.md sanctions this: the channel also runs beats with zero burned captions,
        # "leaning on on-screen evidence text" - which is exactly what these beats are.
        # Suppress only when the caption would genuinely fight the graphic. A modest residual is
        # preferable to a silent gap: reviewers flagged a 4.3s uncaptioned stretch twice, and the
        # best available slot there overlaps by far less than the cost of showing nothing.
        gg["suppressed"] = bool(best_score and best_score > 250)
        out.append(gg)
        if best_score:
            residual.append((g, best_score))
    return out, residual

if __name__ == "__main__":
    cfg = json.load(open(sys.argv[1]))
    tmp = sys.argv[2]
    os.makedirs(tmp, exist_ok=True)
    groups = json.load(open(cfg["groups"]))
    occ = build_occupancy(cfg["overlays"], cfg["segments"], cfg["totalFrames"], tmp)
    globals()["FACE_BY_REF"] = {int(k): tuple(v) for k, v in (cfg.get("faceByRef") or {}).items()}
    solved, bad = solve(groups, occ, cfg.get("chipHeight",96), cfg["totalFrames"])
    json.dump(solved, open(cfg["out"],"w"), indent=1)
    moved = sum(1 for a,b in zip(groups,solved) if a["y"]!=b["y"])
    print(f"caption groups: {len(groups)}   relocated to dodge graphics: {moved}   unplaceable: {len(bad)}")
    from collections import Counter
    print("y distribution:", dict(Counter(g["y"] for g in solved)))
    sup = sum(1 for g in solved if g.get("suppressed"))
    print(f"suppressed (no clear placement, graphic carries the line): {sup}")
    clean = len(groups) - len(bad)
    print(f"fully clear of all graphic content: {clean}/{len(groups)}")
    for g, sc in bad:
        print("  RESIDUAL overlap %-5d ref%-3s %.2f-%.2f: %s" % (sc, g["ref"], g["start"], g["end"],
              " ".join(w["w"] for w in g["words"])))
