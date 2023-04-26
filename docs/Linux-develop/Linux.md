---
title: Linux 基础
date: 2023/02/15
---



# Linux 

## **文件管理**

> d rwx rwx rwx. 2 root root    34 6月  21 16:47 aslic
>
> 1. 类型  d: 文件夹  -: 文件  l: 软连接
> 2. 权限  所有者  所属组  其他人
> 3. 文件大小
> 4. 创建时间
> 5. 文件名

![image-20220622092610669](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220622092610669.png)

## 配置全路径名

![image-20220627105046702](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220627105046702.png)

* 在 etc 目录下的 profile 文件下修改

> 配置全路径名:
>
> * export PS1='[\u@\h $PWD]\$'
>
> export JAVA_HOME=/root/jdk8
> export PATH=$JAVA_HOME/bin:$PATH

## Linux 系统 固定 - IP 

进入 网络配置文件

> /etc/sysconfig/network-scripts

![image-20220715140917720](https://gitee.com/LuisApai/Apai_image_MD/raw/master/image-20220715140917720.png)

修改为: 

```java
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="a83c1999-f7ee-4517-848a-071a0a1bb834"
DEVICE="ens33"
ONBOOT="yes"
BROADCAST=192.168.1.255
IPADDR=192.168.174.130  // 静态的 IP 地址
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
```

刷新配置 重新使用静态ip连接

> service network restart



# Linux 文件与目录管理

- **绝对路径：**
  路径的写法，由根目录 **/** 写起，

  > 例如： /usr/share/doc 这个目录。

- **相对路径：**
  路径的写法，不是由 **/** 写起，

  > 例如由 /usr/share/doc 要到 /usr/share/man 底下时，可以写成： **cd ../man** 这就是相对路径的写法。

## 处理目录的常用命令

### ls (列出目录)

> ls（英文全拼：list files）: 列出目录及文件名

语法：

```
[root@www ~]# ls [-aAdfFhilnrRSt] 目录名称
[root@www ~]# ls [--color={never,auto,always}] 目录名称
[root@www ~]# ls [--full-time] 目录名称
```

选项与参数：

- -a ：全部的文件，连同隐藏文件( 开头为 . 的文件) 一起列出来(常用)
- -d ：仅列出目录本身，而不是列出目录内的文件数据(常用)
- -l ：长数据串列出，包含文件的属性与权限等等数据；(常用)

将家目录下的所有文件列出来(含属性与隐藏档)

```
[root@www ~]# ls -al ~
```



### cd (切换目录)

> cd  是Change Directory的缩写，这是用来变换工作目录的命令。

语法：

```linux
// cd [相对路径或绝对路径]
#使用 mkdir 命令创建 runoob 目录
[root@www ~]# mkdir runoob

#使用绝对路径切换到 runoob 目录
[root@www ~]# cd /root/runoob/

#使用相对路径切换到 runoob 目录
[root@www ~]# cd ./runoob/

# 表示回到自己的家目录，亦即是 /root 这个目录
[root@www runoob]# cd ~

# 表示去到目前的上一级目录，亦即是 /root 的上一级目录的意思；
[root@www ~]# cd ..
```



### pwd (显示目前所在的目录)

> pwd 是 **Print Working Directory** 的缩写，也就是显示目前所在目录的命令。

```
[root@www ~]# pwd [-P]
```

选项与参数：

- **-P** ：显示出确实的路径，而非使用连结 (link) 路径。

实例：单纯显示出目前的工作目录：

```
[root@www ~]# pwd
/root   <== 显示出目录啦～
```

实例显示出实际的工作目录，而非连结档本身的目录名而已。

```
[root@www ~]# cd /var/mail   <== 注意，/var/mail是一个连结档
[root@www mail]# pwd
/var/mail         <==列出目前的工作目录
[root@www mail]# pwd -P
/var/spool/mail   <==怎么回事？有没有加 -P 差很多～
[root@www mail]# ls -ld /var/mail
lrwxrwxrwx 1 root root 10 Sep  4 17:54 /var/mail -> spool/mail
# 看到这里应该知道为啥了吧？因为 /var/mail 是连结档，连结到 /var/spool/mail 
# 所以，加上 pwd -P 的选项后，会不以连结档的数据显示，而是显示正确的完整路径啊！
```



### mkdir (创建新目录)

> mkdir (make directory)  创建新的目录

语法：

```
mkdir [-mp] 目录名称
```

选项与参数：

- -m ：配置文件的权限喔！直接配置，不需要看默认权限 (umask) 的脸色～
- -p ：帮助你直接将所需要的目录(包含上一级目录)递归创建起来！

实例：请到/tmp底下尝试创建数个新目录看看：

```
[root@www ~]# cd /tmp
[root@www tmp]# mkdir test    <==创建一名为 test 的新目录
[root@www tmp]# mkdir test1/test2/test3/test4
mkdir: cannot create directory `test1/test2/test3/test4': 
No such file or directory       <== 没办法直接创建此目录啊！
[root@www tmp]# mkdir -p test1/test2/test3/test4
```

加了这个 -p 的选项，可以自行帮你创建多层目录！

实例：创建权限为 **rwx--x--x** 的目录。

```
[root@www tmp]# mkdir -m 711 test2
[root@www tmp]# ls -l
drwxr-xr-x  3 root  root 4096 Jul 18 12:50 test
drwxr-xr-x  3 root  root 4096 Jul 18 12:53 test1
drwx--x--x  2 root  root 4096 Jul 18 12:54 test2
```

上面的权限部分，如果没有加上 -m 来强制配置属性，系统会使用默认属性。

如果我们使用 -m ，如上例我们给予 -m 711 来给予新的目录 drwx--x--x 的权限。



### touch (创建新文件)

> touch   创建新的文件

语法：

```
// touch 文件名
touch test.txt
```



### rmdir (删除空的目录)

语法：

```
 rmdir [-p] 目录名称
```

选项与参数：

- **-p ：**从该目录起，一次删除多级空目录

删除 runoob 目录

```
[root@www tmp]# rmdir runoob/
```

将 mkdir 实例中创建的目录(/tmp 底下)删除掉！

```
[root@www tmp]# ls -l   <==看看有多少目录存在？
drwxr-xr-x  3 root  root 4096 Jul 18 12:50 test
drwxr-xr-x  3 root  root 4096 Jul 18 12:53 test1
drwx--x--x  2 root  root 4096 Jul 18 12:54 test2
[root@www tmp]# rmdir test   <==可直接删除掉，没问题
[root@www tmp]# rmdir test1  <==因为尚有内容，所以无法删除！
rmdir: `test1': Directory not empty
[root@www tmp]# rmdir -p test1/test2/test3/test4
[root@www tmp]# ls -l        <==您看看，底下的输出中test与test1不见了！
drwx--x--x  2 root  root 4096 Jul 18 12:54 test2
```

利用 -p 这个选项，立刻就可以将 test1/test2/test3/test4 一次删除。

不过要注意的是，这个 rmdir 仅能删除空的目录，你可以使用 rm 命令来删除非空目录。



### cp (复制文件或目录)

> cp 即拷贝文件和目录。
>

语法:

```
[root@www ~]# cp [-adfilprsu] 来源档(source) 目标档(destination)
[root@www ~]# cp [options] source1 source2 source3 .... directory
```

选项与参数：

- **-a：**相当於 -pdr 的意思，至於 pdr 请参考下列说明；(常用)
- **-d：**若来源档为连结档的属性(link file)，则复制连结档属性而非文件本身；
- **-f：**为强制(force)的意思，若目标文件已经存在且无法开启，则移除后再尝试一次；
- **-i：**若目标档(destination)已经存在时，在覆盖时会先询问动作的进行(常用)
- **-l：**进行硬式连结(hard link)的连结档创建，而非复制文件本身；
- **-p：**连同文件的属性一起复制过去，而非使用默认属性(备份常用)；
- **-r：**递归持续复制，用於目录的复制行为；(常用)
- **-s：**复制成为符号连结档 (symbolic link)，亦即『捷径』文件；
- **-u：**若 destination 比 source 旧才升级 destination ！

用 root 身份，将 root 目录下的 .bashrc 复制到 /tmp 下，并命名为 bashrc

```
[root@www ~]# cp ~/.bashrc /tmp/bashrc
[root@www ~]# cp -i ~/.bashrc /tmp/bashrc
cp: overwrite `/tmp/bashrc'? n  <==n不覆盖，y为覆盖
```



### rm (移除文件或目录)

语法：

```
 rm [-fir] 文件或目录
```

选项与参数：

- -f ：就是 force 的意思，忽略不存在的文件，不会出现警告信息；
- -i ：互动模式，在删除前会询问使用者是否动作
- -r ：递归删除啊！最常用在目录的删除了！这是非常危险的选项！！！
- -rf 组合使用

将刚刚在 cp 的实例中创建的 bashrc 删除掉！

```
[root@www tmp]# rm -i bashrc
rm: remove regular file `bashrc'? y
```

如果加上 -i 的选项就会主动询问喔，避免你删除到错误的档名！



### mv (移动文件与目录，或修改名称)

语法：

```
[root@www ~]# mv [-fiu] source destination
[root@www ~]# mv [options] source1 source2 source3 .... directory
```

选项与参数：

- -f ：force 强制的意思，如果目标文件已经存在，不会询问而直接覆盖；
- -i ：若目标文件 (destination) 已经存在时，就会询问是否覆盖！
- -u ：若目标文件已经存在，且 source 比较新，才会升级 (update)

复制一文件，创建一目录，将文件移动到目录中

```
[root@www ~]# cd /tmp
[root@www tmp]# cp ~/.bashrc bashrc
[root@www tmp]# mkdir mvtest
[root@www tmp]# mv bashrc mvtest
```

将某个文件移动到某个目录去，就是这样做！

将刚刚的目录名称更名为 mvtest2

```
[root@www tmp]# mv mvtest mvtest2
```



## Linux 文件内容查看

Linux系统中使用以下命令来查看文件的内容：

- cat 由第一行开始显示文件内容
- tac 从最后一行开始显示，可以看出 tac 是 cat 的倒着写！
- nl  显示的时候，顺道输出行号！
- more 一页一页的显示文件内容
- less 与 more 类似，但是比 more 更好的是，他可以往前翻页！
- head 只看头几行
- tail 只看尾巴几行

你可以使用 *man [命令]*来查看各个命令的使用文档，如 ：man cp。

### cat (由第一行开始显示文件内容)

语法：

```
cat [-AbEnTv]
```

选项与参数：

- -A ：相当於 -vET 的整合选项，可列出一些特殊字符而不是空白而已；
- -b ：列出行号，仅针对非空白行做行号显示，空白行不标行号！
- -E ：将结尾的断行字节 $ 显示出来；
- -n ：列印出行号，连同空白行也会有行号，与 -b 的选项不同；
- -T ：将 [tab] 按键以 ^I 显示出来；
- -v ：列出一些看不出来的特殊字符

检看 /etc/issue 这个文件的内容：

```
[root@www ~]# cat /etc/issue
CentOS release 6.4 (Final)
Kernel \r on an \m
```

### tac (最后一行开始显示)

tac与cat命令刚好相反，文件内容从最后一行开始显示，可以看出 tac 是 cat 的倒着写！如：

```
[root@www ~]# tac /etc/issue

Kernel \r on an \m
CentOS release 6.4 (Final)
```

### nl

显示行号

语法：

```
nl [-bnw] 文件
```

选项与参数：

- -b ：指定行号指定的方式，主要有两种：
  -b a ：表示不论是否为空行，也同样列出行号(类似 cat -n)；
  -b t ：如果有空行，空的那一行不要列出行号(默认值)；
- -n ：列出行号表示的方法，主要有三种：
  -n ln ：行号在荧幕的最左方显示；
  -n rn ：行号在自己栏位的最右方显示，且不加 0 ；
  -n rz ：行号在自己栏位的最右方显示，且加 0 ；
- -w ：行号栏位的占用的位数。

实例一：用 nl 列出 /etc/issue 的内容

```
[root@www ~]# nl /etc/issue
     1  CentOS release 6.4 (Final)
     2  Kernel \r on an \m
```

### more(翻页)

一页一页翻动

```
[root@www ~]# more /etc/man_db.config 
#
# Generated automatically from man.conf.in by the
# configure script.
#
# man.conf from man-1.6d
....(中间省略)....
--More--(28%)  <== 重点在这一行喔！你的光标也会在这里等待你的命令
```

在 more 这个程序的运行过程中，你有几个按键可以按的：

- 空白键 (space)：代表向下翻一页；
- Enter     ：代表向下翻『一行』；
- /字串     ：代表在这个显示的内容当中，向下搜寻『字串』这个关键字；
- :f      ：立刻显示出档名以及目前显示的行数；
- q       ：代表立刻离开 more ，不再显示该文件内容。
- b 或 [ctrl]-b ：代表往回翻页，不过这动作只对文件有用，对管线无用。

### less (滚动查看)

一页一页翻动，以下实例输出/etc/man.config文件的内容：

```
[root@www ~]# less /etc/man.config
#
# Generated automatically from man.conf.in by the
# configure script.
#
# man.conf from man-1.6d
....(中间省略)....
:   <== 这里可以等待你输入命令！
```

less运行时可以输入的命令有：

- 空白键  ：向下翻动一页；
- [pagedown]：向下翻动一页；
- [pageup] ：向上翻动一页；
- /字串   ：向下搜寻『字串』的功能；
- ?字串   ：向上搜寻『字串』的功能；
- n     ：重复前一个搜寻 (与 / 或 ? 有关！)
- N     ：反向的重复前一个搜寻 (与 / 或 ? 有关！)
- q     ：离开 less 这个程序；

### head

取出文件前面几行

语法：

```
head [-n number] 文件 
```

选项与参数：

- -n ：后面接数字，代表显示几行的意思

```
[root@www ~]# head /etc/man.config
```

默认的情况中，显示前面 10 行！若要显示前 20 行，就得要这样：

```
[root@www ~]# head -n 20 /etc/man.config
```

### tail

> 取出文件后面几行

语法：

```
tail [-n number] 文件 
```

选项与参数：

- -n ：后面接数字，代表显示几行的意思
- -f ：表示持续侦测后面所接的档名，要等到按下[ctrl]-c才会结束tail的侦测

```
[root@www ~]# tail /etc/man.config
# 默认的情况中，显示最后的十行！若要显示最后的 20 行，就得要这样：
[root@www ~]# tail -n 20 /etc/man.config
```



## Linux 功能类命令

### ln 链接命令

> 硬链接 - 相对于复制但是能够继承其所有属性
>
> 拷贝cp -p + 同步更新
>
> 可通过i节点识别
>
> 不能跨分区
>
> 不能针对目录使用

> 软连接
>
> 软链接文件权限都为rwxrwxrwx
>
> 文件大小-只是符号链接
>
> /tmp/issue.soft -> /etc/issue 箭头指向原文件 

语法

```
 ln [参数][源文件或目录][目标文件或目录]
 ln wuwei.txt wuwu.txt
 ln -s  wuwei.txt wuwuss.txt
 硬链接和软连接不是根据文件的扩展名规定的，加了-s就是软连接，否则就是硬连接  
```



### chmod 权限管理命令

> 功能描述：改变文件或目录权限 

**语法：**

**chmod [{ugoa}{+-=}{rwx}] [文件或目录]  如:  chmod g+w aslic**

**chmod  [mode=421 ] [文件或目录]  如:  chmod 141 aslic**

**chmod  -R [mode=421 ] [文件或目录]如:  chmod -R 141 aslic**

| 代表字符 | 数字 | 权限     | 对文件的含义      | 对目录的含义                |
| :------: | :--: | -------- | ----------------- | --------------------------- |
|    r     |  4   | 读权限   | 可以查看文件 内容 | 可以列出目录中 的内容       |
|    w     |  2   | 写权限   | 可以修改文件 内容 | 可以在目录中创 建、删除文件 |
|    x     |  1   | 执行权限 | 可以执行文件      | 可以进入目录                |



### find  文件搜索命令

> 功能描述：文件或者文件夹搜索
>

**语法：find [搜索范围 - 目录路径] [匹配条件]**

选项:  

* 条件类型:  -name 名称  -type 类型 (  p -> ,目录 / f -> 文件  )   -size 大小   

  -group 所属组查找   -cmin -5 查询5分钟内被修改过属性的文件和目录

* 通配符:  ? -> 占位符(一个字符)    * -> 多个匹配

* -iname 不区分大小写

* 大小对比:  +n  大于   -n  小于    n  等于

* 与 或:  -a 两个条件同时满足 and          -o 两个条件满足任意一个即可 or

* -exec/-ok 命令 {} \; 对搜索结果执行操作

案例:

```java
// 查询 apai目录下的 包含wu的 且类型为目录
find /apai -name wu* -a -type f
// 查询 根目录下的 大小大于204800 的文件
find / -size +204800
// 在根目录下查找所有者为zhangsan的文件
find /home -user zhangsan
// 在/etc下查找5分钟内被修改过属性的文件和目录
find /etc -cmin -5
// 在/etc下查找inittab文件并显示其详细信息 -exec/-ok 命令 {} \; 对搜索结果执行操作
find / -name mengni -exec rm -rf { } \
```



### grep 文件内容搜索命令

> 在文件中搜寻字串匹配的行并输出
>

语法：grep  [指定字串] [文件]  

- -i 不区分大小写
- -v 排除指定字串

案例

```java
// 在 cs.txt 文件的内容里搜索包含 is 字符串且 -i 不区分大小写 
grep -i is cs.txt
// 在 cs.txt 文件的内容里搜索不包含 is 字符串且 -i 不区分大小写 
grep -iv is cs.txt
// 从install.log文中找mysql
grep mysql /root/install.log  
// 把文件inittab每行的开头#去掉 如果不加^ 那么有可能去掉的是内容中间的#
grep -v ^# /etc/inittab
```





## tar 压缩解压命令

> tar这个命令既可以打包压缩也可以解压
>
> 注意规范: 打包文件后缀 .tar 压缩文件后缀 .tar.gz

选项: 

* -c  create   打包 

- -x  解包 extract
- -v  显示详细信息
- -f  指定解压文件
- -z  解压缩

**1）tar给一个文件或者一个目录打包**
   tar  -cvf   包名   源文件名

**2）tar给一个打了包的文件解包**
   tar  -xvf  包名    注意：默认是解到当前目录，也可以指定到其他的目录
   tar  -xvf  包名 -C  目录名

**3）tar给一个文件打包并压缩**
   tar  -zcvf   压缩名   源文件名

**4）tar给一个文件解压缩**
   tar -zxvf 压缩名 -C 目录名



## 网络命令

### ping 测试网络连通性

> 测试网络连通性
>

**语法：ping 选项 IP地址**

```
范例： # ping 192.168.1.156

ping -c 3 192.168.1.156服务器回应3次即可，默认一直回应
```



### netstat  网络相关信息

> 显示网络相关信息
>
> yum install net-tools      

语法：netstat  [选项]

选项：  netstat -tlnp

- -t  TCP协议 三次握手 网络传输协议 打电话类似
- -u  UDP协议 数据包协议   丢包率高，不握手
- -l   lisenter 监听
- -r   route 
- -n  number 显示ip和端口号

> 当前是tcp协议 
>
> 第一个0表示网络通畅，接受的数据包队列 没有挤压
>
> 第二个0表示发送的数据包队列，网络通畅
>
> 0.0.0.0 本地的ip地址 111 表示端口
>
> Stat 表示TCP的监听  UDP没有监听的 注意
>
> 这条信息，表示当前有一台主机192.168.58.1正在连接到 linux192.168.58.128上 端口是22, ESTABLISHED连接
>
> 注意：自己电脑的端口是系统随机分配，不一定也要是22
>
> \# netstat -rn
>
> 显示route路由信息  n：numberic



### ifconfig  查看和设置网卡信息

> 查看和设置网卡信息

语法：ifconfig 网卡名称  IP地址

- 范例：# ifconfig eth0 192.168.8.250

- 范例：# ifconfig -a #查看所有网卡



### last  登入系统的用户信息

> 列出目前与过去登入系统的用户信息

语法：last



### traceroute 数据包到主机的路径

> 显示数据包到主机间的路径

语法：traceroute

```
范例：# traceroute www.lampbrother.net
   	 # traceroute www.sina.com.cn
访问新浪官网所经过的路由信息ip以及所花费的时间，如果时间长，
表示在某一块路由服务有问题，或者断掉，通过这个命令可以看在哪一块出了问题
```



## 用户管理命令

### su 切换用户

语法：su - 用户名



### useradd   添加新用户

> 添加新用户

语法：useradd 用户名



### passwd  设置用户密码

> 设置用户密码

语法：passwd 用户名



### w 查看登录用户详细信息

> 查看登录用户详细信息

语法：w

![image-20220621223236948](https://gitee.com/LuisApai/Apai_image_MD/raw/master/image-20220621223236948.png)

- up表示linux连续运行的时间 
- load average 系统的负载情况
- what 表示一个用户当前执行了什么操作，如果什么操作都没有做 就是base 
- JCPU、PCPU占用CPU资源的情况



### userdel  删除帐号

语法:   userdel 选项 用户名

常用的选项是 **-r**，它的作用是把用户的主目录一起删除。



### usermod 修改帐号

修改用户账号就是根据实际情况更改用户的有关属性，如用户号、主目录、用户组、登录Shell等。

修改已有用户的信息使用`usermod`命令，其格式如下：

```
usermod 选项 用户名
```

常用的选项包括`-c, -d, -m, -g, -G, -s, -u以及-o等`，这些选项的意义与`useradd`命令中的选项一样，可以为用户指定新的资源值。

另外，有些系统可以使用选项：-l 新用户名

这个选项指定一个新的账号，即将原来的用户名改为新的用户名。

例如：

```
# usermod -s /bin/ksh -d /home/z –g developer sam
```

此命令将用户sam的登录Shell修改为ksh，主目录改为/home/z，用户组改为developer。



## 挂载命令

> 相当于在linux分配一个盘符，把U盘等等的外部设备内容和该盘符（这个盘符是一个目录，在windows里是一个盘符如：H盘，i盘）连接

**挂载语法**: mount  名字  挂载位置

> U盘: /dev/sdb   光驱: /dev/sr0   

> 如: 将U盘挂载至 mnut下的aa文件夹   mount  /dev/sdb  /mnt/aa

**取消挂载** :  umount /dev/sr0

步骤: 

* 在根目录下mnt目录,一般习惯上在这个目录里面再创建一个目录用来挂载,
* 在根目录dev目录下可查询对应的设备

```
注意1：在根目录下有一个mnt目录，这个目录就是用来做挂载的（相当盘符），一般习惯上在这个目录里面再创建一个目录cdrom,相当创建一个盘符
注意2：设备文件名 dev/sr0 就是光驱硬件 在centos6以上的版本，光驱的设备文件名默认就是dev/sr0 ,也可以写成  dev/cdrom
注意2：在取消挂载时不能在挂载目录里取消

因为在dev目录里面的cdrom就是一个软连接，指向的就是sr0
[zhangsan@localhost ~]$ ls -ld /dev/cdrom
lrwxrwxrwx. 1 root root 3 10月 28 00:02 /dev/cdrom -> sr0
挂载点就是盘符
挂载成功，就是盘符和设备硬件建立了连接
```



## 关机重启命令

### shutdown命令

语法:  shutdown [选项] 时间

选项： shutdown 会保存内容再关机

-c： 取消前一个关机命令  cancel

-h： 关机   halt 停止的含义

-r： 重启   reboot 

> [root@localhost ~]#shutdown -h 20:30  晚上八点半关机
>
> [root@localhost ~]#shutdown -h now    立刻关机 h:halted 停下来
>
> [root@localhost ~]#shutdown -c              取消关机
>
> [root@localhost cdrom]# shutdown  -r now
>
> 直接拔掉电源：对于高速运转的硬盘 导致损坏

**其他关机命令**

- [root@localhost ~]# halt
- [root@localhost ~]# poweroff
- [root@localhost ~]# init 0

**其他重启命令**

- root@localhost ~]# reboot
- [root@localhost ~]# init 6

**系统运行级别**

- 0 关机
- 1 单用户 类似windows开启的安全模式进入，就是启动 最小的服务 进入window操作系统，因为其他的服务导致window无法启动
- 2 不完全多用户不含NFS服务（network file system 它就是2个系统之间共享文件的一个服务）
- 3 完全多用户：完全的命令行  
- 4 未分配
- 5  图形界面
- 6 重启



## dos文本和unix格式转换

### dos2unix  转linux

作用：dos2unix命令：用来将DOS格式的文本文件转换成UNIX格式

语法：dos2unix 文件名

### unix2dos  转window

作用：unix2dos命令：用来将unix格式的文本文件转换成dos格式

语法：unix2dos 文件名



## 系统类命令

### 1、查看linux系统是多少位

[oracle@localhost database]$ getconf LONG_BIT

### 2、Linux查看操作系统内核信息

[oracle@localhost database]$ uname -a

[oracle@localhost database]$ uname -r

### 3、Linux查看操作系统版本信息

> 查看当前操作系统版本信息

[oracle@localhost database]$ cat /proc/version

## wget 命令下载

> wget是Linux中的一个下载文件的工具，wget是在Linux下开发的开放源代码的软件，wget工具体积小但功能完善，它支持断点下载功能，同时支持FTP和HTTP下载方式，支持代理服务器和设置起来方便简单
>
> [root@network test]# yum install -y wget

### 下载保存当前目录

* 语法: wget 下载地址 

> 从网络下载一个文件并保存在当前目录
>
> [root@network test]#wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-utils-2.17-55.el6.x86_64.rpm

### 下载重命名保存当前目录

* 语法: wget -O 下载名字 下载地址 

> 使用 wget -O 下载并以不同的文件名保存 
>
> [root@network test]#wget -O copr-be.rpm 
>
> http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-utils-2.17-55.el6.x86_64.rpm

### 断点下载

* 语法: wget -c 下载地址 

> 使用 wget -c 断点续传 
>
> 使用wget -c重新启动下载中断的文件:对于我们下载大文件时突然由于网络等原因中断非常有帮助，我们可以继续接着下载而不是重新下载一个文件
>
> [root@network test]#wget -c https://cn.wordpress.org/wordpress-4.9.4-zh_CN.tar.gz

### 后台下载

* 语法: wget -b 下载地址 

> 使用 wget -b 后台下载
>
> [root@network test]#wget -b https://cn.wordpress.org/wordpress-4.9.4-zh_CN.tar.gz



## 后台运行jar包

> 能够将web项目打包成的jar包放入Linxu系统并运行 使用其ip地址和端口访问程序

语法一:  

java -jar XXX.jar &

nohup java -jar XXX.jar &  

* 常规语法 运行指定jar包 注意是在前台运行 关闭会话即停止 会将日志存储至   nohup.out   文件内

语法二:  

 java -jar XXX.jar --server.port=8081 > demo.out &

 nohup java -jar XXX.jar --server.port=8081 > demo.out &

* 设置访问端口 8081  和 日志的存储文件 demo.out



##  防火墙 端口

https://blog.csdn.net/wade3015/article/details/90725871

> 开启指定端口 报错执行如下指令
>
> systemctl status firewalld

1、查看已经开放的端口

firewall-cmd --list-ports

2、开启指定端口

firewall-cmd --zone=public --add-port=8080/tcp --permanent   

说明：参数--permanent永久生效，没有此参数重启后失效

2、重启防火墙

firewall-cmd --reload

3、查询指定端口是否已开



4.临时关闭防火墙

systemctl stop  firewalld.service



5.关闭端口

kill -9  PID  



6.开启防火墙：systemctl start firewalld



## 查看linux运行的进程

**语法**:  ps -ef



## 管道符  |

> 可以连接两个命令  就是前一个命令的输出作为后一个命令的输入

语法:   ps -ef | grep xxx 

* 在linux运行的进程里 查询包含xxx的选项



# vim -- 文本编辑器

> Vim 是从 vi 发展出来的一个文本编辑器。代码补全、编译及错误跳转等方便编程的功能特别丰富，在程序员中被广泛使用。vim 的官方网站 (https://www.vim.org/) 
>

## vi/vim 的使用

基本上 vi/vim 共分为三种模式，分别是**命令模式（Command mode）**，**输入模式（Insert mode）**和**底线命令模式（Last line mode）**。 这三种模式的作用分别是：

下载:   yum -y install vim

### 命令模式：

用户刚刚启动 vi/vim，便进入了命令模式。

此状态下敲击键盘动作会被Vim识别为命令，而非输入字符。比如我们此时按下i，并不会输入一个字符，i被当作了一个命令。

以下是常用的几个命令：

- **i** 切换到输入模式，以输入字符。
- **x** 删除当前光标所在处的字符。
- **:** 切换到底线命令模式，以在最底一行输入命令。

若想要编辑文本：启动Vim，进入了命令模式，按下i，切换到输入模式。

命令模式只有一些最基本的命令，因此仍要依靠底线命令模式输入更多命令。

### 输入模式

在命令模式下按下i就进入了输入模式。

在输入模式中，可以使用以下按键：

- **字符按键以及Shift组合**，输入字符
- **ENTER**，回车键，换行
- **BACK SPACE**，退格键，删除光标前一个字符
- **DEL**，删除键，删除光标后一个字符
- **方向键**，在文本中移动光标
- **HOME**/**END**，移动光标到行首/行尾
- **Page Up**/**Page Down**，上/下翻页
- **Insert**，切换光标为输入/替换模式，光标将变成竖线/下划线
- **ESC**，退出输入模式，切换到命令模式

### 底线命令模式

在命令模式下按下:（英文冒号）就进入了底线命令模式。

底线命令模式可以输入单个或多个字符的命令，可用的命令非常多。

在底线命令模式中，基本的命令有（已经省略了冒号）：

- q 退出程序
- w 保存文件

按ESC键可随时退出底线命令模式。

![image-20220622153611874](https://gitee.com/LuisApai/Apai_image_MD/raw/master/image-20220622153611874.png)



## 文件编辑命令

### 插入命令

| 命令  | 作用                 |
| ----- | -------------------- |
| **a** | 在光标所在字符后插入 |
| A     | 在光标所在行尾插入   |
| **i** | 在光标所在字符前插入 |
| I     | 在光标所在行行首插入 |
| **o** | 在光标下插入新行     |
| O     | 在光标上插入新行     |

### 定位命令 

| 命令       | 作用                  |
| ---------- | --------------------- |
| : set nu   | 设置行号              |
| : set nonu | 取消行号              |
| gg   G     | 到第一行   到最后一行 |
| nG         | 到第n行               |
| : n        | 到第n行               |
| $          | 行尾                  |
| 0          | 行首                  |

### 删除命令

| 命令    | 作用                         |
| ------- | ---------------------------- |
| x       | 删除光标所在处字符           |
| nx      | 删除光标所在处后n个字符      |
| dd      | 删除光标所在行，ndd删除n行   |
| dG      | 删除光标所在行到文件末尾内容 |
| D       | 删除光标所在处到行尾内容     |
| :n1,n2d | 删除指定范围的行             |

### 复制和剪切命令 

| 命令 | 作用                          |
| ---- | ----------------------------- |
| yy   | 复制当前行                    |
| nyy  | 复制当前行以下n行             |
| dd   | 剪切当前行                    |
| ndd  | 剪切当前行以下n行             |
| p、P | 粘贴在当前光标所在行下 或行上 |

### 替换和取消命令 

| 命令 | 作用                                  |
| ---- | ------------------------------------- |
| r    | 取代光标所在处字符                    |
| R    | 从光标所在处开始替换字  符，按Esc结束 |
| u    | 取消上一步操作                        |

### 搜索和搜索替换命令

| 命令             | 作用                                        |
| ---------------- | ------------------------------------------- |
| /string          | 搜索指定字符串 搜索时忽略大小写 **:**set ic |
| n                | 搜索指定字符串的下一个出现位置              |
| :%s/old/new/g    | 全文替换指定字符串                          |
| :1,10s/old/new/g | 在一定范围内替换指定字符串  1到10行         |

### 保存和退出命令 

| 命令            | 作用                                     |
| --------------- | ---------------------------------------- |
| :w              | 保存修改                                 |
| :w new_filename | 另存为指定文件                           |
| :wq             | 保存修改并退出                           |
| ZZ              | 快捷键，保存修改并退出，在vi命令下使用   |
| :q!             | 不保存修改退出                           |
| :wq!            | 保存修改并退出（文件所有者及root可使用） |

## Vim使用技巧 

```java
导入命令执行结果 :r  !命令

定义快捷键 :map 快捷键 触发命令

范例： : map ^P   I#<ESC>

: map    ^B 0x

连续行注释

:n1,n2s/^/#/g

:n1,n2s/^#//g

:n1,n2s/^/\/\//g
```



# Linux yum 命令

yum（ Yellow dog Updater, Modified）是一个在 Fedora 和 RedHat 以及 SUSE 中的 Shell 前端软件包管理器。

基于 RPM 包管理，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。

yum 提供了查找、安装、删除某一个、一组甚至全部软件包的命令，而且命令简洁而又好记。

## yum 语法

```
yum [options] [command] [package ...]
```

- **options：**可选，选项包括-h（帮助），-y（当安装过程提示选择全部为 "yes"），-q（不显示安装的过程）等等。
- **command：**要进行的操作。
- **package：**安装的包名。

## yum常用命令

```java
- \1. 列出所有可更新的软件清单命令：**yum check-update**
- \2. 更新所有软件命令：**yum update**
- \3. 仅安装指定的软件命令：**yum install <package_name>**
- \4. 仅更新指定的软件命令：**yum update <package_name>**
- \5. 列出所有可安裝的软件清单命令：**yum list**
- \6. 删除软件包命令：**yum remove <package_name>**
- \7. 查找软件包命令：**yum search <keyword>**
- \8. 清除缓存命令:
  - **yum clean packages**: 清除缓存目录下的软件包
  - **yum clean headers**: 清除缓存目录下的 headers
  - **yum clean oldheaders**: 清除缓存目录下旧的 headers
  - **yum clean, yum clean all (= yum clean packages; yum clean oldheaders)** :清除缓存目录下的软件包及旧的 headers
```



**netstat  网络相关信息**

> 显示网络相关信息
>
> yum install net-tools      

# ------------   nginx 分隔    -----------



#  nginx 反向代理 服务器 

## 版本和安装

### window版

从官网 [*http://nginx.org/en/download.html* (opens new window)](http://nginx.org/en/download.html)下载最新的文档版。例如：`nginx-1.18.0`

解压 *`nginx-1.18.0.zip`* 到本地目录。按惯例，路径中不要有中文，最好不要有空格。例如：`D:\ProgramFiles\nginx-1.18.0` 。

解压后，可到看到如下内容：

```text
nginx-1.18.0
│── conf        配置文件目录
├── contrib
├── docs
├── html        类似 tomcat 的 webapps
├── logs        日志目录  access.log成功日志  error.log失败日志
├── temp
└── nginx.exe   启动程序
```

#### 启动

启动 Nginx 的方式有 2 种：

1. 直接双击 `nginx.exe`。双击后一个黑色的弹窗一闪而过。
2. 打开 cmd 命令窗口，切换到 nginx 解压目录下，输入命令 `nginx.exe` 或者 `start nginx` 。

检查 Nginx 是否启动成功的方式也有 2 种：

1. 直接在浏览器地址栏输入网址 [*http://localhost:80* (opens new window)](http://localhost/)。你会看到欢迎页面。

2. 在 cmd 命令窗口输入命令 `tasklist /fi "imagename eq nginx.exe"` 。你会看到类似如下页面：

   ```text
   映像名称    PID     会话名      会话#   内存使用
   =========== ======= =========== ======= ============
   nginx.exe   17220   Console     8       7,148 K
   nginx.exe   17660   Console     8       7,508 K
   ```

#### 关闭

如果使用 cmd 命令窗口启动 nginx，关闭 cmd 窗口是**不能**结束 nginx 进程的。

可使用两种方法关闭 nginx：

1. 输入 `nginx` 命令：`nginx -s stop`（快速停止 nginx）或 `nginx -s quit`（完整有序的停止 nginx）。
2. 使用 `taskkill` 命令： `taskkill /f /t /im nginx.exe` 

### linux版 

> 可看下方简洁安装步骤

#### 环境依赖

1、需要安装gcc的环境。yum install gcc-c++

2、第三方的开发包。

PCRE:PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库。nginx的http模块使用pcre来解析正则表达式，所以需要在linux上安装pcre库。pcre-devel是使用pcre开发的一个二次开发库。nginx也需要此库。

~~~shell
yum install -y pcre pcre-devel
~~~

zlib:zlib库提供了很多种压缩和解压缩的方式，nginx使用zlib对http包的内容进行gzip，所以需要在linux上安装zlib库。

~~~shell
yum install -y zlib zlib-devel
~~~

openssl:	OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及SSL协议，并提供丰富的应用程序供测试或其它目的使用。nginx不仅支持http协议，还支持https（即在ssl协议上传输http），所以需要在linux安装openssl库。

~~~shell
yum install -y openssl openssl-devel
~~~

#### 安装步骤

把nginx的源码包上传到linux系统

~~~shell
[root@localhost ~]# tar zxvf nginx-1.8.0.tar.gz
~~~

使用configure命令创建一makeFile文件

~~~shell
./configure \
--prefix=/usr/local/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi
~~~

注意：启动nginx之前，上边将临时文件目录指定为/var/temp/nginx，需要在/var下创建temp及nginx目录

~~~shell
[root@localhost sbin]# mkdir  -p  /var/temp/nginx/client 
[root@localhost sbin]#make
[root@localhost sbin]#make install
~~~

#### 启动 nginx

> 注意:  安装完成的源目录是在 /usr/local/nginx/sbin 里 并不是安装包的位置

~~~shell
进入sbin目录
[root@localhost sbin]# ./nginx 
关闭nginx：
[root@localhost sbin]# ./nginx -s stop
推荐使用：
[root@localhost sbin]# ./nginx -s quit
重启nginx：
1、先关闭后启动。
2、刷新配置文件：
[root@localhost sbin]# ./nginx -s reload
~~~

#### 访问 nginx

默认是80端口。注意：是否关闭防火墙。

~~~powershell
[root@localhost sbin]# systemctl stop firewalld.service
~~~

## nginx配置文件

在 nginx.conf 的注释符号为： #；每个指令必须有分号结束

1.全局块

~~~shell
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

~~~

> #user  nobody; 表示配置用户，默认用户为nobody（nobody表示任何用户），该指令的作用是哪些用户可以启动worker进程。nginx在启动后是有多个进程相互协助工作的，默认是一个master主进程和一个worker工作进程。其中主进程负责接收客户端的请求，worker进程负责处理请求，响应结果。你也可以把前面的注释去掉，写上一个具体的用户 user root
>
> worker_processes：工作进程的个数，默认为1，一般来说会设置成cpu核数的2倍；如果你设置一个数值为3，那么nginx在启动的时候会有3个workder进程和一个master主进程
>
> error_log：nginx的日志级别配置， 默认为cri，级别从低到高为debug, info, notice, warn, error, crit ；如果你要调成notice日志级别，只要#error_log  logs/error.log  notice;前面的注释去掉即可，日志位置在安装nginx的时候就已经指定
>
> pid：指定nginx进程运行文件存放地址

2.events块

~~~powershell
events {
	accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
	multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    worker_connections  1024;  #每个worker进程最大连接数，这个值最大可设置为：65535
}
##惊群现象：一个网路连接到来，多个睡眠的进程被同时叫醒，但只有一个进程能获得链接，这样会影响系统性能
##单台nginx最大连接数为 worker_processes*worker_connections
~~~

3.http块

可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置

4.server块

配置虚拟主机的相关参数，一个http中可以有多个server

5.location块

配置请求的路由，以及各种页面的处理情况



## 配置虚拟主机

就是在一台服务器启动多个网站。如何区分不同的网站：

1、域名不同

2、端口不同

###  通过端口区分不同虚拟机

#### 打开Nginx的配置文件：

~~~shell
[root@localhost nginx]# vim  conf/nginx.conf
~~~

~~~shell
server {
    listen       80;
    server_name  localhost;
    #charset koi8-r;
    #access_log  logs/host.access.log  main;
    location / {
    root   html;
    index  index.html index.htm;
    }
}
~~~

> 说明：一个server节点就是一个虚拟主机，html是nginx安装目录下的html目录(静态页面存放的位置,也可以使用绝对路径)，可以配置多个server，配置了多个虚拟主机

~~~powershell
 server {
        listen       81;
        server_name  localhost;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            root   html-81;
            index  index.html index.htm;
        }
    }
~~~

#### 重新加载配置文件

~~~powershell
[root@localhost nginx]# sbin/nginx -s reload
~~~

注意: **一定要关闭防火墙** 



### 通过域名区分虚拟主机

#### **什么是域名**

域名就是网站。如www.baidu.com  www.taobao.com   [www.jd.com](http://www.jd.com)

dns服务器：把域名解析为ip地址。保存的就是域名和ip的映射关系

一级域名：一串字符串中间一个点隔开，例如baidu.com。是互联网DNS等级之中的最高级的域，它保存于DNS根域的名字空间中

二级域名：是一个一级域名以下的主机名，一串字符串中间两个“.”隔开，例如www.baidu.com。二级域名就是最靠近顶级域名左侧的字段

三级域名：二级域名的子域名，特征是包含三个“.”，例如___.___.baidu.com ，___上可以填写任意内容，都属于三级域名

我们接触的顶级域名(一级域名)又分为两类：一是国家和地区顶级域名，例如中国是cn；二是国际顶级域名，例如表示工商企业的.com，表示非盈利组织的.org，表示网络商的.net，edu为学校单位，.gov为政府机构等

一个域名对应一个ip地址，一个ip地址可以被多个域名绑定。

实验1：

~~~powershell
修改window的hosts文件：（C:\Windows\System32\drivers\etc）
注意：该文件如果配置域名和ip的映射关系，如果hosts文件中配置了域名和ip的对应关系，不需要走dns服务器。
~~~

~~~powershell
192.168.128.129 www.jd.com
192.168.128.129 www.163.com
~~~

注意：如果修改后映射不生效，可参考以下解决办法：

1.该文件保存时未使用ansi编码进行保存，解决办法：更改文件编码为ansi进行保存

2.启用了DNS Client服务（该服务为DNS解析的缓存服务）解决办法：将该服务停用；如果该服务为自动启用，请改为手动启用

#### **Nginx的配置**

~~~powershell
server {
        listen       80;
        server_name  www.jd.com;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            root   html-jd;
            index  index.html index.htm;
        }
    }
 server {
        listen       80;
        server_name  www.163.com;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            root   html-163;
            index  index.html index.htm;
        }
    }
~~~

# 反向代理

正向代理：如果把局域网外的Internet想象成一个巨大的资源库,则局域网中的客户端要访问Internet ,则需要通过代理服务器来访问,这种代理服务就称为正向代理。代理的是客户端

反向代理：其实客户端对代理是无感知的,因为喜户端不需要任何配置就可以访问,我们只需要将请求发送到反向代理服务器,由反向代理服务器去选择目标服务器获取数据后,再返回给客户端,此时反向代理服务器和目标服务器对外就是一个服务器 ,暴露的是代理服务器地址,隐藏了真实服务器IP地址。代理的是服务器

> 在这种情况下，在客户端看来，`Nginx` + `服务端` 整体扮演了一个更大意义上的服务端的概念。

## 案例

1、后端工程：把一个springboot工程2个打包，分别指定运行端口8080和8081，在linux运行起来

springboot工程：

~~~java
@RestController
public class HelloController {

    @Value("${server.port}")
    private String port;

    @RequestMapping("/hello")
    public String hello1(){
        return "hello"+port;
    }
}
运行端口8080
~~~

2、nginx配置

~~~xml
server {
    listen       80;
    server_name  www.woniu.com;
 
    location /api {
        proxy_pass  http://127.0.0.1:8080;
        rewrite "^/api/(.*)$" /$1 break;  
    } 
 	location / {
         root   html;
         index  index.html index.htm;
     }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    } 
} 
~~~

> 说明：当我们访问www.woniu.com时，默认请求nginx里面的html目录的index.html.当我们请求www.woniu.com/api/hello时，由于以/api开头，则匹配第一个location，然后去请求http://127.0.0.1:8080这个服务器，那么问题来了，nginx转发的请求是http://127.0.0.1:8080/api/hello还是http://127.0.0.1:8080/api
>
> 这里就要注意转发规则：大家可以看看这句话： rewrite "^/user/(.*)$" /$1 break; 也就是路径重写  $1代表第一个（）里面的内容，如果有第二.....多个括号，则同样的用$2.....表示即可，这个正则表达式意思是说 以 api开头的被替换成/,( )里面的内容就是用$1占位符来表示，变相的把api截掉了

# 负载均衡

负载均衡（load balance）就是将负载分摊到多个操作单元上执行，从而提高服务的可用性和响应速度，带给用户更好的体验

## 负载均衡的配置

通过 Nginx 中的 **upstream** 指令可以实现负载均衡，再该指令中能够配置负载均衡服务器组

目前负载均衡有 4 种典型的配置方式。分别是：

|  #   | 负载均衡方式 | 特点                                                         |
| :--: | :----------- | :----------------------------------------------------------- |
|  1   | 轮询方式     | 默认方式。每个请求按照时间顺序逐一分配到不同的后端服务器进行处理。如果有服务器宕机，会自动删除。 |
|  2   | 权重方式     | 利用 weight 指定轮循的权重比率，与访问率成正比。用于后端服务器性能不均衡的情况。 |
|  3   | ip_hash 方法 | 每个请求按照访问 IP 的 hash 结果分配，这样可以使每个方可固定一个后端服务器，可以解决 Session 共享问题。 |
|  4   | 第三方模块   | 取决于所采用的第三方模块的分配规则。                         |

在 upstream 指定的服务器组中，若每个服务器的权重都设置为 1（默认值）时，表示当前的负载均衡是一般轮循方式

### 准备工作

编写后台（SpringBoot）项目，简单起见，以占用不同的端口的形式启动 2 次，并在返回的信息中返回各自所占用的端口号

~~~java
@Value("${server.port}")
String port;

@RequestMapping("/api/hello")
public Map<String, String> index(HttpServletRequest request) {
    HashMap<String, String> map = new HashMap<>();
    map.put("code", "10086");
    map.put("msg", "success");
    map.put("data", this.port);
    return map;
}
~~~



## 负载方式

#### 6.3.1 轮询

```powershell
upstream xxx {
    server 127.0.0.1:8080;
    server 127.0.0.1:9090;
}
upstream yyy {
    server 127.0.0.1:...;
    server 127.0.0.1:...;
}
server {
    ...
    location /api {
        proxy_pass http://xxx;
        ...
    }
    location /user {
        proxy_pass http://yyy;
        ...
    }
}
```

上述的配置中有 2 点需要注意的：

1、**upstream** 配置项在 **http** 配置项内，但是在 **server** 配置项外，它们 3 者整体结构如下（不要写错地方了）：

```powershell
http {
    # 它们两者平级
    server { ... }
    upstream { ...}
}
```

2、你所配置的 **upstream** 的 name 是自定义的，但是不要出现 **`-`** 号，否则会和 tomcat 有冲突。

测试：你持续访问 `http://127.0.0.1/api/hello` 你会发现页面的内容会是交替出现 `8080` 端口和 `9090` 端口

 

#### 6.3.2 加权轮询

加权轮循就是在轮循的基础上，为每个单点加上权值。权值越重的单点，承担的访问量自然也就越大。

```powershell
upstream xxx {
    server 127.0.0.1:8080 weight=1;
    server 127.0.0.1:9090 weight=2;
}
```

按照上述配置，`9090` 端口的服务将承担 2/3 的访问量，而 `8080` 端口则承担 1/3 的访问量。

将配置改为上述样子并重启 Nginx 后，再持续访问 `http://127.0.0.1/api/hello` 你会发现 `8080` 端口和 `9090` 端口会以 `1-2-1-2-...` 的次数交替出现。

除了 **weight** 外，常见的状态参数还有：

| 配置方式     | 说明                                                         |
| :----------- | :----------------------------------------------------------- |
| max_fails    | 允许请求失败次数，默认为 1 。通常和下面的 fail_timeout 连用。 |
| fail_timeout | 在经历了 max_fails 次失败后，暂停服务的时长。这段时间内，这台服务器 Nginx 不会请求这台 Server |
| backup       | 预留的备份机器。它只有在其它非 backup 机器出现故障时或者忙碌的情况下，才会承担负载任务。 |
| down         | 表示当前的 server 不参与负载均衡。                           |

例如：

```text
upstream web_server {
    server 192.168.78.128 weight=1 max_fails=1 fail_timeout=30s;
    server 192.168.78.200 weight=2 max_fails=1 fail_timeout=30s;
    server 192.168.78.201 backup;
    server 192.168.78.210 down;
}
```

#### 6.3.3 ip_hash 负载

ip_hash 方式的负载均衡，是将每个请求按照访问 IP 的 hash 结果分配，这样就可以使来自同一个 IP 的客户端固定访问一台 Web 服务器，从而就解决了 Session 共享问题

```powershell
upstream xxx {
    ip_hash;
    server 127.0.0.1:8080;
    server 127.0.0.1:9090;
}
```

使用上例配置后，你会发现无论你请求多少次 `http://127.0.0.1/api/hello` 你所看到的端口始终是 `8080` 和 `9090` 中的某一个。

## 将客户端浏览器的 IP 传递到后台

对于后台而言，它所面对的『**客户端**』就是 Nginx，后台看不见『**客户端**』浏览器。这就意味着，你如果你需要在后台获取客户端浏览器的 IP 地址，你需要明确指出让 Nginx 『**额外地多携带**』一些数据。

```powershell
location /api {
    proxy_pass http://xxx/api;
    proxy_set_header X-Real-IP $remote_addr;

    # proxy_set_header Cookie $http_cookie;
    # proxy_set_header Host $http_host;
    # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

在 Spring Boot 的 Controller 中你有 2 种方式来获得这个额外的信息：

```java
public Map<String, String> index(
        HttpServletRequest request,
        @RequestHeader("X-Real-IP") String realIP2) {
    String realIP1 = request.getHeader("X-Real-IP");
    ...
}
```



## nginx解决前后端跨域(了解)

 Spring Boot 不提供任何动态页面、资源，只提供 JSON 格式数据

```powershell
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;  # TCP 连接存活 65 秒
    server {
        # Nginx 监听 localhost:80 端口
        listen       80;
        server_name  localhost;

        # 访问 URI 根路径时，返回 Nginx 根目录下的 html 目录下的 index.html 或 index.htm
        location / {
            root   html;
            index  index.html index.htm;
        }

        # URI 路径以 /api 开头的将转交给『别人』处理
        location /api {
            proxy_pass http://localhost:8080/api;
        }

        # 出现 500、502、503、504 错误时，返回 Nginx 根目录下的 html 目录下的 50x.html 。
        error_page   500 502 503 504  /50x.html;    
        location = /50x.html {
            root   html;
        }
    }
}
```

index.html内容，放nginx运行

~~~html
<body>
<h2></h2>

<script src="./js/jquery-1.11.3.js"></script>
<script type="text/javascript">
$.ajax({
  url: 'http://192.168.128.128:80/api/hello', // 注意这里的 URL
  type: "POST",
  success: function (result) {
    $("h2").html("跨域访问成功:" + result.data);
  },
  error: function (data) {
    $("h2").html("跨域失败!!");
  }
});
</script>

</body>
~~~

首先当我们访问192.168.128.128时。显示index.html首页内容。在首页加载时异步请求http://127.0.0.1:80/api/hello的请求，被Nginx 接收后，Nginx 会『帮』我们去访问 http://127.0.0.1:8080` 的 `/api/hello，并将结果再返回给客户端了浏览器

## nginx搭建文件服务器

安装好nginx之后，做相关配置

~~~shell
server {
        listen       80;
        server_name  localhost; 
        location / {
	    root   /opt/soft/; #可以在这个目录放置一些软件包，供别人下载
	    autoindex on;             #开启索引功能  这句话很重要
        autoindex_exact_size off; # 关闭计算文件确切大小（单位bytes），只显示大概大小（单位kb、mb、gb）
        autoindex_localtime on;   # 显示本机时间而非 GMT 时间
        charset utf-8; # 避免中文乱码 
        # root html;
        # index  index.html index.htm;
        } 
    } 
~~~

测试：192.172.0.11





# -----------  Docker 分隔   ----------- 

# Docker 容器引擎

## Nacos 的下载和安装

首先去 nacos 的 github 地址下载 release 安装包。[下载地址](https://github.com/alibaba/nacos/releases)

进入到 nacos/bin 目录下面，**startup** 命令用于启动 nacos ，**shutdown** 命令用于停掉 nacos 。

- 如果你是 windows 系统

  执行 **startup.cmd -m standalone** 启动，单模式启动

- 如果你是 linux/unix 系统

  执行 **startup.sh -m standalone** 启动。

- 如果你使用的是 docker-compose

  编写docker-compose.yml文件   启动该文件 命令： docker-compose up

  ```yml
  nacos:
    image: nacos/nacos-server:latest
    container_name: nacos-standalone-8848
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone   #单机模式启动
    volumes:
      - ./8848/logs/:/home/nacos/logs   #前面是宿主机名  后面是容器目录名
      - ./8848/init.d/custom.properties:/home/nacos/init.d/custom.properties
    ports:
    - "8848:8848"
  ```

nacos 的默认服务端口是 **8848** ，启动完成之后通过浏览器访问 nacos：http://127.0.0.1:8848/nacos 。

## docker 概念

> 1、Docker 是一个开源的应用容器引擎
> 2、诞生于 2013 年初，基于 Go 语言实现， dotCloud 公司出品（后改名为Docker Inc）
> 3、Docker 是一个可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器引擎（好比汽车发动机），然后发布到任何流行的 Linux 机器上。
> 4、容器是完全使用沙箱机制，相互隔离
> 5、容器性能开销极低。
> 6、Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版）



### 安装docker

Docker可以运行在MAC、Windows、CentOS、UBUNTU等操作系统上，本课程基于CentOS 7 安装Docker。
官网：https://www.docker.com

~~~shell
# yum 包更新到最新
yum update -y    
# 安装需要的软件包
yum install -y yum-utils device-mapper-persistent-data lvm2
# 设置yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 华为的镜像服务器 可提高下载速度
sudo sed -i 's+download.docker.com+repo.huaweicloud.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
# 安装docker
yum install -y docker-ce   
# 查看docker版本，验证是否验证成功
docker -v        
~~~

> 考虑到从 docker 官方的仓库下载 docker-ce 有时会比较慢，可以使用下述命令将下载网址改为华为的镜像服务器：
> sudo sed -i 's+download.docker.com+repo.huaweicloud.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo



### docker相关概念

* 镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
* 容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和对象一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
* 仓库（Repository）：仓库可看成一个代码控制中心，用来保存镜像。

### 配置 Docker 镜像加速器

默认情况下，将来从docker hub（https://hub.docker.com/）上下载docker镜像，太慢。一般都会配置镜像加速器：

* USTC：中科大镜像加速器（https://docker.mirrors.ustc.edu.cn）
* 阿里云
* 网易云
* 腾讯云

阿里云镜像加速器配置

首先登陆阿里云，点击控制台，然后再点击左边的像三字一样的图标，再点击产品与服务，在输入关键字地方搜索“镜像”，会显示容器镜像服务，点击“容器镜像服务”，在左侧的最下方有镜像中心（镜像加速器），点击镜像加速器，复制如下代码到linux执行即可

~~~shell
// 修改 /etc/docker/daemon.json 文件内容 提高下载速度
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://88y9upwp.mirror.aliyuncs.com"]
}
EOF

sudo systemctl daemon-reload

sudo systemctl restart docker
~~~

# Docker 网络模式

> 在创建容器时可设置其网络模式: docker run -id -p 3307 :3306 --name=c_ mysql -e --net=host MYSQL_ ROOT_ PASSWORD=root mysql:5.6

四类网络模式:  https://segmentfault.com/a/1190000040335988

## bridge 模式 - 桥接

> 当Docker进程启动时，会在主机上创建一个名为docker0的虚拟网桥，此主机上启动的Docker容器会连接到这个虚拟网桥上。虚拟网桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了一个二层网络中。

从docker0子网中分配一个IP给容器使用，并设置docker0的IP地址为容器的默认网关。在主机上创建一对虚拟网卡veth pair设备，Docker将veth pair设备的一端放在新创建的容器中，并命名为eth0（容器的网卡），另一端放在主机中，以vethxxx这样类似的名字命名，并将这个网络设备加入到docker0网桥中。可以通过brctl show命令查看。

bridge模式是docker的默认网络模式，不写--net参数，就是bridge模式。使用docker run -p时，docker实际是在iptables做了DNAT规则，实现端口转发功能。可以使用iptables -t nat -vnL查看。

## host 模式 - 仅主机模式

如果启动容器的时候使用host模式，那么这个容器将不会获得一个独立的Network Namespace，而是和宿主机共用一个Network Namespace。容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口。但是，容器的其他方面，如文件系统、进程列表等还是和宿主机隔离的

> 使用host模式的容器可以直接使用宿主机的IP地址与外界通信，容器内部的服务端口也可以使用宿主机的端口，不需要进行NAT，host最大的优势就是网络性能比较好，但是docker host上已经使用的端口就不能再用了，网络的隔离性不好。



## container 模式

这个模式指定新创建的容器和已经存在的一个容器共享一个 Network Namespace，而不是和宿主机共享。新创建的容器不会创建自己的网卡，配置自己的 IP，而是和一个指定的容器共享 IP、端口范围等。同样，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的。两个容器的进程可以通过 lo 网卡设备通信。



### none模式

使用none模式，Docker容器拥有自己的Network Namespace，但是，并不为Docker容器进行任何网络配置。也就是说，这个Docker容器没有网卡、IP、路由等信息。需要我们自己为Docker容器添加网卡、配置IP等。

这种网络模式下容器只有lo回环网络，没有其他网卡。none模式可以在容器创建时通过--network=none来指定。这种类型的网络没有办法联网，封闭的网络能很好的保证容器的安全性。



# Docker 命令

## 进程相关命令

~~~shell
systemctl start docker    #启动docker服务
systemctl stop docker     #停止docker服务 
systemctl restart docker  #重启docker服务 
systemctl status docker   #查看docker服务状态
systemctl enable docker   #开机启动docker服务
~~~



## 镜像相关命令

1、查看镜像: 查看本地所有的镜像

~~~shell
[root@localhost ~]#docker images      
[root@localhost ~]#docker images –q # 查看所有镜像的id
~~~

2、搜索镜像:从网络中查找需要的镜像

~~~shell
docker imagesxxxxxxxxxx docker imagesdocker search 镜像名称[root@localhost ~]#docker search  redisshell
~~~

3、拉取镜像:从Docker仓库下载镜像到本地，镜像名称格式为 名称:版本号，如果版本号不指定则是最新的版本，如果不知道镜像版本，可以去docker hub 搜索对应镜像查看。 https://hub.docker.com/_/docker

~~~shell
docker pull 镜像名称:版本号
[root@localhost ~]#docker pull redis:5.0 
[root@localhost ~]#docker pull centos:7 
[root@localhost ~]# docker pull mysql:5.6  |  docker pull mysql:8.0.25 
[root@localhost ~]#docker pull tomcat:8 弃用
				   docker pull openjdk:8
[root@localhost ~]#docker pull nginx

docker pull java:8
# minio 文件对象存储 类似阿里云oss
docker pull minio/minio 
# 安装消息队列
docker pull rabbitmq:management
# 拉取 wordpress 主题网站镜像
docker pull wordpress 
~~~

4、删除镜像: 删除本地镜像   

~~~shell
// 可根据 docker images 查询镜像id镜像删除
[root@localhost ~]#docker rmi 镜像id
// 删除所有镜像
[root@localhost ~]#docker rmi `docker images -q`
~~~



## 容器相关命令

1、查看容器

~~~powershell
[root@localhost ~]#docker ps       # 查看正在运行的容器
[root@localhost ~]#docker ps -a    # 查看所有容器 （包括没有运行的容器）
~~~

2、创建并启动容器

~~~powershell
docker run -it | -id --name=容器名称 镜像名称:版本 /bin/bash
#创建并自动进入容器,当输入exit 退出容器并回到宿主机
[root@localhost ~]#docker run -it --name=c1 centos:7 /bin/bash  

#创建容器 但不进入容器 后台运行 可使用命令进入 且退出不会关闭容器
[root@localhost ~]#docker run -id --name=c2 centos:7		

docker run -id --name=java_apai -p 2022:2022 -p 2023:2023 -p 2024:2024 java:8
~~~

> 参数说明：
>
> -i：保持容器运行。通常与 -t 同时使用。加入it这两个参数后，容器创建后自动进入容器中，退出容器后（执行命令exit），容器自动关闭 
>
> -t：为容器重新分配一个伪输入终端，通常与 -i 同时使用
>
> -d：以守护（后台）模式运行容器。创建一个容器在后台运行，需要使用docker exec 进入容器。退出后，容器不会关闭
>
> /bin/bash 这是表示载入容器后运行bash ,docker中必须要保持一个进程的运行，要不然整个容器就会退出。这个就表示启动容器后启动bash。默认会启动一个bash，可以忽略不写

3、进入容器

~~~java
docker exec 参数  /bin/bash      #进入容器  注意 此处的/bin/bash不能省略
// 启动容器  后台启动
[root@localhost ~]#docker -id --name=c2 centos:7
// 进入容器  docker exec -it 容器名称 /bin/bash
[root@localhost ~]#docker exec -it c2 /bin/bash
// 退出容器 此时容器还是在运行着的
[root@localhost ~]#exit        
~~~

4、启动容器

~~~powershell
docker start 容器名称
[root@localhost ~]#docker start c1
~~~

5、停止容器运行

~~~powershell
docker stop 容器名
~~~

6、删除容器

~~~powershell
docker rm 容器名称       #如果容器是运行状态则删除失败，需要停止容器才能删除
[root@localhost ~]#docker rm c1
~~~

7、查看容器信息

~~~powershell
docker inspect 容器名称
[root@localhost ~]#docker inspect  c1
~~~

8、查看docker日志

~~~java
docker logs --tail 行数 -f  容器名   
// 查看某个容器末尾300行的日志内容
[root@localhost ~]#docker logs --tail  300 -f app-jar  
~~~

9、docker容器安装命令

~~~powershell
apt-get  update
apt-get  -y install net-tools  | yum .....
~~~

10、用于容器与主机之间的数据拷贝

~~~java
// 将主机/root/123.war文件拷贝到容器96f7f14e99ab的/root目录下
[root@localhost ~]#docker cp /root/123.war 96f7f14e99ab:/root/
[root@localhost ~]#docker cp /Apai/Login.jar 5920698f5ad7:/root/

// 将容器96f7f14e99ab的/www目录拷贝到主机的/tmp目录中
[root@localhost ~]#docker cp  5920698f5ad7:/root /tmp/
~~~



### 配置数据卷

语法：docker run ... –v 宿主机目录(文件):容器内目录(文件) ... 

案例1：

~~~powershell
[root@localhost ~]docker run -it --name=c3 -v /root/data:/root/data_container centos:7 /bin/bash
[root@localhost ~]docker run -it --name=c4 -v /root/data:/root/contai1 -v /root/data1:/root/contai2 centos:7
~~~

> 注意事项：
>
> 1、目录必须是绝对路径 （宿主机和容器目录都是绝对路径）
> 2、如果目录不存在，会自动创建
> 3、可以挂载多个数据卷
>
> 配置数据卷后，在/root/data下创建文件，发现会同步到c3容器的data_container目录中，同理反过来也一样，当删除容器后，此时并不影响宿主机/root/data里的内容



案例2：多容器进行数据交换

步骤：

1、创建启动c3数据卷容器，使用 –v 参数 设置数据卷

~~~powershell
[root@localhost ~]#docker run –it --name=c3 –v /volume centos:7 /bin/bash 
[root@localhost ~]#docker inspect c3      #查看c3容器
~~~

> -v 后面的/volume是容器的目录，那么这个宿主机的目录为什么不见了呢?其实这个时候linux会自动创建一个目录（目录名很长）作为源目录和/volume容器目录相对应。可以通过  docker inspect c3 查看c3容器

2、创建启动 c1 c2 容器，使用 –-volumes-from 参数 设置数据卷

~~~powershell
[root@localhost ~]#docker run –it --name=c1 --volumes-from c3 centos:7 /bin/bash
[root@localhost ~]#docker run –it --name=c2 --volumes-from c3 centos:7 /bin/bash  
~~~

> 此时c1和c2 挂载到和c3相同的宿主机的目录，在c3容器创建内容，c1和c2都会自动同步  (也就是说在c1和c2的根目录下也有 volume文件夹)
> [root@localhost ~]#docker inspect c1 
> [root@localhost ~]#docker inspect c2 
> 发现c1 c2的宿主机目录和c3相同

### 数据卷小结

1、数据卷概念：宿主机的一个目录或文件
2、数据卷作用：容器数据持久化、客户端和容器数据交换、容器间数据交换
3、数据卷容器：创建一个容器，挂载一个目录，让其他容器继承自该容器( --volume-from )。通过简单方式实现数据卷配置









# Docker 镜像制作

## Docker 镜像原理

> 本质是一个分层文件系统,由一层一层的文件系统叠加而成，最底端是 bootfs，并使用宿主机的bootfs ，第二层是 root文件系统rootfs，称为base image，然后再往上可以叠加其他的镜像文件，这种层级的文件系统被称之为UnionFS，统一文件系统（Union File System）技术能够将不同的层整合成一个文件系统，为这些层提供了一个统一的视角，这样就隐藏了多层的存在，在用户的角度看来，只存在一个文件系统
>
> 一个镜像可以放在另一个镜像的上面。位于下面的镜像称为父镜像，最底部的镜像成为基础镜像，当从一个镜像启动容器时，Docker会在最顶层加载一个读写文件系统作为容器

## 普通方式

> 有些容器镜像 会排除某些文件 如: Mysql ...    (具体见)

制作tomcat镜像

1、首先创建一个tomcat容器

~~~powershell
[root@localhost tomcat]# docker run -id --name=tomcat1 -p 8080:8080 tomcat:8
~~~

2、把宿主机的某个war包拷贝到容器的某个目录里面，这样将来做镜像时，war包会加载到镜像里

~~~powershell
[root@localhost tomcat]# docker cp /root/test.war  #6598a89db5f6:/root   
~~~

>  注意：不能将内容拷贝到tomcat容器的webapp目录和var目录里，如果放到里面，做成镜像时，该目录下的内容不会载入镜像里面

3、把tomcat容器做成镜像

~~~powershell
[root@localhost tomcat]# docker commit 6598a89db5f6 woniu_tomcat:1.0
[root@localhost tomcat]# docker images   #可以查看到woniu_tomcat:1.0镜像
~~~

4、把镜像做成压缩包 放到宿主机的某个位置

~~~powershell
[root@localhost ~]# docker save -o woniu_tomcat.tar woniu_tomcat:1.0     #-o:output 压缩文件保存到/root目录下
~~~

5、把压缩文件载入镜像（第三方载入该压缩包）

~~~powershell
[root@localhost ~]# docker load -i woniu_tomcat.tar  #镜像加载 -i  （input）
[root@localhost ~]# docker images
~~~

6、用woniu_tomcat:1.0镜像做容器

~~~powershell
[root@localhost ~]# docker run -id --name=tomcat2 -p:8081:8080 woniu_tomcat:1.0
[root@localhost ~]# docker exec -it tomcat2 bash  #进入容器，进入/root 可以看到test.war存在
~~~

## dockerfile方式

> 制作docker镜像的一个文本文件,文件包含了一条条的指令，每一条指令构建一层，基于基础镜像，最终构建出一个新的镜像，

Dochub网址：https://hub.docker.com 

**Dockerfile关键字**

| 关键字      | 作用                     | 备注                                                         |
| ----------- | ------------------------ | ------------------------------------------------------------ |
| FROM        | 指定父镜像               | 指定dockerfile基于那个image构建                              |
| MAINTAINER  | 作者信息                 | 用来标明这个dockerfile谁写的                                 |
| LABEL       | 标签                     | 用来标明dockerfile的标签 可以使用Label代替Maintainer 最终都是在docker image基本信息中可以查看 |
| RUN         | 执行命令                 | 执行一段命令 默认是/bin/sh 格式: RUN command 或者 RUN ["command" , "param1","param2"] |
| CMD         | 容器启动命令             | 提供启动容器时候的默认命令 和ENTRYPOINT配合使用.格式 CMD command param1 param2 或者 CMD ["command" , "param1","param2"] |
| ENTRYPOINT  | 入口                     | 一般在制作一些执行就关闭的容器中会使用                       |
| COPY        | 复制文件                 | build的时候复制文件到image中                                 |
| ADD         | 添加文件                 | build的时候添加文件到image中 不仅仅局限于当前build上下文 可以来源于远程服务,      ADD 源路径 目标路径 |
| ENV         | 环境变量                 | 指定build时候的环境变量 可以在启动的容器的时候 通过-e覆盖 格式ENV name=value |
| ARG         | 构建参数                 | 构建参数 只在构建的时候使用的参数 如果有ENV 那么ENV的相同名字的值始终覆盖arg的参数 |
| VOLUME      | 定义外部可以挂载的数据卷 | 指定build的image那些目录可以启动的时候挂载到文件系统中 启动容器的时候使用 -v 绑定 格式 VOLUME ["目录"] |
| EXPOSE      | 暴露端口                 | 定义容器运行的时候监听的端口 启动容器的使用-p来绑定暴露端口 格式: EXPOSE 8080 或者 EXPOSE 8080/udp |
| WORKDIR     | 工作目录                 | 指定容器内部的工作目录 如果没有创建则自动创建 如果指定/ 使用的是绝对地址 如果不是/开头那么是在上一条workdir的路径的相对路径 |
| USER        | 指定执行用户             | 指定build或者启动的时候 用户 在RUN CMD ENTRYPONT执行的时候的用户 |
| HEALTHCHECK | 健康检查                 | 指定监测当前容器的健康监测的命令 基本上没用 因为很多时候 应用本身有健康监测机制 |
| ONBUILD     | 触发器                   | 当存在ONBUILD关键字的镜像作为基础镜像的时候 当执行FROM完成之后 会执行 ONBUILD的命令 但是不影响当前镜像 用处也不怎么大 |
| STOPSIGNAL  | 发送信号量到宿主机       | 该STOPSIGNAL指令设置将发送到容器的系统调用信号以退出。       |
| SHELL       | 指定执行脚本的shell      | 指定RUN CMD ENTRYPOINT 执行命令的时候 使用的shell            |

案例2：定义dockerfile文件构建镜像，发布springboot项目

步骤1：创建dockerfile文件并编写内容

~~~powershell
[root@localhost docker-file]#vim springboot-dockerfile
编写内容如下：
FROM java:8
MAINTAINER  woniu<woniu@woniu.cn>
ADD springboot.jar app.jar   
CMD java -jar /app.jar
~~~

> 说明：
>
> ADD springboot.jar app.jar   表示把宿主机的springboot.jar复制到镜像里并更名为app.jar,当用镜像做容器时，app.jar默认在容器的根目录

步骤2：通过dockerfile构建镜像

特别注意: 最后有一个点  '   .   '

~~~powershell
[root@localhost docker-file]# docker build -f  ./springboot-dockerfile -t  springboot-app:1.0 .
[root@localhost docker-file]# docker images
~~~

步骤3：通过springboot-app:1.0镜像创建容器

~~~powershell
[root@localhost docker-file]# docker run -it --name=app -p 8080:8080 springboot-app:1.0
[root@localhost docker-file]#docker logs --tail 100 -f  app    #查看app容器的日志  末尾100行
~~~

# Compose 服务编排

> Docker Compose是“容器编排技术”。它由Python 语言编写，是Docker官方的一个开源项目，简单来讲，就是编排好一个系统中的众多容器的启动顺序，先启动A，再启动B，在启动C。

## 安装 Compose

Compose目前已经完全支持Linux、Mac OS和Windows，在我们安装Compose之前，需要先安装Docker。下面我 们以编译好的二进制包方式安装在Linux系统中。

~~~shell
[root@localhost ~]#curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
[root@localhost ~]#chmod +x /usr/local/bin/docker-compose    # 设置文件可执行权限
[root@localhost ~]#docker-compose -version					 # 查看版本信息 
~~~

## 卸载 Compose

~~~powershell
[root@localhost ~]#rm /usr/local/bin/docker-compose   # 二进制包方式安装的，删除二进制文件即可
~~~

## Comnpose的使用步骤

1、利用 Dockerfile 定义运行环境镜像
2、使用 docker-compose.yml 文件定义组成应用的各服务的运行顺序
3、运行 docker-compose up 启动应用

案例: 具体详见  Docker 详情.md









# ------------   分隔    ------------





# Linux 常用命令

## 文件类 功能类 命令

```java
// tar 解压缩 命令
tar -zxvf 压缩名 -C 目录名
// 查看进程 端口信息
netstat -tlnp
// 根据端口 关闭进程
kill -9 端口号
// 关闭防火墙
systemctl stop firewalld.service
// 将文件变为可执行文件
chmod +x 文件
```

## redis  命令

```java
// 启动redis服务器
cd /usr/local/bin  // 进入bin目录执行
./redis-server redis.conf
// 启动redis客户端
redis-cli -h 192.168.174.128 -p 6379
```

## nginx  命令

```java
// 进入sbin目录 启动nginx
[root@localhost sbin]# ./nginx 
// 关闭nginx：
[root@localhost sbin]# ./nginx -s stop
// 推荐使用：
[root@localhost sbin]# ./nginx -s quit
// 重启nginx： 1、先关闭后启动。 2、刷新配置文件：
[root@localhost sbin]# ./nginx -s reload
```

## 运行jar包 命令

```java
// 特点：当前ssh窗口被锁定，可按CTRL + C打断程序运行，或直接关闭窗口，程序退出
java -jar XXX.jar
// 特定：当前ssh窗口不被锁定，但是当窗口关闭时，程序中止运行。 &代表在后台运行
java -jar xxx.jar &
// nohup 意思是不挂断运行命令,当账户退出或终端关闭时,程序仍然运行
nohup java -jar shareniu.jar &    
// nohup 命令执行作业时，缺省情况下的所有输出被重定向到nohup.out的文件中，除非另外指定了输出文件。
// 将command的输出重定向到out.file文件，即输出内容不打印到屏幕上，而是输出到out.file文件中。
nohup java -jar shareniu.jar >out.file &
// 指定端口
java -jar XXX.jar --server.port=8081 > demo.out &
nohup java -jar XXX.jar --server.port=8081 > demo.out &
```

## Docker 命令

> Docker

```java
// 进程相关命令
systemctl start docker    #启动docker服务
systemctl stop docker     #停止docker服务 
systemctl restart docker  #重启docker服务 
systemctl status docker   #查看docker服务状态
systemctl enable docker   #开机启动docker服务
// 查看镜像: 查看本地所有的镜像
docker images  
// 拉取镜像
docker pull 镜像名称:版本号 
// 删除镜像
docker rmi 镜像id
```

> 容器相关命令

```java
--restart=always -> 表示docker容器开机自启

// 查看容器
docker ps       # 查看正在运行的容器
docker ps -a    # 查看所有容器 （包括没有运行的容器）
// 创建容器 但不进入容器 后台运行 可使用命令进入 且退出不会关闭容器  
// --restart=always -> 表示docker容器开机自启
docker run -id --name=容器名称 镜像名称:版本
// 进入容器
docker exec -it 容器id /bin/bash
// 启动容器 
docker start 容器名称
// 停止容器运行
docker stop 容器名
// 删除容器 运行状态则删除失败，需要停止容器才能删除
docker rm 容器名称
    
// 将主机/root/123.war文件拷贝到容器96f7f14e99ab的/root目录下
docker cp /root/123.war 96f7f14e99ab:/root/
docker cp /Apai_File/app/wxpuls.jar c90863cd35eb:/root/

// 将容器96f7f14e99ab的/www目录拷贝到主机的/tmp目录中
docker cp  96f7f14e99ab:/root /tmp/
    
// 容器安装命令
apt update  // 更新源
apt-get install vim  // 容器安装vim 
```







# 项目 部署

## war包部署

> 即 使用tomcat插件运行的项目

1.先在IDEA 本地运行是否正常,

2.使用 package 打包 储存在 tager 目录下 .war

3.将 war 放入 tomcat 的 webapps 文件夹下

4.启动 tomcat 即可

5.在浏览器使用   ip地址:端口号/war包名  进行访问

* http://192.168.174.128:8080/chaoshi/

注意:

> ieda 项目的过滤器为等于请求 在Linux系统里请求是带上了包名 
>
> 则会被拦截导致无法登录 解决方法: 在过滤器 不是等于而是使用 uri.contains("/user/login") 包含
>
> 打包前使用的 tomcat 版本 需和Linux系统 的tomcat 版本一致
>
> 在访问时 必须带上war名 否则无法正常无法

## jar包部署

> 即 使用启动类 的项目

1.将项目的 jar 包放入 Linux 系统里的任意文件夹下

2.使用  后台运行jar包  的指令启动   nohup java -jar XXX.jar &  

3.在浏览器请求



## ngins 进行 项目部署

> Nginx是一款高性能的http 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器。
>
> 详见:  nginx.md
>
> 网址:  Nginx配置——反向代理
>
> (https://blog.csdn.net/zxd1435513775/article/details/102508463)

**启动nginx**

```java
// 进入sbin目录
[root@localhost sbin]# ./nginx 
// 关闭nginx：
[root@localhost sbin]# ./nginx -s stop
// 推荐使用：
[root@localhost sbin]# ./nginx -s quit
// 重启nginx：
// 1、先关闭后启动。 2、刷新配置文件：
[root@localhost sbin]# ./nginx -s reload
```

**nginx配置文件**

打开Nginx的配置文件：

~~~shell
[root@localhost nginx]# vim  conf/nginx.conf
~~~

- 通过端口区分不同虚拟机

  触发: 192.127.0.1:80

~~~shell
server {
	# 监听端口
    listen       80;
    # 监听 ip
    server_name  localhost;
    # 监听到后执行
    location / {
    # 相对路径的文件夹
    root   html;
    # 文件夹内的index.html页面
    index  index.html index.htm;
    }
}

server {
    listen  81;
    server_name  192.168.174.130;
 
    location /api {
        proxy_pass  http://192.168.174.130:8080;
        rewrite "^/api/(.*)$" /$1 break;  
    } 
    location / {
         root   pai-erp;
         index  index.html index.htm;
     }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    } 
}
~~~

> 说明：一个server节点就是一个虚拟主机，html是nginx安装目录下的html目录(静态页面存放的位置,也可以使用绝对路径)，可以配置多个server，配置了多个虚拟主机

- 通过域名区分虚拟主机

#### Nginx的配置

~~~powershell
server {
        listen       80;
        server_name  www.jd.com;
        location / {
            root   html-jd;
            index  index.html index.htm;
        }
}
~~~



# Linux 安装

## nginx 安装

- 解压   tar  -zxvf nginx-1.8.0.tar.gz    解压后可改名

- 源码包的根目录下没有这个Makefile，那么源码包就会有一个configure可执行文件，这个文件的作用就是用来做环境检查和环境配置的 执行以下命令

```
./configure \
--prefix=/usr/local/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi
```

- 然后返现检查失败，需要一些依赖包


~~~
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
~~~

- 然后再检查，通过了

~~~
make &&  make install 
~~~


* 编译

  make     在源码包的根目录下执行make命令即可

* 安装

  make install      在源码包的根目录下执行make install命令即可

- ##### 源码包的卸载

  直接删除这个安装目录即可



## 源码包

> 定义：就是程序员开发出来的包，没有编译的包。
>
> 优点：所以我们可以去改源码
>
> 缺点：所以安装的时候要先编译,然后再安装，这个过程要长些
>
> 源码包：一般来说，包里面会有一个src目录，该目录里面放源码
>

**源码包的安装**

* 检查当前的系统是否有必备的安装环境

* 解压  tar  -zxvf  包名

  > 当我们要编译一个源码包的时候，一定要看看这个源码包里面是否有一个Makefile文件，因为编译的时候需要这个文件，这个文件的作用就是把一些安装配置写到这个文件的。

* 如果有，则可以直接编译，当然在编译之前还要看看是否有c语言的编译器。

  > 如果有，则可以直接编译，当然在编译之前还要看看是否有c语言的编译器。如果没有编译器，则要先安装

  ```
  yum  -y   install   gcc-c++
  
  注意：有可能第一次没装成功，那么就需要清一下缓存
  make  distclean  清缓存
  ```

* 如果没有编译器，则要先安装

  > 如果没有这个文件，那么就不能直接编译，必须要先生成这个文件，那么怎么生成？
  >
  > 如：安装nginx，发现源码包的根目录下没有这个Makefile，那么源码包就会有一个configure可执行文件，这个文件的作用就是用来做环境检查和环境配置的

  ```
  ./configure \
  --prefix=/usr/local/nginx \
  --pid-path=/var/run/nginx/nginx.pid \
  --lock-path=/var/lock/nginx.lock \
  --error-log-path=/var/log/nginx/error.log \
  --http-log-path=/var/log/nginx/access.log \
  --with-http_gzip_static_module \
  --http-client-body-temp-path=/var/temp/nginx/client \
  --http-proxy-temp-path=/var/temp/nginx/proxy \
  --http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
  --http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
  --http-scgi-temp-path=/var/temp/nginx/scgi
  ```

  然后返现检查失败，需要一些依赖包

  ~~~
  yum install -y pcre pcre-devel
  yum install -y zlib zlib-devel
  yum install -y openssl openssl-devel
  ~~~

  然后再检查，通过了

  ~~~
  make &&  make install 
  ~~~


* 编译

  make     在源码包的根目录下执行make命令即可

* 安装

  make install      在源码包的根目录下执行make install命令即可

- ##### 源码包的卸载

  直接删除这个安装目录即可



## 脚本包

> 它其实是源码包中的一种，类似于window的软件安装。我们只需要找到这个脚本包的bin目录，去执行一个脚本文件。一般来说叫  startup.sh  例如：tomcat



## rpm包（二进制包)

> 二进制包也叫rpm(redhat  package  manager), 包名一般来说以.rpm结尾
>

~~~
httpd-2.4.6-88.el7.centos.x86_64.rpm 

包名：httpd
包版本：2.4.6
包发布了多少次：88
包的依赖环境  el7.centos.x86_64
包的后缀后：.rpm 

httpd-2.4.6-88.el7.centos.x86_64.rpm  整个包全名
~~~

> rpm包安装起来是最复杂的，因为他的依赖太多。
>

* 检查一下当前系统是否已经装过这个软件包

~~~
rpm  -qa   查询当前已经安装了哪些rpm包
rpm  -qa  |  grep httpd
~~~

* 卸载rpm包

~~~
rpm  -e  包名
~~~

* 安装一个rpm包

~~~
rpm   -ivh   （install  verbose  hash ）   包全名
~~~

* 包升级

~~~
rpm -Uvh  包全名
~~~



## yum安装

> 当我们用yum去安装一个软件或者是一个命令，那么在我们的linux系统中有一个yum源文件，这个文件就是保存了yum的中央仓库地址，这个文件在/etc/yum.repos.d/目录下，你看到了很多文件，其中有一个yum中央仓库文件，叫CentOS-Base.repo，当然这里还有其他的文件，可以用来配置本地yum源
>

* 查询

~~~
yum   list  | grep  你的包名
~~~

注意：yum不存在包名和包全名的概念，统一叫包名

如：安装 httpd

* 安装

~~~
yum -y  install  httpd  ###这个httpd就是包名

如：  yum -y install  vim
~~~

有些软件在这个yum源的中央仓库并没有这个包，那么要去下载专业的yum源。把这个专业的yum源安装了，再可以安装某个包

如：安装mysql

~~~
先检查有没有安装过mysql
rpm  -qa| grep mysql,如果安装过就卸载
~~~

我们安装专业的yum源

~~~
yum localinstall mysql-community-release-el5-5.noarch.rpm 
 
#这个mysql-community-release-el5-5.noarch.rpm 就是一个yum源
~~~

* 升级

~~~
yum  -y update  包名
~~~

* 卸载

~~~
yum  -y remove 包名
~~~





## 工具 安装



### jdk 的安装 

1.将压缩包放入 root 文件夹内   

* tar  -zxvf  包名

2.解压改名为 jdk8  

* rm 原名 新名

3.vim /etc/profile 修改配置文件

- 末尾添加


- export JAVA_HOME=/usr/local/btjdk/jdk8
- export PATH=$JAVA_HOME/bin:$PATH

4.source /etc/profile 刷新

5.验证是否安装成功  java  javac  如出现一大串即成功



### tomcan8 的安装

前提需安装 jdk

1.将压缩包放入 root 文件夹内

2.解压改名为 tomcan8 

3.执行   /root/tomcat9/bin 目录下   ./startup.sh

4.查看端口   netstat -tlnp

5.关闭防火墙   systemctl stop  firewalld.service

6.在浏览器 根据ip地址和端口进行连接



### Mysql 版本5.6安装

> 如遇出错: 备用 [linux安装 mysql >>http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm - 御本美琴初号机 - 博客园 (cnblogs.com)](https://www.cnblogs.com/lenny-z/p/15666149.html)

> 宝塔: [(9条消息) 如何使用Navicat连接宝塔面板上安装的mysql数据库？_明金同学的博客-CSDN博客_navicat连接宝塔mysql](https://blog.csdn.net/weixin_44893902/article/details/121242965)

1.先检查有没有安装过mysql

* rpm  -qa| grep mysql,如果安装过就卸载

2.安装专业的yum源

* 执行 yum localinstall mysql-community-release-el5-5.noarch.rpm 

* mysql-community-release-el5-5.noarch.rpm 就是一个yum源文件

3.安装mysql的服务端

* yum install mysql-community-server

4.开启mysql的服务

* service  mysqld start

5.然后设置密码

* /usr/bin/mysqladmin -u root password 'root'

6.登录

* mysql  -uroot -p123456

7.查看

* Mysql > show databases;  查看表 注意: 分号 '  ;  '
* Mysql > exit 退出

8.开启mysql远程访问权限

* Mysql > grant all privileges on *.* to 'root'@'%' identified by '102528' with grant option;
* Mysql > flush privileges;    刷新数据库配置
* Mysql > exit; 退出

9.Navicat Premium 12 进行连接

![image-20220622203106853](https://gitee.com/LuisApai/Apai_image_MD/raw/master/image-20220622203106853.png)



# Docker 应用部署

## 1.mysql  部署

1、搜索mysql镜像

```powershell
[root@localhost ~]#docker search mysql
```

2、拉取mysql镜像

```powershell
[root@localhost ~]#docker pull mysql:5.6

[root@localhost ~]#docker pull mysql:8.0.25
```

3、创建目录  在/root目录下创建mysql目录用于存储mysql数据信息

~~~powershell
[root@localhost ~]#mkdir mysql
[root@localhost ~]#cd mysql
~~~

4、创建容器，设置端口映射和目录映射

> 此段为一句话 注意最后面为 版本号 未镜像则会先下载镜像
>
> -p 3307:3306 --> 3307 被 容器的数据库3306端口映射 外部可通过宿主机3307端口访问
>
> -e MYSQL_ROOT_PASSWORD=root  -->  在创建容器进行写入配置
>
> 注意: mysql 8.0.25 连接外部需开启远程访问 对照下方解决方法

~~~powershell
docker run -id -p 3307:3306 --name=c_mysql --restart=always -v /root/mysql/conf:/etc/mysql/conf.d -v /root/mysql/logs:/var/log/mysql -v /root/mysql/data:/var//lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25

docker run -id -p 3307:3306 --name=Apai_mysql --restart=always -v /Apai_File/mysql/conf:/etc/mysql/conf.d -v /Apai_File/mysql/logs:/var/log/mysql -v /Apai_File/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25

docker run -id -p 3307:3306 --name=Apai_mysql --restart=always -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25
~~~

> 1、 -p 3307:3306  将容器的 3306 端口映射到宿主机的 3307端口
> 2、-v /root/mysql/conf:/etc/mysql/conf.d 将宿主机当前mysql目录里面的 conf目录挂载到容器的 /etc/mysql/conf.d目录下，在mysql5的版本中，mysql容器启动默认加载 /etc/mysql/mysql.cnf配置文件，这个文件没有什么内容，只是文件的末尾有2句
> !includedir /etc/mysql/conf.d/和!includedir /etc/mysql/mysql.conf.d/，表示这两个目录里面的文件都可以作为参数文件，mysql会读取这两个目录里面的.cnf结尾的文件，而/etc/mysql/conf.d/目录里面虽然有以.cnf 末尾结尾的文件，但是都没内容，所以我们把这个目录conf.d和宿主机的/root/mysql/conf做一个映射，那么在宿主机的该目录下放一些*.cnf文件会同步到/etc/mysql/conf.d就可以作为mysql的参数文件了，一旦做了映射，那么etc/mysql/conf.d目录就为空了。另外 /etc/mysql/mysql.conf.d/目录的下有mysql的参数文件 mysqld.cnf，这个文件配置了mysql启动时的进程id，datadir数据目录等
>
> 3、容器的mysql启动后，日志文件保存在/var/log/mysql目录里 
> 4、容器的mysql启动后，数据库文件保存在/var/lib/mysql目录里 会同步到宿主机目录

当然我们也可以不用挂载

~~~powershell
[root@localhost ~]#docker run -id -p 3307:3306 --name=c_mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.6
~~~

**navicat连接; ip地址 端口为 3307**

**安装mysql8版本**

如果是8.0.25的数据库，navicat连接报错1251-Client does not support

~~~powershell
// 创建容器 未挂载
[root@localhost ~]#docker run -id -p 1001:3306  --name=c_mysql --restart=always -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25
// 进入容器
[root@localhost ~]#docker exec -it Apai_mysql /bin/bash
// 在容器内 登录数据库
root@053f48be0dc7:~# mysql -uroot -proot
// 设置远程客户端（如navicat）连接的密码，不是mysql服务器的登录密码
mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'lj102528@';
~~~

使用外部机器连接容器中的mysql

> 记一次mysql启动报错。查看日志报错为：
>
> Can't open and lock privilege tables: Table storage engine for 'user'
>
> 方案：将datadir路径下的文件清空，然后执行如下命令：
>
> mysqld --initialize --user=mysql --basedir=/usr --datadir=/var/lib/mysql
>
> 然后重启：service mysql start 

## 2.Tomcat  部署

1、搜索tomcat镜像

```shell
[root@localhost ~]#docker search tomcat
```

2、拉取tomcat镜像

```shell
[root@localhost ~]#docker pull tomcat:8
```

3、创建容器，设置端口映射、目录映射

```shell
# 在/root目录下创建tomcat目录用于存储tomcat数据信息
[root@localhost ~]# mkdir tomcat
[root@localhost ~]# cd tomcat
[root@localhost tomcat]#docker run -id --name=c_tomcat -p 8080:8080 -v $PWD:/usr/local/tomcat/webapps tomcat:8
```

> 参数说明：
>
> -p 8080:8080：将容器的8080端口映射到主机的8080端口  （第一个8080是宿主机端口用来和tomcat做映射的，第二个8080是容器启动tomcat端口8080，第二个端口是tomcat容器默认启动的端口）
> -v $PWD:/usr/local/tomcat/webapps：将主机中当前目录挂载到容器的webapps 

4、使用外部机器访问tomcat

~~~java
// 在宿主机目录/root/tomcat下创建test目录。并在test目录下创建index.html。那么test目录会同步到c_tomcat容器的 /usr/local/tomcat/webapps里面
[root@localhost tomcat]# mkdir test
[root@localhost tomcat]# cd test/
[root@localhost test]# vim index.html #在index.html里面编写 <h1>hello tomcat</h1>
~~~

浏览器测试访问：

http://192.168.128.130:8080/test/index.html

## 3.Nginx  部署

1、搜索nginx镜像

```shell
[root@localhost ~]#docker search nginx
```

2、拉取nginx镜像

```shell
[root@localhost ~]#docker pull nginx
```

3、创建目录


```shell
[root@localhost ~]#mkdir nginx
[root@localhost ~]#cd nginx
[root@localhost ~]#mkdir conf
[root@localhost ~]#cd conf
[root@localhost ~]#vim nginx.conf
```

4、编写nginx.conf配置文件

~~~shell
user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on; 
    keepalive_timeout  65;
    include /etc/nginx/conf.d/*.conf;  
}
~~~

> 说明：
>
> 第四步其实可以省略，默认创建一个nginx容器，会在/etc/nginx/目录下生成一个叫nginx.conf的配置文件，nginx容器启动会去加载该文件，该文件的内容和第四步配置文件的内容相同。这个文件的末尾有include /etc/nginx/conf.d/*.conf;这句话，也就说在conf.d目录下并且以conf结尾的文件都会被加载，而这个目录下只有一个配置文件就是default.conf，default.conf文件的内容配置了一个server节点，以及默认访问nginx的目录和首页（/html/index.html）

5、创建nginx容器、端口映射、目录挂载

~~~powershell
[root@localhost ~]#docker run -id --name=c_nginx \
-p 80:80 \
-v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \  #不挂载这个配置文件也是可以的
-v /root/nginx/logs:/var/log/nginx \                    #nginx容器默认的日志文件保存到/var/log/nginx目录下
-v /root/nginx/html:/usr/share/nginx/html \             #nginx默认会去访问/usr/share/nginx/html下的index.html
nginx

// nginx的配置文件也可以进行 挂载 否则使用vim在容器进行修改
-v /root/nginx/conf.d:/etc/nginx/conf.d

docker run -id --name=c_nginx -p 80:80 -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/logs:/var/log/nginx -v /root/nginx/html:/usr/share/nginx/html nginx

docker run -id --name=c_nginx -p 81:80 -p 8004:8004 nginx
~~~

> 如果你不想挂载，所有的都可以不挂载，如果所有的都不挂载，默认情况，当创建nginx容器时，在/etc/nginx/目录下有nginx.conf这个文件，这个文件是nginx的配置文件，nginx容器启动的时候会去读这个配置文件

6、在宿主机的/root/nginx/html目录下新建 index.html，让其同步到/usr/share/nginx/html目录下

测试访问：http://192.168.128.130/



## 4.Redis  部署

1、搜索redis镜像

```shell
[root@localhost ~]#docker search redis
```

2、拉取redis镜像

```shell
[root@localhost ~]#docker pull redis:5.0
```

3、创建容器，设置端口映射

```shell
[root@localhost ~]#docker run -id --name=Apai_redis -p 6379:6379 --restart=always --restart=always redis:5.0

[root@localhost ~]#docker run -id --name=c_redis2 -p 6380:6380 -v /root/redis/conf/redis.conf:/usr/local/bin/myredis.conf redis:5.0 /bin/bash -c "redis-server /usr/local/bin/myredis.conf"
##把宿主机的redis.conf的port 改成port 6380

docker run -id --name=Apai_redis -p 6379:6379 --restart=always -v /Apai_File/redis/conf/redis.conf:/usr/local/bin/myredis.conf redis:5.0 /bin/bash -c "redis-server /usr/local/bin/myredis.conf"
##把宿主机的redis.conf的port 改成port 6380
docker run -id --name=Apai_redis -p 6380:6379 --restart=always redis:5.0 /bin/bash -c "redis-server /usr/local/bin/myredis.conf"
```

4、使用外部机器连接redis

```shell
[root@localhost ~]#./redis-cli.exe -h 192.168.149.135 -p 6379
```



## 5.RabbitMq 消息队列 

**注意:**

在java配置连接 消息队列  设置虚拟主机为: 

![image-20220807205534423](C:\阿派_文件夹\Gitee_Apai\Apai_Image_MD\MaYun_md\image-20220807205534423.png)

1.拉去rabbitMq镜像

```shell
docker pull rabbitmq:management
```

2.创建rabbitmq相关挂载目录 

```shell
mkdir -p /root/local/rabbitmq/{data,conf,log}
```

3.创建完成之后要对所创建文件授权权限，都设置成777 否则在启动容器的时候容易失败

```shell
chmod -R 777 /root/local/rabbitmq
```

4.镜像创建和启动容器

```shell
docker run --privileged=true -d -p 5672:5672 -p 15672:15672 --name rabbitmq -v /root/local/rabbitmq/data:/var/lib/rabbitmq -v /root/local/rabbitmq/conf:/etc/rabbitmq -v /root/local/rabbitmq/log:/var/log/rabbitmq --restart=always --hostname=rabbitmqhost -e RABBITMQ_DEFAULT_VHOST=my_vhost -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin rabbitmq
    
# 解析    
端口映射 -p 5672:5672 -p 15672:15672
容器名称 --name rabbitmq 
设置用户密码及镜像名 -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin rabbitmq
```

5.进入容器

```shell
docker exec -it rabbitmq bash
```

6.开启web管理端

```shell
rabbitmq-plugins enable rabbitmq_management
```

附加:  

```shell
1.首先进入容器 docker exec -it rabbitmq /bin/bash
2.创建用户 rabbitmqctl add_user admin1 admin1
3.给用户授权角色 rabbitmqctl set_user_tags admin1 administrator
4.给用户添加权限 rabbitmqctl set_permissions -p / admin1 ".*" ".*" ".*"
```

页面访问: http://192.168.174.133:15672



## 6.Nacos 注册中心

https://blog.csdn.net/u013305864/article/details/125611099

编写docker-compose.yml文件   启动该文件 命令： docker-compose up

```yml
nacos:
  image: nacos/nacos-server:latest
  container_name: nacos-8848
  environment:
    - PREFER_HOST_MODE=hostname
    - MODE=standalone   #单机模式启动
  volumes:
    - ./8848/logs/:/home/nacos/logs   #前面是宿主机名  后面是容器目录名
    - ./8848/init.d/custom.properties:/home/nacos/init.d/custom.properties
  ports:
  - "8848:8848"

```

nacos 的默认服务端口是 **8848** ，启动完成之后通过浏览器访问 nacos：http://127.0.0.1:8848/nacos 。

**第一种**（不推荐，因为不能连接数据库，进行持久化）

```shell
#搜索可以使用的镜像
docker search nacos
#拉取镜像
docker pull nacos/nacos-server

# 运行nacos  挂载  --restart=always -> 表示docker容器开机自启
docker  run --name nacos -d -p 8848:8848 --privileged=true --restart=always -e JVM_XMS=256m -e JVM_XMX=256m -e MODE=standalone -e PREFER_HOST_MODE=hostname -v /data/nacos/logs:/home/nacos/logs -v /data/nacos/conf:/home/nacos/conf nacos/nacos-server
# 不挂载 --restart=always -> 表示docker容器开机自启
docker run --name Apai_nacos -d -p 8848:8848 --privileged=true --restart=always -e JVM_XMS=256m -e JVM_XMX=256m -e MODE=standalone -e PREFER_HOST_MODE=hostname nacos/nacos-server

#--restart=always 开机启动

#检查是否启动
docker ps
#访问地址 默认账号密码是nacos/nacos
http://ip:8848/nacos
http://175.178.126.61:8848/nacos
```

第二种（强烈推荐用这种方式，因为可以持久化数据到数据库中，就算nacos容器出现了问题，数据也不受影响）
创建数据库脚本
https://github.com/alibaba/nacos/blob/master/config/src/main/resources/META-INF/nacos-db.sql

```shell
#推荐使用这种方式，可以连接自己的数据库
docker run -d -p 8848:8848 -p 9848:9848 \
--name nacos \
--env MODE=standalone \
--env SPRING_DATASOURCE_PLATFORM=mysql \
--env MYSQL_SERVICE_HOST=192.168.0.12 \
--env MYSQL_SERVICE_PORT=3306 \
--env MYSQL_SERVICE_DB_NAME=nacos \
--env MYSQL_SERVICE_USER=root \
--env MYSQL_SERVICE_PASSWORD=wisesoft \
nacos/nacos-server:latest

#访问地址 默认账号密码是nacos/nacos
http://ip:8848/nacos
```

```java
// -------- 补充 -----------
// 拉取指定版本的nacos https://blog.csdn.net/weixin_41798072/article/details/125945878
docker pull nacos/nacos-server:1.4.1
// 不挂载 --restart=always -> 表示docker容器开机自启
docker run --name Apai_nacos -d -p 8848:8848 --privileged=true --restart=always -e JVM_XMS=256m -e JVM_XMX=256m -e MODE=standalone -e PREFER_HOST_MODE=hostname nacos/nacos-server:1.4.1
```



## 7.Minio 对象存储

**拉取 minio 镜像**

```java
// minio 文件对象存储 类似阿里云oss
docker pull minio/minio 
```

**创建 minio 容器**

* --console-address ":9000" 表示minio的 前端页面的端口
* --address ":9090" 表示minio的文件上传API 的端口 | 在yml 需配置 9090

~~~shell
docker run -id --name=minio -p 9000:9000 -p 9090:9090 -e "MINIO_PROMETHEUS_AUTH_TYPE=public" \
-e "MINIO_ROOT_USER=minioadmin" -e "MINIO_ROOT_PASSWORD=minioadmin" \
-v /mnt/minio/data:/data -v /mnt/minio/config:/root/.minio minio/minio server /data \
--console-address ":9000" --address ":9090"
~~~

> --console-address ":9000" --address ":9090"  docker使用静态的固定端口，以避免启动时使用随机端口

浏览器访问：192.168.128.128:9000   

java上传:  9090







