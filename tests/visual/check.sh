#!/usr/bin/env bash
# Capture the working tree and diff it against the baseline, in one command.
#
#   ./check.sh
#
# Assumes ./baseline.sh has run at least once in this checkout.
set -euo pipefail

PORT="${PORT:-1415}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"

if [[ ! -d "$HERE/baseline" ]]; then
  echo "no baseline yet — run ./baseline.sh first" >&2
  exit 2
fi
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "port $PORT is already in use" >&2
  exit 1
fi

cleanup() { [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

(cd "$REPO" && hugo server --bind 127.0.0.1 --port "$PORT" --renderToMemory >/tmp/hugo-check.log 2>&1) &
SERVER_PID=$!

for _ in $(seq 1 40); do
  kill -0 "$SERVER_PID" 2>/dev/null || { echo "hugo server exited:"; cat /tmp/hugo-check.log; exit 1; }
  curl -fsS -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 0.5
done

rm -rf "$HERE/current" "$HERE/diff"
node "$HERE/capture.mjs" --out "$HERE/current" --base "http://127.0.0.1:$PORT"
node "$HERE/compare.mjs" --baseline "$HERE/baseline" --current "$HERE/current" --out "$HERE/diff"
