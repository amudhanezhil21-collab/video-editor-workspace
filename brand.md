# brand.md

The one file that gets personalised. Colours, fonts, voice, hook behaviour, mishear list. Every style file refers to colours as `$accent` / `$bg` tokens — never hardcoded hex — so changing a value here recolours every graphic in every style at once.

## Colours

**The official Groww palette** (Brand Guidelines PDF, page 1 — the authority). Eleven colours; nothing outside this list enters a frame. Every style file refers to them by token, never by hex.

**Primary**

| Token | Hex | Role |
|-------|-----|------|
| `accent` | `#00D09C` | Brand green — **identity only**: logo marks, wipe sheets, CTA headlines. Never data ink, never number emphasis |
| `indigo` | `#5367FC` | The workhorse graphic colour: pills, banners, panels, table headers, chart bars/lines, borders, compliance boxes |

**Accent**

| Token | Hex | Role |
|-------|-----|------|
| `amber` | `#FCB31C` | Highlighter sweeps on key cells and phrases; the caption karaoke word |
| `coral` | `#F26B55` | Negative values, warnings, alert moments |
| `mint` | `#67F9C8` | Quieter tint — gradients and decoration |

**Neutral**

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#44475B` | All dark text: titles, table values, source lines |
| `muted` | `#B1B4B7` | Subheads and labels |
| `rule-strong` | `#CCCFD1` | Borders and dividers |
| `rule` | `#ECEDEE` | Thin lines, grid, hairlines |
| `bg` | `#F9FAFA` | Background base |
| `white` | `#FFFFFF` | Card fills |

`accent` is used sparingly — one loud element per scene.

### Grounds & elevation (golden rules, creator-supplied reference 2026-08-11)

These are **textures and effects**, not palette colours — they come from the creator's reference frame and are the one sanctioned exception to "palette only".

| Token | Role | Value |
|-------|------|-------|
| `paper-ground` | Card/callout layout background: warm paper `#F3F2F0` with fine grain + soft vignette | `#F3F2F0` |
| `gradient-ground` | Full-frame graphic takeovers: periwinkle→white→mint diagonal + faint white grid (~85px cells) + soft white spotlight behind the hero | `#9EA2C7→#D3DEF4→#8AF0CB` |
| `shadow-hard` | Hard offset shadow (no blur) + `3px #14151A` outline — on every card, table, callout and face-card over `paper-ground` | `#53B091`, offset ~12px right / 14px down |
| `shadow-soft` | Soft black shadow on elements over `gradient-ground` or footage — same down-right direction, blur scales with element size | black 15–40%, 8–15px offset, 25–70px blur |
| `marker` | Highlight sweep over key phrases in callouts | `$amber` `#FCB31C` |

**The golden rule: every graphic element carries a drop shadow** — face-card, tables, callouts, charts, motion graphics. Hard `shadow-hard` on paper; `shadow-soft` on gradient/footage. Nothing floats flat.

## Fonts

**Inter Tight and Ivy Presto are the channel's two fonts** — both live in `assets/fonts/` and renders load them from file, never from the system. (The brand guidelines PDF names Nunito Sans for marketing/social and Gotham Medium for the logo. Neither is used in video, and neither is installed here — the PDF is the authority on **colour**, not on video type.)

- **Display serif: Ivy Presto** — takeover titles and keyword pops; the channel's editorial voice. Files in `assets/fonts/`.
- **Sans: Inter Tight** — everything else: chart titles, pills, banners, table cells, source lines, all graphic UI text, **and captions**. Files in `assets/fonts/`.
- **Thumbnail face** — Inter Tight ExtraBold Italic, thumbnail cards only.

## Caption voice

Captions are an **English translation** of the Hindi/Hinglish voiceover — never a raw transcript, never Devanagari. White bold Inter Tight on near-black rounded chips, groups of 2–6 words (typically 3–5) swapping as instant pops. **Karaoke: one word at a time turns `$amber` `#FCB31C`**, advancing through every word. ALL-CAPS interjections ("NOW,", "BUT WAIT...") get their own chip stacked above the main line. No emojis. (Measured from the reference channel, verified 2026-08-08.)

## Default hook

Frame 1 is the literal thumbnail, baked in for 1–2 frames, then a hard cut to the presenter who speaks the hook by ~0.6s; the first evidence graphic lands at 1.5–3.5s. **Persistent corner branding runs from frame 1 on every frame** — it is never withheld for the hook. No animated hook/title card carries the question. (Measured from the reference channel, 2026-08-08.)

## Mishear list

WhisperX will mangle these. The transcription step applies this list automatically — fix once, fixed in every future video.

**Single-word swaps (safe to auto-apply, whole-word only):**

| Heard | Correct |
|-------|---------|
| grow | Groww |
| glow | Groww |
| sip | SIP |
| oum | AUM |
| nifty | Nifty |
| फॉर्सर्स | Infosys |
| रिस्ट | risk |
| पीरियन | period |
| karod | crore |
| sensex | Sensex |

**Multi-word (context-check only — never auto-apply; a words-into-one fix changes the word count and breaks every downstream timestamp):**

| Heard | Correct |
|-------|---------|
| a u m | AUM |

Note: "grow"/"sip" are real English words — auto-apply only when context is the brand/investment sense; when in doubt, judge in context before swapping.
