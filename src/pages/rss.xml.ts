import rss from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

// 解析 ogImage URL
function getOgImageUrl(
  ogImage: CollectionEntry<"blog">["data"]["ogImage"],
  site: string
): string | undefined {
  if (!ogImage) return undefined;
  if (typeof ogImage === "string") {
    // 远程 URL 直接返回，相对路径拼接 site
    return ogImage.startsWith("http") ? ogImage : new URL(ogImage, site).href;
  }
  if (ogImage.src) {
    // 本地 asset
    return new URL(ogImage.src, site).href;
  }
  return undefined;
}

// 根据 URL 获取图片 MIME type
function getImageMimeType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return mimeTypes[ext || ""] || "image/jpeg";
}

// 截断文本到指定长度
function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// 从文章内容提取摘要
function getExcerpt(content: string, maxLength: number = 300): string {
  const cleaned = content
    .replace(/---[\s\S]*?---/, "") // 移除 frontmatter
    .replace(/<!--more-->/g, "") // 移除 more 标记
    .replace(/<[^>]+>/g, "") // 移除 HTML 标签
    .replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 保留链接文字
    .replace(/^#+\s+/gm, "") // 移除标题标记
    .replace(/[*_`~]/g, "") // 移除强调标记
    .replace(/>\s+/g, "") // 移除引用标记
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/\n+/g, " ") // 换行转空格
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + "...";
}

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath, body }) => {
      const ogImageUrl = getOgImageUrl(data.ogImage, SITE.website);
      return {
        link: getPath(id, filePath),
        title: data.title,
        description:
          truncate(data.description, 350) || getExcerpt(body || "", 350),
        content: getExcerpt(body || "", 500),
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        // 添加头图作为 enclosure
        ...(ogImageUrl && {
          enclosure: {
            url: ogImageUrl,
            type: getImageMimeType(ogImageUrl),
            length: 0,
          },
        }),
      };
    }),
  });
}
