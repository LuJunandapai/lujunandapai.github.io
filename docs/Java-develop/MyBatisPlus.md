---
title: MyBatisPlus_框架
date: 2023/04/27
---

## ----------  MyBatisPlus  ----------

## MyBatisPlus 防坑指南

```java
> 注解
* @TableId(value = "id", type = "IdType.AUTO")  | 指定id生成策略会导致 在添加时手动写入id值会添加失败或者失效且可能报错

> 配置
* map-underscore-to-camel-case: true  
  驼峰配置 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]

> API
* int updateById(T t);  |  动态修改不会一次全部修改 传一个值只修改一个值
* int delete(Wrapper<T> wrapper); | 根据条件 即所有满足的数据全部删除记录,
```



## MyBatisPlus注解

```java
// 表名注解   表名注解指定当前实体类对应的表名，比如下面 UserInfo 实体类对应表名为 user
	@TableName(value = "user")

// 字段名注解  除了全局配置方法外，使用注解来指定对应的  
	// 主键
	@TableId(value = "id")
	// id的生成策略 能够根据内置的规则生成id 需要把数据库的id自动增长关闭
	@TableId(type = "IdType.AUTO")

 	// 指定与数据库字段对应  
	@TableField(value = "user_name")
	// 表示此字段是否在此表存在 默认: true存在 反之: false不存在
	@TableField(exist = false)
	// 设置属性是否参与查询，默认: true参与查询 反之: false不查询 此属性与select()映射配置不冲突
	@TableField(select = false) 
```



## Id 的生成策略

#### 详解

![image-20220728221239990](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220728221239990.png)

#### 局部配置

> id的生成策略 能够根据内置的规则生成id 需要把数据库的id自动增长关闭

```java
@TableId(value = "id", type = IdType.AUTO)
private Long id;
```

#### 全局配置

配置 yml 配置文件里 所有的实体类的id都将使用该 ID的生成策略

```yml
mybatis-plus:
    ## 关闭 mybatis-plus 启动日志
    global-config:
        banner: false
        ## id的生成策略
        db-config:
            id-type: auto
```







## MyBatisPlus 配置 表名 - 字段

### 配置对应表名

具体介绍: https://blog.csdn.net/Zack_tzh/article/details/107487209

#### 下划线 表名配置

> - [x] **resources** 包下的 application.yml 配置
>
> MyBatisPlus 实体类 与 数据库表名 不对应 设置实体类的前缀拼接成表名
>
> 如果数据库中所有表都有个表名前缀，比如我们想让 **smbms_info** 表仍然对应 **Info** 实体类，可以添加如下全局配置设置表名前缀：

```yml
mybatis-plus:
  ## 设置 扫描 entity 实体类包
  type-aliases-package: com.apai.entity
  ## 设置 扫描 mapper.xml sql语句包 文件
  mapper-locations: classpath:com/apai/mapper/*.xml
  ## 设置日志打印
  configuration:
  	## 实体类 和 表 列名的对应设置 false 表示不开启驼峰 true表示开启驼峰功能
  	## 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  	## 开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
  ## MyBatisPlus 实体类 与 数据库表名 不对应 设置实体类的前缀拼接成表名
  global-config:
    db-config:
      table-prefix: smbms_
```

#### 大小写区分表名配置

> MyBatisPlus 实体类 与 表名 有大小写区分 解决方法
>
> 如果所有表名都不是下划线命名（但能跟类名对应上），比如想让 **userinfo** 表对应 **UserInfo** 实体类，可以添加如下全局配置，表示数据库表不使用下划线命名：

```yml
mybatis-plus:
  ## 设置 扫描 entity 实体类包
  type-aliases-package: com.apai.entity
  ## 设置 扫描 mapper.xml sql语句包 文件
  mapper-locations: classpath:com/apai/mapper/*.xml
  ## 设置日志打印
  configuration:
  	## 实体类 和 表 列名的对应设置 false 表示不开启驼峰 true表示开启驼峰功能
  	## 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  	## 开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
  ## MyBatisPlus 实体类 与 表名 有大小写区分 解决方法
  global-config:
    db-config:
      table-underline: false
```

#### 使用注解 **@TableName**

> **使用** **@TableName** 表名注解指定当前实体类对应的表名，比如下面 **UserInfo** 实体类对应表名为 **user**：

```java
@Data
@TableName(value = "user") // 设置表名
public class UserInfo {
    private Integer id;
    private String userName;
    private String passWord;
}
```

### 设置关联的字段名

#### 下划线 列名与字段

> 同表名一样，如果数据库表里的字段名使用标准的下划线命名，并且能对应上实体类的成员名称（驼峰命名），我们就不需要特别去手动匹配。比如下面 **user_info** 表里的字段会自动跟 **UserInfo** 实体类的各个成员属性一一对应：

#### 列名使用驼峰 字段配置

> 如果数据库表里的字段名并不是使用下划线命名（但能跟实体类的成员名称对应上），可以添加如下全局配置，表示数据库表字段名不使用下划线命名： 列名 userName   字段 userName

```yml
mybatis-plus.configuration.map-underscore-to-camel-case=false

mybatis-plus:
  ## 设置 扫描 entity 实体类包
  type-aliases-package: com.apai.entity
  ## 设置 扫描 mapper.xml sql语句包 文件
  mapper-locations: classpath:com/apai/mapper/*.xml
  ## 设置日志打印
  configuration:
  	## 实体类 和 表 列名的对应设置 false 表示不开启驼峰 true表示开启驼峰功能
  	## 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  	## 开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
  ## MyBatisPlus 实体类 与 表名 有大小写区分 解决方法
  global-config:
    db-config:
      table-underline: false
```

#### 使用注解 **@TableId **  **@TableField** 配置

> 除了全局配置方法外，我们还可以使用 **@TableId** 注解（标注在主键上）和 **@TableField** 注解（标注在其他成员属性上）来指定对应的字段名

```java
@Data
public class UserInfo {
    @TableId(value = "id")
    private Integer id;
    @TableField(value = "user_name")
    private String userName;
    @TableField(value = "pass_word")
    private String passWord;
}
```



## MyBatisPlus  使用步骤

### 添加MyBatisPlus 依赖

```xml
创建 springboot 项目  添加需支持的依赖 和 对应的配置
特别注意:  <!--mybatis-plus 启动器-->  和   <!--分页插件-->  会产生依赖冲突 会造成异常
解决方法:  排除分页插件的异常的依赖   可解决报错

<!--mybatis-plus 启动器-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
```

### Mapper继承BaseMapper<实体类>

> Mapper 继承 BaseMapper<实体类> 之后 会自动创建基本的 CUDR 可直接调用方法 实现sql语句的操作



## 条件构造器

> 更多条件详见: https://baomidou.com/pages/10c804/#abstractwrapper

#### eq | 等于 =

```java
eq(R column, Object val)
eq(boolean condition, R column, Object val)
```

- 例: `eq("name", "老王")`--->`name = '老王'`

#### ne | 不等于 <>

```java
ne(R column, Object val)
ne(boolean condition, R column, Object val)
```

- 例: `ne("name", "老王")`--->`name <> '老王'`

#### gt | 大于 >

```java
gt(R column, Object val)
gt(boolean condition, R column, Object val)
```

- 例: `gt("age", 18)`--->`age > 18`

#### ge | 大于等于 >=

```java
ge(R column, Object val)
ge(boolean condition, R column, Object val)
```

- 例: `ge("age", 18)`--->`age >= 18`

#### lt  | 小于 <

```java
lt(R column, Object val)
lt(boolean condition, R column, Object val)
```

- 例: `lt("age", 18)`--->`age < 18`

#### le | 小于等于 <=

```java
le(R column, Object val)
le(boolean condition, R column, Object val)
```

- 例: `le("age", 18)`--->`age <= 18`

#### between | 范围之内

```java
between(R column, Object val1, Object val2)
between(boolean condition, R column, Object val1, Object val2)
```

- BETWEEN 值1 AND 值2
- 例: `between("age", 18, 30)`--->`age between 18 and 30`

#### notBetween | 范围之外

```java
notBetween(R column, Object val1, Object val2)
notBetween(boolean condition, R column, Object val1, Object val2)
```

- NOT BETWEEN 值1 AND 值2
- 例: `notBetween("age", 18, 30)`--->`age not between 18 and 30`

#### like | 包含

```java
like(R column, Object val)
like(boolean condition, R column, Object val)
```

- LIKE '%值%'
- 例: `like("name", "王")`--->`name like '%王%'`

#### notLike | 不要包含

```java
notLike(R column, Object val)
notLike(boolean condition, R column, Object val)
```

- NOT LIKE '%值%'
- 例: `notLike("name", "王")`--->`name not like '%王%'`

#### likeLeft | 结尾

```java
likeLeft(R column, Object val)
likeLeft(boolean condition, R column, Object val)
```

- LIKE '%值'
- 例: `likeLeft("name", "王")`--->`name like '%王'`

#### likeRight | 开头

```java
likeRight(R column, Object val)
likeRight(boolean condition, R column, Object val)
```

- LIKE '值%'
- 例: `likeRight("name", "王")`--->`name like '王%'`

#### isNull | 值为空

```java
isNull(R column)
isNull(boolean condition, R column)
```

- 字段 IS NULL
- 例: `isNull("name")`--->`name is null`

#### isNotNull | 不为空

```java
isNotNull(R column)
isNotNull(boolean condition, R column)
```

- 字段 IS NOT NULL
- 例: `isNotNull("name")`--->`name is not null`





## 持久层调用 CRUD及分页

![image-20220601225020569](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220601225020569.png)

### 条件 方法 和 写入

```java
// QueryWrapper 条件的构造 实体对象封装操作类（可以为 null）
QueryWrapper<T> queryWrapper = new QueryWrapper<>();
// 基础写法
queryWrapper.like("列名", "值"); // 包含: like
// 链式编程 写法
queryWrapper.like("列名", "值").ge("列名", "值");
// lambda 写法
queryWrapper.lambda().like(T::get属性, "值");


// LambdaQueryWrapper 条件的构造
LambdaQueryWrapper<T> lambdaQueryWrapper = new LambdaQueryWrapper<>();
// lambda 写法
lambdaQueryWrapper.like(T::get属性, "值");
// 链式编程 写法 
lambdaQueryWrapper.like(T::get属性, "值").ge(T::get属性, "值"); // 并且
lambdaQueryWrapper.like(T::get属性, "值").or().ge(T::get属性, "值"); // 或者 or()
```

#### 判空执行条件

> 即  当条件值为 null 则不写该值作为条件

```java
// LambdaQueryWrapper 条件的构造 T:实体类
LambdaQueryWrapper<T> lambdaQueryWrapper = new LambdaQueryWrapper<>();
// lambda 写法 也可写成 链式结构
lambdaQueryWrapper.like(null != T::get属性(), T::get属性, "值");
```

#### 查询投影

> 即 相对于sql指定查询的列名 没指定的列名映射到实体类则为空

```java
// QueryWrapper 条件的构造 实体对象封装操作类（可以为 null）
QueryWrapper<T> queryWrapper = new QueryWrapper<>();
queryWrapper.select("列名1", "列名2", ...)
    
// LambdaQueryWrapper 条件的构造
LambdaQueryWrapper<T> lambdaQueryWrapper = new LambdaQueryWrapper<>();
lambdaQueryWrapper.select(T::get属性1, T::get属性2, ...)
    
// 查询 特殊值 如: 分组统计 ...
QueryWrapper<T> queryWrapper = new QueryWrapper<>();
queryWrapper.select("count(*) as nums, 分组列名"); // 统计分组行数
queryWrapper.griupBy("分组列名")  // 根据列名分组
List<Map<String, Object>> maps = Mapper.selectMaps(queryWrapper);
```



### Select 查询

```java
// 根据 ID 查询
T selectById(Serializable id);
// 根据 entity 条件，查询一条记录
T selectOne(QueryWrapper<T>);

// 根据 entity 条件，查询全部记录
List<T> selectList(null 或者 QueryWrapper<T> 或者 LambdaQueryWrapper<T>);
// 根据 id 集合 | 批量查询
int selectBatchIds(List<Long> list); 
// 查询（根据 columnMap 条件）
List<T> selectByMap(Map<String, Object> columnMap);
```



### innser 增加

```java
// 添加 | T 实体类 | 添加成功后 直接调用传入的实体类可获取自动增长的ID
int insert(T t);
```



### delete 删除

```java
// 根据 id 删除 | 删除一条指定 id 的数据
int deleteById(int id); 


// 根据 id 集合[单纯的储存id的类型集合 实体类的集合报错] | 批量删除
int deleteBatchIds(List<Long> list);
    // 如: 删除 id 为 77 76 的数据
    List<Long> userList = new ArrayList<>();
    userList.add(77l);
    userList.add(76l);
    userMapper.deleteBatchIds(userList);

// 根据 entity 条件，删除记录 | 满足条件的所有数据都会被删除
int delete(Wrapper<T> wrapper);
    // 如: 删除手机号为 777 的所有数据
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.lambda().eq(User::getPhone, "777");
    userMapper.delete(queryWrapper);

// 根据 columnMap 条件，删除记录
int deleteByMap(Map);
	// 如: 删除 age 为 20 的数据 map.put("列名", "值");
	Map<String, Object> map = new HashMap();
    map.put("apai_age", "20");
    isluMapper.deleteByMap(map);
```

#### 逻辑删除

> 不进行真实的物理删除 只是修改器状态 删除的sql变为修改的sql
>
> 该注解 会使所有的查询 加上删除的状态 如果为删除的状态是不会被查询出来
>
> 如果需要全查 则只能自己写出sql

**局部配置**

```java
// 实体类设置 状态 的字段
// 该注解 会使所有的查询 加上删除的状态
@TableLogic(value = "未删除状态值", delval = "删除的状态值")
private Integer deleted;

// 根据 id 删除
int deleteById(int id);
```

**全局配置**

```yml
mybatis-plus:
    ## 关闭 mybatis-plus 启动日志
    global-config:
        banner: false
        ## id的生成策略
        db-config:
            id-type: auto
            logic-dekete-field: 逻辑删除的字段名称
            logic-not-delete-value: 为删除的状态值
            logic-delete-value: 删除的状态值
```





### update 修改

```java
// 根据 id 修改 | T 实体类 | 动态修改不会一次全部修改
int updateById(T t);
// 根据 条件 修改全部符合条件的数据 | 动态修改不会一次全部修改
int update(T Entity, Wrapper<T> whereWrapper);
// 如: 修改 age 为 30 的所有数据 | 修改的内容为 实体类 | 动态修改
QueryWrapper<Islu> queryWrapper = new QueryWrapper<>();
queryWrapper.lambda().eq(Islu::getApaiAge, "30");
Islu islu = new Islu();
islu.setApaiAge(10);
islu.setApaiSex("男");
isluMapper.update(islu, queryWrapper);
```



## 业务层调用 CRUD及分页

### 条件 简写

> 条件:
>
> eq - 等于  ne - 不等于  gt - 大于  ge - 大于等于  lt - 小于   le - 小于等于
>
> like - 模糊查询

### Select 查询

```java
// 查询条件类 使用该类 进行条件的判断
QueryWrapper<实体类> queryWrapper = new QueryWrapper<>();
queryWrapper.eq("列名", 值);
queryWrapper.like("列名", 值);

// 查询全部不带条件 List
	List<User> userList = userService.list();
// 查询全部带条件 List(queryWrapper)
	List<User> userList = userService.list(queryWrapper);

// 查询单组数据 getOne(queryWrapper)
	Admin admin = adminService.getOne(queryWrapper);
```



### innser 增加

```java
// 增加数据 save(实体类对象)
	itemService.save(item); // 如果相同的数据多次调用此添加语句 则数据库会添加多条相同的数据
```



### delete 删除

```java
// 根据id删除  removeById(Id)
	itemService.removeById(itemId);
// 批量删除 removeByIds(id的集合)
	List<Long> ids = new ArrayList<>();
	boolean b = itemService.removeByIds(ids);
// 根据条件删除
QueryWrapper<Amount> queryWrapper = new QueryWrapper<>();
queryWrapper.eq("nid", id);
amountService.remove(queryWrapper);
```



### update 修改

```java
// 根据id修改  updateById(实体类对象)
itemService.updateById(item);
```



## MyBatisPlus 杂记

### MyBatisPlus 取消启动日志

> 可见: spring 常用模板的yml总汇配置

![image-20220728215610494](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220728215610494.png)

## MyBatisPlus 插件

### 分页插件

详解:  https://baomidou.com/pages/97710a/#page

![image-20230320165533849](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20230320165533849.png)

#### 分页测试

```java
package com.apai;

import com.apai.entity.UserAdmin;
import com.apai.mapper.UserAdminMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;


@SpringBootTest
class WxgzhappApplicationTests {

    @Autowired
    private UserAdminMapper userAdminMapper;

    @Test
    void contextLoads() {
        // 设置 分页 页码和每页条数
        Page<UserAdmin> page = new Page<>(1, 3);
        // MyBatisPlus 的基础分页查询
        userAdminMapper.selectPage(page, null);
        // page 内存储具体信息 返回的数据 总条数等等
        System.out.println("总条数" + page.getTotal());
        List<UserAdmin> records = page.getRecords();
        for (UserAdmin record : records) {
            System.out.println("数据" + record);
        }
    }
}
```

#### 基础分页

> 创建分页配置类MybatisPlusConfig

```java
package com.apai.config.mybatis;

import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus配置
 */
@Configuration
public class MybatisPlusConfig {

    @Bean
    public PaginationInterceptor mybatisPlusInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        // 设置请求的页面大于最大页后操作， true调回到首页，false 继续请求  默认false
        // paginationInterceptor.setOverflow(false);
        // 设置最大单页限制数量，默认 500 条，-1 不受限制
        // paginationInterceptor.setLimit(500);
        // 开启 count 的 join 优化,只针对部分 left join
        //paginationInterceptor.setCountSqlParser(new JsqlParserCountOptimize(true));
        return paginationInterceptor;
    }
}
```

> 分页流程

```java
// 表现层
@PostMapping("/selectUser2")
public ResponseResult selectUser2(@RequestBody UserAdmin userAdmin){
    Page<UserAdmin> userAdmins = userAdminService.selectUserPage(userAdmin);
    return new ResponseResult(userAdmins, "成功", 200);
}
// 业务层接口
Page<UserAdmin> selectUserPage(UserAdmin userAdmin);
// 业务层
@Override
public Page<UserAdmin> selectUserPage(UserAdmin userAdmin) {
    Page<UserAdmin> page = new Page<>(userAdmin.getPageNum(), userAdmin.getPageSize());
    // 调用自己写的sql 可进行条件查询等
    List<UserAdmin> userAdmins = baseMapper.selectIsPage(page, userAdmin);
    page.setRecords(userAdmins);
    return page;
}
// mapper
List<UserAdmin> selectIsPage(Page<UserAdmin> page, @Param("entity") UserAdmin userAdmin);
// mapper.xml
<select id="selectIsPage" resultType="com.apai.entity.UserAdmin">
    select * from user_admin where ...
</select>
```

### 自动填充插件

> 在 新增或者修改 对于一些固定字段的自动插入 例如创建时间和修改时间两个字段
>
> 参考: [Mybatis-plus的自动填充功能_mybatis-plus自动填充_雨会停rain的博客-CSDN博客](https://blog.csdn.net/wang20010104/article/details/124198229)

#### 实体类 字段注解指定

```java
// @TableField(fill = FieldFill.INSERT_UPDATE) 在修改和新增时都会触发 也可更改其他情况触发

@ApiModelProperty("修改人ID")
@TableField(value = "update_userid", fill = FieldFill.INSERT_UPDATE)
private Integer updateUserid;

@ApiModelProperty("修改时间")
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
@TableField(value = "update_date", fill = FieldFill.INSERT_UPDATE)
private LocalDateTime updateDate;
```

#### 自动填充配置类

```java
package com.apai.config.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis-Plus 自动填充组件
 */
@Component
public class MyBatisPlusMetaObjectHandler implements MetaObjectHandler {

   // 实体类填充的字段名称 需使用 @TableField(fill = FieldFill.INSERT_UPDATE) 注解指定
   // setFieldValByName("实体类填充的字段名称", 填充的值, metaObject);
   // insertFill() 方法在插入时自动填充
   // updateFill() 方法在更新时自动填充

   @Override
   public void insertFill(MetaObject metaObject) {
      // 写法一: 通过setFieldValByName()方法自动为字段赋值
      // this.setFieldValByName("updateUserid", 1, metaObject);
      // this.setFieldValByName("updateDate", LocalDateTime.now(), metaObject);

      // 写法二: 先获取字段值，判断是否为空，不为空表示人为赋值，不进行填充, 为空则进行填充
      Object updateUserid = getFieldValByName("updateUserid", metaObject);
      if (null == updateUserid) {
         //字段为空，可以进行填充
         setFieldValByName("updateUserid", 1, metaObject);
      }
      Object updateDate = getFieldValByName("updateDate", metaObject);
      if (null == updateDate) {
         //字段为空，可以进行填充
         setFieldValByName("updateDate", LocalDateTime.now(), metaObject);
      }

   }
   
   @Override
   public void updateFill(MetaObject metaObject) {
      // 写法二: 先获取字段值，判断是否为空，不为空表示人为赋值，不进行填充, 为空则进行填充
      Object updateUserid = getFieldValByName("updateUserid", metaObject);
      if (null == updateUserid) {
         //字段为空，可以进行填充
         setFieldValByName("updateUserid", 1, metaObject);
      }
      Object updateDate = getFieldValByName("updateDate", metaObject);
      if (null == updateDate) {
         //字段为空，可以进行填充
         setFieldValByName("updateDate", LocalDateTime.now(), metaObject);
      }
   }
}
```





## 代码生成器

### mybatis - 代码生成器

#### pom.xml 生成器插件配置

```xml
// mybatis - 代码生成器 pom.xml  的 <plugins> 插件标签内
    
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.4.0</version> <!-- 不要低于 1.3.7 版本 -->
    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.22</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-core</artifactId>
            <version>1.4.0</version> <!-- 不要低于 1.3.7 版本 -->
        </dependency>
    </dependencies>
    <configuration>
        <verbose>true</verbose> <!-- 允许移动生成的文件 -->
        <overwrite>true</overwrite> <!-- 是否覆盖 -->
        <!--配置文件的路径 -->
        <configurationFile>src/main/resources/generatorConfig.xml</configurationFile>
    </configuration>
</plugin>
```

#### generatorConfig.xml  配置

> 代码生成器的启动类  
>
> 注意:  可配置 数据库 和 表 的实体类 数据访问层 的配置 开启自动生成

```xml
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <context id="smbms"   targetRuntime="MyBatis3">
        <!-- 覆盖生成 XML 文件的 Bug 解决 -->
        <plugin type="org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin" />
        <commentGenerator>
            <!--关闭时间注释 -->
            <property name="suppressDate" value="true"/>
            <!-- 是否去除自动生成的注释 true：是 ： false:否 -->
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>
        <!--数据库链接URL，用户名、密码 -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/smbms?useSSL=false&amp;serverTimezone=UTC"
                        userId="root" password="123456">
        </jdbcConnection>
        <javaTypeResolver>
            <property name="forceBigDecimals" value="false"/>
        </javaTypeResolver>
        <!-- 生成po的包名和位置-->
        <javaModelGenerator targetPackage="com.woniu.entity" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>
        <!-- 生成映射XML文件的包名和位置-->
        <sqlMapGenerator targetPackage="com.woniu.mapper" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
        </sqlMapGenerator>
        <!-- 生成dao文件包名和位置-->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.woniu.mapper" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
        </javaClientGenerator>
        <!-- 要生成哪些表-->
        <table tableName="smbms_role" catalog="smbms"   domainObjectName="Role"
               enableCountByExample="true"
               enableUpdateByExample="true"
               enableDeleteByExample="true"
               enableSelectByExample="true" selectByExampleQueryId="true">
            <property name="ignoreQualifiersAtRuntime" value="true"/>
            <generatedKey column="id" sqlStatement="Mysql" type="post" identity="true"/>
        </table>
    </context>
</generatorConfiguration>
```

#### 开启自动生成

![image-20220601174717702](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220601174717702.png)



### Mybatis-plus 代码生成器

#### 添加依赖

> pom.xml 文件内   
>
> 特别注意: 还要 Mybatis-plus 依赖  但是与分页插件有依赖冲突

```xml
<!--mybatis-plus 启动器-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
<!--mybatis-plus 代码生成器-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.1</version>
</dependency>
<!--mybatis-plus 代码生成器模板引擎-->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>

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

#### 添加 模板引擎

> **可直接写在测试类里** 使用单元测试开启 即可
>
> 注意:  更改对应的配置  实体类 自动生成set和get 需修改 @Data 注解

```java
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import org.junit.jupiter.api.Test;

import java.util.Collections;

public class MybatisPlusGenerator {


    @Test
    public void generator() {
        //生成的文件放置目录 必须以 '\\ 或者 /' 结尾
        String outputDir = "C:/Users/Lujun/Documents/IDEA/SpringBootParent/SpringBootParent/SpringApai02/src/main/java/";
        //设置父包名
        String packageName = "com.apai";
        // 数据库信息
        String mapperXmlDir = outputDir + packageName.replaceAll("\\.", "/") + "/mapper";
        String url = "jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai";
        FastAutoGenerator.create(url, "root", "123456")
                .globalConfig(builder -> {
                    // 设置作者
                    builder.author("阿派")
                            // 开启 swagger 模式
                            // .enableSwagger()
                            // 覆盖已生成文件
                            .fileOverride()
                            // 指定输出目录
                            .outputDir(outputDir);
                }).packageConfig(builder -> {
                    // 设置父包名
                    builder.parent(packageName)
                            // 设置mapperXml生成路径
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml, mapperXmlDir));
                }).strategyConfig(builder -> {
                    builder.addInclude("smbms_user", "smbms_role")  //给该表生成
                            .addTablePrefix("smbms_") //设置过滤表前缀
                            .entityBuilder().enableLombok() //entity 使用 lombok
                        	//不开启驼峰: NamingStrategy.no_change 带下划线的表会自动生成注解
                        	// 开启驼峰:NamingStrategy.underline_to_camel 注意更改yml配置
                            .entityBuilder().columnNaming(NamingStrategy.no_change)
                            .controllerBuilder() //创建Controller
                            // .enableRestStyle() //使用restController
                            .mapperBuilder().enableMapperAnnotation();//开启mapper注解
                    // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                }).templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }
}

```



### 自定义代码生成器 [老三分层]

> 基于: Mybatis-plus 代码生成器修改而来 | 需要对应的依赖
>
> 可根据官网进行配置修改: https://baomidou.com/pages/981406/#%E6%95%B0%E6%8D%AE%E5%BA%93%E9%85%8D%E7%BD%AE-datasourceconfig

```java
package com.apai;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.Collections;

import static com.baomidou.mybatisplus.annotation.IdType.ASSIGN_ID;

public class MybatisPlusGenerator {

    public static void main(String[] args) {

        // <----- 代码生成器必须指定项 ----->
        // 生成的文件放置目录 必须以 '\\ 或者 /' 结尾 如: F:/paidaxing/
        String outputDir = "F:/paidaxing11/";
        // 设置父包名 如: com.apai
        String packageName = "com.apai";
        // 数据库连接信息
        String url = "jdbc:mysql://localhost:3306/strangerthings?serverTimezone=UTC";
        String name = "root";
        String password = "123456";
        // 需要生成的表名 及 表前缀
        String[] tableNames = {"user", "category", "jurisdiction", "permission"};
        String[] tablePrefix = {""};
        // 项目作者名称
        String author = "是阿派啊";
        // 指定 mapperXml文件 的位置
        String mapperXmlDir = outputDir + packageName.replaceAll("\\.", "/") + "/mapper";

        // 创建备用文件夹
//        String context = outputDir + packageName.replaceAll("\\.", "/");
//        String[] folders = {
//                "/inlet/web/vo"
//        };
//        for (String folder : folders) {
//            new File(context + folder).mkdirs();
//        }

        // 根据信息 开始生成代码
        FastAutoGenerator.create(url, name, password)
                // --- 全局配置(GlobalConfig)
                .globalConfig(builder -> {
                    builder.author(author) // 设置作者
                            .enableSwagger() // 开启 swagger 模式
                            .fileOverride() // 覆盖已生成文件
                            .outputDir(outputDir); // 指定输出目录
                })
                // --- 包配置(PackageConfig)
                .packageConfig(builder -> {
                    // 设置父包名
                    builder.parent(packageName)
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml, mapperXmlDir)); // 设置mapperXml生成路径
                })
                // --- 策略配置(StrategyConfig)
                .strategyConfig(builder -> {
                    builder.addInclude(tableNames)  // 给该表生成
                            .addTablePrefix(tablePrefix) // 设置过滤表前缀
                            // 实体类配置
                            .entityBuilder()
                            .enableLombok() // entity 使用 lombok 注解
                            .idType(ASSIGN_ID) // 设置自动生成主键类型的策略
                            .columnNaming(NamingStrategy.no_change) // 驼峰:数据库列名到实体类字段名的映射策略
                            // 业务层配置
                            .serviceBuilder()
                            // 表现层配置
                            .controllerBuilder()
                            .enableRestStyle() // 开启生成 @RestController 控制器
                            // 数据层配置
                            .mapperBuilder()
                            .enableMapperAnnotation(); // 开启 mapper 注解
                })
                // --- 模板配置(TemplateConfig)
                .templateEngine(new FreemarkerTemplateEngine()) // 使用 Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}
```



### 自定义代码生成器 [新分层]

> 基于: Mybatis-plus 代码生成器修改而来 | 需要对应的依赖
>
> 可根据官网进行配置修改: https://baomidou.com/pages/981406/#%E6%95%B0%E6%8D%AE%E5%BA%93%E9%85%8D%E7%BD%AE-datasourceconfig

```java
package com.apai;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.io.File;

import static com.baomidou.mybatisplus.annotation.IdType.ASSIGN_ID;

public class MybatisPlusGenerator {


    public static void main(String[] args) {

        // <----- 代码生成器必须指定项 ----->
        // 生成的文件放置目录 必须以 '\\ 或者 /' 结尾 如: F:/paidaxing/
        String outputDir = "F:/paidaxing/";
        // 设置父包名 如: com.apai
        String packageName = "com.apai";
        // 数据库连接信息
        String url = "jdbc:mysql://localhost:3306/strangerthings?serverTimezone=UTC";
        String name = "root";
        String password = "123456";
        // 需要生成的表名 及 表前缀
        String[] tableNames = {"user", "category", "jurisdiction", "permission"};
        String[] tablePrefix = {""};
        // 项目作者名称
        String author = "apai";

        // 指定文件的位置 [. --> /] 注意:开头不要是"." 与类的包位置有关
        String controllerDir = "inlet.web";
        String serviceImplDir = "service.impl";
        String serviceDir = "service";
        String mapperDir = "outlet.mapper";
        String mapperXmlDir = "outlet.mapper";
        String entityDir = "outlet.po";

        // 创建备用文件夹
        String context = outputDir + packageName.replaceAll("\\.", "/");
        String[] folders = {
                "/inlet/web/vo", "/inlet/subcribe", "/inlet/timer",// 表现层文件夹
                "/service/dto", // 业务层文件夹
                "/outlet/rides", "/outlet/es", // 数据层文件夹
                "/config/rabbitMq", "/config/security", "/config/otherfolders", // 配置文件夹
                "/adapter", "/exception", "/utils"
        };
        for (String folder : folders) {
            new File(context + folder).mkdirs();
        }

        // 根据信息 开始生成代码
        FastAutoGenerator.create(url, name, password)
                // --- 全局配置(GlobalConfig)
                .globalConfig(builder -> {
                    builder.author(author) // 设置作者
                            .enableSwagger() // 开启 swagger 模式
                            .fileOverride() // 覆盖已生成文件
                            .outputDir(outputDir); // 指定输出目录
                })
                // --- 包配置(PackageConfig)
                .packageConfig(builder -> {
                    builder.parent(packageName) // 设置父包名
                            .controller(controllerDir) // 设置 controller 的位置
                            .serviceImpl(serviceImplDir) // 设置 serviceImpl 的位置
                            .service(serviceDir) // 设置 service 的位置
                            .mapper(mapperDir)// 设置 mapper 的位置
                            .xml(mapperXmlDir) // 设置 mapperxml 的位置
                            .entity(entityDir) // 设置 entity 的位置
                            .build();
                })
                // --- 策略配置(StrategyConfig)
                .strategyConfig(builder -> {
                    builder.addInclude(tableNames)  // 给该表生成
                            .addTablePrefix(tablePrefix) // 设置过滤表前缀
                            // 实体类配置
                            .entityBuilder()
                            .enableLombok() // entity 使用 lombok 注解
                            .idType(ASSIGN_ID) // 设置自动生成主键类型的策略
                            .columnNaming(NamingStrategy.no_change) // 驼峰: 数据库列名到实体类字段名的映射策略
                            // 业务层配置
                            .serviceBuilder()
                            // 表现层配置
                            .controllerBuilder()
                            .enableRestStyle() // 开启生成 @RestController 控制器
                            // 数据层配置
                            .mapperBuilder()
                            .enableMapperAnnotation(); // 开启 mapper 注解
                })
                // --- 模板配置(TemplateConfig)
                .templateEngine(new FreemarkerTemplateEngine()) // 使用 Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}

```





## 码云 代码生成器

```java
package com.apai;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import static com.baomidou.mybatisplus.annotation.IdType.ASSIGN_ID;

public class MyYunGenerate {

    public static void main(String[] args) {

        // <----- 代码生成器必须指定项 ----->
        // 生成的文件放置目录 必须以 '\\ 或者 /' 结尾 如: F:/paidaxing/
        String outputDir = "C:/paidaxing/";
        // 设置父包名 如: com.apai
        String packageName = "com.my.pin";
        // 数据库连接信息
        String url = "jdbc:mysql://192.168.1.88:3306/anming?serverTimezone=UTC";
        String name = "root";
        String password = "mayun1688";
        // 需要生成的表名 及 表前缀 "user", "category", "jurisdiction", "permission"
        String[] tableNames = {"produce_plan_record"};
        String[] tablePrefix = {""};
        // 项目作者名称
        String author = "apai";

        // 指定文件的位置 [. --> /] 注意:开头不要是"." 与类的包位置有关
        String controllerDir = "controller.admin";
        String serviceImplDir = "service.impl";
        String serviceDir = "service";
        String mapperDir = "mapper";
        String mapperXmlDir = "mapper";
        // 实体类备选: furniture plastic system
        String entityDir = "entity.system";

        // 根据信息 开始生成代码
        FastAutoGenerator.create(url, name, password)
                // --- 全局配置(GlobalConfig)
                .globalConfig(builder -> {
                    builder.author(author) // 设置作者
                            .enableSwagger() // 开启 swagger 模式
                            .fileOverride() // 覆盖已生成文件
                            .outputDir(outputDir); // 指定输出目录
                })
                // --- 包配置(PackageConfig)
                .packageConfig(builder -> {
                    builder.parent(packageName) // 设置父包名
                            .controller(controllerDir) // 设置 controller 的位置
                            .serviceImpl(serviceImplDir) // 设置 serviceImpl 的位置
                            .service(serviceDir) // 设置 service 的位置
                            .mapper(mapperDir)// 设置 mapper 的位置
                            .xml(mapperXmlDir) // 设置 mapperxml 的位置
                            .entity(entityDir) // 设置 entity 的位置
                            .build();
                })
                // --- 策略配置(StrategyConfig)
                .strategyConfig(builder -> {
                    builder.addInclude(tableNames)  // 给该表生成
                            .addTablePrefix(tablePrefix) // 设置过滤表前缀
                            // 实体类配置
                            .entityBuilder()
                            .enableLombok() // entity 使用 lombok 注解
                            .idType(ASSIGN_ID) // 设置自动生成主键类型的策略
                            .columnNaming(NamingStrategy.no_change) // 驼峰: 数据库列名到实体类字段名的映射策略
                            // 业务层配置
                            .serviceBuilder()
                            // 表现层配置
                            .controllerBuilder()
                            .enableRestStyle() // 开启生成 @RestController 控制器
                            // 数据层配置
                            .mapperBuilder()
                            .enableMapperAnnotation(); // 开启 mapper 注解
                })
                // --- 模板配置(TemplateConfig)
                .templateEngine(new FreemarkerTemplateEngine()) // 使用 Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }

}

```



















