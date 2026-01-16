import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

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
    items: sortedPosts.map(({ data, id, filePath, body }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: truncate(data.description, 350) || getExcerpt(body || "", 350),
      content: getExcerpt(body || "", 500),
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
