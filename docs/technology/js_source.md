---
title: js 源码实现
date: 2020-04-18
categories:
  - FrontEnd

tags:
	- javascript

isShowComments: true
---

TODO

<!-- more -->

### 判断数据类型

```js
function getObjType(obj, type) {
  let str = `[object ${type}]`
  return Object.prototype.toString.call(obj) === str ? true : false
}
```

### call/apply/bind

```js
function selfCall(context) {
  if (typeof this !== "function") {
    throw new TypeError("error")
  }

  context = context || window

  const { fn } = contexts

  context.fn = this

  const argus = [...arguments].slice(1)
  const result = context.fn(...argus)

  context.fn = fn

  return result
}

function selfApply(context) {
  if (typeof this != "function") {
    throw new TypeError("error")
  }

  context = context || window

  const { fn } = context

  context.fn = this

  let result
  if (Array.isArray(arguments[1])) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  return result
}

function selfBind(context) {
  if (typeof this != "function") {
    throw new TypeError("error")
  }

  let that = this
  let args = [...arguments].slice(1)

  return function F() {
    // 如果被new创建实例，不会被改变上下文！
    if (this instanceof F) {
      return new that(...args, ...arguments)
    }

    // args.concat(...arguments): 拼接之前和现在的参数
    // 注意：arguments是个类Array的Object, 用解构运算符..., 直接拿值拼接
    return that.apply(context, args.concat(...arguments))
  }
}

/**
 *  call的实现
 *  1.判断当前this是否为函数，防止Function.prototype.myCall() 直接调用
	2.context 为可选参数，如果不传的话默认上下文为 window
	3.为context 创建一个 Symbol（保证不会重名）属性，将当前函数赋值给这个属性
	4.处理参数，传入第一个参数后的其余参数
	5.调用函数后即删除该Symbol属性
 *
 */

Function.prototype.myCall = function(context = window, ...args) {
  if (this === Function.prototype) {
    // 用于防止 Function.prototype.myCall() 直接调用
    throw new TypeError("err")
  }

  const fn = Symbol()

  context[fn] = this

  let result = context[fn](...args)

  delete context[fn]

  return result
}
```

### 深拷贝

```javascript
/**
 * 深拷贝
 * 兼容 对象 数组 正则 原始类型
 */

function deepClone(obj) {
  if (obj === null) return null
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Date) return new Date(obj)
  if (typeof obj !== "object") return obj
  /**
   * 如果obj是数组，那么 obj.constructor 是 [Function: Array]
   * 如果obj是对象，那么 obj.constructor 是 [Function: Object]
   */
  let t = new obj.constructor()
  for (let key of obj) {
    t[key] = deepClone(obj[key])
  }
  return t
}
```

### 防抖和节流

```js
/**
 * 防抖 debounce
 * 一定时间 delay 后，fn会执行；重新触发后 delay 重置；
 */
function debounce(fn, delay) {
  if (typeof fn !== "function") return
  let timer
  return function() {
    let context = this
    let argus = arguments

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(() => {
      fn.apply(context, argus)
    }, delay)
  }
}

/**
 * 节流 throttle
 * 一段时间 delay 内，fn只会执行一次
 */
function throttle(fn, delay) {
  if (typeof fn !== "function") return
  let last = 0

  return function() {
    let now = +new Date()
    let context = this
    let argus = arguments

    if (now - last > delay) {
      last = now
      fn.apply(context, arguments)
    }
  }
}

/**
 * 防抖是不是有什么问题呢？
 * 当用户一直处于防抖的状态 会有卡死的假象
 * 优化：将 防抖和节流 结合处理
 */
function betterDebounce(fn, delay) {
  if (typeof fn !== "function") return
  let last, timer
  return function() {
    let context = this
    let argus = arguments
    let now = +new Date()

    if (now - last > delay) {
      // 超过了等待的 时间阀值 执行一次
      last = now
      fn.apply(context, argus)
    } else {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        last = now
        fn.apply(context, argus)
      }, delay)
    }
  }
}
```

### 自执行器

```js
/**
 * 自执行器
 * 配合 generator yield 执行
 * 实现 async await
 */
function my_co(it) {
  if (!it) return
  return new promise((resolve, reject) => {
    function next() {
      try {
        let { value, done } = it.next()
      } catch (err) {
        reject(err)
      }

      if (!done) {
        // 未完成
        Promise.resolve(value).then((val) => {
          next(val)
        }, reject)
      } else {
        resolve()
      }
    }
    next()
  })
}
```

### es5/es6 实现双向绑定

```js
// 对 obj.value 进行拦截
Object.defineProperty(obj, "value", {
  get: function() {
    console.log("获取value值")
    return value
  },
  set: function(val) {
    console.log("设置value的值")
    value = val
  },
})

const newObj = new Proxy(obj, {
  get: function(target, key, receiver) {
    console.log("获取key的值")
    return Reflect.get(target, key, receiver)
  },

  set: function(target, key, value, receive) {
    console.log("设置key的值")
    return Reflect.set(target, key, value, receiver)
  },
})
```

### instanceof 实现

```js
// instanceof
function instanceof2(left, right) {
  let prototype = right.prototype

  // 沿着left的原型链, 看看是否有何prototype相等的节点
  left = left.__proto__
  while (1) {
    if (left === null || left === undefined) {
      return false
    }
    if (left === prototype) {
      return true
    }
    left = left.__proto__
  }
}
```

### 实现支持绑定、解绑、派发的事件类

```js
class Event {
  constructor() {
    this._cache = {}
  }

  // 注册事件：如果不存在此种type，创建相关数组
  on(type, callback) {
    this._cache[type] = this._cache[type] || []
    let fns = this._cache[type]
    if (fns.indexOf(callback) === -1) {
      fns.push(callback)
    }
    return this
  }

  // 触发事件：对于一个type中的所有事件函数，均进行触发
  trigger(type, ...data) {
    let fns = this._cache[type]
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(...data)
      })
    }
    return this
  }

  // 删除事件：删除事件类型对应的array
  off(type, callback) {
    let fns = this._cache[type]
    // 检查是否存在type的事件绑定
    if (Array.isArray(fns)) {
      if (callback) {
        // 卸载指定的回调函数
        let index = fns.indexOf(callback)
        if (index !== -1) {
          fns.splice(index, 1)
        }
      } else {
        // 全部清空
        fns = []
      }
    }
    return this
  }
}

// 以下是测试函数

const event = new Event()
event
  .on("test", (a) => {
    console.log(a)
  })
  .trigger("test", "hello")
```

### ES6、es6 组合继承

- 冒泡排序，插入排序，快速排序

```js
// 插入排序
function insertSort(arr) {
  var len = arr.length
  for (var i = 1; i < len; i++) {
    var temp = arr[i]
    var j = i - 1 //默认已排序的元素
    while (j >= 0 && arr[j] > temp) {
      //在已排序好的队列中从后向前扫描
      arr[j + 1] = arr[j] //已排序的元素大于新元素，将该元素移到一下个位置
      j--
    }
    arr[j + 1] = temp
  }
  return arr
}

// 快速排序
function quickSort(arr, i, j) {
  if (i < j) {
    let left = i
    let right = j
    let mid = Math.floor((left + right) / 2)
    let temp = arr[left]
    arr[left] = arr[mid]
    arr[mid] = temp
    let pivot = arr[left]
    while (i < j) {
      while (arr[j] >= pivot && i < j) {
        // 从后往前找比基准小的数
        j--
      }
      if (i < j) {
        arr[i++] = arr[j]
      }
      while (arr[i] <= pivot && i < j) {
        // 从前往后找比基准大的数
        i++
      }
      if (i < j) {
        arr[j--] = arr[i]
      }
    }
    arr[i] = pivot
    quickSort(arr, left, i - 1)
    quickSort(arr, i + 1, right)
    return arr
  }
}
```

### map 的实现

```js
// es 5 map 方法
function myMap(fn, context) {
  let arr = Array.prototype.slice.call(this)
  let mapedArr = []
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    mapedArr.push(fn.call(context, arr[i], i, this))
  }
  return mapedArr
}
```

### 数组的方法

```js
// 数组的 filter 方法
function myFilter(fn, context) {
  let arr = Array.prototype.slice.call(this)
  let filterArr = []

  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    fn.call(context, arr[i], i, this) && filterArr.push(arr[i])
  }

  return filterArr
}

// 数组的 some 方法
function mySome() {
  let arr = Array.prototype.slice.call(this)
  if (!arr.length) return false

  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    let res = fn.call(context, arr[i], i, this)

    if (res) return true
  }
  return false
}
```

### new 和 class 的实现

```js
/*new
	创建一个新对象obj
  把obj的__proto__指向Dog.prototype实现继承
  执行构造函数,传递参数,改变this指向,Dog.call(obj, ...args)
  返回obj

	1.它创建了一个全新的对象。
	2.它会被执行[[Prototype]]（也就是__proto__）链接。
	3.它使this指向新创建的对象。。
	4.通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
	5.如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。
*/
function New(func) {
  var res = {}
  if (func.prototype !== null) {
    res.__proto__ = func.prototype
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1))
  if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
    return ret
  }
  return res
}

// 实现 class
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType,
    },
  })

  Object.setPrototypeOf(subType, superType)
}
```

### promise 的实现

```js
/**
 * promise的源码实现
 */

/**
 * 1. new Promise时，需要传递一个 executor 执行器，执行器立刻执行
 * 2. executor 接受两个参数，分别是 resolve 和 reject
 * 3. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
 * 4. promise 的状态一旦确认，就不会再改变
 * 5. promise 都有 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled,
 *      和 promise 失败的回调 onRejected
 * 6. 如果调用 then 时，promise已经成功，则执行 onFulfilled，并将promise的值作为参数传递进去。
 *    如果promise已经失败，那么执行 onRejected, 并将 promise 失败的原因作为参数传递进去。
 *    如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次将对应的函数执行(发布订阅)
 * 7. then 的参数 onFulfilled 和 onRejected 可以缺省
 * 8. promise 可以then多次，promise 的then 方法返回一个 promise
 * 9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调(onFulfilled)
 * 10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
 * 11.如果 then 返回的是一个promise,那么需要等这个promise，那么会等这个promise执行完，promise如果成功，
 *   就走下一个then的成功，如果失败，就走下一个then的失败
 */

const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"
function Promise(executor) {
  let self = this
  self.status = PENDING
  self.onFulfilled = [] //成功的回调
  self.onRejected = [] //失败的回调
  //PromiseA+ 2.1
  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED
      self.value = value
      self.onFulfilled.forEach((fn) => fn()) //PromiseA+ 2.2.6.1
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason
      self.onRejected.forEach((fn) => fn()) //PromiseA+ 2.2.6.2
    }
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason
        }
  let self = this
  //PromiseA+ 2.2.7
  let promise2 = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      //PromiseA+ 2.2.2
      //PromiseA+ 2.2.4 --- setTimeout
      setTimeout(() => {
        try {
          //PromiseA+ 2.2.7.1
          let x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          //PromiseA+ 2.2.7.2
          reject(e)
        }
      })
    } else if (self.status === REJECTED) {
      //PromiseA+ 2.2.3
      setTimeout(() => {
        try {
          let x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    } else if (self.status === PENDING) {
      self.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
      self.onRejected.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
    }
  })
  return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
  let self = this
  //PromiseA+ 2.3.1
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle"))
  }
  if ((x && typeof x === "object") || typeof x === "function") {
    let used //PromiseA+2.3.3.3.3 只能调用一次
    try {
      let then = x.then
      if (typeof then === "function") {
        //PromiseA+2.3.3
        then.call(
          x,
          (y) => {
            //PromiseA+2.3.3.1
            if (used) return
            used = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            //PromiseA+2.3.3.2
            if (used) return
            used = true
            reject(r)
          }
        )
      } else {
        //PromiseA+2.3.3.4
        if (used) return
        used = true
        resolve(x)
      }
    } catch (e) {
      //PromiseA+ 2.3.3.2
      if (used) return
      used = true
      reject(e)
    }
  } else {
    //PromiseA+ 2.3.3.4
    resolve(x)
  }
}

module.exports = Promise
```

### 数组乱序

```js
/**
 *	数组乱序
 * 	从最后开始，和生成的随机数序号调换位置，知道第一个
 */

function initOrder(arr) {
  let len = arr.length
  let cur = len - 1
  let random
  while (cur > -1) {
    random = Math.floor(Math.random() * len)[(arr[cur], arr[random])] = [
      arr[random],
      arr[cur],
    ]
    cur--
  }
  return arr
}
```

### 函数柯里化

```js
/**
 *	函数柯里化
 * 	判断当前函数传入的参数是否大于或等于fn需要参数的数量，如果是，直接执行fn
 *  如果传入参数数量不够，返回一个闭包，暂存传入的参数，并重新返回currying函数
 */
function curry(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args)
  } else {
    return (...args2) => curry(fn, ...args, ...args2)
  }
}
```

### JSONP

```js
/**
 *	JSONP
 *	将传入的data数据转化为url字符串形式
 *	处理url中的回调函数
 *	创建一个script标签并插入到页面中
 *	挂载回调函数
 */

window[cbFuncName] = function(data) {
  callback(data)
  // 处理完回调函数的数据之后，删除jsonp的script标签
  document.body.removeChild(scriptEle)
}
```
