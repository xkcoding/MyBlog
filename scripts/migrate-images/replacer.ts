/**
 * URL 替换脚本
 * 批量替换 Markdown 文件中的图片 URL
 */

import fs from "node:fs";
import path from "node:path";
import type { ImageRecord } from "./types.js";
import { defaultConfig } from "./types.js";

interface UploadResult {
  uploadTime: string;
  totalUploaded: number;
  totalFailed: number;
  images: ImageRecord[];
}

interface ReplacementRecord {
  file: string;
  lineNumber: number;
  oldUrl: string;
  newUrl: string;
}

/**
 * 生成 URL 映射表
 */
function generateUrlMapping(images: ImageRecord[]): Map<string, string> {
  const mapping = new Map<string, string>();
  const targetDomain = defaultConfig.target.domain;

  for (const img of images) {
    if (img.status !== "uploaded" || !img.ossPath) continue;

    const newUrl = `https://${targetDomain}/${img.ossPath}`;

    if (img.sourceType === "qiniu") {
      // 七牛云 URL 可能是 http 或 https
      mapping.set(img.sourceUrl, newUrl);
      // 同时处理 http 版本
      if (img.sourceUrl.startsWith("https://")) {
        mapping.set(img.sourceUrl.replace("https://", "http://"), newUrl);
      }
    } else if (img.sourceType === "aliyun-old") {
      // 阿里云旧域名，需要去掉查询参数后再映射
      mapping.set(img.sourceUrl, newUrl);
    } else if (img.sourceType === "relative") {
      // 相对路径转为绝对路径
      mapping.set(img.sourceUrl, newUrl);
    }
  }

  return mapping;
}

/**
 * 预览替换（dry-run）
 */
function previewReplacements(
  images: ImageRecord[],
  urlMapping: Map<string, string>
): ReplacementRecord[] {
  const replacements: ReplacementRecord[] = [];

  // 按文件分组
  const fileGroups = new Map<string, ImageRecord[]>();
  for (const img of images) {
    if (!fileGroups.has(img.markdownFile)) {
      fileGroups.set(img.markdownFile, []);
    }
    fileGroups.get(img.markdownFile)!.push(img);
  }

  // 遍历每个文件
  for (const [filePath, fileImages] of fileGroups) {
    for (const img of fileImages) {
      const newUrl = urlMapping.get(img.sourceUrl);
      if (newUrl && newUrl !== img.sourceUrl) {
        replacements.push({
          file: filePath,
          lineNumber: img.lineNumber,
          oldUrl: img.sourceUrl,
          newUrl,
        });
      }
    }
  }

  return replacements;
}

/**
 * 执行替换
 */
function executeReplacements(
  replacements: ReplacementRecord[],
  urlMapping: Map<string, string>
): { success: number; failed: number } {
  let success = 0;
  let failed = 0;

  // 按文件分组
  const fileGroups = new Map<string, ReplacementRecord[]>();
  for (const r of replacements) {
    if (!fileGroups.has(r.file)) {
      fileGroups.set(r.file, []);
    }
    fileGroups.get(r.file)!.push(r);
  }

  // 遍历每个文件
  for (const [filePath, fileReplacements] of fileGroups) {
    try {
      let content = fs.readFileSync(filePath, "utf-8");
      let modified = false;

      for (const r of fileReplacements) {
        if (content.includes(r.oldUrl)) {
          content = content.split(r.oldUrl).join(r.newUrl);
          modified = true;
          success++;
        } else {
          console.log(`   ⚠️  未找到: ${r.oldUrl}`);
          console.log(`      文件: ${path.relative(process.cwd(), filePath)}`);
          failed++;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`   ✅ 已更新: ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      console.error(`   ❌ 处理失败: ${filePath}`);
      console.error(`      ${error instanceof Error ? error.message : String(error)}`);
      failed += fileReplacements.length;
    }
  }

  return { success, failed };
}

/**
 * 保存替换报告
 */
function saveReplacementReport(
  replacements: ReplacementRecord[],
  result: { success: number; failed: number },
  reportDir: string
): void {
  const report = {
    replaceTime: new Date().toISOString(),
    totalReplacements: replacements.length,
    success: result.success,
    failed: result.failed,
    replacements,
  };

  fs.writeFileSync(
    path.join(reportDir, "replacement-result.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  const reportDir = path.resolve(process.cwd(), defaultConfig.paths.reportDir);
  const uploadResultPath = path.join(reportDir, "upload-result.json");

  // 检查上传结果是否存在
  if (!fs.existsSync(uploadResultPath)) {
    console.error("❌ 请先运行 uploader.ts 上传图片");
    process.exit(1);
  }

  const uploadResult: UploadResult = JSON.parse(
    fs.readFileSync(uploadResultPath, "utf-8")
  );

  console.log("📊 上传结果统计：");
  console.log(`   已上传: ${uploadResult.totalUploaded}`);
  console.log(`   失败: ${uploadResult.totalFailed}`);

  // 生成 URL 映射
  const urlMapping = generateUrlMapping(uploadResult.images);
  console.log(`\n🔗 URL 映射数量: ${urlMapping.size}`);

  // 预览替换
  const replacements = previewReplacements(uploadResult.images, urlMapping);
  console.log(`📝 需要替换的 URL: ${replacements.length}`);

  if (replacements.length === 0) {
    console.log("\n✅ 没有需要替换的 URL");
    return;
  }

  if (dryRun) {
    console.log("\n🔍 预览模式（dry-run）：\n");

    // 按文件分组显示
    const fileGroups = new Map<string, ReplacementRecord[]>();
    for (const r of replacements) {
      if (!fileGroups.has(r.file)) {
        fileGroups.set(r.file, []);
      }
      fileGroups.get(r.file)!.push(r);
    }

    for (const [filePath, fileReplacements] of fileGroups) {
      console.log(`📄 ${path.relative(process.cwd(), filePath)}:`);
      for (const r of fileReplacements) {
        console.log(`   L${r.lineNumber}: ${r.oldUrl}`);
        console.log(`         → ${r.newUrl}`);
      }
      console.log();
    }

    console.log("💡 使用 --execute 或 -e 参数执行实际替换");
    console.log("   pnpm tsx scripts/migrate-images/replacer.ts --execute");

    // 保存预览报告
    saveReplacementReport(replacements, { success: 0, failed: 0 }, reportDir);
    console.log(`\n📄 预览报告已保存到: ${path.join(reportDir, "replacement-result.json")}`);
  } else if (args.includes("--execute") || args.includes("-e")) {
    console.log("\n🔄 执行替换...\n");

    const result = executeReplacements(replacements, urlMapping);

    console.log("\n📊 替换结果：");
    console.log(`   成功: ${result.success}`);
    console.log(`   失败: ${result.failed}`);

    // 保存替换报告
    saveReplacementReport(replacements, result, reportDir);
    console.log(`\n📄 替换报告已保存到: ${path.join(reportDir, "replacement-result.json")}`);
  } else {
    console.log("\n用法：");
    console.log("  --dry-run, -d    预览替换（不修改文件）");
    console.log("  --execute, -e    执行替换");
    console.log("\n示例：");
    console.log("  pnpm tsx scripts/migrate-images/replacer.ts --dry-run");
    console.log("  pnpm tsx scripts/migrate-images/replacer.ts --execute");
  }
}

main().catch(console.error);
