---
title: react
date: 2019-9-18
categories:
  - FrontEnd

tags:
  - react
  - frame

isShowComments: true
---

:::tip
初识 react ,然后就结束了...
:::

<!-- more -->

## 哲学

1. UI 划分组件层级 - 一个组件负责一个功能，更多功能需要拆分组件

2. 创建静态版本 - 正确的使用 props 和 state - 体会**单向数据流**
   - _props_ 是父组件向子组件传递数据的方式
   - state 代表了随时间会产生变化的数据，应当仅在实现交互时使用（静态模板用不到） - **私有自用**
   - 当你的应用比较简单时，使用自上而下的方式更方便；
   - 对于较为大型的项目来说，自下而上地构建，并同时为低层组件编写测试是更加简单的方式。
3. 确定 UI state 的最小（且完整）表示

   1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
   2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
   3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。

4. 确定 state 放置位置 - 哪个组件能够改变这些 state

   - 找到根据这个 state 进行渲染的所有组件。
   - 找到他们的共同所有者（common owner）组件（在组件层级上高于所有需要该 state 的组件）。
   - 该共同所有者组件或者比它层级更高的组件应该拥有该 state。
   - 如果你找不到一个合适的位置来存放该 state，就可以直接创建一个新的组件来存放该 state，并将这一新组件置于高于共同所有者组件层级的位置。

5. 添加反向数据流

   事件触发，自下而上。

   有一个命名规范，通常会将代表事件的监听 prop 命名为 `on[Event]`，将处理事件的监听方法命名为 `handle[Event]` 这样的格式。

## JSX

> 它具有 JavaScript 的全部功能。

- 因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。

- 防注入攻击 xss - React DOM 在渲染所有输入内容之前，默认会进行转义

## 元素渲染 - 区别组件

- 一起传入 `ReactDOM.render()`

- React 元素是[不可变对象](https://en.wikipedia.org/wiki/Immutable_object)。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。

- 在实践中，大多数 React 应用只会调用一次 `ReactDOM.render()`。

- React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期的状态。- 你可能重新 render 整个元素，但是 react 只会更新变化的部分。

- React 元素也可以是用户自定义的组件( function & class )

  - 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 “props”。

## 组件 & Props

> 组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。

- 接受入参 props ,返回展示 react 元素

- 函数组件和 class 组件

  function & class

- **组件名称必须以大写字母开头。**

- React 会将以小写字母开头的组件视为原生 DOM 标签。

- 建议从组件自身的角度命名 props，而不是依赖于调用组件的上下文命名

- props 的只读性

  - 组件无论是使用[函数声明还是通过 class 声明](https://react.docschina.org/docs/components-and-props.html#function-and-class-components)，都决不能修改自身的 props。

  - **所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。**

## state & 生命周期

- Class 组件应该始终使用 `props` 参数来调用父类的构造函数。

  ```js
   constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  ```

- 将生命周期方法添加到 class 中

  - 当组件被销毁时释放所占用的资源是非常重要的
  - 挂载（mount）- 组件第一次被渲染到 DOM 中的时候
  - 卸载（unmount）- 组件被删除的时候
  - `componentDidMount()` 方法会在组件已经被渲染到 DOM 中后运行
  - `componentWillUnmount()` 卸载

- 正确使用 state

  - **不要直接修改 state**

    - ```
      this.setState({comment: 'Hello'});
      ```

    - 构造函数是唯一可以给 `this.state` 赋值的地方

  - **state 更新可能是异步的**

    - 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。

    - `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

      ```js
      // Wrong
      this.setState({
        counter: this.state.counter + this.props.increment,
      })
      ```

      > 要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

      ```js
      // Correct
      this.setState((state, props) => ({
        counter: state.counter + props.increment,
      }))
      ```

  - state 更新会被合并

- 当你调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 state。

  - 数据流 - 自上而下 - state 派生的任何数据或 UI 只能影响树中“低于”它们的组件

## 事件处理
