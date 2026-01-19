# Design: 统一博客图片托管至阿里云 OSS + SSL 证书管理优化

## 架构概览

```
                    ┌────────────────────────────────────────────┐
                    │           GitHub Actions                   │
                    │     acme.sh + dns_ali (证书自动续期)        │
                    └─────────────────────┬──────────────────────┘
                                          │ 部署证书
                                          ▼
                    ┌────────────────────────────────────────────┐
                    │           阿里云 CDN (HTTPS)               │
                    │         static.xkcoding.com                │
                    └─────────────────────┬──────────────────────┘
                                          │ 回源
                                          ▼
                    ┌────────────────────────────────────────────┐
                    │           阿里云 OSS                        │
                    │   xkcoding-blog.oss-cn-hangzhou.aliyuncs.com│
                    │                                            │
                    │   /blog/2019-08-09-xxx.png                 │
                    │   /blog/2020-05-06-xxx.png                 │
                    │   /resources/xxx.png                       │
                    │   /2018-01-03-xxx.jpg                      │
                    └────────────────────────────────────────────┘
```

## 域名方案详细设计

### 采用方案：阿里云 CDN + acme.sh 自动证书续期

**架构：**
```
用户请求 → static.xkcoding.com → 阿里云 CDN (HTTPS) → 阿里云 OSS
                                      ↑
                              acme.sh 自动部署证书
```

**费用预估（博客场景）：**
- CDN 流量：约 ¥0.24/GB（国内）
- 博客图片月流量一般 < 1GB，费用 < ¥1/月

---

## 阿里云 CDN + acme.sh 配置指南

### Step 1: 开通阿里云 CDN

1. 登录阿里云控制台 → CDN → 开通服务
2. 选择「按流量计费」（更适合小流量场景）

### Step 2: 添加 CDN 加速域名

1. CDN 控制台 → 域名管理 → 添加域名
2. 配置：
   ```
   加速域名: static.xkcoding.com
   业务类型: 图片小文件
   源站信息:
     - 类型: OSS 域名
     - 域名: xkcoding-blog.oss-cn-hangzhou.aliyuncs.com
   端口: 443
   ```
3. 等待审核通过（通常几分钟）

### Step 3: 配置 DNS 解析

在阿里云 DNS 控制台添加 CNAME 记录：
```
记录类型: CNAME
主机记录: static
记录值: static.xkcoding.com.w.cdngslb.com  # CDN 分配的 CNAME
```

### Step 4: 安装配置 acme.sh

**DNS-01 验证原理**（无需修改 CNAME）：

```
┌─────────────────────────────────────────────────────────────────┐
│  DNS 记录（两者独立，互不影响）                                    │
├─────────────────────────────────────────────────────────────────┤
│  static.xkcoding.com                                            │
│    └─ CNAME → xxx.cdngslb.com          ← 一直存在，指向 CDN     │
│                                                                 │
│  _acme-challenge.static.xkcoding.com                            │
│    └─ TXT → "xxxxxx验证码"              ← 临时，验证后自动删除   │
└─────────────────────────────────────────────────────────────────┘
```

acme.sh 使用 `--dns dns_ali` 参数会：
1. 调用阿里云 DNS API 自动添加 TXT 记录
2. 等待 Let's Encrypt 验证
3. 验证通过后自动删除 TXT 记录
4. 整个过程不影响 CNAME 记录

**本地安装（用于调试）**：

```bash
# 1. 安装 acme.sh
curl https://get.acme.sh | sh -s email=237497819@qq.com
source ~/.zshrc  # 或 ~/.bashrc

# 2. 配置阿里云 API 密钥（用于 DNS-01 验证）
export Ali_Key="你的 AccessKey ID"
export Ali_Secret="你的 AccessKey Secret"

# 3. 申请证书（DNS-01 验证，自动操作 TXT 记录）
acme.sh --issue --dns dns_ali -d static.xkcoding.com

# 证书文件位置：~/.acme.sh/static.xkcoding.com/
```

### Step 5: 部署证书到阿里云 CDN

**方法 A: 使用 acme.sh 内置 deploy hook（推荐）**

```bash
# 配置阿里云 CDN 部署参数
export Chinese_Region="cn-hangzhou"
export Ali_CDN_Domain="static.xkcoding.com"

# 部署证书
acme.sh --deploy -d static.xkcoding.com --deploy-hook ali_cdn
```

**方法 B: 手动部署（首次或调试用）**

1. 查看证书文件：
   ```bash
   ls ~/.acme.sh/static.xkcoding.com/
   # static.xkcoding.com.cer  - 证书文件
   # static.xkcoding.com.key  - 私钥文件
   # fullchain.cer            - 完整证书链
   ```

2. CDN 控制台 → 域名管理 → static.xkcoding.com → HTTPS 配置
3. 上传证书：
   - 证书内容：`fullchain.cer` 的内容
   - 私钥：`static.xkcoding.com.key` 的内容

### Step 6: 配置自动续期（GitHub Actions 方案，推荐）

使用 GitHub Actions 替代本地 cron job，更加可靠：

**创建 `.github/workflows/cdn-ssl-renew.yml`：**

```yaml
name: CDN SSL Certificate Renewal

on:
  # 每月 1 号和 15 号检查续期
  schedule:
    - cron: "0 2 1,15 * *"
  # 支持手动触发
  workflow_dispatch:

jobs:
  renew-cert:
    runs-on: ubuntu-latest
    steps:
      - name: Install acme.sh
        run: |
          curl https://get.acme.sh | sh -s email=${{ secrets.ACME_EMAIL }}

      - name: Issue/Renew Certificate
        env:
          Ali_Key: ${{ secrets.ALI_KEY }}
          Ali_Secret: ${{ secrets.ALI_SECRET }}
        run: |
          ~/.acme.sh/acme.sh --issue --dns dns_ali -d static.xkcoding.com --force

      - name: Deploy to Aliyun CDN
        env:
          Ali_Key: ${{ secrets.ALI_KEY }}
          Ali_Secret: ${{ secrets.ALI_SECRET }}
          CHINESE_REGION: cn-hangzhou
          ALI_CDN_DOMAIN: static.xkcoding.com
        run: |
          ~/.acme.sh/acme.sh --deploy -d static.xkcoding.com --deploy-hook ali_cdn

      - name: Summary
        run: |
          echo "## 🔐 CDN SSL 证书续期完成" >> $GITHUB_STEP_SUMMARY
          echo "- **域名**: static.xkcoding.com" >> $GITHUB_STEP_SUMMARY
          echo "- **时间**: $(date)" >> $GITHUB_STEP_SUMMARY
```

**配置 GitHub Secrets：**
- `ACME_EMAIL`: 237497819@qq.com
- `ALI_KEY`: 阿里云 AccessKey ID
- `ALI_SECRET`: 阿里云 AccessKey Secret

**优势：**
- 无需本地服务器运行
- GitHub Actions 免费
- 与现有 SSL 管理工作流统一管理
- 执行日志可追溯

---

### 备选：本地 acme.sh cron job

如果不想用 GitHub Actions，也可以在本地配置：

```bash
# 查看 cron job
crontab -l | grep acme

# 手动测试续期（不会真正续期，只是测试）
acme.sh --renew -d static.xkcoding.com --force --dry-run

# 证书续期后会自动调用 deploy hook 部署到 CDN
```

### Step 7: 验证配置

```bash
# 检查 HTTPS 是否生效
curl -I https://static.xkcoding.com/

# 检查证书信息
echo | openssl s_client -servername static.xkcoding.com -connect static.xkcoding.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 阿里云 AccessKey 安全配置

**强烈建议使用 RAM 子账号，仅授予必要权限：**

1. 创建 RAM 子账号
   - 控制台 → RAM 访问控制 → 用户 → 创建用户
   - 勾选「OpenAPI 调用访问」

2. 授予权限（最小权限原则）：
   ```json
   {
     "Version": "1",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "alidns:AddDomainRecord",
           "alidns:DeleteDomainRecord",
           "alidns:DescribeDomainRecords"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "cdn:SetDomainServerCertificate",
           "cdn:DescribeDomainCertificateInfo"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. 创建 AccessKey 并记录

---

## SSL 工作流重构设计

### 重构后的 ssl-manage.yml（博客域名证书）

```yaml
name: SSL Certificate Management

on:
  schedule:
    - cron: "0 2 1,15 * *"  # 每月 1 号和 15 号
  workflow_dispatch:
    inputs:
      force_renew:
        description: "强制重新申请证书"
        required: false
        type: boolean
        default: false

env:
  DOMAINS: "xkcoding.com,www.xkcoding.com,blog.xkcoding.com"

jobs:
  renew-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Install acme.sh
        run: |
          curl https://get.acme.sh | sh -s email=${{ secrets.ACME_EMAIL }}

      - name: Issue/Renew Certificate (DNS-01)
        env:
          Ali_Key: ${{ secrets.ALI_KEY }}
          Ali_Secret: ${{ secrets.ALI_SECRET }}
        run: |
          # 构建域名参数
          DOMAIN_ARGS=""
          IFS=',' read -ra DOMAIN_ARRAY <<< "$DOMAINS"
          for domain in "${DOMAIN_ARRAY[@]}"; do
            DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
          done

          # 申请/续期证书（DNS-01 验证，自动操作 TXT 记录）
          if [ "${{ github.event.inputs.force_renew }}" = "true" ]; then
            ~/.acme.sh/acme.sh --issue --dns dns_ali $DOMAIN_ARGS --force
          else
            ~/.acme.sh/acme.sh --issue --dns dns_ali $DOMAIN_ARGS
          fi

      - name: Deploy Certificate to Server
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          key: ${{ secrets.ALIYUN_SSH_KEY }}
          port: ${{ secrets.ALIYUN_PORT || 22 }}
          script: |
            echo "🔐 部署证书到服务器..."

            # 证书目录
            CERT_DIR="/opt/myblog/certbot/etc/live/xkcoding.com"
            mkdir -p $CERT_DIR

            # 证书内容通过环境变量传递（见下一步）

      - name: Upload Certificate Files
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          key: ${{ secrets.ALIYUN_SSH_KEY }}
          port: ${{ secrets.ALIYUN_PORT || 22 }}
          source: "~/.acme.sh/xkcoding.com/*"
          target: "/opt/myblog/certbot/etc/live/xkcoding.com/"
          strip_components: 3

      - name: Reload Nginx
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.ALIYUN_HOST }}
          username: ${{ secrets.ALIYUN_USER }}
          key: ${{ secrets.ALIYUN_SSH_KEY }}
          port: ${{ secrets.ALIYUN_PORT || 22 }}
          script: |
            echo "🔄 重载 nginx 配置..."
            docker exec myblog-nginx nginx -s reload
            echo "✅ 证书部署完成！"

      - name: Summary
        run: |
          echo "## 🔐 SSL 证书管理完成" >> $GITHUB_STEP_SUMMARY
          echo "- **域名**: ${{ env.DOMAINS }}" >> $GITHUB_STEP_SUMMARY
          echo "- **验证方式**: DNS-01 (零停机)" >> $GITHUB_STEP_SUMMARY
          echo "- **时间**: $(date)" >> $GITHUB_STEP_SUMMARY
```

**关键改进**：
1. 使用 `acme.sh --dns dns_ali` 进行 DNS-01 验证
2. 不再需要停止 nginx
3. 证书申请在 GitHub Actions 完成
4. 通过 SCP 上传证书文件到服务器
5. 仅需 `nginx -s reload` 重载配置

### 新增 cdn-ssl-renew.yml（CDN 域名证书）

```yaml
name: CDN SSL Certificate Renewal

on:
  schedule:
    - cron: "0 3 1,15 * *"  # 每月 1 号和 15 号，在博客证书后执行
  workflow_dispatch:

jobs:
  renew-cdn-cert:
    runs-on: ubuntu-latest
    steps:
      - name: Install acme.sh
        run: |
          curl https://get.acme.sh | sh -s email=${{ secrets.ACME_EMAIL }}

      - name: Issue/Renew Certificate
        env:
          Ali_Key: ${{ secrets.ALI_KEY }}
          Ali_Secret: ${{ secrets.ALI_SECRET }}
        run: |
          ~/.acme.sh/acme.sh --issue --dns dns_ali -d static.xkcoding.com

      - name: Deploy to Aliyun CDN
        env:
          Ali_Key: ${{ secrets.ALI_KEY }}
          Ali_Secret: ${{ secrets.ALI_SECRET }}
          CHINESE_REGION: cn-hangzhou
          ALI_CDN_DOMAIN: static.xkcoding.com
        run: |
          ~/.acme.sh/acme.sh --deploy -d static.xkcoding.com --deploy-hook ali_cdn

      - name: Summary
        run: |
          echo "## 🔐 CDN SSL 证书续期完成" >> $GITHUB_STEP_SUMMARY
          echo "- **域名**: static.xkcoding.com" >> $GITHUB_STEP_SUMMARY
          echo "- **部署目标**: 阿里云 CDN" >> $GITHUB_STEP_SUMMARY
          echo "- **时间**: $(date)" >> $GITHUB_STEP_SUMMARY
```

### 对比：重构前后

| 对比项 | 重构前 (certbot standalone) | 重构后 (acme.sh dns_ali) |
|--------|----------------------------|--------------------------|
| 验证方式 | HTTP-01 | DNS-01 |
| 服务中断 | 需要停止 nginx 约 30 秒 | 零停机 |
| 执行位置 | SSH 到服务器 | GitHub Actions |
| 端口依赖 | 需要 80 端口 | 无需任何端口 |
| 复杂度 | 高（端口冲突处理） | 低（纯 API 调用） |
| 证书部署 | 本地生成，本地使用 | 远程生成，SCP 上传 |

---

## 迁移脚本设计

### 脚本架构

```
scripts/
├── migrate-images/
│   ├── index.ts          # 主入口
│   ├── scanner.ts        # Markdown 扫描器
│   ├── downloader.ts     # 图片下载器
│   ├── uploader.ts       # OSS 上传器
│   ├── replacer.ts       # URL 替换器
│   └── types.ts          # 类型定义
├── migrate-images.config.ts  # 配置文件
└── temp/                 # 临时下载目录（gitignore）
```

### 核心数据结构

```typescript
// types.ts
interface ImageRecord {
  // 原始信息
  sourceUrl: string;           // 原始 URL
  sourceType: 'qiniu' | 'aliyun-old' | 'relative';
  markdownFile: string;        // 所在 Markdown 文件
  lineNumber: number;          // 行号

  // 迁移状态
  localPath?: string;          // 本地下载路径
  targetUrl?: string;          // 目标 OSS URL
  status: 'pending' | 'downloaded' | 'uploaded' | 'replaced' | 'failed';
  error?: string;              // 错误信息
}

interface MigrationConfig {
  // 源配置
  sourcePatterns: {
    qiniu: RegExp;             // /static\.xkcoding\.com/
    aliyunOld: RegExp;         // /static\.aliyun\.xkcoding\.com/
    relative: RegExp;          // /^\/resources\//
  };

  // 目标配置
  target: {
    domain: string;            // 'static.xkcoding.com'
    bucket: string;            // 'xkcoding-blog'
    region: string;            // 'oss-cn-hangzhou'
  };

  // 路径配置
  paths: {
    tempDir: string;           // './scripts/temp'
    reportDir: string;         // './scripts/reports'
  };
}
```

### URL 转换规则

```typescript
// URL 转换逻辑
function transformUrl(sourceUrl: string, config: MigrationConfig): string {
  const targetDomain = config.target.domain;

  // 七牛云: static.xkcoding.com/xxx → static.xkcoding.com/xxx
  // 路径保持不变，只是实际存储位置变了
  if (sourceUrl.includes('static.xkcoding.com')) {
    return sourceUrl; // URL 不变，因为域名会指向新的 OSS
  }

  // 阿里云旧域名: static.aliyun.xkcoding.com/2021/09/03/xxx
  // → static.xkcoding.com/2021/09/03/xxx
  if (sourceUrl.includes('static.aliyun.xkcoding.com')) {
    return sourceUrl.replace('static.aliyun.xkcoding.com', targetDomain);
  }

  // 相对路径: /resources/xxx.png → static.xkcoding.com/resources/xxx.png
  if (sourceUrl.startsWith('/resources/')) {
    return `https://${targetDomain}${sourceUrl}`;
  }

  return sourceUrl;
}
```

### 迁移流程伪代码

```typescript
async function migrate() {
  // 1. 扫描
  const images = await scanMarkdownFiles('./src/data/blog');
  console.log(`Found ${images.length} images to migrate`);

  // 2. 下载
  for (const image of images) {
    try {
      await downloadImage(image);
      image.status = 'downloaded';
    } catch (e) {
      image.status = 'failed';
      image.error = e.message;
    }
  }

  // 3. 上传
  const downloaded = images.filter(i => i.status === 'downloaded');
  await uploadToOSS(downloaded); // 使用 ossutil 批量上传

  // 4. 替换（先 dry-run）
  const mapping = generateUrlMapping(images);
  await previewReplacements(mapping);

  // 用户确认后执行
  if (await confirm('Proceed with replacements?')) {
    await executeReplacements(mapping);
  }

  // 5. 生成报告
  await generateReport(images);
}
```

## OSS 目录结构

```
xkcoding-blog/
├── blog/
│   ├── 2019-08-09-abstractfactory-uml.png
│   ├── 2019-08-24-034026.png
│   ├── 2020-05-06-053453.png
│   └── ...
├── resources/
│   ├── coding-standards-1.png
│   ├── volley-demo-20160326012642.png
│   └── ...
├── 2017-07-12-14998277900006.jpg
├── 2018-01-03-15149489321563.jpg
└── ...
```

## 错误处理策略

### 图片下载失败

1. **404 错误**: 记录到 `missing-images.json`，需手动处理
2. **网络超时**: 自动重试 3 次，间隔递增
3. **其他错误**: 记录错误详情，继续处理下一张

### OSS 上传失败

1. **认证失败**: 提示检查 ossutil 配置
2. **权限不足**: 提示检查 Bucket 权限
3. **文件已存在**: 跳过或覆盖（可配置）

### URL 替换失败

1. **文件无法写入**: 提示检查文件权限
2. **替换后格式错误**: 保留原文件备份

## 回滚方案

迁移前自动创建 Git 分支：
```bash
git checkout -b backup/before-image-migration
git checkout -b feature/unify-image-hosting
```

如需回滚：
```bash
git checkout backup/before-image-migration
```

## 工具安装指南

### ossutil 安装

**macOS:**
```bash
# 下载
curl -o ossutil64 https://gosspublic.alicdn.com/ossutil/1.7.14/ossutil64

# 授权
chmod 755 ossutil64

# 移动到 PATH
sudo mv ossutil64 /usr/local/bin/ossutil

# 配置
ossutil config
# 输入 Endpoint: oss-cn-hangzhou.aliyuncs.com
# 输入 AccessKey ID
# 输入 AccessKey Secret
```

**验证:**
```bash
ossutil ls oss://xkcoding-blog/
```

### 获取阿里云 AccessKey

1. 登录阿里云控制台
2. 右上角头像 → AccessKey 管理
3. 创建 AccessKey（建议使用 RAM 子账号）
4. 记录 AccessKey ID 和 AccessKey Secret

**安全建议：**
- 使用 RAM 子账号，仅授予 OSS 相关权限
- 不要将 AccessKey 提交到 Git
