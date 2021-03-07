## Sentry 前端监控

项目是使用vue cli2.0版本搭建的，目录结构与3.0cli搭出来的不一样。仅学习使用可以使用vue cli官方提供的方法将版本降级。

```bash
npm install -g @vue/cli-init
vue init webpack my-project
```

### 一、集成Sentry

1. 登录官网https://sentry.io/，注册账号，建立组织（organization）和项目（project）

2. 安装sentry sdk

```bash
npm install @sentry/browser
npm install @sentry/integrations
```


3. 在main.js中初始化监控服务,下面代码是官方直接提供的。

```js
import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
 
Sentry.init({
	dsn: 'https://8a8ee2ff6ade434193cef8d7c235bfa5@o416492.ingest.sentry.io/5311690',// dsn是官方提供的，每个项目的dsn都不相同，这里换成自己项目的
	integrations: [new Integrations.Vue({
		Vue,
		attachProps: true
	})],
})

````

**因为监控服务是通过Vue.config.errorHandler实现的，初始化后控制台将不再显示错误信息，因此不需要在开发环境使用。在初始化前判断是否是开发环境。**

```js
process.env.NODE_ENV!=='development'&&Sentry.init({
	dsn: 'https://d8b8b63d1d92443294261269bfa849a1@sentry.io/1501448',
	integrations: [new Integrations.Vue({Vue, attachProps: true})],
});

```

不仅需要区分开发环境，我们同样不希望在统计中看到测试环境的信息，因此需要屏蔽测试环境。

初始化后Sentry就可以自动将运行时抛出的异常自动上传到Sentry后台。同时我们也可以定义业务异常，手动抛出错误。

```js
//手动抛出异常
Sentry.captureException(new Error("Something broke"));
```


### 二、上传source-map，定位源码中的错误

在项目构建时，js代码会进行压缩处理。为了在Sentry控制台中能看到具体的错误发生位置，可以将source-map文件上传到Sentry。Sentry提供了多种上传方式，这里使用webpack插件实现构建过程中自动上传。

1. 安装webpack插件

```bash
npm install --save-dev @sentry/webpack-plugin
```

2. 修改webpack打包配置文件，增加如下代码

```js
// webpack.prod.conf.js
var SentryCliPlugin = require('@sentry/webpack-plugin')
new SentryCliPlugin({
    release: process.env.RELEASE_VERSION,
    include: 'dist/static/js'
})
 
// prod.env.js
'use strict'
let gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
module.exports = {
  RELEASE_VERSION: `"${gitSha}"`,
  NODE_ENV: '"production"'
}

```

3. 在项目根目录创建`.sentryclirc`文件，内容如下：

```
[auth]
token=a25243a35c3a43e8bd4895a0024c40a1e796d1617df04ad5a553cfac65335486
 
[defaults]
org=zhiz
project=zhiz
url=https://sentry.io/
```
上述token的生成方式：进入sentry主页，点击头像菜单中的api keys，创建token并勾选project:write


完成以上步骤后，每次执行npm run build构建项目时，webpack插件会自动将js文件以及map文件上传到Sentry，可以在后台的release菜单中看到上传的各个版本的详细内容

### 参考文档

[工具集成](https://www.cnblogs.com/xakoy/p/9636393.html)

[自己搭建服务参考](http://sinhub.cn/2019/07/getting-started-guide-of-sentry/)



