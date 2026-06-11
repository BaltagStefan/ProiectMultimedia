#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"
require_command java "Instalează OpenJDK 21."
require_command mvn "Instalează Maven 3.9+."
info "Compilez microserviciile..."
mvn -f "$ROOT_DIR/backend/pom.xml" clean package -DskipTests
success "Backend compilat."

