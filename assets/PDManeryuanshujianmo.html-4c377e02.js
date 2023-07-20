import{_ as t,p as o,q as e,s as n,R as s,t as p,Y as c,n as l}from"./framework-e1bed10d.js";const i={},u=n("h2",{id:"pdmaner-元数建模",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#pdmaner-元数建模","aria-hidden":"true"},"#"),s(" PDManer 元数建模")],-1),r=n("h3",{id:"pdmaner-介绍",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#pdmaner-介绍","aria-hidden":"true"},"#"),s(" PDManer 介绍")],-1),k=n("li",null,"PDManer元数建模，是一款多操作系统开源免费的桌面版关系数据库模型建模工具",-1),d={href:"https://gitee.com/robergroup/pdmaner",target:"_blank",rel:"noopener noreferrer"},v={href:"https://gitee.com/robergroup/pdmaner",target:"_blank",rel:"noopener noreferrer"},m={href:"https://gitee.com/robergroup/pdmaner/releases",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.yuque.com/pdmaner/docs",target:"_blank",rel:"noopener noreferrer"},f=c(`<p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230711143354897.png" alt="image-20230711143354897"></p><h3 id="mapper-xml-模板" tabindex="-1"><a class="header-anchor" href="#mapper-xml-模板" aria-hidden="true">#</a> Mapper.xml 模板</h3><ul><li>生成数据库表所有字段的查询和判断条件查询</li><li>批量新增</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">{</span><span class="token punctuation">{</span>  <span class="token keyword">var</span> today<span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> fullYear<span class="token operator">=</span>today<span class="token punctuation">.</span><span class="token function">getFullYear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> month<span class="token operator">=</span>today<span class="token punctuation">.</span><span class="token function">getMonth</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> days<span class="token operator">=</span>today<span class="token punctuation">.</span><span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token keyword">var</span> pkVarName <span class="token operator">=</span> <span class="token string">&quot;undefinedId&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> pkDataType <span class="token operator">=</span> <span class="token string">&quot;String&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> pkField <span class="token operator">=</span> <span class="token string">&quot;UNDEFINED_ID&quot;</span><span class="token punctuation">;</span>
    it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token function">function</span><span class="token punctuation">(</span>field<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>primaryKey<span class="token punctuation">)</span><span class="token punctuation">{</span>
            pkField <span class="token operator">=</span> field<span class="token punctuation">.</span>defKey<span class="token punctuation">;</span>
            pkVarName <span class="token operator">=</span> it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            pkDataType <span class="token operator">=</span> field<span class="token punctuation">[</span><span class="token string">&quot;type&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token keyword">var</span> pkgName <span class="token operator">=</span> it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>env<span class="token punctuation">.</span>base<span class="token punctuation">.</span>nameSpace<span class="token punctuation">;</span>
    <span class="token keyword">var</span> beanClass <span class="token operator">=</span> it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>env<span class="token punctuation">.</span>base<span class="token punctuation">.</span>codeRoot<span class="token punctuation">;</span>
    <span class="token keyword">var</span> beanVarName <span class="token operator">=</span> beanClass<span class="token punctuation">.</span><span class="token function">charAt</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span>beanClass<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> serviceClass <span class="token operator">=</span> beanClass<span class="token operator">+</span>&#39;<span class="token class-name">Service</span>&#39;<span class="token punctuation">;</span>
    <span class="token keyword">var</span> serviceVarName<span class="token operator">=</span> beanVarName<span class="token operator">+</span>&#39;<span class="token class-name">Service</span>&#39;<span class="token punctuation">;</span>
    
<span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">?</span>xml version<span class="token operator">=</span><span class="token string">&quot;1.0&quot;</span> encoding<span class="token operator">=</span><span class="token string">&quot;UTF-8&quot;</span><span class="token operator">?</span><span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">!</span><span class="token constant">DOCTYPE</span> mapper <span class="token constant">PUBLIC</span> <span class="token string">&quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span> <span class="token string">&quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;</span><span class="token operator">&gt;</span>
$blankline

<span class="token operator">&lt;</span>mapper namespace<span class="token operator">=</span><span class="token string">&quot;{{=pkgName}}.mapper.{{=beanClass}}Mapper&quot;</span><span class="token operator">&gt;</span>
     
    $blankline
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 查询的数据字段 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>sql id<span class="token operator">=</span><span class="token string">&quot;select&quot;</span><span class="token operator">&gt;</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">function</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token char">&#39;a.&#39;</span> <span class="token operator">+</span> it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token char">&#39; &lt;!-- &#39;</span> <span class="token operator">+</span> it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>defName<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token operator">+</span> &#39; <span class="token operator">--</span><span class="token operator">&gt;</span>\\n        &#39;<span class="token punctuation">}</span>
        <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token char">&#39;,&#39;</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>sql<span class="token operator">&gt;</span>
    
    $blankline
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 查询所有数据列表 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>select id<span class="token operator">=</span><span class="token string">&quot;list{{=beanClass}}&quot;</span> resultType<span class="token operator">=</span><span class="token string">&quot;com.my.pin.vo.sanitary.PurchaseInquiryVo&quot;</span><span class="token operator">&gt;</span>
        <span class="token constant">SELECT</span>
            <span class="token operator">&lt;</span>include refid<span class="token operator">=</span><span class="token string">&quot;select&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>
        <span class="token constant">FROM</span>
            <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>defKey<span class="token punctuation">}</span><span class="token punctuation">}</span> a
        <span class="token class-name">WHERE</span> <span class="token number">1</span> <span class="token operator">=</span> <span class="token number">1</span>
            <span class="token operator">&lt;</span>include refid<span class="token operator">=</span><span class="token string">&quot;selectWhere&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>
        order by a<span class="token punctuation">.</span>id desc
    <span class="token operator">&lt;</span><span class="token operator">/</span>select<span class="token operator">&gt;</span>
    
     $blankline
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 批量新增数据 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>insert id<span class="token operator">=</span><span class="token string">&quot;insertBatch{{=beanClass}}&quot;</span> keyProperty<span class="token operator">=</span><span class="token string">&quot;{{=pkField}}&quot;</span> useGeneratedKeys<span class="token operator">=</span><span class="token string">&quot;true&quot;</span><span class="token operator">&gt;</span>
        insert into <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>defKey<span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">function</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token keyword">return</span> e<span class="token punctuation">.</span>defKey<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token char">&#39;,&#39;</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
        values
        <span class="token operator">&lt;</span>foreach collection<span class="token operator">=</span><span class="token string">&quot;entities&quot;</span> item<span class="token operator">=</span><span class="token string">&quot;entity&quot;</span> separator<span class="token operator">=</span><span class="token string">&quot;,&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">function</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token keyword">return</span> &#39;#<span class="token punctuation">{</span>entity<span class="token punctuation">.</span>&#39;<span class="token operator">+</span>it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token char">&#39;}&#39;</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token char">&#39;,&#39;</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>foreach<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>insert<span class="token operator">&gt;</span>
    
    $blankline
    <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> 查询的数据条件 <span class="token operator">--</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>sql id<span class="token operator">=</span><span class="token string">&quot;selectWhere&quot;</span><span class="token operator">&gt;</span>
    <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token operator">:</span>field<span class="token operator">:</span>index<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>defName<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token operator">--</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token keyword">if</span> test<span class="token operator">=</span><span class="token string">&quot;{{=it.func.camel(field.defKey,false)}} != null and {{=it.func.camel(field.defKey,false)}} != &#39;&#39;&quot;</span><span class="token operator">&gt;</span>
            and <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>field<span class="token punctuation">.</span>defKey<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token operator">=</span> #<span class="token punctuation">{</span>entity<span class="token punctuation">.</span><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span><span class="token keyword">if</span><span class="token operator">&gt;</span>
    <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>sql<span class="token operator">&gt;</span>
    
<span class="token operator">&lt;</span><span class="token operator">/</span>mapper<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230712171314408.png" alt="image-20230712171314408"></p><h3 id="web-list-前端列表" tabindex="-1"><a class="header-anchor" href="#web-list-前端列表" aria-hidden="true">#</a> Web-List 前端列表</h3><ul><li>码云项目的前端列表生成</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>$blankline
export <span class="token keyword">const</span> tableColumn<span class="token operator">:</span> <span class="token class-name">STColumnDrop</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        title<span class="token operator">:</span> <span class="token char">&#39;序号&#39;</span><span class="token punctuation">,</span>
        index<span class="token operator">:</span> <span class="token char">&#39;index&#39;</span><span class="token punctuation">,</span>
        type<span class="token operator">:</span> <span class="token char">&#39;no&#39;</span><span class="token punctuation">,</span>
        fixed<span class="token operator">:</span> <span class="token char">&#39;left&#39;</span><span class="token punctuation">,</span>
        width<span class="token operator">:</span> <span class="token number">70</span><span class="token punctuation">,</span>
        exported<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        iif<span class="token operator">:</span> <span class="token punctuation">(</span>item<span class="token operator">:</span> <span class="token class-name">STColumn</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token operator">!</span><span class="token operator">!</span>item<span class="token punctuation">.</span>exported<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>

<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token operator">:</span>field<span class="token operator">:</span>index<span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token punctuation">{</span>
        title<span class="token operator">:</span> &#39;<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>field<span class="token punctuation">.</span>defName<span class="token punctuation">}</span><span class="token punctuation">}</span>&#39;<span class="token punctuation">,</span>
        index<span class="token operator">:</span> &#39;<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span>&#39;<span class="token punctuation">,</span>
        width<span class="token operator">:</span> <span class="token number">120</span><span class="token punctuation">,</span>
        exported<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        iif<span class="token operator">:</span> <span class="token punctuation">(</span>item<span class="token operator">:</span> <span class="token class-name">STColumn</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> <span class="token operator">!</span><span class="token operator">!</span>item<span class="token punctuation">.</span>exported
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230712171359679.png" alt="image-20230712171359679"></p><h3 id="web-from-前端表单" tabindex="-1"><a class="header-anchor" href="#web-from-前端表单" aria-hidden="true">#</a> Web-from 前端表单</h3><ul><li>码云项目的前端表单生成</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>$blankline
export <span class="token keyword">const</span> formSchema<span class="token operator">:</span> <span class="token class-name">SFSchema</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    properties<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token operator">:</span>field<span class="token operator">:</span>index<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>field<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">:</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token char">&#39;string&#39;</span><span class="token punctuation">,</span> title<span class="token operator">:</span> &#39;<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>field<span class="token punctuation">.</span>defName<span class="token punctuation">}</span><span class="token punctuation">}</span>&#39; <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">~</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    required<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">=</span>it<span class="token punctuation">.</span>entity<span class="token punctuation">.</span>fields<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">function</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token char">&#39;a.&#39;</span> <span class="token operator">+</span> it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>defKey<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token char">&#39; // &#39;</span> <span class="token operator">+</span> it<span class="token punctuation">.</span>func<span class="token punctuation">.</span><span class="token function">camel</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>defName<span class="token punctuation">,</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token operator">+</span> &#39;\\n        &#39;<span class="token punctuation">}</span>
        <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token char">&#39;,&#39;</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    ui<span class="token operator">:</span> <span class="token punctuation">{</span>
        spanLabel<span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
        spanControl<span class="token operator">:</span> <span class="token number">14</span><span class="token punctuation">,</span>
        grid<span class="token operator">:</span> <span class="token punctuation">{</span>
          span<span class="token operator">:</span> <span class="token number">8</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230712171447991.png" alt="image-20230712171447991"></p>`,13);function g(h,y){const a=l("ExternalLinkIcon");return o(),e("div",null,[u,r,n("ul",null,[k,n("li",null,[s("PDManer: "),n("a",d,[s("Gitee仓库下载地址"),p(a)]),s(),n("a",v,[s("代码生成模板参考"),p(a)]),s(),n("a",m,[s("下载地址 "),p(a)]),s(),n("a",b,[s("操作手册"),p(a)])])]),f])}const w=t(i,[["render",g],["__file","PDManeryuanshujianmo.html.vue"]]);export{w as default};