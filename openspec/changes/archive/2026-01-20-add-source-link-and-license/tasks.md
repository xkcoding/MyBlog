## 1. 配置扩展

- [x] 1.1 在 `src/config.ts` 中添加 `viewSource` 配置项（enabled、text、url）
- [x] 1.2 在 `src/config.ts` 中添加 `license` 配置项（enabled、type、url）

## 2. 组件开发

- [x] 2.1 创建 `src/components/ViewSource.astro` 组件
  - 接收 `post` 参数，生成 raw URL
  - 使用 GitHub 图标
  - 样式与 EditPost 保持一致
- [x] 2.2 创建 `src/components/License.astro` 组件
  - 显示 CC BY-NC-SA 4.0 协议信息
  - 包含协议图标和链接
  - 简洁的版权声明文案

## 3. 布局集成

- [x] 3.1 修改 `src/layouts/PostDetails.astro`
  - 在文章正文后、分享链接前添加 License 组件
  - 在元信息区添加 ViewSource 链接
- [x] 3.2 确保移动端和桌面端响应式显示正常

## 4. 验证

- [x] 4.1 本地构建测试，确保无类型错误
- [x] 4.2 验证链接跳转正确（raw 页面）
- [x] 4.3 检查暗色/亮色模式下样式正常
