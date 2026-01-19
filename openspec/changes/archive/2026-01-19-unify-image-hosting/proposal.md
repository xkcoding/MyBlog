# Proposal: 统一博客图片托管至阿里云 OSS + SSL 证书管理优化

## 概述

1. 将博客中分散在多个来源的图片统一迁移至阿里云 OSS，实现图片资源的集中管理
2. 优化现有 SSL 证书管理工作流，从 HTTP-01 验证改为 DNS-01 验证，实现零停机续期

## 动机

当前博客图片存储分散在多个位置：
- **七牛云** (`static.xkcoding.com`): 116 处引用
- **阿里云 OSS** (`static.aliyun.xkcoding.com`): 5 处引用
- **相对路径** (`/resources/`): 8 处引用（_archive 目录）

**图片托管问题**：
1. 多平台管理增加维护成本
2. 七牛云免费额度可能受限
3. 相对路径图片可能加载失败
4. 难以统一进行图片优化（压缩、CDN 等）

**SSL 证书管理问题**（现有 ssl-manage.yml）：
1. 使用 HTTP-01 验证需要停止 nginx，有服务中断
2. 必须 SSH 到服务器执行，增加复杂度
3. 依赖 80 端口可被外部访问
4. 续期时若端口被占用会失败

## 目标

**图片托管**：
1. 将所有博客图片统一托管到阿里云 OSS
2. 创建自动化迁移脚本，减少手动操作
3. 批量更新 Markdown 文件中的图片链接
4. 保持图片 URL 结构的一致性

**SSL 证书管理优化**：
5. 改用 DNS-01 验证，实现零停机证书续期
6. 统一使用 acme.sh + 阿里云 DNS API
7. 证书管理完全在 GitHub Actions 中完成
8. 新增 CDN SSL 证书自动续期工作流

## 非目标

- 不迁移第三方徽章图片（如 maven-badges.herokuapp.com）
- 不迁移占位图（如 dummyimage.com）
- 不处理 hexo-backup 目录中的历史文件

## 技术方案

### 1. 目标域名选择

**采用方案**：`static.xkcoding.com` + 阿里云 CDN + acme.sh 自动证书续期

```
用户请求 → static.xkcoding.com → 阿里云 CDN (HTTPS) → 阿里云 OSS
                                      ↑
                              acme.sh 自动部署证书
```

**优势**：
- 自定义域名，URL 简洁
- acme.sh 自动申请和续期 Let's Encrypt 证书
- 阿里云 CDN 加速（费用极低，博客场景 < ¥1/月）
- 域名 DNS 保持在阿里云，无需迁移

### 2. 图片迁移流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  扫描 Markdown  │ ──▶ │  下载源图片     │ ──▶ │  上传至 OSS     │
│  提取图片 URL   │     │  到本地临时目录  │     │  保持路径结构   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  验证迁移结果   │ ◀── │  更新 Markdown  │ ◀── │  生成 URL 映射  │
│  检查图片可访问 │     │  替换图片链接   │     │  新旧对照表     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 3. URL 映射规则

| 来源 | 示例 | 目标 |
|------|------|------|
| 七牛云 | `static.xkcoding.com/blog/2019-08-09-xxx.png` | `static.xkcoding.com/blog/2019-08-09-xxx.png` |
| 七牛云 | `static.xkcoding.com/2018-01-03-xxx.jpg` | `static.xkcoding.com/2018-01-03-xxx.jpg` |
| 阿里云旧 | `static.aliyun.xkcoding.com/2021/09/03/xxx.jpg` | `static.xkcoding.com/2021/09/03/xxx.jpg` |
| 相对路径 | `/resources/xxx.png` | `static.xkcoding.com/resources/xxx.png` |

### 4. 工具依赖

- **ossutil**: 阿里云 OSS 命令行工具，用于批量上传
- **Node.js 脚本**: 扫描 Markdown、下载图片、生成映射、批量替换
- **acme.sh**: Let's Encrypt 证书申请工具，支持 DNS-01 验证

### 5. SSL 证书管理优化

**现有方案 vs 优化方案对比**：

| 对比项 | 现有 ssl-manage.yml | 优化后 |
|--------|---------------------|--------|
| 验证方式 | HTTP-01 (standalone) | DNS-01 (dns_ali) |
| 服务中断 | 需要停止 nginx | 零停机 |
| 执行位置 | SSH 到服务器 | GitHub Actions |
| 端口依赖 | 需要 80 端口 | 无需任何端口 |
| 证书工具 | certbot | acme.sh |

**优化后的架构**：

```
GitHub Actions
     │
     ├─ 1. acme.sh --dns dns_ali 申请/续期证书
     │      └─ 自动操作阿里云 DNS TXT 记录
     │
     ├─ 2. 部署到阿里云 CDN (static.xkcoding.com)
     │      └─ acme.sh --deploy-hook ali_cdn
     │
     └─ 3. 部署到阿里云服务器 (xkcoding.com)
            └─ SSH 上传证书 + nginx -s reload
```

**新增/修改的工作流**：

| 工作流 | 用途 | 改动 |
|--------|------|------|
| `ssl-manage.yml` | 博客域名证书 | 重构：HTTP-01 → DNS-01 |
| `cdn-ssl-renew.yml` | CDN 域名证书 | 新增 |

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 图片下载失败 | 脚本记录失败列表，支持断点续传 |
| OSS 上传失败 | 重试机制 + 失败日志 |
| URL 替换出错 | 先生成预览报告，人工确认后执行 |
| 七牛云图片已失效 | 记录 404 图片，手动处理 |

## 迁移统计

| 来源 | 数量 | 说明 |
|------|------|------|
| 七牛云 (`static.xkcoding.com`) | 116 | 主要迁移目标 |
| 相对路径 (`/resources/`) | 8 | _archive 目录 |
| 阿里云旧域名 | 5 | 仅需替换域名 |
| **总计** | **129** | |

## 时间线

- Phase 1: 环境准备（RAM 账号、CDN、DNS、ossutil）
- Phase 2: SSL 工作流优化
- Phase 3: 图片迁移脚本开发
- Phase 4: 执行图片迁移
- Phase 5: 验证与清理

## 相关文件

**新增/修改**：
- `.github/workflows/ssl-manage.yml` - 重构为 DNS-01 验证
- `.github/workflows/cdn-ssl-renew.yml` - 新增 CDN 证书管理
- `scripts/migrate-images.ts` - 图片迁移脚本（待创建）

**需要更新**：
- `src/data/blog/*.md` - 需要更新的 Markdown 文件
- `src/data/blog/_archive/*.md` - 归档目录 Markdown 文件
