# Tasks: Docker 部署工作流与环境标识

## 状态：✅ 已完成

## 1. 预发环境徽标组件

- [x] 1.1 创建 `src/components/EnvBadge.astro` 组件
  - 斜向角标设计，固定在左上角
  - 渐变背景色，与博客主题协调
  - 使用 IS_PREVIEW 环境变量控制显示
- [x] 1.2 在 `Layout.astro` 中引入 EnvBadge 组件
- [x] 1.3 本地测试徽标效果
- [x] 1.4 部署到 GitHub Pages 验证

## 2. Docker 构建配置

- [x] 2.1 创建 `Dockerfile`
  - 基于 nginx:alpine
  - 复制构建产物到 /usr/share/nginx/html
  - 配置 gzip 压缩
- [x] 2.2 创建 `nginx.conf`
  - 配置 gzip 压缩
  - 配置 404 错误页
  - 配置缓存策略
- [x] 2.3 创建 `.dockerignore`

## 3. GitHub Actions 工作流

- [x] 3.1 创建 `.github/workflows/production-deploy.yml`
  - workflow_dispatch 手动触发
  - 支持自定义 tag 输入
  - 构建时使用 BASE_PATH=/
  - 推送到 ghcr.io
  - 自动部署到阿里云服务器
- [x] 3.2 配置 GHCR 权限（通过 GITHUB_TOKEN）
- [x] 3.3 测试工作流

## 4. SSL 证书管理

- [x] 4.1 创建 `.github/workflows/ssl-manage.yml`
  - 支持 Let's Encrypt 证书申请
  - 自动续期（每月 1 号和 15 号）
  - standalone 模式申请/续期
- [x] 4.2 配置 nginx-ssl.conf（HTTPS 配置）
- [x] 4.3 支持多域名：xkcoding.com, www.xkcoding.com, blog.xkcoding.com

## 5. 预发环境配置

- [x] 5.1 配置自定义域名 blog.preview.xkcoding.com
- [x] 5.2 SEO 防护（robots.txt + noindex meta）
- [x] 5.3 创建 `.github/workflows/preview-deploy.yml`

## 6. 分析与监控

- [x] 6.1 集成 Cloudflare Web Analytics（仅生产环境）

## 验收标准

- [x] 预发环境（GitHub Pages）左上角显示 "Preview" 徽标
- [x] 生产环境（Docker）不显示徽标
- [x] Docker 镜像成功推送到 ghcr.io
- [x] 手动触发工作流正常执行
- [x] HTTPS 证书正常工作（3 个域名）
- [x] 预发环境禁止 SEO 索引
- [x] Cloudflare 统计仅在生产环境生效

## 完成日期

2025-01-16
