---
title: Java 开发的工具
date: 2023/04/26
---

## | --- Java 开发的工具

--------------------------------------------------------------------------------------------------------

## 代码查看_笔记

### 1.Typora MD 文档

> java 代码笔记工具

注意: 备份笔记图片 

* 默认图片存放地址: C:\Users\Lujun\iCloudDrive\风吹着花海香\那一刻的月亮\imges

* 拷贝该文件夹 放入该路径下 在打开笔记即可同步图片


> typora 配合 gitee 实现图片云存储

1.gitee 新建代码仓库, 公开

![image-20220906190739323](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220906190739323.png)

2.使用小章鱼克隆到本地文件夹, 将MD存储的图片存入该文件夹

![image-20220906190815912](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220906190815912.png)

3.将面对 MD 的图片地址全部替换 gitee仓库图片的地址

```java
源地址: C:\Users\Lujun\iCloudDrive\风吹着花海香\那一刻的月亮\apai_imags[防止替换]\
替换: 
云地址: https://gitee.com/LuisApai/Apai_image_MD/raw/master
```

![image-20220906190908376](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220906190908376.png)

4.最后我们可以每次手动使用小章鱼上传图片, 替换地址后,直接上传CSDN即可显示图片



### 2.Notepad++:  代码查看器

> Notepad++: 代码查看器

![image-20220531105540340](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220531105540340.png)



--------------------------------------------------------------------------------------------------------

### 3.EditPlus 代码查看器

http://zhangzj.com/1899/11/30/editplus-install/

> 激活: 

Username填写：Vovan      |       Regcode填写：3AG46-JJ48E-CEACC-8E6EW-ECUAW

![image-20220829201313790](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220829201313790.png)

![image-20220830120945105](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220830120945105.png)

1. 安装软件后 进行激活
2. 将汉化主程序放桌面



## Java 基础必备

### JDK 8 

> jdk 8 安装步骤【最后一项环境变量即可不配】

https://blog.csdn.net/weixin_42182599/article/details/107370719



### MySQL8数据库

### Navicat Premium 数据库可视化

### powerdesigner 表设计模型

### Eclipse:  代码编写工具



### Visual Studio Code:  前端

#### 常用插件:

##### vue 导入路径提示

![image-20220620095448774](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220620095448774.png)

#### 软件设置:

##### 用户代码片段

> 能够储存 重复使用的代码 使用只需要按下设置的快捷键
>
> 位置: 左下角齿轮设置里  -->  用户代码片段
>
> /t  空格     /"  双引号

![image-20220606152759874](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606152759874.png)

> 中文模板

```json
{
	"HTML-template": {
		"prefix": "!",  // 触发用户代码片段的字符
		"body": [
			"<!DOCTYPE html>",
			"<html lang=\"zh-cn\">",
			"<head>",
			"\t<meta charset=\"UTF-8\">",
			"\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
			"\t<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">",
			"\t<title>网页名</title>",
			"\t<style>\n",
			"\t</style>",
			"</head>\n",
			"<body>\n",
			"</body>",
			"</html>"
		],
		"description": "默认中文" // 模板的描述
	}
}
```

> Vue 模板

```json
{
	"Vue-template": {
		"prefix": "vml",  // 触发用户代码片段的字符
		"body": [
			"<script src=\"js/vue.js\" ></script>",
			"<script>",
			"\tconst vm = new Vue({",
			"\t\tel: '#app',",
			"\t\tdata: {",
			"\t\t\t",
			"\t\t},",
			"\t\tmethods: {",
			"\t\t\t",
			"\t\t},",
			"\t})",
			"</script>",
		],
		"description": "vue 模板" // 模板的描述
	}
}
```



### IDEA:  代码编写工具

#### IDEA 配置方法:

* https://www.zhuxianfei.com/java/46559.html
* https://blog.csdn.net/wujiangbo520/article/details/126733271

##### 文件说明

![image-20220523121107254](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220523121107254.png)

##### 自动加载jar包依赖

![image-20220523121950429](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220523121950429.png)

##### 新窗口打开项目:

![image-20220608191622725](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220608191622725.png)

##### 隐藏项目多余的文件夹

![image-20221118102532178](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221118102532178.png)

##### IDEA 插件中心无法联网

```java
// 代理配置URL:  http://127.0.0.1:1080
// https://www.cnblogs.com/renlywen/p/13458928.html
```

![image-20220616101213616](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220616101213616.png)

##### Translation 翻译无法联网

> IDEA2022 翻译软件Translate提示：更新 TKK 失败，请检查网络连接

```java
// 修改系统hosts文件，路径：C:\Windows\System32\drivers\etc 添加以下信息：
203.208.40.66 translate.google.com
203.208.40.66 translate.googleapis.com
```

使用百度翻译

##### IDEA 热部署

在web项目执行中 使用Debug启动 表现出进行更改后无需重启 使用热部署即可进行更新  

https://blog.csdn.net/m0_58761900/article/details/128802206

#### IDEA 插件

##### 1.中文板 IDEA

> Chinese Language Pack : 中文板 IDEA

![image-20221007122013317](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122013317.png)

#####  2.翻译插件

> Translation   翻译插件，鼠标选中文本，点击右键即可自动翻译成多国语言。

![image-20221007122101872](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122101872.png)

##### 3.彩色括号显示

> Rainbow Brackets  彩色括号

![image-20221007122154501](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122154501.png)

##### 4.快捷键提示插件

> Key Promoter X    快捷键提示插件。当你执行鼠标操作时，如果该操作可被快捷键代替，会给出提示，帮助你自然形成使用快捷键的习惯，告别死记硬背

![image-20221007122220488](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122220488.png)

##### 5.设置背景图片

> Background Image Plus +    给编辑器设置背景图片

##### 6.自动提示和补全代码

> Tabnine AI Code Completion    使用 AI 去自动提示和补全代码，比 IDEA 自带的代码补全更加智能化

##### 7.MyBatis 增强插件

> MybatisX   MyBatis 增强插件，支持自动生成 entity、mapper、service 等常用操作的代码，优化体验

![image-20221007122323462](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122323462.png)

##### 8.文件 yml  和  xml 互转

> Convert YAML and Properties File   文件 yml  和  xml 互转

![image-20221007122357517](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007122357517.png)

##### 9.接口快速测试

> RestfulTool : 能够自动检测表现层的接口进行快速测试 [ 发送请求参数 类似于浏览器发送请求]

* 根据url快速搜索接口: **Ctrl + Alt + /**

![image-20221007121848329](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007121848329.png)

##### 10.自定义代码生成器

> Easy Code: 能够自定义的根据数据库表来自定义生成器

![image-20221007121726208](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007121726208.png)

##### 11.人工智能代码提示

> GitHub Copilot: 人工智能代码提示 [需充值授权后使用]

![image-20221007121827811](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221007121827811.png)

##### 12.Sql语句提取

> batslog / MyBatis Log Free :  在配置了sql日志打印的前提下 该插件会自动提取sql日志进行编排然后显示

* https://blog.csdn.net/pxg943055021/article/details/124708499

![image-20221115150400331](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221115150400331.png)

![image-20221117115834159](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221117115834159.png)

##### 13. git 版本管理

> gitee   |   能够从gitee平台直接拉取项目和推送

![image-20221117153940533](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221117153940533.png)

##### 14.主题

![image-20221118172320766](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221118172320766.png)

##### 15.缩略图

![image-20221118174007256](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221118174007256.png)



### WebStorm 前端

> 破解方法跟IDEA一致

![image-20221118165429503](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221118165429503.png)



### Maven:  项目

#### 下载 maven

官网：http://maven.apache.org/

```
Maven 下载后，将 Maven 解压到一个没有中文没有空格的路径下，比如 D:\apache-maven-3.6.3 下面。解压后目录结构如下：
bin:存放了 maven 的命令，比如我们前面用到的 mvn tomcat:run
boot:存放了一些 maven 本身的引导程序，如类加载器等
conf:存放了 maven 的一些配置文件，如 setting.xml 文件
lib:存放了 maven 本身运行所需的一些 jar 包
至此，我们的 maven 软件就可以使用了，前提是你的电脑上之前已经安装并配置好了 JDK
```

![image-20220917160723869](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160723869.png)

![image-20220917160742287](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160742287.png)

Maven版本环境测试: 通过 mvn -v 命令检查 maven 是否安装成功

```java
教程:
apache-maven-3.6.3-bin.zip - 解压即用
注意: 环境配置
1.为了正常使用Maven，需要先安装Java环境，这里以JDK8相关版本为例，配置MAVEN_HOME变量值就是maven的安装路径
2.配置bin目录到path环境变量：%MAVEN_HOME%\bin
3.通过 mvn -v 命令检查 maven 是否安装成功，

下载仓库配置:

1.在maven 的安装目录下 /conf/settings.xml文件中配置本地仓库位置
 <localRepository>d:/repository</localRepository>


2.Maven镜像的配置
由于Maven 仓库默认在国外, 国内使用难免很慢,我们可以更换为阿里云的仓库
<mirror>
    <id>nexus-aliyun</id>
    <mirrorOf>central</mirrorOf>
    <name>Nexus aliyun</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>


地址和下载镜像配置完成  
     1. 解压 mavendemo.rar
     2. 在解压文件类 开启 cmd 
     3. 输入 mvn compile  开启下载
```

```
常用命令
	注意:  需要在src - pom.xml文件夹下 调用 cmd
	开始编译
		mvn compile
			会在src 文件夹里 生成编译文件夹 - target 目录
	删除编译 target 目录
		mvn clean
	测试
		mvn test
	打包源程序
		mvn package
	安装本地仓库
		mvn instaall
```

```
IDEA
	构建命令.png
	maven - idea 设置.png
		插件.png
	IDEA 导入 maven 项目.png
	IDEA 创建 maven 项目.png
	maven项目-目录结构.png
```

![image-20220917160908561](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160908561.png)

![image-20220917160919092](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160919092.png)

![image-20220917160930922](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160930922.png)

![image-20220917160941172](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160941172.png)

![image-20220917160954091](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917160954091.png)

![image-20220917161003784](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220917161003784.png)

--------------------------------------------------------------------------------------------------------



### Tomcat:  服务器



### Postman: 请求测试

#### Postman: 桌面端

Postman: 测试接口 模仿浏览器发送请求和数据

**postman官网下载地址** https://www.postman.com/downloads/

**postman汉化包** https://github.com/hlmd/Postman-cn/releases

**github安装汉化** https://github.com/hlmd/Postman-cn

注意: 禁止更新软件

版本下载:

| 最新版本下载     | [官方下载页面](https://www.postman.com/downloads/)下载链接：[Win64 ](https://dl.pstmn.io/download/latest/win64)[Win32 ](https://dl.pstmn.io/download/latest/win32)[Mac ](https://dl.pstmn.io/download/latest/osx)[Linux](https://dl.pstmn.io/download/latest/linux) |
| ---------------- | :----------------------------------------------------------- |
| **历史版本下载** | 请把下面链接的“版本号”替换为指定的版本号，例如：8.8.0        |
| Windows64位      | https://dl.pstmn.io/download/version/版本号/win64            |
| Windows32位      | https://dl.pstmn.io/download/version/版本号/win32            |
| Mac 英特尔芯片   | https://dl.pstmn.io/download/version/版本号/osx_64           |
| Mac 苹果芯片     | https://dl.pstmn.io/download/version/版本号/osx_arm64        |
| Linux            | https://dl.pstmn.io/download/version/版本号/linux            |

汉化注意: 两端的版本须一致

汉化步骤 解压app 之后放入Postman安装目录的 C:\Users\Lujun\AppData\Local\Postman\app-9.12.2\resources 里 重启完成

![image-20220531111628340](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220531111628340.png)

![image-20220531105721596](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220531105721596.png)

#### 使用方法

> ##### 测试 文件上传

![image-20220806144007434](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220806144007434.png)

#### Postman 谷歌插件版

> 可在谷歌浏览器 谷歌商店下载 Postman 谷歌插件版

![image-20220531110801240](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220531110801240.png)



--------------------------------------------------------------------------------------------------------





## HTML 常用工具

### 1.Node.js :  服务端_ JavaScript

#### 介绍

> 简单的说 Node.js 就是运行在服务端的 JavaScript。
>
> Node.js 是一个基于 Chrome JavaScript 运行时建立的一个平台。
>
> Node.js 是一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google 的 V8 引擎，V8 引擎执行 Javascript 的速度非常快，性能非常好。

#### 安装方法

**npm nodejs 安装**：https://blog.csdn.net/jike11231/article/details/107834744

> 下载 二进制 64 为的安装压缩包 解压方到指定即可
>
> 注意: 别解压至 C盘的敏感文件夹

##### 配置环境

![image-20220606204244112](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606204244112.png)

##### 在 cmd 下载配置

> cmd  ---  指令:  npm i -g json-server
>
> 成功后 显示 ok 或者查看 安装路径的是否下载
>
> cmd  ---  指令:  npm list -g --depth 0

![image-20220606210532128](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606210532128.png) 

##### 启动

创建一个目录server,在该目录下创建一个json文件，db.json文件

在server目录下执行  cmd 执行命令:  json-server --watch db.json

![image-20220606223447942](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606223447942.png)

##### db.json 文件 进入 数据

![image-20220606223543898](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606223543898.png)

```json
{
    "users" : [
        {
            "name": "小阿派",
            "age": 25,
            "sex": "男"
        },
        {
            "name": "战三",
            "age": 12,
            "sex": "男"
        },
        {
            "name": "小雪",
            "age": 15,
            "sex": "女"
        }
    ]
}
```

##### 浏览器进行 CRUD

查询:   http://localhost:3000/users



### 2.nrm  管理npm的工具 

> **使用 cmd 安装**

#### npm list -g --depth 0

![image-20220615113000062](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615113000062.png)

#### npm install nrm -g  

> **或者  npm install Pana/nrm -g**

![image-20220615112715312](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615112715312.png)

#### nrm ls

#### nrm use taobao

![image-20220615112925275](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615112925275.png)

#### npm config list

![image-20220615113350462](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615113350462.png)





### 3.Vue-cli4 安装

> vue-cli 换过一次名字。在 3.0 之前叫 vue-cli ，从 3.0 开始更名位 @vue/cli 。现在是 4.x 版本。
>
> 建议使用 @vue/cli 而非 vue-cli ，毕竟 vue-cli 太久远了。

- [x] **使用 cmd 安装**

#### 删除已安装  vue-cli 

>  vue-cli 删除已安装   npm uninstall -g vue-cli

#### 查看安装 项

> 查看安装  npm list -g --depth 0

![image-20220615125616519](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615125616519.png)

#### @vue/cli@5.0.4 安装

>  @vue/cli@5.0.4 安装:   npm install -g @vue/cli@5.0.4

![image-20220615125459774](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615125459774.png)

#### 查看是否安装成功

> vue -V

![image-20220615142248305](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615142248305.png)





<hr>





### 4.创建vue-cli4项目

> vue-cli4项目:  类似前端的服务器
>
> 如下配置

![image-20220615143024322](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615143024322.png)

#### 创建步骤

- 第一步：创建项目

  使用如下命令开始创建 vue 项目（这里示例项目名为 *vue-cli-demo* ）：

  ```ini
  vue create vue-cli-demo
  ```

  你会看到如下内容：

  ![image-20220615194410053](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194410053.png)

  - 第一项（ `default ...`）表示的是使用默认配置创建 vue 项目。

  - 第二项（ `Manually ...`）表示手动对 vue 项目的各方面进行设置。**我们选择第二项** 。

    可以使用『**上下方向键**』来切换选项。

    <font color=red>提示：如果只需要 babel 和 eslint 支持，不需要其它任何功能，那么选择第一项，就完事了。不过，我们在学习过程中一般不会使用 eslint 。</font>


- 第二步

  在上一步选中第二项后，你会看到如下界面：

  ![image-20220615194459880](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194459880.png)

  在这个界面中，去需要去选择你的 vue 项目所要用到的特性。在特性列表中，`Babel` 和 `Linter / Formatter` 两项默认是选中的。

  vue-cli 内置支持了 8 个功能特性，可以多选。使用『**方向键**』在特性选项之间切换，使用『**空格键**』选中当前特性，使用 **a 键** 切换选择所有，使用 **i 键** 翻转选项。

  对于每一项的功能，此处做个简单描述：

  ```ini
  Babel：支持使用 babel 做转义。
  TypeScript：支持使用 TypeScript 书写源码。
  Progressive Web App (PWA) Support PWA：支持。
  Router：支持 vue-router。
  Vuex：支持 vuex。
  CSS Pre-processors：支持 CSS 预处理器。
  Linter / Formatter：支持代码风格检查和格式化。
  Unit Testing：支持单元测试。
  E2E Testing： 支持 E2E 测试。
  ```

  对于我们（非前端开发工程师、Java 全栈开发工程师、Java 后端开发工程师）而言，**Babel** 和 **Router** 是必选的。**Vuex** 和 **CSS Pre-processors** 可能会用到

  选择vue版本为2，不要选3，不要选3

  ![image-20220615194626845](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194626845.png)



- 第三步

  如果在功能选择界面中选中了 **Router**，那么我们接下来会看到如下界面（如果功能界面没有选择 Router，就会跳过这个界面）：

  ![image-20220615194701346](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194701346.png)

  在这个界面中，vue-cli 在询问你，对于 **Router** 你是否以它的 **history** 模式使用它？默认值是 `Yes` 。

  如果不使用 Router 的 **history** 模式，那自然就是 **hash** 模式。这里我们输入 `n`，表示使用 Router 的 **hash** 模式。


- 第四步

  在设置完你所要使用的各个功能的设置之后（例如，上面的 Router 的 history / hash 模式的设置）， 我们会看到下面界面：

  ![image-20220615194818540](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194818540.png)

  在这个界面中，vue-cli 是在询问你：是将所有的配置都放在 **pacakge.json** 一个文件中，还是将各个功能的配置分开存放在独立的文件中？

  <font color=red>选择第一项：分开存放。</font>


- 第五步

  这是 vue-cli 创建 vue 项目的最后一个界面：

  ![image-20220615194847324](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194847324.png)

  在这里，vue-cli 是在询问你：是否将你的这些设置保留下来作为默认的项目设置的模板。默认值是 `N` 。

  我们输入 `N` ，或者直接按回车确认进入安装界面：

  ![image-20220615194956437](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615194956437.png)

#### 启动项目

**关闭项目:  ctrl + c**  

##### cmd启动: 

cmd   -->  cd 项目文件夹 进入

在控制台中输入：npm run serve   注意: cmd保存运行 关闭则无法访问

浏览器访问  http://localhost:8080

##### VS code 启动:

> 方式一: 手敲

1.在 VS code 导入创建的文件夹 项目

2.创建终端

![image-20220615150447710](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615150447710.png)

3.调出控制台 输入 npm run serve

![image-20220615150604253](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615150604253.png)

> 方式二: 调试

![image-20220615151702140](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615151702140.png)

![image-20220615145008127](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615145008127.png)

--------------------------------------------------------------------------------------------------------



### 5.Element UI 前端框架

> 安装:   vue add element
>
> 安装选项  注意: 需在项目的cmd开启安装

![image-20220615170516739](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615170516739.png)

### 6.Axios  安装异步请求

> 安装:   vue add axios

![image-20220615171520521](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615171520521.png)

### 7.谷歌浏览器插件

> Vue.js devtools    vue 浏览器插件: 可查看网页的data的值等功能

安装方法: 谷歌商店直接下载安装 或者 自行下载往浏览器扩展安装  安装记得打开允许网页访问 重启浏览器





## Linux 系统


### 1.Linux虚拟机

#### VMware Workstation Pro

> 傻瓜式安装

**创建: **

![image-20220621101900625](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220621101900625.png)

![image-20220621101916102](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220621101916102.png)

![image-20220621101935396](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220621101935396.png)

![image-20220621102008124](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220621102008124.png)

![img](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/PGZV7JG5MX$0D7XE0%5DGOWIU.jpg)

![image-20220718200051937](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220718200051937.png)

![img](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/Z0LD80%7BPG%7BH$XP7YXG3Q%5D%5BE.jpg)

![img](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/2%5BSVFLG%7DVO49%7DSRC@I_4%5BA1.jpg)

![image-20220718200122676](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220718200122676.png)

![img](https://gitee.com/LuisApai/Apai_image_MD/raw/master/8(4L7YK)HCR9VAROEF%WK7C.jpg)

![img](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/LTW%5B6A$LD$RR%7D@IAPLNOUV.jpg)

![image-20220718200146012](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220718200146012.png)



### 2.Xshell 7

> 连接Linux系统的可视化工具 | 傻瓜式安装



### 3.Xftp 7

> 连接Linux系统的可视化文件传输工具 | 傻瓜式安装



### 4.Docker 应用部署

#### Mysql  部署

1、搜索mysql镜像

```powershell
[root@localhost ~]#docker search mysql
```

2、拉取mysql镜像

```powershell
[root@localhost ~]#docker pull mysql:5.6
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
docker run -id -p 3307:3306 --name=c_mysql -v /root/mysql/conf:/etc/mysql/conf.d -v /root/mysql/logs:/var/log/mysql -v /root/mysql/data:/var//lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25
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
[root@localhost ~]#docker run -id -p 3308:3306 --name=c_mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.0.25
// 进入容器
[root@localhost ~]#docker exec -it c_mysql /bin/bash
// 在容器内 登录数据库
root@053f48be0dc7:~## mysql -uroot -proot
// 设置远程客户端（如navicat）连接的密码，不是mysql服务器的登录密码
mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
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

#### Tomcat  部署

1、搜索tomcat镜像

```shell
[root@localhost ~]#docker search tomcat
```

2、拉取tomcat镜像

```shell
[root@localhost ~]#docker pull tomcat
```

3、创建容器，设置端口映射、目录映射

```shell
## 在/root目录下创建tomcat目录用于存储tomcat数据信息
[root@localhost ~]## mkdir tomcat
[root@localhost ~]## cd tomcat
[root@localhost tomcat]#docker run -id --name=c_tomcat -p 8080:8080 -v $PWD:/usr/local/tomcat/webapps tomcat:8
```

> 参数说明：
>
> -p 8080:8080：将容器的8080端口映射到主机的8080端口  （第一个8080是宿主机端口用来和tomcat做映射的，第二个8080是容器启动tomcat端口8080，第二个端口是tomcat容器默认启动的端口）
> -v $PWD:/usr/local/tomcat/webapps：将主机中当前目录挂载到容器的webapps 

4、使用外部机器访问tomcat

~~~java
// 在宿主机目录/root/tomcat下创建test目录。并在test目录下创建index.html。那么test目录会同步到c_tomcat容器的 /usr/local/tomcat/webapps里面
[root@localhost tomcat]## mkdir test
[root@localhost tomcat]## cd test/
[root@localhost test]## vim index.html #在index.html里面编写 <h1>hello tomcat</h1>
~~~

浏览器测试访问：

http://192.168.128.130:8080/test/index.html

#### Nginx  部署

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
~~~

> 如果你不想挂载，所有的都可以不挂载，如果所有的都不挂载，默认情况，当创建nginx容器时，在/etc/nginx/目录下有nginx.conf这个文件，这个文件是nginx的配置文件，nginx容器启动的时候会去读这个配置文件

6、在宿主机的/root/nginx/html目录下新建 index.html，让其同步到/usr/share/nginx/html目录下

测试访问：http://192.168.128.130/

#### Redis  部署

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
[root@localhost ~]#docker run -id --name=c_redis -p 6379:6379 redis:5.0

[root@localhost ~]#docker run -id --name=c_redis2 -p 6380:6380 -v /root/redis/conf/redis.conf:/usr/local/bin/myredis.conf redis:5.0 /bin/bash -c "redis-server /usr/local/bin/myredis.conf"
##把宿主机的redis.conf的port 改成port 6380
```

4、使用外部机器连接redis

```shell
[root@localhost ~]#./redis-cli.exe -h 192.168.149.135 -p 6379
```

#### RabbitMq 消息队列 

**注意:**

在java配置连接 消息队列  设置虚拟主机为: 

![image-20220807205534423](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220807205534423.png)

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
    
## 解析    
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

#### Nacos 注册中心

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



#### Minio 对象存储

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



### 5.Rabbitmq 直接安装安装

> rabbitmq 默认端口: 5672   内置web页面默认端口: 15672

说明：请使用资料里提供的CentOS-7-x86_64-DVD-1810.iso 安装虚拟机. 

#### 1. 安装依赖环境

在线安装依赖环境：

```shell
yum install build-essential openssl openssl-devel unixODBC unixODBC-devel make gcc gcc-c++ kernel-devel m4 ncurses-devel tk tc xz
```

#### 2. 安装Erlang

根据课前提供的资料，上传如下三个rpm文件

erlang-18.3-1.el7.centos.x86_64.rpm
socat-1.7.3.2-5.el7.lux.x86_64.rpm
rabbitmq-server-3.6.5-1.noarch.rpm

1、安装erlang-18.3-1.el7.centos.x86_64.rpm

~~~shell
rpm -ivh erlang-18.3-1.el7.centos.x86_64.rpm
~~~

> **出错才进行一下配置**
>
> 如果不是采用CentOS-7-x86_64-DVD-1810.iso安装的系统，则有可能出现如下错误

![1565526174751](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1565526174751.png)

说明gblic 版本太低。我们可以查看当前机器的gblic 版本

```shell
strings /lib64/libc.so.6 | grep GLIBC  #有的机器当前最高版本2.12，需要2.15.所以需要升级glibc
```

首先使用yum更新安装依赖

```shell
sudo yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make -y
```

然后使用wget命令下载要安装的rpm包

```shell
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-utils-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-static-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-common-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-devel-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/glibc-headers-2.17-55.el6.x86_64.rpm &
wget http://copr-be.cloud.fedoraproject.org/results/mosquito/myrepo-el6/epel-6-x86_64/glibc-2.17-55.fc20/nscd-2.17-55.el6.x86_64.rpm &
```

安装rpm包

```shell
sudo rpm -Uvh *-2.17-55.el6.x86_64.rpm --force --nodeps
```

安装完毕后再查看glibc版本

```shell
strings /lib64/libc.so.6 | grep GLIBC  #发现glibc版本已经到2.17了
```

#### 3. 安装RabbitMQ

```powershell
[root@localhost ~]#rpm -ivh socat-1.7.3.2-1.1.el7.x86_64.rpm --nodeps
[root@localhost ~]#rpm -ivh rabbitmq-server-3.6.5-1.noarch.rpm
```


#### 4. 开启管理界面及配置

```powershell
## 开启管理界面
[root@localhost ~]#rabbitmq-plugins enable rabbitmq_management
## 修改默认配置信息
[root@localhost ~]#vim /usr/lib/rabbitmq/lib/rabbitmq_server-3.6.5/ebin/rabbit.app 
## 比如修改密码、配置等等，例如：loopback_users 中的 <<"guest">>,只保留guest

```

![image-20210315112551706](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210315112551706.png) 


#### 5. rabbitmq-server服务启动

```sh
[root@localhost ~]#service rabbitmq-server start ## 启动服务
[root@localhost ~]#service rabbitmq-server stop ## 停止服务
[root@localhost ~]#service rabbitmq-server restart ## 重启服务
```

#### 6. 配置虚拟主机及用户

#### 6.1. 用户角色

RabbitMQ在安装好后，可以访问http://ip地址:15672；其自带了guest/guest的用户名和密码；如果需要创建自定义用户；那么也可以登录管理界面后，如下操作：

![1565098043833](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1565098043833.png) 

当然我们也可以添加一个其他的用户，点击admin，在右侧点击users

![image-20220117191320550](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220117191320550.png) 

> 角色说明：
>
> 1、超级管理员(administrator)：可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操作。
> 2、监控者(monitoring):可登陆管理控制台，同时可以查看rabbitmq节点的相关信息(进程数，内存使用情况，磁盘使用情况等)
> 3、策略制定者(policymaker):可登陆管理控制台, 同时可以对policy进行管理。但无法查看节点的相关信息(上图红框标识的部分)。
> 4、普通管理者(management):仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理。
> 5、其他:无法登陆管理控制台，通常就是普通的生产者和消费者。

#### 6.2. Virtual Hosts配置

像mysql拥有数据库的概念并且可以指定用户对库和表等操作的权限。RabbitMQ也有类似的权限管理；在RabbitMQ中可以虚拟消息服务器Virtual Host，每个Virtual Hosts相当于一个相对独立的RabbitMQ服务器，每个VirtualHost之间是相互隔离的。exchange、queue、message不能互通。 相当于mysql的db。Virtual Name一般以/开头。

##### 6.2.1. 创建Virtual Hosts

![image-20220117191703283](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220117191703283.png) 

##### 6.2.2. 设置Virtual Hosts权限

 ![image-20220117191749626](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220117191749626.png)

##### 6.2.3 用户绑定virtualhost

![image-20220117191959072](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220117191959072.png) 

#### 7. 添加rabbitMQ配置文件

在管理界面的overview里面，下面有如下配置，找不到队列的配置文件

![image-20220117192125072](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220117192125072.png) 

复制rabbitmq的配置文件到/etc/rabbitmq里面里面，操作如下

~~~shell
[root@localhost ~]#cd /usr/share/doc/rabbitmq-server-3.6.5/
[root@localhost ~]#cp rabbitmq.config.example /etc/rabbitmq/rabbitmq.config
[root@localhost ~]#service rabbitmq-server restart
~~~



## 项目版本管理

### Gitkraken: 小章鱼

> 项目管理工具 
>
> 默认安装位置: C:\Users\Lujun\AppData\Local\gitkraken\app-6.5.1

汉化:https://github.com/k-skye/gitkraken-chinese

1.汉化文件目录: C:\Users\Lujun\AppData\Local\gitkraken\app-6.5.1\resources\app.asar.unpacked\src

![image-20220904151832278](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220904151832278.png)

3.重启

#### 方式一: 每人一个分支

1.先拉取 云端masterr 内容更新到 本地master 

2.变基: 将最新的 本地master 的内容更新至 apai分支

3.上传apai分支: 先将apai分支内容储存至本地 然后 直接push 至云端apai分支

4.管理员 变基 拉取云端apai分支内容合并到本地master里 进行修改或者解决冲突 然后进行push到云端master上

#### 方式二: 共享一个分支

只要遵循 上传之前先拉取pull至最新 解决掉冲突 保证正常 然后再上传push 即可





## 微服务

### 1.Nacos 的下载和安装

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

看到如下界面，需要登陆，默认的用户名密码都是 **nacos** ，登陆之后看到如下界面：

![image-20210610204222725](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210610204222725-1659684470320.png) 

nacos 的单机 standalone 模式是开发环境中使用的启动方式，它对用户而言非常友好，几乎不需要的更多的操作就可以搭建 nacos 单节点。另外，standalone 模式安装默认是使用了 nacos 本身的嵌入式数据库 apache derby(Derby是一个Open source的产品，是一个小型的数据库) 。













