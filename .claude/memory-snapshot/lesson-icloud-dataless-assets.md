---
name: lesson-icloud-dataless-assets
description: Repo asset files on this machine can be iCloud "dataless" placeholders that hang forever on read — check the stat flags before blaming the tool
metadata:
  type: reference
---

`~/Desktop/video-editor` is inside an iCloud-synced Desktop, so files in `assets/` are sometimes
**dataless placeholders**: `ls` shows the real byte size, but any read blocks indefinitely while
macOS tries to materialise them. On 2026-08-23 `assets/logos/groww-shorts-badge-shadow.png`
(224,921 bytes on paper) hung three separate `cp` calls for two minutes each, and `brctl download`
did not recover it.

**Why:** it looks exactly like a slow disk or a wedged tool, so the instinct is to retry the copy
or blame the external volume. It is neither.

**How to apply:**
- The tell is `stat -f "%Sf"` / `ls -lO` showing **`dataless`** in the flags. Check that first when
  a copy of a small file takes more than a couple of seconds.
- Don't retry the copy in a loop — one attempt, then check the flag.
- Work around it rather than blocking: for the baked-shadow logos the fallback was the un-shadowed
  asset plus a CSS `drop-shadow` (render-safe in Remotion, which is real Chromium — the
  "bake the shadow in" rule in [[feedback-chrome-drop-shadow]] exists because HyperFrames silently
  drops CSS filters, and does not bind here). Verify the shadow by measurement afterwards.
- Tell the user, since only they can fix the sync.
