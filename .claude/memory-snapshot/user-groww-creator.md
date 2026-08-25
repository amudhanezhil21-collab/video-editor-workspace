---
name: user-groww-creator
description: "Who the user is and how they communicate direction — Groww creator, Hinglish videos, voice-note style instructions, wants explicit asks"
metadata: 
  node_type: memory
  type: user
  originSessionId: f86783cf-6414-4e15-95db-d113f87fb014
  modified: 2026-08-09T09:44:06.713Z
---

The user is a content creator making short-form vertical (9:16) talking-head finance videos for the Groww brand (Indian fintech, green #00D09C). Most videos are in Hindi/Hinglish.

- They give direction as transcribed voice notes: conversational, non-technical English ("see at 25% down there is a black shade where the text is overlaid"). Parse intent from plain descriptions; never expect editor vocabulary. Reply in plain language, minimal jargon.
- They want to be told explicitly "to build X, I need Y from you" whenever something only they can provide is missing (footage, licensed fonts/music, real screenshots, decisions). Never silently fake or skip — ask.
- They send footage via WhatsApp. One clip already arrived with its audio track stripped (video-only). **Always ffprobe incoming files for an audio stream before starting**; if mute, request re-send as WhatsApp Document / Drive / AirDrop.
- They plan to direct by reference: YouTube links from their Groww channel + timestamp + "replicate this animation/background". Workflow: watch the reference, extract frames, rebuild as code in brand tokens.
- THE SUPREME TASTE ANCHOR (user 2026-08-09: "this is the best video ever, if you make something like this, I will be the happiest"): youtube.com/shorts/tHLbdnZwIo4 — "Introducing Groww Nifty Smallcap 250 Momentum Quality 100 ETF" (Jun 2 2026, 115s). Match THIS video's grammar above all other references. Secondary golds: yT-Q4o_l8Do (overall look), x7l0uLRvPXc (b-roll usage), 4KDJ6SoQ9bo (THE motion-graphics masterclass — 3D element frames, user: 'best video to learn how to use motion graphics'). User's flagged deltas vs our v2 composite: scrims/backgrounds far subtler, face-cell much tighter (minimal headspace), lots of b-roll (generate via Kie).
- Standing agreement (2026-08-08, user's own words): the 4 reference videos ARE the framework to follow for all edits; Claude has blanket permission to ask for anything needed, and SHOULD actively grill the user at intake when footage arrives (where cuts should land, must-keeps, graphic choices) rather than guessing.
- Standing-preference direction given in chat must be absorbed into [[project-pipeline-state]]'s style files (styles/editorial/) with the diff shown — that is how their words persist across videos.

## Working style (added 2026-08-18, invesco-vs-motilal)

- **Long jobs must be visible.** Asked "where is it running?" and "it's not
  showing any running tasks" when a render was launched detached with `nohup &`.
  Run long renders as tracked background tasks so they appear and notify, and
  state the working directory + how to check progress. See
  [[lesson-render-verification-traps]].
- **Blunt, specific feedback and expects it fixed at the cause.** "Your video
  came as shit" was followed immediately by precise direction (which things get
  motion graphics, and how tables should behave). Take the diagnosis seriously,
  find the mechanism, and show the measurement — not reassurance.
- **Notices motion artefacts before content errors.** Spotted table remount
  flicker ("keep blinking… within the fraction of seconds") and correctly
  distinguished it from the creator frames, which they judged fine.
- **Directives arrive incrementally mid-task** and supersede earlier ones
  (no music → keep SFX → remove SFX). Re-check the current instruction before
  each assembly rather than assuming the earlier answer still holds.
