# Multi-stage Production Dockerfile for Backend Service
# Syntax & Best Practices: Minimal attack surface, non-root user, frozen lockfile, layer caching

# Stage 1: Base Alpine image with Node.js 22 and pnpm
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
WORKDIR /app

# Stage 2: Workspace Dependency Installation
FROM base AS dependencies
WORKDIR /app

# Copy root workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./

# Copy package descriptors for isolated dependency resolution
COPY packages/config/package.json ./packages/config/package.json
COPY packages/config/typescript ./packages/config/typescript
COPY packages/config/eslint ./packages/config/eslint
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install all dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile

# Stage 3: Build & Prune Production Artifacts
FROM base AS builder
WORKDIR /app

COPY --from=dependencies /app ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Compile shared types and backend typescript
RUN pnpm --filter=@repo/shared-types build
RUN pnpm --filter=@repo/backend build

# Deploy isolated production bundle with pruned dependencies
RUN pnpm --filter=@repo/backend --prod deploy --legacy /prod/backend

# Stage 4: Production Runtime Runner
FROM node:22-alpine AS runner
WORKDIR /app

# Install curl for container healthcheck probe
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=5000

# Create unprivileged system user for process security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy pruned production deployment from builder stage
COPY --from=builder --chown=nodejs:nodejs /prod/backend ./

# Switch to non-root user
USER nodejs

# Expose backend API & WebSocket port
EXPOSE 5000

# Container liveness health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/healthz || exit 1

# Launch backend modular monolith
CMD ["node", "dist/server.js"]
