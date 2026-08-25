# Instruction-compliance review brief

Reviewers check **one thing only: was every instruction followed exactly?** This is a conformance
instrument, not a taste pass. Do not suggest improvements to an approved design — report only where
the render departs from an instruction below. Every finding needs a **timestamp** and the **measured
evidence** (pixel coordinates, colours, counts), never "looks off".

## Ground truth — the creator's instructions, verbatim, anchored

Anchoring came from the Google Doc HTML export's positional markers. The Drive API returned these
threads in **exact reverse document order**, so any reviewer re-deriving them by reading order will
be wrong.

| # | Window | Instruction (verbatim) |
|---|--------|------------------------|
| REF1 | 0.54–3.32 | "plain A roll .. Zoom in" |
| REF2 | 3.32–7.18 | "a gold coin bag(3 bags) coming from bottom with subtle gradient at bottom." |
| REF3 | 9.42–42.77 | Linked doc: creator in a **square mask with a drop shadow**; background = gradient of brand purple + brand green with a **subtle very-low-opacity grid**; a white rounded-corner card holding a **TABLE animation (not a bar chart)** in brand fonts and brand colours, with the **column and row grids** as in the script table. Plus: "those lines should be highlighted whenever talked about" |
| REF4 | 42.77–52.20 | "An AI B-roll of three persons ultra realistic style indian , one having daily in shirt, the other weekly, and other monthly... but their returns that is pilinmg up in front of them is **equal for evry one**, use **dust** for them" |
| REF5 | 52.20–58.90 | Linked doc: "this type of motion graphics in **full screen** in **same background**, the motion graphics should suit with the line of script this comment was added upon" (line: "Toh lesson kya hai? Frequency par mat uljho, discipline aur long-term investing par focus karo!") |
| REF6 | 58.90–64.28 | "**same person** from previous AI b roll with monthly shirt on coming and giving a **thumps up**." |
| REF7 | 64.28–70.67 | "plain A-roll with **slow zoom in**. but with **subtle gradient below** with **subscribe and like button coming and going**." |

## Session directives (spoken this session, same authority)

- **S1 — Framing.** "The framing of the creator is shit, so zoom in, keep some headspace." Baseline
  measured 31.5% headroom above the hair and a head only 21.3% of frame height. The reframe must
  measurably beat that and must never crop the top of her hair or push her head above y=200.
- **S2 — Green-screen pipeline.** AI b-roll assets generated in Higgsfield on ultra key green, keyed
  out, composited as motion graphics. No green fringe, no holes in the subject.
- **S3 — Light leaks.** A light leak transition **with SFX** between every AI b-roll and the scenes
  immediately before and after it. That is **four** leaks: 42.77, 52.20, 58.90, 64.28. Each is 16
  frames (0.533s) with a single white-blowout frame, and the shot change sits **under** the white peak.

## Standing style rules that also gate this render

- Corner branding on **100% of frames**, knocked back to ~35% over the light table layout.
- Every data graphic carries a left-aligned `Source:` line — here `Source: Whiteoak Capital`.
- Safe zones: editorial content y 200–1620; nothing important in the top 200px or bottom 250px.
- Captions are an **English translation**, white bold on near-black chips, **exactly one word amber
  at a time**, advancing through every word.
- Colours come from brand tokens only: indigo `#5367FC`, amber `#FCB31C`, ink `#44475B`,
  accent green `#00D09C` (identity only — never data ink).
- **No crossfades. No fade to black.** The video ends cold.

## Known-good measurements to check against

| Thing | Expected |
|-------|----------|
| Frame / rate / duration | 1080×1920, 30fps, 70.68s |
| Reframe headroom | ~15.7% of frame height above the hair (was 31.5%) |
| Reframe head height | ~33.6% of frame height (was 21.3%) |
| Coin-stack equality (REF4) | three stacks within ~1% of each other |
| Dust | 45° halftone, ~4.11px diagonal pitch, neutral, ~3% RMS, only over the b-roll windows |
| Duplicate frames | under 3% |
| Table values | ₹1,000 / ₹6,997 / ₹30,384 · ₹109.08 Lac ×3 · ₹12.33 Cr / ₹12.33 Cr / ₹12.45 Cr · 13.47% ×3 |

## Reviewer discipline

- Write ALL scratch to `/Volumes/Extreme SSD/video-editor-jobs/daily-vs-weekly-vs-monthly-sip/review-scratch/<your-name>/`
  and delete it when done. The internal drive has under 4GB free and parallel frame dumps have
  filled it before.
- Extract frames at reduced scale unless you need to read on-screen text.
- **Never judge a build from one frame** — a mid-build frame of a good graphic looks broken.
- Report: `HH:MM.mmm — [REF#/S#] — what the instruction says — what the render does — measurement`.
