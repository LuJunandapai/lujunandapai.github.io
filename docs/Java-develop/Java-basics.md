---
title: Java 基础
date: 2023/02/15
---

## Java 开发

### **体系结构:** 

* JAVASE 为java语言的基础核心
* JAVAEE 企业级项目开发
* JAVAME 为移动通信设备（淘汰）

**分类:** 

* jdk：开发工具包
* jre：java运行时的环境
* jvm：Java虚拟机（负责Java程序的运行）

**Java开发运行过程**

> 使用开发工具编写java源码，之后使用编译器将源码编译成class文件，最后通过jvm将class文件进行加载并运行

### 标识符与关键字

**标识符**

> 标识符就是名字，它的作用是用来给变量、类、方法、数组等进行命名的。

**命名规则**

- 可以由大小写字母,数字，_ , $
- 不能以数字开头
- 不能是java关键字

**命名规范**

- 见名知意  类:大驼峰(每个单词的首字母大写)
- 变量:小驼峰(第一个单词首字母小写,后面每个单词首字母大写)
- 常量:所有的字母都大写,每个单词之间使用_连接

**关键字**

- Java语言中的关键字都是小写英文字母
- 特殊的标识符,是Java语言里赋予特定的意义



## Java 基础字段属性

**变量**: 

​	变量是计算机内存中的一块区域 语法是由声明变量和赋值组成,
​	变量的特点有:变量值可变,变量名不可重复.

**常量:**

​	 final 数据类型 常量名 = 值;  常量的值不可变而变量的值可变.

### 数据类型

#### 基本数据类型

##### 数值类型

> 整数

- byte 

- short 

- int  --  常用


- long   超过int的最大取值后加L


> 小数类型

- float   赋值需加F

- double  --  常用


* 容器大小   byte < short < int < long < flogat < double

##### 字符类型

- char   只能为单个字符


##### 布尔类型

- boolean  真（true） 假（false)


#### 引用数据类型

##### 字符串 

String

#### 数据类型的转换

> 布尔类型不参加类型的转换

自动转换: 小容器转大容器 

强制转换: 大容器转小容器 会发生精度丢失
short d = (short)c;  强制转换需要转换符

多种数据类型混合运算-结果为大容器类型 如: byte short运算时为常用类型-int

### 运算符

#### **赋值运算符:**  

> =     从右往左运算

#### **算术运算符:** 

>  加-减-乘-除-余 + - * / %
>
>  整数相除为整数，不会四舍五入和带小数
>  字符串与其他类型数据进行“ + ”运算、为拼接

#### **比较运算符**

>  == != > < >= <=   等于-不等于-大于-小于-大于等于-小于等于
>
>  结果只能为布尔类型-true/false

#### **逻辑运算符**

> 逻辑运算符是用来进行布尔值运算的运算符，其返回值也是布尔值
>
> &&:  "逻辑与"
> 			 两边都是true才返回true，有假则假
> ll:  "逻辑或"
> 		两边都为false才返回false，有真则真
> !:  "逻辑非"
> 		逻辑非(!)也叫作取反符，用来取一个布尔值相反的值

#### **自增运算符**

> 前++:  自变量+1    先运算后输出
> 后++:  自变量+1     先输出后运算

#### **复合运算符:**

> p += 2; 相当于 p = p + 2
> p -= 2; 相当于 p = p - 2
> p *= 2; 相当于 p = p * 2
> p %= 2; 相当于 p = p % 2
> p /= 2 相当于 p = p / 2
> 分母不能为-0 否则会报错

* 运算符的优先级  在做算术运算的时候,善于使用()



## 判断 | 迭代循环 | 数组 | 方法

### 判断 if - switch

#### if 语句与语法

```java
if (条件1){
    条件1为真时执行 | if中能够进行嵌套   
}else if (条件2){ 
    条件2为真时执行  --- 可创建多个分支  
}else{   
    条件1和2都为假时执行 --- 可以忽略     
}
```

> if跟字符串比较全等必须使用  - 变量.equals(变量)
> **if与switch的区别:     if:可范围选择,switch:只能是全等选择**

#### switch-语法

```java
switch(表达式){         
	case  表达式的值1:
	// 下方为执行代码 可创建多个case
    break;
	// 到此停止执行
    default:
	// 不符合以上条件所执行的代码
}
```

#### 断言 

> 断言: 相对于if判断 如果为真 下方代码正常执行 否则下方代码不会执行

![image-20220722113423720](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220722113423720.png)



### 循环 迭代

* break :提前结束循环
* continue:结束本次话环-重新开始下一次循环

#### while 循环语法

循环三要素:可控循环次数 1.初始值 2.循环条件 3.自变

> 不知道次数使用while循环
> 无限循环直至不满足条件才会停止
> 循环次数不可控为:死循环

```java
while(条件){
    // 满足条件则循环_输出代码    
}
```

#### do_while循环

do协行代码语句 while (表达式);  表达式为真则循环执行至为假

> while与do_while的区别while:先进行条件判断在执行do_while为先执行一次在进行条件判断是否再次执行

#### for-语法

> 每—组for循环里的变量名是不会相互影响且可以重复变量名

```java
for (初始值;最大值;自增){
    循环语句代码
}
```

#### 增强 for

```java
for (String key : set) {
    //获取键的对应值
    Object value = map.get(key);
    //输出键和值的拼接
    System.out.println(key + value);
}
```

#### forEach表达式 

> 即箭头函数:  能够进行集合遍历

**语法:** 

```java
// list和set集合
集合名 . forEach (变量名 -> {    输出变量名   })
// map集合		
集合名 . forEach ( (键名, 值名) -> {    输出键名,和值名   })
		
```

**案例:**

```java
List<String> list = new ArrayList<String>();
list.add("赵日天");
list.add("李杀神");
list.add("王诛魔");
list.add("刘斩仙");
list.forEach(e -> {
    System.out.println(e);
});

HashMap<String, String> hashMap = new HashMap<String, String>();
hashMap.put("三国演义", "罗贯中");
hashMap.put("红楼梦", "曹雪芹");
hashMap.put("西游记","吴承恩");
hashMap.put("水浒传", "施耐庵");
hashMap.forEach((k,v) -> {
    System.out.println(k + "  " + v);
});
```



#### 迭代器

**迭代器 语法:** 

```java
// 获取迭代器 类似光标执行一次往下一行,如有数据则为真-true 反值则为假-false
Iterator<集合类型> 迭代器名 = 集合名.iterator();
// 使用while循环配合迭代器遍历
while (迭代器名.hasNext()) {         }
// 获取对于行的数据
集合类型 变量名 = 迭代器名.next();
```

**案例:** 

```java
public class IteratorClass {
    public static void main(String[] args) {
        Set<String> set = new HashSet<String>();
        set.add("迭");
        set.add("代");
        set.add("器");
        set.add("遍");
        set.add("历");
        // 迭代器遍历-  - 类似光标执行一次往下一行,如有数据则为真-true 反值则为假-false
        // 1.获取迭代器
        Iterator<String> iterator = set.iterator();
        // 2.使用while循环配合迭代器遍历
        while (iterator.hasNext()) {
            // 3.获取对于行的数据
            String next = iterator.next();
            System.out.println(next);
        }
        System.out.println("----------------");
        // 增强for循环遍历
        for (String z : set) {
            System.out.println(z);
        }
    }
}
```





### 数组

#### 简介:

* 数组有一系列的相同类型的数据的集合
* 同一组数组必须是同一种数据类型
* 数组一旦创建长度无法改变
* 数组下标顺序从 0 开始 数组下标的最大值为长度减_1

#### 语法:

	语法一: 定义数据类型 - 数组名 = 分配空间
	double[] shuzu1 = new double[5];
	shuzu1[0] = 2.0;
	
	语法二: 定义数据类型 - 数组名 = 分配空间及储存数据
	int[] shuzu = {2,3,5,8,6};

#### API: 

* 查看数组的长度: 数组名.length;

* 更改对应下标的值: 数组名[下标] = 值;

* 系统自动排序 - 升序: Arrays.sort(数组名);

* 数组的补充: 

  ```java
  // 数组之间的赋值: 将数组b赋值给啊-b数组与a数组数据将联动
      int[] a = {5,7,9,3,1};
      int[] b = {3,7,88,3,4,9,5};
      //将数组b赋值给啊-b数组与a数组数据将联动
      a = b;
  
  // 数组的扩容-旧数组被覆盖-超过长度的数据以0填充-复制数组给予一样的数组名(被复制的数组,新数组的长度)
      int[] k = {4,5,9};
      //复制数组给予一样的数组名(被复制的数组,新数组的长度)
      k = Arrays.copyOf(k,5);
      数组名 = Arrays.copyOf(数组名,数组长度);
  
  // 数组的复制-新数组名 = Arrays.copyOf(被复制数组名,数组长度);
      int[] k = {4,5,9};
      //复制数组(被复制的数组,新数组的长度)
      int[] l = Arrays.copyOf(k,5);
  ```

#### 遍历: 

```java
正序遍历: 使用for循环:从下标_0依次输出到下标最大值(相当于小于数组个数)
    //从下标_0依次输出到下标最大值(相当于小于数组个数)
    for (int i = 0; i < shuzu2.length; i++) {  
        System.out.println(shuzu2[i]);
    }
    
倒序遍历: 使用for循环:从下标最大值(相当于数组个数减_1)倒序输出到下标_0
    //从下标最大值(相当于数组个数减_1)倒序输出到下标_0
    for (int i = shuzu2.length - 1; i >= 0; i--) {  
        System.out.println(shuzu2[i]);
    }
```

### 方法

#### main 方法

> 一个程序的启动类

```java
// 程序入口:
public static void main(String[] args) {    }

// 修饰符_public static
// 返回值类型_void
// 方法名_main
// 参数_(String[] args)
```

#### 自定义方法

public static void 方法名(形数参数) {  方法的执行代码  }

程序入口里调用:   方法名(实数参数);

* 方法的调用 - 方法之间独立
* 方法调用时,有形数参数在实数参数里必须赋值
* 方法必须添加文档注释

#### 返回值

return 输出返回值的变量名;   将方法的结果返回到主方法的调用处

void - 为返回值类型-指无法输出返回值-改成输出返回值的类型即可输出

**分类:**

```java
// 没有返回值 - 没有参数
    public static void a() {     执行代码    }
// 没有返回值 - 有参数
    public static void b(int n) {      执行代码       }
// 有返回值 - 没有参数
    public static int c() {  return 10;  }
// 有返回值 - 有参数
    public static int d(int m) {   return 10;  }
```

#### 方法的重载:

定义: 在一个类中,多个方法,方法名称一样,参数列表不一样(参数个数,或者数据类型不一样)

**注意:**

* 方法重载的调用,根据调用时传入的形参个数和类型,自动选择需要调用的方法
* 方法的重载跟参数的名称没有关系

#### 方法的可变参数

> 变量数据参数过多时   - 方法参数可使用 ...变量名  代替-伪数组

```java
//方法的 - 可变参数
public class Case_07_kebiancanshu {
	public static void main(String[] args) {
		name(1,2,3,4,5,6,7,8,9);
	}
//	变量数据参数过多时   - 方法参数可使用 ...变量名  代替-伪数组
	public static void name(int ...m) {
		for (int i = 0; i < m.length; i++) {
			System.out.println(m[i]);
		}
	}
}
```

#### 非静态方法

定义: 非静态方法 - 去掉static - 全局方法 如: public void 方法名() {     }

调用: 类名.方法名();

**注意:** 

* static 的方法只能调用被static修饰的语法

* 非 static 的方法则是都可以调用并且能够调用项目中的任何类和任何方法

#### 变量的作用域

**局部变量**

* 在方法内部创建,只能在该方法内部使用
* 在使用之前必须要给初值

**成员变量**

* 创建在类里面,方法外面,在该类的非静态方法中都可以使用

* 成员变量有初始值 

**全局变量**

* 在成员变量的前面加static,在整个项目的所有类中都可以使用通过类名.变量名访问

> 注∶不同的作用域之间变量名可以重,变量的使用遵循就近原则



## 面对对象

### 类

> 类: 具有相同属性的对象的集合

组成:  public class 类名 { 属性- 方法  }

  - 类的名称:类名
  - 类的属性:特征
  - 类的方法:对象的行为

### 对象

> 可以存储不同类型的数据,而且下标由用户自定义这种容器叫对象.

**语法: **

定义变量:  数据类型 变量名;

创建方法-行为:  非静态方法-不能出现static   |  如: public void 方法名() {    }

关联:  类名 名字 = new 类名();

赋值:   名字 . 变量名 = 赋值   |    非静态方法的调用

输出变量:  system.out.println(名字.变量名);

名字.方法名();  方法里有return 变量名;
			

### 构造方法

> this: 当成员变量和局部变量同名时使用this区分-类(我的)

**构造方法特点**

* 方法名跟类名一致
* 一个类中如果没有写构造方法,默认有一个无参的构造方法
* 如果写了构造方法,会覆盖默认的无参构造方法
* 构造方法是在创建对象的时候自动执行
* 构造方法没有返回值 | 构造方法可以被重戟 | 注意参数类型一致(重载)

### 构造语法

> 定义变量:  数据类型 变量名;

* 创建有参构造方法-行为

​		去掉-static和void

​		public 类名( 数据类型 当局变量名 ) {  this.变量名 = 变量名  }

* 创建无参构造方法-行为

​		去掉-static和void  |  public 类名(   ) {    }

关联并所有赋值:  类名 名字 = new 类名( 数据类型对应的赋值 );

自动创建输出 toString 方法  |  一次性输出所有值:   System.out.println(名字);

输出单个变量:  system.out.println(名字.变量名);

### 封装

> 数据是存储在对象的属性中,如果用户能直接操作对象的属性,对数据是非常不安全的为了提高程序的安全性,java引入了封装的概念

**优势:** 

* 属性私有化(private):  被私有化的属性只能在该类的内部访问,在该类的外部,不能被访问到.提供公共的方法供外部间接操作属性

私有化属性:  private String 变量名;
私有化方法:  private void 方法名( ) { 执行代码 }
调用:  提供公共的方法公外部间接使用

**封装语法:  **

定义变量:  private 数据类型 变量名;

数据输入方法:  public void set变量名( 类型 变量名){ this.变量名 = 变量名 }

数据输出方法:  public 数据类型 get变量名(   ) {  return 变量名;  }

步骤:  变量名首字母必须大写

* 关联:  类名 名字 = new 类名(  );
* 赋值:  名字.set变量名(  值  );
* 名字.方法名(值); 赋值给方法的变量然后在传入分类中的变量
* 输出单个变量:  system.out.println(名字.get变量名);

### 继承

> 继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或子类从父类继承方法，使得子类具有父类相同的行为

父类 - 与子类之间 有相同部分属性和方法 |  继承与封装独立开来 - 变量不能加上-private

子类与父类继承 - extends -子类程序入口类名后面 - extends 父类名

**继承的特点**

1. 构造方法不能被继承(构造方法方法名称必须跟类名一致)
2. 一个父类可以有多个子类，一个子类只能有一个父类
3. 可以多重继承,也就是A继承B, B继承C
4. 私有的属性和方法不能被继承

**继承的优缺点**

1. 优点:  提高代码的复用性,降低程序的冗余度
2. 缺点:  继承破坏了封装性,继承提高了代码的耦合度
3. 在项目开发的时候,尽可能的实现项目功能代码的高内聚,低耦合

### 重写

**定义:** 

> 子类跟据父类的方法进行重写
>
> 重写的方法必须跟父类继承的方法结构-名称-参数-返回值类型一样
>
> 重写的方法调用时比继承的方法更有优先权

**重写与重载之间的区别: **

位置不同:

* 方法的重载发生在一个类中
* 方法的重写发生在有继承关系的子类里面

写法不同:

* 方法的重载-多个方法方法名相同,参数列表不同
* 方法的重写-子类重写父类的方法,方法名称和参数列表必须跟父类的方法一致

### super 关键字

**super 关键字作用:**

- super写在子类中,用来访问父类的属性和方法
- super不能访问父类私有的属性和方法
- super可以在子类的构造方法中调用父类的构造方法,而且必须写在子类构造方法的第一行
- 在子类构造方法的第一行,默认有super(),用来调用父类的无参构造方法

**注意: 当创建子类对象时,父类构造方法被执行**
1.子类中没有写构造方法,默认有一个无参构造方法
2.子类构造方法的第一行默认有super()用来调用父类的无参构造方法,创建对象一定会执行构造方法

### final 关键字

> final 可以用来定义常量--常量的值不可更改

* 被final修饰的类是最终类，不能被继承 | public final class Staff {     }

* 被final修饰的方法是最终方法，不能被重写 | public final void work() {      }



### 抽象

> 抽象类

抽象类被 - abstract - 修饰  |  抽象类不能被 - new -对象

public abstract class Athletes {  }  |  public abstract class 类名{    }

**抽象父类-可以作为模板**

- 抽象父类能够继承给抽象子类,非抽象子类会被强制重写
- 父类 - 很抽象-不应该创建对象-只能作为父类被子类继承

> 抽象方法

抽象方法没有方法体-只能被子类重写

public abstract void 方法名();  |  抽象修饰方法 - abstact

### 接口

> 作为父类

端口被 - interface - 修饰  |  public interface 类名 {  }

**注意:** 

- 接口不能被 - new-对象 - 可使用子类new对象
- 接口只能录入 - 全局常量和抽象方法

```
全局常量-public static final int name = 5;  |  会默认省略为-int name = 5;
抽象方法-public abstract void name();  |  会默认省略为-void name();
default void fun1() { 被default 修饰的方法可以不强制重写  };
```

### 多重实现与继承

**子类只能有一个父类-为继承关系 | 子类与接口之间为实现关系**

- 一个类可以实现多个端口   -子类使用 - implements -实现(继承)端口
- 如: public class 子类名 implements 端口名{   }

**端口与端口为继承关系**

- 一个端口可以继承多个端口  -端口使用 - extends -继承端口
- public interface 子类名 extends 端口1,端口2{     }
- 端口里的抽象方法都要强制重写

**写法**

- 先写继承(extends)父类 - 在写实现(implements)端口-多个用逗号隔开
- public class 子类 extends 父类 implements 端口1,端口2{     }

### 引用数据类型转换

数据类型向上转型 - 自动类型转换  |  父类 > 子类
数据类型向下转型 - 强制类型转换  |  需要强转转换符

### 多态

> 在Java里 - 多态指一个对象的多种数据类型 | 指一个对象在现实生活中扮演的多种角色形态

**形成的三个必要条件:**

1.必须有继承或者现实关系
2.必须有方法的重写
3.必须有父类引用指向子类对象

相当于 - 子类向上转型为父类的类型 - 使用父类对象名调用方法但只能调用重写还在继承的方法,如果父类方法使用private私有化则此方法无法调用



### 修饰符

**访问修饰符**

权限从大到小:   public > protected > default > private

**非访问修饰符**

* static 修饰符，用来修饰类方法和类变量。修饰的属性不会被共享

* final 修饰符，用来修饰类、方法和变量，final 修饰的类不能够被继承，修饰的方法不能被继承类重新定义，修饰的变量为常量，是不可修改的。

* abstract 修饰符，用来创建抽象类和抽象方法。

![image-20220723230850524](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723230850524.png)



### 执行顺序

> 编译 - 类加载 - 创建对象

顺序:

- 静态代码块 - 类加载是被执行
- 静态代码块在类加载时执行比在创建对象时的成员代码块和构造方法快
- 构造方法 - 创建对象时被执行
- 成员代码块 - 创建对象时被执行 | 创建两个对象时不会在次进行类加载
- 父子类: 先执行父类在执行子类 类加载是同时进行

静态代码块 > 成员代码块 > 构造方法



### 匿名对象

> 匿名对象由于没有名字，只能在对象创建的时候使用
> 在创建后如果没有被使用,会被java的垃圾回收器回牧
> 可以把对象作为实参传入方法中也可以使用匿名对象直接调用方法

直接使用 new 类名(  值  ) 作为对象名 | 使用构造方法输入数据 | 使用封装get输入数据

### 匿名内部类

定义: 匿名内部类指在一个类中在定义一个没有类名的类

作用:

- 用来创建接口或者父类的子类 - 只能使用一次
- 通过new来创建端口的匿名子类,同时创建子类对象
- 可定义他的对象名来调用内部的方法

> 接口名 对象名 = new 接口名(){  创建的匿名子类及对象-重写的方法   };
> 使用 - 对象名.方法名调用方法 或者不给予对象名直接在类后 .方法名 调用方法

![image-20220723231216137](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723231216137.png)

### 枚举

> 枚举: enum  一般用于定义常量 

```java
package com.apai.util;

public enum MessageStatus {

    UNSEND(1,"未发送"),
    SENDED(2,"已发送"),
    ROUTE_ERROR(3,"路由失败");
    
    private int status;
    private String msg;

    MessageStatus(int status,String msg){
        this.status = status;
        this.msg = msg;
    }
    public String getMsg(){
        return msg;
    }
    public int getStatus(){
        return status;
    }
}
```

### 调用枚举字段

```java
MessageStatus.UNSEND.getMsg() | "未发送"
```





## 数据类型 及 API

### Object - 类

> 定义:类层次结构的根类,每个类都使用 Object 作为超类,即为所有类的默认父类,所有对象（包括数组）都实现这个类的方法 

**Object-类及方法**

* equals: 判断两个对象是否相等 - 地址而不是内容 - 输出值为布尔类型

* hashCode: 获取对象的哈希码值,把对象的哈希码值看作对象的内存地址 ,输出为 - int 类型

* toString: 子类默认继承object类 | 子类没有重写父类的toString方法,输出则是内存地址 | 子类继承重写父类的toString方法,输出字符串加上数据的表现形式

* getClass: 获取创建该对象的类路径,输出为类的位置路径

* finalize: 垃圾回收器 - 无法主动创建



### 基本数据类型的包装类

![image-20220723232359460](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723232359460.png)

![image-20220723232353012](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723232353012.png)

> 在java中所有的引用类型都可以赋 null 值，null表示空的意思 

**包装类 方法:** 

```java
// int最大值: nteger.MAX_VALUE
// int最小值: Integer.MIN_VALUE

// 字符串转整数 - 字符串为阿拉伯数字 
int f = Integer.parseInt(  字符串数字变量名  );

// 整数转字符串
// 方法一:字符串拼接
// 方法二:转换
String 变量名 = Integer的变量名 . toString();

// 自动装箱: 自动把int类型的数字转成Integer类型,该过程自动调用valueof(int r)
int r = 9;
Integer s = r;
过程Integer s = Integer.valueof(r)
// 自动拆箱: 自动把Integer类型的数字转成int类型,该过程自动调用intValue()
Integer t = 16;
int h = t; 
过程int h = t.intValue()
```



### String 常用 API

#### 获取方法

**语法: **

```java
// 获取长度 - 类型为数值类型 该长度为字符串里每一个字符的和
int 变量名 = 变量名 . length()
// 获取指定位置的字符 类型为字符类型 字符串中的每个字符都有下标,下标从0开始
char 变量名 = 变量名 . charAt(  下标  )
// 获取指定字符首次出现的位置下标 类型为数值类型- 字符串用双引号
变量名 . indexOf(  指定字符  )
// 获取指定字符最后一次出现的位置的下标
变量名 . lastIndexOf(  指定字符  )		
```

**案例: **

```java
String a = "work";
// 获取方法
// 1、获取长度 - 类型为数值类型
int b = a.length();
System.out.println(b);
// 2.获取指定下标位置的字符(字符串中的每个字符都有下标,下标从0开始)
// 类型为字符类型
char c = a.charAt(2);
System.out.println(c);
// 3.获取指定字符首次出现的下标 - 类型为数值类型- 字符串用双引号
int d = a.indexOf("k");
System.out.println(d);
```

#### 判断方法 - 布尔

**语法*:***

```java
// 判断两个字符串值是否相等 equals--String重写了Object类的equals方法,不再比较内存地址,而是比较值是否相等
boolean 变量名 = "值相等".equals("值相等");
// 测试此字符串是否以指定的后缀结束
变量名 . endsWith(  指定内容  )
// 字符串长度是否为0 空位真-不空位假 | 可使用长度判断
变量名 . isEmpty()
// 是否包含指定值 - 值为连续的
变量名 . contains(  指定值  )
// 忽略大小写是否相等
变量名1 . equalsIgnoreCase(  变量名2  )
// 测试此字符串是否以指定的前缀开始
变量名 . startsWith(  指定值  )	
```

**案例:**

```java
// 判断方法 - 类型为布尔
// 1.equals--String重写了Object类的equals方法,不再比较内存地址,而是比较值是否相等
"值相等".equals("值相等");
System.out.println("值相等".equals("值相等"));

String s2 = "www.woniuxy.com";
// 2.判断字符串是否以指定的后缀结束
boolean e = s2.endsWith("om");
System.out.println(e);
// 3.判断字符串是否为空--判断长度
System.out.println(s2.isEmpty()); //空位真 , 不空位假

int f = s2.length(); //---可使用长度判断
System.out.println(f == 0 ? "字符串为空":"字符串不为空"); //三元运算符 - 真则 输出左边 假则输出右边
// 4.判断字符串是否包含指定的值 - 值为连续的
boolean g = s2.contains("xy");
System.out.println(g);
// 5.比较两个字符串是否相等,并忽略大小写
String h = "WWW.woniuXY.com";
boolean y = h.equalsIgnoreCase(s2);
System.out.println(y);
// 6.判断字符串是否以指定的内容开头
boolean m = s2.startsWith("ww");
System.out.println(m);
```

#### 转换方法

**语法:** 

```java
// 小写转大写
变量名 . toUpperCase()
// 大写转小写
变量名 . toLowerCase()
// 将字符串转换为字符数组 将字符串里的每一个字符转成一组
char[] 数组名 = 变量名 . toCharArray()
// 将字符数组转为字符串
String 变量名 = new String( 数组名 )
```

**案例:** 

```java
//转换
String r = "transition";
//小写转换大写
String a = r.toUpperCase();
System.out.println(a);
//大写转换小写
String b = a.toLowerCase();
System.out.println(b);
//字符串转换数组
char[] shu = r.toCharArray();
for (int i = 0; i < shu.length; i++) { //数组遍历
    System.out.println(shu[i]);
}
//数组转换字符串
String c = new String(shu);
System.out.println(c);
```

#### 其他方法

**语法:**

```java
// 替换 使用指定的值替换替换此字符串所有匹配的字符
字符串变量名 . replace(  被替换内容  , 替换内容  )
// 切割 根据指定字符将字符串切割为数组 切割转数组时第一个被切则它前面为一组(空组)-最后有一个则没有分组
// 注意 无法切割点 ' . '  需要转义  '  \\.  '
String[] 数组名 = 变量名 . split(  切割值  )
// 截取 从指定位置截取到最后 
String 新变量名 = 变量名 . substring(  截取的下标包含  )
// 截取指定长度的字符串 前下标包含,后下标不包含
String 新变量名 = 变量名 . substring(前下标 , 后下标)
// 去除字符串首尾空格 去除所有空格 - 可使將空格 " " 替換 "" 空字符串
变量名 . trim()
```

**案例:**

```java
//其他方法
String a = "wnwewrwp";
//替换 - 将指定内容替换成其他 - 指定内容将被全部替换
String b = a.replace("w", "m");
System.out.println(b);

//其他方法
String a = "wnwewrwp";
//切割 - 将字符串切割成数组 - "*"和"."无法被切割
//切割转数组时第一个被切则它前面为一组(空组)-最后有一个则没有分组
String c = "a-v-w-r-f-s";
String[] d = c.split("-");
for (int i = 0; i < d.length; i++) {
    System.out.println(d[i]);
}

String a = "wnwewrwp";

//截取 - 前下标包含,后下标不包含
//从指定下标截取到末尾
String f = a.substring(3);
System.out.println(f);
//截取 - 前下标包含,后下标不包含
String a = "wnwewrwp";
//截取指定的下标区间 - 前下标包含,后下标不包含
String t = a.substring(2, 5);
System.out.println(t);

//去除首尾的空格
String g= "  前  后     ";
String p = g.trim();
System.out.println(p);
//去除所有空格 - 可使將空格替換 "" 空字符串
String  n = g.replace(" ","");
System.out.println(n);
```

### Arrays | 数组

```java
// 数组复制(扩容)
int[ ] 新数组名 = Arrays.copyOf(  数组名 , 新数组长度  );
// 数组排序--升序排序
Arrays.sort(  数组名  );
// 数组查找-使用二分法去数组中查找元素,数组必须是升序的,结果是元素在数组中的下标,没找到结果为负
int 下标的变量名 = Arrays.binarySearch(    数组名 ,  查找的数值   );
// 数组转字符串 直接输出数组输出的是数组的内存地址 返回指定数组内容的字符串表示形式。
String  变量名  = Arrays.toString(  数组名  );
```

![image-20220723234023169](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723234023169.png)

### Math | 数学类

```java
// PI - 圆周率
Math.PI 
// 取绝对值--负数的绝对值是正数,正数的绝对值是它本身
Math.abs( 正负数值 )
    
// 向上取整 - Math.ceil( 数值 )
// 向下取整 - Math.floor( 数值 )
// 四舍五入 - Math.round( 数值 )
    
// 随机数生成
0 <= Math.random() < 1
// 生成1-10之间的整数 - 强制转换且注意顺序
(int)(Math.random()*10+1)
// 求m的n次方
Math.pow( 数值  ,  n次方 )
    
// 保留小数点后两位
double f = 111231.5585;
System.out.println(String.format("%.2f", f));
```

![image-20220723234242193](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220723234242193.png)

### Buffer/Builder  | 字符串

> StringBuilder和StringBuffer语法一致,优先使用StringBuffer效率高 | 当程序多次使用string字符串拼接会造成卡顿

- @dexcription:所有的字符串字面值都是String类的对象,同时也是常量
- 字符串拼接一定会创建新的字符串对象,但是对象的创建是一个非常消耗内存资源,非常耗时的操作
- 为了解决字符串拼接会创建新对象的问题,java引入了新的类StringBuffer和StringBuilder
- String是不可变长度字符串
- StringBuffer是可变长度字符串
- StringBuilder是可变长度字符串

```java
// 创建StringBuffer对象 - 可变长度字符串
	StringBuffer 变量名 = new StringBuffer();
// 拼接且不会产生新对象 可多次拼接
	变量名.append(  拼接的string变量名  );
		
// StringBuffer 转 string
	String 变量名 = 变量名 . toString();
// 字符串的反转 - 倒过来
	StringBuffer 变量名 = 变量名 . reverse();
// 字符串转StringBuffer
	StringBuffer 变量名 = new StringBuffer( "内容" );
```

```java
public static void main(String[] args) {
    String a = "字符串";
    String b = "拼";
    String c = "接";
    //当程序多次使用字符串拼接会造成卡顿
    String d = a + b + c; 
    //创建StringBuffer对象 - 可变长度字符串
    StringBuffer w = new StringBuffer();
    //字符串拼接且不会产生新对象
    w.append(a);
    w.append(b);
    w.append(c);
    System.out.println(w);
    //StringBuffer 转 string
    String r = w.toString();
    System.out.println(r);
    //字符串的反转 - 倒过来
    StringBuffer t = w.reverse();
    System.out.println(t);
    //字符串转StringBuffer
    StringBuffer y = new StringBuffer("字符串拼接");
    System.out.println(y);
}
```

### Date | 时间

> 时间单位   导包:  import java.util.Date;

1y = 365d; | 1d = 24h; | 1h = 6eM; | 1M = 60s; | 1s = 1000ms;

> 时间原点: 会根据电脑地方时区矫正

- 把1970年1月1日0时0分O秒作为时间原点(格林威治时区) 
- 把1970年1月1日8时0分O秒作为时间原点(东八区)

```java
// 获取当前时间并储存
Date 时间变量名 = new Date();
// 获取时间原点带现在时间的毫秒数 数据过大 - 使用long类型
long 变量名 = date.getTime();
// 在时间原点上增加毫秒数
Date m = new Date(  毫秒数  );
```

#### 日期格式化

年: yyyy | 月: MM | 日: dd | 时: hh | 分: mm |  秒: ss

```java
// 定义格式
String 变量名 = "yyyy-MM-dd HH:mm:ss";
// 创建日期格式转换工具
// 导包: import java.text.SimpleDateFormat;
SimpleDateFormat 工具变量名 = new SimpleDateFormat(格式变量名);
// 日期转字符
System.out.println(  工具变量名 . format(  时间变量名  )  ); 
// 字符串转日期 格式与定义格式一致
// 导包: import java.text.ParseException; 
String 日期变量名= "2023-01-01 00:00:00";
Date 变量名 = sdf.parse(  日期变量名  );
```

> **将时间按格式转换字符串**

```java
// 时间格式 --> 年: yyyy 月: MM 日: dd 时: hh 分: mm 秒: ss

// 获取当当前时间并按自定义格式转换字符串
// 获取当前时间
Date date = new Date();
// 定义格式
String geshi = "yyyy-MM-dd HH:mm:ss";
// 创建日期格式转换工具
SimpleDateFormat sdf = new SimpleDateFormat(geshi);
// 将当前时间转换自定义格式字符串
String datetime = sdf.format(date);

String datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

```

> 时间计算

天:     相差的毫秒数 / 1000(秒) / 60(分) / 60(时) / 24(天)

时:     相差的毫秒数 / 1000(秒) / 60(分) / 60(时) %余  24(天)     小时 / 24 余下的是不足一天的小时

分:     (相差的秒(相差的毫秒数 / 1000) - 满足天的秒 - 满足小时的分) /60   剩下的就是不足一个小时的秒 / 60 为不足一小时的分

秒:     相差的秒(相差的毫秒数 / 1000) - 满足天的秒 - 满足小时的分 - 满足一分的秒      剩下就是不足一分的秒

#### Date 类型

```java
// Date --> string 
String datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
// string --> date
Date date = new SimpleDateFormat("yyyy-MM").parse("2022-11");

// 时间偏移 上一个月 30 天
Date startDate = DateUtils.addDays(date, -30);
```

#### LocalDate

https://blog.csdn.net/yy139926/article/details/124298574

```java
// LocalDate 常用Api
// 获取当前日期
LocalDate now = LocalDate.now();
LocalDateTime time = LocalDateTime.now()
// 设置日期
LocalDate localDate = LocalDate.of(2019, 9, 10);
// 获取年
int year = localDate.getYear();     //结果：2019
int year1 = localDate.get(ChronoField.YEAR); //结果：2019
// 获取月
Month month = localDate.getMonth();   // 结果：SEPTEMBER
int month1 = localDate.get(ChronoField.MONTH_OF_YEAR); //结果：9
// 获取日
int day = localDate.getDayOfMonth();   //结果：10
int day1 = localDate.get(ChronoField.DAY_OF_MONTH); // 结果：10
// 获取星期
DayOfWeek dayOfWeek = localDate.getDayOfWeek();   //结果：TUESDAY
int dayOfWeek1 = localDate.get(ChronoField.DAY_OF_WEEK); //结果：2

// 字符串 --> LocalDate 
LocalDate max = LocalDate.parse("2022-07-05",DateTimeFormatter.ofPattern("yyyy-MM-dd"));
```

#### LocalDateTime

```java
// 获取当前日期
LocalDateTime time = LocalDateTime.now()
// 你的时间在当前时间之后是 true
你的时间.isAfter(LocalDateTime.now())
// 你的时间在当前时间之前是 true
你的时间.isBefore(LocalDateTime.now())
    
// LocalDateTime --> 字符串
String dateStr = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now());
// 字符串 --> LocalDateTime 
LocalDateTime max = LocalDateTime.parse("2022-10-17 23:40:58", ateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
```

#### 时间字段总结

[java8新特性LocalDateTime字符串转时间比较大小](https://www.cnblogs.com/zzlcome/p/11093292.html)

```java
// 接收参数时使用 - 数据库精确到秒 但是前端只到日 实体类类型使用 LocalDate
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
// 返回结果时使用 - 数据库精确到秒 但是前端只到日 实体类类型使用 LocalDate
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")		
private LocalDateTime birthday;

// 使用注解可在数据库可对应多种格式类型 然后前端赋值对应的格式时间 
Date 		  // - 时间类型 可对应多种格式 时分秒 对应数据库的时间数据类型
LocalDateTime // - 时间类型 只能是: 年月日 时分秒 对应数据库的时间数据类型
LocalDate     // - 时间类型 可以是: 年月日 对应数据库的时间数据类型
```



### BigDecimal | 精确计算

> 类型 - 精确计算  适用于关于金钱属性字段

**赋值:  推荐使用双引号**

* new BigDecimal("1002");

**计算方式:** 		

- 加法  |  add()
- 减法  |  subtract()
- 乘法  |  multiply()
- 除法  |  divide()

**转换:**

* BigDecimal  -->  int  |  BigDecimal .intValue()



## Java 常用集合

### 范性

限制录入的数据类型 - 数据类型只能是引用数据类型

范性集合-类型一致不需要强转

ArrayList< 引用数据类型 > fx = new ArrayList< 引用数据类型 >();

查看数据时有时候注意强制转换

范性集合在查询数据时可以不需要强转

**增强 for 循环**

- 将被遍历的容器里的每一组数据赋值给新变量然后输出
- for( 变量名 : 被遍历的容器 ) {   } -  注意变量类型一致

### ArrayList 集合

> 特性: 存储不唯一,有序插入,可以存储任意类型数据,下标从0开始

**List 集合 API**

```java
// 创建ArrayList对象-集合容器 输出 - 可直接输出
ArrayList 对象名  = new ArrayList();
// 增 - 类型可以不一样-内容可以一样 - 数据储存都转为object类(自动装箱)
对象名 . add(  值   );
// 改 - 根据下标修改对应的数据
对象名 . set ( 下标 , 修改内容  );
// 查 -根据下标查询对应的数据-查询后的类型都为-object-类
Object 变量 = 对象名 . get( 下标  );
// 删 - 根据下标删除对应的数据
对象名 . remove(  下标  );
// 查看集合长度
int 变量 = 对象名 . size();
// 判断集合是否有某个元素 - 类型布尔
对象名 . contains ( 值  ):
// 集合转为数组 - 数据储存都转为object类-数组类型也为object类
Object[] 数组名 = 对象名 . toArray();
// 清除集合所有的元素
对象名 . clear( );
```

**List 集合 API 实测**

```java
import java.util.ArrayList;

public class ArraylistClass {
    /**
	 * 集合 - ArrayList对象-集合容器
	 * 存储不唯一,有序插入,可以存储任意类型数据,下标从0开始
	 */
    public static void main(String[] args) {
        //创建ArrayList对象-集合容器
        ArrayList arrayList  = new ArrayList();
        //增 - 类型可以不一样-内容可以一样 - 数据储存都转为object类(自动装箱)
        arrayList.add(8);
        arrayList.add(false);
        arrayList.add("增加");
        arrayList.add('W');
        arrayList.add(8);
        //输出 - 可直接输出
        System.out.println(arrayList);
        //改 - 根据下标修改对应的数据
        arrayList.set(1, true);
        //查 -根据下标查询对应的数据-查询后的类型都为-object-类
        Object cha = arrayList.get(3);
        System.out.println(cha);
        //删 - 根据下标删除对应的数据
        arrayList.remove(0);
        System.out.println(arrayList);
        //查看集合长度
        int cd = arrayList.size();
        System.out.println(cd);

        //其他方法
        //判断集合是否有某个元素 - 类型布尔
        boolean m = arrayList.contains("增加");
        System.out.println(m);
        //集合转为数组 - 数据储存都转为object类-数组类型也为object类
        Object[] sz = arrayList.toArray();
        for (int i = 0; i < sz.length; i++) {
            System.out.println(sz[i]);
        }
        //清楚集合所有的元素
        arrayList.clear();
        System.out.println(arrayList.size());
    }
}
```

### hashset 集合

**特性:** 

- 储存一组无序且数据内容唯一的集合-没有下标 
- 没有-改-查-方法
- Hashset集合遍历-没有下标只能使用增强for循环 

```java
// 创建hashset集合
HashSet<Integer> 对象名 = new HashSet<Integer>();
// 根据元素值删除
集合名 . remove(  值  );
// HashSet集合转ArrayList 使用ArrayList构造方法进行转换
ArrayList<类型> 对象名 = new ArrayList<类型>(HashSet集合名);
// ArrayList集合转HashSet 使用HashSet构造方法进行转换 可以去重
HashSet<类型> 对象名 = new HashSet<类型>(ArrayList集合名);
```

**hashset 集合 实测**

```java
public class HashsetClass {
    /**
	 * Hashset - 储存一组无序且数据内容唯一的集合-没有下标
	 */
    public static void main(String[] args) {
        //创建hashset集合 - 导包
        HashSet<Integer> hs = new HashSet<Integer>();
        //储存数据 - 无序且没有下标
        hs.add(8);
        hs.add(84);
        hs.add(82);
        hs.add(48);
        hs.add(7);
        //删 - 根据元素输出数据
        hs.remove(48);
        //判断是否包含某个元素-类型布尔
        Boolean a = hs.contains(7);
        System.out.println(a);
        //清空所有元素数据
        //hs.clear();
        //获取集合长度
        int cd = hs.size();
        System.out.println(cd);
        //集合输出
        System.out.println(hs);
        //Hashset集合遍历-没有下标只能使用增强for循环 
        //注意类型要对应
        for (int m : hs) {
            System.out.println(m);
        }
        //HashSet集合转ArrayList
        //使用ArrayList构造方法进行转换
        ArrayList<Integer> al = new ArrayList<Integer>(hs);
        System.out.println(al);
        //ArrayList集合转HashSet - 可以去重
        //使用HashSet构造方法进行转换
        HashSet<Integer> hs2 = new HashSet<Integer>(al);
    }
}
```

### hashmap 集合

**特性:** 

* HashMap 集合是一种依照键〈key)值(value)对存储数据的容器，键(key)很像下标，在List中下标是整数。
* map不是Collection接口下的

* 在Map中键(key)可以使任意类型的对象。Map中不能有重复的键(Key),每个键(key)都有一个对应的值(value)。一个键(key)和它对应的值构成map集合中的一个元素。

```java
// 创建HashMap<键, 值>集合 HashMap集合无序-键和值的数据类型可自定义
HashMap< 键-key,值-value >  map = new HashMap< 键-key,值-value >();
// 增-put - 键和值的类型要对应 输出类型object 利用键的名称相同可达到修改的作用  - 覆盖
map.put ( 键,值 );
// 删 - 通过键来删除
map.remove( 键 );
// 查
map.get (键 key )
// 判断是否包含键 - 值
集合名.containsKey(键)
集合名.containsvalues(值)
// 获得所有的值 - 输出类型为set集合
Set< 键的类型 > 名字 = 集合名 . values();
// 获得所有的键 - 输出类型为set集合
Set< 键的类型 > 名字 = 集合名 . keySet();
// 遍历 增强for循环 获取键的对应值 输出键和值的拼接
```

**hashmap 集合 实测**

```java
package study;
import java.util.HashMap;
import java.util.Set;
/**
 * HashMap 集合是一种依照键〈key)值(value)对存储数据的容器，键(key)很像下标，在List中下标是整数。
 * 在Map中键(key)可以使任意类型的对象。Map中不能有重复的键(Key),每个键(key)都有一个对应的值(value)。一个键(key)和它对应的值构成map集合中的一个元素。
 * Map集合存储的数据是键值对结构
 * Map集合存储的数据是无序的
 */
public class Mappclass {
	public static void main(String[] args) {
		//创建HashMap<键, 值>集合-指定键和值
		//键相当于下标-唯一不能重复-类型可自定义
		//值-类型可自定义
		HashMap<String, Object> map = new HashMap<String, Object>();
		//增-put - 键和值的类型要对应
		map.put("姓名","小渊");
		map.put("年龄",24);
		map.put("性别","男");
		map.put("身高",165.0);
		//删 - 通过键来删除
		map.remove("性别");
		//改 - 键唯一且不能重复-反之修改
		map.put("年龄", 30);
		//查 - 通过键来查询对应的值
		Object a = map.get("姓名");
		//查看hashmap的长度
		int b = map.size();
		System.out.println("hashmap的长度: " + b);
		//输出HashMap集合的数据 - 可直接输出
		System.out.println(map);
		//判断HashMap是否包含指定键
		boolean c = map.containsKey("身高");
		System.out.println(c);
		//判断HashMap是否包含指定值
		boolean d = map.containsValue("男");
		System.out.println(d);
		System.out.println("---------");
		//遍历
		//获得所有的键 - 输出类型为set集合
		Set<String> set = map.keySet();
		//增强for循环
		for (String key : set) {
			//获取键的对应值
			Object value = map.get(key);
			//输出键和值的拼接
			System.out.println(key + value);
		}
		System.out.println(set);
		//输出所有集合值
		Object sa = map.values();
		System.out.println(sa);
	}
}
```

### Collections API

```java
// 排序 - 升序 - 数值类型 - list集合
Collections.sort( 集合名 );
// 反转 - 先升序后反转为倒序
Collections.reverse( 集合名 );
// 最大值
Collections.max( 集合名 );
影片案例.png
// 最小值
Collections.min( 集合名 );
```

```java
public static void main(String[] args) {
    //创建Arraylist集合
    ArrayList<Integer> list = new ArrayList<Integer>();
    list.add(9);
    list.add(19);
    list.add(5);
    list.add(30);
    list.add(42);
    System.out.println(list);
    //排序 - 升序 - 数值类型 - list集合
    Collections.sort(list);
    System.out.println(list);
    //反转 - 先升序后反转为倒序
    Collections.reverse(list);
    System.out.println(list);
    //最大值
    int max = Collections.max(list);
    System.out.println("最大值为: " + max);
    //最小值
    int min = Collections.min(list);
    System.out.println("最小值为: " + min);
}
```



### 比较器

**特性:** 

- Comparator比较器 - 端口  |  可以把集合的对象元素按照对象里的某个属性排序
- 比较器排序规则: 大于-正数  小于-负数  大于-零  则从小到大-正序  |  反之则是倒序

**步骤:** 

```java
// 创建Comparator比较器 - 端口 | 匿名内部类
new Comparator<集合类型>() {    };
Comparator<集合类型> 名字 = new Comparator<集合类型>() {  重写比较器的方法  };
// 比较器的重写方法
public int compare(Personage o1, Personage o2) {   if语句相比o1和o2集合里对象的属性    }
// 简化
return  o1.对象属性  -  o2.对象属性;
// 进行排序
Collections.sort( 集合名 , 比较器名字 );
```

```java
package com.apai.springbootvue;

import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

public class Mmm {

    public static void main(String[] args) {
        List<Integer> list = new LinkedList<>();
        list.add(8);
        list.add(10);
        list.add(4);
        list.add(38);
        Comparator<Integer> comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o1 - o2;
            }
        };
        Collections.sort(list,comparator);
        for (Integer integer : list) {
            System.out.println(integer);
        }
    }
}
```

**案例:** 

![image-20220724092417222](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220724092417222.png)



## 异常-自定义 | JDBC 

### 异常

**组成: Throwable - 顶级异常**

* Exception - 能解决的异常

  RunTimeException  - 运行时异常

​		非运行时异常 - 检查异常

* Error - 无法解决的异常 -内存不足

#### 常见的异常

1. 算术异常 ArithmeticException
2. 下标越界异常 IndexOutOfBoundsException
3. 空指针异常 NullPointerException
4. 数字转换异常 	NumberFormatException

#### 异常处理

```java
// 异常处理
try {
	//可能出现异常的代码
} catch (Exception e) {
	//try里出现异常则执行此处
}finally {
	//无论try是否出现异常的将执行
	//打印详细的异常信息: e.printStackTrace();
	//获取异常信息: System.out.println(e.getMessage());
}

// 多重异常处理 根据try出现的不同异常选择进入不同的catch执行
try {
	//根据try出现的不同异常选择进入不同的catch执行
} catch (ArithmeticException e) {
	//当try为 算术异常 是执行
} catch (IndexOutOfBoundsException e) {
	//当try为 下标越界异常 是执行
} catch (NullPointerException e) {
	//当try为 空指针异常 是执行
} catch (NumberFormatException e) {
	//当try为 数字转换异常 是执行
}


```

#### 异常信息处理

* getMessage(): String | 输出异常的描述信息

* getLocalizedMessage() | 输出本地化的描述信息，一般此方法可被子类所覆盖，缺省实现与getMessage()输出信息一致

* printStackTrace() | 将异常栈打印到输出流中，此为一类方法，默认打印到console控制台，也可以显式指定输出流

* fillInStackTrace()

#### 声明异常

**throws 跟 throw的区别**

- throws写在方法的定义上,把异常抛给方法的调用者
- throw 写在方法体上,抛出一个具体的异常对象

throws Exception:  在方法调用出可选择再次抛出异常或者使用try解决异常

> 当方法里出现异常时可在方法名后使用 - throws Exception 抛出异常给方法调用处解决

throw

> 写在方法体中,抛出一个具体的异常对象

throw new Exception();

> 制造异常使之进入catch执行回滚

#### 系统日志的级别:

DEBUG < INFO < WARN < ERROR < FATAL



### 自定义异常

> 持久层的异常自动在业务层捕获，业务层需要将此异常抛给表示层
>
> 使用自定义异常来描述与业务相关的异常消息，然后通知用户

往上抛出异常 |  throw .....

#### 异常层 - 自定义异常类

> 所有业务异常的的超类 继承 RuntimeException
>
> 继承 业务异常的的超类 重写方法 例如: 

````java
/**
 * 所有业务异常的的超类
 */
public class ServiceException extends RuntimeException{
    public ServiceException() {
        super();
    }

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
````

#### 自定义抛出异常

```java
throw new 自定义异常类名("内容_可根据重载赋值");
```

#### 异常出现时接收异常

```java
try {
    tpaylogService.addplaceanorder(tpaylogVo);
    
} catch (Exception e) {
    // 出现异常 判断是否是 自定义的异常 | [ e instanceof 自定义的异常类 ]
    if (e instanceof IntegralException){
        return new ResponseResult<>(null, e.getMessage(), 999);
    }else {
        return new ResponseResult<>(null, "网络异常 稍后再试", 999);
    }
}

-------------------------------------
    // 判断是否是业务异常
    e instanceof ServiceException
    // 自定义异常的内容		
    e.getMessage()
    // 系统发生的异常	
    e.printStackTrace();
```



### JDBC 数据库

#### 数据库连接步骤

**1.获取数据库信息**

```java
// 语法:  String url = "jdbc:mysql:// ip地址 : 端口 / 数据库名称 ?useUnicode=true&characterEncoding=UTF-8& 时区 ";
String url = "jdbc:mysql://127.0.0.1:3306/date_0316_jdbc?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai";
// 数据库账号
String user = "root";
// 数据库密码
String password = "123456";
// 数据库驱动路径 驱动的安装: 创建文件夹 - lib 将驱动文件复制到文件夹
String driverclass = "com.mysql.cj.jdbc.Driver";
```

**2.注册驱动(可省略但不建议)**

> 会有异常 - (数据库驱动路径变量名)
>
> Class.forName(driverclass);

**3.连接数据库获取对象**

> 导包两个-会有异常 ( url , 账号 , 密码 )
>
> Connection conn = DriverManager.getConnection(url, user, password);

**4.写sql语句**

> String sql = "  数据库的表增删改查 SQL 语句  ";

**5.sql预编译**

> 导包-预编译sql语句变量名
>
> PreparedStatement 编译名 = 连接数据库变量名.prepareStatement( sql语句变量名 );
>
> PreparedStatement pst = conn.prepareStatement(sql);

**6.执行sql语句**

```java
// 增删改 执行编译后的变量名,并输出是否成功受影响的行数
int 执行名 = 编译名 . executeUpdate();
int result = pst.executeUpdate();
System.out.println("受影响的行数为: " + result + " 行");
// 查 执行时时使用 - executeQuery() 
ResultSet 执行名 = 编译名 . executeQuery();
ResultSet rs = pst.executeQuery();
使用while循环遍历 - while(执行名.next()) 执行一次向下一排,当一排数据为空则停止
```

**7.关闭连接**

```java
// 增删改时
// 3.连接数据库获取对象 - 关闭
conn.close();
// 5.sql预编译 - 关闭
pst.close();
// 查询表数据时
// 6.执行sql语句 - 关闭
rs.close();
```

#### jdbc - 事务

```java
// 默认是自动提交
conn.setAutoCommit(false);-- 关闭自动提交,相当于开启事物
conn.setAutoCommit(true);-- 开启自动提交,相当于关闭事物
// 执行过程
// 执行sql语句 语句为一体,全部执行成功则成功 当使用sql语句执行成功则确认-提交
conn.commit()
// 当使用sql语句执行失败则撤销-回滚
conn.rollback()
// 制造异常使之进入catch执行回滚
throw new Exception();
```

#### 事务的四大特性:

1、原子性（Atomicity）：化学中的原子指不可再分的基本微粒，数据库中原子性强调事务是一个不可分割的整体，事务开始后所有操作要么全部成功，要么全部失败，不可能停滞在中间某个环节。如果事务执行过程中出错就会回滚到事务开始前的状态，所有的操作就像没有发生一样不会对数据库有任何影响。

2、一致性（Consistency）：事务必须使数据库从一个一致性状态变换到另一个一致性状态，即一个事务执行之前和执行之后都必须处于一致性状态。拿转账来说，假设用户A和用户B两者的钱加起来一共是5000，那么不管A和B之间如何转账，转几次账，事务结束后两个用户的钱相加起来应该还是5000，这就是事务的一致性。

3、隔离性（Isolation）：当多个用户并发访问数据库时，比如操作同一张表时，数据库为每一个用户开启的事务，不能被其他事务的操作所干扰，多个并发事务之间要相互隔离，比如A正在从一张银行卡中取钱，在A取钱的过程结束前，B不能向这张卡转入钱。

4、持久性（Durability）：一个事务一旦被提交，则对数据库的所有更新将被保存到数据库中，不能回滚。



## File | 流 | 线程 | 网络编程

### File 文件 | 目录

#### 创建目录 

> \\  | /  |  +File.separator+  |  逗号 , 分隔

```java
public static void main(String[] args) {
    // 创建目录一
    File file1 = new File("D:\\qq.bin");
    System.out.println(file1);
    // 创建目录二
    File file2 = new File("D:/qq.bin");
    File file3 = new File("D:"+File.separator+"qq.bin");
    System.out.println(file2);
    System.out.println(file3);
    // 创建目录三
    File file4 = new File("D:" , "qq");
    File file5 = new File("D:/qq" , "bin");
    File file6 = new File(file4 , "bin");

}
```

#### 常用方法 API

> File file1 = new File("D:\\qq.bin"); 调用

```java
// 创建目录 多层目录时用mkdirs() 一层可以用mkdir()
boolean  -  变量名.mkdirs()
// 创建文件
boolean  -  变量名.createNewFile()
// 删除文件
boolean  -  变量名.delete()
// 输出路径
String - 变量名.getAbsolutePath()
// 获取文件或目录名称
String - 变量名.getName()
// 获取父类目录的名称
String - 变量名.getParent()
// 获取父类目录的file实例
File - 变量名.getParentFile()
// 判断文件是否存在
boolean  -  变量名.exists()
// 判断是否为文件
boolean  -  变量名.isFile()
// 判断是否为目录
boolean  -  变量名.isDirectory()
// 获取上次修
long - 变量名.lastModified()
// 距时间原点的毫秒值
// 返回文件大小
long - 变量名.length()
// 获取路径下的目录和文件
File[] -  变量名.listFiles()
```

**文件创建 递归 - 遍历文件目录所有文件夹和文件**

```java
// 文件创建 递归 - 遍历文件目录所有文件夹和文件
public class File_digui {

	public static void main(String[] args) {
		// - 自动导包  ctrl + shift + o
		//创建目录
		File file = new File("C:/Users/Lujun/Documents/你是我的月亮/与太阳有关");
		// 方法 传入-目录 和 目录层级
		show(file, 0);

	}
	private static void show(File file, int spaces) {
		// 当目录不存在为空时方法停止
		if (file == null) {
			return;
		}
		// 判断是否为目录
		if (file.isDirectory()) {
			// 获取目录中所有文件 - 使用数组储存
			File[] listFiles = file.listFiles();
			// 增强for循环遍历数组 - 快速创建增强for循环: fore + 代码提示
			for (File file2 : listFiles) {
				// System.out.println("文件大小: " + file2.length() + " 字节");
				// 按目录层级 不换行添加空格 每一层目录多增加一个空格 - \t:空格
				for (int i = 0; i < spaces; i++) {
					System.out.print("\t");
				}
				// 输出目录名称
				System.out.println(file2.getName());
				// 再次使用方法 传入 为每层的目录
				show(file2, spaces + 1);
			}
		}
	}

}
```

### Io 流

文件中的换行是由两个独立字节组成: \r回车(13)  \n换行(10)

#### 字节流

> JDK7 | try(创建流对象){ }
>
> IO流创建后,会被try自动管理,在程序执行完后,自动关流释放资源,不需要人为的关闭流

##### 输入字节流

```java
FileInputStream fis =  new FileInputStream("文件路径");
// 查询文件的内容
变量名.read()
// 依次输出字符的ACS||表对应的数据 - 当输出到最后没有字符时为 -1
// 输出时使用char强转输出对应的字符
// 根据判断是否为-1 进行循环
// 关闭流
变量名.close()
```

##### 输出字节流

```java
// 默认追加为覆盖 - 如果追加不覆盖则在目录文件后加上 true
// 输出时文件不存在则自动创建 - 目录不会自动创建
FileOutputStream fos = new FileOutputStream("文件路径",true);

// 追加字符 | ACS||表对应的数据
变量名.write(97)
变量名.write(
// 追加字符串
变量名.write("字符串".getBytes())
// 字符串转数组
"字符串".getBytes()
变量名.write("字符串".tostring())
变量名.write("字符串".tostring().getBytes("GBK"))
变量名.write(byte[] b, int off, int len)
byte[] b,1, 3
abcdef   ->   bcd
```

#### 缓冲流

> 缓存是IO的一种性能优化，缓存流为IO流增加了内存缓存区，

##### 字节缓冲流

```java
// 输出
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("路径"));
// 输入
BufferedInputStream bis = new BufferedInputStream(new FileInputStream("路径"));
```

##### 字符缓冲流

```java
// 输出
BufferedWriter bw = new BufferedWriter(new FileWriter("路径",true));
变量名 . newLine();    // 换行
// 输入
BufferedReader br = new BufferedReader(new FileReader("路径"));
变量名 . readLine();   // 每次读取一行  末尾为null
```

#### 转换流

> 转换流: 如果文件中英文混合 转换流可以完美的输入与输出,不会造成乱码

```java
// 字节输入流转换字符输入流 - 输入
new InputStreamReader(new FileInputStream("路径"), "gbk:指定的编码格式");
// 字符输出流转换字节输出流 - 输出
new OutputStreamWriter(new FileOutputStream("路径"), "gbk:指定的编码格式");
```

#### 打印流

> 只有输出流，没有输入流 | System.out，System.err是PrintStream的实例变量

```java
// 字节打印输出流
new PrintStream(new FileOutputStream("地址"));
// 字符打印输出流 - true:自动刷新
new PrintWriter(new FileWriter("地址"),true); 
// 不会换行 且会转换成对应的字符输出
pout.write(97); 
// 特有输出方法
pout.print(97); // 会直接输出不会转换 不会换行
pout.println("打印流 直接输出到文件"); // 会换行
```

#### 数据流

数据流只有字节流，没有字符流

数据流都是处理流，不是节点流

数据流只能操作基本数据类型和字符串，对象流还可以操作对象

数据流写入的是二进制数据，无法通过记事本查看

通过数据流写入的数据需要通过对应的数据输入流读取

#### 对象流

##### 序列化

> 对象流输出对象 - 序列对象-存档

new ObjectOutputStream(new FileOutputStream("地址"));

序列化名.writeObject(对象名);

##### 序列化对象

> 注意：在使用对象流操作对象时会报错 java.io.NotSerializableException，因为对象进行序列化和反序列化时实体类需要实现Serializable接口

```java
// 序列化-id | @SuppressWarnings("serial") // 压制序列化版本ID好的声明警告
// 指定序列号版本ID
private static final long serialversionUID = 1L;
// 序列化后会生成一个序列id号,修改对象后在反序列化时会不兼容报错 - 指定id号后则不会
// 成员常量不被序列化
transient 修饰
private  transient int 变量名;
```

##### 反序列化 

> 对象流输出对象 - 反序列对象-读档 获取的对象为object需要强转成对象类型

new ObjectInputStream(new FileInputStream("地址");

(对象类型)  反序列化名 .readObject();

#### properties 文件

> properties文件是数据为键值对格式的文件,这种文件跟文件的后缀没有关系,
>
> 只跟数据的存储形式有关
>
> 主要用于项目的信息配置

```java
// 创建属性对象
Properties props = new Properties();
// 将Properties的键和值写入文件 - 备注会转码
props.store(new FileOutputStream("地址"), "备注");
// 将文件的数据输入到Properties
props.load(new FileInputStream("地址"));

// 使用键输出对应的值
props.getProperty("键");
// 获取键
// 	Set<String> keys1 = props.stringPropertyNames();

// 作为map集合
// 添加文件 - 键和值对应
props.put("键","值");
// 获取键
Set<Object> keys = props.keySet();// 
```

### 多线程

进程:  程序分配资源最小单位为线程提供的容器,任何一个进程内部至少有一个线程--main主线程

多线程的作用:  充分利用CPU资源，提高程序的并行性，提高处理任务效率避免程序阻塞(blocked)-- 异步编程(不用等待)

**.run()与start()方法区别**

- run() - 代表线程要执行的任务,当使用线程对象调用时，不会开启新的线程，只是普通方法的调用
- start() - 会开启新的线程，由CPU的调度，来执行run()方法

#### 线程

> CPU调度的最小单元,多个线程共享进程内存资源线程必须依赖进程存在,线程是进程内部的一个程序的执行路径
>
> 参考: https://blog.csdn.net/AS011x/article/details/126931651

**获取线程名称**

> Thread.currentThread().getName()
>
> 线程方法一: 可省略成   getname() 或者  this.getname()
>
> 通过   线程名.getName() 修改线程名

**线程方法一: 继承Therad类**

> 通过构造方法传参修改线程名

![image-20220724125649982](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220724125649982.png)

**线程方法二: 实现 Runnable端口**

> 直接传参修改线程名  new Thread(对象名, "线程名");

![image-20220724125843307](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220724125843307.png)

**匿名内部方法一:  匿名继承-Thread类的内部类**

> 直接传参修改线程名  new Thread("线程名") {   @Override   };

![image-20220724125932361](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220724125932361.png)

**匿名内部方法二:  匿名继承-Thread类 实现-Runnable接口 的内部类**

![image-20220724125959763](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220724125959763.png)

#### 线程的生命周期

1. 新生(创建线程对象)  new Thread()
2. 就绪(调用线程对象的start方法,线程不会立马执行,线程需要去抢占cpu资源)
3. 运行(抢占到cpu资源)
4. 阻塞(线程运行的过程中释放cpu资源)
5. 死亡(线程的任务执行完毕后,进入死亡状态)

#### 线程优先级

优先级代表线程抢占到cpu资源的概率，不代表线程一定会优先执行

查看优先级:  Thread名 . getPriority();

**修改优先级 (1-10)**

```java
Thread名 . setPriority( 优先级 );

// 最小优先级
Thread.MIN_PRIORITY
// 最大优先级
Thread.MAX_PRIORITY
// 默认优先级
Thread.NORM_PRIORITY
```

#### 常用方法

```java
getName()--获取线程的名称
    run()-- 线程的运行代码方法
    start()--线程的启动方法
    getId()--获取线程的唯一标识
    ------------------------------------------------------------
    sleep()--线程的休眠 
    interrupt() --引发线程中断异常
    yield()--线程让步,释放cpu资源,重新抢占cpu资源,谁抢到谁执行
    join()--线程抢占,抢占cpu资源,指的是在那个线程里面调用该方法,就是让那个线程休眠
    让调用join()方法的线程先执行完毕
```

##### 线程的休眠 

Thread.sleep(毫秒值); 

> 必须指定毫秒时间值 ,   是一个静态方法 Thread.sleep()，必须使用try...catch处理InterruptException异常

##### 中断休眠的线程

Thread名 . interrupt();

> interrupt() --中断休眠的线程，引发InterruptException异常

##### 线程让步

线程的让步:   Thread.yield();

> 使得当前线程让出CPU资源，让具有相同优先级的线程来获取CPU的执行权，但是不是绝对，因为有可能没有比当前线程优先级高的线程，当前的让步线程会被再次选中执行.

##### 线程抢占

线程变量名 . join();

> A线程抢占B线程的CPU资源，线程B必须要等到线程A的代码全部执行完了才能继续执行

##### 线程安全

多个线程在共享数据时，极可能会出现数据不安全情形，也是多线程的安全问题

**互斥锁**

原理：保证在一段时间内只允许一个线程执行同步锁定代码

a. 同步代码块 (推荐)
b. 同步方法  -- 整个方法加锁

```java
// 同步 - java中关键字: 
synchronized( 对象 ){              }
// 互斥锁的使用方式：
1. Synchronized(this)  当前对象锁标记
2. Synchronized(任意对象) 任意对象的锁标记
3. Synchronized(类型.class) 类锁 
万物皆对象->万物皆是锁 -> 对象互斥锁
```

##### 线程的挂起

同步锁类型.wait() - 挂起  

必须在同步锁里且类型一致,如果同步锁类型为this那挂起可省略类型 -> wait()

挂起后再被唤醒时,会在挂起处开始执行而不是从头开始

##### 线程的唤醒

> 同步锁类型.notif - 随机唤醒  

必须在同步锁里且类型一致,如果同步锁类型为this那挂起可省略类型 -> notify()

> 同步锁类型.notifyAll- 全部唤醒  

必须在同步锁里且类型一致,如果同步锁类型为this那挂起可省略类型 -> notifyAll()

#### 死锁

> 同步锁使用的弊端：

当线程任务中出现了多个同步代码块(多个锁)时，如果同步代码块中嵌套了其他的同步代码块。这时容易引发一种现象：程序出现无限等待，这种现象我们称为死锁。这种情况能避免就避免掉。



### 网络编程

> 获取连接的客户端ip地址

服务端变量名.getInetAddress();

#### **TCP-协议**

#### 服务端:

1.创建服务器
	new ServerSocket(5000 - 端口);

2.等待客户端连接
	服务端变量名.accept();

3.流
	客户端的信息输出至服务端的输入 | 获取客户端名 .getInputStream()
	信息输出对应的客户端的输入 | 获取客户端名 .getInputStream()

4.关闭连接

#### 客户端:

1.创建客户端对象
	new Socket("127.0.0.1" - ip地址,5000 - 端口);

2.流
	创建输入流连接到 - 服务端的输出流  |  客户端名 .getInputStream()
	输入流放置在“流的末尾”  |  客户端名 . shutdownInput() 
	创建输出流连接到 - 服务端的输入流  |  客户端名 .getOutputStream()
	输出已结束  |  客户端名 .shutdownInput();
	解决服务端一值等待客户端输出数据

3.关闭连接
