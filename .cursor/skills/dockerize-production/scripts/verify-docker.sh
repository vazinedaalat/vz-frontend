#!/usr/bin/env bash
# verify-docker.sh — builds and audits Docker artifacts for backend / frontend / admin.
# Usage:
#   bash verify-docker.sh              # all apps found
#   bash verify-docker.sh backend      # nestjs-vz only
#   bash verify-docker.sh frontend     # frontend-vz only
#   bash verify-docker.sh admin        # Admin only
#   ROOT=/path/to/vazinedalat bash verify-docker.sh
# Exit code != 0 when any check fails. Requires: docker (with buildx), bash 4+.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# .cursor/skills/<skill>/scripts → this repo. Parent is monorepo if siblings exist.
_REPO="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
_PARENT="$(cd "$_REPO/.." && pwd)"
if [[ -z "${ROOT:-}" ]]; then
  if [[ -d "$_PARENT/nestjs-vz" && -d "$_PARENT/frontend-vz" && -d "$_PARENT/Admin" ]]; then
    ROOT="$_PARENT"
  else
    ROOT="$_REPO"
  fi
fi
PASS=0; FAIL=0; WARN=0
declare -a REPORT

ok()   { PASS=$((PASS+1)); REPORT+=("✅ $1"); echo "✅ $1"; }
bad()  { FAIL=$((FAIL+1)); REPORT+=("❌ $1"); echo "❌ $1"; }
warn() { WARN=$((WARN+1)); REPORT+=("⚠️  $1"); echo "⚠️  $1"; }
hr()   { printf '\n%s\n' "────────── $1 ──────────"; }

need_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker not found — blocked"; exit 2
  fi
  if ! docker info >/dev/null 2>&1; then
    echo "docker daemon not reachable — blocked"; exit 2
  fi
}

# ---------- static checks on a Dockerfile ----------
lint_dockerfile() {
  local df="$1" name="$2"
  hr "Dockerfile lint: $name"
  [[ -f "$df" ]] || { bad "$name: Dockerfile missing at $df"; return; }

  grep -Eq '^\s*FROM\s+\S+:latest' "$df" && bad "$name: uses :latest tag" || ok "$name: base image tag pinned"
  grep -Eq '^\s*USER\s+' "$df" && ok "$name: USER directive present" || bad "$name: no USER (runs as root)"
  grep -Eq '^\s*HEALTHCHECK' "$df" && ok "$name: HEALTHCHECK present" || bad "$name: HEALTHCHECK missing"
  grep -Eq 'npm\s+install(\s|$)' "$df" && bad "$name: npm install used (use npm ci)" || ok "$name: npm ci only"
  grep -Eiq '(ENV|ARG)\s+\S*(SECRET|PASSWORD|TOKEN|PRIVATE_KEY)\S*\s*=\s*\S+' "$df" && bad "$name: secret-like value in ENV/ARG" || ok "$name: no secret literals in ENV/ARG"
  grep -Eq 'chmod\s+(-R\s+)?777' "$df" && bad "$name: chmod 777" || ok "$name: no chmod 777"
  grep -Eq 'curl[^|]*\|\s*(sh|bash)' "$df" && bad "$name: curl | sh" || ok "$name: no curl|sh"
  grep -Eq '^\s*FROM .* AS ' "$df" && ok "$name: multi-stage build" || warn "$name: single-stage build"

  # hadolint via docker (optional)
  if docker image inspect hadolint/hadolint:latest >/dev/null 2>&1 || docker pull -q hadolint/hadolint:latest >/dev/null 2>&1; then
    if docker run --rm -i hadolint/hadolint hadolint --ignore DL3018 --ignore DL3059 - < "$df" >/tmp/hadolint.$$ 2>&1; then
      ok "$name: hadolint clean"
    else
      warn "$name: hadolint findings:"; sed 's/^/    /' /tmp/hadolint.$$
    fi
    rm -f /tmp/hadolint.$$
  else
    warn "$name: hadolint unavailable (offline?) — skipped"
  fi
}

check_dockerignore() {
  local dir="$1" name="$2"
  hr ".dockerignore: $name"
  local di="$dir/.dockerignore"
  [[ -f "$di" ]] || { bad "$name: .dockerignore missing"; return; }
  for pat in node_modules ".env" ".git"; do
    grep -Fxq "$pat" "$di" || grep -Eq "^${pat//./\\.}(\*|\$)" "$di" \
      && ok "$name: ignores $pat" || bad "$name: .dockerignore lacks $pat"
  done
  grep -Eq '^\.env\.\*' "$di" && ok "$name: ignores .env.*" || warn "$name: add .env.* to .dockerignore"
}

# ---------- build + runtime checks ----------
build_and_probe() {
  local dir="$1" name="$2" tag="vz-verify/$2:local"; shift 2
  hr "Build: $name"
  if docker build -q -t "$tag" "$@" "$dir" >/tmp/build.$$ 2>&1; then
    ok "$name: image builds"
  else
    bad "$name: build failed"; tail -n 40 /tmp/build.$$ | sed 's/^/    /'; rm -f /tmp/build.$$; return
  fi
  rm -f /tmp/build.$$

  local size; size=$(docker image inspect "$tag" --format '{{.Size}}' 2>/dev/null || echo 0)
  echo "    size: $(( size / 1024 / 1024 )) MB"

  local user; user=$(docker image inspect "$tag" --format '{{.Config.User}}')
  [[ -n "$user" && "$user" != "root" && "$user" != "0" ]] && ok "$name: runtime user = $user" || bad "$name: runtime user is root"

  docker image inspect "$tag" --format '{{if .Config.Healthcheck}}yes{{end}}' | grep -q yes \
    && ok "$name: HEALTHCHECK baked in image" || bad "$name: image has no HEALTHCHECK"

  # secret scan across layers (env files / private keys / obvious literals)
  local tmpc; tmpc=$(docker create "$tag" 2>/dev/null)
  if [[ -n "$tmpc" ]]; then
    if docker export "$tmpc" | tar -t 2>/dev/null | grep -Eq '(^|/)\.env($|\.)|\.pem$|\.key$|id_rsa'; then
      bad "$name: .env / key material found inside image"
    else
      ok "$name: no .env / key files in image"
    fi
    docker rm -f "$tmpc" >/dev/null 2>&1
  fi

  if docker image inspect "$tag" --format '{{range $k,$v := .Config.Env}}{{$v}}{{"\n"}}{{end}}' | grep -Eiq '(SECRET|PASSWORD|TOKEN)=\S+'; then
    bad "$name: secret-like ENV baked into image"
  else
    ok "$name: no secret ENV in image config"
  fi

  docker image inspect "$tag" --format '{{index .Config.Labels "org.opencontainers.image.title"}}' | grep -q . \
    && ok "$name: OCI labels present" || warn "$name: OCI labels missing"
}

check_compose() {
  hr "Compose"
  local cf="$ROOT/docker-compose.yml"
  [[ -f "$cf" ]] || { warn "root docker-compose.yml not found at $cf — skipped"; return; }
  if ( cd "$ROOT" && docker compose -f docker-compose.yml config -q ) 2>/tmp/compose.$$; then
    ok "compose config valid"
  else
    bad "compose config invalid:"; sed 's/^/    /' /tmp/compose.$$
  fi
  rm -f /tmp/compose.$$
  grep -Eq 'privileged:\s*true' "$cf" && bad "compose: privileged: true" || ok "compose: no privileged"
  grep -Eq '^\s*env_file:' "$cf" && ok "compose: env_file used" || warn "compose: no env_file"
  grep -Eq 'healthcheck:' "$cf" && ok "compose: healthchecks defined" || bad "compose: no healthchecks"
  grep -Eq 'no-new-privileges' "$cf" && ok "compose: no-new-privileges" || warn "compose: add security_opt no-new-privileges"
  grep -Eq 'cap_drop' "$cf" && ok "compose: cap_drop" || warn "compose: add cap_drop: [ALL]"
  grep -Eiq '(PASSWORD|SECRET|TOKEN):\s*["'"'"']?[A-Za-z0-9+/=_-]{12,}["'"'"']?\s*$' "$cf" && bad "compose: inline secret literal" || ok "compose: no inline secret literals"
  # DB must not publish ports in prod
  if awk '/^  db:/{f=1} f&&/^  [a-z]/&&!/^  db:/{f=0} f&&/^\s*ports:/{print "x"}' "$cf" | grep -q x; then
    bad "compose: db publishes ports (remove in prod)"
  else
    ok "compose: db not published"
  fi
  [[ -f "$ROOT/.env.example" ]] && ok "root .env.example present" || warn "root .env.example missing"
  if [[ -f "$ROOT/.gitignore" ]] && grep -Eq '^\.env$' "$ROOT/.gitignore"; then ok "root .gitignore ignores .env"; else warn "ensure root .gitignore ignores .env"; fi
}

# ---------- main ----------
need_docker
TARGETS=("${@:-all}")
want() { [[ " ${TARGETS[*]} " == *" all "* || " ${TARGETS[*]} " == *" $1 "* ]]; }

echo "ROOT=$ROOT"

if want backend && [[ -d "$ROOT/nestjs-vz" ]]; then
  lint_dockerfile "$ROOT/nestjs-vz/Dockerfile" backend
  check_dockerignore "$ROOT/nestjs-vz" backend
  build_and_probe "$ROOT/nestjs-vz" backend --target runtime
fi

for pair in "frontend:frontend-vz" "admin:Admin"; do
  key="${pair%%:*}"; dir="${pair##*:}"
  if want "$key" && [[ -d "$ROOT/$dir" ]]; then
    lint_dockerfile "$ROOT/$dir/Dockerfile" "$key"
    check_dockerignore "$ROOT/$dir" "$key"
    [[ -f "$ROOT/$dir/nginx.conf" ]] && ok "$key: nginx.conf present" || bad "$key: nginx.conf missing"
    if [[ -f "$ROOT/$dir/nginx.conf" ]]; then
      grep -q 'try_files .* /index.html' "$ROOT/$dir/nginx.conf" && ok "$key: SPA fallback" || bad "$key: nginx lacks SPA fallback"
      grep -q 'server_tokens off' "$ROOT/$dir/nginx.conf" && ok "$key: server_tokens off" || warn "$key: set server_tokens off"
      grep -q 'X-Content-Type-Options' "$ROOT/$dir/nginx.conf" && ok "$key: security headers" || bad "$key: missing security headers"
      grep -q '/healthz' "$ROOT/$dir/nginx.conf" && ok "$key: /healthz route" || bad "$key: /healthz missing"
    fi
    build_and_probe "$ROOT/$dir" "$key" --build-arg VITE_API_URL=http://localhost:3000/api/v1 --build-arg VITE_ASSET_BASE_URL=http://localhost:3000
  fi
done

check_compose

hr "Summary"
printf '%s\n' "${REPORT[@]}"
echo
echo "PASS=$PASS  FAIL=$FAIL  WARN=$WARN"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
