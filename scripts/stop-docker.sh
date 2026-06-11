#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
docker compose -f "$ROOT_DIR/docker/docker-compose.yml" down

