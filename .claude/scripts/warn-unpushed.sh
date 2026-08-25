#!/usr/bin/env bash
# Warn when work is sitting on this disk and not on GitHub.
#
# Nothing reaches the remote on its own: git needs add + commit + push, every
# time. This runs on SessionEnd purely as a reminder — it changes nothing.
#
# NOTE: there is deliberately no memory-copying here. Claude's memory now lives
# IN this repo (autoMemoryDirectory -> .claude/memory-snapshot), so memories are
# already tracked the moment they are written. An older version of this script
# mirrored an external directory in; under the current setup that logic would
# have pruned live memories, so it was removed rather than left dormant.

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
git -C "$REPO" rev-parse --git-dir >/dev/null 2>&1 || exit 0

dirty="$(git -C "$REPO" status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
ahead="$(git -C "$REPO" rev-list --count @{u}..HEAD 2>/dev/null || echo 0)"
branch="$(git -C "$REPO" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"

[ "${dirty:-0}" -eq 0 ] && [ "${ahead:-0}" -eq 0 ] && exit 0

msg="Not on GitHub yet (branch ${branch}): ${dirty} uncommitted file(s), ${ahead} unpushed commit(s)."
msg="$msg  Run: git add -A && git commit -m \"...\" && git push"
[ "$branch" != "main" ] && msg="$msg  (You are on ${branch}, not main.)"

printf '{"systemMessage": %s}\n' \
  "$(printf '%s' "$msg" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
exit 0
