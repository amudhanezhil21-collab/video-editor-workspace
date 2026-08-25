#!/usr/bin/env python3
"""
Solve caption Y placement by MEASUREMENT against the rendered graphics, never by eye.

finishing-pass skill: build a per-frame occupancy map of graphic CONTENT (local edge energy, so a
smooth gradient is not a collision but a card/table/number is), then walk a ladder of candidate Y
values and take the first that clears the graphics, the face box and the safe zones.

Two details that matter and are easy to get wrong:
  * THE FACE BOX IS PER BEAT. On a full-frame takeover her face is absent entirely, and on REF13 it
    is inside the PIP mask, not at her full-frame position. Using the default box on those beats
    rejects the one clear band the scene actually has and forces a needless suppression.
  * The camera-move beats are ZOOMED, so the face box grows about the frame centre. A caption
    placed against the unzoomed box can land on her mouth.
"""
import json, subprocess, sys, os

JOB = "/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps"
OUT = "/Volumes/vedev/smallcap-250-index-hidden-midcaps/remotion/out"
FPS, TOTAL = 25, 2231
FACE = (330, 380, 730, 1100)          # measured, unzoomed


def zoomed(box, z, cx=540, cy=960):
    x0, y0, x1, y1 = box
    return (int(cx + (x0 - cx) * z), int(cy + (y0 - cy) * z),
            int(cx + (x1 - cx) * z), int(cy + (y1 - cy) * z))


# Per-beat face box. (0,0,0,0) = she is not on screen at all, so nothing to dodge.
NO_FACE = (0, 0, 0, 0)
FACE_BY_REF = {
    1: zoomed(FACE, 1.045), 2: zoomed(FACE, 1.045),        # REF1/REF2 ride the subtle push-in
    3: NO_FACE,                                            # full-frame takeover
    4: FACE, 5: FACE,
    6: NO_FACE, 7: NO_FACE, 8: NO_FACE,
    9: zoomed(FACE, 1.13), 10: zoomed(FACE, 1.13),         # REF9 rapid push-in, held over REF10
    11: NO_FACE, 12: NO_FACE,
    13: (363, 152, 690, 552),                              # inside the PIP mask
    14: NO_FACE, 15: NO_FACE, 16: NO_FACE,
    17: zoomed(FACE, 1.045), 18: zoomed(FACE, 1.045), 19: zoomed(FACE, 1.045),
}

# Everything that paints CONTENT the caption must dodge. B-roll is deliberately absent: style.md
# says captions and branding persist over b-roll, so it is not a collision.
OVERLAYS = [
    {"file": f"{OUT}/ref3-name-takeover.mov", "tag": "ref3", "start": 216 / FPS},
    {"file": f"{OUT}/ref6-seesaw-rebalance.mov", "tag": "ref6", "start": 366 / FPS},
    {"file": f"{OUT}/ref08-midcap-range.mov", "tag": "ref08", "start": 662 / FPS},
    {"file": f"{OUT}/ref11-stays-till-rebalance.mov", "tag": "ref11", "start": 820 / FPS},
    {"file": f"{OUT}/ref13-table.mov", "tag": "ref13", "start": 1254 / FPS},
    {"file": f"{OUT}/ref14-officially-functionally.mov", "tag": "ref14", "start": 1627 / FPS},
    {"file": f"{OUT}/ref2-sounds-logical.mov", "tag": "ref2", "start": 172 / FPS},
    {"file": f"{OUT}/ref5-market-swirl.mov", "tag": "ref5", "start": 328 / FPS},
    {"file": f"{OUT}/ref10-no.mov", "tag": "ref10", "start": 805 / FPS},
    {"file": f"{OUT}/ref18-notepad.mov", "tag": "ref18", "start": 2047 / FPS},
    {"file": f"{OUT}/ref19-subscribe.mov", "tag": "ref19", "start": 2178 / FPS},
]

if __name__ == "__main__":
    src = json.load(open(f"{JOB}/transcript/caption-groups.json"))
    groups = src["groups"]
    for g in groups:
        g.setdefault("y", 1400)          # the solver diffs against this to report relocations
    flat = f"{JOB}/transcript/_caption-groups-flat.json"
    json.dump(groups, open(flat, "w"), ensure_ascii=False, indent=1)

    cfg = {"groups": flat, "overlays": OVERLAYS, "segments": [], "totalFrames": TOTAL,
           "chipHeight": 96, "faceByRef": {str(k): list(v) for k, v in FACE_BY_REF.items()},
           "out": f"{JOB}/transcript/caption-groups-placed.json"}
    cfgp = f"{JOB}/transcript/_caption-solver-cfg.json"
    json.dump(cfg, open(cfgp, "w"), indent=1)

    r = subprocess.run([sys.executable,
                        "/Users/ezhilamudhan/Desktop/video-editor/.claude/skills/finishing-pass/scripts/caption_solver.py",
                        cfgp, f"{JOB}/_scratch/capsolve"])
    sys.exit(r.returncode)
