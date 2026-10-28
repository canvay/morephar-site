#!/usr/bin/env bash
# 服务器侧手动部署（配合 build-and-deploy.yml 的 CI 构建流程）
# 前提:
#   - 本机已 docker login 到镜像仓库（或使用公开镜像），且 .env 含 REGISTRY/REGISTRY_NAMESPACE
#   - docker-compose.prod.yml 与 nginx/nginx.conf 已存在于本目录
#     （通常由 CI 的 SCP 步骤推送；首次手动跑前请先手动 scp 这两个文件）
set -e

cd "$(dirname "$0")"

if [ -n "$REGISTRY_PASSWORD" ]; then
  echo "==> 登录镜像仓库"
  echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USERNAME" --password-stdin
fi

echo "==> 拉取最新镜像"
docker compose -f docker-compose.prod.yml pull

echo "==> 重启服务"
docker compose -f docker-compose.prod.yml up -d

echo "==> 清理悬空镜像"
docker image prune -f

echo "==> 当前状态:"
docker compose -f docker-compose.prod.yml ps

echo "==> 完成。查看日志: docker compose -f docker-compose.prod.yml logs -f"
