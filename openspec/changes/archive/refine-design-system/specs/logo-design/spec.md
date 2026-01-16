# Spec: Logo Design

## Overview

重新设计博客 Logo，提升品牌辨识度和视觉精致度。

## MODIFIED Requirements

### Requirement: Logo Visual Design

Logo 需在保持"代码日记本"核心概念的基础上优化视觉表现。

#### Scenario: Logo 核心概念

**Given** Logo 设计需求
**When** 设计 Logo 图形
**Then** 应保留以下核心元素：
- 日记本/笔记本形状
- 代码符号 `</>`
- 简洁现代的视觉风格

#### Scenario: Logo 视觉简化

**Given** 当前 Logo 包含多个装饰元素
**When** 重新设计 Logo
**Then** 应简化以下元素：
- 装订线设计更简洁
- 减少或移除底部横线
- 优化代码符号的视觉比重

#### Scenario: Logo 比例优化

**Given** Logo 需要在不同尺寸下使用
**When** 设计 Logo 比例
**Then** 应确保：
- 主要元素在 16px 尺寸下可辨识
- 视觉重心平衡
- 留白适当

---

### Requirement: Logo Technical Implementation

Logo 的技术实现需支持动态主题适配。

#### Scenario: SVG 格式要求

**Given** Logo 文件格式为 SVG
**When** 实现 Logo
**Then** 应满足：
- viewBox 设置为 "0 0 128 128"
- 使用 CSS 变量 `var(--accent)` 作为主色
- stroke/fill 属性支持 currentColor

#### Scenario: 主题适配

**Given** Logo 使用 CSS 变量定义颜色
**When** 用户切换主题
**Then** Logo 颜色应自动适配当前主题的 accent 色

#### Scenario: Logo 小尺寸清晰度

**Given** Logo 用于 favicon (16px)
**When** 缩小到 16x16 像素
**Then** 核心图形（日记本 + 代码符号）应清晰可辨

---

### Requirement: Logo File Structure

保持现有的 Logo 文件组织结构。

#### Scenario: 文件位置

**Given** Logo SVG 文件
**When** 保存文件
**Then** 应位于 `src/assets/icons/IconLogo.svg`

#### Scenario: 样式定义

**Given** Logo SVG 内部样式
**When** 定义颜色类
**Then** 应使用内联 `<style>` 标签定义：
- `.logo-bg`: 主背景色
- `.logo-spine`: 装订线色（如保留）
- `.logo-content`: 代码符号样式
- `.logo-dot`: 装订孔样式（如保留）

---

## Acceptance Criteria

- [ ] Logo 保持"代码日记本"核心概念
- [ ] 视觉设计更加精致简洁
- [ ] 16px 尺寸下核心元素可辨识
- [ ] 支持 CSS 变量动态颜色
- [ ] 亮色/暗色模式下表现良好
