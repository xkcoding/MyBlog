# Proposal: Docker 部署工作流与环境标识

## 状态：✅ 已完成 (2025-01-16)

## 概述

优化现有 GitHub Actions 工作流，支持双环境部署策略：
- **预发环境（GitHub Pages）**：自动部署，带环境徽标标识
- **生产环境（阿里云服务器）**：手动触发，构建 Docker 镜像并推送到 ghcr.io

## 动机

当前博客只有 GitHub Pages 单一部署渠道。用户需要：
1. 在预发环境快速预览更改
2. 确认无误后手动触发生产部署
3. 清晰区分预发/生产环境，避免混淆

## 目标

1. **环境隔离**：预发环境 BASE_PATH=/MyBlog，生产环境 BASE_PATH=/
2. **环境标识**：预发环境左上角显示斜向 "Preview" 徽标
3. **Docker 构建**：生产环境打包为 nginx 镜像
4. **手动触发**：生产部署通过 workflow_dispatch 手动执行
5. **镜像仓库**：使用 GitHub Container Registry (ghcr.io)

## 非目标

- 自动化部署到阿里云服务器（用户手动 docker pull）
- CD 流水线配置
- 多环境配置管理（dev/staging/prod）

## 技术方案

### 1. 环境徽标组件

创建 `EnvBadge.astro` 组件，仅在 BASE_PATH 非 "/" 时渲染：

```astro
---
const isPreview = import.meta.env.BASE_URL !== "/";
---

{isPreview && (
  <div class="env-badge">Preview</div>
)}

<style>
  .env-badge {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    /* 斜向角标效果 */
  }
</style>
```

### 2. GitHub Actions 工作流

```yaml
# deploy.yml - 保持现有 GitHub Pages 部署
# docker-build.yml - 新增 Docker 构建工作流

name: Build Docker Image

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Image tag'
        required: false
        default: 'latest'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build with BASE_PATH=/
      - name: Build & Push to ghcr.io
```

### 3. Dockerfile

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 环境变量污染 | 构建时明确指定 BASE_PATH |
| 镜像体积过大 | 使用 nginx:alpine，多阶段构建 |
| 徽标影响用户体验 | 设计精美、不遮挡内容 |

## 时间线

- Phase 1: 预发环境徽标组件
- Phase 2: Docker 构建工作流
- Phase 3: 测试验证

## 相关文件

- `.github/workflows/deploy.yml` - 现有 GitHub Pages 工作流
- `.github/workflows/docker-build.yml` - 新增 Docker 工作流
- `src/components/EnvBadge.astro` - 新增环境徽标组件
- `src/layouts/Layout.astro` - 引入徽标组件
- `Dockerfile` - Docker 镜像配置
- `nginx.conf` - Nginx 配置

## 实际实现总结

### 超出原计划的功能

1. **SSL 证书自动化管理**
   - 创建 `ssl-manage.yml` 工作流
   - Let's Encrypt 证书自动申请和续期
   - 支持 3 个域名：xkcoding.com, www.xkcoding.com, blog.xkcoding.com

2. **自动部署到阿里云**
   - 原计划为手动 docker pull，实际实现了完整自动化部署
   - 通过 SSH 连接阿里云服务器执行部署

3. **预发环境自定义域名**
   - 配置 blog.preview.xkcoding.com 作为预发环境域名
   - 创建 CNAME 文件

4. **SEO 防护**
   - 预发环境使用 robots-preview.txt 禁止爬虫
   - 添加 noindex meta 标签

5. **Cloudflare Web Analytics**
   - 集成访问统计（仅生产环境）

### 最终文件结构

```
.github/workflows/
├── preview-deploy.yml    # 预发环境部署（GitHub Pages）
├── production-deploy.yml # 生产环境部署（Docker + 阿里云）
└── ssl-manage.yml        # SSL 证书管理

src/components/
└── EnvBadge.astro        # 环境徽标组件

src/layouts/
└── Layout.astro          # 集成 EnvBadge、Cloudflare Analytics

public/
├── CNAME                 # 预发域名配置
├── robots.txt            # 生产环境 robots
└── robots-preview.txt    # 预发环境 robots（禁止 SEO）

Dockerfile                # Docker 镜像配置
nginx.conf                # Nginx 配置
.dockerignore             # Docker 忽略文件
```

### 环境变量

- `IS_PREVIEW`: 区分预发/生产环境（astro:env/server）
- `BASE_PATH`: 基础路径配置
