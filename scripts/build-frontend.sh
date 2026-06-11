#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command npm "Instaleaza Node.js 20+ si npm."

if [[ ! -d "$ROOT_DIR/frontend/node_modules" ]]; then
  info "Instalez dependentele frontend..."
  if [[ -f "$ROOT_DIR/frontend/package-lock.json" ]]; then
    npm --prefix "$ROOT_DIR/frontend" ci
  else
    npm --prefix "$ROOT_DIR/frontend" install
  fi
fi

if [[ -f "$ROOT_DIR/config/env/frontend/frontend.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/config/env/frontend/frontend.env"
  set +a
fi

info "Compilez frontend-ul..."
npm --prefix "$ROOT_DIR/frontend" run build

[[ -f "$ROOT_DIR/frontend/dist/index.html" ]] \
  || fail "Build-ul frontend nu a generat frontend/dist/index.html."
success "Frontend compilat."
