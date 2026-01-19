## 1. 配置与 Schema

- [x] 1.1 在 `src/config.ts` 添加 `showToc: true` 配置项
- [x] 1.2 在 `src/content.config.ts` 的 blog schema 添加 `hideToc` 可选字段

## 2. TOC 组件开发

- [x] 2.1 创建 `src/components/TableOfContents.astro` 组件
  - 接收 `headings` 属性（从 `render()` 获取）
  - 渲染嵌套列表结构（支持 h2-h4 层级）
  - 支持点击跳转（平滑滚动）
- [x] 2.2 添加客户端脚本实现高亮逻辑
  - 使用 Intersection Observer 监听标题元素
  - 动态添加 `.active` 类到当前章节链接

## 3. 布局集成

- [x] 3.1 修改 `src/layouts/PostDetails.astro`
  - 从 `render()` 解构 `headings`
  - 调整布局结构（添加 post-container 包裹）
  - 条件渲染 TOC 组件（检查 `SITE.showToc` 和 `!hideToc`）
  - TOC 仅在 headings 数量 >= 2 时显示

## 4. 样式实现

- [x] 4.1 在 `src/styles/global.css` 添加 TOC 样式
  - 固定定位（fixed）
  - 响应式显示/隐藏（1280px 断点）
  - 高亮状态样式（accent 颜色 + 左边框）
  - 层级缩进（h3/h4 递进缩进）
  - 滚动条美化（thin scrollbar）

## 5. 验证测试

- [x] 5.1 本地构建验证通过
- [x] 5.2 TOC 显示条件逻辑实现：`SITE.showToc && !hideToc && headings >= 2`
- [x] 5.3 响应式断点：>= 1280px 显示，< 1280px 隐藏
