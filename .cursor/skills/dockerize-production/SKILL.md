---
name: dockerize-production
description: Builds secure, verified, production-ready Docker setups for the Vazin Edalat stack — NestJS backend (nestjs-vz), Vite React frontend (frontend-vz) and Admin panel (Admin) — with multi-stage Dockerfiles, nginx SPA serving, compose orchestration, migrations, healthchecks, TLS edge, and an automated verification script. Use when the user asks to dockerize, containerize, write a Dockerfile / docker-compose / nginx config, deploy with Docker, or mentions داکر / داکرایز / دیپلوی / کانتینر.
---

# Dockerize Production

Every Docker artifact must pass **all five filters** from rule `docker-production`:
**1 Secure · 2 Bug-free & verified · 3 Simplest deploy · 4 Professional · 5 Complete for prod.**

## Workflow

```
Docker Progress:
- [ ] 1. Inspect app (ports, build cmd, env vars, health route, runtime files)
- [ ] 2. Write .dockerignore
- [ ] 3. Write Dockerfile from template (multi-stage, non-root, HEALTHCHECK)
- [ ] 4. Frontend/Admin: write nginx.conf (SPA fallback, headers, cache)
- [ ] 5. Compose: services, healthchecks, migrate job, volumes, limits, TLS edge
- [ ] 6. Update .env.example (+ never commit .env)
- [ ] 7. Run scripts/verify-docker.sh → fix → re-run until green
- [ ] 8. Live smoke: compose up, curl health, compose down
- [ ] 9. Update README Docker section + report
```

## Step 1 — Inspect

| App | Build | Runtime | Port | Health | Env source |
|-----|-------|---------|------|--------|------------|
| `nestjs-vz` | `npm ci && npx prisma generate && npm run build` | `node dist/main.js` | `3000` | `GET /api/v1/health` | runtime `.env` |
| `frontend-vz` | `npm ci && npm run build` (Vite) | nginx static | `8080` | `GET /healthz` | **build-time** `VITE_*` ARGs |
| `Admin` | same as frontend | nginx static | `8080` | `GET /healthz` | **build-time** `VITE_*` ARGs |

Vite inlines `VITE_*` at build → pass as `ARG`, never expect runtime env. Backend reads env at runtime → pass via compose `env_file`.

## Step 2–4 — Files (copy from `templates/`)

| Target | Template |
|--------|----------|
| `nestjs-vz/Dockerfile` | `templates/backend.Dockerfile` |
| `nestjs-vz/.dockerignore` | `templates/backend.dockerignore` |
| `frontend-vz/Dockerfile`, `Admin/Dockerfile` | `templates/spa.Dockerfile` |
| `frontend-vz/nginx.conf`, `Admin/nginx.conf` | `templates/spa.nginx.conf` |
| `frontend-vz/.dockerignore`, `Admin/.dockerignore` | `templates/spa.dockerignore` |
| `vazinedalat/docker-compose.yml` (monorepo root) | `templates/docker-compose.yml` |
| `vazinedalat/Caddyfile` | `templates/Caddyfile` |
| `vazinedalat/.env.example` | `templates/root.env.example` |

Adjust only: `ARG` defaults, ports, domain names, `X-Frame-Options` (`DENY` for Admin, `SAMEORIGIN` for frontend).

## Hard requirements per Dockerfile

- Base pinned: `node:24-alpine`, `nginxinc/nginx-unprivileged:1.27-alpine` (never `latest`)
- Stages: `deps` → `build` → `runtime`; runtime copies **only** artifacts
- `npm ci` (lockfile) — `npm install` forbidden
- `USER` non-root (uid ≥ 1000) before `CMD`
- `HEALTHCHECK` present (node `fetch` for backend, `wget -qO-` for nginx)
- `ENV NODE_ENV=production`; no secrets in `ARG`/`ENV`/layers
- PID 1: `docker run --init` / compose `init: true` (no `npm start` as PID 1)
- OCI labels: `org.opencontainers.image.{title,source,revision}`

## Hard requirements per compose

- `env_file: .env` (git-ignored) — secrets never inline
- `migrate` one-off service (`target: build`, `npx prisma migrate deploy`) and `app` `depends_on: migrate: condition: service_completed_successfully`
- `healthcheck` on `db`, `api`, `web`, `admin`; `depends_on … condition: service_healthy`
- `read_only: true` + `tmpfs: [/tmp]` + `cap_drop: [ALL]` + `security_opt: [no-new-privileges:true]` + `init: true`
- `deploy.resources.limits` (cpu/mem), `logging` json-file with `max-size`/`max-file`
- Named volumes: `postgres_data`, `uploads_data`, `caddy_data`
- DB **no `ports:`** in prod; internal network only
- TLS via `caddy` service under profile `edge` (`docker compose --profile edge up -d`)

## Step 7 — Verify (mandatory)

```bash
bash .cursor/skills/dockerize-production/scripts/verify-docker.sh            # all apps
bash .cursor/skills/dockerize-production/scripts/verify-docker.sh backend    # one app
```

Checks: build succeeds → hadolint (if docker available) → runtime user ≠ root → HEALTHCHECK exists → no `.env`/secret strings in layers → `docker compose config -q` → image size report. Fix every ❌ and re-run; do not finish with warnings you can fix.

## Step 8 — Smoke

```bash
cd /path/to/vazinedalat
cp .env.example .env   # fill real values
docker compose up -d --build
docker compose ps                                  # all healthy
curl -fsS http://localhost:3000/api/v1/health      # {"status":"ok",...}
curl -fsSI http://localhost:8080/healthz           # 200 (frontend)
curl -fsSI http://localhost:8081/healthz           # 200 (admin)
docker compose logs --tail=50 api
docker compose down
```

## Deploy (simplest path — filter 3)

```bash
git pull
cp -n .env.example .env && $EDITOR .env           # first time only
docker compose --profile edge up -d --build       # HTTPS via Caddy
docker compose ps
```

Rollback: `docker compose up -d --no-build` with previous image tag, or `git checkout <tag> && docker compose up -d --build`.

## Report format

```markdown
### Docker delivery
- Files: …
- Images: api 210 MB · web 45 MB · admin 46 MB
- verify-docker.sh: ✅ 18/18
- Smoke: /api/v1/health ok · /healthz 200 · migrate exit 0
- Security: non-root, read-only fs, cap_drop ALL, no secrets in layers, DB internal
- Deploy: `docker compose --profile edge up -d --build`
- Residual: …
```

## Additional resources

- Security hardening details, CSP guidance, and troubleshooting: [reference.md](reference.md)
- Templates: `templates/`
- Verification script: `scripts/verify-docker.sh`
