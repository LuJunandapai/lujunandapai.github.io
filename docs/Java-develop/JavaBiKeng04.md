---
title: Java 避坑及技巧
date: 2023/04/26
---

## 四_Java 避坑及技巧



## Typora

> Typora 设置 阿里云 oss对象存储 作为云盘: https://blog.csdn.net/muxuen/article/details/122441469

## 集合

### 集合对象与对象之间为引用地址

```java
@Test
public void ee() {
    // 当集合或者MAP中的对象发生变化时或者即使不直接通过集合修改内部的对象，也会发生变化
    // 原因是集合或者MAP中的对象是引用类型，当集合或者MAP中的对象发生变化时，集合或者MAP中的对象也会发生变化
    List<UserInfo> list = new ArrayList<>();
    Map<Integer, UserInfo> map = new HashMap<>();
    UserInfo a = new UserInfo();
    UserInfo b = new UserInfo();
    UserInfo c = new UserInfo();
    UserInfo d = new UserInfo();
    list.add(a);
    list.add(b);
    list.add(c);
    list.add(d);
    map.put(1, a);
    map.put(2, b);
    map.put(3, c);
    map.put(4, d);
    a.setName("姓名");
    map.get(2).setName("map2");
    list.get(3).setName("list3");
    // 通过上方对应对象的修改，可以看出集合和MAP中的对象发生了变化
    System.out.println(list);
    System.out.println(map);
    System.out.println("-------------------");
}
```

### 调用其他方法跟集合参数的同步赋值

```java
@Test
    public void cc() {
        List<String> list = new ArrayList<>();
        setList(list);
        // 调用方法 传入的集合会同步赋值
        System.out.println(list);
    }

    private List<String> setList(List<String> list) {
        // 其他方法内部赋值 调用的集合也会同步赋值
        list.add("1");
        list.add("2");
        return list;
    }

    @Test
    public void dd() {
        String a = "1111";
        setste(a);
        // 调用方法 传入的string不会同步赋值
        System.out.println(a);
    }

    private String setste(String a) {
        // 其他方法内部赋值 调用的string不会同步赋值
        a = a + "2222";
        return a;
    }
```



## Spring Boot 篇

### 无法加载yml文件到target目录

> 具体问题: 

* 在Spring Boot启动中报错: Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could 
* 即没有加载到数据库的地址或者有误

> 问题解决

* 参考: https://blog.csdn.net/xie_yu1/article/details/106843652
* target目录没有加载yml配置文件 (缺少自动注入依赖)

```xml
<!-- 提供自动化装配功能 比如无法加载yml文件可解决 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
</dependency>
```



## Mybatis 篇

### MySql 批量修改报错

> 具体问题: 

* 使用 foreach 遍历 list 进行批量修改数据库数据报错

> 问题解决

* 参考: https://blog.csdn.net/qq_38807606/article/details/114300395
* 在yml链接数据库时没有开启sql语句携带分号，进行多语句执行
* mybatis 做批量修改的时候，需要配置文件中（数据库URL后面加上 &allowMultiQueries=true），允许通过代码进行 批量修改

```yaml
datasource:
	type: com.alibaba.druid.pool.DruidDataSource
	#MySQL配置
	driverClassName: com.mysql.cj.jdbc.Driver
	url: jdbc:mysql://localhost:3306/system?		useUnicode=true&characterEncoding=UTF8&useSSL=false&serverTimezone=Asia/Shanghai&allowMultiQueries=true&serverTimezone=UTC
	username: root
	password: 123456
```

```xml
void upIsById(@Param("list") List<TallyBook> tallyBooks);
    
<update id="upIsById">
    <foreach collection="list" item="item" separator=";">
        update tally_book set money = #{item.money} where id = #{item.id}
    </foreach>
</update>
```



## Liunx 系统

### Liunx 时间不一致

> Liunx 系统时间不一致

```shell
#有效期限：永久有效 | 用户局限：仅对当前用户
vim ~/.bashrc 
## 在最后一行添上：
export TZ='CST-8'
#保存、使生效
source ~/.bashrc
#查看
date

## vim ~/.bashrc 内容如下: 
## User specific aliases and functions
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
## Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi
export TZ='CST-8' ## 加上这句即可
```

> Docker 容器时间不一致

```shell
## 暂无
```



### Linux命令行提示-Fish

> fish是一个用户友好的命令行[外壳程序](http://baike.baidu.com/view/542.htm)全称Friendly Interactive Shell可用于如 [Linux](http://baike.baidu.com/view/1634.htm) 这样的 Unix 类[操作系统](http://baike.baidu.com/view/880.htm)中

```java
在开始输入命令的时候，fish 会自动补齐命令。
如果推荐的命令不是你想要的，按下键盘的 Tab 键可以浏览更多选择。
如果正好是你想要的，按下键盘的向右键补齐命令，然后按下 Enter 执行。
// 参考: https://blog.csdn.net/anyhowanywhere/article/details/125282679
// 参考: https://blog.csdn.net/oiken/article/details/71081959
```

#### Fish 安装  

1.用下面的命令更新仓库：

```
yum repolist
yum update
```

2.然后用下面的命令安装 fish：

```
yum install fish
```

3.改为默认shell

```crystal
## 执行这条命令查看路径
which fish
## 我的路径如下
/usr/bin/fish
## 设置默认shell
chsh -s /usr/bin/fish
```

4.重启终端打开即可

#### Fish 使用

```java
// 如何使用 Fish Shell ？
一旦你成功安装了 fish shell 。只需在你的终端上输入 fish ，它将自动从默认的 bash shell 切换到 fish shell
fish 用起来可能没你想象的那么直观。记住，fish 是一个 shell，所以在使用命令之前你得先登录进去。在你的终端里，运行命令 fish 然后你就会看到自己已经打开了一个新的 shell
在开始输入命令的时候，fish 会自动补齐命令。
-- 如果推荐的命令不是你想要的，按下键盘的 Tab 键可以浏览更多选择。
-- 如果正好是你想要的，按下键盘的向右键补齐命令，然后按下 Enter 执行。
在用完 fish 后，输入 exit 来退出 shell
history 可以查看历史命令，history |grep command可以搜索历史命令
```





### Nginx 搭建本地静态文件夹

参考: https://blog.csdn.net/weixin_30345577/article/details/95156233

```java
为了解决项目组内容应用，打算把本地的e:tools目录共享出来，具体操作步骤如下
1、下载安装包：http://nginx.org/download/nginx-1.9.15.zip
2、解压缩
3、修改配置文件nginx.conf，在server部分添加以下内容
location /tools {
    alias   E:\Tools;
    allow all;
    autoindex on;
}
4、启动服务:E:\Tools\Nginx\nginx-1.9.15>start nginx.exe
5、访问文件，此时便可对文件夹内容进行浏览和文件下载：
6、如果改变配置文件，则可重新加载配置：E:\Tools\Nginx\nginx-1.9.15> nginx.exe -s reload
7、停止服务：E:\Tools\Nginx\nginx-1.9.15> nginx.exe -s stop
8、访问文件夹 静态共享: http://127.0.0.1/file/
```

```conf
http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    #charset utf8;
    charset gbk，utf8;

    server {
        listen       80;
        server_name  localhost;
		#charset utf8;

        location / {
            root   html;
            index  index.html index.htm;
        }

        location /tools {
            alias  C:\Tools;
            allow  all;
            autoindex on;
            autoindex_exact_size off;
            autoindex_localtime on;
        }

    	error_page   500 502 503 504  /50x.html;
            location = /50x.html {
            root   html;
        }
    }

}
```

### win系统: Docker Desktop 

> 内置Linux系统 且可视化 Docker 容器

#### Docker Desktop  安装

1.安装[docker](https://so.csdn.net/so/search?q=docker&spm=1001.2101.3001.7020) desktop for windows需要Hype-v的支持

https://blog.csdn.net/m0_73795841/article/details/127441288

2.Docker Desktop for Windows 下载:
https://docs.docker.com/desktop/install/windows-install/

#### Docker Desktop  使用

1.面板

2.cmd黑窗口:  可直接输入docker 相关的命令即可



## IDEA 技巧篇

### IDEA功能

#### 连接服务器Docker

参考: https://blog.csdn.net/hanxiaotongtong/article/details/124240589

> 服务器端

```shell
## 1. 修改配置文件vim /usr/lib/systemd/system/docker.service，这是开启docker远程访问服务的第一步。0.0.0.0:2375表示在当前主机上所有网卡监听2375端口。修改ExecStart这行
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375  -H unix:///var/run/docker.sock  --containerd=/run/containerd/containerd.sock
## 2. 重新加载配置文件，并重启docker守护进程
systemctl daemon-reload && systemctl restart docker
## 3. 查看端口是否开启,有一行记录显示2375端口被监听，即正确 或者通过浏览器访问http://<docker宿主机ip>:2375/info也可以进行验证,有响应结果即正确，返回的是一个JSON的docker服务状态及配置信息
netstat -nptl|grep 2375;
http://175.178.126.61:1011/info
## 4. 需要注意的是如果你的服务器上防火墙没有开放2375端口访问，请使用下面的命令开放2375端口(注意：下面的命令行适用于CentOS7、8发行版，如果你是其他的linux发行版，命令可能不一样)。
firewall-cmd --zone=public --add-port=2375/tcp --permanent;   #配置开放端口
firewall-cmd --reload;   #重新加载配置
```

> IDEA 设置

![image-20230322155327956](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20230322155327956.png)



### IDEA设置

#### 自动加载jar包依赖

![image-20220523121950429](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/nrwpyc-0.png)

#### 新窗口打开项目:

![image-20220608191622725](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/nrwkqb-0.png)

#### 隐藏项目多余的文件夹

![image-20221118102532178](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/ns5ndf-0.png)

#### Translation 翻译无法联网

> IDEA2022 翻译软件Translate提示：更新 TKK 失败，请检查网络连接 | 使用百度翻译

```java
// 修改系统hosts文件，路径：C:\Windows\System32\drivers\etc 添加以下信息：
203.208.40.66 translate.google.com
203.208.40.66 translate.googleapis.com
```

#### IDEA 热部署

在web项目执行中 使用Debug启动 表现出进行更改后无需重启 使用热部署即可进行更新  

https://blog.csdn.net/m0_58761900/article/details/128802206

> 配置依赖

```xml
<!-- 热部署依赖 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-devtools</artifactId>
  <scope>runtime</scope>
</dependency>
```

> 下载插件 EditStarters 可进行快速添加依赖

![image-20230209145534723](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/o4o0xz-0.png)

> Settings 开启项目自动编译

![image-20230209145727929](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/o4blj7-0.png)

![image-20230209145802445](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/o42jfv-0.png)

> 使用 Debug运行程序即可



### IDEA 插件

#### 1.中文板 IDEA

> Chinese Language Pack : 中文板 IDEA

####  2.翻译插件

> Translation   翻译插件，鼠标选中文本，点击右键即可自动翻译成多国语言。

#### 3.彩色括号显示

> Rainbow Brackets  彩色括号

#### 4.快捷键提示插件

> Key Promoter X    快捷键提示插件。当你执行鼠标操作时，如果该操作可被快捷键代替，会给出提示，帮助你自然形成使用快捷键的习惯，告别死记硬背

#### 5.设置背景图片

> Background Image Plus +    给编辑器设置背景图片

#### 6.自动提示和补全代码

> Tabnine AI Code Completion    使用 AI 去自动提示和补全代码，比 IDEA 自带的代码补全更加智能化

#### 7.MyBatis 增强插件

> MybatisX   MyBatis 增强插件，支持自动生成 entity、mapper、service 等常用操作的代码，优化体验

#### 8.文件 yml  和  xml 互转

> Convert YAML and Properties File   文件 yml  和  xml 互转

#### 9.接口快速测试

> RestfulTool : 能够自动检测表现层的接口进行快速测试 [ 发送请求参数 类似于浏览器发送请求]

* 根据url快速搜索接口:   Ctrl + Alt + /

#### 10.自定义代码生成器

> Easy Code: 能够自定义的根据数据库表来自定义生成器

#### 11.人工智能代码提示

> GitHub Copilot: 人工智能代码提示 [需充值授权后使用]

#### 12.Sql语句提取

> batslog / MyBatis Log Free :  在配置了sql日志打印的前提下 该插件会自动提取sql日志进行编排然后显示

* https://blog.csdn.net/pxg943055021/article/details/124708499

#### 13. git 版本管理

> gitee   |   能够从gitee平台直接拉取项目和推送

#### 14.主题

> Xcode-Dark Theme 主题

#### 15.缩略图

> CideGlance2

#### 16.热部署

> EditStarters
>
> https://blog.csdn.net/m0_58761900/article/details/128802206

#### 17.Restful Fast Reque (收費)

> 能够自动检测表现层的接口进行快速测试 [ 发送请求参数 类似于浏览器发送请求]



## WebStorm 前端

> 破解方法跟IDEA一致

![image-20221118165429503](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221118165429503.png)



## 生活小常识

### 局域网不同设备传输

```java
// 在互传的两端打开这个网址即可 开始传输文件
https://snapdrop.net/
```

```java
// 使用win系统的nginx搭建静态文件夹
参考: https://blog.csdn.net/weixin_30345577/article/details/95156233
```





















