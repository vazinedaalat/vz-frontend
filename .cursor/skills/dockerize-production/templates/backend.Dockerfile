# Note: avoid `# syntax=docker/dockerfile:…` — Docker Hub 403 breaks local builds.
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --no-audit --no-fund

FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM build AS pruned
RUN npm prune --omit=dev --no-audit --no-fund

FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000 UPLOAD_DIR=/data/uploads
RUN apk add --no-cache dumb-init openssl libc6-compat \
 && addgroup -g 1001 -S nodejs \
 && adduser -S -u 1001 -G nodejs nestjs \
 && mkdir -p /data/uploads && chown -R nestjs:nodejs /data
COPY --from=pruned --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=pruned --chown=nestjs:nodejs /app/dist ./dist
COPY --from=pruned --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=pruned --chown=nestjs:nodejs /app/package.json ./package.json
USER 1001
EXPOSE 3000
VOLUME ["/data/uploads"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
