---
title: 阿派的工具类
date: 2023/04/26
---

# | -- 阿派的工具类

# Spring Boot 事务工具类

## 事务_注解配置

```java
// 启动类 开启事务
@EnableTransactionManagement
// 业务层方法 指定事务方法
@Translation
```

## 事务_工具类

> 依赖

```xml
<!-- AOP 面向切面编程 事务支持-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

> 事务_配置包 config 包下   WebConfig

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
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.interceptor.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Spring Boot 事务配置工具类
 * 注意: 依赖于 spring-boot-starter-aop
 *      需要指定事务管理的业务层的位置
 *      事务管理器需要指定需要管理的方法名称
 */
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
        // 事务规则 | 以指定的名称开头的方法都会被事务管理 | 事务管理器会根据规则进行事务的提交或回滚
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



# JSON 序列化工具类

## JSON 转换依赖:

json 转换补充: https://blog.51cto.com/u_13561776/3691828

https://blog.csdn.net/angsu7023/article/details/102126540

```xml
<!-- json 序列化 | 反序列化 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.70</version>
</dependency>
```

### JSON依赖 常用 API

```java
// 序列化 对象
Object o = JSON.toJSON(对象);
String s = JSON.toJSONString(对象);
// 反序列化 对象
对象类型 变量名 = JSON.parseObject(序列化对象, 对象类名.class);

// 序列化 集合
String mapJson = JSON.toJSONString(map);
String listjson = JSON.toJSONString(list);
// 反序列化 集合
List<集合类型> strings = JSON.parseArray(listjson, 集合类型.class);

// 直接对日期进行格式化
String dataString = JSON.toJSONString(date);
// 使用SerializerFeature特性格式化日期
String dateJson = JSON.toJSONString(date, SerializerFeature.WriteDateUseDateFormat);
// 指定输出日期格式
String dateJson = JSON.toJSONStringWithDateFormat(date,"yyyy-MM-dd HH:mm:ss");
```

## JSON工具类

```java
package com.apai.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.PropertyFilter;

import java.util.List;

/**
 * Json 处理工具类
 *
 * @author: Apai_阿派
 * @date: 2023_02_03
 * @说明: 关联依赖: fastjson
 * @补充: 序列号和反序列化 | 补充参考: https://blog.csdn.net/angsu7023/article/details/102126540
 * @json格式化网址: https://c.runoob.com/front-end/53/
 */
public class MyJsonUtils {

    /**
     * -- 对象转化为json字符串
     * @param obj 待转化对象: 对象 | List | Map | 数组 | set
     * @return 代表该对象的Json字符串
     */
    public static String toJson(Object obj) {
        return JSON.toJSONString(obj);
    }

    /**
     * -- 对象转化为json字符串 可格式化
     * @param obj  待转化对象: 对象 | List | Map | 数组 | set
     * @param format 是否要格式化 true:格式化 false:不格式化
     * @return 代表该对象的Json字符串
     */
    public static String toJson(Object obj, boolean format) {
        return JSON.toJSONString(obj, format);
    }


    /**
     * -- 对象转化为json字符串 可将指定的字段过滤掉
     * @param obj 待转化对象: 对象
     * @param fields 过滤处理字段数组
     * @param ignore true: 过滤指定字段，false: 只保留指定字段
     * @return 代表该对象的Json字符串
     */
    public static String toJson(final Object obj, final String[] fields, final boolean ignore) {
        if (fields == null || fields.length < 1) {
            return toJson(obj);
        }
        return JSON.toJSONString(obj, (PropertyFilter) (object, name, value) -> {
            for (int i = 0; i < fields.length; i++) {
                if (name.equals(fields[i])) {
                    return !ignore;
                }
            }
            return ignore;
        });
    }

    /**
     * -- 将json字符串转化为  object 反序列化
     * @param jsonStr json字符串
     * @param clazz 对象类型 对象 | List | Map | 数组 | set.class
     * @return object: 对象 | List | Map | 数组 | set
     * @param <T>
     */
    public static <T> T toObject(String jsonStr, Class<T> clazz) {
        return JSON.parseObject(jsonStr, clazz);
    }


    /**
     * -- 获取json字符串中指定路径的值[字符串类型]
     * @param json json字符串
     * @param path 路径: 如果有层级关系，用逗号分隔 例如: "data,info,username"
     * @return E: Object parse = MyJsonUtils.getParse(json, "sites,site");
     * @param <E>
     */
    public static <E> E getParseStr(String json, String path) {
        String[] keys = path.split(",");
        JSONObject obj = JSON.parseObject(json);
        for (int i = 0; i < keys.length - 1; i++) {
            obj = obj.getJSONObject(keys[i]);
        }
        return (E) obj.get(keys[keys.length - 1]);
    }

    /**
     * -- 获取json字符串中指定路径的值反序列化[集合实体类类型]
     * @param json json 字符串
     * @param path 路径: 如果有层级关系，用逗号分隔 例如: "data,info,username"
     * @param clazz 集合类型 -> 实体类
     * @return  List<JsonVo> parseArray = MyJsonUtils.getParseList(json, "sites,site", JsonVo.class);
     * @param <T>
     */
    public static <T> List<T> getParseList(String json, String path, Class<T> clazz) {
        String[] keys = path.split(",");
        JSONObject obj = JSON.parseObject(json);
        for (int i = 0; i < keys.length - 1; i++) {
            obj = obj.getJSONObject(keys[i]);
        }
        String inner = obj.getString(keys[keys.length - 1]);
        List<T> ret = JSON.parseArray(inner, clazz);
        return ret;
    }

    /**
     * -- 获取json字符串中指定路径的值反序列化[集合实体类类型皆可]
     * @param json json 字符串
     * @param path 路径: 如果有层级关系，用逗号分隔 例如: "data,info,username"
     * @param clazz 集合类型或者实体类 list.class | JsonVo.class | 集合实体类除外
     * @return集合 List<String> parseToObject = MyJsonUtils.getParseToObject(aaa, "sites,listStr", List.class);
     * @return实体类对象 JsonVo ss = MyJsonUtils.getParseToObject(aaa, "sites,jsonVo", JsonVo.class);
     * @param <T>
     */
    public static <T> T getParseToObject(String json, String path, Class<T> clazz) {
        Object parseStr = getParseStr(json, path);
        return toObject(parseStr.toString(), clazz);
    }

}

```



## 测试案例

### 对象 序列化 | 反序列化

```java
Kucun kucun = new Kucun();
kucun.setSpid(5);
kucun.setSpname("萨达");
// 序列化 对象
Object o = JSON.toJSON(kucun);
String s = JSON.toJSONString(kucun);
System.out.println(s);
// 反序列化 对象
Kucun kucun1 = JSON.parseObject(s, Kucun.class);
System.out.println(kucun1);

// 结果
{"spid":5,"spname":"萨达"}
Kucun(kucun=null, spid=5, spname=萨达)
```

### 集合 转换 JSON

```JAVA
// --------- Map 转换 JSON ---------
Map<String,Object> map = new HashMap<String,Object>();
map.put("姓名","张三");
map.put("年龄","18");
map.put("性别","男");
System.out.println(map);
// 序列化 Map 
String mapJson = JSON.toJSONString(map);
System.out.printf(mapJson);
// 序列化结果
{"姓名":"张三","年龄":"18","性别":"男"}

// ------ list 转换 JSON --------
List<String> list = new ArrayList<>();
list.add("one");
list.add("two");
list.add("shree");
// 序列化 list
String listjson = JSON.toJSONString(list);
System.out.println(listjson);
// 反序列化 list
List<String> strings = JSON.parseArray(listjson, String.class);
System.out.println(strings);
// 序列化结果
["one","two","shree"]
[one, two, shree]
```

### 时间 转换 JSON

```java
// ----- 直接对日期进行格式化 ------
// 注意: 日期格式化,FastJson可以直接对日期进行格式化,在缺省的情况下,FastJson会将Data转成Long
Date date = new Date();
String dataString = JSON.toJSONString(date);
System.out.println(date);
System.out.println(dataString);
// 序列化结果
Thu Aug 04 11:53:12 CST 2022
1659585192400

// ----- 指定输出日期格式 ------
Date date = new Date();
String dateJson = JSON.toJSONStringWithDateFormat(date,"yyyy-MM-dd HH:mm:ss");
// 时间 转换 JSON
System.out.println(dateJson);
// 序列化结果
"2022-08-04 11:50:04"
    
// ----- 使用SerializerFeature特性格式化日期 --------
Date date = new Date();
String dateJson = JSON.toJSONString(date, SerializerFeature.WriteDateUseDateFormat);
System.out.println(dateJson);
// 序列化结果
"2022-08-04 11:58:04"
```

### JSON 工具类测试

```java
package com.apai;

import com.apai.entity.wxapper.TestGet;
import com.apai.utils.JsonUtils;
import org.junit.jupiter.api.Test;

public class JsonTest {

    private static String json = "{\"errcode\":0,\"result\":{\"approve_list\":[],\"attendance_result_list\":[{\"group_id\":944640001,\"location_result\":\"NotSigned\",\"time_result\":\"NotSigned\",\"user_check_time\":\"2022-12-24 12:00:00\",\"plan_check_time\":\"2022-12-24 12:00:00\",\"check_type\":\"OffDuty\",\"source_type\":\"SYSTEM\",\"plan_id\":474421125566},{\"group_id\":944640001,\"location_result\":\"NotSigned\",\"time_result\":\"NotSigned\",\"user_check_time\":\"2022-12-24 21:30:00\",\"plan_check_time\":\"2022-12-24 21:30:00\",\"check_type\":\"OffDuty\",\"source_type\":\"SYSTEM\",\"plan_id\":474421125570}],\"corpId\":\"ding92e257e7d90f0e92f5bf40eda33b7ba0\",\"work_date\":\"2022-12-24 00:00:00\",\"userid\":\"085304165536697537\",\"check_record_list\":[]},\"success\":true,\"errmsg\":\"ok\",\"request_id\":\"16mho8ju6809u\"}";

    @Test
    public void entityJson() {
        TestGet testGet = new TestGet();
        testGet.setName("张三");
        testGet.setAge(18);

        String s = JsonUtils.toJson(testGet);
        System.out.println("对象->json" + s);

        String s1 = JsonUtils.toJson(testGet, true);
        System.out.println("对象->json格式化" + s1);

        String[] strings = {"name"};
        String s3 = JsonUtils.toJson(testGet, strings, true);
        System.out.println("对象->json格式化,过滤掉指定字段" + s3);

        Object s2 = JsonUtils.parse(json, "result,attendance_result_list");
        System.out.println("json中result,attendance_result_list字段的值" + s2);

        TestGet parse = JsonUtils.parse("{\"age\":18,\"name\":\"张三\"}", TestGet.class);
        System.out.println("json->对象" + parse.getName() + parse.getAge());
    }
}

// 输出
对象->json{"age":18,"name":"张三"}
对象->json格式化{
	"age":18,
	"name":"张三"
}
对象->json格式化,过滤掉指定字段{"age":18}
json中result,attendance_result_list字段的值[{"group_id":944640001,"location_result":"NotSigned","time_result":"NotSigned","user_check_time":"2022-12-24 12:00:00","plan_check_time":"2022-12-24 12:00:00","check_type":"OffDuty","source_type":"SYSTEM","plan_id":474421125566},{"group_id":944640001,"location_result":"NotSigned","time_result":"NotSigned","user_check_time":"2022-12-24 21:30:00","plan_check_time":"2022-12-24 21:30:00","check_type":"OffDuty","source_type":"SYSTEM","plan_id":474421125570}]
json->对象张三18
```

# Date 时间处理工具类

```java
package com.apai.utils.my;

import cn.hutool.core.builder.CompareToBuilder;
import cn.hutool.core.date.*;
import cn.hutool.log.Log;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Objects;

/**
 * 时间处理工具类
 *
 * @author: Apai_阿派
 * @date: 2023_02_03
 * @说明: 关联依赖: hutool
 * @补充: 时间格式互转 | 补充参考: https://blog.csdn.net/yy139926/article/details/124298574
 */
public class MyDateUtils {

    // 时间格式定义
    public static final String Y = "yyyy";
    public static final String YM = "yyyy-MM";
    public static final String YMD = "yyyy-MM-dd";
    public static final String YMDHMS = "yyyy-MM-dd HH:mm:ss";

    // 日期单位
    public static final String YEAR = "year"; // 年
    public static final String QUARTER = "Quarter"; // 季度
    public static final String MONTH = "month"; // 月
    public static final String WEEK = "Week"; // 周
    public static final String DAY = "day"; // 日
    public static final String HOUR = "hour"; // 时
    public static final String MINUTE = "minute"; // 分
    public static final String SECOND = "second"; // 秒

    /**
     * -- 时间类型格式化字符串
     *
     * @param date   时间类型 泛型 | 字符串除外
     * @param format 时间格式
     * @param <T>
     * @return String 时间格式化字符串
     */
    public static <T> String getDateStr(T date, String format) {
        if (date == null || date == "" || format == null || format == "") {
            Log.get().error("时间格式化字符串时, 时间或时间格式不能为null或者空字符串");
            return null;
        }
        if (date instanceof Date) {
            return new SimpleDateFormat(format).format(date);
        } else if (date instanceof LocalDate) {
            return ((LocalDate) date).format(DateTimeFormatter.ofPattern(format));
        } else if (date instanceof LocalDateTime) {
            return ((LocalDateTime) date).format(DateTimeFormatter.ofPattern(format));
        } else if (date instanceof Long) {
            return new SimpleDateFormat(format).format(new Date((Long) date));
        } else {
            Log.get().error("时间格式化Date类型时, 时间类型不支持");
            return null;
        }
    }

    /**
     * -- 时间字符串类型格式化Date类型
     *
     * @param date   时间字符串
     * @param format 时间格式
     * @return Date 时间格式化Date类型
     */
    public static Date getDate(String date, String format) {
        if (date == null || date == "" || format == null || "".equals(format)) {
            Log.get().error("时间字符串类型格式化Date类型时, 时间和格式不能为null或者空字符串");
            return null;
        }
        Date parse = null;
        try {
            parse = new SimpleDateFormat(format).parse(date);
        } catch (Exception e) {
            Log.get().error("时间字符串类型格式化Date类型时, 时间格式化异常");
        }
        return parse;
    }

    /**
     * -- 时间格式化Date类型
     *
     * @param date 时间类型 泛型 | 字符串除外
     * @param <T>
     * @return Date 时间格式化Date类型
     */
    public static <T> Date getDate(T date) {
        if (date == null || date == "") {
            Log.get().error("时间格式化Date类型时, 时间不能为null或者空字符串");
            return null;
        }
        if (date instanceof LocalDate) {
            return Date.from(((LocalDate) date).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
        } else if (date instanceof LocalDateTime) {
            return Date.from(((LocalDateTime) date).atZone(ZoneId.systemDefault()).toInstant());
        } else if (date instanceof Long) {
            return new Date((Long) date);
        } else if (date instanceof Date) {
            return (Date) date;
        } else {
            Log.get().error("时间格式化Date类型时, 时间类型不支持");
            return null;
        }
    }

    /**
     * -- 字符串时间格式化LocalDate类型
     *
     * @param date   时间字符串
     * @param format 时间格式
     * @return LocalDateTime 时间格式化LocalDateTime类型
     */
    public static LocalDate getLocalDate(String date, String format) {
        if (format == null || "".equals(format)) {
            Log.get().error("时间字符串类型格式化LocalDate类型时, 时间格式不能为null或者空字符串");
            return null;
        }
        return LocalDate.parse(date, DateTimeFormatter.ofPattern(format));
    }

    /**
     * -- 时间格式化LocalDate类型
     *
     * @param date 时间类型 泛型 | 字符串除外
     * @param <T>
     * @return LocalDate 时间格式化LocalDate类型
     */
    public static <T> LocalDate getLocalDate(T date) {
        if (date == null || date == "") {
            Log.get().error("时间格式化LocalDate类型时, 时间不能为null或者空字符串");
            return null;
        }
        if (date instanceof Date) {
            return ((Date) date).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } else if (date instanceof LocalDateTime) {
            return ((LocalDateTime) date).toLocalDate();
        } else if (date instanceof Long) {
            return new Date((Long) date).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } else if (date instanceof LocalDate) {
            return (LocalDate) date;
        } else {
            Log.get().error("时间格式化LocalDate类型时, 时间类型不支持");
            return null;
        }
    }

    /**
     * -- 字符串时间格式化LocalDateTime类型
     *
     * @param date   时间字符串
     * @param format 时间格式
     * @return LocalDateTime 时间格式化LocalDateTime类型
     */
    public static LocalDateTime getLocalDateTime(String date, String format) {
        if (format == null || "".equals(format)) {
            Log.get().error("时间字符串类型格式化LocalDateTime类型时, 时间格式不能为null或者空字符串");
            return null;
        }
        return LocalDateTime.parse(date, DateTimeFormatter.ofPattern(format));
    }

    /**
     * -- 时间格式化LocalDateTime类型
     *
     * @param date 时间类型 泛型 | 字符串除外
     * @param <T>
     * @return LocalDateTime 时间格式化LocalDateTime类型
     */
    public static <T> LocalDateTime getLocalDateTime(T date) {
        if (date == null || date == "") {
            Log.get().error("时间格式化LocalDateTime类型时, 时间不能为null或者空字符串");
            return null;
        }
        if (date instanceof Date) {
            return ((Date) date).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        } else if (date instanceof LocalDate) {
            return ((LocalDate) date).atStartOfDay();
        } else if (date instanceof Long) {
            return new Date((Long) date).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        } else if (date instanceof LocalDateTime) {
            return (LocalDateTime) date;
        } else {
            Log.get().error("时间格式化LocalDateTime类型时, 时间类型不支持");
            return null;
        }
    }

    /**
     * -- 字符串时间类型 获取开始时间
     *
     * @param date   时间字符串
     * @param format 时间格式
     * @param unit   时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @return
     */
    public static Date getBeginDate(String date, String format, String unit) {
        return getBeginDate(getDate(date, format), unit);
    }

    /**
     * -- 获取开始时间
     *
     * @param date 时间类型 泛型 | 字符串除外
     * @param unit 时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @param <T>
     * @return Date 开始时间 格式: 2023-05-08 00:00:00
     */
    public static <T> Date getBeginDate(T date, String unit) {
        if (date == null || date == "" || unit == null || unit == "") {
            Log.get().error("获取开始时间时, 时间或者时间单位不能为null或者空字符串");
            return null;
        }
        if (!(date instanceof Date)) {
            date = (T) getDate(date);
        }
        if (unit.equals(DAY)) {
            return DateUtil.beginOfDay((Date) date);
        } else if (unit.equals(WEEK)) {
            return DateUtil.beginOfWeek((Date) date);
        } else if (unit.equals(MONTH)) {
            return DateUtil.beginOfMonth((Date) date);
        } else if (unit.equals(QUARTER)) {
            return DateUtil.beginOfQuarter((Date) date);
        } else if (unit.equals(YEAR)) {
            return DateUtil.beginOfYear((Date) date);
        } else {
            Log.get().error("获取开始时间时, 时间单位不支持");
            return null;
        }
    }

    /**
     * -- 字符串类型时间 获取结束时间
     *
     * @param date   时间字符串
     * @param format 时间格式
     * @param unit   时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @return
     */
    public static Date getEndDate(String date, String format, String unit) {
        return getEndDate(getDate(date, format), unit);
    }

    /**
     * -- 获取结束时间
     *
     * @param date 时间类型 泛型 | 字符串除外
     * @param unit 时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @param <T>
     * @return Date 结束时间 格式: 2023-05-08 23:59:59
     */
    public static <T> Date getEndDate(T date, String unit) {
        if (date == null || date == "" || unit == null || unit == "") {
            Log.get().error("获取结束时间时, 时间或者时间单位不能为null或者空字符串");
            return null;
        }
        if (!(date instanceof Date)) {
            date = (T) getDate(date);
        }
        if (unit.equals(DAY)) {
            return DateUtil.endOfDay((Date) date);
        } else if (unit.equals(WEEK)) {
            return DateUtil.endOfWeek((Date) date);
        } else if (unit.equals(MONTH)) {
            return DateUtil.endOfMonth((Date) date);
        } else if (unit.equals(QUARTER)) {
            return DateUtil.endOfQuarter((Date) date);
        } else if (unit.equals(YEAR)) {
            return DateUtil.endOfYear((Date) date);
        } else {
            Log.get().error("获取结束时间时, 时间单位不支持");
            return null;
        }
    }

    /**
     * -- 字符串类型时间 | 获取时间部分
     *
     * @param date   时间字符串
     * @param format 时间字符串格式
     * @param unit   时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @return Integer 时间部分
     */
    public static Integer getDatePart(String date, String format, String unit) {
        return getDatePart(getDate(date, format), unit);
    }

    /**
     * -- 获取时间部分
     *
     * @param date 时间类型 | 字符串除外
     * @param unit 时间单位: DAY 天 | WEEK 周 | MONTH 月 | quarter 季 | year 年
     * @param <T>
     * @return Integer 时间部分
     */
    public static <T> Integer getDatePart(T date, String unit) {
        if (date == null || date == "" || unit == null || unit == "") {
            Log.get().error("获取时间部分时, 时间或者时间单位不能为null或者空字符串");
            return null;
        }
        if (unit.equals(DAY)) {
            // 获得指定日期是这个日期所在月份的第几天
            return DateUtil.dayOfMonth((Date) date);
        } else if (unit.equals(WEEK)) {
            // 获得指定日期是星期几，7表示周日，1表示周一
            int week = DateUtil.dayOfWeek((Date) date);
            if (week == 1) {
                week = 7;
            } else {
                week = week - 1;
            }
            return week;
        } else if (unit.equals(MONTH)) {
            // 获得月份，从1开始计数
            return DateUtil.month((Date) date) + 1;
        } else if (unit.equals(QUARTER)) {
            // 获得指定日期所属季度，从1开始计数
            return DateUtil.quarter((Date) date);
        } else if (unit.equals(YEAR)) {
            // 获得年的部分
            return DateUtil.year((Date) date);
        } else if (unit.equals(HOUR)) {
            // 获得小时数，24小时制
            return DateUtil.hour((Date) date, true);
        } else if (unit.equals(MINUTE)) {
            // 获得分钟数
            return DateUtil.minute((Date) date);
        } else if (unit.equals(SECOND)) {
            // 获得秒数
            return DateUtil.second((Date) date);
        } else {
            Log.get().error("获取时间部分时, 时间单位不支持");
            return null;
        }
    }

    /**
     * -- 字符串类型时间 | 获取时间偏移
     *
     * @param date   时间字符串
     * @param format 时间字符串格式
     * @param unit   时间单位: DAY 天 | WEEK 周 | MONTH 月 | year 年 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @param offset 偏移量
     * @return Date 时间偏移后的时间
     */
    public static Date getDateDeviation(String date, String format, String unit, Integer offset) {
        return getDateDeviation(getDate(date, format), unit, offset);
    }

    /**
     * -- 获取时间偏移
     *
     * @param date   时间类型 | 字符串除外
     * @param unit   时间单位: DAY 天 | WEEK 周 | MONTH 月 | year 年 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @param offset 偏移量
     * @param <T>
     * @return Date 时间偏移后的时间
     */
    public static <T> Date getDateDeviation(T date, String unit, Integer offset) {
        if (date == null || date == "" || unit == null || unit == "" || offset == null) {
            Log.get().error("获取时间偏移时, 时间或者时间单位或者偏移量不能为null或者空字符串");
            return null;
        }
        if (!(date instanceof Date)) {
            date = (T) getDate(date);
        }
        if (unit.equals(DAY)) {
            return DateUtil.offsetDay((Date) date, offset);
        } else if (unit.equals(WEEK)) {
            return DateUtil.offsetWeek((Date) date, offset);
        } else if (unit.equals(MONTH)) {
            return DateUtil.offsetMonth((Date) date, offset);
        } else if (unit.equals(YEAR)) {
            return DateUtil.offset((Date) date, DateField.YEAR, offset);
        } else if (unit.equals(HOUR)) {
            return DateUtil.offsetHour((Date) date, offset);
        } else if (unit.equals(MINUTE)) {
            return DateUtil.offsetMinute((Date) date, offset);
        } else if (unit.equals(SECOND)) {
            return DateUtil.offsetSecond((Date) date, offset);
        } else {
            Log.get().error("获取时间偏移时, 时间单位不支持");
            return null;
        }
    }

    /**
     * -- 获取两个时间差 数值
     *
     * @param beginDate 开始时间 | 字符串除外
     * @param endDate   结束时间 | 字符串除外
     * @param unit      时间单位: DAY 天 | WEEK 周 | MONTH 月 | year 年 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @param <T>
     * @return Long 时间差 | 月和年不足一月或者一年的不计算为: 0
     */
    public static <T, V> Long getDateDiffer(T beginDate, V endDate, String unit) {
        if (beginDate == null || beginDate == "" || endDate == null || endDate == "" || unit == null || unit == "") {
            Log.get().error("获取时间差时, 时间或者时间单位不能为null或者空字符串");
            return null;
        }
        if (!(beginDate instanceof Date)) {
            beginDate = (T) getDate(beginDate);
        }
        if (!(endDate instanceof Date)) {
            endDate = (V) getDate(endDate);
        }
        if (unit.equals(DAY)) {
            return DateUtil.between((Date) beginDate, (Date) endDate, DateUnit.DAY);
        } else if (unit.equals(WEEK)) {
            return DateUtil.between((Date) beginDate, (Date) endDate, DateUnit.WEEK);
        } else if (unit.equals(MONTH)) {
            return DateUtil.betweenMonth((Date) beginDate, (Date) endDate, false);
        } else if (unit.equals(YEAR)) {
            return DateUtil.betweenYear((Date) beginDate, (Date) endDate, false);
        } else if (unit.equals(HOUR)) {
            return DateUtil.between((Date) beginDate, (Date) endDate, DateUnit.HOUR);
        } else if (unit.equals(MINUTE)) {
            return DateUtil.between((Date) beginDate, (Date) endDate, DateUnit.MINUTE);
        } else if (unit.equals(SECOND)) {
            return DateUtil.between((Date) beginDate, (Date) endDate, DateUnit.SECOND);
        } else {
            Log.get().error("获取时间差时, 时间单位不支持");
            return null;
        }
    }

    /**
     * -- 获取两个时间差 数值 | 字符串时间类型[两个时间格式必须一致]
     *
     * @param beginDate 开始时间字符串
     * @param endDate   结束时间字符串
     * @param format    时间格式
     * @param unit      时间单位: DAY 天 | WEEK 周 | MONTH 月 | year 年 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @return Long 时间差 | 月和年不足一月或者一年的不计算为: 0
     */
    public static Long getDateDiffer(String beginDate, String endDate, String format, String unit) {
        return getDateDiffer(getDate(beginDate, format), getDate(endDate, format), unit);
    }

    /**
     * -- 获取两个时间差 格式化 精确倒计时
     *
     * @param beginDate 开始时间 | 字符串除外
     * @param endDate   结束时间 | 字符串除外
     * @param unit      时间单位: DAY 天 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @param <T>
     * @param <V>
     * @return String 格式化后的时间差 1天1小时16分36秒
     */
    public static <T, V> String getDateBetween(T beginDate, V endDate, String unit) {
        if (beginDate == null || beginDate == "" || endDate == null || endDate == "" || unit == null || unit == "") {
            Log.get().error("获取时间差格式化, 时间或者时间单位不能为null或者空字符串");
            return null;
        }
        if (!(beginDate instanceof Date)) {
            beginDate = (T) getDate(beginDate);
        }
        if (!(endDate instanceof Date)) {
            endDate = (V) getDate(endDate);
        }
        String dateBetween = null;
        if (unit.equals(HOUR)) {
            dateBetween = DateUtil.formatBetween((Date) beginDate, (Date) endDate, BetweenFormatter.Level.HOUR);
        } else if (unit.equals(MINUTE)) {
            dateBetween = DateUtil.formatBetween((Date) beginDate, (Date) endDate, BetweenFormatter.Level.MINUTE);
        } else if (unit.equals(SECOND)) {
            dateBetween = DateUtil.formatBetween((Date) beginDate, (Date) endDate, BetweenFormatter.Level.SECOND);
        } else if (unit.equals(DAY)) {
            dateBetween = DateUtil.formatBetween((Date) beginDate, (Date) endDate, BetweenFormatter.Level.DAY);
        } else {
            Log.get().error("获取时间差格式化时, 时间单位不支持");
        }
        return dateBetween;
    }

    /**
     * -- 获取两个时间差 格式化 精确倒计时
     *
     * @param beginDate 开始时间字符串
     * @param endDate   结束时间字符串
     * @param format    时间格式
     * @param unit      时间单位: DAY 天 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @return String 格式化后的时间差 1天1小时16分36秒
     */
    public static String getDateBetween(String beginDate, String endDate, String format, String unit) {
        return getDateBetween(getDate(beginDate, format), getDate(endDate, format), unit);
    }


    /**
     * -- 阳历[公历] 转 阴历[农历]
     * @param lunarDate 阴历日期字符串
     * @格式 yyyy-MM-dd | yyyy/MM/dd | yyyy年MM月dd日
     * @return 阴历日期字符串
     */
    public static String getLunarDate(String lunarDate) {
        ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate(lunarDate));
        return chineseDate.toStringNormal();
    }

    /**
     * -- 阴历[农历] 转 阳历[公历]
     * @param solarDate 阳历日期字符串
     * @param format 阴历日期格式 可使用上方常量 | 可自定义字符串: yyyy/MM/dd
     * @return 阳历日期字符串 | 如果阴历日期处于闰月, 则返回下个月的阳历日期
     */
    public static String getSolarDate(String solarDate, String format) {
        Integer year = getDatePart(solarDate, format, YEAR);
        Integer month = getDatePart(solarDate, format, MONTH);
        Integer day = getDatePart(solarDate, format, DAY);
        ChineseDate chineseDate = new ChineseDate(year, month, day);
        return getDateStr(chineseDate.getGregorianDate(), YMD);
    }

    /**
     * -- 通过阴历日期生日进行倒计时 生日当天返回 "0"
     * @param lunarDate 阴历出生日
     * @param unit 时间单位: DAY 天 | HOUR 小时 | MINUTE 分钟 | SECOND 秒
     * @return String 格式化后的时间差 1天1小时16分36秒 | 如果阴历日期处于闰月, 则返回下个月的阳历日期
     */
    public static String getBirthdayDays(Date lunarDate, String unit) {
        // 获取当前阳历日期
        Date beginDate = new Date();
        // 阴历转阳历日期
        Integer datePart = getDatePart(beginDate, YEAR);
        String dateStr = getDateStr(lunarDate, YMDHMS);
        dateStr = datePart.toString() + "-" + dateStr.substring(5);
        String solar = getSolarDate(dateStr, YMDHMS) + " 00:00:00"; // 阳历生日 string
        Date solarDate = getDate(solar, YMDHMS); // 阳历生日 date
        // 比对两个时间的先后
        // 获取阳历生日那天的开始和结束时间戳
        Long begin = getBeginDate(solarDate, DAY).getTime();
        Long end = getEndDate(solarDate, DAY).getTime();
        //获取现在的时间戳
        Long time = beginDate.getTime();
        if (time >= begin && time <= end) {
            // 今天就是生日
            return "0";
        } else if (time > end) {
            // 生日已过, 则计算下一年的生日
            datePart += 1;
            dateStr = datePart + "-" + dateStr.substring(5) + " 00:00:00";
            solar = getSolarDate(dateStr, YMDHMS);
            solarDate = getDate(solar, YMDHMS); // 阳历生日 date
        }
        return getDateBetween(beginDate, solarDate, unit);
    }

    /**
     * -- 获取该年份生肖
     * @param date 日期字符串
     * @格式 yyyy-MM-dd | yyyy/MM/dd | yyyy年MM月dd日
     * @return 生肖 例如: 鼠 | 牛 | 虎 | 兔 | 龙 | 蛇 | 马 | 羊 | 猴 | 鸡 | 狗 | 猪
     */
    public static String getYearZodiac(String date) {
        ChineseDate chineseDate = new ChineseDate(DateUtil.parseDate(date));
        return chineseDate.getChineseZodiac();
    }

    /**
     * -- 获取该日期 星期 可根据格式返回
     * @param date 日期
     * @param format 格式 | 1: 数字 | 2: 星期几 | 3: 周几
     * @return 星期
     */
    public static String getWeek(Date date, Integer format) {
        // 获得指定日期是星期几，7表示周日，1表示周一
        Integer week = DateUtil.dayOfWeek(date);
        String getWeek = null;
        if (week == 1) {
            week = 7;
        } else {
            week = week - 1;
        }
        // 根据格式返回
        if (format.equals(1)) {
            getWeek = week.toString();
        } else if (format.equals(2)) {
            if (week == 1) {
                getWeek =  "星期一";
            } else if (week == 2) {
                getWeek =  "星期二";
            } else if (week == 3) {
                getWeek =  "星期三";
            } else if (week == 4) {
                getWeek =  "星期四";
            } else if (week == 5) {
                getWeek =  "星期五";
            } else if (week == 6) {
                getWeek =  "星期六";
            } else if (week == 7) {
                getWeek =  "星期日";
            }
        } else if (format.equals(3)) {
            if (week == 1) {
                getWeek =  "周一";
            } else if (week == 2) {
                getWeek =  "周二";
            } else if (week == 3) {
                getWeek =  "周三";
            } else if (week == 4) {
                getWeek =  "周四";
            } else if (week == 5) {
                getWeek =  "周五";
            } else if (week == 6) {
                getWeek =  "周六";
            } else if (week == 7) {
                getWeek =  "周日";
            }
        }
        return getWeek;
    }

    /**
     * 获取当前时间的字符串
     * @return 例如: 2023 04 07 16 48 46
     */
    public static String getCodeStr() {
        // 获取随机数
        // int c = RandomUtil.randomInt(10000, 99999);
        // 获取当前时间
        Date date = new Date();
        Integer year = DateUtil.year(date);
        Integer month = DateUtil.month(date) + 1;
        String monthstr = month < 10 ? "0" + month : month.toString();
        Integer day = DateUtil.dayOfMonth(date);
        String daystr = day < 10 ? "0" + day : day.toString();
        Integer hour = DateUtil.hour(date, true);
        String hourstr = hour < 10 ? "0" + hour : hour.toString();
        Integer minute = DateUtil.minute(date);
        String minutestr = minute < 10 ? "0" + minute : minute.toString();
        Integer second = DateUtil.second(date);
        String secondstr = second < 10 ? "0" + second : second.toString();
        String str = year + monthstr + daystr + hourstr + minutestr + secondstr;
        return str;
    }

    /**
     * 时间戳转换为字符串日期
     * @param timeStamp 时间戳
     * @return 字符串日期
     */
    public static String stampToDate(String timeStamp) {
        if (Objects.equals(timeStamp, null) || Objects.equals(timeStamp, "")) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateStr = sdf.format(new Date(Long.parseLong(timeStamp)));
        return dateStr;
    }

}
```

# Java 发起HTTP请求

## Hutool 工具类

参考: https://hutool.cn/docs/#/http/Http%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7%E7%B1%BB-HttpUtil

## httpclient 依赖

```xml
<!-- HTTP: 请求依赖 -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.6</version>
</dependency>
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpmime</artifactId>
</dependency>
```

## HTTP 工具类

```java
package com.apai.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Map;

/**
 * HTTP 请求工具类
 * My: 阿派
 * 依赖: org.apache.httpcomponents httpclient 4.5.2
 * date: 2020-03-10
 */
public class MyHttpUtils {

    /**
     * 根据URL和参数 发送get请求
     *
     * @param url   请求地址 例如: https://apis.tianapi.com/huayu/index
     * @param param 请求参数 例如: key=121212&word=玫瑰花 这种形式
     * @return 返回请求结果
     * 例如: {"code":200,"msg":"success","result":{"cnflower":"玫瑰花","flowerprov":"自尊与面子是恋爱的障碍物。"}}
     */
    public static String sendGet(String url, String param) {
        CloseableHttpClient client = null;
        CloseableHttpResponse response = null;
        String result = null;
        try {
            // 创建客户端连接对象
            client = HttpClients.createDefault();
            // 构建Get请求对象
            HttpGet get = new HttpGet(url + "?" + param);
            // 设置超时时间，其中connectionRequestTimout（从连接池获取连接的超时时间）、connetionTimeout（客户端和服务器建立连接的超时时间）、socketTimeout（客户端从服务器读取数据的超时时间），单位都是毫秒
            RequestConfig config = RequestConfig.custom().setConnectTimeout(10000).setConnectionRequestTimeout(3000)
                    .setSocketTimeout(20000).build();
            get.setConfig(config);
            // 获取返回对象
            response = client.execute(get);
            // 整理返回值
            HttpEntity entity = response.getEntity();
            result = EntityUtils.toString(entity);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            // 关闭连接和流
            try {
                if (client != null) {
                    client.close();
                }
                if (response != null) {
                    response.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * 根据URL和参数 发送post请求
     *
     * @param url      请求地址 例如: https://apis.tianapi.com/huayu/index
     * @param paramMap 请求参数 map 例如: {"key":"121212","word":"玫瑰花"}
     * @return 返回请求结果
     */
    public static String sendPost(String url, Map paramMap) {
        CloseableHttpClient client = null;
        CloseableHttpResponse response = null;
        String result = null;
        try {
            // 创建客户端连接对象
            client = HttpClients.createDefault();
            // 构建Post请求对象
            HttpPost post = new HttpPost(url);
            // 设置传送的内容类型是json格式
            post.setHeader("Content-Type", "application/json;charset=utf-8");
            // 接收的内容类型也是json格式
            post.setHeader("Accept", "application/json;charset=utf-8");
            // 设置超时时间，其中connectionRequestTimout（从连接池获取连接的超时时间）、connetionTimeout（客户端和服务器建立连接的超时时间）、socketTimeout（客户端从服务器读取数据的超时时间），单位都是毫秒
            RequestConfig config = RequestConfig.custom().setConnectTimeout(10000).setConnectionRequestTimeout(3000).setSocketTimeout(20000).build();
            post.setConfig(config);
            // 将参数转换为json格式
            String jsonMap = JSON.toJSONString(paramMap);
            // 设置请求体
            post.setEntity(new StringEntity(jsonMap, "UTF-8"));
            // 获取返回对象
            response = client.execute(post);
            // 整理返回值
            HttpEntity entity = response.getEntity();
            result = EntityUtils.toString(entity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("发送post请求失败");
        } finally {
            try {
                if (client != null) {
                    client.close();
                }
                if (response != null) {
                    response.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * 发送 post 请求，参数为json格式, 上传文件
     *
     * @param url   请求地址 例如: https://apis.tianapi.com/huayu/index
     * @param param 请求参数 map 例如: {"key":"121212","word":"玫瑰花"}
     * @param file  上传的文件 例如: new File("D:/test.txt")
     * @return 返回请求结果
     */
    public static String sendPostFile(String url, Map<String, String> param, File file) {
        // 创建Httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        // 处理https链接
        if (url.startsWith("https://")) {
            httpClient = sslClient();
        }
        String resultString = "";
        CloseableHttpResponse response = null;
        HttpPost httppost = new HttpPost(url);
        try {
            // HttpMultipartMode.RFC6532参数的设定是为避免文件名为中文时乱码
            MultipartEntityBuilder builder = MultipartEntityBuilder.create().setMode(HttpMultipartMode.RFC6532);
            // 设置请求的编码格式
            builder.setCharset(Consts.UTF_8);
            builder.setContentType(ContentType.MULTIPART_FORM_DATA);
            // 1.添加文件,也可以添加字节流
            // builder.addBinaryBody("file", file);
            // 2.或者使用字节流也行,根据具体需要使用
            builder.addBinaryBody("file", Files.readAllBytes(file.toPath()), ContentType.APPLICATION_OCTET_STREAM, file.getName());
            // 3.或者builder.addPart("file",new FileBody(file));
            // 添加参数文件以外的参数
            if (param != null) {
                for (String key : param.keySet()) {
                    // 设置参数的编码格式 为UTF-8 避免中文乱码"??"
                    ContentType contentType = ContentType.create("text/plain", Charset.forName("UTF-8"));
                    StringBody stringBody = new StringBody(param.get(key), contentType);
                    builder.addPart(key, stringBody);
                }
            }
            // httppost.addHeader("token", param.get("token"));
            HttpEntity reqEntity = builder.build();
            httppost.setEntity(reqEntity);
            // 设置超时时间
            RequestConfig chaoshi = RequestConfig.custom().setConnectionRequestTimeout(60000).setSocketTimeout(120000)
                    .setConnectTimeout(60000).build();
            httppost.setConfig(chaoshi);
            response = httpClient.execute(httppost);
            resultString = EntityUtils.toString(response.getEntity(), "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return resultString;
    }


    /**
     * 设置SSL请求处理
     */
    private static CloseableHttpClient sslClient() {
        try {
            SSLContext ctx = SSLContext.getInstance("TLS");
            X509TrustManager tm = new X509TrustManager() {
                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
                        throws CertificateException {
                    // TODO Auto-generated method stub
                }
                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
                        throws CertificateException {
                    // TODO Auto-generated method stub
                }
                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    // TODO Auto-generated method stub
                    return null;
                }
            };
            ctx.init(null, new TrustManager[]{tm}, null);
            SSLConnectionSocketFactory sslConnectionSocketFactory = SSLConnectionSocketFactory.getSocketFactory();
            return HttpClients.custom().setSSLSocketFactory(sslConnectionSocketFactory).build();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }
}
```

# Bean 复制工具类

## BeanUtils 

> 包: import org.springframework.beans.BeanUtils;
>
> java 自带的拷贝工具类 

```java
// 对象的属性复制 深拷贝 | 可进行实体类的拷贝复制 | 可new对象进行储存
BeanUtils.copyProperties("被复制对象", "对象");
```

## BeanListUtils 自定义

> 自定义 BeanListUtils 集合 和 分页_page  的拷贝复制

BeanListUtils  工具类

```java
package com.woniuxy.utils;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * Bean集合复制工具类
 */
public class BeanListUtils  extends BeanUtils {

    /**
     * 转换对象 list
     * @param sources        源对象list
     * @param targetSupplier 目标对象供应方 new
     * @param <S>            源对象类型
     * @param <T>            目标对象类型
     * @return 目标对象list
     */
    public static <S, T> List<T> copyListProperties(List<S> sources, Supplier<T> targetSupplier) {
        if (null == sources || null == targetSupplier) {
            return null;
        }

        return sources.stream().map(s -> {
            T target = targetSupplier.get();
            copyProperties(s, target);
            return target;
        }).collect(Collectors.toList());
    }

    /**
     * mybatis-plus Ipage对象复制
     * @param sources 数据对对应的实体Page对象
     * @param target  复制之后的对象
     * @param <S>     数据库对象实体类
     * @param <T>     目标对象类型(VO)
     * @return 目标对象list
     */
    public static <S, T> IPage<T> copyPage(IPage<S> sources, IPage<T> target, Supplier<T> targetSupplier) {
        // 复制外层
        BeanUtils.copyProperties(sources, target);
        // 复制records对象
        target.setRecords(copyListProperties(sources.getRecords(), targetSupplier));
        return target;
    }
}
```

> List 集合拷贝

```java
// 调用 BeanListUtils 自定义工具 的集合拷贝方法 
// 语法：BeanListUtils.copyListProperties(usersPoList,目标集合类型::new);
List<目标集合类型> list = BeanListUtils.copyListProperties("被拷贝的集合",目标集合类型::new);
```

> 分页_page  拷贝

```java
// mybatis-plus Ipage对象复制
IPage<S> targetPage = baseMapper.selectPage(new Page<>(page, limit), queryWrapper);

IPage<T> sorecePage = BeanListUtils.copyPage(targetPage, new Page<>(), T::new);
```

## Vo Dto Po 互转

**详:** https://www.bilibili.com/video/BV1iP4y1p73h/?spm_id_from=333.788.recommend_more_video.-1&vd_source=6f6237fd2c246922ec201a19c8b7b28a

# 金额处理工具类

```java
package com.apai.utils;

import java.math.BigDecimal;

/**
 * 金额处理工具类
 *
 * @author: Apai_阿派
 * @date: 2023_02_16
 * @说明: 关联依赖: 无
 */
public class MyNumberToWord {

    /**
     * 汉语中数字大写
     */
    private static final String[] CN_UPPER_NUMBER = {"零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"};

    /**
     * 汉语中货币单位大写，这样的设计类似于占位符
     */
    private static final String[] CN_UPPER_MONETRAY_UNIT = {"分", "角", "元", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "兆", "拾", "佰", "仟"};

    /**
     * 特殊字符：整
     */
    private static final String CN_FULL = "整";

    /**
     * 特殊字符：负
     */
    private static final String CN_NEGATIVE = "负";

    /**
     * 金额的精度，默认值为2
     */
    private static final int MONEY_PRECISION = 2;

    /**
     * 特殊字符：零元整
     */
    private static final String CN_ZEOR_FULL = "零元" + CN_FULL;

    /**
     * 把输入的金额转换为汉语中人民币的大写
     *
     * @param numberOfMoney 输入的金额
     * @return 对应的汉语大写
     */
    public static String numberTransition(BigDecimal numberOfMoney) {
        StringBuffer sb = new StringBuffer();
        // -1, 0, or 1 as the value of this BigDecimal is negative, zero, or
        // positive.
        int signum = numberOfMoney.signum();
        // 零元整的情况
        if (signum == 0) {
            return CN_ZEOR_FULL;
        }
        // 这里会进行金额的四舍五入
        long number = numberOfMoney.movePointRight(MONEY_PRECISION).setScale(0, 4).abs().longValue();
        // 得到小数点后两位值
        long scale = number % 100;
        int numUnit = 0;
        int numIndex = 0;
        boolean getZero = false;
        // 判断最后两位数，一共有四中情况：00 = 0, 01 = 1, 10, 11
        if (!(scale > 0)) {
            numIndex = 2;
            number = number / 100;
            getZero = true;
        }
        if ((scale > 0) && (!(scale % 10 > 0))) {
            numIndex = 1;
            number = number / 10;
            getZero = true;
        }
        int zeroSize = 0;
        while (true) {
            if (number <= 0) {
                break;
            }
            // 每次获取到最后一个数
            numUnit = (int) (number % 10);
            if (numUnit > 0) {
                if ((numIndex == 9) && (zeroSize >= 3)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[6]);
                }
                if ((numIndex == 13) && (zeroSize >= 3)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[10]);
                }
                sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                sb.insert(0, CN_UPPER_NUMBER[numUnit]);
                getZero = false;
                zeroSize = 0;
            } else {
                ++zeroSize;
                if (!(getZero)) {
                    sb.insert(0, CN_UPPER_NUMBER[numUnit]);
                }
                if (numIndex == 2) {
                    if (number > 0) {
                        sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                    }
                } else if (((numIndex - 2) % 4 == 0) && (number % 1000 > 0)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                }
                getZero = true;
            }
            // 让number每次都去掉最后一个数
            number = number / 10;
            ++numIndex;
        }
        // 如果signum == -1，则说明输入的数字为负数，就在最前面追加特殊字符：负
        if (signum == -1) {
            sb.insert(0, CN_NEGATIVE);
        }
        // 输入的数字小数点后两位为"00"的情况，则要在最后追加特殊字符：整
        if (!(scale > 0)) {
            sb.append(CN_FULL);
        }
        return sb.toString();
    }

    // 测试 14231230 = 壹仟肆佰贰拾叁万壹仟贰佰叁拾元整
    public static void main(String[] args) {
        String s = numberTransition(new BigDecimal("14231230"));
        System.out.println(s);
    }

}
```

# Spring上下文 工具类

> 可使用 getbean 方法获取项目的上下文 容器管理的bean对象 等同于IOC注入

```java
package com.apai.utils.my;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Optional;

/**
 * spring上下文工具类 | 配合Redis工具类使用
 *
 * @author 是阿派啊
 * @date 2023-03-21
 */
@Component
public class MySpringContextUtils implements ApplicationContextAware {

    /**
     * Spring应用上下文环境
     */
    private static ApplicationContext applicationContext;

    /**
     * 实现ApplicationContextAware接口的回调方法，设置上下文环境
     *
     * @param applicationContext
     * @throws BeansException
     */
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        Optional.ofNullable(applicationContext).orElse(MySpringContextUtils.applicationContext = applicationContext);
    }

    /**
     * @return ApplicationContext
     */
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * 获取对象
     *
     * @param name
     * @return Object 一个以所给名字注册的bean的实例
     * @throws BeansException
     */
    public static Object getBean(String name) throws BeansException {
        return applicationContext.getBean(name);
    }

    /**
     * 根据 类.class 获取 Bean | 用于获取不同模块的bean或者没有使用@Component注解的bean
     *
     * @param aClass 类.class
     * @param <T>    泛型
     * @return T 返回类型 对应的类的实例bean
     */
    public static <T> T getBean(Class<T> aClass) {
        return applicationContext.getBean(aClass);
    }

    /**
     * 获取类型为requiredType的对象 如果bean不能被类型转换，相应的异常将会被抛出（BeanNotOfRequiredTypeException）
     *
     * @param name         bean注册名
     * @param requiredType 返回对象类型
     * @return Object 返回requiredType类型对象
     * @throws BeansException
     */
    public static <T> T getBean(String name, Class<T> requiredType) throws BeansException {
        return applicationContext.getBean(name, requiredType);
    }

    /**
     * 如果BeanFactory包含一个与所给名称匹配的bean定义，则返回true
     *
     * @param name
     * @return boolean
     */
    public static boolean containsBean(String name) {
        return applicationContext.containsBean(name);
    }

    /**
     * 判断以给定名字注册的bean定义是一个singleton还是一个prototype。
     * 如果与给定名字相应的bean定义没有被找到，将会抛出一个异常（NoSuchBeanDefinitionException）
     *
     * @param name
     * @return boolean
     * @throws NoSuchBeanDefinitionException
     */
    public static boolean isSingleton(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.isSingleton(name);
    }

    /**
     * @param name
     * @return Class 注册对象的类型
     * @throws NoSuchBeanDefinitionException
     */
    public static Class getType(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.getType(name);
    }

    /**
     * 如果给定的bean名字在bean定义中有别名，则返回这些别名
     *
     * @param name
     * @return
     * @throws NoSuchBeanDefinitionException
     */
    public static String[] getAliases(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.getAliases(name);
    }

    /**
     * 返回环境对象，可以获取一些系统配置或者我们自己的配置
     *
     * @return
     */
    public static Environment getEnvironment() {
        return applicationContext.getEnvironment();
    }

    // 用于查找bean类上面是否有我们指定的注解。看到这里我倒是突发奇想：
    // 我们是不是可以对其进行开发的约束，比如对所有contronller里面的，都必须打上controller注解。
    // 当然这只是一个个人想法。不喜勿喷
    public static <A extends Annotation> A findAnnotationOnBean(String beanName, Class<A> annotationType)
            throws NoSuchBeanDefinitionException {
        return applicationContext.findAnnotationOnBean(beanName, annotationType);
    }

    /**
     * 返回本地bean工厂是否包含给定名称的bean，忽略祖先上下文中定义的bean
     *
     * @param name
     * @return
     */
    public static boolean containsLocalBean(String name) {
        return applicationContext.containsLocalBean(name);
    }

    /**
     * 将给定的位置模式解析为资源对象。
     *
     * @param locationPattern
     * @return
     * @throws IOException
     */
    public static Resource[] getResources(String locationPattern) throws IOException {
        return applicationContext.getResources(locationPattern);
    }

}

```

# Redis 工具类

> 使用了 Spring上下文 工具类

```java
package com.apai.utils.my;

import com.alibaba.fastjson.JSONObject;
import com.apai.entity.wxgzhapp.UserAdmin;
import com.apai.utils.test.RedisUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.MessageFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;


/**
 * redis工具类
 * 避坑: 配合 MySpringContextUtils 使用
 */
@Component
public class MyRedisUtils {

    // 字符串缓存模板
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    // 对象，集合缓存模板
    @Resource
    private RedisTemplate<Object, Object> redisTemplate;


    /**
     * 获取 request 对象
     * 请求头中的信息 | 可在请求头中获取token
     *
     * @return HttpServletRequest | null
     */
    public static HttpServletRequest getRequest() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return requestAttributes == null ? null : requestAttributes.getRequest();
    }

    // ---- Redis 字符串操作 ----

    /**
     * 添加字符串 | 无过期时间
     *
     * @param key   键
     * @param value 值
     * @return Boolean true:成功 false:失败
     */
    public Boolean addString(String key, String value) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            // 字符串redis 存储
            ValueOperations<String, String> valOps = stringRedisTemplate.opsForValue();
            valOps.set(key, value);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 添加字符串 | 有过期时间
     *
     * @param key     键
     * @param value   值
     * @param seconds 过期时间 单位:秒
     * @return Boolean true:成功 false:失败
     */
    public Boolean addString(String key, String value, Integer seconds) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            // 字符串redis 存储
            ValueOperations<String, String> valOps = stringRedisTemplate.opsForValue();
            if (seconds != null) {
                valOps.set(key, value, seconds, TimeUnit.SECONDS);
            } else {
                valOps.set(key, value);
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 根据 key 键 获取 值字符串
     *
     * @param key 键
     * @return String 值字符串
     */
    public String getString(String key) {
        String result = "";
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            result = stringRedisTemplate.opsForValue().get(key);
        } catch (Exception e) {

        }
        return result;
    }

    /**
     * 根据key删除字符串
     *
     * @param key 键
     * @return Boolean true:成功 false:失败
     */
    public Boolean delString(String key) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            stringRedisTemplate.delete(key);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 根据key设置其值的过期时间
     *
     * @param key     键
     * @param seconds 过期时间 单位:秒
     */
    public Boolean reset(String key, Long seconds) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            stringRedisTemplate.expire(key, seconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            return false;
        }
        return true;
    }


    // ---- Redis 用户存储操作工具类 ----

    /**
     * 获取当前用户信息
     *
     * @return UserAdmin 用户信息
     */
    public static UserAdmin getUser() {
        RedisUtils redisUtils = new RedisUtils();
        HttpServletRequest request = getRequest();
        try {
            String token = request.getHeader("token");
            String jsonObj = redisUtils.getString(token);
            Object o = JSONObject.parseObject(jsonObj);
            UserAdmin userAdmin = JSONObject.toJavaObject((JSONObject) o, UserAdmin.class);
            return userAdmin;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据token获取用户信息
     *
     * @param token 用户token
     * @return UserAdmin 用户信息
     */
    public static UserAdmin getUserJsonToken(String token) {
        RedisUtils redisUtils = new RedisUtils();
        HttpServletRequest request = getRequest();
        try {
            String jsonObj = redisUtils.getString(token);
            Object o = JSONObject.parseObject(jsonObj);
            UserAdmin userAdmin = JSONObject.toJavaObject((JSONObject) o, UserAdmin.class);
            return userAdmin;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    // ------- 分界线 | 未测试 -------
    /**
     * 获取匹配的key
     *
     * @param pattern 匹配规则 * 代表多个字符 ? 代表一个字符 [abc] 代表a或b或c
     * @return Set<String>
     */
    public Set<String> keys(String pattern) {
        stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
        return stringRedisTemplate.keys(pattern);
    }

    /**
     * 批量删除keys
     *
     * @param pattern
     */
    public void delKeys(String pattern) {
        redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
        redisTemplate.delete(stringRedisTemplate.keys(pattern));
    }

    /**
     * 添加Set集合
     *
     * @param key
     * @param set
     */
    public void addSet(String key, Set<?> set) {
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            redisTemplate.opsForSet().add(key, set);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 获取Set集合
     *
     * @param key
     * @return
     */
    public Set<?> getSet(String key) {
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            return redisTemplate.opsForSet().members(key);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


    public void delAllString(String key) {
        stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
        if (key == null || "".equals(key)) {
            return;
        }
        try {
            if (!key.endsWith("*")) {
                key += "*";
            }
            Set<String> keys = stringRedisTemplate.keys(key);
            Iterator<String> it = keys.iterator();
            while (it.hasNext()) {
                String singleKey = it.next();
                delString(singleKey);
            }
        } catch (Exception e) {
//            logger.warn(spellString("delString {0}", key), e);
        }
    }


    /**
     * 缓存数据
     *
     * @param key
     * @param obj
     * @param seconds
     */
    public void addObj(String key, Object obj, Long seconds) {
        try {
//对象redis存储
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            ValueOperations<Object, Object> objOps = redisTemplate.opsForValue();
            if (seconds != null) {
                objOps.set(key, obj, seconds, TimeUnit.SECONDS);
            } else {
                objOps.set(key, obj);
            }
        } catch (Exception e) {
//            logger.warn(spellString("addObj {0}={1},{2}", key,obj,seconds),e);
        }
    }


    /**
     * @param key
     * @return Object
     * @see Object 缓存数据
     */
    public Object getObject(String key) {
        Object object = null;
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            object = redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
//            logger.warn(spellString("getObj {0}", key), e);
        }
        return object;
    }


    /**
     * @param key
     * @return Object
     * @see T 缓存数据
     */
    @SuppressWarnings({"unchecked"})
    public <T> T getObj(String key, T t) {
        Object o = null;
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            o = redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
//            logger.warn(spellString("getObj {0}->{1}", key, t), e);
        }
        return o == null ? null : (T) o;
    }


    public void expire(String key, long second) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            stringRedisTemplate.expire(key, second, TimeUnit.SECONDS);
        } catch (Exception e) {
//            logger.warn(spellString("expire {0}={1}", key, second),e);
        }
    }

    /**
     * 缓存数据
     *
     * @param key
     */
    public void delObj(String key) {
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            redisTemplate.delete(key);
        } catch (Exception e) {
//            logger.warn(spellString("delObj {0}", key),e);
        }
    }


    /**
     * 压栈
     *
     * @param key
     * @param value
     * @return
     */
    public Long push(String key, String value) {
        Long result = 0l;
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            result = stringRedisTemplate.opsForList().leftPush(key, value);
        } catch (Exception e) {
//            logger.warn(spellString("push {0}={1}", key,value),e);
        }
        return result;
    }

    /**
     * 出栈
     *
     * @param key
     * @return
     */
    public String pop(String key) {
        String popResult = "";
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            popResult = stringRedisTemplate.opsForList().leftPop(key);
        } catch (Exception e) {
//            logger.warn(spellString("pop {0}", key), e);
        }
        return popResult;
    }

    /**
     * 入队
     *
     * @param key
     * @param value
     * @return
     */
    public Long in(String key, String value) {
        Long inResult = 0l;
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            inResult = stringRedisTemplate.opsForList().rightPush(key, value);
        } catch (Exception e) {
//            logger.warn(spellString("in {0}={1}", key, value), e);
        }
        return inResult;
    }

    /**
     * 出队
     *
     * @param key
     * @return
     */
    public String out(String key) {
        String outResult = "";
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            outResult = stringRedisTemplate.opsForList().leftPop(key);
        } catch (Exception e) {
//            logger.warn(spellString("out {0}", key),e);
        }
        return outResult;
    }

    /**
     * 栈/队列长
     *
     * @param key
     * @return
     */
    public Long length(String key) {
        Long lengthResult = 0L;
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            lengthResult = stringRedisTemplate.opsForList().size(key);
        } catch (Exception e) {
//            logger.warn(spellString("length {0}", key), e);
        }
        return lengthResult;
    }

    /**
     * 范围检索
     *
     * @param key
     * @param start
     * @param end
     * @return
     */
    public List<String> range(String key, int start, int end) {
        List<String> rangeResult = null;
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            rangeResult = stringRedisTemplate.opsForList().range(key, start, end);
        } catch (Exception e) {
//            logger.warn(spellString("range {0},{1}-{2}", key, start, end), e);
        }
        return rangeResult;
    }

    /**
     * 移除
     *
     * @param key
     * @param i
     * @param value
     */
    public void remove(String key, long i, String value) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            stringRedisTemplate.opsForList().remove(key, i, value);
        } catch (Exception e) {
//            logger.warn(spellString("remove {0}={1},{2}", key,value,i),e);
        }
    }

    /**
     * 检索
     *
     * @param key
     * @param index
     * @return
     */
    public String index(String key, long index) {
        String indexResult = "";
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            indexResult = stringRedisTemplate.opsForList().index(key, index);
        } catch (Exception e) {
//            logger.warn(spellString("index {0}", key), e);
        }
        return indexResult;
    }

    /**
     * 置值
     *
     * @param key
     * @param index
     * @param value
     */
    public void setObject(String key, Object value, long index) {
        try {
            redisTemplate = MySpringContextUtils.getBean(RedisTemplate.class);
            redisTemplate.opsForValue().set(key, value, index);
        } catch (Exception e) {
//            logger.warn(spellString("set {0}={1},{2}", key,value,index),e);
        }
    }


    /**
     * 裁剪
     *
     * @param key
     * @param start
     * @param end
     */
    public void trim(String key, long start, int end) {
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            stringRedisTemplate.opsForList().trim(key, start, end);
        } catch (Exception e) {
//            logger.warn(spellString("trim {0},{1}-{2}", key,start,end),e);
        }
    }

    /**
     * 方法说明: 原子性自增
     *
     * @param key   自增的key
     * @param value 每次自增的值
     * @time: 2017年3月9日 下午4:28:21
     * @return: Long
     */
    public Long incr(String key, long value) {
        Long incrResult = 0l;
        try {
            stringRedisTemplate = MySpringContextUtils.getBean(StringRedisTemplate.class);
            incrResult = stringRedisTemplate.opsForValue().increment(key, value);
        } catch (Exception e) {
//            logger.warn(spellString("incr {0}={1}", key, value), e);
        }
        return incrResult;
    }

    /**
     * 拼异常内容
     *
     * @param errStr
     * @param arguments
     * @return
     */
    private String spellString(String errStr, Object... arguments) {
        return MessageFormat.format(errStr, arguments);
    }
}
```

# HttpServlet工具类

> 获取请求中的 HttpServlet对象 及其 请求头信息

```java
package com.apai.utils.test;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
 
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;
 
/**
 * HttpServlet工具类
 * @Author 是阿派啊
 */
public class ServletUtils {
 
    /**
     * 获取String参数
     * @param name 参数名
     */
    public static String getParameter(String name) {
        return getRequest().getParameter(name);
    }
 
    /**
     * 获取request
     */
    public static HttpServletRequest getRequest() {
        try {
            return getRequestAttributes().getRequest();
        } catch (Exception e) {
            return null;
        }
    }
 
    /**
     * 获取response
     */
    public static HttpServletResponse getResponse() {
        try {
            return getRequestAttributes().getResponse();
        } catch (Exception e) {
            return null;
        }
    }
 
    /**
     * 获取session
     */
    public static HttpSession getSession() {
        return getRequest().getSession();
    }
 
    public static ServletRequestAttributes getRequestAttributes() {
        try {
            RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
            return (ServletRequestAttributes) attributes;
        } catch (Exception e) {
            return null;
        }
    }
 
    /**
     * 获取请求头所有数据
     * @param request
     * @return
     */
    public static Map<String, String> getHeaders(HttpServletRequest request) {
        Map<String, String> map = new LinkedHashMap<>();
        Enumeration<String> enumeration = request.getHeaderNames();
        if (enumeration != null) {
            while (enumeration.hasMoreElements()) {
                String key = enumeration.nextElement();
                String value = request.getHeader(key);
                map.put(key, value);
            }
        }
        return map;
    }
 
}
```



# 文件上传下载工具类

> 即: 在本地直接储存文件 如图片等 参考: [Java如何实现下载文件的几种方式](https://blog.csdn.net/Boy_Martin/article/details/126058565)
>
> 使用了 HttpServlet工具类

## 表现层

* 访问:  http://localhost:1026/tmp//file-test/2022-10-24/2354ab8dffc44ebda574ecd0f9d756bc.png
* 存储: /tmp//file-test/2022-10-24/2354ab8dffc44ebda574ecd0f9d756bc.png
* 前端拼接后端ip和接口即可

```java
// 匿名访问 | Security 需要放行 | 基础上传
@AnonymousAccess
@PostMapping("/filetest")
@ResponseBody
public String upload(MultipartFile file, String foldername) {
    System.out.println("存储文件夹名称 = " + foldername);
    try {
        if (file == null){
            return "请添加附件";
        }
        // 获取文件名 | 再次重新生成名称
        String newFileName = FileUtils.createNewFileName(file.getOriginalFilename());
        // 获取文件数据
        FileInputStream inputStream = (FileInputStream) file.getInputStream();
        // 调用文件上传工具类进行图片上传 | 返回文件访问路径 | file-tes: 图片的存放文件夹
        // 例如: //tmp/file-test/2022-10-24/2354ab8dffc44ebda574ecd0f9d756bc.png
        String path = FileUtils.save(inputStream, foldername, newFileName);
        // 返回文件访问路径拼接前缀获取图片的全路径 | 
        // 例如: http://localhost:1026/tmp//file-test/2022-10-24/2354ab8dffc44ebda574ecd0f9d756bc.png
        String s = FileUtils.SERVER_PREFIX + path;
        return "上传成功:  " + s;
    }catch (Exception e) {
        return "上传失败,上传文件大小不能超过50MB";
    }

}

// ----------- 以下是文件下载的方法 新 ----------------

/**
 * 单个文件上传
 * @param file 附件
 * @param folder 文件夹
 * @return 上传成功的文件路径 例如: /tmp/file-test/2021-11-18/2bc.png
 */
@Mapping("/uploadFile")
@ResponseBody
public ResponseResult uploadFile(MultipartFile file, @RequestParam(required = false, defaultValue = "default") String folder) {
    try {
        if (file == null){
            return new ResponseResult(400, "请添加附件");
        }
        String newFileName = FileUtils.createNewFileName(file.getOriginalFilename());
        String path = null;
        path = FileUtils.save((FileInputStream) file.getInputStream(), folder, newFileName);
        String filePath = FileUtils.SERVER_PREFIX + path;
        return new ResponseResult(filePath, "上传成功", 200);
    }catch (Exception e) {
        e.printStackTrace();
        return new ResponseResult(400, "上传失败,上传文件大小不能超过50MB");
    }
}

/**
* 多个文件上传
* @param files 附件
* @param folder 文件夹
* @return 上传成功的文件路径 多个文件路径用逗号隔开
* 例如: /tmp/file-test/2021-11-18/2bc.png,/tmp/file-test/2021-11-18/26bc.png
*/
@PostMapping("/uploadFiles")
@ResponseBody
public ResponseResult uploadFiles(MultipartFile[] files, @RequestParam(required = false, defaultValue = "default") String folder) {
    String filePaths = "";
    for (MultipartFile file : files) {
        try {
            if (file == null){
                return new ResponseResult(400, "请添加附件");
            }
            String newFileName = FileUtils.createNewFileName(file.getOriginalFilename());
            String path = null;
            path = FileUtils.save((FileInputStream) file.getInputStream(), folder, newFileName);
            filePaths +=  FileUtils.SERVER_PREFIX + path + ",";
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseResult(400, "上传失败,上传文件大小不能超过50MB");
        }
    }
    return new ResponseResult(filePaths, "上传成功", 200);
}

/**
* 根据文件路径下载文件
* @param response 响应
* @throws IOException
*/
@PostMapping("/downloadFileByFilePath")
@ResponseBody
public ResponseResult downloadFileByFilePath(HttpServletResponse response, String filePath) throws IOException {
    // 文件的存放路径
    String fileName = System.getProperty("user.dir") + "\\upload" + filePath.replace("/tmp/", "").replace("/", "\\");

    // 根据文件地址路径和名字拼接 创建file实例
    File file = new File(fileName);
    if (!file.exists()) {
        return new ResponseResult(400, "请添加附件");
    }
    response.reset();
    response.setHeader("Content-Disposition", "attachment;fileName=" + file.getName());
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
        return new ResponseResult(400, "下载失败, 请稍后重试");
    }
    return new ResponseResult(file.getName(), "下载成功", 200);
}

// ------- 新工具类的方法 --------
// 文件上传
@PostMapping("/uploadFile")
public ResponseResult uploadFile(MultipartFile file, String folder) {
    String path = MyFileUtils.saveNewFile(file, folder);
    if (path == null) {
        return new ResponseResult(400, "上传失败");
    }else {
        return new ResponseResult(200, "上传成功", path);
    }
}
// 文件下载
@PostMapping("/downloadFileByFilePath")
@ResponseBody
public ResponseResult downloadFileByFilePath(String filePath) throws IOException {
    Boolean aBoolean = MyFileUtils.downloadFileByFilePath(filePath);
    if (aBoolean) {
        return new ResponseResult(200, "下载成功");
    }else {
        return new ResponseResult(400, "下载失败");
    }
}
```

## 图片工具类

> 使用到了hutool 工具包

```xml
<!--hutool 工具包-->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.6</version>
</dependency>
```

```java
package com.apai.utils.my;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import com.apai.utils.test.FileUtils;
import com.apai.utils.test.ServletUtils;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.channels.FileChannel;
import java.util.Properties;

/**
 * @Author 是阿派啊
 * @Date 2023/04/12
 * @Description: 文件工具类
 **/
public class MyFileUtils {

    /**
     * 文件上传的保存路径
     * 例如：F:/Apai_project/Stranger/Stran/upload/
     */
    public static String UPLOAD_PATH = System.getProperty("user.dir") + File.separator + "upload" + File.separator;

    /**
     * 文件本地位置 设置静态文件夹
     * 例如： file:F:/Apai_project/Stranger Things/Stranger_Things_end/upload/
     */
    public static String FILE_LOCATION = "file:" + UPLOAD_PATH;


    /**
     * 文件访问前缀
     */
    public static String SERVER_PREFIX = "/tmp/";

    /**
     * 文件访问前缀
     */
    public static String FILE_SERVER_PREFIX = SERVER_PREFIX + "**";


    /**
     * 读取yml里的属性值
     */
    static {
        YamlPropertiesFactoryBean yamlMapFactoryBean = new YamlPropertiesFactoryBean();
        // 可以加载多个yml文件
        yamlMapFactoryBean.setResources(new ClassPathResource("application.yml"));
        Properties properties = yamlMapFactoryBean.getObject();
        // 获取yml里的路径参数，如果配置了，就读取配置了的，如果没有配置，那么就使用默认的
        UPLOAD_PATH = properties.getProperty("filepath", UPLOAD_PATH);
    }

    /**
     * 根据文件路径获取文件的绝对路径
     * 例如：F:/Apai_project/Shings/Sts/upload/avatar/2020-10-01/123.jpg
     *
     * @param filePath 文件路径
     * @return 文件的绝对路径
     */
    public static String getFilePatht(String filePath) {
        // 获取文件的存放路径
        String contextPath = System.getProperty("user.dir") + "\\upload";
        return contextPath + filePath.replace("/tmp/", "").replace("/", "\\");
    }

    /**
     * 根据文件老名字得到新名字
     *
     * @param oldName 文件老名字
     * @return 新名字
     */
    public static String createNewFileName(String oldName) {
        String suffix = FileUtil.extName(oldName);
        return IdUtil.fastSimpleUUID() + "." + suffix;
    }

    /**
     * 保存文件
     *
     * @param fis      文件输入流
     * @param folder   文件夹
     * @param fileName 文件名
     * @return 文件的相对路径 例如：/avatar/2020-10-01/123.jpg
     */
    public static String saveFile(FileInputStream fis, String folder, String fileName) {
        FileOutputStream fos;
        // 创建通道
        FileChannel inChannel;
        FileChannel outChannel;
        // 要返回的路径
        String selfPath = null;
        // 图片公用的存储位置
        String publicPath;
        try {
            selfPath = "/" + folder + "/" + DateUtil.today() + "/" + fileName;
            publicPath = UPLOAD_PATH + selfPath;
            //如不存在则创建目录及文件
            FileUtil.touch(publicPath);
            fos = new FileOutputStream(publicPath);

            inChannel = fis.getChannel();
            outChannel = fos.getChannel();
            //通道间传输
            inChannel.transferTo(0, inChannel.size(), outChannel);
            inChannel.close();
            outChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return selfPath;
    }


    /**
     * 保存文件 自动重命名文件名称
     *
     * @param file    文件
     * @param folder  模块文件夹
     * @return 文件的相对路径 例如：/tmp//avatar/2020-10-01/123.jpg
     */
    public static String saveNewFile(MultipartFile file, String folder) {
        if (file == null) {
            return null;
        }
        FileOutputStream fos;
        // 创建通道
        FileChannel inChannel;
        FileChannel outChannel;
        // 要返回的路径
        String selfPath = null;
        // 图片公用的存储位置
        String publicPath;

        try {
            String fileName = FileUtils.createNewFileName(file.getOriginalFilename());
            FileInputStream inputStream = (FileInputStream) file.getInputStream();

            selfPath = "/" + folder + "/" + DateUtil.today() + "/" + fileName;
            publicPath = UPLOAD_PATH + selfPath;
            //如不存在则创建目录及文件
            FileUtil.touch(publicPath);
            fos = new FileOutputStream(publicPath);

            inChannel = inputStream.getChannel();
            outChannel = fos.getChannel();
            //通道间传输
            inChannel.transferTo(0, inChannel.size(), outChannel);
            inChannel.close();
            outChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return FileUtils.SERVER_PREFIX + selfPath;
    }

    /**
     * 根据文件的相对路径 删除文件
     *
     * @param filePath 文件的相对路径: /tmp/2020/05/05/xxx.jpg
     * @return true: 删除成功  false: 删除失败
     */
    public static Boolean deleteFile(String filePath) {
        // 获取文件的绝对路径 上下文路径 + upload + 文件名
        String fileName = getFilePatht(filePath);
        // 判断是在linux还是windows系统是运行
        String osName = System.getProperties().getProperty("os.name");
        if (osName.equalsIgnoreCase("Linux")) {
            // linux指令
            String cmd = "rm -f" + fileName;
            try {
                Process process = Runtime.getRuntime().exec(cmd);
                process.waitFor();
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            File file = new File(fileName);
            //判断文件存不存在
            if (!file.exists()) {
                System.out.println("删除文件失败：" + fileName + "不存在！");
                return false;
            } else {
                //判断这是不是一个文件，ps：有可能是文件夹
                if (file.isFile()) {
                    return file.delete();
                }
                return false;
            }
        }
    }

    /**
     * 根据文件的相对路径 下载文件
     * @param filePath 文件的相对路径: /tmp/2020/05/05/xxx.jpg
     * @return true: 下载成功  false: 下载失败
     */
    public static Boolean downloadFileByFilePath(String filePath) {
        // 获取文件的绝对路径 上下文路径 + upload + 文件名
        String fileName = getFilePatht(filePath);
        // 获取response
        HttpServletResponse response = new ServletUtils().getResponse();

        // 根据文件地址路径和名字拼接 创建file实例
        File file = new File(fileName);
        if (!file.exists()) {
            return false;
        }

        response.reset();
        response.setHeader("Content-Disposition", "attachment;fileName=" + file.getName());
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
            return false;
        }
        return true;
    }

}

```

## 配置静态文件夹

需要 web 依赖

```java
package com.apai.utils;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.MultipartConfigElement;


/**
 * @author yzh
 */
@Configuration
public class WebMvcConfiguration {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            // 控制器统一加上前缀
            @Override
            public void configurePathMatch(PathMatchConfigurer configurer) {

            }

            /**
             * 添加静态资源注册
             * @param registry
             */
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {

                registry.addResourceHandler("/static/**")
                        .addResourceLocations("classpath:/static/");

                /**
                 * 配置访问前缀 /tmp/**
                 * 设置静态文件夹 file:F:/Apai_project/Stranger Things/Stranger_Things_end/upload/
                 * 访问 http://localhost:1026/tmp//10001.png
                 * 网址会自动去找 F:/Apai_project/Stranger Things/Stranger_Things_end/upload/10001.png
                 */
                registry.addResourceHandler(FileUtils.FILE_SERVER_PREFIX)
                        .addResourceLocations(FileUtils.FILE_LOCATION);

            }

            /**
             * 生命周期拦截
             * @param registry
             */
            @Override
            public void addInterceptors(InterceptorRegistry registry) {

            }

        };
    }

    //文件上传
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        //单个文件最大 50m 可以使用读取配置
        factory.setMaxFileSize(DataSize.parse("5120000KB")); //KB,MB
        /// 设置总上传数据总大小 50m
        factory.setMaxRequestSize(DataSize.parse("512000KB"));
        return factory.createMultipartConfig();
    }

}

```



# | -- 阿派的技术小点

# Spring Boot 内置 API

https://mp.weixin.qq.com/s/QdB_AVUoMHEbdorhU1ricg

## Math | 数学类

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
    
// 保留小数点后两位 https://blog.csdn.net/wang121213145/article/details/127495130
double f = 111231.5585;
System.out.println(String.format("%.2f", f));
```

## 字符串类 API

### 字符串判空

```java
| --- 字符串判空
// null:true  | "  ":false
Objects.isNull(变量) 
// null:空指针异常  | "  ":true
变量.trim().isEmpty() 
// null:true  | "  ":false
Objects.equals(变量, null) 
// hutool依赖 | null和" " 都为true
StrUtil.isBlank(变量)
StrUtil.hasEmpty(变量);
```

### 字符串反转

```java
String str = "abcdefg";
// 字符串反转
String reverse = reverse(str);
System.out.println(reverse); // gfedcba
```



## 集合类 数组类 API

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

### 数组排序

```java
// 数组排序
int[] arr = {100, 37, 12, 5, 41};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));
```

## 其他

### 中文转拼音

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

## Hutool  Api 

### [字段验证器-Validator](https://hutool.cn/docs/#/core/语言特性/字段验证器-Validator?id=字段验证器-validator)

```java
// 验证给定字符串是否复合电子邮件格式
boolean isEmail = Validator.isEmail("loolly@gmail.com")
// 验证该字符串是否是数字
boolean number = Validator.isNumber("123");
// 通过正则表达式灵活的验证内容
Validator.isMactchRegex("需要验证字段的正则表达式", "被验证内容")
// 判断未满足条件时抛出一个异常，Validator同样提供异常验证机制
Validator.validateChinese("我是一段zhongwen", "内容中包含非中文");
```



# 集合类

## 集合根据对象某字段去重

> 实体类

```java
package com.apai.entity.wxapper;
import lombok.Data;
@Data
public class TestGet {
    private String name;
    private Integer age;
    public TestGet() {
    }
    public TestGet(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
}
```

> 去重方法

```java
@Test
public void aa() {
    // 其中具有相同姓名和年龄的对象，目的是只保留一个
    List<TestGet> gets = new ArrayList<>();
    gets.add(new TestGet("张三", 12));
    gets.add(new TestGet("李四", 122));
    gets.add(new TestGet("张三", 12));
    gets.add(new TestGet("王五", 162));
    // 通过map的key去重
    Map<String, TestGet> map = new HashMap<>();
    for (TestGet get : gets) {
        // 通过姓名和年龄拼接成key
        TestGet testGet = map.get(get.getName() + "-" + get.getAge());
        // 如果map中已经存在了相同的key，那么就不会添加进去
        if(Objects.equals(testGet,null)){
            map.put(get.getName() + "-" + get.getAge(), get);
        }
    }
    // 遍历map
    map.forEach((k, y) -> {
        System.out.println(k + y);
    });
}
```

# AOP 切面通知

## 前置通知给接口参数赋值

```java
package com.apai.config.aop;

import com.google.common.collect.Lists;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 通过 AOP 切面通知
 * 获取在接口传入对象和List集合并且被 @RequestBody 注解修饰的方法
 * 对此对象或者List集合的: 自定义字段 属性赋值
 */
@Component
@Aspect
public class AutoSetFieldValueAspect {

    // 设置接口对象内的自定义字段
    private static final String FILELD_NAME = "openId";

    @Pointcut(value = "execution(* com.apai.controller.*.*(..))")
    public void setFieldAspect() {
    }

    @Before("setFieldAspect()")
    public void setCompanyId(JoinPoint joinPoint) throws Exception {
        RequestMapping annotation = joinPoint.getTarget().getClass().getAnnotation(RequestMapping.class);
        // 放行登录接口
        if (Objects.nonNull(annotation) && annotation.value()[0].equals("/login")) {
            return;
        }
        // 获取方法上的注解
        List<String> annotationList = Lists.newArrayList();
        isRequestBodyAnnotation(annotationList, joinPoint);
        if (!annotationList.contains("org.springframework.web.bind.annotation.RequestBody")) {
            return;
        }
        // 获取方法参数
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            // 断言
            this.asserts(arg);
            // 设置自定义字段
            if (arg instanceof List) {
                ((List<?>) arg).forEach(item -> {
                    // 获取子类和父类
                    Class<?> childClass = item.getClass();
                    // 获取父类
                    Class<?> superclass = childClass.getSuperclass();
                    // 判断是否存在自定义字段
                    boolean childFilds = Arrays.asList(childClass.getDeclaredFields()).stream().map(item1 -> item1.getName()).collect(Collectors.toList()).contains(FILELD_NAME);
                    // 判断是否存在自定义字段
                    boolean supperFilds = Arrays.asList(superclass.getDeclaredFields()).stream().map(item1 -> item1.getName()).collect(Collectors.toList()).contains(FILELD_NAME);
                    if (childFilds || supperFilds) {
                        try {
                            // 获取自定义字段
                            Field field = childFilds ? childClass.getDeclaredField(FILELD_NAME) : superclass.getDeclaredField(FILELD_NAME);
                            // 设置自定义字段可访问
                            field.setAccessible(true);
                            // 设置自定义字段值
                            field.set(item, "自定义字段的值");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
            } else {
                // 获取子类和父类
                Class<?> childClass = arg.getClass();
                // 获取父类
                Class<?> superclass = childClass.getSuperclass();
                // 判断是否存在自定义字段
                boolean childFilds = Arrays.asList(childClass.getDeclaredFields()).stream().map(item -> item.getName()).collect(Collectors.toList()).contains(FILELD_NAME);
                // 判断是否存在自定义字段
                boolean supperFilds = Arrays.asList(superclass.getDeclaredFields()).stream().map(item -> item.getName()).collect(Collectors.toList()).contains(FILELD_NAME);
                if (childFilds || supperFilds) {
                    // 获取自定义字段
                    Field field = childFilds ? childClass.getDeclaredField(FILELD_NAME) : superclass.getDeclaredField(FILELD_NAME);
                    // 设置自定义字段可访问
                    field.setAccessible(true);
                    // 设置自定义字段值
                    field.set(arg, "自定义字段的值");
                }
            }
        }
    }

    /**
     * 断言
     * 扩展断言在此方法加...
     *
     * @param arg 方法参数
     */
    private void asserts(Object arg) {
        // 断言
        if (Objects.isNull(arg)) {
            return;
        }
    }


    /**
     * 是否含有requestBody注解
     *
     * @param annotationList
     * @return List<String>
     */
    private List<String> isRequestBodyAnnotation(List<String> annotationList, JoinPoint joinPoint) throws NoSuchMethodException {
        // 获取方法名
        String methodName = joinPoint.getSignature().getName();
        // 获取参数类型,这里返回的数组
        Class<?>[] parameterTypes = ((MethodSignature) joinPoint.getSignature()).getMethod().getParameterTypes();
        // 获取指定方法,根据方法名称和参数类型
        Method currentMethod = joinPoint.getTarget().getClass().getDeclaredMethod(methodName, parameterTypes);
        // 获取方法参数注解
        Annotation[][] parameterAnnotations = currentMethod.getParameterAnnotations();
        for (int i = 0; i < parameterAnnotations.length; i++) {
            for (int j = 0; j < parameterAnnotations[i].length; j++) {
                annotationList.add(parameterAnnotations[i][j].annotationType().getName());
            }
        }
        return annotationList;
    }

}

```



# 其他类

## 联机树状

```java
// 查询所有的资源, 并按树结构返回
@Override
public List<Perms> listAll() {
    // 获取所有资源list
    List<Perms> permsList = this.list();

    List<Perms> rootPermList = new ArrayList<>();   // 定义一级菜单列表
    Map<Integer, Perms> permsMap = new HashMap<>(); // 定义一个map, 存放所有资源 id -> Perms

    permsList.forEach(perms -> {
        //  如果父ID为null，则为一级菜单
        if(perms.getParentid() == null) {
            rootPermList.add(perms);
        }
        // 把资源实体对象全部放入map
        permsMap.put(perms.getId(), perms);
        // 对所有 perms 初始化 childerList
        perms.setChilderList(new ArrayList<>());
    });
    permsList.forEach(perms -> {
        // 判断 是否有父级id 如果有表示不是一级菜单
        if(perms.getParentid() != null) {
            // 获取 父级id
            Integer parentId = perms.getParentid();
            // 根据 父级id 拿到父级实体类对象 实例
            Perms parentPerms = permsMap.get(parentId);
            // 将 遍历的不是一级菜单的实例 存入其父级的 字段集合里
            List<Perms> childerList = parentPerms.getChilderList();
            childerList.add(perms);
        }
    });
    return rootPermList;
}
```

















