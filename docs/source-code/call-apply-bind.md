# call/apply/bind 的实现

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
