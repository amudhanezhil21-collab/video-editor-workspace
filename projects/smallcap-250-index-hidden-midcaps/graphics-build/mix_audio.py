#!/usr/bin/env python3
"""
Audio for smallcap-250-index-hidden-midcaps: VO + music bed + a handful of SFX.

finishing-pass skill:
  * music is a FLAT bed, no ducking, no fade in, a short fade out on the tail
  * SFX are sparse REAL samples, never a synthesised tone; if there is no sample, SKIP the cue
  * this is a PURE AUDIO PASS — the video stream is copied, never re-encoded
  * write the plan out so a later graphics change re-applies the same placements

Measured levels (ffmpeg loudnorm, 2026-08-23):
  VO   -26.85 LUFS / -5.93 dBTP      music -13.28 LUFS      creator leak -21.05 LUFS
Targets: VO to ~-15.5 LUFS, music ~18 dB under it, SFX ~10 dB under it.
Gain is applied as a fixed `volume` then one `alimiter` on the sum — a single dynamic loudnorm
pass resamples and pads, which desyncs the mux.
"""
import json, os, subprocess, sys

JOB = "/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps"
FPS = 25

VO_GAIN = 12.40      # -26.85 -> -14.45 LUFS
MUS_GAIN = -19.10    # -13.28 -> -32.38 LUFS, i.e. ~18 dB under the VO
LEAK_GAIN = -4.50    # -21.05 -> -25.55 LUFS, ~10 dB under the VO
WHOOSH_GAIN = -5.10  # -20.38 -> -25.48 LUFS

LEAK = f"{JOB}/audio/sfx/transition-lightleak-creator.wav"   # the creator's OWN leak sound, 0.50s
WHOOSH = f"{JOB}/audio/sfx/lightleak-whoosh.mp3"

# frame -> seconds. The leak's transient should land ON the cut, which sits under the leak's
# one-frame white peak at leak-index 7.
CUES = [
    {"id": "leakA", "file": LEAK, "at": (366 - 7) / FPS, "gain": LEAK_GAIN,
     "why": "REF5 -> REF6, creator: 'A lightleak after sfx after it'"},
    {"id": "ref7-edit", "file": WHOOSH, "at": 662 / FPS - 0.15, "gain": WHOOSH_GAIN,
     "why": "REF7, creator: 'An sfx with edit after it' — lands on the cut out of the b-roll"},
    {"id": "leakB", "file": LEAK, "at": (1850 - 7) / FPS, "gain": LEAK_GAIN,
     "why": "REF15 -> REF16, creator: 'A light leak after it'"},
]

# NOT PLACED, deliberately. Creator asked for "an sfx of negative tone only at the time of galat"
# (the word 'galat' is at 80.65-80.85). There is no negative-tone sample in assets/sfx/, and both
# available generators returned unusable audio (Mirelo came back at -57 dBFS, effectively silence;
# seed_audio is a TTS model). The skill is explicit: skip rather than fabricate. Drop a real
# sample in and re-run to fill this.
SKIPPED = [{"id": "ref17-negative-tone", "at": 80.65,
            "why": "no real sample available; skipped rather than synthesised"},
           {"id": "leakC", "at": 81.60,
            "why": "the leak it belonged to was removed — that boundary has no shot change"}]


def main():
    video = sys.argv[1] if len(sys.argv) > 1 else f"{JOB}/graphics-build/work/p2.mov"
    dst = sys.argv[2] if len(sys.argv) > 2 else f"{JOB}/graphics-build/work/p3-audio.mov"

    ins = ["-i", video, "-i", f"{JOB}/raw/source.mp4", "-i", f"{JOB}/audio/music-bed-89s.wav"]
    fc = [f"[1:a]atrim=0:89.24,asetpts=N/SR/TB,volume={VO_GAIN}dB[vo]",
          f"[2:a]volume={MUS_GAIN}dB[mus]"]
    labels = ["[vo]", "[mus]"]
    for n, c in enumerate(CUES):
        ins += ["-i", c["file"]]
        idx = 3 + n
        fc.append(f"[{idx}:a]volume={c['gain']}dB,adelay={int(c['at']*1000)}:all=1[sfx{n}]")
        labels.append(f"[sfx{n}]")
    fc.append("".join(labels) + f"amix=inputs={len(labels)}:duration=first:normalize=0[mixed]")
    # one limiter on the SUM, ceiling -1 dBTP
    # ffmpeg's alimiter defaults to level=enabled, which AUTO-NORMALISES the output up to the
    # ceiling — so lowering `limit` made the mix LOUDER, not quieter (-14.66 -> -13.48 LUFS, true
    # peak +0.08 -> +0.17 dBTP). level=disabled makes it limit only, which is what a mix bus wants.
    fc.append("[mixed]alimiter=limit=0.85:level=disabled:attack=5:release=50,"
              "atrim=0:89.24,asetpts=N/SR/TB[aout]")

    cmd = (["ffmpeg", "-y", "-v", "error", "-stats"] + ins +
           ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[aout]",
            "-c:v", "copy", "-c:a", "pcm_s24le", dst])          # video COPIED, never re-encoded
    json.dump({"voGain": VO_GAIN, "musicGain": MUS_GAIN, "cues": CUES, "skipped": SKIPPED,
               "measured": {"vo_lufs": -26.85, "music_lufs": -13.28, "leak_lufs": -21.05}},
              open(f"{JOB}/audio/audio-plan.json", "w"), indent=1)
    print("cues:")
    for c in CUES:
        print(f"  {c['id']:10s} @{c['at']:6.2f}s  {c['gain']:+.1f}dB   {c['why']}")
    for s in SKIPPED:
        print(f"  SKIPPED {s['id']} @{s['at']:.2f}s — {s['why']}")
    r = subprocess.run(cmd)
    if r.returncode != 0:
        sys.exit(1)
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", dst, "-map", "0:a",
                          "-af", "loudnorm=print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    for line in out.splitlines():
        if '"input_i"' in line or '"input_tp"' in line:
            print("  final mix", line.strip())
    print(f"-> {dst}")


if __name__ == "__main__":
    main()
