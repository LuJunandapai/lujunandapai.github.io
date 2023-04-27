---
title: HTML-JS 标签 
date: 2023/04/27
---



## HTNL - 静态网页 



## HTML - 标签

### 表单标签

```html
// 表单
<form action="发送请求" method="post"></form>
// 按钮方式一
<input type="submit" value="提交按钮">
// 按钮方式二
<button id="register">提交按钮</button>   // 默认的type="submit"
<button id="register" type="button">普通按钮</button>
```

### 内嵌网页标签

```html
<iframe src="地址路径"></iframe>
	frameborder="no" -- 边框类型
	name="myframe" target="myframe" -- 当超链接的target的值与iframe的name一致,点击超链接可切换内容网页
```

### 文件点击选中表单框标签

```html
// for="name"  id="name" 一致

<label for="name">商品名称：</label>   
<input type="text" name="dname" id="name" placeholder="请输入商品名称" >
```

###  超链接标签

```html
// 属性
 target='_blank' 跳转开启新的页面
```





## Css - 样式

### Css 引入

```html
样式:
	内部样式
		写在顶部 head 标签里
			<style>  选择符{属性:属性值;属性:属性值; }  </style>
	外部样式
		写在顶部 head 标签里新建 css 文件链接
			<link  rel= ”stylesheet"  href= "css文件的路径" >
			<style type= "text/css" >   @import url("css文件的路径" );  </style>
	行内样式
		<div  style="width: 200px; height: 200px;">我是div</div> 
	// 注意: 样式优先级 行内>内部>外部 最高优先级：!important 就近原则
```

### 表格:

```css
border-collapse: collapse;  --->  表格边框线合并
```

### 背景:

```css
background-color: transparent;  --->  背景色透明
```

### 伪元素:

```css
/*::after内容创建一个伪元素，作为通常指定元素的最后一个子元素。会配合content属性来为该元素添加装饰。这个虚拟元素默认是行内元素*/
选择器::after {
  content: "可以再段落后面加上语句并设置属性样式";
  color: green;
}
/*表单未获取焦点时 placeholder-文本提示 的属性*/
input::placeholder{
    color: #fff;
}
/* 表单获取焦点时 */
input:focus{
    color: #a262ad;
}
```



## JavaScript

### JavaScript 引入

```html
写法
	行内
		直接在标签内书写
	内嵌
		使用script标签内书写
	外链
		<script src="js文件的地址"></script>
```



### 常用 JavaScript 属性及方法

####  js:  或 且 非

* 或 -->  ||
* 且 -->  &&
* 非 -->    !



#### Js 迭代遍历方式

> for 遍历 没有赋值的和下标不为数值的输出为undefined
> in   遍历 获取所有的下标包括字符串下标 但没赋值的下标无法获取输出(undefined)
> of   遍历 获取所有的数组元素 但没赋值的和下标为(字符串)的输出为undefined
> ES推出的高阶函数 - 函数参数既是另一个函数 没赋值的和下标为(字符串)的元素不会输出
> 箭头函数 - 类似java的lanbda表达式 没赋值的和下标为(字符串)的元素不会输出



#### 获取标签元素

```js
// 根据类名 - 获取的为数组 必须加上下标 获取时可以加 调用时也可以加
document.getElementsByClassName('类名')[0];

// 根据标签 - all获取也为数组 跟类获取一样必须加上下标
document.querySelector('选择器');
document.querySelectorAll('选择器');
```



#### 操作标签的类名

```js
// 添加新的类名，如已经存在，取消添加
classList.add( 'newClassName' )；

// 确定元素中是否包含指定的类名，返回值为true 、false；
classList.contains( 'oldClassName' );

// 移除已经存在的类名;
classList.remove( oldClassName )；

// 如果classList中存在给定的值，删除它，否则，添加它；
classList.toggle( className )；

// 类名替换
classList.replace( oldClassName，newClassName )；

// 方式二 覆盖对应的选择器的类名 用空格隔开写入多类名保证类名不被覆盖
元素名.className = '类名1 类名2 ... ';
```



#### 延迟执行方法

```js
setTimeout{
    () => {
        // 执行的函数方法
    }, 毫秒值
}
```







### Js 数据类



#### 基本数据类型

```js
Number
	数字型，包含整型值和浮点型值，如21、0.21 默认值：0
Boolean
	布尔值类型，如true 、 false，等价于1和0 false
String
	字符串类型，如"张三”注意咱们js 里面，字符串都带引号 ""
object
	对象
Null
	var a = null;声明了变量a 为空值 null
Undefined
	声明了变量但是没有给值没有初始化
```



### Array 数组 

Array对象 -- 用于在单个的变量中存储多个值

|- 大小是动态

|- 数据可以不同类型

|- 可以使用字符串来作为下标

 |- 为数组赋值时,可以不连续

```js
let arr = ["aa", "bb", null, "cc", "dd"];
let arr1 = new Array();
let arr2 = new Array( 长度 );

// 属性
	constructor
		返回创建数组对象的原型函数
	length
		设置或返回数组元素的个数
	prototype
		允许你向数组对象添加属性或方法
```





#### Js 对象

##### 字面量对象

```js
// 数组
let arr = ['a', 'b', 'c']
// 对象
let stu = {
    sno:1,
    sname:"张三",
    age:20,
};
```

##### JSON  对象

>  json必须是符合以下 
>  •	1.键一定要用双引号，值如果是字符串也要用双引号包括
>  •	2.数据只包括，数字，布尔，数组，null，对象，字符串
>
>  反解析 JSON.stringify(json对象)   ---  将json对象转换为json格式的字符串
>  解析 JSON.parse(json格式的字符串) ---  将json格式的字符串 转换为json对象

```js
// 单个json对象
let stu =  {
    "sid":1,
    "sname":"小明",
    "age":20            
};
// json数组对象
let stuArr = [
    {"sid":1,"sname":"小明","age":20},
    {"sid":2,"sname":"小丽","age":21},
    {"sid":3,"sname":"小花","age":19}
];
```







### JavaScript HTML 事件

#### 鼠标事件:

```text
常用的鼠标事件:
	onclick 鼠标点击
	onDblclick 鼠标双击
	onmouseover 鼠标经过
	onmouseout 鼠标离开
	onmousemove 鼠标移动
	onload 文档加载完毕在执行 --> window.onload = function () {  }
```

#### 表单事件:

```text
表单事件:
	onchange
		事件会在域的内容改变时发生 也可用于单选框与复选框改变后触发的事件
	onsubmit
		提交表单之前触发事件 --只能通过表单中的submit按钮
	onfocus
		获取焦点
	onblur
		失去焦点
	onchange
		获取焦点后再失去焦点
	onchange
		下拉菜单选项发生改变
```

#### 键盘事件:

```

```

### JavaScript 正则表达式

```js
直接量语法: 
	let pat3 = /^[0-9|a-z|A-Z]{3,7}$/i;
	let pat4 = /^\w{3,9}$/;
	
	表达式 . test ( 内容 );

方法
	test()
		用于检测一个字符串是否匹配某个模式，如果字符串中含有匹配的文本，则返回 true，否则返回 false
	exec()
		该函数返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null

```



### JavaScript 函数

#### 传统方式

```js
1.  元素名 . 触发 = function() {
    	alert("ssss");  
	}

2.  元素名 . 触发 = 函数名; // 注意函数名不需要括号 ()
	function 函数名(){
        alert("ssss");
    }
```

#### add监听模式

```js
1.  window.addEventListener( ' 触发 ',函数名 ) // 注意 触发事件去掉 on
	function 函数名(){
        alert("ssss");
    }
2.  2.  window.addEventListener( ' 触发 ',function() {
    	alert("ssss");  
	})
```





### JavaScript  DOM 元素节点

#### 基础:

```
nodeType:  查询节点类型 文本节点包含了文本 换行 空格
		  元素节点 - 1 属性节点 - 2 文本节点 - 3
		  
获取父元素: 子元素名 . parentNode  子元素名 . parentElement

获取子元素: 父元素 . firstElementChild -- 获取开头
		   父元素 . lastElementChild -- 获取结尾
		   
获取兄弟节点: console.log(div.previousElementSibling); // 上一个兄弟
	         console.log(div.nextElementSibling); // 下一个兄弟
	         注意: 只包含元素节点 未找到则返回null 存在兼容性问题
```

#### 节点语法:

```js
// 创建节点
	document.createElement(' 标签名 ');
	
// 增加节点
	尾部追加 父元素名.appendChild( 创建的节点变量名 )
	指定元素前添加 父元素名.insertBefore( 创建的节点变量名, 指定元素名 )
	
// 删除节点
	父元素名 . removeChild ( 删除的元素名 )
	删除的元素名 . remove;

// 复制节点
	元素名 . cloneNode( true )
		括号为空 或者 null 为浅拷贝 - 复制标签不复制内容
		括号为 true 深拷贝 - 复制标签和内容
```

#### 动态生成标签案例:

```html
<body>
省份:
<select name="province" id="province"></select>
市区:
<select name="city" id="city">
    <option>--请选择--</option>
</select>
县城: <input type="text" name="county" id="county">
</body>
```

```html
// 方式一 
<script>
        window.addEventListener("load", function () {
            // 发送ajax请求获取省份列表
            let jsonarr = [
                {"code":"420000","content":"湖北省"},
                {"code":"410000","content":"湖南省"}
            ]

            // 根据获取的元素创建
            // document.querySelector('#province').options.length = 0; 清除生成的标签
            let ops = document.querySelector('#province').options;
            // ops.add(new Option("值", "value值"));
            ops.add(new Option("--请选择--", ""));
            for (let obj of jsonarr){
                ops.add(new Option(obj.content, obj.code));
            }
        })
 </script>

// 方式二
<script>
        window.addEventListener("load", function () {
            // 发送ajax请求获取省份列表
            let jsonarr = [
                {"code":"420000","content":"湖北省"},
                {"code":"410000","content":"湖南省"}
            ]

            // 获取给添加节点标签的父元素
            let select = document.querySelector('#province');
            // 创建添加的节点标签
            let opt = document.createElement("option");
            // 添加的标签 value属性 赋值
            opt.value = "";
            // 添加的标签 文本 赋值
            opt.innerText = "--请选择--";
            // 在节点标签的父元素尾部确认追加
            select.appendChild(opt);
            for (let obj of jsonarr){
                let opt = document.createElement("option");
                opt.value = obj.code;
                opt.innerText = obj.content;
                select.appendChild(opt);
            }
        })
 </script>
```

### JavaScript Location 对象跳转

JavaScript Location 对象: 页面的跳转

```js
Location 对象
	属性
		location.href = " URL "  /  window.location.href='test03.jsp';
			跳转至设置的URL
	location . 方法
		assign( ' url ' )
			加载新的文档。  -写入历史记录，可以后退
		reload( ' url ' )
			重新加载当前文档。  - 刷新页面
		replace( ' url ' )
			用新的文档替换当前文档  --不写历史记录，不能后退
```



## 前端 补充

#### 前端页面的请求方式

```html
// 提交按钮请求 -- 将会提交表单 form 使用的数据可供调用
	<button type="submit" name="doogs">提交按钮</button>

// 超链接的请求 -- 只带上href ? 后面的数据
<a href="manage/doog?doogs=gotodoogsadd">超链接的请求</a>
<a href="javascript:函数名()">超链接的请求</a>
<a href="javascript:void(0);" onclick="函数名(${category.id})">不直接请求 使用js函数请求</a>

// 普通按钮 -- 无法直接发送请求 可使用js发送请求 window.location.href=""
<button type="button" onclick="函数名()">普通按钮</button>
<script>
    // 基于layerui的时间弹窗
    <c:if test="${tis!=null}">
    layer.msg('${tis}');

    function gotopage(){
        window.location.href = "${pageContext.request.contextPath}/manage/doog?doogs=gotosList&pageNum=xxx";
    }

    // 使用ajax发送请求
</script>

<-- 使用js函数提交 --> 
<form method="get" action="${pageContext.request.contextPath }/user" id="queryform">
    <a href="javascript:goPage(${pageInfo.pageNum + 1 })">下一页</a>
</form>
    <-- 调用此函数及进行提交 -->
    function goPage(pageindex) {
        <-- 获取表单form元素 -->
        var pageform = document.getElementById("queryform");
        <-- 赋值 -->
        pageform.pageIndex.value = pageindex;
        <-- 进行提交 -->
        pageform.submit();
    }
```



## 功能模板

### 多选 联动 

```js
 // 使用点击事件 通过class类选择获取全选按钮 和 其他按钮
 // 全选按钮 class="all" 单选按钮 class="choice" 即可使用

		<input type="checkbox" class="all">
        <input type="checkbox" class="choice" value="${cart.id}">

            
        let all = document.querySelector('.all');
        let choice = document.querySelectorAll('.choice');

        all.onclick = function () {
            for (let i = 0; i < choice.length; i++) {
                choice[i].checked = event.target.checked;
            }
        }

        for (let i = 0; i < choice.length; i++) {
            choice[i].onclick = function () {
                let boo = true;
                for (let i = 0; i < choice.length; i++) {
                    if (!choice[i].checked) {
                        boo = false;
                        break;
                    }
                }
                all.checked = boo;
            }
        }
```

### 表单验证

```js
// 获取 表单内容进行 if条件判断 class="inputvalue"
let name = document.querySelector('.inputvalue');
name.onblur = sname;
function sname() {
    let na = inputvalue.value;
    console.log(na);
    if (na == "") {
        alert('用户名不能为空');
        return false;
    } else if (!/^\w{4,16}$/.test(na)) {
        alert('格式不正确');
        return false;
    } else {
        inputvalue.innerText = "";
        return true;
    }
}
// 可进行多组表单验证 最后进行一起判断 true则正常提交 否则有一组不符合则不能提交
// onsubmit="return validdateform()" 赋予在表单 form 标签的属性
function validdateform() {
    if (sname() && spass()) {
        return true;
    } else {
        return false;
    }
}
```

#### 表单验证 - AJAX

```js
// 在使用表单使用 失去焦点 验证时 如果里面使用了AJAX则其内部无法返回 布尔值 可在外部定义变量 在其内部赋值

// 在表单提交验证时
	1. onsubmit="return validdateform()" 赋予在表单 form 标签的属性
    2. 获取 form 标签元素在使用 onsubmit 
    	注意: 如果内部有AJAX可先调用其函数方法 if时使用它的外部定义的布尔值 
```

```js
// 用户账号失去焦点事件
    let adname = false;
    let name = document.getElementById('name');
    name.addEventListener("blur", adminname);
    function adminname() {
        let namevalue = name.value;
        if (namevalue == "") {
            document.getElementById('namemsg').innerHTML = '账号不能为空';
            return false;
        } else if (!/^\w{6,20}$/.test(namevalue)) {
            document.getElementById('namemsg').innerHTML = '账号格式不正确';
            return false;
        } else {
            let url = "user?opr=registerlist&username=" + namevalue;
            axios.post(url).then(function (res) {
                let str = res.data
                if (str.code == 200) {
                    document.getElementById('namemsg').innerText = "账号符合"
                    adname =  true;
                } else {
                    document.getElementById('namemsg').innerText = str.msg;
                    adname =  false;
                }
            }).catch(function (e) {
                //1.服务端500错误
            });
            return true;
        }
    }

// 提交验证
    let form = document.getElementById('form');
    form.addEventListener("submit", validdateform);
    function validdateform() {
        adminname();
        ema();
        if (adname && meayz && phone() && towpass() && onepassword()) {
            return true;
        } else {
            return false;
        }
    }
```



### 动态刷新既时时间

```js
// 获取显示时间的标签 class="time"
let time = document.querySelector('.time');
function dtime() {
    let dati = new Date();
    let hh = dati.getHours();
    let mi = dati.getMinutes();
    mi = mi < 10 ? "0" + mi : mi;
    let ss = dati.getSeconds();
    ss = ss < 10 ? "0" + ss : ss;
    let sx = "AM";
    if (hh > 12) {
        hh = hh - 12;
        sx = "PM";
    }
    hh = hh < 10 ? "0" + hh : hh;
    let shijian = hh + " : " + mi + " : " + ss + " " + sx;
    time.innerText = shijian;
}
window.onload = dtime;
setInterval(dtime, 1000);
```

### 倒计时

```js
// 倒计时 获取放入时间的容器标签  将倒计时的日期赋值 设置启动就执行 每一秒刷新
        let count = document.querySelector('.count');
        function countdown() {
            let nowtime = new Date('2022-6-3 16:50:00');
            let inputtime = new Date();
            let xge = (nowtime.getTime() - inputtime.getTime()) / 1000;
            let tian = parseInt(xge / 60 / 60 / 24); // 天
            tian = tian < 10 ? '0' + tian : tian;
            let shi = parseInt(xge / 60 / 60 % 24); // 小时
            shi = shi < 10 ? '0' + shi : shi;
            let fen = parseInt(xge / 60 % 60); // 分钟
            fen = fen < 10 ? '0' + fen : fen;
            let miao = parseInt(xge % 60); // 秒
            miao = miao < 10 ? '0' + miao : miao;
            count.innerHTML =  tian + "天" + shi + "时" + fen + "分" + miao + "秒";
        }
        window.onload = countdown;
        setInterval(countdown, 1000);
```

### 文件上传验证

```js
// 可进行多组表单验证 最后进行一起判断 true则正常提交 否则有一组不符合则不能提交
// onsubmit="return checkForm()" 赋予在表单 form 标签的属性
function checkForm() {
            // 根据class获取上传元素标签
            let file = document.querySelector('.file');
            // 获取上传元素标签的值
            let filevalue = file.value;
            // 通过获取 . 的下标+1 在截取 得到后缀
            let ext = filevalue.substring(filevalue.lastIndexOf(".")+1);
            // 根据后缀判断文件的格式
            if (ext.toLowerCase() != "jpg" && ext.toLowerCase() != "png" && ext.toLowerCase() != "gif"){
                alert("上传的文件格式不正确");
                return false;
            }
            // 获取上传元素标签的文件大小
            var size = file.files[0].size;
            // 判断大小
            if (size > 2097152){
                alert("上传的文件大小超出限制");
                return false;
            }
            // 全部符合则返回true
            return true;
        }

```

### JS 获取选中 多选框数据

```java
// --------- 前台js ---------
	// 获取所有选择框 数组
	let choice = document.querySelectorAll('.choice');
	// 批量删除按钮
    let sc = document.querySelector('#schu');
    // 需要删除的 td 数组
    let tds = document.querySelectorAll('#tdclass');
	// 删除按钮触发点击事件时执行
    sc.onclick = function () {
        // 创建新数组 存入被选中的 id
        let xuanzid = new Array();
        // 新数组的下标
        let cishu = 0;
        for (let i = 0; i < choice.length; i++) {
            if (choice[i].checked) {
                xuanzid[cishu] = choice[i].value;
                cishu++;
            }
        }
        // 如果未被选中 则提示
        if (xuanzid == ""){
            alert("请选择车次");
        }
        // 将选中的id数组 发送请求和ID数组至后台进行业务删除
        url="delete?id=" + xuanzid;
        axios.get(url).then(function(res){
            // 后台删除成功 则也要将前台页面的td进行删除
            for (let i = 0; i < choice.length; i++) {
                if (choice[i].checked) {
                    tds[i].remove();
                }
            }
        }).catch(function(e){
            //1.服务端500错误
            //2.then部分代码逻辑出现错误
        });
    }
// --------- 后台 spring 使用数组接收即可 注意name ---------
```

### 超链接 函数发送 AJAX 请求

```jsp
<%--  超链接触发  --%>
<%--  href="javascript:void(0);" - 关闭了直接触发表现层的请求  --%>
<%--  onclick="return hint(${category.id})" - 使用js的鼠标点击事件  --%>
<a href="javascript:void(0);" onclick="hint(${category.id})">删除</a>

<%--  使用js的鼠标点击事件确定是否执行web表现层的请求 如需id可先在超链接调用函数式传参  --%>
<script>
    function hint(id){
        layer.confirm('确定删除?',{
            btn:['确定', '取消'] // 选择按钮
        }, function (){
            // 确定进入的函数 获取上下文请求加上超链接的原本相对请求路径和id 向web表现层发送请求执行
            window.location.href="${pageContext.request.contextPath}/ 超链接的web请求 &id="+id
        }, function (){
            // 取消进入的函数
        })
    }
</script>
```







## web - 前端库工具

### 组件

#### JavaScript  Bootstrap

Bootstrap: 需要加载 css 和 js 文件 另外加上 jquery-3.4.1.js

网址: https://getbootstrap.com/docs/3.3/

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Bootstrap模板</title>
		<meta charset="utf-8" />
		<!--引入Bootstrap-->
		<link href="css/bootstrap.min.css" stylesheet">
         <!--jQuery (Bootstrap的Javascript插件需要引入 jQuery)-->
      	 <script src="js/jquery-3.4.1.js"></script>
         <!--包含已编译的插件-->
         <script src="js/bootstrap.min.js"></script>
	</head>
	<body>
		...
	</body>
</html>
```

#### jquery-3.4.1.js

```html
// 放入js包下
<script src="js/jquery-3.4.1.js"></script>
```

#### layer

layer: 前端框架    网址: https://layui.itze.cn/index.html

```html
<!-- 引入 layui.css -->
<link rel="stylesheet" href="layui/css/layui.css">
 
<!-- 引入 layui.js -->
<script src="layui/layui.js">
```

#### axios.js库

step1: 添加axios.js库文件 并加载对应的 js 文件

```html
<%--导入axiox.js库文件--%>
    axios.min.js
<%--加载axiox.js库--%>
	<script src="js/axios.min.js"></script>
```

step2:发送axios请求

```html
<script>
        window.addEventListener("load", function () {
            let pro = document.querySelector('#province');
            pro.addEventListener("blur", function () {
                
            url="xxx?id=111&name=yyy"
		   axios.get(url).then(function(res){
       			//res 获取响应结果对象   res.data- 对应于服务端response.getWriter().print();
    			//..在进行DOM操作 --局部更新
			}).catch(function(e){
    			//1.服务端500错误 
   		 		//2.then部分代码逻辑出现错误 
			});
                
            })
        })
</script>

// 表现层 输出到客户端的js内的回调函数里 设置字符集
resp.setContentType("text/html;charset=utf-8"); // 输出文本
resp.setContentType("application/json;charset=utf-8"); // 输出json

PrintWriter writer = resp.getWriter();
writer.println(result);
writer.flush();
```

#### moment.js

> 时间格式的转换工具





### 3D 页面展示

[Vanta.js - 您网站的动画 3D 背景](https://www.vantajs.com/#(alignment:20,backgroundAlpha:1,backgroundColor:465199,birdSize:1,cohesion:20,color1:16711680,color2:53759,colorMode:variance,gyroControls:!f,minHeight:200,minWidth:200,mouseControls:!t,quantity:3,scale:1,scaleMobile:1,separation:20,speedLimit:5,touchControls:!t,wingSpan:30))

> 使用方法: https://juejin.cn/post/7098207374338457637

1.在vscode 当前文件控制台执行 安装  npm i vanta

2.在vscode 当前文件控制台执行 安装  npm i three@0.121.0

```vue
<template>
  <div ref='vantaRef'>
    Foreground content here
  </div>
</template>
 
<script>
import * as THREE from 'three'
// 根据导入的库显示对应的背景 \node_modules\vanta\src 文件地址
import BIRDS from 'vanta/src/vanta.birds' 
export default {
  mounted() {
    this.vantaEffect = BIRDS({
      el: this.$refs.vantaRef,
      THREE: THREE
    })
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  }
}
</script>
```











































