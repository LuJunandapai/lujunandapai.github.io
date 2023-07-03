import{_ as i,p as l,q as p,s as n,R as s,t as e,Y as t,n as c}from"./framework-e1bed10d.js";const o={},r=n("h2",{id:"docker-远程访问",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#docker-远程访问","aria-hidden":"true"},"#"),s(" Docker 远程访问")],-1),d=n("li",null,"建议增加证书连接 安全 | 没有密码暴露端口很危险",-1),u={href:"https://blog.csdn.net/hanxiaotongtong/article/details/124240589",target:"_blank",rel:"noopener noreferrer"},m=t(`<h3 id="配置-docker-设置" tabindex="-1"><a class="header-anchor" href="#配置-docker-设置" aria-hidden="true">#</a> 配置 Docker 设置</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1. 修改配置文件vim /usr/lib/systemd/system/docker.service，这是开启docker远程访问服务的第一步。0.0.0.0:2375表示在当前主机上所有网卡监听2375端口。修改ExecStart这行</span>
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/bin/dockerd <span class="token parameter variable">-H</span> fd:// <span class="token parameter variable">-H</span> tcp://0.0.0.0:2375  <span class="token parameter variable">-H</span> unix:///var/run/docker.sock  <span class="token parameter variable">--containerd</span><span class="token operator">=</span>/run/containerd/containerd.sock
<span class="token comment"># 2. 重新加载配置文件，并重启docker守护进程</span>
systemctl daemon-reload <span class="token operator">&amp;&amp;</span> systemctl restart <span class="token function">docker</span>
<span class="token comment"># 3. 查看端口是否开启,有一行记录显示2375端口被监听，即正确 或者通过浏览器访问http://&lt;docker宿主机ip&gt;:2375/info也可以进行验证,有响应结果即正确，返回的是一个JSON的docker服务状态及配置信息</span>
<span class="token function">netstat</span> -nptl<span class="token operator">|</span><span class="token function">grep</span> <span class="token number">2375</span><span class="token punctuation">;</span>
http://175.178.126.61:1011/info
<span class="token comment"># 4. 需要注意的是如果你的服务器上防火墙没有开放2375端口访问，请使用下面的命令开放2375端口(注意：下面的命令行适用于CentOS7、8发行版，如果你是其他的linux发行版，命令可能不一样)。</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">2375</span>/tcp --permanent<span class="token punctuation">;</span>   <span class="token comment">#配置开放端口</span>
firewall-cmd --reload<span class="token punctuation">;</span>   <span class="token comment">#重新加载配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置-idea-连接" tabindex="-1"><a class="header-anchor" href="#设置-idea-连接" aria-hidden="true">#</a> 设置 IDEA 连接</h3><ul><li>在IDEA服务下进行配置Docker连接设置</li><li>TCP连接: 服务器的IP地址和Docker远程连接端口</li></ul><p><img src="https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20230322155327956.png" alt="image-20230322155327956"></p><h2 id="docker-远程证书访问" tabindex="-1"><a class="header-anchor" href="#docker-远程证书访问" aria-hidden="true">#</a> Docker 远程证书访问</h2>`,6),v=n("li",null,"开启证书校验远程连接比较安全 避免被黑挖矿 PS:亲身经历服务器差点被封了",-1),k={href:"https://blog.csdn.net/qq_34626094/article/details/130579470",target:"_blank",rel:"noopener noreferrer"},b={href:"https://blog.csdn.net/jimbooks/article/details/98037922",target:"_blank",rel:"noopener noreferrer"},g=t(`<h3 id="创建证书脚本" tabindex="-1"><a class="header-anchor" href="#创建证书脚本" aria-hidden="true">#</a> 创建证书脚本</h3><p>1.创建脚本</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建脚本文件 ca.sh</span>
<span class="token function">touch</span> ca.sh
<span class="token comment"># 设置文件权限 设置为可执行脚本</span>
<span class="token function">chmod</span> <span class="token number">777</span> ca.sh 或者 <span class="token function">chmod</span> +x ca.sh
<span class="token comment"># 如果在运行脚本报错: [:No such file or directory] </span>
<span class="token comment"># 表示: Windows环境下dos格式文件传输到unix系统时,会在每行的结尾多一个^M，所以在执行的时候出现了这种现象</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\r$//&#39;</span>  ca.sh
<span class="token comment"># 执行脚本 会自动生成证书 存储在脚本设置的目录下 如下图</span>
./ca.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.脚本内容</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/sh  </span>
<span class="token comment"># 需要的配置设置</span>
<span class="token assign-left variable">ip</span><span class="token operator">=</span><span class="token number">175.178</span>.126.61  <span class="token comment"># 你的IP</span>
<span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token number">1120</span>  <span class="token comment">#你的密码</span>
<span class="token assign-left variable">dir</span><span class="token operator">=</span>/DockerCa/CaFile  <span class="token comment"># 证书生成位置</span>
<span class="token assign-left variable">validity_period</span><span class="token operator">=</span><span class="token number">10</span>  <span class="token comment"># 证书有效期10年</span>

<span class="token comment"># 将此shell脚本在安装docker的机器上执行，作用是生成docker远程连接加密证书</span>
<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;<span class="token variable">$dir</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$dir</span> , not dir , will create&quot;</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span>
  <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$dir</span>
<span class="token keyword">else</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$dir</span> , dir exist , will delete and create&quot;</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span>
  <span class="token function">rm</span> <span class="token parameter variable">-rf</span> <span class="token variable">$dir</span>
  <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$dir</span>
<span class="token keyword">fi</span>

<span class="token builtin class-name">cd</span> <span class="token variable">$dir</span> <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
<span class="token comment"># 创建根证书RSA私钥</span>
openssl genrsa <span class="token parameter variable">-aes256</span> <span class="token parameter variable">-passout</span> pass:<span class="token string">&quot;<span class="token variable">$password</span>&quot;</span> <span class="token parameter variable">-out</span> ca-key.pem <span class="token number">4096</span>
<span class="token comment"># 创建CA证书</span>
openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-x509</span> <span class="token parameter variable">-days</span> <span class="token variable">$validity_period</span> <span class="token parameter variable">-key</span> ca-key.pem <span class="token parameter variable">-passin</span> pass:<span class="token string">&quot;<span class="token variable">$password</span>&quot;</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-out</span> ca.pem <span class="token parameter variable">-subj</span> <span class="token string">&quot;/C=NL/ST=./L=./O=./CN=<span class="token variable">$ip</span>&quot;</span>
<span class="token comment"># 创建服务端私钥</span>
openssl genrsa <span class="token parameter variable">-out</span> server-key.pem <span class="token number">4096</span>
<span class="token comment"># 创建服务端签名请求证书文件</span>
openssl req <span class="token parameter variable">-subj</span> <span class="token string">&quot;/CN=<span class="token variable">$ip</span>&quot;</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> server-key.pem <span class="token parameter variable">-out</span> server.csr

<span class="token builtin class-name">echo</span> subjectAltName <span class="token operator">=</span> IP:<span class="token variable">$ip</span>,IP:0.0.0.0 <span class="token operator">&gt;&gt;</span>extfile.cnf

<span class="token builtin class-name">echo</span> extendedKeyUsage <span class="token operator">=</span> serverAuth <span class="token operator">&gt;&gt;</span>extfile.cnf
<span class="token comment"># 创建签名生效的服务端证书文件</span>
openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token variable">$validity_period</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-in</span> server.csr <span class="token parameter variable">-CA</span> ca.pem <span class="token parameter variable">-CAkey</span> ca-key.pem <span class="token parameter variable">-passin</span> <span class="token string">&quot;pass:<span class="token variable">$password</span>&quot;</span> <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> server-cert.pem <span class="token parameter variable">-extfile</span> extfile.cnf
<span class="token comment"># 创建客户端私钥</span>
openssl genrsa <span class="token parameter variable">-out</span> key.pem <span class="token number">4096</span>
<span class="token comment"># 创建客户端签名请求证书文件</span>
openssl req <span class="token parameter variable">-subj</span> <span class="token string">&#39;/CN=client&#39;</span> <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> key.pem <span class="token parameter variable">-out</span> client.csr

<span class="token builtin class-name">echo</span> extendedKeyUsage <span class="token operator">=</span> clientAuth <span class="token operator">&gt;&gt;</span>extfile.cnf

<span class="token builtin class-name">echo</span> extendedKeyUsage <span class="token operator">=</span> clientAuth <span class="token operator">&gt;</span>extfile-client.cnf
<span class="token comment"># 创建签名生效的客户端证书文件</span>
openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token variable">$validity_period</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-in</span> client.csr <span class="token parameter variable">-CA</span> ca.pem <span class="token parameter variable">-CAkey</span> ca-key.pem <span class="token parameter variable">-passin</span> <span class="token string">&quot;pass:<span class="token variable">$password</span>&quot;</span> <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> cert.pem <span class="token parameter variable">-extfile</span> extfile-client.cnf
<span class="token comment"># 删除多余文件</span>
<span class="token function">rm</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-v</span> client.csr server.csr extfile.cnf extfile-client.cnf

<span class="token function">chmod</span> <span class="token parameter variable">-v</span> 0400 ca-key.pem key.pem server-key.pem
<span class="token function">chmod</span> <span class="token parameter variable">-v</span> 0444 ca.pem server-cert.pem cert.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230614085518129.png" alt="image-20230614085518129"></p><h3 id="配置-docker-设置-1" tabindex="-1"><a class="header-anchor" href="#配置-docker-设置-1" aria-hidden="true">#</a> 配置 Docker 设置</h3><p>1.修改Docker配置文件</p><ul><li>配置文件 vim /usr/lib/systemd/system/docker.service</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">Type</span><span class="token operator">=</span>notify
<span class="token comment"># the default is not to use systemd for cgroups because the delegate issues still</span>
<span class="token comment"># exists and systemd currently does not support the cgroup feature set required</span>
<span class="token comment"># for containers run by docker</span>

<span class="token comment"># 默认设置</span>
<span class="token comment"># ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock</span>

<span class="token comment"># 指定证书: 注意证书的目录位置 -H | 特别注意该段不能换行只能一行</span>
<span class="token comment"># tcp://0.0.0.0:1010: 设置的远程端口为1010 注意开放其端口 </span>
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/bin/dockerd <span class="token parameter variable">--tlsverify</span> <span class="token parameter variable">--tlscacert</span><span class="token operator">=</span>/DockerCa/CaFile/ca.pem <span class="token parameter variable">--tlscert</span><span class="token operator">=</span>/DockerCa/CaFile/server-cert.pem <span class="token parameter variable">--tlskey</span><span class="token operator">=</span>/DockerCa/CaFile/server-key.pem <span class="token parameter variable">-H</span> fd:// <span class="token parameter variable">--containerd</span><span class="token operator">=</span>/run/containerd/containerd.sock <span class="token parameter variable">-H</span> tcp://0.0.0.0:1010
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.刷新配置 重启Docker</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 重新加载配置文件，并重启docker守护进程</span>
systemctl daemon-reload <span class="token operator">&amp;&amp;</span> systemctl restart <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>3.测试连接方法</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 服务器本机测试(先CD进入证书文件夹)：</span>
<span class="token function">docker</span> <span class="token parameter variable">--tlsverify</span> <span class="token parameter variable">--tlscacert</span><span class="token operator">=</span>ca.pem <span class="token parameter variable">--tlscert</span><span class="token operator">=</span>cert.pem <span class="token parameter variable">--tlskey</span><span class="token operator">=</span>key.pem <span class="token parameter variable">-H</span> tcp://你的ip:2376 <span class="token parameter variable">-v</span>
<span class="token comment"># 个人终端测试：</span>
<span class="token function">curl</span> https://你的ip:1010/info <span class="token parameter variable">--cert</span> /root/docker/cert/cert.pem <span class="token parameter variable">--key</span> /root/docker/cert/key.pem <span class="token parameter variable">--cacert</span> /root/docker/cert/ca.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置-idea-连接-1" tabindex="-1"><a class="header-anchor" href="#设置-idea-连接-1" aria-hidden="true">#</a> 设置 IDEA 连接</h3><p>1.下载证书文件</p><ul><li>下载证书文件到win本机文件夹下 后续连接使用</li></ul><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230614090548535.png" alt="image-20230614090548535"></p><p>2.IDEA 连接</p><ul><li>在IDEA服务下进行配置Docker连接设置</li><li>TCP连接: 服务器的IP地址和Docker远程连接端口 + 证书的目录地址</li></ul><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230614090916302.png" alt="image-20230614090916302"></p><h2 id="docker-问题补充" tabindex="-1"><a class="header-anchor" href="#docker-问题补充" aria-hidden="true">#</a> Docker 问题补充</h2><h3 id="使用docker命令报错" tabindex="-1"><a class="header-anchor" href="#使用docker命令报错" aria-hidden="true">#</a> 使用Docker命令报错</h3>`,23),h={href:"https://blog.csdn.net/weixin_38641128/article/details/127939990",target:"_blank",rel:"noopener noreferrer"},f=t(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 停止 Docker</span>
systemctl stop <span class="token function">docker</span>
systemctl stop docker.socket
<span class="token comment"># 启动 Docker</span>
systemctl start <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="idea-dockerfile-部署" tabindex="-1"><a class="header-anchor" href="#idea-dockerfile-部署" aria-hidden="true">#</a> IDEA Dockerfile 部署</h2><blockquote><p><strong>已经远程连接好了服务器的Docker服务</strong></p></blockquote><h3 id="项目配置docker插件" tabindex="-1"><a class="header-anchor" href="#项目配置docker插件" aria-hidden="true">#</a> 项目配置Docker插件</h3><ul><li><strong>Pom.xml 的 plugin 插件</strong></li></ul><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--使用docker-maven-plugin插件 可根据Dockerfile进行远程一键部署--&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.spotify<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>docker-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>0.4.13<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
                <span class="token comment">&lt;!-- made of &#39;[a-z0-9-_.]&#39; --&gt;</span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>imageName</span><span class="token punctuation">&gt;</span></span>\${project.artifactId}:\${project.version}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>imageName</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dockerDirectory</span><span class="token punctuation">&gt;</span></span>\${project.basedir}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dockerDirectory</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resources</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resource</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>targetPath</span><span class="token punctuation">&gt;</span></span>/<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>targetPath</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>directory</span><span class="token punctuation">&gt;</span></span>\${project.build.directory}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>directory</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>include</span><span class="token punctuation">&gt;</span></span>\${project.build.finalName}.jar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>include</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resource</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resources</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dockerfile-脚本" tabindex="-1"><a class="header-anchor" href="#dockerfile-脚本" aria-hidden="true">#</a> Dockerfile 脚本</h3><ul><li>需跟 pom.xml 文件同级 [否则修改脚本jar目录-不建议]</li><li>在运行前注意: <strong>进行打包保障target内有jar包 以及 修改 jar包匹配符</strong></li></ul><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># 指定基础镜像，在其上进行定制 (FROM java:8 弃用)</span>
<span class="token instruction"><span class="token keyword">FROM</span> openjdk:8-jre-slim</span>
<span class="token comment"># 维护者信息</span>
<span class="token instruction"><span class="token keyword">MAINTAINER</span> Your Name &lt;2386297795@QQ.com&gt;</span>
<span class="token comment"># 设置环境变量</span>
<span class="token instruction"><span class="token keyword">ENV</span> PARAMS=<span class="token string">&quot;&quot;</span></span>
<span class="token instruction"><span class="token keyword">ENV</span> TZ=PRC</span>
<span class="token comment"># 设置时区</span>
<span class="token instruction"><span class="token keyword">RUN</span> ln -snf /usr/share/zoneinfo/<span class="token variable">$TZ</span> /etc/localtime &amp;&amp; echo <span class="token variable">$TZ</span> &gt; /etc/timezone</span>
<span class="token comment"># 设置时区</span>
<span class="token instruction"><span class="token keyword">ADD</span> target/wxgzhapp-*.jar /app.jar</span>
<span class="token comment"># 声明运行时容器提供服务端口，这只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 1060</span>
<span class="token comment"># 指定容器启动程序及参数 ENTRYPOINT [&quot;cmd命令&quot;]</span>
<span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">&quot;java&quot;</span>,<span class="token string">&quot;-jar&quot;</span>,<span class="token string">&quot;/app.jar&quot;</span>, <span class="token string">&quot;--server.port=9001&quot;</span>]</span>

<span class="token comment"># 备用: CMD java -jar $JAVA_OPTS /app.jar --server.port=$SERVER_PORT $PARAMS</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-docker-容器端口" tabindex="-1"><a class="header-anchor" href="#配置-docker-容器端口" aria-hidden="true">#</a> 配置 Docker 容器端口</h3><ul><li>项目的jar包重新命名为app.jar 在容器的根目录下</li><li><strong>默认生成的容器没有跟主服务器 映射端口 需手动添加</strong></li><li>访问: http://175.178.126.61:1060/china/getChinaListTree</li></ul><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230616141425875.png" alt=""></p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230614162420037.png" alt="image-20230614162420037"></p><h2 id="nginx-dockerfile-部署" tabindex="-1"><a class="header-anchor" href="#nginx-dockerfile-部署" aria-hidden="true">#</a> Nginx Dockerfile 部署</h2><h3 id="nginx-脚本" tabindex="-1"><a class="header-anchor" href="#nginx-脚本" aria-hidden="true">#</a> Nginx 脚本</h3><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># 基础镜像</span>
<span class="token instruction"><span class="token keyword">FROM</span> nginx</span>

<span class="token comment"># 维护者信息</span>
<span class="token instruction"><span class="token keyword">MAINTAINER</span> Apai-Lu</span>

<span class="token comment"># 设置时区</span>
<span class="token instruction"><span class="token keyword">RUN</span> ln -snf /usr/share/zoneinfo/<span class="token variable">$TZ</span> /etc/localtime &amp;&amp; echo <span class="token variable">$TZ</span> &gt; /etc/timezone</span>

<span class="token comment"># 暴露端口 1050:80 访问地址为:http://localhost:1050 (这只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务)</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 1050</span>

<span class="token comment"># 复制conf文件到路径 替换 nginx.conf 文件配置</span>
<span class="token instruction"><span class="token keyword">COPY</span> ./conf/nginx.conf /etc/nginx/nginx.conf</span>
<span class="token comment"># 复制html文件到路径 根据配置文件配置的路径将以后的请求转发到这个路径下</span>
<span class="token instruction"><span class="token keyword">COPY</span> ./html/dist /home/apai-web</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-说明" tabindex="-1"><a class="header-anchor" href="#nginx-说明" aria-hidden="true">#</a> Nginx 说明</h3><blockquote><p>目录结构</p></blockquote><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>nginx
	conf
		nginx<span class="token punctuation">.</span>conf <span class="token comment">// nginx 的配置文件, 修改后会覆盖镜像原有的</span>
	html
		dist <span class="token comment">// 前端打包文件, 会根据dockerfile复制到容器里</span>
dockerfile <span class="token comment">// 执行会根据命令创建容器</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>nginx.conf 配置文件</p></blockquote><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code>worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        <span class="token comment"># 访问端口</span>
        listen       80;
        server_name  localhost;

        location / {
    		<span class="token comment"># 指定前端打包文件路径 根据dockerfile的配置</span>
            root   /home/apai-web;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230630093241935.png" alt="image-20230630093241935"></p><h2 id="compose-服务编排" tabindex="-1"><a class="header-anchor" href="#compose-服务编排" aria-hidden="true">#</a> Compose 服务编排</h2>`,23),y={href:"https://blog.csdn.net/menxu_work/article/details/125738386",target:"_blank",rel:"noopener noreferrer"},x={href:"https://blog.csdn.net/WuDan_1112/article/details/125878728",target:"_blank",rel:"noopener noreferrer"},q=t(`<h3 id="compose-概述" tabindex="-1"><a class="header-anchor" href="#compose-概述" aria-hidden="true">#</a> Compose 概述</h3><ul><li>Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排</li><li>docker-compose是基于docker的编排工具，使容器的操作能够批量的，可视的执行，是一个管理多个容器的工具</li></ul><p><strong>Compose有2个重要的概念：</strong></p><ul><li>项目（Project）：由一组关联的应用容器组成的一个完整业务单元，在 docker-compose.yml 文件中定义。</li><li>服务（Service）：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。</li></ul><p><strong>使用Compose 基本上分为三步：</strong></p><ol><li><p>Dockerfile 定义应用的运行环境</p></li><li><p>docker-compose.yml 定义组成应用的各服务</p></li><li><p>docker-compose up 启动整个应用</p></li></ol><h3 id="compose-微服务编排" tabindex="-1"><a class="header-anchor" href="#compose-微服务编排" aria-hidden="true">#</a> Compose 微服务编排</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">services</span><span class="token punctuation">:</span>

  <span class="token comment"># Docker-Compose.yml 构建 MySQL 服务</span>
  <span class="token key atrule">Apai-MySql</span><span class="token punctuation">:</span>
    <span class="token comment"># MySql 的容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> Apai<span class="token punctuation">-</span>MySql<span class="token punctuation">-</span><span class="token number">8.0</span>
    <span class="token comment"># MySql 的镜像版本</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span>8.0.25
    <span class="token comment"># MySql 的构建上下文</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./mysql
    <span class="token comment"># MySql 的端口映射 主机:容器</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;1051:3306&quot;</span>
    <span class="token comment"># MySql 的数据卷映射 主机:容器</span>
    <span class="token comment"># volumes:</span>
    <span class="token comment">#   - ./mysql/conf:/etc/mysql/conf.d</span>
    <span class="token comment">#   - ./mysql/logs:/logs</span>
    <span class="token comment">#   - ./mysql/data:/var/lib/mysql</span>
    <span class="token comment"># MySql 的环境变量</span>
    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>
      <span class="token string">&#39;mysqld&#39;</span><span class="token punctuation">,</span>
      <span class="token string">&#39;--innodb-buffer-pool-size=80M&#39;</span><span class="token punctuation">,</span>
      <span class="token string">&#39;--character-set-server=utf8mb4&#39;</span><span class="token punctuation">,</span>
      <span class="token string">&#39;--collation-server=utf8mb4_unicode_ci&#39;</span><span class="token punctuation">,</span>
      <span class="token string">&#39;--default-time-zone=+8:00&#39;</span><span class="token punctuation">,</span>
      <span class="token string">&#39;--lower-case-table-names=1&#39;</span>
    <span class="token punctuation">]</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token comment"># MySql 的需要创建数据库名称</span>
      <span class="token key atrule">MYSQL_DATABASE</span><span class="token punctuation">:</span> <span class="token string">&#39;apai-cloud&#39;</span>
      <span class="token comment"># MySql 的默认账号密码</span>
      <span class="token key atrule">MYSQL_ROOT_PASSWORD</span><span class="token punctuation">:</span> root

  <span class="token comment"># Docker-Compose.yml 构建 Nacos 服务: http://175.178.126.61:1052/nacos [账号密码: nacos/nacos]</span>
  <span class="token key atrule">Apai-Nacos</span><span class="token punctuation">:</span>
    <span class="token comment"># Nacos 的容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> Apai<span class="token punctuation">-</span>Nacos<span class="token punctuation">-</span>1.4.1
    <span class="token comment"># Nacos 的镜像版本</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nacos/nacos<span class="token punctuation">-</span>server<span class="token punctuation">:</span>1.4.1
    <span class="token comment"># Nacos 的构建上下文</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./nacos
    <span class="token comment"># Nacos 的环境变量</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MODE=standalone
    <span class="token comment"># Nacos 的数据卷映射 主机:容器</span>
    <span class="token comment"># volumes:</span>
    <span class="token comment">#   - ./nacos/logs/:/home/nacos/logs</span>
    <span class="token comment">#   - ./nacos/conf/application.properties:/home/nacos/conf/application.properties</span>
    <span class="token comment"># Nacos 的端口映射 主机:容器</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;1052:8848&quot;</span>

  <span class="token comment"># Docker-Compose.yml 构建 Redis 服务</span>
  <span class="token key atrule">Apai-Redis</span><span class="token punctuation">:</span>
    <span class="token comment"># Redis 的容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> Apai<span class="token punctuation">-</span>Redis<span class="token punctuation">-</span><span class="token number">5.0</span>
    <span class="token comment"># Redis 的镜像版本</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span><span class="token number">5.0</span>
    <span class="token comment"># Redis 的构建上下文</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./redis
    <span class="token comment"># Redis 的端口映射 主机:容器</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;1053:6379&quot;</span>
    <span class="token comment"># Redis 的数据卷映射 主机:容器</span>
    <span class="token comment"># volumes:</span>
    <span class="token comment">#   - ./redis/conf/redis.conf:/home/ruoyi/redis/redis.conf</span>
    <span class="token comment">#   - ./redis/data:/data</span>
    <span class="token comment"># command: redis-server /home/ruoyi/redis/redis.conf</span>

  <span class="token comment"># Docker-Compose.yml 构建 Nginx 服务：http://175.178.126.61:1054/</span>
  <span class="token key atrule">Apai-Nginx</span><span class="token punctuation">:</span>
    <span class="token comment"># Nginx 的容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> Apai<span class="token punctuation">-</span>Nginx
    <span class="token comment"># Nginx 的镜像版本</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
    <span class="token comment"># Nginx 的构建上下文</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./nginx
    <span class="token comment"># Nginx 的端口映射 主机:容器</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;1054:80&quot;</span>
    <span class="token comment"># Nginx 的数据卷映射 主机:容器</span>
    <span class="token comment"># volumes:</span>
    <span class="token comment">#   - ./nginx/html/dist:/home/ruoyi/projects/ruoyi-ui</span>
    <span class="token comment">#   - ./nginx/conf/nginx.conf:/etc/nginx/nginx.conf</span>
    <span class="token comment">#   - ./nginx/logs:/var/log/nginx</span>
    <span class="token comment">#   - ./nginx/conf.d:/etc/nginx/conf.d</span>

  <span class="token comment"># Docker-Compose.yml 构建 Rabbitmq 服务: http://175.178.126.61:1056/#/</span>
  <span class="token key atrule">Apai-Rabbitmq</span><span class="token punctuation">:</span>
    <span class="token comment"># Rabbitmq 的容器名称</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> Apai<span class="token punctuation">-</span>Rabbitmq<span class="token punctuation">-</span>3.7.25
    <span class="token comment"># Rabbitmq 的镜像版本</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> rabbitmq<span class="token punctuation">:</span>3.7.25<span class="token punctuation">-</span>management
    <span class="token comment"># volumes:</span>
    <span class="token comment">#   - /mydata/rabbitmq/data:/var/lib/rabbitmq #数据文件挂载</span>
    <span class="token comment">#   - /mydata/rabbitmq/log:/var/log/rabbitmq #日志文件挂载</span>
    <span class="token comment"># 端口映射 主机:容器</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 1055<span class="token punctuation">:</span><span class="token number">5672</span>
      <span class="token punctuation">-</span> 1056<span class="token punctuation">:</span><span class="token number">15672</span>
    <span class="token comment"># 环境变量 user:pass -&gt; 账号:密码</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">RABBITMQ_DEFAULT_VHOST</span><span class="token punctuation">:</span> <span class="token string">&#39;/&#39;</span>
      <span class="token key atrule">RABBITMQ_DEFAULT_USER</span><span class="token punctuation">:</span> admin
      <span class="token key atrule">RABBITMQ_DEFAULT_PASS</span><span class="token punctuation">:</span> admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function _(A,D){const a=c("ExternalLinkIcon");return l(),p("div",null,[r,n("ul",null,[d,n("li",null,[n("a",u,[s("Docker 远程访问参考"),e(a)])])]),m,n("ul",null,[v,n("li",null,[n("a",k,[s("Docker 远程证书访问"),e(a)]),s(),n("a",b,[s("执行脚本格式报错参考"),e(a)])])]),g,n("ul",null,[n("li",null,[n("a",h,[s("参考一"),e(a)])])]),f,n("blockquote",null,[n("p",null,[n("a",y,[s("Compose 服务编排参考"),e(a)]),s(),n("a",x,[s("基础参考"),e(a)])])]),q])}const C=i(o,[["render",_],["__file","DockerCompose.html.vue"]]);export{C as default};
