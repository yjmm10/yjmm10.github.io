# yjmm10.github.io

Lucas（独立开发者）的个人主页，GitHub Pages 部署后访问：<https://yjmm10.github.io/>

本站是 Lucas 所有项目共用的「关于作者」页面。**纯静态网站**：手写 HTML + CSS，无框架、无构建、无后端。

## 结构

```
├── index.html        # 首页：个人简介、我的一些认识、联系与赞赏
├── projects.html     # 项目标签页：项目列表（上线后在此添加）
├── 404.html          # GitHub Pages 自定义 404
├── robots.txt        # 爬虫规则 + sitemap 声明
├── sitemap.xml       # 站点地图
├── .nojekyll         # 跳过 GitHub Pages 的 Jekyll 构建
└── assets/
    ├── style.css     # 共享样式（含深色模式自适应）
    ├── avatar.webp   # 头像 WebP 版（34KB，页面实际加载这份）
    ├── avatar.png    # 头像 PNG 兜底（旧浏览器 fallback）
    ├── wechat-qr.png # 微信加好友二维码
    └── reward-qr.png # 赞赏收款码（微信支付）
```

## 静态站点注意事项

- **全站相对路径**：站内链接一律用 `./`、`projects.html`、`assets/...`，不要用 `/` 开头的绝对路径，这样无论挂在用户域名根路径还是项目子路径都能正常工作。
- **不要加 Service Worker 做缓存**：GitHub Pages 本身有 CDN 缓存，前端再缓存一层容易出现「改了代码访客看不到」的问题。
- **图片**：头像用 `<picture>` 优先加载 WebP；二维码必须保持原始尺寸，不要缩放裁剪，否则影响扫码。
- **没有后端**：所有交互（联系、赞赏）都通过二维码跳转微信完成，不要添加需要服务端的表单。

## 维护

- **改文案**：直接编辑 `index.html` / `projects.html` 里的文字。
- **加项目**：编辑 `projects.html`，按文件内的注释模板复制一个 `<article class="project">`。
- **换图**：替换 `assets/` 下的同名文件；换头像后记得同步更新 `avatar.webp`。
- **发布**：合并到 `main` 分支并推送，GitHub Pages 自动更新（约 1–2 分钟生效）。本地推送到 GitHub 需要走代理：

```bash
git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push origin main
```

## 本地预览

```bash
python -m http.server 4173 --bind 127.0.0.1 --directory .
# 访问 http://127.0.0.1:4173/
```


---

## 个人信息单一数据源（供其他项目引用）

个人资料统一维护在 [`profile.json`](https://yjmm10.github.io/profile.json)，其他项目引用后，信息更新只需改这一处。

### 方式一：直接读取 JSON

```js
fetch("https://yjmm10.github.io/profile.json")
  .then(r => r.json())
  .then(profile => console.log(profile.name, profile.role.zh));
```

GitHub Pages 对静态资源默认返回 `Access-Control-Allow-Origin: *`，可跨域 fetch。

### 方式二：一键嵌入名片组件

在任意网页中：

```html
<div data-lucas-profile></div>
<script src="https://yjmm10.github.io/embed.js"></script>
```

可选参数（写在 script 标签上）：

- `data-target="#选择器"`：渲染容器
- `data-lang="en|zh|auto"`：语言，默认跟随浏览器
- `data-theme="light|dark|auto"`：配色，默认跟随系统

本地预览：`http://127.0.0.1:4173/embed-demo.html`（线上：`https://yjmm10.github.io/embed-demo.html`）。

### 字段说明

| 字段 | 说明 |
| --- | --- |
| `name` / `handle` | 名字与 GitHub 用户名 |
| `role` / `slogan` / `expertise` | 中英双语（`{en, zh}`） |
| `avatar` | 头像绝对地址 |
| `links` | GitHub / 邮箱 / 微信二维码 |
| `updated` | 最后更新日期，改完记得同步 |
