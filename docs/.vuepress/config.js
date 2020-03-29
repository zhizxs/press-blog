module.exports = {
  title: "zhiz blog",
  description: "sum up in project",
  // base: "/test/",
  configureWebpack: {
    resolve: {
      alias: {
        "@img": "public/img"
      }
    }
  },
  themeConfig: {
    sidebar: "auto",
    nav: [
      {
        text: "Front-end",
        items: [
          {
            text: "Html&Css",
            link: "/Front-end/Html&Css/"
          },
          {
            text: "Javascript",
            link: "/Front-end/Javascript/"
          },
          {
            text: "Frame",
            link: "/Front-end/Frame/"
          },
          {
            text: "Mobile",
            link: "/Front-end/Mobile/"
          },
          {
            text: "Advance",
            link: "/Front-end/Advance/"
          }
        ]
      },
      {
        text: "Network",
        link: "/Network/"
      },
      {
        text: "Project-sum",
        link: "/Project-sum/"
      },
      {
        text: "Tips",
        link: "/Tips/"
      },
      {
        text: "Tools",
        link: "/Tools/"
      },
      {
        text: "Others",
        link: "/Others/"
      }
    ]
  }
}
