# Design: Add Cover Image Display

## Architecture Overview

本变更涉及两个独立的 UI 组件修改，不引入新的架构模式。

```
┌─────────────────────────────────────────────────────┐
│                  PostDetails.astro                   │
│  ┌───────────────────────────────────────────────┐  │
│  │            Cover Image (NEW)                  │  │
│  │   - 条件渲染 (ogImageUrl 存在时)              │  │
│  │   - 响应式图片容器                            │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │            导读区块 (existing)                │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │            文章内容 (existing)                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    Card.astro                        │
│  ┌─────────┬────────────────────────────────────┐  │
│  │ Thumb   │  Title + Badge                     │  │
│  │ (NEW)   │  Datetime                          │  │
│  │         │  Description                       │  │
│  └─────────┴────────────────────────────────────┘  │
│            ↑ 有 ogImage 时的布局                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Title + Badge                                │  │
│  │  Datetime                                     │  │
│  │  Description                                  │  │
│  └───────────────────────────────────────────────┘  │
│            ↑ 无 ogImage 时的布局（保持不变）        │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### ogImage 数据类型

根据 `content.config.ts` 定义：
```typescript
ogImage: image().or(z.string()).optional()
```

可能的值：
1. `undefined` - 未配置
2. `string` - 远程 URL（如 CDN 地址）
3. `ImageMetadata` - 本地图片 asset（有 `.src` 属性）

### PostDetails.astro 中已有的解析逻辑

```typescript
let ogImageUrl: string | undefined;

if (typeof initOgImage === "string") {
  ogImageUrl = initOgImage; // 远程图片
} else if (initOgImage?.src) {
  ogImageUrl = initOgImage.src; // 本地 asset
}
```

直接复用此变量即可。

### Card.astro 需要新增解析

Card 组件当前未使用 ogImage，需要：
1. 从 `data` 中解构 `ogImage`
2. 添加类似的类型判断逻辑

## Styling Decisions

### 文章详情页头图

```
容器：
- 宽度：100%
- 最大高度：400px（桌面）/ 250px（移动）
- 圆角：rounded-lg (8px)
- 下边距：mb-6

图片：
- object-fit: cover
- width: 100%
- height: auto
- loading: lazy
```

### 文章列表缩略图

```
容器：
- 尺寸：80px × 80px（移动）/ 120px × 80px（桌面）
- 圆角：rounded-md (6px)
- flex-shrink: 0

图片：
- object-fit: cover
- 100% 填充容器
- loading: lazy
```

## Responsive Breakpoints

| Breakpoint | 详情页头图高度 | 列表缩略图 |
|------------|---------------|-----------|
| < 640px (sm) | max-h-[250px] | 80×80px，图片在标题上方 |
| ≥ 640px | max-h-[400px] | 120×80px，图片在左侧 |

## Trade-offs

### 选项 A：列表页图片在左侧
- ✅ 视觉层次清晰
- ✅ 符合常见博客布局
- ❌ 需要调整现有 flex 结构

### 选项 B：列表页图片在上方
- ✅ 实现简单
- ❌ 占用更多垂直空间
- ❌ 有图/无图的卡片高度差异大

**决策**：采用选项 A，桌面端图片在左侧，移动端图片在上方。

## Backward Compatibility

- 无 ogImage 的文章保持原有布局，无任何变化
- 不修改 ogImage 的 schema 定义
- 不影响 Open Graph 元数据生成
