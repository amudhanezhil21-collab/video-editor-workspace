---
name: lesson-mask-crops-measure-silhouette
description: "Face/PIP/mask crops: NEVER size them from a face-detector box — Haar boxes over-extend ~170px above the real hairline and produce huge headroom; measure the hair top from the silhouette alpha and leave ~5% headroom, face ≈78% of crop width"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 20728406-7896-4f82-bd7c-84472c5f6eb4
  modified: 2026-08-24T02:01:00.912Z
---

Creator correction on the avatar job (2026-08-24, dwm-sip-avatar): "the rectangle mask of the
creator has a lot of head room" — the REF3 table-takeover mask showed ~35% wall above her hair.

**Why:** the crop rectangle was derived from an OpenCV Haar face box expanded upward by a fixed
factor (0.55×h) "for hair". On this footage the expansion put the crop top at y192 while the real
hair top (measured from the fitted avatar layer's alpha channel) was y≈423 — 231px of wall baked
into a 594px crop. Detector boxes are for *finding* a face, not for *framing* one.

**How to apply (now implemented in the job's `assemble.py`, keep for every future PIP/mask crop):**
1. Measure the REAL hair top from the subject's silhouette — the alpha channel of the keyed/fitted
   layer, sampled at 3 times inside the beat, restricted to the face's column band, take the min.
2. Crop top = hairtop − ~5% of crop height (style.md: "minimal margin above the hair").
3. Crop width so the face box fills ~78% of it; aspect = the destination mask's aspect.
4. Verify by rendering the frame and measuring the headroom share inside the mask.

Also absorbed into `styles/groww-shorts/style.md` (PIP face-card section). Related:
[[feedback-lessons-into-skills]], [[project-dwm-sip-avatar-job]].
