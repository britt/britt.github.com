#!/usr/bin/env bash
# Capture the visual baseline from a git ref — master by default.
#
#   ./baseline.sh              # baseline from origin/master
#   ./baseline.sh my-branch    # baseline from something else
#
# The baseline has to come from a ref, not from the working tree: once the
# redesign lands there is no way to recover the "before", and a baseline taken
# from a half-migrated tree is worse than none.
set -euo pipefail

REF="${1:-origin/master}"
PORT="${PORT:-1414}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
WORKTREE="$(mktemp -d)/baseline-src"

cleanup() {
  [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true
  git -C "$REPO" worktree remove --force "$WORKTREE" 2>/dev/null || true
}
trap cleanup EXIT

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "port $PORT is already in use — a stale hugo server there would be served instead of $REF" >&2
  exit 1
fi

echo "checking out $REF into a detached worktree"
git -C "$REPO" worktree add --detach "$WORKTREE" "$REF" >/dev/null

echo "serving $REF on :$PORT"
(cd "$WORKTREE" && hugo server --bind 127.0.0.1 --port "$PORT" --renderToMemory >/tmp/hugo-baseline.log 2>&1) &
SERVER_PID=$!

for _ in $(seq 1 40); do
  kill -0 "$SERVER_PID" 2>/dev/null || { echo "hugo server exited:"; cat /tmp/hugo-baseline.log; exit 1; }
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then break; fi
  sleep 0.5
done
curl -fsS -o /dev/null "http://127.0.0.1:$PORT/" || { echo "hugo server never came up:"; cat /tmp/hugo-baseline.log; exit 1; }

node "$HERE/capture.mjs" --out "$HERE/baseline" --base "http://127.0.0.1:$PORT"
git -C "$REPO" rev-parse "$REF" > "$HERE/baseline/REF"
echo "baseline captured from $REF ($(git -C "$REPO" rev-parse --short "$REF"))"
