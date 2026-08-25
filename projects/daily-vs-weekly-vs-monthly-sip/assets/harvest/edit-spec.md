# Edit spec — daily-vs-weekly-vs-monthly-sip

Harvested 2026-08-23 from doc `1RiLA7r8ttcg…` ("Copy of Daily vs Weekly vs Monthly SIP").

## Anchoring — READ THIS FIRST

The Drive API returned the 7 comment threads in **exact reverse document order**. Anchoring by
reading order would have mis-assigned every instruction in the job. The table below comes from the
HTML export's positional `cmnt_ref` markers (`anchor_comments.py`) and is ground truth.

| Ref | Anchored script line | Window (corrected transcript) | Creator's comment, verbatim |
|-----|----------------------|-------------------------------|------------------------------|
| REF1 | "Daily SIP karun, Weekly, ya fir Monthly?" | 0.54–3.32 | "plain A roll .. Zoom in" |
| REF2 | "Konsi frequency se sabse jyada returns milenge? 🤔" | 3.32–7.18 | "a gold coin bag(3 bags) coming from bottom with subtle gradient at bottom." |
| — | "Aao dekhte hain data kya kehta hai!" | 7.18–9.42 | *(no comment — plain)* |
| REF3 | Whole data block → "Source: Whiteoak Capital" | 9.42–42.77 | "(doc 1sE8Lkwu…) As instructed in the document. but those lines should be highlighted whenever talked about" |
| REF4 | "Matlab long term mein frequency se koi farak nahi padta! …" | 42.77–52.20 | "An AI B-roll of three persons ultra realistic style indian , one having daily in shirt, the other weekly, and other monthly... but their returns that is pilinmg up in front of them is equal for evry one, use dust for them (too.<yt d97J4TbIwXw>) use this video animation style." |
| REF5 | "Toh lesson kya hai? Frequency par mat uljho, …" | 52.20–58.90 | "(doc 1X5n3nBg…) Follow these instruction" |
| REF6 | "Monthly SIP kaafi logon ke liye preferrable hai …" | 58.90–64.28 | "same person from previous AI b roll with monthly shirt on coming and giving a thumps up." |
| REF7 | "Toh aapka SIP frequency kaun sa hai? … comments." | 64.28–70.67 | "plain A-roll with slow zoom in. but with subtle gradient below with subscribe and like button coming and going.use this animation style used in this video. <yt d97J4TbIwXw>" |

## Level-2 docs (both were pointers whose real spec is an image)

**`1sE8Lkwu…` — the table frame (REF3).** Prose + one 986×1766 reference frame:
> "…creator is in square mask, the mask should have drop shadow… maintain similar background as
> shown in the reference (a gradient of both brand purple and brand green, a subtle grid with a very
> low opacity)… instead of bar graph animation I need table graph animation that's of in the script.
> The table should be in brand fonts, brand colours… column and row grids as shown in the script table."

Measured off the reference frame: rounded-square face mask top-centre with a soft down-right drop
shadow; white rounded card (radius ≈40px) below holding the graphic; ground is the periwinkle→white→mint
diagonal with a faint grid — **this is exactly `brand.md`'s `gradient-ground`**, so the creator's
"brand purple and brand green" and the style file agree. No conflict.

**`1X5n3nBg…` — the full-screen motion graphic (REF5).** Prose + one 912×1596 reference frame:
> "I need this type of motion graphics in full screen in same background, the motion graphics should
> suit with the line of script this comment was added upon."

Measured: Ivy Presto italic display title in `$indigo`, a central conceptual illustration built from
`$indigo` vector forms + desaturated 3D props, on the same `gradient-ground` with grid, face fully
absent. Line it must suit: *"Toh lesson kya hai? Frequency par mat uljho, discipline aur long-term
investing par focus karo!"*

## Level-3 — the YouTube reference (linked from REF4 and REF7)

`youtube.com/shorts/d97J4TbIwXw`, 1080×1920 @25fps, 123.2s. Measured, not described:

- Its signature is **full-frame painterly illustrated inserts**, hard cut in and out, no Ken Burns.
- Insert durations, measured by luma-run detection: **1.4s, 2.4s, 1.4s, 2.9s** (range 1.4–2.9s).
- Insert ground colour: **#F8F6DC warm cream**, saturation mean 39–60 (pastel), luma mean 199–232.
- Long soft directional cast shadows; edges bleach out to the ground colour; generous negative space.
- Captions: white bold on **semi-transparent dark-grey** rounded chips, centred, 1–2 words per chip.

## Conflicts — flagged, not resolved quietly

1. **Motion engine.** `styles/groww-shorts/style.md` says *"Animated/motion graphics are built with
   Remotion, not HyperFrames (creator note 2026-08-11)"*. The session directive (2026-08-23) says to
   key the Higgsfield assets and **"use hyperframes to make it more visually engaging motion
   graphics."** Proceeding on the newer spoken directive; the style file's line is now stale and
   needs the creator's word before it is rewritten.
2. **Frame rate.** style.json declares `fps: 25` and every measured transition constant (light leak =
   13 frames) assumes 25fps. **The creator's supplied cut is 30fps.** Re-timing a finished cut to 25
   would resample every frame and risk drift against her audio. Staying at **30fps** and rescaling
   the light-leak curve from 13 samples to 16 frames so the measured look is preserved.
3. **Insert palette.** The reference short's inserts are warm cream #F8F6DC; the style file mandates
   `paper-ground`/`gradient-ground` and the indigo palette. Applying the reference's **composition
   and motion grammar** (full-frame, hard cut, 1.4–2.9s, long soft shadows, negative space) on the
   **Groww ground and palette** — the style file wins on colour, the creator's doc wins on content.
4. **Transition density.** style.md budgets 1–2 chapter transitions per video. The session directive
   asks for a light leak **either side of every AI b-roll**, which is 4. Following the directive.

## Unknowns

- The reference short contains **no subscribe/like button animation** (checked its tail). REF7's
  "use this animation style" cannot be measured for that element, so the subscribe/like build follows
  the style file's own measured outro micro-skit spec instead.
- REF2 says "subtle gradient at bottom" and REF7 "subtle gradient below" with no colour or height.
  Using the style file's rule: cosine falloff to **true zero**, layered under the chrome.
