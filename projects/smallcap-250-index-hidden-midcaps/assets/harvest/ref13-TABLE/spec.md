# REF13 — the 11×2 TABLE beat: frame-layout reference

**Doc:** https://docs.google.com/document/d/1IbfjcUtiRy9ffU9xvTG2CTmgcQg9QzxKM92LSXaa2uc/edit
**Drive title:** "Copy of Copy of Then I need this type of frame(Ignore the youtube UI elements)…"
**Owner:** ezhilam@groww.in · created 2026-08-21T10:25Z · modified 2026-08-21T10:26Z · 1,842,803 bytes
**Anchored to script line:** "Abhi dekho, June mein rebalance hone se pehle abhi, iss index ke saare
funds mein more than 9% stocks already mid cap threshold cross kar chuki hai." + the 11×2 table +
"Source: Groww"
**Creator comment on the script (REF13, verbatim):** `Animate this table in the given reference.`

## Doc body — verbatim, complete

> [image]
>
> Then I need this type of frame(Ignore the youtube UI elements) where creator is in square mask, the
> mask should have drop shadow in it as shown in the reference, maintain similar background as shown
> in the reference( a gradient of both brand purple and brand green, a subtle grid with a very low
> opacity.)
>
> Here there is a graph animation in a white square rounded corner square box, instead of bar graph
> animation, I need chart animation of the table in the script.

**Comments on THIS doc: none.** Integrity check — HTML export: 0 inline `cmnt_ref` anchors, 0 comment
bodies; `read_file_content(includeComments=true)` returned no comment block. Zero resolved threads.
**Links in this doc or its comments: none** (`href` count in the export = 0). This doc is a **spec**,
not a pointer — it carries the reference image and the written direction. Nothing further to chase.

## The reference image — `img-01.png`, 986 × 1766 px, RGBA

A YouTube Shorts screenshot of a **Groww shorts** video (the Groww-shorts badge and Groww wordmark are
both present under the YouTube chrome). Live video content occupies **y 0–1761**; rows 1762–1765 are
white page padding. Reference frame for all percentages below: **986 × 1761** (aspect 0.560; ≈ 9:16
within screenshot-scaling error). Multiply x by **1.0954** and y by **1.0903** for 1080 × 1920.

### YouTube UI to subtract before reading colour (the creator said "ignore the youtube UI elements")

| UI element | Extent | Effect |
|---|---|---|
| Top scrim | y 0 → ~190, full width | darkens up to −80 luma; makes the top-left read far darker than the design |
| Left scrim | x 0 → ~170, full height | −25 to −45 luma |
| Bottom scrim + red progress bar | y ≈ 1745–1760 | progress bar `#E9333D` at y 1755–1760 |
| Mute button, CC / kebab / expand pill | over both corner logos | occludes the branding |

**Only the region x > 170, y > 200 is trustworthy for colour.** Everything below is measured there.

---

## 1 — Face mask (rounded square, top-centre)

| Property | Measured (986×1761) | % of frame | At 1080×1920 |
|---|---|---|---|
| Left / right | x 331 → 630 | 33.57% → 63.90% W | 363 → 690 |
| Top / bottom | y 139 → 505 | 7.89% → 28.68% H | 152 → 551 |
| Width × height | 300 × 367 | 30.43% W × 20.84% H | 328 × 400 |
| Aspect | **0.8174 : 1** | — | 0.82 : 1 |
| Centre | (480.5, 322) | 48.73% W, 18.29% H | (526, 351) |
| Corner radius | **52 px** | 5.27% W (17.3% of mask width) | 57 px |

The **0.82:1 aspect is an exact match** for the mask ratio already recorded in
`styles/groww-shorts/style.md` ("the crop that fills a 0.82:1 mask is 660×800 from (210,340)"), so the
existing verified crop transfers unchanged.

Mask centre sits **12 px (1.3% W) left of frame centre**; the card below sits 2 px left. Treat both as
centred unless the creator says otherwise — 12 px is at the edge of screenshot error but is a real,
repeatable measurement, so it is recorded rather than rounded away.

### Mask drop shadow — measured alpha profile

Alpha = 1 − (pixel luma ÷ local background luma), sampled where the mask interior is bright so the
edge is unambiguous.

| Distance outside edge | RIGHT (bg luma 179) | BOTTOM (bg luma 228) |
|---|---|---|
| +1 px | 0.357 | 0.481 |
| +3 px | 0.259 | 0.466 |
| +5 px | 0.196 | 0.437 |
| +7 px | 0.149 | 0.380 |
| +10 px | 0.095 | 0.284 |
| +14 px | 0.035 | 0.180 |
| +18 px | **0.007 (zero)** | 0.115 |
| +25 px | — | **0.004 (zero)** |

| LEFT | TOP |
|---|---|
| 0.074 at the edge pixel, 0 by +1 px | ≤0.06 within 3 px, 0 beyond |

**The shadow is strictly down-right and does not spill left or up.** Reach: **18 px right (1.83% W →
20 px at 1080)**, **25 px down (1.42% H → 27 px at 1920)**. Peak ~0.36 right / ~0.48 bottom, both
immediately at the edge.

No single CSS `box-shadow` fits: a symmetric blur that reaches 18 px right would put ≈0.25 alpha on the
left, and measured left is 0.07. Build it as a **layered/asymmetric elevation shadow** and verify
against the numbers above — e.g. two stacked shadows, `3px 6px 14px rgba(0,0,0,.42)` +
`1px 2px 4px rgba(0,0,0,.28)`, tuned until the profile matches. It is **`shadow-soft` in character**
(soft black, down-right) — not the hard `#53B091` `shadow-hard`, and there is **no `3px #14151A`
outline** (the mask edge is a single antialiased pixel, ~7% dark).

---

## 2 — The white data card

| Property | Measured | % of frame | At 1080×1920 |
|---|---|---|---|
| Left / right | x 111 → 870 | 11.26% → 88.24% W | 122 → 953 |
| Top / bottom | y 567 → 1291 | 32.20% → 73.31% H | 618 → 1408 |
| Width × height | 760 × 725 | 77.08% W × 41.17% H | 832 × 790 |
| Corner radius | **36 px** | 3.65% W | 39 px |
| Fill | `#FFFFFF` pure | — | — |
| Gap, mask bottom → card top | 62 px | 3.52% H | 67 px |

**The card carries NO drop shadow.** Measured: white → background completes in 2–3 px on every edge;
the largest residual undershoot anywhere is 1.5 luma (≈0.6% alpha) — noise, not a shadow. See
Conflicts §1.

### Card internals (bar-chart version, to be replaced by the table)

| Element | Measured | % of card |
|---|---|---|
| Title line 1 "INDIA'S IMPORT DEPENDENCE ON CRUDE OIL" | y 621–642, x 174–802, cap height **22 px** | top pad 54 px = 7.45% card H |
| Title line 2 "(PERCENTAGE)" | y 672–698, x 387–588 | line pitch **51 px** |
| Title colour | ≈ `#000000` (darkest core 0,0,0) | — |
| Title font size (cap ≈ 0.72 em) | ≈ **30 px** = 1.70% frame H → **33 px** at 1920 | — |
| Bars | 5 × **34 px wide**, pitch **115 px**, first bar left x 241 | 4.47% / 15.13% / 17.11% card W |
| Bar fill | **`#6376F7`** (99,118,247) | — |
| Baseline rule | y **1129**, x 160 → 815 (656 px), **1 px**, ≈8% black (`#EBEBEC` over white) | 77.5% card H; rule 86.3% card W |
| Value scale | **axis starts at ZERO**, 3.91 px per unit (85.5→334 px, 88.7→347 px) | — |
| Value labels | digit height **12 px**, centred on bar, **12 px** above bar top | — |
| X-axis labels | digit height **10 px**, top 12 px below baseline (y 1141–1150); 2nd line y 1158–1169 | — |
| Source line "Source : Parliamentary Questions and Answers" | y 1208–1219, left inset **50 px**, near-black | 6.6% card W |
| Publisher logo (bottom-right) | right edge x 814 → inset **56 px** | 7.4% card W |
| Card bottom padding | 1291 − 1219 = **72 px** | 9.9% card H |

### The highlight sweep — caught mid-animation

The reference frame was captured **during a left→right highlight sweep over the last value label**:

| Property | Measured |
|---|---|
| Block bbox | x 706 → 727 (**22 px wide**), y 757 → 770 (**14 px tall**) |
| Label it covers | "88.7", ≈30 px wide → the sweep has travelled **≈80%** across |
| Right edge | **hard, vertical** — a wipe, not a fade |
| Height vs text | digit height 12 px + **1 px above and below** |
| Fill colour | **`#60CFAC`** (96,207,172) — a mint/teal green |

`#60CFAC` sits between brand `accent #00D09C` and `mint #67F9C8`. It is **not `$amber`**, which is what
the style file mandates for highlight sweeps. See Conflicts §3.

---

## 3 — Background: gradient + grid

### Gradient

Diagonal, **periwinkle top-left → white mid-band → mint bottom-right**. Measured stops in the
YouTube-scrim-free region:

| Sample point (x, y) | % of frame | Hex |
|---|---|---|
| (90, 320) | 9.1%, 18.2% | `#98A0D4` periwinkle |
| (250, 560) | 25.4%, 31.8% | `#CCD2F9` pale periwinkle |
| (170, 1400) | 17.2%, 79.5% | `#EFF4FA` near-white, blue cast |
| (250, 1745) | 25.4%, 99.1% | `#F1FCFB` white |
| (650, 1745) | 65.9%, 99.1% | `#86E4CC` mint (strongest) |
| (975, 1400) | 98.9%, 79.5% | `#ACEAD9` pale mint |
| (975, 320) | 98.9%, 18.2% | `#EEF9F8` near-white cyan |

**This is `brand.md`'s `gradient-ground` token**, confirmed numerically:

| Token stop | brand.md | measured | Δ |
|---|---|---|---|
| periwinkle | `#9EA2C7` | `#98A0D4` | (−6, −2, +13) |
| mint | `#8AF0CB` | `#86E4CC` | (−4, −12, +1) |

Both within ~5% — YouTube's encode accounts for the rest. **Use the tokens, not these hexes.**

The creator's words "brand purple and brand green" map to `gradient-ground`'s periwinkle (a tint of
`$indigo #5367FC`) and mint (a tint of `$accent #00D09C`). There is no "purple" in the palette — the
periwinkle end is the intended colour.

A linear plane fit over 759,250 background pixels gives R `dR/dx = −0.008`, G `dG/dx = +0.048`,
B ≈ flat — i.e. **the gradient is carried almost entirely by the green channel rising left→right**,
with red falling. Build it as a 3-stop diagonal (≈135°), not a 2-stop.

### Grid

| Property | Measured | % of frame | At 1080×1920 |
|---|---|---|---|
| Vertical line pitch | **67.0 px** (x = 52, 119, 187, 254, 322, 389, 456, 524, …) | 6.80% W | **73.4 px** |
| Horizontal line pitch | **66.7 px** (y = 9, 76, 142, 209, 275, 342, 409, 475, 542, 609, 676, 742, …) | 3.79% H | **72.7 px** |
| Cell | essentially **square** | — | ≈73 × 73 px |
| First vertical line | x = 52 | 5.3% W | 57 px |
| Line width | **1 px** | — | 1 px |
| Line colour | **BLACK at ≈7–8% alpha** (e.g. bg (236,246,246) → line (220,226,227); predicted for pure black at α=0.081 is (217,226,226)) | — | — |
| Coverage | **full-bleed and uniform** — no fade, no edge weighting | — | — |
| Z-order | behind both the card and the mask | — | — |

See `still-grid.png` — the line reads as a faint **darker** rule, not a white one. See Conflicts §2.

---

## 4 — Corner branding (occluded by YouTube chrome, measured anyway)

| Mark | Measured (986-wide) | At 1080 |
|---|---|---|
| Top-left "Groww shorts" badge, indigo circle | dia ≈ **76 px** (±4, partly under YouTube's mute-button scrim), centre ≈ (80, 80) | dia ≈ 83, centre ≈ (88, 87) |
| "Groww / shorts" lockup text | x 129 → 232, y 80 → 107 | x 141 → 254 |
| Top-right Groww logo circle | x 755 → 803, y 63 → 110 → **49 × 48**, centre (779, 86.5) | dia ≈ 53, centre (853, 94) |
| Top-right wordmark "Groww" | out to x ≈ 943 | ≈ 1033 |

Style file says the badge is "~56–62 px dia, centre ~(98,98)" and the wordmark "x≈815–1015, y≈70–125".
The wordmark matches; **the badge measures ≈83 px and sits ≈10 px higher**. See Conflicts §4.

---

## 5 — What to actually build

The reference's crude-oil bar chart is the **layout and animation carrier only**. The content is the
job's 11×2 table (fund → mid-cap share, all 9.58–9.60%, Source: Groww).

**Every value is between 9.58% and 9.60%.** A bar chart of that data is eleven identical bars — it
carries no information and reads as a rendering bug. That is decisive for how to read the creator's
sentence; see Conflicts §5.

Frame recipe, at 1080 × 1920, 25 fps:

1. **Ground** — `gradient-ground` diagonal (≈135°): periwinkle → white → mint, plus a **73 px square
   grid of 1 px black lines at 7.5% alpha**, full-bleed, first vertical at x 57, drawn over the
   gradient and under everything else.
2. **Face mask** — rounded square **328 × 400** (0.82:1), radius **57 px**, at **x 363–690, y 152–551**
   (centre 526, 351). Fill it with the verified crop **660 × 800 from (210, 340)** of the raw frame.
   Down-right `shadow-soft` matching the measured profile: peak α 0.36 right / 0.48 bottom at the edge,
   zero by +20 px right / +27 px down, **nothing on the left or top**. No outline.
3. **Card** — white `#FFFFFF` rounded rect, **832 × 790** at **x 122–953, y 618–1408**, radius **39 px**,
   67 px below the mask. The reference shows **no shadow** here; see Conflicts §1 before deciding.
4. **Inside the card**, using the reference's own proportions:
   - Title band, top pad **59 px** (7.45% of card height), Inter Tight bold **≈33 px**, `$graphic-ink`,
     centred, line pitch 56 px. Suggested: `MID-CAP SHARE INSIDE SMALLCAP 250 INDEX FUNDS`.
   - Body block from the title's baseline down to **77.5% of card height** — the reference's plot
     region. Eleven rows in 790 × 0.775 − title ≈ **480 px** → **43.6 px per row**. Text ≈ 26 px
     Inter Tight to sit inside that.
   - Source line at the reference's position: baseline **72 px above the card's bottom edge**, left
     inset **55 px** (6.6% of card width), Inter Tight bold, `$graphic-ink`: `Source: Groww`.
5. **Table grid geometry — whole pixels, one rule weight** (style.md's data-table directive):
   card 832 wide, **24 px padding** → 784 inner. A **270 px** label column leaves **514** for one value
   column — not integer-friendly. Use **inner 784 = 544 label + 240 value**, both integers, so every
   vertical rule lands on a whole pixel. All rules **3 px `$rule-strong` `#CCCFD1`** — row rules, the
   bottom rule and the column rule alike. Carry hierarchy with a tinted row band, never a thicker line.
6. **Entrance (style.md, "land COMPLETE, then highlight")** — the whole table, header band, all eleven
   labels, **all eleven values**, every rule and the source line arrive inside the entrance, finishing
   **before the VO reaches "more than 9%"**. Rows may stagger ~0.18 s apart, all done well under a
   second. No count-ups; no populating cells across the beat.
7. **Highlight** — after the table has landed, one VO-synced left→right wipe with a **hard vertical
   leading edge**, block height = text height + 1 px top and bottom (the reference's 14 px over 12 px
   digits), sweeping the width of the value cell. Sequential, one row at a time, never two at once.
   Colour: see Conflicts §3.
8. **No dead space below the card** (style.md): the reference leaves y 1408 → 1920 empty; the house
   rule fills it with a topic-matched bobbing doodle bottom-left plus the candle doodle bottom-right.
   The reference does not show them — see Conflicts §6.
9. **Chrome** — badge top-left, wordmark top-right, from frame 1, knocked back to ~35% over this light
   card layout, each carrying the baked `shadow-soft` (`assets/logos/*-shadow.png`).

---

## Conflicts — flagged, not resolved

1. **Card shadow: reference vs `brand.md` golden rule.** `brand.md` — "every graphic element carries a
   drop shadow… nothing floats flat" — and style.md's "Every chart carries a depth drop shadow". The
   reference card measures **zero** shadow (edge transition completes in 2–3 px; residual ≤1.5 luma).
   The creator's sentence asks for a shadow only on the **mask**. Creator's call.
2. **Grid: dark, not white; 73 px, not 85 px.** `brand.md` and `styles/groww-shorts/style.md` describe
   `gradient-ground` as carrying "a faint **white** grid (~85 px cells) at ~10%". Measured here:
   **black at ~7.5%**, pitch **73 px** at 1080-equivalent. The doc says "a subtle grid with a very low
   opacity" without naming a colour. The image says dark.
3. **Highlight colour: mint vs amber.** style.md — "an `$amber` sweep left→right over ~0.3 s across the
   key cell". The reference's sweep is **`#60CFAC` mint/teal**. `brand.md` further forbids `$accent`
   green as "never data ink, never number emphasis". Following the style file gives amber; copying the
   reference gives green and breaks the accent rule. Creator's call.
4. **Badge size/position.** style.md: badge circle 56–62 px dia, centre (98, 98). Measured here:
   **≈83 px dia, centre ≈(88, 87)** at 1080-equivalent. The measurement is ±4 px because YouTube's
   mute-button scrim overlaps the badge — but it is not within 20 px of the style file's number.
5. **"chart animation of the table" — chart or table?** The comment on the script says *"Animate this
   **table**"*; this doc says *"instead of bar graph animation, I need **chart** animation of the table
   in the script"*; the reference frame holds a **bar chart**. The data is eleven values spanning
   9.58–9.60%, which no bar chart can render meaningfully. Reading: **build the table, animate it in
   this frame, in the card the chart occupied.** That is an interpretation, not an instruction —
   confirm before building.
6. **Empty lower third.** style.md: "No dead space below a table/chart card: fill it with topic-matched
   motion graphics… bottom-left, with the candle doodle bottom-right." The reference leaves y 1408 →
   1920 as bare gradient. Either the reference predates the rule or the rule does not apply to this
   layout.
7. **Card height vs 11 rows.** The reference card is 41.2% of frame height and holds a 5-bar chart with
   a two-line title. Eleven rows of long fund names ("ICICI Prudential Nifty Smallcap 250 Index Fund",
   45 chars) at 43.6 px per row inside a 832 px card is tight. Either the card grows past the
   reference's proportions, or the labels shorten to AMC name only ("ICICI Prudential"). Both change
   what the creator supplied. Creator's call.

## Unknowns — not invented

- **No durations, easings or frame counts anywhere** in this doc. The entrance/highlight timings in §5
  come from `styles/groww-shorts/style.md`, not from the creator.
- **No font named.** Falling back to Inter Tight per `brand.md`. The reference's own type is a generic
  grotesque (it is a third-party ThePrint infographic) and is not the channel's face.
- **The sweep's duration and direction-of-travel across rows** are unknown; only one frame exists.
  Direction (left→right) is certain from the hard right edge; speed is not.
- **The true top-left gradient corner is unmeasurable** — YouTube's top scrim covers it. Extrapolated
  from (90, 320) `#98A0D4`.
- **Whether the left-edge darkening is design or YouTube UI.** It runs full height, which is atypical
  for YouTube's scrim, but the top scrim is definitely YouTube's. Treated as UI.
- **No `Source:` wording given** for the rebuilt card. Using `Source: Groww` from the script beat.

## Files

- `img-01.png` — the reference frame, 986 × 1766, extracted from the HTML export
- `measure-overlay.png` — mask bbox (red), card bbox (magenta), chart baseline (orange), grid pitch (red)
- `still-mask.png`, `still-card.png`, `still-grid.png` — 1:1 crops
- `zoom-887.png` — the highlight sweep caught mid-travel (4× nearest-neighbour)
- `zoom-badge.png`, `zoom-wordmark.png`, `zoom-title.png`, `zoom-source.png`
- `doc_marked.txt`, `doc_stripped.html` — anchor_comments.py output (0 refs, 0 bodies, 0 links)
