#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

"$ROOT_DIR/scripts/create-env.sh"

info "Pasul 1/6: pornesc infrastructura Docker."
"$ROOT_DIR/scripts/start-docker.sh"

info "Pasul 2/6: aplic migrarile functionale."
"$ROOT_DIR/scripts/migrate-workflows.sh"

info "Pasul 3/6: compilez frontend-ul."
"$ROOT_DIR/scripts/build-frontend.sh"

info "Pasul 4/6: public frontend-ul in Nginx."
"$ROOT_DIR/scripts/deploy-frontend-nginx.sh"

info "Pasul 5/6: compilez backend-ul."
"$ROOT_DIR/scripts/build-backend.sh"

info "Pasul 6/6: pornesc microserviciile cu PM2."
"$ROOT_DIR/scripts/start-backend-pm2.sh"

printf '\n%s\n' \
  "AutoAssist 3D este pornit:" \
  "Frontend: http://localhost" \
  "API Gateway: http://localhost:8088" \
  "Keycloak: http://localhost:8080" \
  "MinIO Console: http://localhost:9001" \
  "PM2 status: pm2 status" \
  "Cont USER: user / user" \
  "Cont MECHANIC: mecanic / mecanic"
