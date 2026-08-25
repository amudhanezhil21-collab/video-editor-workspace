#!/bin/zsh
# Assemble daily-vs-weekly-vs-monthly-sip.
#
# Layer order is the style file's, not convenience:
#   base reframe -> graphic overlays/segments -> DUST -> LIGHT LEAKS -> branding -> captions
# Light leaks sit ABOVE the graphics (under a full-frame takeover they are painted over and vanish)
# and below only branding and captions.
#
# Traps this script is written against (graphics SKILL.md):
#   - every overlay gets eof_action=pass; without it the frame scheduler starts duplicating output
#     frames on a periodic cadence at a dead-even CFR, which every tool reads as fine
#   - trim generously, gate precisely: `enable` defines the window, the parts carry 0.5s of tail
#   - the assemble is GATED on the duplicate-frame count and fails above 8%
set -e
export COPYFILE_DISABLE=1

WORK="/Volumes/Extreme SSD/video-editor-jobs/daily-vs-weekly-vs-monthly-sip"
R="/Volumes/vedev/graphics-build/dwm-sip/dwm/renders"
P="$WORK/plates"
OUT="${1:-$WORK/render/assembled.mov}"

# The dust/leak layers are IDENTITY outside their windows. The dust layer's neutral level measures
# 126 (not 128) after ffmpeg's colour conversion — measured, not assumed — so the blend uses 126 and
# is therefore an exact no-op everywhere outside the b-roll windows.
DUST_MID=126

ffmpeg -v error -stats -y \
 -i "$WORK/render/base-reframed.mov" \
 -i "$R/p2-coinbags.mov" -i "$R/sebi.mov"    -i "$R/p3-table.mov" \
 -i "$R/p4-broll.mov"    -i "$R/p5-lesson.mov" -i "$R/p6-broll.mov" \
 -i "$R/p7-outro.mov"    -i "$P/dust-layer.mkv" -i "$P/leak-layer.mp4" \
 -i "$R/chrome.mov"      -i "$R/captions.mov" \
 -filter_complex "\
[1:v]setpts=PTS+3.32/TB[o2];\
[2:v]setpts=PTS+0.00/TB[o3];\
[3:v]setpts=PTS+9.24/TB[o4];\
[4:v]setpts=PTS+42.77/TB[o5];\
[5:v]setpts=PTS+52.20/TB[o6];\
[6:v]setpts=PTS+58.90/TB[o7];\
[7:v]setpts=PTS+64.28/TB[o8];\
[10:v]setpts=PTS+0.00/TB[och];\
[11:v]setpts=PTS+0.00/TB[ocap];\
[0:v][o2]overlay=eof_action=pass:enable='between(t,3.32,7.18)'[a1];\
[a1][o3]overlay=eof_action=pass:enable='between(t,0,3.60)'[a2];\
[a2][o4]overlay=eof_action=pass:enable='between(t,9.24,43.00)'[a3];\
[a3][o5]overlay=eof_action=pass:enable='between(t,42.77,52.40)'[a4];\
[a4][o6]overlay=eof_action=pass:enable='between(t,52.20,59.10)'[a5];\
[a5][o7]overlay=eof_action=pass:enable='between(t,58.90,64.50)'[a6];\
[a6][o8]overlay=eof_action=pass:enable='between(t,64.28,70.70)'[a7];\
[a7]format=gbrp[a7f];[8:v]format=gbrp[dustf];\
[a7f][dustf]blend=all_expr='clip(A*(1+(B-${DUST_MID})/512),0,255)'[a8];\
[a8]format=gbrp[a8f];[9:v]format=gbrp[leakf];\
[a8f][leakf]blend=all_expr='(A+B-A*B/255)*(1-B/510)+B*B/510'[a9];\
[a9]format=yuva444p10le[a9f];\
[a9f][och]overlay=eof_action=pass[a10];\
[a10][ocap]overlay=eof_action=pass,format=yuv422p10le[v]" \
 -map "[v]" -map 0:a \
 -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le \
 -c:a aac -b:a 256k -t 70.68 \
 "$OUT"

echo
echo "=== GATE: duplicate frames (fail above 8%) ==="
TOTAL=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")
DUP=$(ffmpeg -v error -i "$OUT" -vf "mpdecimate=hi=64*12:lo=64*5:frac=0.33,metadata=print:file=-" -f null - 2>/dev/null | grep -c "lavfi.mpdecimate" || true)
python3 - "$TOTAL" "$DUP" <<'PY'
import sys
t,d=int(sys.argv[1]),int(sys.argv[2])
pct=100*d/max(t,1)
print(f"  {d} duplicate of {t} frames = {pct:.2f}%")
print("  PASS (clean is under 3%)" if pct<3 else ("  WARN" if pct<8 else "  FAIL"))
sys.exit(1 if pct>=8 else 0)
PY
echo "wrote $OUT"
