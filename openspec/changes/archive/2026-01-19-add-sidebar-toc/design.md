## Context

博客使用 Astro + AstroPaper 主题，当前文章详情页 (`PostDetails.astro`) 采用单栏布局，最大宽度 `max-w-4xl`。需要在不破坏现有布局的前提下，添加侧边栏 TOC。

Astro 的 `render()` 函数会返回 `headings` 数组，包含文章所有标题的 `depth`、`slug`、`text` 信息，可直接用于生成 TOC。

## Goals / Non-Goals

**Goals:**
- 大屏幕（>= 1280px）显示侧边栏 TOC
- 滚动时自动高亮当前阅读章节
- 点击 TOC 项平滑跳转
- 支持全局开关和单篇文章禁用

**Non-Goals:**
- 移动端侧边栏 TOC（保持简洁，依赖内联 TOC）
- TOC 折叠/展开功能（MVP 不做）
- 多级嵌套超过 h4（限制 h2-h4）

## Decisions

### 1. 布局方案：Sticky 定位 + 绝对定位容器

**选择**: 使用 `position: sticky` 让 TOC 跟随滚动，配合右侧绝对定位容器。

**备选方案**:
- Grid 三栏布局：会影响现有内容区居中逻辑，改动较大
- Fixed 定位：需要手动计算滚动位置，且会脱离文档流

**理由**: Sticky 定位最简单，只需在文章容器外层包裹一个相对定位的容器，TOC 放在右侧即可。

### 2. 高亮实现：Intersection Observer

**选择**: 使用 Intersection Observer API 监听标题元素进入视口。

**理由**:
- 性能优于 scroll 事件监听
- 浏览器原生支持，无需额外依赖
- Astro 的 `is:inline` 脚本可直接使用

### 3. 响应式断点：xl (1280px)

**选择**: 仅在 `>= 1280px` 显示 TOC。

**理由**:
- 文章内容区 `max-w-4xl` 约 896px
- TOC 宽度约 200-250px
- 加上左右边距，1280px 是合理的最小显示宽度

### 4. TOC 显示条件

**选择**: 仅当 `headings.length >= 2` 且 `SITE.showToc && !hideToc` 时显示。

**理由**: 单个标题或无标题的文章不需要 TOC。

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|-----|-----|---------|
| 超长 TOC 溢出 | 部分章节不可见 | 添加 `max-height` + `overflow-y: auto` |
| 标题文字过长 | TOC 宽度撑开 | 使用 `text-overflow: ellipsis` 截断 |
| 快速滚动高亮闪烁 | 体验不佳 | 添加 debounce 或 threshold 调整 |

## Open Questions

- 是否需要支持 h5/h6 层级？（建议 MVP 不支持）
- TOC 标题是否需要显示"目录"字样？（建议显示）
