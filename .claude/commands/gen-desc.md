---
name: Generate Description
description: 为博客文章生成有吸引力的语义化摘要（description）
category: Blog
tags: [blog, seo, description]
---

# 博客文章 Description 生成器

为博客文章生成语义化、有吸引力的 description，让读者产生点击阅读的冲动。

## 使用方式

```
/gen-desc [文件路径]           # 处理指定文章
/gen-desc --all               # 批量处理所有空 description 的文章
/gen-desc --featured          # 只处理 featured: true 的文章
/gen-desc --preview           # 预览模式，不写入文件
```

## 生成策略

根据文章类型采用不同的钩子策略：

| 文章类型 | 识别标签 | 钩子策略 |
|---------|---------|---------|
| **问题解决类** | fix-, solve-, error | 痛点共鸣 + 暗示方案存在 |
| **技术教程类** | how-to-, tutorial, use- | 场景价值 + 承诺收获 |
| **设计模式类** | design-pattern | 实际应用场景 + 隐藏陷阱警示 |
| **读书笔记类** | reading-notes | 金句摘录 + 个人收获总结 |
| **工具介绍类** | tool, docker, k8s | 解决什么问题 + 核心优势 |
| **年度总结类** | summary, bye, hello | 关键数字 + 情感共鸣 |

## 生成规则

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

## 执行步骤

1. **读取文章**：解析 frontmatter 和正文内容
2. **识别类型**：根据 tags、slug、title 判断文章类型
3. **提取要点**：
   - 问题/痛点是什么
   - 解决方案/核心观点
   - 实际应用场景
4. **生成 description**：按策略组合钩子元素
5. **更新 frontmatter**：写入 description 字段

## 示例输出

**输入**：`src/data/blog/2020-06-05.fix-quartz-job-cannot-autowired-spring-beans.md`

**生成**：
```
在 Quartz Job 里 @Autowired 结果 NPE？别急着怀疑人生。这是因为 Job 实例由 Quartz 内部创建，压根不在 Spring 容器管辖范围内。本文从 SchedulerFactoryBean 源码入手，分析问题根因，提供两种解法：自定义 JobFactory 配合 AutowireCapableBeanFactory，或者用 SpringUtil 工具类手动获取 Bean。另外还揭秘了 Spring Boot 2.x 为什么默认就能注入——因为它用了 SpringBeanJobFactory。
```

**输入**：`src/data/blog/2019-08-12.design-pattern-singleton.md`

**生成**：
```
你写的单例真的安全吗？反射调用私有构造器、反序列化生成新对象，都能轻松破坏你的单例。本文覆盖 7 种单例实现：饿汉式、懒汉式、双重检查锁、静态内部类、枚举、容器式、ThreadLocal。不仅讲怎么写，还深挖 ObjectInputStream 源码，揭秘为什么重写 readResolve() 能防住反序列化攻击。结论：优先用枚举或静态内部类，简单又安全。
```

**输入**：`src/data/blog/2019-09-03.design-pattern-strategy.md`

**生成**：
```
受够了支付方式选择的 if-else 地狱？每加一个支付渠道就要改一堆代码？策略模式帮你优雅解耦。本文用支付场景（支付宝/微信/银联/京东）演示如何把算法封装成独立策略类，通过枚举+容器池管理，新增支付方式只需加一个类，调用方代码零改动。告别臃肿的分支判断，让代码符合开闭原则。
```

## 参数说明

- `$ARGUMENTS`：文件路径或选项标志
- 无参数时：提示用户选择处理方式
