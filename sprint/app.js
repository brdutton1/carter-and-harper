/* Web Studio Sprint — Mission Control app.
   Exposes window.SprintApp.boot(ctx) — called by auth.js after a kid logs in.
   ctx = { name, checks, onChange(checks), onLogout() } */
window.SprintApp = (function () {
  "use strict";

  var DATA = window.SPRINT_DATA || [];
  var byId = {};
  DATA.forEach(function (s) { byId[s.id] = s; });

  var HOME = { id: "home", group: "start", type: "home", label: "Dashboard", short: "Dashboard" };
  var ORDER = ["home", "adjust",
    "day1","day2","day3","day4","day5","day6","day7","day8","day9","day10",
    "prep","prompts","checklist","kickoff","handoff","acquire","resources","twoperson","dashboard","endcheck"];
  var SECTIONS = ORDER.map(function (id) { return id === "home" ? HOME : byId[id]; }).filter(Boolean);

  var SHIP = {
    day1:"Signed client brief", day2:"Locked visual direction", day3:"Live rough preview",
    day4:"Clean desktop site", day5:"100% real content", day6:"Great on every screen",
    day7:"Revision 1 sent", day8:"Lighthouse green", day9:"LIVE on their domain",
    day10:"Portfolio + 3 emails sent"
  };

  // ---------- state (provided by auth.js at boot) ----------
  var CTX = null;
  var state = { checks: {} };
  function save() { if (CTX && typeof CTX.onChange === "function") CTX.onChange(state.checks); }
  function isChecked(id, i) { return !!state.checks[id + "#" + i]; }
  function setChecked(id, i, v) { if (v) state.checks[id + "#" + i] = 1; else delete state.checks[id + "#" + i]; save(); if (CTX && typeof CTX.onToggle === "function") CTX.onToggle(id + "#" + i, !!v); }

  var TASK_RE = /<li>\s*\[[ xX]\]/g;
  function taskTotal(s) { if (!s || !s.html) return 0; var m = s.html.match(TASK_RE); return m ? m.length : 0; }
  function taskDone(s) { var t = taskTotal(s), n = 0; for (var i = 0; i < t; i++) if (isChecked(s.id, i)) n++; return n; }
  function dayComplete(s) { var t = taskTotal(s); return t > 0 && taskDone(s) === t; }
  function dayList() { return SECTIONS.filter(function (s) { return s.type === "day"; }); }
  function firstIncompleteDay() { var d = dayList(); for (var i = 0; i < d.length; i++) if (!dayComplete(d[i])) return d[i]; return null; }

  // Pure analyzer — compute a full progress summary from ANY checks object
  // (used by the kid dashboard and the admin dashboard).
  function taskDoneFor(s, checks) { var t = taskTotal(s), n = 0; for (var i = 0; i < t; i++) if (checks[s.id + "#" + i]) n++; return n; }
  function analyze(checks) {
    checks = checks || {};
    var perDay = dayList().map(function (s) {
      var t = taskTotal(s), d = taskDoneFor(s, checks);
      return { day: s.day, label: s.label, ship: SHIP[s.id] || "", total: t, done: d, complete: t > 0 && d === t };
    });
    var tot = 0, don = 0, shipped = 0, current = null;
    perDay.forEach(function (x) { tot += x.total; don += x.done; if (x.complete) shipped++; });
    for (var i = 0; i < perDay.length; i++) { if (!perDay[i].complete) { current = { day: perDay[i].day, label: perDay[i].label }; break; } }
    return { pct: tot ? Math.round(don / tot * 100) : 0, shipped: shipped, totalChecks: Object.keys(checks).length, currentDay: current, days: perDay };
  }

  function computeProgress() {
    var dTot = 0, dDone = 0, shipped = 0;
    dayList().forEach(function (s) { var t = taskTotal(s); dTot += t; dDone += taskDone(s); if (dayComplete(s)) shipped++; });
    return { pct: dTot ? Math.round((dDone / dTot) * 100) : 0, shipped: shipped, checks: Object.keys(state.checks).length };
  }

  // ---------- DOM refs ----------
  var $nav, $view, $ring, $ringNum, $shipped, $shipped2, $checks, $side, $scrim, $toast, $userName, $userAv, $userSpecialty;
  var RING_C = 169.646;
  var booted = false;

  function grabRefs() {
    $nav = document.querySelector("[data-nav]");
    $view = document.querySelector("[data-view]");
    $ring = document.querySelector("[data-ring]");
    $ringNum = document.querySelector("[data-ringnum]");
    $shipped = document.querySelector("[data-shipped]");
    $shipped2 = document.querySelector("[data-shipped2]");
    $checks = document.querySelector("[data-checks]");
    $side = document.querySelector("[data-side]");
    $scrim = document.querySelector("[data-scrim]");
    $toast = document.querySelector("[data-toast]");
    $userName = document.querySelector("[data-user-name]");
    $userAv = document.querySelector("[data-user-av]");
    $userSpecialty = document.querySelector("[data-user-specialty]");
  }

  // ---------- nav ----------
  function groupLabel(g) { return g === "start" ? "Start here" : g === "days" ? "The 10 days" : "Reference library"; }
  function iconFor(s) {
    var m = { home:"◆", adjust:"⚑", prep:"✔", prompts:"⌘", checklist:"☑", kickoff:"☎",
      handoff:"⇲", acquire:"✉", resources:"★", twoperson:"⇄", dashboard:"▣", endcheck:"🏁" };
    return m[s.id] || "•";
  }
  function buildNav() {
    var html = "", lastGroup = null;
    SECTIONS.forEach(function (s) {
      if (s.group !== lastGroup) { html += '<div class="nav__group">' + groupLabel(s.group) + "</div>"; lastGroup = s.group; }
      var lead = s.type === "day"
        ? '<span class="nav__num">' + s.day + "</span>"
        : '<span class="nav__icon">' + iconFor(s) + "</span>";
      html += '<div class="nav__item" data-go="' + s.id + '">' + lead +
        '<span class="nav__label">' + esc(s.short || s.label) + "</span>" +
        '<span class="nav__check">✓</span></div>';
    });
    $nav.innerHTML = html;
    $nav.querySelectorAll("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () { location.hash = el.getAttribute("data-go"); closeDrawer(); });
    });
  }
  function refreshNav() {
    $nav.querySelectorAll("[data-go]").forEach(function (el) {
      var s = byId[el.getAttribute("data-go")];
      el.classList.toggle("is-done", !!(s && s.type === "day" && dayComplete(s)));
    });
  }
  function refreshProgress() {
    var p = computeProgress();
    $ring.style.strokeDashoffset = (RING_C * (1 - p.pct / 100)).toFixed(2);
    $ringNum.textContent = p.pct + "%";
    $shipped.textContent = p.shipped + "/10";
    if ($shipped2) $shipped2.textContent = p.shipped;
    $checks.textContent = p.checks + (p.checks === 1 ? " check done" : " checks done");
    return p;
  }

  // ---------- helpers ----------
  function esc(t) { return (t || "").replace(/[&<>"]/g, function (c) { return { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]; }); }
  function activeIndex() { var id = (location.hash || "#home").slice(1); var i = ORDER.indexOf(id); return i < 0 ? 0 : i; }

  // ---------- render ----------
  function render() {
    var id = (location.hash || "#home").slice(1);
    if (ORDER.indexOf(id) < 0) id = "home";
    var s = id === "home" ? HOME : byId[id];

    $nav.querySelectorAll("[data-go]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-go") === id);
    });

    $view.innerHTML = s.type === "home" ? renderHome() : renderSection(s);
    if (s.type === "home") wireHome(); else enhance(s);
    appendPager();
    window.scrollTo({ top: 0 });
    refreshNav();
    refreshProgress();
  }

  function renderSection(s) {
    var tmp = document.createElement("div");
    tmp.innerHTML = s.html;
    var h2 = tmp.querySelector("h2"); if (h2) h2.remove();
    var theme = "";
    var fe = tmp.firstElementChild;
    if (fe && fe.tagName === "P" && fe.children.length === 1 && fe.firstElementChild && fe.firstElementChild.tagName === "EM") {
      theme = fe.firstElementChild.textContent; fe.remove();
    }
    var head;
    if (s.type === "day") {
      head = '<header class="shead">' +
        '<div class="shead__eyebrow">Day ' + s.day + ' / 10' + (dayComplete(s) ? ' <span class="pill" style="color:var(--good)">✓ Shipped</span>' : '') + '</div>' +
        '<h1>' + esc(s.label) + '</h1>' +
        (theme ? '<p class="shead__theme">' + esc(theme) + '</p>' : '') +
        '<div class="chips"><span class="chip">⚡ <b>Lesson</b> 30–45m</span><span class="chip">🔨 <b>Build</b> 3–4h</span><span class="chip">✅ <b>Review</b> 30m</span></div>' +
        '<div class="sbar"><div class="sbar__track"><div class="sbar__fill" data-sfill></div></div><div class="sbar__txt" data-stxt></div></div>' +
        '</header>';
    } else {
      var eyebrow = s.id === "adjust" ? "Read this first" : "Reference library";
      head = '<header class="shead">' +
        '<div class="shead__eyebrow">' + iconFor(s) + ' &nbsp;' + eyebrow + '</div>' +
        '<h1>' + esc(s.label) + '</h1>' +
        (theme ? '<p class="shead__theme">' + esc(theme) + '</p>' : '') +
        ((taskTotal(s) > 0) ? '<div class="sbar"><div class="sbar__track"><div class="sbar__fill" data-sfill></div></div><div class="sbar__txt" data-stxt></div></div>' : '') +
        '</header>';
    }
    return head + '<div class="content"><div class="content-inner">' + tmp.innerHTML + '</div></div>';
  }

  // ---------- enhance: checkboxes, copy, tint ----------
  function enhance(s) {
    var ti = 0;
    $view.querySelectorAll(".content li").forEach(function (li) {
      if (!li.textContent.match(/^\s*\[([ xX])\]\s*/)) return;
      var idx = ti++;
      stripPrefix(li);
      li.classList.add("task");
      var inner = li.innerHTML;
      li.innerHTML = '<label class="chk"><input type="checkbox"' + (isChecked(s.id, idx) ? " checked" : "") +
        '><span class="box"></span><span class="lbl">' + inner + "</span></label>";
      var input = li.querySelector("input");
      input.addEventListener("change", function () {
        var was = computeProgress().shipped;
        setChecked(s.id, idx, input.checked);
        updateSectionBar(s);
        var now = refreshProgress();
        refreshNav();
        if (s.type === "day" && dayComplete(s)) { if (now.shipped > was) { celebrate(s); markHeaderShipped(); } }
        else { unmarkHeaderShipped(s); }
      });
    });
    updateSectionBar(s);

    $view.querySelectorAll(".content pre").forEach(function (pre) {
      var code = pre.querySelector("code") || pre;
      var txt = code.textContent || "";
      var wrap = document.createElement("div"); wrap.className = "codewrap";
      pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
      var tone = detectTone(txt, wrap);
      if (tone) {
        wrap.classList.add(tone === "bad" ? "is-bad" : "is-good");
        var tag = document.createElement("span"); tag.className = "codetag";
        tag.textContent = tone === "bad" ? "Don't" : "Do this"; wrap.appendChild(tag);
      }
      var btn = document.createElement("button"); btn.className = "copybtn"; btn.innerHTML = "⧉ Copy";
      btn.addEventListener("click", function () {
        copy(txt); btn.classList.add("copied"); btn.innerHTML = "✓ Copied";
        setTimeout(function () { btn.classList.remove("copied"); btn.innerHTML = "⧉ Copy"; }, 1400);
      });
      wrap.appendChild(btn);
    });
  }
  function detectTone(txt, wrap) {
    if (/^\s*BAD PROMPT/i.test(txt)) return "bad";
    if (/^\s*GOOD PROMPT/i.test(txt)) return "good";
    var prev = wrap.previousElementSibling, hops = 0;
    while (prev && hops < 2) {
      var pt = prev.textContent || "";
      if (/\bBAD\b/.test(pt) && /prompt/i.test(pt)) return "bad";
      if (/\bGOOD\b/.test(pt) && /prompt/i.test(pt)) return "good";
      prev = prev.previousElementSibling; hops++;
    }
    return null;
  }
  function stripPrefix(li) {
    var walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null);
    var node = walker.nextNode();
    while (node && !node.nodeValue.trim()) node = walker.nextNode();
    if (node) node.nodeValue = node.nodeValue.replace(/^\s*\[[ xX]\]\s*/, "");
  }
  function updateSectionBar(s) {
    var fill = $view.querySelector("[data-sfill]"), txt = $view.querySelector("[data-stxt]");
    if (!fill) return;
    var t = taskTotal(s), d = taskDone(s);
    fill.style.width = (t ? Math.round(d / t * 100) : 0) + "%";
    if (txt) txt.innerHTML = (t === d && t > 0)
      ? '<span class="done">✓ All ' + t + ' done — ' + (s.type === "day" ? "day shipped." : "complete.") + "</span>"
      : d + " of " + t + " checked";
  }
  function markHeaderShipped() {
    var eb = $view.querySelector(".shead__eyebrow");
    if (eb && !eb.querySelector(".pill")) eb.innerHTML += ' <span class="pill" style="color:var(--good)">✓ Shipped</span>';
  }
  function unmarkHeaderShipped(s) {
    if (s.type !== "day") return;
    var pill = $view.querySelector(".shead__eyebrow .pill");
    if (pill && !dayComplete(s)) pill.remove();
  }
  function copy(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(fb); else fb();
    function fb() { var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); }
  }
  function celebrate(s) { toast('Day ' + s.day + ' shipped <span class="em">🚀</span>'); fireConfetti(); }
  var toastTimer;
  function toast(html) { $toast.innerHTML = html; $toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { $toast.classList.remove("show"); }, 2600); }
  function fireConfetti() {
    var c = document.createElement("div"); c.className = "confetti";
    var cols = ["#ff8906","#f25f4c","#e53170","#34d399","#fffffe"];
    for (var i = 0; i < 36; i++) {
      var p = document.createElement("i");
      p.style.left = Math.round(Math.random() * 100) + "vw";
      p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.25) + "s";
      p.style.transform = "rotate(" + Math.round(Math.random() * 360) + "deg)";
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(function () { c.remove(); }, 2200);
  }

  // ---------- pager ----------
  function appendPager() {
    var i = activeIndex(), prev = SECTIONS[i - 1], next = SECTIONS[i + 1];
    var html = '<div class="pager">';
    html += prev ? '<a data-go="' + prev.id + '"><span class="dir">← Previous</span><span class="ttl">' + esc(prev.short || prev.label) + "</span></a>" : '<a class="empty"></a>';
    html += next ? '<a class="next" data-go="' + next.id + '"><span class="dir">Next →</span><span class="ttl">' + esc(next.short || next.label) + "</span></a>" : '<a class="empty"></a>';
    html += "</div>";
    $view.insertAdjacentHTML("beforeend", html);
    $view.querySelectorAll(".pager [data-go]").forEach(function (el) {
      if (!el.classList.contains("empty")) el.addEventListener("click", function () { location.hash = el.getAttribute("data-go"); });
    });
  }

  // ---------- dashboard (home) ----------
  function renderHome() {
    var p = computeProgress();
    var next = firstIncompleteDay();
    var name = (CTX && CTX.name) || "Studio";
    var greeting = p.shipped === 0 ? "Let's ship Day 1." : next ? ("You're on Day " + next.day + ".") : "All ten days shipped. 🎉";

    var cta = next
      ? '<button class="btn btn--primary" data-go="' + next.id + '">' + (p.shipped === 0 ? "Start Day 1 →" : "Continue Day " + next.day + " →") + '</button>'
      : '<button class="btn btn--primary" data-go="endcheck">See the finish line →</button>';

    var tiles = dayList().map(function (s) {
      var done = dayComplete(s);
      var current = !done && next && s.id === next.id;
      var cls = done ? "is-done" : current ? "is-current" : "is-upcoming";
      return '<button class="jtile ' + cls + '" data-go="' + s.id + '">' +
        '<span class="jtile__dot">' + (done ? "✓" : s.day) + "</span>" +
        '<span class="jtile__l">' + esc(s.label) + "</span>" +
        '<span class="jtile__s">' + esc(SHIP[s.id] || "") + "</span>" +
        (current ? '<span class="jtile__tag">You are here</span>' : "") +
        "</button>";
    }).join("");

    return '' +
    '<section class="dash-hero">' +
      '<div class="dash-hero__top">' +
        '<div>' +
          '<div class="dash-hero__eyebrow">Web Studio Sprint · Mission Control</div>' +
          '<h1 class="dash-hero__h">Hey ' + esc(name) + ' 👋</h1>' +
          '<p class="dash-hero__sub">' + esc(greeting) + ' Ten days, one real client, from zero to live.</p>' +
          '<div class="dash-hero__cta">' + cta +
            '<button class="btn btn--ghost" data-go="prompts">Open the Prompt Library</button>' +
          '</div>' +
        '</div>' +
        '<div class="dash-stat">' +
          '<div class="dash-stat__pct">' + p.pct + '%</div>' +
          '<div class="dash-stat__track"><div class="dash-stat__fill" style="width:' + p.pct + '%"></div></div>' +
          '<div class="dash-stat__meta"><b>' + p.shipped + ' / 10</b> days shipped · <span>' + p.checks + ' checks</span></div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<div class="sectionlabel">How the sprint works</div>' +
    '<div class="how">' +
      '<div class="how__card"><div class="how__n">01</div><h4>You direct, Claude builds</h4><p>You\'re not coding. You write sharp, specific briefs and Claude Code builds the site. The better the brief, the better the site.</p></div>' +
      '<div class="how__card"><div class="how__n">02</div><h4>Driver & Director</h4><p>One of you runs Claude Code, the other reviews every result against the checklist. Swap seats at the mid-day break.</p></div>' +
      '<div class="how__card"><div class="how__n">03</div><h4>Tick as you ship</h4><p>Each day has a lesson, a build block, and a checklist. Tick items as you finish — the day turns green and your progress saves to your account.</p></div>' +
    '</div>' +

    '<div class="sectionlabel">Your 10-day journey</div>' +
    '<div class="journey">' + tiles + '</div>' +

    '<div class="sectionlabel">The finish line</div>' +
    '<div class="finish"><h3>You\'re a real studio when all five are true:</h3><ul>' +
      '<li><span>1</span> The client\'s site is live on their own domain.</li>' +
      '<li><span>2</span> The client has approved it in writing.</li>' +
      '<li><span>3</span> Your studio portfolio is live with this project as case study #1.</li>' +
      '<li><span>4</span> Three outreach emails are sent for a paid client #2.</li>' +
      '<li><span>5</span> Both of you can independently brief Claude Code to build a new site.</li>' +
    "</ul></div>";
  }
  function wireHome() {
    $view.querySelectorAll("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () { location.hash = el.getAttribute("data-go"); });
    });
  }

  // ---------- chrome (drawer / reset / logout / keyboard) ----------
  function openDrawer() { $side.classList.add("open"); $scrim.classList.add("show"); }
  function closeDrawer() { $side.classList.remove("open"); $scrim.classList.remove("show"); }
  function wireChrome() {
    var menu = document.querySelector("[data-menu]"); if (menu) menu.addEventListener("click", openDrawer);
    $scrim.addEventListener("click", closeDrawer);
    var reset = document.querySelector("[data-reset]");
    if (reset) reset.addEventListener("click", function () {
      if (confirm("Reset all your checklist progress? This can't be undone.")) { state = { checks: {} }; save(); render(); toast("Progress reset."); }
    });
    var logout = document.querySelector("[data-logout]");
    if (logout) logout.addEventListener("click", function () { if (CTX && CTX.onLogout) CTX.onLogout(); });
    document.addEventListener("keydown", function (e) {
      if (/input|textarea|select/i.test((e.target.tagName || ""))) return;
      if (e.key === "ArrowRight" || e.key === "j") { var n = SECTIONS[activeIndex() + 1]; if (n) location.hash = n.id; }
      if (e.key === "ArrowLeft" || e.key === "k") { var pv = SECTIONS[activeIndex() - 1]; if (pv) location.hash = pv.id; }
    });
    window.addEventListener("hashchange", render);
  }

  // ---------- public boot ----------
  function boot(ctx) {
    CTX = ctx || {};
    state = { checks: (ctx && ctx.checks) || {} };
    grabRefs();
    if ($userName) $userName.textContent = CTX.name || "Studio";
    if ($userAv) $userAv.textContent = (CTX.name || "?").charAt(0).toUpperCase();
    if ($userSpecialty) $userSpecialty.textContent = CTX.specialty || "";
    var back = document.querySelector("[data-back]");
    if (back) { if (CTX.onBack) { back.hidden = false; back.onclick = function () { CTX.onBack(); }; } else { back.hidden = true; } }
    if (!booted) { wireChrome(); buildNav(); booted = true; }
    render();
  }

  return { boot: boot, analyze: analyze, SHIP: SHIP };
})();
