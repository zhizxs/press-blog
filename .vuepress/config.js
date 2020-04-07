const sidebar = require("./common/sidebar")
module.exports = {
  title: "zhiz",
  description: "有记录，才有发生！有出发，才有到达！",
  // base: "/test/",
  configureWebpack: {
    resolve: {
      alias: {
       
      }
    }
  },
  themeConfig: {
    logo: "../public/img/logo-v.png",
    // sidebar: "auto",
    sidebarDepth: 2,
    nav: [
      { text: "HOME", link: "/" },
      {
        text: "能走多远",
        items: [
          {
            text: "前端日常",
            link: "/Front-end/Base/"
          },
          {
            text: "VUE走起",
            link: "/Front-end/Frame/"
          },
          {
            text: "假的移动端",
            link: "/Front-end/Mobile/"
          },
          {
            text: "项目相随",
            link: "/Front-end/Project-Sum/"
          },
          {
            text: "发散一下",
            link: "/Front-end/Others/"
          },
          {
            text: "碎片时间",
            link: "/Front-end/Tips/"
          },
          {
            text: "工具收藏",
            link: "/Front-end/Tools/"
          }
        ]
      },
      {
        text: "平凡之路",
        items: [
          {
            text: "学习中",
            link: "/OnTheWay/BookNotes/"
          },
          {
            text: "行走中",
            link: "/OnTheWay/Travels/"
          },
          {
            text: "思考中",
            link: "/OnTheWay/Articles/"
          }
        ]
      },
      {
        text: "什么玩意",
        link: "..."
      }
    ],
    sidebar: {
      ...sidebar
    }
  }
}
