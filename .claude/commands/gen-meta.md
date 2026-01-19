---
name: Generate Meta
description: 为博客文章生成 tags 和 description
category: Blog
tags: [blog, seo, meta]
---

# 博客文章 Meta 生成器

为博客文章生成语义化的 tags 和有吸引力的 description，提升 SEO 效果和读者点击率。

## 使用方式

```
/gen-meta [文件路径]           # 处理指定文章（生成 tags + description）
/gen-meta [文件路径] --tags    # 只生成 tags
/gen-meta [文件路径] --desc    # 只生成 description
/gen-meta --all               # 批量处理所有空 meta 的文章
/gen-meta --featured          # 只处理 featured: true 的文章
/gen-meta --preview           # 预览模式，不写入文件
```

---

## Tags 生成策略

### 生成规则

1. **数量限制**：2-5 个 tags，精准覆盖文章核心主题
2. **优先级**：技术栈 > 工具名 > 场景/领域 > 通用标签
3. **命名规范**：
   - 小写英文，多词用连字符连接（如 `design-pattern`）
   - 优先复用项目已有 tags，保持一致性
   - 避免过于宽泛的标签（如 `code`、`tech`）

### 常用 Tags 参考

| 领域 | 常用 Tags |
|------|----------|
| **后端** | java, spring-boot, mybatis, rpc, microservices |
| **前端** | react, vue, javascript, typescript |
| **DevOps** | devops, docker, k8s, ci-cd, github-actions |
| **数据库** | mysql, redis, elasticsearch, neo4j |
| **设计模式** | design-pattern |
| **AI/工具** | ai, claude-code, automation |
| **读书笔记** | reading-notes |
| **年度总结** | summary |

### Tags 识别逻辑

1. **扫描文章内容**：提取技术关键词、框架名、工具名
2. **匹配已有 Tags**：优先使用项目中已存在的 tags
3. **补充新 Tags**：必要时新增，但需符合命名规范

---

## Description 生成策略

### 根据文章类型采用不同的钩子策略

| 文章类型 | 识别标签 | 钩子策略 |
|---------|---------|---------|
| **问题解决类** | fix-, solve-, error | 痛点共鸣 + 暗示方案存在 |
| **技术教程类** | how-to-, tutorial, use- | 场景价值 + 承诺收获 |
| **设计模式类** | design-pattern | 实际应用场景 + 隐藏陷阱警示 |
| **读书笔记类** | reading-notes | 金句摘录 + 个人收获总结 |
| **工具介绍类** | tool, docker, k8s | 解决什么问题 + 核心优势 |
| **年度总结类** | summary, bye, hello | 关键数字 + 情感共鸣 |

### 生成规则

1. **长度限制**：250-350 字符，保证信息量充足同时兼顾 SEO
2. **禁止内容**：
   - 不以"本文"、"这篇"开头
   - 不使用"将会介绍"、"主要讲解"等空洞描述
   - 不保留标题残留（如"## 1. 问题"）
3. **必须包含**：
   - 核心价值点（读者能学到什么）
   - 钩子元素（为什么要点进来看）
4. **语气风格**：
   - 技术文章：直接、干练、有料
   - 读书笔记：有观点、有态度

---

## 执行步骤

1. **读取文章**：解析 frontmatter 和正文内容
2. **识别类型**：根据现有 tags、slug、title 判断文章类型
3. **生成 Tags**（如需）：
   - 扫描技术关键词
   - 匹配已有 tags
   - 精选 2-5 个最相关的
4. **生成 Description**（如需）：
   - 提取问题/痛点
   - 总结解决方案/核心观点
   - 按策略组合钩子元素
5. **更新 frontmatter**：写入 tags 和/或 description 字段

---

## 示例输出

### 示例 1：问题解决类

**输入**：`src/data/blog/2020-06-05.fix-quartz-job-cannot-autowired-spring-beans.md`

**生成 Tags**：
```yaml
tags:
  - java
  - spring-boot
  - quartz
```

**生成 Description**：
```
在 Quartz Job 里 @Autowired 结果 NPE？别急着怀疑人生。这是因为 Job 实例由 Quartz 内部创建，压根不在 Spring 容器管辖范围内。本文从 SchedulerFactoryBean 源码入手，分析问题根因，提供两种解法：自定义 JobFactory 配合 AutowireCapableBeanFactory，或者用 SpringUtil 工具类手动获取 Bean。另外还揭秘了 Spring Boot 2.x 为什么默认就能注入——因为它用了 SpringBeanJobFactory。
```

### 示例 2：设计模式类

**输入**：`src/data/blog/2019-08-12.design-pattern-singleton.md`

**生成 Tags**：
```yaml
tags:
  - java
  - design-pattern
```

**生成 Description**：
```
你写的单例真的安全吗？反射调用私有构造器、反序列化生成新对象，都能轻松破坏你的单例。本文覆盖 7 种单例实现：饿汉式、懒汉式、双重检查锁、静态内部类、枚举、容器式、ThreadLocal。不仅讲怎么写，还深挖 ObjectInputStream 源码，揭秘为什么重写 readResolve() 能防住反序列化攻击。结论：优先用枚举或静态内部类，简单又安全。
```

### 示例 3：工具介绍类

**输入**：`src/data/blog/2026-01-17.extend-claude-code-with-slash-command.md`

**生成 Tags**：
```yaml
tags:
  - ai
  - claude-code
  - automation
```

**生成 Description**：
```
每次都手动抓网页喂给 Claude Code 做上下文？复制粘贴 HTML 一堆 CSS/JS 噪音，根本没法用。Slash Command 让你把这类重复工作流封装成 /xxx 命令，敲一下就跑。本文以网页剪藏为例，用 Firecrawl API 一键把网页转成干净的 Markdown——对比 AgentScope Java 文档页，curl 拿到的是十几个 link 标签，Firecrawl 直接给你结构化正文。一个是噪音，一个是信号。从 Frontmatter 配置到 API 调用到文件命名，全流程拆解，附反爬超时、积分消耗等踩坑指南。
```

---

## 参数说明

- `$ARGUMENTS`：文件路径或选项标志
- 无参数时：提示用户选择处理方式
