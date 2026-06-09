# Stage 1 — 安装完整依赖 (跳过 postinstall,等 build 阶段再 prisma generate)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Stage 2 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN npx prisma generate
RUN npm run build

# Stage 3 — 生产镜像
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 安装 OpenSSL (Prisma 运行时可能需要) + curl (healthcheck)
RUN apk add --no-cache openssl curl busybox-extras

# 复制必要文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

ENTRYPOINT ["./entrypoint.sh"]
