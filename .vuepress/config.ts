import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  lang: 'zh-CN',
  title: "阿派 | Apai Blog",
  description: "Just playing around",

  // 文档设置
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "LuisApai",
    authorAvatar: "/head.jpg",
    docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",

    // 自定义目录标题
    catalogTitle: '文章层级目录',

    // 自动设置分类
    // autoSetBlogCategories: true,
    // 自动将分类和标签添加至头部导航条
    // autoAddCategoryToNavbar: true,
    // 自动设置系列
    autoSetSeries: true,

    // 顶部导航栏
    navbar: [
      { text: "Home", link: "/" },
      { text: "分类组", link: "/categories/reco/1/" },
      { text: "标签组", link: "/tags/tag1/1/" },
      {
        text: "文档组",
        children: [
          { text: "Web-开发", link: "/docs/Web-develop/Html-Js" },
          { text: "Java-开发", link: "/docs/Java-develop/JavaMyUtil" },
          { text: "Linux-系统", link: "/docs/Linux-develop/Linux" },
          { text: "其他", link: "/docs/Rests-docs/vue" },
          { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
        ],
      },
      { text: "关于我", link: "/blogs/other/guide" },
    ],

    // 文档组 的系列栏
    series: {
      // Java-开发
      "/docs/Java-develop/": [
        {
          text: "Java 笔记",
          children: [
            "JavaMyUtil", "Java-basics", "JavaJinJie02", "JavaGongNeng03", "JavaBiKeng04",
          ],
        },
        {
          text: "MySql 数据库",
          children: [
            "MySql",
          ],
        },
        {
          text: "Java 框架",
          children: [
            "Spring", "SpringPeiZhi", "MyBatisPlus", "SpringSecurity",
          ],
        },
        {
          text: "微服务",
          children: [
            "SpringConfig", "Redis", "RabbitMQ",
          ],
        },
      ],
      // Web-开发
      "/docs/Web-develop/": [
        {
          text: "前端 基础",
          children: [
            "Html-Js",
          ],
        },
        {
          text: "Web 框架", // 分栏名称
          children: [ // 栏目组 文档
            "Vue-basics","Angular",
          ],
        },
        {
          text: "前端 组件",
          children: [
            "ElementUI",
          ],
        },
      ],
      // Linux-系统
      "/docs/Linux-develop/": [
        {
          text: "Linux 基础",
          children: [
            "Linux",
          ],
        },
        {
          text: "Linux 安装",
          children: [
            "Linux",
          ],
        },
      ],

      // --- 其他组 设置
      "/docs/Rests-docs/": [
        {
          text: "前端",
          children: [
              "Vue2","Vue",
          ],
        },
        {
          text: "后端",
          children: [
              "java", "MySql"
          ],
        },
        {
          text: "Linux",
          children: [
              "Linux"
          ],
        },
      ],
    },

    // 右侧公告栏 bulletin
    // bulletin: {
    //   body: [
    //     {
    //       type: "text",
    //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "QQ 群",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li>QQ群1：1037296104</li>
    //         <li>QQ群2：1061561395</li>
    //         <li>QQ群3：962687802</li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "GitHub",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "buttongroup",
    //       children: [
    //         {
    //           text: "打赏",
    //           link: "/docs/others/donate.html",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // valineConfig 配置与 1.x 一致
    // valineConfig: {
    //   appId: 'xxx',
    //   appKey: 'xxx',
    //   placeholder: '填写邮箱可以收到回复提醒哦！',
    //   verify: true, // 验证码服务
    //   // notify: true,
    //   recordIP: true,
    //   // hideComments: true // 隐藏评论
    // },
  }),
  // debug: true,
});
