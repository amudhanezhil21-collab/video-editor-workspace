#!/usr/bin/env python3
"""
Finish: burn the captions on, mix the audio, encode the deliverable.

Order matters. Captions go on LAST of the visual layers — style.md puts them above the
transition/wipe layer and above the branding. Audio is a pure pass with the video stream copied.

Gates, both from the graphics skill, both cheap and both worth failing on:
  * decode check before compositing anything — a half-written ProRes fails halfway through
  * DUPLICATE-FRAME count on the finished render. Chaining short overlays over a long base makes
    the frame scheduler duplicate output frames on a periodic cadence: dead-even CFR so every tool
    reports it as fine, but the content only changes ~18 times a second wearing a 25fps costume.
    Clean is under 3%; the bug is ~25%. Fail above 8%.
"""
import json, os, subprocess, sys

JOB = "/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps"
OUT = "/Volumes/vedev/smallcap-250-index-hidden-midcaps/remotion/out"
WORK = f"{JOB}/graphics-build/work"
FPS, TOTAL = 25, 2231


def decodes(p):
    return os.path.exists(p) and subprocess.run(
        ["ffmpeg", "-v", "error", "-i", p, "-frames:v", "3", "-f", "null", "-"],
        capture_output=True).returncode == 0


def dup_pct(p):
    """Exactly-duplicate frames, as a share of the total."""
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p,
                        "-vf", "scale=240:426,mpdecimate=hi=64*12:lo=64*5:frac=0.33",
                        "-f", "null", "-"], capture_output=True, text=True)
    kept = r.stderr.count("drop_count")
    r2 = subprocess.run(["ffmpeg", "-v", "info", "-i", p,
                         "-vf", "scale=240:426,mpdecimate", "-f", "null", "-"],
                        capture_output=True, text=True)
    import re
    m = re.findall(r"drop_count:\s*(\d+)", r2.stderr)
    dropped = int(m[-1]) if m else 0
    return 100.0 * dropped / TOTAL


def run(cmd, label):
    print(f"\n{label}")
    if subprocess.run(cmd).returncode != 0:
        print(f"{label} FAILED"); sys.exit(1)


if __name__ == "__main__":
    p2, caps = f"{WORK}/p2.mov", f"{OUT}/captions.mov"
    for p in (p2, caps):
        if not decodes(p):
            print(f"input does not decode (still being written?): {p}"); sys.exit(1)

    # ---- pass 3: captions, topmost -----------------------------------------------------------
    p3 = f"{WORK}/p3.mov"
    fc = (f"[0:v]fps={FPS}[b];"
          f"[1:v]fps={FPS},format=yuva444p10le[c];"
          f"[b][c]overlay=eof_action=pass:shortest=0[vout]")
    run(["ffmpeg", "-y", "-v", "error", "-stats", "-i", p2, "-i", caps,
         "-filter_complex", fc, "-map", "[vout]", "-an",
         "-c:v", "prores_ks", "-profile:v", "3", p3], "PASS 3 — captions")

    # ---- pass 4: audio (video stream COPIED) --------------------------------------------------
    p4 = f"{WORK}/p4-audio.mov"
    run([sys.executable,
         "/Users/ezhilamudhan/Desktop/video-editor/projects/smallcap-250-index-hidden-midcaps/"
         "graphics-build/mix_audio.py", p3, p4], "PASS 4 — audio")

    # ---- gate ---------------------------------------------------------------------------------
    d = dup_pct(p4)
    print(f"\nduplicate frames: {d:.2f}%  (clean < 3%, the frame-scheduler bug is ~25%)")
    if d > 8.0:
        print("FAIL — above the 8% gate. Do NOT mask this by forcing a frame rate; the output is "
              "already CFR. Find the overlay whose eof_action is repeating.")
        sys.exit(1)

    # ---- deliverable --------------------------------------------------------------------------
    os.makedirs(f"{JOB}/outputs", exist_ok=True)
    final = f"{JOB}/outputs/smallcap-250-index-hidden-midcaps-draft1.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-stats", "-i", p4,
         "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
         "-profile:v", "high", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", final], "DELIVERABLE")
    sz = os.path.getsize(final) / 1e6
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", final], capture_output=True, text=True).stdout.strip()
    print(f"\n-> {final}\n   {sz:.1f} MB   {dur}s")
