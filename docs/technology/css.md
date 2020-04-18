---
title: CSS相关
date: 2020-04-18
categories:
  - FrontEnd
tags:
  - CSS
  - tips

isShowComments: true
---

:::tip
TODO

css 常见的操作以及问题
:::

<!-- more -->

## 盒模型

    盒模型的基本区别就是
    box-sizing:border-box 设置成 IE 的模型
    box-sizing:content-box 设置成 标准 的模型

## flex

- 容器属性：

  - flex-direction:row/row-reverse/colum/colum-reverse
  - flex-wrap:nowrap/wrap/wrap-reverse
  - justify-content:flex-start/center/flex-end/space-between/space-around
  - align-items:flex-start/flex-end/center/baseline/stretch
  - align-content:flex-start/center/flex-end/space-between/space-around // 多根轴线的对齐方式

- 项目属性：
  - order:0/1/2... 数值越小，排列越靠前，默认为 0
  - flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
  - flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
  - flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。
  - align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

## 层叠上下文

## 常见页面布局

## 响应式布局

## css 预处理，后处理

## css3 新特性

    animation和transiton的相关属性
    animation: name duration timing-function delay iteration-count direction;
    transition: property duration timing-function delay;

    animate和transform
    animate   @keyframe 定义关键帧
    transform 转换 需要借助函数 translate,rotate,skew,scale

## display 哪些取值

## 相邻的两个 inline-block 节点为什么会出现间隔，该如何解决

    是由空格或者换行导致的。
    改变代码布局的方式；
    使用font-size处理；
    margin负值；
    使用word-spacing或letter-spacing = 0

## meta viewport 移动端适配

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
```

## CSS 实现宽度自适应 100%，宽高 16:9 的比例的矩形

## rem 布局的优缺点

## 1 像素边框问题

## BFC 及其应用

BFC 块级格式上下文，盒模型布局中的一种渲染模式，相当于独立容器，里面的元素和外面的原素互不影响。创建方式：

- html 根元素
- float 浮动
- 绝对定位
- overflow 不为 visiable
- diaplay 为表格布局或者弹性布局
- 作用：
  1. 清除浮动（父元素高度塌陷，父元素设置`overflow:hidden`）
  2. 防止同一 BFC 容器中的相邻元素间的外边距重叠问题

#### 分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

- 结构： display:none: 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击， visibility: hidden:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击 ,opacity: 0: 不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击

- 继承： display: none 和 opacity: 0：是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。 visibility: hidden：是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式。

- 性能： displaynone : 修改元素会造成文档回流,读屏器不会读取 display: none 元素内容，性能消耗较大 visibility:hidden: 修改元素只会造成本元素的重绘,性能消耗较少读屏器读取 visibility: hidden 元素内容 opacity: 0 ： 修改元素会造成重绘，性能消耗较少

- 联系：它们都能让元素不可见

​ **css 隐藏一个页面元素的方法？**

​ 以上三种+z-index+text-index:-9999
