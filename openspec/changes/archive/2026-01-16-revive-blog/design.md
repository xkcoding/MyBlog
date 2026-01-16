# Design: 博客迁移到 Astro + AstroPaper

## Context

### 当前状态
- **静态站点生成器**: Hexo 3.9.0（发布于 2019 年，已停止维护）
- **主题**: hexo-theme-next 7.0.0（老版本）
- **CI/CD**: 多套并存（Drone、GitLab CI、Jenkins）
- **部署**: GitHub Pages + Coding Pages（双部署）
- **文章数量**: 91 篇（2016-2022）

### 目标状态
- **静态站点生成器**: Astro 5.x（现代、高性能）
- **主题**: AstroPaper（极简、可访问、SEO 友好）
- **CI/CD**: GitHub Actions 单一流程
- **部署**: GitHub Pages（或 Vercel/Cloudflare Pages）
- **搜索**: Pagefind（内置）
- **评论**: 不需要

### 约束条件
- 需要保持 Markdown 内容的核心兼容性
- 旧 URL 必须通过 301 重定向保持可访问
- 最小化历史内容丢失
- 支持中文内容和 SEO

## Goals / Non-Goals

### Goals
- 迁移到现代、高性能的 Astro 框架
- 使用 AstroPaper 主题获得极简、可访问的设计
- 简化 CI/CD 流程到单一 GitHub Actions
- 实现类型安全的内容管理（Content Collections）
- 提升页面性能（Lighthouse > 95）
- 保留高价值历史内容
- 降低长期维护成本

### Non-Goals
- 完全重写所有历史文章内容
- 实现复杂的动态功能
- 保持与 Hexo 的配置兼容
- 保持完全相同的 URL 结构
- 评论系统（不需要）

## Decisions

### Decision 1: 静态站点生成器

**决策**: Astro 5.x

| 框架 | 性能 | TypeScript | 内容管理 | 学习曲线 |
|------|------|------------|----------|----------|
| **Astro** | 极快 | 原生 | Content Collections | 中 |
| Hexo 7.x | 中等 | 需配置 | 文件夹 | 低 |
| Hugo | 极快 | 无 | 文件夹 | 中 |
| Next.js | 快 | 原生 | 自定义 | 高 |

**理由**:
1. 性能极佳（默认 0 JS）
2. 原生 TypeScript 支持
3. Content Collections 提供类型安全
4. 现代工具链和活跃社区
5. 组件化架构，易于定制

### Decision 2: 主题选择

**决策**: AstroPaper

| 主题 | 风格 | 功能 | 维护状态 | Stars |
|------|------|------|----------|-------|
| **AstroPaper** | 极简 | 完整 | 活跃 | 2.5k+ |
| Astro Blog | 基础 | 简单 | 官方 | - |
| Astro Cactus | 简约 | 中等 | 活跃 | 700+ |

**AstroPaper 特性**:
- 100% 类型安全
- 响应式 + 深色模式
- 无障碍访问 (Accessible)
- Pagefind 搜索内置
- SEO 优化 (Open Graph, JSON-LD)
- 站点地图 + RSS
- 草稿功能

### Decision 3: 项目结构

**决策**: 全新 Astro 项目结构

```
/
├── public/
│   ├── assets/
│   ├── _redirects          # 旧 URL 重定向
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/
│   │       ├── _archive/   # 归档文章（不展示）
│   │       ├── 2018/       # 按年份组织
│   │       ├── 2019/
│   │       └── ...
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── config.ts           # 站点配置
│   └── content.config.ts   # 内容 Schema
├── astro.config.ts
├── package.json
└── tsconfig.json
```

### Decision 4: Frontmatter 转换策略

**决策**: 自动化脚本 + 人工审核

**转换映射**:
| Hexo 字段 | AstroPaper 字段 | 转换规则 |
|-----------|-----------------|----------|
| `title` | `title` | 直接复制 |
| `date` | `pubDatetime` | 转为 ISO 8601 |
| `tags` | `tags` | 转小写、kebab-case |
| `categories` | - | 不使用（用 tags 替代）|
| - | `author` | 固定为 "xkcoding" |
| - | `slug` | 从文件名提取 |
| - | `description` | 从文章提取前 160 字符 |
| - | `featured` | 默认 false |
| - | `draft` | 默认 false |

**转换脚本伪代码**:
```typescript
function convertFrontmatter(hexoPost) {
  return {
    title: hexoPost.title,
    author: "xkcoding",
    pubDatetime: new Date(hexoPost.date).toISOString(),
    slug: extractSlugFromFilename(hexoPost.filename),
    featured: false,
    draft: false,
    tags: hexoPost.tags.map(t => t.toLowerCase().replace(/\s+/g, '-')),
    description: extractDescription(hexoPost.content, 160)
  };
}
```

### Decision 5: URL 重定向

**决策**: 使用 `public/_redirects` 文件

**重定向规则**:
```
# Hexo 旧 URL -> Astro 新 URL
/2018/08/20/spring-boot-global-exception-handler.html  /posts/spring-boot-global-exception-handler/  301
/2019/02/13/design-pattern-simple-factory.html         /posts/design-pattern-simple-factory/         301
# ... 为所有保留文章生成重定向规则
```

**生成策略**: 迁移脚本自动生成重定向文件

### Decision 6: CI/CD

**决策**: GitHub Actions + Astro 官方 Action

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## Risks / Trade-offs

### Risk 1: URL 变更影响 SEO
- **风险**: 旧 URL 失效可能导致搜索排名下降
- **缓解**: 所有旧 URL 配置 301 永久重定向
- **监控**: 部署后使用 Google Search Console 检查索引状态

### Risk 2: 内容迁移丢失
- **风险**: Markdown 语法差异可能导致渲染问题
- **缓解**:
  - 迁移后逐篇检查渲染效果
  - 特别注意代码块、表格、图片路径
- **备份**: 保留原始 `source/_posts/` 目录直到验证完成

### Risk 3: Frontmatter 转换错误
- **风险**: 自动转换可能遗漏或错误转换某些字段
- **缓解**:
  - 脚本生成后人工 review
  - 建立 Zod schema 验证
- **回滚**: 保留原始文件备份

## Migration Plan

### Step 1: 准备阶段
```bash
# 1. 创建工作分支
git checkout -b feature/migrate-to-astro

# 2. 备份当前项目
cp -r source/_posts source/_posts.bak
cp _config.yml _config.yml.bak
```

### Step 2: 初始化 Astro 项目
```bash
# 1. 创建新的 Astro 项目（使用 AstroPaper 模板）
npm create astro@latest -- --template satnaing/astro-paper

# 2. 或者克隆 AstroPaper 并清理示例内容
git clone https://github.com/satnaing/astro-paper.git astro-blog
cd astro-blog
rm -rf src/data/blog/*
```

### Step 3: 配置站点
```typescript
// src/config.ts
export const SITE = {
  website: "https://xkcoding.com/",
  author: "xkcoding",
  profile: "https://github.com/xkcoding",
  desc: "xkcoding的代码成长日记",
  title: "CodingDiary",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  editPost: {
    url: "https://github.com/xkcoding/xkcoding.github.io/edit/main/src/data/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};
```

### Step 4: 迁移文章
```bash
# 运行迁移脚本（需要开发）
node scripts/migrate-hexo-to-astro.js

# 脚本功能：
# 1. 读取 source/_posts/*.md
# 2. 转换 frontmatter
# 3. 调整图片路径
# 4. 生成 _redirects 文件
# 5. 输出到 src/data/blog/
```

### Step 5: 验证与测试
```bash
# 本地开发预览
npm run dev

# 构建测试
npm run build

# 预览构建结果
npm run preview
```

### Step 6: 部署
```bash
# 推送到 GitHub
git add .
git commit -m "feat: migrate from Hexo to Astro with AstroPaper"
git push origin feature/migrate-to-astro

# 创建 PR 并合并后，GitHub Actions 自动部署
```

### Rollback Plan
1. 保留原始 Hexo 项目在 `hexo-backup/` 分支
2. 如迁移失败，可切换回原分支继续使用 Hexo
3. DNS/部署配置变更保持可逆

## Open Questions

1. **部署平台最终选择**: GitHub Pages vs Vercel vs Cloudflare Pages？
   - GitHub Pages: 免费，简单，当前方案
   - Vercel: 更快 CDN，预览部署，推荐
   - Cloudflare Pages: 全球加速好，适合国内访问

2. **文章归档展示**: 归档文章是否需要单独页面展示？还是完全隐藏？

3. **迁移脚本语言**: TypeScript/Node.js 还是 Python？

## Article Review Strategy

### 审查清单格式
参考 upgrade.md 的 checklist 机制：

```markdown
## 文章审查清单

### 状态标记
- [ ] pending - 待审查
- [x] keep - 保留并迁移
- [-] archive - 归档（不展示但保留 URL）
- [~] update - 需更新后迁移
- [!] delete - 删除（无价值）

### 2016 年 (10 篇)
- [ ] 2016-03-21.helloworld.md → 决策: ?
...
```

### 审查流程
1. **生成清单**: 按年份分组列出所有文章
2. **逐篇审查**:
   - 打开文章
   - 评估时效性、独特性、完整性、质量
   - 做出分类决策
   - 记录决策理由（简短）
3. **批量处理**:
   - keep → 运行迁移脚本
   - archive → 移到 `src/data/blog/_archive/`，生成重定向
   - update → 标记待更新，后续处理
   - delete → 生成重定向到 404 或首页
4. **验证**: 检查所有迁移文章渲染正确

### 归档文章处理
- 物理位置: `src/data/blog/_archive/`（下划线前缀不被 AstroPaper 展示）
- URL 重定向: 旧 URL → 新归档 URL 或 404 页面带说明
- 声明: 可在归档文章顶部添加过时声明（通过 frontmatter 控制）
