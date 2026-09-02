#!/usr/bin/env python3
"""
Post-render gates. Facts come from transcript/cutsheet.json.
1. beats-visible: OPAQUE beats MATCH their asset (diff<25); OVERLAYS DIFFER from base (diff>8).
   Unmeasurable = FAILURE, never a pass. (flexi-cap lesson: absence looks fine to reviewers.)
2. duplicate frames < 1%.
3. leak white peak: EXACTLY one frame > 240 mean luma per site.
"""
import json, subprocess, sys, os
import numpy as np
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FPS=30
RENDER=sys.argv[1] if len(sys.argv)>1 else 'graphics-build/work/draft1.mp4'
CUT=json.load(open('transcript/cutsheet.json'))
LEAK_PEAKS=[1697,2055,3781,4047]

def grab(path,t,w=160):
    r=subprocess.run(['ffmpeg','-v','error','-ss',f'{t:.3f}','-i',path,'-frames:v','1',
                      '-vf',f'scale={w}:-1','-f','rawvideo','-pix_fmt','gray','-'],capture_output=True)
    a=np.frombuffer(r.stdout,dtype=np.uint8)
    return a.astype(np.float32) if len(a) else None

fails=[]
for b in CUT['beats']:
    if 'asset' not in b: continue
    t=b['start']+0.6*(b['end']-b['start'])
    fr=grab(RENDER,t)
    if fr is None: fails.append(f"{b['id']}: could not grab render frame"); continue
    if b.get('how','replace')=='replace':
        # srcOffsetFrames: the composite may skip the head of the asset (cutsheet-owned fact)
        af=grab(b['asset'], t-b['start']+b.get('srcOffsetFrames',0)/30.0)
        if af is None: fails.append(f"{b['id']}: could not grab asset frame"); continue
        n=min(len(fr),len(af)); d=float(np.abs(fr[:n]-af[:n]).mean())
        ok=d<25
        print(f"  {b['id']:4} replace  diff-vs-asset {d:6.1f}  {'OK' if ok else 'LOST'}")
        if not ok: fails.append(f"{b['id']}: render does not match asset (diff {d:.1f})")
    else:
        bf=grab('graphics-build/work/base-plate.mp4',t)
        n=min(len(fr),len(bf)); diffmap=np.abs(fr[:n]-bf[:n])
        d=float(diffmap.mean())
        # a small overlay (e.g. an emphasis stamp) moves few pixels but moves them HARD:
        # accept either a broad mark or a strong localized one
        p99=float(np.percentile(diffmap,99.5))
        ok=d>8 or p99>60
        print(f"  {b['id']:4} overlay  diff-vs-base  {d:6.1f} p99.5 {p99:5.1f}  {'OK' if ok else 'ABSENT'}")
        if not ok: fails.append(f"{b['id']}: overlay left no mark (diff {d:.1f})")

# Duplicate gate over A-ROLL windows only: the channel's graphics hold DEAD STATIC by design,
# so global dup% is meaningless here. Any dup while her face is on camera is a real bug.
AROLL=[(0.58,10.60),(45.98,56.55),(69.34,96.62),(97.0,102.6),(112.57,116.39),(134.91,143.0)]
p=subprocess.Popen(['ffmpeg','-v','error','-i',RENDER,'-vf','scale=96:170','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
prev=None; dup=0; tot=0; n=0; total_frames=0
inwin=lambda t: any(a<=t<b for a,b in AROLL)
while True:
    b_=p.stdout.read(96*170)
    if len(b_)<96*170: break
    a=np.frombuffer(b_,dtype=np.uint8)
    t=n/30.0
    if prev is not None and inwin(t):
        tot+=1
        if np.array_equal(a,prev): dup+=1
    prev=a; n+=1
total_frames=n
p.wait()
pct=100*dup/max(tot,1)
print(f"  A-roll duplicate frames: {dup}/{tot} = {pct:.2f}%  {'OK' if pct<1.0 else 'FAIL'}")
if pct>=1.0: fails.append(f"A-roll duplicate frames {pct:.2f}%")
print(f"  total frames: {total_frames}  {'OK' if total_frames==4311 else 'FAIL (want 4311)'}")
if total_frames!=4311: fails.append(f"frame count {total_frames} != 4311")

for pk in LEAK_PEAKS:
    # exact frame indices: decode from zero and select by n (a float -ss seek lands +-1 frame
    # and produced phantom doubled/missing whites in an earlier run of this gate)
    # mid-band y560-1200: caption chips (which legally ride ABOVE leaks) never sit there,
    # so the white-flash measurement is not dragged down by a dark chip
    r=subprocess.run(['ffmpeg','-v','error','-i',RENDER,'-vf',
        f"select='between(n\\,{pk-2}\\,{pk+2})',crop=1080:640:0:560,scale=160:-1",'-fps_mode','passthrough','-frames:v','5',
        '-f','rawvideo','-pix_fmt','gray','-'],capture_output=True)
    a=np.frombuffer(r.stdout,dtype=np.uint8)
    per=len(a)//5 if len(a) else 0
    lum=[float(a[i*per:(i+1)*per].mean()) for i in range(5)] if per else [-1]*5
    # limited-range video white is Y'~235; the reference's single blowout frame = one frame at
    # video white, neighbours clearly below. (RGB ~251 in the style notes was a full-range figure.)
    over=[l for l in lum if l>=232]
    strict=lum[2]==max(lum) and all(l<=228 for i,l in enumerate(lum) if i!=2)
    ok=len(over)==1 and strict
    print(f"  leak @f{pk}: luma {[('%.0f'%l) for l in lum]} white-frames: {len(over)} single-peak: {strict} {'OK' if ok else 'FAIL'}")
    if not ok: fails.append(f"leak @f{pk}: white-frames {len(over)}, single-peak {strict}")

print()
if fails:
    print("FAIL:\n  "+"\n  ".join(fails)); sys.exit(2)
print("verify_render: ALL GATES PASS")
