# CodingDiary

xkcoding 的代码成长日记 - 基于 [Astro](https://astro.build/) + [AstroPaper](https://github.com/satnaing/astro-paper) 主题构建。

## 技术栈

- **框架**: Astro 5.x
- **主题**: AstroPaper
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
│   └── config.ts        # 站点配置
├── astro.config.ts      # Astro 配置
└── package.json
```

## License

MIT
