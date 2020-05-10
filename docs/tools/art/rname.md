## nodejs 批量命名文件

```js
"use strict"
let fs = require("fs")
let i = 0
let $ = "$"
let directory = process.argv[2] // 获取命令行参数
// let format = "test" + $ + "test";
let format = $
//setting area
function rename(fileName, formation) {
  if (!fileName) {
    console.log("请输入文件夹名称！")
    return
  }

  fs.readdir(fileName, function(err, data) {
    data.forEach(function(item) {
      i++
      let f
      let type = item.split(".")
      type = "." + type[type.length - 1]
      if (formation.length === 1) {
        f = i
      } else if (formation.startsWith("$")) {
        f = i + formation.split("$")[1]
      } else if (formation.endsWith("$")) {
        f = formation.split("$")[0] + i
      } else {
        let arr = formation.split("$")
        f = arr[0] + i + arr[1]
      }
      fs.rename(directory + "/" + item, directory + "/" + f + type, function(
        err
      ) {
        if (err) {
          throw err
        } else {
          console.log("done!")
        }
      })
    })
  })
}
rename(directory, format)
```
