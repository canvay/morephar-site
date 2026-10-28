#!/bin/bash
# Tencent Cloud CVM 首次启动初始化脚本
# 用法: 创建 CVM 时，把本脚本粘贴到「自定义数据 / User Data」框（以 #!/bin/bash 开头即可被 cloud-init 执行）
# 作用: 自动安装 Docker + Docker Compose 插件 + git，并预建部署目录。
# 说明: 脚本以 root 在首次开机时运行，耗时约 1-2 分钟（含 Docker 下载）。

set -e

# ===== 可选: 自动克隆仓库（私有库需先在 CVM 配好 Deploy Key；留空则跳过）=====
REPO_URL=""
DEPLOY_DIR="/var/www/morephar"

export DEBIAN_FRONTEND=noninteractive

echo "==> [1/4] 更新 apt 并安装基础依赖"
apt-get update -y
apt-get install -y git curl ca-certificates gnupg

echo "==> [2/4] 安装 Docker 引擎"
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

echo "==> [3/4] 安装 Docker Compose 插件 (v2, 对应 'docker compose')"
apt-get install -y docker-compose-plugin
docker --version
docker compose version

echo "==> [4/4] 创建部署目录"
mkdir -p "$DEPLOY_DIR"

if [ -n "$REPO_URL" ]; then
  echo "==> 克隆仓库到 $DEPLOY_DIR"
  git clone "$REPO_URL" "$DEPLOY_DIR"
fi

echo "=================================================="
echo "初始化完成。后续步骤:"
echo "  1. cd $DEPLOY_DIR"
echo "  2. 创建 .env 并填入真实密钥(APP_KEYS/JWT*/STRAPI_URL) 与 REGISTRY/REGISTRY_NAMESPACE"
echo "     (可参考仓库 .env.example，但 .env 本身不要入库)"
echo "  3. 在 GitHub 仓库配置 Secrets，push main 即自动 SCP 配置 + 拉镜像部署"
echo "  注意: 本方案不再需要 git clone 仓库，运行配置由 CI 用 SCP 推送"
echo "=================================================="
