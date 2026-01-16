# Design: 预发环境徽标视觉设计

## 设计参考

参考用户提供的截图，实现斜向角标效果：
- 固定在页面左上角
- 45度斜向旋转
- 文字垂直于角标方向

## 视觉规范

### 颜色方案

使用博客现有的 accent 色系，增强品牌一致性：

```css
/* 亮色模式 - 紫色渐变 */
background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);

/* 暗色模式 - 橙色渐变（与现有 accent 一致）*/
background: linear-gradient(135deg, #ff6b01 0%, #ff8534 100%);
```

### 尺寸与位置

```css
.env-badge {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;

  /* 角标尺寸 */
  width: 120px;
  height: 120px;

  /* 文字定位 */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;

  /* 裁剪为三角形 */
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.env-badge span {
  /* 文字旋转 -45度 */
  transform: rotate(-45deg) translateX(-10px) translateY(-20px);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

### 响应式适配

移动端适当缩小：

```css
@media (max-width: 640px) {
  .env-badge {
    width: 80px;
    height: 80px;
  }

  .env-badge span {
    font-size: 10px;
    transform: rotate(-45deg) translateX(-5px) translateY(-12px);
  }
}
```

## 交互设计

- 鼠标悬停时轻微放大（1.05x）
- 点击跳转到生产环境（可选）
- 不遮挡主要内容和导航

## 无障碍考虑

- 添加 `aria-label="预发环境"`
- 确保文字与背景对比度 ≥ 4.5:1
- 不影响键盘导航焦点顺序

## 效果预览

```
┌─────────────────────────────────┐
│ ╲Preview                        │
│   ╲                             │
│     ╲    [网站标题]  [导航菜单] │
│       ╲                         │
│                                 │
│         [页面内容]              │
│                                 │
└─────────────────────────────────┘
```

## 文件结构

```
src/
├── components/
│   └── EnvBadge.astro      # 新增：环境徽标组件
├── layouts/
│   └── Layout.astro        # 修改：引入 EnvBadge
```
