# vue 基础知识点

### 组件间传值

- props/\$emit

- \$children/\$parent

  注意两个返回值的类型和边界。实例方法。

- provide/inject

  不限父子.

  ```js
   // 与data同级
   provide: {
   	for: "demo"
   }

   // 类似props取值
   inject: ['for']

  ```

- ref/refs

  ```JS
  <component-a ref="comA"></component-a>

  const comA = this.$refs.comA;

  ```

- eventBus

  > `eventBus` 又称为事件总线，在 vue 中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。
  >
  > eventBus 也有不方便之处, 当项目较大,就容易造成难以维护的灾难

  ```js
  // event-bus.js

  import Vue from "vue"
  export const EventBus = new Vue()

  // 使用
  import { EventBus } from "./event-bus.js"

  // 触发
  EventBus.$emit("addition", {
    num: this.num++
  })

  // 接收
  EventBus.$on("addition", param => {
    this.count = this.count + param.num
  })

  // 移除
  EventBus.$off("addition", {})
  ```

- Vuex

- localStorage,sessionStorage

  > 注意用`JSON.parse()` / `JSON.stringify()` 做数据格式转换 `localStorage` / `sessionStorage`可以结合`vuex`, 实现数据的持久保存,同时使用 vuex 解决数据和状态混乱问题.

- \$attrs/\$listeners

  结合 inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在 props 声明的属性

  ```js
  // 父级
  <child-com1
        :name="name"
        :age="age"
        :gender="gender"
        :height="height"
        title="程序员成长指北"
      ></child-com1>

  // 一级子
  <child-com2 v-bind="$attrs"></child-com2>
  console.log(this.$attrs);

  // 二级子
  console.log(this.$attrs);

  ```

> 父子组件通信: `props`; `$parent` / `$children`; `provide` / `inject` ; `ref` ; `$attrs` / `$listeners`
>
> 兄弟组件通信: `eventBus` ; vuex
>
> 跨级通信: `eventBus`；Vuex；`provide` / `inject` 、`$attrs` / `$listeners`

### 生命周期

| 生命周期      | 描述                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                                 |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，`$el`还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用                     |
| mounted       | el 被新创建的 vm.\$el 替换，并挂载到实例上去之后调用该钩子             |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前                        |
| update        | 组件数据更新之后                                                       |
| activited     | keep-alive 专属，组件被激活时调用                                      |
| deadctivated  | keep-alive 专属，组件被销毁时调用                                      |
| beforeDestory | 组件销毁前调用                                                         |
| destoryed     | 组件销毁后调用                                                         |

## computed 和 methods 有什么区别？watch?

- computed 计算属性 你需要用到数值变化后的计算结果时候使用。会缓存，当结果不变不触发
- methods 方法，需要外部事件来主动触发，不会缓存。
- watch 为监听变化，可以执行相关的回调函数。区别 computed，无缓存性，页面重新渲染时值不变化也执行

## 事件修饰符

- .stop：等同于 JavaScript 中的 event.stopPropagation()，防止事件冒泡
- .prevent：等同于 JavaScript 中的 event.preventDefault()，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）
- .capture：与事件冒泡的方向相反，事件捕获由外到内
- .self：只会触发自己范围内的事件，不包含子元素
- .once：只会触发一次

## 组件中 data 为什么是函数？

- 为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

- 因为组件是用来复用的，JS 里对象是引用关系，这样作用域没有隔离，而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

## keep-alive

注意这个 `<keep-alive>` 要求被切换到的组件都有自己的名字，不论是通过组件的 name 选项还是局部/全局注册。

动态组件上面使用，用于缓存组件内容，避免重复渲染。

## mvvm 框架的好处？

- 什么是 mvvm：模型-视图-视图模型。模型指的就是数据，视图指的就是页面，视图模型是它们之间的桥梁。在 MVVM 的框架下视图和模型是不能直接通信的。它们通过 ViewModel 来通信，ViewModel 通常要实现一个 observer 观察者，当数据发生变化，ViewModel 能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel 也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且 MVVM 中的 View 和 ViewModel 可以互相通信。vue 官方给的就是 DOM listeners + data bindings
- 为什么会是 mvvm:原来的项目更多的是 mvc 的模式来开发的，mvc 模式下，我们很多的业务代码都会写在控制器中，随着业务的复杂，c 中的代码的可维护性和可扩展性就会很差，同时，直接操作 dom 会使页面重绘消耗性能。浏览器的兼容性已经不是前端的阻碍了。
- 为什么是 vue：1.vue 是基于 mvvm 的框架；2.渐进式的，可大可小，小到你可以适用 vue 嵌入到已有应用中，大到你可以适用 vue 的整个技术栈，模块化组件化来开发项目。3.响应式系统：通过改变数据来实现操作或者视图的更新，不需要直接操作 dom。4.开发效率高，学习成本低。

## vue/react/angular？

- vue: - api,语法简单，项目搭建简单，学习成本低； - 基于依赖追踪观察系统，并异步队列更新； - 更快的渲染速度，更小的体积。min+gzip 20k; - 开发效率高； - 支持双向，默认单向数据流

- react: - 视图渲染：jsx 创建虚拟 dom，在内存中描述 dom 树状态的数据结构 ，状态变化重新渲染，给真实 DOM 打补丁。每次更新都会渲染整个应用。可以优化，手动添加 shouldComponentUpdate 避免 re-render - 单向数据流 模板语法 函数式编程 通过初始状态推导状态更新数据 - react 只是一个 V，需要和其他框架组合适用
- angular: - 完整的框架，自带数据绑定，http 等 但 学习成本高 - 双向数据绑定 组件多，逻辑复杂会带来性能问题：脏检查跟踪数据的改动来改变 UI - 视图渲染：将模板解析到 DOM，angularjs 将遍历生成的模板，生成指令，绑定数据，即 dom 加载完成- 后框架才起作用

## 优化 vue 项目？

- gzip 压缩，静态资源基本都放在 cdn 上；
- 服务器缓存；
- 浏览器缓存：
  浏览器缓存是通过 html 的头文件中的 meta 来控制。http-equiv 是一个专门针对 http 的头文件，可以向浏览器传回一些有用的信息。与之对应的 content，是各个参数的变量值。

      	`<meta http-equiv="Pragma" content="no-cache">`

      	- http1.0:可以设置为Pragma = no-cache + Expires = 0
      	- http1.1 ：Cache-Control  可以设置为no-cache、private、no-store、max-age或must-revalidate等，默认为private。
      	- public 浏览器和缓存服务器都可以缓存页面信息
      	- private 对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效
      	- no-cache 浏览器和缓存服务器都不应该缓存页面信息
      	- no-store 请求和响应的信息都不应该被存储在对方的磁盘系统中，不使用缓存
      	- must-revalidate 对于客户机的每次请求，代理服务器必须想服务器验证缓存是否过时
      	- max-age 客户机可以接收生存期不大于指定时间（以秒为单位）的响应
      	- min-fresh 客户机可以接收响应时间小于当前时间加上指定时间的响应
      	- Last-Modified服务器端文件响应头，描述最后修改时间。200/304
      	- Etags不同的是，ETag是根据实体内容生成一段hash字符串，是标识资源的状态。它由服务端产生来判断文件是否有更新。

- js 分包：（以下两种方法）
- external 把包排除，使用 cdn 资源
- dll 打包

- vue，vuex 和 vue-router

      	在webpack配置文件中external设置，把这三个场用包排除这个操作，主要是把这三个包从vendor.js分开。

      	最后当然需要在html标签上添加上额外cdn的link或者script。

      	这种打包方式专门引用webpack官方的DllPlugin和DllReferencePlugin。DllPlugin会生成一个dll包的代码指纹manifest，管理额外的打包。而在项目生成的过程中，DllReferencePlugin会参考manifest的内容去打包。额外生成的js文件应该被放置在vue项目的文件当中的static文件夹底下，以便于代码部署。

- 预加载技术 - DNS prefetch 分析这个页面需要的资源所在的域名，浏览器空闲时提前将这些域名转化为 IP 地址，真正请求资源时就避免了上述这个过程的时间。 Chrome 支持
  `<meta http-equiv='x-dns-prefetch-control' content='on'> <link rel='dns-prefetch' href='http://g-ecx.images-amazon.com'>`

      	- 预加载也可以对某个静态资源起到专门的作用。
      	`<link rel='subresource' href='libs.js'>`

- 预渲染（pre-rendering）是这个页面会提前加载好用户即将访问的下一个页面。
  `<link rel='prerender' href='http://www.pagetoprerender.com'>`

- 代码包优化

      	- keep-alive:组件保存在浏览器内存当中，方便你快速切换
      		vue-router当中使用keep-alive的组件，用它包裹着router-view。使用了keep-alive的组件内的数据将会保留，“是否需要重新同步数据”可以在vue-router的钩子中路由所带的参数执行判断。

      	- 屏蔽sourceMap
      	- 对项目代码中的JS/CSS/SVG(*.ico)文件进行gzip压缩 +浏览器支持 + 后端支持
      	- productionGzip设置为true，但是首先需要对compress-webpack-plugin支持，install 安装
      		`devTools: ResponseHeader- content-encoding:"gzip"`

      	- 对路由组件进行懒加载:加快首屏时间，响应时间<=>会出现多个js文件，增加请求的资源数量 -->注意文件资源的懒加载
      		 		`component: resolve=>require(["@/views/home"],resolve)`

- 代码优化 - v-if 和 v-show 选择调用 - 为 item 设置唯一 key 值
  在列表数据进行遍历渲染时，需要为每一项 item 设置唯一 key 值，方便 vuejs 内部机制精准找到该条列表数据。当 state 更新时，新的状态值和旧的状态值对比，较快地定位到 diff。 - 细分 vuejs 组件：组件过大，视图更新缓慢，渲染慢，体验差。 - 减少 watch 的数据：监控变化以及处理需要占用资源，数据过大会卡顿。 - 内容类系统的图片资源按需加载 - 对于内容类系统的图片按需加载
  如果出现图片加载比较多，可以先使用 v-lazy 之类的懒加载库或者绑定鼠标的 scroll 事件，滚动到可视区域先再对数据进行加载显示，减少系统加载的数据。
- 用户体验： - loading - 骨架屏

## vue 的双向绑定的原理是什么(常考)

> vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

具体步骤：

- 第一步：需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化
- 第二步：compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
- 第三步：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是:
  在自身实例化时往属性订阅器(dep)里面添加自己自身必须有一个 update()方法待属性变动 dep.notice()通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。
- 第四步：MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

**proxy 和 defineProperty 比较**：

- proxy 优势：监听对象而非属性；监听数组；多种拦截方法，如 has,ownKeys 等；直接返回可操作对象（de...只能遍历对象，直接修改）；
- defineProperty:兼容性好

**响应式系统简述：**

- 任何一个 Vue Component 都有一个与之对应的 Watcher 实例。

- Vue 的 data 上的属性会被添加 getter 和 setter 属性。

- 当 Vue Component render 函数被执行的时候, data 上会被 触碰(touch), 即被读, getter 方法会被调用, 此时 Vue 会去记录此 Vue component 所依赖的所有 data。(这一过程被称为依赖收集)

- data 被改动时（主要是用户操作）, 即被写, setter 方法会被调用, 此时 Vue 会去通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新。

## vuex?

获取状态：getters + computed

修改状态：提交 mutation 修改状态 - 必须
actions 中提交 mutation 再去修改状态值 - 官方建议
使用 dispatch 来提交 actions
![vuex](../imgs/vuex.png)

学习地址：https://baijiahao.baidu.com/s?id=1618794879569468435&wfr=spider&for=pc

### 虚拟 DOM 的优劣？

优点:

- 保证性能下限: 虚拟 DOM 可以经过 diff 找出最小差异,然后批量进行 patch,这种操作虽然比不上手动优化,但是比起粗暴的 DOM 操作性能要好很多,因此虚拟 DOM 可以保证性能下限
- 无需手动操作 DOM: 虚拟 DOM 的 diff 和 patch 都是在一次更新中自动进行的,我们无需手动操作 DOM,极大提高开发效率
- 跨平台: 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关,相比之下虚拟 DOM 可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等

缺点:

- 无法进行极致优化: 在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化,比如 VScode 采用直接手动操作 DOM 的方式进行极端的性能优化

### 虚拟 DOM 实现原理？

- 虚拟 DOM 本质上是 JavaScript 对象,是对真实 DOM 的抽象
- 状态变更时，记录新树和旧树的差异
- 最后把差异更新到真正的 dom 中

### 既然 Vue 通过数据劫持可以精准探测数据变化,为什么还需要虚拟 DOM 进行 diff 检测差异?

考点: Vue 的变化侦测原理

前置知识: 依赖收集、虚拟 DOM、响应式系统

现代前端框架有两种方式侦测变化,一种是 pull 一种是 push

pull: 其代表为 React,我们可以回忆一下 React 是如何侦测到变化的,我们通常会用`setState`API 显式更新,然后 React 会进行一层层的 Virtual Dom Diff 操作找出差异,然后 Patch 到 DOM 上,React 从一开始就不知道到底是哪发生了变化,只是知道「有变化了」,然后再进行比较暴力的 Diff 操作查找「哪发生变化了」，另外一个代表就是 Angular 的脏检查操作。

push: Vue 的响应式系统则是 push 的代表,当 Vue 程序初始化的时候就会对数据 data 进行依赖的收集,一但数据发生变化,响应式系统就会立刻得知,因此 Vue 是一开始就知道是「在哪发生变化了」,但是这又会产生一个问题,如果你熟悉 Vue 的响应式系统就知道,通常一个绑定一个数据就需要一个 Watcher,一但我们的绑定细粒度过高就会产生大量的 Watcher,这会带来内存以及依赖追踪的开销,而细粒度过低会无法精准侦测变化,因此 Vue 的设计是选择中等细粒度的方案,在组件级别进行 push 侦测的方式,也就是那套响应式系统,通常我们会第一时间侦测到发生变化的组件,然后在组件内部进行 Virtual Dom Diff 获取更加具体的差异,而 Virtual Dom Diff 则是 pull 操作,Vue 是 push+pull 结合的方式进行变化侦测的.

### Vue 为什么没有类似于 React 中 shouldComponentUpdate 的生命周期？

考点: Vue 的变化侦测原理

前置知识: 依赖收集、虚拟 DOM、响应式系统

根本原因是 Vue 与 React 的变化侦测方式有所不同

React 是 pull 的方式侦测变化,当 React 知道发生变化后,会使用 Virtual Dom Diff 进行差异检测,但是很多组件实际上是肯定不会发生变化的,这个时候需要用 shouldComponentUpdate 进行手动操作来减少 diff,从而提高程序整体的性能.

Vue 是 pull+push 的方式侦测变化的,在一开始就知道那个组件发生了变化,因此在 push 的阶段并不需要手动控制 diff,而组件内部采用的 diff 方式实际上是可以引入类似于 shouldComponentUpdate 相关生命周期的,但是通常合理大小的组件不会有过量的 diff,手动优化的价值有限,因此目前 Vue 并没有考虑引入 shouldComponentUpdate 这种手动优化的生命周期.

### Vue 中的 key 到底有什么用？

`key`是为 Vue 中的 vnode 标记的唯一 id,通过这个 key,我们的 diff 操作可以更准确、更快速

diff 算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的`key`与旧节点进行比对,然后找出差异.

> diff 程可以概括为：oldCh 和 newCh 各有两个头尾的变量 StartIdx 和 EndIdx，它们的 2 个变量相互比较，一共有 4 种比较方式。如果 4 种比较都没匹配，如果设置了 key，就会用 key 进行比较，在比较的过程中，变量会往中间靠，一旦 StartIdx>EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较,这四种比较方式就是首、尾、旧尾新头、旧头新尾.

- 准确: 如果不加`key`,那么 vue 会选择复用节点(Vue 的就地更新策略),导致之前节点的状态被保留下来,会产生一系列的 bug.
- 快速: key 的唯一性可以被 Map 数据结构充分利用,相比于遍历查找的时间复杂度 O(n),Map 的时间复杂度仅仅为 O(1).

### Vue 干了什么？

#### 首先查看构造函数 function Vue (options) { this.\_init(options) }

- new Vue({_//传入上面的内容_ }) ,首先进入 Vue.prototype.\_init,构造函数第一个挂载的方法

  ```JS
  // 一个判断
  if (options && options._isComponent) {
        initInternalComponent(vm, options)
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        )
      }
  ```

- mergeOptions 使用策略模式合并传入的 options 和 Vue.options 合并后的代码结构, 可以看到通过合并策略 components,directives,filters 继承了全局的, 这就是为什么全局注册的可以在任何地方使用,因为每个实例都继承了全局的, 所以都能找到

#### 各种方法的调用

接着调用了`initLifecycle`、`initEvents`、`initRender、initState`，且在 `initState` 前后分别回调了生命周期钩子 `beforeCreate` 和 `created,`看到这里，也就明白了为什么 created 的时候不能操作 DOM 了。因为这个时候还没有渲染真正的 DOM 元素到文档中。`created` 仅仅代表数据状态的初始化完成。**重点看下 initState()**

#### 通过 initData 看 Vue 的数据响应系统,由于只是传了 data,所以执行 initData(vm)

- 取出 data 中的 key,进行循环,通过 proxy 代理,可以直接通过 this. 属性 访问 data 中的值,在实例对象上对数据进行代理，这样我们就能通过 this.todos 来访问 data.todos 了 接下啦,正式的数据响应系统 observe(data, true /_ asRootData _/),将数据通过 Object.defineProperty 进行 get,set 处理,使得数据响应

- **在** `**Observer**` **类中，我们使用** `**walk**` **方法对数据 data 的属性循环调用** `**defineReactive**` **方法，**`**defineReactive**` **方法很简单，仅仅是将数据 data 的属性转为访问器属性，并对数据进行递归观测，否则只能观测数据 data 的直属子属性。这样我们的第一步工作就完成了，当我们修改或者获取 data 属性值的时候，通过** `**get**` **和** `**set**` **即能获取到通知。**

  - 其中 **let childOb = !shallow && observe(val),进行递归调用,将所有 data 数据包含子集进行 get set 化,进行响应**

  - **其中在 Observe 类中,如果属性是数组,会进行改造**

    ```js
    ;[
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "sort",
      "reverse"
    ].forEach(function(method) {})

    // 当在对数组进行这些操作时,ob.dep.notify(),通知相应的改变
    ```

#### initData(vm)执行完成,相应系统就完成了,这时候执行 callHook(vm, 'created') 触发 created,继续回到\_init(),执行到 vm.$mount(vm.$options.el)

- 进入\$mount 会先获取挂载 el 节点,然后先判断有没有传入**render**方法,没有在去找有没有传入 template, 会取 getOuterHTML(el)作为当期模板
- 有了模板经过 compileToFunctions,将模板编译为 ast 语法树,经过静态优化, 最后处理成 render 函数,本例中的 render 函数,使用了 with(this), 将 this 作用域提前,{{`todo.text`}}所以我们可以直接在模板中使用属性,不加 this! 当然加上 this 也是可以的 解除了我的很多迷惑,为什么模板中可以不加 this(react 中的 render 是要使用 this 的), 其中的 v-for 转换成\_l,根据之前的 Vue.prototype.\_l = renderList
  - 生成了 render 函数后接着进入 mountComponent,
  - 首先调用了 beforeMount 函数,
  - 接着执行 vm.\_watcher = new Watcher(vm, updateComponent, noop)
  - 最后 callHook(vm, 'mounted'),执行 mounted,所以在 mounted 执行之前就已经挂载到 dom 上

#### 所以重点 vm.\_watcher = new Watcher(vm, updateComponent, noop)

- 开始先调用 vm.\_render()
- 开始执行之前编译好的 render 函数了,在执行 render 函数时,通过获取 todos 属性等,触发相应的 get 方法,这个时候 Dep.target 已经存在静态属性,Watcher 实例了
- 所以相应的 dep 实例就会收集对应的 Watcher 实例了，执行完之后，返回 vNode

#### vm.**patch**( vm.$el, vnode, hydrating, false,        vm.$options.\_parentElm, vm.\$options.\_refElm ) 根据 vnode 中树,创建对应元素,插入到父节点中,通过对 vnode 递归循环创建所有子节点 插入到父节点中 其中如果遇到子元素是组件,例如本例中 Child,会创建对应 VueComponent 的实例,执行 和 new Vue()一样的流程

如果还没有 `prevVnode` 说明是首次渲染，直接创建真实 DOM。如果已经有了 `prevVnode` 说明不是首次渲染，那么就采用 `patch` 算法进行必要的 DOM 操作。这就是 Vue 更新 DOM 的逻辑。只不过我们没有将 virtual DOM 内部的实现。

当改变属性值时,会触发对应的属性的 set 方法,由于之前执行 render 的时候触发了 get,收集了对应的 Watcher,所以改变值时触发 set,通知之前收集的 Watcher 实例执行,重新计算 render 方法进行 patch 操作

<img src='../imgs/vue.jpg'>
