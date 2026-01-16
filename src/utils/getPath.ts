/**
 * Get full path of a blog post
 * @param id - id of the blog post (slug without date, e.g., "design-pattern-simple-factory")
 * @param filePath - the blog post full file location (e.g., "src/data/blog/2019-02-13.design-pattern-simple-factory.md")
 * @param includeBase - whether to include base path prefix and ".html" extension
 * @returns blog post path in format "{base}/YYYY-MM-DD-slug.html" or "YYYY-MM-DD-slug"
 */
export function getPath(
  id: string,
  filePath?: string | undefined,
  includeBase = true
) {
  // 获取 base 路径，移除末尾斜杠以避免双斜杠
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

  // 尝试从 filePath 提取日期前缀
  // filePath 格式: src/data/blog/2019-02-13.design-pattern-simple-factory.md
  // 或者 _archive 目录: src/data/blog/_archive/2017-07-18.win10-download.md
  if (filePath) {
    const fileName = filePath.split("/").pop() || "";
    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})\.(.+)\.md$/);
    if (match) {
      const slug = `${match[1]}-${match[2]}`;
      // includeBase=true 时用于链接，添加 base 和 .html
      // includeBase=false 时用于路由参数，不添加扩展名
      return includeBase ? `${base}/${slug}.html` : slug;
    }
  }

  // 回退：直接使用 id
  return includeBase ? `${base}/${id}.html` : id;
}
