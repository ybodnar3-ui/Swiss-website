// Shared wrapper for the design concepts: a persistent banner that makes clear
// this is a Cantelo concept and the business in it does not exist.

import { esc, wordmarkPaper } from "../layout.mjs";

export function demoShell({ site, c, slug, name, title, description, accent, css, body, lang = "de" }) {
  const b = c.demoBanner;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — ${esc(b.label)} | ${esc(site.name)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.baseUrl}/beispiele/${slug}/">
<meta property="og:title" content="${esc(title)} — ${esc(b.label)}">
<meta property="og:description" content="${esc(description)}">
<meta name="theme-color" content="${accent}">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<style>
:root { --accent: ${accent}; }
*,*::before,*::after { box-sizing: border-box; }
body { margin: 0; }
img,svg { display: block; max-width: 100%; }
a { color: inherit; }
ul,ol { margin: 0; padding: 0; list-style: none; }
h1,h2,h3,h4 { margin: 0; }
p { margin: 0; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

/* concept banner */
.cbar { position: sticky; top: 0; z-index: 999; background: #12211C; color: #EDEFE9;
  font: 500 13px/1.4 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: -0.005em; }
.cbar__in { max-width: 1320px; margin: 0 auto; padding: 10px 24px; display: flex; flex-wrap: wrap;
  align-items: center; gap: 8px 18px; }
.cbar__logo { display: flex; align-items: center; }
.cbar__logo svg { height: 13px; width: auto; opacity: .9; transition: opacity 140ms ease; }
.cbar__logo:hover svg { opacity: 1; }
.cbar__tag { border: 1px solid rgba(237,239,233,.45); padding: 2px 7px; font-size: 10px;
  letter-spacing: .14em; text-transform: uppercase; font-family: ui-monospace, Menlo, monospace; }
.cbar__txt { color: rgba(237,239,233,.72); }
.cbar__links { margin-left: auto; display: flex; gap: 18px; }
.cbar__links a { color: #EDEFE9; text-decoration: none; border-bottom: 1px solid rgba(237,239,233,.45); padding-bottom: 1px; }
.cbar__links a:hover { border-color: #EDEFE9; }
@media (max-width: 720px) { .cbar__links { margin-left: 0; width: 100%; } }

.cfoot { background: #12211C; color: rgba(237,239,233,.72); padding: 40px 24px;
  font: 400 14px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif; text-align: center; }
.cfoot a { color: #EDEFE9; }
.cfoot strong { color: #EDEFE9; display: block; font-size: 18px; margin-bottom: 8px; }

/* image slots */
.ph-img { display: block; width: 100%; height: 100%; object-fit: cover; }
.ph-img--empty { background: linear-gradient(150deg, var(--a) 0%, var(--b) 100%); }
.mono-av { display: grid; place-items: center; width: 100%; height: 100%;
  background: var(--a); color: #fff; font-weight: 600; letter-spacing: .04em; font-size: 1.4rem; }
.map-svg { width: 100%; height: 100%; object-fit: cover; }

${css}
</style>
</head>
<body>
<div class="cbar">
  <div class="cbar__in">
    <a class="cbar__logo" href="/de/" aria-label="Cantelo">${wordmarkPaper}</a>
    <span class="cbar__tag">${esc(b.label)}</span>
    <span class="cbar__txt">${esc(b.text.replace("{name}", name))}</span>
    <span class="cbar__links">
      <a href="/de/beispiele/">${esc(b.back)}</a>
      <a href="/de/?von=${slug}#kontakt">${esc(b.cta)}</a>
    </span>
  </div>
</div>
${body}
<div class="cfoot">
  <strong>${esc(b.label)} — ${esc(site.name)}</strong>
  <p>${esc(b.text.replace("{name}", name))} <a href="/de/?von=${slug}#kontakt">${esc(b.cta)}</a></p>
</div>
</body>
</html>`;
}
