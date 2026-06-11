#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

DIST_DIR="$ROOT_DIR/frontend/dist"
NGINX_HTML_DIR="$ROOT_DIR/runtime/nginx/html"

[[ -f "$DIST_DIR/index.html" ]] \
  || fail "Lipseste frontend/dist/index.html. Ruleaza build-frontend.sh."

mkdir -p "$NGINX_HTML_DIR"
find "$NGINX_HTML_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a "$DIST_DIR/." "$NGINX_HTML_DIR/"
chmod -R a+rX "$NGINX_HTML_DIR"

[[ -r "$NGINX_HTML_DIR/index.html" ]] \
  || fail "Deploy esuat: runtime/nginx/html/index.html nu poate fi citit."

if docker ps --format '{{.Names}}' | grep -Fxq autoassist-nginx; then
  docker exec autoassist-nginx nginx -s reload
fi

success "Frontend publicat la http://localhost"

