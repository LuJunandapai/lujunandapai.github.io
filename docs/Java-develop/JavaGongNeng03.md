---
title: Java 功能实现
date: 2023/04/26
---

## | --- Java 第三方工具操作



## Pagehelper 分页详解

### 1.分页依赖

> 特别注意: 还要 Mybatis-plus 依赖  但是与分页插件有依赖冲突

```xml
<!--分页插件 依赖冲突排除-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.5</version>
    <exclusions>
        <exclusion>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 2.web 层返回数据

```java
// 总记录数--所需要进行分页的数据条数
total: 2, 
// 查询数据库的集合
list: [ 查询数据库的集合 ]   
// 当前页码
pageNum: 1,
// 每页的条数
pageSize: 10,
// 当前页的条数
size: 2,
// 当前页展示的数据的起始行
startRow: 1,
// 当前页展示的数据的结束行
endRow: 2,
//总页数
pages: 1,
//上一页页码
prePage: 0,
//下一页页码
nextPage: 0,
//是否为第一页，默认为false,是第一页则设置为true
isFirstPage: true,
//是否为最后一页默认为false,是最后一页则设置为true
isLastPage: true,
//是否有前一页，默认为false,有前一页则设置为true
hasPreviousPage: false,
//是否有下一页，默认为false,有后一页则设置为true
hasNextPage: false,
//导航页码数，所谓导航页码数，就是在页面进行展示的那些1.2.3.4...
//比如一共有分为两页数据的话，则将此值设置为2
navigatePages: 8,
//所有导航页号，一共有两页的话则为[1,2]
navigatepageNums: [ ],
//导航条上的第一页页码值
navigateFirstPage: 1,
//导航条上的最后一页页码值
navigateLastPage: 1,

firstPage: 1,
lastPage: 1
```

### 3.service 业务层 | 分页

```java
//开始分页 可使用传参设置 页数 和 每页的数据条数
PageHelper.startPage(pageNum,pageSize);
//紧跟后面查询会被分页
List<实体类类型> 变量名 = 使用工具类调用数据访问层获取集合
//将查询的list封装至PageInfo实例
PageInfo<实体类类型> pageInfo = new PageInfo<>(变量名);
return pageInfo;
```



## ID 算法生成

### UUID 唯一识别码

UUID（Universally Unique Identifier，**通用唯一识别码**）是按照开放软件基金会（OSF）制定的标准计算，用到了以太网卡地址、纳秒级时间、芯片 ID 码和许多可能的数字。

UUID 是由一组 32 位数组成，由16 进制数字所构成，是故 UUID 理论上的总数为16的32次方。这个总数是多大呢？打个比方，如果每纳秒产生 1 百万个 UUID，要花 100 亿年才会将所有 UUID 用完。

UUID 通常以连字号分隔的五组来显示，形式为 `8-4-4-4-12`，总共有 36 个字符（即 32 个英数字母和 4 个连字号）。例如： **123e4567-e89b-12d3-a456-426655440000** 。

JDK 从 1.5 开始在 java.util 包下提供了一个 **UUID** 类用来生成 UUID：

```java
UUID uuid = UUID.randomUUID();
String uuidStr1 = uuid.toString();
String uuidStr2 = uuidStr1.replaceAll("-","");
```

#### UUID 的缺点 和 ID的标准 

**UUID的缺点：**

为了得到一个全局唯一 ID，很自然地就会想到 UUID 算法。但是，UUID 算法有明显的缺点：

1. UUID 太长了，通常以 36 长度的字符串表示，很多场景不适用。
2. 非纯数字。UUID 中会出现 ABCDEF 这些十六进制的字母，因此，在数据库和代码中，自然就不能存储在整型字段或变量。因此，在数据库中以它作为主键，建立索引的代价比较大，性能有影响。
3. 不安全。UUID 中会包含网卡的 MAC 地址。

**一个『好』ID 的标准应该有哪些：**

1. 最好是由纯数字组成。
2. 越短越好，最好能存进整型变量和数据库的整型字段中。
3. 信息安全。另外，『ID 连续』并非好事情。
4. 在不连续的情况下，最好是递增的。即便不是严格递增，至少也应该是趋势递增。

### SnowFlake 的雪花算法原理

Snowflake 是 Twitter（美国推特公司）开源的分布式 ID 生成算法。最初 Twitter 把存储系统从 MySQL 迁移到 Cassandra（它是NoSQL数据库），因为Cassandra 没有顺序 ID 生成机制，所以 Twitter 开发了这样一套全局唯一 ID 生成服务。

SnowFlake 优点：

整体上按照时间自增排序，并且整个分布式系统内不会产生 ID 碰撞（由数据中心 ID 和机器 ID 作区分），并且效率较高。经测试，SnowFlake 每秒能够产生 26 万 ID 左右。

Snowflake **会生成一个 long 类型的数值**，long是8个字节，一共是64位，Snowflake 对于 long 的各个位都有固定的规范：

![image-20220105160306886](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220105160306886.png) 

- 最高位标识（1 位）

  由于 long 基本类型在 Java 中是带符号的，最高位是符号位，正数是 0，负数是 1，因为 id 一般是正数，所以最高位是 0 。

- 毫秒级时间戳（41 位）

  注意，41 位时间戳不是存储当前时间的时间戳，而是存储时间的差值（当前时间戳 - 开始时间戳) 得到的值，这里的的开始时间，一般是我们的 id 生成器开始使用的时间，由我们程序来指定的（如下面程序 IdGenerator 类的 **startTime** 属性）。

  41 位的时间截，可以使用 69 年。

  2的41次方  除以  (1000毫秒 \* 60 \* 60 \* 24 \* 365) = 69

- 数据机器位（10 位）

  10-bit机器可以分别表示1024台机器，这 10 位的机器位实际上是由 5 位的 **互联网数据中心(datacenterId)** 和 5 位的**工作机器id(workerId)** 。这样就可以有32个**互联网数据中心(机房)**（2的5次方），每个互联网数据中心可以有32台工作机器 。即，总共允许存在 1024 台电脑各自计算 ID 。

  每台电脑都由 data-center-id 和 worker-id 标识，逻辑上类似于联合主键的意思。

- 12为的自增序列号,用来记录同毫秒内产生的不同id，就是一毫秒内最多可以产生4096个id

  毫秒内的计数，12为的自增序列号 支持每个节点每毫秒（同一机器，同一时间截）产生 4096（2的12次方） 个 ID 序号，这种分配方式可以保证在任何一个**互联网数据中心**的任何**一台工作机器**在任意毫秒内生成的ID都是不同的

  > 面试常问：如果是并发量高，同一台机器一毫秒有5000个id，那么id会不会重复，不会，根据源码如果一毫秒内超过4096个id，则会阻塞到下一毫秒再生成

#### Snowflake 实现源码

**调用方法**

* 在批量获取id时 new 只能是一个对象获取id 不要在批量new对象

```java
SnowflakeIdGenerator idWorker = new SnowflakeIdGenerator(1, 1);
long id = idWorker.nextId();
```

~~~java
package com.woniu.util;

public class SnowflakeIdGenerator {

    // ==============================Fields===========================================

    // 所占位数、位移、掩码/极大值
    private static final long sequenceBits = 12;  //序列号占用位数
    private static final long workerIdBits = 5;  //工作机器占用位数
    private static final long dataCenterIdBits = 5;  //数据中心占用位数（机房）

    //~表示非，例如 01 的非  10     负数的二进制 = 该正数的二进制取反+1
    //为什么不直接写4095呢？（主要计算机运算的时候是二进制，如果写4095的话，还是要转二进制，效率低）
    private static final long sequenceMask = ~(-1L << sequenceBits);  //4095  （0到4095 刚好是4096个）


    private static final long workerIdShift = sequenceBits; //12
    private static final long workerIdMask = ~(-1L << workerIdBits); //31


    private static final long dataCenterIdShift = sequenceBits + workerIdBits;  //17
    private static final long dataCenterIdMask = ~(-1L << dataCenterIdBits); //31

    private static final long timestampLeftShift = sequenceBits + workerIdBits + dataCenterIdBits;//22
    //private static final long timestampBits = 41L;
    //private static final long timestampMask = ~(-1L << timestampBits);//2199023255551

    /**
     * 开始时间截 (2015-01-01)  1420070400000L/1000/60/60/24/30/12 = 25+1970 = 2015-01-01
     */
    private static final long twepoch = 1420070400000L;

    private long sequence = 0;  //序列号
    private long workerId;      //工作机器标识
    private long dataCenterId;  //数据中心
    private long lastTimestamp = -1L; //上次生成 ID 的时间截

    //==============================Constructors=====================================

    public SnowflakeIdGenerator() {
        this(0, 0);
    }

    /**
     * 构造函数
     *
     * @param workerId     工作ID (0~31)
     * @param dataCenterId 数据中心 ID (0~31)
     */
    public SnowflakeIdGenerator(long workerId, long dataCenterId) {
        if (workerId > workerIdMask || workerId < 0) {
            throw new IllegalArgumentException(String.format("workerId can't be greater than %d or less than 0", workerIdMask));
        }

        this.workerId = workerId;
        this.dataCenterId = dataCenterId;
    }

    // ============================== Methods ==========================================

    /**
     * 获得下一个 ID (该方法是线程安全的，synchronized)
     */
    public synchronized long nextId() throws InterruptedException {
        long timestamp = timeGen(); //获取当前服务器时间

        // 如果当前时间小于上一次 ID 生成的时间戳，说明系统时钟回退过，这个时候应当抛出异常。
        // 出现这种原因是因为系统的时间被回拨，或出现闰秒现象。
        // 你也可以不抛出异常，而是调用 tilNextMillis 进行等待
        if (timestamp < lastTimestamp) {

            Thread.sleep(3000);
            timestamp =   timeGen();
            if(timestamp < lastTimestamp){

                throw new RuntimeException(
                        String.format("Clock moved backwards. Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
            }

            throw new RuntimeException(
                    String.format("Clock moved backwards. Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }

        // 如果是同一时间生成的，则时并发量高的情况下，同一毫秒内最大支持4096个id，否则阻塞到下一秒生成
        if (lastTimestamp == timestamp) {
            // 相同毫秒内，序列号自增  ， sequence = 4095时， 0 = (sequence + 1) & sequenceMask
            sequence = (sequence + 1) & sequenceMask;
            // 毫秒内序列溢出，即，同一毫秒的序列数已经达到最大
            if (sequence == 0) {
                // 阻塞到下一个毫秒,获得新的时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }
        // 时间戳改变，毫秒内序列重置
        else {
            sequence = 0L;
        }

        // 将当前生成的时间戳记录为『上次时间戳』。『下次』生成时间戳时要用到。
        lastTimestamp = timestamp;

        // 移位并通过或运算拼到一起组成 64 位的 ID = 8个字节
        return ((timestamp - twepoch) << timestampLeftShift) // 时间毫秒数左移22位
                | (dataCenterId << dataCenterIdShift) //数据中心节点左移17位
                | (workerId << workerIdShift) // 机器节点左移12位
                | sequence;
    }

    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     *
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     *
     * @param timestamp 当前时间错
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long timestamp, long lastTimestamp) {
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 返回以毫秒为单位的当前时间
     *
     * @return 当前时间(毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }

    //==============================Test=============================================

    /**
     * 测试
     */
    public static void main(String[] args) throws InterruptedException {
        System.out.println(System.currentTimeMillis());
        SnowflakeIdGenerator idWorker = new SnowflakeIdGenerator(1, 1);
        long startTime = System.nanoTime();
        for (int i = 0; i < 50000; i++) {
            long id = idWorker.nextId();
            System.out.println(id);
        }
        System.nanoTime(); //获取当前纳秒
        System.out.println((System.nanoTime() - startTime) / 1000000 + "ms");
    }
}

~~~

#### 解决时间回拨问题

原生的 Snowflake 算法是完全依赖于时间的，如果有时钟回拨的情况发生，会生成重复的 ID，市场上的解决方案也是不少。简单粗暴的办法有：

* 采用直接抛异常方式：上面就是这种方式，虽然可行，但是这种很不友好，太粗暴

- 使用阿里云的的时间服务器和自己的服务器进行同步，2017 年 1 月 1 日的闰秒调整，阿里云服务器 NTP 系统 24 小时“消化”闰秒，完美解决了问题。

  ~~~shell
  [root@localhost ~]## ntpdate ntp1.aliyun.com
  ~~~

- 如果发现有时钟回拨，时间很短比如 3 毫秒（一般大于3毫秒就不建议等待），就等待（线程睡3秒再来生成id），然后再生成。

~~~java
 public synchronized long nextId() {
        long timestamp = timeGen(); //获取当前服务器时间

        if (timestamp < lastTimestamp) {
            Thread.sleep(3000)
            timestamp =   timeGen();
            if(timestamp < lastTimestamp){
                
                 throw new RuntimeException(
                    String.format("Clock moved backw ....", lastTimestamp - timestamp));
            }
             
        }
     ......
 }
~~~

* 集群：如某台服务器准备一个备机或者多个备机，当主服务器出现异常情况时，可以选择备机



## JSR303n 请求参数校验

> 即: 后台校验请求参数的包 且能自定义返回前端提示
>
> https://blog.csdn.net/u013565163/article/details/82845788

**防坑指南:** 

* 参数校验注解 必须 对应的数据类型  否则会报错 HV000030
* BindingResult result 获取校验结果 必须跟在校验的实体类参数的后面挨着
* 分组时必须指定 分组的接口类
* 时间的校验格式默认为: yyyy/MM/dd 的字符串 自动会进行转换时间Date类型
* 当时间格式不为默认格式 则报错 可以自定义时间转换器进行转换

### JSR303 依赖:

```xml
<!--JSR303 请求参数校验-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 参数校验注解:

> 在请求时需要校验 实体类 参数时  可根据实体类字段上面的校验注解进行校验

**参数校验分组**

```java
// 1.创建分组的接口类
package com.apai.group;
public interface GroupUpdate {

}
// 2.在注解 groups 属性指定分组的接口类 | 该属性为数组可写多个
@NotNull(message = "名称不能为空", groups = {GroupUpdate.class})
@NotNull(message = "名称不能为空", groups = {GroupUpdate.class, group.class, ...})
// 3.在请求的参数加上 @Validated(value = 分组的接口类.class) 
// 4.根据 BindingResult result 获取校验结果
```

**注解**

```java
// 不能为空 | 用在基本类型上
@NotNull(message = "不能为空")
// 邮箱格式校验 | string 类型
@Email(message = "邮箱格式错误")
// 校验数值的最大范围 | 数值类型
@Max(value = 10, message = "年龄最大不能查过10岁")
// 校验数值的最小范围 | 数值类型
@Min(value)
// 长度的范围 | string 类型
@Size(min = 3, max = 6, message = "手机号码长度超出范围")
// 在当前时间之前 | Date 类型
@Past(message = "必须在当前时间之前")
// 在当前时间之后 | Date 类型
@Future(message = "必须在当前时间之后")
```

### 请求接口

**校验实体类默认的使用字段**

> 在 参数 使用: @Valid

```java
@GetMapping("/yanzheng")
public ResponseResult<Map> yanzheng(@Valid Wuzi wuzi, BindingResult result) {
    // 创建 map 储存校验不符合要求的字段以及信息
    Map<String, String> maps = new HashMap<>();
    // 是否出现校验字段出现不符合要求的情况
    boolean errors = result.hasErrors();
    if (errors) {
        // 获取所有不符合要求的信息
        List<FieldError> fieldErrors = result.getFieldErrors();
        // 进行封装至map
        for (FieldError fieldError : fieldErrors) {
            maps.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        // 将 map 封装至数据返回类
        return new ResponseResult<Map>(maps, "校验参数不符合要求", 200);
    }
    return new ResponseResult<Map>(null, "成功通过校验", 200);

}
```

**校验实体类 分组 字段**

> 在 参数 使用: @Validated(value = GroupUpdate.class) 
>
> 注解并指定分组接口类  而实体类里的参数 也必须指定 分组的接口类

```java
@GetMapping("/group")
public ResponseResult<Map> group(@Validated(value = GroupUpdate.class) Wuzi wuzi, BindingResult result) {
    Map<String, String> maps = new HashMap<>();
    boolean errors = result.hasErrors();
    if (errors) {
        List<FieldError> fieldErrors = result.getFieldErrors();
        for (FieldError fieldError : fieldErrors) {
            maps.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return new ResponseResult<Map>(maps, "校验参数不符合要求", 200);
    }
    return new ResponseResult<Map>(null, "成功通过校验", 200);

}
```

### 时间转换器

> 写在 启动类 里 | 进行配置的注入 会覆盖默认的 时间转换器

* 时间的校验格式默认为: yyyy/MM/dd 的字符串 自动会进行转换时间Date类型
* 当时间格式不为默认格式 则报错 可以自定义时间转换器进行转换

```java
// JSR303 时间参数校验 转换器
@Bean
public Converter<String, Date> convertStringToDate() {
    return new Converter<String, Date>() {
        @SneakyThrows
        @Override
        public Date convert(String s) {
            // 参数 String s 传递的 时间 字符串
            Date date = null;
            SimpleDateFormat sf = null;
            // 判断 时间 参数的格式 进行格式设置
            if (s.contains("-")){
                sf = new SimpleDateFormat("yyyy-MM-dd");
            }else if (s.contains("/")) {
                sf = new SimpleDateFormat("yyyy/MM/dd");
            }
            // 时间不为空 则进行按照 格式 进行字符串转换时间
            if (!StringUtils.isEmpty(s)) {
                date = sf.parse(s);
            }
            return date;
        }
    };
}
```







## SpringBoot 定时任务

> 基于: web 依赖
>
> 即: 在每隔设置的时间进行方法的调用

### 1.开启定时器注解

```java
package com.woniu;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
// 定时器注解
@EnableScheduling
public class RegistorServiceConsitentApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegistorServiceConsitentApplication.class, args);
    }

}
```

### 2.方法 设置定时器

> 定时器类  可放在 timer 包下

```java
package com.woniu.inlet.timer;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// 开启定时器
@Component
public class TpaylogTime {
    // 每隔4s 定期执行这个方法
    @Scheduled(fixedRate = 4000)
    public void sendMsg() {
        System.out.println("收拾收拾");
    }
    
    // 每年一月的一号的 1:00:00 执行一次
    @Scheduled(cron = "0 0 1 1 1 ?")   
    public void scheduledMethod() {
        System.out.println("定时器被触发" + new Date());
    }
}
```

### 3.Cron 表达式

~~~
Cron 表达式是一个字符串，分为 6 或 7 个域，每一个域代表一个含义；
Cron 从左到右（用空格隔开）： 秒 分 小时 月份中的日期 月份 星期 中的日期年份
~~~

> Cron 有如下两种语法格式：

（1） Seconds Minutes Hours Day Month Week Year
（2）Seconds Minutes Hours Day Month Week

| 1             秒              0-59                   - * /   |
| ------------------------------------------------------------ |
| 2             分钟             0-59                - * /     |
| 3            小时              0-23                  - * /   |
| 4              日                1-31                 - * / L W C |
| 5              月                1-12                 - * /  |
| 6           星期               1-7                  - * ? / L C ## |
| 7           年(可选)    1970-2099           - * /            |

Cron 表达式的时间字段除允许设置数值外，还可使用一些特殊的字符，提供列表、范围、通配符等功，如下：

```java
* 星号(**)：可用在所有字段中，表示对应时间域的每一个时刻，例如，*在分钟字段时，表示“每分钟”；
    
* 问号（?）：该字符只在日期和星期字段中使用，它通常指定为“无意义的值”，相当于占位符；
    
* 减号(-)：表达一个范围，如在小时字段中使用“10-12”，则表示从 10 到 12 点，即 10,11,12；
    
* 逗号(,)：表达一个列表值，如在星期字段中使用“MON,WED,FRI”，则表示星期一，星期三和星期五；
    
* 斜杠(/)：x/y 表达一个等步长序列，x 为起始值，y 为增量步长值。如在分钟字段中使用 0/15，则表示为 0,15,30 和 45 秒，而 5/15 在分钟字段中表示 5,20,35,50，你也可以使用*/y，它等同于 0/y；
    
* L：该字符只在日期和星期字段中使用，代表“Last”的意思，但它在两个字段中意思不同。L 在日期字段中，表示这个月份的最后一天，如一月的 31 号，非闰年二月的 28 号；如果 L 用在星期中，则表示星期六，等同于 7。但是，如果 L 出现在星期字段里，而且在前面有一个数值 X，则表示“这个月的最后 X 天”，例如，6L 表示该月的最后星期五；
    
* W：该字符只能出现在日期字段里，是对前导日期的修饰，表示离该日期最近的工作日。例如 15W表示离该月 15 号最近的工作日，如果该月 15 号是星期六，则匹配 14 号星期五；如果 15 日是星期日，则匹配 16 号星期一；如果 15 号是星期二，那结果就是 15 号星期二。但必须注意关联的匹配日期不能够跨月，如你指定 1W，如果 1 号是星期六，结果匹配的是 3 号星期一，而非上个月最后的那天。W 字符串只能指定单一日期，而不能指定日期范围；
    
* LW 组合：在日期字段可以组合使用 LW，它的意思是当月的最后一个工作日；
    
* 井号(#)：该字符只能在星期字段中使用，表示当月某个工作日。如 6#3 表示当月的第三个星期五(6表示星期五，#3 表示当前的第三个)，而 4#5 表示当月的第五个星期三，假设当月没有第五个星期三，忽略不触发；
    
* C：该字符只在日期和星期字段中使用，代表“Calendar”的意思。它的意思是计划所关联的日期，如果日期没有被关联，则相当于日历中所有日期。例如 5C 在日期字段中就相当于日历 5 日以后的第一天。1C 在星期字段中相当于星期日后的第一天。
```

> 案例说明：

~~~
@Scheduled(cron = "0 0 1 1 1 ?")//每年一月的一号的 1:00:00 执行一次
@Scheduled(cron = "0 0 1 1 1,6 ?") //一月和六月的一号的 1:00:00 执行一次
@Scheduled(cron = "0 0 1 1 1,4,7,10 ?") //每个季度的第一个月的一号的 1:00:00 执行一次
@Scheduled(cron = "0 0 1 1 * ?")//每月一号 1:00:00 执行一次
@Scheduled(cron="0 0 1 * * *") //每天凌晨 1 点执行一次
~~~



## SpringBoot - mail 邮件

> 详解: SpringBoot2

### 1.引入依赖

~~~xml
<!--mail 邮件发送 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
~~~

### 2.编写相关配置

~~~yml
spring:
  application:
    name: springboot-demo
  mail:
    host: smtp.qq.com    #服务器
    username: 2386297795@qq.com  #你的邮箱地址
    password: jcgovsqiuevldidb  #邮箱授权码是刚才开启POP3/SMTP服务时生成的链接字符
    port: 25                    #端口号
    protocol: smtp             #SMTP 可以理解为协议
~~~

### 3.mail 使用 测试

#### 邮箱工具类

**防坑指南**

* 调用该工具类的方法时 只能使用 @Autowired 注入 否则工具类的注入对象无法获取为null

**调用**

```java
@Autowired
private MailUtil mailUtil;

mailUtil.sendmail("邮箱的标题", "邮箱的内容", "收件人的邮箱");
```

```java
package com.woniu.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;


@Component
public class MailUtil {

    // 内置的工具类
    @Autowired
    private JavaMailSenderImpl javaMailSender;

    @Value("${spring.mail.username}")
    private String addresser;

    /**
     * 简单邮件发送
     *
     * @param title      邮箱的标题
     * @param content    邮箱的内容
     * @param recipients 收件人的邮箱
     */
    public void sendmail(String title, String content, String recipients) {
        System.out.println(addresser);
        SimpleMailMessage message = new SimpleMailMessage();
        // 邮箱的标题
        message.setSubject(title);
        // 邮箱的内容
        message.setText(content);
        // 收件人的邮箱
        message.setTo(recipients);
        // 发件人的邮箱，和配置的username保持一致
        message.setFrom(addresser);
        // 获取注入的 javaMailSender 发送邮件
        javaMailSender.send(message);
    }

}

```

#### 默认方法使用

~~~java
// 内置的工具类
@Autowired
private JavaMailSenderImpl javaMailSender;

@Test
void contextLoads() {
    SimpleMailMessage message = new SimpleMailMessage();
    // 邮箱的标题
    message.setSubject("email测试");
    // 邮箱的内容
    message.setText("邮件测试内容,验证码：7788");
    // 收件人的邮箱
    message.setTo("897031817@qq.com");
    // 发件人的邮箱，和配置的username保持一致
    message.setFrom("897031817@qq.com");  
    // 获取注入的 javaMailSender 发送邮件
    javaMailSender.send(message);
}
~~~

![image-20220802141024989](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220802141024989.png)

### 4. 群发 测试

![image-20220602102420240](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220602102420240.png)











## Hutool 依赖工具包

* [HuTool工具的使用介绍和常用案例](https://blog.csdn.net/weixin_43773867/article/details/113496371) 
* Hutool 官网: https://hutool.cn/docs/#/
* 对文件、流、加密解密、转码、正则、线程、[XML](https://so.csdn.net/so/search?q=XML&spm=1001.2101.3001.7020)等JDK方法进行封装
* 可以根据需求对每个模块单独引入，也可以通过引入hutool-all方式引入所有模块。

```txt
模块	介绍
hutool-aop	JDK动态代理封装，提供非IOC下的切面支持
hutool-bloomFilter	布隆过滤，提供一些Hash算法的布隆过滤
hutool-cache	简单缓存实现
hutool-core	核心，包括Bean操作、日期、各种Util等
hutool-cron	定时任务模块，提供类Crontab表达式的定时任务
hutool-crypto	加密解密模块，提供对称、非对称和摘要算法封装
hutool-db	JDBC封装后的数据操作，基于ActiveRecord思想
hutool-dfa	基于DFA模型的多关键字查找
hutool-extra	扩展模块，对第三方封装（模板引擎、邮件、Servlet、二维码、Emoji、FTP、分词等）
hutool-http	基于HttpUrlConnection的Http客户端封装
hutool-log	自动识别日志实现的日志门面
hutool-script	脚本执行封装，例如Javascript
hutool-setting	功能更强大的Setting配置文件和Properties封装
hutool-system	系统参数调用封装（JVM信息等）
hutool-json	JSON实现
hutool-captcha	图片验证码实现
hutool-poi	针对POI中Excel和Word的封装
hutool-socket	基于Java的NIO和AIO的Socket封装
```

### hutool 依赖

```xml
<!--hutool 工具包-->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.6</version>
</dependency>
```

### Data 时间转换工具

#### 时间格式转换

```java
// ---- 日期格式化工具 ----
String dateStr = "2021-01-28";

// 时间字符串 转换 date类型 格式为: yyyy-MM-dd HH:mm:ss
Date dateFormat = DateUtil.parse(dateStr);

// 将date类型的时间 转换指定格式的 字符串时间
String format = DateUtil.format(new Date(), "yyyy/MM/dd HH:mm:ss");

// date类型 转换 时间字符串 格式为: yyyy-MM-dd
String formatDate = DateUtil.formatDate(new Date());

// date类型 转换 时间字符串 格式为: yyyy-MM-dd HH:mm:ss
String formatDateTime = DateUtil.formatDateTime(new Date());

// date类型 转换 时间字符串 格式为: HH:mm:ss
String formatTime = DateUtil.formatTime(new Date());
```

![image-20220809130940999](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809130940999.png)

#### 获取Date时间对象的某个部分

```java
// ---- 获取Date对象的某个部分  ----
// 获取现在的时间 date类型
Date datePart = DateUtil.date();
//  获得年的部分
System.out.println("年:"+DateUtil.year(datePart));

//  获得月份，从0开始计数
System.out.println("月:"+DateUtil.month(datePart));

//  获得月份枚举
System.out.println("日:"+DateUtil.dayOfMonth(datePart));
```

![image-20220809130822474](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809130822474.png)

#### 自定义时间偏移

```java
// 按格式将时间字符串转换date类型
Date strdate = DateUtil.parse(时间字符串, "yyyy-MM");
// 将date类型的时间 往前偏移一个月
DateTime offset = DateUtil.offset(strdate, DateField.MONTH, -1);
// 将date类型的时间按格式转换字符串时间
String str = DateUtil.format(offset, "yyyy-MM");
```



#### 以现在为基准 日期时间偏移

```java
// ---- 以现在的时间为基准 日期时间偏移  ----
//  昨天
DateTime zuotian = DateUtil.yesterday();
System.out.println("昨天:" + zuotian);

//  明天
DateTime mingtian = DateUtil.tomorrow();
System.out.println("明天:"+ mingtian);

//  上周
DateTime shuangzhou = DateUtil.lastWeek();
System.out.println("上周:"+ shuangzhou);

//  下周
DateTime xiazhou = DateUtil.nextWeek();
System.out.println("下周:"+ xiazhou);

//  上个月
DateTime shuangyue = DateUtil.lastMonth();
System.out.println("上个月:"+ shuangyue);

//  下个月
DateTime xiayue = DateUtil.nextMonth();
System.out.println("下个月:"+ xiayue);
```

![image-20220809131020950](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809131020950.png)

#### 开始 和 结束时间

```java
String dateStr2 = "2021-01-28 11:04:44";
Date date = DateUtil.parse(dateStr2);

//一天的开始，结果：2021-01-28 00:00:00
Date beginOfDay = DateUtil.beginOfDay(date);
System.out.println("一天的开始: "+beginOfDay);

//一天的结束，结果：2021-01-28 23:59:59
Date endOfDay = DateUtil.endOfDay(date);
System.out.println("一天的结束: "+endOfDay);
```

![image-20220809131057402](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809131057402.png)

#### 时间的区间

```java
String start = "2021-01-28";
String end = "2021-02-09";

// list 储存 "2021-01-28" -- "2021-02-09" 的所有日期值
List<DateTime> dateTimeList = DateUtil.rangeToList(DateUtil.parse(start), DateUtil.parse(end), DateField.DAY_OF_MONTH);
dateTimeList.stream().forEach(System.out::println);
```

![image-20220809131208828](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809131208828.png)

#### LocalDateTime

```java
// 现在的时间 
String format1 = LocalDateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd HH:mm:ss");
System.out.println("现在:" + format1);

// 设置时间格式的指定时间
String format2 = LocalDateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd 11:58:00");
System.out.println("每天吃饭的点:" + format2);

// 时间倒计时(秒/s) LocalDateTime.of(2022, 8, 9, 14, 0, 0) --> yyyy-MM-dd HH:mm:ss
String x = LocalDateTimeUtil.between(LocalDateTime.now(), LocalDateTime.of(2022, 8, 9, 14, 0, 0), ChronoUnit.SECONDS) + "s";
System.out.println("距离下班还有:" + x);
```

![image-20220809131227574](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809131227574.png)



### 加密工具

- 对称加密（symmetric），例如：AES、DES等
- 非对称加密（asymmetric），例如：RSA、DSA等
- 摘要加密（digest），例如：MD5、SHA-1、SHA-256、HMAC等

```java
public static void main(String[] args) {
        /**
         * 加密解密工具:
         * 对称加密（symmetric），例如：AES、DES等
         * 非对称加密（asymmetric），例如：RSA、DSA等
         * 摘要加密（digest），例如：MD5、SHA-1、SHA-256、HMAC等
         */
        String MD5 = SecureUtil.md5("hzkj");
        // MD5:8497ed920a8860e99b4b902dbf264969
        System.out.println("MD5:"+ MD5); 
        String SHA256 = SecureUtil.sha256("hzkj");
        // SHA256:2f97bc5034eb6dc8bfa869543111ee5edfd7a83bbec2f1c15bb94ba26560678f
        System.out.println("SHA256:"+ SHA256); 
    }
```



### 常用字符 API

#### 截取

```java
//字符串模板代替字符串拼接,slf4j
System.out.println(StrUtil.format("this is {} for {}", "a", "b"));
//截取: 从0开始,最后一个为-1, 左开右闭,不会越界报错
String str = "abcdefgh";
System.out.println(StrUtil.sub(str, 0, 3)); // abc
System.out.println(StrUtil.sub(str, 1, 3)); // bc
System.out.println(StrUtil.sub(str, 2, -3)); //cde
System.out.println(StrUtil.sub(str, 3, 2)); //c
System.out.println(StrUtil.sub(str, 3, -1)); //defg
System.out.println(StrUtil.sub(str, 0, 9)); //abcdefgh
```

#### 常量 字符

```java
//定义了很多常用字符 如: _ / . - \r \n 等
System.out.println(StrUtil.UNDERLINE);
System.out.println(StrUtil.DOT);
System.out.println(StrUtil.COMMA);
System.out.println(StrUtil.DASHED);
System.out.println(StrUtil.EMPTY_JSON);
```

#### 判断非空

```java
//判断非空
System.out.println(StrUtil.hasBlank(null));//true
System.out.println(StrUtil.hasBlank(""));//true
System.out.println(StrUtil.hasBlank(" "));//true
System.out.println(StrUtil.hasBlank("null"));//false
System.out.println(StrUtil.hasEmpty(null));//true
System.out.println(StrUtil.hasEmpty(""));//true
System.out.println(StrUtil.hasEmpty(" "));//false
System.out.println(StrUtil.hasEmpty("null"));//false
```



## 阿里云 OSS 文件上传

> 使用element 和 阿里云oss 配合是上传 和 下载

### 1.添加依赖 阿里云-OSS

```xml
<!--阿里云-OSS-对象存储-->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.8.0</version>
</dependency>
```

### 2.前端

> 后端如果验证 token 会报空 因为请求不是异步不会被路由守卫装配token 所以需要在发送请求时带上token

```vue
<template>
  <div>
    <el-upload class="avatar-uploader" action="/api/amount/uploadImage" :headers="headers" :show-file-list="false"
      :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <el-button type="primary" @click="downloadBut()" plain>下载</el-button>

    <!-- <img :src="imageUrl" alt=""> -->
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: {},
      // 图片显示 链接
      imageUrl: '', 
      // 图片 url 点击可自动下载
      downloadUrl: null,
    };
  },

  created() {
    // 后端如果验证 token 会报空 因为请求不是异步不会被路由守卫装配token 所以需要在发送请求时带上token
    this.headers = { token: localStorage.getItem("token") };
  },

  methods: {
    //上传成功之后
    handleAvatarSuccess(res, file) {
      //服务器返回的对象 回显
      // console.log(res);  res -- 下载链接
      this.downloadUrl = res;
      // 图片显示 链接
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    //上传文件之前
    beforeAvatarUpload(file) {
      let isJPG = file.type;
      let isLt2M = 0;
      if (isJPG == "image/jpeg" || isJPG == "image/png") {
        isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
      } else {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      return isJPG && isLt2M;
    },
    
    // 点击按钮下载
    downloadBut() {
      window.location.href = this.downloadUrl;
    },
  }
}
</script>

<!-- 组件样式 -->
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
```

### 3.后端

> 表现层 请求

```java
// 文件上传 接收前端发送的请求 直接调用 工具类 上传云端 返回 url
@RequestMapping("/uploadImage")
public String uploadFile(MultipartFile file){
    String url= FileUtils.uploadFile(file);
    return url;
}
```

> 文件上传工具类

```java
package com.apai.util;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.PutObjectResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public class FileUtils {
    // 阿里云 oss 账号
    private static String accountID = "LTAI5t63NME4ptetZ5xUrphw";
    // 阿里云 oss 密码
    private static String secret = "Tm5SluS5crvMoDkqgaYCeumbvHqahW";
    // 阿里云 oss 桶 Bucket 名称
    private static String bucketName = "apai-yun";

    public static String uploadFile(MultipartFile file) {
        String url="";
        try {
            // Endpoint以华东1（杭州）为例，其它Region请按实际情况填写。
            String endpoint = "https://oss-cn-beijing.aliyuncs.com";
            // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
            String accessKeyId = accountID;
            String accessKeySecret = secret;

//            ObjectMetadata meta = new ObjectMetadata();
//            meta.setContentType("image/jpg");

            // 创建OSSClient实例。
            OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
            InputStream inputStream = file.getInputStream();
            // 文件 储存 Bucket 里的文件夹名称
            PutObjectResult result = ossClient.putObject(bucketName, "img/" + file.getOriginalFilename(), inputStream);
            System.out.println(result);
            url= "https://" + bucketName + ".oss-cn-beijing.aliyuncs.com/img/" + file.getOriginalFilename();
        } catch (Exception ex) {

        }
        return url;
    }
}
```

## 反射动态添加实体类字段

### BeanUtils 依赖

> 主要用于通过反射技术操作对象：克隆对象、获取属性等；

https://blog.csdn.net/qq_29689343/article/details/125898278

```xml
<!-- 反射技术操作对象 -->
<dependency>
    <groupId>commons-beanutils</groupId>
    <artifactId>commons-beanutils</artifactId>
    <version>1.9.2</version>
</dependency>

<!-- json 序列化 | 反序列化 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.70</version>
</dependency>
```

### 工具类

```java
package com.apai.utils;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.PropertyUtilsBean;
import org.springframework.cglib.beans.BeanGenerator;
import org.springframework.cglib.beans.BeanMap;

import java.beans.PropertyDescriptor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
public class ReflectUtil {

    // 判断是否为数字
    static Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");

    // 动态添加实体类字段
    public static Object getTarget(Object dest, Map<String, Object> addProperties) {
        PropertyUtilsBean propertyUtilsBean = new PropertyUtilsBean();
        PropertyDescriptor[] descriptors = propertyUtilsBean.getPropertyDescriptors(dest);
        Map<String, Class> propertyMap = Maps.newHashMap();
        for (PropertyDescriptor d : descriptors) {
            if (!"class".equalsIgnoreCase(d.getName())) {
                propertyMap.put(d.getName(), d.getPropertyType());
            }
        }
        addProperties.forEach((k, v) -> propertyMap.put(k, v.getClass()));
        DynamicBean dynamicBean = new DynamicBean(dest.getClass(), propertyMap);
        propertyMap.forEach((k, v) -> {
            try {
                if (!addProperties.containsKey(k)) {
                    dynamicBean.setValue(k, propertyUtilsBean.getNestedProperty(dest, k));
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
        addProperties.forEach((k, v) -> {
            try {
                dynamicBean.setValue(k, v);
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
        Object target = dynamicBean.getTarget();
        return target;
    }

    // 计算动态添加字段的值的合计 | addMapstr_初始化动态字段的map, list_存储所有实体类的数据
    public static Map<String, Object> getTargetNumList(Map<String, Object> addMapstr, List<Object> list) {
        for (Object target : list) {
            // 将单个对象转换为map
            Map objectMap = JSONObject.parseObject(JSONObject.toJSONString(target), Map.class);
            addMapstr.forEach((k, v) -> {
                // 判断是否是数字
                if (pattern.matcher(v.toString()).matches()) {
                    // 将数字相加
                    Integer sum = Integer.parseInt(objectMap.get(k).toString()) + Integer.parseInt(v.toString());
                    addMapstr.put(k, sum);
                }
            });
        }
        return addMapstr;
    }


    public static class DynamicBean {
        /**
         * 目标对象
         */
        private Object target;
 
        /**
         * 属性集合
         */
        private BeanMap beanMap;
 
        public DynamicBean(Class superclass, Map<String, Class> propertyMap) {
            this.target = generateBean(superclass, propertyMap);
            this.beanMap = BeanMap.create(this.target);
        }
 
 
        /**
         * bean 添加属性和值
         *
         * @param property
         * @param value
         */
        public void setValue(String property, Object value) {
            beanMap.put(property, value);
        }
 
        /**
         * 获取属性值
         *
         * @param property
         * @return
         */
        public Object getValue(String property) {
            return beanMap.get(property);
        }
 
        /**
         * 获取对象
         *
         * @return
         */
        public Object getTarget() {
            return this.target;
        }
 
 
        /**
         * 根据属性生成对象
         *
         * @param superclass
         * @param propertyMap
         * @return
         */
        private Object generateBean(Class superclass, Map<String, Class> propertyMap) {
            BeanGenerator generator = new BeanGenerator();
            if (null != superclass) {
                generator.setSuperclass(superclass);
            }
            BeanGenerator.addProperties(generator, propertyMap);
            return generator.create();
        }
    }
 
}
```

### 动态添加实例

```java
public Object getEntityList() {

    LinkedHashMap<String, Object> addMap = new LinkedHashMap();
    addMap.put("accounting_date0", "2021-11-11");
    addMap.put("accounting_date1", "2021-11-12");
    addMap.put("accounting_date2", "2021-11-13");
    addMap.put("accounting_date3", "2021-11-14");

    TestGet testGet = new TestGet();
    testGet.setName("是阿派啊");
    testGet.setAge(18);
    Object target = ReflectUtil.getTarget(testGet, addMap);

    return target;
}
```

```json
{
  // 实体类字段
  "name": "是阿派啊",
  "age": 18,
  // 动态添加的字段和数据
  "accounting_date0": "2021-11-11",
  "accounting_date2": "2021-11-13",
  "accounting_date3": "2021-11-14",
  "accounting_date1": "2021-11-12"
}
```

### 合计处理

```java
public Object getEntityList2() {

    TestGet testGet1 = new TestGet("李明", 18);
    TestGet testGet2 = new TestGet("仙群", 18);
    TestGet testGet3 = new TestGet("温蒂", 18);
    TestGet testGet4 = new TestGet("颗粒", 18);

    List<TestGet> testGets = new ArrayList<>();
    testGets.add(testGet1);
    testGets.add(testGet2);
    testGets.add(testGet3);
    testGets.add(testGet4);

    // 存储 动态字段 的map
    Map<String, Object> addMap = new HashMap();
    // 存储 所有实体类的数据
    List<Object> list = new ArrayList<>();
    // 存储合计的map 写入初始化动态字段
    Map<String, Object> addMapstr = new HashMap();

    for (TestGet testGet : testGets) {
        for (int i = 0; i < testGets.size(); i++) {
            addMap.put("aaa" + i, (int)(Math.random()*100+1));
            // addMapstr_初始化动态字段的map | 如果有固定字段，可以在这里初始化
            addMapstr.put("aaa" + i, 0);
        }
        Object target = ReflectUtil.getTarget(testGet, addMap);
        list.add(target);
    }

    // 计算合计 addMapstr_合计 初始化动态字段的map, list_存储所有实体类的数据
    Map<String, Object> targetNumList = ReflectUtil.getTargetNumList(addMapstr, list);
    return ReflectUtil.getTarget(new TestGet(), targetNumList);
}
```

## 调用第三方API (钉钉)

###  钉钉 SDK 依赖

```xml
<dependencies>
    <!-- 钉钉 SDK 依赖 -->
    <dependency>
        <groupId>com.aliyun</groupId>
        <artifactId>alibaba-dingtalk-service-sdk</artifactId>
        <version>2.0.0</version>
    </dependency>
</dependencies>
```

![image-20230202170243579](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/s7xw1e-0.png)

### 调用API接口

> 在 钉钉官方文档 找到对于接口的说明 按照步骤即可 | 注意返回值是 JSON字符串

```java
// 钉钉token
String access_token = "59c381eeaa5739d58f978e1108a2a905";
// 钉钉请求接口路径
DingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/topapi/attendance/getcolumnval");
OapiAttendanceGetcolumnvalRequest req = new OapiAttendanceGetcolumnvalRequest();
// 钉钉用户id
req.setUserid("02005117462621643609");
// 钉钉自定义列id
req.setColumnIdList("640342942,640342965,640342967,640342968");
// 查询时间范围
req.setFromDate(StringUtils.parseDateTime("2022-12-16 00:00:00"));
req.setToDate(StringUtils.parseDateTime("2022-12-31 00:00:00"));
// 调用钉钉接口
OapiAttendanceGetcolumnvalResponse rsp = client.execute(req, access_token);
// 打印返回结果
System.out.println(rsp.getBody());
```







## | --- Java 功能实现

## 登录验证码

> 基本流程:https://blog.csdn.net/pp1981002445/article/details/110954646

* 验证码生成接口 | 登录每次刷新都会调用
* 如果使用了 security 则需要对验证码的接口放行
* 在 security 自定义过滤器在密码校验之前 让每次点击登录时先校验验证码

### 验证码生成工具类

```java
package com.apai.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

public class VerificationCode {
    private int width = 100;// 生成验证码图片的宽度
    private int height = 30;// 生成验证码图片的高度
    private String[] fontNames = { "宋体", "楷体", "隶书", "微软雅黑" };
    private Color bgColor = new Color(255, 255, 255);// 定义验证码图片的背景颜色为白色
    private Random random = new Random();
    private String codes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private String text;// 记录随机字符串

    /**
     * 获取一个随意颜色
     *
     * @return
     */
    private Color randomColor() {
        int red = random.nextInt(150);
        int green = random.nextInt(150);
        int blue = random.nextInt(150);
        return new Color(red, green, blue);
    }

    /**
     * 获取一个随机字体
     *
     * @return
     */
    private Font randomFont() {
        String name = fontNames[random.nextInt(fontNames.length)];
        int style = random.nextInt(4);
        int size = random.nextInt(5) + 24;
        return new Font(name, style, size);
    }

    /**
     * 获取一个随机字符
     *
     * @return
     */
    private char randomChar() {
        return codes.charAt(random.nextInt(codes.length()));
    }

    /**
     * 创建一个空白的BufferedImage对象
     *
     * @return
     */
    private BufferedImage createImage() {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        g2.setColor(bgColor);// 设置验证码图片的背景颜色
        g2.fillRect(0, 0, width, height);
        return image;
    }

    public BufferedImage getImage() {
        BufferedImage image = createImage();
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < 4; i++) {
            String s = randomChar() + "";
            sb.append(s);
            g2.setColor(randomColor());
            g2.setFont(randomFont());
            float x = i * width * 1.0f / 4;
            g2.drawString(s, x, height - 8);
        }
        this.text = sb.toString();
        drawLine(image);
        return image;
    }

    /**
     * 绘制干扰线
     *
     * @param image
     */
    private void drawLine(BufferedImage image) {
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        int num = 5;
        for (int i = 0; i < num; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g2.setColor(randomColor());
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawLine(x1, y1, x2, y2);
        }
    }

    public String getText() {
        return text;
    }

    public static void output(BufferedImage image, OutputStream out) throws IOException {
        ImageIO.write(image, "JPEG", out);
    }
}
```

### 验证码生成接口

```java
// 获取登录数字验证码
@GetMapping("/verifyCode")
// 匿名访问 | 自定义的注解 | 配合security使用
@AnonymousAccess
public void verifyCode(HttpServletRequest request, HttpServletResponse resp) throws IOException {
    // 1.创建验证码图片对象
    VerificationCode code = new VerificationCode();
    // 2.获取验证码图片
    BufferedImage image = code.getImage();
    // 3.获取图片上的文本内容
    String text = code.getText();
    // 4.将文本内容保存到session中，为登录做准备
    HttpSession session = request.getSession(true);
    // 5.将文本内容保存到session中
    session.setAttribute("verify_code", text);
    // 6.将图片响应给客户端
    VerificationCode.output(image,resp.getOutputStream());
}
```

### Security  自定义过滤器

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class VerificationCodeFilter extends GenericFilter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;
        if ("POST".equals(req.getMethod()) && "/login".equals(req.getServletPath())) {
            // 1.获取用户输入的验证码
            String code = req.getParameter("code");
            // 2.获取session中的验证码
            String verify_code = (String) req.getSession().getAttribute("verify_code");
            // 3.判断验证码是否正确
            if (code == null || "".equals(code) || !code.toLowerCase().equals(verify_code.toLowerCase())) {
                ResponseResult<String> success = new ResponseResult<>(null, "验证码有误", 400);
                resp.setContentType("application/json;charset=utf-8");
                resp.getWriter().write(new ObjectMapper().writeValueAsString(success));
            }else {
                filterChain.doFilter(req, resp);
            }
        }else {
            filterChain.doFilter(req, resp);
        }
    }
}
```

### Security 配置

> 用于自定义过滤器排序 |  自定义注解接口放行

```java
package com.apai.util;
import java.lang.annotation.*;

/**
 * 可加载web请求接口是获取该接口的请求路径
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AnonymousAccess {

}
```

```java
package com.apai.config.security;

import com.apai.util.AnonymousAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;


// springsecurity 的认证
//@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)  // 开启鉴权注解 内包含: @Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;

    @Autowired
    private MyAuthenticationFailureHandler myAuthenticationFailureHandler;

    @Autowired
    private MyAuthenticationEntryPoint myAuthenticationEntryPoint;

    @Autowired
    private MyAccessDeniedHandler myAccessDeniedHandler;

    @Autowired
    private MyLogoutSuccessHandLer myLogoutSuccessHandLer;

    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    // 获取校验登录验证码的自定义过滤器
    @Autowired
    private VerificationCodeFilter verificationCodeFilter;

    // 注入 获取匿名接口请求集合使用
    @Autowired
    private ApplicationContext applicationContext;


    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 最终认证做法，是当用户输入用户名和密码的时候，表单提交的url 是：/login，然后security根据我们提交的用户名和密码
        // 去数据库查询是否有   没有就登陆失败，否则就登陆成功
        // 将来做认证的时候 执行的是我们自定义的实现类 来做 验证 UserDetailsServiceImpl 类
        auth.userDetailsService(userDetailsService).passwordEncoder(getBCryptPasswordEncoder());
    }


    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.GET,
                "/v2/api-docs",
                "/swagger-resources",
                "/swagger-resources/**",
                "/configuration/ui",
                "/configuration/security",
                "/swagger-ui.html/**",
                "/webjars/**", "/doc.html",
                "/warehouse/updateDrugWarehousePo",
                "/warehouse/findDrugWarehousePoByid",
                "/purchase/findDrugCustomerById",
                "/purchase/findDrugCustomer",
                "/purchase/findCustomers",
                "/purchase/addDrugCustomer",
                "/purchase/updateDrugCustomer",
                "/purchase/deleteDrugCustomer"
        );
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 进行自定义的过滤器(登录验证码校验和登录密码对比校验)排序
        http.addFilterBefore(verificationCodeFilter, UsernamePasswordAuthenticationFilter.class);


        // 鉴权认证配置
        http.authorizeRequests() // 鉴权的请求
                .antMatchers("/login.html", "/user/register", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico", "doc.html").permitAll() // 允许通过的请求
                // 匿名接口的使用请求都进行放行
                .antMatchers(getAnonymousUrls()).anonymous()
                .anyRequest().authenticated(); // 除了什么配置 其他的需要登录访问

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                .usernameParameter("username").passwordParameter("password") // 登录的表单参数
                // .defaultSuccessUrl("/home")  // 登录成功重定向路径
                .successHandler(myAuthenticationSuccessHandler) // 登陆成功处理器
                // .failureForwardUrl("/error1"); // 登录失败转发的路径
                .failureHandler(myAuthenticationFailureHandler); // 自定义登录失败处理器

        // 认证和鉴权异常配置
        http.exceptionHandling()
                .authenticationEntryPoint(myAuthenticationEntryPoint)   // 认证异常
                .accessDeniedHandler(myAccessDeniedHandler);            // 鉴权异常

        // 使用jwt的话，需要关闭session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // 添加jwt过滤器到security过滤器链中
        http.addFilterAfter(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        // 退出成功的处理器
        http.logout().logoutSuccessHandler(myLogoutSuccessHandLer);

        //关闭CSRF跨域
        http.csrf().disable();
    }

    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}
```

### 前端 vue 案例

```vue
<template>
  <div class="wrap">
    <div class="form">
      <div class="left">
        <video src="@/assets/video/video.mp4" muted loop autoplay></video>
      </div>
      <div class="right">
        <div class="right-con">
          <h1>欢迎登录: 月亮派平台</h1>
          <h3>账号</h3>
          <input class="text" type="text" v-model="username" />
          <h3>密码</h3>
          <input class="text" type="password" v-model="password" />

          <h3>验证码</h3>
          <div class="code">
            <input class="text" type="text" v-model="verifyCode" style="width: 70%;float: left;"/>
            <img class="verifyCodeImg" :src="imgUrl" @click="resetImg" />
  
          </div>
          <input class="btn" type="button" @click="login()" value="LOGIN" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // data: 对象就是要渲染到页面上的数据 | 用于cmd创建的vue
  data: function () {
    return {
      username: '',
      password: '',
      verifyCode: '',
      // 验证码图片初始地址
      imgUrl:"http://localhost:1025/user/verifyCode?time="+new Date(),
    }
  },

  // created : 页面加载完毕后执行
  created() {

  },

  // methods: 就是定义事件的处理函数  
  methods: {
    // 验证码图片刷新
    resetImg(){
        this.imgUrl = "http://localhost:1025/user/verifyCode?time="+new Date();
    },
    login() {
      // 提交表单
      this.$axios.post('/api/login', "username=" + this.username + "&password=" + this.password + "&code=" + this.verifyCode)
        .then((res) => {
          // debugger
          if (res.data.status == 200) {
            // 保存服务器返回的token
            let token = res.data.data;
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('username', this.username);

            // this.$router.push('/home');
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });

            // 跳转到首页
            this.$router.push({
              path: '/home',
              query: {
                // 传递名 : 数据
                username: this.username,
              }
            });
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
            this.resetImg();
          }
        })
        .catch((erro) => {
          this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
        });

    }
  },
};
</script>


<!-- 组件样式 -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to left top,
      #d16ba5,
      #c777b9,
      #ba83ca,
      #aa8fd8,
      #9a9ae1,
      #8aa7ec,
      #79b3f4,
      #69bff8,
      #52cffe,
      #41dfff,
      #46eefa,
      #5ffbf1);
}

.form {
  width: 900px;
  height: 560px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
}

.left {
  width: 500px;
  height: 560px;
}

.left video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  width: 400px;
  height: 560px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-con {
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

h1 {
  font-size: 26px;
  color: #70b4e3;
  font-weight: 400;
  padding-bottom: 10px;
}

h3 {
  font-size: 12px;
  font-weight: 400;
  color: #70b4e3;
  padding: 20px 0;
}

.text {
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #70b4e3;
  color: #366ae6;
  background-color: rgba(0, 0, 0, 0);
}

.code{
  height: 40px;
  width: 100%;
  position: relative;
  
}

.verifyCodeImg{
  width: 30%;
  height: 40px;
  cursor: pointer;
  position: absolute; 
  bottom: 24px;
  right: 0px;
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 50px;
  background-image: linear-gradient(120deg, #76daec 0%, #c5a8de 100%);
}

.btn:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
```



## EasyExcel 数据读写表格

### 依赖

```xml
<!--生成excle的依赖-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>2.2.3</version>
</dependency>
```

### 注解

```java
// 实体类注解 | 在导出表格是指定列的名称
@ExcelProperty(value = "表格列名")

// 排除该列
@ExcelIgnore
```

### 前端请求 | 接口 | 工具类

```js
// 可进行拼接带上条件
window.open('http://127.0.0.1:1025/download/userlist');

output(){
    // 获取条件对象
    let params =  {
        status: this.status,
        mincreatetime: this.mincreatetime,
        maxcreatetime: this.maxcreatetime,
        keyword: this.keyword,
        warehouseId: this.warehouseid,
        person: this.person,
    }
    // 遍历拼接 请求格式
    let paramStr = "";
    for(let key in params) {
        paramStr += "&" + key + "=" + params[key];
    }
	// 进行请求接口
    window.open('http://127.0.0.1:1025/download/userlist');
},
```

```java
package com.apai.util;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

// 表格导出工具类
public class excelUtil {
    public static void outExcel(HttpServletResponse response , List<? extends  Object> list, Class t) throws IOException {
        ExcelWriter excelWriter= EasyExcel.write(response.getOutputStream()).build();

        WriteSheet sheet=EasyExcel.writerSheet(0,"sheet").head(t).build();
        excelWriter.write(list, sheet);
        excelWriter.finish();
    }
}
```

```java
package com.apai.controller;


import com.apai.entity.User;
import com.apai.mapper.UserMapper;
import com.apai.util.AnonymousAccess;
import com.apai.util.excelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

// 数据转换表格导出接口
@Controller
@RequestMapping("/download")
public class DownloadController {

    @Autowired
    private UserMapper userMapper;

    // 匿名访问 | Security 需要放行
    @AnonymousAccess
    @GetMapping(value = "/userlist")
    public void saletableList(HttpServletResponse response) throws IOException {
        // 获取数据
        List<User> list = userMapper.selectList(null);
        // 设置响应头
        response.setContentType("application/vnd.ms-excel");
        // 设置文件名
        response.setHeader("Content-Disposition", "attachment;fileName=" + "xs.xlsx");
        // 调用工具类进行数据写入 Excel | 注意实体类有LocalDateTime类型的字段需要转换 | 必须进行处理
        excelUtil.outExcel(response, list, User.class);
    }
}

```

### EasyExcel 使用注意点

详解:

* https://blog.csdn.net/fsadkjl/article/details/105800590  |  LocalDateTime字段出错

* https://blog.csdn.net/fsadkjl/article/details/105809371  |  类型转换: 0 --> 男, 1 --> 女

* https://blog.csdn.net/fsadkjl/article/details/105823830  |  加载器方式和流程

#### LocalDateTime 转换

> 普通导出表格时 LocalDateTime字段会进行报错导致表格打开错误, 需要对其进行转换

##### 1.时间自定义转换器

* 优点：此种方式只需在每个需要转换的字段上添加converter即可
* 缺点：如果有很多类，每个类中有很多需要单独转换的字段要写很多次就尴尬了！
* 适用场景：任何场景

```java
package com.apai.util;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.CellData;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


// 表格导出 | 时间字段自定义转换器
public class LocalDateTimeConverter implements Converter<LocalDateTime> {

	@Override
	public Class<LocalDateTime> supportJavaTypeKey() {
		return LocalDateTime.class;
	}

	@Override
	public CellDataTypeEnum supportExcelTypeKey() {
		return CellDataTypeEnum.STRING;
	}

	@Override
	public LocalDateTime convertToJavaData(CellData cellData, ExcelContentProperty contentProperty,
										   GlobalConfiguration globalConfiguration) {
		return LocalDateTime.parse(cellData.getStringValue(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}

	@Override
	public CellData<String> convertToExcelData(LocalDateTime value, ExcelContentProperty contentProperty,
	                                           GlobalConfiguration globalConfiguration) {
		return new CellData<>(value.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
	}

}
```

```java
// 指定单个时间字段进行转换
ExcelProperty (value =“创建时间", converter = "LocalDateTimeConverter.class")
private LocalDateTime createTime ;
```

##### 2.单次导出进行转换

* 优点：此种方式只要在每个导入导出的方法上都单独加载转换器，不用在每个需要转换的字段上都添加converter了，一定程度上可以减少我们的工作量

* 缺点：只在本方法中有效，其他方法无效，如果有很多不同的导入导出方法就又尴尬了！

* 适用场景：适用于LocalDateTimeConverter场景，但是如果要是SexConverter场景就不适合！因为前者是LocalDateTime与String之间的转换，后者它的本质是Integer与String互相转换，因为String字段可以代表年龄、性别、等信息，所以没法转换

```java
package com.apai.controller;


import com.alibaba.excel.EasyExcel;
import com.apai.entity.User;
import com.apai.mapper.UserMapper;
import com.apai.util.AnonymousAccess;
import com.apai.util.LocalDateTimeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/download")
public class DownloadController {

    @Autowired
    private UserMapper userMapper;

    // 匿名访问 | Security 需要放行
    @AnonymousAccess
    @GetMapping(value = "/userlist")
    public void saletableList(HttpServletResponse response) throws IOException {
        // 获取数据
        List<User> list = userMapper.selectList(null);
        // 设置响应头
        response.setContentType("application/vnd.ms-excel");
        // 设置文件名
        response.setHeader("Content-Disposition", "attachment;fileName=" + "xs.xlsx");
        // 数据写入 Excel | 注意实体类有LocalDateTime类型的字段需要转换 此方法已解决
        EasyExcel.write(response.getOutputStream(), User.class).registerConverter(new LocalDateTimeConverter()).sheet("test").doWrite(list);
    }
}

```

##### 3.自定义全局加载转换器

* 优点：此种方式可以全局配置Converter，一劳永逸！配置完之后不用再单独修改字段或者修改方法，可以理解为EasyExcel从现在支持LocalDateTime啦！
* 缺点：只能添加特殊的Converter
* 适用场景：与第二种场景一样！切记SexConverter不可放到全局加载器中

```java
package com.apai.util;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ConverterKeyBuild;
import com.alibaba.excel.converters.DefaultConverterLoader;
import com.alibaba.excel.converters.bigdecimal.BigDecimalBooleanConverter;
import com.alibaba.excel.converters.bigdecimal.BigDecimalNumberConverter;
import com.alibaba.excel.converters.bigdecimal.BigDecimalStringConverter;
import com.alibaba.excel.converters.booleanconverter.BooleanBooleanConverter;
import com.alibaba.excel.converters.booleanconverter.BooleanNumberConverter;
import com.alibaba.excel.converters.booleanconverter.BooleanStringConverter;
import com.alibaba.excel.converters.bytearray.BoxingByteArrayImageConverter;
import com.alibaba.excel.converters.bytearray.ByteArrayImageConverter;
import com.alibaba.excel.converters.byteconverter.ByteBooleanConverter;
import com.alibaba.excel.converters.byteconverter.ByteNumberConverter;
import com.alibaba.excel.converters.byteconverter.ByteStringConverter;
import com.alibaba.excel.converters.date.DateNumberConverter;
import com.alibaba.excel.converters.date.DateStringConverter;
import com.alibaba.excel.converters.doubleconverter.DoubleBooleanConverter;
import com.alibaba.excel.converters.doubleconverter.DoubleNumberConverter;
import com.alibaba.excel.converters.doubleconverter.DoubleStringConverter;
import com.alibaba.excel.converters.file.FileImageConverter;
import com.alibaba.excel.converters.floatconverter.FloatBooleanConverter;
import com.alibaba.excel.converters.floatconverter.FloatNumberConverter;
import com.alibaba.excel.converters.floatconverter.FloatStringConverter;
import com.alibaba.excel.converters.inputstream.InputStreamImageConverter;
import com.alibaba.excel.converters.integer.IntegerBooleanConverter;
import com.alibaba.excel.converters.integer.IntegerNumberConverter;
import com.alibaba.excel.converters.integer.IntegerStringConverter;
import com.alibaba.excel.converters.longconverter.LongBooleanConverter;
import com.alibaba.excel.converters.longconverter.LongNumberConverter;
import com.alibaba.excel.converters.longconverter.LongStringConverter;
import com.alibaba.excel.converters.shortconverter.ShortBooleanConverter;
import com.alibaba.excel.converters.shortconverter.ShortNumberConverter;
import com.alibaba.excel.converters.shortconverter.ShortStringConverter;
import com.alibaba.excel.converters.string.StringBooleanConverter;
import com.alibaba.excel.converters.string.StringErrorConverter;
import com.alibaba.excel.converters.string.StringNumberConverter;
import com.alibaba.excel.converters.string.StringStringConverter;
import com.alibaba.excel.converters.url.UrlImageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CustomerDefaultConverterLoader {
	//存放写时用到的converter
	private static final String ALL_CONVERTER = "allConverter";
	//存放所有的converter
	private static final String WRITE_CONVERTER = "defaultWriteConverter";

	@Bean
	public DefaultConverterLoader init() throws IllegalAccessException {
		DefaultConverterLoader converters = new DefaultConverterLoader();
		Field[] fields = converters.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			if (field.getType() == Map.class) {
				Map<String, Converter> oldMap = (Map<String, Converter>) field.get(converters);
				//兼容高版本（2.2.0+）通过静态代码块初始化 复用旧代码 节省空间
				if (oldMap != null && !oldMap.isEmpty()) {
					if (WRITE_CONVERTER.equalsIgnoreCase(field.getName())) {
						putWriteConverter(oldMap, new LocalDateTimeConverter());
					} else if (ALL_CONVERTER.equalsIgnoreCase(field.getName())) {
						putAllConverter(oldMap, new LocalDateTimeConverter());
					}
					field.set(converters, oldMap);
				} else {
					setConverter(converters, field);
				}
			}
		}
		return converters;
	}

	private void setConverter(DefaultConverterLoader converters, Field field) throws IllegalAccessException {
		if (WRITE_CONVERTER.equalsIgnoreCase(field.getName())) {
			Map<String, Converter> map = new HashMap<>(32);
			//我的LocalDateTimeConverter
			putWriteConverter(map, new LocalDateTimeConverter());
			//以下jar包自带的Converter
			putWriteConverter(map, new BigDecimalNumberConverter());
			putWriteConverter(map, new BooleanBooleanConverter());
			putWriteConverter(map, new ByteNumberConverter());
			putWriteConverter(map, new DateStringConverter());
			putWriteConverter(map, new DoubleNumberConverter());
			putWriteConverter(map, new FloatNumberConverter());
			putWriteConverter(map, new IntegerNumberConverter());
			putWriteConverter(map, new LongNumberConverter());
			putWriteConverter(map, new ShortNumberConverter());
			putWriteConverter(map, new StringStringConverter());
			putWriteConverter(map, new FileImageConverter());
			putWriteConverter(map, new InputStreamImageConverter());
			putWriteConverter(map, new ByteArrayImageConverter());
			putWriteConverter(map, new BoxingByteArrayImageConverter());
			putWriteConverter(map, new UrlImageConverter());
			field.set(converters, map);
		} else if (ALL_CONVERTER.equalsIgnoreCase(field.getName())) {
			Map<String, Converter> map = new HashMap<>(64);
			//我的LocalDateTimeConverter
			putAllConverter(map, new LocalDateTimeConverter());
			//以下jar包自带的Converter
			putAllConverter(map, new BigDecimalBooleanConverter());
			putAllConverter(map, new BigDecimalNumberConverter());
			putAllConverter(map, new BigDecimalStringConverter());

			putAllConverter(map, new BooleanBooleanConverter());
			putAllConverter(map, new BooleanNumberConverter());
			putAllConverter(map, new BooleanStringConverter());

			putAllConverter(map, new ByteBooleanConverter());
			putAllConverter(map, new ByteNumberConverter());
			putAllConverter(map, new ByteStringConverter());

			putAllConverter(map, new DateNumberConverter());
			putAllConverter(map, new DateStringConverter());

			putAllConverter(map, new DoubleBooleanConverter());
			putAllConverter(map, new DoubleNumberConverter());
			putAllConverter(map, new DoubleStringConverter());

			putAllConverter(map, new FloatBooleanConverter());
			putAllConverter(map, new FloatNumberConverter());
			putAllConverter(map, new FloatStringConverter());

			putAllConverter(map, new IntegerBooleanConverter());
			putAllConverter(map, new IntegerNumberConverter());
			putAllConverter(map, new IntegerStringConverter());

			putAllConverter(map, new LongBooleanConverter());
			putAllConverter(map, new LongNumberConverter());
			putAllConverter(map, new LongStringConverter());

			putAllConverter(map, new ShortBooleanConverter());
			putAllConverter(map, new ShortNumberConverter());
			putAllConverter(map, new ShortStringConverter());

			putAllConverter(map, new StringBooleanConverter());
			putAllConverter(map, new StringNumberConverter());
			putAllConverter(map, new StringStringConverter());
			putAllConverter(map, new StringErrorConverter());
			field.set(converters, map);
		}
	}

	private void putWriteConverter(Map<String, Converter> map, Converter converter) {
		map.put(ConverterKeyBuild.buildKey(converter.supportJavaTypeKey()), converter);
	}

	private void putAllConverter(Map<String, Converter> map, Converter converter) {
		map.put(ConverterKeyBuild.buildKey(converter.supportJavaTypeKey(), converter.supportExcelTypeKey()), converter);
	}
}

```

#### 类型转换加载器

* 类型转换: 0 --> 男, 1 --> 女
* 代码中都会使用 **`1/0 分别代表 男/女`** ,可是Excel中都是用"男"，"女"表示的

```java
package com.apai.util;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.CellData;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

// 自定义类型转换加载器
public class SexConverter implements Converter<Integer> {
	@Override
	public Class supportJavaTypeKey() {
		return Integer.class;
	}

	@Override
	public CellDataTypeEnum supportExcelTypeKey() {
		return CellDataTypeEnum.STRING;
	}

	@Override
	public Integer convertToJavaData(CellData cellData, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
		return "男".equals(cellData.getStringValue()) ? 1 : 0;
	}

	@Override
	public CellData convertToExcelData(Integer value, ExcelContentProperty contentProperty, GlobalConfiguration globalConfiguration) throws Exception {
		return new CellData(value.equals(1) ? "正常" : "注销");
	}
}
```

```java
// 只需在实体类是指定转换加载器即可
@Excel Property (value"性别"，converter = "SexConverter.class")
private Integer sex ;
```

## Poi_xls_表格操作

官方[EasyPoi教程_V1.0 (mydoc.io)](http://easypoi.mydoc.io/#text_197842)

### 表格必备项

#### poi_表格依赖

```xml
<!--poi_xls_表格操作类-->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>3.9</version>
</dependency>
<!--poi_xlsx_表格操作类-->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>3.9</version>
</dependency>
<!-- 表格操作工具依赖 -->
<dependency>
    <groupId>cn.afterturn</groupId>
    <artifactId>easypoi-base</artifactId>
    <version>3.0.1</version>
</dependency>
<dependency>
    <groupId>cn.afterturn</groupId>
    <artifactId>easypoi-web</artifactId>
    <version>3.0.1</version>
</dependency>
<dependency>
    <groupId>cn.afterturn</groupId>
    <artifactId>easypoi-annotation</artifactId>
    <version>3.0.1</version>
</dependency>
```

#### 表格导出工具类

> 表格工具类

```java
package com.apai.util.mypoi;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import cn.afterturn.easypoi.excel.entity.enmus.ExcelType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Excel导入导出工具类
 *
 * @author Tellsea
 * @date 2019/9/4
 * 官方文档：http://easypoi.mydoc.io/
 * 参考文章：https://blog.csdn.net/Thinkingcao/article/details/85005930
 */
@Slf4j
public class EasyPoiExcelUtils {

    public static void exportExcel(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName,
                                   boolean isCreateHeader, HttpServletResponse response) {
        ExportParams exportParams = new ExportParams(title, sheetName);
        exportParams.setCreateHeadRows(isCreateHeader);
        defaultExport(list, pojoClass, fileName, response, exportParams);
    }

    public static void exportExcel(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName,
                                   HttpServletResponse response) {
        defaultExport(list, pojoClass, fileName, response, new ExportParams(title, sheetName));
    }

    public static void exportExcel(List<Map<String, Object>> list, String fileName, HttpServletResponse response) {
        defaultExport(list, fileName, response);
    }

    private static void defaultExport(List<?> list, Class<?> pojoClass, String fileName, HttpServletResponse response,
                                      ExportParams exportParams) {
        Workbook workbook = ExcelExportUtil.exportExcel(exportParams, pojoClass, list);
        downLoadExcel(fileName, response, workbook);
    }

    private static void downLoadExcel(String fileName, HttpServletResponse response, Workbook workbook) {
        try {
            response.setCharacterEncoding("UTF-8");
            response.setHeader("content-Type", "application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));
            workbook.write(response.getOutputStream());
        } catch (IOException e) {
            log.error("EasyPoiExcelUtils: 下载错误");
        }
    }

    private static void defaultExport(List<Map<String, Object>> list, String fileName, HttpServletResponse response) {
        Workbook workbook = ExcelExportUtil.exportExcel(list, ExcelType.HSSF);
        downLoadExcel(fileName, response, workbook);
    }

    public static <T> List<T> importExcel(String filePath, Integer titleRows, Integer headerRows, Class<T> pojoClass) {
        if (StringUtils.isBlank(filePath)) {
            return null;
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        List<T> list = null;
        try {
            list = ExcelImportUtil.importExcel(new File(filePath), pojoClass, params);
        } catch (NoSuchElementException e) {
            log.error("EasyPoiExcelUtils: 模板不能为空");
        } catch (Exception e) {
            e.printStackTrace();
            log.error("EasyPoiExcelUtils: 导入错误");
        }
        return list;
    }

    public static <T> List<T> importExcel(MultipartFile file, Integer titleRows, Integer headerRows,Class<T> pojoClass) {
        if (file == null) {
            return null;
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        List<T> list = null;
        try {
            list = ExcelImportUtil.importExcel(file.getInputStream(), pojoClass, params);
        } catch (NoSuchElementException e) {
            log.error("EasyPoiExcelUtils: excel文件不能为空");
        } catch (Exception e) {
            log.error("EasyPoiExcelUtils: 导入错误");
        }
        return list;
    }
}
```

> 时间处理工具类

```java
package com.apai.util.mypoi;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 时间处理工具类
 *
 * @author: Tellsea
 * @date: 2019/08/02
 */
public class DateUtils {

    public static String getCurrMonthLastDay(){
        Calendar cale = Calendar.getInstance();
        String lastDay;
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, 0);
        lastDay = yyyy_MM_dd.format(cale.getTime());
        return lastDay;
    }

    public static final SimpleDateFormat yyyy_MM_dd = new SimpleDateFormat("yyyy-MM-dd");
    public static final SimpleDateFormat yyyy_MM_dd_HH_mm_ss = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static final SimpleDateFormat yyyyMMdd = new SimpleDateFormat("yyyyMMdd");

    public static final SimpleDateFormat yyyyMMddHHMMSS = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
    public static final SimpleDateFormat yyyyMMddHHMM = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    public static final SimpleDateFormat yyMMdd = new SimpleDateFormat("yyMMdd");




    public static String getYYYYMMdd() {
        return yyyy_MM_dd.format(new Date());
    }

    public static String getYYYYMMdd2() {
        return yyyyMMdd.format(new Date());
    }
    public static String getYYMMdd() {
        return yyMMdd.format(new Date());
    }

    public static String yyyyMMddHHMMSS() {
        return yyyyMMddHHMMSS.format(new Date());
    }

    public static String yyyyMMddHHMM() {
        return yyyyMMddHHMM.format(new Date());
    }

    public static String yyyy_MM_dd_HHMMSS() {
        return yyyy_MM_dd_HH_mm_ss.format(new Date());
    }

    /**
     * 得到当前时间 yyyyMMddHHmm
     * @return
     */
    public static String farmtDateMin() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
        String str = sdf.format(new Date());
        return str;
    }

    /**
     * 补全时间-时分秒
     *
     * @return
     */
    public static String completTimeBefor(String date) {
        return date.concat(" ").concat("00:00:00");
    }

    /**
     * 补全时间-时分秒
     *
     * @return
     */
    public static String completTimeAfter(String date) {
        return date.concat(" ").concat("23:59:59");
    }

    /**
     * 获得当前时间，指定格式
     *
     * @param format
     * @return
     */
    public static String getDate(String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(new Date());
    }

    /**
     * 获取当前日期的上一个周的日期区间
     *
     * @return
     */
    public static String getFirstTimeInterval() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar1 = Calendar.getInstance();
        int dayOfWeek = calendar1.get(Calendar.DAY_OF_WEEK) - 1;
        int offset1 = 1 - dayOfWeek;
        calendar1.add(Calendar.DATE, offset1 - 7);
        String lastBeginDate = sdf.format(calendar1.getTime());
        return lastBeginDate;
    }

    /**
     * 获取当前日期的上一个周的日期区间
     *
     * @return
     */
    public static String getLastTimeInterval() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar2 = Calendar.getInstance();
        int dayOfWeek = calendar2.get(Calendar.DAY_OF_WEEK) - 1;
        int offset2 = 7 - dayOfWeek;
        calendar2.add(Calendar.DATE, offset2 - 7);
        String lastEndDate = sdf.format(calendar2.getTime());
        return lastEndDate;
    }

    /**
     * 获取过去第几天的日期
     *
     * @param past
     * @return
     */
    public static String getPastDate(int past) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) - past + 1);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        return result;
    }

    /**
     * 获取过去第几天的星期
     *
     * @param past
     * @return
     */
    public static String getPastWeek(int past) {
        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "ddd", "ddds"};
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) - past + 1);
        int w = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        if (w > 6) {
            w = 0;
        }
        return weekDays[w];
    }

    /**
     * 获取过去或者未来 任意天内的日期数组
     *
     * @param intervals intervals天内
     * @return 日期数组
     */
    public static ArrayList<String> getDateStrArr(int intervals) {
        ArrayList<String> pastDaysList = new ArrayList<>();
        ArrayList<String> fetureDaysList = new ArrayList<>();
        // for (int i = 0; i < intervals; i++) {
        for (int i = intervals; i > 0; i--) {
            pastDaysList.add("\"" + getPastDate(i) + "\"");
            fetureDaysList.add(getFetureDate(i));
        }
        return pastDaysList;
    }

    /**
     * 获取过去 任意天内的星期数组
     *
     * @param intervals intervals天内
     * @return 星期数组
     */
    public static ArrayList<String> getWeekStrArr(int intervals) {
        ArrayList<String> pastWeekList = new ArrayList<>();
        ArrayList<String> fetureWeekList = new ArrayList<>();
        // for (int i = 0; i < intervals; i++) {
        for (int i = intervals; i > 0; i--) {
            pastWeekList.add("\"" + getPastWeek(i) + "\"");
            fetureWeekList.add(getFetureDate(i));
        }
        return pastWeekList;
    }

    /**
     * 获取未来 第 past 天的日期
     *
     * @param past
     * @return
     */
    public static String getFetureDate(int past) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + past);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        return result;
    }

    /**
     * 计算时间段内的天数
     *
     * @param startTimes 开始时间
     * @param endTimes   结束时间
     * @return
     */
    public static List<String> getAllDates(String startTimes, String endTimes) {
        List<String> list = new ArrayList<>();
        // 拆分成数组
        String[] dateBegs = startTimes.split("-");
        String[] dateEnds = endTimes.split("-");
        // 开始时间转换成时间戳
        Calendar start = Calendar.getInstance();
        start.set(Integer.valueOf(dateBegs[0]), Integer.valueOf(dateBegs[1]) - 1, Integer.valueOf(dateBegs[2]));
        Long startTIme = start.getTimeInMillis();
        // 结束时间转换成时间戳
        Calendar end = Calendar.getInstance();
        end.set(Integer.valueOf(dateEnds[0]), Integer.valueOf(dateEnds[1]) - 1, Integer.valueOf(dateEnds[2]));
        Long endTime = end.getTimeInMillis();
        // 定义一个一天的时间戳时长
        Long oneDay = 1000 * 60 * 60 * 24L;
        Long time = startTIme;
        // 循环得出
        while (time <= endTime) {
            list.add(new SimpleDateFormat("yyyy-MM-dd").format(new Date(time)));
            time += oneDay;
        }
        return list;
    }

    /**
     * 获取当前日期的月份字符串
     * @return
     */
    public static String getMonthString(){
        Calendar cal=Calendar.getInstance();//使用日历类
        int month=cal.get(Calendar.MONTH)+1;//得到月，因为从0开始的，所以要加1
        if(month < 10){
            return "0"+month;
        }else {
            return String.valueOf(month);
        }
    }

    public static void main(String[] args) {
        System.out.println(getCurrMonthLastDay());
    }
}

```

#### 表格导入工具类

```java
package com.apai.util.mypoi;

import org.apache.poi.POIXMLDocument;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.io.PushbackInputStream;

/**
 * @author yjy
 * @create 2021/8/18 11:54
 */
public class ExcelUtils {

    public static Workbook create(InputStream in) throws
            IOException, InvalidFormatException {
        if (!in.markSupported()) {
            in = new PushbackInputStream(in, 8);
        }
        if (POIFSFileSystem.hasPOIFSHeader(in)) {
            return new HSSFWorkbook(in);
        }
        if (POIXMLDocument.hasOOXMLHeader(in)) {
            return new XSSFWorkbook(OPCPackage.open(in));
        }
        throw new IllegalArgumentException("你的excel版本目前poi解析不了");
    }

}
```

#### 图片导出工具类

```java
package com.my.pin.util;

import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;


/**
 * @author EDZ
 */
public class ExcelImgUtils {
    public static void excelmg(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            int cols = col + 1;
            int rows = row + 1;
            XSSFClientAnchor anchor = new XSSFClientAnchor(10000*20, 10000*5, -10000*20, -10000*5, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelmg(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row,int cols, int rows){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            XSSFClientAnchor anchor = new XSSFClientAnchor(10000*20, 10000*5, -10000*20, -10000*5, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelImg(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            int cols = col + 1;
            int rows = row + 1;
            XSSFClientAnchor anchor = new XSSFClientAnchor(0, 0, 0, -10000*50, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelmgQuo(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row,int cols, int rows){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            XSSFClientAnchor anchor = new XSSFClientAnchor(10000*15, 10000*20, -10000*15, -10000*20, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelImg2(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            int cols = col + 1;
            int rows = row + 3;
            XSSFClientAnchor anchor = new XSSFClientAnchor(10000, 0, -10000,0, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelImg3(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            int cols = col + 1;
            int rows = row + 1;
            XSSFClientAnchor anchor = new XSSFClientAnchor(2*10000, 2*10000, -10000, -10000*15, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void excelImg4(String filePath, XSSFWorkbook workbook, XSSFSheet sheet, int col, int row){
        filePath = filePath.substring(5,filePath.length());
        filePath= FileUtils.UPLOAD_PATH +filePath;
        BufferedImage bufferImage = null;
        try {
            // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bufferImage = ImageIO.read(new File(filePath));
            ColorModel color = bufferImage.getColorModel();
            int pixelSize=color.getPixelSize();
            if (pixelSize!=24){
                //读取png图片路径
                ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
                Image i = ii.getImage();
                Image resizedImage = i.getScaledInstance(bufferImage.getWidth(),bufferImage.getHeight(), Image.SCALE_SMOOTH);
                Image temp = new ImageIcon(resizedImage).getImage();
                BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
                Graphics2D gd = bufferedImage.createGraphics();
                bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(),bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
                gd = bufferedImage.createGraphics();
                gd.drawImage(temp, 0, 0, null);
                ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            }else {
                ImageIO.write(bufferImage, "png", byteArrayOutputStream);
            }
            // 准备插入图片
            XSSFDrawing patriarch = sheet.createDrawingPatriarch();
            int cols = col + 1;
            int rows = row + 1;
            XSSFClientAnchor anchor = new XSSFClientAnchor(0, 10000*10, 0, -10000*10, (short) col, row, (short) cols, rows);
            // 准备插入图片
            byte[] pictureData = byteArrayOutputStream.toByteArray();
            int pictureFormat = XSSFWorkbook.PICTURE_TYPE_JPEG;
            int pictureIndex = workbook.addPicture(pictureData,pictureFormat);
            patriarch.createPicture(anchor, pictureIndex);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private static byte[] getPicture(String filePath) throws IOException {
        filePath = filePath.substring(5, filePath.length());
        filePath = FileUtils.UPLOAD_PATH + filePath;
        BufferedImage bufferImage = null;
        // 先把读入的图片放到第一个 ByteArrayOutputStream 中，用于产生ByteArray
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bufferImage = ImageIO.read(new File(filePath));
        ColorModel color = bufferImage.getColorModel();
        int pixelSize = color.getPixelSize();
        if (pixelSize != 24) {
            //读取png图片路径
            ImageIcon ii = new ImageIcon(new File(filePath).getCanonicalPath());
            Image i = ii.getImage();
            Image resizedImage = i.getScaledInstance(bufferImage.getWidth(), bufferImage.getHeight(), Image.SCALE_SMOOTH);
            Image temp = new ImageIcon(resizedImage).getImage();
            BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null), temp.getHeight(null), BufferedImage.TYPE_INT_BGR);
            Graphics2D gd = bufferedImage.createGraphics();
            bufferedImage = gd.getDeviceConfiguration().createCompatibleImage(bufferImage.getWidth(), bufferImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
            gd = bufferedImage.createGraphics();
            gd.drawImage(temp, 0, 0, null);
            ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
        } else {
            ImageIO.write(bufferImage, "png", byteArrayOutputStream);
        }
        // 图片字节
        return byteArrayOutputStream.toByteArray();
    }

}
```



### 表格导出

#### 1.使用注解导出

> 缺点: 只能是导出普通的表格文本数据  对于图片 动态的字段 无法实现

**实体类注解**

```java
// @Excel(name = "表格列名" , orderNum = "指定列的位置列号") | 具体可点击注解查看参数 下载源码为中文
@Excel(name = "用户ID" , orderNum = "1")
```

**表现层接口导出**

```java
// 匿名访问 | Security 需要放行
@AnonymousAccess
@GetMapping(value = "/userlist")
public void saletableList(HttpServletResponse response) throws IOException {
    /// 1.获取数据
    List<User> list = userMapper.selectList(null);
    // 2.设置表格标题
    String fileName = "用户列表";
    // 3.开始导出 Excel [导出的数据集合, 表格标题, sheet1, 实体类的class对象, 表格文件名称]
    EasyPoiExcelUtils.exportExcel(list, fileName, "sheet1", User.class, "用户信息列表-" + DateUtils.farmtDateMin() + ".xls", response);
}
```

```java
// 匿名访问 | Security 需要放行
@AnonymousAccess
@GetMapping(value = "/userlist")
public void saletableList(HttpServletResponse response) throws IOException {
    // 1.获取数据
    List<User> list = userMapper.selectList(null);
    // LocalDateTime_时间 无法直接格式化 | 可以再实体类加上字符串字段来储存手动格式化时间的数据 然后使用该字段进行导出表格
    for (User user : list) {
        // 设置时间格式化的格式
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 进行格式化
        String bir = dateTimeFormatter.format(user.getUserBirthday());
        String reg = dateTimeFormatter.format(user.getUserRegisdate());
        // 将格式化的时间储存 导出表格
        user.setBigDecimal(bir);
        user.setRegisdate(reg);
    }
    // 2.设置表格标题
    String fileName = "用户列表";
    // 3.开始导出 Excel [导出的数据集合, 表格标题, sheet1, 实体类的class对象, 表格文件名称]
    EasyPoiExcelUtils.exportExcel(list, fileName, "sheet1", User.class, "用户信息列表-" + DateUtils.farmtDateMin() + ".xls", response);
}
```



#### 2.遍历导出

> 数据字段为动态添加无法使用常规的实体类注解导出时使用该方法

```java
@PostMapping("exportExcel")
@ResponseBody
public void deliveryAnalysisExportExcel(@RequestBody TestGet testGet1, HttpServletResponse response) throws IOException {
    TestGet testGet = new TestGet("是阿派啊", 18);
    // ------------------------------创建动态字段---------------------------------
    LinkedHashMap<String, Object> addMap = new LinkedHashMap();
    addMap.put("name", testGet.getName());
    addMap.put("age", testGet.getAge());
    addMap.put("w1", "2021-11-11");
    addMap.put("w2", "2021-11-12");
    addMap.put("w3", "2021-11-13");
    addMap.put("w4", "2021-11-14");
    Object target = ReflectUtil.getTarget(testGet, addMap);
    List<Object> list = new ArrayList<>();
    list.add(target);
    list.add(target);
    list.add(target);
    // ------------------------------创建excel表格---------------------------------
    // 创建一个工作薄
    XSSFWorkbook wb = new XSSFWorkbook();
    //创建一个sheet
    XSSFSheet sheet = wb.createSheet("动态表头测试表");
    //标题样式
    XSSFCellStyle cs2=wb.createCellStyle();
    cs2.setAlignment(HorizontalAlignment.CENTER);
    cs2.setVerticalAlignment(VerticalAlignment.CENTER);
    cs2.setWrapText(true);
    XSSFFont font = wb.createFont();
    font.setBold(true);//粗体
    font.setFontHeight(20);
    cs2.setFont(font);
    //表格样式
    XSSFCellStyle cs=wb.createCellStyle();
    cs.setAlignment(HorizontalAlignment.CENTER);
    cs.setVerticalAlignment(VerticalAlignment.CENTER);
    cs.setWrapText(true);
    cs.setBorderTop(BorderStyle.MEDIUM);
    cs.setBorderBottom(BorderStyle.MEDIUM);
    cs.setBorderLeft(BorderStyle.MEDIUM);
    cs.setBorderRight(BorderStyle.MEDIUM);
    //第一行
    XSSFRow row = sheet.createRow(0);
    row.setHeight((short) (20*30));
    String title = "动态写入表格";
    XSSFCell cell = row.createCell((short)0);
    cell.setCellValue(title);
    cell.setCellStyle(cs2);
    sheet.addMergedRegion(new CellRangeAddress(0,0,0,21));
    //第二行 列名
    XSSFRow row2 = sheet.createRow(1);
    row2.setHeight((short) (20*20));
    String[] cellArr={"名称","年龄","w1","w2","w3"};
    for (int i=0;i<cellArr.length;i++){
        XSSFCell cell7 = row2.createCell((short)i);
        cell7.setCellValue(cellArr[i]);
        sheet.setColumnWidth(i, (cellArr[i].getBytes().length + 4) * 256);
        cell7.setCellStyle(cs);
    }
    // 第三行开始写入数据
    for (int i = 0; i < list.size(); i++) {
        // 将单个动态字段对象转换为map
        Map map = JSONObject.parseObject(JSONObject.toJSONString(list.get(i)), Map.class);
        XSSFRow row3 = sheet.createRow(i + 2);
        row3.setHeight((short) (20*20));
        //第1列
        XSSFCell dataCell1 = row3.createCell((short)0);
        dataCell1.setCellValue((String)map.get("name"));
        dataCell1.setCellStyle(cs);
        //第2列
        XSSFCell dataCell2 = row3.createCell((short)1);
        dataCell2.setCellValue((Integer)map.get("age"));
        dataCell2.setCellStyle(cs);
        //第3列
        XSSFCell dataCell3 = row3.createCell((short)2);
        dataCell3.setCellValue((String)map.get("w1"));
        dataCell3.setCellStyle(cs);
        //第4列
        XSSFCell dataCell4 = row3.createCell((short)3);
        dataCell4.setCellValue((String)map.get("w2"));
        dataCell4.setCellStyle(cs);
        //第5列
        XSSFCell dataCell5 = row3.createCell((short)4);
        dataCell5.setCellValue((String)map.get("w3"));
        dataCell5.setCellStyle(cs);

    }
    // ------------------------------导出excel表格---------------------------------
    // 注意: 接口输出的乱码内容 前端处理下载 | 还在复制内容修改文件后缀 xls
    String fileName="表格导出测试";
    OutputStream output = response.getOutputStream();
    response.addHeader("Content-Disposition", "inline;filename="
                       + fileName + ".xls");
    response.setContentType("application/msexcel");
    wb.write(output);
    output.close();
}
```

#### 3.图片导出

```java
/**
* 导出应收记录 excel
* @param receivableBillRecordVo
* @param response
* @throws IOException
*/
@PostMapping("enterBillRecordExportExcel")
@ResponseBody
public void exportExcelDetail(@RequestBody ReceivableBillRecordVo receivableBillRecordVo, HttpServletResponse response) throws IOException {
    UserInfoVo user = RedisUtils.getUser();
    receivableBillRecordVo.setCompanyId(user.getCompanyId());
    receivableBillRecordVo.setPage(1);
    receivableBillRecordVo.setLimit(Integer.MAX_VALUE);
    List<ReceivableBillRecordVo> lists = receivableBillAoDaClient.enterBillRecordList(receivableBillRecordVo);
    List<ReceivableBillRecordExcelVo> list = MyGetAnnotations.copyListProperties(lists,ReceivableBillRecordExcelVo::new);

    // 创建一个工作薄
    XSSFWorkbook wb = new XSSFWorkbook();
    //创建一个sheet
    XSSFSheet sheet = wb.createSheet("客户返利");
    //设置自适应
    XSSFCellStyle cs=wb.createCellStyle();
    //水平居中
    cs.setAlignment(HorizontalAlignment.CENTER);
    //垂直居中
    cs.setVerticalAlignment(VerticalAlignment.CENTER);
    cs.setWrapText(true);
    //上边框
    cs.setBorderTop(BorderStyle.MEDIUM);
    //下边框
    cs.setBorderBottom(BorderStyle.MEDIUM);
    //左边框
    cs.setBorderLeft(BorderStyle.MEDIUM);
    //右边框
    cs.setBorderRight(BorderStyle.MEDIUM);
    //第一行
    XSSFRow row = sheet.createRow(0);
    row.setHeight((short) (20*20));
    String[] cellArr = {"客户", "结算单号", "收款凭证"};
    for (int i=0;i<cellArr.length;i++){
        XSSFCell cell = row.createCell((short)i);
        cell.setCellValue(cellArr[i]);
        sheet.setColumnWidth(i, (cellArr[i].getBytes().length + 4) * 256);
        cell.setCellStyle(cs);
    }

    for (int i=0;i<list.size();i++) {
        //创建行
        XSSFRow createRow = sheet.createRow((i + 1));
        createRow.setHeight((short) (20 * 87));

        //客户列
        XSSFCell cell1 = createRow.createCell((short) 0);
        cell1.setCellValue(list.get(i).getCustomerName());
        if (list.get(i).getCustomerName() != null && !list.get(i).getCustomerName().equals("")) {
            sheet.setColumnWidth(0, (list.get(i).getCustomerName().getBytes().length + 4) * 256);
        }
        cell1.setCellStyle(cs);

        // 结算单号
        XSSFCell cell2 = createRow.createCell((short) 1);
        cell2.setCellValue(list.get(i).getOrderNumber());
        if (list.get(i).getOrderNumber() != null && !list.get(i).getOrderNumber().equals("")) {
            sheet.setColumnWidth(1, (list.get(i).getOrderNumber().getBytes().length + 4) * 256);
        }
        cell2.setCellStyle(cs);

        // 收款凭证 导出时带上图片
        XSSFCell cell13 = createRow.createCell((short)12);
        if (list.get(i).getPicture() != null && !list.get(i).getPicture().equals("")) {
            // 设置图片的位置
            ExcelImgUtils.excelmg(list.get(i).getPicture(), wb, sheet, 2, (i + 1));
        }
        // 设置图片的位置
        sheet.setColumnWidth(2, 19 * 256);
        cell13.setCellStyle(cs);

    }
    String fileName="客户返利记录";
    OutputStream output = response.getOutputStream();
    response.addHeader("Content-Disposition", "inline;filename="
                       + fileName + ".xls");
    response.setContentType("application/msexcel");
    wb.write(output);
    output.close();
}
```



#### 避坑指南

##### 导出时间格式问题

> 可在实体类字段什么加上注解 指定导出时时间的格式

```java
// 详情参数点击注解查看中文备注 | 注意: LocalDateTime 导出格式化时间会无法生效
@Excel(name = "时间" , orderNum = "1", format = "yyyy-MM-dd HH:mm:ss")
private Date date;
```

| LocalDateTime_时间      | LocalDate_时间 | Date_时间           | String_时间         |
| ----------------------- | -------------- | ------------------- | ------------------- |
| 2022-10-17T23:35:23.646 | 2022-10-17     | 2022-10-17 23:35:23 | 2022-10-17 23:08:42 |

##### 字段的状态转换

> 如: 状态的状态  1 -> 通过  2 -> 不通过

```java
@Excel(name = "审核状态",orderNum="19", replace= {"待审核_1", "审核不通过_2", "审核通过_3"})
@ApiModelProperty(value = "审核状态")
private Integer auditStatus;
```



### 表格导入

前端文件表单提交

```html
<form action="http://localhost:1025/download/impuserlist" enctype="multipart/form-data" method="post">
    <label>表格导入测试:</label>
    <input type="file" name="file" required />
    <input type="submit" value="提交" />
</form>
```

#### 表格导入接口

```java
// 匿名访问 | Security 需要放行
@AnonymousAccess
@PostMapping(value = "/impuserlist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public String importExcel(@RequestPart("file") MultipartFile file) throws Exception {
    if (Objects.equals(file,null)){
        return "请添加附件";
    }else {
        return userService.importExcel(file);
    }
}
```

#### 1.表格导入业务层执行

```java
package com.apai.service.impl;

import com.apai.entity.User;
import com.apai.mapper.UserMapper;
import com.apai.service.IUserService;
import com.apai.util.mypoi.ExcelUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public String importExcel(MultipartFile file) throws Exception {
        // 获取文件
        InputStream inputStream = file.getInputStream();
        Workbook workbook = ExcelUtils.create(inputStream);
        // 集合 储存表格的数据
        List<User> list = new ArrayList<>();
        // 创建 实体类对象 储存每一行数据
        User bean = null;
        // 创建变量返回对应信息
        StringBuilder msg = new StringBuilder();

        // 循环工作表 将数据储存list 并校验每格数据
        for (int numSheet = 0; numSheet < workbook.getNumberOfSheets(); numSheet++) {
            Sheet sheet = workbook.getSheetAt(numSheet);
            if (sheet != null) {
                // 循环每一行 Row
                for (int rowNum = 2; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    // 每一行的数据
                    Row row = sheet.getRow(rowNum);
                    if (row != null) {
                        // 创建 实体类对象 储存每一行数据
                        bean = new User();

                        // 获取该行的第二格 | 从0开始为第一格数据
                        Cell userName = row.getCell(1);
                        // 可对数据进行校验是否符合要求 具体按业务的=来校验
                        if (Objects.equals(userName.toString(), "")) {
                            msg.append("第").append(rowNum).append("行").append("用户账号为空").append(",");
                        }
                        // 实体类赋值
                        bean.setUserName(userName.toString());

                        Cell userAccount = row.getCell(2);
                        if (Objects.equals(userAccount.toString(), "")) {
                            msg.append("第").append(rowNum).append("行").append("用户名称为空").append(",");
                        }
                        bean.setUserAccount(userAccount.toString());
                        Cell userPhone = row.getCell(3);
                        if (Objects.equals(userPhone.toString(), "")) {
                            msg.append("第").append(rowNum).append("行").append("用户手机号为空").append(",");
                        }
                        bean.setUserPhone(userPhone.toString());

                        // 储存该行数据到list
                        list.add(bean);
                    }
                }
            }
        }
        if (!Objects.equals(msg.toString(), "")) {
            return msg.deleteCharAt(msg.length() - 1).toString();
        }
        // 遍历执行添加数据操作
        list.forEach(item -> userMapper.insert(item));
        return msg.append("导入成功").toString();
    }
}
```

#### 2.带图片导入

> 需基于 文件工具类 

```java
public R importExcelSpuDevelopApplyFor(MultipartFile file) throws Exception {
    UserInfoVo userInfoVo = RedisUtils.getUser();
    // 获取文件输入流
    InputStream inputStream = file.getInputStream();
    Workbook workbook = WorkbookFactory.create(inputStream);
    // 定义输出Msg
    StringBuilder msg = new StringBuilder();
    // 定义实体类存储单条数据
    SpuDevelopApplyForVo bean;
    // 定义集合存储所有数据 批量校验后添加
    List<SpuDevelopApplyForVo> spuList = new ArrayList<>();
    for (int numSheet = 0; numSheet < workbook.getNumberOfSheets(); numSheet++) {
        Sheet sheet = workbook.getSheetAt(numSheet);
        if (sheet != null){
            // 循环行Row
            for (int rowNum = 2; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row != null) {
                    // 获取图片
                    Map<String, byte[]> picMap = ExcelPictureUtils.getPictures2((XSSFSheet) sheet);
                    bean = new SpuDevelopApplyForVo();
                    bean.setStatus(1);
                    bean.setCompanyId(userInfoVo.getCompanyId());
                    bean.setCreateUser(userInfoVo.getId());
                    bean.setCreateTime(DateUtil.now());
                    bean.setOrderNumber("KFC" + MyGetAnnotations.getCodeStr());
                    // 待审核 0
                    bean.setAuditStatus(WAITING_AUDIT);
                    // 循环列Cell 获取每个单元格的值
                    String subjectName = Objects.isNull(row.getCell(0)) ? "" : row.getCell(0).toString();
                    String projectName = Objects.isNull(row.getCell(1)) ? "" : row.getCell(1).toString();
                    String categoryName = Objects.isNull(row.getCell(2)) ? "" : row.getCell(2).toString();
                    String spuName = Objects.isNull(row.getCell(3)) ? "" : row.getCell(3).toString();
                    String dimSpuClassName = Objects.isNull(row.getCell(4)) ? "" : row.getCell(4).toString();
                    String busiUserName = Objects.isNull(row.getCell(5)) ? "" : row.getCell(5).toString();
                    String busiDate = Objects.isNull(row.getCell(6)) ? "" : row.getCell(6).toString();
                    String customer = Objects.isNull(row.getCell(7)) ? "" : row.getCell(7).toString();
                    String developReasons = Objects.isNull(row.getCell(8)) ? "" : row.getCell(8).toString();
                    String primeCost = Objects.isNull(row.getCell(9)) ? "" : row.getCell(9).toString();
                    String sellingPrice = Objects.isNull(row.getCell(10)) ? "" : row.getCell(10).toString();
                    String marketPositioning = Objects.isNull(row.getCell(11)) ? "" : row.getCell(11).toString();
                    String collectionStyle = Objects.isNull(row.getCell(12)) ? "" : row.getCell(12).toString();
                    String salesForecast = Objects.isNull(row.getCell(13)) ? "" : row.getCell(13).toString();
                    String standardRequirements = Objects.isNull(row.getCell(14)) ? "" : row.getCell(14).toString();
                    String deliveryDate = Objects.isNull(row.getCell(15)) ? "" : row.getCell(15).toString();
                    String sampleQuantity = Objects.isNull(row.getCell(16)) ? "" : row.getCell(16).toString();
                    String productDemand = Objects.isNull(row.getCell(17)) ? "" : row.getCell(17).toString();
                    String remarks = Objects.isNull(row.getCell(18)) ? "" : row.getCell(18).toString();
                    // 存储数据实体类
                    bean.setSubjectName(subjectName);
                    bean.setProjectName(projectName);
                    bean.setCategoryName(categoryName);
                    bean.setSpuName(spuName);
                    bean.setDimSpuClassName(dimSpuClassName);
                    bean.setBusiUserName(busiUserName);
                    bean.setBusiDate(busiDate);
                    bean.setCustomer(customer);
                    bean.setDevelopReasons(developReasons);
                    bean.setPrimeCost(primeCost);
                    bean.setSellingPrice(sellingPrice);
                    bean.setMarketPositioning(marketPositioning);
                    bean.setCollectionStyle(collectionStyle);
                    bean.setSalesForecast(salesForecast);
                    bean.setStandardRequirements(standardRequirements);
                    bean.setDeliveryDate(deliveryDate);
                    bean.setSampleQuantity(sampleQuantity);
                    bean.setProductDemand(productDemand);
                    bean.setRemarks(remarks);
                    // 图片导入
                    byte[] pictureData = picMap.get(rowNum + "-" + 19);
                    String path = "";
                    if (pictureData != null) {
                        String pictureVal = OrderNumberUtils.orderNumber("MT");
                        // 存储路径
                        path = FileUtils.UPLOAD_PATH + "/spuDevelopApplyFor/" + DateUtil.today() + "/" + pictureVal + ".png";
                        //如不存在则创建目录及文件
                        FileUtil.touch(path);
                        // 流写入
                        FileOutputStream out = new FileOutputStream(path);
                        out.write(pictureData);
                        out.close();
                        if (!ExcelPictureUtils.checkImageSize(path)) {
                            msg.append("第").append(rowNum).append("行图片不能超过1M，请检查Excel！");
                        }
                        //图片路径
                        String pictureImg = FileUtils.SERVER_PREFIX + "/spuDevelopApplyFor/" + DateUtil.today() + "/" + pictureVal + ".png";
                        bean.setPicture(pictureImg);
                    }
                    // 添加到实体类集合 后续批量添加
                    spuList.add(bean);
                }
            }
        }
    }
    // 进行数据校验
    SpuDevelopApplyForExcelUtils excelUtils = new SpuDevelopApplyForExcelUtils();
    String returnMsg = excelUtils.verifySpuDevelopApplyFor(spuList);
    msg.append(returnMsg);
    if (!Objects.equals(msg.toString(), "")) {
        return R.error(msg.deleteCharAt(msg.length() - 1).toString());
    }
    // 新增
    List<SpuDevelopApplyForVo> spuDevelopApplyForVoList = excelUtils.retureSpuDevelopApplyForVoList();
    baseMapper.batchSaveSpuDevelopApplyFor(spuDevelopApplyForVoList);
    // 判断该模块是否需要审核
    boolean needAudit = auditRuleClient.isNeedAudit(AuditModuleConst.SPU_DEVELOP_APPLY_FOR);
    if (needAudit) {
        // 该模块需要审核
        for (SpuDevelopApplyForVo spuDevelopApplyForVo : spuDevelopApplyForVoList) {
            // 添加图片表
            SpuDevelopApplyForPicture p = new SpuDevelopApplyForPicture();
            p.setSpuDevelopApplyForId(spuDevelopApplyForVo.getId());
            p.setFilePath(spuDevelopApplyForVo.getPicture());
            p.setCompanyId(spuDevelopApplyForVo.getCompanyId());
            spuDevelopApplyForPictureMapper.insert(p);
            // 添加审核记录
            auditRuleClient.addAuditLog(AuditModuleConst.SPU_DEVELOP_APPLY_FOR, spuDevelopApplyForVo.getId(),spuDevelopApplyForVo.getOrderNumber(),"");
        }
    } else {
        // 该模块不需要审核 直接设置 无需审核 批量修改
        baseMapper.batchUpdateAuditStatusById(spuDevelopApplyForVoList, NO_AUDIT);
    }
    return R.success("导入成功");
}
```

#### 导入表格与模板校验

- 原理: 获取实体类模板的标题 和 导入表格的标题  进行对比是否一致和顺序

> 反射获取实体类注解的标题值集合

```java
// 调用
Map<Integer, String> dims = MyGetAnnotations.getDeclaredFieldsInfo(new 实体类(), new HashMap<>());
```

```java
package com.apai.util.anzhujie;

import cn.afterturn.easypoi.excel.annotation.Excel;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class MyGetAnnotations {

    /**
     * 获取实体类中 Excel 注解的值
     * @param instance 实体类对象: new entity()
     * @param fieldMap 存储注解值的map: new HashMap<>()
     * @return Map<Integer, String> key: 标题列号  value: 标题名称
     */
    public static Map<Integer, String> getDeclaredFieldsInfo(Object instance, Map<String, String> fieldMap){
        Map<Integer, String> map = new HashMap();
        // 获取实体类的所有属性，返回 Field 数组
        Field[] fields = instance.getClass().getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            // 除过 fieldMap 中的属性，其他属性都获取
            if (!fieldMap.containsValue(fields[i].getName())) {
                // 判断是否包含 Excel 注解
                boolean annotationPresent = fields[i].isAnnotationPresent(Excel.class);
                if (annotationPresent) {
                    // 获取 Excel 注解的 name 属性
                    String name = fields[i].getAnnotation(Excel.class).name();
                    // 获取 Excel 注解的 orderNum 属性
                    Integer orderNum = Integer.parseInt(fields[i].getAnnotation(Excel.class).orderNum());
                    // 将 orderNum 和 name 存入 map 中
                    map.put(orderNum, name);
                }
            }
        }
        // 返回 map
        return map;
    }

}
```

> 校验标题内容和顺序

```java
// 判断 导入表格与模板是否一致 根据标题及顺序判断
// 反射获取实体类注解的标题值集合
Map<Integer, String> dims = MyGetAnnotations.getDeclaredFieldsInfo(new DimPackaging(), new HashMap<>());
// 遍历 获取导入表格的标题与实体类模板标题对比
for (int i = 1; i < dims.size(); i++) {
    // 获取导入表格的标题 | getRow(1 表格第二行).getCell(0 表格第一列) | 第一行或列都是从零开始
    String exceltitle = workbook.getSheetAt(0).getRow(1).getCell(i - 1).toString();
    // 对比
    if (!dims.get(i).equals(exceltitle)) {
        throw new WsException("导入的表格标题与模板不一致，请下载模板后重新导入");
    }
}
```

| 包装方式(示例) |              |            |          |          |          |
| -------------- | ------------ | ---------- | -------- | -------- | -------- |
| 中文包装方式   | 英文包装方案 | 保护层类型 | 内盒类型 | 中盒类型 | 外箱类型 |
| 防炸金属包装   | m            | 防水防潮   | 纸箱     | 钢板     | 铁皮     |



## AOP 切面实现操作日志

### 1.自定义注解

> 注解内部字段可进行对应的添加等 后续可在切面通知获取值

```java
package com.apai.util;

import java.lang.annotation.*;

/**
 *  AOP 实现操作日志记录
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MySysLog {

    String value() default ""; //操作内容
    String message() default "";  // 介绍
    String operation() default "";  // 日志类型

}
```

> 使用方法: 直接在业务层方法上面加上注解 对应给注解内的字段赋值 后续可在切面通知获取值

```java
@MySysLog(value = "查询用户列表")
@Override
public PageInfo pageuser(Integer pageNum, Integer pageSize) {
    //开始分页 可使用传参设置 页数 和 每页的数据条数
    PageHelper.startPage(pageNum, pageSize);
    //紧跟后面查询会被分页
    List<User> userList = userMapper.selectList(null);
    //将查询的list封装至PageInfo实例
    PageInfo<User> pageInfo = new PageInfo<>(userList);
    return pageInfo;
}
```

### 2.进行AOP 环绕通知

```java
package com.apai.util;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;


@Aspect
@Component
public class SysLogAop {

    @Around("@annotation(mysyslog)")
    public Object around(ProceedingJoinPoint point, MySysLog mysyslog) throws Throwable {
        System.out.println("环绕通知开始。。。。。");

        MethodSignature signature = (MethodSignature) point.getSignature();
        // 获取方法名称
        String methodName = signature.getName();
        System.out.println("方法名: " + methodName);
        // 获取方法的全名
        Method method = signature.getMethod();
        System.out.println("方法: " + method);
        // 获取方法所在的类名
        String name = point.getTarget().getClass().getName();
        System.out.println("类名: " + name);
        // 获取方法的参数
        Object[] args = point.getArgs();
        for (Object arg : args) {
            System.out.println("参数: " + arg);
        }
        // 获取当前的时间类型为 string
        String datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        System.out.println("当前时间: " + datetime);

        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String url = request.getRequestURL().toString();
        // 获取请求的 URL 地址
        System.out.println("URL : " + url);
        String get_post = request.getMethod();
        // 获取请求的方式 如: POST GET
        System.out.println("HTTP_METHOD : " + get_post);
        // 获取请求的 IP 地址
        String ipaddr = request.getRemoteAddr();
        System.out.println("IP : " + ipaddr);

        // 根据token获取用户名称
        String token = request.getHeader("token");
        String username = JwtTokenUtil.getUsername(token);
        System.out.println("根据token获取用户名称: " + username);

        //开始调用 时间计时并调用目标函数
        long start = System.currentTimeMillis();
        System.out.println("开始调用时间: " + start);

		// 执行接口业务层方法后再执行下方代码
        // 执行方法 | result: 包含了接口的请求传参和返回的所有数据 以及其他参数 | 但是无法直接调用
        Object result = point.proceed();
        
		// 接口业务处理结束获取数据计算耗时
        Long time = System.currentTimeMillis() - start;
        System.out.println("接口处理耗时: " + time);
        System.out.println("result进行str化: " + result.toString());
        System.out.println("环绕通知结束。。。。。");
        // 进行日志保存到数据库 | 返回接口的返回值
        return point.proceed();
    }

}
```

![image-20221004224758289](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221004224758289.png)



## 生成二维码

Hool 生成二维码参考: https://hutool.cn/docs/#/extra/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%B7%A5%E5%85%B7-QrCodeUtil

### 依赖

```xml
<!-- zxing生成二维码 -->
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.3.3</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.3.3</version>
</dependency>
```

### 工具类

```java
package com.apai.utils;

import cn.hutool.extra.qrcode.BufferedImageLuminanceSource;
import com.google.zxing.*;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Random;

/**
 * 二维码工具类
 */
public class QRCodeUtil {
    private static final String CHARSET = "utf-8";
    private static final String FORMAT_NAME = "JPG";
    // 二维码尺寸
    private static final int QRCODE_SIZE = 300;
    // LOGO宽度
    private static final int WIDTH = 60;
    // LOGO高度
    private static final int HEIGHT = 60;

    private static BufferedImage createImage(String content, String imgPath,
                                             boolean needCompress) throws Exception {
        Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.CHARACTER_SET, CHARSET);
        hints.put(EncodeHintType.MARGIN, 1);
        BitMatrix bitMatrix = new MultiFormatWriter().encode(content,
                BarcodeFormat.QR_CODE, QRCODE_SIZE, QRCODE_SIZE, hints);
        int width = bitMatrix.getWidth();
        int height = bitMatrix.getHeight();
        BufferedImage image = new BufferedImage(width, height,
                BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000
                        : 0xFFFFFFFF);
            }
        }
        if (imgPath == null || "".equals(imgPath)) {
            return image;
        }
        // 插入图片
        QRCodeUtil.insertImage(image, imgPath, needCompress);
        return image;
    }

    /**
     * 插入LOGO
     * @param source 二维码图片
     * @param imgPath LOGO图片地址
     * @param needCompress 是否压缩
     * @throws Exception
     */
    private static void insertImage(BufferedImage source, String imgPath,
                                    boolean needCompress) throws Exception {
        File file = new File(imgPath);
        if (!file.exists()) {
            System.err.println(""+imgPath+"   该文件不存在！");
            return;
        }
        Image src = ImageIO.read(new File(imgPath));
        int width = src.getWidth(null);
        int height = src.getHeight(null);
        if (needCompress) { // 压缩LOGO
            if (width > WIDTH) {
                width = WIDTH;
            }
            if (height > HEIGHT) {
                height = HEIGHT;
            }
            Image image = src.getScaledInstance(width, height,
                    Image.SCALE_SMOOTH);
            BufferedImage tag = new BufferedImage(width, height,
                    BufferedImage.TYPE_INT_RGB);
            Graphics g = tag.getGraphics();
            g.drawImage(image, 0, 0, null); // 绘制缩小后的图
            g.dispose();
            src = image;
        }
        // 插入LOGO
        Graphics2D graph = source.createGraphics();
        int x = (QRCODE_SIZE - width) / 2;
        int y = (QRCODE_SIZE - height) / 2;
        graph.drawImage(src, x, y, width, height, null);
        Shape shape = new RoundRectangle2D.Float(x, y, width, width, 6, 6);
        graph.setStroke(new BasicStroke(3f));
        graph.draw(shape);
        graph.dispose();
    }

    /**
     * 生成二维码(内嵌LOGO)
     * @param content 内容 | 链接网址可自动跳转
     * @param imgPath LOGO地址
     * @param destPath 存放目录
     * @param needCompress 是否压缩LOGO
     * @return fileStr:二维码图片名称
     * @throws Exception
     */
    public static String encode(String content, String imgPath, String destPath,
                              boolean needCompress) throws Exception {
        BufferedImage image = QRCodeUtil.createImage(content, imgPath,
                needCompress);
        mkdirs(destPath);
        String imgName = new Random().nextInt(99999999) + ".jpg";
        ImageIO.write(image, FORMAT_NAME, new File(destPath+"/" + imgName));
        return imgName;
    }

    /**
     * 当文件夹不存在时，mkdirs会自动创建多层目录，区别于mkdir．(mkdir如果父目录不存在则会抛出异常)
     * @author lanyuan
     * Email: mmm333zzz520@163.com
     * @date 2013-12-11 上午10:16:36
     * @param destPath 存放目录
     */
    public static void mkdirs(String destPath) {
        File file =new File(destPath);
        //当文件夹不存在时，mkdirs会自动创建多层目录，区别于mkdir．(mkdir如果父目录不存在则会抛出异常)
        if (!file.exists() && !file.isDirectory()) {
            file.mkdirs();
        }
    }

    /**
     * 生成二维码(内嵌LOGO)
     *
     * @param content 内容
     * @param imgPath LOGO地址
     * @param destPath 存储地址
     * @throws Exception
     */
    public static String encode(String content, String imgPath, String destPath)
            throws Exception {
        String imgName = QRCodeUtil.encode(content, imgPath, destPath, false);
        return imgName;
    }

    /**
     * 生成二维码
     * @param content 内容
     * @param destPath 存储地址
     * @param needCompress 是否压缩LOGO
     * @throws Exception
     */
    public static void encode(String content, String destPath, boolean needCompress) throws Exception {
        QRCodeUtil.encode(content, null, destPath, needCompress);
    }

    /**
     * 生成二维码 
     * @param content 内容
     * @param destPath 存储地址
     * @throws Exception
     */
    public static void encode(String content, String destPath) throws Exception {
        QRCodeUtil.encode(content, null, destPath, false);
    }

    /**
     * 生成二维码(内嵌LOGO) 
     * @param content 内容
     * @param imgPath LOGO地址
     * @param output 输出流
     * @param needCompress 是否压缩LOGO
     * @throws Exception
     */
    public static void encode(String content, String imgPath,
                              OutputStream output, boolean needCompress) throws Exception {
        BufferedImage image = QRCodeUtil.createImage(content, imgPath,
                needCompress);
        ImageIO.write(image, FORMAT_NAME, output);
    }

    /**
     * 生成二维码 | 流输出 前端使用img的src="http://localhost:8001/file/erweima2?type=1"接收
     * @param content 内容
     * @param output 输出流
     * @throws Exception
     */
    public static void encode(String content, OutputStream output)
            throws Exception {
        QRCodeUtil.encode(content, null, output, false);
    }

    /**
     * 解析二维码
     * @param file 二维码图片
     * @return
     * @throws Exception
     */
    public static String decode(File file) throws Exception {
        BufferedImage image;
        image = ImageIO.read(file);
        if (image == null) {
            return null;
        }
        BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(
                image);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        Result result;
        Hashtable<DecodeHintType, Object> hints = new Hashtable<DecodeHintType, Object>();
        hints.put(DecodeHintType.CHARACTER_SET, CHARSET);
        result = new MultiFormatReader().decode(bitmap, hints);
        String resultStr = result.getText();
        return resultStr;
    }

    /**
     * 解析二维码
     * @param path 二维码图片地址
     * @return 二维码内容
     * @throws Exception
     */
    public static String decode(String path) throws Exception {
        return QRCodeUtil.decode(new File(path));
    }

    // 测试方法
    public static void main(String[] args) throws Exception {
        String text = "https://www.baidu.com";  //这里设置自定义网站url
        String logoPath = "C:\\阿派_文件夹\\chat.jpg"; //插入的logo图片
        logoPath = null;
        String destPath = "C:\\阿派_文件夹\\work";
        QRCodeUtil.encode(text, logoPath, destPath, true);
    }

}
```

### 测试案例

```java
/**
* 生成二维码
* PS: 生成的二维码图片在本地目录下
* @param args
* @throws Exception
*/
public static void main(String[] args) throws Exception {
    // 存放在二维码中的内容,链接或者参数
    String text = "https://www.baidu.com";
    // String text = "文字内容";
    // 嵌入二维码的图片绝对路径也可以不放 logo图片
    String logoPath = "C:\\阿派_文件夹\\work11\\22.jpg";
    // 存放目录
    String destPath = "C:\\阿派_文件夹\\work11";
    // 调用方法生成二维码
    String encode = QRCodeUtil.encode(text, logoPath, destPath, true);
    // 解析二维码
    String str = QRCodeUtil.decode(destPath + "\\" + encode);
    System.out.println(str);
}

/**
* 二维码生成
* PS: 流输出 前端使用img的src="http://localhost:8001/file/erweima2?type=1"接收
* @param type
* @param servletResponse
* @throws Exception
*/
@GetMapping(value = "/erweima")
public void getCode2(int type , HttpServletResponse servletResponse) throws Exception {
    // 存放在二维码中的内容,链接或者参数
    String text = "https://www.baidu.com";
    // 调用方法生成二维码 | servletResponse.getOutputStream() 流输出
    QRCodeUtil.encode(text, servletResponse.getOutputStream());
}
```





## | --- 尽头是花开万里啊

### 查看对象在堆的数据

```xml
<!--显示对象在堆的布局信息-->
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.9</version>
</dependency>
```

```java
import org.openjdk.jol.info.ClassLayout;
public class ThreadPoolDemo {
    public static void main(String[] args){
        // 创建对象
        aaa aaa = new aaa();
        // 输出 对象在堆的布局信息
        System.out.println(ClassLayout.parseInstance(aaa).toPrintable());
    }
}

class aaa {
    int a;
    boolean aw;
    char ww;
    long cc;
    String str;
    Integer awe;
}
```

```java
int // 4字节
boolean // 1字节
char // 2字节
long // 8字节
String // 4字节 | 与值无关
Integer // 4字节
```

![image-20220915195142706](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220915195142706.png)

### 单例模式 | 线程安全

> 保证每次get方法获取的都是同一个实例对象

```java
package com.apai.springbootvue;

public class Singleton {
	// 创建 私有的 静态变量 禁止指令重排 的空对象属性
    private static volatile Singleton singleton = null;
	// 无参构造方法
    public Singleton() {
        System.out.println(Thread.currentThread().getName()+"\t  我是构造方法SingletonDemo() ");
    }
	
    public static Singleton getSingleton() {
        if(singleton == null){
            //同步代码块  加锁前后判断
            synchronized (Singleton.class){
                if(singleton == null){
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            new Thread(() -> {
                Singleton instance = Singleton.getSingleton();
                System.out.println(instance);
            }, String.valueOf("线程" + i)).start();
        }

    }

}
```

### 数组的递归求和

```java
package com.apai.springbootvue;

public class Sum {
    
    public static int sum(int[] arr) {
        return sum(arr, 0);
    }

    private static int sum(int[] arr, int l) {
        if (l == arr.length) {
            return 0;
        }
        return arr[l] + sum(arr, l + 1);
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        System.out.println(sum(nums));
    }
}
```

### spring boot 启动执行类

>  当 springboot 启动时执行该类

```java
package com.woniu.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class RunUserPermission implements CommandLineRunner {


    @Override
    public void run(String... args) throws Exception {
        // 当 springboot 启动时执行该类

    }

}

```

### 根据 request 获取IP地址

```java
package com.apai.util;

import javax.servlet.http.HttpServletRequest;

public class IpAddress {

    /**
     * 获取IP地址
     * @param request
     * @return
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
```





### Java API 补充

#### 字符串反转

```java
String str = "abcdefg";
// 字符串反转
String reverse = reverse(str);
System.out.println(reverse); // gfedcba
```

#### 中文转拼音

```java
// 中文转拼音 | 需要依赖
String pinyin = PinyinUtil.getPinyin("你好");
System.out.println(pinyin);

<!--拼音库-->
<dependency>
    <groupId>com.belerweb</groupId>
    <artifactId>pinyin4j</artifactId>
    <version>2.5.0</version>
</dependency>
```

#### 数组排序

```java
// 数组排序
int[] arr = {100, 37, 12, 5, 41};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));
```



### java 集合补充

#### List

##### ArrayList

> ArrayList底层是由[动态数组](https://so.csdn.net/so/search?q=动态数组&spm=1001.2101.3001.7020)实现的

```java
// 有序 | 内容可重复 | 线程不安全
```

##### LinkedList

> LinkedList底层是由双向链表的数据结构实现的

```java
// 线程不安全 没锁 | 增删 效率高 , 查询需要一个个找使用效率低
```

#### Set

##### HashSet

> HashSet底层是采用HashMap实现的

```java
// 不能保证元素的顺序，元素是无序的
// HashSet不存入重复元素的规则：使用hashcode和equals
```

##### TreeSet

> TreeMap的实现就是红黑树数据结构，也就说是一棵自平衡的排序二叉树

```java
// 如果没有提供比较器，则采用key的自然顺序进行比较大小，可指定的比较器进行key值大小的比较。
// TreeSet是一个有序的集合，基于TreeMap实现，支持两种排序方式：自然排序和定制排序。
// TreeSet是非同步的，线程不安全的。
```

##### LinkedHashSet

> LinkedHashSet底层是一个 LinkedHashMap，底层维护了一个数组+双向链表

```java
// 不允许添重复元素
// 有序 确保插入顺序和遍历顺序一致
```

#### Map 

##### HashMap

> 先数组 hashCode冲突使用链表  链表长度超过8个转换红黑树储存

```java
// 无序的，根据 hash 值随机插入
// HashMap 线程不安全
```

##### HashTable

> HashTable是继承与Dictionary类，实现了Map接口，HashTable的主体还是Entry_数组

```java
// HashMap是非线程安全的
// HashMap的key可以使用null（只能有一个），value可以为null，而HashTable都不允许存储key和value值为空的元素
// 不会转换为红黑
```

##### LinkedHashMap

> LinkedHashMap底层是数组 + 单项链表 + 双向链表

```java
// key和value都允许为空
// key重复会覆盖,value可以重复
// 有序的
// LinkedHashMap是非线程安全的
```

##### TreeMap

> TreeMap 是按照 Key 的自然顺序或者 Comprator 的顺序进行排序，内部是通过红黑树来实现。

```java
// 所以要么 key 所属的类实现 Comparable 接口，或者自定义一个实现了 Comparator 接口的比较器，传给 TreeMap 用户 key 的比较
```











