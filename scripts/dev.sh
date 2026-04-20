#!/usr/bin/env bash
# Start the stack with dev overrides (hot reload, exposed ports).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

if [[ ! -f .env ]]; then
  echo "→ no .env found; copying .env.template"
  cp .env.template .env
fi

exec docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build "$@"
