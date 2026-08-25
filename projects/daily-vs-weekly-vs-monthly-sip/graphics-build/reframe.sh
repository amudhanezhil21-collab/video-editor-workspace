#!/bin/zsh
# Reframe the creator's cut. Her supplied framing measured 31.5% dead headroom with the head only
# 21.3% of frame height; this puts headroom at ~15.7% and the head at ~33.6%.
#
# Round-1 review: the REF7 "slow zoom in" delivered only +3.0% (interpupillary) and eased out into a
# plateau over the last 2s. The tail push is now 1.50 -> 1.88 on a near-linear ramp so it keeps
# moving to the final frame.
#
# Zooms are built in FFmpeg, never in the browser (a browser round-trip costs ~3% luma at the seam).
set -e
export COPYFILE_DISABLE=1
WORK="/Volumes/Extreme SSD/video-editor-jobs/daily-vs-weekly-vs-monthly-sip"
SRC="/Users/ezhilamudhan/Desktop/video-editor/projects/daily-vs-weekly-vs-monthly-sip/raw/source.mp4"

T="(on/30)"
# hook push 0 -> 3.32s, ease-out ; hold ; outro push 64.28 -> 70.67s, near-linear
PH="((${T})/3.32)"
PT="(((${T})-64.28)/6.39)"
Z="if(lt(${T},3.32), 1.40+0.20*(${PH}*(2-${PH})), if(lt(${T},64.28), 1.60, 1.60+0.28*pow(${PT},0.85)))"
# crop_x keeps her centred as the window tightens; crop_y keeps the top of her hair at y~300
X="2*( if(lt(${T},3.32), 170+44*${PH}, if(lt(${T},64.28), 214+10*(((${T})-3.32)/60.96), 224+62*pow(${PT},0.85))) )"
Y="2*( if(lt(${T},3.32), 397+15*${PH}, if(lt(${T},64.28), 412-8*(((${T})-3.32)/60.96), 404+34*pow(${PT},0.85))) )"

ffmpeg -v error -stats -y -i "$SRC" \
 -filter_complex "[0:v]scale=2160:3840:flags=lanczos,setsar=1,zoompan=z='${Z}':x='${X}':y='${Y}':d=1:s=1080x1920:fps=30[v]" \
 -map "[v]" -map 0:a \
 -c:v prores_ks -profile:v 2 -pix_fmt yuv422p10le -c:a aac -b:a 256k \
 "$WORK/render/base-reframed.mov"
