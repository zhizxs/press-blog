---

title: webpack 性能调优
date: 2019-06-18
categories:
	- tools
tags:
- tools
- 代码压缩
- webpack优化

isShowComments: true
---

:::tip

webpack 开发过程中自身的优化以及在前端优化过程中能干的事情

0. 构建优化
1. 体积优化
1. 按需加载
1. Gzip
   :::

<!-- more -->

## 怎么优化的？

- 通过合并文件，减少请求次数
- 通过压缩文件，缩小文件大小，节省请求时间

## webpack 工具瓶颈？

- 构建过程太花时间
- 打包的结果体积太大

**_核心：知道从那几个角度优化问题，所有的工具都会迭代，方法不近相同，方向大致一样 _**

## 优化策略

### 构建过程提速策略

1. 不要让 loader 做太多事情——以 babel-loader 为例

- 用 include 或 exclude 来帮我们避免不必要的转译 限定文件范围带来的性能提升是有限的
- 选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升两倍

  > loader: 'babel-loader?cacheDirectory=true'

2. 不要放过第三方库

   **原因：**

   1. 第三方库以 node_modules 为代表，它们庞大得可怕，却又不可或缺。
   2. 处理第三方库的姿势有很多，其中，Externals 不够聪明，一些情况下会引发重复打包的问题；
   3. 而 CommonsChunkPlugin 每次构建时都会重新构建一次 vendor；
   4. 出于对效率的考虑，我们这里为大家推荐 DllPlugin。

   **方法：**

   - DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

   **处理：**

   1. 基于 dll 专属的配置文件，打包 dll 库
   2. 基于 webpack.config.js 文件，打包业务代码

3. Happypack——将 loader 由单进程转为多进程

   - 说明：webpack 是单线程的，就算此刻存在多个任务，你也只能排队一个接一个地等待处理。这是 webpack 的缺点，好在我们的 CPU 是多核的，Happypack 会充分释放 CPU 在多核并发方面的优势，帮我们把任务分解给多个子进程去并发执行，大大提升打包效率。

   - 方法：HappyPack 的使用方法也非常简单，只需要我们把对 loader 的配置转移到 HappyPack 中去就好，我们可以手动告诉 HappyPack 我们需要多少个并发的进程：

   ```js
   const HappyPack = require('happypack')
   // 手动创建进程池
   const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })
   module.exports = {
     module: {
       rules: [
         ...
         {
           test: /\.js$/,
           // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
           loader: 'happypack/loader?id=happyBabel',
           ...
         },
       ],
     },
     plugins: [
       ...
       new HappyPack({
         // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
         id: 'happyBabel',
         // 指定进程池
         threadPool: happyThreadPool,
         loaders: ['babel-loader?cacheDirectory']
       })
     ],
   }
   ```

### 构建结果体积压缩

1.  文件结构可视化，找出导致体积过大的原因

    - 说明：推荐使用 包组成可视化工具——webpack-bundle-analyzer，配置方法和普通的 plugin 无异，它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来

    - 使用：

    ```
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

      module.exports = {
        plugins: [
          new BundleAnalyzerPlugin()
        ]
      }
    ```

2.  删除冗余代码

    - 模块级别

    > 基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正被使用，这些没用的代码，在最后打包的时候会被去除。

    **_webpack2 以上 webpack 原生支持了 ES6 的模块系统 适用 _**

    ````js

      > 说明

        假设我的主干文件（入口文件）是这么写的：

        ```js
        	import { page1, page2 } from './pages'

        		// show是事先定义好的函数，大家理解它的功能是展示页面即可
        		show(page1)
        ```

        pages 文件里，我虽然导出了两个页面：

        ```js
          export const page1 = xxx

          export const page2 = xxx
        ```

        但因为 page2 事实上并没有被用到（这个没有被用到的情况在静态分析的过程中是可以被感知出来的），所以打包的结果里会把这部分：

        ```js
        	export const page2 = xxx;
        ```

        直接删掉，这就是 Tree-Shaking 帮我们做的事情。
    ````

    - 代码级别

      > UglifyJsPlugin 看一下如何在压缩过程中对碎片化的冗余代码（如 console 语句、注释等）进行自动化删除

      ```js
      const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
      module.exports = {
        plugins: [
          new UglifyJsPlugin({
            // 允许并发
            parallel: true,
            // 开启缓存
            cache: true,
            compress: {
              // 删除所有的console语句
              drop_console: true,
              // 把使用多次的静态值自动定义为变量
              reduce_vars: true,
            },
            output: {
              // 不保留注释
              comment: false,
              // 使输出的代码尽可能紧凑
              beautify: false,
            },
          }),
        ],
      }
      ```

      **_注：这段手动引入 UglifyJsPlugin 的代码其实是 webpack3 的用法，webpack4 现在已经默认使用 uglifyjs-webpack-plugin 对代码做压缩了——在 webpack4 中，我们是通过配置 optimization.minimize 与 optimization.minimizer 来自定义压缩相关的操作的。_**

### 按需加载

- 一次不加载完所有的文件内容，只加载此刻需要用到的那部分（会提前做拆分）
- 当需要更多内容时，再对用到的内容进行即时加载

  > 说明：

  - 不需要按需加载

    ```js
    import BugComponent from '../pages/BugComponent'
    ...
    <Route path="/bug" component={BugComponent}>
    ```

  - 开启按需加载 ，首先修改 webpack 配置文件

    ```js
    output: {
        path: path.join(__dirname, '/../dist'),
        filename: 'app.js',
        publicPath: defaultSettings.publicPath,
        // 指定 chunkFilename
        chunkFilename: '[name].[chunkhash:5].chunk.js',
    },
    ```

        路由相应修改

    ```js
    const getComponent => (location, cb) {
      require.ensure([], (require) => {
        cb(null, require('../pages/BugComponent').default)
      }, 'bug')
    },
    ...
    <Route path="/bug" getComponent={getComponent}>
    ```

    **_核心就是这个方法：`require.ensure(dependencies, callback, chunkName)` _**
    **_所谓按需加载，根本上就是在正确的时机去触发相应的回调。_**
    **_工具永远在迭代，唯有掌握核心思想 _**

## Gzip 压缩

    方法：具体的做法非常简单，只需要你在你的 request headers 中加上这么一句：
    `accept-encoding:gzip`

### http 压缩

> 说明：HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

**理解：**

- HTTP 压缩就是以缩小体积为目的，对 HTTP 内容进行重新编码的过程。
- Gzip 的内核就是 Deflate，目前我们压缩文件用得最多的就是 Gzip。

  - 该不该用 Gzip ？

    - 如果你的项目不是极端迷你的超小型文件，我都建议你试试 Gzip。

    - 有的同学或许存在这样的疑问：压缩 Gzip，服务端要花时间；解压 Gzip，浏览器要花时间。中间节省出来的传输时间，真的那么可观吗？

    - 答案是肯定的。如果你手上的项目是 1k、2k 的小文件，那确实有点高射炮打蚊子的意思，不值当。但更多的时候，我们处理的都是具备一定规模的项目文件。实践证明，这种情况下压缩和解压带来的时间开销相对于传输过程中节省下的时间开销来说，可以说是微不足道的。

  - Gzip 万能的吗？

    - 首先要承认 Gzip 是高效的，压缩后通常能帮我们减少响应 70% 左右的大小。

    - 但它并非万能。Gzip 并不保证针对每一个文件的压缩都会使其变小。

    - Gzip 压缩背后的原理，是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率就越高，使用 Gzip 的收益也就越大。反之亦然。

  - webpack 的 Gzip 和服务端的 Gzip

    - 一般来说，Gzip 压缩是服务器的活儿：服务器了解到我们这边有一个 Gzip 压缩的需求，它会启动自己的 CPU 去为我们完成这个任务。而压缩文件这个过程本身是需要耗费时间的，大家可以理解为我们以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，省下了一些传输过程中的时间开销。

    - 既然存在着这样的交换，那么就要求我们学会权衡。服务器的 CPU 性能不是无限的，如果存在大量的压缩需求，服务器也扛不住的。服务器一旦因此慢下来了，用户还是要等。Webpack 中 Gzip 压缩操作的存在，事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。

    - 因此，这两个地方的 Gzip 压缩，谁也不能替代谁。它们必须和平共处，好好合作。作为开发者，我们也应该结合业务压力的实际强度情况，去做好这其中的权衡。

### 问题

1. accept-encoding:gzip 手动添加到 request headers 会被 Chrome 禁止报错 Refused to set unsafe header "accept-encoding"，请问这个问题是如何解决的？

   > 因为 chrome 是按照 w3c 标准来执行的，w3c 禁止了该行为。不过也没关系，服务端确认有 Content-Encoding: gzip 就可以了，你的浏览器识别出 gzip 会去解码它的

2. 缩短单个访问时间是基本原则，除了压缩和合并文件之外还有 HTTP2、浏览器并发下载资源、预加载.

3. require.ensure 和 import() 有什么区别？

   > require.ensure 是 webpack 提出的解决异步依赖的一个方法，属于非标准方法，而 import()是 esm 标准语法。
   > import() 会返回一个 promise，它符合 ECMAScript 提案，目前看来更受推崇。require.ensure 就是传统的回调形式，是 webpack 特定的方法。考虑到 import() 以对 Promise 的支持为前提，一些情况下需要我们补充 polyfill。
   > 直接可用 import.

4. Gzip 对于文本文件（js、css、ttf...）收益会比较大，对于多媒体文件则没有必要采用 Gzip。
