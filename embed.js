/*!
 * Lucas Profile Widget — 单一个人信息源
 * 用法（在任意网站的 HTML 中）：
 *   <div data-lucas-profile></div>
 *   <script src="https://yjmm10.github.io/embed.js"></script>
 * 可选参数（写在 script 标签上）：
 *   data-target="#css选择器"      渲染容器（默认依次取未使用的 [data-lucas-profile]，没有则插到脚本后面）
 *   data-lang="en|zh|auto"       显示语言（默认 auto：跟随浏览器语言）
 *   data-theme="light|dark|auto" 配色（默认 auto：跟随页面 prefers-color-scheme）
 *
 * 数据源：https://yjmm10.github.io/profile.json
 * 组件先用内置快照同步渲染（不产生加载跳动），随后拉取最新 profile.json，
 * 若有更新会自动重绘 —— 改信息只需改 profile.json 一处。
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;
  var base = (script.src || "").replace(/embed\.js.*$/, "");
  var optLang = (script.getAttribute("data-lang") || "auto").toLowerCase();
  var optTheme = (script.getAttribute("data-theme") || "auto").toLowerCase();
  var targetSel = script.getAttribute("data-target");

  /* 与 profile.json 同步的内置快照（同步渲染，避免页面顶部加载跳动） */
  var SNAPSHOT = {
    name: "Lucas",
    role: { en: "Independent Developer", zh: "独立开发者" },
    avatar: "https://yjmm10.github.io/assets/avatar.webp",
    website: "https://yjmm10.github.io/",
    slogan: {
      en: "Technology is an extension of thought, not the end in itself.",
      zh: "技术是思考的延伸，而不是目的本身"
    },
    expertise: [
      { en: "Document AI", zh: "智能文档处理" },
      { en: "GenAI Full-Stack", zh: "生成式 AI 全链开发" },
      { en: "UAV Trajectory Optimization", zh: "无人机轨迹优化" }
    ],
    links: {
      github: "https://github.com/yjmm10",
      email: "lucas4ai@outlook.com",
      wechat_qr: "https://yjmm10.github.io/assets/wechat-qr.png"
    },
    updated: "2026-11-20"
  };

  function lang() {
    if (optLang === "en" || optLang === "zh") return optLang;
    return (navigator.language || "en").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }
  function dark() {
    if (optTheme === "light") return false;
    if (optTheme === "dark") return true;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(host, data) {
    var L = lang();
    var t = function (o) { return (o && (o[L] || o.en || o.zh)) || ""; };
    var shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    var d = dark();
    var bg = d ? "#211c17" : "#fffdf8";
    var ink = d ? "#ede6da" : "#2b2620";
    var sub = d ? "#a89f90" : "#6f675c";
    var line = d ? "#3a332b" : "#e7ded0";
    var rust = d ? "#e08a5f" : "#b3502d";

    shadow.innerHTML =
      '<style>' +
      ':host{all:initial;display:block;max-width:100%}' +
      '*,*::before,*::after{box-sizing:border-box}' +
      '.card{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;width:100%;max-width:520px;padding:20px 22px;border:1px solid ' + line + ';border-radius:18px;background:' + bg + ';color:' + ink + ';box-shadow:0 10px 30px rgba(0,0,0,.08)}' +
      '.ava{display:block;width:72px;height:72px;border-radius:50%;object-fit:cover;flex:none;border:2px solid ' + rust + '33}' +
      '.body{flex:1 1 200px;min-width:0;overflow-wrap:anywhere}' +
      '.name{font-size:24px;font-weight:700;line-height:1.15}' +
      '.role{margin-top:2px;font-size:13px;color:' + rust + ';font-weight:600;letter-spacing:.04em}' +
      '.slogan{margin-top:8px;font-size:13.5px;color:' + sub + ';line-height:1.6}' +
      '.tags{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}' +
      '.tag{font-size:11.5px;padding:3px 9px;border:1px solid ' + line + ';border-radius:999px;color:' + sub + ';background:' + (d ? "#ffffff0a" : "#00000005") + '}' +
      '.links{margin-top:12px;display:flex;flex-wrap:wrap;gap:14px;font-size:13px}' +
      '.links a{color:' + rust + ';text-decoration:none;font-weight:600;white-space:nowrap}' +
      '.links a:hover{text-decoration:underline}' +
      '</style>' +
      '<div class="card">' +
      '<img class="ava" src="' + esc(data.avatar) + '" alt="' + esc(data.name) + '" width="72" height="72">' +
      '<div class="body">' +
      '<div class="name">' + esc(data.name) + '</div>' +
      '<div class="role">' + esc(t(data.role)) + '</div>' +
      (data.slogan ? '<div class="slogan">' + esc(t(data.slogan)) + '</div>' : "") +
      (data.expertise && data.expertise.length
        ? '<div class="tags">' + data.expertise.map(function (e) { return '<span class="tag">' + esc(t(e)) + '</span>'; }).join("") + "</div>"
        : "") +
      '<div class="links">' +
      (data.links && data.links.github ? '<a href="' + esc(data.links.github) + '" target="_blank" rel="noopener">GitHub</a>' : "") +
      (data.links && data.links.email ? '<a href="mailto:' + esc(data.links.email) + '">Email</a>' : "") +
      (data.website ? '<a href="' + esc(data.website) + '" target="_blank" rel="noopener">' + (L === "zh" ? "个人主页" : "Website") + "</a>" : "") +
      "</div></div></div>";
  }

  function pickHost() {
    var el = null;
    var list = document.querySelectorAll(targetSel || "[data-lucas-profile]");
    for (var i = 0; i < list.length; i++) { if (!list[i].__lucasProfileDone) { el = list[i]; break; } }
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("data-lucas-profile", "");
      script.parentNode.insertBefore(el, script.nextSibling);
    }
    el.__lucasProfileDone = true;
    return el;
  }

  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  function boot() {
    var host = pickHost();
    render(host, SNAPSHOT);                       /* 同步首绘：无加载跳动 */
    fetch(base + "profile.json", { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var fresh = {};                            /* 只取展示所需字段，防止脏数据 */
        fresh.name = data.name; fresh.role = data.role; fresh.avatar = data.avatar;
        fresh.website = data.website; fresh.slogan = data.slogan;
        fresh.expertise = data.expertise; fresh.links = data.links;
        if (!same(fresh, SNAPSHOT)) render(host, fresh);   /* 数据有更新才重绘 */
      })
      .catch(function (e) {
        if (window.console) console.warn("[lucas-profile] profile.json 拉取失败，已使用内置快照：", e);
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
