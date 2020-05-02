---
title: express项目搭建
date: 2017-10-08
categories:
	- FrontEnd
tags:
- express
- frame

isShowComments: false
---

### 初始化一个 express 项目

- 方法 1：

```
  npm init
  npm install express
```

**supervisor** : 解决每次修改需要重启问题 (热加载)

`npm install -g supervisor`

启动：`supervisor --harmony index` // 该操作已经启动项目，不需要再次 node index 会报错！！
监听当前目录下 node 和 js 后缀的文件，当这些文件发生改动时，supervisor 会自动重启程序。

- 方法 2：

  - 安装命令行工具，用于创建
    `npm install express-generator`

  - 新建工程
    `express -e name`
    `cd name && npm intall`

  - 启动
    `node ./bin/www`

**文件说明:**

app.js 入口文件
package.json 工程信息及模块依赖
node_modules 包
public 存放 image/css/js 等文件
routes 存放路由文件
views 存放视图文件或者模板文件
bin 可执行文件

**_express 针对 app.js 和路由 index.js 修改 看项目_**
修改后运行 `node app`

### 关于路由

- 参数的获取

```js
        get() req.query // 处理 get 请求，获取 get 请求参数

      	// GET /search?q=tobi+ferret
      	req.query.q
      	// => "tobi ferret"

      	post()   req.body  // 处理 post 请求，获取 post 请求体

      	// POST user[name]=tobi&user[email]=tobi@learnboost.com
      	req.body.user.name
      	// => "tobi"

      	req.params   // 处理 /:xxx 形式的 get 或 post 请求，获取请求参数 '/users/:name'
      				路径中 :name 起了占位符的作用，这个占位符的名字是 name
      	// GET /user/tj
      	req.params.name // 通过 req.params.name 取到实际的值。
      	// => "tj"

      	req.param(name)  // 处理 get 和 post 请求，但查找优先级由高到低为 req.params→req.body→req.query

      	// ?name=tobi
      	req.param('name')
      	// => "tobi"

      	// POST name=tobi
      	req.param('name')
      	// => "tobi"

```

- 添加路由规则

- 路由解决方案：

  问题：路由均添加在 index.js 中显得很臃肿，需要独立出来。
  解决：express.Router
  实践：根目录下创建空文件夹 routes，在 routes 目录下创建 index.js 和 users.js。

### 关于模板引擎

init 方式创建 需要安装 ejs

`npm i ejs --save`

    使用 设置模板文件的存储位置和使用
    app.set('views',__dirname+'views');
    app.set('view engine','ejs'); //指定使用哪种模板引擎

### 关于 ejs

- 语法：

  - `<% code %>`：运行 JavaScript 代码，不输出
  - `<%= code %>`：显示转义后的 HTML 内容 (标签作为字符串显示)
  - `<%- code %>`：显示原始 HTML 内容 (标签转化显示)

- includes

  我们使用模板引擎通常不是一个页面对应一个模板，这样就失去了模板的优势，而是把模板拆成可复用的模板片段组合使用

  案例分析：

```
  <!-- views/header.ejs -->
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>


  <!-- views/footer.ejs： -->
    </body>
  </html>


  <!-- views/users.ejs  -->
  <%- include('header') %>
  <h1><%= name.toUpperCase() %></h1>
  <p>hello, <%= name %></p>
  <%- include('footer') %>


```

### 中间件 和 next

> 解释：express 中的中间件（middleware）就是用来处理请求的，当一个中间件处理完，可以通过调用 next() 传递给下一个中间件，如果没有调用 next()，则请求不会往下传递，如内置的 res.render 其实就是渲染完 html 直接返回给客户端，没有调用 next()，从而没有传递给下一个中间件

**使用：**通过 app.use 加载中间件，在中间件中通过 next 将请求传递到下一个中间件，next 可接受一个参数接收错误信息，如果使用了 next(error)，则会返回错误而不会传递到下一个中间件

```js
app.use(function(req, res, next) {
  console.log("1")
  next()
})

app.use(function(req, res, next) {
  console.log("2")
  res.status(200).end()
})
```

> 注意：中间件的加载顺序很重要！比如：通常把日志中间件放到比较靠前的位置，后面将会介绍的 connect-flash 中间件是基于 session 的，所以需要在 express-session 后加载。

**错误处理：**
应用程序为我们自动返回了错误栈信息（express 内置了一个默认的错误处理器），
假如我们想手动控制返回的错误内容，则需要加载一个自定义错误处理的中间件

```js
// <!-- index.js -->
//错误处理
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})
```

### 关于项目搭建

- 目录：
  models: 存放操作数据库的文件
  public: 存放静态文件，如样式、图片等
  routes: 存放路由文件
  views: 存放模板文件
  index.js: 程序主文件
  package.json: 存储项目名、描述、作者、依赖等等信息

- 包下载：
  express: web 框架
  express-session: session 中间件
  connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
  connect-flash: 页面通知提示的中间件，基于 session 实现
  ejs: 模板
  express-formidable: 接收表单及文件的上传中间件
  config-lite: 读取配置文件
  marked: markdown 解析
  moment: 时间格式化
  mongolass: mongodb 驱动
  objectid-to-timestamp: 根据 ObjectId 生成时间戳
  sha1: sha1 加密，用于密码加密
  winston: 日志
  express-winston: 基于 winston 的用于 express 的日志中间件

- 思想：
  不管是小项目还是大项目，将配置与代码分离是一个非常好的做法。我们通常将配置写到一个配置文件里，如 config.js 或 config.json ，并放到项目的根目录下。

- 配置文件：
  config-lite 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同从当前执行进程目录下的 config 目录加载不同的配置文件。如果不设置 NODE_ENV，则读取默认的 default 配置文件，如果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件。

**_如果程序以 NODE_ENV=test node app 启动，则 config-lite 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置;_**

**_如果程序以 NODE_ENV=production node app 启动，则 config-lite 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置。_**

- [restful 风格](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)：
  restful 是一种 api 的设计风格，提出了一组 api 的设计原则和约束条件。

### 关于 session 会话

由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是会话[（Session）](http://justsee.iteye.com/blog/1570652)。

cookie 存储在浏览器（有大小限制），session 存储在服务端（没有大小限制）
通常 session 的实现是基于 cookie 的，即 session id 存储于 cookie 中

我们通过引入 express-session 中间件实现对会话的支持：`app.use(session(options))`

> 原理：session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 {}，当我们登录后设置 `req.session.user = 用户信息`，返回浏览器的头信息中会带上`set-cookie`将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 `req.session.user`。

### 关于 connect-flash

基于 session 实现的通知中间件。

> 原理：设置初始值 `req.session.flash={}`，通过 `req.flash(name, value)` 设置这个对象下的字段和值，通过 `req.flash(name)` 获取这个对象下的值，同时删除这个字段。

### express-session、connect-mongo 和 connect-flash 的区别与联系？？？

- express-session: 会话（session）支持中间件
- connect-mongo: 将 session 存储于 mongodb，需结合 express-session 使用，我们也可以将 session 存储于 redis，如 connect-redis
- connect-flash: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用

### 关于 `app.locals` 和 `res.locals`

express 中有两个对象可用于模板的渲染：`app.locals` 和 `res.locals` 可将变量挂载在其上

在调用 `res.render` 的时候，express 合并（merge）了 3 处的结果后传入要渲染的模板，
优先级：`res.render` 传入的对象>`res.locals` 对象 > `app.locals`对象，
所以 `app.locals` 和 `res.locals`几乎没有区别，都用来渲染模板，使用上的区别在于：`app.locals` 上通常挂载常量信息（如博客名、描述、作者信息），`res.locals` 上通常挂载变量信息，
即每次请求可能的值都不一样（如请求者信息，`res.locals.user = req.session.user`）。

实现：修改 index.js 在 routes(app); 上一行添加

```js
// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description,
}

// 添加模板必需的三个变量
app.use(function(req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash("success").toString()
  res.locals.error = req.flash("error").toString()
  next()
})
```

这样在调用 res.render 的时候就不用传入这四个变量了，express 为我们自动 merge 并传入了模板，所以我们可以在模板中直接使用这四个变量。

### 关于连接数据库 mongodb

使用 Mongolass 这个模块操作 mongodb 进行增删改查。
根目录 下新建 lib 目录，在该目录下新建 mongo.js，添加如下代码：

```js
var config = require("config-lite")(__dirname)
var Mongolass = require("mongolass")
var mongolass = new Mongolass()
mongolass.connect(config.mongodb)
```

Mongolass / Mongoose / mongodb 等库操作数据库。 优缺点自己找。

### 关于日志

日志分为正常请求的日志和错误请求的日志，这两种日志都打印到终端并写入文件
`winston` 和 `express-winston` 记录日志。

记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后。

### 关于测试 mocha 和 supertest

mocha 和 suptertest 是常用的测试组合，通常用来测试 restful 的 api 接口
项目根目录 新建 test 文件夹存放测试文件

`npm i mocha supertest`

istanbul 是一个常用的生成测试覆盖率的库，它会将测试的结果报告生成 html 页面，并放到项目根目录的 coverage 目录下。
`npm i istanbul`

### 关于守护进程

`pm2 / forever`
部署到线上服务器时，不能单纯的靠 `node index` 或者 `supervisor index`来启动了，因为我们断掉 SSH 连接后服务就终止了，这时我们就需要像 pm2 或者 forever 这样的进程管理器了。
进程守护工具，可以用来在生产环境中进行自动重启、日志记录、错误预警等等

1. `npm install pm2 -g`

2. pkg

```json
"scripts": {
"test": "node --harmony ./node_modules/.bin/istanbul cover ./node_modules/.bin/\_mocha",
//"start": "NODE_ENV=production pm2 start index.js --node-args='--harmony' --name 'myblog'"
"start": "cross-env NODE_ENV=production pm2 start index.js --node-args='--harmony' --name 'myblog'"
}

```

**注：win 需要全局安装 cross-env 同时修改 start 命令**

pm2 start/stop: 启动/停止程序
pm2 reload/restart [id|name]: 重启程序
pm2 logs [id|name]: 查看日志
pm2 l/list: 列出程序列表
