---
title: CSS-Tips
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
:::

<!-- more -->

## CSS 动画的样式优先级高于!important

## 画三角形

## 哀悼模式

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
