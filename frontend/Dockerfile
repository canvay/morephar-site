# Next.js 16 生产镜像（与 engines 声明一致：Node >=22.13）
FROM node:22-alpine

# 国内构建加速：通过 build-arg 指定 npm 镜像源（默认用官方源，海外构建不受影响）
ARG NPM_REGISTRY=https://registry.npmjs.org

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm_config_registry="$NPM_REGISTRY" YARN_NPM_REGISTRY_SERVER="$NPM_REGISTRY" yarn install --frozen-lockfile

COPY . .

# 构建期注入（NEXT_PUBLIC_* 在 build 时写死）
ARG NEXT_PUBLIC_STRAPI_API_URL
ARG NEXT_PUBLIC_STRAPI_API_TOKEN
ARG NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN
ARG NEXT_PUBLIC_PAGE_LIMIT=6

ENV NEXT_PUBLIC_STRAPI_API_URL=$NEXT_PUBLIC_STRAPI_API_URL
ENV NEXT_PUBLIC_STRAPI_API_TOKEN=$NEXT_PUBLIC_STRAPI_API_TOKEN
ENV NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN=$NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN
ENV NEXT_PUBLIC_PAGE_LIMIT=$NEXT_PUBLIC_PAGE_LIMIT

RUN yarn build

# 瘦身：构建完成后仅保留生产依赖并清理 yarn 缓存，减小镜像体积（加速 push 到 TCR）
RUN npm_config_registry="$NPM_REGISTRY" YARN_NPM_REGISTRY_SERVER="$NPM_REGISTRY" \
      yarn install --production --frozen-lockfile \
 && yarn cache clean

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]
