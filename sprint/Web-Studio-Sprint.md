# Web Studio Sprint
### A 2-week intensive that takes you from zero to a live, client-approved website by Day 10

**Built for:** Carter & Harper — a two-person studio.
**The deal:** One real local client, lined up before Day 1. By Day 10 their site is live on their own domain, they have approved it, your studio portfolio is live with their project as case study #1, and you have sent 3 outreach emails to land your first *paid* client.

---

## The one idea this whole sprint runs on

Claude Code is insanely capable. It can build a production website in an afternoon. **The bottleneck is not the AI. It is the human briefing the AI.**

A vague prompt produces generic AI slop. A specific, referenced, constrained prompt produces a site that looks like a senior designer made it.

You are not here to learn to code. You are here to become the **creative director** who pulls excellent work out of Claude Code. The site you ship for your first client is the proof.

Every day ends with one shipped artifact and one sharpened prompting skill. No theory weeks. No fake practice businesses. Real client, real stakes, from Day 1.

---

## How this document is organized

1. **The 10-Day Plan** — your daily playbook. Open it each morning.
2. **Reference sections** — the tools you reach for again and again: the Prompt Library, the Director's Review Checklist, the kickoff guide, the handoff template, the acquisition playbook, and the trackers.

> **Tip:** The Prompt Library and the Director's Review Checklist are the two you will use every single day. Bookmark them.

---

# Pressure-Test Adjustments (read this first, Bryan)

*This program was stress-tested against how websites actually get built with AI, and against what actually breaks when two beginners ship a real client site in 10 days. The verdict: the core is right. The teaching idea — that they direct Claude Code instead of learning to code, and that the quality of the brief is the whole game — is exactly how good AI-built sites get made. The risks are not conceptual. They're operational, and there are three of them. All three try to break the 10-day cap. None of these fixes add a day.*

### The three things that will try to break the 10-day cap

**1. Tooling friction (the #1 killer of Day 3).** "Claude Code will give you the command, usually `npm run dev`" hides a swamp for beginners: Node versions, ports already in use, git auth, a build that fails and leaves the project broken. If the environment isn't bulletproof before Day 1, Day 3 dies and the whole chain slips.
> **Fix — make Day 0 non-negotiable, and make the preview URL the source of truth.** The Day-0 dry-run in the prep checklist is the most important 15 minutes in this program — treat it as a hard gate, not a checkbox. And change the daily loop so they do **not** rely on running the site locally. The loop is: prompt → Claude commits & pushes → Vercel auto-builds a preview URL → check the result on that URL. The deployed preview is the one thing that always works the same way on every machine and every phone. Local `npm run dev` becomes optional, not the main path. This removes an entire class of beginner failures.

**2. Client latency (the #1 killer of Days 5, 7, and 9).** The whole critical path runs through a busy local business owner doing you a favor. Day 5 needs their copy and photos. Day 7 needs their feedback. Day 9 needs them on a screen-share with their domain login. Any one of those slipping a day blows the cap.
> **Fix — front-load every client ask into Day 1, and never let the build wait on the client.** In the Day 1 kickoff, collect copy, photos, and the domain login *then*, and put the Day 7 review and Day 9 handoff on their calendar *then*. If assets are slow, Carter and Harper write the copy and use honest stand-in photos so the build keeps moving — real assets swap in when they arrive. **Build progress and client approval are decoupled.** The site is never blocked waiting on a reply.

**3. DNS and the domain (the #1 killer of Day 9).** Pointing a domain at Vercel and waiting for DNS to propagate can take minutes — or many hours. If they start it Day 9 morning, "live on the real domain" may not resolve same-day.
> **Fix — start the domain on Day 8, finish it on Day 9.** The instant the client approves at the end of Day 7, do the domain connection during Day 8's polish day so it propagates overnight. Day 9 becomes verification + analytics + form + handoff, not a race against DNS. **And if the client doesn't already own a domain, buy it through Vercel** (the Vercel connector can check availability and purchase) — it auto-configures with zero DNS table and zero registrar screen-share. Only do the manual GoDaddy/Namecheap DNS dance when you're stuck with a domain the client already owns somewhere else.

### The one technical call worth making before Day 3: the stack

The plan defaults to **Next.js**. For a small local-business site — a few pages, real content, a contact form — Next.js is heavier than the job needs, and the extra machinery (TypeScript, a build step, React hydration, `node_modules`) is exactly where beginner builds break and where Day 8's Lighthouse score gets hard to win. Notice that the Carter & Harper site in this very repo is plain HTML/CSS/JS — that's the right instinct for a brochure site.

> **Recommendation:** Default the **client brochure site** to **Astro** (or even plain static HTML/CSS). Astro is built for content sites, ships almost no JavaScript, gets near-automatic green Lighthouse scores (which makes Day 8 easy instead of a rabbit hole), iterates faster, and still one-click-deploys to Vercel. **Nothing else in this program changes** — every prompting skill, every checklist, every day is identical; you only swap the framework named in the master prompt's `TECH` block. Keep Next.js in your back pocket for a future client who genuinely needs app-like interactivity. *(This is a judgment call with a real tradeoff — Next.js is the better-known "industry default" résumé line. If you want them learning the popular tool over the right-sized one, keep Next.js. My pick for this brief and this audience is Astro.)*

### Two safety habits to teach on Day 1 (and enforce all sprint)

- **The undo lifeline.** Beginners *will* get the project into a broken state. The rule: commit working versions often, and if a change breaks the build and you can't fix it in two prompts, tell Claude Code *"revert to the last working commit"* and start the change over. Never dig a deeper hole.
- **One change, then look.** Already in the plan and worth elevating to a law: never send a pile of unrelated fixes in one prompt. One cluster of changes, check the preview, commit, next. When something breaks, you'll know exactly what did it.

### Smaller adjustments, folded into the days

- **Cut Supabase from the critical path.** Use **Formspree** for both the client's contact form and the studio site's form. A database (schema, keys, env vars) is a complexity spike with zero payoff on a brochure site. Leave Supabase as a "you'll learn this on a bigger project later" note. *(This also trims the Day-1 prep.)*
- **Calibrate the references (Day 2).** Awwwards "Site of the Day" winners are animation-heavy agency showpieces — aiming a local guide-service site at one is a trap that eats days and breaks mobile. Pull references for **feeling, type, color, and layout restraint**, not for effects you can't ship in a day. The plan's own picks — Sightglass, Huckberry, Filson, Tartine — are perfectly calibrated. Lean on Land-book and Mobbin (real, shippable patterns) more than Awwwards.
- **Time-box Day 8 Lighthouse.** Realistic targets: Accessibility / Best Practices / SEO ≥ 95 (easy), Performance ≥ 90 on mobile (the hard one — far easier on Astro/static). Don't let a 0.02 layout-shift score eat the afternoon. Green-enough beats perfect.
- **Prove end-criterion #5 for real (Day 10).** "Both can independently brief Claude Code" is currently never tested — the whole sprint is one shared site with role-swaps. Add a 30-minute solo drill on Day 10: each of you, alone, briefs Claude Code to build a one-section landing page from scratch (use one of your outreach prospects as the subject — it doubles as pitch ammo). *That* is the evidence.
- **Parallelize the non-build work across two machines.** Claude Code builds the site on one driver with mid-day swaps (keep this). But the research and admin — Day 2 reference hunting, Day 10 prospecting and outreach drafting — can run on both laptops at once. Squeeze more out of the fixed hours where the work is genuinely parallel.
- **Designate the float.** There is zero slack in 10 fully-loaded days. Build the buffer into **Day 8** (polish compresses) and the back end of each 4–6 hour day. For every day, the done-criteria are the *target*; if you're behind, ship the homepage clean and defer interior-page polish — a live, honest homepage beats a half-finished five-page site.

*Everything below is the full program. The adjustments above are already pointed to inline where they land (see the callouts in Day 3, Day 8, and Day 9).*

---

# Part 1 — The 10-Day Plan

## Day 1 — Discovery & Direction
*You can't direct what you can't describe. Today you learn to see the client clearly, then write it down so precisely that Claude Code has no room to guess.*

#### Prompting lesson (30-45 min)
**Specificity beats cleverness — the anatomy of a strong brief.**

Here's the thing nobody tells you: Claude Code is not waiting for a magic word. It is waiting for *constraints*. Every detail you leave out, it fills in with the most average, generic, seen-it-a-thousand-times answer. A vague prompt is an invitation for slop. A specific prompt is a leash — it pulls the work toward exactly what you mean.

You are not learning to "talk to AI." You are learning to brief a brilliant, fast, literal collaborator who will do precisely what you describe and nothing you forgot to mention. That skill — describing a thing so clearly there's only one way to read it — is the entire job. It's what a creative director does. It's what you do now.

Look at these two. Same goal. Wildly different outcomes.

```text
BAD PROMPT

Build a homepage for a coffee shop. Make it look nice and modern.
```

```text
GOOD PROMPT

Build a homepage for "Riff Coffee," a small-batch roaster in Pagosa
Springs, CO. The vibe is warm, rugged, mountain-town — think weathered
wood and morning light, NOT sleek Silicon Valley minimalism.

Audience: locals 30-55 and weekend tourists who care about where their
coffee comes from.

Above the fold: the shop name, a one-line tagline ("Roasted at 7,000
feet"), and one big photo of the roaster. One clear button: "See Our
Hours." No carousel, no stock photos of generic latte art.

Tone of the words: friendly, plainspoken, a little proud. Not corporate.

Reference: I want the cozy, editorial feel of the Sightglass Coffee
site, but simpler and more rural.
```

Why the good one wins: it removes every decision Claude Code would otherwise guess at — the name, the place, the feeling, who it's for, what's on screen, what to avoid, and a real site to aim at. The bad prompt produces a purple gradient and three fake testimonials. The good one produces something that looks like a person made it on purpose. **Specificity is the whole game.** You're not being clever. You're being clear.

Practice it now, before the call: each of you writes one "good" brief for a made-up local business. Read them to each other. Find every spot where Claude Code could still guess. That hunt — for the gaps a literal collaborator would fill badly — is the muscle you'll use every single day of this sprint.

#### Real client work block (3-4 hours)
This is the kickoff call. Your one real client, lined up before today, gets on a call with you. Bryan or Amy sits in — not to run it, to back you up. **You two run this call.** You are the studio. Act like it.

Before the call (45 min):
- Pull up their current website if they have one. Pull up their Google listing, their Facebook, their Instagram. Read it like a detective. What do they sell? Who's talking? What feels dated?
- Write your question list (below). One of you asks, the other takes notes. Switch halfway so you're both engaged.
- Open a fresh doc titled `client-brief.md`. This is where everything lands.

On the call (45-60 min), get answers to every one of these. Don't move on until you have a real answer, not a shrug:
- **Goal.** What does this site need to *do*? Get phone calls? Bookings? Make them look legit? (If they say "everything," push: "If it only did one thing, what?")
- **Audience.** Who's the person landing on this site? Age, local vs. tourist, what they're worried about.
- **Current site.** What do they have now, and what specifically do they *hate* about it? Make them point at things.
- **What they love.** Send me 2-3 websites you wish yours looked like. (Get the actual URLs. This is gold for your prompts.)
- **Voice.** Are you formal or casual? Funny or serious? Read me a sentence the way you'd say it to a customer.
- **Services / key info.** Exact list of what they offer. Prices if they share them.
- **Contact + logistics.** Phone, email, address, hours, social links, and — write this down — who owns the domain and who has the login.
- **Non-negotiables.** Anything that MUST be on there (a logo, a tagline, a license number, a Bible verse, a specific photo).

After the call (60-90 min):
- Turn your raw notes into a clean one-page brief in `client-brief.md`. Use the structure below. No fluff — this is a working document you'll prompt against all sprint.
- Where the client was vague, write down the specific decision *you* are recommending and why. A brief is direction, not just stenography.
- Send it back to the client the same day: "Here's what we heard. Reply 'looks right' or tell us what we missed." That reply is your sign-off.

Brief structure (fill every field):

```text
CLIENT BRIEF — [Business Name]
Prepared by [Studio Name] · [date]

ONE-LINE GOAL: ________
AUDIENCE: ________
VOICE (3 adjectives): ________
PAGES NEEDED (v1): ________
REFERENCE SITES (URLs they love): ________
WHAT THEY HATE ABOUT THE CURRENT SITE: ________
SERVICES / KEY INFO: ________
CONTACT DETAILS: phone / email / address / hours / socials
DOMAIN + LOGINS (who owns what): ________
NON-NEGOTIABLES: ________
ASSETS WE NEED FROM THEM: logo, photos, copy (list it)
OUR RECOMMENDED DIRECTION: ________
```

#### End-of-day studio review (30 min)
Sit down together and pressure-test the brief before you log off:
- Read the brief out loud. Every blank filled? Any field still says "TBD"? That's a hole — note who's chasing it.
- The gap hunt: pretend you're handing this brief to Claude Code tomorrow with zero memory of the call. Where would it have to guess? Tighten those lines now.
- Confirm the reference URLs actually work and actually look like what the client meant. Open every one.
- Decide tomorrow's first move and who's driving the keyboard first.
- Did the sign-off email go out? If not, send it before you close the laptop.

#### Shipped output
A one-page client brief (`client-brief.md`), every field filled, sent to the client for sign-off the same day.

#### Done criteria (pass/fail)
- [ ] Kickoff call happened, both of you spoke, notes captured live.
- [ ] `client-brief.md` exists with every field filled — no blanks, no "TBD."
- [ ] At least 2 reference site URLs the client actually likes are in the brief.
- [ ] Domain ownership and logins are documented (you know who controls the domain).
- [ ] List of assets you need from the client (logo, photos, copy) is written down.
- [ ] Brief was sent to the client the same day with a clear ask for sign-off.

#### What good looks like
A real creative-studio discovery brief. Look at how studios like **Metalab** or **Instrument** frame a project before a single pixel — tight on goal, audience, and voice, ruthless about scope. For the *writing* of your brief, aim at the clarity of a **Basecamp/37signals pitch**: short, concrete, decision-first, no jargon. Your one page should read like someone who knows exactly what they're building and exactly who it's for.

---

## Day 2 — Visual Research & References
*Today you stop describing taste in words and start handing Claude Code the exact pictures to chase.*

#### Prompting lesson (30-45 min)
The skill today is **reference-driven prompting** — giving Claude Code a visual target instead of an adjective.

Here is the thing nobody tells beginners: words like "modern," "clean," "professional," and "elegant" mean nothing to Claude Code, because they mean a different thing to every person who has ever typed them. "Modern" could be brutalist concrete or it could be a pastel startup. When you describe a feeling, Claude Code fills the gap with the statistical average of every website it has ever seen — that is the gray, rounded-corner, lavender-gradient look people call "AI slop." You don't beat slop by adding more adjectives. You beat it by removing the guesswork: show it real sites, name real design moves, and constrain the choices.

Compare these two.

**BAD prompt:**
```
Build me a homepage for a coffee roaster. Make it modern, clean,
and professional with a nice hero section. Make it look high-end.
```

**GOOD prompt:**
```
Build a homepage hero for a coffee roaster. I'm giving you three
reference screenshots in /references — read them before you write code.

Match these specific moves:
- Layout + whitespace like ref-01 (Cometeer): one oversized product
  shot, huge margins, text pinned bottom-left.
- Type treatment like ref-02 (Standart Mag): a serif display headline
  at ~72px, tight line-height, lots of breathing room above it.
- Color restraint like ref-03 (Trade Coffee): near-black text on warm
  off-white (#FAF7F2), ONE accent color, nothing else.

Do NOT add gradients, drop shadows, rounded "card" boxes, or stock
icons. Single accent color only. Desktop first, 1440px wide.
```

**Why the good one wins:** it replaces every vague adjective with a named site Claude Code can reason about, a specific design move to copy, an exact hex code, and an explicit "do NOT" list that bans the slop defaults. You removed the guesswork, so Claude Code stops averaging and starts executing.

One rule to carry all sprint: **if you can't point to it, Claude Code can't build it.** Your job today is to go find the things you'll point to.

#### Real client work block (3-4 hours)
You are hunting for reference sites — not to copy, but to define the target so precisely that the client can pick a direction and Claude Code can hit it.

**1. Set up the hunt (15 min).** Open a Google Drive folder named `[ClientName] — Visual References`. Inside it, make three subfolders: `01-finalists`, `02-maybe`, `03-rejected`. You'll screenshot as you go and sort ruthlessly.

**2. Know what you're looking for (10 min).** Pull up the client brief from Day 1. Write down two things on a sticky note in front of you:
- The **industry** (coffee shop, church, plumber, real-estate team).
- The **three feeling-words** the client used (e.g., "warm, trustworthy, local"). These are your filter. Every reference either serves those words or gets rejected.

**3. Mine the four galleries (90 min).** These are where professional designers post their best work. Search each for your industry and your feeling-words:
- **Land-book** (land-book.com) — landing pages, easy to browse by vibe and color. Best starting point for small-business sites.
- **Godly** (godly.website) — curated, high-taste, heavy on typography and motion. Go here for the "wow."
- **Awwwards** (awwwards.com) — the top of the field. Filter by category. Some are over-designed for a local business — steal the details, not the whole thing.
- **Mobbin** (mobbin.com) — real screens from real products, great for specific components (nav bars, contact forms, mobile layouts).

For every site that makes you stop scrolling, screenshot the full page (not just the hero) and drop it in `02-maybe`. Aim for 12-15 captures. Name each file what it *does*, not the brand: `bold-serif-headline.png`, `single-photo-hero.png`, `warm-offwhite-palette.png`. Future-you, writing prompts on Day 4, will thank you.

**4. Cut to 5-7 (20 min).** Go through `02-maybe` against your three feeling-words. Anything that doesn't serve all three moves to `03-rejected`. You should land on 5-7 references in total that, together, paint one coherent picture. If two references fight each other (a moody dark site next to a bright airy one), one of them is wrong — keep the one that matches the client's words.

**5. Build 3 finalist directions (45 min).** From your 5-7, group them into **three named directions** the client can choose between. Give each a human name and one screenshot that anchors it, e.g.:
- **"Warm & Local"** — off-white, serif headlines, big photography (anchor: your Trade Coffee capture).
- **"Bold & Modern"** — high contrast, oversized type, lots of black (anchor: your Godly find).
- **"Soft & Calm"** — muted palette, generous whitespace, gentle motion (anchor: your Land-book find).

Move the three anchors into `01-finalists`. Write one sentence under each direction in plain English — no design jargon — describing how it would feel to land on that site.

**6. Show the client, get ONE pick (30 min).** Send the three directions (a quick call or a labeled email with the three anchor screenshots). Your only goal: get them to point at one. Say it plainly: *"We're not picking colors or words yet — just the overall feeling. Which of these three feels most like you?"* If they love bits of two, that's fine — write down exactly which bits, and which one is the primary. Lock the primary.

#### End-of-day studio review (30 min)
Sit down together and check, out loud:
- Do all references in `01-finalists` actually serve the client's three feeling-words? Pull anything that's just "cool but off-brand."
- Is every file named by what it *does*, not the brand name?
- Is the client's pick recorded in writing (email reply, text, or call note) — not just remembered?
- Open the Day 1 brief: is the chosen direction + the Drive folder link pasted into it? If not, do it now. The brief is the single source of truth Claude Code will read on Day 4.
- Gut check: if a stranger read your brief and looked at the finalists folder, could they describe the site you're about to build? If not, tighten the notes.

#### Shipped output
A locked visual direction: one client-approved direction, backed by 5-7 named reference screenshots in the `01-finalists` Google Drive folder, with the folder link and the chosen direction written into the Day 1 brief.

#### Done criteria (pass/fail)
- [ ] Google Drive folder exists with `01-finalists` / `02-maybe` / `03-rejected` subfolders.
- [ ] 5-7 references saved, each named by what it does (not the brand).
- [ ] References pulled from at least 3 of the 4 galleries (Land-book, Godly, Awwwards, Mobbin).
- [ ] Three named directions presented to the client.
- [ ] Client picked ONE primary direction, recorded in writing.
- [ ] Chosen direction + Drive folder link pasted into the Day 1 brief.

#### What good looks like
Pull up **Trade Coffee** (drinktrade.com) and **Cometeer** (cometeer.com) side by side. Both are coffee brands; neither looks generic. Notice what they do *not* do — no clutter, no gradient soup, no ten different fonts. One photo style, one type system, one accent color, ruthless whitespace. That discipline — a single confident direction held all the way through — is exactly what you're locking with the client today, before a single line of code gets written.

---

## Day 3 — First Build Pass

*Today you stop planning and Claude Code builds the whole site. It will be rough. That's the point.*

> **⚙️ Stack note (see Pressure-Test Adjustments up top):** Bryan's recommendation is to build the client's brochure site in **Astro** (or plain static HTML), not Next.js — it's lighter, faster, and wins Day 8's Lighthouse score almost for free. If so, just swap the framework named in the master prompt's `TECH` block; every step below is identical. **And don't depend on running the site locally** — your source of truth is the Vercel preview URL: prompt → Claude commits & pushes → preview rebuilds → you check it there.

#### Prompting lesson (30-45 min)

Today's skill: the **master prompt** — the single big brief that turns everything you learned about your client into a complete first site. This is the most important prompt you'll write all sprint. Get it right and Claude Code hands you something that looks designed. Get it lazy and you get AI slop: purple gradients, "Lorem ipsum," a hero that says "Welcome to Our Website," and three identical feature cards with stock icons.

A master prompt has six parts. Miss any one and the output drifts toward generic:

1. **Who it's for** — the client, their business, their actual customers.
2. **What the site must do** — the pages, and the one action you want a visitor to take.
3. **References** — real sites you're aiming at, named, with what specifically to borrow.
4. **Tone** — three or four adjectives, plus what to avoid.
5. **Hard constraints** — the stack, the real content, the brand colors, no fake data.
6. **What NOT to do** — the slop list. Naming the trap stops Claude from falling in it.

Here's the difference, for a real example. Say your client is a Pagosa Springs fly-fishing guide named Cline River Outfitters.

```
BAD PROMPT
Build me a modern, professional website for a fly fishing
guide company. Make it look nice and have a few pages.
```

```
GOOD PROMPT
Build a website for Cline River Outfitters, a fly-fishing
guide service in Pagosa Springs, CO run by guide Tom Cline.
Their customers are out-of-state visitors (40-60, decent
income) booking a half- or full-day guided trip on the
San Juan River.

Pages: Home, Trips & Pricing, About Tom, Book a Trip.
The ONE action: get a visitor to fill out the "Book a Trip"
form. Put a clear call-to-action button in the header and at
the end of every page.

References — aim at these, don't copy them:
- Visual calm and big landscape photography like Huckberry's
  journal pages.
- Trip-card layout like a clean Airbnb listing card.
- Typography: confident, outdoorsy serif headlines like
  Filson's site, simple sans-serif body text.

Tone: rugged, calm, trustworthy, local. NOT corporate,
NOT salesy, NOT "adventure-bro."

Constraints:
- Next.js, deploy-ready for Vercel.
- Use the real trip names, prices, and Tom's bio from the
  content doc I'm pasting below. Do NOT invent prices or
  testimonials.
- Brand colors: deep river green #1F3D2B and sand #D8C7A8.

Do NOT use: purple/blue tech gradients, stock "team in a
meeting" photos, generic icon trios, or filler like
"Welcome to our website." Leave clearly-labeled placeholders
where I still need to supply a real photo.
```

Why the good one wins: the bad prompt gives Claude no client, no goal, no taste, and no guardrails — so it fills every blank with the statistical average of every website, which is slop. The good one makes nearly every decision *for* Claude, so the only thing left to generate is a site that already matches your client.

One rule to burn in: **if you don't decide it, Claude decides it for you — and it'll decide boring.**

#### Real client work block (3-4 hours)

You've got your client brief and content from Days 1-2. Now you build.

1. **Assemble the content doc (30 min).** Open one file — `client-content.md` in your project folder — and paste in the real stuff: business name, every page's headline and paragraphs, trip/service names, real prices, the client's bio, contact info, hours. This is what you'll paste under "Constraints" in your master prompt. No real text yet for a section? Write `[PLACEHOLDER: client to provide]` so Claude leaves a labeled gap instead of inventing.

2. **Write your master prompt (45 min).** Use the six-part skeleton above. Write it in a plain text file first, not straight into Claude Code, so you two can read it out loud and catch what's vague. Read rule: if a sentence could describe *any* business, cut it or make it specific to your client.

3. **Brief Claude Code and build (60-90 min).** Open Claude Code in your project folder. Paste the master prompt. Let it scaffold the Next.js project and generate all the pages. Watch the output scroll — you'll see it create files like `page.tsx` and talk about "components" and "Tailwind." You don't need to know that yet. Read it like subtitles: it's telling you what it's making. When it finishes, run the site locally (Claude Code will give you the command, usually `npm run dev`) and open the local URL in your browser. Click every link. It'll be rough — wrong spacing, placeholder images, maybe a broken page. Good. Write down the three worst things; don't fix them yet.

4. **Deploy to a Vercel preview (30-45 min).** Tell Claude Code: "Deploy this to a Vercel preview URL using the Vercel connector." It'll push the code and hand you back a live link ending in `.vercel.app`. Open that link on your phone. This is the first time your client's site exists on the real internet. Text the link to each other. Do NOT send it to the client yet — it's rough, and Day 4 is where you fix it.

#### End-of-day studio review (30 min)

Sit down together with the preview URL open on both a laptop and a phone, and check:

- Does the homepage say what this business *is* in the first screen, before scrolling? Or could it be anyone?
- Did Claude invent any fake prices, fake reviews, or fake names? Hunt for them now — fake content is the fastest way to lose a real client's trust.
- Read the three worst things each of you wrote down. Agree on the top three problems total. Write them at the top of tomorrow's notes — that's your Day 4 punch list.
- Save your master prompt into the project folder as `master-prompt.md`. You'll reuse this exact structure for client #2.

#### Shipped output

A live Vercel preview URL (`something.vercel.app`) showing a complete, all-pages-present, rough first pass of your client's real site — built from your master prompt, using real client content, no fake data.

#### Done criteria (pass/fail)

- [ ] `client-content.md` exists with real client content (placeholders clearly labeled).
- [ ] `master-prompt.md` saved in the project folder, with all six parts present.
- [ ] Claude Code generated a complete Next.js site — every planned page exists and loads.
- [ ] The site runs locally and you clicked every nav link.
- [ ] A live `.vercel.app` preview URL opens on both laptop and phone.
- [ ] Zero invented prices, names, or testimonials on the site.
- [ ] Top three problems written down for the Day 4 punch list.

#### What good looks like

Pull up **Huckberry** (huckberry.com) and **Filson** (filson.com) side by side. Both sell outdoor gear to roughly the same customer your guide-service client wants — and notice neither one leans on gradients or stock icons. They lead with one big, real photograph, a confident headline, and a lot of calm empty space. That restraint is the target. Your rough Day 3 build won't be there yet, but those two sites are the bar you're prompting toward.

---

## Day 4 — Iteration & Design Eye
*Today you stop building and start directing — the difference between a 15-year-old's site and a studio's site is the edit pass.*

#### Prompting lesson (30-45 min)

Yesterday you built. Today you critique. These are different muscles. Building is "make me a hero section." Critiquing is "the hero section is 40px too tight at the top and the headline competes with the subhead — fix the hierarchy." Most people never learn the second one. That's the gap that makes their sites look amateur. You're closing it today.

The rule: **never tell Claude Code to "make it better." Tell it exactly what is wrong and exactly what good looks like.** Claude Code can execute any change you can describe precisely. It cannot read your mind. "Make it better" forces it to guess, and guessing produces generic AI slop — more gradients, more emoji, a stock-photo vibe. Specific surgical notes produce senior-designer work.

Here's the same fix, two ways.

```text
BAD PROMPT
The hero looks off. Make it look more professional and clean.
```

```text
GOOD PROMPT
On the hero section, three specific problems:
1. The headline (52px) and subhead (28px) are too close in size — they
   compete. Drop the subhead to 18px and set it in a muted gray (#6B7280)
   so the headline clearly leads.
2. There's only ~16px of breathing room above the headline. Increase the
   top padding of the hero to 96px so it doesn't feel cramped against the nav.
3. The CTA button is full-width and looks like a banner. Make it inline,
   auto-width, with 16px vertical / 32px horizontal padding.
Don't change the copy or the background. Show me just the hero after.
```

Why the good one wins: it names the element, the current state, the target state, and a number for every change — and it fences off what NOT to touch. Claude Code executes it in one pass instead of guessing five times. You're not asking for "better," you're issuing a work order.

One more habit: **change one cluster of related things at a time, then look.** If you send fifteen unrelated fixes in one prompt, and two land wrong, you won't know which note caused it. Group by section (the hero, the services grid, the footer), ship the fix, eyeball it, move on.

#### Real client work block (3-4 hours)

You're running the **Director's Review Checklist** on yesterday's Day 3 build, top to bottom, desktop only. Open the live preview on a real desktop screen, not your phone. Open a notes doc. You are looking for everything wrong before you fix anything.

Walk the site in this order and write down every issue you find. Be specific — "spacing bad" is useless, "32px gap between service cards, should be 48px" is a work order.

1. **Typography** — Are there more than two typefaces? (There shouldn't be.) Does the headline clearly outrank the body? Is body text 16–18px? Is line length on paragraphs roughly 60–75 characters, or does text run edge to edge? Are there orphan words hanging alone on a line?
2. **Spacing** — Is the vertical rhythm consistent, or does one section hug the next while another floats? Is there enough padding inside cards and buttons? Does the content have room to breathe, or is it crammed to the edges?
3. **Hierarchy** — Squint at each section. Does your eye land on the most important thing first (the headline, then the CTA), or does everything shout at once? Is there one clear action per section?
4. **Color** — Count the colors. More than one accent color plus neutrals is usually too many. Is the accent used consistently for the same kind of thing (links, buttons), or randomly? Is text contrast strong enough to read easily?
5. **Copy** — Read every line out loud. Does it sound like a real business or like AI filler ("Welcome to our website! We provide quality services.")? Is the headline about the client's actual offer? Any placeholder Lorem ipsum still lurking?
6. **Imagery** — Are images sharp, not stretched or pixelated? Do they fit the client's real vibe, or are they generic stock that could be any business? Are aspect ratios consistent across a row?

Now turn the notes into prompts. Work **section by section**, not all at once. For each section: send one grouped, surgical prompt (like the GOOD example above), let Claude Code apply it, reload the preview, and check it against your note. Did it fix the thing? Did it break anything next to it? If good, move to the next section. If not, send a one-line correction — "the top padding went to 160px, that's too much, set it to 96px" — and re-check.

Hit every section: nav, hero, services/offer, about, gallery or proof, contact, footer. By the end of the block the desktop site should read clean from top to bottom with nothing that makes you wince.

A few fixes you'll almost certainly need, so you know the shape of them:

```text
The services section cards are different heights because the descriptions
are different lengths, so the row looks ragged. Make all three cards equal
height (align to the tallest) and vertically center the content inside each.
Keep the existing 48px gap between cards.
```

```text
Globally: body text is currently Times-style serif and the headings are a
sans-serif — that's two unrelated fonts fighting. Set body to Inter at 17px
with 1.6 line-height, keep the headings as they are, and confirm the pairing
looks intentional. Don't touch font sizes on the headings.
```

#### End-of-day studio review (30 min)

Sit down together, one of you driving, and do a top-to-bottom scroll of the desktop site out loud. One of you reads each section; the other plays the client and says the first honest reaction. Three questions, answered together before you log off:

- **The five-second test:** Land on the homepage, scroll once, look away. Can you say what this business does and what you're supposed to do next? If not, the hero still isn't doing its job — note it for tomorrow.
- **The wince test:** Scroll slowly. Anything that makes either of you wince — a weird gap, a clashing color, a line of copy that sounds fake — gets written down. No "it's probably fine."
- **Compare to the reference:** Put your site next to the "what good looks like" reference below, side by side on screen. Where does the gap show most? That's your first target tomorrow.

Save your notes doc. Tomorrow is mobile and the gaps you just listed — don't lose them.

#### Shipped output

A presentable desktop version of the client site: clean typography, consistent spacing, clear hierarchy, real copy, and real imagery from top to bottom — reviewed section by section and re-checked against your notes. The fixes are committed and pushed (so the Vercel preview reflects today's work).

#### Done criteria (pass/fail)

- [ ] You ran the full Director's Review Checklist (all six categories) and wrote down every issue before fixing.
- [ ] Every issue you logged was either fixed or consciously deferred to tomorrow with a note — none forgotten.
- [ ] The site uses no more than two typefaces and one accent color.
- [ ] Body text is 16–18px with comfortable line length; no edge-to-edge walls of text.
- [ ] No Lorem ipsum, no "welcome to our website" filler — every line is real client copy.
- [ ] The five-second test passes: a stranger could say what the business does and what to do next.
- [ ] Today's fixes are committed and pushed; the Vercel preview shows the updated desktop site.

#### What good looks like

Pull up the work of **Studio** [studio.design](https://studio.design) or a recent **Awwwards** "Site of the Day," and notice the restraint — one accent color, generous whitespace, two fonts max, type that steps down in clear sizes. For a local-business-scale target that's actually achievable in your timeframe, look at a clean template from **Pitch** or the marketing sites in **Vercel's template gallery** (vercel.com/templates): they show how much polish comes from spacing and hierarchy alone, not flashy effects. Aim for that level of calm, deliberate restraint — it's what separates a site that looks designed from one that looks generated.

---

## Day 5 — Content & Copy

*Real words and real photos beat placeholder every time — and the layout should bend around the content, not the other way around.*

#### Prompting lesson (30-45 min)

Here is the trap almost every beginner falls into: you build a beautiful layout stuffed with "Lorem ipsum dolor sit amet" and three gray placeholder boxes, it looks amazing, and then you drop in the client's real words — a 7-word headline becomes 19 words, the "About" blurb is four sentences not one, and the whole thing breaks. The design was a lie. It was designed for fake content.

Real designers do the opposite. They get the actual words first, then shape the layout around them. This is called content-first design, and it is exactly how the best studios work — the copy drives the boxes, not the reverse.

When you prompt Claude Code, this means: never let it invent placeholder text and never let it design around imaginary content. Give it the real, final, client-approved words and tell it to build the layout to fit them.

```text
BAD PROMPT
Build the homepage hero with a big headline, a subheadline, and a
button. Add an About section below with a heading and a paragraph
of text. Make it look professional.
```

```text
GOOD PROMPT
Build the homepage hero using this EXACT copy — do not change a word,
do not add placeholder text:

  Headline: "Hot meals, cold drinks, and the best patio in Pagosa."
  Subheadline: "Serving wood-fired pizza and local craft beer on
   Pagosa Street since 2009."
  Button: "See the menu"

The headline is long, so size it to wrap cleanly to two lines on
desktop and three on mobile without overflowing. Below the hero,
build the About section with this exact text (it's two short
paragraphs, not one) — shape the section to fit two paragraphs:

  [paste the client's real two paragraphs here]
```

Why the good one wins: the bad prompt forces Claude Code to guess at content it will have to throw away, and the layout it builds will break the moment real words arrive. The good prompt hands it the finished copy and makes the layout a servant of that copy — which is the only order that produces a site that doesn't fall apart on contact with reality.

#### Real client work block (3-4 hours)

You are replacing every fake thing on the site with a real thing. By the end of this block there is zero invented content left.

**1. Get the words (60-90 min).** Your client owes you copy for every section: hero headline, the About story, each service or menu item, hours, location, contact, and any testimonials. Two ways this goes:

- *They wrote it.* Great — paste it into a single file in your repo called `content.md` so it lives in one place. Read it out loud. If a sentence is confusing, fix it and send the edit back for a yes.
- *They couldn't write it.* This is normal — most small businesses freeze on their own copy. You write it. Pull from your Day 1 client call notes, their old Facebook page, their Google listing, anything they've said. Write tight, plain, specific copy. Then send every word to the client and get an explicit "yes, use this" before it goes live. You do not publish words the client hasn't approved. Bryan or Amy can sit in on this call.

Write like a human, not like a brochure. "We pride ourselves on exceptional customer service" is dead. "Ask for Marcus — he's been pulling shots here for 11 years" is alive.

**2. Get the photos (45-60 min).** Placeholder gray boxes and generic stock are out. In order of preference:
- The client's own photos — ask for their camera roll, their Google Business photos, anything real.
- Phone shots — if they're local, a clean phone photo of the actual storefront, the actual food, the actual team beats any stock image.
- Unsplash, *with the client's blessing* — only when you have no real photo for a slot, and only images that honestly match (a real Pagosa-looking mountain, not a generic tropical beach).

Drop everything into the repo (an `/public/images` folder) and ask Claude Code to wire them in. Compress large phone photos first — ask Claude Code: "these JPGs are 6MB each, optimize them for web to under 300KB without visible quality loss."

**3. Replace and restructure (60-90 min).** Now go section by section and swap every placeholder for the real thing. When real content doesn't fit the existing layout, do not jam it in — tell Claude Code to reshape the section:

```text
The Services section was built for 3 items but the client actually
offers 6. Rebuild it as a responsive grid: 3 across on desktop,
2 on tablet, 1 stacked on mobile. Use this exact list of 6 services
with their real descriptions: [paste]. Keep the existing card style.
```

Hunt down every last "Lorem ipsum," every `[Your text here]`, every gray box. Use Claude Code to grep the project for leftover placeholder text so nothing hides: ask it to "search the whole project for any remaining lorem ipsum, placeholder, or TODO text and list every file and line."

#### End-of-day studio review (30 min)

Sit down together and do a literal page-by-page walkthrough of the live preview:
- One of you reads every word on the screen out loud while the other follows the `content.md` file. Do they match? Is anything still fake?
- Click through on your phones. Does the long headline still wrap cleanly? Do the photos load fast, or is one a giant 6MB file choking the page?
- Pull up the client-approval thread. Is every word on the site something the client actually said yes to? If there's one sentence you wrote that they haven't seen, flag it for tomorrow's check-in.
- Pick the single weakest piece of copy on the site and rewrite it together before you log off.

#### Shipped output

The client site contains 100% real, client-approved content — every headline, paragraph, service, and image is the real thing. No lorem ipsum, no `[placeholder]`, no generic stock photos anywhere in the project.

#### Done criteria (pass/fail)

- [ ] A `content.md` file exists in the repo holding all final copy.
- [ ] Zero instances of "lorem ipsum," "placeholder," or `[Your text here]` remain anywhere in the project (verified by a project-wide search).
- [ ] Every image on the site is a real photo (client's own, a phone shot, or client-blessed Unsplash) — no gray boxes, no random stock.
- [ ] Every word on the live site has been explicitly approved by the client.
- [ ] All images are optimized — no single image over ~300KB, page loads fast on a phone.
- [ ] The long real headline wraps cleanly on desktop, tablet, and mobile without overflowing.

#### What good looks like

Look at the websites for **Tartine Bakery** (San Francisco) and **Sightglass Coffee**. Notice there is not one word of filler — every line is specific, human, and theirs alone ("We mill our own flour"). The photos are their actual bread, their actual room, their actual people. Nothing is generic. That is the bar: a stranger should be able to read your client's site and know exactly what makes *this* business *this* business, in words only they would use.

---

## Day 6 — Mobile & Responsive
*Most of your client's customers will see this site on a phone first. Today it has to look like you designed it for the phone on purpose.*

#### Prompting lesson (30-45 min)

Yesterday you were adding things. Today you are fixing things — and fixing is where beginners blow up their own work. You tell Claude Code "make it work on mobile," it rewrites half your layout, and now the desktop version you spent two days perfecting looks wrong. The skill today is **constraint prompting**: telling Claude Code exactly what it is allowed to touch and what it must leave alone.

A debugging prompt has three parts: (1) the exact symptom, (2) where it happens, (3) the constraint — what must NOT change. Skip part 3 and you trade a mobile bug for a desktop bug.

```text
BAD PROMPT
the site looks bad on my phone, fix it so it works on mobile
```

```text
GOOD PROMPT
On screens narrower than 768px, the hero headline "Fresh Mountain Bread, Baked Daily"
overflows off the right edge and the menu image underneath it gets squished to a thin strip.
Fix BOTH on mobile only.
Constraints:
- Do NOT change the desktop layout (anything 768px and wider must look exactly as it does now).
- Keep the same headline font and the brand green (#2F5233).
- Stack the headline above the image on mobile instead of side-by-side.
Show me the two screen sizes before and after.
```

Why the good one wins: it names the exact breakpoint (768px), the exact broken elements, and fences off desktop so Claude Code fixes one screen size without "helpfully" rebuilding the other. Vague prompts give Claude permission to change everything — and it will.

One more rule for today: **fix one symptom per prompt.** Don't hand over a list of six bugs in one message. You won't be able to tell which fix caused which new problem. One bug, test, commit, next bug.

#### Real client work block (3-4 hours)

You're going to audit the site like a real studio does QA: every screen size, top to bottom, written down before you touch a single line.

1. **Build the bug list first (30 min).** Open the live Vercel URL on three things: your actual phone, a tablet if you have one (or borrow), and your laptop. In Chrome on the laptop, press F12 and click the little phone/tablet icon (device toolbar) to simulate an iPhone and an iPad — but the simulator lies a little, so real devices are the source of truth. Scroll the whole site on each. Write a numbered list. For each bug capture: what's broken, which screen size, which section. Examples that are real and common:
   - Headline text runs off the edge of the phone screen.
   - Tap targets (phone number, "Order" button) too small or too close together to tap with a thumb.
   - A section that's two columns on desktop is still crammed into two skinny columns on mobile instead of stacking.
   - Body text so small you have to pinch-zoom to read it.
   - An image that's the wrong shape on mobile and gets stretched or cropped weird.
   - The nav menu doesn't collapse into a hamburger and the links pile up.

2. **Fix one bug at a time (2-3 hours).** Work top of the page down. For each bug, write a constraint prompt using the three-part structure from the lesson. After each fix: reload on the real phone, confirm the bug is gone AND desktop still looks right, then commit with a clear message like `fix: stack hero on mobile under 768px`. Then move to the next. If a fix breaks something else, your next prompt is: "That fix made the desktop headline wrap onto three lines. Revert just the desktop change and keep the mobile fix." Surgical, every time.

3. **Check the thumb-reachable stuff (30 min).** On a phone, people tap with one thumb. Make sure your most important buttons — call, directions, order, book — are big enough (a good rule: at least 44px tall) and not jammed against other links. This is the difference between a customer calling your client and giving up. Prompt Claude Code specifically: name the buttons, name the minimum size, mobile only.

#### End-of-day studio review (30 min)

Sit down together with one phone between you. One of you holds the phone, the other holds the laptop on desktop view. Go through the site top to bottom on BOTH at the same time, section by section. Ask out loud for each section: "Does this look intentional, or does it look broken?" If either of you has to pinch-zoom, squint, or tap twice to hit a button, it's not done. Re-check your bug list from this morning — every item gets a checkmark or it stays open for tomorrow. Send your client nothing yet; tomorrow is content and polish.

#### Shipped output

The live site looks clean and intentional on phone, tablet, and desktop — every bug from the morning audit list fixed, committed, and deployed to Vercel.

#### Done criteria (pass/fail)

- [ ] You audited the live site on a real phone, a tablet (real or simulated), and desktop.
- [ ] Every bug went on a written numbered list before any fixing started.
- [ ] Each bug was fixed with its own constraint prompt and its own commit — no batching.
- [ ] No mobile fix broke the desktop layout (you verified both after every fix).
- [ ] No text requires pinch-zooming to read on a phone.
- [ ] Key tap targets (call, order, directions, book) are thumb-sized and not crowded.
- [ ] The nav works on mobile (collapses cleanly, links are tappable).
- [ ] Latest version is deployed and confirmed live on the real phone.

#### What good looks like

Pull up **Stripe.com** on your phone and then on your laptop. Same brand, same confidence, totally different layout — the mobile version isn't the desktop site shrunk down, it's rebuilt for a thumb. That's the bar: not "it fits," but "it was designed for this screen." For a small-business example closer to your client, look at how **Sightglass Coffee** (sightglasscoffee.com) handles a single big hero image and a tap-to-call button on mobile — clean, fast, one clear action.

---

## Day 7 — Client Review #1
*Today you stop guessing what the client wants and make them tell you — then turn their words into prompts Claude Code can actually build.*

#### Prompting lesson (30-45 min)

Clients don't speak in design terms. They say "make it feel more warm and trustworthy" or "it looks a little cold" or "can it pop more?" That is not an instruction Claude Code can act on. It's a feeling. Your entire job today is translation: turning a vibe into a list of concrete, visual changes.

Here's the move. When a client gives you a mood word, you decompose it into the four things that actually create that mood on a screen: **color, type, spacing, imagery**. "Warm and trustworthy" isn't one change — it's warmer colors, a softer typeface, real photos of real people, and rounded corners instead of sharp ones. You name each one. Then Claude Code builds it.

Watch the difference.

```text
BAD PROMPT
The client said the homepage feels cold and wants it warmer and more
trustworthy. Can you make it feel warmer?
```

```text
GOOD PROMPT
Client feedback: the homepage "feels cold, wants warmer and more trustworthy."
Translate that into these specific changes:

1. COLOR — Replace the current cool gray background (#F4F5F7) with a warm
   off-white (#FAF6F0). Change the primary blue (#2563EB) to a warmer
   terracotta or deep clay tone. Keep contrast AA-compliant.
2. TYPE — The current headline font (Inter) reads corporate. Switch headings
   to a warmer humanist serif like Fraunces or Source Serif. Keep body text
   clean and readable.
3. IMAGERY — The hero is a stock office photo. Swap it for a placeholder
   noting "real photo of owner in the shop" so I can drop in their actual
   photo. Add rounded corners (12px) to all image containers.
4. SPACING — Tighten the giant hero whitespace; it feels empty/sterile.
   Reduce vertical padding by ~30% so the page feels lived-in, not clinical.

Make these changes, then show me the homepage so I can compare.
```

Why the good one wins: the bad prompt hands Claude Code a feeling and forces it to guess — you'll get a random new color and call it a day. The good prompt names the exact levers (color, type, imagery, spacing) with real values, so what comes back is *your* design decision, not the AI's guess. You stay the director.

A second translation pattern, because clients also give you problems disguised as solutions. When a client says "make the logo bigger," the real feedback is usually "I couldn't find your brand / it didn't feel important enough." Don't just scale the logo 2x. Ask yourself what they actually felt, then fix that — maybe the header needed more contrast, or the logo needed breathing room around it. Translate the solution back into the problem, then solve the problem.

#### Real client work block (3-4 hours)

You have a live preview URL from Day 6. Today it goes in front of the client for the first time.

1. **Send the preview (15 min).** Email or text the client the Vercel preview URL. Keep it short and confident: "Here's the first version of your site — take a look on your phone and your computer, and jot down anything that feels off or anything you love. We'll talk it through." If a call is scheduled, send the link 30 minutes before so they've seen it. Parents can sit in on the call.

2. **Run the feedback session (30-45 min).** Get the feedback in writing or on a call — never let it stay vague in your head. On a call, your only job is to ask "what makes you say that?" every time they give you a feeling. "It feels cheap" → *what specifically?* → "the buttons" → now you have something real. Write down their exact words. Do not defend the design. Do not argue. Collect.

3. **Build the change list (30 min).** Take the raw feedback and turn it into a numbered list where every item is a concrete visual change. This is the translation lesson applied for real. Format each one: *what they said → what you'll change*. Example:
   - "Feels cold" → warm the background + swap to a serif headline (see prompt above)
   - "Can't tell what we do" → rewrite the hero subhead to one plain sentence: what + who + where
   - "Phone number hard to find" → add it to the top-right of the header, tap-to-call on mobile
   - Anything you disagree with: note it, don't act yet — you'll raise it in the review.

4. **Brief Claude Code through each change (90-120 min).** Work the list top to bottom. One change, look at the result in the preview, confirm it's right, then the next. Do NOT dump all ten changes in one prompt — you lose control and can't tell what broke what. After every 2-3 changes, push to the preview URL so the live link the client has keeps updating. Use the named-lever format from the lesson for every mood-based item.

#### End-of-day studio review (30 min)

Before you log off, the two of you sit down with the original feedback list and the updated preview side by side and check, item by item:

- Did we actually address every single thing the client said? Read their words, look at the site, confirm. No item silently skipped.
- For anything we chose NOT to do, do we have a one-sentence reason ready to tell them? ("We kept the logo the size it is and instead boosted the header contrast so it stands out — want to see?")
- Open the preview on an actual phone. Most clients look on their phone first. Does every change hold up at 375px wide?
- Did anything we change break something else? Click through every page once.

#### Shipped output

Revision 1 is complete and the updated preview URL is sent back to the client, along with a short note that maps their feedback to what you changed ("You said it felt cold — we warmed the whole palette and switched the headlines to a softer font. You said the phone number was hard to find — it's now top-right and tappable on mobile.").

#### Done criteria (pass/fail)

- [ ] Client has received the preview URL and given feedback in writing or on a recorded/noted call.
- [ ] Every piece of feedback is written down in the client's own words.
- [ ] A numbered change list exists, each item in "what they said → what we changed" form.
- [ ] Every mood-word item was translated into named color/type/spacing/imagery levers before prompting.
- [ ] All agreed changes are live on the preview URL.
- [ ] The site was checked on a real phone at mobile width and nothing is broken.
- [ ] Revision 1 sent back to client with a note mapping feedback to changes.

#### What good looks like

The feedback-to-change note you send is modeled on how a real agency closes a review loop — look at how **Linear** writes its changelog (linear.app/changelog): every entry is "here's what you felt was missing, here's exactly what we did." For the warmth translation itself, study **Mailchimp** (mailchimp.com) and **Oatly** (oatly.com) — warm off-white backgrounds, humanist type, real and slightly imperfect photography. That is what "warm and trustworthy" looks like when it's been translated into actual design decisions instead of left as a feeling.

---

## Day 8 — Polish Pass

*Today you stop building and start judging. The difference between a student site and a studio site is the last 10%.*

#### Prompting lesson (30-45 min): The Director's Eye

Yesterday's job was "make the thing exist." Today's job is "find everything wrong with the thing." Those are different brains. A junior says "looks good to me." A director walks the site like a hostile stranger and writes down every place their eye snags.

Claude Code cannot do this for you, because Claude doesn't have eyes that *snag*. It will happily tell you a page is "clean and modern" when the headline is 2px off from the button below it. You have to do the seeing. Then you hand Claude the specific defects, one tight list at a time.

The trap is the lazy review prompt. Watch:

```text
BAD PROMPT
Go through the whole site and make it look more professional and polished.
Fix any spacing or design issues you find.
```

```text
GOOD PROMPT
I'm reviewing the homepage as a senior designer. Here are 6 specific defects I see.
Fix exactly these, change nothing else:

1. The hero headline and the subhead have the same font size — the headline
   should dominate. Make the headline ~2.5x the subhead and tighten its line-height.
2. Section vertical padding is inconsistent: the Services section has way more
   top space than the About section. Standardize all section padding to one value.
3. The three service cards aren't the same height — the middle one is taller
   because it has more text. Make all cards equal height, top-align the content.
4. The phone number in the footer isn't a clickable link. Make it a tel: link.
5. Buttons have no hover state. Add a subtle darken + slight lift on hover,
   ~150ms transition.
6. The body text is #999 gray on white — too light to read. Darken to at least #444.

Show me the diff before applying.
```

Why the good one wins: "more professional" is a wish, and Claude fills wishes with generic slop — it'll restyle things that were already fine and miss the real problems. A numbered list of *observed defects* turns Claude into a precise instrument. You saw it; you named it; Claude fixes exactly that and nothing else. The "change nothing else" and "show me the diff" lines stop it from wandering off and breaking working sections.

The skill you're building: walking a page and *naming what's wrong* in specific, fixable language. Spacing, alignment, hierarchy, contrast, hover. That's the whole job today.

#### Real client work block (3-4 hours): Final Polish

Work in this order. Do not skip ahead — each pass builds on the last.

**1. The squint test (15 min).** Open the client site. Lean back and squint until it's blurry. The most important thing on each section should still be the thing your eye lands on. If everything is the same weight, your hierarchy is broken. Write down every section where the squint test fails. This is your defect list for the typography pass.

**2. Typography hierarchy pass.** Headlines should dominate. Subheads support. Body recedes. One font for headings, one for body, max. Feed Claude your squint-test defects as a numbered list like the GOOD prompt above. Reference what good looks like:

```text
GOOD PROMPT
Set a clear type scale across the whole site. Use these sizes (desktop):
- H1 (hero): 3.5rem, line-height 1.05, font-weight 700
- H2 (section titles): 2.25rem, line-height 1.1, weight 700
- H3 (card titles): 1.25rem, weight 600
- Body: 1.125rem, line-height 1.6, color #333
- Small/caption: 0.875rem, color #666
Apply consistently. Headings use [client's heading font], body uses [body font].
On mobile, scale H1 down to 2.25rem and H2 to 1.75rem. Show me the diff.
```

**3. Spacing and alignment pass.** Pick ONE spacing rhythm and enforce it everywhere. Tell Claude to use a consistent vertical section padding (e.g. `padding: 5rem 0` desktop, `3rem 0` mobile) and a single max content width (e.g. `max-width: 1200px` centered). Check that everything lines up to the same left edge — logo, headlines, body text, buttons. Misaligned left edges are the #1 tell of an amateur site.

**4. Hover states and micro-interactions.** Every clickable thing should react. Buttons: subtle darken + 2px lift, 150ms ease. Links: underline or color shift. Cards: gentle shadow raise on hover. Nav items: underline grow. Keep it subtle — if you notice the animation, it's too much. Reference: Linear (linear.app) and Stripe (stripe.com) — watch how their buttons and cards respond. That restraint is the target.

**5. Loading speed.** Big images are the usual killer. Tell Claude:

```text
GOOD PROMPT
Audit page load. Convert all hero/section images to next/image with proper
width/height and priority on the hero. Lazy-load below-the-fold images.
Make sure no image file served is larger than its display size. Report any
image over 200KB so I can decide whether to compress it.
```

**6. SEO basics.** Every page needs a unique title tag and meta description. Tell Claude to set per-page metadata: title in the format `Page Name | Business Name | City` and a 150-character description that says what the business does and where. Add the business name, city, and primary service to the homepage `<title>`. This is how the client shows up when someone Googles them.

**7. Accessibility basics.** Two things matter most: every image needs real alt text (describe the image, not "image1.jpg"), and text must have enough contrast against its background. Tell Claude to add descriptive alt text to every image and flag any text/background combo below WCAG AA contrast (4.5:1 for body text). Fix the fails.

**8. Run Lighthouse, fix what's red.** In Chrome, open the live site, open DevTools (F12), go to the Lighthouse tab, run a report on Mobile. You get four scores: Performance, Accessibility, Best Practices, SEO. Anything under 90 is a defect. Read the specific failures Lighthouse lists, hand them to Claude as a numbered list, fix, redeploy, re-run. Repeat until green.

```text
GOOD PROMPT
Lighthouse mobile report flagged these. Fix each:
1. "Image elements do not have explicit width and height" — on the hero and
   the 3 service images. Add explicit dimensions.
2. "Background and foreground colors do not have sufficient contrast ratio" —
   the gray subhead text in the hero. Darken until it passes 4.5:1.
3. "Document does not have a meta description" — add one to the homepage.
4. "Links do not have a discernible name" — the social icons in the footer
   have no accessible label. Add aria-labels.
Show me the diff, then I'll redeploy and re-run Lighthouse.
```

#### End-of-day studio review (30 min)

Sit down together with the live site on one screen and the Director's Review Checklist on the other. One of you drives, the other reads the checklist out loud. Walk every page on desktop AND on a real phone. For every "fail," either fix it now if it's quick or write it on tomorrow's list. Then run Lighthouse one final time, both of you watching, and screenshot the four scores. If any score is still under 90, it's not done — find the fail and clear it before you log off.

#### Shipped output

The client site passes Lighthouse with all four scores green (90+) on mobile, and the Director's Review Checklist is 100% clean. You have a screenshot of the green Lighthouse scores saved for the case study.

#### Done criteria (pass/fail)

- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility ≥ 90 (mobile)
- [ ] Lighthouse Best Practices ≥ 90 (mobile)
- [ ] Lighthouse SEO ≥ 90 (mobile)
- [ ] One consistent type scale across every page (squint test passes on every section)
- [ ] One consistent section padding value and one max content width sitewide
- [ ] All left edges align (logo, headlines, body, buttons)
- [ ] Every button, link, and card has a hover state
- [ ] Every image has descriptive alt text
- [ ] Every page has a unique title tag and meta description
- [ ] No body text below 4.5:1 contrast
- [ ] Site verified on a real phone, not just the desktop preview
- [ ] Green Lighthouse screenshot saved for the case study

#### What good looks like

Pull up **Linear** (linear.app) and **Stripe** (stripe.com) side-by-side with your client site. Notice three things: the type hierarchy is unmistakable (you always know what to read first), the spacing is calm and consistent (everything breathes on the same rhythm), and the hover states are so subtle you almost miss them. That restraint — nothing shouting, everything intentional — is the bar. Your client site won't have their budget, but it can have their discipline.

---

## Day 9 — Domain, Deployment & Handoff

*The day your client's name lights up on their own domain — and you hand them the keys.*

> **⏱️ Timing fix (see Pressure-Test Adjustments up top):** Don't start the domain this morning — DNS can take hours to propagate and you'll be racing the clock. **Connect the domain at the end of Day 8** so it goes live overnight, and use today to verify + add analytics + wire the form + hand off. If the client doesn't already own a domain, **buy it through Vercel** — it auto-configures and skips the registrar screen-share entirely.

#### Prompting lesson (30-45 min)

Today's skill is the one most beginners fumble: **deployment prompts**. Connecting a domain, setting up DNS, adding redirects, wiring analytics — this is where vague prompting burns hours and breaks live sites. Claude Code can do all of it through the Vercel MCP connector, but only if you brief it like an operator, not a tourist.

The difference: deployment is a world of exact strings. A domain name. A DNS record type (A vs CNAME). A registrar (GoDaddy, Namecheap, Google Domains). An IP address. Get one wrong and the site doesn't load — or worse, it loads for you and not for the client. So your prompt has to carry the exact facts and ask Claude to tell you the exact steps to take where it can't reach (your client's registrar login).

```text
BAD PROMPT
hook up the domain to the site and turn on analytics
```

```text
GOOD PROMPT
Our client's site is the Next.js project "riverside-chapel" already deployed
on Vercel. The client owns the domain riversidechapel.org, registered at
GoDaddy. I have access to their GoDaddy DNS settings on a screen-share call.

1. Using the Vercel MCP, add riversidechapel.org AND www.riversidechapel.org
   as domains on the riverside-chapel project.
2. Then give me the EXACT DNS records I need to enter at GoDaddy — record
   type (A or CNAME), name/host, and value — as a copy-paste table. Set the
   apex domain riversidechapel.org as primary and 301-redirect www to it.
3. Tell me how long DNS propagation usually takes and one command I can run
   to check whether it's live yet.
Don't change any page content — deployment config only.
```

Why the good one wins: it hands Claude the exact project name, domain, and registrar, scopes the work to config only, and demands the output in the form you actually need at 2pm on a live call — a copy-paste table of DNS records, not a paragraph you have to decode while the client watches. Naming the registrar matters because GoDaddy, Namecheap, and Cloudflare each label these fields differently, and Claude will tailor the walkthrough.

One rule for today: **never let Claude touch page content during a deployment prompt.** Say "deployment config only" every time. You froze the design on Day 8; today is plumbing.

#### Real client work block (3-4 hours)

This is a live-site day. Work in this order — each step gates the next.

**1. Point the domain at Vercel (45-60 min, on a call with the client).**
Schedule this on a screen-share with the client, because the registrar login is theirs, not yours. Use the GOOD prompt above as your template, swapping in the real project name, domain, and registrar. Claude adds the domain via the Vercel MCP and hands you the DNS table. The client (or you, screen-sharing) pastes those records into their registrar. Then prompt:

```text
I've entered the DNS records at the registrar. Check the domain status on the
riverside-chapel Vercel project and tell me if Vercel sees them yet. If it's
still pending, tell me what's missing.
```

DNS can take minutes to a few hours. Tell the client this up front so nobody panics. Move on to the next steps while it propagates — you don't have to sit and watch.

**2. Force HTTPS and the canonical redirect.** Confirm Vercel issued the SSL certificate (it does this automatically once DNS resolves) and that `www` 301-redirects to the apex (or vice versa — pick one and stick to it). Ask Claude to verify both so the site never shows a "not secure" warning and never splits traffic across two URLs.

**3. Wire up analytics (30 min).** Pick one: **Vercel Analytics** (one click, privacy-friendly, zero config — the path of least resistance for a first client) or **Plausible** (clean, lightweight, GDPR-friendly, what indie devs like). Avoid Google Analytics for a small local business unless the client specifically asks — it's heavy and the dashboard will intimidate them. Prompt:

```text
Add Vercel Web Analytics to the riverside-chapel Next.js project. Install the
package, add the <Analytics /> component to the root layout, and tell me what
I'll see in the Vercel dashboard and where to find it. Config only — don't
change any visible page content.
```

**4. Set up the contact form (45-60 min).** For a first local client, **Formspree** is the right call — no database, no backend, the client gets emails directly in their inbox. (Supabase is the move when a client needs to store and log submissions; you covered the connector earlier, but don't over-build here.) Prompt:

```text
Our contact form on the /contact page currently does nothing on submit. Wire
it to Formspree so submissions email the client at office@riversidechapel.org.
Add the form action, a success state that says "Thanks — we'll be in touch,"
and an error state. Then tell me the one manual step I do in the Formspree
dashboard to activate the endpoint. Don't restyle the form — wiring only.
```

Then **test it for real**: submit the form yourself and confirm the email lands. A contact form that silently fails is the single most common way a small-business site quietly loses customers. Do not skip this.

> **🔒 Security gate — before you point the domain (10 min).** Default the contact form to **Formspree or a Vercel serverless function** — a brochure site does not need a database. But if you used **Supabase anywhere** (stored submissions, a login, anything), do not go live until you run **Prompt 11b**: *"show me the RLS policies on every table and prove they work."* Every table must have RLS on, the policies must be tested with the public key (a visitor can submit but can't read others' data), and no secret key may appear in client code — secrets live in env only. Fix anything that fails first. No exceptions.

**5. Walk the client through requesting changes (15 min).** Decide your channel — one email thread, or one text thread. Tell the client plainly: "When you want a change, send it here. We'll confirm and tell you when it's live." Don't promise instant turnaround; set a real expectation (e.g., "within 3 business days").

**6. Write the handoff doc.** Keep it to one page. Have Claude draft it, then you edit it in plain language:

```text
Write a one-page handoff document for our client, the owner of Riverside
Chapel, in plain non-technical language. Include: their live domain, where
the site is hosted (Vercel), where contact form submissions go, where to view
visitor analytics, who built it (our studio name), and how to request changes
(the email thread). No jargon — assume the reader has never heard of DNS or
a deploy. Output as clean markdown I can paste into a Google Doc.
```

#### End-of-day studio review (30 min)

Before you log off, the two of you check, out loud, together:

- Load the live domain on a phone that is **not** on your home WiFi (use cell data). Does it load? HTTPS lock showing?
- Click every nav link on the live domain. Any 404s?
- Submit the contact form one more time. Did the email actually arrive in the client's inbox?
- Type `www.` in front of the domain. Does it redirect cleanly to the canonical URL?
- Open the analytics dashboard. Do you see your own test visit?
- Read the handoff doc aloud. If either of you hits a sentence the client wouldn't understand, rewrite it now.

#### Shipped output

The client's website is **live on their real domain**, served over HTTPS, with a working contact form that emails them, analytics running, and a one-page plain-English handoff doc delivered. The client has been walked through all of it on a call.

#### Done criteria (pass/fail)

- [ ] The real domain (apex + www) loads the site over HTTPS — verified on a device off your network.
- [ ] `www` and apex resolve to one canonical URL via 301 redirect; no split traffic.
- [ ] SSL certificate is active; no "not secure" warning anywhere.
- [ ] Contact form submitted as a real test, and the email arrived in the client's inbox.
- [ ] If the site uses Supabase: RLS is on and **proven** on every table with the public key, no service-role key is in client code, and secrets live only in env. (You ran *"show me the RLS policies on every table and prove they work."*)
- [ ] Analytics is installed and recording visits (your test visit shows up).
- [ ] No 404s on any nav link on the live domain.
- [ ] One-page handoff doc delivered to the client, jargon-free.
- [ ] Client has been told exactly how and where to request future changes.

#### What good looks like

Aim at the polish of a site shipped on **Vercel's own platform** — instant load, clean HTTPS, no flash of broken styling — paired with the handoff clarity of a **Pinegrove / Stripe-style "getting started" doc**: short, friendly, written for a human who doesn't care how it works, only that it does. For the handoff doc specifically, model the tone of **Squarespace's customer onboarding emails** — warm, concrete, one action per paragraph. Your client should finish reading it feeling like they own something, not like they were handed a manual.

---

## Day 10 — Case Study & Next Client

*Today you stop being two kids who built a website and become a studio with a portfolio and a pipeline.*

#### Prompting lesson (30-45 min)

A case study page is not a screenshot dump. It is a story: here was the problem, here is what we did, here is the result. Clients hire studios that can prove they think, not just decorate. The skill today is briefing Claude Code to build a case study that reads like Pentagram or Locomotive wrote it — narrative-driven, evidence-backed, confident.

The trap is asking for a "portfolio page." Watch the difference.

```text
BAD PROMPT
Build a portfolio page for my web design studio with our first
project on it. Make it look professional and add some pricing.
```

```text
GOOD PROMPT
Build a one-page studio site for our web studio. Single scrolling page,
these sections in order: hero, case study, services, pricing, contact.

CASE STUDY is the centerpiece — build it as a story, not a gallery:
- Client name + one-line description (e.g. "Pagosa Brewing Co. — a
  taproom that had no website, just a Facebook page").
- THE PROBLEM: 2-3 sentences on what was broken (no mobile site,
  customers couldn't find hours, looked closed).
- WHAT WE DID: 3 bullet points, plain language (built a fast mobile-first
  site, made hours + menu impossible to miss, matched their taproom vibe).
- THE RESULT: the live link as a big button, plus a real before/after —
  "before" = screenshot of old Facebook page, "after" = screenshot of
  new site. Put them side by side.
- One pull-quote from the client if we have one.

Tone and craft references: study how Locomotive (locomotive.ca) and
Pentagram (pentagram.com) present a single project — generous whitespace,
big confident type, the result stated plainly. NOT a grid of tiny
thumbnails. One project, told well.

Typography: one serif for headlines, one clean sans for body. No more
than 2 fonts total. Lots of breathing room — sections at least 120px
of vertical padding.

Stop after the case study section is scaffolded and show me. Do not
build pricing or contact yet.
```

Why the good one wins: it tells Claude Code the *structure of an argument* (problem → action → result), names two real studios as the quality bar, constrains the craft (2 fonts, 120px padding, no thumbnail grid), and stops it at one section so you can steer before it runs ahead. The bad prompt gets you generic AI slop with a stock-photo hero and three fake testimonials from "John D."

#### Real client work block (3-4 hours)

You are building two things today: your studio's home, and the start of its future.

**1. Build the studio portfolio site (~2 hours).**
- New repo, new Vercel project. Same stack you already know — Next.js, deployed to Vercel. This is a fresh site, not a page bolted onto the client's site.
- Brief the case study section first, using the GOOD prompt above. Get your real client project in as Case Study #1. Use the actual before/after: the client's old site or Facebook page as "before," your live site as "after." Pull a real quote from them if Day 9 sign-off gave you one — if not, ask for one by text right now.
- Then build the rest, one section at a time, stopping to review each:
  - **Hero:** your studio name, one sharp line on what you do. Not "We make websites." Try "We build fast, beautiful sites for local businesses — in days, not months." Name yourselves like a studio (two initials, a place name, a word that sounds real).
  - **Services:** 3 things you actually do. Website build. Refresh of an existing site. A monthly care plan (you already know this model from the client work).
  - **Pricing:** real tiers. Starter one-page site, multi-page site, care plan/month. Put real numbers on them — you are charging $500-$1500, so anchor there. Pricing on the page filters out tire-kickers before they email you.
  - **Contact:** a real email you both check, and a simple form. Have Claude Code wire the form to email or a Supabase table so submissions don't vanish.
- Deploy. Get it live on a real domain or a clean Vercel URL. Add the client site Day 9 case study link.

**2. Build the prospect list (~1 hour).**
- Find 10 local businesses in Pagosa Springs or Woodland Park with a bad or missing website. Hunt on Google Maps and Facebook — businesses with only a Facebook page, a site that isn't mobile-friendly, or one that looks built in 2009 are your best targets.
- For each: business name, owner name if you can find it, contact email, and one specific thing wrong with their web presence. That last column is your whole pitch. "No website, only Facebook" or "site breaks on a phone" beats "could look nicer."

**3. Draft and send 3 outreach emails (~45 min).**
- Pick your 3 strongest prospects — the ones where the problem is obvious and the fix is fast. Brief Claude Code to draft each one, specific to that business. The email names the exact problem, points to your new case study as proof, and asks for one small thing: a 15-minute call. Short. Five sentences max. No "I hope this email finds you well."
- Read every word before it goes. Make sure the parents are looped in per the call rules. Then send all three. Today. Sent beats perfect.

#### End-of-day studio review (30 min)

Sit down together and check, out loud:
- Open the studio site on a phone. Does the case study read like a story a stranger would understand in 20 seconds? If your mom can't tell what you did for the client by scrolling once, fix the copy.
- Click the case study's live link and the contact form. Both work? Submit a test through the form — did it actually land in your inbox or Supabase?
- Re-read the 3 sent emails. Is each one specific to that business, or did one of them sound copy-pasted? Note what you'd change for the next batch.
- Look at your 10-prospect list. Are the other 7 ranked best-to-worst so tomorrow's follow-up is a 2-minute decision?

#### Shipped output

A live studio portfolio site with your real client as Case Study #1 (problem → what we did → result, with a real before/after), real pricing tiers, and a working contact form — plus 3 business-specific outreach emails sent to your strongest prospects for paid client #2.

#### Done criteria (pass/fail)

- [ ] Studio site is live on a public URL (real domain or clean Vercel URL).
- [ ] Case study tells problem → what we did → result, with a real before/after, not a thumbnail grid.
- [ ] Case study links to the live client site from Day 9.
- [ ] Pricing section shows real numbers in the $500-$1500 range plus a monthly care plan.
- [ ] Contact form submits and the test submission actually arrives (inbox or Supabase).
- [ ] A list of 10 local prospects exists, each with a specific web-presence problem noted.
- [ ] 3 outreach emails, each specific to its business, are SENT (not drafted) — with parents looped in.

#### What good looks like

Locomotive (locomotive.ca) and Pentagram (pentagram.com) for how a single project is presented as a confident story with room to breathe. For the studio site itself, look at how small studios like Tiny (tiny.studio) or a clean one-pager on Read.cv keep it to one scrolling page that says exactly what they do, who they did it for, and what it costs — nothing more.

---

# Part 2 — Reference Library

## Pre-Day-1 Prep Checklist (for Bryan)

*This is the only section written to you, Bryan — not to Carter and Harper. Everything below must be true before Monday 9 a.m. so the kids hit Day 1 building, not configuring.*

- [ ] **Client confirmed and briefed.** Call them, don't text — confirm they know two 15-year-olds are the studio, the deal is free or a $250 token, and the site ships in 2 weeks. Get a verbal "yes" to three specific touchpoints: a **Day 1 kickoff call** (~30 min), a **Day 7 review** (they look at a live preview and give notes), and a **Day 9 handoff** (final approval before it goes to their real domain). Put all three on their calendar now.
- [ ] **Claude Code installed and logged in** on the exact machine the kids will use. Open it once yourself, run a trivial prompt, confirm it responds. Don't let Day 1 burn on an install.
- [ ] **MCP connectors verified one-by-one** inside Claude Code — test each, don't assume. Run a tiny read action through each so you see a real success, not a green dot:
  - [ ] **GitHub** — list your repos.
  - [ ] **Vercel** — list projects (or confirm the account links).
  - [ ] **Supabase** — list projects (you likely won't need a database, but verify now so it's not a Day-6 surprise). **Default rule:** contact forms use Formspree or a Vercel serverless function; only reach for Supabase if the project genuinely needs to store and read data. If Supabase *is* used, RLS enabled and tested on every table is mandatory before go-live (see the Security checklist).
  - [ ] **Figma** — open/read one file.
  - [ ] **Canva** — list designs or pull one asset.
  - [ ] **Google Drive** — read a file from the project folder below.
- [ ] **Vercel account ready** on the free Hobby tier — this hosts the site for $0. Sign in with the same GitHub account so deploys connect automatically.
- [ ] **Shared GitHub org (or repo) for the studio.** Make an org so the kids' work lives under a studio name, not your personal account — it's the home for this client repo and every future one. Add the kids' GitHub logins as members.
- [ ] **Shared Google Drive folder for the project.** One folder, named for the client, holding the brief, reference links, client-supplied photos, and copy. This is the single source of truth Claude Code pulls from via the Drive connector.
- [ ] **Studio HQ page (Notion or a markdown doc) as the parent dashboard.** One link where you can see the live preview URL, the daily checklist, and where things stand — so you can glance, not hover.
- [ ] **Domain plan locked.** If the client has a domain, get the **registrar login** (GoDaddy, Squarespace, etc.) so you can point DNS to Vercel on Day 9 — chasing this live is the #1 handoff delay. If they don't have one, set a budget (~$12–20/yr) and decide who buys it before Day 9.
- [ ] **Backup client named.** Have a second business, church, or family friend who'd say yes on short notice. If client #1 ghosts on Day 1, the sprint doesn't stall — you swap and go.

### Day 0 dry-run (15 min)

Before the real sprint, have the kids prove the whole pipeline works end-to-end so Day 1 starts on green:

- [ ] In Claude Code, create a throwaway Next.js project and push it to a GitHub repo via the connector.
- [ ] Have Claude Code make one trivial edit (change the homepage text to "Hello from [Studio Name]").
- [ ] Confirm the commit lands on GitHub and Vercel auto-builds a **preview URL** — then open that URL on a phone.
- [ ] If text-edit → GitHub → live Vercel preview works, the pipeline is real. Delete the throwaway repo. You're clear for Monday.

---

## The Prompt Library

This is your toolbox. You will reach into it every single day of the sprint. Every prompt here comes in two versions: the BAD one a beginner fires off without thinking, and the GOOD one a creative director writes. Read the WHY under each pair — that's where the lesson lives. The GOOD versions have `{{PLACEHOLDERS}}` you swap out for your real client.

The pattern under all of it: **you don't ask Claude Code for a website. You brief it like you hired the best designer alive and have one shot to explain the job.**

---

### 1. The Master New-Site Prompt

This is the big one. You run a version of this once per project, at the start, after your client intake call. Everything else in this library is a follow-up to this.

**Prompt 1a — BAD**

```
build me a website for a coffee shop. make it look nice and modern.
```

**Prompt 1b — GOOD**

```
You are building a production website. Act as a senior web designer and front-end engineer. Before writing code, restate the brief back to me in 3 bullets so I know we agree.

THE CLIENT
{{BUSINESS_NAME}} — a {{BUSINESS_TYPE}} in {{TOWN}}, Colorado.
What they do: {{ONE_SENTENCE_DESCRIPTION}}
Who their customers are: {{TARGET_CUSTOMER}}
The single most important action a visitor should take: {{PRIMARY_GOAL — e.g. call to book, fill out contact form, get directions}}

THE FEELING
The site should feel: {{3 ADJECTIVES — e.g. warm, established, unfussy}}.
NOT: {{2 ANTI-ADJECTIVES — e.g. not corporate, not trendy/startup-y}}.

REFERENCES (match this quality bar)
- Layout/structure like: {{REFERENCE_SITE_1 — paste a real URL}}
- Typography feel like: {{REFERENCE_SITE_2}}
- Color/mood like: {{REFERENCE_SITE_3}}
Pull the GENERAL approach from these — do not copy them.

PAGES & SECTIONS (v1)
1. Home: hero (headline + subhead + primary button), {{SECTION}}, {{SECTION}}, contact/footer
2. {{PAGE_2}}
3. {{PAGE_3}}
Keep it to these. No blog, no extra pages yet.

REAL CONTENT
Use this exact copy where given; mark anything you invent with [PLACEHOLDER] so I can spot it:
- Headline: {{HEADLINE or "propose 3 options"}}
- Hours: {{HOURS}}
- Phone: {{PHONE}}  Address: {{ADDRESS}}

MUST-HAVES
- Mobile-first. It has to look great on a phone before anything else.
- Real, tappable phone/email links and a working nav.
- Fast: optimized images, no heavy libraries unless you justify them.

AVOID
- Generic stock-photo hero of people shaking hands.
- Lorem ipsum — use [PLACEHOLDER] instead so I notice.
- Purple-to-blue gradients and the default "AI startup" look.
- Centered walls of text. Use real layout.

TECH
- Next.js (App Router) + Tailwind CSS, TypeScript.
- Set it up so we can deploy a Vercel preview as soon as the homepage renders.
- Commit to git as you go with clear messages.

Start by restating the brief, then build the homepage first. Stop after the homepage so I can review before you build the rest.
```

**Why the good one wins:** the bad prompt hands Claude every decision, so it returns the average of every coffee-shop site ever made — slop. The good one removes the guesswork (who, feeling, references, real content, what to avoid) so Claude spends its capability on *execution* instead of *guessing what you meant*.

---

### 2. Iteration / Surgical-Fix Prompts

You never rebuild the whole site to fix one thing. You point at the exact problem and change only that. Each of these runs *after* the site exists.

**Prompt 2a — BAD (typography)**

```
the fonts look bad, fix them
```

**Prompt 2b — GOOD (typography)**

```
Typography pass on the homepage only. Don't change layout or color.

Problems I see:
- The headline and body are the same font — no contrast.
- Everything feels the same size; there's no clear hierarchy.

Do this:
- Pair a characterful display font for headings with a clean, readable sans for body. Use {{FONT_PAIR or "suggest 2 pairings from Google Fonts and show me before applying"}}.
- Establish a real type scale (e.g. clear jumps between H1 / H2 / body / small).
- Body line-height ~1.6, max line length ~70 characters for readability.
- Headings tighter line-height, slightly negative letter-spacing on the big H1.

Reference for the feel: {{REFERENCE_SITE}}. Show me the homepage when done.
```

**Why the good one wins:** "fix the fonts" means nothing — Claude can't see what *you* see. The good one names the symptom, scopes the change ("homepage only, don't touch layout"), and gives concrete rules so the result is intentional, not another random guess.

**Prompt 2c — BAD (spacing)**

```
its too cramped add some space
```

**Prompt 2d — GOOD (spacing)**

```
Spacing and rhythm pass. Layout and content stay the same — only adjust spacing.

The page feels cramped and the sections run together. Do this:
- Add consistent vertical breathing room between sections using one spacing scale (e.g. a 4/8px-based system) — no random pixel values.
- More padding inside cards and around the hero text so nothing touches edges.
- Increase the gap between each section so it's obvious where one ends and the next begins.
- On mobile, reduce the section spacing to about 60% of desktop so it doesn't feel empty.

Generous whitespace, like {{REFERENCE_SITE}}. Don't make text bigger — just space it better.
```

**Why the good one wins:** it gives Claude a *system* (one consistent scale) instead of "more space," which prevents the inconsistent, eyeballed padding that makes a site feel amateur.

**Prompt 2e — BAD (hierarchy)**

```
make the important stuff stand out more
```

**Prompt 2f — GOOD (hierarchy)**

```
Visual hierarchy fix on the hero. Right now everything competes — the headline, the button, and the photo all shout equally.

Re-rank by importance:
1. Headline — biggest, highest contrast, first thing the eye lands on.
2. The primary button ({{PRIMARY_ACTION}}) — make it the single most obvious clickable thing: solid fill, clear color, real padding. Only ONE primary button in the hero.
3. Subhead — supporting, smaller, lower contrast than the headline.
4. Everything else recedes.

Demote the secondary link to a plain text/ghost button so it doesn't compete with the primary one. Squint test: I should instantly know where to look and what to click.
```

**Why the good one wins:** it defines hierarchy as a ranked order with one clear winner, instead of "stand out more" — which usually makes Claude embolden *everything*, killing hierarchy entirely.

**Prompt 2g — BAD (color)**

```
change the colors, the blue is boring
```

**Prompt 2h — GOOD (color)**

```
Color pass across the whole site. Keep layout and type as-is.

Build a real palette, not random swaps:
- Primary brand color: {{HEX or "derive from the client's logo, which is attached"}}.
- One accent color used ONLY for primary buttons and key links, so it always means "click me."
- 2-3 neutrals for backgrounds and text (warm off-white background, near-black text — not pure #000).
- Define these as Tailwind theme tokens / CSS variables so they're consistent everywhere and easy to change later.

Check text/background contrast passes WCAG AA. Mood: {{MOOD — e.g. earthy and grounded}}, like {{REFERENCE_SITE}}.
```

**Why the good one wins:** it asks for a reusable, accessible *palette with rules* (accent = clickable) defined as tokens, instead of a one-off swap that leaves the site looking patched.

---

### 3. Component Prompts

When you need one specific piece built or rebuilt, brief just that piece — but tell Claude how it fits the whole.

**Prompt 3a — BAD (nav)**

```
add a navbar
```

**Prompt 3b — GOOD (nav)**

```
Build the site header/nav. It appears on every page.

- Left: {{BUSINESS_NAME}} as a text logo (or the logo image if attached), links home.
- Right: nav links — {{LINK_1}}, {{LINK_2}}, {{LINK_3}} — plus one primary button: "{{CTA — e.g. Book Now}}".
- Sticky on scroll, with a subtle background/shadow that appears only once you start scrolling.
- Mobile: collapse links into a hamburger that opens a clean full-width menu; the primary button stays visible.
- Highlight the current page in the nav.
- Keyboard accessible (tab to links, focus states visible).

Style to match the existing header type and brand color. Show desktop and mobile.
```

**Why the good one wins:** a navbar has a dozen invisible decisions (sticky? mobile behavior? active state? accessibility?). The good prompt makes them so you get a finished component, not a row of plain links you have to fix four more times.

**Prompt 3c — BAD (pricing cards)**

```
make 3 pricing boxes
```

**Prompt 3d — GOOD (pricing cards)**

```
Build a pricing section with 3 tiers as cards.

Tiers (use this content exactly):
- {{TIER_1_NAME}} — ${{PRICE}} — {{ONE_LINE}} — features: {{LIST}}
- {{TIER_2_NAME}} — ${{PRICE}} — {{ONE_LINE}} — features: {{LIST}}
- {{TIER_3_NAME}} — ${{PRICE}} — {{ONE_LINE}} — features: {{LIST}}

Rules:
- Make {{TIER_2_NAME}} the visually highlighted "most popular" card — slightly larger or with an accent border + badge — so the eye goes there first.
- Equal-height cards, aligned feature lists, one button per card using the accent color.
- Mobile: stack vertically, popular card first.
- Consistent padding and spacing using the existing spacing scale.

Match the feel of {{REFERENCE_SITE}}'s pricing.
```

**Why the good one wins:** it bakes in the one thing that makes pricing actually work — a guided "most popular" tier — plus equal-height alignment, which beginners always miss and which instantly separates pro from amateur.

---

### 4. Mobile Fix Prompts

**Prompt 4a — BAD**

```
the mobile version is broken fix it
```

**Prompt 4b — GOOD**

```
Mobile-only fixes. Critical rule: do NOT change the desktop layout — verify desktop still looks identical after.

Issues on a 390px-wide phone screen ({{DEVICE — e.g. iPhone 14}}):
- {{ISSUE_1 — e.g. the hero headline overflows off the right edge}}
- {{ISSUE_2 — e.g. nav links overlap the logo}}
- {{ISSUE_3 — e.g. buttons are too small to tap}}

Fix by:
- Adjusting only mobile breakpoints (Tailwind's responsive prefixes), not the base desktop styles.
- Ensuring nothing overflows horizontally (no sideways scroll).
- Tap targets at least 44x44px.
- Stack columns that are side-by-side on desktop.

Show me both: a 390px mobile view and a 1440px desktop view, so I can confirm desktop is unchanged.
```

**Why the good one wins:** it states the trap directly — fixing mobile by editing base styles silently breaks desktop. Scoping the change to responsive breakpoints and demanding both views back is how you avoid playing whack-a-mole.

---

### 5. Content Restructure Prompts

When the client sends real copy and it doesn't fit the layout you built around placeholder text.

**Prompt 5a — BAD**

```
i pasted the real text, make it work
```

**Prompt 5b — GOOD**

```
The client sent their real copy (below/attached). The current layout was built around placeholder text and now things are unbalanced. Reflow the layout to fit the real content — don't just dump the text in.

Real content:
{{PASTE_REAL_COPY, labeled by section}}

Do this:
- Some sections are now much longer/shorter than the placeholder. Rebalance so no section feels empty or like a wall of text.
- Where a paragraph is too long, break it with a subhead, a pull quote, or a 2-column layout — propose what fits each section.
- Keep the strongest sentence in each section as the visual emphasis (heading or highlight).
- If a section has almost no content, suggest what's missing rather than padding it.

Walk me through what you changed and why before I review.
```

**Why the good one wins:** it tells Claude to *redesign around* the content (the real job) instead of pouring text into boxes built for a different length — the difference between a designed page and a stuffed template.

---

### 6. Deployment Prompts

**Prompt 6a — BAD (deploy)**

```
put it online
```

**Prompt 6b — GOOD (deploy)**

```
Deploy this to Vercel using the Vercel MCP connector.

- First confirm the production build passes locally (run the build, fix any errors before deploying).
- Create/connect the Vercel project for this repo and deploy.
- Give me the live preview URL when it's done.
- If the build fails, show me the error and the fix — don't silently work around it.

This is going in front of the client, so confirm the homepage renders correctly at the live URL before telling me it's done.
```

**Why the good one wins:** it forces a clean build *before* deploy and demands proof the live URL actually works — beginners deploy a broken build and only find out when the client opens it.

**Prompt 6c — BAD (domain)**

```
hook up the domain
```

**Prompt 6d — GOOD (domain + DNS + redirects)**

```
Connect the client's custom domain to the Vercel project.

Domain: {{DOMAIN — e.g. example.com}}
Registrar: {{REGISTRAR — e.g. GoDaddy / Namecheap}}.

- Tell me the EXACT DNS records to add (type, name, value) so I can read them to the client or enter them in their registrar. Walk me through it step by step.
- Set it up so both {{DOMAIN}} and www.{{DOMAIN}} work, redirecting to one canonical version (pick www or non-www and tell me which).
- Make sure HTTPS/SSL is active.
- After I add the records, tell me how to verify it propagated and what to expect if it's slow.

Assume I've never touched DNS before — no unexplained acronyms.
```

**Why the good one wins:** DNS is where beginners freeze. The good prompt gets exact copy-paste records, handles the www/non-www redirect everyone forgets, and bans unexplained jargon so you can actually do it on a call with the client.

---

### 7. Contact Form Prompts

**Prompt 7a — BAD**

```
add a contact form that works
```

**Prompt 7b — GOOD (Formsp: Supabase or Formspree)**

```
Add a working contact form to the {{PAGE}} page.

Fields: Name, Email, {{OPTIONAL — Phone}}, Message. All required except phone.

Backend: use {{Supabase via the Supabase MCP connector | Formspree}} so submissions actually get captured and the client gets notified at {{CLIENT_EMAIL}}.
- If Supabase: create a `contact_submissions` table (name, email, phone, message, created_at), insert on submit, and set row-level security so the form can insert but the data isn't publicly readable.

Behavior:
- Validate email format before submitting.
- Show a clear success message after sending and an error message if it fails — don't just clear the form silently.
- Disable the button while submitting so it can't double-send.
- Spam protection: a honeypot field at minimum.

Test it end to end and confirm a real submission lands where it should before saying it's done.
```

**Why the good one wins:** "a form that works" usually returns a pretty form that goes nowhere. The good prompt nails the part that matters — submissions actually reach the client — plus validation, states, and spam protection that make it production-real.

---

### 8. SEO + Accessibility Prompts

**Prompt 8a — BAD**

```
add some SEO and make it accessible
```

**Prompt 8b — GOOD**

```
SEO and accessibility pass across all pages. Walk through each page and apply:

SEO
- Unique, descriptive <title> and meta description per page, written for a local business in {{TOWN}} (include town + service naturally, e.g. "{{SERVICE}} in {{TOWN}}, CO").
- Proper heading order: one H1 per page, then H2/H3 in order — no skipping levels for styling.
- Open Graph + Twitter card tags so it looks right when shared in a text or on Facebook.
- A favicon and a sitemap.

Accessibility
- Real, descriptive alt text on every image (what it shows, not "image").
- All text passes WCAG AA contrast — flag and fix any that fails.
- Every interactive element is keyboard-reachable with a visible focus state.
- Form inputs have associated labels.

Give me a short list of what you changed per page.
```

**Why the good one wins:** it turns two vague buzzwords into a concrete per-page checklist with local-SEO specifics, so the client actually ranks for "{{service}} in {{town}}" instead of getting generic, invisible meta tags.

---

### 9. Performance Fix Prompts

When you run Lighthouse (in Chrome DevTools) and the Performance score comes back red.

**Prompt 9a — BAD**

```
the site is slow make it faster
```

**Prompt 9b — GOOD**

```
Lighthouse Performance came back at {{SCORE}}/100 on {{mobile|desktop}}. Here are the flagged issues (pasted from the report):

{{PASTE_LIGHTHOUSE_OPPORTUNITIES — e.g. "Largest Contentful Paint 4.2s", "Properly size images", "Reduce unused JavaScript"}}

Work the biggest wins first and tell me the expected impact of each:
- Images: convert to modern formats (WebP/AVIF), use Next.js <Image> with correct sizing, lazy-load below-the-fold images, set width/height to stop layout shift.
- Fonts: preload, use font-display: swap, subset if possible.
- Remove or defer any heavy/unused JavaScript and unused CSS.
- Anything blocking the first paint.

Re-run the build, then tell me what to re-test in Lighthouse. Don't sacrifice the design to win points — explain any visible tradeoff first.
```

**Why the good one wins:** it feeds Claude the *actual report data* and orders the work by impact, instead of "make it faster" — which leaves Claude guessing what's slow on a site it can't load and measure.

---

### 10. Case-Study / Portfolio Generation Prompts

After the client site ships, you turn it into proof for landing client #2.

**Prompt 10a — BAD**

```
write a case study about the website we made
```

**Prompt 10b — GOOD**

```
Build a case-study page for our studio portfolio site about the {{CLIENT_NAME}} project. This is the proof that lands our next paid client, so it sells the outcome, not the tech.

Structure:
- Hero: client name, what they do, one line on the result, and a sharp screenshot/mockup of the live site.
- The challenge: where {{CLIENT_NAME}} was before (no site / outdated site / {{SITUATION}}) and what it was costing them.
- What we did: 2-3 short sections on the real decisions — the direction we chose and WHY (tie it to their customers), not "we used Next.js."
- Before/after or key screenshots (mobile + desktop).
- Result: {{RESULT — e.g. live in 10 days, client quote, first inquiries through the form}}.
- A clear next step: "Want one like this? {{CONTACT_CTA}}".

Tone: confident young studio that ships real work — not a school project. Pull the visual style from our existing portfolio site so it matches.

Then: draft a 120-word version I can adapt into outreach emails to 3 local businesses.
```

**Why the good one wins:** it frames the case study as a *sales asset* organized around the client's problem and outcome — what a future client cares about — instead of a tech diary, and it spins out the outreach copy you need next in the same pass.

---

### 11. Security & RLS-Verification Prompts

If the site touches Supabase (a database) **anywhere** — a contact form that stores submissions, a login, anything — you run this BEFORE you point the domain. Make Claude *prove* it; never accept "looks secure."

**Prompt 11a — BAD**

```
is the contact form secure?
```

**Prompt 11b — GOOD**

```
We use Supabase for {{FEATURE — e.g. storing contact submissions}}. Before we deploy, do a security pass and PROVE each point — don't just assert it:

1. List every table in the project and whether RLS (row-level security) is ENABLED on each.
2. For every table, show me the policies (select / insert / update / delete) in plain English.
3. Prove it with the ANON (public) key: show that a visitor can do only what they should (e.g. insert a submission) and CANNOT read other people's rows. Show the actual query and the permission error it returns.
4. Confirm the service-role key (and any secret) appears NOWHERE in client code or the repo — only the public anon/publishable key is in the browser.
5. Confirm every secret/key lives in environment variables (Vercel) or Supabase function secrets, never committed to git.

List anything that fails, fix it, and re-prove it before we go live.
```

**Why the good one wins:** "is it secure?" gets a reassuring shrug. The good prompt forces Claude to *enumerate every table, show the real policies, and demonstrate with the public key that private data can't be read* — proof you can see, not a promise. This is the single most important prompt before any deploy that touches a database.

---

## The Director's Review Checklist

Run this on every Claude Code output before you accept it. Desktop first, then resize the browser narrow to phone width and run it again. Nothing ships, nothing goes to the client, until every box is checked. If a box fails, you don't fix it by hand — you write the next prompt. Bad prompt: "make it better." Good prompt: the exact failing line below, quoted.

### Typography
- [ ] Body text is at least 16px and never gray-on-gray (dark enough to read at arm's length)
- [ ] No more than two typefaces on the whole site (one for headings, one for body is plenty — see Stripe.com)
- [ ] The biggest heading and the smallest caption feel like the same family, not two random sites glued together
- [ ] Line length for paragraphs caps out around 65-75 characters — text doesn't run edge to edge across a wide screen
- [ ] Headings are clearly bigger/bolder than body — you can tell what's a title from 6 feet away

### Spacing & Layout
- [ ] There's real breathing room — sections aren't crammed; content isn't glued to the top of the screen
- [ ] Spacing is consistent: the gap above every section heading is the same, not random
- [ ] Things line up on an invisible grid — left edges of text, buttons, and images share the same starting line
- [ ] No awkward orphan elements floating alone in a huge empty band
- [ ] Related things sit close together; unrelated things have clear space between them

### Hierarchy
- [ ] You can tell what the page wants you to do first within 3 seconds (the main button/headline wins)
- [ ] There is exactly ONE primary button style per screen — secondary actions look quieter
- [ ] Your eye travels top-to-bottom in a clear order, not bouncing around confused
- [ ] The most important thing (the offer, the booking, the call) is above the fold or one easy scroll away

### Color
- [ ] Three to five colors total, max — not a rainbow
- [ ] One accent color does the heavy lifting (buttons, links) and it's used consistently
- [ ] Text on colored backgrounds is still easy to read — no light-gray text on white, no dark-blue on black
- [ ] Colors match the client's actual brand (logo, sign, existing materials) — not generic AI purple-gradient
- [ ] Backgrounds are calm; color is used to point at things, not to decorate every corner

### Copy
- [ ] No "Lorem ipsum" and no leftover placeholder like "Your Company Here" anywhere
- [ ] Every headline says something specific about THIS client, not a line that could be on any site
- [ ] Spelling and the client's name, hours, phone, and address are correct — you verified against their info
- [ ] Buttons say what happens next ("Book a Cleaning", not "Submit" or "Click Here")
- [ ] No robotic AI filler ("In today's fast-paced world", "We strive to deliver excellence")

### Imagery
- [ ] Every image has alt text that describes what's in it
- [ ] No stock photos that scream fake (cheesy handshakes, random smiling models) unless the client gave them to you
- [ ] Images aren't stretched, squished, or blurry — they keep their real proportions
- [ ] Photos feel like they belong together (similar lighting/mood), not a grab bag
- [ ] The logo is crisp at every size, including the tiny browser-tab icon

### Mobile/Responsive
- [ ] No element touches the screen edge on mobile — there's a margin on both sides
- [ ] Nothing requires sideways scrolling; no text gets cut off the right edge
- [ ] Tap targets (buttons, links) are big enough to hit with a thumb, with space between them
- [ ] The menu works on mobile (hamburger or stacked) — no desktop nav crammed into a phone
- [ ] Text reflows to a single readable column; nothing is so small you'd pinch-zoom to read it

### Performance
- [ ] The page loads fast — under ~3 seconds; no long blank-white wait
- [ ] No giant images — photos are reasonably sized, not 8MB straight off a phone
- [ ] Nothing visibly jumps or shifts around as the page finishes loading
- [ ] Run Chrome DevTools Lighthouse — Performance score is green (90+) or you have a reason it isn't

### Accessibility
- [ ] Every image has alt text (yes, again — it matters here too)
- [ ] You can Tab through the page with the keyboard and see where you are; the focus outline is visible
- [ ] Color isn't the ONLY way info is shown (a link isn't just "the red word" — it's underlined or obvious)
- [ ] Text contrast passes — run Lighthouse Accessibility, score is green (90+)
- [ ] Buttons and links read as real buttons/links to a screen reader (Claude used proper tags, not styled divs)

### SEO
- [ ] The browser tab shows a real page title with the client's name, not "Create Next App"
- [ ] There's a meta description written for this client (the gray text that shows up in Google results)
- [ ] Headings use real structure — one main H1 per page, then H2s under it (ask Claude to confirm)
- [ ] The client's town shows up in the copy (e.g. "Pagosa Springs") so locals find them
- [ ] There's a favicon and a social-share preview image, so the link looks legit when texted or posted

### Security (only if the site uses a database / Supabase)
*Skip this if the site is static with a Formspree or serverless contact form. The moment any Supabase table exists, every box here is mandatory — and nothing goes live until they all pass.*
- [ ] No-database sites use **Formspree or a Vercel serverless function** for the contact form — not Supabase. (Don't stand up a database you don't need.)
- [ ] **RLS (row-level security) is ON for every table.** Ask Claude Code: *"show me the RLS policies on every table and prove they work."*
- [ ] Policies are **tested with the anon/publishable key**: a visitor can do only what they should (e.g. submit the form) and **cannot read** anyone's stored data.
- [ ] **No service-role key — or any secret — in client code or the repo.** Only the public anon/publishable key ever ships to the browser.
- [ ] Secrets and keys live in **Vercel environment variables / Supabase function secrets only**, never committed to git.
- [ ] `get_advisors` (Supabase security) comes back clean — no "RLS disabled" or exposed-table warnings.

---

## The Client Kickoff Guide (Day 1 Discovery Call)

This is the most important hour of the sprint. Everything Claude Code builds for the next nine days is only as good as what you pull out of the client today. You are not "asking some questions." You are the creative directors extracting the raw material that makes the difference between a generic AI site and a site that looks like a senior studio built it. Show up like that.

### Before the call: the 10-minute prep

- **Send an agenda the night before.** A short email. It makes two 15-year-olds look like a studio. (Script in the last section.)
- **Look at their current site and their two best competitors** so you walk in already informed. You'll ask better questions and they'll feel it.
- **Open the shared brief doc** (Google Drive, one doc, titled `[Client Name] — Discovery Brief`). This is your single source of truth for the whole build.
- **Decide your roles before you dial in.** One drives, one writes. Do not both try to do both.
- **Be early.** Be on the call two minutes before the start time, camera on, quiet room. On-time is the cheapest way to look professional and you control it completely.

### Roles: one drives, one takes notes

- **The Driver** runs the conversation: opens the call, asks the questions, reads the room, keeps it moving. Eyes up, talking.
- **The Scribe** types every answer into the brief doc live, under the grouped headings below. Captures exact phrases the client uses — their words about themselves are gold for the site copy later. The Scribe also flags gaps: "We didn't get their hours" goes in a `STILL NEED` list at the bottom.

Swap roles on the next client. Both of you learn both jobs.

### Opening the call (the first 90 seconds)

Set the frame immediately. Calm, prepared, in charge.

> "Hey [Name], thanks for making the time. We're really excited to build this for you. Here's how we'll use the next 45 minutes: we'll ask you a bunch of questions about your business, who you're trying to reach, and what you want this site to do. There are no wrong answers — the more you tell us, the better the site. We'll take notes the whole way, and by the end we'll both be clear on the plan. Sound good?"

Then: "Before we dive in — in one sentence, what does [business] do, and who for?" Let them talk. You're listening for the words they naturally use.

### The question list

Ask these in order. Don't read them robotically — let answers lead to follow-ups. The Scribe files everything under these headings.

**Business & goals**
- In one sentence, what do you do and who do you do it for?
- What's the single most important thing this website should accomplish? (Get calls? Bookings? Sign-ups? Just look legit?)
- If someone lands on the site and does ONE thing, what should it be?
- How do you make money / how do people become customers?
- What does success look like to you three months after this launches?

**Audience**
- Who is your ideal customer? Paint us a picture of one real person.
- How do they find you right now?
- What do they need to feel or know before they trust you?
- What questions do customers ask you over and over?

**Current site & competitors**
- Do you have a site now? What works and what frustrates you about it?
- Name two or three competitors or businesses in your space. (Get URLs.)
- Are there any sites — in any industry — that you look at and think "I wish mine felt like that"? (This one is critical. Get URLs.)

**What they love & hate**
- Show us a website you love the look of. What about it? (Colors? Clean? Bold?)
- Anything you absolutely do NOT want? Any pet peeves? (Stock photos? Sliders? A certain color?)

**Voice & personality**
- If your business were a person, how would they talk? Formal and expert, or warm and casual?
- Three words you'd want a visitor to feel.
- Anyone in your industry whose vibe or writing you admire?

**Services & offers**
- Walk us through what you offer. (Get every service, with the real name they use for each.)
- Any prices, packages, or specials you want shown? Anything you want kept off the site?
- What's the one offer you most want people to choose?

**Logistics** (the Scribe must leave with all of these or they go on `STILL NEED`)
- Do you own a domain? What is it, and who's it registered with? (e.g. GoDaddy, Squarespace)
- Do you have a logo and brand colors? Can you send the files?
- Photos — do you have your own, or do we need to source them? (Their own beats stock every time.)
- Exact business name, phone, email, address, hours as you want them shown.
- Social media links you want included.
- Any deadline or event we should build toward?

### Setting expectations (do this before you hang up)

Say all of this out loud so there are no surprises later:

- **Timeline:** "We'll have a first version for you to look at by Day 3. We launch live by Day 10."
- **It'll look rough in the middle — that's normal:** "When you see the first version, parts will be unfinished or placeholder. That's by design — we build the skeleton first, then layer in the polish. Don't panic at rough edges; tell us what's working and what isn't."
- **Two review points:** "We'll ask for your feedback twice. First on the early version around Day 3, then on the near-final around Day 7. Quick turnarounds from you keep us on track."
- **The deal:** "Just to confirm — this is [free / $250], and in exchange we'd love to feature it as a project in our studio portfolio. Good with you?"
- **Scope — in:** "In scope is [X pages: Home, About, Services, Contact], your content, and getting it live on your domain."
- **Scope — not in (say it now, kindly):** "Things like ongoing blog writing, an online store, or booking software aren't part of this build — but we can talk about adding them later." Naming this now prevents the awkward conversation on Day 8.

### How to make a 15-year-old sound like a professional

Age is not the variable. Preparation and follow-through are. Do these and clients forget how old you are.

- **Be on time, every time.** Two minutes early, camera on. This alone beats half the adults they've worked with.
- **Send the agenda ahead.** A prepared person sends an agenda. It reframes you before you even speak.
- **Open with the map.** "Here's what we'll cover…" tells them you're running this, not winging it.
- **Repeat back to confirm.** After a big answer, say it back: "So the number one job of this site is to get people to call you for a quote — did I get that right?" This catches misunderstandings now and makes them feel heard. It's the single most senior-sounding habit you have.
- **Commit to a concrete date, then beat it.** "We'll have a first version for you by Day 3." Specific commitments build trust. Then deliver early.
- **Handle a question you don't know cleanly.** Never bluff. Use this exact move:

> "Great question — I want to give you the right answer, not a guess. Let me confirm and follow up by end of day."

Then actually follow up by end of day. Looking something up and reporting back makes you look *more* capable, not less. Bluffing and being wrong is what kills trust.

- **Talk in "we."** "We'll send that over." You're a studio, not a kid with a laptop. Speak like one.
- **Send the follow-up email the same day** — within a few hours while it's fresh. Three short parts:
  1. **Thanks + recap:** "Great talking today. Here's what we heard…" then 4-5 bullets of the key points (pulled straight from the brief doc).
  2. **What's next + the date:** "We're starting on the build now. You'll see a first version by Day 3."
  3. **The open loop:** "A couple things we still need from you: [logo files / photos / domain login]. Whenever you get a chance."

That email does two jobs: it proves you listened (the recap), and it puts the ball in their court for the assets you're missing. Send it from a real studio email address, signed with both your names and the studio name.

**The follow-up email is where most people lose the client and you won't.** Send it the same day, every time.

---

## The Handoff Doc Template

This is the document you hand the client on Day 9, the day before launch. It is not paperwork. It is the thing that makes you look like a real studio instead of two kids who built a website. When the client opens it, they should feel calm: everything they need to know is in one place, in plain English, with no surprises.

Copy everything inside the box below into a new doc (Google Doc is fine — share it from your studio Drive). Replace every `{{PLACEHOLDER}}`. The example lines show you the level of detail and tone to match. Delete the example lines once you've written your own.

One rule: no jargon you can't explain out loud. If the client reads a line and would have to ask "what does that mean?", rewrite it.

---

```markdown
# {{CLIENT_BUSINESS_NAME}} — Website Handoff
Prepared by {{STUDIO_NAME}} · {{HANDOFF_DATE}}

---

## What we built
{{ONE_PARAGRAPH_PLAIN_ENGLISH_SUMMARY}}

> Example: A brand-new website for Pagosa Mountain Yoga — a fast, mobile-friendly
> 4-page site (Home, Classes, About, Contact) with your class schedule, studio
> photos, and a contact form that emails you directly. Built to load fast and
> look right on phones, since that's where most of your visitors are.

---

## Your live site
- **Web address (the link you share):** {{LIVE_DOMAIN}}
  > Example: https://pagosamountainyoga.com
- **Where it lives (hosting):** Vercel — a hosting service that keeps your site
  online 24/7 and makes it load fast everywhere. Hosting on our current plan is
  free; you don't pay anything monthly to keep the site up.
- **Your domain name:** Registered through {{DOMAIN_REGISTRAR}} under
  {{WHO_OWNS_THE_DOMAIN}}.
  > Example: Registered through Namecheap under your account
  > (owner@pagosamountainyoga.com). You own it. It renews automatically for
  > about $15/year — keep that card on file current.

---

## Who controls what
| Thing | Who has the keys | Notes |
|---|---|---|
| Domain name | {{DOMAIN_OWNER}} | {{DOMAIN_NOTE}} |
| Hosting (Vercel) | {{HOSTING_OWNER}} | {{HOSTING_NOTE}} |
| Website code | {{STUDIO_NAME}} (GitHub) | We keep the source code; we can hand you a copy any time you ask. |
| Contact form inbox | {{FORM_OWNER}} | {{FORM_NOTE}} |

> Example row: Domain name | You (Namecheap account) | Login emailed to you
> separately. Don't let it expire — that takes the site offline.

---

## How to ask for a change later
The site is done, but sites are never frozen. When you want something updated —
new photos, new prices, a new page — here's how it works:

- **Where to send it:** {{CHANGE_REQUEST_CHANNEL}}
  > Example: Email studio@{{STUDIO_NAME}}.com with the subject "Yoga site change"
- **What to include:** Tell us what you want changed and, if it's text, send the
  exact wording. If it's a photo, attach the actual file.
- **How fast we turn it around:** {{TURNAROUND}}
  > Example: Small changes (text, swap a photo, update a price) — within 3 business
  > days. Bigger changes (a new page, new features) — we'll quote you a timeline first.
- **What it costs:** {{CHANGE_COST_POLICY}}
  > Example: Small tweaks are free for the first 30 days after launch. After that,
  > small changes are $25 each; larger work is quoted up front before we start.
  > You'll always approve the cost before we do anything.

---

## What's included in this project
{{INCLUDED_LIST}}

> Example:
> - {{N}}-page website ({{LIST_THE_PAGES}})
> - Mobile, tablet, and desktop layouts
> - Contact form that emails submissions to you
> - Basic search-engine setup (page titles, descriptions) so you can be found on Google
> - Connected to your domain with a secure (https) lock
> - One round of revisions after your review

---

## What's NOT included (out of scope)
Being clear here protects both of us. These weren't part of this project. We can
quote any of them as a follow-up if you want them later.

{{NOT_INCLUDED_LIST}}

> Example:
> - Online store / taking payments on the site
> - Ongoing blog writing or content updates
> - Booking/scheduling software integration
> - Logo design or full brand identity
> - Email newsletter setup
> - Social media management

---

## Seeing your traffic (analytics)
{{ANALYTICS_DETAIL}}

> Example: We set up Vercel Analytics, which shows how many people visit, which
> pages they look at, and what device they're on. To view it: log in at
> vercel.com with the account we'll add you to, open the project, and click the
> "Analytics" tab. No personal data about visitors is collected — just counts.

---

## Where your contact form goes
{{CONTACT_FORM_DETAIL}}

> Example: When someone fills out the contact form, the message is emailed
> straight to {{FORM_RECIPIENT_EMAIL}}. Check that inbox (including spam the
> first few times) so you don't miss a customer. Test it yourself on launch day —
> submit a message and confirm it lands.

---

## Your handoff items (keep these somewhere safe)
We'll send anything sensitive (passwords, login links) in a separate, secure
message — never buried in this doc.

| Item | Where it is | Sent how |
|---|---|---|
| Domain registrar login | {{DOMAIN_REGISTRAR}} | {{SENT_HOW}} |
| Vercel account access | vercel.com | {{SENT_HOW}} |
| Contact form inbox | {{FORM_RECIPIENT_EMAIL}} | {{SENT_HOW}} |
| Copy of the website code | GitHub | On request |
| This handoff doc | {{DOC_LOCATION}} | Shared with you |

> Example "Sent how": Sent in a separate email on launch day · Added you as a
> member, no password needed.

---

## A quick word
{{CLOSING_LINE}}

> Example: Thank you for trusting us with your first website — it was genuinely
> fun to build, and we're proud of how it turned out. It's yours now. If anything
> ever looks off or you just have a question, reach out anytime. We've got you.
>
> — {{YOUR_NAMES}}, {{STUDIO_NAME}}
```

---

A few things that separate a pro handoff from an amateur one:

- **Never put real passwords in this doc.** The doc gets forwarded, screenshotted, left open on a screen. Sensitive logins go in a separate message — that's why the table says "Sent how," not the actual password.
- **Fill in the cost policy honestly and stick to it.** The most common way young freelancers get burned is the client who keeps asking for "one tiny thing" forever, for free. Your `{{CHANGE_COST_POLICY}}` line is what protects you. Don't soften it because you feel awkward — a clear policy is a kindness to both sides.
- **Walk the client through this doc live on Day 9**, screen-share or in person, top to bottom. Don't just email it. Watching their face tells you which lines confused them — those are the lines to rewrite before launch.

---

## The Client Acquisition Playbook — Landing Paid Client #2

You shipped a real site for a real client. That's not a school project anymore — that's a portfolio. Now you turn it into money. This is the exact system for landing your first paying client. Work it in order.

### Who to target (and why)

You're not selling to "businesses." You're selling to specific kinds of local owners who lose money every week because their web presence is bad or missing. In Pagosa Springs and Woodland Park, these are your lanes:

| Target | Why they're a good bet | What a good site does for them |
|---|---|---|
| **Restaurants & cafes** | High foot traffic, often stuck on a clunky Facebook page; menus live in a blurry photo | Mobile menu, hours, map, "order/reserve" button — the 3 things every hungry tourist Googles |
| **Outfitters & guides** (rafting, fly-fishing, hunting, snowmobile, jeep tours) | Seasonal cash, tourist-driven, competing on Google for "Pagosa rafting" right now | Trip pages with photos + a booking/inquiry form that captures leads before the competitor does |
| **Contractors** (builders, roofers, plumbers, electricians, landscapers) | Make real money, hate marketing, usually have zero site or a dead one | A gallery of past jobs + a quote-request form = the trust that wins the bid |
| **Salons & spas** | Booking-driven, image-conscious, judged on how polished they look | Clean gallery, service list, and a "Book Now" button wired to their scheduler |
| **Churches** | Often warm to two local teens; need event/service info more than sales | Service times, events calendar, "plan your visit," sermon links — clarity over flash |
| **Photographers** | Live or die by their portfolio, yet many are trapped on slow template sites | A fast, full-bleed image gallery that actually loads — the work sells itself |
| **Real estate agents** | Commission-rich, personal-brand-driven, will pay to stand out from the brokerage template | A sharp personal-brand site with listings + a "let's talk" lead form |

### Find 10 prospects with bad or missing websites

You need a list of 10 before you send a single email. Spend one focused session building it. Here's the hunt:

1. **Google Maps sweep.** Search "restaurants Pagosa Springs," "contractors Woodland Park," etc. Open each listing. Three red flags = a prospect:
   - **No website link at all** (just a phone number) — easiest sell, they have nothing.
   - **"Website" points to a Facebook page** — they know they need presence but never got a real site.
   - **Low review count or "claim this business"** — they're not paying attention online; you can fix that.
2. **Facebook-only businesses.** Search the business on Facebook. If their "About" link is their only home on the internet, that's a flag. Facebook pages don't show up well on Google and they don't own them.
3. **Open the site on your phone first.** This is the fastest filter. If you have to pinch-to-zoom, if text overflows, if a button is too small to tap — it's not mobile-friendly, and 70%+ of their visitors are on phones. Instant talking point.
4. **Speed and ugly checks.** If a site takes more than 3-4 seconds to load, looks like it was made in 2009, has tiny photos, broken links, or a "Copyright 2016" in the footer — flag it.

Build a simple sheet: **Business name | Owner name (if you can find it) | Category | What's wrong | Contact (email/form/IG DM)**. Fill 10 rows. Owner name is gold — find it on their About page, Facebook, or a Google review reply.

> Tip: paste a screenshot of their current site into Claude Code and ask: *"In one sentence, what's the single biggest problem a customer would hit on this site on a phone?"* That gives you your specific observation for template #2.

### Three outreach emails (genuinely different angles)

Send these from your studio email, signed by both of you. Keep them short — owners are busy. Always link your portfolio and the Day 1 client site. Customize every `{{PLACEHOLDER}}` — generic outreach dies in the trash.

**Template 1 — Cold but warm (the local intro)**

```
Subject: Two local kids who build websites for {{TOWN}} businesses

Hi {{OWNER_NAME}},

We're Carter and Harper — we're 15, we live here in {{TOWN}}, and we
run a small web studio that builds clean, fast websites for local
businesses.

We just finished a site for {{DAY1_CLIENT}} ({{DAY1_CLIENT_URL}}) and
we're looking to take on one or two more {{CATEGORY}} clients this
summer.

If a sharper website is something you've been meaning to get to, we'd
love to show you what we'd do for {{BUSINESS_NAME}} — no pressure, no
cost to look. Could we grab 15 minutes this week?

— Carter & Harper
{{STUDIO_NAME}} · {{PORTFOLIO_URL}}
```

**Template 2 — "I noticed your site..." (the specific observation)**

```
Subject: Quick note about the {{BUSINESS_NAME}} website

Hi {{OWNER_NAME}},

We pulled up {{BUSINESS_NAME}} on our phones today and noticed
{{SPECIFIC_PROBLEM}} — for example, {{CONCRETE_EXAMPLE}}. Since most
of your customers are searching on their phones, that's probably
costing you calls.

We're Carter and Harper, a local web studio. We just built
{{DAY1_CLIENT_URL}} and we could rebuild yours to load fast and look
great on every phone.

Want us to mock up your homepage for free so you can see the
difference? If you like it, we'll talk about finishing the whole site.

— Carter & Harper
{{STUDIO_NAME}} · {{PORTFOLIO_URL}}
```

**Template 3 — Warm intro / referral**

```
Subject: {{REFERRER_NAME}} suggested I reach out

Hi {{OWNER_NAME}},

{{REFERRER_NAME}} mentioned you've been thinking about a new website
for {{BUSINESS_NAME}} and thought we might be a good fit.

We're Carter and Harper — a local web studio here in {{TOWN}}. We
recently built {{DAY1_CLIENT}}'s site ({{DAY1_CLIENT_URL}}), and
{{REFERRER_NAME}} can vouch that we actually finish what we start.

We'd love to learn what you have in mind. Are you free for a quick
call {{DAY_OPTION_1}} or {{DAY_OPTION_2}}?

— Carter & Harper
{{STUDIO_NAME}} · {{PORTFOLIO_URL}}
```

Why these win: each one earns the reply a different way. #1 leads with *local + proof* (a stranger trusts a neighbor with a track record). #2 leads with *a specific, true observation* (you've clearly looked at their business, not blasted a list). #3 borrows *someone else's trust* (a referral is the warmest open there is). Match the angle to what you actually have on each prospect.

### Pricing tiers

Three options. Always present all three — most people pick the middle, and the $1,500 makes $1,000 feel reasonable. Name your price out loud and don't flinch.

| | **Starter — $500** | **Standard — $1,000** | **Premium — $1,500** |
|---|---|---|---|
| **Best for** | Brand-new or replacing a Facebook page | Most businesses | Booking/lead-driven businesses |
| **Pages** | 1 (one-page site) | Up to 4 (Home, About, Services, Contact) | Up to 6 + a gallery |
| **Mobile-friendly** | Yes | Yes | Yes |
| **Contact form** | Yes | Yes | Yes |
| **Photo gallery** | — | Basic | Full, optimized |
| **Google Maps + hours** | Yes | Yes | Yes |
| **Booking / inquiry flow** | — | — | Yes |
| **Connect your domain** | Yes | Yes | Yes |
| **Basic SEO** (titles, descriptions, Google-ready) | — | Yes | Yes |
| **Revisions included** | 1 round | 2 rounds | 3 rounds |
| **Delivery** | ~1 week | ~2 weeks | ~2-3 weeks |

Optional add-on for any tier: **Care plan — $40/mo** (hosting kept live, small text/photo updates, you're on call for fixes).

### One-page service menu

```
{{STUDIO_NAME}} — What We Do

We build clean, fast websites for local businesses. No templates,
no clutter — a site that looks great on every phone and brings you
calls, bookings, and customers.

SERVICES
• New website (1–6 pages)            from $500
• Website rebuild / redesign          from $500
• Mobile-friendly cleanup             from $250
• Photo gallery setup                 included in Standard+
• Booking / inquiry forms             included in Premium
• Connect your own domain             included
• Basic SEO (show up on Google)       included in Standard+
• Care plan (updates + hosting)       $40/mo

HOW IT WORKS
1. Free 15-minute call — we learn your business.
2. We send a quote + timeline.
3. You pay half to start.
4. We design, you review, we revise.
5. We launch on your domain. You pay the rest.

Built local in {{TOWN}} by Carter & Harper.
{{PORTFOLIO_URL}}
```

### Plain-language contract template

Short on purpose. A parent should be able to read it in two minutes. Both sides sign before work starts.

```
WEBSITE AGREEMENT

Between: {{STUDIO_NAME}} ("we") and {{CLIENT_NAME}} ("you")
Date: {{DATE}}

THE PROJECT
We will build a website for {{BUSINESS_NAME}}: {{NUMBER}} pages
({{PAGE_LIST}}), mobile-friendly, with {{KEY_FEATURES, e.g. contact
form, photo gallery, Google Maps}}.

PRICE
Total: ${{TOTAL}}.
Half (${{HALF}}) due before we start. The rest due at launch,
before the site goes live on your domain.

TIMELINE
We aim to launch within {{TIMELINE, e.g. 2 weeks}} of receiving your
deposit and all of your content (see below).

REVISIONS
{{NUMBER}} rounds of changes are included. Extra rounds or new pages
added after we start are billed at ${{HOURLY, e.g. 25}}/hour, agreed
in writing first.

WHAT YOU PROVIDE
• Your logo and any photos you want used (or we'll source stock)
• Your text/content, or notes for us to write from
• Hours, address, phone, and any booking/social links
• Access to your domain (or we'll help you buy one)

WHAT WE PROVIDE
A finished, working website on your domain. We'll show you how to
request small updates.

OWNERSHIP
When the final payment is made, the website is yours.

ENDING EARLY
If you cancel after we start, the deposit covers work done so far
and is non-refundable.

Signed:
You: ____________________   Date: ______
Us:  ____________________   Date: ______

(For clients under our age, a parent/guardian co-signs:
{{PARENT_NAME}}: ____________________   Date: ______)
```

### Intake form — new prospect questions

Tighter than your Day 1 brief. Send this as a Google Form or ask it live on the call. The answers become your Claude Code prompt.

1. **Business name and what you do** — in one sentence.
2. **Who's your ideal customer?** (tourist, local, families, high-end, budget?)
3. **What's the #1 thing you want a visitor to DO?** (call, book, order, get directions, fill out a form)
4. **Do you have a website now?** If yes, what do you hate about it? What do you want to keep?
5. **Show us 2-3 websites you love** — competitors or any business. What do you like about each? *(This is the single most valuable answer — it's your reference for the design.)*
6. **Your colors / logo / fonts** — do you have a brand, or are we creating the look?
7. **What pages do you need?** (Home, About, Services, Menu, Gallery, Contact, Booking…)
8. **Do you have photos?** Good ones? Or do we source stock / shoot some?
9. **Do you own a domain?** (the www address) If not, what would you want it to be?
10. **What's your budget and your deadline?** (Be honest — it tells us which tier fits.)

> The answer to #5 is the difference between a generic site and a great one. Push for it. "Show me three sites you love" turns the client into your art director — and gives you the exact references to hand Claude Code.

---

## The Resource Library (10 links max — don't wander)

- **[Awwwards](https://www.awwwards.com)** — Award-winning agency sites. Use Day 1-2 to pull 3-5 reference sites you'll paste into Claude Code as "make it feel like this." Filter by your client's industry.
- **[Land-book](https://land-book.com)** — Thousands of real landing pages, filterable by style and category. Use Day 1-2 alongside Awwwards to find layouts that fit a small local business, not a flashy tech startup.
- **[Godly](https://godly.website)** — Tighter, more curated than Awwwards — the taste is sharper. Use Day 1-2 when you want one hero reference that sets the bar for the whole site.
- **[Mobbin](https://mobbin.com)** — Real screenshots of real apps and sites, organized by flow (pricing, contact, gallery). Use Day 3-7 when you're building a specific section and need to see how pros lay out exactly that piece.
- **[The Futur (YouTube)](https://www.youtube.com/@thefutur)** — Pick this one. Chris Do teaches design judgment and how to talk to clients like a pro — the exact skill that separates you from a kid with a laptop. Watch 1-2 videos before Day 1 and during evenings. (Alternatives: DesignCourse for hands-on UI tutorials, Flux Academy for full web-design walkthroughs — sample if The Futur doesn't click.)
- **[Practical Typography](https://practicaltypography.com)** (Butterick) — The fastest way to stop your site from looking amateur. Read "Summary of Key Rules" Day 2-3, then use it to spot bad type and tell Claude Code exactly what to fix (line length, font pairing, sizes).
- **[Refactoring UI](https://www.refactoringui.com)** — Read the **color** and **spacing** chapters specifically (free samples + the book). Use Day 3-7. This is how you stop accepting Claude's first draft and start directing real spacing and palette decisions.
- **[Unsplash](https://unsplash.com)** — Free, high-quality photos for placeholder or real imagery. Use Day 3-8 when the client hasn't sent photos yet, so the site never looks empty in front of them.
- **[Vercel Docs](https://vercel.com/docs)** — The source of truth for deploying and connecting the client's real domain. Use Day 8-10 when you go live; reference it the moment a deploy or DNS step confuses you.

If it's not on this list, you don't have time for it this sprint.

---

## The Two-Person Studio Workflow

You run this studio as two people with two jobs. Every working block, you each hold one of these roles. You never both stare at the same screen hoping the other one figures it out.

**DRIVER** — hands on the keyboard. Writes the prompt, references the inspiration, sends it to Claude Code, runs the dev server, deploys. The Driver owns getting a clear instruction *into* the machine.

**DIRECTOR** — hands off the keyboard, eyes on the output. Runs the Director's Review Checklist against everything Claude Code produces. Decides what's wrong, what's generic, what the client would hate. Calls the next move. The Director owns whether the work is good enough to keep.

The Driver makes the AI build. The Director makes sure it built the right thing. Both jobs are the real skill — pulling great work out of Claude Code is half writing the prompt and half having the taste to reject the first draft.

### You swap at the mid-day break, every day

Morning block: one Driver, one Director. After lunch: switch. No exceptions, no "I'm on a roll, let me keep driving." Both of you need reps on the keyboard *and* reps judging output, or one of you turns into a passenger and the other burns out. By Day 10 you should each be able to run the whole loop alone. Swapping daily is how you get there.

### Nothing ships until the Director runs the checklist

This is the hard rule. Claude Code spits out a homepage in ninety seconds. It looks finished. It is not approved. **No output — not a section, not a color change, not a deploy — gets accepted until the Director has run the Director's Review Checklist on it out loud.**

This is where the whole "you're the creative director, not a coder" idea becomes real. The AI's first answer is almost always competent and generic. Your job is to catch the generic.

Watch the difference in how the Director feeds the next prompt:

**BAD — Director reaction**
```
Looks good, ship it.
```

**GOOD — Director reaction**
```
Checklist fail on three things:
1. The hero headline is "Welcome to Our Restaurant" — that's the
   AI default. Client is a wood-fired pizza spot; headline should
   sell the oven. Rewrite to something like "Blistered crust,
   90 seconds, wood fire only."
2. Hero photo is a stock pizza. Swap in the client's real photo
   from the Google Drive folder (oven-shot.jpg).
3. Three font sizes in the hero. Reference how Tartine's site keeps
   one big display size + one body size. Match that restraint.
Driver: feed those three back as one prompt, in order.
```

Why the good one wins: "ship it" accepts AI slop and a generic site is what gets the client to quietly ghost you. The good review names exactly what's wrong, ties it to *this* client, and points at a real reference (Tartine Bakery's site) the Driver can hand straight to Claude Code. That's the move that makes the site look senior.

### End-of-day studio review — 15 minutes, every day

Last thing before you close laptops. Sit down together, 15 minutes, hit four questions:

1. **What shipped today?** (live URL, deployed section, approved copy — real things)
2. **What's stuck?** (anything blocking you, anything Claude Code couldn't get right after 3 tries)
3. **What did we learn?** (one prompting lesson — what made a prompt work or fail today)
4. **What do we need from the client tomorrow?** (a photo, a phone number, a yes/no on a layout)

Write those four answers down in your studio log. That log *is* the parent dashboard — Bryan and Amy read it to see momentum, spot a stall before it eats a day, and know if the client needs a nudge. Keep it honest. "Stuck on the nav for 2 hours" is more useful than "great progress!"

### Friday retro — end of each week

Twenty minutes, end of Day 5 and Day 10. Three questions, answered straight:

1. **What worked?** (the prompting habits, references, and workflow moves to keep)
2. **What do we change next week?** (drop what wasted time — a tool, a habit, a meeting)
3. **Are we on track to ship by Day 10?** (yes / no / what has to be true to get there)

End of Week 1, you should have a working site the client has seen. If you don't, the Friday retro is where you say so out loud and replan — not Day 9.

### The one rule under all of this

**No passengers.** At any given moment one of you is building and the other is judging — nobody is just watching.

---

## The Parent Dashboard (Bryan checks once/day)

This is the single page Bryan reads each morning with his coffee. One file. You update it at the end of every work session. Keep it in your repo as `DASHBOARD.md` (Claude Code can update it for you — tell it what shipped and it writes the row), or in a shared Google Doc. It is not a diary. It is a status board a busy adult can read in 30 seconds and instantly know: are they on track, is the client happy, and does anyone need to do anything today.

Copy this template in. Add a new row at the top of the log each day so the newest day is always first.

```markdown
# Web Studio Sprint — Status Board

## Sprint status at a glance
**Day:** 2 of 10  |  **On track?** ✅ Yes  |  **Client site:** Design approved, building homepage  |  **Client #2:** Not started (outreach Day 9)

---

## Daily Log

### Day 2 — Tue 2026-06-02
- **SHIPPED:** Homepage hero + nav live on the Vercel preview link. Sent to client for first look.
- **PROMPTING SKILL LEARNED:** Referencing real sites. We told Claude Code "make the hero feel like the Mast Brothers site — big photo, tiny confident text" instead of "make it look nice." Night and day.
- **STUCK / BLOCKED:** Hero photo the client gave us is blurry at full width. Looks bad.
- **NEED FROM CLIENT:** A high-res version of their storefront photo (the blurry one is ~800px, we need 2000px+).
- **NEED FROM BRYAN:** Nothing today.

### Day 1 — Mon 2026-06-01
- **SHIPPED:** Repo created, Next.js project running locally, deployed a blank site to Vercel (it's live!). Kickoff call with client done — notes saved.
- **PROMPTING SKILL LEARNED:** Giving Claude Code a brief, not a wish. We wrote out who the client is, who their customers are, and the 3 things the site must do BEFORE asking for any code.
- **STUCK / BLOCKED:** Nothing — slow start but no blockers.
- **NEED FROM CLIENT:** Their logo file and brand colors if they have them.
- **NEED FROM BRYAN:** Confirm you can sit in on the Day 3 design-review call (client asked).

---

## Reference notes (only if helpful)
- Client: [name + business]
- Live preview link: [Vercel URL]
- Real domain (goes live Day 10): [domain]
```

**How to fill each field — keep it tight:**
- **SHIPPED** = something that now exists and works. "Started the about page" is not shipped. "About page live on the preview link" is shipped. If nothing shipped, write *Nothing shipped — here's why* and put the real reason in STUCK.
- **PROMPTING SKILL LEARNED** = the one prompting move that made the biggest difference that day. This is the whole point of the sprint. One sentence.
- **STUCK / BLOCKED** = the thing eating your time. Be honest. "Stuck for 2 hrs on the contact form" is a green flag, not a red one — it tells Bryan where to help.
- **NEED FROM CLIENT / BRYAN** = a specific ask with a specific item. "Some photos" is weak. "3 high-res photos of the inside of the shop, landscape orientation" is an ask someone can actually act on. Write *Nothing today* if there's nothing.

Rule: the at-a-glance line at the top is never out of date. If you change nothing else, change that line. It's the one thing Bryan reads first.

---

## End-of-Sprint Checklist (Day 10 Pass/Fail Bar)

This is the bar. Not "we tried hard." Not "it's basically done." Five boxes. Either they're checked with proof, or they're not. A real studio ships — so this is how you know you shipped.

- [ ] **Client site is LIVE on the client's own domain**
  Prove it: open an incognito window, type the client's real domain (e.g. `highcountrybakery.com`, not `something.vercel.app`), and the site loads with a padlock (HTTPS). Text a screenshot of the address bar to a parent. If it only works on the Vercel URL, the box is empty.

- [ ] **Client has APPROVED the site (in writing)**
  Prove it: an email or text from the client that says, in their own words, some version of "Yes, this is approved — go live." A thumbs-up emoji counts. A verbal "looks great" on a call does not. Screenshot it and save it — this is also the first testimonial for your portfolio.

- [ ] **Studio portfolio site is live with this project as case study #1**
  Prove it: your studio site loads on its own domain in incognito, and the case study page shows the real client work — a screenshot of their live site, one line on the problem, one line on what you built, and a link to the live client domain. Like the work pages on [studiofreight.com](https://studiofreight.com) or [pentagram.com](https://pentagram.com): show the result, don't just describe it.

- [ ] **3 outreach emails sent for paid client #2**
  Prove it: three emails actually in your Sent folder, to three named real businesses (not "I'll send them tomorrow"), each one linking to your live portfolio and the live client site as proof you can do the work. Three drafts sitting unsent is a zero.

- [ ] **BOTH Carter and Harper can independently brief Claude Code to build a new site from scratch**
  Prove it: each of you, alone, opens a fresh Claude Code session and writes a first build prompt for an imaginary new client — naming a reference site, a color and type direction, the page sections, and the vibe in plain words — without the other one helping. If only one of you can do it, you don't have a studio, you have one director and one passenger. Both, or it's not checked.

**Non-negotiable security gate (every site you ship, this client and every future one):** if the site uses a database, RLS is on and *proven* on every table with the public key, and no secret key lives in client code. No site goes live until this passes — period.

If you hit all five, you're a real studio now. You have a live client, a signed-off result, a portfolio that proves it, leads in motion, and two directors who can each pull excellent work out of Claude Code. That's not a school project. That's a business with a track record. Go get client #2.
