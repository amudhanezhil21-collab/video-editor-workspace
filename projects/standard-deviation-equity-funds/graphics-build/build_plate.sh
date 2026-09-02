#!/bin/bash
# Base plate: her cut + the three instructed zooms (B1 slow, B6 rapid, B12 rapid).
# Style rules honoured:
#  - zooms are FFmpeg geometry, never a browser (3% luma cost)
#  - each mid-video slice is trimmed INSIDE the filtergraph with setpts reset, so the
#    zoompan frame counter starts at 0 (the constant-zoom trap)
#  - a ramp never snaps back mid-take: every zoom HOLDS its reached scale until a beat
#    that replaces the footage (B2 b-roll at 10.62 / B7 table at 56.57 / B14 takeover at 126.04)
#  - supersample 2x before zoompan, per the graphics skill
set -euo pipefail
cd "$(dirname "$0")/.."
Z='scale=2160:3840:flags=lanczos'
zp() { # $1 ramp frames  $2 target zoom
  echo "zoompan=z='1+($2-1)*(1-pow(1-min(in/$1\,1)\,3))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30"
}
ffmpeg -y -v error -i raw/standard-deviation.mp4 -filter_complex "
[0:v]trim=start_frame=0:end_frame=17,setpts=PTS-STARTPTS[p0];
[0:v]trim=start_frame=17:end_frame=319,setpts=PTS-STARTPTS,$Z,$(zp 106 1.08)[z1];
[0:v]trim=start_frame=319:end_frame=1403,setpts=PTS-STARTPTS[p1];
[0:v]trim=start_frame=1403:end_frame=1697,setpts=PTS-STARTPTS,$Z,$(zp 18 1.12)[z2];
[0:v]trim=start_frame=1697:end_frame=3377,setpts=PTS-STARTPTS[p2];
[0:v]trim=start_frame=3377:end_frame=3781,setpts=PTS-STARTPTS,$Z,$(zp 18 1.12)[z3];
[0:v]trim=start_frame=3781,setpts=PTS-STARTPTS[p3];
[p0][z1][p1][z2][p2][z3][p3]concat=n=7:v=1:a=0,format=yuv420p[v]
" -map "[v]" -map 0:a -c:v libx264 -crf 12 -preset medium -color_primaries bt709 -color_trc bt709 -colorspace bt709 -c:a copy graphics-build/work/base-plate.mp4
