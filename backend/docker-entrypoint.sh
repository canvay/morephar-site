#!/bin/sh
# Strapi 生产镜像入口：首次启动自动导入种子数据，并修正 public 目录权限
# 构建时种子包已 COPY 进 /app/seed-data.tar.gz；本脚本在容器首次启动时执行导入，
# 之后用 /app/.tmp/.seeded 标记，避免每次重启重复导入。
set -e

echo "[entrypoint] 准备运行时目录与权限 ..."
mkdir -p /app/.tmp /app/public/uploads
# 强制放开 public 权限，避免 strapi import 创建 assets 备份目录时因属主问题失败
chmod -R 777 /app/public 2>/dev/null || true

SEED="/app/seed-data.tar.gz"
FLAG="/app/.tmp/.seeded"

if [ -f "$SEED" ] && [ ! -f "$FLAG" ]; then
  echo "[entrypoint] 首次启动：从 $SEED 导入种子数据 ..."
  if npx strapi import -f "$SEED" --force; then
    echo "[entrypoint] 种子导入成功"
    touch "$FLAG"
  else
    echo "[entrypoint][warn] 种子导入失败，下次容器启动将自动重试"
  fi
else
  echo "[entrypoint] 跳过种子导入（已导入过，或镜像未包含种子文件）"
fi

echo "[entrypoint] 启动 Strapi 服务 ..."
exec yarn start
