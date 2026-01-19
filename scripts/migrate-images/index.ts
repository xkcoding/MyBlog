/**
 * 图片迁移脚本 - 主入口
 *
 * 使用方法：
 *   pnpm migrate:scan      # 扫描所有图片
 *   pnpm migrate:download  # 下载图片到本地
 *   pnpm migrate:upload    # 上传到 OSS
 *   pnpm migrate:replace   # 替换 URL（预览）
 *   pnpm migrate:replace:exec  # 替换 URL（执行）
 *
 * 或直接运行：
 *   pnpm tsx scripts/migrate-images/scanner.ts
 *   pnpm tsx scripts/migrate-images/downloader.ts
 *   pnpm tsx scripts/migrate-images/uploader.ts
 *   pnpm tsx scripts/migrate-images/replacer.ts --dry-run
 *   pnpm tsx scripts/migrate-images/replacer.ts --execute
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           博客图片迁移工具 - 阿里云 OSS                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  步骤 1: 扫描图片                                             ║
║    pnpm tsx scripts/migrate-images/scanner.ts                ║
║                                                              ║
║  步骤 2: 下载图片                                             ║
║    pnpm tsx scripts/migrate-images/downloader.ts             ║
║                                                              ║
║  步骤 3: 上传到 OSS（需先配置 ossutil）                        ║
║    pnpm tsx scripts/migrate-images/uploader.ts               ║
║                                                              ║
║  步骤 4: 替换 URL                                             ║
║    pnpm tsx scripts/migrate-images/replacer.ts --dry-run     ║
║    pnpm tsx scripts/migrate-images/replacer.ts --execute     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📁 报告输出目录: scripts/migrate-images/reports/
📁 临时文件目录: scripts/migrate-images/temp/
`);
