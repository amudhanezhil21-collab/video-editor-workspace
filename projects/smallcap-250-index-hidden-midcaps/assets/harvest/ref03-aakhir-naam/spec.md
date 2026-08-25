# REF3 — "Aakhir naam hi Small Cap 250 Index Fund hai."

**Doc:** https://docs.google.com/document/d/1Ggg9W9vFAKu7MtwfihIGpB1XnJtYULNtfHxKXSapeLY/edit
**Title:** I need this type of frame with text "Small Cap 250 Index Fund"
**Owner:** ezhilam@groww.in · created 2026-08-21 09:48 · modified 2026-08-21 09:51
**Creator comment on the script line:** "Follow this editing instruction."

## Doc body (verbatim, complete)

> \[image\]
>
> I need this type of frame with text "Small Cap 250 Index Fund"
>
> The same exact background and also swirling stars at top right corner and bottom left corner.
>
> Ignore the youtube UI elements.

**Comments on this doc: NONE.** `read_file_content(includeComments=true)` returned no comment
tags and the HTML export contains zero `cmnt_ref` anchors — so there are no resolved threads
hiding either. **Links in this doc: NONE.** The chain stops here.

Not a pointer doc — the spec is entirely in the one embedded image.

## The reference image — `img-01.png`, 1000 x 1780 px

A YouTube Shorts screenshot of a **full-frame graphic takeover** (presenter absent), aspect
0.5618 vs 9:16 = 0.5625 — i.e. an uncropped vertical frame. All measurements below are given as
% of frame and converted to **1080 x 1920** (x1.08 in x, x1.0787 in y).

The frame reads: pale periwinkle ground + faint dot grid, two large blurred indigo 4-point
sparkle "stars" bleeding off the top-right and bottom-left corners, each sitting in a broad
near-white glow, and a centred two-line indigo serif-italic headline.

### 1. Ground

| Property | Measured (1000x1780) | At 1080x1920 |
|---|---|---|
| Base field | `#ECEEFE` (luma 239), flat over most of the frame | same |
| Corner shade, **top-left AND bottom-right** | `#D9DDFC` (luma 222-225) held to r~330px from the corner, easing to base by r~690px | dark core to r~356, base by r~745 |
| Corner shade composition | = **$indigo `#5367FC` at alpha 0.124** over the base (solved per-channel: 0.124 / 0.124 / 0.124) | same |
| Glow, **top-right AND bottom-left** (behind each star) | peaks `#FDFDFF` (luma 251-253) in a band ~70-170px outside the star edge, decays to base ~450px further out | peak band ~75-185px out, base ~490px further |
| Glow composition | = **white at alpha ~0.89** over the base | same |
| Grain / noise | **none** — residual std 0.57 luma (0.24%) after a 9px high-pass. Flat digital gradient, do not add grain | same |
| Mint / green | **ZERO** anywhere. max(G-B) over the whole ground = -1.8 | same |

Net: the frame is bright along the **TR-BL anti-diagonal** and shaded along the **TL-BR diagonal**.

### 2. Dot grid

| Property | Measured | At 1080x1920 |
|---|---|---|
| Pitch | **90.0 px** both axes (2-D autocorrelation peak 0.68 at dy=0,dx=+/-90 and dx=0,dy=+/-90); 9.00% W | **97 px** |
| Phase | vertical lines at x = 2 + 90k; horizontal lines at y = 73 + 90k | x = 2 + 97k, y = 79 + 97k |
| Dots (at every intersection) | FWHM **6 px**, peak depth **-21 luma**; centre `#D8D9E9` on ground `#ECEEFE` = **black at alpha 0.085** (equivalently $ink `#44475B` at ~0.125) | dia ~6.5 px |
| Connecting lines | **2 px** wide, depth only **-2 luma** = black at ~alpha 0.008. Present but almost invisible; the dots carry the read | ~2 px |

Verified visually on a contrast-boosted crop (`crop-grid-boosted.png`): thin lines with a
brighter dot at each crossing.

### 3. The two "swirling stars"

Both are **4-point sparkles** (concave-sided twinkle stars), heavily Gaussian-blurred, flat
indigo fill, no outline, no shadow of their own — the white glow around them does that job.
Fitted by IoU optimisation against the `B-R > 90` silhouette:

| | Top-right | Bottom-left |
|---|---|---|
| Fit quality | IoU 0.790 | IoU 0.845 |
| Centre | (91.8% W, 4.6% H) -> **(991, 88) @1080x1920** | (6.7% W, 94.4% H) -> **(72, 1813) @1080x1920** |
| Tip radius R | 180 px = **18.0% W** -> 194 px @1080 | 221 px = **22.1% W** -> 239 px @1080 |
| Waist radius | 0.46 R | 0.50 R |
| Rotation (4-fold, mod 90) | **61.7 deg** (== -28.3 deg) | **18.3 deg** |
| Visible silhouette bbox (d>90) | x [75.6%, 99.5%] W, y [0.1%, 17.2%] H | x [0.0%, 32.6%] W, y [82.9%, 99.5%] H |
| Edge blur | 10-90 edge width **50 px** -> Gaussian **sigma ~20 px** (2.0% W) | same, sigma ~20 px |
| Core colour | flat `#5E67E8` | flat `#5D67E5` / peak `#5E67E8` |

They are **not** mirror copies — different size and different rotation. Each centre sits at/near
the frame corner so two tips run off-frame.

### 4. Headline

Reference text: **"How did this happen?"**, two lines, centred, high-contrast serif **italic**.

| Property | Measured (1000x1780) | At 1080x1920 |
|---|---|---|
| Ink bbox | x [179, 817], y [663, 929] = 63.9% W x 15.0% H | x [193, 882], y [715, 1003] |
| Block ink centre | (49.8% W, 44.7% H) | (538, 858) |
| Optical block centre (asc top -> last baseline) | (50% W, **44.0% H**) — sits **6% of frame height ABOVE centre** | y = 845 |
| Line 1 | y [663, 756], w 639 px (63.9% W), ink centre x 49.8% | w 690 px |
| Line 2 | y [811, 929], w 449 px (44.9% W), ink centre x 51.8% (+2.0% drift from the italic) | w 485 px |
| Cap height (H) | **88 px = 4.94% H** | **95 px** |
| Ascender height (d, h) | 94 px = 5.28% H | 101 px |
| x-height | 65 px = 3.65% H | 70 px |
| Descender depth | 25 px | 27 px |
| Baseline-to-baseline | **148 px = 8.31% H** | **160 px** (= 1.11 x font-size) |
| Implied font-size | **~133 px** (cap 0.70em / x-ht 0.47em / asc 0.73em all agree +/- 5%) | **~144 px** |
| Slant | **9.2 deg** from vertical (left-edge fit dx/dy = -0.162) | same |
| Stroke contrast | thick/thin = **2.6** (12 px hairline vs 31 px stem at y=720) — Didone; consistent with **Ivy Presto Display Italic** | scale x1.08 |
| Colour (glyph core) | `#6472F4` (darkest 20%: `#6170F3`) | use **$indigo** token |
| Drop shadow | **NONE.** Ring luma down-right at offset 8 = 238.85 vs up-left = 238.61 (delta 0.24 luma, i.e. zero) | — |

### 5. Frame chrome present in the reference

The standard corner branding IS on this frame, partly hidden behind the YouTube overlay:
- **"Groww shorts" badge top-left** — indigo disc, bbox x[57,113] y[56,112], **dia 57 px = 5.7% W**,
  centre (8.5% W, 4.7% H) -> **dia 62 px, centre (92, 90) @1080x1920**. Matches style.md
  ("~56-62px dia, centre ~(98,98)").
- **Groww roundel + wordmark top-right** — light glyph cluster x[730,941] y[64,99] at 1000 px
  width, badly obscured by the YouTube CC / expand icons; position only, no reliable measurement.
- No source line, no compliance box, no captions on this frame.

### 6. YouTube UI to ignore (per the creator)

Grey play-button pill x[30,130] y[35,130]; grey volume pill x[145,240] y[35,130]; grey
CC / expand pill x[690,960] y[45,125]; red progress bar **x[16,89] y[1765,1770]**; the player's
rounded corner mask (last ~4 px at each corner).

## Conflicts with the house files — flagged, not resolved

1. **`gradient-ground` in brand.md / style.md says "periwinkle -> white -> mint diagonal".** The
   reference has **no mint and no green at all** (max G-B = -1.8 over the entire ground). It is
   periwinkle -> white only, and the light axis runs TR-BL with the *dark* on the TL-BR diagonal.
2. **The grid.** style.md: "faint **white** grid (~85px cells) at ~10%". Reference: **90 px** cells
   (97 px at 1080), and the grid is **darker** than the ground (black at ~0.8% for the lines) with
   a much stronger **dot at every intersection** (black at 8.5%, 6 px). style.md does not mention
   the dots at all, and gets the polarity backwards.
3. **brand.md golden rule: "every graphic element carries a drop shadow ... nothing floats flat".**
   The reference headline carries **no shadow whatsoever** (measured delta 0.24 luma between the
   down-right and up-left rings). Either the rule has an exception for serif takeover type on
   `gradient-ground`, or this reference frame breaks the rule. Creator's call.
4. **style.md Type roles / $accent paragraph: serif takeover titles are green** ("~190px green +
   ~130px white on dark textured ground"; "$accent ... serif takeover titles"). The reference is a
   **single-weight $indigo serif italic on a LIGHT ground at ~133px**. That variant is not
   documented in style.md.
5. **Sampled hex vs token.** Star core measures `#5D67E5`-`#5E67E8`, headline `#6472F4`; $indigo is
   `#5367FC`. The spread is YouTube re-encode drift on a large saturated blue. Per CLAUDE.md the
   build uses the **`$indigo` token**, and the sampled values are for verification only — but they
   will not match exactly, so do not chase them.

## Unknowns — not invented

- **Line breaking of "Small Cap 250 Index Fund".** The creator gave the string, not the setting.
  Recommended (matches the reference's 2-line, wide-then-narrow shape and its 63.9% W max line):
  line 1 "Small Cap 250" / line 2 "Index Fund".
- **Whether the size holds or the string is fit to width.** Recommendation: hold the measured
  cap height (95 px @1920) and let line 1 land near 690 px wide; if it overruns, cap the block at
  **63.9% W** and drop font-size, never widen past that.
- **"Swirling" — shape or motion?** The word may describe the sparkle silhouette or ask for the
  stars to rotate/drift. The reference is a still frame and settles nothing.
- **Entrance / exit / duration / easing.** Not specified anywhere in the doc. style.md defaults
  apply (0.3-0.5s motion-blurred entrance with ease-out settle, dead-static hold, designed exit
  timed to the first word of the next thought, and the beat must hold full strength to its last
  frame if a light leak sits on the out-point).
- **Corner-branding opacity on this ground.** style.md knocks both bugs to ~35% "over the light
  data-card layouts". Unmeasurable here — the YouTube overlay covers both marks.
- **Exact Ivy Presto cut / optical size.** Inferred from slant 9.2 deg and stroke contrast 2.6.

## Files

- `img-01.png` — the reference frame, 1000x1780, extracted from the HTML export
- `mask-blobs-d90.png` — silhouette used for the star fit
- `crop-blob-topright.png`, `crop-blob-bottomleft.png` — star detail
- `crop-headline.png` — headline detail
- `crop-topchrome.png` — corner branding under the YouTube overlay
- `crop-grid-boosted.png` — grid at 8x contrast
- `doc_marked.txt`, `doc_stripped.html` — anchored doc body (0 refs, 0 bodies, 0 links)
