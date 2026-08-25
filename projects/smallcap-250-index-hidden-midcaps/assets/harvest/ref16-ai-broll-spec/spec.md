# REF16 — AI b-roll spec (Small Cap piggy bank)

**Doc:** https://docs.google.com/document/d/1KzcBVBZ3x-RCsjpWRWOIAXT5PesV2BmKOFDj88rzOXU/edit
**Doc title:** "Same animation where an man is putting coins in piggy bank names mid cap, but in this generation only piggy bank small is there"
**Anchored to script line (REF16):** "Aap assume karte ho ki aapka poora paisa pure small cap risk le raha hai."
**Creator comment on the parent script at REF16:** "AI roill generation is specified in this."

## Verbatim body (the whole doc)

> [image]
>
> Same animation where an man is putting coins in piggy bank names mid cap, but in this generation only piggy bank small is there. Take the reference of above picture.

## Comments on THIS doc

None. `read_file_content(includeComments=true)` returned no comment tags; the HTML export contains
**0 `cmnt_ref` anchors and 0 comment bodies**. No resolved-thread discrepancy either (API thread list
and export both empty). All the direction is the one body sentence + the image.

## Links

**None.** 0 `href=` occurrences in the full 5.78 MB HTML export. This doc is a terminal leaf — it is
not a pointer, and there is no third level to chase.

## The reference image — measured

`img-01.png`, **2048 x 992 px** (aspect 2.0645:1 — a 16:9-ish landscape still, i.e. a frame grab from
a **horizontal** video, not a 9:16 short). Placed in the doc at 601.70 x 292.00 pt.

### Scene
Photoreal live-action / AI-photoreal: a man from chest to thigh, navy-grey button shirt tucked into
navy trousers with a black leather belt, standing behind a grey desk, dropping a **gold coin** held
between thumb and forefinger into the slot of a labelled ceramic piggy bank. Three piggy banks stand
in a row on the desk: **green "Large Cap"**, **blue "Mid Cap"**, and a third **orange/amber** one
cropped by the right frame edge (its flank label is off-frame — by the video's own logic this is the
Small Cap pig). His left hand rests on the desk beside the orange pig. Light grey textured wall
behind; a stack of blue books blurred at bottom-left.

### Element bounding boxes (px, and as % of frame — the transferable form)

| Element | px bbox | w x h px | x as %W | y as %H | w %W / h %H |
|---|---|---|---|---|---|
| Green pig "Large Cap" | x372–1009, y385–918 | 638 x 534 | 18.2–49.3% | 38.8–92.5% | 31.2% / 53.8% |
| Blue pig "Mid Cap" | x1098–1748, y381–943 | 651 x 563 | 53.6–85.4% | 38.4–95.1% | 31.8% / 56.8% |
| Orange pig (cropped) | x1830–2047, y372–785 | 218 x 414 | 89.4–100% | 37.5–79.1% | 10.6% / 41.7% |
| Gold coin | x1156–1256, y70–164 | 101 x 95 | — | — | 4.93% / 9.58% |
| Blue pig coin slot | x1330–1599, y≈382–392 | 270 long | 65–78% | ~39% | 13.2%W (≈41% of that pig's width) |
| Belt band | full torso, y213–382 | — | — | 21.5–38.5% | — |
| Torso at y=150 | x638–2019 | — | 31.2–98.6% | — | — |
| Desk / wall horizon | y = 437 | — | — | **44.1%H** | — |

- Pig centres: green **cx 33.7%W**, blue **cx 69.5%W** → centre-to-centre spacing **35.8% of frame width**.
- Gap between the two pig silhouettes: **89 px = 4.3% of frame width**.
- Pigs stand on the desk with their feet at **92.5%H** (green) / **95.1%H** (blue) — the row sits low,
  bottom-heavy in frame.
- Coin is held **directly above the blue pig's slot** (coin cx 58.9%W vs slot span 65–78%W — released
  slightly left of the slot centre, i.e. mid-fall) at **cy 11.8%H**, near the top of frame.

### Sampled colours (hex, and how they sit against brand.md tokens)

| Element | Sampled | HSV | Nearest brand token | Verdict |
|---|---|---|---|---|
| Green pig body | `#02BAB1` | 177.1° / 99% / 73% | `accent` `#00D09C` (dist 30.5) | **Off-palette** — 12° more cyan, 9% darker |
| Green pig lit face | `#5ACCC4` | 175.8° / 56% / 80% | `mint` `#67F9C8` (dist 47.0) | off-palette |
| Green pig shadow | `#01736B` | — | — | — |
| Blue pig body | `#487AE9` | 221.4° / 69% / 91% | `indigo` `#5367FC` (dist 29.0) | **Off-palette** — 12° more cyan, 7% darker |
| Blue pig lit face | `#7F9FF1` | 223.2° / 47% / 95% | `indigo` (72.1) | off-palette |
| Orange pig | `#E0A020` | **40.0°** / 86% / 88% | `amber` `#FCB31C` (40.4°) | **hue is an exact match**; 11% darker in value |
| Coin (lit) | `#DFBD88` | 36.6° / 39% / 88% | none | prop brass |
| Wall | `#CDCDCD` | neutral / 80% | `rule-strong` `#CCCFD1` (dist 4.6) | effectively `rule-strong` |
| Desk | `#5D5D5D` | neutral / 37% | `ink` `#44475B` (33.4) | neutral grey |
| Shirt | `#20222A` | 228° / 24% / 17% | `ink` (71.2) | near-black navy |
| Belt | `#1E1E21` | — | — | near-black |
| Labels | white | — | `white` | white |

### Typography on the props
Labels are **painted onto the pig flank in perspective**, following the curvature of the body — not
flat overlaid text. Heavy geometric/grotesque sans, ALL-white, two lines, left-aligned-ish, ranged
on the pig's shoulder-to-belly.
- "Large Cap": block x708–921, y591–760 → **10.4%W x 17.0%H**; centre (39.8%W, 68.0%H).
  Line 1 "Large" cap-height **69 px = 6.96% of frame height** (baseline y≈660);
  line 2 "Cap" reads smaller (**cap-height ≈54–57 px**) because it sits lower on the curving belly.
- "Mid Cap": block x1443–1622, y544–749 → **8.8%W x 20.8%H**; centre (74.8%W, 65.2%H).
  Line 1 "Mid" cap-height **69 px = 6.96% of frame height**; line-to-line pitch **85 px = 8.6%H**.
- **Rule that transfers: the label cap-height is ~7.0% of frame height, and the label block is
  ~9–10% of frame width — roughly one third of the pig's own width.**

### Focus / depth of field
Laplacian variance (sharpness): pig surface **12.5–38.3**, wall **8.5**, desk **1.6**, shirt **0.27**.
So: **shallow DOF, focus plane on the pigs**; the man's torso is heavily defocused, the desk and wall
softly defocused. Corner vs centre luma [TL 204.5, TR 67.6, BL 79.6, BR 59.2, centre 51.4] — the
brightness falls off to the right and down because of the subject, not a vignette.

### The dust screen is ALREADY on this reference — and it is the house one
FFT on a flat wall patch returns a **45° dot lattice**: peaks at (dy,dx)=(±23,±23) over a 256px
window → **diagonal period 7.87 px, H/V repeat 11.13 px at 2048 px width**. Normalised to
**1080 px width that is H/V 5.87 px and diagonal 4.15 px** — against brand.md's measured dust of
**5.80 px H/V and 4.09 px diagonal**. Same screen, within 1.2%.
Amplitude: high-pass std **5.72** on a mean of **204.5** = **2.79% RMS** (brand.md: ~3% multiplicative).
Neutrality: high-pass std is **5.72 on all three of R, G and B**, and the wall means are R204.5 /
G204.5 / B204.9 — **perfectly neutral, zero colour cast**, exactly as brand.md requires.
**Conclusion: this frame is a grab from an already-finished channel b-roll shot with the house dust
plate applied. Do not double-apply the dust when compositing the new generation — apply it once, in
FFmpeg, per brand.md.**

## Build spec — what to generate

**Beat:** REF16, script line "Aap assume karte ho ki aapka poora paisa pure small cap risk le raha hai."
**Type:** full-frame AI-generated photoreal b-roll (concept line, no numbers → per style.md this is a
metaphor b-roll with the prop labelled in-world; presenter fully off screen, only the corner bugs on top).

Regenerate the **same shot and same animation** as the reference — man in a navy-grey shirt and black
belt, standing behind a grey desk, dropping a gold coin into a labelled ceramic piggy bank —
but with **only ONE piggy bank in frame, labelled "Small Cap"**, and the coin going into *that* pig.

Geometry, carried over from the measurement above and re-centred for a single subject:
- Framing: chest-to-thigh crop of the man, head out of frame. Desk/wall horizon at **44%** of frame height.
- The pig occupies **~32% of frame width and ~55% of frame height**, feet at **~93%** of frame height,
  and — being the only prop — sits **centred, cx ≈ 50%W** (the reference's two-pig cx were 33.7% and 69.5%).
- Slot on the pig's back at **~39%H**, slot length **~41% of the pig's own width**.
- Coin: **~5% of frame width** in diameter, entering from the top of frame, held between thumb and
  forefinger, released above the slot; the coin's fall is the animation.
- Label "Small Cap" painted in perspective on the pig's flank, heavy white grotesque sans, two lines,
  **cap-height ~7.0% of frame height**, block ~9–10% of frame width, centred around (label centre
  ≈ 65–68%H of frame).
- Shallow depth of field: pig tack sharp, man's torso strongly defocused, wall softly defocused.
- Grade: cool neutral. Wall `#CDCDCD`, desk `#5D5D5D`, shirt `#20222A`, belt `#1E1E21`.
- Pig colour: **see conflict C1** — the reference's Small-Cap-position pig is amber `#E0A020`
  (hue-matched to `$amber`), while the two labelled pigs are teal and blue.
- Aspect: the reference is **2.06:1 landscape**; this job is **1080x1920 @ 25 fps**. Generate/reframe
  to 9:16 with the pig centred and the horizon at 44%H — do not letterbox the landscape plate in.
- **Dust:** apply the house 45° halftone dot screen **once**, in FFmpeg, 5.80 px H/V repeat at 1080 px
  width, neutral, ~3% multiplicative (`blend=all_expr='clip(A*(1+(B-128)/512),0,255)'` against a
  128-centred plate). The reference already carries it — do not stack a second pass.
- **No captions over this beat** (style.md, creator directive 2026-08-23: no captions over AI b-roll).
- Hard cut in and out; no added Ken Burns — the coin drop is the only motion. Duration 1.4–5.5 s.
- Corner branding stays on top at full opacity (dark-ish b-roll frame).
- "*AI generated" tag stays per style.md.

## Conflicts

**C1 — pig colour vs `brand.md`.** The reference's props are brand-*adjacent* but measurably
off-token: green `#02BAB1` vs `$accent #00D09C` (12° hue apart), blue `#487AE9` vs `$indigo #5367FC`
(12° apart). Only the amber pig hue-matches (`40.0°` vs `40.4°`). brand.md says "nothing outside this
list enters a frame", which was written about graphic ink, not photographic props. Matching the
reference exactly means putting two off-palette colours on screen; forcing the tokens means the new
generation will not match the reference the creator pointed at. **Creator's call — do not resolve
silently.** Recommended question: should the single Small Cap pig be the amber `#E0A020` one from the
reference lineup (visually continuous with it, and hue-matches `$amber`), or `$accent` green?

**C2 — reference aspect vs job aspect.** The reference frame is 2048x992 (2.06:1 landscape). This is
a 1080x1920 vertical short. Every measurement above is given as a percentage so it transfers, but the
composition itself must be re-shot vertical — the three-across pig row does not exist in 9:16, which
is a second, independent reason the shot reduces to one pig.

**C3 — the doc title and body contradict each other on which pig.** The title/body say "piggy bank
names mid cap" (the reference), then "in this generation only piggy bank small is there". The
anchored script line is about **small cap** risk, so "Small Cap" is the label to paint. Flagged
because the sentence is genuinely ambiguous — see Unknowns.

## Unknowns

1. **"only piggy bank small is there"** parses two ways: (a) *only the Small-Cap piggy bank is
   present* (one pig, labelled "Small Cap") or (b) *the piggy bank is physically small*. Reading (a)
   is taken above because the anchored line is about small-cap risk and because a 9:16 frame cannot
   hold the three-pig row. Confirm with the creator.
2. **Duration, easing, coin count.** The doc says "putting coin**s**" (plural) but the reference still
   shows one coin mid-fall. No duration, no easing, no frame count anywhere in the doc. Fallback used:
   style.md's b-roll range, **1.4–5.5 s**, hard cut both ends.
3. **Provider.** The doc does not name a generation engine. Per CLAUDE.md this is per machine —
   Higgsfield where connected, else Kie.ai. (Note: the Higgsfield MCP server is currently
   **unauthorised** in this session.)
4. **Exact beat timestamps.** `projects/smallcap-250-index-hidden-midcaps/transcript/` is **empty** —
   stage 1 (WhisperX) has not run, so the in/out points for this beat cannot be given yet.
5. **The orange pig's label.** It is cropped out of frame in the reference, so "Small Cap" is inferred
   from the Large/Mid sequence, not read.

## Files

- `img-01.png` — the reference frame, 2048x992
- `img-01-detail-orange-pig.png` — right-edge crop, 2x, showing the amber pig and the dust screen
- `img-01-detail-coin-hand.png` — coin/hand/belt crop
- `doc_marked.txt`, `doc_stripped.html` — anchored export (0 refs, 0 bodies, 0 links)
