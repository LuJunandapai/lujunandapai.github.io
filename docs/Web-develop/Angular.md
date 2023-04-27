---
title: Angular 框架
date: 2023/04/26
---

# | --- Angular 基础

[(8条消息) angular基础学习_book_longker的博客-CSDN博客_angular学习](https://blog.csdn.net/book_longker/article/details/105421125)

## Angular 项目的创建

Angular CLI用于简单，快速构建Angular2项目，只要掌握几行命令就能扣减前端架构。依赖于NodeJs和npm。

> 安装脚手架

```java
// 全局安装 只需一次
npm insta11 -g angular-cli
```

> 创建项目

```java
// 在项目的存入位置的文件夹里 cmd 进入黑窗口开始创建
ng new 项目名
// 选择 1-->y  2-->scss
```

> 报错解决

```java
// 创建项目完成后出现: 报错 Installing packages (npm)...npm ERR! code ERESOLVE
// npm错误！ |  ERESOLVE无法解析依赖关系树

// 在项目文件夹类执行以下命令
npm install xxx --legacy-peer-deps 
```

> 运行项目

```java
// 在项目文件夹内 cmd 或者 vscode终端 开启
ng serve --open
// 在 package.json 调试start开启
npm run start
```

> 默认的访问地址

```java
http://localhost:4200/
```

> 修改启动端口号

```java
// package.json 添加一条自定义启动命令 指定启动端口
// "dev": "ng serve --port 1020", 使用dev启动即可

"name": "my-app",
"version": "0.0.0",
"scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build", 
    "dev": "ng serve --port 1020",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
},
```

## Angular 目录结构

[(8条消息) Angular项目目录结构详解_XeonYu的博客-CSDN博客_angular项目结构](https://blog.csdn.net/yuzhiqiang_1993/article/details/71191873?ops_request_misc=%7B%22request%5Fid%22%3A%22166634022416782388094440%22%2C%22scm%22%3A%2220140713.130102334..%22%7D&request_id=166634022416782388094440&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-1-71191873-null-null.142^v59^pc_rank_34_2,201^v3^control_1&utm_term=Angular目录结构&spm=1018.2226.3001.4187)

**首层目录**：

```java
node_modules		第三方依赖包存放目录
e2e  				端到端的测试目录  用来做自动测试的
src   				应用源代码目录  
.angular-cli.json   Angular命令行工具的配置文件。后期可能会去修改它，引一些其他的第三方的包  比如jquery等
karma.conf.js  		karma是单元测试的执行器，karma.conf.js是karma的配置文件
package.json   		这是一个标准的npm工具的配置文件，这个文件里面列出了该应用程序所使用的第三方依赖包。
    				实际上我们在新建项目的时候，等了半天就是在下载第三方依赖包。下载完成后会放在node_modules这个目录中，我们可能会修改这个文件。
protractor.conf.js  也是一个做自动化测试的配置文件
README.md           说明文件
tslint.json       	是tslint的配置文件，用来定义TypeScript代码质量检查的规则，不用管它
```

**src 目录：**

```java
app目录			   包含应用的组件和模块，我们要写的代码都在这个目录
assets目录  		   资源目录，存储静态资源的  比如图片
environments目录     环境配置。Angular是支持多环境开发的，我们可以在不同的环境下（开发环境，测试环境，生产环境）共用一套代码，主要用来配置环境的
index.html  		整个应用的根html，程序启动就是访问这个页面
main.ts    			整个项目的入口点，Angular通过这个文件来启动项目
polyfills.ts   		主要是用来导入一些必要库，为了让Angular能正常运行在老版本下
styles.css   		主要是放一些全局的样式
tsconfig.app.json	TypeScript编译器的配置,添加第三方依赖的时候会修改这个文件
tsconfig.spec.json	不用管
test.ts    			也是自动化测试用的
typings.d.ts        不用管
```



# Angular 模块

模块组件的特征在于可以用于执行单个任务的代码块。您可以从代码(类)中导出值。 Angular应用程序被称为模块， 并使用许多模块构建您的应用程序。Angular 的基本构建块是可以从模块导出的组件类。

## app 模块：

```java
app-routing.module.ts  路由文件
app.component.html     页面模板
app.component.scss	   页面样式
app.component.spec.ts
app.component.ts	   联动页面模板和样式 js数据的输入
app.module.ts
```

> app.component.ts

模块组件的特征在于可以用于执行单个任务的代码块。 您可以从代码(类)中导出值。 Angular应用程序被称为模块，并使用许多模块构建您的应用程序。 Angular 的基本构建块是可以从模块导出的组件类。

组件是拥有模板的控制器类，主要处理页面上的应用程序和逻辑的视图。 组件可以拥有独立的样式。
注册组件，使用 *@Component* 注释，可以将应用程序拆分为更小的部分。

```java
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
// @Component最常用的几个选项:
selector：这个 CSS 选择器用于在模板中标记出该指令，并触发该指令的实例化。
template：组件的内联模板
templateUrl：组件模板文件的 URL
styleUrls：组件样式文件
styles：组件内联样式
```

```ts
// app.component.ts 数据定义写法
// 修饰符
public id: number = 123; // 
private id: number = 123; // 私有的

// 变量名:类型 = 值
msg: string = "message"; // 字符串
id: number = 123; // 数值

// 对象 | 设置为any 正常
public userinfo: any = {
    "username": "张三",
    "age": 18
};


// 数组
list: any[] = ["a", "b", "c"];
items: Array<number> = [1, 2, 3, 5];
userLists: any[] = [
    { "username": "name1", "age": 18 },
    { "username": "name2", "age": 28 },
    { "username": "name3", "age": 38 },
];
```



## 组件生命周期

   Angular 会按以下顺序执行钩子方法。你可以用它来执行以下类型的操作。

| 钩子方法                  | 用途                                                         | 时机                                                         |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `ngOnChanges()`           | 当 Angular 设置或重新设置数据绑定的输入属性时响应。 该方法接受当前和上一属性值的 `SimpleChanges` 对象注意，这发生的非常频繁，所以你在这里执行的任何操作都会显著影响性能。 | 在 `ngOnInit()` 之前以及所绑定的一个或多个输入属性的值发生变化时都会调用。注意，如果你的组件没有输入，或者你使用它时没有提供任何输入，那么框架就不会调用 `ngOnChanges()`。 |
| `ngOnInit()`              | 在 Angular 第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。 | 在第一轮 `ngOnChanges()` 完成之后调用，只调用**一次**。      |
| `ngDoCheck()`             | 检测，并在发生 Angular 无法或不愿意自己检测的变化时作出反应。 | 紧跟在每次执行变更检测时的 `ngOnChanges()` 和 首次执行变更检测时的 `ngOnInit()` 后调用。 |
| `ngAfterContentInit()`    | 当 Angular 把外部内容投影进组件视图或指令所在的视图之后调用。 | 第一次 `ngDoCheck()` 之后调用，只调用一次。                  |
| `ngAfterContentChecked()` | 每当 Angular 检查完被投影到组件或指令中的内容之后调用        | `ngAfterContentInit()` 和每次 `ngDoCheck()` 之后调用         |
| `ngAfterViewInit()`       | 当 Angular 初始化完组件视图及其子视图或包含该指令的视图之后调用 | 第一次 `ngAfterContentChecked()` 之后调用，只调用一次。      |
| `ngAfterViewChecked()`    | 每当 Angular 做完组件视图和子视图或包含该指令的视图的变更检测之后调用。 | `ngAfterViewInit()` 和每次 `ngAfterContentChecked()` 之后调用。 |
| `ngOnDestroy()`           | 每当 Angular 每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏 | 在 Angular 销毁指令或组件之前立即调用。                      |



## 创建模块

> **ng g c 模块名称 | 命令创建**

ng g c 模块名称  |  将会在app 目录下生成一个模块组件

注意: 报错  ng : 无法加载文件 C:\Users\Lujun\Documents\node-v16.15.0-win-x64\ng.ps1，因为在此系统上禁止运行脚本

```java
1. 首先在win10的搜索框中输入windows PowerShell，并选择以管理员的身份运行
2. 打开后，输入以下命令 set-ExecutionPolicy RemoteSigned
3. 再输入A，更改权限
4. get-ExecutionPolicy
5. 显示RemoteSigned即可
```

> **Angular Files 插件创建**

## 组件生命周期

   Angular 会按以下顺序执行钩子方法。你可以用它来执行以下类型的操作。

| 钩子方法                | 用途                                                         | 时机                                                         |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| ngOnChanges()           | 当 Angular 设置或重新设置数据绑定的输入属性时响应。 该方法接受当前和上一属性值的 `SimpleChanges` 对象注意，这发生的非常频繁，所以你在这里执行的任何操作都会显著影响性能。 | 在 `ngOnInit()` 之前以及所绑定的一个或多个输入属性的值发生变化时都会调用。注意，如果你的组件没有输入，或者你使用它时没有提供任何输入，那么框架就不会调用 `ngOnChanges()`。 |
| ngOnInit()              | 在 Angular 第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。 | 在第一轮 `ngOnChanges()` 完成之后调用，只调用**一次**。      |
| ngDoCheck()             | 检测，并在发生 Angular 无法或不愿意自己检测的变化时作出反应。 | 紧跟在每次执行变更检测时的 `ngOnChanges()` 和 首次执行变更检测时的 `ngOnInit()` 后调用。 |
| ngAfterContentInit()    | 当 Angular 把外部内容投影进组件视图或指令所在的视图之后调用。 | 第一次 `ngDoCheck()` 之后调用，只调用一次。                  |
| ngAfterContentChecked() | 每当 Angular 检查完被投影到组件或指令中的内容之后调用        | `ngAfterContentInit()` 和每次 `ngDoCheck()` 之后调用         |
| ngAfterViewInit()       | 当 Angular 初始化完组件视图及其子视图或包含该指令的视图之后调用 | 第一次 `ngAfterContentChecked()` 之后调用，只调用一次。      |
| ngAfterViewChecked()    | 每当 Angular 做完组件视图和子视图或包含该指令的视图的变更检测之后调用。 | `ngAfterViewInit()` 和每次 `ngAfterContentChecked()` 之后调用。 |
| ngOnDestroy()           | 每当 Angular 每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏 | 在 Angular 销毁指令或组件之前立即调用。                      |

## 组件交互

### @Input | 子获取父数据

父组件通过`@Input`给子组件绑定属性设置输入类数据

```ts
// 父组件 HTML
<!-- 使用 子组件的名称标签可渲染其视图 -->
<app-my-user [name]="'tina'"></app-my-user>

// 子组件 js
// 引入 Input 
import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
// 定义name变量可能是父组件的数据
@Input()
name!: string;
ngOnInit() {
    // 获取父组件的数据 tina
	console.log(this.name)
}
```

### @Output | 子触发父事件传值

父组件给子组件传递一个事件，子组件通过`@Output`弹射触发事件

```jsx
<!-- 父组件使用 子组件的名称标签可渲染其视图 -->
<app-my-user (addList)="addListFun($event)"></app-my-user>
<div *ngFor="let color of list let i=index let odd=odd">
  {{odd}} 
  {{i}} 
  {{color}}
</div>
list:string[] = ["1","2","3","4"]
addListFun(strs:string){
  // strs获取到子组件的值 添加list数组
  this.list?.push(strs);
}

<!-- 子组件触发按钮 -->
import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
<button (click)="pushList('aaa')">子组件按钮</button>
// 会触发父组件的addListFun方法并传值
@Output() addList = new EventEmitter()
pushList(v:string){
    this.addList.emit('子组件传递的数据');
}
```

### @ViewChild() | 父获取子数据

通过`ViewChild`获取子组件实例，获取子组件数据

```jsx
<!-- 父组件使用 子组件的名称标签可渲染其视图 给予标记-->
<app-my-user #myChild ></app-my-user>
<button (click)="getView($event)">获取</button>
// 获取子组件的实例
import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
@ViewChild('myChild') child: any;
getView(e:any){
    console.log(this.child)
    // 通过标记调用子组件的方法
    this.child.zizujan();
}

// 子组件的js
zizujan(){
    console.log('子组件的方法')
}
```

# Angular 服务

> Angular中，把从组件内抽离出来的代码叫服务，服务的本质就是函数

```java
官方认为组件不应该直接获取或保存数据， 它们应该聚焦于展示数据，而把数据访问的职责委托给某个服务。
而服务就充当着数据访问，逻辑处理的功能。把组件和服务区分开，以提高模块性和复用性。通过把组件中和视图有关的功能与其他类型的处理分离开，可以让组件类更加精简、高效。
```

## 创建服务

1.使用命令 | ng g s 服务名 | 创建一个服务，通过**@Injectable()**装饰器标识服务。

2.Angular Files 插件创建 

```jsx
// 导入Injectable装饰器
import { Injectable } from '@angular/core';

// 使用Injectable装饰器声明服务
@Injectable({
  // 作用域设定，'root'表示默认注入，注入到AppModule里 | 也可以是 null
  providedIn: 'root'
})
export class MyHomeserviceService {

  constructor() { }

  // 定义一个变量
  fuwu:string = '这是一个服务里的变量';

  // 定义一个方法
  getdata(){
    return '这是一个服务里的方法';
  }

}

```

## 依赖注入

组件中如何使用服务呢，必须将服务依赖注入系统、组件或者模块，才能够使用服务。我们可以用**注册提供商**和**根注入器**实现**。**

该服务本身是 CLI 创建的一个类，并且加上了 `@Injectable()` 装饰器。默认情况下，该装饰器是用 `providedIn` 属性进行配置的，它会为该服务创建一个提供商。

**providedIn**：

   'root' ：注入到AppModule，提供该服务，所有子组件都可以使用（推荐）

   null ： 不设定服务作用域（不推荐）

   组件名：只作用于该组件（懒加载模式）

> app.module.ts 引入注入

```jsx
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// 引入服务
import { MyHomeserviceService } from './my-home/my-homeservice.service';

@NgModule({
  declarations: [		
    AppComponent,
      MyHomeComponent,
      MyLoginComponent,
      MyPipetestPipe,  // 添加管道
      MyUserComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
  ],
  providers: [
    // 添加服务
    MyHomeserviceService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

> 组件引入注入

```jsx
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// 引入服务
import { MyHomeserviceService } from '../my-home/my-homeservice.service';

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css']
})

export class MyHomeComponent implements OnInit {

  // 注入服务
  constructor(private homeService: MyHomeserviceService) { }
  fuwu:string = "";
  fuwuFun(){
    // 服务的对象 其中只需点变量方法即可调用
    console.log(this.homeService);
    // 调用服务里的变量
    this.fuwu = this.homeService.fuwu;
    // 调用服务的方法
    console.log(this.homeService.getdata());
  }

  ngOnInit() {
  }

}
```



# Angular 指令

## 差值表达式

> {{ 变量名 }}

可渲染: |  字符串  |  字符串拼接  |  简单的运算  |  三元表达式  |  

```ts
// my-home.component.ts 定义变量数据
export class MyHomeComponent implements OnInit {
    title:string = ' 字符串数据 ';
    one:number = 1;
    tow:number = 2;
    constructor() { }
    ngOnInit() {
    }
}

// 在 HTML 渲染
<p>差值表达式指令</p>
<p>{{title}}</p>
<p>{{'拼接: ' + title}}</p>
<p>运算: {{one + tow}}</p>
<p>三元表达式: {{true ? one : tow}}</p>

// 结果
差值表达式指令
字符串数据
拼接: 字符串数据
运算: 3
三元表达式: 1
```

## 属性绑定

> [属性名] = "'值'"  |   [属性名] = "变量名"  |  [ngClass]="变量名"

```html
// 定义变量数据
box1:string = 'c1';
box3:string = 'box1 box2 box3';
// 渲染
<!-- 直接给予属性值 -->
<div [class] = "'box'">属性绑定: 赋值</div>
<!-- 赋予变量值 会去js里找值 -->
<div [class] = "box1">属性绑定: 变量</div>
<!-- 值为真:class=box2 反之不是 -->
<div [class.box2] = "true">属性绑定: 判断赋值</div>
<!-- 赋予变量值 可设置多个值 box3:string = 'box1 box2 box3';-->
<div [class] = "box3">属性绑定: 多属性值</div>
<!-- 直接赋值不是变量 为true赋值 反之false不赋值 -->
<div [class] = "{box1:true, box2:true}">属性绑定: 条件属性值</div>
<!-- 数组多个赋值 注意: ''直接赋值 反之box1是变量 -->
<div [class] = "[box1, 'boxstr', 'boxint']">属性绑定: 数组属性</div>
<!-- 与上方功能一致 -->
<div [ngClass]="box1">ngclas 属性绑定</div>
// 结果
<div_ _ngcontent-uji-c17 class="box" >属性绑定:赋值</div>
<div_ _ngcontent-uji-c17 class="c1">属性绑定:变量</div>
<div_ _ngcontent-uji-c17 class="box2" >属性绑定:判断赋值</div>
<div_ ngcontent-uji-c17 class="box1 box2 box3">属性绑定:多属性值</div>
<div_ _ngcontent-uji-c17 class="box1 box2">属性绑定:条件属性值</div>
<div_ ngcontent-uji-c17 class="boxint boxstr c1"> 属性绑定:数组属性</div>
<div_ ngcontent-wjv-c17 ng-reflect-ng-class="c1" class="c1">ngclas属性绑定</div>
```

## 样式绑定

> [ngStyle]="{'color':'red'}"

```html
<p [style.color]="'red'">单一样式绑定</p>
<p [style.width.px]="'600'">单一样式绑定带单位</p>
<p [style]="'color:red;width:900px'">多样式绑定 字符串</p>
<p [style]="{'color':'red','width':'900px'}">多样式绑定 对象</p>
<p [ngStyle]="{'color':'red'}">ngstyle 多样式绑定 对象</p>
<p [style]="{'color': false ? 'red' : 'black'}">ngstyle 三元表达式 样式绑定</p>
```

##   条件判断

***ngIf**   是直接影响元素是否被渲染，而非控制元素的显示和隐藏     

```jsx
export class AppComponent {
    isMax = false;
    isMin = false;
}
// 方式一
<div *ngIf="isMax">Max title</div>
<div *ngIf="isMin">Min title</div>
 
//解析完
<ng-template [ngIf]="isMax">
  <div>Max title</div>
</ng-template>
 
// 方式二
<ng-container *ngIf="isMax; else elseTemplate">
       isMax为true 渲染
</ng-container>
<ng-template #elseTemplate>
    isMax为false 不渲染
</ng-template>
// 方式三
export class AppComponent {
    status = 1;
}
<ul [ngSwitch]="status">
    <li *ngSwitchCase="1">已支付</li>
    <li *ngSwitchCase="2">订单已经确认</li> 
    <li *ngSwitchCase="3">已发货</li>
    <li *ngSwitchDefault>无效</li>
</ul>
```

##     循环语句

> 解析器会把 `let color`、`let i` 和 `let odd` 翻译成命名变量 `color`、`i` 和 `odd`

* 微语法解析器接收of，会将它的首字母大写(Of)，然后加上属性的指令名(ngFor)前缀，它最终生成的名字是 ngFor 的输入属性(colors)

* NgFor  指令在列表上循环，每个循环中都会设置和重置它自己的上下文对象上的属性。
* 这些属性包括 `index` 和 `odd` 以及一个特殊的属性名 `$implicit`(隐式变量)

* Angular 将 let-color 设置为此上下文中 $implicit 属性的值， 它是由 NgFor 用当前迭代中的 colors 初始化的

```ts
export class AppComponent {
      colors:Array<string> = [ 'red', 'blue', 'yellow', 'green' ];
}
// 方式一
<div *ngFor="let color of colors let i=index let odd=odd">
  {{odd}} // 遍历的值
  {{i}} // 下标 0++
  {{color}}
</div>
// 方式二
<ng-template ngFor let-color [ngForOf]= "colors" let-i=" index" let-odd="odd">
	<div>{{odd}} {i}} {{color}}</div>
</ng-template>


//解析完
<ng-template ngFor let-color [ngForOf]="colors" let-i="index" let-odd="odd">
  <div>{{odd}} {{i}} {{color}}</div>
</ng-template>
```

##  事件绑定

> (事件)="方法名称(实参)" |  Angular 的事件绑定语法由等号左侧括号内的目标事件名和右侧引号内的模板语句组成。

事件对象通过`$event`传递

```jsx
export class AppComponent {
    onSave(e: any) {
        console.log('点击了按钮');
        console.log(e);
    }
    inpchange(e: any) {
        // 获取表单的值
        console.log(e.target.value);
    }
}
// 设置按钮的点击事件 | $event:事件对象 | 注意传参 在方法必须设置形参
<input type="text" (input)="inpchange($event)">
<button (click)="onSave($event)">Save</button>

```

##  双向绑定

* 双向绑定是应用中的组件共享数据的一种方式。使用双向绑定绑定来侦听事件并在父组件和子组件之间同步更新值

* ngModel指令**只对表单元素有效**，所以在使用之前需要导入`FormsModule`板块

```ts
import { FormsModule } from '@angular/forms';
 
@NgModule({
  // 申明组件内用到的视图
  declarations: [
    AppComponent,
    HelloComponent,
  ],
  //引入模块需要的类
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  //全局服务
  providers: [],
  //根组件
  bootstrap: [AppComponent]
})
```

```html
export class AppComponent {
  userName='';
}
<div>
    输入: <input [(ngModel)]="userName">
    <h1>你输入了: {{userName}}</h1>
</div>
```

## 表单控件

> 使用表单控件有三个步骤。

1. 在你的应用中注册响应式表单模块。该模块声明了一些你要用在响应式表单中的指令。
2. 生成一个新的 `FormControl` 实例，并把它保存在组件中。
3. 在模板中注册这个 `FormControl`。

**注册响应式表单模块**

要使用响应式表单控件，就要从 `@angular/forms` 包中导入 `ReactiveFormsModule`，并把它添加到你的 NgModule 的 `imports` 数组中。

```js
// app.module.ts 引入表单控件
import { ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  imports: [
    // 注册表单控件
    ReactiveFormsModule
  ],
})
export class AppModule { }
```

**要注册一个表单控件**

就要导入 `FormControl` 类并创建一个 `FormControl` 的新实例，将其保存为类的属性。

```ts
import { Component } from '@angular/core';
// 导入表单控件
import { FormControl } from '@angular/forms';
 
@Component({
  selector: 'app-name-editor',
  templateUrl: './name-editor.component.html',
  styleUrls: ['./name-editor.component.css']
})
export class NameEditorComponent {

// 使用这种模板绑定语法，把该表单控件注册给了模板中名为 name 的输入元素。
// 这样，表单控件和 DOM 元素就可以互相通讯了：视图会反映模型的变化，模型也会反映视图中的变化

  // 创建表单控件变量 biaodan
  biaodan:FormControl = new FormControl('');

  updatebiaodan() {
    // 修改表单控件的值
    this.biaodan.setValue('updatebiaodan');
  }
}
```

```html
<label>
    表单数据 | [formControl]="表单控件的变量":
    <input type="text" [formControl]="biaodan"> 
</label>
<p>
    表单 变量.Value: {{ biaodan.value }}
</p>
<button (click)="updatebiaodan()">修改表单控件的值</button>
```

## 表单控件分组

表单中通常会包含几个相互关联的控件。响应式表单提供了两种把多个相关控件分组到同一个输入表单中的方法

要将表单组添加到此组件中，请执行以下步骤。

1. 创建一个 `FormGroup` 实例。
2. 把这个 `FormGroup` 模型关联到视图。
3. 保存表单数据。

**创建一个 FormGroup 实例**

在组件类中创建一个名叫 `loginForm` 的属性，并设置为 `FormGroup` 的一个新实例。要初始化这个 `FormGroup`，请为构造函数提供一个由控件组成的对象，对象中的每个名字都要和表单控件的名字一一对应

```jsx
import { Component } from '@angular/core';
// 导入表单组
import { FormGroup, FormControl } from '@angular/forms';
 
@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  // 创建表单组
  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  getform() {
    // 获取表单的值
    console.log(this.loginForm.value.userName);
    console.log(this.loginForm.value.password);
  }

}
 
// 模板渲染
<form [formGroup]="loginForm">
  <label>
    账号:
    <input type="text" formControlName="userName">
  </label>
  <label>
    密码:
    <input type="text" formControlName="password">
  </label>
  <button (click)="getform()">获取表单组数据</button>
</form>
```

## 表单验证 

表单元素添加`required`关键字表示必填，通过绑定`ngModel`的引用可以拿到到当前组件的信息，通过引用获取到验证的信息

```html
<form  action="">
    <!-- required:必填项 | #nameInp:获取表单的值来校验 -->
    账号：<input required #nameInp="ngModel" type="text" [(ngModel)]="fromData.name" name="userName">
    <br>
    <!-- 校验通过:true 反之:false | 可以再js调用 -->
    <span>{{nameInp.valid}}</span>
    <hr>
    密码：<input required  #pasInp="ngModel" type="text" [(ngModel)]="fromData.password" name="password">
    <br>
    <span>{{pasInp.valid}}</span>
    <hr>
    <!-- 该参数为表单的对象 里面包含了数据等等信息 -->
    <button (click)="subBtnFUn(nameInp)">提交</button>
</form>
```

```ts
export class AppComponent {
    fromData={
        name:'',
        password:''
    };

    subBtnFUn(obj:any){
        console.log(obj)
    }
}
```

> 定义不同状态下表单的样式

我们还可以通过 **ngModel** 跟踪修改状态与有效性验证，它使用了三个 CSS 类来更新控件，以便反映当前状态。

| 状态             | 为 true 时的类 | 为 false 时的类 |
| :--------------- | :------------- | :-------------- |
| 控件已经被访问过 | `ng-touched`   | `ng-untouched`  |
| 控件值已经变化   | `ng-dirty`     | `ng-pristine`   |
| 控件值是有效的   | `ng-valid`     | `ng-invalid`    |

## 自定义表单验证



## 管道

管道的作用就是传输。不同的管道具有不同的作用。(其实就是处理数据)

> **注意: 字母小写, 去掉pipe进行使用, 还可传入参数**

| 管道      | 功能                                                         |
| --------- | ------------------------------------------------------------ |
| date      | 日期管道，格式化日期                                         |
| json      | 将输入数据对象经过JSON.stringify()方法转换后输出对象的字符串 |
| uppercase | 将文本所有小写字母转换成大写字母                             |
| lowercase | 将文本所有大写字母转换成小写字母                             |
| decimal   | 将数值按照特定的格式显示文本                                 |
| currentcy | 将数值进行货币格式化处理                                     |
| slicePipe | 将数组或者字符串裁剪成新子集                                 |
| percent   | 将数值转百分比格式                                           |

> **pipe 用法**

```ts
- {{ 输入数据 | 管道 : 管道参数}} (其中‘|’是管道操作符)
- 链式管道 {{ 输入数据 | date | uppercase}}
- 管道流通方向自左向右，逐层执行
```

```html
<!-- 根据指定的格式进行时间的格式化 -->
<p>{{time | date:'yyyy-MM-dd HH:mm:ss'}}</p>
<!-- 多组管道 先进行全小写 然后再进行全大写 -->
<p>{{str | lowercase | uppercase}}</p>
```

> **自定义管道**  |  ng g p 管道名称

1.使用脚手架命令 | ng g p mypipetest

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipetest'
})
export class MyPipetestPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // 管道的值
    console.log(value);
    // 管道的参数
    console.log(args);
    return value + ' 你好 ' + args;
  }

}
```

2.添加至 app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { MyLoginComponent } from './my-login/my-login.component';
// 引入管道
import { MyPipetestPipe } from './pipe/my-pipetest.pipe';

@NgModule({
  declarations: [	
    AppComponent,
      MyHomeComponent,
      MyLoginComponent,
      MyPipetestPipe  // 添加管道
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

3.调用即可

```html
<p>{{str | mypipetest:'实参'}}</p>
```

# Angular 路由

> 路由就是连接组件的筋络,它也是树形结构的.有了它,就可以在angular中实现路径的导航模式

## 路由基本使用

> **路由器**是一个调度中心,它是一套规则的列表,能够查询当前URL对应的规则,并呈现出相应的视图.

**路由**是列表里面的一个规则,即路由定义,它有很多功能字段:

- **path**字段,表示该路由中的URL路径部分
- **Component**字段,表示与该路由相关联的组件

每个带路由的Angular应用都有一个路由器服务的单例对象,通过路由定义的列表进行配置后使用。

### app-routing.module.ts

```jsx
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 引入组件
import { MyHomeComponent } from './my-home/my-home.component';

const routes: Routes = [
  // 配置路由
  {
    path: 'home',
    component: MyHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

```

### app.module.ts

```jsx
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 引入路由模块
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { MyLoginComponent } from './my-login/my-login.component';
// 引入管道
import { MyPipetestPipe } from './pipe/my-pipetest.pipe';
import { MyUserComponent } from './my-user/my-user.component';

// 引入服务
import { MyHomeserviceService } from './my-home/my-homeservice.service';

@NgModule({
  declarations: [		
    AppComponent,
      MyHomeComponent,
      MyLoginComponent,
      // 添加管道
      MyPipetestPipe, 
      MyUserComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    // 注入路由模块
    RouterModule
  ],
  providers: [
    // 添加服务
    MyHomeserviceService 
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

```

### app.component.html

```html
//路由导航 
<a [routerLink]="['/home']">home</a>
 
//组件渲染输出
<router-outlet></router-outlet>
```

> 工作流程：

- 当浏览器地址栏的URL变化时，路径部分`/home`满足了列表中path为"**home**"的这个路由定义,激活对应**HomeComponent**的实例,显示它的视图
- 当应用程序请求导航到路径`/hello`时,符合了另外的规则,激活对应视图且展示内容,并将该路径更新到浏览器地址栏和历史

## 路由嵌套

### app-routing.module.ts

```jsx
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyLoginComponent } from './pages/my-login/my-login.component';
import { MyHomeComponent } from './pages/my-home/my-home.component';
import { MySilingsiComponent } from './pages/my-silingsi/my-silingsi.component';

import { MyZujianoneComponent } from './pages/My-zujian/my-zujianone/my-zujianone.component';

// 配置路由前 一定必须先引入组件的html并进行指向
const routes: Routes = [
  // 默认的路由 首页
  { 
    path: '', 
    component: MyLoginComponent 
  },
  // 正常的路由导航
  { 
    path: 'home', 
    component: MyHomeComponent,
    // 子路由
    children: [
      {
        path: 'zujianone',
        component: MyZujianoneComponent
      }
    ]
  },
  // 通配符 不存在的路由 执行跳转页面
  {
    path: '**',
    component: MySilingsiComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

### 父组件 HTML

```html
<!-- 子路由跳转 注意路由的层级嵌套 | 与vue不同 -->
<a [routerLink]="['/home/zujianone']">组件 001</a>
<!-- 子组件进行渲染标签 -->
<router-outlet></router-outlet>
```

## 路由传参

### query: 键值对

> http://localhost:4200/home/zujianone?id=3&name=张三

在a标签上添加一个参数queryParams，并通过`this.routerinfo.snapshot.queryParams`获取参数

```jsx
// 父组件的跳转按钮上 加上queryParams并携带键值对形式的参数 '':字符串 没有'':变量名称
<!-- 子路由跳转 注意路由的层级嵌套 | 与vue不同 -->
<a [routerLink]="['/home/zujianone']" [queryParams]="{id:3, name:name}">组件 001</a>
<!-- 子组件进行渲染标签 -->
<router-outlet></router-outlet>
```

```jsx
// 子组件js获取数据

import { Component, OnInit } from '@angular/core';
// 1.引入 ActivatedRoute
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-my-zujianone',
  templateUrl: './my-zujianone.component.html',
  styleUrls: ['./my-zujianone.component.css']
})
export class MyZujianoneComponent implements OnInit {
  // 2.注册 ActivatedRoute
  constructor(private routerinfo:ActivatedRoute) { }

  ngOnInit() {
    // 3.通过键的名称获取数据
    this.id = this.routerinfo.snapshot.queryParams["id"];
    this.name = this.routerinfo.snapshot.queryParams["name"];
  }

  id: number = 0;
  name: string = "";
}
```

### params: /风格

> http://localhost:4200/home/zujianone/aa值/张三/张三cczhi

修改路由配置文件`path`,路由导航`a`标签`routerLink`后面数组的第二个参数为传递的值

并且通过`subscribe`请阅的方式获取`name`参数

```jsx
// 正常的路由导航
{ 
 path: 'home', 
   component: MyHomeComponent,
     // 子路由
     children: [
         {
             // 指定后续参数的键
             path: 'zujianone/:aa/:bb/:cc',
             component: MyZujianoneComponent
         }
     ]
},
```

```jsx
// 在按钮上 路径后即可传值 '':字符串 没有'':变量名称
<!-- 子路由跳转 注意路由的层级嵌套 | 与vue不同 -->
<a [routerLink]="['/home/zujianone', 'aa值', name, name + 'cczhi']">组件 001</a>
<!-- 子组件进行渲染标签 -->
<router-outlet></router-outlet>
```

```jsx
import { Component, OnInit } from '@angular/core';
// 1.引入 Params
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-my-zujianone',
  templateUrl: './my-zujianone.component.html',
  styleUrls: ['./my-zujianone.component.css']
})
export class MyZujianoneComponent implements OnInit {

  constructor(private routerinfo:ActivatedRoute) { }

  ngOnInit() {
    this.id = this.routerinfo.snapshot.queryParams["id"];
    this.name = this.routerinfo.snapshot.queryParams["name"];
	// 3.根据路由指定的键获取跳转按钮的数据
    this.routerinfo.params.subscribe((params:Params)=>{
      this.aa = params['aa']
      this.bb = params['bb']
      this.cc = params['cc']
    })
  }

  id: number = 0;
  name: string = "";
  aa: string = "";
  bb: string = "";
  cc: string = "";
}
```



# Angular 功能

## 表单数据获取

### $event : 事件对象获取

```ts
<input type="text" (input)="inpchange($event)">
    inpchange(e: any) {
    // 获取表单的值
    console.log(e.target.value);
}
```

### 模板引用变量

模板变量可以帮助你在模板的另一部分使用这个部分的数据。使用模板变量，你可以执行某些任务，比如响应用户输入或微调应用的表单

在模板中，要使用井号 `#` 来声明一个模板变量。下列模板变量 `#userName` 语法在 `<input>` 元素上声明了一个名为 `userName` 的变量

```ts
<input #userName placeholder="请输入用户名" />
<button (click)="callUserName(userName.value)">Call</button>

export class AppComponent {
   callUserName(v:string){
       console.log(v)
   }
}
```

Angular 根据你所声明的变量的位置给模板变量赋值：

- 如果在组件上声明变量，该变量就会引用该组件实例。
- 如果在标准的 HTML 标记上声明变量，该变量就会引用该元素。
- 如果你在 `<ng-template>` 元素上声明变量，该变量就会引用一个 `TemplateRef` 实例来代表此模板。



# Angular 码云

## 创建组件复制

### 创建组件命令

```jsx
// 路径是以app开始创建
ng g c 路径 --module=routes/admin --inline-style=true --skip-tests=true
ng g c /pages/plastic/deburring/deburring --module=routes/admin --inline-style=true --skip-tests=true

ng g c /pages/system/dim/dim-series/dim-series --inline-style=true --skip-tests=true
// 进入目录下创建
PS C:\Users\码云\Documents\Mayun\sanitary-web\src\pages\system\dim> ng g c dim-brand/dim-brand

// 创建服务
ng g s /api/base/woodWorking/woodWorking
// 进入目录下创建
PS C:\Users\码云\Documents\Mayun\sanitary-web\src\api\system> ng g s /dim/dimSeries/dimSeries  

// 提交本地命令 --> 还需提交到云端
git commit --no-verify -m '提交备注信息'
```

### 组件的引入和注册

> **furniture.module.ts**

路径: src/app/routes/admin/furniture.module.ts

> **furniture-routing.module.ts**  |  配置路由

路径: src/app/routes/admin/furniture-routing.module.ts

### 组件的模块_页面

#### HTML

> unit-supplier-aging.component.html  |  页面模板

```html
<!--顶部搜索栏-->
<div class="mat-elevation-z6">
  <!--顶部搜索框表单 | (ngSubmit)="onSubmit()" 提交的方法-->
  <form class="flex-center" (ngSubmit)="onSubmit()" [formGroup]="form">
    <!--顶部搜索框数据遍历 | formBases:对应js的指定数据-->
    <div class="no-padding" *ngFor="let item of formBases">
      <app-dynamic-form [formBase]="item" [form]="form"></app-dynamic-form>
    </div>
    <div class="operate">
      <button color="primary" mat-raised-button [disabled]="!form.valid" (click)="changePage()">
        <mat-icon>search</mat-icon>查询
      </button>
      <button mat-raised-button (click)="onReset()">
        <mat-icon>restart_alt</mat-icon>重置
      </button>
    </div>
  </form>
</div>

<!--数据渲染部分-->
<div class="container-table mat-elevation-z6">
  <!--数据操作按钮栏-->
  <div class="space-between">
    <div class="operate">
      <button mat-raised-button color="primary" (click)="add()">
        <mat-icon>add</mat-icon>
        添加
      </button>
      <button mat-raised-button color="accent" (click)="openChooseWindow()">
        <mat-icon><span class="material-icons"> get_app </span></mat-icon>导入表格
      </button> -->
      <button mat-raised-button color="accent" (click)="exportExcel()">
        <mat-icon><span class="material-icons">
            <span class="material-icons"> file_upload </span>
          </span></mat-icon>导出表格
      </button>
      <button mat-raised-button color="accent" (click)="downloadExportExcel()">
        <mat-icon><span class="material-icons">
            <span class="material-icons"> get_app </span>
          </span></mat-icon>下载模板
      </button>
    </div>
    <app-column-adjust [localStorageName]="localStorageName" [fixedColumns]="fixedColumns"
      [displayedColumns]="displayedColumns" [showCol]="showCol" (emitFixed)="changeFixed($event)"
      (emitSelectAndDrop)="selectAndDrop()"></app-column-adjust>
  </div>
  <div class="example-loading-shade" *ngIf="isLoadingResults">
    <mat-spinner *ngIf="isLoadingResults"></mat-spinner>
  </div>
    
  <!--数据列表-->
  <div class="example-table-container" id="tableContainer">
    <!--数据列表遍历渲染 | 需要将查询的集合数据赋值给变量dataSource -->
    <table [dataSource]="dataSource" matSortActive="created" mat-table matSort>
      <!--列表数据行 | matColumnDef="字段名" matSort [sticky]="isSticky['字段名']"-->
      <ng-container matColumnDef="number" matSort [sticky]="isSticky['number']">
        <th mat-header-cell *matHeaderCellDef appDynamicColumnWidth>序号</th>
        <td mat-cell *matCellDef="let row; let i = index">
          {{ i + 1 }}
        </td>
        <td mat-footer-cell *matFooterCellDef>合计</td>
      </ng-container>
        
      <!--列表数据行 | matColumnDef="字段名" matSort [sticky]="isSticky['字段名']"-->
      <ng-container matColumnDef="beginAmount" [sticky]="isSticky['beginAmount']">
        <th mat-header-cell *matHeaderCellDef appDynamicColumnWidth>
          <!--列表该列的列名-->  
          <div class="mat-sort-th">
            <span mat-sort-header>期初余额</span>
          </div>
        </th>
        <!--列表该列的数据 | row表示本行.字段即可-->
        <td mat-cell *matCellDef="let row">
          {{ row.beginAmount }}
        </td>
        <!--列表该列的数据的合计 | 需在js数据内指定变量sum对象-->
        <td mat-footer-cell *matFooterCellDef>{{ sum.beginAmount }}</td>
      </ng-container>
        
	  <!--每栏的操作组-->
      <ng-container matColumnDef="unitId" [stickyEnd]="isSticky['unitId']">
        <th mat-header-cell *matHeaderCellDef appDynamicColumnWidth>操作</th>
        <td mat-cell *matCellDef="let row">
          <div class="table-btn-grid">
            <button mat-icon-button (click)="detail(row)" matTooltip="详情">
              <mat-icon>details</mat-icon>
            </button>
            <button mat-icon-button (click)="toExamine(row)" color="primary" matTooltip="审核">
              <mat-icon>settings</mat-icon>
            </button>
            <button mat-icon-button (click)="abandon(row)" color="primary" matTooltip="弃审">
              <mat-icon>compare_arrows</mat-icon>
            </button>
            <button mat-icon-button (click)="uploadSpuTraitImg(row)" color="primary" matTooltip="上传凭证">
              <mat-icon>cloud_upload</mat-icon>
            </button>
            <button mat-icon-button (click)="edit(row)" color="accent" matTooltip="修改">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="del(row)" color="warn" matTooltip="删除">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container> 
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" [colSpan]="displayedColumns.length + 1">没有数据</td>
      </tr>
      <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      <tr mat-footer-row *matFooterRowDef="displayedColumns; sticky: true"></tr>
    </table>
  </div>
    
  <!--底部的翻页按钮栏-->
  <div class="paginator">
    <mat-form-field appearance="outline">
      <mat-label>跳转到</mat-label>
      <input matInput [(ngModel)]="page" (blur)="changePage()" min="1" type="number" />
    </mat-form-field>
    <mat-paginator [length]="resultsLength" showFirstLastButtons></mat-paginator>
  </div>
</div>

<input type="file" id="fileInput" class="hide" (change)="uploadFile($event)" value="" accept="image/*" />
<input type="file" id="chooseExcel" class="hide" (change)="importExcel($event)" value="" accept="/*" />

```

#### component.ts

> sale-reserve-order.component.ts  |  页面 JS 逻辑

```jsx
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { nanoid } from 'nanoid';
import { Authority } from 'src/app/api/authority';
import { UnitInfoService } from 'src/app/api/base/unit-info/unit-info.service';
import { UnitMeetService } from 'src/app/api/base/unitMeet/unit-meet.service';
import { sortOption, ColSelectedService } from 'src/app/api/dim/col-selected.service';
import { PaymentMethodService } from 'src/app/api/dim/paymentMethod/payment-method.service';
import { FileUploadService } from 'src/app/api/system/file-upload/file-upload.service';
import { UserInfoService } from 'src/app/api/system/user-info/user-info.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ImageDialogComponent } from 'src/app/components/image-dialog/image-dialog.component';
import { FormBase } from 'src/app/lib/class/form-base/form-base';
import { autocompleteFilter } from 'src/app/lib/function/autocomplete';
import { dateString } from 'src/app/lib/function/dateFormat';
import { downloadFile } from 'src/app/lib/function/download';
import { isImage } from 'src/app/lib/function/isImage';
import { isZero } from 'src/app/lib/method/isNum';
import { FormBaseService } from 'src/app/lib/service/form-base/form-base.service';
import { SnackBarService } from 'src/app/lib/service/snack-bar/snack-bar.service';
import { PermissionsService } from 'src/app/swagger/permissions/permissions.service';
import { environment } from 'src/environments/environment';
import { UnitMeetOperateComponent } from '../../unitMeet/unit-meet-operate/unit-meet-operate.component';
import { UnitMeetToExamineComponent } from '../../unitMeet/unit-meet-to-examine/unit-meet-to-examine.component';
import { unitMeetSearch, unitMeetSum } from './unit-supplier-aging';

import { merge, debounceTime, startWith, of as observableOf, switchMap, map, catchError } from 'rxjs';
import { paginatorSetup, Response } from '../../../../api/data';
// 引入Service请求路径文件
import { UnitSupplierAgingService } from 'src/app/api/base/unitSupplierAging/unit-supplier-aging.service';
// 需引入定义变量的文件 Service
import {
  // 储存渲染列表的变量对象
  displayedUnitSupplierAgingColumns,
  // 储存显示表格列的数据的变量对象
  disColSelect,
} from 'src/app/api/base/unitSupplierAging/unit-supplier-aging';


@Component({
  selector: 'app-unit-supplier-aging',
  templateUrl: './unit-supplier-aging.component.html',
  // 指定项目的样式文件
  styleUrls: ['../../../../css/table.scss', '../../../../css/layout.scss', '../../../../css/table-for-gj.scss'],
  styles: [],
})
export class UnitSupplierAgingComponent implements OnInit {
  // 定义组件的名称
  localStorageName: string = 'unitSupplierAging';
  // 指定html里的数据渲染的列表的字段 | 需引入定义变量的文件 | 需修改
  displayedColumns = this.colSelectedService.getDateSort(this.localStorageName)[1] || [...displayedUnitSupplierAgingColumns];
  // 指定页面表格右上角显示表格列的数据的变量对象 | 需引入定义变量的文件 | 需修改
  showCol: sortOption[] = this.colSelectedService.getDateSort(this.localStorageName)[0] || [...disColSelect];
  fixedColumns = this.colSelectedService.getDate()[this.localStorageName] || [...this.colSelectedService.fixedCol];
  isSticky: { [key: string]: boolean } = {};

  @Input() formBases: FormBase<string>[] = unitMeetSearch;
  @ViewChild(MatDateRangePicker) campaignTwoPicker!: MatDateRangePicker<any>;
  @ViewChild(MatSort) sort!: MatSort;
  form!: FormGroup;
  row: any;
  dataSource = new MatTableDataSource<unitMeetSum>([]);
  url = environment.url;
  // 详细权限
  // authority: Authority = this.permissionsService.getAuthority().authority;
  // 当前页数
  page = 0;
  // 总数
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // 定义储存每列合计 的变量对象
  sum = {
    beginAmount: 0,
    endAmount: 0,
    thirtyDaysAmount: 0,
    thirtyToSixtyDaysAmount: 0,
    sixtyToHundredTwentyDaysAmount: 0,
    hundredTwentyDaysAmount: 0,
  };
  minId = nanoid();
  minId2 = nanoid();
  minId3 = nanoid();
  remark = '备注';

  constructor(
    private fbs: FormBaseService,
    private unitMeetService: UnitMeetService,
    private permissionsService: PermissionsService,
    private unitInfoService: UnitInfoService,
    private paymentMethodService: PaymentMethodService,
    private changeDetectorRef: ChangeDetectorRef,
    private userInfoService: UserInfoService,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService,
    private matDialog: MatDialog,
    private colSelectedService: ColSelectedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    // 注入Service文件
    private unitSupplierAgingService: UnitSupplierAgingService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fbs.toFormGroup(this.formBases);
    // this.form.controls['start'].valueChanges.subscribe((start) => {
    //   if (this.form.value.end !== '') {
    //     var startValue = new Date(dateString(start));
    //     var endValue = new Date(dateString(this.form.value.end));
    //     if (startValue > endValue) {
    //       this.snackBarService.open('开始日期比结束日期晚，请重新选择');
    //     }
    //   }
    // });
    // this.form.controls['end'].valueChanges.subscribe((end) => {
    //   if (this.form.value.start !== '') {
    //     var startValue = new Date(dateString(this.form.value.start));
    //     var endValue = new Date(dateString(end));
    //     if (startValue > endValue) {
    //       this.snackBarService.open('开始日期比结束日期晚，请重新选择');
    //     }
    //   }
    // });
    this.changeFixed(this.fixedColumns);
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = paginatorSetup.pageSize;
    this.paginator.pageSizeOptions = paginatorSetup.pageSizeOptions;
    this.changeDetectorRef.detectChanges();
    // this.init();
    // 侦听实现点击tab刷新页面
    this.activatedRoute.url.subscribe((res) => {
      this.router.url === `/admin/${res[0].path}` && this.init();
    });
    this.dataSource.sort = this.sort;
  }

  changeFixed(fixedColumns: string[]) {
    this.isSticky = {};
    for (const iterator of fixedColumns) {
      this.isSticky[iterator] = true;
    }
  }

  selectAndDrop() {
    this.displayedColumns = this.colSelectedService.getDateSort(this.localStorageName)[1] || [...displayedUnitSupplierAgingColumns];
  }

  init() {
    merge(this.paginator.page)
      .pipe(
        debounceTime(200),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let unitName = '';
          if (typeof this.form.value.unitId === 'string') {
            unitName = this.form.value.unitId;
          }
          let paymentMethodName = '';
          if (typeof this.form.value.paymentMethod === 'string') {
            paymentMethodName = this.form.value.paymentMethod;
          }
          let userName = '';
          if (typeof this.form.value.createUser === 'string') {
            userName = this.form.value.createUser;
          }
          let auditName = '';
          if (typeof this.form.value.auditUser === 'string') {
            auditName = this.form.value.auditUser;
          }
          // 发送请求 获取列表的数据
          return this.unitSupplierAgingService.list({
            page: this.paginator.pageIndex + 1,
            limit: this.paginator.pageSize,
            // createUser: this.form.value.createUser.value !== undefined ? this.form.value.createUser.value : '',
            // userName: userName,
            // auditUser: this.form.value.auditUser.value !== undefined ? this.form.value.auditUser.value : '',
            // auditName: auditName,
            unitId: this.form.value.unitId.value !== undefined ? this.form.value.unitId.value : '',
            unitName: unitName,
            paymentMethod: 0,
            createUser: 0,
            auditUser: 0,
          });
        }),
        map((res) => {
          console.log(res);
          this.isLoadingResults = false;
          this.resultsLength = res.count;
          this.page = this.paginator.pageIndex + 1;
          if (res.summary == null) {
            this.sum.beginAmount = 0;
          } else {
            // 获取到列表每列的合计 赋值给sum变量的对象
            this.sum = res.summary;
          }
          return res.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        }),
      )
      .subscribe((data) => {
        // 将获取的列表数据赋值给 列表的变量对象 在数据文件里
        this.dataSource.data = data;
      });

    let option = [{ label: '请选择', value: '' }];
    // 获取供应商下拉框
    this.unitInfoService.listUnitInfoChoice().subscribe((res: Response) => {
      let returnOption = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      let arr = [...option, ...returnOption];
      // 搜索框的点击事件 会进行对应的搜索项推荐
      this.formBases[0].optionsOb = this.form.controls['unitId'].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? autocompleteFilter(name, arr) : arr.slice()))
      );
    });

    // 获取结款方式下拉框
    // this.paymentMethodService.getChoice().subscribe((res: Response) => {
    //   let returnOption = res.data.map((item: any) => {
    //     return {
    //       label: item.name,
    //       value: item.code,
    //     };
    //   });
    //   let arr = [...option, ...returnOption];
    //   this.formBases[1].optionsOb = this.form.controls['paymentMethod'].valueChanges.pipe(
    //     startWith(''),
    //     map((value) => (typeof value === 'string' ? value : value.name)),
    //     map((name) => (name ? autocompleteFilter(name, arr) : arr.slice()))
    //   );
    // });

    //获取用户
    this.userInfoService.listUserInfoChoice().subscribe((res: Response) => {
      let returnOption = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      // let arr = [...option, ...returnOption];
      // this.formBases[2].optionsOb = this.form.controls['createUser'].valueChanges.pipe(
      //   startWith(''),
      //   map((value) => (typeof value === 'string' ? value : value.name)),
      //   map((name) => (name ? autocompleteFilter(name, arr) : arr.slice()))
      // );
      // this.formBases[3].optionsOb = this.form.controls['auditUser'].valueChanges.pipe(
      //   startWith(''),
      //   map((value) => (typeof value === 'string' ? value : value.name)),
      //   map((name) => (name ? autocompleteFilter(name, arr) : arr.slice()))
      // );
    });
  }

  add() {
    const dialogRef = this.matDialog.open(UnitMeetOperateComponent, {
      // width: '1800px',
      maxHeight: '90vh',
      disableClose: true,
      hasBackdrop: false,
      id: this.minId,
      data: {
        operate: 'add',
        minId: this.minId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changePage();
      }
    });
  }

  edit(row: any) {
    const dialogRef = this.matDialog.open(UnitMeetOperateComponent, {
      // width: '1800px',
      maxHeight: '90vh',
      disableClose: true,
      hasBackdrop: false,
      id: this.minId2,
      data: {
        id: row.id,
        saleOrderNumber: row.saleOrderNumber,
        companyId: row.companyId,
        operate: 'edit',
        minId: this.minId2,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changePage();
      }
    });
  }

  detail(row: any) {
    this.matDialog.open(UnitMeetOperateComponent, {
      // width: '1800px',
      maxHeight: '90vh',
      disableClose: true,
      hasBackdrop: false,
      id: this.minId3,
      data: {
        id: row.id,
        saleOrderNumber: row.saleOrderNumber,
        operate: 'detail',
        minId: this.minId3,
      },
    });
  }

  del(row: any) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        isTure: false,
        content: `确定删除${row.unitName}`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitSupplierAgingService.delete(row.id).subscribe((res: Response) => {
          if (res.code === 200) {
            this.changePage();
            this.snackBarService.openSuccess('删除成功');
          }
        });
      }
    });
  }

  toExamine(row: any) {
    const dialogRef = this.matDialog.open(UnitMeetToExamineComponent, {
      width: '400px',
      maxHeight: '100vh',
      disableClose: true,
      data: {
        id: row.id,
        operate: 'toExamine',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changePage();
      }
    });
  }

  abandon(row: any) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        isTure: false,
        content: `请确认是否弃审？`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitSupplierAgingService.unitMeetAbandon(row).subscribe((res: any) => {
          if (res.code === 200) {
            this.changePage();
          }
        });
      }
    });
  }

  exportExcel() {
    let unitName = '';
    if (typeof this.form.value.unitId === 'string') {
      unitName = this.form.value.unitId;
    }
    this.unitSupplierAgingService
      .exportExcel({
        page: this.paginator.pageIndex + 1,
        limit: this.paginator.pageSize,
        unitId: this.form.value.unitId.value !== undefined ? this.form.value.unitId.value : '',
        unitName: unitName,
      })
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        downloadFile('供应商账龄' + new Date().getTime() + '.xls', url);
      });
  }

  downloadExportExcel() {
    window.location.href = 'http://120.26.251.116/static/excel/furniture/供应商付款导入模板.xlsx';
  }

  openChooseWindow() {
    (document.getElementById('chooseExcel') as HTMLElement).click();
  }

  importExcel(event: any) {
    let file = event.target.files[0];
    this.unitSupplierAgingService.importExcel(file).subscribe((res: any) => {
      if (res.code === 200) {
        this.snackBarService.openSuccess('导入成功');
        this.onSubmit();
      }
    });
  }

  changePage() {
    this.paginator.pageIndex = this.page - 1;
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /**
   * 提交查询
   */
  onSubmit() {
    isZero(this.paginator.pageIndex) ? this.paginator._changePageSize(this.paginator.pageSize) : this.paginator.firstPage();
  }

  onReset() {
    this.form.reset({
      createUser: { label: '', value: '' },
      auditUser: { label: '', value: '' },
      paymentMethod: { label: '', value: '' },
      unitId: { label: '', value: '' },
      start: '',
      end: '',
      auditStart: '',
      auditEnd: '',
    });
    this.onSubmit();
  }

  openImage(src: string) {
    this.matDialog.open(ImageDialogComponent, {
      width: '400px',
      height: '400px',
      disableClose: false,
      data: {
        image: src,
      },
    });
  }

  uploadSpuTraitImg(row: any) {
    this.row = row;
    (document.getElementById('fileInput') as HTMLElement).click();
  }

  uploadFile(event: any) {
    let file = event.target.files[0];
    if (!isImage(file.type)) {
      this.snackBarService.open('上传图片格式不对');
    }
    if (file.size > 50 * 1024 * 1024) {
      this.snackBarService.open('上传图片太大，请重新上传');
      return;
    }
    this.fileUploadService.upload(file, 10).subscribe((res: any) => {
      if (res.code === 200) {
        this.row.picture = res.data;
        this.unitSupplierAgingService.updateUnitMeet(this.row).subscribe((item: any) => {
          if (item.code === 200) {
            this.row.picture = res.data;
            this.snackBarService.openSuccess('上传凭证成功');
          }
        });
      }
    });
  }
}

```

#### 组件名称.ts

> unit-supplier-aging.ts   |  数据文件一 |  跟Service的数据文件差不多

```jsx
import { Autocomplete, InputField, OneDateField, SelectField } from 'src/app/lib/class/form-base/form-base';
import { dateString } from '../../../../lib/function/dateFormat';
import * as moment from 'moment';

// 搜索框的变量对象 | 只需在此修改可同步到html页面里
export const unitMeetSearch = [
  new Autocomplete({
    name: 'unitId',
    label: '供应商',
    optionsOb: undefined,
    value: 0,
  }),
  // new Autocomplete({
  //   name: 'paymentMethod',
  //   label: '付款方式',
  //   optionsOb: undefined,
  //   value: 0,
  // }),
  // new Autocomplete({
  //   name: 'createUser',
  //   label: '创建人',
  //   optionsOb: undefined,
  //   value: 0,
  // }),
  // new Autocomplete({
  //   name: 'auditUser',
  //   label: '审核人',
  //   optionsOb: undefined,
  //   value: 0,
  // }),
  // new OneDateField({
  //   name: 'start',
  //   label: '付款开始日期',
  //   readonly: true,
  // }),
  // new OneDateField({
  //   name: 'end',
  //   label: '付款结束日期',
  //   readonly: true,
  // }),
  // new OneDateField({
  //   name: 'auditStart',
  //   label: '审核开始日期',
  //   readonly: true,
  // }),
  // new OneDateField({
  //   name: 'auditEnd',
  //   label: '审核结束日期',
  //   readonly: true,
  // }),
];

export interface unitMeetSum {
  amount: 0;
}

```

### 组件的模块_Service

#### service.ts

> unit-supplier-aging.service.ts  |  储存请求路径 后续直接调用

```jsx
import { Injectable } from '@angular/core';
import {HttpService} from "../../../lib/service/http/http.service";
import { unitMeetRequestList } from '../unitMeet/unit-meet';

@Injectable({
  providedIn: 'root'
})
export class UnitSupplierAgingService {

  constructor(private http: HttpService) {}
  // table数据
  list(data: unitMeetRequestList) {
    return this.http.post('/admin/gateWay/stockInOrder/listStockInOrderForm', data);
  }
  // 添加方法
  saveUnitMeet(data: any) {
    return this.http.post('/admin/gateWay/unitMeet/saveUnitMeet', data);
  }
  // 修改方法
  updateUnitMeet(data: any) {
    return this.http.post('/admin/gateWay/unitMeet/updateUnitMeet', data);
  }
  // 根据id 获取company数据回显
  getByIdUnitMeet(id: number) {
    return this.http.get(`/admin/gateWay/unitMeet/getByIdUnitMeet/${id}`);
  }
  // 根据id 删除
  delete(id: number) {
    return this.http.get(`/admin/gateWay/unitMeet/delete/${id}`);
  }

  // 导出Excel
  exportExcel(data: any) {
    return this.http.downloadPost(
      '/admin/gateWay/stockInOrder/exportExcelForm',
      data
    );
  }

  // 导入Excel
  importExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.uploadPost(
      '/admin/gateWay/unitMeet/importExcel',
      formData
    );
  }

  unitMeetAudit(data: any) {
    return this.http.post('/admin/gateWay/unitMeet/unitMeetAudit', data);
  }

  unitMeetAbandon(data: any) {
    return this.http.post('/admin/gateWay/unitMeet/unitMeetAbandon', data);
  }
}

```

组件名称.ts

> unit-supplier-aging.ts   |  数据文件二 |  跟组件页面的数据文件差不多

```jsx
import { Dialog, List } from '../../data';

// 发送请求时的参数对象变量
export interface unitSupplierAgingRequestList extends List {
  unitId: number;
  unitName?: string;
}
// 列表渲染时的数据对象变量 | 注意定义的字段必须在html创建列 | 表格的顺序跟html标签无关 跟变量内部字段有关
export const displayedUnitSupplierAgingColumns = [
  'number',
  'unitName',
  'beginAmount',
  'endAmount',
  'thirtyDaysAmount',
  'thirtyToSixtyDaysAmount',
  'sixtyToHundredTwentyDaysAmount',
  'hundredTwentyDaysAmount',
  // 操作列需要 ID 进行对应的增删改
  // 'unitId',
];
// 列表右上角的 列的固定和显示
export const disColSelect = [
  {
    label: '序号',
    value: 'number',
  },
  {
    label: '供应商',
    value: 'unitName',
  },
  {
    label: '期初余额',
    value: 'beginAmount',
  },
  {
    label: '期末余额',
    value: 'endAmount',
  },
  {
    label: '30天内余额',
    value: 'thirtyDaysAmount',
  },
  {
    label: '30-60天内余额',
    value: 'thirtyToSixtyDaysAmount',
  },
  {
    label: '60-120天内余额',
    value: 'sixtyToHundredTwentyDaysAmount',
  },
  {
    label: '120天以上余额',
    value: 'hundredTwentyDaysAmount',
  },
];
export interface unitMeetDialog extends Dialog {
  id: number;
  orderNumber: number;
}

```



# 前端组件

## 判断value类型

```ts
let paymentMethodName = '';
if (typeof this.form.value.paymentMethod === 'string') {
    paymentMethodName = this.form.value.paymentMethod;
}
```

## 时间格式化

```jsx
dateString(unitBillingVo.busiDate);

this.busiDate.value.format("YYYY-MM");
```

## 赋值和取值

```jsx
// 获取表单对象
this.form.value;
// 获取表单对象指定字段
this.form.value.字段名称.value;
// 获取列表集合
this.dataTable.data;

// 调取页面自选单号赋值 
// 定义变量
formOther: FormGroup = this.formBuilder.group({
    dayOrderNumber: [''],
});
// 赋值
this.formOther.patchValue({
    dayOrderNumber: res.data.monthOrderNumber,
});
// 给对象赋值
this.form.patchValue({
    dimCloth: { label: res.data.dimClothName, value: res.data.dimCloth },
    dimCloth2: { label: res.data.dimClothName2, value: res.data.dimCloth2 },
    workshopId: { label: res.data.workshopName, value: res.data.workshopId },
});
```



## 父传子值

```jsx
// 父组件 点击修改触发调用子组件 并传值 data
edit(row: any) {
    const dialogRef = this.matDialog.open(UnitBillingEditComponent, {
        // width: '1800px',
        maxHeight: '90vh',
        disableClose: true,
        hasBackdrop: false,
        id: this.minId4,
        data: {
            id: row.id,
            orderNumber: row.orderNumber,
            operate: 'edit',
            minId: this.minId4,
        },
    });
    // 调用完成刷新页面
    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.changePage();
        }
    });
}

// 子组件调用获取值
onSubmitClick() {
    let unitBillingVo = this.form.value;
    // 子组件获取父组件传递的值 ID
    unitBillingVo.id = this.dataDialog.id;
    unitBillingVo.busiUser = this.form.value.busiUser.value;
    unitBillingVo.amount = this.sum.totalAmount;
    unitBillingVo.busiDate = dateString(unitBillingVo.busiDate);
    unitBillingVo.unitBillingDetailVoList = this.dataTable.data;
    // console.log(unitBillingVo);
    this.unitBillingService.updateUnitBilling(unitBillingVo)
        .subscribe((res: Response) => {
        if (res.code === 200) {
            this.snackBarService.openSuccess('修改成功');
            this.dialogRef.close(true);
        } else {
            this.ischeck = false;
        }
        error: () => {
            this.ischeck = false;
        }
    });
}
```

## 表单的样式及属性

> 样式

```jsx
// 文本框
new InputField({
    name: 'orderNumber',
    label: '单号',
    readonly: false,
}),

// 日期框 年月日 | 格式化: dateString(unitBillingVo.busiDate);
new OneDateField({
    name: 'busiDate',
    label: '入库日期',
    readonly: false,
    required: true,
    value: dateString(moment()),
}),
```

> 属性

```jsx
options: {
    startView?: 'month' | 'year' | 'multi-year';
    oneDateType?: string;
    multiple?: boolean;
    // 表单的提升信息
    label?: string;
    value?: T | Moment | number;
    // 表单的字段名称 | 必填 可根据字段获取其值
    name?: string;
    required?: boolean;
    order?: number;
    controlType?: string;
    placeholder?: string;
    type?: string;
    // true:置灰
    disabled?: boolean;
    // true:只读
    readonly?: boolean;
    updateOn?: 'blur' | 'change' | 'submit' | undefined; // valueChanges blus失去焦距
    options?: { label: string; value: string | number }[];
	optionsOb?: Observable<{ label: string; value: string | number }[]>;
	optionsObLabel?: Observable<string[]>;
}

// 第一个表单 置灰
this.formBases[0].disabled = true;
// 第一个表单 只读
this.formBases[0].readonly = true;
```

### 输入联想可选择框

```jsx
// 下拉选择框
new Autocomplete({
    name: 'busiUser',
    label: '经手人',
    optionsOb: undefined,
    value: 0,
    required: true,
}),
```

```jsx
// 初始数据
let option = [{ label: '请选择', value: 0 }];
// 调用接口获取数据
this.userInfoService.listUserInfoChoice().subscribe((res: Response) => {
    let returnOption = res.data.map((item: any) => {
        return {
            label: item.name,
            value: item.id,
        };
    });
    let arr = [...option, ...returnOption];
    this.formBases[2].optionsOb = this.form.controls['busiUser'].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? autocompleteFilter(name, arr) : arr.slice()))
    );
});

// 回显数据 将从后端获取的数据对于赋值 进行初始化回显
this.form.patchValue({
    busiUser:{
        value:res.data.busiUser,
        label:res.data.busiName,
    }
});
```

### 下拉多选框

```jsx
// 下拉多选框 无法用户直接输入 所以传递到后台的ID字符串 如: 1,2,3
new SelectField({
    name: 'dimSeries',
    label: '系列',
    options: [],
    value: '',
    multiple: true,
}),
```

```jsx
// 初始化数据
this.dimSeriesService.getChoice().subscribe((res: Response) => {
    // @ts-ignore
    this.formBases[5].options[0] = { value: 0, label: '全选' };
    let dimSeriesArr: number[] = [0];
    for (let i = 0; i < res.data.length; i++) {
        // @ts-ignore
        this.formBases[5].options[i + 1] = {};
        // @ts-ignore
        this.formBases[5].options[i + 1].value = res.data[i].code;
        // @ts-ignore
        this.formBases[5].options[i + 1].label = res.data[i].name;
        dimSeriesArr.push(res.data[i].code);
    }
    checkAll('dimSeries', dimSeriesArr, this.form);
});

// 查询判断 导出表格
if (this.form.value.dimSeries instanceof Array) {
    this.form.value.dimSeries = this.form.value.dimSeries.join(',');
}
// 获取数值
dimSeriesStr: this.form.value.dimSeries,
    
// 重置按钮
onReset() {
    this.form.reset({
      spuClass: { label: '', value: '' },
      dimModel: { label: '', value: '' },
      // 重置下拉多选框
      dimSeries: '',
    });
    this.onSubmit();
}
```

```java
// 字段
@ApiModelProperty(value = "系列查询字段")
private String dimSeriesStr;
// in 多数据条件
<if test="entity.dimSeriesStr != null and entity.dimSeriesStr != ''">
    and a.dim_series in (${entity.dimSeriesStr})
</if>
```

### 下拉单选框

```jsx
new SelectField({
    name: 'workshopId',
    label: '生产车间',
    options: [],
}),
```

```jsx
let option = [{ label: '请选择', value: '' }];
//获取生产车间
this.workshopService.listWorkshopChoice().subscribe((res: Response) => {
    // this.formBases[2].options = res.data.map((item: any) => {
    this.formBases[2].optionsOb = res.data.map((item: any) => {
        return {
            label: item.name,
            value: item.id,
        };
    });
});
```



### 页面跳转选择框

```jsx
<form [formGroup]="formOther">
    <mat-form-field class="full-width" appearance="outline">
        <mat-label>生产派工单计划单号</mat-label>
        <input matInput type="text" formControlName="dayOrderNumber" [readonly]="disabled" />
        <button matSuffix mat-icon-button aria-label="Clear" (click)="dayPlan()" [disabled]="disabled">
            <mat-icon>search</mat-icon>
        </button>
    </mat-form-field>
</form>
```

```jsx
dayPlan() {{
    // 点击弹出框
    const dialogRef = this.matDialog.open(DayPlanChoiceComponent, {
        // width: '100%',
        maxHeight: '95vh',
        disableClose: true,
        hasBackdrop: false,
        id: this.minId2,
        data: {
            operate: 'add',
            minId: this.minId2,
        },
    });
    // 回调函数 获取选择的数据进行赋值
    dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
            this.formOther.patchValue({
                dayOrderNumber: result.dayOrderNumber,
            });
            this.dayOrderNumber = result.dayOrderNumber;
            // 可调用其他方法 如:将获取的id去后端查询数据
            this.dapPlanList(result.dayOrderNumber);
        }
    });
}}
// 将获取的id去后端查询数据
private dapPlanList(data: any) {
    this.dayPlanService.listDayPlanDetailByDayOrderNumber(data).subscribe((res: Response) => {
        this.dataTable.data = res.data;
        for (let i = 0; i < this.dataTable.data.length; i++) {

        }
        this.total();
    });
}
```

### 年月选择框

```jsx
<mat-form-field class="no-padding" appearance="outline">
    <mat-label>开始年月</mat-label>
    <input matInput [matDatepicker]="dp1" [formControl]="startDate" readonly />
    <mat-datepicker-toggle matSuffix [for]="dp1"></mat-datepicker-toggle>
    <mat-datepicker #dp1 startView="multi-year" (monthSelected)="chosenStartMonth($event, dp1)"></mat-datepicker>
</mat-form-field>
```

```jsx
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MY_FORMATS } from '../../../../lib/class/configuration/configuration';

@Component({
  selector: 'app-produce-taking',
  templateUrl: './produce-taking.component.html',
  styleUrls: ['../../../../css/table.scss', '../../../../css/layout.scss', '../../../../css/table-for-gj.scss'],
  styles: [],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

startDate: any;

chosenStartMonth(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.startDate.value.month(normalizedMonthAndYear.month());
    this.startDate.value.year(normalizedMonthAndYear.year());
    this.startDate.setValue(this.startDate.value);
    datepicker.close();
}
```

```jsx
// 指定年月选择框: 当前年的指定月 0-->1月
this.startDate.setValue(moment(new Date().setMonth(0)));
// 指定当前时间的  年月
this.startDate = new FormControl(moment(new Date().setMonth(0))); 1月
this.endDate = new FormControl(moment()) 现在月份
```





## 列表的输入框

```jsx
<input
    matInput
    [(ngModel)]="row.unitPrice" // 该行的该字段的数据
    type="quantity"
    min="0"
    [disabled]="disabled"
    (ngModelChange)="calculateUnitPrice(row)" // 每次改变数据即触发方法 传入该行的数据为参数
/>
```

## 列表的选择框

```jsx
<ng-container matColumnDef="warehouseId">
    <th mat-header-cell *matHeaderCellDef appDynamicColumnWidth>入库仓库</th>
    <td mat-cell *matCellDef="let row">
        <mat-select [(ngModel)]="row.warehouseId" [disabled]="disabled (ngModelChange)="queryRegion(row)">
            <mat-option [value]="item.value" *ngFor="let item of warehouseOption">{{ item.label }}</mat-option>
        </mat-select>
    </td>
    <td mat-footer-cell *matFooterCellDef></td>
</ng-container>
```

```jsx
optionMap = new Map();
warehouseOption: Option[] = [];
regionOption: Option[] = [];

queryRegion(row: any) {
    let regionOption: Option[] = [];
    let option = [{ label: '请选择', value: '' }];
    this.regionInfoService.getRegionListByWarehouseId(row.warehouseId).subscribe((res: Response) => {
        let returnOption = res.data.map((item: any) => {
            return {
                label: item.name,
                value: item.id,
            };
        });
        regionOption = [...option, ...returnOption];
        this.optionMap.set(row.spuId, regionOption);
    });
}
```



## 文件上传

### 前端

```html
<div>
	<mat-icon matTooltip="上传图片" (click)="fileUpload('img')">image</mat-icon>
	<mat-icon matTooltip="上传附件" (click)="fileUpload('file')">upload_file</mat-icon>
</div>

<input type="file" multiple="multiple" id="imgInput" class="hide" (change)="uploadImg($event)" value="" accept="image/*" />
<input type="file" multiple="multiple" id="fileInput" class="hide" (change)="uploadFile($event)" value="" accept="image/*" />
```

```jsx
fileUpload(type: string) {
    if( type === 'img' ) {
        (document.getElementById('imgInput') as HTMLElement).click();
    }
    if( type === 'file' ) {
        (document.getElementById('fileInput') as HTMLElement).click();
    }
}

uploadImg(event: any) {
    let file = event.target.files;
    if(file.length > 9) {
        this.snackBarService.open("仅限上传九张图片");
        return;
    }
    for(let i = 0; i < file.length; i++) {
        if (!isImage(file[i].type)) {
            this.snackBarService.open('上传图片格式不对');
            return;
        }
        if (file[i].size > 5 * 1024 * 1024) {
            this.snackBarService.open('上传图片太大，请重新上传');
            return;
        }
        this.fileUploadService.upload(file[i], 14).subscribe((res: any) => {
            if (res.code === 200) {
                this.imgUrl.push({ file: res.data });
                this.render2.selectRootElement("#imgInput").value = null;
                this.snackBarService.openSuccess("上传图片成功")
            }
        });
    }
    this.showImgList = true;
}


uploadFile(event: any) {
    let file = event.target.files;
    if(file.length > 3) {
        this.snackBarService.open("仅限上传三份附件");
        return;
    }
    for(let i = 0; i < file.length; i++) {
        if (!isText(file[i].type)) {
            this.snackBarService.open('上传附件格式不对');
            return;
        }
        // if (file[i].size > 5 * 1024 * 1024) {
        //   this.snackBarService.open('上传附件太大，请重新上传');
        //   return;
        // }
        this.fileUploadService.uploadEnclosure(file[i], 14).subscribe((res: any) => {
            if (res.code === 200) {
                this.fileUrl.push({
                    file: res.data
                });
                this.regFile.push({
                    file: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2") + '.' + res.data.replace(/.+\./, "")
                });
                this.render2.selectRootElement("#fileInput").value = null;
                this.snackBarService.openSuccess("上传附件成功")
            }
        });
    }
    this.showFileList = true;
}
```

```jsx
upload(file: File, folder: UploadFolder) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.uploadPost(
        `/admin/gateWay/fileUpload?folder=${UploadFolder[folder]}`,
        formData
    );
}

uploadEnclosure(file: File, folder: UploadFolder) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.uploadPost(
        `/admin/gateWay/fileUpload/uploadEnclosure?folder=${UploadFolder[folder]}`,
        formData
    );
}
```

### 后端

```java
package com.my.pin.controller.admin.system;

import com.my.pin.exception.WsException;
import com.my.pin.result.R;
import com.my.pin.util.FileUtils;
import io.swagger.annotations.Api;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;

/**
 * @Author czy
 * @Date 2021/8/5
 * @Description: 文件上传
 *
 **/
@Controller
@RequestMapping("gateWay/fileUpload")
@CrossOrigin
@Api(tags={"文件上传控制器"})
public class FileUploadController {


    @PostMapping()
    @ResponseBody
    public R upload(MultipartFile file, @RequestParam(required = false, defaultValue = "default") String folder) {
        try {
            if (file == null){
                throw new WsException("请添加附件");
            }
            String newFileName = FileUtils.createNewFileName(file.getOriginalFilename());
            String path = null;
            path = FileUtils.save((FileInputStream) file.getInputStream(), folder, newFileName);
            return R.success("上传成功",FileUtils.SERVER_PREFIX + path);
        }catch (Exception e) {
            e.printStackTrace();
            throw new WsException("上传失败,上传文件大小不能超过50MB");
        }

    }

    @PostMapping("uploadEnclosure")
    @ResponseBody
    public R uploadEnclosure(MultipartFile file, @RequestParam(required = false, defaultValue = "default") String folder) {
        try {
            if (file == null){
                throw new WsException("请添加附件");
            }
            String fileName = file.getOriginalFilename();
            String path = null;
            path = FileUtils.save((FileInputStream) file.getInputStream(), folder, fileName);
            return R.success("上传成功",FileUtils.SERVER_PREFIX + path);
        }catch (Exception e) {
            e.printStackTrace();
            throw new WsException("上传失败,上传文件大小不能超过50MB");
        }

    }


}

```

```java
package com.my.pin.util;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.Properties;

/**
 * @Author yzh
 * @Date 2020/10/1
 * @Description: 文件工具
 **/
public class FileUtils {

    /**
     * 文件上传的保存路径
     */
    public static String UPLOAD_PATH = System.getProperty("user.dir") + File.separator + "upload" + File.separator;

    /**
     * 文件本地位置
     */
    public static String FILE_LOCATION = "file:" + UPLOAD_PATH;


    /**
     * 文件访问前缀
     */
    public static String SERVER_PREFIX = "/tmp/";

    /**
     * 文件访问前缀
     */
    public static String FILE_SERVER_PREFIX = SERVER_PREFIX + "**";



    /**
     * 读取yml里的属性值
     */
    static {
        YamlPropertiesFactoryBean yamlMapFactoryBean = new YamlPropertiesFactoryBean();
        // 可以加载多个yml文件
        yamlMapFactoryBean.setResources(new ClassPathResource("application.yml"));
        Properties properties = yamlMapFactoryBean.getObject();
        // 获取yml里的路径参数，如果配置了，就读取配置了的，如果没有配置，那么就使用默认的
        UPLOAD_PATH = properties.getProperty("filepath", UPLOAD_PATH);
    }

    /**
     * 根据文件老名字得到新名字
     *
     * @param oldName
     * @return
     */
    public static String createNewFileName(String oldName) {
        String suffix = FileUtil.extName(oldName);
        return IdUtil.fastSimpleUUID() + "." + suffix;
    }

    /**
     * 保存文件,返回图片所在目录和图片自己
     *
     * @return 如2020-02-12/54255afd988f47648cd8a6675ae8c55c.jpg
     */
    public static String save(FileInputStream fis, String folder, String fileName) {
        FileOutputStream fos;
        // 创建通道
        FileChannel inChannel;
        FileChannel outChannel;
        // 要返回的路径
        String selfPath = null;
        // 图片公用的存储位置
        String publicPath;
        try {
            selfPath = "/" + folder + "/" + DateUtil.today() + "/" + fileName;
            publicPath = UPLOAD_PATH + selfPath;
            //如不存在则创建目录及文件
            FileUtil.touch(publicPath);
            fos = new FileOutputStream(publicPath);

            inChannel = fis.getChannel();
            outChannel = fos.getChannel();
            //通道间传输
            inChannel.transferTo(0, inChannel.size(), outChannel);
            inChannel.close();
            outChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return selfPath;
    }
}

```



# Getwey 远程调用

## POST 请求

### 键值对_传参

```java
// 前端请求
deleteDayPlan(id: number) {
    return this.http.get(`/admin/gateWay/dayPlan/delete/${id}`);
}

@PostMapping("getInformationTypeById/{id}")
@ResponseBody
public R getInformationTypeById(@PathVariable("id") Integer id){
    return informationTypeClient.getInformationTypeById(id);
}

// Client 接口 注意多个键值对参数使用注解一一对应
@PostMapping("admin/system/userInfo/getByNameUserInfo")
@ResponseBody
UserInfo getByNameUserInfo(@RequestParam("name")String name);

// 表现层 注意类上面的嵌套请求路径 
@PostMapping("getByNameUserInfo")
@ResponseBody
public UserInfo getByNameUserInfo(@RequestParam("name") String name){
    return userInfoService.getByNameUserInfo(name);
}
```

### JSON_传参

```java
updateWeekPlan(data: any) {
    return this.http.post('/admin/gateWay/weekPlan/update', data);
}

// 网关表现层
@ResponseBody
@PostMapping("save")
public R save(@RequestBody SpuUnitPriceVo spuUnitPriceVo){
    return spuUnitPriceClient.saveSpuUnitPrice(spuUnitPriceVo);
}

// Client 接口 前端请求参数为json格式的对象
@PostMapping("admin/furniture/spuUnitPrice/saveSpuUnitPrice")
@ResponseBody
R saveSpuUnitPrice(@RequestBody SpuUnitPriceVo spuUnitPriceVo);

// 表现层 注意类上面的嵌套请求路径
@ResponseBody
@PostMapping("saveSpuUnitPrice")
public R saveSpuUnitPrice(@RequestBody SpuUnitPriceVo spuUnitPriceVo){
    return spuUnitPriceService.saveSpuUnitPrice(spuUnitPriceVo);
}
```

### 表格_导出

```jsx
<button mat-raised-button color="accent" (click)="exportExcel()">
    <mat-icon
        ><span class="material-icons">
        <span class="material-icons"> file_upload </span>
        </span></mat-icon
        >
    导出表格
</button>

exportExcelWeekPlanDetail(data:any) {
    return this.http.downloadPost('/admin/gateWay/weekPlan/exportExcelWeekPlanDetail',data);
}
```

```java
@PostMapping("exportExcel")
@ResponseBody
public void exportExcel(@RequestBody UnitTakingVo unitTakingVo, HttpServletResponse response){
    UserInfoVo user= RedisUtils.getUser();
    unitTakingVo.setCompanyId(user.getCompanyId());
    List<UnitTakingVo> unitTakingVos = unitTakingClient.listUnitTaking(unitTakingVo);
    String fileName = "供应商结存表";
    EasyPoiExcelUtils.exportExcel(unitTakingVos, fileName, "sheet1", UnitTakingVo.class, "供应商结存信息-"+ DateUtils.farmtDateMin() +".xls", response);
}
```



### 表格_导入

```java
<button mat-raised-button color='accent' (click)='openChooseWindow()'>
    <mat-icon>
    <span class='material-icons'><span class='material-icons'> file_upload </span>
    </span></mat-icon>
    导入表格
</button>
<input type="file" id="chooseExcel" class="hide" (change)="importExcel($event)" value="" accept="/*" />

openChooseWindow() {
    (document.getElementById('chooseExcel') as HTMLElement).click();
}
importExcel(event: any) {
    let file = event.target.files[0];
    this.weekPlanService.importExcel(file).subscribe((res: any) => {
        if (res.code === 200) {
            this.snackBarService.openSuccess('导入成功');
            this.onSubmit();
        } else {
            this.snackBarService.open(res.msg);
        }
        uploadRepeat('chooseExcel');
    });
}    

// 导入Excel
importExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.uploadPost(
        '/admin/gateWay/dayPlan/importExcel',
        formData
    );
}
```

```java
// 网关表现出调用Client接口
@PostMapping("importExcel")
@ResponseBody
public R importExcel(MultipartFile file) {
    if (Objects.equals(file,null)){
        return R.error("请添加附件");
    }else {
        return dimClothClient.importExcel(file);
    }
}

// Client 接口 前端请求参数为文件的流数据
@PostMapping(value = "admin/system/dimCloth/importExcel" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@ResponseBody
R importExcel(@RequestPart("file") MultipartFile file);

// 表现层 注意类上面的嵌套请求路径
@PostMapping(value = "importExcel" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@ResponseBody
public R importExcel(@RequestPart("file") MultipartFile file) throws Exception {
    if (Objects.equals(file,null)){
        return R.error("请添加附件");
    }else {
        return dimClothService.importExcel(file);
    }
}
```



## GET 请求

### 风格传参

```java
// 前端请求
deleteDayPlan(id: number) {
    return this.http.get(`/admin/gateWay/dayPlan/delete/${id}`);
}

// 网关表现层 | 可使用@PathVariable注解
@GetMapping("/delete/{id}")
@ResponseBody
public R delete(@PathVariable("id") Integer id){
    return dimSeriesClient.delete(id);
}

// Client 接口  | 可使用@PathVariable注解
@GetMapping("admin/system/dimSeries/delete/{id}")
@ResponseBody
R delete(@RequestParam("id") Integer id);

// 服务表现层  | 可使用@PathVariable注解
@GetMapping("/delete/{id}")
@ResponseBody
public R delete(@PathVariable("id") Integer id) {
    return dimSeriesService.delete(id);
}
```

