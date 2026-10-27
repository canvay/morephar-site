# Morephar 站点

基于 **Strapi 5 + Next.js 16** 的企业官网 / 博客模板（fork 自 [strapi/nextjs-corporate-starter](https://github.com/strapi/nextjs-corporate-starter)，已全面升级依赖并适配新版 API）。

![demo-site](https://user-images.githubusercontent.com/6153188/231865321-0da5e81f-4832-4cce-bcd1-ecd79e9b9cc3.gif)

## 技术栈

### 前端（`frontend/`）

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Next.js（App Router） | 16.x |
| UI 库 | React | 19.x |
| 语言 | TypeScript | 5.9 |
| 样式 | Tailwind CSS | 4.x |
| 组件 | Headless UI / Heroicons / react-icons | 2.x / 2.x / 5.x |
| 内容渲染 | react-markdown + remark-gfm | 10.x / 4.x |
| 轮播 | react-slideshow-image | 4.x |

### 后端（`backend/`）

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| CMS | Strapi（Community Edition） | 5.59 |
| 数据库 | SQLite（better-sqlite3） | 13.x |
| 图片处理 | sharp | 0.35 |
| 插件 | @strapi/plugin-seo / @strapi/plugin-users-permissions | 2.x / 5.59 |

### 工程化

- **运行环境**：Node.js ≥ 20，Yarn 1.x
- **多进程启动**：concurrently
- **国际化**：`[lang]` 路由段 + negotiator / @formatjs/intl-localematcher 语言协商（`middleware.ts` 自动跳转）

## 项目结构

```
morephar-site/
├── frontend/          # Next.js 前端
│   └── src/app/[lang]/  # 按语言划分的页面与组件
├── backend/           # Strapi CMS 后端
│   ├── config/        # 数据库、中间件等配置
│   ├── src/api/       # 内容类型：文章、作者、分类、页面、产品等
│   └── src/components/# 可复用内容组件
└── seed-data.tar.gz   # 示例内容备份（用于一键导入）
```

## 环境要求

- Node.js ≥ 20（建议使用 nvm 管理版本）
- Yarn 1.22+

## 快速开始

1. 克隆仓库并安装前后端依赖：

```bash
yarn setup
```

2. 创建后端环境变量文件 `backend/.env`（可参考 `backend/.env.example`）：

```bash
HOST=localhost
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
```

3. 创建前端环境变量文件 `frontend/.env`（可参考 `frontend/.env.example`）：

```bash
NEXT_PUBLIC_STRAPI_API_TOKEN=your-api-token
NEXT_PUBLIC_PAGE_LIMIT=6
NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN=your-form-submission-token
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```

4. 一键启动前后端：

```bash
yarn dev
```

也可以分别启动：

```bash
# 后端（http://localhost:1337）
cd backend && yarn develop
# 前端（http://localhost:3000）
cd frontend && yarn dev
```

5. 首次启动后访问 `http://localhost:1337/admin` 注册管理员账号。

## 导入示例数据（可选）

项目根目录的 `seed-data.tar.gz` 是一份内容备份，可通过 Strapi 数据传输功能导入：

```bash
yarn seed
```

> 注：该备份已修复为 Strapi 5 兼容格式，可直接导入（包含文章、页面、媒体等示例内容）。之后也可以用 `yarn export` 随时导出你自己的备份。

## 配置 API Token

前端需要两个 Strapi API Token。在后台 **Settings → API Tokens → Create new API Token** 中创建：

**1. 内容读取 Token**（对应 `NEXT_PUBLIC_STRAPI_API_TOKEN`）

- Token 类型：Custom，有效期 Unlimited
- 权限：

| 内容类型 | 权限 |
| --- | --- |
| Article | find、findOne |
| Author | find、findOne |
| Category | find、findOne |
| Global | find |
| Page | find、findOne |
| Product-feature | find、findOne |

> 也可以直接创建一个 **Read-only** 类型的 Token，一次性获得所有端点的只读权限。

**2. 表单提交 Token**（对应 `NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN`）

| 内容类型 | 权限 |
| --- | --- |
| Lead-Form-Submission | create |

## 常用脚本

在项目根目录执行：

| 命令 | 说明 |
| --- | --- |
| `yarn setup` | 安装根目录及前后端依赖 |
| `yarn dev` | 清理缓存并同时启动前后端 |
| `yarn frontend` / `yarn backend` | 单独启动前端 / 后端 |
| `yarn seed` | 导入 `seed-data.tar.gz` 示例数据 |
| `yarn export` | 将当前内容导出为备份文件 |
| `yarn clear` | 清理前端 `.next` 构建缓存 |
| `yarn repo:upstream` | 同步上游模板的最新改动 |

## 常见问题

**如何新增页面？**
在 Strapi 后台的 Content Manager 中创建 Page 类型的内容，并在页面构建器里添加所需的动态区块（Dynamic Zone）即可，前端会自动渲染对应路由。

**如何升级 Strapi？**
在 `backend/` 目录执行：

```bash
npx @strapi/upgrade latest     # 先用 --dry 预览
```

## 关于模板

本项目模板由 [Trecia](https://github.com/TreciaKS)、[Daniel](https://github.com/malgamves) 和 [Paul](https://github.com/PaulBratslavsky) 创建，在此感谢他们的工作。如发现问题欢迎提 issue。

Strapi Community Edition 是免费开源的无头 CMS：

- **自托管或云部署**：可部署到 Strapi Cloud、AWS、Azure、Google Cloud、DigitalOcean 等任意平台
- **现代化管理后台**：优雅、可定制、可扩展
- **多数据库支持**：PostgreSQL、MySQL、MariaDB、SQLite
- **国际化**：内置 i18n 插件，支持多语言内容管理
- **基于角色的权限控制**：为管理员和终端用户创建任意数量的自定义角色
- **REST 或 GraphQL**：按需选择 API 风格
