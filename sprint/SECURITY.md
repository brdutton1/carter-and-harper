# Web Studio Sprint portal — security posture

This is how the Sprint portal (`/sprint`) is secured. It's also a worked example of the
non-negotiable standard the program teaches: **RLS on every table, the public key can't read
private data, and no secret ever ships to the browser.**

## Stack
- Static site (HTML/CSS/JS, zero build) on Vercel.
- Supabase for auth + Postgres + edge functions (project `mydrjwqyqwadkdtjbbyg`).
- supabase-js loaded in the browser with the **publishable/anon key only**.

## Tables & RLS (all tables have RLS enabled)
| Table | Who can read | Who can write |
|-------|--------------|---------------|
| `profiles` | anon/authenticated may read **only** `(name, claimed, role)` (column-grant); no email/uid leak | **no client write policy** — only the service role (edge functions) writes |
| `sprint_progress` | **owner only** (`user_id = auth.uid()`) | owner only (insert/update) |
| `activity_log` | **no select policy** (nobody reads directly) | insert-own only |

Cross-user reads happen **only** through `SECURITY DEFINER` RPCs that check the caller:
- `me()` → returns the caller's own `{name, role}`.
- `is_admin()` → true only for the admin profile.
- `admin_overview()` / `admin_activity()` → **raise `not authorized`** unless `is_admin()`.
  (Anon `EXECUTE` is revoked; verified a kid session gets `not authorized`.)

## Keys & secrets
- **Browser ships only** the publishable/anon key (`sprint/config.js`). RLS is the real guard.
- The **service-role key is never in the repo or the browser** — it's auto-injected into Supabase
  edge functions at runtime only (`seed`, `claim-account`, `reset-account`, `admin-action`).
- The **studio access code** lives server-side in the edge functions (env override
  `STUDIO_ACCESS_CODE`), never in client code.
- Admin actions (`admin-action`) are gated by the **admin's JWT**, not the access code, and only
  target kid accounts.

## How to verify (run before any deploy)
1. Supabase: `get_advisors(security)` → no RLS-disabled / exposed-table warnings.
2. Prove RLS with the public key — the taught prompt:
   *"show me the RLS policies on every table and prove they work."*
   Expected: a visitor (anon key) can't read another user's `sprint_progress`/`activity_log`.
3. Repo grep confirms no `service_role` key / JWT / secret is committed.

## Recommended optional hardening
- Set `STUDIO_ACCESS_CODE` as a Supabase **function secret** (Edge Functions → Secrets) so it's
  env-only rather than relying on the in-function default.
- Enable Supabase Auth **leaked-password protection** (HaveIBeenPwned check).
