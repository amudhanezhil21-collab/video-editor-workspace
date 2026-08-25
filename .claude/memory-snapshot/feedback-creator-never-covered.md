---
name: feedback-creator-never-covered
description: "The creator renders IN FRONT of every graphic card, and cards are sized to clear her plate outright — z-order plus geometry, both required"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 335fe54b-8ea5-4864-816d-e74088e21993
  modified: 2026-08-24T02:01:53.062Z
---

The creator's face is never covered by a graphic. Enforcing that takes **two** things, and either
one alone leaves it to luck:

1. **Z-order — she goes in FRONT of the card.** Her plate is two layers, not one: the translucent
   rounded rectangle behind the card, her matte in front of it.
   `ground → props → plate rect → card → her matte → chrome`
2. **Geometry — the card takes only the space she is not in.** At 1920×1080 her plate is
   x 112–464 (left) or x 1454–1806 (right); title-safe is 192–1728; a 30px gutter gives a single
   card ~1230px, **not** the reference frame's measured 1415px.

**Why:** on `flexi-cap-large-cap-disguise` (2026-08-24) a table sat across her face for 18 seconds —
362px of card over her — because the plate was built as one layer *under* the card. She caught it in
the delivered draft: "forget the rule of no graphics intersecting the user's face? either make the
table or herself smaller, so they don't intersect."

**The trap that caused it:** her reference frames measure the table at 1415px wide, and in those
frames the table *does* overlap her — because in her edit the table's bottom corner is **occluded by
her hair**. Copying the measured width without copying the stacking order is what put the card on
her face. A measurement of a reference frame is not a layout instruction until you know which layer
is on top.

**How to apply:** measure it, never eyeball it — find the card's ink extent and assert it ends before
her plate begins. A mid-build frame hides the fault entirely, because the card fades in over her and
only becomes opaque later. Written into `styles/groww-longform/style.md` §1 and its own section.

Related: [[feedback-lessons-into-skills]], [[lesson-render-verification-traps]]
