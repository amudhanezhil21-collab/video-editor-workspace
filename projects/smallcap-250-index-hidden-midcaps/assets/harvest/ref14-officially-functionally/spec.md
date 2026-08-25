# REF14 — "Officially small cap. Functionally nahi."

**Job:** smallcap-250-index-hidden-midcaps
**Script line anchored:** "Officially small cap. Functionally nahi."
**Creator comment on that line:** "follow this instruction"
**Linked doc:** https://docs.google.com/document/d/1KgL8TJrMwHf7CySI68D2iSieG6SGWXIA1t6C9rsAGZU/edit
**Doc title (Drive metadata):** `Copy of I need this type of frame with text "Small Cap 250 Index Fund"`
**Owner:** ezhilam@groww.in · created 2026-08-21T10:32:43Z · modified 2026-08-21T10:34:17Z

## Doc body — verbatim (3 lines + 1 image, that is the whole doc)

```
[image]
I need this type of frame with text "Officially Small cap, functionally not"
The same exact background and also swirling stars at top right corner and bottom left corner.
Ignore the youtube UI elements.
```

## Comments on this doc

**NONE.** `read_file_content(includeComments=true)` returned no comment threads, and
`anchor_comments.py` on the HTML export found **0 inline anchors / 0 comment bodies**. There are
therefore no resolved-thread discrepancies to reconcile either. All direction is in the body + image.

## Links inside this doc or its comments

**NONE.** `anchor_comments.py` found 0 URLs. This doc is a **terminal leaf** of the harvest chain, not
a pointer. It is a real spec (one instruction + one measured reference frame), so `isPointerOnly=false`.

## Reference image

`img-01.png` — **1000 × 1780 px** (aspect 0.5618; 9:16 within 2px). A screen-capture of a published
Groww Short. Everything below is measured off it. Percentages are of frame W/H so they transfer to
1080×1920 (multiply % of W by 10.80, % of H by 19.20).

### 1. Ground — periwinkle wash + two white blooms + dot-lattice grid

| Property | Measured (1000×1780) | At 1080×1920 |
|---|---|---|
| Base ground (mid-frame, away from stars) | `#ECEEFE` | same |
| Corner tint, top-left | `#D9DDFC` (60×60 median at (0,150)) | same |
| Corner tint, bottom-right | `#DEE1FC` / `#D8DCFA` at (890,1600) | same |
| Peak white bloom | `#FCFCFF` (luma 252.7) | same |
| Ground luma range across frame | 228.7 → 253.0 | same |
| Designed grain | **none** — high-pass std 0.774 luma, i.e. codec noise only | — |

The gradient runs on the **anti-diagonal**: the periwinkle tint is deepest at the **top-left and
bottom-right** corners and the ground brightens to near-white **around each star**. Measured radial
bloom, centred on each star's centre:

| Distance from star centre | median colour | luma |
|---|---|---|
| 0–200 px | `#FBFCFF` | 252.7 |
| 200–300 | `#F8F9FF` | 250.3 |
| 300–400 | `#F5F6FE` | 248.0 |
| 400–500 | `#F1F2FE` | 245.3 |
| 500–600 | `#EEF0FE` | 244.0 |
| 600–800 | `#ECEEFD` → `#EBEDFE` | 242.7 → 241.7 |
| 800–900 | `#EAECFE` | 241.3 |

So: **radial white glow, radius ≈ 600px = 60% of frame width, centred on each star**, over a base of
`#ECEEFE` that deepens to `#D9DDFC` in the TL and BR corners.

### 2. Grid — 90px square lattice of faint rules with a dot at every intersection

Autocorrelation on a clean band gives an **exact 90px period in both x and y**. Verified against
line positions x = 452, 542, 632, 722, 812, 902 and y = 1064, 1154, 1244, 1334 (all spacings exactly 90).

| Element | Measured | % of frame | At 1080×1920 |
|---|---|---|---|
| Cell pitch (square) | **90 px** | 9.00% of W | 97.2 px |
| Rule width | 2–3 px | 0.25% of W | ~2.7 px |
| Rule colour | `#EAECFA` on ground `#ECEEFE` — **Δ −2 luma (0.8%)** | | |
| Intersection dot Ø | **5 px** core (223–230 luma over 242 ground) | 0.50% of W | ~5.4 px |
| Dot colour (centre) | `#D9DBE9` — **Δ −19 luma (7.5%)** | | |
| Dot edge | soft, ~2px antialias ring | | |

The rules are almost invisible; the **dots** carry the grid. Grid is full-bleed and uniform — it
reads through the white blooms and behind the stars unchanged.

### 3. The two "swirling stars" — four-point sparkles, off-frame centres, Gaussian-blurred

Both are the classic four-point sparkle: **four tips joined by quadratic Béziers whose control point
is the star centre** (equivalently `sqrt|u| + sqrt|v| = sqrt(L)`, an astroid). A least-squares fit of
that model to the extracted alpha boundary lands at **rms residual 1.5–2.3 px on a ~320px shape** —
the model is right.

| | Bottom-left star | Top-right star |
|---|---|---|
| Centre | (84, 1661) = **(8.4% W, 93.3% H)** | (916, 80) = **(91.6% W, 4.5% H)** |
| Arm half-length L | 324 px = **32.4% of W** (18.2% of H) | 319 px = **31.9% of W** (17.9% of H) |
| Rotation (mod 90°) | **+19.1°** | **71.6°, i.e. −18.4°** |
| Fit rms residual | 2.30 px | 1.47 px |
| Visible bbox @ alpha≥0.5 | x 0–337 (0–33.8% W), y 1465–1771 (82.3–99.6% H) | x 753–995 (75.3–99.6% W), y ≤140–317 (…–17.9% H) |
| Visible bbox @ alpha≥0.05 | x 0–378, y 1422–1771 | x 717–995, y ≤140–339 |
| Visible area @ alpha≥0.5 | 3.11% of frame | 0.84% of frame (partly hidden by YT pill) |
| Core colour | `#5D67E5` (40×40 median) | `#5E68E6` / `#676FE8` |

- **The two rotations are equal and opposite (≈ ±19°)** — that is what makes the pair read as
  "swirling" rather than as two identical corner marks. Keep the mirrored rotation.
- Both centres sit **just outside the frame corner region**, so only two arms and one concave cusp of
  each star are on screen. Do not shrink them to fit — the crop is the design.
- **Tips are rounded**, not needle-sharp (visible in the extracted alpha mask, `mask-bl.png`).
- **Blur:** measured 10%→90% alpha transition = **45–56 px** at W=1000. For a Gaussian that is
  **σ ≈ 18–22 px = 1.8–2.2% of frame width** → **σ ≈ 21 px at 1080 wide**. Apply as a real blur on the
  shape; the whole star is blurred uniformly, edge and interior alike.

### 4. Headline type

The reference reads "How did this happen?" — **replace the words, keep the treatment.**

| Property | Measured (1000×1780) | % of frame | At 1080×1920 |
|---|---|---|---|
| Face | **high-contrast display serif, ITALIC** (Ivy Presto italic — the channel's display serif) | | |
| Colour | `#6170F4` (mode of p95-saturation pixels; 6361 px exactly this value) | | |
| Cap height ('H') | **86 px** | **4.83% of H** | 92.8 px |
| Ascender height (line-1 glyph box) | 93 px | 5.22% of H | 100.2 px |
| x-height | 64 px | 3.60% of H | 69.1 px |
| Implied font-size (cap ≈ 0.70 em) | ≈ 123 px | ≈ 6.9% of H | ≈ 133 px |
| Baseline-to-baseline (leading) | **149 px** (line-1 top 663 → line-2 top 812) | **8.37% of H** | 160.7 px |
| Leading ÷ cap height | **1.73** (≈ line-height 1.21 em) | | |
| Thick stroke | 22–25 px | 2.3% of W | ~25 px |
| Thin stroke | 9–13 px | 1.0% of W | ~11 px |
| Stroke contrast ratio | ≈ **2.2 : 1** | | |
| Block bbox | x 181–817, y 663–929 | x 18.10–81.80% W, y 37.25–52.25% H | |
| Block width / height | 637 × 267 px | **63.70% W × 15.00% H** | 688 × 288 px |
| Block centre | (499, 796) | (49.9% W, **44.7% H**) | (539, 859) |
| Line 1 optical centre | x 499 | 49.9% W — **centred** | |
| Line 2 optical centre | x 517.5 | 51.8% W — **+1.8% W right of centre** | |
| Alignment | centred; line 2 nudged ~18px right (1.8% W) | | |
| Case | sentence case, no full stop | | |
| **Drop shadow** | **NONE.** Luma 1px below the baseline = 240 = local ground 240–241; glyph→ground transition is 1 antialiased pixel | | |

**The headline block sits ABOVE frame centre at 44.7% of frame height, not at 50%.**

### 5. Frame chrome (present in the reference, under the YouTube UI)

Both channel bugs are visible behind the YouTube overlays and match `styles/groww-shorts/style.md`
§ Frame chrome — they are **not** to be removed:

| Bug | Measured (green logo pixels only) | At 1080 wide | style.md says |
|---|---|---|---|
| "Groww shorts" badge, top-left | green px x 79–92, y 67–101 → badge centre ≈ (91, 91) | ≈ (98, 98) | indigo circle Ø 56–62, centre ~(98,98) ✓ |
| Groww wordmark, top-right | green px x 755–802, y 75–109; mark runs to x≈950 | x ≈ 815–1026, y ≈ 75–118 | x≈815–1015, y≈70–125 ✓ |

### 6. What to IGNORE (creator's explicit instruction)

Measured bboxes of the YouTube UI in the capture — none of this is design:

| YT element | bbox | % of frame |
|---|---|---|
| Left pill (play + mute buttons) | x 0–239, y 2–129 | 0–23.9% W, 0.1–7.2% H |
| Right pill (CC + channel avatar + expand) | x 684–995, y 2–129 | 68.4–99.5% W, 0.1–7.2% H |
| Red progress bar, bottom | x 17–95, y ≥1770 | 1.7–9.5% W, ≥99.4% H |

## Conflicts — flagged, NOT resolved

1. **Doc title vs doc body.** Title says `…frame with text "Small Cap 250 Index Fund"`; the body says
   the text is `"Officially Small cap, functionally not"`. The title is a leftover from the doc this
   was copied from ("Copy of…"). The body matches the anchored script line, so the body is almost
   certainly the instruction — but the creator should confirm.
2. **Reference ground ≠ style.md `gradient-ground`.** `style.md` defines the takeover ground as
   *"periwinkle→white→mint diagonal `#9EA2C7→#D3DEF4→#8AF0CB` + faint white grid (~85px cells) +
   soft white spotlight"*. The reference measures: **no mint anywhere**; periwinkle far lighter
   (`#D9DDFC`, not `#9EA2C7`); grid is **grey rules + grey dots** (`#EAECFA` / `#D9DBE9`), not white;
   pitch **90px @1000 = 97px @1080**, not 85px; and **two** white blooms (one per star), not one
   spotlight behind a hero. The creator said "the same exact background", which points at the
   reference — but that contradicts the style file. Creator's call.
3. **No drop shadow on the headline.** `brand.md` golden rule: *"every graphic element carries a drop
   shadow… nothing floats flat."* The reference headline measurably has none (Δ0 luma below the
   baseline). Either the golden rule does not extend to display type on a takeover, or this reference
   frame predates the rule. Creator's call — do not silently add one.
4. **Text string capitalisation.** Creator wrote `"Officially Small cap, functionally not"` (capital
   S on Small, comma, no full stop). The script line is `"Officially small cap. Functionally nahi."`
   Use the creator's string verbatim; note it differs in case and punctuation from the script.

## Unknowns — no value invented

- **No motion spec.** "Swirling stars" is the only motion word and the reference is a still. Whether
  the stars rotate, drift, scale or hold is unspecified, as are the entrance/exit of the takeover and
  the headline reveal (typed on? popped? per-word?). `style.md` says serif takeover titles type on
  over ~0.4s per phrase, and that graphics hold dead static — that is the fallback, not the spec.
- **No duration.** `transcript/` is empty (WhisperX has not run on this job), so the beat's in/out
  timestamps are not yet known.
- **Exact display face and weight not named.** Measured as high-contrast italic display serif with
  2.2:1 stroke contrast, consistent with Ivy Presto Italic from `assets/fonts/`. Not stated in the doc.
- **Colour tolerance.** Measured `#6170F4` (headline) and `#5D67E5` (stars) vs brand `$indigo`
  `#5367FC`. Both measured values are shifted the same direction (R +11–14, B −8–22), consistent with
  YouTube's encode on a screen capture. Treat both as `$indigo` unless the creator says otherwise —
  do **not** hardcode the sampled hex.
- **Whether the presenter appears.** Reference frame is a full-frame takeover with no face and no
  captions. `style.md` allows a face-card on a takeover via a true alpha-0 hole; the reference shows
  none. Assume face-absent takeover.

## Build files kept here

- `img-01.png` — the reference frame (only image in the doc)
- `mask-bl.png`, `mask-tr.png` — extracted alpha≥0.5 star silhouettes, 2× nearest
- `star-alpha-mask.png` — full-frame star alpha
- `fit-overlay.png` — the fitted Bézier sparkle traced in red over the reference (fit verification)
- `doc_marked.txt`, `doc_stripped.html` — anchor_comments.py output (0 comments, 0 links)
