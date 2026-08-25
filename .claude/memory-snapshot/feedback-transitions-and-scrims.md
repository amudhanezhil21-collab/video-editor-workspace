---
name: feedback-transitions-and-scrims
description: "Creator's standing rules on transitions, scrims and captions — a light leak is only a transition, cut on the finished sentence, gradients dissolve both ways, no captions on AI b-roll"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f045a41f-8efe-42ac-b447-5237bf10ab77
  modified: 2026-08-23T06:48:19.904Z
---

Creator directives, 2026-08-23, watching draft 1 of `daily-vs-weekly-vs-monthly-sip`. All four are
standing rules, not one-off notes.

1. **A light leak is a transition and nothing else — she must never appear inside one.** She called
   it "the creator glitch". Two causes, both must be closed: the outgoing segment has to hold full
   strength to its last frame (any exit animation uncovers the base A-roll under the leak), and the
   composite's segment windows must **underlap the next beat by ~0.2s** (exact-abutting `enable`
   gates leave one uncovered frame, and one frame of bare footage inside a leak is visible).
2. **Never cut away while she is still finishing a sentence.** Time transitions to the end of the
   spoken thought, not the nominal beat boundary. The table's exit started at 42.43 while she was
   still saying "13.47%" (42.29–42.69); she read that as a jump cut.
3. **Every black gradient dissolves in AND out** (~0.5s each way), and stays subtle — peak ~0.72
   alpha over a tall band. A scrim that snaps on, or that simply stops when the beat ends, reads as
   abrupt. No hard-edged black rectangle.
4. **No captions over AI-generated b-roll.** Captions on generated people read as odd; let the
   footage carry the line. This narrows the older "b-roll is not a collision" rule to real/stock
   b-roll only.

**Why:** these are all about the edit reading as deliberate rather than assembled — the seams are
where an AI edit gives itself away.

**How to apply:** absorbed into `styles/groww-shorts/style.md` (Golden rules section) per
[[feedback-lessons-into-skills]]. Check them on every short before delivery, and measure the leak
boundaries rather than trusting the timeline.

Related: [[lesson-seeked-renderers-immediaterender]], [[project-pipeline-state]].
