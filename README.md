# yjmm10.github.io

Lucas（独立开发者）的个人主页，GitHub Pages 部署后访问：<https://yjmm10.github.io/>

本站是 Lucas 所有项目共用的「关于作者」页面。

## 结构

```
├── index.html        # 首页：个人简介、我的一些认识、联系与赞赏
├── projects.html     # 项目标签页：项目列表（上线后在此添加）
└── assets/
    ├── style.css     # 共享样式（含深色模式自适应，无框架无构建）
    ├── avatar.png    # 头像
    ├── wechat-qr.png # 微信加好友二维码
    └── reward-qr.png # 赞赏收款码（微信支付）
```

## 维护

- **改文案**：直接编辑 `index.html` / `projects.html` 里的文字。
- **加项目**：编辑 `projects.html`，按文件内的注释模板复制一个 `<article class="project">`。
- **换图**：替换 `assets/` 下的同名文件即可，二维码保持原尺寸、不要缩放裁剪。
- **发布**：合并到 `main` 分支并推送，GitHub Pages 自动更新。
