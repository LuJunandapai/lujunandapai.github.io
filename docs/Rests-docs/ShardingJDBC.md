---
title: Spring 分库分表
date: 2023/04/28
---

# Sharding_JDBC



# 分库分表

分库分表就是为了解决由于数据量过大而导致数据库性能降低的问题，将原来独立的数据库拆分成若干数据库组成，将数据大表拆分成若干数据表组成，使得单一数据库、单一数据表的数据量变小，从而达到提升数据库性能的目的。

## 分库分表的方式

> 分库分表中通常包括：垂直分库、水平分库、垂直分表、水平分表四种方式。

### 垂直分表

> **垂直分表定义：将一个表按照字段分成多表，每个表存储其中一部分字段**

它带来的提升是：

1.为了避免IO争抢并减少锁表的几率，查看详情的用户与商品信息浏览互不影响

2.充分发挥热门数据的操作效率，商品信息的操作的高效率不会被商品描述的低效率所拖累。

```sql
-- 一般来说，某业务实体中的各个数据项的访问频次是不一样的，部分数据项可能是占用存储空间比较大的BLOB或是TEXT。例如上例中的商品描述。所以，当表数据量很大时，可以将表按字段切开，将热门字段、冷门字段分开放，这些库可以放在不同的存储设备上，避免IO争抢。垂直切分带来的性能提升主要集中在热门数据的  操作效率上，而且磁盘争用情况减少。
```

通常我们按以下原则进行垂直拆分:

* 把不常用的字段单独放在一张表;
* 把text，blob等大字段拆分出来放在附表中;
* 经常组合查询的列放在一张表中;

### 垂直分库

> **垂直分库是指按照业务将表进行分类，分布到不同的数据库上面，每个库可以放在不同的服务器上，它的核心理念是专库专用。**

通过垂直分表性能得到了一定程度的提升，但是还没有达到要求，并且磁盘空间也快不够了，因为数据还是始终限制在一台服务器，库内垂直分表只解决了单一表数据量过大的问题，但没有将表分布到不同的服务器上，因此每个  表还是竞争同一个物理机的CPU、内存、网络IO、磁盘

```sql
它带来的提升是：
-- 解决业务层面的耦合，业务清晰
-- 能对不同业务的数据进行分级管理、维护、监控、扩展等
-- 高并发场景下，垂直分库一定程度的提升IO、数据库连接数、降低单机硬件资源的瓶颈
垂直分库通过将表按业务分类，然后分布在不同数据库，并且可以将这些数据库部署在不同服务器上，从而达到多个服务器共同分摊压力的效果，但是依然没有解决单表数据量过大的问题
```

### 水平分库

> **水平分库是把同一个表的数据按一定规则拆到不同的数据库中，每个库可以放在不同的服务器上**。

它带来的提升是：

1.解决了单库大数据，高并发的性能瓶颈。

2.提高了系统的稳定性及可用性

```java
// 当一个应用难以再细粒度的垂直切分，或切分后数据量行数巨大，存在单库读写、存储性能瓶颈，这时候就需要进行水平分库了，经过水平切分的优化，往往能解决单库存储量及性能瓶颈。但由于同一个表被分配在不同的数据库，需要额外进行数据操作的路由工作，因此大大提升了系统复杂度
```

### 水平分表

> **水平分表是在同一个数据库内，把同一个表的数据按一定规则拆到多个表中**。

它带来的提升是：

* 优化单一表数据量过大而产生的性能问题
* 避免IO争抢并减少锁表的几率

```java
// 库内的水平分表，解决了单一表数据量过大的问题，分出来的小表中只包含一部分数据，从而使得单个表的数据量变小，提高检索性能
```

## 分库分表小结

本章介绍了分库分表的各种方式，它们分别是垂直分表、垂直分库、水平分库和水平分表：

* 垂直分表：可以把一个宽表的字段按访问频次、是否是大字段的原则拆分为多个表，这样既能使业务清晰，还能提升部分性能。拆分后，尽量从业务角度避免联查，否则性能方面将得不偿失。

* 垂直分库：可以把多个表按业务耦合松紧归类，分别存放在不同的库，这些库可以分布在不同服务器，从而使访问压力被多服务器负载，大大提升性能，同时能提高整体架构的业务清晰度，不同的业务库可根据自身情况定制优化方案。但是它需要解决跨库带来的所有复杂问题。

* 水平分库：可以把一个表的数据(按数据行)分到多个不同的库，每个库只有这个表的部分数据，这些库可以分布在不同服务器，从而使访问压力被多服务器负载，大大提升性能。它不仅需要解决跨库带来的所有复杂问题，还要解决数据路由的问题(数据路由问题后边介绍)。

* 水平分表：可以把一个表的数据(按数据行)分到多个同一个数据库的多张表中，每个表只有这个表的部分数据，这样做能小幅提升性能，它仅仅作为水平分库的一个补充优化。

**一般来说，在系统设计阶段就应该根据业务耦合松紧来确定垂直分库，垂直分表方案，在数据量及访问压力不是特别大的情况，首先考虑缓存、读写分离、索引技术等方案。若数据量极大，且持续增长，再考虑水平分库水平分表方案**

## 分库分表带来的问题

> 分库分表能有效的缓解了单机和单库带来的性能瓶颈和压力，突破网络IO、硬件资源、连接数的瓶颈，同时也带来了一些问题

###  事务一致性问题

由于分库分表把数据分布在不同库甚至不同服务器，不可避免会带来**分布式事务**问题

###  跨节点访问

在没有分库前，我们检索商品时可以通过以下SQL对店铺信息进行关联查询：

但垂直分库后**[商品信息和[店铺信息]**不在一个数据库，甚至不在一台服务器，无法进行关联查询。

可将原关联查询分为两次查询，第一次查询的结果集中找出关联数据id，然后根据id发起第二次请求得到关联数据，最后将获得到的数据进行拼装

### 跨节点分页、排序函数

跨节点多库进行查询时，limit分页、order by排序等问题，就变得比较复杂了。需要先在不同的分片节点中将数据进行排序并返回，然后将不同分片返回的结果集进行汇总和再次排序

如，进行水平分库后的商品库，按ID倒序排序分页，取第一页以上流程是取第一页的数据，性能影响不大，但由于商品信息的分布在各数据库的数据可能是随机的，如果是取第N页，需要将所有节点前N页数据都取出来合并，再进行整体的排序，操作效率可想而知。所以请求页数越大，系统的性能也会越差。

在使用Max、Min、Sum、Count之类的函数进行计算的时候，与排序分页同理，也需要先在每个分片上执行相应的函数，然后将各个分片的结果集进行汇总和再次计算，最终将结果返回

### 主键避重

在分库分表环境中，由于表中数据同时存在不同数据库中，主键值平时使用的自增长将无用武之地，某个分区数据库生成的ID无法保证全局唯一。因此需要单独设计全局主键，以避免跨库主键重复问题

### 公共表

实际的应用场景中，参数表、数据字典表等都是数据量较小，变动少，而且属于高频联合查询的依赖表。例子中**地理区域表**也属于此类型。

可以将这类表在每个数据库都保存一份，所有对公共表的更新操作都同时发送到所有分库执行。

由于分库分表之后，数据被分散在不同的数据库、服务器。因此，对数据的操作也就无法通过常规方式完成，并且  它还带来了一系列的问题。好在，这些问题不是所有都需要我们在应用层面上解决，市面上有很多中间件可供我们选择，其中Sharding-JDBC使用流行度较高，我们来了解一下它



# Sharding-JDBC 快速入门

## 引入maven依赖

注意:

* 这里使用 mybatis依赖 而不是 mybatis-plus依赖 [导致冲突报错}

```xml
<!-- Sharding-JDBC 分库分表 -->
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>4.0.0-RC1</version>
</dependency>

<!-- web 注解支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- mybatis -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>

<!-- mysql -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 分片规则配置

* 分片规则配置是sharding-jdbc进行对分库分表操作的重要依据，

* 配置内容包括：数据源、主键生成策略、分片策略等

* 在application.properties 中配置 (使用 yal 也是可以的 只不过太长排版容易出错)

```properties 
server.port=8080
spring.application.name=sharding-jdbc-simple
spring.http.charset=UTF-8
spring.http.force=true

# 以下是分片规则配置
# 定义数据源 可自定义 但是数据源信息都必须对应上
spring.shardingsphere.datasource.names=m1
spring.shardingsphere.datasource.m1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m1.jdbc-url=jdbc:mysql://localhost:3306/order_db?serverTimezone=UTC
spring.shardingsphere.datasource.m1.password=123456
spring.shardingsphere.datasource.m1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m1.username=root


# 指定t_order表的分片策略，分片策略包括分片键和分片算法
# t_order_$->{order_id % 2 + 1} $ = 主键 % 2 + 1 偶数储存1表 奇数储存2表
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.algorithm-expression=t_order_$->{order_id % 2 + 1}
# order_id 表的主键列名 表策略指定列名
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.sharding-column=order_id


# 指定t_order表的数据分布情况，配置数据节点 数据库策略
# t_order 逻辑表名 | m1.t_order_$->{1..5} 表示 m1 数据库的 t_order_1 到 5 表(范围 5张表)
spring.shardingsphere.sharding.tables.t_order.actual-data-nodes=m1.t_order_$->{1..2}


# order_id 表的主键列名 主键生成策略指定
spring.shardingsphere.sharding.tables.t_order.key-generator.column=order_id
# 指定t_order表的主键生成策略为SNOWFLAKE 内置了雪花算法
spring.shardingsphere.sharding.tables.t_order.key-generator.type=SNOWFLAKE


# 打开sql输出日志
spring.shardingsphere.props.sql.show=true
logging.level.com.woniu.dao=debug
logging.level.org.springframework.web=info
logging.level.root=info
```



# Sharding-JDBC 执行配置

## 水平分库分表

> **分库分表配置详解**

```java
// 指定数据库 m1,m2
	对应的连接 所有的数据库
// 指定分库策略
    指定分库策略所需的列
    写入分库策略的规则
// 指定分表策略
    指定分表策略所需的列
    写入分表策略的规则
// 数据节点 指定数据库和表的数据分布
// 指定 ID 主键的生成策略
    指定主键的列名
    指定生成策略 内置的雪花算法
// 打开sql输出日志
```

> 分库分表配置文件

```properties
server.port=8080
spring.application.name=Sharding_JDBC
spring.http.charset=UTF-8
spring.http.force=true

# 以下是分片规则配置
# 定义数据源 可自定义 但是数据源信息都必须对应上
spring.shardingsphere.datasource.names=m1,m2
# 分库 order_db_1
spring.shardingsphere.datasource.m1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m1.jdbc-url=jdbc:mysql://localhost:3306/order_db_1?serverTimezone=UTC
spring.shardingsphere.datasource.m1.password=123456
spring.shardingsphere.datasource.m1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m1.username=root
# 分库 order_db_2
spring.shardingsphere.datasource.m2.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m2.jdbc-url=jdbc:mysql://localhost:3306/order_db_2?serverTimezone=UTC
spring.shardingsphere.datasource.m2.password=123456
spring.shardingsphere.datasource.m2.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m2.username=root


# 分库策略，以user_id为分片键，分片策略为user_id % 2 + 1，user_id为偶数操作m1数据源，否则操作m2。
spring.shardingsphere.sharding.tables.t_order.database‐strategy.inline.algorithm‐expression= m$->{user_id % 2 + 1}
spring.shardingsphere.sharding.tables.t_order.database‐strategy.inline.sharding‐column=user_id


# 分表策略, 指定t_order表的分片策略，分片策略包括分片键和分片算法
# t_order_$->{order_id % 2 + 1} $ = 主键 % 2 + 1 偶数储存1表 奇数储存2表
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.algorithm-expression=t_order_$->{order_id % 2 + 1}
# order_id 表的主键列名 表策略指定列名
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.sharding-column=order_id


# 指定 数据库和表 的数据分布情况，配置数据节点 数据库策略
# t_order 逻辑表名 | m1.t_order_$->{1..5} 表示 m1 数据库的 t_order_1 到 5 表(范围 5张表)
spring.shardingsphere.sharding.tables.t_order.actual-data-nodes=m$->{1..2}.t_order_$->{1..2}


# 指定 t_order表的主键生成策略为SNOWFLAKE 内置了雪花算法
spring.shardingsphere.sharding.tables.t_order.key-generator.type=SNOWFLAKE
# order_id 表的主键列名 主键生成策略指定
spring.shardingsphere.sharding.tables.t_order.key-generator.column=order_id


# 打开sql输出日志
spring.shardingsphere.props.sql.show=true
logging.level.com.woniu.dao=debug
logging.level.org.springframework.web=info
logging.level.root=info
```



## 垂直分库分表

> **分库分表配置详解**

```java
// 指定数据库 m0,m1,m2
	对应的连接 所有的数据库
// 指定分库策略
    指定分库策略所需的列
    写入分库策略的规则
    由于垂直 t_user 没有多个数据库，故没有分库，不需要配置分库和分库的策略
// 指定分表策略
    指定分表策略所需的列
    写入分表策略的规则
    垂直分库的表就算只有一个也一定要分片策略要配置
// 数据节点 指定数据库和表的数据分布 
    配置 垂直分库的 t_user 数据节点
// 指定 ID 主键的生成策略
    指定主键的列名
    指定生成策略 内置的雪花算法
// 打开sql输出日志
```

> 分库分表配置文件

* 定义数据源 可自定义 但是数据源信息都必须对应上
* 由于垂直 t_user 没有多个数据库，故没有分库，不需要配置分库和分库的策略
* 垂直分库的表就算只有一个也一定要分片策略要配置

```properties
server.port=8080
spring.application.name=Sharding_JDBC
spring.http.charset=UTF-8
spring.http.force=true

# 以下是分片规则配置
# 定义数据源 可自定义 但是数据源信息都必须对应上
spring.shardingsphere.datasource.names=m0,m1,m2
# 垂直分库 user_db
spring.shardingsphere.datasource.m0.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m0.jdbc-url=jdbc:mysql://localhost:3306/user_db?serverTimezone=UTC
spring.shardingsphere.datasource.m0.password=root
spring.shardingsphere.datasource.m0.username=root
spring.shardingsphere.datasource.m0.type=com.zaxxer.hikari.HikariDataSource
# 分库 order_db_1
spring.shardingsphere.datasource.m1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m1.jdbc-url=jdbc:mysql://localhost:3306/order_db_1?serverTimezone=UTC
spring.shardingsphere.datasource.m1.password=123456
spring.shardingsphere.datasource.m1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m1.username=root
# 分库 order_db_2
spring.shardingsphere.datasource.m2.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m2.jdbc-url=jdbc:mysql://localhost:3306/order_db_2?serverTimezone=UTC
spring.shardingsphere.datasource.m2.password=123456
spring.shardingsphere.datasource.m2.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m2.username=root


# 分库策略，以user_id为分片键，分片策略为user_id % 2 + 1，user_id为偶数操作m1数据源，否则操作m2。
# 由于垂直 t_user 没有多个数据库，故没有分库，不需要配置分库和分库的策略
spring.shardingsphere.sharding.tables.t_order.database‐strategy.inline.algorithm‐expression= m$->{user_id % 2 + 1}
spring.shardingsphere.sharding.tables.t_order.database‐strategy.inline.sharding‐column=user_id


# 分表策略, 指定t_order表的分片策略，分片策略包括分片键和分片算法
# t_order_$->{order_id % 2 + 1} $ = 主键 % 2 + 1 偶数储存1表 奇数储存2表
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.algorithm-expression=t_order_$->{order_id % 2 + 1}
# order_id 表的主键列名 表策略指定列名
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.sharding-column=order_id
# 垂直分库的表就算只有一个也一定要分片策略要配置
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.algorithm-expression = t_user
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.sharding-column = user_id 



# 指定 数据库和表 的数据分布情况，配置数据节点 数据库策略
# t_order 逻辑表名 | m1.t_order_$->{1..5} 表示 m1 数据库的 t_order_1 到 5 表(范围 5张表)
spring.shardingsphere.sharding.tables.t_order.actual-data-nodes=m$->{1..2}.t_order_$->{1..2}
# 配置 垂直分库的 t_user 数据节点
spring.shardingsphere.sharding.tables.t_user.actual-data-nodes =m$->{0}.t_user 


# 指定 t_order表的主键生成策略为SNOWFLAKE 内置了雪花算法
spring.shardingsphere.sharding.tables.t_order.key-generator.type=SNOWFLAKE
# order_id 表的主键列名 主键生成策略指定
spring.shardingsphere.sharding.tables.t_order.key-generator.column=order_id


# 打开sql输出日志
spring.shardingsphere.props.sql.show=true
logging.level.com.woniu.dao=debug
logging.level.org.springframework.web=info
logging.level.root=info
```



## 公共表

公共表属于系统中数据量较小，变动少，而且属于高频联合查询的依赖表。参数表、数据字典表等属于此类型。可以将这类表在每个数据库都保存一份，所有更新操作都同时发送到所有分库执行。接下来看一下如何使用Sharding-JDBC实现公共表

> 在Sharding-JDBC规则中修改

* 实现两个数据库的公共表的同时的增删改 联动 
* 原理既是: 同时修改所有数据库的这一张表 | 一条sql换库执行多次

~~~properties
# 指定t_dict为公共表
spring.shardingsphere.sharding.broadcast-tables=t_dict
~~~



# MySql 主从同步

## 1.新增mysql的实例

> 复制原有mysql如：C:\dev\mysql-8.0.19-winx64(作为主库) ->C:\dev\mysql-8.0.19-winx64-s1(作为从库)，并修改以下从库的my.ini [第二步]

**然后将从库安装为windows服务，注意配置文件位置**

* 使用管理员打开 cmd 命令板
* 进入mysql安装的位置的 bin 目录下执行  | d: [进入D盘] | cd /D:\mysql-8.0.19-apai\bin 进入bin目录
* 出现 Service successfully installed. 表示成功

~~~shell
D:\mysql-8.0.19-apai\bin> mysqld install mysqls1 ‐‐defaults‐file="D:\mysql-8.0.19-apai\my.ini"
~~~

由于从库是从主库复制过来的，因此里面的数据完全一致，可使用原来的账号、密码登录

## 2.修改主、从库的配置文件(my.ini)

注意: 设置服务id时的位置 建议写在 [mysqld] 下方

> 主库：

~~~mysql
[mysqld]
# 运行端口 主从不能一致
port=3306
# 设置服务id 主从不能一致
server-id=1
# 指定数据库安装位置
basedir=C:\mysql-8.0.19-winx64
# 指定数据库数据的存放位置
datadir=C:\mysql-8.0.19-winx64\data

max_connections=200
max_connect_errors=10
character-set-server=UTF8MB4
default-storage-engine=INNODB
default_authentication_plugin=mysql_native_password

# 开启日志
log-bin=master‐bin
# 设置需要同步的数据库
binlog-do-db=user_db 
# 屏蔽系统库同步
binlog-ignore-db=mysql
binlog-ignore-db=information_schema 
binlog-ignore-db=performance_schema


[mysql]
default-character-set=UTF8MB4


[client]
port=3306
default-character-set=utf8
~~~

> 从库:

~~~mysql
[mysqld]
# 运行端口 主从不能一致
port=3307
#设置服务id 主从不能一致
server-id =2
# 指定数据库安装位置
basedir=D:\mysql-8.0.19-apai
# 指定数据库数据的存放位置
datadir=D:\mysql-8.0.19-apai\data

max_connections=200
max_connect_errors=10
character-set-server=UTF8MB4
default-storage-engine=INNODB
default_authentication_plugin=mysql_native_password

# 开启日志
log-bin = master-bin
# 设置需要同步的数据库
replicate_wild_do_table=user_db.%
# 屏蔽系统库同步
replicate_wild_ignore_table=mysql.% 
replicate_wild_ignore_table=information_schema.%
replicate_wild_ignore_table=performance_schema.%


[mysql]
default-character-set=UTF8MB4


[client]
port=3307
default-character-set=utf8
~~~

> 重启主库和从库，在cmd窗口执行如下

~~~cmd
net start [主库服务名mysql]
net start [从库服务名mysqls1]
~~~

**注意:** 

* 请注意，主从MySQL下的数据(data)目录下有个文件auto.cnf，文件中定义了uuid，要保证主从数据库实例的uuid不一样，直接删除从库auto.cnf文件，每次mysql启动都会生成该文件，里面存放UUID

```cmd
# 如果出现 在服务内 启动报错 原因: 指定启动的mysql路径错误则可以到注册表进行修改
# D:\mysql-8.0.19-apai\bin\mysqld mysqlsevicename
# 计算机注册表: \HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\mysql服务名
```



## 3.授权主从复制专用账号

> 在主数据库上创建账号，将来从库连接上主库需要该账号建立和主库的连接

~~~mysql
CREATE USER 'db_sync'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
grant replication slave on *.* to 'db_sync'@'%';  
FLUSH PRIVILEGES;
#‘%’表示任意客户端的ip地址
~~~

master连接的是主库，即端口为3306

slave连接的是从库，即端口为3307

## 4.确认位点

> 记录主库下的日志文件名以及从哪个点开始同步
>
> 在从库进行设置时需要配置该两个数值

~~~mysql
#flush logs 有时候同步日志文件没有刷新,需要执行flush logs;
show master status;
~~~



## 5.设置从库向主库同步数据检查链路

**查看主库和从库的UUID和serverid**

> 必须保证 主库和从库的UUID和serverid 不一致 | 否则报错

~~~mysql
show variables like '%server_uuid%';
show variables like '%server_id%';
~~~

**进行从库向主库同步数据检查链路**

> 需配置 主库的位点  

~~~mysql
#注意 如果之前此备库已有主库指向 需要先执行以下命令清空
STOP SLAVE;
STOP SLAVE IO_THREAD FOR CHANNEL '';
reset slave all;

#=======修改从库指向到主库，使用上一步记录的文件名以及位点============
CHANGE MASTER TO master_host = 'localhost',master_user = '主库创建的账号',master_password = '123456',master_log_file = '位点 File',master_log_pos = 位点 Position;
#启动同步
START SLAVE; 
#查看从库状态Slave_IO_Runing和Slave_SQL_Runing都为Yes说明同步成功，如果不为Yes，请检查error_log列，然后排查相关异常
show slave status;
~~~

> 在检查状态时 两个都是 yes 即成功 | 否则失败 可在 后边的 Erro 列里查询错误信息

最后测试在主库修改数据库，看从库是否能够同步成功。

> 注意，也可以在从库执行，show master status，也就是说从库也可以是别的数据库的主库，主库也可以是别的数据库的从库，另外有时候slave_io_running为no，查看error_log列，或者重启一下从库



# Sharding-JDBC 读写分离

**配置**

* 配置 读写分离 的两个数据源
* 分库策略 m0 写入数据 s0 读取数据 同时指定表
* 分表策略 读写分离 指定表和表的主键

~~~properties
server.port=8080
spring.application.name=Sharding_JDBC
spring.http.charset=UTF-8
spring.http.force=true

# 以下是分片规则配置
# 定义数据源 可自定义 但是数据源信息都必须对应上
spring.shardingsphere.datasource.names=m0,m1,m2,s0

spring.shardingsphere.datasource.m1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m1.jdbc-url=jdbc:mysql://localhost:3306/order_db_1?serverTimezone=UTC
spring.shardingsphere.datasource.m1.password=123456
spring.shardingsphere.datasource.m1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m1.username=root

spring.shardingsphere.datasource.m2.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m2.jdbc-url=jdbc:mysql://localhost:3306/order_db_2?serverTimezone=UTC
spring.shardingsphere.datasource.m2.password=123456
spring.shardingsphere.datasource.m2.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.m2.username=root
# 配置 读写分离的数据源
spring.shardingsphere.datasource.m0.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.m0.jdbc-url=jdbc:mysql://localhost:3306/user_db?serverTimezone=UTC
spring.shardingsphere.datasource.m0.password=123456
spring.shardingsphere.datasource.m0.username=root
spring.shardingsphere.datasource.m0.type=com.zaxxer.hikari.HikariDataSource
# 配置 读写分离的数据源
spring.shardingsphere.datasource.s0.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.s0.jdbc-url=jdbc:mysql://localhost:3306/user_db?serverTimezone=UTC
spring.shardingsphere.datasource.s0.password=123456
spring.shardingsphere.datasource.s0.username=root
spring.shardingsphere.datasource.s0.type=com.zaxxer.hikari.HikariDataSource


# 分库策略，以user_id为分片键，分片策略为user_id % 2 + 1，user_id为偶数操作m1数据源，否则操作m2。
spring.shardingsphere.sharding.tables.t_order.database?strategy.inline.algorithm?expression= m$->{user_id % 2 + 1}
spring.shardingsphere.sharding.tables.t_order.database?strategy.inline.sharding?column=user_id
# 分库策略 m0 写入数据 s0 读取数据
spring.shardingsphere.sharding.master-slave-rules.ds0.master-data-source-name=m0
spring.shardingsphere.sharding.master-slave-rules.ds0.slave-data-source-names=s0
spring.shardingsphere.sharding.tables.t_user.actual-data-nodes=ds0.t_user


# 分表策略, 指定t_order表的分片策略，分片策略包括分片键和分片算法
# t_order_$->{order_id % 2 + 1} $ = 主键 % 2 + 1 偶数储存1表 奇数储存2表
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.algorithm-expression=t_order_$->{order_id % 2 + 1}
spring.shardingsphere.sharding.tables.t_order.table-strategy.inline.sharding-column=order_id
# 分表策略 读写分离
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.algorithm-expression = t_user
spring.shardingsphere.sharding.tables.t_user.table-strategy.inline.sharding-column = user_id


# 指定 数据库和表 的数据分布情况，配置数据节点 数据库策略
# t_order 逻辑表名 | m1.t_order_$->{1..5} 表示 m1 数据库的 t_order_1 到 5 表(范围 5张表)
spring.shardingsphere.sharding.tables.t_order.actual-data-nodes=m$->{1..2}.t_order_$->{1..2}
# 指定中间表 t_dict 同时写入
spring.shardingsphere.sharding.broadcast-tables=t_dict

# 指定 t_order表的主键生成策略为SNOWFLAKE 内置了雪花算法
spring.shardingsphere.sharding.tables.t_order.key-generator.type=SNOWFLAKE
# order_id 表的主键列名 主键生成策略指定
spring.shardingsphere.sharding.tables.t_order.key-generator.column=order_id


# 打开sql输出日志
spring.shardingsphere.props.sql.show=true
logging.level.com.woniu.dao=debug
logging.level.org.springframework.web=info
logging.level.root=info
~~~



# Sharding-JDBC 执行原理

## 基本概念

> 逻辑表

水平拆分的数据表的总称。例：订单数据表根据主键尾数拆分为10张表，分别是t_order_0、t_order_1、t_order_2...到t_order_9,它们的逻辑表为t_order 

> 真实表

在分片的数据库中真实存在的物理表。即上个示例中的t_order_0到t_order_9

> 数据节点

数据分片的最小物理单元。由数据源名称和数据表组成，例ds_0.t_order_0

> 绑定表

指分片规则一致的主表和子表。例如：t_order表和t_order_item表，均按照order_id分片,绑定表之间的分区键完全相同，则此两张表互为绑定表关系。绑定表之间的多表关联查询不会出现笛卡尔积关联，关联查询效率将大大提升。举例说明，如果SQL为	

~~~sql
SELECT i.* FROM t_order o JOIN t_order_item i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);
~~~

在不配置绑定表关系时，假设分片键order_id将数值10路由至第0片，将数值11路由至第1片,那么路由后的SQL

~~~sql
SELECT i.* FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);

SELECT i.* FROM t_order_0 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);

SELECT i.* FROM t_order_1 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);

SELECT i.* FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);
~~~

在配置绑定表关系后，路由的SQL应该为2条，因为我们知道t_order_0和t_order_item_0就是在同一个数据库，t_order_1和t_order_item_1在同一个数据库

~~~sql
SELECT i.* FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);

SELECT i.* FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);
~~~

> 广播表

指所有的分片数据源中都存在的表，表结构和表中的数据在每个数据库中均完全一致。适用于数据量不大且需要与海量数据的表进行关联查询的场景，例如：字典表

> 分片键

用于分片的数据库字段，是将数据库(表)水平拆分的关键字段。例：将订单表中的订单主键的尾数取模分片，则订单主键为分片字段。 SQL中如果无分片字段，将执行全路由，性能较差。 除了对单分片字段的支持，Sharding-Jdbc也支持根据多个字段进行分片

> 分片算法

通过分片算法将数据分片，支持通过=、BETWEEN和IN分片。分片算法需要应用方开发者自行实现，可实现的灵活度非常高。包括：精确分片算法 、范围分片算法 ，复合分片算法等。例如：where order_id = ?将采用精确分片算法，where order_id in (?,?,?)将采用精确分片算法，where order_id BETWEEN ? and ? 将采用范围分片算 法，复合分片算法用于分片键有多个复杂情况

> 分片策略

分片键+分片算法=分片策略，由于分片算法的独立性，将其独立抽离。真正可用于分片操作的是分片键 + 分片算法，也就是分片策略。内置的分片策略大致可分为尾数取模、哈希、范围、标签、时间等。由用户方配置的分片策略则更加灵活，常用的使用行表达式配置分片策略，它采用Groovy表达式表示，如:	表示t_user_$->{u_id % 8}表示t_user表根据u_id模8，而分成8张表，表名称为t_user_0到t_user_7

自增主键生成策略

通过在客户端生成自增主键替换以数据库原生自增主键的方式，做到分布式主键无重复

## SQL解析

当Sharding-JDBC接受到一条SQL语句时，会陆续执行SQL解析=>查询优化=>SQL路由=>SQL改写=>SQL执行=>结果归并，最终返回执行结果

SQL解析过程分为**词法解析和语法解析**。 词法解析器用于将SQL拆解为不可再分的原子符号，称为Token。并根据不同数据库方言所提供的字典，将其归类为关键字，表达式，字面量和操作符。 再使用语法解析器将SQL转换为抽象语法树

例如，以下SQL：

~~~sql
SELECT id, name FROM t_user WHERE status = 'ACTIVE' AND age > 18
~~~

![image-20220809144105250](https://gitee.com/LuisApai/apai_imags/raw/master/image-20220809144105250.png) 

为了便于理解，抽象语法树中的关键字的Token用绿色表示，变量的Token用红色表示，灰色表示需要进一步拆分。

最后，通过对抽象语法树的遍历去提炼分片所需的**上下文**，并标记有可能需要**SQL改写**的位置。  供分片使用的解析上下文包含查询选择项（Select Items）、表信息（Table）、分片条件（Sharding Condition）、自增主键信息（Auto increment Primary Key）、排序信息（Order By）、分组信息（Group By）以及分页信息（Limit、Rownum、Top）

## SQL路由

SQL路由就是把针对**逻辑表**的数据操作映射到对数据结点操作的过程。

根据解析上下文匹配数据库和表的分片策略，并生成路由路径。 对于携带分片键的SQL，根据分片键操作符不同可以划分为单片路由(分片键的操作符是等号)、多片路由(分片键的操作符是IN)和范围路由(分片键的操作符是BETWEEN)，不携带分片键的SQL则采用广播路由。根据分片键进行路由的场景可分为直接路由、标准路由、笛卡尔路由等

### 标准路由

标准路由是Sharding-Jdbc最为推荐使用的分片方式，它的适用范围是不包含关联查询或仅包含绑定表之间关联查询的SQL。 当分片运算符是等于号时，路由结果将落入单库（表），当分片运算符是BETWEEN或IN时，则路由结果不一定落入唯一的库（表），因此一条逻辑SQL最终可能被拆分为多条用于执行的真实SQL。 举例说明，如果按order_id的奇数和偶数进行数据分片，一个单表查询的SQL如下

~~~sql
SELECT * FROM t_order WHERE order_id IN (1, 2);
~~~

那么路由的结果为：

~~~sql
SELECT * FROM t_order_0 WHERE order_id IN (1, 2);

SELECT * FROM t_order_1 WHERE order_id IN (1, 2);
~~~

绑定表的关联查询与单表查询复杂度和性能相当。举例说明，如果一个包含绑定表的关联查询的SQL如下：

~~~sql
SELECT * FROM t_order o JOIN t_order_item i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
~~~

那么路由的结果应为：

~~~sql
SELECT * FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
SELECT * FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
~~~

可以看到，SQL拆分的数目与单表是一致的

#### 笛卡尔路由

笛卡尔路由是最复杂的情况，它无法根据**绑定表**的关系定位分片规则，因此非绑定表之间的关联查询需要拆解为笛卡尔积组合执行。 如果上个示例中的SQL并未配置绑定表关系，那么路由的结果应为

~~~sql
SELECT * FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
SELECT * FROM t_order_0 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
SELECT * FROM t_order_1 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
SELECT * FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE order_id IN (1, 2);
~~~

笛卡尔路由查询性能较低，需谨慎使用

### 全库表路由

对于不携带分片键的SQL，则采取广播路由的方式。根据SQL类型又可以划分为全库表路由、全库路由、全实例路由、单播路由和阻断路由这5种类型。其中全库表路由用于处理对数据库中与其逻辑表相关的所有真实表的操作，  主要包括不带分片键的DQL(数据查询)和DML（数据操纵），以及DDL（数据定义）等。例如

~~~sql
SELECT * FROM t_order WHERE good_prority IN (1, 10); #good_prority不是分片键
~~~

则会遍历所有数据库中的所有表，逐一匹配逻辑表和真实表名，能够匹配得上则执行。路由后成为

~~~sql
SELECT * FROM t_order_0 WHERE good_prority IN (1, 10); 
SELECT * FROM t_order_1 WHERE good_prority IN (1, 10); 
SELECT * FROM t_order_2 WHERE good_prority IN (1, 10); 
SELECT * FROM t_order_3 WHERE good_prority IN (1, 10);
~~~

## QL改写

工程师面向**逻辑表**书写的SQL，并不能够直接在真实的数据库中执行，SQL改写用于将逻辑SQL改写为在真实数据库中可以正确执行的SQL。

如一个简单的例子，若逻辑SQL为：

~~~sql
SELECT order_id FROM t_order WHERE order_id=1;
~~~

假设该SQL配置分片键order_id，并且order_id=1的情况，将路由至分片表1。那么改写之后的SQL应该为：

~~~sql
SELECT order_id FROM t_order_1 WHERE order_id=1;
~~~

再比如，Sharding-JDBC需要在结果归并时获取相应数据，但该数据并未能通过查询的SQL返回。 这种情况主要是针对GROUP BY和ORDER BY。结果归并时，需要根据GROUP BY和ORDER BY的字段项进行分组和排序，但如果原始SQL的选择项中若并未包含分组项或排序项，则需要对原始SQL进行改写。 先看一下原始SQL中带有结果归并所需信息的场景：

~~~sql
SELECT order_id, user_id FROM t_order ORDER BY user_id;
~~~

由于使用user_id进行排序，在结果归并中需要能够获取到user_id的数据，而上面的SQL是能够获取到user_id数据的，因此无需补列

如果选择项中不包含结果归并时所需的列，则需要进行补列，如以下SQL

~~~sql
SELECT order_id FROM t_order ORDER BY user_id;
~~~

由于原始SQL中并不包含需要在结果归并中需要获取的user_id，因此需要对SQL进行补列改写。补列之后的SQL 是：

~~~sql
SELECT order_id, user_id AS ORDER_BY_DERIVED_0 FROM t_order ORDER BY user_id;
~~~

## SQL执行

Sharding-JDBC采用一套自动化的执行引擎，负责将路由和改写完成之后的真实SQL安全且高效发送到底层数据源执行。 它不是简单地将SQL通过JDBC直接发送至数据源执行；也并非直接将执行请求放入线程池去并发执行。它更关注平衡数据源连接创建以及内存占用所产生的消耗，以及最大限度地合理利用并发等问题。  执行引擎的目标是自动化的平衡资源控制与执行效率，他能在以下两种模式自适应切换

### 内存限制模式

使用此模式的前提是，Sharding-JDBC对一次操作所耗费的数据库连接数量不做限制。 如果实际执行的SQL需要对某数据库实例中的200张表做操作，则对每张表创建一个新的数据库连接，并通过多线程的方式并发处理，200个线程同时执行，以达成执行效率最大化

### 连接限制模式

使用此模式的前提是，Sharding-JDBC严格控制对一次操作所耗费的数据库连接数量。 如果实际执行的SQL需要对某数据库实例中的200张表做操作，那么只会创建唯一的数据库连接，并对其200张表串行处理。  如果一次操作中的分片散落在不同的数据库，仍然采用多线程处理对不同库的操作，但每个库的每次操作仍然只创建一个唯一的数据库连接。

内存限制模式适用于OLAP操作，可以通过放宽对数据库连接的限制提升系统吞吐量； 连接限制模式适用于OLTP操作，OLTP通常带有分片键，会路由到单一的分片，因此严格控制数据库连接，以保证在线系统数据库资源能够被更多的应用所使用，是明智的选择

> OLTP是传统的关系型数据库的主要应用，主要是基本的、日常的事务处理，比如数据库记录的增删查改；实时性要求高，高并发OLAP是数据仓库系统的主要应用，支持复杂的分析操作，侧重决策支持，并且提供直观易懂的查询结果。

## 结果归并

将从各个数据节点获取的多数据结果集，组合成为一个结果集并正确的返回至请求客户端，称为结果归并。

Sharding-JDBC支持的结果归并从功能上可分为遍历、排序、分组、分页、聚合5种类型，它们是组合而非互斥的关系。 

结果归并从结构划分可分为流式归并、内存归并和装饰者归并，流式归并和内存归并是互斥的，装饰者归并可以在流式归并和内存归并之上做进一步的处理。

**内存归并**很容易理解，他是将所有分片结果集的数据都遍历并存储在内存中，再通过统一的分组、排序以及聚合等 计算之后，再将其封装成为逐条访问的数据结果集返回

**流式归并**是指每一次从数据库结果集中获取到的数据，都能够通过游标逐条获取的方式返回正确的单条数据，它与数据库原生的返回结果集的方式最为契合。

下边举例说明排序归并的过程，如下图是一个通过分数进行排序的示例图，它采用流式归并方式。  图中展示了3张表返回的数据结果集，每个数据结果集已经根据分数排序完毕，但是3个数据结果集之间是无序的。  将3个数据结果集的当前游标指向的数据值进行排序，并放入优先级队列，t_score_0的第一个数据值最大，t_score_2的第一个数据值次之，t_score_1的第一个数据值最小，因此优先级队列根据t_score_0，t_score_2和t_score_1的方式排序队列

 

下图则展现了进行next调用的时候，排序归并是如何进行的。 通过图中我们可以看到，当进行第一次next调用时，排在队列首位的t_score_0将会被弹出队列，并且将当前游标指向的数据值（也就是100）返回至查询客户端， 并且将游标下移一位之后，重新放入优先级队列。 而优先级队列也会根据t_score_0的当前数据结果集指向游标的数据值（这里是90）进行排序，根据当前数值，t_score_0排列在队列的最后一位。 之前队列中排名第二的t_score_2的数据结果集则自动排在了队列首位。

在进行第二次next时，只需要将目前排列在队列首位的t_score_2弹出队列，并且将其数据结果集游标指向的值返回至客户端，并下移游标，继续加入队列排队，以此类推。  当一个结果集中已经没有数据了，则无需再次加入队列 

可以看到，对于每个数据结果集中的数据有序，而多数据结果集整体无序的情况下，Sharding-JDBC无需将所有的数据都加载至内存即可排序。  它使用的是流式归并的方式，每次next仅获取唯一正确的一条数据，极大的节省了内存的消耗。

**装饰者归并**是对所有的结果集归并进行统一的功能增强，比如归并时需要聚合SUM前，在进行聚合计算前，都会通 过内存归并或流式归并查询出结果集。因此，聚合归并是在之前介绍的归并类型之上追加的归并能力，即装饰者模式

















