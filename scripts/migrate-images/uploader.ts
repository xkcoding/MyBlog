/**
 * OSS 上传脚本
 * 使用 ossutil 批量上传图片到阿里云 OSS
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import type { ImageRecord } from "./types.js";
import { defaultConfig } from "./types.js";

interface DownloadResult {
  downloadTime: string;
  totalDownloaded: number;
  totalFailed: number;
  success: ImageRecord[];
  failed: ImageRecord[];
}

// ossutil 可能的路径
const OSSUTIL_PATHS = [
  "ossutil",
  path.join(os.homedir(), "bin", "ossutil"),
  "/usr/local/bin/ossutil",
];

let ossutilCmd = "ossutil";

/**
 * 检查 ossutil 是否安装，返回可用的命令路径
 */
function checkOssutil(): boolean {
  for (const cmd of OSSUTIL_PATHS) {
    try {
      execSync(`"${cmd}" version`, { stdio: "pipe" });
      ossutilCmd = cmd;
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * 从本地路径提取 OSS 路径
 */
function getOssPath(localPath: string, tempDir: string): string {
  return path.relative(tempDir, localPath);
}

/**
 * 上传单个文件到 OSS
 */
function uploadFile(localPath: string, ossPath: string, bucket: string): boolean {
  const ossUrl = `oss://${bucket}/${ossPath}`;
  try {
    execSync(`"${ossutilCmd}" cp "${localPath}" "${ossUrl}" --force`, {
      stdio: "pipe",
    });
    return true;
  } catch (error) {
    console.error(`   ❌ 上传失败: ${ossPath}`);
    console.error(`      ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * 批量上传目录到 OSS
 */
function uploadDirectory(localDir: string, bucket: string): { success: number; failed: number } {
  const ossUrl = `oss://${bucket}/`;
  try {
    console.log(`\n📤 开始批量上传到 OSS...`);
    console.log(`   源目录: ${localDir}`);
    console.log(`   目标: ${ossUrl}\n`);

    execSync(`"${ossutilCmd}" cp -r "${localDir}/" "${ossUrl}" --force --update`, {
      stdio: "inherit",
    });

    return { success: -1, failed: 0 }; // ossutil 会自己输出统计
  } catch (error) {
    console.error(`❌ 批量上传失败: ${error instanceof Error ? error.message : String(error)}`);
    return { success: 0, failed: -1 };
  }
}

/**
 * 验证 OSS 上传结果
 */
function verifyUpload(images: ImageRecord[], bucket: string, region: string): ImageRecord[] {
  const failed: ImageRecord[] = [];
  const ossBaseUrl = `https://${bucket}.${region}.aliyuncs.com`;

  console.log("\n🔍 验证上传结果...\n");

  for (const img of images) {
    if (!img.localPath) continue;

    const ossPath = getOssPath(
      img.localPath,
      path.resolve(process.cwd(), defaultConfig.paths.tempDir)
    );
    const ossUrl = `${ossBaseUrl}/${ossPath}`;

    try {
      // 使用 ossutil stat 检查文件是否存在
      execSync(`"${ossutilCmd}" stat "oss://${bucket}/${ossPath}"`, { stdio: "pipe" });
      img.ossPath = ossPath;
      img.targetUrl = `https://${defaultConfig.target.domain}/${ossPath}`;
      img.status = "uploaded";
    } catch {
      img.status = "failed";
      img.error = "OSS file not found";
      failed.push(img);
    }
  }

  return failed;
}

/**
 * 保存上传结果
 */
function saveUploadResult(images: ImageRecord[], reportDir: string): void {
  const report = {
    uploadTime: new Date().toISOString(),
    totalUploaded: images.filter((img) => img.status === "uploaded").length,
    totalFailed: images.filter((img) => img.status === "failed").length,
    images,
  };

  fs.writeFileSync(
    path.join(reportDir, "upload-result.json"),
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
  const downloadResultPath = path.join(reportDir, "download-result.json");

  // 检查 ossutil
  if (!checkOssutil()) {
    console.error("❌ ossutil 未安装或未配置");
    console.error("\n请先安装并配置 ossutil：");
    console.error("  brew install aliyun-cli");
    console.error("  ossutil config");
    console.error("\n或参考文档: https://help.aliyun.com/document_detail/120075.html");
    process.exit(1);
  }

  console.log("✅ ossutil 已安装\n");

  // 检查下载结果是否存在
  if (!fs.existsSync(downloadResultPath)) {
    console.error("❌ 请先运行 downloader.ts 下载图片");
    process.exit(1);
  }

  const downloadResult: DownloadResult = JSON.parse(
    fs.readFileSync(downloadResultPath, "utf-8")
  );

  console.log("📊 下载结果统计：");
  console.log(`   已下载: ${downloadResult.totalDownloaded}`);
  console.log(`   失败: ${downloadResult.totalFailed}`);

  // 检查临时目录是否有文件
  if (!fs.existsSync(tempDir)) {
    console.error(`\n❌ 临时目录不存在: ${tempDir}`);
    process.exit(1);
  }

  const { bucket, region } = defaultConfig.target;

  // 批量上传整个目录
  const uploadResult = uploadDirectory(tempDir, bucket);

  if (uploadResult.failed !== 0) {
    console.log("\n⚠️  部分文件上传可能失败，请检查上面的错误信息");
  }

  // 验证上传结果
  const failedVerify = verifyUpload(downloadResult.success, bucket, region);

  // 保存上传结果
  saveUploadResult(downloadResult.success, reportDir);

  // 输出统计
  const uploaded = downloadResult.success.filter((img) => img.status === "uploaded").length;
  console.log("\n📊 验证结果：");
  console.log(`   成功: ${uploaded}`);
  console.log(`   失败: ${failedVerify.length}`);

  if (failedVerify.length > 0) {
    console.log("\n❌ 验证失败的图片：");
    failedVerify.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.sourceUrl}`);
      console.log(`      本地: ${img.localPath}`);
    });
  }

  console.log(`\n📄 上传结果已保存到: ${path.join(reportDir, "upload-result.json")}`);

  // 输出 OSS 访问示例
  console.log("\n🔗 OSS 访问示例：");
  const exampleImage = downloadResult.success.find((img) => img.status === "uploaded");
  if (exampleImage && exampleImage.ossPath) {
    console.log(`   OSS 直接访问: https://${bucket}.${region}.aliyuncs.com/${exampleImage.ossPath}`);
    console.log(`   CDN 访问（切换后）: https://${defaultConfig.target.domain}/${exampleImage.ossPath}`);
  }
}

main().catch(console.error);
