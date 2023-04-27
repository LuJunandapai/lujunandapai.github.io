---
title: Vue 框架基础
date: 2023/02/15
---

## HTTP - 状态码

200: 正常

315: 服务器无法处理请求

400: 请求参数类型错误

401: 未授权，请求要求身份验证

403:  禁止访问，服务器拒绝请求

404: 请求路径不正确 | web层 @RestController 注解不进行转发视图跳转

405: 请求不一致, 如: get请求却是post注解

500: 后台代码错误

502: 错误网关，服务器作为网关或代理，从上游服务器收到无效响应

504: 网关超时



## Post 和 Get 请求的区别

### Get 请求

> 没有请求体,提交的数据都是放在请求行(缓存行)里面的,就是地址通过拼接? & (queryString)

### Post 请求 

> 有请求体，因此它提交的数拥是有两种方式

* icontent-type (applicaion/x-wwww-form-encoded) 类似于 get 请求 数据拼接在地址后 后台直接获取
* icontent-type (application/json) 默认 json 后台要加上 注解:@RequestBody

### 表单提交

> 表单的默认提交方式是: content- type --> applicaion/x-wwww-form-encoded.
>
> 那么这个提交也是赤耀棵的 (queryString)



## Axios 请求

### get 请求

**方式一:  无参 get 请求**

```js
axios.get('http://localhost:8080/getwucan')
    .then(res => {
    console.log("wucan")
});

@GetMapping("/getwucan")
@ResponseBody
public void getwucan() {
    System.out.println("wucanget....");
}
```

**方式二:  有参 get 请求 拼接在 请求后面**

```js
axios.get('http://localhost:8080/getpingjie?name=小明&age=15')
    .then(res => {
    console.log("wucan")
});

@GetMapping("/getpingjie")
@ResponseBody
public void getpingjie(String name, Integer age) {
    System.out.println(name);
    System.out.println(age);
}
```

**方式三:  有参 get 请求 params  键之对**

```js
axios.get('http://localhost:8080/getparams', {
    params: {
        aaa: '011',
        bbb: 120,
    }
}).then(res => {
    console.log("aaaa")
});

@GetMapping("/getparams")
@ResponseBody
public void getparams(String aaa, Integer bbb) {
    System.out.println(aaa);
    System.out.println(bbb);
}

---------------------------------------------------------------------

// 如要传递数组到后端 可使用QS转换一下在进行传递 直接传递数组 会是 ccc[]:1 ... 报错
// 请求网址: http://localhost:8080/getparams?aaa=011&bbb=120&ccc=1&ccc=2&ccc=3  正确
// QS 需引入: 能够想数据格式化
<script type="text/javascript" src="https://cdn.bootcss.com/qs/6.7.0/qs.min.js"></script>
let params = {
    aaa: '011',
    bbb: 120,
    ccc: ['1', '2', '3']
};
let paramStr = Qs.stringify(params, {arrayFormat: 'repeat'});
console.log(paramStr);
axios.get('http://localhost:8080/getparams?' + paramStr).then(res => {
    console.log("aaaa")
});

@GetMapping("/getparams")
@ResponseBody
public void getparams(String aaa, Integer bbb, String[] ccc) {
    System.out.println(aaa);
    System.out.println(bbb);
}
```

**方式三:  有参 get 请求 restful 风格**

```js
// restful 风格 请求是直接在后面使用 '/' 拼接
axios.get("http://localhost:8080/posttow/" + 521 + '/' + '分隔')
    .then(res => {
    
	});
// 在 获取请求上 加上名字 
// 当注解名字和形参的名字一致直接使用 @PathVariable 不一致则: @PathVariable(value="对应请求的名字")
@GetMapping("/posttow/{aa}/{str}")
@ResponseBody
public void restfgone(@PathVariable(value = "aa") Integer ti, @PathVariable String str) {
    System.out.println(ti);
    System.out.println(str);
}
```





### post 请求

**方式一:   键之对  appliction/x-www-form-urlencoded**

```js
// axios.post('http://localhost:8080/请求', "名=值&名=值", {headers:{"请求类型"}})
// 前端请求 键之对数据
    axios.post('http://localhost:8080/postone', "name=122&age=52222", {headers:{"Content-Type":"application/x-www-form-urlencoded"}})
    .then(res => {
    	
	});
// 后端接收 直接使用对应的类型 和 变量名
@PostMapping("/postone")
@ResponseBody
public void postone(String name, Integer age) {
    System.out.println(name);
    System.out.println(age);
}
```

**方式二: json - application/json**

```js
// 前端直接传递 json 对象名数据
axios.post("http://localhost:8080/addProduct/", this.product)
    .then(res => {

	});
// 后端利用 注解 @RequestBody 获取对象
@RequestMapping("/addProduct")
@ResponseBody
public void addProduct(@RequestBody Product product) {
    
}

-------------------------------------------------------------------
    
// 前端直接传递 json 对象数据 注意: 必须对应上实体类 否则无法直接获取数据
axios.post('http://localhost:8080/posttow', {username:'小明', password: '25'})
    .then(res => {
     
    });
// 后端 使用注解 @RequestBody 和 实体类获取数据
@PostMapping("/posttow")
@ResponseBody
public void posttow(@RequestBody User user) {
    System.out.println(user.getUsername());
}
```

**图解**

![image-20220613150408809](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220613150408809.png)



## Js 常用的函数方法

### 数组函数方法

this.数组名.pop:    尾部弹出

this.数组名.push(变量名):  尾部添加

this.数组名.shift:   头部弹出

this.数组名.unshift(变量名):   头部添加

this.数组名.splice(index,howmany )  根据 索引 删除   howmany: 删除的个数

**数组补充**:

条件删除数组某项

> 可以不用index索引但需要删除对象的某一个属性用于判断

```js
// 遍历对象数组
for (var i = 0; i < this.brands.length; i++) {
    // 根据删除的某一个属性 判断 对象数组的每一个对象的属性
    if (this.brands[i].id === brand.id) {
        // 如果为真 执行删除
        this.brands.splice(i, 1);
    }
}
```



### 常用函数

##### 时间计时器

```js
setTimeout (() => {
    // 执行
}, 技术时间)
```

##### Dom 更新后执行

```js
$nextTick ( () => {
    // 执行
})

this.$nextTick ( () => {

});
```



### js 常用文件

```html
<!DOCTYPE html>
<!--表示 警告压制 防止报红 不是注释-->
<!--suppress ALL-->
<!--  xmlns:th="http://www.thymeleaf.org" 相对于命名空间 具有代码提示功能  -->
<html lang="zh-cn" xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
<head>
    <!--  上下文路径 可保证相对路径  -->
    <base th:href="${#request.getContextPath()} + '/' ">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title> 网页 </title>
   
    <!-- vue -->
    <script src="js/vue.js"></script>
    <!-- vue 路由 -->
    <script src="js/vue-router.js"></script>
    <!-- 时间格式转换 -->
    <script src="js/moment.js"></script>
    <!-- axios 异步请求发送 -->
    <script src="js/axios.min.js"></script>
    <!-- layui 样式 -->
    <script src="layui/layui.js"></script>
    <link rel="stylesheet" href="layui/css/layui.css">
    <!-- bootstrap 样式 -->
    <link rel="stylesheet" href="css/bootstrap-3.3.7.css">
    
</head>
```



### 属性 有文本 和 数据名时

```html
<input type="text" class="form-control" :placeholder="'请输入 '+subject.subName+' 的分数'">
```

#### 路由跳转 数据获取

函数内 发送路由跳转: this.$router.push("/update?id=" + id);

函数内 获取跳转的数据: let id = this.$route.query.id;

#### CRUD 请求类型

查询 删除:  请求为 get     默认传递为 键值对 数据

```java
axios.get('http://localhost:8080/userlist', {
    // 请求发送键值对 数据到后台
    params: {
        pageIndex: this.pageIndex,
        userName: this.userName,
        roleid: this.roleid,
    }
})
// 后台接收
public PageInfo<User> userListCond(Integer pageIndex, String userName, Integer roleid)
```

修改 增加 :  请求为 post  默认传递为json数据

```java
// 传递为json数据
axios.post("http://localhost:8080/updateUser/", this.user)  // 前端发送数据
public Object updateUser(@RequestBody User user) // 后端注解 @RequestBody 接收json数据数据
```



## Vue  -  简介:

### 简介:

Vue: 是一套前端框架，免除原生JavaScript中的DOM操作，简化书写 基于MNVM(Model-View-ViewModel)思想，实现数据的双向绑定，将编程的关注点放在数据上

官网: https://cn.vuejs.org

生命周期:  生命周期的八个阶段:每触发一个生命周期事件，会自动执行一个生命周期方法(钩子)

* beforeCreate   创建前
* created             创建后
* beforeMount   载入前
* mounted          挂载完成
* beforeUpdate  更新前
* updated            更新后
* beforeDestroy 销毁前
* destroyed         销毁后

mounted:挂载完成，Vue初始化成功，HTML页面渲染成功。   发送异步请求，加载数据



### vue -- 基础

#### 1.引入 Vue

```html
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="js/vue.js"></script>

<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="js/vue.min.js"></script>
```

#### 2.声明式渲染

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统：

> 注意: vue 的指令需包含在控制范围内 超出范围则无法使用
>
> 当指定的标签存在多个时 vue 只会选择第一个

```html
<div id="app">
  {{ message }}   <!-- 插值表达式 -->
</div>

<script src="js/vue.js"></script>
<script>
    const vm = new Vue({
        // el: 指定控制的作用范围 
        el: '#app',

        // data: 对象就是要渲染到页面上的数据 | 用于普通vue
        data: {
            数据名: '数据值',
            数据名: '数据值',  
        },
        // data: 对象就是要渲染到页面上的数据 | 用于cmd创建的vue
        data: function() {
            return {
                
            }
        },

        // moubted: 页面加载完毕后执行
        mounted() {
            this.selectItem(); // 调用方法
        },
        // created : 页面加载完毕后执行
        created () {
            this.selectItem(); // 调用方法
        },
        
        // methods: 就是定义事件的处理函数  
        methods: {
            函数名: function () {
                // 常规函数
            },
            函数名 () {
                // 简写函数
            },
        }, 

        // filters 过滤器 选项
        filters: {
            upper: function(v) {
                // 在过滤器的方法中操作数据并返回结果
                return v.toUpperCase();
            }
        },

        // watch 侦听器 能够侦听到data数据的变化 且获取对应的 新值 和 旧值
        watch: {
            数据名(newVal, oldVal) {
                // newVal - 新值, oldVal - 旧值
            }
        },
        
        // components 组件 的局部注册
        components: {
            // '组件调用名' : 组件变量名,
        },
        
        // computed 计算属性
        computed: {
            //  以函数方法形式被定义 在调用时以属性数据的方式 随data数据的变化而变化
        },
        
        // 渲染页面区域 会覆盖el:'#app'根元素 vue脚手架常用
        templaate: '<组件></组件>',
    })	
</script>
```

## Vue: -- 指令

vue: -- 指令  可以在内部做一些简单的运算

* 加减乘除等基本运算
* 三元运算符
* 调取方法
* 字符串拼接 注意: 拼接时字符串需加上单引号



### 内容渲染指令

#### v-text 纯文本内容

```java
可将js的数据渲染到标签 如:<p> 的内容节点上
注意: 如果当标签内已有内容 将会被js里data的数据覆盖掉  无法渲染有标签的数据
```

```html
<p v-text="data里的数据名">数据将被渲染到这里</p>
```

#### {{  }}  插值表达式

> 插值表达式: **{{ data里的数据名 }}** 根据名可获取对应的数据 
>
> 相当于占位符  放在标签的内部 内容节点 填充内容数据 无法放入标签的属性节点
>
> 注意: 无法渲染有标签的数据

```html
<p> {{ data里的数据名 }} </p>
```

#### v-html  带标签的内容

> 跟 v-text  作用差不多 但是能够渲染 带标签的数据

```html
<p v-html="data里的数据名">带html标签数据也能将被渲染到这里</p>
```

#### v-once 渲染一次指令

> 让标签只渲染一次 后续就算data的数据改变也不会联动改变

```html
<p v-once>{{message}}</p>
```



### 绑定指令

#### v-bind   属性绑定指令

> 为HTML标签绑定属性值，如设置href , css样式等
>
> 简写:  一个英文冒号    **:**
>
> v-bind  为单向绑定 即 data 数据源的数据 同步到 属性值里

```html
// 常规语法
<input type="text" v-bind:placeholder="data里的数据名"> 
// 简写
<input type="text" :placeholder="data里的数据名">  

// 自定义属性 判断选择 需要是  {}才能定义类名    
	写法: v-bind:class="{类名 : 数据名}" 右边为true则应用 反之false不应用

// 获取多个 data 数据  需要是  []
	写法: v-bind:class="[数据名, 数据名]" 

// 添加 style 属性 需要是 [] 在data里使用对象{} 当样式名有 - 需要单引号
	写法: v-bind:style="[color, 数据名]" 
	data: {
		color: {
			color: 'red',
			'font-size': '16px',
		}
	}
```



#### v-on   事件绑定指令

> 为HTML标签绑定事件 注意: 求掉前面的on 
>
> 简写: @click="methods里的函数名"
>
> 直接调js函数时 不用写小括号  **如果函数有带参数而调用省略小括号 参数会被事件event赋值**
>
> 如果需要传参时可写小括号 里面填入参数值

```html
// 常规语法
<input type="button" value=”一个按钮” v-on:click="methods里的函数名">
// 简写
<input type="button" value="一个按钮” @click="methods里的函数名">
// 需要传参
<input type="button" value="一个按钮” @click="函数名(参数值)">
```

- ##### **事件修饰符**

> 作用: 可阻止标签的默认行为 如 超链接的跳转等...
>
> 原生: 在事件处理函数中event.preventDefault() 阻止跳转 或  event.stopPropagation() 阻止冒泡
>
> Vue: 提供了事件修饰符的概念，来辅助程序员更方便的对事件的触发进行控制

![image-20220604201323338](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220604201323338.png)

```html
// 语法
<a href="链接" @click.prevent="函数名">触发事件的按钮</a>

// 使用原生的内置event阻止默认行为 内置变量 $event
函数名 ( e ) {
	e.preventDefault()
}
```

- ##### 按键修饰符


> 触发键盘事件时执行  如 当按下 键盘的某个键 时进行触发函数
>
> 比如:  可以设置 按下 enter键 时进行ajax发送请求

```html
// 语法
<input type="text" @键盘事件.键盘的某个按键="函数名">

// 当按下 esc键 和 enter键 时进行触发函数
<input type="text" @keyup.esc="clearInput">
```



#### v-model  双向绑定		 

> 在表单元素上创建双向数据绑定 一般用于表单元素 如 文本框 下拉菜单 单选框等
>
> 即 v-model  双向绑定 表单 和 date 的数据绑定  双方 有 一方 发生变化 则会同步变化

**v-model  修饰符**

![image-20220604214527207](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220604214527207.png)

![image-20220606171339170](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606171339170.png)

##### data 数据

```js
// 修饰符 不会在实时更新双向绑定 而是在表单失去焦点时在进行同步
<input type="text" v-model.lazy="username">
data: {
    username: 'zhangsan',
    city: '2',
	checked: true,
	checkeds: [],
}
```

##### 文本框

> 默认为表单的内容文本
>
> 在表单输入内容时 会传递到data的时间里

```js
// 文本框 默认为提示文本
<input type="text" v-model="username">
```

##### 下拉菜单

> 如果data有数据 则会根据数据 与 value 默认选择 
>
> 选中时会将其value值传递到data数据里

```html
<select v-model="city">
	<option value="" disabled>请选择城市</option>
    <option value="1">北京</option>
    <option value="2">上海</option>
    <option value="3">广州</option>
</select>
```

##### 选择框

> 单选择框 默认 根据布尔选择是否发选中
>
> 多选择框 多个选择项双向绑定同一数组 在改变这组的多个选择项时 data的数组则会获取到选中的value值

```html
// 单选择框 默认 根据布尔选择是否发选中
<input type="checkbox" v-mode1="checked" />
// 多选择框 多个选择项双向绑定同一数组 在改变这组的多个选择项时 data的数组则会获取到选中的value值
<input type="checkbox" v-model="checkeds" id="lan" value="篮球"/> 
<label for="lan">篮球</label>
<input type="checkbox" v-model="checkeds" id="yun" value="羽毛球"/> 
<label for="yun">羽毛球</label>
<input type="checkbox" v-model="checkeds" id="diao" value="钓鱼"/>
<label for="diao">钓鱼</label>
<input type="checkbox" v-model="checkeds" id="pao" value="跑步"/>
<label for="pao">跑步</label>
<div>选中的为: {{checkeds}}</div>
```



### 条件渲染指令

#### v-if   v-else-if   v-else 

> 条件判断 条件性的渲染某元素，判定为true时渲染, 否则不渲染
>
> 原理:  v-if  条件为 flase 时 标签其实是被动态删除的  条件为 true 时 标签是被动态创建的
>
> 注意: 进入页面的,元素默认不需要被展示，而且后期这个元素很可能也不需要被展示出来，此时v-if性能更好

```html
<p v-if="data里的数据名 进行判断">动态创建</p>
<p v-else-if="data里的数据名 进行判断">动态创建</p>
<p v-else ="data里的数据名 进行判断">动态创建</p>
```

#### v-show  

> 根据条件展示某元素，区别在于切换的是 display 属性的值 不满足则隐藏
>
> 原理: v-show  是被 display 属性控制的 是不会被删除的
>
> 注意:  如果要频繁的切换元素的显示状态，用 v-show 性能会更好

```html
<p v-show="data里的数据名 进行判断">被 display 属性控制</p>
```



### 迭代渲染指令

#### v-for  遍历循环	

> 列表渲染，遍历容器的元素或者对象的属性  能够添加索引值  在遍历时渲染索引  
>
> 遍历的单个对象 和索引名 可自定义 但是迭代的对象必须是data 的数据名
>
> **注意:  在标签上进行遍历时  该标签的本身也是能够获取到遍历的对象和属性**
>
> **使用v-for时 规定使用   :key="值"   必须是字符串或者是数值 唯一且不能重复 最好使用 id 的值具有唯一性**

**key  注意事项**

![image-20220605172025770](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220605172025770.png)

```html
// 语法: v-for="单个数据名 in 数组名"  获取元素进行遍历 
<div v-for="addr in addrs" :key="addr.id" :title="addr.name">
    <p>{{addr.name}}</p>
</div>

// 可以获取元素的下标 v-for="(单个数据名,下标) in 数组名 "
<div v-for="(addr,i) in addrs" :key="addr.id">
    <!--i表示索引，从0开始-->
    <p>索引值为: {{i}}  +  对象的值为: {{addr.name}}</p>
</div>

// 如果遍历的为集合 list:{key 键 : '值'}  v-for="(单个数据名, key, 索引) in 集合名 "
<div v-for="(list, key, index) in lists" :key="list.id">{{list}}</div>
```



### 其他指令

#### 闪烁解决

当 vue 加载过慢 差值表达式 没有加载vue会显示默认样式 一旦加载到vue就会导致页面闪烁

```html
<style>
    [v-cloak] {
    	display : none;
    }
</style>
<div id="app" v-cloak> ... </div>
```



## Vue -- 方法

### computed -- 计算属性

![image-20220607230805297](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220607230805297.png)

### 调用多个数据

```html
绑定属性: :title="`${aa}, ${bb}`"   
插值表达式: {{ `${aa}, ${bb}` }}
```

### 获取 Vue -- data 数据

```java
方式一: 使用创建的   vue实例对象名.data里的数据名   可获取到对应的数据
方式二: vue实例对象名.$data.数据名
方式二: 在 vue 里 this . data里的数据名可获取到对应的数据   methods函数里 this 就相当于 vue实例对象名
```

### 执行 Vue -- methods 函数

```java
方式一: 使用创建的   vue实例对象名.methods里的函数名(  )   可执行对应的函数
```

### Js 获取触发事件的元素

```html
vue提供了内置变量，名字叫做  **$event**  它就是原生DOM的事件对象  形参 可设置为 e

// 当触发事件 js函数不进行传参时 可在js函数里设置形参 e  调用 e.targer 获取触发事件的元素
<button type="button" @click="methods里的函数名">触发事件的按钮</button>

// 当触发事件 js函数进行多个传参时 加上实参 $event 设置形参 e  调用 e.targer 获取触发事件的元素
<button type="button" @click="函数名($event)">触发事件的按钮</button>
函数名 ( e ) {
	e.targer // 获取触发事件的元素
}
```

### ref  获取  元素  DOM

```java
- 解决的问题: 在vue中操作DOM元素
- 使用步骤:
  1. 给DOM元素设置ref属性的值
  2. 在Vue中的mounted选项下通过this.$refs.属性 获取到要操作的DOM
```

```html
<div id="app">
    <!-- 1. 给要操作的DOM元素设置ref属性 -->
    <input type="text" ref="txt">
</div>
<script src="./vue.js"></script>
<script>
    new Vue({
        el: '#app',
        // mounted当页面加载完毕执行
        mounted() {
            console.log(this.$refs.txt);
            // 2. 用this.$refs.属性 去操作DOM
            this.$refs.txt.focus();
        },
    });
</script>
```



### filters 过滤器

- 作用:处理数据格式
- 使用位置:**双花括号插值和 v-bind 表达式** (后者从 2.1.0+ 开始支持)。
- 分类:局部注册和全局注册

#### **局部注册**

1. 在vm对象的选项中配置过滤器filters:{}
2. 过滤器的名字: (要过滤的数据)=>{return 过滤的结果}
3. 在视图中使用过滤器:  {{被过滤的数据 | 过滤器的名字}}
4. 注意: 局部注册的过滤器只适用于当前vm对象

```html
<div id="app">
    <!-- 3. 调用过滤器 -->
    <p>{{ msg | upper | abc }}</p>
</div>
<script src="./vue.js"></script>
<script>
    new Vue({
        el: '#app',
        data: {
            msg: 'kfc'
        },
        // 1. 设置vm的过滤器filters选项
        filters: {
            upper: function(v) {
                // 2. 在过滤器的方法中操作数据并返回结果
                return v.toUpperCase();
            }
        }
    });
</script>
```

#### 全局注册

```java
1. 在创建 Vue 实例之前定义全局过滤器Vue.filter()
2. Vue.filter('该过滤器的名字',(要过滤的数据)=>{return 对数据的处理结果});
3. 在视图中通过{{数据 | 过滤器的名字}}或者v-bind使用过滤器
// > 注意: 全局注册的过滤器, 不同的vm对象都可以使用
1. 过滤器是可以串联使用的, 比如 {{msg | upper1 | upper2}}
2. 过滤器是可以传参数的,比如{{msg | upper1(自己传的参数)}}
```

```html
<div id="app">
    <!-- 3. 调用过滤器: (msg会自动传入到toUpper中)-->
    <p>{{msg | toUpper}}</p>
</div>
<script src="./vue.js"></script>
<script>
    // 1. 定义全局过滤器
    Vue.filter('toUpper', (value) => {
        console.log(value);
        // 2. 操作数据并返回
        value = value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        console.log(value);
        return value;
    });

    new Vue({
        el: '#app',
        data: {
            msg: 'hello'
        },
        methods: {

        }
    });
</script>
```



### watch: 侦听器

```java
能够听到data数据的变化 且获取对应的 新值 和 旧值
注意:  侦听 对应的数据  则  方法名为 数据名
immediate:  true   -->  打开页面则立刻触发侦听器调用方法 默认为 false  写在方法名(){  }, immediate:  true
如果侦听是一个对象则不会因为对象里的属性发生改变而进行侦听 需开启深度侦听
deep: true  -->  开启深度侦听 默认false  写在方法后 
如果侦听一个对象的属性:  ' 对象名 . 属性 ' () {         }
```

```js
// 侦听器 能够侦听到data数据的变化 且获取对应的 新值 和 旧值
watch: {
    数据名(newVal, oldVal) {
        // newVal - 新值, oldVal - 旧值
    }
},
```

![image-20220606225650460](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220606225650460.png)



## Vue 中的网络请求

在Vue.js中发送网络请求本质还是ajax，我们可以使用插件方便操作。

1. vue-resource: Vue.js的插件，已经不维护，不推荐使用
2. [axios](https://www.kancloud.cn/yunye/axios/234845) :**不是vue的插件**，可以在任何地方使用，推荐
3. cmd 执行命令:  **json-server --watch db.json**

> 说明: 既可以在浏览器端又可以在node.js中使用的发送http请求的库，支持Promise，不支持jsonp
>
> 如果遇到jsonp请求, 可以使用插件 `jsonp` 实现

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

### this 注意点

> 注意:  如果未使用箭头函数 而使用的 函数 则里面的this获取的对象则不一样

```js
.then(res => {
    console.log(res.data);
    // this 代表的 vm --> vue对象实例
})


let _this = this;
.then(function (result) {
    console.log(result);
    // this 代表的 window对象 解决方法则是在方法外获取this赋值给变量 在方法内调用变量代替Vue实例
   	// _this --> vm vue实例
})
```

### 发送get请求   查询

```js
axios.get('http://localhost:3000/json数据名')
    .then(res => {
    console.log(res.data);
})
    .catch(err => {
    console.dir(err)
});
```

### 发送delete请求  删除

```js
// axios.delete('http://localhost:3000/json数据名/' + id)

axios.delete('http://localhost:3000/json数据名/109')
    .then(res => {
    console.log(res.data);
})
    .catch(err => {
    console.dir(err)
});
```

### 发送post请求   添加

```js
// let user = {  name: this.name, age: this.age,  }

axios.post('http://localhost:3000/json数据名', user)
    .then(res => {
    console.log(res);
})
    .catch(err => {
    console.dir(err)
});
```

### jsonp 请求

>  (如果是jsonp请求, 可以使用`jsonp` 包)

- 安装`jsonp` 包 npm i jsonp

```js
jsonp('http://localhost:3000/json数据名', (err, data) => {
    if (err) {
        console.dir(err.msg);
    } else {
        console.dir(data);
    }
});
```

### 动态表格的案例

#### 动态表格 HTML

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>网页名</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        table,
        th,
        td {
            border: 1px solid rgb(0, 0, 0);
            border-collapse: collapse;
            text-align: center;
            margin: 20px auto;
        }

        th {
            width: 120px;
            height: 30px;
        }

        .box {
            width: 800px;
            min-height: 300px;
            max-height: 600px;
            margin: 0 auto;
            margin-top: 10px;
            overflow: auto;
            position: relative;
        }
    </style>
    <!-- vue -->
    <script src="../js/vue.js"></script>
    <!-- 时间格式转换 -->
    <script src="../js/moment.js"></script>
    <!-- axios 异步请求发送 -->
    <script src="../js/axios.min.js"></script>
    <!-- layui 样式 -->
    <script src="../layui/layui.js"></script>
    <link rel="stylesheet" href="../layui/css/layui.css">
</head>

<body>
    <div class="box" id="app">
        商品名称: <input type="text" v-model="name" placeholder="输入商品的名称">
        商品单价: <input type="text" v-model.number="price" placeholder="输入单价">
        商品数量: <input type="text" v-model.number="num" placeholder="输入数量">
        <button @click="addItem" class="layui-btn layui-btn-warm">添加</button>
        <table>
            <tr class="fud">
                <th>序号</th>
                <th>商品名称</th>
                <th>单价</th>
                <th>购买数量</th>
                <th>小计</th>
                <th>添加时间</th>
                <th>操作</th>
            </tr>

            <tr v-for="(item, index) in items">
                <td>{{index + 1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.price}}</td>
                <td>{{item.num}}</td>
                <td>{{item.total}}</td>
                <td>{{item.date | fmtDate('YYYY-MM-DD HH:mm:ss')}}</td>
                <td>
                    <a href="javascript: void(0)" @click.prevent="deleteitem(item.id, index)">删除</a>
                </td>
            </tr>

            <tr v-if="items.length === 0">
                <td colspan="7">没有查询到数据</td>
            </tr>
        </table>
        <button @click="selectItem">刷新</button>
        <!-- <button @click="updateItem">修改</button> -->
    </div>


    <script>
        const vm = new Vue({
            el: '#app',
            data: {
                items: [],
                num: '',
                price: '',
                name: '',
            },
            // 页面加载完成后执行
            mounted() {
                this.selectItem();
            },
            // filters - 局部过滤器 在当前的mv范围内有效
            filters: {
                fmtDate(v, fmtString) {
                    return moment(v).format(fmtString);
                }
            },
            // 侦听器 能够侦听到data数据的变化 且获取对应的 新值 和 旧值
            watch: {
                // 数据名(newVal, oldVal) {
                    // newVal - 新值, oldVal - 旧值
                // }
            },
            // 函数方法
            methods: {

                // 查询
                selectItem() {
                    let _this = this;
                    axios.get('http://localhost:3000/items')
                        .then(function (result) {
                            console.log(result);
                            _this.items = result.data;
                        })
                        .catch(function (err) {
                            console.log(err)
                        });
                },

                // 添加
                addItem() {
                    let _this = this;

                    let item = {
                        name: _this.name,
                        price: _this.price,
                        num: _this.num,
                        total: _this.price * _this.num,
                        date: new Date()
                        // date: moment().format('YYYY-MM-DD')
                    }
                    console.log(item);

                    axios.post('http://localhost:3000/items', item)
                        .then(function (result) {
                            console.log(result);
                            if (result.status == 201) {
                                item.id = result.data.id;
                                _this.items.push(item);
                            } else {
                                alert("添加失败!");
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        });
                },

                // 根据id删除
                deleteitem(id, index) {
                    let _this = this;

                    if (confirm('确认删除?')) {
                        axios.delete('http://localhost:3000/items/' + id)
                            .then(function (result) {
                                console.log(result);
                                if (result.status == 200) {
                                    // 根据数组索引删除
                                    _this.items.splice(index, 1);
                                } else {
                                    alert("删除失败!");
                                }
                            })
                            .catch(function (err) {
                                console.log(err)
                            });
                    }
                },
            },

        })
    </script>
</body>

</html>
```

#### db.json

> 先安装 node:  运行在服务端的 JavaScript

```json
{
  "items": [
    {
      "id": 1,
      "name": "老冰棍",
      "price": 30,
      "num": 5,
      "total": 150,
      "date": "2022-05-20"
    },
    {
      "id": 2,
      "name": "小猫咪",
      "price": 300,
      "num": 10,
      "total": 3000,
      "date": "2012-03-10"
    }
  ]
}
```



## Vue 组件

### 组件简介

> 页面中有多个一样结构的控件 使用组件可进行复用
>
> 组件系统是 Vue 的另一个重要概念，允许我们使用小型、独立和通常**可复用**的组件构建大型应用。

- 组件是可复用的 Vue 实例，且带有一个名字 
- 组件的选项:
  - 组件与 `new Vue` 接收相同的选项:例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。
  - 仅有的例外是像 `el` 这样根实例特有的选项
- 另外, 组件也有自己的选项 template components等

### 组件的特点

- 组件是一种封装 
- 组件能够让我们复用已有的html、css、js
- 可复用
- 是一个特殊的Vue实例
- 可以任意次数的复用
- 每用一次组件，就会有一个它的新**实例**被创建
- 组件中的data要求必须是一个函数,且需要返回一个对象
  - 组件有自己的作用域
- template **每个组件模板有且只有一个根元素** 

> 建议: 在实际开发中,尽可能使用各种第三方组件
>
> 特别注意:  html标签里 名字 会被自动转换全小写 
>
> 如果js里名字为大写驼峰 则 标签里的名字必须中间加 **横杆 -**  
>
> 建议还是全部用全小写  防止名字报错

### template:  组件标签

* 组件标签 内容过多时 可在外面写好 标签使用id指定

```html
<template id="adduser">
    <div>
        .....
    </div>
</template>

var userlist = {   template: '#adduser',  }
```



### 全局注册 组件

> * 组件也是要包裹在 vue 的作用范围里的
>
> * 每一个组件 都具有独立的数据作用域 不会互相影响
>
> * 组件的位置应该在 vm - vue的实例上方 否则无法渲染
>
> * 防止名称报错 建议 组件名称 和 调用名称 都写成 **英文小写 和  -  横杆**

**全局注册 组件模板**

```html
<div id="app">
    <!-- 使用组件名称 调用组件标签 调用的名称大写将会转成写-->
    <组件名称></组件名称>
</div>
<script>
    // vue 全局组件 组件名称
    Vue.component('组件名称', {
        // 组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
        template: `<div>组件标签</div>`,
        // 数据 注意: 必须使用function函数和return独立作用域 否则造成多个组件共用一个data数据
        data: function() {
            return {
                数据名: 数据值,
            };
        },
        // 函数区域
        methods: {
            // 执行函数
        },
    });
</script>
```

**全局注册 组件案例**

```html
<body>
    <div id="app">
        <!-- 使用组件名称 调用组件标签 调用的名称大写将会转成写-->
        <span-btn></span-btn>
        <span-btn></span-btn>
        <span-btn></span-btn>
    </div>

    <script src="js/vue.js" ></script>
    <script>
        // vue 全局组件 组件名称
        Vue.component('span-btn', {
            // 组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
            template: `<div><span>{{count}}</span><button @click="changeCount">点我+1</button></div>`,
            // 数据 注意: 必须使用function函数和return独立作用域 否则造成多个组件共用一个data数据
            data: function() {
                return {
                    count: 0,
                };
            },
            // 函数区域
            methods: {
                changeCount() {
                    this.count++;
                },
            },
        });


        const vm = new Vue({
            el: '#app',
            data: {
                
            },
            methods: {
                
            },
        })
    </script>
</body>
```

### 局部注册 组件

> 在外面 创建组件变量名及 组件的配置  在 vm 实例里写上components: {  '组件调用名' : 组件变量名  },

**局部注册 组件 模板**

```html
<div id="app">
    <!-- 组件名称调用 -->
    <组件名称></组件名称>
</div>
<script>
    //  局部组件 组件变量名
    const 组件变量名 = {
        //  组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
        template:  `<div>{{数据名}}</div>`,
        // 数据 注意: 必须使用function函数和return独立作用域 否则造成多个组件共用一个data数据
        data: function() {
            return {
                数据名: '数据值',
            };
        },
        // 函数区域
        methods: {
            // 执行函数
        },
    }
    const vm = new Vue({
        el: '#app',
        // 组件的局部注册
        components: {
            // '组件调用名' : 组件变量名,
        },
    })
</script>
```

**局部注册 组件 案例**

```html
<body>
    <div id="app">
        <!-- 组件名称调用 -->
        <com-a></com-a>
        <com-b></com-b>
    </div>

    <script src="js/vue.js" ></script>
    <script>

        //  局部组件 组件变量名
        const comA = {
            //  组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
            template:  `<div>{{titleA}}</div>`,
            // 数据 注意: 必须使用function函数和return独立作用域 否则造成多个组件共用一个data数据
            data: function() {
                return {
                    titleA: '我是局部组件 - A',
                }
            },
        }
        //  局部组件 组件变量名
        const comB = {
            template:  `<div>{{titleB}}</div>`,
            data: function() {
                return {
                    titleB: '我是局部组件 - B',
                }
            },
        }


        const vm = new Vue({
            el: '#app',
            data: {
                
            },
            methods: {
                
            },
            // 组件的局部注册
            components: {
                // '组件调用名' : 组件变量名
                'com-a' : comA,
                'com-b' : comB,
            },
        })
    </script>
</body>
</html>
```

### 全局注册 组件  嵌套

```html
<body>
    <div id="app">
        <span-fu></span-fu>
    </div>

    <script src="js/vue.js"></script>
    <script>
        // vue 全局父组件
        Vue.component('span-fu', {
            // 组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
            // 全局父组件 可直接在组件的标签写入 子组件
            template: `<div><span>父组件</span> <span-zi></span-zi> </div>`,
        });
        // vue 全局子组件
        Vue.component('span-zi', {
            // 组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
            template: `<div><span>子组件</span></div>`,
        });

        const vm = new Vue({
            el: '#app',
            data: {

            },
            methods: {

            },
        })
    </script>
</body>
```

### 局部注册 组件  嵌套

> 注意: 子组件 需在父组件上方 在他之前被加载

```html
<body>
    <div id="app">
        <!-- 组件调用 -->
        <com-fu></com-fu>
    </div>

    <script src="js/vue.js"></script>
    <script>

        //  局部子组件
        const comB = {
            template: `<div>我是 - 局部子组件</div>`,
        }

        //  局部父组件
        const comA = {
            //  组件标签 使用撇号 多个标签需要包一个 根元素 如:用 div 包裹
            // 局部父组件 可直接在组件的标签写入 子组件
            template: `<div>我是 - 局部父组件 <com-zi></com-zi> </div>`,
            components: {
                'com-zi': comB,
            },
        }

        const vm = new Vue({
            el: '#app',
            data: {

            },
            methods: {

            },
            components: {
                'com-fu': comA,
            },
        })
    </script>
</body>
```

### 组件  通信

> 组件通信: 就是组件获取vm 实例里的数据

```html
<body>
    <div id="app">
        <!-- 3. 使用子组件时,通过动态绑定自定义属性获取父组件的值 -->
        <component-a :title="msg" :lists="items"></component-a>
    </div>

    <script src="js/vue.js"></script>
    <script>
        // 1. 在子组件中通过props声明自定义属性title
        var ComponentA = {
            template: `<div>
                        <h1>{{ title }}</h1>
                        <ul><li v-for="item in lists">{{item}}</li></ul> 
                        </div>`,
            // 用来接收外部传过来的数据
            // 值的传递是单向的，内部不要修改props里变量的值
            props: ['title', 'lists'],
        };

        const vm = new Vue({
            el: '#app',
            // 目的: 要在子组件中使用父组件的msg的值
            data: {
                msg: 'hello heima',
                items: [
                    { 'id': 1, 'name': '小狗' },
                    { 'id': 2, 'name': '小猫' },
                    { 'id': 3, 'name': '小羊' }
                ]
            },
            methods: {

            },
            // 2. 注册局部组件
            components: {
                'component-a': ComponentA,
            },
        })
    </script>
</body>
```



## 前端路由

### 单页应用的实现原理

> 前后端分离(后端专注于数据、前端专注于交互和可视化)+前端路由

- Hash路由

  - 利用URL上的hash，当hash改变不会引起页面刷新，所以可以利用 hash 值来做单页面应用的路由，

    并且当 url 的 hash 发生变化的时候，可以触发相应 hashchange 回调函数。

  - 模拟实现: 根据超链接的 链接#后缀 进行判断执行 对应的方法

```html
<body>
    <a href="#/">首页</a>
    <a href="#/users">用户管理</a>
    <a href="#/rights">权限管理</a>
    <a href="#/goods">商品管理</a>
    <div id="box"></div>
    <script>
        var box = document.getElementById('box');
        window.onhashchange = function () {
            var hash = location.hash; // 超链接的 herf 值 --> #/goods
            hash = hash.replace('#', ''); // 将#替换空字符串 --> /goods
            switch (hash) {
                case '/':
                    box.innerHTML = '这是首页';
                    break;
                case '/users':
                    box.innerHTML = '这是用户管理';
                    break;
                case '/goods': // 执行
                    box.innerHTML = '商品管理';
                    break;
            }
        };
    </script>
</body>
```

### Vue-Router  路由组件集

> Vue-Router 是 [Vue.js](http://cn.vuejs.org/) 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌 
>
> 实现根据不同的请求地址 而显示不同的组件

> ####### 步骤

导入vue和vue-router 的js文件

```html
<script src="js/vue.js"></script>
<script src="js/vue-router.js"></script>
<script src="js/moment.js"></script>
<script src="js/axios.min.js"></script>
<link rel="stylesheet" href="css/bootstrap-3.3.7.css">
```

设置HTML中的内容

```html
<div id="app">
    <!-- router-link 最终会被渲染成a标签，to指定路由的跳转地址 -->
    <router-link to="/">首页</router-link>
    <router-link to="/users">用户管理</router-link>
    <hr>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
</div>
```

创建组件

```html
<!--  组件模板  -->
<template id="id名字">
   <div>
       组件标签...
   </div>
</template>

<script>
    // 可写组件模板(js外) 使用id名字获取模板 注意: #
    var home = {
        template: '#id名字',
    };

    // 组件也可以放到单独的js文件中
    var home = {
        template: '<div>组件标签...</div>',
    };
</script>
```

配置路由规则

```html
<script>
    // 配置路由规则
    var router = new VueRouter({
        routes: [
            { path: '/请求路径', redirect: '/再次请求路径' },
            { path: '/', redirect: '/userlist' },
            
            { path: '/请求路径', component: 组件变量名 },
            { path: '/users', component: users }
        ]
    });
</script>
```

设置vue的路由选项


```html
<body>
    <div id="app">
        <!-- router-link 最终会被渲染成a标签，to指定路由的跳转地址 -->
        <router-link to="/">首页</router-link>
        <router-link to="/users">用户管理</router-link>
        <hr>
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>
    <script>
        // 创建组件
        // 组件也可以放到单独的js文件中
        var home = {
            template: '<div>这是Home内容</div>'
        };
        var users = {
            template: '<div>这是用户管理内容</div>'
        };

        // 配置路由规则
        var router = new VueRouter({
            routes: [
                { path: '/', component: home },
                { path: '/users', component: users }
            ]
        });

        const vm = new Vue({
            el: '#app',
            router: router
        })
    </script>
</body>
```

### 动态路由

> 进行参数传递 即获取参数
>
> 根据参数的传递类型 分为:  restful 风格参数  和   传统参数

**restful 风格参数** 

> 传参:   to="/请求/参数"   
>
> 路由规则:   { path: ' / 请求 / : 参数名 ', component: 组件名 },
>
> 组件获取参数:   {{$route.params.参数名}}

**传统参数**

> 传参:   to="/请求 ? 参数名=参数"  
>
> 路由规则:   { path: '/请求 ', component:  组件名},
>
> 组件获取参数:   {{$route.query.参数名}}

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>网页名</title>

    <script src="js/vue.js"></script>
    <script src="js/vue-router.js"></script>
</head>

<body>

    <div id="app">
        <!-- router-link 最终会被渲染成a标签，to指定路由的跳转地址 -->
        <router-link to="/params1/200">restful 风格 参数</router-link>
        <router-link to="/params2?id=300">传统 参数</router-link>
        <hr>
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>

    <script>
        // 创建组件
        // 组件也可以放到单独的js文件中
        var paramsCom1 = {
            template: '<div>restful 风格 参数: {{$route.params.id}} </div>',
        };
        var paramsCom2 = {
            template: '<div>传统 参数: {{$route.query.id}} </div>',
        };

        // 配置路由规则
        var router = new VueRouter({
            routes: [
                { path: '/params1/:id', component: paramsCom1 },
                { path: '/params2', component: paramsCom2 },
            ]
        });

        const vm = new Vue({
            el: '#app',
            router: router
        })
    </script>

</body>
</html>
```



## Vue 基础 Ajax -- CRUD  

**Data 数据池**

```js
// 列表组件
    var userlistCom = {
        template: '#userliattable',
        data() {
            return {
                // 第几页
                pageIndex: 1,
                // 总页数
                totalPage: 0,
                // 产品列表
                products: [],
                // 名称条件
                code: '',
                // 风险评级条件
                gradeid: '',
                // 风险评级列表
                grades: [],
            }
        },
```



### 查询 

> 简单分页

```html
<!--公共分页-->
<div style="margin:0px;text-align:center;margin-top:0px;border-top: 1px solid #CCCCCC;">
    <ul class="pagination">
        <li><a @click.prevent="studentlist(1)" href="javascript:void(0);">首页</a></li>
        <li><a href="javascript:void(0);" @click.prevent="studentlist(pageIndex-1)">上一页</a></li>
        <li><a @click.prevent="studentlist(i)" v-for="i in totalPage" href="javascript:void(0);">{{i}}</a></li>
        <li><a @click.prevent="studentlist(pageIndex+1)" href="javascript:void(0);">下一页</a></li>
        <li><a @click.prevent="studentlist(totalPage)" href="javascript:void(0);">末页</a></li>
    </ul>
</div>
```

> 分页 条件 查询  

```js
productList(pageIndex) {
    // 请求的页数超过范围时默认为第一页
    if (!pageIndex || pageIndex <= 0) {
        pageIndex = 1;
    }
    // 当请求的页数超过最大范围 则将 总页数 赋值到data 第几页
    if (pageIndex > this.totalPage && this.totalPage > 0) {
        pageIndex = this.totalPage;
    }
    // 将请求的第几页 赋值到data 第几页
    this.pageIndex = pageIndex;
    // 发生请求到后端
    axios.get('http://localhost:8080/productlist', {
        // 请求发生数据值后台
        params: {
            pageIndex: this.pageIndex,
            code: this.code,
            gradeid: this.gradeid,
        }
    }).then(res => {
        // .then 回调函数 获取数据列表
        this.products = res.data.list;
        // 获取到的总页数 赋值到data 总页数
        this.totalPage = res.data.pages;
    });
},
```

> 后端

```java
@RequestMapping(value="/productlist")
@ResponseBody
public PageInfo<Product> save12(Integer pageIndex, String code, Long gradeid) {
    Product product = new Product();
    product.setCode(code);
    product.setGradeid(gradeid);

    if (pageIndex == null || pageIndex <= 0) {
        pageIndex = 1;
    }

    PageInfo<Product> pageInfo = productService.productListCond(pageIndex, product);
    return pageInfo;
}

// --- 业务层 ---
//开始分页 可使用传参设置 页数 和 每页的数据条数
PageHelper.startPage(pageNum,pageSize);
//紧跟后面查询会被分页
List<实体类类型> 变量名 = 使用工具类调用数据访问层
//将查询的list封装至PageInfo实例
PageInfo<实体类类型> pageInfo = new PageInfo<>(变量名);
return pageInfo;
```



### 删除

> 前端发生删除请求  后台删除成功 利用data数组删除一行

```js
// 删除用户
deleteUser: function (id, index) {
    let _this = this;
    //询问框
    layer.confirm('确认删除？', {
        btn: ['确认','取消'] //按钮
    }, function(){
        axios.get('http://localhost:8080/deleteUser?proid=' + id)
            .then(res => {
                if (res.data.delResult == "true") {
                    _this.products.splice(index, 1);
                } else {
                    alert("删除失败！");
                }
            });
        layer.msg('删除成功', {icon: 1});
    }, function(){
        layer.msg('已取消删除', {icon: 1});
    });
},
```

> 后台 接收 删除的id进行删除

```java
@GetMapping("/deleteUser")
@ResponseBody
public Object deleteUser(Long proid) {
    Map<String,Object> maps = new HashMap<>();
    try {
        productService.removeById(proid);
        maps.put("delResult","true");
    } catch(Exception ex) {
        maps.put("delResult","false");
    }
    return maps;
}
```



### 添加

> 组件跳转  --> 添加组件

```js
// 利用 路由器 的请求跳转至对应的组件
adduser() {
    this.$router.push("/adduser");
}

// 确认添加
add() {
    axios.post("http://localhost:8080/addProduct/", this.product)
        .then(res => {
            if (res.data.updateResult == "true") {
                //提示层
                layer.msg('添加成功');
                this.$router.push("/userlist");
            } else {
                //提示层
                layer.msg('添加失败');
            }
        });
},
```

> 后端 获取实体类数据 进行添加

```java
 @RequestMapping("/addProduct")
 @ResponseBody
 public Object addProduct(@RequestBody Product product) {
     Map<String,Object> maps = new HashMap<>();
     try {
         productService.save(product);
         maps.put("updateResult","true");
     } catch(Exception ex) {
         maps.put("updateResult","false");
     }
     return maps;
 }
```



### 修改

> 组件跳转 附带 参数传递

```js
// 修改用户 凡是从路由拿参数 this.$route 凡是跳组件 this.$router
updateUser(proid) {
    //跳到修改组件
    this.$router.push("/update?proid=" + proid);
},
    
// 初始化用户 根据id查询
    userbyid() {
        // 根据用户ID查询该用户
        let proid = this.$route.query.proid;
        axios.get("http://localhost:8080/getUser/" + proid)
            .then(res => {
            this.product = res.data;
        });
    },
        
// 确认修改
updateUser() {
    axios.post("http://localhost:8080/updateUser/", this.product)
        .then(res => {
            if (res.data.updateResult == "true") {
                //提示层
                layer.msg('修改成功');
                this.$router.push("/userlist");
            } else {
                //提示层
                layer.msg('修改失败');
            }
        });
},
```

> 后台 根据id 初始化  确认后在进行添加

```java
// id查询
@RequestMapping("/getUser/{proid}")
@ResponseBody
public Product getUser(@PathVariable Long proid) {
    return productService.getProductById(proid);
}

// 修改
@RequestMapping("/updateUser")
@ResponseBody
public Object updateUser(@RequestBody Product product) {
    Map<String,Object> maps = new HashMap<>();
    try {
        productService.updateById(product);
        maps.put("updateResult","true");
    } catch(Exception ex) {
        maps.put("updateResult","false");
    }
    return maps;
}
```



<hr>




## vue-cli4  脚手架 项目基本配置

云端仓库第一次启动: npm i

### vue-cli4  脚手架

**创建步骤如下配置**

> vue-cli4项目:  类似前端的服务器
>
> 开始创建: vue create 项目名   
>
> **注意:  项目的位置取决于cmd的启动位置  在创建时 项目名不能以大写 'V' 开头**  具体的创建详情见: 开发工具

![image-20220615143024322](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615143024322.png)

**VS code 调试启动:**

* package.json  -->  调试

* **serve**  vue- cli-service serve
* 访问:    http://localhost:8080/#/

**VS code 命令启动:**

* 终端控制台:  npm run serve

**VS code 命令 打包:**

* 终端控制台:  npm run build



### Element UI 前端框架

> 安装:   vue add element
>
> 安装选项  注意: 需在项目的cmd开启安装

* 需要在 main,js 引入 Element UI

```js
import Vue from 'vue' // 引入vue
import './plugins/axios' // axios
import App from './App.vue' // 引入App.vue文件
import router from './router' // 引入路由
import './plugins/element.js' // 引入element-ui
```

![image-20220615170516739](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615170516739.png)

注意: 修改  报错重启

![image-20220630195802966](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220630195802966.png)

```js
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
```



### axios  异步请求

> 安装:   vue add axios

* 需要在 main,js 引入 axios  

```js
import Vue from 'vue' // 引入vue
import './plugins/axios' // axios
import App from './App.vue' // 引入App.vue文件
import router from './router' // 引入路由
import './plugins/element.js' // 引入element-ui
```

![image-20220615171520521](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220615171520521.png)



### 谷歌浏览器插件

> Vue.js devtools    vue浏览器插件
>
> 安装方法: 谷歌商店直接下载安装 或者 自行下载往浏览器扩展安装  安装记得打开允许网页访问 重启浏览器



## vue 项目 目录介绍

### **项目  目录说明：**

| 目录                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| node_modules 目录    | 项目所依赖的包的存放目录                                     |
| public 目录          | 存放项目所需的静态资源文件目录                               |
| src 目录             | 存放项目的源码文件的目录                                     |
| babel.config.js 文件 | babel 配置文件                                               |
| package.json 文件    | 整个项目的配置文件                                           |
| src/main.js 文件     | 整个项目的入口文件，并且在这里引入全局使用的 .vue、.css 文件 |

### src 目录说明

- assets 静态资源 (css、 js 、 image 、字体图标)

- views 放置组件页面

- components 放置组件页面中嵌套的组件

- App.vue 根组件 => 指定路由出口

  - 脚手架之后,所有的组件都将渲染到 app.vue 中

- app 中的 #app 还是 index.html 中的 #app,  app.vue 中的会覆盖前者，可以通过分别添加 title 属性验证一下

- <router-view/> 路由出口要写在 app.vue 组件模板中

- main.js

  - 入口 js 文件

  - 作用 : 创建 vue 实例,导入其他组件并挂在到 vue 实例上

  - `Vue.config.productionTip = false` 不要打印提示

  - 检测 no new  : 见后面的检测警告

    ```javascript
    new Vue({
      el: '#app', // 目标显示
      router,   // 挂载路由
      components: { App }, // 注册组件 App
      template: '<App/>' // 模板显示组件 app
    })
    ```


- route/index.js => 路由

- 一定要记住 :`Vue.use(Router)` 模块化公工程中一定要安装路由插件 .js 就是一个模块

<font color=red>index.html是页面的入口文件，自动注入 ./src/main.js文件</font>

### 单文件组件

在 **vue-cli** 创建的 vue 项目中，我们看到有一类后缀名为 **.vue** 的文件，我们称为『**单文件组件**』。

**.vue** 文件的概念的出现，是为了让我们以更友好更简便的方式编写 vue 代码。

```ini
至于如何将 .vue 文件『编译』成传统的、正常的、浏览器认识的 html 中嵌 js 和 css 的形式，这就是 vue-cli 背后的 webpack 所要负责处理的事情了。
```

单文件组件的组成结构分三部分：

- **template** 组件的模板区域
- **script** 业务逻辑区域
- **style** 样式区域

每个组件都有自己独立的 html、js、css，互不干扰，真正做到可独立复用。

```vue
<template>
  <!-- 这里用于定义 Vue 组件的模板内容 -->
    <div class="about">
        <h1>This is an about page</h1>
    </div>
</template>

<script>
  // 这里用于定义 Vue 组件的业务逻辑
  export default {
    data: () { return {} }, // 私有数据
    methods: {} // 处理函数
    // ... 其它业务逻辑
}
</script>

<!-- <style scoped> 表示此样式只在本组件有效 否则有可能影响其他组件 -->
<style scoped>
  /* 这里用于定义组件的样式 */
</style>
```

### package.json 文件

VsCode:  可在里面点击 调试 运行

vue 项目的核心配置文件 **package.json** 中已经配置了两个命令：

 IDEA 中查看 **package.json** 文件的内容，你会发现这两行命令前各有一个代表运行的可点击的绿色三角形。

- **serve 是运行命令** 。在开发过程中是我们最经常用到的命令。通过它能将 vue 项目运行起来，是我们能通过浏览器访问。
- **build 是编译命令** 。是在开发结束后将项目源码编译、整合成最终的 html、js、css 等文件，这些文件会出现在项目的 **dist** 目录下

### vue.config.js 文件

默认情况下通过 `serve` 命令运行项目会占用 `8080` 端口，如果想作出改变的话，可以在项目的根目录下（即，和 package.json 文件同级）创建一个名为 `vue.config.js` 的文件，并在其中加入如下配置：

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,  // 支持 compller 编译模式 直接运行
  devServer: {
    port: 80,   //配置web服务器的访问端口
    proxy: {
        "/api" : {                            // 1 客户端发送的那些请求需要被代理服务器进行替换
            target: "http://127.0.0.1:8080",  // 2 服务器的访问地址
            changeOrigin: true,               // 3 是否跨域
            pathRewrite: {
                "^/api" : "/"   // 4 客户端发送请求被代理的规则 /api/userList  -> /userList
            }
        }
    }
  }
})
```

<font color=red>说明： **vue.config.js** 这个文件是 @vue/cli 项目的配置文件，以前（vue-cli）它叫 **config/index.js** </font>

### main.js 的配置

```js
import Vue from 'vue' // 引入vue
import './plugins/axios' // axios
import App from './App.vue' // 引入App.vue文件
import router from './router' // 引入路由
import './plugins/element.js' // 引入element-ui

Vue.config.productionTip = false // 关闭生产模式提示

//希望axios每次发送后台请求都带上token
axios.interceptors.request.use(
  function(config) {
    //Authorization为发送到服务器请求头的键
    config.headers.token = window.localStorage.getItem('token');
    //console.log(token);
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
);


new Vue({
  router, // 将路由挂载到Vue实例上
  render: h => h(App) // 指定渲染的组件
}).$mount('#app') // 将App组件渲染到id为app的元素上

// new Vue({
//   el: '#app',
//   components: {App},
//   router: router,
//   template: "<App/>"
// });
```

### App.vue  主路由组件

```txt
渲染时会覆盖 index.html 页面
注意:  style 为 全局样式  
其他组件需 **<style scoped>** 表示此样式只在本组件有效 否则有可能影响其他组件
```

```vue
<template>
  <div id="app">
    <!-- 主路由渲染 -->
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>

<!-- 全局样式 -->
<style>
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body,
    #app {
        width: 100%;
        height: 100%;
    }
</style>
```

### index.js  路由器

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
// 直接指定必须引入
import HomeView from '@/views/HomeView.vue' // @ 相当于 src 绝对路径

Vue.use(VueRouter)

const routes = [
  // redirect: '/login' 重定向
  { path: '/', redirect: '/login' },
  // 如果使用箭头函数指定 则上方不需要引入
  { path: '/login', name: 'login',component: () => import('../views/loginView.vue') },
  // 如果直接指定 则必须只在上方引入
  { path: '/home', name: 'home', component: HomeView, 
        children : [
            {path: '/teacher', name: 'teacher', component: () => import('../views/TeacherView.vue')}
        ]
    }
]

const router = new VueRouter({
  routes
})

export default router

// to：路由对象，即将要进入的目标
// from：表示从哪里来
// next：回调函数，通过 next 回调函数你可以让 vue-router 去处理导航、取消导航、重定向到其它地方或执行其它操作。
// 配置路由守卫
router.beforeEach((to, from, next) => {
  // 是否是去登录
  if(to.path == '/login') {
      // 如果要去登录，直接放行
      next();
  } else {
      let token = window.localStorage.getItem('token');

      // token不存在，去登录
      if(!token) {
          next('/login')
          return;
      }
      
      let expTime = JSON.parse(atob(token.split('\.')[1])).exp;
      let nowtime = (new Date()).getTime() / 1000;
      if(nowtime >= expTime) { // 如果过期，去登录
          next('/login');
      } else {    // 否则放行
          next();
      }
  }
});
```

### views 文件夹

> views 文件夹: 为 组件 文件夹 存放各类组件

### 补充: 登录页

```vue
<template
template>
    <div id="login-main">
        <el-row type="flex" class="row-bg" justify="center" align="middle">
            <el-col :span="6">
                <el-form :model="userForm" status-icon :rules="rules" ref="userForm">
                    <el-form-item label="账户" prop="username">
                        <el-input type="text" v-model="userForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="btnlogin('userForm')">提交</el-button>
                        <el-button @click="resetForm('userForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data: function() {
        return {
            userForm: {
                username: '',
                password: ''
            },
            rules: { // 编写表单验证规则
                username: [
                    { required: true, message: '请输入帐号', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 根据 tocken 进行对应的跳转页面
        this.tockengoto();
    },
    methods: {

        tockengoto() {
            //获取tocken， 如果token为空， 表明需要登录
            let token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            //token不为空且没有过期，直接跳转/home
            let exptime = JSON.parse(atob(token.split('\.')[1])).exp;
            let nowtime = new Date().getTime() / 1000;
            if (exptime > nowtime) {
                this.$router.push('/home');
            }
        },

        btnlogin: function(formName) {
            //调用表单验证结果
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let formData = new URLSearchParams({
                        "username": this.userForm.username,
                        "password": this.userForm.password
                    });

                    // debugger
                    // 提交表单
                    this.$axios.post('/api/login', formData.toString())
                        .then((res) => {
                            if(res.data.status == 200) {
                                // 保存服务器返回的token
                                let token = res.data.data;
                                window.localStorage.setItem('token', token);
                                window.localStorage.setItem('username', this.userForm.username);
                                // 跳转到首页
                                // this.$router.push({name: 'home'}); 
                                this.$router.push('/home');
                                this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch((erro) => {
                            
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 重置表单
        resetForm: function(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<!-- <style scoped> 表示此样式只在本组件有效 否则有可能影响其他组件 -->
<style scoped>
    #login-main {
        width: 100%;
        height: 100%;
        background-color: #2d434c;
    }

    .el-row {
        height: 100%;
        height: 100%;
    }

    .el-col {
        background-color: white;
        border-radius: 15px;
        padding: 30px;
        width: 300px;
        height: 400px;
    }

    .el-form{
        padding-top: 50px;
    }
</style>
```





## 组件 -- 路由器 

> index.js  -->  根组件 路由器

### **引入文件路径**:

> import 名字 from '路径' 
>
> import HomeView from '../views/HomeView.vue' // 相对路径
>
> import HomeView from '@/views/HomeView.vue' // @ 相当于 src 绝对路径

### **路由跳转**:

> component: HomeView  -->  如果直接指定 则必须只在上方**引入文件路径**
>
> component: () => import('../views/loginView.vue')  -->  如果使用箭头函数指定 则上方不需要引入
>
> redirect: '/login'  -->  重定向 可根据请求再次跳转别的组件

### **子组件嵌套 路由 path 请求**

> 请求的 path  ' / ' 相对于请求根
>
> 如果 path: '/请求' 则在请求时 **/#/请求** 可直接访问
>
> 如果 path: '请求'  则为相对路径  会将父组件请求进行合并 **/#/父请求/子请求**

```js
const routes = [
  // redirect: '/login' 重定向
  { path: '/', redirect: '/login' },
  // 如果使用箭头函数指定 则上方不需要引入
  { path: '/login', name: 'login',component: () => import('../views/loginView.vue') },
  // 如果直接指定 则必须只在上方引入
  { path: '/home', name: 'home', component: HomeView, 
     children: [
      { path: '', redirect: '/shouye' },
      { path: '/shouye', name: 'shouye', component: () => import('../views/shouye.vue') },
      { path: '/user/list', name: 'user', component: () => import('../views/user/userbiew') }
    ]},
  }
]
```

### **Js 发送请求 跳转组件**

> this.$router.push({name: 'home'});   // 根据 路由 name: 'home' 的名字跳转 注意: 不会刷新请求路由
>
> this.$router.push('/home');  // 根据 路由 path: '/home'  的请求条

 





## 组件  --  Vue

### **组件模板**

```vue
<template>
  <div id="app">
    <!-- 路由渲染 -->
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: '组件名称',
        data: function() {
            return {
                username: "",
                menuItem:[], //接收用户的菜单数据
            };
        },
        methods: {
            
        },
    }
</script>

<!-- 组件样式 -->
<style scoped>
    
</style>
```

### **组件 style 样式**

```vue
全局样式:  App.vue  --> <style>  为全局样式 该样式应用于所有组件
局部样式:  <style scoped>  表示此样式只在本组件有效 否则有可能影响其他组件
```

### 组件调用

```html
// 父组件
<!--3. --> 子组件渲染-->
<TeacherAdd ref="addTeacherCom"></TeacherAdd>

<script>
    // 1. --> 导入子组件路径
    import TeacherAdd from '@/components/teacher/TeacherAdd.vue';
    export default {
        name: 'TeacherView',
        // 组件
        components: {
            // 2. --> 名字都一致可省略
            TeacherAdd,   
        }
    }
</script>
```



## 组件 传值

### 父 --> 子 

> this.$refs.组件ref名.子组件数据名 = 值;
>
> this.$refs.组件ref名.子组件函数();

### 子 --> 父

> this.$parent.数据名
>
> this.$parent.函数()

### 兄弟传值

**数据传递**

> 路由跳转 并进行数据传递

```js
this.$router.push({
    path: '/audit',
    query: {
        // 传递名 : 数据
        saletable: this.saletable,
    }
})
```

**接收数据**

> 注意: 可使用钩子函数 渲染就触发  保证数据既时渲染

```js
// data 数据 赋值 =  this.$route.query.传递名;
this.saletable = this.$route.query.saletable;
```





## Element UI 

### 父组件 调用 子组件 

> this.$refs.组件ref名.子组件数据名 = 值;
>
> this.$refs.组件ref名.子组件函数();

```html
// 父组件
<!--子组件渲染-->
<TeacherAdd ref="addTeacherCom"></TeacherAdd>

<script>
    // 导入子组件路径
    import TeacherAdd from '@/components/teacher/TeacherAdd.vue';
    export default {
        name: 'TeacherView',
        // 组件
        components: {
            TeacherAdd,   // 名字都一致可省略
        }
    }
    
    // 通过子组件的引用传递，获得子组件中的变量
    this.$refs.addTeacherCom.dialogAdd = true;
    this.$refs.组件ref名.子组件数据名 = 值;
</script>
```

### 子组件 调用 父组件 

> this.$parent.数据名
>
> this.$parent.函数()

### 函数传参 --  本行数据 对象

> scope  会封装 遍历的列表的一行数据 及 对应的index索引
>
> scope.row  一行数据  为 对象
>
> ![image-20220617201430656](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220617201430656.png)

### 双向绑定会失效

```js
// 通过子组件的引用传递，获得子组件的变量
this.$refs.ItemUpdateCom.dialogEdit = true;


// 通过teacherStr 还原成对象，这个时候不能直接赋值给this.teacher，
this.$refs.updateTeacherCom.teacherStr = JSON.stringify(teacher);
// 如果直接赋值，双向绑定会失效；遍历赋值可以生效
let obj = JSON.parse(this.teacherStr);
for(let key in obj) {
    this.$set(this.teacher, key, obj[key]);
}
```





## vue 项目 小知识

### **断点 debug**

> 只需要在 断点处 debugger 然后再运行时 会自动运行到断点处

### **浏览器 本地储存**

> 储存数据:     window.localStorage.setItem('数据名', 数据);
>
> 根据名字删除数据:     window.localStorage.removeItem("数据名");
>
> 删除所有数据:     window.localStorage.clear();
>
> 获取数据:     window.localStorage.getItem('数据名');

### **后端 根据 token 获取数据**

> 原理: 获取token后 第二段为载荷数据 根据其名字可以拿出对应的数据 
>
> 获取请求头中的token:  String token = request.getHeader("token");
> 解析出token的用户名:  String username = JwtTokenUtil.getUsername(token);

### 后端权限 联级树状

```java
// 查询所有的资源, 并按树结构返回
@Override
public List<Perms> listAll() {
    // 获取所有资源list
    List<Perms> permsList = this.list();

    List<Perms> rootPermList = new ArrayList<>();   // 定义一级菜单列表
    Map<Integer, Perms> permsMap = new HashMap<>(); // 定义一个map, 存放所有资源 id -> Perms

    permsList.forEach(perms -> {
        //  如果父ID为null，则为一级菜单
        if(perms.getParentid() == null) {
            rootPermList.add(perms);
        }
        // 把资源实体对象全部放入map
        permsMap.put(perms.getId(), perms);
        // 对所有 perms 初始化 childerList
        perms.setChilderList(new ArrayList<>());
    });
    permsList.forEach(perms -> {
        // 判断 是否有父级id 如果有表示不是一级菜单
        if(perms.getParentid() != null) {
            // 获取 父级id
            Integer parentId = perms.getParentid();
            // 根据 父级id 拿到父级实体类对象 实例
            Perms parentPerms = permsMap.get(parentId);
            // 将 遍历的不是一级菜单的实例 存入其父级的 字段集合里
            List<Perms> childerList = parentPerms.getChilderList();
            childerList.add(perms);
        }
    });
    return rootPermList;
}
```





## Vue-cli4 -- CRUD -- 模板

条件分页查询列表 删除

```html
<!-- 分页开始 -->
<el-row>
    <el-col :span="24">
        <div style="margin-top: 15px; text-align: center">
            <el-pagination background :page-sizes="[5, 10, 15, 20, 25]" layout="prev,pager,next,sizes,total"
                           :total="total" :page-count="pages" :current-page="pageNum" :page-size="pageSize"
                           @size-change="chageSize" @current-change="chageCurrent" @prev-click="chageCurrent"
                           @next-click="chageCurrent">
            </el-pagination>
        </div>
    </el-col>
</el-row>
<!-- 分页结束 -->


<!--添加讲师组件-->
<TeacherAdd ref="addTeacherCom"></TeacherAdd>

<script>
import TeacherAdd from '@/components/teacher/TeacherAdd.vue';
import TeacherUpdate from '@/components/teacher/TeacherUpdate.vue'

export default {
    name: 'TeacherView',
    data: function () {
        return {
            teacherItem: [],    // 要显示的数据
            teacherName: '',    // 查询条件

            total: 0,           // 总条数
            pages: 0,           // 总页数
            pageNum: 1,         //当前页码
            pageSize: 5,        // 每页条数
        }
    },
    methods: {
        // 查询讲师信息
        queryTeacher: function () {
            this.$axios.get('/api/teacher/list', {
                params: {
                    teacherName: this.teacherName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            }).then(res => {
                // console.log(res);
                if (res.data.status == 200) {
                    this.teacherItem = res.data.data.list;

                    // 给分页组件的数据赋值
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                    this.pageNum = res.data.data.pageNum,
                    this.pageSize = res.data.data.pageSize;
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: "warning",
                    });
                }
            }).catch(err => {
                this.$message({
                    showClose: true,
                    message: err,
                    type: "error",
                });
            });
        },
        // 改变每页条数下拉框事件，通过形参获得当前选中的条数
        chageSize: function (pageSize) {
            this.pageNum = 1;                       // 修改当前页为第1页
            this.pageSize = pageSize;               // 修改每页条数

            this.queryTeacher();                    // 根据上面的修改查询讲师列表
        },
        // 点击 前一页、后一页、页码 事件
        chageCurrent: function (pageNum) {
            this.pageNum = pageNum;                 // 修改当前页码
            this.queryTeacher();                    // 根据上面的修改查询讲师列表
        },
        // 添加讲师弹框
        showAddTeacher: function () {
            this.$axios.get('/api/teacher/addShow')
                .then((res) => {
                    if (res.data.status == 200) {    // 有权限
                        // 通过子组件的引用传递，获得子组件中的变量
                        this.$refs.addTeacherCom.dialogAdd = true;
                    } else {                        // 否则
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
        },
        // 编辑讲师弹框
        showUpdateTeacher: function (teacher) {
            this.$axios.get('/api/teacher/updateShow')
                .then((res) => {
                    if (res.data.status == 200) {
                        // 通过子组件的引用传递，获得子组件的变量
                        this.$refs.updateTeacherCom.teacher = teacher;
                        this.$refs.updateTeacherCom.teacherStr = JSON.stringify(teacher);
                        this.$refs.updateTeacherCom.dialogEdit = true;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
        },
        // 根据id删除
        deleteteacherbyid(scope) {
            console.log(scope);
            this.$confirm('确定退出?', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get('/api/teacher/deleteteacherbyid?id=' + scope.row.id)
                    .then((res) => {
                    if (res.data.status == 200) {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success",
                        });
                        this.teacherItem.splice(scope.$index, 1);
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
                })
        },
    },
    // 钩子函数
    created: function () {
        this.queryTeacher();
    },
    // 组件
    components: {
        TeacherAdd,
        TeacherUpdate,
    }
}
</script>
```

添加

```html
<script>
    export default {
        name: 'TeacherAdd',
        data: function() {
            return {
                dialogAdd: false,   // 控制内容是否显示，false表示隐藏
                teacher: {          // 添加的数据对象
                    isfamous: 'y',
                    status: 'y'
                },        
                subjectList: [],    // 课程信息
            }
        },
        methods: {
            loadSubject: function() { // 加载课程消息
                this.$axios.get('/api/subject/list')
                    .then((res) => {
                        if(res.data.status == 200) {
                            this.subjectList = res.data.data;
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            showClose: true,
                            message: err,
                            type: 'error'
                        });
                    });
            },
            btnClose: function() { // 取消添加事件
                this.teacher = {isfamous: 'y', status: 'y'};
                this.dialogAdd = false;
            },
            btnAdd: function() {    // 添加按钮
                this.$axios.post('/api/teacher/add', this.teacher)
                    .then((res) => {
                        if(res.data.status == 200) {    // 添加讲师成功
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });
                            // 隐藏自己
                            this.btnClose();
                            //刷新讲师列表
                            this.$parent.queryTeacher();
                        } else {    // 添加讲师失败
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                                showClose: true,
                                message: err,
                                type: 'error'
                            });
                    });
            }
        },
        created: function() {
            this.loadSubject();
        }
    }
</script>

```

修改

```html
<script>
    export default {
        name: 'TeacherUpdate',
        data: function() {
            return {
                dialogEdit: false,   // 控制内容是否显示，false表示隐藏
                teacher: {},        // 修改的数据对象
                subjectList: [],     // 课程信息列表

                teacherStr: '',
            }
        },
        methods: {
            loadSubject: function() {   //加载课程信息
                this.$axios.get('/api/subject/list')
                .then(res => {
                    if(res.data.status == 200) {
                        this.subjectList = res.data.data;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: 'error'
                    });
                })
            },
            btnClose: function() {      //取消按钮
                // 通过teacherStr 还原成对象，这个时候不能直接赋值给this.teacher，
                // 如果直接赋值，双向绑定会失效；遍历赋值可以生效
                let obj = JSON.parse(this.teacherStr);
                for(let key in obj) {
                    this.$set(this.teacher, key, obj[key]);
                }
                this.dialogEdit = false;
            },
            btnUpdate: function() {    // 编辑讲师信息
                this.$axios.post('/api/teacher/update', this.teacher)
                    .then((res) => {
                        if(res.data.status == 200) {
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });

                            // 隐藏自己
                            this.btnClose();
                            // 调用父组件查询列表数据
                            this.$parent.queryTeacher();
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            showClose: true,
                            message: err,
                            type: 'error'
                        });
                    });
            }
        },
        created: function() {
            this.loadSubject();
        }
    }
</script>
```

后台

```java
package com.apai.controller;


import com.apai.entity.Teacher;
import com.apai.service.ITeacherService;
import com.apai.util.ResponseResult;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    @Autowired
    private ITeacherService teacherService;

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('teacher:list')")
    public ResponseResult<Object> teaall(String teacherName, Integer pageNum, Integer pageSize) {
        ResponseResult<Object> responseResult = null;
        PageInfo<Teacher> PageInfo = teacherService.teaall(teacherName, pageNum, pageSize);
        responseResult = new ResponseResult<Object>(PageInfo, "ok", 200);
        return responseResult;
    }

    @GetMapping("/addShow")
    @PreAuthorize("hasAuthority('teacher:add')")
    public ResponseResult<Void> addShow() {
        return new ResponseResult<>(200, "OK");
    }


    @PostMapping("/add")
    @PreAuthorize("hasAuthority('teacher:add')")
    public ResponseResult<Void> addTeacher(@RequestBody Teacher teacher) {
        boolean isOk = teacherService.save(teacher);
        ResponseResult<Void> responseResult = null;

        if(isOk) {
            responseResult = new ResponseResult<>(200, "添加讲师成功");
        } else {
            responseResult = new ResponseResult<>(500, "添加讲师失败");
        }

        return responseResult;
    }

    @GetMapping("/updateShow")
    @PreAuthorize("hasAuthority('teacher:update')")
    public ResponseResult<Void> updateShow() {
        return new ResponseResult<>(200, "OK");
    }

    @PostMapping("/update")
    @PreAuthorize("hasAuthority('teacher:update')")
    public ResponseResult<Void> updateTeacher(@RequestBody Teacher teacher) {
        boolean isOk = teacherService.updateById(teacher);
        ResponseResult<Void> responseResult = null;
        if(isOk) {
            responseResult = new ResponseResult<>(200, "编辑讲师成功");
        } else {
            responseResult = new ResponseResult<>(500, "编辑讲师失败");
        }
        return responseResult;
    }

    @GetMapping("/deleteteacherbyid")
    @PreAuthorize("hasAuthority('teacher:delete')")
    public ResponseResult<Void> deleteteacherbyid(Integer id) {
        //删除讲师
        boolean isOk = teacherService.removeById(id);
        ResponseResult<Void> responseResult = null;
        if(isOk) {
            responseResult = new ResponseResult<>(200, "删除讲师成功");
        } else {
            responseResult = new ResponseResult<>(500, "删除讲师失败");
        }
        return responseResult;
    }
    
    
  	// 查询 集合 封装
    @GetMapping("/brands")
    public ResponseResult<List<Brand>> menuItem() {
        List<Brand> list = brandService.list();
        ResponseResult<List<Brand>> bra = new ResponseResult<>(list, "ok", 200);
        return bra;
    }
}

```

















