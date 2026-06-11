#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info() {
  printf '\033[1;36m[AutoAssist]\033[0m %s\n' "$*"
}

success() {
  printf '\033[1;32m[AutoAssist]\033[0m %s\n' "$*"
}

fail() {
  printf '\033[1;31m[AutoAssist]\033[0m %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Lipsește comanda '$1'. $2"
}

