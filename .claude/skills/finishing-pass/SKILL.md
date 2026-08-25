---
name: finishing-pass
description: Captions, a music bed, a handful of sound effects, then the review loop. Runs the watch sub-agent reviews (technical QA pass, then composition pass) until the video passes, and absorbs standing corrections into the style file before the job closes. Use after graphics and B-roll are composited.
---

# Skill 4: the finishing pass

**Whole job:** captions, a music bed, a few sound effects, then review.

Three sub-steps that can each run alone, but always in this order when run together, because each one operates on whatever the previous one produced.

## Captions

Burn them in from the **remapped transcript**, styled from the active style file and the caption voice in `brand.md`. Two things designed in from the start:

- **Never caption a file that is already captioned.** The script picks its own input rather than accepting whatever it is handed.
- **Captions are genuinely optional.** Long form skips them entirely — YouTube serves its own, and burn-ins clutter a 16:9 frame.

## Music

A flat bed at about **-18 dB, no ducking, no fade in, a short fade out on the tail.** The track is user-supplied and licensed — the skill never downloads one. **Check the bed's duration against the video FIRST** (2026-08-24: a 60.03s bed under a 66.6s video died silently at 60s and read as ducking/dropouts in review) — when it is short, crossfade-loop it into itself (`[b1][b2]acrossfade=d=2:c1=tri:c2=tri`) so it stays flat to the end, then apply the tail fade. And "-18 dB" is the applied GAIN, not a target RMS — reviewers who measure gap RMS at -32 dBFS are reading the track's own dynamics, not a defect. Ducking and fade-in exist as opt-in flags and you should almost never reach for them. If the bed is not audible enough, change the level; do not add a sidechain.

## Sound effects

Sparse. A handful of moments per video, not a hit on every cut. Real sample files at around **-10 dB**, from the library in `assets/sfx/` that builds up over time. **Never a synthesised tone** — a generated sine wave is instantly recognisable as not-a-sound-effect. If there are no samples, skip the step rather than fabricate one.

## Audio pass mechanics

- Music and SFX are **pure audio passes. Copy the video stream, never re-encode it.**
- **Write the effects plan and the filter graph out to disk.** When a graphics tweak later re-renders the base, re-apply the exact same plan instead of re-deciding every placement.

## A missing asset ABORTS. It never degrades.

Two mechanical gates, both required, neither optional:

```bash
# BEFORE the assembler encodes a frame — are the assets on disk?
scripts/assert_beat_assets.py <job-root> --pieces
# AFTER the render — did they actually reach the picture?
scripts/assert_beats_visible.py <job-root> --render <file>
# LAYOUT — is any foreground edge slicing a background prop?
scripts/assert_props_clear.py <job-root> --verbose
# CONTENT — is any table pasted as a screenshot instead of built?
scripts/assert_no_pasted_tables.py <job-root> --verbose
```

Both exit 1 and name the beats. Do not soften either into a warning. They catch **different**
failures: draft 1 had the b-roll clips present on disk *and* absent from the render, so the first
gate alone would have passed it.

The assembler routes beats through an if/elif chain, and the natural way to write each branch is
"is this the right kind of beat **and** is its asset there?":

```python
if   kind in SEGMENT and part:               ...   # rendered graphic replaces the frame
elif bid in BROLL and exists(clip):          ...   # b-roll clip replaces the frame
elif kind == 'transition' and exists(TRANS): ...
else:                                        ...   # plain footage
```

That shape makes a missing file **indistinguishable from "this beat is meant to be plain footage."**
It falls to the `else`, the piece encodes cleanly, the runtime is exactly right, the duplicate-frame
gate passes, and the render looks finished. There is nothing to notice. On
`flexi-cap-large-cap-disguise` draft 1 three finished AI b-roll clips shipped **completely unused** —
21 seconds of plain talking head where the shop scene should have been. The creator found it; six
review passes did not.

Three rules, and they are separate:

1. **Preflight, then encode.** Build the list of assets every beat owes, assert all of them, abort
   with the full list. A per-branch `exists()` test cannot do this job — by the time the branch is
   evaluated, "absent" has already been given a legal meaning.
2. **The cutsheet names the asset, not the code.** Draft 1's beat said `{"kind": "broll"}` and
   nothing more; the clip filename lived in a dict inside `assemble.py`. Nothing outside that file
   could tell a clip was owed, so nothing could check it. Beats declare their own assets —
   `{"id": "ref02", "kind": "broll", "clip": "b02-shop-crowd"}` — and the assembler reads that.
3. **Never derive an asset path from the beat id.** The draft-1 branch tested
   `render/ref02-broll.mp4`, a name no build ever produced, while the clip sat in `broll/` under its
   own name. Resolve through the recorded value; a rebuilt name is a guess that fails silently.
4. **Then prove it landed.** Compare each beat's frame against **its own asset**, not against the
   base footage. "Does the picture match the thing it claims to show" has a 25x margin on the real
   job — assets that landed measured 0.6-4.1, the three lost b-roll beats measured 105-110. Against
   the base footage the same test separates far more weakly and inverts for overlays.

### The head offset: two clocks, and reviewers must be handed the right one

The cutsheet speaks in **body time**. The deliverable has a disclaimer card in front of the body and
an endscreen behind it, so **the file's clock is not the cutsheet's clock** — on
`flexi-cap-large-cap-disguise` the shift is 3.00s.

Get it wrong and the review does not fail, it **lies**. Running the visibility gate at offset 0 on a
render whose true offset is 3s flagged ref06 and ref16 as lost assets when both were perfectly fine.
Hand those timestamps to a reviewer and it will go and *confirm* two defects that do not exist,
describe whatever sat 3 seconds earlier as the beat's content, and miss the real faults. Nothing in
the output looks wrong. This is worse than no review, because it produces confident findings.

- **Derive it, never type it.** `render/concat.txt` lists the parts in order; the head is the sum of
  everything before the body. Both `assert_beats_visible.py` and `prep_review.py` now do this
  automatically and **abort** if they cannot — neither defaults to 0.
- **Confirm it against the picture.** A manifest can be stale. One opaque beat must match its own
  asset at the derived shift, or stop: the manifest, the cutsheet and the render disagree.
- **Correlating pixels alone will not find it.** The natural probe is a long static beat, but the
  stillness that makes it match reliably also makes every offset inside the hold match equally well.
  There is no peak to lock onto. Derive from the manifest; use pixels only to verify.
- **Name frames in body time, seek in render time.** `prep_review.py` writes `REF2-mid_t23.83.jpg`
  (body) while seeking 26.83 (render), so a reviewer's finding maps straight back to a beat with no
  arithmetic and no chance of a silent 3s slip.

Anything the assembler knows about a beat and the cutsheet does not is the **same defect waiting to
happen again**. Both draft-1 faults were facts trapped in `assemble.py`: which clip a b-roll beat
uses (`BROLL = {...}`), and which 'takeover' beats are really lower-thirds (`LOWER_THIRD = {...}`).
The second one produced a false positive in the visibility gate, because no checker could know what
only that file knew. Beats declare themselves — `"clip": "b02-shop-crowd"`, `"composite": "overlay"`
— and every consumer reads the cutsheet.

**And the trap that hides the fix:** cached pieces are reused when they exist, so a fixed asset plus
an old piece means **the fix appears to do nothing.** mtime-against-the-asset is not enough — the
broken b-roll pieces were *newer* than the clips they failed to open, because the bug was in the
routing, not the asset. Invalidate against the **assembler script's own mtime** too, or delete
`render/pieces/` before re-running.

**The general shape, worth recognising anywhere in this pipeline:** a missing thing written as a
valid state instead of a failure. It is the same bug as the 0-row table in `build_specs.py` and the
short music bed that died at 60s. When something is absent, ask whether the code can tell the
difference between *absent* and *deliberately empty*. If it cannot, that is the defect — not the
absence.

## The review loop: give it eyes

Everything above gets you a workflow, not a one-shot edit. Claude cannot see video — it can only read the transcript. That is why the rough cut nails every time (pure transcript problem) and why graphics come back with small issues (it never sees the result). The fix is the **watch** skill: pull frames out one by one so any moment can be inspected on screen. Once the editor can see its own work, it works like a real editor: make a change, watch it back, spot what is off, fix it, repeat until it looks right.

The loop needs exactly two ingredients: **a goal** (finish the video) and **a way to check the work** (the watch skill). That is the entire recipe for an agent loop.

**In the pipeline:** the render finishes. Sub-agents watch it back like a picky editor — visual glitches, spacing, alignment, the general feel — and hand back a list of **timestamped findings**. Fix, re-render, review again, until it passes. By final human review, the video has already been through half a dozen reviews it ran on itself.

**It has to be sub-agents, not the main session,** for a boring reason: frame dumps flood the context window. Send the review out, get findings back.

**But the review loop cannot catch an ABSENCE, and you must not expect it to.** A reviewer looking
at frames sees what is there, not what should have been. Plain talking head where a b-roll shop
scene was specified is a perfectly good frame — well exposed, on-brand, nothing to flag. Six passes
over `flexi-cap-large-cap-disguise` draft 1 missed exactly that, three times, and the creator found
it on first viewing. Absence is a **manifest** problem, not a perception problem: run the two gates
above, mechanically, every render. Reviewers judge what is on screen; the gates decide whether the
right things are on screen at all.

### Contrast is measured, not eyeballed

Text over footage is the one visual failure a checklist reviewer describes as
"hard to read" instead of measuring. `scripts/contrast_check.py` settles it:
it takes the overlay's own alpha as the text mask, samples the real pixels
immediately around that text **in the render**, and computes the W3C contrast
ratio between them.

```
python3 scripts/contrast_check.py RENDER.mp4 checks.json
```

Each check names the overlay art, where it is composited, and the timestamps to
sample — several across the element's life, because the backdrop moves. Floors
are the WCAG AA ones: **4.5:1** normal text, **3.0:1** for large display type
(`"large": true`). It exits non-zero when anything is below its floor, so it can
gate a render.

This belongs in the **technical QA pass**, not composition: it returns
"3.1:1 at 20.5s, below the 4.5 floor", which is a fact, not an opinion. The
style file's contrast-scrim rule is the fix; this is the proof the scrim worked.

Verified against synthetic clips of known contrast (white on black / mid-grey /
near-white) and reads within 0.05 of the analytic value.

**Run the review in two distinct passes — the single most useful rule in the whole system:**

1. **Technical QA, as a checklist.** Catches everything binary and unambiguous: a stretched asset, a vanished element, a wrong colour, a brightness dip at a seam.
2. **Composition, as its own named step.** "Why is that at the top", "that's tiny", "does this actually make sense" are judgment calls with no pass/fail, so a checklist-driven reviewer skips right past them while looking directly at the frames that show the problem. Concrete items: every overlay re-checked against what the style file says for that element category, and every distinct visual moment named in the direction accounted for as built or **explicitly flagged as skipped — never silently simplified away.**

### Every frame, not a sample — and the reviewers must be blind

The `watch` skill caps at **2 fps and de-duplicates by default**, so it can never show a reviewer
every frame of a 25fps video. When the instruction is "check every frame", pair it with the bundled
tools:

```bash
python3 scripts/prep_review.py  RENDER.mp4 OUTDIR CUTSHEET.json   # the evidence pack
python3 scripts/frame_audit.py  RENDER.mp4 SPEC.json OUTDIR       # deterministic per-frame numbers
python3 scripts/caption_solver.py CFG.json TMPDIR                 # caption placement, solved
```

- **`prep_review.py`** extracts one JPEG per frame at a strict 1:1 mapping (`-vsync 0`), then tiles
  them into **contact sheets of 50 frames each, every frame appearing on exactly one sheet**, plus
  full-resolution stills at every instruction boundary. A reviewer reading the sheets covering their
  slice has genuinely seen every frame. (Build sheets with `select+tile` straight from the render —
  the concat demuxer chokes on a JPEG list.)
- **`frame_audit.py`** reads every frame and reports hard numbers: frame count vs expected, duplicate
  percentage (the assemble gate — clean is under 1%, the frame-scheduler bug is ~25%), plus per-frame
  luma, bottom-band level, face-zone statistics, high-frequency energy and redness. This is the
  ground truth the vision reviewers get checked against.
- **`caption_solver.py`** places captions by measurement (see the caption section below).

**Tell the reviewers where to put scratch.** Their session scratchpad is on the internal drive.
Five reviewers plus a verifier per finding, each dumping frames, will fill it in minutes — it
happened twice on this job. Name an explicit directory on the fast external volume in the prompt and
tell them to clean up; "work on the SSD" is not specific enough.

**Split the review across ~5 blind reviewers, one timeline slice each.** Give them ONLY the render,
the creator's instructions verbatim, the measured spec digest and the evidence pack. Do **not** give
them the build plan, your reasoning, or the list of things you already fixed — a reviewer who knows
why you did something will rationalise it. Then **adversarially verify every finding**: a second
agent per finding, told to default to refuting it and to confirm only from the pixels. On this job
that filtered reviewer noise without losing real defects.

**Verify CAMERA MOVE by comparing the render to the SOURCE at the same frame index.** A reviewer
reported "there is no zoom" on a beat that provably has one; measuring scale between two different
frames of the same clip fails because the subject moves more than the 4% zoom does. My own first
attempt made the identical error and scored an un-zoomed control at 1.030. Compare render frame N
against source frame N — same instant, so any geometric difference IS the move. That recovered
1.012 / 1.024 / 1.034 / 1.040 against built targets of 1.011 / 1.023 / 1.033 / 1.039.

**Check an overlay by DIFFERENCING against the base, never by absolute luma.** Two round-1
findings claimed a bottom gradient was "completely absent"; both were wrong. Dark footage under a
gradient looks the same as no gradient, and a gradient over a dark dress reads as ordinary shadow.
`base_frame - composite_frame` at a few rows settles it in one measurement. Tell reviewers this
explicitly — it is the single most common false positive they produce.

**Do not judge a graphic from a single frame.** A build that is excellent at frame 170 looks broken
at frame 60 — the pie has one wedge, the table is half-populated. That is what the contact sheets are
for.

**Re-solve anything that depends on a render you have since changed.** Caption placement, mask rects
and occupancy maps are all derived from the overlays; re-render one overlay and they are stale.
Equally: **never composite a render that is still being written** — gate the assemble on a decode
check (`ffmpeg -v error -i X -frames:v 3 -f null -`), because a half-written ProRes file fails with
"invalid frame header" halfway through a two-minute composite.

**Use a frame-extraction skill, not a video-understanding model.** The reason is control: the editor decides exactly where to look, so it can inspect the seam between two specific graphics rather than being handed a summary of the whole clip.

(The early spot review at ten percent of the graphics build lives in the graphics skill; this skill owns the full-render reviews.)

## Captions must not fight the graphics

Placing captions by eye does not survive contact with a dense build. Solve it:

1. Build a per-frame occupancy map of graphic **content** — local edge energy, so a smooth gradient
   background is not treated as a collision but a card, table or number is. Occupancy from raw alpha
   is far too strict: a full-frame takeover paints everything and every caption looks "unplaceable".
2. Walk a ladder of candidate Y positions and take the first that clears the graphics, the face box
   and the safe zones; otherwise take the least-overlap position and report the residual.
3. **B-roll is not a collision** — captions persist over b-roll by design.
4. Where nothing clears, **suppress that caption group** and let the on-screen evidence carry the
   line. A caption fighting a full-frame data card is worse than no caption.
5. **The face box is PER BEAT.** On a full-frame takeover her face is inside the PIP mask, not at
   her full-frame position. Feed the solver the mask rect detected from that scene's alpha; using the
   default box there rejects the one clear band the scene actually has and forces a needless
   suppression. Let a chip sit FLUSH against the mask's bottom edge — requiring strictly-greater
   rejected the only slot that fit a 114px gap between a face card and a table.
6. **Let the ladder reach HIGH, not just low.** The clear band on a data takeover is often between the
   face card and the table (y512-626 on one scene here). style.md already sanctions high placements.
7. **Suppress sparingly.** A modest residual overlap beats a silent gap — reviewers flagged one 4.3s
   uncaptioned stretch in two separate rounds. Reserve suppression for beats where the caption would
   genuinely fight the graphic, and for reframe windows.
8. **Inside a reframe window the face is not where the static face box says it is.** A caption placed
   against the original box lands on her mouth. Suppress across reframes, or re-derive the box.

## Caption TIMING: anchor on the loanwords, never distribute evenly

Captions are an English translation, so there is no word-for-word mapping to the Hindi — but there is
a very good partial one, because the creator speaks a great deal of English vocabulary inside the
Hinglish. Use it:

1. **Anchor**: walk the spoken words forward and match them against the English caption tokens
   (greedy forward, so a repeated word like "stock" anchors to successive occurrences). Every match
   is a hard time anchor.
2. **Interpolate** the remaining English words between consecutive anchors.
3. **Crucially, WhisperX writes those English loanwords in DEVANAGARI** — स्टॉक, फंड्स, थिमाटिक,
   परफॉर्मेंस, इंपैक्ट, इंवेस्टर्स. Keep a loanword map (`transcript/loanword-map.json`) and
   transliterate before matching. On this job that took the anchor count from 58 to 78 and pulled a
   caption from 3.5s out of sync to within 0.03s of the spoken word.
4. **Check the English clause ORDER against the spoken clause order.** A natural English translation
   often reorders clauses relative to the Hindi; distribute that evenly and the caption runs seconds
   ahead of the words. If a line has no anchors at all, its order is the only thing keeping it in
   sync — rewrite the translation to follow what she actually says, in the order she says it.

Evenly-distributing translated words across a beat is the default and it is wrong.

## Contrast: measure the GLYPHS, not the chip

`contrast_check.py` uses the overlay's alpha as the text mask. If your overlay is a solid chip with
text on it, that mask is the whole chip, and the ratio it returns is meaningless (it compared a chip
against the footage behind it and reported 1.29:1 for white-on-indigo that actually measures 4.5:1).
For chip-based lockups, sample the rendered pixels directly: take the brightest cluster inside the
chip as the ink and the dominant mid cluster as the fill. Display type (>=~34px bold) is judged
against the 3.0 floor, not 4.5.

## Close-out: the style file absorbs every correction

Any correction from review that should apply to every future video gets **written back into the active style file before the job is closed out.** Distinguish those from one-off notes, which are applied and forgotten. **Show the diff before it becomes standing behaviour.** Because review sub-agents read the style fresh on every pass, an absorbed correction tightens every future review with no extra wiring.
