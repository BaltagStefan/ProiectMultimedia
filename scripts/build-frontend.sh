#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
require_command npm "Instalează Node.js 20+ și npm."
if [[ ! -d "$ROOT_DIR/frontend/node_modules" ]]; then
  npm --prefix "$ROOT_DIR/frontend" install
fi
if [[ -f "$ROOT_DIR/config/env/frontend/frontend.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/config/env/frontend/frontend.env"
  set +a
fi
npm --prefix "$ROOT_DIR/frontend" run build
success "Frontend compilat."
