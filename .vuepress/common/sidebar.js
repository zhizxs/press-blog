module.exports = {
  "/Front-end/Base/": [
    {
      title: "HTML&CSS", // 侧边栏名称
      collapsable: true, // 可折叠
      children: ["Html&Css/base_html", "Html&Css/css"]
    },
    {
      title: "JavaScript", // 侧边栏名称
      collapsable: true, // 可折叠
      children: ["JavaScript/js_source", "JavaScript/js_grammer"]
    },
    {
      title: "Advance", // 侧边栏名称
      collapsable: true, // 可折叠
      children: [
        "Advance/advance",
        "Advance/algo-data",
        "Advance/browser",
        "Advance/design-patterns",
        "Advance/fe_optimization",
        "Network/http"
      ]
    }
  ],
  "/Front-end/Frame/": [
    {
      title: "VUE", // 侧边栏名称
      collapsable: true, // 可折叠
      children: ["VUE/vue_base", "VUE/vue_source"]
    }
  ],
  "/Front-end/Mobile/": ["applets", "mic-soft", "mobile"],
  "/Front-end/Project-Sum/": [""],
  "/Front-end/Others/": ["node", "npm", "Review/talk_about_review"],
  "/Front-end/Tips/": ["daly", "fe-buried-point", "js-tips", "tips1"],
  "/Front-end/Tools/": ["Git", "webpack"],
  "/OnTheWay/BookNotes/": [""],
  "/OnTheWay/Travels/": [""],
  "/OnTheWay/Articles/": [""]
}
