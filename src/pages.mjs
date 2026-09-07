// One renderer per page. Each returns the <main> body.

import { esc, icon, path } from "./layout.mjs";
import * as S from "./sections.mjs";

/** Wrap [PLACEHOLDER] markers so unfilled legal data is impossible to miss. */
const ph = (s) =>
  esc(s).replace(/\[([^\]]+)\]/g, (_, inner) => `<span class="ph">[${inner}]</span>`);

const hasPlaceholder = (blocks) => blocks.some((b) => b.p.some((t) => /\[[A-ZÄÖÜ]/.test(t)));

export const home = (c, lang, site) =>
  [
    S.hero(c, lang),
    S.branches(c, lang),
    S.included(c),
    S.guarantee(c, lang),
    S.examples(c, lang),
    S.proof(c),
    S.analysis(c, lang),
    S.process(c),
    S.prices(c, lang),
    S.maintenance(c),
    S.faq(c, lang),
    S.contact(c, lang, site),
  ].join("\n");

export const preise = (c, lang, site) =>
  [
    `<section class="section section--tight"><div class="wrap">
      <p class="kicker">${esc(c.prices.kicker)}</p>
      <div class="head-split">
        <h1 class="h-sec">${esc(c.prices.title)}</h1>
        <p class="lead">${esc(c.prices.lead)}</p>
      </div>
    </div></section>`,
    S.included(c),
    S.guarantee(c, lang),
    S.prices(c, lang, { header: false }),
    S.maintenance(c),
    S.faq(c, lang),
    S.contact(c, lang, site),
  ].join("\n");

export const beispiele = (c, lang, site) =>
  [S.examples(c, lang, { full: true }), S.proof(c), S.analysis(c, lang), S.process(c), S.contact(c, lang, site)].join("\n");

function doc(c, lang, { title, intro, blocks, notice }) {
  return `<section class="section section--tight">
  <div class="wrap">
    <article class="doc">
      <h1>${esc(title)}</h1>
      ${notice ? `<p class="notice">${esc(notice)}</p>` : ""}
      ${intro ? `<p class="doc__intro">${esc(intro)}</p>` : ""}
      ${blocks
        .map(
          (b) => `<section><h2>${esc(b.h)}</h2>${b.p.map((t) => `<p>${ph(t)}</p>`).join("")}</section>`
        )
        .join("\n      ")}
      <p style="margin-top:44px"><a class="btn btn--ghost" href="${path(lang, "home")}">${esc(c.notFound.cta)}${icon.arrow}</a></p>
    </article>
  </div>
</section>`;
}

export const impressum = (c, lang) =>
  doc(c, lang, {
    title: c.legal.impressum.title,
    blocks: c.legal.impressum.blocks,
    notice: hasPlaceholder(c.legal.impressum.blocks) ? c.legal.placeholderNotice : null,
  });

export const datenschutz = (c, lang) =>
  doc(c, lang, {
    title: c.legal.datenschutz.title,
    intro: c.legal.datenschutz.intro,
    blocks: c.legal.datenschutz.blocks,
    notice: hasPlaceholder(c.legal.datenschutz.blocks) ? c.legal.placeholderNotice : null,
  });

export const agb = (c, lang) =>
  doc(c, lang, {
    title: c.legal.agb.title,
    intro: c.legal.agb.intro,
    blocks: c.legal.agb.blocks,
    notice: hasPlaceholder(c.legal.agb.blocks) ? c.legal.placeholderNotice : null,
  });

export const notFound = (c, lang) =>
  `<section class="section"><div class="wrap centered">
    <h1 class="h-sec">${esc(c.notFound.title)}</h1>
    <p class="lead">${esc(c.notFound.lead)}</p>
    <p style="margin-top:32px"><a class="btn" href="${path(lang, "home")}">${esc(c.notFound.cta)}${icon.arrow}</a></p>
  </div></section>`;
