/* Web Studio Sprint — Mission Control app */
(function () {
  "use strict";

  var DATA = window.SPRINT_DATA || [];
  var byId = {};
  DATA.forEach(function (s) { byId[s.id] = s; });

  // Synthetic home + ordered section list (drives nav + pager).
  var HOME = { id: "home", group: "start", type: "home", label: "Overview", short: "Overview" };
  var ORDER = ["home", "adjust",
    "day1","day2","day3","day4","day5","day6","day7","day8","day9","day10",
    "prep","prompts","checklist","kickoff","handoff","acquire","resources","twoperson","dashboard","endcheck"];
  var SECTIONS = ORDER.map(function (id) { return id === "home" ? HOME : byId[id]; }).filter(Boolean);

  // Flavor: what each day ships.
  var SHIP = {
    day1:"Signed client brief", day2:"Locked visual direction", day3:"Live rough preview",
    day4:"Clean desktop site", day5:"100% real content", day6:"Great on every screen",
    day7:"Revision 1 sent", day8:"Lighthouse green", day9:"LIVE on their domain",
    day10:"Portfolio + 3 emails sent"
  };

  // ---------- progress storage ----------
  var KEY = "wss.v1";
  var state = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { checks: {} }; } catch (e) { return { checks: {} }; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function isChecked(id, i) { return !!state.checks[id + "#" + i]; }
  function setChecked(id, i, v) { if (v) state.checks[id + "#" + i] = 1; else delete state.checks[id + "#" + i]; save(); }

  // Count task items in a section's html without rendering.
  var TASK_RE = /<li>\s*\[[ xX]\]/g;
  function taskTotal(s) { if (!s || !s.html) return 0; var m = s.html.match(TASK_RE); return m ? m.length : 0; }
  function taskDone(s) { var t = taskTotal(s), n = 0; for (var i = 0; i < t; i++) if (isChecked(s.id, i)) n++; return n; }

  function dayComplete(s) { var t = taskTotal(s); return t > 0 && taskDone(s) === t; }

  function computeProgress() {
    var days = SECTIONS.filter(function (s) { return s.type === "day"; });
    var dTot = 0, dDone = 0, shipped = 0;
    days.forEach(function (s) { var t = taskTotal(s); dTot += t; dDone += taskDone(s); if (dayComplete(s)) shipped++; });
    var allChecks = Object.keys(state.checks).length;
    return { pct: dTot ? Math.round((dDone / dTot) * 100) : 0, shipped: shipped, checks: allChecks };
  }

  // ---------- DOM refs ----------
  var $nav = document.querySelector("[data-nav]");
  var $view = document.querySelector("[data-view]");
  var $ring = document.querySelector("[data-ring]");
  var $ringNum = document.querySelector("[data-ringnum]");
  var $shipped = document.querySelector("[data-shipped]");
  var $shipped2 = document.querySelector("[data-shipped2]");
  var $checks = document.querySelector("[data-checks]");
  var $side = document.querySelector("[data-side]");
  var $scrim = document.querySelector("[data-scrim]");
  var $toast = document.querySelector("[data-toast]");
  var RING_C = 169.646;

  // ---------- nav ----------
  function groupLabel(g) { return g === "start" ? "Start here" : g === "days" ? "The 10 days" : "Reference library"; }
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
  function iconFor(s) {
    var m = { home:"◆", adjust:"⚑", prep:"✔", prompts:"⌘", checklist:"☑", kickoff:"☎",
      handoff:"⇲", acquire:"✉", resources:"★", twoperson:"⇄", dashboard:"▣", endcheck:"🏁" };
    return m[s.id] || "•";
  }
  function refreshNav() {
    $nav.querySelectorAll("[data-go]").forEach(function (el) {
      var id = el.getAttribute("data-go");
      var s = byId[id];
      el.classList.toggle("is-done", !!(s && s.type === "day" && dayComplete(s)));
    });
  }

  function refreshProgress(prevShipped) {
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

  // ---------- render a section ----------
  function render() {
    var id = (location.hash || "#home").slice(1);
    if (ORDER.indexOf(id) < 0) id = "home";
    var s = id === "home" ? HOME : byId[id];

    // active nav
    $nav.querySelectorAll("[data-go]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-go") === id);
    });

    $view.innerHTML = s.type === "home" ? renderHome() : renderSection(s);

    if (s.type !== "home") {
      enhance(s);
    } else {
      wireHome();
    }
    appendPager();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    refreshNav();
    refreshProgress();
  }

  function renderSection(s) {
    var tmp = document.createElement("div");
    tmp.innerHTML = s.html;
    // title from first h2
    var h2 = tmp.querySelector("h2");
    if (h2) h2.remove();
    // theme = first <p><em>..</em></p> (days)
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
        '<div class="sbar"><div class="sbar__track"><div class="sbar__fill" data-sfill></div></div>' +
        '<div class="sbar__txt" data-stxt></div></div>' +
        '</header>';
    } else {
      var eyebrow = s.id === "adjust" ? "Read this first" : "Reference library";
      head = '<header class="shead">' +
        '<div class="shead__eyebrow">' + iconFor(s) + ' &nbsp;' + eyebrow + '</div>' +
        '<h1>' + esc(cleanTitle(s.label)) + '</h1>' +
        (theme ? '<p class="shead__theme">' + esc(theme) + '</p>' : '') +
        ((taskTotal(s) > 0) ? '<div class="sbar"><div class="sbar__track"><div class="sbar__fill" data-sfill></div></div><div class="sbar__txt" data-stxt></div></div>' : '') +
        '</header>';
    }
    return head + '<div class="content"><div class="content-inner">' + tmp.innerHTML + '</div></div>';
  }
  function cleanTitle(t) { return t; }

  // ---------- enhance rendered content: checkboxes, copy, tint ----------
  function enhance(s) {
    var root = $view;
    // checkboxes
    var ti = 0;
    root.querySelectorAll(".content li").forEach(function (li) {
      var m = li.textContent.match(/^\s*\[([ xX])\]\s*/);
      if (!m) return;
      var idx = ti++;
      // strip the "[ ] " prefix from the leading text node only
      stripPrefix(li);
      var checked = isChecked(s.id, idx);
      li.classList.add("task");
      var inner = li.innerHTML;
      li.innerHTML = '<label class="chk"><input type="checkbox"' + (checked ? " checked" : "") +
        '><span class="box"></span><span class="lbl">' + inner + "</span></label>";
      var input = li.querySelector("input");
      input.addEventListener("change", function () {
        var was = computeProgress().shipped;
        setChecked(s.id, idx, input.checked);
        updateSectionBar(s);
        var now = refreshProgress();
        refreshNav();
        if (s.type === "day" && dayComplete(s)) {
          if (now.shipped > was) { celebrate(s); markHeaderShipped(); }
        } else { unmarkHeaderShipped(s); }
      });
    });
    updateSectionBar(s);

    // copy buttons + bad/good tint
    root.querySelectorAll(".content pre").forEach(function (pre) {
      var code = pre.querySelector("code") || pre;
      var txt = code.textContent || "";
      var wrap = document.createElement("div");
      wrap.className = "codewrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var tone = detectTone(txt, wrap);
      if (tone) {
        wrap.classList.add(tone === "bad" ? "is-bad" : "is-good");
        var tag = document.createElement("span");
        tag.className = "codetag";
        tag.textContent = tone === "bad" ? "Don't" : "Do this";
        wrap.appendChild(tag);
      }
      var btn = document.createElement("button");
      btn.className = "copybtn";
      btn.innerHTML = "⧉ Copy";
      btn.addEventListener("click", function () {
        copy(txt);
        btn.classList.add("copied"); btn.innerHTML = "✓ Copied";
        setTimeout(function () { btn.classList.remove("copied"); btn.innerHTML = "⧉ Copy"; }, 1400);
      });
      wrap.appendChild(btn);
    });
  }

  function detectTone(txt, wrap) {
    if (/^\s*BAD PROMPT/i.test(txt)) return "bad";
    if (/^\s*GOOD PROMPT/i.test(txt)) return "good";
    // look back at the previous paragraph (prompt library uses "**Prompt 1a — BAD**")
    var prev = wrap.previousElementSibling;
    var hops = 0;
    while (prev && hops < 2) {
      var pt = prev.textContent || "";
      if (/\bBAD\b/.test(pt) && /prompt/i.test(pt)) return "bad";
      if (/\bGOOD\b/.test(pt) && /prompt/i.test(pt)) return "good";
      prev = prev.previousElementSibling; hops++;
    }
    return null;
  }

  function stripPrefix(li) {
    // remove leading "[ ] " from first text-bearing node
    var walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null);
    var node = walker.nextNode();
    while (node && !node.nodeValue.trim()) node = walker.nextNode();
    if (node) node.nodeValue = node.nodeValue.replace(/^\s*\[[ xX]\]\s*/, "");
  }

  function updateSectionBar(s) {
    var fill = $view.querySelector("[data-sfill]");
    var txt = $view.querySelector("[data-stxt]");
    if (!fill) return;
    var t = taskTotal(s), d = taskDone(s), pct = t ? Math.round(d / t * 100) : 0;
    fill.style.width = pct + "%";
    if (txt) {
      txt.innerHTML = (t === d && t > 0)
        ? '<span class="done">✓ All ' + t + ' done — ' + (s.type === "day" ? "day shipped." : "complete.") + "</span>"
        : d + " of " + t + " checked";
    }
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
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).catch(fallback); }
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta);
    }
  }

  function celebrate(s) {
    toast('Day ' + s.day + ' shipped <span class="em">🚀</span>');
  }
  var toastTimer;
  function toast(html) {
    $toast.innerHTML = html; $toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { $toast.classList.remove("show"); }, 2600);
  }

  // ---------- pager ----------
  function appendPager() {
    var i = activeIndex();
    var prev = SECTIONS[i - 1], next = SECTIONS[i + 1];
    var html = '<div class="pager">';
    html += prev
      ? '<a data-go="' + prev.id + '"><span class="dir">← Previous</span><span class="ttl">' + esc(prev.short || prev.label) + "</span></a>"
      : '<a class="empty"></a>';
    html += next
      ? '<a class="next" data-go="' + next.id + '"><span class="dir">Next →</span><span class="ttl">' + esc(next.short || next.label) + "</span></a>"
      : '<a class="empty"></a>';
    html += "</div>";
    $view.insertAdjacentHTML("beforeend", html);
    $view.querySelectorAll(".pager [data-go]").forEach(function (el) {
      if (el.classList.contains("empty")) return;
      el.addEventListener("click", function () { location.hash = el.getAttribute("data-go"); });
    });
  }

  // ---------- home ----------
  function renderHome() {
    var tiles = SECTIONS.filter(function (s) { return s.type === "day"; }).map(function (s) {
      var done = dayComplete(s);
      return '<div class="daytile' + (done ? " is-done" : "") + '" data-go="' + s.id + '">' +
        '<div class="daytile__badge">✓</div>' +
        '<div class="daytile__n">' + s.day + "</div>" +
        '<div class="daytile__l">' + esc(s.label) + "</div>" +
        '<div class="daytile__ship">ships → ' + esc(SHIP[s.id] || "") + "</div></div>";
    }).join("");

    return '' +
    '<section class="hero">' +
      '<div class="hero__eyebrow">Carter &amp; Harper · Mission Control</div>' +
      '<h1>Web Studio<br><span class="g">Sprint</span></h1>' +
      '<p class="hero__lead">Ten days. One real client. From zero to a live website a senior designer would sign off on.</p>' +
      '<div class="hero__cta">' +
        '<button class="btn btn--primary" data-go="day1">Start Day 1 →</button>' +
        '<button class="btn btn--ghost" data-go="adjust">Read the game plan</button>' +
      '</div>' +
    '</section>' +

    '<div class="bigidea">' +
      '<h3>The one idea this whole sprint runs on</h3>' +
      '<p>Claude Code can build a production website in an afternoon. <strong>The bottleneck is not the AI — it is the human briefing it.</strong> A vague prompt makes generic slop. A specific, referenced, constrained prompt makes a site that looks like a senior designer made it.</p>' +
      '<p>You are not learning to code. You are learning to be the <strong>creative director</strong> who pulls excellent work out of Claude Code. The site you ship for your first real client is the proof.</p>' +
    '</div>' +

    '<div class="sectionlabel">How the two of you run it</div>' +
    '<div class="roles">' +
      '<div class="role role--driver"><div class="role__tag">The Driver</div><p>Hands on Claude Code. Writes and sends the prompt, runs the commands, ships the change.</p></div>' +
      '<div class="role role--director"><div class="role__tag">The Director</div><p>Eyes on the output. Runs the Review Checklist, decides what\'s wrong, calls the next move. Nothing ships until the Director signs off.</p></div>' +
    '</div>' +
    '<p class="swap"><b>Swap seats at the mid-day break, every day.</b> Both of you build the prompting muscle.</p>' +

    '<div class="sectionlabel">The ten days</div>' +
    '<div class="map">' + tiles + "</div>" +

    '<div class="sectionlabel">The finish line — Day 10 pass/fail</div>' +
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

  // ---------- drawer ----------
  function openDrawer() { $side.classList.add("open"); $scrim.classList.add("show"); }
  function closeDrawer() { $side.classList.remove("open"); $scrim.classList.remove("show"); }
  document.querySelector("[data-menu]").addEventListener("click", openDrawer);
  $scrim.addEventListener("click", closeDrawer);

  // ---------- reset ----------
  document.querySelector("[data-reset]").addEventListener("click", function () {
    if (confirm("Reset all checklist progress? This can't be undone.")) {
      state = { checks: {} }; save(); render();
      toast("Progress reset.");
    }
  });

  // ---------- keyboard ----------
  document.addEventListener("keydown", function (e) {
    if (/input|textarea|select/i.test((e.target.tagName || ""))) return;
    if (e.key === "ArrowRight" || e.key === "j") { var n = SECTIONS[activeIndex() + 1]; if (n) location.hash = n.id; }
    if (e.key === "ArrowLeft" || e.key === "k") { var p = SECTIONS[activeIndex() - 1]; if (p) location.hash = p.id; }
  });

  // ---------- boot ----------
  window.addEventListener("hashchange", render);
  buildNav();
  render();
})();
