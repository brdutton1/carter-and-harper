// Vercel Serverless Function — admin-only proxy for Vercel Web Analytics + Speed Insights.
//
// Why a proxy: Vercel's Analytics REST API needs an API token that we should NEVER expose
// in the browser. The admin dashboard hits this endpoint with the admin's Supabase JWT;
// we verify the JWT against Supabase (is the caller an admin?), then call Vercel server-side.
//
// Falls back gracefully if VERCEL_ANALYTICS_TOKEN / VERCEL_PROJECT_ID aren't set —
// returns ok:false with a "not_configured" hint and the dashboard shows a "Set up
// Vercel Analytics in env vars" message instead of crashing.

const SUPABASE_URL  = "https://mydrjwqyqwadkdtjbbyg.supabase.co";
const SUPABASE_ANON = "sb_publishable_yg9VslCveEa69NhM0J2kkg_SiPKjadJ";

async function isAdminCaller(token) {
  if (!token) return false;
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/is_admin", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON,
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!r.ok) return false;
    const v = await r.json();
    return v === true;
  } catch (_e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const token = (req.headers.authorization || "").replace(/^Bearer /i, "").trim();
  if (!(await isAdminCaller(token))) {
    return res.status(403).json({ ok: false, error: "not_authorized" });
  }

  const vercelToken   = process.env.VERCEL_ANALYTICS_TOKEN;
  const vercelProject = process.env.VERCEL_PROJECT_ID;
  const vercelTeam    = process.env.VERCEL_TEAM_ID; // optional

  if (!vercelToken || !vercelProject) {
    return res.status(200).json({
      ok: false,
      error: "not_configured",
      hint: "Set VERCEL_ANALYTICS_TOKEN and VERCEL_PROJECT_ID in Vercel env vars to enable site metrics.",
    });
  }

  // 30-day window — matches the admin dashboard timeframe.
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const until = Date.now();
  const teamQ = vercelTeam ? "&teamId=" + encodeURIComponent(vercelTeam) : "";
  const base  = "https://vercel.com/api/web/insights";

  // Pull visitor totals + the three Core Web Vitals (LCP, INP, CLS).
  // If Vercel changes these endpoints we degrade gracefully (null metrics).
  async function pull(path) {
    try {
      const r = await fetch(base + path + (path.includes("?") ? "&" : "?") +
        "projectId=" + encodeURIComponent(vercelProject) +
        "&from=" + since + "&to=" + until + teamQ, {
        headers: { "Authorization": "Bearer " + vercelToken },
      });
      if (!r.ok) return null;
      return await r.json();
    } catch (_e) { return null; }
  }

  const [visits, vitals] = await Promise.all([
    pull("/stats?type=visitors&granularity=day"),
    pull("/vitals?metric=all"),
  ]);

  res.setHeader("Cache-Control", "private, max-age=60");
  return res.status(200).json({
    ok: true,
    window: { since, until },
    visitors: visits,
    vitals,
  });
}
