# syntax=docker/dockerfile:1
# Slavic Sliders website: Next.js + Payload CMS

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ── Install dependencies ─────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* .npmrc ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Placeholder values so the build can load the Payload config.
# Nothing connects to the database during the build; real values come from .env at runtime.
ENV PAYLOAD_SECRET=build-placeholder \
    DATABASE_URI=postgres://build:build@localhost:5432/build
RUN npm run generate:importmap && npm run build

# ── Run ──────────────────────────────────────────────────────────────────────
# The full app (with node_modules) is kept so the Payload CLI can run
# database migrations and the seed script inside the container.
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app ./
RUN chmod +x scripts/docker-entrypoint.sh && mkdir -p /app/media
EXPOSE 3000
CMD ["./scripts/docker-entrypoint.sh"]
