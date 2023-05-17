import{_ as s,p as l,q as r,s as e,t as n,R as a,Y as t,n as d}from"./framework-e1bed10d.js";const u={},o=t('<h2 id="mq相关概念" tabindex="-1"><a class="header-anchor" href="#mq相关概念" aria-hidden="true">#</a> MQ相关概念</h2><h3 id="什么是mq" tabindex="-1"><a class="header-anchor" href="#什么是mq" aria-hidden="true">#</a> 什么是MQ</h3><p>MQ(message queue)，从字面意思上看，本质是个队列，FIFO 先入先出，只不过队列中存放的内容是message 而已，还是一种跨进程的通信机制，用于上下游传递消息。在互联网架构中，MQ 是一种非常常见的上下游“逻辑解耦+物理解耦”的消息通信服务。使用了 MQ之后，消息发送上游只需要依赖 MQ，不用依赖其他服务。</p><h3 id="为什么要用mq" tabindex="-1"><a class="header-anchor" href="#为什么要用mq" aria-hidden="true">#</a> 为什么要用MQ</h3>',4),c=e("p",null,"流量消峰",-1),b=e("p",null,"举个例子，如果订单系统最多能处理一万次订单，这个处理能力应付正常时段的下单时绰绰有余，正常时段我们下单一秒后就能返回结果。但是在高峰期，如果有两万次下单操作系统是处理不了的，只能限制订单超过一万后不允许用户下单。使用消息队列做缓冲，我们可以取消这个限制，把一秒内下的订单分散成一段时间来处理，这时有些用户可能在下单十几秒后才能收到下单成功的操作，但是比不能下单的体验要好。",-1),v={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142709.png",target:"_blank",rel:"noopener noreferrer"},h=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142709.png",alt:"img"},null,-1),m=e("p",null,"应用解耦",-1),g=e("p",null,"以电商应用为例，应用中有订单系统、库存系统、物流系统、支付系统。用户创建订单后，如果耦合调用库存系统、物流系统、支付系统，任何一个子系统出了故障，都会造成下单操作异常。当转变成基于消息队列的方式后，系统间调用的问题会减少很多，比如物流系统因为发生故障，需要几分钟来修复。在这几分钟的时间里，物流系统要处理的内存被缓存在消息队列中，用户的下单操作可以正常完成。当物流系统恢复后，继续处理订单信息即可，中单用户感受不到物流系统的故障，提升系统的可用性。",-1),p={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142118.png",target:"_blank",rel:"noopener noreferrer"},_=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142118.png",alt:"img"},null,-1),q={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142315.png",target:"_blank",rel:"noopener noreferrer"},f=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142315.png",alt:"img"},null,-1),x=e("p",null,"异步提速",-1),M=e("p",null,"有些服务间调用是异步的，例如 A 调用 B，B 需要花费很长时间执行，但是 A 需要知道 B 什么时候可以执行完，以前一般有两种方式，A 过一段时间去调用 B 的查询 api 查询。或者 A 提供一个 callback api，B 执行完之后调用 api 通知 A 服务。这两种方式都不是很优雅，使用消息总线，可以很方便解决这个问题，A 调用 B 服务后，只需要监听 B 处理完成的消息，当 B 处理完成后，会发送一条消息给 MQ，MQ 会将此消息转发给 A 服务。这样 A 服务既不用循环调用 B 的查询 api，也不用提供 callback api。同样 B 服务也不用做这些操作。A 服务还能及时的得到异步处理成功的消息。",-1),E={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142435.png",target:"_blank",rel:"noopener noreferrer"},y=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142435.png",alt:"img"},null,-1),Q={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142525.png",target:"_blank",rel:"noopener noreferrer"},N=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142525.png",alt:"img"},null,-1),A=e("h3",{id:"mq的分类",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#mq的分类","aria-hidden":"true"},"#"),a(" MQ的分类")],-1),k={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142909.png",target:"_blank",rel:"noopener noreferrer"},C=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_142909.png",alt:"img"},null,-1),S=t('<h4 id="activemq" tabindex="-1"><a class="header-anchor" href="#activemq" aria-hidden="true">#</a> ActiveMQ</h4><p>**优点：**单机吞吐量万级，时效性 ms 级，可用性高，基于主从架构实现高可用性，消息可靠性较低的概率丢失数据。</p><p>**缺点：**官方社区现在对 ActiveMQ 5.x 维护越来越少，高吞吐量场景较少使用。</p><h4 id="kafka" tabindex="-1"><a class="header-anchor" href="#kafka" aria-hidden="true">#</a> Kafka</h4><p>大数据的杀手锏，谈到大数据领域内的消息传输，则绕不开 Kafka，这款为大数据而生的消息中间件，以其<strong>百万级 TPS 的吞吐量</strong>名声大噪，迅速成为大数据领域的宠儿，在数据采集、传输、存储的过程中发挥着举足轻重的作用。目前已经被 LinkedIn，Uber, Twitter, Netflix 等大公司所采纳。</p><p><strong>优点：<strong>性能卓越，单机写入 TPS 约在</strong>百万条/秒</strong>，最大的优点，就是吞吐量高。时效性 ms 级可用性非常高，kafka 是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用,消费者采用 Pull 方式获取消息, 消息有序, 通过控制能够保证所有消息被消费且仅被消费一次;有优秀的第三方Kafka Web 管理界面 Kafka-Manager；在日志领域比较成熟，被多家公司和多个开源项目使用；功能支持：功能较为简单，主要支持简单的 MQ 功能，在大数据领域的实时计算以及日志采集被大规模使用。</p><p>**缺点：**Kafka 单机超过 64 个队列/分区，Load 会发生明显的飙高现象，队列越多，load 越高，发送消息响应时间变长，使用短轮询方式，实时性取决于轮询间隔时间，消费失败不支持重试；支持消息顺序，但是一台代理宕机后，就会产生消息乱序，社区更新较慢。</p><h4 id="rocketmq" tabindex="-1"><a class="header-anchor" href="#rocketmq" aria-hidden="true">#</a> RocketMQ</h4><p>RocketMQ 出自阿里巴巴的开源产品，用 Java 语言实现，在设计时参考了 Kafka，并做出了自己的一些改进。被阿里巴巴广泛应用在订单，交易，充值，流计算，消息推送，日志流式处理，binglog 分发等场景。</p><p>**优点：**单机吞吐量十万级,可用性非常高，分布式架构,消息可以做到 0 丢失,MQ 功能较为完善，还是分布式的，扩展性好,支持 10 亿级别的消息堆积，不会因为堆积导致性能下降,源码是 java 我们可以自己阅读源码，定制自己公司的 MQ。</p><p>**缺点：**支持的客户端语言不多，目前是 java 及 c++，其中 c++不成熟；社区活跃度一般,没有在 MQ核心中去实现 JMS 等接口,有些系统要迁移需要修改大量代码。</p><h4 id="rabbitmq" tabindex="-1"><a class="header-anchor" href="#rabbitmq" aria-hidden="true">#</a> RabbitMQ</h4><p>2007 年发布，是一个在 AMQP(高级消息队列协议)基础上完成的，可复用的企业消息系统，是当前最主流的消息中间件之一。</p><p>**优点：**由于 erlang 语言的高并发特性，性能较好；吞吐量到万级，MQ 功能比较完备,健壮、稳定、易用、跨平台、支持多种语言 如：Python、Ruby、.NET、Java、JMS、C、PHP、ActionScript、XMPP、STOMP等，支持 AJAX 文档齐全；开源提供的管理界面非常棒，用起来很好用,社区活跃度高；更新频率相当高。</p><p>**缺点：**商业版需要收费,学习成本较高。</p><h3 id="mq的选择" tabindex="-1"><a class="header-anchor" href="#mq的选择" aria-hidden="true">#</a> MQ的选择</h3><h4 id="kafka-1" tabindex="-1"><a class="header-anchor" href="#kafka-1" aria-hidden="true">#</a> Kafka</h4><p>Kafka 主要特点是基于 Pull 的模式来处理消息消费，追求高吞吐量，一开始的目的就是用于日志收集和传输，适合产生大量数据的互联网服务的数据收集业务。大型公司建议可以选用，如果有日志采集功能，肯定是首选 kafka 了。</p><h4 id="rocketmq-1" tabindex="-1"><a class="header-anchor" href="#rocketmq-1" aria-hidden="true">#</a> RocketMQ</h4><p>天生为金融互联网领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削峰，在大量交易涌入时，后端可能无法及时处理的情况。RoketMQ 在稳定性上可能更值得信赖，这些业务场景在阿里双 11 已经经历了多次考验，如果你的业务有上述并发场景，建议可以选择 RocketMQ。</p><h4 id="rabbitmq-1" tabindex="-1"><a class="header-anchor" href="#rabbitmq-1" aria-hidden="true">#</a> RabbitMQ</h4><p>结合 erlang 语言本身的并发优势，性能好时效性微秒级，社区活跃度也比较高，管理界面用起来十分方便，如果你的数据量没有那么大，中小型公司优先选择功能比较完备的 RabbitMQ。</p><h2 id="rabbitmq简介" tabindex="-1"><a class="header-anchor" href="#rabbitmq简介" aria-hidden="true">#</a> RabbitMQ简介</h2><p>2007年，Rabbit 技术公司基于 AMQP 标准开发的 RabbitMQ 1.0 发布。RabbitMQ 采用 Erlang 语言开发。Erlang 语言由 Ericson 设计，专门为开发高并发和分布式系统的一种语言，在电信领域使用广泛。</p><h3 id="rabbitmq四大核心概念" tabindex="-1"><a class="header-anchor" href="#rabbitmq四大核心概念" aria-hidden="true">#</a> RabbitMQ四大核心概念</h3><ul><li><p>生产者 产生数据发送消息的程序是生产者</p></li><li><p>交换机 交换机是 RabbitMQ 非常重要的一个部件，一方面它接收来自生产者的消息，另一方面它将消息推送到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推送到多个队列，亦或者是把消息丢弃，这个得有交换机类型决定。</p></li><li><p>队列</p><p>队列是 RabbitMQ 内部使用的一种数据结构，尽管消息流经 RabbitMQ 和应用程序，但它们只能存储在队列中。队列仅受主机的内存和磁盘限制的约束，本质上是一个大的消息缓冲区。许多生产者可以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。这就是我们使用队列的方式。</p></li><li><p>消费者</p><p>消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。请注意生产者，消费者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。</p></li></ul>',26),T={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_143731.png",target:"_blank",rel:"noopener noreferrer"},R=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_143731.png",alt:"img"},null,-1),D=e("h3",{id:"rabbitmq的工作模式",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#rabbitmq的工作模式","aria-hidden":"true"},"#"),a(" RabbitMQ的工作模式")],-1),B={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_222744.png",target:"_blank",rel:"noopener noreferrer"},j=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_222744.png",alt:"img"},null,-1),z=t('<ol><li><strong>简单模式</strong> HelloWorld： 一个生产者、一个消费者，不需要设置交换机（使用默认的交换机）。</li><li><strong>工作队列模式</strong> Work Queue： 一个生产者、多个消费者（竞争关系），不需要设置交换机（使用默认的交换机）。</li><li><strong>发布订阅模式</strong> Publish/subscribe：需要设置类型为 fanout 的交换机，并且交换机和队列进行绑定，当发送消息到交换机后，交换机会将消息发送到绑定的队列。</li><li><strong>路由模式</strong> Routing： 需要设置类型为 direct 的交换机，交换机和队列进行绑定，并且指定 routing key，当发送消息到交换机后，交换机会根据 routing key 将消息发送到对应的队列。</li><li><strong>通配符模式</strong> Topic：需要设置类型为 topic 的交换机，交换机和队列进行绑定，并且指定通配符方式的 routing key，当发送消息到交换机后，交换机会根据 routing key 将消息发送到对应的队列。</li></ol><h3 id="rabbitmq工作原理" tabindex="-1"><a class="header-anchor" href="#rabbitmq工作原理" aria-hidden="true">#</a> RabbitMQ工作原理</h3>',2),w={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_222911.png",target:"_blank",rel:"noopener noreferrer"},U=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_222911.png",alt:"img"},null,-1),L=t('<p>**Broker：**接收和分发消息的应用，RabbitMQ Server 就是 Message Broker</p><p>**Virtual host：**出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ server 提供的服务时，可以划分出多个 vhost，每个用户在自己的 vhost 创建 exchange／queue 等</p><p>**Connection：**publisher／consumer 和 broker 之间的 TCP 连接</p><p>**Channel：**如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCPConnection 的开销将是巨大的，效率也较低。Channel 是在 connection 内部建立的逻辑连接，如果应用程序支持多线程，通常每个 thread 创建单独的 channel 进行通讯，AMQP method 包含了 channel id 帮助客户端和 message broker 识别 channel，所以 channel 之间是完全隔离的。 l Channel 作为轻量级的Connection 极大减少了操作系统建立 TCP connection 的开销</p><p><strong>Exchange ：</strong> message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout(multicast)</p><p><strong>Queue ：</strong> 消息最终被送到这里等待 consumer 取走</p><p><strong>Binding ：</strong> exchange 和 queue 之间的虚拟连接，binding 中可以包含 routing key，Binding 信息被保存到 exchange 中的查询表中，用于 message 的分发依据</p><h3 id="rabbitmq安装" tabindex="-1"><a class="header-anchor" href="#rabbitmq安装" aria-hidden="true">#</a> RabbitMQ安装</h3><p>略….推荐使用Docker安装学习，参考文章：Docker操作笔记-从小白到入门</p>',9),P={href:"http://xn--ip-im8ckc:15672/",target:"_blank",rel:"noopener noreferrer"},I=t('<h4 id="角色说明" tabindex="-1"><a class="header-anchor" href="#角色说明" aria-hidden="true">#</a> 角色说明</h4><ul><li>超级管理员(administrator)：可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操 作。</li><li>监控者(monitoring)：可登陆管理控制台，同时可以查看rabbitmq节点的相关信息(进程数，内存使用 情况，磁盘使用情况等)。</li><li>策略制定者(policymaker)：可登陆管理控制台, 同时可以对policy进行管理。但无法查看节点的相关信息(上 图红框标识的部分)。</li><li>普通管理者(management)：仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理。</li><li>其他：无法登陆管理控制台，通常就是普通的生产者和消费者。</li></ul><h2 id="消息应答及持久化" tabindex="-1"><a class="header-anchor" href="#消息应答及持久化" aria-hidden="true">#</a> 消息应答及持久化</h2><h3 id="消息应答机制" tabindex="-1"><a class="header-anchor" href="#消息应答机制" aria-hidden="true">#</a> 消息应答机制</h3><h4 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h4><p>消费者完成一个任务可能需要一段时间，如果其中一个消费者处理一个长的任务并仅只完成了部分突然它挂掉了，会发生什么情况。RabbitMQ 一旦向消费者传递了一条消息，便立即将该消息标记为删除。在这种情况下，突然有个消费者挂掉了，我们将丢失正在处理的消息。以及后续发送给该消费这的消息，因为它无法接收到。为了保证消息在发送过程中不丢失，rabbitmq 引入消息应答机制，消息应答就是: <strong>消费者在接收到消息并且处理该消息之后</strong>，告诉rabbitmq 它已经处理了，rabbitmq 可以把该消息删除了。</p><h4 id="自动应答" tabindex="-1"><a class="header-anchor" href="#自动应答" aria-hidden="true">#</a> 自动应答</h4><p>消息发送后立即被认为已经传送成功，这种模式需要在<strong>高吞吐量和数据传输安全性方面做权衡</strong>,因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失了,当然另一方面这种模式消费者那边可以传递过载的消息，<strong>没有对传递的消息数量进行限制</strong>，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死， 所以<strong>这种模式仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用</strong>。</p><p>总结：尽量少用自动应答，自动应答是在接收到消息的一刹那就进行了应答，如果后续对消息进行了处理出现错误，不能重新从队列中获取消息处理。</p><h4 id="手动应答" tabindex="-1"><a class="header-anchor" href="#手动应答" aria-hidden="true">#</a> 手动应答</h4><h5 id="消息应答的方法" tabindex="-1"><a class="header-anchor" href="#消息应答的方法" aria-hidden="true">#</a> 消息应答的方法</h5><ul><li>Channel.basicAck(用于肯定确认)：RabbitMQ 已知道该消息并且成功的处理消息，可以将其丢弃了</li><li>Channel.basicNack(用于否定确认)</li><li>Channel.basicReject(用于否定确认)：与 Channel.basicNack 相比少一个参数(是否批量处理)，不处理该消息了直接拒绝，可以将其丢弃了</li></ul><p>手动应答的好处是可以批量应答并且减少网络拥堵</p>',13),H={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_225727.png",target:"_blank",rel:"noopener noreferrer"},X=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_225727.png",alt:"img"},null,-1),G=e("p",null,"multiple 的 true 和 false 代表不同意思",-1),O=e("ul",null,[e("li",null,"true 代表批量应答 channel 上未应答的消息，比如说 channel 上有传送 tag 的消息 5,6,7,8 当前 tag 是 8 那么此时5-8 的这些还未应答的消息都会被确认收到消息应答"),e("li",null,"false 同上面相比只会应答 tag=8 的消息 5,6,7 这三个消息依然不会被确认收到消息应答")],-1),K={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_225929.png",target:"_blank",rel:"noopener noreferrer"},V=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_225929.png",alt:"img"},null,-1),F=e("h3",{id:"消息自动重新入队",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#消息自动重新入队","aria-hidden":"true"},"#"),a(" 消息自动重新入队")],-1),J=e("p",null,"如果消费者由于某些原因失去连接(其通道已关闭，连接已关闭或 TCP 连接丢失)，导致消息未发送 ACK 确认，RabbitMQ 将了解到消息未完全处理，并将对其重新排队。如果此时其他消费者可以处理，它将很快将其重新分发给另一个消费者。这样，即使某个消费者偶尔死亡，也可以确保不会丢失任何消息。",-1),Y={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_230720.png",target:"_blank",rel:"noopener noreferrer"},W=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210902_230720.png",alt:"img"},null,-1),Z=e("h3",{id:"消息手动应答代码编写",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#消息手动应答代码编写","aria-hidden":"true"},"#"),a(" 消息手动应答代码编写")],-1),$=e("p",null,"默认消息采用的是自动应答，所以我们要想实现消息消费过程中不丢失，需要把自动应答改为手动应答，消费者在上面代码的基础上增加下面画红色部分代码。",-1),ee={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_093454.png",target:"_blank",rel:"noopener noreferrer"},ie=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_093454.png",alt:"img"},null,-1),ne=t(`<h4 id="消息生产者" tabindex="-1"><a class="header-anchor" href="#消息生产者" aria-hidden="true">#</a> 消息生产者</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Producer {
    // 队列名称
    public static final String TASK_QUEUE_NAME = &quot;ack_queue&quot;;

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        // 声明队列：队列名称，是否持久化，是否共享，自动删除，参数
        channel.queueDeclare(TASK_QUEUE_NAME, false, false, false, null);

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String message = scanner.next();
            channel.basicPublish(&quot;&quot;, TASK_QUEUE_NAME, null,
                    message.getBytes(StandardCharsets.UTF_8));
            log.info(&quot;生产者发送消息：{}&quot;, message);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>RabbitMQ 连接工具类</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class RabbitMqUtils {
    // 得到一个连接的 channel
    public static Channel getChannel() throws Exception {
        // 创建一个连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(&quot;127.0.0.1&quot;);
        factory.setPort(5672);
        factory.setUsername(&quot;guest&quot;);
        factory.setPassword(&quot;guest&quot;);
        factory.setVirtualHost(&quot;demo&quot;);
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        return channel;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消费者" tabindex="-1"><a class="header-anchor" href="#消费者" aria-hidden="true">#</a> 消费者</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Work01 {
    private static final String ACK_QUEUE_NAME = &quot;ack_queue&quot;;

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        System.out.println(&quot;Work01  等待接收消息处理时间较短&quot;);
        // 消息消费的时候如何处理消息
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody());
            // 业务处理耗时1秒
            SleepUtils.sleep(1);
            System.out.println(&quot; 接收到消息:&quot; + message);
            /**
             * 采用手动应答
             * 1. 消息标记 tag
             * 2. 是否批量应答未应答消息：不批量信道中的消息
             */
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        // ***采用手动应答
        boolean autoAck = false;
        channel.basicConsume(ACK_QUEUE_NAME, autoAck, deliverCallback, (consumerTag) -&gt; {
            System.out.println(consumerTag + &quot; 消费者取消消费接口回调逻辑&quot;);
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>睡眠工具</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class SleepUtils {
    public static void sleep(int second) {
        try {
            Thread.sleep(1000L * second);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rabbitmq-持久化" tabindex="-1"><a class="header-anchor" href="#rabbitmq-持久化" aria-hidden="true">#</a> <strong>RabbitMQ</strong> 持久化</h3><h4 id="持久化概念" tabindex="-1"><a class="header-anchor" href="#持久化概念" aria-hidden="true">#</a> 持久化概念</h4><p>刚刚我们已经看到了如何处理任务不丢失的情况，但是如何<strong>保障当 RabbitMQ 服务停掉以后消息生产者发送过来的消息不丢失</strong>。默认情况下 RabbitMQ 退出或由于某种原因崩溃时，它忽视队列和消息，除非告知它不要这样做。确保消息不会丢失需要做两件事：我们需要将<strong>队列和消息</strong>都标记为持久化。</p><h4 id="队列实现持久化" tabindex="-1"><a class="header-anchor" href="#队列实现持久化" aria-hidden="true">#</a> 队列实现持久化</h4><p>之前我们创建的队列都是非持久化的，rabbitmq 如果重启的化，该队列就会被删除掉，如果 要队列实现持久化 需要在声明队列的时候把 durable 参数设置为持久化</p>`,13),ae={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104223.png",target:"_blank",rel:"noopener noreferrer"},te=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104223.png",alt:"img"},null,-1),se=e("p",null,"但是需要注意的就是如果之前声明的队列不是持久化的，需要把原先队列先删除，或者重新创建一个持久化的队列，不然就会出现错误。",-1),le={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104728.png",target:"_blank",rel:"noopener noreferrer"},re=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104728.png",alt:"img"},null,-1),de=e("p",null,"以下为控制台中持久化与非持久化队列的 UI 显示区：",-1),ue={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104945.png",target:"_blank",rel:"noopener noreferrer"},oe=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_104945.png",alt:"img"},null,-1),ce=e("h4",{id:"消息实现持久化",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#消息实现持久化","aria-hidden":"true"},"#"),a(" 消息实现持久化")],-1),be=e("p",null,"要想让消息实现持久化需要在消息生产者修改代码，MessageProperties.PERSISTENT_TEXT_PLAIN 添加这个属性，如下图",-1),ve={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_105242.png",target:"_blank",rel:"noopener noreferrer"},he=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_105242.png",alt:"img"},null,-1),me=e("p",null,"将消息标记为持久化并不能完全保证不会丢失消息。尽管它告诉 RabbitMQ 将消息保存到磁盘，但是 这里依然存在当消息刚准备存储在磁盘的时候 但是还没有存储完，消息还在缓存的一个间隔点。此时并没 有真正写入磁盘。持久性保证并不强，但是对于我们的简单任务队列而言，这已经绰绰有余了。如果需要 更强有力的持久化策略，参考后边课件发布确认章节。",-1),ge=e("h3",{id:"不公平分发",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#不公平分发","aria-hidden":"true"},"#"),a(" 不公平分发")],-1),pe=e("p",null,"在最开始的时候我们学习到 RabbitMQ 分发消息采用的轮训分发，但是在某种场景下这种策略并不是很好，比方说有两个消费者在处理任务，其中有个消费者 1 处理任务的速度非常快，而另外一个消费者 2 处理速度却很慢，这个时候我们还是采用轮训分发的化就会到这处理速度快的这个消费者很大一部分时间处于空闲状态，而处理慢的那个消费者一直在干活，这种分配方式在这种情况下其实就不太好，但是 RabbitMQ 并不知道这种情况它依然很公平的进行分发。",-1),_e=e("p",null,"注：为了避免这种情况，我们可以设置参数 channel.basicQos(1)，不公平分发由消费方设置，生产环境应该设置为不公平分发。",-1),qe={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_03532.png",target:"_blank",rel:"noopener noreferrer"},fe=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_03532.png",alt:"img"},null,-1),xe={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_03616.png",target:"_blank",rel:"noopener noreferrer"},Me=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_03616.png",alt:"img"},null,-1),Ee={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_04707.png",target:"_blank",rel:"noopener noreferrer"},ye=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_04707.png",alt:"img"},null,-1),Qe=t(`<p>意思就是如果这个任务我还没有处理完或者我还没有应答你，你先别分配给我，我目前只能处理一个任务，然后 rabbitmq 就会把该任务分配给没有那么忙的那个空闲消费者，当然如果所有的消费者都没有完成手上任务，队列还在不停的添加新任务，队列有可能就会遇到队列被撑满的情况，这个时候就只能添加新的 worker 或者改变其他存储任务的策略。</p><h2 id="发布确认" tabindex="-1"><a class="header-anchor" href="#发布确认" aria-hidden="true">#</a> 发布确认</h2><h3 id="发布确认原理" tabindex="-1"><a class="header-anchor" href="#发布确认原理" aria-hidden="true">#</a> 发布确认原理</h3><p>生产者将信道设置成 confirm 模式，一旦信道进入confirm 模式，所有在该信道上面发布的消息都将会被指派一个唯一的ID(从1开始)，一旦消息被投递到所有匹配的队列之后，broker 就会发送一个确认给生产者(包含消息的唯一ID)，这就使得生产者知道消息已经正确到达目的队列了，如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出，broker回传 给生产者的确认消息中 delivery-tag 域包含了确认消息的序列号，此外broker也可以设置basic.ack的multiple域，表示到这个序列号之前的所有消息都已经得到了处理。confirm 模式最大的好处在于他是异步的，一旦发布一条消息，生产者应用程序就可以在等信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果 RabbitMQ因为自身内部错误导致消息丢失，就会发送一条nack消 息，生产者应用程序同样可以在回调方法中处理该nack消息。</p><h3 id="发布确认的策略" tabindex="-1"><a class="header-anchor" href="#发布确认的策略" aria-hidden="true">#</a> 发布确认的策略</h3><h4 id="开启发布确认的方法" tabindex="-1"><a class="header-anchor" href="#开启发布确认的方法" aria-hidden="true">#</a> 开启发布确认的方法</h4><p>发布确认默认是没有开启的，如果要开启需要调用方法 confirmSelect，每当你要想使用发布确认，都需要在 channel 上调用该方法。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
Channel channel = connection.createchannel();
channel.confirmselect();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第一种-单个确认发布" tabindex="-1"><a class="header-anchor" href="#第一种-单个确认发布" aria-hidden="true">#</a> 第一种：单个确认发布</h4><p>这是一种简单的确认方式，它是一种<strong>同步确认发布的方式</strong>，也就是发布一个消息之后只有它 被确认发布，后续的消息才能继续发布,waitForConfirmsOrDie(long)这个方法只有在消息被确认 的时候才返回，如果在指定时间范围内这个消息没有被确认那么它将抛出异常。这种确认方式有一个最大的缺点就是:<strong>发布速度特别的慢</strong>，因为如果没有确认发布的消息就会 阻塞所有后续消息的发布，这种方式最多提供每秒不超过数百条发布消息的吞吐量。当然对于某 些应用程序来说这可能已经足够了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
// 发布单条消息1000条耗时测试： 722ms
public static void publishMessageOne() throws Exception {
    try (Channel channel = RabbitMqUtils.getChannel()) {
        String queueName = UUID.randomUUID().toString();
        channel.queueDeclare(queueName, false, false, false, null);
        // 开启发布确认
        channel.confirmSelect();
        long begin = System.currentTimeMillis();
        for (int i = 0; i &lt; MESSAGE_COUNT; i++) {
            String message = i + &quot;&quot;;
            channel.basicPublish(&quot;&quot;, queueName, null, message.getBytes());
            // 发送之后马上进行发布确认，服务端返回 false 或超时时间内未返回，生产者可以消息重发
            boolean flag = channel.waitForConfirms();
            if (flag) {
                System.out.println(&quot; 消息发送成功&quot;);
            }
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot; 发布&quot; + MESSAGE_COUNT + &quot; 个单独确认消息, 耗时&quot; + (end - begin) + &quot;ms&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第二种-批量确认发布" tabindex="-1"><a class="header-anchor" href="#第二种-批量确认发布" aria-hidden="true">#</a> 第二种：批量确认发布</h4><p>上面那种方式非常慢，与单个等待确认消息相比，先发布一批消息然后一起确认可以极大地 提高吞吐量，当然这种方式的缺点就是:当发生故障导致发布出现问题时，不知道是哪个消息出现 问题了，我们必须将整个批处理保存在内存中，以记录重要的信息而后重新发布消息。当然这种 方案仍然是同步的，也一样阻塞消息的发布。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
// 批量发布确认 发布1000个消息，耗时141ms
public static void publishMessageBatch() throws Exception {
    try (Channel channel = RabbitMqUtils.getChannel()) {
        String queueName = UUID.randomUUID().toString();
        channel.queueDeclare(queueName, false, false, false, null);
        // 开启发布确认
        channel.confirmSelect();
        // 批量确认消息大小
        int batchSize = 100;
        // 未确认消息个数
        int outstandingMessageCount = 0;
        long begin = System.currentTimeMillis();
        for (int i = 0; i &lt; MESSAGE_COUNT; i++) {
            String message = i + &quot;&quot;;
            channel.basicPublish(&quot;&quot;, queueName, null, message.getBytes());
            outstandingMessageCount++;
            // 100条确认一次
            if (outstandingMessageCount == batchSize) {
                channel.waitForConfirms();
                outstandingMessageCount = 0;
            }
        }
        // 为了确保还有剩余没有确认消息 再次确认
        if (outstandingMessageCount &gt; 0) {
            channel.waitForConfirms();
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot; 发布&quot; + MESSAGE_COUNT + &quot; 个批量确认消息, 耗时&quot; + (end - begin) + &quot;ms&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第三种-异步确认发布" tabindex="-1"><a class="header-anchor" href="#第三种-异步确认发布" aria-hidden="true">#</a> 第三种：异步确认发布</h4><p>异步确认虽然编程逻辑比上两个要复杂，但是性价比最高，无论是可靠性还是效率都没得说， 他是利用回调函数来达到消息可靠性传递的，这个中间件也是通过函数回调来保证是否投递成功， 下面就让我们来详细讲解异步确认是怎么实现的。</p>`,16),Ne={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_11902.png",target:"_blank",rel:"noopener noreferrer"},Ae=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210907_11902.png",alt:"img"},null,-1),ke=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA

// 异步发布确认  发布1000个消息，耗时62ms
public static void publishMessageAsync() throws Exception {
    try (Channel channel = RabbitMqUtils.getChannel()) {
        String queueName = UUID.randomUUID().toString();
        channel.queueDeclare(queueName, false, false, false, null);
        // 开启发布确认
        channel.confirmSelect();
        	/**
             *  线程安全有序的一个哈希表，适用于高并发的情况
             * 1. 轻松的将序号与消息进行关联
             * 2. 轻松批量删除条目 只要给到序列号
             * 3. 支持并发访问
             */
        ConcurrentSkipListMap&lt;Long,  String&gt; outstandingConfirms  =  new
            ConcurrentSkipListMap&lt;&gt;();
       		/**
             *  确认收到消息的一个回调
             * 1. 消息序列号
             * 2.true 可以确认小于等于当前序列号的消息
             * false 确认当前序列号消息
             */
        ConfirmCallback ackCallback = (sequenceNumber, multiple) -&gt; {
            if (multiple) {
                // 返回的是小于等于当前序列号的未确认消息 是一个 map
                ConcurrentNavigableMap&lt;Long,  String&gt; confirmed  =
                    outstandingConfirms.headMap(sequenceNumber, true);
                // 清除该部分未确认消息
                confirmed.clear();
            }else{
                // 只清除当前序列号的消息
                outstandingConfirms.remove(sequenceNumber);
            }
        };
        ConfirmCallback nackCallback = (sequenceNumber, multiple) -&gt; {
            String message = outstandingConfirms.get(sequenceNumber);
            System.out.println(&quot; 发布的消息&quot;+message+&quot; 未被确认，序列号&quot;+sequenceNumber);
        };
       		/**
             *  添加一个异步确认的监听器
             * 1. 确认收到消息的回调
             * 2. 未收到消息的回调
             */
        channel.addConfirmListener(ackCallback, null);
        long begin = System.currentTimeMillis();
        for (int i = 0; i &lt; MESSAGE_COUNT; i++) {
            String message = &quot; 消息&quot; + i;
            	/**
                 * channel.getNextPublishSeqNo() 获取下一个消息的序列号
                 *  通过序列号与消息体进行一个关联
                 *  全部都是未确认的消息体
                 */
            outstandingConfirms.put(channel.getNextPublishSeqNo(), message);
            channel.basicPublish(&quot;&quot;, queueName, null, message.getBytes());
        }
        long end = System.currentTimeMillis();
        System.out.println(&quot; 发布&quot; + MESSAGE_COUNT + &quot; 个异步确认消息, 耗时&quot; + (end - begin) + &quot;ms&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="如何处理异步未确认消息" tabindex="-1"><a class="header-anchor" href="#如何处理异步未确认消息" aria-hidden="true">#</a> 如何处理异步未确认消息</h4><p>好的解决的解决方案就是把未确认的消息放到一个基于内存的能被发布线程访问的队列， 比如说用 ConcurrentLinkedQueue 这个队列在 confirm callbacks 与发布线程之间进行消息的传 递。</p><h4 id="_3种发布确认速度对比" tabindex="-1"><a class="header-anchor" href="#_3种发布确认速度对比" aria-hidden="true">#</a> 3种发布确认速度对比</h4><ul><li>单独发布消息：同步等待确认，简单，但吞吐量非常有限。</li><li>批量发布消息：批量同步等待确认，简单，合理的吞吐量，一旦出现问题但很难推断出是那条消息出现了问题。</li><li>异步处理：最佳性能和资源使用，在出现错误的情况下可以很好地控制，但是实现起来稍微难些。</li></ul><h2 id="交换机" tabindex="-1"><a class="header-anchor" href="#交换机" aria-hidden="true">#</a> 交换机</h2><p>在上一节中，我们创建了一个工作队列。我们假设的是工作队列背后，每个任务都恰好交付给一个消 费者(工作进程)。在这一部分中，我们将做一些完全不同的事情-我们将消息传达给多个消费者。这种模式 称为 ”发布/订阅”，为了说明这种模式，我们将构建一个简单的日志系统。它将由两个程序组成:第一个程序将发出日志消 息，第二个程序是消费者。其中我们会启动两个消费者，其中一个消费者接收到消息后把日志存储在磁盘，另外一个消费者接收到消息后把消息打印在屏幕上，事实上第一个程序发出的日志消息将广播给所有消费者。</p><h3 id="exchanges概念" tabindex="-1"><a class="header-anchor" href="#exchanges概念" aria-hidden="true">#</a> Exchanges概念</h3><p>RabbitMQ 消息传递模型的核心思想是: <strong>生产者生产的消息从不会直接发送到队列</strong>。实际上，通常生产者甚至都不知道这些消息传递传递到了哪些队列中。相反，<strong>生产者只能将消息发送到交换机(exchange)</strong>，交换机工作的内容非常简单，一方面它接收来 自生产者的消息，另一方面将它们推入队列。交换机必须确切知道如何处理收到的消息。是应该把这些消 息放到特定队列还是说把他们到许多队列中还是说应该丢弃它们。这就的由交换机的类型来决定。</p><h3 id="exchanges-的类型" tabindex="-1"><a class="header-anchor" href="#exchanges-的类型" aria-hidden="true">#</a> Exchanges 的类型</h3><ul><li>直接(direct) — 路由类型</li><li>主题(topic) — 通配符匹配模式</li><li>标题(headers) — 已经不用了</li><li>扇出(fanout) — 发布订阅类型</li></ul><h3 id="无名-exchange" tabindex="-1"><a class="header-anchor" href="#无名-exchange" aria-hidden="true">#</a> 无名 exchange</h3><p>第一个参数是交换机的名称。空字符串表示默认或无名称交换机：消息能路由发送到队列中其实是由 routingKey(bindingkey)绑定 key 指定的。</p>`,13),Ce={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_140200.png",target:"_blank",rel:"noopener noreferrer"},Se=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_140200.png",alt:"img"},null,-1),Te=e("h3",{id:"临时队列",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#临时队列","aria-hidden":"true"},"#"),a(" 临时队列")],-1),Re=e("p",null,[a("每当我们连接到 Rabbit 时，我们都需要一个全新的空队列，为此我们可以创建一个具有"),e("strong",null,"随机名称的队列"),a("，或者能让服务器为我们选择一个随机队列名称那就更好了。其次**一旦我们断开了消费者的连接，队列将被自动删除。**创建临时队列的方式如下: "),e("code",null,"String queueName = channel.queueDeclare().getQueue();")],-1),De=e("h3",{id:"绑定-bindings",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#绑定-bindings","aria-hidden":"true"},"#"),a(" 绑定(bindings)")],-1),Be=e("p",null,"什么是 bingding 呢，binding 其实是 exchange 和 queue 之间的桥梁，它告诉我们 exchange 和那个队 列进行了绑定关系。比如说下面这张图告诉我们的就是 X 与 Q1 和 Q2 进行了绑定",-1),je={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_140800.png",target:"_blank",rel:"noopener noreferrer"},ze=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_140800.png",alt:"img"},null,-1),we=e("h3",{id:"fanout-发布订阅交换机",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#fanout-发布订阅交换机","aria-hidden":"true"},"#"),a(" Fanout(发布订阅交换机)")],-1),Ue=e("p",null,[a("Fanout 这种类型非常简单。正如从名称中猜到的那样，它是将接收到的所有消息"),e("strong",null,"广播"),a("到它知道的 所有队列中。系统中默认有些 exchange 类型")],-1),Le={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_141025.png",target:"_blank",rel:"noopener noreferrer"},Pe=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210903_141025.png",alt:"img"},null,-1),Ie=e("h4",{id:"fanout-实战",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#fanout-实战","aria-hidden":"true"},"#"),a(" Fanout 实战")],-1),He={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_230006.png",target:"_blank",rel:"noopener noreferrer"},Xe=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_230006.png",alt:"img"},null,-1),Ge=e("p",null,"Logs 和临时队列的绑定关系如下图",-1),Oe={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_230126.png",target:"_blank",rel:"noopener noreferrer"},Ke=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_230126.png",alt:"img"},null,-1),Ve=t(`<h5 id="发布订阅发布者" tabindex="-1"><a class="header-anchor" href="#发布订阅发布者" aria-hidden="true">#</a> 发布订阅发布者</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class EmitLog {
    private static final String EXCHANGE_NAME = &quot;logs&quot;;
    public static void main(String[] argv) throws Exception {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            /**
             *  声明一个 exchange
             * 1.exchange 的名称
             * 2.exchange 的类型
             */
            channel.exchangeDeclare(EXCHANGE_NAME, &quot;fanout&quot;);
            Scanner sc = new Scanner(System.in);
            System.out.println(&quot; 请输入信息&quot;);
            while (sc.hasNext()) {
                String message = sc.nextLine();
                channel.basicPublish(EXCHANGE_NAME, &quot;&quot;, null, message.getBytes(&quot;UTF-8&quot;));
                System.out.println(&quot; 生产者发出消息&quot; + message);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="发布订阅接收者1" tabindex="-1"><a class="header-anchor" href="#发布订阅接收者1" aria-hidden="true">#</a> 发布订阅接收者1</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class ReceiveLogs01 {
    private static final String EXCHANGE_NAME = &quot;logs&quot;;
    
    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, &quot;fanout&quot;);
        /**
         *  生成一个临时的队列 队列的名称是随机的
         *  当消费者断开和该队列的连接时 队列自动删除
         */
        String queueName = channel.queueDeclare().getQueue();
        // 把该临时队列绑定我们的 exchange  其中 routingkey( 也称之为 binding key) 为空字符串
        channel.queueBind(queueName, EXCHANGE_NAME, &quot;&quot;);
        System.out.println(&quot;01等待接收消息, 把接收到的消息打印在屏幕.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(&quot;01控制台打印接收到的消息&quot; + message);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="发布订阅接收者2" tabindex="-1"><a class="header-anchor" href="#发布订阅接收者2" aria-hidden="true">#</a> 发布订阅接收者2</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class ReceiveLogs02 {
    private static final String EXCHANGE_NAME = &quot;logs&quot;;

    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, &quot;fanout&quot;);
        /**
         *  生成一个临时的队列 队列的名称是随机的
         *  当消费者断开和该队列的连接时 队列自动删除
         */
        String queueName = channel.queueDeclare().getQueue();
        // 把该临时队列绑定我们的 exchange  其中 routingkey( 也称之为 binding key) 为空字符串
        channel.queueBind(queueName, EXCHANGE_NAME, &quot;&quot;);
        System.out.println(&quot;02等待接收消息, 把接收到的消息打印在屏幕.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(&quot;02控制台打印接收到的消息&quot; + message);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="direct-exchange-直接交换机" tabindex="-1"><a class="header-anchor" href="#direct-exchange-直接交换机" aria-hidden="true">#</a> Direct exchange(直接交换机)</h3><p>上一节中，我们构建了一个简单的日志记录系统。我们能够向许多接收者广播日志消息。在本节我们将向其中添加一些特别的功能-比方说我们只让某个消费者订阅发布的部分消息。例如我们只把严重错误消息定向存储到日志文件(以节省磁盘空间)，同时仍然能够在控制台上打印所有日志消息。我们再次来回顾一下什么是 bindings，绑定是交换机和队列之间的桥梁关系。也可以这么理解：队列只对它绑定的交换机的消息感兴趣。绑定用参数：routingKey 来表示也可称该参数为 binding key，创建绑定我们用代码:<code>channel.queueBind(queueName, EXCHANGE_NAME, &quot;routingKey&quot;);</code><strong>绑定之后的意义由其交换类型决定。</strong></p>`,8),Fe={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_232643.png",target:"_blank",rel:"noopener noreferrer"},Je=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_232643.png",alt:"img"},null,-1),Ye={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_232754.png",target:"_blank",rel:"noopener noreferrer"},We=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_232754.png",alt:"img"},null,-1),Ze=t(`<h4 id="直接交换机发布者" tabindex="-1"><a class="header-anchor" href="#直接交换机发布者" aria-hidden="true">#</a> 直接交换机发布者</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class EmitLogDirect {
    private static final String EXCHANGE_NAME = &quot;direct_logs&quot;;

    public static void main(String[] argv) throws Exception {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
            // 创建多个 bindingKey
            Map&lt;String, String&gt; bindingKeyMap = new HashMap&lt;&gt;();
            bindingKeyMap.put(&quot;info&quot;, &quot; 普通 info  信息&quot;);
            bindingKeyMap.put(&quot;warning&quot;, &quot; 警告 warning  信息&quot;);
            bindingKeyMap.put(&quot;error&quot;, &quot; 错误 error  信息&quot;);
            //debug 没有消费这接收这个消息 所有就丢失了
            bindingKeyMap.put(&quot;debug&quot;, &quot; 调试 debug  信息&quot;);
            for (Map.Entry&lt;String, String&gt; bindingKeyEntry : bindingKeyMap.entrySet()) {
                String bindingKey = bindingKeyEntry.getKey();
                String message = bindingKeyEntry.getValue();
                channel.basicPublish(EXCHANGE_NAME, bindingKey, null, message.getBytes(StandardCharsets.UTF_8));
                System.out.println(&quot; 生产者发出消息:&quot; + message);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="直接交换机消费者1" tabindex="-1"><a class="header-anchor" href="#直接交换机消费者1" aria-hidden="true">#</a> 直接交换机消费者1</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class ReceiveLogsDirect01 {
    private static final String EXCHANGE_NAME = &quot;direct_logs&quot;;

    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
        String queueName = &quot;disk&quot;;
        channel.queueDeclare(queueName, false, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, &quot;error&quot;);
        System.out.println(&quot; 等待接收消息.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), &quot;UTF-8&quot;);
            message = &quot; 接收绑定键:&quot; + delivery.getEnvelope().getRoutingKey() + &quot;, 消息:&quot; + message;
            // 写磁盘忽略
            System.out.println(&quot; 错误日志已经接收&quot; + message);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="直接交换机消费者2" tabindex="-1"><a class="header-anchor" href="#直接交换机消费者2" aria-hidden="true">#</a> 直接交换机消费者2</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class ReceiveLogsDirect02 {
    private static final String EXCHANGE_NAME = &quot;direct_logs&quot;;

    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
        String queueName = &quot;console&quot;;
        channel.queueDeclare(queueName, false, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, &quot;info&quot;);
        channel.queueBind(queueName, EXCHANGE_NAME, &quot;warning&quot;);
        System.out.println(&quot; 等待接收消息.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), &quot;UTF-8&quot;);
            System.out.println(&quot;  接 收 绑 定 键 :&quot; + delivery.getEnvelope().getRoutingKey() + &quot;, 消息:&quot; + message);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="topics-主题交换机" tabindex="-1"><a class="header-anchor" href="#topics-主题交换机" aria-hidden="true">#</a> Topics(主题交换机)</h3><p>在上一个小节中，我们改进了日志记录系统。我们没有使用只能进行随意广播的 fanout 交换机，而是使用了 direct 交换机，从而有能实现有选择性地接收日志。尽管使用 direct 交换机改进了我们的系统，但是它仍然存在局限性-比方说我们想接收的日志类型有info.base 和 info.advantage，某个队列只想 info.base 的消息，那这个时候 direct 就办不到了。这个时候就只能使用 topic 类型。</p><h4 id="topic-要求" tabindex="-1"><a class="header-anchor" href="#topic-要求" aria-hidden="true">#</a> Topic 要求</h4><p>发送到类型是 topic 交换机的消息的 routing_key 不能随意写，必须满足一定的要求，它必须是一个单词列表，以点号分隔开。这些单词可以是任意单词，比如说：”stock.usd.nyse”, “nyse.vmw”,”quick.orange.rabbit”.这种类型的。当然这个单词列表最多不能超过 255 个字节。在这个规则列表中，其中有两个替换符是大家需要注意的</p><ul><li>*(星号)可以代替一个单词</li><li>#(井号)可以替代零个或多个单词</li></ul><h4 id="topic-匹配案例" tabindex="-1"><a class="header-anchor" href="#topic-匹配案例" aria-hidden="true">#</a> Topic 匹配案例</h4><p>下图绑定关系如下： Q1–&gt;绑定的是：中间带 orange 带 3 个单词的字符串(<em>.orange.</em>) Q2–&gt;绑定的是：最后一个单词是 rabbit 的 3 个单词(<em>.</em>.rabbit) 第一个单词是 lazy 的多个单词(lazy.#)</p>`,13),$e={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_235635.png",target:"_blank",rel:"noopener noreferrer"},ei=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210910_235635.png",alt:"img"},null,-1),ii=t('<p>上图是一个队列绑定关系图，我们来看看他们之间数据接收情况是怎么样的 quick.orange.rabbit ———— 被队列 Q1Q2 接收到 lazy.orange.elephant ———— 被队列 Q1Q2 接收到 quick.orange.fox ———— 被队列 Q1 接收到 lazy.brown.fox ———— 被队列 Q2 接收到 lazy.pink.rabbit ———— 虽然满足两个绑定但只被队列 Q2 接收一次 quick.brown.fox ———— 不匹配任何绑定不会被任何队列接收到会被丢弃 quick.orange.male.rabbit ———— 是四个单词不匹配任何绑定会被丢弃 lazy.orange.male.rabbit ———— 是四个单词但匹配 Q2</p><p>当队列绑定关系是下列这种情况时需要引起注意 <strong>当一个队列绑定键是#,那么这个队列将接收所有数据</strong>，就有点像 fanout 了，如果队列绑定键当中没有#和*出现，那么该队列绑定类型就是 direct 了。</p><h2 id="死信队列" tabindex="-1"><a class="header-anchor" href="#死信队列" aria-hidden="true">#</a> 死信队列</h2><h3 id="死信的概念" tabindex="-1"><a class="header-anchor" href="#死信的概念" aria-hidden="true">#</a> 死信的概念</h3><p>先从概念解释上搞清楚这个定义，死信，顾名思义就是无法被消费的消息，字面意思可以这样理 解，一般来说，producer 将消息投递到 broker 或者直接到 queue 里了，consumer 从 queue 取出消息 进行消费，但某些时候由于特定的原因导致 queue 中的某些消息无法被消费，这样的消息如果没有 后续的处理，就变成了死信，有死信自然就有了死信队列。</p><p>应用场景:为了保证订单业务的消息数据不丢失，需要使用到 RabbitMQ 的死信队列机制，当消息 消费发生异常时，将消息投入死信队列中.还有比如说: 用户在商城下单成功并点击去支付后在指定时 间未支付时自动失效</p><h4 id="死信的来源" tabindex="-1"><a class="header-anchor" href="#死信的来源" aria-hidden="true">#</a> 死信的来源</h4><ol><li>消息 TTL 过期</li><li>队列达到最大长度(队列满了，无法再添加数据到 mq 中)</li><li>消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false.</li></ol><h4 id="代码架构图" tabindex="-1"><a class="header-anchor" href="#代码架构图" aria-hidden="true">#</a> 代码架构图</h4>',9),ni={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_01243.png",target:"_blank",rel:"noopener noreferrer"},ai=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_01243.png",alt:"img"},null,-1),ti=t(`<h4 id="消息ttl过期代码" tabindex="-1"><a class="header-anchor" href="#消息ttl过期代码" aria-hidden="true">#</a> 消息TTL过期代码</h4><h5 id="死信生产者" tabindex="-1"><a class="header-anchor" href="#死信生产者" aria-hidden="true">#</a> 死信生产者</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Producer {
    private static final String NORMAL_EXCHANGE = &quot;normal_exchange&quot;;

    public static void main(String[] argv) throws Exception {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
            // 设置消息的 TTL 时间
            AMQP.BasicProperties properties = new
                    AMQP.BasicProperties().builder().expiration(&quot;10000&quot;).build();
            // 该信息是用作演示队列个数限制
            for (int i = 1; i &lt; 11; i++) {
                String message = &quot;info&quot; + i;
                channel.basicPublish(NORMAL_EXCHANGE, &quot;zhangsan&quot;, properties, message.getBytes());
                System.out.println(&quot; 生产者发送消息:&quot; + message);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="死信消费者c1" tabindex="-1"><a class="header-anchor" href="#死信消费者c1" aria-hidden="true">#</a> 死信消费者C1</h5><p>消费者 C1 ( 启动之后关闭该消费者 模拟其接收不到消息)</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Consumer01 {
    // 普通交换机名称
    private static final String NORMAL_EXCHANGE = &quot;normal_exchange&quot;;
    // 死信交换机名称
    private static final String DEAD_EXCHANGE = &quot;dead_exchange&quot;;

    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        // 声明死信和普通交换机 类型为 direct
        channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
        channel.exchangeDeclare(DEAD_EXCHANGE, BuiltinExchangeType.DIRECT);
        // 声明死信队列
        String deadQueue = &quot;dead-queue&quot;;
        channel.queueDeclare(deadQueue, false, false, false, null);
        // 死信队列绑定死信交换机与 routingkey
        channel.queueBind(deadQueue, DEAD_EXCHANGE, &quot;lisi&quot;);
        // 正常队列绑定死信队列信息
        Map&lt;String, Object&gt; params = new HashMap&lt;&gt;();
        // 正常队列设置死信交换机 参数 key 是固定值
        params.put(&quot;x-dead-letter-exchange&quot;, DEAD_EXCHANGE);
        // 正常队列设置死信 routing-key  参数 key 是固定值
        params.put(&quot;x-dead-letter-routing-key&quot;, &quot;lisi&quot;);
        String normalQueue = &quot;normal-queue&quot;;
        channel.queueDeclare(normalQueue, false, false, false, params);
        channel.queueBind(normalQueue, NORMAL_EXCHANGE, &quot;zhangsan&quot;);
        System.out.println(&quot; 等待接收消息.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), &quot;UTF-8&quot;);
            System.out.println(&quot;Consumer01  接收到消息&quot; + message);
        };
        channel.basicConsume(normalQueue, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="死信队列消费者" tabindex="-1"><a class="header-anchor" href="#死信队列消费者" aria-hidden="true">#</a> 死信队列消费者</h5><p>消费者 C2 ( 以上步骤完成后 启动 C2 消费者它消费死信队列里面的消息)</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Consumer02 {
    private static final String DEAD_EXCHANGE = &quot;dead_exchange&quot;;

    public static void main(String[] argv) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.exchangeDeclare(DEAD_EXCHANGE, BuiltinExchangeType.DIRECT);
        String deadQueue = &quot;dead-queue&quot;;
        channel.queueDeclare(deadQueue, false, false, false, null);
        channel.queueBind(deadQueue, DEAD_EXCHANGE, &quot;lisi&quot;);
        System.out.println(&quot; 等待接收死信队列消息.....&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String message = new String(delivery.getBody(), &quot;UTF-8&quot;);
            System.out.println(&quot;Consumer02  接收死信队列的消息&quot; + message);
        };
        channel.basicConsume(deadQueue, true, deliverCallback, consumerTag -&gt; {
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),si={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_02525.png",target:"_blank",rel:"noopener noreferrer"},li=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_02525.png",alt:"img"},null,-1),ri=t(`<h3 id="队列达到最大长度" tabindex="-1"><a class="header-anchor" href="#队列达到最大长度" aria-hidden="true">#</a> 队列达到最大长度</h3><h4 id="生产者" tabindex="-1"><a class="header-anchor" href="#生产者" aria-hidden="true">#</a> 生产者</h4><p>消息生产者代码去掉 TTL 属性</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class TooLongProducer {
    private static final String NORMAL_EXCHANGE = &quot;normal_exchange&quot;;

    public static void main(String[] argv) throws Exception {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
            // 该信息是用作演示队列个数限制
            for (int i = 1; i &lt; 11; i++) {
                String message = &quot;info&quot; + i;
                channel.basicPublish(NORMAL_EXCHANGE, &quot;zhangsan&quot;, null, message.getBytes());
                System.out.println(&quot; 生产者发送消息:&quot; + message);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消费者-1" tabindex="-1"><a class="header-anchor" href="#消费者-1" aria-hidden="true">#</a> 消费者</h4><p>C1 消费者修改以下代码 ( 启动之后关闭该消费者 模拟其接收不到消息)</p>`,6),di={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03017.png",target:"_blank",rel:"noopener noreferrer"},ui=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03017.png",alt:"img"},null,-1),oi=e("p",null,"注意此时需要把原先队列删除 因为参数改变了 ,C2 消费者代码不变( 启动 C2 消费者)",-1),ci={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03245.png",target:"_blank",rel:"noopener noreferrer"},bi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03245.png",alt:"img"},null,-1),vi=t('<h3 id="消息被拒进入死信" tabindex="-1"><a class="header-anchor" href="#消息被拒进入死信" aria-hidden="true">#</a> 消息被拒进入死信</h3><p>代码略</p><h2 id="延迟队列" tabindex="-1"><a class="header-anchor" href="#延迟队列" aria-hidden="true">#</a> 延迟队列</h2><p>延时队列,队列内部是有序的，最重要的特性就体现在它的延时属性上，延时队列中的元素是希望在指定时间到了以后或之前取出和处理，简单来说，延时队列就是用来存放需要在指定时间被处理的元素的队列。</p><h3 id="延迟队列使用场景" tabindex="-1"><a class="header-anchor" href="#延迟队列使用场景" aria-hidden="true">#</a> 延迟队列使用场景</h3><ol><li>订单在十分钟之内未支付则自动取消</li><li>新创建的店铺，如果在十天内都没有上传过商品，则自动发送消息提醒。</li><li>用户注册成功后，如果三天内没有登陆则进行短信提醒。</li><li>用户发起退款，如果三天内没有得到处理则通知相关运营人员。</li><li>预定会议后，需要在预定的时间点前十分钟通知各个与会人员参加会议</li></ol><h3 id="rabbitmq-中的-ttl" tabindex="-1"><a class="header-anchor" href="#rabbitmq-中的-ttl" aria-hidden="true">#</a> RabbitMQ 中的 TTL</h3><p>TTL 是什么呢？TTL 是 RabbitMQ 中一个消息或者队列的属性，表明一条消息或者该队列中的所有消息的最大存活时间，单位是毫秒。换句话说，如果一条消息设置了 TTL 属性或者进入了设置 TTL 属性的队列，那么这条消息如果在 TTL 设置的时间内没有被消费，则会成为”死信”。如果同时配置了队列的 TTL 和消息的TTL，那么较小的那个值将会被使用，有两种方式设置 TTL。</p><h4 id="消息设置-ttl" tabindex="-1"><a class="header-anchor" href="#消息设置-ttl" aria-hidden="true">#</a> 消息设置 TTL</h4><p>另一种方式便是针对每条消息设置 TTL</p>',10),hi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03858.png",target:"_blank",rel:"noopener noreferrer"},mi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_03858.png",alt:"img"},null,-1),gi=e("h4",{id:"队列设置-ttl",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#队列设置-ttl","aria-hidden":"true"},"#"),a(" 队列设置 TTL")],-1),pi=e("p",null,"第一种是在创建队列的时候设置队列的“x-message-ttl”属性",-1),_i={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_04019.png",target:"_blank",rel:"noopener noreferrer"},qi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_04019.png",alt:"img"},null,-1),fi=t(`<h4 id="两者的区别" tabindex="-1"><a class="header-anchor" href="#两者的区别" aria-hidden="true">#</a> 两者的区别</h4><p>如果设置了队列的 TTL 属性，那么一旦消息过期，就会被队列丢弃(如果配置了死信队列被丢到死信队列中)，而第二种方式，消息即使过期，也不一定会被马上丢弃，因为消息是否过期是在即将投递到消费者之前判定的，如果当前队列有严重的消息积压情况，则已过期的消息也许还能存活较长时间；另外，还需要注意的一点是，如果不设置 TTL，表示消息永远不会过期，如果将 TTL 设置为 0，则表示除非此时可以直接投递该消息到消费者，否则该消息将会被丢弃。</p><p>前一小节我们介绍了死信队列，刚刚又介绍了 TTL，至此利用 RabbitMQ 实现延时队列的两大要素已经集齐，接下来只需要将它们进行融合，再加入一点点调味料，延时队列就可以新鲜出炉了。想想看，延时队列，不就是想要消息延迟多久被处理吗，<strong>TTL 则刚好能让消息在延迟多久之后成为死信</strong>，另一方面，成为死信的消息都会被投递到死信队列里，这样只需要消费者一直消费死信队列里的消息就完事了，因为里面的消息都是希望被立即处理的消息。</p><h2 id="整合springboot" tabindex="-1"><a class="header-anchor" href="#整合springboot" aria-hidden="true">#</a> 整合SpringBoot</h2><h3 id="添加依赖" tabindex="-1"><a class="header-anchor" href="#添加依赖" aria-hidden="true">#</a> 添加依赖</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>XML

&lt;dependencies&gt;
    &lt;!--RabbitMQ 依赖 --&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
        &lt;artifactId&gt;spring-boot-starter-amqp&lt;/artifactId&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
        &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
        &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
        &lt;scope&gt;test&lt;/scope&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;com.alibaba&lt;/groupId&gt;
        &lt;artifactId&gt;fastjson&lt;/artifactId&gt;
        &lt;version&gt;1.2.47&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;
        &lt;artifactId&gt;lombok&lt;/artifactId&gt;
    &lt;/dependency&gt;
    &lt;!--swagger--&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;io.springfox&lt;/groupId&gt;
        &lt;artifactId&gt;springfox-swagger2&lt;/artifactId&gt;
        &lt;version&gt;2.9.2&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;io.springfox&lt;/groupId&gt;
        &lt;artifactId&gt;springfox-swagger-ui&lt;/artifactId&gt;
        &lt;version&gt;2.9.2&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;!--RabbitMQ 测试依赖 --&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.springframework.amqp&lt;/groupId&gt;
        &lt;artifactId&gt;spring-rabbit-test&lt;/artifactId&gt;
        &lt;scope&gt;test&lt;/scope&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="修改配置文件" tabindex="-1"><a class="header-anchor" href="#修改配置文件" aria-hidden="true">#</a> 修改配置文件</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PROPERTIES
spring.rabbitmq.host=127.0.0.1
spring.rabbitmq.port=5672
spring.rabbitmq.username=admin
spring.rabbitmq.password=123
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="死信队列实现延迟mq" tabindex="-1"><a class="header-anchor" href="#死信队列实现延迟mq" aria-hidden="true">#</a> 死信队列实现延迟MQ</h3><p>创建两个队列 QA 和 QB，两者队列 TTL 分别设置为 10S 和 40S，然后在创建一个交换机 X 和死信交换机 Y，它们的类型都是 direct，创建一个死信队列 QD，它们的绑定关系如下：</p>`,10),xi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_04954.png",target:"_blank",rel:"noopener noreferrer"},Mi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_04954.png",alt:"img"},null,-1),Ei=t(`<h4 id="配置文件类代码" tabindex="-1"><a class="header-anchor" href="#配置文件类代码" aria-hidden="true">#</a> 配置文件类代码</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA

public class TtlQueueConfig {
    public static final String X_EXCHANGE = &quot;X&quot;;
    public static final String QUEUE_A = &quot;QA&quot;;
    public static final String QUEUE_B = &quot;QB&quot;;
    public static final String Y_DEAD_LETTER_EXCHANGE = &quot;Y&quot;;
    public static final String DEAD_LETTER_QUEUE = &quot;QD&quot;;

    //  声明 xExchange
    @Bean(&quot;xExchange&quot;)
    public DirectExchange xExchange() {
        return new DirectExchange(X_EXCHANGE);
    }

    //  声明 xExchange
    @Bean(&quot;yExchange&quot;)
    public DirectExchange yExchange() {
        return new DirectExchange(Y_DEAD_LETTER_EXCHANGE);
    }

    // 声明队列 A ttl 为 10s 并绑定到对应的死信交换机
    @Bean(&quot;queueA&quot;)
    public Queue queueA() {
        Map&lt;String, Object&gt; args = new HashMap&lt;&gt;(3);
        // 声明当前队列绑定的死信交换机
        args.put(&quot;x-dead-letter-exchange&quot;, Y_DEAD_LETTER_EXCHANGE);
        // 声明当前队列的死信路由 key
        args.put(&quot;x-dead-letter-routing-key&quot;, &quot;YD&quot;);
        // 声明队列的 TTL
        args.put(&quot;x-message-ttl&quot;, 10000);
        return QueueBuilder.durable(QUEUE_A).withArguments(args).build();
    }

    //  声明队列 A 绑定 X 交换机
    @Bean
    public Binding queueaBindingX(@Qualifier(&quot;queueA&quot;) Queue queueA,
                                  @Qualifier(&quot;xExchange&quot;) DirectExchange xExchange) {
        return BindingBuilder.bind(queueA).to(xExchange).with(&quot;XA&quot;);
    }

    // 声明队列 B ttl 为 40s 并绑定到对应的死信交换机
    @Bean(&quot;queueB&quot;)
    public Queue queueB() {
        Map&lt;String, Object&gt; args = new HashMap&lt;&gt;(3);
        // 声明当前队列绑定的死信交换机
        args.put(&quot;x-dead-letter-exchange&quot;, Y_DEAD_LETTER_EXCHANGE);
        // 声明当前队列的死信路由 key
        args.put(&quot;x-dead-letter-routing-key&quot;, &quot;YD&quot;);
        // 声明队列的 TTL
        args.put(&quot;x-message-ttl&quot;, 40000);
        return QueueBuilder.durable(QUEUE_B).withArguments(args).build();
    }

    // 声明队列 B 绑定 X 交换机
    @Bean
    public Binding queuebBindingX(@Qualifier(&quot;queueB&quot;) Queue queue1B,
                                  @Qualifier(&quot;xExchange&quot;) DirectExchange xExchange) {
        return BindingBuilder.bind(queue1B).to(xExchange).with(&quot;XB&quot;);
    }

    // 声明死信队列 QD
    @Bean(&quot;queueD&quot;)
    public Queue queueD() {
        return new Queue(DEAD_LETTER_QUEUE);
    }

    // 声明死信队列 QD 绑定关系
    @Bean
    public Binding deadLetterBindingQAD(@Qualifier(&quot;queueD&quot;) Queue queueD,
                                        @Qualifier(&quot;yExchange&quot;) DirectExchange yExchange) {
        return BindingBuilder.bind(queueD).to(yExchange).with(&quot;YD&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="生产者代码" tabindex="-1"><a class="header-anchor" href="#生产者代码" aria-hidden="true">#</a> 生产者代码</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
@Slf4j
@RequestMapping(&quot;ttl&quot;)
@RestController
public class SendMsgController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping(&quot;sendMsg/{message}&quot;)
    public void sendMsg(@PathVariable String message) {
        log.info(&quot; 当前时间：{}, 发送一条信息给两个 TTL  队列:{}&quot;, new Date(), message);
        rabbitTemplate.convertAndSend(&quot;X&quot;, &quot;XA&quot;, &quot; 消息来自 ttl 为 为 10S  的队列: &quot; + message);
        rabbitTemplate.convertAndSend(&quot;X&quot;, &quot;XB&quot;, &quot; 消息来自 ttl 为 为 40S  的队列: &quot; + message);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消费者代码" tabindex="-1"><a class="header-anchor" href="#消费者代码" aria-hidden="true">#</a> 消费者代码</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
@Slf4j
@Component
public class DeadLetterQueueConsumer {
    @RabbitListener(queues = &quot;QD&quot;)
    public void receiveD(Message message, Channel channel) throws IOException {
        String msg = new String(message.getBody());
        log.info(&quot; 当前时间：{}, 收到死信队列信息{}&quot;, new Date().toString(), msg);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一条消息在 10S 后变成了死信消息，然后被消费者消费掉，第二条消息在 40S 之后变成了死信消息，然后被消费掉，这样一个延时队列就打造完成了。 不过，如果这样使用的话，岂不是<strong>每增加一个新的时间需求，就要新增一个队列</strong>，这里只有 10S 和 40S两个时间选项，如果需要一个小时后处理，那么就需要增加 TTL 为一个小时的队列，如果是预定会议室然后提前通知这样的场景，岂不是要增加无数个队列才能满足需求？</p><h4 id="延时队列优化" tabindex="-1"><a class="header-anchor" href="#延时队列优化" aria-hidden="true">#</a> 延时队列优化</h4><p>在这里新增了一个队列 QC,绑定关系如下,该队列不设置 TTL 时间</p>`,9),yi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_10712.png",target:"_blank",rel:"noopener noreferrer"},Qi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_10712.png",alt:"img"},null,-1),Ni=e("p",null,[a("看起来似乎没什么问题，但是在最开始的时候，就介绍过如果使用在消息属性上设置 TTL 的方式，消息可能并不会按时“死亡“，"),e("strong",null,"因为 RabbitMQ 只会检查第一个消息是否过期"),a("，如果过期则丢到死信队列，如果第一个消息的延时时长很长，而第二个消息的延时时长很短，第二个消息并不会优先得到执行。")],-1),Ai=e("h3",{id:"rabbitmq插件实现延迟队列",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#rabbitmq插件实现延迟队列","aria-hidden":"true"},"#"),a(" Rabbitmq插件实现延迟队列")],-1),ki=e("h4",{id:"参考文章",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#参考文章","aria-hidden":"true"},"#"),a(" 参考文章")],-1),Ci={href:"https://www.jianshu.com/p/451958b1adca",target:"_blank",rel:"noopener noreferrer"},Si={href:"https://www.cnblogs.com/geekdc/p/13549613.html",target:"_blank",rel:"noopener noreferrer"},Ti=e("h4",{id:"安装延时队列插件",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#安装延时队列插件","aria-hidden":"true"},"#"),a(" 安装延时队列插件")],-1),Ri={href:"https://www.rabbitmq.com/community-plugins.html",target:"_blank",rel:"noopener noreferrer"},Di={href:"https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/tag/v3.8.0",target:"_blank",rel:"noopener noreferrer"},Bi=e("ul",null,[e("li",null,"/usr/lib/rabbitmq/lib/rabbitmq_server-3.8.8/plugins"),e("li",null,"rabbitmq-plugins enable rabbitmq_delayed_message_exchange")],-1),ji={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11230.png",target:"_blank",rel:"noopener noreferrer"},zi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11230.png",alt:"img"},null,-1),wi=t('<h2 id="发布确认高级姿势" tabindex="-1"><a class="header-anchor" href="#发布确认高级姿势" aria-hidden="true">#</a> 发布确认高级姿势</h2><p>在生产环境中由于一些不明原因，导致 rabbitmq 重启，在 RabbitMQ 重启期间生产者消息投递失败，导致消息丢失，需要手动处理和恢复。于是，我们开始思考，如何才能进行 RabbitMQ 的消息可靠投递呢？特别是在这样比较极端的情况，RabbitMQ 集群不可用的时候，无法投递的消息该如何处理呢:</p><h3 id="发布确认-springboot-版本" tabindex="-1"><a class="header-anchor" href="#发布确认-springboot-版本" aria-hidden="true">#</a> 发布确认 springboot 版本</h3><h4 id="确认机制方案" tabindex="-1"><a class="header-anchor" href="#确认机制方案" aria-hidden="true">#</a> 确认机制方案</h4>',4),Ui={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11918.png",target:"_blank",rel:"noopener noreferrer"},Li=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11918.png",alt:"img"},null,-1),Pi=e("h4",{id:"代码架构图-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#代码架构图-1","aria-hidden":"true"},"#"),a(" 代码架构图")],-1),Ii={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11958.png",target:"_blank",rel:"noopener noreferrer"},Hi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210911_11958.png",alt:"img"},null,-1),Xi=t(`<h4 id="配置文件" tabindex="-1"><a class="header-anchor" href="#配置文件" aria-hidden="true">#</a> 配置文件</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PROPERTIES
# 在配置文件当中需要添加
spring.rabbitmq.publisher-confirm-type=correlated
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>NONE：禁用发布确认模式，是默认值</li><li>CORRELATED：发布消息成功到交换器后会触发回调方法</li><li>SIMPLE：经测试有两种效果，其一效果和 CORRELATED 值一样会触发回调方法，其二在发布消息成功后使用 rabbitTemplate 调用 waitForConfirms 或 waitForConfirmsOrDie 方法等待 broker 节点返回发送结果，根据返回结果来判定下一步的逻辑，要注意的点是 waitForConfirmsOrDie 方法如果返回 false 则会关闭 channel，则接下来无法发送消息到 broker，注：此配置同步确认消息，生产不建议使用</li></ul><h4 id="交换机发布确认代码" tabindex="-1"><a class="header-anchor" href="#交换机发布确认代码" aria-hidden="true">#</a> 交换机发布确认代码</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class MessageConfirmCallBack&lt;T&gt; implements RabbitTemplate.ConfirmCallback {
    @Resource
    private RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        rabbitTemplate.setConfirmCallback(this);
    }
    /**
     * 交换机确认回调方法 (发布者发送消息是否到交换机触发回调)
     * 1. 发消息 交换机接收到消息，回调
     * 1.1 correlationData 保存毁掉消息的id及相关信息
     * 1.2 交换机接收到消息 true
     * 1.3 失败原因-null
     * 2. 发消息 交换机接收失败 回调
     * 2.1 correlationData 保存毁掉消息的id及相关信息
     * 2.2 false
     * 2.3 失败原因
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
          if (ack) {
                log.info(&quot;发布确认:交换机收到消息id：{}&quot;, correlationData.getId());
          } else {
                log.info(&quot;发布确认:交换机未收到消息，id为：{},原因：{}&quot;, correlationData.getId(), cause);
              // TODO 保存数据库重新发送等逻辑保证消息重新发送给交换机
          } 
      }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="回退消息" tabindex="-1"><a class="header-anchor" href="#回退消息" aria-hidden="true">#</a> 回退消息</h3><p><strong>在仅开启了生产者确认机制的情况下，交换机接收到消息后，会直接给消息生产者发送确认消息，如果发现该消息不可路由，那么消息会被直接丢弃，此时生产者是不知道消息被丢弃这个事件的。<strong>那么如何让无法被路由的消息帮我想办法处理一下？最起码通知我一声，我好自己处理啊。通过设置 mandatory 参数可以在当消息传递过程中不可达目的地时将消息</strong>返回给生产者。</strong></p><h4 id="添加配置" tabindex="-1"><a class="header-anchor" href="#添加配置" aria-hidden="true">#</a> 添加配置</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PROPERTIES
# 消息回退配置，如果消息无法路由，则回退给生产者
spring.rabbitmq.publisher-returns=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="回退代码演示" tabindex="-1"><a class="header-anchor" href="#回退代码演示" aria-hidden="true">#</a> 回退代码演示</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class MessageReturnCallBack&lt;T&gt; implements RabbitTemplate.ReturnCallback {

    @Resource
    private RabbitTemplate rabbitTemplate;
    
    @PostConstruct
    public void init() {
        rabbitTemplate.setReturnCallback(this);
    }
    /**
     * 可以将消息传递过程中不可达到目的地(队列)的消息返回给生产者
     * 只有不可达 才会回退消息
     * 请注意!!!如果你使用了延迟队列插件，那么一定会调用该callback方法，因为数据并没有提交上去，
     * 而是提交在交换器中，过期时间到了才提交上去，并非是bug！你可以用if进行判断交换机名称来捕捉该报错
     */
    @Override
    public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
        if(exchange.equals(delayedQueueProperties.getDelayedExchangeName())){
            return;
        }
        log.info(&quot;消息{}，被交换机{}退回，退回原因：{}，路由Key：{}&quot;, new String(message.getBody()), exchange, replyText, routingKey);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="备份交换机" tabindex="-1"><a class="header-anchor" href="#备份交换机" aria-hidden="true">#</a> 备份交换机</h3><p>有了 mandatory 参数和回退消息，我们获得了对无法投递消息的感知能力，有机会在生产者的消息无法被投递时发现并处理。但有时候，我们并不知道该如何处理这些无法路由的消息，最多打个日志，然后触发报警，再来手动处理。而通过日志来处理这些无法路由的消息是很不优雅的做法，特别是当生产者所在的服务有多台机器的时候，手动复制日志会更加麻烦而且容易出错。而且设置 mandatory 参数会增加生产者的复杂性，需要添加处理这些被退回的消息的逻辑。如果既不想丢失消息，又不想增加生产者的复杂性，该怎么做呢？前面在设置死信队列的文章中，我们提到，可以为队列设置死信交换机来存储那些处理失败的消息，可是这些不可路由消息根本没有机会进入到队列，因此无法使用死信队列来保存消息。在 RabbitMQ 中，有一种备份交换机的机制存在，可以很好的应对这个问题。什么是备份交换机呢？备份交换机可以理解为 RabbitMQ 中交换机的“备胎”，当我们为某一个交换机声明一个对应的备份交换机时，就是为它创建一个备胎，当交换机接收到一条不可路由消息时，将会把这条消息转发到备份交换机中，由备份交换机来进行转发和处理，通常备份交换机的类型为 Fanout ，这样就能把所有消息都投递到与其绑定的队列中，然后我们在备份交换机下绑定一个队列，这样所有那些原交换机无法被路由的消息，就会都进入这个队列了。当然，我们还可以建立一个报警队列，用独立的消费者来进行监测和报警。</p>`,13),Gi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_01328.png",target:"_blank",rel:"noopener noreferrer"},Oi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_01328.png",alt:"img"},null,-1),Ki=t(`<h4 id="备份交换机代码声明" tabindex="-1"><a class="header-anchor" href="#备份交换机代码声明" aria-hidden="true">#</a> 备份交换机代码声明</h4><p>在原来的代码上面多声明一个交换机和两个队列，还有一个报警消费者</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA

// @Configuration
public class ConfirmConfig {
    public static final String CONFIRM_EXCHANGE_NAME = &quot;confirm.exchange&quot;;
    public static final String CONFIRM_QUEUE_NAME = &quot;confirm.queue&quot;;
    public static final String BACKUP_EXCHANGE_NAME = &quot;backup.exchange&quot;;
    public static final String BACKUP_QUEUE_NAME = &quot;backup.queue&quot;;
    public static final String WARNING_QUEUE_NAME = &quot;warning.queue&quot;;
    //  声明确认队列
    @Bean(&quot;confirmQueue&quot;)
    public Queue confirmQueue() {
        return QueueBuilder.durable(CONFIRM_QUEUE_NAME).build();
    }
    // 声明确认队列绑定关系
    @Bean
    public Binding queueBinding(@Qualifier(&quot;confirmQueue&quot;) Queue queue,
                                @Qualifier(&quot;confirmExchange&quot;) DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(&quot;key1&quot;);
    }
    // 声明备份 Exchange
    @Bean(&quot;backupExchange&quot;)
    public FanoutExchange backupExchange() {
        return new FanoutExchange(BACKUP_EXCHANGE_NAME);
    }
    // 声明确认 Exchange 交换机的备份交换机
    @Bean(&quot;confirmExchange&quot;)
    public DirectExchange confirmExchange() {
        ExchangeBuilder exchangeBuilder =
                ExchangeBuilder.directExchange(CONFIRM_EXCHANGE_NAME)
                        .durable(true)
                        // 设置该交换机的备份交换机
                        .withArgument(&quot;alternate-exchange&quot;, BACKUP_EXCHANGE_NAME);
        return (DirectExchange) exchangeBuilder.build();
    }
    //  声明警告队列
    @Bean(&quot;warningQueue&quot;)
    public Queue warningQueue() {
        return QueueBuilder.durable(WARNING_QUEUE_NAME).build();
    }
    //  声明报警队列绑定关系
    @Bean
    public Binding warningBinding(@Qualifier(&quot;warningQueue&quot;) Queue queue,
                                  @Qualifier(&quot;backupExchange&quot;) FanoutExchange
                                          backupExchange) {
        return BindingBuilder.bind(queue).to(backupExchange);
    }
    //  声明备份队列
    @Bean(&quot;backQueue&quot;)
    public Queue backQueue() {
        return QueueBuilder.durable(BACKUP_QUEUE_NAME).build();
    }
    //  声明备份队列绑定关系
    @Bean
    public Binding backupBinding(@Qualifier(&quot;backQueue&quot;) Queue queue,
                                 @Qualifier(&quot;backupExchange&quot;) FanoutExchange backupExchange) {
        return BindingBuilder.bind(queue).to(backupExchange);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="报警消费者" tabindex="-1"><a class="header-anchor" href="#报警消费者" aria-hidden="true">#</a> 报警消费者</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
@Component
@Slf4j
public class WarningConsumer {
    public static final String WARNING_QUEUE_NAME = &quot;warning.queue&quot;;

    @RabbitListener(queues = WARNING_QUEUE_NAME)
    public void receiveWarningMsg(Message message) {
        String msg = new String(message.getBody());
        log.error(&quot; 报警发现不可路由消息：{}&quot;, msg);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>测试注意事项</strong></p><p>重新启动项目的时候需要把原来的 confirm.exchange 删除因为我们修改了其绑定属性，不然报错。</p><h4 id="备份交换机和回退优先级" tabindex="-1"><a class="header-anchor" href="#备份交换机和回退优先级" aria-hidden="true">#</a> 备份交换机和回退优先级</h4><p>mandatory 参数与备份交换机可以一起使用的时候，如果两者同时开启，消息究竟何去何从？谁优先级高，经过上面结果显示答案是备份交换机优先级高。</p><h2 id="rabbitmq其他知识点" tabindex="-1"><a class="header-anchor" href="#rabbitmq其他知识点" aria-hidden="true">#</a> RabbitMQ其他知识点</h2><h3 id="幂等性" tabindex="-1"><a class="header-anchor" href="#幂等性" aria-hidden="true">#</a> 幂等性</h3><p>用户对于同一操作发起的一次请求或者多次请求的结果是一致的，不会因为多次点击而产生了副作用。举个最简单的例子，那就是支付，用户购买商品后支付，支付扣款成功，但是返回结果的时候网络异常，此时钱已经扣了，用户再次点击按钮，此时会进行第二次扣款，返回结果成功，用户查询余额发现多扣钱了，流水记录也变成了两条。在以前的单应用系统中，我们只需要把数据操作放入事务中即可，发生错误立即回滚，但是再响应客户端的时候也有可能出现网络中断或者异常等等</p><h4 id="消息重复消费" tabindex="-1"><a class="header-anchor" href="#消息重复消费" aria-hidden="true">#</a> 消息重复消费</h4><p>消费者在消费 MQ 中的消息时，MQ 已把消息发送给消费者，消费者在给 MQ 返回 ack 时网络中断，故 MQ 未收到确认信息，该条消息会重新发给其他的消费者，或者在网络重连后再次发送给该消费者，但实际上该消费者已成功消费了该条消息，造成消费者消费了重复的消息。</p><h4 id="解决思路" tabindex="-1"><a class="header-anchor" href="#解决思路" aria-hidden="true">#</a> 解决思路</h4><p>MQ 消费者的幂等性的解决一般使用全局 ID 或者写个唯一标识比如时间戳 或者 UUID 或者订单消费者消费 MQ 中的消息也可利用 MQ 的该 id 来判断，或者可按自己的规则生成一个全局唯一 id，每次消费消息时用该 id 先判断该消息是否已消费过。</p><h4 id="消费端的幂等性保障" tabindex="-1"><a class="header-anchor" href="#消费端的幂等性保障" aria-hidden="true">#</a> 消费端的幂等性保障</h4><p>在海量订单生成的业务高峰期，生产端有可能就会重复发生了消息，这时候消费端就要实现幂等性，这就意味着我们的消息永远不会被消费多次，即使我们收到了一样的消息。业界主流的幂等性有两种操作:a.唯一 ID+指纹码机制,利用数据库主键去重, b.利用 redis 的原子性去实现</p><h4 id="唯一id-指纹码机制" tabindex="-1"><a class="header-anchor" href="#唯一id-指纹码机制" aria-hidden="true">#</a> 唯一ID+ 指纹码机制</h4><p>指纹码:我们的一些规则或者时间戳加别的服务给到的唯一信息码,它并不一定是我们系统生成的，基本都是由我们的业务规则拼接而来，但是一定要保证唯一性，然后就利用查询语句进行判断这个 id 是否存在数据库中,优势就是实现简单就一个拼接，然后查询判断是否重复；劣势就是在高并发时，如果是单个数据库就会有写入性能瓶颈当然也可以采用分库分表提升性能，但也不是我们最推荐的方式。</p><h4 id="redis原子性" tabindex="-1"><a class="header-anchor" href="#redis原子性" aria-hidden="true">#</a> Redis原子性</h4><p>利用 redis 执行 setnx 命令，天然具有幂等性。从而实现不重复消费，此方式为目前用的最多的方案。</p><h3 id="优先级队列" tabindex="-1"><a class="header-anchor" href="#优先级队列" aria-hidden="true">#</a> 优先级队列</h3><h4 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景" aria-hidden="true">#</a> 使用场景</h4><p>在我们系统中有一个订单催付的场景，我们的客户在天猫下的订单,淘宝会及时将订单推送给我们，如果在用户设定的时间内未付款那么就会给用户推送一条短信提醒，很简单的一个功能对吧，但是，tmall商家对我们来说，肯定是要分大客户和小客户的对吧，比如像苹果，小米这样大商家一年起码能给我们创造很大的利润，所以理应当然，他们的订单必须得到优先处理，而曾经我们的后端系统是使用 redis 来存放的定时轮询，大家都知道 redis 只能用 List 做一个简简单单的消息队列，并不能实现一个优先级的场景，所以订单量大了后采用 RabbitMQ 进行改造和优化,如果发现是大客户的订单给一个相对比较高的优先级，否则就是默认优先级。</p><h4 id="如何添加" tabindex="-1"><a class="header-anchor" href="#如何添加" aria-hidden="true">#</a> 如何添加</h4><p>a.控制台页面添加</p>`,27),Vi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_02829.png",target:"_blank",rel:"noopener noreferrer"},Fi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_02829.png",alt:"img"},null,-1),Ji=t(`<p>b.队列中代码添加优先级</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
Map&lt;String, Object&gt; params = new HashMap();
params.put(&quot;x-max-priority&quot;, 10);
channel.queueDeclare(&quot;hello&quot;, true, false, false, params);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),Yi={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_03043.png",target:"_blank",rel:"noopener noreferrer"},Wi=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_03043.png",alt:"img"},null,-1),Zi=t(`<p>c.消息中代码添加优先级</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
AMQP.BasicProperties  properties  =  new AMQP.BasicProperties().builder().priority(5).build();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>d.注意事项</p><p>要让队列实现优先级需要做的事情有如下事情:<strong>队列需要设置为优先级队列，消息需要设置消息的优先级</strong>，消费者需要等待消息已经发送到队列中才去消费因为，这样才有机会对消息进行排序</p><h4 id="实战" tabindex="-1"><a class="header-anchor" href="#实战" aria-hidden="true">#</a> 实战</h4><h5 id="生产者-1" tabindex="-1"><a class="header-anchor" href="#生产者-1" aria-hidden="true">#</a> 生产者</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Producer {
    private static final String QUEUE_NAME = &quot;hello&quot;;

    public static void main(String[] args) throws Exception {
        try (Channel channel = RabbitMqUtils.getChannel();) {
            // 给消息赋予一个 priority 属性
            AMQP.BasicProperties properties = new
                    AMQP.BasicProperties().builder().priority(5).build();
            for (int i = 1; i &lt; 11; i++) {
                String message = &quot;info&quot; + i;
                if (i == 5) {
                    channel.basicPublish(&quot;&quot;, QUEUE_NAME, properties, message.getBytes());
                } else {
                    channel.basicPublish(&quot;&quot;, QUEUE_NAME, null, message.getBytes());
                }
                System.out.println(&quot; 发送消息完成:&quot; + message);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="消费者-2" tabindex="-1"><a class="header-anchor" href="#消费者-2" aria-hidden="true">#</a> 消费者</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public class Consumer {
    private static final String QUEUE_NAME = &quot;hello&quot;;

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        // 设置队列的最大优先级 最大可以设置到 255  官网推荐 1-10 如果设置太高比较吃内存和 CPU
        Map&lt;String, Object&gt; params = new HashMap();
        params.put(&quot;x-max-priority&quot;, 10);
        channel.queueDeclare(QUEUE_NAME, true, false, false, params);
        System.out.println(&quot; 消费者启动等待消费......&quot;);
        DeliverCallback deliverCallback = (consumerTag, delivery) -&gt; {
            String receivedMessage = new String(delivery.getBody());
            System.out.println(&quot; 接收到消息:&quot; + receivedMessage);
        };
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, (consumerTag) -&gt; {
            System.out.println(&quot; 消费者无法消费 消息时调用，如队列被删除&quot;);
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="惰性队列" tabindex="-1"><a class="header-anchor" href="#惰性队列" aria-hidden="true">#</a> 惰性队列</h3><p>RabbitMQ 从 3.6.0 版本开始引入了惰性队列的概念。惰性队列会尽可能的将消息存入磁盘中，而在消费者消费到相应的消息时才会被加载到内存中，它的一个重要的设计目标是能够支持更长的队列，即支持更多的消息存储。<strong>当消费者由于各种各样的原因(比如消费者下线、宕机亦或者是由于维护而关闭等)而致使长时间内不能消费消息造成堆积时，惰性队列就很有必要了。</strong> 默认情况下，当生产者将消息发送到 RabbitMQ 的时候，队列中的消息会尽可能的存储在内存之中，这样可以更加快速的将消息发送给消费者。即使是持久化的消息，在被写入磁盘的同时也会在内存中驻留一份备份。当 RabbitMQ 需要释放内存的时候，会将内存中的消息换页至磁盘中，这个操作会耗费较长的时间，也会阻塞队列的操作，进而无法接收新的消息。虽然 RabbitMQ 的开发者们一直在升级相关的算法，但是效果始终不太理想，尤其是在消息量特别大的时候。</p><h4 id="两种模式" tabindex="-1"><a class="header-anchor" href="#两种模式" aria-hidden="true">#</a> 两种模式</h4><p>队列具备两种模式：default 和 lazy。默认的为 default 模式，在 3.6.0 之前的版本无需做任何变更。lazy模式即为惰性队列的模式，可以通过调用 channel.queueDeclare 方法的时候在参数中设置，也可以通过Policy 的方式设置，如果一个队列同时使用这两种方式设置的话，那么 Policy 的方式具备更高的优先级。如果要通过声明的方式改变已有队列的模式的话，那么只能先删除队列，然后再重新声明一个新的。 在队列声明的时候可以通过“x-queue-mode”参数来设置队列的模式，取值为“default”和“lazy”。下面示 例中演示了一个惰性队列的声明细节：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
Map&lt;String, Object&gt; args = new HashMap&lt;String, Object&gt;();
args.put(&quot;x-queue-mode&quot;, &quot;lazy&quot;);
channel.queueDeclare(&quot;myqueue&quot;, false, false, false, args);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="内存开销对比" tabindex="-1"><a class="header-anchor" href="#内存开销对比" aria-hidden="true">#</a> 内存开销对比</h4>`,15),$i={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_04201.png",target:"_blank",rel:"noopener noreferrer"},en=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_04201.png",alt:"img"},null,-1),nn=t('<p>在发送 1 百万条消息，每条消息大概占 1KB 的情况下，普通队列占用内存是 1.2GB，而惰性队列仅仅占用 1.5MB</p><h2 id="rabbitmq-集群" tabindex="-1"><a class="header-anchor" href="#rabbitmq-集群" aria-hidden="true">#</a> RabbitMQ 集群</h2><h3 id="clustering集群模式" tabindex="-1"><a class="header-anchor" href="#clustering集群模式" aria-hidden="true">#</a> clustering集群模式</h3><h4 id="使用集群的原因" tabindex="-1"><a class="header-anchor" href="#使用集群的原因" aria-hidden="true">#</a> 使用集群的原因</h4><p>最开始我们介绍了如何安装及运行 RabbitMQ 服务，不过这些是单机版的，无法满足目前真实应用的要求。如果 RabbitMQ 服务器遇到内存崩溃、机器掉电或者主板故障等情况，该怎么办？单台 RabbitMQ服务器可以满足每秒 1000 条消息的吞吐量，那么如果应用需要 RabbitMQ 服务满足每秒 10 万条消息的吞吐量呢？购买昂贵的服务器来增强单机 RabbitMQ 务的性能显得捉襟见肘，搭建一个 RabbitMQ 集群才是解决实际问题的关键。</p><h4 id="搭建步骤" tabindex="-1"><a class="header-anchor" href="#搭建步骤" aria-hidden="true">#</a> 搭建步骤</h4><p><strong>1.修改 3 台机器的主机名称</strong></p><p>vim /etc/hostname</p><p><strong>2.配置各个节点的 hosts 文件，让各个节点都能互相识别对方</strong></p><p>vim /etc/hosts 10.211.55.74 node1 10.211.55.75 node2 10.211.55.76 node3</p>',10),an={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_105900.png",target:"_blank",rel:"noopener noreferrer"},tn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_105900.png",alt:"img"},null,-1),sn=t(`<p><strong>3.以确保各个节点的 cookie 文件使用的是同一个值</strong></p><p>在 node1 上执行远程操作命令 scp /var/lib/rabbitmq/.erlang.cookie root@node2:/var/lib/rabbitmq/.erlang.cookie scp /var/lib/rabbitmq/.erlang.cookie root@node3:/var/lib/rabbitmq/.erlang.cookie</p><p><strong>4.启动 RabbitMQ 服务,顺带启动 Erlang 虚拟机和 RbbitMQ 应用服务(在三台节点上分别执行以下命令)</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>rabbitmq-server -detached
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>5.在节点 2 执行</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
rabbitmqctl stop_app (rabbitmqctl stop 会将 Erlang 虚拟机关闭，rabbitmqctl stop_app 只关闭 RabbitMQ 服务)
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app(只启动应用服务)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>6.在节点 3 执行</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node2
rabbitmqctl start_app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>7.集群状态</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>rabbitmqctl cluster_status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>8.需要重新设置用户</strong></p><p>创建账号 <code>rabbitmqctl add_user admin 123</code> 设置用户角色 <code>rabbitmqctl set_user_tags admin administrator</code> 设置用户权限 <code>rabbitmqctl set_permissions -p &quot;/&quot; admin &quot;.*&quot; &quot;.*&quot; &quot;.*&quot;</code></p><p><strong>9.解除集群节点(node2 和 node3 机器分别执行)</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl start_app
rabbitmqctl cluster_status
rabbitmqctl forget_cluster_node rabbit@node2(node1 机器上执行)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="镜像队列" tabindex="-1"><a class="header-anchor" href="#镜像队列" aria-hidden="true">#</a> 镜像队列</h3><h4 id="使用镜像的原因" tabindex="-1"><a class="header-anchor" href="#使用镜像的原因" aria-hidden="true">#</a> 使用镜像的原因</h4><p>如果 RabbitMQ 集群中只有一个 Broker 节点，那么该节点的失效将导致整体服务的临时性不可用，并且也可能会导致消息的丢失。可以将所有消息都设置为持久化，并且对应队列的durable属性也设置为true，但是这样仍然无法避免由于缓存导致的问题：因为消息在发送之后和被写入磁盘井执行刷盘动作之间存在一个短暂却会产生问题的时间窗。通过 publisherconfirm 机制能够确保客户端知道哪些消息己经存入磁盘，尽管如此，一般不希望遇到因单点故障导致的服务不可用。 引入镜像队列(Mirror Queue)的机制，可以将队列镜像到集群中的其他 Broker 节点之上，如果集群中的一个节点失效了，队列能自动地切换到镜像中的另一个节点上以保证服务的可用性。</p><h4 id="搭建步骤-1" tabindex="-1"><a class="header-anchor" href="#搭建步骤-1" aria-hidden="true">#</a> 搭建步骤</h4><p><strong>1.启动三台集群节点</strong></p><p><strong>2.随便找一个节点添加 policy</strong></p>`,20),ln={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121053.png",target:"_blank",rel:"noopener noreferrer"},rn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121053.png",alt:"img"},null,-1),dn=e("p",null,[e("strong",null,"3.在 node1 上创建一个队列发送一条消息，队列存在镜像队列")],-1),un={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121220.png",target:"_blank",rel:"noopener noreferrer"},on=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121220.png",alt:"img"},null,-1),cn=e("p",null,[e("strong",null,"4.停掉 node1 之后发现 node2 成为镜像队列")],-1),bn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121348.png",target:"_blank",rel:"noopener noreferrer"},vn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121348.png",alt:"img"},null,-1),hn=e("p",null,[e("strong",null,"5.就算整个集群只剩下一台机器了 依然能消费队列里面的消息")],-1),mn=e("p",null,"说明队列里面的消息被镜像队列传递到相应机器里面了",-1),gn=e("h3",{id:"实现高可用负载均衡",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#实现高可用负载均衡","aria-hidden":"true"},"#"),a(" 实现高可用负载均衡")],-1),pn=e("h4",{id:"整体架构图",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#整体架构图","aria-hidden":"true"},"#"),a(" 整体架构图")],-1),_n={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121820.png",target:"_blank",rel:"noopener noreferrer"},qn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_121820.png",alt:"img"},null,-1),fn=t(`<h4 id="haproxy-实现负载均衡" tabindex="-1"><a class="header-anchor" href="#haproxy-实现负载均衡" aria-hidden="true">#</a> Haproxy 实现负载均衡</h4><p>HAProxy 提供高可用性、负载均衡及基于 TCPHTTP 应用的代理，支持虚拟主机，它是免费、快速并且可靠的一种解决方案，包括 Twitter,Reddit,StackOverflow,GitHub 在内的多家知名互联网公司在使用。HAProxy 实现了一种事件驱动、单一进程模型，此模型支持非常大的井发连接数。</p><p>扩展 nginx,lvs,haproxy 之间的区别: http://www.ha97.com/5646.html</p><h4 id="keepalived实现双机" tabindex="-1"><a class="header-anchor" href="#keepalived实现双机" aria-hidden="true">#</a> Keepalived实现双机</h4><p>试想如果前面配置的 HAProxy 主机突然宕机或者网卡失效，那么虽然 RbbitMQ 集群没有任何故障但是对于外界的客户端来说所有的连接都会被断开结果将是灾难性的为了确保负载均衡服务的可靠性同样显得十分重要，这里就要引入 Keepalived 它能够通过自身健康检查、资源接管功能做高可用(双机热备)，实现故障转移。</p><h3 id="federation-exchange" tabindex="-1"><a class="header-anchor" href="#federation-exchange" aria-hidden="true">#</a> Federation Exchange</h3><p>(broker 北京)，(broker 深圳)彼此之间相距甚远，网络延迟是一个不得不面对的问题。有一个在北京的业务(Client 北京) 需要连接(broker 北京)，向其中的交换器 exchangeA 发送消息，此时的网络延迟很小，(Client 北京)可以迅速将消息发送至 exchangeA 中，就算在开启了 publisherconfirm 机制或者事务机制的情况下，也可以迅速收到确认信息。此时又有个在深圳的业务(Client 深圳)需要向 exchangeA 发送消息，那么(Client 深圳) (broker 北京)之间有很大的网络延迟，(Client 深圳) 将发送消息至 exchangeA 会经历一定的延迟，尤其是在开启了 publisherconfirm 机制或者事务机制的情况下，(Client 深圳) 会等待很长的延迟时间来接收(broker 北京)的确认信息，进而必然造成这条发送线程的性能降低，甚至造成一定程度上的阻塞。 ​ 将业务(Client 深圳)部署到北京的机房可以解决这个问题，但是如果(Client 深圳)调用的另些服务都部署在深圳，那么又会引发新的时延问题，总不见得将所有业务全部部署在一个机房，那么容灾又何以实现？这里使用 Federation 插件就可以很好地解决这个问题.</p><h4 id="搭建步骤-2" tabindex="-1"><a class="header-anchor" href="#搭建步骤-2" aria-hidden="true">#</a> 搭建步骤</h4><p><strong>1.需要保证每台节点单独运行</strong></p><p><strong>2.在每台机器上开启 federation 相关插件</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
rabbitmq-plugins enable rabbitmq_federation
rabbitmq-plugins enable rabbitmq_federation_management
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.原理图(先运行 consumer 在 node2 创建 fed_exchange)</strong></p>`,12),xn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123834.png",target:"_blank",rel:"noopener noreferrer"},Mn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123834.png",alt:"img"},null,-1),En=e("p",null,[e("strong",null,"4.在 downstream(node2)配置 upstream(node1)")],-1),yn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123911.png",target:"_blank",rel:"noopener noreferrer"},Qn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123911.png",alt:"img"},null,-1),Nn=e("p",null,[e("strong",null,"5.添加 policy")],-1),An={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123958.png",target:"_blank",rel:"noopener noreferrer"},kn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_123958.png",alt:"img"},null,-1),Cn=e("p",null,[e("strong",null,"6.成功的前提")],-1),Sn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124034.png",target:"_blank",rel:"noopener noreferrer"},Tn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124034.png",alt:"img"},null,-1),Rn=e("h3",{id:"federation-queue",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#federation-queue","aria-hidden":"true"},"#"),a(" Federation Queue")],-1),Dn=e("p",null,"联邦队列可以在多个 Broker 节点(或者集群)之间为单个队列提供均衡负载的功能。一个联邦队列可以连接一个或者多个上游队列(upstream queue)，并从这些上游队列中获取消息以满足本地消费者消费消息的需求。",-1),Bn=e("h4",{id:"搭建步骤-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#搭建步骤-3","aria-hidden":"true"},"#"),a(" 搭建步骤")],-1),jn=e("p",null,[e("strong",null,"1.原理图")],-1),zn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124323.png",target:"_blank",rel:"noopener noreferrer"},wn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124323.png",alt:"img"},null,-1),Un=e("p",null,[e("strong",null,"2.添加 upstream(同上)")],-1),Ln=e("p",null,[e("strong",null,"3.添加 policy")],-1),Pn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124407.png",target:"_blank",rel:"noopener noreferrer"},In=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124407.png",alt:"img"},null,-1),Hn=t(`<h3 id="shovel" tabindex="-1"><a class="header-anchor" href="#shovel" aria-hidden="true">#</a> Shovel</h3><p>Federation 具备的数据转发功能类似，Shovel 够可靠、持续地从一个 Broker 中的队列(作为源端，即source)拉取数据并转发至另一个 Broker 中的交换器(作为目的端，即 destination)。作为源端的队列和作为目的端的交换器可以同时位于同一个 Broker，也可以位于不同的 Broker 上。Shovel 可以翻译为”铲子”，是一种比较形象的比喻，这个”铲子”可以将消息从一方”铲子”另一方。Shovel 行为就像优秀的客户端应用程序能够负责连接源和目的地、负责消息的读写及负责连接失败问题的处理。</p><h4 id="搭建步骤-4" tabindex="-1"><a class="header-anchor" href="#搭建步骤-4" aria-hidden="true">#</a> 搭建步骤</h4><p><strong>1.开启插件(需要的机器都开启)</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SHELL
rabbitmq-plugins enable rabbitmq_shovel
rabbitmq-plugins enable rabbitmq_shovel_management
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-原理图" tabindex="-1"><a class="header-anchor" href="#_2-原理图" aria-hidden="true">#</a> 2.原理图</h4><p>在源头发送的消息直接回进入到目的地队列</p>`,7),Xn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124534.png",target:"_blank",rel:"noopener noreferrer"},Gn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124534.png",alt:"img"},null,-1),On=e("p",null,[e("strong",null,"3.添加 shovel 源和目的地")],-1),Kn={href:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124609.png",target:"_blank",rel:"noopener noreferrer"},Vn=e("img",{src:"https://lizejiao.github.io/images/studyNote/rabbitMQ/20210912_124609.png",alt:"img"},null,-1),Fn=t(`<h2 id="rabbitmq工具类" tabindex="-1"><a class="header-anchor" href="#rabbitmq工具类" aria-hidden="true">#</a> RabbitMQ工具类</h2><p>在企业开发过程中，直接使用SpringBoot提供的RabbitTemplate还是略显复杂，通常我们一个系统发送消息基本上也是只依赖于一个交换机和一个队列（延迟消息需单独依赖于延迟交换机），基于此，我们可以把交换机、队列以及路由key等声明直接放在配置文件中，然后封装发送普通消息的工具类，和发送延迟消息的工具类，发送的消息体内容我们可以增加交易码这个概念，消费者通过不同交易码，处理不同的业务。消息体通过泛型，在发消息时声明消息体类型，通过json序列化传输。</p><h3 id="工具类使用" tabindex="-1"><a class="header-anchor" href="#工具类使用" aria-hidden="true">#</a> 工具类使用</h3><h4 id="延迟消息发送" tabindex="-1"><a class="header-anchor" href="#延迟消息发送" aria-hidden="true">#</a> 延迟消息发送</h4><p>项目启动时，直接声明好延迟交换机，延迟队列以及路由key，发送延迟消息只需要一句代码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public void sendDelayMsg(@PathVariable String message, @PathVariable Integer delayTime) {
    log.info(&quot;当前时间：{},发送一条时长{}毫秒TTL信息给队列QC:{}&quot;, new Date(), delayTime, message);
    MsgData&lt;String&gt; msgData = new MsgData&lt;&gt;(&quot;0001&quot;, message, &quot;这是我的测试延迟消息！&quot;);
    EventDispatcherUtil.eventDispatch(msgData, delayTime);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="普通消息发送" tabindex="-1"><a class="header-anchor" href="#普通消息发送" aria-hidden="true">#</a> 普通消息发送</h4><p>普通消息通过发布订阅模式实现，其他系统若要接收次消息，只需要声明一个队列然后添加监听，绑定到此交换机上即可，发送普通消息也只需要一句代码实现</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>JAVA
public void sendFanoutMsg(@PathVariable String message) {
    log.info(&quot;当前时间：{},发送一条信息给队列QC:{}&quot;, new Date(), message);
    MsgData&lt;String&gt; msgData = new MsgData&lt;&gt;(&quot;0001&quot;, message, &quot;这是我的测订阅消息！&quot;);
    EventDispatcherUtil.eventDispatch(msgData);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rabbitmq相关面试题" tabindex="-1"><a class="header-anchor" href="#rabbitmq相关面试题" aria-hidden="true">#</a> RabbitMQ相关面试题</h2><h3 id="如何保证消息不丢失" tabindex="-1"><a class="header-anchor" href="#如何保证消息不丢失" aria-hidden="true">#</a> 如何保证消息不丢失？</h3><ol><li>队列和消息持久化：保证MQ宕机了消息不丢失，必须保证在磁盘上才能（3.4.2、3.4.3）</li><li>消息发布确认：开启消息发布确认，MQ将消息发送到交换机并且保存在磁盘上之后返回一个确认，此时可以保证生产者发送的消息绝对不丢失。见：9.1</li><li>消息回退处理：当消息到达交换机无法路由到队列时，交换机把消息回退给生产者，也可以通过<strong>备份交换机</strong>实现。见：9.2</li><li>消息应答机制：设置为手动应答，保证消费者正确处理完消息，如果处理失败，消息重新入队</li><li>集群环境下，添加镜像队列。见：11.2</li></ol><h3 id="消息的类型" tabindex="-1"><a class="header-anchor" href="#消息的类型" aria-hidden="true">#</a> 消息的类型</h3><p>主要是交换机的类型，包括：</p><ol><li>直接(direct)：路由类型</li><li>主题(topic)</li><li>标题(headers) ：已经不用了</li><li>扇出(fanout)：发布订阅类型</li></ol>`,15);function Jn(Yn,Wn){const i=d("ExternalLinkIcon");return l(),r("div",null,[o,e("ol",null,[e("li",null,[c,b,e("p",null,[e("a",v,[h,n(i)])])]),e("li",null,[m,g,e("p",null,[e("a",p,[_,n(i)])]),e("p",null,[e("a",q,[f,n(i)])])]),e("li",null,[x,M,e("p",null,[e("a",E,[y,n(i)])]),e("p",null,[e("a",Q,[N,n(i)])])])]),A,e("p",null,[e("a",k,[C,n(i)])]),S,e("p",null,[e("a",T,[R,n(i)])]),D,e("p",null,[e("a",B,[j,n(i)])]),z,e("p",null,[e("a",w,[U,n(i)])]),L,e("p",null,[a("RabbitMQ在安装好后，可以访问"),e("a",P,[a("http://ip地址:15672"),n(i)]),a(" ;其自带了guest/guest的 用户名和密码。")]),I,e("p",null,[e("a",H,[X,n(i)])]),G,O,e("p",null,[e("a",K,[V,n(i)])]),F,J,e("p",null,[e("a",Y,[W,n(i)])]),Z,$,e("p",null,[e("a",ee,[ie,n(i)])]),ne,e("p",null,[e("a",ae,[te,n(i)])]),se,e("p",null,[e("a",le,[re,n(i)])]),de,e("p",null,[e("a",ue,[oe,n(i)]),a("这个时候即使重启 rabbitmq 队列也依然存在。")]),ce,be,e("p",null,[e("a",ve,[he,n(i)])]),me,ge,pe,_e,e("p",null,[e("a",qe,[fe,n(i)])]),e("p",null,[e("a",xe,[Me,n(i)])]),e("p",null,[e("a",Ee,[ye,n(i)])]),Qe,e("p",null,[e("a",Ne,[Ae,n(i)])]),ke,e("p",null,[e("a",Ce,[Se,n(i)])]),Te,Re,De,Be,e("p",null,[e("a",je,[ze,n(i)])]),we,Ue,e("p",null,[e("a",Le,[Pe,n(i)])]),Ie,e("p",null,[e("a",He,[Xe,n(i)])]),Ge,e("p",null,[e("a",Oe,[Ke,n(i)])]),Ve,e("p",null,[e("a",Fe,[Je,n(i)])]),e("p",null,[e("a",Ye,[We,n(i)])]),Ze,e("p",null,[e("a",$e,[ei,n(i)])]),ii,e("p",null,[e("a",ni,[ai,n(i)])]),ti,e("p",null,[e("a",si,[li,n(i)])]),ri,e("p",null,[e("a",di,[ui,n(i)])]),oi,e("p",null,[e("a",ci,[bi,n(i)])]),vi,e("p",null,[e("a",hi,[mi,n(i)])]),gi,pi,e("p",null,[e("a",_i,[qi,n(i)])]),fi,e("p",null,[e("a",xi,[Mi,n(i)])]),Ei,e("p",null,[e("a",yi,[Qi,n(i)])]),Ni,Ai,ki,e("ol",null,[e("li",null,[e("a",Ci,[a("SpringBoot+RabbitMQ用死信队列和插件形式实现延迟队列"),n(i)])]),e("li",null,[e("a",Si,[a("Docker安装Rabbitmq及其延时队列插件"),n(i)])])]),Ti,e("p",null,[e("a",Ri,[a("在官网"),n(i)]),a(" ，下载"),e("a",Di,[a("rabbitmq_delayed_message_exchange"),n(i)]),a("插件，然后解压放置到 RabbitMQ 的插件目录。进入 RabbitMQ 的安装目录下的 plgins 目录，执行下面命令让该插件生效，然后重启 RabbitMQ")]),Bi,e("p",null,[e("a",ji,[zi,n(i)])]),wi,e("p",null,[e("a",Ui,[Li,n(i)])]),Pi,e("p",null,[e("a",Ii,[Hi,n(i)])]),Xi,e("p",null,[e("a",Gi,[Oi,n(i)])]),Ki,e("p",null,[e("a",Vi,[Fi,n(i)])]),Ji,e("p",null,[e("a",Yi,[Wi,n(i)])]),Zi,e("p",null,[e("a",$i,[en,n(i)])]),nn,e("p",null,[e("a",an,[tn,n(i)])]),sn,e("p",null,[e("a",ln,[rn,n(i)])]),dn,e("p",null,[e("a",un,[on,n(i)])]),cn,e("p",null,[e("a",bn,[vn,n(i)])]),hn,mn,gn,pn,e("p",null,[e("a",_n,[qn,n(i)])]),fn,e("p",null,[e("a",xn,[Mn,n(i)])]),En,e("p",null,[e("a",yn,[Qn,n(i)])]),Nn,e("p",null,[e("a",An,[kn,n(i)])]),Cn,e("p",null,[e("a",Sn,[Tn,n(i)])]),Rn,Dn,Bn,jn,e("p",null,[e("a",zn,[wn,n(i)])]),Un,Ln,e("p",null,[e("a",Pn,[In,n(i)])]),Hn,e("p",null,[e("a",Xn,[Gn,n(i)])]),On,e("p",null,[e("a",Kn,[Vn,n(i)])]),Fn])}const $n=s(u,[["render",Jn],["__file","RabbitMQ_COPY.html.vue"]]);export{$n as default};
