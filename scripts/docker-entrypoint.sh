#!/bin/sh
# Runs every time the app container starts.
set -e

MIGRATIONS_DIR=/app/src/migrations

# Very first start: no migration files yet, so create the initial one from the
# collection definitions. src/migrations is mounted from the host (see
# docker-compose.yml), so the generated file is kept and can be committed to git.
if ! ls "$MIGRATIONS_DIR"/*.ts 2>/dev/null | grep -v '/index.ts$' >/dev/null; then
  echo "[startup] No database migrations found: creating the initial migration…"
  npx payload migrate:create initial
fi

echo "[startup] Applying database migrations…"
npx payload migrate

echo "[startup] Starting website on port ${PORT:-3000}"
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
