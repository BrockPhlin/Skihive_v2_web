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
# 1. 先生成 prisma client(让 @prisma/client 导出 PrismaClient 类)
RUN npx prisma generate
# 2. 然后 build(next build 期间 next 会自动 prisma generate 用错平台,但因为上一步已经生成了 client,类型检查能过)
RUN npm run build
# 3. 再次 prisma generate(覆盖 next build 期间生成的 client,加上正确的 binaryTargets)
RUN npx prisma generate

# Stage 3 — 生产镜像
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_HIDE_UPDATE_MESSAGE=1

# 切换 Alpine 源到清华镜像(国内访问 dl-cdn.alpinelinux.org 太慢)
RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.tuna.tsinghua.edu.cn|g' /etc/apk/repositories

# 安装 OpenSSL (Prisma 运行时可能需要) + curl (healthcheck) + busybox-extras (nc)
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
