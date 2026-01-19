export const SITE = {
  website: "https://xkcoding.com/",
  author: "xkcoding",
  profile: "https://github.com/xkcoding",
  desc: "xkcoding的代码成长日记",
  title: "CodingDiary",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 8,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  showToc: true, // 显示侧边栏目录
  editPost: {
    enabled: true,
    text: "发现错误？帮我勘误",
    url: "https://github.com/xkcoding/MyBlog/edit/master/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
} as const;
