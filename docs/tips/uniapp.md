---
title: uniapp
date: 2019-5-15
categories:
  - FrontEnd
tags:
  - uniapp

isShowComments: true
pulish: false
---

- static 不参与打包，需要编译的 ES6,less,sass 等需要放到公共资源目录 common

- 全局样式定义在 App.vue 中的样式作用于全局

- 内容生成仅在会 h5+和微信小程序生效

- @import "../../common/uni.css";注意分号

- upx,px,rem
  upx 以 750 宽度为基准，不适合动态绑定。需 `uni.upx2px(750 / 2) + 'px'`;
  元素宽度计算：`750 * 元素在设计稿中的宽度 / 设计稿基准宽`

- css 变量定义状态栏，内容区域距顶部和底部的距离

  ```css
  height:var(--status-bar-height) ；
  bottom: calc(var(--window-bottom) + 10px);
  ```

- 媒体查询中的 `-webkit-device-pixel-ratio : 3`

- 组件
  view 类似组件

- 方法的同步操作加 try-catch
