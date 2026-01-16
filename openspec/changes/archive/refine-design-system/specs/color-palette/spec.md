# Spec: Color Palette

## Overview

定义博客设计系统的配色规范，确保视觉一致性和可访问性。

## MODIFIED Requirements

### Requirement: Light Mode Color Palette

亮色模式配色方案需要重新设计，以提供更好的视觉体验。

#### Scenario: 亮色模式默认配色

**Given** 用户访问博客且系统处于亮色模式
**When** 页面加载完成
**Then** 应用以下 CSS 变量配色：
- `--background`: 需优化（当前 #fdfdfd）
- `--foreground`: 需优化（当前 #282728）
- `--accent`: **紫色系**（当前 #006cac 蓝色 → 改为紫色）
- `--muted`: 需优化（当前 #e6e6e6）
- `--border`: 需优化（当前 #ece9e9）

**Note**:
- 强调色使用紫色系（用户偏好）
- 具体颜色值将在 UI/UX Pro Max 分析后确定，确保与紫色强调色协调

#### Scenario: 亮色模式文本对比度

**Given** 亮色模式配色方案
**When** 计算 foreground 与 background 的对比度
**Then** 对比度应 ≥4.5:1 (WCAG AA)

#### Scenario: 亮色模式强调色对比度

**Given** 亮色模式配色方案
**When** accent 色用于链接或按钮文本
**Then** accent 与 background 对比度应 ≥4.5:1

---

### Requirement: Dark Mode Color Palette

暗色模式配色方案基本符合预期，仅需微调优化。

#### Scenario: 暗色模式默认配色

**Given** 用户访问博客且系统处于暗色模式
**When** 页面加载完成
**Then** 应用以下 CSS 变量配色：
- `--background`: #212737（保持）
- `--foreground`: #eaedf3（保持）
- `--accent`: #ff6b01（保持或微调）
- `--muted`: #343f60（保持）
- `--border`: 需评估是否微调（当前 #ab4b08）

#### Scenario: 暗色模式文本对比度

**Given** 暗色模式配色方案
**When** 计算 foreground 与 background 的对比度
**Then** 对比度应 ≥4.5:1 (WCAG AA)

---

### Requirement: Theme Consistency

亮色和暗色模式应保持设计语言一致性。

#### Scenario: 主题切换视觉连贯

**Given** 用户在亮色模式下浏览页面
**When** 切换到暗色模式
**Then** 视觉风格应保持连贯，仅明暗反转

#### Scenario: 强调色语义一致

**Given** 两种主题模式
**When** accent 色用于相同类型的 UI 元素
**Then** 用户应能识别其为强调/交互元素

---

## Acceptance Criteria

- [ ] 亮色模式配色重新设计，符合用户审美偏好
- [ ] 暗色模式配色维持或微调
- [ ] 所有颜色组合符合 WCAG 2.1 AA 标准
- [ ] CSS 变量在 `global.css` 中正确定义
- [ ] 主题切换平滑无闪烁
