#!/usr/bin/env python3
"""Generate the SFX cue sheet (audio/sfx-cues.json) per styles/groww-longform/sound-design.md.

Step 1 movement: whoosh at every span entrance, PEAK on the fastest animation frame
  (house EASE curve -> peak at entrance_start + 28% of duration; RiseIn defaults 10f).
Step 2 texture: data ticks under word-by-word text, clicks on panel rows (RiseIn 6+i*3),
  shimmer on card coins, sting on every topic card, UI clicks on the subscribe cursor.
Step 3 emotion: riser into the verdict block, hit on the conclusion card.

Cue times are DELIVERY seconds (disclaimer offset included). Peak-align means the mixer
places the file so its measured loudness peak lands on `t`.
"""
import json, subprocess
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
FPS = 25
PACK = JOB.parents[1] / "assets/longform/sfx-pack"

m = json.load(open(JOB / "graphics-build/scene-map.json"))
gd = json.load(open(JOB / "graphics-build/graphics-data.json"))
OFF = 3.0  # disclaimer prepend

# pick pack files deterministically (variety via rotation)
def pick(cat, i):
    files = sorted((PACK / cat).glob("*.mp3"))
    return str(files[i % len(files)].relative_to(JOB.parents[1])) if files else None

cues = []
def cue(t, cat, idx, gain, align, why):
    f = pick(cat, idx)
    if f:
        cues.append({"t": round(t, 3), "file": f, "gainDb": gain, "align": align, "why": why})

nW = nC = nG = nS = 0
prev_type = None
for i, s in enumerate(m["spans"]):
    t0 = s["t0"] + OFF
    g = gd.get(s["id"], {}) or {}
    kind = (s.get("transitionIn") or {}).get("kind", "").lower()
    ft = s["frameType"]

    # --- step 1: movement whoosh on the span entrance (peak at +28% of a 10f entrance) ---
    if "hard cut" not in kind or ft in (4, 5, 6):
        peak_t = t0 + (10 * 0.28) / FPS
        heavy = any(k in kind for k in ("brand", "whip", "zoom", "crash"))
        cue(peak_t, "whooshes", nW, -14 if heavy else -17, "peak", f"{s['id']} entrance ({kind or 'cut'})")
        nW += 1

    # --- step 2: textures ---
    if ft == 4:  # topic card: sting + coin shimmer + word-by-word tick
        cue(t0 + 0.05, "risers", nS, -16, "start", f"{s['id']} topic-card sting")
        cue(t0 + 0.15, "others", nG, -20, "start", f"{s['id']} coin shimmer")
        nS += 1; nG += 1
    lay = g.get("layout", "")
    if lay in ("data-panel", "twin-tables", "verdict-table", "callout-boxes"):
        rows = len(g.get("elements", []) or [])
        for r in range(min(rows, 8)):  # row entrances at RiseIn from=6+i*3
            cue(t0 + (6 + r * 3) / FPS, "clicks", nC, -22, "start", f"{s['id']} row {r+1}")
            nC += 1
        # highlight moments: soft click when a value lights up as spoken
        for h in (g.get("highlightSchedule") or [])[:12]:
            cue(h["t"] + OFF, "clicks", nC, -24, "start", f"{s['id']} highlight {h.get('what','')[:30]}")
            nC += 1
    if lay == "creator-text" and g.get("lines"):
        cue(t0 + 3 / FPS, "others", nG, -22, "start", f"{s['id']} text data-tick")
        nG += 1
    if lay == "journey":
        for d in range(4):
            cue(t0 + 0.6 + d * 1.1, "clicks", nC, -22, "start", f"{s['id']} journey dot {d+1}")
            nC += 1
    prev_type = ft

# --- step 3: emotion ---
# riser into the conclusion/verdict area (last type-4 card), hit on its land
cards = [s for s in m["spans"] if s["frameType"] == 4]
if cards:
    last = cards[-1]
    cue(last["t0"] + OFF - 1.6, "risers", 1, -15, "start", "riser into conclusion")
    cue(last["t0"] + OFF + 0.12, "hits", 0, -13, "start", "conclusion land")

# subscribe cursor clicks (cursor hits at rel frames ~40 and ~92 in the unit)
for u_t in (47.43, 807.33):
    cue(u_t + OFF + 40 / FPS, "clicks", 0, -16, "start", "subscribe click")
    cue(u_t + OFF + 92 / FPS, "clicks", 1, -16, "start", "bell click")

out = {"fps": FPS, "deliveryOffset": OFF, "count": len(cues),
       "music": {"file": "projects/invesco-vs-motilal-large-midcap/audio/music/documentary-580.mp3",
                 "gainDb": -21, "loop": True, "crossfadeS": 2.0,
                 "from": OFF, "to": OFF + m["spans"][-1]["t1"]},
       "cues": sorted(cues, key=lambda c: c["t"])}
(JOB / "audio/sfx-cues.json").write_text(json.dumps(out, indent=1))
print(f"cues: {len(cues)} (whooshes~{nW}, clicks~{nC}, stings~{nS}, others~{nG}) -> audio/sfx-cues.json")
