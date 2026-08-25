#!/usr/bin/env python3
"""
Prepare the evidence pack for the blind reviewers.

The `watch` skill caps at 2 fps and de-duplicates by default, so it alone can never show a
reviewer every frame of a 25fps video. This builds a pack that genuinely covers all of them:

  allframes/   every single frame, extracted at 1:1 frame count (no dedup, no scene selection)
  sheets/      contact sheets tiling EVERY frame in order, 50 per sheet, timestamped
  boundary/    full-resolution frames at every instruction boundary, where detail matters

usage: prep_review.py RENDER.mp4 OUTDIR CUTSHEET.json
"""
import json, os, subprocess, sys, math

def run(*a): subprocess.run(list(a), check=True)

def main():
    render, outdir, cutsheet = sys.argv[1], sys.argv[2], sys.argv[3]
    os.environ["COPYFILE_DISABLE"] = "1"
    fr = os.path.join(outdir, "allframes")
    sh = os.path.join(outdir, "sheets")
    bd = os.path.join(outdir, "boundary")
    for d in (fr, sh, bd): os.makedirs(d, exist_ok=True)

    n = int(subprocess.run(["ffprobe","-v","error","-select_streams","v:0",
        "-count_frames","-show_entries","stream=nb_read_frames","-of","csv=p=0",render],
        capture_output=True,text=True).stdout.strip())

    have = [f for f in os.listdir(fr) if f.endswith('.jpg') and not f.startswith('._')]
    if len(have) < n:
        # -vsync 0 keeps a strict 1:1 mapping: exactly one output image per input frame
        run("ffmpeg","-y","-v","error","-i",render,"-vsync","0","-q:v","3",
            "-vf","scale=360:-1", os.path.join(fr,"f%05d.jpg"))
    files = sorted(f for f in os.listdir(fr) if f.endswith('.jpg') and not f.startswith('._'))
    print(f"frames extracted: {len(files)} / {n} expected  -> "
          f"{'EVERY FRAME COVERED' if len(files)==n else 'MISMATCH'}")

    # Contact sheets built straight from the render with select+tile: exactly 50 consecutive
    # frames per sheet, every frame appearing on exactly one sheet, in order.
    per, cols, rows = 50, 10, 5
    sheets = math.ceil(n/per)
    for s in range(sheets):
        a, b = s*per, min(n, (s+1)*per) - 1
        out = os.path.join(sh, f"sheet{s:03d}_f{a+1:05d}-{b+1:05d}.jpg")
        if os.path.exists(out): continue
        run("ffmpeg","-y","-v","error","-i",render,
            "-vf", f"select='between(n\\,{a}\\,{b})',scale=180:-1,tile={cols}x{rows}:margin=6:padding=4",
            "-frames:v","1","-q:v","3","-vsync","0", out)
    made=len([f for f in os.listdir(sh) if f.endswith('.jpg') and not f.startswith('._')])
    print(f"contact sheets: {made} (50 frames each; every one of {n} frames appears on exactly one sheet)")

    cuts = json.load(open(cutsheet))
    marks=[]
    for c in cuts:
        marks += [("REF%d-in"%c["ref"], c["start"]+0.06), ("REF%d-mid"%c["ref"], (c["start"]+c["end"])/2),
                  ("REF%d-out"%c["ref"], max(c["start"], c["end"]-0.10))]
    for tag,t in marks:
        run("ffmpeg","-y","-v","error","-ss",f"{t:.3f}","-i",render,"-frames:v","1","-q:v","2",
            os.path.join(bd,f"{tag}_t{t:.2f}.jpg"))
    print(f"boundary stills: {len(marks)} at full resolution")

if __name__ == "__main__":
    main()
