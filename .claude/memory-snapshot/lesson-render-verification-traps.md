---
name: lesson-render-verification-traps
description: "Traps when assembling and verifying a render — ffmpeg silently muxes the wrong (silent) audio track without -map, A/V comparisons need the TRUE head offset measured by cross-correlation, and the exFAT SSD explodes on node_modules"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1098f93b-0a91-4c2f-a23a-c7fa8c3f11dc
  modified: 2026-08-17T19:47:45.602Z
---

Collected on invesco-vs-motilal (2026-08-17/18). Each of these produced a
confident wrong conclusion before being caught.

## 1. ffmpeg picks the wrong audio stream without `-map`

Remotion writes a **silent audio track** into its render. Muxing that against a
real mix with `ffmpeg -i body.mp4 -i mix.wav -c:v copy -c:a aac out.mp4` let
default stream selection choose input 0's silent track. The whole 14-minute
delivery shipped silent and the ffprobe output looked perfectly healthy.

**How to apply:** always pin streams explicitly — `-map 0:v:0 -map 1:a:0`.
Then verify the OUTPUT has audio by decoding PCM and computing RMS, never by
trusting that a stream exists.

## 2. Verify a render by re-transcription, and get the offset right first

Re-transcribing the finished file and diffing against the source word map is
what exposed the silent mux (zero words returned). But comparing final vs source
audio needs the **true** head offset: the prepended card rendered as 125 frames
= 5.000s, yet the container reported 5.056s and the real concat offset measured
**5.021s**. Assuming 5.000s misaligned the comparison by 21ms, which on speech
transients produced energy spikes that looked exactly like leftover SFX — a
false positive I nearly reported as a bug.

**How to apply:** measure the offset by cross-correlating a ~20s window
(FFT-based) before differencing anything. Only then compare.

## 3. The external SSD is exFAT with ~1 MB allocation units

Copying `node_modules` (547 MB, ~100k tiny files) to
`/Volumes/Extreme SSD/` ballooned past **15 GB** in seconds before I killed it.

**How to apply:** keep node_modules on the internal disk and **symlink** it into
the SSD project. Large media files are fine on the SSD; many-small-files trees
are not. Also note exFAT has no hardlinks, so `ln` to save space does not work —
only symlinks or a real copy.

## 4. Background work the user cannot see

Launching long renders with `nohup … &` inside a shell call detaches them from
the harness, so they never appear in the user's task list and never notify. The
creator asked "where is it running?" and "it's not showing any running tasks".

**How to apply:** run long jobs as **tracked background tasks** so they surface
and notify. Reserve raw `nohup` for throwaway work. See
[[user-groww-creator]].

## 5. Sampling a video at a beat's first frame proves nothing

Frames sampled at `beat.t_in` show entrance animations at frame 0 — blank table
rows, a lower-third born as a 1px hairline. Both looked like defects and were
not. **Sample mid-beat** (t_in + 60% of duration) when checking whether content
is correct, and only sample frame 0 deliberately when checking an entrance.
