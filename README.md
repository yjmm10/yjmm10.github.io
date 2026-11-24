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

## 个人信息开放数据接口（供其他项目引用）

个人资料统一维护在 **`https://yjmm10.github.io/profile.json`**，作为唯一数据源（Single Source of Truth）。其他项目、网站、小程序引用这份数据自行设计样式；信息变更只需修改主页仓库这一处，所有引用方自动同步。

### 接口地址

| 端点 | 说明 |
| --- | --- |
| `GET https://yjmm10.github.io/profile.json` | 个人信息完整数据（JSON） |
| `GET https://yjmm10.github.io/profile.schema.json` | 数据结构定义（JSON Schema，可用于校验/生成类型） |

- 返回 `Content-Type: application/json; charset=utf-8`
- 已开启跨域：`Access-Control-Allow-Origin: *`，任何网站均可直接 fetch
- GitHub Pages CDN 缓存约 10 分钟，数据更新后最多延迟几分钟生效
- 建议引用方做本地缓存/降级处理，勿高频请求

### 快速调用

```bash
curl https://yjmm10.github.io/profile.json
```

```js
const profile = await fetch("https://yjmm10.github.io/profile.json").then(r => r.json());
console.log(profile.name, profile.role.zh, profile.links.github);
```

```python
import requests
profile = requests.get("https://yjmm10.github.io/profile.json", timeout=10).json()
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` / `handle` | string | 名字 / GitHub 用户名 |
| `role` | `{en, zh}` | 身份（中英双语） |
| `avatar` | uri | 头像图片绝对地址 |
| `website` | uri | 个人主页 |
| `slogan` | `{en, zh}` | 一句话理念 |
| `expertise` | `[{en, zh}]` | 擅长领域（大类） |
| `skills` | `[{category, items}]` | 分方向的详细技能标签 |
| `projects` | `[{name, status}]` | 在搞的项目与状态 |
| `thoughts` | `[{en, zh}]` | 个人想法 |
| `links` | object | `github` / `email` / `wechat_qr` |
| `updated` | `YYYY-MM-DD` | 数据最后更新日期 |

所有文案字段均为 `{en, zh}` 双语对象，引用方按需取用（如 `profile.role.zh`）。

### 免样式嵌入组件（可选）

如果不想自己写样式，也可以直接嵌入现成的名片组件（内部同样读取 `profile.json`）：

```html
<div data-lucas-profile></div>
<script src="https://yjmm10.github.io/embed.js"></script>
```

可选参数（写在 script 标签上）：`data-target="#选择器"`、`data-lang="en|zh|auto"`、`data-theme="light|dark|auto"`。
示例：`https://yjmm10.github.io/embed-demo.html`。

### 维护约定

1. 修改个人信息时，只改本仓库的 `profile.json`（以及主页 `index.html`）。
2. 同步更新 `profile.json` 里的 `updated` 字段。
3. `embed.js` 内置的数据快照用于同步首绘；若结构或内容变化，记得一并更新其 `SNAPSHOT`。
