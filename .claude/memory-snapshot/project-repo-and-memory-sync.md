---
name: project-repo-and-memory-sync
description: Workspace lives in the private video-editor-workspace repo; memories auto-sync into it on session end
metadata:
  type: project
---

As of 2026-08-25 this workspace pushes to **`amudhanezhil21-collab/video-editor-workspace` (private)**, started as a fresh single commit — it does NOT carry the old 17-commit history. The superseded public `video-editor` repo and the empty `claudeskills` repo are the user's to delete; a stale `old-origin` remote and local `old-main-history` / `longform-framework` branches may still point at repos that no longer exist. Deleting repos is the user's action, never Claude's.

**Memories now sync themselves.** `.claude/scripts/sync-memory.sh` runs on SessionEnd and mirrors the live auto-memory dir into `.claude/memory-snapshot/`, pruning deletions. Do NOT hand-copy memory files into the repo — the hook covers it. The script only touches the working tree; `git add -A && git commit && git push` is still a deliberate step, and the hook prints a warning when commits sit unpushed.

**Why:** the live memory dir lives at `~/.claude/projects/<slug>/memory/`, outside the folder and outside git, so every lesson was one disk failure from gone. The same trap already stranded 1,395 lines of skill work on an unpushed branch.

**How to apply:** before a session ends, commit and push — nothing reaches GitHub on its own. Excluded from the repo by design: `raw/`, `outputs/`, `node_modules/` and `.env`. See [[feedback-lessons-into-skills]].
