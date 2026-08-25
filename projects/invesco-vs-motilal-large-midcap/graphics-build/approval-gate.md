# APPROVAL GATE — Invesco India Large & Mid Cap vs Motilal Oswal Large and Midcap (§13)

Hard stop. Nothing below is built into the video until the creator approves. Presented 2026-08-16.

## 1. The eight sample stills (3840×2160, real keyed composites, logo lock-up in place)

`graphics-build/remotion/out/Type{1..8}-*.png`

| Type | Still shows | Data source |
|---|---|---|
| 1 | "Some Basic / Important Notes" over centered creator (p05) | script line, English screen rendering |
| 2 | Invesco Concentration panel + creator left (p27) | inventory a09 — 40 / 53.42% / 33.55% / 59.73%, (i) icons, Source: Value Research |
| 3 | Hook "Same Start, Different Destinations?" + diverging-paths illustrations (p01) | script hook metaphor |
| 4 | AUM topic card, rotating coins (p09 opener) | subtopic opener |
| 5 | Two fund circles + serif names (p06) | fund names character-exact |
| 6 | "Large & Mid Cap Funds" resolve over closed circles (p06→) | category resolve beat |
| 7 | AI trading-floor b-roll, black box + dust | Kie nano-banana generation |
| 8 | Real Pexels 4K footage, same treatment | Pexels #4992557 |

**Data-accuracy pass (stills):** every on-screen figure checked character-for-character against `transcript/asset-inventory.json` (a09 exact incl. the (i) icons; fund names exact incl. "and" vs "&" distinction).

## 2. The keyed composite QC

`graphics-build/remotion/out/qc/` — keyed plate at 100%, hair-edge crops at ~400% over white AND near-black: no green fringe, strands intact. Method: CorridorKey neural key (MLX), recipe in `graphics-build/KEYING.md`. ffmpeg-only keys demonstrably fail on this plate (uneven luma green) and are used only for previews.

## 3. Scene-to-script map

`graphics-build/scene-map.md` + `.json` — 91 spans, 0→813.84s, no gaps (programmatically verified), every span typed with the grammar rule that chose it. Type seconds: T5 482.0 · T1 107.1 · T2 99.8 · T4 58.8 (21 cards) · T6 28.5 · T3 26.0 · T7 6.3 · T8 5.3. B-roll deliberately sparse — this script is a wall-to-wall data walk (matches reference A's zero-b-roll data half). Every >20s hold carries VO-synced dissection sub-steps (§2.8).

## 4. Transition analysis

`graphics-build/transition-plan.md` — 91 boundaries, all in **dialect A** (whip + dissolve + brand wipe + light-leak; audit finding: dialects are per-video, A is the bar and the same format). Fixed-slot chain: 3.0s start disclaimer → … → sign-off → 10.0s endscreen → 10s static legal → 5.5s rolling crawl (delivery ≈ 14:02).

## 5. §2 asset inventory proof

`transcript/asset-inventory.md` — 30 assets, all 30 mapped into type-2/5/6 spans at their anchor lines (coverage table inside scene-map.md). 24+ subtopic openers → 23 lavender cards + 2 in-table morphs (flagged below). Both subscribe cues placed.

## 6. Supplied-asset placements

| Asset | Placement |
|---|---|
| disclaimer-start.png | 0.00–3.00 delivery, silent, hard cut out |
| groww-transition.mov | over p04 "Chaliye shuru karte hai!" (base 55.08s), alpha composite |
| endscreen.mp4 | hard cut after p71 sign-off, exactly 10.0s |
| disclaimer-rolling.png | post-endscreen: 10s static + 5.5s crawl to final frame |
| intelligent-investors-badge.png + Groww mark | every frame, topmost layer |

## 7. DECISIONS NEEDED FROM THE CREATOR (blockers marked ⛔)

1. ~~Khemani date~~ **RESOLVED 2026-08-16 (creator): screen shows "1st November 2023"** — the a04 bio screenshot as printed. ⚠ NEW residual decision: the base-cut VO (~1:58–2:05) audibly says "November 2013 se" and will contradict the screen. Keep as-is / re-record the line / attempt an audio patch? (span s16)
2. ⛔ **Expense ratios**: About-boxes say 0.55%/0.60%; page-24 table + spoken p65 say 0.56%/0.90%. Which pair is authoritative? (spans s14, s83)
3. ~~"Varun Sharma"~~ **RESOLVED 2026-08-16 (creator): the About box is shown as printed, Varun Sharma stays.** (s14 — its only remaining blocker is the expense-ratio pair)
4. **Source lines — PARTIALLY RESOLVED 2026-08-16 (creator):** page 10 labeled Invesco card → "Source: Value Research" (each twin card carries its own line); both page-23 charts → "Source: Value Research"; page-25 RA block → **excluded from the video entirely** (a30 removed from the map; the supplied rolling-disclaimer asset covers legal). Pages 7–8 **RESOLVED 2026-08-16 (creator): "Source: Motilal Oswal AMC"**. Every on-screen asset now has a source ruling. *(Note: the page-25 exclusion is a THIS-VIDEO ruling only, not a standing style rule.)*
5. p56/p59 year-openers mapped as in-table band morphs (a full card would break the continuous returns-table build) — confirm.
6. ~~a30 placement~~ **RESOLVED 2026-08-16 (creator): the page-25 RA block is NOT shown in the video.** Removed from s90–s91; the closing legal chain uses only the supplied disclaimer-rolling asset. On-screen inventory is now 29 assets, 29 placed.
7. Badge is the grey variant (navy "investors") — over dark b-roll frames it loses contrast; is there a white variant for dark frames, or use as-is?
8. ~~Fund/AMC logos~~ **RESOLVED 2026-08-16** (creator: "go find yourself"): Invesco = official mark from the Invesco SVG (Wikipedia file, navy wordmark + mountain); Motilal = the group's ring mark + wordmark, cropped from the Motilal Oswal Financial Services lockup (the "Wealth Management" descriptor removed — the fund house is Motilal Oswal Mutual Fund and the parent mark is shared). If the creator has the exact MF-division lockup, it swaps in one file: `remotion/public/assets/logo-motilal.png`.
9. "Flexibity" typo is printed in the source QGLP slide — reproduce as printed per §2.3, or correct?
10. Ivy Presto true-italic cuts: workspace has uprights only; stills use synthesized oblique. Supply italic OTFs if available.

## On approval

Build order per `styles/groww-longform/edit-workflow.md` step 8: gauntlet loop per judgeable piece (blind critic vs reference A frames), batch CorridorKey keying of all creator-on-screen spans, Remotion timeline assembly, finishing-pass review loop.
