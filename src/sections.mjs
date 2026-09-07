// Landing-page sections. Each takes the language content and returns HTML.

import { esc, icon, path, demoPath } from "./layout.mjs";

const li = (s) => `<li>${icon.check}<span>${esc(s)}</span></li>`;

export function hero(c, lang) {
  return `<section class="hero">
  <div class="wrap">
    <h1>${esc(c.hero.title)}</h1>
    <p class="hero__lead">${esc(c.hero.lead)}</p>
    <div class="btn-row">
      <a class="btn" href="${path(lang, "home")}#kontakt">${esc(c.hero.ctaPrimary)}${icon.arrow}</a>
      <a class="btn btn--ghost" href="${path(lang, "beispiele")}">${esc(c.hero.ctaSecondary)}</a>
    </div>
    <div class="trust">
      <ul>${c.trust.map((t) => `<li>${icon.check}<span>${esc(t)}</span></li>`).join("")}</ul>
    </div>
  </div>
</section>`;
}

export function included(c) {
  return `<section class="section" id="angebot">
  <div class="wrap">
    <p class="kicker">${esc(c.included.kicker)}</p>
    <div class="head-split">
      <h2 class="h-sec">${esc(c.included.title)}</h2>
      <p class="lead">${esc(c.included.lead)}</p>
    </div>
    <ul class="grid-items">
      ${c.included.items.map((i) => `<li><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></li>`).join("\n      ")}
    </ul>
    <p class="footnote">${esc(c.included.footnote)}</p>
  </div>
</section>`;
}

export function process(c) {
  return `<section class="section" id="ablauf">
  <div class="wrap">
    <p class="kicker">${esc(c.process.kicker)}</p>
    <h2 class="h-sec">${esc(c.process.title)}</h2>
    <ol class="steps">
      ${c.process.steps
        .map(
          (s) => `<li class="step"><span class="step__n">${esc(s.n)}</span><h3 class="step__t">${esc(s.t)}</h3><p class="step__d">${esc(s.d)}</p></li>`
        )
        .join("\n      ")}
    </ol>
  </div>
</section>`;
}

export function priceRows(rows) {
  return `<table class="tbl"><tbody>
    ${rows
      .map(
        ([label, price]) =>
          `<tr><td>${esc(label)}</td><td>${esc(price)}${/^[+]?[0-9]/.test(String(price)) ? ' <span class="unit">CHF</span>' : ""}</td></tr>`
      )
      .join("\n    ")}
  </tbody></table>`;
}

/** `header: false` on the standalone pricing page, where the page's own
 *  h1 already carries the same title. */
export function prices(c, lang, { header = true } = {}) {
  const p = c.prices;
  return `<section class="section section--ink" id="preise">
  <div class="wrap">
    ${
      header
        ? `<p class="kicker">${esc(p.kicker)}</p>
    <div class="head-split">
      <h2 class="h-sec">${esc(p.title)}</h2>
      <p class="lead">${esc(p.lead)}</p>
    </div>`
        : ""
    }
    <div class="price-main">
      <div class="price-main__l">
        <div class="price-fig"><b>${esc(p.main.price)}</b><span>${esc(p.main.currency)}</span><em>${esc(p.main.label)}</em></div>
        <h3>${esc(p.main.title)}</h3>
        <p>${esc(p.main.desc)}</p>
      </div>
      <div class="price-main__r">
        <div>
          <h3 style="font-size:var(--step-2)">${esc(p.addons.title)}</h3>
          ${priceRows(p.addons.rows)}
          <p class="footnote" style="color:var(--on-ink-muted)">${esc(p.addons.note)}</p>
        </div>
        <div class="btn-row"><a class="btn" href="${path(lang, "home")}#kontakt">${esc(p.main.cta)}${icon.arrow}</a></div>
      </div>
    </div>
  </div>
</section>`;
}

export function maintenance(c) {
  const m = c.maintenance;
  return `<section class="section" id="wartung">
  <div class="wrap">
    <p class="kicker">${esc(m.kicker)}</p>
    <div class="head-split">
      <h2 class="h-sec">${esc(m.title)}</h2>
      <p class="lead">${esc(m.lead)}</p>
    </div>
    <div class="tiers">
      ${m.tiers
        .map(
          (t) => `<div class="tier${t.featured ? " tier--featured" : ""}">
        <p class="tier__name">${esc(t.name)}</p>
        <div class="tier__fig"><b>${esc(t.price)}</b><span>CHF</span></div>
        <p class="tier__period">${esc(t.period)}</p>
        <p class="tier__desc">${esc(t.desc)}</p>
        <ul class="tier__items">${t.items.map(li).join("")}</ul>
        <p class="tier__note">${esc(t.note)}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
    <p class="notebar">${esc(m.annual)}</p>
    <div class="cols">
      <div>
        <h3 style="font-size:var(--step-2);letter-spacing:-0.025em">${esc(m.smallTitle)}</h3>
        <div class="deflists">
          <div class="deflist"><h4>${esc(m.smallYesLabel)}</h4><ul>${m.smallYes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
          <div class="deflist"><h4>${esc(m.smallNoLabel)}</h4><ul>${m.smallNo.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
        </div>
      </div>
      <div>
        <h3 style="font-size:var(--step-2);letter-spacing:-0.025em">${esc(m.extraTitle)}</h3>
        ${priceRows(m.extraRows)}
        <h4 style="font-family:var(--mono);font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:34px 0 12px">${esc(m.termsTitle)}</h4>
        <p style="font-size:.9375rem;color:var(--muted);line-height:1.6">${esc(m.terms)}</p>
      </div>
    </div>
  </div>
</section>`;
}

function thumb(slug) {
  const A = { maler: "#C8553D", zahnarzt: "#2E6F8E", restaurant: "#1F5130" }[slug];
  const g = "#D9DCD4";
  const base = `<rect width="200" height="150" fill="#fff"/><rect x="0" y="0" width="200" height="15" fill="${A}"/>`;
  const shapes = {
    maler: `<rect x="14" y="28" width="86" height="9" fill="#2A2A2A"/><rect x="14" y="42" width="62" height="5" fill="${g}"/><rect x="14" y="56" width="40" height="11" fill="${A}"/>
      <rect x="112" y="28" width="74" height="52" fill="${g}"/>
      <rect x="14" y="92" width="54" height="40" fill="${g}"/><rect x="74" y="92" width="54" height="40" fill="${g}"/><rect x="134" y="92" width="52" height="40" fill="${g}"/>`,
    zahnarzt: `<rect x="14" y="28" width="70" height="9" fill="#2A2A2A"/><rect x="14" y="42" width="94" height="5" fill="${g}"/><rect x="14" y="56" width="44" height="11" fill="${A}"/>
      <circle cx="156" cy="52" r="26" fill="${g}"/>
      <rect x="14" y="88" width="55" height="44" fill="${g}"/><rect x="76" y="88" width="55" height="44" fill="${g}"/><rect x="138" y="88" width="48" height="20" fill="${A}" opacity=".25"/><rect x="138" y="112" width="48" height="20" fill="${g}"/>`,
    restaurant: `<rect x="0" y="15" width="200" height="52" fill="${g}"/><rect x="14" y="30" width="76" height="10" fill="${A}"/><rect x="14" y="46" width="52" height="5" fill="#fff"/>
      <rect x="14" y="80" width="82" height="6" fill="#2A2A2A"/><rect x="14" y="92" width="82" height="4" fill="${g}"/><rect x="14" y="102" width="82" height="4" fill="${g}"/><rect x="14" y="112" width="82" height="4" fill="${g}"/>
      <rect x="110" y="80" width="76" height="36" fill="${g}"/><rect x="110" y="122" width="46" height="10" fill="${A}"/>`,
  }[slug];
  return `<svg viewBox="0 0 200 150" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${base}${shapes}</svg>`;
}

export function examples(c, lang, { full = false } = {}) {
  const e = c.examples;
  const cards = e.concepts
    .map(
      (k) => `<a class="card" href="${demoPath(k.slug)}">
      <span class="card__tag">${esc(e.conceptLabel)}</span>
      <div class="card__thumb">${thumb(k.slug)}</div>
      <h3>${esc(k.name)}</h3>
      <p class="card__branch">${esc(k.branch)}</p>
      <p class="card__desc">${esc(k.desc)}</p>
      <span class="card__go">${esc(e.openLabel)}${icon.arrow}</span>
    </a>`
    )
    .join("\n    ");

  return `<section class="section" id="beispiele">
  <div class="wrap">
    <p class="kicker">${esc(e.kicker)}</p>
    <div class="head-split">
      <h2 class="h-sec">${esc(e.title)}</h2>
      <p class="lead">${esc(e.lead)}</p>
    </div>
    ${
      full
        ? `<h3 style="font-size:var(--step-3);margin-top:clamp(44px,5vw,72px)">${esc(e.realTitle)}</h3>
    <p class="empty">${esc(e.realEmpty)}</p>
    <h3 style="font-size:var(--step-3);margin-top:clamp(52px,6vw,88px)">${esc(e.conceptsTitle)}</h3>
    <p class="lead" style="margin-top:16px">${esc(e.conceptsLead)}</p>`
        : ""
    }
    <div class="cards">
    ${cards}
    </div>
    ${full ? "" : `<div class="btn-row" style="margin-top:40px"><a class="btn btn--ghost" href="${path(lang, "beispiele")}">${esc(e.conceptsTitle)}${icon.arrow}</a></div>`}
  </div>
</section>`;
}

export function faq(c) {
  return `<section class="section" id="fragen">
  <div class="wrap">
    <p class="kicker">${esc(c.faq.kicker)}</p>
    <h2 class="h-sec">${esc(c.faq.title)}</h2>
    <div class="faq">
      ${c.faq.items.map((i) => `<details><summary>${esc(i.q)}</summary><p>${esc(i.a)}</p></details>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

export function contact(c, lang, site) {
  const f = c.contact.form;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(c.contact.whatsappText)}`;
  return `<section class="section section--ink" id="kontakt">
  <div class="wrap">
    <p class="kicker">${esc(c.contact.kicker)}</p>
    <div class="head-split">
      <h2 class="h-sec">${esc(c.contact.title)}</h2>
      <p class="lead">${esc(c.contact.lead)}</p>
    </div>
    <div class="contact-grid">
      <form id="contact-form" action="${esc(site.formEndpoint)}" method="POST"
            data-sending="${esc(f.sending)}" data-success="${esc(f.success)}" data-error="${esc(f.error)}" data-email="${esc(site.email)}">
        <input type="hidden" name="access_key" value="${esc(site.formKey)}">
        <input type="hidden" name="subject" value="${esc(site.name)} — ${esc(c.contact.kicker)} (${lang})">
        <input type="hidden" name="from_name" value="${esc(site.domain)}">
        <div class="hp" aria-hidden="true"><label>Botcheck<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label></div>
        <div class="field">
          <label for="f-name">${esc(f.name)}</label>
          <input id="f-name" name="name" type="text" required autocomplete="name" placeholder="${esc(f.namePlaceholder)}">
        </div>
        <div class="field">
          <label for="f-contact">${esc(f.contact)}</label>
          <input id="f-contact" name="contact" type="text" required placeholder="${esc(f.contactPlaceholder)}">
        </div>
        <div class="field">
          <label for="f-msg">${esc(f.message)}</label>
          <textarea id="f-msg" name="message" required placeholder="${esc(f.messagePlaceholder)}"></textarea>
        </div>
        <button class="btn" type="submit">${esc(f.submit)}${icon.arrow}</button>
        <p class="form__status" role="status" aria-live="polite"></p>
        <p class="form__privacy">${esc(f.privacy).replace(
          "{link}",
          `<a href="${path(lang, "datenschutz")}">${esc(f.privacyLink)}</a>`
        )}</p>
      </form>
      <div class="direct">
        <h3>${esc(c.contact.directTitle)}</h3>
        <ul>
          <li><a href="mailto:${esc(site.email)}"><span>${esc(site.email)}</span><span class="k">${esc(c.contact.emailLabel)}</span></a></li>
          <li><a href="tel:${esc(site.phoneHref)}"><span>${esc(site.phone)}</span><span class="k">${esc(c.contact.phoneLabel)}</span></a></li>
          <li><a href="${wa}" rel="noopener"><span>${esc(c.contact.whatsappLabel)}</span><span class="k">&rarr;</span></a></li>
        </ul>
      </div>
    </div>
  </div>
</section>`;
}
