# REF6 — "Nifty Smallcap 250 Index sirf saal mein do baar rebalance hota hai — June aur December mein."

Linked doc: https://docs.google.com/document/d/1TWoC2RNeYY2V4C8es4oLErKtLwXDel9gKyLMkR5m-Jo/edit
fileId `1TWoC2RNeYY2V4C8es4oLErKtLwXDel9gKyLMkR5m-Jo`

**Doc has 0 comments** (API `includeComments=true` returned none; `anchor_comments.py` found 0 refs / 0
bodies in the HTML export — so no resolved-comment gap either). **0 outbound links. 1 image.**
Not a pointer doc — it carries a real reference image plus explicit prose direction.

## Verbatim doc body

> [image]
> I need this type of motion graphics in full screen in similar background( subtle grid, gradient of white to purple as shown in the reference picture. Ignore the captions and captions shown in the reference picture. I also need same seesaw motion graphics with heading “ Nifty Smallcap Index rebalance” with same ivy presto funt and similar alignment.

## Creator comment on the script line (from the parent harvest)

> Use this type of frame and when text June and December comes, animate those text under with subtle black gradient.

## The reference image

`img-01.png`, 912x1596. It is a **screenshot of a YouTube Short** ("Why Equal Weight index beats
Cap-Weighted?", @MutualFundsWithGroww). The video area is inset at **x 9–906, y 0–1593 → 898 x 1594**,
aspect 0.5634 (= 9:16). All measurements below are in that 898x1594 frame; the `→` value is the
conversion to **1080x1920** (kx 1.2027, ky 1.2045).

Everything outside the video area — the play/mute pills, the CC + Groww pill top-right, the
@handle/title bar and the red progress bar at the bottom — is YouTube player chrome, not the graphic.

---

## 1. Background

| Property | Measured (898x1594) | At 1080x1920 | % of frame |
|---|---|---|---|
| Gradient, top-left corner | `#D9DDFC` periwinkle | — | (4%W, 9%H) |
| Gradient, upper-right | `#FDFDFF` near-white | — | (86%W, 17%H) |
| Gradient, mid-right | `#F6F7FE` | — | (86%W, 32%H) |
| Gradient, mid-left | `#EAECFE` | — | (4%W, 47%H) |
| Dot-grid pitch | **81.0 px** both axes (measured dy 81.3/80.7/81.2/81.5/79.7/81.5/81.5; dx 80.9/80.9) | **97.4 px** | 9.02%W / 5.08%H |
| Grid anchor | x = 83.7 + 81.0n, y = 142.0 + 81.2n | — | — |
| Dot diameter | ~6 px (half-depth width 5–6 px) | 7.2 px | 0.67%W |
| Dot colour | neutral black, delta (−19,−19,−17) on a 224 ground → **alpha ≈ 0.085** | — | — |
| Connecting hairlines | ≤ 0.5 luma dip — effectively invisible; this is a **dot lattice**, not a line grid | — | — |

**Diagonal read:** periwinkle in the top-left corner, brightening to white through the centre and
upper-right. No mint, no green anywhere in the ground.

### Corner blobs (soft-blurred indigo)

| | Measured | % of frame |
|---|---|---|
| Top-right blob core colour | `#5F69E6` (95,105,230) | — |
| TR blob bbox | x 662–897, y 0–~290 | x 73.7–99.9%W, y 0–18.2%H |
| TR feather | ~80–90 px horizontally, ~165 px vertically (Gaussian, sigma ≈ 30–40 px) | — |
| Bottom-left blob | mirrored in the bottom-left corner, first visible at y≈1300 | from 81.6%H |

The BL blob's true extent cannot be measured — it sits under the scrim (below).

### Bottom black gradient

Alpha, derived against a 240-luma un-scrimmed base on a clean column (x 300–340):

| y | %H | alpha |
|---|---|---|
| 855 | 53.6% | 0.00 (onset) |
| 995 | 62.4% | 0.086 |
| 1145 | 71.8% | 0.144 |
| 1295 | 81.2% | 0.251 |
| 1445 | 90.7% | 0.415 |
| 1570 | 98.5% | 0.811 |

**Feather depth 739 px = 46.4% of frame height → 891 px at 1080x1920.** Smooth S-curve, no findable
inward edge. This is within a couple of points of `style.md`'s edge-scrim rule (~0.94 at the edge,
true zero over ~48%H, ~920px) — it corroborates that rule rather than replacing it.

**Caveat:** because this is a YouTube Shorts screenshot, this scrim is at least partly YouTube's own
player-UI gradient. Do not treat it as proof the creator's graphic carried one.

---

## 2. Heading

Ivy Presto, **italic** (measured stem slant 12.7°: the 'N' left edge runs x 278 @ y304 → x 269 @ y344),
`$indigo` (darkest sampled 98,112,231), two lines, **centre-aligned on the frame centre**.

| Property | Measured | At 1080x1920 | % of frame |
|---|---|---|---|
| Line 1 "Nifty 50 Equal" bbox | x 269–628, y 299–358 | x 323–756 | 30.0–69.9%W |
| Line 2 "Weight Index" bbox | x 290–620, y 373–432 | x 349–746 | 32.3–69.0%W |
| Line 1 centre / Line 2 centre | x 448.5 / 455.0 (frame centre 449) | — | 49.9%W / 50.7%W — centred |
| Ascender top, line 1 | y 299 | 360 | 18.76%H |
| Baseline, line 1 | y 345 | 415.6 | 21.64%H |
| Ascender top, line 2 | y 373 | 449.3 | 23.40%H |
| Baseline, line 2 | y 419 | 504.7 | 26.29%H |
| Cap / ascender height | **46 px** | **55.4 px** | **2.89%H** |
| x-height | 31 px | 37.3 px | 1.94%H |
| Descender | 13 px | 15.7 px | 0.82%H |
| Baseline-to-baseline | **74 px** | **89.1 px** | 4.64%H |
| Derived font-size | ≈ 66 px (cap/em 0.70) | **≈ 80 px** | — |

No drop shadow, no glow, no stroke on the type (background recovers to within 1 luma immediately
below the baseline).

---

## 3. Seesaw

Sits on the frame's vertical centre line. All parts solid `$indigo` measured at **#6170F4** (97,112,244)
— consistent across the column, hub core, both nodes and both pans, std < 2. That is `$indigo`
`#5367FC` after YouTube 4:2:0 chroma drift; **build with the token, not the sampled hex.**

### Pivot

| Part | Measured | At 1080x1920 | % of frame |
|---|---|---|---|
| Hub centre | (441.5, 575.5) | (531, 693) | 49.2%W, 36.1%H |
| White ring, outer Ø | 50–51 px | 61 px | 5.6%W |
| Indigo core Ø | 33–34 px | 40.5 px | 3.7%W |
| Ring thickness | 8 px | 9.6 px | — |
| Cap above the ring | x 432–452 (w 21), y 545–550 (h 6) | 25 x 7 px | — |

### Column and base

| Part | Measured | At 1080x1920 |
|---|---|---|
| Column | x 431–453 (**w 23**), y 601–956 (**h 356**) | w 27.7, h 428.6 |
| Column centre x | 442 | 531.6 (49.2%W) |
| Plinth (lighter, `#A3AAE9` ≈ indigo @ 50%) | x 378–505 (**w 128**), y 957–972 (**h 16**), radius ~8 | 154 x 19, r 9.6 |
| Base bar (`#5B68E2`) | x 336–546 (**w 211**), y 973–1007 (**h 35**), radius ~12 | 254 x 42, r 14.4 |
| Base bar % | — | w 23.5%W, h 2.2%H, top edge 61.0%H |

### Beam

A **translucent indigo bowtie**, not a constant-width bar: thickest at the hub, tapering to a point
at each node.

| Property | Measured | At 1080x1920 |
|---|---|---|
| Left node centre | (207.5, 535), Ø 17 px | (249.6, 644.3), Ø 20.5 |
| Right node centre | (689.5, 615.5), Ø 18 px | (829.3, 741.4), Ø 21.7 |
| Node-to-node length | 488.7 px | 588 px (54.5%W) |
| **Tilt** | dy 80.5 / dx 482 → **9.49° down to the right** | same angle |
| Beam thickness at the hub | ~22 px total | 26.5 px |
| Beam thickness at each node | ~1–2 px (a point) | — |
| Beam taper (left wing) | t=5 @ x260, 7 @ x280, 17 @ x400 → 0.083 px/px | — |
| Beam taper (right wing) | t=20 @ x470, 1 @ x670 → 0.095 px/px | — |
| Beam colour | `#B4B9FA` over an `#E9EBFD` ground → **indigo at alpha ≈ 0.37** | — |
| Node % positions | L (23.1%W, 33.6%H) · R (76.8%W, 38.6%H) | — |

### Hangers and pans

| Property | Measured | At 1080x1920 |
|---|---|---|
| String stroke | **6 px**, constant | 7.2 px |
| String geometry | apex at the node, two legs to the pan-bar top corners; half-spread 99 px over 218 px drop → **24.4° half-angle** | — |
| Node → pan-top drop | 224 px (L) / 221.5 px (R) | ~268 px |
| Left pan bar | x 97–317 (**w 221**), y 759–778 (**h 20**) | 266 x 24 |
| Right pan bar | x 579–800 (**w 222**), y 837–855 (**h 19**) | 267 x 23 |
| Pan shape | **trapezoid, wider at the top**: top 221 px, bottom 193 px → sides inset 14 px per side over 20 px height | inset 16.8 px |
| Pan centres | x 207 (L) / 689.5 (R) — exactly under their nodes | — |

### Payload icons

| Property | Left | Right |
|---|---|---|
| bbox | x 163–256, y 624–755 | x 646–735, y 701–833 |
| size | 94 x 132 px | 90 x 133 px |
| % of frame | **10.5%W x 8.3%H** | 10.0%W x 8.3%H |
| at 1080x1920 | 113 x 159 | 108 x 160 |
| median colour | (188,188,191) neutral grey | (187,186,188) neutral grey |
| seat | bottom sits **4 px above** the pan-bar top, centred on the pan | same |

**They are the same asset at the same size on both pans** — a neutral-grey 3D office-building cluster.
The apparent size difference is an illusion from the tilt.

### Drop shadows: there are NONE

Probed below the base bar, below both pan bars and below the heading baseline: background luma returns
to its ambient value within 2 px of every edge (e.g. base bottom edge y1007 = 201 → y1008 = 224 =
ambient 224). **Every element in this reference is flat.**

---

## Conflicts (flagged, not resolved)

1. **Ground vs `style.md` `gradient-ground`.** Style says periwinkle→white→**mint** diagonal
   (`#9EA2C7→#D3DEF4→#8AF0CB`) with a **white** ~85 px grid at ~10%. The reference measures
   `#D9DDFC`→`#FDFDFF`, **no mint anywhere**, and a **dark** dot lattice (black @ 8.5%) at **81 px
   (97 px at 1080)**. The creator's doc names the ground explicitly ("gradient of white to purple as
   shown in the reference picture"). Creator's doc vs style file — her call.
2. **No drop shadows.** `brand.md`'s golden rule is "every graphic element carries a drop shadow —
   nothing floats flat", and `style.md` repeats it for charts. This reference has zero shadow on any
   element, and she asked for "this type of motion graphics ... in similar background". Her call.
3. **Heading text drops the "250".** She dictates “ Nifty Smallcap Index rebalance”; the script line
   is "Nifty Smallcap **250** Index". Channel bar is "matching the words she's saying", which argues
   for "Nifty Smallcap 250 Index rebalance" — but she wrote the heading out explicitly. Her call.
4. **Heading size.** Measured ≈ 80 px at 1080x1920. `style.md`'s serif takeover titles are ~190 px /
   ~130 px. "Similar alignment" and "same ivy presto funt" are what she asked for; the size is far
   smaller than the style file's takeover-title figures.
5. **Reference captions are off-style** — white bold sans with a heavy black outline, no chip —
   against `style.md`'s near-opaque black chip with amber karaoke. She said to **ignore** the
   captions, so this is not an instruction; noted only so nobody copies it.
6. **Metaphor mismatch.** A balance scale reads "equal weighting", which is what the source video
   used it for. This beat is about *rebalancing twice a year*. She explicitly asked for the same
   seesaw. Her call.
7. **Chrome knockback.** `style.md` says both bugs drop to ~35% opacity over light data-card
   layouts. This is a light full-frame layout, but the reference's chrome is occluded by YouTube's
   own pills so the knockback cannot be verified here.

## Unknowns

- **No motion spec exists.** "Seesaw motion graphics" is supplied as a **single still**. Tilt
  amplitude, oscillation period, easing, whether it settles or keeps swinging, entrance and exit are
  all unspecified. The 9.49° in the frame is one instant — it may be the amplitude peak or mid-swing.
- **Where June and December go** is unspecified: on the two pans, on the beam, or under the seesaw.
- **Whether the grey building icons stay** or are replaced by the June/December labels.
- **"animate those text under with subtle black gradient"** is ambiguous — "under" reads most
  naturally as a scrim *behind/under* the text (matching `style.md`'s "contrast scrim under
  everything"), but could mean positioned *underneath* the seesaw.
- **No source line** in the reference; `style.md` requires one under every data graphic. Whether this
  counts as a data graphic is unstated.
- **Ivy Presto optical size/weight** not named. Italic is confirmed by measurement (12.7° slant).
- **Beat duration / hold** not given.
- **Assets not supplied**: the neutral-grey 3D building cluster, and the blurred corner blobs.
