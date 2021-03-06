---

title: 图片的选择
date: 2019-05-21
categories:
	- FrontEnd
tags:
- javascript
- 浏览器
- 缓存
- 优化

isShowComments: true
---

# 图片的优化 - 质量和性能的博弈

    一个网页，图片给用户的还是第一视觉的冲击。用户不在乎你后面的css/js 的加载情况，图片和文字是第一位的。所以，前端优化中图片的优先级可见一斑。

## 不同业务场景下的图片的要求

    时下应用较为广泛的 Web 图片格式有 JPEG/JPG、PNG、WebP、Base64、SVG 等。但是需要结合业务场景进行取舍。

## 二进制与色彩的关系

> 在计算机中，像素用二进制数来表示。不同的图片格式中像素与二进制位数之间的对应关系是不同的。一个像素对应的二进制位数越多，它可以表示的颜色种类就越多，成像效果也就越细腻，文件体积相应也会越大。

> 一个二进制位表示两种颜色（0|1 对应黑|白），如果一种图片格式对应的二进制位数有 n 个，那么它就可以呈现 2^n 种颜色。

## JPEG/JPG

- 关键字：有损压缩、体积小、加载快、不支持透明
- 优点：高质量的有损压缩。压缩比在 50%，但是图片质量能保持在 60%，质量损耗不易被肉眼察觉。JPG 格式以 24 位存储单个图，可以呈现多达 1600 万种颜色
- 场景：呈现大图,banner,电商轮播,背景图
- 缺点：处理矢量图形和 Logo 等线条感较强、颜色对比强烈的图像时，人为压缩导致的图片模糊会相当明显。不支持透明度处理。

## PNG-8 与 PNG-24

- 关键字：无损压缩、质量高、体积大、支持透明
- 优点：一种无损压缩的高保真的图片格式。8 和 24 位两种。更强的色彩表现力，对线条的处理更加细腻，对透明度有良好的支持。
- 场景：呈现小的 Logo、颜色简单且对比强烈的图片或背景等。
- 缺点：体积大。

- ？PNG-8 与 PNG-24 的选择题

      什么时候用 PNG-8，什么时候用 PNG-24，这是一个问题。

      理论上来说，当你追求最佳的显示效果、并且不在意文件体积大小时，是推荐使用 PNG-24 的。

      但实践当中，为了规避体积的问题，我们一般不用PNG去处理较复杂的图像。当我们遇到适合 PNG 的场景时，也会优先选择更为小巧的 PNG-8。

      如何确定一张图片是该用 PNG-8 还是 PNG-24 去呈现呢？好的做法是把图片先按照这两种格式分别输出，看 PNG-8 输出的结果是否会带来肉眼可见的质量损耗，并且确认这种损耗是否在我们（尤其是你的 UI 设计师）可接受的范围内，基于对比的结果去做判断。

## SVG

> SVG（可缩放矢量图形）是一种基于 XML 语法的图像格式。它和本文提及的其它图片种类有着本质的不同：SVG 对图像的处理不是基于像素点，而是是基于对图像的形状描述。

- 关键词：文本文件、体积小、不失真、兼容性好
- 优点：文件体积更小，可压缩性更强、无限放大不失真。
- 场景：代码直接引入，类似矢量图标。
- 缺点：仅形状描述，无多余色彩。

## Base64

- 关键字：文本文件、依赖编码、小图标解决方案

  Base64 并非一种图片格式，而是一种编码方式。Base64 和雪碧图一样，是作为小图标解决方案而存在的。

  Base64 是一种用于传输 8Bit 字节码的编码方式，通过对图片进行 Base64 编码，我们可以直接将编码结果写入 HTML 或者写入 CSS，从而减少 HTTP 请求的次数。

  Base64 编码后，图片大小会膨胀为原文件的 4/3（这是由 Base64 的编码原理决定的）。大图带来消耗较大，慎重考虑。

  在传输非常小的图片的时候，Base64 带来的文件体积膨胀、以及浏览器解析 Base64 的时间开销，与它节省掉的 HTTP 请求开销相比，可以忽略不计，这时候才能真正体现出它在性能方面的优势。

  使用场景考虑：

  - 图片的实际尺寸很小（没有超过 2kb 的）
  - 图片无法以雪碧图的形式与其它小图结合（合成雪碧图仍是主要的减少 HTTP 请求的途径，Base64 是雪碧图的补充）
  - 图片的更新频率非常低（不需我们重复编码和修改文件内容，维护成本较低）

- 推荐工具： - webpack url-loader

## WebP

- 关键词：年轻的全能型选手。
  Google 专为 Web 开发的一种旨在加快图片加载速度的图片格式，它支持有损压缩和无损压缩。

- 优点：色彩丰富，支持透明，支持动图。
  与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。 无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

- 局限性： - 兼容性。 - WebP 还会增加服务器的负担——和编码 JPG 文件相比，编码同样质量的 WebP 文件会占用更多的计算资源。

- 应用场景： - 前端做兼容性判断，对 url 地址进行处理 如返回 ：a.jpg\_.webp，前端切割。 - 服务器根据请求头进行预判，返回不同类型的图片。(维护性强)当 Accept 字段包含 image/webp 时，就返回 WebP 格式的图片，否则返回原图。

**图片处理工具：https://tinypng.com/**
