# CodingDiary

xkcoding 的代码成长日记 - 基于 [Astro](https://astro.build/) + [AstroPaper](https://github.com/satnaing/astro-paper) 主题构建。

## 特性

- 🚀 基于 Astro 5.x 构建，性能优异
- 🎨 基于 AstroPaper 主题定制，简洁美观
- 🔍 Pagefind 全文搜索
- 📖 目录侧边栏（TOC）
- 🖼️ 文章封面图 & 动态 OG 图片
- 📝 查看原文（跳转 GitHub raw 文件）
- ⚖️ CC BY-NC-SA 4.0 协议声明
- 🌙 深色模式支持

## 技术栈

- **框架**: Astro 5.x
- **主题**: AstroPaper
- **样式**: Tailwind CSS 4.x
- **搜索**: Pagefind
- **部署**: GitHub Pages + GitHub Actions

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建
pnpm run build

# 预览构建结果
pnpm run preview
```

## 目录结构

```
/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片等资源
│   ├── components/      # Astro 组件
│   ├── data/blog/       # 博客文章 (Markdown)
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面路由
│   ├── utils/           # 工具函数
│   └── config.ts        # 站点配置
├── openspec/            # OpenSpec 规范文档
├── astro.config.ts      # Astro 配置
└── package.json
```

## 配置说明

站点配置位于 `src/config.ts`，主要配置项：

- `website`: 站点 URL
- `author`: 作者信息
- `showToc`: 是否显示目录
- `dynamicOgImage`: 是否启用动态 OG 图片
- `editPost`: 编辑文章链接配置
- `viewSource`: 查看原文链接配置
- `license`: 协议声明配置

## License

文章内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 协议

代码采用 MIT 协议
