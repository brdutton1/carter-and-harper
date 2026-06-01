# Carter & Harper — Web Design Site

A fun, fast, no-build static website Carter (and Harper) use to land web design clients.
Plain HTML/CSS/JS — no framework, no build step. **All editable content lives in [`content.js`](content.js).**

> Carter's plain-English instructions are in **[EDITING-GUIDE.md](EDITING-GUIDE.md)**. This README is the technical/admin reference.

## Files

| File | What it is |
|------|------------|
| `content.js` | **The only file you edit normally.** All text, services, prices, colors, contact email. |
| `index.html` | Page structure (sections are filled from `content.js`). |
| `styles.css` | Styling. Colors come from `content.js` via CSS variables. |
| `main.js` | Renders content, applies colors, handles the form. Rarely needs edits. |
| `vercel.json` | Vercel hosting config. |
| `EDITING-GUIDE.md` | Carter's plain-English how-to. |

## Run it locally

No tooling required — just open `index.html` in a browser.
(If you want a local server: `npx serve` from this folder.)

## Deploy (GitHub + Vercel)

1. **Push to GitHub** (see commands below) — create a repo named e.g. `carter-and-harper`.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the GitHub repo.
3. Framework preset: **Other**. Build command: **none**. Output dir: **`./`** (root). Click **Deploy**.
4. Every `git push` to the main branch now auto-redeploys. Carter editing `content.js` on GitHub = site updates in ~1 min.

### First push to GitHub
```bash
git remote add origin https://github.com/<your-username>/carter-and-harper.git
git branch -M main
git push -u origin main
```

## Turn on the form (real email delivery)

Out of the box, the project form opens the visitor's email app pre-filled (works everywhere, zero setup).
To make it send email silently to the inbox instead:

1. Go to [web3forms.com](https://web3forms.com) → enter **bryan@allegrodesignco.com** → you get a free **Access Key** by email.
2. Open `content.js`, paste it into:
   ```js
   formAccessKey: "your-key-here",
   ```
3. Save / push. Submissions now email straight to that address. Free, no account dashboard, no backend.

To change where leads go later, change `contactEmail` in `content.js` (and re-request a Web3Forms key for the new address if you use one).

## Custom domain

Once live on Vercel: **Project → Settings → Domains → Add**, enter the domain, and follow the DNS instructions
(Vercel walks you through it). If you buy the domain through Vercel, it's wired automatically.

## Defaults chosen at build (change anytime in `content.js`)

- **Name:** Carter & Harper
- **Look:** fun & bold, dark with orange/coral/pink accents
- **Leads to:** bryan@allegrodesignco.com
- **Pricing:** starter packages ($150 one-pager / $400 small business / $250 redesign) — edit freely
