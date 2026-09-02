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
        # -fps_mode passthrough keeps a strict 1:1 mapping (ffmpeg 9 removed -vsync)
        run("ffmpeg","-y","-v","error","-i",render,"-fps_mode","passthrough","-q:v","3",
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
            "-frames:v","1","-q:v","3","-fps_mode","passthrough", out)
    made=len([f for f in os.listdir(sh) if f.endswith('.jpg') and not f.startswith('._')])
    print(f"contact sheets: {made} (50 frames each; every one of {n} frames appears on exactly one sheet)")

    cuts = json.load(open(cutsheet))
    cuts = cuts["beats"] if isinstance(cuts, dict) else cuts

    # THE OFFSET. Cutsheet times are BODY times; the deliverable has a disclaimer card in front, so
    # its clock is shifted. Stamping body times onto final-render stills hands reviewers frames from
    # 3 seconds earlier than the beat they are being asked about — they then describe the wrong
    # graphic, "confirm" defects that are not there, and miss the ones that are. Nothing about the
    # output looks wrong, which is what makes it dangerous.
    #
    # So it is required, not defaulted. Derived from the pipeline's concat manifest when available.
    off = None
    for a in sys.argv[4:]:
        if a.startswith("--offset="):
            off = float(a.split("=", 1)[1])
    if off is None:
        man = os.path.join(os.path.dirname(render), "concat.txt")
        if not os.path.exists(man):
            man = os.path.join(os.path.dirname(os.path.dirname(render)), "render", "concat.txt")
        if os.path.exists(man):
            parts, body_i = [], None
            for line in open(man):
                if line.strip().startswith("file "):
                    p = line.strip()[5:].strip().strip("'\"")
                    if "body" in os.path.basename(p):
                        body_i = len(parts)
                    parts.append(p)
            if body_i is not None:
                off = sum(float(subprocess.run(["ffprobe","-v","error","-show_entries",
                          "format=duration","-of","csv=p=0",p], capture_output=True,
                          text=True).stdout or 0) for p in parts[:body_i])
                print(f"head offset: {off:.2f}s (derived from {os.path.basename(man)})")
    if off is None:
        sys.exit("ABORT: cannot determine the head offset (no concat.txt found). Pass "
                 "--offset=SECONDS. Refusing to default to 0: cutsheet times stamped onto a "
                 "render that has a disclaimer in front point at the wrong beats, silently.")
    if off:
        # Cheap sanity check the reviewer can see: the offset must not push past the file.
        span = max(c["end"] for c in cuts)
        rlen = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                     "-of","csv=p=0",render], capture_output=True, text=True).stdout or 0)
        if span + off > rlen + 0.5:
            sys.exit(f"ABORT: cutsheet ends at {span:.1f}s + offset {off:.1f}s = "
                     f"{span+off:.1f}s, past the render's {rlen:.1f}s. Wrong file or wrong offset.")

    marks=[]
    for c in cuts:
        ref = c.get("ref", c.get("id"))
        marks += [(f"REF{ref}-in", c["start"]+0.06), (f"REF{ref}-mid", (c["start"]+c["end"])/2),
                  (f"REF{ref}-out", max(c["start"], c["end"]-0.10))]
    for tag,t in marks:
        # filename carries the BODY time (what the cutsheet and the instructions speak in) so a
        # reviewer's finding maps straight back to a beat; the seek uses the shifted render time.
        run("ffmpeg","-y","-v","error","-ss",f"{t+off:.3f}","-i",render,"-frames:v","1","-q:v","2",
            os.path.join(bd,f"{tag}_t{t:.2f}.jpg"))
    print(f"boundary stills: {len(marks)} at full resolution "
          f"(filenames are BODY time; seeks shifted by {off:.2f}s)")

if __name__ == "__main__":
    main()
