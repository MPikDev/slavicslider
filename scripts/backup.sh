#!/usr/bin/env bash
# Nightly backup: database dump + uploaded photos. Keeps the newest 14 of each.
#
# Run from anywhere:   /path/to/slavicslider/scripts/backup.sh
# Cron example (every night at 3:15am), add with `crontab -e`:
#   15 3 * * * /home/you/slavicslider/scripts/backup.sh >> /home/you/slavicslider/backups/backup.log 2>&1
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
KEEP="${KEEP:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"

mkdir -p "$BACKUP_DIR"
cd "$PROJECT_DIR"

echo "[$(date)] Starting backup"

# 1) Database (compressed custom-format dump, restorable with pg_restore)
docker compose exec -T db pg_dump -U slavic -d slavicsliders -Fc > "$BACKUP_DIR/db_$STAMP.dump"

# 2) Uploaded photos
tar -czf "$BACKUP_DIR/media_$STAMP.tar.gz" -C "$PROJECT_DIR/data" media

# 3) Keep only the newest $KEEP of each
ls -1t "$BACKUP_DIR"/db_*.dump 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm --
ls -1t "$BACKUP_DIR"/media_*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm --

echo "[$(date)] Backup done: db_$STAMP.dump, media_$STAMP.tar.gz"
