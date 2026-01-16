# Tasks: Docker 部署工作流与环境标识

## 1. 预发环境徽标组件

- [x] 1.1 创建 `src/components/EnvBadge.astro` 组件
  - 斜向角标设计，固定在左上角
  - 渐变背景色，与博客主题协调
  - 仅在 BASE_URL !== "/" 时显示
- [x] 1.2 在 `Layout.astro` 中引入 EnvBadge 组件
- [x] 1.3 本地测试徽标效果
- [ ] 1.4 部署到 GitHub Pages 验证

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

- [x] 3.1 创建 `.github/workflows/docker-build.yml`
  - workflow_dispatch 手动触发
  - 支持自定义 tag 输入
  - 构建时使用 BASE_PATH=/
  - 推送到 ghcr.io
- [ ] 3.2 配置 GHCR 权限（自动通过 GITHUB_TOKEN）
- [ ] 3.3 测试工作流

## 4. 验证与文档

- [ ] 4.1 测试 Docker 镜像本地运行
- [ ] 4.2 验证生产环境无徽标显示
- [ ] 4.3 更新 README 部署说明

## 验收标准

- [ ] 预发环境（GitHub Pages）左上角显示 "Preview" 徽标
- [ ] 生产环境（Docker）不显示徽标
- [ ] Docker 镜像成功推送到 ghcr.io
- [ ] 手动触发工作流正常执行
