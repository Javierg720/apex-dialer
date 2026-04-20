#!/usr/bin/env bash
# Run Alembic migrations inside the backend container.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

cmd="${1:-upgrade}"
target="${2:-head}"

case "$cmd" in
  upgrade|downgrade|current|history|heads|show|stamp)
    docker compose run --rm backend alembic "$cmd" "$target"
    ;;
  revision)
    shift
    docker compose run --rm backend alembic revision --autogenerate -m "$*"
    ;;
  *)
    echo "usage: $0 {upgrade|downgrade|current|history|stamp|revision} [target|message]" >&2
    exit 2
    ;;
esac
