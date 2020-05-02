---
title: js 源码实现
date: 2019-08-11
categories:
  - FrontEnd

tags:
  - javascript

isShowComments: true
---

### <a href="../source-code/排序.md">排序</a>

### <a href="../source-code/数组一些操作.md">数组一些操作</a>

### <a href="../source-code/对象.md">对象</a>

### <a href="../source-code/防抖和节流.md">防抖和节流</a>

### <a href="../source-code/自定义事件类.md">自定义事件类</a>

### <a href="../source-code/自执行器.md">自执行器</a>

### <a href="../source-code/promise的实现.md">promise 的实现</a>

<!-- more -->

### 判断数据类型

```js
function getObjType(obj, type) {
  let str = `[object ${type}]`
  return Object.prototype.toString.call(obj) === str ? true : false
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
