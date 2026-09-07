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

## Regenerating the example screenshots

The cards on the examples page show real screenshots of the three design
concepts, rendered from the concepts themselves. Regenerate them whenever a
concept changes:

```bash
node build.mjs && node scripts/shots.mjs
```

The script strips the concept banner before shooting — the card should show
the site as a client would see it — and quantises the result to a 128-colour
palette, which is about a third of the bytes with no visible loss.

Needs Google Chrome, `sips` and Python with Pillow.

## Industry tiles

The tiles under the hero exist so a visitor recognises his own trade in the
first seconds. They currently point at the matching design concept. When
dedicated industry pages exist, only the `href` values in the `branches`
block of each content file change — `demo:<slug>` and `contact` are resolved
in `src/sections.mjs`, the copy stays put.

Industry pages are the natural next step, and they are data rather than
code: a renderer plus one JSON file per trade. Resist multiplying trade by
town — near-identical pages differing only in a place name are doorway
pages, and they are penalised at the domain level.

## The proof section

The numbers in the proof section are measured from the build output, not
typed into the content files. `build.mjs` replaces `{weight}` with the real
transferred weight of the home page (markup, stylesheet, favicon and every
screenshot) and `{pages}` with the real page count. They cannot drift away
from what the site ships.

If you change the copy around them, keep the comparison honest: at 146 kB
the "fifteen times" claim holds against a roughly 2.2 MB average page. Add
weight and that multiple has to come down.

## Regenerating the OG image

`brand/og.svg` is a square canvas whose artwork sits in the centre 630-pixel
band, so a centred crop recovers the 1200×630 image regardless of how the
renderer handles the aspect ratio.

```bash
qlmanage -t -s 1200 -o /tmp brand/og.svg
sips -c 630 1200 /tmp/og.svg.png --out brand/og.png
```

## Deployment

Live on Vercel at https://cantelo.vercel.app, connected to this GitHub
repository — a push to `main` redeploys.

`npm run build` carries `--staging`, which adds `noindex, nofollow` to every
page and a blocking `robots.txt`. That is deliberate: the site has no domain
and its legal pages hold placeholders, and it must not be indexed in that
state. Once the domain is registered and the legal data filled in, change
`buildCommand` in `vercel.json` to `npm run build:production` and update
`baseUrl` in `content/site.json`.

## The contact form

The form posts to Web3Forms, which forwards submissions to an email address
without a server of our own. To switch it on:

1. Go to https://web3forms.com, enter the address enquiries should reach, and
   confirm the mail that arrives. No account is needed.
2. Copy the access key you are given.
3. Put it in `content/site.json` as `formKey`, replacing
   `REPLACE_WITH_WEB3FORMS_ACCESS_KEY`.
4. Rebuild, deploy, and send a test enquiry through the live form.

Every enquiry carries a `page` field with the path it was sent from, so the
email tells you whether the lead came from `/de/`, `/de/preise/` or one of
the design concepts. Links from a concept back to the contact form add
`?von=<slug>`, which lands in the same field. That is attribution without a
single tracker or cookie — which matters, because the site states in public
that it has neither.

The free tier covers 250 submissions per month. The markup already carries a
honeypot field for spam, and the page falls back to showing the email address
if the request fails.

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
