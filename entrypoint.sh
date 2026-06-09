#!/bin/sh
set -e

echo "==> [entrypoint] 等待 PostgreSQL 端口 5432 通..."
# 等待数据库端口可用(避免 migrate 一直 fail 重试)
for i in $(seq 1 60); do
  if nc -z postgres 5432 2>/dev/null; then
    echo "==> [entrypoint] PostgreSQL 端口就绪"
    break
  fi
  echo "==> [entrypoint] 等待数据库端口 (第 $i 次)..."
  sleep 2
done

echo "==> [entrypoint] 跑 prisma migrate deploy..."
# 不再用 grep 匹配输出,直接 set -e 在失败时退出
npx prisma migrate deploy --schema=./prisma/schema.prisma
echo "==> [entrypoint] 数据库迁移完成"

# Seed 管理员账号 (admin/123456)
echo "==> [entrypoint] 初始化管理员账号..."
npx tsx prisma/seed.ts || echo "==> [entrypoint] seed 已存在,跳过"

echo "==> [entrypoint] 启动 Next.js..."
exec npx next start
