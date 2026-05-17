#!/bin/bash
# Nightly SQLite optimize: refreshes query planner stats so growing tables
# (analytics_pageviews especially) keep picking the right indexes.
# Run via systemd user timer alodev-sqlite-optimize.timer.
set -euo pipefail
DB="/home/claude/104/projects/alodev/server/data/alodev.db"
sqlite3 "$DB" "PRAGMA analysis_limit=1000; PRAGMA optimize;"
