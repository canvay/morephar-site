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

ENV NODE_ENV=production

EXPOSE 1337

CMD ["yarn", "start"]
