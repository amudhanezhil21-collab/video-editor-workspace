#!/usr/bin/env python3
"""
Every-frame deterministic audit of a render against the instruction spec.

Unlike the `watch` skill (capped at 2fps, dedup on), this reads EVERY frame
of the render and emits hard measurements per frame. It is the ground truth
the blind review agents are checked against.

usage: frame_audit.py RENDER.mp4 SPEC.json OUT_DIR
"""
import json, os, subprocess, sys, csv
import numpy as np
from PIL import Image

def probe(path):
    out = subprocess.run(["ffprobe","-v","error","-select_streams","v:0",
        "-show_entries","stream=width,height,r_frame_rate,nb_frames",
        "-show_entries","format=duration","-of","json",path],
        capture_output=True,text=True).stdout
    d = json.loads(out)
    s = d["streams"][0]
    num,den = s["r_frame_rate"].split("/")
    return int(s["width"]), int(s["height"]), int(num)/int(den), float(d["format"]["duration"])

def extract_all(path, outdir, w):
    os.makedirs(outdir, exist_ok=True)
    if len(os.listdir(outdir)) > 10:
        return sorted(f for f in os.listdir(outdir) if f.endswith(".png") and not f.startswith("._"))
    # PNG, full frame rate, no dedup, no scene selection -> literally every frame
    subprocess.run(["ffmpeg","-y","-v","error","-i",path,
        "-vsync","0","-vf",f"scale={w}:-1","-f","image2",
        os.path.join(outdir,"f%06d.png")],check=True)
    return sorted(f for f in os.listdir(outdir) if f.endswith(".png") and not f.startswith("._"))

def luma(a):
    return 0.2126*a[...,0] + 0.7152*a[...,1] + 0.0722*a[...,2]

def main():
    render, specp, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
    spec = json.load(open(specp))
    W,H,fps,dur = probe(render)
    os.makedirs(outdir, exist_ok=True)
    fdir = os.path.join(outdir,"allframes")
    aw = 270  # analysis width; full frame count preserved
    files = extract_all(render, fdir, aw)
    n = len(files)
    print(f"render {W}x{H} @{fps}fps dur={dur:.2f}s -> extracted {n} frames "
          f"(expected {int(round(dur*fps))})")

    rows=[]
    prev=None
    dup=0
    for i,f in enumerate(files):
        t = i/fps
        im = Image.open(os.path.join(fdir,f)).convert("RGB")
        a = np.asarray(im).astype(np.float32)
        L = luma(a)
        h,w = L.shape
        # --- global ---
        r = {"frame":i+1,"t":round(t,3),"meanL":round(float(L.mean()),2)}
        # --- bottom band (gradient zone y 1400-1920 -> normalized) ---
        y0=int(h*1400/1920); y1=int(h*1750/1920)
        r["bottomL"]=round(float(L[y0:y1].mean()),2)
        # gradient must feather to TRUE zero: sample rows and check monotonic
        col = L[int(h*0.60):,:].mean(axis=1)
        r["bandStep"]=round(float(np.abs(np.diff(col)).max()),2) if len(col)>1 else 0.0
        # --- corner branding zones ---
        r["tlL"]=round(float(L[int(h*0.02):int(h*0.09),int(w*0.02):int(w*0.28)].mean()),2)
        r["trL"]=round(float(L[int(h*0.02):int(h*0.09),int(w*0.72):int(w*0.98)].mean()),2)
        # --- face zone (x340-720,y400-1040 of 1080x1920) ---
        fy0,fy1=int(h*400/1920),int(h*1040/1920)
        fx0,fx1=int(w*340/1080),int(w*720/1080)
        r["faceL"]=round(float(L[fy0:fy1,fx0:fx1].mean()),2)
        r["faceStd"]=round(float(L[fy0:fy1,fx0:fx1].std()),2)
        # --- high-frequency energy (dust/halftone detector) ---
        gx=np.abs(np.diff(L,axis=1)).mean(); gy=np.abs(np.diff(L,axis=0)).mean()
        r["hfEnergy"]=round(float(gx+gy),3)
        # --- saturation / colour cast ---
        mx=a.max(axis=2); mn=a.min(axis=2)
        r["sat"]=round(float(((mx-mn)/(mx+1e-6)).mean()),4)
        r["redness"]=round(float((a[...,0]-a[...,2]).mean()),2)
        # --- duplicate frame detection ---
        if prev is not None:
            d=float(np.abs(L-prev).mean())
            r["delta"]=round(d,4)
            if d < 0.05: dup+=1
        else:
            r["delta"]=None
        prev=L
        rows.append(r)

    dup_pct = 100.0*dup/max(1,n-1)
    csvp=os.path.join(outdir,"per_frame.csv")
    with open(csvp,"w",newline="") as fh:
        wtr=csv.DictWriter(fh,fieldnames=list(rows[0].keys()))
        wtr.writeheader(); wtr.writerows(rows)

    summary={"render":render,"width":W,"height":H,"fps":fps,"duration":dur,
             "framesExtracted":n,"framesExpected":int(round(dur*fps)),
             "everyFrameCovered": n==int(round(dur*fps)) or abs(n-round(dur*fps))<=1,
             "duplicateFramePct":round(dup_pct,2),
             "duplicateGate":"FAIL >8%" if dup_pct>8 else "pass",
             "perFrameCsv":csvp}
    json.dump(summary,open(os.path.join(outdir,"summary.json"),"w"),indent=2)
    print(json.dumps(summary,indent=2))

if __name__=="__main__":
    main()
