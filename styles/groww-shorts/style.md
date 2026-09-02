# Style: groww-shorts

The house framework, reverse-engineered frame-by-frame from four "Mutual Funds with Groww" reference shorts (Aug 2026 analysis, verified by adversarial re-measurement; source links in the notes at the bottom). The bar: **you can make new videos in this style from this file alone, without rewatching any reference.**

Primary references are the three channel-produced videos (V2 gold/silver, V3 Nifty IT, V4 multicap). V1 (Private Bank ETF) is an AMC-produced NFO promo — its extra devices live in the "NFO promo module" section and are used only for sponsor/NFO videos.

## What this style is

Fast, evidence-dense finance explainer. A presenter carries the argument on camera; **pre-composed data cards land like punches and then hold dead still while the voice reads them**. Energy comes from entrances and VO-synced highlights, never from idle animation. Everything on screen in English; the voice is Hindi/Hinglish.

## Format

- 1080×1920 vertical, **exactly 25fps** (all transition math below assumes 25fps frames).
- Runtime 75–96s. 13–27 distinct graphic events per video. Head-only stretches cap at ~5.5–9s.
- Beat rhythm: hook → evidence blocks → explanation → data takeover → CTA/outro. Block lengths flex per script.

## Style tokens (style-level; brand tokens from brand.md still apply)

| Token | Hex | Role |
|---|---|---|
| `$paper` | `#F3F2F0` | Graphic-scene canvas: warm paper, fine grain, soft vignette. Same value as brand.md `paper-ground` — one paper colour everywhere |
| `$indigo` | `#5367FC` | THE workhorse graphic colour, straight from the official palette: pills, banners, panels, table rows, chart bars/lines, borders, compliance boxes, wipe sheets |
| `$graphic-ink` | `#44475B` | All titles, values, table text, source lines on graphics — the palette's `ink` |
| `$amber` | `#FCB31C` | Highlighter sweeps on static graphics **and** the caption karaoke word — one yellow, from the palette |
| `$coral` | `#F26B55` | Negative chart/table data — the palette's coral |
| `$navy` | `#44475B` | Dark takeover/panel background moments (vignetted) — the palette's `ink` used as a ground |
| `$subscribe-red` | `#FF333F` | Subscribe pill only — YouTube's own red, deliberately off-palette |

`$accent` green `#00D09C` is **identity-only**: logo marks, diagonal wipe sheets, serif takeover titles (#00BD9D when settled on dark), CTA headlines. It is NEVER data ink, never number emphasis, never a caption highlight.

## Type roles (three voices, each with one job)

1. **Sans — Inter Tight** (from assets/fonts/) for everything functional: chart titles (~34px bold), pill/banner labels, table cells (~34px), source lines (26–34px bold), values, **and karaoke captions** (white, on black chips). Sentence case; ALL-CAPS only for table headers and period pills.
2. **Display serif** — Ivy Presto (assets/fonts/) for takeover titles and the two-line lower-third thesis titles (line 2 indented right, typed on): the channel's "editorial voice". E.g. topic titles ~190px green + ~130px white on dark textured ground. **Single emphasis-word stamps are NOT serif** — they are all-caps heavy data sans (~76px Inter Tight ExtraBold) with a small lightning-bolt glyph, a ~3-frame $accent-mint outline flash, then solid white on a dim radial scrim, one at a time in the upper third, ~1s hold (sheet R4/R5 distinction, absorbed 2026-08-10).
3. **Document serif** — Times-class for recreated press quotes / research-paper tables only (maroon #A42831 sub-heads). Separates quoted evidence from the channel's own sans voice.

Thumbnail cards additionally use an extra-bold condensed italic caps face — thumbnail-only.

## Frame chrome (every frame, every video)

- **Frame 1 is the literal thumbnail**, baked in for 1–2 frames (0.04–0.08s), then hard cut to the live head. V2/V4 also end on a thumbnail variant as the final frames.
- **Persistent corner branding from frame 1 on 100% of frames**, rendered as the topmost layer — above b-roll, takeovers, and even full-frame wipe covers: "Groww shorts" badge top-left (indigo circle ~56–62px dia, centre ~(98,98), text to x≈245) + logo/wordmark top-right (x≈815–1015, y≈70–125). Requires real logo assets from `assets/logos/`.
- **Both bugs knock back to ~35% opacity over the light data-card layouts** so they don't compete with the card; full opacity over dark talking-head, b-roll and end-card frames. (Edit instruction sheet §2, absorbed 2026-08-10.)
- Top ~200px is chrome-only; graphics start below y≈200.
- Safe zones: editorial content y 200–1620; source lines ~y1460; compliance/outro furniture layer may extend to y≈1820; otherwise bottom ~250px stays clear.

## Hook

No hook card, no animated title carrying the question. Thumbnail flash → hard cut → presenter speaks the question by ~0.6s → **first evidence graphic lands at 1.5–3.5s**. (A dark serif title takeover naming the topic — see V4 recipe below — may land ~1.5s in, but it names the topic, not the brand.) Branding is never withheld for the hook.

## Scene vocabulary

- **head** — full-frame presenter. **Zoom-ins and push-ins are legal** (creator directive 2026-08-21 — this replaces the earlier "no push-in ever" reading, which was measured off the reference videos and was never a rule of this channel). A locked-off hold is still the default for a plain talking beat; reach for a push when the line earns emphasis. Variety between jump cuts can also come from punch-in crop changes. Build every zoom per the `graphics` skill: **in FFmpeg, never through the browser** (a browser round-trip costs ~3% luma and dips the face at the seam), measured off the actual frame rather than estimated, with the frame counter reset on any mid-video slice, and anchored to measured scene cuts.
- **top-card** — top half becomes $paper with a graphic card; presenter scales into the bottom ~50–60%.
- **takeover** — full-frame graphic on $paper (or $navy for product moments); face fully absent.
- **face-card** — the presenter inside a large rounded card, never a small corner PiP. Four legal geometries: ≈360×360 rounded-square top-centre card; ≈605px **circle** top-centre with ~8px $indigo ring; ≈605px rounded-square top-centre with ~6px $indigo border; ≈960–976px-wide lower card, radius 24–40px. **Consecutive data-card blocks never repeat the same PIP shape** — alternate square and circle from one block to the next (sheet R10/QC, absorbed 2026-08-10).
- **b-roll** — stock/AI/app-screenshot insert, hard cut in and out, 1.4–5.5s, only its own internal motion (no added Ken Burns). Captions and branding layers persist over it. **Concept lines with no numbers get full-frame metaphor b-roll** — a literal visual metaphor with props labelled in-world (e.g. a pot reading "VALUE FUNDS"); presenter fully off screen, only the bugs on top (sheet R8, absorbed 2026-08-10).

## The editor's standing rules (user-supplied 2026-08-09, absorbed per contract)

- **The creator's face is never covered.** Graphics and captions occupy their own zone (top-card band, lower thirds, chips); nothing overlaps the face while it is on screen. Full-frame takeovers (face absent entirely) remain legal per the references.

## Golden rules (creator's reference doc + video, absorbed 2026-08-11)

Measured from the creator's reference frame and a dense frame analysis of the reference short (youtube.com/shorts/mNyl2w3YFi4):

- **Backgrounds:** card/callout layouts sit on `$paper-ground` (warm paper `#F3F2F0`, fine grain, soft vignette — never a flat grey). Data-card layouts with a face mask sit on `$gradient-ground` (periwinkle→white→mint diagonal + a **73px** grid at ~7.5% + soft diagonal white spotlight behind the hero). **Full-frame TAKEOVERS use `$periwinkle-ground` instead — see below.**

### `$periwinkle-ground`: the takeover ground (creator directive 2026-08-23)

Measured off **five** of the creator's own reference frames, harvested independently and in
agreement (REF3, REF6, REF8, REF11, REF14 of the smallcap-250 job). Her linked docs name it in
words too — *"gradient of white to purple as shown in the reference picture"*.

| Property | Value |
|---|---|
| Base field | flat `#ECEEFE` |
| Corner shade | `$indigo` at **alpha 0.124**, in the **TOP-LEFT and BOTTOM-RIGHT** corners: full strength to r≈356px, easing to base by r≈745px |
| Glow | **white at alpha 0.89** in the **TOP-RIGHT and BOTTOM-LEFT**, behind each corner blob; peaks ~75–185px outside the blob and decays over ~490px |
| Grid | **97px** square lattice; 2px lines at black 0.008 and a **6.5px dot at every intersection at black 0.085**. The DOTS carry the read, not the lines |
| Grain | **none** — residual std 0.57 luma. It is a flat digital gradient, unlike `$paper-ground` |
| Mint / green | **ZERO.** max(G−B) over the whole ground measures −1.8 |

**Two things that were wrong in this file before and are corrected here:** the takeover ground has
**no mint leg**, and its grid is **dark, not white**, at **97px, not 85px**. The mint version stays
correct for the face-mask + data-card layout, which her REF13 doc asks for by name ("a gradient of
both brand purple and brand green").

**Corner blobs are part of the ground, not decoration.** Every one of her takeover references
carries two soft indigo blobs bleeding in from the **top-right and bottom-left** — 4-point sparkle
silhouettes, arm half-length ≈**32% of frame width**, Gaussian-blurred at **sigma ≈32**, flat
`$indigo`. Shipping the ground without them measures **0 indigo pixels** in both corner boxes where
her reference measures thousands, and it is the single easiest thing to leave out. On beats where
she says "swirling stars", give them a slow continuous rotation; otherwise they sit still.
- **Drop shadow on everything** — face-card, tables, callouts, charts, motion graphics. On paper: hard offset `$shadow-hard` (`#53B091`, ~12px right/14px down, zero blur) + `3px #14151A` outline. On gradient/footage: `$shadow-soft` (soft black, same down-right direction, blur scales with element size). One shadow language per ground, direction always down-right.
- **Callout boxes** (reference frame): white rounded box, dark outline, hard `$shadow-hard`, serif body text, key phrase swept with the `$marker` amber highlighter, grey source chip beneath.
- **B-roll carries "dust":** a static, perfectly regular **45° halftone DOT SCREEN** — not random specks, not film grain. Measured off the creator's own dust reference by FFT and autocorrelation (2026-08-22): at **1080px width the H/V repeat is 5.80px, the diagonal nearest-neighbour pitch is 4.09px, dot core ~1.42px**. It is **perfectly neutral** (zero colour cast — adding any hue or brand tint is wrong) and blends **multiplicatively at ~3% RMS of the underlying luminance**, **full-bleed and uniform** — no edge weighting, no fade toward centre. Build it as a plate and apply it in **FFmpeg, not the browser**: `blend=all_expr='clip(A*(1+(B-128)/512),0,255)'` against a 128-centred grey plate. Verify after encoding by recovering the lattice period from the rendered file. Full-bleed b-roll, never framed in a card; warm grade; "*AI generated" + source tags stay.
  - *(This supersedes the earlier reading of dust as dark brown `#3A1E05` at 40–60% opacity fading from the edges, which came from a different reference and does not match the creator's supplied sample.)*
- **Negative space is filled with flat vector illustrations** (2D people/chart scenes ~260×210 mid-left, small browser-window chart doodles ~130×230 bottom-right), no outlines or shadows on the illustrations themselves, idle-bobbing a few px over seconds. 3D icons live on takeovers and beside spoken headlines, not on card layouts.
- **Table entrance grammar (newer reference):** white-flash transition (~0.4s) → full empty skeleton fades in from white → teal header cells wipe L→R (~0.5s ease-out) → source line types on → rows populate top→bottom staggered ~0.4s **with count-ups** (0.00→final over ~1.5–2s, ease-out; inactive rows greyed ~40%). Soft ease-out everywhere, zero bounce. (Supersedes the older "numbers arrive formed" reading for this look; our stage-build tables now crossfade stages ~0.1s for the same smoothness.)
- **Mixed-typography headline builds** on the talking head: heavy grotesque sans alternating with high-contrast serif, words popping in one at a time (~120–200ms/word) on a bottom scrim; small flat/3D icons pop beside the phrase being spoken.
- **No props over the face OR over the creator's mask frame — ever** (creator note 2026-08-11, golden rule): floating object animations (clock etc.) live fully in the side headroom, never centre; illustrations and icons must clear the PIP card/circle entirely, not just the face inside it.
- **No dead space below a table/chart card:** fill it with topic-matched motion graphics — a bobbing 3D icon or doodle that matches what the card is about (returns → chart-up, foreign holdings → coins, mcap mix → piggy, long-term → hourglass), bottom-left, with the candle doodle bottom-right.
- **Every chart carries a depth drop shadow** — including SVG/live-rendered takeover charts (pie discs, donut rings), not just cards: soft `$shadow-soft`, down-right (creator note 2026-08-11: "the graph lacks depth").
- **The leak's CUT lands ON the white-peak frame, enforced at COMPOSITE time (absorbed 2026-08-24,
  avatar job).** Two mechanics that both failed once and are now standing:
  1. **Gate every takeover/overlay to END at the leak's peak frame (leak start + 7), not at the leak's
     end.** A comp whose duration runs to the leak end re-emerges from the flash for ~6 frames and the
     real switch then lands in the open as a bare double-cut. The comps hold full strength to their
     last frame precisely so the compositor can cut them at the peak.
  2. **Add a one-frame white plate (white @ ~0.93) at each peak frame.** The measured leak shader
     alone peaks ~235 mean luma after the screen blend — under the 240 blowout bar — so the reference's
     single pure-white frame must be supplied at composite. Verify: exactly one frame > 240 per leak.
- **A zoom ramp never snaps back mid-take** (absorbed 2026-08-24): hold the reached scale until a
  covering transition (white flash, leak, cut) hides the reset. A one-frame return to 1.0 inside a
  continuous take reads as a glitch, measured at ~4.5% frame-wide displacement.
- **A light leak is a TRANSITION AND NOTHING ELSE — the creator never appears inside one**
  (creator directive 2026-08-23). The failure looks like the presenter "glitching" into the middle of
  a transition, and it has two causes, both of which must be closed:
  1. **The outgoing segment must hold FULL STRENGTH to its last frame.** Any exit animation — a card
     sliding out, a mask shrinking, a ground fading — uncovers the base A-roll underneath, and the
     leak then flashes the presenter for a few frames. Give the beat no exit at all when a leak sits
     on its out-point; the leak *is* the exit.
  2. **Segment windows must UNDERLAP the next beat by ~0.2s in the composite.** Exact-abutting
     `enable` gates leave a single uncovered frame at the boundary (the half-open/inclusive
     off-by-one), and one frame of bare footage inside a leak is clearly visible.
- **Never cut away while she is still finishing the sentence** (creator directive 2026-08-23). Time
  the transition to the END of the spoken thought, not to the nominal beat boundary. On this job the
  table's exit began at 42.43 while she was still saying "13.47%" (42.29–42.69) and read as a jump
  cut. Hold the graphic through the last word, then let the leak take the cut.
- **No captions over AI-generated b-roll** (creator directive 2026-08-23). Burned captions sitting on
  generated people read as odd. Suppress the caption groups whose window falls inside an AI b-roll
  beat and let the footage carry the line. *(This overrides the older "b-roll is NOT a collision"
  reading in the caption-placement rules below, which stands only for real/stock b-roll.)*
- **Every black gradient DISSOLVES IN AND DISSOLVES OUT** (creator directive 2026-08-23) — roughly
  0.5s each way. A scrim that snaps on, or simply stops when the beat ends, reads as abrupt. Keep it
  subtle: peak around 0.72 alpha over a tall band (~780px at 1080×1920), never a hard-edged panel.

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

- **Edge gradients/scrims: feathered to TRUE zero, layered under the chrome — thumb rule for every video** (creator note 2026-08-11): any top or bottom gradient band uses a smooth cosine falloff that reaches fully transparent — never a linear ramp that terminates mid-frame with a visible edge. Z-order is always background → gradient → logo/chrome; the corner logos must read clearly ABOVE the gradient, never swallowed inside it. (The bottom serif-foot gradient is the approved model.)
- **PIP face-cards use a tight head-and-shoulders crop** (creator note 2026-08-11): the face fills the card with minimal margin above the hair — never the wide raw framing with its graphic headroom (workspace raw: crop ~700×700 from y≈480 instead of the old 860 from y230).
  - **The crop is sized from the MEASURED silhouette, never from a face-detector box** (creator
    correction 2026-08-24, avatar job: "lot of head room"). A Haar box expanded "for hair" put the
    crop top ~170px above the real hairline (~35% of the mask was wall). Measure the hair top from
    the keyed/fitted layer's alpha (3 samples inside the beat, face-column band, take the min), set
    the crop top at hairtop − ~5% of crop height, and size the width so the face box fills ~78% of
    the crop. Verify the rendered headroom share, don't assume it.
  - **For the current raw framing** (creator centred, face bbox x330–730 / y380–1100 in 1080×1920), the crop that fills a 0.82:1 mask is **660×800 from (210, 340)** — verified 2026-08-22.
  - **RE-MEASURE THE CROP EVERY SHOOT — it is not a constant (2026-08-23).** She reframes between
    videos. On the smallcap-250 job that recorded crop over-zoomed badly: her framing there was
    already a tight close-up (skin bbox x253–747 / y347–1013, hair top ≈y150), and the mask needed
    **900×1098 from (50, 120)**. Measure the skin bbox on a few frames of the actual cut and size
    the crop so the face fills ~60% of the mask height, which is what the reference reads. A crop
    inherited from another shoot looks plausible in the build and wrong on screen.
  - **Full-frame takeovers leave the mask as a TRUE alpha-0 hole and the compositor drops the scaled face in underneath.** If you skip that step the hole shows the wall and the top of her hair, which is the single most obvious failure in a takeover build. Detect each hole automatically from the overlay's own alpha (largest interior fully-transparent region) rather than hardcoding rects.
- **Animated/motion graphics are built with Remotion, not HyperFrames** (creator note 2026-08-11) — React compositions in `graphics-build/remotion/`, rendered with `npx remotion render`, brand fonts and tokens loaded from workspace assets.
- **Graphic zones sit on a softened plate, not a hard panel:** where graphics ride over footage, the footage behind the graphic zone gets a Gaussian blur + paper wash — with a **large feathered mask so the blur edge is never visible** (a hard blur edge is the failure mode; when in doubt, feather wider). Rendered at composite time in FFmpeg (CSS blur is not render-safe in HyperFrames).
- **Contrast scrim under everything:** every motion graphic and every text element gets a subtle black gradient behind it so it pops off the footage — exactly as the references do. Subtle: peaks ~65% black at the frame edge behind lower-third text, fades to zero well before mid-frame; never a visible band.
- **Element FX:** transparent-PNG elements (generated or real) animate in from frame edges (bottom/side) with motion blur — density of motion graphics is a virtue on this channel, not a risk. Default to more graphics, not fewer, provided each is word-synced.
- **The bar for "approved": decent + matching the words she's saying.** Word-sync is the quality gate.
- SFX are sparse, real samples (assets/sfx/), placed at finishing; the user may also add SFX themselves after delivery.

## Graphic anatomy

- All data content lives in **rounded-rectangle cards** (radius 14–40px) on $paper — white fill with soft shadow, or transparent with a thin dark outline (2–5px). Side insets 55–95px.
- **Every data graphic carries a left-aligned source line directly beneath it**: `Source: <name>` in data sans bold 26–34px. Non-negotiable — this is a finance channel.
- **Tables build, they never appear** (sheet R2, absorbed 2026-08-10 — supersedes the earlier "pre-drawn" reading, which came from sparse frame sampling of the refs): the empty card/grid lands first (~0.3s beat), then rows fill one at a time every ~0.25s, footnote last. Bar charts grow over ~0.8s with value labels popping only at final height, on a teal→indigo ($accent→$indigo) vertical gradient with y-axis gridline labels. Pie wedges sweep to their value in quick steps, labels pop after with leader lines. Numbers inside cells still arrive formed — no digit count-ups observed as channel practice.

## Motion grammar (the signature)

- **Entrances get all the effort:** a finished card arrives with a big motion-blurred move — whip-zoom slam, zoom-settle from ~2× scale, slide-down slam, or directional streak — over 0.3–0.5s with a strong ease-out settle. Those blurred frames are what make a still card feel alive.
- **Then the card holds DEAD STATIC 3–15s** while the VO reads it. Graphics hold at full strength until the next beat starts — no early fade, no dead air. (Measured holds up to 15s.)
- **Exits are designed — elements leave with purpose.** Give the exit the same thought as the entrance and match it to the moment: a card can slide, wipe, shrink or streak out. A hard cut is a legitimate exit when the next beat needs to land instantly, but it is a *choice*, not the default. Time the exit to the first word of the next spoken thought.
- **A table's VO-synced sweep may be MINT, not amber (creator directive 2026-08-23).** Her own
  reference frame for the table beat carries a `#60CFAC` mint/teal wipe over the value cell, and
  she chose it over `$amber` when the conflict was put to her. This is a deliberate, named
  exception to `brand.md`'s "`accent` is never data ink, never number emphasis" — it applies to
  **held data-table cell sweeps only**. Everywhere else the highlight is still `$amber`, and
  `$accent` green stays identity-only.
- **Held data tables are the one exception to one-highlight-per-graphic:** a table that stays on screen across several spoken claims carries **sequential** VO-synced cell highlights, one instrument at a time, never two simultaneously (V4 multicap tables do exactly this). Everything else:
- **Emphasis = exactly one delayed, VO-synced highlight event per graphic, never at entry:** an $amber sweep left→right over ~0.3s across the key cell/phrase, or an $indigo pill wipe L→R ~0.5s behind a concept, or red hand-drawn annotation boxes/arrows drawing on over 0.4–0.5s. The highlight lands exactly when the VO speaks the figure — up to 5.5s after the card entered. Never two competing accents on one graphic.
- **Accumulating elements enter in VO order**, staggered 0.5–1.2s apart, each item's own rise+fade ~0.24–0.3s with motion blur, each cued to its spoken word. Decorative sub-elements inside one card build may micro-stagger at 0.1–0.2s.
- **graphic → graphic chains directly with the face hidden** — carousel whip, vertical scroll hand-off, continuous whip-zoom, or in-place content swap. Never bounce back to full-frame face between consecutive graphics.
- **Typewriter reveals only for verbatim/quoted or keyword text** (~70 chars/s on quote cards; ~0.4s per serif phrase). Banners, pills, and tables never type.

## Transitions

- **Signature divider:** a full-frame solid sheet wipes diagonally bottom-left→top-right, covering in ~0.15–0.3s with only 1–2 frames of full cover, total in+out ≤0.7s. Used 1–2× per video as a chapter break, never routinely. Corner branding (and captions where present) render ABOVE the wipe. Sheet colour: $indigo for neutral dividers (default); $accent green sparingly as a brand moment.
- **Light leak (measured from the creator's reference reel, 2026-08-22 — do not re-derive it):**
  **13 frames = 0.52s at 25fps.** A warm-orange wash builds with a soft vertical column sweeping
  across, peaks in **exactly ONE frame of pure white blowout** (RGB ~251) at index 7, then floods
  out in a **more saturated orange than it came in**, and returns to base. Visible film grain.
  **The shot change sits under the white peak**, so the leak hides the cut.
  Per-frame added luminance: `[44.8, 45.0, 53.2, 41.7, 107.6, 22.0, 185.8, 218.5, 185.5, 163.5, 141.0, 92.2, 24.1]`
  and R/G ratio: `[2.81, 2.80, 2.69, 2.60, 1.38, 1.60, 1.04, 0.96, 1.05, 1.35, 1.65, 2.15, 2.40]`
  (note the dip at index 5 — it is a real gap between streaks, not a mistake).
  **Composite it ABOVE the graphic overlays**, below only branding and captions: placed under a
  full-frame takeover the leak is painted over and disappears entirely.
- **The leak reads MAGENTA on this channel, not warm orange (creator directive 2026-08-24).**
  The 13-frame asset above is built warm — its measured R/G curve is the one in the table. The
  magenta comes from the COMPOSITE: `blend`'s `all_expr` runs the same expression on every plane,
  and against a ProRes `yuv422p10le` base ffmpeg negotiates a common format so the screen curve
  ends up running over the CHROMA planes. Measured against the source that adds **+106 R, -16 G,
  +123 B** — blue over red with green pushed down. A blind review filed it as a blocker; the
  creator looked at both and chose the magenta.
  - **Do not "fix" it** by forcing the base to `gbrp10le` before the blend — that is exactly the
    change that restores the orange.
  - It is **base-dependent**, which is the part to watch: the same leak over the bright cream AI
    b-roll measured **+48 R, +81 G, +159 B**, i.e. blue rather than magenta. Two leaks in one
    video can therefore read as different colours. Decide per video whether that is wanted.
  - Because it rides on format negotiation, an ffmpeg upgrade can silently revert it. Assert the
    hue after every composite (`verify_leak_hue()` in the job's assemble script) rather than
    trusting it.

  **Blend:** a pure `screen` saturates to white on a near-white base, so the warm cast vanishes over
  bright data cards. Use screen plus an intensity-weighted tint —
  `blend=all_expr='(A+B-A*B/255)*(1-B/510)+B*B/510'` — which matches the reference on dark footage
  and still reads warm on a white card.
- All other boundaries are hard cuts, blurred whips, or light-leak flashes. **No crossfades anywhere. No fade-to-black ending — every video ends cold** on a card, thumbnail end-frame, or held scene.

## Captions (per-video switch — see style.json)

The channel runs both modes: full karaoke captions (V2, V4) and zero burned captions (V1, V3, which lean on on-screen evidence text + YouTube auto-captions). When ON:

- **English translation of the Hindi VO** — never a transcript, never Devanagari (WhisperX output must pass through a translation step before burn-in).
- White bold Inter Tight on a **near-opaque pure-black rounded chip** (fill ~#040304, radius ~14–18px, ~20–26px side padding, ~55–85px per line), horizontally centred. Text 46–60px.
- Groups of 2–6 words (typically 3–5), swapping as instant pops, one group ≈1–1.5s.
- **Karaoke: exactly one word at a time turns $amber**, advancing every ~0.15–0.25s through EVERY word (including "a"/"the").
- ALL-CAPS interjections ("NOW,", "BUT WAIT...") get their own short chip stacked above the main line.
- Default chip band: text centre y≈1362–1430. **Layout-aware:** the block relocates per scene to dodge graphics (measured at y≈790, ≈880, ≈1495 in V4). Captions render above the transition-wipe layer.
- **Placement is SOLVED by measurement, never chosen by eye** (absorbed 2026-08-22, creator directive "make sure captions don't interfere with any of the graphics on screen"):
  1. Build a per-frame occupancy map of graphic **content** — local edge energy, so a smooth gradient
     background does **not** count as a collision but a card, table or number does.
  2. For each caption group, walk a ladder of candidate Y values and take the first that clears the
     graphics, the face box and the safe zones; if none is clear, take the least-overlap position.
  3. **B-roll is NOT a collision** — captions persist over b-roll by design.
  4. Where nothing clears, **suppress that group** and let the on-screen evidence carry the line.
     The channel already runs caption-free beats; a caption fighting a full-frame data card is worse
     than no caption.
  5. **Coverage is checked against the VOICE, not against the group list (absorbed 2026-09-02).**
     An English caption track translated from Hinglish runs out of words before the clause ends —
     twice on the standard-deviation job (4.0s and 0.7s holes mid-speech, found by reviewers, not
     by the solver). After solving, scan for any stretch >1.5s where VO energy is present and no
     group is active; fill it by extending the last group's hold or authoring a chip for the
     untranslated clause. A suppressed WINDOW (sync-slide, takeover) still needs its groups —
     re-place them in the beat's free band (chest zone is legal) rather than dropping ~10s of captions.
  6. **Karaoke times are DISTRIBUTED, never word-mapped, when translation inverts the order
     (absorbed 2026-09-02).** Mapping English words onto Hinglish anchor timestamps parked the
     amber word 4s on "carry" and then sprinted 8 words inside a 0.4s leak. If the anchor mapping
     produces any word >1.5s or <0.08s, spread the group's words evenly across its window instead.
  7. **One position per SENTENCE (absorbed 2026-09-02).** The ladder may relocate between
     sentences, but a sentence that starts at the bottom finishes at the bottom — a mid-sentence
     top/bottom jump reads as a glitch even when both positions are individually legal.
  8. **Inside a REFRAME window the face is not where the static face box says it is.** A caption
     placed against the original box will land on her mouth. Suppress captions across any reframe,
     or re-derive the face box from the reframed geometry.

## Compliance furniture (standing, not optional)

1. SEBI registration box at the open — bottom-left (x≈70–120, y≈1590–1720) for the first 2.5–4s.
2. RA/narrator/report-date panel in the outro ($indigo panel or light chip): "Name of RA / Name of narrator / Report date / disclaimer link".
3. `Source:` lines under every data graphic.
Registration text and names are per-account legal identity — supplied by the user, never copied from references.

## Outro (channel videos)

Subscribe micro-skit, 1.5–2.4s, overlaid while the presenter is still talking (never a dedicated outro card): white banner rises bottom (x 119–975, y≈1450–1820) with logo+wordmark left and a $subscribe-red SUBSCRIBE+bell pill right; a YouTube glyph morphs into the button, an animated cursor clicks it, it flips to grey "subscribed". Then end cold (thumbnail end-frame on V2/V4).

## NFO promo module (V1-style sponsor videos only)

Lower-third lockups (heavy ~140px green key line + ~90px white bold-italic detail line, with a black bottom-dim gradient behind text, both revealed by a soft L→R wipe ~0.6s); white CTA capsule "Link in the description"; $navy product takeover with green headline; 13.4s static legal endcard with riskometers and the statutory Devanagari market-risk line (~17% of runtime budgeted for legal).

## Per-video choices (legitimately variable)

Captions on/off; wipe colour; graphic aesthetic sub-mode (indigo data-card / newspaper clipping / research-paper document / mixed serif); chart types; b-roll count (0–6) and sourcing; presenter backdrop; which emphasis instrument each graphic uses; outro type.

## Notes

- References: youtube.com/shorts/ PL1p22IW0wg (V1), aKUABQT0UrA (V2), _Z0AO2K6_Lk (V3), quRhr_HajUg (V4). Full analyst reports + verification: session task output, 2026-08-08.
- Open items pending user decision are marked in style.json under `open`.
- Every review correction that should apply to all future videos gets absorbed into this file before a job closes.

### Carried over from long form (creator directives 2026-08-25)

Three faults found in a delivered long-form draft. All three are format-agnostic, so they hold here
too — stated in vertical terms rather than copied across.

**1. A prop is fully clear of a card, or fully behind it — never sliced by its edge.**
The golden rule above already forbids props over the face or the mask frame. This is the same idea
against a **data card's** edge, which was not covered: a prop straddling a card boundary leaves a
sliver poking out and reads as a mistake. Fully clear (a real margin, bigger than the prop's own
drift and shadow) or fully behind (invisible, harmless) — never between. Eleven of these shipped in
the long-form draft, on both axes, and the quiet ones at low opacity were the easiest to miss.
Do **not** fix by removing props when a card is up, shrinking them, moving them in front of the card,
or animating them out on card entry — each trades this fault for a worse one. Move the prop, or drop
that one prop for that beat.

**2. A table is BUILT, never pasted.** "Tables build, they never appear" above governs the
*animation*; this governs the *source*. If the script's item is tabular data, it is rebuilt in brand
tokens — never her spreadsheet screenshot dropped onto the card. Two shipped that way in long form,
sitting a few beats from properly built tables.
- **The excuse to watch for:** "too many rows to rebuild legibly." Long form answered that by landing
  the table as two stacked halves. **Vertical's constraint is width, not height** — 1080px takes far
  fewer columns than rows — so here the split is by **column**: carry the columns the VO actually
  refers to, or run two cards across consecutive beats. Row or column count is never a reason to
  paste.
- **This does not touch b-roll.** App-screenshot inserts stay legal per the scene vocabulary. The
  rule is about tabular data being dodged, not about screenshots existing.

**3. A graphic's copy is a LABEL, not the narration.** A comment asking for a motion graphic is a
brief for a *visual*. In long form the Sharpe-ratio explainer had the script's Hinglish sentence
typeset across the frame while she spoke it — zero new information, double reading load, and the
actual explanation crowded out. This is about copy **inside a graphic** only.
- On-screen copy inside a graphic is the term, the number, the unit, two to four words. The **visual**
  carries the meaning.
- **The tell:** a text field filled by copy-paste from the script. Frame copy is authored from the
  concept. If the words could be pasted straight out of the narration, the graphic is not designed yet.

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
- **The same order applies when PLANNING, not just when animating (creator directive 2026-08-23).**
  When the direction arrives as a comment on a script document and that script contains a table,
  **construct the complete table first — as one object, from the document's structured source — and
  only then work out the highlights.** Never grow the table beat-by-beat alongside the highlight
  plan. Concretely, in this order:
  1. Take the table from the **structured source** (the doc's own table markup), never from the
     prose around it. Treat the declared row and column counts as ground truth — on this job that
     is 11 rows × 2 columns.
  2. Build and render the whole table, every row and every value present, and verify it against
     the source row-for-row **before a single highlight exists**.
  3. Only then lay the VO-synced highlight sequence over the finished table, driven off the
     word-level transcript.

  Building it "part by part" fails two ways at once: the table quietly ends up with the wrong
  number of rows because the structure was inferred from whichever cells the highlight plan
  happened to need, and the graphic is never whole on screen while she reads it. Both look
  plausible in a mid-build frame, which is why this is an ordering rule rather than a review note.
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
