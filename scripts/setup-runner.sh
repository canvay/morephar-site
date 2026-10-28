#!/usr/bin/env bash
# 在腾讯云 CVM 上一次性安装 GitHub self-hosted runner（配合两条 deploy-*.yml 工作流）
#
# 用法:
#   bash scripts/setup-runner.sh <REPO_URL> <REGISTRATION_TOKEN>
#
#   REPO_URL          例如 https://github.com/owner/morephar-site
#   REGISTRATION_TOKEN 在 GitHub 仓库
#                      Settings -> Actions -> Runners -> New self-hosted runner
#                      页面里复制到的 --token 值（注册令牌 1 小时内有效，用完即弃）
#
# 前置: CVM 已装好 Docker + docker compose 插件（见 scripts/cvm-bootstrap.sh）
#
# 行为:
#   - 下载 actions-runner 到 ~/actions-runner
#   - 以 root 身份注册并安装为系统服务（root 可直接使用 docker.sock，无需 sudo 前缀）
#   - 启动服务；GitHub Runners 列表里该机器会显示 Idle 即表示就绪
#
# 卸载: sudo ~/actions-runner/svc.sh stop && sudo ~/actions-runner/svc.sh uninstall
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "用法: bash setup-runner.sh <REPO_URL> <REGISTRATION_TOKEN>" >&2
  exit 1
fi

RUNNER_DIR=~/actions-runner
mkdir -p "$RUNNER_DIR" && cd "$RUNNER_DIR"

# 下载 runner（Linux x64，固定稳定版）。
# 国内 CVM 直连 github.com 常超时，优先走镜像代理，逐级回退。
RUNNER_VER=2.338.0
RUNNER_FILE=actions-runner-linux-x64-${RUNNER_VER}.tar.gz

download_runner() {
  local url="$1"
  echo "==> 尝试下载: $url"
  if curl -fsSL --connect-timeout 20 --max-time 300 -o "$RUNNER_FILE" "$url"; then
    return 0
  fi
  echo "    失败，尝试下一个源 ..."
  return 1
}

download_runner "https://ghproxy.com/https://github.com/actions/runner/releases/download/v${RUNNER_VER}/${RUNNER_FILE}" \
 || download_runner "https://mirror.ghproxy.com/https://github.com/actions/runner/releases/download/v${RUNNER_VER}/${RUNNER_FILE}" \
 || download_runner "https://ghproxy.net/https://github.com/actions/runner/releases/download/v${RUNNER_VER}/${RUNNER_FILE}" \
 || download_runner "https://github.com/actions/runner/releases/download/v${RUNNER_VER}/${RUNNER_FILE}" \
 || { echo "下载失败：请在本机下载 ${RUNNER_FILE} 后 SCP 到 ${RUNNER_DIR}/ 再继续"; exit 1; }

tar xzf "./${RUNNER_FILE}"

# 配置（--unattended 非交互；打 morephar 标签便于将来精确匹配）
echo "==> 配置 runner ..."
./config.sh --url "$1" --token "$2" --unattended \
  --name "morephar-cvm" --labels "morephar" --runnergroup "Default"

# 若已是 root 则无需 sudo；非 root 才加 sudo 提权
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

# 安装并启动为系统服务（root 或 sudo 用户，确保有 docker 权限）
echo "==> 安装并启动为系统服务 ..."
$SUDO ./svc.sh install
$SUDO ./svc.sh start

# 兜底：若当前用户非 root 且不在 docker 组，补权限后重启服务
if [ "$(id -u)" -ne 0 ] && ! groups | tr ' ' '\n' | grep -qx docker; then
  sudo usermod -aG docker "$USER"
  sudo ./svc.sh stop && sudo ./svc.sh start
fi

echo "==> 完成。请在 GitHub 仓库 Settings -> Actions -> Runners 确认该 runner 状态为 Idle。"
echo "    之后 push 到 main 或手动 Run workflow 即可触发自托管部署。"
