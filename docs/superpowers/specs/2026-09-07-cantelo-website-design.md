# Cantelo — Website Design Spec

Date: 2026-09-07
Status: approved by client, in implementation

## Purpose

Marketing site for Cantelo, a small studio selling website development to
small Swiss businesses. Primary goal: qualified contact requests. Secondary:
let a prospect self-qualify on price without a sales call.

## Positioning constraints (decided)

- **Impersonal voice.** "Wir", no team photos, no bios. The studio, not the people.
- **Operated from outside Switzerland.** This is stated honestly in the FAQ.
  Trust is built on what is actually true: payment after delivery, Swiss
  hosting, domain registered in the client's name, fixed price.
- **Impressum and Datenschutzerklärung carry a real legal name, address and
  email.** Currently placeholders — see "Pre-launch checklist". Required by
  UWG Art. 3 Abs. 1 lit. s and revDSG.
- **Full price list public.** This is the main differentiator against Swiss
  agencies that hide behind "Offerte anfragen".
- **No fabricated client work.** Demo sites are labelled `Designkonzept`
  and explicitly marked as not real companies. Real cases get real names.

## Languages

DE (default), FR, IT, EN. DE is Swiss High German: `ss` never `ß`, Sie-form.

URL layout: `/de/`, `/fr/`, `/it/`, `/en/`. Root `/` detects language and
redirects, with `<link rel="alternate" hreflang>` on every page and
`x-default` pointing at `/de/`.

## Pages (per language)

| Path | Purpose |
|---|---|
| `/` | Landing: hero, trust bar, scope of the 990 offer, examples, process, prices, maintenance, FAQ, contact |
| `/preise/` | Full price table, standalone for SEO and for linking in conversations |
| `/beispiele/` | Real work + labelled design concepts |
| `/impressum/` | Legal identification |
| `/datenschutz/` | revDSG privacy notice |
| `/agb/` | Terms: scope, revisions, maintenance term, cancellation |

Language-neutral, DE only: `/beispiele/maler/`, `/beispiele/zahnarzt/`,
`/beispiele/restaurant/` — clickable single-page design concepts, each with
a persistent banner identifying it as a Cantelo concept for a fictional business.

## Pricing (source of truth)

Landing page: 990 CHF. Includes mobile version, German copy, work gallery,
.ch domain in the client's name (first year), contact form, SSL, Impressum
and Datenschutzerklärung, two revision rounds. 7 working days. Payment after
delivery.

Add-ons: extra page 190 · second language (FR/IT/EN) 290 · jobs page 190 ·
online booking 190 · logo, 3 concepts, 2 rounds 490 · price calculator 290 ·
premium domain at cost + 90 · 48-hour rush +300 · third and each further
revision round 90.

Maintenance: Basis 29/mo (Swiss hosting, SSL, domain, backups, updates,
monitoring) · Plus 49/mo (Basis + one small change per month) · Pro 99/mo
(Basis + up to four small changes per month). Annual payment: 10 months
instead of 12. 12-month term, then auto-renewal, cancellation one month
before term end. On cancellation the client receives all site files and
keeps the domain.

Small change: text, photo, price, opening hours, contact details, adding a
review. Not a small change: new page, new section, new feature, redesign.
Unused changes do not roll over. One-off small change outside a plan 90 ·
medium change (new section, new gallery) 190 · new page 190.

All prices in CHF. Displayed without VAT claims until the legal entity is settled.

## Design direction

Swiss International Style, taken from the logo's own construction (monoline
geometry on a grid). Hard grid, large type, generous whitespace, no
gradients, no drop shadows, no decorative illustration. Emphasis carried by
structure and scale.

- Ink `#12211C`, paper `#EDEFE9`. Both directions used.
- Type: system grotesque stack (Helvetica Neue / Arial / system-ui). Zero
  font requests — the site's own speed is part of the argument. Self-hosted
  Inter is a later option if cross-platform consistency matters more.
- Assets in `brand/`: wordmark (dark, white, currentColor), C mark
  (dark, light), favicon SVG + ICO.

## Contact

Three channels, no forced choice: short form (name, email/phone, message),
prominent email and phone, WhatsApp button. Form posts to an external
handler (Web3Forms endpoint, key injected at build time from
`content/site.json`). Cal.com added once a number and calendar exist.

## Build

Output is pure static HTML/CSS/JS. Node is used at build time only, with no
npm dependencies.

```
build.mjs              renders every page for every language into dist/
content/site.json      shared config: domain, contact, form endpoint
content/{de,fr,it,en}.json   all copy and structured data
src/layout.mjs         shell: head, header, footer, hreflang
src/pages/*.mjs        one renderer per page
src/demos/*.mjs        the three design concepts
src/styles.css         single stylesheet, copied verbatim
brand/                 logo assets, copied verbatim
dist/                  build output, gitignored, uploaded by FTP
```

Content lives in JSON so a price change happens in one place per language
rather than in twenty HTML files. Renderers are plain JS template functions,
not a templating language, so structured content (tables, lists, FAQ) stays
readable.

## Testing

- `node build.mjs` completes with no missing-key warnings for any language.
- Every generated page validates as HTML and has: title, meta description,
  canonical, full hreflang set, favicon, OG tags.
- No external network requests from any page except the form POST.
- Layout checked at 375px, 768px, 1440px.
- Every internal link resolves to a file that exists (build-time link check).

## Pre-launch checklist (blocking)

- [ ] Register `cantelo.ch` (no NS records as of 2026-09-07; `.swiss` requires
      Swiss commercial register entry, `.com` and `.eu` are taken)
- [ ] Replace Impressum placeholders: legal name, address, email, phone
- [ ] Replace Datenschutz placeholders: controller identity and contact
- [ ] Insert Web3Forms access key
- [ ] Replace phone and WhatsApp placeholders
- [ ] Add real client work to `/beispiele/`
- [ ] Review FR/IT translations with a native speaker before publishing
