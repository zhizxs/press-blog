module.exports = {
  title: "江湖夜雨",
  description: "只有出发，才会到达！",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
    ["meta", { name: "author", content: "zhiz" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "江湖夜雨,vuepress,reco,vuepress-reco,vuepress-theme-reco,blog,个人博客,前端开发,前端,javascript",
      },
    ],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#42b983" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["link", { rel: "apple-touch-icon", href: "/icon_vuepress_reco.png" }],
    [
      "link",
      { rel: "mask-icon", href: "/icon_vuepress_reco.svg", color: "#42b983" },
    ],
    [
      "meta",
      { name: "msapplication-TileImage", content: "/icon_vuepress_reco.png" },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
  ],
  theme: "reco",
  themeConfig: {
    type: "blog",
    huawei: false,
    // 自动形成侧边导航
    sidebar: "auto",
    nav: [
      { text: "主页", link: "/", icon: "reco-home" },
      { text: "时间线", link: "/timeLine/", icon: "reco-date" },
      {
        text: "GitHub",
        link: "https://github.com/zhizxs",
        icon: "reco-github",
      },
    ],
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "分类", // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签", // 默认 “标签”
      },
    },
    sidebarDepth: 3,
    // 文档更新时间
    lastUpdated: false,
    authorAvatar: "/logo.jpg",
    author: "知之",
    startYear: "2020",
    logo: "/logo.jpg",
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 评论
    valineConfig: {
      appId: "WRjiGzVwGFdwPMavxucEUaEp-gzGzoHsz",
      appKey: "ascCxu6BLpXbnzCJdHGMK90W",
      placeholder: "填写邮箱可以收到回复提醒哦！",
      avatar: "wavatar",
      notify: true,
    },
    // 密钥
    // keyPage: {
    //   keys: ["d5c186983b52c4551ee00f72316c6eaa"],
    //   color: "#42b983", // 登录页动画球的颜色
    //   lineColor: "#42b983", // 登录页动画线的颜色
    // },
    //  备案
    record: "皖ICP备19024044号",
    recordLink:
      "http://www.beian.miit.gov.cn/state/outPortal/loginPortal.action",
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    "ribbon", // 彩带背景
    "@vuepress/google-analytics",
    {
      ga: "UA-163946020-1",
    },
  ],
}
