#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

missing=0
for cmd in java mvn node npm docker; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    printf 'Lipsește: %s\n' "$cmd" >&2
    missing=1
  fi
done

if ! docker compose version >/dev/null 2>&1; then
  printf 'Lipsește: Docker Compose v2 (docker compose)\n' >&2
  missing=1
fi

if command -v java >/dev/null 2>&1; then
  java_version="$(java -version 2>&1 | awk -F '[".]' '/version/ {print $2; exit}')"
  [[ "$java_version" == "21" ]] || {
    printf 'Este necesar Java 21; versiunea detectată este %s.\n' "$java_version" >&2
    missing=1
  }
fi

[[ "$missing" -eq 0 ]] || fail "Instalează cerințele lipsă pe Linux și rulează din nou scripts/install.sh."

if ! command -v pm2 >/dev/null 2>&1; then
  info "Instalez PM2 global..."
  npm install -g pm2
fi

"$ROOT_DIR/scripts/create-env.sh"
mkdir -p "$ROOT_DIR/runtime/nginx/html" "$ROOT_DIR/logs/pm2"

info "Instalez dependențele frontend..."
npm --prefix "$ROOT_DIR/frontend" install

success "Instalare finalizată. Pornește aplicația cu ./scripts/start-all.sh"

