---
name: feedback-tables-are-built-never-pasted
description: "Tabular data is always rebuilt as an animated brand table — the creator's spreadsheet screenshot is the source, never the graphic; long tables split into stacked halves"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 335fe54b-8ea5-4864-816d-e74088e21993
  modified: 2026-08-25T07:58:20.937Z
---

If the script's item is **tabular data — rows and columns — it gets rebuilt**: brand tokens, teal
header (or headerless when only one column would carry a heading), rows animating in, highlights
driven off the transcript, source line beneath. Her spreadsheet screenshot is the **source**, never
the graphic.

**Why:** draft 1 of `flexi-cap-large-cap-disguise` (2026-08-25) pasted two of them straight onto the
card — Arial, hard spreadsheet gridlines, pale grid cells bleeding past the data — a few beats away
from properly built brand tables. She screenshotted both and said: *"instead of table being
generated, just the image from script was put as it is... It should put as an animated table only."*
`ref03` (mirae-industries.png, 16 rows x 4 cols) and `ref06` (over70-allocation.png, 5 rows x 2 cols).

**The excuse to watch for, because it was persuasive and wrong.** ref03 held 18 rows, and the build
reasoned that rebuilt at 31px a row it would be illegible, so a screenshot was "the only way to hold
all the rows without dropping any." Her own earlier directive in the same job already answered it:

> "use ivy presto, **let them land as two stacked halves rather than one 13 row card**"

**A long table splits. It does not become a screenshot.** Two stacked halves, or two cards across
consecutive beats. Row count is never a reason to paste. When a build starts justifying a shortcut on
craft grounds, check whether the creator has already ruled on that exact problem elsewhere in the
brief — a directive given for one beat is usually a general preference.

**How to apply:**
- Tabular data → always built and animated. No exceptions for row count, column count, or "the
  screenshot is more faithful."
- **Non-tabular source material stays an image** — a news headline, an app UI, a photograph, a real
  chart — inside a designed brand card with its source line. Do not over-rotate into redrawing
  everything; a blanket ban on images would be the worse rule. The test is the content, not the
  category.
- **Declare images in the cutsheet** (`"render": "image"`, `"image_src": ...`), never in a map inside
  the composition — the SHOTS map lived in `beats.tsx`, where no check could see it. Same defect as
  [[lesson-absence-is-not-a-valid-state]].
- Pasting also drags in artifacts she asked to remove: ref03's source carried the orange annotation
  marks she said to ignore.

**Both formats,** with the split axis flipped: long form lands a long table as two stacked halves;
vertical's constraint is WIDTH, so shorts splits by column or across consecutive beats. Neither
pastes. Does not touch app-screenshot b-roll, which stays legal in shorts.

Gate: `assert_no_pasted_tables.py` (finishing-pass) measures the bitmap's rule grid — 3+ horizontal
and 2+ vertical long rules means it is a table. Verified to clear a talking-head frame and an AI
b-roll frame at 0 rules, so it does not ban legitimate images.

Related: [[feedback-data-tables]], [[lesson-spec-tables-need-structure]],
[[feedback-props-never-straddle-an-edge]]
