export const SITE = {
  website: "https://xkcoding.com/",
  author: "xkcoding",
  profile: "https://github.com/xkcoding",
  desc: "xkcoding的代码成长日记",
  title: "CodingDiary",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/xkcoding/xkcoding.github.io/edit/main/src/data/blog",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
} as const;
