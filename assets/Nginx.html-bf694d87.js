import{_ as i,p as l,q as p,s as n,R as s,t,Y as a,n as o}from"./framework-e1bed10d.js";const c={},u=a(`<h2 id="nginx-反向代理" tabindex="-1"><a class="header-anchor" href="#nginx-反向代理" aria-hidden="true">#</a> Nginx 反向代理</h2><h3 id="nginx-代理" tabindex="-1"><a class="header-anchor" href="#nginx-代理" aria-hidden="true">#</a> Nginx 代理</h3><p>在这种情况下，在客户端看来，<code>Nginx</code> + <code>服务端</code> 整体扮演了一个更大意义上的服务端的概念。</p><p><strong>正向代理：</strong></p><ul><li>如果把局域网外的Internet想象成一个巨大的资源库,</li><li>则局域网中的客户端要访问Internet ,则需要通过代理服务器来访问,这种代理服务就称为正向代理。代理的是客户端</li></ul><p><strong>反向代理：</strong></p><ul><li>其实客户端对代理是无感知的,因为喜户端不需要任何配置就可以访问,</li><li>我们只需要将请求发送到反向代理服务器,由反向代理服务器去选择目标服务器获取数据后,再返回给客户端,</li><li>此时反向代理服务器和目标服务器对外就是一个服务器 ,暴露的是代理服务器地址,隐藏了真实服务器IP地址。代理的是服务器</li></ul><h3 id="nginx-反向代理-案例" tabindex="-1"><a class="header-anchor" href="#nginx-反向代理-案例" aria-hidden="true">#</a> Nginx 反向代理 案例:</h3><p>1、后端工程：把一个springboot工程2个打包，分别指定运行端口8080和8081，在linux运行起来</p><p>springboot工程：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@RestController</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">HelloController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${server.port}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> port<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/hello&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">hello1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&quot;hello&quot;</span><span class="token operator">+</span>port<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
运行端口<span class="token number">8080</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、nginx配置</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>server {
    listen       80;
    server_name  www.woniu.com;
 
    location /api {
        proxy_pass  http://127.0.0.1:8080;
        rewrite &quot;^/api/(.*)$&quot; /$1 break;  
    } 
 	location / {
         root   html;
         index  index.html index.htm;
     }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    } 
} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>说明：</strong></p><ul><li>当我们访问www.woniu.com时，默认请求nginx里面的html目录的index.html.</li><li>当我们请求www.woniu.com/api/hello时，由于以/api开头，则匹配第一个location，然后请求http://127.0.0.1:8080服务器，</li><li>那么问题来了，nginx转发的请求是http://127.0.0.1:8080/api/hello还是http://127.0.0.1:8080/api</li></ul><p><strong>这里就要注意转发规则：</strong></p><ul><li>大家可以看看这句话： rewrite &quot;^/user/(.*)$&quot; /$1 break;</li><li>也就是路径重写 1代表第一个（）里面的内容，如果有第二.....多个括号，</li><li>则同样的用2.....表示即可，这个正则表达式意思是说 以 api开头的被替换成/,( )里面的内容就是用$1占位符来表示，</li><li>变相的把api截掉了</li></ul><h2 id="nginx-window版" tabindex="-1"><a class="header-anchor" href="#nginx-window版" aria-hidden="true">#</a> Nginx Window版</h2><ul><li><p>从<a href="">官网</a> (opens new window)](http://nginx.org/en/download.html)下载最新的文档版。例如：<code>nginx-1.18.0</code></p></li><li><p>解压 <em><code>nginx-1.18.0.zip</code></em> 到本地目录。按惯例，路径中不要有中文，最好不要有空格。</p></li><li><p>例如：<code>D:\\ProgramFiles\\nginx-1.18.0</code> 。</p></li><li><p>解压后，可到看到如下内容：</p></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nginx-1.18.0
│── conf        配置文件目录
├── contrib
├── docs
├── html        类似 tomcat 的 webapps
├── logs        日志目录  access.log成功日志  error.log失败日志
├── temp
└── nginx.exe   启动程序
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-nginx" tabindex="-1"><a class="header-anchor" href="#启动-nginx" aria-hidden="true">#</a> 启动 Nginx</h3><p>启动 Nginx 的方式有 2 种：</p><ol><li>直接双击 <code>nginx.exe</code>。双击后一个黑色的弹窗一闪而过。</li><li>打开 cmd 命令窗口，切换到 nginx 解压目录下，输入命令 <code>nginx.exe</code> 或者 <code>start nginx</code> 。</li></ol><p>检查 Nginx 是否启动成功的方式也有 2 种：</p>`,24),d={href:"http://localhost/",target:"_blank",rel:"noopener noreferrer"},r=n("em",null,"http://localhost:80",-1),v=a(`<li><p>在 cmd 命令窗口输入命令 <code>tasklist /fi &quot;imagename eq nginx.exe&quot;</code> 。你会看到类似如下页面：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>映像名称    PID     会话名      会话#   内存使用
=========== ======= =========== ======= ============
nginx.exe   17220   Console     8       7,148 K
nginx.exe   17660   Console     8       7,508 K
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),m=a(`<h3 id="关闭-nginx" tabindex="-1"><a class="header-anchor" href="#关闭-nginx" aria-hidden="true">#</a> 关闭 Nginx</h3><p>如果使用 cmd 命令窗口启动 nginx，关闭 cmd 窗口是<strong>不能</strong>结束 nginx 进程的。</p><p>可使用两种方法关闭 nginx：</p><ol><li>输入 <code>nginx</code> 命令：<code>nginx -s stop</code>（快速停止 nginx）或 <code>nginx -s quit</code>（完整有序的停止 nginx）。</li><li>使用 <code>taskkill</code> 命令： <code>taskkill /f /t /im nginx.exe</code></li></ol><h2 id="nginx-linux版" tabindex="-1"><a class="header-anchor" href="#nginx-linux版" aria-hidden="true">#</a> Nginx linux版</h2><h3 id="nginx-环境依赖" tabindex="-1"><a class="header-anchor" href="#nginx-环境依赖" aria-hidden="true">#</a> Nginx 环境依赖</h3><p>1、需要安装gcc的环境。yum install gcc-c++</p><p>2、第三方的开发包。</p><p>PCRE:PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库。nginx的http模块使用pcre来解析正则表达式，所以需要在linux上安装pcre库。pcre-devel是使用pcre开发的一个二次开发库。nginx也需要此库。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> pcre pcre-devel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>zlib:zlib库提供了很多种压缩和解压缩的方式，nginx使用zlib对http包的内容进行gzip，所以需要在linux上安装zlib库。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> zlib zlib-devel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>openssl: OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及SSL协议，并提供丰富的应用程序供测试或其它目的使用。nginx不仅支持http协议，还支持https（即在ssl协议上传输http），所以需要在linux安装openssl库。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> openssl openssl-devel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="nginx-安装步骤" tabindex="-1"><a class="header-anchor" href="#nginx-安装步骤" aria-hidden="true">#</a> Nginx 安装步骤</h3><p>把nginx的源码包上传到linux系统</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># tar zxvf nginx-1.8.0.tar.gz</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用configure命令创建一makeFile文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./configure <span class="token punctuation">\\</span>
<span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/nginx <span class="token punctuation">\\</span>
--pid-path<span class="token operator">=</span>/var/run/nginx/nginx.pid <span class="token punctuation">\\</span>
--lock-path<span class="token operator">=</span>/var/lock/nginx.lock <span class="token punctuation">\\</span>
--error-log-path<span class="token operator">=</span>/var/log/nginx/error.log <span class="token punctuation">\\</span>
--http-log-path<span class="token operator">=</span>/var/log/nginx/access.log <span class="token punctuation">\\</span>
--with-http_gzip_static_module <span class="token punctuation">\\</span>
--http-client-body-temp-path<span class="token operator">=</span>/var/temp/nginx/client <span class="token punctuation">\\</span>
--http-proxy-temp-path<span class="token operator">=</span>/var/temp/nginx/proxy <span class="token punctuation">\\</span>
--http-fastcgi-temp-path<span class="token operator">=</span>/var/temp/nginx/fastcgi <span class="token punctuation">\\</span>
--http-uwsgi-temp-path<span class="token operator">=</span>/var/temp/nginx/uwsgi <span class="token punctuation">\\</span>
--http-scgi-temp-path<span class="token operator">=</span>/var/temp/nginx/scgi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：启动nginx之前，上边将临时文件目录指定为/var/temp/nginx，需要在/var下创建temp及nginx目录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment"># mkdir  -p  /var/temp/nginx/client </span>
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment">#make</span>
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment">#make install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-nginx-1" tabindex="-1"><a class="header-anchor" href="#启动-nginx-1" aria-hidden="true">#</a> 启动 Nginx</h3><blockquote><p>注意: 安装完成的源目录是在 /usr/local/nginx/sbin 里 并不是安装包的位置</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>进入sbin目录
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment"># ./nginx </span>
关闭nginx：
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment"># ./nginx -s stop</span>
推荐使用：
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment"># ./nginx -s quit</span>
重启nginx：
<span class="token number">1</span>、先关闭后启动。
<span class="token number">2</span>、刷新配置文件：
<span class="token punctuation">[</span>root@localhost sbin<span class="token punctuation">]</span><span class="token comment"># ./nginx -s reload</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问-nginx" tabindex="-1"><a class="header-anchor" href="#访问-nginx" aria-hidden="true">#</a> 访问 Nginx</h3><p>默认是80端口。注意：是否关闭防火墙。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[root@localhost sbin]</span><span class="token comment"># systemctl stop firewalld.service</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="nginx-配置文件" tabindex="-1"><a class="header-anchor" href="#nginx-配置文件" aria-hidden="true">#</a> Nginx 配置文件</h2><ul><li>在 nginx.conf 的注释符号为： #；每个指令必须有分号结束</li></ul><h3 id="全局块" tabindex="-1"><a class="header-anchor" href="#全局块" aria-hidden="true">#</a> 全局块</h3><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>user  nobody; 表示配置用户，默认用户为nobody（nobody表示任何用户），该指令的作用是哪些用户可以启动worker进程。nginx在启动后是有多个进程相互协助工作的，默认是一个master主进程和一个worker工作进程。其中主进程负责接收客户端的请求，worker进程负责处理请求，响应结果。你也可以把前面的注释去掉，写上一个具体的用户 user root

worker_processes：工作进程的个数，默认为1，一般来说会设置成cpu核数的2倍；如果你设置一个数值为3，那么nginx在启动的时候会有3个workder进程和一个master主进程

error_log：nginx的日志级别配置， 默认为cri，级别从低到高为debug, info, notice, warn, error, crit ；如果你要调成notice日志级别，只要#error_log  logs/error.log  notice;前面的注释去掉即可，日志位置在安装nginx的时候就已经指定

pid：指定nginx进程运行文件存放地址
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#user  nobody;</span>
worker_processes  <span class="token number">1</span><span class="token punctuation">;</span>

<span class="token comment">#error_log  logs/error.log;</span>
<span class="token comment">#error_log  logs/error.log  notice;</span>
<span class="token comment">#error_log  logs/error.log  info;</span>

<span class="token comment">#pid        logs/nginx.pid;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="events块" tabindex="-1"><a class="header-anchor" href="#events块" aria-hidden="true">#</a> events块</h3><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>events <span class="token punctuation">{</span>
	accept_mutex on<span class="token punctuation">;</span>   <span class="token comment">#设置网路连接序列化，防止惊群现象发生，默认为on</span>
	multi_accept on<span class="token punctuation">;</span>  <span class="token comment">#设置一个进程是否同时接受多个网络连接，默认为off</span>
    worker_connections  1024<span class="token punctuation">;</span>  <span class="token comment">#每个worker进程最大连接数，这个值最大可设置为：65535</span>
<span class="token punctuation">}</span>
<span class="token comment">##惊群现象：一个网路连接到来，多个睡眠的进程被同时叫醒，但只有一个进程能获得链接，这样会影响系统性能</span>
<span class="token comment">##单台nginx最大连接数为 worker_processes*worker_connections</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="http块" tabindex="-1"><a class="header-anchor" href="#http块" aria-hidden="true">#</a> http块</h3><p>可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置</p><h3 id="server块" tabindex="-1"><a class="header-anchor" href="#server块" aria-hidden="true">#</a> server块</h3><p>配置虚拟主机的相关参数，一个http中可以有多个server</p><h3 id="location块" tabindex="-1"><a class="header-anchor" href="#location块" aria-hidden="true">#</a> location块</h3><p>配置请求的路由，以及各种页面的处理情况</p><h2 id="nginx-配置虚拟主机" tabindex="-1"><a class="header-anchor" href="#nginx-配置虚拟主机" aria-hidden="true">#</a> Nginx 配置虚拟主机</h2><p>就是在一台服务器启动多个网站。如何区分不同的网站：</p><p>1、域名不同</p><p>2、端口不同</p><h3 id="通过端口区分不同虚拟机" tabindex="-1"><a class="header-anchor" href="#通过端口区分不同虚拟机" aria-hidden="true">#</a> 通过端口区分不同虚拟机</h3><h4 id="打开nginx的配置文件" tabindex="-1"><a class="header-anchor" href="#打开nginx的配置文件" aria-hidden="true">#</a> 打开Nginx的配置文件</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost nginx<span class="token punctuation">]</span><span class="token comment"># vim  conf/nginx.conf</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>server <span class="token punctuation">{</span>
    listen       <span class="token number">80</span><span class="token punctuation">;</span>
    server_name  localhost<span class="token punctuation">;</span>
    <span class="token comment">#charset koi8-r;</span>
    <span class="token comment">#access_log  logs/host.access.log  main;</span>
    location / <span class="token punctuation">{</span>
    root   html<span class="token punctuation">;</span>
    index  index.html index.htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>说明：一个server节点就是一个虚拟主机，html是nginx安装目录下的html目录(静态页面存放的位置,也可以使用绝对路径)，可以配置多个server，配置了多个虚拟主机</p></blockquote><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code> server <span class="token punctuation">{</span>
        listen       81<span class="token punctuation">;</span>
        server_name  localhost<span class="token punctuation">;</span>
        <span class="token comment">#charset koi8-r;</span>
        <span class="token comment">#access_log  logs/host.access.log  main;</span>
        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root   html-81<span class="token punctuation">;</span>
            index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="重新加载配置文件" tabindex="-1"><a class="header-anchor" href="#重新加载配置文件" aria-hidden="true">#</a> 重新加载配置文件</h4><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token namespace">[root@localhost nginx]</span><span class="token comment"># sbin/nginx -s reload</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意: <strong>一定要关闭防火墙</strong></p><h3 id="通过域名区分虚拟主机" tabindex="-1"><a class="header-anchor" href="#通过域名区分虚拟主机" aria-hidden="true">#</a> 通过域名区分虚拟主机</h3><h4 id="什么是域名" tabindex="-1"><a class="header-anchor" href="#什么是域名" aria-hidden="true">#</a> 什么是域名</h4>`,55),k={href:"http://www.jd.com",target:"_blank",rel:"noopener noreferrer"},h=a(`<p>dns服务器：把域名解析为ip地址。保存的就是域名和ip的映射关系</p><ul><li><p>一级域名：一串字符串中间一个点隔开，例如baidu.com。是互联网DNS等级之中的最高级的域，它保存于DNS根域的名字空间中</p></li><li><p>二级域名：是一个一级域名以下的主机名，一串字符串中间两个“.”隔开，例如www.baidu.com。二级域名就是最靠近顶级域名左侧的字段</p></li><li><p>三级域名：二级域名的子域名，特征是包含三个“.”，例如___.___.baidu.com ，___上可以填写任意内容，都属于三级域名</p></li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>我们接触的顶级域名<span class="token punctuation">(</span>一级域名<span class="token punctuation">)</span>又分为两类：一是国家和地区顶级域名，例如中国是cn；二是国际顶级域名，例如表示工商企业的<span class="token punctuation">.</span>com，表示非盈利组织的<span class="token punctuation">.</span>org，表示网络商的<span class="token punctuation">.</span>net，edu为学校单位，<span class="token punctuation">.</span>gov为政府机构等

一个域名对应一个ip地址，一个ip地址可以被多个域名绑定。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实验1：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>修改window的hosts文件：（C:\\Windows\\System32\\drivers\\etc）
注意：该文件如果配置域名和ip的映射关系，如果hosts文件中配置了域名和ip的对应关系，不需要走dns服务器。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>192<span class="token punctuation">.</span>168<span class="token punctuation">.</span>128<span class="token punctuation">.</span>129 www<span class="token punctuation">.</span>jd<span class="token punctuation">.</span>com
192<span class="token punctuation">.</span>168<span class="token punctuation">.</span>128<span class="token punctuation">.</span>129 www<span class="token punctuation">.</span>163<span class="token punctuation">.</span>com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：如果修改后映射不生效，可参考以下解决办法：</p><p>1.该文件保存时未使用ansi编码进行保存，解决办法：更改文件编码为ansi进行保存</p><p>2.启用了DNS Client服务（该服务为DNS解析的缓存服务）解决办法：将该服务停用；如果该服务为自动启用，请改为手动启用</p><h4 id="nginx的配置" tabindex="-1"><a class="header-anchor" href="#nginx的配置" aria-hidden="true">#</a> <strong>Nginx的配置</strong></h4><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>server <span class="token punctuation">{</span>
        listen       80<span class="token punctuation">;</span>
        server_name  www<span class="token punctuation">.</span>jd<span class="token punctuation">.</span>com<span class="token punctuation">;</span>
        <span class="token comment">#charset koi8-r;</span>
        <span class="token comment">#access_log  logs/host.access.log  main;</span>
        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root   html-jd<span class="token punctuation">;</span>
            index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
 server <span class="token punctuation">{</span>
        listen       80<span class="token punctuation">;</span>
        server_name  www<span class="token punctuation">.</span>163<span class="token punctuation">.</span>com<span class="token punctuation">;</span>
        <span class="token comment">#charset koi8-r;</span>
        <span class="token comment">#access_log  logs/host.access.log  main;</span>
        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root   html-163<span class="token punctuation">;</span>
            index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nginx-负载均衡" tabindex="-1"><a class="header-anchor" href="#nginx-负载均衡" aria-hidden="true">#</a> Nginx 负载均衡</h2><p>负载均衡（load balance）就是将负载分摊到多个操作单元上执行，从而提高服务的可用性和响应速度，带给用户更好的体验</p><h3 id="负载均衡的配置" tabindex="-1"><a class="header-anchor" href="#负载均衡的配置" aria-hidden="true">#</a> 负载均衡的配置</h3><p>通过 Nginx 中的 <strong>upstream</strong> 指令可以实现负载均衡，再该指令中能够配置负载均衡服务器组</p><p>目前负载均衡有 4 种典型的配置方式。分别是：</p><table><thead><tr><th style="text-align:center;">#</th><th style="text-align:left;">负载均衡方式</th><th style="text-align:left;">特点</th></tr></thead><tbody><tr><td style="text-align:center;">1</td><td style="text-align:left;">轮询方式</td><td style="text-align:left;">默认方式。每个请求按照时间顺序逐一分配到不同的后端服务器进行处理。如果有服务器宕机，会自动删除。</td></tr><tr><td style="text-align:center;">2</td><td style="text-align:left;">权重方式</td><td style="text-align:left;">利用 weight 指定轮循的权重比率，与访问率成正比。用于后端服务器性能不均衡的情况。</td></tr><tr><td style="text-align:center;">3</td><td style="text-align:left;">ip_hash 方法</td><td style="text-align:left;">每个请求按照访问 IP 的 hash 结果分配，这样可以使每个方可固定一个后端服务器，可以解决 Session 共享问题。</td></tr><tr><td style="text-align:center;">4</td><td style="text-align:left;">第三方模块</td><td style="text-align:left;">取决于所采用的第三方模块的分配规则。</td></tr></tbody></table><p>在 upstream 指定的服务器组中，若每个服务器的权重都设置为 1（默认值）时，表示当前的负载均衡是一般轮循方式</p><h3 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h3><p>编写后台（SpringBoot）项目，简单起见，以占用不同的端口的形式启动 2 次，并在返回的信息中返回各自所占用的端口号</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${server.port}&quot;</span><span class="token punctuation">)</span>
<span class="token class-name">String</span> port<span class="token punctuation">;</span>

<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/api/hello&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;code&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;10086&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;msg&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;success&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;data&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>port<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> map<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="负载方式" tabindex="-1"><a class="header-anchor" href="#负载方式" aria-hidden="true">#</a> 负载方式</h3><h4 id="_1-轮询" tabindex="-1"><a class="header-anchor" href="#_1-轮询" aria-hidden="true">#</a> 1.轮询</h4><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>upstream xxx <span class="token punctuation">{</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:8080<span class="token punctuation">;</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:9090<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
upstream yyy <span class="token punctuation">{</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">;</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
server <span class="token punctuation">{</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    location <span class="token operator">/</span>api <span class="token punctuation">{</span>
        proxy_pass http:<span class="token operator">/</span><span class="token operator">/</span>xxx<span class="token punctuation">;</span>
        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token punctuation">}</span>
    location <span class="token operator">/</span>user <span class="token punctuation">{</span>
        proxy_pass http:<span class="token operator">/</span><span class="token operator">/</span>yyy<span class="token punctuation">;</span>
        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述的配置中有 2 点需要注意的：</p><p>1、<strong>upstream</strong> 配置项在 <strong>http</strong> 配置项内，但是在 <strong>server</strong> 配置项外，它们 3 者整体结构如下（不要写错地方了）：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http <span class="token punctuation">{</span>
    <span class="token comment"># 它们两者平级</span>
    server <span class="token punctuation">{</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> <span class="token punctuation">}</span>
    upstream <span class="token punctuation">{</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、你所配置的 <strong>upstream</strong> 的 name 是自定义的，但是不要出现 <strong><code>-</code></strong> 号，否则会和 tomcat 有冲突。</p><p>测试：你持续访问 <code>http://127.0.0.1/api/hello</code> 你会发现页面的内容会是交替出现 <code>8080</code> 端口和 <code>9090</code> 端口</p><h4 id="_2-加权轮询" tabindex="-1"><a class="header-anchor" href="#_2-加权轮询" aria-hidden="true">#</a> 2.加权轮询</h4><p>加权轮循就是在轮循的基础上，为每个单点加上权值。权值越重的单点，承担的访问量自然也就越大。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>upstream xxx <span class="token punctuation">{</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:8080 weight=1<span class="token punctuation">;</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:9090 weight=2<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按照上述配置，<code>9090</code> 端口的服务将承担 2/3 的访问量，而 <code>8080</code> 端口则承担 1/3 的访问量。</p><p>将配置改为上述样子并重启 Nginx 后，再持续访问 <code>http://127.0.0.1/api/hello</code> 你会发现 <code>8080</code> 端口和 <code>9090</code> 端口会以 <code>1-2-1-2-...</code> 的次数交替出现。</p><p>除了 <strong>weight</strong> 外，常见的状态参数还有：</p><table><thead><tr><th style="text-align:left;">配置方式</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">max_fails</td><td style="text-align:left;">允许请求失败次数，默认为 1 。通常和下面的 fail_timeout 连用。</td></tr><tr><td style="text-align:left;">fail_timeout</td><td style="text-align:left;">在经历了 max_fails 次失败后，暂停服务的时长。这段时间内，这台服务器 Nginx 不会请求这台 Server</td></tr><tr><td style="text-align:left;">backup</td><td style="text-align:left;">预留的备份机器。它只有在其它非 backup 机器出现故障时或者忙碌的情况下，才会承担负载任务。</td></tr><tr><td style="text-align:left;">down</td><td style="text-align:left;">表示当前的 server 不参与负载均衡。</td></tr></tbody></table><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>upstream web_server {
    server 192.168.78.128 weight=1 max_fails=1 fail_timeout=30s;
    server 192.168.78.200 weight=2 max_fails=1 fail_timeout=30s;
    server 192.168.78.201 backup;
    server 192.168.78.210 down;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-ip-hash-负载" tabindex="-1"><a class="header-anchor" href="#_3-ip-hash-负载" aria-hidden="true">#</a> 3.ip_hash 负载</h4><p>ip_hash 方式的负载均衡，是将每个请求按照访问 IP 的 hash 结果分配，这样就可以使来自同一个 IP 的客户端固定访问一台 Web 服务器，从而就解决了 Session 共享问题</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>upstream xxx <span class="token punctuation">{</span>
    ip_hash<span class="token punctuation">;</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:8080<span class="token punctuation">;</span>
    server 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:9090<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用上例配置后，你会发现无论你请求多少次 <code>http://127.0.0.1/api/hello</code> 你所看到的端口始终是 <code>8080</code> 和 <code>9090</code> 中的某一个。</p><h3 id="浏览器ip传递到后台" tabindex="-1"><a class="header-anchor" href="#浏览器ip传递到后台" aria-hidden="true">#</a> 浏览器IP传递到后台</h3><p>对于后台而言，它所面对的『<strong>客户端</strong>』就是 Nginx，后台看不见『<strong>客户端</strong>』浏览器。这就意味着，你如果你需要在后台获取客户端浏览器的 IP 地址，你需要明确指出让 Nginx 『<strong>额外地多携带</strong>』一些数据。</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>location <span class="token operator">/</span>api <span class="token punctuation">{</span>
    proxy_pass http:<span class="token operator">/</span><span class="token operator">/</span>xxx/api<span class="token punctuation">;</span>
    proxy_set_header X-Real-IP <span class="token variable">$remote_addr</span><span class="token punctuation">;</span>

    <span class="token comment"># proxy_set_header Cookie $http_cookie;</span>
    <span class="token comment"># proxy_set_header Host $http_host;</span>
    <span class="token comment"># proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Spring Boot 的 Controller 中你有 2 种方式来获得这个额外的信息：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">index</span><span class="token punctuation">(</span>
        <span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">,</span>
        <span class="token annotation punctuation">@RequestHeader</span><span class="token punctuation">(</span><span class="token string">&quot;X-Real-IP&quot;</span><span class="token punctuation">)</span> <span class="token class-name">String</span> realIP2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> realIP1 <span class="token operator">=</span> request<span class="token punctuation">.</span><span class="token function">getHeader</span><span class="token punctuation">(</span><span class="token string">&quot;X-Real-IP&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-解决前后端跨域" tabindex="-1"><a class="header-anchor" href="#nginx-解决前后端跨域" aria-hidden="true">#</a> Nginx 解决前后端跨域</h3><p>Spring Boot 不提供任何动态页面、资源，只提供 JSON 格式数据</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http <span class="token punctuation">{</span>
    include       mime<span class="token punctuation">.</span>types<span class="token punctuation">;</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>
    sendfile        on<span class="token punctuation">;</span>
    keepalive_timeout  65<span class="token punctuation">;</span>  <span class="token comment"># TCP 连接存活 65 秒</span>
    server <span class="token punctuation">{</span>
        <span class="token comment"># Nginx 监听 localhost:80 端口</span>
        listen       80<span class="token punctuation">;</span>
        server_name  localhost<span class="token punctuation">;</span>

        <span class="token comment"># 访问 URI 根路径时，返回 Nginx 根目录下的 html 目录下的 index.html 或 index.htm</span>
        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
            index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment"># URI 路径以 /api 开头的将转交给『别人』处理</span>
        location <span class="token operator">/</span>api <span class="token punctuation">{</span>
            proxy_pass http:<span class="token operator">/</span><span class="token operator">/</span>localhost:8080/api<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment"># 出现 500、502、503、504 错误时，返回 Nginx 根目录下的 html 目录下的 50x.html 。</span>
        error_page   500 502 503 504  <span class="token operator">/</span>50x<span class="token punctuation">.</span>html<span class="token punctuation">;</span>    
        location = <span class="token operator">/</span>50x<span class="token punctuation">.</span>html <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.html内容，放nginx运行</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>./js/jquery-1.11.3.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text/javascript<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
$<span class="token punctuation">.</span><span class="token function">ajax</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">&#39;http://192.168.128.128:80/api/hello&#39;</span><span class="token punctuation">,</span> <span class="token comment">// 注意这里的 URL</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
  <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">result</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">&quot;h2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">html</span><span class="token punctuation">(</span><span class="token string">&quot;跨域访问成功:&quot;</span> <span class="token operator">+</span> result<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">error</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">&quot;h2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">html</span><span class="token punctuation">(</span><span class="token string">&quot;跨域失败!!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先当我们访问192.168.128.128时。显示index.html首页内容。在首页加载时异步请求http://127.0.0.1:80/api/hello的请求，被Nginx 接收后，Nginx 会『帮』我们去访问 http://127.0.0.1:8080<code>的</code>/api/hello，并将结果再返回给客户端了浏览器</p><h2 id="nginx-docker-部署" tabindex="-1"><a class="header-anchor" href="#nginx-docker-部署" aria-hidden="true">#</a> Nginx Docker 部署</h2><h3 id="创建docker容器" tabindex="-1"><a class="header-anchor" href="#创建docker容器" aria-hidden="true">#</a> 创建Docker容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 拉取nginx镜像</span>
<span class="token function">docker</span> pull nginx
<span class="token comment"># 创建名为: My_nginx 的 Nginx 容器</span>
<span class="token function">docker</span> run <span class="token parameter variable">-id</span> <span class="token parameter variable">--name</span><span class="token operator">=</span>My_nginx <span class="token parameter variable">-p</span> <span class="token number">1098</span>:80 nginx:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改配置" tabindex="-1"><a class="header-anchor" href="#修改配置" aria-hidden="true">#</a> 修改配置</h3><ul><li>进入容器后 修改配置 设置端口代理</li></ul><h4 id="nginx-配置文件路径" tabindex="-1"><a class="header-anchor" href="#nginx-配置文件路径" aria-hidden="true">#</a> Nginx 配置文件路径</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 配置文件</span>
/etc/nginx/nginx.conf  
<span class="token comment"># 设置端口代理配置文件</span>
/etc/nginx/conf.d/default.conf
<span class="token comment"># nginx容器默认的日志文件保存到/var/log/nginx目录下</span>
/var/log/nginx        
<span class="token comment">#nginx默认会去访问/usr/share/nginx/html下的index.html</span>
/usr/share/nginx/html       
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginx-conf-详解" tabindex="-1"><a class="header-anchor" href="#nginx-conf-详解" aria-hidden="true">#</a> nginx.conf 详解</h4><ul><li>可将 server 部分拆开写入 default.conf 配置文件内</li></ul><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>http <span class="token punctuation">{</span>
    include       mime<span class="token punctuation">.</span>types<span class="token punctuation">;</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>
    sendfile        on<span class="token punctuation">;</span>
    keepalive_timeout  65<span class="token punctuation">;</span>  <span class="token comment"># TCP 连接存活 65 秒</span>
    server <span class="token punctuation">{</span>
        <span class="token comment"># Nginx 监听 localhost:80 端口</span>
        listen       80<span class="token punctuation">;</span>
        server_name  localhost<span class="token punctuation">;</span>

        <span class="token comment"># 访问 URI 根路径时，返回 Nginx 根目录下的 html 目录下的 index.html 或 index.htm</span>
        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
            index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment"># URI 路径以 /api 开头的将转交给『别人』处理</span>
        location <span class="token operator">/</span>api <span class="token punctuation">{</span>
            proxy_pass http:<span class="token operator">/</span><span class="token operator">/</span>localhost:8080/api<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment"># 出现 500、502、503、504 错误时，返回 Nginx 根目录下的 html 目录下的 50x.html 。</span>
        error_page   500 502 503 504  <span class="token operator">/</span>50x<span class="token punctuation">.</span>html<span class="token punctuation">;</span>    
        location = <span class="token operator">/</span>50x<span class="token punctuation">.</span>html <span class="token punctuation">{</span>
            root   html<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="default-conf-详解" tabindex="-1"><a class="header-anchor" href="#default-conf-详解" aria-hidden="true">#</a> default.conf 详解</h4><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>server <span class="token punctuation">{</span>
    
    <span class="token comment"># Nginx 监听 localhost:80 端口</span>
    listen       80<span class="token punctuation">;</span>
    listen  <span class="token punctuation">[</span>::<span class="token punctuation">]</span>:80<span class="token punctuation">;</span>
    server_name  localhost<span class="token punctuation">;</span>
    
    <span class="token comment"># URI 路径以 /api 开头的将转交给『别人:175.178.126.61:1082』处理</span>
    location <span class="token operator">/</span>api <span class="token punctuation">{</span>
        proxy_pass  http:<span class="token operator">/</span><span class="token operator">/</span>175<span class="token punctuation">.</span>178<span class="token punctuation">.</span>126<span class="token punctuation">.</span>61:1082<span class="token punctuation">;</span>
        rewrite <span class="token string">&quot;^/api/(.*)$&quot;</span> <span class="token operator">/</span><span class="token variable">$1</span> <span class="token keyword">break</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>

    <span class="token comment"># 访问 URI 根路径时，返回 Nginx 根目录下的 html 目录下的 index.html 或 index.htm</span>
    location <span class="token operator">/</span> <span class="token punctuation">{</span>
        root   <span class="token operator">/</span>usr/share/nginx/Apai-Html<span class="token punctuation">;</span>
        index  index<span class="token punctuation">.</span>html index<span class="token punctuation">.</span>htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment"># 出现 500、502、503、504 错误时，返回 Nginx 根目录下的 html 目录下的 50x.html</span>
    error_page   500 502 503 504  <span class="token operator">/</span>50x<span class="token punctuation">.</span>html<span class="token punctuation">;</span>
    location = <span class="token operator">/</span>50x<span class="token punctuation">.</span>html <span class="token punctuation">{</span>
        root   <span class="token operator">/</span>usr/share/nginx/html<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="放入项目包" tabindex="-1"><a class="header-anchor" href="#放入项目包" aria-hidden="true">#</a> 放入项目包</h3><ul><li>将前端打包为文件夹 主文件: index.html</li><li>放人我们配置的位置 例如: /usr/share/nginx/Apai-Html 文件夹下</li><li>最后 刷新Nginx 的配置 和重启Nginx 服务即可</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 要刷新Nginx的配置文件，可以使用以下命令：</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token operator">&lt;</span>container_name<span class="token operator">&gt;</span> nginx <span class="token parameter variable">-s</span> reload
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> 345f6fe1339a nginx <span class="token parameter variable">-s</span> reload
<span class="token comment"># 其中 &lt;container_name&gt; 是你的 Nginx Docker 容器的名称或 ID。</span>
<span class="token comment"># 如果需要重启 Nginx 服务器，可以使用以下命令：</span>
<span class="token function">docker</span> restart <span class="token operator">&lt;</span>container_name<span class="token operator">&gt;</span>
<span class="token function">docker</span> restart 345f6fe1339a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nginx-搭建文件服务器" tabindex="-1"><a class="header-anchor" href="#nginx-搭建文件服务器" aria-hidden="true">#</a> Nginx 搭建文件服务器</h2><h3 id="修改配置-1" tabindex="-1"><a class="header-anchor" href="#修改配置-1" aria-hidden="true">#</a> 修改配置</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>server <span class="token punctuation">{</span>
        listen       <span class="token number">80</span><span class="token punctuation">;</span>
        server_name  localhost<span class="token punctuation">;</span> 
        location / <span class="token punctuation">{</span>
	    root   /opt/soft/<span class="token punctuation">;</span> <span class="token comment">#可以在这个目录放置一些软件包，供别人下载</span>
	    autoindex on<span class="token punctuation">;</span>             <span class="token comment">#开启索引功能  这句话很重要</span>
        autoindex_exact_size off<span class="token punctuation">;</span> <span class="token comment"># 关闭计算文件确切大小（单位bytes），只显示大概大小（单位kb、mb、gb）</span>
        autoindex_localtime on<span class="token punctuation">;</span>   <span class="token comment"># 显示本机时间而非 GMT 时间</span>
        charset utf-8<span class="token punctuation">;</span> <span class="token comment"># 避免中文乱码 </span>
        <span class="token comment"># root html;</span>
        <span class="token comment"># index  index.html index.htm;</span>
        <span class="token punctuation">}</span> 
    <span class="token punctuation">}</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问" tabindex="-1"><a class="header-anchor" href="#访问" aria-hidden="true">#</a> 访问</h3><ul><li>直接通过 IP + 端口 访问</li><li>可以直接存储文件 IP + 端口 + 文件名 下载等</li><li>如果安装本地 在局域网的其他人可实现共享文件的功能</li></ul>`,73);function b(g,x){const e=o("ExternalLinkIcon");return l(),p("div",null,[u,n("ol",null,[n("li",null,[n("p",null,[s("直接在浏览器地址栏输入网址 "),n("a",d,[r,s(" (opens new window)"),t(e)]),s("。你会看到欢迎页面。")])]),v]),m,n("p",null,[s("域名就是网站。如www.baidu.com www.taobao.com "),n("a",k,[s("www.jd.com"),t(e)])]),h])}const w=i(c,[["render",b],["__file","Nginx.html.vue"]]);export{w as default};
