# Reference measurement — NFO promo, "Nifty Smallcap 250 Momentum Quality 100 ETF"

**Source:** youtube.com/shorts/tHLbdnZwIo4 · *Mutual Funds with Groww* · uploaded 2026-06-02 · 115.0s · 1080×1920 · 25fps
**Measured:** 2026-08-19, from the 2.57 Mbps H.264 rendition (highest YouTube serves for this asset — there is no 4K/1440p master).
**Method:** 32 scene-aware frames + 23 gap-fill frames at native 1080×1920; colours by HSV-family clustering over full frames, not eyedropper guesses; geometry by edge-scan.

> **Read this first:** this is an **AMC-produced NFO promo**, the same category `style.md` already quarantines as
> *"V1 (Private Bank ETF) is an AMC-produced NFO promo — its extra devices live in the NFO promo module section
> and are used only for sponsor/NFO videos."* Every V1 marker is present here: NFO-period chip, green/white
> lower-third lockup, and the ~13s statutory legal endcard with riskometers and the Devanagari market-risk line.
> It is **not** the channel's own editorial format. Treat it as evidence for the NFO module, not as the house style,
> unless the creator explicitly promotes it.

---

## Measured tokens

| Element | Measured hex | Notes |
|---|---|---|
| Label-chip indigo | `#525DF3` | Converged across 3 independent frames (`#525DF3`/`#525DF4`/`#515FF4`/`#505EF3`). Brighter and more violet than style `$indigo #4A69FF` |
| Perf-table header indigo | `#4C55E0` | Slightly darker cut of the same family |
| Top-10 table row indigo | `#4651BA` | Duller again — this table is a third cut, not token-consistent |
| Diagonal wipe green | `#11EA99` | 94% of wipe-pixel mass; large flat area, so this is the reliable fill value |
| Bright green accent (small type) | `#15FFB6` | Endcard italic tagline, thumbnail headline — reads more saturated at small mass |
| Red highlight box | `#E55867` | Hand-drawn-style outline boxes on the top-10 table |
| Winner-column mint tint | `#CEE6D9` → `#D4ECDE` | Column-wide wash behind the outperforming series |
| Paper graphic ground | `#E9E9E9` | Modal low-sat value, top 40% of card frames. Fine textile/grid texture |
| Amber ₹ glyph decoration | `#E3C682` | Soft-blurred decorative rupee glyphs, frame corners |
| Endcard ground | `#000000` | Near-black with a dark 3D chrome-sphere render |
| Branding pill | `#FFFFFF` | Solid white |

## Geometry

- **Diagonal wipe: exactly 45.1°**, filling **lower-left**, sweeping bottom-left → top-right. Two independent frames agree to 0.1°. Corner branding renders **above** the wipe.
- **Graphic zone / footage split:** graphics occupy the upper band, presenter the lower. The boundary is a **soft feathered blend**, not a hard panel edge — measured at y≈244 (13%) and y≈372 (19%) on two card frames, i.e. the split moves per layout rather than sitting on a fixed line.
- **Branding pill:** bbox x 757–1044, y 59–214 (incl. the SEBI line beneath). Right margin ≈36px, top margin ≈59px.

## Device inventory

1. **Flat indigo label chips** — sharp-cornered rectangles, white bold sans, **no rounding, no drop shadow**. Used for headline labels and, connected by thin indigo rules, as a **tree/org-chart diagram** ("Momentum" → "Price trends" / "Market participation").
2. **Stacked two-line title chips** — offset left/right, ragged, over the paper zone.
3. **Amber ₹ glyph decorations** — soft blurred rupee symbols in the corners of the paper zone. Purely textural.
4. **Comparison table** — indigo header bar, white body, mint wash down the winning column, true-black bold title above.
5. **Ranked table** — grey header, solid indigo name cells (white text), white value cells, **red outline boxes** annotating the top 3 rows, dense legal footnote beneath.
6. **3D kinetic-type takeover** — chrome/metallic extruded lettering flying through a dark tunnel with indigo bands and green text.
7. **Legal endcard** — full-frame white, product label + dual riskometers, Devanagari statutory line, ~13s hold.
8. **Persistent chrome** — white pill (Groww logo + `MUTUAL FUND`) **top-right only**, `SEBI Registration No. MF/068//11/03` beneath it. Ink flips black-on-light / white-on-dark.
9. **B-roll grading** — heavily stylised LUTs: periwinkle/purple duotone, desaturated grey, bleach-bypass high-key, warm sepia. Never a natural grade.

## Typography

**One family throughout — a geometric grotesque with a double-storey `a`, tall x-height and straight-cut terminals.** Consistent with the workspace's existing `Inter Tight` cut; no substitution needed.

**There is no serif anywhere in this video.** Headlines, table titles, chips, legal copy and the endcard title are all the same sans. The only style variation is weight, case, and one **bold-italic** cut for the green tagline lockup.

## Conflicts with the currently-recorded system

Flagged, not resolved — per the CLAUDE.md rule that a conflict with a style convention is raised, never decided quietly.

| # | This video | Currently recorded | Where |
|---|---|---|---|
| 1 | No serif at all; single sans family | "Display serif: Ivy Presto — takeover titles and keyword pops; the channel's editorial voice" | `brand.md` §Fonts |
| 2 | Chips are flat rectangles, **no shadow** | "The golden rule: **every graphic element carries a drop shadow**… Nothing floats flat" | `brand.md` §Grounds & elevation |
| 3 | Sharp corners | "All data content lives in **rounded-rectangle cards** (radius 14–40px)" | `style.md` §Graphic anatomy |
| 4 | Indigo `#525DF3` | `$indigo #4A69FF` | `style.md` §Style tokens |
| 5 | Green `#11EA99` used as a **wipe sheet and accent** | `$accent #00D09C`, "identity-only… NEVER data ink" — wipe use is legal, the brighter value is the delta | `style.md` §Style tokens |
| 6 | Branding **top-right only** | "'Groww shorts' badge top-left **+** logo/wordmark top-right" | `style.md` §Frame chrome |
| 7 | Three different indigos across two tables | one `$indigo` token | `style.md` §Style tokens |
| 8 | No burned captions | already legal per-video (V1/V3 precedent) — **no conflict** | `style.md` §Captions |
| 9 | Paper ground `#E9E9E9` | `$paper #EDEDED` — within measured tolerance, **no conflict** | `style.md` §Style tokens |

Items 1–3 are the material ones: they are **creator golden rules** recorded from a supplied reference doc on 2026-08-11, and this video does not follow them. That is expected for an AMC-produced asset and is the strongest evidence that this is the sponsor format rather than the house format.
