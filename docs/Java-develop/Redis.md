---
title: Redis 内存数据库
date: 2023/04/26
---

# redis  内存数据库

参考: https://blog.csdn.net/guorui_java/article/details/129292178

## 查看默认安装目录

源码包安装的软件。一般都在usr/local/bin下。redis采用源码包安装，进入usr/local/bin下

* redis-benchmark:性能测试工具，可以在自己本子运行，看看自己本子性能如何，服务启动起来后执行

* redis-check-aof：修复有问题的AOF文件，rdb和aof后面讲

* redis-check-dump：修复有问题的dump.rdb文件

* redis-cli：客户端，操作入口

* redis-sentinel：redis哨兵启动脚本

* redis-server：Redis服务器启动命令

## redis -- 安装配置方法

### redis -- 安装

1.解压  --  redis-5.0.4.tar.gz

* tar  -zxvf  redis-5.0.4.tar.gz  

2.编译  进入解压包

* yum  -y   install   gcc-c++
* 注意：有可能第一次没装成功，那么就需要清一下缓存
* make  distclean 清缓存

3.检查，通过

* make &&  make install

> * 编译
>
> ~~~
> make
> 在源码包的根目录下执行make命令即可
> ~~~
>
> * 安装
>
> ~~~
> make installls
> 在源码包的根目录下执行make install命令即可
> ~~~

### redis 配置

将redis安装包下的redis.conf配置文件复制一份到/usr/local/bin目录下

~~~
[root@localhost redis-5.0.4]# cp redis.conf /usr/local/bin/
~~~

修改配置文件

~~~
daemonize yes

bind 192.168.174.128
~~~

> daemonize是用来指定redis是否要用守护线程的方式启动，当我们采用**yes**时，redis会在后台运行(说白了就是后台启动)，此时redis将一直运行，除非手动kill该进程，而采用**no**时，当前界面将进入redis的命令行界面，exit强制退出或者关闭连接工具(putty,xshell等)都会导致redis进程退出

启动redis服务器

~~~
 cd /usr/local/bin
 ./redis-server redis.conf
~~~

**启动redis客户端**

~~~
redis-cli -h 192.168.174.128 -p 6379
~~~

> 如果是redis服务器就在本机，那么ip地址就可以省略，如果不是本机就要带上redis服务器的ip地址，而且redis服务器的配置文件添加 bind 0.0.0.0 或者是bind 远程服务器的ip，如bind 192.168.128.128

# redis 常用指令

## redis 服务器关闭

进入redis客户端后，执行shutdown

~~~
127.0.0.1:6379> shutdown   #关闭redis服务器
127.0.0.1:6379> exit       #退出客户端
~~~

杀掉redis服务器进程

~~~
[root@localhost bin]# ps -ef|grep redis
[root@localhost bin]# kill -9 进程id
~~~

## Redis 数据库

redis默认16个数据库，类似数组下表从零开始，默认数据库为0，可以使用SELECT命令在连接上指定数据库id

~~~
127.0.0.1:6379> select 0   #选择某个数据库
~~~

查看当前数据库中key-value键值对的数量

~~~
127.0.0.1:6379>dbsize
~~~

查看当前数据库的key的数量

~~~
127.0.0.1:6379>dbsize
~~~

清空当前数据库的所有k-v

~~~
127.0.0.1:6379>flushdb
~~~

清空所有数据库的k-v

~~~
127.0.0.1:6379>flushall
~~~



## redis单线程模型

> redis是单线程来处理网络请求的，这里的单线程，只是在处理我们的网络请求的时候只有一个线程来处理，即一个线程处理所有网络请求，一个正式的Redis Server运行的时候肯定是不止一个线程的，例如Redis进行持久化的时候会以子进程或者子线程的方式执行
>
> 1、单线程模型流程
>
> Redis客户端对服务端的每次调用都经历了发送命令，执行命令，返回结果三个过程。其中执行命令阶段，由于Redis是单线程来处理命令的，所有每一条到达服务端的命令不会立刻执行，所有的命令都会进入一个队列中，然后逐个被执行。并且多个客户端发送的命令的执行顺序是不确定的。但是可以确定的是不会有两条命令被同时执行，不会产生并发问题，这就是Redis的单线程基本模型
>
> 2、单线程模型好处
>
> 采用单线程,避免了不必要的上下文切换和竞争条件，redis采用非阻塞IO - IO多路复用， epoll做为I/O多路复用技术的实现，这里“多路”指的是和多个网络客户端连接，“复用”指的是复用同一个线程。采用多路 I/O 复用技术可以让单个线程高效的处理多个连接请求（尽量减少网络 IO 的时间消耗）

# Redis数据类型指令

> **Redis的五大数据类型：**
>
> **Redis字符串（String） 、Redis列表（List）、Redis集合（Set）、Redis哈希（Hash）、Redis有序集合Zset（sorted set）**



## string（字符串）

String（字符串）string是redis最基本的类型，你可以理解成与Memcached一模一样的类型，一个key对应一个value。string类型是二进制安全的。意思是redis的string可以包含任何数据。比如jpg图片或者序列化的对象 。string类型是Redis最基本的数据类型，一个redis中字符串value最多可以是512M

#### set key value

语法： set key value [EX seconds] [PX milliseconds] [NX|XX]
将字符串值 value 关联到 key
如果 key 已经持有其他值， set就覆写旧值，无视类型。
对于某个原本带有生存时间（TTL）的键来说， 当 set命令成功在这个键上执行时， 这个键原有的 TTL 将被清除

可选参数
从 Redis 2.6.12 版本开始， set 命令的行为可以通过一系列参数来修改：

* EX second：设置键的过期时间为 second 秒。 SET key value EX second 效果等同于 SETEX key second value。
* PX millisecond：设置键的过期时间为 millisecond毫秒。 SET key value PX millisecond 效果等同于 PSETEX key millisecond value
* NX ：只在键不存在时，才对键进行设置操作。 SET key value NX 效果等同于 SETNX key value 
* XX ：只在键已经存在时，才对键进行设置操作

~~~
redis 127.0.0.1:6379> SET key "value"
redis 127.0.0.1:6379> SET key-with-expire-time "hello" EX 10
redis 127.0.0.1:6379> SET key-with-pexpire-time "moto" PX 2000
redis 127.0.0.1:6379> SET not-exists-key "value" NX    #键不存在时，设置成功
redis 127.0.0.1:6379> SET exists-key "value" XX        #键存在时，设置成功
redis 127.0.0.1:6379> SET key-with-expire-and-NX "hello" EX 10 NX
~~~

#### get key

返回 key 所关联的字符串值
如果 key 不存在那么返回特殊值 nil 
假如 key 储存的值不是字符串类型，返回一个错误，因为 GET 只能用于处理字符串值。

~~~
redis> GET db
~~~

#### del key

删除某个key

~~~
redis> del username
~~~

#### append key value

如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。
如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样

~~~
redis> EXISTS myphone               # myphone 不存在
(integer) 0
redis> APPEND myphone "nokia" 
redis> APPEND myphone " - 1110"
redis> GET myphone
"nokia - 1110"
~~~

#### strlen key

返回 key 所储存的字符串值的长度。
当 key 储存的不是字符串值时，返回一个错误。

返回值：
字符串值的长度。
当 key 不存在时，返回 0

~~~
127.0.0.1:6379[1]> strlen username
~~~

#### INCR key

将 key 中储存的数字值增一。
如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作。
如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误

返回值：执行 INCR 命令之后 key 的值。

~~~
127.0.0.1:6379[1]> set k1 2
127.0.0.1:6379[1]> incr k1
127.0.0.1:6379[1]> decr k1   #将 key 中储存的数字值减一
~~~

#### INCRBY key 	

将 key 所储存的值加上增量 increment 。
如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCRBY 命令。
如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。本操作的值限制在 64 位(bit)有符号数字表示之内。

返回值：加上 increment 之后， key 的值

~~~
127.0.0.1:6379[1]> incrby k1 3
127.0.0.1:6379[1]> decrby k1 2    #将 key 所储存的值减量 increment 
~~~

#### GETRANGE key start end

返回 key 中字符串值的子字符串，字符串的截取范围由 start 和 end 两个偏移量决定(包括 start 和 end 在内)。
负数偏移量表示从字符串最后开始计数， -1 表示最后一个字符， -2 表示倒数第二个，以此类推。
GETRANGE 通过保证子字符串的值域(range)不超过实际字符串的值域来处理超出范围的值域请求。

返回值：
截取得出的子字符串。

~~~
127.0.0.1:6379[1]> set username zhangsanfeng
127.0.0.1:6379[1]> getrange username 0 -1
~~~

#### SETRANGE key offset value

用 value 参数覆写(overwrite)给定 key 所储存的字符串值，从偏移量 offset 开始。不存在的 key 当作空白字符串处理

返回值：
被 SETRANGE 修改之后，字符串的长度

~~~
127.0.0.1:6379> set name zhangsanfeng
127.0.0.1:6379> SETRANGE name 4 xxx
127.0.0.1:6379> get name
"zhanxxxnfeng"
~~~

#### SETEX key seconds value

将值 value 关联到 key ，并将 key 的生存时间设为 seconds (以秒为单位)。
如果 key 已经存在， SETEX 命令将覆写旧值。

这个命令类似于以下两个命令：

~~~
SET key value
EXPIRE key seconds  # 设置生存时间
~~~

返回值：
设置成功时返回 OK 。
当 seconds 参数不合法时，返回一个错误。

~~~
redis> SETEX cache_user_id 60 10086   #设置60秒
OK
redis> GET cache_user_id  # 值
"10086"
redis> TTL cache_user_id  # 剩余生存时间
(integer) 49
~~~

#### SETNX key value

将 key 的值设为 value ，当且仅当 key 不存在。
若给定的 key 已经存在，则 SETNX 不做任何动作。

SETNX 是『SET if Not exists』(如果不存在，则 SET)的简写。
返回值：
设置成功，返回 1 。
设置失败，返回 0 。

~~~
redis> EXISTS job                # job 不存在
(integer) 0

redis> SETNX job "programmer"    # job 设置成功
(integer) 1
redis> GET job 
~~~

#### MSET key value [key value ...]

同时设置一个或多个 key-value 对。 (m:more)
如果某个给定 key 已经存在，那么 MSET 会用新值覆盖原来的旧值，如果这不是你所希望的效果，请考虑使用 MSETNX 命令：它只会在所有给定 key 都不存在的情况下进行设置操作。

~~~
127.0.0.1:6379[1]> mset k1 v1 k2 v2 k3 v3
127.0.0.1:6379[1]> mget k1 k2 k3
~~~

#### MGET key [key ...]

返回所有(一个或多个)给定 key 的值。
如果给定的 key 里面，有某个 key 不存在，那么这个 key 返回特殊值 nil 。因此，该命令永不失败

返回值：
一个包含所有给定 key 的值的列表

~~~
redis> SET redis redis.com
redis> SET mongodb mongodb.org
redis> MGET redis mongodb mysql
~~~

#### MSETNX key value [key value ...]

同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。
即使只有一个给定 key 已存在， MSETNX 也会拒绝执行所有给定 key 的设置操作。
MSETNX 是原子性的，因此它可以用作设置多个不同 key 表示不同字段(field)的唯一性逻辑对象(unique logic object)，所有字段要么全被设置，要么全不被设置

返回值：
当所有 key 都成功设置，返回 1 。
如果所有给定 key 都设置失败(至少有一个 key 已经存在)，那么返回 0 。

~~~
# 对不存在的 key 进行 MSETNX
redis> MSETNX rmdbs "MySQL" nosql "MongoDB" key-value-store "redis"
(integer) 1
redis> MGET rmdbs nosql key-value-store
1) "MySQL"
2) "MongoDB"
3) "redis"

# MSET 的给定 key 当中有已存在的 key
redis> MSETNX rmdbs "Sqlite" language "python"  # rmdbs 键已经存在，操作失败
(integer) 0
redis> EXISTS language                          # 因为 MSET 是原子性操作，language 没有被设置
(integer) 0
redis> GET rmdbs                                # rmdbs 也没有被修改
"MySQL"
~~~



## Hash（哈希）

Hash（哈希）Redis hash 是一个键值对集合。Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。类似Java里面的Map<String,Object>，在hash类型中，也是一个键值对，key不变  v又是一个键值对

#### HSET key field value

将哈希表 key 中的域 field 的值设为 value 。
如果 key 不存在，一个新的哈希表被创建并进行 HSET 操作。如果域 field 已经存在于哈希表中，旧值将被覆盖

返回值：
如果 field 是哈希表中的一个新建域，并且值设置成功，返回 1 。
如果哈希表中域 field 已经存在且旧值已被新值覆盖，返回 0 。

~~~
127.0.0.1:6379> hset user id 1     user是key   value 是 id 1    value是一个键值对
127.0.0.1:6379> hget user id  
~~~

sinter求交集：sinter  key1 key2 key3 .....

sunion求并集  sunion   key1 key2 key3 .....

sdiff 求差     sdiff  key1  key2  .....

#### HGET key field

返回哈希表 key 中给定域 field 的值

返回值：
给定域的值，当给定域不存在或是给定 key 不存在时，返回 nil 

~~~
127.0.0.1:6379> hget user id  
~~~

#### HMSET key field value [field value ...]

同时将多个 field-value (域-值)对设置到哈希表 key 中。
此命令会覆盖哈希表中已存在的域。如果 key 不存在，一个空哈希表被创建并执行 HMSET 操作

返回值：
如果命令执行成功，返回 OK 。
当 key 不是哈希表(hash)类型时，返回一个错误

~~~
127.0.0.1:6379> hmset user id 1 name zhangsan
OK
127.0.0.1:6379> HMGET user id name
1) "1"
2) "zhangsan"
~~~

#### HMGET key field [field ...]

HMGET key field [field ...]
返回哈希表 key 中，一个或多个给定域的值。

如果给定的域不存在于哈希表，那么返回一个 nil 值。因为不存在的 key 被当作一个空哈希表来处理，所以对一个不存在的 key 进行 HMGET 操作将返回一个只带有 nil 值的表。

返回值：
一个包含多个给定域的关联值的表，表值的排列顺序和给定域参数的请求顺序一样

~~~~
127.0.0.1:6379> hmset user id 1 name zhangsan
127.0.0.1:6379> HMGET user id name
~~~~

#### HGETALL key

返回哈希表 key 中，所有的域和值。
在返回值里，紧跟每个域名(field name)之后是域的值(value)，所以返回值的长度是哈希表大小的两倍。

返回值：
以列表形式返回哈希表的域和域的值。若 key 不存在，返回空列表

~~~
127.0.0.1:6379> HGETALL user
~~~

#### HDEL key field [field ...]

删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略

返回值:
被成功移除的域的数量，不包括被忽略的域

~~~
127.0.0.1:6379> HDEL user id name
~~~

#### HLEN key

返回哈希表 key 中域的数量

返回值：
哈希表中域的数量。当 key 不存在时，返回 0 

~~~
127.0.0.1:6379> HLEN user
~~~

#### HEXISTS key field

查看哈希表 key 中，给定域 field 是否存在

返回值：
如果哈希表含有给定域，返回 1 。
如果哈希表不含有给定域，或 key 不存在，返回 0

~~~
127.0.0.1:6379> HEXISTS user name        判断key是user 的值中 是否含有name的键
~~~

#### HKEYS key

返回哈希表 key 中的所有域。

返回值：
一个包含哈希表中所有域的表。
当 key 不存在时，返回一个空表

~~~
127.0.0.1:6379> HKEYS user
~~~

#### HVALS key

返回哈希表 key 中所有域的值。

返回值：
一个包含哈希表中所有值的表。当 key 不存在时，返回一个空表

~~~
127.0.0.1:6379> HVALS user
~~~

#### HINCRBY key field increment

为哈希表 key 中的域 field 的值加上增量 increment,增量也可以为负数，相当于对给定域进行减法操作

如果 key 不存在，一个新的哈希表被创建并执行 HINCRBY 命令。
如果域 field 不存在，那么在执行命令前，域的值被初始化为 0 

返回值：
执行 HINCRBY 命令之后，哈希表 key 中域 field 的值

~~~
127.0.0.1:6379> HSET user age 2
(integer) 1
127.0.0.1:6379> HINCRBY user age 5
~~~

#### HINCRBYFLOAT key field increment

为哈希表 key 中的域 field 加上浮点数增量 increment

如果哈希表中没有域 field ，那么 HINCRBYFLOAT 会先将域 field 的值设为 0 ，然后再执行加法操作。如果键 key 不存在，那么 HINCRBYFLOAT 会先创建一个哈希表，再创建域 field ，最后再执行加法操作

当以下任意一个条件发生时，返回一个错误：
域 field 的值不是字符串类型(因为 redis 中的数字和浮点数都以字符串的形式保存，所以它们都属于字符串类型）
域 field 当前的值或给定的增量 increment 不能解释(parse)为双精度浮点数(double precision floating point number)

返回值：
执行加法操作之后 field 域的值

~~~
127.0.0.1:6379> HINCRBYFLOAT user age 0.5
~~~



## list（列表）

List（列表）Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素导列表的头部（左边）或者尾部（右边）。它的底层实际是个链表

#### LPUSH key value [value ...]

将一个或多个值 value 插入到列表 key 的表头

如果有多个 value 值，那么各个 value 值按从左到右的顺序依次插入到表头： 比如说，对空列表 mylist 执行命令 LPUSH mylist a b c ，列表的值将是 c b a ，这等同于原子性地执行 LPUSH mylist a 、 LPUSH mylist b 和 LPUSH mylist c 三个命令。
如果 key 不存在，一个空列表会被创建并执行 LPUSH 操作

返回值：
执行 LPUSH 命令后，列表的长度

~~~
127.0.0.1:6379> lpush list01 0 1 2 3 4 5
127.0.0.1:6379> LRANGE list01 0 -1
~~~

#### RPUSH key value [value ...]

将一个或多个值 value 插入到列表 key 的表尾(最右边)。

如果有多个 value 值，那么各个 value 值按从左到右的顺序依次插入到表尾：比如对一个空列表 mylist 执行 RPUSH mylist a b c ，得出的结果列表为 a b c ，等同于执行命令 RPUSH mylist a 、 RPUSH mylist b 、 RPUSH mylist c 。
如果 key 不存在，一个空列表会被创建并执行 RPUSH 操作。当 key 存在但不是列表类型时，返回一个错误。

返回值：
执行 RPUSH 操作后，表的长度。

~~~
127.0.0.1:6379> rpush list01 0 1 2 3 4 5
127.0.0.1:6379> LRANGE list01 0 -1
~~~



#### LRANGE key start stop

返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定。下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推

~~~
127.0.0.1:6379> rpush list01 0 1 2 3 4 5
127.0.0.1:6379> LRANGE list01 0 -1
~~~

#### LLen key

返回列表 key 的长度。

如果 key 不存在，则 key 被解释为一个空列表，返回 0 .
如果 key 不是列表类型，返回一个错误。

返回值：
列表 key 的长度。

~~~
redis> LPUSH job "cook food"
(integer) 1

redis> LPUSH job "have lunch"
(integer) 2

redis> LLEN job
(integer) 2
~~~

#### LPOP key

移除并返回列表 key 的头元素。

返回值：
列表的头元素。
当 key 不存在时，返回 nil 。

~~~
127.0.0.1:6379> lpush list01 0 1 2 3 4 5
127.0.0.1:6379> LPOP list01
"5"
~~~

#### RPOP key

移除并返回列表 key 的尾元素

返回值：
列表的尾元素。
当 key 不存在时，返回 nil 

~~~
127.0.0.1:6379> rpush list02 0 1 2 3 4 5
(integer) 6
127.0.0.1:6379> RPOP list02
"5"
~~~

#### LINDEX key index

返回列表 key 中，下标为 index 的元素

下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。如果 key 不是列表类型，返回一个错误

返回值:
列表中下标为 index 的元素。
如果 index 参数的值不在列表的区间范围内(out of range)，返回 nil 

~~~
127.0.0.1:6379> lindex list01  3   #返回集合里面的第四个元素
~~~

#### LREM key count value

根据参数 count 的值，移除列表中与参数 value 相等的元素。

count 的值可以是以下几种：

count > 0 : 从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count 。
count < 0 : 从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值。
count = 0 : 移除表中所有与 value 相等的值

返回值：
被移除元素的数量。
因为不存在的 key 被视作空表(empty list)，所以当 key 不存在时， LREM 命令总是返回 0

~~~
127.0.0.1:6379> lpush list01 0 1 2 3 3 3 3
127.0.0.1:6379> lrem  list01 2 3    #删除集合里面2个3
~~~

#### LTRIM key start stop

对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。举个例子，执行命令 LTRIM list 0 2 ，表示只保留列表 list 的前三个元素，其余元素全部删除。下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。

你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。当 key 不是列表类型时，返回一个错误。LTRIM 命令通常和 LPUSH 命令或 RPUSH 命令配合使用

~~~
redis> LRANGE alpha 0 -1       # alpha 是一个包含 5 个字符串的列表
1) "h"
2) "e"
3) "l"
4) "l"
5) "o"

redis> LTRIM alpha 1 -1        # 删除 alpha 列表索引为 0 的元素
OK
redis> LRANGE alpha 0 -1       # "h" 被删除了
1) "e"
2) "l"
3) "l"
4) "o"
~~~

#### RPOPLPUSH source destination

将列表 source 中的最后一个元素(尾元素)弹出，并返回给客户端。将 source 弹出的元素插入到列表 destination ，作为 destination 列表的的头元素。

返回值
被弹出的元素

~~~
127.0.0.1:6379> lrange list02 0 -1
1) "6"
2) "5"
3) "4"
127.0.0.1:6379> LRANGE list01 0 -1
(empty list or set)
127.0.0.1:6379> RPOPLPUSH list02 list01
"4"
~~~

#### LSET key index value

将列表 key 下标为 index 的元素的值设置为 value 。  下标是从0开始的
当 index 参数超出范围，或对一个空列表( key 不存在)进行 LSET 时，返回一个错误

返回值：
操作成功返回 ok ，否则返回错误信息。

~~~
127.0.0.1:6379> LRANGE list02 0 -1
1) "6"
2) "5"
127.0.0.1:6379> LSET list02 1 x     #下标1的元素是5  用x 替换
127.0.0.1:6379> LRANGE list02 0 -1
1) "6"
2) "x"
~~~

#### LINSERT key BEFORE|AFTER pivot value

将值 value 插入到列表 key 当中，位于值 pivot 之前或之后。当 pivot 不存在于列表 key 时，不执行任何操作。当 key 不存在时， key 被视为空列表，不执行任何操作。如果 key 不是列表类型，返回一个错误。

返回值:
如果命令执行成功，返回插入操作完成之后，列表的长度。
如果没有找到 pivot ，返回 -1 。
如果 key 不存在或为空列表，返回 0 。

~~~
127.0.0.1:6379> LPUSH list01 1 2 3 4 5
127.0.0.1:6379> LINSERT list01 before 2 xxx  #在元素2的前面插入xxx
~~~

## Set（集合）

Set（集合）Redis的Set是string类型的无序集合。它是通过HashTable实现实现的

#### 6.4.1 SADD key member [member ...]

将一个或多个 member 元素加入到集合 key 当中，已经存在于集合的 member 元素将被忽略。假如 key 不存在，则创建一个只包含 member 元素作成员的集合。当 key 不是集合类型时，返回一个错误。

返回值:
被添加到集合中的新元素的数量，不包括被忽略的元素

~~~
127.0.0.1:6379> SADD set01 1 1 2 2 3 4
127.0.0.1:6379> SMEMBERS set01  
1 2 3 4
~~~

#### 6.4.1 SMEMBERS key

返回集合 key 中的所有成员。不存在的 key 被视为空集合。
返回值:
集合中的所有成员

~~~
127.0.0.1:6379> SMEMBERS set01 
~~~

#### 6.4.2 SISMEMBER key member

判断 member 元素是否集合 key 的成员

返回值:
如果 member 元素是集合的成员，返回 1 。
如果 member 元素不是集合的成员，或 key 不存在，返回 0 。

~~~
127.0.0.1:6379> sismember set01 2   # 判断集合里面是否有某个元素  
~~~

#### 6.4.3 SRANDMEMBER key [count]

如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素。从 Redis 2.6 版本开始， SRANDMEMBER 命令接受可选的 count 参数

如果 count 为正数，且小于集合基数，那么命令返回一个包含 count 个元素的数组，数组中的元素各不相同。如果 count 大于等于集合基数，那么返回整个集合。
如果 count 为负数，那么命令返回一个数组，数组中的元素可能会重复出现多次，而数组的长度为 count 的绝对值。

返回值:
只提供 key 参数时，返回一个元素；如果集合为空，返回 nil 。
如果提供了 count 参数，那么返回一个数组；如果集合为空，返回空数组

~~~
127.0.0.1:6379> SADD set02  1 2 3 4 5 6 7 8 9 
(integer) 9
127.0.0.1:6379> SRANDMEMBER set02 3
1) "7"
2) "3"
3) "2"
~~~

#### 6.4.4 SPOP key

移除并返回集合中的一个随机元素。如果只想获取一个随机元素，但不想该元素从集合中被移除的话，可以使用 SRANDMEMBER 命令。

返回值:
被移除的随机元素。
当 key 不存在或 key 是空集时，返回 nil 。

~~~
127.0.0.1:6379> SPOP set02   #随机删除集合中的一个元素
~~~

#### 6.4.5 SCARD key

返回集合 key 的基数(集合中元素的数量)

返回值：
集合的基数。
当 key 不存在时，返回 0 

~~~
redis> SADD set01 pc printer phone
(integer) 3
redis> SCARD set01   # 非空集合
(integer) 3
redis> DEL set01
(integer) 1
redis> SCARD set01   # 空集合
(integer) 0
~~~

#### 6.4.6 SMOVE source destination member

将 member 元素从 source 集合移动到 destination 集合。SMOVE 是原子性操作。

如果 source 集合不存在或不包含指定的 member 元素，则 SMOVE 命令不执行任何操作，仅返回 0 。否则， member 元素从 source 集合中被移除，并添加到 destination 集合中去。当 destination 集合已经包含 member 元素时， SMOVE 命令只是简单地将 source 集合中的 member 元素删除。当 source 或 destination 不是集合类型时，返回一个错误。

返回值:
如果 member 元素被成功移除，返回 1 。
如果 member 元素不是 source 集合的成员，并且没有任何操作对 destination 集合执行，那么返回 0 

~~~
redis> SMOVE set02 set01 9  把集合set02中的元素9移动到set01集合中
~~~

#### 6.4.7 SREM key member [member ...]

移除集合 key 中的一个或多个 member 元素，不存在的 member 元素会被忽略。
当 key 不是集合类型，返回一个错误。

返回值:
被成功移除的元素的数量，不包括被忽略的元素

~~~
127.0.0.1:6379> sadd set01 "c" "lisp" "python" "ruby"
(integer) 4
127.0.0.1:6379>  SREM set01 ruby
(integer) 1
127.0.0.1:6379> SMEMBERS set01
1) "c"
2) "python"
3) "lisp"
~~~

## zset(有序集合)

zset(sorted set：有序集合) Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。zset的成员是唯一的,但分数(score)却可以重复。

#### ZADD key score member [ [score member] ...]

将一个或多个 member 元素及其 score 值加入到有序集 key 当中。
如果某个 member 已经是有序集的成员，那么更新这个 member 的 score 值，并通过重新插入这个 member 元素，来保证该 membe在正确的位置上。score 值可以是整数值或双精度浮点数。

如果 key 不存在，则创建一个空的有序集并执行 ZADD 操作。当 key 存在但不是有序集类型时，返回一个错误。

返回值:
被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员

~~~
127.0.0.1:6379> ZADD set03 60 v1 70 v2 80 v3
~~~

#### ZCARD key

返回有序集 key 的基数

~~~
127.0.0.1:6379> ZCARD set03
(integer) 3
~~~

#### ZRANGE key start stop [WITHSCORES]

返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递增(从小到大)来排序。具有相同 score 值的成员按字典序(lexicographical order )来排列。如果你需要成员按 score 值递减(从大到小)来排列，请使用 ZREVRANGE 命令

下标参数 start 和 stop 都以 0 为底，也就是说，以 0 表示有序集第一个成员，以 1 表示有序集第二个成员，以此类推。你也可以使用负数下标，以 -1 表示最后一个成员， -2 表示倒数第二个成员，以此类推

返回值:
指定区间内，带有 score 值(可选)的有序集成员的列表

~~~
127.0.0.1:6379> ZRANGE set03 0 -1 
1) "v1"
2) "v2"
3) "v3"
127.0.0.1:6379> ZRANGE set03 0 -1  withscores
1) "v1"
2) "60"
3) "v2"
4) "70"
5) "v3"
6) "80"
~~~

#### 6.5.4 ZREM key member [member ...]

移除有序集 key 中的一个或多个成员，不存在的成员将被忽略。当 key 存在但不是有序集类型时，返回一个错误。
返回值:
被成功移除的成员的数量，不包括被忽略的成员。

~~~
127.0.0.1:6379> ZREM set03 v3
(integer) 1
127.0.0.1:6379> ZRANGE set03 0 -1  withscores
1) "v1"
2) "60"
3) "v2"
4) "70"
~~~

#### ZSCORE key member


返回有序集 key 中，成员 member 的 score 值。如果 member 元素不是有序集 key 的成员，或 key 不存在，返回 nil 。

返回值:
member 成员的 score 值，以字符串形式表示

~~~
127.0.0.1:6379> ZSCORE set03 v2
"70"
~~~

#### ZCOUNT key min max

返回有序集 key 中， score 值在 min 和 max 之间(默认包括 score 值等于 min 或 max )的成员的数量

返回值:
score 值在 min 和 max 之间的成员的数量。

~~~
127.0.0.1:6379> ZCOUNT set03 60 70
(integer) 2
~~~

#### ZREVRANGE key start stop [WITHSCORES]

返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递减(从大到小)来排列。具有相同 score 值的成员按字典序的逆序(reverse lexicographical order)排列。除了成员按 score 值递减的次序排列这一点外， ZREVRANGE 命令的其他方面和 ZRANGE 命令一样。

返回值:
指定区间内，带有 score 值(可选)的有序集成员的列表。

~~~
127.0.0.1:6379> ZREVRANGE set03 0 -1
1) "v2"
2) "v1"
~~~

#### ZREVRANGEBYSCORE key max min [WITHSCORES]

返回有序集 key 中， score 值介于 max 和 min 之间(默认包括等于 max 或 min )的所有的成员。有序集成员按 score 值递减(从大到小)的次序排列。

返回值:
指定区间内，带有 score值(可选)的有序集成员的列表

~~~
redis > ZADD salary 10086 jack
(integer) 1
redis > ZADD salary 5000 tom
(integer) 1
redis > ZADD salary 7500 peter
(integer) 1
redis > ZADD salary 3500 joe
(integer) 1
redis > ZREVRANGEBYSCORE salary 10000 2000  # 逆序排列薪水介于 10000 和 2000 之间的成员
1) "peter"
2) "tom"
3) "joe"
~~~

# redis配置文件-参数

### 7.1 常规 ###

~~~
daemonize no
~~~

Redis默认是不作为守护进程来运行的。你可以把这个设置为"yes"让它作为守护进程来运行。默认是no
注意，当作为守护进程的时候，Redis会把进程ID写到 /var/run/redis.pid

~~~
pidfile /var/run/redis.pid
~~~

当以守护进程方式运行的时候，Redis会把进程ID默认写到 /var/run/redis.pid。你可以在这里修改路径。

~~~
port 6379
~~~

接受连接的特定端口，默认是6379。 如果端口设置为0，Redis就不会监听TCP套接字。

~~~
bind 127.0.0.1
~~~

如果你想的话，你可以绑定某个具体服务器的ip，如：bind 192.168.128.128，此时远程客户端连接 redis-cli -h 192.168.128.128 -p 6379，当然也可以设置成 bind 0.0.0.0

~~~
timeout 0
~~~

一个客户端空闲多少秒后关闭连接。(0代表禁用，永不关闭)，默认为0

~~~
loglevel verbose
~~~

设置服务器调试等级。
其它值如下：

> debug （很多信息，对开发/测试有用）
>
> verbose （很多精简的有用信息，但是不像debug等级那么多）
>
> notice （适量的信息，基本上是你生产环境中需要的程度）
>
> warning （只有很重要/严重的信息会记录下来）

~~~
logfile stdout
~~~

指明日志文件名。也可以使用"stdout"来强制让Redis把日志信息写到标准输出上。 注意：如果Redis以守护进程方式运行，而你设置日志显示到标准输出的话，那么日志会发送到 /dev/null

~~~
syslog-enabled no
~~~

要使用系统日志记录器很简单，只要设置 "syslog-enabled" 为 "yes" 就可以了。默认为no

 ~~~
databases 16
 ~~~

设置数据库个数。默认数据库是 DB 0，你可以通过SELECT dbid  WHERE dbid（0～'databases' - 1）来为每个连接使用不同的数据库

###  7.2 快照 ###

~~~
save 900 1     # 900秒（15分钟）之后，且至少1次变更
save 300 10    #300秒（5分钟）之后，且至少10次变更
save 60 10000  #60秒之后，且至少10000次变更
~~~

把数据库存到磁盘上， 会在指定秒数和数据变化次数之后把数据库写到磁盘上，你要想不写磁盘的话就把所有 "save" 设置注释掉就行了注意：当设置redis持久化后，符合save规则后立马生成dump.rdb文件，dump.rdb文件不是一开始就生成的

~~~
rdbcompression yes
~~~

导出到dump .rdb 数据库时是否用LZF压缩字符串对象，默认设置为 "yes"，所以几乎总是生效的，如果希望RDB进程节省一点CPU时间，设置为no，但是可能最后的dump.rdb文件会很大

~~~
dbfilename dump.rdb
~~~

rdb持久化的数据库文件名，默认是 dump.rdb

~~~
dir ./      
~~~

工作目录，数据库会写到这个目录下，文件名就是上面的 "dbfilename" 的值， 累加文件也放这里，注意你这里指定的必须是目录，不是文件名，默认是当前目录

### 7.3 同步 ###

~~~ 
slaveof <masterip> <masterport>  redis3.2以上   replicaof <masterip> <masterport>
~~~

主从同步。通过 slaveof 配置来实现Redis实例的备份。
注意，这里是本地从远端复制数据。也就是说，本地可以有不同的数据库文件、绑定不同的IP、监听不同的端口。

~~~
masterauth <master-password>     #默认为空
~~~

如果master设置了密码（通过下面的 "requirepass" 选项来配置），那么slave在开始同步之前必须进行身份验证，否则它的同步请求会被拒绝

~~~
replica-serve-stale-data yes    #默认为yes
~~~

当一个slave去和master的连接，或者同步正在进行中，slave的行为有两种可能

1) 如果 replica-serve-stale-data 设置为 "yes" (默认值)，slave会继续响应客户端请求，可能是正常数据，也可能是还没获得值的空数
2) 如果 replica-serve-stale-data 设置为 "no"，slave会回复"正在从master同步（SYNC with master in progress）"来处理客户端请求，

~~~
replica-read-only yes
~~~

从机是否只能读，不能有写指令，默认值为yes

~~~
repl-ping-replica-period 10
~~~

slave根据指定的时间间隔向服务器发送ping请求，时间间隔可以通过 repl_ping_slave_period 来设置，默认10秒来定义心跳（PING）间隔

~~~
repl-timeout 60
~~~

这个参数一定不能小于repl-ping-replica-period，可以考虑为repl-ping-replica-period的3倍或更大。定义多长时间内均PING不通时，判定心跳超时。对于redis集群，达到这个值并不会发生主从切换,主从何时切换由参数cluster-node-timeout控制，只有master状态为fail后，它的slaves才能发起选举，默认60秒

### 7.4 安全 ###

~~~
requirepass foobared
~~~

要求客户端在处理任何命令时都要验证身份和密码， 这在你信不过来访者时很有用，为了向后兼容的话，这段应该注释掉。而且大多数人不需要身份验证（例如：它们运行在自己的服务器上。）

警告：因为Redis太快了，所以居心不良的人可以每秒尝试150k的密码来试图破解密码。这意味着你需要一个高强度的密码，否则破解太容易了，可以把这个注释去掉

客户端在登陆redis时，是需要密码进行验证的

~~~
127.0.0.1:6379> ping
(error) NOAUTH Authentication required.
127.0.0.1:6379> AUTH foobared
OK
127.0.0.1:6379> ping
PONG
//通过命令来设置密码
127.0.0.1:6379> CONFIG GET requirepass
1) "requirepass"
2) "foobared"
127.0.0.1:6379> CONFIG set requirepass 1234
OK
~~~

~~~
rename-command CONFIG ""
~~~

命令重命名，在共享环境下，可以为危险命令改变名字。比如，你可以为 CONFIG 改个其他不太容易猜到的名字，这样你自己仍然可以使用，而别人却没法做坏事了，例如：rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

### 7.5 限制 ###

~~~
maxclients 128
~~~

设置最多同时连接客户端数量，默认没有限制，这个关系到Redis进程能够打开的文件描述符数量，特殊值"0"表示没有限制，一旦达到这个限制，Redis会关闭所有新连接并发送错误"达到最大用户数上限（max number of clients reached）

~~~
maxmemory <bytes>     #如 maxmemory 100mb
~~~

用于控制redis可使用的最大内存容量。如果超过maxmemory的值，就会动用淘汰策略来处理expire字典中的键，默认为0,表示"无限制",最终由OS物理内存大小决定(如果物理内存不足,有可能会使用swap)

~~~
maxmemory-policy volatile-lru
~~~

内存策略：如果达到内存限制了，Redis如何删除key。对所有策略来说，如果Redis找不到合适的可以删除的key都会在写操作时返回一个错误，你可以在下面五个策略里面选：

* volatile-lru -> 对"过期集合"中的数据采取LRU(近期最少使用Least Recently Used)算法.如果对key使用"expire"指令指定了过期时间,那么此key将会被添加到"过期集合"中。将已经过期/LRU的数据优先移除.如果"过期集合"中全部移除仍不能满足内存需求,将OOM.
* allkeys-lru -> 对所有的数据,采用LRU算法，不管是否过期
* volatile-random -> 对"过期集合"中的数据采取"随即选取"算法,并移除选中的K-V,直到"内存足够"为止. 如果如果"过期集合"中全部移除全部移除仍不能满足,将OOM
* allkeys->random -> 对所有的数据,采取"随机选取"算法,并移除选中的K-V,直到"内存足够"为止
* volatile-ttl -> 对"过期集合"中的数据采取TTL算法(最小存活时间),移除即将过期的数据
* noeviction -> 不做任何干扰操作,直接返回OOM异常

> 经验：
>
> - 在所有的 key 都是最近最经常使用，那么就需要选择 allkeys-lru 进行置换最近最不经常使用的 key，如果你不确定使用哪种策略，那么推荐使用 allkeys-lru
> - 如果所有的 key 的访问概率都是差不多的，那么可以选用 allkeys-random 策略去置换数据
> - 如果对数据有足够的了解，能够为 key 指定 hint（通过expire/ttl指定），那么可以选择 volatile-ttl 进行置换

~~~
maxmemory-samples 10
~~~

设置样本个数，maxmemory-samples在redis-3.0.0中的默认配置为5，如果增加，会提高LRU或TTL的精准度，redis作者测试的结果是当这个配置为10时已经非常接近全量LRU的精准度了，并且增加maxmemory-samples会导致在主动清理时消耗更多的CPU时间

### 7.6 纯累加模式 ###

~~~
appendonly no    #默认值
~~~

 默认情况下，Redis是异步的把数据导出到磁盘上。这种情况下，当Redis挂掉的时候，最新的数据就丢了。 如果不希望丢掉任何一条数据的话就该用纯累加模式：一旦开启这个模式，Redis会把每次写入的数据在接收后都写入 appendonly.aof 文件，每次启动时Redis都会把这个文件的数据读入内存里。

注意，异步导出的数据库文件和纯累加文件可以并存，如果纯累加模式开启了，那么Redis会在启动时载入日志文件而忽略导出的 dump.rdb 文件

~~~
appendfilename appendonly.aof
~~~

纯累加文件名字（默认："appendonly.aof"）

~~~
appendfsync always
appendfsync everysec
appendfsync no
~~~

每隔多久调用操作系统fsync() 操作，马上把数据写到磁盘上，不要再等了，默认值为everysec，有些操作系统会真的把数据马上刷到磁盘上；有些则要磨蹭一下，但是会尽快去做，Redis支持三种不同的模式：

* no：不要立刻刷，只有在操作系统需要刷的时候再刷。比较快。
* always：每次写操作都立刻写入到aof文件。慢，但是最安全。
* everysec：每秒写一次，折衷方案，默认的 "everysec" 通常来说能在速度和数据安全性之间取得比较好的平衡。

~~~
no-appendfsync-on-rewrite no
~~~

bgrewriteaof机制，在一个子进程中进行aof的重写，从而不阻塞主进程对其余命令的处理，重写主要解决了aof文件过大问题

现在问题出现了，同时在执行bgrewriteaof操作（重写是要去操作appendonly.aof文件的）和主进程写aof文件的操作（主进程每隔疫一秒就会把写指令追加到appendonly.aof中，也是要去操作这个文件），两者都会操作磁盘，而bgrewriteaof往往会涉及大量磁盘操作，这样就会造成主进程在写aof文件的时候出现阻塞的情形，现在no-appendfsync-on-rewrite参数出场了。如果该参数设置为no，是最安全的方式，不会丢失数据，但是要忍受阻塞的问题。如果设置为yes呢，只是写入了缓冲区，因此这样并不会造成阻塞（因为没有竞争磁盘），但是如果这个时候redis挂掉，就会丢失数据。丢失多少数据呢？在linux的操作系统的默认设置下，最多会丢失30s的数据。

因此，如果应用系统无法忍受延迟，而可以容忍少量的数据丢失，则设置为yes。如果应用系统无法忍受数据丢失，则设置为no


~~~
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
~~~

当AOF文件随着写命令的运行膨胀时，当文件大小触碰到临界时，rewrite会被运行，rewrite会像replication一样，fork出一个子进程，创建一个临时文件，遍历数据库，将每个key、value对输出到临时文件。输出格式就是Redis的命令，但是为了减小文件大小，会将多个key、value键值对集合起来用一条命令表达。在rewrite期间的写操作会保存在内存的rewrite buffer中，rewrite成功后这些操作也会复制到临时文件中，在最后临时文件会代替AOF文件

auto-aof-rewrite-percentage 100：当前AOF文件大小是上次日志重写得到AOF文件大小的二倍时，自动启动新的日志重写过程
auto_aofrewrite_min_size: 当前aof文件大于多少字节后才触发。避免在aof较小的时候无谓行为。默认大小为64mb

###  7.7 慢查询日志 ###

Redis Slow Log是一个用于记录超过指定执行时间的查询的系统。执行时间不包括与客户端交谈，发送答复等I / O操作，而仅包括实际执行命令所需的时间（这是命令执行的唯一阶段，在该阶段线程被阻塞并且不能同时满足其他要求）。

通俗的讲使用这个命令可以读取或重置 Redis 慢速查询日志。**就是 redis 可以把执行时间超过我们设定值的命令记录下来，slowlog 是记录到内存中的，所以查询非常快**。这里的执行时间不包括 I/O 操作,比如与客户端,发送应答等,就是实际执行命令所需的时间

~~~
slowlog-log-slower-than 10000
~~~

slowlog-log-slower-than 设置超时时间，单位是微秒（1000000就是1秒），表示记录超过个时间的命令

请注意：负数将禁用慢速日志记录，而零值将强制记录每个命令

两种方式实现慢日志配置：

1. 可以通过配置 redis.conf 来完成。
2. 运行时，使用 CONFIG GET 和 CONFIG SET 命令配置

~~~
127.0.0.1:6379> config set slowlog-log-slower-than 0    #设置为0
OK
127.0.0.1:6379> config get slowlog-log-slower-than
1) "slowlog-log-slower-than"
2) "0"
~~~

要读取慢日志，请使用SLOWLOG GET命令

~~~
127.0.0.1:6379> set k3 v3
OK
127.0.0.1:6379> set k4 v4
OK
127.0.0.1:6379> SLOWLOG get 
1) 1) (integer) 4             //slowlog 唯一标识
   2) (integer) 1632391958    //unix 时间戳
   3) (integer) 12           //命令执行的时间，单位：微秒
   4) 1) "set"				 //执行了什么命令
      2) "k3"
      3) "v3"
...................
~~~

> slowlog get				#列出所有的慢查询日志
> slowlog get 2				#只列出2条
> slowlog len				#查看慢查询日志条数

那么问题来了，slowlog 是记录再内存中的，如果记录所有的命令 log 会不会把内存不够用呢？答案是当然不会。slowlog 记录的 命令数是有最大长度限制的，我们可以通过 slowlog-max-len 来查询 slowlog 的最大长度。最小值为零。当一个新的命令被记录下来，并且如果已经达到它的最大长度时，more是记录的命令达到128个之后，最旧的一个 log 将从队列中删除，FIFO

~~~
slowlog-max-len 128
~~~

### 7.8 包含 ###

~~~
include /path/to/local.conf
include /path/to/other.conf
~~~

包含一个或多个其他配置文件。这在你有标准配置模板但是每个redis服务器又需要个性设置的时候很有用。包含文件特性允许你引人其他配置文件，所以好好利用吧。



# redis持久化

由于 Redis 是一个内存数据库，所谓内存数据库，就是将数据库中的内容保存在内存中，这与传统的MySQL，Oracle等关系型数据库直接将内容保存到硬盘中相比，内存数据库的读写效率比传统数据库要快的多（内存的读写效率远远大于硬盘的读写效率）。但是保存在内存中也随之带来了一个缺点，一旦断电或者宕机，那么内存数据库中的数据将会全部丢失。

为了解决这个缺点，Redis提供了将内存数据持久化到硬盘，以及用持久化文件来恢复数据库数据的功能。Redis 支持两种形式的持久化，一种是RDB快照（snapshotting），另外一种是AOF（append-only-file）

## 8.1 RDB（Redis DataBase）

#### 1. RDB 简介

RDB是Redis用来进行持久化的一种方式，是把当前内存中的数据集快照写入磁盘，也就是 Snapshot 快照（数据库中所有键值对数据）。恢复时是将快照文件直接读到内存里

#### 2. 触发方式

RDB 有两种触发方式，分别是自动触发和手动触发

#### ① 自动触发

在 redis.conf 配置文件中的 SNAPSHOTTING 下

~~~
save 900 1：表示900 秒内如果至少有 1 个 key 的值变化，则保存
save 300 10：表示300 秒内如果至少有 10 个 key 的值变化，则保存
save 60 10000：表示60 秒内如果至少有 10000 个 key 的值变化，则保存
~~~

当然如果你只是用Redis的缓存功能，不需要持久化，那么你可以注释掉所有的 save 行来停用保存功能。可以直接一个空字符串来实现停用：save ""

配置文件相关参数说明：

* stop-writes-on-bgsave-error：默认值是yes， 首先redis 会创建一个新的后台进程进行dump rdb，创建快照（硬盘上，产生一个新的rdb文件）需要 20s时间，redis主进程，在这20s内，会继续接受客户端命令，但是，就在这20s内，创建快照出错了，比如磁盘满了，那么redis就会拒绝 新的写入，也就是说，它认为，当前持久化数据出现了问题，你就不要再set，如果值为no，则可以set

* rdbcompression yes：默认值是yes。对于存储到磁盘中的快照，可以设置是否进行压缩存储。如果是的话，redis会采用LZF算法进行压缩。如果你不想消耗CPU来进行压缩的话，可以设置为关闭此功能，但是存储在磁盘上的快照会比较大

* rdbchecksum：默认值是yes。在存储快照后，我们还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。

> 注：fork的作用是复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等）数值都和原进程一致，但是是一个全新的进程，并作为原进程的子进程，

#### ② 手动触发

> shutdown  关闭  会自动执行保存 

手动触发Redis进行RDB持久化的命令有两种

1、save：该命令会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止，很显然该命令对于内存比较大的实例会造成长时间阻塞，这是致命的缺陷，为了解决此问题，Redis提供了第二种方式

2、bgsave：执行该命令时，Redis会在后台异步进行快照操作，持久化的同时主进程还可以响应客户端请求。具体操作是Redis进程执行fork操作创建子进程，RDB持久化过程由子进程负责，完成后自动结束。阻塞只发生在子进程，不会阻塞主进程，一般时间很短

> 基本上 Redis 内部所有的RDB操作都是采用 bgsave 命令
>
> 当执行 flushall 命令，也会产生dump.rdb文件，但里面是空的
>
> 如果在规定的时间没有写符合条件的n个key，这个时候执行shutdown，也会保存，因为执行shutdown指令是会先把数据保存到本地的，shutdown 默认采取 shutdown save模式，也可以手动指定 shutdown nosave不保存。如果是意外退出不会，什么是意外退出呢？如杀掉redis服务器的进程，或者是ctrl+c直接宕掉redis服务器

 小实验：

1、设置：save 60 5   也就是说1分钟内要改变5个key，

2、删除dump.rdb, 然后在登陆redis客户端，在2分钟内修改10个key

~~~
127.0.0.1:6379> set k1 v1 
127.0.0.1:6379> set k2 v2 .......  set k5 v5
~~~

当我们用20秒的时间就set 5个key-value键值对的话，那么这个dump.rdb文件就会马上生成（其实是执行了redis检测到规定时间内有了相应的修改key操作，就会调用bgsave指令执行持久化操作），不需要等到1分钟后才生成

#### 3. 恢复数据

将备份文件 (dump.rdb) 移动到 redis 安装目录并启动服务即可，redis就会自动加载文件数据至内存了。Redis 服务器在载入 RDB 文件期间，会一直处于阻塞状态，直到载入工作完成为止 

#### 4. 停止 RDB 持久化 

有些情况下，我们只想利用Redis的缓存功能，并不想使用 Redis 的持久化功能，那么这时候我们最好停掉 RDB 持久化。可以通过上面讲的在配置文件 redis.conf 中，可以注释掉所有的 save 行来停用保存功能或者直接一个空字符串来实现停用：save ""

也可以通过命令：

~~~
redis-cli config set save " "
~~~

#### 5. RDB 的优势和劣势

①、优势

1、RDB是一个非常紧凑(compact)的文件，它保存了redis 在某个时间点上的数据集。这种文件非常适合用于进行备份和灾难恢复。

2、生成RDB文件的时候，redis主进程会fork()一个子进程来处理所有保存工作，主进程不需要进行任何磁盘IO操作。

3、RDB 在恢复大数据集时的速度比 AOF 的恢复速度要快

②、劣势

1、RDB方式数据没办法做到实时持久化/秒级持久化。因为bgsave每次运行都要执行fork操作创建子进程，属于重量级操作，如果不  采用压缩算法(内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑)，频繁执行成本过高(影响性能)

2、在一定间隔时间做一次备份，所以如果redis意外down掉的话，就会丢失最后一次快照后的所有修改(数据有丢失)

#### 6. RDB 自动保存的原理 

Redis有个服务器状态结构：

~~~
struct redisService{
     //1、记录保存save条件的数组
     struct saveparam *saveparams;
     //2、修改计数器
     long long dirty;
     //3、上一次执行保存的时间
     time_t lastsave;
}
~~~

①、首先看记录保存save条件的数组 saveparam，里面每个元素都是一个 saveparams 结构

~~~
struct saveparam{
     //秒数
     time_t seconds;
     //修改数
     int changes;
};
~~~

前面我们在 redis.conf 配置文件中进行了关于save 的配置

```
save 900 1：表示900 秒内如果至少有 1 个 key 的值变化，则保存
save 300 10：表示300 秒内如果至少有 10 个 key 的值变化，则保存
save 60 10000：表示60 秒内如果至少有 10000 个 key 的值变化，则保存
```

那么服务器状态中的saveparam 数组将会是如下的样子 

②、dirty 计数器和lastsave 属性

dirty 计数器记录距离上一次成功执行 save 命令或者 bgsave 命令之后，Redis服务器进行了多少次修改（包括写入、删除、更新等操作）。

lastsave 属性是一个时间戳，记录上一次成功执行 save 命令或者 bgsave 命令的时间。

通过这两个命令，当服务器成功执行一次修改操作，那么dirty 计数器就会加 1，而lastsave 属性记录上一次执行save或bgsave的时间，Redis 服务器还有一个周期性操作函数 severCron ,默认每隔 100 毫秒就会执行一次，该函数会遍历并检查 saveparams 数组中的所有保存条件，只要有一个条件被满足，那么就会执行 bgsave 命令。

执行完成之后，dirty 计数器更新为 0 ，lastsave 也更新为执行命令的完成时间

 AOF持久化

#### 1.AOF简介

Redis的持久化方式之一RDB是通过保存数据库中的键值对来记录数据库的状态。而另一种持久化方式 AOF 则是通过保存Redis服务器所执行的写命令来记录数据库状态。

比如对于如下命令

~~~
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> sadd set01 1 2 3 4
(integer) 4
127.0.0.1:6379> LPUSH list01 1 1 1 2 3 4 5
(integer) 7
~~~

RDB 持久化方式就是将 str1,set01,list01 这三个键值对保存到 RDB文件中，而 AOF 持久化则是将执行的 set,sadd,lpush 三个命令保存到 AOF 文件中

#### 2. AOF配置

在 redis.conf 配置文件的 APPEND ONLY MODE 下：

① **appendonly**：默认值为no，redis 默认使用的是rdb方式持久化，如果要开启 AOF 持久化方式，需要将 appendonly 修改为 yes。

② **appendfilename** ：aof文件名，默认是"appendonly.aof"

③ **appendfsync：**aof持久化策略的配置；

~~~
no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快，但是不太安全；
always表示每次写入都执行fsync，以保证数据同步到磁盘，效率很低；
everysec表示每秒执行一次fsync，可能会导致丢失这1s数据。通常选择 everysec ，兼顾安全性和效率。
~~~

④ **no-appendfsync-on-rewrite**：在aof重写或者写入文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。  设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。默认值为no。

⑤ **auto-aof-rewrite-percentage**：默认值为100。aof自动重写配置，当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写，即当aof文件增长到一定大小的时候，Redis能够调用bgrewriteaof对日志文件进行重写。当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。

⑥ **auto-aof-rewrite-min-size**：64mb。设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写。

#### 3. 开启 AOF

将 redis.conf 的 appendonly 配置改为 yes 即可。可以通过 config get dir 命令获取保存的路径

#### 4. AOF 文件恢复

重启 Redis 之后就会进行 AOF 文件的载入。

异常修复命令：redis-check-aof --fix  文件名(appendonly.aof)

#### 5. AOF 重写

由于AOF持久化是Redis不断将写命令记录到 AOF 文件中，随着Redis不断的进行，AOF 的文件会越来越大，文件越大，占用服务器内存越大以及 AOF 恢复要求时间越长。为了解决这个问题，Redis新增了重写机制，当AOF文件的大小超过所设定的阈值时，Redis就会启动AOF文件的内容压缩，只保留可以恢复数据的最小指令集合。可以使用命令 bgrewriteaof 来重写

~~~
127.0.0.1:6379> FLUSHALL
OK
127.0.0.1:6379> sadd user "cat"
(integer) 1
127.0.0.1:6379> sadd user "dog" "panda" "tiger"
(integer) 3
127.0.0.1:6379> SREM user "cat"
(integer) 1
127.0.0.1:6379> SADD user "lion" "cat"
(integer) 2
127.0.0.1:6379> SDIFF user
1) "lion"
2) "tiger"
3) "dog"
4) "panda"
5) "cat"
~~~

如果不进行 AOF 文件重写，那么 AOF 文件将保存四条 SADD 命令，如果使用AOF 重写，那么AOF 文件中将只会保留下面一条命令

~~~
sadd animals "dog" "tiger" "panda" "lion" "cat"
~~~

**也就是说 AOF 文件重写并不是对原文件进行重新整理，而是直接读取服务器现有的键值对，然后用一条命令去代替之前记录这个键值对的多条命令，生成一个新的文件后去替换原来的 AOF 文件**

AOF 文件重写触发机制：通过 redis.conf 配置文件中的 auto-aof-rewrite-percentage：默认值为100，以及auto-aof-rewrite-min-size：64mb 配置，也就是说默认Redis会记录上次重写时的AOF大小，**默认配置是当AOF文件大小是上次rewrite后大小的一倍且文件大于64M时触发**

 Redis 是单线程工作，如果 重写 AOF 需要比较长的时间，那么在重写 AOF 期间，Redis将长时间无法处理其他的命令，这显然是不能忍受的。Redis为了克服这个问题，解决办法是将 AOF 重写程序放到子程序中进行，这样有两个好处：

① 子进程进行 AOF 重写期间，服务器进程（父进程）可以继续处理其他命令。

② 子进程带有父进程的数据副本，使用子进程而不是线程，可以在避免使用锁的情况下，保证数据的安全性

> redis解决重写时数据不一致的问题?
>
> 因为子进程在进行 AOF 重写期间，服务器进程依然在处理其它命令，这新的命令有可能也对数据库进行了修改操作，使得当前数据库状态和重写后的 AOF 文件状态不一致，
>
> 为了解决这个数据状态不一致的问题，Redis 服务器设置了一个 AOF 重写缓冲区，这个缓冲区是在创建子进程后开始使用，当Redis服务器执行一个写命令之后，就会将这个写命令也发送到 AOF 重写缓冲区。当子进程完成 AOF 重写之后，就会给父进程发送一个信号，父进程接收此信号后，就会调用函数将 AOF 重写缓冲区的内容都写到新的 AOF 文件中

#### 6. AOF的优缺点

　优点：

　① AOF 持久化的方法提供了多种的同步频率，即使使用默认的同步频率每秒同步一次，Redis 最多也就丢失 1 秒的数据而已。

　② AOF 文件使用 Redis 命令追加的形式来构造，因此，即使 Redis 只能向 AOF 文件写入命令的片断，使用 redis-check-aof 工具也很容易修正 AOF 文件。

　③ AOF 文件的格式可读性较强，这也为使用者提供了更灵活的处理方式。例如，如果我们不小心错用了 FLUSHALL 命令，在重写还没进行时，我们可以手工将最后的 FLUSHALL 命令去掉，然后再使用 AOF 来恢复数据。

　缺点：

　① 对于具有相同数据的的 Redis，AOF 文件通常会比 RDB 文件体积更大。

　② 虽然 AOF 提供了多种同步的频率，默认情况下，每秒同步一次的频率也具有较高的性能。但在 Redis 的负载较高时，RDB 比 AOF 具好更好的性能保证。

　③ RDB 使用快照的形式来持久化整个 Redis 数据，而 AOF 只是将每次执行的命令追加到 AOF 文件中，因此从理论上说，RDB 比 AOF 方式更健壮。官方文档也指出，AOF 的确也存在一些 BUG，这些 BUG 在 RDB不存在。

## 8.3 持久化方案选择

那么对于 AOF 和 RDB 两种持久化方式，我们应该如何选择呢？

~~~
如果可以忍受一小段时间内数据的丢失，毫无疑问使用 RDB 是最好的，定时生成 RDB 快照（snapshot）非常便于进行数据库备份， 并且 RDB 恢复数据集的速度也要比 AOF 恢复的速度要快，而且使用 RDB 还可以避免 AOF 一些隐藏的 bug；否则就使用 AOF 重写。但是一般情况下建议不要单独使用某一种持久化机制，而是应该两种一起用，在这种情况下,当redis重启的时候会优先载入AOF文件来恢复原始的数据，因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据集要完整。Redis后期官方可能都有将两种持久化方式整合为一种持久化模型
~~~

## 8.4 RDB-AOF混合持久化

这里补充一个知识点，在Redis4.0之后，又新增了RDB-AOF混合持久化方式。这种方式结合了RDB和AOF的优点，既能快速加载又能避免丢失过多的数据。

具体配置为

~~~
aof-use-rdb-preamble yes   #设置为yes表示开启，设置为no表示禁用
~~~

当开启混合持久化时，主进程先fork出子进程将现有内存副本全量以RDB方式写入aof文件中，然后将缓冲区中的增量命令以AOF方式写入aof文件中，写入完成后通知主进程更新相关信息，并将新的含有 RDB和AOF两种格式的aof文件替换旧的aof文件。

简单来说：混合持久化方式产生的文件一部分是RDB格式，一部分是AOF格式



# Redis主从复制

### 1.主从复制概述

前面介绍Redis，我们都在一台服务器上进行操作的，也就是说读和写以及备份操作都是在一台Redis服务器上进行的，那么随着项目访问量的增加，对Redis服务器的操作也越加频繁，虽然Redis读写速度都很快，但是一定程度上也会造成一定的延时，那么为了解决访问量大的问题，通常会采取的一种方式是主从架构Master/Slave，Master 以写为主，Slave 以读为主，Master 主节点更新后根据配置，自动同步到从机Slave 节点

### 2.主从复制实验

1、修改配置文件

首先将redis.conf 配置文件复制三份，通过修改端口分别模拟三台Redis服务器。

~~~
[root@localhost bin]# cp redis.conf 6379redis.conf
[root@localhost bin]# cp redis.conf 6380redis.conf
[root@localhost bin]# cp redis.conf 6381redis.conf
~~~

然后我们分别对这三个redis.conf 文件进行修改

~~~
daemonize yes
pidfile /var/run/redis_6379.pid    
port 6379
logfile "6379.log"
dbfilename "dump6379.rdb"
~~~

依次将 6380redis.conf 、6381redis.conf 配置一次，则配置完毕。然后分别启动这三个服务，并通过命令查看Redis是否启动

~~~
[root@localhost bin]# ./redis-server 6379redis.conf   #其它省略
[root@localhost bin]# ps -ef|grep redis
~~~

接下来通过如下命令分别进入到这三个Redis客户端

~~~
[root@localhost bin]# ./redis-cli -p 6379
[root@localhost bin]# ./redis-cli -p 6380
[root@localhost bin]# ./redis-cli -p 6381
~~~

2、设置主从

① 通过 info replication 命令查看节点角色  

我们发现这三个节点都是扮演的 Master 角色。那么如何将 6380 和 6381 节点变为 Slave 角色呢？

② 选择6380端口和6381端口，执行命令：SLAVEOF 127.0.0.1 6379 

分别在三个会话窗口执行 info replication。这个时候6379是master  而6380和6381已经变成slave

这里通过命令来设置主从关系，一旦服务重启，那么角色关系将不复存在。想要永久的保存这种关系，可以通过配置redis.conf 文件来配置。

~~~
replicaof 127.0.0.1 6379     #老版本redis   slaveof 127.0.0.1 6379 
~~~

3、测试主从

① 增量复制

主节点执行 set k1 v1 命令，从节点 get k1 能获取吗？

② 全量复制

通过执行 replicaof  127.0.0.1 6379，如果主节点 6379 以前还存在一些 key，那么执行命令之后，从节点会将主节点master以前的信息也都复制过来吗？会

~~~
当从节点发出 SLAVEOF/replicaof命令，要求从服务器复制主服务器时，从服务器通过向主服务器发送 SYNC 命令来完成。该命令执行步骤：
1、从服务器向主服务器发送 SYNC 命令
2、收到 SYNC 命令的主服务器执行 BGSAVE 命令，在后台生成一个 RDB 文件，并使用一个缓冲区记录从开始执行的所有写命令
3、当主服务器的 BGSAVE 命令执行完毕时，主服务器会将 BGSAVE 命令生成的 RDB 文件发送给从服务器，从服务器接收此 RDB 文件，并将服务器状态更新为RDB文件记录的状态。
4、主服务器将缓冲区的所有写命令也发送给从服务器，从服务器执行相应命令
~~~

③ 主从读写分离

主节点能够执行写命令，从节点能够执行写命令吗？不行，原因是在配置文件 6381redis.conf 中对于 slave-read-only 的配置

~~~
replica-read-only yes
~~~

如果我们将其修改为 no 之后，执行写命令是可以的，但是从节点写命令的数据从节点或者主节点都不能获取的

④主节点宕机 

主节点 Master 挂掉，两个从节点角色会发生变化吗？

~~~
127.0.0.1:6379> SHUTDOWN 
exit    
~~~

测试可知主节点 Master 挂掉之后，从节点角色还是不会改变的。

⑤ 主节点宕机后恢复

主节点Master挂掉之后，马上启动主机Master，主节点扮演的角色还是 Master 吗？测试发现主节点挂掉之后重启，又恢复了主节点的角色



# Redis 和 Boot 新整合

## 基础配置

### 引入依赖

```xml
<!--redis 依赖-->
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--redis 连接池依赖 备用-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

### yml 配置

```yml
spring:
    redis:
        # Redis 服务器地址
        host: localhost
        # Redis 服务器连接端口
        port: 6379
        # Redis 数据库索引（默认为 0）
        database: 0
        # Redis 服务器连接密码（默认为空）
        password: 123
        # Redis 连接池 | 以下非必须，有默认值
        lettuce:
            pool:
                # 连接池最大连接数（使用负值表示没有限制）默认 8
                max-active: 8
                # 连接池最大阻塞等待时间（使用负值表示没有限制）默认 -1
                max-wait: -1
                # 连接池中的最大空闲连接 默认 8
                max-idle: 8
                # 连接池中的最小空闲连接 默认 0
                min-idle: 0
```

### 数据类型

| 专有操作        | 说明                  |
| :-------------- | :-------------------- |
| ValueOperations | string 类型的数据操作 |
| ListOperations  | list 类型的数据操作   |
| SetOperations   | set 类型数据操作      |
| ZSetOperations  | zset 类型数据操作     |
| HashOperations  | map 类型的数据操作    |

## Template 方式数据读写

### 1.RedisTemplate  注入

> 不推荐: 因为使用 不管什么类型的数据 都将会转化成字符串 导致在 redis数据库里 乱码

```java
@Autowired
private RedisTemplate redisTemplate;
// 使用泛型定义 key 和 value 的数据类型
private RedisTemplate<String,String> redisTemplate;
```

### 2.序列化 配置类注入

> 使用 序列化 配置类 可解决乱码问题

```xml
<!--redis 序列化 MVC自带-->
<!--一般情况无需添加 序列化 配置类缺少转换时可添加-->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

#### **序列化工厂 配置类**

```java
package com.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        // 创建 Template
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        // 设置连接工厂
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 设置序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        // key 和 hashkey 使用 string 序列化
        redisTemplate.setKeySerializer(RedisSerializer.string());
        redisTemplate.setHashKeySerializer(RedisSerializer.string());
        // value 和 hashvalue 使用 json 序列化
        redisTemplate.setValueSerializer(jsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);
        return redisTemplate;
    }
}

```

#### opsForValue 字符串

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

// 存入 key 和 value 字符串
redisTemplate.opsForValue().set("key-键", "value-内容");
// 根据 key 获取 value
Object value = redisTemplate.opsForValue().get("key-键");

// 存入 key 和 对象
redisTemplate.opsForValue().set("key-键", 对象);
// 根据 key 获取 对象
Object value = redisTemplate.opsForValue().get("key-键");

```

### 3.StringRedisTemplate 注入

> 推荐使用: 储存时不会造成乱码

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
```

#### opsForValue 字符串 

```java
package com.apai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisTest {

    // 存入redis会造成乱码
    @Autowired
    private RedisTemplate redisTemplate;

    // string 存入redis不会造成乱码
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testString(){
        ValueOperations ops = stringRedisTemplate.opsForValue();
        // 添加一条数据 key - value
        ops.set("name","zhangsan");
        // 根据key加上过期时间 | key - 时间 _ 时间单位
        stringRedisTemplate.boundValueOps("name").expire(10, TimeUnit.SECONDS);
        // 获取key过期时间
        stringRedisTemplate.getExpire("name");

        // 根据key获取一条数据
        String name = (String) ops.get("name");
        System.out.println(name);

        // 使用map一次添加多条数据
        Map<String,String> map = new HashMap<>();
        map.put("age","20");
        map.put("address","sh");
        ops.multiSet(map);

        // 根据list的值获取多条数据
        List<String> keys = new ArrayList<>();
        keys.add("name");
        keys.add("age");
        keys.add("address");
        List list = ops.multiGet(keys);
        list.forEach(System.out::println);

        // 根据key删除一条数据
        stringRedisTemplate.delete("age");
    }

}
```



# redis 和 sping boot 整合

**详见 sping boot 详解2**

> 引入依赖
>
> ~~~xml
> <!--redis 依赖-->
> <dependency>
>  <groupId>org.springframework.boot</groupId>
>  <artifactId>spring-boot-starter-data-redis</artifactId>
> </dependency>
> ~~~

> application 配置

~~~yml
## Redis 服务器地址
spring.redis.host=localhost
## Redis 服务器连接端口
spring.redis.port=6379
## Redis 数据库索引（默认为 0）
spring.redis.database=0
## Redis 服务器连接密码（默认为空）
spring.redis.password=
## 以下非必须，有默认值
## 连接池最大连接数（使用负值表示没有限制）默认 8
spring.redis.lettuce.pool.max-active=8
## 连接池最大阻塞等待时间（使用负值表示没有限制）默认 -1
spring.redis.lettuce.pool.max-wait=-1
## 连接池中的最大空闲连接 默认 8
spring.redis.lettuce.pool.max-idle=8
## 连接池中的最小空闲连接 默认 0
spring.redis.lettuce.pool.min-idle=0
~~~

> 如果连接远程服务器，那么把redis服务器的配置文件的 bind 绑定服务器ip，或者是写成 bind 0.0.0.0

Spring Data Redis 针对 api 进行了重新归类与封装，将同一类型的操作封装为 **Operation** 接口：

| 专有操作        | 说明                  |
| :-------------- | :-------------------- |
| ValueOperations | string 类型的数据操作 |
| ListOperations  | list 类型的数据操作   |
| SetOperations   | set 类型数据操作      |
| ZSetOperations  | zset 类型数据操作     |
| HashOperations  | map 类型的数据操作    |

## Template方式

### RedisTemplate方式

```java
// RedisTemplate 方式
// 不推荐: 因为使用 不管什么类型的数据 都将会转化成字符串 导致在 redis数据库里 乱码
@Autowired
private RedisTemplate<String,String> redisTemplate;

@Override
public List<User> findAllUser() {

    BoundValueOperations<String, String> stringTemplate  = redisTemplate.boundValueOps("userlist");
    Object str = stringTemplate.get();
    List<User> users = new ArrayList<User>();
    ObjectMapper om = new ObjectMapper();
    try {
        if(str == null){
            users = this.userMapper.selectList(null);
            //集合转成字符串
            str = om.writeValueAsString(users);
            redisTemplate.boundValueOps("userlist").set(str.toString());
        }else{
            System.out.println("======从redis缓存中获得数据=========");
            users = om.readValue(str.toString(),new TypeReference<List<User>>(){});
        }
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return users;

}
```

### StringRedisTemplate 方式 

```java
// StringRedisTemplate 方式 
// 推荐使用
@Autowired
private StringRedisTemplate redisTemplate;

@Override
public List<User> findAllUser() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();
    BoundValueOperations<String, String> userlist = redisTemplate.boundValueOps("userlist");
    String s = userlist.get();
    List<User> userList=null;
    if(s!=null){
        userList = objectMapper.readValue(s, new TypeReference<List<User>>() {
        });
        return userList;
    }
    userList = userMapper.selectList(null);
    // 将查询的集合存入rides里
    userlist.set(objectMapper.writeValueAsString(userList));
    return userList;
}
```

### 常用 - API

```java
@Autowired
private StringRedisTemplate redisTemplate;

// 储存 字符串 数据
BoundValueOperations<String, String> ops = redisTemplate.boundValueOps("键");
ops.set("值");

// 储存 hash 对象
BoundHashOperations<String, Object, Object> hash = redisTemplate.boundHashOps("hash-pai");
hash.put("name", "小九");
hash.put("xianqun", "仙裙");
```

### 序列化

```java
// 序列化
ObjectMapper objectMapper = new ObjectMapper();

// 根据键获取实例
BoundValueOperations<String, String> userlist = redisTemplate.boundValueOps("userlist");
// 根据实例获取已被序列化的列表的字符串
String s = userlist.get();
// 将已被序列化的列表的字符串转为 list
userList = objectMapper.readValue(s, new TypeReference<List<User>>() {});

// 将list序列化成字符串储存至内存数据库
userlist.set(objectMapper.writeValueAsString(userList));
```

### 各类型实践

#### 1 String字符串

```java
@Slf4j
@Test
public void testObj() {
    ValueOperations<String, String> operations = redisTemplate.opsForValue();
    operations.set("id", "9527");
    operations.set("name", "tom");
    operations.set("age", "21");
    String name = operations.get("name");
    log.info("{}", name);
}
```

key的自动过期问题，Redis 在存入每一个数据的时候都可以设置一个超时间，过了这个时间就会自动删除数据。

新建一个 Student 对象，存入 Redis 的同时设置 100 毫秒后失效，设置一个线程暂停 1000 毫秒之后，判断数据是否存在并打印结果。

```java
@Test
public void testExpire() throws InterruptedException {
    final String key = "expire" ;
    Student user = new Student("tom", 20);
    ValueOperations<String, Student> operations = redisTemplate.opsForValue(); 
    operations.set(key, user, 100, TimeUnit.MILLISECONDS);  // 这背后就有 Serializer 在工作

    Thread.sleep(1000);

    boolean exists = redisTemplate.hasKey(key);
    System.out.println( exists ? "exists is true" : "exists is false" );
}
```

从结果可以看出，Reids 中已经不存在 Student 对象了，此数据已经过期，同时我们在这个测试的方法中使用了 *`hasKey("expire")`* 方法，可以判断 key 是否存在

3、删除数据

有些时候，我们需要对过期的缓存进行删除，下面来测试此场景的使用。首先 set 一个字符串 `hello world`，紧接着删除此 key 的值，再进行判断。

~~~
redisTemplate.delete("key");
~~~

#### 2 Hash（哈希）

一般我们存储一个键，很自然的就会使用 get/set 去存储，实际上这并不是很好的做法。Redis 存储一个 key 会有一个最小内存，不管你存的这个键多小，都不会低于这个内存，因此合理的使用 Hash 可以帮我们节省很多内存。

Hash Set 就在哈希表 Key 中的域（Field）的值设为 value。如果 Key 不存在，一个新的哈希表被创建并进行 HSET 操作;如果域（field）已经存在于哈希表中，旧值将被覆盖。

先来看 Redis 对 Pojo 的支持，新建一个 Student 对象（需要实现 Serializable 接口），放到缓存中，再取出来。

```java
@Test
public void testHash() {
    final String key = "tom"; 

    HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
    hash.put(key, "name", "tom");
    hash.put(key, "age", "20");

    String value = hash.get(key, "name");
    log.info("hash value : {}", value);
}
```

输出结果:

```text
hash value :tom
```

根据上面测试用例发现，Hash set 的时候需要传入三个参数，第一个为 key，第二个为 field，第三个为存储的值。一般情况下 Key 代表一组数据，field 为 key 相关的属性，而 value 就是属性对应的值。

#### 3 List集合类型

Redis List 的应用场景非常多，也是 Redis 最重要的数据结构之一。 使用 List 可以轻松的实现一个队列， List 典型的应用场景就是消息队列，可以利用 List 的 Push 操作，将任务存在 List 中，然后工作线程再用 POP 操作将任务取出进行执行。

```java
@Test
public void testList() {
    final String key = "list";
    ListOperations<String， String> list = redisTemplate.opsForList();
    list.leftPush(key, "hello");
    list.leftPush(key, "world");
    list.leftPush(key, "goodbye");
    String value = list.leftPop(key);

    log.info("list value : {}", value.toString());
}
```

输出结果

```text
list value :goodbye
```

上面的例子我们从左侧插入一个 key 为 "list" 的队列，然后取出左侧最近的一条数据。其实 List 有很多 API 可以操作，比如从右侧进行插入队列，从右侧进行读取，或者通过方法 range 读取队列的一部分。接着上面的例子我们使用 range 来读取。

```java
List<String> values = list.range(key, 0, 2);
for (String v : values) {
    System.out.println("list range :" + v);
}
```

输出结果:

```text
list range :goodbye
list range :world
list range :hello
```

range 后面的两个参数就是插入数据的位置，输入不同的参数就可以取出队列中对应的数据。

Redis List 的实现为一个双向链表，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销，Redis 内部的很多实现，包括发送缓冲队列等也都是用的这个数据结构。

#### 4 Set集合类型

Redis Set 对外提供的功能与 List 类似，是一个列表的功能，特殊之处在于 Set 是可以自动排重的，当你需要存储一个列表数据，又不希望出现重复数据时，Set 是一个很好的选择，并且 Set 提供了判断某个成员是否在一个 Set 集合内的重要接口，这个也是 List 所不能提供的。

```java
@Test
public void testSet() {
    final String key = "set";
    SetOperations<String, String> set = redisTemplate.opsForSet();
    set.add(key, "hello");
    set.add(key, "world");
    set.add(key, "world");
    set.add(key, "goodbye");
    Set<String> values = set.members(key);
    for (String v : values) {
        System.out.println("set value :" + v);
    }
}
```

输出结果:

```text
set value :hello
set value :world
set value :goodbye
```

通过上面的例子我们发现，输入了两个相同的值 `world`，全部读取的时候只剩下了一条，说明 Set 对队列进行了自动的排重操作。另外，Redis 为集合提供了求交集、并集、差集等操作，可以非常方便的使用，这里就不一一举例了。

#### 5 ZSet集合类型

Redis Sorted Set 的使用场景与 Set 类似，区别是 Set 不是自动有序的，而 Sorted Set 可以通过用户额外提供一个优先级（Score）的参数来为成员排序，并且是插入有序，即自动排序。

在使用 Zset 的时候需要额外的输入一个参数 Score，Zset 会自动根据 Score 的值对集合进行排序，我们可以利用这个特性来做具有权重的队列，比如普通消息的 Score 为 1，重要消息的 Score 为 2，然后工作线程可以选择按 Score 的倒序来获取工作任务。

```java
@Test
public void testZset() {
    final String key = "zset";
    redisTemplate.delete(key);
    ZSetOperations<String, String> zset = redisTemplate.opsForZSet();
    zset.add(key, "hello", 1);
    zset.add(key, "world", 6);
    zset.add(key, "good", 4);
    zset.add(key, "bye", 3);

    Set<String> zsets = zset.range(key, 0, 3);
    for (String v : zsets) {
        log.info("zset-A value : {}", v);
    }

    Set<String> zsetB = zset.rangeByScore(key, 0, 3);
    for (String v : zsetB) {
        log.info("zset-B value : {}", v);
    }   
}
```

输出结果:

```text
zset-A value : hello
zset-A value : bye
zset-A value : good
zset-A value : world
zset-B value : hello
zset-B value : bye
```





## Redis Repositories方式

> Spring Data Redis 从 1.7 开始提供 Redis Repositories ，可以无缝的转换并存储 domain objects，使用的数据类型为哈希（hash）。
>
> Spring Data Redis 的 Repository 的基本实现为：**CrudRepository** 。
>
> 基础用法（Usage）分为以下三步：

### **1.启用 Repository 功能**

在启动类上加上注解 @EnableRedisRepositories(basePackages = "com.woniu.outlet.redis")

> 属性 ***`basePackages`*** 如果不赋值，那么默认是扫描入口类平级及之下的所有类，看它们谁的头上有 ***`@Repository`*** 注解。如果是同时使用 spring-data-jpa 和 spring-data-redis 时，由于它们的 Repository 的祖先中都有 CrudRepository 因此会造成冲突。虽有，最好还是加上 ***`basePackages`*** 属性并为它赋值，指定各自扫描的路径，以避免冲突

```java
@SpringBootApplication
// 创建repository接口的代理对象
@EnableRedisRepositories(basePackages = "com.woniu.outlet.redis")
public class K15ManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(K15ManagerApplication.class, args);
    }
}
```

####  2.注解需要缓存的实体

添加关键的两个注解 ***`@RedisHash`*** 和 ***`@Id`*** ;

redis 储存为 hash 类型  外键为 @RedisHash("外键名")   内键名为 外键名 : id  包含实体类的数据对象

```java
@Data
@RedisHash("user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    private Long id;
    private String userName;
    private String password;
    private String email;
    //当然我们也可以定义集合
    List<XX> lists;
}
```

| 注解       | 说明                                                       |
| :--------- | :--------------------------------------------------------- |
| @RedisHash | 表示将 User 类的对象都对于 Redis 中的名为 user 的 Set 中。 |
| @Id        | 标注于对象的唯一性标识上。                                 |

如果将多个 User 对象通过 Repository 存储于 Redis 中，那么，它们每个的 key 分别是：***`user:<Id>`** 。例如：`user:1`、`user:2`、`user:3`、...

获取它们每个对象的属性的命令为：

~~~
hget user:1 userName
hget user:1 lists.[0].属性
~~~

#### 3.创建Repository 接口

自定的 Repository 接口必须继承 CrudRepository，才能“天生”具有存取数据的能力。

~~~
public interface RedisUserRepo extends CrudRepository<User,Integer> {
}
~~~

![image-20220625164939902](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220625164939902.png)

#### 4.业务层 测试

```java
@Autowired
private UserRepository userRepository;

// 根据 Repository 接口 指定的实体类 内存数据库查询所有 集合时需强转
(List) userRepository.findAll(); 


// 内存数据库 添加对应的实体类数据 已存在时 可以进行修改
userRepository.save(user);
// 内存数据库 根据 id 删除对应的数据
userRepository.deleteById(id);
// 集合列表存入 内存数据库
userRepository.saveAll(listall);
```





# redis的缓存失效问题

## 1、缓存雪崩

**场景：**

如果所有首页的Key失效时间都是12小时，中午12点刷新的，我零点有个秒杀活动大量用户涌入，假设当时每秒 6000 个请求，本来缓存在可以扛住每秒 5000 个请求，但是缓存当时所有的Key都失效了。此时 1 秒 6000 个请求全部落数据库，数据库必然扛不住，它会报一下警，真实情况可能DBA都没反应过来就直接挂了。此时，如果没用什么特别的方案来处理这个故障，DBA 很着急，重启数据库，但是数据库立马又被新的流量给打死了

**解决方法:**

处理缓存雪崩简单，在批量往Redis存数据的时候，把每个Key的失效时间都加个随机值就好了，这样可以保证数据不会在同一时间大面积失效，

~~~
setRedis（Key，value，time + Math.random() * 10000）；
~~~

如果**Redis**是集群部署，将热点数据均匀分布在不同的**Redis**库中也能避免全部失效的问题，或者设置热点数据永远不过期

## 2、缓存穿透

缓存穿透是指缓存和数据库中都没有的数据，而用户不断发起请求，如我们数据库的 id 都是1开始自增上去的，这个时候发起为id值为 -1 的数据或 id 为特别大不存在的数据。这时的用户很可能是攻击者，攻击会导致数据库压力过大，严重会击垮数据库，**像这种你如果不对参数做校验，数据库id都是大于0的，我一直用小于0的参数去请求你，每次都能绕开Redis直接打到数据库，数据库也查不到，每次都这样，并发高点就容易崩掉了**

处理缓存穿透的方式很简单：在接口层增加校验，比如用户鉴权校验，参数做校验，不合法的参数直接代码Return，比如：id 做基础校验，id <=0的直接拦截等，或者也可以将对应Key的Value对写为null，还有就是Redis一个高级用法**布隆过滤器（Bloom Filter）**这个也能很好的防止缓存穿透的发生，他的原理也很简单就是利用高效的数据结构和算法快速判断出你这个Key是否在数据库中存在，不存在你return就好了，存在你就去查了DB刷新KV再return

## 3、缓存击穿

缓存击穿是指一个Key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个Key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个完好无损的桶上凿开了一个洞

> 缓存穿透类似偷袭，绕过redis，袭击数据库。缓存击穿类似正面硬刚，一直进攻一个地方，直到失效时一起涌入攻击数据库。缓存雪崩类似鬼子进村

缓存击穿的方案：设置热点数据永远不过期。分布式锁就能搞定了

# 缓存与数据库一致性

## Cache Aside Pattern

标准的方案，facebook 就是使用这种方式。

| 核心概念 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| 失效     | 应用程序先从 cache 取数据，没有得到，则从数据库中取数据，成功后，放到缓存中。 |
| 命中     | 应用程序从 cache 中取数据，取到后返回。                      |
| 更新     | 先把数据存到数据库中，成功后，再让缓存失效。                 |

### 1.1 读流程

| 步骤 | 说明                   |
| ---- | ---------------------- |
| 1    | 读缓存，命中则直接返回 |
| 2    | 如果没命中，读数据库   |
| 3    | 更新缓存               |

### 1.2 写流程

| 步骤 | 说明               |
| ---- | ------------------ |
| 1    | 更新数据库         |
| 2    | 删缓存，使缓存失效 |

先更新数据库，在删除缓存

## 双写读写并发问题

Cache Aside Pattern 方案能解决 `双写并发` 问题：结论：**即写完操作，就删除对应的redis缓存**

### 先更新数据库，再更新缓存场景-不推荐

当有两个线程A、B，同时对一条数据进行操作，一开始数据库和redis的数据都为1，当线程A去修改数据库，将1改为2，然后线程A在修改缓存中的数据，可能因为网络原因出现延迟，这个时候线程B将数据库的2修改成了3、然后将redis中的1也改成了3，然后线程A恢复正常，将redis中的缓存改成了2，此时就出现了缓存数据和数据库数据不一致情况。**不推荐**
 ![ ](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023094213033.png)



### 先更新缓存，再更新数据库场景-不推荐

当有两个线程A、B，同时对一条数据进行操作，线程A先将redis中的数据修改为了2，然后CPU切换到了线程B，将redis中的数据修改为了3，然后将数据库中的信息也修改了3，然后线程A获得CPU执行，将数据库中的信息改为了2，此时出现缓存和数据库数据不一致情况。不推荐

![image-20211023094755926](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023094755926.png) 

### 先删除缓存，再更新数据库的场景-不推荐

先删除缓存，再更新数据库能解决双写并发问题，不能解决读写并发问题。

读写问题

当有两个线程A、B，同时对一条数据进行操作，当线程A进行修改缓存操作时，先删除掉缓存中的数据，然后去修改数据库，因为网络问题出现延迟，这时线程B查新redis没有值，因此去数据库中查询数据为1，然后将数据1更新到缓存中，线程A网络恢复，又将数据库数据修改为了2，此时出现数据不一致。不推荐，这种情况在读写并发情况有问题
![image-20211023095153207](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023095153207.png)

### 先更新数据库，再删除缓存场景-可以接受

FaceBook 是采用这种方式，简称CAP

#### 两次修改（双写）场景

当有两个线程A、B，线程A去修改数据库中的值改为2，然后出现网络波动，线程B将数库中的值修改为了3，**然后两个线程都会删除缓存，保证数据一致性**。无非是线程A多删了一次

![image-20211023124410658](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023124410658.png) 

#### 一改一查（读写）场景 

场景1：

当有两个线程A、B，线程A先去将数据库的值修改为2，然后需要去删除redis中的缓存，当线程B去读取缓存时，线程A已经完成delete操作时，缓存不命中，需要去查询数据库，然后在更新缓存，数据一致性；

如果线程A没有完成delete操作（图中案例），线程B直接命中，返回的数据与数据库中的数据不一致，**可能会短暂出现数据不一致情况**，但最终都会一致

![image-20211023100120474](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023100120474.png) 



场景2：

（0）缓存刚好失效，（1）线程A查询数据库，得一个旧值 ，（2）线程B将新值写入数据库，（3）线程B删除缓存（其实缓存这个时候没有东西，不过也无所谓，只不过删除的返回值为0而已），（5）最后线程A将查到的旧值写入缓存

![image-20211023124951584](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023124951584.png) 

**然而，发生这种情况的概率又有多少呢？**发生上述情况有一个先天性条件，就是步骤（2）的写数据库操作比步骤（2）的读数据库操作耗时更短，才有可能使得步骤（4）先于步骤（5）。

可是，大家想想，数据库的读操作的速度远快于写操作的（不然做读写分离干嘛，做读写分离的意义就是因为读操作比较快，耗资源少），因此步骤（3）耗时比步骤（2）更短，这一情形很难出现。 假设，有人非要抬杠，有强迫症，一定要解决怎么办？

## Cache Aside Pattern 方案

这个方案足够简单，容易理解，容易实现。只是面对『**部分读写并发问题无能为力**』，不过，实际上出现这种概率可能非常低，因为这个条件需要发生在读缓存时缓存失效，而且并发着有一个写操作。而实际上数据库的写操作会比读操作慢得多，而且还要锁表，而读操作必需在写操作前进入数据库操作，而又要晚于写操作更新缓存，所有的这些条件都具备的概率基本并不大。

1、相关pom

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.3</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
 
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

2、application.yml

```yml
server:
  port: 8080
spring:
  application:
    name: distribute-redis

  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    username: root
    password: root
    url: jdbc:mysql://localhost:3306/k15?serverTimezone=UTC

  redis:
    host: 127.0.0.1
    port: 6379
```

3、controller

```java
@RequestMapping("/add/department")
public String addDepartment(AddDepartmentCommand command){
    command.execute();
    return "success";
}

@RequestMapping("/update/department")
public String updateDepartment(UpdateDepartmentCommand command){

    command.execute();
    return "success";
}

@RequestMapping("/department/{id}")
public Department getDepartmentById(@PathVariable  Integer id){

    DepartmentQueryCommand command = new DepartmentQueryCommand(id);
    Department department = command.execute();
    return department;
}
```



查询部分

```java
@Slf4j
@Data
public class DepartmentQueryCommand {

    private Integer id;

    private DepartmentQueryCommandHandler departmentQueryCommandHandler;

    public DepartmentQueryCommand(){
        departmentQueryCommandHandler = ApplicationContextHolder
                .getApplicationContext()
                .getBean(DepartmentQueryCommandHandler.class);
    }

    public DepartmentQueryCommand(Integer id){
        this();
       this.id = id;
    }

    public Department execute(){
        return departmentQueryCommandHandler.action(this);

    }
}
```

```java
@Component
@Slf4j
public class DepartmentQueryCommandHandler {

    @Autowired
    private DepartmentDao departmentDao;

    @Autowired
    private DepartmentRedisDao departmentRedisDao;

    public Department action(DepartmentQueryCommand command) {
        Department department = new Department();
        department.setId(command.getId());
        Department temp = null;
        try {
            temp = departmentRedisDao.findById(department.getId()).get();
            log.info("从缓存redis查");
            if (temp == null) {
                temp = departmentDao.selectByPrimaryKey(department.getId());
                departmentRedisDao.save(temp);
            }
        } catch (Exception ex) {

        }
        return temp;
    }
}
```

更新部分

```java
@Slf4j
@Data
public class UpdateDepartmentCommand {

    private Integer id;
    private String name;
    private String location;
    private Integer version;

    private UpdateDepartmentCommandHandler updateDepartmentCommandHandler;

    public UpdateDepartmentCommand(){
        updateDepartmentCommandHandler = ApplicationContextHolder
                    .getApplicationContext()
                    .getBean(UpdateDepartmentCommandHandler.class);
    }

    public void execute(){
        updateDepartmentCommandHandler.action(this);
    }
}
```

```java
@Component
@Slf4j
public class UpdateDepartmentCommandHandler {
    @Autowired
    private DepartmentDao departmentDao;

    @Autowired
    private DepartmentRedisDao departmentRedisDao;

    public void action(UpdateDepartmentCommand command){
        Department department = departmentDao.selectByPrimaryKey(command.getId());

        //此处不进行非空判断
        BeanUtils.copyProperties(command,department);
        departmentDao.updateByPrimaryKey(department);

        //删除redis操作
        departmentRedisDao.delete(department);
        log.info("从redis删除成功");
    }
}
```

添加部分

```java
@Slf4j
@Data
public class AddDepartmentCommand {

    private Integer id;
    private String name;
    private String location;
    private Integer version;

    private AddDepartmentCommandHandler addDepartmentCommandHandler;

    public AddDepartmentCommand() {
        this.addDepartmentCommandHandler =
                ApplicationContextHolder.getApplicationContext()
                        .getBean(AddDepartmentCommandHandler.class);
    }


    public int execute() {
       return  addDepartmentCommandHandler.action(this);
    }

}
```

```java
@Slf4j
@Component
public class AddDepartmentCommandHandler {

    @Autowired
    private DepartmentDao departmentDao ;

    @Autowired
    private DepartmentRedisDao departmentRedisDao;

    public int  action(AddDepartmentCommand command){
        Department department = new Department();
        department.setVersion(command.getVersion());
        department.setName(command.getName());
        department.setLocation(command.getLocation());
        int flag  = departmentDao.insertSelective(department);

        //往redis添加一条数据
        departmentRedisDao.save(department);
        log.info("保存到redis成功");
        return flag;
    }
}
```

dao层

```java
@Component
public interface DepartmentDao  extends Mapper<Department>{

    @Update("update department set name = #{name},version = #{version}+1 where id = #{id} and version = #{version}")
    public int updateDepartment(Department department);
}
```

```java
@Component
public interface DepartmentRedisDao extends CrudRepository<Department,Integer> {

}
```



## CAP 方案的改进

### 延期删除

将写操作的『删除 Redis』操作改为异步的延迟删除。例如：更新完数据库，1 秒钟之后再删除缓存，这种情况下，读写并发造成的数据不一致问题最多也就存在 1 秒

> 这个改进方案的问题在于：你要延迟多久？延迟的时间短了没有解决读写并发问题；延迟的时间越长不一致隐患就越大。

延期的好处：

正常情况下，A线程读操作，B线程写操作，假如说B先更新数据库，然后删除redis缓存，在B删除redis缓存期间，A没有读操作，然后等B删除redis完成，A再查，发现缓存没有，查数据库，然后再更新缓存，这是正常的。

如果是A先读的呢？A先找redis缓存，发现没有，然后查数据库，完了之后，当它将数据库数据写到redis缓存之前，这个时候B更新了数据库，然后删除了缓存，然后A在更新redis缓存，那么redis缓存就是旧数据库了。所以这个时候延期删除的话，目的就是等到A放到缓存之后再删除。那么延期多久呢？这也是个问题

### 借助消息队列，将删存缓存的工作委托给第三方

- 读数据的人，先查redis缓存，发现没有数据时，它去查数据库拿到结果，但是把这个结果放到redis缓存不再由它自己来完成，而是发消息给消息队列，队列监听到数据，然后将数据存redis，不再由他自己来刷新缓存，而是由『别人』来刷新；
- 写数据的人，在更新完数据库之后，同样发送消息给消息队列，表示要删除缓存，队列存该消息，有监听器接收到该消息，去执行删除缓存操作，不再由他自己来删除缓存，而是由『别人』来删除；

好处：**读和写操作，送到队列这是有先后的，将并行化产生的问题，由串行化顺序执行**

坏处：代价很大，一旦消息队列宕机，整个过程结束

 ![image-20211023130205539](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20211023130205539.png)

> 说明：
>
> 这些改建方案不一定用得上。原因在于：
>
> 1. 有数据不一致的窗口期，这是可接受的。
> 2. 改进方案虽然改进了问题，但是同时带来了复杂性

# Redis/Redisson 锁 | 分布式锁

## 分布式锁使用场景

随着互联网技术的不断发展，数据量的不断增加，业务逻辑日趋复杂，在这种背景下，传统的集中式系统已经无法满足我们的业务需求，分布式系统被应用在更多的场景，而在分布式系统中访问共享资源就需要一种互斥机制，来防止彼此之间的互相干扰，以保证一致性，在这种情况下，我们就需要用到分布式锁

首先我们先来看一个小例子：

　　假设某商城有一个商品库存剩10个，用户A想要买6个，用户B想要买5个，在理想状态下，用户A先买走了6了，库存减少6个还剩4个，此时用户B应该无法购买5个，给出数量不足的提示；而在真实情况下，用户A和B同时获取到商品剩10个，A买走6个，在A更新库存之前，B又买走了5个，此时B更新库存，商品还剩5个，这就是典型的电商“秒杀”活动。

　　从上述例子不难看出，在高并发情况下，如果不做处理将会出现各种不可预知的后果。那么在这种高并发多线程的情况下，解决问题最有效最普遍的方法就是给共享资源或对共享资源的操作加一把锁，来保证对资源的访问互斥。在Java JDK已经为我们提供了这样的锁，利用ReentrantLock或者synchronized，即可达到资源互斥访问的目的。但是在分布式系统中，由于分布式系统的分布性，即多线程和多进程并且分布在不同机器中，**也就是说一个服务可以同时启动多个实例，不同用户访问不同的实例**，那么这两种锁将失去原有锁的效果，需要我们自己实现分布式锁——分布式锁。　　

一般我们使用分布式锁有两个场景：

- **效率**：使用分布式锁可以避免不同节点重复相同的工作，这些工作会浪费资源。比如用户付了钱之后有可能不同节点会发出多封短信。
- **正确性**：加分布式锁同样可以避免破坏正确性的发生，如果两个节点在同一条数据上面操作，比如多个节点机器对同一个订单操作不同的流程有可能会导致该笔订单最后状态出现错误，造成损失。

Redis 因为其性能好，实现起来分布式锁简单，所以让很多人都对基于 Redis 实现的分布式锁十分青睐。

> 提示
>
> 除了能使用 Redis 实现分布式锁之外，Zookeeper 也能实现分布式锁。但是项目中不可能仅仅为了实现分布式锁而专门引入 Zookeeper ，所以，除非你的项目体系中本来就有 Zookeeper（来实现其它功能），否则不会单独因为分布式锁而引入它

## Redis 锁

### SETNX 命令

早期，SETNX 是独立于 SET 命令之外的另一条命令。它的意思是 **SET** if **N**ot e**X**ists，即，在键值对不存在的时候才能设值成功。

注意:SETNX 命令的价值在于：它将 `判断` 和 `设值` 两个操作合二为一，从而避免了 `查查改改` 的情况的出现。

后来，在 Redis 2013 年推出的 2.6.12 版本中，Redis 为 SET 命令官方提供了 NX 选项，使得 SET 命令也能实现 SETNX 命令的功能。其语法如下：

```shell
SET <key> <value> [EX seconds] [PX milliseconds] [NX | XX]
# SET <键> <内容> [过期时间] // 详情见 redis 命令
```

**EX** 值的是 `key` 的存活时间，单位为秒。**PX** 与 **EX** 作用一样，唯一的不同就是后者的单位是微秒（使用较少）。

**NX** 和 **XX** 作用是相反的。**NX** 表示只有当 key『**不存在时**』才会设置其值；**XX** 表示当 `key` 存在时才设置 `key` 的值。

在 “升级” 了 SET 命令之后，Redis 官方说：“由于 SET 命令选项可以替换 SETNX，SETEX，因此在 Redis 的将来版本中，这二个命令可能会被弃用并最终删除”。

所以，现在我们口头所说的 SETNX 命令，并非单指 SETNX 命令，而是包括带 NX 选项的 SET 命令（甚至以后就没有 SETNX 命令了）

### SETNX 的使用

在使用 `SETNX` 操作实现分布式锁功能时，需要注意以下几点：

- 这里的『锁』指的是 Redis 中的一个认为约定的键值对。谁能创建这个键值对，就意味着谁拥有这整个『锁』。
- 使用 `SETNX` 命令获取『锁』时，如果操作返回结果是 0（表示 key 已存在，设值失败），则意味着获取『锁』失败（该锁被其它线程先获取），反之，则设值成功，表示获取『锁』成功。
  - 如果这个 **key** 不存在，SETNX 才会设置该 key 的值。此时 Redis 返回 1 。
  - 如果这个 **key** 存在，SETNX 则不会设置该 key 的值。此时 Redis 返回 0 。
- 为了防止其它线程获得『锁』之后，有意或无意，长期持有『锁』而不释放（导致其它线程无法获得该『锁』）。因此，需要为 key 设置一个合理的过期时间。
- 当成功获得『锁』并成功完成响应操作之后，需要释放『锁』（可以执行 DEL 命令将『锁』删除）。

在代码层面，与 Setnx 命令对应的接口是 ValueOperations 的 **setIfAbsent** 方法

```java
package com.api.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
public class TestController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping("setntx")
    public String text() throws InterruptedException {
        // 获取 SETNX 命令实例
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        // 根据键存入内容 并设置该key键的过期的时间 单位为秒 | 成功存入: true 反之:false
        while(!Boolean.TRUE.equals(ops.setIfAbsent("apai","bye", 13000, TimeUnit.MILLISECONDS))){
            //延迟1秒执行，继续取set  看看是否成功
            System.out.println(Thread.currentThread().getName()+":获取锁失败");
            TimeUnit.MILLISECONDS.sleep(1000);
        }
        try {
            System.out.println(Thread.currentThread().getName()+":处理业务");
            Thread.sleep(10000);
        } catch(Exception exception){
        }finally {
            // 删除该key键和内容
            redisTemplate.delete("apai");
        }
        return "月亮如此凄美";
    }

}

```

开启两个不同的浏览器发请求测试

上面的代码逻辑有 3 个小问题：

1. 上锁时，设置的超时自动删除时长（3 秒），设置多长合适？万一设置短了怎么办?

   如果设置短了，在业务逻辑执行完之前时间到期，那么 Redis 自动就把键值对给删除了，即，把锁给释放了，这不符合逻辑。

2. 解锁时，`查 - 删` 操作是 2 个操作，由两个命令完成，非原子性。

3. redis底层执行这个setnx不是一个原子操作，而是有两步操作完成的，首先set hello world，然后第二步设置key的过期时间： expire hello 3，那么如果执行完第一步刚好redis宕机了，此时key一直保存到redis。永远也无法删除了。

当然，上述两个问题我们都能解决，不过有人（ Redisson ）帮我们把这些事情做好了

###  Redisson 如何解决问题

- Redisson 解决 “过期自动删除时长” 问题的思路和方案

  Redisson 中客户端一旦加锁成功，就会启动一个后台线程（惯例称之为 watch dog 看门狗）。watch dog 线程默认会每隔 10 秒检查一下，如果锁 key 还存在，那么它会不断的延长锁 key 的生存时间，直到你的代码中去删除锁 key 。

- Redisson 解决setnx和 解锁的**非原子性** 问题的思路和方案

  Redisson 的上锁和解锁操作都是通过 Lua 脚本实现的。Redis 中 执行 Lua 脚本能保证原子性，整段 Lua 脚本的执行是原子性的，在其执行期间 Redis 不会再去执行其它命令

## Redisson 锁

**防坑指南**

* 持有锁的线程可以反复上锁，而不会失败，或阻塞等待；锁的非持有者上锁时，则会失败，或需要等待
* 指定了超时自动删除时间，而且如果你的业务执行时间过长，超过了key的过期时间， 而你在执行完业务之后也去删除这个key，就会报错
* 一旦 设置了key的过期时间 则导致watch dog失效从而不会进行自动续期

**Redisson API**

```java
// 注入Redisson配置对象实例 前提需创建配置类
@Autowired
private RedissonClient redissonClient;

// 获取一把锁对象，此时还没有加锁
RLock rLock = redissonClient.getLock("key");
// 加锁，其实就是设置一个key-value   默认加的锁都是30s  
rLock.lock();
// 3秒钟 自动解锁 即过期 | 注意: 一旦设置时间 就不会自动续期
rLock.lock(3,TimeUnit.SECONDS);
// 删掉一个key
rLock.unlock();  

// 拿不到就立刻返回
boolean b = rLock.tryLock();
// 拿不到最多等 1 秒。1 秒内始终拿不到，就返回
boolean b1 = rLock.tryLock(1, TimeUnit.SECONDS);
// 尝试在1s内去拿锁，拿不到就返回false，拿到了10s自动释放这个锁 | 一旦设置时间 就不会自动续期
boolean b2 = rLock.tryLock(1, 10, TimeUnit.SECONDS);
```

1、引入 redisson 包

```xml
<!-- Redisson 分布式锁 -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.15.6</version>
</dependency>
```

2、配置 Redisson Client

~~~java
package com.api.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient getRedissonClient(){
        Config config = new Config();
        //config.setLockWatchdogTimeout();
        // 注意配置 redis 路径
        config.useSingleServer().setAddress("redis://192.168.174.133:6379").setKeepAlive(true);
        return Redisson.create(config);
    }
}

~~~

3、测试

~~~java
package com.api.controller;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.concurrent.TimeUnit;

@RestController
public class TestController {

    @Autowired
    private RedissonClient redissonClient;

    @GetMapping("/hello")
    public String hello1() throws InterruptedException {
        // 获取一把锁对象，此时还没有加锁
        RLock rLock = redissonClient.getLock("hello");
        try {
            // 加锁，其实就是设置一个key-value   默认加的锁都是30s
            rLock.lock();
            Thread.sleep(5000);
            System.out.println(Thread.currentThread().getName()+":处理业务");
        } catch(Exception exception){
        }finally {
            // 删掉一个key
            rLock.unlock();
        }
        return "ok";
    }

}
~~~

测试2：

```java
@Test
void contextLoads() {
    for (int i = 0; i < 5; i++) {
        final long seconds  = i;
        new Thread(() -> {
            RLock hello = redissonClient.getLock("hello");
            hello.lock();
            System.out.println("lock success。准备睡 " + seconds + " 秒，再起来释放锁");
            try {
                TimeUnit.SECONDS.sleep(seconds);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }finally {
                hello.unlock();
            }
        }).start();
    }
    while(true){}
}
```

### Redisson分析

1、你通过 RedissonClient 拿到的锁都是 “**可重入锁**” 。这里的 “可重入” 的意思是：持有锁的线程可以反复上锁，而不会失败，或阻塞等待；锁的非持有者上锁时，则会失败，或需要等待。当然，如果你对一个锁反复上锁，那么逻辑上，你应该对它执行同样多次的解锁操作

~~~java
@Autowired
private RedissonClient redissonClient;
@Test
void contextLoads() {
    RLock rLock = redissonClient.getLock("hello");
    rLock.lock(); System.out.println("lock success!");
    rLock.lock(); System.out.println("lock success!");
    rLock.lock(); System.out.println("lock success!");

    rLock.unlock();
    rLock.unlock();
    rLock.unlock();
}
~~~

使用 lock( )上锁时由于你没有指定过期删除时间，所以，逻辑上只有当你调用 unlock(  )之后，Redis 中代表这个锁的简直对才会被删除。当然你也可以在 lock 时指定超时自动解锁时间：

~~~java
rLock.lock(3,TimeUnit.SECONDS);  //3秒钟 自动解锁
~~~

这种情况下，如果你有意或无意没有调用 unlock 进行解锁，那么 3秒后，Redis 也会自动删除代表这个锁的键值对

2、当两个不同的线程对同一个锁进行 lock 时，第二个线程的上锁操作会失败。而上锁失败的默认行为是阻塞等待，直到前一个线程释放掉锁。这种情况下，如果你不愿意等待，那么你可以调用 `tryLock()` 方法上锁。tryLock 上锁会立刻（或最多等一段时间）返回，而不会一直等（直到所得持有线程释放）。

~~~java
// 拿不到就立刻返回
hello.tryLock();
// 拿不到最多等 1 秒。1 秒内始终拿不到，就返回
hello.tryLock(1, TimeUnit.SECONDS);
// 尝试在1s内去拿锁，拿不到就返回false，拿到了10s自动释放这个锁
hello.tryLock(1, 10, TimeUnit.SECONDS);
~~~

3、Redisson 在上锁时，向 Redis 中添加的键值对时，通过hset设置k-v的，其中键就是hello，当然你也可以是其它的值，那么这个值里面的键是redisson内部帮我们生成的UUID +“：” +thread-id 拼接而成的字符串；值是这个锁的上锁次数，默认是1

Redisson 如何保证线程间的互斥以及锁的重入（反复上锁）？

因为代表这锁的键值对的键中含有线程 ID ，因此，当你执行上锁操作时，Redisson 会判断你是否是锁的持有者，即，当前线程的 ID 是否和键值对中的线程 ID 一样。

如果当前执行 lock 的线程 ID 和之前执行 lock 成功的线程的 ID 不一致，则意味着是 “第二个人在申请锁” ，那么就 lock 失败；如果 ID 是一样的，那么就是 “同一个” 在反复 lock，那么就累加锁的上锁次数，即实现了重入。

### watch dog 自动延期机制

如果在使用 lock/tryLock 方法时，你**指定了超时自动删除时间，如：hello.tryLock(10, TimeUnit.SECONDS);Redis 会自动10s后将当前线程锁的键值对给删除掉，不会自动续期**，而且如果你的业务执行时间过长，超过了key的过期时间， 而你在执行完业务之后也去删除这个key，就会报错，提示错误为：当前线程不能删除这个key，因为你删的key不是你之前的key，而是另外一个线程给redis重新设置的key。所以设置带过期时间的hello.tryLock(10, TimeUnit.SECONDS)键值对时，时长一定要超过业务执行的时长

如果，你在使用 lock/tryLock 方法时，没有指定超时自动删除时间，那么，就完全依靠你的手动删除（ unlock 方法 ），那么，这种情况下你会遇到一个问题：如果你有意或无意中忘记了 unlock 释放锁，那么锁背后的键值对将会在 Redis 中长期存在！

> 一定要注意
>
> Redisson 看门狗（watch dog）在指定了加锁时间时，是不会对锁时间自动续租的。

在 watch dog 机制中，有一个被 “隐瞒” 的细节：表面上看，你的 lock 方法没有指定锁定时长，但是 Redisson 去 Redis 中添加代表锁的键值对时，它还是添加了自动删除时间。默认 30 秒（可配置）。这意味着，如果，你没有主动 unlock 进行解锁，那么这个代表锁的键值对也会在 30 秒之后被 Redis 自动删除，但是实际上，并没有。这正是因为 Redisson 利用 watch dog 机制对它进行了续期（ 使用 Redis 的 expire 命令重新指定新的过期时间）。也就是内部有一个定时任务，每隔10s会会自动启动定时任务，该任务重新给key续期30s。

### Redisson 执行的 Lua 脚本

1、加锁的LUA脚本

~~~java
if (redis.call('exists', KEYS[1]) == 0) then 
        redis.call('hset', KEYS[1], ARGV[2], 1);
         redis.call('pexpire', KEYS[1], ARGV[1]); 
         return nil;
    end;
if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then
        redis.call('hincrby', KEYS[1], ARGV[2], 1);
        redis.call('pexpire', KEYS[1], ARGV[1]); 
        return nil;
     end;
return redis.call('pttl', KEYS[1]);
~~~

2、解锁的LUA脚本

```lua
if (redis.call('exists', KEYS[1]) == 0) then
       redis.call('publish', KEYS[2], ARGV[1]);
        return 1; 
        end;
if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then 
     return nil;
     end;
local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); 
if (counter > 0) then
     redis.call('pexpire', KEYS[1], ARGV[2]); 
     return 0; 
else redis.call('del', KEYS[1]); 
     redis.call('publish', KEYS[2], ARGV[1]); 
     return 1;
     end;
return nil;
```
