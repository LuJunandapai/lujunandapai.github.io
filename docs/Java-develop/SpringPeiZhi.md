---
title: Spring 配置详解
date: 2023/04/26
---



# ----------  Spring 模板  ----------

# Spring 通用模板 

## spring --> pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.apai</groupId>
    <artifactId>web-spring-6</artifactId>
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
        <!--spring-context：Spring容器核心-->
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

        <!--mysql-connector-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.22</version>
        </dependency>
        <!--druid数据源-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.2.5</version>
        </dependency>
        <!--mybatis-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus</artifactId>
            <version>3.4.3</version>
        </dependency>
        <!-- 分页 -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper</artifactId>
            <version>5.2.0</version>
        </dependency>

        <!-- log4j -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.14.0</version>
        </dependency>
        <!-- lombok 实体列注解 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <optional>true</optional>
        </dependency>

        <!--Unit5依赖-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.3.18</version>
        </dependency>
        <!--Unit5依赖-->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.7.2</version>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
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

## 容器 applicationContext.xml

applicationContext.xml

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

    <!--配置扫描包 注意:更改路径地址-->
    <context:component-scan base-package="com.apai"></context:component-scan>

    <!--配置数据库连接池-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&amp;characterEncoding=utf8&amp;useSSL=false&amp;nullCatalogMeansCurrent=true&amp;serverTimezone=Asia/Shanghai"></property>
        <property name="username" value="root"></property>
        <property name="password" value="123456"></property>
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"></property>
    </bean>

     <!--配置sqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--工厂配置-->
        <property name="dataSource" ref="dataSource"></property>
        
        <!--别名包配置 注意:更改路径地址-->
        <property name="typeAliasesPackage" value="com.apai.entity"></property>

        <!--指定xml文件的目录，如果它和Dao接口文件在一起，可以省略；如果不在一起，必须配置-->
        <!--<property name="mapperLocations" value="classpath:com/apai/dao/*.xml"></property>-->

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

    <!--配置dao扫描包 注意:更改路径地址 否则无法找到dao-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
        <property name="basePackage" value="com.xxx.dao"></property>
    </bean>
    
    <!--配置事务管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!--配置事务通知-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>

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
    <!--配置事务顾问 注意:更改路径地址-->
    <aop:config>
        <aop:pointcut id="servicePointcut" expression="execution(* com.apai.service.impl.*.*(..))" />
        <aop:advisor advice-ref="txAdvice" pointcut-ref="servicePointcut"></aop:advisor>
    </aop:config>
</beans>
```

## 容器 SpringConfig.java 注解

> config包下 --> SpringConfig.java 基于注解 可代替 容器 applicationContext.xml 



### jdbc.properties 配置数据库

```
jdbc.driverClass=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=123456
```

### DbProperties 储存数据库

```java
package com.apai.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:jdbc.properties")
@Data
public class DbProperties {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String pssword;

    @Value("${jdbc.driverClass}")
    private String driverClass;
}

```

### SpringConfig 基于注解 容器

```java
package com.apai.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.github.pagehelper.PageInterceptor;
import org.apache.ibatis.logging.log4j2.Log4j2Impl;
import org.apache.ibatis.plugin.Interceptor;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.interceptor.*;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration //spring 的配置类，相当于 bean.xml 文件
@ComponentScan(basePackages={"com.apai"}) //初始化容器时要扫描的包
@EnableAspectJAutoProxy //开启事务注解
@EnableTransactionManagement //开始事务管理器
@Import(DbProperties.class) //获取数据库配置文件的class
public class SpringConfig {

    @Bean
    public DataSource createDataSource(@Autowired DbProperties dbProperties) {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUrl(dbProperties.getUrl());
        druidDataSource.setUsername(dbProperties.getUsername());
        druidDataSource.setPassword(dbProperties.getPssword());
        druidDataSource.setDriverClassName(dbProperties.getDriverClass());
        return druidDataSource;
    }

    @Bean
    public SqlSessionFactoryBean getSqlSessionFactoryBean(@Autowired DataSource dataSource) {
        //配置数据源
        SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        //配置别名包
        sessionFactoryBean.setTypeAliasesPackage("com.apai.entity");
        //Mybatis的配置类
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setLogImpl(Log4j2Impl.class);
        sessionFactoryBean.setConfiguration(configuration);


        Interceptor[] interceptors = new Interceptor[1];

        PageInterceptor pageInterceptor = new PageInterceptor();
        Properties properties = new Properties();
        properties.setProperty("helperDialect", "mysql");
        properties.setProperty("reasonable", "true");
        pageInterceptor.setProperties(properties);

        interceptors[0] = pageInterceptor;

        sessionFactoryBean.setPlugins(interceptors);

        return sessionFactoryBean;
    }

    @Bean
    public MapperScannerConfigurer createMapperScannerConfigurer() {
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("getSqlSessionFactoryBean");
        mapperScannerConfigurer.setBasePackage("com.apai.dao");
        return mapperScannerConfigurer;
    }

    //配置事务管理器
    @Bean
    public DataSourceTransactionManager getDataSourceTransactionManager(@Autowired DataSource dataSource) {
        DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
        dataSourceTransactionManager.setDataSource(dataSource);
        return dataSourceTransactionManager;
    }

    //配置通知
    @Bean("transactionInterceptor")
    public TransactionInterceptor getTransactionInterceptor(@Autowired DataSourceTransactionManager transactionManager) {
        TransactionInterceptor transactionInterceptor = new TransactionInterceptor();
        transactionInterceptor.setTransactionManager(transactionManager);

        //设置 readOnly 规则
        RuleBasedTransactionAttribute readOnlyTx = new RuleBasedTransactionAttribute();
        readOnlyTx.setReadOnly(true);
        readOnlyTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_SUPPORTS);
        //设置 required 规则
        RuleBasedTransactionAttribute requiredTx = new RuleBasedTransactionAttribute();
        requiredTx.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
        requiredTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        //绑定规则
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

    //配置事务切面
    @Bean
    public Advisor getAdvisor(@Autowired TransactionInterceptor transactionInterceptor) {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression("execution(* com.apai.service.impl.*.*(..))");

        return new DefaultPointcutAdvisor(pointcut, transactionInterceptor);
    }

}
```

## 表现层获取实例化对象

```java
// 方法一: 获取xml配置文件的bean
	//1.创建Spring的IOC容器对象
	ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
	//2.从IOC容器中获取Bean实例 返回objce类型 需强转
	IUserService userService = (IUserService) context.getBean("bean名");
	//3.调用方法
	userService.saveUser();

// 方法二: xml容器
	ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
	接口对象类型 实例化对象名 = applicationContext.getBean(接口名.class);

// 方法二: 注解容器
	ApplicationContext applicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
	业务层接口类型 变量名 = applicationContext.getBean(业务层接口.class);
```



# Spring MVC 通用模板

## Spring MVC --> pox.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.apai</groupId>
    <artifactId>springMVC02</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>springMVC02</name>
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <junit.version>5.8.2</junit.version>
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
        <!-- lombok 实体类注解 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.16</version>
            <scope>compile</scope>
        </dependency>
        <!-- jackson转换对象 -->
        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
            <version>2.12.5</version>
        </dependency>
        <!-- commons-fileupload 文件上传 -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.4</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.3.2</version>
            </plugin>
            <!--Tomcat9的插件-->
            <plugin>
                <groupId>org.opoo.maven</groupId>
                <artifactId>tomcat9-maven-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <!--如果不配置path，则默认的上下文路径当前项目名-->
                    <path>/</path>
                    <!--tomcat的端口-->
                    <port>80</port>
                    <uriEncoding>UTF-8</uriEncoding>
                </configuration>
            </plugin>
        </plugins>

    </build>
</project>
```

## Web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--配置SpringMVC的核心控制器-->
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


</web-app>
```

## spring-mvc.xml 

resources资源包下

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

    <!--  静态资源访问的开启 除了jsp文件其他文件无法直接访问 开启可访问 -->
    <mvc:default-servlet-handler/>

    <!-- 文件上传,id必须设置为multipartResolver -->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!-- 设置文件上传大小 -->
        <property name="maxUploadSize" value="5000000" />
    </bean>
    
</beans>
```



# SSM  整合 模板

## 项目执行流程

## 修改pom.xml，引入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.woniu</groupId>
    <artifactId>SSM8-1</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>SSM8-1</name>
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <junit.version>5.7.1</junit.version>
    </properties>

    <dependencies>
        <!--spring-webmvc：Spring web核心-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.18</version>
        </dependency>
        <!--spring-jdbc-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.3.18</version>
        </dependency>
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
        <!--mybatis-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus</artifactId>
            <version>3.4.3</version>
            <exclusions>
                <exclusion>
                    <groupId>com.github.jsqlparser</groupId>
                    <artifactId>jsqlparser</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!--  mybatis分页插件-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper</artifactId>
            <version>5.1.2</version>
        </dependency>


        <!--jstl-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <!-- jackson -->
        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
            <version>2.12.5</version>
        </dependency>
        <!-- commons-fileupload -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.4</version>
        </dependency>

        <!-- log4j -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.14.0</version>
        </dependency>
        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <optional>true</optional>
        </dependency>
        <!--测试依赖-->
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
            <!--Tomcat9的插件-->
            <plugin>
                <groupId>org.opoo.maven</groupId>
                <artifactId>tomcat9-maven-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <!--如果不配置path，则默认的上下文路径当前项目名-->
                    <path>/</path>
                    <!--tomcat的端口-->
                    <port>8080</port>
                    <uriEncoding>UTF-8</uriEncoding>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                    <include>**/*.tld</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>
</project>
```

## resources  --> spring配置文件

位于 resources  -->   spring 下

* spring-mvc.xml ：它是展现层的配置文件，给SpringMVC使用的
* application-service.xml：它是业务层的配置文件，它主要是配置spring容器的
* application-mapper.xml：它是持久层的配制文件，它主要是配置mybatis

### spring-mvc 的配置

* 扫描Controller包
* 视图解析器
* 开启注解 <mvc:annotation-driver />
* 静态资源加载器
* 文件上传解析器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context
                           http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/mvc
                           http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!--扫描我们的控制器  特别注意: controller-->
    <context:component-scan base-package="com.taiyang.springmvc03.controller"></context:component-scan>

    <!--视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>

    <!--开始MVC注解：例如支持 @ResponseBody-->
    <mvc:annotation-driven/>

    <!--静态资源处理-->
    <mvc:default-servlet-handler/>

    <!-- 文件上传,id必须设置为multipartResolver -->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!-- 设置文件上传大小 -->
        <property name="maxUploadSize" value="5000000"/>
    </bean>
</beans>
```

### application-service 的配置

* 扫描service包
* 事务配置：事务管理器、事务通知、事务顾问

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context
                           http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/aop
                           http://www.springframework.org/schema/aop/spring-aop.xsd
                           http://www.springframework.org/schema/tx
                           http://www.springframework.org/schema/tx/spring-tx.xsd">
    <!--配置扫描包  特别注意: service-->
    <context:component-scan base-package="com.taiyang.springmvc03.service"></context:component-scan>

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
            <tx:method name="save*" propagation="REQUIRED" rollback-for="Exception"/>
            <tx:method name="insert*" propagation="REQUIRED" rollback-for="Exception"/>
            <tx:method name="add*" propagation="REQUIRED" rollback-for="Exception"/>

            <tx:method name="delete*" propagation="REQUIRED" rollback-for="Exception"/>
            <tx:method name="update*" propagation="REQUIRED" rollback-for="Exception"/>

            <tx:method name="select*" propagation="SUPPORTS" read-only="true"/>
            <tx:method name="find*" propagation="SUPPORTS" read-only="true"/>
            <tx:method name="get*" propagation="SUPPORTS" read-only="true"/>
            <tx:method name="query*" propagation="SUPPORTS" read-only="true"/>
        </tx:attributes>
    </tx:advice>

    <!--配置事务顾问  特别注意: service.impl.*.*(..)-->
    <aop:config>
        <aop:pointcut id="servicePointcut" expression="execution(* com.taiyang.springmvc03.service.impl.*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="servicePointcut"></aop:advisor>
    </aop:config>
</beans>
```

### application-mapper 的配置

* 引入 jdbc.properties 

```properties 
jdbc.driverClassName=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/数据库名?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=123456
```

* 配置数据源
* 回话工厂 ：别名包、分页插件、日志框架
* MapperScanner：Spring和Mybatis

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context 
                           http://www.springframework.org/schema/context/spring-context.xsd">

    <!--引入配置-->
    <context:property-placeholder location="classpath:jdbc.properties"></context:property-placeholder>
    <!--配置数据库连接池-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <property name="driverClassName" value="${jdbc.driverClassName}"></property>
    </bean>

    <!-- 配置sqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"></property>
        <!--别名包配置 特别注意: entity-->
        <property name="typeAliasesPackage" value="com.taiyang.springmvc03.entity"></property>

        <!--指定xml文件的目录，如果它和Dao接口文件在一起，可以省略；如果不在一起，必须配置-->
        <!--        <property name="mapperLocations" value="classpath:com/woniu/dao/*.xml"></property>-->

        <!--Mybatis的配置类-->
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

    <!-- 扫描Dao接口包目录，生成dao代理对象并纳入Spring容器管理 特别注意: mapper-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
        <property name="basePackage" value="com.taiyang.springmvc03.mapper"></property>
    </bean>
</beans>
```

## web.xml 配置

* ServletContext监听器：使用 application-service、application-mapper的配置，初始化Spring容器，它是父容器。

* 前端控制器：使用 spring-mvc 的配置初始化Spring容器，它是子容器。
* 过滤器：配置乱码

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--全局参数-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring/application*.xml</param-value>
    </context-param>
    <!--Spring的监听器：它的目的初始化Spring父容器，它作用于业务层，持久层-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!--配置全局过滤的filter-->
    <filter>
        <filter-name>CharacterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <!--对request设置-->
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <!--对response设置-->
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CharacterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--1.接受除.jsp外的所有请求  2.初始化Spring子容器，它作用于展现层-->
    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring/spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!--设置启动首页-->
    <welcome-file-list>
      <welcome-file>kuwei.html</welcome-file>
      <welcome-file>aaaa.htm</welcome-file>
      <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
    
</web-app>
```

## service 业务层 

* service 业务层 调用 mapper 持久层  

* Impl 实现 service 业务层 

* 使用 @Service 加入配置以供 Controller 表现层调用实例

* 使用 @Autowired 获取到 mapper 持久层  的实例对象

```java
@Service
public class SmbmsUserServiceImpl implements SmbmsUserService {

    @Autowired
    private SmbmsUserMapper smbmsUserMapper;

    @Override
    public List<SmbmsUser> findAll() {
        return smbmsUserMapper.findAll();
    }
}
```

##  Controller 表现层

* Controller 表现层 调用 service 业务层 

* 使用 @Autowired 获取到 service 业务层 的实例对象
* 根据 @RequestMapping("/user")   @RequestMapping("/findAllUser")  地址在浏览器发送请求 调用方法

```java
import com.taiyang.springmvc03.entity.SmbmsUser;
import com.taiyang.springmvc03.service.SmbmsUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller // 表现层注解 
@RequestMapping("/user")  // 请求获取
public class smbmsUserController {

    @Autowired
    private SmbmsUserService smbmsUserService;

    @RequestMapping("/findAllUser") // 请求获取
    @ResponseBody // 不就行页面跳转
    public void findAllUser() {
        List<SmbmsUser> userList = smbmsUserService.findAll();
        userList.forEach(user -> {
            System.out.println(user);
        });
    }

}

```



## SpringBoot Web配置

#### pom 配置

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.6.RELEASE</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

```

#### yml 配置

```yaml
server:
    port: 8080
    servlet:
        context-path: /project-name
```



## SpringBoot Mybatis 配置

#### pom配置

```xml
<!--数据库驱动--->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!--数据源--->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!--Mybatis-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>

<!--aop-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

#### yml配置

```yaml
spring: 
	datasource: 
		driver-class-name: com.mysql.cj.jdbc.Driver
		username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
            
mybatis:
    mapper-locations: classpath:com/woniu/mapper/*.xml
    type-aliases-package: com.woniu.entity
    configuration:
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
	
```



# SpringBoot Web配置

## pom 配置

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.6.RELEASE</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

```

## yml 配置

```yaml
server:
    port: 8080
    servlet:
        context-path: /project-name
```



# SpringBoot Mybatis 配置

## pom  配置

```xml
<!--数据库驱动--->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!--数据源--->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!--Mybatis-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>

<!--aop-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

## yml  配置

```yaml
spring: 
	datasource: 
		driver-class-name: com.mysql.cj.jdbc.Driver
		username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
            
mybatis:
    mapper-locations: classpath:com/woniu/mapper/*.xml
    type-aliases-package: com.woniu.entity
    configuration:
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
	
```



# SpringBoot  项目 - 模板

## pom.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.apai</groupId>
    <artifactId>SpringBoot-Vue</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringBoot-Vue</name>
    <description>SpringBoot-Vue</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    </properties>

    <!-- 依赖锁定 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>


    <dependencies>

        <!-- spring web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- spring aop -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <!-- thymeleaf -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>


        <!-- mysql 驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--spring-jdbc-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jdbc</artifactId>
        </dependency>
        <!-- mybatis-plus 启动器-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.2</version>
        </dependency>


        <!--分页插件-->
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
        <!-- mybatis plus 代码生成器 -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>3.5.1</version>
        </dependency>
        <!-- 代码生成器使用时，使用Freemarker引擎模板，默认的是Velocity引擎模板 -->
        <dependency>
            <groupId>org.freemarker</groupId>
            <artifactId>freemarker</artifactId>
            <version>2.3.31</version>
        </dependency>


        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--配置执行注解-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <!--测试-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>


    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <mainClass>com.apai.springbootvue.SpringBootVueApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>

        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/**.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>
```

## application.yml 配置

```yml
server:
    servlet:
        encoding:
            enabled: true
            charset: UTF-8
            force: true

spring:
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
    thymeleaf:
        cache: false
        prefix: classpath:/templates/
        suffix: .html

mybatis-plus:
    type-aliases-package: com.apai.entity
    configuration:
        map-underscore-to-camel-case: false   # false 表示不开启驼峰     true表示开启驼峰功能
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl     # logbak 日志
```

## 启动主程序

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApplicationMybatis {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationMybatis.class, args);
    }
}
```



# SpringBoot  父项目 - 模板

## pom.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--  spring-boot 父工程  -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.6.RELEASE</version>
    </parent>

    <groupId>com.apai</groupId>
    <artifactId>SpringBoot-02</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <!--  依赖坐标 大部分的版本号已被父工程设置  -->
    <dependencies>
        <!--web 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--aop 切面 事务 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

        <!--mysql数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--数据源-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <!--mybatis 启动器-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.4</version>
        </dependency>

        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--配置执行注解-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <!--  插件  -->
    <build>
        <resources>
            <!--   设置 sql 的位置为 resources下  -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                    <include>**/*.yml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <!--   设置 sql 的位置为 java下  -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>
```

## resources 包

### application.yml 配置

```yml
spring:
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: 123456
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        type: com.zaxxer.hikari.HikariDataSource
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10

mybatis:
    # 设置 扫描 entity 实体类包
    type-aliases-package: com.apai.entity
    # 设置 扫描 mapper.xml sql语句包 文件
    mapper-locations: classpath:com/apai/mapper/*.xml
    # 设置日志打印
    configuration:
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl

# 分页配置 需加依赖
pagehelper:
    reasonable: true #当传入的页数大于总页数时，会查询最后一页
    # dialect: mysql   #设置数据库类型 但是会报错 暂时未知原因
```

### logback配置文件：

logback-spring.xml 【采用logback-spring.xml配置，就不要再application.yml里面配置了，以免冲突】

```java
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
    
@Slf4j  // 日志打印类 注解
    
log.debug("测试....");  // 自定义日志打印
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 日志输出级别 -->
    <root level="INFO">
        <appender-ref ref="STDOUT"/>
    </root>

    <!--打印SQL-->
    <logger name="com.boot.mapper" level="DEBUG" additivity="false">
        <appender-ref ref="STDOUT"/>
    </logger>
</configuration>
```

## 事务配置类

config 包下  事务保证业务层的业务 提交 回滚 等

```java
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.interceptor.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class TransConfig {

    @Autowired
    private PlatformTransactionManager transactionManager;

    //配置通知
    @Bean
    public TransactionInterceptor getTransactionInterceptor() {
        TransactionInterceptor transactionInterceptor = new TransactionInterceptor();
        transactionInterceptor.setTransactionManager(transactionManager);

        //设置 readOnly 规则
        RuleBasedTransactionAttribute readOnlyTx = new RuleBasedTransactionAttribute();
        readOnlyTx.setReadOnly(true);
        readOnlyTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_SUPPORTS);
        //设置 required 规则
        RuleBasedTransactionAttribute requiredTx = new RuleBasedTransactionAttribute();
        requiredTx.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
        requiredTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        //绑定规则
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

    //配置事务切面  特别注意: 配置的路径
    @Bean
    public Advisor getAdvisor() {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression("execution(* com.woniu.service.impl.*.*(..))");

        return new DefaultPointcutAdvisor(pointcut, getTransactionInterceptor());
    }
}

```

## 启动主程序

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApplicationMybatis {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationMybatis.class, args);
    }
}

```

## controller 表现层

```java
import com.apai.entity.User;
import com.apai.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController  // 让该类下所有的方法无法跳转页面
@RequestMapping("/user") // 请求第一层
public class UserController {
	// 在配置里获取service业务层的实例对象 业务层需实现业务层接口 和 使用注解@Service以供调用
    @Autowired 
    private IUserService userService;
	// 请求第二层
    @RequestMapping("/userall")
    public List<User> userall(){
        List<User> userList = userService.userall();
        return userList;
    }
}

```

## Service 业务层

```java
import com.apai.entity.User;
import com.apai.mapper.UserMapper;
import com.apai.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // 加入配置 供表现层调用
public class UserServiceImpl implements IUserService { // 实现业务层接口 重写其方法

    @Autowired // 获取mapper实例
    private UserMapper userMapper;


    @Override // 重写方法
    public List<User> userall() {
        return userMapper.userlist();
    }
}
```

## Mapper 数据访问层

```java
import com.apai.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
 
@Mapper  // 加入配置 供业务层调用 业务boot为自动扫描mapper包 则必须加上注解
public interface UserMapper {

    @Select("select * from smbms_user")
    List<User> userlist();
}

```



# SpringBoot Jsp  项目模板

* SpringBoot 默认不支持 jsp 文件 需加上对应的配置

* 其余文件与 SpringBoot 模板一致 

* jsp 文件需方在 webapp / WEB-INF / jsp 文件夹下    可在app配置进行更改

## pom.xml 文件

* 需加三组jsp支持的依赖坐标

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--  spring-boot 父工程  -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.6.RELEASE</version>
    </parent>

    <groupId>com.apai</groupId>
    <artifactId>SpringBootJsp-03</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <!--  依赖坐标 大部分的版本号已被父工程设置  -->
    <dependencies>
        <!--web 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--aop 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

        <!-- jasper jsp 的支持，用于编译jsp  jsp支持-->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
        </dependency>
        <!--servlet-api jsp支持  - jsp专属依赖-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <scope>provided</scope>
        </dependency>
        <!--jstl jsp支持 - jsp专属依赖-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
        </dependency>

        <!--mysql数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--数据源-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <!--mybatis 启动器-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.4</version>
        </dependency>

        <!--分页插件-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.3.0</version>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--配置执行注解-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <!--  插件  -->
    <build>
        <resources>
            <!--springboot 支持jsp打包  - jsp专属依赖-->
            <resource>
                <directory>src/main/webapp</directory>
                <targetPath>META-INF/resources/</targetPath>
                <includes>
                    <include>**/**</include>
                </includes>
            </resource>
            <!--   设置 sql 的位置为 resources下  -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/**</include>
                    <!--   <include>**/*.properties</include>  -->
                    <!--   <include>**/*.xml</include>  -->
                    <!--   <include>**/*.yml</include>  -->
                </includes>
                <filtering>false</filtering>
            </resource>
            <!--   设置 sql 的位置为 java下  需同上一组一致-->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/**</include>
                    <!--   <include>**/*.xml</include>  -->
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>
```

## resources -> application.yml 

```yml
spring:
    mvc:
        view:
            prefix: /WEB-INF/jsp/
            suffix: .jsp
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: 123456
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        type: com.zaxxer.hikari.HikariDataSource
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10

server:
    servlet:
        encoding:
            enabled: true
            charset: UTF-8
            force: true
        # boot不支持jsp 可配置 需要热部署感谢页面
        jsp:
            init-parameters:
                development: true

mybatis:
    # 设置 扫描 entity 实体类包
    type-aliases-package: com.apai.entity
    # 设置 扫描 mapper.xml sql语句包 文件
    mapper-locations: classpath:com/apai/mapper/*.xml
    # 设置日志打印
    configuration:
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
        
# 分页配置
pagehelper:
    reasonable: true #当传入的页数大于总页数时，会查询最后一页
    # dialect: mysql #设置数据库类型 但是会报错 暂时未知原因
```

## JSP -->  pom 专属配置

```xml
<!-- jasper jsp 的支持. 用于编译jsp-->
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
</dependency>
<!-- jstl -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
</dependency>


<build>
    <resources>
        <!-- jsp 打包配置， 非常重要-->
        <resource>
            <directory>src/main/webapp</directory>
            <targetPath>META-INF/resources/</targetPath>
            <includes>
                <include>**/**</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/**</include>
            </includes>
            <filtering>false</filtering>
        </resource>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
</build>
```

## JSP -- yml  专属配置

```yml
server:
    servlet:
        encoding:
            enabled: true
            charset: utf-8
            force: true
        jsp:
            init-parameters:
                development: true   # jsp 热部署
                
spring: 
	mvc: 
		prefix: /WEB-INF/jsp/
		suffix: .jsp
```





# SpringBoot Thymeleaf  项目模板

## pom.xml 文件

* 需添加 Thymeleaf 启动器 
* 如果使用thymeleaf作为模板，那么需要把jsp配置清掉

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--  spring-boot 父工程  -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.6.RELEASE</version>
    </parent>

    <groupId>com.apai</groupId>
    <artifactId>SpringBootThymeleaf-04</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <!--  依赖坐标 大部分的版本号已被父工程设置  -->
    <dependencies>
        <!--web 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--aop 启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <!--thymeleaf 启动器 - thymeleaf专属依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!--mysql数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--数据源-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <!--mybatis 启动器-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.4</version>
        </dependency>
        <!--分页插件-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.3.0</version>
        </dependency>

        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--配置执行注解-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <!--  插件  -->
    <build>
        <resources>
            <!--   设置 sql 的位置为 resources下  -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <!--   设置 sql 的位置为 java下  -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>
```

## resources -> application.yml 

```yml
spring:
    thymeleaf:
        prefix: classpath:/templates/
        suffix: .html
        cache: false

    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: 123456
        url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
        type: com.zaxxer.hikari.HikariDataSource
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
            
# 设置 编码 防止乱码
server:
    servlet:
        encoding:
            enabled: true
            charset: UTF-8
            force: true

mybatis:
    # 设置 扫描 entity 实体类包
    type-aliases-package: com.apai.entity
    # 设置 扫描 mapper.xml sql语句包 文件
    mapper-locations: classpath:com/apai/mapper/*.xml
    # 设置日志打印
    configuration:
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
        
# 分页配置
pagehelper:
    reasonable: true #当传入的页数大于总页数时，会查询最后一页
    # dialect: mysql   #设置数据库类型 但是会报错 暂时未知原因
```

## thymeleaf  -- pom 专属配置

如果使用thymeleaf作为模板，那么需要把jsp配置清掉

```xml
<!--thymeleaf 启动器 - thymeleaf专属依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

## thymeleaf  -- yml  专属配置

```yml
spring: 
	thymeleaf: 
		cache: false
		prefix: classpath:/templates/
		suffix: .html
```

## thymeleaf -- HTML 网页

resources -> templates 包下 注意: 因为在yml文件中配置了跳转地址使用必须在该包下 也可修改配置

```html
<!DOCTYPE html>
<!--表示 警告压制 防止报红 不是注释-->
<!--suppress ALL-->
<!--  xmlns:th="http://www.thymeleaf.org" 相对于命名空间 具有代码提示功能  -->
<html lang="zh-cn" xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
<head>
    <!--  上下文路径 可保证相对路径  -->
    <base th:href="${#request.getContextPath()} + '/' ">
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="css/test.css">
    <script src="js/test.js"></script>
</head>
<body>
    <div>
        <span>欢迎光临!!!</span>
        <table>
            <tr th:each="user : ${users}">
                <td th:text="${user.id}"></td>
                <td th:text="${user.userCode}"></td>
                <td th:text="${user.userName}"></td>
            </tr>
        </table>
    </div>
</body>
</html>
```

### thymeleaf  添加静态资源

* 查看ResourceProperties类，静态资源存放的默认位置由4个目录，分别在根目录，
* 即/src/main/resources/目录下的
* /META-INF/resources/、/resources/、/static/、/public/目录下（优先级也是这个顺序）



# 父子工程模板配置

## 父工程 pom.xml 依赖配置

> 特别注意:  <!--mybatis-plus 启动器-->  和   <!--分页插件-->  会产生依赖冲突 会造成异常
>
> 解决方法:  排除分页插件的异常的依赖   可解决报错

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.apei</groupId>
    <artifactId>SpringBootParent</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <!-- 根据子项目自动生成 -->
    <!--<modules>-->
	<!--<module>SpringApai01</module>-->
	<!--<module>SpringApai02</module>-->
	<!--</modules>-->
    
    <!-- pom 需手动添加 -->
	<packaging>pom</packaging>
    <name>SpringBootParent</name>
    <description>SpringBootParent</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    </properties>

    <!--  依赖声明  -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!--  坐标依赖  -->
    <dependencies>
        <!--web 依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--aop-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>


        <!--mysql 数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--数据源 spring-jdbc 包含hikari连接池-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <!--mybatis-plus 启动器-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.2</version>
        </dependency>
        <!--如需跳转页面 需加入 jsp 或者 Thymeleaf 启动器-->
        <!--mybatis-plus 两个依赖 代码生成器-->

        <!--分页插件-->
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
        <!--实体类注解-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--配置执行注解-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>

        <!--测试相关依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>


    <!--插件-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <mainClass>com.apei.SpringBootParentApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
       		<!--  此处可放 MyBatis 代码生成器插件 -->
        </plugins>

        <resources>
            <!--   设置 sql 的位置为 resources下  -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <!--   设置 sql 的位置为 java下  -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/**.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>

```

## application.yml 配置

> **resources** 包下的 application.yml 配置

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      idle-timeout: 60000
      maximum-pool-size: 30
      minimum-idle: 10

mybatis-plus:
  # 设置 扫描 entity 实体类包
  type-aliases-package: com.apai.entity
  # 设置 扫描 mapper.xml sql语句包 文件
  mapper-locations: classpath:com/apai/mapper/*.xml
  # 设置日志打印
  configuration:
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
```

# |---------------------- 分界线

# Spring 脚手架创建 父子工程

> Spring Initializr 脚手架创建 父子工程

> 在 meven 显示为平级

**选择仓库时选择阿里仓库**:  https://start.aliyun.com

![image-20220625115532840](https://gitee.com/LuisApai/apai_imags/raw/master/image-20220625115532840.png)

## 父工程 pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--模块 目录-->
    <groupId>com.apai</groupId>
    <!--父模块 名称-->
    <artifactId>SpingBoot-rides</artifactId>
    <!--版本号-->
    <version>0.0.1-SNAPSHOT</version>
    <!--类型 pom-->
    <packaging>pom</packaging>
    
    <!--指定子模块-->
    <modules>
        <module>common</module>
        <module>service</module>
    </modules>

    <!--2.3.7.RELEASE 继承-->
    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!--  依赖坐标 - 子项目公共依赖  -->
    <dependencies>
            
    </dependencies>

    <!--  插件  -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

## 子项目 pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--指定父类模块-->
    <parent>
        <groupId>com.apai</groupId>
        <artifactId>SpingBoot-rides</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <!--子类模块名-->
    <artifactId>Rides-boot</artifactId>


    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>

    <dependencies>
        <!--web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--实体类注解-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <!-- redis 连接内存数据库 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!-- mysql -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!--mybatis-plus 启动器-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.2</version>
        </dependency>
        <!--分页插件-->
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
    </dependencies>


    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <!--启动类 使用Spring Initializr脚手架创建时 会自动创建启动类-->
                    <mainClass>com.apai.RidesBootApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
        <resources>
            <!--   设置 sql 的位置为 resources下  -->
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <!--   设置 sql 的位置为 java下  -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/**</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

</project>

```

## 子项目 application.yml

```yml
server:
    servlet:
        encoding:
            enabled: true
            charset: utf-8
            force: true

spring:
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
        username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/k15?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
    thymeleaf:
        cache: false
        prefix: classpath:/templates/
        suffix: .html
    #  连接 redis  
    redis:
        host: 192.168.174.128
        port: 6379


mybatis-plus:
    type-aliases-package: com.woniu.entity
    configuration:
        map-underscore-to-camel-case: false                     # false 表示不开启驼峰     true表示开启驼峰功能
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl     # logbak 日志


pagehelper:
    reasonable: true #当传入的页数大于总页数时，会查询最后一页

```



# 代码生成器

## mybatis - 代码生成器

### pom.xml 生成器插件配置

> mybatis - 代码生成器 pom.xml  的 <plugins> 插件标签内

```xml
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

### generatorConfig.xml  配置

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

### 开启自动生成

![image-20220601174717702](https://gitee.com/LuisApai/apai_imags/raw/master/image-20220601174717702.png)



## Mybatis-plus 代码生成器

### 添加依赖

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

### 添加 模板引擎

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


    public static void main(String[] args) {
       //生成的文件放置目录 必须以 '\\ 或者 /' 结尾
        String outputDir = "D:/paidaxing/";
        //设置父包名
        String packageName = "com.woniu";
        // 数据库信息 | 注意修改
        String mapperXmlDir = outputDir + packageName.replaceAll("\\.", "/") + "/mapper";
        String url = "jdbc:mysql://192.172.0.18:3390/Apai_integral?serverTimezone=UTC";

        FastAutoGenerator.create(url, "root", "123456")
                .globalConfig(builder -> {
                    // 设置作者
                    builder.author("阿派")
                            // 开启 swagger 模式
                             .enableSwagger()
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
                    builder.addInclude("表名1", "表名2")  //给该表生成
                            .addTablePrefix("user_") //设置过滤表前缀
                            .entityBuilder().enableLombok() //entity 使用 lombok
                            //不开启驼峰: NamingStrategy.no_change 带下划线的表会自动生成注解
                            //开启驼峰:NamingStrategy.underline_to_camel 注意更改yml配置
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





# POM.xml 依赖文件

## POM.xml  总体详解

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!--1.project是pom.xml根元素，它包含了pom.xml的一些约束信息，声明了一些POM相关的命名空间以及xsd元素
        2.xmlns  命名空间，类似包名 xmlns:xsi	xml遵循的标签规范 xsi:schemaLocation
        3.定义xmlschema的地址，xml书写时需要遵循的语法-->

    <!-- 指定了当前pom.xml版本，目前固定为4.0.0版本。-->
    <modelVersion>4.0.0</modelVersion>

    <!--  坐标  -->
    <!--  属于哪个组，一般是项目所在组织或公司域名的倒序 子项目继承 -->
    <groupId>com.apai</groupId>
    <!--  定义当前项目在组中的唯一ID，一个groupId下面可能多个项目，就是靠artifactId来区分的 -->
    <artifactId>Apai_wxafter</artifactId>
    <!--  定义项目当前的版本 子项目继承  -->
    <version>0.0.1-SNAPSHOT</version>
    <!--  打包类型，可取值：pom , jar , maven-plugin , ejb , war , ear , rar , par等等  -->
    <!--  父项目版本管理等使用:pom 子业务项目打包使用:jar  -->
    <packaging>pom</packaging>

    <!--  指定子项目 | 也可不写  -->
    <!--<modules>-->
    <!--    <module>common</module>-->
    <!--    <module>service</module>-->
    <!--    <module>gateway</module>-->
    <!--</modules>-->

    <!--  指定父类模块 额外定义: pom.xml版本 组中的唯一ID 打包类型  -->
    <!--<parent>-->
    <!--    <groupId>com.apai</groupId>-->
    <!--    <artifactId>Apai_wxafter</artifactId>-->
    <!--    <version>0.0.1-SNAPSHOT</version>-->
    <!--</parent>-->

    <!--  定义的属性变量，在其他地方进行使用  -->
    <properties>
        <!--  Java版本  -->
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
        <!--Nacos 版本管理 后续版本指定通过${spring-cloud-alibaba.version}使用-->
        <spring-cloud-alibaba.version>2.2.2.RELEASE</spring-cloud-alibaba.version>
        <!--EurekaServer依赖的版本 后续版本指定通过${spring-cloud.version}使用-->
        <spring-cloud.version>Hoxton.SR9</spring-cloud.version>
    </properties>

    <!-- 在父项目中用dependencyManagement声明依赖的版本 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--Nacos 管理-->
            <dependency>
                <!--依赖项的组织名-->
                <groupId>com.alibaba.cloud</groupId>
                <!--依赖项的子项目名-->
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <!--依赖项的版本-->
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <!-- 依赖项的适用范围 -->
                <scope>import</scope>
            </dependency>
            <!--Springcloud 管理 可写入父类的pom-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!--定义的依赖清单，有所依赖包都需要写在这个标签里面-->
    <dependencies>
        <!--SpringBoot依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--SpringBoot测试依赖-->
        <dependency>
            <!--依赖项的组织名-->
            <groupId>org.springframework.boot</groupId>
            <!--依赖项的子项目名-->
            <artifactId>spring-boot-starter-test</artifactId>
            <!-- 依赖项的适用范围 -->
            <scope>test</scope>
            <!-- 排除依赖，主动断开依赖的资源，排除项目中的依赖冲突时使用，不依赖该项目，被排除的资源不需要指定版本-->
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <!-- 构建项目需要的信息 -->
    <build>
        <!-- 这个元素描述了项目相关的所有资源路径列表，例如和项目相关的属性文件，这些资源被包含在最终的打包文件里。 -->
        <resources>
            <!-- 表示在打包时 将一下符合条件的所有文件进行打包 -->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.yml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.yml</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
        <!-- 使用的插件列表 plugin元素包含描述插件所需要的信息 -->
        <plugins>
            <!-- 指定启动类: jar包启动时没有指定必定报错 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <mainClass>com.apai.WxgzhappApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

## POM.xml  依赖

### 基础依赖配置

```xml
<!-- web 注解支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- mysql 数据库 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

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
<!--mybatis-plus 代码生成器 模板引擎-->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>

<!--实体类注解-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

### 依赖升级配置

```xml
<dependencies>
    <!-- AOP 面向切面编程 事务支持-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
    <!-- spring-jdbc 包含hikari连接池 mybatis-plus 已包含-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jdbc</artifactId>
    </dependency>
    <!-- 生成配置元数据 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
    <!--分页插件 和mybatis-plus冲突需排除 -->
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
    
    <!-- 测试 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
        <exclusions>
            <exclusion>
                <groupId>org.junit.vintage</groupId>
                <artifactId>junit-vintage-engine</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    
    <!-- 提供自动化装配功能 比如无法加载yml文件可解决 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```

### 功能类依赖

```xml
<dependencies>
    
    <!--thymeleaf 启动器 - 跳转静态包的html -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    
    <!--定时任务-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!--mail 邮件发送-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    
    <!--security 请求拦截 自定义登录 密码加密-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <!--security 加密相关的jar包-->
    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>3.8.1</version>
    </dependency>
    
    <!--阿里云 Oss 对象存储 文件上传-->
    <dependency>
        <groupId>com.aliyun.oss</groupId>
        <artifactId>aliyun-sdk-oss</artifactId>
        <version>3.8.0</version>
    </dependency>
    
    <!--minio依赖于okhttp-->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.8.1</version>
    </dependency>
    <!--minio 对象存储工具 -->
    <dependency>
        <groupId>io.minio</groupId>
        <artifactId>minio</artifactId>
        <version>8.3.9</version>
    </dependency>
    
    <!-- json 序列化 | 反序列化 -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.70</version>
    </dependency>
    
    <!--JSR303 请求参数校验-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!--Swagger 升级版依赖-->
    <dependency>
        <groupId>com.github.xiaoymin</groupId>
        <artifactId>knife4j-spring-boot-starter</artifactId>
        <version>3.0.2</version>
    </dependency>
    
    <!--rabbitmq 客户端-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    
    <!--redis 依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- Sharding-JDBC 分库分表 -->
    <dependency>
        <groupId>org.apache.shardingsphere</groupId>
        <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
        <version>4.0.0-RC1</version>
    </dependency>
    
    <!--拼音库-->
    <dependency>
        <groupId>com.belerweb</groupId>
        <artifactId>pinyin4j</artifactId>
        <version>2.5.0</version>
    </dependency>
    
    <!--生成excle的依赖-->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>easyexcel</artifactId>
        <version>2.2.3</version>
    </dependency>

</dependencies>
```

### Eureka 微服务 依赖

```xml
<!--Eureka 微服务-->
<!--eureka的注册中心依赖 还需配置版本<properties>和<dependencyManagement>-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
<!--EurekaServer-客户端自动注册-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<!--Hystrix熔断 服务降级-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
<!--Open Feign 远程调用组件-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<!--Zuul 网关组件-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>

<!--Eureka 微服务 版本管理 可写入父类的pom-->
<properties>
    <java.version>1.8</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    <!--EurekaServer依赖的版本 可写入父类的pom-->
    <spring-cloud.version>Hoxton.SR9</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <!--Springcloud 管理 可写入父类的pom-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### Nacos 依赖

```xml
<properties>
    <java.version>1.8</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    <!--Nacos 版本管理-->
    <spring-cloud-alibaba.version>2.2.2.RELEASE</spring-cloud-alibaba.version>
</properties>

<dependencies>
    <!--Nacos 自动注册依赖-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!--Nacos 配置中心 配置文件存放注册中心-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <!--Gateway 服务网关 无需web依赖否则报错-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <!--Nacos 管理-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## build 插件

### SQL 映射配置

```xml
<!--  插件  -->
<build>
    <!-- 这个元素描述了项目相关的所有资源路径列表，例如和项目相关的属性文件，这些资源被包含在最终的打包文件里。 -->
    <resources>
        <!--   设置 sql 的位置为 resources下  -->
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/**</include>
            </includes>
            <filtering>false</filtering>
        </resource>
        <!--   设置 sql 的位置为 java下  -->
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/**</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
</build>
```

### 指定项目启动类

```xml
<!-- 构建项目需要的信息 -->
    <build>
        <!-- 使用的插件列表 plugin元素包含描述插件所需要的信息 -->
        <plugins>
            <!-- 指定启动类: jar包启动时没有指定必定报错 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <!-- 指定启动类: 路径 -->
                    <mainClass>com.apai.WxgzhappApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```



# application.yml 配置文件

## YML 常用基础模板

```yaml
# 指定项目端口
server:
    port: 8001

spring:
	# 项目名称
    application:
        name: wxapplet
    # 配置文件的指定
    profiles:
        active: dev
    # MYSQL 数据库配置
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
        username: root
        password: lj102528@
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://1.12.252.62:3306/luapai?serverTimezone=UTC&allowMultiQueries=true
    # 微服务 NACOS 配置
    cloud:
        nacos:
            discovery:
                server-addr: 1.12.252.62:8848
            config:
                server-addr: ${spring.cloud.nacos.discovery.server-addr}
                file-extension: yaml
    # 中间件 Redis 配置
    redis:
        # Redis 服务器地址
        host: 1.12.252.62
        # Redis 服务器连接端口
        port: 6379
        # Redis 数据库索引（默认为 0）
        database: 0

mybatis-plus:
    # 关闭 mybatis-plus 启动日志
    global-config:
        banner: false
        # id的生成策略
        db-config:
            id-type: assign_id
    # 设置 扫描 entity 实体类包
    type-aliases-package: com.apai.entity
    # 设置 扫描 mapper.xml sql语句包 文件
    mapper-locations: classpath:com/apai/mapper/*.xml
    configuration:
        # 设置日志打印
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
        map-underscore-to-camel-case: true # false 表示不开启驼峰     true表示开启驼峰功能
```

## 配置汇总 | 历史

* application-dev.yml  |  开发环境
* application-test.yml    |  测试环境
* application-proc.yml  |  生产环境

```yml
spring:
  main:
    # 关闭 spring 启动日志
    banner-mode: off
  # 跳转的前缀 和 后缀
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
    cache: false
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/shangping?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      idle-timeout: 60000
      maximum-pool-size: 30
      minimum-idle: 10
  # 文件上传大小
  servlet:
    multipart:
      max-file-size: 1MB
      max-request-size: 3MB

#设置静态资源文件夹
  resources:
      static-locations:
          - file:D:/BluceLee
          - classpath:static

server:
  # 设置端口号
  port: 8080
  # 设置 编码 防止乱码
  servlet:
    encoding:
      enabled: true
      charset: UTF-8
      force: true


mybatis-plus:
  # 关闭 mybatis-plus 启动日志
  global-config:
    banner: false
  # 设置 扫描 entity 实体类包
  type-aliases-package: com.apai.entity
  # 设置 扫描 mapper.xml sql语句包 文件
  mapper-locations: classpath:com/apai/mapper/*.xml
  configuration:
    # 设置日志打印
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
   	# 实体类 和 表 列名的对应设置 false 表示不开启驼峰 true表示开启驼峰功能
  	# 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  	# 开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]
    map-underscore-to-camel-case: true 


# 分页配置
pagehelper:
  reasonable: true #当传入的页数大于总页数时，会查询最后一页
  # dialect: mysql   #设置数据库类型 但是会报错 暂时未知原因
```

```yml
server:
    port: 2023
spring:
    application:
        name: User_apai
    # 配置文件的指定
    profiles:
        active: dev
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
        username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/Apai_education?serverTimezone=UTC
    servlet:
        multipart:
            max-file-size: 200MB  #设置单个文件的大小  因为springboot内置tomact的的文件传输默认为10MB
            max-request-size: 500MB   #设置单次请求的文件总大小
            enabled: true    #千万注意要设置该参数，否则不生效
    redis:
        # Redis 服务器地址
        host: 192.168.174.133
        # Redis 服务器连接端口
        port: 6379
    cloud:
        nacos:
            discovery:
                server-addr: 192.168.174.133:8848
            config:
                server-addr: ${spring.cloud.nacos.discovery.server-addr}
    rabbitmq:
        host: 192.168.174.133
        username: admin
        password: admin
        virtual-host: my_vhost
        port: 5672
        # 路由器消息确认配置 生产方 默认 none | CORRELATED 异步 | SIMPLE 同步
        publisher-confirm-type: CORRELATED
        # 开启 消息到队列的回调 生产方
        publisher-returns: true
        listener:
            simple:
                # 开启手动应答 消费方
                acknowledge-mode: manual
                # 队列每次拉取消息次数 消费方
                prefetch: 1

mybatis-plus:
    # 关闭 mybatis-plus 启动日志
    global-config:
        banner: false
        # id的生成策略
        db-config:
            id-type: assign_id
    # 设置 扫描 entity 实体类包
    type-aliases-package: com.woniu.outlet.po
    # 设置 扫描 mapper.xml sql语句包 文件
    mapper-locations: classpath:com/woniu/outlet/mapper/*.xml
    configuration:
        # 设置日志打印
        log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
        map-underscore-to-camel-case: true # false 表示不开启驼峰     true表示开启驼峰功能

# minio 文件存储配置信息
minio:
    endpoint: http://192.172.0.18:9090
    accesskey: minioadmin
    secretKey: minioadmin

```

## 功能配置

### 设置端口号

```yml
server:
	port: 8080
```

### 页面跳转 

```yml
spring:
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
    cache: false
```

### 数据源

```yml
# 方式一
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/smbms?useUnicode=true&characterEncoding=utf8&useSSL=false&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      idle-timeout: 60000
      maximum-pool-size: 30
      minimum-idle: 10

# 方式二  
spring:
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        hikari:
            idle-timeout: 60000
            maximum-pool-size: 30
            minimum-idle: 10
        username: root
        password: 123456
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:mysql://localhost:3306/licaimoney?serverTimezone=UTC
```

### 编码和解码

```yml
# 设置 编码 防止乱码
server:
  servlet:
    encoding:
      enabled: true
      charset: UTF-8
      force: true
```

### 文件上传大小 yml 配置

```yaml
spring:
    servlet:
        multipart:
            max-file-size: 1MB
            max-request-size: 3MB
```

### Spring security 账号和密码

可在 application.yml 里配置 Spring security 账号和密码

```yml
spring:
    # security 拦截 与 权限控制 设置账号与密码
    security:
        user:
            name: apai
            password: 123456
```

### Redis  配置

```yml
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
```

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

### RabbitMQ 消息队列

```yml
spring:
  rabbitmq:
    host: 192.168.174.133
    username: guest
    password: guest
    virtual-host: /
    port: 5672
    # 路由器消息确认配置 生产方 默认 none | CORRELATED 异步 | SIMPLE 同步
    publisher-confirm-type: CORRELATED
    # 开启 消息到队列的回调 生产方
    publisher-returns: true
    listener:
      simple:
        # 开启手动应答 消费方
        acknowledge-mode: manual
        # 队列每次拉取消息次数 消费方
        prefetch: 1
```



## MyBatisPlus 表名 列名 配置

### 关闭启动日志 | id生成策略

```yml
mybatis-plus:
    global-config:
        # 关闭 mybatis-plus 启动日志
        banner: false
        # id的生成策略
        db-config:
            id-type: auto
```

### 下划线 表名配置

> - [x] **resources** 包下的 application.yml 配置
>
> MyBatisPlus 实体类 与 数据库表名 不对应 设置实体类的前缀拼接成表名
>
> 如果数据库中所有表都有个表名前缀，比如我们想让 **smbms_info** 表仍然对应 **Info** 实体类，可以添加如下全局配置设置表名前缀：

```yml
mybatis-plus:
  global-config:
    db-config:
      # MyBatisPlus 实体类 与 数据库表名 不对应 设置实体类的前缀拼接成表名
      table-prefix: smbms_
```

### 大小写区分  表名配置

> MyBatisPlus 实体类 与 表名 有大小写区分 解决方法
>
> 如果所有表名都不是下划线命名（但能跟类名对应上），比如想让 **userinfo** 表对应 **UserInfo** 实体类，可以添加如下全局配置，表示数据库表不使用下划线命名：

```yml
mybatis-plus:
  # MyBatisPlus 实体类 与 表名 有大小写区分 解决方法
  global-config:
    db-config:
      table-underline: false
```

-----------------------------------------------------------------------------------------------------------------------------------------------------------

### 下划线 列名与 字段配置

> 同表名一样，如果数据库表里的字段名使用标准的下划线命名，并且能对应上实体类的成员名称（驼峰命名），我们就不需要特别去手动匹配。比如下面 **user_info** 表里的字段会自动跟 **UserInfo** 实体类的各个成员属性一一对应：

### 列名使用驼峰 字段配置

> 如果数据库表里的字段名并不是使用下划线命名（但能跟实体类的成员名称对应上），可以添加如下全局配置，表示数据库表字段名不使用下划线命名： 列名 userName   字段 userName

```yml
mybatis-plus.configuration.map-underscore-to-camel-case=false

mybatis-plus:
  configuration:
  	# 实体类 和 表 列名的对应设置 false 表示不开启驼峰 true表示开启驼峰功能
  	# 如果 数据库的列名没有 "_" 一点要关闭驼峰 否则报错 [name --> u_name x]
  	# 开启驼峰功能 既使是手写的sql语句 也会将数据库的"_"之前的裁切掉 就算实体类没加指定注解也能映射 [u_name --> name]
    map-underscore-to-camel-case: true
    # 设置日志打印
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
```



## 设置静态资源文件夹

方式一:

```yml
spring:
#设置静态资源文件夹
  resources:
      static-locations:
          - file:D:/BluceLee
          - classpath:static
```

方式二: config 配置包 下的 **MyWebConfiture** 静态资源配置类

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyWebConfiture implements WebMvcConfigurer {
    // 配置静态资源处理
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/myImage/**").addResourceLocations("file:D:/BluceLee/");
    }

    // 配置拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebMvcConfigurer.super.addInterceptors(registry);
    }
}
```



## 分页配置

**依赖**

- [x] 特别注意:  <!--mybatis-plus 启动器-->  和   <!--分页插件-->  会产生依赖冲突 会造成异常

- [x] 解决方法:  排除分页插件的异常的依赖   可解决报错

```xml
<!--分页插件-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.5</version>
</dependency>
<!--分页插件 依赖排除-->
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

```yaml
pagehelper:
    reasonable: true 	#当传入的页数大于总页数时，会查询最后一页
    # dialect: mysql   #设置数据库类型 但是会报错 暂时未知原因
```





# 模板补充

## logback SQL日志配置文件：

logback-spring.xml 【采用logback-spring.xml配置，就不要再application.yml里面配置了，以免冲突】

```java
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
    
@Slf4j  // 日志打印类 注解
    
log.debug("测试....");  // 自定义日志打印
```

logback.xml

> 注意: 路径 com 否则无法打印sql语句

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 日志输出级别 -->
    <root level="INFO">
        <appender-ref ref="STDOUT"/>
    </root>

    <!--打印SQL 注意:mapper的路径-->
    <logger name="com.woniu.outlet.mapper" level="DEBUG" additivity="false">
        <appender-ref ref="STDOUT"/>
    </logger>
</configuration>
```

