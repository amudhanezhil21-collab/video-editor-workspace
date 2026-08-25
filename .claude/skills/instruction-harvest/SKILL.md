---
name: instruction-harvest
description: Read a creator-annotated script document and turn it into an exact, buildable edit spec. Anchors every comment to the precise script line it was left on, follows the documents and videos those comments link to (and the links inside THOSE), downloads and measures every reference image, and returns a per-beat instruction list with timestamps. Use whenever a job's direction lives in comments on a Google Doc rather than in a plain brief.
---

# instruction-harvest

**Whole job:** turn "here's my script, I left comments on it" into a per-beat spec precise enough to
build from without guessing.

The creator's real direction is rarely in the doc body. It is in the comments, in the documents those
comments link to, and — routinely — in a reel or clip that *those* documents link to in turn. Miss one
level and you are inventing a spec.

## Step 1 — anchor every comment to its exact line. Do not skip this.

**The API returns comment threads sorted by ID, not in document order.** Reading them top-to-bottom
and pairing them with lines top-to-bottom will mis-anchor the entire job, and the result looks
plausible — every line gets an instruction, just the wrong one.

The fix is the HTML export, which carries **positional** markers:

```python
# Docs HTML export puts <a href="#cmnt1" id="cmnt_ref1">[a]</a> inline at the anchor point,
# and the comment bodies at the bottom in matching order.
download_file_content(fileId, exportMimeType="text/html")   # base64 -> decode
```

Replace `cmnt_ref(\d+)` with a visible marker, strip tags, and you get the script with `{{REF1}}`,
`{{REF2}}` … sitting exactly where the creator left them, plus `{{BODY1}}`, `{{BODY2}}` … at the
bottom. That mapping is ground truth. `scripts/anchor_comments.py` does it.

Two things to know:
- **Resolved comments are omitted from the HTML export.** Compare the count against the API's thread
  list; the difference is resolved threads, which are superseded and should be treated as such.
- The export is mostly base64 images, so strip `data:image/...` before doing anything else — a
  3MB export becomes 35KB of actual structure.

## Step 2 — follow every link, including the ones inside linked docs

Build the list of linked documents, then read **each one with its own comments** (`includeComments`),
because creators leave the real detail in a comment on the linked doc too. Then look at what *those*
docs link to. On a recent job the chain ran three deep:

- a comment → a "light leak inspiration" doc → **a YouTube Short that was the only actual spec**
- a comment → a table doc → **a second Short** defining the table design and its animation
- a comment → a frame-layout doc → **a 47MB `.mov` in Drive** defining the table animation

A doc that says "as explained in this doc" and contains one sentence and a link is a **pointer, not a
spec**. Report it as an unresolved dependency, not as a spec you read.

**Getting the media:**
- **Drive files over 10MB** cannot come through the MCP download tool. Use the browser: navigating to
  `uc?export=download&id=…&confirm=t` hits a virus-scan interstitial; submit its form to start the
  download.
- **YouTube via yt-dlp often 403s** on the default client. `--extractor-args "youtube:player_client=mweb"`
  worked when `web_safari`, `ios`, `tv` and the default all failed.

## Step 3 — extract and actually LOOK at every reference image

Pull every `data:image/...` URI out of the HTML export, write each to a real file, and **Read them**.
The size, placement and style rules are almost never written down — they are in the picture.

## Step 4 — measure the references, don't describe them

This is what separates a buildable spec from a vibe. Real examples that paid off:

- **A texture**: FFT + autocorrelation on the reference recovered a 45° halftone dot screen with a
  5.80px repeat, 1.42px dots, neutral, ~3% multiplicative — where prose had only said "a subtle dust".
- **A transition**: extracting every frame of the reference reel and profiling mean luma found the
  signature (a repeated 13-frame flash), and per-frame R/G ratios gave the exact colour arc, including
  a one-frame white blowout and a mid-transition dip that looks like a mistake and is not.
- **A layout**: measuring element bboxes as a percentage of frame gave a size rule ("~10.3% of frame
  height") that transfers across aspect ratios, where "this size" would not have.

Record the numbers in the spec so the next job never re-derives them — and push anything that should
apply to every future video into the style file.

## Step 5 — return a per-beat instruction list, with conflicts flagged

For each beat: the anchored script line, its start/end from the word-level transcript, the creator's
comment **verbatim**, and the measured spec from whatever it linked to.

**Flag conflicts, never resolve them quietly.** They are common and they matter:
- Two comments describing the same boundary from opposite sides ("light leak transition" vs "a
  straight normal cut") — that is the creator's call, not yours.
- A doc's prose disagreeing with its own reference image (stated 25% coverage, image measures 44%) —
  the words are usually the instruction and the screenshot is usually stale, but say so.
- A linked spec disagreeing with the style file — the style file wins on colour and type; the
  creator's doc wins on this video's content.
- A figure in a supplied sample contradicting what the voiceover says — the spoken line wins, because
  the channel's bar is "matching the words she's saying".

Also state plainly what you could **not** resolve: a spec that names no font, no duration, no easing.
List those as unknowns rather than inventing values, and say which fallback you used.

## Fan this out

One agent per linked document, in parallel, each returning a structured spec with `buildSpec`,
`imageDescriptions`, `furtherLinks` and `unknowns`. The `furtherLinks` field is what catches the
third level — make it required, and act on it.
