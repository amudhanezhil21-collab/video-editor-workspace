#!/usr/bin/env python3
"""Overnight batch keying of all creator spans (keying-queue.json).

Per span, chunked to respect the ~14GB free disk:
  1. extract chunk frames from the 4K base cut at BOTH 1080p (inference input) and 4K (hybrid color)
  2. hue-band hint mattes (parallel)
  3. CorridorKey MLX inference at 1080p / image-size 1024
  4. hybrid convert: alpha = upscaled neural alpha; RGB = original 4K, neural despilled
     color blended only where 0.02 < a < 0.98 (the edge band)
  5. delete chunk working files
Then encode the span to ProRes 4444 (straight alpha) and delete the PNGs.

Resumable: spans with an existing .mov are skipped. Run under caffeinate.
Log: graphics-build/batch_key.log
"""
import json, os, subprocess, sys, shutil, glob
from pathlib import Path
from multiprocessing import Pool

JOB = Path(__file__).resolve().parents[1]
CK = Path(os.path.expanduser("~/tools/CorridorKey"))
CLIP = CK / "ClipsForInference" / "batchspan"
VIDEO = JOB / "assets/reference-basecut.mp4"
OUT = JOB / "graphics-build/plates/plates-seq-hq"  # neural tier PNG seqs; gen_timeline prefers these
LOG = JOB / "graphics-build/batch_key.log"
CHUNK = 100
ENV = dict(os.environ, OPENCV_IO_ENABLE_OPENEXR="1",
           PATH=os.path.expanduser("~/.local/bin") + ":" + os.environ["PATH"])

def log(msg):
    from datetime import datetime
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

def hint_one(args):
    import numpy as np
    from PIL import Image, ImageFilter
    src, dst = args
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(np.float32) / 255.0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1)
    v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    hue = np.zeros_like(mx); m = (mx == g) & (mx > mn)
    hue[m] = 60 * (2 + (b - r)[m] / np.maximum((mx - mn)[m], 1e-6))
    fg = (~((hue > 82) & (hue < 110) & (s > 0.28) & (v > 0.10))).astype(np.uint8) * 255
    Image.fromarray(fg, 'L').filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(3.5)).save(dst)
    return dst

def convert_one(args):
    """Hybrid at native 1080p: neural alpha + original RGB, neural color in the edge band."""
    import numpy as np, cv2
    exr, orig1080, dst = args
    e = cv2.imread(exr, cv2.IMREAD_UNCHANGED | cv2.IMREAD_ANYCOLOR)  # linear float32 BGRA 1080p
    def lin2srgb(x):
        x = np.clip(x, 0, 1)
        return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(x, 1 / 2.4) - 0.055)
    a = np.clip(e[..., 3], 0, 1)
    neural = lin2srgb(e[..., :3]) * 255
    orig = cv2.imread(orig1080).astype(np.float32)
    band = ((a > 0.02) & (a < 0.98)).astype(np.float32)
    band = cv2.GaussianBlur(band, (9, 9), 3)[..., None]
    rgb = orig * (1 - band) + neural * band
    out = np.dstack([rgb.astype(np.uint8), (a * 255).astype(np.uint8)])
    cv2.imwrite(dst, out)
    return dst

def run(cmd, **kw):
    return subprocess.run(cmd, env=ENV, capture_output=True, text=True, **kw)

def main():
    q = json.load(open(JOB / "graphics-build/keying-queue.json"))
    OUT.mkdir(parents=True, exist_ok=True)
    spans = q["spans"]
    log(f"batch start: {len(spans)} spans, {q['totalFrames']} frames")
    for sp in spans:
        free_gb = shutil.disk_usage("/").free / 1e9
        if free_gb < 5.0:
            log(f"DISK GUARD: only {free_gb:.1f}GB free — aborting cleanly"); sys.exit(2)
        seq = OUT / sp["span"]
        if seq.is_dir() and len(os.listdir(seq)) >= sp["frames"]:
            log(f"{sp['span']}: seq exists, skip")
            continue
        n = sp["frames"]; t0 = sp["f0"] / 25.0
        stage = JOB / "graphics-build/_stage" / sp["span"]
        png4k = stage / "png1080"; fin = seq
        for d in (png4k, fin): d.mkdir(parents=True, exist_ok=True)
        log(f"{sp['span']}: {n} frames @ {t0:.2f}s")
        done = 0
        while done < n:
            c = min(CHUNK, n - done)
            ct = t0 + done / 25.0
            if CLIP.exists(): shutil.rmtree(CLIP)
            (CLIP / "Input").mkdir(parents=True); (CLIP / "AlphaHint").mkdir(parents=True)
            # 1080p inference inputs + 4K originals
            r = run(["ffmpeg", "-v", "error", "-ss", f"{ct:.3f}", "-i", str(VIDEO),
                     "-frames:v", str(c), "-vf", "scale=1920:1080", "-pix_fmt", "rgba", "-start_number", str(done),
                     str(CLIP / "Input" / "f%05d.png")])
            if r.returncode: log(f"ffmpeg 1080 fail: {r.stderr[:200]}"); sys.exit(1)
            for fpath in sorted(glob.glob(str(CLIP / "Input" / "*.png"))):
                shutil.copy(fpath, png4k / Path(fpath).name)
            ins = sorted(glob.glob(str(CLIP / "Input" / "*.png")))
            with Pool(6) as p:
                p.map(hint_one, [(i, str(CLIP / "AlphaHint" / Path(i).name)) for i in ins])
            r = run(["uv", "run", "corridorkey", "--device", "mps", "run-inference",
                     "--screen-color", "green", "--srgb", "--despill", "6",
                     "--despeckle", "--despeckle-size", "6", "--no-comp", "--gpu-post",
                     "--tile", "--image-size", "1024", "--refiner", "1.0"], cwd=str(CK))
            exrs = sorted(glob.glob(str(CLIP / "Output" / "Processed" / "*.exr")))
            if len(exrs) != c:
                log(f"{sp['span']}: EXR count {len(exrs)} != {c}; stderr: {r.stderr[-300:]}"); sys.exit(1)
            jobs = [(e, str(png4k / (Path(e).stem + ".png")), str(fin / (Path(e).stem + ".png"))) for e in exrs]
            with Pool(5) as p:
                p.map(convert_one, jobs)
            for f in glob.glob(str(png4k / "*.png")): os.remove(f)
            shutil.rmtree(CLIP)
            done += c
            log(f"{sp['span']}: {done}/{n}")
        shutil.rmtree(stage)
        log(f"{sp['span']}: DONE -> plates-seq-hq/{sp['span']} ({len(os.listdir(fin))} frames)")
    log("BATCH COMPLETE")

if __name__ == "__main__":
    main()
