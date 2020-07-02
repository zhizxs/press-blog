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

- 生产环境删除console

试过很多插件，最后有效的还是 `babel-plugin-transform-remove-console`。

这个需要配置 `babel.config.js`文件。


```js

const plugins = [
  // .....
];

// 生产环境移除console
if (process.env.NODE_ENV === "prod") {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/app"],
  plugins: plugins
};
```


- 生产环境打包增加版本号
最初想添加的，最后想到jekins发布的时候，需要拉代码到服务上，打包修改文件，但是没有人提交的话，会导致下次拉代码的时候出现冲突。建议参照自己的发布方式使用。此处修改版本号的方式也是简单粗暴。

```javascript

// package.json
{
  // ...
  "version": "1.0.2",
  // ...
}

// vue.config.js
const path = require("path");
const fs = require("fs");
let version = "";

// ...

// 声明函数
const setPackageJsonVersion = () => {
  const pkgPath = path.join(__dirname, "./package.json");
  let pkg = fs.readFileSync(pkgPath);
  pkg = JSON.parse(pkg);
  let arr = pkg.version.split(".");
  arr[2] = parseInt(arr[2] || 0) + 1;
  version = arr.join(".");
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
};


// 使用
 chainWebpack: config => {
  // ...
  if (process.env.NODE_ENV === "prod") {
      config.plugin("define").tap(args => {
        setPackageJsonVersion();
        args[0]["process.env.VERSION"] = version;
        console.log("当前打包版本：", version);
        return args;
      });
    }
  // ...

 }


```


test git revert comid




