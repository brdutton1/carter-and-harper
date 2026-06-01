/* ============================================================
   CARTER & HARPER — THE EDIT FILE
   ============================================================

   Carter: THIS is the only file you need to touch.
   Change the words and numbers between the "quotes" and save.
   Don't delete the quotes, commas, or brackets — just the words inside.

   When you save and push, the website updates by itself in about a minute.
   ============================================================ */

const CONTENT = {

  /* ---- THE BASICS ---- */
  brandName: "Carter & Harper",
  tagline: "We build websites that actually look good.",
  // Short line under the big title on the home screen:
  heroSubtext: "Two teenagers, real websites, fair prices. Tell us what you need and we'll make it.",

  // Where project requests and messages get emailed.
  // (Right now they go to Bryan. To change it later, see README.)
  contactEmail: "bryan@allegrodesignco.com",

  // OPTIONAL: paste a Web3Forms access key here to turn the form into
  // real email delivery (free — see README "Turn on the form").
  // Only used as a fallback if the AI proposal endpoint below isn't set up. Leave as "" otherwise.
  formAccessKey: "",

  /* ---- AI PROPOSAL ENGINE ----
     When someone submits the form, this is the URL the site calls.
     "/api/proposal" is the serverless function that lives next to this site on Vercel.
     If it's not set up yet, the form falls back to opening the visitor's email app — nothing breaks. */
  ai: {
    proposalEndpoint: "/api/proposal",
    // Small line shown above the form's submit button. Leave "" to hide.
    callout: "Powered by AI — get a real proposal in about 90 seconds. We review it before it lands in your inbox.",
  },

  /* ---- COLORS (hex codes — change to recolor the whole site) ---- */
  colors: {
    background: "#0f0e17",   // page background (dark)
    text:       "#fffffe",   // main text
    accent:     "#ff8906",   // buttons + highlights (orange)
    accent2:    "#f25f4c",   // second highlight (coral)
    accent3:    "#e53170",   // third highlight (pink)
    card:       "#1c1b29",   // box/card background
  },

  /* ---- HOW WE WORK (the 5 steps from "they ask" to "site is live") ---- */
  process: {
    heading: "How we work",
    subtext: "From hello to live website — here's how it goes.",
    steps: [
      { title: "Tell us about your project",      text: "Fill out the short form below. Takes about 2 minutes." },
      { title: "Get a real proposal in 90 seconds", text: "Our system drafts a custom plan and price. We review it personally before it lands in your inbox." },
      { title: "We design it together",           text: "We share a draft, you tell us what to change. We don't move on until you love it." },
      { title: "We build it for real",            text: "Fast, mobile-friendly, made to last. You see the progress as it happens." },
      { title: "Launch + we keep it running",     text: "Go live with your own web address. Add a monthly care plan if you want us to keep it fresh." },
    ],
  },

  /* ---- WHAT WE DO (the three things shown on the home page) ---- */
  whatWeDo: [
    {
      emoji: "✏️",
      title: "Design",
      text: "We pick colors, fonts, and layout so your site looks clean and modern — not like it's from 2005.",
    },
    {
      emoji: "⚡",
      title: "Build",
      text: "We turn the design into a real, fast website that works on phones and computers.",
    },
    {
      emoji: "🚀",
      title: "Launch",
      text: "We get it online with your own web address and show you how to keep it updated.",
    },
  ],

  /* ---- PRICING PACKAGES ---- */
  // Add or remove packages by copying a whole { ... } block.
  // Put "popular: true" on the one you want to highlight.
  packages: [
    {
      name: "One-Page Site",
      price: "$150",
      blurb: "Perfect for a single page that tells people who you are.",
      features: [
        "1 page, looks great on phones",
        "Your colors and logo",
        "Contact button or form",
        "Online in about a week",
      ],
      popular: false,
    },
    {
      name: "Small Business Site",
      price: "$400",
      blurb: "A few pages for a real business or service.",
      features: [
        "Up to 5 pages",
        "Custom design, not a template",
        "Contact form that emails you",
        "Photo gallery or menu",
        "1 round of changes included",
      ],
      popular: true,
    },
    {
      name: "Glow-Up Redesign",
      price: "$250",
      blurb: "Already have a site that looks old? We fix it.",
      features: [
        "Redesign your existing site",
        "Faster and mobile-friendly",
        "Fresh colors and layout",
        "Keep your same content",
      ],
      popular: false,
    },
  ],

  // Small print under the pricing. Change or empty it ("").
  pricingNote: "Prices are starting points. Bigger or custom projects? Use the form below and we'll send a quote.",

  /* ---- MONTHLY CARE PLANS (this is how we get paid every month) ---- */
  maintenance: {
    heading: "Keep it running — monthly care plans",
    subtext: "A website isn't 'done' when it launches. It needs updates, backups, and little fixes. Pick a plan and we handle all of it every month so you never have to think about it.",
    plans: [
      {
        name: "Basic Care",
        price: "$25",
        period: "/mo",
        blurb: "We keep your site online, safe, and working.",
        features: [
          "Hosting kept live & checked",
          "Security & software updates",
          "Monthly backup",
          "Small text fixes (up to 30 min/mo)",
        ],
        popular: false,
        // Paste the Stripe Payment Link URL once Bryan creates it. Until then, button jumps to the form.
        paymentLink: "",
      },
      {
        name: "Plus Care",
        price: "$50",
        period: "/mo",
        blurb: "Everything in Basic, plus we keep it fresh for you.",
        features: [
          "Everything in Basic Care",
          "Monthly content updates",
          "Add new photos or swap a page",
          "Priority — we reply to you first",
        ],
        popular: true,
        // Paste the Stripe Payment Link URL once Bryan creates it. Until then, button jumps to the form.
        paymentLink: "",
      },
    ],
    note: "Cancel anytime — no long contracts. Most clients add a care plan when their site launches.",
  },

  /* ---- ABOUT ---- */
  about: {
    heading: "Who we are",
    text: "We're Carter and Harper — two friends who got obsessed with how websites work and decided to start building them for real. We're young, but we're serious about this. We use AI the way it should be used — to do the boring parts faster, not to replace the people who actually care about your project. You'll talk to us directly. You'll see exactly what you're paying for. And you'll get a site you're proud of.",
  },

  /* ---- THE FORM ---- */
  form: {
    heading: "Start a project",
    subtext: "Answer a few quick questions. We'll send you a real proposal in about 90 seconds.",
    // The dropdown of project types on the form:
    projectTypes: [
      "One-Page Site",
      "Small Business Site",
      "Glow-Up Redesign",
      "Monthly care plan",
      "Something else",
      "Not sure yet",
    ],
    pageOptions: [
      "1 page",
      "2-5 pages",
      "6-10 pages",
      "More than 10",
      "Not sure",
    ],
    deadlineOptions: [
      "ASAP",
      "Within 1 month",
      "1-3 months",
      "No rush",
      "Specific date (tell us below)",
    ],
    budgetOptions: [
      "Under $200",
      "$200 – $500",
      "$500 – $1,000",
      "More than $1,000",
      "Not sure",
    ],
    buttonText: "Get my proposal 🚀",
  },

  /* ---- FOOTER ---- */
  footerText: "Built by Carter & Harper. (Yes, we built this site too.)",
};

// Don't change this line.
if (typeof module !== "undefined") { module.exports = CONTENT; }
