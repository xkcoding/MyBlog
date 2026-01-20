# Project Context

## Purpose
xkcoding 的个人技术博客，记录代码成长历程、技术分享和学习笔记。

## Tech Stack
- **框架**: Astro 5.x
- **主题**: 基于 AstroPaper 定制
- **样式**: Tailwind CSS 4.x
- **搜索**: Pagefind (静态搜索)
- **部署**: GitHub Pages + GitHub Actions
- **包管理**: pnpm

## Project Conventions

### Code Style
- 使用 Prettier 格式化代码
- 组件文件使用 PascalCase 命名 (如 `ViewSource.astro`)
- 工具函数使用 camelCase 命名 (如 `getPath.ts`)
- 中文注释，英文变量名

### Architecture Patterns
- Astro 组件位于 `src/components/`
- 布局组件位于 `src/layouts/`
- 博客文章位于 `src/data/blog/`（Markdown 格式）
- 全局配置位于 `src/config.ts`
- 工具函数位于 `src/utils/`

### Testing Strategy
- 依赖 TypeScript 类型检查
- 使用 `pnpm run build` 验证构建
- 通过 GitHub Actions CI 自动检查

### Git Workflow
- 主分支: `master`
- 功能分支: `feature/xxx`
- 提交信息使用中文，格式: `类型: 描述`
  - feat: 新功能
  - fix: 修复
  - style: 样式调整
  - docs: 文档更新
  - chore: 其他

## Domain Context
- 博客文章使用 Markdown 编写，支持 frontmatter 配置
- 支持动态 OG 图片生成
- 支持文章封面图（用户设置 ogImage 时显示）
- 支持目录（TOC）侧边栏
- 支持 CC BY-NC-SA 4.0 协议声明
- 支持查看原文（跳转 GitHub raw 文件）

## Important Constraints
- 保持与 AstroPaper 主题的兼容性
- 图片资源优先使用 WebP 格式
- 文章 URL 使用日期格式（如 /2024-01-01-title）

## External Dependencies
- GitHub API: 用于部署和 raw 文件访问
- Creative Commons: CC 协议徽章图片
- Google Fonts: 字体资源
