## css

#### BFC 及其应用

BFC块级格式上下文，盒模型布局中的一种渲染模式，相当于独立容器，里面的元素和外面的原素互不影响。创建方式：

- html根元素
- float浮动
- 绝对定位
- overflow 不为 visiable
- diaplay 为表格布局或者弹性布局
- 作用：
  1. 清除浮动（父元素高度塌陷，父元素设置`overflow:hidden`）
  2. 防止同一 BFC 容器中的相邻元素间的外边距重叠问题

#### 分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景。

- 结构： display:none: 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击， visibility: hidden:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击 ,opacity: 0: 不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击

- 继承： display: none和opacity: 0：是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。 visibility: hidden：是继承属性，子孙节点消失由于继承了hidden，通过设置visibility: visible;可以让子孙节点显式。

- 性能： displaynone : 修改元素会造成文档回流,读屏器不会读取display: none元素内容，性能消耗较大 visibility:hidden: 修改元素只会造成本元素的重绘,性能消耗较少读屏器读取visibility: hidden元素内容 opacity: 0 ： 修改元素会造成重绘，性能消耗较少

- 联系：它们都能让元素不可见



​	**css隐藏一个页面元素的方法？**

​	以上三种+z-index+text-index:-9999



#### CSS动画的样式优先级高于!important



