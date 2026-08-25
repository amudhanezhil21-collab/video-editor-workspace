# Setting up this workspace on a new machine

Clone the repo, then:

## 1. Tools (one-time)

Always needed:

- **Node.js** (v20+), **ffmpeg**, **Google Chrome**, **Python 3.12+** with `pillow`, `numpy`, `scipy`
- **yt-dlp** (`brew install yt-dlp`) — used by the watch skill
- **WhisperX** in a venv at `~/.venvs/whisperx` (only for new transcriptions — existing jobs never re-transcribe). Hinglish jobs run it with `--language hi`; `en` covertly translates.
- **The watch skill's own tools** — run once: `python3 .claude/skills/watch/scripts/setup.py`. It installs ffmpeg/yt-dlp where missing and scaffolds `~/.config/watch/.env` for a Whisper API key (Groq preferred). The review loop is mandatory (CLAUDE.md), so this is not optional.

## 2. Per-machine engines — pick what this machine has

Engines are a property of the machine, not the repo (see CLAUDE.md standing
rules). Both variants must produce the same look; `brand.md` + the style file
are the authority, not the engine.

**Motion graphics — one of:**

- **Remotion** (preferred): `npm install` inside `projects/<job>/graphics-build/remotion/`,
  render with `npx remotion render src/index.ts FullVideo out.mp4`, tweak layers
  live with `npx remotion studio`. Let Remotion use its own headless shell —
  passing `--browser-executable` for system Chrome fails.
- **HyperFrames** (fallback where Remotion is not installed): call it as
  `npx hyperframes@0.7.101 …`, never `@latest`. Follow the engine contract in
  the `graphics` skill. The card/overlay generators in `graphics-build/`
  (`gen_brand.py`, `gen_cards2.py`, `gen_v3.py` → headless-Chrome PNGs) and the
  FFmpeg assembler (`assemble.py`, driven by `transcript/cutsheet.json`) are
  engine-independent and work on either machine as-is.

**Generated video — one of:**

- **Higgsfield** — use the **CLI**, not the MCP connector (the connector's OAuth is
  currently broken; see the `ai-broll` skill). Three commands, no key file:
  `npm i -g @higgsfield/cli` (allow its postinstall — it pulls the binary from
  the vendor's own GitHub releases), `higgsfield auth login`, then
  `higgsfield workspace set <id>` from `higgsfield workspace list`. Add the
  companion skills with `npx skills add higgsfield-ai/skills` — they are
  gitignored on purpose, so run this per machine.
- **Kie.ai**, otherwise: create `.env` in the workspace root (deliberately not in
  the repo) containing `KIE_API_KEY=<the key>`. Model strings and the polling
  flow are in the `ai-broll` skill.

Whichever ran gets recorded in the job's `broll/manifest.json`.

**Other optional services — copy `.env.example` to `.env` and fill in only the ones this machine uses:**

- **ElevenLabs** (`ELEVENLABS_API_KEY`) — voiceover / TTS generation, if a job needs it.
- **HeyGen** (`HEYGEN_API_KEY`) — AI avatar / talking-head generation, if a job needs it.
- **Pexels** (`PEXELS_API_KEY`) — free real-footage B-roll (long-form type 8). Free key at pexels.com/api. Note: Python `urllib` gets 403 from their CDN — use `curl` or pass a browser User-Agent.
- Epidemic Sound and Envato are **not** API integrations — they're manual sourcing (licensed music into `projects/<job>/audio/`, stock assets into `projects/<job>/assets/` or `broll/`). No key, no setup step.

Leave a key blank in `.env` if this machine doesn't use that service — `.env.example` is the tracked source of truth for which integrations exist; `.env` itself never leaves the machine.

**GitHub MCP is intentionally per-person, not in `.mcp.json`.** It carries a personal access token tied to one GitHub identity — committing it would leak that credential to the repo (and to GitHub itself, if pushed). Each person connects their own copy of it in Claude Code's own settings (not this repo): `claude mcp add github --transport http https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer <your PAT>"`, or via `/mcp` inside a session. This does not need to match between machines.

## 3. Raw footage and renders

`raw/` and `outputs/` are not in the repo (too heavy). Raw clips live on
Google Drive — re-download into `projects/<job>/raw/` keeping the exact
filename (the cutsheet and assembler reference it by name). Renders are
regenerable: `npx remotion render src/index.ts FullVideo <out.mp4>` from the
job's `graphics-build/remotion/`.

## 3a. Render engineering that this pipeline depends on

Learned on a 16GB machine, 2026-08-16/17 — ignoring these costs hours:

- Serve plate/media image sequences over `http://127.0.0.1:8877` from wherever they live
  (`npx http-server -p 8877 -a 127.0.0.1 -c-1`). Never put multi-GB media inside
  `remotion/public/` — the bundler copies all of `public/` on every invocation.
- Plates are 1080p 8-bit PNG/WebP sequences, not 4K ProRes through
  `OffthreadVideo` (compositor OOMs). Pass `-pix_fmt rgba` to ffmpeg or it
  writes 16-bit PNGs at ~9MB/frame.
- Keep `<Audio>` out of the composition; build the mix with
  `graphics-build/mix_audio.py` and mux it on with ffmpeg afterwards.
- Render long comps in ~5k-frame parts (`--frames=A-B`, skip-if-exists), then
  `ffmpeg -f concat -c copy`. Bounded temp spool, and a failure costs one part.
- Sweep stray `chrome-headless-shell` processes between runs or the next Chrome
  boot times out.

## 4. Claude's memory (optional but recommended)

A snapshot of Claude's long-term memory for this workspace is in
`.claude/memory-snapshot/`. On the new machine, copy its contents to:

```
~/.claude/projects/<encoded-workspace-path>/memory/
```

where `<encoded-workspace-path>` is the absolute path of the cloned
workspace with `/` replaced by `-` (e.g. `-Users-alex-Desktop-video-editor`).
Claude Code creates that folder on first use — copy the files in after.

## 5. Sanity check

Open Claude Code in the workspace root and ask it to read `CLAUDE.md` and
`brand.md`, plus the style for the format you're working in:

- short form → `styles/groww-shorts/style.md`
- long form → `styles/groww-longform/style.md`

That's the whole contract.
