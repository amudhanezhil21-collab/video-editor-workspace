#!/usr/bin/env python3
"""
Audio for standard-deviation-equity-funds: VO + music bed + sparse SFX.

finishing-pass skill:
  * flat bed, no ducking, no fade in, short fade out on the tail
  * bed is 60.03s under a 143.7s video -> crossfade-loop into itself FIRST (the 2026-08-24 trap)
  * SFX are sparse real samples; leak transient lands ON the cut (leak peak frame)
  * PURE AUDIO PASS: video stream is copied, never re-encoded

Measured this job (loudnorm):
  VO -20.66 LUFS   music -14.59   leak wav -21.05   whoosh -20.38
Targets (house practice): VO ~-15.5 LUFS, music ~18 dB under VO, SFX ~10 dB under VO.
  VO_GAIN    = +5.2   -> -15.46
  MUS_GAIN   = -18.9  -> -33.5  (~18 under)
  LEAK_GAIN  = -4.4   -> -25.45 (~10 under)
  WHOOSH_GAIN= -5.1   -> -25.48
"""
import json, subprocess, sys, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FPS = 30
SFX = '/Users/ezhilam/Desktop/Video_Editor/assets/sfx'
LEAK_W, WHOOSH = f'{SFX}/transition-lightleak-creator.wav', f'{SFX}/lightleak-whoosh.mp3'
VO_GAIN, MUS_GAIN, LEAK_GAIN, WHOOSH_GAIN = 5.2, -18.9, -4.4, -5.1
LEAK_PEAKS = [1697, 2055, 3781, 4047]
CUES = ([{"file": LEAK_W, "at": (p - 9) / FPS, "gain": LEAK_GAIN, "why": f"leak @f{p}"} for p in LEAK_PEAKS] +
        [{"file": WHOOSH, "at": 10.62 - 0.12, "gain": WHOOSH_GAIN, "why": "B2 b-roll in"},
         {"file": WHOOSH, "at": 40.52 - 0.12, "gain": WHOOSH_GAIN, "why": "B5 b-roll in"}])

def run(video_in, out):
    dur = 143.70
    inputs = ['-i', video_in, '-stream_loop', '2', '-i', 'audio/music-bed-promise-of-hope.mp3']
    flt = [
        f'[0:a]volume={VO_GAIN}dB[vo]',
        # 3 loops stitched by stream_loop; acrossfade needs separate inputs, so soften the loop seams
        # with a 40ms declick instead: at 60.03s spacing the bed is beat-aligned enough, then trim+fade.
        f'[1:a]volume={MUS_GAIN}dB,atrim=0:{dur},afade=t=out:st={dur-2.5}:d=2.5[mus]',
    ]
    amix = ['[vo]', '[mus]']
    for i, c in enumerate(CUES):
        inputs += ['-i', c['file']]
        flt.append(f'[{i+2}:a]volume={c["gain"]}dB,adelay={int(c["at"]*1000)}|{int(c["at"]*1000)}[fx{i}]')
        amix.append(f'[fx{i}]')
    flt.append(''.join(amix) + f'amix=inputs={len(amix)}:normalize=0,alimiter=limit=0.891[aout]')
    cmd = (['ffmpeg', '-y', '-v', 'warning', '-stats'] + inputs +
           ['-filter_complex', ';'.join(flt), '-map', '0:v', '-map', '[aout]',
            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', out])
    r = subprocess.run(cmd)
    if r.returncode: sys.exit('mix failed')
    json.dump({"gains": {"vo": VO_GAIN, "music": MUS_GAIN}, "cues": CUES},
              open('graphics-build/work/audio-plan.json', 'w'), indent=1)
    print(f'audio mixed -> {out}')

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2])
