---
title: 我的主页
date: 2023/05/04
tags:
 - Rests
categories:
 - Start
---

## 主页配置

```java
home: true
modules:
  - BannerBrand
  - Blog
  - MdContent
  - Footer
bannerBrand: # bannerBrand 模块的配置
  bgImage: '/bg.svg'
  title: Apai Blog
  description: 前路漫漫, 我相信最后是花开万里啊
  tagline: The road ahead is long, and I believe that the flowers will bloom in the end
  buttons:
    - { text: 关于我, link: '/docs/Apai-AboutMe/Lu-aboutMe' }
    - { text: My Site Description, link: '/blogs/other/ZhuYe', type: 'plain' }
  socialLinks: # 社交地址
    - { icon: 'LogoGithub', text: 'Github', link: 'https://github.com/LuJunandapai' }
    - { icon: 'StoragePool', text: '我的 Gitee', link: 'https://gitee.com/LuisApai' }
    - { icon: 'Star', text: 'CSDN', link: 'https://blog.csdn.net/m0_64903853?spm=1000.2115.3001.5343' }
    - { icon: 'Locked', text: 'hutool 工具', link: 'https://hutool.cn/docs/#/' }
    - { icon: 'StopSignFilled', text: '我的B站', link: 'https://space.bilibili.com/168090249?spm_id_from=333.1007.0.0' }
    - { icon: 'StopOutlineFilled', text: 'element 前端组件', link: 'https://element.eleme.cn/#/zh-CN' }
    - { icon: 'StopSign', text: 'MyBatis-Plus', link: 'https://www.baomidou.com/' }

blog: # blog 模块的配置
  socialLinks: # 社交地址
    - { icon: 'StormTracker', link: 'https://github.com/LuJunandapai' }
    - { icon: 'StressBreathEditor', link: 'https://gitee.com/LuisApai' }
    - { icon: 'StudyView', link: 'https://github.com/LuJunandapai' }
    - { icon: 'SubVolume', link: 'https://blog.csdn.net/m0_64903853?spm=1000.2115.3001.5343' }
footer: # 底部模块的配置
  record: 卢小小派的秘密
  recordLink: https://gitee.com/LuisApai
  cyberSecurityRecord: 没有结果的人和事 不值得啊 | 2000/10/25
  cyberSecurityLink: Lu-HuBei
  startYear: 2023
isShowTitleInHome: true
actionText: About
actionLink: /views/other/about

```

