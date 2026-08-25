#!/usr/bin/env bash
# Copy the live auto-memory directory into the repo, so lessons are never
# stranded outside version control.
#
# Claude writes memories to ~/.claude/projects/<slug>/memory/, which is OUTSIDE
# this folder and therefore outside git. Without this, every new lesson lives on
# one disk only until someone remembers to copy it in.
#
# Runs automatically on SessionEnd. Safe to run by hand at any time.
# It only stages files into the working tree — it never commits or pushes.

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SNAP="$REPO/.claude/memory-snapshot"
SLUG="$(printf '%s' "$REPO" | sed 's#/#-#g')"
LIVE="$HOME/.claude/projects/$SLUG/memory"

# No live memory for this project yet — nothing to do.
[ -d "$LIVE" ] || exit 0
mkdir -p "$SNAP"

added=0; updated=0; removed=0

# Live -> snapshot (new and changed files only)
for f in "$LIVE"/*.md; do
  [ -e "$f" ] || continue
  b="$(basename "$f")"
  if [ ! -e "$SNAP/$b" ]; then
    COPYFILE_DISABLE=1 cp -p "$f" "$SNAP/$b" && added=$((added + 1))
  elif ! cmp -s "$f" "$SNAP/$b"; then
    COPYFILE_DISABLE=1 cp -p "$f" "$SNAP/$b" && updated=$((updated + 1))
  fi
done

# Drop snapshot files whose live memory was deleted (a pruned memory is a
# decision, and the repo should reflect it).
for f in "$SNAP"/*.md; do
  [ -e "$f" ] || continue
  b="$(basename "$f")"
  [ -e "$LIVE/$b" ] || { rm -f "$f" && removed=$((removed + 1)); }
done

total=$((added + updated + removed))

# Report only when something actually moved, or when commits are sitting unpushed.
msg=""
[ "$total" -gt 0 ] && msg="Memory synced to repo: ${added} new, ${updated} updated, ${removed} removed."

if git -C "$REPO" rev-parse --git-dir >/dev/null 2>&1; then
  ahead="$(git -C "$REPO" rev-list --count @{u}..HEAD 2>/dev/null || echo 0)"
  dirty="$(git -C "$REPO" status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  if [ "${ahead:-0}" -gt 0 ] || [ "${dirty:-0}" -gt 0 ]; then
    msg="${msg:+$msg }Not on GitHub yet: ${dirty} uncommitted file(s), ${ahead} unpushed commit(s). Run: git add -A && git commit -m \"...\" && git push"
  fi
fi

[ -n "$msg" ] && printf '{"systemMessage": %s}\n' "$(printf '%s' "$msg" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
exit 0
