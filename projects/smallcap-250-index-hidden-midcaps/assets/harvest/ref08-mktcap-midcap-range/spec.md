# REF8 — "Uski market cap badh kar mid cap range mein pahunch jaati hai."

Creator comment on the script line: **"Follow this editing instruction"**
Linked doc: https://docs.google.com/document/d/1X5n3nBg1D7nshGRpvQogoIz8IBfDbjLyUWo-MrbnI-s/edit
(fileId `1X5n3nBg1D7nshGRpvQogoIz8IBfDbjLyUWo-MrbnI-s`, owner amudhanezhil21@gmail.com,
created 2026-08-21, modified 2026-08-21)

## The doc, verbatim and complete

**Doc title** (carries spec the body omits):

> Copy of I need this type of motion graphics in full screen in similar background( subtle grid, gradient of white to purple as shown in the reference picture

**Doc body** (one image, then one sentence — that is the entire document):

> \[image\]
>
> I need this type of motion graphics in full screen in same background, the motion graphics should suit with the line of script this comment was added upon.

**Comments on this doc: NONE.** `read_file_content(includeComments=true)` returned no threads and
the HTML export carries **0 `cmnt_ref` anchors and 0 comment bodies** — so there are no resolved
threads hidden either. **Links inside this doc: NONE** (0 `href` in the raw HTML export).

This is **not** a pointer doc (it is not "one sentence + a link"), but it is not a written spec
either: **the entire specification is the picture**, and the picture is a still, so the *motion* the
comment asks for is not in the doc at all. See "Recovered dependency" below.

## Recovered dependency — the source of the reference image

The embedded image is a phone screenshot of a YouTube Short on the creator's **own** channel:
bottom bar reads `@MutualFundsWithGroww` / "Why Equal Weight index beats Cap-Weighted?".

Located and downloaded: **https://www.youtube.com/shorts/s2N5aSIOoJw** (id `s2N5aSIOoJw`, 111.3s,
30fps). The reference frame is **the Nifty 50 Equal Weight balance-scale takeover at 21.7–26.6s**;
the exact still in the doc is **≈23.5s**. Everything under "Motion" below is measured from that
clip. The clip is also the only clean read of the background (the doc screenshot has YouTube's own
bottom scrim burned over the lower 30%, which darkens it — do not colour-match from the screenshot
below y≈58%).

## Frame geometry of the reference still

`img-01.png` is 912×1596 px. The video frame inside the screenshot is **x 9–906, y 0–1593 =
898×1594 px (aspect 0.5634 ≈ 9:16)**. All percentages below are of that 898×1594 frame; `@1080`
values are that percentage applied to 1080×1920.

## 1. Background (the "same background" the creator names)

**Ground: a white → periwinkle-purple gradient. NO mint leg, NO green.**

Sampled on the clean render (`s2N5aSIOoJw` @23.5s), as hex:

| Point (%x, %y) | Colour |
|---|---|
| 2, 1 (top-left) | `#D4D8FD` |
| 50, 1 | `#E8EBFE` |
| 1.4, 28 | `#DBDEFF` |
| 50, 28 | `#E6EBFE` |
| 92, 28 (brightest) | `#F5F8FF` |
| 97, 25 | `#F6F9FE` |
| 2, 50 | `#E8EBFE` |
| 2, 75 | `#C0C2C7` (scrim starting) |

Direction: **lavender at the left edge, brightening to near-white toward the right/upper-right**;
a soft light pool sits around x 78–97%, y 19–30%. Left edge also brightens downward from `#D4D8FD`
(7%) to `#E8EBFE` (51%) before the bottom scrim takes over.

**Two blurred purple blobs bleed in from opposite corners** (soft-edged, heavily gaussian, organic
lobed shape, not a circle):

| Blob | bbox %frame | @1080×1920 | Colour |
|---|---|---|---|
| Top-right | x 72.8–100, y 0–17.9 | x787 y0 w293 h343 | mean `#6B73CE`, core `#545CCD`, corner `#5356E5` |
| Bottom-left | x 0–18.9, y 82.4–94.4 | x0 y1583 w204 h231 | core `#1A1946`–`#2C2C76` under the scrim |

**Bottom contrast scrim** (measured on the clean render at x=90%, away from the blobs — luma):
starts departing the ground around **y≈59% and ramps smoothly to the bottom edge**:

```
59.4% 223 | 65.6% 205 | 71.9% 187 | 78.1% 169 | 84.4% 146 | 90.6% 120 | 95.6% 91 | 99.4% 56
```

Band depth ≈ **40% of frame height (~770px at 1080×1920)**, peak ≈ **0.72–0.76 black at the bottom
edge**, smooth with no findable inward edge. **No top scrim** (luma flat at 240 across y 0–8%).
This matches the style file's existing edge-scrim/black-gradient directive; build it that way.

**Subtle dot grid** (this is the "subtle grid" in the doc title):

| Property | Measured | @1080×1920 |
|---|---|---|
| Lattice | square, dots (NOT lines) | — |
| Pitch | **81 px** both axes (rows at y=385, 466, 547, 629, 709 → Δ 81,81,82,80; cols at x=83,164,246,327,408,489,570,651,732,813 → Δ 81; H-autocorrelation peak 0.75 at lag 81, 2nd at 162) | **~97 px** (9.0% of width / 5.1% of height) |
| Dot core | ~2–3 px | ~3 px |
| Contrast | **DARKER than the ground by 1.5–2.2 luma** (~0.8%) | same |
| Colour | neutral — no hue shift measurable at this amplitude | — |

## 2. The hero motion graphic — a balance scale

Whole assembly bbox: **x 10.7–89.3%, y 32.9–63.2%** → @1080×1920 **x115 y631 w849 h583**.
Flat vector, one colour family, sitting directly on the ground.

| Element | Measured (898×1594) | %frame | @1080×1920 |
|---|---|---|---|
| Pan bar (both, identical) | 224 × ~22 px, fully rounded ends (stadium), rotated with the beam | w 24.9% | **w 269, thickness 26** |
| Left pan bar | x96–319, y745–779 | x10.7 y46.7 | x115 y897 |
| Right pan bar | x578–801, y825–857 | x64.4 y51.8 | x695 y994 |
| Sling (2 straight strokes per pan, pivot ball → both bar ends, forming a triangle) | stroke 6–7 px | 0.7% | **7–8 px** |
| Pivot ball (top of each sling) | ~31–34 px dia | 3.5% | **~37–41 px** |
| Beam | tapered wedge: **4–5 px at each outer pivot → ~16–18 px at the fulcrum** | — | **5 → 20 px** |
| Beam colour | translucent light indigo, mean `#A3AAE9` / `#B1B8F6` (≈ $indigo at 45–55% over the ground) | | |
| Fulcrum | white disc **76 px dia** with a centred solid indigo dot **35 px dia** | 8.5% w | **disc 91, dot 42** |
| Stand column | 23 px wide, fulcrum down to base | 2.6% | **28 px** |
| Base plate | 212 × 53 px, rounded | w 23.6% | **w 255, h 64** |
| Building icons (one per pan) | **89 × 132 px, IDENTICAL on both pans** | w 9.9%, h 8.3% | **w 107, h 159** |
| Left building | x168–256, y624–755 | x18.7 y39.2 | x202 y752 |
| Right building | x647–735, y702–833 | x72.1 y44.0 | x778 y846 |

**Colours.** Solid indigo, most-common pixel **`#6070F4` / `#6170F4`** (title and scale share it).
Brand `$indigo` is `#5367FC`; the delta is consistent with YouTube compression over a light ground.
**Use the `$indigo` token — do not hardcode the measured hex.**
Buildings are neutral greyscale, mean `#AAAAAB`, luma range 90–215 — a photoreal/3D grey model, not
a flat vector, with no tint.

**NO DROP SHADOW.** Measured: ground immediately below the left pan bar reads **242.7 luma** versus
pure ground at the same rows **242.2** — a 0.5 luma difference, i.e. none. Same under the base
plate. The whole graphic sits flat on the gradient. **This contradicts brand.md's golden rule.**
See Conflicts.

## 3. Motion (measured off `s2N5aSIOoJw`, 30 fps; times are in the source clip)

**Scene in — indigo diagonal wipe.** From 21.333s luma climbs 155 → 210 by 21.500; indigo coverage
spikes **20% → 50%** at 21.567 then collapses to 8.6% by 21.667; luma peaks 225 at 21.600.
≈ **11 frames / 0.37s** of wipe. The scale is **already complete the instant the wipe uncovers it**
— there is no separate entrance animation for the graphic.

**Scene out — the same wipe, harder.** Luma rises 198 → 227 across 26.500–26.733, then **one frame
of 97% indigo cover at 26.767**, then hard cut to the next (dark) scene at 26.800. Held content
therefore runs **21.67 → 26.60 ≈ 4.9s**.

**The scale rocks continuously for the whole beat — that is the motion.** Tilt = (right pan
centroid y − left pan centroid y), 360×640 px, positive = right pan lower:

```
21.70  -7   |  22.20  +1.5 |  22.60 +16.7 |  23.00 +21.7 |  23.50 +23.0 (max right-down)
23.70 +21.9 |  24.00 +15.8 |  24.20  +4.3 |  24.40  -2.3 |  25.00  -3.7 (near level, holds ~0.8s)
25.40 -12.3 |  25.80 -26.7 |  26.10 -32.1 |  26.40 -36.7 (max left-down) | 26.60 -35.4
```

Character: **one slow eased see-saw, not a bounce.** Swing 1 (left-down → max right-down) takes
21.70→23.50 ≈ **1.8s**, holds at max ≈ 0.7s, returns to level by 24.40 ≈ **0.9s**, sits near level
≈ 0.8s, then swings the other way 25.20→26.40 ≈ **1.2s** and is still moving when the wipe takes it.
Peak beam rotation at max tilt, measured off the doc still (higher res): **±9.8°**
(left pivot (217,539) → right pivot (690,621): dx 473, dy 82). The counter-swing at 26.4 is larger,
≈ **15°** by ratio. Ease is soft in and out; no overshoot, no oscillation decay, no bounce.

**Title builds word by word, in place.** Two lines, centred, high-contrast **italic display serif**
(reads as Ivy Presto Italic). Words are **pre-laid-out in a ghost lavender and solidify to indigo
one at a time** — the layout never reflows, so it is a colour reveal, **not a typewriter**.
Indigo pixel count in the title band: 281 @21.70 → 1719 @22.00 → 2666 @22.20 → 3396 @22.40 →
3882 @22.70 → 4036 @23.00 → 5023 @23.50. Roughly **one word every ~0.2–0.25s, VO-synced**, complete
by ~23.5s. Metrics: cap height **60 px = 3.76% of frame height → 72 px @1920**; line 1 bbox
x30.0–70.0%, y18.8–22.5%; line 2 x32.2–69.1%, y23.4–27.2% (line 2 is narrower and centred, not
indented); **leading 74 px = 89 px @1920**.

**Coral "2%" labels pop in at ~24.0–24.2s**, one under each pan, and **thereafter travel vertically
with the pan they belong to** (at 26.40 the left 2% has ridden down and the right one up). Italic
serif, glyph height **6.6% of frame height → 126 px @1920**. Left at x13.9–32.2%, y52.3–58.9%;
right at x68.9–86.7%, y53.3–60.0%. Colour: most-common `#FB6D55`, mean `#E27570` — that **is**
brand `$coral` `#F26B55`. On palette.

**Corner chrome is present the whole time** — "Groww shorts" badge top-left, Groww wordmark
top-right, as the style file requires.

## 4. Captions in the reference (observed, not requested)

Two groups across the beat: "But, in the Nifty 50 / equal weight version" (≈21.7–24.4s) then
"companies get 2% / each. No single stock" (≈24.5s→). **Two lines per group, ~7 words, ~2.5–2.8s
per group.** White bold sans, cap height **39 px = 2.45% → 47 px @1920**, stem ~7 px → **8.4 px
@1080**, line 1 y71.7%, line 2 y75.0%.

**No black chip.** The text sits directly on the ground with a **drop shadow offset +4.8 px right /
+4.8 px down @1080, core `#24252A`**. Karaoke here is **grey → white** (unspoken words are visible
in grey and turn solid white as spoken), not an amber word. Both of these contradict the house
caption spec — see Conflicts. The creator's comment is about the *motion graphic*, not the
captions, so treat this as context unless she says otherwise.

## 5. Build spec for REF8

The line is **"Uski market cap badh kar mid cap range mein pahunch jaati hai"** — a small-cap
company's market cap *grows* until it lands in the mid-cap band. Map the reference's device onto
that idea: the reference's scale says "two equal weights"; this line needs **one side growing**.

- Full-screen takeover, face fully absent, 1080×1920, 25 fps.
- Ground: the white→periwinkle gradient, 81px-equivalent (97px @1080) dark dot grid at ~0.8%
  contrast, blurred purple blob top-right (x787 y0 w293 h343) and bottom-left (x0 y1583 w204 h231),
  bottom scrim 40% of frame height peaking 0.72 black. No mint, no green anywhere.
- Enter on an **$indigo diagonal wipe, ~0.37s, ~1 frame of full cover**; the graphic is **complete
  when the wipe clears** — no separate entrance. Exit the same way, timed to the END of the spoken
  sentence.
- Hero: the balance scale at the measured geometry above, in `$indigo`, flat, one identical grey 3D
  building per pan at 107×159 @1080.
- **Motion:** the small-cap pan's building **grows** (scale up over ~1.2–1.6s, soft ease, no
  bounce), and the beam tips toward it in one slow eased see-saw of the same duration —
  ±10° peak, hold at the extreme ~0.7s. One continuous eased swing, never a bounce or a wobble.
- Title: two centred lines of italic display serif in `$indigo`, 72px cap height, 89px leading,
  words pre-laid-out in ghost lavender solidifying one at a time ~0.2–0.25s apart, VO-synced,
  complete before the VO reaches the payoff word.
- If a value label is needed (the reference's "2%"), use italic serif `$coral`, ~126px glyph
  height, parented to its pan so it travels with it.
- `Source:` line is still mandatory (finance channel rule) — the reference beat does not show one,
  because it is a concept graphic, not a data graphic. If this build states a market-cap
  *threshold*, it needs a source line.

## 6. Unknowns

- Exact font files: the reference title/2% are an italic high-contrast display serif consistent with
  **Ivy Presto Italic** and the caption an Inter-Tight-class bold sans, but the video is a 360p
  re-encode and I did not glyph-match. Falling back to `assets/fonts/` per brand.md.
- Easing curves are named only by character (soft in/out, no overshoot); no cubic-bezier is
  recoverable from a 30fps 360p source.
- Chrome opacity in this reference: the top-right badge zone overlaps the purple blob, so I could
  not isolate a knockback value. Follow the style file's ~35%-over-light-layouts rule.
- Blob shape: I have bboxes and colours but not a vector path; it is a lobed, heavily blurred
  organic form bleeding off-frame.
- Which stock/entity the growing pan represents for this line — the script does not name one.
- Whether the source video is 25 or 30 fps natively (YouTube delivered 30fps; the house format is
  exactly 25fps, so all timings above must be re-quantised to 25fps frames when built).

## 7. Conflicts — flagged, not resolved

1. **Drop shadows.** brand.md: *"every graphic element carries a drop shadow… nothing floats
   flat"* / *"Every chart carries a depth drop shadow"*. **The reference the creator says to copy has
   no shadow at all** (measured 0.5 luma under the pan bar vs bare ground). "Same background /
   this type of motion graphics" vs the golden rule — the creator's call.
2. **Ground.** brand.md `gradient-ground` = *periwinkle→white→**mint** diagonal + faint **white**
   grid (~85px cells)*. The reference is **white→purple with no mint leg**, and its grid is a
   **darker-than-ground dot lattice at ~97px @1080**, not white lines at 85px. The doc title says
   explicitly *"gradient of white to purple"*, so the doc wins on this video — but the style file's
   `gradient-ground` definition is now describing a different ground.
3. **Captions.** brand.md/style.md: white bold Inter Tight on a **near-opaque black rounded chip**,
   groups of 2–6 words (typically 3–5), one group ≈1–1.5s, karaoke word in **`$amber`**. The
   reference: **no chip**, drop-shadowed white on the ground, **two-line ~7-word groups at ~2.5–2.8s**,
   karaoke **grey→white**. This is the creator's own channel, so the style file's "measured from V2/V4"
   caption spec and this video disagree about channel practice.
4. **Entrances.** style.md: *"Entrances get all the effort: a finished card arrives with a big
   motion-blurred move… then the card holds DEAD STATIC 3–15s"*. The reference does the opposite —
   **no entrance move at all** (the wipe reveals it complete) and **the graphic moves continuously
   for the whole 4.9s hold**. The creator is asking for exactly this continuous motion
   ("I need this type of motion graphics"), which is a direct exception to the hold-dead-static rule.
5. **Title typography.** style.md says the two-line serif thesis title has *"line 2 indented right,
   typed on"*. The reference's line 2 is **centred, not indented**, and it is **not typed on** — it
   is a word-by-word ghost→solid colour reveal.

## Files

- `img-01.png` — the doc's embedded reference screenshot, 912×1596 (the only content in the doc).
- `ref-motion-sheet.png` — six frames of the recovered source clip at t=21.70/22.20/23.50/24.20/25.33/26.40.
- `doc_marked.txt`, `doc_stripped.html` — anchor_comments.py output (0 refs, 0 bodies, 0 links).
- Source clip kept off the internal drive at
  `/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps/_scratch/ref08-mktcap-midcap-range/yt-s2N5aSIOoJw.mp4`
