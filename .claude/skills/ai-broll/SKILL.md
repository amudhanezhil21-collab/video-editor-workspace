---
name: ai-broll
description: Turn a beat that has no footage into a rendered clip — motion graphics via this machine's motion engine (Remotion or HyperFrames), or generated video via whichever provider this machine has (Higgsfield, else Kie.ai). Generates clips and manifest entries only; never composites. Also generates one-off images/icons for the graphics skill mid-edit.
---

# Skill 3: AI B-roll

**Whole job:** turn a beat that has no footage into a rendered clip.

**What it does not do:** it does not pick windows in footage you already shot — that belongs in graphics. And it does not composite anything into the final video. It generates a clip and writes a manifest entry, and that is it. Keeping generation separate from placement is what makes both debuggable.

## Scene templates

Map every slot to one of these eight before writing a prompt. Picking the right one up front is most of what stops the output reading generic:

| The beat is about | Reach for |
|-------------------|-----------|
| One big number landing | Stat reveal |
| Several categories at once | Data breakdown |
| Parts of a whole | Pie or donut |
| Things ranked | Podium |
| A system or process | Flowchart |
| "Look what showed up" | Phone notification |
| Old versus new | Before and after |
| Words as the payoff | Kinetic type |

## The twelve design rules

These separate motion design from PowerPoint. Make **at least half of them explicit in every single prompt** rather than hoping the render figures them out:

1. Text never just fades in. Clip mask reveals, or word by word.
2. Nothing animates simultaneously. Stagger everything by at least 0.4 seconds.
3. The background is never flat. Gradient, vignette, or a fine grid.
4. The accent colour appears on exactly one element per scene.
5. Numbers count up or flip. They never just appear.
6. Exits are designed. Elements leave with purpose.
7. Generous whitespace. More than feels right.
8. One focal point per frame. Never more than two things moving.
9. Scale is dramatic. Primary numbers 160px minimum.
10. Connectors and dividers draw in, never appear.
11. Small premium details. Thin highlights, low-opacity reflections.
12. Motion blur on fast travel, removed once settled.

**The failure list is the mirror image:** the same layout reused for every beat, "fade in" instead of a real entrance, no stagger, a flat background, a vague ease like "smooth" instead of a named one, small type, no exits, too many colours, everything moving at once.

## Output contract (every generated clip)

- **Render at the base video's exact frame rate, probed, never guessed.** If the base is 23.976 you pass `24000/1001`, not `24`. A rounded guess drifts out of sync the moment the clip is composited back.
- **Every generated clip is silent.** The base voice track keeps playing underneath. If a render produces an audio stream anyway, strip it before writing the manifest.
- **Duration is the beat window plus half a second of tail margin.** A clip that ends exactly on its boundary is a bug waiting for the next composite.
- Aspect: **9:16** for short form (match the base for long form).
- Save the clip to the project's `broll/` folder and append an entry to `broll/manifest.json`: beat ID, window, template, prompt, model, file path, frame rate, duration.

## Generated video: Higgsfield or Kie.ai

**The provider is a property of the machine, not the job.** Check once at the start of a job which one this machine has, say which you are using, and stay on it for the whole job.

**Higgsfield — where it is connected.** Two access paths; prefer whichever this machine has:

- **CLI (the reliable one):** `higgsfield` (`npm i -g @higgsfield/cli`, then `higgsfield auth login`, then `higgsfield workspace set <id>`). Check credits with `higgsfield account status` before a batch. `higgsfield model list --video` for what's available; `higgsfield generate create <model> --prompt "…"` to run one. The companion skills (`npx skills add higgsfield-ai/skills`) wrap this — `higgsfield-generate` is the one for b-roll.
- **MCP connector:** registered in `.mcp.json`. Note: as of 2026-08-21 its OAuth fails on any client enforcing RFC 9207 — it advertises `mcp.higgsfield.ai` as issuer but Clerk returns `clerk.higgsfield.ai`. Reported to Higgsfield; **use the CLI until they fix it.**

Iterate at draft quality until the content and motion are approved, then commit to a final.

**Higgsfield CLI, the details that cost time (verified 2026-08-22):**

- `higgsfield model get <job_type>` prints the real parameter table — read it rather than guessing
  flag names. `higgsfield account status` shows plan and remaining credits.
- **`seedance_2_0`**: `--aspect_ratio 9:16 --resolution 1080p --mode std --duration N
  --generate_audio false`. `mode fast` only does 480p/720p; **`std` is required for 1080p**.
  Output comes back at **24fps** — conform it to the base rate before compositing.
- **Character consistency across two shots: pass a still from the approved first clip as
  `--image-references`.** Extract a clean frame with ffmpeg and feed it in; the man, his shirt, the
  room and the monitor all carried over correctly between two separately-generated beats.
- **Verify the prompt actually landed by measuring pixels, not by looking.** "A terminal all in red"
  and "only ONE stock in deep red" are checkable: crop the screen region and count red-dominant vs
  green-dominant pixels and the number of distinct red row-bands. A first pass measured 31% red
  across 5 bands when the brief said one; a re-prompt with explicit negative constraints
  ("nineteen rows neutral green, EXACTLY ONE red, no red chart line, no other red") produced
  3.2% red in a single band. **Two generations and a measurement beat ten generations and a squint.**
- **SFX can be generated when `assets/sfx/` has no sample** — `mirelo_text_to_audio` takes just
  `--prompt` and `--duration`. This is a real recording model, not a synthesised tone, so it does not
  violate the finishing-pass rule against fabricating a tone. **Always check what came back:**
  one generation returned −67 LUFS (silent) and a "denser" retake put its loudest moment at 2.2s,
  which is wrong for an impact. **Measure the envelope** — an impact must peak in the first 0.1–0.2s
  and decay monotonically. Save keepers into the workspace `assets/sfx/` so the library grows.
- Result URLs need a browser User-Agent to download.

**Keying an "ultra key green" generation — do NOT reach for `chromakey` (2026-08-23).** Seedance
returns green screens that are *vignetted*: on one clip the corners measured `#016433` and the centre
`#127B43`. `chromakey` compares **chroma only**, so the similarity radius needed to clear the dark
corners also swallows neutral U/V — at sim 0.22 the subjects' **white t-shirts went 100% transparent**
while the background finally cleared. There is no setting that gets both; measured, the best
compromise left the background 90.6% clear *or* the subject 0% solid.

Key on **greenness = G − max(R, B)** instead. It is luma-independent, so one pair of thresholds
covers the whole vignette and never touches neutrals. Measure first: the three clips on that job put
only **0.9–4.3% of pixels in the 10–40 transition band**, i.e. the separation is strongly bimodal and
a soft ramp over `[12, 38]` lands almost entirely on genuine edge pixels.

```python
grn = g - np.maximum(r, b)
a   = np.clip((hi - grn) / (hi - lo), 0, 1)          # lo=12, hi=38
g2  = np.minimum(g, np.maximum(r, b) + 8)            # despill: a no-op on non-green pixels
```

Result on that job: background 100% clear, subject 100% solid, sub-0.4% soft edge, and white shirts
and gold coins came through with their own colours intact. `scripts/greenkey.py` in the
`daily-vs-weekly-vs-monthly-sip` build is the reference implementation.

- **`despill` with a real `mix` wrecks warm subjects.** `despill=type=green:mix=0.5` shifted tan coin
  sacks toward magenta (ΔE 9.4). Clamping green against the other channels costs ΔE 0.0 and does the
  same job.
- **A GLASS hero on green keeps real green light inside it.** The hourglass's coins measured G/R
  0.912 where gold is 0.75–0.85 — that is not spill, it is the screen lighting the subject through
  the glass. Fix it with a warm-pixels-only correction (`G' = min(G, 0.80R + 0.20B)` where `R > B+25`),
  which restored G/R to 0.841 and left the glass, the highlights and everything neutral untouched.
  Keying glass on green is otherwise *correct* — the new background reads through it, as it should.
- **Conforming a keyed clip to the base rate: `minterpolate` DROPS ALPHA.** Split the streams,
  interpolate both, re-merge — otherwise you are back to duplicate frames:
  `[rgb]minterpolate=fps=30[r]; [al]alphaextract,minterpolate=fps=30[a]; [r][a]alphamerge`
  That measured **zero** duplicate frames across a 24→30 conform, where a plain `fps=30` duplicates
  ~20% of the b-roll window.
- **Verify the brief with a mask that cannot catch the subject.** "The piles must be equal" looked
  wrong on a contact sheet and measured *right*: a naive warm-pixel gold mask was catching skin and
  reported nonsense, while an HSV mask (hue 13–36, S≥95, V≥90) restricted to the stack region
  measured the three stacks at 852/852/852 px — 0.0% spread. Squinting at a contact sheet is not a
  measurement; the perspective of a three-up shot will fool you every time.

**Kie.ai — where `KIE_API_KEY` is in the workspace `.env`.** Read the key from there, never hardcode it, never print it.

- `POST https://api.kie.ai/api/v1/jobs/createTask`, then poll `GET .../jobs/recordInfo?taskId=<id>` until `state` is `success`.
- **Drafts: `kling-3.0/video`**, `mode: "std"` — cheap iterations while prompt and timing are dialled in. Input keys: `duration`, `mode`, `aspect_ratio`, `sound`, `multi_shots`, `prompt`.
- **Finals: `bytedance/seedance-2`** — only once the draft is approved. Input keys: `prompt`, `aspect_ratio`, `resolution` (720p max), `duration`, `generate_audio`.
- Result URLs return **403 without a browser User-Agent** — pass one when downloading.

Flow either way: create → wait (**webhook if configured, otherwise poll**) → download → strip audio → conform to the probed base frame rate → write to `broll/` → append the manifest entry. Apply the output contract above: silent, 9:16, beat + 0.5s, exact frame rate. **Record which provider and model ran in the manifest entry** so the job stays reproducible on the other machine.

Motion-graphics slots (stats, charts, kinetic type) render locally through this machine's motion engine — **Remotion, or HyperFrames where Remotion is not installed** — instead: cheaper, deterministic, brand-token-native. Reserve the video provider for footage-like content code cannot draw. Local renders follow the engine contract in the `graphics` skill.

## Generated images mid-edit

The second job of this skill: when the graphics skill needs an icon or illustration that code cannot build, generate the image with whatever this machine has — Higgsfield, or Kie.ai (`google/nano-banana`) — and hand back a file for the graphics engine to composite. Same manifest discipline: every generated asset gets a manifest entry with its prompt, provider/model and destination beat.

**Before generating anything, check `projects/*/broll/generated/` across the workspace** — icons and illustrations from earlier jobs are reusable and already keyed to the brand, and reusing one costs nothing.
