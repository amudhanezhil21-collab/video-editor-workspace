---
name: feedback-lessons-into-skills
description: Standing directive — every lesson learned must be written into a permanent skill or style file, not just applied once
metadata:
  type: feedback
---

The user's standing instruction (2026-08-22): **"apply everything you learn in some permanent skill
you have … and then I might give extra lessons that also the same way you should learn."**

Every lesson — mine or theirs — goes into durable repo files in the same pass it is learned. Not a
note in chat, not a one-off fix.

**Why:** they are building a video editor that improves over time. A correction that only lands in
one job's output is lost; a correction written into a skill or the style file tightens every future
video and every future review, because the review sub-agents read the style fresh each pass.

**How to apply:**
- Where does it belong? Colour/type/voice → `brand.md`. Look-and-motion conventions →
  `styles/<style>/style.md` + `style.json`. Engine/tooling gotchas → the relevant
  `.claude/skills/*/SKILL.md`. Cross-cutting pipeline rules → `CLAUDE.md` standing rules.
  A genuinely new capability → a NEW skill (this is how `instruction-harvest` was created).
- Reusable tooling ships as a **script inside the skill's `scripts/`**, genericised, not left in the
  job folder.
- CLAUDE.md requires **showing the diff before it becomes standing behaviour** — but this directive
  is blanket authorisation to apply, so apply and then show what changed.
- When a new lesson arrives, ask: is this one-off, or should it hold for every future video? Only the
  second kind gets absorbed. Say which you judged it to be.

See [[project-pipeline-state]] for what has been absorbed so far.
