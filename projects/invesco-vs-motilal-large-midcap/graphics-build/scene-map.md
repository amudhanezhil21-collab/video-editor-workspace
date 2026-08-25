# Scene map — invesco-vs-motilal-large-midcap

Frame-type assignment for every second of the base cut (`assets/reference-basecut.mp4`, **813.840 s, 25 fps = 20 346 frames**). Times below are **base-cut seconds**; the 3.0 s prepended disclaimer shifts everything +3.000 s on the delivery timeline. Machine copy: `scene-map.json` (same folder).

**Transition dialect (one per video, audit finding 11): Video-A dialect** — brand dual-panel wipe for structural moves · light-leak for card↔panel and creator↔MG · dissolve for same-layout swaps · whip/zoom for creator↔b-roll · in-place morphs for every 5→6 resolve and slot swap.

---

## OPEN QUESTIONS (creator must answer before build — nothing here was silently guessed)

1. **p56 / p59 year-section openers not given lavender cards.** "Ab 3-year performance dekhte hain" (631.8) and "Ab 5-year returns ki baat karein" (659.4) are in the inventory's opener list, but they fall mid-walk of the ONE returns table a26 (built p54→p62). A card cut would leave and re-enter the same graphic (violates §2.7 asset-continuity + the audit's alternation rule). Mapped instead as **in-table section-band morphs** (s73, s75) — the in-place device the references use for sub-sections. Confirm or order cards.
2. **Missing source lines (§1: missing attribution = critical error).** a07 + a08 (Motilal deck slides) and a27 + a28 (Value Research charts — watermark only, no printed caption) have `sourceLine: MISSING` in the inventory; a30 likewise. Creator must supply the exact source text — not invented here. Affected spans: s24–s28, s29, s79, s80, s90–s91.
3. **a30 (RA compliance block) placement.** Inventory says "parent to decide" whether it is a timeline asset; the hard rule says every inventory item lands in a type-2/5/6 span at its anchor line (p71). Mapped as a **type-2 compliance callout/strip across s90–s91** (p70–p71), synced to the spoken disclaimer; its legalese also naturally belongs to the APPEND closing-legal chain. Confirm the double placement or move it entirely to the legal chain.
4. **Shared source lines on twin screenshots.** §2.5 says two visuals on one frame = two source lines, but the PDF prints ONE "Source: Value Research" serving both cards on page 10 (a11+a12) and page 13 (a15+a16). Mapped as printed (one shared line) at s33 and s39–s40. Confirm one line may serve the mirrored pair, or duplicate it.
5. **BLOCKED-ON-CREATOR data conflicts (flagged by creator, not resolved here)** — spans mapped but must not be built until resolved:
   - **s14** (a02/a03): About boxes print expense 0.55 % / 0.60 % vs a29 + p65 dialogue 0.56 % / 0.90 %; a03 lists manager "Varun Sharma" vs the p14 five-name team; a02 Khemani.
   - **s16** (a04): ~~date conflict~~ **RESOLVED 2026-08-16: screen shows "1st November 2023"** (creator ruling). ⚠ residual: base-cut VO (~118–124 s) says "November 2013 se" — keep / re-record / patch is the creator's call.
   - **s83** (a29): the 0.56/0.90 side of the same expense conflict.

Build-time verification notes (not blocking): p08, p13, p48, p67 timings are gap-inferred and p05/p28/p41 widened in `basecut-anchors.json`; s35 has a 290.6–298.7 ASR word gap — verify highlight frames against base-cut audio (WhisperX lesson).

---

## Fixed slots (PREPEND / OVERLAY / APPEND)

| Slot | Base-cut t | Delivery t | Asset | Spec |
|---|---|---|---|---|
| PREPEND | before 0.000 | 0.000–3.000 | `assets/longform/disclaimer-start.png` | 3.000 s exactly, total silence, hard cut out as VO starts (§1) |
| OVERLAY | 55.083–57.113 | 58.083–60.113 | `assets/longform/groww-transition.mov` | Brand transition, 2.03 s alpha composite over the timeline (scale 2×, retime to 25 fps), triggered on the p04 marker **"Chaliye shuru karte hai!"** — only occurrence |
| APPEND | 813.840–823.840 | 816.840–826.840 | `assets/longform/endscreen.mp4` | **Exactly 10.0 s**, hard cut ~1.1 s after "bye!" (812.70) — audit norm |
| APPEND | 823.840–833.840 | 826.840–836.840 | `disclaimer-rolling.png` (static) | Closing legal page held 10.0 s (3/3 audit norm), white, never lavender |
| APPEND | 833.840–839.340 | 836.840–842.340 | `disclaimer-rolling.png` (crawl) | Bottom-to-top crawl 5.5 s to the final frame (audit norm 5–6 s) |

---

## Timeline (91 spans, contiguous 0.000 → 813.840)

T = frame type. Full per-span dissection sub-steps live in `scene-map.json`.

| # | t0–t1 | T | Script line (start) | Why (rule) | Assets | Transition in |
|---|---|---|---|---|---|---|
| s01 | 0.00–8.35 | 3 | "Kabhi socha hai ki do log same exam pass karke…" | R7 hook question → creator + built text + coins | — | hard cut from PREPEND disclaimer (VO onset) |
| s02 | 8.35–14.66 | 7 | "kuch saalon baad bilkul alag jagah…" | R11 metaphor, unfilmable diverging-paths → AI b-roll, box+grain | — | zoom-in + light leak |
| s03 | 14.66–29.44 | 5 | "Dono SEBI ke same mandate follow karte hain…" | R4 concept MG; §5 fig04 piggy-race recipe | — | zoom-out + light leak |
| s04 | 29.44–32.94 | 6 | "toh dono ki philosophy bilkul different nikalti hai" | R5 conclusion clause → serif title resolves in place | — | in-place resolve |
| s05 | 32.94–45.77 | 5 | "Aaj hum dekhenge Invesco… aur Motilal…" | §6 step 1 / A 31.28: fund circles pop as named; "Top 2" badge on the stat | — | light leak |
| s06 | 45.77–55.98 | 1 | "like kar dijiye, share kar dijiye…" + "Chaliye shuru karte hai!" | R3 CTA: **subscribe unit #1 rides** 47.43–52.43; **brand transition fires on marker 55.08** | — | zoom-out to creator |
| s07 | 55.98–58.85 | 4 | "Pehle kuch basic important notes:" | **Opener 1/25** → card "Important Points *for Comparison*" (fig08 title) | — | brand transition lands |
| s08 | 58.85–66.59 | 6 | "Invesco… aur Motilal…, dono hi Large & Mid Cap category ke funds hai" | §6 steps 1–3: icons pop → converge → title resolves (A 51.80) | — | straight cut from card |
| s09 | 66.59–78.42 | 5 | "Yaani SEBI mandate… kam se kam 35%…" | §1 table-on-line; 35 %/35 % chips isolate at speak-time | **a01** | in-place morph (icons→table) |
| s10 | 78.42–80.25 | 4 | "Dono funds ka benchmark same hai:" | **Opener 2/25** → card "Benchmark", 1.8 s | — | light leak |
| s11 | 80.25–84.25 | 2 | "NIFTY LargeMidcap 250 TRI…" | R1 compact spec → side panel (A 60.60 Benchmark) | — | light leak |
| s12 | 84.25–91.80 | 2 | "January 01, 2013… October 17, 2019 ko launch hua" | A 70.20 slot-swap → Launch Date callout boxes ×2 | — | in-place slot swap |
| s13 | 91.80–94.34 | 4 | "Ab baat karte hai AUM ki." | **Opener 3/25** → card "AUM" (A 77.35 exact) | — | light leak |
| s14 | 94.34–107.41 | 2 | "ka AUM hai ₹11,164 Crore… ₹18,413 Crore, as of July 2026" | §1 assets; §2 prose-box figures pulled out; ⚠ BLOCKED | **a02, a03** | whip-cut |
| s15 | 107.41–111.39 | 4 | "Toh, kaun hai in dono funds ke fund managers?" | **Opener 4/25** → card "Fund Managers" (A 91.30 exact) | — | light leak |
| s16 | 111.39–124.82 | 2 | "Fund Manager Mr. Aditya Khemani hain…" | R9 person journey: nodes per spoken fact + a04 panel; RESOLVED: screen=1 Nov 2023; ⚠ VO says 2013 | **a04** | whip-cut |
| s17 | 124.82–138.10 | 5 | "AND / …team-managed fund hai, jise Mr. Atul Mehra…" | §2 photo-grid: 5 cards pop in screenshot order, highlight per spoken name | **a05** | in-place reset |
| s18 | 138.10–140.94 | 4 | "Ab dekhte hai… investment philosophy…" | **Opener 5/25** → card "Investment Philosophy" (A 302.20) | — | brand wipe |
| s19 | 140.94–153.96 | 5 | "portfolio 4 key themes… Financials 29.2 %… 1.0 % underweight" | §1 deck slide; §2 column-by-column reveal (col 1/4) | **a06** | straight cut, builds |
| s20 | 153.96–165.25 | 5 | "Healthcare… 19.1 %, jo benchmark se 11.9 % overweight" | a06 col 2/4, in-place | **a06** | in-place build |
| s21 | 165.25–174.12 | 5 | "Consumer Discretionary mein 17.3 %… 3.2 % overweight" | a06 col 3/4 | **a06** | in-place build |
| s22 | 174.12–181.18 | 5 | "Aur Real Estate mein 7.7 %… 6.1 % overweight" | a06 col 4/4 — **anchor line p19** ✓ | **a06** | in-place build |
| s23 | 181.18–184.77 | 1 | "Motilal Oswal… ek *alag* philosophy follow karta hai" | R5 pivot to face; alternation beat between decks | — | whip-cut |
| s24 | 184.77–189.75 | 5 | "QGLP framework, yaani Quality, Growth, Longevity, aur Price" | §1 deck slide; R10 letters pop per named item; ⚠ source MISSING | **a07** | light leak |
| s25 | 189.75–197.40 | 5 | "Q ka matlab hai Quality… ROCE ya ROE…" | a07 Q-box reveal | **a07** | in-place build |
| s26 | 197.40–207.66 | 5 | "G aur L ka matlab hai Growth aur Longevity…" | a07 wide G+L box | **a07** | in-place build |
| s27 | 207.66–218.73 | 5 | "P ka matlab hai Price — PE aur PEG… DCF…" | a07 P-box; tokens pop per term | **a07** | in-place build |
| s28 | 218.73–233.31 | 5 | "65 % house theme… 25 % flexibility… 10 % risk mitigation" | a07 bottom row — **anchor line p24** ✓ ("Flexibity" as printed) | **a07** | in-place build |
| s29 | 233.31–245.33 | 5 | "growth-oriented themes mein China+1, Make in India…" | §1 slide; R10: 7 columns pop as named; ⚠ source MISSING | **a08** | dissolve (slide→slide) |
| s30 | 245.33–248.81 | 4 | "Ab hum in donom funds ke portfolio ke baare mein…" | **Opener 6/25** → card "Portfolio" | — | brand wipe |
| s31 | 248.81–260.15 | 2 | "40 stocks… Top 5 33.55 %, top 10 53.42 %" | §1 asset; R1 compact spec → type 2 (A 155.00); Direct-Growth label from a11 | **a09** | whip-cut |
| s32 | 260.15–274.68 | 2 | "zyada concentrated… sirf 29 stocks…" | R2 mirrored identical layout, swapped in place; label from a12 | **a10** | in-place slot swap |
| s33 | 274.68–285.57 | 5 | "top 3 sectors… 59.73 %, jabki… 59.65 %" | R2 mirrored full-screen pair — **anchor line p29 for a11+a12** ✓; gold "lagbhag same" chips | **a11, a12** | dissolve |
| s34 | 285.57–288.03 | 4 | "Ab baat karte hai market cap allocation ki." | **Opener 7/25** → card "Market Cap Allocation" | — | light leak |
| s35 | 288.03–302.30 | 5 | "Large-cap 37.43 %, Mid-cap 38.33 %, aur Small-cap 24.24 %" | §1 asset; blocks isolate+enlarge in VO order | **a13** | straight cut, builds |
| s36 | 302.30–313.09 | 5 | "Category average… 52.75 %… small-cap mein zyada" | a13 act 2: category chips (§2.3 comparison kept) | **a13** | in-place build |
| s37 | 313.09–331.92 | 5 | "Large-cap 39.57 %, Mid-cap 31.79 %, aur Small-cap 28.64 %" | R2 mirrored in-place swap; small-cap co-highlight verdict | **a14** | in-place slot swap |
| s38 | 331.92–334.40 | 4 | "Average market cap ki baat karein toh," | **Opener 8/25** → card cut to the opener phrase; data lands next span | — | light leak |
| s39 | 334.40–345.53 | 5 | "₹97,433 Crore… ₹77,294 Crore. Category ₹1,57,535…" | **anchor p32 for a15+a16** ✓; twins, Avg-Mkt-Cap blocks isolated | **a15, a16** | straight cut, builds |
| s40 | 345.53–355.69 | 6 | "yaani dono hi funds… chhoti companies mein zyada invest" | R5 resolve: "*Smaller* Companies Than Category" lands on clause, holds breath | **a15, a16** | in-place resolve |
| s41 | 355.69–357.68 | 4 | "Valuation ki baat karein toh," | **Opener 9/25** → card "Valuation" | — | light leak |
| s42 | 357.68–376.39 | 5 | "Portfolio P/E… 48.34 vs 46.23… P/B 5.26 vs 7.06" | §1 bordered table: every column printed; rows highlight in VO order | **a17** | straight cut, builds |
| s43 | 376.39–387.73 | 5 | "Benchmark ke comparison mein… 24.60 / 3.71" | a17 act 2: benchmark column sweep (§2.8) | **a17** | in-place build |
| s44 | 387.73–392.21 | 1 | "Yeh difference sector allocation aur stock selection…" | R13 interpretation → creator | — | whip-cut |
| s45 | 392.21–394.00 | 4 | "Portfolio turnover ki baat karein toh," | **Opener 10/25** → card "Portfolio Turnover" | — | light leak |
| s46 | 394.00–413.98 | 2 | "61.82 %… 42.35 %, March 31, 2025 tak…" | §1 asset; R1 compact 2-row spec → type 2 (A 181.72); 4 highlight steps earn 20 s | **a18** | whip-cut |
| s47 | 413.98–419.48 | 1 | "Sirf portfolio composition dekhkar… kaafi nahi hota" | R5 pivot → crash-zoom to face (A 466.35 parallel) | — | crash-zoom |
| s48 | 419.48–425.00 | 4 | "ab risk aur risk-adjusted returns… Pehla metric Standard Deviation" | **Openers 11+12/25** → morph card "Risk & Risk-Adjusted Returns" → "Standard Deviation" (A 483.95 device) | — | brand wipe |
| s49 | 425.00–430.25 | 1 | "jo yeh batata hai ki fund ke returns kitna fluctuate…" | R8 unsourced definition → creator + serif label + coins | — | whip-cut |
| s50 | 430.25–443.63 | 5 | "Standard Deviation hai 18.36… 16.24… 21.33" | §1 asset; cells light at speak-time; red = worse | **a19** | light leak |
| s51 | 443.63–446.33 | 4 | "Ab baat karte hai Beta ki." | **Opener 13/25** → card "Beta" | — | dissolve |
| s52 | 446.33–453.88 | 1 | "Beta measure karta hai… 1 se zyada matlab…" | R8 unsourced definition → creator | — | whip-cut |
| s53 | 453.88–465.53 | 5 | "Beta hai 1.08… 1.17. Category average hai 0.97" | §1 asset; red tint both on verdict | **a20** | light leak |
| s54 | 465.53–467.50 | 4 | "Alpha ki baat karein toh," | **Opener 14/25** → card "Alpha" | — | dissolve |
| s55 | 467.50–482.77 | 5 | "Alpha hai 8.11… sirf 0.62… 6.36" | §1 asset at **anchor p41** ✓; green sweep on excess-return verdict | **a21** | straight cut, builds |
| s56 | 482.77–485.35 | 4 | "Ab baat karte hai Sharpe Ratio ki," | **Opener 15/25** → card "Sharpe Ratio" (A 518.65) | — | dissolve |
| s57 | 485.35–490.40 | 1 | "jo har extra unit of risk ke liye…" | R8 unsourced definition → creator | — | whip-cut |
| s58 | 490.40–507.35 | 5 | "Sharpe Ratio hai 0.94… 0.77… 0.59" | §1 asset; green verdict; holds/exits through breath | **a22** | light leak |
| s59 | 507.35–510.10 | 4 | "Ab chaliye dekhte hai Upside aur Downside Capture Ratio ko" | **Openers 16+17/25** → morph card "Upside & Downside Capture Ratio" → "Upside Capture Ratio" | — | brand wipe |
| s60 | 510.10–517.80 | 1 | "…fund apne benchmark ke comparison mein kaisa perform…" | R8 unsourced definition → creator | — | whip-cut |
| s61 | 517.80–530.83 | 5 | "Upside Capture… 132… 133. Category 101" | §1 asset; green both | **a23** | light leak |
| s62 | 530.83–533.40 | 4 | "Downside Capture Ratio batata hai…" | **Opener 18/25** → card morph "Downside Capture Ratio", 2.6 s | — | dissolve |
| s63 | 533.40–540.89 | 1 | "…100 se kam matlab fund benchmark se kam gira…" | R8 unsourced definition → creator | — | whip-cut |
| s64 | 540.89–554.15 | 5 | "Downside Capture… 104… 116. Category 99" | §1 asset; Motilal red | **a24** | light leak |
| s65 | 554.15–556.99 | 4 | "Ab baat karte hai Maximum Drawdown ki," | **Opener 19/25** → card "Maximum Drawdown" | — | dissolve |
| s66 | 556.99–562.43 | 1 | "jo yeh dikhata hai ki fund apne peak se kitna neeche gira…" | R8 unsourced definition → creator | — | whip-cut |
| s67 | 562.43–573.57 | 5 | "-17.08 %, jo October 2024 se February 2025… 5 months" | §1 asset a25 (built p50→p52), Invesco column | **a25** | light leak |
| s68 | 573.57–589.12 | 5 | "-24.12 %… Jan–Feb 2025… Benchmark -18.15 %" | a25 Motilal + benchmark columns ("Benchmark Index Average" as printed) | **a25** | in-place build |
| s69 | 589.12–597.78 | 5 | "Yaani Motilal… kaafi zyada gehra… Invesco kaafi kareeb" | a25 verdict act — **anchor line p52** ✓ | **a25** | in-place build |
| s70 | 597.78–601.93 | 4 | "Ab baat karte hai returns ki…" | **Opener 20/25** → card "Returns" (A 432.05) | — | brand wipe |
| s71 | 601.93–615.06 | 5 | "1 saal mein 13.45 %… sirf 4.56 %… 8.27 %… 3rd rank" | §1 a26 build (one table, p54→p62); 1Y Invesco cells | **a26** | straight cut, builds |
| s72 | 615.06–631.81 | 5 | "8.43 %… 18th rank… clear outperformance" | a26 1Y Motilal column, mirrored in place | **a26** | in-place build |
| s73 | 631.81–645.10 | 5 | "Ab 3-year… 25.73 % CAGR… 12.30 %… 1st rank" | a26 "3-Year" band morph (opener 21 → in-table morph, OPEN Q1) + Invesco cells | **a26** | in-place morph |
| s74 | 645.10–659.37 | 5 | "Motilal Oswal ne 23.17 % CAGR… rank 2nd" | a26 3Y Motilal column | **a26** | in-place build |
| s75 | 659.37–673.13 | 5 | "Ab 5-year… 18.71 % CAGR… rank 2nd" | a26 "5-Year" band morph (opener 22 → in-table morph, OPEN Q1) + Invesco cells | **a26** | in-place morph |
| s76 | 673.13–686.68 | 5 | "18.88 % CAGR… marginally zyada… 1st rank" | a26 5Y Motilal + 18.88↔18.71 micro-compare | **a26** | in-place build |
| s77 | 686.68–693.72 | 6 | "har time period mein… comfortably outperform kiya hai" | R5 resolve on full table — **anchor line p62 for a26** ✓ | **a26** | in-place resolve |
| s78 | 693.72–697.50 | 4 | "Ab return consistency check… discrete returns…" | **Opener 23/25** → card "Return Consistency" | — | brand wipe |
| s79 | 697.50–706.30 | 5 | "2020 se lekar… Invesco ne 6 mein se 2 saalon mein…" | §1 chart at **anchor p63** ✓; §2.4 curve-for-curve; "2/6" chip; ⚠ source MISSING | **a28** | straight cut, chart draws |
| s80 | 706.30–712.71 | 5 | "jabki Motilal Oswal ne… 6 mein se 3 saalon mein…" | in-place swap, same layout; "3/6" chip; ⚠ source MISSING | **a27** | in-place slot swap |
| s81 | 712.71–714.49 | 4 | "Ab baat karte hai expense ratio ki," | **Opener 24/25** → card "Expense Ratio" (A 692.80) | — | brand wipe |
| s82 | 714.49–719.35 | 1 | "yaani fund ko manage karne ke liye har saal li jaane wali fee" | R8 unsourced definition → creator | — | whip-cut |
| s83 | 719.35–733.04 | 5 | "expense ratio 0.56 %… 0.90 %… deduct hote hain" | §1 twin expense panels (A 696.40) at **anchor p66** ✓; ⚠ BLOCKED (0.55/0.60 conflict) | **a29** | light leak |
| s84 | 733.04–740.25 | 1 | "Isliye, agar do funds ki performance lagbhag similar ho…" | R13 rationale → creator | — | whip-cut |
| s85 | 740.25–745.56 | 8 | "especially long-term… compounding ki wajah se…" | R11 filmable growth metaphor → real b-roll (B 620.1 watering-can); the data-half's single breather | — | zoom-in + light leak |
| s86 | 745.56–747.50 | 4 | "Conclusion" | **Opener 25/25** → card flash (C 706.68 precedent) | — | zoom-out onto card |
| s87 | 747.50–765.18 | 1 | "Toh yeh raha in dono funds ka comparison…" | R12 final verdict → creator; serif keywords land as named; trust hold 1/2 | — | whip-cut |
| s88 | 765.18–780.33 | 1 | "Performance ke perspective se dekhein…" | R13 interpretation → creator; trust hold 2/2 | — | jump-cut reframe (C device) |
| s89 | 780.33–797.98 | 3 | "Isliye kisi bhi equity fund ko evaluate karte waqt…" | R10 criteria checklist, one item per named criterion (C 232.32) | — | no-cut overlay build |
| s90 | 797.98–805.65 | 2 | "Yaad rahe, yeh video sirf educational purpose…" | Hard rule: a30 lands type-2; compliance callout sweeps with spoken disclaimer (C 125.28 device); OPEN Q3 | **a30** | no-cut overlay |
| s91 | 805.65–813.84 | 2 | "like karein, share karein… Until then, bye!" | R3 CTA: **subscribe unit #2 rides** 807.33–812.33; a30 strip persists — **anchor line p71** ✓ | **a30** | continuous take |

---

## Coverage proof

### 1. Inventory → span (30/30 placed; every asset in a type-2/5/6 span containing its anchor line)

| Asset | Anchor | Span(s) | Type | Asset | Anchor | Span(s) | Type |
|---|---|---|---|---|---|---|---|
| a01 | p06 | s09 | 5 | a16 | p32 | s39–s40 | 5/6 |
| a02 | p10 | s14 ⚠ | 2 | a17 | p33 | s42–s43 | 5 |
| a03 | p10 | s14 ⚠ | 2 | a18 | p34 | s46 | 2 |
| a04 | p12 | s16 ⚠ | 2 | a19 | p38 | s50 | 5 |
| a05 | p14 | s17 | 5 | a20 | p40 | s53 | 5 |
| a06 | p19 | s19–s22 (anchor in s22) | 5 | a21 | p41 | s55 | 5 |
| a07 | p24 | s24–s28 (anchor in s28) | 5 | a22 | p43 | s58 | 5 |
| a08 | p25 | s29 | 5 | a23 | p46 | s61 | 5 |
| a09 | p27 | s31 | 2 | a24 | p48 | s64 | 5 |
| a10 | p28 | s32 | 2 | a25 | p52 | s67–s69 (anchor in s69) | 5 |
| a11 | p29 | s33 (label also s31) | 5 | a26 | p62 | s71–s77 (anchor in s77) | 5/6 |
| a12 | p29 | s33 (label also s32) | 5 | a27 | p63 | s80 | 5 |
| a13 | p30 | s35–s36 | 5 | a28 | p63 | s79 | 5 |
| a14 | p31 | s37 | 5 | a29 | p66 | s83 ⚠ | 5 |
| a15 | p32 | s39–s40 | 5/6 | a30 | p71 | s90–s91 (anchor in s91) | 2 |

⚠ = BLOCKED-ON-CREATOR data conflict (see Open Questions 5).

### 2. Sub-topic openers → type-4 card (25/25 accounted; 23 carded, 2 as in-table morphs pending Open Q1)

| Opener | Card span (title) | Opener | Card span (title) |
|---|---|---|---|
| p05 | s07 "Important Points for Comparison" | p42 | s56 "Sharpe Ratio" |
| p07 | s10 "Benchmark" | p44 | s59 "Upside & Downside Capture Ratio" |
| p10 | s13 "AUM" | p45 | s59 morph → "Upside Capture Ratio" |
| p11 | s15 "Fund Managers" | p47 | s62 morph → "Downside Capture Ratio" |
| p15 | s18 "Investment Philosophy" | p49 | s65 "Maximum Drawdown" |
| p26 | s30 "Portfolio" | p53 | s70 "Returns" |
| p30 | s34 "Market Cap Allocation" | p56 | s73 **in-table band morph** (OPEN Q1) |
| p32 | s38 "Average Market Cap" | p59 | s75 **in-table band morph** (OPEN Q1) |
| p33 | s41 "Valuation" | p63 | s78 "Return Consistency" |
| p34 | s45 "Portfolio Turnover" | p64 | s81 "Expense Ratio" |
| p35+p36 | s48 "Risk & Risk-Adjusted Returns" | p67 | s86 "Conclusion" |
| p37 | s48 morph → "Standard Deviation" | | |
| p39 | s51 "Beta" | p41 | s54 "Alpha" |

### 3. Structural cues

- **Instruction→main marker** p04 "Chaliye shuru karte hai!" (55.083) → supplied brand transition, 2.03 s alpha composite over the s06→s07 boundary (OVERLAY row). Only occurrence.
- **Subscribe cues**: p03 → unit #1 riding s06 (47.43–52.43, 5.0 s); p71 → unit #2 riding s91 (807.33–812.33, 5.0 s). Both cursor-click SUBSCRIBE then bell.
- **No gaps**: 91 spans, each t0 = previous t1, 0.000 → 813.840 (validated programmatically in `scene-map.json` generation).
- **No bare-creator span**: every type-1 span carries serif text / inline label + coins (style §11 minimum dress).

### 4. Pacing vs reference audit

| Type | Spans | Seconds | % | Pooled ref % |
|---|---|---|---|---|
| 1 creator+text | 14 | 107.1 | 13.2 | 36.4 |
| 2 creator+MG | 9 | 99.8 | 12.3 | 13.7 |
| 3 creator+text+illus | 2 | 26.0 | 3.2 | 2.1 |
| 4 text card | 21 | 58.8 | 7.2 | 5.3 |
| 5 full-screen MG | 39 | 482.0 | 59.2 | 26.5 |
| 6 MG+resolve | 4 | 28.5 | 3.5 | 3.3 |
| 7 AI b-roll | 1 | 6.3 | 0.8 | 6.2 |
| 8 real b-roll | 1 | 5.3 | 0.7 | 6.7 |

Mean span 8.9 s (ref pooled 7.0 s; medians in family). Type 5 runs hot and b-roll sparse **by design**: this script is a wall-to-wall two-fund data walk — the exact profile of reference A's back half, which runs zero b-roll and all data frames (audit: "A's data-comparison back half is exclusively types 1/2/4/5/6"). Every hold > 20 s is a progressive build synced to VO (§2.8 dissection steps listed per span in the JSON); no static visual exceeds ~10 s. Cards are cut to their spoken phrases (1.8–5.5 s; the two 5.5 s cards are attested double-title morphs). B-roll punctuates the only two concept stretches (intro metaphor, compounding metaphor) at 3–8 s each.
