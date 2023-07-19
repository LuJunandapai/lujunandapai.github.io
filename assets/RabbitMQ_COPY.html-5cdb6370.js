const l=JSON.parse('{"key":"v-d1916b2e","path":"/docs/Linux-develop/RabbitMQ_COPY.html","title":"RabbitMQ 摘要","lang":"zh-CN","frontmatter":{"title":"RabbitMQ 摘要","date":"2023/05/17"},"headers":[{"level":2,"title":"MQ相关概念","slug":"mq相关概念","link":"#mq相关概念","children":[{"level":3,"title":"什么是MQ","slug":"什么是mq","link":"#什么是mq","children":[]},{"level":3,"title":"为什么要用MQ","slug":"为什么要用mq","link":"#为什么要用mq","children":[]},{"level":3,"title":"MQ的分类","slug":"mq的分类","link":"#mq的分类","children":[]},{"level":3,"title":"MQ的选择","slug":"mq的选择","link":"#mq的选择","children":[]}]},{"level":2,"title":"RabbitMQ简介","slug":"rabbitmq简介","link":"#rabbitmq简介","children":[{"level":3,"title":"RabbitMQ四大核心概念","slug":"rabbitmq四大核心概念","link":"#rabbitmq四大核心概念","children":[]},{"level":3,"title":"RabbitMQ的工作模式","slug":"rabbitmq的工作模式","link":"#rabbitmq的工作模式","children":[]},{"level":3,"title":"RabbitMQ工作原理","slug":"rabbitmq工作原理","link":"#rabbitmq工作原理","children":[]},{"level":3,"title":"RabbitMQ安装","slug":"rabbitmq安装","link":"#rabbitmq安装","children":[]}]},{"level":2,"title":"消息应答及持久化","slug":"消息应答及持久化","link":"#消息应答及持久化","children":[{"level":3,"title":"消息应答机制","slug":"消息应答机制","link":"#消息应答机制","children":[]},{"level":3,"title":"消息自动重新入队","slug":"消息自动重新入队","link":"#消息自动重新入队","children":[]},{"level":3,"title":"消息手动应答代码编写","slug":"消息手动应答代码编写","link":"#消息手动应答代码编写","children":[]},{"level":3,"title":"RabbitMQ 持久化","slug":"rabbitmq-持久化","link":"#rabbitmq-持久化","children":[]},{"level":3,"title":"不公平分发","slug":"不公平分发","link":"#不公平分发","children":[]}]},{"level":2,"title":"发布确认","slug":"发布确认","link":"#发布确认","children":[{"level":3,"title":"发布确认原理","slug":"发布确认原理","link":"#发布确认原理","children":[]},{"level":3,"title":"发布确认的策略","slug":"发布确认的策略","link":"#发布确认的策略","children":[]}]},{"level":2,"title":"交换机","slug":"交换机","link":"#交换机","children":[{"level":3,"title":"Exchanges概念","slug":"exchanges概念","link":"#exchanges概念","children":[]},{"level":3,"title":"Exchanges 的类型","slug":"exchanges-的类型","link":"#exchanges-的类型","children":[]},{"level":3,"title":"无名 exchange","slug":"无名-exchange","link":"#无名-exchange","children":[]},{"level":3,"title":"临时队列","slug":"临时队列","link":"#临时队列","children":[]},{"level":3,"title":"绑定(bindings)","slug":"绑定-bindings","link":"#绑定-bindings","children":[]},{"level":3,"title":"Fanout(发布订阅交换机)","slug":"fanout-发布订阅交换机","link":"#fanout-发布订阅交换机","children":[]},{"level":3,"title":"Direct exchange(直接交换机)","slug":"direct-exchange-直接交换机","link":"#direct-exchange-直接交换机","children":[]},{"level":3,"title":"Topics(主题交换机)","slug":"topics-主题交换机","link":"#topics-主题交换机","children":[]}]},{"level":2,"title":"死信队列","slug":"死信队列","link":"#死信队列","children":[{"level":3,"title":"死信的概念","slug":"死信的概念","link":"#死信的概念","children":[]},{"level":3,"title":"队列达到最大长度","slug":"队列达到最大长度","link":"#队列达到最大长度","children":[]},{"level":3,"title":"消息被拒进入死信","slug":"消息被拒进入死信","link":"#消息被拒进入死信","children":[]}]},{"level":2,"title":"延迟队列","slug":"延迟队列","link":"#延迟队列","children":[{"level":3,"title":"延迟队列使用场景","slug":"延迟队列使用场景","link":"#延迟队列使用场景","children":[]},{"level":3,"title":"RabbitMQ 中的 TTL","slug":"rabbitmq-中的-ttl","link":"#rabbitmq-中的-ttl","children":[]}]},{"level":2,"title":"整合SpringBoot","slug":"整合springboot","link":"#整合springboot","children":[{"level":3,"title":"添加依赖","slug":"添加依赖","link":"#添加依赖","children":[]},{"level":3,"title":"死信队列实现延迟MQ","slug":"死信队列实现延迟mq","link":"#死信队列实现延迟mq","children":[]},{"level":3,"title":"Rabbitmq插件实现延迟队列","slug":"rabbitmq插件实现延迟队列","link":"#rabbitmq插件实现延迟队列","children":[]}]},{"level":2,"title":"发布确认高级姿势","slug":"发布确认高级姿势","link":"#发布确认高级姿势","children":[{"level":3,"title":"发布确认 springboot 版本","slug":"发布确认-springboot-版本","link":"#发布确认-springboot-版本","children":[]},{"level":3,"title":"回退消息","slug":"回退消息","link":"#回退消息","children":[]},{"level":3,"title":"备份交换机","slug":"备份交换机","link":"#备份交换机","children":[]}]},{"level":2,"title":"RabbitMQ其他知识点","slug":"rabbitmq其他知识点","link":"#rabbitmq其他知识点","children":[{"level":3,"title":"幂等性","slug":"幂等性","link":"#幂等性","children":[]},{"level":3,"title":"优先级队列","slug":"优先级队列","link":"#优先级队列","children":[]},{"level":3,"title":"惰性队列","slug":"惰性队列","link":"#惰性队列","children":[]}]},{"level":2,"title":"RabbitMQ 集群","slug":"rabbitmq-集群","link":"#rabbitmq-集群","children":[{"level":3,"title":"clustering集群模式","slug":"clustering集群模式","link":"#clustering集群模式","children":[]},{"level":3,"title":"镜像队列","slug":"镜像队列","link":"#镜像队列","children":[]},{"level":3,"title":"实现高可用负载均衡","slug":"实现高可用负载均衡","link":"#实现高可用负载均衡","children":[]},{"level":3,"title":"Federation Exchange","slug":"federation-exchange","link":"#federation-exchange","children":[]},{"level":3,"title":"Federation Queue","slug":"federation-queue","link":"#federation-queue","children":[]},{"level":3,"title":"Shovel","slug":"shovel","link":"#shovel","children":[]}]},{"level":2,"title":"RabbitMQ工具类","slug":"rabbitmq工具类","link":"#rabbitmq工具类","children":[{"level":3,"title":"工具类使用","slug":"工具类使用","link":"#工具类使用","children":[]}]},{"level":2,"title":"RabbitMQ相关面试题","slug":"rabbitmq相关面试题","link":"#rabbitmq相关面试题","children":[{"level":3,"title":"如何保证消息不丢失？","slug":"如何保证消息不丢失","link":"#如何保证消息不丢失","children":[]},{"level":3,"title":"消息的类型","slug":"消息的类型","link":"#消息的类型","children":[]}]}],"git":{"createdTime":1689760719000,"updatedTime":1689760719000,"contributors":[{"name":"Apai","email":"2386297795@qq.com","commits":1}]},"filePathRelative":"docs/Linux-develop/RabbitMQ_COPY.md"}');export{l as data};
