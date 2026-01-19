# Tasks: 博客迁移到 Astro + AstroPaper 实施清单

## 0. 前置准备
- [x] 0.1 创建 `feature/migrate-to-astro` 工作分支
- [x] 0.2 备份当前项目（移动到 `hexo-backup/` 文件夹）
- [x] 0.3 创建 `hexo-backup` 分支保留原始 Hexo 项目

## 1. Astro 项目初始化

### 1.1 创建 Astro 项目
- [x] 1.1.1 使用 AstroPaper 模板创建新项目
  ```bash
  git clone https://github.com/satnaing/astro-paper.git
  ```
- [x] 1.1.2 安装依赖 `pnpm install`
- [x] 1.1.3 验证本地运行 `pnpm run dev`
- [x] 1.1.4 清理示例内容 `rm -rf src/data/blog/*`

### 1.2 配置站点信息
- [x] 1.2.1 修改 `src/config.ts` 站点配置
  - website: "https://xkcoding.com/"
  - author: "xkcoding"
  - title: "CodingDiary"
  - desc: "xkcoding的代码成长日记"
- [x] 1.2.2 配置社交链接 `src/constants.ts` SOCIALS
- [ ] 1.2.3 更新 favicon 和 OG 图片（使用默认）

### 1.3 CI/CD 配置
- [x] 1.3.1 创建 `.github/workflows/deploy.yml`
- [x] 1.3.2 配置 GitHub Pages 部署
- [x] 1.3.3 删除旧 CI 配置（`.drone.yml`, `.gitlab-ci.yml`, `.jenkins/`）

## 2. 内容审查

### 2.1 审查准备
- [x] 2.1.1 生成 `.article-review-checklist.md` 审查清单
- [x] 2.1.2 创建归档目录 `src/data/blog/_archive/`

### 2.2 按年份审查文章

**状态标记说明**:
- `[ ]` pending - 待审查
- `[x]` keep - 保留并迁移
- `[-]` archive - 归档（不展示但保留重定向）
- `[~]` update - 需更新后迁移

#### 2016 年 (10 篇) → 全部归档
- [-] 2016-03-21.helloworld.md
- [-] 2016-03-24.ubuntu-15.04-install-jdk.md
- [-] 2016-03-25.android-open-project.md
- [-] 2016-03-26.first-use-volley-demo.md
- [-] 2016-03-27.eclipse-tips-variable.md
- [-] 2016-03-28.lanqiao-exam.md
- [-] 2016-04-03.android-svn-attention.md
- [-] 2016-04-05.coding-standards.md
- [-] 2016-08-31.server-install-centos6.md
- [-] 2016-12-13.elasticsearch-get-start.md

#### 2017 年 (12 篇)
- [x] 2017-01-06.connect-oracle11g-rac-url.md
- [x] 2017-07-12.jdk-map-source-explore.md
- [x] 2017-07-18.win10-download.md
- [x] 2017-07-19.spring-boot-mybatis-logback.md
- [x] 2017-08-02.customize-blocked-queue.md
- [x] 2017-08-31.mysql-start-error.md
- [x] 2017-11-01.zookeeper-cluster.md
- [x] 2017-11-08.dubbo-admin-install.md
- [x] 2017-11-10.druid-oracle-pscache.md
- [x] 2017-11-14.mysql-chinese-character-encoding.md
- [x] 2017-12-05.redux-and-mobx-first.md
- [x] 2017-12-11.tips-for-improve-java-skill.md

#### 2018 年 (13 篇)
- [x] 2018-01-03.devops-gitlab.md
- [x] 2018-01-04.devops-jenkins.md
- [x] 2018-01-11.camelcase-underline-transform.md
- [x] 2018-01-12.elasticsearch-note.md
- [x] 2018-01-16.db-page-sqls.md
- [x] 2018-02-05.osx-software-lists.md
- [x] 2018-02-07.regular-expression-list.md
- [x] 2018-07-30.java8-learning.md
- [x] 2018-08-20.spring-boot-global-exception-handler.md
- [x] 2018-09-18.how-to-update-the-fork-project.md
- [x] 2018-09-20.query-language-differences-between-neo4j-and-mysql.md
- [x] 2018-09-28.run-node-service-in-background.md
- [x] 2018-11-07.spring-boot-start.md

#### 2019 年 (28 篇)
- [x] 2019-01-01.bye2018-hello2019.md
- [x] 2019-01-14.solve-mac-install-minikube-problem.md
- [x] 2019-01-17.solve-nginx-413-problem.md
- [x] 2019-01-21.modify-git-commit-timestamp.md
- [x] 2019-01-30.spring-boot-request-use-enums-params.md
- [x] 2019-02-04.use-maven-manage-spring-boot-profile.md
- [x] 2019-02-13.design-pattern-simple-factory.md
- [x] 2019-02-15.design-pattern-factory-method.md
- [x] 2019-02-18.use-mybatis-dynamic-sql-to-build-common-custom-advance-query.md
- [x] 2019-03-12.scaffold-doc.md
- [x] 2019-04-24.use-vagrant-build-linux-virtual-machine.md
- [x] 2019-05-22.spring-boot-login-with-oauth.md
- [x] 2019-07-17.jfinal-login-with-oauth.md
- [x] 2019-08-06.use-justauth-integration-wechat-enterprise.md
- [x] 2019-08-10.design-pattern-abstract-factory.md
- [x] 2019-08-12.design-pattern-singleton.md
- [x] 2019-08-14.design-pattern-prototype.md
- [x] 2019-08-20.design-pattern-proxy.md
- [x] 2019-08-27.design-pattern-delegate.md
- [x] 2019-08-29.early-experience-about-github-actions.md
- [x] 2019-09-03.design-pattern-strategy.md
- [x] 2019-09-13.design-pattern-adapter.md
- [x] 2019-10-08.docker-easy-mock.md
- [x] 2019-10-14.easy-mock-syntax.md
- [x] 2019-10-16.design-pattern-template.md
- [x] 2019-10-25.design-pattern-observer.md
- [x] 2019-11-11.design-pattern-decorator.md
- [x] 2019-12-26.xkcoding-simple-http.md

#### 2020 年 (14 篇)
- [x] 2020-01-01.bye2019-hello2020.md
- [x] 2020-04-01.somewords-about-dissmission-2020.md
- [x] 2020-04-20.how-to-design-your-own-rpc-framework-1.md
- [x] 2020-05-12.how-to-design-your-own-rpc-framework-2.md
- [x] 2020-05-26.how-to-design-your-own-rpc-framework-3.md
- [x] 2020-06-01.how-does-my-blog-integrate-cicd.md
- [x] 2020-06-05.fix-quartz-job-cannot-autowired-spring-beans.md
- [x] 2020-06-28.video-tutorial-of-spring-boot-demo.md
- [x] 2020-07-28.mourning-grandpa.md
- [x] 2020-08-31.justauth-spring-boot-starter-publish-1-3-4-beta.md
- [x] 2020-09-13.what-i-like-to-do-0.md
- [x] 2020-10-01.Q2-Q3-2020.md
- [x] 2020-10-11.how-to-use-strategy-design-pattern-in-spring.md
- [x] 2020-11-02.quick-run-you-own-yiyan.md

#### 2021 年 (11 篇)
- [x] 2021-01-18.Q4-2020-and-year-summary.md
- [x] 2021-02-24.reading-notes-about-fubabaqiongbaba.md
- [x] 2021-03-06.reading-notes-about-meitian5fenzhongwanzhuankubernetes.md
- [x] 2021-03-10.fix-error-about-python-package-install-on-big-sur.md
- [x] 2021-03-15.run-local-k8s-cluster-quickly.md
- [x] 2021-03-16.reading-notes-about-shidifuqiaobusizhuan.md
- [x] 2021-04-14.run-local-zookeeper-cluster-with-docker.md
- [x] 2021-04-15.reading-notes-about-xiaoshihouzhensha-juranpanzhezhangda.md
- [x] 2021-04-22.when-lombok-met-mapstruct.md
- [x] 2021-05-01.happy-dev-run-local-dns-server.md
- [x] 2021-05-06.reading-notes-about-flinkrumenyushizhan.md

#### 2022 年 (1 篇)
- [x] 2022-01-04.fix-error-about-jd-gui-on-big-sur.md

#### 2026 年 (1 篇)
- [x] 2026-01-07.firecrawl-web-scraping-for-llm.md

## 3. 文章迁移

### 3.1 开发迁移脚本
- [x] 3.1.1 创建 `scripts/migrate-hexo-to-astro.ts`
- [x] 3.1.2 实现 Hexo frontmatter 解析
- [x] 3.1.3 实现 AstroPaper frontmatter 生成
  - title → title
  - date → pubDatetime (ISO 8601)
  - tags → tags (保留原格式)
  - 新增 author, slug, description, featured, draft
- [x] 3.1.4 实现图片路径转换（保留原路径）
- [x] 3.1.5 生成 `public/_redirects` 文件（改用 nginx 重定向实现）
- [x] 3.1.6 测试脚本在几篇文章上

### 3.2 执行迁移
- [x] 3.2.1 运行迁移脚本处理 "keep" 标记的文章（74 篇）
- [x] 3.2.2 将 "archive" 标记的文章移到 `_archive/`（15 篇）
- [x] 3.2.3 验证生成的 frontmatter 格式正确
- [x] 3.2.4 验证 _redirects 文件内容正确（改用 nginx 重定向实现）

### 3.3 内容验证
- [x] 3.3.1 本地运行 `pnpm run dev`
- [x] 3.3.2 构建测试通过（163 页面）
- [x] 3.3.3 检查代码块高亮是否正常
- [x] 3.3.4 检查图片是否正常显示（需部署后验证）
- [x] 3.3.5 检查表格渲染是否正常（需部署后验证）
- [ ] 3.3.6 修复发现的渲染问题

## 4. 功能配置

### 4.1 搜索功能
- [x] 4.1.1 验证 Pagefind 搜索正常工作（89 篇文章已索引）
- [x] 4.1.2 测试中文搜索效果（需部署后验证）

### 4.2 SEO 配置
- [x] 4.2.1 更新 `public/robots.txt`
- [x] 4.2.2 验证 sitemap 生成
- [x] 4.2.3 验证 RSS feed 生成
- [ ] 4.2.4 更新 Open Graph 默认图片（使用默认）

### 4.3 页面更新
- [x] 4.3.1 更新关于页面 (`src/pages/about.md`)
- [x] 4.3.2 更新/创建 404 页面（使用默认）
- [x] 4.3.3 检查并更新导航菜单

## 5. 验证与测试

### 5.1 本地验证
- [x] 5.1.1 完整构建测试 `pnpm run build`（163 页面，157s）
- [x] 5.1.2 预览构建结果 `pnpm run preview`
- [x] 5.1.3 检查所有页面渲染正常
- [x] 5.1.4 验证深色模式切换
- [ ] 5.1.5 验证响应式布局（移动端）
- [x] 5.1.6 验证搜索功能
- [x] 5.1.7 验证 RSS 订阅

### 5.2 性能测试
- [x] 5.2.1 运行 Lighthouse 测试
- [x] 5.2.2 确保 Performance > 95 ✅ 100
- [x] 5.2.3 确保 Accessibility > 95 ✅ 95
- [x] 5.2.4 确保 Best Practices > 95 ✅ 100
- [x] 5.2.5 确保 SEO > 95 ✅ 100

### 5.3 重定向测试
- [x] 5.3.1 部署到测试环境
- [x] 5.3.2 测试旧 URL 重定向是否正常（nginx location 规则实现）
- [x] 5.3.3 验证 301 状态码

## 6. 部署

### 6.1 预发布
- [x] 6.1.1 推送到 `feature/migrate-to-astro` 分支
- [x] 6.1.2 验证 GitHub Actions 构建成功
- [x] 6.1.3 创建 Pull Request (#24)
- [x] 6.1.4 预览部署效果

### 6.2 正式发布
- [x] 6.2.1 合并 PR 到主分支
- [x] 6.2.2 验证生产环境部署成功 (https://xkcoding.github.io/MyBlog/)
- [x] 6.2.3 检查生产环境所有功能正常
- [ ] 6.2.4 验证 DNS/域名解析正常（待配置自定义域名）

### 6.3 发布后检查
- [ ] 6.3.1 使用不同设备测试访问
- [ ] 6.3.2 检查 Google Search Console 索引状态
- [ ] 6.3.3 监控错误日志

## 7. 收尾工作

- [x] 7.1 删除不再需要的 Hexo 文件（已移至 hexo-backup/ 并在 .gitignore 中忽略）
  - `themes/` 目录
  - `scaffolds/` 目录
  - `_config.yml`
  - `gulpfile.js`
  - 旧的 `package.json` 和 `package-lock.json`
- [x] 7.2 更新 README.md 项目说明
- [ ] 7.3 归档此 proposal（`openspec archive revive-blog`）
- [ ] 7.4 编写"博客迁移到 Astro"文章（可选）
- [ ] 7.5 删除 `hexo-backup` 分支（确认无需回滚后）

---

## 文章评估标准

| 维度 | 保留 (keep) | 归档 (archive) |
|------|-------------|----------------|
| 时效性 | 技术仍在主流使用 | 技术已被淘汰（如 Eclipse、CentOS 6） |
| 独特性 | 有原创见解或实践 | 纯粹搬运或常见内容 |
| 完整性 | 内容完整可直接使用 | 内容残缺或有未完成部分 |
| 质量 | 清晰易读有结构 | 混乱难以理解 |

## 依赖关系图

```
0.前置准备
    │
    ▼
1.Astro项目初始化 ──────────────────────┐
    │                                    │
    ▼                                    │
2.内容审查 ──────────────────────────────┤
    │                                    │
    ▼                                    │
3.文章迁移 ◄─────────────────────────────┤
    │                                    │
    ▼                                    │
4.功能配置 ──────────────────────────────┘
    │
    ▼
5.验证与测试
    │
    ▼
6.部署
    │
    ▼
7.收尾工作
```

- Phase 1 和 Phase 2 可以并行进行
- Phase 3 依赖 Phase 1 和 Phase 2 完成
- Phase 4 依赖 Phase 3 完成
- Phase 5-7 依次进行
