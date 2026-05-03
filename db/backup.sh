#!/bin/sh

set -e
set -u

OUT_DIR=$1

# Make a database backup in the specified $OUT_DIR

docker compose \
  exec db pg_dumpall -c -U postgres \
  | gzip -9 \
  > "${OUT_DIR}"/cobra-db-dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
