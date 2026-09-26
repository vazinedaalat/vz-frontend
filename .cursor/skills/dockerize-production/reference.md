# Dockerize Production — Reference

Detailed rationale, hardening options, and troubleshooting for `SKILL.md`.

## 1. Security hardening (filter 1)

| Layer | Control | Why |
|-------|---------|-----|
| Image | Pinned tag (`node:24-alpine`, `nginx-unprivileged:1.27-alpine`); optionally `@sha256:` digest | Reproducible, no surprise upgrades |
| Image | `npm ci --no-audit --no-fund`, `npm prune --omit=dev` | Lockfile-exact, no dev tooling in runtime |
| Image | Runtime stage copies only `dist/`, prod `node_modules`, `prisma/` | No sources, tests, `.env`, `.git` in layers |
| Image | `USER` uid 1001 (`nestjs`) / nginx-unprivileged uid 101 | Container escape ≠ root on host |
| Image | `HEALTHCHECK` uses in-image tools (`node fetch`, `wget`) | No extra packages |
| Image | `dumb-init` / `init: true` | Signal forwarding, zombie reaping, clean `SIGTERM` for graceful shutdown |
| Compose | `read_only: true` + `tmpfs` for `/tmp`, nginx cache/run | Immutable filesystem; only volumes writable |
| Compose | `cap_drop: [ALL]` (+ `NET_BIND_SERVICE` only for Caddy) | Least privilege |
| Compose | `security_opt: no-new-privileges` | Blocks setuid escalation |
| Compose | `networks.internal.internal: true` | DB/migrate isolated; no egress |
| Compose | DB has **no `ports:`** | Never expose Postgres publicly |
| Compose | `env_file: .env` (git-ignored) + `${VAR:?}` guards | Secrets never in YAML; boot fails loudly if missing |
| Build | `.dockerignore` excludes `.env*`, keys, `.git`, `node_modules` | Secrets can't leak into context; faster builds |
| SPA | `VITE_*` are **public** — never put secrets there | Inlined into JS bundle |
| Edge | Caddy auto-TLS, HSTS, `-Server`, HTTP→HTTPS | Transport security by default |

### Secret generation

```bash
openssl rand -hex 32   # JWT_ACCESS_SECRET
openssl rand -hex 32   # JWT_REFRESH_SECRET (different)
openssl rand -base64 32 | tr -d '=+/' | cut -c1-32   # POSTGRES_PASSWORD
```

### Optional: pin by digest

```bash
docker buildx imagetools inspect node:24-alpine | grep Digest
# FROM node:24-alpine@sha256:<digest>
```

## 2. Verification (filter 2)

`scripts/verify-docker.sh` runs static + build-time checks. Additional optional scans:

```bash
docker scout cves vz-verify/backend:local          # Docker Desktop
docker run --rm aquasec/trivy image vz-verify/backend:local --severity HIGH,CRITICAL
```

Treat **CRITICAL** in runtime deps as blockers; document HIGH with justification.

Live smoke after `compose up`:

```bash
docker compose ps --format 'table {{.Name}}\t{{.Status}}'   # every service (healthy)
docker compose exec api node -e "fetch('http://127.0.0.1:3000/api/v1/health').then(r=>r.json()).then(console.log)"
docker compose logs migrate | tail -n 5                       # "No pending migrations" or applied list
```

## 3. Simplest deploy (filter 3)

One-time on server:

```bash
curl -fsSL https://get.docker.com | sudo sh     # only trusted host bootstrap; never inside images
sudo usermod -aG docker $USER
git clone <monorepo> vazinedalat && cd vazinedalat
cp .env.example .env && nano .env                # secrets + domains
docker compose --profile edge up -d --build
```

Every release:

```bash
git pull && docker compose --profile edge up -d --build && docker compose ps
```

Zero manual steps: migrations run in `migrate`, SPAs rebuild with baked URLs, Caddy renews certificates.

### Why a `migrate` service instead of migrating at `api` start?

- Runtime image stays free of the Prisma CLI (smaller, fewer CVEs).
- Migrations run **once**, not per replica.
- `api` waits via `service_completed_successfully` → no race on a fresh DB.

## 4. Professional details (filter 4)

- **Layer caching**: `package*.json` + `prisma/` copied before source → deps layer reused.
- **BuildKit cache mount** for `~/.npm` → faster CI rebuilds.
- **OCI labels** (`title`, `source`, `version`, `revision`) → traceable images. Pass `GIT_SHA=$(git rev-parse --short HEAD)` in CI.
- **Log rotation** (`max-size 10m × 5`) → disk never fills.
- **Resource limits** → one runaway service can't starve the host.
- **Named volumes** → `postgres_data`, `uploads_data` survive `compose down`.
- **Graceful shutdown**: Nest `app.enableShutdownHooks()` + `dumb-init` → in-flight requests finish on `SIGTERM`.

## 5. Production completeness (filter 5)

Backend env that **must** be set in prod (`.env`): `DATABASE_URL` (derived), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`, `SWAGGER_ENABLED=false`, `NODE_ENV=production`, `UPLOAD_DIR=/data/uploads`.

SPA build args that must match real domains: `VITE_API_URL` (with `/api/v1`), `VITE_ASSET_BASE_URL` (no `/api`), `VITE_SITE_URL`, `VITE_FRONTEND_URL` (Admin → client site link).

nginx SPA essentials: `try_files … /index.html`, `/assets/` immutable 1y, `index.html` `no-store`, `server_tokens off`, security headers, `/healthz`, deny dotfiles and `.map` (or drop `sourcemap: true` in Vite for prod).

### CSP tuning

Start with the template CSP. If the browser console reports violations:

- Fonts from `@fontsource` are self-hosted → `font-src 'self' data:` suffices.
- API on another origin → `connect-src 'self' https://api.example.ir`.
- Uploaded images from API host → `img-src 'self' data: blob: https://api.example.ir`.
- Avoid `'unsafe-inline'` for `script-src`; keep it only for `style-src` if Tailwind/Radix inject inline styles.

## 6. Backups

```bash
# Postgres dump (run on host, nightly cron)
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > backups/db-$(date +%F).sql.gz
# Uploads volume
docker run --rm -v vazinedalat_uploads_data:/data -v "$PWD/backups":/b alpine tar czf /b/uploads-$(date +%F).tgz -C /data .
```

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `api` restarts, logs `DATABASE_URL` invalid | `.env` missing `POSTGRES_*`; compose derives URL from them |
| `migrate` fails `P1001` | DB not healthy yet → check `db` healthcheck; `docker compose logs db` |
| SPA shows old build after deploy | Browser cached `index.html` → confirm `no-store` header in nginx; hard refresh |
| SPA calls `localhost:3000` in prod | `VITE_API_URL` build-arg not passed → set `PUBLIC_API_URL` in `.env`, rebuild (`--build`) |
| nginx `permission denied` on `/var/cache/nginx` | Missing `tmpfs` entries with `read_only: true` |
| `EACCES` writing uploads | Volume owned by root → `docker compose exec -u root api chown -R 1001:1001 /data/uploads` once |
| Caddy cert fails | DNS A/AAAA not pointing to host, or ports 80/443 blocked |
| `read_only` breaks Prisma engine | Prisma writes to `/tmp` → ensure `tmpfs: [/tmp]` on `api` |
| hadolint DL3018 (unpinned apk) | Ignored intentionally for `dumb-init`; pin if compliance requires |

## 8. Related rules & skills

- Rule: `.cursor/rules/docker-production.mdc` (always on)
- Security phase: `.cursor/skills/security-audit-api/SKILL.md`
- Quality gate: `.cursor/rules/nestjs-quality-gate.mdc`
