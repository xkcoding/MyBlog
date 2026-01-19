# Spec: Cover Image Display

## Overview
为配置了 ogImage 的文章提供页面内头图展示能力。

---

## ADDED Requirements

### Requirement: Post Detail Cover Image
当文章配置了 ogImage 时，系统 SHALL 在文章详情页的"导读"区块上方显示头图。

- 图片 SHALL 显示在标题、日期之后，"导读"区块之前
- 图片宽度 SHALL 为 100%，高度自适应，最大高度受限
- 系统 SHALL 使用 lazy loading 优化加载性能
- 图片加载期间 SHALL NOT 影响页面布局

#### Scenario: Article with ogImage displays cover
- **GIVEN** 一篇文章配置了 `ogImage: "https://example.com/cover.png"`
- **WHEN** 用户访问该文章详情页
- **THEN** 应在"导读"区块上方看到该头图
- **AND** 图片应为圆角样式，宽度撑满内容区域

#### Scenario: Article without ogImage shows no cover
- **GIVEN** 一篇文章未配置 ogImage
- **WHEN** 用户访问该文章详情页
- **THEN** 页面布局与当前保持一致，无头图区域

---

### Requirement: Card Thumbnail Image
当文章配置了 ogImage 时，系统 SHALL 在文章列表卡片中显示缩略图。

- 缩略图 SHALL 显示在卡片左侧（桌面端）或上方（移动端）
- 系统 SHALL 使用固定尺寸容器，图片使用 object-cover 裁切
- 系统 SHALL 使用 lazy loading 优化加载性能
- 无 ogImage 的文章 SHALL 保持原有纯文字布局

#### Scenario: Article with ogImage shows thumbnail in list
- **GIVEN** 首页或文章列表页
- **AND** 某篇文章配置了 ogImage
- **WHEN** 该文章卡片被渲染
- **THEN** 应在卡片左侧（桌面端）显示缩略图
- **AND** 缩略图为固定尺寸、圆角样式

#### Scenario: Article without ogImage shows text-only card
- **GIVEN** 首页或文章列表页
- **AND** 某篇文章未配置 ogImage
- **WHEN** 该文章卡片被渲染
- **THEN** 卡片布局保持原有样式，无缩略图区域

---

### Requirement: Responsive Layout
头图展示 SHALL 在不同屏幕尺寸下正常显示。

- 移动端（<640px）：详情页头图最大高度 SHALL 为 250px
- 移动端（<640px）：列表缩略图 SHALL 显示在标题上方
- 桌面端（≥640px）：详情页头图最大高度 SHALL 为 400px
- 桌面端（≥640px）：列表缩略图 SHALL 显示在内容左侧

#### Scenario: Mobile view of article with cover
- **GIVEN** 用户使用移动设备（屏幕宽度 < 640px）
- **WHEN** 访问配置了 ogImage 的文章
- **THEN** 详情页头图高度不超过 250px
- **AND** 列表页缩略图显示在标题上方

#### Scenario: Desktop view of article with cover
- **GIVEN** 用户使用桌面设备（屏幕宽度 ≥ 640px）
- **WHEN** 访问配置了 ogImage 的文章
- **THEN** 详情页头图高度不超过 400px
- **AND** 列表页缩略图显示在内容左侧

---

## Related Capabilities
- Open Graph 元数据生成（不受影响）
- 动态 OG 图片生成（不受影响）
