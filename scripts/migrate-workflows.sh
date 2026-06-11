#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command docker "Instaleaza Docker Engine."

MIGRATION_FILE="$ROOT_DIR/backend/common-lib/src/main/resources/db/migration/V3__functional_workflows_and_notifications.sql"
[[ -f "$MIGRATION_FILE" ]] || fail "Lipseste migrarea workflow-urilor."

info "Aplic schema pentru chat, notificari, programari si asistenta."
docker exec -i autoassist-postgres \
  psql -v ON_ERROR_STOP=1 -U autoassist -d autoassist \
  < "$MIGRATION_FILE"

success "Schema workflow-urilor este actualizata."
