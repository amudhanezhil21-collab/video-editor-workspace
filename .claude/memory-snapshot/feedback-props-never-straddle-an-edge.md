---
name: feedback-props-never-straddle-an-edge
description: "A floating background prop is fully clear of the card (≥24px) or fully behind it — never sliced by its edge, which leaves a sliver poking out"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 335fe54b-8ea5-4864-816d-e74088e21993
  modified: 2026-08-25T07:48:22.974Z
---

A decorative background prop has **two** acceptable relationships with a card and one that reads as
a mistake:

| | |
|---|---|
| Entirely clear of the card, ≥24px | fine — this is the reference look |
| Entirely behind the card, invisible | fine — nothing to see, nothing to notice |
| **Straddling the card's edge** | **broken** — a sliver of sticker poking out from behind it |

**Why:** the creator screenshotted one on `flexi-cap-large-cap-disguise` draft 1 (2026-08-25) and
said it "looks weird." She was right, and it was not one — measurement found **11 collisions across
all three props**, from both vertical and horizontal card edges. The top-right prop occupies
x 1624–1711, y 156–267 once its ±3.5/±5.5px drift and hard down-right shadow are folded in; card
right edges landed at 1647 (ref11/ref14/ref18, 23px in) and 1682 (ref06, 58px in), while nine other
beats sat 177–203px clear. ref16 was sliced HORIZONTALLY — the prop's top poked above the card's top
edge. ref10/ref12 had the card's *bottom* edge cut both dim props, leaving only the bar panel
showing.

**Cause:** prop anchors are fixed fractions of the frame while card widths vary per beat, so nothing
ever compared the two.

**How to apply:** resolve each prop against the card, per beat. Clear by **≥24px** (the drift plus
shadow needs more than 20 — a 2px gap like ref03's is not clear, it is a straddle a second later),
or fully behind, or move it to the nearest fully-clear spot in its own region. If no clear spot
exists there, **drop that one prop for that beat**; two carry the texture fine.

**And do none of these — the creator explicitly warned against a fix that creates a new problem:**

- **Do not remove the props when a card is up.** Her own frames carry table *and* props together.
- **Do not shrink them.** The size is measured off her artwork; smaller reads as noise.
- **Do not move them in front of the card.** Decoration over data is a bigger error than a sliver.
- **Do not animate them out on card entry.** Popping is louder than the overlap, and a re-entering
  prop replays its animation at every beat boundary — see [[lesson-remotion-sequence-remount]].
- **Do not push them to the frame edge.** x=1728 is title-safe and the badge and Groww lockup own
  those corners; her own props stop at 88.85% of frame width.
- This is the rule against **any** foreground edge, not just a card's — a prop half-behind her
  shoulder looks equally wrong. See [[feedback-creator-never-covered]].

Gate: `assert_props_clear.py` (finishing-pass skill). Written into `styles/groww-longform/style.md`
§1 and its own section.

**Two traps in building the gate itself, both of which produced a false clean pass:**
1. It first matched raw prop colours — but the props render at **three opacities (1.0 / 0.38 / 0.28,
   `tokens.ts` ICONS.opacities)**, so the two dim ones never matched, measured 0px on every beat, and
   were skipped as "not calibratable." It was checking one prop of three while printing a pass.
   Expected colour must be the ink composited over the measured local ground.
2. It first measured "how far the card edge reaches into the prop's box," which called ref19 a
   straddle when the card covered all but 3px of the prop — i.e. invisible and perfectly fine. The
   only quantity that matters is **how much of the prop is showing**.

Related: [[lesson-absence-is-not-a-valid-state]], [[feedback-lessons-into-skills]]
