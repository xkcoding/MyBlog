# 🚀 feat: 迁移到 Hugo

## 变更说明
- 📋 添加完整的 Hugo 迁移任务清单，包含 8 个主要阶段
- 👷 设计 GitHub Actions + Docker multi-stage 构建方案  
- 🚀 规划两种部署方案：阿里云ECS vs Sealos云平台
- 📝 添加 commit emoji 规范，统一提交信息格式
- 🙈 更新 .gitignore 配置
- 📚 更新 FixIt 主题文档链接，指向 GitHub 仓库 README

## 迁移架构设计

### 🏗️ CI/CD 流程
- **GitHub Actions + Docker Multi-stage 构建**
- **Stage 1**: Hugo 构建静态文件
- **Stage 2**: Nginx 运行时环境
- **自动化部署**: 支持生产环境和PR预览环境

### 🚀 部署方案选择
1. **阿里云 ECS 容器化部署**（传统方案）
   - 完全自主控制
   - 需要运维管理
   - 成本可预测

2. **Sealos 云原生平台**（推荐方案）
   - 开箱即用，3秒注册1分钟部署
   - 成本低40%，按量付费
   - 自动弹性伸缩，99.9999%可靠性

## 📋 迁移计划

### 1. 环境准备 ✅
- [x] 安装 Hugo v0.147.7 extended
- [x] 创建新分支 `feature/migrate-to-hugo`
- [x] 添加 FixIt 主题 v0.3.20+

### 2. CI 系统建设 🚧
- [ ] 设计 multi-stage 构建方案
- [ ] 创建 GitHub Actions 工作流
  - [ ] `build-image.yml` - Hugo构建+Docker打包
  - [ ] `deploy.yml` - 自动部署到平台
  - [ ] `preview.yml` - PR预览环境
- [ ] 配置镜像仓库推送
- [ ] 选择部署方案（阿里云ECS vs Sealos）

### 3. 配置迁移 🔄
- [ ] 创建 Hugo 配置文件
- [ ] 配置 URL 结构（保持兼容）
- [ ] 配置主题设置
- [ ] 配置评论系统
- [ ] 配置搜索功能
- [ ] 配置统计功能

### 4. 内容迁移 📝
- [ ] 创建目录结构
- [ ] 迁移文章内容
  - [ ] 转换 front matter
  - [ ] 调整内容格式
  - [ ] 处理图片链接
- [ ] 迁移静态资源

### 5. 功能配置 ⚙️
- [ ] 多语言支持
- [ ] AI 功能集成
- [ ] PWA 配置
- [ ] 扩展功能

### 6. 测试和优化 🧪
- [ ] 本地测试
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 移动端适配

### 7. 正式部署 🌐
- [ ] 部署方案最终确认
- [ ] 域名和SSL配置
- [ ] 生产环境部署

### 8. 收尾工作 🎯
- [ ] 清理 Hexo 遗留内容
- [ ] 更新项目文档
- [ ] 代码提交和合并

## 🎯 技术亮点

### Docker Multi-stage 构建
```dockerfile
# Stage 1: Hugo 构建
FROM hugomods/hugo:exts AS builder
COPY . /src
WORKDIR /src
RUN hugo --minify

# Stage 2: Nginx 运行时
FROM nginx:alpine
COPY --from=builder /src/public /usr/share/nginx/html
```

### GitHub Actions 工作流
- **构建缓存优化**: GitHub Actions 缓存加速
- **多架构支持**: AMD64 + ARM64
- **多环境部署**: 生产 + 预览环境
- **自动化流程**: 代码推送自动部署

## 🔧 配置要求

### Repository Secrets
- `SEALOS_CLOUD_HOST`: Sealos云平台地址
- `SEALOS_CLOUD_TOKEN`: Sealos API Token  
- `DOMAIN`: 自定义域名配置

### 环境变量
- `HUGO_ENV`: 构建环境
- `SSL_ENABLED`: SSL自动配置

## 📊 预期收益

### 性能提升
- **构建速度**: Docker缓存 + Hugo快速构建
- **部署效率**: 容器化一键部署
- **加载性能**: 静态文件 + CDN加速

### 成本优化
- **Sealos方案**: 比传统云厂商低40%成本
- **按量计费**: 夜间自动释放资源
- **弹性伸缩**: 根据流量自动调整

### 开发体验
- **PR预览**: 每个PR自动生成预览环境
- **自动化CI/CD**: 代码推送自动构建部署
- **环境一致性**: 开发/测试/生产环境统一

## 注意事项
- 🔗 保持原有 URL 结构，确保 SEO 不受影响
- 📱 确保移动端体验良好
- 🔍 保持搜索引擎友好性
- 🔒 确保所有功能正常运行
- 📈 监控迁移过程中的性能指标

## 相关链接
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [FixIt 主题文档](https://github.com/hugo-fixit/FixIt/blob/main/README.zh-cn.md)
- [Sealos 云平台](https://sealos.run/)
- [迁移任务清单](.cursor/todo.md)
- [Commit Emoji 规范](.cursor/commit-emoji.md) 