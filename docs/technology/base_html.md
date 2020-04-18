---
title: HTML 相关
date: 2020-04-18
categories:
  - FrontEnd
tags:
  - HTML
  - meta

isShowComments: true
---

## 写在前面

- meta 标签的作用有：搜索引擎优化（seo），定义页面使用语言，自动刷新并指向新的页面，实现网页转换时的动态效果，控制页面缓冲，网页定级评价，控制网页显示的窗口等！

- meta 标签的组成：meta 标签共有两个属性，它们分别是 http-equiv 属性和 name 属性，不同的属性又有不同的参数值，这些不同的参数值就实现了不同的网页功能。

## 提前总结

- name 属性

`<meta name="参数"content="具体的参数值">`

| 参数        |                         值                         | 意义                       |
| ----------- | :------------------------------------------------: | -------------------------- |
| Keywords    |                     网页关键词                     | 告诉搜索引擎关键词         |
| description |                        描述                        | 告诉搜索引擎你网站的的内容 |
| robots      | all,none,index,noindex,follow,nofollow。默认是 all | 以下有说明                 |
| author      |                        作者                        | 标注作者                   |
| generator   |                      信息参数                      | 网站采用什么软件制作       |
| COPYRIGHT   |                      版权信息                      | --                         |

- http-equiv 属性
  > 相当于 http 的文件头作用，它可以向浏览器传回一些有用的信息

`<meta http-equiv="参数"content="参数变量值">`

| 参数                                         |                                                                                                    值                                                                                                     | 意义                                                                   |
| -------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------- |
| Expires(期限)                                |                                                                                      时间,必须使用 GMT 的时间格式。                                                                                       | 可以用于设定网页的到期时间。一旦网页过期，必须到服务器上重新传输。     |
| Pragma(cache 模式)                           |                                                                                                 no-cache                                                                                                  | 这样设定，访问者将无法脱机浏览。                                       |
| Refresh                                      |                                            <meta http-equiv="Refresh"content="2;URL=http://www.haorooms.com"> //(注意后面的引号，分别在秒数的前面和网址的后面)                                            | 其中的 2 是指停留 2 秒钟后自动刷新到 URL 网址。                        |
| Set-Cookie(cookie 设定)                      |                                                  <meta http-equiv="Set-Cookie"content="cookie value=xxx;expires=Friday,12-Jan-200118:18:18GMT；path=/">                                                   | 如果网页过期，那么存盘的 cookie 将被删除。必须使用 GMT 的时间格式。    |
| Window-target(显示窗口的设定)                |                                                                             <meta http-equiv="Window-target"content="\_top">                                                                              | 强制页面在当前窗口以独立页面显示。用来防止别人在框架里调用自己的页面。 |
| content-Type(显示字符集的设定)               |                                                                    <meta http-equiv="content-Type"content="text/html;charset=gb2312">                                                                     | --                                                                     |
| content-Language（显示语言的设定）           |                                                                                                   zh-cn                                                                                                   | --                                                                     |
| Cache-Control 指定请求和响应遵循的缓存机制。 | 请求时的缓存指令包括 no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached;响应消息中的指令包括 public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age | --                                                                     |

## 移动端 web

- viewport

`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">`

    initial-sacle 控制页面最初加载时的缩放等级。
    目的：阻止页面缩放
    Safari 无效。

Safari 使用以下方法：

```js
window.onload = function() {
  document.addEventListener("touchstart", function(event) {
    if (event.touches.length > 1) {
      //多触点
      event.preventDefault() //阻止默认缩放
    }
  })
  var lastTouchEnd = 0
  document.addEventListener(
    "touchend",
    function(event) {
      var now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault() //阻止双击放大
      }
      lastTouchEnd = now
    },
    false
  )
}
```

- ios meta

      	- 启用 webapp 全屏模式，删除苹果的默认工具栏和菜单栏

      	`<meta name="apple-mobile-web-app-capable" content="yes"/>`

      	- 设置添加到主屏后的标题

      	`<meta name="apple-mobile-web-app-title" content="标题">`

      	- 屏幕顶部条颜色

      	`<meta name="apple-mobile-web-app-status-bar-style" content="black"/>`

      	> 在webapp应用下状态条（屏幕顶部条）的颜色，default（白色）black（黑色） black-translucent（灰色半透明）
      	> 若值为"black-translucent"将会占据页面位置（会覆盖页面20px高度–iphone4和itouch4的Retina屏幕为40px）

      	- 忽略电话邮箱

      	`<meta name="format-detection" content="telphone=no, email=no"/>`

* 其他 - DNS 预解析
  `<link rel="dns-prefetch" href="//api.m.taobao.com">`

      	- 禁止百度转码
      	`<meta http-equiv="Cache-Control" content="no-siteapp" />`

      	- 搜索引擎抓取
      	`<meta name="robots" content="index,follow"/>`

> robots 用来告诉搜索机器人哪些页面需要索引，哪些页面不需要索引。
> 具体参数如下：
>
> - 信息参数为 all：文件将被检索，且页面上的链接可以被查询；
> - 信息参数为 none：文件将不被检索，且页面上的链接不可以被查询；
> - 信息参数为 index：文件将被检索；
> - 信息参数为 follow：页面上的链接可以被查询；
> - 信息参数为 noindex：文件将不被检索，但页面上的链接可以被查询；
> - 信息参数为 nofollow：文件将被检索，但页面上的链接不可以被查询；

```
<!DOCTYPE html> <!-- 使用 HTML5 doctype，不区分大小写 -->
<html lang="zh-cmn-Hans"> <!-- 更加标准的 lang 属性写法 http://zhi.hu/XyIa -->
<head>
    <!-- 声明文档使用的字符编码 -->
    <meta charset='utf-8'>
    <!-- 优先使用 IE 最新版本和 Chrome -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <!-- 页面描述 -->
    <meta name="description" content="不超过150个字符"/>
    <!-- 页面关键词 -->
    <meta name="keywords" content=""/>
    <!-- 网页作者 -->
    <meta name="author" content="name, email@gmail.com"/>
    <!-- 搜索引擎抓取 -->
    <meta name="robots" content="index,follow"/>
    <!-- 为移动设备添加 viewport -->
    <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
    <!-- `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边 http://bigc.at/ios-webapp-viewport-meta.orz -->

    <!-- iOS 设备 begin -->
    <meta name="apple-mobile-web-app-title" content="标题">
    <!-- 添加到主屏后的标题（iOS 6 新增） -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->

    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
    <!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 设置苹果工具栏颜色 -->
    <meta name="format-detection" content="telphone=no, email=no"/>
    <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    <!-- 启用360浏览器的极速模式(webkit) -->
    <meta name="renderer" content="webkit">
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 不让百度转码 -->
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    <!-- 微软的老式浏览器 -->
    <meta name="MobileOptimized" content="320">
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait">
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait">
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no">
    <!-- iOS 图标 begin -->
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-57x57-precomposed.png"/>
    <!-- iPhone 和 iTouch，默认 57x57 像素，必须有 -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114-precomposed.png"/>
    <!-- Retina iPhone 和 Retina iTouch，114x114 像素，可以没有，但推荐有 -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144-precomposed.png"/>
    <!-- Retina iPad，144x144 像素，可以没有，但推荐有 -->
    <!-- iOS 图标 end -->

    <!-- iOS 启动画面 begin -->
    <link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>
    <!-- iPad 竖屏 768 x 1004（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>
    <!-- iPad 竖屏 1536x2008（Retina） -->
    <link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>
    <!-- iPad 横屏 1024x748（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>
    <!-- iPad 横屏 2048x1496（Retina） -->

    <link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>
    <!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
    <link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>
    <!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
    <link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>
    <!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
    <!-- iOS 启动画面 end -->

    <!-- iOS 设备 end -->
    <meta name="msapplication-TileColor" content="#000"/>
    <!-- Windows 8 磁贴颜色 -->
    <meta name="msapplication-TileImage" content="icon.png"/>
    <!-- Windows 8 磁贴图标 -->

    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>
    <!-- 添加 RSS 订阅 -->
    <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
    <!-- 添加 favicon icon -->

    <!-- sns 社交标签 begin -->
    <!-- 参考微博API -->
    <meta property="og:type" content="类型" />
    <meta property="og:url" content="URL地址" />
    <meta property="og:title" content="标题" />
    <meta property="og:image" content="图片" />
    <meta property="og:description" content="描述" />
    <!-- sns 社交标签 end -->

    <title>标题</title>
</head>

```

## 面试题

- 用一个 div 模拟 textarea 的实现？

```
<!-- html -->

<div id="textarea" contenteditable="true" placeholder="请输入内容..."></div>

<!-- css -->
    #textarea {
        height: 200px;
        width: 300px;
        padding: 4px;
        border: 1px solid #888;
        resize: vertical;
        overflow: auto;
    }

    #textarea:empty:before {
        content: attr(placeholder);
        color: #bbb;
    }

```

- input 与 textarea 的区别?

  - `<input>`是单行文本框，不会换行。通过 size 属性指定显示字符的长度，注意：当使用 css 限定了宽高，那么 size 属性就不再起作用。
        value 属性指定初始值，Maxlength 属性指定文本框可以输入的最长长度。可以通过 width 和 height 设置宽高，但是也不会增加行数。

  - `<textarea>`  是多行文本输入框，文本区中可容纳无限数量的文本，无 value 属性，其中的文本的默认字体是等宽字体（通常是 Courier） ，可以通   过 cols 和 rows 属性来规定 textarea 的尺寸，不过更好的办法是使用 CSS 的 height 和 width 属性。内容使用 innerHTML 。
