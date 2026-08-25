---
name: project-human-vs-ai-deck
description: "Human editor vs AI editor pitch deck for Groww leadership — built 2026-08-24, lives on the SSD outside the repo, blocked on the creator's baseline numbers"
metadata: 
  node_type: memory
  type: project
  originSessionId: b16317fb-fb54-4243-8299-940e317fde1f
  modified: 2026-08-24T02:40:29.385Z
---

**Human editor vs AI editor** — a 16-slide leadership pitch deck, built 2026-08-24.
Lives at `/Volumes/Extreme SSD/presentation-human-vs-ai/`, pushed 2026-08-24 to the PRIVATE
repo `github.com/amudhanezhil21-collab/presentation-human-vs-ai` (private because it carries
internal cost figures; `media/longform.mp4` is 99.6MB — a hair under GitHub's 100MB limit, so
a bigger re-encode will need LFS). Folder is — deliberately **outside** the
repo, because a deck is neither taste (`brand.md`/`styles/`) nor a job (`projects/<job>/`),
and CLAUDE.md forbids anything else in the root.

`deck.html` (1600×900 logical stage, Groww palette + Ivy Presto/Inter Tight from
`assets/fonts/`), `serve.sh`, `export-pdf.sh` → `human-vs-ai-editor.pdf` (16pp, 16:9), and
`build-standalone.py` → **`Presentation.html`** — ONE 60 MB double-clickable file with fonts,
logos, posters and all four videos inside; this is the shipping artifact.

**Video-in-PDF is a dead end — do not retry it.** PDF RichMedia annotations only play in
Adobe Acrobat Reader (not Preview, Quick Look or Chrome's viewer), and Acrobat is not
installed on this machine, so it cannot even be tested here. The single-file HTML replaces it.
Technique that works: videos as base64 in `<script type="text/plain">` blocks, decoded to
**Blob URLs lazily per slide** (a raw `data:` URI on a `<video>` seeks badly and doubles
memory); fonts/logos/posters as plain `data:` URIs so `file://` needs no server. Verified on
`file://` with `chrome --headless=new --dump-dom` (checks `src="blob:"` appeared).

**Structure the creator asked for, in order:** cover → setup → synced side-by-side
(human YouTube short vs `draft-v11`) → scoreboard → 5 metric slides (time, cost, review
depth, brand consistency, trajectory) → prompting → review agents → long-form → avatar →
the scroll slide → the "big spot" → close.

**Creator's human baselines (2026-08-24, authoritative):** a human editor delivers **max 2
shorts/day, 7 shorts/week**; a long-form takes 2–3 days. Market rate **₹2,000–3,000 a short,
₹7,000–9,000 a long-form**. The framework sustains **6 shorts + 1 long-form a week** on the
Claude Max plan (the "4 shorts + 1 long in a day" figure is a demonstrated burst, not the
planning rate). Derived: one AI week at market rate = ₹19,000–27,000; per month ≈
₹82,000–1,17,000 — against **₹25,000/month for one Claude Max plan**, which the creator says
covers the whole output. Difference ₹57,000–92,000/month, **₹6.8L–11.0L a year**, 3.3–4.7×
output per rupee. **All placeholders are now filled; the deck contains no estimated figure.**

**The creator asked for the ramp cost to be stated on the cost slide** — setup and training
run ABOVE what one Max plan covers (teaching the brand, writing the style files, the early
11-draft jobs); ₹25,000 is what it settles to. It is an amber CAVEAT block on slide 6, cross-
referenced to the draft-count curve on slide 9. Keep this: volunteering the ramp cost is what
makes the rest of the cost slide credible to a leadership room.

**The creator's own framing, worth keeping:** the AI work is *instruction-side only* — the
operator writes the brief and reads the findings and is free while it renders, so operator
hours and wall-clock hours are different things. That is its own scoreboard row, not a
footnote to throughput. **Attended time (creator, 2026-08-24): 1½ hrs to instruct a short,
2–3 hrs for a long-form** → ~11–12 operator hours for a whole week's output, against an
editor's fully-spent 40.

**FINAL ORDER (creator, 2026-08-24) — 11 slides:** cover → creator's-cut setup → side-by-side
→ agents watch it back → "4 shorts made in a day" grid → same-day long-form → avatar (no
shoot) → the input is the creator's own direction → scoreboard → cost (two invoices) →
scroll slide (the closer). DELETED: throughput ("One person, one week"), brand-consistency,
drafts-trajectory ("Eleven drafts"), and "Volume stops being the constraint" — backup
`deck.15-slide-pre-reorder.html.bak`. The cost slide's caveat no longer cross-refs the drafts
curve (that slide is gone); the grid's avatar pointer now says slide 7; eyebrows renamed
("How it works · the review / the input", "The cost").

**15 slides previously** (review-depth metric slide and the closing "real slate" slide both removed on request — backups `deck.17-slide-with-review-depth.html.bak` / `deck.16-slide-with-close.html.bak` sit beside deck.html; the deck now ends on "Volume stops being the constraint"). Originally **17 slides** — a "Four shorts. And these are all of them." grid (Proof 01) sits before
the long-form, playing all four shorts of the day: one-stock, smallcap-250, dwm-sip draft4,
SIP avatar. The creator presents from **`Presentation.html`**, so any new video must be added
to the `VIDEOS` map in `build-standalone.py` or it silently will not ship.

**PDF export stalls unless print mode strips video srcs.** `?print=1` shows all 17 slides at
once; with six `<video src>` still set, headless Chrome pulls ~150 MB it never draws and the
export times out. The print branch now does `removeAttribute('src'); load()` — posters still
render, export drops from >5 min to ~6 s. Do not undo this.

**Audio + fullscreen (creator request 2026-08-24):** every video must be watchable with
sound and fullscreen. Grid videos now carry NATIVE `controls` (unmuted; custom click handler
removed — native bar owns the surface); **Play all four** force-mutes as the volume demo.
Side-by-side keeps the custom sync UI plus a per-lane Fullscreen button that adds `controls`
for the fullscreen stay and strips them on exit; Play both auto-selects AI audio if both
lanes are muted. Two gotchas: `object-fit:cover` CROPS in fullscreen — always add
`video:fullscreen{object-fit:contain}`; and ⛶ U+26F6 is tofu in Inter Tight — use the word,
not the glyph. Adding the lane buttons overflowed slide 3 until lanes shrank to 250×444.

**Chrome pauses muted video in a HIDDEN window** ("video-only background media was paused to
save power") — this makes autoplay tests fail in the non-compositing browser pane and is NOT
a bug. Verify playback against a *visible* page before chasing it. Also: hydrated-from-Blob
videos can be at readyState 0 when a click lands, and setting `currentTime` there silently
kills the following `play()` — wait for `loadedmetadata` first.

**The learning curve is measurable from draft filenames** (completion order): one-stock
**11 drafts** (23 Aug) → smallcap-250 **1** (24 Aug 01:38) → SIP avatar **4** (24 Aug 06:55,
first avatar build) → flexi-cap 9:56 long-form **1** (24 Aug 07:48). Show the avatar bump and
label it a new capability — honest beats a clean curve.

**Known unfairness to fix:** `media/human-edit.mp4` is a 360p YouTube pull (YouTube blocks
the HD streams without a PO token; only the `mweb` player client worked, and only for
format 18). It sits beside a clean 1080p AI render, which flatters the AI side. Replace with
the human editor's original export when available.

Real evidence used, pulled from the job folders — reuse these rather than re-deriving:
`review-r1-confirmed.json` (28 confirmed defects on the 66s avatar cut: 3 critical /
12 major / 13 minor) and `EDITING-INSTRUCTIONS.json` (17 instructed beats covering all
97.16s of the one-stock short). See [[project-pipeline-state]] and
[[project-dwm-sip-avatar-job]].
