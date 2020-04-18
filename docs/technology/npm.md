---
title: npm
date: 2020-04-18
categories:
  - tools

tags:
  - npm
  - tools

isShowComments: true
---

**TODO**

<!-- more -->

## 多 npm 镜像切换

- 临时使用

```
npm --registry https://registry.npm.taobao.org install express
```

- 永久使用

```
npm config set registry https://registry.npm.taobao.org
```

- 安装版本管理工具

`npm install -g nrm`

- 切换

`nrm ls`

- 使用

```
nrm use taobao
Registry has been set to: http://registry.npm.taobao.org/
```

- 增加源

`nrm add <源名称> <源地址>`

- 删除源

```
nrm del
```

- 测速

```
nrm test
```
