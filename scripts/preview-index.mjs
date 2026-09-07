#!/usr/bin/env node
// Development aid: writes dist/_preview.html — every generated page as a live,
// clickable thumbnail. Not part of the site; regenerate after each build.

import { readdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const pages = [];
(function walk(dir, url = "") {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.isDirectory()) walk(join(dir, e.name), `${url}/${e.name}`);
    else if (e.name === "index.html") pages.push(`${url}/`);
    else if (e.name.endsWith(".html")) pages.push(`${url}/${e.name}`);
  }
})(dist);

const titleOf = (u) => {
  const file = u.endsWith("/") ? join(dist, u, "index.html") : join(dist, u);
  const m = readFileSync(file, "utf8").match(/<title>([^<]*)<\/title>/);
  return m ? m[1].replace(/&amp;/g, "&") : u;
};

const GROUPS = [
  ["Einstieg", (u) => u === "/" || u === "/404.html"],
  ["Deutsch", (u) => u.startsWith("/de/")],
  ["Français", (u) => u.startsWith("/fr/")],
  ["Italiano", (u) => u.startsWith("/it/")],
  ["English", (u) => u.startsWith("/en/")],
  ["Designkonzepte", (u) => u.startsWith("/beispiele/")],
];

const card = (u) => `<figure>
  <a href="${u}" target="_blank" rel="noopener"><div class="frame"><iframe src="${u}" loading="lazy" tabindex="-1" scrolling="no" title="${u}"></iframe></div></a>
  <figcaption><a href="${u}" target="_blank" rel="noopener"><b>${u}</b><span>${titleOf(u)}</span></a></figcaption>
</figure>`;

writeFileSync(
  join(dist, "_preview.html"),
  `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cantelo — alle Seiten</title>
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<style>
  :root { --ink:#12211C; --paper:#EDEFE9; }
  *,*::before,*::after{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font:400 15px/1.5 "Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:-.01em}
  header{background:var(--ink);color:var(--paper);padding:28px 32px}
  header h1{margin:0;font-size:26px;letter-spacing:-.03em}
  header p{margin:8px 0 0;color:rgba(237,239,233,.66);font-size:14px}
  main{padding:8px 32px 64px;max-width:1600px;margin:0 auto}
  h2{font-size:13px;font-family:ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;
     color:rgba(18,33,28,.55);margin:44px 0 18px;padding-bottom:10px;border-bottom:1px solid rgba(18,33,28,.16)}
  .grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
  figure{margin:0}
  .frame{aspect-ratio:4/3;border:1px solid rgba(18,33,28,.18);background:#fff;overflow:hidden;position:relative;transition:border-color .15s}
  figure:hover .frame{border-color:var(--ink)}
  iframe{position:absolute;top:0;left:0;width:1440px;height:1080px;border:0;transform:scale(.28);transform-origin:0 0;pointer-events:none}
  figcaption{padding-top:11px}
  figcaption a{text-decoration:none;color:inherit;display:block}
  figcaption b{display:block;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;font-weight:600}
  figcaption span{display:block;color:rgba(18,33,28,.6);font-size:13px;margin-top:3px;
     overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  figure:hover figcaption b{text-decoration:underline;text-underline-offset:3px}
</style></head><body>
<header>
  <h1>Cantelo — alle Seiten</h1>
  <p>${pages.length} generierte Seiten. Klicken öffnet die Seite in einem neuen Tab. Vorschau-Hilfe, nicht Teil der Website.</p>
</header>
<main>
${GROUPS.map(([name, test]) => {
  const list = pages.filter(test);
  return list.length ? `<h2>${name} — ${list.length}</h2>\n<div class="grid">\n${list.map(card).join("\n")}\n</div>` : "";
}).join("\n")}
</main></body></html>`
);

console.log(`  dist/_preview.html — ${pages.length} pages`);
