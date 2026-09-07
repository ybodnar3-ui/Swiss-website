# Cantelo

Marketing site for Cantelo — a small studio selling website development to
small Swiss businesses.

Four languages (DE, FR, IT, EN), six pages each, plus three clickable design
concepts. The output is plain static HTML, CSS and a little JavaScript: no
framework, no runtime, no npm dependencies.

## Build

```bash
node build.mjs
```

Writes everything to `dist/`. Needs Node 18 or newer and nothing else.
The build fails if a translation is missing a key that German has, and if any
internal link points at a file that was not generated.

## Preview

```bash
python3 -m http.server 4173 --directory dist
```

Then open http://localhost:4173.

To review everything at once:

```bash
node scripts/preview-index.mjs
```

Writes `dist/_preview.html` — every generated page as a live, clickable
thumbnail, grouped by language. A development aid, not part of the site;
`build.mjs` clears it, so regenerate it after each build.

## Deploy

Upload the contents of `dist/` to the web root of any static host — Infomaniak,
Hostpoint or Nine all work. There is nothing to install on the server.

Point the host's 404 page at `/404.html`.

## Layout

```
build.mjs              renders every page for every language into dist/
content/site.json      domain, contact details, form endpoint and key
content/de.json        German copy and structured data — the reference language
content/{fr,it,en}.json  translations, same shape as de.json
src/layout.mjs         page shell: head, header, footer, hreflang
src/sections.mjs       the landing-page sections
src/pages.mjs          one renderer per page
src/demos/             the three design concepts, each self-contained
src/styles.css         the single stylesheet
brand/                 logo, favicon, OG image
dist/                  build output — not in git
```

Copy lives in JSON, so a price change happens once per language rather than in
twenty HTML files. `content/de.json` is the reference: every other language
must have the same keys, and the build says so if it does not.

Adding a page means adding a slug to `SLUGS` in `src/layout.mjs`, a renderer in
`src/pages.mjs`, and an entry to `PAGES` in `build.mjs`.

## Regenerating the OG image

`brand/og.svg` is a square canvas whose artwork sits in the centre 630-pixel
band, so a centred crop recovers the 1200×630 image regardless of how the
renderer handles the aspect ratio.

```bash
qlmanage -t -s 1200 -o /tmp brand/og.svg
sips -c 630 1200 /tmp/og.svg.png --out brand/og.png
```

## Before launch

These are blocking. The Impressum and the privacy policy currently carry
bracketed placeholders, and the site marks them with a visible notice so they
cannot go live unnoticed.

- [ ] Register `cantelo.ch` — as of 2026-09-07 it had no NS records and was
      most likely free. `.swiss` requires an entry in the Swiss commercial
      register; `.com` and `.eu` are taken.
- [ ] Fill in the Impressum: legal name, address, email, phone, commercial
      register and VAT status — in all four language files
- [ ] Fill in the privacy policy: controller identity and contact
- [ ] Fill in the place of jurisdiction in the terms
- [ ] Put the real address, phone and WhatsApp number in `content/site.json`
- [ ] Create a Web3Forms access key and put it in `content/site.json`,
      then send a test enquiry
- [ ] Have the French and Italian read by a native speaker
- [ ] Add real client work to the examples page once a client has agreed

Legal background for the first four: UWG Art. 3 Abs. 1 lit. s requires anyone
offering services online to state their identity and contact address, and the
revised DSG requires the privacy policy to name the controller.
