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

  /* ---- Pricing ---- */
  const priceWrap = document.querySelector("[data-packages]");
  if (priceWrap) {
    C.packages.forEach((p) => {
      const card = el("div", "price-card reveal" + (p.popular ? " price-card--popular" : ""));
      if (p.popular) card.appendChild(el("div", "price-card__badge", "Most popular"));
      card.appendChild(el("div", "price-card__name", p.name));
      card.appendChild(el("div", "price-card__price", p.price));
      card.appendChild(el("p", "price-card__blurb", p.blurb));
      const ul = el("ul", "price-card__features");
      p.features.forEach((f) => ul.appendChild(el("li", "", f)));
      card.appendChild(ul);
      const btn = el("a", "btn btn--primary", "Pick this");
      btn.href = "#start";
      btn.addEventListener("click", () => {
        const sel = document.querySelector('select[name="projectType"]');
        if (sel && [...sel.options].some((o) => o.value === p.name)) sel.value = p.name;
      });
      card.appendChild(btn);
      priceWrap.appendChild(card);
    });
  }

  /* ---- Form dropdowns ---- */
  const fillSelect = (selector, options) => {
    const sel = document.querySelector(selector);
    if (!sel) return;
    options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o; opt.textContent = o;
      sel.appendChild(opt);
    });
  };
  fillSelect("[data-project-types]", C.form.projectTypes);
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
      showStatus("Sending…", true);

      // If a Web3Forms key is set, send real email. Otherwise, fall back to mailto.
      if (C.formAccessKey && C.formAccessKey.trim()) {
        try {
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: C.formAccessKey.trim(),
              subject: "New project request — " + C.brandName,
              from_name: data.name,
              name: data.name,
              email: data.email,
              project_type: data.projectType,
              budget: data.budget,
              details: data.details,
            }),
          });
          const out = await res.json();
          if (out.success) {
            form.reset();
            showStatus("Got it! We'll be in touch soon. 🎉", true);
          } else {
            throw new Error(out.message || "failed");
          }
        } catch (err) {
          mailtoFallback(data);
          showStatus("Opening your email app to finish sending…", true);
        }
      } else {
        mailtoFallback(data);
        showStatus("Opening your email app to finish sending…", true);
      }
    });
  }

  function mailtoFallback(data) {
    const body =
      "Name: " + data.name + "\n" +
      "Email: " + data.email + "\n" +
      "Project: " + data.projectType + "\n" +
      "Budget: " + data.budget + "\n\n" +
      data.details;
    const href =
      "mailto:" + encodeURIComponent(C.contactEmail) +
      "?subject=" + encodeURIComponent("New project request — " + C.brandName) +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
  }

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
})();
