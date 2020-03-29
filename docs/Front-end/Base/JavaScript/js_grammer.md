# js基础

## this 的指向
1. 普通函数调用
	- 函数被直接调用，上下文一定是window
	- 函数作为对象属性被调用，例如：obj.foo()，上下文就是对象本身obj
	- 通过new调用，this绑定在返回的实例上
2. 箭头函数
	 它本身没有this，会沿着作用域向上寻找，直到global / window。
3. bind绑定上下文返回的新函数
	
	就是被第一个bind绑定的上下文，而且bind对“箭头函数”无效。多次bind，上下文由第一个bind的上下文决定。

4. call,apply this指向第一个参数，也就是被借用的函数

5. 匿名函数指向 window

	**优先级：new > bind > 对象调用 > 直接调用**

	**apply,call,bind 的使用场景以及特点？**

## 原始数据类型和判断方法？

- 原始数据类型有哪些？

	ECMAScript 中定义了 7 种原始类型：

	Boolean、String、Number、Null、Undefined、Symbol（新定义）、BigInt（新定义）
	
	**注意：原始类型不包含Object和Function**

- 类型判断
   	+ typeof：
      	* typeof基本都可以正确判断数据类型
		* typeof null和typeof [1, 2, 3]均返回”object”
		* ES6新增：typeof Symbol()返回”symbol”

   	+ instanceof：
		* 专门用于实例和构造函数对应 {} instanceof Object // true
		* 判断是否是数组：[1, 2, 3] instanceof Array  // true
		* [1,2,3] instanceof Object // true 注意！！

   	+ 数组判断 ES6
   		* Array.isArray() 
   		* Array.isArray({}) // false

- 类型转换
	
	> 非原始类型的数据进行数学运算操作时，需要将转换为原始类型	
	
	转换如下：

	1. 调用其 valueOf 方法，返回结果是原始类型，则返回，否则继续；
	2. 调用其 toString 方法，返回结果是原始类型，则返回，否则继续；
	3. 都没有返回原始类型，则报错
	4. es6还提供了Symbol.toPrimitive供对象向原始类型转化，并且它的优先级最高
			
	```
	let b = {
	  valueOf: function() {
	    return 100
	  },
	  toString: function() {
	    return 'b'
	  },
	  [Symbol.toPrimitive]: function() {
	    return 10000
	  }
	}
	console.log(b + 1) // output: 10001
	```


## 对象的深拷贝和浅拷贝

**提醒** 
- 在JS中，函数和对象都是浅拷贝（地址引用）；其他的，例如布尔值、数字等基础数据类型都是深拷贝（值引用）。
- ES6的Object.assign()和ES7的...解构运算符都是“浅拷贝”。


- 深拷贝
   * 手动做一个“完美”的深拷贝函数
   * 借助第三方库：jq的extend(true, result, src1, src2[ ,src3])、lodash的cloneDeep(src)
   * JSON.parse(JSON.stringify(src))：这种方法有局限性，如果属性值是函数或者一个类的实例的时候，无法正确拷贝
   * 借助HTML5的MessageChannel：这种方法有局限性，当属性值是函数的时候，会报错

   	```
	   	<script>
		  function deepClone(obj) {
		    return new Promise(resolve => {
		      const {port1, port2} = new MessageChannel();
		      port2.onmessage = ev => resolve(ev.data);
		      port1.postMessage(obj);
		    });
		  }
		  const obj = {
		    a: 1,
		    b: {
		      c: [1, 2],
		      d: '() => {}'
		    }
		  };
		  deepClone(obj)
		    .then(obj2 => {
		      obj2.b.c[0] = 100;
		      console.log(obj.b.c); // output: [1, 2]
		      console.log(obj2.b.c); // output: [100, 2]
		    })
		</script>
		```
	```
	
	```

## js事件流
* 事件冒泡和事件捕获
   - 事件流分为：冒泡和捕获，顺序是先捕获再冒泡。

   - 事件冒泡：子元素的触发事件会一直向父节点传递，一直到根结点停止。此过程中，可以在每个节点捕捉到相关事件。可以通过stopPropagation方法终止冒泡。

   - 事件捕获：和“事件冒泡”相反，从根节点开始执行，一直向子节点传递，直到目标节点。

   - addEventListener给出了第三个参数同时支持冒泡与捕获：默认是false，事件冒泡；设置为true时，是事件捕获。

* DOM0级 和 DOM2级
   - DOM2级：前面说的addEventListener，它定义了DOM事件流，捕获 + 冒泡。

   - DOM0级：
		- 直接在html标签内绑定on事件
		- 在JS中绑定on系列事件

		**注意：** 现在通用DOM2级事件，优点如下：

			   + 可以绑定 / 卸载事件
			   + 支持事件流
			   + 冒泡 + 捕获：相当于每个节点同一个事件，至少2次处理机会
			   + 同一类事件，可以绑定多个函数


## 高阶函数

```
// map: 生成一个新数组，遍历原数组，
// 将每个元素拿出来做一些变换然后放入到新的数组中
let newArr = [1, 2, 3].map(item => item * 2);
console.log(`New array is ${newArr}`);

// filter: 数组过滤, 根据返回的boolean
// 决定是否添加到数组中
let newArr2 = [1, 2, 4, 6].filter(item => item !== 6);
console.log(`New array2 is ${newArr2}`);

// reduce: 结果汇总为单个返回值
// acc: 累计值; current: 当前item
let arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current);
const sum2 = arr.reduce((acc, current) => acc + current, 100);
console.log(sum); // 6
console.log(sum2); // 106

```


## ES5 继承
1. 绑定构造函数 
  **不能继承父类原型的方法/属性 **
```
  	function Animal(){
	  this.species = '动物'
	}

	function Cat(){
	  // 执行父类的构造方法, 上下文为实例对象
	  Animal.apply(this, arguments)
	}


	/**
	 * 测试代码
	 */
	var cat = new Cat()
	console.log(cat.species) // output: 动物
```

2. 原型链继承

**注意： **
- 缺点：无法向父类构造函数中传递参数；子类原型链上定义的方法有先后顺序问题。
- js中交换原型链，均需要修复prototype.constructor指向问题。

```
	function Animal(species){
	  this.species = species
	}
	Animal.prototype.func = function(){
	  console.log('Animal')
	}

	function Cat(){}
	/**
	 * func方法是无效的, 因为后面原型链被重新指向了Animal实例
	 */
	Cat.prototype.func = function() {
	  console.log('Cat')
	}

	Cat.prototype = new Animal()
	Cat.prototype.constructor = Cat // 修复: 将Cat.prototype.constructor重新指向本身

	/**
	 * 测试代码
	 */
	var cat = new Cat()
	cat.func() // output: Animal
	console.log(cat.species) // undefined
```

3. 组合继承
	* 结合绑定构造函数和原型链继承2种方式，缺点是：调用了2次父类的构造函数
		
	```
		function Animal(species){
			this.species = species
		}
		Animal.prototype.fun = function(){
			console.log("Animal")
		}
		function Cat(){
			Animal.apply(this,arguments)
		}
		Cat.prototype = new Animal()
		Cat.prototype.constructor = Cat
		var cat = new Cat('Cat')
		cat.fun() // Animal 
		console.log(cat.species) // Cat
	```

4. 寄生组合继承
	**改进了组合继承的缺点，只需要调用1次父类的构造函数。它是引用类型最理想的继承范式 ** 
	```
	/**
	 * 寄生组合继承的核心代码
	 * @param {Function} sub 子类
	 * @param {Function} parent 父类
	 */
	function inheritPrototype(sub, parent) {
	  // 拿到父类的原型
	  var prototype = Object.create(parent.prototype) 
	  // 改变constructor指向
	  prototype.constructor = sub
	  // 父类原型赋给子类
	  sub.prototype = prototype
	}

	function Animal(species){
	  this.species = species
	}
	Animal.prototype.func = function(){
	  console.log('Animal')
	}

	function Cat(){
	  Animal.apply(this, arguments) // 只调用了1次构造函数
	}

	inheritPrototype(Cat, Animal)

	/**
	 * 测试代码
	 */

	var cat = new Cat('cat')
	cat.func() // output: Animal
	console.log(cat.species) // output: cat
	```


## 原型和原型链

**注意***
- 所有的引用类型（数组、对象、函数），都有一个__proto__属性，属性值是一个普通的对象
- 所有的函数，都有一个prototype属性，属性值也是一个普通的对象
- 所有的引用类型（数组、对象、函数），__proto__ 属性值指向它的构造函数的 prototype 属性值
- 注：ES6的箭头函数没有prototype属性，但是有__proto__属性。

```
const obj = {};
// 引用类型的 __proto__ 属性值指向它的构造函数的 prototype 属性值
console.log(obj.__proto__ === Object.prototype); // output: true
```

* 原型
```
// 构造函数
function Foo(name, age) {
    this.name = name
}
Foo.prototype.alertName = function () {
    alert(this.name)
}
// 创建示例
var f = new Foo('zhangsan')
f.printName = function () {
    console.log(this.name)
}
// 测试
f.printName()
f.alertName()

```
**当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__（即它的构造函数的prototype）中寻找，因此f.alertName就会找到Foo.prototype.alertName。**

* 原型链

理解：以上一题为基础，如果调用f.toString()。

1. f试图从__proto__中寻找（即Foo.prototype），还是没找到toString()方法。
2. 继续向上找，从f.__proto__.__proto__中寻找（即Foo.prototype.__proto__中）。因为Foo.prototype就是一个普通对象，因此Foo.prototype.__proto__ = Object.prototype
3. 最终对应到了Object.prototype.toString

**这是对深度遍历的过程，寻找的依据就是一个链式结构，所以叫做“原型链”。**


## 作用域和作用域链

* 作用域

	- ES5有”全局作用域“和”函数作用域“。ES6的let和const使得JS用了”块级作用域“。

	- 为了解决ES5的全局冲突，一般都是闭包编写：(function(){ ... })()。将变量封装到函数作用域。

* 作用域链
	- 当前作用域没有找到定义，继续向父级作用域寻找，直至全局作用域。这种层级关系，就是作用域链。


## Event Loop
- 单线程
  	执行：
   	```
   		var a = true;
		setTimeout(function(){
		    a = false;
		}, 100)
		while(a){
		    console.log('while执行了')
		}

   	```
	这段代码会一直执行并且输出”while…”。
	** JS是单线程的，先跑执行栈里的同步任务，然后再跑任务队列的异步任务。**

- 执行栈和任务队列
	
	简单总结如下：

	1. JS是单线程的，其上面的所有任务都是在两个地方执行：执行栈和任务队列。前者是存放同步任务；后者是异步任务有结果后，就在其中放入一个事件。
	2. 当执行栈的任务都执行完了（栈空），js会读取任务队列，并将可以执行的任务从任务队列丢到执行栈中执行。

	这个过程是循环进行，所以称作Loop。


## 执行上下文
- 全局执行上下文

	1. 解析JS时候，创建一个 全局执行上下文 环境。把代码中即将执行的（内部函数的不算，因为你不知道函数何时执行）变量、函数声明都拿出来。未赋值的变量就是undefined。

	2. 下面这段代码输出：undefined；而不是抛出Error。因为在解析JS的时候，变量a已经存入了全局执行上下文中了。
	```
		console.log(a);
		var a = 1;
	```


- 函数执行上下文

	1. 和全局执行上下文差不多，但是多了this和arguments和参数。

	2. 在JS中，this是关键字，它作为内置变量，其值是在执行的时候确定（不是定义的时候确定）。


## 闭包的理解和分析

> 解释一下js的闭包
**Js中的函数运行在它们被定义的作用域，而不是它们被执行的作用域**

> 闭包的优缺点

- 闭包封住了变量作用域，有效地防止了全局污染；但同时，它也存在内存泄漏的风险：
- 在浏览器端可以通过强制刷新解决，对用户体验影响不大
- 在服务端，由于node的内存限制和累积效应，可能会造成进程退出甚至服务器沓机

**解决方法是显式对外暴露一个接口，专门用以清理变量。**


## ES6 - let,const
> 声明的变量，都处于“块级作用域”。并且不存在“变量提升”，不允许重复声明

同时，const声明的变量所指向的内存地址保存的数据不得改变：

   + 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
   + 对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），不能保证指向的数据结构不可变


## ES6 - Set,Map

* Set -> Set元素不允许重复
		```
			// 实例化一个set
			const set = new Set([1, 2, 3, 4]);

			// 遍历set
			for (let item of set) {
			  console.log(item);
			}

			// 添加元素，返回Set本身
			set.add(5).add(6);

			// Set大小
			console.log(set.size);

			// 检查元素存在
			console.log(set.has(0));

			// 删除指定元素，返回bool
			let success = set.delete(1);
			console.log(success);

			set.clear();

	```

* Map -> Map类似对象，但是它的键（key）可以是任意数据类型

	使用方法：Map接口基本和Set一致。不同的是增加新元素的API是：set(key, value)
		   
		   ```
		   	const map = new Map();
	
			// 以任意对象为 Key 值
			// 这里以 Date 对象为例
			let key = new Date(); 
			map.set(key, "today");
	
			console.log(map.get(key));
		   ```


## ES6 - Generator与yield

generator函数是es6提供的新特性，它的最大特点是：控制函数的执行

看个例子吧。

```
	function* foo(x) {
	  var y = 2 * (yield x + 1);
	  var z = yield y / 3;
	  return x + y + z;
	}

	var b = foo(5);
	b.next(); // { value:6, done:false }
	b.next(12); // { value:8, done:false }
	b.next(13); // { value:42, done:true }

```
通俗的解释下为什么会有这种输出：

1. 给函数foo传入参数5，但由于它是generator，所以执行到第一个yield前就停止了。
2. 第一次调用next()，这次传入的参数会被忽略暂停**。
3. 第二次调用next(12)，传入的参数会被当作上一个yield表达式的返回值。因此，y = 2 * 12 = 24。执行到第二个yield，返回其后的表达式的值 24 / 3 = 8。然后函数在此处暂停。
4. 第三次调用next(13)，没有yield，只剩return了，按照正常函数那样返回return的表达式的值，并且done为true。

**难点：在于为什么最后的value是42呢？**
> 首先，x的值是刚开始调用foo函数传入的5。而最后传入的13被当作第二个yield的返回值，所以z的值是13。对于y的值，我们在前面第三步中已经计算出来了，就是24。所以，x + y + z = 5 + 24 + 13 = 42

再来理解一个：

```
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}

```

只有第一次调用next函数的时候，输出的value是6。其他时候由于没有给next传入参数，因此yield的返回值都是undefined，进行运算后自然是NaN


## Promise , async/await介绍

* Promise

>三个状态、两个过程、一个方法

   	- 三个状态：pending、fulfilled、rejected
   	- 两个过程（单向不可逆）：
		   pending->fulfilled
		   pending->rejected
   	- 一个方法then：Promise本质上只有一个方法，catch和all方法都是基于then方法实现的。

	```
	    // 构造 Promise 时候, 内部函数立即执行
		new Promise((resolve, reject) => {
		  console.log("new Promise");
		  resolve("success");
		});
		console.log("finifsh");

		//  then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装
		Promise.resolve(1)
		  .then(res => {
		    console.log(res); // => 1
		    return 2; // 包装成 Promise.resolve(2)
		  })
		  .then(res => {
		    console.log(res); // => 2
		  });
	```

* async/await

- async函数返回一个Promise对象，可以使用then方法添加回调函数。
- 当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。
- 这也是它最受欢迎的地方：能让异步代码写起来像同步代码，并且方便控制顺序。
- 可以利用它实现一个sleep函数阻塞进程:
	```
			function sleep(millisecond) {
			  return new Promise(resolve => {
			    setTimeout(() => resolve, millisecond)
			  })
			}
			/**
			 * 以下是测试代码
			 */
			async function test() {
			  console.log('start')
			  await sleep(1000) // 睡眠1秒
			  console.log('end')
			}
			test() // 执行测试函数
	```

	**注：虽然方便，但是它也不能取代Promise，尤其是我们可以很方便地用Promise.all()来实现并发，而async/await只能实现串行** 

	```
		function sleep(second) {
		  return new Promise(resolve => {
		    setTimeout(() => {
		      console.log(Math.random());
		      resolve();
		    }, second);
		  });
		}

		async function chuanXingDemo() {
		  await sleep(1000);
		  await sleep(1000);
		  await sleep(1000);
		}
	```


		async function bingXingDemo() {
		  var tasks = [];
		  for (let i = 0; i < 3; ++i) {
		    tasks.push(sleep(1000));
		  }
	
		  await Promise.all(tasks);
		}
	```
	
	运行bingXingDemo()，几乎同时输出，它是并发执行；运行chuanXingDemo()，每个输出间隔1s，它是串行执行。


## ES6对象和ES5对象
> es6 class 的new实例和es5的new实例有什么区别？

在ES6中（和ES5相比），class的new实例有以下特点：

- class的构造参数必须是new来调用，不可以将其作为普通函数执行
- es6 的class不存在变量提升
- 最重要的是：es6内部方法不可以枚举。es5的prototype上的方法可以枚举。

为此我做了以下测试代码进行验证：

		```
			console.log(ES5Class()) // es5:可以直接作为函数运行
			// console.log(new ES6Class()) // 会报错：不存在变量提升
	
			function ES5Class(){
			  console.log("hello")
			}
	
			ES5Class.prototype.func = function(){ console.log("Hello world") }
	
			class ES6Class{
			  constructor(){}
			  func(){
			    console.log("Hello world")
			  }
			}
	
			let es5 = new ES5Class()
			let es6 = new ES6Class()
	
			// 推荐在循环对象属性的时候，使用for...in
			// 在遍历数组的时候的时候，使用for...of
			console.log("ES5 :")
			for(let _ in es5){
			  console.log(_)
			}
	
			// es6:不可枚举
			console.log("ES6 :")
			for(let _ in es6){
			  console.log(_)
			}
		```


## Proxy代理器
> 实现js中的“元编程”：在目标对象之前架设拦截，可以过滤和修改外部的访问。


## EsModule和CommonJS的比较

目前js社区有4种模块管理规范：AMD、CMD、CommonJS和EsModule。 

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别：

- CommonJS 支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案：import(xxx)
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- commonJs输出的是值的浅拷贝，esModule输出值的引用
- ES Module 会编译成 require/exports 来执行的


## js的异步加载和异步处理

## js自定义事件

## 关于类型的转换

## 原型，原型链，继承

## 跨域的方法以及原理

## 关于 worker 的理解

## ES6

## Class

1. class是传统构造函数的语法糖，Point相当于传统函数的函数名，当然它现在也是class类的名。

   ```js
   class Point{
     	// constructor中的this，指向实例对象!!!
       constructor(x,y){
           this.x = x;
           this.y = y;
       }
       toString(){
           return this.x + ',' + this.y
       }
   }
   console.log(typeof Point) //"function"
   Point === Point.prototype.constructor // true
   
   // Point 是个函数
   // 类本身指向构造函数。因为构造函数的原型的构造属性也指向函数本身。
   ```

   

2. 使用时，可以通过new命令，与传统函数相同。

3. 实例属性，除非定义在其本身，否则都定义在原型上。

4. 共享一个原型对象。

#### 静态方法

> **类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。**

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function

```

**看见了static，就知道，它是个静态方法。就可以直接在Foo上调用，而不是在实例上调用。**
**！注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。**

#### 关于继承

**子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。**

```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}

```

**父类的静态方法，也会被子类继承。**



#### 如何判断一个类是否继承另一个类？

```
Object.getPrototypeOf(ColorPoint) === Point
// true
// Object.getPrototypeOf方法可以用来从子类上获取父类
```

#### super关键字

**super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。 第一种情况： 作为函数调用**

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();// 代表调用父类的构造函数
  }
}
new A() // A
new B() // B

// super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
```

**作为对象调用**
**super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。**

```js
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();

b.m // undefined 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。

// 子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。
```



## reduce的使用





