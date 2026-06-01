// Vercel Serverless Function — Carter & Harper proposal engine.
// Receives the project form, asks Claude to draft a proposal, and emails it.
// Bryan owns the keys; Carter never touches this file.

import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

// In-memory throttle (resets when the function cold-starts — fine for this scale)
const HITS = new Map();
const MAX_PER_IP_PER_DAY = 10;

function rateLimited(ip) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const entry = HITS.get(ip) || { count: 0, first: now };
  if (now - entry.first > day) { entry.count = 0; entry.first = now; }
  entry.count += 1;
  HITS.set(ip, entry);
  return entry.count > MAX_PER_IP_PER_DAY;
}

function cleanString(v, max = 600) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

const SYSTEM_PROMPT = `You are the proposal-writing assistant for Carter & Harper — two teenage friends who run a real web design business.

Voice rules:
- Direct, warm, confident. No corporate filler. No "we're excited to" / "we're thrilled" / "leverage" / "synergy".
- Speak as "we" (Carter & Harper). The reader is the prospect.
- Honest about scope. Acknowledge what you DON'T cover. Never overpromise.
- Plain English. No jargon. The reader is usually a small-business owner, not a tech person.

Carter & Harper's services and starting prices:
- One-Page Site — $150 — single page, mobile-friendly, contact button. About a week.
- Small Business Site — $400 — up to 5 pages, custom design, contact form, gallery/menu, 1 round of changes. 2-3 weeks.
- Glow-Up Redesign — $250 — refresh an existing site, faster, mobile-friendly, fresh colors. ~2 weeks.
- Basic Care — $25/mo — hosting, security updates, monthly backup, 30 min/mo of small fixes.
- Plus Care — $50/mo — everything in Basic + monthly content updates and new photos/pages.

Pricing rules:
- If the project is bigger or more custom than the packages, quote a range (e.g. "$600–$900") and say why.
- Always recommend a single best-fit package by name. If they're unsure, default to the smallest credible fit.
- If the budget they listed is lower than the smallest credible package, say so kindly and suggest the closest option.
- Always mention adding a monthly care plan after launch, naming Basic Care or Plus Care based on their likely needs.

Output format (no markdown headers, no asterisks, just clean text the lead can read in email):

Hi {first name},

(One sentence showing you understood their project.)

What we'd recommend: (one line — package name + price range)

Here's what that includes:
- (3-5 bullets, specific to their project)

Timeline: (e.g. "about 2 weeks from kickoff to launch")

What's not included: (1-2 lines — keeping them honest about scope)

After launch: (one line recommending Basic Care $25/mo or Plus Care $50/mo)

Next step: reply to this email and we'll set up a quick 15-minute call to lock it in.

— Carter & Harper

Keep the total under 200 words. Never include placeholder text like "[insert X]"; if you don't have the info, write around it naturally.`;

function buildUserMessage(d) {
  return [
    "New project request. Draft the proposal email.",
    "",
    "Name: " + d.name,
    "Site purpose: " + (d.goal || "(not specified)"),
    "Project type: " + (d.projectType || "(not specified)"),
    "Pages: " + (d.pages || "(not specified)"),
    "Deadline: " + (d.deadline || "(not specified)"),
    "Budget: " + (d.budget || "(not specified)"),
    "Examples / current site: " + (d.examples || "(none provided)"),
    "Anything else: " + (d.details || "(none)"),
  ].join("\n");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function proposalAsHtml(text) {
  return "<div style=\"font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#111;max-width:600px\">"
    + escapeHtml(text).replace(/\n/g, "<br/>")
    + "</div>";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: "rate_limited" });

  const body = typeof req.body === "string" ? safeParse(req.body) : (req.body || {});

  // honeypot
  if (body.website) return res.status(200).json({ ok: true, note: "ignored" });

  const data = {
    name:        cleanString(body.name, 120),
    email:       cleanString(body.email, 200),
    goal:        cleanString(body.goal, 300),
    projectType: cleanString(body.projectType, 80),
    pages:       cleanString(body.pages, 40),
    deadline:    cleanString(body.deadline, 80),
    budget:      cleanString(body.budget, 80),
    examples:    cleanString(body.examples, 400),
    details:     cleanString(body.details, 1500),
  };

  if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ ok: false, error: "missing_or_invalid_fields" });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const resendKey    = process.env.RESEND_API_KEY;
  const notifyEmail  = process.env.LEAD_NOTIFY_EMAIL;
  const fromEmail    = process.env.RESEND_FROM_EMAIL || "Carter & Harper <onboarding@resend.dev>";

  if (!anthropicKey || !resendKey || !notifyEmail) {
    return res.status(500).json({ ok: false, error: "server_not_configured" });
  }

  let proposalText;
  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(data) }],
    });
    const block = (msg.content || []).find((b) => b.type === "text");
    proposalText = block ? block.text.trim() : "";
    if (!proposalText) throw new Error("empty_proposal");
  } catch (err) {
    return res.status(502).json({ ok: false, error: "ai_failed", detail: String(err && err.message || err) });
  }

  try {
    const resend = new Resend(resendKey);
    const html = proposalAsHtml(proposalText);

    // Email to the lead
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      reply_to: notifyEmail,
      subject: "Your project proposal — Carter & Harper",
      text: proposalText,
      html,
    });

    // Internal copy to Carter / Bryan with the raw form data appended
    const internalAppendix = [
      "",
      "----- RAW INTAKE -----",
      "Name: " + data.name,
      "Email: " + data.email,
      "Site purpose: " + data.goal,
      "Project type: " + data.projectType,
      "Pages: " + data.pages,
      "Deadline: " + data.deadline,
      "Budget: " + data.budget,
      "Examples: " + data.examples,
      "Details: " + data.details,
      "IP: " + ip,
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      reply_to: data.email,
      subject: "New lead: " + data.name + " — " + (data.projectType || "project"),
      text: proposalText + "\n\n" + internalAppendix,
      html: proposalAsHtml(proposalText + "\n\n" + internalAppendix),
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: "email_failed", detail: String(err && err.message || err) });
  }

  return res.status(200).json({ ok: true });
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
