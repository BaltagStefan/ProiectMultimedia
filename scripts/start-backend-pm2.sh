#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
require_command pm2 "Rulează npm install -g pm2."
mkdir -p "$ROOT_DIR/logs/pm2"
pm2 start "$ROOT_DIR/pm2/ecosystem.config.js" --update-env
pm2 save
pm2 status

