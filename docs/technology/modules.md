---
title: modules
date: 2018-07-18
categories:
  - FrontEnd
tags:
  - modules

isShowComments: true
---

### 关于 require

- 一个加载文件的代码

  - require 可加载 .js、.json 和 .node 后缀的文件
  - require 的过程是同步的，所以这样是错误的:

  ```js
  setTimeout(() => {
    module.exports = { a: "hello" }
  }, 0)
  ```

  - require 这个文件得到的是空对象 {}

- require 目录的机制是:

  - 如果目录下有 package.json 并指定了 main 字段，则用之
  - 如果不存在 package.json，则依次尝试加载目录下的 index.js 和 index.node

  **require 过的文件会加载到缓存，所以多次 require 同一个文件（模块）不会重复加载**

- 判断是否是程序的入口文件有两种方式:

```js
require.main === module（推荐）
module.parent === null

```

**问题：**循环引用

**理解：**
a 文件 require 了 b 文件，然后 b 文件又反过来 require 了 a 文件。
循环引用并不会报错，导致的结果是 require 的结果是空对象 {}

**出现：**
发现一个你明明已经 exports 了的方法报 `undefined is not a function`

**提醒：**
它的存在给我们提了个醒，要时刻注意你项目的依赖关系不要过于复杂

**解决：**

1.  通过分离共用的代码到另一个文件解决，如上面简单的情况，可拆出共用的代码到 c 中
2.  不在最外层 require，在用到的地方 require，通常在函数的内部

### 关于 exports

**exports 和 module.exports 则用来导出代码**

- module.exports 初始值为一个空对象 {}
- exports 是指向的 module.exports 的引用
- require() 返回的是 module.exports 而不是 exports

经常看到 `exports = module.exports = {...}`
等价于
`module.exports = {...}`
`exports = module.exports`

**解析：** `module.exports` 指向新的对象时，`exports` 断开了与 `module.exports`的引用，
那么通过 `exports = module.exports` 让 `exports` 重新指向 `module.exports`。

**注：**ES6 的 import 和 export 不在讲解范围
