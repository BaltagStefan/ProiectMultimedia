#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command docker "Instaleaza Docker Engine si pluginul Docker Compose."

COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.yml"
NGINX_HTML_DIR="$ROOT_DIR/runtime/nginx/html"

prepare_nginx_placeholder() {
  mkdir -p "$NGINX_HTML_DIR"
  if [[ -f "$NGINX_HTML_DIR/index.html" ]]; then
    return
  fi

  info "Pregatesc pagina temporara Nginx..."
  printf '%s\n' \
    '<!doctype html>' \
    '<html lang="ro">' \
    '<head>' \
    '  <meta charset="utf-8">' \
    '  <meta name="viewport" content="width=device-width,initial-scale=1">' \
    '  <meta http-equiv="refresh" content="10">' \
    '  <title>AutoAssist 3D - Pornire</title>' \
    '  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#020617;color:#e5e7eb;font:16px system-ui}.card{padding:40px;border:1px solid #1e3a5f;border-radius:20px;background:#0f172ab8;text-align:center;box-shadow:0 25px 80px #0008}h1{color:#38bdf8}p{color:#94a3b8}</style>' \
    '</head>' \
    '<body><main class="card"><h1>AutoAssist 3D porneste</h1><p>Frontend-ul este in curs de compilare. Pagina se reincarca automat.</p></main></body>' \
    '</html>' \
    > "$NGINX_HTML_DIR/index.html"
  chmod -R a+rX "$NGINX_HTML_DIR"
}

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

prepare_nginx_placeholder

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
