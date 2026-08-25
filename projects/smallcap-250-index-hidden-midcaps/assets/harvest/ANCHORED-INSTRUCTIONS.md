# Anchored instruction spec — smallcap-250-index-hidden-midcaps

Source doc: "sample for Claude"
https://docs.google.com/document/d/1o98G1UClivG-UXK0scHlX-NpatzoNFTpu7KQvdyTSg4/edit
Tab 1 = Hinglish VO script (the spoken track). Tab 2 = English translation (the caption source).

**Anchoring method:** HTML export positional markers (`cmnt_ref<n>`), per the `instruction-harvest`
skill. The Drive API returns threads sorted by ID, NOT document order — anchoring by reading order
mis-assigns every instruction and the result looks correct.
**Integrity check: 19 inline anchors / 19 comment bodies / 19 API threads → zero resolved threads,
nothing superseded, nothing missing.**

Raw cut: `raw/source.mp4` — 1080x1920, exactly 25fps, 89.28s, 2232 frames, 181,438,141 bytes
(matches Drive metadata exactly).

| REF | Script line (Tab 1, verbatim) | Creator comment (verbatim) | Linked spec |
|---|---|---|---|
| 1 | Small Cap 250 Index Fund mein invest karoge toh 100% small cap exposure milega. | subtle zoom in | — |
| 2 | Sounds logical, right? | a subtle gradient from bottom till 25 % and an text(Sounds logical?) here. | — |
| 3 | Aakhir naam hi Small Cap 250 Index Fund hai. | Follow this editing instruction. | doc 1Ggg9W9v |
| 4 | Lekin reality thodi different hai. | plain A-roll. | — |
| 5 | Twist index ke andar hai. | with subtle gradient in bottom frame, use stock market widget elements with optimum size and swirl it. A lightleak after sfx after it | — |
| 6 | Nifty Smallcap 250 Index sirf saal mein do baar rebalance hota hai — June aur December mein. | Use this type of frame and when text June and December comes, animate those text under with subtle black gradient. | doc 1TWoC2RN |
| 7 | Ab maan lo ek small cap company zabardast rally kar deti hai. / 80%, 100%, 120% up. | AN AI B roll of a person who is standing in front of big trading terminal with an heading Small Cap companies. And the terminal is fully green. The camera is shown from behind towards the terminal. An sfx with edit after it. | — |
| 8 | Uski market cap badh kar mid cap range mein pahunch jaati hai. | Follow this editing instruction | doc 1X5n3nBg |
| 9 | Kya index usse turant nikaal deta hai? | a rapid zoom in of plain A-roll | — |
| 10 | Nahi. | A text of no in it over the gradient in bottom. | — |
| 11 | Woh stock agle rebalancing tak index mein bana rehta hai. / Aur kyunki index fund index ko exactly track karta hai, fund bhi us stock ko hold karta rehta hai. | *(bare link only — the doc IS the instruction)* | doc 1XDvRqxJ |
| 12 | Matlab aap officially ek small cap index fund hold kar rahe ho... / Lekin uske andar kuch stocks already mid caps ban chuke hote hain. | an AI animation, with theme of comsapny brand colours, all sheeps being white and when we zoom inthe black sheep it's writen Mid Cap in it. ( so visually emphhasiziong there is one odd one out among small cap funds which very few stocks are mid cap) | — |
| 13 | Abhi dekho, June mein rebalance hone se pehle abhi... + **the 11x2 TABLE** + Source: Groww | Animate this table in the given reference. | doc 1Ibfjc |
| 14 | Officially small cap. Functionally nahi. | follow this instruction | doc 1KgL8TJr |
| 15 | Yeh structure winners ko prematurely cut hone se bachata hai. Jo stock grow kiya, woh portfolio mein rehta hai. | an plain AI B-roll where there are circles with with hand and leg sticky figures. those are put in ramp, where the circle which is written small cap funds is in No 1 position. A light leak after it. use higgsfield , Hyperframe/remotion for it. | — |
| 16 | Aap assume karte ho ki aapka poora paisa pure small cap risk le raha hai. | AI roill generation is specified in this. | doc 1KzcBVBZ |
| 17 | Kabhi kabhi woh assumption kuch time tak galat ho sakhta hai. | An plain A- roll with subtle zoom in , but by the time she says galat an sfx of negative tone only at the time of galat and also an red overlay all over the screen only at the time she says galat. an lightleak with sfx after that | — |
| 18 | Isliye fund ka naam dekhne ke saath-saath uske underlying holdings bhi samajhna zaroori hai. | a widget of pad and paper , coming from bottom with subtle gradient at the bottom part of video. A note on the pad should be written as funds with some stacks of paper in it. | — |
| 19 | Aapko yeh pehle pata tha? Comment mein batao. | subscribe widget at the bottom with the gradient. | — |

## The 11x2 table — structured source, treated as ground truth (11 rows x 2 columns)

| Fund | Mid-cap share |
|---|---|
| Nippon India Nifty Smallcap 250 Index Fund | 9.59% |
| SBI Nifty Smallcap 250 Index Fund | 9.59% |
| Motilal Oswal Nifty Smallcap 250 Index Fund | 9.59% |
| HDFC Nifty Smallcap 250 Index Fund | 9.59% |
| ICICI Prudential Nifty Smallcap 250 Index Fund | 9.59% |
| Edelweiss Nifty Smallcap 250 Index Fund | 9.60% |
| JioBlackRock Nifty Smallcap 250 Index Fund | 9.59% |
| Groww Nifty Smallcap 250 Index Fund | 9.59% |
| Bandhan Nifty Smallcap 250 Index Fund | 9.59% |
| Kotak Nifty Smallcap 250 Index Fund | 9.58% |
| DSP Nifty Smallcap 250 Index Fund | 9.59% |

Source: Groww.  Declared structure = 11 rows x 2 cols. Row order above is the doc's order and is
authoritative. Edelweiss (9.60%) is the high outlier, Kotak (9.58%) the low — the only two values
that differ from 9.59%.
