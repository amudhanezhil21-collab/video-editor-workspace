#!/usr/bin/env python3
"""Build the delivery audio track: VO + looped music bed + peak-aligned SFX cues.

Reads audio/sfx-cues.json. Peak-align: measure each SFX file's loudness-peak offset
once, then place the file at (t - peakOffset). Output: audio/final-mix.m4a (48k stereo).
"""
import json, subprocess, tempfile, os
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
WS = JOB.parents[1]
CUES = json.load(open(JOB / "audio/sfx-cues.json"))
VO = JOB / "graphics-build/remotion/public/assets/basecut-audio.m4a"
OUT = JOB / "audio/final-mix.m4a"
TOTAL = 842.36

def peak_offset(path):
    """Seconds from file start to its max-volume moment (cheap: astats per 0.1s window)."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-f", "lavfi",
         f"amovie='{path}',astats=metadata=1:reset=2500:length=0.05,ametadata=print:key=lavfi.astats.Overall.Peak_level",
         "-show_entries", "frame=pts_time:frame_tags=lavfi.astats.Overall.Peak_level",
         "-of", "csv=p=0"], capture_output=True, text=True)
    best_t, best_v = 0.0, -999.0
    for line in r.stdout.splitlines():
        parts = line.strip().split(",")
        if len(parts) == 2 and parts[1]:
            try:
                t, v = float(parts[0]), float(parts[1])
                if v > best_v: best_v, best_t = v, t
            except ValueError: pass
    return best_t

# cache peak offsets per file
peaks = {}
for c in CUES["cues"]:
    f = c["file"]
    if c["align"] == "peak" and f not in peaks:
        peaks[f] = peak_offset(str(WS / f))
print(f"peak offsets measured for {len(peaks)} files")

# build with a chain of amix batches (ffmpeg input limit safety): batch 30 cues
mus = CUES["music"]
work = tempfile.mkdtemp(prefix="mix_")
# 1. music bed: loop + trim + fade + gain
bed = os.path.join(work, "bed.m4a")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1",
                "-i", str(WS / mus["file"]), "-t", f"{mus['to'] - mus['from']:.3f}",
                "-af", f"volume={mus['gainDb']}dB,afade=t=in:d=1.5,afade=t=out:st={mus['to']-mus['from']-2.5:.2f}:d=2.5",
                "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "256k", bed], check=True)
# 2. SFX layers in batches
batches = [CUES["cues"][i:i+30] for i in range(0, len(CUES["cues"]), 30)]
layer_files = []
for bi, batch in enumerate(batches):
    args = ["ffmpeg", "-v", "error", "-y"]
    filters, labels = [], []
    for i, c in enumerate(batch):
        args += ["-i", str(WS / c["file"])]
        t = c["t"] - (peaks.get(c["file"], 0.0) if c["align"] == "peak" else 0.0)
        t = max(0.0, t)
        filters.append(f"[{i}:a]volume={c['gainDb']}dB,adelay={int(t*1000)}|{int(t*1000)}[s{i}]")
        labels.append(f"[s{i}]")
    filters.append(f"{''.join(labels)}amix=inputs={len(batch)}:normalize=0,apad=whole_dur={TOTAL}[out]")
    lf = os.path.join(work, f"layer{bi}.m4a")
    args += ["-filter_complex", ";".join(filters), "-map", "[out]",
             "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "256k", "-t", f"{TOTAL}", lf]
    subprocess.run(args, check=True)
    layer_files.append(lf)
    print(f"sfx layer {bi+1}/{len(batches)}")
# 3. final: VO (delayed by offset) + bed (delayed) + layers
args = ["ffmpeg", "-v", "error", "-y", "-i", str(VO), "-i", bed]
for lf in layer_files: args += ["-i", lf]
n = 2 + len(layer_files)
off_ms = int(CUES["deliveryOffset"] * 1000)
f = [f"[0:a]adelay={off_ms}|{off_ms}[vo]", f"[1:a]adelay={off_ms}|{off_ms}[bed]"]
ins = "[vo][bed]" + "".join(f"[{i}:a]" for i in range(2, n))
f.append(f"{ins}amix=inputs={n}:normalize=0:duration=longest,alimiter=limit=0.97,apad=whole_dur={TOTAL}[out]")
args += ["-filter_complex", ";".join(f), "-map", "[out]", "-ar", "48000",
         "-c:a", "aac", "-b:a", "320k", "-t", f"{TOTAL}", str(OUT)]
subprocess.run(args, check=True)
print(f"final mix -> {OUT} ({OUT.stat().st_size/1e6:.1f}MB)")
