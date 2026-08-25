# video-editor — pipeline contract

This workspace is an AI video editor. It has two halves that never mix:

- **Taste (permanent, shared):** `brand.md` + `styles/`. This is how videos look and sound. It improves over time.
- **Jobs (disposable):** `projects/<job>/`. One folder per video, named after the content in kebab-case. Never camera filenames, never dates, never stage suffixes like `-final` or `-v2`. One folder carries the whole piece across every stage.

Anything that does not clearly belong to one of those two halves is design drift. No notes files, no config files, no temp folders in the root.

## The pipeline

**The creator supplies the finished cut — there is no cutting stage.** The edit starts from her cut video in `raw/`.

Every video runs the same five stages, short form or long form. Format only changes how graphics and captions behave inside stages 2 and 4, and that is driven entirely by the style file.

| # | Stage | Skill | Runs on |
|---|-------|-------|---------|
| 0 | Harvest the direction | `instruction-harvest` | Only when the brief lives in comments on a script doc |
| 1 | Transcribe | — | **WhisperX — mandatory on every video** |
| 2 | Graphics | `graphics` | Remotion **or** HyperFrames (per machine) |
| 3 | AI B-roll | `ai-broll` | Higgsfield **or** Kie.ai (per machine) |
| 4 | Finishing | `finishing-pass` | FFmpeg |
| 5 | Export | `export` | FFmpeg |

Each stage's rules live in its skill under `.claude/skills/`. Read the skill before running the stage. Do not re-derive the pipeline from memory.

## Job folder layout

```
projects/<job>/
├── raw/             the creator's supplied cut, copied in, never moved
├── broll/           screen recordings and supporting footage
├── audio/           licensed music, sound samples for this video
├── assets/          references, screenshots, logos for this video
├── transcript/      transcript.json and cutsheet.json — the durable record
├── graphics-build/  the composition source. This is the real progress
└── outputs/         renders and the cut-aligned transcript
```

## Standing rules

- **Engines are per machine, not per repo.** This workspace is shared across machines that have different tools installed. Check what *this* machine has before stage 2 or 3 and use that — never assume, never install the other one to match another machine.
  - **Motion graphics — Remotion where available** (preferred, user directive 2026-08-11): React compositions in the job's `graphics-build/remotion/`, rendered with `npx remotion render`, giving per-layer prop control in Remotion Studio. **HyperFrames is the fallback** where Remotion is not installed — pin it at `hyperframes@0.7.101`, never `@latest`. Either engine must produce the same look; `brand.md` + the style file are the authority, not the engine.
  - **Generated video — Higgsfield where it is connected**, otherwise Kie.ai (`KIE_API_KEY` in `.env`). See the `ai-broll` skill for both.
  - **Never silently convert an existing job to the other engine.** A job's `graphics-build/` belongs to the engine that built it (`value-funds-double-digit` is Remotion). Re-building it elsewhere is a request to confirm, not a decision to make quietly.
- **The taste skill runs on every graphic.** Every graphic is HTML and CSS, so anything that makes Claude better at front-end design makes the motion graphics better. `design-taste-frontend` (tasteskill.dev) is installed and applies to every graphic in every video — it is an approach, not a template, so it improves graphics in whatever style is being worked in. **It never picks colours, fonts or a visual direction** — `brand.md` and the style file already did. A skill that argues otherwise is wrong here.
- **The review loop is not optional.** After every render, sub-agents watch it back with the `watch` skill and hand back timestamped findings. Fix, re-render, review again until it passes. Claude cannot see video without it. Run it in two distinct passes — technical QA as a checklist, then composition as its own named step — and run an **early spot review after the first ten percent of the graphics build**, not just at the end: a wrong placement habit caught once is a fix, caught at the end it is a rebuild.
  - **Reviewers cannot see what is missing.** A beat that silently rendered as plain footage looks fine to every reviewer, because the frame *is* fine. Absence is caught by manifest, not by eye: run `assert_beat_assets.py` before the assembler encodes and `assert_beats_visible.py` after every render (both in the `finishing-pass` skill). Draft 1 of `flexi-cap-large-cap-disguise` shipped without any of its three AI b-roll clips, through six review passes.
  - **A beat's facts live in `cutsheet.json`, never in the assembler.** Which clip a b-roll beat uses, whether a takeover is really a lower-third — if only `assemble.py` knows it, nothing can verify it, and that is exactly how the b-roll was lost.
- **Style absorbs corrections.** Any review note that should apply to every future video gets written into the active style file (with the diff shown first) before the job closes. One-off notes are applied and forgotten.
- **Colours come from `brand.md` tokens** (`$bg`, `$accent`, ...), never hardcoded hex in style files or graphics.
- **WhisperX runs on every video, no exceptions.** Stage 1 transcribes the supplied cut to word-level timings — Hinglish jobs pass `--language hi` (`en` covertly translates). Every graphic in the pipeline is word-synced, so nothing downstream can start without it. Apply the `brand.md` mishear list at this point. Transcribe **once**: the saved transcript in `transcript/` is the durable record and nothing re-transcribes it, ever.
  - **Always run the dropout check before using a transcript.** WhisperX can silently drop a long stretch of real speech and still return something that reads fluently. Measure audio energy across every inter-word gap over ~1.2s; a gap above ~-45 dBFS is lost dialogue, not a pause. Recover it with a sensitive-VAD re-pass on that window and merge. Procedure is in the `rough-cut` skill.
- **Local direction never silently overrides a style convention.** A script comment that conflicts with the style file is a conflict to flag, not a decision to make quietly.
- **When the direction lives in comments on a script doc, run `instruction-harvest` first.** Comment threads come back sorted by ID, not document order — anchoring them by reading order mis-assigns every instruction in the job, and the result looks correct. Use the HTML export's positional markers. Follow the links inside the linked docs too; they routinely go three deep, and the deepest level is often the only real spec.
- **Claude's memory lives IN this repo**, at `.claude/memory-snapshot/`, via `autoMemoryDirectory` in each machine's **user** settings (`~/.claude/settings.json`) — it is ignored in checked-in project settings by design, so every machine sets its own absolute path once. Lessons are therefore tracked the moment they are written, and `git pull` genuinely teaches the other machine. Never hand-copy memory files, and never point a script at an external memory directory to mirror in — that logic prunes live memories under this setup.
- **Nothing reaches GitHub on its own.** `git add -A && git commit -m "..." && git push`, every time. A SessionEnd hook warns when work is uncommitted or unpushed, but it only warns.
- **Heavy work goes on the external SSD; `node_modules` goes on a case-sensitive APFS disk image on that SSD.** The internal drive runs under 4GB free, and exFAT breaks `node_modules`. exFAT also litters `._` AppleDouble sidecars that break every `glob("*.png")` — filter them, and set `COPYFILE_DISABLE=1`.
