# Change: 博客复兴计划 - 迁移到 Astro + AstroPaper

## Why

博客自 2022 年 1 月后断更近 3 年，存在以下问题需要解决：

1. **技术栈严重过时**：Hexo 3.9.0（最新 7.x）、NexT 7.0.0（最新 8.x），存在安全隐患和性能问题
2. **内容质量参差不齐**：91 篇文章中，部分早期文章已失去时效性（如 Eclipse 使用技巧、CentOS 6 安装等）
3. **基础设施冗余**：存在 Drone、GitLab CI、Jenkins 三套 CI 配置，维护成本高
4. **第三方服务过时**：LeanCloud 访问统计等服务可能不再稳定

## What Changes

### Phase 1: 技术架构迁移（Hexo → Astro）
- **BREAKING**: 从 Hexo 3.9.0 完全迁移到 Astro 5.x
- **BREAKING**: 使用 AstroPaper 主题（minimal、accessible、SEO-friendly）
- 重构项目目录结构以适配 Astro Content Collections
- 转换文章 frontmatter 格式（Hexo → Astro）
- 统一 CI/CD 为 GitHub Actions，移除其他 CI 配置

### Phase 2: 内容审查与清理
- 创建 `.article-review-checklist.md` 审查清单
- 逐篇 review 全部 91 篇文章，参考以下标准评估：
  - 时效性：技术版本是否过时
  - 独特价值：是否有原创见解
  - 完整性：内容是否完整
  - 质量：写作质量如何
- 分类处理：保留 / 需更新 / 归档
- 迁移保留的文章到 `src/data/blog/` 目录

### Phase 3: 配置与功能优化
- 搜索功能：使用 Pagefind（AstroPaper 内置支持）
- 优化 SEO 元数据
- 更新关于页面和社交链接
- **注意**：不需要评论系统

## Impact

- **Affected specs**:
  - `blog-architecture` - 博客技术架构规格（全新）
  - `content-management` - 内容管理规格

- **Affected code/files**:
  - 整个项目结构重构
  - `package.json` - 完全替换为 Astro 依赖
  - `source/_posts/*.md` → `src/data/blog/*.md` - 文章迁移
  - `_config.yml` → `src/config.ts` - 配置迁移
  - `.drone.yml`, `.gitlab-ci.yml`, `.jenkins/` - CI 配置删除
  - `themes/` - 主题目录删除（Astro 使用组件化方式）

- **Breaking changes**:
  - URL 结构简化：`/:year/:month/:day/:title.html` → `/:date-:title.html`（如 `/2019-02-13-design-pattern-simple-factory.html`）
  - 需要设置 301 重定向保持旧链接可访问
  - 主题配置完全不同
  - 构建命令变化：`hexo generate` → `astro build`

## Tech Stack Comparison

| 特性 | Hexo (旧) | Astro + AstroPaper (新) |
|------|-----------|-------------------------|
| 框架版本 | 3.9.0 (2019) | 5.x (2024/2025) |
| 构建速度 | 中等 | 极快 |
| 类型安全 | 无 | TypeScript 原生支持 |
| 内容管理 | 文件夹 | Content Collections (类型安全) |
| 搜索 | 需插件 | Pagefind 内置 |
| SEO | 需配置 | 开箱即用 |
| 主题 | NexT 7.0 | AstroPaper (现代、极简) |
| 性能 | 良好 | 极优 (0 JS by default) |

## AstroPaper 特性

- ✅ 100% 类型安全 (TypeScript + Zod)
- ✅ 响应式设计 + 深色模式
- ✅ 无障碍访问 (Accessible)
- ✅ SEO 友好 (Open Graph, JSON-LD)
- ✅ Pagefind 搜索内置
- ✅ 草稿功能
- ✅ 分页支持
- ✅ 站点地图 + RSS
- ✅ 代码高亮 (Shiki)

## Migration Strategy

### Frontmatter 转换示例

**Hexo 格式 (旧)**:
```yaml
---
title: Spring Boot 全局异常处理
date: 2018-08-20 10:00:00
tags:
  - Spring Boot
  - Java
categories:
  - 后端开发
---
```

**Astro/AstroPaper 格式 (新)**:
```yaml
---
title: Spring Boot 全局异常处理
author: xkcoding
pubDatetime: 2018-08-20T10:00:00+08:00
slug: spring-boot-global-exception-handler
featured: false
draft: false
tags:
  - spring-boot
  - java
description: Spring Boot 全局异常处理最佳实践
---
```

### URL 重定向规划（优先级：低，最后处理）

> **注意**：URL 变更带来的 SEO 影响暂时不考虑，重定向作为最后的优化步骤。

| 旧 URL | 新 URL |
|--------|--------|
| `/2018/08/20/spring-boot-global-exception-handler.html` | `/2018-08-20-spring-boot-global-exception-handler.html` |
| `/2019/02/13/design-pattern-simple-factory.html` | `/2019-02-13-design-pattern-simple-factory.html` |

可选：后续在 `public/_redirects` 配置 301 重定向。

## Success Metrics

- [ ] Astro 项目成功构建，无错误
- [ ] 所有 91 篇文章完成审查并分类
- [ ] 保留的文章成功迁移到 AstroPaper 格式
- [ ] CI/CD 精简为单一 GitHub Actions 流程
- [ ] 网站可正常构建和部署
- [ ] Lighthouse Score: Performance > 95, Accessibility > 95
- [ ] Pagefind 搜索功能正常
- [ ] （可选）旧 URL 301 重定向配置
