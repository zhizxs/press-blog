### 强制浏览器缓存



修改 `nginx.conf`配置文件

```
 location ~ .*\.(gif|jip|jpeg|png|bmp|swf)$
 {
 expires 15d;
 }
 location ~.*\.(js|css)?$
 {
 expires 15d;
 }
```



### 开启gzip压缩



```
    #开启gzip压缩
    gzip on;
    #http的协议版本
    gzip_http_version 1.0;
    #IE版本1-6不支持gzip压缩，关闭
    gzip_disable 'MSIE[1-6].';
    #需要压缩的文件格式 text/html默认会压缩，不用添加
    gzip_types text/css text/javascript application/javascript image/jpeg image/png image/gif;
    #设置压缩缓冲区大小，此处设置为4个8K内存作为压缩结果流缓存
    gzip_buffers 4 8k;
    #压缩文件最小大小
    gzip_min_length 1k;
    #压缩级别1-9
    gzip_comp_level 9;
    #给响应头加个vary，告知客户端能否缓存
    gzip_vary on;

```

