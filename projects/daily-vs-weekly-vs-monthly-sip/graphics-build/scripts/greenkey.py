#!/usr/bin/env python3
"""
Key an ultra-key-green Higgsfield clip to straight alpha.

Why not ffmpeg chromakey: these clips come back with a VIGNETTED green (measured on
b4-three-people: #016433 in the corners, #127B43 centre). chromakey compares CHROMA ONLY, so the
similarity radius needed to clear the dark corners also swallows neutral U/V — the white t-shirts
went 100% transparent at sim 0.22. Greenness = G - max(R,B) is luma-independent, so one pair of
thresholds keys the whole vignette without touching neutrals.

Measured separation (2026-08-23): only 0.9-4.3% of pixels fall in the 10-40 transition band on all
three clips, so a soft ramp over [lo,hi] lands almost entirely on genuine edge pixels.
"""
import sys, os, subprocess, numpy as np, cv2

def key(src, outdir, lo=12.0, hi=38.0, despill_headroom=8.0, gold_restore=False):
    os.makedirs(outdir, exist_ok=True)
    cap = cv2.VideoCapture(src)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    i = 0; stats = []
    while True:
        ok, f = cap.read()
        if not ok: break
        b, g, r = [f[:, :, c].astype(np.float32) for c in range(3)]
        mx = np.maximum(r, b)
        grn = g - mx
        a = np.clip((hi - grn) / (hi - lo), 0.0, 1.0)
        # despill: never let green exceed the other channels by more than the headroom.
        # where the pixel is not green this is a no-op, so nothing else shifts hue.
        g2 = np.minimum(g, mx + despill_headroom)
        if gold_restore:
            # A glass hero shot on green has REAL green light inside it, not just spill: the coins
            # measured G/R 0.912 where gold is 0.75-0.85. Pull green back on warm pixels only, so
            # the glass, the highlights and everything neutral are untouched.
            warm = (r > 90) & (r > b + 25)
            g2 = np.where(warm, np.minimum(g2, 0.80 * r + 0.20 * b), g2)
        out = np.dstack([b, g2, r, a * 255.0]).astype(np.uint8)
        cv2.imwrite(f"{outdir}/f_{i:05d}.png", out, [cv2.IMWRITE_PNG_COMPRESSION, 3])
        if i % 40 == 0:
            stats.append((i, float((a > 0.99).mean()), float(((a > 0.01) & (a < 0.99)).mean())))
        i += 1
    cap.release()
    print(f"  {i} frames -> {outdir}")
    for fi, solid, edge in stats:
        print(f"    f{fi:<5d} opaque={100*solid:5.1f}%  soft-edge={100*edge:5.2f}%")
    return i

if __name__ == "__main__":
    src, outdir = sys.argv[1], sys.argv[2]
    lo = float(sys.argv[3]) if len(sys.argv) > 3 else 12.0
    hi = float(sys.argv[4]) if len(sys.argv) > 4 else 38.0
    gold = len(sys.argv) > 5 and sys.argv[5] == "gold"
    head = float(sys.argv[6]) if len(sys.argv) > 6 else 8.0
    key(src, outdir, lo, hi, despill_headroom=head, gold_restore=gold)
