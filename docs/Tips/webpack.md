---
title: webpack-tips
date: 2020-04-18
categories:
  - tools
tags:
  - javascript
  - tips
  - webpack

isShowComments: true
---

:::tip
vue/cli3 中使用插件或者是 webpack 的钩子
:::

<!-- more -->

### 打包配置

> 项目需求：项目需要做自动化发布，需要打包生产 zip 文件。
> 服务器环境：centos + nginx
> 前端：vue/cli3

- 插件

  使用插件 `filemanager-webpack-plugin` 生成 zip 包

  // 下载插件

  ```bash
    npm install filemanager-webpack-plugin
  ```

- 文件配置

```js
// vue.config.js
const FileManagerPlugin = require("filemanager-webpack-plugin");
module.exports = {
  ...
  // !!! 注：在此处plugins中引入，在开发环境中会报错，需要区分环境操作 !!!
  configureWebpack: {
    output: {
      filename: `[name].${process.env.NODE_ENV}.${Timestamp}.js`,
      chunkFilename: `[name].${process.env.NODE_ENV}.${Timestamp}.js`
    }
    plugins: [
      new FileManagerPlugin({
        onEnd: {
          delete: ["*.zip"],
          archive: [{ source: "./" + filename, destination: "./" + filename + ".zip" }]
        }
      })
    ]
  }
  ...
}

// 解决以上问题，结合chainWebpack: config => {}来处理

module.exports = {
  ...
  chainWebpack: config => {
    config.resolve.alias.set("@style", resolve("src/assets/style"));
    config.resolve.alias.set("@components", resolve("src/components"));
    config.resolve.alias.set("@img", resolve("src/assets/img"));

    if (process.env.NODE_ENV !== "dev") {
      config.plugin("zip").use(FileManagerPlugin, [
        {
          onEnd: {
            delete: ["*.zip"],
            archive: [{ source: "./" + filename, destination: "./" + filename + ".zip" }]
          }
        }
      ]);
    }
  }
  ...
}

```

- webpack 钩子的使用

```js
configureWebpack: (config) => {
  if (process.env.NODE_ENV === "pre") {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap("aaaa", (compilation) => {
          // do something when webpack compilation done
          console.log("done")
        })
      },
    })
  } else {
    // 为开发环境修改配置...
  }
}
```
