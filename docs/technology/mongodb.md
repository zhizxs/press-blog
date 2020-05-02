---
title: mongodb
date: 2017-04-18
categories:
  - FrontEnd
tags:
  - mongodb

isShowComments: false
---

### 安装

1.  官网下载
2.  傻瓜安装 （程序安装或者将压缩包里面的文件考到 MongoDB 中）
3.  配置

    1. 创建 data\db
       `mkdir data`
       `cd data && mkdir db`
    2. 进入 bin 目录（或者讲 bin 目录里面的文件考到 Momgodb 文件夹目录）
       `mongod --dbpath D:\MongoDB\data\db` //设置数据存放的路径
    3. 检测
       运行以上命令后
       输出

    ```
    http://localhost:27017/
    You are trying to access MongoDB on the native driver port. For http diagnostic access, add 1000 to the port number
    ```

    如此，MongoDB 数据库服务已经成功启动了。

### 知识点

1.  概念解析 mongo 中的基本概念是文档、集合、数据库

2.  运行命令行

**启动 mongo 后，再在 bin 目录下运行 mongo 即可运用命令行**

```js
show dbs // 查看所有数据库

use DATABASE_NAME // 没有则创建，有则切换到 (需要插入数据才能显示 )

// 插入数据

db.basename.insert({"name":"chenxq"}) // 插入数据

db.dropDatabase() // 删除当前的数据库

show tables  // 显示集合

db.name.drop()	// 删除集合

db.name.insert({title:'sx',age:20,url:'www.baidu.com'}) // 插入文档 没有则创建

db.name.find() // 查看插入的文档

document = ({}) // 将数据定义为一个变量 以后插入

db.name.insert(document)

// 注：插入文档你也可以使用 db.col.save(document) 命令。如果不指定 _id 字段 save() 方法类似于 insert() 方法。如果指定 _id 字段，则会更新该 _id 的数据。

db.collection.insertOne() // 向指定集合中插入一条文档数据

db.collection.insertMany() //向指定集合中插入多条文档数据

```

### 更新文档

```js
db.collection.update(
<query>, // update 的查询条件
<update>, // update 的对象和一些更新的操作符（如$,$inc...）等，也可以理解为 sql update 查询内 set 后面的
{
  upsert: <boolean>, // 可选，这个参数的意思是，如果不存在 update 的记录，是否插入 objNew,true 为插入，默认是 false，不插入
  multi: <boolean>, // 可选，mongodb 默认是 false,只更新找到的第一条记录，如果这个参数为 true,就把按条件查出来多条记录全部更新。
  writeConcern: <document> // 可选，抛出异常的级别。
}
)
```

### 项目与数据库的连接

项目中的代码

- 安装驱动

  `npm install mongodb`

- 安装会话支持

  `npm install express-session`
  `npm isntall connect-mongo`

- 工程根目录创建 settings.js 文件 工程的配置信息 (数据库)

```js
module.exports = {
  cookieSecret: "blog", // cookieSecret 用于 Cookie 加密与数据库无关
  db: "db", // db 是数据库的名称
  host: "localhost",
  port: 27017,
}
```

- 项目根目录新建 models 文件夹，在文件夹下新建 db.js

```js
  var settings = require('../settings'),
  Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

  module.exports = new Db({
    settings.db,
    new Server(settings.host,settings.port), //  设置数据库名、数据库地址和数据库端口创建了一个数据库连接实例
    {safe:true}
  })

  // app.js

  // 在 var routes = require('./routes/index'); 下添加：
    var settings = require('./settings');
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);

  app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},// 30 days
    store: new MongoStore({
      //db: settings.db,
      //host: settings.host,
      //port: settings.port
      url: "mongodb://" + settings.host + "/" + settings.db
    })
  }));
```

- 连接完成，现在启动项目

**报错 ：**

```
express-session deprecated undefined resave option;
express-session deprecated undefined saveUninitialized option;
```

**解决：**

```js
    	app.use(session({
        resave:false,//添加这行
        saveUninitialized: true,//添加这行
    	  ...
      }));
```

### 关于工具

- 工具 Robomongo 和 Mongochef
  Robomongo 是一个基于 Shell 的跨平台开源 MongoDB 可视化管理工具，支持 Windows、Linux 和 Mac，嵌入了 JavaScript 引擎和 MongoDB mongo，只要你会使用 mongo shell，你就会使用 Robomongo，它还提了供语法高亮、自动补全、差别视图等。 轻量级
  [下载](https://robomongo.org/download)

  MongoChef 是另一款强大的 MongoDB 可视化管理工具，支持 Windows、Linux 和 Mac。 强大
  [下载](https://studio3t.com/#mongochef-download-compare)

- Navicat Premium
