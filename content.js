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
  // Until then, the form opens the visitor's email app instead. Leave as "" if unused.
  formAccessKey: "",

  /* ---- COLORS (hex codes — change to recolor the whole site) ---- */
  colors: {
    background: "#0f0e17",   // page background (dark)
    text:       "#fffffe",   // main text
    accent:     "#ff8906",   // buttons + highlights (orange)
    accent2:    "#f25f4c",   // second highlight (coral)
    accent3:    "#e53170",   // third highlight (pink)
    card:       "#1c1b29",   // box/card background
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

  /* ---- ABOUT ---- */
  about: {
    heading: "Who we are",
    text: "We're Carter and Harper — two friends who got into building websites and got pretty good at it. We're not a giant company, which means you talk to the actual people making your site, and you don't pay agency prices. We care about your project and we'll make sure you love it.",
  },

  /* ---- THE FORM ---- */
  form: {
    heading: "Start a project",
    subtext: "Tell us about what you need. We'll get back to you within a couple of days.",
    // The dropdown of project types on the form:
    projectTypes: [
      "One-Page Site",
      "Small Business Site",
      "Glow-Up Redesign",
      "Something else",
      "Not sure yet",
    ],
    budgetOptions: [
      "Under $200",
      "$200 – $500",
      "$500 – $1,000",
      "More than $1,000",
      "Not sure",
    ],
    buttonText: "Send it 🚀",
  },

  /* ---- FOOTER ---- */
  footerText: "Built by Carter & Harper. (Yes, we built this site too.)",
};

// Don't change this line.
if (typeof module !== "undefined") { module.exports = CONTENT; }
