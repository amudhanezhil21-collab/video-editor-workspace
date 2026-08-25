# Style: groww-longform

The "Intelligent Investors × Groww" long-form mutual-fund video. Absorbed from the creator's Script-to-Edit Instruction Sheet (2026-08-16, verbatim in `reference/instruction-sheet.md`) and its 24 reference stills (`reference/figures/`), all from the published bar video *Bandhan Small Cap Fund vs Nippon India Small Cap Fund*.

How every frame looks and behaves.

## Format

- 3840×2160 (16:9), **25fps**. Runtime ~10–16 min.
- Chrome on **every** frame including B-roll and full-screen graphics: "Intelligent Investors" badge top-left, Groww logo + wordmark top-right, small watermark bottom-right. Always the topmost layer, never under a composite.

## Non-negotiables (§1)

| Rule | In the edit |
|---|---|
| Disclaimer first | Supplied card, **3 seconds exactly**, total silence. Never rebuilt or re-timed |
| Rolling disclaimer | Supplied SEBI crawl at the reference-matched frames (post-endscreen) |
| Endscreen | Supplied clickable-slot endscreen, exactly 10.0s after the sign-off |
| Brand transition | Supplied transition ONLY at the script's instruction→main marker |
| Subscribe unit | Whenever VO says like/share/subscribe: bar + SUBSCRIBE + bell, cursor clicks BOTH |
| Every table is shown | Every table, column, graph, news element, screenshot in the script reaches the screen |
| Every source is shown | Every reference visual carries its source line visibly beneath it |
| Logo lock-up | Badge top-left + Groww top-right on every single frame |
| The creator is never covered | She renders IN FRONT of every card, and cards are sized to clear her plate outright |
| One background system | All creator-less scenes share the same grid background |
| Brand colour only | No off-brand colour enters any frame |

## The Visual & Data Editing Framework (§2 — governs everything else)

Every script is two documents: the dialogue she performs, and reference material she never speaks aloud that exists solely to be put on screen.

1. **The unspoken rule.** Silence about an element is not permission to drop it — it is the instruction to show it.
2. **Mandatory inclusion.** Never omit any table, screenshot or data point. Inventory every asset and tick it against a frame before the edit is called done.
3. **Absolute data accuracy.** Character-for-character. No rounding (18.36 ≠ 18.4), no re-ordering, no re-labelling. A value never appears stripped of the comparison column beside it. As-of dates go on screen with their data.
4. **Charts reproduced curve-for-curve.** Every peak, trough and crossover where the source puts it; candles body-by-body with exact up/down colours; axes never rescaled; every series drawn; legend and order unchanged. Rebuilt charts plot the same values — animate the draw-on, never redraw the data.
5. **Source attribution.** Verbatim, beneath the visual, legible at delivery resolution, present as long as the visual. Two visuals = two source lines.
6. **Marks reach the screen.** Star markers, fund-name labels — if the script marks it, it is displayed.
7. **Precise timing.** Each asset lands on its exact dialogue line and leaves when the VO moves on.
8. **Data dissection.** Never hold a static frame: reveal row by row, isolate the figure being spoken, bring the comparison in second, animate to value, step on. Dissection changes pacing, never numbers.
9. **Motion graphics carry the data** — a chart, table or screenshot from the script becomes an animated graphic, never a static still.

**Finished-edit checklist:** every table on screen · every screenshot on screen · every data point character-exact · every chart curve-exact · every visual sourced · every marker and label shown · every asset on its exact line · nothing static long enough to read as a still.

## Style tokens (measured from the reference figures)

| Token | Hex | Role |
|---|---|---|
| `$lf-indigo` | `#5771EB` | Workhorse: serif emphasis, data panels, pie/chart fills, strokes, journey lines |
| `$lf-indigo-deep` | `#595ED4` | Big data values in sans |
| `$lf-banner` | `#8191E4` | Section banner fill (candlestick texture, white serif title) |
| `$lf-grid-light` → `$lf-grid-peri` | `#EBEBEB` → `#8B9BEF` | The shared grid background gradient |
| `$lf-lilac` | `#DEDCF8` | Soft depth spheres |
| `$lf-amber-hi` / `$lf-mint-hi` | `#F1CB8E` / `#A8E7C3` | Highlight fills on the spoken segment/row |
| `$lf-row-band` | `#2151AD` | Darker band behind the spoken table row |

Every colour carries a subtle white gradient — nothing flat. `$accent` green stays identity-only plus the mint highlight family. Series colours are data (§2.4), never restyled.

## Typography

Ivy Presto (display serif, italic) carries the emphasised half of a line; Inter Tight (sans) the neutral half — **never one family alone**. Panel titles white serif italic; rows white sans; fund names indigo serif italic; source lines small indigo sans. **Text animates in word by word, brand purple, right-to-left applied IN PLACE** — each word appears at its own final position; nothing flies in from the frame edge.

## Backgrounds and plates

- **Creator-less frames:** the shared grid background (white→periwinkle, faint grid + dot lattice, lilac depth spheres) — same every such scene.
- **Creator frames:** the generated warm home-studio background, positioned so text/graphics land where they pop. Creator sits left when data enters right.
- **Blur gradient behind on-screen text**, matched to the background so it merges.
- **Feathered black gradient over the creator**, strictly: creator → gradient → text/illustrations.
- Plates: green screen, keyed (CorridorKey neural tier for delivery, ffmpeg fast tier for drafts), straight alpha, colour/black-level matched to the background. Full recipe in the job's `graphics-build/KEYING.md`.

## Depth and finish

Circles, icons and cards carry a stroke for depth (motion on the stroke preferred). Callout boxes are never plain — internal design + subtle gradient. B-roll (AI and real) gets a dust/texture pass inside a black box on all four sides.

## Scene recipes

**Opening:** supplied disclaimer 3s silent → hook (creator + serif/sans line + illustrations rising bottom-to-top with real internal motion) → topical B-roll in a black box with dust → "funds in a race" piggy banks with progression tails on the grid → fund-name circles with strokes → subscribe unit on the like/share/subscribe line → supplied brand transition at the marker.

**Comparison:** icons pop on (depth stroke) → on "both are X funds" they close in and shrink → the category title resolves word-by-word, purple, right-to-left in place → icons dissolve → pie animates in with gradient fills and the spoken segment highlighted. Benchmark/launch date: creator moved left, banner + serif fund name + sans value entering bottom-to-top, launch dates in a designed callout box — repeated for the second fund.

**Deep dive:** every sub-topic opens with the same topic card (grid + big indigo serif italic title + rotating gold coins) — continuity is the point. Founder journeys: vertical progressive line with dots, one per career beat, source + as-of beneath.

**Tables:** indigo rounded panel, white sans rows, hairline separators, values right-aligned with **fund-name column headers**, the spoken row highlighted (mint chip or dark band), fund name in serif italic above, source line below; creator kept in frame or the panel taken full screen.


### The creator is never covered (creator directive 2026-08-24)

Two rules, and **both** are needed — either alone leaves it to luck.

**1. Layer order. She goes in FRONT of the card.**

    ground → floating props → HER PLATE RECTANGLE → the card(s) → HER MATTE → chrome

The plate splits in two: the translucent rounded rectangle sits behind the card, her cut-out sits in
front of it. This is what the reference frames actually do — in both of them the table's bottom
corner is **occluded by her hair**. Building the plate as one layer under the card put a table
across her face for eighteen seconds, measured at 362px of card over her.

**2. Geometry. A single card takes only the space she is not in.**

At 1920×1080 her plate occupies **x 112–464** (variant A, bottom-left) or **x 1454–1806**
(variant B, bottom-right). Title-safe is x 192–1728. With a 30px gutter either side of her:

| variant | card spans | width |
|---|---|---|
| A (she is left) | x 494 → 1728 | ~1234 |
| B (she is right) | x 192 → 1424 | ~1232 |

So a single card is **~1230px wide, not the reference's 1415**. The reference measurement is taken
from a frame where she overlaps the card — reproducing that width *without* reproducing the z-order
is what puts the card on her face. Multi-card layouts (stacked halves, side-by-side) already clear
her; check them against these bounds rather than assuming.

**Verify by measurement, not by eye.** Find the card's ink extent and assert it ends before her
plate begins. A glance at a mid-build frame will not show this — the card fades in over the top of
her, so the overlap only becomes visible once it is fully opaque.

## Transitions (§9 — weighted equally with scenes)

A-roll↔B-roll: zoom in/out (zoom-ins are legal on the creator frame too, not only at transitions — creator directive 2026-08-21), optional brand-primary light leak · instruction→main: the supplied brand transition · icon beat→pie: shrink, close, retitle, dissolve, then the pie · section→topic card: straight cut on the same background, coins rotating · within a frame: every element enters bottom-to-top, text word-by-word purple right-to-left in place. Transition *dialects* are per-video (audit finding): pick one and hold it for the whole video.

## References

`reference/instruction-sheet.md` (verbatim + figures 01–24) · `reference/creator-notes.md` · `reference/reference-audit.md` and `reference/frame-grammar.md` (the frame-by-frame audit of the three published bars — now reference and flagging basis, no longer the decider) · bars: youtu.be/ApidfQ73dMI, youtu.be/t_LzkOZA5SQ, youtu.be/7UxrXvcd2Eg.


### Edge scrims: long feather + drifting streaks (creator directive 2026-08-23)

Measured off the creator's reference frame at **youtu.be/2ndjrtVgrOY @ 0:42** (1920x1080). This is the
standard for **every** edge gradient in **both** formats — top or bottom, short form or long form.

**1. The inward-facing edge is never findable.** The scrim reaches **alpha ~0.94 at the frame edge**
and feathers to **true zero over ~48% of the frame height** (measured: background luma 9 at y=0
rising smoothly to a 145 plateau by y~520 of 1080). At 1080x1920 that is a **~920px** band. The
largest step between 10px samples anywhere in the ramp is +23 luma, i.e. a smooth S-curve with no
detectable edge. A short falloff, or a band that terminates while still opaque, is the failure — it
reads as a black rectangle laid on the picture.

**2. The scrim is not flat — faint light streaks drift through it.** This is what makes overlaid
white type pop instead of sitting on dead black. Measured in the reference:

| Property | Value |
|---|---|
| Form | soft, gently **wavy near-horizontal** light streaks, several across the frame |
| Contrast | **std 6.6 luma** (p1 −20.5, p99 +28.6) — a few percent, never graphic |
| Drift | **~20 px/s horizontally**, slowly evolving as it goes |
| Depth | strongest at the scrim's **outer** edge, gone by the inner edge |

Build it as a **tileable plate** (`assets/scrim-streaks.png` — 2160px wide so a 1080 window pans a
full cycle, seam checked at <0.5/255) laid over the gradient and animated on `background-position-x`.
`background-position` is a plain CSS property, so it survives a seeked render; a CSS filter would not.

**Calibrated values (use these, not the reference's std):** ~6 arcs, **5–13px thick**, peak plate
alpha **~29/255**, hump centred at ~60% of the band depth, drift 20px/s.

**Do NOT chase the reference's std 6.62 as a target.** That figure was measured over a *near-black*
scrim and does not transfer to a mid-grey ground. Matching it numerically on this job produced
obvious white ribbons across the frame — visually nothing like the reference. Calibrate the streaks
**by eye against the reference frame**, and use the measured numbers only to confirm the *character*
(fine arcs, not broad glows; a sigma-11 high-pass must be able to see them at all, which is what
tells you the width is right).

**3. Every scrim dissolves in AND out** (~0.5s each way). One that snaps on, or that simply stops
when its beat ends, reads as abrupt.

### Data tables: land COMPLETE, then highlight (creator directive 2026-08-23)

Applies to **both formats**.

- **The whole table arrives first, and only then do the highlights run.** Build the complete
  table — header band, every row label, **every value**, all rules, the source line — inside the
  entrance, finishing *before* the voiceover reaches its first figure. Then the only thing that
  animates for the rest of the beat is the VO-synced highlight moving from cell to cell.
  Populating cells one at a time across the beat means the table is never whole while she is
  talking about it, which is what the creator rejected.
  *(This supersedes the older "rows fill one at a time every ~0.25s" reading for held tables. Rows
  may still stagger — but inside the build, ~0.18s apart, all done in well under a second.)*
- **Every rule in a table is the SAME weight and the SAME colour.** One value — 3px `$rule-strong`
  — for row rules, the bottom rule and the column rules alike. Mixed weights (a 2px row rule next
  to a 3px emphasis rule) and knocked-back column opacity read as a sloppy grid. Carry hierarchy
  with a **tinted row band**, never with a thicker line.
- **Rules must be complete and land on WHOLE PIXELS.** This is the usual cause of "uneven
  thickness": if the column width is fractional (a 904px inner width over 3 columns gives 213.33),
  every vertical rule sits on a subpixel boundary and renders as a different weight down the table.
  **Choose the padding and label-column width so the value columns divide to an integer** — e.g. at
  1080×1920 a 960px card with 24px padding and a 270px label column gives exactly 214px columns.
  Verify by measuring: every rule should return the identical pixel count and the identical luma.

### Corner branding carries a drop shadow too (creator directive 2026-08-23)

Applies to **both formats**. The badge and the wordmark are graphic elements like any other, so
`brand.md`'s golden rule — *every graphic element carries a drop shadow, nothing floats flat* —
covers them. Flat chrome sits on top of the picture instead of in it. The marks themselves stay
**crisp**: use the full-resolution logo assets, never an upscaled small one.

They sit over footage, so they take **`shadow-soft`**: soft black, down-right, blur scaling with the
element. Calibrated at 1080×1920 for a 74px badge and a 56px wordmark: **offset 4px right / 5px
down, blur sigma 6px, black at 46%**.

**Bake the shadow into the asset — do NOT use `filter: drop-shadow()`.** `drop-shadow` is a CSS
filter, and filters are not render-safe in HyperFrames: they silently do not render, so the chrome
comes out flat with no error. `box-shadow` is no use either — on a transparent PNG it shadows the
bounding box, not the mark. Generate a padded PNG with the shadow composited underneath
(`assets/logos/*-shadow.png`), then grow the element's rendered height and shift its position by
exactly the pad so the mark lands where it always did.

Verify by differencing the frame against the un-shadowed build: the shadow should read around
**+10 luma mean / +49 peak** under a badge-sized mark, with a clean-background control at ~0.
