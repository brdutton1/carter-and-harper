/* Renders everything from content.js into the page.
   Carter shouldn't need to edit this file — just content.js. */

(function () {
  const C = window.CONTENT || CONTENT;

  /* ---- Apply colors ---- */
  const root = document.documentElement;
  if (C.colors) {
    root.style.setProperty("--bg", C.colors.background);
    root.style.setProperty("--text", C.colors.text);
    root.style.setProperty("--accent", C.colors.accent);
    root.style.setProperty("--accent2", C.colors.accent2);
    root.style.setProperty("--accent3", C.colors.accent3);
    root.style.setProperty("--card", C.colors.card);
  }

  /* ---- Tiny helpers ---- */
  const set = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---- Text bits ---- */
  set("[data-brand]", C.brandName);
  set("[data-tagline]", C.tagline);
  set("[data-hero-subtext]", C.heroSubtext);
  set("[data-pricing-note]", C.pricingNote || "");
  set("[data-about-heading]", C.about.heading);
  set("[data-about-text]", C.about.text);
  set("[data-form-heading]", C.form.heading);
  set("[data-form-subtext]", C.form.subtext);
  set("[data-form-button]", C.form.buttonText);
  set("[data-footer-text]", C.footerText);
  set("[data-ai-callout]", (C.ai && C.ai.callout) || "");
  document.title = C.brandName + " — Web Design";

  const contactLink = document.querySelector("[data-contact-link]");
  if (contactLink) {
    contactLink.textContent = C.contactEmail;
    contactLink.href = "mailto:" + C.contactEmail;
  }

  /* ---- What we do ---- */
  const wrap = document.querySelector("[data-what-we-do]");
  if (wrap) {
    C.whatWeDo.forEach((item) => {
      const card = el("div", "card reveal");
      card.appendChild(el("div", "card__emoji", item.emoji));
      card.appendChild(el("h3", "card__title", item.title));
      card.appendChild(el("p", "card__text", item.text));
      wrap.appendChild(card);
    });
  }

  /* ---- How we work (process steps) ---- */
  if (C.process) {
    set("[data-process-heading]", C.process.heading);
    set("[data-process-subtext]", C.process.subtext || "");
    const stepsWrap = document.querySelector("[data-process-steps]");
    if (stepsWrap) {
      C.process.steps.forEach((s, i) => {
        const li = el("li", "step reveal");
        li.appendChild(el("div", "step__num", String(i + 1)));
        li.appendChild(el("div", "step__title", s.title));
        li.appendChild(el("div", "step__text", s.text));
        stepsWrap.appendChild(li);
      });
    }
  }

  /* ---- Plan cards (shared by pricing + care plans) ---- */
  function renderPlans(wrap, plans, opts) {
    if (!wrap || !plans) return;
    const o = opts || {};
    plans.forEach((p) => {
      const card = el("div", "price-card reveal" + (p.popular ? " price-card--popular" : ""));
      if (p.popular) card.appendChild(el("div", "price-card__badge", "Most popular"));
      card.appendChild(el("div", "price-card__name", p.name));
      const priceHtml = p.period
        ? p.price + '<span class="price-card__period">' + p.period + "</span>"
        : p.price;
      card.appendChild(el("div", "price-card__price", priceHtml));
      card.appendChild(el("p", "price-card__blurb", p.blurb));
      const ul = el("ul", "price-card__features");
      p.features.forEach((f) => ul.appendChild(el("li", "", f)));
      card.appendChild(ul);

      // Button behavior:
      // - If plan has a paymentLink (Stripe URL), button goes there in a new tab.
      // - Else button jumps to the form and pre-selects the project type.
      const hasPay = p.paymentLink && p.paymentLink.trim();
      const btn = el("a", "btn btn--primary", hasPay ? "Subscribe →" : "Pick this");
      if (hasPay) {
        btn.href = p.paymentLink.trim();
        btn.target = "_blank";
        btn.rel = "noopener";
      } else {
        btn.href = "#start";
        const formValue = o.formValue || p.name;
        btn.addEventListener("click", () => {
          const sel = document.querySelector('select[name="projectType"]');
          if (sel && [...sel.options].some((opt) => opt.value === formValue)) sel.value = formValue;
        });
      }
      card.appendChild(btn);
      wrap.appendChild(card);
    });
  }

  /* ---- Pricing (one-time packages) ---- */
  renderPlans(document.querySelector("[data-packages]"), C.packages);

  /* ---- Care plans (monthly) ---- */
  if (C.maintenance) {
    set("[data-care-heading]", C.maintenance.heading);
    set("[data-care-subtext]", C.maintenance.subtext);
    set("[data-care-note]", C.maintenance.note || "");
    renderPlans(document.querySelector("[data-care-plans]"), C.maintenance.plans, { formValue: "Monthly care plan" });
  }

  /* ---- Form dropdowns ---- */
  const fillSelect = (selector, options) => {
    const sel = document.querySelector(selector);
    if (!sel || !options) return;
    options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o; opt.textContent = o;
      sel.appendChild(opt);
    });
  };
  fillSelect("[data-project-types]", C.form.projectTypes);
  fillSelect("[data-page-options]", C.form.pageOptions);
  fillSelect("[data-deadline-options]", C.form.deadlineOptions);
  fillSelect("[data-budget-options]", C.form.budgetOptions);

  /* ---- Form submit ---- */
  const form = document.getElementById("projectForm");
  const status = document.getElementById("formStatus");

  const showStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = "form__status " + (ok ? "ok" : "err");
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const data = Object.fromEntries(new FormData(form).entries());
      // honeypot — silently drop if filled
      if (data.website) return;

      showStatus("Sending… we're drafting your proposal.", true);

      const endpoint = C.ai && C.ai.proposalEndpoint;
      let delivered = false;

      // 1) Try the AI proposal endpoint (Vercel serverless function)
      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, brand: C.brandName }),
          });
          if (res.ok) {
            const out = await res.json().catch(() => ({}));
            if (out && out.ok) {
              form.reset();
              showStatus("Proposal on its way! Check your email in the next 2 minutes. 🎉", true);
              delivered = true;
            }
          }
        } catch (_err) { /* fall through to next option */ }
      }

      // 2) Web3Forms fallback (only if a key is set and AI didn't deliver)
      if (!delivered && C.formAccessKey && C.formAccessKey.trim()) {
        try {
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: C.formAccessKey.trim(),
              subject: "New project request — " + C.brandName,
              from_name: data.name,
              ...data,
            }),
          });
          const out = await res.json();
          if (out.success) {
            form.reset();
            showStatus("Got it! We'll be in touch soon. 🎉", true);
            delivered = true;
          }
        } catch (_err) { /* fall through to mailto */ }
      }

      // 3) Last resort: open the visitor's email app pre-filled
      if (!delivered) {
        mailtoFallback(data);
        showStatus("Opening your email app to finish sending…", true);
      }
    });
  }

  function mailtoFallback(data) {
    const lines = [
      "Name: " + (data.name || ""),
      "Email: " + (data.email || ""),
      "Site purpose: " + (data.goal || ""),
      "Project type: " + (data.projectType || ""),
      "Pages: " + (data.pages || ""),
      "Deadline: " + (data.deadline || ""),
      "Budget: " + (data.budget || ""),
      "Examples / current site: " + (data.examples || ""),
      "",
      "Details:",
      data.details || "",
    ];
    const href =
      "mailto:" + encodeURIComponent(C.contactEmail) +
      "?subject=" + encodeURIComponent("New project request — " + C.brandName) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
  }

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
})();
