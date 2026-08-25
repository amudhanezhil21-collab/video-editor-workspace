#!/usr/bin/env python3
"""Re-key any span whose PNG sequence is missing/incomplete, straight to 1080p seq."""
import json, os, subprocess, sys, shutil, glob
from pathlib import Path
from multiprocessing import Pool

JOB = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(JOB / "graphics-build"))
from fast_key import key_one

A = Path("/Volumes/Extreme SSD/render-work")
q = json.load(open(JOB / "graphics-build/keying-queue.json"))

def main():
    need = []
    for sp in q["spans"]:
        d = A / "plates-seq" / sp["span"]
        got = len(os.listdir(d)) if d.is_dir() else 0
        if got < sp["frames"]:
            need.append(sp)
    print("re-keying:", [s["span"] for s in need], flush=True)
    for sp in need:
        s = sp["span"]; n = sp["frames"]; t0 = sp["f0"] / 25.0
        seq = A / "plates-seq" / s; raw = A / f"_raw_{s}"
        seq.mkdir(parents=True, exist_ok=True); raw.mkdir(exist_ok=True)
        done = 0
        while done < n:
            c = min(250, n - done)
            r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t0 + done/25.0:.3f}",
                                "-i", "/Volumes/Extreme SSD/render-work/basecut-source.mp4",
                                "-frames:v", str(c), "-vf", "scale=1920:1080",
                                "-start_number", str(done), str(raw / "f%05d.png")],
                               capture_output=True, text=True)
            if r.returncode: print("extract fail", r.stderr[:200]); sys.exit(1)
            frames = sorted(glob.glob(str(raw / "*.png")))
            with Pool(7) as p:
                p.map(key_one, [(f, str(seq / os.path.basename(f))) for f in frames])
            for f in frames: os.remove(f)
            done += c
        shutil.rmtree(raw)
        print(s, "DONE", len(os.listdir(seq)), "frames", flush=True)
    for f in glob.glob(str(A / "plates" / "*.mov")): os.remove(f)
    if (A / "plates").is_dir() and not os.listdir(A / "plates"): os.rmdir(A / "plates")
    print("ALL SEQS COMPLETE:", len(os.listdir(A / "plates-seq")))

if __name__ == "__main__":
    main()
