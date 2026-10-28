# Strapi 5 生产镜像（Node 22：依赖 preferred-pm@5 要求 >=22.13）
FROM node:22-alpine

# better-sqlite3 是原生模块，需要 python3 / make / g++ 以及 sqlite 头文件
RUN apk add --no-cache python3 make g++ sqlite-dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# 生产构建（会编译管理后台）
RUN yarn build

ENV NODE_ENV=production

EXPOSE 1337

CMD ["yarn", "start"]
