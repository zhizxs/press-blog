# 前端性能优化

## 写在前面

> 从输入URL后到网页加载完成后，发生了什么？

1. DNS解析
2. TCP连接
3. http请求抛出
4. 服务器处理请求，http响应返回
5. 浏览器获取资源加载，渲染，展示

**从这个角度去考虑前端的优化工作。**



# webpack 性能调优

## 怎么优化的？

+ 通过合并文件，减少请求次数
+ 通过压缩文件，缩小文件大小，节省请求时间

## webpack 工具瓶颈？
+ 构建过程太花时间
+ 打包的结果体积太大

***核心：知道从那几个角度优化问题，所有的工具都会迭代，方法不近相同，方向大致一样 ***

## 优化策略

### 构建过程提速策略

1. 不要让 loader 做太多事情——以 babel-loader 为例

  * 用 include 或 exclude 来帮我们避免不必要的转译 限定文件范围带来的性能提升是有限的
  * 选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升两倍
  		
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

1. 文件结构可视化，找出导致体积过大的原因

	- 说明：推荐使用 包组成可视化工具——webpack-bundle-analyzer，配置方法和普通的 plugin 无异，它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来

		使用：

		```
			const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

			module.exports = {
			  plugins: [
			    new BundleAnalyzerPlugin()
			  ]
			}
		```

2. 删除冗余代码

	- 模块级别
		
		> 基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正被使用，这些没用的代码，在最后打包的时候会被去除。
		
		***webpack2 以上 webpack 原生支持了 ES6 的模块系统 适用 ***

		~~~js
> 说明
		
	假设我的主干文件（入口文件）是这么写的：
		
			```
    	import { page1, page2 } from './pages'
		
			// show是事先定义好的函数，大家理解它的功能是展示页面即可
			show(page1)
	```
		
			pages 文件里，我虽然导出了两个页面：
			```
	export const page1 = xxx
		
			export const page2 = xxx
	```
		
			但因为 page2 事实上并没有被用到（这个没有被用到的情况在静态分析的过程中是可以被感知出来的），所以打包的结果里会把这部分：
			```
			export const page2 = xxx;
			```
	直接删掉，这就是 Tree-Shaking 帮我们做的事情。
		~~~

		- 代码级别

			> UglifyJsPlugin 看一下如何在压缩过程中对碎片化的冗余代码（如 console 语句、注释等）进行自动化删除
		
			```js
			const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
			       beautify: false
			     }
			   })
			 ]
	}
			```
		
			***注：这段手动引入 UglifyJsPlugin 的代码其实是 webpack3 的用法，webpack4 现在已经默认使用 uglifyjs-webpack-plugin 对代码做压缩了——在 webpack4 中，我们是通过配置 optimization.minimize 与 optimization.minimizer 来自定义压缩相关的操作的。
			
			***

### 按需加载 

+ 一次不加载完所有的文件内容，只加载此刻需要用到的那部分（会提前做拆分）
+ 当需要更多内容时，再对用到的内容进行即时加载

	> 说明：

		- 不需要按需加载
			```
			import BugComponent from '../pages/BugComponent'
			...
			<Route path="/bug" component={BugComponent}>
			```
	
		- 开启按需加载 ，首先修改webpack 配置文件
			```
			output: {
			    path: path.join(__dirname, '/../dist'),
			    filename: 'app.js',
			    publicPath: defaultSettings.publicPath,
			    // 指定 chunkFilename
			    chunkFilename: '[name].[chunkhash:5].chunk.js',
			},
			```
	
			路由相应修改
			```
			const getComponent => (location, cb) {
			  require.ensure([], (require) => {
			    cb(null, require('../pages/BugComponent').default)
			  }, 'bug')
			},
			...
			<Route path="/bug" getComponent={getComponent}>
			```
	
			***核心就是这个方法：`require.ensure(dependencies, callback, chunkName)` ***
	
			***所谓按需加载，根本上就是在正确的时机去触发相应的回调。***
			***工具永远在迭代，唯有掌握核心思想 ***


##	Gzip 压缩

	方法：具体的做法非常简单，只需要你在你的 request headers 中加上这么一句：
	`accept-encoding:gzip`

### http压缩

>说明：HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

**理解：**
- HTTP 压缩就是以缩小体积为目的，对 HTTP 内容进行重新编码的过程。
- Gzip 的内核就是 Deflate，目前我们压缩文件用得最多的就是 Gzip。

	* 该不该用 Gzip ？

		- 如果你的项目不是极端迷你的超小型文件，我都建议你试试 Gzip。

		- 有的同学或许存在这样的疑问：压缩 Gzip，服务端要花时间；解压 Gzip，浏览器要花时间。中间节省出来的传输时间，真的那么可观吗？

		- 答案是肯定的。如果你手上的项目是 1k、2k 的小文件，那确实有点高射炮打蚊子的意思，不值当。但更多的时候，我们处理的都是具备一定规模的项目文件。实践证明，这种情况下压缩和解压带来的时间开销相对于传输过程中节省下的时间开销来说，可以说是微不足道的。

	* Gzip 万能的吗？
		- 首先要承认 Gzip 是高效的，压缩后通常能帮我们减少响应 70% 左右的大小。

		- 但它并非万能。Gzip 并不保证针对每一个文件的压缩都会使其变小。

		- Gzip 压缩背后的原理，是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率就越高，使用 Gzip 的收益也就越大。反之亦然。

	* webpack 的 Gzip 和服务端的 Gzip
		- 一般来说，Gzip 压缩是服务器的活儿：服务器了解到我们这边有一个 Gzip 压缩的需求，它会启动自己的 CPU 去为我们完成这个任务。而压缩文件这个过程本身是需要耗费时间的，大家可以理解为我们以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，省下了一些传输过程中的时间开销。

		- 既然存在着这样的交换，那么就要求我们学会权衡。服务器的 CPU 性能不是无限的，如果存在大量的压缩需求，服务器也扛不住的。服务器一旦因此慢下来了，用户还是要等。Webpack 中 Gzip 压缩操作的存在，事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。

		- 因此，这两个地方的 Gzip 压缩，谁也不能替代谁。它们必须和平共处，好好合作。作为开发者，我们也应该结合业务压力的实际强度情况，去做好这其中的权衡。


### 问题
1. accept-encoding:gzip手动添加到request headers会被Chrome禁止报错 Refused to set unsafe header "accept-encoding"，请问这个问题是如何解决的？

	> 因为chrome是按照w3c标准来执行的，w3c禁止了该行为。不过也没关系，服务端确认有Content-Encoding: gzip就可以了，你的浏览器识别出gzip会去解码它的

2. 缩短单个访问时间是基本原则，除了压缩和合并文件之外还有HTTP2、浏览器并发下载资源、预加载.

3. require.ensure 和 import() 有什么区别？

	> require.ensure是webpack提出的解决异步依赖的一个方法，属于非标准方法，而import()是esm标准语法。
	import() 会返回一个promise，它符合ECMAScript 提案，目前看来更受推崇。require.ensure就是传统的回调形式，是 webpack 特定的方法。考虑到import() 以对Promise的支持为前提，一些情况下需要我们补充polyfill。
	直接可用 import.

4. Gzip 对于文本文件（js、css、ttf...）收益会比较大，对于多媒体文件则没有必要采用Gzip。







## 图片的优化 - 质量和性能的博弈

一个网页，图片给用户的还是第一视觉的冲击。用户不在乎你后面的css/js 的加载情况，图片和文字是第一位的。所以，前端优化中图片的优先级可见一斑。

## 不同业务场景下的图片的要求

时下应用较为广泛的 Web 图片格式有 JPEG/JPG、PNG、WebP、Base64、SVG 等。但是需要结合业务场景进行取舍。

## 二进制与色彩的关系

- 在计算机中，像素用二进制数来表示。不同的图片格式中像素与二进制位数之间的对应关系是不同的。一个像素对应的二进制位数越多，它可以表示的颜色种类就越多，成像效果也就越细腻，文件体积相应也会越大。
- 一个二进制位表示两种颜色（0|1 对应黑|白），如果一种图片格式对应的二进制位数有 n 个，那么它就可以呈现 2^n 种颜色。

## JPEG/JPG
+ 关键字：有损压缩、体积小、加载快、不支持透明
+ 优点：高质量的有损压缩。压缩比在50%，但是图片质量能保持在60%，质量损耗不易被肉眼察觉。JPG 格式以 24 位存储单个图，可以呈现多达 1600 万种颜色
+ 场景：呈现大图,banner,电商轮播,背景图
+ 缺点：处理矢量图形和 Logo 等线条感较强、颜色对比强烈的图像时，人为压缩导致的图片模糊会相当明显。不支持透明度处理。

## PNG-8 与 PNG-24
+ 关键字：无损压缩、质量高、体积大、支持透明
+ 优点：一种无损压缩的高保真的图片格式。8和24位两种。更强的色彩表现力，对线条的处理更加细腻，对透明度有良好的支持。
+ 场景：呈现小的 Logo、颜色简单且对比强烈的图片或背景等。
+ 缺点：体积大。

>？PNG-8 与 PNG-24 的选择题
- 什么时候用 PNG-8，什么时候用 PNG-24，这是一个问题。
- 理论上来说，当你追求最佳的显示效果、并且不在意文件体积大小时，是推荐使用 PNG-24 的。
- 但实践当中，为了规避体积的问题，我们一般不用PNG去处理较复杂的图像。当我们遇到适合 PNG 的场景时，也会优先选择更为小巧的 PNG-8。
- 如何确定一张图片是该用 PNG-8 还是 PNG-24 去呈现呢？好的做法是把图片先按照这两种格式分别输出，看 PNG-8 输出的结果是否会带来肉眼可见的质量损耗，并且确认这种损耗是否在我们（尤其是你的 UI 设计师）可接受的范围内，基于对比的结果去做判断。

## SVG

SVG（可缩放矢量图形）是一种基于 XML 语法的图像格式。它和本文提及的其它图片种类有着本质的不同：SVG 对图像的处理不是基于像素点，而是是基于对图像的形状描述。

+ 关键词：文本文件、体积小、不失真、兼容性好
+ 优点：文件体积更小，可压缩性更强、无限放大不失真。
+ 场景：代码直接引入，类似矢量图标。
+ 缺点：仅形状描述，无多余色彩。


## Base64
> 关键字：文本文件、依赖编码、小图标解决方案

- Base64 并非一种图片格式，而是一种编码方式。Base64和雪碧图一样，是作为小图标解决方案而存在的。

- Base64 是一种用于传输 8Bit 字节码的编码方式，通过对图片进行 Base64 编码，我们可以直接将编码结果写入 HTML 或者写入 CSS，从而减少 HTTP 请求的次数。

- Base64 编码后，图片大小会膨胀为原文件的 4/3（这是由 Base64 的编码原理决定的）。大图带来消耗较大，慎重考虑。

- 在传输非常小的图片的时候，Base64 带来的文件体积膨胀、以及浏览器解析 Base64 的时间开销，与它节省掉的 HTTP 请求开销相比，可以忽略不计，这时候才能真正体现出它在性能方面的优势。

- 使用场景考虑：
	* 图片的实际尺寸很小（没有超过 2kb 的）
	* 图片无法以雪碧图的形式与其它小图结合（合成雪碧图仍是主要的减少 HTTP 请求的途径，Base64 是雪碧图的补充）
	* 图片的更新频率非常低（不需我们重复编码和修改文件内容，维护成本较低）

- 推荐工具：
	- webpack url-loader


## WebP

- 关键词：年轻的全能型选手。
	
	Google 专为 Web 开发的一种旨在加快图片加载速度的图片格式，它支持有损压缩和无损压缩。

- 优点：色彩丰富，支持透明，支持动图。
	
	与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。 无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

- 局限性：
		- 兼容性。
		- WebP 还会增加服务器的负担——和编码 JPG 文件相比，编码同样质量的 WebP 文件会占用更多的计算资源。

- 应用场景：
		- 前端做兼容性判断，对url地址进行处理 如返回 ：a.jpg_.webp，前端切割。
		- 前端怎么判断？加载一张看一下行不行。
		- 服务器根据请求头进行预判，返回不同类型的图片。(维护性强)当 Accept 字段包含 image/webp 时，就返回 WebP 格式的图片，否则返回原图。


图片处理工具：https://tinypng.com/



# 浏览器缓存机制

- 缓存可以减少网络 IO 消耗，提高访问速度。浏览器缓存是一种操作简单、效果显著的前端性能优化手段。

- 为什么需要？
	
	谷歌官方：通过网络获取内容既速度缓慢又开销巨大。较大的响应需要在客户端与服务器之间进行多次往返通信，这会延迟浏览器获得和处理内容的时间，还会增加访问者的流量费用。因此，缓存并重复利用之前获取的资源的能力成为性能优化的一个关键方面

- 浏览器缓存机制优先级排序：
	+ Memory Cache
	+ Service Worker Cache
	+ HTTP Cache
	+ Push Cache

# HTTP 缓存机制

HTTP 缓存是我们日常开发中最为熟悉的一种缓存机制。它又分为强缓存和协商缓存。优先级较高的是强缓存，在命中强缓存失败的情况下，才会走协商缓存。

## 强缓存

+ 特征
	- 利用 Expires 和 Cache-Control 两个字段控制。(发出请求时，浏览器通过该字段判断，是否命中强缓存，若命中，则直接从缓存中获取资源，不会与服务器发生通信。)
	-  返回状态码是 200.

+ 实现
	- expires ：出现在请求头部，为时间戳（到期时间）。请求服务器资源时，会比较浏览器时间和expires。小于expires，则从本地读取。
		
		**局限性：依赖本地时间，修改本地时间将影响缓存。**

	- cache-control ：http1.1提出。

		- cache-control: max-age=3600, s-maxage=31536000
		通过 max-age 来控制资源的有效期。max-age 不是一个时间戳，而是一个时间长度。单位s
			
		- s-maxage 优先级高于 max-age，两者同时出现时，优先考虑 s-maxage。如果 s-maxage 未过期，则向代理服务器请求其缓存内容。仅在代理服务器中生效，客户端中我们只考虑max-age。
			
		- 在依赖各种代理的大型架构中，我们不得不考虑代理服务器的缓存问题。s-maxage 就是用于表示 cache 服务器上（比如 cache CDN）的缓存的有效时间的，并只对 public 缓存有效。

		- public private
		
			- 如果我们为资源设置了 public，那么它既可以被浏览器缓存，也可以被代理服务器缓存；
			- 如果我们设置了 private，则该资源只能被浏览器缓存。
			- private 为默认值。

		- no-store与no-cache
			- no-cache:绕开浏览器，直接去服务器确认资源是否过期。（会协商缓存）
			- no-store:不使用任何缓存策略，直接从服务器端下载资源。


## 协商缓存

- 浏览器和服务器合作的缓存策略。需要浏览器端和服务端通信。

- 工作方式：浏览器和服务器之间通信，判断是需要重新下载资源还是直接在本地缓存中读取。
	
	如果服务端提示缓存资源未改动（Not Modified），资源会被重定向到浏览器缓存，这种情况下网络请求对应的状态码是 304。

- 协商缓存的实现：从 Last-Modified 到 Etag
	- Last-Modified 是一个时间戳，如果我们启用了协商缓存，它会在首次请求时随着 Response Headers 返回。
	- 随后我们每次请求时，会带上一个叫 If-Modified-Since 的时间戳字段，它的值正是上一次 response 返回给它的 last-modified 值
	- 服务器端对比时间戳和资源在服务器上的修改时间，时间一致返回304，无Last-Modified字段。
	- 不一致，返回完整响应内容，更新 Last-Modified 字段。

	- 问题：服务器端并不能感知到文件的变化？
		- 出现 Etag 资源唯一标识符。基于文件内容编码。
		- Etag 的生成过程需要服务器额外付出开销，会影响服务端的性能，这是它的弊端。

		Etag 并不能替代 Last-Modified，它只能作为 Last-Modified 的补充和强化存在。 Etag 在感知文件变化上比 Last-Modified 更加准确，优先级也更高。当 Etag 和 Last-Modified 同时存在时，以 Etag 为准。


## MemoryCache

	浏览器最先尝试去命中的，响应速度最快的，也是最短命的，和tab生命一样，关闭则消失。

>什么资源放在内存？
- 节约原则。
- base64.体积不大的js,css文件有一定概率存放。


## Service Worker Cache

***协议要求Lhttps***
	
使用 Service Worker 进行离线缓存。

- 入口文件 

	```js
	window.navigator.serviceWorker.register('/test.js').then(
	   function () {
	      console.log('注册成功')
	    }).catch(err => {
	      console.error("注册失败")
	    })
	```

	在 test.js 中，我们进行缓存的处理。假设我们需要缓存的文件分别是 test.html,test.css 和 test.js：

	```js
		// Service Worker会监听 install事件，我们在其对应的回调里可以实现初始化的逻辑  
		self.addEventListener('install', event => {
		  event.waitUntil(
		    // 考虑到缓存也需要更新，open内传入的参数为缓存的版本号
		    caches.open('test-v1').then(cache => {
		      return cache.addAll([
		        // 此处传入指定的需缓存的文件名
		        '/test.html',
		        '/test.css',
		        '/test.js'
		      ])
		    })
		  )
		})
		// Service Worker会监听所有的网络请求，网络请求的产生触发的是fetch事件，我们可以在其对应的监听函数中实现对请求的拦截，进而判断是否有对应到该请求的缓存，实现从Service Worker中取到缓存的目的
		self.addEventListener('fetch', event => {
		  event.respondWith(
		    // 尝试匹配该请求对应的缓存值
		    caches.match(event.request).then(res => {
		      // 如果匹配到了，调用Server Worker缓存
		      if (res) {
		        return res;
		      }
		      // 如果没匹配到，向服务端发起这个资源请求
		      return fetch(event.request).then(response => {
		        if (!response || response.status !== 200) {
		          return response;
		        }
		        // 请求成功的话，将请求缓存起来。
		        caches.open('test-v1').then(function(cache) {
		          cache.put(event.request, response);
		        });
		        return response.clone();
		      });
		    })
		  );
		});
	```

## Cookie,web storage,IndexedDb

- cookie说起：
	- http是无状态请求，但是服务端没有记录客户端的任何信息，cookie是为了告诉服务端，我是我。
	- 键值对形式存在，cookie紧跟域名，同一域名下的所有请求都会携带cookie。
		思考：如静态资源时不需要的？
		
		有大小限制4k,超过被裁剪。

- LocalStorage 与 SessionStorage 的区别 
	* 生命周期：LocalStorage 是持久化的本地存储，只能手动或者调用API删除
				SessionStorage 是会话级，标签关闭，内容释放。
	* 作用域：Local Storage、Session Storage 和 Cookie 都遵循同源策略。但 Session Storage 特别的一点在于，即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 Session Storage 内容便无法共享
	
	特点：存储容量大，在 5-10M （因浏览器不同）

- IndexedDB 
	
	- IndexedDB 是一个运行在浏览器上的非关系型数据库。
	- 数据大小在250M以下。


## CDN 缓存和回源
> 什么是cdn?

CDN （Content Delivery Network，即内容分发网络）指的是一组分布在各个地区的服务器。这些服务器存储着数据的副本，因此服务器可以根据哪些服务器与用户距离最近，来满足数据的请求。 CDN 提供快速服务，较少受高流量影响。

> 核心：
- 缓存：把资源 copy 一份到 CDN 服务器上这个过程
- 回源： CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

### CDN与前端优化
**存放静态资源。**
- 所谓“静态资源”，就是像 JS、CSS、图片等不需要业务服务器进行计算即得的资源。
- “动态资源”，顾名思义是需要后端实时动态生成的资源，较为常见的就是 JSP、ASP 或者依赖服务端渲染得到的 HTML 页面。
- “非纯静态资源”,是指需要服务器在页面之外作额外计算的 HTML 页面。(与业务服务器耦合)

- 静态资源本身具有访问频率高、承接流量大的特点，因此静态资源加载速度始终是前端性能的一个非常关键的指标。

> CDN效用最大化？它涉及到 CDN 服务器本身的性能优化、CDN 节点的地址选取等。

> 注：把静态资源和主页面置于不同的域名下，则静态资源就不会携带cookie。
>	多CDN域名，增加浏览器下载文件并发。



## 服务器端渲染（SSR）
- 是什么？
	- 客户端渲染：服务端发来资源，客户端自己解析渲染。页面上呈现的内容，你在 html 源文件里里找不到。
	- 服务端渲染：用户第一次页面时，服务器端把需要的组件或页面渲染成html字符串，返回给客户端。页面上呈现的内容，我们在 html 源文件里也能找到。

- 为什么？
	- 搜索引擎友好，能找到内容。
	- 首屏。

- 怎么做？
	- 官方

	有的开发者方案：我在处理服务器端渲染的方式并没有使用react或vue官方提供的方式，而是在服务器端也添加和客户端自身路由相同的路由，一方面是为了用户直接地址栏输入返回index，同时根据url参数获取即将展现的内容拼接成字符串，通过ejs模板引擎渲染进去，当然渲染的这部分是隐藏的，对于客户来说是看不到的，但是爬虫过来的时候是可以看到的，用户在当前页面点击不会产生服务器渲染，只有回车进入的时候才会触发，这样做的好处是不改变当前项目框架结构，只是在打包后的html中添加一段ejs模板即可


## 浏览器运行机制
- 浏览器内核：分为渲染引擎（html/css解释器,图层，视图）和js引擎。
- 几棵树：
	* DOM 树：解析 HTML 以创建的是 DOM 树（DOM tree ）：渲染引擎开始解析 HTML 文档，转换树中的标签到 DOM 节点，它被称为“内容树”。

	* CSSOM 树：解析 CSS（包括外部 CSS 文件和样式元素）创建的是 CSSOM 树。CSSOM 的解析过程与 DOM 的解析过程是并行的。

	* 渲染树：CSSOM 与 DOM 结合，之后我们得到的就是渲染树（Render tree ）。

	* 布局渲染树：从根节点递归调用，计算每一个元素的大小、位置等，给每个节点所应该出现在屏幕上的精确坐标，我们便得到了基于渲染树的布局渲染树（Layout of the render tree）。

	* 绘制渲染树: 遍历渲染树，每个节点将使用 UI 后端层来绘制。整个过程叫做绘制渲染树（Painting the render tree）。

	> 总结：首先是基于 HTML 构建一个 DOM 树，这棵 DOM 树与 CSS 解释器解析出的 CSSOM 相结合，就有了布局渲染树。最后浏览器以布局渲染树为蓝本，去计算布局并绘制图像，我们页面的初次渲染就大功告成了。之后每当一个新元素加入到这个 DOM 树当中，浏览器便会通过 CSS 引擎查遍 CSS 样式表，找到符合该元素的样式规则应用到这个元素上，然后再重新去绘制它。


- css 优化建议？
	**渲染时，CSS 选择符是从右到左进行匹配的。**
	
	+ 避免使用通配符，只对需要用到的元素进行选择。—— 浏览器必须遍历所有的元素。

	+ 关注可以通过继承实现的属性，避免重复匹配重复定义。

	+ 少用签选择器。如果可以，用类选择器替代。—— 查找会遍历所有标签。

	+ 不要画蛇添足，id 和 class 选择器不应该被多余的标签选择器拖后腿。 .myList#title 垃圾

	+ 减少嵌套。后代选择器的开销是最高的，因此我们应该尽量将选择器的深度降到最低（最高不要超过三层），尽可能使用类来关联每一个标签元素。

- 告别阻塞：CSS 与 JS 的加载顺序优化
	**HTML、CSS 和 JS，都具有阻塞渲染的特性。**

	CSS 是阻塞渲染的资源。需要将它尽早、尽快地下载到客户端，以便缩短首次渲染的时间。

	JS 会阻塞 cssDom 渲染。JS操作页面，本质上都是对 DOM 和 CSSDOM 进行修改。

	> JS 的三种加载方式?

	- 正常模式 阻塞
	- async 模式 JS 的加载是异步，立即执行。当我们的脚本与 DOM 元素和其它脚本之间的依赖关系不强时选。
	- defer 模式 JS 的加载是异步，等到DOM渲染完成执行 。当脚本依赖于 DOM 元素和其它脚本的执行结果时选。


## 代码角度 DOM
> 为什么dom很慢？
js引擎修改 然后需要桥接接口 通知渲染引擎进行渲染。

- 回流

DOM 的修改引发了 DOM 几何尺寸的变化,浏览器需要重新计算几何属性，然后再绘制。

- 重绘

样式变化，几何属性未变，只需重新绘制。

***重绘不一定导致回流，回流一定会导致重绘。 ***

- 优化：减少DOM操作，js给DOM分压。

	* 多次修改，一次提交。
	* DocumentFragment。
	* 避免逐条改变样式，使用类名去合并样式
	* DOM离线：先 display:none,修改属性后再display:block;
	* chrome Flush 队列 延迟提交修改

- Event Loop 与异步更新策略

	- 事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。

	- 常见的 macro-task 比如： setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。

	- 常见的 micro-task 比如: process.nextTick、Promise、MutationObserver 等。

	- 执行顺序：
		1. 将 一个 macro-task（第一次是script）执行并出队
		2. 将 一队 micro-task 执行并出队
		3. 执行渲染操作更新界面
		4. 处理worker相关的任务

		> 使用 Promise.resolve().then(task) 可以包装微任务

		> 使用setTime(fn,0) 可以包装宏任务

		> 优化DOM：当我们需要在异步任务中实现 DOM 修改时，把它包装成 micro 任务是相对明智的选择。


		**实践：vue的异步更新队列。**
		
		nextTick (Vue 每次想要更新一个状态的时候，会先把它这个更新操作给包装成一个异步操作派发出去。)


## 首屏优化
- 懒加载 lazy-load

	**两个关键点：**	
		* 当前可视区域的高度 window.innerHeight || document.documentElement.clientHeight
		* 元素距离可视区域顶部的高度  getBoundingClientRect() 返回 DOMRect
			DOMRect 对象包含了一组用于描述边框的只读属性——left、top、right 和 bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。

	+ 实现
		```
		/*css*/
		.img {
	      width: 200px;
	      height:200px;
	      background-color: gray;
	    }

		/*html*/
		<div class="img">
	      	<img class="pic" alt="加载中" data-src="./images/9.png">
	    </div>

		/*js*/
		// 获取所有的图片标签
	    const imgs = document.getElementsByTagName('img')
	    let len  = imgs.length
	    // 获取可视区域的高度
	    const viewHeight = window.innerHeight || document.documentElement.clientHeight
	    // num用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
	    let num = 0
	    function lazyload(){
	        for(let i=num; i<len; i++) {
	            // 用可视区域高度减去元素顶部距离可视区域顶部的高度
	            let distance = viewHeight - imgs[i].getBoundingClientRect().top
	            // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
	            if(distance >= 0 ){
	                // 给元素写入真实的src，展示图片
	                imgs[i].src = imgs[i].getAttribute('data-src')
	                // 前i张图片已经加载完毕，下次从第i+1张开始检查是否露出
	                num = i + 1
	            }
	        }
	    }
	    // 监听Scroll事件
	    window.addEventListener('scroll', lazyload, false);
		```

- ntersection-Observer 插件实现懒加载

## 防抖和节流

参考源码实现

​	










