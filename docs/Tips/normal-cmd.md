---
title: 常用操作指令
date: 2020-05-02
categories:
  - tips
tags:
  - cmd
  - git

isShowComments: false
---

:::tip

1. linux 对文件以及文件夹的操作
2. git 常规操作

:::

<!-- more -->

## linux 命令行

- 日常文件及文件夹操作
  cd dir_name // chage directory
  ls // list
  ls -l // 详情 ll
  ls -a // 查看隐藏
  ls -la //组合

- 移动文件夹，重名名
  mv a b //move 把 a 重命名为 b
  mv dirName1/a dirName2/ 移动，剪切

- 复制文件及文件夹
  cp dirName1/a dirName2/ // copy 同上夸目录
  cp -a a b //保留所有权限
  cp -r a b //针对文件夹，增加递归参数 -r
  cp -ra a b // 混合
  cp -rav a b //实时进度 -v

- 删除文件夹，文件
  rm a
  rm -f a // 不需要提示
  rm -rf a // 删除目录 递归参数 -r

- 新建文件
  touch a
  touch a b c d
  touch a.txt b.png c.pdf

- 新建文件夹
  mkdir a b c d
  mkdir -p res/st/scss //新建多层

- 查看文本文件
  less index.html
  more index.html
  q 退出
  ctrl f 下翻页
  ctrl b 上翻页

- 查看当前所在目录
  pwd

- 查看命令详情 man
  man cp

- 快捷键 shift + command + . 显示/隐藏文件夹

## git 相关

<img src="./imgs/git.png" />

### gitignore 文件的使用

需要与.git 文件放在同级目录下

- 忽略所有.so 结尾的文件
  \*.so
- 但 game.so 除外
  !game.so

- 仅仅忽略项目根目录下的 README.md 文件，不包括 subdir/README.md
  /README.md

- 忽略 .svn/ 目录下的所有文件
  .svn/

- 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
  doc/\*.txt

* 忽略 doc/ 目录下所有扩展名为 txt 的文件
  doc/\*_/_.txt

### 日常操作

- 创建一个项目添加到版本管理
  `git init git clone`
- 提交到暂存区

```bash
	git add -u/-A/./[file_name]/[dir]
	git rm [file1] [file2] ...  # 删除工作区文件，并且将这次删除放入暂存区
	git rm --cached [file]  # 停止追踪指定文件，但该文件会保留在工作区
	git mv [file-originname] [file-newname]  # 改名文件，并且将这个改名放入暂存区
```

- 提交到本地版本

```bash
	git commit -m [message]  # 提交暂存区到本地仓库
	git commit [file1] [file2] ... -m [message]  # 提交暂存区指定文件到本地仓库
	git commit -a  # 提交工作区自上次commit之后的变化，直接到本地仓库
	git commit -v  # 提交时显示所有diff信息
```

- 提交到远程版本

```bash
	git push [remote] [branch]  # 上传本地指定分支到远程仓库

	git push [remote] --force  # 强行推送当前分支到远程仓库，即使有冲突

	git push <远程主机名> <本地分支名>:<远程分支名> # 提交到远程指定分支

```

- 配置远程仓库

> 配置远程仓库 origin 是远程仓库的别名 代替 xxx.git 的地址

```bash
git remote add origin https://github.com/chenxqStyle/git_cmd_line.git
```

- 放弃工作区的修改(本地修改)

```bash
	git checkout .
	git checkout [file]
	git checkout [commit] [file]
```

- 已经 add，但是出错了(回归到工作区)

```bash
	git reset --hard HEAD # 直接回归到到未修改的状态
	git reset HEAD file # 回归到add之前的状态，依然保存了修改
```

- 撤销远程版本的提交（commont 或者 push）

  - 重置(上一个版本)

  `git reset HEAD^`

  - 修改并重新 commit 加上新的修改并提交

  `git commit -m "msg"`

  - 强制上传

  `git push --force`

- 查看近几次提交

      `git reflog`

- 查看分支

      `git branch  -ra`

- 创建分支

      `git branch [name]`

- 切换分支

  ```bash
  git checkout [name]
  git checkout -b [name]
  ```

- 删除分支

  `git branch -d [name]`

- 远程跟踪

  `git branch --track [branch] [remote-branch]`

- 拉取远程

  `git pull [remote] [branch]`

- 合并分支

```bash
	git merge [branch]  # 合并指定分支到当前分支
```

- 版本回滚

  ```bash
    git reset [hash]
  ```

- 储藏(会应用在任何分支上)

  ```bash
    git stash
    git stash list
    git stash apply --index
    git stash pop
    git stash drop
  ```
