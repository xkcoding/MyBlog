# Tasks: Add Cover Image Display

## Task List

### Phase 1: 文章详情页头图展示

- [x] **T1.1** 修改 `PostDetails.astro`，在标题上方添加头图展示区域
  - 条件渲染：仅当 `ogImageUrl` 存在时显示
  - 容器样式：圆角、阴影、浅色边框
  - 图片样式：object-cover、lazy loading
  - hover 效果：阴影增强 + 轻微放大
  - 验证：本地预览确认有/无头图的文章显示正确

### Phase 2: 文章列表卡片头图展示

- [x] **T2.1** 修改 `Card.astro`，获取 ogImage 数据
  - 从 props 中解构 ogImage 字段
  - 处理 string 和 image asset 两种类型

- [x] **T2.2** 调整 Card 布局结构
  - 布局：标题行 → 日期行 → 头图+description 行
  - 有头图时：左侧图片 + 右侧内容（flex 布局）
  - 无头图时：保持原有纯文字布局
  - 响应式：移动端图片在上，桌面端图片在左

- [x] **T2.3** 添加缩略图样式
  - 尺寸：96px × 160px
  - object-cover 裁切
  - 圆角边框 + 浅色边框 + 阴影
  - hover 效果：放大 5%
  - lazy loading

### Phase 3: RSS 头图支持

- [x] **T3.1** 修改 `rss.xml.ts`，添加头图到 RSS feed
  - 使用 `enclosure` 标签（RSS 2.0 标准）
  - 自动识别图片 MIME type

### Phase 4: 验证与测试

- [x] **T4.1** 本地预览测试
  - 有 ogImage 的文章详情页
  - 无 ogImage 的文章详情页
  - 首页文章列表
  - 文章归档页面

- [x] **T4.2** 响应式测试
  - 桌面端（>1024px）
  - 移动端（<768px）

## Dependencies
- T2.2 依赖 T2.1
- T2.3 依赖 T2.2
- T4.1 依赖 T1.1, T2.3, T3.1

## Parallelizable Work
- T1.1 和 T2.1 可并行开发
