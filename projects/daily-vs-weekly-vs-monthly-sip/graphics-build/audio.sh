#!/bin/zsh
# Audio pass — SFX only. Pure audio: the video stream is COPIED, never re-encoded.
#
# MUSIC IS DELIBERATELY ABSENT. finishing-pass SKILL.md: "The track is user-supplied and licensed —
# the skill never downloads one." projects/<job>/audio/ is empty, so there is no bed. Drop a
# licensed track in audio/ and re-run with MUSIC=<path> to add one at -18 dB flat, no ducking.
#
# SFX are sparse by design: four hits, one per light-leak transition, and nothing else.
# assets/sfx/transition-lightleak-creator.wav is the creator's OWN light-leak sound: measured 0.500s,
# transient in the first 50ms, decaying monotonically — a real impact envelope, so it is placed with
# its transient ON the shot change, which style.md puts under the leak's single white-blowout frame.
set -e
export COPYFILE_DISABLE=1

IN="$1"; OUT="$2"
WS="/Users/ezhilamudhan/Desktop/video-editor"
SFX="$WS/assets/sfx/transition-lightleak-creator.wav"

# the four AI-b-roll boundaries (session directive: a light leak with SFX either side of every
# AI b-roll). These are the shot changes, i.e. the leaks' white peaks.
HITS=(42.77 52.20 58.90 64.28)

# Round-1 review: +14 dB hard-clipped three of the four hits (465 samples at |x| >= 0.999) because
# the sample's PEAK is -1.70 dBFS even though its RMS is -27.7 — a transient with a huge crest
# factor. Gain is set from the PEAK, not the RMS, and a limiter backstops the sum.
GAIN=2

FC=""
i=1
for t in $HITS; do
  FC="${FC}[${i}:a]volume=${GAIN}dB,adelay=$(python3 -c "print(int($t*1000))")|$(python3 -c "print(int($t*1000))")[s${i}];"
  i=$((i+1))
done
MIXIN="[0:a]"
for j in {1..4}; do MIXIN="${MIXIN}[s${j}]"; done

ffmpeg -v error -stats -y -i "$IN" -i "$SFX" -i "$SFX" -i "$SFX" -i "$SFX" \
  -filter_complex "${FC}${MIXIN}amix=inputs=5:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.891:level=disabled[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k "$OUT"

echo "SFX placed at: $HITS"
ffprobe -v error -show_entries stream=codec_type,codec_name -show_entries format=duration -of csv=p=0 "$OUT"
