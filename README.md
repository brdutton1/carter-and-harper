# Carter & Harper — Web Design Site

A fast static site for Carter & Harper's web-design business. Plain HTML/CSS/JS — no framework, no build step. **All editable content lives in [`content.js`](content.js).**

> Carter's plain-English instructions are in **[EDITING-GUIDE.md](EDITING-GUIDE.md)**. This README is the technical/admin reference for Bryan.

## How it works today

```
Visitor fills out the form
  → their email app opens, pre-filled with every field labeled
  → they send to bryan@allegrodesignco.com from their real email
  → Bryan triages, forwards real leads to Carter
  → Carter replies personally within 2 days
```

Honest, simple, costs nothing to run. The `/api/proposal` serverless function and the AI proposal engine are **built but turned off** until there's real custom-design demand — see "Phase 2" at the bottom of this file for how to flip them back on.

## Files

| File | What it is |
|------|------------|
| `content.js` | **The only file Carter edits.** All text, services, prices, colors, contact email, Stripe links. |
| `index.html` | Page structure (sections fill from `content.js`). |
| `styles.css` | Styling. Colors come from `content.js`. |
| `main.js` | Renders content, applies colors, submits the form. |
| `api/proposal.js` | Dormant serverless function for AI-drafted proposals. Not called today; ready for Phase 2. |
| `package.json` | Declares `@anthropic-ai/sdk` + `resend` deps used by the dormant function. |
| `vercel.json` | Vercel hosting + function config. |
| `.env.local.example` | Template for the env vars Phase 2 needs. |
| `EDITING-GUIDE.md` | Carter's plain-English how-to. |

## Run locally

The static site alone: just open `index.html` (or `npx serve` from this folder).

## Deploy (GitHub + Vercel) — already set up

The repo is at https://github.com/brdutton1/carter-and-harper, connected to a Vercel project that auto-deploys on push to `main`. Live at https://carter-and-harper.vercel.app. Carter editing `content.js` on GitHub = live site updates in ~1 minute.

## Stripe Payment Links (Phase 1.5 — when you're ready for recurring revenue)

The care-plan "Pick this" buttons jump to the contact form today. To turn them into one-click subscriptions:

1. [stripe.com](https://stripe.com) → Dashboard → **Payment Links** → New.
2. Recurring monthly, $25/mo → name it "Basic Care." Copy the `https://buy.stripe.com/…` URL.
3. Repeat for $50/mo "Plus Care."
4. Paste both URLs into `content.js` under `maintenance.plans[].paymentLink`. Push. Done.

## Custom domain

Once you're ready: **Vercel → Project → Settings → Domains → Add**, enter the domain, follow the DNS instructions. If you buy the domain through Vercel, it's wired automatically. Recommended: `carterandharper.com` (~$11/yr).

## Cost to run today

- Vercel: $0 (Hobby tier)
- Domain: ~$11/yr (when added)
- Stripe: $0 fixed + 2.9% + $0.30 per transaction on care plans

Zero recurring infrastructure cost. The business funds itself after the first paying client.

## Defaults (change anytime in `content.js`)

- **Name:** Carter & Harper
- **Look:** dark + bold + orange/coral/pink accents
- **Leads to:** bryan@allegrodesignco.com
- **Pricing:** $225 / $575 / $325 starter packages + $25/$50 monthly care plans

---

## Phase 2 — turn on AI proposals (later, when Carter has real custom-design demand)

The `/api/proposal` function is already built. When you want it live:

### 1. Get an Anthropic API key
[console.anthropic.com](https://console.anthropic.com/) → API Keys → Create. Copy the `sk-ant-…` value.

### 2. Get a Resend account
[resend.com](https://resend.com) → sign up (free tier: 3k emails/mo) → **API Keys** → Create. Copy the `re_…` value.
Once Carter has a domain, add it under **Resend → Domains**, then set `RESEND_FROM_EMAIL` to e.g. `Carter & Harper <hello@carterandharper.com>`.

### 3. Set env vars in Vercel
**Project → Settings → Environment Variables.** Add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-…` from step 1 |
| `RESEND_API_KEY` | `re_…` from step 2 |
| `LEAD_NOTIFY_EMAIL` | `bryan@allegrodesignco.com` |
| `RESEND_FROM_EMAIL` | (optional) custom From address once a Resend domain is verified |

### 4. Flip the switch in `content.js`
```js
ai: {
  proposalEndpoint: "/api/proposal",
  callout: "Powered by AI — get a real proposal in about 90 seconds. We review it before it lands in your inbox.",
},
```
Also update the matching honest copy:
- `form.subtext` → `"Answer a few quick questions. We'll send you a real proposal in about 90 seconds."`
- `form.buttonText` → `"Get my proposal 🚀"`
- `process.steps[1]` → `{ title: "Get a real proposal in 90 seconds", text: "Our system drafts a custom plan and price. We review it personally before it lands in your inbox." }`

### 5. (Recommended) Fire AI only for custom leads
In `main.js`, branch the submit so the API only fires when `projectType === "Something else" || "Not sure yet"`. Standard packages stay on mailto since their price is already on the homepage. Keeps AI cost low and the value high.

### Fallback chain when AI is on

1. **AI proposal** (`/api/proposal`) — preferred for custom leads.
2. **Web3Forms** — if `formAccessKey` is set in `content.js`. Sends raw form data to the contact email.
3. **`mailto:`** — opens the visitor's email app pre-filled. Always works, zero setup.

### Phase 2 running cost

- Anthropic API: ~$0–$1/mo (Haiku 4.5 × proposal length × volume; under 1k inquiries/mo)
- Resend: $0 (free tier 3k emails/mo)

Everything else stays the same.
