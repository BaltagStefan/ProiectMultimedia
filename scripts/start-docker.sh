#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command docker "Instaleaza Docker Engine si pluginul Docker Compose."

COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.yml"

info "Pornesc PostgreSQL, MinIO, Keycloak si Nginx..."
docker compose -f "$COMPOSE_FILE" up -d --wait --wait-timeout 180 \
  postgres minio keycloak nginx

info "Initializez bucket-ul MinIO..."
docker compose -f "$COMPOSE_FILE" rm -f minio-init >/dev/null 2>&1 || true
docker compose -f "$COMPOSE_FILE" run --rm --no-deps -T minio-init

success "Infrastructura pornita."
printf '%s\n' \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001" \
  "Frontend Nginx: http://localhost" \
  "PostgreSQL: localhost:5432"
