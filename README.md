# Carter & Harper — Web Design Site

A fast static site with an AI proposal engine and Stripe-powered care plans. Plain HTML/CSS/JS for the front end; one tiny Vercel serverless function does the AI + email work. **All editable content lives in [`content.js`](content.js).**

> Carter's plain-English instructions are in **[EDITING-GUIDE.md](EDITING-GUIDE.md)**. This README is the technical/admin reference for Bryan.

## How it works

```
Visitor fills out the form
  → POST /api/proposal
  → Claude (Haiku 4.5) drafts a custom proposal
  → Resend emails the proposal to the lead AND a copy to Bryan
  → Bryan reviews and personally follows up
```

If the API/email fails for any reason, the form silently falls back to opening the visitor's email app — the lead never sees a broken state.

## Files

| File | What it is |
|------|------------|
| `content.js` | **The only file Carter edits.** All text, services, prices, colors, contact email, Stripe links. |
| `index.html` | Page structure (sections fill from `content.js`). |
| `styles.css` | Styling. Colors come from `content.js`. |
| `main.js` | Renders content, applies colors, submits the form. |
| `api/proposal.js` | Serverless function. Receives form, calls Claude, sends email via Resend. |
| `package.json` | Declares `@anthropic-ai/sdk` and `resend` deps (used only by the function). |
| `vercel.json` | Vercel hosting + function config. |
| `.env.local.example` | Template for local env vars. |
| `EDITING-GUIDE.md` | Carter's plain-English how-to. |

## Run locally

The static site alone: just open `index.html` (or `npx serve` from this folder).
The full stack including `/api/proposal`: `npx vercel dev` (requires the Vercel CLI; once authed, it loads `.env.local` and exposes the function on `http://localhost:3000`).

## Setup (Bryan, one time, ~30 min total)

### 1. Get an Anthropic API key
- [console.anthropic.com](https://console.anthropic.com/) → API Keys → Create. Copy the `sk-ant-…` value.

### 2. Get a Resend account
- [resend.com](https://resend.com) → sign up (free tier: 3k emails/mo). Go to **API Keys** → Create. Copy the `re_…` value.
- Out of the box, emails send from Resend's test sender (`onboarding@resend.dev`) which is fine for testing.
- Once Carter has a domain: **Resend → Domains → Add** the domain, follow the DNS steps, then set `RESEND_FROM_EMAIL` to e.g. `Carter & Harper <hello@carterandharper.com>`.

### 3. Create Stripe Payment Links for the care plans
- [stripe.com](https://stripe.com) → Dashboard → **Payment Links** → New.
- Recurring monthly, $25/mo → name it "Basic Care." Copy the `https://buy.stripe.com/…` URL.
- Repeat for $50/mo "Plus Care."
- Paste both URLs into `content.js` under `maintenance.plans[].paymentLink`. Done — the "Subscribe" buttons go live on next deploy.

### 4. Set env vars in Vercel
After pushing to GitHub and importing into Vercel: **Project → Settings → Environment Variables**. Add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-…` from step 1 |
| `RESEND_API_KEY` | `re_…` from step 2 |
| `LEAD_NOTIFY_EMAIL` | `bryan@allegrodesignco.com` (where internal lead copies go) |
| `RESEND_FROM_EMAIL` | (optional) custom From address once a Resend domain is verified |

Redeploy after saving env vars.

## Deploy (GitHub + Vercel)

1. **Push to GitHub** — create a repo named e.g. `carter-and-harper`.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
3. Framework preset: **Other**. Build command: **none**. Output dir: **`./`** (root). Click **Deploy**.
4. Add env vars (above). Redeploy.
5. Every `git push` to the main branch now auto-redeploys. Carter editing `content.js` on GitHub = live site updates in ~1 min.

### First push to GitHub
```bash
git remote add origin https://github.com/<your-username>/carter-and-harper.git
git branch -M main
git push -u origin main
```

## Custom domain

Once live on Vercel: **Project → Settings → Domains → Add**, enter the domain, follow the DNS instructions. If you buy the domain through Vercel, it's wired automatically.

## Cost to run (per month)

- Vercel: $0 (Hobby tier covers the static site + function)
- Anthropic API: ~$0–$1 (Haiku 4.5 × proposal length × volume; under 1k inquiries/mo)
- Resend: $0 (free tier 3k emails/mo)
- Stripe: $0 fixed + 2.9% + $0.30 per transaction on care-plan revenue
- Domain: ~$11/yr

The business funds itself after the first paying client.

## Fallback chain (so the form never visibly fails)

1. **AI proposal** (`/api/proposal`) — preferred. Requires env vars set.
2. **Web3Forms** — if `formAccessKey` is set in `content.js`. Sends raw form data to the contact email.
3. **`mailto:`** — opens the visitor's email app pre-filled. Always works, zero setup.

## Defaults (change anytime in `content.js`)

- **Name:** Carter & Harper
- **Look:** dark + bold + orange/coral/pink accents
- **Leads to:** bryan@allegrodesignco.com (also set as `LEAD_NOTIFY_EMAIL`)
- **Pricing:** $150 / $400 / $250 starter packages + $25/$50 care plans
