---
title: 小程序实践Tips
date: 2020-04-18
categories:
  - FrontEnd

tags:
	- 小程序

isShowComments: true
---

### 前言

- Js 运行在微信 app 上下文中，不能操作 DOM
- WXML 展示层，基于 xml , WXSS 修饰层
- 微信小程序运行在三端：iOS、Android 和 用于调试的开发者工具
  - 在 iOS 上，小程序的 javascript 代码是运行在 JavaScriptCore 中
  - 在 Android 上，小程序的 javascript 代码是通过 X5 内核来解析
  - 在 开发工具上， 小程序的 javascript 代码是运行在 nwjs（chrome 内核） 中

### 开发者工具

小程序的 javascript 代码运行在 nwjs 中。借助 Node.js 访问操作系统原生 API 的能力，可以开发中跨平台的应用程序。

#### Electron vs nwjs

- 从技术角度来讲：

  - 应用程序入口不同：Electron 入口是一个 javascript 脚本，脚本里要自己负责创建浏览器窗口，加载 html 页面。而 nwjs 的入口就是一个 html 页面，框架自己会创建浏览器窗口来显示这个 html 页面。
  - Node.js 集成方式不同：Electron 直接使用 Node.js 的共享库，不需要修改 Chromium 代码。而 nwjs 为了集成 Node.js ，需要修改 Chromium 代码，以便在浏览器里能通过 Node.js 访问系统原生 API。
  - Multi-Context: nwjs 有多个上下文，一个是浏览器的上下文，用来访问 Browser 相关 API，比如操作 DOM ，另外一个是 Node 上下文，用来访问操作系统 API。Electron 没有使用多个上下文，对开发者更友好。

- 从应用角度来讲

  - 打包后的文件大小：Electron 打包后文件会比 nwjs 小不少。

  - 代码保护：Electron 只支持代码混淆来保护，而 nwjs 把核心代码放在 V8 引擎里，不但可以保护代码，还可以提高执行效率。

  - 开源社区活跃度：Electron 应该是完胜的。（Atom 和 vscode）

  - 猜测：微信可能基于代码保护选择了 nw.js

## 小程序基础

**原生开发、mpvue?**

如果是新项目，且没有旧的 h5 项目迁移，则考虑用小程序原生开发，好处是相比于第三方框架，坑少

如果有 老的 h5 项目是 vue 开发 或者 也有 h5 项目也需要小程序开发，则比较适合 wepy 或者 mpvue 来做迁移或者开发，近期看 wepy 几乎不更新了，所以推荐美团的 mpvue。

**微信小程序原理？**

本质是单页面程序，页面的渲染和事件处理都在同一个页面进行，但是又可以通过微信客户端调用原生接口；

数据驱动的架构模式，它的 UI 和数据是分离的，所有的页面更新都需要通过对数据的更改来实现；

功能可分为 webview 和 appService 两个部分；webview 用来展现 UI，appService 有来处理业务逻辑、数据及接口调用；

两个部分在两个进程中运行，通过系统层 JSBridge 实现通信，实现 UI 的渲染、事件的处理等

**小程序的生命周期？**

onLoad() 页面加载时触发，只会调用一次，可获取当前页面路径中的参数。

onShow() 页面显示/切入前台时触发，一般用来发送数据请求；

onReady() 页面初次渲染完成时触发, 只会调用一次，代表页面已可和视图层进行交互。

onHide() 页面隐藏/切入后台时触发, 如底部 tab 切换到其他页面或小程序切入后台等。

onUnload() 页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时。

**小程序的双向绑定和 vue 的区别？**

大体相同，但小程序直接 this.data 的属性是不可以同步到视图的，必须调用 this.setData()方法！

**小程序页面间传递数据的方法？**

- 使用全局变量实现数据传递
- 页面跳转或重定向时，使用 url 带参数传递数据
- 使用组件模板 template 传递参数
- 使用缓存传递参数
- 使用数据库传递数据

**封装小程序的数据请求？**

- - 在根目录下创建 utils 目录及 api.js 文件和 apiConfig.js 文件；
  - 在 apiConfig.js 封装基础的 get, post 和 put， upload 等请求方法，设置请求体，带上 token 和异常处理等；
  - 在 api 中引入 apiConfig.js 封装好的请求方法，根据页面数据请求的 urls, 设置对应的方法并导出；
  - 在具体的页面中导入

**wxss 与 css?**

- 都是用来描述页面的样式；
- WXSS 具有 CSS 大部分的特性，也做了一些扩充和修改；
- WXSS 新增了尺寸单位，WXSS 在底层支持新的尺寸单位 rpx；
- WXSS 仅支持部分 CSS 选择器；
- WXSS 提供全局样式与局部样式

**微信小程序的目录和文件作用？**

- project.config.json 项目配置文件，用得最多的就是配置是否开启 https 校验；
- App.js 设置一些全局的基础数据等；
- App.json 底部 tab, 标题栏和路由等设置；
- App.wxss 公共样式，引入 iconfont 等；
- pages 里面包含一个个具体的页面；
- index.json (配置当前页面标题和引入组件等)；
- index.wxml (页面结构)；
- index.wxss (页面样式表)；
- index.js (页面的逻辑，请求和数据处理等)；

小程序学习：https://www.jianshu.com/p/1221fd588311?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation

# 原生微信小程序框架

**详细参考代码和官方文档**

微信小程序的框架包含两部分 View 视图层、App Service 逻辑层。View 层用来渲染页面结构，AppService 层用来逻辑处理、数据请求、接口调用。**_它们运行在两个线程运行。_**

视图层和逻辑层通过系统层的 JSBridage 进行通信，逻辑层把数据变化通知到视图层，触发视图层页面更新，视图层把触发的事件通知到逻辑层进行业务处理。

**视图层使用 WebView 渲染，iOS 中使用自带 WKWebView，在 Android 使用腾讯的 x5 内核（基于 Blink）运行。**

**逻辑层使用在 iOS 中使用自带的 JSCore 运行，在 Android 中使用腾讯的 x5 内核（基于 Blink）运行。**

**开发工具使用 nw.js 同时提供了视图层和逻辑层的运行环境。**

## 项目结构（分包）

- pages 主包
- packageA 分包（应项目大小而定）
- 整个小程序所有分包大小不超过 8M
- 单个分包/主包大小不能超过 2M

## 页面组成

> 开发者工具创建 自动生成

- xxx.wxss 样式
  - wxss 编译器：wcsc 把 wxss 文件转化为 js
  - 使用 `@import`语句可以导入外联样式表，相对路径
  - 避免内联样式
  - app.wxss 为全局样式
- xxx.wxml 结构
  - 支持数据绑定
  - 支持逻辑算术、运算
  - 支持模板、引用
  - 支持添加事件（bindtap）
  - Wxml 编译器：Wcc 把 Wxml 文件 转为 JS
- xxx.js
- xxx.json 页面私有配置

## 页面生命周期

- 开发者工具创建 自动生成

## 组件以及通信

**Native 实现的组件：canvas/video/map/textarea**

Native 组件层在 WebView 层之上。这目前带来了一些问题：

- Native 实现的组件会遮挡其他组件
- WebView 渲染出来的视图在滚动时，Native 实现的组件需要更新位置，这会带来性能问题，在安卓机器上比较明显
- 小程序原生组件 `cover-view` 可以覆盖 cavnas video 等，但是也有一下弊端，比如在 cavnas 上覆盖 `cover-view`，就会发现坐标系不统一处理麻烦

## 模板（只做展示结构数据）

```
<template is="temp1" data="{{tempName,staffA}}" />
```

> 1. 一定要 data。
> 2. 存在作用域 只能访问 data 中的数据。

## 界面适配设计稿

- 按照 750 标准设计稿执行

## 动态样式以及类

```
	class="cla1,{{rule?'cla2':'cla3'}}"

	style="color:{{color}}"
```

## 公共函数的封装与引用

## wxs 的使用

- 每一个 .wxs 文件和 `<wxs>` 标签都是一个单独的模块。
- 每个模块都有自己独立的作用域。即在一个模块里面定义的变量与函数，默认为私有的，对其他模块不可见。
- 一个模块要想对外暴露其内部的私有变量与函数，只能通过 module.exports 实现。
- 在.wxs 模块中引用其他 wxs 文件模块，可以使用 require 函数。 绝对路径 单例 不引用不解析
- 按照官方文档 数据操作参照 es5

## 登录处理

#### unionid 和 openid

- `OpenId` 是一个用户对于一个小程序／公众号的标识，开发者可以通过这个标识识别出用户。

- `UnionId` 是一个用户对于同主体微信小程序／公众号／APP 的标识，开发者需要在微信开放平台下绑定相同账号的主体。开发者可通过 UnionId，实现多个小程序、公众号、甚至 APP 之间的数据互通了。

#### 利用 OpenId 创建用户体系

**_打扰最低，静默登录。（不知道现在政策有没有变）_**

**步骤：**

- 小程序客户端通过 `wx.login` 获取 code

- 传递 code 向服务端，服务端拿到 code 调用微信登录凭证校验接口，微信服务器返回 `openid` 和会话密钥 `session_key` ，此时开发者服务端便可以利用 `openid` 生成用户入库，再向小程序客户端返回自定义登录态

- 小程序客户端缓存 （通过`storage`）自定义登录态（token），后续调用接口时携带该登录态作为用户身份标识即可

#### 利用 Unionid 创建用户体系

> 如果想实现多个小程序，公众号，已有登录系统的数据互通，可以通过获取到用户 unionid 的方式建立用户体系

**获取 unionid 方式：**

- 如果户关注了某个相同主体公众号，或曾经在某个相同主体 App、公众号上进行过微信登录授权，通过 `wx.login` 可以直接获取 到 `unionid`

- 结合 `wx.getUserInfo` 和 `这两种方式引导用户主动授权，主动授权后通过返回的信息和服务端交互 (这里有一步需要服务端解密数据的过程，很简单，微信提供了示例代码) 即可拿到`unionid` 建立用户体系， 然后由服务端返回登录态，本地记录即可实现登录，附上微信提供的最佳实践：
  - 调用 wx.login 获取 code，然后从微信后端换取到 session_key，用于解密 getUserInfo 返回的敏感数据。
  - 使用 wx.getSetting 获取用户的授权情况
    - 如果用户已经授权，直接调用 API wx.getUserInfo 获取用户最新的信息；
    - 用户未授权，在界面中显示一个按钮提示用户登入，当用户点击并授权后就获取到用户的最新信息。
  - 获取到用户数据后可以进行展示或者发送给自己的后端。

**\*注意事项：**

1、需要用户主动授权 遵守规则，防止不过审。

​ `流程： wx.login(获取code) ===> wx.getUserInfo(用户授权) ===> 获取 unionid`

2、因为小程序不存在 `cookie` 的概念， 登录态必须缓存在本地，因此强烈建议为登录态设置过期时间

3、值得一提的是如果需要支持风控安全校验，多平台登录等功能，可能需要加入一些公共参数，例如 platform，channel，deviceParam 等参数。在和服务端确定方案时，作为前端同学应该及时提出这些合理的建议，设计合理的系统。

4、`openid` ， `unionid` 不要在接口中明文传输，这是一种危险的行为，同时也很不专业。

#### 授权获取用户信息

- session_key 有有效期，有效期并没有被告知开发者，只知道用户越频繁使用小程序，session_key 有效期越长

- 在调用 wx.login 时会直接更新 session_key，导致旧 session_key 失效

- 小程序内先调用 wx.checkSession 检查登录态，并保证没有过期的 session_key 不会被更新，再调用 wx.login 获取 code。接着用户授权小程序获取用户信息，小程序拿到加密后的用户数据，把加密数据和 code 传给后端服务。后端通过 code 拿到 session_key 并解密数据，将解密后的用户信息返回给小程序

**先授权获取用户信息再 login 会发生什么？**

- 用户授权时，开放平台使用旧的 session_key 对用户信息进行加密。调用 wx.login 重新登录，会刷新 session_key，这时后端服务从开放平台获取到新 session_key，但是无法对老 session_key 加密过的数据解密，用户信息获取失败

- 在用户信息授权之前先调用 wx.checkSession 呢？wx.checkSession 检查登录态，并且保证 wx.login 不会刷新 session_key，从而让后端服务正确解密数据。但是这里存在一个问题，如果小程序较长时间不用导致 session_key 过期，则 wx.login 必定会重新生成 session_key，从而再一次导致用户信息解密失败。

## 小程序图片导出

#### 原理

​ canvas + wxApi

#### 优雅实现

可能多次调用，建议封装组件。

#### 注意事项

- 小程序中无法绘制网络图片到 canvas 上，需要通过 downLoadFile 先下载图片到本地临时文件才可以绘制

- 通常需要绘制二维码到导出的图片上，有[一种方式](https://developers.weixin.qq.com/miniprogram/dev/api/qrcode.html)导出二维码时，需要携带的参数必须做编码，而且有具体的长度（32 可见字符）限制，可以借助服务端生成 `短链接` 的方式来解决

## 数据统计

#### 埋点 SDK 的设计

小程序的代码结构是，每一个 Page 中都有一个 Page 方法，接受一个包含生命周期函数，数据的 `业务逻辑对象` 包装这层数据，借助小程序的底层逻辑实现页面的业务逻辑。通过这个我们可以想到思路，对 Page 进行一次包装，篡改它的生命周期和点击事件，混入埋点代码，不干扰业务逻辑，只要做一些简单的配置即可埋点，简单的代码实现如下：

```
代码仅供理解思路
  page = function(params) {
    let keys = params.keys()
    keys.forEach(v => {
        if (v === 'onLoad') {
          params[v] = function(options) {
            stat()   //曝光埋点代码
            params[v].call(this, options)
          }
        }
        else if (v.includes('click')) {
          params[v] = funciton(event) {
            let data = event.dataset.config
            stat(data)  // 点击埋点
            param[v].call(this)
          }
        }
    })
  }

// 异常处理也可以参考该思路
```

## 小程序工程化

#### 工程化存在的问题

- 不支持 css 预编译器,作为一种主流的 css 解决方案，不论是 less,sass,stylus 都可以提升 css 效率

- 不支持引入 npm 包 （这一条，从微信公开课中听闻，微信准备支持）

- 不支持 ES7 等后续的 js 特性，好用的 async await 等特性都无法使用

- 不支持引入外部字体文件，只支持 base64

- 没有 eslint 等代码检查工具

> 小程序是多页面应用，工具解决的问题主要就是编译，修改，拷贝等处理，可以使用基于流的`gulp`
>
> 来处理。多页面配置简单。

#### 思路

通过 gulp 的 task 实现：

1. 实时编译 less 文件至相应目录
2. 引入支持 async，await 的运行时文件
3. 编译字体文件为 base64 并生成相应 css 文件，方便使用
4. 依赖分析哪些地方引用了 npm 包，将 npm 包打成一个文件，拷贝至相应目录
5. 检查代码规范

上述实现起来其实并不是很难，但是这样的话就是一份纯粹的 gulp 构建脚本和 约定好的目录而已，每次都有一个新的小程序都来拷贝这份脚本来处理吗？显然不合适，那如何真正的实现 `小程序工程化` 呢？ 我们可能需要一个简单的脚手架，脚手架需要支持的功能：

1. 支持新建项目，创建 Page，创建 Component
2. 支持内置构建脚本
3. 支持发布小程序，也可以想办法接入 Jenkins 等工具做持续集成 (小程序持续集成后面会提) ...

## 目前存在的限制

小程序仍然使用 WebView 渲染，并非原生渲染。（部分原生）

服务端接口返回的头无法执行，比如：Set-Cookie。

依赖浏览器环境的 JS 库不能使用。

不能使用 npm，但是可以自搭构建工具或者使用 mpvue。（未来官方有计划支持）

不能使用 ES7，可以自己用 babel+webpack 自搭或者使用 mpvue。

不支持使用自己的字体（未来官方计划支持）。

可以用 base64 的方式来使用 iconfont。

小程序不能发朋友圈（可以通过保存图片到本地，发图片到朋友前。二维码可以使用[B 接口](https://developers.weixin.qq.com/miniprogram/dev/api/qrcode.html)）。

获取[二维码/小程序](https://developers.weixin.qq.com/miniprogram/dev/api/qrcode.html)接口的限制。

- B 接口 scene 最大 32 个可见字符。
- AC 接口总共生成的码数量限制为 100,000，请谨慎调用。
- 真机扫描二维码只能跳转到线上版本，所以测试环境下只可通过开发者工具的通过二维码编译进行调试。
- 没有发布到线上版本的小程序页面路径会导致生成二维码失败，需要先将添加了页面的小程序发布到线上版本。

小程序推送只能使用“服务通知” 而且需要用户主动触发提交 formId，formId 只有 7 天有效期。（现在的做法是在每个页面都放入 form 并且隐藏以此获取更多的 formId。后端使用原则为：优先使用有效期最短的）

小程序大小限制 2M，分包总计不超过 8M

转发（分享）小程序不能拿到成功结果，原来可以。[链接](https://mp.weixin.qq.com/s?__biz=MjM5NDAwMTA2MA==&mid=2695730124&idx=1&sn=666a448b047d657350de7684798f48d3&chksm=83d74a07b4a0c311569a748f4d11a5ebcce3ba8f6bd5a4b3183a4fea0b3442634a1c71d3cdd0&scene=21#wechat_redirect)（小游戏造的孽）

拿到相同的 unionId 必须绑在同一个开放平台下。开放平台绑定限制：

- 50 个移动应用
- 10 个网站
- 50 个同主体公众号
- 5 个不同主体公众号
- 50 个同主体小程序
- 5 个不同主体小程序

公众号关联小程序，[链接](https://developers.weixin.qq.com/miniprogram/introduction/#公众号关联小程序)

- 所有公众号都可以关联小程序。
- 一个公众号可关联 10 个同主体的小程序，3 个不同主体的小程序。
- 一个小程序可关联 500 个公众号。
- 公众号一个月可新增关联小程序 13 次，小程序一个月可新增关联 500 次。

一个公众号关联的 10 个同主体小程序和 3 个非同主体小程序可以互相跳转

品牌搜索不支持金融、医疗

小程序授权需要用户主动点击

小程序不提供测试 **access_token**

安卓系统下，小程序授权获取用户信息之后，删除小程序再重新获取，并重新授权，得到旧签名，导致第一次授权失败

开发者工具上，授权获取用户信息之后，如果清缓存选择全部清除，则即使使用了 wx.checkSession，并且在 session_key 有效期内，授权获取用户信息也会得到新的 session_key

**不支持 http2**,服务器做处理。

## 性能优化

**view 部分运行在 webview 上，前端的优化方式都能使用**

加载优化：

- 代码压缩。
- 及时清理无用代码和资源文件。
- 减少代码包中的图片等资源文件的大小和数量。
- 分包加载。

首屏加载：

- 提前请求: 异步数据请求不需要等待页面渲染完成。

- 利用缓存: 利用 storage API 对异步请求数据进行缓存，二次启动时先利用缓存数据渲染页面，在进行后台更新。

- 避免白屏：先展示页面骨架页和基础内容。

- 及时反馈：即时地对需要用户等待的交互操作给出反馈，避免用户以为小程序无响应。

分包加载：

- 主包保留核心，启动时会首先加载；
- 使用分包，按需加载；
- 各分包独立，可引用主包文件
- 分包预下载

#### 渲染性能优化

每次 setData 的调用都是一次进程间通信过程，通信开销与 setData 的数据量正相关。

setData 会引发视图层页面内容的更新，这一耗时操作一定时间中会阻塞用户交互。

**setData 是小程序开发使用最频繁，也是最容易引发性能问题的。**

**避免不当使用 setData**

- 使用 data 在方法间共享数据，**可能增加 setData 传输的数据量。**。data 应仅包括与页面渲染相关的数据。
- 使用 setData 传输大量数据，**通讯耗时与数据正相关，页面更新延迟可能造成页面更新开销增加。**仅传输页面中发生变化的数据，使用 setData 的特殊 key 实现局部更新。
- 短时间内频繁调用 setData，**操作卡顿，交互延迟，阻塞通信，页面渲染延迟。**避免不必要的 setData，对连续的 setData 调用进行合并。
- 在后台页面进行 setData，**抢占前台页面的渲染资源。**页面切入后台后的 setData 调用，延迟到页面重新展示时执行。

**避免不当使用 onPageScroll**

- 只在有必要的时候监听 pageScroll 事件。不监听，则不会派发。
- 避免在 onPageScroll 中执行复杂逻辑
- 避免在 onPageScroll 中频繁调用 setData
- 避免滑动时频繁查询节点信息（SelectQuery）用以判断是否显示，部分场景建议使用节点布局橡胶状态监听（inersectionObserver）替代

**使用自定义组件**

在需要频繁更新的场景下，自定义组件的更新只在组件内部进行，不受页面其他部分内容复杂性影响。

## tips

- .json 文件不可注释。
- 可用 block 块结合 wx:if/wx:for 来实现一块代码的操作，block 不翻译，起包裹作用。
- .wxml 中的 {{}} 可进行 三目 运算 不能使用一些 js 对象操作，如 Math.,JSON.。
- 小程序页面切换到后台，再切换到前台时。调用的是生命周期是 onshow , 不会执行 onload 。可能保证在进入一次后，以后进来有数据。
- showToast 和 showLoading 调用的是同一个弹窗。所以先调用的会被后调用的覆盖掉，hideLoading 会隐藏 showToast.这个会在真机上出现，开发者工具正常。
- 封装有时效的本地存储
