# css常见面试题

## 盒模型
	盒模型的基本区别就是
	
	box-sizing:border-box 设置成 IE 的模型
	box-sizing:content-box 设置成 标准 的模型

## flex

- 容器属性：
  + flex-direction:row/row-reverse/colum/colum-reverse
  + flex-wrap:nowrap/wrap/wrap-reverse
  + justify-content:flex-start/center/flex-end/space-between/space-around
  + align-items:flex-start/flex-end/center/baseline/stretch
  + align-content:flex-start/center/flex-end/space-between/space-around  // 多根轴线的对齐方式

- 项目属性：
  + order:0/1/2...  数值越小，排列越靠前，默认为0
  + flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
  + flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
  + flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
  + align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

## css单位

## css选择器

## bfc 清除浮动

## 层叠上下文

## 常见页面布局

## 响应式布局

## css预处理，后处理

## css3新特性

	animation和transiton的相关属性
	animation: name duration timing-function delay iteration-count direction;
	transition: property duration timing-function delay;
	
	animate和transform
	animate   @keyframe 定义关键帧
	transform 转换 需要借助函数 translate,rotate,skew,scale

## display哪些取值


## 相邻的两个inline-block节点为什么会出现间隔，该如何解决

	是由空格或者换行导致的。
	改变代码布局的方式；
	使用font-size处理；
	margin负值；
	使用word-spacing或letter-spacing = 0

## 文本溢出省略 （...）

- 单行溢出

```
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
```

- 多行溢出
```
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
```

- 扩展：多行，出现虚影同时出现 ...
```
p{
	position: relative;
	line-height: 20px;
	max-height: 40px;
	overflow: hidden;
}
p::after{
	content: "...";
	position: absolute;
	bottom: 0;
	right: 0;
	padding-left: 40px;
	background: -webkit-linear-gradient(left, transparent, #fff 55%);
	background: -o-linear-gradient(right, transparent, #fff 55%);
	background: -moz-linear-gradient(right, transparent, #fff 55%);
	background: linear-gradient(to right, transparent, #fff 55%);
}
```

## meta viewport 移动端适配
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

## CSS实现宽度自适应100%，宽高16:9的比例的矩形



## rem布局的优缺点


## 画三角形


## 1像素边框问题





