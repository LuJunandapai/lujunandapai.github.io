import{_ as n,p as s,q as a,Y as e}from"./framework-e1bed10d.js";const t={},p=e(`<h2 id="springboot-mail-邮件" tabindex="-1"><a class="header-anchor" href="#springboot-mail-邮件" aria-hidden="true">#</a> SpringBoot - mail 邮件</h2><h3 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖" aria-hidden="true">#</a> 引入依赖</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!--mail 邮件发送 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-starter-mail<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写相关配置" tabindex="-1"><a class="header-anchor" href="#编写相关配置" aria-hidden="true">#</a> 编写相关配置</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> springboot<span class="token punctuation">-</span>demo
  <span class="token comment"># QQ 服务器邮箱</span>
  <span class="token key atrule">mail</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> smtp.qq.com    <span class="token comment">#服务器</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> 2386297795@qq.com  <span class="token comment">#你的邮箱地址</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> jcgovsqiuevldidb   <span class="token comment">#邮箱授权码是刚才开启POP3/SMTP服务时生成的链接字符</span>
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">25</span>                     <span class="token comment">#端口号</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> smtp               <span class="token comment">#SMTP 可以理解为协议</span>
    <span class="token key atrule">default-encoding</span><span class="token punctuation">:</span> UTF<span class="token punctuation">-</span><span class="token number">8</span>      <span class="token comment">#编码格式</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mail-使用-测试" tabindex="-1"><a class="header-anchor" href="#mail-使用-测试" aria-hidden="true">#</a> mail 使用 测试</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 内置的工具类</span>
<span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">JavaMailSenderImpl</span> javaMailSender<span class="token punctuation">;</span>

<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">contextLoads</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">SimpleMailMessage</span> message <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleMailMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 邮箱的标题</span>
    message<span class="token punctuation">.</span><span class="token function">setSubject</span><span class="token punctuation">(</span><span class="token string">&quot;email测试&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 邮箱的内容</span>
    message<span class="token punctuation">.</span><span class="token function">setText</span><span class="token punctuation">(</span><span class="token string">&quot;邮件测试内容,验证码：7788&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 收件人的邮箱</span>
    message<span class="token punctuation">.</span><span class="token function">setTo</span><span class="token punctuation">(</span><span class="token string">&quot;897031817@qq.com&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 发件人的邮箱，和配置的username保持一致</span>
    message<span class="token punctuation">.</span><span class="token function">setFrom</span><span class="token punctuation">(</span><span class="token string">&quot;897031817@qq.com&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 获取注入的 javaMailSender 发送邮件</span>
    javaMailSender<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mail-集成动态切换" tabindex="-1"><a class="header-anchor" href="#mail-集成动态切换" aria-hidden="true">#</a> Mail 集成动态切换</h2><h3 id="mail-工具类" tabindex="-1"><a class="header-anchor" href="#mail-工具类" aria-hidden="true">#</a> Mail 工具类</h3><p><strong>前提注意点:</strong></p><ul><li>根据yml的邮箱服务器进行邮件发送: 需要在YML里面配置好在使用</li><li>动态修改邮件服务器进行发送邮箱: 在使用前根据我们的邮箱服务器的配置进行注入 可动态的切换邮箱服务器</li><li>此处是配合 数据库的数据 动态的切换</li></ul><div class="language-JAVA line-numbers-mode" data-ext="JAVA"><pre class="language-JAVA"><code>package com.kaiyun.util;

import cn.hutool.core.collection.CollUtil;
import com.kaiyun.entity.Mailbox;
import com.kaiyun.template.MailEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.util.List;
import java.util.Properties;


@Component
public class MailUtil {

    // 内置的工具类
    @Resource
    private JavaMailSenderImpl javaMailSender;

    @Value(&quot;\${spring.mail.username}&quot;)
    private String addresser;

    // ----------- 根据yml的邮箱服务器进行邮件发送 -----------
    /**
     * 简单邮件发送
     *
     * @param title      邮箱的标题
     * @param content    邮箱的内容 (文本 不支持html)
     * @param recipients 收件人的邮箱
     * @return
     */
    public Boolean sendmail(String title, String content, String recipients) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // 邮箱的标题
            message.setSubject(title);
            // 邮箱的内容
            message.setText(content);
            // 收件人的邮箱
            message.setTo(recipients);
            // 发件人的邮箱，和配置的username保持一致
            message.setFrom(addresser);
            // 获取注入的 javaMailSender 发送邮件
            javaMailSender.send(message);
            return true;
        } catch (MailException e) {
            e.printStackTrace(); // 打印错误信息
            return false;
        }
    }

    /**
     * 复杂邮件发送 支持HTML 带附件
     * @param title 邮箱的标题
     * @param content 邮箱的内容 (文本 支持html)
     * @param recipients 收件人的邮箱
     * @param files 附件 FileUtils.getFilePatht(imgStrs) 数组 (为空则不发送附件)
     * @return 是否发送成功 true:成功 false:失败
     */
    public Boolean sendmailHtmlAndFile(String title, String content, String recipients, List&lt;String&gt; files) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            // 邮箱的标题
            helper.setSubject(title);
            // 邮箱的内容
            helper.setText(content, true);
            // 附件
            if (CollUtil.isNotEmpty(files)) {
                for (String file : files) {
                    helper.addAttachment(file, new File(file));
                }
            }
            // 收件人的邮箱
            helper.setTo(recipients);
            // 发件人的邮箱，和配置的username保持一致
            helper.setFrom(addresser);
            // 获取注入的 javaMailSender 发送邮件
            javaMailSender.send(mimeMessage);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace(); // 打印错误信息
            return false;
        }
    }

    // ----------- 动态修改邮件服务器进行发送邮箱 -----------

    /**
     * 根据数据库数据进行配置邮箱服务器
     * @param mailbox
     * @return
     */
    public JavaMailSenderImpl setConfiguration(Mailbox mailbox) {
        //创建实例
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        //设置发送的服务器（这里的属性 qq和网易的不一样）qq：smtp.qq.com   网易：smtp.126.com
        sender.setHost(mailbox.getHost());
        //当前发送人邮箱（也就是自己）
        sender.setUsername(mailbox.getUsername());
        //授权码 （不是邮箱密码  是上面咱们的准备工作获取的那个码）
        sender.setPassword(mailbox.getPassword());
        //设置端口（这里用456、默认的25 在阿里云服务器上未开放，推荐我们设置456）
        sender.setPort(mailbox.getPort());
        //然后设置456需要设置底下一些东西、之前这写我写到yml里，就是不清楚该怎么去修改。
        Properties p = new Properties();
        p.setProperty(&quot;mail.smtp.auth&quot;, &quot;true&quot;);
        p.setProperty(&quot;mail.smtp.ssl&quot;, &quot;true&quot;);
        p.setProperty(&quot;mail.smtp.socketFactory.port&quot;, &quot;465&quot;);
        p.setProperty(&quot;mail.smtp.socketFactory.class&quot;, &quot;javax.net.ssl.SSLSocketFactory&quot;);
        p.setProperty(&quot;mail.smtp.starttls.enable&quot;, &quot;true&quot;);
        p.setProperty(&quot;mail.smtp.starttls.required&quot;, &quot;true&quot;);
        sender.setJavaMailProperties(p);
        return sender;
    }

    /**
     * 复杂邮件发送 支持html (自定义邮箱服务器配置)
     * @param mailbox 邮箱服务器配置
     * @param mailEntity 邮箱的标题 邮箱的内容 收件人的邮箱 附件的路径数组(为空则不发送附件)
     * @return
     */
    public Boolean setSendmailHtmlAndFile(Mailbox mailbox, MailEntity mailEntity) {
        try {
            JavaMailSenderImpl sender = setConfiguration(mailbox);
            // 获取注入的 javaMailSender 发送邮件
            MimeMessage message = sender.createMimeMessage();
            //解决-发送邮件时附件名太长会被截取掉或者中文乱码问题
            System.getProperties().setProperty(&quot;mail.mime.splitlongparameters&quot;, &quot;false&quot;);

            MimeMessageHelper helper = new MimeMessageHelper(message, true, mailbox.getDefaultEncoding());
            // 邮箱的标题
            helper.setSubject(mailEntity.getTitle());
            // 邮箱的内容
            helper.setText(mailEntity.getContent(), true);
            // 附件
            if (CollUtil.isNotEmpty(mailEntity.getFiles())) {
                for (String file : mailEntity.getFiles()) {
                    helper.addAttachment(file, new File(file));
                }
            }
            // 收件人的邮箱 
            helper.setTo(mailEntity.getRecipients());
            // 设置自定义的“发件人”地址 显示名称 设置自定义邮箱名称 helper.setFrom(&quot;你自定义的名称 &lt;&quot; + 发件人邮箱账号地址 + &quot;&gt;&quot;);
            helper.setFrom(&quot;你自定义的名称 &lt;&quot; + mailbox.getUsername() + &quot;&gt;&quot;);
            // 发件人的邮箱，和配置的username保持一致, 可设置自定义 下面为直接显示账号名称
            // helper.setFrom(mailbox.getUsername());
            // 获取注入的 javaMailSender 发送邮件
            sender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace(); // 打印错误信息
            return false;
        }
    }

    // ----------- 邮件样式模板 -----------
    /**
     * 卡片样式 阴影效果
     * @param title 标题
     * @param content 内容
     * @return
     */
    public static String getDivShadow(String title, String content) {
        return  &quot;&lt;div style=\\&quot;width: 100%;background-color: #fff;padding: 20px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);margin: 20px;\\&quot;&gt;\\n&quot; +
                &quot;    &lt;!-- 标题 --&gt;\\n&quot; +
                &quot;    &lt;div style=\\&quot;font-size: 18px;font-weight: bold;margin-bottom: 10px;\\&quot;&gt;&quot; + title + &quot;&lt;/div&gt;\\n&quot; +
                &quot;    &lt;!-- 内容 --&gt;\\n&quot; +
                &quot;    &lt;div class=\\&quot;content\\&quot; style=\\&quot;font-size: 14px;color: #555;\\&quot;&gt;\\n&quot; +
                &quot;      &lt;p&gt; &quot; + content + &quot;&lt;/p&gt;\\n&quot; +
                &quot;    &lt;/div&gt;\\n&quot; +
                &quot;  &lt;/div&gt;&quot;;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="邮件内容" tabindex="-1"><a class="header-anchor" href="#邮件内容" aria-hidden="true">#</a> 邮件内容</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>kaiyun<span class="token punctuation">.</span>template</span><span class="token punctuation">;</span>


<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">AllArgsConstructor</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Data</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">NoArgsConstructor</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">Serializable</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 邮件内容的实体类
 * 用于封装邮件的标题、内容、收件人、附件等信息
 */</span>
<span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token annotation punctuation">@NoArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MailEntity</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token comment">// 邮箱的标题</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> title<span class="token punctuation">;</span>

    <span class="token comment">// 邮箱的内容</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> content<span class="token punctuation">;</span>

    <span class="token comment">// 收件人的邮箱</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> recipients<span class="token punctuation">;</span>

    <span class="token comment">// 附件的路径</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> files<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">MailEntity</span><span class="token punctuation">(</span><span class="token class-name">String</span> title<span class="token punctuation">,</span> <span class="token class-name">String</span> content<span class="token punctuation">,</span> <span class="token class-name">String</span> recipients<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>title <span class="token operator">=</span> title<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>content <span class="token operator">=</span> content<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>recipients <span class="token operator">=</span> recipients<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="邮箱配置数据" tabindex="-1"><a class="header-anchor" href="#邮箱配置数据" aria-hidden="true">#</a> 邮箱配置数据</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>kaiyun<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>baomidou<span class="token punctuation">.</span>mybatisplus<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">IdType</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>baomidou<span class="token punctuation">.</span>mybatisplus<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">TableField</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>baomidou<span class="token punctuation">.</span>mybatisplus<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">TableId</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>baomidou<span class="token punctuation">.</span>mybatisplus<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">TableName</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>baomidou<span class="token punctuation">.</span>mybatisplus<span class="token punctuation">.</span>extension<span class="token punctuation">.</span>activerecord<span class="token punctuation">.</span></span><span class="token class-name">Model</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">io<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>annotations<span class="token punctuation">.</span></span><span class="token class-name">ApiModel</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">io<span class="token punctuation">.</span>swagger<span class="token punctuation">.</span>annotations<span class="token punctuation">.</span></span><span class="token class-name">ApiModelProperty</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Data</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">Serializable</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 邮箱表(Mailbox)表实体类
 *
 * <span class="token keyword">@author</span> Things will get done and the world will end
 * <span class="token keyword">@since</span> 2023-12-25 12:20:01
 */</span>
 
<span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@TableName</span><span class="token punctuation">(</span><span class="token string">&quot;mailbox&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@ApiModel</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;Mailbox 对象&quot;</span><span class="token punctuation">,</span> description <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Mailbox</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span>  <span class="token punctuation">{</span>


    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;邮箱配置 ID&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableId</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;id&quot;</span><span class="token punctuation">,</span> type <span class="token operator">=</span> <span class="token class-name">IdType</span><span class="token punctuation">.</span><span class="token constant">AUTO</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> id<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;邮箱名称&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;ditch_name&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> ditchName<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;地区&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;region&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> region<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;是否默认 1_默认 2_不默认 一个地区一个默认邮箱&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;is_default&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> isDefault<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;创建人&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;create_user&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> createUser<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;创建时间&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;create_time&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> createTime<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;数据状态: 1_正常 2_删除&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;status&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> status<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;* 邮箱服务器&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;host&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> host<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;* 你的邮箱地址&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;username&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> username<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;* 邮箱授权码是刚才开启POP3/SMTP服务时生成的链接字符&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;password&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> password<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;邮箱端口号&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;port&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> port<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;SMTP 可以理解为协议&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;protocol&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> protocol<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@ApiModelProperty</span><span class="token punctuation">(</span><span class="token string">&quot;编码格式&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;default_encoding&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> defaultEncoding<span class="token punctuation">;</span>
    
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置数据库表" tabindex="-1"><a class="header-anchor" href="#配置数据库表" aria-hidden="true">#</a> 配置数据库表</h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">SET</span> NAMES utf8mb4<span class="token punctuation">;</span>
<span class="token keyword">SET</span> FOREIGN_KEY_CHECKS <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token comment">-- ----------------------------</span>
<span class="token comment">-- Table structure for mailbox</span>
<span class="token comment">-- ----------------------------</span>
<span class="token keyword">DROP</span> <span class="token keyword">TABLE</span> <span class="token keyword">IF</span> <span class="token keyword">EXISTS</span> <span class="token identifier"><span class="token punctuation">\`</span>mailbox<span class="token punctuation">\`</span></span><span class="token punctuation">;</span>
<span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">\`</span>mailbox<span class="token punctuation">\`</span></span>  <span class="token punctuation">(</span>
  <span class="token identifier"><span class="token punctuation">\`</span>id<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">AUTO_INCREMENT</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;邮箱配置 ID&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>ditch_name<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;邮箱名称&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>region<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;地区&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>is_default<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;是否默认 1_默认 2_不默认 一个地区一个默认邮箱&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>create_user<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;创建人&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>create_time<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;创建时间&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>status<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;数据状态: 1_正常 2_删除&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>host<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;* 邮箱服务器&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>username<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;* 你的邮箱地址&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>password<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;* 邮箱授权码是刚才开启POP3/SMTP服务时生成的链接字符&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>port<span class="token punctuation">\`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;邮箱端口号&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>protocol<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;SMTP 可以理解为协议&#39;</span><span class="token punctuation">,</span>
  <span class="token identifier"><span class="token punctuation">\`</span>default_encoding<span class="token punctuation">\`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> utf8 <span class="token keyword">COLLATE</span> utf8_general_ci <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token string">&#39;UTF-8&#39;</span> <span class="token keyword">COMMENT</span> <span class="token string">&#39;编码格式&#39;</span><span class="token punctuation">,</span>
  <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">\`</span>id<span class="token punctuation">\`</span></span><span class="token punctuation">)</span> <span class="token keyword">USING</span> <span class="token keyword">BTREE</span>
<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span> <span class="token operator">=</span> <span class="token keyword">InnoDB</span> <span class="token keyword">AUTO_INCREMENT</span> <span class="token operator">=</span> <span class="token number">3</span> <span class="token keyword">CHARACTER</span> <span class="token keyword">SET</span> <span class="token operator">=</span> utf8 <span class="token keyword">COLLATE</span> <span class="token operator">=</span> utf8_general_ci <span class="token keyword">COMMENT</span> <span class="token operator">=</span> <span class="token string">&#39;邮箱表&#39;</span> ROW_FORMAT <span class="token operator">=</span> Dynamic<span class="token punctuation">;</span>

<span class="token comment">-- ----------------------------</span>
<span class="token comment">-- Records of mailbox</span>
<span class="token comment">-- ----------------------------</span>
<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">\`</span>mailbox<span class="token punctuation">\`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;HFYX-QQ&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;2023-12-23 12:19:36&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;smtp.qq.com&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;2386297795@qq.com&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;jcgovsqiuevldidb&#39;</span><span class="token punctuation">,</span> <span class="token number">25</span><span class="token punctuation">,</span> <span class="token string">&#39;smtp&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;UTF-8&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">\`</span>mailbox<span class="token punctuation">\`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">&#39;HFYX-WY&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;2023-12-23 12:19:36&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;smtp.163.com&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;lu_yuelian@163.com&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;NPYIAMQULWFPVQZS&#39;</span><span class="token punctuation">,</span> <span class="token number">25</span><span class="token punctuation">,</span> <span class="token string">&#39;smtp&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;UTF-8&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">SET</span> FOREIGN_KEY_CHECKS <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试案例" tabindex="-1"><a class="header-anchor" href="#测试案例" aria-hidden="true">#</a> 测试案例</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>kaiyun<span class="token punctuation">.</span>controller</span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Api</span><span class="token punctuation">(</span>tags <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&quot;客户页面请求Api&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/clientele&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ClienteleController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">MailUtil</span> mailUtil<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@AnonymousAccess</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/contextLoads&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">ResponseResult</span> <span class="token function">contextLoads</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 附件的路径 (为空则不发送附件) / 相对位置使用文件工具类获取绝对路径</span>
        <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> images <span class="token operator">=</span> <span class="token punctuation">{</span>
                <span class="token string">&quot;D:\\\\KaiYun\\\\aftersaleserver\\\\upload\\\\flow-img\\\\2023-12-22\\\\0d983b72c3d34685b38f3a447f129b0b.jpg&quot;</span><span class="token punctuation">,</span>
                <span class="token string">&quot;D:\\\\KaiYun\\\\aftersaleserver\\\\upload\\\\flow-img\\\\2023-12-22\\\\1fb6051f3a6c4ece8b4f2f974d2a1fd4.jpg&quot;</span><span class="token punctuation">,</span>
                <span class="token string">&quot;D:\\\\KaiYun\\\\aftersaleserver\\\\upload\\\\flow-img\\\\2023-12-22\\\\2b100db5c41e4012a85dc88d2594ed67.jpg&quot;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>

        <span class="token class-name">String</span> a <span class="token operator">=</span> <span class="token string">&quot;售后工单: &quot;</span> <span class="token operator">+</span> <span class="token string">&quot;APAI-00000001&quot;</span> <span class="token operator">+</span> <span class="token string">&quot; 提交成功&quot;</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> b <span class="token operator">=</span> <span class="token string">&quot;售后工单: &quot;</span> <span class="token operator">+</span> <span class="token string">&quot;APAI-00000001&quot;</span> <span class="token operator">+</span> <span class="token string">&quot;: &quot;</span> <span class="token operator">+</span> <span class="token string">&quot;您好, 您的售后工单已提交成功, 请等待工作人员处理, 谢谢您的支持! &quot;</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> neirong <span class="token operator">=</span> <span class="token function">getDivShadow</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">Mailbox</span> mailbox <span class="token operator">=</span> mailboxService<span class="token punctuation">.</span><span class="token function">getById</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">MailEntity</span> mailEntity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MailEntity</span><span class="token punctuation">(</span><span class="token string">&quot;邮箱的标题&quot;</span><span class="token punctuation">,</span> neirong<span class="token punctuation">,</span> <span class="token string">&quot;zhongchaoo86100@163.com&quot;</span><span class="token punctuation">,</span> images<span class="token punctuation">)</span><span class="token punctuation">;</span>
        mailUtil<span class="token punctuation">.</span><span class="token function">setSendmailHtmlAndFile</span><span class="token punctuation">(</span>mailbox<span class="token punctuation">,</span> mailEntity<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ResponseResult</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">&quot;成功&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/KaiYu-PicGo/image-20231225153359520.png" alt="image-20231225153359520"></p>`,21),i=[p];function o(l,c){return s(),a("div",null,i)}const r=n(t,[["render",o],["__file","Mail  youjian.html.vue"]]);export{r as default};
