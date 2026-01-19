/**
 * 图片扫描脚本
 * 扫描所有 Markdown 文件，提取图片 URL
 */

import fs from "node:fs";
import path from "node:path";
import type { ImageRecord, ScanResult, MigrationConfig } from "./types.js";
import { defaultConfig } from "./types.js";

/**
 * 递归获取目录下所有 Markdown 文件
 */
function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 从 Markdown 文件中提取图片 URL
 */
function extractImagesFromFile(
  filePath: string,
  config: MigrationConfig
): ImageRecord[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const images: ImageRecord[] = [];
  const seenUrls = new Set<string>();

  lines.forEach((line, index) => {
    // 七牛云图片
    const qiniuMatches = line.matchAll(config.sourcePatterns.qiniu);
    for (const match of qiniuMatches) {
      const url = match[0];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        images.push({
          sourceUrl: url,
          sourceType: "qiniu",
          markdownFile: filePath,
          lineNumber: index + 1,
          context: line.trim().substring(0, 200),
          status: "pending",
        });
      }
    }

    // 阿里云旧域名图片
    const aliyunMatches = line.matchAll(config.sourcePatterns.aliyunOld);
    for (const match of aliyunMatches) {
      const url = match[0];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        images.push({
          sourceUrl: url,
          sourceType: "aliyun-old",
          markdownFile: filePath,
          lineNumber: index + 1,
          context: line.trim().substring(0, 200),
          status: "pending",
        });
      }
    }

    // 相对路径图片
    const relativeMatches = line.matchAll(config.sourcePatterns.relative);
    for (const match of relativeMatches) {
      const url = match[0];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        images.push({
          sourceUrl: url,
          sourceType: "relative",
          markdownFile: filePath,
          lineNumber: index + 1,
          context: line.trim().substring(0, 200),
          status: "pending",
        });
      }
    }
  });

  return images;
}

/**
 * 扫描所有 Markdown 文件
 */
export function scanImages(config: MigrationConfig = defaultConfig): ScanResult {
  const blogDir = path.resolve(process.cwd(), config.paths.blogDir);

  if (!fs.existsSync(blogDir)) {
    throw new Error(`Blog directory not found: ${blogDir}`);
  }

  const markdownFiles = getMarkdownFiles(blogDir);
  const allImages: ImageRecord[] = [];

  for (const file of markdownFiles) {
    const images = extractImagesFromFile(file, config);
    allImages.push(...images);
  }

  // 统计
  const bySource = {
    qiniu: allImages.filter((img) => img.sourceType === "qiniu").length,
    aliyunOld: allImages.filter((img) => img.sourceType === "aliyun-old").length,
    relative: allImages.filter((img) => img.sourceType === "relative").length,
  };

  return {
    totalImages: allImages.length,
    bySource,
    images: allImages,
    scannedFiles: markdownFiles.length,
    scanTime: new Date().toISOString(),
  };
}

/**
 * 保存扫描结果到 JSON 文件
 */
export function saveScanResult(result: ScanResult, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
}

/**
 * 主函数
 */
function main() {
  console.log("🔍 开始扫描 Markdown 文件中的图片...\n");

  const result = scanImages();

  // 保存结果
  const reportDir = path.resolve(process.cwd(), defaultConfig.paths.reportDir);
  const outputPath = path.join(reportDir, "scan-result.json");
  saveScanResult(result, outputPath);

  // 输出统计
  console.log("📊 扫描结果：");
  console.log(`   扫描文件数: ${result.scannedFiles}`);
  console.log(`   图片总数: ${result.totalImages}`);
  console.log(`   ├─ 七牛云: ${result.bySource.qiniu}`);
  console.log(`   ├─ 阿里云旧域名: ${result.bySource.aliyunOld}`);
  console.log(`   └─ 相对路径: ${result.bySource.relative}`);
  console.log(`\n📄 结果已保存到: ${outputPath}`);

  // 按来源分组显示示例
  console.log("\n📋 图片列表预览：\n");

  const qiniuImages = result.images.filter((img) => img.sourceType === "qiniu");
  if (qiniuImages.length > 0) {
    console.log("【七牛云图片】（前 5 条）：");
    qiniuImages.slice(0, 5).forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      文件: ${path.relative(process.cwd(), img.markdownFile)}:${img.lineNumber}`);
    });
    if (qiniuImages.length > 5) {
      console.log(`   ... 还有 ${qiniuImages.length - 5} 条\n`);
    } else {
      console.log();
    }
  }

  const aliyunImages = result.images.filter((img) => img.sourceType === "aliyun-old");
  if (aliyunImages.length > 0) {
    console.log("【阿里云旧域名图片】：");
    aliyunImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      文件: ${path.relative(process.cwd(), img.markdownFile)}:${img.lineNumber}`);
    });
    console.log();
  }

  const relativeImages = result.images.filter((img) => img.sourceType === "relative");
  if (relativeImages.length > 0) {
    console.log("【相对路径图片】：");
    relativeImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      文件: ${path.relative(process.cwd(), img.markdownFile)}:${img.lineNumber}`);
    });
    console.log();
  }
}

// 直接运行时执行 main
main();
