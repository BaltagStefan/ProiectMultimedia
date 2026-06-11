#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command pm2 "Ruleaza npm install -g pm2."
require_command node "Instaleaza Node.js."
require_command curl "Instaleaza curl."
mkdir -p "$ROOT_DIR/logs/pm2"

info "Opresc procesele AutoAssist vechi pentru a incarca JAR-urile reconstruite."
mapfile -t AUTOASSIST_PROCESSES < <(
  pm2 jlist 2>/dev/null |
    node -e '
      let data = "";
      process.stdin.on("data", chunk => data += chunk);
      process.stdin.on("end", () => {
        try {
          for (const app of JSON.parse(data)) {
            if (String(app.name || "").startsWith("autoassist-")) console.log(app.name);
          }
        } catch {}
      });
    ' || true
)
if (( ${#AUTOASSIST_PROCESSES[@]} > 0 )); then
  pm2 delete "${AUTOASSIST_PROCESSES[@]}" >/dev/null
fi

info "Pornesc serviciul de profil pentru aplicarea migrarilor Flyway."
pm2 start "$ROOT_DIR/pm2/ecosystem.config.js" \
  --only autoassist-auth-profile-service \
  --update-env

MIGRATION_READY=0
for _ in {1..60}; do
  if curl -fsS "http://localhost:8091/actuator/health" >/dev/null 2>&1; then
    MIGRATION_READY=1
    break
  fi
  sleep 2
done
if [[ "$MIGRATION_READY" -ne 1 ]]; then
  pm2 logs autoassist-auth-profile-service --lines 100 --nostream || true
  fail "Migrarile bazei de date nu au fost aplicate."
fi

info "Pornesc toate microserviciile cu JAR-urile noi."
pm2 start "$ROOT_DIR/pm2/ecosystem.config.js" --update-env

BACKEND_READY=0
for _ in {1..60}; do
  if curl -fsS "http://localhost:8088/actuator/health" >/dev/null 2>&1 &&
     curl -fsS "http://localhost:8095/actuator/health" >/dev/null 2>&1 &&
     curl -fsS "http://localhost:8096/actuator/health" >/dev/null 2>&1 &&
     curl -fsS "http://localhost:8098/actuator/health" >/dev/null 2>&1; then
    BACKEND_READY=1
    break
  fi
  sleep 2
done
if [[ "$BACKEND_READY" -ne 1 ]]; then
  pm2 status
  pm2 logs --lines 120 --nostream || true
  fail "Unul sau mai multe microservicii backend nu au pornit corect."
fi

pm2 save
pm2 status
