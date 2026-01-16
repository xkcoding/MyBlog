/**
 * 获取带 base 路径的 URL
 * @param path - 路径，如 "/" 或 "/posts.html"
 * @returns 完整路径，如 "/MyBlog/" 或 "/MyBlog/posts.html"
 */
export function getUrl(path: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  // 如果 path 已经是完整 URL 或以 # 开头，直接返回
  if (path.startsWith("http") || path.startsWith("#")) {
    return path;
  }
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // 如果 base 是 /，直接返回 path
  if (base === "") {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
}
