---
title: 前端安全
date: 2019-11-11
categories:
  - FrontEnd
tags:
  - 前端安全

isShowComments: false
publish: false
---

:::tips

- XSS
- SCRF
- SSRF
  :::

<!-- more -->

## 前端安全

### XSS

> 跨站脚本攻击（Cross Site Script，XSS 攻击），通常指黑客通过“HTML 注入”篡改了网页，插入了恶意的脚本，从而在用户浏览网页时，控制用户浏览器的一种攻击。

###SQL

### CSRF

> CSRF（Cross-site request forgery 跨站请求伪造，也被称为“One Click Attack”或者 Session Riding，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。XSS 利用站点内的信任用户，而 CSRF 则通过伪装来自受信任用户的请求来利用受信任的网站。

主要是拿 cookie 伪造请求。

解法：

- 使用验证码
- 验证域名 Referer
- 使用 token

### SSRF

[1](https://juejin.im/post/5c137f37f265da6133567735)

[2](https://juejin.im/post/5ce55b3d5188253386140dd0)
