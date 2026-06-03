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

## Persistence guarantees (claim once, password forever)

The portal is designed so that once a user (kid or admin) sets their password, they never see
the "set up with access code" form again — unless they explicitly choose to reset. The model:

- **Sessions persist on the device.** `createClient` is configured with
  `persistSession: true`, `autoRefreshToken: true`, `storageKey: "wss-auth"`. The token lives
  in `localStorage` and refreshes silently for the lifetime of the refresh token (~1 year by
  default). A logged-in user stays logged in across reloads, tab closes, and browser restarts.
- **`profiles.claimed` is the source of truth for "needs the access code".** Only flipped to
  `true` by `claim-account` (first-time setup) and back to `false` by `reset-account` or
  `admin-action: reset_password`. **Nothing else** writes to this column — no triggers, no
  automatic flows, no boot path.
- **Forensic trail.** A `profile_audit` table + trigger records every change to `claimed`
  with timestamp + `auth.uid()` of the writer. Edge-function writes (service role) show
  `changed_by = NULL`, distinguishing them from any future client-side writes. Inspect via
  the admin-only `admin_audit()` RPC, or by querying `public.profile_audit` directly.
- **Accident-resistant resets.** Both kid and admin "Forgot your password?" links require a
  two-step `confirm()` before opening the reset form. The admin dashboard's "Reset password"
  per-kid button is also behind a confirm + admin-JWT-gated edge function.
- **409 fallback.** If `claim-account` ever rejects with 409 ("already claimed"), the client
  automatically transitions to the password-only form instead of showing an error — so even
  if the `claimed` flag drifted, the worst the user sees is "type your password" (never an
  unwanted re-claim that would overwrite a real password).

### Operating rule for the maintainer
Do **not** invoke `reset-account` / `admin-action: reset_password` outside of an explicit
user-initiated flow. Running these via curl/eval as "test cleanup" puts the affected user
back in claim-mode and will surface as "the access code keeps reappearing."

### Why no `has_password` RPC?
An earlier draft proposed deriving "is the password real?" from `auth.users.encrypted_password
IS NOT NULL`. That fails after a reset: `reset-account` scrambles the password to a non-null
but unusable value, so `encrypted_password` is misleading. `profiles.claimed` is the only
reliable signal; the audit trail and accident guards above are what make it iron-clad.
