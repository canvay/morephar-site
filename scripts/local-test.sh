#!/usr/bin/env bash
# 本地复现生产部署流程（在 Docker Desktop + Git Bash 下运行）
# 不依赖真实镜像仓库：本地 build 镜像，用 docker-compose.localtest.yml 跑 prod 等效拓扑。
# 空库时自动完成初始化：导入种子数据 + 写入与镜像 build arg 匹配的 API token。
# 用法: bash scripts/local-test.sh
set -e

# 切到仓库根目录（脚本在 scripts/ 下）
cd "$(dirname "$0")/.."

COMPOSE="docker compose -f docker-compose.localtest.yml"
SEED_FILE="seed-data.tar.gz"          # 导出方式: cd backend && yarn strapi export --no-encrypt -f ../seed-data
API_TOKEN_VALUE="localtest"           # 必须与 compose 中 NEXT_PUBLIC_* build args 一致
STRAPI_IMAGE="morephar-strapi:localtest"

# 就绪检查: /_health 是 Strapi 内置端点 (204，无需鉴权)
# 注意用 127.0.0.1 而非 localhost：容器内 busybox wget 会把 localhost 解析成 IPv6 而拒连
wait_strapi() {
  local i
  for i in $(seq 1 30); do
    if $COMPOSE exec -T strapi wget -qO- http://127.0.0.1:1337/_health >/dev/null 2>&1; then
      return 0
    fi
    sleep 3
  done
  return 1
}

echo "=================================================="
echo "本地测试: 构建 Strapi + Next 镜像并启动 (端口 8080)"
echo "=================================================="

$COMPOSE up -d --build

echo "==> 等待 Strapi 就绪 (最多 ~90s)..."
if ! wait_strapi; then
  echo "!! Strapi 似乎没起来，查看日志:"
  $COMPOSE logs strapi
  exit 1
fi

# ---------- 空库初始化: 导入种子数据 + 写入 API token ----------
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $API_TOKEN_VALUE" http://localhost:8080/api/global || echo 000)
if [ "$HTTP_CODE" = "200" ]; then
  echo "==> 数据库已初始化，跳过种子导入"
else
  if [ ! -f "$SEED_FILE" ]; then
    echo "!! 找不到 $SEED_FILE，无法初始化空库。请先导出种子:"
    echo "   cd backend && yarn strapi export --no-encrypt -f ../seed-data"
    exit 1
  fi
  echo "==> 检测到空库/无有效 token，导入种子数据..."

  VOLUME_NAME="$(basename "$(pwd)")_strapi_data"
  docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1 || \
    VOLUME_NAME="$(docker volume ls --format '{{.Name}}' | grep strapi_data | head -1)"

  $COMPOSE stop strapi >/dev/null
  docker rm -f strapi-seed-import >/dev/null 2>&1
  # 注意: 这里不能挂 uploads 卷 —— 导入时 Strapi 要把 public/uploads 整体改名做备份，
  # 挂载点跨设备 rename 必失败；媒体文件随后从导入容器拷出再转入正式容器。
  # (pwd -W 输出 Windows 路径，供 docker -v 使用)
  MSYS_NO_PATHCONV=1 docker run --name strapi-seed-import \
    -v "$VOLUME_NAME:/app/.tmp" \
    -v "$(pwd -W 2>/dev/null || pwd)/$SEED_FILE:/tmp/seed.tar.gz" \
    -e APP_KEYS=localtest1,localtest2 \
    -e API_TOKEN_SALT=localtestsalt \
    -e ADMIN_JWT_SECRET=localtestadminjwt \
    -e JWT_SECRET=localtestjwt \
    -e TRANSFER_TOKEN_SALT=localtesttransfer \
    -e HOST=0.0.0.0 -e PORT=1337 \
    "$STRAPI_IMAGE" \
    sh -c "mkdir -p /app/public/uploads && yarn strapi import -f /tmp/seed.tar.gz --force"

  echo "==> 迁移媒体文件到 uploads 卷..."
  TMP_UPLOADS="$(mktemp -d)"
  # MSYS_NO_PATHCONV=1 时 docker.exe 不会转换路径，宿主机路径必须是 Windows 形式
  TMP_UPLOADS_WIN="$(cd "$TMP_UPLOADS" && pwd -W)"
  MSYS_NO_PATHCONV=1 docker cp strapi-seed-import:/app/public/uploads/. "$TMP_UPLOADS_WIN/"
  docker rm strapi-seed-import >/dev/null

  $COMPOSE start strapi >/dev/null
  echo "==> 等待 Strapi 就绪..."
  if ! wait_strapi; then
    echo "!! Strapi 导入后没能起来，查看日志:"
    $COMPOSE logs strapi
    exit 1
  fi

  C_ID="$($COMPOSE ps -q strapi)"
  MSYS_NO_PATHCONV=1 docker cp "$TMP_UPLOADS_WIN/." "$C_ID:/app/public/uploads/"
  rm -rf "$TMP_UPLOADS"

  echo "==> 写入 API token..."
  MSYS_NO_PATHCONV=1 docker cp backend/scripts/init-api-token.cjs "$C_ID:/app/init-api-token.cjs"
  MSYS_NO_PATHCONV=1 docker exec -w /app "$C_ID" node /app/init-api-token.cjs "$API_TOKEN_VALUE"

  $COMPOSE restart strapi >/dev/null
  wait_strapi || true
  echo "==> 初始化完成"
fi

echo "==> Strapi 已就绪。等待 Nginx 反代..."
sleep 3

echo ""
echo "=================================================="
echo "✅ 本地环境已启动，打开以下地址验证:"
echo "   前端首页:    http://localhost:8080/"
echo "   Strapi API:  http://localhost:8080/api"
echo "   后台管理:    http://localhost:8080/admin   (首次需注册管理员)"
echo ""
echo "常用命令:"
echo "   看日志: docker compose -f docker-compose.localtest.yml logs -f"
echo "   停止:   docker compose -f docker-compose.localtest.yml down"
echo "   重置数据: docker compose -f docker-compose.localtest.yml down -v"
echo "=================================================="
