---
title: SpringSecurity 安全框架
date: 2023/03/26
---

## Spring security 安全框架

### Spring security 依赖

```xml
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
<!--jwt 加密 token 生成-->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.8.1</version>
</dependency>
```



### Spring security 流程

1.先进行设置 登录的请求[ /login ]和表单账号[ username ] 密码[ password ]的name属性来进行获取登录的数据

2.用户密码校验 和 获取用户权限 储存至Spring security上下文

3.登陆成功处理器 将token(设置在redis的过期时间)和权限储存到redis

4.自定义过滤器 根据token合法不为空且和redis的一致 则进行续期 在查询用户权限储存上下文

6.鉴权 访问请求接口



## Spring security 匿名访问

> 即: 不带上token直接可访问接口 

#### 简介

**场景:** 作用于不登录的情况可直接访问的接口

**原理:** 获取接口的请求路径 然后在 Spring security 所有的过滤器放行

**解决方法:** 定义注解获取接口的请求路径 在自定义过滤器将token为空的放行 内置的过滤器先获取放行的请求路径集合进行放行

#### 定义注解

> 可加载web请求接口是获取该接口的请求路径

```java
package com.apai.util;

import java.lang.annotation.*;

/**
 * 可加载web请求接口是获取该接口的请求路径
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AnonymousAccess {

}
```

#### 使用注解

> 指定接口可无需登录直接访问

```java
@GetMapping("/cc")
@AnonymousAccess
public Object b() {
    return "cc";
}
```

#### JwtTokenFilter 自定义过滤器

> 匿名访问无需带上 token 则 当token为空时直接放行

```java
package com.apai.config.security;

import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private MyAuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private IUserService userService;
    
    @Autowired
    private ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");

        // 匿名访问的请求路径进行放行
        String[] anonymousUrls = getAnonymousUrls();
        for (String anonymousUrl : anonymousUrls) {
            if (path.contains(anonymousUrl)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // 获取校验 token 的结果
        String checkToken = JwtTokenUtil.checkToken(token);
        // token 不为空，校验合法
        if (!checkToken.equals(ResultCode.TOKEN_INVALID_EXCEPTION.getMessage())) {

            // 根据 token 获取用户名称
            String username = JwtTokenUtil.getUsername(token);
            // 根据 用户名称+token的key 在redis获取token
            String redisToken = stringRedisTemplate.opsForValue().get(username + ":token");

            // 请求头的token 和 redis的token一致 则进行续期
            if (token.equals(redisToken)) {
                // redis的 token 续期
                stringRedisTemplate.opsForValue().set(username + ":token", token, JwtTokenUtil.EXPIRE_TIME * 2, TimeUnit.MILLISECONDS);
            }else{
                // redis的token过期被删除则无法续期 提示过期
                response.setContentType("application/json;charset=utf-8");
                PrintWriter out = response.getWriter();
                ResponseResult result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
                out.write(new ObjectMapper().writeValueAsString(result));
                out.flush();
                out.close();
                return;
            }

            // 3. 根据 用户名 获取redis的用户权限
           String str = stringRedisTemplate.opsForValue().get(username);
            List<String> perms = new ArrayList<>();
            if (!StringUtils.isEmpty(str)) {
                perms = new ObjectMapper().readValue(str, new TypeReference<List<String>>() {  });
            }

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(item -> list.add(new SimpleGrantedAuthority(item)));

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);
            // 5. 装入security 容器中
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // 6.继续放行
            filterChain.doFilter(request, response);
        } else {
            // 不合法
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            ResponseResult result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);
            out.write(new ObjectMapper().writeValueAsString(result));
            out.flush();
            out.close();
            return;
        }

    }
    
    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的 RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}
```

#### WebSecurityConfig

> 定义方法 根据注解获取所有匿名接口的请求集合 并将其全部放行
>
> 带上注解的匿名接口可直接访问 其他的接口不带token则全部报错 500

```java
package com.apai.config.security;

import com.apai.util.AnonymousAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;


// springsecurity 的认证
// @Configuration
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

    // 注入 获取匿名接口请求集合使用
    @Autowired
    private ApplicationContext applicationContext;

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
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {


        // 鉴权认证配置 鉴权的请求
        http.authorizeRequests() 
                // 允许通过的请求
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico").permitAll() 
                // 匿名接口的使用请求都进行放行
                .antMatchers(getAnonymousUrls()).anonymous()
                // 除了什么配置 其他的需要登录访问
                .anyRequest().authenticated(); 

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                .usernameParameter("username").passwordParameter("password") // 登录的表单参数
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

    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}

```





## 密码加密与验证

加密: String encode1 = passwordEncoder.encode("密码");

核对: boolean matches1 = passwordEncoder.matches("密码", "已加密的密码");

### EncoderConfig 配置类

> config 配置包 security  包下

```java
package com.apai.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 密码加密
@Configuration
public class EncoderConfig {
    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
```

### 密码测试 API

**注意:** 

* com.apai 层级  或者  @SpringBootTest(classes = {ApplicationMybatis.class})
* Spring security 安全框架 默认在登录时也是使用该加密的进行解密校验密码的是否正确

```java
package com.apai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
public class SpringTest {
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    public void test() {
        String encode1 = passwordEncoder.encode("123456");
        String encode2 = passwordEncoder.encode("123456");
        System.out.println(encode1);
        System.out.println(encode2);

        boolean matches1 = passwordEncoder.matches("123456", "$2a$10$Zoe34UAkP6QGcH8oFwz0iO0iVhPZlNkHg8QzytxmqWnVWdKP9TD5O");
        boolean matches2 = passwordEncoder.matches("123456", "$2a$10$Zoh/7WHg6wUlq6P.UHtHiu.VTOzm5Lj0ULLlfAWJDFb2EAHYKUPVC");
        System.out.println(matches1);
        System.out.println(matches2);
    }
}

```





## JWT_Token 凭证

### JWT 简介

JWT全称是Json Web Token， 是JSON风格轻量级的授权和身份认证规范，可实现无状态、分布式的Web应用授权；官网：https://jwt.io   

### Token 数据格式

**例如:** 

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJwYWlkYXhpbmciLCJleHAiOjE2NjExMTc1Mzl9.1MefvfoNINq1kXpSLovcQDPyEUmm00vpqdhHYE_OPx8
```

JWT包含三部分数据：

- Header：头部，通常头部有两部分信息：

  - 声明类型，这里是JWT  自描述信息,其中就有你什么时候生成的token（生成时间）

  > 我们会对头部进行base64编码，得到第一部分数据    base64编码和解码的

- Payload：载荷，就是有效数据，一般包含下面信息：

  - 用户身份信息（注意，这里因为采用base64编码，可解码 是可逆的，因此不要存放敏感信息）
  - 注册声明：如token的签发时间，过期时间，签发人等  这部分内容    好比身份证的信息

  > 这部分也会采用base64编码，得到第二部分数据

- Signature：签名，是整个数据的认证信息。一般根据前两步的数据，再加上服务的密钥（secret）（不要泄漏，最好周期性更换），通过加密算法（不可逆的）生成一个签名。用于验证整个数据完整和可靠性。



### Token 续期问题

> 即: 只校验token存放在redis的过期时间, token只校验是否合法, 在token未过期的情况下用户进行了操作而延长token的过期时间, 防止token到期了而用户还在进行操作被强制退出需再次登录的情况发生

#### 登录获取权限

> 1.登录在数据库里获取用户的权限集合 储存在Spring security的上下文里

#### 登录成功储存 Token

> 2.登录成功处理器 拿到上下文的权限集合一用户名储存至redis | token以用户名:token 储存到redis设置过期时间

```java
package com.apai.config.security;

import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;


// 自定义登录成功处理器
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 登录成功 配置
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 根据登录的表单name获取用户账号
        String username = request.getParameter("username");

        String token = "";
        try {
            // 根据用户账号生成token.返回给前端，同时我们还可以把该用户的权限标识符查询出来存到redis
            token = JwtTokenUtil.createToken(username);
            List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>)authentication.getAuthorities();
            List<String> strs = new ArrayList<>();
            authorities.forEach(item-> strs.add(item.getAuthority()));

            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            ops.set(authentication.getName(),new ObjectMapper().writeValueAsString(strs));

            //把token存到redis，为了后面续期，也不一定要2倍，只要是比token有效期长即可
            ops.set(authentication.getName()+":token",token,JwtTokenUtil.EXPIRE_TIME*2, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseResult<String> success = new ResponseResult<>(token, "登录成功", 200);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}
```

#### 过滤器续期 Token

> 3.自定义过滤器 判断请求的token不为空且合法在对比redis的token是一致则再次储存刷新其过期时间

```java
package com.apai.config.security;

import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private MyAuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private IUserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");

        // 2. 校验这个token是否为null
        if (StringUtils.isEmpty(token)) {
            // 放行
            filterChain.doFilter(request, response);
            return;
        }

        // 获取校验 token 的结果
        String checkToken = JwtTokenUtil.checkToken(token);
        // token 不为空，校验合法
        if (!checkToken.equals(ResultCode.TOKEN_INVALID_EXCEPTION.getMessage())) {

            // 根据 token 获取用户名称
            String username = JwtTokenUtil.getUsername(token);
            // 根据 用户名称+token的key 在redis获取token
            String redisToken = stringRedisTemplate.opsForValue().get(username + ":token");

            // 请求头的token 和 redis的token一致 则进行续期
            if (token.equals(redisToken)) {
                // redis的 token 续期
                stringRedisTemplate.opsForValue().set(username + ":token", token, JwtTokenUtil.EXPIRE_TIME * 2, TimeUnit.MILLISECONDS);
            }else{
                // redis的token过期被删除则无法续期 提示过期
                response.setContentType("application/json;charset=utf-8");
                PrintWriter out = response.getWriter();
                ResponseResult result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
                out.write(new ObjectMapper().writeValueAsString(result));
                out.flush();
                out.close();
                return;
            }

            // 3. 根据 用户名 获取redis的用户权限
           String str = stringRedisTemplate.opsForValue().get(username);
            List<String> perms = new ArrayList<>();
            if (!StringUtils.isEmpty(str)) {
                perms = new ObjectMapper().readValue(str, new TypeReference<List<String>>() {  });
            }

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(item -> list.add(new SimpleGrantedAuthority(item)));

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);
            // 5. 装入security 容器中
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // 6.继续放行
            filterChain.doFilter(request, response);
        } else {
            // 不合法
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            ResponseResult result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);
            out.write(new ObjectMapper().writeValueAsString(result));
            out.flush();
            out.close();
            return;
        }

    }
}
```

### Token 工具类

#### Token 工具一

> 将校验token的返回值改成 布尔 

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        // 传入 用户名 封装生成 token
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);
        // 将 toke 裁剪成数组
        String[] strarr = token.split("\\.");
        // 解析 第一部分 header{"typ":"JWT","alg":"HS256"}
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        // 解析 第二部分 claims{"aud":"paidaxing","exp":1659625894}
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));
        // 根据 token 的过期时间判断
        while (checkToken(token)){
            System.out.println("是否过期: " + checkToken(token));
            System.out.println("过期时间-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}
```

#### Token 工具二

> 将校验token的返回值改成对应的string提示

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    public static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     *
     * @param token
     * @return
     */
    public static String checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return ResultCode.SUCCESS.getMessage();
        } catch (JWTVerificationException e) {
            if(e instanceof JWTDecodeException){
                return ResultCode.TOKEN_INVALID_EXCEPTION.getMessage();
            }else{
                return ResultCode.USER_ACCOUNT_EXPIRED.getMessage();
            }
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

//        while (checkToken(token)){
//            System.out.println("-------" + System.currentTimeMillis());
//            Thread.sleep(1000);
//        }
    }
}
```





## Spring security 执行代码

### Security 基础款

> Spring security 基础配置

#### 配置包 | config . security

##### **登录成功处理器**

> MyAuthenticationSuccessHandler

```java
package com.apai.config.security;

import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


// 自定义登录成功处理器
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    // 登录成功 配置
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 特别注意: 根据 请求的账号的key称获取 账号名称 | 获取的登录账号名 如果为获取为null 则生成的token在后续的校验报 空指针异常
        String username = request.getParameter("username");
        // 生成token.返回给前端，同时我们还可以把该用户的权限标识符查询出来存到redis
        String token = JwtTokenUtil.createToken(username);

        ResponseResult<String> success = new ResponseResult<>(token, "登录成功", 200);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}
```

##### **登录出错 处理器**

> MyAuthenticationFailureHandler
>
> 登录出错 异常配置

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("登录错误", exception);

        ResponseResult result = null;

        if(exception instanceof UsernameNotFoundException) {                    //用户名不存在
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_NOT_EXIST);
        } else if (exception instanceof AccountExpiredException) {              //账号过期
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
        } else if (exception instanceof BadCredentialsException) {              //凭证不对   错误
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_ERROR);
        } else if (exception instanceof CredentialsExpiredException) {          //密码过期
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_EXPIRED);
        } else if (exception instanceof DisabledException) {                    //账号不可用
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_DISABLE);
        } else if (exception instanceof LockedException) {                      //账号锁定
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_LOCKED);
        } else if(exception instanceof MyTokenIsNullException) {
            result = ResponseResult.error(ResultCode.TOKEN_IS_NULL);            // token 为空
        } else if(exception instanceof MyTokenIsInvalidException) {
            result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);  // token 不合法
        } else {
            result = ResponseResult.error(ResultCode.COMMON_FAIL);
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}

```

##### **用户未登录处理器**

> MyAuthenticationEntryPoint
>
> 用户未登录 跳转主页面异常配置
>
> 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // 用户未登录 直接跳转主页面异常配置
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 下三行
        ResponseResult<String> success = new ResponseResult<String>("", "用户未登陆", 502);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### 账号退出处理器

> MyLogoutSuccessHandLer
>
> 前后端分离 则无需后台请求 组件清除浏览器的token

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 账号退出
 * 前后端分离 则无需后台请求 组件清除浏览器的token
 */

@Component
public class MyLogoutSuccessHandLer implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/json; charset=UTF-8");
        ResponseResult<Void> result = new ResponseResult<>(200, "退出成功");
        response . getWriter() . write (new ObjectMapper().writeValueAsString (result));
    }
}

```

##### **鉴权处理器 **

> MyAccessDeniedHandler | @PreAuthorize("hasAuthority('权限符内容')")  
>
> 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
>
> 权限的 list 集合为 string 类型 进行储存

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAccessDeniedHandler implements AccessDeniedHandler {
    // 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult<String> noPermission = ResponseResult.error(ResultCode.NO_PERMISSION);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(noPermission));
    }
}
```

> 在表现层加上鉴权 注解

```java
@Controller
public class HollerController {

    @RequestMapping("/home")
    // 鉴权 先查询然后跟注解判断 如果一致则允许访问 反之则不行
    @PreAuthorize("hasAuthority('teacher:list')") 
    public String home() {
        return "home";
    }
}
```

##### 微服务调用自带 token 

微服务 Open Feign 远程调用组件 在调用对方请求获取数据时 如果该微服务使用的security安全框架

则必须在 请求头带上token 否则无法访问  

* FeignLogConfiguration 在 Open Feign 远程调用对方请求获取数据时自动获取token并放入请求头在调用对方的微服务请求
* 在  Open Feign  的请求接口带上 token  在调用接口时手动获取token在传入接口调用对方的微服务请求
* 全局的配置类 从请求头获取token 如果不是请求触发的 微服务远程调用请求头没有token则包 null 空指针异常

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

##### JwtTokenFilter 过滤器

> 在未登录的情况下 但携带了正确且合法的 token 则直接放行 请求
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 作为 微服务 只需验证 token 的合法性 在获取权限的集合时只需要在 Redis 获取 无需查询数据库

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");
        
        // swagger放行
        String path = request.getRequestURI();
        if (path.contains("doc.html") || path.contains(".js") || path.contains(".css")
                || path.contains("swagger-resources") || path.contains("api-docs") || path.contains("favicon.ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. 校验这个token是否为null
        if (StringUtils.isEmpty(token)) {
            String uri = request.getRequestURI().toString();
            if (uri.equals("/login") || uri.equals("/login.html") || uri.startsWith("/js/") || uri.startsWith("/css/")  || uri.startsWith("/img/") || uri.equals("/favicon.ico")) {
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
            String username = JwtTokenUtil.getUsername(token);
            // 3. 根据用户名查询数据库，获取用户的权限集合
            List<String> perms = userService.selectPermscodeByUserame(username);

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(perm -> {
                GrantedAuthority authority = new SimpleGrantedAuthority(perm);
                list.add(authority);
            });

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);

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



##### Security  配置类

> WebSecurityConfig
>
> 各种处理器 都依靠 Security  配置类 进行对应的跳转校验
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 登录的默认请求 POST | 路径 /login  携带的 账号 密码 的请求可自定义 如需更改需三处同步更改

```java 
package com.apai.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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
        // super.configure(web);
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
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico").permitAll() // 允许通过的请求
                .anyRequest().authenticated(); // 除了什么配置 其他的需要登录访问

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
            	// 登录的表单参数key | 可对应的更改
                .usernameParameter("username").passwordParameter("password") 
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

##### 密码校验 | 权限集合获取

> 进行密码的校验 注意: 在密码校验是 将数据库的密码进行MD6解析的加密密码  而不是直接对比校验
>
> 权限的集合 直接为 字符串的集合 进行储存

```java
package com.apai.config.security;

import com.apai.entity.User;
import com.apai.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    // 获取到用户的业务层对象实例 用来调用mapper方法获取数据
    @Autowired
    private IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        QueryWrapper wrapper = new QueryWrapper();
        wrapper.eq("username", username);
        User user = userService.getOne(wrapper);
        if(user == null) {
            // 证明没有这个用户
            throw new UsernameNotFoundException("用户不存在");
        }
        //如果用户存在，则还要比较密码
        String password = user.getPassword(); // 数据库存储的密码

        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        // 基于用户名查询用户的权限集合
        List<String> permcodeList = userService.selectPermscodeByUserame(username);
        permcodeList.forEach(permcode -> {
            grantedAuthorityList.add(new SimpleGrantedAuthority(permcode));
        });

        return new org.springframework.security.core.userdetails.User(username, password, grantedAuthorityList);
    }
}
```

#### 工具类 - util

##### JwtTokenUtil

> 生成 token | token 校验 | 根据 token 获取username | 测试

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        // 传入 用户名 封装生成 token
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);
        // 将 toke 裁剪成数组
        String[] strarr = token.split("\\.");
        // 解析 第一部分 header{"typ":"JWT","alg":"HS256"}
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        // 解析 第二部分 claims{"aud":"paidaxing","exp":1659625894}
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));
        // 根据 token 的过期时间判断
        while (checkToken(token)){
            System.out.println("是否过期: " + checkToken(token));
            System.out.println("过期时间-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}

```

##### **ResponseResult**

```java
package com.apai.util;

import lombok.Data;

@Data
public class ResponseResult<T> {
    private int status;
    private String msg;
    private T data;

    public ResponseResult(){}

    public ResponseResult(int status, String msg){
        this.status = status;
        this.msg = msg;
    }
    public ResponseResult(T data, String msg, int status){
        this(status,msg);
        this.data = data;
        this.msg = msg;
    }

    public static ResponseResult ok(){
        ResponseResult result = new ResponseResult();
        result.setStatus(ResultCode.SUCCESS.getCode());
        result.setMsg(ResultCode.SUCCESS.getMessage());
        return result;
    }

    public static ResponseResult error(ResultCode resultCode){
        ResponseResult result = new ResponseResult();
        result.setStatus(resultCode.getCode());
        result.setMsg(resultCode.getMessage());
        return result;
    }

    public static ResponseResult<Void> SUCCESS = new ResponseResult<>(200,"成功");
    public static ResponseResult<Void> INTEVER_ERROR = new ResponseResult<>(500,"服务器错误");
    public static ResponseResult<Void> NOT_FOUND = new ResponseResult<>(404,"未找到");

}

```

##### **ResultCode**

```java
package com.apai.util;

public enum ResultCode {

    /*
    400 参数错误
    401 没权限
    403 请求方式不支持 get post
    404 url找不到资源
    500 内部程序错误
    503 网关错误
     */

    /* 成功 */
    SUCCESS(200, "成功"),

    /* 默认失败 */
    COMMON_FAIL(999, "失败"),

    /* 参数错误：1000～1999 */
    PARAM_NOT_VALID(1001, "参数无效"),
    PARAM_IS_BLANK(1002, "参数为空"),
    PARAM_TYPE_ERROR(1003, "参数类型错误"),
    PARAM_NOT_COMPLETE(1004, "参数缺失"),

    /* 用户错误 */
    USER_NOT_LOGIN(2001, "用户未登录"),
    USER_ACCOUNT_EXPIRED(2002, "账号已过期"),
    USER_CREDENTIALS_ERROR(2003, "密码错误"),
    USER_CREDENTIALS_EXPIRED(2004, "密码过期"),
    USER_ACCOUNT_DISABLE(2005, "账号不可用"),
    USER_ACCOUNT_LOCKED(2006, "账号被锁定"),
    USER_ACCOUNT_NOT_EXIST(2007, "账号不存在"),
    USER_ACCOUNT_ALREADY_EXIST(2008, "账号已存在"),
    USER_ACCOUNT_USE_BY_OTHERS(2009, "您的登录已经超时或者已经在另一台机器登录，您被迫下线"),
    TOKEN_IS_NULL(2010,"TOKEN为空"),
    TOKEN_INVALID_EXCEPTION(2011,"TOKEN非法"),

    /* 业务错误 */
    NO_PERMISSION(4001, "没有权限"),

    /*部门错误*/
    DEPARTMENT_NOT_EXIST(5007, "部门不存在"),
    DEPARTMENT_ALREADY_EXIST(5008, "部门已存在"),

    /*运行时异常*/
    ARITHMETIC_EXCEPTION(9001,"算数异常"),
    NULL_POINTER_EXCEPTION(9002,"空指针异常"),
    ARRAY_INDEX_OUTOfBOUNDS_EXCEPTION(9003,"数组越界");


    ResultCode(Integer code, String message){
        this.code = code;
        this.message = message;
    }

    private Integer code;
    public Integer getCode() {
        return code;
    }

    private String message;
    public String getMessage() {
        return message;
    }

}
```

**JwtTokenUtil**

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

        while (checkToken(token)){
            System.out.println("-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}
```

#### exception - 异常包

##### MyTokenIsInvalidException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsInvalidException extends AuthenticationException {
    public MyTokenIsInvalidException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsInvalidException(String msg) {
        super(msg);
    }
}
```

##### MyTokenIsNullException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsNullException extends AuthenticationException {
    public MyTokenIsNullException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsNullException(String msg) {
        super(msg);
    }
}
```

#### 自定义登录页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
    <script src="js/vue.js"></script>
    <script src="js/axios.min.js"></script>
</head>
<body>

<div id="app">
    <p>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username">
    </p>
    <p>
        <label for="password">密码:</label>
        <input type="text" id="password" v-model="password">
    </p>
    <button type="button" @click="submit">登录</button>
    <button type="button" @click="logout">退出</button>


    <hr>

    <input type="button" value="jwt测试" @click="testJwt">
</div>

<script>
    const vm = new Vue({
        el: '#app',
        data: {
            username: '',
            password: ''
        },
        methods: {
            // 登录
            submit: function() {
                let _this = this;
                axios.post('/login', 'username='+_this.username+'&password=' + _this.password, {headers:{"Content-Type":"application/x-www-form-urlencoded"}})
                    .then(function (res) {
                        if(res.data.status == 200) {
                            window.localStorage.setItem("token", res.data.data);
                            alert("登录成功");
                        } else {
                            alert("登录失败");
                        }
                    });

            },
			// 退出
            logout() {
                window.localStorage.removeItem("token");
                // axios.post('/logout')
                //     .then(function (res) {
                //         window.localStorage.removeItem("token");
                //     });
            },

            testJwt: function() {
                axios.get('/user/testJwt', {headers:{token:window.localStorage.getItem("token")}})
                    .then(function(res) {
                        console.log(res);
                    });
            }
        }
    });
</script>

</body>
</html>
```



### Security  续期 | 匿名

> 配置了 token的续期 和  匿名接口的请求直接访问

#### 配置包 | config . security

##### **登录成功处理器**

> MyAuthenticationSuccessHandler

* 根据 用户 获取上下文的权限集合 并以用户名储存到 redis 里
* 以 用户名:token 将生成的 token 储存到 redis 里 并设置该数据在redis的过期时间
* 最后将token返回到前端

```java
package com.apai.config.security;

import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;


// 自定义登录成功处理器
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 登录成功 配置
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 根据登录的表单name获取用户账号
        String username = request.getParameter("username");

        String token = "";
        try {
            // 根据用户账号生成token.返回给前端，同时我们还可以把该用户的权限标识符查询出来存到redis
            token = JwtTokenUtil.createToken(username);
            // 获取上下文权限集合
            List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>)authentication.getAuthorities();
            // 创建字符串集合 存入遍历的权限集合
            List<String> strs = new ArrayList<>();
            authorities.forEach(item-> strs.add(item.getAuthority()));
			// 获取redis字符串对象
            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            // 把权限字符串集合存入redis里
            ops.set(authentication.getName(),new ObjectMapper().writeValueAsString(strs));
            // 把token存到redis，为了后面续期，也不一定要2倍，只要是比token有效期长即可
            ops.set(authentication.getName()+":token",token,JwtTokenUtil.EXPIRE_TIME*2, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseResult<String> success = new ResponseResult<>(token, "登录成功", 200);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### **登录出错 处理器**

> MyAuthenticationFailureHandler
>
> 登录出错 异常配置

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("登录错误", exception);

        ResponseResult result = null;

        if(exception instanceof UsernameNotFoundException) {                    //用户名不存在
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_NOT_EXIST);
        } else if (exception instanceof AccountExpiredException) {              //账号过期
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
        } else if (exception instanceof BadCredentialsException) {              //凭证不对   错误
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_ERROR);
        } else if (exception instanceof CredentialsExpiredException) {          //密码过期
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_EXPIRED);
        } else if (exception instanceof DisabledException) {                    //账号不可用
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_DISABLE);
        } else if (exception instanceof LockedException) {                      //账号锁定
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_LOCKED);
        } else if(exception instanceof MyTokenIsNullException) {
            result = ResponseResult.error(ResultCode.TOKEN_IS_NULL);            // token 为空
        } else if(exception instanceof MyTokenIsInvalidException) {
            result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);  // token 不合法
        } else {
            result = ResponseResult.error(ResultCode.COMMON_FAIL);
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}

```

##### **用户未登录处理器**

> MyAuthenticationEntryPoint
>
> 用户未登录 跳转主页面异常配置
>
> 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // 用户未登录 直接跳转主页面异常配置
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 下三行
        ResponseResult<String> success = new ResponseResult<String>("", "用户未登陆", 502);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### 账号退出处理器

> MyLogoutSuccessHandLer
>
> 前后端分离 则无需后台请求 组件清除浏览器的token

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 账号退出
 * 前后端分离 则无需后台请求 组件清除浏览器的token
 */

@Component
public class MyLogoutSuccessHandLer implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/json; charset=UTF-8");
        ResponseResult<Void> result = new ResponseResult<>(200, "退出成功");
        response . getWriter() . write (new ObjectMapper().writeValueAsString (result));
    }
}

```

##### **鉴权处理器 **

> MyAccessDeniedHandler | @PreAuthorize("hasAuthority('权限符内容')")  
>
> 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
>
> 权限的 list 集合为 string 类型 进行储存

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAccessDeniedHandler implements AccessDeniedHandler {
    // 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult<String> noPermission = ResponseResult.error(ResultCode.NO_PERMISSION);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(noPermission));
    }
}
```

> 在表现层加上鉴权 注解

```java
@Controller
public class HollerController {

    @RequestMapping("/home")
    // 鉴权 先查询然后跟注解判断 如果一致则允许访问 反之则不行
    @PreAuthorize("hasAuthority('teacher:list')") 
    public String home() {
        return "home";
    }
}
```

##### 微服务调用自带 token 

微服务 Open Feign 远程调用组件 在调用对方请求获取数据时 如果该微服务使用的security安全框架

则必须在 请求头带上token 否则无法访问  

* FeignLogConfiguration 在 Open Feign 远程调用对方请求获取数据时自动获取token并放入请求头在调用对方的微服务请求
* 在  Open Feign  的请求接口带上 token  在调用接口时手动获取token在传入接口调用对方的微服务请求
* 全局的配置类 从请求头获取token 如果不是请求触发的 微服务远程调用请求头没有token则包 null 空指针异常

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

##### JwtTokenFilter 过滤器

* 在未登录的情况下 但携带了正确且合法的 token 则直接放行 请求

* 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类

* 作为 微服务 只需验证 token 的合法性 在获取权限的集合时只需要在 Redis 获取 无需查询数据库
* token 为空进行放行 且在后方进行 设置匿名接口访问
* 当 token 合法不为空 在与redis的token对比一致 则将redis的token再次储存 刷新其过期时间

```java
package com.apai.config.security;

import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private MyAuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private IUserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");

        // 2. 校验这个token是否为null
        if (StringUtils.isEmpty(token)) {
            // 放行
            filterChain.doFilter(request, response);
            return;
        }

        // 获取校验 token 的结果
        String checkToken = JwtTokenUtil.checkToken(token);
        // token 不为空，校验合法
        if (!checkToken.equals(ResultCode.TOKEN_INVALID_EXCEPTION.getMessage())) {

            // 根据 token 获取用户名称
            String username = JwtTokenUtil.getUsername(token);
            // 根据 用户名称+token的key 在redis获取token
            String redisToken = stringRedisTemplate.opsForValue().get(username + ":token");

            // 请求头的token 和 redis的token一致 则进行续期
            if (token.equals(redisToken)) {
                // redis的 token 续期
                stringRedisTemplate.opsForValue().set(username + ":token", token, JwtTokenUtil.EXPIRE_TIME * 2, TimeUnit.MILLISECONDS);
            }else{
                // redis的token过期被删除则无法续期 提示过期
                response.setContentType("application/json;charset=utf-8");
                PrintWriter out = response.getWriter();
                ResponseResult result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
                out.write(new ObjectMapper().writeValueAsString(result));
                out.flush();
                out.close();
                return;
            }

            // 3. 根据 用户名 获取redis的用户权限
           String str = stringRedisTemplate.opsForValue().get(username);
            List<String> perms = new ArrayList<>();
            if (!StringUtils.isEmpty(str)) {
                perms = new ObjectMapper().readValue(str, new TypeReference<List<String>>() {  });
            }

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(item -> list.add(new SimpleGrantedAuthority(item)));

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);
            // 5. 装入security 容器中
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // 6.继续放行
            filterChain.doFilter(request, response);
        } else {
            // 不合法
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            ResponseResult result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);
            out.write(new ObjectMapper().writeValueAsString(result));
            out.flush();
            out.close();
            return;
        }

    }
}
```



##### Security  配置类

> WebSecurityConfig
>
> 各种处理器 都依靠 Security  配置类 进行对应的跳转校验
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 登录的默认请求 POST | 路径 /login  携带的 账号 密码 的请求可自定义 如需更改需三处同步更改
>
> 根据自定义注解获取所有匿名的接口请求路径 然后所有都进行放行 直接访问

```java 
package com.apai.config.security;

import com.apai.util.AnonymousAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;


// springsecurity 的认证
// @Configuration
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

    // 注入 获取匿名接口请求集合使用
    @Autowired
    private ApplicationContext applicationContext;

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
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {


        // 鉴权认证配置 鉴权的请求
        http.authorizeRequests()
                // 允许通过的请求
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico").permitAll()
                // 匿名接口的使用请求都进行放行
                .antMatchers(getAnonymousUrls()).anonymous()
                // 除了什么配置 其他的需要登录访问
                .anyRequest().authenticated();

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                .usernameParameter("username").passwordParameter("password") // 登录的表单参数
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

    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}

```

##### 密码校验 | 权限集合获取

> 进行密码的校验 注意: 在密码校验是 将数据库的密码进行MD6解析的加密密码  而不是直接对比校验
>
> 权限的集合 直接为 字符串的集合 进行储存

```java
package com.apai.config.security;

import com.apai.entity.User;
import com.apai.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    // 获取到用户的业务层对象实例 用来调用mapper方法获取数据
    @Autowired
    private IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        QueryWrapper wrapper = new QueryWrapper();
        wrapper.eq("username", username);
        User user = userService.getOne(wrapper);
        if(user == null) {
            // 证明没有这个用户
            throw new UsernameNotFoundException("用户不存在");
        }
        //如果用户存在，则还要比较密码
        String password = user.getPassword(); // 数据库存储的密码

        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        // 基于用户名查询用户的权限集合
        List<String> permcodeList = userService.selectPermscodeByUserame(username);
        permcodeList.forEach(permcode -> {
            grantedAuthorityList.add(new SimpleGrantedAuthority(permcode));
        });

        return new org.springframework.security.core.userdetails.User(username, password, grantedAuthorityList);
    }
}
```

#### 工具类 - util

##### 自定义注解

> @AnonymousAccess 

```java
package com.apai.util;

import java.lang.annotation.*;

/**
 * 可加载web请求接口是获取该接口的请求路径
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AnonymousAccess {

}
```

##### JwtTokenUtil

> 生成 token | token 校验 | 根据 token 获取username | 测试
>
> 将校验token的返回值改成对应的string提示

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    public static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     *
     * @param token
     * @return
     */
    public static String checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return ResultCode.SUCCESS.getMessage();
        } catch (JWTVerificationException e) {
            if(e instanceof JWTDecodeException){
                return ResultCode.TOKEN_INVALID_EXCEPTION.getMessage();
            }else{
                return ResultCode.USER_ACCOUNT_EXPIRED.getMessage();
            }
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

//        while (checkToken(token)){
//            System.out.println("-------" + System.currentTimeMillis());
//            Thread.sleep(1000);
//        }
    }
}

```

##### **ResponseResult**

```java
package com.apai.util;

import lombok.Data;

@Data
public class ResponseResult<T> {
    private int status;
    private String msg;
    private T data;

    public ResponseResult(){}

    public ResponseResult(int status, String msg){
        this.status = status;
        this.msg = msg;
    }
    public ResponseResult(T data, String msg, int status){
        this(status,msg);
        this.data = data;
        this.msg = msg;
    }

    public static ResponseResult ok(){
        ResponseResult result = new ResponseResult();
        result.setStatus(ResultCode.SUCCESS.getCode());
        result.setMsg(ResultCode.SUCCESS.getMessage());
        return result;
    }

    public static ResponseResult error(ResultCode resultCode){
        ResponseResult result = new ResponseResult();
        result.setStatus(resultCode.getCode());
        result.setMsg(resultCode.getMessage());
        return result;
    }

    public static ResponseResult<Void> SUCCESS = new ResponseResult<>(200,"成功");
    public static ResponseResult<Void> INTEVER_ERROR = new ResponseResult<>(500,"服务器错误");
    public static ResponseResult<Void> NOT_FOUND = new ResponseResult<>(404,"未找到");

}

```

##### **ResultCode**

```java
package com.apai.util;

public enum ResultCode {

    /*
    400 参数错误
    401 没权限
    403 请求方式不支持 get post
    404 url找不到资源
    500 内部程序错误
    503 网关错误
     */

    /* 成功 */
    SUCCESS(200, "成功"),

    /* 默认失败 */
    COMMON_FAIL(999, "失败"),

    /* 参数错误：1000～1999 */
    PARAM_NOT_VALID(1001, "参数无效"),
    PARAM_IS_BLANK(1002, "参数为空"),
    PARAM_TYPE_ERROR(1003, "参数类型错误"),
    PARAM_NOT_COMPLETE(1004, "参数缺失"),

    /* 用户错误 */
    USER_NOT_LOGIN(2001, "用户未登录"),
    USER_ACCOUNT_EXPIRED(2002, "账号已过期"),
    USER_CREDENTIALS_ERROR(2003, "密码错误"),
    USER_CREDENTIALS_EXPIRED(2004, "密码过期"),
    USER_ACCOUNT_DISABLE(2005, "账号不可用"),
    USER_ACCOUNT_LOCKED(2006, "账号被锁定"),
    USER_ACCOUNT_NOT_EXIST(2007, "账号不存在"),
    USER_ACCOUNT_ALREADY_EXIST(2008, "账号已存在"),
    USER_ACCOUNT_USE_BY_OTHERS(2009, "您的登录已经超时或者已经在另一台机器登录，您被迫下线"),
    TOKEN_IS_NULL(2010,"TOKEN为空"),
    TOKEN_INVALID_EXCEPTION(2011,"TOKEN非法"),

    /* 业务错误 */
    NO_PERMISSION(4001, "没有权限"),

    /*部门错误*/
    DEPARTMENT_NOT_EXIST(5007, "部门不存在"),
    DEPARTMENT_ALREADY_EXIST(5008, "部门已存在"),

    /*运行时异常*/
    ARITHMETIC_EXCEPTION(9001,"算数异常"),
    NULL_POINTER_EXCEPTION(9002,"空指针异常"),
    ARRAY_INDEX_OUTOfBOUNDS_EXCEPTION(9003,"数组越界");


    ResultCode(Integer code, String message){
        this.code = code;
        this.message = message;
    }

    private Integer code;
    public Integer getCode() {
        return code;
    }

    private String message;
    public String getMessage() {
        return message;
    }

}
```

**JwtTokenUtil**

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

        while (checkToken(token)){
            System.out.println("-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}
```

#### exception - 异常包

##### MyTokenIsInvalidException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsInvalidException extends AuthenticationException {
    public MyTokenIsInvalidException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsInvalidException(String msg) {
        super(msg);
    }
}
```

##### MyTokenIsNullException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsNullException extends AuthenticationException {
    public MyTokenIsNullException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsNullException(String msg) {
        super(msg);
    }
}
```

### Security  续期 匿名 验证码

#### 配置包 | config . security

##### **登录成功处理器**

> MyAuthenticationSuccessHandler

* 根据 用户 获取上下文的权限集合 并以用户名储存到 redis 里
* 以 用户名:token 将生成的 token 储存到 redis 里 并设置该数据在redis的过期时间
* 最后将token返回到前端

```java
package com.apai.config.security;

import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;


// 自定义登录成功处理器
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 登录成功 配置
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 根据登录的表单name获取用户账号
        String username = request.getParameter("username");

        String token = "";
        try {
            // 根据用户账号生成token.返回给前端，同时我们还可以把该用户的权限标识符查询出来存到redis
            token = JwtTokenUtil.createToken(username);
            // 获取上下文权限集合
            List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>)authentication.getAuthorities();
            // 创建字符串集合 存入遍历的权限集合
            List<String> strs = new ArrayList<>();
            authorities.forEach(item-> strs.add(item.getAuthority()));
            // 获取redis字符串对象
            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            // 把权限字符串集合存入redis里
            ops.set(authentication.getName(),new ObjectMapper().writeValueAsString(strs));
            // 把token存到redis，为了后面续期，也不一定要2倍，只要是比token有效期长即可
            ops.set(authentication.getName()+":token",token,JwtTokenUtil.EXPIRE_TIME*2, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseResult<String> success = new ResponseResult<>(token, "登录成功", 200);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### **登录出错 处理器**

> MyAuthenticationFailureHandler
>
> 登录出错 异常配置

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("登录错误", exception);

        ResponseResult result = null;

        if(exception instanceof UsernameNotFoundException) {                    //用户名不存在
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_NOT_EXIST);
        } else if (exception instanceof AccountExpiredException) {              //账号过期
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
        } else if (exception instanceof BadCredentialsException) {              //凭证不对   错误
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_ERROR);
        } else if (exception instanceof CredentialsExpiredException) {          //密码过期
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_EXPIRED);
        } else if (exception instanceof DisabledException) {                    //账号不可用
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_DISABLE);
        } else if (exception instanceof LockedException) {                      //账号锁定
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_LOCKED);
        } else if(exception instanceof MyTokenIsNullException) {
            result = ResponseResult.error(ResultCode.TOKEN_IS_NULL);            // token 为空
        } else if(exception instanceof MyTokenIsInvalidException) {
            result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);  // token 不合法
        } else {
            result = ResponseResult.error(ResultCode.COMMON_FAIL);
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}

```

##### **用户未登录处理器**

> MyAuthenticationEntryPoint
>
> 用户未登录 跳转主页面异常配置
>
> 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // 用户未登录 直接跳转主页面异常配置
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 下三行
        ResponseResult<String> success = new ResponseResult<String>("", "用户未登陆", 502);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### 账号退出处理器

> MyLogoutSuccessHandLer
>
> 前后端分离 则无需后台请求 组件清除浏览器的token

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 账号退出
 * 前后端分离 则无需后台请求 组件清除浏览器的token
 */

@Component
public class MyLogoutSuccessHandLer implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/json; charset=UTF-8");
        ResponseResult<Void> result = new ResponseResult<>(200, "退出成功");
        response . getWriter() . write (new ObjectMapper().writeValueAsString (result));
    }
}

```

##### **鉴权处理器 **

> MyAccessDeniedHandler | @PreAuthorize("hasAuthority('权限符内容')")  
>
> 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
>
> 权限的 list 集合为 string 类型 进行储存

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAccessDeniedHandler implements AccessDeniedHandler {
    // 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult<String> noPermission = ResponseResult.error(ResultCode.NO_PERMISSION);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(noPermission));
    }
}
```

> 在表现层加上鉴权 注解

```java
@Controller
public class HollerController {

    @RequestMapping("/home")
    // 鉴权 先查询然后跟注解判断 如果一致则允许访问 反之则不行
    @PreAuthorize("hasAuthority('teacher:list')") 
    public String home() {
        return "home";
    }
}
```

##### 微服务调用自带 token 

微服务 Open Feign 远程调用组件 在调用对方请求获取数据时 如果该微服务使用的security安全框架

则必须在 请求头带上token 否则无法访问  

* FeignLogConfiguration 在 Open Feign 远程调用对方请求获取数据时自动获取token并放入请求头在调用对方的微服务请求
* 在  Open Feign  的请求接口带上 token  在调用接口时手动获取token在传入接口调用对方的微服务请求
* 全局的配置类 从请求头获取token 如果不是请求触发的 微服务远程调用请求头没有token则包 null 空指针异常

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

##### JwtTokenFilter 过滤器

* 在未登录的情况下 但携带了正确且合法的 token 则直接放行 请求

* 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类

* 作为 微服务 只需验证 token 的合法性 在获取权限的集合时只需要在 Redis 获取 无需查询数据库
* token 为空进行放行 且在后方进行 设置匿名接口访问
* 当 token 合法不为空 在与redis的token对比一致 则将redis的token再次储存 刷新其过期时间

```java
package com.apai.config.security;

import com.apai.service.IJurisdictionService;
import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
    
    @Autowired
    private ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");

        // swagger放行
        String path = request.getRequestURI();
        if (path.contains("doc.html") || path.contains(".js") || path.contains(".css")
                || path.contains("swagger-resources") || path.contains("api-docs") || path.contains("favicon.ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 匿名访问的接口放行
        String[] anonymousUrls = getAnonymousUrls();
        for (String anonymousUrl : anonymousUrls) {
            if (path.contains(anonymousUrl)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // token 不为空，校验合法
        if (!token.equals(ResultCode.TOKEN_INVALID_EXCEPTION.getMessage())) {

            // 根据 token 获取用户名称
            String username = JwtTokenUtil.getUsername(token);
            // 根据 用户名称+token的key 在redis获取token
            String redisToken = stringRedisTemplate.opsForValue().get(username + ":token");
            // 请求头的token 和 redis的token一致 则进行续期
            if (token.equals(redisToken)) {
                // redis的 token 续期
                stringRedisTemplate.opsForValue().set(username + ":token", token, JwtTokenUtil.EXPIRE_TIME * 2, TimeUnit.MILLISECONDS);
            } else {
                // redis的token过期被删除则无法续期 提示过期
                response.setContentType("application/json;charset=utf-8");
                PrintWriter out = response.getWriter();
                ResponseResult result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
                out.write(new ObjectMapper().writeValueAsString(result));
                out.flush();
                out.close();
                return;
            }

            // 3. 根据 用户名 获取redis的用户权限
            String str = stringRedisTemplate.opsForValue().get(username);
            List<String> perms = new ArrayList<>();
            if (!StringUtils.isEmpty(str)) {
                perms = new ObjectMapper().readValue(str, new TypeReference<List<String>>() {
                });
            }

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(item -> list.add(new SimpleGrantedAuthority(item)));

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);
            // 5. 装入security 容器中
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // 6.继续放行
            filterChain.doFilter(request, response);
        } else {
            // 不合法
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            ResponseResult result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);
            out.write(new ObjectMapper().writeValueAsString(result));
            out.flush();
            out.close();
            return;
        }

    }
    
    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的 RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}

```



##### Security  配置类

> WebSecurityConfig
>
> 各种处理器 都依靠 Security  配置类 进行对应的跳转校验
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 登录的默认请求 POST | 路径 /login  携带的 账号 密码 的请求可自定义 如需更改需三处同步更改
>
> 根据自定义注解获取所有匿名的接口请求路径 然后所有都进行放行 直接访问

```java 
package com.apai.config.security;

import com.apai.util.AnonymousAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
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
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;


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

    // 获取校验登录验证码的自定义过滤器
    @Autowired
    private VerificationCodeFilter verificationCodeFilter;

    // 注入 获取匿名接口请求集合使用
    @Autowired
    private ApplicationContext applicationContext;


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
        // 进行自定义的过滤器(登录验证码校验和登录密码对比校验)排序
        http.addFilterBefore(verificationCodeFilter, UsernamePasswordAuthenticationFilter.class);


        // 鉴权认证配置
        http.authorizeRequests() // 鉴权的请求
                .antMatchers("/login.html", "/user/register", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico", "doc.html").permitAll() // 允许通过的请求
                // 匿名接口的使用请求都进行放行
                .antMatchers(getAnonymousUrls()).anonymous()
                .anyRequest().authenticated(); // 除了什么配置 其他的需要登录访问

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                .usernameParameter("username").passwordParameter("password") // 登录的表单参数
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

    // 获取请求方法上面含有 @AnonymousAccess注解的 url路径 如:“/hello”
    public String[] getAnonymousUrls(){
        Set<String> anonymousUrls = new HashSet<>();
        //获取所有的RequestMapping
        Map<RequestMappingInfo, HandlerMethod> map = applicationContext.
                getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo,HandlerMethod> item :map.entrySet()){
            HandlerMethod handlerMethod = item.getValue();
            // 获取方法上 AnonymousAccess 类型的注解
            AnonymousAccess anonymousAccess = handlerMethod.getMethodAnnotation(AnonymousAccess.class);
            // 如果方法上标注了 AnonymousAccess 注解，就获取该方法的访问全路径
            if(anonymousAccess != null){
                anonymousUrls.addAll(item.getKey().getPatternsCondition().getPatterns());
            }
        }
        return anonymousUrls.toArray(new String[0]);
    }
}
```

##### 密码校验 | 权限集合获取

> 进行密码的校验 注意: 在密码校验是 将数据库的密码进行MD6解析的加密密码  而不是直接对比校验
>
> 权限的集合 直接为 字符串的集合 进行储存

```java
package com.apai.config.security;

import com.apai.entity.Permission;
import com.apai.entity.User;
import com.apai.mapper.PermissionMapper;
import com.apai.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    // 获取到用户的业务层对象实例 用来调用mapper方法获取数据
    @Autowired
    private IUserService userService;

    @Autowired
    private PermissionMapper permissionMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        QueryWrapper wrapper = new QueryWrapper();
        wrapper.eq("user_name", username);
        User user = userService.getOne(wrapper);
        if (user == null) {
            // 证明没有这个用户
            throw new UsernameNotFoundException("用户不存在");
        }
        //如果用户存在，则还要比较密码
        String password = user.getUserPassword(); // 数据库存储的密码

        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();

        // 基于用户名查询用户的权限集合
        List<Permission> permcodeList = permissionMapper.permcodeList(user.getUserId());
        permcodeList.forEach(permcode -> {
            grantedAuthorityList.add(new SimpleGrantedAuthority(permcode.getPercode()));
        });

        return new org.springframework.security.core.userdetails.User(username, password, grantedAuthorityList);
    }
}

```

##### 登录验证码校验过滤器

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class VerificationCodeFilter extends GenericFilter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;
        if ("POST".equals(req.getMethod()) && "/login".equals(req.getServletPath())) {
            // 1.获取用户输入的验证码
            String code = req.getParameter("code");
            // 2.获取session中的验证码
            String verify_code = (String) req.getSession().getAttribute("verify_code");
            // 3.判断验证码是否正确
            if (code == null || "".equals(code) || !code.toLowerCase().equals(verify_code.toLowerCase())) {
                ResponseResult<String> success = new ResponseResult<>(null, "验证码有误", 400);
                resp.setContentType("application/json;charset=utf-8");
                resp.getWriter().write(new ObjectMapper().writeValueAsString(success));
            }else {
                filterChain.doFilter(req, resp);
            }
        }else {
            filterChain.doFilter(req, resp);
        }
    }
}
```



#### 工具类 - util

##### 自定义注解 | 获取接口路径

> @AnonymousAccess 

```java
package com.apai.util;

import java.lang.annotation.*;

/**
 * 可加载web请求接口是获取该接口的请求路径
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AnonymousAccess {

}
```

##### JwtTokenUtil

> 生成 token | token 校验 | 根据 token 获取username | 测试
>
> 将校验token的返回值改成对应的string提示

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    public static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     *
     * @param token
     * @return
     */
    public static String checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return ResultCode.SUCCESS.getMessage();
        } catch (JWTVerificationException e) {
            if(e instanceof JWTDecodeException){
                return ResultCode.TOKEN_INVALID_EXCEPTION.getMessage();
            }else{
                return ResultCode.USER_ACCOUNT_EXPIRED.getMessage();
            }
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

//        while (checkToken(token)){
//            System.out.println("-------" + System.currentTimeMillis());
//            Thread.sleep(1000);
//        }
    }
}

```

##### **ResponseResult  返回封装**

```java
package com.apai.util;

import lombok.Data;

@Data
public class ResponseResult<T> {
    private int status;
    private String msg;
    private T data;

    public ResponseResult(){}

    public ResponseResult(int status, String msg){
        this.status = status;
        this.msg = msg;
    }
    public ResponseResult(T data, String msg, int status){
        this(status,msg);
        this.data = data;
        this.msg = msg;
    }

    public static ResponseResult ok(){
        ResponseResult result = new ResponseResult();
        result.setStatus(ResultCode.SUCCESS.getCode());
        result.setMsg(ResultCode.SUCCESS.getMessage());
        return result;
    }

    public static ResponseResult error(ResultCode resultCode){
        ResponseResult result = new ResponseResult();
        result.setStatus(resultCode.getCode());
        result.setMsg(resultCode.getMessage());
        return result;
    }

    public static ResponseResult<Void> SUCCESS = new ResponseResult<>(200,"成功");
    public static ResponseResult<Void> INTEVER_ERROR = new ResponseResult<>(500,"服务器错误");
    public static ResponseResult<Void> NOT_FOUND = new ResponseResult<>(404,"未找到");

}

```

##### **ResultCode | 返回参数**

```java
package com.apai.util;

public enum ResultCode {

    /*
    400 参数错误
    401 没权限
    403 请求方式不支持 get post
    404 url找不到资源
    500 内部程序错误
    503 网关错误
     */

    /* 成功 */
    SUCCESS(200, "成功"),

    /* 默认失败 */
    COMMON_FAIL(999, "失败"),

    /* 参数错误：1000～1999 */
    PARAM_NOT_VALID(1001, "参数无效"),
    PARAM_IS_BLANK(1002, "参数为空"),
    PARAM_TYPE_ERROR(1003, "参数类型错误"),
    PARAM_NOT_COMPLETE(1004, "参数缺失"),

    /* 用户错误 */
    USER_NOT_LOGIN(2001, "用户未登录"),
    USER_ACCOUNT_EXPIRED(2002, "账号已过期"),
    USER_CREDENTIALS_ERROR(2003, "密码错误"),
    USER_CREDENTIALS_EXPIRED(2004, "密码过期"),
    USER_ACCOUNT_DISABLE(2005, "账号不可用"),
    USER_ACCOUNT_LOCKED(2006, "账号被锁定"),
    USER_ACCOUNT_NOT_EXIST(2007, "账号不存在"),
    USER_ACCOUNT_ALREADY_EXIST(2008, "账号已存在"),
    USER_ACCOUNT_USE_BY_OTHERS(2009, "您的登录已经超时或者已经在另一台机器登录，您被迫下线"),
    TOKEN_IS_NULL(2010,"TOKEN为空"),
    TOKEN_INVALID_EXCEPTION(2011,"TOKEN非法"),

    /* 业务错误 */
    NO_PERMISSION(4001, "没有权限"),

    /*部门错误*/
    DEPARTMENT_NOT_EXIST(5007, "部门不存在"),
    DEPARTMENT_ALREADY_EXIST(5008, "部门已存在"),

    /*运行时异常*/
    ARITHMETIC_EXCEPTION(9001,"算数异常"),
    NULL_POINTER_EXCEPTION(9002,"空指针异常"),
    ARRAY_INDEX_OUTOfBOUNDS_EXCEPTION(9003,"数组越界");


    ResultCode(Integer code, String message){
        this.code = code;
        this.message = message;
    }

    private Integer code;
    public Integer getCode() {
        return code;
    }

    private String message;
    public String getMessage() {
        return message;
    }

}
```

**JwtTokenUtil**

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

        while (checkToken(token)){
            System.out.println("-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}
```

##### VerificationCode | 验证码

```java
package com.apai.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

public class VerificationCode {
    private int width = 100;// 生成验证码图片的宽度
    private int height = 30;// 生成验证码图片的高度
    private String[] fontNames = { "宋体", "楷体", "隶书", "微软雅黑" };
    private Color bgColor = new Color(255, 255, 255);// 定义验证码图片的背景颜色为白色
    private Random random = new Random();
    private String codes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private String text;// 记录随机字符串

    /**
     * 获取一个随意颜色
     *
     * @return
     */
    private Color randomColor() {
        int red = random.nextInt(150);
        int green = random.nextInt(150);
        int blue = random.nextInt(150);
        return new Color(red, green, blue);
    }

    /**
     * 获取一个随机字体
     *
     * @return
     */
    private Font randomFont() {
        String name = fontNames[random.nextInt(fontNames.length)];
        int style = random.nextInt(4);
        int size = random.nextInt(5) + 24;
        return new Font(name, style, size);
    }

    /**
     * 获取一个随机字符
     *
     * @return
     */
    private char randomChar() {
        return codes.charAt(random.nextInt(codes.length()));
    }

    /**
     * 创建一个空白的BufferedImage对象
     *
     * @return
     */
    private BufferedImage createImage() {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        g2.setColor(bgColor);// 设置验证码图片的背景颜色
        g2.fillRect(0, 0, width, height);
        return image;
    }

    public BufferedImage getImage() {
        BufferedImage image = createImage();
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < 4; i++) {
            String s = randomChar() + "";
            sb.append(s);
            g2.setColor(randomColor());
            g2.setFont(randomFont());
            float x = i * width * 1.0f / 4;
            g2.drawString(s, x, height - 8);
        }
        this.text = sb.toString();
        drawLine(image);
        return image;
    }

    /**
     * 绘制干扰线
     *
     * @param image
     */
    private void drawLine(BufferedImage image) {
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        int num = 5;
        for (int i = 0; i < num; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g2.setColor(randomColor());
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawLine(x1, y1, x2, y2);
        }
    }

    public String getText() {
        return text;
    }

    public static void output(BufferedImage image, OutputStream out) throws IOException {
        ImageIO.write(image, "JPEG", out);
    }
}
```

#### exception - 异常包

##### MyTokenIsInvalidException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsInvalidException extends AuthenticationException {
    public MyTokenIsInvalidException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsInvalidException(String msg) {
        super(msg);
    }
}
```

##### MyTokenIsNullException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsNullException extends AuthenticationException {
    public MyTokenIsNullException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsNullException(String msg) {
        super(msg);
    }
}
```

#### 验证码生成接口

```java
// 获取登录数字验证码
@GetMapping("/verifyCode")
// 匿名访问
@AnonymousAccess
public void verifyCode(HttpServletRequest request, HttpServletResponse resp) throws IOException {
    // 1.创建验证码图片对象
    VerificationCode code = new VerificationCode();
    // 2.获取验证码图片
    BufferedImage image = code.getImage();
    // 3.获取图片上的文本内容
    String text = code.getText();
    // 4.将文本内容保存到session中，为登录做准备
    HttpSession session = request.getSession(true);
    // 5.将文本内容保存到session中
    session.setAttribute("verify_code", text);
    // 6.将图片响应给客户端
    VerificationCode.output(image,resp.getOutputStream());
}
```

#### 前端案例

```vue
<template>
  <div class="wrap">
    <div class="form">
      <div class="left">
        <video src="@/assets/video/video.mp4" muted loop autoplay></video>
      </div>
      <div class="right">
        <div class="right-con">
          <h1>欢迎登录: 月亮派平台</h1>
          <h3>账号</h3>
          <input class="text" type="text" v-model="username" />
          <h3>密码</h3>
          <input class="text" type="password" v-model="password" />

          <h3>验证码</h3>
          <div class="code">
            <input class="text" type="text" v-model="verifyCode" style="width: 70%;float: left;"/>
            <img class="verifyCodeImg" :src="imgUrl" @click="resetImg" />
  
          </div>
          <input class="btn" type="button" @click="login()" value="LOGIN" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // data: 对象就是要渲染到页面上的数据 | 用于cmd创建的vue
  data: function () {
    return {
      username: '',
      password: '',
      verifyCode: '',
      // 验证码图片初始地址
      imgUrl:"http://localhost:1025/user/verifyCode?time="+new Date(),
    }
  },

  // created : 页面加载完毕后执行
  created() {

  },

  // methods: 就是定义事件的处理函数  
  methods: {
    // 验证码图片刷新
    resetImg(){
        this.imgUrl = "http://localhost:1025/user/verifyCode?time="+new Date();
    },
    login() {
      // 提交表单
      this.$axios.post('/api/login', "username=" + this.username + "&password=" + this.password + "&code=" + this.verifyCode)
        .then((res) => {
          // debugger
          if (res.data.status == 200) {
            // 保存服务器返回的token
            let token = res.data.data;
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('username', this.username);

            // this.$router.push('/home');
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });

            // 跳转到首页
            this.$router.push({
              path: '/home',
              query: {
                // 传递名 : 数据
                username: this.username,
              }
            });
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
            this.resetImg();
          }
        })
        .catch((erro) => {
          this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
        });

    }
  },
};
</script>


<!-- 组件样式 -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to left top,
      #d16ba5,
      #c777b9,
      #ba83ca,
      #aa8fd8,
      #9a9ae1,
      #8aa7ec,
      #79b3f4,
      #69bff8,
      #52cffe,
      #41dfff,
      #46eefa,
      #5ffbf1);
}

.form {
  width: 900px;
  height: 560px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
}

.left {
  width: 500px;
  height: 560px;
}

.left video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  width: 400px;
  height: 560px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-con {
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

h1 {
  font-size: 26px;
  color: #70b4e3;
  font-weight: 400;
  padding-bottom: 10px;
}

h3 {
  font-size: 12px;
  font-weight: 400;
  color: #70b4e3;
  padding: 20px 0;
}

.text {
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #70b4e3;
  color: #366ae6;
  background-color: rgba(0, 0, 0, 0);
}

.code{
  height: 40px;
  width: 100%;
  position: relative;
  
}

.verifyCodeImg{
  width: 30%;
  height: 40px;
  cursor: pointer;
  position: absolute; 
  bottom: 24px;
  right: 0px;
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 50px;
  background-image: linear-gradient(120deg, #76daec 0%, #c5a8de 100%);
}

.btn:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
```



## Spring security 防坑指南:  

* 过滤器: config.security 包下分别为  JwtTokenFilter || WebSecurityConfig || 前端 index.js 的路由守卫

* 使用注册功能时 必须放行注册的请求 | token 为空会被拦截  且 token 被转化为 字符 "null" 所以不满足if条件 不进行放行

* 加入权限验证后 注册的账号没有权限时为null  在登录验证权限为null会报错 在注册必须赋予至少一条权限

* 请求登录 必须是 POST 请求 /login 路径 |  搭配账号密码  |  http://localhost:1025/login
* security  在未登录的情况下 只要携带了 合法的正确的 token 即能直接处理请求
* token 生成是在 成功登录的处理器里调用的方法  但是要注意: 在之前是使用  request.getParameter("登录请求账号key"); 获取的登录账号名 如果未获取为null 则生成的token在后续的校验报 空指针异常 且直接跳出未登录的处理器
* 如果要改登录的  账号密码请求名 则需要改 配置类 密码校验 登录成功生成token 这三处位置







## Spring security_旧 [备份]

> Spring Security是一个专注于为Java Spring应用程序提供身份验证和授权的框架。与所有Spring项目一样，Spring Security的真正强大之处在于它可以轻松扩展以满足自定义要求。

创建一个 Spring Boot 应用，并引入依赖：

```xml
<!--security 请求拦截 自定义登录 密码加密-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

引入依赖 之后所有的请求将被拦截 并跳转到默认表单登录页面

密码将随机使用UUID 生成在 控制台打印输出

可在 application.yml 里配置 Spring security 账号和密码

```yml
spring:
    ## security 拦截 与 权限控制 设置账号与密码
    security:
        user:
            name: apai
            password: 123456
```

**可使用 springsecurity 认证**

> 摆设 WebSecurityConfig

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //开启httpBasic认证
    http.httpBasic()
        //每个模块配置使用and结尾
        .and()
        //配置路径拦截，表明路径访问所对应的权限，角色，认证信息
        .authorizeRequests()
        .anyRequest()
        //所有请求都需要登录认证才能访问
        .authenticated();
}
```

**自定义 登录页**

> config 配置包 security包下  可在 configure 方法下配置 账号密码 无需在 yml 文件配置
>
> 在请求时会记录你的请求 并跳转到你自定义的登录页 在登录成功后会执行之前的请求

```java
package com.pai.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // super.configure(auth);
        // security在内存中定义一个默认的用户名和密码 
        // auth.inMemoryAuthentication()
                // .withUser("woniu")
                // .password(passwordEncoder.encode("123456")).roles();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        
        http.authorizeRequests()
            	//需要放行的url在这里配置,必须要放行/login和/login.html 不然会报错
            	// 还可以放行多个 文件夹 - "/文件夹/*" - 文件 "*.png"
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*").permitAll()
                .anyRequest().authenticated()
                // 设置登陆页、登录表单form中action的地址，也就是处理认证请求的路径
                .and().formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                //登录表单form中密码输入框input的name名，不修改的话默认是password
                .usernameParameter("username").passwordParameter("password")
                //登录认证成功后默认转跳的路径
                .defaultSuccessUrl("/home");

        //关闭CSRF跨域
        http.csrf().disable();
    }
}
```

### Spring security 密码加密与验证

> 简介:  密码和 随机密钥(盐) 配合生成 加密密码  在加上随机密钥 存储至数据库
>
> 核对时 提取密钥 在配合输入的密码 生成加密密码 与数据库密码核对即可
>
> 方法: 
>
> 加密: **String encode1 = passwordEncoder.encode("密码");**
>
> 核对: **boolean matches1 = passwordEncoder.matches("密码", "已加密的密码");**

#### EncoderConfig 配置类

> config 配置包 security  包下

```java
package com.apai.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 密码加密
@Configuration
public class EncoderConfig {
    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
```

#### 密码测试 test

注意: com.apai 层级  或者  @SpringBootTest(classes = {ApplicationMybatis.class})

```java
package com.apai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
public class SpringTest {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    public void test() {
        String encode1 = passwordEncoder.encode("123456");
        String encode2 = passwordEncoder.encode("123456");
        System.out.println(encode1);
        System.out.println(encode2);

        boolean matches1 = passwordEncoder.matches("123456", "$2a$10$Zoe34UAkP6QGcH8oFwz0iO0iVhPZlNkHg8QzytxmqWnVWdKP9TD5O");
        boolean matches2 = passwordEncoder.matches("123456", "$2a$10$Zoh/7WHg6wUlq6P.UHtHiu.VTOzm5Lj0ULLlfAWJDFb2EAHYKUPVC");
        System.out.println(matches1);
        System.out.println(matches2);
    }
}

```

#### 验证登录

2.**WebSecurityConfig 类** 拦截并设置自定义登录页 并进行传输 账号密码  至 UserDetailsServiceImpl

```java
package com.apai.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;


// springsecurity 的认证
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // super.configure(auth);
        // security在内存中定义一个默认的用户名和密码
        // auth.inMemoryAuthentication()
                // .withUser("woniu")
                // .password(passwordEncoder.encode("123456")).roles();

        // 最终认证做法，是当用户输入用户名和密码的时候，表单提交的url 是：/login，然后security根据我们提交的用户名和密码
        // 去数据库查询是否有   没有就登陆失败，否则就登陆成功
        // 将来做认证的时候 执行的是我们自定义的实现类 来做 验证 UserDetailsServiceImpl 类
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(getBCryptPasswordEncoder());
    }


    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        
        http.authorizeRequests()
            	//需要放行的url在这里配置,必须要放行/login和/login.html,不然会报错
            	// 还可以放行多个 文件夹 - "/文件夹/*" - 文件 "*.png"
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*").permitAll()
                .anyRequest().authenticated()
                // 设置登陆页、登录表单form中action的地址，也就是处理认证请求的路径
                .and().formLogin().loginPage("/login.html").loginProcessingUrl("/login")
                //登录表单form中密码输入框input的name名，不修改的话默认是password
                .usernameParameter("username").passwordParameter("password")
                //登录认证成功后默认转跳的路径
                .defaultSuccessUrl("/home");

        //关闭CSRF跨域
        http.csrf().disable();
    }
}

```

3.**UserDetailsServiceImpl类** 与数据库进行数据验证

```java
package com.apai.config.security;

import com.apai.entity.User;
import com.apai.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    // 获取到用户的业务层对象实例 用来调用mapper方法获取数据
    @Autowired
    private IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        QueryWrapper wrapper = new QueryWrapper();
        wrapper.eq("username", username);
        User user = userService.getOne(wrapper);
        if(user == null) { // 证明没有这个用户
            return null;
        }
        //如果用户存在，则还要比较密码
        String password = user.getPassword(); // 数据库存储的密码

        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(username, password, grantedAuthorityList);
    }
}

```

### Spring security 登录 异常 鉴权

**特别注意:**  

* 过滤器: config.security 包下分别为  JwtTokenFilter || WebSecurityConfig || 前端 index.js 的路由守卫

* 使用注册功能时 必须放行注册的请求 | token 为空会被拦截  且 token 被转化为 字符 "null" 所以不满足if条件 不进行放行

* 加入权限验证后 注册的账号没有权限时为null  在登录验证权限为null会报错 在注册必须赋予至少一条权限

* 请求登录 必须是 POST 请求 /login 路径 |  搭配账号密码
* security  在未登录的情况下 只要携带了 合法的正确的 token 即能直接处理请求
* token 生成是在 成功登录的处理器里调用的方法  但是要注意: 在之前是使用  request.getParameter("登录请求账号key"); 获取的登录账号名 如果未获取为null 则生成的token在后续的校验报 空指针异常 且直接跳出未登录的处理器
* 如果要改登录的  账号密码请求名 则需要改 配置类 密码校验 登录成功生成token 这三处位置

```java
// JwtTokenFilter--> doFilterInternal 方法下
// 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
String token = request.getHeader("token");
// 2. 校验这个token是否为null
if(StringUtils.isEmpty(token)||token.equals("null")) {
    String uri = request.getRequestURI().toString();
    if(uri.equals("/user/registeruser") || uri.equals("/user/registerverify") || uri.equals("/login") || uri.equals("/login.html") || uri.startsWith("/js/") || uri.startsWith("/css/")) {
        // 如果请求地址是 /login   /login.html  js css，则直接放行
        filterChain.doFilter(request, response);
        return;
    } else {
        authenticationFailureHandler.onAuthenticationFailure(request, response, new MyTokenIsNullException("Token is Null"));
        return;
    }
}
```



#### 工具类 - util

##### JwtTokenUtil

> 生成 token | token 校验 | 根据 token 获取username | 测试

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        // 传入 用户名 封装生成 token
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);
        // 将 toke 裁剪成数组
        String[] strarr = token.split("\\.");
        // 解析 第一部分 header{"typ":"JWT","alg":"HS256"}
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        // 解析 第二部分 claims{"aud":"paidaxing","exp":1659625894}
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));
        // 根据 token 的过期时间判断
        while (checkToken(token)){
            System.out.println("是否过期: " + checkToken(token));
            System.out.println("过期时间-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}

```

##### **ResponseResult**

```java
package com.apai.util;

import lombok.Data;

@Data
public class ResponseResult<T> {
    private int status;
    private String msg;
    private T data;

    public ResponseResult(){}

    public ResponseResult(int status, String msg){
        this.status = status;
        this.msg = msg;
    }
    public ResponseResult(T data, String msg, int status){
        this(status,msg);
        this.data = data;
        this.msg = msg;
    }

    public static ResponseResult ok(){
        ResponseResult result = new ResponseResult();
        result.setStatus(ResultCode.SUCCESS.getCode());
        result.setMsg(ResultCode.SUCCESS.getMessage());
        return result;
    }

    public static ResponseResult error(ResultCode resultCode){
        ResponseResult result = new ResponseResult();
        result.setStatus(resultCode.getCode());
        result.setMsg(resultCode.getMessage());
        return result;
    }

    public static ResponseResult<Void> SUCCESS = new ResponseResult<>(200,"成功");
    public static ResponseResult<Void> INTEVER_ERROR = new ResponseResult<>(500,"服务器错误");
    public static ResponseResult<Void> NOT_FOUND = new ResponseResult<>(404,"未找到");

}

```

##### **ResultCode**

```java
package com.apai.util;

public enum ResultCode {

    /*
    400 参数错误
    401 没权限
    403 请求方式不支持 get post
    404 url找不到资源
    500 内部程序错误
    503 网关错误
     */

    /* 成功 */
    SUCCESS(200, "成功"),

    /* 默认失败 */
    COMMON_FAIL(999, "失败"),

    /* 参数错误：1000～1999 */
    PARAM_NOT_VALID(1001, "参数无效"),
    PARAM_IS_BLANK(1002, "参数为空"),
    PARAM_TYPE_ERROR(1003, "参数类型错误"),
    PARAM_NOT_COMPLETE(1004, "参数缺失"),

    /* 用户错误 */
    USER_NOT_LOGIN(2001, "用户未登录"),
    USER_ACCOUNT_EXPIRED(2002, "账号已过期"),
    USER_CREDENTIALS_ERROR(2003, "密码错误"),
    USER_CREDENTIALS_EXPIRED(2004, "密码过期"),
    USER_ACCOUNT_DISABLE(2005, "账号不可用"),
    USER_ACCOUNT_LOCKED(2006, "账号被锁定"),
    USER_ACCOUNT_NOT_EXIST(2007, "账号不存在"),
    USER_ACCOUNT_ALREADY_EXIST(2008, "账号已存在"),
    USER_ACCOUNT_USE_BY_OTHERS(2009, "您的登录已经超时或者已经在另一台机器登录，您被迫下线"),
    TOKEN_IS_NULL(2010,"TOKEN为空"),
    TOKEN_INVALID_EXCEPTION(2011,"TOKEN非法"),

    /* 业务错误 */
    NO_PERMISSION(4001, "没有权限"),

    /*部门错误*/
    DEPARTMENT_NOT_EXIST(5007, "部门不存在"),
    DEPARTMENT_ALREADY_EXIST(5008, "部门已存在"),

    /*运行时异常*/
    ARITHMETIC_EXCEPTION(9001,"算数异常"),
    NULL_POINTER_EXCEPTION(9002,"空指针异常"),
    ARRAY_INDEX_OUTOfBOUNDS_EXCEPTION(9003,"数组越界");


    ResultCode(Integer code, String message){
        this.code = code;
        this.message = message;
    }

    private Integer code;
    public Integer getCode() {
        return code;
    }

    private String message;
    public String getMessage() {
        return message;
    }

}
```

**JwtTokenUtil**

```java
package com.apai.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.util.Date;


@Slf4j
public class JwtTokenUtil {

    // 过期时间 -- 30分钟
    private static final long EXPIRE_TIME = 60 * 1000;

    // jwt -- 签名
    private static final String SECRET = "apai";

    /**
     * 生成 token
     * @param username
     * @return
     */
    public static String createToken(String username) {
        String tocken = null;

        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);

        try {
            tocken = JWT.create()
                    .withAudience(username) // 将 username 保存在 token 里
                    .withExpiresAt(date) // token 的过期时间
                    // . withClaim("testClaim", "testClaim")
                    // .withSubject("JWT_token")
                    .sign(Algorithm.HMAC256(SECRET)); // 签名的加密方式
        } catch (Exception e) {
            log.error("token生成异常", e);
        }

        return tocken;
    }

    /**
     * token 校验
     * @param token
     * @return
     */
    public static boolean checkToken(String token) {
        try {
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(SECRET)) // 签名的加密方式
                    .build();
            DecodedJWT verify = verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            log.error("token 生成无效 重新获取 ", e);
            return false;
        }
    }

    /**
     * 根据 token 获取username
     * @param token
     * @return
     */
    public static String getUsername(String token) {
        try {
            String username = JWT.decode(token).getAudience().get(0);
            return username;
        } catch (JWTDecodeException e) {
            log.error("token异常", e);
            throw e;
        }
    }


    /**
     * 测试
     * @param args
     * @throws UnsupportedEncodingException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws UnsupportedEncodingException, InterruptedException {
        String token = JwtTokenUtil.createToken("paidaxing");
        System.out.println(token);

        String[] strarr = token.split("\\.");
        System.out.println("header" + new String(Base64.decodeBase64(strarr[0]), "utf-8"));
        System.out.println("claims" + new String(Base64.decodeBase64(strarr[1]), "utf-8"));

        while (checkToken(token)){
            System.out.println("-------" + System.currentTimeMillis());
            Thread.sleep(1000);
        }
    }
}
```

#### 配置包 | config . security

##### **登录成功处理器**

> MyAuthenticationSuccessHandler

```java
package com.apai.config.security;

import com.apai.util.JwtTokenUtil;
import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


// 自定义登录成功处理器
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    // 登录成功 配置
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 特别注意: 根据 请求的账号的key称获取 账号名称 | 获取的登录账号名 如果为获取为null 则生成的token在后续的校验报 空指针异常
        String username = request.getParameter("username");
        // 生成token.返回给前端，同时我们还可以把该用户的权限标识符查询出来存到redis
        String token = JwtTokenUtil.createToken(username);

        ResponseResult<String> success = new ResponseResult<>(token, "登录成功", 200);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}
```

##### **登录出错 处理器**

> MyAuthenticationFailureHandler
>
> 登录出错 异常配置

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("登录错误", exception);

        ResponseResult result = null;

        if(exception instanceof UsernameNotFoundException) {                    //用户名不存在
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_NOT_EXIST);
        } else if (exception instanceof AccountExpiredException) {              //账号过期
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_EXPIRED);
        } else if (exception instanceof BadCredentialsException) {              //凭证不对   错误
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_ERROR);
        } else if (exception instanceof CredentialsExpiredException) {          //密码过期
            result = ResponseResult.error(ResultCode.USER_CREDENTIALS_EXPIRED);
        } else if (exception instanceof DisabledException) {                    //账号不可用
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_DISABLE);
        } else if (exception instanceof LockedException) {                      //账号锁定
            result = ResponseResult.error(ResultCode.USER_ACCOUNT_LOCKED);
        } else if(exception instanceof MyTokenIsNullException) {
            result = ResponseResult.error(ResultCode.TOKEN_IS_NULL);            // token 为空
        } else if(exception instanceof MyTokenIsInvalidException) {
            result = ResponseResult.error(ResultCode.TOKEN_INVALID_EXCEPTION);  // token 不合法
        } else {
            result = ResponseResult.error(ResultCode.COMMON_FAIL);
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}

```

##### **用户未登录处理器**

> MyAuthenticationEntryPoint
>
> 用户未登录 跳转主页面异常配置
>
> 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // 用户未登录 直接跳转主页面异常配置
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 当 使用token访问 第一次都是请求失败 则可以注释掉 用户未登录 跳转主页面异常配置 下三行
        ResponseResult<String> success = new ResponseResult<String>("", "用户未登陆", 502);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(success));
    }
}

```

##### 账号退出处理器

> MyLogoutSuccessHandLer
>
> 前后端分离 则无需后台请求 组件清除浏览器的token

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 账号退出
 * 前后端分离 则无需后台请求 组件清除浏览器的token
 */

@Component
public class MyLogoutSuccessHandLer implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        response.setContentType("application/json; charset=UTF-8");
        ResponseResult<Void> result = new ResponseResult<>(200, "退出成功");
        response . getWriter() . write (new ObjectMapper().writeValueAsString (result));
    }
}

```

##### **鉴权处理器 **

> MyAccessDeniedHandler | @PreAuthorize("hasAuthority('权限符内容')")  
>
> 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
>
> 权限的 list 集合为 string 类型 进行储存

```java
package com.apai.config.security;

import com.apai.util.ResponseResult;
import com.apai.util.ResultCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyAccessDeniedHandler implements AccessDeniedHandler {
    // 鉴权 控制用户是否能够访问 原理: 先查询数据库鉴权值 与路径值对比
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult<String> noPermission = ResponseResult.error(ResultCode.NO_PERMISSION);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(noPermission));
    }
}
```

> 在表现层加上鉴权 注解

```java
@Controller
public class HollerController {

    @RequestMapping("/home")
    // 鉴权 先查询然后跟注解判断 如果一致则允许访问 反之则不行
    @PreAuthorize("hasAuthority('teacher:list')") 
    public String home() {
        return "home";
    }
}
```

##### 微服务调用自带 token 

微服务 Open Feign 远程调用组件 在调用对方请求获取数据时 如果该微服务使用的security安全框架

则必须在 请求头带上token 否则无法访问  

* FeignLogConfiguration 在 Open Feign 远程调用对方请求获取数据时自动获取token并放入请求头在调用对方的微服务请求
* 在  Open Feign  的请求接口带上 token  在调用接口时手动获取token在传入接口调用对方的微服务请求
* 全局的配置类 从请求头获取token 如果不是请求触发的 微服务远程调用请求头没有token则包 null 空指针异常

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

##### JwtTokenFilter 过滤器

> 在未登录的情况下 但携带了正确且合法的 token 则直接放行 请求
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 作为 微服务 只需验证 token 的合法性 在获取权限的集合时只需要在 Redis 获取 无需查询数据库

```java
package com.apai.config.security;

import com.apai.exception.MyTokenIsInvalidException;
import com.apai.exception.MyTokenIsNullException;
import com.apai.service.IUserService;
import com.apai.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1.首先拿到token字符串，当用户发送非认证请求时，规定这个token字符串是放在请求头过来的
        String token = request.getHeader("token");
        
        // swagger放行
        String path = request.getRequestURI();
        if (path.contains("doc.html") || path.contains(".js") || path.contains(".css")
                || path.contains("swagger-resources") || path.contains("api-docs") || path.contains("favicon.ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. 校验这个token是否为null
        if (StringUtils.isEmpty(token)) {
            String uri = request.getRequestURI().toString();
            if (uri.equals("/login") || uri.equals("/login.html") || uri.startsWith("/js/") || uri.startsWith("/css/")  || uri.startsWith("/img/") || uri.equals("/favicon.ico")) {
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
            String username = JwtTokenUtil.getUsername(token);
            // 3. 根据用户名查询数据库，获取用户的权限集合
            List<String> perms = userService.selectPermscodeByUserame(username);

            List<GrantedAuthority> list = new ArrayList<>();
            perms.forEach(perm -> {
                GrantedAuthority authority = new SimpleGrantedAuthority(perm);
                list.add(authority);
            });

            // 4.创建验证的用户AuthenticationToken对象
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, "", list);

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



##### Security  配置类

> WebSecurityConfig
>
> 各种处理器 都依靠 Security  配置类 进行对应的跳转校验
>
> 所有的请求 是最先进入 JwtTokenFilter 过滤器 然后再进入Security  配置类
>
> 登录的默认请求 POST | 路径 /login  携带的 账号 密码 的请求可自定义 如需更改需三处同步更改

```java 
package com.apai.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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
        // super.configure(web);
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
                .antMatchers("/login.html", "/login", "/img/*", "/css/*", "/js/*", "favicon.ico").permitAll() // 允许通过的请求
                .anyRequest().authenticated(); // 除了什么配置 其他的需要登录访问

        // 表单登录
        http.formLogin().loginPage("/login.html").loginProcessingUrl("/login")
            	// 登录的表单参数key | 可对应的更改
                .usernameParameter("username").passwordParameter("password") 
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

##### 密码校验 | 权限集合获取

> 进行密码的校验 注意: 在密码校验是 将数据库的密码进行MD6解析的加密密码  而不是直接对比校验
>
> 权限的集合 直接为 字符串的集合 进行储存

```java
package com.apai.config.security;

import com.apai.entity.User;
import com.apai.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    // 获取到用户的业务层对象实例 用来调用mapper方法获取数据
    @Autowired
    private IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        QueryWrapper wrapper = new QueryWrapper();
        wrapper.eq("username", username);
        User user = userService.getOne(wrapper);
        if(user == null) {
            // 证明没有这个用户
            throw new UsernameNotFoundException("用户不存在");
        }
        //如果用户存在，则还要比较密码
        String password = user.getPassword(); // 数据库存储的密码

        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();

        // 基于用户名查询用户的权限集合
        List<String> permcodeList = userService.selectPermscodeByUserame(username);
        permcodeList.forEach(permcode -> {
            grantedAuthorityList.add(new SimpleGrantedAuthority(permcode));
        });

        return new org.springframework.security.core.userdetails.User(username, password, grantedAuthorityList);
    }
}
```

#### exception - 异常包

##### MyTokenIsInvalidException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsInvalidException extends AuthenticationException {
    public MyTokenIsInvalidException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsInvalidException(String msg) {
        super(msg);
    }
}
```

##### MyTokenIsNullException

```java
package com.apai.exception;

import org.springframework.security.core.AuthenticationException;

public class MyTokenIsNullException extends AuthenticationException {
    public MyTokenIsNullException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public MyTokenIsNullException(String msg) {
        super(msg);
    }
}
```

#### 自定义登录页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
    <script src="js/vue.js"></script>
    <script src="js/axios.min.js"></script>
</head>
<body>

<div id="app">
    <p>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username">
    </p>
    <p>
        <label for="password">密码:</label>
        <input type="text" id="password" v-model="password">
    </p>
    <button type="button" @click="submit">登录</button>
    <button type="button" @click="logout">退出</button>


    <hr>

    <input type="button" value="jwt测试" @click="testJwt">
</div>

<script>
    const vm = new Vue({
        el: '#app',
        data: {
            username: '',
            password: ''
        },
        methods: {
            // 登录
            submit: function() {
                let _this = this;
                axios.post('/login', 'username='+_this.username+'&password=' + _this.password, {headers:{"Content-Type":"application/x-www-form-urlencoded"}})
                    .then(function (res) {
                        if(res.data.status == 200) {
                            window.localStorage.setItem("token", res.data.data);
                            alert("登录成功");
                        } else {
                            alert("登录失败");
                        }
                    });

            },
			// 退出
            logout() {
                window.localStorage.removeItem("token");
                // axios.post('/logout')
                //     .then(function (res) {
                //         window.localStorage.removeItem("token");
                //     });
            },

            testJwt: function() {
                axios.get('/user/testJwt', {headers:{token:window.localStorage.getItem("token")}})
                    .then(function(res) {
                        console.log(res);
                    });
            }
        }
    });
</script>

</body>
</html>
```

