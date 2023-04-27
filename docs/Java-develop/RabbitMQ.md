---
title: RabbitMQ 消息队列
date: 2023/04/26
---

## RabbitMQ 消息队列安装 

> 详见: java开发工具安装栏 | java 补充记

### rabbitmq-server服务启动

```java
// 查看进程 端口信息
netstat -tlnp
// 根据端口 关闭进程
kill -9 端口号
// 关闭防火墙
systemctl stop firewalld.service

[root@localhost ~]#service rabbitmq-server start ## 启动服务
[root@localhost ~]#service rabbitmq-server stop ## 停止服务
[root@localhost ~]#service rabbitmq-server restart ## 重启服务
    
// 前端网页
http://192.168.174.133:15672
```

### 消息中间件 - 简介

MQ全称为Message Queue，消息队列是应用程序和应用程序之间的通信方法。是在消息的传输过程中保存消息的容器。多用于分布式系统之间进行通信，在项目中，可将一些无需即时返回且耗时的操作提取出来，进行**异步处理**，而这种异步处理的方式大大的节省了服务器的请求响应时间，从而**提高**了**系统**的**吞吐量**

**优势:** 

1.任务异步处理

> 同步方式：将不需要同步处理的并且耗时长的操作由消息队列通知消息接收方进行异步处理。提高了应用程序的响应时间。

2.应用程序解耦合

> MQ相当于一个中介，生产方通过MQ与消费方交互，它将应用程序进行解耦合。系统的耦合性越高，容错性就越低，可维护性就越低
>
> 使用消息队列的方式：使用 MQ 使得应用间解耦，提升容错性和可维护性。库存和支付和物流直接去MQ取到订单的信息即可，即使库存系统报错，没关系，等到库存修复后再次从MQ中去取就可以了

3.削峰填谷

> 如订单系统，在下单的时候就会往数据库写数据。但是数据库只能支撑每秒1000左右的并发写入，并发量再高就容易宕机。低峰期的时候并发也就100多个，但是在高峰期时候，并发量会突然激增到5000以上，这个时候数据库肯定卡死了。但不一定宕机，只会很慢，一旦宕机就会有消息丢失，

**劣势:** 

1、系统可用性降低：系统引入的外部依赖越多，系统稳定性越差。一旦 MQ 宕机，就会对业务造成影响。如何保证MQ的高可用？

2、系统复杂度提高：MQ 的加入大大增加了系统的复杂度，以前系统间是同步的远程调用，现在是通过 MQ 进行异步调用。如何保证消息没有被重复消费？怎么处理消息丢失情况？那么保证消息传递的顺序性？

3、一致性问题：A 系统处理完业务，通过 MQ 给B、C、D三个系统发消息数据，如果 B 系统、C 系统处理成功，D 系统处理失败。如何保证消息数据处理的一致性？

**既然 MQ 有优势也有劣势，那么使用 MQ 需要满足什么条件呢？**

> 生产者不需要从消费者处获得反馈。引入消息队列之前的直接调用，其接口的返回值应该为空，这才让明明下层的动作还没做，上层却当成动作做完了继续往后走，即所谓异步成为了可能。
> 容许短暂的不一致性。
> 确实是用了有效果。即解耦、提速、削峰这些方面的收益，超过加入MQ，管理MQ这些成本。





### RabbitMQ 快速入门

1、添加依赖

```xml
<dependencies>
    <!--rabbitmq java 客户端-->
    <dependency>
        <groupId>com.rabbitmq</groupId>
        <artifactId>amqp-client</artifactId>
        <version>5.6.0</version>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.0</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

2、创建生产方

创建队列queueDeclare（）参数说明：

| 参数       | 说明                                                         |
| :--------- | :----------------------------------------------------------- |
| queue      | 字符串值，queue 的名称。                                     |
| durable    | 布尔值，表示该 queue 是否持久化。 它决定了当 RabbitMQ 重启后，你是否还能 “看到” 重启前创建的 queue 。 另外，需要注意的是，queue 的持久化不等于其中的消息也会被持久化。 |
| exclusive  | 布尔值，表示该 queue 是否排它式使用。排它式使用意味着仅声明他的连接可见/可用，其它连接不可见/不可用。即一个队列只能有一个消费者，该队列仅对首次声明他它的连接可见，并在连接断开时自动删除，也就是说 生产者和消费者必须是同一个connection |
| autoDelete | 布尔值，表示当该 queue 没“人”（connection）用时，是否会被自动删除。 即，实现逻辑上的临时队列。项目启动时连接到 RabbitMQ ，创建队列；项目停止时断开连接，RabbitMQ 自动删除队列。 |
| arguments  | 其它参数 ，如消息过期时间x-message-ttl等                     |

发布消息basicPublish（）参数说明：

| 参数       | 说明                                                         |
| :--------- | :----------------------------------------------------------- |
| exchange   | 字符串值，交换机的名称。简单模式下交换机会使用默认的，默认是 “” |
| routingKey | 路由名称，如果交换机采用默认的 “ ” 那么routingKey要和队列名字保持一样 |
| props      | 消息属性，如消息内容编码，消息投递模式deliveryMode（1表示不持久化，2表示持久化）消息过期时间毫秒等 |
| body       | 消息内容                                                     |

```java
package com.apai;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class RabbitMqProducerApplication {

    public static void main(String[] args) throws IOException, TimeoutException {
        // 1、创建连接工程
        ConnectionFactory factory = new ConnectionFactory();

        // 2、设置参数
        factory.setHost("192.168.174.131");
        factory.setVirtualHost("/");//虚拟机 默认值 '/'
        factory.setPort(5672); //端口  默认值 5672
        factory.setUsername("guest");//用户名 默认 guest
        factory.setPassword("guest");//密码 默认值 guest

        // 3. 创建连接 Connection 对象
        Connection connection = factory.newConnection();

        // 4. 创建 Channel 信道
        Channel channel = connection.createChannel();

        // 5.创建队列：如果没有名字的队列，则会创建该队列，如果有就不会创建
        /**
         * queveDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete r Map<String，0bject> arguments)
         * 参数说明:
         *  queue 队列名宁
         *  durable .这个队列是否有持久化，不是队列的数据是否持久化 true表示要持久化
         *  exclusive这个是否尼独占队列只能有一个消费者 true表示是独占队列
         *  autoDelete这个以列如果没有数据了，会不会自动删除，true 就是自动删除
         *  arguments_从到的属性(.这个M列的数据要不要持久化，这个风列的消息过期时间是老久，规定这个队列只能放多少条数据)
         */
        channel.queueDeclare("paidaxingxing", true, false, false, null);

        // 6.发送数据
        /**
         * basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body)
         * 参数说明:
         *  exchange 交换机的名字， 因为消息是先发给交换机，然后在由交换机路由刺A剑的。如果没有写交换机，则默以会有--个空的交换机
         *  routingKey :路由键，就恳说il 列通过这个键和交换机形成了绑定关系，如果没 有路由随，则这froutingKey要和风外的名字- -样
         *  praps: 消息属性，如消息内容编码，投递模式
         *  body :消息内容
         **/
        String body = "hahahah";
        channel.basicPublish("", "paidaxingxing", null, body.getBytes());
        // 7. 释放资源
        channel.close();
        connection.close();
    }
}
```

3、创建消费端

```java
package com.apai;

import com.rabbitmq.client.*;

import java.io.IOException;

public class RabbitMqComsumerApplication {

    public static void main(String[] args) throws Exception {
        // 1、创建连接工程
        ConnectionFactory factory = new ConnectionFactory();
        // 2、设置参数
        factory.setHost("192.168.174.131");
        factory.setVirtualHost("/");//虚拟机 默认值 '/'
        factory.setPort(5672); //端口  默认值 5672
        factory.setUsername("guest");//用户名 默认 guest
        factory.setPassword("guest");//密码 默认值 guest

        //虚拟主机名
        factory.setVirtualHost("/");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        //重写 DefaultConsumer类的handleDelivery（）方法
        DefaultConsumer consumer = new DefaultConsumer(channel) {
            //回调方法，当收到消息后，会自动执行该方法
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope,
                                       AMQP.BasicProperties properties, byte[] body) throws IOException {
                //envelope 消息包的内容
                System.out.println("consumerTag:消息者标签" + consumerTag); //在channel.basicConsumer时候可以指定
                System.out.println("路由key为：" + envelope.getRoutingKey());
                System.out.println("交换机为：" + envelope.getExchange());
                System.out.println("消息id为：" + envelope.getDeliveryTag());
                System.out.println("接收到的消息为：" + new String(body, "utf-8"));
            }
        };

        /**
         * basicConsume(String queue, boolean autoAck, Consumer callback)
         * 参数：
         *  queue：队列名称
         *  autoAck: 是否自动确认，设置为true为表示消息接收到自动向mq回复接收到了，mq接收到回复会删除消息，设置为false则需要手动确认
         *  consumer: 上方重写的方法
         */
        channel.basicConsume("paidaxingxing", true, consumer);
        //不关闭资源
        //channel.close();
        //connection.close();
        //System.in.read();  //一直处于监听的状态
    }
}
```



## RabbitMQ 工作模式

**防坑指南:**

* 队列模式下: 未使用路由器则 key 要使用队列名字 路由器 exchange 为 空 ""

  

### Work queues 工作队列模式

* `Work Queues`与入门程序的`简单模式`相比，多了一个或一些消费端，多个消费端共同消费同一个队列中的消息。它们处于竞争者的关系，

* 一条消息只会被一个消费者接收，rabbit采用`轮询`的方式将消息是平均发送给消费者的；消费者在处理完某条消息后，才会收到下一条消息。

**应用场景**：对于 任务过重或任务较多情况使用工作队列可以提高任务处理的速度。如生产者生产一千条消息，那么c1和c2各消费500条,队列消费消息是均衡分配

> RabbitMQ 快速入门: 启动多个消费者 即可实现轮询的均衡分配



### 订阅模式类型

在订阅模型中，多了一个exchange角色，而且过程略有变化：

- P：生产者，也就是要发送消息的程序，但是不再发送到队列中，而是发给X（交换机）
- C：消费者，消息的接受者，会一直等待消息到来。
- Queue：消息队列，接收消息、缓存消息。
- Exchange：交换机，图中的X。一方面，接收生产者发送的消息。另一方面，知道如何处理消息，例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。到底如何操作，取决于Exchange的类型。Exchange有常见以下3种类型：
  - Fanout：广播，将消息交给所有绑定到交换机的队列
  - Direct：定向，把消息交给符合指定routing key 的队列
  - Topic：通配符，把消息交给符合routing pattern（路由模式） 的队列

**Exchange（交换机）只负责转发消息，不具备存储消息的能力**，因此如果没有任何队列与Exchange绑定，或者没有符合路由规则的队列，那么消息会丢失！

### 广播模式

> 无需指定 key 键 路由器会将消息传递至所有跟它绑定的 队列

创建交换机参数说明：

| 参数       | 说明                                                         |
| :--------- | :----------------------------------------------------------- |
| exchange   | 字符串值，交换机名称                                         |
| type       | 交换机的类型，有三种类型：FANOUT、DIRECT、TOPIC              |
| durable    | 交换机是否持久化，表示当rabbitmq重启时或者意外宕机，这个交换机还在不在 |
| autoDelete | 是否自动删除，表示当该交换机没人发消息时，是否会被自动删除。 |
| internal   | 内部使用，一般为false                                        |
| arguments  | 其它参数                                                     |

发送消息参数说明

| 参数       | 说明                                     |
| :--------- | :--------------------------------------- |
| exchange   | 字符串值，交换机名称                     |
| routingKey | 如果交换机类型是fanout，则routingKey为"" |
| props      | 消息基本属性配置                         |
| body       | 要发送的消息的内容                       |

**生产方:**

```java
package com.apai;

import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer_PubSub {

    public static void main(String[] args) throws IOException, TimeoutException {
        // 1、创建连接工程
        ConnectionFactory factory = new ConnectionFactory();

        // 2、设置参数
        factory.setHost("192.168.174.131");
        factory.setVirtualHost("/");//虚拟机 默认值 '/'
        factory.setPort(5672); //端口  默认值 5672
        factory.setUsername("guest");//用户名 默认 guest
        factory.setPassword("guest");//密码 默认值 guest

        // 3. 创建连接 Connection 对象
        Connection connection = factory.newConnection();

        // 4. 创建 Channel 信道
        Channel channel = connection.createChannel();

        // 5.创建队列：如果没有名字的队列，则会创建该队列，如果有就不会创建
        /**
         * queveDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete r Map<String，0bject> arguments)
         * 参数说明:
         *  queue 队列名
         *  durable 这个队列是否有持久化，不是队列的数据是否持久化 true表示要持久化
         *  exclusive这个是否尼独占队列只能有一个消费者 true表示是独占队列
         *  autoDelete这个以列如果没有数据了，会不会自动删除，true 就是自动删除
         *  arguments_从到的属性(.这个M列的数据要不要持久化，这个风列的消息过期时间是老久，规定这个队列只能放多少条数据)
         */
        channel.queueDeclare("duilie1", true, false, false, null);
        channel.queueDeclare("duilie2", true, false, false, null);

        // 6.创建交换机
        /** Exchange.DeclareOk exchangeDecLare(String exchange, String type)
         *  exchange: 交换机的名称
         *  type: 交换机类型  BuiltinExchangeType.FANOUT 广播 | DIRECT 定向 | TOPIC 分配符
         */
        channel.exchangeDeclare("jiaohuanji", BuiltinExchangeType.FANOUT);

        //7、交换机和队列的绑定
        /**
         * queueBind(String queue, String exchange, String routingKey, Map<string, 0bject>
         * queue: 队列名称
         * exchange: 交换机名称
         * routingKey: 路由的键 如果为广播模式fanout 则为空 " "
         * 0bject: 绑定规则
         */
        channel.queueBind("duilie1","jiaohuanji","",null);
        channel.queueBind("duilie2","jiaohuanji","",null);

        // 8.发送数据
        /**
         * basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body)
         * 参数说明:
         *  exchange 交换机的名字， 因为消息是先发给交换机，然后在由交换机路由刺A剑的。如果没有写交换机，则默以会有--个空的交换机
         *  routingKey :路由键，就恳说il 列通过这个键和交换机形成了绑定关系，如果没 有路由随，则这froutingKey要和风外的名字- -样
         *  praps: 消息属性，如消息内容编码，投递模式
         *  body :消息内容
         **/
        String body = "hahahah";
        channel.basicPublish("jiaohuanji", "", null, body.getBytes());
        // 9. 释放资源
        channel.close();
        connection.close();
    }
}
```



### Routing 路由模式

> 队列 和 路由器 在绑定时 加入对应的键  
>
> 在消息传递时 会根据键传递对应的消息

路由模式特点：

- 队列与交换机的绑定，不能是任意绑定了，而是要指定一个`RoutingKey`（路由key）
- 消息的发送方在 向 Exchange发送消息时，也必须指定消息的 `RoutingKey`。
- Exchange不再把消息交给每一个绑定的队列，而是根据消息的`Routing Key`进行判断，只有队列的`Routingkey`与消息的 `Routing key`完全一致，才会接收到消息

在编码上与 `Publish/Subscribe发布与订阅模式` 的区别是交换机的类型为：Direct，还有队列绑定交换机的时候需要指定routing key。

**生产方:**

```java
package com.apai;

import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer_Routing {

    public static void main(String[] args) throws IOException, TimeoutException {
        // 1、创建连接工程
        ConnectionFactory factory = new ConnectionFactory();

        // 2、设置参数
        factory.setHost("192.168.174.132");
        factory.setVirtualHost("/");//虚拟机 默认值 '/'
        factory.setPort(5672); //端口  默认值 5672
        factory.setUsername("guest");//用户名 默认 guest
        factory.setPassword("guest");//密码 默认值 guest

        // 3. 创建连接 Connection 对象
        Connection connection = factory.newConnection();

        // 4. 创建 Channel 信道
        Channel channel = connection.createChannel();

        // 5.创建队列：如果没有名字的队列，则会创建该队列，如果有就不会创建
        /**
         * queveDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete r Map<String，0bject> arguments)
         * 参数说明:
         *  queue 队列名宁
         *  durable .这个队列是否有持久化，不是队列的数据是否持久化 true表示要持久化
         *  exclusive这个是否尼独占队列只能有一个消费者 true表示是独占队列
         *  autoDelete这个以列如果没有数据了，会不会自动删除，true 就是自动删除
         *  arguments_从到的属性(.这个M列的数据要不要持久化，这个风列的消息过期时间是老久，规定这个队列只能放多少条数据)
         */
        channel.queueDeclare("duilie1", true, false, false, null);
        channel.queueDeclare("duilie2", true, false, false, null);

        // 6.创建交换机
        /** Exchange.DeclareOk exchangeDecLare(String exchange, String type)
         *  exchange: 交换机的名称
         *  type: 交换机类型  BuiltinExchangeType.FANOUT 广播 | DIRECT 定向 | TOPIC 分配符
         */
        channel.exchangeDeclare("jiaohuanji", BuiltinExchangeType.FANOUT);

        //7、交换机和队列的绑定
        /**
         * queueBind(String queue, String exchange, String routingKey, Map<string, 0bject>
         * queue: 队列名称
         * exchange: 交换机名称
         * routingKey: 路由的键 如果为广播模式fanout 则为空 " "
         * 0bject: 绑定规则
         */
        channel.queueBind("duilie1","jiaohuanji","one",null);
        channel.queueBind("duilie2","jiaohuanji","tow",null);

        // 8.发送数据
        /**
         * basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body)
         * 参数说明:
         *  exchange 交换机的名字， 因为消息是先发给交换机，然后在由交换机路由刺A剑的。如果没有写交换机，则默以会有--个空的交换机
         *  routingKey :路由键，就恳说il 列通过这个键和交换机形成了绑定关系，如果没 有路由随，则这froutingKey要和风外的名字- -样
         *  praps: 消息属性，如消息内容编码，投递模式
         *  body :消息内容
         **/
        String one = "one paipai";
        channel.basicPublish("jiaohuanji", "one", null, one.getBytes());

        String tow = "tow apaiapai--";
        channel.basicPublish("jiaohuanji", "tow", null, tow.getBytes());
        // 9. 释放资源
        channel.close();
        connection.close();
    }


}
```

### Topics 通配符模式

`Topic`类型与`Direct`相比，都是可以根据`RoutingKey`把消息路由到不同的队列。只不过`Topic`类型`Exchange`可以让队列在绑定`Routing key` 的时候**使用通配符**！`Routingkey` 一般都是有一个或多个单词组成，多个单词之间以”.”分割，例如： `item.insert`

 通配符规则：

`#`：匹配一个或多个词

`*`：匹配不多不少恰好1个词

举例：

`item.#`：能够匹配`item.insert.abc` 或者 `item.insert`

`item.*`：只能匹配`item.insert`

```java
// 队列 和 路由器 在绑定时 加入对应的通配符
channel.queueBind("duilie1","jiaohuanji","one.#",null);
// 消息发送时 只会发送符合要求的key键的队列
String one = "one paipai";
channel.basicPublish("jiaohuanji", "one.a.b.c", null, one.getBytes());
```



## ------- Spring -------

## Spring 整合 RabbitMQ

### 搭建生产者工程

> 新建 Meven 工程 RabbitMQ-producer 项目

#### pom 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.apai</groupId>
    <version>0.0.1-SNAPSHOT</version>
    <artifactId>Spring-RabbitMQ</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.1.7.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.amqp</groupId>
            <artifactId>spring-rabbit</artifactId>
            <version>2.1.8.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.1.7.RELEASE</version>
        </dependency>
    </dependencies>

</project>
```

#### RabbitMQ 连接信息: 

> rabbitmq.properties

```properties
rabbitmq.host=192.168.174.132
rabbitmq.port=5672
rabbitmq.username=guest
rabbitmq.password=guest
rabbitmq.virtual-host=/
```

#### RabbitMQ 配置: 

spring-rabbitmq.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">

    <context:property-placeholder location="rabbitmq.properties" />
    <!--主要创建bean对象-->
    <!--创建一个connnectionfactory publisher-confirms="true":开启交换机回调 publisher-returns="true" :开启队列的回调-->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
                               publisher-confirms="true"
                               publisher-returns="true"/>
    <!--创建 connection -->
    <rabbit:admin connection-factory="connectionFactory" />
    <!--创建 channel  创建一个会话  -->
    <rabbit:template connection-factory="connectionFactory" id="rabbitTemplate" />

    <!--创建队列-->
    <!-- 
		rabbit:queue id="队列名" name="队列名" 
		auto-declare="true | false" 是否持久化
 		auto-delete="false" 
		exclusive="false" true表示是独占队列
	-->
    <rabbit:queue id="isyueliangpai" durable="true" auto-delete="false" exclusive="false" name="isyueliangpai" />

    <!--创建队列-->
    <rabbit:queue id="fanout_queue1" name="fanout_queue1" auto-declare="true" />
    <rabbit:queue id="fanout_queue2" name="fanout_queue2" auto-declare="true" />
    <!--创建交换机  广播模式 fanout -->
    <!-- 
		rabbit:fanout-exchange 广播模式 | direct-exchange 路由模式 | topic-exchange 通配符模式
		name="fanout_exchange" id="fanout_exchange" 路由器名称
 		durable="true" 是否持久化
		auto-declare="true"
	-->
    <rabbit:fanout-exchange name="fanout_exchange" id="fanout_exchange" durable="true" auto-declare="true">
        <rabbit:bindings>
            <rabbit:binding queue="fanout_queue1"></rabbit:binding>
            <rabbit:binding queue="fanout_queue2"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:fanout-exchange>

    <!--创建队列-->

    <rabbit:queue id="direct_queue1" name="direct_queue1" auto-declare="true" />
    <rabbit:queue id="direct_queue2" name="direct_queue2" auto-declare="true" />
    <rabbit:queue id="direct_queue3" name="direct_queue3" auto-declare="true" />
    <!--创建交换机   路由模式 direct -->
    <rabbit:direct-exchange name="direct_exchange" id="direct_exchange" durable="true" auto-declare="true">
        <rabbit:bindings>
            <rabbit:binding queue="direct_queue1" key="order.add"></rabbit:binding>
            <rabbit:binding queue="direct_queue2" key="order.delete"></rabbit:binding>
            <rabbit:binding queue="direct_queue3" key="order.three"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:direct-exchange>

    <!--创建队列-->
    <rabbit:queue id="topic_queue1" name="topic_queue1" auto-declare="true" />
    <rabbit:queue id="topic_queue2" name="topic_queue2" auto-declare="true" />
    <!--创建交换机 通配符模式 topic -->
    <rabbit:topic-exchange name="topic_exchange" id="topic_exchange" auto-declare="true" >
        <rabbit:bindings>
            <rabbit:binding pattern="tpf.*" queue="topic_queue1"/>
            <rabbit:binding pattern="tpf.#" queue="topic_queue2"/>
        </rabbit:bindings>
    </rabbit:topic-exchange>

    <!--创建队列 TTL 生命周期 到期自动销毁-->
    <rabbit:queue id="TTL" name="TTL" auto-declare="true" auto-delete="false" durable="true" exclusive="false">
        <!--设置队列属性-->
        <rabbit:queue-arguments>
            <!--key="x-message-ttl" 设置队列过期时间-->
            <entry key="x-message-ttl" value="10000" value-type="int"></entry>
        </rabbit:queue-arguments>
    </rabbit:queue>


    <!--DLX  死信队列-->
    <!--1、声明正常队列（test_queue_dlx-->
    <rabbit:queue name="test_queue_dlx" id="test_queue_dlx">
        <!--1、正常队列绑定死信交换机-->
        <rabbit:queue-arguments>
            <!--1.1 x-dead-letter-exchange 死信交换机的名称-->
            <entry key="x-dead-letter-exchange" value="exchange_dlx" value-type="java.lang.String"/>
            <!--1.2 x-dead-letter-routing-key 正常队列发送消息到死信 交换机的routingKey-->
            <!--注意：这个routingKey和死信交换机发送消息到死信队列 匹配一致   dlx.## 能匹配到 dlx.hehe-->
            <entry key="x-dead-letter-routing-key" value="dlx.hehe" value-type="java.lang.String"/>

            <!--2 消息成为死信的三种情况 -->
            <!-- 2.1 设置队列的过期时间 ttl  x-message-ttl -->
            <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer" />
            <!--2.2 设置队列的长度限制 x-max-length-->
            <entry key="x-max-length" value-type="java.lang.Integer" value="10" />
        </rabbit:queue-arguments>
    </rabbit:queue>
    <!--正常交换机（test_exchange_dlx）-->
    <rabbit:topic-exchange name="test_exchange_dlx">
        <rabbit:bindings>
            <!--正常交换机发给正常队列的routingkey-->
            <rabbit:binding pattern="test.dlx.#" queue="test_queue_dlx"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:topic-exchange>

    <!--2、声明死信队列（queue_dlx-->
    <rabbit:queue name="queue_dlx"></rabbit:queue>
    <!--死信死信交换机(exchange_dlx)-->
    <rabbit:topic-exchange name="exchange_dlx">
        <rabbit:bindings>
            <!--pattern 死信交换机发送给死信队列的 routingkey-->
            <rabbit:binding pattern="dlx.#" queue="queue_dlx"></rabbit:binding>
        </rabbit:bindings>
    </rabbit:topic-exchange>



</beans>
```

#### test 测试

```java
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

// 必须使用 spring 整合的注解 进行配置注入
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring-rabbitmq.xml")
public class Test1 {


    @Autowired
    private RabbitTemplate rabbitTemplate;

    // junit的運行器，説白了就是它内部有一個main函數 如果对应没有路由器 默认是一个 "" 空的路由器 且要将 队列的名称 写入 key 里
    @Test
    public void test(){
        rabbitTemplate.convertAndSend("","isyueliangpai","paidaxing的大爆炸");
    }

    // 广播模式
    @Test
    public void fanout(){
        rabbitTemplate.convertAndSend("fanout_exchange","","广播模式消息");
    }

    // 路由模式
    @Test
    public void direct(){
        rabbitTemplate.convertAndSend("direct_exchange","order.add","路由模式消息 -- add");
        rabbitTemplate.convertAndSend("direct_exchange","order.delete","路由模式消息 -- delete");
    }

    // 通配符模式
    @Test
    public void topic(){
        rabbitTemplate.convertAndSend("topic_exchange","tpf.add.saas","通配符模式 -- ####");
        rabbitTemplate.convertAndSend("topic_exchange","tpf.delete","通配符模式 -- ****");
    }

    // 消息的可靠投递 即未正确传递消息的回调方法
    @Test
    public void huidiao(){

        /**
         * 交换机的回调: 不过是否出现异常都会执行回调方法
         * 注意: 需要在配置文件 connnectionfactory 上设置 publisher-confirms="true":开启交换机回调
         */
        RabbitTemplate.ConfirmCallback callback = new RabbitTemplate.ConfirmCallback() {
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
                // correlationData: 其实是一- 个可以装数据的容器
                // ack: 交换机是否收到了消息，如果收到了，就这回true， 否则返laifalse
                // cause: 如果交换机没有收到消息，则失嫩的原因是什么
                if (ack) {
                    System.out.println("交换机 成功收到消息");
                } else {
                    System.out.println("交换机 出现异常 打印异常信息为: " + cause);
                }
            }
        };
        rabbitTemplate.setConfirmCallback(callback);

        /**
         * 队列的回调: 只有出现错误时才会执行该回调方法
         * 注意: 需要在配置文件 connnectionfactory 上设置 publisher-returns="true" :开启队列的回调
         *      如果交换机对了队列也对了。则只会执行交换机的网谐confirmcallback
         *      如果交换机错了物只会执行交换机的创调confirmcallback
         *      如果交换机对了队列错了，先执行以列的四调returncallback,再执厅交换机的回调
         */
        rabbitTemplate.setMandatory(true);
        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                // message: 消县内容 | replyCode: 状态码 | replyText: 状态码 | exchange: 交换机的名称 | routingKey: 路由键
                System.out.println(message);
                System.out.println(replyCode);
                System.out.println(replyText);
                System.out.println(exchange);
                System.out.println(routingKey);
            }
        });

        rabbitTemplate.convertAndSend("topic_exchange","wwwwtpf.add.saas","通配符模式 -- ####");
        rabbitTemplate.convertAndSend("topic_exchange","tpf.delete","通配符模式 -- ****");
    }

    // Consumer ACK 消息测试
    @Test
    public void ack(){
        rabbitTemplate.convertAndSend("direct_exchange","order.three","Consumer ACK 消息测试!!");
    }

    // TTL生命周期 到期自动销毁 | 如果对应没有路由器 默认是一个 "" 空的路由器 且要将 队列的名称 写入 key 里
    @Test
    public void TTL(){

        /**
         * 设置单独消息的过期时间注意点:
         * 1. 如果某个消息单独设置了时间,在配置文件里配置过期时间，则以时内短的为准
         * 2. 如果有名条消息，要单独设置过期时间，则必须从第一-条消息开始没置
         */

        // 设置单独消息的过期时间
        MessagePostProcessor messagePostProcessor = new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws AmqpException {
                //刚才我们在配置文件设置的队列的消息是10秒，这里是5秒，注意:以时间短的为准
                message.getMessageProperties().setExpiration("5000"); //消息的过期时间
                return message;//消息一定要返回
            }
        };

        for (int i = 0; i < 10; i++) {
            if (i == 0) {
                // 设置单独消息的过期时间
                rabbitTemplate.convertAndSend("","TTL","TTL生命周期 5秒到期自动销毁", messagePostProcessor);
            }else {
                rabbitTemplate.convertAndSend("","TTL","TTL生命周期 到期自动销毁");
            }
        }
    }


    // DLX  死信队列
    @Test
    public void DLX  (){
        // 过期时间测试
        rabbitTemplate.convertAndSend("test_exchange_dlx","test.dlx.test","DLX  死信队列");
        // 超过范围测试
//        for (int i = 0; i < 20; i++) {
//            rabbitTemplate.convertAndSend("test_exchange_dlx","test.dlx.test","DLX  死信队列");
//        }
    }

}

```

### 搭建消费者工程

> pom 文件跟 生产方一致

> RabbitMQ 连接信息: rabbitmq.properties  文件跟 生产方一致

#### 消息打印类: 

```java
package com.apai.listener;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.stereotype.Component;


@Component
public class SimpleMessageListener implements MessageListener{
    @Override
    public void onMessage(Message message) {

        System.out.println(new String(message.getBody()));
        System.out.println("消息投遞標記"+message.getMessageProperties().getDeliveryTag());
    }
}

```

#### 业务层模拟: 

```java
package com.apai.listener;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.stereotype.Component;

/**
 * Consumer ACK机制：
 * 1、设置手动签收，在 listener-container容器中 添加 acknowledge = ”manual“
 * 2. 让监听器类实现ChannelAwareMessageListener接口
 * 3、如果 消息成功处理，则调用channel的basicAck()签收
 * 4、如果消息处理失败，则调用channel的Nack()拒绝签收,broker会重新发送消息给 consumer
 */
@Component
public class AckMessageListener implements ChannelAwareMessageListener {

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        try {
            // 输出消息内容 不能直接tostring 显示不正常
            System.out.println("消息的内容为: " + new String(message.getBody()));
            System.out.println("消息的投递标记为: " + message.getMessageProperties().getDeliveryTag());
            //正常的手动应答
            /**
             * basicAck(long deliveryTag, boolean multiple)
             * 参数
             * 1.deliveryTag 消息的标记，默认值从1开始， 你要应答哪一条消息
             * 2.multiple 是否批量应答，它会把没有应答的消息都应答，前提是这个标记要<=当前标记
             */
            int m = 1 / 0;
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
        } catch (Exception ex) {
            System.out.println("义务异常出错 进入 catch 拒绝应答");
            //拒绝签收（应答）
            /**
             * basicNack(long deliveryTag, boolean multiple, boolean requeue)
             * basicReject(long deliveryTag, boolean requeue);
             * 参数：
             * 1.deliveryTag 消息的投递标记
             * 2.multiple 是否批量拒绝
             * 3.requeue  如果拒绝了 true，则队列不会删除这条消息，而是重新再推送给你。如果为false，队列直接那这个
             * 消息删除（如果有死信队列就直接扔到死信队列），不会给你重发。
             */
            //channel.basicNack(message.getMessageProperties().getDeliveryTag(),true,true);
            //basicReject 也是用来拒绝应答的
            channel.basicReject(message.getMessageProperties().getDeliveryTag(), false);
        }
    }

}
```

#### RabbitMQ 配置: 

spring-rabbitmq.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">

    <context:component-scan base-package="com.apai.listener" />
    <context:property-placeholder location="rabbitmq.properties" />
    <!--主要创建bean对象-->
    <!--创建一个connnectionfactory-->
    <rabbit:connection-factory id="connectionFactory" host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>
    <!--创建connection -->
    <rabbit:admin connection-factory="connectionFactory" />
    <!--创建channel  创建一个会话  -->
    <rabbit:template connection-factory="connectionFactory" id="rabbitTemplate" />

    <!--获取指定的对应消息 queue-names="队列名" -->
    <!--acknowledge="manual" 表示手动应答，prefetch  = 1 表示每次从队列取1条，当然也可以prefetch = 10，每次取10条-->
    <rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual" prefetch = "1">
        <rabbit:listener ref="simpleMessageListener" queue-names="isyueliangpai" />
        <!--广播模式-->
        <rabbit:listener ref="simpleMessageListener" queue-names="fanout_queue1, fanout_queue2" />
        <!--路由模式-->
        <rabbit:listener ref="simpleMessageListener" queue-names="direct_queue1, direct_queue2" />
        <!--通配符模式-->
        <rabbit:listener ref="simpleMessageListener" queue-names="topic_queue1, topic_queue2" />
        <!--Consumer ACK 消息测试-->
        <rabbit:listener ref="ackMessageListener" queue-names="direct_queue3, test_queue_dlx" />
        <!--Consumer ACK 消息测试-->
        <rabbit:listener ref="dlxMessageListener" queue-names="queue_dlx" />
    </rabbit:listener-container>


</beans>
```

#### test 测试

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring-rabbitmq.xml")
public class Test1 {

    @Test
    public void test(){
        while(true){}
    }
}
```



## 消息的可靠投递

在使用 RabbitMQ 的时候，作为消息发送方希望杜绝任何消息丢失或者投递失败场景。RabbitMQ 为我们提供了两种方式用来控制消息的投递可靠性模式。

* confirm 确认模式
* return  退回模式

rabbitmq 整个消息投递的路径为：producer--->rabbitmq broker--->exchange--->queue--->consumer

* 消息从 producer 到 exchange，**不管exchange是否收到生产者消息**，都会返回一个 confirmCallback 。
* 消息从 exchange-->queue **投递失败**则会返回一个 returnCallback 。

我们将利用这两个 callback 控制消息的可靠性投递

### 异常回调

**防坑指南:** 

* 作用于 生产方 在消息传递时的监测 遇到路由器或者队列异常则可进行对应的回调
* 配置文件 connnectionfactory 上设置 publisher-confirms="true":开启交换机回调

### spring-rabbitmq.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">

    <context:property-placeholder location="rabbitmq.properties" />
    <!--主要创建bean对象-->
    <!--创建一个connnectionfactory publisher-confirms="true":开启交换机回调 publisher-returns="true" :开启队列的回调-->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}" publisher-confirms="true" publisher-returns="true"/>
    <!--创建connection -->
    <rabbit:admin connection-factory="connectionFactory" />
    <!--创建channel  创建一个会话  -->
    <rabbit:template connection-factory="connectionFactory" id="rabbitTemplate" />

    <!-- === 通配符模式 === -->
    <rabbit:queue id="topic_queue1" name="topic_queue1" auto-declare="true" />
    <rabbit:queue id="topic_queue2" name="topic_queue2" auto-declare="true" />
    <!--创建交换机   通配符模式 -->
    <rabbit:topic-exchange name="topic_exchange" id="topic_exchange" auto-declare="true" >
        <rabbit:bindings>
            <rabbit:binding pattern="tpf.*" queue="topic_queue1"/>
            <rabbit:binding pattern="tpf.#" queue="topic_queue2"/>
        </rabbit:bindings>
    </rabbit:topic-exchange>

</beans>
```

### test 测试

```java
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

// 必须使用 spring 整合的注解 进行配置注入
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring-rabbitmq.xml")
public class Test1 {


    @Autowired
    private RabbitTemplate rabbitTemplate;

    // 消息的可靠投递 即未正确传递消息的回调方法
    @Test
    public void huidiao(){

        /**
         * 交换机的回调: 不过是否出现异常都会执行回调方法
         * 注意: 需要在配置文件 connnectionfactory 上设置 publisher-confirms="true":开启交换机回调
         */
        RabbitTemplate.ConfirmCallback callback = new RabbitTemplate.ConfirmCallback() {
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
                // correlationData: 其实是一- 个可以装数据的容器
                // ack: 交换机是否收到了消息，如果收到了，就这回true， 否则返laifalse
                // cause: 如果交换机没有收到消息，则失嫩的原因是什么
                if (ack) {
                    System.out.println("交换机 成功收到消息");
                } else {
                    System.out.println("交换机 出现异常 打印异常信息为: " + cause);
                }
            }
        };
        rabbitTemplate.setConfirmCallback(callback);

        /**
         * 队列的回调: 只有出现错误时才会执行该回调方法
         * 注意: 需要在配置文件 connnectionfactory 上设置 publisher-returns="true" :开启队列的回调
         *   如果交换机对了队列也对了。则只会执行路由器回调confirmcallback
         *   如果交换机错了物只会执行交换机的回调confirmcallback
         *   如果交换机对了队列错了，先执行队列的回调returncallback,再执行交换机的回调
         */
        rabbitTemplate.setMandatory(true);
        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                // message: 消县内容 | replyCode: 状态码 | replyText: 状态码 | exchange: 交换机的名称 | routingKey: 路由键
                System.out.println(message);
                System.out.println(replyCode);
                System.out.println(replyText);
                System.out.println(exchange);
                System.out.println(routingKey);
            }
        });

        rabbitTemplate.convertAndSend("topic_exchange","twpf.add.saas","通配符模式 -- ####");
        rabbitTemplate.convertAndSend("topic_exchange","tpf.delete","通配符模式 -- ****");
    }
}
```



## Consumer ACK 应答

ack指Acknowledge(翻译为：应答)，表示消费端收到消息后的确认方式。有三种确认方式：

* 自动确认：acknowledge="none"
* 手动确认：acknowledge="manual"
* 根据异常情况确认：acknowledge="auto"，（这种方式使用麻烦，不作讲解）

其中自动确认是指，当消息一旦被Consumer接收到，则自动确认收到，并将相应 message 从 RabbitMQ 的消息缓存中移除。但是在实际业务处理中，很可能消息接收到，业务处理出现异常，那么该消息就会丢失。如果设置了手动确认方式，则需要在业务处理成功后，调用channel.basicAck()，手动确认，如果出现异常，则调用channel.basicNack()方法，让其自动重新发送消息。

### 消费方的应答

**防坑指南:**

* 作用于 消费方 当业务层获取消息后出现异常但又消费的消息的情况
* 能够根据 异常 来对应执行 消息的应答和拒绝

### spring-rabbitmq.xml

> rabbit:listener-container 添加配置:  设置手动签收
>
> ||  acknowledge="manual" 表示手动应答，prefetch  = 1 表示每次从队列取1条，当然也可以prefetch = 10，每次取10条
>
> rabbit:listener ref="指定使用类" queue-names="队列名称"

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/rabbit
       http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">

    <context:component-scan base-package="com.apai.listener" />
    <context:property-placeholder location="rabbitmq.properties" />
    <!--主要创建bean对象-->
    <!--创建一个connnectionfactory-->
    <rabbit:connection-factory id="connectionFactory" host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>
    <!--创建connection -->
    <rabbit:admin connection-factory="connectionFactory" />
    <!--创建channel  创建一个会话  -->
    <rabbit:template connection-factory="connectionFactory" id="rabbitTemplate" />

    <!--获取指定的对应消息 queue-names="队列名" -->
    <!--acknowledge="manual" 表示手动应答，prefetch  = 1 表示每次从队列取1条，当然也可以prefetch = 10，每次取10条-->
    <rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual" prefetch = "1">
        <rabbit:listener ref="simpleMessageListener" queue-names="isyueliangpai" />
        <!--Consumer ACK 消息测试-->
        <rabbit:listener ref="ackMessageListener" queue-names="direct_queue3" />
    </rabbit:listener-container>
</beans>
```

### ackMessageListener 使用类

> 监听消息 根据业务是否出现异常 进行消息的应答和拒绝

```java
package com.apai.listener;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.stereotype.Component;

/**
 * Consumer ACK机制：
 * 1、设置手动签收，在 listener-container容器中 添加 acknowledge = ”manual“
 * 2. 让监听器类实现ChannelAwareMessageListener接口
 * 3、如果 消息成功处理，则调用channel的basicAck()签收
 * 4、如果消息处理失败，则调用channel的Nack()拒绝签收,broker会重新发送消息给 consumer
 */
@Component
public class AckMessageListener implements ChannelAwareMessageListener {

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        try {
            // 输出消息内容 不能直接tostring 显示不正常
            System.out.println("消息的内容为: " + new String(message.getBody()));
            System.out.println("消息的投递标记为: " + message.getMessageProperties().getDeliveryTag());
            //正常的手动应答
            /**
             * basicAck(long deliveryTag, boolean multiple)
             * 参数
             * 1.deliveryTag 消息的标记，默认值从1开始， 你要应答哪一条消息
             * 2.multiple 是否批量应答，它会把没有应答的消息都应答，前提是这个标记要<=当前标记
             */
            int m = 1 / 0;
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
        } catch (Exception ex) {
            System.out.println("义务异常出错 进入 catch 拒绝应答");
            //拒绝签收（应答）
            /**
             * basicNack(long deliveryTag, boolean multiple, boolean requeue)
             * basicReject(long deliveryTag, boolean requeue);
             * 参数：
             * 1.deliveryTag 消息的投递标记
             * 2.multiple 是否批量拒绝
             * 3.requeue  如果拒绝了 true，则队列不会删除这条消息，而是重新再推送给你。如果为false，队列直接那这个
             * 消息删除（如果有死信队列就直接扔到死信队列），不会给你重发。
             */
            //channel.basicNack(message.getMessageProperties().getDeliveryTag(),true,true);
            //basicReject 也是用来拒绝应答的
            channel.basicReject(message.getMessageProperties().getDeliveryTag(), false);
        }
    }
}
```

## 消费端限流

> 消费端每次从队列中取一部分消息，然后消费者解决完业务处理，当业务处理完之后，消费者采用手动应答的方式，回应消息队列，然后继续取一部分消息处理，实现削峰填谷的效果

**消费端工程的配置文件配置如下**

注意:  在<rabbit:listener-container> 中配置 prefetch属性设置消费端一次拉取多少消息，消费端的确认模式一定为手动确认。acknowledge="manual"

```xml
<!--定义监听器容器-->
<!--acknowledge="manual" 表示手动应答，prefetch  = 1 表示每次从队列取1条-->
<rabbit:listener-container connection-factory="connectionFactory"
acknowledge="manual" prefetch = "1">
<!--<rabbit:listener ref="ackListener" queue-names="test_queue_confirm" />-->
<rabbit:listener ref="qosListener" queue-names="test_queue_confirm" />
</rabbit:listener-container>
```





## TTL 消息生命周期

> TTL 全称 Time To Live（存活时间/过期时间）。当消息到达存活时间后，还没有被消费，会被自动清除。RabbitMQ可以对消息设置过期时间，也可以对整个队列（Queue）设置过期时间。当消息超过过期时间还没有被消费，则丢弃

#### 图形化设置

1、添加交换机

![image-20220211120541264](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211120541264.png) 

2、添加队列，设置队列的过期时间

![image-20220211120639547](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211120639547.png) 

3、交换机和消息队列的绑定

![image-20220211120727976](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211120727976.png) 

交换机发送消息  

![image-20220211120750369](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211120750369.png) 

#### 代码实现

**防坑指南:**

* 如果某个消息单独设置了时间,在配置文件里配置过期时间，则以时内短的为准
* 如果有名条消息，要单独设置过期时间，则必须从第一-条消息开始没置

**1.配置文件**

```xml
<!--创建队列 TTL 生命周期 到期自动销毁-->
    <rabbit:queue id="TTL" name="TTL" auto-declare="true" auto-delete="false" durable="true" exclusive="false">
        <!--设置队列属性-->
        <rabbit:queue-arguments>
            <!--key="x-message-ttl" 设置队列过期时间-->
            <entry key="x-message-ttl" value="10000" value-type="int"></entry>
        </rabbit:queue-arguments>
    </rabbit:queue>
```

**2.测试**

```java
// TTL生命周期 到期自动销毁 | 如果对应没有路由器 默认是一个 "" 空的路由器 且要将 队列的名称 写入 key 里
@Test
public void TTL(){
    /**
    * 设置单独消息的过期时间注意点:
    * 1. 如果某个消息单独设置了时间,在配置文件里配置过期时间，则以时内短的为准
    * 2. 如果有名条消息，要单独设置过期时间，则必须从第一-条消息开始没置
    */

    // 设置单独消息的过期时间
    MessagePostProcessor messagePostProcessor = new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            //刚才我们在配置文件设置的队列的消息是10秒，这里是5秒，注意:以时间短的为准
            message.getMessageProperties().setExpiration("5000"); //消息的过期时间
            return message;//消息一定要返回
        }
    };

    for (int i = 0; i < 10; i++) {
        if (i == 0) {
            // 设置单独消息的过期时间
            rabbitTemplate.convertAndSend("","TTL","TTL生命周期 5秒到期自动销毁", messagePostProcessor);
        }else {
            rabbitTemplate.convertAndSend("","TTL","TTL生命周期 到期自动销毁");
        }
    }
}
```



## DLX  死信队列

死信队列，英文缩写：DLX  。Dead Letter Exchange（死信交换机），当消息在队列成为Dead message后，通过该队列把这条死信消息发给另一个交换机，这个交换机就是DLX。

### **流程:**

 正常路由器 --> 正常队列 --> 拒绝签收且不重发 --> 死信路由器 --> 死信队列

![image-20220728151856201](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220728151856201.png)

### **消息成为死信的三种情况： **

* 队列消息长度到达限制；
* 消费者拒接消费消息，basicNack/basicReject,并且不把消息重新放入原目标队列,requeue=false；
* 原队列存在消息过期设置，消息到达超时时间未被消费；

### 创建死信队列

> **1、配置交换机和队列**

```xml
<!--DLX  死信队列-->
<!--1、声明正常队列（test_queue_dlx-->
<rabbit:queue name="test_queue_dlx" id="test_queue_dlx">
    <!--1、正常队列绑定死信交换机-->
    <rabbit:queue-arguments>
        <!--1.1 x-dead-letter-exchange 死信交换机的名称-->
        <entry key="x-dead-letter-exchange" value="exchange_dlx" value-type="java.lang.String"/>
        <!--1.2 x-dead-letter-routing-key 正常队列发送消息到死信 交换机的routingKey-->
        <!--注意：这个routingKey和死信交换机发送消息到死信队列 匹配一致   dlx.## 能匹配到 dlx.hehe-->
        <entry key="x-dead-letter-routing-key" value="dlx.hehe" value-type="java.lang.String"/>

        <!--2 消息成为死信的三种情况 -->
        <!-- 2.1 设置队列的过期时间 ttl  x-message-ttl -->
        <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer" />
        <!--2.2 设置队列的长度限制 x-max-length-->
        <entry key="x-max-length" value-type="java.lang.Integer" value="10" />
    </rabbit:queue-arguments>
</rabbit:queue>
<!--正常交换机（test_exchange_dlx）-->
<rabbit:topic-exchange name="test_exchange_dlx">
    <rabbit:bindings>
        <!--正常交换机发给正常队列的routingkey-->
        <rabbit:binding pattern="test.dlx.#" queue="test_queue_dlx"></rabbit:binding>
    </rabbit:bindings>
</rabbit:topic-exchange>

<!--2、声明死信队列（queue_dlx-->
<rabbit:queue name="queue_dlx"></rabbit:queue>
<!--死信死信交换机(exchange_dlx)-->
<rabbit:topic-exchange name="exchange_dlx">
    <rabbit:bindings>
        <!--pattern 死信交换机发送给死信队列的 routingkey-->
        <rabbit:binding pattern="dlx.#" queue="queue_dlx"></rabbit:binding>
    </rabbit:bindings>
</rabbit:topic-exchange>
```

> **2、生产者工程测试：**

```java
// DLX  死信队列
@Test
public void DLX  (){
    // 过期时间测试
    rabbitTemplate.convertAndSend("test_exchange_dlx","test.dlx.test","DLX  死信队列");
    // 超过范围测试
    for (int i = 0; i < 20; i++) {
        rabbitTemplate.convertAndSend("test_exchange_dlx","test.dlx.test","DLX  死信队列");
    }
}
```

> **3.  消费方添加正常队列的监听器**

* 监听 正常队列  当出现一异常 拒绝应答 且不进行重发 则进入死信队列
* 可在进行监听死信队列 进行对应的操作



## 日志与监控

### RabbitMQ日志

RabbitMQ默认日志存放路径： /var/log/rabbitmq/rabbit@xxx.log

日志包含了RabbitMQ的版本号、Erlang的版本号、RabbitMQ服务节点名称、cookie的hash值、RabbitMQ配置文件地址、内存限制、磁盘限制、默认账户guest的创建以及权限配置等等。

### rabbitmq常用命令

1、查看队列

~~~shell
rabbitmqctl list_queues               #查看所有虚拟主机里面的队列
rabbitmqctl list_queues  -p  /vhost   #查看某个虚拟主机里面的队列
~~~

2、删除所有队列

~~~powershell
rabbitmqctl stop_app   #关闭应用
rabbitmqctl reset      #清除队列中的消息
rabbitmqctl start_app  ## 再次启动此应用
~~~

> 注意：此方式，会同时删除一些配置信息，需要慎用

3、查看rabbitmq中的交换机

~~~shell
rabbitmqctl list_exchanges [-p  vhost]
~~~

4、rabbitmq的用户操作命令

~~~shell
rabbitmqctl list_users
rabbitmqctl add_user 用户名 密码
rabbitmqctl delete_user 用户名
~~~

5、查看未被确认的队列

~~~
rabbitmqctl list_queues  name messages_unacknowledged
~~~

6、查看队列环境变量

~~~shell
rabbitmqctl environment
~~~

7、查看队列消费者信息

~~~
rabbitmqctl list_consumers
~~~

8、查看队列连接

~~~
rabbitmqctl list_connections
~~~

9、查看准备就绪的队列

~~~
rabbitmqctl list_queues name messages_ready
~~~

10、查看单个队列的内存使用

~~~
rabbitmqctl list_queues name memory
~~~

11、列出所有虚拟主机

~~~shell
rabbitmqctl list_vhosts
rabbitmqctl status | grep rabbit  ##查看rabbitmq的版本
~~~



## 消息追踪

在使用任何消息中间件的过程中，难免会出现某条消息异常丢失的情况。

对于RabbitMQ而言，可能是因为生产者或消费者与RabbitMQ断开了连接，而它们与RabbitMQ又采用了不同的确认机制；也有可能是因为交换器与队列之间不同的转发策略；甚至是交换器并没有与任何队列进行绑定，生产者又不感知或者没有采取相应的措施；另外RabbitMQ本身的集群策略也可能导致消息的丢失。这个时候就需要有一个较好的机制跟踪记录消息的投递过程，以此协助开发和运维人员进行问题的定位。

在RabbitMQ中可以使用Firehose和rabbitmq_tracing插件功能来实现消息追踪。

### 消息追踪-Firehose(了解)

firehose的机制是将生产者投递给队列的消息，以及队列投递给消费者的消息按照指定的格式发送到默认的exchange上。这个默认的exchange的名称为**amq.rabbitmq.trace**，它是一个topic类型的exchange。发送到这个exchange上的消息的routing key为 publish.exchangename 和 deliver.queuename。其中exchangename和queuename为实际交换机和队列的名称，分别对应生产者投递到exchange的消息，和消费者从queue上获取的消息。

1、打开trace 功能

~~~shell
rabbitmqctl trace_on [-p vhost]     ##开启Firehose命令
~~~

> 打开 trace 会影响消息写入功能，适当打开后请关闭，关闭Firehose命令：rabbitmqctl trace_off [-p vhost]，打开后会多一个交换机，如下图

![image-20220211150538504](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211150538504.png) 



2、新建一个消息队列，并给该交换机绑定一个消息队列

![image-20220211150649960](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211150649960.png) 

![image-20220211150739166](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211150739166.png) 

3、打开任何一个其他的队列，并往队列发送一条消息，则这个test_trace队列也会有其他队列的消息

### 消息追踪-rabbitmq_tracing

rabbitmq_tracing和Firehose在实现上如出一辙，只不过rabbitmq_tracing的方式比Firehose多了一层GUI的包装，更容易使用和管理。

1、启用插件：

~~~shell
[root@localhost ~]## rabbitmq-plugins list                       ###查询插件
[root@localhost ~]## rabbitmq-plugins enable rabbitmq_tracing
~~~

![image-20220211151141485](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211151141485.png) 

1、新建一个trace，将来所有的消息都被trace保存起来，文件的默认路径为/var/tmp/rabbitmq-tracing

![image-20220211151244964](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211151244964.png) 

不管在哪个队列发送消息，都会保存到日志文件mytrace.log中

![image-20220211151427726](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220211151427726.png) 

如果是用其它的用户创建这个消息日志。则需要在/etc/rabbitmq/rabbit.config配置文件添加如下内容：创建的用户名和密码

~~~
{rabbitmq_tracing,
    [
     {directory, "/var/log/rabbitmq/rabbitmq_tracing"},
     {username, "woniu"}, 
     {password, "woniu"}
    ]
}
~~~

重启消息队列服务器即可



## ------- Spring Boot -------

## Spring-Boot 整合 RabbitMQ

### pom.xml

```xml
<dependencies>
    <!--rabbitmq 客户端-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
</dependencies>
```

### application.yml 配置

```yml
server:
  port: 8080

spring:
  application:
    name: Spring-boot-producer
  datasource:
    url: jdbc:mysql://localhost:3306/k15?useSSL=false&serverTimezone=UTC
    username: root
    password: 123456
    driverClassName: com.mysql.jdbc.Driver
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    ## 消息队列的虚拟主机
    virtual-host: /
    port: 5672
    ## 路由器消息确认配置 生产方 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: CORRELATED
    ## 开启 消息到队列的回调 生产方
    publisher-returns: true
    listener:
      simple:
        ## 开启手动应答 消费方
        acknowledge-mode: manual
        ## 队列每次拉取消息次数 消费方
        prefetch: 1
```

### RabbitMqConfig  创建

```java
package com.apai.config;


import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // 创建交换机 名称为: direct_exchange
    @Bean(name = "direct_exchange")
    public Exchange getExchange(){
        // return ExchangeBuilder.directExchange("direct_exchange").build();
        return new DirectExchange("direct_exchange",true,false);
    }

    // 创建队列 名称为: direct_queue 配置名称wei: queue1
    @Bean(name = "queue1")
    public Queue getQueue(){
        return new Queue("direct_queue",true,false,false,null);
        //return   QueueBuilder.durable("direct_queue").build();
    }

    // 队列和交换机的绑定 key为: x.y
    @Bean
    public Binding getBinding(@Qualifier("queue1") Queue queue, @Qualifier("direct_exchange") Exchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with("x.y").noargs();
    }

}

```

### 路由器 | 队列 | 回调

```java
package com.apai.config;

import com.apai.mapper.MessageMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//创建交换机和队列
@Configuration
@Slf4j
public class RabbitMqConfig {

    @Autowired
    private MessageMapper messageMapper;

    @Bean(name = "registor_exchange")
    public Exchange getDirectExchange() {
        return ExchangeBuilder.directExchange("registor_exchange").build();
    }

    @Bean(name = "registor_queue")
    public Queue getQueue() {
        return QueueBuilder.durable("registor_queue").build();
    }

    @Bean
    public Binding getBinding(@Qualifier("registor_queue") Queue queue,
                              @Qualifier("registor_exchange") Exchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("registor.add").noargs();
    }

    // 可自定义 rabbitTemplate配置 且可设置路由器和队列的回调
    @Bean
    public RabbitTemplate getRabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate();
        rabbitTemplate.setConnectionFactory(connectionFactory);

        //交换机的回调
        rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
               // 获取 CorrelationData封装的数据 为字符串
               String messageId = correlationData.getId();
            }
        });

        //队列的回调
        rabbitTemplate.setMandatory(true);
        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                // 获取 MessagePostProcessor 封装的数据 为字符串
                String messageId = message.getMessageProperties().getCorrelationId();
            }
        });
        
        return rabbitTemplate;
    }

}
```

### Controller 发送消息

```java
package com.apai.controller;


import com.apai.config.DlxRabbitmqConfig;
import com.apai.entity.User;
import com.apai.service.IUserService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    // 注入配置类的路由器 | 队列 ...
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @RequestMapping("/hello")
    public String hello(){
        // 根据 路由器名称 和 队列的key 对应的发送消息
        rabbitTemplate.convertAndSend("direct_exchange","x.y","随便");
        return "ok";
    }

}
```

### listener 接收消息

```java
package com.apai.listener;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Message;
import com.rabbitmq.client.Channel;

@Component
public class Mylistener {

    // 监听 队列名称为: direct_queue 的消息
    // 注意: 数组 queues = {"direct_queue", "队列名称2", "队列名称3", ...}
    @RabbitListener(queues = {"direct_queue"})
    public void hello(String str){
        System.out.println(str);
    }
    
    // 监听direct_queue队列 获取数据时调用该方法
    // String str 参数 发送消息的内容
    // correlationId 参数 可直接拿到额外的数据
    // Message 参数 可根据get获取发送的额外参数数据
    // Channel channel 参数 可进行应答 和 拒绝
    @RabbitListener(queues = {"direct_queue"})
    public void hello(String str, @Header(AmqpHeaders.CORRELATION_ID) String correlationId, Message message, Channel channel){
        try {
            // 可直接拿到额外的数据
            System.out.println(correlationId);
            // 可根据get获取发送的额外参数数据
            String messageId = message.getMessageProperties().getCorrelationId();
            System.out.println(messageId);
            System.out.println(str);

            // 应答 签收
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
        } catch (Exception e) {
            // 拒绝 应答 不签收
            try {
                channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

}
```



## 确认消息已到路由器

RabbitMQ 有一个配置属性 `spring.rabbitmq.publisher-confirm-type` 控制是否开启确认功能。该属性默认值是 **NONE** ，表示不开启消息确认。禁用发布确认模式，是默认值

**防坑指南:**

* 作用于 生产方 在消息传递时的监测 遇到路由器或者队列异常则可进行对应的回调
* 交换机的回调: 不管是否出现异常都会执行回调方法
* 如果交换机对了队列也对了。则只会执行路由器回调confirmcallback
* 如果交换机错了物只会执行交换机的回调confirmcallback
* 如果交换机对了队列错了，先执行队列的回调returncallback,再执行交换机的回调



### yml 配置

```yml
spring:
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    virtual-host: /
    port: 5672
    ## 消息确认配置 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: SIMPLE
```

### CORRELATED 异步

* publisher-confirm-type = CORRELATED

> 当改属性的值为 **CORRELATED** 时，表示支持以异步回调方式获得确认与否的信息。

```java
void Callback() {
    // CORRELATED 异步 | 开启异步则发送消息会继续执行下方程序不会阻塞
    // 路由器回调的方法
    rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
        @Override
        public void confirm(CorrelationData correlationData, boolean ack, String cause) {
            // 获取头数据的id
            System.out.println(correlationData.getId());
            System.out.println(ack);
        }
    });
    rabbitTemplate.convertAndSend("direct_exchange","item.add1", "异步测试");
    System.out.println("测试 --- 开启异步则发送消息会继续执行下方程序不会阻塞");
}
```

### SIMPLE 同步

- publisher-confirm-type = SIMPLE

> 当改属性的值为 SIMPLE时，表示支持以简单（同步阻塞等待）方式获得确认与否的信息。
>
> 这里会调用 Template的waitForConfirms方法，不过这个方法有个要求，它必须在 Template#invoke 方法中使用

```java
void contextLoads() {
    // SIMPLE 同步 | 开启同步则发送消息不会继续执行下方程序会阻塞
    String invoke = rabbitTemplate.invoke(new RabbitOperations.OperationsCallback<String>() {
        @Override
        public String doInRabbit(RabbitOperations operations) {
            try {
                // 发送消息
                operations.convertAndSend("direct_exchange", "item.add1", "异步测试");
                // 等待五秒在执行 如果路由器未获取到 在返回true 反之false
                boolean b = operations.waitForConfirms(5000);
                return "ok";
            } catch (AmqpException e) {
                return "error";
            }
        }
    });
    System.out.println(invoke);
    System.out.println("测试 --- 开启同步则发送消息不会继续执行下方程序会阻塞");
}
```

## 确认消息已到消息队列

### yml 配置

* spring.rabbitmq.publisher-returns=true

```yml
spring:
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    virtual-host: /
    port: 5672
    ## 消息确认配置 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: CORRELATED
    ## 开启 消息到队列的回调
    publisher-returns: true
```

### 队列回调

> 队列的回调: 只有队列出现错误时才会执行该回调方法

```java
@Autowired
private RabbitTemplate rabbitTemplate;

void quer() {
    // 开启队列的回调
    // 开启强制队列回调: rabbitTemplate.setMandatory(true);
    rabbitTemplate.setMandatory(true);
    rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
        @Override
        public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
            // 状态码: 312 即为发送消息到队列失败 key 错误
            System.out.println("状态码: " + replyCode);
        }
    });
    rabbitTemplate.convertAndSend("direct_exchange","7x.y", "异步测试");

    // 让线程保持运行 否则会出现 因为异步造成线程结束但回调还没结束而无法打印结果
    while (true){

    }
}
```



## Consumer ACK 应答

### yml 配置

```yml
spring:
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    virtual-host: /
    port: 5672
    ## 消息确认配置 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: CORRELATED
    ## 开启 消息到队列的回调
    publisher-returns: true
    listener:
      simple:
        ## 开启手动应答
        acknowledge-mode: manual
        ## 队列每次拉取消息次数
        prefetch: 1
```

### 应答与拒绝

```java
// 注意导包: Channel channel
import com.rabbitmq.client.Channel;

@RabbitListener(queues = {"direct_queue"})
public void hello(String str, Message message, Channel channel){
    try {
        // 可根据get获取发送的额外参数数据
        String messageId = message.getMessageProperties().getCorrelationId();
        System.out.println(messageId);
        System.out.println(str);

        // 应答 签收
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
    } catch (Exception e) {
        // 拒绝 应答 签收 | true 重发 false 不重发 | 消息被队列删除
        try {
            channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}
```



## 死信队列

### **死信队列流程:**

* 消息发送: 根据正常的路由器和key发送到注册的队列
* 消息转发死信路由器: 根据正常队列 绑定的死信路由器和key 在死信绑定方法中进行转发到死信队列

### **消息成为死信的三种情况： **

* 队列消息长度到达限制；
* 消费者拒接消费消息，basicNack/basicReject,并且不把消息重新放入原目标队列,requeue=false；
* 原队列存在消息过期设置，消息到达超时时间未被消费；

### 死信绑定关系

```java
package com.apai.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DlxRabbitmqConfig {

    // 正常路由器
    @Bean("orderExchange")
    public TopicExchange getTopicExchange(){
        return ExchangeBuilder.topicExchange("order_exchange").durable(true).build();
    }
    // 正常队列 | 需要与死信路由器进行绑定
    @Bean("orderQueue")
    public Queue getQueue(){
        return QueueBuilder.durable("order_queue")
            // 与死信路由器进行绑定
            .withArgument("x-dead-letter-exchange","order_exchange_Dlx")
            // key 键 | 必须和死信路由器和队列绑定的key一致
            .withArgument("x-dead-letter-routing-key","dlx.xx")
            // 设置 消息 的过期时间 过期进入死信队列
            .withArgument("x-message-ttl",10000)
            // 设置 队列的最大长度 超过部分直接进入死信队列
            .withArgument("x-max-length",10)
            .build();
    }
    // 正常路由器和正常队列进行绑定
    @Bean
    public Binding orderBinding(@Qualifier("orderExchange") TopicExchange topicExchange, @Qualifier("orderQueue") Queue orderQueue){
        return BindingBuilder.bind(orderQueue).to(topicExchange).with("order.#");
    }

    // 死信路由器
    @Bean("orderExchangeDlx")
    public TopicExchange getTopicExchangeDlx(){
        return ExchangeBuilder.topicExchange("order_exchange_Dlx").durable(true).build();
    }
    // 死信队列
    @Bean("orderQueueDlx")
    public Queue getQueueDlx(){
        return QueueBuilder.durable("order_queue_Dlx").build();
    }
    // 死信路由器和死信队列绑定
    @Bean
    public Binding orderTtlBinding(@Qualifier("orderExchangeDlx") TopicExchange orderDlxTopic, @Qualifier("orderQueueDlx") Queue orderDlxQueue){
        return BindingBuilder.bind(orderDlxQueue).to(orderDlxTopic).with("dlx.#");
    }
}
```





## ------- 月亮派集 -------

## RabbitMQ 消息的封装

### 数据的封装发送

```java
// 赋值额外的数据 消费方可进行调用该数据 队列可调用
MessagePostProcessor processor = new MessagePostProcessor() {
    @Override
    public org.springframework.amqp.core.Message postProcessMessage(org.springframework.amqp.core.Message message) throws AmqpException {
        // 封装数据
        message.getMessageProperties().setCorrelationId(item.getId()+"");
        return message;
    }
};
// 这个 CorrelationData 是给路由器和队列的回调可进行调用
CorrelationData data = new CorrelationData(item.getId()+"");
// 发送消息 和 封装的数据
rabbitTemplate.convertAndSend("路由器名称","key键","消息",processor,data);
```

### 回调调用数据

> 回调调用 CorrelationData 封装的数据

路由器回调获取 CorrelationData 头数据 | 为字符串类型

```java
String messageId = correlationData.getId();
```

队列回调获取 MessagePostProcessor 头数据 | 为字符串类型

```java
String messageId = message.getMessageProperties().getCorrelationId();
```

```java
package com.apai.config;

import com.apai.mapper.MessageMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//创建交换机和队列
@Configuration
@Slf4j
public class asdasdasd {

    @Autowired
    private MessageMapper messageMapper;

    @Bean(name = "registor_exchange")
    public Exchange getDirectExchange() {
        return ExchangeBuilder.directExchange("registor_exchange").build();
    }

    @Bean(name = "registor_queue")
    public Queue getQueue() {
        return QueueBuilder.durable("registor_queue").build();
    }

    @Bean
    public Binding getBinding(@Qualifier("registor_queue") Queue queue,
                              @Qualifier("registor_exchange") Exchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("registor.add").noargs();
    }

    // 可自定义 rabbitTemplate配置 且可设置路由器和队列的回调
    @Bean
    public RabbitTemplate getRabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate();
        rabbitTemplate.setConnectionFactory(connectionFactory);

        // 交换机的回调
        rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
             /**
             * @param correlationData  相关配置信息
             * @param ack 表示交换机是否成功收到生产者发送的消息，true成功，false 失败
             * @param s 失败原因，如果成功则该参数值为“”
             */
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
                // 获取 CorrelationData 头数据 | 为字符串类型
                String messageId = correlationData.getId();
            }
        });

        // 队列的回调 回退模式：当消息发送给Exchange，Exchange路由到Queue失败时，才执行ReturnCallback
        // 开启回退模式：publisher-returns="true"
        rabbitTemplate.setMandatory(true);
        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            /**
             *
             * @param message 消息对象
             * @param replyCode 错误码
             * @param replyText 错误信息
             * @param exchange 交互及名称
             * @param routingKey 路由键
             */
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                // 获取 CorrelationData 头数据 | 为字符串类型
                String messageId = message.getMessageProperties().getCorrelationId();
            }
        });
        return rabbitTemplate;
    }

}
```

### 消费方调用数据

> 消费方可调用 MessagePostProcessor 封装的额外的数据

```java
package com.apai.listener;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Message;
import com.rabbitmq.client.Channel;

@Component
public class Mylistener {

    // 监听 队列名称为: direct_queue 的消息
    // 注意: 数组 queues = {"direct_queue", "队列名称2", "队列名称3", ...}
    @RabbitListener(queues = {"direct_queue"})
    public void hello(String str){
        System.out.println(str);
    }
    
    // 监听direct_queue队列 获取数据时调用该方法
    // String str 参数 发送消息的内容
    // correlationId 参数 可直接拿到额外的数据
    // Message 参数 可根据get获取发送的额外参数数据
    // Channel channel 参数 可进行应答 和 拒绝
    @RabbitListener(queues = {"direct_queue"})
    public void hello(String str, @Header(AmqpHeaders.CORRELATION_ID) String correlationId, Message message, Channel channel){
        try {
            // 可直接拿到额外的数据
            System.out.println(correlationId);
            // 可根据get获取发送的额外参数数据
            String messageId = message.getMessageProperties().getCorrelationId();
            System.out.println(messageId);
            // str 消息的内容
            System.out.println(str);

            // 应答 签收
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
        } catch (Exception e) {
            // 拒绝 应答 不签收
            try {
                channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

}
```



## 中间件 总汇

### 基础参数详解

> 创建队列：

```java
queveDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete r Map<String，0bject> arguments)
// 队列名字
queue 
// 这个队列是否有持久化，不是队列的数据是否持久化 true表示要持久化
durable 
// 这个是否尼独占队列只能有一个消费者 true表示是独占队列
exclusive
// 这个以列如果没有数据了，会不会自动删除，true 就是自动删除
autoDelete
// 数据要不要持久化，这个风列的消息过期时间是老久，规定这个队列只能放多少条数据
arguments
```

> 创建交换机:

```java
Exchange.DeclareOk exchangeDecLare(String exchange, String type)
// 交换机的名称
exchange: 
// 交换机类型
type  
BuiltinExchangeType.FANOUT 广播 | DIRECT 定向 | TOPIC 分配符
```

> 交换机和队列的绑定:

```java
queueBind(String queue, String exchange, String routingKey, Map<string, 0bject>
// 队列名称
queue
// 交换机名称
exchange
// 路由的键 如果为广播模式fanout 则为空 " "
routingKey
// 绑定规则
0bject
```

> 消息的发送

```java
basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body)
// 交换机的名字， 因为消息是先发给交换机，然后在由交换机路由刺A剑的。如果没有写交换机，则默以会有--个空的交换机
exchange 
// 路由键，就恳说il 列通过这个键和交换机形成了绑定关系，如果没 有路由随，则这froutingKey要和风外的名字- -样
routingKey
// 消息属性，如消息内容编码，投递模式
praps
// 消息内容
body
```

> 消息的接收

```java
basicConsume(String queue, boolean autoAck, Consumer callback)
// 队列名称
queue：
// 是否自动确认，设置为true为表示消息接收到自动向mq回复接收到了，mq接收到回复会删除消息，设置为false则需要手动确认
autoAck: 
// 上方重写的方法
consumer: 
```

> 消息的接收时的回调

```java
public void handleDelivery(String consumerTag, Envelope envelope,
                           AMQP.BasicProperties properties, byte[] body)
// 消息者标签
consumerTag
// 路由key为
envelope.getRoutingKey()
// 交换机为
envelope.getExchange()
// 消息id为
envelope.getDeliveryTag()
// 接收到的消息
new String(body, "utf-8")
```

### 基础配置

#### 防坑指南

* 队列和路由器一旦被创建 然后修改了配置 进行消息发送会报错 需删除路由器或者队列 再次创建

* 如果监听的队列不存在 则项目无法启动且报错

* 两个 回调获取的额外数据分为两个不同的 方法获取

* 拒绝签收应答 | 会将消息在队列里直接删除

  

#### Rabbitmq-Spring依赖

```xml
<dependencies>
    <!--rabbitmq 客户端-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
</dependencies>
```

#### application.yml 配置

```yml
server:
  port: 8080

spring:
  application:
    name: Spring-boot-producer
  datasource:
    url: jdbc:mysql://localhost:3306/k15?useSSL=false&serverTimezone=UTC
    username: root
    password: 123456
    driverClassName: com.mysql.jdbc.Driver
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    virtual-host: /
    port: 5672
    ## 路由器消息确认配置 生产方 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: CORRELATED
    ## 开启 消息到队列的回调 生产方
    publisher-returns: true
    listener:
      simple:
        ## 开启手动应答 消费方
        acknowledge-mode: manual
        ## 队列每次拉取消息次数 消费方
        prefetch: 1
```

#### 路由器的种类

```java
FANOUT 广播 | DIRECT 定向 | TOPIC 分配符
-------------------------------------
fanout 广播 | direct 定向 | topic 分配符
```

#### 参数说明

**创建队列参数说明：**

| 参数       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| name       | 字符串值，exchange 的名称。                                  |
| durable    | 布尔值，表示该 queue 是否持久化。 持久化意味着当 RabbitMQ 重启后，该 queue 是否会恢复/仍存在。 另外，需要注意的是，queue 的持久化不等于其中的消息也会被持久化。 |
| exclusive  | 布尔值，表示该 queue 是否排它式使用。排它式使用意味着仅声明他的连接可见/可用，其它连接不可见/不可用。 |
| autoDelete | 布尔值，表示当该 queue 没“人”（connection）用时，是否会被自动删除。 |

不指定 durable、exclusive 和 autoDelete 时，默认为 *true* 、 *false* 和 *false* 。表示持久化、非排它、不用自动删除

**创建交换机参数说明**

| 参数       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| name       | 字符串值，exchange 的名称。                                  |
| durable    | 布尔值，表示该 exchage 是否持久化。 持久化意味着当 RabbitMQ 重启后，该 exchange 是否会恢复/仍存在。 |
| autoDelete | 布尔值，表示当该 exchange 没“人”（queue）用时，是否会被自动删除。 |

> 不指定 durable 和 autoDelete 时，默认为 *`true`* 和 *`false`* 。表示持久化、不用自动删除

#### Boot-RabbitMQ 常用方法

```java
// 创建交换机 name = "指定配置名称"
@Bean(name = "direct_exchange")
public Exchange getExchange(){
    // 方式一
    return ExchangeBuilder.directExchange("direct_exchange").build();
    // 方式二
    return new DirectExchange("direct_exchange",true,false);
}

//创建队列 name = "指定配置名称"
@Bean(name = "direct_queue")
public Queue getQueue(){
    // 方式一
    return new Queue("direct_queue",true,false,false,null);
    // 方式二
    return   QueueBuilder.durable("direct_queue").build();
}

//队列和交换机的绑定
@Bean
public Binding getBinding(@Qualifier("direct_queue") Queue queue, @Qualifier("direct_exchange") Exchange exchange){
    return BindingBuilder.bind(queue).to(exchange).with("x.y").noargs();
}

// 发送消息
rabbitTemplate.convertAndSend("路由器","key键","消息内容");

// 接收消息 注意: 数组{"队列名称2", "队列名称3", ...}
@RabbitListener(queues = {"队列名称"})
public void hello(String str){
    // 消息内容
    System.out.println(str);
}
```

#### ACK 应答

```java
// 注意导包: Channel channel
import com.rabbitmq.client.Channel;

// 应答 签收
channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);

// 拒绝 应答 签收 | true 重发 false 不重发 | 需要 try catch
channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
```

#### 消息发送的额外数据封装

##### 发送消息的额外数据封装

> 在生产方 发送消息时 可以封装额外的数据到 队列 以供消费方获取调用

```java
@Autowired
private RabbitTemplate rabbitTemplate;

void shuju() {
    // CORRELATED 异步 | 开启异步则发送消息会继续执行下方程序不会阻塞

    // MessagePostProcessor(): 用于封装额外的数据 可在消费方 Message 参数 set 获取发送的参数
    MessagePostProcessor postProcessor = new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            // 封装 setCorrelationId 的参数
            message.getMessageProperties().setCorrelationId("发送数据是额外封装数据");
            return message;
        }
    };

    // 路由器回调的方法
    rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
        @Override
        public void confirm(CorrelationData correlationData, boolean ack, String cause) {
            // 获取头数据的id 为字符串类型
            System.out.println(correlationData.getId());
            System.out.println(ack);
        }
    });
    
    //队列的回调
    rabbitTemplate.setMandatory(true);
    rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
        @Override
        public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
            // 获取头数据的id 消息的ID 为字符串
            String messageId = message.getMessageProperties().getCorrelationId();
        }
    });

    // 利用重载 在发送消息是时发送 postProcessor封装的数据 可在消费方获取
    // CorrelationData为容器对象 封装到属性到队列头部的数据 仅供回调调用获取
    CorrelationData data = new CorrelationData("头数据");
    rabbitTemplate.convertAndSend("direct_exchange","x.y", "异步测试", postProcessor, data);

    System.out.println("测试 --- 开启异步则发送消息会继续执行下方程序不会阻塞");
    // 让线程保持运行 否则会出现 因为异步造成线程结束但回调还没结束而无法打印结果
    while (true){

    }
}
```

##### 额外数据的获取

```java
package com.apai.listener;


import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class Mylistener {

    // 监听direct_queue队列 获取数据时调用该方法
    // String str 参数 发送消息的内容
    // correlationId 参数 可直接拿到额外的数据
    // Message 参数 可根据get获取发送的额外参数数据
    // Channel channel 参数 可进行应答 和 拒绝
    @RabbitListener(queues = {"direct_queue"})
    public void hello(String str, @Header(AmqpHeaders.CORRELATION_ID) String correlationId, Message message, Channel channel){
        try {
            // 可直接拿到额外的数据
            System.out.println(correlationId);
            // 可根据get获取发送的额外参数数据
            String messageId = message.getMessageProperties().getCorrelationId();
            System.out.println(messageId);
            System.out.println(str);

            // 应答 签收
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), true);
        } catch (Exception e) {
            // 拒绝 应答 签收
            try {
                channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

}

```



## RabbitMQ 注解

```java
// RabbitMqConfig 作用：spring的配置类，类创建队列 | 路由器的配置注解 属于spring 新注解
@Configuration

// 启动类 | 可不写也能正常使用 | 开启基于注解的RabbitMQ模式
@EnableRabbit

// 监听队列名称为: direct_queue 的消息然后执行下方方法 注意: 数组{"队列名称2", "队列名称3", ...}
@RabbitListener(queues = {"direct_queue"})
// 在@RabbitListener写在类上为前提 在方法上加上@RabbitListener时监听消息后执行该方法
@RabbitHandler
```
