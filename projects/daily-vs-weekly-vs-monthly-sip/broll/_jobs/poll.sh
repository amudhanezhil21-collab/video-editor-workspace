#!/bin/zsh
cd "/Users/ezhilamudhan/Desktop/video-editor/projects/daily-vs-weekly-vs-monthly-sip"
for n in b4-three-people b6-thumbs-up b2-coin-bags b5-hourglass; do
  id=$(/opt/anaconda3/bin/python3 -c "import json;print(json.load(open('broll/_jobs/$n.json'))[0])")
  echo "=== $n  $id ==="
  higgsfield generate wait "$id" --timeout 25m --interval 10s 2>&1 | tail -6
done
