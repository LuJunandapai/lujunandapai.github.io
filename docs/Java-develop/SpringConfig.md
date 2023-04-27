---
title: SpringConfig 微服务
date: 2023/04/26
---

# 集群与分布式

集群:把一个项目放到多个容器(tomcat)，不同的服务器上面跑
分布式:把一一个项目拆分成多个微服务(项目)，每个项目在不同的服务器上面跑

# Boot 和 Config 的区别

> 如果某些服务的并发量非常高，如双十一，用户下单量非常大，这种时候项目的架构就要考虑高并发的问题，可以采用微服务架构。

springboot:  就是一个单体应用，把所有的业务都耦合在一起，不方面水平扩展，即时把这个项目用集群的方式
来部署，也会存在耦合性的问题。一旦修改某一块业务，全部都要重新再部署

springcloud:  就是把一一个完整的项目，拆分成n个子模块，每个子模块相互独立，降低了业务间的耦合性，方便。水平业务扩展，一旦修改某一块业务，不影响其他的模块



# Eureka 与 Nacos 的区别

Eureka 与 Nacos 都作为注册中心

区别: 

* Eureka  只能 AP - 高可用性
* zookeeper  仅仅支持  CP - 强一致性
* Nacos 可以 AP - 高可用性 和 CP - 强一致性
* Nacos 可以用来做分组，不同的组之间，微服务相互不能发现对方

CAP 方案: 

* C: consitence 强一致性:主要是指在集群版的注册中心中，每个注册中心的内容必须同步之后才能访问。数据的完整性一-致性， 再如，
  在集群状态下，如果master宕机了或者其他的宕机了，整个注册中心进入瘫疾的状态。然后再从机中选一个当master
* A: Availability 高可用性:优先保证高可用，先保证效率，在集群状态下，只要有一个注册中心活着，整个微服务照常运行。
* P: Partition tolerance 分区容错性，这种无法避免，-般来说指的是硬件环境问题。

> 所以如果对数据要求比较高，则选cp,但影响效率
> 如果对数据要求不是那么高，但是追求效率，用ap



# Springcloud Config 微服务

> 微服务架构，是一种软件架构方式。微服务的主要特点体现在组件化、松耦合、自治和去中心化等方面。它将应用构建成一系列按业务领域划分模块的、小的自治服务，通过分解巨大单体式应用为多个服务方法解决了复杂性问题。每个服务还提供了一个严格的模块边界，甚至允许用不同的编程语言编写不同的服务。

## 服务调用方式

常见的远程调用方式有以下2种：

- RPC：Remote Produce Call远程过程调用，类似的还有 。自定义数据格式，基于原生TCP通信，速度快，效率高。早期的webservice，现在热门的dubbo （12不再维护、17年维护权交给apache），都是RPC的典型代表

- Http：http其实是一种网络传输协议，基于TCP，规定了数据传输的格式。现在客户端浏览器与服务端通信基本都是采用Http协议，也可以用来进行远程服务调用。缺点是消息封装臃肿，优势是对服务的提供和调用方没有任何技术限定，自由灵活，更符合微服务理念。现在热门的Rest风格，就可以通过http协议来实现。

## Http客户端工具

既然微服务选择了Http，那么我们就需要考虑自己来实现对请求和响应的处理。不过开源世界已经有很多的http客户端工具，能够帮助我们做这些事情，Java 的 JDK 中自带了与网络有关的类（HttpURLConnection），能够让你在 Java 代码中发出 HTTP 请求，并解析 HTTP 响应。不过，由于这些底层类和方法的使用过于繁杂罗嗦（并且执行效率不高），因此直接使用它们的情况并不多。通常，我们是使用对底层类和方法进行了二次包装的工具包（库），常见的有 apache 基金会的 httpclient（以及它的后辈、竞争对手 OkHTTP） 

- HttpClient
- OKHttp
- URLConnection

~~~
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
</dependency>
~~~

Spring 体系对 HttpURLConnection、httpclient 和 OkHTTP 进行了 2 次包装，提出了 **RestTemplate** 类，从而达到了如下目的：

1. 屏蔽了底层实现。无论底层使用它们 3 种中的哪个，RestTemplate 对外暴露的接口都是一样的。
2. 进一步简化了操作，降低了使用复杂度。

~~~
你的项目只要直接或间接引入了 spring-web 包，你就可以使用 RestTemplate ，restTemplate内部封装了HttpClient
~~~





# Spring 的 RestTemplate 远程请求

RestTemplate 是从 Spring3.0 开始支持的一个 HTTP 请求工具，它提供了常见的REST请求方案的模版，例如 GET 请求、POST 请求、PUT 请求、DELETE 请求以及一些通用的请求执行方法 exchange 以及 execute。RestTemplate 继承InterceptingHttpAccessor 并且实现了 RestOperations 接口，其中 RestOperations 接口定义了基本的 RESTful 操作，这些操作在 RestTemplate 中都得到了实现

## 常用方法

| HTTP Method | 常用方法      | 描述                                                         |
| ----------- | ------------- | ------------------------------------------------------------ |
| GET         | getForObject  | 发起 GET 请求响应对象                                        |
| GET         | getForEntity  | 发起 GET 请求响应结果、包含响应对象、请求头、状态码等 HTTP 协议详细内容 |
| POST        | postForObject | 发起 POST 请求响应对象                                       |
| POST        | postForEntity | 发起 POST 请求响应结果、包含响应对象、请求头、状态码等 HTTP 协议详细内容 |
| DELETE      | delete        | 发起 HTTP 的 DELETE 方法请求                                 |
| PUT         | put           | 发起 HTTP 的 PUT 方法请求                                    |

## 微服务准备: 

1.启动类

> 创建 RestTemplate 方法 并注入到配置里以供调用

```java
package com.apai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ModuleTowApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModuleTowApplication.class, args);
    }

    @Bean
    @LoadBalanced    // 负载均衡 不添加这个注解，不能直接用服务名访问
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}

```

2.表现层

> 表现层使用@Autowired注解调用其方法

```java
@Autowired
private RestTemplate restTemplate;
```



## Get  请求

### 1.占位符传参

getForEntity（）方法：如果开发者需要获取响应头的话，那么就需要使用 getForEntity 来发送 HTTP 请求，此时返回的对象是一个 ResponseEntity 的实例。这个实例中包含了响应数据以及响应头

~~~java
///////////////////////调用方
@GetMapping("/test1")
public String test1(String name,Integer id){
    String url = "http://localhost:8080/test1?name={1}&id={2}";
    ResponseEntity<List> result = restTemplate.getForEntity(url, List.class, name,id);
    StringBuffer sb  = new StringBuffer();

    HttpStatus status = result.getStatusCode();
    List<User> body = result.getBody();
    HttpHeaders headers = result.getHeaders();
    for (String s : headers.keySet()){
        sb.append(s).append(":").append(headers.get(s)).append("<br />");
    }
    sb.append("statusCode:").append(status).append("<br />")
        .append("body:").append(body).append("<br />");
    return sb.toString();
}
//////////////响应方///////////////////////////
@GetMapping("/test1")
public List<User> findUsers(String name,Integer id){
    System.out.println(name+ ":"+id);
    List<User> users = userMapper.selectByExample(null);
    return users;
}
~~~

> 第一个参数是 url ，url 中有一个占位符 {1} ,如果有多个占位符分别用 {2} 、 {3} … 去表示，第二个参数是接口返回的数据类型，最后是一个可变长度的参数，用来给占位符填值

### 2.map传参

~~~java
///////////////////////调用方 
@GetMapping("/test2")
public String test2(Integer id){
    String url = "http://localhost:8080/test2?id={id}";
    Map<String,Object> maps = new HashMap<>();
    maps.put("id",id);
    ResponseEntity<User> result = restTemplate.getForEntity(url, User.class, maps);
    StringBuffer sb  = new StringBuffer();
    HttpStatus status = result.getStatusCode();
    User body = result.getBody();
    sb.append("statusCode:").append(status).append("<br />")
        .append("body:").append(body).append("<br />");
    return sb.toString();
}
//////////////////////被调用方
@GetMapping("/test2")
public  String  getUserById(Integer id) throws JsonProcessingException {
    User user = userMapper.selectByPrimaryKey(id);
    return new ObjectMapper().writeValueAsString(user);
}
~~~

### 3.urI方式传参

~~~java
///////////////////////调用方 
@GetMapping("/test3")
public String test3(String name) throws UnsupportedEncodingException {
    System.out.println(name);
    String url = "http://localhost:8080/test3?name="+ URLEncoder.encode(name,"UTF-8");
    URI uri = URI.create(url);
    ResponseEntity<String> result = restTemplate.getForEntity(uri,String.class);
    StringBuffer sb  = new StringBuffer();
    HttpStatus status = result.getStatusCode();
    String str  = result.getBody();
    sb.append("statusCode:").append(status).append("<br />")
        .append("body:").append(str).append("<br />");
    return sb.toString();
} 
~~~

### 4.rest传参

~~~java
///////////////////////调用方
@GetMapping("/test4/{id}")
public String test4(@PathVariable Integer id){
    String url = "http://localhost:8080/test4/"+id;
    ResponseEntity<String> result = restTemplate.getForEntity(url,String.class);
    return result.getBody();
}
~~~

> 说明：
>
> getForObject 方法和 getForEntity 方法类似，getForObject 方法也有三个重载的方法，参数和 getForEntity 一样，这里主要说下 getForObject 和 getForEntity 的差异，这两个的差异主要体现在返回值的差异上， getForObject 的返回值就是服务提供者返回的数据，使用 getForObject 无法获取到响应头

## Post  请求

 根据上图可以看出POST请求方式一共提供了两个函数 postForEntity、postForObject、postForLocation。每个函数都有三个重载方法

### postForEntity

这些函数中的参数用法大部分与getForEntity一致，这里需要注意的是新增加（可为空的请求对象）request参数， 该参数可以是一个普通对象，也可以是一个HttpEntity对象。如果是一个普通对象，request内容会被视作完整的body来处理；而如果request 是一个HttpEntity对象， 那么就会被当作一个完成的HTTP请求对象来处理， 这个 request 中不仅包含了body的内容， 也包含了header的内容

#### 传递 key-value

案例1：组合传参

~~~java
//////////////客户端：request是一个HttpEntity对象
@GetMapping("/test1")
public String test1(){
    HttpHeaders headers = new HttpHeaders();
    headers.add("token","aaaaaaaa");
    MultiValueMap map = new LinkedMultiValueMap();
    map.add("name","雷锋");
    map.add("sex","男");
    HttpEntity entity = new HttpEntity(map,headers);
    ResponseEntity<String> json = 			        		    restTemplate.postForEntity("http://localhost:8080/test1",entity,String.class);
    return json.getBody();
}
///////////////////服务端
@PostMapping("/test1")
public String test1(@RequestBody MultiValueMap map, HttpServletRequest request){
    System.out.println(request.getHeader("token"));
    System.out.println(map.get("name"));
    System.out.println(map.get("sex"));
    return "ok";
}
~~~

#### 单个 对象 传参

> 单个 对象 传参

~~~java
//////////////客户端：request是一个普通对象
@GetMapping("/test2")
public String test2(){
    User user = new User();
    user.setId(1);
    user.setUsername("张三丰");
    user.setPassword("1111");
    ResponseEntity<String> json = restTemplate.postForEntity("http://localhost:8080/test2",user,String.class);
    return json.getBody();
}
///////////////////服务端
@PostMapping("/test2")
public String test2(@RequestBody User user){
    System.out.println(user);
    return "ok";
}
~~~

> 说明：
>
> 1.需要使用 LinkedMultiValueMap ,不能使用HashMap。RestTemplate默认提供的AllEncompassingFormHttpMessageConverter继承了FormHttpMessageConverter进行解析；传递类型为HashMap，可以发现被解析成了json字符串。用的是MappingJackson2HttpMessageConverter进行解析
>
> 2.server端要接收参数需要用@RequestBody注解，不然无法接收到参数

#### 传递JSON参数

~~~java
////////客户端
@GetMapping("/test3")
public String test3()  {
    String token = "aaaaa";
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
    httpHeaders.add("token",token);

    User user = new User();
    user.setId(1);
    user.setUsername("张三丰");
    List<User> users = new ArrayList<>();
    users.add(user);
    Object jsons = JSONArray.toJSON(users);

    HttpEntity entity = new HttpEntity(jsons,httpHeaders);
    ResponseEntity<String> result = restTemplate.postForEntity("http://localhost:8080/test3",entity,String.class);
    return result.getBody();
}
///////服务器
@PostMapping("/test3")
public String test3(@RequestBody String str,HttpServletRequest request){
    System.out.println(str);
    System.out.println(request.getHeader("token"));
    return "ok";
}
~~~

> 总结：
>
> 1.json转换是借用alibaba的第三方包fastjson
>
> 2.server端要接收参数需要用@RequestBody注解，不然无法接收到参数
>
> 3.POST参数到底是key/value还是json，主要看第二个参数，如果第二个参数是MultiValueMap，则是以key/value形式传递。如果第二个参数是一个普通对象，则是以json形式传递



### postForObject

参数可以是Json字符串，JavaBean对象，也可以是map，其中本质都是使用了HttpEntity对象，在RestTemplate内部有这样一段源码：程序会自动判断，如果不是HttpEntity对象就手动添加一次

```java
public HttpEntityRequestCallback(@Nullable Object requestBody, @Nullable Type responseType) {
   super(responseType);
   if (requestBody instanceof HttpEntity) {
      this.requestEntity = (HttpEntity<?>) requestBody;
   }
   else if (requestBody != null) {
      this.requestEntity = new HttpEntity<>(requestBody);
   }
   else {
      this.requestEntity = HttpEntity.EMPTY;
   }
}
```



#### 传递 javaBean

~~~java
////////////////////客户端
@GetMapping("/test1")
public String test1(){
    User user = new User();
    user.setId(1);
    user.setUsername("zhangsan");
    String s = restTemplate.postForObject("http://localhost:8080/test1", user, String.class);
    return s;
}

@GetMapping("/test2")
public String test2(){
    User user = new User();
    user.setId(1);
    user.setUsername("zhangsan");
    HttpHeaders headers  = new HttpHeaders();
    headers.add("token","aaaaaaaaaa");
    HttpEntity entity = new HttpEntity(user,headers);
    String s = restTemplate.postForObject("http://localhost:8080/test2", entity, String.class);
    return s;
}

///////////////服务端/////////////////
@PostMapping("/test1")
public String test1(@RequestBody User user ) {
    System.out.println(user);
    return "ok";
}
@PostMapping("/test2")
public String test2(@RequestBody User user, HttpServletRequest request) {
    System.out.println(user);
    System.out.println(request.getHeader("token"));
    return "ok";
}
~~~



### postForLocation

postForLocation也是提交新资源，提交成功之后，返回新资源的URI，postForLocation的参数和前面两种的参数基本一致，只不过该方法的返回值为Uri，这个只需要服务提供者返回一个Uri即可，该Uri表示新资源的位置

~~~java
//////////客户端////////////////
@GetMapping("/test3")
public void register(){
    MultiValueMap map = new LinkedMultiValueMap();
    map.add("id","1111");
    map.add("username","zhangsan");
    URI uri = restTemplate.postForLocation("http://localhost:8080/test3", map);
    System.out.println(uri);
    String s = restTemplate.getForObject(uri, String.class);
    System.out.println(s);
}
////////////服务端///////////////////
// 注意点: 该方法需要返回为 跳转重定向 不能直接在类上加上@RestControllerzu'du
@PostMapping("/test3")
public String register(User user){
    return "redirect:http://localhost:8080/loginPage?name=" + user.getUsername();
}

@GetMapping("/loginPage")
@ResponseBody
public String loginPage(String name){
    return "loginPage:" + name;
}
~~~

> 当然你可以使用restful风格针对post请求进行传参



## RestTemplate底层实现切换

RestTemplate 底层实现最常用的有以下三种：

- **SimpleClientHttpRequestFactory** 封装 JDK 的 URLConnection。默认实现
- **HttpComponentsClientHttpRequestFactory** 封装第三方类库 HttpClient
- **OkHttp3ClientHttpRequestFactory** 封装封装第三方类库 OKHttp

HttpClient 使用率更高，而 OKHttp 的执行效率最高。

所以，在你将 RestTemplate 配置成单例时，你可以指定它使用何种底层库：

~~~java
@Bean
public RestTemplate restTemplate() {
    RestTemplate restTemplate = new RestTemplate(); // 默认实现URLConnection
//  RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory()); // 等同默认实现
//  RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory()); // 使用 HttpClient
//  RestTemplate restTemplate = new RestTemplate(new OkHttp3ClientHttpRequestFactory()); // 使用 OkHttp
    return restTemplate;
}
~~~

在实际的应用中，只需要选择上面的代码中的其中一种 RestTemplate Bean 即可。当然，无论 RestTemplate 底层使用何种网络库，我们对于它的使用方式都是统一的。





# |-- Eureka 注册中心 组件

## 基础架构

> Eureka架构中的三个核心角色：

- 服务注册中心

  Eureka的服务端应用，提供服务注册和发现功能，就是刚刚我们建立的woniu-eureka。

- 服务提供者

  提供服务的应用，可以是SpringBoot应用，也可以是其它任意技术实现，只要对外提供的是Rest风格服务即可。本例中就是我们实现的woniu-service-provider。

- 服务消费者

  消费应用从注册中心获取服务列表，从而得知每个服务方的信息，知道去哪里调用服务方。本例中就是我们实现的woniu-service-consumer。

## EurekaServer 客户端 服务中心

### pom 依赖

```xml
<properties>
    <java.version>1.8</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
    <!--EurekaServer依赖的版本 可写入父类的pom-->
    <spring-cloud.version>Hoxton.SR9</spring-cloud.version>
</properties>

<dependencies>
    <!--web 单个服务中心需要配置web-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!--eureka的注册中心依赖 还需配置版本<properties>和<dependencyManagement>-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>

</dependencies>

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

### application.yml

```yml
spring:
  application:
    # 注意: 服务名 不能为'_'下划线 否则在表现层调用会出问题 中划线则没问题 
    name: EurekaServer

server:
  port: 10086 # 端口

eureka:
  client:
    service-url:
      # EurekaServer的地址，如果是集群，需要加上其它Server的地址。
      defaultZone: http://127.0.0.1:${server.port}/eureka
    # 不把自己注册到eureka服务列表
    register-with-eureka: true
    # 拉取eureka服务信息
    fetch-registry: true

  instance:
    # 设置 IP
    hostname: 127.0.0.1
    # 客户端在注册时使用自己的IP而不是主机名
    prefer-ip-address: true
    # 实例id
    instance-id: ${eureka.instance.hostname}:${server.port}
    
  server:
    # 关闭自我保护模式（默认为打开）
    enable-self-preservation: false
    # 扫描失效服务的间隔时间（缺省为60*1000ms）
    eviction-interval-timer-in-ms: 1000
```

### 启动类

如果启动类报错 如未报错则无视

> Failed to configure a DataSource: 'url' attribute is not specified and no embedde 
>
> **url找不到 则在启动类注解要指定:**
>
> @SpringBootApplication(exclude = DataSourceAutoConfiguration.class)

```java
package com.apai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;


@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@EnableEurekaServer // 声明当前springboot应用是一个eureka服务中心
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }

}
```

## EurekaServer 服务端 提供端口

> 将会让服务端的IP和端口自动注册到 注册中心 以供他人调用

### pom 依赖

```xml
<!--EurekaServer-自动注册-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```yml
server:
    port: 8080

spring:
    application:
    	# 注意: 服务名 不能为'_'下划线 否则在表现层调用会出问题 中划线则没问题 
        name: Moduleone

eureka:
    client:
        service-url:
            # 注册中心的地址 如果注册集群可可以写入多个注册中心的地址 , 隔开
            defaultZone: http://127.0.0.1:10086/eureka
    instance:
        # 心跳监测超过设定时间则注册中心会删除该服务方
        lease-expiration-duration-in-seconds: 10
        # 服务方心跳监测根据时间发送心跳
        lease-renewal-interval-in-seconds: 5
        # 设置 IP
        hostname: 127.0.0.1
        #客户端在注册时使用自己的IP而不是主机名
        prefer-ip-address: true
        #实例id
        instance-id: ${eureka.instance.hostname}:${server.port}
```

### 启动类

> 通过添加`@EnableDiscoveryClient`来开启Eureka客户端功能

```java
@SpringBootApplication
// 开启Eureka客户端功能
@EnableDiscoveryClient 
public class woniuServiceProviderApplication {

    public static void main(String[] args) {
        SpringApplication.run(woniuServiceApplication.class, args);
    }
}
```

## EurekaServer 调用方 使用端口

### pom 依赖

```xml
<!--EurekaServer-自动注册-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### application.yml

```yml
server:
    port: 8081

spring:
    application:
        name: Module_tow

eureka:
    client:
        service-url:
        	# 注册中心的地址 如果注册集群可可以写入多个注册中心的地址 , 隔开
            defaultZone: http://localhost:10086/eureka
        # 每隔5秒向注册中心拉取服务
        registry-fetch-interval-seconds: 5
    instance:
        # 设置 IP
        hostname: 127.0.0.1
        # 注册时使用自己的IP而不是主机名
        prefer-ip-address: true
        # 实例id
        instance-id: ${eureka.instance.hostname}:${server.port}  
```

### 启动类

> 通过添加`@EnableDiscoveryClient`来开启Eureka客户端功能

```java
@SpringBootApplication
// 开启Eureka客户端功能
@EnableDiscoveryClient 
public class woniuServiceProviderApplication {

    public static void main(String[] args) {
        SpringApplication.run(woniuServiceApplication.class, args);
    }
}
```

### 表现层-调用

使用 负载均衡 可直接调用 服务名 

注意: 服务名 不能为'_'下划线 否则在表现层调用会出问题 中划线则没问题 

```java
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

// eureka客户端，可以获取到eureka中服务的信息 注意导包
@Autowired
private DiscoveryClient discoveryClient; 

// 根据服务名称，获取服务实例。有可能是集群，所以是service实例集合
List<ServiceInstance> instances = discoveryClient.getInstances("Module_one");
// 因为只有一个Service-provider。所以获取第一个实例
ServiceInstance instance = instances.get(0);
// 获取ip和端口信息，拼接成服务地址
String url = "http://" + instance.getHost() + ":" + instance.getPort() + "/financing/findall?id={id}";

// 获取 服务端的IP 地址
instance.getHost()
// 获取 服务端的端口   
instance.getPort()
    
    
// 使用 负载均衡 可直接调用 服务名 
@GetMapping("/porttest")
public String porttest() {
   // String url = "http://服务名/financing/getPort";
   String url = "http://Moduleone/financing/getPort";
   String forObject = restTemplate.getForObject(url, String.class);
   return forObject;
}
```



# Eureka Server 高可用性

Eureka Server即服务的注册中心，在刚才的案例中，我们只有一个EurekaServer，事实上EurekaServer也可以是一个集群，形成高可用的Eureka中心。

> 服务同步

多个Eureka Server之间也会互相注册为服务，当服务提供者注册到Eureka Server集群中的某个节点时，该节点会把服务的信息同步给集群中的每个节点，从而实现**数据同步**。因此，无论客户端访问到Eureka Server集群中的任意一个节点，都可以获取到完整的服务列表信息。

## Eureka Server 集群配置

> 10086-注册中心 调用  10087-注册中心 的地址 
>
> 反之 10087-注册中心 调用  10086-注册中心 的地址
>
> 形成相互调用的关系  内容都将共享 即使其中一个宕机也不会影响运行

**注意点:** 

* 第一个注册中心在启动时会报错 找不到10087 是正常的 会每过一段时间再次连接

* 注册中心的配置 需开启自动注册 

* 服务端的配置在设置注册中心的地址需写入使用的注册中心的地址 以 , 逗号隔开

  ```yml
  eureka:
    client:
      service-url: # EurekaServer地址,多个地址以','隔开
        defaultZone: http://127.0.0.1:10086/eureka,http://127.0.0.1:10087/eureka
  ```

### 一.  application.yml

```yml
spring:
  application:
    name: EurekaServer

server:
  port: 10086 # 端口

eureka:
  client:
    service-url:
      # EurekaServer集群 调用 10087。
      defaultZone: http://127.0.0.1:10087/eureka
    # 不把自己注册到eureka服务列表
    register-with-eureka: true
    # 拉取eureka服务信息
    fetch-registry: true

  instance:
    # 设置 IP
    hostname: 127.0.0.1
    # 客户端在注册时使用自己的IP而不是主机名
    prefer-ip-address: true
    # 实例id
    instance-id: ${eureka.instance.hostname}:${server.port}
```

### 二.  application.yml

```yml
spring:
  application:
    name: EurekaServer

server:
  port: 10087 # 端口

eureka:
  client:
    service-url:
      # EurekaServer集群 调用 10087。
      defaultZone: http://127.0.0.1:10086/eureka
    # 不把自己注册到eureka服务列表
    register-with-eureka: true
    # 拉取eureka服务信息
    fetch-registry: true

  instance:
    # 设置 IP
    hostname: 127.0.0.1
    # 客户端在注册时使用自己的IP而不是主机名
    prefer-ip-address: true
    # 实例id
    instance-id: ${eureka.instance.hostname}:${server.port}
```



## 获取服务列表

当服务消费者启动时，会检测`eureka.client.fetch-registry=true`参数的值，如果为true，则会拉取Eureka Server服务的列表只读备份，然后缓存在本地。并且`每隔30秒`会重新获取并更新数据。我们可以通过下面的参数来修改：

```yaml
eureka:
  client:
    registry-fetch-interval-seconds: 5
```

生产环境中，我们不需要修改这个值。
但是为了开发环境下，能够快速得到服务的最新状态，我们可以将其设置小一点。



## 失效剔除和自我保护

> 服务下线

当服务进行正常关闭操作时，它会触发一个服务下线的REST请求给Eureka Server，告诉服务注册中心：“我要下线了”。服务中心接受到请求之后，将该服务置为下线状态。

> 失效剔除

有些时候，我们的服务提供方并不一定会正常下线，可能因为内存溢出、网络故障等原因导致服务无法正常工作。Eureka Server需要将这样的服务剔除出服务列表。因此它会开启一个定时任务，每隔60秒对所有失效的服务（超过90秒未响应）进行剔除。

可以通过`eureka.server.eviction-interval-timer-in-ms`参数对其进行修改，单位是毫秒，生产环境不要修改。

这个会对我们开发带来极大的不变，你对服务重启，隔了60秒Eureka才反应过来。开发阶段可以适当调整，比如：10秒

> 自我保护

我们关停一个服务，就会在Eureka面板看到一条警告：

这是触发了Eureka的自我保护机制。当一个服务未按时进行心跳续约时，Eureka会统计最近15分钟心跳失败的服务实例的比例是否超过了85%。在生产环境下，因为网络延迟等原因，心跳失败实例的比例很有可能超标，但是此时就把服务剔除列表并不妥当，因为服务可能没有宕机。Eureka就会把当前实例的注册信息保护起来，不予剔除。生产环境下这很有效，保证了大多数服务依然可用。

但是这给我们的开发带来了麻烦， 因此开发阶段我们都会关闭自我保护模式：（woniu-eureka）

```yaml
eureka:
  server:
    enable-self-preservation: false # 关闭自我保护模式（缺省为打开）
    eviction-interval-timer-in-ms: 1000 # 扫描失效服务的间隔时间（缺省为60*1000ms）
```



# Ribbon  负载均衡 组件

## 简介

**它是一个负载均衡组件**，在刚才的案例中，我们启动了一个woniu-service-provider，然后通过DiscoveryClient来获取服务实例信息，然后获取ip和端口来访问。

但是实际环境中，我们往往会开启很多个woniu-service-provider的集群。此时我们获取的服务列表中就会有多个，到底该访问哪一个呢？

一般这种情况下我们就需要编写负载均衡算法，在多个实例列表中进行选择。
不过Eureka中已经帮我们集成了负载均衡组件：Ribbon，简单修改代码即可使用。

什么是Ribbon：

![1525619257397](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525619257397.png) 

在你没有意识到 Ribbon 存在的时候，Ribbon 就已经可以在你的项目中（配合 RestTemplate）起作用了。为你的 RestTemplate 的 @Bean 加上 **@LoadBalanced** 注解：
@LoadBalanced 注解背后就是 Spring AOP 动态代理的思想。

## 开启负载均衡

* 调用方

因为Eureka中已经集成了Ribbon，所以我们无需引入新的依赖，直接修改代码。
woniu-service-consumer的引导类，在RestTemplate的配置方法上添加`@LoadBalanced`注解

```java
@Bean
@LoadBalanced    // 负载均衡 不添加这个注解，不能直接用服务名访问
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

**在表现层可以直接使用 服务名 调用**

* 注意: 服务名 不能 为 '  _ '  下划线 否则会出问题 中划线则没问题 

```java
@GetMapping("/porttest")
public String porttest() {
    // String url = "http://服务名/financing/getPort";
    String url = "http://Moduleone/financing/getPort";
    String forObject = restTemplate.getForObject(url, String.class);
    return forObject;
}
```

## 负载均衡策略

Ribbon默认的负载均衡策略是简单的轮询，我们可以测试一下：

编写测试类，在刚才的源码中我们看到拦截中是使用RibbonLoadBalanceClient来进行负载均衡的，其中有一个choose方法，找到choose方法的接口方法，是这样介绍的：

 ![1525622320277](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525622320277-1658206507070.png)

SpringBoot也帮我们提供了修改负载均衡规则的配置入口，在woniu-service-consumer的application.yml中添加如下配置：

**调用方添加 负载均衡 的配置**

```yaml
server:
  port: 80
spring:
  application:
    name: service-consumer
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
service-provider:  # 冒号左侧为: 服务名 注意大小写
  ribbon:
  	# 负载均衡策略: 随机策略 可进行设置
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

格式是：`{服务名称}.ribbon.NFLoadBalancerRuleClassName`，值就是IRule的实现类。

## 负载均衡 内置策略

Ribbon 内置了 8 种负载均衡策略（其实是 7 种），它们都直接或间接实现了 **IRule** 接口：

* RandomRule	随机策略	随机选择 Server

* RoundRobinRule	轮询策略（默认策略）	按顺序循环选择 Server

* RetryRule	重试策略	在一个配置时间段内当选择 Server 不成功，则一直尝试选择一个可用的 Server

* BestAvailableRule	这种策略下，Ribbon 会观测、统计目标服务的各个实例的运行状况、并发量。

  当再次发起对目标服务的访问时，Ribbon 会先过滤掉因为多次访问故障而被标记为 Error 的 实例。然后选择一个并发量（ActiveRequestCount）最小的实例发起访问。俗话说就是：先去掉不能干活的，然后在能干活的里面找一个最闲的。

* AvailabilityFilteringRule	可用过滤策略	过滤掉一直连接失败并被标记为 circuit tripped 的 Server，过滤掉那些高并发连接的 Server（active connections 超过配置的网值）

* WeightedResponseTimeRule 响应时间加权策略	根据 Server 的响应时间分配权重。响应时间越长，权重越低，被选择到的概率就越低；响应时间越短，权重越高，被选择到的概率就越高。这个策略很贴切，综合了各种因素，如：网络、磁盘、IO等，这些因素直接影响着响应时间

* ZoneAvoidanceRule	区域权衡策略	综合判断 Server 所在区域的性能和 Server 的可用性轮询选择 Server，并且判定一个 AWS Zone 的运行性能是否可用，剔除不可用的 Zone 中的所有 Server

## Ribbon 的超时和超时重试

理论上，Ribbon 是有超时设置，以及超时之后的重试功能的。但是，在 RestTemplate 和 Ribbon 结合的方案中，Ribbon 的超时设置和重试设置的配置方式一直在变动，因此有很多『配置无效』的现象，十分诡异。

考虑到我们在后续的项目中不会使用 RestTemplate 和 Ribbon 整合，而是使用 OpenFeign ，因此，这里就不展开解释了。

## Ribbon 的饥饿加载

默认情况下，服务消费方调用服务提供方接口的时候，第一次请求会慢一些，甚至会超时，而之后的调用就没有问题了。

这是因为 Ribbon 进行客户端负载均衡的 Client 并不是在服务启动的时候就初始化好的，而是在调用的时候才会去创建相应的 Client，所以第一次调用的耗时不仅仅包含发送HTTP请求的时间，还包含了创建 RibbonClient 的时间，这样一来如果创建时间速度较慢，同时设置的超时时间又比较短的话，很容易就会出现上面所描述的现象。

你可以通过启用 Ribbon 的饥饿加载（即，立即加载）模式，并指定在项目启动时就要加载的服务：

~~~yml
ribbon:
  eager-load:
    enabled: true   # 开启饥饿加载
    clients: woniu-service-provider(服务名), xxx        # 需要饥饿加载的服务
~~~



# Hystrix 组件

Hystix是Netflix开源的一个延迟和容错库，用于隔离访问远程服务、第三方库，防止出现级联失败。

服务器支持的线程和并发数有限，请求一直阻塞，会导致服务器资源耗尽，从而导致所有其它服务都不可用，形成雪崩效应。

Hystix解决雪崩问题的手段有两个：

- 线程隔离(线程池隔离、信号量隔离)
- 服务熔断



## Hystrix熔断 服务降级

### 引入依赖

首先在woniu-service-consumer的pom.xml中引入Hystrix依赖：

```xml
<!--Hystrix熔断 服务降级-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```

### 开启Hystrix熔断

* 调用方

> 在服务**调用方**入口启动类上面加上 @EnableHystrix或 @EnableCircuitBreaker 注解，表示激活熔断器的默认配置,@EnableHystrix注解是 @EnableCircuitBreaker 的语义化，它们的关系类似于 @Service和 @Component 。

```java
@SpringBootApplication 
@EnableDiscoveryClient // 开启 Eureka客户端
@EnableCircuitBreaker // 开启Hystrix熔断
//@SpringCloudApplication // 上面的组合注解
public class woniuServiceConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApp.class, args);
    }
    @LoadBalanced
    @Bean
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```

可以看到，我们类上的注解越来越多，在微服务中，经常会引入上面的三个注解，于是Spring就提供了一个组合注解：@SpringCloudApplication

其作用包含了 

* @SpringBootApplication 
* @EnableDiscoveryClient // 开启 Eureka客户端
* @EnableCircuitBreaker // 开启Hystrix熔断



## 编写降级逻辑

> 当目标服务的调用出现故障，我们希望快速失败，给用户一个友好提示。因此需要提前编写好失败时的降级处理逻辑，要使用HystixCommond来完成：

注意: 降级逻辑方法必须跟正常逻辑方法保证：**相同的参数列表和返回值声明**。

```java
@Controller
@RequestMapping("consumer/user")
public class UserController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping
    @ResponseBody
    // 指定服务查询异常时调用的方法
    @HystrixCommand(fallbackMethod = "queryUserByIdFallBack")
    public String queryUserById(@RequestParam("id") Long id) {
        String user = this.restTemplate.getForObject("http://service-provider/user/" + id, String.class);
        return user;
    }

    public String queryUserByIdFallBack(Long id){
        return "请求繁忙，请稍后再试！";
    }
}
```

## 默认 FallBack

> 如果有很多这样的业务方法访问不了服务器都需要降级时，那岂不是要写很多，所以我们可以把  @DefaultProperties(defaultFallback = "fallBackMethod") // 指定一个类的全局降级方法    Fallback配置加在类上，实现默认fallback：
>
> 在此类的所有的方法上 加上了注解  @HystrixCommand // 标记该方法需要降级 出现异常时 都会调用 @DefaultProperties 指定的方法

```java
@RestController
@RequestMapping("consumer/user")
@DefaultProperties(defaultFallback = "fallBackMethod") // 指定一个类的全局降级方法
public class UserController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping
    @HystrixCommand // 标记该方法需要降级
    public Object queryUserById(@RequestParam("id") Long id) {
        User user = this.restTemplate.getForObject("http://service-provider/user/" + id, User.class);
        return user;
    }

    /**
     * 降级方法
     * 返回值要和被降级的方法的返回值一致
     * 降级方法不需要参数
     * @return
     */
    public String fallBackMethod(){
        return "请求繁忙，请稍后再试！";
    }
}
```

说明：

- @DefaultProperties(defaultFallback = "defaultFallBack")：在类上指明统一的失败降级方法
- @HystrixCommand：在方法上直接使用该注解，使用默认的降级方法。
- defaultFallback：默认降级方法，不用任何参数，以匹配更多方法，但是返回值一定一致

## Hystrix 超时配置

Hystrix 的全局配置也称为默认配置，它们在配置文件中通过 **hystrix.command.default.\*** 来进行配置（再次强调，Hystrix 是用于服务的调用方，所以这里的配置自然也是配置在服务的调用方这边）

在之前的案例中，请求在超过1秒后都会返回错误信息，这是因为Hystix的默认超时时长为1秒，我们可以通过配置修改这个值：

我们可以通过`hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds`来设置Hystrix超时时间。该配置没有提示。

```yaml
hystrix:
  command:
    default:  #也可以把default 改成某个服务名，针对某个服务。
      execution:
        isolation:
          thread:   #其实是对每一次http请求，就开启一个线程，hystrix内部有一个线程池。
            timeoutInMilliseconds: 6000 # 设置hystrix的超时时间为6000ms 
          strategy: THREAD    ##默认是采用线程池隔离技术   可以省略
             注意：配合测试，要改造服务提供者，打开浏览器 F12 看看时间
```

无论我们的使用的是 RestTemplate 还是 OpenFeign，它们都会是使用到 Ribbon 的负载均衡（和超时重试）能力。而 Ribbon 也会监管请求超时问题。所以，理论上，Hystrix 的超时时长的判断标准应该大于 Ribbon 的超时重试的总耗时，否则，会出现 Ribbon 还在『努力』，但是 Hystrix 决定『放弃』的情况。当然，这样也不是不行，只是有些不科学。

要注意：也就是说，hystrix触发熔断与ribbon的重试在机制上没关系，ribbon该重试还是会重试，如果有重试，还会使得被调用系统做无用且重复的业务

除了合理的参数值设置之外，你还可以直接关闭掉 Hystrix 的超时判断，完全由 Ribbon 来评判、上报（给 Hystrix）超时与否

**改造服务提供者**

改造服务提供者的UserController接口，随机休眠一段时间

```java
@GetMapping("{id}")
public User queryUserById(@PathVariable("id") Long id) {
    try {
        Thread.sleep(8000); 
    }
    return this.userService.queryUserById(id);
}
```

当6s 不能正常请求服务提供者，其实先触发熔断，然后再降级

## 服务熔断机制

熔断器，也叫断路器，其英文单词为：Circuit Breaker 

**注意:  熔断开启只针对于 出现异常的方法 其他方法则不受影响 除非在配置文件中配置**

熔断状态机3个状态：

- Closed：关闭状态，所有请求都正常访问。
- Open：打开状态，所有请求都会被降级。Hystrix会对请求情况计数，当一定时间内失败请求百分比达到阈值，则触发熔断，断路器会完全打开。默认失败比例的阈值是50%，请求次数最少不低于20次。默认是 五秒之内请求20次 如果有10次失败（50%），则断开
- Half Open：半开状态，open状态不是永久的，打开后会进入休眠时间（默认是5S）。随后断路器会自动进入半开状态。此时会释放部分请求通过，若这些请求都是健康的，则会完全关闭断路器，否则继续保持打开，再次进行休眠计时

### 熔断策略配置

```properties
hystrix.command.default.circuitBreaker.requestVolumeThreshold=10
hystrix.command.default.circuitBreaker.sleepWindowInMilliseconds=10000
hystrix.command.default.circuitBreaker.errorThresholdPercentage=50
```

~~~yml
hystrix:
    command:
        default:
            execution:
                isolation:
                    thread:
                    	# Hystrix 超时配置
                        timeoutInMilliseconds: 6000
            circuitBreaker:
            	# 20 次请求
                requestVolumeThreshold: 20
                # 待机 10秒进入半开状态
                sleepWindowInMilliseconds: 10000
                # 20 次请求 有50%的请求 出现异常则降级
                errorThresholdPercentage: 50
                #forceOpen: true    #是否强制开启熔断（跳闸），默认false，如果为true，则所有请求都将被拒绝，直接执行fallback降级方法
~~~

解读：

- requestVolumeThreshold：触发熔断的最小请求次数，默认20，通过一个窗口10s内请求数大于20个就启动熔断器
- errorThresholdPercentage：触发熔断的失败请求最小占比，默认50%
- sleepWindowInMilliseconds：休眠时长，默认是5000毫秒
- forceOpen 是否强制跳闸



# Open Feign 远程调用组件

Feign是一个远程调用组件，集成了ribbon和hystrix。在前面的学习中，我们使用了Ribbon的负载均衡功能，大大简化了远程调用时的代码：

 ![1525652009416](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525652009416.png)

## Open Feign 创建

### 引入依赖

在创建一个 Spring Boot Maven 项目，在 Spring Initializer 中引入依赖：

- 在 Initializer 的搜索框内搜索 Eureka Client和 OpenFeign 。 或
- 在 Spring Cloud Discovery 下选择 Eureka Discovery Client ；在 Spring Cloud Routing 下选择 OpenFeign

```xml
<!--Open Feign 远程调用组件-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<!--EurekaServer-自动注册-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<!--Web-->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### application.yaml

~~~yml
server:
  port: 7000
spring:
  application:
    name: eureka-client-consumer-feign
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
~~~

### 启动类 注解

> @EnableFeignClients  内置了熔断器和负载均衡注解

```java
@SpringBootApplication
@EnableDiscoveryClient // 开启Eureka客户端功能
@EnableFeignClients // 开启feign客户端，无需配置熔断器和负载均衡注解
public class EurekaFeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaFeignApplication.class, args);
    }
}
```

我们可以看到启动类增加了一个新的注解: **@EnableFeignClients**，如果我们要使用 Feign（声明式 HTTP 客户端），必须要在启动类加入这个注解，以开启 Feign 。

### 创建Feign的客户端 接口

**防坑说明：**

* 方法的返回值、参数以及requestmapping路径要和服务方的一模一样，和调用方无关，消费方只要调用该方法得到结果
* 如果服务方controller类有@RequestMapping 定义命名空间，如user,在这里我们建议在方法上面拼接，不能在UserClient接口上去定义@requestMapping("/user/")  且注意路径必须完整
* @PathVariable("id") 这个括号里面的id不能省略  同理@Requestparam("id")里面的id也不能省略

```java
package com.apai.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("Moduletow") // 标注该类是一个feign接口 且链接到服务方
public interface FinancingClient {

    @GetMapping("/financing/testopenfeign/{id}")
    public String testopenfeign(@PathVariable("id") Integer id);

}
```

- 首先这是一个接口，Feign会通过动态代理，帮我们生成实现类。这点跟mybatis的mapper很像
- `@FeignClient`，声明这是一个Feign客户端，类似`@Mapper`注解。同时通过`value`属性指定服务名称
- 接口中的定义方法，完全采用SpringMVC的注解，Feign会根据注解帮我们生成URL，并访问获取结果

* 一个服务只能被一个类绑定，不能让多个类绑定同一个远程服务，否则，会在启动项目是出现『**已绑定**』异常

### 调用方 表现层

```java
package com.apai.controller;

import com.apai.Client.FinancingClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FinancingController {

    // 获取Client服务接口
    @Autowired
    private FinancingClient financingClient;

    @GetMapping("/three")
    public String testopenfeign(Integer id) {
        // 调用接口 并传参
        String testopenfeign = financingClient.testopenfeign(id);
        return testopenfeign;
    }

}
```

### 服务方

```java
@GetMapping("/testopenfeign/{id}")
public String testopenfeign(@PathVariable() Integer id) {
    return "成功进入tow服务,ID为: " + id;
}
```



# Open Feign 请求注解

**防坑指南:** 

* 调用方的表现层与Client接口的请求不冲突 使用表现层的请求可随意
* 调用方的Client接口里 因为不是浏览器发出请求 所以所有的请求都需要加上对应的注解 
* 服务方的请求建议加上跟调用方的Client接口里一样加上对应的注解
* 方法一旦写上了参数 则在请求时必须带上参数没有值也可以 如: id= | 否则报错

## token 问题

> 微服务 Open Feign 远程调用组件 在调用对方请求获取数据时 如果该微服务使用的security安全框架 则必须在 请求头带上token 否则无法访问  

**解决方法**

* FeignLogConfiguration 在 Open Feign 远程调用对方请求获取数据时

  自动获取 token 并放入请求头在调用对方的微服务请求  可放入security配置包内 

* 在  Open Feign  的请求接口带上 token  在调用接口时手动获取token在传入接口

  在调用对方的微服务请求时因为token放行而成功调用 | @RequestHeader("token") String token

* 请求头没有token则报错 空指针异常 null

**FeignLogConfiguration 类**

```java
package com.woniu.config.security;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Configuration
public class FeignLogConfiguration implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        //添加token
        requestTemplate.header("token", request.getHeader("token"));
    }
}

```

## Restful 风格请求

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

## Get 请求

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

## Post 请求

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



# Open Feign 内置 Hystrix 熔断

默认情况下是关闭的。我们需要通过下面的参数来开启：(在woniu-service-consumer工程添加配置内容)

## Open Feign 熔断

只需要开启hystrix的熔断功能即可，默认时间是1s中，如果要修改熔断的时间，要做如下的配置:

熔断的时间不会产生冲突 以最短的时间为主

```yml
feign:
    hystrix:
        # 开启 Feign 的熔断功能
        enabled: true
    client:
        config:
            # 注意: feign熔断 必须跟 hystrix熔断一起使用才有效
            default:
                #设置feign超时连接时长
                connectTimeout: 4000
                #设置feign请求的超时时长  4s之后 提供方没有响应 直接降级
                readTimeout: 4000
                
# Hystrix 熔断配置                
hystrix:
    command:
        default:
            execution:
                isolation:
                    thread:
                        timeoutInMilliseconds: 6000
                    strategy: THREAD
                timeout:
                    enabled: true
```

> 说明：connectTimeout是feign连接某个服务的超时时间，readTimeout是feign请求某个接口的超时时长，timeoutInMilliseconds是hystrix熔断的时间，Hystrix的超时时间是站在命令执行时间来看的，和Feign设置的超时时间在设置上并没有关联关系。Hystrix不仅仅可以封装Http调用，还可以封装任意的代码执行片段。Hystrix是从命令对象的角度去定义，某个命令执行的超时时间，超过此此时间，命令将会直接熔断，假设hystrix 的默认超时时间设置了3000,即3秒，而feign 设置的是4秒，那么Hystrix会在3秒到来时直接熔断返回，不会等到feign的4秒执行结束，如果hystrix的超时时间设置为6s，而feign 设置的是4秒，那么最终要以feign的时间4s为准，你可以理解为以时间短的为准，这两段都要配置，不能不配hystrix的配置，否则feign配置的readTimeout不生效
>
> openfeign集成了hystrix组件，不再需要引入hystrix组件，在启动类上不要去添加熔断注解

## Open Feign 熔断降级

定义类 实现 Open Feign远程调用Client接口 作为fallback的降级处理类

> 实现接口之后 必须重写接口的使用的方法 然后写入降级之后的内容
>
> 实现接口之后 会和Client接口 配置的bean产生冲突 

**解决冲突:** 

* Client接口的 @FeignClient(value = "服务名", qualifier = "bean名"，fallback = 降级处理类名.class)
* 调用方的表现层 在注入Client接口时指定bean名 @Qualifier("bean名")

**Client接口**

```java
package com.apai.Client;

// 标注该类是一个feign接口 且链接到服务方  重命名bean的名称  指定降级处理类
@FeignClient(value = "Moduletow", qualifier = "FinancingClient1", fallback = FinancingClientImpl.class) 
public interface FinancingClient {

    @GetMapping("/financing/testopenfeign/{id}")
    public String testopenfeign(@PathVariable("id") Integer id);

}

```

**降级处理类**

```java
package com.apai.Client;

@Component
public class FinancingClientImpl implements FinancingClient {
    @Override
    public String testopenfeign(Integer id) {
        return "降级提示";
    }
}
```

**表现层 调用**

```java
package com.apai.controller;

@RestController
public class FinancingController {

    // 获取Client服务接口
    @Autowired
    @Qualifier("FinancingClient1")
    private FinancingClient financingClient;

    @GetMapping("/three")
    public String testopenfeign(Integer id) {
        // 调用接口 并传参
        String testopenfeign = financingClient.testopenfeign(id);
        return testopenfeign;
    }

}
```



## 超时和超时重试

OpenFeign 本身也具备重试能力，在早期的 Spring Cloud 中，OpenFeign 使用的是 feign.Retryer.Default#Default() ，重试 5 次。但 OpenFeign 集成了Ribbon依赖和自动配置（默认也是轮询），Ribbon 也有重试的能力，此时，就可能会导致行为的混乱。（总重试次数 = OpenFeign 重试次数 x Ribbon 的重试次数，这是一个笛卡尔积。）

后来 Spring Cloud 意识到了此问题，因此做了改进（[issues 467](https://github.com/spring-cloud/spring-cloud-netflix/issues/467)），将 OpenFeign 的重试改为 feign.Retryer#NEVER_RETRY ，即默认关闭。 Ribbon的重试机制默认配置为0，也就是默认是去除重试机制的，如果两者都开启重试，先执行ribbon重试，抛出异常之后再执行feign的重试

所以，OpenFeign『对外』表现出的超时和重试的行为，实际上是 Ribbon 的超时和超时重试行为。我们在项目中进行的配置，**也都是配置 Ribbon 的超时和超时重试**

**在调用方配置如下**

~~~yaml
# 全局配置
ribbon:
  # 请求连接的超时时间
  connectTimeout: 1000
  # 请求处理的超时时间
  readTimeout: 1000   #1秒
  # 最大重试次数
  MaxAutoRetries: 5
  # 切换实例的重试次数
  MaxAutoRetriesNextServer: 1
  #NFLoadBalancerRuleClassName: RandomRule
  # 对所有请求开启重试，并非只有get 请求才充实。一般不会开启这个功能。该参数和上面的3三个参数没有关系
  #okToRetryOnAllOperations: true
feign:
  hystrix:
    enabled: true     #默认是1s降级
  #client:         
    #config:
     # default:
       # connectTimeout: 4000  #要关掉feign超时连接时长
        #readTimeout: 150000
hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 150000   #这个时间要大于ribbon重试次数的总时长，否则还没重试完就降级了
~~~

被调用方设置线程睡眠

~~~java
@RequestMapping("/hello")
public String hello() throws InterruptedException {
    Thread.sleep(3000);
    System.out.println(str+"端口");
    return str+"端口";
}
~~~

> 测试结果：由于openfeign重试默认是关闭的，我们不用管它。被调用方，如果只启动一个被调方实例，则一共12次，因为 MaxAutoRetriesNextServer: 1 切换下一个实例再重试，下一个实例还是自己，如果被调方启动两个实例，则各6次。另外重试和熔断都开启，超时时间是1s，一共是12次，也就是12s，12s之后就会降级，而hystrix配置的timeoutInMilliseconds的15s降级，在这里是以时间短的为主。如果不对timeoutInMilliseconds进行配置，那么hystrix默认是1s，也就是1s钟之后就会降级，但是不影响ribbon的重试。



**你也可以指定对某个特定服务的超时和超时重试：**

则其他的请求走上面的重试，SERVICE-PRODUCER该服务的重试单独配置

~~~yaml
# 针对 spring-service-b 的设置，注意服务名的大小写
spring-service-b:
  ribbon:
    connectTimeout: 1000
    readTimeout: 3000   
    MaxAutoRetries: 2
    MaxAutoRetriesNextServer: 2
~~~

在被调方，修改如下代码测试

```java
@RequestMapping("/hello")
public String hello() throws InterruptedException {
    Thread.sleep(4000);
    System.out.println(str+"端口");
    return str+"端口";
}
```

## 如何替换底层用HTTP实现

本质上是 OpenFeign 所使用的 RestTemplate 替换底层 HTTP 实现

* 替换成 HTTPClient

将 OpenFeign 的底层 HTTP 客户端替换成 HTTPClient 需要 2 步:

1、引入依赖：

~~~xml
<dependency>
  <groupId>io.github.openfeign</groupId>
  <artifactId>feign-httpclient</artifactId>
 </dependency>
~~~

2、在配置文件中启用它：

~~~yaml
feign:
  httpclient:
    enabled: true # 激活 httpclient 的使用
~~~

* 替换成 OkHttp

将 OpenFeign 的底层 HTTP 客户端替换成 OkHttp 需要 2 步:

1、引入依赖

~~~yaml
<dependency>
  <groupId>io.github.openfeign</groupId>
  <artifactId>feign-okhttp</artifactId>
</dependency>
~~~

2、配置

~~~yaml
feign:
  httpclient:
    enabled: false  # 关闭 httpclient 的使用
  okhttp:
    enabled: true   # 激活 okhttp 的使用
~~~



## 日志级别(了解)

```java
前面讲过，通过`logging.level.xx=debug`来设置日志级别。然而这个对Fegin客户端而言不会产生效果。因为`@FeignClient`注解修改的客户端在被代理时，都会创建一个新的Fegin.Logger实例。我们需要额外指定这个日志的级别才可以。然后根据 **logging.level.<FeignClient>** 参数配置格式来开启 Feign 客户端的 DEBUG 日志，其中 **<FeignClient>** 部分为 Feign 客户端定义接口的完整路径。默认值是**NONE**，而NONE不会记录Feign**调用过程**的任何日志的，**也就是说这个日志不是启动feign客户端的日志，而是feign调用远程接口时产生的日志**。
```

1）设置com.woniu包下的日志级别都为debug

~~~yaml
logging:
  level:
    com:
      woniu:
        client:
          UserFeignClient: debug   #UserFeignClient为某个feign接口
~~~

2）编写配置类，定义日志级别

内容：

```java
@Configuration
public class FeignLogConfiguration {
    @Bean
    Logger.Level feignLoggerLevel(){
        return Logger.Level.FULL;
    }
}
```

这里指定的Level级别是FULL，Feign支持4种级别：

![1528863525224](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1528863525224.png)

- NONE：不记录任何日志信息，这是默认值。
- BASIC：仅记录请求的方法，URL以及响应状态码和执行时间
- HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
- FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。

3）在FeignClient中指定配置类：

```java
@FeignClient(value = "service-privider", fallback = UserFeignClientFallback.class, configuration = FeignConfig.class)
public interface UserFeignClient {
    @GetMapping("/user/{id}")
    User queryUserById(@PathVariable("id") Long id);
}
```

4）重启项目，进行测试：在通过openfeign去调用某个接口时，会有详细的信息。如果把日志级别设置为NONE，则没有。

测试：http://localhost:9527/port1   





# Zuul 网关组件

**它是一个路由网关组件**，通过前面的学习，使用Spring Cloud实现微服务的架构基本成型，大致是这样的：

![1525674644660](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525674644660.png) 

	我们使用Spring Cloud Netflix中的Eureka实现了服务注册中心以及服务注册与发现；而服务间通过Ribbon或Feign实现服务的消费以及均衡负载。为了使得服务集群更为健壮，使用Hystrix的熔断机制来避免在微服务架构中个别服务出现异常时引起的故障蔓延。
	
	在该架构中，我们的服务集群包含：内部服务Service A和Service B，他们都会注册与订阅服务至Eureka Server，而Open Service是一个对外的服务，通过均衡负载公开至服务调用方。我们把焦点聚集在对外服务这块，直接暴露我们的服务地址，这样的实现是否合理，或者是否有更好的实现方式呢？



先来说说这样架构需要做的一些事儿以及存在的不足：

- 破坏了服务无状态特点。

  为了保证对外服务的安全性，我们需要实现对服务访问的权限控制，而开放服务的权限控制机制将会贯穿并污染整个开放服务的业务逻辑，这会带来的最直接问题是，破坏了服务集群中REST API无状态的特点。具体开发和测试的角度来说，在工作中除了要考虑实际的业务逻辑之外，还需要额外考虑对接口访问的控制处理。

- 无法直接复用既有接口。

  当我们需要对一个即有的集群内访问接口，实现外部服务访问时，我们不得不通过在原有接口上增加校验逻辑，或增加一个代理调用来实现权限控制，无法直接复用原有的接口。



为了解决上面这些问题，我们需要将权限控制这样的东西从我们的服务单元中抽离出去，而最适合这些逻辑的地方就是处于对外访问最前端的地方，我们需要一个更强大一些的均衡负载器的 服务网关。

服务网关是微服务架构中一个不可或缺的部分。通过服务网关统一向外系统提供REST API的过程中，除了具备`服务路由`、`均衡负载`功能之外，它还具备了`权限控制`等功能。Spring Cloud Netflix中的Zuul就担任了这样的一个角色，为微服务架构提供了前门保护的作用，同时将权限控制这些较重的非业务逻辑内容迁移到服务路由层面，使得服务集群主体能够具备更高的可复用性和可测试性。

## Zuul 网关组件 简介

官网：https://github.com/Netflix/zuul

事实上，在微服务架构中，Zuul就是路由 进行转发

![1525675168152](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525675168152.png) 



## Zuul 架构

> 不管是来自于客户端（PC或移动端）的请求，还是服务内部调用。一切对服务的请求都会经过Zuul这个网关，然后再由网关来实现 鉴权、动态路由等等操作。Zuul就是我们服务的统一入口。

### **pom  文件导入**

Zuul 网关组件 依赖 为 Zuul [Maintenance] 不要导错alibb

```xml
<!--Web-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!--Zuul 网关组件 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
<!--EurekaServer-自动注册-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### **编写 配置**

> 方式一: 不进行注册  直接使用 url  不够灵活

```yaml
server:
  port: 10010 #服务端口
spring:
  application:
    name: api-gateway #指定服务名
zuul:
  routes:
    service-provider: # 这里是路由id，随意写
      path: /service-provider/** # 这里是映射路径
      url: http://127.0.0.1:8081 # 映射路径对应的实际url地址
```

> 方式二: 注册 使用服务名 且内置有负载均衡 默认轮询

```yml
server:
  port: 10010

spring:
  application:
    name: Zuul

eureka:
  client:
    service-url:
      # 注册中心的地址 如果注册集群可可以写入多个注册中心的地址 , 隔开
      defaultZone: http://localhost:10086/eureka
    # 每隔5秒向注册中心拉取服务
    registry-fetch-interval-seconds: 5
  instance:
    # 设置 IP
    hostname: 127.0.0.1
    # 注册时使用自己的IP而不是主机名
    prefer-ip-address: true
    # 实例id
    instance-id: ${eureka.instance.hostname}:${server.port}

zuul:
  routes:
    # 冒号左边是路由id可配置多个，路由名，随意写，不能写中文
    Modulethree:
      # 这里是映射路径 在转发时会将 three 裁切掉
      path: /three/**
      serviceId: Modulethree # 指定服务名称

    # 冒号左边是路由id可配置多个，路由名，随意写，不能写中文
    Moduletow:
      # 这里是映射路径 在转发时会将 tow 裁切掉
      path: /tow/**
      serviceId: Moduletow # 指定服务名称
```

> 方式三: 简化 注册 使用服务名 且内置有负载均衡 默认轮询

```yml
zuul:
  routes:
  	# 指定服务名称 : 映射路径 在转发时会将 tow 裁切掉
    service-provider: /service-provider/** 
```

> 方式四: 默认配置  且内置有负载均衡 默认轮询

```yml
# 即 不配置  zuul:  使用默认的范围名进行转发
http://localhost:10010/服务名/请求
```

### 启动类

```java
package com.apai;

// 开启网关功能
@EnableZuulProxy
// 开启Eureka客户端功能
@EnableDiscoveryClient
// 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class ZuulApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZuulApplication.class, args);
    }

}
```

测试: http://localhost:10010/three/list

## 其他配置

### 1、路由前缀

配置示例：

```yaml
zuul:
  routes:
    service-provider: /service-provider/**
    service-consumer: /service-consumer/**
  prefix: /api # 添加路由前缀
```

我们通过`zuul.prefix=/api`来指定了路由的前缀，这样在发起请求时，路径就要以/api开头。

### 2、不去除映射路径前缀

> strip-prefix 默认值为true，表示除去前缀，strip-prefix  = false 表示不除去前缀
>
> 注意: 方式三 简化的配置不能进行 映射路径前缀 设置

~~~yaml
zuul:
  routes:
    service-provider:
      path: /user-service/**
      url:  http://localhost:8081
      strip-prefix: true
      
注意:
zuul:
  routes:
    USER-SERVICE: /user-service/**
    USER-CONSUMER: /user-consumer/** 
  strip-prefix: false  #采用这个方式配置路由strip-prefix不会生效
~~~

### 3、关闭默认配置访问

如果不想使用默认的路由规则，就可以在配置文件中加入下列内容，即可关闭所有默认的路由规则：

~~~yaml
zuul:
  ignored-services: '*'  #所有的请求 都不使用默认的路由规则，所谓默认的规则：就是什么都不配，地址栏直接写服务名
~~~

> 忽略掉所有直接在地址栏写服务名的请求 

关闭默认的路由配置之后，需要在配置文件中逐个为需要路由的服务添加映射规则。

~~~yaml
zuul:
  routes:
    USER-SERVICE: /user-service/**
    USER-CONSUMER: /**   #
  ignored-services: provider-service    #不能在地址栏上直接输入provider-service服务名，必须给该服务配置映射规则
~~~

| 通配符 | 说明                              | 举例    |
| ------ | --------------------------------- | ------- |
| ?      | 匹配任意单个字符                  | /xxx/?  |
| *      | 匹配任意数量的字符                | /xxx/*  |
| **     | 匹配任意数量的字符， 包括多级目录 | /xxx/** |

为了让用户更灵活地使用路由配置规则，zuul 还提供了一个忽略表达式参数 `zuul.ignored-patterns`，该参数用来设置不被网关进行路由的 Url 表达式

~~~yaml
zuul:
  ignored-patterns: /**/xxx/**
  routes:
    eureka-client-employee: /employee/**
    eureka-client-department: /department/**
~~~



## ZuulFilter  过滤器

> Zuul作为网关的其中一个重要功能，就是实现请求的鉴权。而这个动作我们往往是通过Zuul提供的过滤器来实现的。

### ZuulFilter

ZuulFilter是过滤器的顶级父类。在这里我们看一下其中定义的4个最重要的方法：

```java
public abstract ZuulFilter implements IZuulFilter{

    abstract public String filterType();  

    abstract public int filterOrder();
    
    boolean shouldFilter();// 来自IZuulFilter

    Object run() throws ZuulException;// IZuulFilter
}
```

- `shouldFilter`：返回一个`Boolean`值，判断该过滤器是否需要执行。返回true执行，返回false不执行。

- `run`：过滤器的具体业务逻辑。

- `filterType`：返回字符串，代表过滤器的类型。包含以下4种：

  pre：请求在被路由之前执行

  route：在路由请求时调用

  post：在route和errror过滤器之后调用

  error：处理请求时发生错误调用

- `filterOrder`：通过返回的int值来定义过滤器的执行顺序，数字越小优先级越高。

### 过滤器执行生命周期

这张是Zuul官网提供的请求生命周期图，清晰的表现了一个请求在各个过滤器的执行顺序。

![1529152248172](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1529152248172.png)

正常流程：

- 请求到达首先会经过pre类型过滤器，而后到达route类型，进行路由，请求就到达真正的服务提供者，执行请求，返回结果后，会到达post过滤器。而后返回响应。

异常流程：4种情况

- 整个过程中，如果pre或者route过滤器出现异常，都会直接进入error过滤器，在error处理完毕后，会将请求交给POST过滤器，最后返回给用户。（2种）
- 如果是error过滤器自己出现异常，最终也会进入POST过滤器，将最终结果返回给请求客户端。
- 如果是POST过滤器出现异常，会跳转到error过滤器，但是与pre和route不同的是，请求不会再到达POST过滤器了，而是直接响应用户

所有内置过滤器列表：

 ![](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/1525682427811.png)

## 定义过滤器类

> 该类 @Component 注入配置 继承 ZuulFilter 重写其方法 
>
> pre：请求在被路由之前执行
>
> route：在路由请求时调用
>
> post：在route和errror过滤器之后调用
>
> error：处理请求时发生错误调用

注意点:

* context.setSendZuulResponse(false);  不对其进行路由, 也不会对其他过滤器产生影响,能够正常通过所有过滤器
* error 过滤器的触发方式 只能是其他过滤器产生异常才会进入 微服务产生的异常不会进入error过滤器

```java
@Component
public class LoginFilter extends ZuulFilter {
    /**
     * 过滤器类型，前置过滤器
     * @return
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器的执行顺序
     * @return
     */
    @Override
    public int filterOrder() {
        // int值来定义过滤器的执行顺序，数字越小优先级越高 仅同类过滤器。
        return 10;
    }

    /**
     * 该过滤器是否生效
     * @return
     */
    @Override
    public boolean shouldFilter() {
        // 返回true  表示执行下面方法的run。 
        // 返回false表示不执行本类的 run 方法，不影响其他过滤器 然后执行后面的过滤器
        return true;  
    }

    // run 方法 执行
    @Override
    public Object run() throws ZuulException {
        return null;
    }
}
```



## 常用 过滤器 模板

### pre 过滤器 检验 token

```java
package com.apai.zuulfilter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import io.micrometer.core.instrument.util.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class ExpFilterpre extends ZuulFilter {
    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws ZuulException {
        // 获取zuul提供的上下文对象
        RequestContext context = RequestContext.getCurrentContext();
        // 从上下文对象中获取请求对象
        HttpServletRequest request = context.getRequest();
        // 获取token信息
        // String token = request.getParameter("token");
        String token = request.getHeader("token");

        HttpServletResponse response = context.getResponse();
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type","text/html;charset=UTF-8");

        // 判断
        if (StringUtils.isEmpty(token)) {
            // 过滤该请求，不对其进行路由
            context.setSendZuulResponse(false);
            // 设置响应状态码，401
            context.setResponseStatusCode(HttpStatus.SC_UNAUTHORIZED);
            // 设置响应信息
            // response.getWriter().write("{\"status\":\"401\", \"text\":\"token无效!\"}");
            context.setResponseBody("{\"status\":\"401\", \"text\":\"request error!\"}");
        }
        // 校验通过，把登陆信息放入上下文信息，继续向后执行
        context.set("token", token);
        return null;
    }
}

```

### post 过滤器 获取异常

> 程序出现异常 如:404 500等在 post 过滤器可获取到

```java
package com.apai.zuulfilter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Component
public class ExpFilterprepost extends ZuulFilter {
    @Override
    public String filterType() {
        return "post";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws ZuulException {
        // 获取zuul提供的上下文对象
        RequestContext context = RequestContext.getCurrentContext();
        // 从上下文对象中获取请求对象
        HttpServletRequest request = context.getRequest();


        HttpServletResponse response = context.getResponse();
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type","text/html;charset=UTF-8");

        int responseStatusCode = context.getResponseStatusCode();
        if (responseStatusCode == 404) {
            context.setResponseBody("{\"status\":\"404\", \"text\":\"网址不正确!\"}");
        }else if (responseStatusCode == 405) {
            context.setResponseBody("{\"status\":\"405\", \"text\":\"请求类型不一致!\"}");
        }else if (responseStatusCode == 500) {
            context.setResponseBody("{\"status\":\"500\", \"text\":\"程序出现错误!\"}");
        }else if (responseStatusCode == 504) {
            context.setResponseBody("{\"status\":\"504\", \"text\":\"网关超时!\"}");
        }else if (responseStatusCode == 400) {
            context.setResponseBody("{\"status\":\"400\", \"text\":\"请求参数类型错误!\"}");
        }
        return null;
    }
}

```



## Zuul 与 Hystrix 结合实现熔断

Zuul 和 Hystrix 结合使用实现熔断功能时，需要完成 FallbackProvider 接口。该接口提供了 2 个方法：

- **.getRoute** 方法：用于指定为哪个服务提供 fallback 功能。
- **.fallbackResponse** 方法：用于执行回退操作的具体逻辑。

例如，我们为 service-id 为 `eureka-client-department` 的微服务（在 zuul 网关处）提供熔断 fallback 功能。

- 实现 FallbackProvider 接口，并托管给 Spring IoC 容器

1、Zuul中默认就已经集成了Ribbon负载均衡和Hystix熔断机制。但是所有的超时策略都是走的默认值，比如熔断超时时间只有1S，很容易就触发了。因此建议我们手动进行配置：

```yaml
ribbon:
  ReadTimeout: 12000 
  ConnectTimeout: 10000 
  
  
woniu-service-provider:  #在网关上配置 请求某个服务名的负载均衡测试  服务名小写
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

>  1.网关转发给A服务，A服务通过openfeign请求B服务，并且在A服务配置了openfeign的重试功能，假如A服务第一次请求B服务以及重试总时长是12s((1+5)*2))，那么网关的 ribbon.ReadTimeout应该等于12s,12s之后立刻降级.
>
>  2.网关降级之后，如果定义了post过滤器，则走post过滤器，此时post过滤器收到的状态值就是200，为网关降级正常处理的状态值，然后post把处理结果响应给浏览器，如果post过滤器没有对status为200的进行处理，那这个响应结果还是网关降级结果，这并不意味着post过滤器不执行
>
>  3.如果ReadTimeout超时时间小于微服务请求的总时长，如ReadTimeout=3000，那么3s网关就降级了，然后执行post过滤器，此时post过滤器收到的响应状态值依然是200.只不过不要这样配置，否则网关都给客户响应了，而微服务通过feign还在不断的重试
>
>  4.如果ReadTimeout超时时间大于微服务请求的总时长，如ReadTimeout=20000，也就是20s后才降级，那么在12s后，A服务不再重试B服务了，请求失败，直接抛出状态码为500的异常，而此时zuul还没有降级，所以post过滤器收到的响应状态值是500，post过滤器可以对500的状态码进行处理，然后响应
>
>  5.如果A服务通过feign调用了B服务失败，A服务自己实现了feign的降级功能，那么站在zuul的角度来看，A服务是正常响应，此时zuul不会执行降级，最终只执行post类型过滤器，过滤器收到A服务的响应状态码就是200，你可以注掉feign的降级实现类。

### Zuul 与 Hystrix 降级

防坑指南:  

* 降级类加上注解: @Component
* 启动类加上: @EnableCircuitBreaker | 开启Hystrix熔断
* 在 Zuul  熔断时 触发降级

```java
package com.apai.fallback;

import org.springframework.cloud.netflix.zuul.filters.route.FallbackProvider;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;


@Component
public class ZuulFallBack implements FallbackProvider {

    /**
     * 要降级的 服务名
     * return "*"  所有服务的降级
     * return “服务名”
     */
    @Override
    public String getRoute() {
        return "*";
    }

    @Override
    public ClientHttpResponse fallbackResponse(String route, Throwable cause) {
        return new ClientHttpResponse() {
            /**
             *  要给客户端响应的状态吗
             */
            @Override
            public HttpStatus getStatusCode() throws IOException {
                return HttpStatus.OK;
            }

            /**
             * 状态值
             */
            @Override
            public int getRawStatusCode() throws IOException {
                return this.getStatusCode().value();
            }

            @Override
            public String getStatusText() throws IOException {
                return this.getStatusCode().getReasonPhrase();
            }

            /**
             * 降级时需关闭 ...
             */
            @Override
            public void close() {

            }

            /**
             * 响应的内容
             * @return
             * @throws IOException
             */
            @Override
            public InputStream getBody() throws IOException {
                String str = "{status：403,msg:服务器正忙，请稍后再试}";
                return new ByteArrayInputStream(str.getBytes(StandardCharsets.UTF_8));
            }

            /**
             * 响应头     MediaType
             * @return
             */
            @Override
            public HttpHeaders getHeaders() {
                HttpHeaders header = new HttpHeaders();
                MediaType type = new MediaType("application","json", StandardCharsets.UTF_8);
                header.setContentType(type);
                return header;
            }
        };
    }
}
```

## Zuul 中的 Eager Load 配置

zuul 的路由转发也是由通过 Ribbon 实现负载均衡的。默认情况下，客户端相关的 Bean 会延迟加载，在第一次调用微服务时，才会初始化这些对象。所以 zuul 无法在第一时间加载到 Ribbon 的负载均衡。

如果想提前加载 Ribbon 客户端，就可以在配置文件中开启饥饿加载（即，立即加载）：

~~~yaml
zuul:
  ribbon:
    eager-load:
      enabled: true
~~~

注意 **eager-load** 配置对于默认路由不起作用。因此，通常它都是结合 `zuul.ignored-services=*` （即忽略所有的默认路由） 一起使用的，以达到 zuul 启动时就默认已经初始化各个路由所要转发的负载均衡对象。

## 禁用 zuul 过滤器

Spring Cloud 默认为 zuul 编写并启动了一些过滤器，这些过滤器都放在 `org.springframework.cloud.netflix.zuul.filters` 包下。

如果需要禁用某个过滤器，只需要设置 `zuul.<SimpleClassName>.<filterType>.disabled=true`，就能禁用名为 `<SimpleClassName>` 的过滤器。例如:

~~~yaml
zuul:
  JwtFilter:
    pre:
      disable: true
~~~

上述配置就禁用掉了我们自定义的 JwtFilter 。



# ||-> Eureka 微服务 总汇

## 依赖

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

## Eureka 注解

```java
// -- 启动类 --
// 启动类 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
// 声明当前springboot应用是一个eureka服务中心
@EnableEurekaServer
// 开启Eureka客户端功能
@EnableDiscoveryClient 
// 开启Hystrix熔断
@EnableCircuitBreaker || @EnableHystrix
// 开启Zuul网关功能
@EnableZuulProxy
// 组合注解
@SpringCloudApplication
* @SpringBootApplication // 启动类注解
* @EnableDiscoveryClient // 开启 Eureka客户端
* @EnableCircuitBreaker // 开启Hystrix熔断
// 开启 Open Feign 客户端 远程调用组件，无需配置熔断器和负载均衡注解
@EnableFeignClients

// -- 启动类里的 RestTemplate 方法上 --
// 负载均衡 不添加这个注解，不能直接用服务名访问
@LoadBalanced
    
// -- 表现层 降级 -- 
// 指定服务查询异常时调用的方法 写在方法上
@HystrixCommand(fallbackMethod = "方法名")
// 指定一个类的全局降级方法 类上 配合@HystrixCommand让方法异常触发降级
@DefaultProperties(defaultFallback = "方法名")
    
// -- Open Feign 远程调用组件 接口类 --
// 标注该类是一个feign接口 且链接到服务方
@FeignClient(value = "服务名")
```



# SpringConfig-Nacos 微服务

## Nacos 的下载和安装

首先去 nacos 的 github 地址下载 release 安装包。[下载地址](https://github.com/alibaba/nacos/releases)

进入到 nacos/bin 目录下面，**startup** 命令用于启动 nacos ，**shutdown** 命令用于停掉 nacos 。

>  windows 系统 在bin文件夹下cmd

* 执行 startup.cmd -m standalone 启动，单模式启动

> linux/unix 系统

* 执行 startup.sh -m standalone 启动。

> linux/unix 系统docker-compose 镜像容器

* 编写docker-compose.yml文件   启动该文件 命令： docker-compose up

![image-20220721190744220](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220721190744220.png)

```yml
nacos:
  image: nacos/nacos-server:latest
  container_name: nacos-standalone-8848
  environment:
    - PREFER_HOST_MODE=hostname
    - MODE=standalone   #单机模式启动
  volumes:
    - ./8848/logs/:/home/nacos/logs   #前面是宿主机名  后面是容器目录名
    - ./8848/init.d/custom.properties:/home/nacos/init.d/custom.properties
  ports:
  - "8848:8848"
```

nacos 的默认服务端口是 **8848** ，启动完成之后通过浏览器访问 nacos：http://127.0.0.1:8848/nacos 。

看到如下界面，需要登陆，默认的用户名密码都是 **nacos** ，登陆之后看到如下界面：

![image-20210610204222725](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210610204222725.png) 

nacos 的单机 standalone 模式是开发环境中使用的启动方式，它对用户而言非常友好，几乎不需要的更多的操作就可以搭建 nacos 单节点。另外，standalone 模式安装默认是使用了 nacos 本身的嵌入式数据库 apache derby(Derby是一个Open source的产品，是一个小型的数据库) 。

# |-- Nacos 注册中心

> Nacos  启动即为注册中心 无需创建项目 制作注册中心 只需将微服务注册即可
>
> nacos 的默认服务端口是 **8848** ，启动完成之后通过浏览器访问 nacos：http://127.0.0.1:8848/nacos 。
>
> 默认的账号 密码: nacos

## Nacos 注册 步骤

### Nacos  依赖

注意引入依赖时 选择 Nacos Service Discovery 且 还要对应的版本 可引入父项目

```xml
<dependencies>
    <!--Nacos 自动注册依赖-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
</dependencies>
```

### Nacos  注解

```java
// ---- 启动类 ----
// 启用 nacos 的服务发现
@EnableDiscoveryClient 
```

## Nacos  配置中心

Nacos 作为配置管理中心，实现的核心功能就是配置的统一管理。

### Nacos 配置中心 注解

> 添加 <!--Nacos 配置中心 配置文件存放注册中心--> 注解

```xml
<!--Nacos 配置文件存放注册中心-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

### 新建配置文件 bootstrap.yml  

新增 **spring.cloud.nacos.config** 节点配置，将服务指向正确的 nacos 服务端。

> 注意: 
>
> Spring Cloud Config 一样，连接配置中心的配置信息『**必须**』写在 **bootstrap.yml** 配置文件中，而不是 application 配置文件中。**bootstrap** 优先级高于apllication
>
> 配置文件中只保留 nacos 相关的配置即可，其他的配置放到 nacos 中统一管理。

**防坑指南**

* 端口 还是写在 项目的配置文件里 因为在 Nacos 里改变端口会动态更改 但是不会时项目重新启动
* 端口和数据库在进行动态修改时 项目是不会重启的 所有要使配置生效还是要重启项目
* 指定在不同环境下的配置 如: dev  在Nacos的配置文件的 ID 一定要规范
* 共同开发 在注册nacos的时候可能导致注册的ip地址被其他的代理而不是项目的ip 所以需指定ip前缀

```yaml
spring:
  application:
    name: 服务名
  profiles:
  	# 指定 Nacos 在不同环境下的配置
    active: dev
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        # 配置分组。未配置时，默认分组是 DEFAULT_GROUP
        group: XXX_GROUP  
      config:
        server-addr: ${spring.cloud.nacos.discovery.server-addr}
        # nacos 配置文件后缀。注意是 yaml，不是 yml
        file-extension: yaml
        
        
# 共同开发 在注册nacos的时候可能导致注册的ip地址被其他的代理而不是项目的ip 所以需指定ip前缀
    cloud:
        nacos:
            discovery:
                server-addr: 192.172.0.18:8848
            config:
                server-addr: ${spring.cloud.nacos.discovery.server-addr}
        # 指定注册到nacos的前缀
        inetutils:
            preferred-networks: 192.168.10
```

### 在 Nacos 添加配置

> 通过配置列表右侧的 `+` 按钮添加配置文件：

**防坑指南**

* Data ID: 服务名-环境名.yaml
* 服务名名.yaml -->  默认的 application.yml   
* 服务名-dev.yaml  -->  application-dev.yml  |  开发环境
* 服务名-test.yaml  -->  application-test.yml    |  测试环境
* 服务名-proc.yaml  -->  application-proc.yml  |  生产环境

![image-20220721183911016](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220721183911016.png)

`Data ID` 是该配置文件在 Nacos 系统内的唯一标识。

在 Nacos Spring Cloud 中，dataId 的完整格式语法如下：

```markup
${prefix}-${spring.profile.active}.${file-extension}
```

- **prefix** 的值默认与 `spring.application.name`  （即服务名）的值相同。也可以通过配置项 **spring.cloud.nacos.config.prefix** 来手动配置，指定一个与 spring.application.name 不一样的值，不过一般不会动它。

- **spring.profile.active** 即为当前环境对应的 profile ，如：`xxx-service-dev.yml` 中的 `dev` 就是指开发环境。

  **注意：**当 spring.profile.active 为空时，对应的环境定义字符部分将不存在，即为 **xxx-service.yml**，而不是 *xxx-service-.yml* 。

- **file-exetension** 为配置内容的数据格式，可以通过配置项 **spring.cloud.nacos.config.file-extension** 来配置。

  注意，我们使用的『**是 yaml 类型，不是 yml**』。虽然二者是一个意思，但是『**nacos 只认 yaml**』。

`Group` 的值同 spring.cloud.nacos.config.group 的配置，界面填写的内容与项目中的配置二者『**一定要统一**』，否则无法正确读取配置，Group 起到配置『隔离』的作用。

**数据库 基本配置**

```yml
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



## 微服务 group 分组

Nacos 的微服务分组概念，有两层含义：

- 不同分组的微服务，彼此之间不能发现对方，也就不能进行远程服务调用。逻辑上，不同的分组意味着这是两个不同的独立项目。即，你（微服务）从配置中拉取到的注册表只有可能是你所在组的注册表。
- 将微服务分组，方便我们查看，以及方便配置管理分类。

可以通过如下属性对微服务所属分组进行配置：

~~~yaml
spring:
  cloud:
    nacos:
      discovery: 
        group: 组名
~~~

由于多个项目可能、可以使用同一个 nacos 作为注册中心，这种情况下，`group` 就是区分你我的标识，每个微服务从 nacos 上拉取的只有本组的注册表。 如果微服务没有指定组，默认分组是 default_group

## 验证和动态刷新

> 在 表现层 有调用配置文件的数据时 加上 -  @RefreshScope  -  可进行既时刷新

执行以下代码进行验证：

```java
@Value("${xxx.yyy.zzz}")
private String zzz;

@RequestMapping("/demo")
public String demo() {
    return username;
} 
```

如果想要实现动态刷新功能，那么在 @Value 所在的 @Component（@Controller、@Service、@Repository）上加上 **@RefreshScope** 即可实现动态刷新。



## Nacos 的数据存储

### windos 数据库储存修改

Nacos 的数据是存储在它自带的内嵌 derby 数据库中的，数据文件就在 Nacos 的解压目录下的 `data` 文件夹中。

你也可以通过修改配置，让 Nacos 将它的数据存储在你指定的 mysql 数据库中。

* Nacos 在它的 `conf` 目录下已经为你准备好了建表脚本：`nacos-mysql.sql` 。不过脚本中没有建库语句，为了后续配置简单起见，建议创建的库命名为 nacos 。

- 创建一个nacos数据库，然后在nacos的bin目录下找到nacos-mysql.sql文件，把该文件的建表语句拷贝mysql客户端下执行，注意要使用你刚才创建的nacos数据库下


~~~mysql
create database nacos 
  DEFAULT CHARACTER SET utf8mb4 -- 乱码问题
  DEFAULT COLLATE utf8mb4_bin -- 英文大小写不敏感问题
;
~~~

- 在 conf 文件夹下的 `application.properties` 配置文件。从 31 行开始的一段配置就是数据库连接相关配置。把如下行数前面的注释去掉


~~~mysql
spring.datasource.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=root
~~~

修改完 `application.properties` 配置文件之后，重启 Nacos，Nacos 重新编程了一个『干净』的环境。

**测试：**

登陆localhost：8848/nacos，在配置中心上新建一个配置，如：spring-service-provider-dev.yaml，发现这个配置保存到了我们自己创建的nacos数据库里面

![image-20220721194326682](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220721194326682.png)



### Liunx 系统 修改

> 镜像容器:  docker-compose.yml 

```yml
version: '3'

services:
  mysql5.7:
    image: mysql:5.7
    container_name: mysql57
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: nacos
      MYSQL_USER: root
      MYSQL_PASSWORD: root
    ports:
      - 3306:3306
    volumes: 
      - ./docker/mysql/:/var/lib/mysql/
      - ./docker/conf/:/etc/mysql/
  nacos:
    image: nacos/nacos-server:1.4.1
    container_name: nacos
    restart: always
    depends_on:
      - mysql5.7
    volumes:
      - ./docker/nacos/standalone-logs/:/home/nacos/logs
      - ./docker/nacos/plugins/:/home/nacos/plugins
      - ./docker/nacos/conf/application.properties:/home/nacos/conf/application.properties
    environment:
      PREFER_HOST_MODE: hostname #如果支持主机名可以使用hostname,否则使用ip，默认也是ip
      SPRING_DATASOURCE_PLATFORM: mysql #数据源平台 仅支持mysql或不保存empty
      MODE: standalone
      MYSQL_SERVICE_HOST: mysql5.7
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: root
      MYSQL_SERVICE_PASSWORD: root
      NACOS_APPLICATION_PORT: 9999
      JVM_XMS: 512m
      JVM_MMS: 320m
    ports:
      - "9999:9999"
```

## nacos 集群配置

官网：https://nacos.io/zh-cn/ ，点击手册找到运维，拷贝cluster.conf.example文件，并改名为cluster.conf

~~~
127.0.0.1:8848
127.0.0.1:8849
127.0.0.1:8850
~~~

直接双击启动启动脚本

微服务配置：

~~~yaml
spring:
  application:
    name: spring-service-gateway
  cloud:
    nacos:
      discovery:
        namespace: public
        password: nacos
        username: nacos
        server-addr: localhost:8848,localhost:8849,localhost:8850
~~~

# Gateway 服务网关

> Spring Cloud Gateway 介绍

Spring Cloud Gateway 基于 Spring Boot 2，是 Spring Cloud 的全新项目。Gateway 旨在提供一种简单而有效的途径来转发请求，并为它们提供横切关注点。

Spring Cloud Gateway 中最重要的几个概念：

- 路由 Route：路由是网关最基础的部分，路由信息由一个 ID 、一个目的 URL 、一组断言工厂和一组 Filter 组成。如果路由断言为真，则说明请求的 URL 和配置的路由匹配。
- 断言 Predicate：Java 8 中的断言函数。Spring Cloud Gateway 中的断言函数输入类型是 Spring 5.0 框架中的 ServerWebExchange 。Spring Cloud Gateway 中的断言函数允许开发者去定义匹配来自 Http Request 中的任何信息，比如请求头和参数等。
- 过滤器 Filter：一个标准的 Spring Web Filter。Spring Cloud Gateway 中的 Filter 分为两种类型：Gateway Filter 和 Global Filter。过滤器 Filter 将会对请求和响应进行修改处理。

## Gateway 网关创建

注意:  未配置 开启自动支持到 Nacos 注册中心 则默认自动注册到 8848 端口的注册中心

### 导入依赖

> **注意**：在创建项目是不要选错依赖 单纯选择 Gateway  | 而不是 那个含有 alibb的依赖
>
> Gateway 自己使用了 netty 实现了 Web 服务，此处『**不需要引入 Spring Web**』，如果引入了，反而还会报冲突错误，无法启动。

```xml
<dependencies>
    <!--Gateway 服务网关-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!--Nacos 自动注册依赖-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
</dependencies>
```

### 路由配置

**方式一: 启动类 配置路由转发 进行bean注入 (不建议)**

```java
// 启动类 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
// 启用 nacos 的服务发现
@EnableDiscoveryClient
public class GatewayServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServerApplication.class, args);
    }

    /**
     * 配置
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        /**return builder.routes()
            .route(r -> r
                .path("/jd")
                .uri("http://www.jd.com/")
                .id("jd_route")
            ).build();*/
         return builder.routes().route(new Function<PredicateSpec, Route.AsyncBuilder>() {
            @Override
            public Route.AsyncBuilder apply(PredicateSpec predicateSpec) {
                return predicateSpec.path("/jd")
                        .uri("http://www.jd.com/")
                        .id("jd_route");
            }
        }).build();
    }
}
```

**方式二: 使用 yml 进行路由转发配置**

**防坑指南:** 

* routes 和 predicates 为复数可以进行多组配置 在配置前方带上 中划线即可 '  -  '

* routes :  路由转发

* predicates :  断言即条件判断 可进行多组条件判断 为  全部为真则执行路由转发

```yml
server:
    port: 10010

spring:
    application:
        name: Gateway
    cloud:
        nacos:
            discovery:
                server-addr: 127.0.0.1:8848
        gateway:
            routes:
                # 路由 ID，唯一 可中文
                - id: Nacos-A-微服务
                  # uri: http://www.163.com 转发路径写死
                  # 使用微服务名 可进行负载均衡调用微服务集群
                  uri: lb://Nacos-A
                  # 断言规则 如: 请求路径前缀
                  predicates:
                      # 请求路径前缀 不会截掉前缀
                      - Path=/wuzi/**

```



### Gateway 路由转发详解

> Spring Cloud Gateway 是由很多的路由断言工厂组成。

当 HTTP Request 请求进入 Spring Cloud Gateway 的时候，网关中的路由断言工厂就会根据配置的路由规则，对 HTTP Request 请求进行断言匹配。

**匹配成功则进行下一步处理，否则，断言失败直接返回错误信息。**

早期的 Gateway 断言的配置是通过代码中的 @Bean 进行配置，后来才推出配置文件配置。



## Gateway  路由断言

路由断言的执行顺序是根据 写入的顺序依次往下执行

### Path 路由断言

> **Path 断言不会改变请求的 URI ，整个过程中只有 IP、端口部分会被『替换』掉** 
>
> 请求的触发路径不会被截取掉 这与Zuul网关正好相反

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 微服务名称
          uri: http://www.163.com 
          # 输入 /163 路径时，Gateway 将会导向到 163 网址
          predicates:
             - Path=/163
        - id: 微服务名称
          uri: lb://微服务名称
          predicates:
            - Path=/xxx/**     
```

### After 路由断言

After 路由断言会要求你提供一个 UTC 格式的时间，当 Gateway 接收到的请求时间在配置的 UTC 时间之后，则会成功匹配，予以转发，否则不成功。

```java
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    ZonedDateTime dateTime = LocalDateTime.now().minusHours(1).atZone(ZoneId.systemDefault());
    return builder.routes()
        .route(r -> r.after(dateTime)
            .uri("http://www.jd.com:80/")
            .id("jd_route"))
        .build();
}
```

等价的 **application.yml** 配置：

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          predicates:
            - Path=/users/**
        - id: 品牌微服务
          uri: http://www.jd.com
          predicates:       #品牌微服务有2个断言
            - Path=/xxx/**
            - After=2022-07-21T15:33:11.009+08:00[Asia/Shanghai]
```

说明：当请求/xxx地址时，如果当前系统时间再20227-21之后，则会成功，否则失败



UTC是根据原子钟来计算时间，而GMT是根据地球的自转和公转来计算时间。UTC是现在用的时间标准，GMT是老的时间计量标准。UTC更加精确，由于现在世界上最精确的原子钟50亿年才会误差1秒，可以说非常精确。

对于 UTC 的时间格式，你可以使用如下 Java 代码生成：

```java
String datetime = ZonedDateTime.now().minusHours(1).format(DateTimeFormatter.ISO_DATE_TIME);
//当前系统时间 减去一个小时
System.out.println(datetime);
```

### Before 路由断言

Before 路由断言和之前的 After 路由断言类似。它会取一个 UTC 时间格式的时间参数，当请求进来的当前时间在配置的时间之前会成功（放行），否则不能成功。

~~~yaml
spring:
  cloud:
    gateway:
      routes:
        - id: 品牌微服务
          uri: http://www.jd.com
          predicates:       #品牌微服务有2个断言
            - Path=/xxx/**
            - Before=2022-07-21T15:33:11.009+08:00[Asia/Shanghai]
~~~

### Between 路由断言

连个时间之间 则断言成功

~~~yml
spring:
  cloud:
    gateway:
      routes:
        - id: 品牌微服务
          uri: http://www.jd.com
          predicates:
            - Path=/xxx/**
            - Between=2020-07-21T15:33:11.009+08:00[Asia/Shanghai],2022-07-21T15:33:11.009+08:00[Asia/Shanghai]
~~~

### Cookie 路由断言

Cooke 路由断言会取两个参数：HTTP 请求所携带的 Cookie 的 key 和 value。当请求中携带的 **cookie** 和 Cookie 路由断言中配置的 **cookie** 一致时，路由才匹配成功。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 品牌微服务
          uri: http://www.jd.com
          predicates:
            - Cookie=username, tom
            - Path=/xxx/**
```

> 该功能可以使用 Postman 进行测试。在 postman 中为请求添加携带的 Cookie 有两种方式。
>
> 1. 直接在 **Headers** 中添加 Cookie和 username=tom
> 2. 在 `Cookies` 功能中使用 `Add Cookie` 添加

### Header 路由断言

Header 路由断言用于根据 HTTP 请求的 header 中是否携带所配置的信息与否，来决定是否通过断言。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          predicates:
            - Header=token, tom
			- Path=/xxx/** 
```

### Method 路由断言

Method 路由断言会根据路由信息所配置的 method 对请求方式是 GET 或者 POST 等进行断言匹配。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          predicates:
            - Method=GET    #必须是get请求
            - Path=/users/** 
```

### Query 路由断言

Query 断言会从请求中获取两个参数，将请求参数和 Query 断言中的配置进行匹配。

例如，*http://localhost:9000/test?username=tom* 中的 *username=tom* 和 *r.query(“username”, “tom”)* 匹配。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          predicates:
            - Query=username, tom  #必须携带请求参数username，而且值必须是tom,不能是其它的值
            - Path=/users/**  
```

### 组合使用

各种 Predicates 同时存在于同一个路由时，请求必须『**同时满足所有**』的条件才被这个路由匹配。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          order: 0
          predicates:
            - Path=/user/**
            - Method=GET
            - Header=X-Request-Id, \d+
            - Query=name, zhangsan.    #请求参数必须是name=zhangsan.  ”点“ 表示匹配任务一个字符
```

**order代表的优先级是从小往大排序的，即数值越小，优先级越高**

## 自定义路由断言

自定义路由断言，就是允许你自定义路由的评判规则。自定义路由断言有几个前提要求：

1. 自定义的路由断言要继承 **AbstractRoutePredicateFactory** 类。
2. 自定义的路由断言按惯例叫作：**XxxRoutePredicateFactory** ，这样，在未来使用时可直接使用 **Xxx** 作为其名字引用。当然，你可以通过 **name()** 方法自定义名字，后续使用时，就使用 name() 返回的字符串。
3. 每个 RoutePredicateFactory 都会有一个 **Config** 类与之对应，由于它们常见是 1:1 的关系，所以，通常会将 Config 类定义成 RoutePredicateFactory 内部类的形式。

### **自定义路由断言类**

```java
package com.apai.predicates;

import lombok.Data;
import org.springframework.cloud.gateway.handler.predicate.AbstractRoutePredicateFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;
import java.util.function.Predicate;

// 自定义断言 创建Config内部类 然后必须继承AbstractRoutePredicateFactory<类名.Config>
@Component
public class apaiRoutePredicateFactory extends AbstractRoutePredicateFactory<apaiRoutePredicateFactory.Config> {

    public apaiRoutePredicateFactory() {
        super(Config.class);
    }
    
    // 如果类名不规范 则要在该方法定义配置调用名 否则可省略
    @Override
    public String name() {
        return "配置调用名";
    }

    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        // 返回 创建的实例
        return new Predicate<ServerWebExchange>() {
            // 内部类 写入内容
            @Override
            public boolean test(ServerWebExchange serverWebExchange) {
                String path = serverWebExchange.getRequest().getURI().getPath();
                // 获取请求的参数内容
                MultiValueMap<String, String> queryParams = serverWebExchange.getRequest().getQueryParams();
                // 根据 参数名称获取参数内容 因为参数值可能是多个 使用用list接收
                List<String> queryNames = queryParams.get("name");
                List<String> queryPass = queryParams.get("pass");
                // 调用 Config类的属性
                String name = config.getName();
                String pass = config.getPassword();
                // 进行判断输出 布尔值 在配置中调用 真-转发 假-不转发
                if(name.equals(queryNames.get(0)) && pass.equals(queryPass.get(0))){
                    return true;
                }
                return false;
            }

        };
    }

    // 简单情况下，Config 类里可以什么都没有
    @Data
    public static class Config {
        // 额可以进行设置 属性值共 GatewayFilter 调用  在配置文件里进行赋值
        private String name;
        private String password;
    }
}

```

### **自定义断言 配置**

```yml
server:
  port: 8084

spring:
  application:
    name: Gateway
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      routes:
        # 路由 ID，唯一 可中文
        - id: Nacos-A-微服务
          # uri: http://www.163.com 转发路径写死
          # 使用微服务名 可进行负载均衡调用微服务集群
          uri: lb://Nacos-A
          # 断言规则 如: 请求路径前缀
          predicates:
            # 请求路径前缀 不会截掉前缀
            - Path=/wuzi/**
            # 调用自定义断言 - name: 自定义的断言名
            - name: apai
              # 根据自定义的断言类的Config类的属性赋值
              args:
                name: www
                password: www
```

## 内置 Filter 过滤器

Spring Cloud Gateway 中内置了很多的过滤器，你也可以根据自己的实际需求定制并添加自己的路由过滤器。

路由过滤器允许以某种方式修改请求进来的 HTTP 请求或返回的 HTTP 响应。

### AddRequestHeader 过滤器

> AddRequestHeader 过滤器用于对匹配上的请求加上指定的 header 。

在另一个端口（例如 8081）运行一个服务提供者项目，其中代码负责从请求的请求头中获取数据，类似如下：

```java
@RequestMapping("/user/test")
public String header(@RequestHeader(name="jwtToken", required = false) String token,String name,String pass) {
  System.out.println(token);
  return username == null ? "null" : username;
}
```

.yml 配置文件配置

```yml
spring:
  application:
    name: eureka-gateway
  cloud:
    gateway:
      routes:
        - id: route1
          uri: http://localhost:8081/    ##uri: lb://eureka-consumer
          predicates:
            - Path=/user/**  
          filters:
            - AddRequestHeader=jwtToken, aaaaaaaaaaaa
```

当我们在浏览器输入http://localhost:9000/user/test?username=zhangsan&password=111时，首先网关能匹配到请求url，然后转发给8081，其实是把IP和端口替换掉，则请求url为http://localhost:8081/user/test?username=zhangsan&password=111，在请求8081之前，过滤器帮我们在请求头添加 jwtToken=aaaaaaaaaaaa，

### StripPrefix 过滤 | 去掉前缀

> 去除请求路径前缀

**StripPrefixGatewayFilterFactory** 是一个针对请求 url 进行处理的 filter 工厂，用于去除前缀。使用数字表示要截断的路径的数量。

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: authentication_route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/user/**
          filters:
            - StripPrefix=1
```

8081服务请求方法如下

```java
@RequestMapping("/test")
public String xxx(){
    return "ok";
}
```

请求url：http://localhost:9000/user/test

则网关转发到8081时，去掉一个前缀，真实url为:http://localhost:8081/test

### RewritePath 过滤器

RewritePath 过滤器可以重写 URI，去掉 URI 中的前缀。例如，下面就是去掉所有 URI 中的 **/xxx/yyy/zzz** 部分，只留之后的内容，再进行转发。

以上 Java 代码配置等同于 .yml 配置：

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: 163_route
          uri: http://localhost:8081
          predicates:
            - Path=/xxx/yyy/zzz/**
          filters:
            - RewritePath=/xxx/yyy/zzz/(?<segment>.*), /$\{segment}
```

对于请求路径 /xxx/yyy/zzz/hello ，当前的配置在请求到到达前会被重写为 /hello ，

- 命名分组：`(?<name>正则表达式)`

  与普通分组一样的功能，并且将匹配的子字符串捕获到一个组名称或编号名称中。在获得匹配结果时，可通过分组名进行获取。

  `(?<segment>.*)`：匹配 0 个或多个任意字符，并将匹配的结果捕获到名称为 segment 的组中。

- 引用捕获文本：`${name}`

  将名称为 name 的命名分组所匹配到的文本内容替换到此处。

  `$\{segment}`：将前面捕获到 segment 中的文本置换到此处，注意，\ 的出现是由于避免 YAML 认为这是一个变量而使用的转义字符。

  如：http://localhost:9000/xxx/yyy/zzz/test   则segment匹配到的内容为test   

  最终转发到 http://localhost:8080/test

## 自定义路由局部 Filter

> 和自定义路由断言一样，自定义路由有几个前提要求：

1. 自定义的路由过滤器要继承 **AbstractGatewayFilterFactory** 。
2. 自定义的路由过滤器按惯例叫做：**XxxGatewayFilterFactory** ，这样，在未来使用时可以使用 **Xxx** 作为其名字引用。当然，你可以通过 **name()** 方法自定义名字，

> 注意：如果没有自定义名字，则自定义过滤器的名字必须叫  名字+GatewayFilterFactory

   3.每个 GatewayFilterFactory 都会有一个 **Config** 类与之对应，由于它们常见是 1:1 的关系，所以，通常会将 Config 类定义成 GatewayFilterFactory 内部类的形式。   

```java
@Component
public class XxxGatewayFilterFactory
        extends AbstractGatewayFilterFactory<XxxGatewayFilterFactory.Config> {
    public XxxGatewayFilterFactory() {
        super(Config.class);
    }
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // 逻辑代码 ...
            if (...) {
                // 流程继续向下，走到下一个过滤器，直至路由目标。
                return chain.filter(exchange);
            } else {
                // 否则流程终止，拒绝路由。
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            };
        }
    }
    public static class Config {
        // 简单情况下，Config 类里可以什么都没有
    }
}
```


上面的过滤器的逻辑结构所实现的功能：当条件成立时，允许路由；否则，直接返回

> 路由器的所有代码逻辑都是在『**路由前**』执行，也就是转发的微服务即使没有启动也会执行。当然，这种形式的过滤器的更简单的情况是：执行某些代码，然后始终是放行。
> 要注意：当自定义多个局部过滤器时，依靠配置文件 -name 来保证执行顺序，如：
>
> filters:
> -name: Xxx   先执行   不是按照Order的值来决定,@Order只对全局过滤器起作用
> -name: Yyy   后执行  
>
> 另外如果既有局部过滤器，又有全局过滤器，那么先执行所有的局部过滤器，根据局部过滤器根据配置文件配置的先后顺序（默认也是有一个顺序的，从1开始递增），再执行所有的全局过滤器，全局过滤器的顺序看@Order 的值，值最小先执行

案例：对用户信息进行认证

```java
@Component
public class XxxGatewayFilterFactory extends AbstractGatewayFilterFactory<XxxGatewayFilterFactory.Config> {
    public XxxGatewayFilterFactory() {
        super(Config.class);
    }
    @Override
    public String name() {
        return "yyy";
    }
    @Override
	public GatewayFilter apply(Config config) {
    	return new GatewayFilter() {
        @Override
        public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

            List<String> token = exchange.getRequest().getHeaders().get("token");
            if (token.get(0).equals("aaa")) {
                return chain.filter(exchange);
            } else {
                // 否则流程终止，拒绝路由。
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }
    };
}
```

配置文件，注意过滤器重写了名字为 yyy

```yaml
spring:
  application:
    name: eureka-gateway
  cloud:
    gateway:
      routes:
        - id: 商品微服务
          uri: lb://provider-service
          predicates:
            - Path=/test
          filters:
            - name: yyy
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
```

测试：

![image-20210610161618099](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20210610161618099.png)

还可以获取其它的信息

~~~java
ServerHttpRequest request = exchange.getRequest();

log.info("{}", request.getMethod());
log.info("{}", request.getURI());
log.info("{}", request.getPath());
log.info("{}", request.getQueryParams());   // Get 请求参数

request.getHeaders().keySet().forEach(key -> {
    log.info("{}: {}", key, request.getHeaders().get(key))
});
~~~

### 自定义 Filter 异常处理

> 捕获程序出现的异常 并自定义提示信息 返回浏览器

#### 配置 指定 自定义异常类

```yml
server:
  port: 8084

spring:
  application:
    name: Gateway
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      routes:
        # 路由 ID，唯一 可中文
        - id: Nacos-A-微服务
          # uri: http://www.163.com 转发路径写死
          # 使用微服务名 可进行负载均衡调用微服务集群
          uri: lb://Nacos-A
          # 断言规则 如: 请求路径前缀
          predicates:
            # 请求路径前缀 不会截掉前缀
            - Path=/wuzi/**
          #局部过滤器的执行顺序，按配置文件配置的顺序来加载
          filters:
            # 过滤器使每次请求带上token
            - AddRequestHeader=token,bbbbbb
            - name: guolv
```

#### 自定义过滤器

> 自定义的路由过滤器按惯例叫做：**XxxGatewayFilterFactory** ，可以直接使用 **Xxx** 作为其名字引用。
>
> 当然，你可以通过重写 **name()** 方法自定义名字，

```java
package com.apai.filters;

import com.apai.config.ErrorStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

// 自定义 异常处理 过滤器
@Component
public class guolvGatewayFilterFactory extends
        AbstractGatewayFilterFactory<guolvGatewayFilterFactory.Config> {

    public guolvGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return new GatewayFilter() {
            @Override
            public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
                // 获取 请求头的token
                List<String> token = exchange.getRequest().getHeaders().get("token");
                // 不为空则 放行
                if (token != null) {
                    // 过滤器放行
                    // then方法就是在微服务返回之后执行的
                    return chain.filter(exchange).then(Mono.fromRunnable(new Runnable() {
                        @SneakyThrows
                        @Override
                        public void run() {
                            // 获取 请求的状态
                            HttpStatus statusCode = exchange.getResponse().getStatusCode();
                            // 创建异常信息封装对象
                            ErrorStatus error = new ErrorStatus();
                            // 根据 请求的状态对应的执行异常类
                            if (statusCode.value() == 500) {
                                // 将异常信息封装
                                error.setStatus(500);
                                error.setMsg("服务器内部报错");
                                // 将异常的封装类对象 转换 字符串
                                String errorMsg = new ObjectMapper().writeValueAsString(error);
                                // 将异常信息字符串向上抛出异常
                                throw new RuntimeException(errorMsg);
                            } else if (statusCode.value() == 404) {
                                // 将异常信息封装
                                error.setStatus(404);
                                error.setMsg("url地址不合法");
                                // 将异常的封装类对象 转换 字符串
                                String errorMsg = new ObjectMapper().writeValueAsString(error);
                                // 将异常信息字符串向上抛出异常
                                throw new RuntimeException(errorMsg);
                            } else if (statusCode.value() == 400) {
                                // 将异常信息封装
                                error.setStatus(400);
                                error.setMsg("请求参数错误");
                                // 将异常的封装类对象 转换 字符串
                                String errorMsg = new ObjectMapper().writeValueAsString(error);
                                // 将异常信息字符串向上抛出异常
                                throw new RuntimeException(errorMsg);
                            }
                        }
                    }));
                }
                // 为空则返回提示信息
                String jsonStr = "{\"status\":\"300\", \"msg\":\"你没有携带token\"}";
                byte[] bytes = jsonStr.getBytes(StandardCharsets.UTF_8);
                DataBuffer dataBuffer = exchange.getResponse().bufferFactory().wrap(bytes);
                return exchange.getResponse().writeWith(Flux.just(dataBuffer));
            }
        };
    }

    public static class Config {

    }
}
```

#### 异常信息封装类

```java
package com.apai.config;

import lombok.Data;

@Data
public class ErrorStatus {
    private int status;
    private String msg;
}
```

#### 异常处理类

> 定义统一异常处理的相关类，继承ErrorWebExceptionHandler
>
> 对于这种微服务的状态捕获的情况，也就是网关应该获取每个微服务错误状态码，所以严格的来说，写在全局过滤器更好

```java
package com.apai.config;

import com.apai.utils.ResponseResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.function.Supplier;

@Slf4j
@Order(6)
@Component
public class GlobalExceptionConfiguration implements ErrorWebExceptionHandler {
    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

        ServerHttpResponse response = exchange.getResponse();
        //response是服务端对客户端请求的一个响应，其中封装了响应头、状态码、内容（也就是最终要在浏览器上显示的HTML
        // 代码或者其他数据格式）等，服务端在把response提交到客户端之前，会使用一个缓冲区，并向该缓冲区内写入响应头和
        // 状态码，然后将所有内容flush（flush包含两个步骤：先将缓冲区内容发送至客户端，然后将缓冲区清空）。这就标志着该
        // 次响应已经committed(提交)。对于当前页面中已经committed(提交)的response，就不能再使用这个response向缓冲区
        // 写任何东西  （注：以为JSP中，response是一个JSP页面的内置对象，所以同一个页面中的response.XXX()是同一个response的不同方法，只要其中一个已经导致了committed， 那么其它类似方式的调用都会导致 IllegalStateException异常）
        if (response.isCommitted()) {
            return Mono.error(ex);
        }
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        System.out.println(ex);
        return response.writeWith(Mono.fromSupplier(new Supplier<DataBuffer>() {
            @Override
            public DataBuffer get() {
                DataBufferFactory bufferFactory = response.bufferFactory();
                try {
                    ErrorStatus errorStatus = objectMapper.readValue(ex.getMessage(), new TypeReference<ErrorStatus>() {
                    });
                    ResponseResult<String> responseResult = new ResponseResult<>(null, errorStatus.getMsg(), errorStatus.getStatus());
                    //接口統一相應  responseresult
                    return bufferFactory.wrap(objectMapper.writeValueAsBytes(responseResult));
                } catch (JsonProcessingException e) {
                    log.warn("Error writing response", ex);
                    return bufferFactory.wrap(new byte[0]);
                }
            }
        }));

    }
}
```

### JSON 形式的错误返回

上述的『**拒绝**』是以 HTTP 的错误形式返回，即 4xx、5xx 的错误。

有时，我们的返回方案是以 200 形式的『成功』返回，然后再在返回的信息中以自定义的错误码和错误信息的形式告知请求发起者请求失败。

此时，就需要 过滤器『**成功**』返回 JSON 格式的字符串：

```java
String jsonStr = "{\"status\":\"-1\", \"msg\":\"error\"}";
byte[] bytes = jsonStr.getBytes(StandardCharsets.UTF_8);
DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
return exchange.getResponse().writeWith(Flux.just(buffer));
```

### 获取 Body 中的请求参数

由于 Gateway 是基于 Spring 5 的 WebFlux 实现的（采用的是 Reactor 编程模式），因此，从请求体中获取参数信息是一件挺麻烦的事情。

有一些简单的方案可以从 Request 的请求体中获取请求参数，不过都有些隐患和缺陷。

最稳妥的方案是模仿 Gateway 中内置的 ModifyRequestBodyGatewayFilterFactory，不过，这个代码写起来很啰嗦。

具体内容可参考这篇文章：[Spring Cloud Gateway（读取、修改 Request Body）](https://www.haoyizebo.com/posts/876ed1e8/)

不过考虑到 Gateway 只是做请求的『**转发**』，而不会承担业务责任，因此，是否真的需要在 Gateway 中从请求的 Body 中获取请求数据，这个问题可以斟酌。

### 过滤器的另一种逻辑形式

有时你对过滤器的运用并非是为了决定是否继续路由，为了在整个流程中『**嵌入**』额外的代码、逻辑：在路由之前和之后执行某些代码
如果仅仅是在路由至目标微服务之前执行某些代码逻辑，那么 Filter 的形式比较简单：

~~~java
return (exchange, chain) -> {
    // 逻辑代码 ...
    // 流程继续向下，走到下一个过滤器，直至路由目标。
    return chain.filter(exchange);
}
~~~

如果，你想在路由之前和之后（即，目标微服务返回之后）都『**嵌入**』代码，那么其形式就是：

~~~
@Override
public GatewayFilter apply(Config config) {
    return ((exchange, chain) -> {
        log.info("目标微服务【执行前】执行");
        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                log.info("目标微服务【执行后】执行");
            }));
    });
}
~~~

### 自定义过滤器的参数

和自定义路由断言一样，自定义的过滤器断言可以自定义参数。
定义的形式是写成 Config 类的属性；使用的形式是在配置中使用 **args** 配置。

```yml
filters:
  - name: yyy
    args:
      name: hello
      password: world
```



## 自定义全局 Filter

自定义全局过滤器比局部过滤器要简单，因为它『**不需要指定对哪个路由生效，它对所有路由都生效**』。

> **@Order** 注解是为了去控制全局过滤器的先后顺序，不是局部的顺序，值越小，优先级越高。

```java
@Component
@Order(0)
public class CustomGlobalFilter implements GlobalFilter{
    
}
```

案例：如果ip是本机 就不放行

```java
@Component
public class CustomGlobalFilter implements GlobalFilter, Ordered {
    @Override
    public int getOrder() {
        return -100;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpHeaders headers = exchange.getRequest().getHeaders();
        String host = exchange.getRequest().getURI().getHost();
        System.out.println(host);
        // 此处写死了，演示用，实际中需要采取配置的方式
        if (host.contains("localhost")) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            String jsonStr = "{\"status\":\"-1\", \"msg\":\"error\"}";
            byte[] bytes = jsonStr.getBytes(StandardCharsets.UTF_8);
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        }
        return chain.filter(exchange);
    }
}
```

### 全局过滤器异常处理

> 获取微服务的状态信息，如果非200，进行统一的异常处理 
>
> 全局的过滤器可以不要配置直接使用
>
> 下方过滤器配合 局部的其他类配合使用

~~~java
package com.apai.filters;

import com.apai.config.ErrorStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;


@Component
@Order(2)
public class QuanjuGlobalFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 获取 请求头的token
        List<String> token = exchange.getRequest().getHeaders().get("token");
        // 不为空则 放行
        if (token != null) {
            // 过滤器放行
            // then方法就是在微服务返回之后执行的
            return chain.filter(exchange).then(Mono.fromRunnable(new Runnable() {
                @SneakyThrows
                @Override
                public void run() {
                    // 获取 请求的状态
                    HttpStatus statusCode = exchange.getResponse().getStatusCode();
                    // 创建异常信息封装对象
                    ErrorStatus error = new ErrorStatus();
                    // 根据 请求的状态对应的执行异常类
                    if (statusCode.value() == 500) {
                        // 将异常信息封装
                        error.setStatus(500);
                        error.setMsg("服务器内部报错");
                        // 将异常的封装类对象 转换 字符串
                        String errorMsg = new ObjectMapper().writeValueAsString(error);
                        // 将异常信息字符串向上抛出异常
                        throw new RuntimeException(errorMsg);
                    } else if (statusCode.value() == 404) {
                        // 将异常信息封装
                        error.setStatus(404);
                        error.setMsg("url地址不合法");
                        // 将异常的封装类对象 转换 字符串
                        String errorMsg = new ObjectMapper().writeValueAsString(error);
                        // 将异常信息字符串向上抛出异常
                        throw new RuntimeException(errorMsg);
                    } else if (statusCode.value() == 400) {
                        // 将异常信息封装
                        error.setStatus(400);
                        error.setMsg("请求参数错误");
                        // 将异常的封装类对象 转换 字符串
                        String errorMsg = new ObjectMapper().writeValueAsString(error);
                        // 将异常信息字符串向上抛出异常
                        throw new RuntimeException(errorMsg);
                    }
                }
            }));
        }
        // 为空则返回提示信息
        String jsonStr = "{\"status\":\"300\", \"msg\":\"你没有携带token\"}";
        byte[] bytes = jsonStr.getBytes(StandardCharsets.UTF_8);
        DataBuffer dataBuffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Flux.just(dataBuffer));
    }
}
~~~

定义异常部分在前面的局部异常定义过，这里不再讲解

> 需要说明的是：如果网关转发的微服务宕机或者没有启动，那么全局过滤器是不会执行的。

## 跨域配置

> **跨域: 即不同的IP 或者 不同的端口 就是跨域  |  直接请求跨域的服务器是无法正常调用**

通过自定义 GatewayFilter 定义过滤器,拦截请求,统一设置请求允许跨域

~~~java
@Component
public class CrossGatewayFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        HttpHeaders headers = response.getHeaders();
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,"POST,GET,PUT,DELETE");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS,"*");
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
~~~

采用配置的方式（推荐）

~~~yaml
spring:
  application:
    name: hospital-gateway1
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            # 允许携带认证信息
            allow-credentials: true
            # 允许跨域的源(网站域名/ip)，设置*为全部
            allowedOrigins: "*"
            # 允许跨域的method， 默认为GET和OPTIONS，设置*为全部
            allowedMethods: "*"
            # 允许跨域请求里的head字段，设置*为全部
            allowedHeaders: "*"
      routes:
        - id: sickroom微服务
          uri: lb://sickroom-service
          predicates:
            - Path=/sickroom/**
          filters:
            - StripPrefix=1

        - id: finance微服务
          uri: lb://finance-service
          predicates:
            - Path=/finance/**
          filters:
            - StripPrefix=1

~~~

## Gateway网关的熔断降级

1.添加springcloud的hystrix启动器

~~~xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
~~~

2.在gateway网关已经内置了局部的HystrixGatewayFilterFactory过滤器类，直接在要转发的某个微服务上面配置即可

~~~yaml
spring:
  application:
    name: spring-service-gateway
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            # 允许携带认证信息
            allow-credentials: true
            # 允许跨域的源(网站域名/ip)，设置*为全部
            allowedOrigins: "*"
            # 允许跨域的method， 默认为GET和OPTIONS，设置*为全部
            allowedMethods: "*"
            # 允许跨域请求里的head字段，设置*为全部
            allowedHeaders: "*"
      routes:
        - id: b服务
          uri: lb://spring-service-b
          predicates:
            - Path=/port/**
          filters:
            - name: Hystrix
              args:
                name: fallbackcmd
                fallbackUri: forward:/myfallback
                
hystrix:
  command:
    default:
      execution:
        isolation:
          strategy: SEMAPHORE
          thread:
            timeoutInMilliseconds: 5000   ##5s后降级
~~~

> 说明：
>
> 1.HystrixGatewayFilterFactory过滤器内置配置类有很多参数，name:  fallbackcmd(固定写法)
>
> 2.fallbackUri表示熔断后的降级请求地址

3.请求接口定义

在gateway微服务中编写controller请求

~~~java
@RestController
public class FallBackController {

    @RequestMapping("/myfallback")  //和上面的fallbackUri要对应
    public Map<String,String> myFallback(){

        Map<String,String> map = new HashMap<>();
        map.put("Code","fail");
        map.put("Message","服务暂时不可用,请稍候访问.");
        return map;
    }
}
~~~



# Bucket4j  令牌

```xml
<!--Bucket4j 令牌桶-->
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>4.10.0</version>
</dependency>
```

『**令牌桶**』是一种限速算法，与之相对的是『**漏桶**』。

当进行任务的操作时，消耗一定的令牌，后台以一定的速率生产令牌。在没有令牌的情况下，就阻塞任务，或者拒绝服务。令牌的生产速率，代表了大部分情况下的平均流速。

桶的作用就是存储令牌，消耗的令牌都是从桶中获取。

桶的作用是用来限制流速的峰值，当桶中有额外令牌的时候，实际的流速就会高于限定的令牌生产速率。

为了保证功能的完整，后台必须保证令牌生产，而且是持续服务，不能中断。同时，为了桶功能的正确作用，当桶满了以后，后续生产的令牌会溢出，不会存储到桶内部。

令牌桶和漏桶的区别：

~~~
l 漏桶算法能够强行限制数据的传输速率。令牌桶算法能够在限制数据的平均传输速率的同时还允许某种程度的突发传输。需要说明的是：在某些情况下，漏桶算法不能够有效地使用网络资源。因为漏桶的漏出速率是固定的，所以即使网络中没有发生拥塞，漏桶算法也不能使某一个单独的数据流达到端口速率。因此，漏桶算法对于存在突发特性的流量来说缺乏效率。而令牌桶算法则能够满足这些具有突发特性的流量。通常，漏桶算法与令牌桶算法结合起来为网络流量提供更高效的控制。漏桶算法思路很简单，水（请求）先进入到漏桶里，漏桶以一定的速度出水，当水流入速度过大会直接溢出，可以看出漏桶算法能强行限制数据的传输速率
~~~



## 1. 基本使用

最简单的 bucket4j 的使用需要提供、涵盖以下几个概念：

1. 桶对象。
2. 带宽。即，每秒提供多少个 token，以允许操作。
3. 消费。即，从桶中一次性取走多少个 token 。

代码示例：

```java
// 带宽，也就是每秒能够通过的流量，自动维护令牌生产。 //桶大小是10 ，初始有10个，每秒生产10个
Bandwidth limit = Bandwidth.simple(10, Duration.ofSeconds(1));
// 桶 bucket 是我们操作的入口。桶的大小就是只能放10个，
Bucket bucket = Bucket4j.builder().addLimit(limit).build();
// 尝试消费 n 个令牌，返回布尔值，表示能够消费或者不能够消费。
log.info("{}", bucket.tryConsume(1) ? "do something" : "do nothing")
```

## 2. 阻塞式消费

在上面的基础案例中，如果 bucket 中的令牌的数量不够你的当前消费时，**.tryConsume** 方法会以失败的方式返回。

不过，有时我们希望的效果是等待，等到 bucket 中新增令牌后，再消费，返回。

这种情况下，我们需要使用 **.asScheduler** 方法。

```java
//桶大小是1，初始有1个令牌，以后每2秒生产一个
Bandwidth limit = Bandwidth.simple(1, Duration.ofSeconds(2));
Bucket bucket = Bucket4j.builder().addLimit(limit).build();
while (true) {
    // 看这里，看这里，看这里。
    bucket.asScheduler().consume(1);  //该方法会阻塞，取不到就等待
    String time = LocalTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME);
    log.info("{}", time);
}
```

## 3. 探针

通过创建并使用 **ConsumptionProbe** 对象，除了可以实现正常的消费功能之外，还可以通过它去查询消费后的桶中的“余额”。

```java
// 探针 桶大小是5，每秒生产5个
Bandwidth limit = Bandwidth.simple(5, Duration.ofSeconds(1));
Bucket bucket = Bucket4j.builder().addLimit(limit).build();
while (true) {
    // 获取探针，消费令牌
    ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
    // 判断【上一步】是否消费成功
    if (probe.isConsumed()) {  //该方法不会 阻塞
        String time = LocalTime.now().format(DateTimeFormatter.ISO_TIME);
        // 查询剩余令牌数量
        log.info("{} 剩余令牌: {}", time, probe.getRemainingTokens());
    } else {
        log.info("waiting...");
        Thread.sleep(500);
    }
} 
```

## 4. Refill 和 classic 方法

在之前的例子中，我们使用的都是 **Bandwidth.simple** 方法，实际上，它相当于是 **Bandwidth.classic** 方法的简写。

**Bandwidth.classic** 方法的第二个参数需要一个 **Refill** 对象，而 **Refill** 对象就代表着你对桶的填充规则的设定。

```java
// 桶控制。桶容量初始化时默认是满的 ，初始化时 桶有9个，桶的大小也是9
long bucketSize = 9; 
Refill filler = Refill.greedy(2, Duration.ofSeconds(1)); //每秒生产2个令牌
Bandwidth limit = Bandwidth.classic(bucketSize, filler); //桶的初始大小有9个令牌
//桶的大小是9.也就是说以后每次单位时间生产的令牌最多也是9个，例如：上面我们改成每秒生产20个，那么其实最终还是只能装9个，多余的溢出
Bucket bucket = Bucket4j.builder().addLimit(limit).build();
while (true) {
    ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
    if (probe.isConsumed()) {
        log.info("{}: 剩余令牌 {}", LocalTime.now().format(DateTimeFormatter.ISO_TIME), probe.getRemainingTokens());
    } else {
        log.info("waiting...");
        Thread.sleep(2000);
    }
} 
```

初始化桶有9个令牌，打印8 7 6 5 4 3 2 1 0 ，刚好消费完，   线程休眠2s，2s期间，桶每秒生产2个令牌，2s刚好4个，故睡醒后 打印 3 2 1 0，以此类推

## 5. 初始化令牌数量

『**桶的容量**』和桶中的『**令牌的数量**』是两个概念。

默认情况下（上述例子中），在创建桶对象之后，桶都是满的。

不过，你可能不需要这种情况。这时，你需要在创建桶时使用 **withInitialTokens** 方法指定其中的令牌数量。

```java
long bucketSize = 9;
Refill filler = Refill.greedy(2, Duration.ofSeconds(1)); //每秒2个令牌，每秒生产的令牌不能大于9
// 看这里，看这里，看这里。 初始化时 桶的大小是9，这个时候桶里面的令牌数量是5个，初始化数量不能大于9，
Bandwidth limit = Bandwidth.classic(bucketSize, filler).withInitialTokens(5); //初始化桶的数量是5个
Bucket bucket = Bucket4j.builder().addLimit(limit).build();
while (true) {
    ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
    if (probe.isConsumed()) {
        log.info("{}: 剩余令牌 {}", LocalTime.now().format(DateTimeFormatter.ISO_TIME), probe.getRemainingTokens());
    } else {
        log.info("waiting...");
        Thread.sleep(2000);
    }
} 
```

## 6. 非贪婪式创建令牌

在之前的示例中，令牌的创建方式都是贪婪式的。所谓贪婪式，指的就是在每一次的添加令牌的周期中，只要有创建了令牌就开始消费，是非贪婪式就是说必须等一次性等到所有的令牌都创建完成之后才开始消费，不过有时，你可能需要这个添加过程更均匀一些，这种情况下，你就需要使用 Refill.intervally 方法。

不过有时，你可能需要这个添加过程更均匀一些，这种情况下，你就需要使用 **Refill.intervally** 方法。

```java
@Test
void contextLoads() {

    long bucketSize = 10;
    Refill filler = Refill.intervally(10, Duration.ofSeconds(1));

    Bandwidth limit = Bandwidth.classic(bucketSize, filler).withInitialTokens(10);
    Bucket bucket = Bucket4j.builder().addLimit(limit).build();
    while (true) {
        // 获取探针
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        // 判断是否能消耗
        if (probe.isConsumed()) {
            String time = LocalTime.now().format(DateTimeFormatter.ISO_TIME);
            // 查询剩余令牌数量
            log.info("{} 剩余令牌: {}", time, probe.getRemainingTokens());
        }
    }
}
```

# Gateway 限流

限流的目的时通过对并发访问接口方法（或对一个时间窗口内的请求）进行限速，一旦达到限制速率则可以拒绝服务。

网关就要通过限流来承担保护后端应用的责任。

## 1. 限流策略

常见的算法有『**令牌桶**』和『**漏桶**』两种方案。

『漏桶』的思路类似于消息队列的工作形式，请求（类比于水）先进入到漏桶的，漏桶以一定的速率出（漏）水。

当水流入的速度过大就会直接在桶中有积攒，一旦积攒量超过漏桶上限，再流入的水就会溢出。

『令牌桶』的思路和漏桶相反。在系统运行期间，系统按照恒定时间间隔定期向桶中加入令牌（Token），如果桶已经满了，就不再增加。

当新的请求来临时，会拿走令牌，有令牌则意味着有资格进行请求，如果没有令牌可能就会阻塞或者拒绝。

## 2. Gateway 自定义过滤器限流

在 Gateway 中实现限流比较简单，只需要编写一个过滤器。

RateLimiter（Guava）、Bucket4j、RateLimitJ 都是基于令牌桶算法实现的限流工具。

> Bucket4j 的使用见另一篇笔记《Bucket4j》

~~~xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!--Bucket4j 令牌桶-->
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>4.10.0</version>
</dependency>
~~~

> 编写自定义过滤器 **GatewayRateLimitFilter** 并实现 GatewayFilter（和 Ordered）接口。
>
> 全局不需要加入配置 自动启用

```java
package com.apai.filters;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Component
@Slf4j
public class GatewayRateLimitFilter implements GlobalFilter, Ordered {

    // 如果要启动网关的多个实例，那么就需要将 ip 和桶的键值对信息存到 Redis 中。
    private static final Map<String, Bucket> LOCAL_CACHE = new ConcurrentHashMap<>();
    private int capacity; //桶容量
    private int refillTokens;//  定时添加token的数量  如每秒添加几个token
    private Duration refillDuration;//添加周期   周期 ： 如 每秒

    public GatewayRateLimitFilter(int capacity, int refillTokens, Duration refillDuration) {
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillDuration = refillDuration;
    }

    public GatewayRateLimitFilter() {
        // capacity: 初始10桶 | refillTokens: 时间内生成5个桶 | Duration.ofSeconds(时间)
        this(10, 5, Duration.ofSeconds(1));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        //获取请求的 主机ip 如: localhost
        //String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        String ip = exchange.getRequest().getURI().getHost();
        System.out.println(ip);
        // 获取请求的路径 如: user/add
        String url = exchange.getRequest().getURI().getPath();  //获取url
        System.out.println(url);
        //computeIfAbsent： 如果没有某个key，则添加某个key-value，否则返回该key对应的value
        //对同一客户端的请求，不同的接口请求都做了限流
        Bucket bucket = LOCAL_CACHE.computeIfAbsent(ip + url, new Function<String, Bucket>() {
            @Override
            public Bucket apply(String s) {
                return createNewBucket();
            }
        });
        log.info("IP:{}，令牌桶可用的 token 数量：{}", ip, bucket.getAvailableTokens());
        if (bucket.tryConsume(1)) {
            return chain.filter(exchange);
        } else {
            // 当令牌数量为零时 网关会拒绝转发 并返回提示信息
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            String jsonStr = "{\"status\":\"886\", \"msg\":\"请求过于频繁\"}";
            byte[] bytes = jsonStr.getBytes(StandardCharsets.UTF_8);
            DataBuffer dataBuffer = exchange.getResponse().bufferFactory().wrap(bytes);
            return exchange.getResponse().writeWith(Flux.just(dataBuffer));
            // 请求太频繁了  请少稍后再试
            // return exchange.getResponse().setComplete();
        }
    }

    //生成一个桶
    private Bucket createNewBucket() {
        //每秒中生产一个token
        Refill refill = Refill.greedy(refillTokens, refillDuration);
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket4j.builder().addLimit(limit).build();
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
```

通过配置文件或代码配置并使用 Filter 。

```java
public static void main(String[] args) {
    SpringApplication.run(EurekaGatewayApplication.class, args);
}

@Bean
public RouteLocator customerRouteLocator(RouteLocatorBuilder builder) {
    String intercept = "/test";  //  不要写成 String intercept = "/test/"
    String target = "http://localhost:8081";
    GatewayFilter filter = new GatewayRateLimitFilter(1, 1, Duration.ofSeconds(10));

    return builder.routes()
            .route(r -> r.path(intercept)
                    .filters(f -> f.filter(filter))
                    .uri(target)
                    .id("rateLimit_route"))
            .build();

}
```

配置文件：

```yaml
spring:
  application:
    name: eureka-gateway
  cloud:
    gateway:
      routes:
        - id: 163_route
          uri: http://localhost:8081
          predicates:
            - Path=/test
          filters:
            - name: yyy
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
server:
  port: 9000
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
    registry-fetch-interval-seconds: 5
    register-with-eureka: true
```

观察运行效果，当可用令牌数量为 0 时，Gateway 中的自定义限流器会开始拒绝放行请求，直接返回 429 状态码



# ||-> Nacos  微服务 总汇

## 依赖

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
    <!--Gateway 服务网关 无需web赋值报错-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!--Hystrix熔断 服务降级-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
    </dependency>
    <!--Bucket4j 令牌桶-->
    <dependency>
        <groupId>com.github.vladimir-bukhtoyarov</groupId>
        <artifactId>bucket4j-core</artifactId>
        <version>4.10.0</version>
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

## Nacos  注解

```java
// ---- 启动类 ----
// 启动类 解决 使用了 mybatis-plus 但是没配置 数据库信息则启动报错 如果配置在使用该注解排除则报错
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
// 启用 nacos 的服务发现
@EnableDiscoveryClient 

// ---- 过滤器 ----
// 控制全局过滤器的先后顺序，不是局部的顺序，值越小，优先级越高。
@Order(-5) 
```
