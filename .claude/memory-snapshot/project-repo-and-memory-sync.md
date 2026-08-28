---
name: project-repo-and-memory-sync
description: Workspace lives in the PUBLIC video-editor-workspace repo; memory lives in-repo via autoMemoryDirectory, pushed over SSH
metadata:
  type: project
---

This workspace pushes to **`amudhanezhil21-collab/video-editor-workspace`, which is PUBLIC** (verified via the GitHub API on 2026-08-28 — `"private": false`). Anyone with the link can read and clone it, no invite needed, and every commit is world-readable: `brand.md`, the styles, transcripts and job folders included. Never commit a key, a client name or anything unpublishable. The repo started as a fresh single commit and does NOT carry the old 17-commit history; the superseded public `video-editor` repo and the empty `claudeskills` repo are the user's to delete — deleting repos is never Claude's action.

**Memory is not mirrored by a script any more.** `autoMemoryDirectory` in each machine's **user** settings (`~/.claude/settings.json`) points straight at `.claude/memory-snapshot/`, so Claude reads and writes memory inside the repo. The old `.claude/scripts/sync-memory.sh` was deleted in commit `c48f859` — under this layout it would prune live memories. The surviving SessionEnd hook (`warn-unpushed.sh`) only warns about uncommitted or unpushed work.

**Push auth is SSH, not HTTPS.** `~/.ssh/id_ed25519_github` authenticates as `amudhanezhil21-collab`; the remote must be `git@github.com:...`, because there are no HTTPS credentials in the keychain and an HTTPS remote fails with "could not read Username". Note the GitHub MCP connector is signed in as a **different** account, `ezhilam`, which has pull-only access here — it cannot push and cannot change repo settings.

**Why:** the live memory dir used to sit at `~/.claude/projects/<slug>/memory/`, outside the folder and outside git, so every lesson was one disk failure from gone and machine B still read its own local copy. The same trap already stranded 1,395 lines of skill work on an unpushed branch.

**How to apply:** `git pull` at the start of a session, `git add -A && git commit -m "..." && git push` before it ends — nothing reaches GitHub on its own. On a new machine set `autoMemoryDirectory` to that machine's own absolute path. Excluded from the repo by design: `raw/`, `outputs/`, `node_modules/` and `.env`. See [[feedback-lessons-into-skills]].
