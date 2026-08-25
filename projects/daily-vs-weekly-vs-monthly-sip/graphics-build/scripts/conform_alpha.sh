#!/bin/zsh
# PNG(RGBA) sequence @24 -> VP9 WebM with alpha @30, motion-interpolated.
# minterpolate DROPS alpha, so RGB and alpha are interpolated as two streams and re-merged.
# stretch = output_duration / source_duration (1.0 = no retime)
set -e
SEQ=$1; OUT=$2; STRETCH=$3; DUR=$4
ffmpeg -v error -y -framerate 24 -i "$SEQ/f_%05d.png" -filter_complex "\
[0:v]setpts=${STRETCH}*PTS,split=2[rgb][al];\
[rgb]format=rgb24,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1[r30];\
[al]alphaextract,format=gray,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1[a30];\
[r30][a30]alphamerge,trim=duration=${DUR},setpts=PTS-STARTPTS,format=yuva420p[v]" \
 -map "[v]" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 18 -row-mt 1 -an "$OUT"
