# Shared build API — read before writing any component

Project: /Volumes/vedev/graphics-build/remotion   (case-sensitive APFS image; node_modules cannot live on the exFAT SSD)
Frame: 1080x1920, 25fps. Remotion 4.0.409 + @remotion/three + three 0.169 + @react-three/fiber 9.

## Render command (the browser executable is already pinned in remotion.config.ts)
    cd /Volumes/vedev/graphics-build/remotion
    npx remotion render <compositionId> /Volumes/vedev/graphics-build/out/<id>.mov \
      --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le

Use prores 4444 + yuva444p10le for OVERLAYS (transparent). Use `--codec=prores --prores-profile=hq`
for full-frame SEGMENTS (opaque, they replace the footage).

## Existing modules — import these, do not re-invent
- `../tokens`      -> `T` (brand colours), `FRAME`, `SAFE`, `FACE_BOX`
- `../fonts`       -> `loadFonts()`  — call it first in every comp
- `../components/BottomGradient`  -> `<BottomGradient coveragePct peak totalFrames />`
- `../components/CalloutChip`     -> `<CalloutChip text fontSize delay />`
- `../components/LightLeak`       -> the transition (already built, do not touch)

## Hard rules (from CLAUDE.md / brand.md / styles/groww-shorts/style.md)
1. **Colours come from `T` in ../tokens only.** Never hardcode a hex. If a spec quotes a sampled
   hex, map it to the nearest brand token and say so in a comment.
2. **The creator's face is never covered.** FACE_BOX = x330-730, y380-1100. Nothing overlaps it
   while she is on screen. Full-frame takeovers (face absent) are legal.
3. Safe zones: editorial content y200-1620. Top 200px and bottom 250px are background only.
4. **Every data graphic carries a `Source:` line directly beneath it.** Non-negotiable, finance channel.
5. Fonts: `InterTight` (400/500/600/700/800) for everything functional; `IvyPresto` (400/600) for
   display serif only. Loaded by `loadFonts()`. Never a system font.
6. **Every element carries a drop shadow.** On paper: hard offset (#53B091, ~12px right/14px down,
   zero blur) + 3px #14151A outline. On gradient/footage: soft black, down-right.
7. **Entrances get the effort** (0.3-0.5s, motion-blurred slam/zoom-settle/slide), then the card
   **holds DEAD STATIC** while the VO reads it. Exits are designed, not defaulted.
8. **Exactly one highlight event per graphic**, delayed and synced to the spoken word — never at entry.
9. Deterministic only: no `Math.random()`, no `Date.now()`, no timers. Everything comes off
   `useCurrentFrame()`. The renderer SEEKS to arbitrary frames.
10. Gradients feather to TRUE zero with a cosine falloff — never a linear ramp with a visible edge.

## Self-verification you MUST run before returning
Render your composition, then measure it with python3/PIL+numpy and report NUMBERS:
- alpha/geometry: element bounding boxes in px, confirm they clear FACE_BOX and the safe zones
- confirm no element extends above y=200 or below y=1670
- for text over footage, state the fill colour and its contrast ratio against the backdrop
Return the composition id, the output path, and your measurements.

## Scratch files — read this, it has bitten us

Your session scratchpad directory lives on the **INTERNAL drive**, which on this machine runs under
4GB free. Frame extractions fill it astonishingly fast: six agents dumping verification frames took
it from 3.1GB to 0.9GB in twenty minutes and nearly broke the renders.

**Put every temporary file — extracted frames, probe PNGs, wavs — under `/Volumes/vedev/tmp/<your-id>/`
and delete it when you are done.** Never use the scratchpad, `/tmp`, or the repo for frame dumps.
Extract at a reduced scale (`scale=270:-1`) unless you specifically need to read on-screen text.

## Two measurement mistakes that produce confident, wrong findings
1. **An overlay judged by absolute luma.** A dark gradient over dark footage looks like nothing, and
   dark footage with no gradient looks like a gradient. Difference the composite against the base.
2. **A camera move measured between two frames of the same clip.** Subject motion swamps a 4% zoom.
   Compare the render against the SOURCE at the same frame index instead.
