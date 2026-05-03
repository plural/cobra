#!/bin/sh

set -e
set -u

RESTORE_FILE=$1

# Make a database backup created by backup.sh

gunzip "$RESTORE_FILE" -c | docker compose exec -T db \
    psql -U postgres

