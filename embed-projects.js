/*!
 * Lucas Projects Widget — 项目卡片嵌入组件
 * 用法（在任意网站的 HTML 中）：
 *   <div data-lucas-projects></div>
 *   <script src="https://yjmm10.github.io/embed-projects.js"></script>
 * 可选参数（写在 script 标签上）：
 *   data-target="#css选择器"      渲染容器（默认依次取未使用的 [data-lucas-projects]）
 *   data-lang="en|zh|auto"       显示语言（默认 auto：跟随浏览器语言）
 *   data-theme="light|dark|auto" 配色（默认 auto：跟随系统）
 *   data-count="4"               最多显示几条（默认全部）
 * 数据源：https://yjmm10.github.io/projects.json（结构见 projects.schema.json）
 * 组件先用内置快照同步渲染（无加载跳动），随后拉取最新数据，有更新才重绘。
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;
  var base = (script.src || "").replace(/embed-projects\.js.*$/, "");
  var optLang = (script.getAttribute("data-lang") || "auto").toLowerCase();
  var optTheme = (script.getAttribute("data-theme") || "auto").toLowerCase();
  var maxCount = parseInt(script.getAttribute("data-count") || "0", 10);
  var targetSel = script.getAttribute("data-target");

  /* 与 projects.json 同步的内置快照（同步首绘，避免跳动） */
  var SNAPSHOT = {
    projects: [
      { id: "docvlm", name: { en: "DocVLM", zh: "DocVLM" }, tagline: { en: "Multimodal document intelligence", zh: "多模态文档智能解析" }, status: "in-progress",
        stack: [{ en: "Document AI", zh: "文档智能" }, { en: "VLM", zh: "视觉语言模型" }, { en: "RAG", zh: "检索增强" }] },
      { id: "fj-starmap", name: { en: "fj-starmap", zh: "fj-starmap" }, tagline: { en: "AI startup-policy tracking & insights", zh: "AI 创业政策追踪与洞察" }, status: "tinkering",
        stack: [{ en: "LLM insights", zh: "LLM 洞察" }, { en: "Data aggregation", zh: "数据聚合" }] },
      { id: "glean", name: { en: "Glean", zh: "Glean" }, tagline: { en: "Automated cross-platform distribution", zh: "跨平台内容全自动分发" }, status: "polishing",
        stack: [{ en: "Automation", zh: "自动化" }, { en: "Platform APIs", zh: "平台 API" }] },
      { id: "academic-skill", name: { en: "Academic Skill", zh: "学术 Skill" }, tagline: { en: "Research productivity toolkit", zh: "科研效率工具集" }, status: "brewing",
        stack: [{ en: "Paper reading", zh: "论文精读" }, { en: "Writing pipeline", zh: "写作流水线" }] }
    ],
    updated: "2026-11-20"
  };
  var STATUS = {
    "in-progress": { en: "In progress", zh: "进行中", color: "#b0543c" },
    "tinkering":   { en: "Tinkering",   zh: "折腾中", color: "#a07d1f" },
    "polishing":   { en: "Polishing",   zh: "打磨中", color: "#4a6fa5" },
    "brewing":     { en: "Brewing",     zh: "构思中", color: "#6f675c" },
    "released":    { en: "Released",    zh: "已上线", color: "#2f8a68" },
    "archived":    { en: "Archived",    zh: "已归档", color: "#8a8578" }
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
    var list = (data.projects || []).slice(0, maxCount > 0 ? maxCount : undefined);

    var cards = list.map(function (p) {
      var st = STATUS[p.status] || { en: p.status, zh: p.status, color: "#6f675c" };
      var c = d ? st.color : st.color;
      var stack = (p.stack || []).map(function (s) {
        return '<span style="font-size:11px;padding:2px 9px;border-radius:999px;border:1px solid ' + line + ';color:' + sub + ';line-height:18px">' + esc(t(s)) + "</span>";
      }).join("");
      var links = "";
      var Lo = p.links || {};
      if (Lo.homepage) links += '<a href="' + esc(Lo.homepage) + '" target="_blank" rel="noopener" style="color:' + c + ';font-weight:600;text-decoration:none">' + (L === "zh" ? "访问" : "Visit") + "</a>";
      if (Lo.github) links += '<a href="' + esc(Lo.github) + '" target="_blank" rel="noopener" style="color:' + c + ';font-weight:600;text-decoration:none">GitHub</a>';
      if (Lo.docs) links += '<a href="' + esc(Lo.docs) + '" target="_blank" rel="noopener" style="color:' + c + ';font-weight:600;text-decoration:none">' + (L === "zh" ? "文档" : "Docs") + "</a>";
      return '<div style="padding:18px 20px;border:1px solid ' + line + ';border-radius:14px;background:' + bg + ';color:' + ink + ';box-shadow:0 8px 24px rgba(0,0,0,.07);max-width:420px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
        '<b style="font-size:16px">' + esc(t(p.name)) + "</b>" +
        '<span style="flex:none;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;border:1px solid ' + c + '55;background:' + c + '14;color:' + c + ';white-space:nowrap">' + esc(t(st)) + "</span></div>" +
        '<p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:' + sub + '">' + esc(t(p.tagline)) + "</p>" +
        (stack ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">' + stack + "</div>" : "") +
        (links ? '<div style="display:flex;gap:14px;margin-top:12px;font-size:12.5px">' + links + "</div>" : "") +
        "</div>";
    }).join("");

    shadow.innerHTML =
      '<style>:host{all:initial;display:block;max-width:100%}*,*::before,*::after{box-sizing:border-box}.wrap{display:flex;flex-direction:column;gap:12px}</style>' +
      '<div class="wrap">' + cards + "</div>";
  }

  function pickHost() {
    var el = null;
    var list = document.querySelectorAll(targetSel || "[data-lucas-projects]");
    for (var i = 0; i < list.length; i++) { if (!list[i].__lucasProjectsDone) { el = list[i]; break; } }
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("data-lucas-projects", "");
      script.parentNode.insertBefore(el, script.nextSibling);
    }
    el.__lucasProjectsDone = true;
    return el;
  }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  function boot() {
    var host = pickHost();
    render(host, SNAPSHOT);                        /* 同步首绘：无加载跳动 */
    fetch(base + "projects.json", { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        if (!same({ projects: data.projects }, { projects: SNAPSHOT.projects })) render(host, data);
      })
      .catch(function (e) {
        if (window.console) console.warn("[lucas-projects] projects.json 拉取失败，已使用内置快照：", e);
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
