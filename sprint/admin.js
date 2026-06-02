/* Admin dashboard — Bryan's daily check-in.
   Lazy-loaded by auth.js only for the admin. Reads progress via the
   security-checked admin_overview()/admin_activity() RPCs and reuses
   SprintApp.analyze() so the numbers match the kids' app exactly. */
import { SUPABASE_ANON_KEY, FUNCTIONS_URL } from "/sprint/config.js";

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

export async function renderAdmin({ supabase, container, adminName, analyze, SHIP, signOut }) {
  async function adminAction(action, target) {
    const { data } = await supabase.auth.getSession();
    const token = data.session ? data.session.access_token : "";
    const res = await fetch(FUNCTIONS_URL + "/admin-action", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + token },
      body: JSON.stringify({ action, target })
    });
    const j = await res.json().catch(() => ({}));
    return res.ok && j.ok;
  }

  async function load() {
    container.innerHTML = '<div class="admin__loading">Loading studio data…</div>';
    let kids = [], activity = [];
    try { const { data, error } = await supabase.rpc("admin_overview"); if (error) throw error; kids = data || []; }
    catch (e) { container.innerHTML = '<div class="admin__loading">Couldn\'t load (' + esc(e.message || e) + ').</div>'; return; }
    try { const { data } = await supabase.rpc("admin_activity", { days: 14 }); activity = data || []; } catch (e) {}

    // activity map: name -> { 'YYYY-MM-DD': count }
    const amap = {};
    activity.forEach(r => { (amap[r.name] = amap[r.name] || {})[r.day] = r.count; });

    const today = new Date();
    const dateLabel = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

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

      // 14-day heatmap
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
          '<div class="akid__id"><div class="akid__name">' + esc(k.name) + '</div>' +
            '<div class="akid__meta">' + a.shipped + '/10 days shipped · ' + a.totalChecks + ' checks</div></div>' +
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

    container.innerHTML =
      '<div class="admin">' +
        '<div class="admin__bar">' +
          '<div><div class="admin__eyebrow">Studio HQ · Admin</div>' +
            '<h1 class="admin__title">Hey ' + esc(adminName) + ' 👋</h1>' +
            '<div class="admin__date">' + esc(dateLabel) + '</div></div>' +
          '<div class="admin__btns"><button class="abtn" data-refresh>↻ Refresh</button>' +
            '<button class="abtn abtn--ghost" data-logout>Log out</button></div>' +
        '</div>' +
        (kids.length ? '<div class="admin__grid">' + cards + '</div>'
                     : '<div class="admin__loading">No kid accounts yet.</div>') +
        '<div class="admin__foot">Updates live as Carter & Harper check items. <a href="/">← Studio site</a></div>' +
      '</div>';

    container.querySelector("[data-refresh]").addEventListener("click", load);
    container.querySelector("[data-logout]").addEventListener("click", signOut);
    container.querySelectorAll(".abtn[data-act]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const act = btn.getAttribute("data-act"), target = btn.getAttribute("data-target");
        const msg = act === "reset_progress"
          ? "Reset ALL of " + target + "'s checklist progress? This can't be undone."
          : "Reset " + target + "'s password? They'll set a new one with the studio code next login.";
        if (!confirm(msg)) return;
        btn.disabled = true; btn.textContent = "Working…";
        const ok = await adminAction(act, target);
        if (ok) load(); else { btn.disabled = false; btn.textContent = "Failed — retry"; }
      });
    });
  }

  await load();
}
