import{_ as p,p as o,q as i,s as n,R as s,t,Y as e,n as c}from"./framework-e1bed10d.js";const l={},u=n("h2",{id:"框架",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#框架","aria-hidden":"true"},"#"),s(" 框架")],-1),r=n("ul",null,[n("li",null,"Typora MD 文档内容"),n("li",null,"Vuepress 2.x 前端框架 + GiteePages 部署")],-1),d=n("strong",null,"Hexo:",-1),k={href:"https://yushuaigee.gitee.io/2020/12/31/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%85%8D%E8%B4%B9%E6%90%AD%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2(%E4%B8%80)%E2%80%94%E2%80%94%E6%9C%AC%E5%9C%B0%E6%90%AD%E5%BB%BAhexo%E6%A1%86%E6%9E%B6/",target:"_blank",rel:"noopener noreferrer"},v=n("h2",{id:"vuepress-前端框架",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#vuepress-前端框架","aria-hidden":"true"},"#"),s(" Vuepress 前端框架")],-1),m=n("h3",{id:"官网地址",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#官网地址","aria-hidden":"true"},"#"),s(" 官网地址")],-1),b={href:"https://vuepress-theme-reco.recoluan.com/",target:"_blank",rel:"noopener noreferrer"},g={href:"http://v2.vuepress-reco.recoluan.com/docs/theme/frontmatter-home.html#banner",target:"_blank",rel:"noopener noreferrer"},q={href:"https://v2.vuepress.vuejs.org/zh/reference/config.html",target:"_blank",rel:"noopener noreferrer"},h=e(`<h2 id="创建-vuepress" tabindex="-1"><a class="header-anchor" href="#创建-vuepress" aria-hidden="true">#</a> 创建 Vuepress</h2><p><strong>npx</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 初始化，并选择 2.x</span>
npx @vuepress-reco/theme-cli init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>npm</strong> *</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 初始化，并选择 2.x</span>
<span class="token function">npm</span> <span class="token function">install</span> @vuepress-reco/theme-cli@1.0.7 <span class="token parameter variable">-g</span>
theme-cli init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>yarn</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 初始化，并选择 2.x</span>
<span class="token function">yarn</span> global <span class="token function">add</span> @vuepress-reco/theme-cli@1.0.7
theme-cli init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构" aria-hidden="true">#</a> 目录结构</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token operator">-</span> <span class="token punctuation">.</span>vuepress
    <span class="token operator">-</span> dist<span class="token operator">:</span> 打包后的文件 用于部署
    <span class="token operator">-</span> <span class="token keyword">public</span><span class="token operator">:</span> 静态文件 如头像
    <span class="token operator">-</span> styles<span class="token operator">:</span> 样式 
        <span class="token operator">-</span> index<span class="token punctuation">.</span>css<span class="token operator">:</span> 可进行覆盖主题样式
    <span class="token operator">-</span> config<span class="token punctuation">.</span>ts<span class="token operator">:</span> 配置文件 设置标题 导航栏等
<span class="token operator">-</span> blogs<span class="token operator">:</span> 文章 设置标签系列
<span class="token operator">-</span> docs<span class="token operator">:</span> 文档 设置导航下拉
<span class="token operator">-</span> <span class="token constant">README</span><span class="token punctuation">.</span>md<span class="token operator">:</span> 主页文件 修改标题 图标
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/My-PicGo/image-20230510204728621.png" alt="image-20230510204728621"></p><h3 id="readme-md" tabindex="-1"><a class="header-anchor" href="#readme-md" aria-hidden="true">#</a> README.md</h3><div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code><span class="token front-matter-block"><span class="token punctuation">---</span>
<span class="token front-matter yaml language-yaml"><span class="token key atrule">home</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">modules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> BannerBrand
  <span class="token punctuation">-</span> Blog
  <span class="token punctuation">-</span> MdContent
  <span class="token punctuation">-</span> Footer
<span class="token key atrule">bannerBrand</span><span class="token punctuation">:</span> <span class="token comment"># bannerBrand 模块的配置</span>
  <span class="token comment"># bgImage: &#39;/bg.svg&#39;</span>
  <span class="token key atrule">bgImage</span><span class="token punctuation">:</span> <span class="token string">&#39;/bg.svg&#39;</span>
  <span class="token key atrule">title</span><span class="token punctuation">:</span> Apai HKWL
  <span class="token key atrule">description</span><span class="token punctuation">:</span> 前路漫漫<span class="token punctuation">,</span> 我相信最后是花开万里啊
  <span class="token key atrule">tagline</span><span class="token punctuation">:</span> The road ahead is long<span class="token punctuation">,</span> and I believe that the flowers will bloom in the end
  <span class="token key atrule">buttons</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> 关于我<span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;/docs/Apai-AboutMe/Lu-aboutMe&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> My Site Description<span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;/blogs/other/Lu-aboutMe&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">&#39;plain&#39;</span> <span class="token punctuation">}</span>
  <span class="token key atrule">socialLinks</span><span class="token punctuation">:</span> <span class="token comment"># 社交地址</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;LogoGithub&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;Github&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://github.com/LuJunandapai&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StoragePool&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;我的 Gitee&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://gitee.com/LuisApai&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;Star&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;CSDN&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://blog.csdn.net/m0_64903853?spm=1000.2115.3001.5343&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;Locked&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;hutool 工具&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://hutool.cn/docs/#/&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StopSignFilled&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;我的B站&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://space.bilibili.com/168090249?spm_id_from=333.1007.0.0&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StopOutlineFilled&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;element 前端组件&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://element.eleme.cn/#/zh-CN&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StopSign&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">text</span><span class="token punctuation">:</span> <span class="token string">&#39;MyBatis-Plus&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://www.baomidou.com/&#39;</span> <span class="token punctuation">}</span>

<span class="token key atrule">blog</span><span class="token punctuation">:</span> <span class="token comment"># blog 模块的配置</span>
  <span class="token key atrule">socialLinks</span><span class="token punctuation">:</span> <span class="token comment"># 社交地址</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StormTracker&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://github.com/LuJunandapai&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StressBreathEditor&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://gitee.com/LuisApai&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;StudyView&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://github.com/LuJunandapai&#39;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token punctuation">{</span> <span class="token key atrule">icon</span><span class="token punctuation">:</span> <span class="token string">&#39;SubVolume&#39;</span><span class="token punctuation">,</span> <span class="token key atrule">link</span><span class="token punctuation">:</span> <span class="token string">&#39;https://blog.csdn.net/m0_64903853?spm=1000.2115.3001.5343&#39;</span> <span class="token punctuation">}</span>
<span class="token key atrule">footer</span><span class="token punctuation">:</span> <span class="token comment"># 底部模块的配置</span>
  <span class="token key atrule">record</span><span class="token punctuation">:</span> 前途与玫瑰 来日与方长 有风无风皆自由<span class="token tag">!</span>
  <span class="token key atrule">recordLink</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//gitee.com/LuisApai
  <span class="token key atrule">cyberSecurityRecord</span><span class="token punctuation">:</span> 面向月亮  <span class="token punctuation">|</span> 2000/10/25
  <span class="token key atrule">cyberSecurityLink</span><span class="token punctuation">:</span> docs/Apai<span class="token punctuation">-</span>AboutMe/Lu<span class="token punctuation">-</span>aboutMe
  <span class="token key atrule">startYear</span><span class="token punctuation">:</span> <span class="token number">2023</span>
<span class="token key atrule">isShowTitleInHome</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">actionText</span><span class="token punctuation">:</span> About
<span class="token key atrule">actionLink</span><span class="token punctuation">:</span> /views/other/about</span>
<span class="token punctuation">---</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="config-ts" tabindex="-1"><a class="header-anchor" href="#config-ts" aria-hidden="true">#</a> config.ts</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineUserConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuepress&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> DefaultThemeOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vuepress&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> recoTheme <span class="token keyword">from</span> <span class="token string">&quot;vuepress-theme-reco&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineUserConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  lang<span class="token operator">:</span> <span class="token string">&#39;zh-CN&#39;</span><span class="token punctuation">,</span>
  title<span class="token operator">:</span> <span class="token string">&quot;阿派 | Apai Blog&quot;</span><span class="token punctuation">,</span>
  description<span class="token operator">:</span> <span class="token string">&quot;Just playing around&quot;</span><span class="token punctuation">,</span>
  <span class="token comment">// base: &#39;/docs/.vuepress/dist/&#39;,   // 部署的路径配置</span>
  <span class="token comment">// dest: &#39;./dist&#39;,  // 设置输出目录</span>

  <span class="token comment">// 文档设置</span>
  theme<span class="token operator">:</span> <span class="token function">recoTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    style<span class="token operator">:</span> <span class="token string">&quot;@vuepress-reco/style-default&quot;</span><span class="token punctuation">,</span>
    logo<span class="token operator">:</span> <span class="token string">&quot;/logo.png&quot;</span><span class="token punctuation">,</span>
    author<span class="token operator">:</span> <span class="token string">&quot;LuisApai&quot;</span><span class="token punctuation">,</span>
    authorAvatar<span class="token operator">:</span> <span class="token string">&quot;/head.jpg&quot;</span><span class="token punctuation">,</span>
    docsRepo<span class="token operator">:</span> <span class="token string">&quot;https://space.bilibili.com/168090249?spm_id_from=333.1007.0.0&quot;</span><span class="token punctuation">,</span>
    docsBranch<span class="token operator">:</span> <span class="token string">&quot;main&quot;</span><span class="token punctuation">,</span>
    docsDir<span class="token operator">:</span> <span class="token string">&quot;example&quot;</span><span class="token punctuation">,</span>
    lastUpdatedText<span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>

    <span class="token comment">// 自定义目录标题</span>
    catalogTitle<span class="token operator">:</span> <span class="token string">&#39;文章层级目录&#39;</span><span class="token punctuation">,</span>

    <span class="token comment">// 自动设置分类</span>
    <span class="token comment">// autoSetBlogCategories: true,</span>
    <span class="token comment">// 自动将分类和标签添加至头部导航条</span>
    <span class="token comment">// autoAddCategoryToNavbar: true,</span>
    <span class="token comment">// 自动设置系列</span>
    autoSetSeries<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>

    <span class="token comment">// 顶部导航栏</span>
    navbar<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;Home&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// 导航 特殊组(分类 标签) link: &quot;/categories或者tags/默认的类别名称或者标签名称/1/&quot; 不存在的类别或者标签会报404</span>
      <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;分类组&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/categories/Start/1/&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;标签组&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/tags/Rests/1/&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// 导航下拉列表</span>
      <span class="token punctuation">{</span>
        text<span class="token operator">:</span> <span class="token string">&quot;文档组&quot;</span><span class="token punctuation">,</span>
        children<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;Web-开发&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Web-develop/Html-Js&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;Java-开发&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Java-develop/JavaMyUtil&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;Linux-系统&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Linux-develop/Linux&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;Apai-其他&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Rests-docs/JavaKaiFa&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token comment">// { text: &quot;Note taking&quot;, link: &quot;/blogs/other/guide&quot; },</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        text<span class="token operator">:</span> <span class="token string">&quot;花圃里&quot;</span><span class="token punctuation">,</span>
        children<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;2023-花开万里&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Apai-MyRecord/My-2023/My2305&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;2024-随心而来&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Apai-MyRecord/My-2024/My2401&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> text<span class="token operator">:</span> <span class="token string">&quot;关于我&quot;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&quot;/docs/Apai-AboutMe/Lu-aboutMe&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// blogs 页面</span>
      <span class="token comment">// { text: &quot;关于我&quot;, link: &quot;/blogs/other/guide&quot; },</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>

    <span class="token comment">// 文档组 的系列栏</span>
    series<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// Java-开发</span>
      <span class="token string-property property">&quot;/docs/Java-develop/&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;Java 笔记&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;JavaMyUtil&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Java-basics&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;JavaJinJie02&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;JavaGongNeng03&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;JavaBiKeng04&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;MySql 数据库&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;MySql&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;Java 框架&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Spring&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;SpringPeiZhi&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;MyBatisPlus&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;SpringSecurity&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;微服务&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;SpringConfig&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Redis&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;RabbitMQ&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token comment">// Web-开发</span>
      <span class="token string-property property">&quot;/docs/Web-develop/&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;前端 基础&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Html-Js&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;Web 框架&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 分栏名称</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token comment">// 栏目组 文档</span>
            <span class="token string">&quot;Vue-basics&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;Angular&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;前端 组件&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;ElementUI&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token comment">// Linux-系统</span>
      <span class="token string-property property">&quot;/docs/Linux-develop/&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;Linux 基础&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Linux&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;Linux 安装&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Linux&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>

      <span class="token comment">// --- 其他组 设置</span>
      <span class="token string-property property">&quot;/docs/Rests-docs/&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;My Apai&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;JavaKaiFa&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;技术组&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token string">&quot;ShardingJDBC&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;Swagger&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;工具组&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
              <span class="token string">&quot;MinIO&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>

      <span class="token comment">// --- 我的记录 设置</span>
      <span class="token string-property property">&quot;/docs/Apai-MyRecord/My-2023&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;My Month&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;My2305&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2306&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2307&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2308&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2309&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2310&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2311&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;My2312&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;星星 勇敢的追吧&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Apai-Year&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Apai-SheYingOne&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;前路漫漫 花开灿烂&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Yi-ZhuHai&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;Yi-HuBei&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>

      <span class="token comment">// --- 关于我 设置</span>
      <span class="token string-property property">&quot;/docs/Apai-AboutMe/&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;关于我&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Lu-aboutMe&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;工作经历&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Work-MaYun&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          text<span class="token operator">:</span> <span class="token string">&quot;兴趣爱好&quot;</span><span class="token punctuation">,</span>
          children<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&quot;Hobby-SheYing.md&quot;</span><span class="token punctuation">,</span>
          <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token comment">// 文章评论设置 评论插件 需要key https://valine.js.org/quickstart.html</span>
    <span class="token comment">// commentConfig: {</span>
    <span class="token comment">//   type: &#39;valine&#39;,</span>
    <span class="token comment">//   options: {</span>
    <span class="token comment">//     appId: &#39;...&#39;, // your appId</span>
    <span class="token comment">//     appKey: &#39;...&#39;, // your appKey</span>
    <span class="token comment">//     hideComments: false, // 全局隐藏评论，默认 false</span>
    <span class="token comment">//   },</span>
    <span class="token comment">// },</span>

    <span class="token comment">// 右侧公告栏 bulletin</span>
    <span class="token comment">// bulletin: {</span>
    <span class="token comment">//   body: [</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;text&quot;,</span>
    <span class="token comment">//       content: \`🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。\`,</span>
    <span class="token comment">//       style: &quot;font-size: 12px;&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;hr&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;title&quot;,</span>
    <span class="token comment">//       content: &quot;QQ 群&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;text&quot;,</span>
    <span class="token comment">//       content: \`</span>
    <span class="token comment">//       &lt;ul&gt;</span>
    <span class="token comment">//         &lt;li&gt;QQ群1：1037296104&lt;/li&gt;</span>
    <span class="token comment">//         &lt;li&gt;QQ群2：1061561395&lt;/li&gt;</span>
    <span class="token comment">//         &lt;li&gt;QQ群3：962687802&lt;/li&gt;</span>
    <span class="token comment">//       &lt;/ul&gt;\`,</span>
    <span class="token comment">//       style: &quot;font-size: 12px;&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;hr&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;title&quot;,</span>
    <span class="token comment">//       content: &quot;GitHub&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;text&quot;,</span>
    <span class="token comment">//       content: \`</span>
    <span class="token comment">//       &lt;ul&gt;</span>
    <span class="token comment">//         &lt;li&gt;&lt;a href=&quot;https://github.com/vuepress-reco/vuepress-theme-reco-next/issues&quot;&gt;Issues&lt;a/&gt;&lt;/li&gt;</span>
    <span class="token comment">//         &lt;li&gt;&lt;a href=&quot;https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1&quot;&gt;Discussions&lt;a/&gt;&lt;/li&gt;</span>
    <span class="token comment">//       &lt;/ul&gt;\`,</span>
    <span class="token comment">//       style: &quot;font-size: 12px;&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;hr&quot;,</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//     {</span>
    <span class="token comment">//       type: &quot;buttongroup&quot;,</span>
    <span class="token comment">//       children: [</span>
    <span class="token comment">//         {</span>
    <span class="token comment">//           text: &quot;打赏&quot;,</span>
    <span class="token comment">//           link: &quot;/docs/others/donate.html&quot;,</span>
    <span class="token comment">//         },</span>
    <span class="token comment">//       ],</span>
    <span class="token comment">//     },</span>
    <span class="token comment">//   ],</span>
    <span class="token comment">// },</span>
    <span class="token comment">// valineConfig 配置与 1.x 一致</span>
    <span class="token comment">// valineConfig: {</span>
    <span class="token comment">//   appId: &#39;xxx&#39;,</span>
    <span class="token comment">//   appKey: &#39;xxx&#39;,</span>
    <span class="token comment">//   placeholder: &#39;填写邮箱可以收到回复提醒哦！&#39;,</span>
    <span class="token comment">//   verify: true, // 验证码服务</span>
    <span class="token comment">//   // notify: true,</span>
    <span class="token comment">//   recordIP: true,</span>
    <span class="token comment">//   // hideComments: true // 隐藏评论</span>
    <span class="token comment">// },</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// debug: true,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="index-css" tabindex="-1"><a class="header-anchor" href="#index-css" aria-hidden="true">#</a> index.css</h3><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token comment">/*隐藏主页底部框架模板的跳转显示*/</span>
<span class="token selector">.footer-wrapper&gt;span:nth-child(1)</span> <span class="token punctuation">{</span>
    <span class="token property">display</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
    <span class="token comment">/*color: #2ecc71;*/</span>
<span class="token punctuation">}</span>
<span class="token comment">/*文章右侧层级宽度*/</span>
<span class="token selector">div[class=&quot;page-catalog-container&quot;]</span> <span class="token punctuation">{</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 19rem<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">/*主页下方图标*/</span>
<span class="token selector">ul[class=&quot;social-links&quot;]&gt;li:nth-child(1):hover</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="内容格式要求" tabindex="-1"><a class="header-anchor" href="#内容格式要求" aria-hidden="true">#</a> 内容格式要求</h2><h3 id="blogs-文档要求" tabindex="-1"><a class="header-anchor" href="#blogs-文档要求" aria-hidden="true">#</a> blogs 文档要求</h3><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>---
title: 文档名称
date: 2016/12/15 时间
tags:
 - tag 标签
 - tag2 多标签
categories:
 - category 分类
---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dos-文章要求" tabindex="-1"><a class="header-anchor" href="#dos-文章要求" aria-hidden="true">#</a> dos 文章要求</h3><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>---
title: 文章名称
date: 2023/02/15 时间
---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="打包部署" tabindex="-1"><a class="header-anchor" href="#打包部署" aria-hidden="true">#</a> 打包部署</h2><h3 id="package-json-打包" tabindex="-1"><a class="header-anchor" href="#package-json-打包" aria-hidden="true">#</a> package.json 打包</h3><ul><li>start 启动项目 端口-8080</li><li>build 打包.vuepress/dist文件夹下</li></ul><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Apai-Bolg-2023-ZHSHKWLA&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2.0.0&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Demo for vuepress-theme-reco@2.x.&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;repository&quot;</span><span class="token operator">:</span> <span class="token string">&quot;git@github.com:recoluan/vuepress-theme-reco-demo.git&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;author&quot;</span><span class="token operator">:</span> <span class="token string">&quot;reco_luan &lt;recoluan@outlook.com&gt;&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;license&quot;</span><span class="token operator">:</span> <span class="token string">&quot;MIT&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;dev&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress dev .&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;start&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress dev .&quot;</span><span class="token punctuation">,</span> 
    <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress build .&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;dependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;vuepress&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2.0.0-beta.60&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;vuepress-theme-reco&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2.0.0-beta.53&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h3><p>只需要将打包好的文件夹下的内容上传到远程仓库 最后使用Pages服务即可</p><blockquote><p>GitHuB 部署</p></blockquote><p><strong>创建仓库</strong>: 仓库地址需要跟用户个人空间地址一致 否则需要配置 bean 属性(麻烦)</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/My-PicGo/image-20230510205934042.png" alt="image-20230510205934042"></p><p><strong>配置分支 启动即可</strong>: 分支不能选错</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/My-PicGo/image-20230510210202519.png" alt="image-20230510210202519"></p><blockquote><p>Gitee 部署</p></blockquote><p><strong>创建仓库</strong>: 仓库地址需要跟用户个人空间地址一致 否则需要配置 bean 属性(麻烦)</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/My-PicGo/image-20230510210321292.png" alt="image-20230510210321292"></p><p><strong>配置分支 启动即可</strong>: 分支不能选错</p><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/My-PicGo/image-20230510210358018.png" alt="image-20230510210358018"></p><h2 id="git-命令" tabindex="-1"><a class="header-anchor" href="#git-命令" aria-hidden="true">#</a> Git 命令</h2>`,38),y={href:"https://www.runoob.com/git/git-basic-operations.html",target:"_blank",rel:"noopener noreferrer"},x=e(`<div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>git init <span class="token operator">-</span> 初始化仓库。
git add <span class="token punctuation">.</span> <span class="token operator">-</span> 添加文件到暂存区。
git commit <span class="token operator">|</span> git commit <span class="token operator">--</span>no<span class="token operator">-</span>verify <span class="token operator">-</span>m <span class="token char">&#39;提交备注&#39;</span> <span class="token operator">-</span> 将暂存区内容添加到仓库中 
    
git pull	下载远程代码并合并
git push	上传远程代码并合并
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="克隆-github-不成功" tabindex="-1"><a class="header-anchor" href="#克隆-github-不成功" aria-hidden="true">#</a> 克隆 GitHub 不成功</h2><blockquote><p>网路的问题 使用代理</p></blockquote>`,3),f={href:"https://blog.csdn.net/good_good_xiu/article/details/118567249",target:"_blank",rel:"noopener noreferrer"},_=e(`<p>解决方案</p><p>1.在项目文件夹的命令行窗口执行下面代码，</p><p>然后再git commit 或git clone取消git本身的https代理，</p><p>使用自己本机的代理，如果没有的话，其实默认还是用git的</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//取消http代理</span>
git config <span class="token operator">--</span>global <span class="token operator">--</span>unset http<span class="token punctuation">.</span>proxy
<span class="token comment">//取消https代理 </span>
git config <span class="token operator">--</span>global <span class="token operator">--</span>unset https<span class="token punctuation">.</span>proxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.科学上网（vpn） 这样就能提高服务器连接速度，能从根本解决 time out 443问题</p>`,6);function M(A,B){const a=c("ExternalLinkIcon");return o(),i("div",null,[u,r,n("p",null,[d,s(),n("a",k,[s("框架搭建参考"),t(a)])]),v,m,n("ul",null,[n("li",null,[n("a",b,[s("Vuepress 官网"),t(a)]),s(": 优秀博客 留言板")]),n("li",null,[n("a",g,[s("Vuepress 2.x 首页 配置参考)"),t(a)]),s(": 首页 导航栏 分类 系列等使用文档")]),n("li",null,[n("a",q,[s("Vuepress 2.x 官网"),t(a)]),s("): 功能配置 插件等使用文档")])]),h,n("p",null,[s("参考:"),n("a",y,[s("Git 基本操作 | 菜鸟教程 (runoob.com)"),t(a)])]),x,n("p",null,[s("参考: "),n("a",f,[s("git提交或克隆报错"),t(a)])]),_])}const E=p(l,[["render",M],["__file","Vuepress.html.vue"]]);export{E as default};
