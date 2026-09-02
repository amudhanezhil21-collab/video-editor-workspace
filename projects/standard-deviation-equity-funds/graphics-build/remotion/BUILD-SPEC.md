# standard-deviation-equity-funds — build spec

READ `SHARED-API.md` FIRST. It carries the hard rules. This file carries only what is
specific to THIS job. Where they disagree, this file wins (it is measured on this footage).

## Frame

**1080x1920 @ 30fps** — not the 25 in the style file. Her supplied cut is exactly 30/1
(4311 frames / 143.7s). `FRAME.fps` in `../tokens` is already 30. Frame = round(seconds * 30).

## This shoot's geometry — MEASURED, do not reuse the smallcap numbers

36 frames sampled across 2-142s:

| Thing | Value |
|---|---|
| head/hair silhouette | x 159-933, y 580-1381 (hair top median y594) |
| face (skin) | x 355-813, y 600-1100, median face width 268px |
| `FACE_BOX` (silhouette + 20px) | **x 139-953, y 560-1401** |
| free band ABOVE her head | y 200-560 (360px tall) |
| free band BELOW her body | y 1401-1670 (269px tall) |

**She is framed WIDE and seated.** The old `x330-730 / y380-1100` box is from a different
shoot and is wrong here. Any graphic that shares the frame with her lives in one of the two
free bands, or it is a full-frame takeover with her absent.

## Table geometry — whole pixels, from `TABLE_GEOM`

card 970 (side inset 55) - 2*24 padding = 922 inner; 922 - 280 label = 642; 642 / 3 = **214 exactly**.
Every rule is **3px `$ruleStrong`** — row rules, bottom rule and column rules alike. One weight,
one colour. Hierarchy comes from a **tinted row band**, never a thicker line. Verify by measuring:
every rule must return the identical pixel count and identical luma.

## Beats to build

Windows are from `../../../transcript/cutsheet.json` — that file is the authority, read it.

| id | window (s) | comp | what |
|---|---|---|---|
| B3 | 17.95-29.75 | takeover | avg 10%, SD 6% -> range **4% to 16%** |
| B4 | 29.77-40.49 | takeover | avg 10%, SD 12% -> range **-2% to 22%** |
| B7 | 56.57-62.29 | table | HIGHER-SD funds |
| B8 | 62.31-68.50 | table | LOWER-SD funds |
| B10 | 97.00-102.60 | widget | question mark, BOTTOM of frame, gradient behind |
| B11 | 102.64-111.83 | light | risk-tolerance support graphic |
| B13 | 116.93-125.74 | text | Alpha / Sharpe Ratio / Sortino Ratio, line by line |
| B14 | 126.04-134.24 | takeover | Sharpe vs Sortino contrast |

## Standing rules that bite on THIS job

1. **Tables land COMPLETE, then highlight.** Every row, every value, all rules and the source
   line finish inside the entrance (rows may stagger ~0.18s, all done well under a second).
   Never grow the table across the beat.
2. **A graphic's copy is a LABEL, not the narration.** 2-4 words, the term, the number, the unit.
   If a text field could be pasted from the script, it is not designed yet. B4's copy is the one
   exception — she supplied it verbatim: **"10% Average Annual Return"** (her typo "Anual" fixed).
3. **Every data graphic carries `Source: Value Research` beneath it**, plus `Direct Growth` and
   `August 25, 2026`. Non-negotiable, finance channel.
4. **Props never straddle a card edge** — fully clear (>=24px) or fully behind. Never sliced.
5. **Every element carries a drop shadow.** Nothing floats flat.
6. **Gradients/scrims dissolve IN and OUT** (~0.5s each way) and feather to TRUE zero.
7. **One highlight event per graphic**, delayed, VO-synced — never at entry. Held data tables are
   the exception and may run sequential cell highlights, one at a time.
8. Determinism: everything off `useCurrentFrame()`. No random, no dates, no timers.

## Ground

Full-frame takeovers use `PERIWINKLE` from `../tokens` (base `#ECEEFE`, indigo corner tint
alpha 0.124 TL+BR, white glow TR+BL, 97px grid whose DOTS carry the read, NO mint, NO grain)
plus the two blurred indigo sparkle blobs from `STARS`. `PeriwinkleGround.tsx` already
implements this — import it, do not re-derive it.

**ASSUMPTION ON RECORD:** the creator linked a background doc for B3/B14 that this machine's
Drive account cannot open (404). `$periwinkle-ground` is the fallback and was measured off five
of her own reference frames. If the doc becomes readable this may need re-checking.

## Self-verification you MUST run before returning

Render the comp, then measure with python3 + PIL/numpy (use `~/.venvs/whisperx/bin/python3`,
it has numpy/PIL/scipy) and report NUMBERS:
- element bboxes in px; confirm they clear `FACE_BOX` when she is on screen
- nothing above y=200 or below y=1670
- for tables: every rule's measured pixel width and luma, proving they are identical
- diff two far-apart frames to prove the animation actually moves (a static render is the
  classic seeked-renderer failure)
