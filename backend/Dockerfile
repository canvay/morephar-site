# Strapi 5 生产镜像（Node 22：依赖 preferred-pm@5 要求 >=22.13）
FROM node:22-alpine

# 国内构建加速：通过 build-arg 指定镜像源（默认用官方源，海外构建不受影响）
ARG ALPINE_MIRROR=https://dl-cdn.alpinelinux.org
ARG NPM_REGISTRY=https://registry.npmjs.org

# better-sqlite3 是原生模块，需要 python3 / make / g++ 以及 sqlite 头文件
RUN sed -i "s#https://dl-cdn.alpinelinux.org#${ALPINE_MIRROR}#g" /etc/apk/repositories
RUN apk add --no-cache python3 make g++ sqlite-dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm_config_registry="$NPM_REGISTRY" YARN_NPM_REGISTRY_SERVER="$NPM_REGISTRY" yarn install --frozen-lockfile

COPY . .

# 生产构建（会编译管理后台）
RUN yarn build

# 瘦身：构建完成后仅保留生产依赖，移除 devDependencies 与 yarn 缓存，显著减小镜像体积
# （Strapi 运行只需 production deps；better-sqlite3 原生模块会在重装时重新编译，已在镜像内）
RUN npm_config_registry="$NPM_REGISTRY" YARN_NPM_REGISTRY_SERVER="$NPM_REGISTRY" \
      yarn install --production --frozen-lockfile \
 && yarn cache clean

ENV NODE_ENV=production

# 种子数据：构建时把 seed 包打进镜像；容器首次启动由 docker-entrypoint.sh 自动导入。
# 注意：数据不能写在 /app/.tmp（被 strapi_data 卷覆盖），必须在运行时由 entrypoint 导入。
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# 以 root 启动 entrypoint，便于首次启动时修正 public 目录权限并执行导入；
# 后续如需降权，可在 entrypoint 末尾改用 `su node -c "yarn start"`。
USER root
EXPOSE 1337

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["yarn", "start"]
