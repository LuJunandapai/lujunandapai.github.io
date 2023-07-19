const l=JSON.parse('{"key":"v-b2a5ad7a","path":"/docs/Java-develop/SpringPeiZhi.html","title":"Spring 配置详解","lang":"zh-CN","frontmatter":{"title":"Spring 配置详解","date":"2023/04/26"},"headers":[{"level":2,"title":"----------  Spring 模板  ----------","slug":"spring-模板","link":"#spring-模板","children":[]},{"level":2,"title":"Spring 通用模板","slug":"spring-通用模板","link":"#spring-通用模板","children":[{"level":3,"title":"spring --> pom.xml","slug":"spring-pom-xml","link":"#spring-pom-xml","children":[]},{"level":3,"title":"容器 applicationContext.xml","slug":"容器-applicationcontext-xml","link":"#容器-applicationcontext-xml","children":[]},{"level":3,"title":"容器 SpringConfig.java 注解","slug":"容器-springconfig-java-注解","link":"#容器-springconfig-java-注解","children":[]},{"level":3,"title":"表现层获取实例化对象","slug":"表现层获取实例化对象","link":"#表现层获取实例化对象","children":[]}]},{"level":2,"title":"Spring MVC 通用模板","slug":"spring-mvc-通用模板","link":"#spring-mvc-通用模板","children":[{"level":3,"title":"Spring MVC --> pox.xml","slug":"spring-mvc-pox-xml","link":"#spring-mvc-pox-xml","children":[]},{"level":3,"title":"Web.xml","slug":"web-xml","link":"#web-xml","children":[]},{"level":3,"title":"spring-mvc.xml","slug":"spring-mvc-xml","link":"#spring-mvc-xml","children":[]}]},{"level":2,"title":"SSM  整合 模板","slug":"ssm-整合-模板","link":"#ssm-整合-模板","children":[{"level":3,"title":"项目执行流程","slug":"项目执行流程","link":"#项目执行流程","children":[]},{"level":3,"title":"修改pom.xml，引入依赖","slug":"修改pom-xml-引入依赖","link":"#修改pom-xml-引入依赖","children":[]},{"level":3,"title":"resources  --> spring配置文件","slug":"resources-spring配置文件","link":"#resources-spring配置文件","children":[]},{"level":3,"title":"web.xml 配置","slug":"web-xml-配置","link":"#web-xml-配置","children":[]},{"level":3,"title":"service 业务层","slug":"service-业务层","link":"#service-业务层","children":[]},{"level":3,"title":"Controller 表现层","slug":"controller-表现层","link":"#controller-表现层","children":[]},{"level":3,"title":"SpringBoot Web配置","slug":"springboot-web配置","link":"#springboot-web配置","children":[]},{"level":3,"title":"SpringBoot Mybatis 配置","slug":"springboot-mybatis-配置","link":"#springboot-mybatis-配置","children":[]}]},{"level":2,"title":"SpringBoot Web配置","slug":"springboot-web配置-1","link":"#springboot-web配置-1","children":[{"level":3,"title":"pom 配置","slug":"pom-配置-1","link":"#pom-配置-1","children":[]},{"level":3,"title":"yml 配置","slug":"yml-配置-1","link":"#yml-配置-1","children":[]}]},{"level":2,"title":"SpringBoot Mybatis 配置","slug":"springboot-mybatis-配置-1","link":"#springboot-mybatis-配置-1","children":[{"level":3,"title":"pom  配置","slug":"pom-配置-2","link":"#pom-配置-2","children":[]},{"level":3,"title":"yml  配置","slug":"yml-配置-2","link":"#yml-配置-2","children":[]}]},{"level":2,"title":"SpringBoot  项目 - 模板","slug":"springboot-项目-模板","link":"#springboot-项目-模板","children":[{"level":3,"title":"pom.xml 文件","slug":"pom-xml-文件","link":"#pom-xml-文件","children":[]},{"level":3,"title":"application.yml 配置","slug":"application-yml-配置","link":"#application-yml-配置","children":[]},{"level":3,"title":"启动主程序","slug":"启动主程序","link":"#启动主程序","children":[]}]},{"level":2,"title":"SpringBoot  父项目 - 模板","slug":"springboot-父项目-模板","link":"#springboot-父项目-模板","children":[{"level":3,"title":"pom.xml 文件","slug":"pom-xml-文件-1","link":"#pom-xml-文件-1","children":[]},{"level":3,"title":"resources 包","slug":"resources-包","link":"#resources-包","children":[]},{"level":3,"title":"事务配置类","slug":"事务配置类","link":"#事务配置类","children":[]},{"level":3,"title":"启动主程序","slug":"启动主程序-1","link":"#启动主程序-1","children":[]},{"level":3,"title":"controller 表现层","slug":"controller-表现层-1","link":"#controller-表现层-1","children":[]},{"level":3,"title":"Service 业务层","slug":"service-业务层-1","link":"#service-业务层-1","children":[]},{"level":3,"title":"Mapper 数据访问层","slug":"mapper-数据访问层","link":"#mapper-数据访问层","children":[]}]},{"level":2,"title":"SpringBoot Jsp  项目模板","slug":"springboot-jsp-项目模板","link":"#springboot-jsp-项目模板","children":[{"level":3,"title":"pom.xml 文件","slug":"pom-xml-文件-2","link":"#pom-xml-文件-2","children":[]},{"level":3,"title":"resources -> application.yml","slug":"resources-application-yml","link":"#resources-application-yml","children":[]},{"level":3,"title":"JSP -->  pom 专属配置","slug":"jsp-pom-专属配置","link":"#jsp-pom-专属配置","children":[]},{"level":3,"title":"JSP -- yml  专属配置","slug":"jsp-yml-专属配置","link":"#jsp-yml-专属配置","children":[]}]},{"level":2,"title":"SpringBoot Thymeleaf  项目模板","slug":"springboot-thymeleaf-项目模板","link":"#springboot-thymeleaf-项目模板","children":[{"level":3,"title":"pom.xml 文件","slug":"pom-xml-文件-3","link":"#pom-xml-文件-3","children":[]},{"level":3,"title":"resources -> application.yml","slug":"resources-application-yml-1","link":"#resources-application-yml-1","children":[]},{"level":3,"title":"thymeleaf  -- pom 专属配置","slug":"thymeleaf-pom-专属配置","link":"#thymeleaf-pom-专属配置","children":[]},{"level":3,"title":"thymeleaf  -- yml  专属配置","slug":"thymeleaf-yml-专属配置","link":"#thymeleaf-yml-专属配置","children":[]},{"level":3,"title":"thymeleaf -- HTML 网页","slug":"thymeleaf-html-网页","link":"#thymeleaf-html-网页","children":[]}]},{"level":2,"title":"父子工程模板配置","slug":"父子工程模板配置","link":"#父子工程模板配置","children":[{"level":3,"title":"父工程 pom.xml 依赖配置","slug":"父工程-pom-xml-依赖配置","link":"#父工程-pom-xml-依赖配置","children":[]},{"level":3,"title":"application.yml 配置","slug":"application-yml-配置-2","link":"#application-yml-配置-2","children":[]}]},{"level":2,"title":"|---------------------- 分界线","slug":"分界线","link":"#分界线","children":[]},{"level":2,"title":"Spring 脚手架创建 父子工程","slug":"spring-脚手架创建-父子工程","link":"#spring-脚手架创建-父子工程","children":[{"level":3,"title":"父工程 pom","slug":"父工程-pom","link":"#父工程-pom","children":[]},{"level":3,"title":"子项目 pom","slug":"子项目-pom","link":"#子项目-pom","children":[]},{"level":3,"title":"子项目 application.yml","slug":"子项目-application-yml","link":"#子项目-application-yml","children":[]}]},{"level":2,"title":"代码生成器","slug":"代码生成器","link":"#代码生成器","children":[{"level":3,"title":"mybatis - 代码生成器","slug":"mybatis-代码生成器","link":"#mybatis-代码生成器","children":[]},{"level":3,"title":"Mybatis-plus 代码生成器","slug":"mybatis-plus-代码生成器","link":"#mybatis-plus-代码生成器","children":[]}]},{"level":2,"title":"POM.xml 依赖文件","slug":"pom-xml-依赖文件","link":"#pom-xml-依赖文件","children":[{"level":3,"title":"POM.xml  总体详解","slug":"pom-xml-总体详解","link":"#pom-xml-总体详解","children":[]},{"level":3,"title":"POM.xml  依赖","slug":"pom-xml-依赖","link":"#pom-xml-依赖","children":[]},{"level":3,"title":"build 插件","slug":"build-插件","link":"#build-插件","children":[]}]},{"level":2,"title":"application.yml 配置文件","slug":"application-yml-配置文件","link":"#application-yml-配置文件","children":[{"level":3,"title":"YML 常用基础模板","slug":"yml-常用基础模板","link":"#yml-常用基础模板","children":[]},{"level":3,"title":"配置汇总 | 历史","slug":"配置汇总-历史","link":"#配置汇总-历史","children":[]},{"level":3,"title":"功能配置","slug":"功能配置","link":"#功能配置","children":[]},{"level":3,"title":"MyBatisPlus 表名 列名 配置","slug":"mybatisplus-表名-列名-配置","link":"#mybatisplus-表名-列名-配置","children":[]},{"level":3,"title":"设置静态资源文件夹","slug":"设置静态资源文件夹","link":"#设置静态资源文件夹","children":[]},{"level":3,"title":"分页配置","slug":"分页配置","link":"#分页配置","children":[]}]},{"level":2,"title":"模板补充","slug":"模板补充","link":"#模板补充","children":[{"level":3,"title":"logback SQL日志配置文件：","slug":"logback-sql日志配置文件","link":"#logback-sql日志配置文件","children":[]}]}],"git":{"createdTime":1689760719000,"updatedTime":1689760719000,"contributors":[{"name":"Apai","email":"2386297795@qq.com","commits":1}]},"filePathRelative":"docs/Java-develop/SpringPeiZhi.md"}');export{l as data};
