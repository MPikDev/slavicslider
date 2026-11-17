#!/usr/bin/env bash
# Restore a backup made by backup.sh.
#   scripts/restore.sh backups/db_2026-10-20_0315.dump backups/media_2026-10-20_0315.tar.gz
# WARNING: replaces the current database contents and uploaded photos.
set -euo pipefail

DB_DUMP="${1:?Usage: restore.sh <db_xxx.dump> [media_xxx.tar.gz]}"
MEDIA_TAR="${2:-}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

read -r -p "This will REPLACE the live database${MEDIA_TAR:+ and photos}. Type 'restore' to continue: " ok
[ "$ok" = "restore" ] || { echo "Cancelled."; exit 1; }

docker compose stop app
docker compose exec -T db pg_restore -U slavic -d slavicsliders --clean --if-exists < "$DB_DUMP"

if [ -n "$MEDIA_TAR" ]; then
  rm -rf data/media
  tar -xzf "$MEDIA_TAR" -C data
fi

docker compose start app
echo "Restore complete."
