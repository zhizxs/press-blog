\---

title: JS事件循环

date: 2020-04-18

categories:

  \- FrontEnd

tags:

 	- javascript

​		- 

prev:JS的事件循环

isShowComments: false

\---

:::tip

​	1.js的事件机制是什么样子的？

​	2.为什么会是这样呢？

:::



## (浏览器)事件循环 Event-loop

**区别 node 的事件循环**

> 浏览器的任务执行：宏任务 --> 微任务 --> 渲染 --> worker

**JavaScript 中有两种异步任务**

- 宏任务: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
- 微任务: process.nextTick（Nodejs）, Promises, Object.observe, MutationObserver;

**事件循环**

- 主线程从"任务队列"中读取执行事件，这个过程是循环不断的，这个机制被称为事件循环。
- 此机制具体如下:主线程会不断从任务队列中按顺序取任务执行，每执行完一个任务都会检查 microtask 队列是否为空（执行完一个任务的具体标志是函数执行栈为空），如果不为空则会一次性执行完所有 microtask。然后再进入下一个循环去任务队列中取下一个任务执行。

**具体执行步骤**

1. 选择当前要执行的宏任务队列，选择一个最先进入任务队列的宏任务，如果没有宏任务可以选择，则会跳转至 microtask 的执行步骤。
2. 将事件循环的当前运行宏任务设置为已选择的宏任务。
3. 运行宏任务。
4. 将事件循环的当前运行任务设置为 null。
5. 将运行完的宏任务从宏任务队列中移除。
6. microtasks 步骤：进入 microtask 检查点。
7. 更新界面渲染。
8. 返回第一步。

> **需要注意的是:当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件, 然后再去宏任务队列中取出一个事件。同一次事件循环中, 微任务永远在宏任务之前执行。**

![任务执行](/Users/chenxq/workspace/gitio/press-blog/articles/Base/imgs/task.jpeg)

### 案列分析

- 先看一个示例

```
setTimeout(()=>{
    console.log("setTimeout1");
    Promise.resolve().then(data => {
        console.log(222);
    });
});
setTimeout(()=>{
    console.log("setTimeout2");
});
Promise.resolve().then(data=>{
    console.log(111);
});

// 执行结果
111
setTimeout1
222
setTimeout2

```

**分析**

1. 主线程上没有需要执行的代码
2. 接着遇到 setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中(这个任务在下一次的事件循环中执行)。
3. 接着遇到 setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中(这个任务在再下一次的事件循环中执行)。
4. 首先检查微任务队列, 即 microtask 队列，发现此队列不为空，执行第一个 promise 的 then 回调，输出 '111'。
5. 此时 microtask 队列为空，进入下一个事件循环, 检查宏任务队列，发现有 setTimeout 的回调函数，立即执行回调函数输出 'setTimeout1',检查 microtask 队列，发现队列不为空，执行 promise 的 then 回调，输出'222'，microtask 队列为空，进入下一个事件循环。
6. 检查宏任务队列，发现有 setTimeout 的回调函数, 立即执行回调函数输出'setTimeout2'。

**再思考一下下面代码的执行顺序**

```js
console.log('script start');

setTimeout(function () {
    console.log('setTimeout---0');
}, 0);

setTimeout(function () {
    console.log('setTimeout---200');
    setTimeout(function () {
        console.log('inner-setTimeout---0');
    });
    Promise.resolve().then(function () {
        console.log('promise5');
    });
}, 200);

Promise.resolve().then(function () {
    console.log('promise1');
}).then(function () {
    console.log('promise2');
});
Promise.resolve().then(function () {
    console.log('promise3');
});
console.log('script end');

//执行结果
script start
script end
promise1
promise3
promise2
setTimeout---0
setTimeout---200
promise5
inner-setTimeout---0


```

> **注：new Promise 里的代码是同步的，then 和 catch 里的代码才是异步的**

**分析**

1. 首先顺序执行完主进程上的同步任务，第一句和最后一句的 console.log
2. 接着遇到 setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中(这个任务在下一次的事件循环中执行)。
3. 接着遇到 setTimeout 200，它的作用是在 200ms 后将回调函数放到宏任务队列中(这个任务在再下一次的事件循环中执行)。
4. 同步任务执行完之后，首先检查微任务队列, 即 microtask 队列，发现此队列不为空，执行第一个 promise 的 then 回调，输出 'promise1'，然后执行第二个 promise 的 then 回调，输出'promise3'，由于第一个 promise 的.then()的返回依然是 promise，所以第二个.then()会放到 microtask 队列继续执行，输出 'promise2';
5. 此时 microtask 队列为空，进入下一个事件循环, 检查宏任务队列，发现有 setTimeout 的回调函数，立即执行回调函数输出 'setTimeout---0',检查 microtask 队列，队列为空，进入下一次事件循环.
6. 检查宏任务队列，发现有 setTimeout 的回调函数, 立即执行回调函数输出'setTimeout---200'.
7. 接着遇到 setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中，检查微任务队列，即 microtask 队列，发现此队列不为空，执行 promise 的 then 回调，输出'promise5'。
8. 此时 microtask 队列为空，进入下一个事件循环，检查宏任务队列，发现有 setTimeout 的回调函数，立即执行回调函数输出，输出'inner-setTimeout---0'。代码执行结束.

### 为什么需要事件循环？

因为 JavaScript 是单线程的。单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。为了协调事件（event），用户交互（user interaction），脚本（script），渲染（rendering），网络（networking）等，用户代理（user agent）必须使用事件循环（event loops）

> **总结：简单说就是同步任务和异步任务，永远优先执行同步任务，异步任务中的宏任务和微任务永远优先执行微任务，宏任务在整个 js 执行过程中永远处于最后执行!**