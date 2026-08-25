---
name: graphics
description: Decide which lines of the finished cut earn a graphic, then build each one as code with this machine's motion engine (Remotion preferred, HyperFrames as fallback) and composite over the base. Owns the graphics plan, the build system in graphics-build/, safe zones, and every Remotion/Three.js and HyperFrames render/composite gotcha. Use after the rough cut exists, or when a creator-supplied cut needs graphics.
---

# Skill 2: graphics

**Whole job:** decide which lines earn a graphic, then build each one.

This is the biggest skill and it has two halves that stay separate: **plan, then build.** Planning is a judgment problem. Building is an engineering problem. Mixing them produces a plan written to be easy to build, which is the wrong optimisation.

## The plan

Read three things before deciding a single beat:

1. The finished transcript from the rough cut.
2. Any comments left in the script document — pull them out with the document's XML, not a library.
3. The narration inside the B-roll clips (transcribed by the rough cut).

Then, for every beat, answer in order:

**Does this line even need a graphic? Default to no.** A graphic on every line is wrong. Plain beats give rhythm and let the face carry the moment. A beat earns a graphic when it is the hook, when it names something concrete and showable (a stat, a screenshot, a before/after), when it is a payoff worth emphasising, when it describes a process a picture would make instantly clearer, or when one was explicitly asked for. Leave connective tissue, transitions, asides, and emotional delivery plain — those land harder on the face alone.

**What kind?** Think in rich terms first, then flatten to the fixed set the build step can handle: **stat, card, screenshot, takeover, zoom, diagram, b-roll slot.** Reach for showing over telling. Screen recordings, screenshots, diagrams, and stats beat text cards almost every time. Reserve cards for the hook and the punchlines, and even then give them motion and a visual element rather than a wall of type.

**Where?** Short form explainer: graphics in the top half, face in the bottom. Short form raw: exactly one hook card and nothing else. Long form: full-frame takeovers, lower thirds, and no reframe at all.

**What exactly?** Write the actual creative direction: what is on screen, what the hierarchy is, what the hero element is, and critically what animates and in what order. Concrete enough that the build step is not guessing.

Write the plan as a machine-readable cut sheet — ID, window, kind, direction, notes per beat — plus a human-readable table for review. Beats with no graphic simply are not in the list.

**Validate with a script before the build step ever sees it:** required fields present, kind is one of the allowed values, start before end, sorted ascending, no overlaps, and the non-obvious rule: **consecutive beats must either abut exactly or leave a gap of more than a second.** A gap of a few tenths flashes raw un-graphiced footage for a fraction of a second during the composite and almost always means the plan meant to abut and did not.

**Local direction never silently overrides a style convention.** If a script comment says put the chip in the upper third and the style says chips sit under the chin, that is a conflict to flag, not a decision to make quietly. Following the more recent instruction is recency bias, not judgment.

## Safe zones

| Format | Frame | Keep key visuals inside |
|--------|-------|------------------------|
| Short form | 1080 × 1920 | y 200 to 1620. Top 200px and bottom 300px are background only. |
| Long form | 1920 × 1080 | Title safe, 10% margins. Keep the outro's right 40% clear for end screen cards. |

The short form bands are not a guideline. The platform UI, the username, the audio tag, and the progress bar all land there.

## The build

Generate compositions from a script — never hand-write HTML per graphic. A single build script in `graphics-build/` holds the shared CSS, the per-graphic markup, and the per-graphic animation, and emits one composition file per part plus a render script and an assemble script. That folder is the real progress on the job, so it lives in the project, not a temp directory.

Classify every part by one question: does it change the footage underneath, or float on top?

- **Overlay.** A card, a panel, a callout. Renders standalone to a transparent file and composites over the base at its timestamp.
- **Segment.** A takeover, a full-screen cutaway, anything that replaces the frame. Renders with its own slice of the base footage baked in, as an opaque file that covers the base for its window.

**The base rough cut is never re-rendered.** That is the whole point. Editing one graphic means regenerating one composition, re-rendering one part in seconds, and running one FFmpeg composite pass over everything. Lock parts one at a time.

## Non-negotiables

- **Graphics hold until the next part starts.** Never fade out early and leave dead air before the next.
- **The picture-in-picture enters once per graphics run.** Chain everything between entries. Bouncing between full frame and PiP and back is the single most amateur-looking thing an AI editor does. Hard cuts between card contents are fine. A full-screen bounce never is.
- **Continuous motion on any beat 20 seconds or longer.** A count-up that finishes at six seconds of a nineteen-second beat reads as a frozen frame for thirteen seconds. On any long beat, write out explicitly what is moving across its entire duration, not just at the entrance.
- **Real assets over recreations.** The actual logo, the actual screenshot, the actual chart, with a slow pan or push on it. Never a redrawn approximation.
- **Measure, do not estimate.** Pull the actual frame, measure the element's bounding box in pixels, then set the zoom from that measurement.
- **Check the tail of every clip, not just the start.** A retake seam leaves a bad frame right at the out point and nobody watches the last second.
- **Assets outlast their window.** Give every part about half a second of tail margin past its nominal end, so a slightly late composite boundary never exposes a missing asset.
- **Run an early spot review** with watch sub-agents after the first ten percent of the build, not just at the end. A wrong placement habit caught once is a fix. Caught at the end it is a rebuild.

## Remotion: the engine contract (preferred where installed)

React compositions in `graphics-build/remotion/`, rendered with `npx remotion render`. Everything
below was paid for in debugging time — read it before writing a composition.

### Setup traps
- **`node_modules` cannot live on an exFAT volume.** Create a case-sensitive APFS disk image on the
  SSD and put the whole project there: `hdiutil create -size 40g -type SPARSE -fs "Case-sensitive APFS" -volname vedev …`
  Keep the heavy media on the SSD and the project on the image.
- **React 19 needs `@react-three/fiber` v9.** v8 throws `createRenderer` errors against React 19.
- **Remotion's headless-shell download can extract empty** (you get `ABOUT` and `LICENSE` and no
  binary, then "No browser found for rendering frames"). Reuse a shell that is already on the
  machine and pin it in `remotion.config.ts` via `Config.setBrowserExecutable(...)` rather than
  fighting the download.

### Three.js inside Remotion
- **R3F's orthographic camera frustum is in PIXELS, not clip space.** A `planeGeometry args={[2,2]}`
  renders as a 2-pixel plane in the middle of a 1080×1920 canvas. Size the plane in pixels
  (`args={[1080,1920]}`), and remember screen (x,y) maps to world `(x-540, 960-y)`.
- **Use ONE full-frame `ThreeCanvas` and position objects in world space.** A sized canvas nested in
  an `AbsoluteFill` with `left/top` made R3F paint an opaque backdrop across the lower frame.
  Set `gl={{alpha:true, premultipliedAlpha:false}}` and clear alpha to 0 in `onCreated`.
- **Determinism is mandatory** — the renderer SEEKS to arbitrary frames. No `Math.random()`, no
  `Date.now()`, no timers. Derive everything from `useCurrentFrame()`; for per-object randomness use
  a hash of the object index.
- **Fragmenting artwork for a shatter: jitter the shared VERTEX GRID, not each triangle's corners.**
  Independently jittered corners leave visible cracks through the intact object before it breaks.
  Take UVs from the un-jittered cell so the texture still lines up across the seam.
- Load an SVG as a texture via an `Image` → canvas → `THREE.CanvasTexture`, wrapped in
  `delayRender()`/`continueRender()`.

### Sub-agent scratch discipline
The session scratchpad is on the **internal** drive. Verification frame-dumps from a handful of
parallel agents will fill it in minutes — on this machine six agents took it from 3.1GB to 0.9GB and
came close to failing every render. **Tell every sub-agent explicitly to write scratch to a directory
on the fast external volume and clean up after itself**, and to extract frames at reduced scale
unless it needs to read on-screen text. "Work on the SSD" is not enough; name the directory.

### Never re-dispatch a "stalled" agent without stopping it first
An agent that has not written to its transcript for hours may still be alive. Re-dispatching a
replacement produced two agents editing the same files concurrently, and the project was briefly left
non-compiling with duplicate exports. Kill the original explicitly (TaskStop) before starting a
replacement, or give the replacement a disjoint set of files.

### Verifying a Remotion render
- **`alphaextract` on ProRes 4444 misreports the alpha** — it returned a binarised map that claimed
  a smooth gradient was fully opaque. **Verify alpha with `npx remotion still … --image-format=png`**
  and read the PNG's real alpha channel. Only trust `alphaextract` after cross-checking once.
- Measure, don't eyeball: element bboxes in px, alpha inside the face box, alpha at a gradient's
  onset, contrast ratios. Report numbers.
- **Never judge a build from one frame.** A mid-build frame of a good graphic looks broken — a pie
  that is excellent at frame 170 looks like a single stray wedge at frame 60.

### Compositing Remotion overlays in FFmpeg
- **Light leaks and flashes composite ABOVE the graphic overlays**, below only branding/captions.
  Below them, a full-frame takeover paints straight over the leak and it vanishes.
- **A feathered panel must fade onto the layer you INTEND, not the one that happens to be behind.**
  Building a split-frame (graphic panel top, repositioned footage below) with the panel feathering to
  alpha 0 at row Y, and placing the footage starting AT row Y, produces a **double face**: through the
  fade you see the original un-repositioned footage, and below it the repositioned copy. The
  repositioned footage has to start ABOVE the panel's opaque limit so the entire feather band sits
  over it. Cheap check: sample a clean column (away from any type) down through the join — the luma
  should ramp continuously with no discontinuity, and there should be exactly one of her on screen.
- **`crop`'s `w`/`h` are evaluated ONCE at init** — they cannot animate a zoom. Use `zoompan`
  (supersample to 2× first, then `zoompan … :s=1080x1920:fps=25`, then check for stepping by
  measuring frame-to-frame deltas: a smooth ramp has zero near-static frames).
- **Gate every assemble on the duplicate-frame count** (see the FFmpeg traps below); a clean render
  measures well under 1%.

## HyperFrames: the engine contract

Pinned at `hyperframes@0.7.101` — always call it as `npx hyperframes@0.7.101 ...`, never `@latest`. Every graphic is HTML, CSS, and GSAP rendered in a headless browser. Compositions are **seeked, not played** — the renderer jumps to arbitrary frames — and everything below follows from that.

### The timeline contract

- Build **one master timeline, created paused, with every tween at an absolute second.** Not relative offsets.
- **Never use random values.** The same frame must render identically on every seek.
- **Never drive state from real-time timers.** No `setTimeout`, no animation frame loops. Everything comes off timeline position.
- **Every exit that lands on a boundary needs an explicit hard kill** — opacity set to zero at that exact time. An unresolved tween pops instead of finishing.
- **Time is always in seconds.** Never frames.
- **Every entrance uses a from-to tween, never a bare `to`.** A bare `to` has no defined start state when the timeline is seeked into the middle of it.
- **...and EVERY tween needs `immediateRender: false`. This is the single most destructive default
  in a seeked render (2026-08-23).** GSAP's `fromTo` runs with `immediateRender: true` by default,
  which applies its **from** values the moment the timeline is *built* — not when the tween starts.
  The first tween on an element is harmless. The **second** one is not: an exit written as
  `fromTo(el, {opacity:1}, {opacity:0})` slams the element to opacity 1 at build time, so it is
  visible from frame 0 and the entrance never reads.

  Nothing errors. The render looks *plausible* — which is why it survives a glance. On this job
  every one of 34 caption chips was on screen simultaneously from the first frame, stacked and
  overlapping, and the karaoke ran with **five words amber at once** instead of one, because each
  word's "turn the previous word back to white" tween had already fired its `from: amber` at build.

  The tell is cheap to check and worth wiring into every review: sample two frames far apart and
  diff them. A part whose elements are all pinned to their end state barely changes
  (mean abs diff 0.03 on the broken captions) where a working one moves properly (2.3-3.6 on a part
  with four staggered entrances). **Put the from-state in CSS and pass `immediateRender:false` on
  every single tween** — then the CSS default is what a seek before the tween's start renders.

```js
tl.fromTo('#chip', {opacity:0}, {opacity:1, duration:0.20, ease:'power3.out',
                                 immediateRender:false}, 3.32);
tl.fromTo('#chip', {opacity:1}, {opacity:0, duration:0.14, ease:'none',
                                 immediateRender:false}, 4.80);   // without the flag: visible from 0
```

  **The other half of the same rule: with `immediateRender:false`, an element's CSS default IS its
  pre-entrance state.** Anything styled visible in CSS is on screen from frame 0 no matter when its
  entrance is scheduled. On this job that meant a table whose values, row labels, gridlines, source
  line and — worst — **all thirteen amber highlight sweeps** were painted from the first frame, so a
  graphic built to reveal one highlight at a time showed every one at once, which is the exact thing
  the style file forbids.

  So: **every element that has an entrance tween starts `opacity:0` in CSS.** Put it on the shared
  classes, not per element, and audit the inline-styled ones separately — they are the ones that get
  missed. Then check it by measurement rather than by eye: pick a colour test that discriminates the
  element from the *background it sits on* (an "is it indigo?" test of `b > r+40` also fires on the
  brand's mint ground — use `b > g+40`), sample the element's own box before and after its cue, and
  assert it goes from absent to present.
- **Never put a CSS transform and a GSAP tween on the same property.**

### Things that silently do not render

Nothing errors. It just quietly comes out wrong.

- **Never transform a video element directly.** A scale or move on `<video>` gets composited away by the headless render — the face just vanishes where the move should be, no warning. Reframe through layout instead: wrap the video in a div with hidden overflow and animate the wrapper's left, top, width, height. The parent shrinks and crops the untransformed video inside it.
- **CSS blur filters are not render-safe.** For a blur-in text reveal, use a per-letter opacity stagger instead, around 0.045 seconds between letters.
- **Grayscale filters fail the same way.** Fake desaturation by tweening the colour toward a flatter value.
- **Class-name tweens do not survive the seek.** Worse than failing to apply, they can wipe the base class's styling entirely. Tween the actual CSS properties directly.
- **Near-zero-duration tweens are unreliable.** Two identical 0.001s tweens in the same call: one applied, one did not. Give every instant state change a real duration of 0.2 to 0.35 seconds — it still reads as a cut.
- **Raw emoji glyphs hang the render.** A single emoji codepoint sends the headless browser spinning at full CPU trying to load a colour emoji font it cannot decode. Never errors, never times out. The tell: a render still going at three times the length of a same-sized part is an emoji, not a real hang. Fake the look with the brand font, or pre-render the glyph as a transparent PNG and overlay it.
- **Transparent overlays have nothing behind them**, so backdrop blur does not happen. Design frosted panels to read on their own fill.

### The composite traps (FFmpeg-side, they only show up at assemble)

- **Match every part to the base frame rate exactly.** Mixed frame rates drift. Probe the base and pass the exact rational — `24000/1001`, never a rounded `24`.
- **Segments carry their own base slice, cut once from the base,** so the first and last frame match at the seam.
- **Cut that slice at the time it is placed, not the time it was built.** If the base gets re-spliced and graphics shift, a slice cut at the old time makes the footage jump at the seam and run out of sync with the audio for its whole duration. Overlays just slide. Only segments carry footage, so only segments need re-cutting and re-rendering.
- **Trim generously, gate precisely.** `trim=start=S:end=E` is half-open on SOURCE timestamps, so it
  yields one fewer frame than an `enable='between(t,S,E)'` window covers. A repositioned-footage layer
  built that way runs out one frame before the graphic above it does, and the subject visibly jumps
  for a single frame at the boundary. Give the trim a few frames of margin and let `enable` define the
  window. The same off-by-one bites the window END: an N-frame overlay's last frame sits at
  `start+(N-1)/fps`, so gating to `start+N/fps` leaves one uncovered frame.
- **Verify a boundary by frame-to-frame delta, then check the delta against the SOURCE.** A jump at a
  seam may be the creator's own cut, not yours — on this job two "extra jumps" at a beat exit measured
  47.5 and 38.1 in the base before any graphics existed. Measure before you fix.
- **Every overlay needs its end-of-file behaviour set to pass, not repeat.** Chain several short overlays over a long base and the frame scheduler starts duplicating output frames on a periodic cadence — dead-even constant frame rate so every tool reads it as fine, but the content only changes ~18 times a second wearing a 24fps costume. Visible judder, worst on smooth motion, and every input measures clean on its own so you will keep "fixing" a zoom that was never broken. Detect by counting exactly-duplicate frames in the output: clean is under 3%, the bug is around 25%. **Wire that check into the assemble script and make it fail above 8%.** Do not mask it by forcing a frame rate — the output is already constant.
- **The one exception is a deliberately held frame**, like an outro push-in that should not zoom back out. That one gets repeat.
- **Do not use frame padding to hold a zoom.** It never reaches end of file and can balloon a few-second clip into gigabytes before you catch it.
- **Browser segments darken the footage.** Round-tripping through the headless browser costs about 3% of luma, so the face visibly dips at every segment seam. Fix at the root, in this order: first, do footage motion in FFmpeg instead of the browser — a zoom or push-in is pure geometry and never needs a browser. Only use a browser segment when the reframe needs live graphics revealing behind the moving face. Second, if it must be a browser segment, render its source frames as PNG rather than the default (halves the dip), then close the remainder with a **gamma** correction at assemble time — gamma, not flat gain, so it pins black and white and does not clip highlights.
- **An FFmpeg zoom on a mid-video slice needs its frame counter reset**, or the zoom comes out constant and reads as a hard cut instead of a ramp. Build the slice by trimming inside the filtergraph and resetting timestamps, rather than seeking to a start point. Invisible when a part starts at zero — an intro zoom can work by luck and every later one silently will not.
- **Anchor footage motion to measured scene cuts, not nominal ones.** The rendered base drifts from the cut sheet, a few hundred milliseconds by the end of a reel, and the transcript drifts with it. Detect the real cut with scene detection on the rendered file and use that time.
- **Screen recordings carry black bars.** Run crop detection before compositing one into a card, or the bars scale in too and shrink the readable content. And size the card bigger than feels right in the CSS — numbers that look generous as CSS render noticeably small.

### The renderer's own frame cache is on the internal drive — move it (2026-08-23)

The sub-agent scratch warning above is not the only way the internal volume fills. **HyperFrames'
own extract/frames cache defaults to `$TMPDIR`,** which on this machine is the internal drive.
`hyperframes doctor` reports it ("Frames cache … 3.3 GB free") and that line is a warning, not
trivia: a 33s 1080×1920 part is ~1000 RGBA frames at ~8 MB each, so **one long part needs ~8 GB**.

The failure mode is silent. Three renders in a batch produced **no output file and exit code 0** —
no error, no message, just missing files — after the internal volume fell from 3.3 GB to 1.0 GB
free. Export `TMPDIR` to a directory on the external volume before any render batch, and check
`df -h /` between parts. Render the longest part FIRST, not last: it is the one that fills the disk,
and finding out early costs one render instead of a batch.

### Linter and workflow

- **Lint and validate are the gate.** Run both on every part before rendering.
- **Contrast warnings on deliberately dim text:** satisfy them by raising opacity, not brightness. Keeps the intended look.
- **A dense-track warning on a short build is normal.** Do not refactor a handful of parts into sub-compositions to silence it.
- **Keep the build source durable, never only in a temp folder.** Temp is volatile on every platform; an overnight clear has wiped an entire in-progress build. The build script and compositions belong in `graphics-build/` inside the project. Only heavy regenerable renders belong in a cache.

## Generated images inside graphics

When a graphic needs an icon or illustration that HTML cannot draw, request it from the `ai-broll` skill's image generation (Kie.ai) mid-edit and composite the returned file in. That changes what a graphic can be — but generation happens in that skill, compositing happens here.
