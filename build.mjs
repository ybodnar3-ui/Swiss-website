#!/usr/bin/env node
// Cantelo static site builder. No dependencies — Node 18+ only.
// Reads content/*.json + src/*, writes dist/.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import { page as shell, SLUGS, path as urlPath, esc, wordmarkInk } from "./src/layout.mjs";
import * as P from "./src/pages.mjs";
import { demos } from "./src/demos/index.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

// Staging builds carry noindex and a blocking robots.txt: the site has no
// domain and no legal data yet, and must not be indexed in that state.
const STAGING = process.argv.includes("--staging") || process.env.CANTELO_STAGING === "1";

const site = read("content/site.json");
site.staging = STAGING;
// A language without a content file is skipped with a warning rather than
// failing the build, so a translation can be added incrementally.
const available = site.languages.filter((l) => {
  if (existsSync(join(root, `content/${l}.json`))) return true;
  console.warn(`  ! content/${l}.json missing — language skipped`);
  return false;
});
site.languages = available;
const content = Object.fromEntries(available.map((l) => [l, read(`content/${l}.json`)]));
const langs = site.languages.map((l) => ({ code: l, label: content[l].label }));

const PAGES = [
  ["home", P.home],
  ["preise", P.preise],
  ["beispiele", P.beispiele],
  ["impressum", P.impressum],
  ["datenschutz", P.datenschutz],
  ["agb", P.agb],
];

const written = [];
function write(rel, html) {
  const full = join(dist, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  written.push(rel);
}

/** Fail loudly on a missing translation key rather than emitting "undefined". */
function checkKeys(base, other, lang, trail = "") {
  const missing = [];
  for (const k of Object.keys(base)) {
    const bv = base[k], ov = other?.[k];
    const at = trail ? `${trail}.${k}` : k;
    if (ov === undefined) { missing.push(at); continue; }
    if (bv && typeof bv === "object" && !Array.isArray(bv)) missing.push(...checkKeys(bv, ov, lang, at));
    else if (Array.isArray(bv) && Array.isArray(ov) && bv.length !== ov.length)
      missing.push(`${at} (length ${ov.length}, expected ${bv.length})`);
  }
  return missing;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// The stylesheet is served immutable for a year, so its name must change
// whenever its bytes do. Without this a returning visitor keeps the old CSS
// until the cache expires — which is to say, never.
const cssSource = readFileSync(join(root, "src/styles.css"));
const cssHash = createHash("sha256").update(cssSource).digest("hex").slice(0, 10);
site.cssPath = `/assets/styles.${cssHash}.css`;

// --- language pages -------------------------------------------------------
const urls = [];
for (const lang of site.languages) {
  const c = content[lang];
  if (lang !== site.defaultLang) {
    const missing = checkKeys(content[site.defaultLang], c, lang);
    if (missing.length) {
      console.error(`\n  ✗ ${lang}.json is missing ${missing.length} key(s):`);
      missing.slice(0, 20).forEach((m) => console.error(`      ${m}`));
      process.exit(1);
    }
  }
  for (const [key, render] of PAGES) {
    const canonical = urlPath(lang, key);
    const html = shell({
      site, c, lang, langs, pageKey: key, canonical,
      body: render(c, lang, site),
    });
    write(join(canonical, "index.html"), html);
    urls.push({ loc: canonical, page: key, lang });
  }
}

// --- demo concepts (German, language-neutral URLs) -------------------------
for (const d of demos) {
  write(join("beispiele", d.slug, "index.html"), d.render({ site, c: content[site.defaultLang] }));
}

// --- root redirect --------------------------------------------------------
const alt = site.languages
  .map((l) => `<link rel="alternate" hreflang="${l}" href="${site.baseUrl}${urlPath(l, "home")}">`)
  .join("\n");
write(
  "index.html",
  `<!doctype html>
<html lang="${site.defaultLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.name)}</title>
<meta name="description" content="${esc(content[site.defaultLang].meta.home.description)}">
<link rel="canonical" href="${site.baseUrl}${urlPath(site.defaultLang, "home")}">
${alt}
<link rel="alternate" hreflang="x-default" href="${site.baseUrl}${urlPath(site.defaultLang, "home")}">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<meta http-equiv="refresh" content="0; url=/${site.defaultLang}/">
<script>
(function(){
  var supported=${JSON.stringify(site.languages)};
  var want=(navigator.languages||[navigator.language||"${site.defaultLang}"]);
  for(var i=0;i<want.length;i++){
    var code=String(want[i]).slice(0,2).toLowerCase();
    if(supported.indexOf(code)>-1){location.replace("/"+code+"/");return;}
  }
  location.replace("/${site.defaultLang}/");
})();
</script>
</head>
<body>
<p style="font-family:Helvetica,Arial,sans-serif;padding:24px">
${site.languages.map((l) => `<a href="${urlPath(l, "home")}" hreflang="${l}">${content[l].label}</a>`).join(" &middot; ")}
</p>
</body>
</html>`
);

// --- 404 ------------------------------------------------------------------
// Vercel serves one 404.html for the whole site, and rewriting to a localised
// copy would answer 200 — a soft 404, which is worse than a German one. So the
// page carries all four languages and picks by URL prefix. Without JavaScript
// it shows the default language, exactly as before.
{
  const strings = Object.fromEntries(
    site.languages.map((l) => [l, { ...content[l].notFound, label: content[l].label, home: urlPath(l, "home") }])
  );
  const d = site.defaultLang;
  const block = (l) => `<div class="nf" data-lang="${l}"${l === d ? "" : " hidden"}>
      <h1>${esc(strings[l].title)}</h1>
      <p>${esc(strings[l].lead)}</p>
      <a class="btn" href="${strings[l].home}">${esc(strings[l].cta)}</a>
    </div>`;

  write(
    "404.html",
    `<!doctype html>
<html lang="${d}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(strings[d].title)} — ${esc(site.name)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${site.cssPath}">
<style>
  body { display: flex; flex-direction: column; min-height: 100vh; }
  .nf-wrap { flex: 1; display: grid; place-items: center; text-align: center; padding: 48px 24px; }
  .nf-logo svg { height: 26px; width: auto; margin: 0 auto 48px; }
  .nf h1 { font-size: var(--step-4); max-width: 16ch; margin-inline: auto; }
  .nf p { font-size: var(--step-2); color: var(--muted); margin: 22px auto 34px; max-width: 40ch; line-height: 1.35; }
  .nf-langs { display: flex; gap: 4px; justify-content: center; margin-top: 56px;
    font-family: var(--mono); font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; }
  .nf-langs a { padding: 6px 7px; text-decoration: none; color: rgba(var(--ink-rgb), .45); }
  .nf-langs a:hover, .nf-langs a[aria-current="true"] { color: var(--ink); }
</style>
</head>
<body>
<div class="nf-wrap">
  <div>
    <a class="nf-logo" href="${urlPath(d, "home")}" aria-label="${esc(site.name)}">${wordmarkInk}</a>
    ${site.languages.map(block).join("\n    ")}
    <nav class="nf-langs" aria-label="${esc(content[d].nav.language)}">
      ${site.languages.map((l) => `<a href="${urlPath(l, "home")}" hreflang="${l}" lang="${l}" data-lang="${l}">${l}</a>`).join("")}
    </nav>
  </div>
</div>
<script>
(function(){
  var S=${JSON.stringify(strings)};
  var m=location.pathname.match(/^\\/([a-z]{2})(\\/|$)/);
  var l=(m&&S[m[1]])?m[1]:${JSON.stringify(d)};
  document.documentElement.lang=l;
  document.title=S[l].title+' \\u2014 ${esc(site.name)}';
  var blocks=document.querySelectorAll('.nf');
  for(var i=0;i<blocks.length;i++){blocks[i].hidden=blocks[i].getAttribute('data-lang')!==l;}
  var ls=document.querySelectorAll('.nf-langs a');
  for(var j=0;j<ls.length;j++){
    if(ls[j].getAttribute('data-lang')===l)ls[j].setAttribute('aria-current','true');
  }
  var lg=document.querySelector('.nf-logo');
  if(lg)lg.setAttribute('href',S[l].home);
})();
</script>
</body>
</html>`
  );
}

// --- static assets --------------------------------------------------------
mkdirSync(join(dist, "assets"), { recursive: true });
if (existsSync(join(root, "assets"))) cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
writeFileSync(join(dist, site.cssPath.replace(/^\//, "")), cssSource);
cpSync(join(root, "brand"), join(dist, "brand"), { recursive: true });
cpSync(join(root, "brand/cantelo-favicon.svg"), join(dist, "brand/favicon.svg"));

// --- real numbers for the proof section -----------------------------------
// Measured from the build output, so the claims on the page cannot drift away
// from what the site actually ships.
{
  // Everything the home page actually transfers: markup, stylesheet, favicon
  // and every screenshot it shows. Not just the shell.
  const shotsDir = join(dist, "assets/shots");
  const shots = existsSync(shotsDir)
    ? readdirSync(shotsDir).reduce((n, f) => n + statSync(join(shotsDir, f)).size, 0)
    : 0;
  const bytes =
    statSync(join(dist, urlPath(site.defaultLang, "home"), "index.html")).size +
    statSync(join(dist, site.cssPath.replace(/^\//, ""))).size +
    statSync(join(dist, "brand/favicon.svg")).size +
    shots;
  const weight = Math.round(bytes / 1024);
  const pageCount = written.filter((f) => f.endsWith("index.html")).length;
  for (const rel of written) {
    if (!rel.endsWith(".html")) continue;
    const full = join(dist, rel);
    const html = readFileSync(full, "utf8");
    const own = ("/" + rel.replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/{2,}/g, "/");
    const out = html
      .replace(/\{weight\}/g, String(weight))
      .replace(/\{pages\}/g, String(pageCount))
      .replace(/\{page\}/g, own);
    if (out !== html) writeFileSync(full, out);
  }
  console.log(`  proof: ${weight} kB page weight, ${pageCount} pages`);
  // The proof copy claims an average company page weighs twelve times this
  // one. Roughly 2.2 MB is the going figure, so past ~183 kB that stops
  // being true and the sentence has to change with it.
  const CLAIMED_MULTIPLE = 12, AVERAGE_KB = 2200;
  if (weight * CLAIMED_MULTIPLE > AVERAGE_KB) {
    console.warn(
      `  ! page weight ${weight} kB no longer supports the "${CLAIMED_MULTIPLE}x" claim ` +
      `(that needs ${Math.floor(AVERAGE_KB / CLAIMED_MULTIPLE)} kB or less) — update proof.stats[0].d`
    );
  }
}

// --- files served verbatim from the site root ------------------------------
// public/ is copied last so its contents land at the root of dist/. Used for
// things that must sit at an exact path: search-engine verification files,
// ads.txt and the like.
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), dist, { recursive: true });
  for (const f of readdirSync(join(root, "public"))) console.log(`  public/${f} → /${f}`);
}

// --- sitemap + robots -----------------------------------------------------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${site.baseUrl}${u.loc}</loc>
${site.languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site.baseUrl}${urlPath(l, u.page)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.baseUrl}${urlPath(site.defaultLang, u.page)}"/>
    <priority>${u.page === "home" ? "1.0" : u.page === "preise" || u.page === "beispiele" ? "0.8" : "0.3"}</priority>
  </url>`
  )
  .join("\n")}
${demos.map((d) => `  <url><loc>${site.baseUrl}/beispiele/${d.slug}/</loc><priority>0.5</priority></url>`).join("\n")}
</urlset>`;
write("sitemap.xml", sitemap);
write(
  "robots.txt",
  STAGING
    ? `# Staging build — not for indexing.\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`
);

// --- internal link check --------------------------------------------------
const htmlFiles = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmlFiles.push(p);
  }
})(dist);

let broken = 0;
for (const f of htmlFiles) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = m[1];
    const candidates = target.endsWith("/") ? [join(dist, target, "index.html")] : [join(dist, target)];
    if (!candidates.some(existsSync)) {
      console.error(`  ✗ broken link ${target}  (in ${f.replace(dist, "dist")})`);
      broken++;
    }
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const totalCss = cssSource.length;
console.log(`\n  ${written.length} files → dist/`);
console.log(`  ${site.languages.length} languages · ${PAGES.length} pages each · ${demos.length} demo concepts`);
console.log(`  css ${kb(totalCss)}`);
if (broken) {
  console.error(`\n  ✗ ${broken} broken internal link(s)\n`);
  process.exit(1);
}
console.log(`  ✓ no broken internal links`);
console.log(STAGING ? "  ! staging build: noindex + robots Disallow\n" : "");
