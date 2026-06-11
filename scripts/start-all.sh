#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

"$ROOT_DIR/scripts/create-env.sh"
"$ROOT_DIR/scripts/start-docker.sh"
"$ROOT_DIR/scripts/build-backend.sh"
"$ROOT_DIR/scripts/start-backend-pm2.sh"
"$ROOT_DIR/scripts/build-frontend.sh"
"$ROOT_DIR/scripts/deploy-frontend-nginx.sh"

printf '\n%s\n' \
  "AutoAssist 3D este pornit:" \
  "Frontend: http://localhost" \
  "API Gateway: http://localhost:8088" \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001" \
  "PM2 status: pm2 status" \
  "Cont USER: user / user" \
  "Cont MECHANIC: mecanic / mecanic"

