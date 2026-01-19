/**
 * 图片下载脚本
 * 批量下载图片到本地临时目录
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import type { ImageRecord, ScanResult } from "./types.js";
import { defaultConfig } from "./types.js";

/**
 * 从 URL 提取存储路径
 */
function getStoragePath(url: string, sourceType: ImageRecord["sourceType"]): string {
  if (sourceType === "qiniu") {
    // https://static.xkcoding.com/2017-07-12-xxx.jpg → 2017-07-12-xxx.jpg
    // https://static.xkcoding.com/blog/2019-08-09-xxx.png → blog/2019-08-09-xxx.png
    const match = url.match(/static\.xkcoding\.com\/(.+?)(?:\?.*)?$/);
    return match ? match[1] : path.basename(url);
  }

  if (sourceType === "aliyun-old") {
    // https://static.aliyun.xkcoding.com/2021/09/03/xxx.jpg → 2021/09/03/xxx.jpg
    const match = url.match(/static\.aliyun\.xkcoding\.com\/(.+?)(?:\?.*)?$/);
    return match ? match[1] : path.basename(url);
  }

  if (sourceType === "relative") {
    // /resources/xxx.png → resources/xxx.png
    return url.replace(/^\//, "");
  }

  return path.basename(url);
}

/**
 * 下载单个文件
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);

    const request = protocol.get(url, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(destPath);
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });
    });

    request.on("error", (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error("Timeout"));
    });
  });
}

/**
 * 批量下载图片
 */
async function downloadImages(
  images: ImageRecord[],
  tempDir: string,
  concurrency: number = 5
): Promise<{ success: ImageRecord[]; failed: ImageRecord[] }> {
  const success: ImageRecord[] = [];
  const failed: ImageRecord[] = [];

  // 过滤掉相对路径图片（需要单独处理）
  const downloadable = images.filter((img) => img.sourceType !== "relative");

  console.log(`\n📥 开始下载 ${downloadable.length} 张图片（并发数: ${concurrency}）...\n`);

  // 分批下载
  for (let i = 0; i < downloadable.length; i += concurrency) {
    const batch = downloadable.slice(i, i + concurrency);
    const promises = batch.map(async (img) => {
      const storagePath = getStoragePath(img.sourceUrl, img.sourceType);
      const localPath = path.join(tempDir, storagePath);

      // 断点续传：如果文件已存在且大小 > 0，跳过
      if (fs.existsSync(localPath) && fs.statSync(localPath).size > 0) {
        console.log(`   ⏭️  跳过（已存在）: ${storagePath}`);
        img.localPath = localPath;
        img.status = "downloaded";
        success.push(img);
        return;
      }

      try {
        await downloadFile(img.sourceUrl, localPath);
        img.localPath = localPath;
        img.status = "downloaded";
        success.push(img);
        console.log(`   ✅ ${storagePath}`);
      } catch (error) {
        img.status = "failed";
        img.error = error instanceof Error ? error.message : String(error);
        failed.push(img);
        console.log(`   ❌ ${storagePath} - ${img.error}`);
      }
    });

    await Promise.all(promises);
  }

  return { success, failed };
}

/**
 * 保存下载结果
 */
function saveDownloadResult(
  success: ImageRecord[],
  failed: ImageRecord[],
  reportDir: string
): void {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    downloadTime: new Date().toISOString(),
    totalDownloaded: success.length,
    totalFailed: failed.length,
    success,
    failed,
  };

  fs.writeFileSync(
    path.join(reportDir, "download-result.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
}

/**
 * 主函数
 */
async function main() {
  const reportDir = path.resolve(process.cwd(), defaultConfig.paths.reportDir);
  const tempDir = path.resolve(process.cwd(), defaultConfig.paths.tempDir);
  const scanResultPath = path.join(reportDir, "scan-result.json");

  // 检查扫描结果是否存在
  if (!fs.existsSync(scanResultPath)) {
    console.error("❌ 请先运行 scanner.ts 生成扫描结果");
    process.exit(1);
  }

  const scanResult: ScanResult = JSON.parse(fs.readFileSync(scanResultPath, "utf-8"));

  console.log("📊 扫描结果统计：");
  console.log(`   总图片数: ${scanResult.totalImages}`);
  console.log(`   ├─ 七牛云: ${scanResult.bySource.qiniu}`);
  console.log(`   ├─ 阿里云旧域名: ${scanResult.bySource.aliyunOld}`);
  console.log(`   └─ 相对路径: ${scanResult.bySource.relative}（需手动处理）`);

  // 创建临时目录
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // 下载图片（不包括相对路径）
  const { success, failed } = await downloadImages(scanResult.images, tempDir);

  // 保存结果
  saveDownloadResult(success, failed, reportDir);

  // 输出统计
  console.log("\n📊 下载结果：");
  console.log(`   成功: ${success.length}`);
  console.log(`   失败: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\n❌ 下载失败的图片：");
    failed.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      错误: ${img.error}`);
    });
  }

  // 提示相对路径图片
  const relativeImages = scanResult.images.filter((img) => img.sourceType === "relative");
  if (relativeImages.length > 0) {
    console.log("\n⚠️  相对路径图片需要手动处理：");
    relativeImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      文件: ${path.relative(process.cwd(), img.markdownFile)}:${img.lineNumber}`);
    });
  }

  console.log(`\n📄 下载结果已保存到: ${path.join(reportDir, "download-result.json")}`);
  console.log(`📁 图片已保存到: ${tempDir}`);
}

main().catch(console.error);
