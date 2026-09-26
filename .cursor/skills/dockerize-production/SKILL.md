---
name: dockerize-production
description: Creates a simple per-app Docker setup (Dockerfile + docker-compose) for NestJS backend, Vite frontend, or Admin — each app runs alone with docker compose up. Use when dockerizing, writing Dockerfile/compose, or mentions داکر / داکرایز / دیپلوی.
---

# Dockerize (per app)

**One folder = one stack.** Do not create a monorepo compose that starts api + web + admin together. Do not require Caddy/TLS for the default path.

## Decide target

| If editing… | Write files in… | Up |
|-------------|-----------------|-----|
| Backend API | `nestjs-vz/` | `cd nestjs-vz && docker compose up -d --build` |
| Client SPA | `frontend-vz/` | `cd frontend-vz && docker compose up -d --build` |
| Admin SPA | `Admin/` | `cd Admin && docker compose up -d --build` |

Copy from `templates/` then adjust ports/names only.

## Backend (`nestjs-vz`)

Files: `Dockerfile`, `.dockerignore`, `docker-compose.yml`, ensure `.env.example` has DB + JWT.

Compose services (only these):

1. `db` — `postgres:16-alpine`, publish `5432` for local simplicity (or omit if user prefers internal-only)
2. `migrate` — build `target: build`, `npx prisma migrate deploy`, then exit
3. `api` — build `target: runtime`, depends on migrate success, port `3000`, volume for uploads

Smoke: `curl -fsS http://localhost:3000/api/v1/health`

## Frontend / Admin (SPA)

Files: `Dockerfile`, `nginx.conf`, `.dockerignore`, `docker-compose.yml`.

Compose: single service `web` (or `admin`) — build image, port `8080:8080`.

Pass `VITE_API_URL` / `VITE_ASSET_BASE_URL` as compose `build.args` from `.env`.

Smoke: `curl -fsSI http://localhost:8080/healthz` (admin may use `8081:8080`).

Admin nginx: `X-Frame-Options DENY`. Frontend: `SAMEORIGIN`.

## Checklist (enough)

```
- [ ] Dockerfile multi-stage, pinned base, non-root, HEALTHCHECK, npm ci
- [ ] .dockerignore blocks .env and node_modules
- [ ] docker-compose.yml lives in the same app folder
- [ ] `docker compose up -d --build` works from that folder alone
- [ ] Health URL returns 200
- [ ] README Docker section = that one command
```

## Verify (optional, same folder)

```bash
bash .cursor/skills/dockerize-production/scripts/verify-docker.sh
```

Script detects app type from cwd (`nestjs-vz` / `frontend-vz` / `Admin`) and checks only that app.

## Do not

- Add root `vazinedalat/docker-compose.yml` coupling all apps
- Force Caddy, internal-only networks, or profiles for basic deploy
- Document “must start all three”

## Templates

- `templates/backend.Dockerfile` + `backend.dockerignore` + `backend.compose.yml`
- `templates/spa.Dockerfile` + `spa.dockerignore` + `spa.nginx.conf` + `spa.compose.yml`
