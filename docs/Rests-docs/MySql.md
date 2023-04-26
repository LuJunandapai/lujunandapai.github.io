---
title: MySql 数据库
date: 2023/04/26
---



# MySql_数据库

* DDL(数据定义语言):数据库结构和表结构的增删改查
* DML(数据操作语言):表数据的增删改
* DQL(数据查询语言):表数据的查询
* DCL(数据控制语言):数据库的权限控制

## 数据库防坑

> 数据库版本 分组报错

报错信息:    Expression #3 of SELECT list is not in GROUP BY clause and contains nonaggre

```sql
-- 删除 sql_mode = ONLY_FULL_GROUP_BY 这个设置
select @@global.sql_mode;
select version(),
@@sql_mode;SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
# 修改全局
set @@global.sql_mode = '';
set @@global.sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
# 修改当前
set @@sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 方法二: 在mysql配置文件 my.ini 添加下面配置  最后再服务重启mysql即可
sql_mode = STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

```ini
[mysqld]
## 设置server_id，同一局域网中需要唯一
server_id=103
port=3306
basedir=C:\JavaFiles\mysql-8.0.19-winx64 # 这里替换成你自己的解压目录即可
datadir=C:\JavaFiles\mysql-8.0.19-winx64\data   # 存储数据的文件
max_connections=200
max_connect_errors=10
character-set-server=UTF8MB4
default-storage-engine=INNODB
default_authentication_plugin=mysql_native_password
sql_mode = STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

[mysql]
default-character-set=UTF8MB4
default-character-set=utf8

[client]
port=3306
default-character-set=utf8
```





# 数据库_索引

## 索引简介

MySQL官方对索引的定义为：索引（Index）是帮助MySQL高效获取数据的数据结构。索引的本质：索引是数据结构。

```
注：在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据，这样就可以在这些数据结构上实现高级查找算法。这种数据结构，就是索引。你可以简单理解为“排好序的快速查找数据结构。
```

## 存储位置和文件结构

一般来说索引本身也很大，**不可能存储在内存中，因此索引往往以文件形式存储在硬盘上**

索引文件结构：hash、二叉树、B树、B+树

其中**聚簇索引，次要索引，覆盖索引，复合索引，前缀索引，唯一索引默认都是使用B+树索引文件结构**， memory的存储引擎使用的是hash结构

## 索引优势和劣势

```
优势：
1）类似大学图书馆建书目索引，提高数据检索效率，降低数据库的IO成本
2）通过索引列对数据进行排序，降低数据排序成本，降低了CPU的消耗

劣势：
1）虽然索引大大提高了查询速度，同时却会降低更新表的速度,如果对表INSERT,UPDATE和DELETE。因为更新表时，MySQL不仅要修改存数据，还要保存一下索引文件每次更新添加了索引列的字段，都会调整因为更新所带来的键值变化后的索引信息
2）索引只是提高效率的一个因素，如果你的MySQL有大数据量的表，就需要花时间研究建立优秀的索引，或优化查询语句
```

## mysql的索引文件

> 在msql5.6版本中，如果是MyIsam引擎：那么一个表有三个文件，

如：C:\dev\mysql\data\mysql\下的columns_priv表，就有columns_priv.frm（表结构文件），columns_priv.MYD（表数据文件），columns_priv.MYI（表索引文件）	 

在msql5.6版本中，如果是InnoDB引擎：对于每一个表，都有一个xxx.frm的表结构文件和xxx.ibd的文件，这个xxx.ibd文件就是存放表的数据和表的索引的文件，也就是表的索引文件和数据文件保存到了一个文件中，注意：xxx.ibd文件默认是隐藏的，如：C:\ProgramData\MySQL\MySQL Server 5.5\data\hospital目录里面我们只能看到hospital库的表的结构文件，看不到ibd文件。

~~~mysql
show variables like '%per_table%'   #可以发现默认是off
set @@global.innodb_file_per_table=on;
~~~

另外在mysql8的版本中，show variables like '%per_table%'默认是on，另外在myql8中，并不单独提供xxx.frm表结构文件，而是合并在xxx.ibd文件中，Oracle官方将frm文件的信息以及更多信息移动到叫做序列化字典（SDI），SDI倍写在ibd文件内部



# 索引 结构 语法 分类

## 索引结构

### BTREE树结构

### hash结构

> 是指使用某种哈希函数实现key->value 映射的索引结构

```
Hash索引只有 Memory, NDB两种引擎支持，Memory引擎默认支持Hash索引，如果多个hash值相同，出现哈希碰撞，那么索引以链表方式存储。NoSql采用此中索引结构。由于HASH的唯一（几乎100%的唯一）及类似键值对的形式，很适合作为索引。HASH索引可以一次定位，不需要像树形索引那样逐层查找,因此具有极高的效率。但是，这种高效是有条件的，即只在“=”和“in”条件下高效，对于范围查询、排序及组合索引仍然效率不高。

因此，哈希索引适用于等值检索，通过一次哈希计算即可定位数据的位置
```

![image-20210706194207799](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210706194207799.png) 



### full-text全文索引

> 全文索引（也称全文检索）是目前搜索引擎使用的一种关键技术。它能够利用【分词技术】等多种算法智能分析出文本文字中关键词的频率和重要性，然后按照一定的算法规则智能地筛选出我们想要的搜索结果

**全文索引用match+against方式查询：**

* 不同于like方式的的查询：SELECT * FROM article WHERE content LIKE ‘%查询字符串%’;

* SELECT * FROM article WHERE MATCH(title,content) AGAINST (‘查询字符串’); 明显的提高查询效率。它的出现是为了解决WHERE name LIKE “%word%"这类针对文本的模糊查询效率较低的问题。

```
注意：mysql5.6.4以前只有Myisam支持，5.6.4版本以后innodb才支持，但是官方版本不支持中文分词，需要第三方分词插件。5.7以后官方支持中文分词。随着大数据时代的到来，关系型数据库应对全文索引的需求已力不从心，逐渐被 solr,elasticSearch等专门的搜索引擎所替代。在全文检索中，又分正排索引和倒排索引，也就是说正排索引和倒排索引，针对是全文的检索，MySQL既不是倒排索引，也不是正排索引
```



### R-Tree索引(了解)

R-Tree在mysql很少使用，仅支持geometry数据类型，支持该类型的存储引擎只有myisam、bdb、innodb、ndb、archive几种。相对于b-tree，**r-tree的优势在于范围查找**



### 聚簇与非聚簇索引区别

 mysql的索引类型跟存储引擎是相关的，innodb存储引擎数据文件跟索引文件全部放在ibd文件中，而myisam的数据文件放在扩展名为myd文件中，索引放在扩展名为myI文件中，

**其实区分聚族索引和非聚族索引非常简单，只要判断数据跟索引是否存储在一起就可以了。**

innodb存储引擎在进行数据插入的时候，数据必须要限索引放在一起,如果有主键就使用主键，没有主键就使用唯一键，没有唯一键就使用6字节的rowid,因此跟数据绑定在一起的就是聚簇索引， 而为了避免数据冗余存储，其他的索引的叶子节点中存储的都是聚族索引的key值，因此innodb中既有聚簇索引也有非聚簇索引，而myisam中只有非聚簇索引。

注意事项：

~~~
1）、在innodb引擎中，一个表最多只能有一个聚簇索引，一个表也必须有一个聚簇索引
2）、只有innodb数据引擎支持聚簇索引，myisam不支持，在innodb中，采用主键作为聚簇索引
3）、如果当前表中没有主键，mysql将会选择一个唯一性的字段作为聚簇索引
4）、如果当前表既没有主键字段，也没有添加唯一约束字段，mysql将随机选取一个字段作为聚簇索引
5）、在表中其它字段上创建的索引都是非聚簇索引
~~~



## 索引的语法

### 创建索引

1）CREATE [UNIQUE] INDEX  索引名 ON 表名(列名);

2）ALTER TABLE 表名  ADD [UNIQUE]  INDEX [索引名] ON(列名);

~~~mysql
-- ALTER有四种方式来添加数据表的索引：
-- 1.该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL。
ALTER TABLE 表名 ADD PRIMARY KEY (列名)
-- 2.这条语句创建索引的值必须是唯一的（除了NULL外，NULL可能会出现多次）。
ALTER TABLE 表名 ADD UNIQUE 索引名 (列名)
-- 3.添加普通索引，索引值可出现多次。
ALTER TABLE 表名 ADD INDEX 索引名 (列名)
-- 4.该语句指定了索引为 FULLTEXT ，用于全文索引。
ALTER TABLE 表名 ADD FULLTEXT 索引名 (列名)
~~~

### 查看索引

~~~mysql
show index from 表名
~~~

### 删除索引

~~~mysql
DROP INDEX 索引名 ON 表名;
~~~

## 索引分类

### 单值索引

> 即一个索引只包含单个列，一个表可以有多个单列索引

说明：索引建立成哪种索引类型？根据数据引擎类型自动选择的索引类型。innodb引擎都采用B+Tree索引，而且innodb 引擎的主键索引默认为聚簇索引，myisam **则都采用的** **B-TREE**索引

**创建索引，并指定主键索引**

~~~mysql
mysql> CREATE TABLE customer (id INT(10)  PRIMARY KEY AUTO_INCREMENT ,customer_no VARCHAR(200),customer_name VARCHAR(200)
);
~~~

**创建单值索引**

~~~mysql
mysql> create index 索引名 ON 表名(列名)
mysql> create index idx_customer_name ON customer(customer_name)
~~~

**查询索引**

~~~mysql
mysql> show index from 表名;   #这个表其实就有2个索引
mysql> show index from customer;   #这个表其实就有2个索引
~~~

**删除索引**

~~~mysql
DROP INDEX 索引名 on 表名 ;
DROP INDEX idx_customer_name on customer ;
~~~

### 唯一索引

> 如果当前表中字段添加了唯一性约束，mysql主动的将当前字段上的数据进行排序，其生成的索引就是唯一索引，索引列的值必须唯一，但允许有空值

~~~mysql
CREATE TABLE customer (id int primary key not null auto_increment,
customer_no varchar(16),customer_name VARCHAR(200),UNIQUE key(customer_no)
);

# 单独建唯一索引：
create unique index idx_customer_no ON customer(customer_no); 
create unique index 索引名称 ON 表名(列名); 
~~~

注：建立唯一索引时必须保证所有的值是唯一的（除了null），若有重复数据，会报错。

### 复合| 组合索引

> 在数据库操作期间，用户可以在多个列上建立索引,这种索引叫做复合索引(组合索引)，即一个索引包含多个列，复合索引比单值索引所需要的开销更小(对于相同的多个列建索引)

**防坑指南**

* 查询的条件顺序建议跟索引的顺序一致 | 不一致时会自动优化顺序 (最左原则)
* 最左原则: 必须保证 条件和索引的第一个值  在条件里必须存在
* 如果查询的条件 有范围 则后面的索引必然的失效 导致排序

~~~mysql
create table customer(id int(10) UNSIGNED primary key auto_increment,customer_no varchar(200),customer_name varchar(200),unique key(customer_name),key(customer_no,customer_name))
 
# 单独建索引：
create index 索引名 on 表名(列名1, 列名2, 列名3)
create index idx_no_name on customer(customer_no,customer_name);
~~~

### 主键索引

> 如果当前表中字段添加了主键约束，mysql主动的将当前字段上数据进行排序，其生成的索引就是主键索引，**设定为主键后数据库会自动建立索引**，在innodb引擎中，这种索引也是聚簇索引结构

**注：使用 AUTO_INCREMENT 关键字的列必须有索引(只要有索引就行)。**

~~~mysql
create table customer(id int(10) UNSIGNED auto_increment,customer_no varchar(200),customer_name varchar(200),primary key(id))
~~~



## 如何合理创建索引

### 建议创建索引

1.主键自动建立唯一索引

2.频繁作为查询的条件的字段应该创建索引

3.查询中与其他表关联的字段，外键关系建立索引

4.频繁更新的字段不适合创建索引（因为每次更新不单单是更新了记录还会更新索引，加重IO负担）

5.查询中排序的字段，排序字段若通过索引去访问将大大提高排序的速度

6.查询中统计或者分组字段

### 不建议创建索引

1.表记录太少

2.经常增删改的表

3.数据重复且分布平均的表字段，因此应该只为经常查询和经常排序的数据列建立索引。

注意，如果某个数据列包含许多重复的内容，为它建立索引就没有太大的实际效果



# Mysql 性能分析及调优

## Explain 性能分析 

> 在Mysql中，有一个专门负责优化SELECT语句的优化器模块（Mysql Query optimizer（优化）)

### 主要功能：

* 通过计算分析系统中收集到的统计信息，为客户端请求的Query提供他认为最优的执行计划 ，当客户端向MySQL请求一条Query语句到命令解析器模块完成请求分类区别出是SELECT并转发给QueryOptimizer之后，QueryOptimizer首先会对整条Query进行优化处理掉一些常量表达式的预算，直接换算成常量值。
* 并对Query中的查询条件进行简化和转换，如去掉一些无用或者显而易见的条件，结构调整等等。然后则是分析Query中的Hint信息（如果有），看显示Hint信息是否可以完全确定该Query的执行计划。
* 如果没有Hint或者Hint信息还不足以完全确定执行计划，则会读取所涉及对象的统计信息，根据Query进行写相应的计算分析，然后再得出最后的执行计划

## Explain 详解

使用EXPLAIN关键字可以模拟优化器执行SQL语句，从而知道MySQL是如何处理你的SQL语句的。分析你的查询语句或是结构的性能瓶颈

```sql
explain select * from mysql.user;
```

![image-20220819114220876](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819114220876.png)

### ID 列

> id：包含一组数字，表示查询中执行select子句或操作表的顺序，

* 如果id相同，执行顺序由上至下，可以认为是一组，从上往下顺序执行，
* 在所有组中，id值越大，优先级越高，越先执行；

* 如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行

### select_type 列

> 表示查询中每个select子句的类型：SIMPLE、PRIMARY、SUBQUERY、DERIVED、UNION、UNION RESULT

* SIMPLE：查询中不包含子查询或者UNION
* PRIMARY：查询中若包含任何复杂的子部分，最外层查询则被标记为
* SUBQUERY：在SELECT或WHERE列表中包含了子查询，该子查询被标记为SUBQUERY
* DERIVED：在FROM列表中包含的子查询被标记为：DERIVED（衍生）
* UNION：若第二个SELECT出现在UNION之后，则被标记为UNION；若UNION包含在FROM子句的子查询中，外层SELECT将被标记为：DERIVED
* 从UNION表获取结果的SELECT被标记为：UNION RESULT

### table 列

> 显示这一行数据时关于哪个表的

### type 列

* 表示MySQL在表中找到所需行的方式，又称“访问类型” 

* type 扫描方式由快到慢：**system > const > eq_ref > ref > range > index > ALL**
* 总结：**一般来说，得保证查询只是达到range级别，最好达到ref**

> ##### system 

```sql
-- 它是const联接类型的特例，表只有一行记录（等于系统表），很少出现
```

> ##### const

~~~sql
-- 通过索引一次就能找到，速度非常快。const用于比较【primary key或者unique索引】
-- 被连接的部分是一个常量值（const），只匹配一行数据，所以很快。通常将主键至于where列表中

explain select * from employee where id = 1;
~~~

> ##### eq_ref

```sql
-- 对于前表中的每一行（row），对应后表只有一行被扫描，这类扫描的速度也非常的快。
-- 应用场景：1.联表（join）查询；2.命中主键或者非空唯一索引；3.等值连接
```

> ##### ref

```sql
-- 非唯一性索引扫描，返回匹配某个单独值的所有行，场景：联表查询普通非唯一索引 
-- 由于后表使用了`普通非唯一索引`，对于前表`user1`表的每一行(row)，后表`user_balance`表可能有多于一行的数据被扫描
```

> ##### range

```sql
-- 只检索给定范围的行，使用一个索引来选择行。key列显示使用了哪个索引，
-- 一般就是在你的where语句中出现了between、<、>、in等的查询，
-- 这种范围扫描索引扫描比全表扫描要好，因为他只需要开始索引的某一点，而结束语另一点，不用扫描全部索引
```

> ##### index

```sql
-- index与ALL区别为index类型只遍历索引树。
-- 这通常比ALL快，只快一点，因为索引文件通常比数据文件小。
--（也就是说虽然all和index都是读全表，但index是从索引中读取的，而all是从硬盘中读的）
```

> ##### All

```sql
-- all：Full Table Scan， MySQL将遍历全表以找到匹配的行
```

### possible_keys  列

显示可能应用在这张表中的索引一个或多个。查询涉及的字段上若存在索引，则该索引将被列出，但不一定被查询实际使用，这是理论分析

~~~sql
explain select * from employee where name='1';
~~~

![image-20210706213624564](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210706213624564.png)

### key 列

实际使用的索引，如果为null则没有使用索引，如果不为null，则表示使用了索引，有可能使用了覆盖索引

**覆盖索引：只需要在一棵索引树上就能获取SQL所需的所有列数据，无需回表，速度更快**

> 覆盖索引

**使用覆盖索引的常见的方法是：将被查询的字段，建立到联合索引里去**

* id 字段是聚簇索引，age 字段是普通索引（二级索引）
* id 的树的叶子节点包含了行数据 而age的数节点并没有行数据只有对应的id

```java
// 索引的存储结构：id 是主键，所以是聚簇索引，其叶子节点存储的是对应行记录的数据
// 如果查询条件为主键（聚簇索引），则只需扫描一次B+树即可通过聚簇索引定位到要查找的行记录数据。
// age 是普通索引（二级索引），非聚簇索引，其叶子节点存储的是聚簇索引的的值
    
如果查询条件为普通索引（非聚簇索引），需要扫描两次B+树，第一次扫描通过普通索引定位到聚簇索引的值，然后第二次扫描通过聚簇索引的值定位到要查找的行记录数据，这种也叫回表操作，所谓回表操作：先通过普通索引的值定位聚簇索引值，再通过聚簇索引的值定位行记录数据，需要扫描两次索引B+树，它的性能较扫一遍索引树更低
```

### key_len 列

> 表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度。

在不损失精确性的情况下，长度越短越好,key_len显示的值为索引最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索出的，如果实际上用到索引，则有索引的长度，否则为null

### ref 列

> 显示使用哪个列或常数与key一起从表中选择行

### rows 列

> 显示MySQL认为它执行查询时必须检查的行数，

这个数字是内嵌循环关联计划里的循环数目，也就是说它不是MySql认为它最终要从表里读取出来的行数，而是MySql为了找到符合查询的每一点上标准的那些行而必须读取的行的平均数

### extra 列

**这一列包含的是不适合在其他列显示的额外信息，其值有：**

1.Using filesort：mysql会对数据使用一个外部的索引排序，而不是**按照表内的索引顺序进行**读取，MySQL中无法用索引完成排序操作成为“文件排序"，极大影响mysql性能，需要尽快优化

> 排序的时候最好遵循所建索引的顺序与个数否则就可能会出现usering filesort

2.Using temporary： 使用了临时表保存中间结果，MySQL在对查询结果排序时使用临时表，极大影响mysql性能，需要尽快优化，常见于排序order by 和分组查询 group by

> 结论：group by一定要遵循所建索引的顺序与个数

3.Using index：表示相应的select操作中使用了覆盖索引(covering index)，避免回表操作，效率good

4.Using where：表名使用了where过滤，效率一般

> 其中using filesort，using temporary，using index最为常见，出现前两种表示是需要优化的地方，出现第三种表示索引效率不错，如果值是null，则表明要进行回表操作



## Mysql 调优-索引优化

### 单表优化

> 对于单表查询，根据 where 后面的字段建立索引，遇到有 <、>、!= 这样的关系运算符，会使已经建完的索引失效

```sql
-- type 变成了 range,这是可以忍受的。但是 extra 里使用 Using filesort 仍是无法接受的。

-- 但是我们已经建立了索引,为啥没用呢?这是因为按照 BTree 索引的工作原理,先排序 category_id,如果遇到相同的 category_id 则再排序 comments,如果遇到相同的 comments 则再排序 views。

-- 当 comments 字段在联合索引里处于中间位置时,因comments > 1 条件是一个范围值(所谓 range),MySQL 无法利用索引再对后面的 views 部分进行检索,即 range 类型查询字段后面的索引无效
```

### 两表优化

> 注意: 因为 左连接在查询时已经全表查了 还未到wheel条件那 则必须到查询右表的时候配合where条件建立索引

* 左连接，一定要要把索引创建到右表上

* 右连接，一定要要把索引创建到左表上

### 总结

~~~
1、对于单表查询，一定要根据 where 后面的字段建立索引，遇到有 <、>、!= 这样的关系运算符，会使已经建完的索引失效
2、对于双表查询，左外连接只会因为右表的索引而被优化，右外连接只会因为左表的索引而被优化，内连接则因为两个表的索引都可以被优化
3、对于三表查询，则根据是左连接对右边的连接建立索引，根据右连接对左边的连接建立索引
~~~

## 索引失效情况（重点）

1、组合索引不遵循最左匹配原则会导致索引失效

2、组合索引的前面索引列使用范围查询(<>,like)会导致后续的索引失效

3、不要在索引上做任何操作(计算，函数，类型转换)

4、is null和is not null无法使用索引  

5、尽量少使用or操作符，否则连接时索引会失效

6、字符串不添加引号会导致索引失效

7、两表关联使用的条件字段中字段的长度、编码不一致会导致索引失效

8、like语句中，以%开头的模糊查询，会导致索引失效

9、如果mysq|中使用全表扫描比使用索引快，也会导致索引失效

## 索引注意点

> #### 最好全值匹配

建立几个复合索引字段，最好就用上几个字段。且按照顺序来用

如：索引idx_staffs_nameAgePos 建立索引时以 name ， age ，pos 的顺序建立的。全值匹配表示按顺序匹配的



> #### 最佳左前缀法则

如果索引了多列，要遵守最左前缀法则，指的是查询从索引的最左前列（即name索引列）开始，不跳过索引中间的列（即age索引列）。



> #### 不在索引列上做任何操作

不在索引列上做任何操作（计算、函数、(自动or手动)类型转换），否则会导致索引失效而转向全表扫描



> #### 范围之后全失效

存储引擎不能使用索引列作为范围条件比较，范围条件右边的列都失效。（范围之后全失效），若中间索引列用到了范围（>、<、like等），则后面的所以全失效



> ### 尽量使用覆盖索引

尽量使用覆盖索引(只访问索引的查询(索引列和查询列一致))，少用select * 查询 ，即不要查询所有列



> #### 不要使用不等于(!= 或者<>)

mysql 在使用不等于(!= 或者<>)的时候无法使用索引会导致全表扫描



> #### is not null 也无法使用索引

is not null和is null 也无法使用索引



> #### like以通配符开头('%abc...')索引失效

like以通配符开头('%abc...')mysql索引失效会变成全表扫描的操作

```java
// 在实际开发中，有时就是要把%写到左右两边，如何也能用上索引，不让索引失效？
// 使用覆盖索引，建的索引和查的字段个数顺序最好完全一致
```



> #### 字符串不加单引号索引失效

~~~mysql
EXPLAIN SELECT * FROM staffs WHERE name = 2000;
~~~

数据库会把2000隐式的自动的转换为String类型，但是在索引列上做任何操作（计算，函数，（自动or手动）类型转换），会使索引失效



> #### 少用or,用它来连接时会索引失效

~~~mysql
EXPLAIN SELECT * FROM staffs WHERE name  like "abc%" or age = 23
~~~





# MySql 表数据操作

## DDL: 表 操作

```sql
-- 创建表
​	create table 表名(列名 数据类型,列名 数据类型,列名...);
-- 删除表
​	drop table 表名;
-- 修改表-添加列
​	alter table 表名 add 列名 数据类型;
-- 查看数据库的所有表
​	show tables;
```

## 表字段 约束

约束可以让字段列名的值进行规范 约束加在字段后

```sql
-- 约束:
	-- 非空约束 -- 数据不能为空
		not null 
	-- 唯一约束 -- 数据具有唯一性,不能重复
		unique  
	-- 默认约束 -- 数据为空时使用默认值数据
		default 默认值 
	-- 检查约束 -- 检查数据是否为选定值,数据可以为空值
		check (列名=值 or 列名=值) 
	-- 主键约束 -- 主键不能为空不能重复 表中只有一个主键,约束了主键的唯一性
		primary key 
	-- 自增约束 -- 实现主键的自动增长 可以不赋值,可以指定值,但是每次自增长都以最大值自增
		auto_increment 
	-- 外键约束 -- 外键只能关联到另外一个表的主键,并且只能使用主键已存在的数据 
	-- 配合使用在主键上,可以赋值为null,但会自增覆盖空值
		foreign key(外键名) references 表名(主键名)
	-- 去重 | DISTINCT
		SELECT  DISTINCT  *  FROM  TABLE
```

##  字段类型

### 数值

```sql
-- 整数:
	int
	bigint
-- 浮点数:
	float -- 单精度: 八位
	double -- 双精度: 十六位  -- 可在后面加约束,如double(m,d)  m为最大长度,d为小数的长度
	decimal(m,d) -- 定点数:适用于金额 参数m<65总个数,d<30且d<m为小数位,浮点型存放的是近似值，而定点类型是精确值。
	-- 注意: 在java里 关于金额的数据 可使用 BigDecimal 类型对应 赋值 new BigDecimal("1002"); 推荐使用双引号
```

### 字符串

```sql
-- 字符串
	char(n) -- 固定长度-255字符 n:表示不能超过此长度-当char(n)长度不足n时也按n计算长度
	varchar(n) -- 可变长度-65535字符
	tinytext -- 单可变长度-225字符
	text -- 可变长度-65535字符 富文本编辑器
	mediumtext -- 可变长度-2的24次方
	longtext -- 可变长度-2的32次方
```

### 日期

```sql
-- 日期
	date -- ' 年 - 月 - 日 '
	time -- ' 时 : 分 : 秒 '
	datetime -- ' 年 - 月 - 日  时 : 分 : 秒 '
	-- 添加该函数可使用系统当前时间 sysdate()
	timestamp -- 自动储存记录修改时间 若定义一个字段为timestamp，这个字段里的时间数据会随其他字段修改的时候自动刷新，所以这个数据类型的字段可以存放这条记录最后被修改的时间。
	
	-- 注意: 在java 时间类型可对应 string  在映射文件进行表数据的追加 now() 表示追加当前的系统时间
```



## DML: 增删改

### insert 增 

```sql
-- 向表中的所有列新增数据 列名-类型-都要对应
	insert into 表名 values(值1,值2,值...);
-- 指定列插入数据 可插入多个列名,用逗号隔开,也要对应值
	insert into 表名(列名, 列名1) values('值', '值1');
-- 添加多行数据
	insert into 表名 values(值1,值2,值...),(值1,值2,值...);
```

### delete 删

```sql
-- 删除指定列中的指定值行 --> and - 且  or - 或
	delete from 表名 where 条件;
-- 清空表所有的数据
	delete from 表名;
-- 根据id批量删除
	delete from 表名 where id in (1, 2, 3, ...);
```

### update 改

```sql
-- 修改指定行的列值
	update 表名 set 列名=新值 where 条件;
-- 修改指定行的列值基础增加
	update 表名 set 列名=列名+值 where 条件;
-- 修改指定行的多个列值
	update 表名 set 列名1=新值,列名2=新值 where 条件;
-- 根据id批量修改
	update 表名 set 列名 = 修改值 where id in (1, 2, 3, ...);
```

## DQL: 查询

### 基本查询 | 瑟莱特

```sql
-- 语法  select 列名...... from 表名 where 条件
-- 查询所有信息(*代表所有列)
	select * from 表名;
-- 查询时更改列名(显示作用)
	select 列名 as '新名字' from 表名;
-- 查询列值的范围
	select 列名...... from 表名 where 列名 between 最小值 and 最大值;
	select 列名...... from 表名 where 列名 >= 最小值 and 列名 <= 最大值;
-- 查询多行列值
	select 列名...... from 表名 where 列名 in(列值1,列值2);    in 相当于多个 or
-- 查询包含/开头/结尾
	select 列名...... from 表名 where 列名 like '%值%' / 值% / %值;
```

### 关联查询

#### 内连接

> **特点:** 只会查询两张表重和的部分 其余的则不会查询出来

**语法:**

```sql
-- 内
	语法 select * from 表1,表2 where 表1.外键=表2.主键
	语法 select * from 表1 inner join 表2 on 表1.外键=表2.主键
```

![image-20220819130836662](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819125858951.png)

#### 外/左连接

> **特点:** 以左表为主全部查询出来 如果右表部分没数据则以null

**语法:**

```sql
-- 外
	-- 左外连接(以左表为主表,会把左表数据全部查询出来)
	语法 select * from 表1 left join 表2 on 表1.主键=表2.外键
	语法 select * from 表1 left outer join 表2 on 表1.主键=表2.外键
	
-- 配合 表2 的外键为 null 可 左表且不重合的数据
select * from 表1 left outer join 表2 on 表1.主键=表2.外键 where 表2.外键 = null
```

<img src="https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819130316462.png" alt="image-20220819130316462" style="zoom:150%;" />

#### 外/右连接

> **特点:** 以右表为主全部查询出来 如果左表部分没数据则以null

**语法:**

```sql
-- 外
	-- 右外连接(以右表为主表,会把右表数据全部查询出来)
	语法 select * from 表1 right join 表2 on 表1.主键=表2.外键
	语法 select * from 表1 right outer join 表2 on 表1.主键=表2.外键
	
-- 配合 表2 的外键为 null 可 左表且不重合的数据
select * from 表1 left outer join 表2 on 表1.主键=表2.外键 where 表1.外键 = null
```

![image-20220819130443814](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819130443814.png)

#### 外连接 多表查询

```sql
-- 多表连接
	select * from 表1,表2,表3 where 表1.外键=表2.主键 and 表3.主键=表2.外键;
	select * from 表1 left join 表2 on 表1.主键=表2.外键 left join 表3 on 表3.主键=表2.外键;
```



#### 全外查询

> **特点:** 以两张表为主 查询所有的数据 为空的以null填充

**语法:**

```sql
select * from 表1 left outer join 表2 on 表1.主键=表2.外键
union
select * from 表1 right outer join 表2 on 表1.主键=表2.外键
```

![image-20220819131519212](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819131519212.png)

#### 全外(去除内连接)

> **特点:** 以两张表为主 查询所有的数据 但会去除内连接查询的重合数据 为空的以null填充

**语法:**

```sql
select * from 表1 left outer join 表2 on 表1.主键=表2.外键
where 表2.外键 is null
union
select * from 表1 right outer join 表2 on 表1.主键=表2.外键
where 表1.主键 is null
```

![image-20220819150605075](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819150605075.png)



# 特殊条件值

## 运算符 - 判断

```sql
-- 算术运算符 
	+ - * / %
	
-- 关系运算符
	> >=  < <=  =  !=  --关系运算符的结果为真(用数字1表示)或者假(用数字0表示假)
	
-- 范围的首和尾都包含
	select 包含值 between 最小值 and 最大值
	like  - %        --  为通配符,任意内容
	-- 指定字符开头
		select '你是我的月亮' like '你%' ;
	-- 指定字符结尾
		select '你是我的月亮' like '%月亮' ;
	-- 包含指定字符
		select '你是我的月亮' like '%我的%' ;
	-- 模糊 多个
		select '你是我的月亮' like '%我, 月%' ;
		select '你是我的月亮' like '%我%, %月%' ;
		select '你是我的月亮' like '%我%月%' ;
		
-- 空判断
	select    '  ' = '  ' ;
	select null is null;
			列名 is null
			列名 is not null
			
-- 逻辑运算符 结果：真（1） 假（0）
	非 not     select not 1;
	与 and     select 1 and 1;
	或 or      select 0 or 0;
```

## 分页  -- 分组

```sql
-- 分页 | 可控制查询的条数
	-- limit 后面为一个值n时,表示从第一行开始-查询n行
		语法: select * from 表名 limit n;
	-- limit 后面为两个值m,n时,表示从m+1行开始-查询n行
		语法: select * from 表名 limit m,n;
	-- 页码-pageNum 每页显示的行数-pageSize 表示
		select * from 表名 limit (pageNum-1)*pageSize,pageSize;
		
-- 聚合函数
	-- avg-平均数 count-统计行数 max/min-最大/小值 sum-和
	语法: select  函数( 列名 )  from 表名;  -- 在使用函数时查询列名报错 any_value(列名)		
		
-- 分组
	语法: select (列名-显示作用 函数) from 表名 group by 分组列名 having 条件;
	group by... having ...  -- 分组的语法通常需要跟聚合函数一起用
-- 多字段分组
	语法: select (列名-显示作用 函数) from 表名 group by 分组列名1, 列明2... having 条件;
```

## 条件 基本聚合函数

> 基本聚合函数

```sql
-- 可配合分组使用 聚合函数
-- 在使用函数时查询列名报错 any_value(列名)
avg-平均数 | count-统计行数 | max/min-最大/小值 | sum-和

-- 聚合函数可进行条件判断
max/min   最大/小值   条件 真-1 / 假-0
sum        和-相加    条件 真-1 / 假-0
```

> 条件聚合函数

```sql
-- 表示 该列如果小于值 则 +1 否则 +0 最后统计总数
sum(case when 列名 < 值 then 1 else 0 end) 列别名
```

## 排序

```sql
-- 排序
	-- order by ... asc升序（默认）  desc降序
	-- 升序-以指定列名升序排序 -- asc可以省略
		语法: select * from 表名  order by 列名 asc;
	-- 降序-以指定列名降序排序 -- desc降序
		语法: select * from 表名  order by 列名 desc;
```

# MySql 特殊函数

## 时间类函数

### 获取现在时间函数

详见: https://www.runoob.com/sql/sql-dates.html

| [NOW()](https://www.runoob.com/sql/func-now.html)            | 返回当前的日期和时间                |
| ------------------------------------------------------------ | ----------------------------------- |
| [CURDATE()](https://www.runoob.com/sql/func-curdate.html)    | 返回当前的日期                      |
| [CURTIME()](https://www.runoob.com/sql/func-curtime.html)    | 返回当前的时间                      |
| [DATE()](https://www.runoob.com/sql/func-date.html)          | 提取日期或日期/时间表达式的日期部分 |
| [EXTRACT()](https://www.runoob.com/sql/func-extract.html)    | 返回日期/时间的单独部分             |
| [DATE_ADD()](https://www.runoob.com/sql/func-date-add.html)  | 向日期添加指定的时间间隔            |
| [DATE_SUB()](https://www.runoob.com/sql/func-date-sub.html)  | 从日期减去指定的时间间隔            |
| [DATEDIFF()](https://www.runoob.com/sql/func-datediff-mysql.html) | 返回两个日期之间的天数              |
| [DATE_FORMAT()](https://www.runoob.com/sql/func-date-format.html) | 用不同的格式显示日期/时间           |

### 时间差列

> 可使用 timediff | 时间差 函数计算出两个时间的时间差为新的一列数据

```sql
select timediff("时间1" , "时间2") from 表名
select timediff(now() , seckill_endtime) from seckill

-63:13:46
```

### 时间差条件

[Mysql日期差函数，Mysql选择两个日期字段相差大于或小于一定时间_mysql 时间间隔大于](https://blog.csdn.net/homelam/article/details/88647099)

> FROM_UNIXTIME |  语法

```sql
select * from tpaylog where TIMESTAMPDIFF(时间差类型 ,时间2, 时间1 > 30
```

> 时间差类型

* FRAC_SECOND - 表示间隔是毫秒

* SECOND - 秒

* MINUTE - 分钟

* HOUR - 小时

* DAY - 天

* WEEK - 星期

* MONTH - 月

* QUARTER - 季度

* YEAR - 年

> 案例
>
> https://blog.csdn.net/m0_67394002/article/details/126113579

```sql
-- 现在的时间 至 该字段的时间 差值 大于30分钟
select * from tpaylog where TIMESTAMPDIFF(MINUTE ,tpaylog_ordertime, NOW()) > 30
select * from tpaylog where TIMESTAMPDIFF(时间差类型 ,时间字段1, 时间字段2) > 值

-- 类似函数 时间之差大于31天 | datediff(now(),时间字段) >= 31
datediff(now(),busi_date) >= 31

-- 类似函数 时间之差小于于7天 | 时间字段 > DATE_SUB(now(),INTERVAL 7 时间单位);
SELECT * FROM `stock_info` where
busi_date > DATE_SUB('2022-11-11',INTERVAL 7 day);
```

### 时间转换格式

详见: https://www.runoob.com/sql/func-date-format.html

```java
// date_format(时间字段, 时间格式) = 条件值
```

```java
// busi_date 时间字段 | 如: 2022-11-04 --> 2022-11
select * from stock_in_order where
    audit_status > 2 and category = 2 and company_id = 37 and status = 1
    and date_format(busi_date, '%Y-%m') = '2022-10'

<if test="entity.start != null and entity.start != ''">
    and date_format(a.create_time,'%Y-%m-%d') &gt;= #{entity.start}
</if>
 <if test="entity.end != null and entity.end != ''">
    and date_format(a.create_time,'%Y-%m-%d') &lt;= #{entity.end}
</if>
```

### 查询时间偏移数据

详见: https://blog.csdn.net/weixin_49071539/article/details/116458017

​		  https://www.cnblogs.com/wjw1014/p/12917335.html

```sql
-- 今天
select * from 表名 where to_days(时间字段名) = to_days(now());

-- 昨天
SELECT * FROM 表名 WHERE TO_DAYS( NOW( ) ) - TO_DAYS( 时间字段名) <= 1;

-- 7天
SELECT * FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(时间字段名);

-- 近30天
SELECT * FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(时间字段名);

-- 本月
SELECT * FROM 表名 WHERE DATE_FORMAT( 时间字段名, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' );

-- 上一月 | 使用now()可用 字符串时间字段'2022-10-1'可用
SELECT * FROM 表名 WHERE PERIOD_DIFF( date_format( now( ) , '%Y%m' ) , date_format( 时间字段名, '%Y%m' ) ) =1;

-- 查询本季度数据
select * from `ht_invoice_information` where QUARTER(create_date)=QUARTER(now());

-- 查询上季度数据
select * from `ht_invoice_information` where QUARTER(create_date)=QUARTER(DATE_SUB(now(),interval 1 QUARTER));

-- 查询本年数据
select * from `ht_invoice_information` where YEAR(create_date)=YEAR(NOW());

-- 查询上年数据
select * from `ht_invoice_information` where year(create_date)=year(date_sub(now(),interval 1 year));

-- 查询当前这周的数据
SELECT name,submittime FROM enterprise WHERE YEARWEEK(date_format(submittime,'%Y-%m-%d')) = YEARWEEK(now());

-- 查询上周的数据
SELECT name,submittime FROM enterprise WHERE YEARWEEK(date_format(submittime,'%Y-%m-%d')) = YEARWEEK(now())-1;

-- 查询当前月份的数据
select name,submittime from enterprise   where date_format(submittime,'%Y-%m')=date_format(now(),'%Y-%m');

-- 查询距离当前现在6个月的数据
select name,submittime from enterprise where submittime between date_sub(now(),interval 6 month) and now();
​```

-- 近30天
SELECT * FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(时间字段名);

-- 本月
SELECT * FROM 表名 WHERE DATE_FORMAT( 时间字段名, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' );

-- 上一月
SELECT * FROM 表名 WHERE PERIOD_DIFF( date_format( now( ) , '%Y%m' ) , date_format( 时间字段名, '%Y%m' ) ) =1;

-- 查询本季度数据
select * from `ht_invoice_information` where QUARTER(create_date)=QUARTER(now());

-- 查询上季度数据
select * from `ht_invoice_information` where QUARTER(create_date)=QUARTER(DATE_SUB(now(),interval 1 QUARTER));

-- 查询本年数据
select * from `ht_invoice_information` where YEAR(create_date)=YEAR(NOW());

-- 查询上年数据
select * from `ht_invoice_information` where year(create_date)=year(date_sub(now(),interval 1 year));

-- 查询当前这周的数据
SELECT name,submittime FROM enterprise WHERE YEARWEEK(date_format(submittime,'%Y-%m-%d')) = YEARWEEK(now());

-- 查询上周的数据
SELECT name,submittime FROM enterprise WHERE YEARWEEK(date_format(submittime,'%Y-%m-%d')) = YEARWEEK(now())-1;

-- 查询当前月份的数据
select name,submittime from enterprise   where date_format(submittime,'%Y-%m')=date_format(now(),'%Y-%m');

-- 查询距离当前现在6个月的数据
select name,submittime from enterprise where submittime between date_sub(now(),interval 6 month) and now();
```

## 数学函数

https://blog.csdn.net/qq_43842093/article/details/120938688

### 绝对值

```sql
-- ABS(数值字段) 绝对值
SELECT ABS(-33) -- 输出: 字段是绝对值 没有负数 33
```

### 余数

```sql
-- MOD(N,M) 或%:返回N被M除的余数
SELECT MOD(5,2) -- 输出余数 1
```

### 不小于最小整数值

```sql
-- CEILING(X) 返回不小于X的最小整数值。
select CEILING(1.23); -- 输出余数 2
select CEILING(-1.23); -- 输出余数 -1
```

### 四舍五入的整数

```sql
-- ROUND(X) :返回参数X的四舍五入的一个整数。
select ROUND(1.58); -- 输出余数 2
select ROUND(-1.58); -- 输出余数 -2
```

## 字符串函数

### ASCII代码值

```sql
-- ASCII(str):返回字符串str的最左面字符的ASCII代码值。
-- 如果str是空字符串，返回0。如果str是NULL，返回NULL。
select ASCII(null); -- null
select ASCII(''); -- 0
select ASCII(2); -- 50
select ASCII('dx') -- 100
```

### 合并多列为一列

> CONCAT 语法

```sql
-- 如果任何参数是NULL，返回NULL。可以有超过2个的参数。一个数字参数被变换为等价的字符串形式。
-- CONCAT(列名1,"/",列名2,"/",列名3) 别名
CONCAT(c1.category_name,"/",c2.category_name,"/",c3.category_name) cname

-- 先分组 在合并多列为一列
-- GROUP_CONCAT(列名1,列名2) 别名
GROUP_CONCAT(id,username) cname

-- 分组后多行列值合并一行 并进行倒序
-- 按 attendance_time 分组, 将每一组的 user_id 列每一行合并一行并倒序
SELECT
	GROUP_CONCAT( "", user_id ORDER BY user_id DESC, "" ) AS day_check_time
FROM
	`checking_detail`
	ORDER BY
	attendance_time
```

> 案例

```sql
select s.*, CONCAT(c1.category_name,"/",c2.category_name,"/",c3.category_name) cname
from spu s
inner join category c1 on s.category_id1 = c1.category_id
inner join category c2 on s.category_id2 = c2.category_id
inner join category c3 on s.category_id3 = c3.category_id

SELECT GROUP_CONCAT(id,username) FROM `rbac_user`
```

![image-20220809144852195](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220809144852195.png)

![image-20220819220210334](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220819220210334.png)

### 获取字符串长度

```sql
-- LENGTH(str):返回字符串str的长度。
select LENGTH(‘text’);  -- 4
```

### 截取字符串

```java
-- LEFT(str,len):返回字符串str的最左面len个字符。
select LEFT(‘foobarbar’, 5); -- fooba

-- RIGHT(str,len):返回字符串str的最右面len个字符
select RIGHT(‘foobarbar’, 4); -- rbar

-- SUBSTRING(str,pos):从字符串str的起始位置pos到最后 返回一个子串。
select SUBSTRING(‘Quadratically’,5); -- ratically

-- TRIM(str):返回字符串str，所有前缀或后缀被删除了
select TRIM(’ bar '); -- bar
            
-- LTRIM(str):返回删除了其前置空格字符的字符串str。
select LTRIM(’ barbar’);

-- RTRIM(str):返回删除了其拖后空格字符的字符串str。
select RTRIM(‘barbar ’);
            
-- REPLACE(str,from_str,to_str):返回字符串str，其字符串from_str的所有出现由字符串to_str代替
            
-- REPEAT(str,count):返回由重复countTimes次的字符串str组成的一个字符串。如果count <= 0，返回一个空字符串。如果str或count是NULL，返回NULL。
select REPEAT(‘MySQL’, 3); -- MySQLMySQLMySQL
            
-- REVERSE(str):返回颠倒字符顺序的字符串str。
select REVERSE(‘abc’); -- cba
            
-- INSERT(str,pos,len,newstr):返回字符串str，在位置pos起始的子串且len个字符长的子串由字符串newstr代替。
select INSERT(‘whatareyou’, 5, 3, ‘is’); -- whatisyou
```





## 判空列

```sql
select
-- thirtysum 为null 则 值为0 反之还是原来的值 as: 别名
COALESCE(thirtysum, 0) as thirtyDaysAmount,
from stock_in_order s
```



## 双select查询组合成一表

```sql
select
        u.name as unitName, u.id as unitId,
        sum(s.amount) as endAmount
  -- 将查询出来的归于一张表进行左连接 使用对应的字段对接
  left join (
        select unit_id, sum(amount) thirtysum from stock_in_order 
        where audit_status > 2 and category = 2 and TIMESTAMPDIFF(DAY  ,busi_date, NOW()) &lt; 30 and unit_id is not null group by unit_id
  ) as s1 on s1.unit_id = s.unit_id
```



## 联合外全 查询

> Union | all  即 将多张表的数据一次性显示成一张表的数据 且列数一致

防坑指南:

* 列数不一致 会报错
* 列的数据类型 不一致不会报错 但是会导致类型不明确或者转换字符串
* Union 会将行数相同的数据合并一行 去重
* Union all 则不会去重 显示所有数据

```sql
-- Union 会将行数相同的数据合并一行 去重
select id, name from a
Union 
select id, name from b
-- Union all 则不会去重 显示所有数据
select id, name from a
Union all
select id, name from b
```

## 条件判断后聚合 

> 以同列值为分组合为一条时 会导致后面对应多条语句
>
> 使用  条件判断后聚合  创建新的列 值为; 经过 if 判断的聚合函数 的唯一值

**语法**

```sql
-- 语法一: 
-- 聚合函数(if(条件列名='值', 为true时的值, 为false时的值)) 列名的别名,
sum(if(b.sub_name='语文', 1, 0)) 语文,

-- 语法二:
-- 聚合函数(case when 条件列名='值' then 为true时的值 else 为false时的值 end) 列名的别名,
sum(case when b.sub_name='语文' then 1 else 0 end) 语文,

-- 如果expression_1不为NULL，则IFNULL函数返回expression_1; 否则返回expression_2的结果。
IFNULL(expression_1,expression_2);

```

**案例**

> 解释: 如数学 -->  件为真(数学) 则值为数学分数 在判断为假(语文-外语) 值为 0 最后将使用的值进行聚合为一个数值 然后再取列名 

```sql
SELECT any_value(t.stu_id) id,t.stu_name as '姓名', any_value(g.gra_name) as '班级',
sum(if(b.sub_name='语文', s.sco_grade, 0)) 语文,
sum(case when b.sub_name='数学' then s.sco_grade else 0 end) 数学,
sum(case when b.sub_name='外语' then s.sco_grade else 0 end) 外语
FROM stu_student t
left JOIN stu_score s on s.sco_stuid = t.stu_id 
left join stu_subject b on s.sco_subid = b.sub_id
left join stu_grade g on g.gra_id = t.stu_classid
where g.gra_id = 2
GROUP BY t.stu_name
```

# MySql 技巧

## 时间字段自动添加|更新

详见: [MySql数据库插入一条数据时，create_time字段自动添加为当前时间](https://blog.csdn.net/qq_41942909/article/details/80749766)

> 自动添加插入数据的时间

1. 设置字段类型为datetime。(不建议使用[timestamp](https://so.csdn.net/so/search?q=timestamp&spm=1001.2101.3001.7020)类型) 
2. 默认值填写为   CURRENT_TIMESTAMP （需要自己手动填写，注意单词拼写正确）
3. 这样就达成了我们的目的，插入一条数据的时候，create_time字段会自动添加内容为插入数据的时间

> 自动添加修改数据的时间

1. 设置字段类型为datetime。(不建议使用[timestamp](https://so.csdn.net/so/search?q=timestamp&spm=1001.2101.3001.7020)类型) 
2. 默认值填写为   CURRENT_TIMESTAMP （需要自己手动填写，注意单词拼写正确）
3. **需要勾选默认值下方的 根据当前时间戳更新**，修改一条数据的时候，create_time字段会自动添加内容为修改数据的时间

![image-20221007121329040](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/nhifr8-0.png)





# MySql 原理

## MySql 树原理

> MySql 使用的树有: B+ 树 |  B 树 | Hash | 红黑树 | 二叉树  [InnoDB 使用 B+ 树]

### 二叉查找树

二叉树具有以下性质：**左子树的键值小于根的键值，右子树的键值大于根的键值。**

### 平衡二叉树（AVL Tree）

平衡二叉树（AVL树）**是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树**。也就是说在符合二叉查找树的条件下，它还满足任何节点的两个子树的高度最大差为1。

> AVL树失去平衡之后，可以通过旋转使其恢复平衡。下面分别介绍四种失去平衡的情况下对应的旋转方法。

这四种失去平衡的姿态都有各自的定义：

```sql
-- LL：LeftLeft，也称“左左”。插入或删除一个节点后，根节点的左孩子（Left Child）的左孩子（Left Child）还有非空节点，导致根节点的左子树高度比右子树高度高2，AVL树失去平衡。
-- RR：RightRight，也称“右右”。插入或删除一个节点后，根节点的右孩子（Right Child）的右孩子（Right Child）还有非空节点，导致根节点的右子树高度比左子树高度高2，AVL树失去平衡。
-- LR：LeftRight，也称“左右”。插入或删除一个节点后，根节点的左孩子（Left Child）的右孩子（Right Child）还有非空节点，导致根节点的左子树高度比右子树高度高2，AVL树失去平衡。
-- RL：RightLeft，也称“右左”。插入或删除一个节点后，根节点的右孩子（Right Child）的左孩子（Left Child）还有非空节点，导致根节点的右子树高度比左子树高度高2，AVL树失去平衡。
```

LL===>右单旋

RR===>左单旋

LR===>先左旋，后右旋

RL===>先右旋，后左旋

### B-Tree（平衡多路查找树）

B-Tree结构的数据可以让系统高效的找到数据所在的磁盘块。为了描述B-Tree，首先定义一条记录为一个二元组[key, data] ，key为记录的键值，对应表中的主键值，data为一行记录中除主键外的数据。对于不同的记录，key值互不相同。

![在这里插入图片描述](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/2019090109300123.png)



### B+Tree

B+Tree是在B-Tree基础上的一种优化，InnoDB存储引擎就是用B+Tree实现其索引结构。

B+树的特性：

-  所有的**叶子结点中包含了全部关键字的信息**，**非叶子节点只存储键值信息**，及指向含有这些关键字记录的指针，且叶子结点本身依关键字的大小自小而大的顺序链接，所有的非终端结点可以看成是索引部分，结点中仅含有其子树根结点中最大（或最小）关键字。 (而B树的非终节点也包含需要查找的有效信息)
-  所有叶子节点之间都有一个链指针。
-  数据记录都存放在叶子节点中。

由于B+Tree的非叶子节点只存储键值信息，假设每个磁盘块能存储3个键值及指针信息，则变成B+Tree后其结构如下图所示：
![在这里插入图片描述](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/20190901093019761.png)

```sql
-- 数据库中的B+Tree索引可以分为**聚集索引**（clustered index）和辅助索引（secondary index）。上面的B+Tree示例图在数据库中的实现即为聚集索引，
-- 聚集索引的B+Tree中的叶子节点存放的是整张表的行记录数据。辅助索引与聚集索引的区别在于辅助索引的叶子节点并不包含行记录的全部数据，
-- 而是存储相应行数据的聚集索引键，即主键。当通过辅助索引来查询数据时，InnoDB存储引擎会遍历辅助索引找到主键，然后再通过主键在聚集索引中找到完整的行记录数据
```



## 表 设计的三范式

> 第一范式: 原子性

* 表的每一列必须为 原子性 不可在分隔

* 如果该列可在分割 则必须分开为多列

> 第二范式: 字段与主键的完全完全依赖

* 表的其他列 必须和主键ID 完全依赖
* 一张表不能出现 其他列 和 多个列或者主键 部分依赖 直白点就是 一张表 根据id查询 也可以 根据其他列查询到 (该列和主键一样唯一值) 
* 如果出现 部分依赖 则必须拆分表 为多个对应的表

> 第三范式: 不能有传递依赖

* 列A 依赖于 列B | 列B 依赖于 列C
* 如果出现 传递依赖  显得列A多余 则必须拆分表 为多个对应的表



## MySql 事务

事务是一系列的数据库操作，是数据库应用的基本单位。

> MySQL 中只有 InnoDB 引擎支持事务，它的四个特性:

* 原子性（Atomic），要么全部执行，要么全部不执行；事务的原子性是通过  **undolog 回滚日志**  来实现的，记录更新的相反操作 

* 一致性（Consistency），事务的执行使得数据库从一种正确状态转化为另一种正确状态；通过原子性，持久性，隔离性来实现的	

* 隔离性（Isolation），在事务正确提交之前，不允许把该事务对数据的任何改变提供给其他事务；通过读写锁+MVCC来实现的

* 持久性（Durability），事务提交后，其结果永久保存在数据库中。通过  **redo log 日志**  来实现的

> 实现原理

**原子性原理：**

从8.0.3开始，默认undo tablespace的个数从0调整为2 也就是在8.0版本中，独立undo tablespace被默认打开

```
通过undolog回滚日志来实现的，undo log是一种用于撤销回退的日志， 可以理解为当delete一条记录时， undo log中会记录一条对应的insert记录；当insert一条记录时， undo log中会一条对应的delete记录；当update一条记录时， undo log中记录一条对应相反的update记录
```

**持久性原理：**

```
Redo Log(重做日志)记录的是新数据的备份。在事务提交前，只要将Redo Log持久化即可，不需要将数据持久化到磁盘。当系统崩溃时，虽然数据没有持久化，但是Redo Log经持久化。系统可以根据Redo Log的内容刷新到磁盘
```



## MySql 事务隔离级别

### 开启和关闭事务

> 默认情况下，单独的一条sql就是一个事务，所谓默认情况指的是你没有手动去开启事务

~~~mysql
# 查看自动提交状态
select @@autocommit;
# 值为0： 关闭自动提交   值为1：开启自动提交
set autocommit = 0|1; 
关闭自动提交后，从下一条sql语句开始则开启新事务，需要使用commit或rollback语句结束该事务
~~~

### 隔离级别

MySQL是一个服务器／客户端架构的软件，对于同一个服务器来说，可以有若干个客户端与之连接，每个客户端与服务器连接上之后，就可以称之为一个会话（Session）

```java
我们可以同时在不同的会话里输入各种语句，这些语句可以作为事务的一部分进行处理。不同的会话可以同时发送请求，也就是说服务器可能同时在处理多个事务，这样子就会导致不同的事务可能同时访问到相同的记录。我们前边说过事务有一个特性称之为隔离性，理论上在某个事务对某个数据进行访问时，其他事务应该进行排队，当该事务提交之后，其他事务才可以继续访问这个数据。但是这样子的话对性能影响太大，所以设计数据库的大叔提出了各种隔离级别，来最大限度的提升系统并发处理事务的能力，但是这也是以牺牲一定的隔离性来达到的
```

~~~mysql
# 查看当前数据库的隔离级别
mysql> SELECT @@tx_isolation    # mysql默认是可重复读
# 修改当前数据库的隔离级别
mysql> set global transaction isolation level read uncommitted;   # 这是设置的读未提交级别

注意：设置后要重启客户端
~~~

> 读未提交   READ UNCOMMITTED

```sql
-- 如果一个事务读到了另一个未提交事务修改过的数据，那么这种`隔离级别`就称之为`未提交读`（英文名：`READ UNCOMMITTED`），
-- 事务A对数据做的修改，即使没有提交，对于事务B来说也是可见的，这种问题叫脏读，这是隔离程度较低的一种隔离级别，在实际运用中会引起很多问题，因此一般不常用，它不能解决脏读，可重复读，幻读的问题
```

> 读已提交   READ COMMITTED

```sql
-- 如果一个事务只能读到另一个已经提交的事务修改过的数据，并且其他事务每对该数据进行一次修改并提交后，该事务都能查询得到最新值，那么这种`隔离级别`就称之为`已提交读`（英文名：`READ COMMITTED`），
-- 在此隔离级别下，不会出现脏读的问题。事务A对数据做的修改，提交之后会对事务B可见。**它能解决脏读问题，不能解决可重复读和幻读问题**
```

> 可重复读   REPEATABLE READ

```sql
-- 在该业务场景中，事务B只能读到事务A已经提交的事务修改过的数据，但是第一次读过某条记录后，即使其他事务修改了该记录的值并且提交，该事务之后再读该条记录时，读到的仍是第一次读到的值，而不是每次都读到不同的数据。那么这种隔离级别就称之为可重复读（英文名：REPEATABLE READ） 
-- 可重复读解决了脏读和不可重复读的问题，但是不能解决幻读问题
```

> 串行化    SERIALIZABLE

```sql
-- 以上3种隔离级别都允许对同一条记录进行`读-读`、`读-写`、`写-读`的并发操作，
-- 如果我们不允许`读-写`、`写-读`的并发操作，可以使用`SERIALIZABLE`隔离级别，即事务之间的执行是串行的，
-- 当一个事务在操作的时候，另外的事务就只能等，必须等到该事务提交或者回滚，其它的事务才能继续操作，serializable隔离级别的多个事务不可以同时对同一张表修改！

-- 串行化，能解决脏读，可重复读，幻读问题，但是效率非常慢，因为事务执行是串行执行的。
```

> 幻读

```sql
-- 事务B按照一定条件进行数据读取， 期间事务A插入了相同搜索条件的新数据，事务A查询的时候，还是看不到B插入的新数据，但是其实数据库是有的，即使A事务提交了，B也发现不了，这个时候B也插入一条相同的数据，就会报错。这种情况称为幻读
```



## MySql 锁

### 加锁的目的是什么

> 数据加锁是为了解决事务的隔离性问题，让事务之间相互不影响，每个事务进行操作的时候都必须先对数据加上一把锁，防止其他事务同时操作数据。

### 锁是基于什么实现的

* 数据库里面的锁是基于索引实现的，在Innodb中我们的锁都是作用在索引上面的，

* 当我们的SQL命中索引时，那么锁住的就是命中条件内的索引节点(行锁)，
* 如果没有命中索引的话，那我们锁的就是整个索引树（表锁），
* 完全取决于你的条件是否有命中到对应的索引节点。

### 锁的分类

> 数据库里有的锁有很多种，为了方面理解，所以我根据其相关性"人为"的对锁进行了一个分类，分别如下

* 基于锁的属性分类：共享锁、排他锁。
* 基于锁的粒度分类：表锁、行锁、记录锁、间隙锁、临键锁。
* 基于锁的状态分类：意向共享锁、意向排它锁

### 属性锁

#### 共享锁（Share Lock）

* 表级共享锁又称读锁，简称S锁，

- 在一个事务访问某张表的时候，允许另一个事务对同一张表进行<font color='red'>查询操作</font>。
- 其他的操作(增删改 排它锁)则进行等待阻塞 当查询执行完在进行执行

* 加锁操作一定要在事务上进行

> **对读取的记录加<font color='red'>S锁</font>**

~~~
SELECT .... LOCK IN SHARE MODE;
~~~

![image-20220530152035051](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220530152035051.png) 

#### 排它锁（Exclusive Lock）

*  行级排它锁又称为写锁，简称X锁，

*  在一个事务修改（insert/update/delete）某张表的某条数据时，不允许另一个事务修改<font color='red'>同一条数据</font>
*  其他的事务 [共享锁 排它锁] 都必须等待阻塞 

> **对读取的记录加<font color = 'red'>X锁</font>**

~~~
SELECT .... FOR UPDATE;
~~~

![image-20220530171315783](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220530171315783.png) 



### 粒度锁

#### 表锁

> 特点： 粒度大，**偏向myisam引擎**，无死锁，并发度最低

* 表锁是指上锁的时候锁住的是整个表，
* 当下一个事务访问该表的时候，必须等前一个事务释放了锁才能进行对表进行访问；



#### 行锁

> 特点：粒度小，加锁比表锁麻烦，不容易冲突，相比表锁支持的并发要高；

* 行锁是对所有行级别锁的一个统称，比如下面说的记录锁、间隙锁、临键锁都是属于行锁， 
* 行锁是指加锁的时候锁住的是表的某一行或多行记录，多个事务访问同一张表时，只有被锁住的记录不能访问，其他的记录可正常访问；

**注意点:**  索引失效使行锁变表锁

```sql
-- 1. 没有命中索引
-- 2. 条件的字段没有建立索引 或者 索引失效
```



### 行锁 细分

#### 记录锁（Record Lock）

> 记录锁的范围只是表中的某一条记录，记录锁是说事务在加锁后锁住的只是表的某一条记录 

```
触发条件：精准条件命中，并且命中索引

记录锁的作用：加了记录锁之后数据可以避免数据在查询的时候被修改的重复读问题，也避免了在修改的事务未提交前被其他事务读取的脏读问题。
```



#### 间隙锁（Gap Lock）

间隙锁是在事务加锁后其锁住的是表记录的某一个区间，防止其它事务在这个区域内插入、修改、删除数据，这是为了防止出现幻读现象，当表的相邻ID之间出现空隙则会形成一个区间，即锁定的间隙为（A，B] 左开右闭

**触发条件：**范围查询，查询条件必须命中索引、间隙锁只会出现在REPEATABLE_READ（可重复读)的事务级别中



#### 临键锁(Next-Key Lock)

它是INNODB的行锁默认算法，总结来说它就是记录锁和间隙锁的组合，**临键锁会把查询出来的记录锁住，同时也会把该范围查询内的所有间隙空间也会锁住，再之它会把相邻的下一个区间也会锁住**

**临键锁的作用：**结合记录锁和间隙锁的特性，临键锁避免了在范围查询时出现脏读、重复读、幻读问题。



## MySQL 重要日志

### 错误日志  log_error

> 用来记录 MySQL 服务器运行过程中的错误信息，

比如，无法加载 MySQL 数据库的数据文件，或权限不正确等都会被记录在此，还有主从复制环境下，从服务器进程的信息也会被记录进错误日志。默认情况下，错误日志是开启的，且无法被禁止。

查看错误日志文件

~~~mysql
SHOW VARIABLES LIKE 'log_error';
##linux默认位置##     /var/log/mysqld.log 
##window默认位置##    C:\dev\mysql\mysql-8.0.19-winx64\data\QH-20210227YZPF.err
~~~

将 log_error 选项加入到 MySQL 配置文件的 [mysqld] 组中，形式如下：

~~~shell
[mysqld]
log-error=dir/{filename}    ###重启 MySQL 服务后，参数开始生效，可以在指定路径下看到 filename.err 的文件
~~~

### 通用日志 general log

查询（通用）日志 ：查询日志在 MySQL 中被称为 general log（通用日志），查询日志里的内容不要被“查询日志”误导，认为里面只存储 select 语句，其实不然，查询日志里面记录了数据库执行的所有命令，不管语句是否正确，如增删改查语句都会被记录，在并发操作非常多的场景下，查询信息会非常多，那么如果都记录下来会导致 IO 非常大，影响 MySQL 性能。因此如果不是在调试环境下，是不建议开启查询日志功能的。 查询日志的开启有助于帮助我们分析哪些语句执行密集，执行密集的 select 语句对应的数据是否能够被缓存，同时也可以帮助我们分析问题，因此，可以根据自己的实际情况来决定是否开启查询日志。 查询日志模式是关闭的，可以通过以下命令开启查询日志。

查看通用日志的位置

~~~mysql
SHOW VARIABLES LIKE '%general%';
##linux默认位置##     /var/lib/mysql/localhost.log                                 value值是off
##window默认位置##    C:\dev\mysql\mysql-8.0.19-winx64\data\QH-20210227YZPF.log    value值是off
~~~

默认通用日志是关闭的，可以开启

~~~mysql
set global general_log=1        ##关闭通用日志 set global general_log=0
##重启mysql服务  service mysqld restart
~~~

### 慢日志 slow log

慢日志 slow log：慢查询会导致 CPU、内存消耗过高，当数据库遇到性能瓶颈时，大部分时间都是由于慢查询导致的，慢查询导致IO阻塞，开启慢查询日志，可以让 MySQL 记录下查询超过指定时间的语句，之后运维人员通过定位分析，能够很好的优化数据库性能。默认情况下，慢查询日志是不开启的，只有手动开启了，慢查询才会被记录到慢查询日志中。

查看慢日志的位置

~~~mysql
mysql> SHOW VARIABLES LIKE 'slow_query%';
##linux默认位置##     /var/lib/mysql/localhost-slow.log                                value值是off
##window默认位置##   C:\dev\mysql\mysql-8.0.19-winx64\data\QH-20210227YZPF-slow.log    value值是off

##查询超过多少秒才记录
mysql> SHOW VARIABLES LIKE 'long_query_time';   ###时间以秒为单位
~~~

启动和设置慢查询日志

可以通过 log-slow-queries 选项开启慢查询日志。通过 long_query_time 选项来设置时间值，时间以秒为单位

~~~mysql
vim /etc/my.cnf
[mysqld]
log-slow-queries=/tmp/mysql-slow.log
long_query_time=n
~~~

还可以通过以下命令启动慢查询日志、设置指定时间：

~~~mysql
SET GLOBAL slow_query_log=ON/OFF;
#SET GLOBAL slow_query_log_file = /var/log/slow-query.log # 慢查询日志存放目录
SET GLOBAL long_query_time=5;  #设置5秒
~~~

测试：

~~~mysql
select sleep(10);  #查询10秒
~~~

### 回滚日志 undo log

> 事务原子性（Atomic），要么全部执行，要么全部不执行；事务的原子性是通过  **undolog 回滚日志**  来实现的，记录更新的相反操作 

undo log（回滚日志） ：用于存储日志被修改前的值，从而保证如果修改出现异常，可以使用 undo log 日志来实现回滚操作。 undo log 和 redo log 记录物理日志不一样，它是逻辑日志，可以认为当 delete 一条记录时，undo log 中会记录一条对应的 insert 记录，反之亦然，当 update 一条记录时，它记录一条对应相反的 update 记录，当执行 rollback 时，就可以从 undo log 中的逻辑记录读取到相应的内容并进行回滚。

~~~mysql
mysql> show variables like '%innodb_undo%';
~~~

### 重做日志 redo log

> 事务的持久性（Durability），事务提交后，其结果永久保存在数据库中。通过  **redo log 日志**  来实现的

 redo log（重做日志） ：在事务频繁提交中，为了避免每一次提交都要往磁盘写， 造成IO性能的问题，MySQL 采用了这样一种缓存机制，先将数据写入内存中，再批量把内存中的数据统一刷回磁盘。为了避免将数据刷回磁盘过程中，因为掉电或系统故障带来的数据丢失问题，InnoDB 采用 redo log 来解决此问题。 

### 二进制日志 bin log

 bin log（二进制日志） ：是一个二进制文件，主要记录所有数据库表结构变更，比如，CREATE、ALTER TABLE 等，以及表数据修改，比如，INSERT、UPDATE、DELETE 的所有操作，bin log 中记录了对 MySQL 数据库执行更改的所有操作，并且记录了语句发生时间、执行时长、操作数据等其他额外信息，但是它不记录 SELECT、SHOW 等那些不修改数据的 SQL 语句。 

binlog 的作用如下： •恢复（recovery）：某些数据的恢复需要二进制日志。

```
比如，在一个数据库全备文件恢复后，用户可以通过二进制日志进行 point-in-time 的恢复； 
复制（replication）：其原理与恢复类似，通过复制和执行二进制日志使一台远程的 MySQL 数据库（一般称为 slave 或者 standby）与一台 MySQL 数据库（一般称为 master 或者 primary）进行实时同步； binlog 默认是关闭状态，可以在 MySQL 配置文件（my.cnf）中通过配置参数 
```

~~~mysql
show variables like '%log_bin%';  ##查看binlog日志情况
~~~

修改mysql的etc下的my.cnf文件

~~~shell
[mysqld]
log_bin=ON      #打开binlog日志
##重启服务
service mysqld restart
~~~

> 重启mysql服务之后，在/var/lib/mysql/目录下会看到， ON.000001文件，这是binlog日志的基本文件名，ON.index指定的是binlog文件的索引文件，这个文件管理了所有的binlog文件的目录



## MVCC实现原理

> MVCC查询的工作流程

###  查询主键索引

* 生成Read View读视图
* 通过主键查找记录，根据记录里的DB_TRX_ID与Read View读视图进行可见性判断
* 配合DB_ROLL_PTR回滚指针和undo log来找到当前事务可见的数据记录

### 查询二级索引

* 生成Read View读视图
* 比较读视图的up_limit_id与MAX_TRX_ID大小
* 如果MAX_TRX_ID **小于** 本次Read View的up_limit_id，则全部可见，过滤记录中的有效记录
* 否则，无法通过二级索引判断可见性，需要一次遍历每条记录，反查到聚簇索引记录，通过聚簇索引记录来判断可见性

### MVCC与隔离级别

MVCC 只在 **Read Commited 和 Repeatable Read** 两种隔离级别下工作。

1.在RC隔离级别下，是**每个快照读都会生成并获取最新的Read View**；这就是我们在RC级别下的事务中可以看到别的事务提交的更新的原因

2.在RR隔离级别下，则是同一个事务中的第一个快照读才会创建Read View, 之后的快照读获取的都是同一个Read View。最后返回符合规 

总之，InnoDB 实现MVCC，是通过`Read View+ Undo Log` 实现的，Undo Log 保存了历史快照，Read View可见性规则帮助判断当前版本的数据是否可见。



# MySql 补充

参考: https://blog.csdn.net/luostudent/article/details/127011118

## 数据表:

> 表 | 必备字段:

```sql
`id` bigint(18) NOT NULL AUTO_INCREMENT COMMENT '主键id',

`creator_id` varchar(32) NOT NULL DEFAULT '' 表必须包COMMENT '创建人id',
`modifier_id` varchar(32) NOT NULL DEFAULT '' COMMENT '修改人id',
`create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`is_delete` tinyint(2) NOT NULL DEFAULT '0' COMMENT '删除标识：0未删除1已删除',
```

>  说明：

- 主键id：独立的自增的bigint，与业务无关
- 创建人id：记录创建人
- 修改人id：记录修改人
- 创建时间：程序维护、不修改，建索引
- 更新时间：数据维护 删除标识：软删除

> 注意事项:

**1.主键使用自增 int/bigint**

主键id：独立的自增的bigint，与业务无关，禁止修改

- 避免插入数据造成数据分页
- 提高二级索引的性能，二级索引包含主键
- 大表一定要bigint，防止int不够用（大约21亿左右），溢出后会导致报错。

**2.禁止使用 default NULL**

所有字段均定义为NOT NULL：

- 字符为default ‘’
- 数值为default 0
- 时间为default 0000-00-00 00:00:00

## SQL规范：

```text
访问量很大的SQL不要在数据库里做排序

禁止在DB里排序，请在web server上排序（对并发量特别大的SQL），web server有上百台，而db仅仅只有个位数的数量，排序都在db，会把db压垮。

禁止在where子句中对字段施加函数，如to_date(add_time)>xxxxx, 应改为: add_time >= 

unix_timestamp(date_add(str_to_date('20220227','%Y%m%d'),interval - 29 day))

禁止使用%做前缀模糊查询，例如LIKE “%weibo”，无法使用索引。

禁止使用select *，兼容性差，使用更多的网络流量，不能使用覆盖索引，必须回表

禁止3个以上的表join，join的字段数据类型必须绝对一致

in列表元素不能超过1000个
```



## 避坑指南:

### LEFT JOIN 增多数据条数

> 问题的产生: 左连接即使已左表为主,但是右表对应的关系存在重复数据则会产生多余的数据

### ![](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/fbmd75-0.png)

> 解决方案

参考: https://blog.csdn.net/lxy6904/article/details/114437506





























