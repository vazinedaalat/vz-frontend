# syntax=docker/dockerfile:1.7
# NestJS + Prisma — production image
# Stages: deps (all deps) → build (compile + prisma generate) → runtime (prod deps + dist only)

ARG NODE_IMAGE=node:24-alpine

# ---------- deps: install ALL dependencies (cached by lockfile) ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---------- build: compile TypeScript + generate Prisma client ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate \
 && npm run build \
 && npm prune --omit=dev --no-audit --no-fund

# ---------- runtime: minimal, non-root, read-only friendly ----------
FROM ${NODE_IMAGE} AS runtime

ARG APP_VERSION=dev
ARG GIT_SHA=unknown
LABEL org.opencontainers.image.title="vazinedalat-api" \
      org.opencontainers.image.source="https://github.com/vazinedalat/nestjs-vz" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"

ENV NODE_ENV=production \
    PORT=3000 \
    UPLOAD_DIR=/data/uploads \
    NODE_OPTIONS=--enable-source-maps

WORKDIR /app

# dumb-init as PID 1 → proper signal handling / zombie reaping
RUN apk add --no-cache dumb-init \
 && addgroup -g 1001 -S nodejs \
 && adduser -S -u 1001 -G nodejs nestjs \
 && mkdir -p /data/uploads \
 && chown -R nestjs:nodejs /data

# Only what runtime needs
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 3000
VOLUME ["/data/uploads"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
