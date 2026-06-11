#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command docker "Instaleaza Docker Engine si pluginul Docker Compose."

COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.yml"

wait_for_healthy() {
  local container="$1"
  local timeout="${2:-180}"
  local elapsed=0
  local status=""

  while (( elapsed < timeout )); do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container" 2>/dev/null || true)"
    case "$status" in
      healthy|running)
        success "$container este $status."
        return 0
        ;;
      unhealthy|exited|dead)
        docker logs --tail 80 "$container" 2>/dev/null || true
        fail "$container are statusul $status."
        ;;
    esac
    sleep 3
    elapsed=$((elapsed + 3))
  done

  docker logs --tail 80 "$container" 2>/dev/null || true
  fail "Timeout: $container nu a devenit healthy in ${timeout} secunde."
}

info "Pornesc PostgreSQL, MinIO, Keycloak si Nginx..."
docker compose -f "$COMPOSE_FILE" up -d \
  postgres minio keycloak nginx

info "Astept healthcheck-urile infrastructurii..."
wait_for_healthy autoassist-postgres
wait_for_healthy autoassist-minio
wait_for_healthy autoassist-keycloak
wait_for_healthy autoassist-nginx

info "Initializez bucket-ul MinIO..."
docker compose -f "$COMPOSE_FILE" rm -f minio-init >/dev/null 2>&1 || true
docker compose -f "$COMPOSE_FILE" --profile init run --rm --no-deps -T minio-init

success "Infrastructura pornita."
printf '%s\n' \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001" \
  "Frontend Nginx: http://localhost" \
  "PostgreSQL: localhost:5432"
