# Proposal: Add Cover Image Display

## Change ID
`add-cover-image-display`

## Summary
在文章页面和文章列表中显示配置的头图（ogImage）。当前 ogImage 仅用于社交媒体分享时的 Open Graph 元数据，本提案将其扩展为可选的视觉展示元素。

## Motivation
- 用户配置了 ogImage 后，期望在文章页面中能直接看到这张图片
- 头图可以增强文章的视觉吸引力，提升阅读体验
- 在文章列表中显示缩略图可以帮助读者快速识别感兴趣的内容

## Scope

### In Scope
1. **文章详情页**：在"导读"区块上方显示头图
2. **文章列表卡片**：在 description 左侧显示头图缩略图

### Out of Scope
- 修改 ogImage 的 schema 定义
- 修改 Open Graph 元数据生成逻辑
- 添加新的配置选项（如全局开关）

## Affected Files
- `src/layouts/PostDetails.astro` - 文章详情页布局
- `src/components/Card.astro` - 文章列表卡片组件

## Dependencies
- 无外部依赖
- 复用现有的 ogImage 解析逻辑

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| 图片加载失败 | 页面布局错乱 | 使用 CSS object-fit 和固定容器尺寸 |
| 外部图片 URL 可能较慢 | 页面加载体验下降 | 使用 loading="lazy" 延迟加载 |
| 响应式布局适配 | 移动端显示异常 | 使用 Tailwind 响应式类，移动端调整布局 |

## Success Criteria
- [ ] 配置了 ogImage 的文章在详情页"导读"上方显示头图
- [ ] 配置了 ogImage 的文章在列表卡片中 description 左侧显示缩略图
- [ ] 未配置 ogImage 的文章保持原有布局不变
- [ ] 响应式布局在移动端和桌面端均正常显示
