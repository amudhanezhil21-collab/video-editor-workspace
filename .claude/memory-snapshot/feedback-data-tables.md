---
name: feedback-data-tables
description: "Creator's standing rules for data tables in BOTH formats — the whole table lands first then highlights run, and every rule is one weight on whole pixels"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f045a41f-8efe-42ac-b447-5237bf10ab77
  modified: 2026-08-23T08:12:06.772Z
---

Creator directives, 2026-08-23, on the `daily-vs-weekly-vs-monthly-sip` table. She asked for these
to apply to **both long form and shorts**.

1. **The full table comes first; the highlight then runs over an already-complete table.** Build
   everything — header band, all row labels, all values, all rules, source line — inside the
   entrance, finished before the VO reaches its first figure. After that the only animation is the
   VO-synced highlight moving cell to cell. Populating cells one at a time across the beat means the
   table is never whole while she talks about it. This supersedes the older "rows fill every ~0.25s"
   reading for held tables.
2. **Every rule is the same weight and the same colour** — 3px `$rule-strong` for row rules, bottom
   rule and column rules alike. Hierarchy comes from a tinted row band, never from a thicker line.
3. **Rules must be complete and land on whole pixels.** This was the actual cause of the uneven
   thickness she spotted: a 904px inner width over 3 columns gives 213.33px, so every vertical rule
   sat on a subpixel boundary and rendered at a different weight down the table. Pick padding and
   label-column width so the value columns divide to an integer (960px card, 24px padding, 270px
   label column → exactly 214px columns).

**Why:** a table that is still assembling while she reads it, or whose grid weights wobble, reads as
unfinished — the same "assembled, not designed" tell as bad seams.

**How to apply:** absorbed into `styles/groww-shorts/style.md` and `styles/groww-longform/style.md`
per [[feedback-lessons-into-skills]]. Verify by measurement — every rule should return the identical
pixel count and identical luma.

Related: [[feedback-transitions-and-scrims]], [[lesson-spec-tables-need-structure]].
