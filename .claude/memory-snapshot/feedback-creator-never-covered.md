---
name: feedback-creator-never-covered
description: "Nothing covers the creator's face — in BOTH modes: the matted plate on graphic beats, and the full-frame talking head where overlays must clear her head by measurement, not by a hand-picked fraction"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 335fe54b-8ea5-4864-816d-e74088e21993
  modified: 2026-08-25T08:08:14.206Z
---

Nothing covers the creator's face. She appears in **two different modes**, and the rule has to be
enforced separately in each. Fixing it in one is not fixing the rule — that is exactly how it shipped
broken twice on the same video.

## Mode 1 — she is a small matted plate on a graphic beat

1. **Z-order — she goes in FRONT of the card.** Her plate is two layers: the translucent rounded
   rectangle behind the card, her matte in front of it.
   `ground → props → plate rect → card → her matte → chrome`
2. **Geometry — the card takes only the space she is not in.** At 1920×1080 her plate is
   x 112–464 (left) or x 1454–1806 (right); title-safe is 192–1728; a 30px gutter gives a single
   card ~1230px, **not** the reference frame's measured 1415px.

**Why:** a table sat across her face for 18 seconds because the plate was built as one layer *under*
the card. She caught it in the delivered draft: *"forget the rule of no graphics intersecting the
user's face? either make the table or herself smaller, so they don't intersect."*

**The trap:** her reference frames measure the table at 1415px wide, and in those frames the table
*does* overlap her — because its bottom corner is **occluded by her hair**. Copying the measured
width without copying the stacking order is what put the card on her face. A measurement of a
reference frame is not a layout instruction until you know which layer is on top.

## Mode 2 — she is the full-frame talking head, and an overlay floats on her

Fixed by the above? No. `clearOfPlate()` only knows about the small-plate geometry, so on A-roll
beats the logo bubbles were placed by **hand-picked fractions** — `fx: 0.30`, `fx: 0.36`,
`fx: 0.64` in `Root.tsx` — that never consult where she actually is. All of them landed on her
head and burst there. She flagged it: *"even after a rule being that no graphics on her face, these
bubbles are coming in her face and bursting, it should have gone right and left or been bottom below
her face."*

**Acceptable zones, her words: left of her, right of her, or below her face.** Never over it.

**The tell I should have read.** The code carried `// fx 0.5 parked it over her mouth for the whole
6.5s hold` next to a nudge to 0.30. A magic number with a comment explaining a past miss is not a
fix — it is evidence the placement is unprincipled. One nudge fixed one beat and left the same class
of fault in every other bubble beat.

**How to apply:**
- **Measure her, do not guess her.** Derive the keep-out from the footage per beat, and take the
  **union across the whole beat** — she moves: hair swings wide, a hand comes up. A single mid-beat
  frame passes while the beat still fails.
- **Measurement method matters, and the cheap ones lie.** Skin-tone detection is useless in this
  room (brick wall and wood furniture are skin-toned — it returned a box spanning almost the whole
  frame). Sharpness-vs-bokeh does find her, since she is the only thing in focus, but it
  over-extends onto dark clothing and a raised hand. The reliable source is the **alpha matte**
  (BiRefNet lite-matting, already in this pipeline). Note the plates only exist for plate-bearing
  beats, so an A-roll overlay beat needs its own matte pass before anything can be placed safely.
- **An over-extended keep-out is its own failure.** It pushes overlays off-frame or into shrinking,
  which is the "fix that creates a worse problem" she warned about. Get the silhouette right rather
  than padding a bad estimate.
- **Do not fix by shrinking the bubble, dropping it, or letting it sit over her "briefly".** It
  bursts where it sits.
- **Overlay positions belong in the cutsheet, not in `Root.tsx`.** That map was the third instance
  of a beat's facts living only in composition code where no check can see them — after the b-roll
  clip map and the screenshot map. See [[lesson-absence-is-not-a-valid-state]].

## The general lesson

A rule expressed as *one guard in one code path* is not a rule, it is a patch. The same rule has to
be re-derived for every mode the subject appears in, and each mode needs its own measurement and its
own gate. When a directive gets violated a second time, the question is not "which number was
wrong" but "which other paths never consulted the rule at all."

Related: [[feedback-props-never-straddle-an-edge]], [[lesson-mask-crops-measure-silhouette]],
[[lesson-absence-is-not-a-valid-state]], [[feedback-lessons-into-skills]]
