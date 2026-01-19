# Tasks: 统一博客图片托管至阿里云 OSS + SSL 证书管理优化

> **状态：已完成** ✅
> **完成日期：2026-01-19**
> **实际使用域名：`cdn.xkcoding.com`**（替代原计划的 `static.xkcoding.com`）

## Phase 1A: 环境准备（先行）

- [x] 1.1 创建阿里云 RAM 子账号
  - 登录阿里云控制台 → RAM 访问控制
  - 创建子账号，勾选「OpenAPI 调用访问」
  - 授予权限：DNS (alidns) + CDN + OSS + AliyunCDNFullAccess
  - 创建并记录 AccessKey

- [x] 1.2 配置 GitHub Secrets
  - `ALIYUN_ACCESS_KEY_ID`: 阿里云 AccessKey ID
  - `ALIYUN_ACCESS_KEY_SECRET`: 阿里云 AccessKey Secret
  - `GHCR_TOKEN`: GitHub Container Registry Token

- [x] 1.5 安装配置 ossutil（本地）
  - 下载 ossutil 命令行工具
  - 使用 RAM 子账号的 AccessKey 配置
  - 验证连接到 OSS bucket

- [x] 1.6 OSS Bucket 配置
  - Bucket: `xkcoding-blog`
  - 配置公开读权限
  - 配置 Referer 防盗链白名单（localhost, *.xkcoding.com）
  - 启用原图保护，配置图片处理样式 `tag_compress`

## Phase 1B: 域名切换

- [x] 1.3 开通并配置阿里云 CDN
  - 开通 CDN 服务（按流量计费）
  - 添加加速域名 `cdn.xkcoding.com`
  - 源站设置为 OSS: `xkcoding-blog.oss-cn-hangzhou.aliyuncs.com`

- [x] 1.4 配置 DNS 解析
  - 在阿里云 DNS 添加 CNAME 记录
  - `cdn` → CDN 分配的 CNAME 地址
  - 验证解析生效

## Phase 2: SSL 工作流优化

- [x] 2.1 创建 CDN SSL 证书工作流
  - 创建 `.github/workflows/cdn-ssl-renew.yml`
  - 使用 acme.sh + dns_ali 申请证书
  - 使用阿里云 CLI 部署证书到 CDN（SetCdnDomainSSLCertificate API）
  - 每月 1 号和 15 号自动执行

- [x] 2.2 重构博客 SSL 证书工作流
  - 修改 `.github/workflows/ssl-manage.yml`
  - 从 HTTP-01 (certbot standalone) 改为 DNS-01 (acme.sh dns_ali)
  - 证书申请在 GitHub Actions 完成
  - 通过 SCP 上传证书 + SSH reload nginx
  - 删除停止/启动 nginx 的逻辑，实现零停机续期

- [x] 2.3 验证 SSL 工作流
  - 手动触发两个工作流测试
  - 验证 `https://xkcoding.com` 证书正常
  - 验证 `https://cdn.xkcoding.com` 证书正常

## Phase 3: 图片迁移脚本开发

- [x] 3.1 创建图片扫描脚本
  - 扫描所有 Markdown 文件
  - 提取图片 URL（七牛云、相对路径等）
  - 生成图片清单

- [x] 3.2 创建图片下载脚本
  - 批量下载图片到本地临时目录
  - 保持原有路径结构

- [x] 3.3 创建 OSS 上传脚本
  - 使用 ossutil 批量上传图片
  - 保持路径结构一致

- [x] 3.4 创建 URL 替换脚本
  - 使用 perl 脚本批量替换 URL
  - 统一添加图片处理参数 `?x-oss-process=style/tag_compress`

> **注意**：迁移脚本在 CI 检查失败后已删除，保持仓库整洁

## Phase 4: 执行图片迁移

- [x] 4.1 下载七牛云图片
  - 成功下载 116 张图片

- [x] 4.2 下载其他来源图片
  - 处理相对路径图片
  - 处理阿里云旧域名图片

- [x] 4.3 上传图片到 OSS
  - 批量上传 139 张图片到 `xkcoding-blog` bucket
  - 验证上传成功

- [x] 4.4 更新 Markdown 文件
  - 更新 49 个 Markdown 文件
  - 统一使用 `cdn.xkcoding.com` 域名
  - 添加图片处理参数

## Phase 5: 验证与清理

- [x] 5.1 验证图片可访问
  - 配置 Referer 防盗链后验证
  - 所有图片正常返回 200

- [x] 5.2 本地构建测试
  - `pnpm build` 构建成功
  - 无图片加载错误

- [x] 5.3 部署预发环境验证
  - GitHub Pages 预发环境正常
  - robots.txt 正确替换禁止 SEO 索引

- [x] 5.4 部署生产环境验证
  - 阿里云服务器部署成功
  - 所有图片正常加载

- [x] 5.5 清理临时文件
  - 删除迁移脚本目录 `scripts/migrate-images/`
  - 清理本地临时文件

## 额外完成的工作

- [x] 优化生产部署工作流 `production-deploy.yml`
  - 增加 SSH 命令超时时间到 15 分钟
  - 改用 SCP 上传 nginx 配置文件（避免 YAML heredoc 问题）
  - 添加 Docker 镜像清理逻辑（只保留最新 3 个版本）

- [x] 添加 Nginx 安全头
  - `Strict-Transport-Security` (HSTS) with `includeSubDomains; preload`
  - `Content-Security-Policy: upgrade-insecure-requests`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

- [x] 修复 "证书错误内容" 安全警告
  - 通过 CSP `upgrade-insecure-requests` 自动升级 HTTP 请求

## 验收标准 ✅

**图片托管**：
- [x] 所有博客图片从统一域名 `cdn.xkcoding.com` 加载
- [x] 图片通过 HTTPS 访问，无混合内容警告
- [x] 本地构建无图片相关警告
- [x] 预发和生产环境图片正常显示

**SSL 证书管理**：
- [x] `ssl-manage.yml` 使用 DNS-01 验证，零停机续期
- [x] `cdn-ssl-renew.yml` 自动管理 CDN 证书
- [x] 两个工作流都可手动触发和定时执行
- [x] 证书续期不再需要停止 nginx

## 迁移统计

| 指标 | 数量 |
|------|------|
| 迁移图片总数 | 139 张 |
| 更新文件数 | 49 个 |
| CDN 域名 | cdn.xkcoding.com |
| OSS Bucket | xkcoding-blog |
| 图片处理样式 | tag_compress |
