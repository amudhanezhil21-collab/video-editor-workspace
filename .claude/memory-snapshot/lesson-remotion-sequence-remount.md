---
name: lesson-remotion-sequence-remount
description: "A Remotion <Sequence> resets useCurrentFrame to 0, so any entrance animation REPLAYS at every sequence boundary — graphics that span many beats must be merged into one continuous run or they visibly blink"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1098f93b-0a91-4c2f-a23a-c7fa8c3f11dc
  modified: 2026-08-17T19:51:42.486Z
---

On invesco-vs-motilal (2026-08-18) the creator watched the cut back and said the
tables "keep blinking… going and coming within the fraction of seconds". Cause:
the timeline rendered **one `<Sequence>` per beat**. A Sequence restarts its
frame counter at 0, so every entrance animation (title fade, row-by-row build)
replayed at each beat boundary. One data element spans many beats, so a table
that sat on screen continuously for 22.5s rebuilt **6 times**.

Measured objectively before and after, on the table-body region only:
ink fraction dropped 0.091 → 0.011 at each rebuild (the table nearly vanishes).
175 table beats were mounting 175 times where the content only changed 39 times.

**Why:** it reads as flicker, not as animation, and it is invisible in stills —
every individual still looked correct. Only a frame-to-frame trace over a span
exposes it.

The creator restated it as the general rule, and it is the right way to hold it:

> "You are considering each beat as a cut, and then it's keep blinking.
> That should not be there."

Fixing it for tables only was not enough — banners, B-roll and cards all
remounted the same way. Generalised: 223 graphic beats collapse to **81 runs**,
142 remounts removed (39 table runs, 29 banner, 12 B-roll, 1 card).

**How to apply:**
- **A beat boundary is not a cut.** It is only a cut when the PICTURE changes.
  Give every beat a "what is drawn" key (`table:9`, `banner:<text>`,
  `broll:<id>`, `card:<text>`, or None for a bare creator shot) and merge
  consecutive beats whose key matches and whose frames are contiguous.
  Render ONE Sequence per run — never one per beat.
- Entrance animations then play once, when the graphic genuinely arrives.
- Anything that changes *within* the run (a highlight moving between cells,
  a value updating) must be a **schedule in absolute frames** read inside the
  mounted component — never a prop that implies a remount.
- Animate such changes as an **overlay whose opacity moves**, positioned behind
  the text (`position:absolute; inset:0` + `zIndex`), so the cell never
  re-lays-out. Snapping a background colour on the cell itself causes reflow.
- A graphic leaving and returning is only legitimate when the instruction puts a
  different frame type between the two (e.g. a Type 9 creator-alone beat). Count
  those: on this job it happened once in 813s. Everything else was remount.

**Detection recipe** (cheap, catches it without watching): decode a span at low
res, threshold to get an "ink fraction" per frame for the graphic's region, and
look for dips below ~75% of the run mean after the initial build-in. Zero dips =
stable. See also [[lesson-render-verification-traps]].
