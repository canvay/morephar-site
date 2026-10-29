#!/bin/sh
# Strapi 生产镜像入口：首次启动自动导入种子数据
#
# 已知坑（已修复）：
#   strapi import 在导入含 assets 时，会在 #handleAssetsBackup 里把 /app/public/uploads
#   这个目录 rename 成 uploads_backup_<ts>（源码用的是 fse.move → rename）。
#   但 /app/public/uploads 是挂载卷，Linux 不允许对挂载点做 rename（EXDEV），
#   于是报 "The backup folder for the assets could not be created inside the public folder"。
#   该报错与真实权限无关（root + 777 也会失败），根因就是「对挂载点 rename」。
#
# 解决思路：
#   1) 用 --exclude files 跳过二进制媒体文件的备份/移动（绕开挂载点 rename），
#      upload.file 等数据库记录仍会正常导入；
#   2) 再把种子包里的 assets/uploads/* 直接拷进可写的 uploads 卷，
#      既绕开挂载点问题，又保证站点图片不裂。
#   3) < /dev/null 切断 stdin，避免交互式确认提示在无 TTY 的容器里卡住。
set -e

echo "[entrypoint] 准备运行时目录与权限 ..."
mkdir -p /app/.tmp /app/public/uploads

SEED="/app/seed-data.tar.gz"
FLAG="/app/.tmp/.seeded"
LOG="/app/.tmp/import.log"

if [ -f "$SEED" ] && [ ! -f "$FLAG" ]; then
  echo "[entrypoint] 首次启动：导入种子数据（跳过 assets 备份，媒体文件稍后恢复）..."
  {
    echo "==== import diagnostics $(date) ===="
    echo "uid/gid: $(id)"
    echo "pwd: $(pwd)"
  } > "$LOG" 2>&1

  # --exclude files：跳过二进制媒体文件的备份/移动（绕开挂载点 rename 失败），
  # 数据库记录(upload.file 等)仍会导入；媒体文件随后从种子包直接拷入 uploads 卷。
  if yarn strapi import -f "$SEED" --exclude files --force < /dev/null >> "$LOG" 2>&1; then
    echo "[entrypoint] 数据库导入成功"

    # 从种子包恢复媒体文件到可写的 uploads 卷（与挂载点 rename 无关，纯复制）
    if tar tzf "$SEED" 2>/dev/null | grep -q '^assets/uploads/'; then
      echo "[entrypoint] 恢复媒体文件到 /app/public/uploads ..."
      rm -rf /tmp/seed_assets
      mkdir -p /tmp/seed_assets /app/public/uploads
      tar xzf "$SEED" -C /tmp/seed_assets assets/uploads 2>/dev/null || true
      cp -rn /tmp/seed_assets/assets/uploads/. /app/public/uploads/ 2>/dev/null \
        || echo "[entrypoint][WARN] 媒体文件复制有遗漏，请检查 /app/public/uploads 权限"
      echo "[entrypoint] 媒体文件恢复完成"
    fi

    touch "$FLAG"
    echo "[entrypoint] 种子导入完成（标记已写入 $FLAG）"
  else
    echo "[entrypoint][ERROR] 种子导入失败，完整日志：docker exec <strapi容器> cat /app/.tmp/import.log"
  fi
else
  echo "[entrypoint] 跳过种子导入（已导入过，或镜像未包含 $SEED）"
fi

echo "[entrypoint] 启动 Strapi 服务 ..."
exec yarn start
