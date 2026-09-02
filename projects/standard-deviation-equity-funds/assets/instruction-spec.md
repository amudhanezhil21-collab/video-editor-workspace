# Instruction harvest — standard-deviation-equity-funds

Source: script doc `1T0QCNiRx3XMJt9rmaT-Go3GpkpklX02AUA8p4vNyQc8`
Anchoring method: **HTML export positional markers** (`cmnt_ref`), NOT the API thread order.

## Why anchoring mattered on this job

The Drive API returned 17 threads sorted by comment ID. Creation timestamps *look* like document
order (10:17 → 10:38 walking down the script) but **"Use AI B roll with Higgsfield" was created last
at 10:39:46 and belongs to the 5th anchor from the top** (the roller-coaster line). Any ordering
heuristic — ID order or creation order — mis-assigns that comment and every one after it.
18 HTML markers vs 17 API threads = 15 instruction comments (Tab 3) + 2 reviewer comments +
1 reply ("Yes"), all accounted for. No resolved/omitted threads.

## Tab 1 — reviewer data questions (NOT edit instructions)

| Ref | Anchor | Comment | Status |
|---|---|---|---|
| REF1 | fund-table image row | "let's give the data source and also as on what date? / Can you cross check once whether these 2 funds carry higher standard deviation than the rest?" — reply: "Yes" | Partly answered; see flags F1, F3 |
| REF3 | fund-table image row | "can we also add the data on the funds with lower standard deviation?" | Answered — the lower-SD set exists in Tab 3 |

## Tab 3 — the creator's 15 edit instructions, anchored

| # | Ref | Script line (Hinglish VO) | Instruction (verbatim) | Treatment |
|---|---|---|---|---|
| B1 | REF4 | "Hey, kya aapko pata hai ki aapka equity fund kitna volatile hai?" | plain A-Roll with zoom in | A-roll + FFmpeg zoom |
| B2 | REF5 | "Standard Deviation measure karta hai ki ... average return se kitna fluctuate karte hain." | Use AI - Broll of ultra realistic style of a person using trading terminal. | AI b-roll |
| B3 | REF6 | "For example, agar kisi fund ka average annual return 10% hai aur Standard Deviation 6% hai, toh ... 4% se 16% tak fluctuate kar sakte hain." | use full screen motion graphics in this background <doc 1uWwRj> | Full-frame takeover |
| B4 | REF7 | "But, Agar same 10% average annual return wale fund ka Standard Deviation 12% hai, toh ... -2% se 22% tak." | use Text 10% Average Anual Return | Text element |
| B5 | REF8 | "Same average return, but experience kaafi different... ek roller coaster ki tarah. / So," | Use AI B roll with Higgsfield | AI b-roll (roller coaster) |
| B6 | REF9 | "Agar kisi fund ka Standard Deviation uske benchmark ya category ke comparison mein higher hai, toh ... zyada volatile rahe hain." | plain A-Roll with rapid zoom in | A-roll + fast zoom |
| B7 | REF10 | "Here are some equity funds ... higher Standard Deviation ... / Direct Growth / Source: Value Research / August 25, 2026" | <doc 12wckZ> | **Built** brand table — higher-SD set |
| B8 | REF11 | "And, ab un funds ko dekhte hain jinka Standard Deviation ... lower hai. / Direct Growth / Source: Value Research" | <doc 12wckZ> | **Built** brand table — lower-SD set |
| B9 | REF12 | "Aur dhyan rakhiye ... / Lower Standard Deviation ka matlab hai ki fund ke returns relatively more consistent rahe hain." | plain A-Roll full screen | A-roll, locked |
| B10 | REF13 | "Now, kya iska matlab ye hai ki higher SD wale funds mein invest hi nahi karna chahiye? / Not necessarily." | A question mark widget at the bottom frame with gradient behind. | Widget + gradient |
| B11 | REF14 | "Higher Standard Deviation wala fund automatically bad fund nahi hota. It also depends on the investor's risk tolerance ..." | <doc 15KN64> | per ratios-doc spec |
| B12 | REF15 | "Isliye Standard Deviation ko single deciding factor nahi banana chahiye." | plain A-Roll rapid zoom in | A-roll + fast zoom |
| B13 | REF16 | "Aap Alpha, Sharpe Ratio aur Sortino Ratio jaise metrics bhi check kar sakte hain ..." | Texts of Alpha, Sharpe Ratio and Sortino Ratio all line by line <doc 15KN64> | Line-by-line text build |
| B14 | REF17 | "Sharpe Ratio batata hai ki fund ne liye gaye risk ke comparison mein kitna return generate kiya, while Sortino Ratio downside risk par focus karta hai." | full screen Motion graphics <doc 1uWwRj> | Full-frame takeover |
| B15 | REF18 | "So, kisi fund ko sirf uske Standard Deviation ko dekhkar judge mat kijiye. / Returns ke saath-saath risk aur risk-adjusted performance ko bhi dekhiye." | A-roll with usual disclaimer and etc | A-roll + RA/compliance panel |

## Compliance identity (from the doc, verbatim — never invented)

- RA disclaimer link: https://groww.in/p/sebi-research-analyst-regulations
- Research Analyst: Shreesha Ramesh Desai (shreesha.desai@groww.in)
- RA Date: 31-08-2026
- Data source line: Source: Value Research · Direct Growth · August 25, 2026

## Style-file interactions to respect (not re-derived)

- B7/B8 tables: **land COMPLETE, then highlight**; built from structured data, never the screenshot;
  vertical splits by COLUMN, not row. All rules one weight/colour on whole pixels.
- B2/B5 AI b-roll: **no captions over AI-generated b-roll**.
- B3/B14 takeovers: `$periwinkle-ground`; face is a true alpha-0 hole with the scaled face composited under.
- B4/B13 text: on-screen copy is a LABEL, not the narration. B4's copy is literally given ("10% Average Annual Return") — use it, fix the typo "Anual".
- Every scrim/gradient dissolves in AND out (~0.5s each way); edge feather to true zero.
- Light leaks are transitions only — she never appears inside one.
