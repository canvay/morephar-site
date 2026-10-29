#!/bin/sh
# Strapi 生产镜像入口：首次启动自动导入种子数据，并修正 public / .tmp 目录权限
# 构建时种子包已 COPY 进 /app/seed-data.tar.gz；本脚本在容器首次启动时执行导入，
# 之后用 /app/.tmp/.seeded 标记，避免每次重启重复导入。
set -e

echo "[entrypoint] 准备运行时目录与权限 ..."
mkdir -p /app/.tmp /app/public/uploads

SEED="/app/seed-data.tar.gz"
FLAG="/app/.tmp/.seeded"
LOG="/app/.tmp/import.log"

if [ -f "$SEED" ] && [ ! -f "$FLAG" ]; then
  echo "[entrypoint] 首次启动：从 $SEED 导入种子数据 ..."
  # 先把诊断信息 + strapi 完整报错写进日志，便于排查（/app/.tmp 为持久卷，可 docker exec 读取）
  {
    echo "==== import diagnostics $(date) ===="
    echo "uid/gid: $(id)"
    echo "pwd: $(pwd)"
    echo "--- perms ---"
    ls -ld /app/public /app/public/uploads /app/.tmp
    echo "--- write test (as $(id -u)) ---"
    if touch /app/public/.wtest 2>/dev/null; then echo "public writable: YES"; rm -f /app/public/.wtest; else echo "public writable: NO ($?)"; fi
    if touch /app/.tmp/.wtest 2>/dev/null; then echo ".tmp writable: YES"; rm -f /app/.tmp/.wtest; else echo ".tmp writable: NO ($?)"; fi
    echo "--- running: npx strapi import -f $SEED --force ---"
  } > "$LOG" 2>&1

  # < /dev/null 切断 stdin，避免 strapi import 的交互式确认提示卡住（容器内无 TTY 会一直等待）
  if yarn strapi import -f "$SEED" --force < /dev/null >> "$LOG" 2>&1; then
    echo "[entrypoint] 种子导入成功"
    touch "$FLAG"
  else
    echo "[entrypoint][ERROR] 种子导入失败，完整日志：docker exec <strapi容器> cat /app/.tmp/import.log"
  fi
else
  echo "[entrypoint] 跳过种子导入（已导入过，或镜像未包含 $SEED）"
fi

echo "[entrypoint] 启动 Strapi 服务 ..."
exec yarn start
