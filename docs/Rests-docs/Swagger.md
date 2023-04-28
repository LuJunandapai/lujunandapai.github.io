---
title: Swagger 接口测试
date: 2023/04/26
---

## ----- Swagger 1 -----

Swagger 是一系列 RESTful API 的工具，通过 Swagger 可以获得项目的⼀种交互式文档，客户端 SDK 的⾃ 动生成等功能。

Swagger 的目标是为 REST API 定义一个标准的、与语⾔言无关的接口，使人和计算机在看不到源码或者看不到文档或者不能通过网络流量检测的情况下，能发现和理解各种服务的功能。当服务通过 Swagger 定义，消费者就能与远程的服务互动通过少量的实现逻辑。

Swagger（丝袜哥）是世界上最流行的 API 表达工具。

## Swagger 基础创建

### Swagger 依赖

```xml
<!--Swagger 依赖-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!--Swagger Ui 前端页面-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

### SwaggerConfig 配置类

在 SwaggerConfig 的类上添加两个注解：

| 注解            | 说明                                |
| --------------- | ----------------------------------- |
| @Configuration  | 启动时加载此类                      |
| @EnableSwagger2 | 表示此项目启用 Swagger API 文档功能 |

```java
package com.apai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(apiInfo())
            .select()
            // 此处自行修改为自己的 Controller 包路径。
            .apis(RequestHandlerSelectors.basePackage("com.apai.controller"))
            .paths(PathSelectors.any())
            .build();
    }
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("阿派 项目接口文挡")
            .description("XXX Project Swagger2 UserService Interface")
            .termsOfServiceUrl("http://localhost:8080/swagger-ui.html")
            .version("1.0")
            .build();
    }

}
```

### 注意: 过滤 | 拦截

如果，你的项目中配置了拦截器，那么拦截器会拦截你的 /swagger-ui.html 请求，从而导致你看不到 swagger 页面。

这种情况下，你需要在你的拦截器的配置中，将 swagger 请求排除在外：

```java
@Configuration
@EnableWebMvc
@ComponentScan("xxx.yyy.zzz.web.controller")
public class SpringWebConfig implements WebMvcConfigurer {
    // 暂未验证
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/swagger-ui.html", 
                    "/swagger/**", 
                    "/swagger-resources/**"
                ).order(1);
    }
}
```



## Swagger 常用注解

Swagger 通过注解表明该接口会生成文档，包括接口名、请求方法、参数、返回信息等，常用注解内容如下：

| 注解                            | 作用                                                | 备注                                                         |
| ------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| @Api(tags="")                   | 用在请求的类上，表示对类的说明                      | tags属性：说明该类的作用，可以在UI界面上看到的注解           |
| @ApiOperation                   | 用在请求的方法上，说明方法的用途                    | value属性: 说明方法的用途、作用，response =“接口返回参数类型”，httpMethod = “接口请求方式”，produces="请求头输出类型" |
| @ApiImplicitParams              | 用在请求的方法上，表示一组参数说明                  | 多个@ApiImplicitParam组合                                    |
| @ApiImplicitParam               | 指某个请求参数的各个方面                            | 属性：1.name参数名称  2.value参数说明  3.required参数是否必须 4.allowMultiple=true 表示是数组格式的参数  5.paramType和dataType 如下案例说明，6.example表示参数的默认值 |
| @ApiResponses                   | 用在请求的方法上，表示一组响应                      | 多个@ApiResponse组合                                         |
| @ApiResponse                    | 用在@ApiResponses中，一般用于表达一个错误的响应信息 | code：数字，例如400，message：信息，例如"请求参数没填好"，response：抛出异常的类 |
| @ApiModel(value = "理财实体类") | 用在实体类上                                        | 实体类相关说明                                               |
| @ApiModelProperty               | 用在属性上，描述响应类的属性                        |                                                              |



### 请求参数详解

#### @ApiImplicitParams

* 用在请求的方法上，表示一组参数说明

* 多个@ApiImplicitParam组合

```java
@ApiImplicitParams(value = {
    @ApiImplicitParam(),
    @ApiImplicitParam()
})
@ApiOperation("查询方法")
@PostMapping("/select")  //或者用getMapping("/select")
public Object select(String name,Integer id){
    return name + id;
}
```

#### @ApiImplicitParam 

> 指某个请求参数的各个方面

**属性：**

* name | 参数名称  
* value | 参数说明  
* required | 参数是否必须 
* allowMultiple=true | 表示是数组格式的参数  
* paramType  | 如下案例说明，
* dataType  | 参数类型 实体类则写全路径
* example | 表示参数的默认值 int类型必须设置默认值

### 请求 paramType 属性详解

#### query

> 普通参数拼接，多个基本类型传参

```java
@ApiImplicitParams(value = {
    @ApiImplicitParam(name = "name", value = "用户名", paramType = "query", dataType = "string", example ="xingguo"),
    @ApiImplicitParam(name = "id", value = "id", dataType = "int", example = "23", paramType = "query")
})
@ApiOperation("查询方法")
@GetMapping("/select")
public Object select(String name,Integer id){
    return name + id;
}
```

#### path

> 用于restful 风格的请求，且请求参数的获取：@PathVariable 注解接收

```java
@ApiOperation(value = "获取用户信息", produces = "application/json")
@ApiImplicitParams({
    @ApiImplicitParam(name = "id", value = "用户Id", required = true, example = "23", dataType = "int", paramType = "path")
})
@GetMapping(value = "/get/{id}")
public Integer getUser(@PathVariable Integer id) {
    return id;
}
```

##### body（对象类型）

> body：放在请求体，请求参数的获取：@RequestBody(代码中接收注解)，仅支持post

```java
@ApiOperation(value = "获取用户")
@ApiImplicitParams({
    @ApiImplicitParam(name="financing",value = "用户对象",dataType = "com.woniu.entity.financing", paramType = "body"),
})
@PostMapping(value = "/getuser2")
public ResponseResult<String> getUser2(@RequestBody Financing financing){
    System.out.println(financing.toString());
    return new ResponseResult<String>(202,"成功了");
}
```

##### header

> header 用来接收请求头参数，@RequestHeader(代码中接收注解）

```java
@ApiOperation(value = "toke 请求头")
@ApiImplicitParams({
    @ApiImplicitParam(name="token",value = "携带的token",dataType = "string", paramType = "header"),
})
@PostMapping(value = "/token")
public ResponseResult<String> token(@RequestHeader String token){
    System.out.println(token);
    return new ResponseResult<String>(202,"成功了");
}
```

##### form

> 表单传参，不常用 ,  如果接收为对象且post请求, 不需要@RequestBody接收
>
> 直接使用 实体类对象 接收
>
> 可 post请求 或者 get请求 都行

```java
//对于paramType = "form" ，get请求和post请求都可以
@ApiOperation("添加用户2")
@ApiImplicitParams({
    @ApiImplicitParam(name="financing", value = "用户对象", dataType = "com.woniu.entity.financing", paramType = "form")
})
@GetMapping(value = "/adduser2")
public ResponseResult<String> foem(Financing financing){
    System.out.println(financing.toString());
    return new ResponseResult<String>(202,"成功了");
}
```

### @ApiResponses 错误响应信息

**属性:**

- code：数字，例如400
- message：信息，例如"请求参数没填好"
- response：抛出异常的类

**例如:**

```java
//对于paramType = "form" ，get请求和post请求都可以
@ApiOperation("添加用户2")
@ApiImplicitParams({
    @ApiImplicitParam(name="user",value = "用户对象",dataType = "com.woniu.entity.User",
                      paramType = "form")
})
@ApiResponses({
    @ApiResponse(code=404,message = "你的url不对"),
    @ApiResponse(code=500,message = "服务器有问题"),
    @ApiResponse(code=400,message = "你的参数不对"),
}
             )
@GetMapping(value = "/adduser2")
public ResponseResult<String> getUser2(User user){
    System.out.println(user.toString());
    int m = 1/0;
    return new ResponseResult<String>(202,"成功了");
}
```



## ----- knife4j-Swagger 2 -----

> Swagger  升级版

knife4j 是 Swagger 生成 API 文档的增强解决方案，最主要是 knife4j 提供了动态字段注释功能来实现 Map 来接收参数这个的接口文档生成，忽略参数属性来实现同一个实体类对不同接口生成不同的文档。



## knife4j-Swagger创建

### knife4j-Swagger 依赖

```xml
<!--Swagger 升级版依赖-->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>3.0.2</version>
</dependency>
<!--Web-->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!--实体类注解 依赖-->
 <dependency>
     <groupId>org.projectlombok</groupId>
     <artifactId>lombok</artifactId>
</dependency>
```

### knife4j-Swagger 配置类

```java
package com.apai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2  //启用swagger功能
@Import(BeanValidatorPluginsConfiguration.class) // 可不加 防止意外
public class SwaggerConfig {

    //Docket用来定义swagger文档的一些属性，
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                // 定义是否开启swagger，false为关闭，可以通过变量控制，线上关闭
                .enable(true)
                // 配置api文档元信息
                .apiInfo(apiInfo())
                // 选择哪些接口作为swagger的doc发布
                .select()
                // apis() 控制哪些接口暴露给swagger
                // .apis(RequestHandlerSelectors.any()) //所有都暴露
                // .apis(withMethodAnnotation(ApiOperation.class)) //标记有这个注解 ApiOperation
                .apis(RequestHandlerSelectors.basePackage("com.apai.controller")) //指定包位置
                .paths(PathSelectors.any())
                .build();
    }

    // 生成接口文档的基本信息
    private ApiInfo apiInfo() {
        String title = "阿派系统接口说明";
        return new ApiInfoBuilder().title(title)
                .description("接口文档")
                //.termsOfServiceUrl("http://localhost:8080/doc.html")
                .version("1.0")
                .build();
    }
}
```

### 静态资源拦截配置

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
} 

// 放行资源
doc.html
uri.contains("/doc") || uri.endsWith("js") || uri.endsWith("css")
```

knife4j 有提供 UI 来显示，默认访问地址是：

### security 安全框架放行

* config.security 配置包下

> ##### JwtTokenFilter 过滤器放行

```java 
package com.woniu.config.security;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.woniu.exception.MyTokenIsInvalidException;
import com.woniu.exception.MyTokenIsNullException;
import com.woniu.outlet.po.Jurisdiction;
import com.woniu.outlet.po.User;
import com.woniu.service.IJurisdictionService;
import com.woniu.service.IUserService;
import com.woniu.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private MyAuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    private IUserService userService;

    @Autowired
    private IJurisdictionService jurisdictionService;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");

        // ---- swagger 放行 ----
        String path = request.getRequestURI();
        if (path.contains("doc.html") || path.contains(".js") || path.contains(".css")
                || path.contains("swagger-resources") || path.contains("api-docs") || path.contains("favicon.ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. 校验这个token是否为null
        if (StringUtils.isEmpty(token)) {
            String uri = request.getRequestURI().toString();
            if (uri.contains("/login") || uri.contains("/login.html") || uri.startsWith("/js/") || uri.startsWith("/css/") || uri.startsWith("/img/") || uri.equals("/favicon.ico") || uri.contains("/user/register")) {
                // 如果请求地址是 /login   /login.html  js css img，则直接放行
                filterChain.doFilter(request, response);
                return;
            } else {
                authenticationFailureHandler.onAuthenticationFailure(request, response, new MyTokenIsNullException("Token is Null"));
                return;
            }
        }

        //token 不为空，校验合法
        if (JwtTokenUtil.checkToken(token)) {
            // 合法
            String userAccount = JwtTokenUtil.getUsername(token);
            // 3. 根据用户名查询数据库，获取用户的权限集合

            String paidaxing = stringRedisTemplate.opsForValue().get(userAccount);
            List<String> perms = JSON.parseArray(paidaxing, String.class);

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(perm -> {
                GrantedAuthority authority = new SimpleGrantedAuthority(perm);
                list.add(authority);
            });

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userAccount, "", list);


            // 5. 装入security 容器中
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 6.继续放行
            filterChain.doFilter(request, response);
        } else {
            // 不合法
            authenticationFailureHandler.onAuthenticationFailure(request, response, new MyTokenIsInvalidException("Token is Invalid!"));
            return;
        }

    }
}
```

> ##### WebSecurityConfig 放行请求

```java
package com.woniu.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


// springsecurity 的认证
//@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)  // 开启鉴权注解 内包含: @Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;

    @Autowired
    private MyAuthenticationFailureHandler myAuthenticationFailureHandler;

    @Autowired
    private MyAuthenticationEntryPoint myAuthenticationEntryPoint;

    @Autowired
    private MyAccessDeniedHandler myAccessDeniedHandler;

    @Autowired
    private MyLogoutSuccessHandLer myLogoutSuccessHandLer;

    @Autowired
    private JwtTokenFilter jwtTokenFilter;


    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 最终认证做法，是当用户输入用户名和密码的时候，表单提交的url 是：/login，然后security根据我们提交的用户名和密码
        // 去数据库查询是否有   没有就登陆失败，否则就登陆成功
        // 将来做认证的时候 执行的是我们自定义的实现类 来做 验证 UserDetailsServiceImpl 类
        auth.userDetailsService(userDetailsService).passwordEncoder(getBCryptPasswordEncoder());
    }


    @Override
    public void configure(WebSecurity web) throws Exception {
        // 放行 swagger 所有的请求 页面请求 扫描web包请求
        web.ignoring().antMatchers(HttpMethod.GET,
                "/v2/api-docs",
                "/swagger-resources",
                "/swagger-resources/**",
                "/configuration/ui",
                "/configuration/security",
                "/swagger-ui.html/**",
                "/webjars/**", "/doc.html",
                "/warehouse/updateDrugWarehousePo",
                "/warehouse/findDrugWarehousePoByid",
                "/purchase/findDrugCustomerById",
                "/purchase/findDrugCustomer",
                "/purchase/findCustomers",
                "/purchase/addDrugCustomer",
                "/purchase/updateDrugCustomer",
                "/purchase/deleteDrugCustomer"
        );
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {



        // 鉴权认证配置
        http.authorizeRequests() // 鉴权的请求
                .antMatchers("/login.html", "/user/register", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico", "doc.html").permitAll() // 允许通过的请求
                .anyRequest().authenticated(); // 除了什么配置 其他的需要登录访问

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                .usernameParameter("userAccount").passwordParameter("password") // 登录的表单参数
                // .defaultSuccessUrl("/home")  // 登录成功重定向路径
                .successHandler(myAuthenticationSuccessHandler) // 登陆成功处理器
                // .failureForwardUrl("/error1"); // 登录失败转发的路径
                .failureHandler(myAuthenticationFailureHandler); // 自定义登录失败处理器

        // 认证和鉴权异常配置
        http.exceptionHandling()
                .authenticationEntryPoint(myAuthenticationEntryPoint)   // 认证异常
                .accessDeniedHandler(myAccessDeniedHandler);            // 鉴权异常

        // 使用jwt的话，需要关闭session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // 添加jwt过滤器到security过滤器链中
        http.addFilterAfter(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        // 退出成功的处理器
        http.logout().logoutSuccessHandler(myLogoutSuccessHandLer);

        //关闭CSRF跨域
        http.csrf().disable();
    }
}
```

> ##### WebMvcConfig 放行 可不加

```java
package com.woniu.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
```



### 访问前端页

**网址:** http://localhost:8080/doc.html

![image-20220729203307745](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220729203307745.png)

### 全局配置 token

![image-20220810195850088](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220810195850088.png)

## knife4j-Swagger 注解

### 动态字段注释

#### @ApiOperationSupport

> 该注解是扩展增强注解，目前主要扩展的属性有 

* order（接口排序）
* author（接口开发者）
* params（动态字段集合）
* responses（返回动态字段集合）
* ignoreParameters (忽略某个属性) 



#### @DynamicParameters

> 动态扩展注解 

* name（Model 名称）
* properties（属性列表）



### 入参动态注解 | Map 参数

> 通过map来接收参数

* @ApiIgnore | 忽略map，map不在前端显示，
* 但 name、sex、age 可以封装到 map
* @RequestParam 注解不能省略 否则无法封装到 Map

~~~java
@PostMapping("/test1")
@ApiOperationSupport()
@ApiImplicitParams({
    @ApiImplicitParam(paramType = "query",name = "name",value ="名称",dataType ="string"),
    @ApiImplicitParam(paramType = "query",name = "sex",value ="性别",dataType ="string"),
    @ApiImplicitParam(paramType = "query",name = "age",value ="年龄",dataType ="int")
})
public void test1(@ApiIgnore @RequestParam Map<String, Object> map) {   //paramType = "query"不能省略
    String name = (String) map.get("name");
    String sex = (String) map.get("sex");
    Integer age = Integer.parseInt(map.get("age").toString());
    log.info("姓名:" + name);
    log.info("性别:" + sex);
    log.info("年龄:" + age);
}
~~~

### @RequestBody参数属性

> 接收User对象，以及User对象的属性是一个另一个实体类对象的集合

**实体类对象**

```java
@ApiModel
@Data
public class User {
    @ApiModelProperty(value = "主键",example = "23")
    private int id;
    @ApiModelProperty(value = "姓名")
    private String name;
    @ApiModelProperty(value = "email")
    private String email;
    @ApiModelProperty("集合角色")
    private List<Role> roles;
}
------------------------------------------------
@Data
@ApiModel("角色实体")
public class Role {
    @ApiModelProperty(value = "roleId")
    private Integer id;
    @ApiModelProperty(value = "角色名称")
    private String name;
}
```

**请求的封装**

```java
@Api(tags = "用户controller")
@RestController
@Slf4j
public class UserController {
    @PostMapping("/test3")
    public void test3(@RequestBody User user) {
        log.info(user.toString());
    }
}
```

### 隐藏对象属性

> @ApiModelProperty(value = "",hidden = true)
>
> 即: 隐藏该字段在界面不显示 但是可以手动写入字段为其赋值

这个注解 @ApiModelProperty(value = "",hidden = true)里面的hidden属性，只是将某个属性字段值隐藏起来，生成的文档中不显示出来，一旦设置，那么所有的接口含有该对象的某个属性都不会显示。但是在点击界面“调试”的时候，依然可以给隐藏的属性赋值，不够灵活

```java
@ApiModel
@Data
public class User {
    @ApiModelProperty(value = "主键",example = "23")
    private int id;
    @ApiModelProperty(value = "姓名")
    private String name;
    @ApiModelProperty(value = "email")
    private String email;
    @ApiModelProperty(value ="集合角色",hidden = true)
    private List<Role> roles;
}
----------------------------------
@Api(tags = "用户controller")
@RestController
@Slf4j
public class UserController {
    @PostMapping("/test3")
    public void test3(@RequestBody User user,@RequestHeader String Authorization) {
        log.info(user.toString());
    }
}
```

### 返回值动态注解

> responses属性：返回动态字段集合，可以在接口上定义map，来封装要返回的属性

```java
@PostMapping("/test2")
@ApiOperationSupport(responses = @DynamicResponseParameters(properties = {
@DynamicParameter(name = "name", value = "名字"),
    @DynamicParameter(name = "sex", value = "性别"),
    @DynamicParameter(name = "age", value = "年龄")
  }))
public Map<String,Object> test2(){
    Map<String,Object> map=new HashMap<>();
    map.put("name","张三");
    map.put("sex","男");
    map.put("age",19);
    return map;
} 
```



### 忽略字段的显示

针对不同的接口，传参是一个对象，有的不需要显示对象的某个属性，有的需要显示某个对象的属性，那么这种你可以用@ApiOperationSupport(ignoreParameters  对象名.属性名）来控制

配置文件相关配置：

~~~xml-dtd
knife4j:
  enable: true  #默认值为false
~~~

```java
@ApiModel
@Data
public class User {
    @ApiModelProperty(value = "主键",example = "23")
    private int id;
    @ApiModelProperty(value = "姓名")
    private String name;
    @ApiModelProperty(value = "email",hidden = true)
    private String email;
}
--------------------------------------------------------
@PostMapping("/test3")
@ApiOperationSupport(ignoreParameters = {"user.username"})  //不显示用户名
public void test3(@RequestBody UserVo user) {
    log.info(user.toString());	
}

@PostMapping("/test4")
public void test4(@RequestBody UserVo user) {  
    log.info(user.toString());
}
```



### 使用自定义返回类

我们一般都会有一个 Result 这样的类作为统一的返回类，Result 类中的 data 属性里是数据。例如：

```java
public class Result<T> {
    private int code;
    private String message;
    private T data;
    ...
} 
```

> 更讲究的，可能会定义出好几种不同的 Result：**SingleResult**、**ListResult**、**SliceResult** 。

但是如果返回的 data 中的数据项少于三个，很多人可能就不会为 T 去定义 DTO 类，而是直接偷懒使用 Map。例如：Result<Map<String, Object>> 。

这种情况下，knife4j 无法通过注解生成文档。所以，不要偷懒。

- 自定义 DTO 类

~~~java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel
public class Student {

    @ApiModelProperty(value = "姓名", example = "张三")
    private String name;

    @ApiModelProperty(value = "性别", example = "男")
    private String sex;

    @ApiModelProperty(value = "年龄", example = "20")
    private int age;
}
~~~

- 自定义 Result

~~~java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel
public class Result<T> {

    @ApiModelProperty(value = "响应状态码", example = "200")
    private int code;

    @ApiModelProperty(value = "响应状态信息", example = "success")
    private String message;

    @ApiModelProperty(value = "响应数据")
    private T data;
}
~~~

```JAVA
@PostMapping("/test2")
public Result<List<Student>> test2(){
    Student student1 = new Student("zhangsan","男",1);
    Student student2 = new Student("lisi","女",2);
    List<Student> students = new ArrayList<>();
    students.add(student1);
    students.add(student2);

    return new Result<>(200,students);
}
```



### 实现Gateway统一Swagger入口

参考: [实现Gateway网关统一Swagger入口_通过网关访问swagger_在写bug的路上越走越远的博客-CSDN博客](https://blog.csdn.net/qq_34031691/article/details/121507887)

#### Swagger 配置

```java
package com.apai.config;

import io.swagger.annotations.Api;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static springfox.documentation.builders.RequestHandlerSelectors.withClassAnnotation;

@Configuration
@EnableSwagger2  //启用swagger功能
@Import(BeanValidatorPluginsConfiguration.class) // 可不加 防止意外
public class SwaggerConfig {

    //Docket用来定义swagger文档的一些属性，
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                // 定义是否开启swagger，false为关闭，可以通过变量控制，线上关闭
                .enable(true)
                // 配置api文档元信息
                .apiInfo(apiInfo())
                // 选择哪些接口作为swagger的doc发布
                .select()
                // apis() 控制哪些接口暴露给swagger
                // .apis(RequestHandlerSelectors.any()) //所有都暴露
                // .apis(withMethodAnnotation(ApiOperation.class)) //标记有这个注解 ApiOperation
                 .apis(RequestHandlerSelectors.basePackage("com.apai.controller")) //指定包位置
                // .apis(withClassAnnotation(Api.class))
                .paths(PathSelectors.any())
                .build();
    }

    // 生成接口文档的基本信息
    private ApiInfo apiInfo() {
        String title = "阿派系统接口说明";
        return new ApiInfoBuilder().title(title)
                .description("接口文档")
                //.termsOfServiceUrl("http://localhost:8080/doc.html")
                .version("1.0")
                .build();
    }
}
```

#### Gateway 配置

```java
package com.apai.config;

/**
 * @author Apai
 * @version V1.0: swagger分组枚举类 
 * @date 2023-03-18 11:10
 */
public enum ServerRouteEnum {

	// (路由ID, 分组名称)用于swagger分组 注意: 该枚举类中的路由ID必须与gateway中的路由ID一致
	WXAPPLET("wxapplet", "微信模块接口文档"),
	WXGZHAPP("wxgzhapp", "公众号模块接口文档"),
	SPAIDAXING("spaidaxinga", "网页模块接口文档");
	
	// 路由ID
	private String routeId;
	// 分组名称
	private String groupName;
	
	ServerRouteEnum(String routeId, String groupName) {
		this.routeId = routeId;
		this.groupName = groupName;
	}
	
	/**
	 * 根据路由id获取swagger信息
	 *
	 * @param routId 路由id
	 * @return swagger信息
	 */
	public static String getSwaggerInfoByRoutId(String routId) {
		for (ServerRouteEnum routeEnum : ServerRouteEnum.values()) {
			if (routId.equals(routeEnum.getRouteId())) {
				return routeEnum.getGroupName();
			}
		}
		return null;
	}
	
	/**
	 * @return
	 */
	public String getRouteId() {
		return routeId;
	}
	
	/**
	 * @param routeId 路由ID
	 */
	public void setRouteId(String routeId) {
		this.routeId = routeId;
	}
	
	/**
	 * @return
	 */
	public String getGroupName() {
		return groupName;
	}
	
	/**
	 * @param groupName
	 */
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
}

```

```java
package com.apai.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.cloud.gateway.config.GatewayProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.support.NameUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Apai
 * @version V1.0: swagger分组配置类
 * @date 2023-03-18 11:10
 */
@Component
@Primary
public class SwaggerResourceConfig implements SwaggerResourcesProvider {

	// swagger2默认的url后缀 注意: 3.0的是/v3/api-docs
	public static final String API_URI = "/v2/api-docs";
	private final RouteLocator routeLocator;
	private final GatewayProperties gatewayProperties;

	public SwaggerResourceConfig(RouteLocator routeLocator, GatewayProperties gatewayProperties) {
		this.routeLocator = routeLocator;
		this.gatewayProperties = gatewayProperties;
	}

	@Override
	public List<SwaggerResource> get() {
		List<SwaggerResource> resources = new ArrayList<>();
		List<String> routes = new ArrayList<>();
		// 取出gateway的route
		routeLocator.getRoutes().subscribe(route -> routes.add(route.getId()));
		// 结合配置的route-路径(Path)，和route过滤，只获取在枚举中说明的route节点
		gatewayProperties.getRoutes().stream().filter(routeDefinition -> routes.contains(routeDefinition.getId()))
				.forEach(routeDefinition -> routeDefinition.getPredicates().stream()
						// 目前只处理Path断言  Header或其他路由需要另行扩展
						.filter(predicateDefinition -> ("Path").equalsIgnoreCase(predicateDefinition.getName()))
						.forEach(predicateDefinition -> {
									String routeId = routeDefinition.getId();
									String swaggerInfo = ServerRouteEnum.getSwaggerInfoByRoutId(routeId);
									if (StringUtils.isNotEmpty(swaggerInfo)) {
										Map<String, String> args = predicateDefinition.getArgs();
										String s = args.get(NameUtils.GENERATED_NAME_PREFIX + "0");
										resources.add(swaggerResource(swaggerInfo, predicateDefinition.getArgs().get(NameUtils.GENERATED_NAME_PREFIX + "0").replace("/**", API_URI)));
									}
								}
						));
		return resources;
	}
	
	private SwaggerResource swaggerResource(String name, String location) {
		SwaggerResource swaggerResource = new SwaggerResource();
		swaggerResource.setName(name);
		swaggerResource.setLocation(location);
		swaggerResource.setSwaggerVersion("3.0");
		return swaggerResource;
	}
	
}
```

#### 微服务 配置

```yaml
## 配置swagger在getway网关中测试接口的请求的路径
springfox:
    documentation:
        open-api:
            v2:
                ## path: /网关的转发路径/版本v2或者v3/api-docs
                path: /wxapplet/v2/api-docs
```

## 防坑指南

* swagger 正常是不用走网关的
* 忽略字段的显示 | 一定要先添加配置

