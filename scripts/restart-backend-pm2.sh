#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
"$ROOT_DIR/scripts/stop-backend-pm2.sh"
"$ROOT_DIR/scripts/start-backend-pm2.sh"

