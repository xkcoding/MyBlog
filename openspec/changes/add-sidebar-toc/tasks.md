## 1. 配置与 Schema

- [ ] 1.1 在 `src/config.ts` 添加 `showToc: true` 配置项
- [ ] 1.2 在 `src/content.config.ts` 的 blog schema 添加 `hideToc` 可选字段

## 2. TOC 组件开发

- [ ] 2.1 创建 `src/components/TableOfContents.astro` 组件
  - 接收 `headings` 属性（从 `render()` 获取）
  - 渲染嵌套列表结构（支持 h2-h4 层级）
  - 支持点击跳转（平滑滚动）
- [ ] 2.2 添加客户端脚本实现高亮逻辑
  - 使用 Intersection Observer 监听标题元素
  - 动态添加 `.active` 类到当前章节链接

## 3. 布局集成

- [ ] 3.1 修改 `src/layouts/PostDetails.astro`
  - 从 `render()` 解构 `headings`
  - 调整布局结构为三栏 Grid
  - 条件渲染 TOC 组件（检查 `SITE.showToc` 和 `!hideToc`）
  - TOC 仅在 headings 数量 >= 2 时显示

## 4. 样式实现

- [ ] 4.1 在 `src/styles/global.css` 添加 TOC 样式
  - 固定定位（sticky）
  - 响应式显示/隐藏（xl 断点）
  - 高亮状态样式
  - 层级缩进
  - 滚动条美化（如内容过长）

## 5. 验证测试

- [ ] 5.1 本地预览验证
  - 长文章 TOC 显示正确
  - 滚动高亮功能正常
  - 点击跳转平滑
  - 响应式隐藏/显示正常
- [ ] 5.2 验证 `hideToc: true` 的文章不显示 TOC
- [ ] 5.3 验证短文章（< 2 个标题）不显示 TOC
