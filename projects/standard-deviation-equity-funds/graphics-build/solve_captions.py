#!/usr/bin/env python3
"""
Solve caption Y placement by MEASUREMENT against the draft composite, never by eye.

Ladder logic per finishing-pass skill:
  occupancy = local edge energy per candidate band (gradient ground doesn't collide, content does)
  per group: walk candidate Y values top-of-ladder-last, take first that clears
  graphics + the PER-BEAT face box + safe zones; else least-overlap; else suppress.

Per-beat face boxes on THIS job:
  default measured box (139,560,953,1401)
  zoomed 1.12 during Z2/Z3 holds (B6 window, and B12->B13 window)  -> (91,512,1003,1454)
  takeovers/tables/b-roll: no face (B2,B3,B4,B5,B7,B8*,B14)  *B7/B8 face lives in the mask rect
  B7/B8: mask rect (363,152,691,552) is the no-go, plus the card (122,618,954,1408)
  B11 sync-slide: she is scaled to the lower 65% -> face box approx (200,860,880,1700); top panel is content
"""
import json, subprocess, sys, os
import numpy as np
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FPS=30
DRAFT='graphics-build/work/draft1.mp4'
GROUPS=json.load(open('transcript/caption-groups.json'))['groups']
CHIP_H=86           # measured chip height at fs50 + padding
LADDER=[1500, 1560, 1370, 1240, 320, 240]   # default band first, then alternates
SAFE_TOP, SAFE_BOT = 200, 1670

DEF=(139,560,953,1401); Z=(91,512,1003,1454); NONE=(0,0,0,0)
def face_for(t):
    if 10.62<=t<17.95 or 17.95<=t<40.52 or 40.52<=t<45.98 or 126.04<=t<134.91: return NONE
    if 56.57<=t<68.50: return (363,152,691,552)
    if 46.76<=t<56.57 or 112.57<=t<126.04: return Z
    if 102.64<=t<111.83: return (200,860,880,1700)
    return DEF
def extra_content(t):
    boxes=[]
    if 56.57<=t<68.50: boxes.append((122,618,954,1408))       # ref13 card
    if 102.64<=t<111.83: boxes.append((0,200,1080,700))       # B11 top panel band
    if 0.20<=t<4.20: boxes.append((78,1496,740,1640))         # SEBI box
    if 134.91<=t: boxes.append((90,1330,990,1710))            # outro panel band
    return boxes

def grab_edges(t):
    r=subprocess.run(['ffmpeg','-v','error','-ss',f'{t:.3f}','-i',DRAFT,'-frames:v','1',
                      '-vf','scale=270:480,edgedetect=low=0.08:high=0.16','-f','rawvideo','-pix_fmt','gray','-'],
                     capture_output=True)
    a=np.frombuffer(r.stdout,dtype=np.uint8)
    if len(a)<270*480: return None
    return a.reshape(480,270).astype(np.float32)/255.0

def band_energy(edges,y):
    y0=int(y/4); y1=int((y+CHIP_H)/4)
    return float(edges[max(0,y0):y1, 17:250].mean())   # centre 940px of the frame

def overlaps(y,box):
    if box==NONE: return False
    x0,y0,x1,y1=box
    return not (y+CHIP_H<y0 or y>y1) and x1>70 and x0<1010

def solve():
    out=[]; suppressed=0
    for g in GROUPS:
        tmid=(g['start']+g['end'])/2
        edges=grab_edges(tmid)
        face=face_for(tmid); extras=extra_content(tmid)
        best=None; least=None; least_e=9e9
        for y in LADDER:
            if y<SAFE_TOP or y+CHIP_H>SAFE_BOT: continue
            if overlaps(y,face): continue
            if any(overlaps(y,b) for b in extras): continue
            e=band_energy(edges,y) if edges is not None else 0.0
            if e<least_e: least_e, least = e, y
            if e<0.030: best=y; break
        y=best if best is not None else least
        if y is None: suppressed+=1; continue
        out.append({**g,'y':y})
    json.dump({'groups':out},open('graphics-build/remotion/src/caption-solved.json','w'),indent=1)
    print(f'solved {len(out)} groups ({suppressed} suppressed) -> caption-solved.json')

if __name__=='__main__': solve()
