# syntax=docker/dockerfile:1.7
# Vite + React SPA (frontend-vz / Admin) — build with Node, serve with unprivileged nginx
# All VITE_* values are inlined at BUILD time → pass as --build-arg (never secrets).

ARG NODE_IMAGE=node:24-alpine
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27-alpine

# ---------- deps ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---------- build ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app

# Public (non-secret) build-time config
ARG VITE_API_URL=http://localhost:3000/api/v1
ARG VITE_ASSET_BASE_URL=http://localhost:3000
ARG VITE_APP_ENV=production
ARG VITE_APP_NAME="وزین عدالت"
ARG VITE_SITE_URL=https://vazinedalat.ir
ARG VITE_FRONTEND_URL=https://vazinedalat.ir
ARG BASE_PATH=/
ENV VITE_API_URL=${VITE_API_URL} \
    VITE_ASSET_BASE_URL=${VITE_ASSET_BASE_URL} \
    VITE_APP_ENV=${VITE_APP_ENV} \
    VITE_APP_NAME=${VITE_APP_NAME} \
    VITE_SITE_URL=${VITE_SITE_URL} \
    VITE_FRONTEND_URL=${VITE_FRONTEND_URL} \
    VITE_USE_MOCK=false \
    BASE_PATH=${BASE_PATH} \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM ${NGINX_IMAGE} AS runtime

ARG APP_VERSION=dev
ARG GIT_SHA=unknown
LABEL org.opencontainers.image.title="vazinedalat-spa" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"

# nginx-unprivileged runs as uid 101, listens on 8080, no root needed
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
