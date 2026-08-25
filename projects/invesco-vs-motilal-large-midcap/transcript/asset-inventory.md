# Asset inventory — §2 completeness checklist

**This is the §2 completeness checklist — the finished edit is checked against it item by item.**

Source: `assets/Invesco India Large & Mid Cap Fund vs Motilal Oswal Large and Midcap Fund.pdf` (25 pages, merged from five page-range inventories, 2026-08-16). Anchors reference paragraph ids in `transcript/script.json`. Convention: the anchor is the paragraph whose spoken text the asset accompanies (matched via the dialogue immediately before the asset in the PDF). Machine-readable twin: `transcript/asset-inventory.json`.

**30 assets.** Duplicated cards (a09/a11, a10/a12, a13/a15, a14/a16) need only ONE on-screen instance per fund, but must carry the "Direct Growth" qualifier from the labeled duplicate.

---

## a01 — Definition / Asset allocation table (page 1) — anchor p06

- [ ] 2-row, 2-column bordered table (grey label column left, description right):
  - Definition | An open ended equity mutual fund investing in both large cap and mid cap stocks of the Indian market
  - Asset allocation | Minimum investment in equity & equity related instruments of large cap stocks – 35% of total assets and mid cap stocks – 35% of total assets
- Source line: **Source: Groww** · No star markers · No as-of date
- On screen at: p06 ("Yaani SEBI mandate ke anusar dono ko apne portfolio ka kam se kam 35% hissa large-cap stocks mein...")

## a02 — About Invesco India Large & Mid Cap Fund - Direct Plan (page 3, prose-box) — anchor p10

- [ ] Bold-bordered cream/beige box, bold heading "About Invesco India Large & Mid Cap Fund - Direct Plan". Body verbatim: "Invesco India Large & Mid Cap Fund - Direct Plan is a equity mutual fund scheme of Invesco Mutual Fund. Launched on January 01, 2013, it is currently managed by Aditya Khemani. The fund has an expense ratio of 0.55% with an overall AUM (Assets Under Management) of ₹11,164 Cr."
- Source line: **Source: Value Research** (single line below BOTH About boxes, covers both) · No star markers · No as-of date
- On screen at: p10 (AUM discussion, "₹11,164 Crore... as of July 2026")
- ⚠ Box says expense ratio **0.55%**; the page-24 table and p65 dialogue say **0.56%** — see discrepancies.

## a03 — About Motilal Oswal Large and Midcap Fund - Direct Plan (page 3, prose-box) — anchor p10

- [ ] Second bold-bordered cream/beige box directly below the Invesco box, bold heading "About Motilal Oswal Large and Midcap Fund - Direct Plan". Body verbatim: "Motilal Oswal Large and Midcap Fund - Direct Plan is a equity mutual fund scheme of Motilal Oswal Mutual Fund. Launched on October 17, 2019, it is currently managed by Varun Sharma, Ajay Khandelwal, Ankit Agarwal and Rakesh Shetty. The fund has an expense ratio of 0.60% with an overall AUM (Assets Under Management) of ₹18,413 Cr."
- Source line: **Source: Value Research** (shared, see a02) · No star markers · No as-of date
- On screen at: p10 (AUM discussion, "₹18,413 Crore, as of July 2026")
- ⚠ Manager list ("Varun Sharma, ...") conflicts with p14 dialogue and the page-5 cards; box says expense **0.60%** vs table/dialogue **0.90%** — see discrepancies.

## a04 — Aditya Khemani bio screenshot (page 4, bordered-screenshot) — anchor p12

- [ ] Thin-bordered white screenshot box, single paragraph of small text, verbatim: "Aditya has over 20 years' of experience in the equities market and currently works with Invesco as Fund Manager - Equity with effect from 1st November 2023. In his last assignment before joining Invesco, Aditya was working with Motilal Oswal Asset Management India Company Ltd. as Fund Manager where he was responsible for managing Equity Funds at the firm. In the past, he has also worked with companies like HSBC Asset Management (India) Pvt. Ltd., SBI Funds Management Ltd., and Morgan Stanley Advantage Services. Aditya holds a Bachelor's in Commerce from St. Xavier's College, Kolkata University and a PGDM degree from Indian Institute of Management, Lucknow."
- Source line: **Source: Invesco India** · No star markers · No as-of date
- On screen at: p12 (Khemani intro)
- ⚠ Screenshot says "with effect from 1st November **2023**"; p12 dialogue says "November **2013** se judey hai" — see discrepancies.

## a05 — Motilal fund-manager photo grid (page 5, photo-grid) — anchor p14

- [ ] Bordered screenshot of 5 stacked fund-manager cards (Motilal Oswal site UI): circular headshot with yellow arc, name in blue bold, role, underlined link. Top to bottom, verbatim:
  1. Ajay Khandelwal | Head Equity | View other funds managed by him
  2. Rakesh Shetty | Head Debt | View other funds managed by him
  3. Atul Mehra | Fund Manager | View other funds managed by him
  4. Swapnil Mayekar | Fund Manager | View other funds managed by him
  5. Mr. Ankit Agarwal | Fund Manager | View other funds managed by him
  (Only the last card carries the "Mr." prefix in the source screenshot.)
- Source line: **Source: Motilal Oswal Mutual Fund** · No star markers · No as-of date
- On screen at: p14 (team-managed fund, five names)

## a06 — Invesco "Key investment themes" slide (page 6, colour-deck-slide) — anchor p19 (spans p16–p19)

- [ ] Slide title (blue): "Key investment themes". Four columns, each with a dark-blue circular icon. Black border, white background, light-grey column panels.
  - **Consumer Discretionary** | 17.3% Portfolio allocation (blue) | 3.2% Overweight (green) | bullets: "Retail/Fashion- Trent, Eternal, Swiggy, Ethos, Safari Industries," ; "E-commerce- FSN E-commerce Ventures" ; "Consumer durables- Amber Enterprises" ; "Beneficiaries of long-term demand potential"
  - **Healthcare** | 19.1% Portfolio allocation | 11.9% Overweight (green) | bullets: "E.g.- Max Healthcare Institute, Glenmark Pharmaceuticals, Global Health, Krishna Institute, Sai life sciences etc." ; "The sector offers long runway of growth and a proxy play on India's consumption at a relatively better valuation"
  - **Real Estate** | 7.7% Portfolio allocation | 6.1% Overweight (green) | bullets: "Residential and Commercial property-developers- Prestige Estates Projects, Phoenix Mills, Sobha, Max Estates" ; "Beneficiaries of sustained demand and new launches"
  - **Financials** | 29.2% Portfolio allocation | -1.0% Underweight (red) | bullets: "Private Banks and NBFC- ICICI Bank, Federal Bank, AU Small Finance Bank, Chola Investment, L&T Finance" ; "Financial services- BSE, HDFC Asset Management, Go Digit General Insurance, Max Financial Services" ; "Play on India's growth outlook at a relatively reasonable valuation"
- Source line: **Source: Invesco India (data as of April 30, 2026)** · No star markers · As-of: **April 30, 2026**
- On screen across p16–p19 (Financials p16, Healthcare p17, Consumer Discretionary p18, Real Estate p19); slide sits after p19 in the PDF.

## a07 — Motilal QGLP slide "High Quality & High Growth Focused House" (page 7, colour-deck-slide) — anchor p24 (spans p20–p24)

- [ ] Black-bordered Motilal Oswal slide. Header (dark blue, yellow paddle/oar icon left): "High Quality & High Growth Focused House"; motilal oswal Mutual Fund logo top-right. Four giant dark-blue letters Q G L P with yellow-dotted connectors to grey rounded boxes:
  - Q: "Minimum threshold set to ROCE/ROE"
  - G+L (one wide box): "Ensuring Longevity of Growth by investing in sustainable themes identified by the Investment team collectively"
  - P: "Application of PE, PEG framework and Expanding the framework through rolling out DCF, implied returns and implied growth"
  - Bottom row (curly-bracket connectors, three grey boxes, large dark-blue percentages): "House theme representation in portfolio. Stock picking — 65%" ; "Flexibity to invest outside house themes — 25%" (sic — slide genuinely prints "Flexibity", verified at 200dpi) ; "Provision for risk mitigation — 10%"
- Source line: **MISSING** (no printed attribution) · No star markers · No as-of date
- On screen across p20–p24; slide sits after p24 in the PDF.

## a08 — Motilal "Growth Oriented Themes" slide (page 8, colour-deck-slide) — anchor p25

- [ ] Black-bordered Motilal Oswal slide. Header (dark blue, yellow paddle icon): "Growth Oriented Themes which could be Potential Leaders of the Cycle"; logo top-right. Seven columns (circular grey icon, dark-blue pill header, yellow arrow, stacked light-grey sub-theme boxes):
  1. **China +1**: Chemicals | Electronic Manufacturing Services
  2. **Make in India**: Auto + EV | Capital Goods & Engineering | Infrastructure Ancillaries | Renewable Power
  3. **Financialisation**: High AUM Growth Retail Focused Lenders | Capital Market Companies | Health & Life Insurance
  4. **Tech & Tech Services**: New Age Consumer Tech | High Growth Tech Companies
  5. **Urbanisation**: Leisure & Luxury | Travel & Hospitality | Premiumisation
  6. **Healthcare Ecosystem**: Hospitals | Diagnostics | Pharma
  7. **Telecom**: Equipment and Infra | Services
- Source line: **MISSING** · No star markers · No as-of date
- On screen at: p25 (themes list)

## a09 — Invesco Concentration card, inline instance (page 8, bordered-screenshot) — anchor p27

- [ ] Value Research style card, cream/off-white, black border, serif heading "Concentration". Rows: No. of Stocks — **40** | Top 10 Stocks (i) — **53.42%** | Top 5 Stocks (i) — **33.55%** | Top 3 Sectors (i) — **59.73%**. Grey (i) icons on the Top 10/5/3 labels.
- Source line: **Source: Value Research** · No star markers · No as-of date
- On screen at: p27. Duplicate of a11 — one on-screen instance per fund; carry "Direct Growth" from a11's label.

## a10 — Motilal Concentration card, inline instance (page 9, bordered-screenshot) — anchor p28

- [ ] Same card style. Rows: No. of Stocks — **29** | Top 10 Stocks (i) — **43.76%** | Top 5 Stocks (i) — **23.36%** | Top 3 Sectors (i) — **59.65%**.
- Source line: **Source: Value Research** · No star markers · No as-of date
- On screen at: p28. Duplicate of a12.

## a11 — Invesco Concentration card, labeled duplicate (pages 9–10, bordered-screenshot) — anchor p29

- [ ] Repeat of a09, identical values (40 / 53.42% / 33.55% / 59.73%), rendered slightly narrower. Bold label "**Invesco India Large & Mid Cap Fund Direct Growth**" at bottom of page 9; card at top of page 10 (label/asset pair crosses the page boundary).
- Source line: **MISSING on this card** (page 10's single "Source: Value Research" is printed below a12 and appears to serve both) · No star markers · No as-of date

## a12 — Motilal Concentration card, labeled duplicate (page 10, bordered-screenshot) — anchor p29

- [ ] Repeat of a10, identical values (29 / 43.76% / 23.36% / 59.65%). Bold label "**Motilal Oswal Large and Midcap Fund Direct Growth**".
- Source line: **Source: Value Research** (printed below this card; serves both Direct Growth cards) · No star markers · No as-of date

## a13 — Invesco Portfolio Aggregates card, inline instance (page 11, bordered-screenshot) — anchor p30

- [ ] Cream/beige card, thin black border. Four stat blocks, bold word + grey (i) icon each. Row 1: **Large** (i) **37.43%**, Category: 52.75% | **Mid** (i) **38.33%**, Category: 37.30% | **Small** (i) **24.24%**, Category: 11.65%. Row 2: **Avg Mkt Cap** (i) **₹97,433 Cr**, Category: ₹ 1,57,535 Cr.
- Source line: **Source: Value Research** · No star markers · No as-of date
- On screen at: p30 (market cap allocation). Duplicate of a15 — carry "Direct Growth" from a15's label.

## a14 — Motilal Portfolio Aggregates card, inline instance (page 12, bordered-screenshot) — anchor p31

- [ ] Same card style. Row 1: **Large** (i) **39.57%**, Category: 52.75% | **Mid** (i) **31.79%**, Category: 37.30% | **Small** (i) **28.64%**, Category: 11.65%. Row 2: **Avg Mkt Cap** (i) **₹77,294 Cr**, Category: ₹ 1,57,535 Cr.
- Source line: **Source: Value Research** · No star markers · No as-of date
- On screen at: p31. Duplicate of a16.

## a15 — Invesco Portfolio Aggregates card, labeled duplicate (page 13, bordered-screenshot) — anchor p32

- [ ] Identical data to a13 (37.43% / 38.33% / 24.24% / ₹97,433 Cr). Bold label "**Invesco India Large & Mid Cap Fund Direct Growth**" above the card. Page 13 has no spoken dialogue.
- Source line: **Source: Value Research** (printed once at the bottom of page 13, below a16; appears to cover both) · No star markers · No as-of date

## a16 — Motilal Portfolio Aggregates card, labeled duplicate (page 13, bordered-screenshot) — anchor p32

- [ ] Identical data to a14 (39.57% / 31.79% / 28.64% / ₹77,294 Cr). Bold label "**Motilal Oswal Large and Midcap Fund Direct Growth**" above the card.
- Source line: **Source: Value Research** (see a15) · No star markers · No as-of date

## a17 — Valuation table (page 14, table) — anchor p33

- [ ] 4-column bordered table, all text bold. Headers: Valuation Metric | Invesco India Large & Mid Cap Fund | Motilal Oswal Large & Midcap Fund | NIFTY LargeMidcap 250 (Benchmark).
  - Portfolio P/E Ratio | **48.34** | **46.23** | **24.60**
  - Portfolio P/B Ratio | **5.26** | **7.06** | **3.71**
- Source line: **Source: Value Research & Screener** · Star markers: **\*Direct Growth** · No as-of date
- On screen at: p33
- ⚠ Header spells "Motilal Oswal Large **&** Midcap Fund" (ampersand); everywhere else "Large **and** Midcap". Reproduce as printed per character-for-character rule.

## a18 — Portfolio Turnover table (page 15, table) — anchor p34

- [ ] 2-column bordered table, bold text; as-of qualifier italic in header. Headers: Fund (\* Direct Growth) | Portfolio Turnover Ratio (as of March 31, 2025).
  - Invesco India Large & Mid Cap Fund | **61.82%**
  - Motilal Oswal Large and Midcap Fund | **42.35%**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** (inside header cell) · As-of: **March 31, 2025**
- On screen at: p34

## a19 — Standard Deviation table (page 16, table) — anchor p38

- [ ] Metric | Invesco India Large & Mid Cap Fund | Motilal Oswal Large and Midcap Fund | Category Average → Standard Deviation | **18.36** | **21.33** | **16.24**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p38

## a20 — Beta table (page 16, table) — anchor p40

- [ ] Same 4-column layout → Beta | **1.08** | **1.17** | **0.97**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p40

## a21 — Alpha table (page 17, table) — anchor p41

- [ ] Same 4-column layout → Alpha | **8.11** | **6.36** | **0.62**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p41

## a22 — Sharpe Ratio table (page 17, table) — anchor p43

- [ ] Same 4-column layout → Sharpe Ratio | **0.94** | **0.77** | **0.59**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p43

## a23 — Upside Capture Ratio table (page 18, table) — anchor p46

- [ ] Same 4-column layout → Upside Capture Ratio | **132** | **133** | **101**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p46

## a24 — Downside Capture Ratio table (page 19, table) — anchor p48

- [ ] Same 4-column layout → Downside Capture Ratio | **104** | **116** | **99**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p48

## a25 — Maximum Drawdown table (page 20, table) — anchor p52 (values spoken p50–p51)

- [ ] 4-column layout, but fourth column is **Benchmark Index Average** (not Category Average). Two rows:
  - Maximum Drawdown | **-17.08%** | **-24.12%** | **-18.15%**
  - Drawdown Period | **Oct 2024 – Feb 2025 (5 months)** | **Jan 2025 – Feb 2025 (2 months)** | **-**
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p50–p52

## a26 — Returns comparison table (pages 21–22, table, MERGED from two page-parts) — anchor p62 (values spoken p54–p61)

- [ ] ONE table spanning the page 21/22 boundary, merged here. Columns: Metric | Invesco India Large & Mid Cap Fund | Motilal Oswal Large and Midcap Fund. All text bold. Rows:
  - 1-Year Return | **13.45%** | **8.43%**
  - 1-Year Benchmark Return | **4.56%** | **4.56%**
  - 1-Year Category Return | **8.27%** | **8.17%**
  - 1-Year Rank (Category) | **3** | **18**
  - 3-Year Return | **25.73%** | **23.17%**
  - 3-Year Benchmark Return | **12.30%** | **12.30%**
  - 3-Year Category Return | **16.76%** | **16.78%**
  - 3-Year Rank (Category) | **1** | **2**
  - 5-Year Return | **18.71%** | **18.88%**
  - 5-Year Benchmark Return | **11.76%** | **11.76%**
  - 5-Year Category Return | **14.68%** | **14.70%**
  - 5-Year Rank (Category) | **2** | **1**
- Below the table: '\* Direct Growth' (bold) then 'Source: Value Research'.
- Source line: **Source: Value Research** · Star markers: **\* Direct Growth** · No as-of date
- On screen across p54–p62.

## a27 — Motilal discrete-returns bar chart (page 23, chart) — anchor p63

- [ ] Value Research 'Discrete Returns' annual grouped bar chart screenshot (top panel of two, beige/cream, rounded border). Tabs: 'Trailing Returns' | 'Discrete Returns' (active, dark) | 'Rolling Returns' (lock icon); toggle 'Annually' (active) | 'Quarterly' | 'Monthly' | 'Weekly'. Legend: blue 'Motilal Oswal Large and Midcap Fund - Direct Plan', green 'BSE Large Mid Cap TRI', brown 'Equity: Large & MidCap'. 'Value Research' watermark top-right. Y-axis 'Return(%)' with ticks -10% to 60%. X-axis 2020–2025.
- Approximate bars (fund/benchmark/category): 2020 ~15/~13/~18 · 2021 ~43/~32/~39 · 2022 ~3/~5/~3 · 2023 ~40/~24/~31 · 2024 ~47/~14/~22 (tallest fund bar, widest gap) · 2025 ~-4 (only negative fund bar) /~9/~3. Values read off the image, approximate to ~1–2 pp; the dialogue anchors the hard claim (Motilal outperformed 3 of 6 years since 2020).
- Source line: **MISSING** (no printed caption; watermark only) · No star markers · No as-of date
- On screen at: p63

## a28 — Invesco discrete-returns bar chart (page 23, chart) — anchor p63

- [ ] Value Research annual grouped bar chart screenshot (bottom panel, no tab chrome). Legend: blue 'Invesco India Large & Mid Cap Fund - Direct Plan', green 'BSE Large Mid Cap TRI', brown 'Equity: Large & MidCap'. Watermark top-right. Y-axis 'Return(%)' 0%–60% (dips below 0 for 2018 category). X-axis 2014–2025 (12 groups).
- Approximate bars (fund/benchmark/category): 2014 ~45/~36/~55 (category tallest in chart) · 2015 ~6/~2/~4 · 2016 ~5/~5/~7 · 2017 ~41/~34/~40 · 2018 ~1/~2/~-6 (category negative) · 2019 ~11/~10/~9 · 2020 ~14/~13/~17 · 2021 ~31/~33/~39 (fund lags both) · 2022 ~1/~6/~3 (fund lags both) · 2023 ~33/~26/~31 · 2024 ~38/~14/~22 (widest fund-over-benchmark gap) · 2025 ~6/~9/~3. Approximate to ~1–2 pp; dialogue anchors the hard claim (Invesco outperformed 2 of 6 years since 2020).
- Source line: **MISSING** (watermark only) · No star markers · No as-of date
- On screen at: p63

## a29 — Expense Ratio table (page 24, table) — anchor p66 (values spoken p65)

- [ ] Columns: Metric | Invesco India Large & Mid Cap Fund | Motilal Oswal Large and Midcap Fund. Single row: Expense Ratio | **0.56%** | **0.90%**. All text bold, centered. Below: '\* Direct Growth' (bold) then 'Source: Morningstar'.
- Source line: **Source: Morningstar** · Star markers: **\* Direct Growth** · No as-of date
- On screen at: p65–p66

## a30 — Compliance / RA sign-off block (page 25, prose-box) — anchor p71 (post-script)

- [ ] Plain-text block, not spoken dialogue:
  - "Disclaimer: This is solely for educational purposes. The securities/investments quoted here are not recommendatory."
  - "To read the RA disclaimer, please click here." ('here' is a blue hyperlink)
  - "RA Sign :" (blank, no signature image)
  - "Research Analyst : Shreesha Ramesh Desai" (grey highlight/box)
  - "RA Date : 07-08-2026"
- Source line: **MISSING** · No star markers · As-of: **07-08-2026 (RA Date)**
- Not a timeline asset. The disclaimer text may need to appear on screen per Groww compliance convention — parent to decide. Spoken disclaimer is p70.

---

# Structural cues

## Instruction-end marker

- **"Chaliye shuru karte hai!"** (page 1, p04, flagged optional in script.json) — end of the intro/instruction block.
- Post-script end: page-25 RA compliance block (a30); spoken script ends page 24 with "Until then, bye!"

## Subtopic openers (verbatim, in order)

1. p05 (page 1): "Pehle kuch basic important notes:"
2. p07 (page 2): "Dono funds ka benchmark same hai:"
3. p10 (page 2): "Ab baat karte hai AUM ki."
4. p11 (page 3): "Toh, kaun hai in dono funds ke fund managers?"
5. p15 (page 6): "Ab dekhte hai, inn funds ke investment philosophy ke baare mein."
6. p26 (page 8): "Ab hum in donom funds ke portfolio ke baare mein jaante hain."
7. p30 (page 10): "Ab baat karte hai market cap allocation ki."
8. p32 (page 12): "Average market cap ki baat karein toh, Invesco India Large & Mid Cap Fund ka average market cap hai ₹97,433 Crore, jabki Motilal Oswal Large and Midcap Fund ka average market cap hai ₹77,294 Crore."
9. p33 (page 14): "Valuation ki baat karein toh, Invesco ka Portfolio P/E Ratio Motilal Oswal ka Portfolio P/E Ratio se zyada hai aur Portfolio P/B ratio comparitively kam hai."
10. p34 (page 14): "Portfolio turnover ki baat karein toh, Invesco India Large & Mid Cap Fund ka reported turnover hai 61.82%, jabki Motilal Oswal Large and Midcap Fund ka reported turnover hai 42.35%, dono hi March 31, 2025 tak ke data ke hisaab se."
11. p35+p36 (page 15): "Ab, Sirf portfolio composition dekhkar equity funds ko judge karna kaafi nahi hota. Chaliye ab risk aur risk-adjusted returns ki baat karte hai."
12. p37 (page 15): "Pehla metric hai Standard Deviation, jo yeh batata hai ki fund ke returns kitna fluctuate karte hai apne average return ke comparison mein."
13. p39 (page 16): "Ab baat karte hai Beta ki. Beta measure karta hai ki fund benchmark ke comparison mein kitna volatile hai. Beta 1 se zyada matlab fund benchmark se zyada volatile hai."
14. p41 (page 16): "Alpha ki baat karein toh, Invesco India Large & Mid Cap Fund ka Alpha hai 8.11, jabki iski category ka average sirf 0.62 hai."
15. p42 (page 17): "Ab baat karte hai Sharpe Ratio ki, jo har extra unit of risk ke liye fund ne kitna extra return diya, yeh batata hai."
16. p44 (page 17): "Ab chaliye dekhte hai Upside aur Downside Capture Ratio ko."
17. p45 (page 18): "Upside Capture Ratio batata hai ki jab market upar jaata hai, fund apne benchmark ke comparison mein kaisa perform karta hai. 100 se zyada matlab fund ne benchmark se behtar perform kiya."
18. p47 (page 18): "Downside Capture Ratio batata hai ki jab market girta hai, fund us fall mein kitna neeche jaata hai. 100 se kam matlab fund benchmark se kam gira, jo achhi baat hai."
19. p49 (page 19): "Ab baat karte hai Maximum Drawdown ki, jo yeh dikhata hai ki fund apne peak se kitna neeche gira sabse bura phase mein."
20. p53 (page 20): "Ab baat karte hai returns ki, yaani fund ki actual performance ki."
21. p56 (page 20): "Ab 3-year performance dekhte hain."
22. p59 (page 21): "Ab 5-year returns ki baat karein."
23. p63 (page 22): "Ab return consistency check karne ke liye in funds ke discrete returns par nazar daalte hain."
24. p64 (page 23): "Ab baat karte hai expense ratio ki, yaani fund ko manage karne ke liye har saal li jaane wali fee."
25. p67 (page 24): "Conclusion" (flagged optional in script.json)

## Subscribe cues

- p03 (page 1): "Video ko aage badhane se pehle like kar dijiye, share kar dijiye aur channel ko subscribe kar lijiye, taaki aise hi insightful comparisons aapko miss na ho!"
- p71 (page 24): "Agar yeh video helpful laga ho, toh like karein, share karein, aur channel ko subscribe karna na bhoolein. Milte hain next video mein. Until then, bye!"

## Editor directions (unspoken)

- p13 (page 4): "AND" — structural connector between the Invesco bio screenshot and the Motilal manager material; flagged optional in script.json.
- Page 9: bold label "Invesco India Large & Mid Cap Fund Direct Growth" (for a11).
- Page 10: bold label "Motilal Oswal Large and Midcap Fund Direct Growth" (for a12).
- Page 13: bold label "Invesco India Large & Mid Cap Fund Direct Growth" (for a15).
- Page 13: bold label "Motilal Oswal Large and Midcap Fund Direct Growth" (for a16).
- p70 (page 24): spoken disclaimer that doubles as a compliance requirement — "Yaad rahe, yeh video sirf educational purpose ke liye banayi gayi hai. Isme diye gaye securities ya investments recommendatory nahi hain." May also need on-screen display per Groww convention.

---

# Data discrepancies to flag to the creator

1. **Khemani join date:** p12 dialogue says "Invesco AMC ke saath November **2013** se judey hai"; the page-4 Invesco screenshot says "with effect from 1st November **2023**". The screenshot (primary source) suggests 2023; dialogue likely a typo.
2. **Motilal manager list:** page-3 About box lists "Varun Sharma, Ajay Khandelwal, Ankit Agarwal and Rakesh Shetty"; p14 dialogue and the page-5 cards list Atul Mehra, Ajay Khandelwal, Ankit Agarwal, Rakesh Shetty, Swapnil (P) Mayekar — no Varun Sharma.
3. **Invesco expense ratio:** page-3 About box says **0.55%**; page-24 table and p65 dialogue say **0.56%**.
4. **Motilal expense ratio:** page-3 About box says **0.60%**; page-24 table and p65 dialogue say **0.90%**.
5. **"Flexibity"** (sic) on the page-7 QGLP slide — genuine misspelling in the source; reproduce as printed if rebuilding verbatim, or flag.
6. **"Motilal Oswal Large & Midcap Fund"** (ampersand) in the page-14 valuation table header vs "Large and Midcap" everywhere else.
7. **No printed source** on: QGLP slide (a07), Growth Themes slide (a08), both discrete-returns charts (a27, a28 — watermark only), the a11 labeled card (shared source line assumed), and the RA block (a30).

---

# Summary count by kind

| Kind | Count | Items |
|---|---|---|
| table | 12 | a01, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26 (merged 21–22), a29 |
| bordered-screenshot | 9 | a04, a09, a10, a11, a12, a13, a14, a15, a16 |
| prose-box | 3 | a02, a03, a30 |
| colour-deck-slide | 3 | a06, a07, a08 |
| chart | 2 | a27, a28 |
| photo-grid | 1 | a05 |
| **Total** | **30** | (unique on-screen builds after de-duplicating a09/a11, a10/a12, a13/a15, a14/a16: **26**) |
