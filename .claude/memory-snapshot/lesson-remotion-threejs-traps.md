---
name: lesson-remotion-threejs-traps
description: Remotion + Three.js on this machine — the setup and rendering traps that cost real time
metadata:
  type: reference
---

Absorbed into `.claude/skills/graphics/SKILL.md` (2026-08-22). Kept here as the short list.

- `node_modules` cannot live on the exFAT SSD → case-sensitive APFS sparse image on the SSD.
- React 19 requires `@react-three/fiber` **v9**; v8 throws `createRenderer`.
- Remotion's headless-shell download can extract with **no binary** (only ABOUT + LICENSE). Reuse the
  shell hyperframes already cached and pin `Config.setBrowserExecutable(...)`.
- **R3F orthographic frustum is in PIXELS** — `planeGeometry args={[2,2]}` is a 2-pixel plane.
- One full-frame `ThreeCanvas` positioned in world space; a nested sized canvas painted an opaque
  backdrop. Needs `alpha:true` plus `setClearAlpha(0)`.
- **`alphaextract` on ProRes 4444 misreports alpha** — verify with `remotion still --image-format=png`.
- FFmpeg `crop`'s w/h evaluate ONCE — they cannot animate a zoom. Use `zoompan`, supersampled.
- Shatter geometry: jitter the shared **vertex grid**, not per-triangle corners, or the intact object
  shows cracks before it breaks.

See [[lesson-render-verification-traps]] and [[feedback-lessons-into-skills]].
