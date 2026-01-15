import * as fs from "fs";
import * as path from "path";

// 文章分类配置
const ARCHIVE_ARTICLES = [
  "2016-03-21.helloworld.md",
  "2016-03-24.ubuntu-15.04-install-jdk.md",
  "2016-03-25.android-open-project.md",
  "2016-03-26.first-use-volley-demo.md",
  "2016-03-27.eclipse-tips-variable.md",
  "2016-03-28.lanqiao-exam.md",
  "2016-04-03.android-svn-attention.md",
  "2016-04-05.coding-standards.md",
  "2016-08-31.server-install-centos6.md",
  "2016-12-13.elasticsearch-get-start.md",
  "2017-01-06.connect-oracle11g-rac-url.md",
  "2017-07-18.win10-download.md",
  "2018-02-05.osx-software-lists.md",
  "2020-07-28.mourning-grandpa.md",
  "2020-09-13.what-i-like-to-do-0.md",
];

const SOURCE_DIR = "hexo-backup/source/_posts";
const DEST_DIR = "src/data/blog";
const ARCHIVE_DIR = "src/data/blog/_archive";

interface HexoFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  categories?: string[];
  description?: string;
}

interface AstroPaperFrontmatter {
  title: string;
  author: string;
  pubDatetime: string;
  slug: string;
  featured: boolean;
  draft: boolean;
  tags: string[];
  description: string;
}

function parseFrontmatter(content: string): { frontmatter: HexoFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }

  const yamlStr = match[1];
  const body = match[2];

  // 简单的 YAML 解析
  const frontmatter: HexoFrontmatter = {
    title: "",
    date: "",
  };

  const lines = yamlStr.split("\n");
  let currentKey = "";
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of lines) {
    if (line.match(/^(\w+):\s*$/)) {
      // 数组开始（空值）
      if (currentKey && inArray) {
        (frontmatter as any)[currentKey] = arrayValues;
        arrayValues = [];
      }
      currentKey = line.match(/^(\w+):/)?.[1] || "";
      inArray = true;
    } else if (line.match(/^-\s*(.+)$/) || line.match(/^\s+-\s*(.+)$/)) {
      // 数组项（支持 `- xxx` 和 `  - xxx` 两种格式）
      const value = line.match(/^-\s*(.+)$/)?.[1] || line.match(/^\s+-\s*(.+)$/)?.[1] || "";
      arrayValues.push(value.replace(/^['"]|['"]$/g, "").trim());
    } else if (line.match(/^(\w+):\s*(.+)$/)) {
      // 普通键值对
      if (currentKey && inArray) {
        (frontmatter as any)[currentKey] = arrayValues;
        arrayValues = [];
        inArray = false;
      }
      const keyMatch = line.match(/^(\w+):\s*(.+)$/);
      if (keyMatch) {
        const key = keyMatch[1];
        let value = keyMatch[2].replace(/^['"]|['"]$/g, "");
        (frontmatter as any)[key] = value;
      }
    }
  }

  if (currentKey && inArray) {
    (frontmatter as any)[currentKey] = arrayValues;
  }

  return { frontmatter, body };
}

function extractSlug(filename: string): string {
  // 从文件名提取 slug: 2019-02-13.design-pattern-simple-factory.md -> design-pattern-simple-factory
  const match = filename.match(/^\d{4}-\d{2}-\d{2}\.(.+)\.md$/);
  return match ? match[1] : filename.replace(".md", "");
}

function extractDescription(body: string, maxLength: number = 160): string {
  // 移除 Markdown 语法，提取纯文本
  let text = body
    .replace(/^#+ .+$/gm, "") // 移除标题
    .replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 链接转纯文本
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // 移除代码
    .replace(/[*_~]+/g, "") // 移除强调
    .replace(/>\s+/g, "") // 移除引用
    .replace(/\n+/g, " ") // 换行转空格
    .trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + "...";
  }

  return text || "暂无描述";
}

function convertTags(tags: string[] | undefined): string[] {
  if (!tags || tags.length === 0) {
    return ["uncategorized"];
  }
  return tags.map(tag =>
    tag
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")
  );
}

function formatDate(dateStr: string): string {
  // 将日期转换为 ISO 8601 格式
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function convertToAstroPaper(
  hexoFm: HexoFrontmatter,
  body: string,
  filename: string
): { frontmatter: AstroPaperFrontmatter; body: string } {
  const slug = extractSlug(filename);

  return {
    frontmatter: {
      title: hexoFm.title,
      author: "xkcoding",
      pubDatetime: formatDate(hexoFm.date),
      slug: slug,
      featured: false,
      draft: false,
      tags: convertTags(hexoFm.tags),
      description: hexoFm.description || extractDescription(body),
    },
    body,
  };
}

function generateFrontmatterYaml(fm: AstroPaperFrontmatter): string {
  const title = String(fm.title || "").replace(/"/g, '\\"');
  const description = String(fm.description || "暂无描述").replace(/"/g, '\\"');

  const lines = [
    "---",
    `title: "${title}"`,
    `author: ${fm.author}`,
    `pubDatetime: ${fm.pubDatetime}`,
    `slug: ${fm.slug}`,
    `featured: ${fm.featured}`,
    `draft: ${fm.draft}`,
    `tags:`,
    ...fm.tags.map(tag => `  - ${tag}`),
    `description: "${description}"`,
    "---",
  ];
  return lines.join("\n");
}

function migrateArticle(filename: string, isArchive: boolean): void {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const destDir = isArchive ? ARCHIVE_DIR : DEST_DIR;
  const destPath = path.join(destDir, filename);

  if (!fs.existsSync(sourcePath)) {
    console.log(`[SKIP] ${filename} - 文件不存在`);
    return;
  }

  const content = fs.readFileSync(sourcePath, "utf-8");

  try {
    const { frontmatter: hexoFm, body } = parseFrontmatter(content);
    const { frontmatter: astroFm, body: newBody } = convertToAstroPaper(hexoFm, body, filename);

    const newContent = generateFrontmatterYaml(astroFm) + "\n" + newBody;

    fs.writeFileSync(destPath, newContent, "utf-8");
    console.log(`[${isArchive ? "ARCHIVE" : "KEEP"}] ${filename}`);
  } catch (error) {
    console.error(`[ERROR] ${filename}: ${error}`);
  }
}

function main(): void {
  // 确保目标目录存在
  fs.mkdirSync(DEST_DIR, { recursive: true });
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  // 获取所有文章
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith(".md"));

  console.log(`\n=== 开始迁移 ${files.length} 篇文章 ===\n`);

  let keepCount = 0;
  let archiveCount = 0;

  for (const file of files) {
    const isArchive = ARCHIVE_ARTICLES.includes(file);
    migrateArticle(file, isArchive);

    if (isArchive) {
      archiveCount++;
    } else {
      keepCount++;
    }
  }

  console.log(`\n=== 迁移完成 ===`);
  console.log(`保留: ${keepCount} 篇`);
  console.log(`归档: ${archiveCount} 篇`);
}

main();
