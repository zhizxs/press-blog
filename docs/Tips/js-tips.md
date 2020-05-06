---
title: js-Tips
date: 2017-07-18
categories:
  - FrontEnd
tags:
  - javascript
  - tips

isShowComments: true
---

:::tip
TODO
:::

<!-- more -->

### 数组乱序

sort + Math.random()-0.5

### `charCodeAt 和 fromCharCode`

```js
// 判断缺少那个字母
function fearNotLetter(str) {
  //将字符串转为ASCII码，并存入数组
  let arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i))
  }
  for (let j = 1; j < arr.length; j++) {
    let num = arr[j] - arr[j - 1]
    //判断后一项减前一项是否为1，若不为1，则缺失该字符的前一项
    if (num != 1) {
      //将缺失字符ASCII转为字符并返回
      return String.fromCharCode(arr[j] - 1)
    }
  }
  return undefined
}
fearNotLetter("abce") // "d"
```

### axios 配置跨域问题

```js
// 基础配置 baseUrl
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'  //关键代码

// 配置代理
proxyTable: {
 '/api': {
   target:'http://api.douban.com/v2', // 你请求的第三方接口
   changeOrigin:true,
// 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
//这样服务端和服务端进行数据的交互就不会有跨域问题
   pathRewrite:{  // 路径重写，
    '^/api': ''
// 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX
//这个地址的时候直接写成/api即可。
   }
  }
}

/**
因为我们给url加上了前缀/api，我们访问/movie/top250就当于访问了：localhost:8080/api/movie/top250（其中localhost:8080是默认的IP和端口）。

在index.js中的proxyTable中拦截了/api,并把/api及其前面的所有替换成了target中的内容，因此实际访问Url是api.douban.com/v2/movie。
*/
```

### IE 下对文件进行操作

```js
// 该方法只能用于 IE 浏览器

// 获取文件夹下的文件名称 返回字符串
function getFloderFiles(path) {
  var fileObj = new ActiveXObject("Scripting.FileSystemObject") //文件操作对象
  var files = new Array()
  var f = fileObj.GetFolder(path)
  var s = ""
  var ff = new Enumerator(f.Files) //该目录下所有的文件集合
  for (; !ff.atEnd(); ff.moveNext()) {
    files[files.length] = ff.item() //把该目录下的所有文件路径都放在一个数组里.
    s += ff.item()
    s += ","
  }
  return s
}
// 删除文件夹下的文件
function deleteFiles(path) {
  console.log("执行删除！")
  var fileObj = new ActiveXObject("Scripting.FileSystemObject") //文件操作对象
  var files = new Array()
  var f = fileObj.GetFolder(path)
  var ff = new Enumerator(f.Files) //该目录下所有的文件集合
  for (; !ff.atEnd(); ff.moveNext()) {
    fileObj.DeleteFile(ff.item())
  }
}
// 新建文件夹
function createFloder(path) {
  console.log("执行文件夹新建！")
  var fileObj = new ActiveXObject("Scripting.FileSystemObject") //文件操作对象
  fileObj.CreateFolder(path)
}
// 判断文件夹有没有
function hasFloder(path) {
  var fileObj = new ActiveXObject("Scripting.FileSystemObject") //文件操作对象
  var has = !!fileObj.FolderExists(path)
  return has
}
```

### 文件上传进度

```js
// 关于文件上传获取进度

// 原生h5
var fileObj = document.getElementById("f").files[0]
//创建xhr
var xhr = new XMLHttpRequest()
var url = "upFile.ashx"
//FormData对象
var fd = new FormData()
fd.append("path", "D:\\") //上传路径
fd.append("file", fileObj)
fd.append("acttime", new Date().toString()) //本人喜欢在参数中添加时间戳，防止缓存（--、）
xhr.open("POST", url, true)
xhr.send(fd)
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var result = xhr.responseText
    document.getElementById("result").innerHTML = result
  }
}
//进度条部分
xhr.upload.onprogress = function(evt) {
  if (evt.lengthComputable) {
    var percentComplete = Math.round((evt.loaded * 100) / evt.total)
    document.getElementById("progress").value = percentComplete
    document.getElementById("progressNumber").style.width =
      percentComplete + "%"
  }
}

// jquery

$.ajax({
  url: url,
  type: "POST",
  xhr: xhrOnProgress(function(e) {
    var percent = e.loaded / e.total //计算百分比
  }),
})

// vue - axios

var config = {
  onUploadProgress: (progressEvent) => {
    var complete =
      (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%"
    this.progress = complete
  },
}
axios.post(`api/uploadFile`, form, config).then((res) => {
  if (res.data.status === "success") {
    console.log("上传成功")
  }
})

// 微信小程序

const uploadTask = wx.uploadFile({
  url: "http://example.weixin.qq.com/upload", //仅为示例，非真实的接口地址
  filePath: tempFilePaths[0],
  name: "file",
  formData: {
    user: "test",
  },
  success: function(res) {
    var data = res.data
    //do something
  },
})

uploadTask.onProgressUpdate((res) => {
  console.log("上传进度", res.progress)
  console.log("已经上传的数据长度", res.totalBytesSent)
  console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend)
})

uploadTask.abort() // 取消上传任务
```
