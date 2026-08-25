---
name: feedback-chrome-drop-shadow
description: Corner branding (badge + wordmark) must carry a soft drop shadow and stay crisp, in both formats — bake it into the asset because CSS drop-shadow() does not render in HyperFrames
metadata:
  type: feedback
---

Creator directive, 2026-08-23, for **both long form and shorts**: the corner logos must have a drop
shadow and read clearly. Flat chrome sits on top of the picture instead of in it.

`brand.md`'s golden rule already covers this — every graphic element carries a drop shadow — the
chrome was just being treated as an exception. Over footage it takes `shadow-soft`. Calibrated at
1080×1920 for a 74px badge and 56px wordmark: **offset 4px right / 5px down, sigma 6px, black 46%**.

**The trap:** `filter: drop-shadow()` is a CSS filter, and filters are **not render-safe in
HyperFrames** — they silently do not render, so the chrome comes out flat with no error. `box-shadow`
shadows the bounding box of a transparent PNG, not the mark. So **bake the shadow into the asset**
(`assets/logos/*-shadow.png`), then grow the rendered height and shift the position by exactly the
pad so the mark stays put.

**How to verify:** difference the frame against the un-shadowed build — expect ~+10 luma mean and
~+49 peak under a badge-sized mark, with a clean-background control near 0. Do not measure a wide
box below the element; the wall's own vignette swamps a tight shadow and reads as a false positive.

Absorbed into both style files per [[feedback-lessons-into-skills]].
Related: [[feedback-transitions-and-scrims]], [[feedback-data-tables]].
