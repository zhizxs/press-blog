---
title: nginx
date: 2020-02-18
categories:
  - tools

tags:
  - nginx
  - tools

isShowComments: true
---

:::tip

1. centos

<!-- more -->

## Centos7 安装 nginx

### gcc 安装

安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境，如果没有 gcc 环境，则需要安装：

`yum install gcc-c++`

### PCRE pcre-devel 安装

PCRE(Perl Compatible Regular Expressions) 是一个 Perl 库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库。nginx 也需要此库。命令：

`yum install -y pcre pcre-devel`

### zlib 安装

zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 Centos 上安装 zlib 库。

`yum install -y zlib zlib-devel`

### OpenSSL 安装

OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。
nginx 不仅支持 http 协议，还支持 https（即在 ssl 协议上传输 http），所以需要在 Centos 安装 OpenSSL 库。

yum install -y openssl openssl-devel

### 下载 nginx

`wget -c https://nginx.org/download/nginx-1.17.9.tar.gz`

### 安装

- 解压

```
tar -zxvf nginx-1.17.0.tar.gz
cd /usr/local/nginx-1.17.0/
```

- 使用默认配置

`./configure`

- 编译安装

```make
 make install
```

- 查找安装路径：

`whereis nginx`

- 启动、停止 nginx
  `cd /usr/local/nginx/sbin/`
  `./nginx`
  `./nginx -s stop` 此方式相当于先查出 nginx 进程 id 再使用 kill 命令强制杀掉进程。
  `./nginx -s quit` 此方式停止步骤是待 nginx 进程处理任务完毕进行停止。
  `./nginx -s reload`

- 查询 nginx 进程：

`ps aux|grep nginx`

- 启动或者停止

  1. 先停止再启动（推荐）：
     对 nginx 进行重启相当于先停止再启动，即先执行停止命令再执行启动命令。如下：

`./nginx -s quit`

./nginx 2.重新加载配置文件：

当 ngin x 的配置文件 nginx.conf 修改后，要想让配置生效需要重启 nginx，使用-s reload 不用先停止 ngin x 再启动 nginx 即可将配置信息在 nginx 中生效，如下：

`./nginx -s reload`

2. 开机自启动

即在 `rc.local` 增加启动代码就可以了。

`vi /etc/rc.local`
增加一行 `/usr/local/nginx/sbin/nginx`
设置执行权限：
`chmod 755 rc.local`

### 文件部署

- 安装支持 ZIP 的工具

`yum install -y unzip zip`

- 解压文件

`unzip 文件名.zip`

- **上传文件**
  `scp xx.name root@1.1.1.1:/root/nginx/xx.name`

- 移动文件

  格式：

  `mv 【选项】 源文件或目录 目标文件或目录`

  参数：

  -b ： 先备份在覆盖文件

  -f : force（强制），目标文件已经存在，不询问直接覆盖

  -i ： 目标文件已经存在时，先询问是否覆盖

  -u ： 目标文件已经存在，且 source 比较新，才会更新 update

  -t ： -target-directory=DIRECTORY move all SOURCE arguments into DIRECTORY，即指定 mv 的目标目录，该选项适用于移动多个源文件到一个目录的情况，此时目标目录在前，源文件在后。

* 把 d1 目录的中的 test.txt 移动到 n1 目录下面
  `mv /tmp/d1/test.txt /tmp/n1`

* 将文件 log1.txt,log2.txt,log3.txt 移动到目录 test3 中。

> 命令：

`mv log1.txt log2.txt log3.txt test3`
`mv -t /opt/soft/test/test4/ log1.txt log2.txt log3.txt`

> 说明：
> `mv log1.txt log2.txt log3.txt test3` 命令将 log1.txt ，log2.txt， log3.txt 三个文件移到 test3 目录中去
> `mv -t /opt/soft/test/test4/ log1.txt log2.txt log3.txt` 命令又将三个文件移动到 test4 目录中去

- 将文件 file1 改名为 file2，如果 file2 已经存在，则询问是否覆盖
  `mv -i log1.txt log2.txt`

- 将文件 file1 改名为 file2，即使 file2 存在，也是直接覆盖掉。
  `mv -f log3.txt log2.txt`

> 说明：
> log3.txt 的内容直接覆盖了 log2.txt 内容，-f 这是个危险的选项，使用的时候一定要保持头脑清晰，一般情况下最好不用加上它

- 目录的移动
  `mv dir1 dir2`

> 说明：
> 如果目录 dir2 不存在，将目录 dir1 改名为 dir2；否则，将 dir1 移动到 dir2 中。

- 移动当前文件夹下的所有文件到上一级目录
  `mv * ../`

- 把当前目录的一个子目录里的文件移动到另一个子目录里
  `mv test3/*.txt test5`

- 文件被覆盖前做简单备份，前面加参数-b
  `mv log1.txt -b log2.txt`

### nginx.conf

```
#user chenxq;
worker_processes 1;

#error_log logs/error.log;
#error_log logs/error.log notice;
#error_log logs/error.log info;

#pid logs/nginx.pid;

events {
worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;

    server {
        listen       80;
        server_name  zhiz.top;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html/blog;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}

        # 设置缓存

        location ~ .*\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm)$
        {
            root   html/blog;
            expires    7d;
        }

        location ~ .*\.(?:js|css)$
        {
            root   html/blog;
            expires   7d;
        }
    }
    server{
    	listen 80;
    	server_name test.zhiz.top;
    	location / {

    		root html/test;
    		index index.html index.htm;

    		add_header Access-Control-Allow-Origin *;

          add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
      }
    }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}

```
