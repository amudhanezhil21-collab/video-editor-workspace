---
name: lesson-absence-is-not-a-valid-state
description: "A missing asset must abort, never degrade — and the review loop cannot catch an absence, because a reviewer sees what IS there, not what should have been"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 335fe54b-8ea5-4864-816d-e74088e21993
  modified: 2026-08-25T07:19:36.884Z
---

When something is absent, ask whether the code can tell the difference between **absent** and
**deliberately empty**. If it cannot, that is the defect — not the absence.

**Why:** `flexi-cap-large-cap-disguise` draft 1 (2026-08-24) shipped with **none** of its three
finished AI b-roll clips. The assembler branch read `elif bid in BROLL and os.path.exists(f'{WORK}/{bid}-broll.mp4')`
— a filename no build ever produced, while the clips sat in `broll/` under their own names. Because
the branch was an `elif` in a chain ending in a plain-footage `else`, "file not found" meant "this
beat is meant to be plain footage." 21 seconds of talking head, no error, no warning, correct
runtime, duplicate-frame gate green. **Six review passes missed it. The creator found it on first
viewing** and asked why there was no AI-generated part.

**The review loop cannot catch this and must never be relied on to.** A reviewer looking at frames
sees what is there, not what should have been — plain talking head where a shop scene was specified
is a perfectly good frame with nothing to flag. Absence is a *manifest* problem, not a perception
problem.

**How to apply:**
- Preflight the whole asset list and **abort with every missing item named**, before encoding a
  frame. A per-branch `exists()` test cannot do this: by the time the branch runs, "absent" already
  has a legal meaning. `assert_beat_assets.py` in the `finishing-pass` skill.
- After the render, prove each asset **reached the picture** by comparing the frame to **its own
  asset**, not to the base footage. 25x margin on the real job: landed 0.6–4.1, lost 105–110.
  `assert_beats_visible.py`.
- **Never derive an asset path from an id.** Resolve through the recorded value; a rebuilt name is a
  guess that fails silently.
- **Anything the assembler knows that the cutsheet does not is the same bug waiting to recur.** Both
  draft-1 faults were facts trapped in `assemble.py` — `BROLL = {...}` (which clip) and
  `LOWER_THIRD = {...}` (which takeover is really a lower-third). Beats declare themselves:
  `"clip": "b02-shop-crowd"`, `"composite": "overlay"`.
- **A cached piece hides the fix.** mtime-vs-asset is not enough — the broken pieces were *newer*
  than the clips they failed to open, because the bug was in routing. Invalidate against the
  assembler script's own mtime too, or delete `render/pieces/` before re-running.
- **Never return a sentinel from a measurement.** Writing this very check, the first version quieted
  ffmpeg with `-v error`, which swallowed the `metadata=print` line it existed to read, returned
  `-1.0` for every beat, and scored `-1.0` as a pass — reporting "27 beats changed the picture" on
  the render whose b-roll was missing. **Always negative-test a new gate:** break something on
  purpose and confirm it fails. Two real bugs in these gates were caught only that way.

**The sibling trap — two clocks.** The cutsheet speaks in BODY time; the deliverable has a
disclaimer in front, so its clock is shifted (3.00s on this job). A wrong offset does not fail, it
**lies**: at offset 0 the visibility gate flagged ref06 and ref16 as lost when both were fine, and a
reviewer handed those timestamps would confidently confirm two defects that do not exist. Derive the
offset from `render/concat.txt` (parts before the body, summed), confirm it against one beat's
picture, and abort if it cannot be determined — never default to 0. Pixel correlation alone cannot
find it: a static beat matches equally well at every offset inside its hold. Name review frames in
body time, seek in render time.

Same shape as the 0-row table in `build_specs.py` and the music bed that died at 60s.
Written into `finishing-pass/SKILL.md` and `CLAUDE.md`.

Related: [[lesson-render-verification-traps]], [[feedback-lessons-into-skills]],
[[lesson-spec-tables-need-structure]]
