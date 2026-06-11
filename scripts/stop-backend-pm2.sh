#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete "$ROOT_DIR/pm2/ecosystem.config.js" || true
fi

