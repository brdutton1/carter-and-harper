/* Admin dashboard — Bryan's daily check-in.
   Three tabs:
     Studio    — per-kid progress (the original view)
     Metrics   — leads, response time, MRR, Core Web Vitals (signal only, no vanity)
     Settings  — live toggles for the public site (AI proposal, Stripe links, layout)

   Lazy-loaded by auth.js only for admin. All cross-user reads go through SECURITY
   DEFINER RPCs that check is_admin(). Settings writes go through the admin-action
   edge function (admin JWT verified server-side). */
import { SUPABASE_ANON_KEY, FUNCTIONS_URL } from "/sprint/config.js";

// Kept in sync with content.js. If a package or plan slug changes there, update here.
const PACKAGE_OPTIONS = [
  { slug: "one-page",       label: "One-Page Site" },
  { slug: "small-business", label: "Small Business Site" },
  { slug: "glow-up",        label: "Glow-Up Redesign" },
];
const CARE_OPTIONS = [
  { slug: "basic", label: "Basic Care", price: 25 },
  { slug: "plus",  label: "Plus Care",  price: 50 },
];

function esc(t) { return String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function rel(iso) {
  if (!iso) return "no activity yet";
  const d = new Date(String(iso).replace(" ", "T"));
  const m = Math.round((Date.now() - d.getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + " min ago";
  const h = Math.round(m / 60);
  if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  const days = Math.round(h / 24);
  return days + (days === 1 ? " day ago" : " days ago");
}
function daysSince(iso) { if (!iso) return Infinity; return (Date.now() - new Date(String(iso).replace(" ", "T")).getTime()) / 86400000; }
function median(nums) {
  if (!nums.length) return null;
  const s = nums.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export async function renderAdmin({ supabase, container, adminName, adminId, analyze, SHIP, signOut }) {

  let activeTab = "studio";
  let toastTimer;
  function toast(msg, kind) {
    const t = document.querySelector("[data-toast]");
    if (!t) return;
    t.innerHTML = (kind === "err" ? "⚠ " : "✓ ") + esc(msg);
    t.classList.add("show");
    if (kind === "err") t.classList.add("err"); else t.classList.remove("err");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // Let the creator walk the full participant experience, with their own private progress.
  async function walkSprint() {
    let checks = {};
    try {
      const { data } = await supabase.from("sprint_progress").select("checks").eq("user_id", adminId).maybeSingle();
      if (data && data.checks) checks = data.checks;
    } catch (e) {}
    let saveTimer = null;
    const onChange = (c) => {
      try { localStorage.setItem("wss.v1." + adminId, JSON.stringify({ checks: c })); } catch (e) {}
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        supabase.from("sprint_progress").upsert({ user_id: adminId, checks: c, updated_at: new Date().toISOString() })
          .then(({ error }) => { if (error) console.warn("save failed:", error.message); });
      }, 600);
    };
    container.hidden = true;
    document.querySelector("[data-app]").hidden = false;
    window.SprintApp.boot({
      name: adminName, checks, onChange, onLogout: signOut,
      onBack: () => { document.querySelector("[data-app]").hidden = true; container.hidden = false; }
    });
  }

  async function adminAction(body) {
    const { data } = await supabase.auth.getSession();
    const token = data.session ? data.session.access_token : "";
    const res = await fetch(FUNCTIONS_URL + "/admin-action", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + token },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));
    return { ok: res.ok && j.ok, data: j };
  }

  async function loadSettings() {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) return {};
    const map = {};
    (data || []).forEach(r => { map[r.key] = r.value; });
    return map;
  }

  async function loadMetrics() {
    const today = new Date();
    const [{ data: leadsData }, { data: sessionData }] = await Promise.all([
      supabase.rpc("admin_leads", { days: 30 }),
      supabase.auth.getSession(),
    ]);
    const leads = leadsData || [];

    // Vercel Analytics (proxied through our admin-only function)
    let vercel = null;
    try {
      const token = sessionData.session ? sessionData.session.access_token : "";
      const r = await fetch("/api/site-metrics", { headers: { "Authorization": "Bearer " + token } });
      if (r.ok) vercel = await r.json();
    } catch (_e) { /* leave null */ }

    return { leads, vercel, today };
  }

  function renderHeader() {
    const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    return '' +
      '<div class="admin__bar">' +
        '<div><div class="admin__eyebrow">Studio HQ · Admin</div>' +
          '<h1 class="admin__title">Hey ' + esc(adminName) + ' 👋</h1>' +
          '<div class="admin__date">' + esc(dateLabel) + '</div></div>' +
        '<div class="admin__btns">' +
          '<button class="abtn abtn--primary" data-walk>👀 Walk the sprint</button>' +
          '<button class="abtn" data-refresh>↻ Refresh</button>' +
          '<a class="abtn" href="/">← Site</a>' +
          '<button class="abtn abtn--ghost" data-logout>Log out</button>' +
        '</div>' +
      '</div>' +
      '<div class="admin__tabs" data-tabs>' +
        '<button class="tab' + (activeTab === "studio"   ? " is-on" : "") + '" data-tab="studio">Studio</button>' +
        '<button class="tab' + (activeTab === "metrics"  ? " is-on" : "") + '" data-tab="metrics">Metrics</button>' +
        '<button class="tab' + (activeTab === "settings" ? " is-on" : "") + '" data-tab="settings">Settings</button>' +
      '</div>';
  }

  // ============================================================
  // STUDIO TAB — kid progress (existing view + specialty line)
  // ============================================================
  async function renderStudio() {
    let kids = [], activity = [];
    try { const { data, error } = await supabase.rpc("admin_overview"); if (error) throw error; kids = data || []; }
    catch (e) { return '<div class="admin__loading">Couldn\'t load (' + esc(e.message || e) + ').</div>'; }
    try { const { data } = await supabase.rpc("admin_activity", { days: 14 }); activity = data || []; } catch (e) {}

    const amap = {};
    activity.forEach(r => { (amap[r.name] = amap[r.name] || {})[r.day] = r.count; });
    const today = new Date();

    const cards = kids.map(k => {
      const a = analyze(k.checks || {});
      const started = !k.claimed ? "notset" : (a.totalChecks > 0 ? "active" : "idle");
      const last = k.updated_at;
      let attention = "";
      if (!k.claimed) attention = "Hasn't set up their login yet";
      else if (a.totalChecks === 0) attention = "Logged in but hasn't started";
      else if (daysSince(last) >= 2) attention = "No activity in " + Math.floor(daysSince(last)) + " days";

      const strip = a.days.map(d => {
        const cls = d.complete ? "done" : (a.currentDay && a.currentDay.day === d.day ? "current" : "todo");
        return '<span class="adaycell ' + cls + '" title="Day ' + d.day + ': ' + esc(d.label) + ' — ' + d.done + '/' + d.total + '">' + (d.complete ? "✓" : d.day) + "</span>";
      }).join("");

      const kmap = amap[k.name] || {};
      let heat = "";
      for (let i = 13; i >= 0; i--) {
        const dt = new Date(today); dt.setDate(today.getDate() - i);
        const key = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
        const c = kmap[key] || 0;
        const lvl = c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : 3;
        heat += '<span class="aheatcell l' + lvl + '" title="' + key + ': ' + c + ' checks"></span>';
      }

      const current = a.currentDay ? ("Day " + a.currentDay.day + " · " + esc(a.currentDay.label)) : "All 10 days shipped 🎉";

      return '' +
      '<div class="akid">' +
        '<div class="akid__head">' +
          '<div class="akid__ring" style="background: conic-gradient(var(--accent) ' + a.pct + '%, #2a2940 0)"><span>' + a.pct + '%</span></div>' +
          '<div class="akid__id">' +
            '<div class="akid__name">' + esc(k.name) + '</div>' +
            (k.specialty ? '<div class="akid__role">' + esc(k.specialty) + '</div>' : '') +
            '<div class="akid__meta">' + a.shipped + '/10 days shipped · ' + a.totalChecks + ' checks</div>' +
          '</div>' +
          '<div class="akid__last">' + (started === "notset" ? "not set up" : rel(last)) + '</div>' +
        '</div>' +
        (attention ? '<div class="attention">⚠ ' + esc(attention) + '</div>' : '') +
        '<div class="akid__now">On now: <b>' + current + '</b></div>' +
        '<div class="adaystrip">' + strip + '</div>' +
        '<div class="aheat__label">Last 14 days</div><div class="aheat">' + heat + '</div>' +
        '<div class="akid__actions">' +
          '<button class="abtn" data-act="reset_progress" data-target="' + esc(k.name) + '">Reset progress</button>' +
          '<button class="abtn" data-act="reset_password" data-target="' + esc(k.name) + '">Reset password</button>' +
        '</div>' +
      '</div>';
    }).join("");

    return kids.length
      ? '<div class="admin__grid">' + cards + '</div>'
      : '<div class="admin__loading">No kid accounts yet.</div>';
  }

  // ============================================================
  // METRICS TAB — leads, response time, MRR, Core Web Vitals
  // ============================================================
  async function renderMetrics() {
    const { leads, vercel } = await loadMetrics();
    const settings = await loadSettings();

    const now = Date.now();
    const ms7d = 7 * 86400000, ms30d = 30 * 86400000;
    const leadsLast7d  = leads.filter(l => (now - new Date(l.created_at).getTime()) <= ms7d).length;
    const leadsLast30d = leads.length;

    // Response time — median hours from created_at to replied_at, last 30d
    const responseHours = leads
      .filter(l => l.replied_at)
      .map(l => (new Date(l.replied_at).getTime() - new Date(l.created_at).getTime()) / 3600000);
    const medHours = median(responseHours);

    // MRR
    const basic = Number(settings.active_basic_care || 0);
    const plus  = Number(settings.active_plus_care  || 0);
    const mrr   = basic * 25 + plus * 50;

    // Conversion (only computable if we have Vercel visitor data)
    let conv = null, visitors30d = null;
    if (vercel && vercel.ok && vercel.visitors && Array.isArray(vercel.visitors.data)) {
      visitors30d = vercel.visitors.data.reduce((sum, row) => sum + (row.count || 0), 0);
      if (visitors30d > 0) conv = (leadsLast30d / visitors30d) * 100;
    }

    // Sparkline — 30-day leads-per-day
    const buckets = new Array(30).fill(0);
    leads.forEach(l => {
      const d = Math.floor((now - new Date(l.created_at).getTime()) / 86400000);
      if (d >= 0 && d < 30) buckets[29 - d]++;
    });
    const maxBucket = Math.max(1, ...buckets);
    const spark = buckets.map(c => {
      const h = Math.max(2, Math.round((c / maxBucket) * 36));
      return '<span class="spark__bar" style="height:' + h + 'px" title="' + c + ' leads"></span>';
    }).join("");

    // Vitals — Vercel's API shape varies; pull pragmatically with fallbacks.
    const vitals = (vercel && vercel.ok && vercel.vitals) || null;
    const getVital = (key) => {
      if (!vitals) return null;
      const v = vitals[key] || (vitals.metrics && vitals.metrics[key]);
      if (v == null) return null;
      return typeof v === "object" ? (v.p75 ?? v.value ?? v.median ?? null) : v;
    };
    const lcp = getVital("LCP") ?? getVital("lcp");
    const inp = getVital("INP") ?? getVital("inp");
    const cls = getVital("CLS") ?? getVital("cls");

    function vitalCard(label, value, unit, thresholds) {
      if (value == null) {
        return '<div class="vital vital--na"><div class="vital__l">' + label + '</div><div class="vital__v">—</div></div>';
      }
      const num = Number(value);
      let band = "good";
      if (num > thresholds.poor) band = "poor";
      else if (num > thresholds.warn) band = "warn";
      const display = unit === "ms" ? Math.round(num) + " ms" : num.toFixed(2);
      return '<div class="vital vital--' + band + '"><div class="vital__l">' + label + '</div><div class="vital__v">' + display + '</div></div>';
    }

    // Unreplied leads — what Bryan needs to action right now
    const unreplied = leads.filter(l => !l.replied_at).slice(0, 12);
    const leadRows = unreplied.length ? unreplied.map(l => {
      const when = new Date(l.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      const goal = l.goal ? '<span class="lead__goal">' + esc(l.goal) + '</span>' : '';
      return '' +
        '<div class="lead">' +
          '<div class="lead__when">' + esc(when) + '</div>' +
          '<div class="lead__what">' +
            '<span class="lead__type">' + esc(l.project_type || "Project") + '</span>' +
            ' · <span class="lead__budget">' + esc(l.budget || "no budget") + '</span>' +
            ' · <span class="lead__source">via ' + esc(l.source || "?") + '</span>' +
            (goal ? '<br>' + goal : '') +
          '</div>' +
          '<button class="abtn lead__btn" data-mark-replied="' + esc(l.id) + '">Mark replied</button>' +
        '</div>';
    }).join("") : '<div class="metric-empty">No unreplied leads. Inbox zero. 🎉</div>';

    const vercelSetupHint = (!vercel || !vercel.ok)
      ? '<div class="metric-empty">' +
          'Vercel Analytics not configured. Set <code>VERCEL_ANALYTICS_TOKEN</code> + <code>VERCEL_PROJECT_ID</code> in Vercel env vars to populate Core Web Vitals and conversion rate here. ' +
          'In the meantime, see the live numbers in the ' +
          '<a href="https://vercel.com/dashboard" target="_blank" rel="noopener">Vercel dashboard</a>.' +
        '</div>'
      : '';

    return '' +
      '<div class="metric-grid">' +
        '<div class="metric">' +
          '<div class="metric__l">Leads · last 7 days</div>' +
          '<div class="metric__v">' + leadsLast7d + '</div>' +
          '<div class="metric__s">' + leadsLast30d + ' in last 30</div>' +
        '</div>' +
        '<div class="metric">' +
          '<div class="metric__l">Median response time</div>' +
          '<div class="metric__v">' + (medHours == null ? "—" : (medHours < 24 ? medHours.toFixed(1) + " hrs" : (medHours / 24).toFixed(1) + " days")) + '</div>' +
          '<div class="metric__s">target: under 48 hrs</div>' +
        '</div>' +
        '<div class="metric">' +
          '<div class="metric__l">Care plan MRR</div>' +
          '<div class="metric__v">$' + mrr + '</div>' +
          '<div class="metric__s">' + basic + ' Basic · ' + plus + ' Plus</div>' +
        '</div>' +
        '<div class="metric">' +
          '<div class="metric__l">Conversion (30d)</div>' +
          '<div class="metric__v">' + (conv == null ? "—" : conv.toFixed(2) + "%") + '</div>' +
          '<div class="metric__s">' + (visitors30d == null ? "needs Vercel Analytics" : visitors30d + " visitors") + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="metric-section">' +
        '<div class="metric-section__h">Leads · last 30 days</div>' +
        '<div class="spark">' + spark + '</div>' +
      '</div>' +

      '<div class="metric-section">' +
        '<div class="metric-section__h">Action: leads to reply to</div>' +
        '<div class="leads">' + leadRows + '</div>' +
      '</div>' +

      '<div class="metric-section">' +
        '<div class="metric-section__h">Site health · Core Web Vitals (real users, last 30d)</div>' +
        '<div class="vitals">' +
          vitalCard("LCP", lcp, "ms", { warn: 2500, poor: 4000 }) +
          vitalCard("INP", inp, "ms", { warn: 200,  poor: 500  }) +
          vitalCard("CLS", cls, "",   { warn: 0.1,  poor: 0.25 }) +
        '</div>' +
        '<div class="vitals__legend">Green = good, amber = needs work, red = poor. Thresholds: LCP &lt; 2.5s · INP &lt; 200ms · CLS &lt; 0.1</div>' +
        vercelSetupHint +
      '</div>';
  }

  // ============================================================
  // SETTINGS TAB — live toggles
  // ============================================================
  async function renderSettings() {
    const s = await loadSettings();

    const aiOn   = s.ai_proposal_enabled === true;
    const aiCall = String(s.ai_callout || "");
    const basicLink = String(s.care_basic_payment_link || "");
    const plusLink  = String(s.care_plus_payment_link  || "");
    const webformsKey = String(s.form_access_key || "");
    const popPkg  = String(s.popular_package   || "");
    const popCare = String(s.popular_care_plan || "");
    const hidPkg  = new Set(Array.isArray(s.packages_hidden)   ? s.packages_hidden   : []);
    const hidCare = new Set(Array.isArray(s.care_plans_hidden) ? s.care_plans_hidden : []);
    const basicCount = Number(s.active_basic_care || 0);
    const plusCount  = Number(s.active_plus_care  || 0);

    return '' +
      // AI proposal
      '<div class="spanel" data-panel="ai">' +
        '<h2 class="spanel__h">AI proposal engine</h2>' +
        '<p class="spanel__sub">When ON, the form delivers an AI-drafted proposal in ~90 seconds. When OFF, leads go to your inbox by mailto.</p>' +
        '<label class="srow"><span>Endpoint enabled</span>' +
          '<input type="checkbox" data-k="ai_proposal_enabled"' + (aiOn ? " checked" : "") + '></label>' +
        '<label class="srow srow--col"><span>Callout shown under the form</span>' +
          '<textarea data-k="ai_callout" rows="2" placeholder="e.g. Powered by AI — get a real proposal in about 90 seconds.">' + esc(aiCall) + '</textarea></label>' +
        '<div class="spanel__save"><button class="btn btn--primary" data-save>Save AI settings</button></div>' +
      '</div>' +

      // Stripe care plans
      '<div class="spanel" data-panel="stripe">' +
        '<h2 class="spanel__h">Stripe care plan links</h2>' +
        '<p class="spanel__sub">Paste the Stripe Payment Link URL for each plan. Empty = button jumps to the contact form instead.</p>' +
        '<label class="srow srow--col"><span>Basic Care ($25/mo)</span>' +
          '<input type="url" data-k="care_basic_payment_link" placeholder="https://buy.stripe.com/…" value="' + esc(basicLink) + '"></label>' +
        '<label class="srow srow--col"><span>Plus Care ($50/mo)</span>' +
          '<input type="url" data-k="care_plus_payment_link" placeholder="https://buy.stripe.com/…" value="' + esc(plusLink) + '"></label>' +
        '<div class="spanel__save"><button class="btn btn--primary" data-save>Save Stripe links</button></div>' +
      '</div>' +

      // Layout
      '<div class="spanel" data-panel="layout">' +
        '<h2 class="spanel__h">Layout</h2>' +
        '<p class="spanel__sub">Choose which package and care plan get the "Most popular" badge. Hide anything you don\'t want to show.</p>' +

        '<div class="sgroup__h">Most popular package</div>' +
        '<div class="schoices">' +
          PACKAGE_OPTIONS.map(p => '' +
            '<label class="schip"><input type="radio" name="popular_package" value="' + p.slug + '"' +
              (popPkg === p.slug ? " checked" : "") + '> ' + esc(p.label) + '</label>'
          ).join("") +
        '</div>' +

        '<div class="sgroup__h">Most popular care plan</div>' +
        '<div class="schoices">' +
          CARE_OPTIONS.map(p => '' +
            '<label class="schip"><input type="radio" name="popular_care_plan" value="' + p.slug + '"' +
              (popCare === p.slug ? " checked" : "") + '> ' + esc(p.label) + '</label>'
          ).join("") +
        '</div>' +

        '<div class="sgroup__h">Hide packages</div>' +
        '<div class="schoices">' +
          PACKAGE_OPTIONS.map(p => '' +
            '<label class="schip"><input type="checkbox" name="packages_hidden" value="' + p.slug + '"' +
              (hidPkg.has(p.slug) ? " checked" : "") + '> ' + esc(p.label) + '</label>'
          ).join("") +
        '</div>' +

        '<div class="sgroup__h">Hide care plans</div>' +
        '<div class="schoices">' +
          CARE_OPTIONS.map(p => '' +
            '<label class="schip"><input type="checkbox" name="care_plans_hidden" value="' + p.slug + '"' +
              (hidCare.has(p.slug) ? " checked" : "") + '> ' + esc(p.label) + '</label>'
          ).join("") +
        '</div>' +

        '<div class="spanel__save"><button class="btn btn--primary" data-save>Save layout</button></div>' +
      '</div>' +

      // Form fallback
      '<div class="spanel" data-panel="form">' +
        '<h2 class="spanel__h">Form fallback (Web3Forms)</h2>' +
        '<p class="spanel__sub">Optional. If AI is off, the form uses this key to deliver leads by email. If empty, it falls back to mailto.</p>' +
        '<label class="srow srow--col"><span>Web3Forms access key</span>' +
          '<input type="text" data-k="form_access_key" placeholder="(empty = use mailto)" value="' + esc(webformsKey) + '"></label>' +
        '<div class="spanel__save"><button class="btn btn--primary" data-save>Save form key</button></div>' +
      '</div>' +

      // Active care plans (MRR input)
      '<div class="spanel" data-panel="mrr">' +
        '<h2 class="spanel__h">Active care plans (drives MRR card)</h2>' +
        '<p class="spanel__sub">Update these as care-plan subscribers come and go. Later we\'ll wire this directly to Stripe.</p>' +
        '<label class="srow"><span>Active Basic ($25/mo)</span>' +
          '<input type="number" min="0" data-k="active_basic_care" value="' + basicCount + '"></label>' +
        '<label class="srow"><span>Active Plus ($50/mo)</span>' +
          '<input type="number" min="0" data-k="active_plus_care" value="' + plusCount + '"></label>' +
        '<div class="spanel__save"><button class="btn btn--primary" data-save>Save active counts</button></div>' +
      '</div>';
  }

  // ---------- panel save handlers ----------
  function collectPanel(panelEl) {
    const out = {};
    panelEl.querySelectorAll("[data-k]").forEach(node => {
      const k = node.getAttribute("data-k");
      if (node.type === "checkbox") out[k] = node.checked;
      else if (node.type === "number") out[k] = Number(node.value || 0);
      else out[k] = node.value;
    });
    // grouped radios / multi-checkboxes
    const radios = panelEl.querySelectorAll('input[type="radio"][name]');
    const seenName = new Set();
    radios.forEach(r => {
      if (seenName.has(r.name)) return; seenName.add(r.name);
      const chosen = panelEl.querySelector('input[type="radio"][name="' + r.name + '"]:checked');
      if (chosen) out[r.name] = chosen.value;
    });
    const checkboxGroups = {};
    panelEl.querySelectorAll('input[type="checkbox"][name]').forEach(c => {
      if (!checkboxGroups[c.name]) checkboxGroups[c.name] = [];
      if (c.checked) checkboxGroups[c.name].push(c.value);
    });
    Object.assign(out, checkboxGroups);
    return out;
  }

  function wireSettings(root) {
    root.querySelectorAll(".spanel").forEach(panel => {
      const btn = panel.querySelector("[data-save]");
      if (!btn) return;
      btn.addEventListener("click", async () => {
        const changes = collectPanel(panel);
        const label = btn.textContent;
        btn.disabled = true; btn.textContent = "Saving…";
        const r = await adminAction({ action: "update_settings", changes });
        btn.disabled = false; btn.textContent = label;
        if (r.ok) toast("Saved. Public site will pick it up within a minute.");
        else toast(r.data.error || "Save failed.", "err");
      });
    });
  }

  function wireStudio(root) {
    root.querySelectorAll(".abtn[data-act]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const act = btn.getAttribute("data-act"), target = btn.getAttribute("data-target");
        const msg = act === "reset_progress"
          ? "Reset ALL of " + target + "'s checklist progress? This can't be undone."
          : "Reset " + target + "'s password? They'll set a new one with the studio code next login.";
        if (!confirm(msg)) return;
        btn.disabled = true; btn.textContent = "Working…";
        const r = await adminAction({ action: act, target });
        if (r.ok) load(); else { btn.disabled = false; btn.textContent = "Failed — retry"; }
      });
    });
  }

  function wireMetrics(root) {
    root.querySelectorAll("[data-mark-replied]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-mark-replied");
        btn.disabled = true; btn.textContent = "Marking…";
        const { error } = await supabase.rpc("admin_mark_replied", { lead_id: id });
        if (error) { btn.disabled = false; btn.textContent = "Failed — retry"; toast(error.message, "err"); }
        else { toast("Marked replied."); load(); }
      });
    });
  }

  // ---------- top-level load + tab switcher ----------
  async function load() {
    container.innerHTML = '<div class="admin"><div class="admin__loading">Loading studio data…</div></div>';
    let pane;
    if (activeTab === "studio")        pane = await renderStudio();
    else if (activeTab === "metrics")  pane = await renderMetrics();
    else if (activeTab === "settings") pane = await renderSettings();
    else pane = '';

    container.innerHTML =
      '<div class="admin">' +
        renderHeader() +
        '<div class="admin__pane">' + pane + '</div>' +
        '<div class="admin__foot">Settings + metrics live here. <a href="/">← Studio site</a></div>' +
      '</div>';

    container.querySelector("[data-refresh]").addEventListener("click", load);
    container.querySelector("[data-logout]").addEventListener("click", signOut);
    container.querySelector("[data-walk]").addEventListener("click", walkSprint);
    container.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => { activeTab = btn.getAttribute("data-tab"); load(); });
    });

    if (activeTab === "studio")   wireStudio(container);
    if (activeTab === "metrics")  wireMetrics(container);
    if (activeTab === "settings") wireSettings(container);
  }

  await load();
}
