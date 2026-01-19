# Change: 添加侧边栏文章目录 (Table of Contents)

## Why

当前博客的 TOC 机制是内联式的（需要在文章中手动添加 `## Table of contents` 占位符），无法自动生成，也不支持：
- 侧边栏浮动显示
- 滚动时自动高亮当前阅读位置
- 点击跳转到对应章节

长文章阅读体验较差，读者难以快速定位内容。

## What Changes

- **新增** `TableOfContents.astro` 组件：侧边栏浮动 TOC
- **修改** `PostDetails.astro` 布局：集成 TOC 组件，调整文章区域布局
- **新增** TOC 相关样式：响应式设计、高亮当前章节
- **新增** `SITE.showToc` 配置项：全局开关
- **新增** frontmatter `hideToc` 字段：单篇文章禁用 TOC

## Impact

- Affected specs: `blog-reading` (新增)
- Affected code:
  - `src/components/TableOfContents.astro` (新建)
  - `src/layouts/PostDetails.astro` (修改布局)
  - `src/styles/global.css` (新增 TOC 样式)
  - `src/config.ts` (新增配置项)
  - `src/content.config.ts` (新增 frontmatter schema)

## Design Considerations

### 布局方案

采用 CSS Grid 三栏布局：
- 左侧：留白（可选放置其他元素）
- 中间：文章内容（保持现有 `max-w-4xl` 宽度）
- 右侧：TOC 侧边栏（固定定位，宽度约 200-250px）

### 响应式策略

| 屏幕宽度 | TOC 行为 |
|---------|---------|
| `< 1280px` (xl) | 隐藏侧边栏 TOC |
| `>= 1280px` | 显示侧边栏 TOC |

移动端继续依赖原有的 remark-toc 内联目录（如有需要）。

### 高亮逻辑

使用 Intersection Observer API 监听各标题进入视口，动态高亮当前章节。
