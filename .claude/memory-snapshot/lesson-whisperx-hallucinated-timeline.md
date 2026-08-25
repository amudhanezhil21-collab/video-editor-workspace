---
name: lesson-whisperx-hallucinated-timeline
description: WhisperX on long multi-take footage can hallucinate a continuous sentence across take fragments — always cross-check word coverage against a silence map before cutting
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f86783cf-6414-4e15-95db-d113f87fb014
  modified: 2026-08-16T03:04:56.606Z
---

On job 1 (sip-horizon, 2026-08-09), full-file WhisperX (large-v3, hi) stitched an abandoned take, a quiet false start, and a hallucinated line into one fake continuous sentence (raw 28–56s region) and silently skipped ~20s of real speech (VAD misses quiet crew-directed speech). Cuts built on those word timestamps kept crew talk and clipped real lines — user caught it on watch-back.

**Why:** long multi-take talking-head files with retakes/crew direction break Whisper's alignment; stretched word spans (a "word" lasting 2–5s) are the tell. The rough-cut skill's "stumbles hide inside long word spans" gotcha applies file-wide, not just per-word.

**How to apply:**
1. After any full-file transcription, build a silence map (ffmpeg silencedetect, ~-27dB/0.5s) and diff it against word coverage. Speech regions with no words, or words spanning silence, mean the transcript timeline is fiction there.
2. Re-transcribe every suspect window as an isolated chunk (slice wav, transcribe per chunk with offsets) — short audio cannot drift. Build the cut sheet only from chunk-verified (text, time) pairs.
3. Verify every rendered cut by re-transcribing the render and diffing against the script BEFORE showing the user; also frame-check every join with agents (two 1-frame freeze dupes were caught this way).
4. FFmpeg trim/atrim/split mechanics were never the problem — don't chase splice bugs before checking the transcript map. (An unsplit [0:v] reuse is auto-split correctly by ffmpeg 8.)
5. **Whisper DEDUPES repeated phrases**: a false start + restart ("to return ka, ... to return ka level...") transcribes as ONE clean sentence in any full-window pass — invisible in every transcript-level check. The tell is a word span stretched across a silence gap. Micro-slice both sides of every such gap and transcribe each slice separately before deciding to keep the span. (v4→v5: user's ear caught a repetition all machine checks missed.)
6. A "last take" can be defective (trailing sub-audible delivery) — last-take-wins yields to audibility; flag the override to the user.
7. **Hinglish + `--language en` covertly TRANSLATES** (2026-08-15, invesco job): Whisper large-v3 forced to en on Hindi speech emits fluent English translation, not transcription — timestamps real, words fake. Use `--language hi` (Devanagari + code-switched Latin comes out right); match against romanized scripts by meaning. Keep the en pass — captions are English translations anyway.
8. **Dead VAD windows** (same job): stretches of loud speech return ZERO words in both the full pass and a normal chunk re-pass; a cutter then cuts through live speech (validator caught 5 scripted numbers missing this way). Recovery ladder: (a) chunk re-pass with `--vad_onset 0.35 --vad_offset 0.25` + `volume=8dB` recovers most; (b) still-dead windows get `ffmpeg volumedetect` — mean ≥ −30dB & max ≥ −8dB ⇒ speech is there: keep it in the cut as an explicit ⟦speech-unrecognized⟧ bridge word (no pause-kill splits inside), list the timestamps in the cut report for the creator's ear. Never cut through a no-word window without an energy check.
9. **Two overlapping decodings of one region = usually a real retake**, not one truth to pick: full-pass and chunk-pass each aligned a different attempt of the same re-said phrase. Reconcile by reading both against the script; keep the later attempt (final-take rule).
10. **NEVER concat verification windows with silence spacers** (2026-08-16, invesco v2 redo): whisper's VAD merges audio ACROSS spacers and alignment drifts through the merged span — every concat-with-offsets verification pass was corrupted by this. Pass windows as SEPARATE FILES to one whisperx invocation (`whisperx a.wav b.wav …` = one model load, per-file JSONs, no offsets to get wrong).
11. **The audio decides, not the map — the seam gate**: before rendering a cut, render every seam's actual joined audio and transcribe the joins (separate files); screen for doubles/clips/broken sentences. For ambiguous boundaries, bake-off: render candidate cuts, transcribe, pick the reading matching the script. Whisper dedupes repeats (a clean raw reading proves nothing) but a damaged cut reading DOES prove the cut wrong. Number/acronym words get time-squeezed by ASR (0.4s for a 1.5s number) — pad boundaries after them to the next −40dB silence. This loop took v1's 43 creator-audible defects to 130/131 clean verified seams in v2.

Related: [[project-pipeline-state]], [[user-groww-creator]]. Candidate close-out action: absorb a "silence-map cross-check" rule into the rough-cut skill (diff shown to user first).

12. **Span-splicing rounds can create REPLAY OVERLAPS** (v18 discovery): repeated local repairs left out-of-order/overlapping spans that replayed source audio (the "complete mess" garble the creator heard). After ANY splice-map surgery, assert segments are non-overlapping AND re-ASR every touched zone in the RENDER — timing metrics (offset track) are blind to equal-length garbage AND to gradual ramps (squeezed pauses); step-detection misses both.
13. **Take-identity is beyond envelope+ASR**: twin takes (same words, clean delivery) cannot be distinguished by envelope correlation or transcription. Matching a reference cut take-for-take needs spectral fingerprinting, or creator timestamps + bake-off swaps. State the boundary honestly instead of looping.

14. **The dropout is now a MANDATORY GATE, and the procedure is absorbed** (2026-08-22, one-stock job).
    WhisperX dropped 79.32→91.40s of a 97s file — twelve seconds — and returned a transcript that read
    fluently with no marker of any kind. The missing span held an entire instruction-anchored line, so
    every graphic after it would have been mistimed. Procedure, now written into
    `.claude/skills/rough-cut/SKILL.md` and made a standing rule in `CLAUDE.md`:
    find every inter-word gap > ~1.2s → measure real audio RMS across it in 0.5s windows →
    **RMS above ~−45 dBFS is dropped dialogue, not a pause** → re-run that window alone with
    `--vad_onset 0.200 --vad_offset 0.150`, offset back to absolute time, drop overlapping base words,
    merge, de-overlap, then re-check the largest remaining gap.
    Cheap, deterministic, and it caught what item 8's ladder would only have found by luck.

Absorbed per [[feedback-lessons-into-skills]].

**A THIRD failure mode: a truncated TAIL (2026-08-23, smallcap-250 job).** The >1.2s-gap energy
gate is blind to speech dropped off the END of the file, because it only looks *between* words.
WhisperX returned a fluent transcript whose last "word" was a **0.02s fragment**; the real closing
line ("comment karke bataiye", 88.23-88.92) was simply missing, and the hole was 1.0s — under the
threshold. It was also the beat an instruction was anchored to. Now also check
`audio_duration - last_word_end` and `first_word_start`, and treat **any word under ~0.05s at
either end as a truncation marker**. On recovery the recovered words must REPLACE the fragment —
a de-overlap that prefers the base word silently keeps the fragment and discards the good
recovery. Written into the rough-cut skill the same pass.
