#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

while IFS= read -r -d '' example; do
  target="${example%.example}"
  if [[ -f "$target" ]]; then
    info "Păstrez configurația existentă: ${target#"$ROOT_DIR"/}"
  else
    cp "$example" "$target"
    success "Creat: ${target#"$ROOT_DIR"/}"
  fi
done < <(find "$ROOT_DIR/config/env" -type f -name '*.env.example' -print0)

