import{_ as l,p as t,q as i,s,R as n,t as e,Y as o,n as p}from"./framework-e1bed10d.js";const c={},r=s("h2",{id:"mysql-主从复制",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#mysql-主从复制","aria-hidden":"true"},"#"),n(" MySql 主从复制")],-1),d={href:"https://blog.csdn.net/qq_46079815/article/details/127312040",target:"_blank",rel:"noopener noreferrer"},m={href:"https://blog.csdn.net/weixin_38530591/article/details/128719035",target:"_blank",rel:"noopener noreferrer"},u=s("h3",{id:"基础原理",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#基础原理","aria-hidden":"true"},"#"),n(" 基础原理")],-1),v={href:"https://so.csdn.net/so/search?q=%E4%BA%8C%E8%BF%9B%E5%88%B6&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},k=o(`<h3 id="复制三步" tabindex="-1"><a class="header-anchor" href="#复制三步" aria-hidden="true">#</a> 复制三步</h3><ul><li>Master 主库在事务提交时，会把数据变更作为时间 Events 记录在二进制日志文件 Binlog中。</li><li>主库推送二进制日志文件 Binlog 中的日志事件到从库的中继日志 Relay Log 。</li><li>slave重做中继日志中的事件，将改变反映它自己的数据。</li></ul><h3 id="复制的优点" tabindex="-1"><a class="header-anchor" href="#复制的优点" aria-hidden="true">#</a> 复制的优点</h3><ul><li>主库出现问题，可以快速切换到从库提供服务。</li><li>可以在从库上执行查询操作，从主库中更新，实现读写分离，降低主库的访问压力。</li><li>可以在从库中执行备份，以避免备份期间影响主库的服务。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token number">1</span>）实时灾备
<span class="token number">2</span>）读写分离
<span class="token number">3</span>）高可用
<span class="token number">4</span>）从库数据统计
<span class="token number">5</span>）从库数据备份
<span class="token number">6</span>）平滑升级
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常见的几种架构" tabindex="-1"><a class="header-anchor" href="#常见的几种架构" aria-hidden="true">#</a> 常见的几种架构</h3><p>1）单向主从模式：Master ——&gt; Slave</p><p>2）双向主从模式：Master &lt;====&gt; Master</p><p>3）级联主从模式：Master ——&gt; Slave1 ——&gt; Slave2</p><p>4）一主多从模式</p><p>5）多主一从模式</p><h2 id="主从复制原理" tabindex="-1"><a class="header-anchor" href="#主从复制原理" aria-hidden="true">#</a> 主从复制原理</h2><h3 id="_1-异步复制" tabindex="-1"><a class="header-anchor" href="#_1-异步复制" aria-hidden="true">#</a> 1.异步复制</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 主从复制是异步复制过程</span>
<span class="token number">1.</span> master开启bin<span class="token operator">-</span>log功能，日志文件用于记录数据库的读写增删
<span class="token number">2.</span> 需要开启<span class="token number">3</span>个线程，master <span class="token constant">IO</span>线程，slave开启 <span class="token constant">IO</span>线程 <span class="token constant">SQL</span>线程，
<span class="token number">3.</span> <span class="token class-name">Slave</span> 通过<span class="token constant">IO</span>线程连接master，并且请求某个bin<span class="token operator">-</span>log，position之后的内容。
<span class="token number">4.</span> <span class="token constant">MASTER</span>服务器收到slave <span class="token constant">IO</span>线程发来的日志请求信息，io线程去将bin<span class="token operator">-</span>log内容，position返回给slave <span class="token constant">IO</span>线程。
<span class="token number">5.</span> slave服务器收到bin<span class="token operator">-</span>log日志内容，将bin<span class="token operator">-</span>log日志内容写入relay<span class="token operator">-</span>log中继日志，创建一个master<span class="token punctuation">.</span>info的文件，该文件记录了master ip 用户名 密码 master bin<span class="token operator">-</span>log名称，bin<span class="token operator">-</span>log position。
<span class="token number">6.</span> slave端开启<span class="token constant">SQL</span>线程，实时监控relay<span class="token operator">-</span>log日志内容是否有更新，解析文件中的<span class="token constant">SQL</span>语句，在slave数据库中去执行。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-半同步复制" tabindex="-1"><a class="header-anchor" href="#_2-半同步复制" aria-hidden="true">#</a> 2.半同步复制</h3><blockquote><p>MySQL默认的复制方式是异步复制，但是当主库宕机，在高可用架构坐准备切换，就会造成新的主库丢失数据的现象。</p></blockquote><p>MySQL5.5版本之后引入了半同步复制，但是主从服务器必须同时安装半同步复制插件。在该功能下，确保从库接收完成主库传递过来的binlog内容已经写入到自己的relay log后才会通知主库上面的等待线程。如果等待超时(超时参数：rpl_semi_sync_master_timeout)，则关闭半同步复制，并自动转换为异步复制模式，直到至少有一台从库通知主库已经接收到binlog信息为止。</p><p>半同步复制时，为了保证主库上的每一个Binlog事务都能够被可靠的复制到从库上，主库在每次事务成功提交时，并不及时反馈给前端应用用户，而是等待其中的一个从库也接收到Binlog事务并成功写入中继日志后，出库才返回commit操作成功给客户端。半同步复制保证了事务成功提交后，至少有两份日志记录，一份在主库的Binlog日志上，另一份在至少一个从库的中继日志Relay log上，从而更近一步保证了数据的完整性。</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/59cca8c76d9e4fccb431d7dc794e53dc.png" alt="img"></p><p>在这个半同步复制模式下：第1、2、3中任何一个步骤中主库宕机，则事务并没有提交成功。从库也没有得到日志，此时的主从复制数据是一致的。</p><p>半同步复制提升了主从之间数据的一致性，让复制更加安全可靠，在5.7 版本中又增加了rpl_semi_sync_master_wait_point参数，用来控制半同步模式下主库返回给session事务成功之前的事务提交方式。</p><h3 id="_3-gtid复制-了解" tabindex="-1"><a class="header-anchor" href="#_3-gtid复制-了解" aria-hidden="true">#</a> 3.GTID复制（了解）</h3><blockquote><p>GTID又叫全局事务ID，是一个以提交事务的编号，并且是一个全局唯一的编号。GTID是由server_uuid和事务id组成的，即GTID=server_uuid:transaction_id。</p></blockquote><p>server_uuid是数据库启动自动生成的，保存在auto.cnf文件下，transaction_id是事务提交时由系统顺序分配的一个不会重复的序列行。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// GTID存在的价值：</span>
　　<span class="token number">1</span>）<span class="token constant">GTID</span>使用master_auto_position<span class="token operator">=</span><span class="token number">1</span>代替了基于binlog和position号的主从复制方式，更便于主从复制的搭建。
　　<span class="token number">2</span>）<span class="token constant">GTID</span>可以知道事务在最开始是哪个实例上提交的。
　　<span class="token number">3</span>）<span class="token constant">GTID</span>方便实现主从之间的failover，无须找position和binlog。
<span class="token comment">// GTID限制条件：</span>
　　<span class="token number">1</span>）不能使用create table table_name select <span class="token operator">*</span> from table_name。
　　<span class="token number">2</span>）不支持<span class="token constant">CREATE</span> <span class="token constant">TEMPORARY</span> <span class="token constant">TABLE</span> or <span class="token constant">DROP</span> <span class="token constant">TEMPORARY</span> <span class="token constant">TABLE</span>语句操作。
　　<span class="token number">3</span>）不支持sql_slave_skip_counter。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mysql-单向主从模式" tabindex="-1"><a class="header-anchor" href="#mysql-单向主从模式" aria-hidden="true">#</a> MySql 单向主从模式</h2><p>MySQL支持一台主库同时向多台从库进行复制， 从库同时也可以作为其他从服务器的主库，实现链状复制</p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230713162155022.png" alt="image-20230713162155022" style="zoom:67%;"><blockquote><p>默认的 my.cnf 备份</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.</span>
<span class="token comment">#</span>
<span class="token comment"># This program is free software; you can redistribute it and/or modify</span>
<span class="token comment"># it under the terms of the GNU General Public License as published by</span>
<span class="token comment"># the Free Software Foundation; version 2 of the License.</span>
<span class="token comment">#</span>
<span class="token comment"># This program is distributed in the hope that it will be useful,</span>
<span class="token comment"># but WITHOUT ANY WARRANTY; without even the implied warranty of</span>
<span class="token comment"># MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the</span>
<span class="token comment"># GNU General Public License for more details.</span>
<span class="token comment">#</span>
<span class="token comment"># You should have received a copy of the GNU General Public License</span>
<span class="token comment"># along with this program; if not, write to the Free Software</span>
<span class="token comment"># Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA</span>

<span class="token comment">#</span>
<span class="token comment"># The MySQL  Server configuration file.</span>
<span class="token comment">#</span>
<span class="token comment"># For explanations see</span>
<span class="token comment"># http://dev.mysql.com/doc/mysql/en/server-system-variables.html</span>

<span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
pid-file        <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
socket          <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
datadir         <span class="token operator">=</span> /var/lib/mysql
secure-file-priv<span class="token operator">=</span> NULL

<span class="token comment"># Custom config should go here</span>
<span class="token operator">!</span>includedir /etc/mysql/conf.d/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-数据库准备" tabindex="-1"><a class="header-anchor" href="#_1-数据库准备" aria-hidden="true">#</a> 1.数据库准备</h3><blockquote><p>在主数据库数据产生变化时, 从数据库会去拉取主数据库的数据进行同步复制</p></blockquote><p>主数据库: 175.178.126.61:1001</p><p>从数据库: 175.178.126.61:1051</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230713155302871.png" alt="image-20230713155302871"></p><h3 id="_2-主数据库-my-cnf-配置" tabindex="-1"><a class="header-anchor" href="#_2-主数据库-my-cnf-配置" aria-hidden="true">#</a> 2.主数据库 my.cnf 配置</h3><ul><li>后期出现问题可根据上面备份的my.cnf 进行恢复</li><li>Docker 的mysql配置文件位置在: /etc/mysql/my.cnf</li></ul><p><strong>2.1 增加my.cnf 的配置</strong></p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token key attr-name">log-bin</span><span class="token punctuation">=</span><span class="token value attr-value">mysql-bin   #[必须]启用二进制日志</span>
<span class="token key attr-name">server-id</span><span class="token punctuation">=</span><span class="token value attr-value">1025       #[必须]服务器唯一ID(唯一即可)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">pid-file</span>        <span class="token punctuation">=</span> <span class="token value attr-value">/var/run/mysqld/mysqld.pid</span>
<span class="token key attr-name">socket</span>          <span class="token punctuation">=</span> <span class="token value attr-value">/var/run/mysqld/mysqld.sock</span>
<span class="token key attr-name">datadir</span>         <span class="token punctuation">=</span> <span class="token value attr-value">/var/lib/mysql</span>
<span class="token key attr-name">secure-file-priv</span><span class="token punctuation">=</span> <span class="token value attr-value">NULL</span>
<span class="token key attr-name">log-bin</span><span class="token punctuation">=</span><span class="token value attr-value">mysql-bin   #[必须]启用二进制日志</span>
<span class="token key attr-name">server-id</span><span class="token punctuation">=</span><span class="token value attr-value">1025       #[必须]服务器唯一ID(唯一即可)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.2 重启Mysql服务</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 执行指令 / 或者重启Docker </span>
systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.3 设置复制主权限用户及获取配置信息 (后续从机需要这些配置)</strong></p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 上面SQL的作用是创建一个用户 apaipai，密码为 apaipai </span>
<span class="token comment">-- 并且给 apaipai 用户授予REPLICATION SLAVE权限</span>
<span class="token comment">-- 常用于建立复制时所需要用到的用户权限，也就是slave必须被master授权具有该权限的用户，才能通过该用户复制</span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">CREATE</span> <span class="token keyword">USER</span> <span class="token string">&#39;apaipai&#39;</span><span class="token variable">@&#39;%&#39;</span> IDENTIFIED <span class="token keyword">WITH</span> mysql_native_password <span class="token keyword">BY</span> <span class="token string">&#39;apaipai&#39;</span><span class="token punctuation">;</span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">GRANT</span> <span class="token keyword">REPLICATION</span> SLAVE <span class="token keyword">ON</span> <span class="token operator">*</span><span class="token punctuation">.</span><span class="token operator">*</span> <span class="token keyword">TO</span> <span class="token string">&#39;apaipai&#39;</span><span class="token variable">@&#39;%&#39;</span><span class="token punctuation">;</span>

<span class="token comment">-- 记录下结果中File(mysql-bin.000001)和Position(657)的值 </span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">show</span> master <span class="token keyword">status</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230714101610551.png" alt="image-20230714101610551"></p><h3 id="_3-从数据库-my-cnf-配置" tabindex="-1"><a class="header-anchor" href="#_3-从数据库-my-cnf-配置" aria-hidden="true">#</a> 3.从数据库 my.cnf 配置</h3><p><strong>3.1 增加my.cnf 的配置</strong></p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token key attr-name">server-id</span><span class="token punctuation">=</span><span class="token value attr-value">1026       #[必须]服务器唯一ID(唯一即可)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">pid-file</span>        <span class="token punctuation">=</span> <span class="token value attr-value">/var/run/mysqld/mysqld.pid</span>
<span class="token key attr-name">socket</span>          <span class="token punctuation">=</span> <span class="token value attr-value">/var/run/mysqld/mysqld.sock</span>
<span class="token key attr-name">datadir</span>         <span class="token punctuation">=</span> <span class="token value attr-value">/var/lib/mysql</span>
<span class="token key attr-name">secure-file-priv</span><span class="token punctuation">=</span> <span class="token value attr-value">NULL</span>

<span class="token key attr-name">server-id</span><span class="token punctuation">=</span><span class="token value attr-value">1026 	#[必须]服务器唯一ID</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.2 重启Mysql服务</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 执行指令 / 或者重启Docker </span>
systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.3 设置主库IP地址端口及同步位置</strong></p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 参数说明：</span>
<span class="token comment">--  master_host : 主库的IP地址</span>
<span class="token comment">--  master_port : 主库的端口</span>
<span class="token comment">--  master_user : 访问主库进行主从复制的用户名(上面在主库创建的)</span>
<span class="token comment">--  master_password : 访问主库进行主从复制的用户名对应的密码</span>
<span class="token comment">--  master_log_file : 从哪个日志文件开始同步(上述查询master状态中展示的有)</span>
<span class="token comment">--  master_log_pos : 从指定日志文件的哪个位置开始同步(上述查询master状态中展示的有)</span>
mysql<span class="token operator">&gt;</span> change master <span class="token keyword">to</span> master_host<span class="token operator">=</span><span class="token string">&#39;175.178.126.61&#39;</span><span class="token punctuation">,</span>master_port<span class="token operator">=</span><span class="token number">1001</span><span class="token punctuation">,</span>master_user<span class="token operator">=</span><span class="token string">&#39;luapai&#39;</span><span class="token punctuation">,</span>master_password<span class="token operator">=</span><span class="token string">&#39;luapai@123456&#39;</span><span class="token punctuation">,</span>master_log_file<span class="token operator">=</span><span class="token string">&#39;mysql-bin.000001&#39;</span><span class="token punctuation">,</span>master_log_pos<span class="token operator">=</span><span class="token number">655</span><span class="token punctuation">;</span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">start</span> slave<span class="token punctuation">;</span>

<span class="token comment">-- 查看从数据库的状态 (出现如下图YES表示成功)</span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">show</span> slave <span class="token keyword">status</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230713160717591.png" alt="image-20230713160717591"></p><p><strong>3.4 重新配置主库 (非必须执行)</strong></p><blockquote><p>在 MySQL 中修改从机的连接设置时，需要先停止正在运行的复制进程的IO线程</p></blockquote><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 报错: This operation cannot be performed with a running slave io thread; run STOP SLAVE IO_THREAD FOR CHANNEL &#39;&#39; first.</span>
<span class="token comment">-- 表示: 在 MySQL 中修改从机的连接设置时，需要先停止正在运行的复制进程的IO线程</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 1. 连接到从机的MySQL服务器，请使用命令行输入以下命令：</span>
mysql <span class="token operator">-</span>u your_username <span class="token operator">-</span>p
<span class="token comment">-- 2.在MySQL提示符下执行以下命令，停止复制进程的IO线程：</span>
STOP SLAVE IO_THREAD<span class="token punctuation">;</span>
<span class="token comment">-- 3.然后，您可以修改从机的连接设置。使用以下SQL语句，将 &lt;master_ip&gt;, &lt;master_port&gt;, &lt;master_user&gt; 和 &lt;master_password&gt; 替换为实际的值：</span>
CHANGE MASTER <span class="token keyword">TO</span> MASTER_HOST<span class="token operator">=</span><span class="token string">&#39;&lt;master_ip&gt;&#39;</span><span class="token punctuation">,</span> MASTER_PORT<span class="token operator">=</span><span class="token operator">&lt;</span>master_port<span class="token operator">&gt;</span><span class="token punctuation">,</span> MASTER_USER<span class="token operator">=</span><span class="token string">&#39;&lt;master_user&gt;&#39;</span><span class="token punctuation">,</span> MASTER_PASSWORD<span class="token operator">=</span><span class="token string">&#39;&lt;master_password&gt;&#39;</span><span class="token punctuation">;</span>
<span class="token comment">-- 4.修改完连接设置后，再次启动IO线程以恢复复制过程：</span>
<span class="token keyword">START</span> SLAVE IO_THREAD<span class="token punctuation">;</span>
<span class="token comment">-- 5.您可以通过检查从机的状态来验证更改是否生效：</span>
<span class="token keyword">SHOW</span> SLAVE <span class="token keyword">STATUS</span> \\G 

确保 <span class="token string">&quot;Slave_IO_Running&quot;</span> 状态为 <span class="token string">&quot;Yes&quot;</span>。
请注意，在复制过程运行时修改复制设置需要谨慎操作。在进行任何更改之前，请确保已备份数据。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-验证主从复制" tabindex="-1"><a class="header-anchor" href="#_4-验证主从复制" aria-hidden="true">#</a> 4.验证主从复制</h3><ul><li>主库一旦数据发生变化 从库则会拉取数据进行复制</li><li>数据的复制是从配置之后开始 之前的数据是不会被复制过去的</li><li>从库的数据发生变化 主库是不会去进行复制的 ( 手动对数据库进行数据修改会造成冲突停止复制 )</li><li>主从复制 --&gt; 读写分离 ( 主库写 / 从库读 )</li></ul><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230713161652538.png" alt="image-20230713161652538"></p><h2 id="mysql-双向主从模式" tabindex="-1"><a class="header-anchor" href="#mysql-双向主从模式" aria-hidden="true">#</a> MySql 双向主从模式</h2><blockquote><p>即: 数据库进行双向链接 任意数据库进行了更新 另一个数据库都进行同步更新</p></blockquote><h3 id="_1-数据库准备-1" tabindex="-1"><a class="header-anchor" href="#_1-数据库准备-1" aria-hidden="true">#</a> 1.数据库准备</h3><p><strong>主数据库: 175.178.126.61:1052</strong></p><p><strong>从数据库: 175.178.126.61:1053</strong></p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230714112842484.png" alt="image-20230714112842484"></p><h3 id="_2-数据库一-my-cnf-配置" tabindex="-1"><a class="header-anchor" href="#_2-数据库一-my-cnf-配置" aria-hidden="true">#</a> 2.数据库一 my.cnf 配置</h3><blockquote><p><strong>my.cnf 参数详解</strong></p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
pid-file        <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
socket          <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
datadir         <span class="token operator">=</span> /var/lib/mysql
secure-file-priv<span class="token operator">=</span> NULL

<span class="token comment"># 配置如下:</span>
<span class="token comment"># 设置服务器的唯一标识，用于在主从复制中标识不同的服务器。每个服务器必须有一个唯一的 ID。</span>
server-id <span class="token operator">=</span> <span class="token number">1</span>
<span class="token comment"># 启用二进制日志，将所有的 SQL 语句都记录到二进制日志文件 mysql-bin 中。这个配置是 MySQL 复制的基础。</span>
log-bin <span class="token operator">=</span> mysql-bin
<span class="token comment"># 是 MySQL 数据库的二进制日志格式</span>
binlog_format <span class="token operator">=</span> mixed
<span class="token comment"># 设置自增 ID 的起始值</span>
auto_increment_offset <span class="token operator">=</span> <span class="token number">1</span>
<span class="token comment"># 设置自增 ID 的步长 一个表的自增 ID 为 1，步长为 2，自增 ID 的值将会是 1、3、5、7…… 确保了在主从复制环境中插入记录时，不会发生 ID 冲突。</span>
auto_increment_increment <span class="token operator">=</span> <span class="token number">2</span>
<span class="token comment"># 将从库执行的 SQL 语句写入二进制日志，以便其他从库可以复制这些操作。这个配置在主从复制中非常重要，因为它确保了所有的从库都可以看到主库的更改，从而保证数据的一致性。如果一个服务器既做主库又做从库，那么这个选项必须要开启，否则从库将无法复制主库的更改。</span>
log-slave-updates <span class="token operator">=</span> <span class="token boolean">true</span>   
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>my.cnf 配置</strong></p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
pid-file        <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
socket          <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
datadir         <span class="token operator">=</span> /var/lib/mysql
secure-file-priv<span class="token operator">=</span> NULL

<span class="token comment"># 配置</span>
server-id <span class="token operator">=</span> <span class="token number">1</span>
log-bin <span class="token operator">=</span> mysql-bin
binlog_format <span class="token operator">=</span> mixed
auto_increment_offset <span class="token operator">=</span> <span class="token number">1</span>
auto_increment_increment <span class="token operator">=</span> <span class="token number">2</span>
log-slave-updates <span class="token operator">=</span> <span class="token boolean">true</span>

<span class="token comment"># Custom config should go here</span>
<span class="token operator">!</span>includedir /etc/mysql/conf.d/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>重启Mysql服务</strong></p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 执行指令 / 或者重启Docker </span>
systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据库二-my-cnf-配置" tabindex="-1"><a class="header-anchor" href="#_3-数据库二-my-cnf-配置" aria-hidden="true">#</a> 3.数据库二 my.cnf 配置</h3><blockquote><p><strong>my.cnf 配置</strong></p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
pid-file        <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
socket          <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
datadir         <span class="token operator">=</span> /var/lib/mysql
secure-file-priv<span class="token operator">=</span> NULL

<span class="token comment"># 配置</span>
server-id <span class="token operator">=</span> <span class="token number">2</span>
log-bin <span class="token operator">=</span> mysql-bin
binlog_format <span class="token operator">=</span> mixed
auto_increment_offset <span class="token operator">=</span> <span class="token number">2</span>
auto_increment_increment <span class="token operator">=</span> <span class="token number">2</span>
log-slave-updates <span class="token operator">=</span> <span class="token boolean">true</span>

<span class="token comment"># Custom config should go here</span>
<span class="token operator">!</span>includedir /etc/mysql/conf.d/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>重启Mysql服务</strong></p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 执行指令 / 或者重启Docker </span>
systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-配置进行双向链接" tabindex="-1"><a class="header-anchor" href="#_4-配置进行双向链接" aria-hidden="true">#</a> 4.配置进行双向链接</h3><blockquote><p><strong>数据库一: 执行</strong></p></blockquote><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 执行一: 创建下方数据提供给另一个数据库链接使用</span>
<span class="token comment">-- 上面SQL的作用是创建一个用户 apai1052，密码为 apai1052 </span>
<span class="token comment">-- 并且给 apai1052 用户授予REPLICATION SLAVE权限</span>
<span class="token comment">-- 常用于建立复制时所需要用到的用户权限，也就是slave必须被master授权具有该权限的用户，才能通过该用户复制</span>
<span class="token keyword">CREATE</span> <span class="token keyword">USER</span> <span class="token string">&#39;apai1052&#39;</span><span class="token variable">@&#39;%&#39;</span> IDENTIFIED <span class="token keyword">WITH</span> mysql_native_password <span class="token keyword">BY</span> <span class="token string">&#39;apai1052&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">GRANT</span> <span class="token keyword">REPLICATION</span> SLAVE <span class="token keyword">ON</span> <span class="token operator">*</span><span class="token punctuation">.</span><span class="token operator">*</span> <span class="token keyword">TO</span> <span class="token string">&#39;apai1052&#39;</span><span class="token variable">@&#39;%&#39;</span><span class="token punctuation">;</span>
<span class="token comment">-- 记录下结果中File(mysql-bin.000001)和Position(669)的值 </span>
<span class="token keyword">show</span> master <span class="token keyword">status</span><span class="token punctuation">;</span>

<span class="token comment">-- 执行二: 在另一个数据库执行一之后执行, 数据为另一个数据库的信息配置进行链接</span>
<span class="token comment">-- 参数说明：</span>
<span class="token comment">--  master_host : 主库的IP地址</span>
<span class="token comment">--  master_port : 主库的端口</span>
<span class="token comment">--  master_user : 访问主库进行主从复制的用户名(上面在主库创建的)</span>
<span class="token comment">--  master_password : 访问主库进行主从复制的用户名对应的密码</span>
<span class="token comment">--  master_log_file : 从哪个日志文件开始同步(上述查询master状态中展示的有)</span>
<span class="token comment">--  master_log_pos : 从指定日志文件的哪个位置开始同步(上述查询master状态中展示的有)</span>
change master <span class="token keyword">to</span> master_host<span class="token operator">=</span><span class="token string">&#39;175.178.126.61&#39;</span><span class="token punctuation">,</span>master_port<span class="token operator">=</span><span class="token number">1053</span><span class="token punctuation">,</span>master_user<span class="token operator">=</span><span class="token string">&#39;apai1053&#39;</span><span class="token punctuation">,</span>master_password<span class="token operator">=</span><span class="token string">&#39;apai1053&#39;</span><span class="token punctuation">,</span>master_log_file<span class="token operator">=</span><span class="token string">&#39;mysql-bin.000001&#39;</span><span class="token punctuation">,</span>master_log_pos<span class="token operator">=</span><span class="token number">669</span><span class="token punctuation">;</span>
<span class="token keyword">start</span> slave<span class="token punctuation">;</span>
<span class="token comment">-- 查看数据库的状态 (出现&quot;Slave_IO_Running&quot;和&quot;Slave_SQL_Running&quot;用于描述从服务器的状态YES表示成功)</span>
<span class="token keyword">show</span> slave <span class="token keyword">status</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>数据库二: 执行</strong></p></blockquote><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 执行一: 创建下方数据提供给另一个数据库链接使用</span>
<span class="token comment">-- 上面SQL的作用是创建一个用户 apai1053，密码为 apai1053 </span>
<span class="token comment">-- 并且给 apai1053 用户授予REPLICATION SLAVE权限</span>
<span class="token comment">-- 常用于建立复制时所需要用到的用户权限，也就是slave必须被master授权具有该权限的用户，才能通过该用户复制</span>
<span class="token keyword">CREATE</span> <span class="token keyword">USER</span> <span class="token string">&#39;apai1053&#39;</span><span class="token variable">@&#39;%&#39;</span> IDENTIFIED <span class="token keyword">WITH</span> mysql_native_password <span class="token keyword">BY</span> <span class="token string">&#39;apai1053&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">GRANT</span> <span class="token keyword">REPLICATION</span> SLAVE <span class="token keyword">ON</span> <span class="token operator">*</span><span class="token punctuation">.</span><span class="token operator">*</span> <span class="token keyword">TO</span> <span class="token string">&#39;apai1053&#39;</span><span class="token variable">@&#39;%&#39;</span><span class="token punctuation">;</span>
<span class="token comment">-- 记录下结果中File(mysql-bin.000001)和Position(669)的值 </span>
<span class="token keyword">show</span> master <span class="token keyword">status</span><span class="token punctuation">;</span>

<span class="token comment">-- 执行二: 在另一个数据库执行一之后执行, 数据为另一个数据库的信息配置进行链接</span>
<span class="token comment">-- 参数说明：</span>
<span class="token comment">--  master_host : 主库的IP地址</span>
<span class="token comment">--  master_port : 主库的端口</span>
<span class="token comment">--  master_user : 访问主库进行主从复制的用户名(上面在主库创建的)</span>
<span class="token comment">--  master_password : 访问主库进行主从复制的用户名对应的密码</span>
<span class="token comment">--  master_log_file : 从哪个日志文件开始同步(上述查询master状态中展示的有)</span>
<span class="token comment">--  master_log_pos : 从指定日志文件的哪个位置开始同步(上述查询master状态中展示的有)</span>
change master <span class="token keyword">to</span> master_host<span class="token operator">=</span><span class="token string">&#39;175.178.126.61&#39;</span><span class="token punctuation">,</span>master_port<span class="token operator">=</span><span class="token number">1052</span><span class="token punctuation">,</span>master_user<span class="token operator">=</span><span class="token string">&#39;apai1052&#39;</span><span class="token punctuation">,</span>master_password<span class="token operator">=</span><span class="token string">&#39;apai1052&#39;</span><span class="token punctuation">,</span>master_log_file<span class="token operator">=</span><span class="token string">&#39;mysql-bin.000001&#39;</span><span class="token punctuation">,</span>master_log_pos<span class="token operator">=</span><span class="token number">669</span><span class="token punctuation">;</span>
<span class="token keyword">start</span> slave<span class="token punctuation">;</span>
<span class="token comment">-- 查看数据库的状态 (出现&quot;Slave_IO_Running&quot;和&quot;Slave_SQL_Running&quot;用于描述从服务器的状态YES表示成功)</span>
<span class="token keyword">show</span> slave <span class="token keyword">status</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-验证双向复制" tabindex="-1"><a class="header-anchor" href="#_5-验证双向复制" aria-hidden="true">#</a> 5.验证双向复制</h3><blockquote><p><strong>数据库都在执行查看数据库的状态时 YES 即可表示链接成功</strong></p></blockquote><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230714114114754.png" alt="image-20230714114114754"></p><blockquote><p><strong>任意表数据变化 另一张同步复制 实现双向复制</strong></p></blockquote><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230714114443557.png" alt="image-20230714114443557"></p><h2 id="mysql-多主一从模式" tabindex="-1"><a class="header-anchor" href="#mysql-多主一从模式" aria-hidden="true">#</a> MySql 多主一从模式</h2><blockquote><p>MySql 多主一从模式 即:</p></blockquote><ul><li>多个主机进行-写 一个部分从机进行-读</li><li>多个主机直接都是双向数据链接 从机拉取主机的数据 主机不会拉取从机的数据</li></ul><h3 id="_1-主机配置-双向主从模式" tabindex="-1"><a class="header-anchor" href="#_1-主机配置-双向主从模式" aria-hidden="true">#</a> 1.主机配置 双向主从模式</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>参考上方 <span class="token class-name">MySql</span> 双向主从模式 进行主机互联数据
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-配置从机-单向主从模式" tabindex="-1"><a class="header-anchor" href="#_2-配置从机-单向主从模式" aria-hidden="true">#</a> 2.配置从机 单向主从模式</h3><blockquote><p>配置数据库 my.cnf 配置</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
pid-file        <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
socket          <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
datadir         <span class="token operator">=</span> /var/lib/mysql
secure-file-priv<span class="token operator">=</span> NULL

<span class="token comment"># 配置</span>
server-id <span class="token operator">=</span> <span class="token number">1</span>
log-bin <span class="token operator">=</span> mysql-bin
binlog_format <span class="token operator">=</span> mixed

<span class="token comment"># Custom config should go here</span>
<span class="token operator">!</span>includedir /etc/mysql/conf.d/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>配置从机 单向主从模式</p></blockquote><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 停止数据库io链接 后续可重新配置链接</span>
STOP SLAVE IO_THREAD<span class="token punctuation">;</span>

<span class="token comment">-- 执行二: 在另一个数据库执行一之后执行, 数据为另一个数据库的信息配置进行链接</span>
<span class="token comment">-- 参数说明：</span>
<span class="token comment">--  master_host : 主库的IP地址</span>
<span class="token comment">--  master_port : 主库的端口</span>
<span class="token comment">--  master_user : 访问主库进行主从复制的用户名(上面在主库创建的)</span>
<span class="token comment">--  master_password : 访问主库进行主从复制的用户名对应的密码</span>
<span class="token comment">--  master_log_file : 从哪个日志文件开始同步(上述查询master状态中展示的有)</span>
<span class="token comment">--  master_log_pos : 从指定日志文件的哪个位置开始同步(上述查询master状态中展示的有)</span>
change master <span class="token keyword">to</span> master_host<span class="token operator">=</span><span class="token string">&#39;175.178.126.61&#39;</span><span class="token punctuation">,</span>master_port<span class="token operator">=</span><span class="token number">1053</span><span class="token punctuation">,</span>master_user<span class="token operator">=</span><span class="token string">&#39;apai1053&#39;</span><span class="token punctuation">,</span>master_password<span class="token operator">=</span><span class="token string">&#39;apai1053&#39;</span><span class="token punctuation">,</span>master_log_file<span class="token operator">=</span><span class="token string">&#39;mysql-bin.000001&#39;</span><span class="token punctuation">,</span>master_log_pos<span class="token operator">=</span><span class="token number">669</span><span class="token punctuation">;</span>
<span class="token keyword">start</span> slave<span class="token punctuation">;</span>
<span class="token comment">-- 查看数据库的状态 (出现&quot;Slave_IO_Running&quot;和&quot;Slave_SQL_Running&quot;用于描述从服务器的状态YES表示成功)</span>
<span class="token keyword">show</span> slave <span class="token keyword">status</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-验证" tabindex="-1"><a class="header-anchor" href="#_3-验证" aria-hidden="true">#</a> 3.验证</h3><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230714143005784.png" alt="image-20230714143005784"></p><h2 id="主从复制总结" tabindex="-1"><a class="header-anchor" href="#主从复制总结" aria-hidden="true">#</a> 主从复制总结</h2><h3 id="从机数据库的状态" tabindex="-1"><a class="header-anchor" href="#从机数据库的状态" aria-hidden="true">#</a> 从机数据库的状态</h3><blockquote><p>&quot;Slave_IO_Running&quot;和&quot;Slave_SQL_Running&quot;用于描述从服务器的状态</p></blockquote><p><strong>&quot;Slave_IO_Running&quot;</strong></p><ul><li>描述了从服务器上的I/O线程状态，该线程负责从主服务器上读取二进制日志并将其复制到从服务器上。</li><li>如果该参数值为&quot;YES&quot;，表示I/O线程正在运行并且从主服务器上成功读取了二进制日志。</li></ul><p><strong>&quot;Slave_SQL_Running&quot;</strong></p><ul><li>描述了从服务器上的SQL线程状态，</li><li>该线程负责将从主服务器上复制的二进制日志应用到从服务器上的数据库中。</li><li>如果该参数值为&quot;YES&quot;，表示SQL线程正在运行并且成功将所有的二进制日志应用到从服务器上的数据库中。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>如果这两个参数的值都为<span class="token string">&quot;YES&quot;</span>，则表示从服务器上的主从复制状态正常，并且从服务器上的数据与主服务器上的数据是同步的。如果其中任何一个参数的值为<span class="token string">&quot;NO&quot;</span>，则表示复制出现了问题，并且需要进行故障排除。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="主从复制大致步骤" tabindex="-1"><a class="header-anchor" href="#主从复制大致步骤" aria-hidden="true">#</a> 主从复制大致步骤</h3><blockquote><p>Linux MySQL主从复制架构是一种常见的数据库备份和数据同步方案。</p></blockquote><p>它可以通过将主数据库的数据同步到从数据库上，实现数据的备份和高可用性。具体步骤包括：</p><ol><li>在主数据库上创建一个用于复制的用户，并授权给该用户复制权限。</li><li>在从数据库上创建一个与主数据库相同的数据库，并设置为串口模式。</li><li>在从数据库上配置主从复制，包括指定主数据库的IP地址和端口号，以及复制用户的用户名和密码。</li><li>启动从数据库的复制进程，等待数据同步完成。</li><li>在主数据库上进行数据更新操作，等待数据同步到从数据库。</li><li>在从数据库上进行查询操作，数据验证同步是否成功。</li></ol><p>总的来说，Linux MySQL主从复制架构是一种非常实用的数据库备份和数据同步方案，可以提高数据的可靠性和可用性。</p><h3 id="读写分离" tabindex="-1"><a class="header-anchor" href="#读写分离" aria-hidden="true">#</a> 读写分离</h3><blockquote><p>在 MySQL 主从复制和读写分离架构中，从机主要用于处理读操作，而写操作通常由主机处理。</p></blockquote><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>主从复制是一种数据复制技术，其中一个 <span class="token class-name">MySQL</span> 服务器充当主服务器（<span class="token class-name">Master</span>），负责接收和处理所有的写操作（<span class="token constant">INSERT</span>、<span class="token constant">UPDATE</span>、<span class="token constant">DELETE</span>）。同时，主服务器将这些写操作的日志记录到二进制日志文件（<span class="token class-name">Binary</span> <span class="token class-name">Log</span>）中。其他的 <span class="token class-name">MySQL</span> 服务器作为从服务器（<span class="token class-name">Slave</span>），通过连接到主服务器并获取二进制日志文件，来复制主服务器上的写操作。从服务器会将这些写操作应用到自己的数据库中，以保持与主服务器的数据一致性。

读写分离是在主从复制的基础上实现的一种架构模式。它通过将读操作分发给从服务器来减轻主服务器的负载，并提高整体系统的读取性能。在读写分离架构中，从服务器可以处理大部分的查询请求，包括 <span class="token constant">SELECT</span> 查询等读操作。而写操作仍然由主服务器处理，以确保数据的一致性。

因此，在主从复制和读写分离架构中，从机主要用于处理读操作，而写操作仍然由主机处理。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,117);function b(g,h){const a=p("ExternalLinkIcon");return t(),i("div",null,[r,s("blockquote",null,[s("p",null,[n("MySql "),s("a",d,[n("主从复制参考"),e(a)]),n(),s("a",m,[n("模式架构详解"),e(a)])])]),u,s("ul",null,[s("li",null,[n("复制是指将主数据库的DDL 和 DML 操作通过"),s("a",v,[n("二进制"),e(a)]),n("日志传到从库服务器中，然后在从库上对这些日志重新执行（也叫重做），从而使得从库和主库的数据保持同步")])]),k])}const _=l(c,[["render",b],["__file","MySQLzhucongfuzhi.html.vue"]]);export{_ as default};
