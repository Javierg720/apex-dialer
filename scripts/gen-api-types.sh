#!/usr/bin/env bash
# Regenerate packages/api-types/index.d.ts from the backend's OpenAPI doc.
# Phase 0: stub. Real implementation lands in Phase 1 when the backend has endpoints.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

OUT="packages/api-types/index.d.ts"
SCHEMA_URL="${OPENAPI_URL:-http://localhost/api/openapi.json}"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found — install Node.js 20+ first." >&2
  exit 1
fi

echo "→ fetching OpenAPI schema from $SCHEMA_URL"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
curl -fsS "$SCHEMA_URL" -o "$tmp"

echo "→ generating $OUT"
npx --yes openapi-typescript@^7 "$tmp" -o "$OUT"

if command -v prettier >/dev/null 2>&1; then
  npx --yes prettier --write "$OUT"
fi

echo "✓ done. commit $OUT if it changed."
