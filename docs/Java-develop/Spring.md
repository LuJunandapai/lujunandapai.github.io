---
title: Spring_框架
date: 2023/04/26
---

#  Spring  框架



## Spring 介绍

> Spring是一个基于IOC反转控制(DI依赖注入）和**==AOP面向切面编程==** 容器框架（IOC主要是对对象进行解耦，AOP主要是对功能也就是对象里面的方法进行解耦）
>
> [高内聚低耦合](https://blog.csdn.net/weixin_44063225/article/details/111351977)
>
> 本机启动地址: http://localhost:8080

### Spring具体描述

> 1. **轻量级**：并不是说Spring的jar包有多大，而是说Spring是非侵入性的（即当用Spring时，不需要去实现Spring给提供的任何接口，不需要去继承它的任何     父类，可以享用它的功能）基于Spring开发的应用中的对象可以不依赖于Spring的API，侵入性举例就是在使用J2EE的编程时候，需要继承HttpServlet类。
> 2. **依赖注入** （DI---dependency  injection、IOC）
> 3. **面向切面编程**（AOP---aspect oriented programming）
> 4. **容器**：Spring是一个容器，因为它包含并且管理应用对象的生命周期
> 5. **框架**：Spring实现了使用简单的组件配置组合成一个复杂的应用。在Spring中可以使用XML和Java注解组合这些对象。
> 6. **一站式**：在IOC和AOP的基础上可以整合各种企业应用的开源框架（如Struts2、Hibernate、Mybatis）和优秀的第三方类库（实际上Spring自身也提供了展现层的Spring MVC和持久层的Spring JDBC），对按业务划分的三层架构(展现层、业务层、持久层)都有组件支持

### IOC 容器 概述

1. BeanFactory和ApplicationContext 都是容器接口，ApplicationContext 是BeanFactory的子接口
2. BeanFactory是Spring容器祖先，它是面向Spring框架。ApplicationContext 它是面向业务程序员的，它的子类功能更强大一点。
3. **BeanFactory读取配置，一开始不初始化对象，直到调用的时候初始化；ApplicationContext它是读取配置文件的时候，就把图纸上的所有对象全部创建，包括依赖关系**

### IOC 控制反转

> IOC 控制反转: 使用对象时，由主动new产生对象转换为由外部提供对象，此过程中对象创建控制权由程序转移到外部，此思想称为控制反转

### IOC 容器

> Spring提供了一个容器，称为IoC容器，用来充当IoC思想中的(外部
> IoC容器负责对象的创建、初始化等一系列工作，被创建或被管理的对象在IoC容器中统称为Bean



## 搭建Spring环境

### 1.引入spring核心依赖

**新建Maven项目，修改pom.xml文件，引入spring核心依赖** 

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.18</version>
    </dependency>
</dependencies>
```

### 2.修改业务层Spring调用方式

业务层代码调整一下，不生产持久层对象了，弄一个set方法传入持久层对象。

```java
public class UserServiceImpl implements IUserService {
    private IUserDao userDao;

    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void saveUser() {
        userDao.saveUser();
    }
}
```

### 3.spring配置文件 - xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--
        bean 标签：用于配置让 spring 创建对象，并且存入 ioc 容器之中
        id 属性：对象的唯一标识。
        class 属性：指定要创建对象的全类名，通过反射的方式，由Spring创建UserDaoImpl和UserServiceImpl对象
        name对应的是setXxx()中的xxx
        ref是指将为类中的引用类型的属性赋值
      -->

    <bean id="userdao" class="com.woniu.dao.UserDaoImpl" />
    <bean id="userservice" class="com.woniu.service.UserServiceImpl">
        <property name="userDao" ref="userdao" />
    </bean>

</beans>
```

### **4.测试调用**

```java
// 模拟表现层
public static void main(String[] args) {
    
    //1.创建Spring的IOC容器对象
    ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
    //2.从IOC容器中获取Bean实例
    IUserService userService = (IUserService) context.getBean("userservice");
    System.out.println(userService);
    //3.调用方法
    userService.saveUser();
}
```



## spring - 依赖注入

### bean 标签

```xml
<bean id=" ID名 " class=" 类全名 "></bean>
<bean id="TwoUserDao" class="com.apai.dao.TwoUserDao"></bean>
<bean id="UserService" class="com.apai.service.UserService">
    <property name="set xxx " ref=" bean的id名 "></property>
</bean>

<!--
    bean标签的作用：给spring提供信息，来初始化对象
        id：在spring容器的唯一标志
        class：全类名，提供spring容器，通过反射的方式来构造对象
        scope：prototype 多例， singleton 99%的情况都用单例；mvc里面的实例会用多例，但是我们会自己去new
        init-method：初始化方法
        destroy-method：销毁方法
    -->
```

### property 标签 set注入

原理: 是通过set方法进行注入赋值

property 标签 为 bean 标签的内部标签 

```xml
<bean id="User" class="com.apai.dao.User">
    <property name="name" value="小明"></property>
    <property name="age" value="20"></property>
    <property name="sex" value="男"></property>
</bean>

<!--

property标签属性:  原理是通过set方法进行赋值
	name="字段 或者 setxxx"  
	value="给name赋值"  配合name字段属性实现其赋值
	ref=" bean的id名 " 配合name实现控制反转 相对于new对象

    -->
```

### constructor-arg 标签 构造 注入

原理: 是通过构造方法进行注入赋值 必须写入有参构造方法

constructor-arg 标签 为 bean 标签的内部标签

```xml
<bean id="timedate" class="java.util.Date"/>
<bean id="Test" class="com.apai.entity.imp.Test">
    <constructor-arg name="name" value="小明"/>
    <constructor-arg name="age" value="18"/>
    <constructor-arg name="sex" value="男"/>
    <constructor-arg name="time" ref="timedate"/>
    <constructor-arg name="shengao" value="188"/>
</bean>
```

### bean 内部标签属性

```xml
<!-- 
	// 获取指定字段属性的位置
		index：按照参数位置来注入 从下标0开始起算
        type: 指定参数在构造函数中的数据类型 同类型则按顺序指定
		name: 指定参数在构造函数中的名称 用这个找给谁赋值

	// 根据指定字段进行赋值
		value：注入的值需要时基本数据类型和字符串 直接赋值
		ref：注入引用数据类型的值 如: Date类型 先获取在根据bean的id进行ref
			<bean id="timedate" class="java.util.Date"/>
-->
```

### 获取bean和对象

```java
public static void main(String[] args) {
    // 加载spring配置文件 获取bean的容器
    ApplicationContext applicationContext = new ClassPathXmlApplicationContext("apptest.xml");
    // 根据 bean 标签的 ID名 获取实例化对象
    TestImp test = (TestImp) applicationContext.getBean("Test");
    // 实例化对象 相对于 new 对象 可调用使用的方法
    test.testall();
}
// 调用 某个类的注入的方法
AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(类名.getClass());
Object getbbb = annotationConfigApplicationContext.getBean("方法的bean名");
```

### 使用 p 名称空间注入

此种方式是通过在 xml中导入 p名称空间，使用 p:propertyName 来注入数据，它的本质仍然是调用类中的 set 方法实现注入功能。

配置文件代码：注意 必须写入set方法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
   
    
    
    <bean id="timedate" class="java.util.Date"/>
    <bean id="Test" class="com.apai.entity.imp.Test" p:name="二哈" p:time-ref="timedate" p:age="25"></bean>
    
</beans>
```

### 集合注入

注意:

```text
1. 每一种集合注入 赋值时需加上对应类型的 标签(<list>) 然后再进行赋值 

2. <ref bean="ID名"></ref> 在赋值时使用直接使用已经数据注入的实体类
 
3. string类型的集合 在赋值时可直接使用 <value> 值 </value> 赋值
```

#### 1. List 集合 实体类注入

```xml
<bean id="user3" class="com.woniu.entity.User">
    <property name="id" value="3"></property>
    <property name="name" value="王五"></property>
</bean>
<bean id="collectionService" class="com.woniu.service.impl.CollectionServiceImpl">
    <property name="userList">
        <list>
            <bean class="com.woniu.entity.User">
                <property name="id" value="1"></property>
                <property name="name" value="张三"></property>
            </bean>
            <bean class="com.woniu.entity.User">
                <property name="id" value="2"></property>
                <property name="name" value="李四"></property>
            </bean>
            <ref bean="user3"></ref>
        </list>
    </property>
</bean>
```

#### 2.Set 集合 实体类注入

```xml
<!-- 对 userSet 的注入-->
<property name="userSet">
    <set>
        <bean class="com.woniu.entity.User">
            <property name="id" value="1"></property>
            <property name="name" value="张三"></property>
        </bean>
        <bean class="com.woniu.entity.User">
            <property name="id" value="2"></property>
            <property name="name" value="李四"></property>
        </bean>
        <ref bean="user3"></ref>
        <ref bean="user3"></ref>
    </set>
</property>
```

#### 3.Map 注入

```xml
<!-- 对 userMap 的注入-->
<property name="userMap">
    <map>
        <entry key="AA" value-ref="user3"></entry>
        <entry key="BB">
            <bean class="com.woniu.entity.User">
                <property name="id" value="1"></property>
                <property name="name" value="张三"></property>
            </bean>
        </entry>
    </map>
</property>
```

#### 4.Properties的注入

```xml
<!-- 对 props 的注入-->
<property name="props">
    <props>
        <prop key="AAA">aaa</prop>
        <prop key="BBB">bbb</prop>
    </props>
</property>
```





## 实例化Bean的三种方式

#### 一：使用默认的无参构造函数

```xml
<bean id="userDaoImpl" class="www.woniu.dao.UserDaoImpl"></bean>
    
<bean id="userService" class="www.woniu.service.UserServiceImpl">
	<property name="userDao" ref="userDaoImpl"></property>
</bean>
```

#### 二：Spring静态工厂

 - 使用静态工厂的方法创建对象

1. 第一步，创建静态工厂类

```java
public class StaticFactory {
    public static IUserService createUserService() {
        System.out.println("静态工厂创建实例");
        return new UserServiceImpl();
    }
}
```

2. 第二步，配置静态工厂类

```xml
<!-- 静态工厂创建对象的配置 -->
<bean id="userService2" class="www.woniu.util.StaticFactory" factory-method="createUserService"></bean>
```

3. 第三步，获取静态工厂类创建的对象

```java
//获取通过静态工厂创建的对象
IUserService userService2 = (IUserService) applicationContext.getBean("userService2");
System.out.println(userService2);
```

#### 三：Spring实例工厂 

- 使用实例工厂的方法创建对象

1. 第一步，创建实例工厂类

```java
public class MyFactoryBean {
    
    public IUserService createUserService() {
        System.out.println("实例工厂创建对象");
        return new UserServiceImpl();
    }
}
```

2. 第二步，配置实例工厂类

```xml
<!-- 实例工厂创建对象的配置-->
<bean id="myFactoryBean" class="www.woniu.util.MyFactoryBean"></bean>
<bean id="userService3" factory-bean="myFactoryBean" factory-method="createUserService"></bean>
```

3. 第三步，获取实例工厂类创建的对象

```java
//获取通过实例工厂创建的对象
IUserService userService3 = (IUserService) applicationContext.getBean("userService3");
System.out.println(userService3);
```

### FactoryBean 【了解】

BeanFactory 与 FactoryBean 的区别？

1. BeanFactory 是容器接口的祖先
2. FactoryBean 是初始化Bean对象的一种方式，凡是实现了这个接口的类，Spring会把这个类当成一个工厂(实例工厂)

第一步，创建FactoryBean的实现类

```java
public class MySpringFactoryBean implements FactoryBean<IUserService> {
    @Override
    public IUserService getObject() throws Exception {
        return new UserServiceImpl();
    }

    @Override
    public Class<?> getObjectType() {
        return IUserService.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

第二步，配置FactoryBean

```xml
<!-- FactoryBean创建对象的配置，属于实例工厂的范畴 -->
<bean id="userService4" class="www.woniu.util.MySpringFactoryBean"></bean>
```

第三步，获取FactoryBean方式创建的对象

```java
//获取通FactoryBean创建的对象
IUserService userService4 = (IUserService) applicationContext.getBean("userService4");
System.out.println(userService4);
```



## 自动装配

在Spring框架中，在配置文件中声明bean的依赖关系是一个很好的做法，因为Spring容器能够自动装配协作bean之间的关系。这称为spring自动装配。

自动装配是使用Spring满足bean依赖的一种方式，Spring会在应用中为某个bean寻找其依赖的bean。

自动装配功能具有四种模式。分别是 no，byName，byType和constructor。

* XML配置中的默认自动装配模式为no
* Java配置中的默认自动装配模式是byType

### **自动装配模式**

* no

  该选项是spring框架的默认选项，表示自动装配为关闭状态OFF。我们必须在bean定义中使用<property>标签显式设置依赖项。

* byName

  此选项启用基于bean名称的依赖项注入。在Bean中自动装配属性时，属性名称用于在配置文件中搜索匹配的Bean定义。如果找到这样的bean，则将其注入属性。如果找不到这样的bean，则会引发错误。

* byType

  此选项支持基于bean类型的依赖项注入。在bean中自动装配属性时，属性的类类型用于在配置文件中搜索匹配的bean定义。如果找到这样的bean，就在属性中注入它。如果没有找到这样的bean，就会引发一个错误。

* constructor

  通过构造函数自动装配与byType相似，仅适用于构造函数参数。在启用了自动装配的bean中，它将查找构造函数参数的类类型，然后对所有构造函数参数执行自动装配类型。请注意，如果容器中没有一个完全属于构造函数参数类型的bean，则会引发致命错误。

详细介绍: https://blog.csdn.net/weixin_44205087/article/details/123108269

### 案例介绍

实体类 有两个实体类的字段属性

```java
// 实体类 有两个实体类的字段属性
public class Test implements TestImp {
    private String name;
    private Integer age;
    private Date time;
    private String sex;
    private Integer shengao;
    
    private Dog dog; // 实体类 dog
    private Cat cat; // 实体类 cat
}
```

配置文件使用自动装配

```xml
// 实体类的配置
<bean id="dog" class="com.apai.entity.imp.Dog" p:dog="狗子"/>
<bean id="cat" class="com.apai.entity.imp.Cat" p:cat="小猫"/>
// 开启自动装配时 会自动检测实体类的字段 在配置里是否存在注入 存在则也会自动注入
<bean id="Test1" class="com.apai.entity.imp.Test" p:name="二哈" p:time-ref="timedate" autowire="byType"></bean>
```



## 基于注解的 IOC 配置

### **配置注解开启和注解Bean的扫描** 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 配置注解扫描 
			context:component-scan:专门扫描含有@Component注解的类，自动将其作为bean
			base-package：要扫描包的路径,包含子包,com.woniu 表示子包下的所有类定义注解都有效
			注解扫描配置的时候，会自动开启注解功能
	-->
    <context:component-scan base-package="com.woniu"/>
    
    ......
    
</beans>
```



### @Component 用于创建对象

@Component 相当于：<bean id="类名的全小写" class="类全名"> 作用于类

默认的id名未 类名的全小写 也可在自定义id名 @Component("id名")

### @Component 衍生子注解

作用及属性都是一模一样的, 他们只不过是提供了更加明确的语义化。

 @Controller ：一般用于表现层的注解。

 @Service ：一般用于业务层的注解。

 @Repository ：一般用于持久层的注解。

细节：如果注解中有且只有一个自定义bean的ID名属性要赋值时，且名称是 value ，value 在赋值是可以不写。

### 用于注入数据的注解

能够直接通过注解给类赋值 , 相当于：<property name="字段名" ref="值"> 作用于属性字段上

#### @Autowired

作用：自动按照类型注入。当使用注解注入属性时，set方法可以省略。

1. 当在spring容器里面找不到对象时，就报错
2. **当有多个对象匹配时，按属性名到spring容器中配对，如果找到就注入，找不到就报错**

#### @Value

作用： 注入基本数据类型和String 类型数据的

#### @Qualifier

作用：在自动按照类型注入的基础之上，再按照 Bean 的 id 注入。它在给字段注入时不能独立使用，必须和@Autowire 一起使用；但是给方法参数注入时，可以独立使用。

属性: value：指定 bean 的 id。

#### @Resource

 JSR-250标准（基于jdk），单独使用@Resource注解，表示先按照名称注入，会到spring容器中查找userDao的名称，对应<bean id="">，id的属性值，如果找到，可以匹配。

如果没有找到，则会按照类型注入，会到spring容器中查找IUserDao的类型，对应<bean class="">，class的属性值，如果找到，可以匹配，如果没有找到会抛出异常。



## spring --> mybatis

### 第一步：pom文件

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.apai</groupId>
    <artifactId>web-spring-1</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>web-spring-1 Maven Webapp</name>
    <!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
        <!--aop切面相关的包-->
		<dependency>
    		<groupId>org.springframework</groupId>
    		<artifactId>spring-aspects</artifactId>
    		<version>5.3.18</version>
		</dependency>
		<!--事务包-->
		<dependency>
    		<groupId>org.springframework</groupId>
    		<artifactId>spring-tx</artifactId>
    		<version>5.3.18</version>
		</dependency>
        <!--  测试 依赖  -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13</version>
            <scope>test</scope>
        </dependency>
        <!--spring-context：Spring 容器核心-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.3.18</version>
        </dependency>
        <!--spring-jdbc-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.3.18</version>
        </dependency>
        <!--mybatis-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus</artifactId>
            <version>3.4.3</version>
        </dependency>
        <!--mysql-connector-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.22</version>
        </dependency>
        <!--druid-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.2.5</version>
        </dependency>
        <!-- log4j 日志 -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.14.0</version>
        </dependency>
        <!-- lombok 实体类注释 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <optional>true</optional>
        </dependency>
        <!-- 测试 -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>RELEASE</version>
            <scope>compile</scope>
        </dependency>
        <!--pagehelper分页插件依赖-->
    	<dependency>
        	<groupId>com.github.pagehelper</groupId>
        	<artifactId>pagehelper</artifactId>
        	<version>5.2.0</version>
    	</dependency>
    </dependencies>

    <build>
        <resources>
            <resource>
                <!--映射文件位置 放在resources下则改成resources 否则会报找不到sql语句的错-->
                <!--<directory>src/main/resources</directory>-->
                <!--映射文件位置 放在java的mapper下则改成java 否则会报找不到sql语句的错-->
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                    <include>**/*.tld</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>
</project>

```

### 第二步：实体类注解

```java
// 需要在pom.xml添加依赖

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.16</version>
    <scope>compile</scope>
</dependency>
    
@Data  //相当于帮你写了以下方法 get set toString hashCode  equal
@NoArgsConstructor // 无参构造方法
@AllArgsConstructor // 全参构构造方法
```

### 第三步：数据访问层 映射文件

数据库sql语句注解

```xml
// 添加
	@Insert("")

// 删除
    @Delete("")

 // 修改
    @Update("")

// 查询所有
    @Select("")
```

### 第四步： 创建 Service 

1.表现层 根据业务层接口的class创建实例调用方法  而Service是 实现接口重写方法

2.Service 使用 @Service 注解 创建bean

3.创建数据访问层的类对象字段 使用 @Autowired 注解在配置文件赋值 相对于new

```java
// 先创建接口
public interface IUserService {
    public void addUser(User user);
}

// 实现接口 重写方法
// @Service注解，把UserServiceImpl纳入Spring容器管理
// @Autowired注解，去Spring容器里面查找UserDao类型的对象，设置进来
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserDao userDao;

    @Override
    public void addUser(User user) {
        userDao.addUser(user);
    }
}

```

### 第五步：配置spring文件

进行Spring 和 Mybatis 的整合配置 applicationContext.xml

将以前的核心配置文件 在spring容器里对应进行配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置扫描包-->
    <context:component-scan base-package="com.apai"></context:component-scan>

    <!--配置数据库连接池-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&amp;characterEncoding=utf8&amp;useSSL=false&amp;nullCatalogMeansCurrent=true&amp;serverTimezone=Asia/Shanghai"></property>
        <property name="username" value="root"></property>
        <property name="password" value="123456"></property>
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"></property>
    </bean>

    <!-- 配置sqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"></property>
        <!--注意: 别名包配置-->
        <property name="typeAliasesPackage" value="com.xxx.entity"></property>

        <!--注意: 指定xml文件的目录，如果它和Dao接口文件在一起，可以省略；如果不在一起，必须配置-->
        <!--<property name="mapperLocations" value="classpath:mapper/*.xml"></property>-->

        <!--配置Mybatis-->
        <property name="configuration">
            <bean class="org.apache.ibatis.session.Configuration">
                <!--配置日志框架-->
                <property name="logImpl" value="org.apache.ibatis.logging.log4j2.Log4j2Impl"></property>
            </bean>
        </property>

        <!--配置插件-->
        <property name="plugins">
            <array>
                <!-- 配置分页插件 -->
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <props>
                            <!--设置数据库类型-->
                            <prop key="helperDialect">mysql</prop>
                            <!--当传入的页数大于总页数时，会查询最后一页-->
                            <prop key="reasonable">true</prop>
                        </props>
                    </property>
                </bean>

            </array>
        </property>
    </bean>

    <!--注意: 配置dao扫描包-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
        <property name="basePackage" value="com.apai.dao"></property>
    </bean>
</beans>
```

### 第六步：表现层调用

```java
public class MainTest {
    public static void main(String[] args) {
        // 根据配置文件名获取
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        // 根据Service接口的class获取实例对象
        IUserService userService = applicationContext.getBean(IUserService.class);
		// 调用接口的方法
        .....
    }
}
```





## AOP 概述

### 什么是AOP

AOP：全称是 Aspect Oriented Programming 即：面向切面编程。

### AOP 的作用及优势

作用：在程序运行期间，不修改源码对已有方法进行增强。

优势：

* 减少重复代码

* 提高开发效率

* 维护方便

### AOP 的实现方式

使用动态代理技术

## XML 的 AOP 配置通知

### 环境搭建

#### **第一步：拷贝必备的 jar 包到工程的 lib 目录**

maven工程的依赖导入，在上一章项目基础上继续添加

```xml
<!--aop切面相关的包-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>5.3.18</version>
</dependency>
<!--事务包-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.3.18</version>
</dependency>
```

#### **第二步：创建 spring 的配置文件并导入约束**

此处要导入 aop 的约束

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">
    
       .....
    
</beans>
```

### 通知配置步骤

#### aop:config 声明 配置

```xml
    <!--配置切面-->
    <aop:config>
        <!--配置切入点(地点)-->
        <aop:pointcut id="pointcut1" expression="execution(* com.apai.service.impl.*.*(..))"/>

        <!--配置切面(包含：地点、时间、事件) aop:aspect id="ID名" ref="注解存入的beanID名 类名全小写" -->
        <aop:aspect id="txAdvice" ref="myTransactionManager">
            
            <!--method="方法名" pointcut-ref="切面ID名" -->
            <!--前置通知 method="方法名" pointcut-ref="切入点ID名" -->
            <aop:before method="beginTransaction" pointcut-ref="pointcut1"></aop:before>
            <!--后置通知-->
            <aop:after-returning method="commit" pointcut-ref="pointcut1"></aop:after-returning>
            <!--异常通知-->
            <aop:after-throwing method="rollback" pointcut-ref="pointcut1"></aop:after-throwing>
            <!--最终通知-->
            <aop:after method="release" pointcut-ref="pointcut1"></aop:after>

            <!--环绕通知-->
            <!--<aop:around method="round" pointcut-ref="pointcut1"></aop:around>-->
        </aop:aspect>

    </aop:config>
```

#### 环绕通知:

aop:around：用于配置环绕通知

* 属性：method：指定通知中方法的名称  pointcut：定义切入点表达式  pointcut-ref：指定切入点表达式的引用

​	说明： 它是 spring 框架为我们提供的一种可以在代码中手动控制增强代码什么时候执行的方式。

​	注意：通常情况下，环绕通知都是独立使用的

```xml
<aop:around method="logCreateTime" pointcut-ref="study"></aop:around>
```

```java
// ProceedingJoinPoint point 切入点 相对于增强的方法

public void logCreateTime(ProceedingJoinPoint point) throws Throwable {
       	// 增强的方法之前执行
    
        Object[] args = point.getArgs();
        point.proceed(args);

       // 增强的方法之后执行
}
```



#### 事务类

##### ConnectionUti:

保证在一个线程用的都是同一个 Connection

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class ConnectionUtils {

    @Autowired
    private DataSource dataSource;

    private ThreadLocal<Connection> connections = new ThreadLocal<>();

    public Connection getConnection() {
        try {
            Connection connection = connections.get();
            if (connection == null) {
                connection = dataSource.getConnection();
            }
            connections.set(connection);
            return connection;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void removeConnection() {
        connections.remove();
    }

}
```

##### MyTransactionManager

```java
import com.apai.util.ConnectionUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@Component
public class MyTransactionManager {

    @Autowired
    private ConnectionUtils connectionUtils;

    // 开启事务
    public void beginTransaction() {
        try {
            connectionUtils.getConnection().setAutoCommit(false);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 提交事务
    public void commit() {
        try {
            connectionUtils.getConnection().commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 回滚事务
    public void rollback() {
        try {
            connectionUtils.getConnection().rollback();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 释放连接
    public void release() {
        try {
            connectionUtils.getConnection().close();
            connectionUtils.removeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 环绕增强
    public Object round(ProceedingJoinPoint point) {
        // 定义返回值
        Object result = null;

        try {
            Object[] args = point.getArgs();
            //开启事务
            this.beginTransaction();
            //执行目标方法
            result = point.proceed(args);
            //提交事务
            this.commit();
        } catch (Exception e) {
            e.printStackTrace();
            //发送异常回滚
            this.rollback();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        } finally {
            // 释放资源
            this.release();
        }

        return result;
    }

}

```



### 切入点表达式说明

execution:匹配方法的执行(常用)

​	execution(表达式)

表达式语法：execution([修饰符] 返回值类型 包名.类名.方法名(参数))

写法说明：

* 全匹配方式：

~~~
 public void com.woniu.service.impl.UserServiceImpl.addUser(com.woniu.entity.User)
~~~

* 访问修饰符可以省略

~~~
void com.woniu.service.impl.UserServiceImpl.addUser(com.woniu.entity.User) 
~~~

* 返回值可以使用*号，表示任意返回值

~~~
* com.woniu.service.impl.UserServiceImpl.addUser(com.woniu.entity.User)
~~~

* 包名可以使用星号，表示任意包，但是有几级包，需要写几个星

~~~
* *.*.*.*.UserServiceImpl.addUser(com.woniu.entity.User)
~~~

* 使用..来表示当前包，及其子包

~~~
* com..UserServiceImpl.addUser(com.woniu.entity.User)
~~~

* 类名可以使用*号，表示任意类

~~~
* com..*.addUser(com.woniu.entity.User)
~~~

* 方法名可以使用*号，表示任意方法

~~~
* com..*.*(com.woniu.entity.User)
~~~

* 参数列表可以使用*，表示参数可以是任意数据类型，但是必须有参数

~~~
* com..*.*(*)
~~~

* 参数列表可以使用..表示有无参数均可，有参数可以是任意类型

~~~
* com..*.*(..)
~~~

* 全通配方式：

\* com..*.*(..)

~~~
* *..*.*(..)
~~~

注：通常情况下，我们都是对业务层的方法进行增强，所以切入点表达式都是切到业务层实现类。

~~~
execution(* com.woniu.service.impl.*.*(..))
~~~



## 注解的 AOP 配置通知

### **第一步：@Aspect**

​		**把通知类上使用注解配置使用  @Aspect  注解声明为切面**

### **第二步：通知配置**

​		**在通知类里的  增强的方法上 使用注解配置通知**

```java
@Aspect
public class MyTransactionManager {
	// 前置
    @Before("execution(* com.woniu.service.*.*(..))")
	// 后置
    @AfterReturning("execution(* com.woniu.service.*.*(..))")

    @AfterThrowing("execution(* com.woniu.service.*.*(..))")
    
    @After("execution(* com.woniu.service.*.*(..))")
    
    @Around("execution(* com.woniu.service.*.*(..))")
   
}
```

### **第三步：开启通知注解**

​		**在 spring 配置文件中开启 spring 对注解 AOP 的支持**

```xml
<!-- 开启 spring 对注解 AOP 的支持 -->
<aop:aspectj-autoproxy />
```



## spring配置数据源

### druid数据源

```xml
<!-- druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.5</version>
</dependency>
```

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="root" />
        <property name="password" value="123456" />
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver" />
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&amp;characterEncoding=utf8&amp;useSSL=false&amp;nullCatalogMeansCurrent=true&amp;serverTimezone=Asia/Shanghai" />
    </bean>
```

### 配置 spring 内置数据源

spring 框 架 也 提 供 了 一 个 内 置 数 据 源 ， 我 们 也 可 以 使 用 spring 的 内 置 数 据 源 ， 它 就 在spring-jdbc-5.3.18.jar 包中：

```xml
<bean id="dataSource2" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&amp;characterEncoding=utf8&amp;useSSL=false&amp;nullCatalogMeansCurrent=true&amp;serverTimezone=Asia/Shanghai"/>
    </bean>
```

### 将数据库信息配置外部

【定义属性文件:  jdbc.properties】

~~~
jdbc.driverClass=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=123456
~~~

【引入外部的属性文件】

一种方式:

```
<bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
    <property name="location" value="classpath:jdbc.properties" />
</bean>
```

另一种方:

```xml
// 获取外部连接信息
<context:property-placeholder location="classpath:jdbc.properties" />
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="username" value="${jdbc.username}" />
    <property name="password" value="${jdbc.password}" />
    <property name="driverClassName" value="${jdbc.driverClass}" />
    <property name="url" value="${jdbc.url}" />
</bean>
```



## Spring 事务

### **事务的隔离级别**

1. READ_UNCOMMITTED

   读未提交，即能够读取到没有被提交的数据，所以很明显这个级别的隔离机制无法解决脏读、不可重复读、幻读中的任何一种，因此很少使用

2. READ_COMMITED[Oracle默认]

   读已提交，即能够读到那些已经提交的数据，自然能够防止脏读，但是无法限制不可重复读和幻读

3. REPEATABLE_READ[MySQL默认]

   重复读取，即在数据读出来之后加锁，类似"select * from XXX for update"，明确数据读取出来就是为了更新用的，所以要加一把锁，防止别人修改它。REPEATABLE_READ的意思也类似，读取了一条数据，这个事务不结束，别的事务就不可以改这条记录，这样就解决了脏读、不可重复读的问题，但是幻读的问题还是无法解决

4. SERLALIZABLE

   串行化，最高的事务隔离级别，不管多少事务，挨个运行完一个事务的所有子事务之后才可以执行另外一个事务里面的所有子事务，这样就解决了脏读、不可重复读和幻读的问题了

### **事务的传播行为**

1. REQUIRED:如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。一般的选择（默认值）

2. SUPPORTS:支持当前事务，如果当前没有事务，就以非事务方式执行（没有事务）

3. MANDATORY：使用当前的事务，如果当前没有事务，就抛出异常

4. REQUERS_NEW:新建事务，如果当前在事务中，把当前事务挂起。

5. NOT_SUPPORTED:以非事务方式执行操作，如果当前存在事务，就把当前事务挂起

6. NEVER:以非事务方式运行，如果当前存在事务，抛出异常

7. NESTED:如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行 REQUIRED 类似的操作。

> NESTED 和 REQUIRED 修饰的内部方法都属于外围方法事务，如果外围方法抛出异常，这两种方法的事务都会被回滚。但是 REQUIRED 是加入外围方法事务，所以和外围事务同属于一个事务，一旦 REQUIRED 事务抛出异常被回滚，外围方法事务也将被回滚。而 NESTED 是外围方法的子事务，有单独的保存点，所以 NESTED 方法抛出异常被回滚，不会影响到外围方法的事务。
>
> NESTED 和 REQUIRES_NEW 都可以做到内部方法事务回滚而不影响外围方法事务。但是因为 NESTED 是嵌套事务，所以外围方法回滚之后，作为外围方法事务的子事务也会被回滚。而 REQUIRES_NEW 是通过开启新的事务实现的，内部事务和外围事务是两个事务，外围事务回滚不会影响内部事务。

**超时时间**

默认值是-1，没有超时限制。如果有，以秒为单位进行设置。

**是否是只读事务**

建议查询时设置为只读

### 基于 XML 的声明式事务

#### 环境搭建

 1、引入事务jar

```xml
<!--事务包-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.3.18</version>
</dependency>
```

3、引入事务命名空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!--配置事务管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!--配置事务通知-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <!-- 指定方法名称：是业务核心方法
          read-only：是否是只读事务。默认 false，不只读。
          isolation：指定事务的隔离级别。默认值是使用数据库的默认隔离级别。
          propagation：指定事务的传播行为。
          timeout：指定超时时间。默认值为：-1。永不超时。
          rollback-for：用于指定一个异常，当执行产生该异常时，事务回滚。产生其他异常，事务不回滚。没有默认值，任何异常都回滚。
          no-rollback-for：用于指定一个异常，当产生该异常时，事务不回滚，产生其他异常时，事务回滚。没有默认值，任何异常都回滚。
        -->

            <tx:method name="save*" propagation="REQUIRED" rollback-for="Exception" />
            <tx:method name="insert*" propagation="REQUIRED" rollback-for="Exception" />
            <tx:method name="add*" propagation="REQUIRED" rollback-for="Exception" />

            <tx:method name="delete*" propagation="REQUIRED" rollback-for="Exception" />
            <tx:method name="update*" propagation="REQUIRED" rollback-for="Exception" />

            <tx:method name="select*" propagation="SUPPORTS" read-only="true" />
            <tx:method name="all*" propagation="SUPPORTS" read-only="true" />
            <tx:method name="find*" propagation="SUPPORTS" read-only="true" />
            <tx:method name="get*" propagation="SUPPORTS" read-only="true" />
            <tx:method name="query*" propagation="SUPPORTS" read-only="true" />

        </tx:attributes>
    </tx:advice>
    <!--配置事务顾问-->
    <aop:config>
        <aop:pointcut id="servicePointcut" expression="execution(* com.apai.service.impl.*.*(..))" />
        <aop:advisor advice-ref="txAdvice" pointcut-ref="servicePointcut"></aop:advisor>
    </aop:config>
</beans>
```



## junit5

#### 配置步骤

**第一步 修改pom.xml，添加JUnit5依赖**

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.3.18</version>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.7.2</version>
    <scope>test</scope>
</dependency>
```

**第二步 创建测试类，使用注解完成** 

```java
import com.woniu.config.SpringConfig;
import com.woniu.entity.User;
import com.woniu.service.IUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
//@ContextConfiguration("classpath:applicationcontext.xml")
@ContextConfiguration(classes = SpringConfig.class)
public class JTest5 {
    @Autowired
    private IUserService userService;

    @Test
    public void test() throws Exception {
        userService.saveUser(new User(null, "张三", "001", LocalDateTime.now()));
    }
}
```

**使用一个复合注解替代上面两个注解完成整合 **

**可以使用组合注解@SpringJUnitConfig**

```java
import com.woniu.config.SpringConfig;
import com.woniu.entity.User;
import com.woniu.service.IUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.time.LocalDateTime;

// @SpringJUnitConfig(locations = "classpath:spring.xml")
// @SpringJUnitConfig(classes = SpringConfig.class)
@SpringJUnitConfig(pringConfig.class)
public class JTest5 {
    @Autowired
    private IUserService userService;

    @Test
    public void test() throws Exception {
        userService.saveUser(new User(null, "张三", "001", LocalDateTime.now()));
    }
}

```



# SpringMVC的简介

## SpringMVC概述

SpringMVC 是一种基于 Java 的实现 MVC 设计模型的请求驱动类型的轻量级 Web 框架，属于SpringFrameWork 的后续产品。

SpringMVC 已经成为目前最主流的MVC框架之一，并且随着Spring3.0 的发布，全面超越 Struts2，成为最优秀的 MVC 框架。它通过一套注解，让一个简单的 Java 类成为处理请求的控制器，而无须实现任何接口。同时它还支持 RESTful 编程风格的请求。

## SpringMVC快速入门

需求：客户端发起请求，服务器端接收请求，执行逻辑并进行视图跳转。

**开发步骤**

①导入SpringMVC相关坐标

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>SpringMVC</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>SpringMVC</name>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.target>16</maven.compiler.target>
        <maven.compiler.source>16</maven.compiler.source>
    </properties>

    <dependencies>
        <!-- spring-webmvc -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.18</version>
        </dependency>
        <!-- servlet-api -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.3.1</version>
            </plugin>
        </plugins>
    </build>
</project>
```

②在web.xml配置SpringMVC的核心控制器

```xml
<servlet>
    <servlet-name>DispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-mvc.xml</param-value>
    </init-param>
	<load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>   
    <servlet-name>DispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

> **/：代表拦截除后缀名以外的路径，即它只拦截路径，不拦截带后缀的url，若请求为/user/login.jsp，jsp不会进入DispatcherServlet类，即不会被过滤。但会拦截.jpg , .html 等静态文件。加入<mvc:default-servlet-handler>注解既可访问静态资源。**
>
> **/\*：代表拦截所有路径和后缀，会匹配所有的url，若请求为/user/login.jsp，会出现jsp进入DispatcherServlet类，导致找不到对应的controller，所以报404错误。**

③创建Controller类和视图页面

④使用注解配置Controller类中业务方法的映射地址

⑤创建spring-mvc.xml 在main目录下新建java和resources并标记为源文件夹 在resources目下下创建spring-mvc.xml 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                            http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd
                            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="com.apai"/>

    <!--配置内部资源视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>

    <!--  开启MVC注解 例如支持 @ResponseBody  -->
    <mvc:annotation-driven>
        <mvc:message-converters>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                <property name="supportedMediaTypes">
                    <list>
                        <value>application/json;charset=utf-8</value>
                    </list>
                </property>
            </bean>
        </mvc:message-converters>
    </mvc:annotation-driven>
    <!--  <mvc:annotation-driven/>  -->

    <!--  静态资源访问的开启  -->
    <mvc:default-servlet-handler/>
</beans>
```

⑥客户端发起请求测试





## SpringMVC的组件解析

1. **前端控制器：DispatcherServlet**

​    用户请求到达前端控制器，它就相当于 MVC 模式中的 C，DispatcherServlet 是整个流程控制的中心，由

它调用其它组件处理用户的请求，DispatcherServlet 的存在降低了组件之间的耦合性。

2. **处理器映射器：HandlerMapping**

​    HandlerMapping 负责根据用户请求找到 Handler 即处理器，SpringMVC 提供了不同的映射器实现不同的

映射方式，例如：配置文件方式，实现接口方式，注解方式等。

3. **处理器适配器：HandlerAdapter**

​    通过 HandlerAdapter 对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理

器进行执行。

4. **处理器：Handler**

​    它就是我们开发中要编写的具体业务控制器。由 DispatcherServlet 把用户请求转发到 Handler。由

Handler 对具体的用户请求进行处理。

5. **视图解析器：View Resolver**

​    View Resolver 负责将处理结果生成 View 视图，View Resolver 首先根据逻辑视图名解析成物理视图名，即具体的页面地址，再生成 View 视图对象，最后对 View 进行渲染将处理结果通过页面展示给用户。

6. **视图：View**

​    SpringMVC 框架提供了很多的 View 视图类型的支持，包括：jstlView、freemarkerView、pdfView等。最常用的视图就是 jsp。一般情况下需要通过页面标签或页面模版技术将模型数据通过页面展示给用户，需要由程序员根据业务需求开发具体的页面





## SpringMVC注解解析

#### @RequestMapping

* 作用：用于建立请求 URL 和处理请求方法之间的对应关系

* 位置：
  * 类上，请求URL 的第一级访问目录。此处不写的话，就相当于应用的根目录
  * 方法上，请求 URL 的第二级访问目录，与类上的使用@ReqquestMapping标注的一级目录一起组成访问虚拟路径

* 属性：
  * value：用于指定请求的URL。它和path属性的作用是一样的
  * method：用于指定请求的方式
  * params：用于指定限制请求参数的条件。它支持简单的表达式。要求请求参数的key和value必须和配置的一模一样

例如：

​		 params = {"accountName"}，表示请求参数必须有accountName

​      	params = {"moeny!100"}，表示请求参数中money不能是100

1.mvc命名空间引入

```xml
命名空间：xmlns:context="http://www.springframework.org/schema/context"
        xmlns:mvc="http://www.springframework.org/schema/mvc"
约束地址：http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc 
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
```

2. 组件扫描

SpringMVC基于Spring容器，所以在进行SpringMVC操作时，需要将Controller存储到Spring容器中，如果使用@Controller注解标注的话，就需要使用<context:component-scan base-package=“com.itheima.controller"/>进行组件扫描。

#### SpringMVC的XML配置

SpringMVC有默认组件配置，默认组件都是DispatcherServlet.properties配置文件中配置的，该配置文件地址org/springframework/web/servlet/DispatcherServlet.properties，该文件中配置了默认的视图解析器，如下：

```properties
org.springframework.web.servlet.ViewResolver=org.springframework.web.servlet.view.InternalResourceViewResolver
```

翻看该解析器源码，可以看到该解析器的默认设置，如下：

```properties
REDIRECT_URL_PREFIX = "redirect:"  --重定向前缀
FORWARD_URL_PREFIX = "forward:"    --转发前缀（默认值）
prefix = "";     --视图名称前缀
suffix = "";     --视图名称后缀
```

InternalResourceViewResolver的buildView返回view，view的rend渲染页面

#### 视图解析器

我们可以通过属性注入的方式修改视图的的前后缀 在esources目下下创建spring-mvc.xml 里加入

```xml
<!--配置内部资源视图解析器-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
  <property name="prefix" value="/WEB-INF/views/"></property>
  <property name="suffix" value=".jsp"></property>
</bean>
```



# SpringMVC的数据响应

01-SpringMVC的数据响应-数据响应方式(理解)

1)	页面跳转

​		直接返回字符串

​		通过ModelAndView对象返回

2） 回写数据 

​		直接返回字符串

​		返回对象或集合  

02-SpringMVC的数据响应-页面跳转-返回字符串形式（应用）

![image-20220411232952335](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/gnqeqo-0.png)

## 页面跳转 - 方式三

前提需在esources目下下创建spring-mvc.xml 里加上 视图解析器 和 配置注解扫描

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class QuickController {

    // 1.方式一:直接跳转  服务端转发
    @RequestMapping("/quick")
    public String quickMethod(){
        System.out.println("quickMethod running.....");
        return "forward:/index.jsp";
    }

    // 2.方式二:SpringMVC的数据响应-页面跳转-返回ModelAndView
    @RequestMapping(value="/quick2")
    public ModelAndView save2(){
        ModelAndView modelAndView = new ModelAndView();
        //设置模型数据
        modelAndView.addObject("username","方式二跳转");
        //设置视图名称
        modelAndView.setViewName("success");
        return modelAndView;
    }

    // 3.方式三: 根据设置的配置文件开头和结尾拼接jsp文件跳转
    @RequestMapping(value="/quick5")
    public String save5(HttpServletRequest request){
        request.setAttribute("username","方式三跳转");
        return "success";
    }
    
    // 执行该路径 相对于一次请求并执行 还可以在后面带上请求参数
	return "redirect:/user/userList?参数名=参数";

}
```

##  回写数据 - 3.1

```xml
// java对象转换成json格式的字符串  json转换工具jackson进行转换依赖坐标
<!-- jackson -->
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.12.5</version>
</dependency>
```

```xml
// 将实体类对象类型的集合直接进行回显  期望SpringMVC自动将User转换成json格式的字符串
// resources目下下创建spring-mvc.xml 添加配置

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                            http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd
                            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="com.apai"/>

    <!--配置内部资源视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>

        <mvc:annotation-driven>
        <mvc:message-converters>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                <!--<property name="supportedMediaTypes">
                    <list>
                        <value>application/json;charset=utf-8</value>
                    </list>
                </property>-->
            </bean>
        </mvc:message-converters>
    <!--或者-->   
    </mvc:annotation-driven>

</beans>
```

```java
// 中文乱码

// 字符串中文
response.setContentType("text/plain;charset=UTF-8");

// json
response.setContentType("application/json;charset=utf-8");
```

```java
	// 1. SpringMVC的数据响应-回写数据-直接回写字符串(应用)
	@RequestMapping(value="/quick6")
    public void save6(HttpServletResponse response) throws IOException {
        response.getWriter().print("hello woniu");
    }

    @RequestMapping(value="/quick7")
    @ResponseBody  //告知SpringMVC框架 不进行视图跳转 直接进行数据响应
    public String save7() throws IOException {
        return "hello woniu";
    }

	// 2. SpringMVC的数据响应-回写数据-直接回写json格式字符串(应用)
	// 2.1 直接回写json格式字符串 使用转换jar包依赖
    @RequestMapping(value="/quick8")
    @ResponseBody
    public String save8() throws IOException {
        return "{\"username\":\"zhangsan\",\"age\":18}";
    }


	// 3. SpringMVC的数据响应-回写数据-返回对象或集合(应用)
	// 3.1 将实体类对象类型的集合转换json字符串回显
    @RequestMapping(value="/quick9")
    @ResponseBody
    public String save9() throws IOException {
        ArrayList<User> userArraylist = new ArrayList<>();

        User user = new User();
        user.setUsername("zhangsan");
        user.setBirthday(LocalDateTime.now());

        userArraylist.add(user);

        User user2 = new User();
        user2.setUsername("lisi");
        user2.setBirthday(LocalDateTime.now());

        userArraylist.add(user2);

        //使用json的转换工具将对象转换成json格式字符串在返回  中文存在乱码现象
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(userArraylist);
        return json;
    }

	// 3.1 将实体类对象类型的集合直接进行回显  期望SpringMVC自动将User转换成json格式的字符串
	// <mvc:annotation-driven/> 需要在resources目下下创建spring-mvc.xml 添加配置
    @RequestMapping(value="/quick10")
    @ResponseBody
    public ArrayList<User> save10() throws IOException {

        ArrayList<User> userArraylist = new ArrayList<>();

        User user = new User();
        user.setUsername("zhangsan");
        user.setBirthday(LocalDateTime.now());

        userArraylist.add(user);

        User user2 = new User();
        user2.setUsername("lisi");
        user2.setBirthday(LocalDateTime.now());

        userArraylist.add(user2);
        return userArraylist;
    }
```

## SpringMVC的请求

注意: 时间类型 因为类型的特殊 需要加上对应的四个注解

```java
    @JsonDeserialize(using = LocalDateTimeDeserializer.class) //自己使用反序列化时使用
    @JsonSerialize(using = LocalDateTimeSerializer.class)	  //自己使用序列化时使用用
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")	//接收参数时使用
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")		//返回结果时使用
    private LocalDateTime birthday;
```

```java
// 方式一: SpringMVC的请求-获得请求参数-获得基本类型参数(应用)
// Controller中的业务方法的参数名称要与请求参数的name一致，参数值会自动映射匹配。并且能自动做类型转换；
// 自动的类型转换是指从String向其他类型的转换
@RequestMapping(value="/quick11")
@ResponseBody
public void save11(String username,int age) throws IOException {
    System.out.println(username);
    System.out.println(age);
}


// 方式二: SpringMVC的请求-获得请求参数-获得POJO实体类类型参数(应用)
// Controller中的业务方法的POJO参数的属性名与请求参数的name一致，参数值会自动映射匹配。
@RequestMapping(value="/quick12")
@ResponseBody
public void save12(User user) throws IOException {
    System.out.println(user);
}


// 方式三: SpringMVC的请求-获得请求参数-获得数组类型参数(应用)
// Controller中的业务方法数组名称与请求参数的name一致，参数值会自动映射匹配。
@RequestMapping(value="/quick14")
@ResponseBody
public void save13(String[] hobby) throws IOException {
    System.out.println(Arrays.asList(hobby));
}


// 方式四: SpringMVC的请求-获得请求参数-获得集合类型参数1(应用)
// 获得集合参数时，要将创建类 有一个集合 参数为实体类类型的字段才可以 在接收时使用该类接收。
@RequestMapping(value="/quick15")
@ResponseBody
public void save14(UserVo vo) throws IOException {
    System.out.println(vo);
}
// 例如: 
<form action="${pageContext.request.contextPath}/user/quick15" method="post">
    <%--表明是第一个User对象的username age--%>
    <input type="text" name="userList[0].username"><br/>
    <input type="text" name="userList[0].age"><br/>
    <input type="text" name="userList[1].username"><br/>
    <input type="text" name="userList[1].age"><br/>
    <input type="submit" value="提交">
</form>

    
// 方式五: SpringMVC的请求-获得请求参数-获得集合类型参数2(应用)
// 当使用ajax提交时，可以指定contentType为json形式，那么在方法参数位置使用 | @RequestBody可以直接接收集合数据而无需使用POJO进行包装
// 注意：@RequestBody接受json参数，提交方式一定是post，不能是get   
@RequestMapping(value="/quick15")
@ResponseBody
public void save15(@RequestBody List<User> userList) throws IOException {
    System.out.println(userList);
}
// 例如:
<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script>
    function verfityUserCode(){
        var userList = new Array();
        userList.push({username:"zhangsan",age:18});
        userList.push({username:"lisi",age:28});
        alert("Ssdds");
        $.ajax({
            type:"POST",
            url:"${pageContext.request.contextPath}/quick15",
            data:JSON.stringify(userList),
            contentType:"application/json;charset=utf-8",
            success:function (data) {
                alert(data);
            }
        });
    }
</script>
<button onclick="verfityUserCode()">测试</button>
```

### 参数名称不一致

当请求的参数名称与Controller的业务方法参数名称不一致时，就需要通过@RequestParam注解显示的绑定

```jsp
<form action="${pageContext.request.contextPath}/quick19" method="post">
    <input type="text" name="name"><br>
    <input type="submit" value="提交"><br>
</form>
```

```java
// @RequestParam(value="表单的name",required = false - 是否传参,defaultValue = "默认值"
@RequestMapping(value="/quick19")
@ResponseBody
public void save16(@RequestParam(value="name",required = false,defaultValue = "默认值") String username) throws IOException {
    System.out.println(username);
}
```

### Restful 风格的参数的获取

Restful是一种软件架构风格、设计风格，而不是标准，只是提供了一组设计原则和约束条件。主要用于客户端和服务器交互类的软件，基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存机制等。

Restful风格的请求是使用“url+请求方式”表示一次请求目的的，HTTP 协议里面四个表示操作方式的动词如下：

GET：用于获取资源         /user/1    GET ：       得到 id = 1 的 user

POST：用于新建资源		/user       POST：      新增 user

PUT：用于更新资源			/user/1    PUT：       更新 id = 1 的 user

DELETE：用于删除资源    	/user/1   DELETE：  删除 id = 1 的 user

上述url地址/user/1中的1就是要获得的请求参数，在SpringMVC中可以使用占位符进行参数绑定。地址/user/1可以写成/user/{id}，占位符{id}对应的就是1的值。在业务方法中我们可以使用@PathVariable注解进行占位符的匹配获取工作。

```java
@RequestMapping(value="/quick17/{name}")
@ResponseBody
 public void save17(@PathVariable(value="name") String username) throws IOException {
        System.out.println(username);
 }
```

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="http:// jquery.com/jquer-2.1.1.min.js"></script>
</head>
<body>
<script>
    $(function (){
        $.ajax({ url: "/quick22/可莉", method:'delete', success: function (){
            }})
    });
</script>
</body>
</html>
```



### 自定义类型转换器

日期类型的数据就需要自定义转换器。

方式一: 直接使用注解

```java
@RequestMapping(value="/quick21")
@ResponseBody
public void save21(@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime dateTime) throws IOException {
    System.out.println(dateTime);
}
```

方式二:  时间的自定义转换器

```java
package com.igeek.mybatisTest.converter;


import org.springframework.core.convert.converter.Converter;
import java.time.LocalDateTime;

public class LocalDateTimeConverter implements Converter<String, LocalDateTime> {

    @Override
    public LocalDateTime convert(String source) {
       //默认格式  2022-04-12T11:18:00
        //LocalDateTime date = LocalDateTime.parse(source);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime date = LocalDateTime.parse(source, fmt);
        return date;
    }
}
```

```java
@ResponseBody
public void save21(LocalDateTime dateTime) throws IOException {
    System.out.println(dateTime);
}
```

注册自定义类型转换器

```xml
<!-- 转换器配置 -->
<bean id="conversionService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
    <property name="converters">
        <set>
            <bean class="com.woniu.SpringMVC.converter.LocalDateTimeConverter" />
        </set>
    </property>
</bean>

<mvc:annotation-driven conversion-service="conversionService" />
```

### 获得Servlet相关API

SpringMVC支持使用原始ServletAPI对象作为控制器方法的参数进行注入，常用的对象如下：

HttpServletRequest     HttpServletResponse     HttpSession

```java
@RequestMapping(value="/quick22")
@ResponseBody
public void save22(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws IOException {
    System.out.println(request);
    System.out.println(response);
    System.out.println(session);
}
```

### 获得请求头信息

使用@RequestHeader可以获得请求头信息，相当于web阶段学习的request.getHeader(name)

@RequestHeader注解的属性如下：

​	value：请求头的名称

​	required：是否必须携带此请求头

```java
@RequestMapping(value="/quick23")
@ResponseBody
public void save23(@RequestHeader(value = "User-Agent",required = false) String user_agent) throws IOException {
    System.out.println(user_agent);
}
```

使用@CookieValue可以获得指定Cookie的值

@CookieValue注解的属性如下：

​	value：指定cookie的名称

​	required：是否必须携带此cookie

```java
@RequestMapping(value="/quick24")
@ResponseBody
public void save24(@CookieValue(value = "JSESSIONID") String jsessionId) throws IOException {
    System.out.println(jsessionId);
}
```



## 静态资源访问的开启

当有静态资源需要加载时，比如jquery文件，通过谷歌开发者工具抓包发现，没有加载到jquery文件，原因是SpringMVC的前端控制器DispatcherServlet的url-pattern配置的是/,代表对所有的资源都进行过滤操作，我们可以通过以下两种方式指定放行静态资源：

- 在spring-mvc.xml配置文件中指定放行的资源

​     `<mvc:resources mapping="/js/**" location="/js/"/>`

- 使用`<mvc:default-servlet-handler/>`标签

配置<mvc:default-servlet-handler />后，会在Spring MVC上下文中定义一个org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler，它会像一个检查员，对进入DispatcherServlet的URL进行筛查，如果发现是静态资源的请求，就将该请求转由Web应用服务器默认的Servlet处理，如果不是静态资源的请求，才由DispatcherServlet继续处理

```xml
<!--开发资源的访问-->
<!--<mvc:resources mapping="/js/**" location="/js/"/>
    <mvc:resources mapping="/img/**" location="/img/"/>-->

<mvc:default-servlet-handler/>
```

## 配置全局乱码过滤器

配置在: web.xml      当post请求时，数据会出现乱码，我们可以设置一个过滤器来进行编码的过滤。

```xml
<!--配置全局过滤的filter 并设置解码字符集 网页的编码和后台的解码不一致则导致乱码-->
    <filter>
        <filter-name>CharacterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CharacterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```



## SpringMVC的文件上传

文件上传 步骤

1. pom.xml 添加依赖

```xml
<!-- commons-fileupload -->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>
```

2. spring-mvc.xml 配置多媒体解析器

```xml
<!-- 文件上传,id必须设置为multipartResolver -->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 设置文件上传大小 -->
    <property name="maxUploadSize" value="5000000" />
</bean>
```

3. 文件上传-单文件上传

完成文件上传

```java
@RequestMapping(value="/quick22")
@ResponseBody
public void save22(String username, MultipartFile uploadFile) throws IOException {
    System.out.println(username);
    //获得上传文件的名称
    String originalFilename = uploadFile.getOriginalFilename();
    uploadFile.transferTo(new File("D:\\"+originalFilename));
}

// 扩展:
    // 上传文件处理
    // 文件名称
    String originalFilename = idPicPath1.getOriginalFilename();
    // 文件存储位置
    String rootPath = "C:/Users/Lujun/Documents/IDEA/Spring/springMVC-03/src/main/webapp/upload/";
    // 随机拼接的名字
    String fileName = System.currentTimeMillis() + "-" + originalFilename;
    // 根据文件位置 与 随机拼接的名字 组成访问路径进行存储
    idPicPath1.transferTo(new File(rootPath + fileName));
```

4. 文件上传-多文件上传的代码实现(应用)

多文件上传，只需要将页面修改为多个文件上传项，将方法参数MultipartFile类型修改为MultipartFile[]即可

```jsp
<form action="${pageContext.request.contextPath}/quick23" method="post" enctype="multipart/form-data">
        名称<input type="text" name="username"><br/>
        文件1<input type="file" name="uploadFile"><br/>
        文件2<input type="file" name="uploadFile"><br/>
        <input type="submit" value="提交">
    </form>
```

```java
@RequestMapping(value="/quick23")
@ResponseBody
public void save23(String username, MultipartFile[] uploadFile) throws IOException {
    System.out.println(username);
    for (MultipartFile multipartFile : uploadFile) {
        String originalFilename = multipartFile.getOriginalFilename();
        multipartFile.transferTo(new File("D:\\"+originalFilename));
    }
}
```

## SpringMVC的拦截器

#### 01-拦截器的作用

Spring MVC 的拦截器类似于 Servlet  开发中的过滤器 Filter，用于对处理器进行预处理和后处理。将拦截器按一定的顺序联结成一条链，这条链称为拦截器链（InterceptorChain）。在访问被拦截的方法或字段时，拦截器链中的拦截器就会按其之前定义的顺序被调用。拦截器也是AOP思想的具体实现。

#### 02-interceptor和filter区别

关于interceptor和filter的区别，如图所示：

![image-20220412120911223](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/gnuc5n-0.png)

#### 03-快速入门

自定义拦截器很简单，只有如下三步：

①创建拦截器类实现HandlerInterceptor接口

②配置拦截器

③测试拦截器的拦截效果

编写拦截器：

```java
public class MyInterceptor1 implements HandlerInterceptor {
    //在目标方法执行之前 执行
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException {
        System.out.println("preHandle.....");
}
    //在目标方法执行之后 视图对象返回之前执行
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
System.out.println("postHandle...");
    }
    //在流程都执行完毕后 执行
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        System.out.println("afterCompletion....");
    }
}
```

配置：在SpringMVC的配置文件中配置

```xml
<!--配置拦截器-->
<mvc:interceptors>
    <mvc:interceptor>
        <!--对哪些资源执行拦截操作-->
        <mvc:mapping path="/**"/>
        <bean class="com.woniu.interceptor.MyInterceptor1"/>
    </mvc:interceptor>
    ....
    <mvc:interceptor>
            <!--对哪些资源执行拦截操作-->
            <mvc:mapping path="/**"/>
            <bean class="com.woniu.interceptor.MyInterceptor2"/>
        </mvc:interceptor>
</mvc:interceptors>
```

编写测试程序测试：

结论：

当拦截器的preHandle方法返回true则会执行目标资源，如果返回false则不执行目标资源

多个拦截器情况下，配置在前的先执行，配置在后的后执行

拦截器中的方法执行顺序是：preHandler-------目标资源----postHandle---- afterCompletion

```java
@ControllerAdvice
public class GlobalException {
    /**
     * java.lang.ArithmeticException
     * 该方法需要返回一个 ModelAndView：目的是可以让我们封装异常信息以及视
     * 图的指定
     * 参数 Exception e:会将产生异常对象注入到方法中
     */
    @ExceptionHandler(value = {ArithmeticException.class})
    public ModelAndView arithmeticExceptionHandler(Exception e) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("error", e.toString());
        mv.setViewName("error1");  // 发生异常 跳转至 error1.html 页面
        return mv;
    }

    /**
     * java.lang.NullPointerException
     * 该方法需要返回一个 ModelAndView：目的是可以让我们封装异常信息以及视
     * 图的指定
     * 参数 Exception e:会将产生异常对象注入到方法中
     */
    @ExceptionHandler(value = {NullPointerException.class})
    public ModelAndView nullPointerExceptionHandler(Exception e) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("error", e.toString());
        mv.setViewName("error2"); // 发生空指针异常 跳转至 error2.html 页面
        return mv;
    }
    
    /**
     * 发生异常 会打印返回map异常 打印出异常信息
     */
    @ExceptionHandler(value = {Exception.class})
    public Map<String, Object> exceptionHandler(Exception e) {
        Map<String, Object> map = new HashMap<>();
        map.put("code", 500);
        map.put("error", e.getClass());
        return map;
    }
}
```





# SpringBoot  异常处理

> 发生异常时 可跳转到自定义的异常页面 或者 发送具体的异常报错信息
>
> 注意: 需要有跳转页面的配置 app内 使用 jsp 或者 Thymeleaf 在pos.xml 添加启动器依赖
>
> 在src/main/resources/ templates创建error.html页面 （使用thymeleaf）

## @ControllerAdvice方式

> config 功能包下创建 GlobalException 异常类

> 自定义一个类GlobalException，并添加注解 @ControllerAdvice，或者@RestControllerAdvice， 在处理异常的方法上面添加@ExceptionHandler注解并在value中添加要处理的异常

```java
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

    /**
     * java.lang.ArithmeticException
     * 该方法需要返回一个 ModelAndView：目的是可以让我们封装异常信息以及视
     * 图的指定
     * 参数 Exception e:会将产生异常对象注入到方法中
     */
    @ExceptionHandler(value = {ArithmeticException.class})
    public ModelAndView arithmeticExceptionHandler(Exception e) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("error", e.toString());
        mv.setViewName("error1");
        return mv;
    }

    /**
     * java.lang.NullPointerException
     * 该方法需要返回一个 ModelAndView：目的是可以让我们封装异常信息以及视
     * 图的指定
     * 参数 Exception e:会将产生异常对象注入到方法中
     */
    @ExceptionHandler(value = {NullPointerException.class})
    public ModelAndView nullPointerExceptionHandler(Exception e) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("error", e.toString());
        mv.setViewName("error2");
        return mv;
    }

    /**
     * 发生异常 会打印返回异常 打印出异常信息
     */
    @ExceptionHandler(value = {Exception.class})
    public Map<String, Object> exceptionHandler(Exception e) {
        Map<String, Object> map = new HashMap<>();
        map.put("code", 500);
        map.put("error", e.getClass());
        return map;
    }

}
```







# ----------  内容补充  ---------

# Spring  boot 补充

## Spring  boot 项目的环境

在默认的 application.yml  配置文件指定调用的环境配置

```yml
spring:
  application:
    name: Moduletow
  profiles:
    active: dev
```

* application-dev.yml  |  开发环境
* application-test.yml    |  测试环境
* application-proc.yml  |  生产环境

## Spring  boot 默认的配置文件

> Spring  boot 默认的配置文件 有三种 他们的有着不同的优先级

* application.properties
* application.yml
* bootstrap.yml

**优先级: application.properties  >  bootstrap.yml  >  application.yml**

> 实质: Spring  boot 的配置文件 的优先级是与类加载器有关

**类加载器:** 

* bootstrapclassloader 

* extentionclassloader 

* appLicationclassload 

* 自定义类加载器

过程:   hello.java ---> 编译java.class (java的字节码文件)  ---->  有类加获器帮你加裁到内东  ---->  对象堆 --  java的即时编译器编译  ---->  java即时优化器去优化  ----->  cpu执行

## 调用配置数据

**获取配置 端口**

```java
@Value("${server.port}")
private String port;

@GetMapping("/port")
public String port() {
    return "端口为: " + port;
}
```

## Spring  boot 注解

Spring  boot 注解 是依赖于 web 依赖 

```xml
<!--web-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**防坑指南**

* 所有的注解依赖于 启动类 扫描
* 启动类 只会扫描同级的目录下的类
* 当不在同同层时 必须在配置指定

```yml
# resources包下的 META-INF包下的 spring.factories文件
# org.springframework.cloud.bootstrap.BootstrapConfiguration= 该类的路径
org.springframework.cloud.bootstrap.BootstrapConfiguration=comx.woniu.utils.ResponseResult
```



# Spring 注解总汇

## 一.创建对象注解

```java
@Component 相当于：<bean id="类名的全小写" class="类全名"> 作用于类
		默认的id名未 类名的全小写 也可在自定义id名 @Component("id名")
    
@Component 衍生子注解 作用及属性都是一模一样的, 他们只不过是提供了更加明确的语义化。
	@Controller ：一般用于表现层的注解。
	@Service ：一般用于业务层的注解。
	@Repository ：一般用于持久层的注解。
细节：如果注解中有且只有一个自定义bean的ID名属性要赋值时，且名称是 value ，value 在赋值是可以不写。
```

## 二.注入数据的注解

```java
@Autowired  作用：自动按照类型注入。当使用注解注入属性时，set方法可以省略。
	1. 当在spring容器里面找不到对象时，就报错
	2. 当有多个对象匹配时，按属性名到spring容器中配对，如果找到就注入，找不到就报错**

@Value  作用： 注入基本数据类型和String 类型数据的

@Qualifier  
    作用：在自动按照类型注入的基础之上，再按照 Bean 的 id 注入。它在给字段注入时不能独立使用，必须和@Autowire 一起使用；但是给方法参数注入时，可以独立使用。
	属性: value：指定 bean 的 id。

@Resource
	JSR-250标准（基于jdk），单独使用@Resource注解，表示先按照名称注入，会到spring容器中查找userDao的名称，对应<bean id="">，id的属性值，如果找到，可以匹配。
	如果没有找到，则会按照类型注入，会到spring容器中查找IUserDao的类型，对应<bean class="">，class的属性值，如果找到，可以匹配，如果没有找到会抛出异常。
```

## 三.spring 新注解配置

```java
@Configuration
	作用：spring 的配置类，相当于 bean.xml 文件
	用于指定当前类是一个 spring 配置类，当创建容器时会从该类上加载注解。
    获取容器时需要使用AnnotationApplicationContext(有@Configuration 注解的类.class)。 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	属性： value:用于指定配置类的字节码
        
@ComponentScan
	作用：用于指定 spring 在初始化容器时要扫描的包。作用和在 spring 的 xml 配置文件中的：<context:component-scan base-	package="com "/> 是一样的 @ComponentScan(basePackages = "com.woniu")
	属性： basePackages：用于指定要扫描的包。和该注解中的 value 属性作用一样
        
@Bean
	作用 ： 该注解只能写在方法上，表明使用此方法创建一个对象，并且放入 spring 容器。
	属性： name：给当前@Bean 注解方法创建的对象指定一个名称(即 bean 的 id）。
                                      
@PropertySource
	作用： 用于加载.properties 文件中的配置。例如我们配置数据源时，可以把连接数据库的信息写到properties 配置文件中，就可以使用此注解指定 properties 配置文件的位置
	属性：value[]：用于指定 properties 文件位置。如果是在类路径下，需要写上 classpath:
	在resources根目录下创建jdbc.properties
                                      
@Import
	作用：用于导入其他配置类，在引入其他配置类时，可以不用再写@Configuration 注解。当然，写上也没问题
	属性：value[]：用于指定其他配置类的字节码
```

## 四.junit5注解

```java
// 每次表现层获取实例化对象都需使用可使用junit5注解代替 前提: 导入对应依赖
ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfig.class);
UserService userService = (UserService)ac.getBean("userService");

// 方法一:
	@ExtendWith(SpringExtension.class)
	@ContextConfiguration("classpath:applicationcontext.xml") 
	// 或者
	@ContextConfiguration(classes = SpringConfig.class)

// 方法二: 使用一个复合注解替代上面两个注解完成整合 
	@SpringJUnitConfig(locations = "classpath:spring.xml")
	// 或者
	@SpringJUnitConfig(classes = SpringConfig.class)
	// 或者
	@SpringJUnitConfig(SpringConfig.class)
```

## 五.AOP通知注解

```java
@Aspect 表示此类为通知类 如:事务类就为通知类 包含回滚 提交方法等

    // 前置 用来通知类的方法上 指定具体的方法执行此通知
    @Before("execution(* com.woniu.service.*.*(..))")
    // 后置
    @AfterReturning("execution(* com.woniu.service.*.*(..))")
    // 异常通知
    @AfterThrowing("execution(* com.woniu.service.*.*(..))")
    // 最终通知
    @After("execution(* com.woniu.service.*.*(..))")
    // 环绕通知
    @Around("execution(* com.woniu.service.*.*(..))")
```

## 六.实体类注解

```java
// 需要在pom.xml添加依赖
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.16</version>
    <scope>compile</scope>
</dependency>
    
@Data  //相当于帮你写了以下方法 get set toString hashCode  equal
@NoArgsConstructor // 无参构造方法
@AllArgsConstructor // 全参构构造方法


// 使用反序列化时使用
@JsonDeserialize(using = LocalDateTimeDeserializer.class) 
// 自己使用序列化时使用用
@JsonSerialize(using = LocalDateTimeSerializer.class)	
// 接收参数时使用 - 数据库精确到秒 但是前端只到日 实体类类型使用 LocalDate
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
// 返回结果时使用 - 数据库精确到秒 但是前端只到日 实体类类型使用 LocalDate
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")		
private LocalDateTime birthday;
```

## 七.MVC 注解 

```java
// 请求获取
@RequestMapping("/quick")   // 可指定方式
@GetMapping("xxx") 			// get的请求方式
@PostMapping("xxx")			// post的请求方式

// RestController = Controller + ResponseBody 表示整个类下的方法都不会进行跳转页面
@RestController

// 告知SpringMVC框架 不进行视图跳转 直接进行数据响应 返回字符串有乱码 实体类则没有
@ResponseBody  

// 页面请求时的name与方法参数名称不一致
@RequestParam(value="表单的name",required = false - 是否传参,defaultValue = "默认值")

// 在页面获取的时间为字符串 无法直接获取 日期类型的数据就需要自定义转换器。
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")

// 获得请求头信息 相当于web阶段学习的request.getHeader(name)
// value：请求头的名称 required：是否必须携带此请求头
@RequestHeader(value = "User-Agent",required = false)

// 使用@CookieValue可以获得指定Cookie的值
// value：指定cookie的名称 required：是否必须携带此cookie
@CookieValue(value = "JSESSIONID")

// Restful 风格注解
   	// 前端请求发送 user/5 -- 后台接收请求 @RequestMapping(value="/user/{id}")
	// 获取数据方式一:  @PathVariable(value="id") String userId
	// 获取数据方式二:  @PathVariable String id	
	@PathVariable
```

## 八.SQL语句注解

```java
// 添加
	@Insert("insert into 表名(列名, 列名) values('值', '值')")
// 获取主键自增值 在mapper数据访问层无需返回实体类否则报错 直接在业务层调用实体类.getid即可 
	@Options(useGeneratedKeys = true， keyProperty = "实体类字段名"， keyColumn = "指定表主键列名称")

// 删除
    @Delete("delete from 表名 where 列名 = 值")

// 修改
    @Update("update 表名 set 列名1=新值,列名2=新值 where 条件")

// 查询所有
    @Select("select * from 表名")
```

## 九.SpringBoot  注解

```java
// 启动器 类的注解 - 组合注解
	@SpringBootApplication
		* @SpringBootConfiguration 可以简单的理解为就是一个@Configuration注解，
          通过@Configuration 与 @Bean结合，将Bean注册到Spring ioc 容器
    	* @ComponentScan：开启注解扫描：默认扫描@SpringBootApplication所在类的同级目录以及它的子目录
    	* @EnableAutoConfiguration：开启spring应用程序的自动配置，SpringBoot基于你所添加的依赖和你        	 自己定义的bean，试图去猜测并配置你想要的配置
    
// 日志打印 类注解
	@Slf4j  // log.debug("测试....");  自定义日志打印
   
// 异常配置类注解
	@ControllerAdvice
    @RestControllerAdvice
// 异常配置类 方法触发配置注解
    @ExceptionHandler(value = {ArithmeticException.class})    
        
// 开启定时任务注解 可放在启动类上方
    @EnableScheduling
            
// 开启过滤器注解 可放在启动类上方
	@ServletComponentScan   
```

## 十. MyBatisPlus注解

```java
// 表名注解   表名注解指定当前实体类对应的表名，比如下面 UserInfo 实体类对应表名为 user
	@TableName(value = "user")

// 字段名注解  除了全局配置方法外，使用注解来指定对应的  
	// 主键
	@TableId(value = "id")
	// id的生成策略 能够根据内置的规则生成id 需要把数据库的id自动增长关闭
	@TableId(type = "IdType.AUTO")

 	// 其他字段  
	@TableField(value = "user_name")
	// 表示此字段是否在此表存在 默认: true存在 反之: false不存在
	@TableField(exist = false)
	// 设置属性是否参与查询，默认: true参与查询 反之: false不查询 此属性与select()映射配置不冲突
	@TableField(select = false) 
```

## 十一. springsecurity 注解

> PrePost 注解也是 jsr250 标准出现之前，Spring Security 框架自己定义的注解。PrePost 注解的功能比 Secured 注解的功能更强大，通过使用 Spring EL 来表达具有逻辑判断的校验规则。

```java
// PrePost 注解
@EnableWebSecurity
// -----------------------------
@EnableGlobalMethodSecurity(prePostEnabled = true)  // 开启鉴权注解 内包含: @Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {...}

// @PreAuthorize  注解：适合进入方法前的权限验证；
// @PostAuthorize  注解：使用并不多，在方法执行后再进行权限验证。

// 等同于前面章节的配置中的 hasRole("...") 鉴权 先查询然后跟注解判断 如果一致则允许访问 反之则不行
@PreAuthorize("hasRole('ROLE_admin')")  
@RequestMapping("/admin")
public String admin() {
    return "admin";
}
```

## 十二. 微服务 注解

**Eureka 注解**

```java
// -- 启动类 --
// 启动类 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
// 声明当前springboot应用是一个eureka服务中心
@EnableEurekaServer
// 开启Eureka客户端功能
@EnableDiscoveryClient 
// 开启Hystrix熔断
@EnableCircuitBreaker || @EnableHystrix
// 开启Zuul网关功能
@EnableZuulProxy
// 组合注解
@SpringCloudApplication
* @SpringBootApplication // 启动类注解
* @EnableDiscoveryClient // 开启 Eureka客户端
* @EnableCircuitBreaker // 开启Hystrix熔断
// 开启 Open Feign 客户端 远程调用组件，无需配置熔断器和负载均衡注解
@EnableFeignClients

// -- 启动类里的 RestTemplate 方法上 --
// 负载均衡 不添加这个注解，不能直接用服务名访问
@LoadBalanced
    
// -- 表现层 降级 -- 
// 指定服务查询异常时调用的方法 写在方法上
@HystrixCommand(fallbackMethod = "方法名")
// 指定一个类的全局降级方法 类上 配合@HystrixCommand让方法异常触发降级
@DefaultProperties(defaultFallback = "方法名")
    
// -- Open Feign 远程调用组件 接口类 --
// 标注该类是一个feign接口 且链接到服务方
@FeignClient(value = "服务名")
```

**Nacos  注解**

```java
// ---- 启动类 ----
// 启动类 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
// 启用 nacos 的服务发现
@EnableDiscoveryClient 

// ---- 过滤器 ----
// 控制全局过滤器的先后顺序，不是局部的顺序，值越小，优先级越高。
@Order(-5) 
```





# 过滤器 - 坐标依赖 - 父子工程

## 过滤器

```java
// req 类型转换
HttpServletRequest req = (HttpServletRequest) request;
// 例外处理
String uri = req.getRequestURI();  // 请求 如: /xxx/eee
	uri.equals("/user/login")
    uri.endsWith("/login.jsp")

String Path = req.getServletPath(); // 调用的jsp  如: xxx.jsp
	Path.equals("/login.jsp")
	Path.endsWith(".css")
    Path.endsWith(".js")
        
// 放行静态资源 
    // 方式一 --> 对应的文件夹
        String[] urls = {"/css/", "/images/", "/js/"};
        String jt = uri.toString();
        for (String u : urls) {
            if (jt.contains(u)){
                chain.doFilter(request, response);
                return;
            }
        }
	// 方式二
		String servletPath = httpServletRequest.getServletPath();
		servletPath.startsWith(" /statics")1

```

### 登录过滤器

> filter  包下  LoginFilter 类
>
> 例外请求的放行: 登录的请求 - 注册的请求 - 静态文件的请求 
>
> 特别注意:  SpringBoot Thymeleaf  项目要使用过滤器 必须在启动器类上方 注解: @ServletComponentScan
>
> 在过滤跳转时 应该在 application.yml 配置文件 把 templates 文件夹设置为静态资源 才能跳转
>
> ```yml
> #设置静态资源文件夹
> resources:
> static-locations:
>     - file:D:/BluceLee
>     - classpath:static
>     - classpath:templates  # 把 templates 文件夹设置为静态资源 
> ```

```java
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "LoginFilter", urlPatterns = "/*")
public class LoginFilter implements Filter {


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        // req 类型转换
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse response1 = (HttpServletResponse) response;
        Object obj = req.getSession().getAttribute("userSession");

        // 例外处理
        String uri = req.getRequestURI();  // 请求
        String Path = req.getServletPath(); // 调用的jsp
        if (uri.equals("/user/login") || uri.endsWith("/login.jsp")) {
            chain.doFilter(request, response);
            return;
        }

        // 放行静态资源
        String[] urls = {"/css/", "/images/", "/js/"};
        String jt = uri.toString();
        for (String u : urls) {
            if (jt.contains(u)){
                chain.doFilter(request, response);
                return;
            }
        }

        // 判断用户是否登录
        if (obj == null) {
            req.getRequestDispatcher("/login.jsp").forward(request, response);
        } else {
            chain.doFilter(request, response);
        }
    }
}

```





## 分模块开发

分模块开发: 即在共同开发的项目中, 都会相互依赖各个模块, 达到项目完整

### 分模块开发步骤:

- 将分模块使用meven的生命周期 install 打包成 jar包 存储在本地仓库内
- 将分模块的坐标依赖导入主模块即可

> 坐标在pom.xml里
> <groupId>com.taiyang</groupId>
> <artifactId>springMVC-03</artifactId>
> <version>1.0-SNAPSHOT</version>

## 坐标依赖

### 依赖范围:

 依赖范围 - 在添加依赖gav坐标时，使用scope标签来指定jar包文件起作用的范围

```
<scope>provided</scope>

compile 编译 -- 默认值 【最强依赖】 spring-context、log4j


依赖范围		编译		测试		运行		打包
compile			1		1		  1		    1     spring-webmvc、log4j
provided        1       1         0         0     servlet-api：J2EE的规范
runtime         0       1         1         1     mysql-connector-java：[JDK java.sql.*]
test      1[测试代码]    1       1[测试代码]   0     junit-jupiter-engine
```

### 依赖传递:

1. 直接依赖:在当前项目中通过依赖配置建立的依赖关系
2. 间接依赖:被资源的资源如果依赖其他资源，当前项目间接依赖其他资源
3. 简单来说: 直接依赖 和 简介依赖 同时存在时可删除直接依赖 使用间接依赖也是可以正常使用

### 依赖冲突

1. 声明优先:当资源在相同层级被依赖时，配置顺序靠前的覆盖配置顺序靠后的
2. 路径优先:当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高
3. 特殊优先:当同级配置了相同资源的不同版本，后配置的覆盖先配置的

### 依赖排除:

* 表示对依赖传递的jar可以选择性的排除

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.6</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 声明周期:

clean -> 编译compile -> test -> 打包package -> install安装  -> 部署deploy

* package：不会把打好的jar包部署到本地[maven](https://so.csdn.net/so/search?q=maven&spm=1001.2101.3001.7020)仓和远程maven私仓。

* install：会把打好的jar包部署到本地maven仓，但不会部署到远程maven私仓。

* deploy：会把打好的jar包部署到本地maven仓和远程maven私仓。

  

##  版本的统一管理

* 解决不同的模块引用了不同版本的jar包依赖，从而出现兼容性问题
* 方便版本的统一升级维护，防止部分模块的依赖升级，导致项目中的多个版本的同名jar

### Maven 父子工程

在实际的项目中，如果项目比较大的情况下，会把项目的功能分成很多个模块(module)，模块与模块之间使用RPC(远程调用)，而聚合和继承就特别适合多个模块的协同工作。

#### Maven继承与聚合（重点）

##### 继承

* 父子工程项目一定是具有继承关系的 子工程能够继承父工程的依赖 和 坐标

* 被继承的父模块pom.xml必须制定打包类型为pom

* 继承的作用，特性

```te
继承的特性是指建立一个父模块，我们项目中的多个模块都作为该模块的子模块，将各个子模块相同的依赖和插件配置提取出来，从而简化配置文件
```

##### 父工程 - pom.xml

```xml
    <groupId>com.woniu</groupId>
    <artifactId>maven-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
	// 聚合
    <modules>
        <module>子工程的项目名</module>
        <module>子工程的项目名</module>
    </modules>
	// 父工程可使用全局的变量 即依赖的版本号 继承给子工程保证其统一性
	<properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <junit.version>5.8.2</junit.version>
        <!--声明全局变量-->
        <spring.version>5.3.18</spring.version>
        <mybatis.version>3.5.7</mybatis.version>
        <mysql.connector.version>8.0.22</mysql.connector.version>
    </properties>
	// 依赖获取变量的版本号
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>${spring.version}</version>
    </dependency>
```

##### 聚合

* 被聚合的模块不一定是子工程，只是idea在创建一个模块的子模块项目时，会自动添加子模块为被聚合的模块
* 使用一个模块聚合多个模块，其作用就是可以将多个模块的项目进行 一键编译，测试，打包，安装

```xml
 <!--聚合模块，参与聚合的模块不一定是子模块-->
<modules>
    <module>maven-admin</module>
    <module>maven-goods</module>
</modules>
```





# 补充: 数据获取 请求发送

## 前端 上下文路径

```html
<-- SpringBoot Thymeleaf 上下文路径 -->
    <base th:href="${#request.getContextPath()} + '/' ">
    <link rel="stylesheet" href="css/test.css">
    <script src="js/test.js"></script>
    
<-- JSP 上下文路径 -->
    // EL 表达式
	${pageContext.request.contextPath}
    <base href="${pageContext.request.contextPath}/">
    <link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath }/statics/css/style.css" />
    // JSP 表达式
	<%=request.getContextPath() %>
	<script src="<%=request.getContextPath() %>/static/js/jquery.js"></script>
 
<-- 获得都是当前运行文件在服务器上的绝对路径 -->
    // 在servlet里用:
    this.getServletContext().getRealPath();
    // 在struts用:
    this.getServlet().getServletContext().getRealPath();
    // 在Action里用:
    ServletActionContext.getRequest().getRealPath();
```



## 后台 数据获取:

```java
// 方式一:  根据name 的类型和名字获取
	<input type="hidden" name="id" value="${user.id }"/> 
        
	@RequestMapping("/userModify")
    public String gotoModify(Integer id){
        // 参数名字和
    }

// 方式二: SpringMVC的请求-获得请求参数-获得POJO实体类类型参数(应用)
// Controller中的业务方法的POJO参数的属性名与请求参数的name一致，参数值会自动映射匹配。
    @RequestMapping(value="/quick12")
    @ResponseBody
    public void save12(User user) {
        System.out.println(user);
    }

// 前端发送json数据 后台使用注解 @RequestBody 获取json数据 对应实体类
	@RequestMapping("/addrole")
    @ResponseBody
    public int addrole(@RequestBody Role role) { // 接收 json 数据
        int i = roleService.addrole(role);
        return i;
    }
```



## Servlet相关API

- HttpServletRequest request
- HttpServletResponse response
- HttpSession session



## Spring MVC 页面跳转

- 客户端 重定向: 执行该路径 相对于一次请求并执行 还可以在后面带上请求参数

  return "redirect:/user/userList?参数名=参数";

* 服务器 转发

  return "forward:/index.jsp";

  * Thymeleaf: 返回物理视图名，不接上前后缀，springboot会把这个list.html作为一个静态资源。
  * 会去/META-INF/resources/", "classpath:/resources/", "classpath:/static/", "classpath:/public/找
  * return "forward:/templates/list.html“,还是会去静态资源包找,如未找到则去templates目录找.

* 根据设置的配置文件开头和结尾拼接jsp文件跳转

  return "index";

* 根据 req 服务端转发

  req.getRequestDispatcher("/ 文件地址").forward(req, resp);

* 根据 resp 客户端重定向

  resp . sendRedirect("文件地址")

  resp.sendRedirect(req.getContextPath() + "/文件地址");

## 前端发送请求和数据

```html
------------------  前端页面发送请求和数据 ----------------------

// 提交按钮请求 -- 将会提交表单 form 使用的数据可供调用
<button type="submit" name="doogs">提交按钮</button>

// 超链接的请求 -- 只带上href ? 后面的数据
<a href="manage/doog?doogs=gotodoogsadd">超链接的请求</a>
<a href="javascript:函数名()">超链接的请求</a>
<a href="javascript:void(0);" onclick="函数名()">不直接请求 使用js函数请求</a>

// 普通按钮 -- 无法直接发送请求 可使用js发送请求 window.location.href=""
<button type="button" onclick="函数名()">普通按钮</button>

// 网络照片来源
<img :src=""http://localhost:1025/user/verifyCode""/>

<script>
    function gotopage(){
        window.location.href = "${pageContext.request.contextPath}/manage/doog?doogs=gotosList&pageNum=xxx";
        window.open('http://127.0.0.1:1025/download/userlist');
    }
    // 使用ajax发送请求
</script>
```

## spring 文件 补充

### 文件上传:

 spring 获取 文件时: -->  MultipartFile 文件表单的name名

文件上传提前注意:

```java
a. 表单的method必须为post [递交]

b. 表单上必须添加一个属性 enctype [表单数据封装类型]
       |-默认的ContentType- application/x-www-form-urlencoded
       
   enctype="multipart/form-data"  多部分表单数据     
   将表单中上传的文件使用二进制流的形式进行提交
   
c. 表单中使用type="file"   才能上传文件 
d. 特别注意: 文件上传表单 的name值一定不能与实体类的字段名一样 否则无法拿到值
```

```java
@RequestMapping("/useraddsave")
public String useraddsave(SmbmsUser user, HttpServletRequest request, MultipartFile idPicPath1) throws IOException {
        // 上传文件处理
        // 文件名称
        String originalFilename = idPicPath1.getOriginalFilename();
        // 文件存储位置
        String rootPath = "C:/Users/Lujun/Documents/IDEA/Spring/springMVC-03/src/main/webapp/upload/";
        // 随机拼接的名字
        String fileName = System.currentTimeMillis() + "-" + originalFilename;
        // 根据文件位置 与 随机拼接的名字 组成访问路径进行存储
        idPicPath1.transferTo(new File(rootPath + fileName));
		// 将文件访问路径存入实体类 在前端可通过该路径获取文件
        user.setIdPicPath("/upload/" + fileName);
        smbmsUserService.adduser(user);
        return "redirect:/user/userList";
}

// 多文件 数组类型 上传
String destPath = "D:/image/";
for (int i = 0; i < upload.length; i++) {
    String fileName = System.currentTimeMillis() + ".jpg";
    upload[i].transferTo(new File(destPath + fileName));
}
```

### 文件下载:

```java
// 根据文件名字下载
@RequestMapping("/downloadFile")
@ResponseBody
public String downloadFile(HttpServletRequest request, HttpServletResponse response, String filePathName) throws IOException {
    // 文件的存放路径
    String path = "C:/Users/Lujun/Documents/IDEA/Spring/SpringBootThymeleaf-04/src/main/webapp/upload/";
    
    // 根据文件地址路径和名字拼接 创建file实例
    File file = new File(path + filePathName);
    if (!file.exists()) {
        return "-1";
    }
    response.reset();
    response.setHeader("Content-Disposition", "attachment;fileName=" + filePathName);
    try {
        InputStream inStream = new FileInputStream(file);
        OutputStream os = response.getOutputStream();
        byte[] buff = new byte[1024];
        int len = -1;
        while ((len = inStream.read(buff)) > 0) {
            os.write(buff, 0, len);
        }
        os.flush();
        os.close();
        inStream.close();
    } catch (Exception e) {
        e.printStackTrace();
        return "-2";
    }
    return "0";
}
```



## 分页插件 业务层

```java
//开始分页 可使用传参设置 页数 和 每页的数据条数
PageHelper.startPage(pageNum,pageSize);
//紧跟后面查询会被分页
List<实体类类型> 变量名 = 使用工具类调用数据访问层
//将查询的list封装至PageInfo实例
PageInfo<实体类类型> pageInfo = new PageInfo<>(变量名);
return pageInfo;
```







