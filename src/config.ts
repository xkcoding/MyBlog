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
    text: "内容有误？点此修正",
    url: "https://github.com/xkcoding/MyBlog/edit/master/",
  },
  viewSource: {
    enabled: true,
    text: "查看原文",
    url: "https://github.com/xkcoding/MyBlog/raw/master/",
  },
  license: {
    enabled: true,
    type: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
} as const;
