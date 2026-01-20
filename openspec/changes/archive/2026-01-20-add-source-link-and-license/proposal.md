# Change: 新增查看原文链接和 CC 协议声明

## Why

当前博客文章页面只有"编辑"链接（指向 GitHub edit 页面），缺少以下功能：
1. 读者无法快速查看文章的 Markdown 原始内容（source 模式）
2. 没有明确的版权协议声明，不利于内容保护和合规转载

## What Changes

- 新增"查看原文"链接组件，跳转到 GitHub 仓库文件的 blob 页面（只读模式）
- 新增 CC BY-NC-SA 4.0 协议声明组件，显示在文章正文下方
- 在 `config.ts` 中添加相关配置项（协议类型、仓库 URL 等）
- 修改 `PostDetails.astro` 布局，集成新组件

## Impact

- Affected code:
  - `src/config.ts` - 新增配置项
  - `src/components/ViewSource.astro` - 新建组件
  - `src/components/License.astro` - 新建组件
  - `src/layouts/PostDetails.astro` - 集成新组件
  - `src/assets/icons/` - 可能需要新增图标
