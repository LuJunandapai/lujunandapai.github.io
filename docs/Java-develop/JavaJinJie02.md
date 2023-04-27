---
title: Java 基础_进阶二
date: 2023/04/26
---

# | --- Java 基础_进阶二

# 分布式事务最终一致性

> 即: 在各个微服务之间进行调用 确保每一个微服务的事务是一致的
>
> **具体见: 基于RabbitMQ实现分布式事务最终一致性.md**

* 串行: A->B->C | C 一旦出错 则A和B是能够进行事务的回滚
* 并行: A->B  A->C | C 一旦出错 则B是无法获取C的异常的 所以导致事务的不一致

## 整体思路

案例：银行转账服务，一方转账成功，确保另一方一定要成功，没有失败的可能。即使失败也要成功。保证事务一致性

1. 可靠生产 : 保证消息一定要发送到 RabitMQ 服务。
2. 可靠消费 : 保证消息取出来一定正确消费掉。

> 最终使多方数据达到一致。

![image-20220211152333475](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211152333475.png) 

```
A注册用户保存到本地数据库用户表，同时写入消息到数据库消息表，定时器定期查询消息表的某些消息（消息状态为“未发送”），然后把消息发送到消息队列，队列收到消息回调确认，同时修改消息表的消息状态（已发送），促销服务监听队列接收消息，发放优惠券，发送成功后才手动应答，然后队列删除该消息
```

### 生产方的『可靠性』

这里的『可靠性』指的是一旦 A 服务（事务的发起方）本地操作执行成功后，要务必确保消息一定要发送至 RabbitMQ 。

如果发送失败，那么：

1. 撤销 A 服务的本地操作；
2. 如果 A 服务的本地操作是无法撤销的，那么消息需要重发；如果重复仍然失败，那么则需要人工干预。发送消息到rabbitmq由定时器来完成，

为了确保消息发送方的可靠性需要执行的以下操作：

创建两个微服务

### 消费方

B 服务在收到消息后，去执行本地操作可能失败。此时，由于 B 服务确实是已经收到了该消息，（默认情况下）该消息已经被 RabbitMQ 移除了，无法重发。

> 消费者开启手动 ACK 模式

开启手动 ACK 模式的目的是先去执行 B 服务的本地操作，在操作执行成功后再『回复』RabbitMQ 已收到消息。这种情况下，如果 B 服务本地操作失败，那么就没有去『确认』收到该消息，RabbitMQ 自然就会重发该消息。

配置文件

```properties
spring.rabbitmq.listener.simple.acknowledge-mode=manual
spring.rabbitmq.listener.direct.acknowledge-mode=manual
```

## 消息队列的重复消息

> 微服务 | 则是一项目的多实例 

**消息队列的重复消息问题:**

当多个实例一起启动时 定时器都会去拉取 数据库的数据 导致同一条数据被拉取到多个实例进行消息的发送

这让消息队列里会存在重复的消息

**解决方法:**

创建去重表 字段: id | 不重复的字段

在手动 ack 应答时 先进行 添加 去重表 由于字段列不能重复 则重复的话导致添加失败 反之正常 进行try异常处理

* 添加失败报异常 则不进行操作 时这条消息放掉

* 添加成功 则表示没有重复 进行应答 然后将数据存入 去重表

异常:

* 添加去重表失败: 表示该消息已经应答过
* 业务异常: 表示消息处理失败 需要拒绝签收消息 且必须将去重表的该条数据删除

## 事务一致性 | 优惠劵案例

生产方: 用户注册 --> 添加消息 --> 定时器查询该表发送消息到队列 --> 队列和路由器的回调确保消息发送到了队列

消费方: 监听到消息 --> 查询去重表确认该消息是否已被正确消费 --> 消费则应答 | 否则 发送优惠劵 在应答签收

案例代码详见:  



# RESTful 接口的幂等性

幂等性：就是用户对于同一操作发起的一次请求或者多次请求的结果是一致的，不会因为多次点击而产生了了副作用。举个最简单的例子，那就是支付，用户购买商品后支付，支付扣款成功，但是返回结果的时候网络异常，此时钱已经扣了，用户再次点击按钮，此时会进行第二次扣款，返回结果成功，用户查询余额发现多扣了钱，流水记录也变成了两条，再或者新增用户表单注册时，用户反复提交表单.

> 简而言之：**任意多次执行所产生的影响均与一次执行的影响相同**。按照这个含义，最终的含义就是**对数据库的影响只能是一次性的，不能重复处理**

**场景：**

产生『**重复数据或数据不一致**』（假定程序业务代码没问题），绝大部分就是发生了重复的请求，重复请求是指『**同一个请求因为某些原因被多次提交**』。导致这个情况会有几种场景：

1. 微服务场景，在我们传统应用架构中调用接口，要么成功，要么失败。但是在微服务架构下，会有第三个情况『未知』，也就是超时。如果超时了，微服务框架会进行重试；
2. 用户交互的时候多次点击。如：快速点击按钮多次；
3. MQ 消息中间件，消息重复消费；
4. 第三方平台的接口（如：支付成功回调接口），因为异常也会导致多次异步回调；
5. 其他中间件/应用服务根据自身的特性，也有可能进行重试。

接口的幂等性实际上就是『**接口可重复调用**』，在调用方多次调用的情况下，接口『**最终得到的结果是一致的**』。

```
以『增删改查』四大操作来看，『删除』和『查询』操作天然是幂等的，没有重复提交/重复请求问题。因为不管用户点击多少次删除操作或者是查询操作，也就是重复去调用查询接口或者是删除接口都不会有问题。因此，幂等需求通常是用在『新增』和『修改』类型的业务上。如用户注册表单的重复提交问题
而『修改』类型的业务通过 SQL 改造和 last_upated_at 字段的结合，也可以实现幂等，而无需下述的 token 和去重表方案。
因此，幂等性的处理重点集中在『新增』型业务上。
```

**解决方法:**

在进行业务时 先已删除redis里对应的数据为条件 | 在该重复的按钮点击前进行储存redis数据 不能在此方法里储存redis数据

* 删除成功 真 则表示第一次 可进行业务
* 删除失败 假 重复点击 过滤掉

```java
@RequestMapping("/add")
public String addDepartment(String name, String departmentToken) {
    ValueOperations<String, String> ops = redisTemplate.opsForValue();
    
    //1、先已删除redis里对应的数据为条件 
    if(redisTemplate.delete("department-token" + departmentToken)){
        System.out.println("保存到数据库");
        return "success";
    }
    
    return "failure";
    
}
```



# Java 位运算符

## 与运算符(&)

如果 4&7  那么这个应该怎么运算呢？在这里要提到一点，1表示true，0表示false，在做与运算的时候，规则如下：

全true(1),即为true(1)
全false(0),即为false(0)
一false(0)一true(1),还是false(0)

案例：4&7

![image-20220211164716886](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211164716886.png) 

## 或运算符(|)

在做或运算的时候，规则如下：

遇true(1)就是true(1),
无true(1)就是false(0)

案例： 5|9

![image-20220211165012586](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211165012586.png) 

## 异或运算符(^)

在异或的时候，只要相同都是false(0)，只有不同才是true(1)

案例：7^15

![image-20220211165316835](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211165316835.png) 

## 取反运算符(~)

这个其实挺简单的，就是把1变0，0变1，但是注意：二进制中，最高位是符号位  1表示负数，0表示正数

案例：15取反

![image-20220211165831898](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211165831898.png) 

> 说明：15的原码为：0000 1111，因为**正数的原码=反码=补码**，在cpu真正存储的时候都是存补码的，要对原码取反，就要先得到补码，然后对补码取反，所以也就是对15的补码进行取反，取反之后变成 1111 0000，变成的1111  0000 还是补码，那么怎么从补码转换为我们能认识的原码呢？其实很简单，**首先把补码1111 0000 取反，符号位不变，然后+1，就可以得到原码**
>
> 1、1111 0000 取反为 1000 1111
>
> 2、1000 1111
>
> ​      0000 0001
>
> ----------------------------
>
> ​     1000 1000  = -16
>
> 类似的~9 = -10，~7 = -8，~5=-6,~-16=15，~-8=7 ，~-10=9.发现什么规律了吗？



## 左移运算(<<)

 左移就是把所有位向左移动几位

案例：12 << 2    就是12向左移动两位

![image-20220211173405835](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211173405835.png) 

通过这个图我们可以看出来，所有的位全都向左移动两位，然后把右边空的两个位用0补上，最左边多出的两个位去掉，最后得到的结果就是00110000 结果就是48，我们用同样的办法算 12<<3 结果是 96 。**由此我们得出一个快速的算法  M << n  其实可以这么算  M << n = M \* 2的n次方**

## 右移运算符(>>)

这个跟左移运算大体是一样的

案例： 12 >> 2

![image-20220211173839914](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211173839914.png) 

我们可以看出来右移和左移其实是一样的，但是还是有点不同的，不同点在于对于正数和负数补位的时候补的不一样，负数补1，正数补0
如我们再做一个 –8 的    -8>>2

![image-20220211175250189](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211175250189.png) 

这里总结一下，关于负数或者正数来说，移位的时候是一样的，但是在补位的时候，如果最高位是0就补0，如果最高位是1就补1
由此我们得出一个快速的算法    M >> n   其实可以这么算   M >> n  = M / 2^n

> 上面说过，cpu计算的一个数的时候都是得到这个数的补码，然后计算
>
> 对于正数而言：原码 = 反码 = 补码
>
> 对于负数而言：补码 = 原码取反 + 1
>
> 如：-8的原码是：1000  1000   转成补码是 1（符号位不变）111  0111 ，然后+1,变成 1111 1000
>
> 正数的补码=源码
>
> 已知一个负数的补码，如何求源码？补码的补码 = 源码
>
> 如：负数的补码为1111 1110，它的源码为1(符号位不变) 0 0 0   0 0 0 1   +  1 =  -2

## 无符号右移(>>>)

无符号右移(>>>)只对32位和64位有意义

在移动位的时候与右移运算符的移动方式一样的，区别只在于补位的时候不管是0还是1，都补0



# 多线程_锁

## 多线程创建方式

参考: https://blog.csdn.net/Evankaka/article/details/44153709 

https://blog.csdn.net/zdl66/article/details/126

### 继承 Thread 类

```java
package com.apai.duoxiancheng;

/**
 * @functon 多线程学习 继承 java.lang.Thread类
 */
class Thread1 extends Thread {
    private String name;

    public Thread1(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(name + "运行  :  " + i);
            try {
                sleep((int) Math.random() * 10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

    }
}

public class MainThread {

    public static void main(String[] args) {
        Thread1 mTh1 = new Thread1("A");
        Thread1 mTh2 = new Thread1("B");
        mTh1.start();
        mTh2.start();
    }

}
```

### 实现 Runnable 接口

```java
/**
 *@functon 多线程学习 实现 java.lang.Runnable接口
 */
package com.apai.duoxiancheng;
class Thread2 implements Runnable{
   private String name;
 
   public Thread2(String name) {
      this.name=name;
   }
 
   @Override
   public void run() {
        for (int i = 0; i < 5; i++) {
               System.out.println(name + "运行  :  " + i);
               try {
                  Thread.sleep((int) Math.random() * 10);
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
           }
      
   }
   
}
public class MainRunnable {
 
   public static void main(String[] args) {
      new Thread(new Thread2("C")).start();
      new Thread(new Thread2("D")).start();
   }
 
}
```

### 实现 Callable 接口

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;
/**
 * @Description  线程实现的第三种方式
 */
public class Demo04 {
    public static void main(String[] args) throws Exception {
 
        // 第一步：创建一个“未来任务类”对象。
        // 参数非常重要，需要给一个Callable接口实现类对象。
        FutureTask task = new FutureTask(new Callable() {
            @Override
            public Object call() throws Exception { // call()方法就相当于run方法。只不过这个有返回值
                // 线程执行一个任务，执行之后可能会有一个执行结果
                // 模拟执行
                System.out.println("call method begin");
                Thread.sleep(1000 * 10);
                System.out.println("call method end!");
                int a = 100;
                int b = 200;
                return a + b; //自动装箱(300结果变成Integer)
            }
        });
 
        // 创建线程对象
        Thread t = new Thread(task);
 
        // 启动线程
        t.start();
 
        // 这里是main方法，这是在主线程中。
        // 在主线程中，怎么获取t线程的返回结果？
        // get()方法的执行会导致“当前线程阻塞”
        Object obj = task.get();
        System.out.println("线程执行结果:" + obj);
        // main方法这里的程序要想执行必须等待get()方法的结束
        // 而get()方法可能需要很久。因为get()方法是为了拿另一个线程的执行结果
        // 另一个线程执行是需要时间的。
        System.out.println("hello world!");
    }
}
```

### 注解 @Async 

1.在启动类加上 注解 @EnableAsync 开启异步线程

```java
@SpringBootApplication
// 定时器注解
@EnableScheduling
// 开启异步线程
@EnableAsync
public class WxgzhappApplication {

    public static void main(String[] args) {
        SpringApplication.run(WxgzhappApplication.class, args);
    }

}
```

2.在类 或者 方法 上加上 @Async 指定异步方法

```java
@Component
public class AsyncTest {

    @Async("defaultThreadPoolExecutor") // 异步方法指定配置 可以不指定为默认
    // @Async 不指定
    public void execute(Integer num) throws InterruptedException {
        System.out.println("线程：" + Thread.currentThread().getName() + " , 任务：" + num);
        Thread.sleep(3_000);
    }

}
```

3.调用方法 注意需要使用代理 

```java
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements IRoleService {
    @Autowired
    private AsyncTest asyncTest;

    @Override
    public void getRole() {
        System.out.println("开始执行任务");
        try {
            asyncTest.execute(122);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("任务执行结束");
    }
}

// 执行结果
开始执行任务
任务执行结束
线程：default-executor-0 , 任务：122
```

4.可以给异步线程添加配置 如:线程数等  也可以不指定使用默认

```java
package com.apai.config;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
@Slf4j
public class ThreadPoolConfiguration {

    @Bean(name = "defaultThreadPoolExecutor", destroyMethod = "shutdown")
    public ThreadPoolExecutor systemCheckPoolExecutorService() {

        return new ThreadPoolExecutor(3, 10, 60, TimeUnit.SECONDS,
                new LinkedBlockingQueue<Runnable>(10000),
                new ThreadFactoryBuilder().setNameFormat("default-executor-%d").build(),
                (r, executor) -> log.error("system pool is full! "));
    }
}
```

> 注意点

```java
一般失效原因有下列几条：
1.@SpringBootApplication启动类当中没有添加@EnableAsync注解。
2.异步方法使用注解@Async的返回值只能为void或者Future。
3.没有走Spring的代理类。因为@Transactional和@Async注解的实现都是基于Spring的AOP，而AOP的实现是基于动态代理模式实现的。那么注解失效的原因就很明显了，有可能因为调用方法的是对象本身而不是代理对象，因为没有经过Spring容器管理。

解决方法:
这里具体说一下第三种情况的解决方法。
1.注解的方法必须是public方法。
2.方法一定要从另一个类中调用，也就是从类的外部调用，类的内部调用是无效的。
3.如果需要从类的内部调用，需要先获取其代理类。
```







## 锁 _ 细节

### 同步锁_悲观锁

```java
// 实现 Runnable
class Ticket implements Runnable {

}
```

> **采用锁 synchronized**

```java
// 采用锁 synchronized | this表示锁的对象 其实只是一个标志
synchronized (this) {
    // 该 锁的代码块 都会被锁住 线程必须一个一个执行
}
```

> **采用锁 ReentrantLock**

> 注意: 对个线程进行加锁时 用的锁对象必须是同一个 否则会造成每个线程都会加一把新的锁

```java
// 创建锁 ReentrantLock 对象
ReentrantLock lock = new ReentrantLock();
// 加锁
lock.lock();

// 加锁 - 释放锁 之间的代码都会被锁住 线程必须一个一个执行

// 释放锁
lock.unlock();
```

**trylock  方法**

> 可使用 trylock  方法的返回值 在设置线程被占用的情况下执行其他的业务

```java
// 创建锁 ReentrantLock 对象
ReentrantLock lock = new ReentrantLock();
// 加锁 成功true | 在一秒内加锁失败false
boolean b = lock.tryLock(1, TimeUnit.SECONDS);
```

```java
package com.apai.springbootvue;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class TryLock {

    private static ReentrantLock lock = new ReentrantLock();
    public static void main(String[] args) {
        new Thread(() -> {
            lockMethod();
        }).start();
        new Thread(() -> {
            lockMethod();
        }).start();
    }

    public static void lockMethod() {
        try {
            while (!lock.tryLock(1, TimeUnit.SECONDS)) {
                System.out.println("经过1秒钟的努力，还没有占有对象，放弃占有");
                System.out.println("我先干别的事情");
                Thread.sleep(3000);
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }


        try {
            System.out.println("占有对象：lock");
            System.out.println("进行5秒的业务操作");
            Thread.sleep(5000);
        }catch (Exception ex){
        }finally {
            lock.unlock(); //释放锁
        }
    }
}
```

### 同步锁 | 悲观锁 案例

> 线程调用 的对象实现Runnable重写的run方法

```java
public class CccServiceApplication {

    public static void main(String[] args) {
        Ticket ticket = new Ticket();
        //创建三个窗口对象 线程 并运行
        new Thread(ticket, "窗口1").start();
        new Thread(ticket, "窗口2").start();
        new Thread(ticket, "窗口3").start();
    }
}

// ---------------采用锁ReentrantLock--------------
class Ticket implements Runnable {
    ReentrantLock lock = new ReentrantLock();
    private int ticket = 10;
    @Override
    public void run() {
        String name = Thread.currentThread().getName();
        while (true) {
            lock.lock();
            if (ticket > 0) {
                System.out.println(name + "卖票：" + ticket--);
            }
            lock.unlock();
            Thread.sleep(100); //添加异常
        }
    }
}
// -------------------采用锁synchronized-------------------
class Ticket implements Runnable {
    private int ticket = 10;
    @Override
    public void run() {
        String name = Thread.currentThread().getName();
        while (true) {
            synchronized (this) {
                if (ticket > 0) {
                     //int m = 1/0; 如果有抛出异常，jvm也会释放锁
                    System.out.println(name + "卖票：" + ticket--);
                }
            }
            Thread.sleep(100);
        }
    }
}
```

### 读写锁

> 使用读写锁，可以实现读写分离锁定，读操作并发进行，写操作锁定单个线程

* 读锁: 如果一个线程或取到读锁，其他的线程能获取读锁，但是不能获取写锁(就应该阻塞)
* 写锁: 如果一个线程或取到写锁，其他的线程不能获取读锁，其他的线程也不能获取写锁

```java
// 读写锁对象
ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

lock.readLock().lock();// 加写锁
// 加锁 - 释放锁 之间的代码都会被锁住 线程必须一个一个执行
lock.readLock().unlock(); // 释放锁
------------------------------------------------

lock.writeLock().lock(); // 加读锁
// 加锁 - 释放锁 之间的代码都会被锁住 线程必须一个一个执行
lock.writeLock().unlock(); // 释放锁
```

## 线程通信

### API

> 具体 可见:  java 开发 其一: 线程

```java
wait() // 让线程挂起等待 不是睡眠 直到有其他线程把他来唤醒
notify() // 唤醒一个被挂起 等待的锁
notifyAll() // 唤醒所有被挂起 等待的锁
    
---------------------------------------------------
currentThread()：返回当前正在执行的线程引用
      getName()：返回此线程的名称
  setPriority(): 设置线程的优先级，但是能不能抢到资源也是不一定，优先级用1～10 表示，1的优先级最低，10的优先级最高，默认值是5
  getPriority()：返回线程的优先级
      isAlive()：检测此线程是否处于活动状态，活动状态指的是程序处于正在运行或准备运行的状态
        sleep()：使线程休眠 在指定时间之后，线程会恢复执行
         join()：等待线程执行完成再执行当前线程
        yield()：让同优先级的线程有执行的机会，但不能保证自己会从正在运行的状态迅速转换到可运行的状态
```

### 线程通信案例

```java
package com.apai.springbootvue;

public class ProducerConsumerDemo {
   public static void main(String[] args) {
      Resource r = new Resource();
      Producer in = new Producer(r);
      Consumer out = new Consumer(r);

      Thread t1 = new Thread(in);
      Thread t2 = new Thread(out);
      t1.start();
      t2.start();
   }
}
class Resource{
   private String name;
   private int count = 1;
   private boolean flag = false;
   
   public synchronized void set(String name){
      if(flag){   //为false就生产，true不生产
         try {
            wait(); //wait()会立刻释放synchronized(obj)中的obj锁  sleep不会释放锁
         } catch (Exception e) {
         }
      }
      this.name = name+"--"+count++;
      System.out.println(Thread.currentThread().getName()+"...生产者..."+this.name);
      flag  = true;
      this.notify();  //只唤醒一个线程
      
   }
   public synchronized void get(){
      if(!flag){  //为true就取 为false就不取 
         try {
            wait();
         } catch (Exception e) {
         }
      }
      System.out.println(Thread.currentThread().getName()+".......消费者......"+this.name);
      flag = false;
      this.notify();
   }
} 
class Producer implements Runnable{

   private Resource res;
   Producer(Resource res){
      this.res = res;
   }
   public void run() {
      while(true){
         res.set("商品");
      }
   } 
}
class Consumer implements Runnable{
   private Resource res;
   Consumer(Resource res){
      this.res = res;
   }
   public void run() {
      while(true){
         res.get();
      }
   } 
}
//结合oop3一起讲解
```

## 锁的说明详解

### 乐观锁 

> 乐观锁: 在多线程里 每次访问变量都记录其版本号 第二次访问如果版本号一致则正常 反之版本号不一致失败

```java
// 1. 使用数据版本（Version）记录机制实现，这是乐观锁最常用的一种实现方式。
// 即为数据增加一个版本标识，一般是通过为数据库表增加一个数字类型的 “version” 字段来实现。当读取数据时，将version字段的值一同读出，数据每更新一次，对此version值加一。当我们提交更新的时候，判断数据库表对应记录的当前版本信息与第一次取出来的version值进行比对，如果数据库表当前版本号与第一次取出来的version值相等，则予以更新，否则认为是过期数据。
// 提交更新时发现数据的version已经被修改了，那么A的更新操作会失败。

// 2. 乐观锁控制的table中增加一个字段，名称无所谓，字段类型使用时间戳（timestamp）, 和上面的version类似，也是在更新提交的时候检查当前数据库中数据的时间戳和自己更新前取到的时间戳进行对比，如果一致则OK，否则就是版本冲突。
```

### 悲观锁 

> 悲观锁: 在悲观锁的范围内的代码片段 直接全部上锁 线程只能一个个的执行

```java
// 顾名思义，就是对于数据的处理持悲观态度，总认为会发生并发冲突，获取和修改数据时，别人会修改数据。所以在整个数据处理过程中，需要将数据锁定。
// 悲观锁的实现，通常依靠数据库提供的锁机制实现，比如mysql的排他锁，select .... for update来实现悲观锁。
```

### 偏向、轻量级、重量级锁

#### 对象内存布局

<img src="https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210716165256209.png" alt="image-20210716165256209" style="zoom:150%;" /> 

Mark Word: 锁信息 hashcode GC |   64位 默认大小是 8字节

指向Class指针:  Class 地址  |  压缩4字节 未压缩8字节

body: 对象的数据 属性 方法   |   装多少有多少

对齐字节: 填充位  |  不足8的整数倍 进行填充

> 注意点:

* 对象的大小 一定是8的整数倍 空对象大小 12 + 填充位 4 = 16 字节
* 对齐填充不是必然存在的，没有特别的含义，它仅起到占位符的作用
* 可使用jol依赖查看对象的具体信息 **见下方补充 '查看对象在堆的数据'**

#### 偏向锁

大多数情况下，锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了让线程获得锁的代价更低而引入了偏向锁，偏向锁会偏向于第一个获得它的线程

```
大多数情况下，锁总是由同一个线程多次获得。当一个线程访问同步块并获取锁时，会在对象头和栈帧中的锁记录里存储锁当前的线程ID，偏向锁是一个可重入的锁。
它永远偏向（偏袒）第一个线程，如果锁对象头的Mark Word里存储着指向当前线程的偏向锁，无需重新进行CAS操作来加锁和解锁。
当有其他线程尝试竞争偏向锁时，持有偏向锁的线程（不处于活动状态）才会释放锁。偏向锁无法使用自旋锁优化，
因为一旦有其他线程申请锁，就破坏了偏向锁进而升级为轻量级锁
```

#### 轻量级锁（自旋锁）

所谓自旋锁，就是让该线程等待一段时间，不会被立即挂起，看持有锁的线程是否会很快释放锁。怎么等待呢？执行一段无意义的循环即可（自旋）

自旋等待不能替代阻塞，先不说对处理器数量的要求（多核，貌似现在没有单核的处理器了），虽然它可以避免线程切换带来的开销，但是它占用了处理器的时间。如果持有锁的线程很快就释放了锁，那么自旋的效率就非常好，反之，自旋的线程就会白白消耗掉处理的资源，它不会做任何有意义的工作，典型的占着茅坑不拉屎，这样反而会带来性能上的浪费。所以说，自旋等待的时间（自旋的次数）必须要有一个限度（默认10次），如果自旋超过了定义的时间仍然没有获取到锁，则应该被挂起

说明：

~~~
当有另一个线程与该线程同时竞争时，锁会升级为重量级锁。为了防止继续自旋，一旦升级，将无法降级。
~~~

#### 重量级锁

通过对象内部的监视器(monitor)实现，其中monitor的本质是依赖于底层操作系统的Mutex Lock实 现，操作系统实现线程之间的切换需要从用户态到内核态的切换，切换成本非常高。线程竞争不使用自旋，不会消耗CPU。但是线程会进入阻塞等待被其他线程被唤醒，响应时间缓慢，它是交给操作系统去执行的，也就是操作系统开辟的线程和jvm开辟的线程是1：1的关系

重量级锁（ObjectMonitor）有等待队列（WaitSet），所有拿不到锁的线程统统进入等待队列，不需要消耗CPU资源，

#### 锁的优缺点对比

| 锁       | 优点                                                         | 缺点                                           | 适用场景                         |
| :------- | ------------------------------------------------------------ | ---------------------------------------------- | -------------------------------- |
| 偏向锁   | 加锁和解锁不需要额外的消耗，和执行非同步方法比仅存在纳秒级的差距 | 如果线程间存在锁竞争，会带来额外的锁撤销的消耗 | 适用于只有一个线程访问同步块场景 |
| 轻量级锁 | 竞争的线程不会阻塞，提高了程序的响应速度                     | 如果始终得不到锁竞争的线程使用自旋会消耗CPU    | 追求响应时间,锁占用时间很短      |
| 重量级锁 | 线程竞争不使用自旋，不会消耗CPU                              | 线程阻塞，响应时间缓慢                         | 追求吞吐量,锁占用时间较长        |



# 跨域

[JAVA跨域产生的原因和解决方法](https://blog.csdn.net/qq_42446156/article/details/109563427#:~:text=目前我了解的解决跨域的几种方式：,手写过滤器，cors，jsonnp，响应头添加Header%2C配置nginx反向代理%2Czuul组件%2C共五种解决方式。 1.手写过滤器实现，通过过滤器开放需要访问的接口)

## 跨域出现原因

  跨域是指a页面想获取b页面资源，如果a、b页面的协议、域名、端口、子域名不同，或是a页面为ip地址，b页面为域名地址，所进行的访问行动都是跨域的，而浏览器为了安全问题一般都限制了跨域访问，也就是不允许跨域请求资源。

  跨域问题的根本原因：因为浏览器收到同源策略的限制，当前域名的js只能读取同域下的窗口属性。什么叫做同源策略？就是不同的域名, 不同端口, 不同的协议不允许共享资源的，保障浏览器安全。同源策略是针对浏览器设置的门槛。如果绕过浏览就能实现跨域，所以说早期的跨域都是打着安全路数的擦边球，都可以认为是 hack 处理。

## 解决方案

1.过滤器实现，通过过滤器开放需要访问的接口

2.使用@CrossOrigin注解实现细粒度控制（推荐使用），该方法至少JDK1.8

​	直接在需要被跨域访问的方法上加上@CrossOrigin注解就可以实现被跨域访问。

3.微服务的网关进行设置跨域

# java 流

## 文件内容读取

```java
@Test
    void contextLoads() {
        String filePath = "C:\\派\\文件测试.md";
        StringBuilder result = new StringBuilder();
        try {
            BufferedReader bfr = new BufferedReader(new InputStreamReader(new FileInputStream(new File(filePath)), "UTF-8"));
            String lineTxt = null;
            while ((lineTxt = bfr.readLine()) != null) {
                result.append(lineTxt);
            }
            bfr.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(result.toString());
    }
```





# | --- Java 常用点

# 基础补充

## 反射

### 反射对象赋值

```java
@Test
public void test() throws Exception {
    // 创建对象
    UserInfo userInfo = new UserInfo();
    userInfo.setOpenId("123");
    userInfo.setName("apai");
    // 通过反射获取类
    Class aClass = userInfo.getClass();
    // 获取属性
    Field openId = aClass.getDeclaredField("openId");
    // 设置属性可访问
    openId.setAccessible(true);
    // 获取属性值
    openId.set(userInfo, "456");

}
```





# 前后端请求 详解

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

## Open Feign 微服务请求

前提:

1. 添加 nacos 和 Open Feign 依赖
2. 在启动类: 启用 nacos 的服务发现和开启feign客户端可以无需配置熔断器和负载均衡注解
3. 在调用方Client接口使用注解且链接到服务方 @FeignClient("微服务名称")
4. 对于不同的请求和不同类型的参数 使用对于的注解

### Restful 风格请求

> 注解: @PathVariable("占位名")
>
> 在 Open Feign 远程调用的Client接口里 按规范在注解里写入 占位参数名

```java
// GET：用于获取资源 
// POST：用于新建资源	
// PUT：用于更新资源
// DELETE：用于删除资源

@GetMapping("/test1/{id}")
public String test1(@PathVariable("id") Integer id);

@PostMapping("/test5/{id}")
public String test5(@PathVariable("id") Integer id, @RequestHeader("token") String token);
```

### Get 请求

> 单个参数注解: @RequestParam("占位名")
>
> 对象类型注解: @SpringQueryMap 对象类型 对象名
>
> 当参数为: Map 集合时 可使用上方两个注解都可使用
>
> 获取请求头token注解: @RequestHeader("token") 

```java
@GetMapping("/test2")
public String test2(@RequestParam("id") Integer id, @RequestParam("name") String name);

@GetMapping("/test3")
public String test3(@SpringQueryMap User user, @RequestHeader("token") String token);

@GetMapping("/test4")
public String test4(@RequestParam  Map<String,Object> map, @RequestHeader("token") String token);
```

### Post 请求

> 单个参数注解: @RequestParam("占位名")
>
> 对象类型注解: @RequestBody 对象类型 对象名  |  {应用于 浏览器传递的类型为 json}
>
> 当参数为: Map 集合时 可使用上方两个注解都可使用
>
> 获取请求头token注解: @RequestHeader("token") 

```java
@PostMapping("/test6")
public String test6(@RequestParam("id") Integer id ,@RequestParam("name") String name;

@PostMapping("/test7")
public String test7(@RequestBody  User user, @RequestHeader("token") String token);

@PostMapping("/test8")
public String test8(@RequestParam Map<String,Object> map, @RequestHeader("token") String token);
```

### 案例参考 详解

> 调用方

```java
package com.apai.controller;

import com.apai.client.FinancingClient;
import com.apai.entity.wxgzhapp.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class ApaiNcosController {

    @Autowired
    private FinancingClient financingClient;

    @GetMapping("/GetTest")
    public String GetTest() {
        String wucan = financingClient.wucan();
        System.out.println(wucan);
        // GET 请求 | 无参方法调用成功

        String dan = financingClient.dan(1, "阿派");
        System.out.println(dan);
        // GET 请求 | 单个参数方法调用成功 | 参数: id = 1 | name = 阿派

        UserInfo userInfo = new UserInfo();
        userInfo.setId(1);
        userInfo.setName("是阿派啊!");
        String duixiang = financingClient.duixiang(userInfo);
        System.out.println(duixiang);
        // GET 请求 | 对象参数方法调用成功 | 参数: userInfo = UserInfo(id=1, name=是阿派啊!, openId=null, templateid=null, headline=null, birthday=null, loveday=null, region=null, coding=null, stutas=null)

        String qingtou = financingClient.qingtou("1asda12ffd.123d12455654.13gdwdq");
        System.out.println(qingtou);
        // GET 请求 | 请求头参数方法调用成功 | 参数: token = 1asda12ffd.123d12455654.13gdwdq

        return "ok 200 --- GetTest";
    }


    @GetMapping("/PostTest")
    public String PostTest() {
        String postDan = financingClient.postDan(1, "阿派");
        System.out.println(postDan);
        // POST 请求 | 单个参数方法调用成功 | 参数: id = 1 | name = 阿派

        UserInfo userInfo = new UserInfo();
        userInfo.setId(1);
        userInfo.setName("是阿派啊!");
        String postDuixiang = financingClient.postDuixiang(userInfo, "1asda12ffd.123d12455654.13gdwdq");
        System.out.println(postDuixiang);
        // POST 请求 | 对象参数方法调用成功 | 参数: userInfo = UserInfo(id=1, name=是阿派啊!, openId=null, templateid=null, headline=null, birthday=null, loveday=null, region=null, coding=null, stutas=null) | token = 1asda12ffd.123d12455654.13gdwdq

        return "ok 200 --- PostTest";
    }

    @GetMapping("/restfulTest")
    public String restfulTest() {
        String restful = financingClient.restful(1, "阿派", "token121.214123.123146775");
        System.out.println(restful);
        // Restful 风格请求 | 微服务调用 | 参数: id = 1 | name = 阿派 | token = token121.214123.123146775
        return "ok 200 --- RestfulTestTest";
    }

}
```

> 调用方 Client 接口

```java
package com.apai.client;

import com.apai.entity.wxgzhapp.UserInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.*;

// 标注该类是一个feign接口 且链接到服务方 @FeignClient("微服务名称")
@FeignClient("wxgzhapp")
public interface FinancingClient {

    /**
     *  Get 请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Get 请求 | 无参方法
    @GetMapping("/financing/wucan")
    public String wucan();
    // Get 请求 | 单个参数方法
    @GetMapping("/financing/dan")
    public String dan(@RequestParam("id") Integer id, @RequestParam("name") String name);
    // Get 请求 | 对象参数方法
    @GetMapping("/financing/duixiang")
    public String duixiang(@SpringQueryMap UserInfo userInfo);
    // Get 请求 | 请求头参数方法
    @GetMapping("/financing/qingtou")
    public String qingtou(@RequestHeader("token") String token);


    /**
     *  Post 请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Post 请求 | 单个参数方法
    @PostMapping("/financing/postDan")
    public String postDan(@RequestParam("id") Integer id, @RequestParam("name") String name);
    // Post 请求 | 对象参数方法
    @PostMapping("/financing/postDuixiang")
    public String postDuixiang(@RequestBody UserInfo userInfo, @RequestHeader("token") String token);

    /**
     *  Restful 风格请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Restful 风格请求 | 单个参数方法 | 请求头
    @GetMapping("/financing/restful/{id}/{name}")
    public String restful(@PathVariable("id") Integer id, @PathVariable("name") String name, @RequestHeader("token") String token);
}
```

> 被调用方

```java
package com.apai.controller;

import com.apai.entity.wxgzhapp.UserInfo;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/financing")
public class ApaiNcosController {


    /**
     *  Get 请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Get 请求 | 无参方法
    @GetMapping("/wucan")
    public String wucan() {
        return "GET 请求 | 无参方法调用成功";
    }
    // Get 请求 | 单个参数方法
    @GetMapping("/dan")
    public String dan(Integer id, String name) {
        return "GET 请求 | 单个参数方法调用成功 | 参数: id = " + id + " | name = " + name;
    }
    // Get 请求 | 对象参数方法
    @GetMapping("/duixiang")
    public String updateUserInfo(UserInfo userInfo) {
        return "GET 请求 | 对象参数方法调用成功 | 参数: userInfo = " + userInfo;
    }
    // Get 请求 | 请求头参数方法
    @GetMapping("/qingtou")
    public String updateUserInfo(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("token");
        return "GET 请求 | 请求头参数方法调用成功 | 参数: token = " + token;
    }

    /**
     *  Post 请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Post 请求 | 单个参数方法
    @PostMapping("/postDan")
    public String postDan(Integer id, String name) {
        return "POST 请求 | 单个参数方法调用成功 | 参数: id = " + id + " | name = " + name;
    }
    // Post 请求 | 对象参数方法
    @PostMapping("/postDuixiang")
    public String postDuixiang(HttpServletRequest request, HttpServletResponse response, @RequestBody UserInfo userInfo) {
        String token = request.getHeader("token");
        return "POST 请求 | 对象参数方法调用成功 | 参数: userInfo = " + userInfo + " | token = " + token;
    }

    /**
     *  Restful 风格请求 | 微服务调用
     *  注意: 相互调用时,参数的不同对应的注解也不同
     */
    // Restful 风格请求 | 单个参数方法 | 请求头
    @GetMapping("/restful/{id}/{name}")
    public String restful(@PathVariable("id") Integer id, @PathVariable("name") String name, @RequestHeader("token") String token){
        return "Restful 风格请求 | 微服务调用 | 参数: id = " + id + " | name = " + name + " | token = " + token;
    }

}
```



# Http 协议

**概念:** HyperText Transfer Protocol,超文本传输协议,规定了浏览器和服务器之间数据传输的规则

## HTTP协议特点:

1. 基于TCP协议:面向连接,安全
2. 2.基于请求-响应模型的: - -次请求对应- -次响应
3. HTTP协议是无状态的协议:对于事务处理没有记忆能力。每次请求-响应都是独立的。

* 缺点:多次请求间不能共享数据。Java中使用会话技术、(Cookie. Session) 来解决这个问题

* 优点:速度快

## HTTP-请求数据格式

**请求数据分为3部分:**

1. 请求行: 请求数据的第一行。其中GET表示请求方式，/ 表示请求资源路径，HTTP/1.1表示协议版本

2. 请求头: 第二行开始,格式为key: value形式。

3. 请求体: POST请求的最后一 部分,存放请求参数

**常见的HTTP请求头:** 

* Host:表示请求的主机名
* User- Agent:浏览器版本,例如Chrome浏览器的标识类似Moilla/5.0... |  Chrome/79, IE浏览器的标识类似Mozilla/5.0 (Windows NT ... like Gecko;
* Accept:表示浏览器能接收的资源类型，如text/*, image/*或者 */*表示所有;
* Accept-Language:表示浏览器偏好的语言,服务器可以据此返回不同语言的网页;
* Accept- Encoding:表示浏览器可以支持的压缩类型,例如gzip, deflate等。

**GET请求和POST请求区别:**

1.GET请求请求参数在请求行中，没有请求体 | POST请求请求参数在请求体中

2.GET请求请求参数大小有限制，POST没有

```java
GET / HTTP/1.1
Host: www.itcast.cn
Connection: keep-alive
Cache-Control: max-age=0 Upgrade-Insecure- Requests: 1
User-Agent: Mozilla/5.0 Chrome/91.0.4472.106
...
// -----------------------------------------------------    
POST / HTTP/1.1
Host: www.itcast.cn
Connection: keep-alive
Cache-Control: max-age=0 Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 Chrome/91.0.4472. 106
    
username=superbaby&password=123456
```

## HTTP-响应数据格式

**响应数据分为3部分:**

1. 响应行:响应数据的第一-行。其中HTTP/1.1表示协议版本，200表示响应状态码，OK表示状态码描述
2. 响应头: 第二行开始，格式为key: value形 式
3. 响应体:最后一部分。存放响应数据

**常见的HTTP响应头:**

* Content- Type:表示该响应内容的类型，例如text/html,image/jpeg;

* Content-Length:表示该响应内容的长度(字节数) ; 

* Content- Encoding:表示该响应压缩算法，例如gzip;

* Cache-Control:指示客户端应如何缓存，例如max-age=300表示可以最多缓存300秒

```java
HTTP/1.1 200 OK
Server: Tengine
Content-Type: text/html
Transfer-Encoding: chunked...
<html>
<head>
<title></title>
</head>
<body></body>
</html>
```

## HTTP - 状态码

详见:  https://cloud.tencent.com/developer/chapter/13553

![image-20221005112115757](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221005112115757.png)

![image-20221005112456310](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221005112456310.png)

![image-20221005112519712](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221005112519712.png)



# Web 基础补充

## Web 会话数据共享

> cookie 和 session  的使用方法
>
> cookie: 作用于浏览器客户端 | session: 作用于服务器 | 都能达到数据共享的目的

### Session  服务端

* 技术文档 API: [Servlet Session的使用 (biancheng.net)](http://c.biancheng.net/servlet2/session.html)

#### 1.Session 作用域

```java
01 - 请求作用域 - 仅在一次请求过程中有效 - request
		存入: request.setAttribute("名", 值);
		
02 - 会话作用域 同一个会话有效 - session
		存入: request.getSession().setAttribute("名", 值);
		获取_1: request.getSession().getAttribute("名");
		获取_2: session.getAttribute("名");
		销毁: request.getSession().removeAttribute("名");

03 - 全局作用域 整个web项目有效 - servletcontext | application
		存入: request.getServletContext().setAttribute("名", 值);
		
04 - jsp - 上下文作用域 - 只在jsp内有效 - pageContext
		pageContext.setAttribute("名", 值);
		<%= pageContext.getAttribute("page") %>
		
范围: 小 -> 大 pageContext < request < session < application
```

#### 2.Session  案例

```java
package com.apai.controller;

import jdk.nashorn.internal.parser.Token;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/jurisdiction")
public class JurisdictionController {

    @GetMapping(value="/setSession")
    @ResponseBody
    public void setSession(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws IOException {
        System.out.println("setSession: 1." + request);
        System.out.println("setSession: 2." + response);
        System.out.println("setSession: 3." + session);
        // 根据 session 设置值
        session.setAttribute("name", "阿派");
        // 根据 request 设置 session 的值
        request.getSession().setAttribute("pai", "阿派");
    }

    @GetMapping(value="/getSession")
    @ResponseBody
    public void getSession(HttpServletRequest request, HttpServletResponse response, HttpSession session, @RequestHeader("Token") String token) throws IOException {
        System.out.println("getSession: 1." + request);
        System.out.println("getSession: 2." + response);
        System.out.println("getSession: 3." + session);
        // 从 session 中根据名称获取值
        Object pai1 = session.getAttribute("pai");
        // 在 request 中获取session根据名称获取值
        String pai = (String) request.getSession().getAttribute("pai");
    }

}

```

#### 3.Session API

> Session 对象由服务器创建，通过 HttpServletRequest.getSession() 方法可以获得 HttpSession 对象，例如：

```java
// 获取session对象 HttpSession session=request.getSession();
```

> HttpSession 接口定义了一系列对 Session 对象操作的方法，如下表。

| 返回值类型     | 方法                                 | 描述                                                         |
| -------------- | ------------------------------------ | ------------------------------------------------------------ |
| long           | getCreationTime()                    | 返回创建 Session 的时间。                                    |
| String         | getId()                              | 返回获取 Seesion 的唯一的 ID。                               |
| long           | getLastAccessedTime()                | 返回客户端上一次发送与此 Session 关联的请求的时间。          |
| int            | getMaxInactiveInterval()             | 返回在无任何操作的情况下，Session 失效的时间，以秒为单位。   |
| ServletContext | getServletContext()                  | 返回 Session 所属的 ServletContext 对象。                    |
| void           | invalidate()                         | 使 Session 失效。                                            |
| void           | setMaxInactiveInterval(int interval) | 指定在无任何操作的情况下，Session 失效的时间，以秒为单位。负数表示 Session 永远不会失效。 |

> 在 javax.servlet.http.HttpSession 接口中定义了一系列操作属性的方法，如下表。

| 返回值类型  | 方法                                | 描述                                                         |
| ----------- | ----------------------------------- | ------------------------------------------------------------ |
| void        | setAttribute(String name, Object o) | 把一个 Java 对象与一个属性名绑定，并将它作为一个属性存放到 Session 对象中。 参数 name 为属性名，参数 object 为属性值。 |
| Object      | getAttribute(String name)           | 根据指定的属性名 name，返回 Session 对象中对应的属性值。     |
| void        | removeAttribute(String name)        | 从 Session 对象中移除属性名为 name 的属性。                  |
| Enumeration | getAttributeNames()                 | 用于返回 Session 对象中的所有属性名的枚举集合。              |

### Cookie 客户端

详见:

*  [Cookie用法大全](https://blog.csdn.net/qq_29132907/article/details/80390792)
*  技术文档 API: [Servlet Cookie的使用 (biancheng.net)](http://c.biancheng.net/servlet2/cookie.html)

#### 1.Cookie 案例

```java
package com.apai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/jurisdiction")
public class JurisdictionController {

    @GetMapping(value = "/setCookie")
    @ResponseBody
    public void setCookie(HttpServletRequest request, HttpServletResponse response, HttpSession session, @RequestHeader("Token") String token) throws IOException {
        // 创建 cookie 存入数据
        Cookie ck1 = new Cookie("account", "value_阿派");
        // 设置 cookie 的存活时间 默认为秒 | 特殊值: [0_不选择则立刻删除] [-1_关闭浏览器则删除]
        ck1.setMaxAge(60 * 60 * 24);
        // 发送cookie到客户端浏览器
        response.addCookie(ck1);
    }

    @GetMapping(value = "/getCookie")
    @ResponseBody
    public void getCookie(HttpServletRequest request, HttpServletResponse response, HttpSession session, @RequestHeader("Token") String token) throws IOException {
        // 获取的是请求里的所有cookie组成的数组
        Cookie[] cookie = request.getCookies();
        // 遍历 cookie 数组 | 通过名称 name 获取 cookie
        for(int i=0;i<cookie.length;i++){
            if("account".equals(cookie[i].getName())){
                System.out.println(cookie[i].getValue());//得到peter
                break;
            }
        }
    }

}
```

#### 2.Cookie 的 API

> HttpServletResponse 接口和 HttpServletRequest 接口也都定义了与 Cookie 相关的方法，如下表所示。

| 方法                          | 描述                                             | 所属接口                               |
| ----------------------------- | ------------------------------------------------ | -------------------------------------- |
| void addCookie(Cookie cookie) | 用于在响应头中增加一个相应的 Set-Cookie 头字段。 | javax.servlet.http.HttpServletResponse |
| Cookie[] getCookies()         | 用于获取客户端提交的 Cookie。                    | javax.servlet.http.HttpServletRequest  |

>javax.servlet.http.Cookie 类中提供了一系列获取或者设置 Cookie 的方法，如下表。

| 返回值类型 | 方法                          | 描述                                                         |
| ---------- | ----------------------------- | ------------------------------------------------------------ |
| int        | getMaxAge()                   | 用于获取指定 Cookie 的最大有效时间，以秒为单位。 默认情况下取值为 -1，表示该 Cookie 保留到浏览器关闭为止。 |
| String     | getName()                     | 用于获取 Cookie 的名称。                                     |
| String     | getPath()                     | 用于获取 Cookie 的有效路径。                                 |
| boolean    | getSecure()                   | 如果浏览器只通过安全协议发送 Cookie，则返回 true；如果浏览器可以使用任何协议发送 Cookie，则返回 false。 |
| String     | getValue()                    | 用于获取 Cookie 的值。                                       |
| int        | getVersion()                  | 用于获取 Cookie 遵守的协议版本。                             |
| void       | setMaxAge(int expiry)         | 用于设置 Cookie 的最大有效时间，以秒为单位。 取值为正值时，表示 Cookie 在经过指定时间后过期。取值为负值时，表示 Cookie 不会被持久存储，在 Web 浏览器退出时删除。取值为 0 时，表示删除该 Cookie。 |
| void       | setPath(String uri)           | 用于指定 Cookie 的路径。                                     |
| void       | setSecure(boolean flag)       | 用于设置浏览器是否只能使用安全协议（如 HTTPS 或 SSL）发送 Cookie。 |
| void       | setValue(String newValue)     | 用于设置 Cookie 的值。                                       |
| void       | setComment(String purpose)    | 对该cookie进行描述的信息(说明作用) ,浏览器显示cookie信息时能看到 |
| void       | setDomain(String pattem)      | 符合该pattem (域名正则)的就可以访问该Cookie的域名。如果设置为“.google.com ,则所有以“google .com"结尾的域名都可以访问该Cookie.注意第一 个字符必须为“.” |
| void       | setHttpOnly(boolean httpOnly) | 没为true后，只能通过ttp访问, javascnp(无法访问还可防止xss读取cookie |

#### 3.Cookie 的使用细节

> 使用 Cookie 开发时需要注意以下细节：

- 一个 Cookie 只能标识一种信息，它至少包含一个名称（NAME）和一个值（VALUE）。
- 如果创建了一个 Cookie，并发送到浏览器，默认情况下它是一个会话级别的 Cookie。用户退出浏览器就被删除。如果希望将 Cookie 存到磁盘上，则需要调用 setMaxAge(int maxAge) 方法设置最大有效时间，以秒为单位。
- 使用 setMaxAge(0) 手动删除 Cookie时，需要使用 setPath 方法指定 Cookie 的路径，且该路径必须与创建 Cookie 时的路径保持一致。

#### 4.Cookie 的缺点

> Cookie 虽然可以解决服务器跟踪用户状态的问题，但是它具有以下缺点：

- 在 HTTP 请求中，Cookie 是明文传递的，容易泄露用户信息，安全性不高。
- 浏览器可以禁用 Cookie，一旦被禁用，Cookie 将无法正常工作。
- Cookie 对象中只能设置文本（字符串）信息。
- 客户端浏览器保存 Cookie 的数量和长度是有限制的。

## Spring MVC 补充

* 详见: [Servlet到底是什么（非常透彻） (biancheng.net)](http://c.biancheng.net/servlet2/what-is-servlet.html)

### 乱码解决

```java
// 乱码解决

// 设置响应对象的字符集编码为UTF-8
response.setCharacterEncoding("UTF-8");
// 通过设置response的contentType来指定MIME类型		
response.setContentType("text/html;charset=UTF-8");
```

### 页面跳转

```java
// forward 转发页面和转发到的页面可以共享 request 里面的数据；redirect 不能共享数据

// 服务端转发 | forward
// 转发器-请求转发至指定文件-表示基于webapp根目录 转发通过转发器调用方法 forward() 实现	页面的跳转
req.getRequestDispatcher("/ 文件地址").forward(req, resp);

// 客户端重定向 | redirect 
// 重定向是客户端行为；服务端发送一个状态码告诉浏览器重新请求新的地址，因此地址栏显示的是新的 URL
resp.sendRedirect("文件地址")
resp.sendRedirect(req.getContextPath() + "/文件地址");
```

## Servlet 前端控制器

### 默认自带接口参数

* HttpServletRequest request
* HttpServletResponse response
* HttpSession session
* @RequestHeader("请求头名称") String 变量名

```java
@GetMapping(value = "/setCookie")
@ResponseBody
public void setCookie(HttpServletRequest request, HttpServletResponse response, HttpSession session, @RequestHeader("Token") String token) throws IOException {
    
}
```

### HttpServlet  请求 

1. Servlet 容器接收到来自客户端的 HTTP 请求后，容器会针对该请求分别创建一个 HttpServletRequest 对象和 HttpServletReponse 对象。

2. 容器将 HttpServletRequest 对象和 HttpServletReponse 对象以参数的形式传入 service() 方法内，并调用该方法。

3. 在 service() 方法中 Servlet 通过 HttpServletRequest 对象获取客户端信息以及请求的相关信息。

4. 对 HTTP 请求进行处理。

5. 请求处理完成后，将响应信息封装到 HttpServletReponse 对象中。

6. Servlet 容器将响应信息返回给客户端。

7. 当 Servlet 容器将响应信息返回给客户端后，HttpServletRequest 对象和 HttpServletReponse 对象被销毁。

### HttpServletRequest 接口

> [ HttpServletRequest 接口 乱码解决 ] 详见: [HttpServletRequest接口详解 (biancheng.net)](http://c.biancheng.net/servlet2/httpservletrequest.html)

```java
// 在 Servlet API 中，定义了一个 HttpServletRequest 接口，它继承自 ServletRequest 接口。HttpServletRequest 对象专门用于封装 HTTP 请求消息，简称 request 对象。

// HTTP 请求消息分为请求行、请求消息头和请求消息体三部分，所以 HttpServletRequest 接口中定义了获取请求行、请求头和请求消息体的相关方法。
```

#### 1.获取请求行信息

> HTTP 请求的请求行中包含请求方法、请求资源名、请求路径等信息，HttpServletRequest 接口定义了一系列获取请求行信息的方法

| 返回值类型 | 方法声明         | 描述                                                         |
| ---------- | ---------------- | ------------------------------------------------------------ |
| String     | getMethod()      | 该方法用于获取 HTTP 请求方式（如 GET、POST 等）。            |
| String     | getRequestURI()  | 该方法用于获取请求行中的资源名称部分，即位于 URL 的主机和端口之后，参数部分之前的部分。 |
| String     | getQueryString() | 该方法用于获取请求行中的参数部分，也就是 URL 中“?”以后的所有内容。 |
| String     | getContextPath() | 返回当前 Servlet 所在的应用的名字（上下文）。对于默认（ROOT）上下文中的 Servlet，此方法返回空字符串""。 |
| String     | getServletPath() | 该方法用于获取 Servlet 所映射的路径。                        |
| String     | getRemoteAddr()  | 该方法用于获取客户端的 IP 地址。                             |
| String     | getRemoteHost()  | 该方法用于获取客户端的完整主机名，如果无法解析出客户机的完整主机名，则该方法将会返回客户端的 IP 地址。 |

#### 2.获取请求头信息

> 当浏览器发送请求时，需要通过请求头向服务器传递一些附加信息，例如客户端可以接收的数据类型、压缩方式、语言等。为了获取请求头中的信息， HttpServletRequest 接口定义了一系列用于获取 HTTP 请求头字段的方法

| 返回值类型  | 方法声明                | 描述                                                         |
| ----------- | ----------------------- | ------------------------------------------------------------ |
| String      | getHeader(String name)  | 该方法用于获取一个指定头字段的值。 如果请求消息中包含多个指定名称的头字段，则该方法返回其中第一个头字段的值。 |
| Enumeration | getHeaders(String name) | 该方法返回指定头字段的所有值的枚举集合， 在多数情况下，一个头字段名在请求消息中只出现一次，但有时可能会出现多次。 |
| Enumeration | getHeaderNames()        | 该方法返回请求头中所有头字段的枚举集合。                     |
| String      | getContentType()        | 该方法用于获取 Content-Type 头字段的值。                     |
| int         | getContentLength()      | 该方法用于获取 Content-Length 头字段的值 。                  |
| String      | getCharacterEncoding()  | 该方法用于返回请求消息的字符集编码 。                        |

#### 3.获取 form 表单的数据

> 经常需要获取用户提交的表单数据，例如用户名和密码等。为了方便获取表单中的请求参数，ServletRequest 定义了一系列获取请求参数的方法，

| 返回值类型  | 方法声明                         | 功能描述                                                     |
| ----------- | -------------------------------- | ------------------------------------------------------------ |
| String      | getParameter(String name)        | 返回指定参数名的参数值。                                     |
| String [ ]  | getParameterValues (String name) | 以字符串数组的形式返回指定参数名的所有参数值（HTTP 请求中可以有多个相同参数名的参数）。 |
| Enumeration | getParameterNames()              | 以枚举集合的形式返回请求中所有参数名。                       |
| Map         | getParameterMap()                | 用于将请求中的所有参数名和参数值装入一个 Map 对象中返回。    |

### HttpServletResponse 接口

> [ HttpServletResponse 接口 乱码解决 ] 详见:[HttpServletResponse接口详解 (biancheng.net)](http://c.biancheng.net/servlet2/httpservletresponse.html)

#### 1.响应头相关的方法

HttpServletResponse 接口中定义了一系列设置 HTTP 响应头字段的方法，如下表所示。

| 返回值类型 | 方法                                 | 描述                                                         |
| ---------- | ------------------------------------ | ------------------------------------------------------------ |
| void       | addHeader(String name,String value)  | 用于增加响应头字段，其中，参数 name 用于指定响应头字段的名称，参数 value 用于指定响应头字段的值。 |
| void       | setHeader (String name,String value) | 用于设置响应头字段，其中，参数 name 用于指定响应头字段的名称，参数 value 用于指定响应头字段的值。 |
| void       | addIntHeader(String name,int value)  | 用于增加值为 int 类型的响应头字段，其中，参数 name 用于指定响应头字段的名称，参数 value 用于指定响应头字段的值，类型为 int。 |
| void       | setIntHeader(String name, int value) | 用于设置值为 int 类型的响应头字段，其中，参数 name 用于指定响应头字段的名称，参数 value 用于指定响应头字段的值，类型为 int。 |
| void       | setContentType(String type)          | 用于设置 Servlet 输出内容的 MIME 类型以及编码格式。          |
| void       | setCharacterEncoding(String charset) | 用于设置输出内容使用的字符编码。                             |

#### 2.响应体相关的方法

由于在 HTTP 响应消息中，大量的数据都是通过响应消息体传递的。因此 ServletResponse 遵循以 I/O 流传递大量数据的设计理念，在发送响应消息体时，定义了两个与输出流相关的方法。

| 返回值类型          | 方法              | 描述                     |
| ------------------- | ----------------- | ------------------------ |
| ServletOutputStream | getOutputStream() | 用于获取字节输出流对象。 |
| PrintWriter         | getWriter()       | 用于获取字符输出流对象。 |



# Spring 注解与通知

## Spring 注解

### 1. 元注解

介绍: 元注解用于设置自定义注解的注解

**@Target:**  用于定义注解可用在哪些目标元素上 | 描述了注解修饰的对象范围，取值在java lang.annotation.ElementType定义

```java
// @Target(ElementType.METHOD)
● METHOD:用于描述 作用于方法上
● PACKAGE: 用于描述包
● PARAMETER: 用于描述方法变量
● TYPE: 用于描述类、接口或enum类型
● FILE:用于描述字段(bean类字段)
    
// 内部字段为数组 可多个范围
// @Target({ElementType.METHOD, ElementType.TYPE, ElementType.PARAMETER})
```

**@Retention:**  表示注解保留时间长短。取值在java.lang annotation.RetentionPolicy中,取值为:

```java
// @Retention(RetentionPolicy.RUNTIME)
●SOURCE: 在源文件中有效,编译过程中会被忽略
●CLASS:随源文件一 起编译在class文件中，运行时忽略
●RUNTIME:在运行时有效 (在环绕通知内可以通过反射获取方法的所有信息 | 常用)
```

**@Documented:**  用于被修饰的Annotation类将被javadoc工具提取成文档，默认情况下，javadoc是不包括注解的

**@Inherited:**   指定Annotation具有继承性



### 2. 自定义注解

> 使用关键字 @interface  定义注解 | 注意以下几点:
>
> 自定义注解可配合AOP 切面通知通过反射获取信息实现日志记录| 详见: 其二日志实现

 *  a.注解类型 的成员属性要写成无参数成员方法
 *  b.一旦注解定义时指定了成员属性,则要引用该注解时,必须为该注解的所有成员传参
 *  c.如果引用某个注解时,为一个数组类型的成员属性传参,传多个参数值,则必须使用{},只传一个参数可以省略{}
 *  d.如果定义的成员属性名称为value时,在传参时可以省略value
 *  e.如果定义成员属性有多个时,在传参时value也必须写出来
 *  f.成员属性在定义时指定了默认值时,则可以不用为其传参

```java
import java.lang.annotation.*;
/**
 *  AOP 实现操作日志记录
 */
@Target(ElementType.METHOD) // 作用于方法上
@Retention(RetentionPolicy.RUNTIME) // 保留运行时 反射获取信息
@Documented // 文档
public @interface MySysLog {

    String value() default ""; // default: 默认值 | 没有默认值在使用注解时必须传值
    
    String[] params() default "";  // 数组可传递多个值

}

// 成员属性有多个时,在传参时value也必须写出来 | 数组可传递多个值
@MySysLog(value = "value的值", params = {"查询用户列表", "数组可传递多个值"})
```

## 反射获取注解值

### 反射获取注解值工具类

```java
package com.apai.util.anzhujie;

import cn.afterturn.easypoi.excel.annotation.Excel;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class MyGetAnnotations {

    /**
     * 获取实体类中 Excel 注解的值
     * @param instance
     * @param fieldMap
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

### 工具类的调用

```java
Map<Integer, String> dims = MyGetAnnotations.getDeclaredFieldsInfo(new 实体类(), new HashMap<>());
```



## AOP 切面通知

### 通知注解

```java
// 作用于类上: 表示此类为通知类 如:事务类就为通知类 包含回滚 提交方法等
@Aspect 

// 前置 用来通知类的方法上 | 指定位置范围执行此通知
@Before("execution(* com.woniu.service.*.*(..))")
// 后置
@AfterReturning("execution(* com.woniu.service.*.*(..))")
// 异常通知
@AfterThrowing("execution(* com.woniu.service.*.*(..))")
// 最终通知
@After("execution(* com.woniu.service.*.*(..))")
// 环绕通知
@Around("execution(* com.woniu.service.*.*(..))")

// 环绕通知 | 通过自定义注解来执行通知 | 只有方法上面有@MySysLog注解才会执行通知
@Around("@annotation(mysyslog)")
public Object save(ProceedingJoinPoint point, MySysLog mysyslog) {
	// 自定义注解可配合AOP切面通知通过反射获取信息实现日志记录| 详见: 其二日志实现
    // 执行环绕前置
    
    Object result = point.proceed(); // 立刻调用业务层方法
    
    // 执行环绕后置
}
```

### 通知详解

> 运行顺序:

* 正常情况: 环绕前 > 前置 > 执行方法 > 后置 > 最终 > 环绕后
* 异常情况: 环绕前 > 前置 > 执行方法 > 异常  > 最终 > 环绕后 

```java
后置: 只有在目标方法没有异常下回执行
异常: 只有在目标方法有异常下回执行
最终: 无论异常都会执行
环绕: 环绕的前 后无论异常都会执行
```

> 使用方法

```java
// 1.根据指定的范围执行切面通知
@Around("execution(* com.woniu.service.*.*(..))")
// 2.根据自定义注解来获取执行的方法进行切面通知
@Around("@annotation(自定义注解名:小写)")
```

```java
package com.apai;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Aspect
public class AopTest {

    @Before("execution(* com.apai.service.*.*(..))")
    public void before(JoinPoint point){
        System.out.println("Before_前置通知");
        // 方法名称
        String methodName = point.getSignature().getName();
        // 方法参数
        List<Object> args = Arrays.asList(point.getArgs());
    }

    // 后置
    @AfterReturning(value = "execution(* com.apai.service.*.*(..))", returning="result")
    public void afterReturning(JoinPoint point, Object result){
        System.out.println("AfterReturning_后置通知");
        // 方法名称
        String methodName = point.getSignature().getName();
        // 方法参数
        List<Object> args = Arrays.asList(point.getArgs());
        // 目标方法(没有返回值则为null)执行结果 
        System.out.println("AfterReturning_目标方法执行结果为：" + result);
    }
    
    // 异常通知
    @AfterThrowing(value = "execution(* com.apai.service.*.*(..))", throwing = "ex")
    public void afterThrowing(JoinPoint point, Exception ex){
        System.out.println("AfterThrowing_异常通知");
        // 方法名称
        String methodName = point.getSignature().getName();
        // 方法参数
        List<Object> args = Arrays.asList(point.getArgs());
        // 方法执行出错的异常信息
        System.out.println("AfterThrowing_方法执行出错的异常信息：" + ex);
    }
    
    // 最终通知
    @After("execution(* com.apai.service.*.*(..))")
    public void after(JoinPoint point){
        System.out.println("After_最终通知");
        // 方法名称
        String methodName = point.getSignature().getName();
        // 方法参数
        List<Object> args = Arrays.asList(point.getArgs());
    }

    // 环绕通知
    @Around("execution(* com.apai.service.*.*(..))")
    public Object aroundMethod(ProceedingJoinPoint pdj){
        // Around_环绕前 | 创建目标方法执行结果的变量
        Object result = null;
        // 方法名称
        String methodName = pdj.getSignature().getName();
        // 方法参数
        Object[] args = pdj.getArgs();
        System.out.println("Around_环绕前_方法参数：" + Arrays.asList(args));

        try {
            // 执行目标方法 获取目标方法(没有返回值则为null)执行结果 
            result = pdj.proceed();
        } catch (Throwable e) {
            // 捕获目标方法执行时抛出的异常
            System.out.println("Around_环绕执行目标方法异常为：" + e);
        }

        // Around_环绕后
        System.out.println("Around_环绕后" + result);
        return result;
    }

}
```

# Spring Boot 事务

## 事务_注解配置

```java
// 启动类 开启事务
@EnableTransactionManagement
// 业务层方法 指定事务方法
@Translation
```

## 事务_工具类

### 依赖

```xml
<!-- AOP 面向切面编程 事务支持-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### 事务_配置包

> config 包下   WebConfig

**注意:** 

* 事务的配置类 需要使用 AOP 依赖
* 方法名称必须以 设置的名称开头
* 注意更改 业务层的路径 防止扫描不到无法使用事务

```java
package com.apai.config;

import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.interceptor.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Configuration
// 开启事务注解
@EnableAspectJAutoProxy
// 开始事务管理器
@EnableTransactionManagement 
public class WebConfig {
    @Autowired
    DataSourceTransactionManager dataSourceTransactionManager;

    // 配置通知
    @Bean
    public TransactionInterceptor getTransactionInterceptor() {
        TransactionInterceptor transactionInterceptor = new TransactionInterceptor();
        transactionInterceptor.setTransactionManager(dataSourceTransactionManager);

        // 设置 readOnly 规则
        RuleBasedTransactionAttribute readOnlyTx = new RuleBasedTransactionAttribute();
        readOnlyTx.setReadOnly(true);
        readOnlyTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_SUPPORTS);
        // 设置 required 规则
        RuleBasedTransactionAttribute requiredTx = new RuleBasedTransactionAttribute();
        requiredTx.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
        requiredTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        // 绑定规则 | 业务层是方法名如需事务必须以指定的名称开头
        NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();
        Map<String, TransactionAttribute> txMap = new HashMap<>();
        txMap.put("save*", requiredTx);
        txMap.put("add*", requiredTx);
        txMap.put("insert*", requiredTx);
        txMap.put("delete*", requiredTx);
        txMap.put("update*", requiredTx);
        txMap.put("find*", readOnlyTx);
        txMap.put("get*", readOnlyTx);
        txMap.put("query*", readOnlyTx);
        source.setNameMap(txMap);

        transactionInterceptor.setTransactionAttributeSource(source);
        return transactionInterceptor;
    }

    // 配置事务切面 | 注意修改指定的业务层的路径
    @Bean
    public Advisor getAdvisor() {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression("execution(* com.apai.service.impl.*.*(..))");

        return new DefaultPointcutAdvisor(pointcut, getTransactionInterceptor());
    }
}
```



# Spring 过滤器和拦截器

参考: https://blog.csdn.net/dhklsl/article/details/127533485



# Spring Boot 内置 API

https://mp.weixin.qq.com/s/QdB_AVUoMHEbdorhU1ricg

## 字符串类 API

```java
| --- 字符串判空
// null:true  | "  ":false
Objects.isNull(变量) 
// null:空指针异常  | "  ":true
变量.trim().isEmpty() 
// null:true  | "  ":false
Objects.equals(变量, null) 
// null:字符串null 反之:变量.tostring
tring.valueOf(n) 
// hutool依赖 | null和" " 都为true
StrUtil.isBlank(变量)
```

## 集合类 API

```java
// 判断集合内是否存在该数据
list.contains("B") | 判断list是否存在 B
set.contains("B")  | 判断set是否存在 B
map.containsKey("1") | 判断map的键是否存在 1
map.containsValue("33") | 判断map的值是否存在 33
```

```java
// -- 集合互转 https://blog.csdn.net/wanghang88/article/details/105124582
// List转换为Array：
List<String> list = new ArrayList<String>();
list.add("China");
list.add("Switzerland");
list.add("Italy");
list.add("France");
String [] countries = list.toArray(new String[list.size()]);
// Array转换为List：
String[] countries = {"China", "Switzerland", "Italy", "France"};
List list = Arrays.asList(countries);
// Map转换为List：
List<Value> list = new ArrayList<Value>(map.values());
```





# | --- Java 基础应用操作

# 新 | 项目的分层

* inlet  | 请求获取 数据输出

  * web  | 请求表现层
    * vo  | 存放参数的封装类
  * subcribe  | 存放 消息队列 的类
  * timer  | 存放 定时器 的类

* service   | 存放业务层的接口

  * impl   | 存放业务类

  * dto  | 将业务从数据访问层获取的所有数据封装进 dto 的类  类似于多表查询封装的实体类 

    从而返回到表现层输出给前端

* adapter  | 将业务层需要的所有数据进行获取封装至po返回 如: mysql 或者 rides的数据

* outlet  | 数据访问层

  * dao / mapper  | 数据库的访问端口
  * es  | 类似数据库
  * po | 实体类 不能修改
  * rides  | 获取 rides 的数据 返回值业务层

* config  | 配置包

* exception  | 异常包

* filter  | 过滤器

* utils  | 工具包







# Git 项目管理工作流

## Gitkraken 小章鱼

### 克隆仓库

> 根据 码云平台创建的仓库地址 来进行克隆仓库

![image-20221009123020127](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221009123020127.png)

### 创建分支

> 在一个仓库里有很多的分支 | 每一个分支可对应的仓库内容不一样

![image-20221009123557416](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221009123557416.png)

### 历史版本的回滚

> 小章鱼会有所有代码提交的版本记录 | 可以选择历史版本进行回滚 

![image-20221009124704156](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221009124704156.png)

### 变基

> 在团队协作时 | master 主分支(版本代码合并) 和 dev 分支(编写代码) | 在合并时我们就需要dev的内容拉取到主分支上进行合并

![image-20221009130357999](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221009130357999.png)

### 提交忽略文件

> 忽略则表示每次提交云端的时候不会提交该文件

![image-20221009130941165](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221009130941165.png)

## IDEA _GIT  项目管理

### 安装 gitee 插件

![image-20221016171825259](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016171825259.png)

### 云端仓库代码拉取

![image-20221016172034214](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016172034214.png)

### 本地代码推送云端

流程:  先拉取 --> 有修改的文件使用暂存拉取 -->  解决冲突 -->  提交推送

![image-20221016172405790](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016172405790.png)

### 代码冲突

![image-20221016172818610](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016172818610.png)



## VsCode_GIT  项目管理

### 云端仓库代码拉取

#### 直接拉去

![image-20221016173041864](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173041864.png)

#### 暂存拉取

>  ( 当有修改的文件 直接拉取云端代码会报错 )

* 先进行 已修改的代码 暂存

![image-20221016173431654](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173431654.png)

* 在直接拉取
* 然后再弹出储存即可

![image-20221016173550629](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173550629.png)

#### 暂存拉取 命令板

```java
// 手动解决
①git stash 先将本地修改存储起来
②git pull 拉取远程
③git stash pop 还原暂存内容
```

### 本地代码推送云端

流程:  先拉取 --> 有修改的文件使用暂存拉取 -->  解决冲突 -->  提交推送

![image-20221016173900776](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173900776.png)

### 代码冲突

![image-20221016173639420](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173639420.png)

![image-20221016173647544](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20221016173647544.png)
