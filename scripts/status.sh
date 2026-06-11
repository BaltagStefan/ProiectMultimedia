#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
docker ps --filter "name=autoassist"
if command -v pm2 >/dev/null 2>&1; then
  pm2 status
fi
printf '%s\n' \
  "Frontend: http://localhost" \
  "API Gateway: http://localhost:8088" \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001"

