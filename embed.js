/*!
 * Lucas Profile Widget — 单一个人信息源
 * 用法（在其他任意网站的 HTML 中）：
 *   <div data-lucas-profile></div>
 *   <script src="https://yjmm10.github.io/embed.js"></script>
 * 可选参数（写在 script 标签上）：
 *   data-target="#css选择器"  渲染容器（默认取 [data-lucas-profile]，没有则插到脚本后面）
 *   data-lang="en|zh|auto"    显示语言（默认 auto：跟随浏览器语言）
 *   data-theme="light|dark|auto"  配色（默认 auto：跟随页面 prefers-color-scheme）
 * 数据全部来自 https://yjmm10.github.io/profile.json —— 改信息只需改那一处。
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;
  var base = (script.src || "").replace(/embed\.js.*$/, "");
  var optLang = (script.getAttribute("data-lang") || "auto").toLowerCase();
  var optTheme = (script.getAttribute("data-theme") || "auto").toLowerCase();
  var targetSel = script.getAttribute("data-target");

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
      ':host{all:initial;display:block;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}' +
      '.card{display:flex;gap:18px;align-items:flex-start;max-width:520px;padding:22px 24px;border:1px solid ' + line + ';border-radius:18px;background:' + bg + ';color:' + ink + ';box-shadow:0 10px 30px rgba(0,0,0,.08)}' +
      '.ava{width:72px;height:72px;border-radius:50%;object-fit:cover;flex:none;border:2px solid ' + rust + '33}' +
      '.name{font-size:24px;font-weight:700;line-height:1.15}' +
      '.role{margin-top:2px;font-size:13px;color:' + rust + ';font-weight:600;letter-spacing:.04em}' +
      '.slogan{margin-top:8px;font-size:13.5px;color:' + sub + ';line-height:1.6}' +
      '.tags{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}' +
      '.tag{font-size:11.5px;padding:3px 9px;border:1px solid ' + line + ';border-radius:999px;color:' + sub + ';background:' + (d ? "#ffffff0a" : "#00000005") + '}' +
      '.links{margin-top:12px;display:flex;gap:14px;font-size:13px}' +
      '.links a{color:' + rust + ';text-decoration:none;font-weight:600}' +
      '.links a:hover{text-decoration:underline}' +
      '</style>' +
      '<div class="card">' +
      '<img class="ava" src="' + esc(data.avatar) + '" alt="' + esc(data.name) + '" width="72" height="72" loading="lazy">' +
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

  function host() {
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

  function boot() {
    fetch(base + "profile.json", { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { render(host(), data); })
      .catch(function (e) {
        if (window.console) console.warn("[lucas-profile] 加载失败：", e);
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
