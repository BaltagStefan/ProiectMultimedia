#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
[[ -d "$ROOT_DIR/frontend/dist" ]] || fail "Lipsește frontend/dist. Rulează build-frontend.sh."
mkdir -p "$ROOT_DIR/runtime/nginx/html"
find "$ROOT_DIR/runtime/nginx/html" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a "$ROOT_DIR/frontend/dist/." "$ROOT_DIR/runtime/nginx/html/"
success "Frontend publicat la http://localhost"

