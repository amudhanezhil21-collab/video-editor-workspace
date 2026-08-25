#!/usr/bin/env python3
"""FAST keying pass — demo tier. Hue-band matte + despill + edge feather, all CPU cores.

Same span/chunk/ProRes contract as batch_key.py but ~1s/frame instead of ~7s.
Output goes to remotion/public/assets/plates/ (the neural batch later writes
plates-hq/ and the timeline prefers hq where present).
"""
import json, os, subprocess, sys, shutil, glob
from pathlib import Path
from multiprocessing import Pool

JOB = Path(__file__).resolve().parents[1]
VIDEO = JOB / "assets/reference-basecut.mp4"
OUT = JOB / "graphics-build/remotion/public/assets/plates"
LOG = JOB / "graphics-build/fast_key.log"
CHUNK = 250
WORKERS = 7

def log(msg):
    from datetime import datetime
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

def key_one(args):
    import numpy as np, cv2
    src, dst = args
    im = cv2.imread(src)  # BGR uint8 4K
    a = im.astype(np.float32) / 255.0
    b, g, r = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1)
    v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    hue = np.zeros_like(mx); m = (mx == g) & (mx > mn)
    hue[m] = 60 * (2 + (b - r)[m] / np.maximum((mx - mn)[m], 1e-6))
    is_green = (hue > 82) & (hue < 110) & (s > 0.26) & (v > 0.09)
    alpha = (~is_green).astype(np.float32)
    # clean the matte: close pinholes, open specks, then feather the edge
    k5 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, k5)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, k5)
    alpha = cv2.GaussianBlur(alpha, (7, 7), 2.2)
    # despill in the edge band + anywhere green dominates inside the subject
    band = ((alpha > 0.01) & (alpha < 0.99))
    spill = (g > r * 1.08) & (g > b * 1.08) & (alpha > 0.01)
    fix = band | spill
    g2 = g.copy()
    g2[fix] = np.minimum(g[fix], np.maximum(r[fix], b[fix]) * 1.02)
    out = np.dstack([(b * 255), (g2 * 255), (r * 255), (alpha * 255)]).astype(np.uint8)
    cv2.imwrite(dst, out)
    return dst

def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)

def main():
    q = json.load(open(JOB / "graphics-build/keying-queue.json"))
    OUT.mkdir(parents=True, exist_ok=True)
    log(f"fast pass: {len(q['spans'])} spans, {q['totalFrames']} frames, {WORKERS} workers")
    for sp in q["spans"]:
        mov = OUT / f"{sp['span']}.mov"
        if mov.exists():
            log(f"{sp['span']}: exists, skip"); continue
        if shutil.disk_usage("/").free / 1e9 < 4.0:
            log("DISK GUARD abort"); sys.exit(2)
        n = sp["frames"]; t0 = sp["f0"] / 25.0
        stage = JOB / "graphics-build/_fast" / sp["span"]
        raw = stage / "raw"; fin = stage / "fin"
        for d in (raw, fin): d.mkdir(parents=True, exist_ok=True)
        done = 0
        while done < n:
            c = min(CHUNK, n - done)
            r = run(["ffmpeg", "-v", "error", "-ss", f"{t0 + done/25.0:.3f}", "-i", str(VIDEO),
                     "-frames:v", str(c), "-start_number", str(done), str(raw / "f%05d.png")])
            if r.returncode: log(f"extract fail {r.stderr[:200]}"); sys.exit(1)
            frames = sorted(glob.glob(str(raw / "*.png")))
            with Pool(WORKERS) as p:
                p.map(key_one, [(f, str(fin / Path(f).name)) for f in frames])
            for f in frames: os.remove(f)
            done += c
            log(f"{sp['span']}: {done}/{n}")
        r = run(["ffmpeg", "-v", "error", "-y", "-framerate", "25", "-start_number", "0",
                 "-i", str(fin / "f%05d.png"), "-c:v", "prores_ks", "-profile:v", "4444",
                 "-pix_fmt", "yuva444p10le", "-alpha_bits", "8", "-qscale:v", "12", str(mov)])
        if r.returncode: log(f"prores fail {r.stderr[:300]}"); sys.exit(1)
        shutil.rmtree(stage)
        log(f"{sp['span']}: DONE ({mov.stat().st_size/1e6:.0f}MB)")
    log("FAST PASS COMPLETE")

if __name__ == "__main__":
    main()
