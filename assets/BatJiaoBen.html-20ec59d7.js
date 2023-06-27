import{_ as n,p as i,q as s,Y as e}from"./framework-e1bed10d.js";const a={},l=e(`<h2 id="bat-命令" tabindex="-1"><a class="header-anchor" href="#bat-命令" aria-hidden="true">#</a> .bat 命令</h2><h3 id="基础命令" tabindex="-1"><a class="header-anchor" href="#基础命令" aria-hidden="true">#</a> 基础命令</h3><div class="language-JAVA line-numbers-mode" data-ext="JAVA"><pre class="language-JAVA"><code>// 备注
@REM 后面的为备注内容

// 关闭在运行批处理时显示命令行窗口的回显功能
@echo off
    
// 在 cmd 输入 Path 变量的值 调用变量: &quot;%Path%&quot; 拼接: %fileName%/%fileName%-%home%
set /p Path = 提示语句

// 获取 Path 变量的值 进入指定路径的文件夹内
cd /d &quot;%Path%&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 设置变量 set 变量名 = 变量值</span>
set home <span class="token operator">=</span> aaaa
    
<span class="token comment">// xcopy /s /e &quot;源文件夹路径&quot; &quot;目标文件夹路径&quot; </span>
<span class="token comment">// 其中，/s 表示复制子目录和文件，/e 表示包括空的子目录 /y参数告诉xcopy命令覆盖任何现有文件而不提示</span>
<span class="token comment">// 例如，xcopy /s /e &quot;C:\\Folder1&quot; &quot;D:\\Folder2&quot; 将 C:\\Folder1 中的所有内容复制到 D:\\Folder2，可以使用以下命令：</span>
<span class="token comment">// 相同文件会询问是否覆盖</span>
xcopy <span class="token operator">/</span>s <span class="token operator">/</span>e <span class="token string">&quot;C:\\Tools\\test&quot;</span> <span class="token string">&quot;C:\\Tools\\cptest&quot;</span>   
xcopy <span class="token operator">/</span>s <span class="token operator">/</span>y <span class="token string">&quot;C:\\Tools\\test&quot;</span> <span class="token string">&quot;C:\\Tools\\cptest&quot;</span>

<span class="token comment">// 判断ifDetial变量是否为 Y 是则进入执行</span>
set <span class="token operator">/</span>p ifDetial<span class="token operator">=</span>shengchen detail is <span class="token class-name">Y</span><span class="token operator">/</span><span class="token class-name">N</span> <span class="token operator">?</span> 
<span class="token keyword">if</span> <span class="token string">&quot;%ifDetial%&quot;</span><span class="token operator">==</span><span class="token string">&quot;Y&quot;</span> <span class="token punctuation">(</span>
    call ng g c <span class="token operator">%</span>fileName<span class="token operator">%</span><span class="token operator">/</span><span class="token operator">%</span>fileName<span class="token operator">%</span><span class="token operator">-</span><span class="token operator">%</span>detail<span class="token operator">%</span>
<span class="token punctuation">)</span>
    
<span class="token comment">// 跳转到 end 标签位置</span>
<span class="token keyword">goto</span> end
<span class="token comment">// 设置跳转标签</span>
<span class="token operator">:</span>end
    
<span class="token comment">// 终止脚本</span>
exit
  
<span class="token comment">// 打印提示语句 | echo 提示内容</span>
echo <span class="token class-name">Component</span> generated successfully <span class="token constant">OKK</span> <span class="token operator">--</span> <span class="token class-name">Apai</span>
    
<span class="token comment">// 点击任意按钮结束</span>
pause

<span class="token comment">// 获取当前文件的所在目录地址 %~dp0</span>
set modulePath<span class="token operator">=</span><span class="token operator">%</span><span class="token operator">~</span>dp0
<span class="token comment">// 变量拼接</span>
set modulePackPath<span class="token operator">=</span><span class="token string">&quot;%modulePath%&quot;</span>\\<span class="token punctuation">.</span>vuepress\\dist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="bat-避坑指南" tabindex="-1"><a class="header-anchor" href="#bat-避坑指南" aria-hidden="true">#</a> Bat 避坑指南</h2><h3 id="cmd-窗口中文乱码" tabindex="-1"><a class="header-anchor" href="#cmd-窗口中文乱码" aria-hidden="true">#</a> Cmd 窗口中文乱码</h3><blockquote><p>出现在Windows中使用的默认编码格式与.bat脚本中的编码格式不同导致的</p></blockquote><ol><li>将.bat脚本的编码格式修改为与您的Windows系统默认编码格式一致（例如UTF-8或GB2312,您可以使用文本编辑器（如Notepad++）打开脚本并更改编码格式，然后保存文件。</li><li>在运行.bat脚本之前，在命令窗口中输入以下命令：<code>chcp 65001</code>。这将把命令窗口的编码格式切换为UTF-8，以便正确显示中文字符。</li></ol><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@echo off

@REM 解决中文乱码
chcp 65001

:start
@REM 输入 提交信息
@REM set /p prot=&quot;APP is prot : ... ? &quot;
set /p prot=&quot;需要关闭的端口是: ... ? &quot;
netstat -ano | findstr :&quot;%prot%&quot;
FOR /F &quot;tokens=5 delims= &quot; %%P IN (&#39;netstat -ano ^| findstr :%prot%&#39;) DO SET PID=%%P
IF &quot;%PID%&quot; == &quot;&quot; (
    ECHO Unable to find process ID for port %PORT_NUMBER%
) ELSE (
    ECHO Process ID for port %PORT_NUMBER% is %PID%
    taskkill -PID %PID% -F 
)
set /p goto= public bool KeepRunning: Y/N ? 
if &quot;%goto%&quot;==&quot;Y&quot; (
    goto start
)
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="批量生成-angular-组件" tabindex="-1"><a class="header-anchor" href="#批量生成-angular-组件" aria-hidden="true">#</a> 批量生成 Angular 组件</h2><h3 id="安装-angular-框架" tabindex="-1"><a class="header-anchor" href="#安装-angular-框架" aria-hidden="true">#</a> 安装 Angular 框架</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 打开命令提示符窗口或终端 运行以下命令来安装 Angular CLI：</span>
npm install <span class="token operator">-</span>g <span class="token annotation punctuation">@angular</span><span class="token operator">/</span>cli
<span class="token comment">// 等待安装完成后，可以通过运行以下命令来验证安装是否成功：</span>
ng version
<span class="token comment">// 如果显示了 Angular CLI 的版本信息，则表示安装成功。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span>Apai_Lu<span class="token operator">&gt;</span>npm <span class="token function">install</span> <span class="token parameter variable">-g</span> @angular/cli
<span class="token function">npm</span> WARN deprecated @npmcli/move-file@2.0.1: This functionality has been moved to @npmcli/fs

added <span class="token number">256</span> packages <span class="token keyword">in</span> 13s

C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span>Apai_Lu<span class="token operator">&gt;</span>ng version
? Would you like to share pseudonymous usage data about this project with the Angular Team
at Google under Google<span class="token string">&#39;s Privacy Policy at https://policies.google.com/privacy. For more
details and how to change this setting, see https://angular.io/analytics. No
Global setting: disabled
Local setting: No local workspace configuration file.
Effective status: disabled
     _                      _                 ____ _     ___
    / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \\ | &#39;</span>_ <span class="token punctuation">\\</span> / _<span class="token variable"><span class="token variable">\`</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span>/ _<span class="token variable">\`</span></span> <span class="token operator">|</span> &#39;__<span class="token operator">|</span>   <span class="token operator">|</span> <span class="token operator">|</span>   <span class="token operator">|</span> <span class="token operator">|</span>    <span class="token operator">|</span> <span class="token operator">|</span>
  / ___ <span class="token punctuation">\\</span><span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token punctuation">(</span>_<span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span>_<span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token punctuation">(</span>_<span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span>      <span class="token operator">|</span> <span class="token operator">|</span>___<span class="token operator">|</span> <span class="token operator">|</span>___ <span class="token operator">|</span> <span class="token operator">|</span>
 /_/   <span class="token punctuation">\\</span>_<span class="token punctuation">\\</span>_<span class="token operator">|</span> <span class="token operator">|</span>_<span class="token operator">|</span><span class="token punctuation">\\</span>__, <span class="token operator">|</span><span class="token punctuation">\\</span>__,_<span class="token operator">|</span>_<span class="token operator">|</span><span class="token punctuation">\\</span>__,_<span class="token operator">|</span>_<span class="token operator">|</span>       <span class="token punctuation">\\</span>____<span class="token operator">|</span>_____<span class="token operator">|</span>___<span class="token operator">|</span>
                <span class="token operator">|</span>___/
Angular CLI: <span class="token number">16.0</span>.1
Node: <span class="token number">18.12</span>.1
Package Manager: <span class="token function">npm</span> <span class="token number">8.19</span>.2
OS: win32 x64

Angular:
<span class="token punctuation">..</span>.
Package                      Version
------------------------------------------------------
@angular-devkit/architect    <span class="token number">0.1600</span>.1 <span class="token punctuation">(</span>cli-only<span class="token punctuation">)</span>
@angular-devkit/core         <span class="token number">16.0</span>.1 <span class="token punctuation">(</span>cli-only<span class="token punctuation">)</span>
@angular-devkit/schematics   <span class="token number">16.0</span>.1 <span class="token punctuation">(</span>cli-only<span class="token punctuation">)</span>
@schematics/angular          <span class="token number">16.0</span>.1 <span class="token punctuation">(</span>cli-only<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写-bat-脚本" tabindex="-1"><a class="header-anchor" href="#编写-bat-脚本" aria-hidden="true">#</a> 编写 .bat 脚本</h3><blockquote><p>1.0 基础版</p></blockquote><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能
@echo off

@REM 解决中文乱码
chcp 65001

@REM 询问用户生成的模块 存放路径 例如: F:\\Mayun\\Mayun_sanitary_web\\src\\pages\\finance
set /p filePath=wen jian lu jian ? 
@REM 询问用户生成的模块 名称 例如: aaa-bbb
set /p fileName=wen jian ming cheng ? 

@REM 进入需要生成的模块路径文件夹内
cd /d &quot;%filePath%&quot;
@REM 创建组件 主页面
call ng g c %fileName%/&quot;%fileName%&quot;

@REM 创建组件 增改框
set operate=operate
call ng g c %fileName%/%fileName%-%operate%

@REM 组件名称拼接的变量
set home=home
set detail=detail
set choice=choice

@REM 判断是否生成 home 双页面组件
set /p ifHome=shengchen home is Y/N ? 
if &quot;%ifHome%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%home%
)

@REM 判断是否生成 详情页组件
set /p ifDetial=shengchen detail is Y/N ? 
if &quot;%ifDetial%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%detail%
)

@REM 判断是否生成 choice 选入框
set /p ifChoice=shengchen choice is Y/N ? 
if &quot;%ifChoice%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%choice%
)

@REM 判断是否生成 模块的Api服务
set /p ifApi=shengchen choice is Y/N ? 
if &quot;%ifApi%&quot;==&quot;N&quot; (
    REM 跳转到结束标签
    goto end
)

@REM 询问用户生成的模块的Api服务 路径 例如: F:\\Mayun\\Mayun_sanitary_web\\src\\api\\finance
set /p apiPath=mo kuai Api lu jing ? 

@REM 进入需要生成的模块路径文件夹内 备注: 小bug
cd &quot;%apiPath%&quot;
call ng g s %fileName%/%fileName%

@REM goto的跳转标签
:end

@REM 执行完毕 生成成功后显示提示
echo Component generated successfully OKK -- Apai
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>2.0 提示中文化</p></blockquote><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能
@echo off

@REM 解决中文乱码
chcp 65001

echo 卢卢卢的提示: 默认自动生成 主页面及详情页面 !!!

@REM 询问用户生成的模块 存放路径 例如: F:\\Mayun\\Mayun_sanitary_web\\src\\pages\\finance
set /p filePath=指定 该模块 的存放路径: ...... ? 
@REM 询问用户生成的模块 名称 例如: aaa-bbb
set /p fileName=指定 该模块 的名称: ...... ? 

@REM 进入需要生成的模块路径文件夹内
cd /d &quot;%filePath%&quot;
@REM 创建组件 主页面
call ng g c %fileName%/&quot;%fileName%&quot;

@REM 创建组件 增改框
set operate=operate
call ng g c %fileName%/%fileName%-%operate%

@REM 组件名称拼接的变量
set home=home
set detail=detail
set choice=choice

@REM 判断是否生成 home 双页面组件
set /p ifHome=是否生成标签的 Home 页面: ... Y/N ? 
if &quot;%ifHome%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%home%
)

@REM 判断是否生成 详情页组件
set /p ifDetial=是否生成 Detail 子页面: ... Y/N ? 
if &quot;%ifDetial%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%detail%
)

@REM 判断是否生成 choice 选入框
set /p ifChoice=是否生成 Choice 选入框页面: ... Y/N ? 
if &quot;%ifChoice%&quot;==&quot;Y&quot; (
    call ng g c %fileName%/%fileName%-%choice%
)

@REM 判断是否生成 模块的Api服务
set /p ifApi=是否生成 ApiFile 接口文件: ... Y/N ? 
if &quot;%ifApi%&quot;==&quot;N&quot; (
    REM 跳转到结束标签
    goto end
)

@REM 询问用户生成的模块的Api服务 路径 例如: F:\\Mayun\\Mayun_sanitary_web\\src\\api\\finance
set /p apiPath=生成 ApiFile 接口文件的路径为: ... ? 

@REM 进入需要生成的模块路径文件夹内 备注: 小bug
cd &quot;%apiPath%&quot;
call ng g s %fileName%/%fileName%

@REM goto的跳转标签
:end

@REM 执行完毕 生成成功后显示提示
echo 超帅的好嘛, 生成脚本执行完毕 OKK -- Apai
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="一键提交git" tabindex="-1"><a class="header-anchor" href="#一键提交git" aria-hidden="true">#</a> 一键提交Git</h2><ul><li>先安装Git管理</li><li>cd 切换目录时 : 路径中文无法识别，所以需要转换为英文 或者 放到仓库根目录下</li><li>提交弹出登录框 只需登录一次 后续无需登录</li><li>&quot;%commit_message%&quot; 不能为中文标点</li></ul><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@echo off

@REM 解决中文乱码
chcp 65001

@REM 输入 提交信息
set /p commit_message=&quot;提交信息 commit -m 为: ... ? &quot;

@REM 路径中文无法识别，所以需要转换为英文 或者 放到仓库根目录下
@REM cd /d C:\\阿派_文件夹\\Gitee_Apai\\Typora_MD

@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .  
@REM 将暂存区所有文件进行本地提交
git commit -m “%commit_message%”  
@REM 上传远程仓库
git push

pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="一键提交-网站-git-脚本" tabindex="-1"><a class="header-anchor" href="#一键提交-网站-git-脚本" aria-hidden="true">#</a> 一键提交 网站 Git 脚本</h2><h3 id="基础版" tabindex="-1"><a class="header-anchor" href="#基础版" aria-hidden="true">#</a> 基础版</h3><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能
@echo off

@REM 输入提示信息
set /p commit_message=&quot;git commit -m ... ?&quot;

@REM ---------------------------- 第一部分提交 ---------------------------------
@REM 进入 项目 模块 
@REM 阿派: F:\\Gitee-Bolg 码云: C:\\Tools\\Gitee_LuisApai
@REM cd /d F:\\Gitee-Bolg
cd /d C:\\Tools\\Gitee_LuisApai

@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .  
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push

@REM 执行完毕 生成成功后显示提示
echo Gitee Bolg MD --&gt; puls OKK !

@REM ---------------------------- 第二部分提交 ---------------------------------

@REM 进入 项目打包 模块
@REM 阿派: F:\\Gitee-Bolg\\.vuepress\\ApaiBolg 码云: C:\\Tools\\Gitee_LuisApai\\.vuepress\\ApaiBolg
@REM cd /d F:\\Gitee-Bolg\\.vuepress\\ApaiBolg
cd /d C:\\Tools\\Gitee_LuisApai\\.vuepress\\ApaiBolg

@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .  
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push


@REM 执行完毕 生成成功后显示提示
echo Gitee Bolg WEB --&gt; puls OKK !
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改版-自动拷贝" tabindex="-1"><a class="header-anchor" href="#修改版-自动拷贝" aria-hidden="true">#</a> 修改版 自动拷贝</h3><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能
@echo off

@REM 输入提示信息
set /p commit_message=&quot;git commit -m ... ?&quot;

@REM 设置变量 set 变量名 = 变量值 模块 Git打包 模块打包路径
set modulePath=C:\\Tools\\Gitee_LuisApai
set packPath=C:\\Tools\\Gitee_LuisApai\\.vuepress\\ApaiBolg
set modulePackPath=C:\\Tools\\Gitee_LuisApai\\.vuepress\\dist

@REM ---------------------------- 第一部分提交 ---------------------------------
@REM 进入 项目 模块 
cd /d &quot;%modulePath%&quot;

@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .  
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push

@REM 执行完毕 生成成功后显示提示
echo Gitee Bolg MD --&gt; puls OKK !

@REM @REM ---------------------------- 第二部分提交 ---------------------------------

@REM xcopy /s /e &quot;源文件夹路径&quot; &quot;目标文件夹路径&quot; 其中，/s 表示复制子目录和文件，/e 表示包括空的子目录 /y参数告诉xcopy命令覆盖任何现有文件而不提示
@REM 例如，xcopy /s /e &quot;C:\\Folder1&quot; &quot;D:\\Folder2&quot; 将 C:\\Folder1 中的所有内容复制到 D:\\Folder2，可以使用以下命令：
xcopy /s /y &quot;%modulePackPath%&quot; &quot;%packPath%&quot;


@REM 进入 项目打包 模块
@REM cd /d F:\\Gitee-Bolg\\.vuepress\\ApaiBolg
cd /d &quot;%packPath%&quot;
@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .  
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push


@REM 执行完毕 生成成功后显示提示
echo Gitee Bolg WEB --&gt; puls OKK !
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="打包-github-3-0-版" tabindex="-1"><a class="header-anchor" href="#打包-github-3-0-版" aria-hidden="true">#</a> 打包 GitHub 3.0 版</h3><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能 自动拷贝 Git提交版
@echo off

@REM 设置变量 set 变量名 = 变量值 模块 Git打包 模块打包路径
set modulePath=%~dp0

@REM ---------------------------- 1. 进入文件所在目录 ---------------------------------
@REM 进入 项目 模块
cd /d &quot;%modulePath%&quot;

@REM 进行 项目 模块打包
npm run build

@REM @REM ---------------------------- 2. 执行完毕 ---------------------------------
@REM 执行完毕 生成成功后显示提示
echo da bao --&gt; is OKK !
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@REM 关闭在运行批处理时显示命令行窗口的回显功能 自动拷贝 Git提交版
@echo off

@REM 解决中文乱码
chcp 65001

@REM 设置变量 set 变量名 = 变量值 模块 Git打包 模块打包路径
set modulePath=%~dp0
set modulePackPath=&quot;%modulePath%&quot;\\.vuepress\\dist
set packPath=&quot;%modulePath%&quot;\\.vuepress\\ApaiBolg
set githubPath=&quot;%modulePath%&quot;\\.vuepress\\GithubBolg

@REM ---------------------------- 1. 进入文件所在目录 ---------------------------------
@REM 进入 项目 模块
cd /d &quot;%modulePath%&quot;

@REM 进行 项目 模块打包 (打完包会自动退出 拆开运行)
@REM npm run build

@REM 输入提示信息
set /p commit_message=&quot;提交信息 commit -m 为: ... ?&quot;

@REM @REM ---------------------------- 2. 复制文件 ---------------------------------
@REM xcopy /s /e &quot;源文件夹路径&quot; &quot;目标文件夹路径&quot; 其中，/s 表示复制子目录和文件，/e 表示包括空的子目录 /y参数告诉xcopy命令覆盖任何现有文件而不提示
@REM 例如，xcopy /s /e &quot;C:\\Folder1&quot; &quot;D:\\Folder2&quot; 将 C:\\Folder1 中的所有内容复制到 D:\\Folder2，可以使用以下命令：
xcopy /s /y &quot;%modulePackPath%&quot; &quot;%packPath%&quot;
xcopy /s /y &quot;%modulePackPath%&quot; &quot;%githubPath%&quot;

@REM ---------------------------- 3. 提交 Gitee 项目源文件 ---------------------------------
@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push

@REM 执行完毕 生成成功后显示提示
echo Gitee Bolg MD --&gt; puls OKK !

@REM @REM ---------------------------- 4. 提交 Gitee 打包文件 ---------------------------------
@REM 进入 Gitee 打包 模块
@REM cd /d F:\\Gitee-Bolg\\.vuepress\\ApaiBolg
cd /d &quot;%packPath%&quot;
@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push

@REM @REM ---------------------------- 4. 提交 Github 打包文件 ---------------------------------
@REM 进入 Github 打包 模块
cd /d &quot;%githubPath%&quot;
@REM 初始化仓库
git init
@REM 将所有文件添加到暂存区
git add .
@REM 将暂存区所有文件进行本地提交
git commit -m &quot;%commit_message%&quot;
@REM 上传远程仓库
git push

@REM @REM ---------------------------- 6. 执行完毕 ---------------------------------
@REM 执行完毕 生成成功后显示提示
echo 执行完毕 生成成功 Gitee Bolg WEB --&gt; puls OKK !
@REM 点击任意按钮结束
pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="一键关闭端口" tabindex="-1"><a class="header-anchor" href="#一键关闭端口" aria-hidden="true">#</a> 一键关闭端口</h2><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@echo off

@REM 解决中文乱码
chcp 65001

:start

@REM 输入 提交信息
@REM set /p prot=&quot;APP is prot : ... ? &quot;
set /p prot=&quot;超帅的好嘛, 需要关闭的端口是: ... ? &quot;

@REM 打印端口休息
netstat -ano | findstr :&quot;%prot%&quot;

@REM 根据端口获取其PID
FOR /F &quot;tokens=5 delims= &quot; %%P IN (&#39;netstat -ano ^| findstr :%prot%&#39;) DO SET PID=%%P
IF &quot;%PID%&quot; == &quot;&quot; (
    ECHO 暂无端口 %prot% 的PID
) ELSE (
    @REM 获取到PID进行关闭端口
    ECHO 该端口 %prot% 的PID: %PID% 
    taskkill -PID %PID% -F 
    ECHO 该端口 %prot% 已关闭 !!!
)

@REM 
set /p goto= 是否继续关闭端口: Y/N ? 
if &quot;%goto%&quot;==&quot;Y&quot; (
	@REM 跳转到 start 标签处
    goto start
)

pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.jsdelivr.net/gh/LuJunandapai/ApaiImage@main/MaYun-PicGo/image-20230626174824068.png" alt="image-20230626174824068"></p>`,33),d=[l];function v(c,t){return i(),s("div",null,d)}const r=n(a,[["render",v],["__file","BatJiaoBen.html.vue"]]);export{r as default};
