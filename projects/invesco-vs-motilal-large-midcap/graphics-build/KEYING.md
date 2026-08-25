# Keying + composite recipe (proven on test plates 2026-08-16)

The §4 pipeline for every creator frame in this job. Verified: hair-strand edge with zero green fringe over both white and near-black (QC crops in `remotion/out/qc/`).

## The plate

- Source: `assets/reference-basecut.mp4` — creator's own base cut, 3840×2160 25fps, UNKEYED green screen.
- Plate green is uneven: #315222 (BL) → #7AAA5F (TR), but hue is tight: 91–100°, sat .45–.61, val .32–.67.
- Plain `chromakey`/`hsvkey` FAIL on this plate (chroma of dark green ≈ neutral → similarity wide enough to catch it eats skin). Do not ship an ffmpeg-only key.

## The pipeline (CorridorKey neural key, MLX on this Mac)

Engine: `~/tools/CorridorKey` (cloned 2026-08-16, weights in `CorridorKeyModule/checkpoints/CorridorKey.pth`).

1. **Hint mattes** (per frame): hue-band matte in numpy — bg = hue∈(82,110) ∧ sat>0.28 ∧ val>0.10; invert; erode 17px; blur 7px. (Erode, never dilate — the model adds edge detail, it does not subtract.) Script: `graphics-build/align_script.py`'s sibling logic lives in the session log; rebuild from this spec.
2. **Layout**: `ClipsForInference/<shot>/Input/*.png` + `AlphaHint/*.png` (flat, no subfolders — frame counts must match).
3. **Run**: `uv run corridorkey --device mps run-inference --screen-color green --srgb --despill 6 --despeckle --despeckle-size 12 --comp --gpu-post --tile --image-size 2048 --refiner 1.0` (every flag matters: any omitted one prompts interactively and aborts a background run). ~82s/4K frame on this Mac.
4. **Output**: `Output/{FG,Matte,Processed}/*.exr` — use **Processed** (despilled, straight RGBA, linear float32).
5. **To PNG for Remotion stills**: linear→sRGB transfer + alpha to 8-bit (see the conversion snippet in the session; straight alpha preserved).
6. **For the full video**: key frame sequences per scene (only frames where the creator is on screen at composite time), keep EXRs for the composite render; re-keys always come off the source plate.

## The composite stack (bottom → top)

1. Generated background — `remotion/public/assets/bg-home-left.png` (data frames; clean lit wall right ⅔) or `bg-home-center.png` (centered emphasis frames). Both generated via Kie nano-banana, 4K upscaled, pre-blurred. Prompts in `broll/manifest` TODO.
2. Keyed creator plate (Processed, straight alpha).
3. Feathered black gradient (bottom-up, §3.4) — in front of creator, behind text.
4. Text / motion graphics.
5. Chrome: supplied Intelligent Investors badge TL (`assets/logos/intelligent-investors-badge.png`), Groww mark+wordmark TR (mark extracted from official Brand Guidelines PDF), mark watermark BR. Always topmost.

## Colour match note

Plate is warm-lit; both backgrounds are warm cream — grade drift is small. Before final renders: match black level + temperature per §4.3 (compare creator shadow tones against bg; nudge with `colortemperature`/`curves`), and confirm on the watch-skill review pass.
