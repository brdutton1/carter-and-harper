// Vercel Serverless Function — public read-only view of site_settings.
// Public site fetches this on boot, merges over content.js defaults, renders.
// Reads via the Supabase anon key (RLS allows SELECT for everyone, no write).
//
// Cached at the edge so toggles propagate within ~30s but rendering is instant.
// Admin writes go through the admin-action edge function (service role only).

const SUPABASE_URL  = "https://mydrjwqyqwadkdtjbbyg.supabase.co";
const SUPABASE_ANON = "sb_publishable_yg9VslCveEa69NhM0J2kkg_SiPKjadJ";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const url = SUPABASE_URL + "/rest/v1/site_settings?select=key,value";
    const r = await fetch(url, {
      headers: {
        "apikey": SUPABASE_ANON,
        "Authorization": "Bearer " + SUPABASE_ANON,
        "Accept": "application/json",
      },
    });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "settings_unavailable" });
    }
    const rows = await r.json();
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;

    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
    return res.status(200).json({ ok: true, settings });
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e && e.message || e) });
  }
}
