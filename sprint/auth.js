/* Auth gate for the Web Studio Sprint portal.
   - No session  -> render the login screen (claim / sign-in / reset).
   - Session      -> hydrate progress from Supabase and boot the portal app.
   All three logins (Carter, Harper, Bryan) share the same tile + password flow;
   role detection happens server-side via the me() RPC after sign-in. */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, FUNCTIONS_URL, ACCOUNTS } from "/sprint/config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $auth = document.getElementById("auth");
const emailFor = (name) => (ACCOUNTS.find(a => a.name.toLowerCase() === String(name).toLowerCase()) || {}).email;

let saveTimer = null;

// ---------- progress sync ----------
function makeOnChange(uid) {
  return function (checks) {
    try { localStorage.setItem("wss.v1." + uid, JSON.stringify({ checks })); } catch (e) {}
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      supabase.from("sprint_progress")
        .upsert({ user_id: uid, checks, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.warn("progress sync failed:", error.message); });
    }, 600);
  };
}
function makeOnToggle(uid) {
  return function (item, checked) {
    supabase.from("activity_log").insert({ user_id: uid, item: item, checked: checked })
      .then(({ error }) => { if (error) console.warn("activity log failed:", error.message); });
  };
}
async function loadProgress(uid) {
  try {
    const { data, error } = await supabase.from("sprint_progress").select("checks").eq("user_id", uid).maybeSingle();
    if (!error && data && data.checks) return data.checks;
  } catch (e) {}
  try { const c = JSON.parse(localStorage.getItem("wss.v1." + uid)); if (c && c.checks) return c.checks; } catch (e) {}
  return {};
}

// ---------- edge function helper ----------
async function callFn(path, body) {
  let res, data = {};
  try {
    res = await fetch(FUNCTIONS_URL + "/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY },
      body: JSON.stringify(body)
    });
    data = await res.json().catch(() => ({}));
  } catch (e) { return { ok: false, data: { error: "Network error — check your connection." } }; }
  return { ok: res.ok && data.ok, data };
}

// ---------- portal handoff ----------
async function startPortal(user, me) {
  const acct = ACCOUNTS.find(a => a.email.toLowerCase() === String(user.email || "").toLowerCase());
  if (!acct) { await supabase.auth.signOut(); return showLogin("That account isn't part of this studio."); }
  const checks = await loadProgress(user.id);
  $auth.hidden = true;
  document.querySelector("[data-app]").hidden = false;
  document.body.classList.remove("preboot");
  window.SprintApp.boot({
    name: acct.name,
    specialty: (me && me.specialty) || "",
    checks,
    onChange: makeOnChange(user.id),
    onToggle: makeOnToggle(user.id),
    onLogout: doLogout,
  });
}
async function doLogout() { try { await supabase.auth.signOut(); } catch (e) {} location.reload(); }

// Route a logged-in user to the kid portal or the admin dashboard by role.
async function route(user) {
  let me = { role: "kid", name: null, specialty: null };
  try {
    const { data } = await supabase.rpc("me");
    if (data) me = { role: data.role || "kid", name: data.name, specialty: data.specialty };
  } catch (e) {}
  if (me.role === "admin") return startAdmin(user, me.name);
  return startPortal(user, me);
}
async function startAdmin(user, name) {
  $auth.hidden = true;
  document.querySelector("[data-app]").hidden = true;
  const el = document.getElementById("admin");
  el.hidden = false;
  document.body.classList.remove("preboot");
  const mod = await import("/sprint/admin.js");
  mod.renderAdmin({
    supabase, container: el, adminName: name || "Admin",
    analyze: window.SprintApp.analyze, SHIP: window.SprintApp.SHIP, signOut: doLogout
  });
}

// ---------- login screen ----------
function esc(t) { return String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

async function showLogin(message) {
  document.body.classList.add("preboot");
  document.querySelector("[data-app]").hidden = true;
  const adminEl = document.getElementById("admin"); if (adminEl) adminEl.hidden = true;
  $auth.hidden = false;
  $auth.innerHTML =
    '<div class="login">' +
      '<div class="login__glow"></div>' +
      '<div class="login__card">' +
        '<div class="login__brand">🚀 Carter &amp; Harper Studio</div>' +
        '<h1 class="login__title">Web Studio <span class="g">Sprint</span></h1>' +
        '<p class="login__sub">Your studio. Pick your name to log in.</p>' +
        (message ? '<div class="login__err show">' + esc(message) + '</div>' : '<div class="login__err" data-err></div>') +
        '<div class="login__who" data-who><div class="login__loading">Loading…</div></div>' +
        '<div class="login__form" data-form hidden></div>' +
      '</div>' +
    '</div>';

  // Fetch every account (kids + admin). All three log in via the same tile flow.
  // Each profile carries its role + specialty, displayed under the name.
  let profiles = [];
  try {
    const { data } = await supabase.from("profiles").select("name, claimed, role, specialty");
    profiles = data || [];
  } catch (e) {}
  if (!profiles.length) profiles = ACCOUNTS.map(a => ({ name: a.name, claimed: true, role: a.name === "Bryan" ? "admin" : "kid" }));
  // Order: kids first (in config order), then admin.
  const order = ACCOUNTS.map(a => a.name);
  profiles.sort((a, b) => {
    if (a.role !== b.role) return a.role === "admin" ? 1 : -1;
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  const who = $auth.querySelector("[data-who]");
  who.innerHTML = profiles.map(p => {
    const role = p.role === "admin" ? "Admin" : (p.specialty || "Studio member");
    const isAdmin = p.role === "admin";
    return '<button class="who' + (isAdmin ? " who--admin" : "") + '"' +
      ' data-name="' + esc(p.name) + '"' +
      ' data-claimed="' + (p.claimed ? "1" : "0") + '">' +
      '<span class="who__av">' + esc(p.name.charAt(0)) + "</span>" +
      '<span class="who__id">' +
        '<span class="who__name">' + esc(p.name) + "</span>" +
        '<span class="who__role">' + esc(role) + "</span>" +
      "</span>" +
      '<span class="who__status">' + (p.claimed ? "Log in →" : "Set up →") + "</span>" +
    "</button>";
  }).join("");
  who.querySelectorAll(".who").forEach(btn => {
    btn.addEventListener("click", () => openForm(btn.getAttribute("data-name"), btn.getAttribute("data-claimed") === "1"));
  });
}

function showErr(msg) { const e = $auth.querySelector("[data-err]"); if (e) { e.textContent = msg; e.classList.add("show"); } }

function openForm(name, claimed, mode) {
  const who = $auth.querySelector("[data-who]");
  const form = $auth.querySelector("[data-form]");
  who.hidden = true; form.hidden = false;
  const setup = mode === "setup" || !claimed;

  form.innerHTML =
    '<button class="login__back" data-back>← Not ' + esc(name) + "?</button>" +
    '<div class="login__avbig">' + esc(name.charAt(0)) + "</div>" +
    '<h2 class="login__name">' + esc(name) + "</h2>" +
    (setup
      ? '<p class="login__hint">First time — create your password. You\'ll need the studio access code from Bryan.</p>' +
        '<input class="login__in" data-code type="text" placeholder="Studio access code" autocomplete="off">' +
        '<input class="login__in" data-pw type="password" placeholder="Choose a password (8+ characters)" autocomplete="new-password">' +
        '<button class="btn btn--primary login__go" data-claim>Create my login →</button>'
      : '<p class="login__hint">Welcome back. Enter your password.</p>' +
        '<input class="login__in" data-pw type="password" placeholder="Your password" autocomplete="current-password">' +
        '<button class="btn btn--primary login__go" data-signin>Log in →</button>' +
        '<button class="login__link" data-forgot>Forgot your password?</button>') +
    '<div class="login__err" data-err></div>';

  form.querySelector("[data-back]").addEventListener("click", showLogin);
  const pw = form.querySelector("[data-pw]");
  const go = form.querySelector(".login__go");

  if (setup) {
    const codeEl = form.querySelector("[data-code]");
    const claim = async () => {
      const code = codeEl.value.trim(), password = pw.value;
      if (!code) return showErr("Enter the studio access code.");
      if (password.length < 8) return showErr("Password must be at least 8 characters.");
      setBusy(go, "Creating…");
      const r = await callFn("claim-account", { name, accessCode: code, password });
      if (!r.ok) { setBusy(go, false, "Create my login →"); return showErr(r.data.error || "Couldn't create the login."); }
      const { error } = await supabase.auth.signInWithPassword({ email: emailFor(name), password });
      if (error) { setBusy(go, false, "Create my login →"); return showErr(error.message); }
      const { data: { user } } = await supabase.auth.getUser();
      route(user);
    };
    go.addEventListener("click", claim);
    pw.addEventListener("keydown", e => { if (e.key === "Enter") claim(); });
  } else {
    const signin = async () => {
      const password = pw.value;
      if (!password) return showErr("Enter your password.");
      setBusy(go, "Logging in…");
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailFor(name), password });
      if (error || !data.user) { setBusy(go, false, "Log in →"); return showErr("Wrong password. Try again, or use 'Forgot your password?'"); }
      route(data.user);
    };
    go.addEventListener("click", signin);
    pw.addEventListener("keydown", e => { if (e.key === "Enter") signin(); });
    form.querySelector("[data-forgot]").addEventListener("click", () => openReset(name));
  }
  setTimeout(() => { const f = form.querySelector("input"); if (f) f.focus(); }, 30);
}

function openReset(name) {
  const form = $auth.querySelector("[data-form]");
  form.innerHTML =
    '<button class="login__back" data-back>← Back</button>' +
    '<div class="login__avbig">' + esc(name.charAt(0)) + "</div>" +
    '<h2 class="login__name">Reset ' + esc(name) + "'s login</h2>" +
    '<p class="login__hint">Enter the studio access code to reset. You\'ll then create a new password.</p>' +
    '<input class="login__in" data-code type="text" placeholder="Studio access code" autocomplete="off">' +
    '<button class="btn btn--primary login__go" data-reset>Reset →</button>' +
    '<div class="login__err" data-err></div>';
  form.querySelector("[data-back]").addEventListener("click", () => openForm(name, true));
  const code = form.querySelector("[data-code]");
  const go = form.querySelector("[data-reset]");
  const reset = async () => {
    if (!code.value.trim()) return showErr("Enter the studio access code.");
    setBusy(go, "Resetting…");
    const r = await callFn("reset-account", { name, accessCode: code.value.trim() });
    if (!r.ok) { setBusy(go, false, "Reset →"); return showErr(r.data.error || "Reset failed."); }
    openForm(name, false, "setup");
  };
  go.addEventListener("click", reset);
  code.addEventListener("keydown", e => { if (e.key === "Enter") reset(); });
}

function setBusy(btn, busyText, restoreText) {
  if (busyText) { btn.dataset.txt = btn.textContent; btn.textContent = busyText; btn.disabled = true; }
  else { btn.textContent = restoreText || btn.dataset.txt || btn.textContent; btn.disabled = false; }
}

// ---------- boot ----------
function hideBoot() { const b = document.querySelector("[data-boot]"); if (b) b.remove(); }
supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") location.reload(); });

(async function init() {
  let session = null;
  try { ({ data: { session } } = await supabase.auth.getSession()); } catch (e) {}
  hideBoot();
  if (session && session.user) return route(session.user);
  showLogin();
})();
