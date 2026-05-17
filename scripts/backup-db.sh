#!/bin/bash
# Backup alodev.db every 4 hours, keep last 30 days.
# Uses sqlite3 .backup to ensure consistency with WAL mode.
# Sends Telegram alert on failure (silent on success — log file is enough).

set -euo pipefail

DB="/home/claude/104/projects/alodev/server/data/alodev.db"
BACKUP_DIR="/home/claude/104/projects/alodev/server/data/backups"
RETENTION_HOURS=720  # 30 days * 24h
ENV_FILE="/home/claude/104/projects/alodev/server/.env"

notify_fail() {
  local msg="$1"
  # Best-effort: load Telegram creds from server/.env if present.
  local token chat
  token=$(grep -E '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  chat=$(grep -E '^TELEGRAM_CHAT_ID=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
  if [ -n "$token" ] && [ -n "$chat" ]; then
    curl -s -o /dev/null --max-time 5 \
      -X POST "https://api.telegram.org/bot${token}/sendMessage" \
      -H "Content-Type: application/json" \
      --data "$(printf '{"chat_id":"%s","text":"⚠️ alodev backup FAILED: %s","disable_web_page_preview":true}' "$chat" "$msg")" || true
  fi
}

trap 'rc=$?; notify_fail "exit=$rc line=$LINENO step=$BASH_COMMAND"; exit $rc' ERR

mkdir -p "$BACKUP_DIR"

TS=$(date -u +%Y-%m-%dT%H-%M-%SZ)
DEST="$BACKUP_DIR/alodev-${TS}.db"

sqlite3 "$DB" ".backup '$DEST'"
gzip "$DEST"

# Sanity check: backup must be non-empty.
if [ ! -s "${DEST}.gz" ]; then
  notify_fail "backup file empty: ${DEST}.gz"
  exit 2
fi

# Prune older than retention.
find "$BACKUP_DIR" -name "alodev-*.db.gz" -type f -mmin +$((RETENTION_HOURS * 60)) -delete

echo "$(date -u +%FT%TZ) backup ok: ${DEST}.gz ($(du -h "${DEST}.gz" | cut -f1))" >> "$BACKUP_DIR/backup.log"

tail -200 "$BACKUP_DIR/backup.log" > "$BACKUP_DIR/backup.log.tmp" && mv "$BACKUP_DIR/backup.log.tmp" "$BACKUP_DIR/backup.log"
