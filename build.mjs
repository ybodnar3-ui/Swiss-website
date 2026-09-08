#!/usr/bin/env node
// Cantelo static site builder. No dependencies — Node 18+ only.
// Reads content/*.json + src/*, writes dist/.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import { page as shell, SLUGS, path as urlPath, esc } from "./src/layout.mjs";
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
{
  const lang = site.defaultLang, c = content[lang];
  write("404.html", shell({ site, c, lang, langs, pageKey: "home", canonical: urlPath(lang, "home"), body: P.notFound(c, lang) }));
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
