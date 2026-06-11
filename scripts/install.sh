#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

readonly MAVEN_VERSION="3.9.16"
readonly NODE_MAJOR="24"

if [[ ! -r /etc/os-release ]]; then
  fail "Nu pot identifica distributia Linux. Instalarea automata este suportata pe Ubuntu."
fi

# shellcheck disable=SC1091
source /etc/os-release
if [[ "${ID:-}" != "ubuntu" ]]; then
  fail "Distributie nesuportata: ${PRETTY_NAME:-necunoscuta}. Ruleaza acest script pe Ubuntu."
fi

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
  TARGET_USER="${SUDO_USER:-root}"
else
  require_command sudo "Instaleaza sudo sau ruleaza scriptul ca root."
  sudo -v
  SUDO=(sudo)
  TARGET_USER="$(id -un)"
fi

UBUNTU_CODENAME="${VERSION_CODENAME:-}"
if [[ -z "$UBUNTU_CODENAME" ]]; then
  UBUNTU_CODENAME="$(lsb_release -cs 2>/dev/null || true)"
fi
[[ -n "$UBUNTU_CODENAME" ]] || fail "Nu pot determina versiunea Ubuntu."

run_root() {
  "${SUDO[@]}" "$@"
}

apt_update() {
  info "Actualizez indexul APT..."
  run_root apt-get update
}

apt_install() {
  run_root env DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"
}

version_at_least() {
  local current="$1"
  local required="$2"
  [[ "$(printf '%s\n' "$required" "$current" | sort -V | head -n 1)" == "$required" ]]
}

java_major() {
  java -version 2>&1 | sed -n 's/.*version "\([0-9][0-9]*\).*/\1/p' | head -n 1
}

activate_java_environment() {
  local resolved_java
  resolved_java="$(readlink -f "$(command -v java)")"
  export JAVA_HOME
  JAVA_HOME="$(dirname "$(dirname "$resolved_java")")"
  export PATH="${JAVA_HOME}/bin:${PATH}"
}

maven_version() {
  mvn --version 2>/dev/null | awk '/Apache Maven/ {print $3; exit}'
}

node_major() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f1
}

install_base_packages() {
  apt_update
  apt_install ca-certificates curl gnupg tar gzip lsb-release
}

install_java() {
  if command -v java >/dev/null 2>&1 && [[ "$(java_major)" == "21" ]]; then
    activate_java_environment
    success "Java 21 este deja instalat."
    return
  fi

  info "Instalez Java 21..."
  if apt-cache show openjdk-21-jdk >/dev/null 2>&1; then
    apt_install openjdk-21-jdk
  else
    info "Pachetul Ubuntu nu este disponibil; configurez Eclipse Temurin."
    run_root install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public \
      | gpg --dearmor \
      | run_root tee /etc/apt/keyrings/adoptium.gpg >/dev/null
    printf 'deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb %s main\n' \
      "$UBUNTU_CODENAME" \
      | run_root tee /etc/apt/sources.list.d/adoptium.list >/dev/null
    apt_update
    apt_install temurin-21-jdk
  fi

  local java21
  java21="$(update-alternatives --list java 2>/dev/null | grep -E '/(java-21|temurin-21)[^/]*/bin/java$' | head -n 1 || true)"
  if [[ -n "$java21" ]]; then
    run_root update-alternatives --set java "$java21"
  fi
  local javac21
  javac21="$(update-alternatives --list javac 2>/dev/null | grep -E '/(java-21|temurin-21)[^/]*/bin/javac$' | head -n 1 || true)"
  if [[ -n "$javac21" ]]; then
    run_root update-alternatives --set javac "$javac21"
  fi

  [[ "$(java_major)" == "21" ]] || fail "Java 21 a fost instalat, dar nu este versiunea activa."
  activate_java_environment
  success "Java $(java_major) instalat."
}

install_maven() {
  local current=""
  if command -v mvn >/dev/null 2>&1; then
    current="$(maven_version)"
  fi
  if [[ -n "$current" ]] && version_at_least "$current" "3.9.0"; then
    success "Maven $current este deja instalat."
    return
  fi

  info "Instalez Apache Maven $MAVEN_VERSION..."
  local temp_dir archive checksum install_dir
  temp_dir="$(mktemp -d)"
  archive="apache-maven-${MAVEN_VERSION}-bin.tar.gz"
  checksum="${archive}.sha512"
  install_dir="/opt/apache-maven-${MAVEN_VERSION}"

  local maven_base
  maven_base="https://dlcdn.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries"
  if ! curl -fsSL "${maven_base}/${archive}" -o "${temp_dir}/${archive}"; then
    info "Versiunea nu mai este pe mirror-ul curent; folosesc arhiva Apache."
    maven_base="https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries"
    curl -fsSL "${maven_base}/${archive}" -o "${temp_dir}/${archive}"
  fi
  curl -fsSL "${maven_base}/${checksum}" -o "${temp_dir}/${checksum}"
  local expected_sha actual_sha
  expected_sha="$(awk '{print $1}' "${temp_dir}/${checksum}")"
  actual_sha="$(sha512sum "${temp_dir}/${archive}" | awk '{print $1}')"
  [[ "$actual_sha" == "$expected_sha" ]] || {
    rm -rf "$temp_dir"
    fail "Verificarea SHA-512 pentru arhiva Maven a esuat."
  }

  if [[ ! -d "$install_dir" ]]; then
    run_root tar -xzf "${temp_dir}/${archive}" -C /opt
  fi
  run_root ln -sfn "${install_dir}/bin/mvn" /usr/local/bin/mvn
  rm -rf "$temp_dir"

  current="$(maven_version)"
  version_at_least "$current" "3.9.0" || fail "Maven 3.9+ nu a fost instalat corect."
  success "Maven $current instalat."
}

install_node() {
  local current_major=""
  if command -v node >/dev/null 2>&1; then
    current_major="$(node_major)"
  fi
  if [[ "$current_major" =~ ^[0-9]+$ ]] && (( current_major >= 20 )) && command -v npm >/dev/null 2>&1; then
    success "Node.js $(node --version) si npm $(npm --version) sunt deja instalate."
    return
  fi

  info "Instalez Node.js ${NODE_MAJOR} LTS si npm..."
  local setup_script
  setup_script="$(mktemp)"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" -o "$setup_script"
  if [[ "${EUID}" -eq 0 ]]; then
    bash "$setup_script"
  else
    sudo -E bash "$setup_script"
  fi
  rm -f "$setup_script"
  apt_install nodejs

  current_major="$(node_major)"
  [[ "$current_major" =~ ^[0-9]+$ ]] && (( current_major >= 20 )) \
    || fail "Node.js 20+ nu a fost instalat corect."
  require_command npm "Pachetul Node.js instalat nu contine npm."
  success "Node.js $(node --version) si npm $(npm --version) instalate."
}

configure_docker_repository() {
  info "Configurez repository-ul oficial Docker..."
  run_root install -m 0755 -d /etc/apt/keyrings
  local docker_key
  docker_key="$(mktemp)"
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o "$docker_key"
  run_root install -m 0644 "$docker_key" /etc/apt/keyrings/docker.asc
  rm -f "$docker_key"

  printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
    "$(dpkg --print-architecture)" "$UBUNTU_CODENAME" \
    | run_root tee /etc/apt/sources.list.d/docker.list >/dev/null
  apt_update
}

install_docker() {
  local docker_missing=0
  local compose_missing=0
  command -v docker >/dev/null 2>&1 || docker_missing=1
  docker compose version >/dev/null 2>&1 || compose_missing=1

  if [[ "$docker_missing" -eq 0 && "$compose_missing" -eq 0 ]]; then
    success "Docker si Docker Compose sunt deja instalate."
  else
    configure_docker_repository
    if [[ "$docker_missing" -eq 1 ]]; then
      info "Instalez Docker Engine si plugin-urile oficiale..."
      apt_install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    else
      info "Instalez Docker Compose plugin..."
      apt_install docker-compose-plugin
    fi
  fi

  require_command docker "Instalarea Docker a esuat."
  docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin nu este disponibil."

  if command -v systemctl >/dev/null 2>&1; then
    run_root systemctl enable --now docker 2>/dev/null \
      || info "Docker nu a putut fi pornit prin systemd; porneste serviciul manual."
  fi

  if [[ "$TARGET_USER" != "root" ]] && ! id -nG "$TARGET_USER" | tr ' ' '\n' | grep -qx docker; then
    if [[ "${EUID}" -ne 0 ]] && docker info >/dev/null 2>&1; then
      DOCKER_GROUP_CHANGED=0
    else
      getent group docker >/dev/null 2>&1 || run_root groupadd docker
      run_root usermod -aG docker "$TARGET_USER"
      DOCKER_GROUP_CHANGED=1
    fi
  else
    DOCKER_GROUP_CHANGED=0
  fi
  success "Docker $(docker --version | awk '{print $3}' | tr -d ',') si $(docker compose version --short) instalate."
}

install_pm2() {
  if command -v pm2 >/dev/null 2>&1; then
    success "PM2 $(pm2 --version) este deja instalat."
    return
  fi

  info "Instalez PM2 global..."
  local npm_prefix
  npm_prefix="$(npm prefix --global)"
  if [[ -w "$npm_prefix" ]]; then
    npm install --global pm2
  else
    run_root env "PATH=$PATH" npm install --global pm2
  fi
  require_command pm2 "Instalarea PM2 a esuat."
  success "PM2 $(pm2 --version) instalat."
}

install_base_packages
install_java
install_maven
install_node
install_docker
install_pm2

"$ROOT_DIR/scripts/create-env.sh"
mkdir -p "$ROOT_DIR/runtime/nginx/html" "$ROOT_DIR/logs/pm2"

info "Instalez dependentele frontend..."
npm --prefix "$ROOT_DIR/frontend" install

success "Instalarea AutoAssist 3D este finalizata."
if [[ "${DOCKER_GROUP_CHANGED:-0}" -eq 1 ]]; then
  info "Utilizatorul '$TARGET_USER' a fost adaugat in grupul docker."
  info "Delogheaza-te si autentifica-te din nou, apoi ruleaza ./scripts/start-all.sh"
else
  info "Porneste aplicatia cu ./scripts/start-all.sh"
fi
