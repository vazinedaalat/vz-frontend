# Docker reference (per app)

## Up

```bash
# Backend
cd nestjs-vz && cp -n .env.example .env && docker compose up -d --build

# Frontend
cd frontend-vz && cp -n .env.example .env && docker compose up -d --build

# Admin
cd Admin && cp -n .env.example .env && docker compose up -d --build
```

Point SPA `VITE_API_URL` at wherever the API actually runs (host Nest, or `http://localhost:3000/api/v1` if backend compose is up).

## Health

- API: `GET http://localhost:3000/api/v1/health`
- Frontend: `GET http://localhost:8080/healthz`
- Admin: `GET http://localhost:8081/healthz`
