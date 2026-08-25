# Source & reference — measured facts

Everything here was measured from pixels/probe, not eyeballed. Build decisions cite these.

## Files

| | path | spec |
|---|---|---|
| Source | `raw/source.mp4` | 1080×1920, 25fps, h264, 117.44s, 2936 frames, 16.2 Mbps |
| Reference | SSD `ref/ref1080.mp4` | 1080×1920, 25fps, h264, 115.05s, 2876 frames, 2.57 Mbps |
| Reference (480p, superseded) | SSD `ref/ref.mp4` | 608×1080 av1 — **do not measure typography from this** |

Reference = "Introducing Groww Nifty Smallcap 250 Momentum Quality 100 ETF",
channel *Mutual Funds with Groww*, published 2026-06-02.

## The source is RAW

One unbroken locked-off take. **No cuts, no graphics, no captions, no grade.**
Scene detection finds zero cuts. This is not an edit to polish — it is an edit to build.

## There is no dead air to cut

- `silencedetect` finds **zero** silences ≥0.20s at any threshold from −40dB to −25dB.
- 358 timed words over 117.44s = **3.05 words/sec**, continuous delivery.
- 18 inter-word gaps ≥0.30s, totalling 10.03s — but these are breath gaps at speaking
  level, not silence. Cutting them all would read as rushed.
- **Two apparent "gaps" are ASR blindness, not silence** — verified by re-pass:
  - 66.48→68.94 (2.46s): actually speech — *"इसलिए इस fund ने भी double digit returns generate किये होंगे"*
  - 94.25→95.61 (1.36s): speech present
  Do **not** cut either. (This is the repo's standing WhisperX lesson.)

**Implication:** pacing cannot come from removing time. It must come from what goes
on top — graphics, punch-ins, and rhythm. Our graphics load is *higher* than the
reference's, because our shot never changes and theirs does.

## Frame occupancy (from 59-frame temporal median + per-pixel std)

| Band (y, 1080×1920) | motion | verdict |
|---|---|---|
| 0–480 | 1.6–6.0% | **dead still — permanent safe zone** |
| 480–600 | 14.7% | transition band, use with care |
| 600–1680 | 39–89% | her territory |
| 1680–1800 | 94% | hands/gestures — busiest band |
| 1800–1920 | 86% | desk edge |

Columns: x 990–1080 is quietest (15.4%); x 450–630 busiest (72–74%).

Luminance by band is stable across the whole take (locked camera, no drift):
top band mean ~20/255, face band (y 800–960) mean ~126, desk band ~119–128.

**Top 480px is dark, static, and empty → primary graphics real estate.**

## Existing brand furniture in-frame

The wall already carries:
- Large Groww circle mark (blue/green), roughly x 160–640, y 260–720
- White "groww" wordmark, roughly y 800–1040, spanning frame width
- A lime/neon vertical frame element, top-left, x 0–100, y 40–360

The reference adds a "Groww MUTUAL FUND" pill + SEBI reg line top-right because its
brick wall is bare. **Ours is not bare** — adding the same pill doubles the branding.
Cleanest slot for a compliance lock-up is **top-right**, which is dark and empty.

## Grade delta — MEASURED BUT OUT OF SCOPE

> **Creator directive: colour grading is excluded.** The footage tonality stays as
> shot. The numbers below are kept only as context for why graphics must carry their
> own contrast — do **not** apply a grade, and do not let any critic raise grading
> as a finding.


| metric | reference | source |
|---|---|---|
| black point (p1) | 0 | 13 (lifted) |
| midtone (p50) | 93 | 43 (dark) |
| white point (p99) | 251 | 230 |
| std | 49.0 | 60.2 |
| mean | 83.1 | 70.1 |

**Consequence of leaving this ungraded:** the plate sits dark and low-contrast, so
every graphic must supply its own contrast and luminance separation rather than
relying on the footage to lift. This actually suits the chosen dark design system —
graphics read as emissive against a genuinely dark ground.

Face-region Laplacian variance: reference **63.4**, source **174.3** — the reference
face is *softer*, i.e. deliberately retouched/skin-smoothed. Our footage is sharper
but flatter. Sharpness is not our problem; tonality is.

## Audio delta

| metric | reference | source |
|---|---|---|
| integrated loudness | −18.5 LUFS | **−12.8 LUFS** |
| true peak | −0.5 dBFS | **+0.2 dBFS (clipping)** |
| loudness range | 4.1 LU | 5.0 LU |
| noise floor (p1 of 20ms frames) | — | −53.7 dB |
| speech peaks (p95) | — | −10.3 dB |

**The source clips.** True peak is over 0 dBFS. This must be fixed before any mix.

## Content map (Hinglish VO, word-level timings in `audio16k.json`)

| span | content |
|---|---|
| 0.05–5.08 | HOOK: only 4 value funds gave double-digit returns last year. But why? |
| 5.44–21.55 | What value funds are: ≥80% equity, documented value strategy, undervalued sectors |
| 21.71–38.59 | **TABLE**: Nifty 500 Value 50 (50 cos by value score) beat Nifty 50 & Nifty 500 over 1yr & 5yr |
| 38.85–44.91 | Why many underdelivered: sector and stock selection |
| 45.01–54.96 | **DSP Value Fund**: heavy foreign holdings; US beat India last year |
| 55.06–66.48 | **LIC MF Value Fund**: >50% mid/small cap, which performed well |
| 68.94–94.25 | **Quant Value Fund**: VLRT framework, non-traditional approach; don't judge on 1 year |
| 95.61–102.92 | Managers differ: large vs mid/small vs international allocation |
| 103.04–108.61 | Not just returns — how much RISK was taken to get them |
| 108.67–117.38 | Evaluate risk-adjusted performance against your goals |

Note: the filename says "contra funds"; the content is **value funds**. Content wins.
Hook says *four* funds; only three are named (DSP, LIC MF, Quant) — **open question
for the creator**, flagged not resolved.

## Reference structure (verified by eye at full res)

Talking head on grey brick ↔ indigo banner blocks over a light graph-paper top ↔
full-frame animated data table (indigo header, alternating tints, mint highlight,
visible motion blur) ↔ stock b-roll cutaway (~40s) ↔ **dark 3D product card (~80s:
near-black gradient, glossy spheres, green light streaks)** ↔ legal endcard with
SEBI riskometer. Persistent chrome throughout.

The dark 3D card is our closest anchor — the creator chose to keep the dark wall,
so that card's aesthetic becomes our house look.
