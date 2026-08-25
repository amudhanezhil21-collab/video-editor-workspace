# REF11 — "Woh stock agle rebalancing tak index mein bana rehta hai / Aur kyunki index fund index ko exactly track karta hai, fund bhi us stock ko hold karta rehta hai"

Source doc: https://docs.google.com/document/d/1XDvRqxJ3L7LqpO0UNiBkypHKwy5fYNRU8DDdrxMPhfc/edit
fileId `1XDvRqxJ3L7LqpO0UNiBkypHKwy5fYNRU8DDdrxMPhfc` · owner amudhanezhil21@gmail.com · created 2026-08-21 10:43 · modified 2026-08-21 10:45
Creator's comment on the script was the bare link only — this doc IS the whole instruction.

## The doc, verbatim

**Title (carries instruction):**
> Copy of I need this type of motion graphics in full screen in similar background( subtle grid, gradient of white to purple as shown in the reference picture

**Body (one image, then one sentence):**
> [image — img-01.png]
>
> According to the script this script this comment on make a similar motion graphics of vox style in this similar background.

**Comments on this doc:** NONE. `read_file_content(includeComments=true)` returned no comment tags;
`anchor_comments.py` on the HTML export found **0 refs, 0 bodies**. No resolved-comment discrepancy
to reconcile.

**Links in this doc or its comments:** NONE. Zero `href` attributes survive in the HTML export.
Not a pointer doc — the reference image is the spec.

## The reference image

`img-01.png`, 912×1596 PNG (RGBA), a phone screenshot of a YouTube Short.
Video frame = x9–906, y0–1592 → **working frame 898×1593 px, aspect 0.5638 ≈ 9:16.**
All percentages below are of that frame. `@1080` values = %W × 1080; `@1920` = %H × 1920.

Content: @MutualFundsWithGroww, *"Why Equal Weight index beats Cap-Weighted?"* — the channel's own
short. A **full-frame takeover** (presenter absent): serif indigo two-line title, a balance-scale
motion graphic with a 3D building cluster on each pan, on a white→periwinkle ground with a dot grid
and two soft indigo corner blobs. Burned caption reads "But, in the Nifty 50 / equal weight version".

**Contaminated regions (do not measure from these):** y0–150 (YouTube play/mute/CC/expand controls),
y ≳ 875 (YouTube's bottom scrim darkens and desaturates everything below ~55%H), y1430–1593
(channel row + video title). Both Groww corner marks sit inside YouTube UI pills.

---

## Measured spec

### Ground

| Sample (%W, %H) | Hex |
|---|---|
| 5, 12 | `#DADEFC` |
| 5, 20 | `#DBDFFD` |
| 25, 20 | `#DFE1FC` |
| 50, 12–50 | `#ECEEFD` → `#ECEEFE` |
| 75, 20 | `#F7F8FD` ← brightest (white hotspot) |
| 95, 30 | `#F6F7FF` |

Periwinkle at the **left / top-left**, a soft near-white **hotspot in the upper-right quadrant**
(≈70–95%W × 15–30%H), settling to a uniform `#ECEEFE` by 50%H. **Pure blue-violet throughout — B is
the top channel at every sample and there is no green anywhere in the ground.**

### Dot grid

- **Dots only. No connecting lines** — the line signal across clean background is <1 luma (below JPEG noise); the dot signal is 19 luma.
- Dot Ø **6px = 0.67%W** → 7px @1080.
- Pitch: **81.7px horizontal = 9.10%W** (98px @1080); **77px vertical = 4.83%H** (93px @1920). Near-square ~95px cell @1080×1920.
- Amplitude **−19 luma against a 231 bg**, and the darkening is **neutral** (ΔR −18, ΔG −18, ΔB −17) ⇒ black at **≈7.5% alpha**, not a tinted or white grid.

### Corner blobs (soft, opaque, organic — not circles)

| | bbox %W | bbox %H | core hex | feather |
|---|---|---|---|---|
| top-right | 73.72 – 100.00 | 0.00 – 17.39 | `#5D67E5` | ~100px = 11%W / 6.3%H (Gaussian σ ≈ 40px @898 → σ ≈ 48px @1080) |
| bottom-left | 0.00 – 20.16 | 81.61 – 94.16+ | `#4C5096` *(darkened by YT scrim — true colour unmeasurable)* | not measurable |

Top-right blob is **fully opaque `$indigo` at its core**, feathering to zero over ~11%W. The
top-right Groww wordmark sits on top of it. Bottom-left blob reads as a blurred rising-chevron
silhouette (resembles a hugely scaled, blurred Groww logo mark — not asserted, only observed).

### Title — two-line display serif

- High-contrast **italic** display serif (Ivy Presto family), colour **`#6170F4`** — reads as `$indigo` `#5367FC` shifted by YouTube compression (Δ R+14 G+9 B−8). **Not `$accent` green.**
- Horizontally **centred**: line 1 cx **50.00%W**, line 2 cx **50.72%W** (line 2 is *not* indented right).
- Line 1: cap top **18.83%H**, baseline **21.66%H**, descender to 22.54%H. Width **39.87%W** (431px @1080).
- Line 2: cap top **23.48%H**, baseline **26.30%H**, descender to 27.18%H. Width **36.64%W** (396px @1080).
- **Cap height 45px = 2.83%H → 54px @1920.** x-height 30px (x/cap = 0.667). Implied font-size ≈ **77px @1080** at cap/em 0.70.
- **Baseline pitch 74px = 4.65%H → 89px @1920.**
- **No drop shadow.** Directional halo test returns −1.4 / −1.8 / −1.5 / −0.6 luma in all four directions — symmetric, i.e. none.

### Balance-scale graphic

Fill `#6170F4` (`$indigo`) unless noted. Every measurement %-of-frame, `@1080×1920` in brackets.

| Part | Geometry |
|---|---|
| **Pivot centre** | (**49.20%W, 36.06%H**) → (531, 692) |
| **Pivot ring** | pure `#FFFFFF`, outer Ø **51px = 5.68%W** [61px], stroke **8px = 0.89%W** [10px] |
| **Pivot disc** | solid indigo, Ø **34px = 3.79%W** [41px] |
| **Column cap** | column continues **7px = 0.44%H** [8px] above the ring, rounded top, same 22px width |
| **Column / stem** | width **22px = 2.45%W** [26px], centre x **49.28%W**, from y ≈37.7%H down to the plinth at y ≈60.0%H |
| **Beam tilt** | **9.4° down to the right** (slope 0.1658, left side up) |
| **Left knob** | centre (**23.11%W, 33.52%H**) [250, 644], Ø **20px = 2.23%W** [24px], solid |
| **Right knob** | centre (**76.84%W, 38.54%H**) [830, 740], Ø **21px = 2.34%W** [25px], solid |
| **Beam span** | knob-to-knob **482.5px = 53.73%W** [580px]; half-spans 26.1%W left / 27.6%W right |
| **Beam shape** | two triangles from the pivot: **19px = 1.19%H** [23px] thick at the pivot, tapering **linearly to 0** at each knob (verified: predicted vs measured thickness at x=300/380/540/620 within 1–3px) |
| **Beam fill** | `$indigo` at **α ≈ 0.44** (measured `#B0B6F6` over ground `#EDEFFE` → α 0.436 on R, 0.45 on G) |
| **Cords** | **4–5px = 0.50%W** [5–6px] wide, solid indigo, **24.7° from vertical**, two per pan, landing **~14px (1.6%W) inset** from each end of the pan bar |
| **Left pan bar** | x **10.69–35.52%W**, y **46.77–48.96%H** → w 24.83%W × h 2.20%H [268 × 42] |
| **Right pan bar** | x **64.48–89.31%W**, y **51.79–53.80%H** → w 24.83%W × h 2.01%H [268 × 39] |
| **Pan shape** | flat top, rounded bottom corners, radius ≈ h/2 ≈ 17px [21px]. **Both pans identical width.** |
| **Light plinth** | x **41.98–56.35%W**, y **60.01–61.14%H** → w 14.36%W × h 1.13%H [155 × 22], colour **`#A3AAE9`** |
| **Dark base pill** | x **37.53–60.80%W**, y **61.08–63.21%H** → w 23.27%W × h 2.13%H [251 × 41], colour **`#5B68E4`** |

**No drop shadow on any part of the scale.** Down-right halo delta on the base = **+0.05 luma**
(the only darker neighbours are *above*, which is the plinth). Nothing floats on a shadow here.

### The payload on each pan — 3D building clusters

- Two clusters, **identical bbox 89 × 131px = 9.91%W × 8.22%H** [107 × 158] ⇒ the same asset instanced twice.
- Left centre (**23.61%W, 43.31%H**); right centre (**76.95%W, 48.18%H**).
- Each sits with its base overlapping the top of its pan bar by ~10px (0.6%H).
- **Fully desaturated**: mean `#A1A1A2`, |R−G| ≤ 2 and |G−B| ≤ 2 across the mask; luma p5 77 / p50 171 / p95 208. **No brand tint, no colour cast.**

### Caption (incidental to the instruction, but measured)

- Two lines, centred **cx 49.72%W**, heavy grotesque sans, sentence case.
- **No chip / no plate**: pixels around the text read `#BDBECB`, identical to the surrounding ground.
- Glyph white `#F5F6F9`→`#FFFFFF`; **hard near-black halo** (p5 `#15161C`) offset **down-right** (halo centroid dx +12.6, dy +8.3 vs glyph centroid).
- Cap-run height **39px = 2.45%H** [47px]; line pitch **53px = 3.33%H** [64px]; block y **71.75–77.53%H** [y1377–1489].
- The final word ("version") renders at a different weight/shadow strength from the rest ⇒ **words pop in one at a time**, not a whole-group swap. **No amber karaoke word present.**

### Chrome

- Top-left "Groww shorts" badge: indigo circle visible at x **5.57–11.58%W**, y **2.70–6.15%H** — Ø ≈54px = 6.0%W [65px], centre ≈ (8.6%W, 4.4%H) [92, 84]. Knocked-back grey two-line "Groww / shorts" text to its right. Partly under YouTube's play/mute buttons; opacity unmeasurable.
- Top-right Groww mark + wordmark: sits on the top-right blob **inside YouTube's dark CC/menu pill** → colour, bbox and shadow all unmeasurable from this screenshot.

---

## Conflicts (flagged, not resolved)

1. **`$gradient-ground` has no mint in this reference.** style.md defines `gradient-ground` as
   `#9EA2C7 → #D3DEF4 → #8AF0CB` (periwinkle → white → mint). Measured ground is **pure blue-violet
   with zero green**, and its periwinkle is `#DADEFC`, far lighter than `#9EA2C7`. The doc **title**
   independently says *"gradient of white to purple"* — words and picture agree, style file disagrees.
2. **The grid is dark dots, not a white line grid.** style.md: *"faint white grid (~85px cells)"* at
   ~10%. Measured: **neutral dark dots at ≈7.5% black, no lines at all**, cell ≈98 × 93px @1080×1920.
3. **Nothing in this graphic carries a drop shadow.** brand.md golden rule — *"every graphic element
   carries a drop shadow … Nothing floats flat"* — and style.md's *"Every chart carries a depth drop
   shadow"*. Measured: title, beam, knobs, cords, pans, column, plinth and base all return a
   **±0-luma directional halo**. Only the caption has a shadow.
4. **Caption treatment contradicts the caption spec.** style.md: white bold on a near-opaque black
   rounded chip (`~#040304`, radius 14–18px) with exactly one `$amber` karaoke word. Measured: **no
   chip**, a hard black drop shadow, word-by-word pop, **no amber anywhere**.
5. **"vox style" is undefined and the picture does not show it.** Neither brand.md nor
   styles/groww-shorts/style.md mentions Vox. The supplied image is the channel's own house look, not
   Vox's flat-illustrative explainer look. Two readings — (a) build the look in the picture,
   (b) build in Vox's style — point at different graphics. Creator's call.
6. **Takeover title size and colour.** style.md: takeover titles *"~190px green + ~130px white"* serif.
   Measured here: a single **indigo** serif title at ≈**77px @1080** (cap height 54px @1920) —
   roughly 40% of the style file's size, and it uses `$indigo` where style.md reserves serif takeover
   titles for `$accent` green.
7. **Full-screen ⇒ face absent.** The doc says *"full screen"* and the reference is a takeover with the
   presenter entirely off frame. That is legal per style.md, but this beat therefore cannot also carry
   a face-card — do not stack both.

## Unknowns

- **No durations, no easings, no frame counts, no font names anywhere in the doc.** Fall back to style.md motion grammar (entrance 0.3–0.5s motion-blurred, ease-out settle, dead-static hold) and brand.md type (Ivy Presto title / Inter Tight caption), and say so.
- **What the graphic should depict for this beat.** The doc says only *"According to the script"*. The balance-scale metaphor belongs to the reference's own subject (equal-weight vs cap-weight) and does not obviously carry "the stock stays in the index until the next rebalance". Whether the creator wants the *metaphor* or only the *treatment* is unresolved.
- **The reference is a still.** No motion is directly observable. The one motion cue: the beam is caught **tilted 9.4°** while the caption says *"equal weight version"*, which implies the beam **animates / settles** rather than sitting level — an inference, not a measurement.
- **Bottom ~44% of the frame is under YouTube's UI scrim.** The ground gradient below ~55%H, the bottom-left blob's true colour and extent, and any bottom-edge scrim belonging to the graphic itself are all unmeasurable.
- **Both corner marks are behind YouTube UI**, so this reference cannot be checked against style.md's "knock back to ~35% over light data-card layouts" rule or the baked drop-shadow rule.
- **The source video is not linked** — only a screenshot was supplied. Pulling the actual short would give real motion timing. Worth requesting; it is not a link this doc contains.

## Files

- `img-01.png` — the reference image, extracted from the HTML export (912×1596)
- `crop-scale.png`, `crop-caption.png`, `crop-chrome.png`, `crop-blob-tr.png`, `crop-blob-bl.png` — cited detail crops
- `doc_marked.txt`, `doc_stripped.html` — `anchor_comments.py` output (0 refs, 0 bodies)
