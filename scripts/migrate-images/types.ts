/**
 * 图片记录类型
 */
export interface ImageRecord {
  // 原始信息
  sourceUrl: string;
  sourceType: "qiniu" | "aliyun-old" | "relative";
  markdownFile: string;
  lineNumber: number;
  context: string; // 图片所在的 markdown 行

  // 迁移状态
  localPath?: string;
  targetUrl?: string;
  ossPath?: string;
  status: "pending" | "downloaded" | "uploaded" | "replaced" | "failed";
  error?: string;
}

/**
 * 扫描结果
 */
export interface ScanResult {
  totalImages: number;
  bySource: {
    qiniu: number;
    aliyunOld: number;
    relative: number;
  };
  images: ImageRecord[];
  scannedFiles: number;
  scanTime: string;
}

/**
 * 迁移配置
 */
export interface MigrationConfig {
  // 源模式
  sourcePatterns: {
    qiniu: RegExp;
    aliyunOld: RegExp;
    relative: RegExp;
  };

  // 目标配置
  target: {
    domain: string;
    bucket: string;
    region: string;
  };

  // 路径配置
  paths: {
    blogDir: string;
    tempDir: string;
    reportDir: string;
  };
}

/**
 * 默认配置
 */
export const defaultConfig: MigrationConfig = {
  sourcePatterns: {
    // 七牛云: http(s)://static.xkcoding.com/xxx
    qiniu: /https?:\/\/static\.xkcoding\.com\/[^\s\)\"\']+/g,
    // 阿里云旧域名: http(s)://static.aliyun.xkcoding.com/xxx
    aliyunOld: /https?:\/\/static\.aliyun\.xkcoding\.com\/[^\s\)\"\']+/g,
    // 相对路径: /resources/xxx
    relative: /(?<![a-zA-Z0-9])\/resources\/[^\s\)\"\']+/g,
  },

  target: {
    domain: "cdn.xkcoding.com",
    bucket: "xkcoding-blog",
    region: "oss-cn-hangzhou",
  },

  paths: {
    blogDir: "src/data/blog",
    tempDir: "scripts/migrate-images/temp",
    reportDir: "scripts/migrate-images/reports",
  },
};
