#!/usr/bin/env bash
# Verify Docker files for the current app folder only.
# Usage (from nestjs-vz / frontend-vz / Admin):
#   bash .cursor/skills/dockerize-production/scripts/verify-docker.sh
set -uo pipefail

APP_DIR="$(pwd)"
NAME="$(basename "$APP_DIR")"
PASS=0; FAIL=0
ok(){ PASS=$((PASS+1)); echo "✅ $1"; }
bad(){ FAIL=$((FAIL+1)); echo "❌ $1"; }

echo "App: $NAME ($APP_DIR)"

[[ -f Dockerfile ]] && ok "Dockerfile" || bad "Dockerfile missing"
[[ -f .dockerignore ]] && ok ".dockerignore" || bad ".dockerignore missing"
[[ -f docker-compose.yml ]] && ok "docker-compose.yml" || bad "docker-compose.yml missing"
grep -q '\.env' .dockerignore 2>/dev/null && ok ".dockerignore blocks .env" || bad ".dockerignore should ignore .env"
if grep -Eq '^\s*USER\s+' Dockerfile || grep -Eq 'nginx-unprivileged' Dockerfile; then
  ok "non-root USER (or nginx-unprivileged)"
else
  bad "no USER / unprivileged base"
fi
grep -q HEALTHCHECK Dockerfile && ok "HEALTHCHECK" || bad "HEALTHCHECK missing"
grep -q 'npm ci' Dockerfile && ok "npm ci" || bad "use npm ci"
grep -Eq ':latest' Dockerfile && bad "pinned tags (no :latest)" || ok "no :latest"

if [[ "$NAME" == "nestjs-vz" ]]; then
  grep -q 'target: build' docker-compose.yml && ok "migrate uses build target" || bad "migrate target"
  grep -q 'api:' docker-compose.yml && ok "api service" || bad "api service"
elif [[ "$NAME" == "frontend-vz" || "$NAME" == "Admin" ]]; then
  [[ -f nginx.conf ]] && ok "nginx.conf" || bad "nginx.conf missing"
  grep -q 'try_files' nginx.conf && ok "SPA fallback" || bad "SPA try_files"
  grep -q '/healthz' nginx.conf && ok "/healthz" || bad "/healthz"
fi

if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  if docker compose config -q 2>/dev/null; then ok "compose config"; else bad "compose config"; fi
else
  echo "⚠️  docker unavailable — skip compose config"
fi

echo "PASS=$PASS FAIL=$FAIL"
[[ $FAIL -eq 0 ]]
