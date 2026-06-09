#!/bin/sh
set -e

echo "==> [entrypoint] 等待 PostgreSQL 就绪..."
until npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 | grep -qE "Already in sync|applied|baseline"; do
  echo "==> [entrypoint] 数据库未就绪，重试..."
  sleep 3
done
echo "==> [entrypoint] 数据库迁移完成"

# Seed 管理员账号 (admin/123456)
echo "==> [entrypoint] 初始化管理员账号..."
npx tsx prisma/seed.ts || echo "==> [entrypoint] seed 已存在，跳过"

echo "==> [entrypoint] 启动 Next.js..."
exec npx next start
