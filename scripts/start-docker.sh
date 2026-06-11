#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
require_command docker "Instalează Docker Engine și pluginul Docker Compose."
docker compose -f "$ROOT_DIR/docker/docker-compose.yml" up -d --wait --wait-timeout 180
success "Infrastructură pornită."
printf '%s\n' \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001" \
  "Frontend Nginx: http://localhost" \
  "PostgreSQL: localhost:5432"
