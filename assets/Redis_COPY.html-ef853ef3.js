import{_ as a,p as d,q as l,s as e,t as s,R as n,Y as t,n as r}from"./framework-e1bed10d.js";const o={},c=e("h2",{id:"redis数据结构",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#redis数据结构","aria-hidden":"true"},"#"),n(" Redis数据结构")],-1),u={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221193254400.png",target:"_blank",rel:"noopener noreferrer"},m=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221193254400.png",alt:"image-20221221193254400"},null,-1),v=t(`<h3 id="常用数据结构及命令" tabindex="-1"><a class="header-anchor" href="#常用数据结构及命令" aria-hidden="true">#</a> 常用数据结构及命令</h3><ul><li>字符串常用操作</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SET  key  value 			//存入字符串键值对
MSET  key  value [key value ...] 	//批量存储字符串键值对
SETNX  key  value 		//存入一个不存在的字符串键值对
GET  key 			//获取一个字符串键值
MGET  key  [key ...]	 	//批量获取字符串键值
DEL  key  [key ...] 		//删除一个键
EXPIRE  key  seconds 		//设置一个键的过期时间(秒)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>原子加减</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
INCR  key 			//将key中储存的数字值加1
DECR  key 			//将key中储存的数字值减1
INCRBY  key  increment 		//将key所储存的值加上increment
DECRBY  key  decrement 	//将key所储存的值减去decrement
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>单值缓存</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SET  key  value 	
GET  key 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>对象缓存</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
1) SET  user:1  value(json格式数据)
2) MSET  user:1:name  zhuge   user:1:balance  1888
   MGET  user:1:name   user:1:balance 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>分布式锁</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SETNX  product:10001  true 		//返回1代表获取锁成功
SETNX  product:10001  true 		//返回0代表获取锁失败
。。。执行业务操作
DEL  product:10001			//执行完业务释放锁

SET product:10001 true  ex  10  nx	//防止程序意外终止导致死锁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>计数器</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
INCR article:readcount:{文章id}  	
GET article:readcount:{文章id} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>分布式系统全局序列号</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
INCRBY  orderId  1000		//redis批量生成序列号提升性能
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="hash结构常用操作" tabindex="-1"><a class="header-anchor" href="#hash结构常用操作" aria-hidden="true">#</a> Hash结构常用操作</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
HSET  key  field  value 			//存储一个哈希表key的键值
HSETNX  key  field  value 		//存储一个不存在的哈希表key的键值
HMSET  key  field  value [field value ...] 	//在一个哈希表key中存储多个键值对
HGET  key  field 				//获取哈希表key对应的field键值
HMGET  key  field  [field ...] 		//批量获取哈希表key中多个field键值
HDEL  key  field  [field ...] 		//删除哈希表key中的field键值
HLEN  key				//返回哈希表key中field的数量
HGETALL  key				//返回哈希表key中所有的键值

HINCRBY  key  field  increment 		//为哈希表key中field键的值加上增量increment
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>对象缓存</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
HMSET  user  {userId}:name  zhuge  {userId}:balance  1888
HMSET  user  1:name  zhuge  1:balance  1888
HMGET  user  1:name  1:balance  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19),p={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221194404031.png",target:"_blank",rel:"noopener noreferrer"},g=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221194404031.png",alt:"image-20221221194404031"},null,-1),b=e("ul",null,[e("li",null,[n("优点 "),e("ol",null,[e("li",null,"同类数据归类整合储存，方便数据管理"),e("li",null,"相比string操作消耗内存与cpu更小"),e("li",null,"相比string储存更节省空间")])]),e("li",null,[n("缺点 "),e("ol",null,[e("li",null,"过期功能不能使用在field上，只能用在key上"),e("li",null,"1)Redis集群架构下不适合大规模使用")])])],-1),h={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195006963.png",target:"_blank",rel:"noopener noreferrer"},k=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195006963.png",alt:"image-20221221195006963"},null,-1),y=t(`<h3 id="list常用操作" tabindex="-1"><a class="header-anchor" href="#list常用操作" aria-hidden="true">#</a> List常用操作</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
LPUSH  key  value [value ...] 		//将一个或多个值value插入到key列表的表头(最左边)
RPUSH  key  value [value ...]	 	//将一个或多个值value插入到key列表的表尾(最右边)
LPOP  key			//移除并返回key列表的头元素
RPOP  key			//移除并返回key列表的尾元素
LRANGE  key  start  stop		//返回列表key中指定区间内的元素，区间以偏移量start和stop指定

BLPOP  key  [key ...]  timeout	//从key列表表头弹出一个元素，若列表中没有元素，阻塞等待					timeout秒,如果timeout=0,一直阻塞等待
BRPOP  key  [key ...]  timeout 	//从key列表表尾弹出一个元素，若列表中没有元素，阻塞等待					timeout秒,如果timeout=0,一直阻塞等待
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),_={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195110835.png",target:"_blank",rel:"noopener noreferrer"},f=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195110835.png",alt:"image-20221221195110835"},null,-1),x=t(`<h3 id="set常用操作" tabindex="-1"><a class="header-anchor" href="#set常用操作" aria-hidden="true">#</a> Set常用操作</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SADD  key  member  [member ...]			//往集合key中存入元素，元素存在则忽略，
							若key不存在则新建
SREM  key  member  [member ...]			//从集合key中删除元素
SMEMBERS  key					//获取集合key中所有元素
SCARD  key					//获取集合key的元素个数
SISMEMBER  key  member			//判断member元素是否存在于集合key中
SRANDMEMBER  key  [count]			//从集合key中选出count个元素，元素不从key中删除
SPOP  key  [count]				//从集合key中选出count个元素，元素从key中删除
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Set运算操作</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SINTER  key  [key ...] 				//交集运算
SINTERSTORE  destination  key  [key ..]		//将交集结果存入新集合destination中
SUNION  key  [key ..] 				//并集运算
SUNIONSTORE  destination  key  [key ...]		//将并集结果存入新集合destination中
SDIFF  key  [key ...] 				//差集运算
SDIFFSTORE  destination  key  [key ...]		//将差集结果存入新集合destination中
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>应用-微信抽奖小程序</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
1）点击参与抽奖加入集合
SADD key {userlD}
2）查看参与抽奖所有用户
SMEMBERS key	  
3）抽取count名中奖者
SRANDMEMBER key [count] / SPOP key [count]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),R={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195444202.png",target:"_blank",rel:"noopener noreferrer"},S=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195444202.png",alt:"image-20221221195444202"},null,-1),A=t(`<ul><li>应用-微信微博点赞，收藏，标签</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
1) 点赞
SADD  like:{消息ID}  {用户ID}
2) 取消点赞
SREM like:{消息ID}  {用户ID}
3) 检查用户是否点过赞
SISMEMBER  like:{消息ID}  {用户ID}
4) 获取点赞的用户列表
SMEMBERS like:{消息ID}
5) 获取点赞用户数 
SCARD like:{消息ID}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),E={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195559843.png",target:"_blank",rel:"noopener noreferrer"},F=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195559843.png",alt:"image-20221221195559843"},null,-1),L=e("ul",null,[e("li",null,"集合操作")],-1),O={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195645216.png",target:"_blank",rel:"noopener noreferrer"},I=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221195645216.png",alt:"image-20221221195645216"},null,-1),T=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
SINTER set1 set2 set3 → { c }
SUNION set1 set2 set3 → { a,b,c,d,e }
SDIFF set1 set2 set3 → { a }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="zset常用操作" tabindex="-1"><a class="header-anchor" href="#zset常用操作" aria-hidden="true">#</a> ZSet常用操作</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
ZADD key score member [[score member]…]	//往有序集合key中加入带分值元素
ZREM key member [member …]		//从有序集合key中删除元素
ZSCORE key member 			//返回有序集合key中元素member的分值
ZINCRBY key increment member		//为有序集合key中元素member的分值加上increment 
ZCARD key				//返回有序集合key中元素个数
ZRANGE key start stop [WITHSCORES]	//正序获取有序集合key从start下标到stop下标的元素
ZREVRANGE key start stop [WITHSCORES]	//倒序获取有序集合key从start下标到stop下标的元素
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Zset集合操作</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
ZUNIONSTORE destkey numkeys key [key ...] 	//并集计算
ZINTERSTORE destkey numkeys key [key …]	//交集计算
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),w={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200005028.png",target:"_blank",rel:"noopener noreferrer"},j=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200005028.png",alt:"image-20221221200005028"},null,-1),z=t(`<ul><li>应用-Zset集合操作实现排行榜</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
1）点击新闻
ZINCRBY  hotNews:20190819  1  守护香港
2）展示当日排行前十
ZREVRANGE  hotNews:20190819  0  9  WITHSCORES 
3）七日搜索榜单计算
ZUNIONSTORE  hotNews:20190813-20190819  7 
hotNews:20190813  hotNews:20190814... hotNews:20190819
4）展示七日排行前十
ZREVRANGE hotNews:20190813-20190819  0  9  WITHSCORES
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),C={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200104708.png",target:"_blank",rel:"noopener noreferrer"},H=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200104708.png",alt:"image-20221221200104708"},null,-1),N=e("h2",{id:"redis常讨论的问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#redis常讨论的问题","aria-hidden":"true"},"#"),n(" Redis常讨论的问题")],-1),P=e("ul",null,[e("li",null,"Redis是单线程吗?")],-1),V=e("p",null,"Redis 的单线程主要是指 Redis 的网络 IO 和键值对读写是由一个线程来完成的，这也是 Redis 对外 提供键值存储服务的主要流程。但 Redis 的其他功能，比如持久化、异步删除、集群数据同步等，其实是由额外的线程执行的。",-1),D=e("ul",null,[e("li",null,"Redis 单线程为什么还能这么快?")],-1),M=e("p",null,"因为它所有的数据都在内存中，所有的运算都是内存级别的运算，而且单线程避免了多线程的切换性 能损耗问题。正因为 Redis 是单线程，所以要小心使用 Redis 指令，对于那些耗时的指令(比如 keys)，一定要谨慎使用，一不小心就可能会导致 Redis 卡顿。",-1),B=e("ul",null,[e("li",null,"Redis 单线程如何处理那么多的并发客户端连接?")],-1),J=e("p",null,"Redis的IO多路复用:redis利用epoll来实现IO多路复用，将连接信息和事件放到队列中，依次放到 文件事件分派器，事件分派器将事件分发给事件处理器。",-1),q={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200452552.png",target:"_blank",rel:"noopener noreferrer"},Z=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221221200452552.png",alt:"image-20221221200452552"},null,-1),G=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
# 查看redis支持的最大连接数，在redis.conf文件中可修改，# maxclients 10000 
127.0.0.1:6379&gt;CONFIG GET maxclients
##1) &quot;maxclients&quot;
##2) &quot;10000&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其他高级命令" tabindex="-1"><a class="header-anchor" href="#其他高级命令" aria-hidden="true">#</a> 其他高级命令</h2><p>Info:查看redis服务运行信息，分为 9 大块，每个块都有非常多的参数，这 9 个块分别是:</p><ol><li>Server 服务器运行的环境参数</li><li>Clients 客户端相关信息</li><li>Memory 服务器运行内存统计数据</li><li>Persistence 持久化信息</li><li>Stats 通用统计数据</li><li>Replication 主从复制相关信息</li><li>CPU CPU 使用情况</li><li>Cluster 集群信息</li><li>KeySpace 键值对统计数量信息</li></ol><h2 id="redis持久化" tabindex="-1"><a class="header-anchor" href="#redis持久化" aria-hidden="true">#</a> Redis持久化</h2><h3 id="rdb快照-snapshot" tabindex="-1"><a class="header-anchor" href="#rdb快照-snapshot" aria-hidden="true">#</a> RDB快照(snapshot)</h3><p>在默认情况下， Redis 将内存数据库快照保存在名字为 dump.rdb 的二进制文件中。</p><p>你可以对 Redis 进行设置， 让它在“ N 秒内数据集至少有 M 个改动”这一条件被满足时， 自动保存一次 数据集。 比如说， 以下设置会让 Redis 在满足“ 60 秒内有至少有 1000 个键被改动”这一条件时， 自动保存一次 数据集:</p><p># save 60 1000 //关闭RDB只需要将所有的save保存策略注释掉即可</p><p>还可以手动执行命令生成RDB快照，进入redis客户端执行命令save或bgsave可以生成dump.rdb文件，每次命令执行都会将所有redis内存快照到一个新的rdb文件里，并覆盖原有rdb快照文件。</p><ul><li>bgsave的写时复制(COW)机制</li></ul><p>Redis 借助操作系统提供的写时复制技术(Copy-On-Write, COW)，在生成快照的同时，依然可以正常 处理写命令。简单来说，bgsave 子进程是由主线程 fork 生成的，可以共享主线程的所有内存数据。 bgsave 子进程运行后，开始读取主线程的内存数据，并把它们写入 RDB 文件。此时，如果主线程对这些 数据也都是读操作，那么，主线程和 bgsave 子进程相互不影响。但是，如果主线程要修改一块数据，那 么，这块数据就会被复制一份，生成该数据的副本。然后，bgsave 子进程会把这个副本数据写入 RDB 文 件，而在这个过程中，主线程仍然可以直接修改原来的数据。</p><ul><li>save与bgsave对比:</li></ul><table><thead><tr><th>命令</th><th>save</th><th>bgsave</th></tr></thead><tbody><tr><td>IO类型</td><td>同步</td><td>异步</td></tr><tr><td>是否阻塞redis其它命令</td><td>是</td><td>否(在生成子进程执行调用fork函 数时会有短暂阻塞)</td></tr><tr><td>复杂度</td><td>O(n)</td><td>O(n)</td></tr><tr><td>优点</td><td>不会消耗额外内存</td><td>不阻塞客户端命令</td></tr><tr><td>缺点</td><td>阻塞客户端命令</td><td>需要fork子进程，消耗内存</td></tr></tbody></table><p>配置自动生成rdb文件后台使用的是bgsave方式。</p><h3 id="aof-append-only-file" tabindex="-1"><a class="header-anchor" href="#aof-append-only-file" aria-hidden="true">#</a> AOF(append-only file)</h3><p>快照功能并不是非常耐久(durable): 如果 Redis 因为某些原因而造成故障停机， 那么服务器将丢失最近写入、且仍未保存到快照中的那些数据。从 1.1 版本开始， Redis 增加了一种完全耐久的持久化方 式: AOF 持久化，将修改的每一条指令记录进文件appendonly.aof中(先写入os cache，每隔一段时间 fsync到磁盘)</p><p>比如执行命令“set zhuge 666”，aof文件里会记录如下数据</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
*3
$3
set
$5
zhuge 6 $3
666
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一种resp协议格式数据，星号后面的数字代表命令有多少个参数，$号后面的数字代表这个参数有几 个字符 注意，如果执行带过期时间的set命令，aof文件里记录的是并不是执行的原始命令，而是记录key过期的 时间戳</p><p>比如执行“set goudan 888 ex 1000”，对应aof文件里记录如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
*3
$3
set
$6
goudan 6 $3
888
*3
$9
PEXPIREAT 11 $6
goudan
$13
1604249786301
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以通过修改配置文件来打开 AOF 功能:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># appendonly yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>从现在开始， 每当 Redis 执行一个改变数据集的命令时(比如 SET)， 这个命令就会被追加到 AOF 文件的末尾。</p><p>这样的话， 当 Redis 重新启动时， 程序就可以通过重新执行 AOF 文件中的命令来达到重建数据集的目 的。</p><p>你可以配置 Redis 多久才将数据 fsync 到磁盘一次。有三个选项:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
appendfsync always:每次有新命令追加到 AOF 文件时就执行一次 fsync ，非常慢，也非常安全。 
appendfsync everysec:每秒 fsync 一次，足够快，并且在故障时只会丢失 1 秒钟的数据。
appendfsync no:从不 fsync ，将数据交给操作系统来处理。更快，也更不安全的选择。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>推荐(并且也是默认)的措施为每秒 fsync 一次， 这种 fsync 策略可以兼顾速度和安全性。</p><ul><li>AOF重写</li></ul><p>AOF文件里可能有太多没用指令，所以AOF会定期根据内存的最新数据生成aof文件 例如，执行了如下几条命令:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
incr readcount
(integer)1
incr readcount
(integer)2
incr readcount
(integer)3
incr readcount
(integer)4
incr readcount
(integer)5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重写后AOF文件里变成</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
*3
$3
SET
$2
readcount 6 $1
5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如下两个配置可以控制AOF自动重写频率</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
# auto‐aof‐rewrite‐min‐size 64mb //aof文件至少要达到64M才会自动重写，文件太小恢复速度本来就 很快，重写的意义不大
# auto‐aof‐rewrite‐percentage 100 //aof文件自上一次重写后文件大小增长了100%则再次触发重写
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然AOF还可以手动重写，进入redis客户端执行命令bgrewriteaof重写AOF, 注意，AOF重写redis会fork出一个子进程去做(与bgsave命令类似)，不会对redis正常命令处理有太多 影响</p><p>RDB 和 AOF ，我应该用哪一个?</p><table><thead><tr><th>命令</th><th>RDB</th><th>AOF</th></tr></thead><tbody><tr><td>启动优先级</td><td>低</td><td>高</td></tr><tr><td>体积</td><td>小</td><td>大</td></tr><tr><td>恢复速度</td><td>快</td><td>慢</td></tr><tr><td>数据安全性</td><td>容易丢数据</td><td>根据策略决定</td></tr></tbody></table><p>生产环境可以都启用，redis启动时如果既有rdb文件又有aof文件则优先选择aof文件恢复数据，因为aof 一般来说数据更全一点。</p><h3 id="redis-4-0-混合持久化" tabindex="-1"><a class="header-anchor" href="#redis-4-0-混合持久化" aria-hidden="true">#</a> Redis 4.0 混合持久化</h3><p>重启 Redis 时，我们很少使用 RDB来恢复内存状态，因为会丢失大量数据。我们通常使用 AOF 日志重 放，但是重放 AOF 日志性能相对 RDB来说要慢很多，这样在 Redis 实例很大的情况下，启动需要花费很 长的时间。 Redis 4.0 为了解决这个问题，带来了一个新的持久化选项——混合持久化。 通过如下配置可以开启混合持久化(必须先开启aof):</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># aof‐use‐rdb‐preamble yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果开启了混合持久化，AOF在重写时，不再是单纯将内存数据转换为RESP命令写入AOF文件，而是将 重写这一刻之前的内存做RDB快照处理，并且将RDB快照内容和增量的AOF修改内存数据的命令存在一 起，都写入新的AOF文件，新的文件一开始不叫appendonly.aof，等到重写完新的AOF文件才会进行改 名，覆盖原有的AOF文件，完成新旧两个AOF文件的替换。</p><p>于是在 Redis 重启的时候，可以先加载 RDB 的内容，然后再重放增量 AOF 日志就可以完全替代之前的 AOF 全量文件重放，因此重启效率大幅得到提升。</p><p>混合持久化AOF文件结构如下</p>`,46),U={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222101934799.png",target:"_blank",rel:"noopener noreferrer"},Y=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222101934799.png",alt:"image-20221222101934799"},null,-1),$=e("ul",null,[e("li",null,[n("Redis数据备份策略: "),e("ol",null,[e("li",null,"写crontab定时调度脚本，每小时都copy一份rdb或aof的备份到一个目录中去，仅仅保留最近48 小时的备份"),e("li",null,"每天都保留一份当日的数据备份到一个目录中去，可以保留最近1个月的备份"),e("li",null,"每次copy备份的时候，都把太旧的备份给删了"),e("li",null,"每天晚上将当前机器上的备份复制一份到其他机器上，以防机器损坏")])])],-1),K=e("h2",{id:"redis主从架构",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#redis主从架构","aria-hidden":"true"},"#"),n(" Redis主从架构")],-1),X={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102114645.png",target:"_blank",rel:"noopener noreferrer"},W=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102114645.png",alt:"image-20221222102114645"},null,-1),Q=t(`<p><strong>redis主从架构搭建，配置从节点步骤:</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
1、复制一份redis.conf文件 2
2、将相关配置修改为如下值:
port6380
pidfile /var/run/redis_6380.pid # 把pid进程号写入pidfile配置的文件
logfile&quot;6380.log&quot;
dir /usr/local/redis‐5.0.3/data/6380 # 指定数据存放目录
# 需要注释掉bind
#bind127.0.0.1(bind绑定的是自己机器网卡的ip，如果有多块网卡可以配多个ip，代表允许客户端通 过机器的哪些网卡ip去访问，内网一般可以不配置bind，注释掉即可)
3、配置主从复制
replicaof192.168.0.606379#从本机6379的redis实例复制数据，Redis5.0之前使用slaveof
replica‐read‐only yes # 配置从节点只读
4、启动从节点
redis‐serverredis.conf
5、连接从节点
redis‐cli‐p6380
6、测试在6379实例上写数据，6380实例是否能及时同步新修改数据
7、可以自己再配置一个6381的从节点
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Redis主从工作原理</li></ul><p>如果你为master配置了一个slave，不管这个slave是否是第一次连接上Master，它都会发送一个PSYNC命令给master请求复制数据。 master收到PSYNC命令后，会在后台进行数据持久化通过bgsave生成最新的rdb快照文件，持久化期间，master会继续接收客户端的请求，它会把这些可能修改数据集的请求缓存在内存中。当持久化进行完 毕以后，master会把这份rdb文件数据集发送给slave，slave会把接收到的数据进行持久化生成rdb，然后 再加载到内存中。然后，master再将之前缓存在内存中的命令发送给slave。 当master与slave之间的连接由于某些原因而断开时，slave能够自动重连Master，如果master收到了多 个slave并发连接请求，它只会进行一次持久化，而不是一个连接一次，然后再把这一份持久化的数据发送 给多个并发连接的slave。</p><ul><li>主从复制(全量复制)流程图</li></ul>`,5),ee={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102529412.png",target:"_blank",rel:"noopener noreferrer"},ie=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102529412.png",alt:"image-20221222102529412"},null,-1),se=e("p",null,[e("strong",null,"数据部分复制")],-1),te=e("p",null,"当master和slave断开重连后，一般都会对整份数据进行复制。但从redis2.8版本开始，redis改用可以支 持部分数据复制的命令PSYNC去master同步数据，slave与master能够在网络连接断开重连后只进行部分 数据复制(断点续传)。",-1),ne=e("p",null,"master会在其内存中创建一个复制数据用的缓存队列，缓存最近一段时间的数据，master和它所有的 slave都维护了复制的数据下标offset和master的进程id，因此，当网络连接断开后，slave会请求master 继续进行未完成的复制，从所记录的数据下标开始。如果master进程id变化了，或者从节点数据下标 offset太旧，已经不在master的缓存队列里了，那么将会进行一次全量数据的复制。",-1),ae=e("ul",null,[e("li",null,"主从复制(部分复制，断点续传)流程图")],-1),de={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102657214.png",target:"_blank",rel:"noopener noreferrer"},le=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102657214.png",alt:"image-20221222102657214"},null,-1),re=e("p",null,"如果有很多从节点，为了缓解主从复制风暴(多个从节点同时复制主节点导致主节点压力过大)，可以做如 下架构，让部分从节点与从节点(与主节点同步)同步数据",-1),oe={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102728607.png",target:"_blank",rel:"noopener noreferrer"},ce=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222102728607.png",alt:"image-20221222102728607"},null,-1),ue=t(`<h2 id="jedis连接代码示例" tabindex="-1"><a class="header-anchor" href="#jedis连接代码示例" aria-hidden="true">#</a> Jedis连接代码示例</h2><ol><li><p>引入相关依赖:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>XML
&lt;dependency&gt;
  &lt;groupId&gt;redis.clients&lt;/groupId&gt;
  &lt;artifactId&gt;jedis&lt;/artifactId&gt;
  &lt;version&gt;2.9.0&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问代码:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public static void main(String[] args) {
  JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
  jedisPoolConfig.setMaxTotal(20);
  jedisPoolConfig.setMaxIdle(10);
  jedisPoolConfig.setMinIdle(5);
  // timeout，这里既是连接超时又是读写超时，从Jedis 2.8开始有区分connectionTimeout和soTimeot的构造函数
  JedisPool jedisPool = new JedisPool(jedisPoolConfig, &quot;test-hfin.rdb.58dns.org&quot;, 50356, 3000, &quot;xxxxxxxx&quot;);
  Jedis jedis;

  //从redis连接池里拿出一个连接执行命令
  jedis = jedisPool.getResource();
  System.out.println(jedis.set(&quot;single&quot;, &quot;苟蛋&quot;));
  System.out.println(jedis.get(&quot;single&quot;));
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="redis哨兵高可用架构" tabindex="-1"><a class="header-anchor" href="#redis哨兵高可用架构" aria-hidden="true">#</a> Redis哨兵高可用架构</h2>`,3),me={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222104848999.png",target:"_blank",rel:"noopener noreferrer"},ve=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222104848999.png",alt:"image-20221222104848999"},null,-1),pe=t(`<p>sentinel哨兵是特殊的redis服务，不提供读写服务，主要用来监控redis实例节点。</p><p>哨兵架构下client端第一次从哨兵找出redis的主节点，后续就直接访问redis的主节点，不会每次都通过 sentinel代理访问redis的主节点，当redis的主节点发生变化，哨兵会第一时间感知到，并且将新的redis 主节点通知给client端(这里面redis的client端一般都实现了订阅功能，订阅sentinel发布的节点变动消息)</p><ul><li>redis哨兵架构搭建步骤:</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
1、复制一份sentinel.conf文件
cpsentinel.confsentinel‐26379.conf
2、将相关配置修改为如下值:
port 26379
daemonize yes
pidfile &quot;/var/run/redis‐sentinel‐26379.pid&quot;
logfile &quot;26379.log&quot;
dir &quot;/usr/local/redis‐5.0.3/data&quot;
# sentinel monitor &lt;master‐redis‐name&gt; &lt;master‐redis‐ip&gt; &lt;master‐redis‐port&gt; &lt;quorum&gt;
# quorum是一个数字，指明当有多少个sentinel认为一个master失效时(值一般为:sentinel总数/2+ 1)，master才算真正失效
sentinel monitor mymaster 192.168.0.606379 2 #mymaster这个名字随便取，客户端访问时会用 到
3、启动sentinel哨兵实例
src/redis‐sentinelsentinel‐26379.conf
4、查看sentinel的info信息
src/redis‐cli ‐p 26379
127.0.0.1:26379&gt;info
可以看到Sentinel的info里已经识别出了redis的主从
5、可以自己再配置两个sentinel，端口26380和26381，注意上述配置文件里的对应数字都要修改
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>sentinel集群都启动完毕后，会将哨兵集群的元数据信息写入所有sentinel的配置文件里去(追加在文件的 最下面)，我们查看下如下配置文件sentinel-26379.conf，如下所示</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
sentinelknown‐replica mymaster 192.168.0.606380 #代表redis主节点的从节点信息
sentinelknown‐replica mymaster 192.168.0.606381 #代表redis主节点的从节点信息
sentinelknown‐sentinel mymaster 192.168.0.6026380 52d0a5d70c1f90475b4fc03b6ce7c3c569 35760f #代表感知到的其它哨兵节点
sentinelknown‐sentinel mymaster 192.168.0.6026381 e9f530d3882f8043f76ebb8e1686438ba8 bd5ca6 #代表感知到的其它哨兵节点
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当redis主节点如果挂了，哨兵集群会重新选举出新的redis主节点，同时会修改所有sentinel节点配置文件 的集群元数据信息，比如6379的redis如果挂了，假设选举出的新主节点是6380，则sentinel文件里的集 群元数据信息会变成如下所示:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
sentinelknown‐replica mymaster 192.168.0.606379 #代表主节点的从节点信息
sentinelknown‐replica mymaster 192.168.0.606381 #代表主节点的从节点信息
sentinelknown‐sentinel mymaster 192.168.0.6026380 52d0a5d70c1f90475b4fc03b6ce7c3c569 35760f #代表感知到的其它哨兵节点
sentinelknown‐sentinel mymaster 192.168.0.6026381 e9f530d3882f8043f76ebb8e1686438ba8 bd5ca6 #代表感知到的其它哨兵节点
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时还会修改sentinel文件里之前配置的mymaster对应的6379端口，改为6380</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sentinel monitor mymaster 192.168.0.60 6380 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当6379的redis实例再次启动时，哨兵集群根据集群元数据信息就可以将6379端口的redis节点作为从节点 加入集群</p><h2 id="spring-boot整合redis连接" tabindex="-1"><a class="header-anchor" href="#spring-boot整合redis连接" aria-hidden="true">#</a> Spring Boot整合Redis连接</h2><h3 id="redistemplate" tabindex="-1"><a class="header-anchor" href="#redistemplate" aria-hidden="true">#</a> RedisTemplate</h3><ul><li>StringRedisTemplate与RedisTemplate详解</li></ul><p>spring 封装了 RedisTemplate 对象来进行对redis的各种操作，它支持所有的 redis 原生的 api。在 RedisTemplate中提供了几个常用的接口方法的使用，分别是:</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token constant">JAVA</span>
privateValueOperations<span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span>valueOps<span class="token punctuation">;</span> 
privateHashOperations<span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span>hashOps<span class="token punctuation">;</span>
privateListOperations<span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span>listOps<span class="token punctuation">;</span>
privateSetOperations<span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span>setOps<span class="token punctuation">;</span>
privateZSetOperations<span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span>zSetOps<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>RedisTemplate中定义了对5种数据结构操作</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token constant">JAVA</span>
redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//操作字符串</span>
redisTemplate<span class="token punctuation">.</span><span class="token function">opsForHash</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//操作hash</span>
redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//操作list</span>
redisTemplate<span class="token punctuation">.</span><span class="token function">opsForSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//操作set</span>
redisTemplate<span class="token punctuation">.</span><span class="token function">opsForZSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//操作有序set</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>StringRedisTemplate继承自RedisTemplate，也一样拥有上面这些操作。</p><p>StringRedisTemplate默认采用的是String的序列化策略，保存的key和value都是采用此策略序列化保存 的。</p><p>RedisTemplate默认采用的是JDK的序列化策略，保存的key和value都是采用此策略序列化保存的。</p><ul><li>Redis客户端命令对应的RedisTemplate中的方法列表</li></ul><h3 id="string类型结构" tabindex="-1"><a class="header-anchor" href="#string类型结构" aria-hidden="true">#</a> String类型结构</h3><table><thead><tr><th>String类型结构</th><th></th></tr></thead><tbody><tr><td><strong>Redis</strong></td><td><strong>RedisTemplate rt</strong></td></tr><tr><td>set key value</td><td>rt.opsForValue().set(“key”,”value”)</td></tr><tr><td>get key</td><td>rt.opsForValue().get(“key”)</td></tr><tr><td>del key</td><td>rt.delete(“key”)</td></tr><tr><td>strlen key</td><td>rt.opsForValue().size(“key”)</td></tr><tr><td>getset key value</td><td>rt.opsForValue().getAndSet(“key”,”value”)</td></tr><tr><td>getrange key start end</td><td>rt.opsForValue().get(“key”,start,end)</td></tr><tr><td>append key value</td><td>rt.opsForValue().append(“key”,”value”)</td></tr></tbody></table><h3 id="hash结构" tabindex="-1"><a class="header-anchor" href="#hash结构" aria-hidden="true">#</a> Hash结构</h3><table><thead><tr><th><strong>Hash结构</strong></th><th></th></tr></thead><tbody><tr><td>hmset key field1 value1 field2 value2…</td><td>rt.opsForHash().putAll(“key”,map) //map是一个集合对象</td></tr><tr><td>hset key field value</td><td>rt.opsForHash().put(“key”,”field”,”value”)</td></tr><tr><td>hexists key field</td><td>rt.opsForHash().hasKey(“key”,”field”)</td></tr><tr><td>hgetall key</td><td>rt.opsForHash().entries(“key”) //返回Map对象</td></tr><tr><td>hvals key</td><td>rt.opsForHash().values(“key”) //返回List对象</td></tr><tr><td>hkeys key</td><td>rt.opsForHash().keys(“key”) //返回List对象</td></tr><tr><td>hmget key field1 field2…</td><td>rt.opsForHash().multiGet(“key”,keyList)</td></tr><tr><td>hsetnx key field value</td><td>rt.opsForHash().putIfAbsent(“key”,”field”,”value”</td></tr><tr><td>hdel key field1 field2</td><td>rt.opsForHash().delete(“key”,”field1”,”field2”)</td></tr><tr><td>hget key field</td><td>rt.opsForHash().get(“key”,”field”)</td></tr></tbody></table><h3 id="list结构" tabindex="-1"><a class="header-anchor" href="#list结构" aria-hidden="true">#</a> List结构</h3><table><thead><tr><th><strong>List结构</strong></th><th></th></tr></thead><tbody><tr><td>lpush list node1 node2 node3…</td><td>rt.opsForList().leftPush(“list”,”node”)</td></tr><tr><td></td><td>rt.opsForList().leftPushAll(“list”,list) //list是集合对象</td></tr><tr><td>rpush list node1 node2 node3…</td><td>rt.opsForList().rightPush(“list”,”node”)</td></tr><tr><td></td><td>rt.opsForList().rightPushAll(“list”,list) //list是集合对象</td></tr><tr><td>lindex key index</td><td>rt.opsForList().index(“list”, index)</td></tr><tr><td>llen key</td><td>rt.opsForList().size(“key”)</td></tr><tr><td>lpop key</td><td>rt.opsForList().leftPop(“key”)</td></tr><tr><td>rpop key</td><td>rt.opsForList().rightPop(“key”)</td></tr><tr><td>lpushx list node</td><td>rt.opsForList().leftPushIfPresent(“list”,”node”)</td></tr><tr><td>rpushx list node</td><td>rt.opsForList().rightPushIfPresent(“list”,”node”)</td></tr><tr><td>lrange list start end</td><td>rt.opsForList().range(“list”,start,end)</td></tr><tr><td>lrem list count value</td><td>rt.opsForList().remove(“list”,count,”value”)</td></tr><tr><td>lset key index value</td><td>rt.opsForList().set(“list”,index,”value”)</td></tr></tbody></table><h3 id="set结构" tabindex="-1"><a class="header-anchor" href="#set结构" aria-hidden="true">#</a> Set结构</h3><table><thead><tr><th><strong>Set结构</strong></th><th></th></tr></thead><tbody><tr><td>sadd key member1 member2…</td><td>rt.boundSetOps(“key”).add(“member1”,”member2”,…)</td></tr><tr><td></td><td>rt.opsForSet().add(“key”, set) //set是一个集合对象</td></tr><tr><td>scard key</td><td>rt.opsForSet().size(“key”)</td></tr><tr><td>sidff key1 key2</td><td>rt.opsForSet().difference(“key1”,”key2”) //返回一个集合对象</td></tr><tr><td>sinter key1 key2</td><td>rt.opsForSet().intersect(“key1”,”key2”)//同上</td></tr><tr><td>sunion key1 key2</td><td>rt.opsForSet().union(“key1”,”key2”)//同上</td></tr><tr><td>sdiffstore des key1 key2</td><td>rt.opsForSet().differenceAndStore(“key1”,”key2”,”des”)</td></tr><tr><td>sinter des key1 key2</td><td>rt.opsForSet().intersectAndStore(“key1”,”key2”,”des”)</td></tr><tr><td>sunionstore des key1 key2</td><td>rt.opsForSet().unionAndStore(“key1”,”key2”,”des”)</td></tr><tr><td>sismember key member</td><td>rt.opsForSet().isMember(“key”,”member”)</td></tr><tr><td>smembers key</td><td>rt.opsForSet().members(“key”)</td></tr><tr><td>spop key</td><td>rt.opsForSet().pop(“key”)</td></tr><tr><td>srandmember key count</td><td>rt.opsForSet().randomMember(“key”,count)</td></tr><tr><td>srem key member1 member2…</td><td>rt.opsForSet().remove(“key”,”member1”,”member2”,…)</td></tr></tbody></table><h2 id="高可用集群模式" tabindex="-1"><a class="header-anchor" href="#高可用集群模式" aria-hidden="true">#</a> 高可用集群模式</h2><p>在redis3.0以前的版本要实现集群一般是借助哨兵sentinel工具来监控master节点的状态，如果master节点异 常，则会做主从切换，将某一台slave作为master，哨兵的配置略微复杂，并且性能和高可用性等各方面表现 一般，特别是在主从切换的瞬间存在访问瞬断的情况，而且哨兵模式只有一个主节点对外提供服务，没法支持 很高的并发，且单个主节点内存也不宜设置得过大，否则会导致持久化文件过大，影响数据恢复或主从同步的 效率</p>`,32),ge={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113452326.png",target:"_blank",rel:"noopener noreferrer"},be=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113452326.png",alt:"image-20221222113452326"},null,-1),he=t('<p>redis集群是一个由多个主从节点群组成的分布式服务器群，它具有复制、高可用和分片特性。Redis集群不需 要sentinel哨兵∙也能完成节点移除和故障转移的功能。需要将每个节点设置成集群模式，这种集群模式没有中 心节点，可水平扩展，据官方文档称可以线性扩展到上万个节点(官方推荐不超过1000个节点)。redis集群的 性能和高可用性均优于之前版本的哨兵模式，且集群配置非常简单</p><h3 id="redis集群原理分析" tabindex="-1"><a class="header-anchor" href="#redis集群原理分析" aria-hidden="true">#</a> Redis集群原理分析</h3><p>Redis Cluster 将所有数据划分为 16384 个 slots(槽位)，每个节点负责其中一部分槽位。槽位的信息存储于每 个节点中。</p><p>当 Redis Cluster 的客户端来连接集群时，它也会得到一份集群的槽位配置信息并将其缓存在客户端本地。这 样当客户端要查找某个 key 时，可以直接定位到目标节点。同时因为槽位的信息可能会存在客户端与服务器不 一致的情况，还需要纠正机制来实现槽位信息的校验调整。</p><ul><li>槽位定位算法</li></ul><p>Cluster 默认会对 key 值使用 crc16 算法进行 hash 得到一个整数值，然后用这个整数值对 16384 进行取模 来得到具体槽位。 <code>HASH_SLOT = CRC16(key) mod 16384</code></p><ul><li>跳转重定位</li></ul><p>当客户端向一个错误的节点发出了指令，该节点会发现指令的 key 所在的槽位并不归自己管理，这时它会向客 户端发送一个特殊的跳转指令携带目标操作的节点地址，告诉客户端去连这个节点去获取数据。客户端收到指 令后除了跳转到正确的节点上去操作，还会同步更新纠正本地的槽位映射表缓存，后续所有 key 将使用新的槽 位映射表。</p>',8),ke={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113735483.png",target:"_blank",rel:"noopener noreferrer"},ye=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113735483.png",alt:"image-20221222113735483"},null,-1),_e=e("ul",null,[e("li",null,"Redis集群节点间的通信机制")],-1),fe=e("p",null,"redis cluster节点间采取gossip协议进行通信",-1),xe=e("p",null,"维护集群的元数据(集群节点信息，主从角色，节点数量，各节点共享的数据等)有两种方式:集中式和gossip",-1),Re=e("ul",null,[e("li",null,"集中式:")],-1),Se=e("p",null,"优点在于元数据的更新和读取，时效性非常好，一旦元数据出现变更立即就会更新到集中式的存储中，其他节 点读取的时候立即就可以立即感知到;不足在于所有的元数据的更新压力全部集中在一个地方，可能导致元数 据的存储压力。 很多中间件都会借助zookeeper集中式存储元数据。",-1),Ae=e("ul",null,[e("li",null,"gossip:")],-1),Ee={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113909341.png",target:"_blank",rel:"noopener noreferrer"},Fe=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222113909341.png",alt:"image-20221222113909341"},null,-1),Le=t(`<p>gossip协议包含多种消息，包括ping，pong，meet，fail等等。</p><ul><li>meet:某个节点发送meet给新加入的节点，让新节点加入集群中，然后新节点就会开始与其他节点进行通 信;</li><li>ping:每个节点都会频繁给其他节点发送ping，其中包含自己的状态还有自己维护的集群元数据，互相通过 ping交换元数据(类似自己感知到的集群节点增加和移除，hash slot信息等);</li><li>pong: 对ping和meet消息的返回，包含自己的状态和其他信息，也可以用于信息广播和更新;</li><li>fail: 某个节点判断另一个节点fail之后，就发送fail给其他节点，通知其他节点，指定的节点宕机了。</li></ul><p>gossip协议的优点在于元数据的更新比较分散，不是集中在一个地方，更新请求会陆陆续续，打到所有节点上 去更新，有一定的延时，降低了压力;缺点在于元数据更新有延时可能导致集群的一些操作会有一些滞后。</p><p>gossip通信的10000端口 每个节点都有一个专门用于节点间gossip通信的端口，就是自己提供服务的端口号+10000，比如7001，那么 用于节点间通信的就是17001端口。 每个节点每隔一段时间都会往另外几个节点发送ping消息，同时其他几 点接收到ping消息之后返回pong消息。</p><ul><li>网络抖动</li></ul><p>真实世界的机房网络往往并不是风平浪静的，它们经常会发生各种各样的小问题。比如网络抖动就是非常常见 的一种现象，突然之间部分连接变得不可访问，然后很快又恢复正常。</p><p>为解决这种问题，Redis Cluster 提供了一种选项<code>cluster-­node­-timeout</code>，表示当某个节点持续 timeout 的时间失联时，才可以认定该节点出现故障，需要进行主从切换。如果没有这个选项，网络抖动会导致主从频 繁切换 (数据的重新复制)。</p><h3 id="redis集群选举原理分析" tabindex="-1"><a class="header-anchor" href="#redis集群选举原理分析" aria-hidden="true">#</a> Redis集群选举原理分析</h3><p>当slave发现自己的master变为FAIL状态时，便尝试进行Failover，以期成为新的master。由于挂掉的master 可能会有多个slave，从而存在多个slave竞争成为master节点的过程， 其过程如下:</p><ol><li>slave发现自己的master变为FAIL</li><li>将自己记录的集群currentEpoch加1，并广播FAILOVER_AUTH_REQUEST 信息</li><li>其他节点收到该信息，只有master响应，判断请求者的合法性，并发送FAILOVER_AUTH_ACK，对每一个 epoch只发送一次ack</li><li>尝试failover的slave收集master返回的FAILOVER_AUTH_ACK</li><li>slave收到超过半数master的ack后变成新Master(这里解释了集群为什么至少需要三个主节点，如果只有两 个，当其中一个挂了，只剩一个主节点是不能选举成功的)</li><li>slave广播Pong消息通知其他集群节点。</li></ol><p>从节点并不是在主节点一进入 FAIL 状态就马上尝试发起选举，而是有一定延迟，一定的延迟确保我们等待 FAIL状态在集群中传播，slave如果立即尝试选举，其它masters或许尚未意识到FAIL状态，可能会拒绝投票 •延迟计算公式:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELAY = 500ms + random(0 ~ 500ms) + SLAVE_RANK * 1000ms
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>SLAVE_RANK表示此slave已经从master复制数据的总量的rank。Rank越小代表已复制的数据越新。这种方 式下，持有最新数据的slave将会首先发起选举(理论上)。</p><h4 id="集群脑裂数据丢失问题" tabindex="-1"><a class="header-anchor" href="#集群脑裂数据丢失问题" aria-hidden="true">#</a> 集群脑裂数据丢失问题</h4><p>redis集群没有过半机制会有脑裂问题，网络分区导致脑裂后多个主节点对外提供写服务，一旦网络分区恢复， 会将其中一个主节点变为从节点，这时会有大量数据丢失。</p><p>规避方法可以在redis配置里加上参数(这种方法不可能百分百避免数据丢失，参考集群leader选举机制):</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
min‐replicas‐to‐write 1 //写数据成功最少同步的slave数量，这个数量可以模仿大于半数机制配置，比如 集群总共三个节点可以配置1，加上leader就是2，超过了半数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>注意:这个配置在一定程度上会影响集群的可用性，比如slave要是少于1个，这个集群就算leader正常也不能 提供服务了，需要具体场景权衡选择。</p><ul><li>集群是否完整才能对外提供服务</li></ul><p>当redis.conf的配置cluster-require-full-coverage为no时，表示当负责一个插槽的主库下线且没有相应的从 库进行故障恢复时，集群仍然可用，如果为yes则集群不可用。</p><ul><li>Redis集群为什么至少需要三个master节点，并且推荐节点数为奇数?</li></ul><p>因为新master的选举需要大于半数的集群master节点同意才能选举成功，如果只有两个master节点，当其中 一个挂了，是达不到选举新master的条件的。</p><p>奇数个master节点可以在满足选举该条件的基础上节省一个节点，比如三个master节点和四个master节点的 集群相比，大家如果都挂了一个master节点都能选举新master节点，如果都挂了两个master节点都没法选举 新master节点了，所以奇数的master节点更多的是从节省机器资源角度出发说的。</p><ul><li>Redis集群对批量操作命令的支持</li></ul><p>对于类似mset，mget这样的多个key的原生批量操作命令，redis集群只支持所有key落在同一slot的情况，如 果有多个key一定要用mset命令在redis集群上操作，则可以在key的前面加上{XX}，这样参数数据分片hash计 算的只会是大括号里的值，这样能确保不同的key能落到同一slot里去，示例如下:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
mset{user1}:1:name goudan{user1}:1:age18
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>假设name和age计算的hash slot值不一样，但是这条命令在集群下执行，redis只会用大括号里的 user1 做 hash slot计算，所以算出来的slot值肯定相同，最后都能落在同一slot。</p><h4 id="哨兵leader选举流程" tabindex="-1"><a class="header-anchor" href="#哨兵leader选举流程" aria-hidden="true">#</a> 哨兵leader选举流程</h4><p>当一个master服务器被某sentinel视为下线状态后，该sentinel会与其他sentinel协商选出sentinel的leader进 行故障转移工作。每个发现master服务器进入下线的sentinel都可以要求其他sentinel选自己为sentinel的 leader，选举是先到先得。同时每个sentinel每次选举都会自增配置纪元(选举周期)，每个纪元中只会选择一 个sentinel的leader。如果所有超过一半的sentinel选举某sentinel作为leader。之后该sentinel进行故障转移 操作，从存活的slave中选举出新的master，这个选举过程跟集群的master选举很类似。 哨兵集群只有一个哨兵节点，redis的主从也能正常运行以及选举master，如果master挂了，那唯一的那个哨 兵节点就是哨兵leader了，可以正常选举新master。不过为了高可用一般都推荐至少部署三个哨兵节点。为什么推荐奇数个哨兵节点原理跟集群奇数个master节点 类似。</p><h2 id="redis-6-0新特性" tabindex="-1"><a class="header-anchor" href="#redis-6-0新特性" aria-hidden="true">#</a> redis 6.0新特性</h2><ol><li>多线程</li><li>Client Side Cache</li><li>Acls</li></ol><h3 id="多线程" tabindex="-1"><a class="header-anchor" href="#多线程" aria-hidden="true">#</a> 多线程</h3><p>redis 6.0 提供了多线程的支持，redis 6 以前的版本，严格来说也是多线程，只不过执行用户 命令的请求时单线程模型，还有一些线程用来执行后台任务， 比如 unlink 删除 大key，rdb持久 化等。</p><p>redis 6.0 提供了多线程的读写IO, 但是最终执行用户命令的线程依然是单线程的，这样，就没有 多线程数据的竞争关系，依然很高效。</p><ul><li>redis 6.0 线程执行模式:</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
# 可以通过如下参数配置多线程模型: 如:
io‐threads 4 # 这里说 有三个IO 线程，还有一个线程是main线程，main线程负责IO读写和 命令执行操作
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,36),Oe={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115015124.png",target:"_blank",rel:"noopener noreferrer"},Ie=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115015124.png",alt:"image-20221222115015124"},null,-1),Te=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
# 开启了如下参数:
io‐threads‐do‐reads yes # 将支持IO线程执行 读写任务。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),we={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115101641.png",target:"_blank",rel:"noopener noreferrer"},je=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115101641.png",alt:"image-20221222115101641"},null,-1),ze=e("h3",{id:"client-side-caching",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#client-side-caching","aria-hidden":"true"},"#"),n(" client side caching")],-1),Ce=e("p",null,"客户端缓存:redis 6 提供了服务端追踪key的变化，客户端缓存数据的特性，这需要客户端实现",-1),He={href:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115141327.png",target:"_blank",rel:"noopener noreferrer"},Ne=e("img",{src:"https://raw.githubusercontent.com/lizejiao/img_bed/master/images/image-20221222115141327.png",alt:"image-20221222115141327"},null,-1),Pe=t(`<p>执行流程为， 当客户端访问某个key时，服务端将记录key 和 client ，客户端拿到数据后，进行 客户端缓存，这时，当key再次被访问时，key将被直接返回，避免了与redis 服务器的再次交 互，节省服务端资源，当数据被其他请求修改时，服务端将主动通知客户端失效的key，客户端 进行本地失效，下次请求时，重新获取最新数据。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>XML
&lt;!-- 目前只有lettuce对其进行了支持:--&gt;
&lt;dependency&gt;
  &lt;groupId&gt;io.lettuce&lt;/groupId&gt;
  &lt;artifactId&gt;lettuce‐core&lt;/artifactId&gt; 
  &lt;version&gt;6.0.0.RELEASE&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="acl" tabindex="-1"><a class="header-anchor" href="#acl" aria-hidden="true">#</a> ACL</h3><p>ACL 是对于命令的访问和执行权限的控制，默认情况下，可以有执行任意的指令，兼容以前版 本</p><p>ACL设置有两种方式:</p><ol><li>命令方式:ACL SETUSER + 具体的权限规则， 通过 ACL SAVE 进行持久化</li><li>对 ACL 配置文件进行编写，并且执行 ACL LOAD 进行加载</li></ol><p>ACL存储有两种方式，但是两种方式不能同时配置，否则直接报错退出进程</p><ol><li>redis 配置文件: redis.conf</li><li>ACL配置文件, 在redis.conf 中通过 aclfile /path 配置acl文件的路径</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
# 命令方式:
ACL SETUSER alice # 创建一个 用户名为 alice的用户
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用如上的命令创建的用户语义为:</p><ol><li>处于 off 状态， 它是被禁用的，不能用auth进行认证</li><li>不能访问任何命令</li><li>不能访问任意的key</li><li>没有密码</li></ol><p>如上用户alice 没有任何意义。</p>`,12);function Ve(De,Me){const i=r("ExternalLinkIcon");return d(),l("div",null,[c,e("p",null,[e("a",u,[m,s(i)])]),v,e("p",null,[e("a",p,[g,s(i)])]),b,e("p",null,[e("a",h,[k,s(i)])]),y,e("p",null,[e("a",_,[f,s(i)])]),x,e("p",null,[e("a",R,[S,s(i)])]),A,e("p",null,[e("a",E,[F,s(i)])]),L,e("p",null,[e("a",O,[I,s(i)])]),T,e("p",null,[e("a",w,[j,s(i)])]),z,e("p",null,[e("a",C,[H,s(i)])]),N,P,V,D,M,B,J,e("p",null,[e("a",q,[Z,s(i)])]),G,e("p",null,[e("a",U,[Y,s(i)])]),$,K,e("p",null,[e("a",X,[W,s(i)])]),Q,e("p",null,[e("a",ee,[ie,s(i)])]),se,te,ne,ae,e("p",null,[e("a",de,[le,s(i)])]),re,e("p",null,[e("a",oe,[ce,s(i)])]),ue,e("p",null,[e("a",me,[ve,s(i)])]),pe,e("p",null,[e("a",ge,[be,s(i)])]),he,e("p",null,[e("a",ke,[ye,s(i)])]),_e,fe,xe,Re,Se,Ae,e("p",null,[e("a",Ee,[Fe,s(i)])]),Le,e("p",null,[n("默认情况下，如上配置，有三个IO线程， 这三个IO线程只会执行 IO中的write 操作，也就是说， read 和 命令执行 都由main线程执行。最后多线程将数据写回到客户端。"),e("a",Oe,[Ie,s(i)])]),Te,e("p",null,[e("a",we,[je,s(i)])]),ze,Ce,e("p",null,[e("a",He,[Ne,s(i)])]),Pe])}const Je=a(o,[["render",Ve],["__file","Redis_COPY.html.vue"]]);export{Je as default};
