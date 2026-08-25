---
name: script-cut
description: Script-matched cut for scripted footage. Use when a job has raw takes in raw/ AND a script document in assets/ — the creator read from a script, so the cut is driven by matching her spoken words to it (long-form explainers are the usual case). For unscripted footage with no script document, use rough-cut instead.
---

# Skill 1S: the script-matched cut

**Whole job:** reduce a pile of scripted takes to the one flawless take the creator was aiming for. The script document is the source of truth for what belongs in the video; the footage is many attempts at it. The finished cut keeps exactly one clean attempt at every conversational line, in script order, with **zero repeats**.

The mechanics here are `rough-cut`'s — WhisperX invocation, the transcribe-once rule, the mishear two-pass, every FFmpeg gotcha, the cutsheet and remapped-transcript contract. Read `rough-cut` before running this. This skill replaces only its editorial judgement: shortest-cut becomes script matching.

## Inputs

Two, always:

- **The script document** (`assets/*.docx`) — the intended spoken narrative, heavily mixed with visual cues, tables, metric comparisons and source citations.
- **The raw footage** (`raw/`) — the creator speaks only the conversational paragraphs. Multiple takes, repeated words, fillers, minor variations.

If either is missing, stop and ask for it.

## Step 1 — parse the script: matching and data exclusion

Parse the docx preserving block order and block type (paragraph vs table — read `word/document.xml` directly or use python-docx). The spoken candidates are the conversational paragraphs **only**. Strip before matching, and never search the footage for:

- tables, graphs and raw data blocks
- "Source: …" lines
- disclaimers, the "RA Sign" block, analyst name and date
- the title line and layout labels (e.g. fund-name captions that sit under charts)

Save the survivors as `transcript/script.json`: ordered conversational paragraphs, each `{id, text}`. Every downstream decision references paragraphs by that id.

## Steps 2–5 — the cut decisions, in order

Work paragraph by paragraph through `script.json` against the raw transcript. Fan out `script-matcher` sub-agents over transcript windows when the footage is long; the rules they apply:

2. **Repetition scan — word by word.** Compare the raw transcription against the script word-for-word; the comparison granularity is the single word, because most repeats are one word — sometimes half a word (a stutter onset: "two thousand, two thousand twenty-six"). A phrase- or sentence-level scan will miss them and give terrible output. Keep the **final take** of every repeated word or passage. Completion bar: every script word is delivered exactly once in the assembly — zero repeats at word level.

   **Final-take exceptions (creator directive 2026-08-15), both logged in the cut report:**
   - *Technical defect* in the final take (mic noise, off-frame glance, external sound) → fall back to the previous take.
   - *Factual misspeak* (a number or fact that contradicts the script) → prefer the earlier take where she said it right. If **no** take says it right, keep the final take and raise a **blocker finding** — the decision (VO patch, re-record, or let the on-screen graphic carry the correct number) is the creator's, never made silently.
3. **Eliminate extras.** Filler noises ("ah", "um"), tangential comments, direction spoken to camera, verbal slates ("Clip 1"), restarts — anything not part of the script's core intent gets cut. If she says something that is not in the script, it goes.
4. **Missing words, shortforms, alternatives.**
   - *Missing:* 1–2 words skipped → join the before and after segments for smooth flow.
   - *Missing paragraph:* an entire script paragraph never spoken (or unusable) → finish the cut around it, and flag it in the cut report as a decision the creator must make **before stage 2** — graphics must never get planned around an unnoticed hole.
   - *Shortforms:* "large and mid cap" for "large and mid cap fund" → keep it.
   - *Alternatives:* a different word meaning exactly the same thing → keep it.
   The bar is the **consensus of the message** — clean, natural delivery, never robotic verbatim reading.
5. **Smooth every join.** Jump cuts are forbidden *in the finished video*, even when avoiding one costs effort. Cut on breaths and word boundaries from the word timestamps; respect `rough-cut`'s retake-seam rule (extend the out point, fade the tail). Every seam carries a cover plan in its segment's `cover` field, and **all covers are applied at stage 2, never here** (creator directive 2026-08-15) — the base cut stays full-frame, so its render visibly jump-cuts by design:
   - `"punch-in"` — the default seam eraser: an instant crop-level change across the cut (house grammar: crop *changes*, never animated push-ins).
   - `"face-card"` — she sits small in a frame while motion graphics take the major part of the screen; the seam lands while she is framed, so the jump is never seen.
   - `"broll"` — a planned B-roll or graphic takeover hides the cut (the J/L-cut simulation).
   **Pause policy:** shorts rules apply to long form too — kill every silence over 0.4s, maximum density (compress to ~0.3s, cutting on the word boundaries around it). Each pause-kill is a seam like any other and gets a cover mark.
   After stage 2's covers, the final flow must read as one continuous, natural take.

## The cutsheet

`transcript/cutsheet.json` — ordered segments `{src, start, end, text, scriptPara, cover?}`. `scriptPara` ties every segment back to `script.json`; a segment that maps to no paragraph is an extra that survived Step 3 — remove it.

## Step 6 — final validation: the audio decides, never the map

Transcript word timestamps are hypotheses, not facts (learned the hard way, 2026-08-16: v1 shipped 43 audible defects by trusting them). The rules that keep the map honest:

- **Word map**: transcribe 25–35s silence-anchored chunks, never one long file — short audio cannot drift. Zones that come back empty or garbled get 3s forced-decode slices (`--vad_onset 0.30`, +8dB). A zone no pass can decode is usually a **stammer field** — never cut through it blind, and never keep it blind either: arbitrate (below).
- **Numbers and acronyms get squeezed** — ASR marks "39.57%" as 0.4s when she takes 1.5s. Any boundary within 0.5s after a digit/acronym word pushes out to the next −40dB silence.
- **Pauses are found by energy** (silencedetect −32dB), never by ASR word gaps — a gap in the word map may be a word ASR refused to hear.
- **Batch multi-window ASR passes as separate files in ONE whisperx invocation** (`whisperx a.wav b.wav …`). Concatenating windows with silence spacers corrupts everything: whisper's VAD merges across spacers and alignment drifts through the merged span.
- **Seam gate (mandatory before render):** render the actual joined audio of every seam (tail 1.6s + fade + head 1.6s), transcribe all joins as separate files, and screen for doubled words, clipped words, and broken sentences. Fix and re-gate until clean. A near-silent join can hallucinate ("subscribe subscribe" from room tone) — cross-check a nonsense reading against the segment content before acting.
- **Bake-off arbitration:** when a boundary is ambiguous (which take? where does the number end?), render each candidate cut as audio, transcribe candidates as separate files, and pick the reading that matches the script. Remember whisper **dedupes repeats** — a clean raw reading does not prove no repeat, but a *damaged* cut reading does prove the cut is wrong.
- `cut-validator` still runs over the cutsheet for coverage/order/factual checks, but its word-timestamp claims are subordinate to the seam gate.

Only after the seam gate is clean, splice **straight through** — the creator reviews the actual video, not a transcript draft (creator directive 2026-08-15). After the render: full re-transcription diff AND the `watch` review with a checkpoint list before the creator sees it.

## Step 7 — the gauntlet loop (mandatory, creator directive 2026-08-16)

The bar is the creator's reference cut library (first entry: the invesco reference; its distilled numbers live in `styles/groww-longform/cut-style.md` — read it before cutting). No cut ships until it wins blind:

- **With a same-footage reference** (rare): recover its cut points by banded monotone acoustic alignment against the raw, match them, and side-by-side envelope-judge the render against the reference until every window correlates.
- **Without a reference** (the normal case): after the machine gates, verify **script coverage** (every sentence and number of the script located in kept audio — a silently missing line is the worst historical failure), check conformance to the measured style numbers (seam beats, paddings, density), then fan out fresh-context critic agents on random 30s windows of the render, blind-paired with windows from the reference library, judging one question: *which reads more like one flawless take?* Every window the critic scores against ours becomes a fix; loop — re-cut, re-gate, re-judge — until the critic picks ours (or can't tell) on every window. Never exit on a round count.

The definition of done is the creator's: zero stammers, zero repeats, zero breathing gaps, zero reactions; shortforms and synonym-conjunctions kept; the complete script audible.

## Deliverable

- The spliced cut in `outputs/` (one FFmpeg filtergraph, per `rough-cut`'s gotchas).
- The remapped transcript on the edited timeline (what every downstream skill reads).
- **The clean-cut transcript**: the final edited narrative as continuous text in **romanized Hinglish, matching the script's own spelling** — never Devanagari, never an English translation. It must read perfectly — as if the creator nailed the performance in a single, flawless take.
- **The cut report** (`transcript/cut-report.md`): every final-take fallback and why, every factual flag awaiting a creator decision, every missing paragraph, every seam and its cover plan. Nothing in the cut happens silently.
