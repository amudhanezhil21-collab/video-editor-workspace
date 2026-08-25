---
name: lesson-seeked-renderers-immediaterender
description: "In any SEEKED renderer (HyperFrames/GSAP), fromTo defaults to immediateRender:true and pins every element to its end state — diff two far-apart frames to detect it"
metadata: 
  node_type: memory
  type: project
  originSessionId: f045a41f-8efe-42ac-b447-5237bf10ab77
  modified: 2026-08-23T05:46:26.611Z
---

Learned 2026-08-23 on `daily-vs-weekly-vs-monthly-sip` (HyperFrames 0.7.101 + GSAP 3.14).

GSAP's `fromTo` runs with **`immediateRender: true` by default**, applying its `from` values when the
timeline is *built*, not when the tween starts. The first tween on an element is harmless; the
**second** one silently destroys the animation. An exit written as
`fromTo(el, {opacity:1}, {opacity:0})` slams the element to opacity 1 at build time, so it is on
screen from frame 0 and its entrance never reads.

Nothing errors and the render looks plausible. On this job all 34 caption chips were visible
simultaneously from the first frame, stacked, and karaoke ran with five words amber at once.

**Fix:** put the from-state in CSS and pass `immediateRender:false` on *every* tween.

**Detection (cheap, wire it into every review):** sample two frames far apart and diff them. The
broken captions measured mean-abs-diff **0.03**; a working part with four staggered entrances
measured **2.3–3.6**. A part pinned to its end state barely changes.

Absorbed into `.claude/skills/graphics/SKILL.md` per [[feedback-lessons-into-skills]].
Related: [[lesson-render-verification-traps]], [[lesson-remotion-sequence-remount]].
