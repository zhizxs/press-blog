---
title: 问题
date: 2018-09-10
categories:
  - dev
tags:
  - Q&A&2020

publish: true
---

### mac 上的 SVN 今天突然间 不好使了 在进行 SVN 操作是报出警告信息

```bash
Error validating server certificate for 'https://xxxxxxx':443

 The certificate is not issued by a trusted authority. Use the
  fingerprint to validate the certificate manually!
 The certificate hostname does not match.
  Certificate information:
 Hostname: xxxxxxx
 Valid: xxxxxxx
 Issuer: xxxxxx
 Fingerprint: xxxxxxxxx
  (R)eject, accept (t)emporarily or accept (p)ermanently?

```

照理直接按 p 就可以让 svn 以后忽略这个问题了，但是很奇怪，即便选择了 p，下次操作时还是会提示同样的经过高，如果我只用命令操作问题
也不是太大，但是如果要用 xcode 进行代码的控制的话，就非常蛋疼了，简直没法用。

但是这也不是什么大问题，只要在`~/.subversion/servers` 中添加几行配置就轻松搞定了 具体操作如下：

1. 用命令打开 servers 配置文件：`open ~/.subversion/servers`

2. 在 servers 配置文件的末尾添加：

```js
ssl - ignore - host - mismatch = true
ssl - ignore - unknown - ca = true
ssl - ignore - invalid - date = true
```

3. 我是这样搞定的，你试试吧
