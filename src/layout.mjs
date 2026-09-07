// Shared shell: head, header, footer. Pure functions, no dependencies.

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const SLUGS = {
  de: { home: "", preise: "preise", beispiele: "beispiele", impressum: "impressum", datenschutz: "datenschutz", agb: "agb" },
  fr: { home: "", preise: "prix", beispiele: "exemples", impressum: "impressum", datenschutz: "protection-des-donnees", agb: "cgv" },
  it: { home: "", preise: "prezzi", beispiele: "esempi", impressum: "impressum", datenschutz: "protezione-dati", agb: "cg" },
  en: { home: "", preise: "pricing", beispiele: "examples", impressum: "imprint", datenschutz: "privacy", agb: "terms" },
};

/** Absolute site path for a page in a language. */
export const path = (lang, page) => {
  const slug = SLUGS[lang][page];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
};

export const demoPath = (slug) => `/beispiele/${slug}/`;

export const icon = {
  check: `<svg class="i" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8"/></svg>`,
  arrow: `<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 3.5L13.5 8 9 12.5"/></svg>`,
};

const WORDMARK = (color) => `<svg viewBox="0 0 693 140" role="img" aria-label="Cantelo"><g fill="none" stroke="${color}" stroke-width="18" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"><path d="M73.5 56.4A41 41 0 1 0 73.5 123.6"/><path d="M109 90A41 41 0 1 1 191 90A41 41 0 1 1 109 90"/><path d="M191 40V140"/><path d="M243 40V140"/><path d="M243 90A41 41 0 0 1 325 90V140"/><path d="M354 40H408"/><path d="M378 8V140"/><path d="M433 90H515A41 41 0 1 0 497.5 123.6"/><path d="M556 0V140"/><path d="M602 90A41 41 0 1 1 684 90A41 41 0 1 1 602 90"/></g></svg>`;

export const wordmarkInk = WORDMARK("#12211C");
export const wordmarkPaper = WORDMARK("#EDEFE9");

function head({ site, c, page, canonical, langs }) {
  const meta = c.meta[page];
  const alternates = langs
    .map((l) => `  <link rel="alternate" hreflang="${l.code}" href="${site.baseUrl}${path(l.code, page)}">`)
    .join("\n");
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${site.staging ? '<meta name="robots" content="noindex, nofollow">\n' : ""}
<link rel="canonical" href="${site.baseUrl}${canonical}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${site.baseUrl}${path(site.defaultLang, page)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${site.baseUrl}${canonical}">
<meta property="og:image" content="${site.baseUrl}/brand/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${site.colors.ink}">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="/brand/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/styles.css">`;
}

function header({ site, c, lang, page, langs }) {
  const links = ["angebot", "preise", "beispiele", "kontakt"];
  const href = (k) => {
    if (k === "preise") return path(lang, "preise");
    if (k === "beispiele") return path(lang, "beispiele");
    return `${path(lang, "home")}#${k === "angebot" ? "angebot" : "kontakt"}`;
  };
  const nav = links
    .map((k) => `<a class="hdr__link" href="${href(k)}"${page === k ? ' aria-current="page"' : ""}>${esc(c.nav[k])}</a>`)
    .join("");
  const langLinks = langs
    .map((l) => `<a href="${path(l.code, page)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang ? ' aria-current="true"' : ""}>${l.code}</a>`)
    .join("");

  return `<header class="hdr">
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="${path(lang, "home")}" aria-label="${esc(site.name)}">${wordmarkInk}</a>
    <nav class="hdr__nav" aria-label="${esc(c.nav.menu)}">${nav}</nav>
    <div class="hdr__right">
      <nav class="lang" aria-label="${esc(c.nav.language)}">${langLinks}</nav>
      <a class="btn hdr__cta" href="${path(lang, "home")}#kontakt">${esc(c.nav.cta)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="${esc(c.nav.menu)}"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="mnav" id="mnav" data-open="false">
    <div class="wrap">
      ${links.map((k) => `<a href="${href(k)}">${esc(c.nav[k])}</a>`).join("\n      ")}
      <a class="btn" href="${path(lang, "home")}#kontakt">${esc(c.nav.cta)}</a>
    </div>
  </div>
</header>`;
}

/** Fixed bottom bar on phones. Swiss trades phone; they do not fill in forms,
 *  and the contact section sits fifteen screens down. */
function mobileBar({ site, c, lang }) {
  const m = c.mobilebar;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(c.contact.whatsappText)}`;
  return `<nav class="mbar" aria-label="${esc(c.nav.kontakt)}">
  <a href="tel:${esc(site.phoneHref)}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5.2 2.5 6.8 5.6 5.4 7a9 9 0 0 0 3.6 3.6l1.4-1.4 3.1 1.6v2.4c0 .6-.5 1.1-1.1 1a12.5 12.5 0 0 1-11-11c-.1-.6.4-1.1 1-1.1z"/></svg><span>${esc(m.call)}</span></a>
  <a href="${wa}" rel="noopener"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 13.5 3.4 10a5.8 5.8 0 1 1 2.2 2.2z"/></svg><span>${esc(m.whatsapp)}</span></a>
  <a class="mbar__cta" href="${path(lang, "home")}#kontakt"><span>${esc(m.quote)}</span></a>
</nav>`;
}

function footer({ site, c, lang }) {
  const year = new Date().getFullYear();
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div>
        <div class="ftr__logo">${wordmarkPaper}</div>
        <p class="ftr__tag">${esc(c.footer.tagline)}</p>
      </div>
      <div>
        <h4>${esc(c.nav.menu)}</h4>
        <ul>
          <li><a href="${path(lang, "home")}#angebot">${esc(c.nav.angebot)}</a></li>
          <li><a href="${path(lang, "preise")}">${esc(c.nav.preise)}</a></li>
          <li><a href="${path(lang, "beispiele")}">${esc(c.nav.beispiele)}</a></li>
          <li><a href="${path(lang, "home")}#kontakt">${esc(c.nav.kontakt)}</a></li>
        </ul>
      </div>
      <div>
        <h4>${esc(c.footer.legal)}</h4>
        <ul>
          <li><a href="${path(lang, "impressum")}">${esc(c.footer.impressum)}</a></li>
          <li><a href="${path(lang, "datenschutz")}">${esc(c.footer.datenschutz)}</a></li>
          <li><a href="${path(lang, "agb")}">${esc(c.footer.agb)}</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <span>&copy; ${year} ${esc(site.name)}. ${esc(c.footer.rights)}</span>
      <span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></span>
    </div>
  </div>
</footer>`;
}

const SCRIPT = `<script>
(function(){
  var b=document.querySelector('.burger'),m=document.getElementById('mnav');
  if(b&&m){b.addEventListener('click',function(){
    var open=b.getAttribute('aria-expanded')==='true';
    b.setAttribute('aria-expanded',String(!open));
    m.setAttribute('data-open',String(!open));
  });}
  document.querySelectorAll('[data-prefill]').forEach(function(a){
    a.addEventListener('click',function(){
      var t=document.getElementById('f-msg');
      if(t&&!t.value){t.value=a.dataset.prefill;setTimeout(function(){t.focus();t.setSelectionRange(t.value.length,t.value.length);},700);}
    });
  });
  var f=document.getElementById('contact-form');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var s=f.querySelector('.form__status'),btn=f.querySelector('button[type=submit]');
    var busy=f.dataset.sending,ok=f.dataset.success,bad=f.dataset.error,mail=f.dataset.email;
    btn.disabled=true;s.textContent=busy;
    fetch(f.action,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)})
      .then(function(r){return r.ok?r.json():Promise.reject(r)})
      .then(function(){f.reset();s.textContent=ok;btn.disabled=false;})
      .catch(function(){s.innerHTML=bad+' <a href="mailto:'+mail+'">'+mail+'</a>.';btn.disabled=false;});
  });}
})();
</script>`;

export function page({ site, c, lang, langs, pageKey, canonical, body, bodyClass = "" }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
${head({ site, c, page: pageKey, canonical, langs })}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip" href="#main">${esc(c.nav.menu)}</a>
${header({ site, c, lang, page: pageKey, langs })}
<main id="main">
${body}
</main>
${mobileBar({ site, c, lang })}
${footer({ site, c, lang })}
${SCRIPT}
</body>
</html>`;
}
