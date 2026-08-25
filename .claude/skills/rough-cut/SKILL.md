---
name: rough-cut
description: Turn raw talking-head clips into the shortest cut that still delivers the value. Transcribes once with WhisperX, writes a cut sheet, splices with one FFmpeg filtergraph, and emits the remapped transcript every downstream skill reads. Use when a project has clips in raw/ and no base cut yet.
---

# Skill 1: the rough cut

**Whole job:** turn raw talking-head clips into the shortest cut that still delivers the value.

Claude cannot hear audio. It has no idea where a cut should land unless something tells it the sub-second timing of every word. WhisperX gives exactly that: word-level timestamps with forced alignment, tight enough that cuts land on the breath instead of near it. Transcription is what makes everything else possible.

## The five steps, in order

1. **Transcribe once**, with WhisperX `large-v3` and wav2vec2 alignment. Write the result to `transcript/transcript.json` in the project. Make re-running skip straight to that saved copy — this is the slowest step in the whole pipeline and it runs exactly once per video, ever.
2. **Also transcribe the `broll/` folder.** Creators narrate direction inside their own B-roll takes ("zoom in here", "use this for the pricing bit") and that direction never appears in the main script. The graphics plan reads it.
3. **Read the transcript and write `transcript/cutsheet.json`:** an ordered list of segments, each with a source clip, a start, an end, and the line of text it contains. The text field matters — it lets you sanity-check the whole edit by reading it, without watching anything.
4. **Splice with a single FFmpeg filtergraph.** One trim per kept segment, concat, then polish the audio once on the assembled track.
5. **Write out a second transcript, remapped onto the edited timeline.** Every downstream skill reads that file and nothing re-transcribes, ever.

## Automatic kills

- Filler words when they are vestigial
- Stutters and false starts
- Silences over about 0.4 seconds
- Tangents that do not serve the hook
- Throat clears and "let me start over"
- Any preamble before the hook lands — every video opens on the hook
- When a line was recorded several times, take the **last** take, always. It is the warmest delivery, and comparing takes wastes an hour.

**Preserve cadence though.** Do not surgically remove every "like". Some of them are rhythm.

## Gotchas (each of these cost real time)

- **Stream copy does not work on arbitrary cut points.** `-c copy` desyncs audio and video. Re-encode each segment with hardware acceleration instead. Still fast — around fifteen seconds for a minute of output.
- **Snap every cut boundary to the frame grid (n/fps) before splicing.** Video trims quantize to whole frames while audio trims are sample-exact — non-aligned boundaries make each segment's video and audio durations differ by up to a frame, and across a hundred-plus segments that random walk becomes visible lipsync drift. Frame-aligned boundaries make the two durations identical per segment, so drift cannot accumulate. Snap word-safely: never clip a kept word; up to ~20ms of excised audio re-admitted under a fade's zero-gain tail is inaudible and acceptable.
- **Single-pass dynamic `loudnorm` pads and resamples** (it upsampled a track to 96kHz and grew the output by a second). For the base cut, measure integrated loudness once (`loudnorm=print_format=json` null pass), then apply a fixed `volume=<gain>dB,alimiter` — deterministic, no resample, no padding. The finishing pass owns the final mix.
- **Never encode audio per segment.** Ride it through the cut lossless, then amplify and limit once on the assembled track. Encoding each piece separately puts a click at every join.
- **Do not auto-snap cuts to silence.** Word-level alignment is the whole advantage. Silence detection will drag deliberate boundaries into filler words and awkward pauses.
- **Retake seams clip word tails.** When a speaker cuts in on top of their own previous word, the kept word can sound chopped. Extend the out point slightly into the stumble and fade that segment's audio to zero over its last fraction of a second, so the word rings out instead of hard-clipping.
- **Stumbles hide inside long word spans.** WhisperX sometimes merges a stumble and its retake into one word span over 1.2 seconds. If a word's duration looks wrong for what it should sound like, that is the signal. Run silence detection across that span before deciding the cut.
- **The transcript will mishear things.** Cross-check before killing a line. "Claude" becoming "cloud" (or "Groww" becoming "grow") makes a perfectly good sentence look broken.
- **Screen recordings can carry a chapter track** that inflates the reported duration and leaves a black tail on the end. Probe with `ffprobe` and strip chapters when re-encoding.

## The dropout check — run it on EVERY transcript, before anything downstream

WhisperX can silently drop a long stretch of real speech. Not garble it, not mistime it — return a
transcript that looks complete, reads fluently, and is simply missing twelve seconds. Nothing in the
output flags it. On a Hinglish job (2026-08-22) it dropped 79.32→91.40s, and the missing span held an
entire instruction-anchored line; every graphic after it would have been mistimed.

**The check is cheap and non-negotiable:**

1. Find every inter-word gap over ~1.2s in the word list.
2. For each gap, measure the **actual audio energy** across it in ~0.5s windows.
3. A gap with RMS above about **−45 dBFS is speech WhisperX threw away**, not a pause. A real pause
   sits far below that.

```python
# gap is real silence -> fine.  gap is loud -> you just lost dialogue.
rms = np.sqrt((seg**2).mean()); db = 20*np.log10(rms)
```

**Recovering it:** cut the window (plus ~0.5s margin either side) to its own wav and re-run WhisperX
on just that span with a **more sensitive VAD** — `--vad_onset 0.200 --vad_offset 0.150`. Offset the
recovered words back to absolute time, drop any base words that overlap the recovered span, merge,
sort, and de-overlap. Then re-run the gap check on the merged list and confirm the largest remaining
gap is a plausible breath.

**When the re-pass disagrees with itself, the timeline is COMPRESSED, not dropped (2026-08-23).**
A second Hinglish job showed a different failure wearing the same costume: the gap check flagged
9.1s at 20.93→30.04 and the window measured −17 to −24 dBFS, so it looked like a plain dropout. It
was not. WhisperX had transcribed **every word correctly** and then packed ~13s of speech into 4s of
timestamps, leaving the remainder as a false hole. The tell: **each re-pass places its first word at
its own window start**, so a window beginning at 10s and one beginning at 22s return the same
sentence at two different absolute times. A dropout gives you *new* words; a compression gives you
the *same* words at a new offset.

**Diagnose with a short-window sweep.** Cut non-overlapping **3-second** windows across the disputed
region and transcribe them together. Three seconds is too short for the model to drift, so the
concatenated result is ground truth for *what is said when*:

```
16-19s  अगर daily 1000 rupees ki SIP      19-22s  toh valuation banti hai 12.33
22-25s  crore rupees. agar weekly 6997    25-28s  rupees ki toh bhi 12.33
```

**Fix it with forced alignment, not another transcription pass.** The text was never wrong, so
re-transcribing cannot help. Feed the *existing* text back through the aligner as one segment
spanning the whole file and let wav2vec2 place every word:

```python
audio = whisperx.load_audio(wav)
full  = " ".join(s["text"].strip() for s in base["segments"])
model_a, meta = whisperx.load_align_model(language_code="hi", device="cpu")
out = whisperx.align([{"start":0.0,"end":len(audio)/16000,"text":full}], model_a, meta, audio, "cpu")
```

On that job this took coverage 64.5% → 74.2%, closed every >1.2s gap to zero, and reproduced the
3s-sweep ground truth in **all seven** windows. **Validate the repair against the sweep** — a fixed
alignment that disagrees with a 3s window is still wrong.

**The gap check cannot see a truncated TAIL — check the ends separately (2026-08-23).** The
>1.2s-gap sweep only looks *between* words, so it is blind to speech dropped off the end of the
file. On a Hinglish short WhisperX returned a fluent transcript whose final "word" was a **0.02s
fragment** (`क`) at 88.26 — the real line, "comment karke bataiye", ran 88.23→88.92 and was simply
gone. The hole was 1.0s, i.e. *under* the 1.2s threshold, so nothing flagged it. It was also the
beat an instruction was anchored to.

Add two cheap end-checks to every transcript, alongside the gap sweep:

1. **`audio_duration - last_word_end`**, and `first_word_start`. Anything over ~0.4s at either end
   gets the same RMS test as an interior gap — above ~−45 dBFS it is speech, not room tone.
2. **Any word shorter than ~0.05s is a fragment, not a word.** A real syllable does not survive
   forced alignment at 20ms. Treat one at either end as a truncation marker and re-pass that window.

Recover it exactly like an interior dropout: cut from a little before the fragment to the end of
the file, re-run with the sensitive VAD, offset back to absolute time, and let the recovered words
REPLACE the fragment rather than merging alongside it — a de-overlap that keeps the base word will
silently discard the good recovery and keep the fragment.

Report the coverage you ended with (word count, first/last timestamp, largest remaining gap) rather
than assuming the merge worked.

## Mishears: the two-pass fix

**Pass 1 — the fixed list.** Apply the mishear list from `brand.md` to every transcript automatically. A mishear fixed once there is fixed in every future video.

**Pass 2 — automatic discovery.** Compare every transcript word against a system dictionary, print only the ones that are neither ordinary English nor already known, and judge them in context. A recurring brand name goes into the permanent list in `brand.md`. A one-off goes into a per-video list.

**Hard rule:** only ever auto-apply **single-word, whole-word** swaps. A two-words-into-one fix would change the word count and break every timestamp downstream — those go in the context-only list and get handled manually per occurrence.
