import { demoShell } from "./shell.mjs";
import { photo } from "./media.mjs";

const css = `
body { background: #FBF8F4; color: #221C18; font: 400 17px/1.55 "Helvetica Neue", Helvetica, Arial, sans-serif; }
.w { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
.nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 22px 0; border-bottom: 1px solid #E4DCD2; }
.nav__b { font-weight: 700; font-size: 20px; letter-spacing: -.02em; }
.nav__b span { color: var(--accent); }
.nav__l { display: none; gap: 28px; font-size: 15px; }
.nav__l a { text-decoration: none; color: #6B5D52; }
.nav__l a:hover { color: #221C18; }
@media (min-width: 800px) { .nav__l { display: flex; } }
.nav__t { font-weight: 700; color: var(--accent); text-decoration: none; white-space: nowrap; }

.hero { padding: clamp(48px,7vw,92px) 0 clamp(40px,5vw,64px); display: grid; gap: 40px; align-items: center; }
@media (min-width: 900px) { .hero { grid-template-columns: 1.05fr .95fr; gap: 56px; } }
.hero h1 { font-size: clamp(34px,5.4vw,60px); line-height: 1.04; letter-spacing: -.032em; }
.hero p { margin-top: 22px; font-size: clamp(17px,1.7vw,20px); color: #6B5D52; max-width: 44ch; }
.cta { display: inline-flex; align-items: center; gap: 10px; margin-top: 30px; background: var(--accent); color: #fff;
  padding: 16px 28px; text-decoration: none; font-weight: 600; }
.cta:hover { background: #A8452F; }
.cta--g { background: transparent; color: var(--accent); border: 1px solid var(--accent); margin-left: 10px; }
.cta--g:hover { background: var(--accent); color: #fff; }
.swatches { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.sw { aspect-ratio: 3/4; display: flex; align-items: flex-end; padding: 12px; color: #fff; font-size: 12px;
  font-family: ui-monospace, Menlo, monospace; letter-spacing: .05em; }
.sw:nth-child(1) { background: #C8553D; } .sw:nth-child(2) { background: #3E4B45; } .sw:nth-child(3) { background: #C9B79C; color: #3B322A; }
.sw:nth-child(4) { background: #7A8B85; } .sw:nth-child(5) { background: #E4DCD2; color: #3B322A; } .sw:nth-child(6) { background: #2E2723; }

.band { background: #221C18; color: #F5EFE8; padding: 20px 0; }
.band ul { display: flex; flex-wrap: wrap; gap: 10px 36px; justify-content: center; font-size: 14px; font-weight: 500; }
.band li::before { content: "— "; color: var(--accent); }

.s { padding: clamp(52px,7vw,92px) 0; }
.s--alt { background: #F3EDE5; }
.k { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
.h2 { font-size: clamp(26px,3.6vw,40px); line-height: 1.1; letter-spacing: -.028em; max-width: 20ch; }
.sub { margin-top: 16px; color: #6B5D52; max-width: 54ch; }

.svc { display: grid; gap: 1px; margin-top: 40px; background: #E4DCD2; border: 1px solid #E4DCD2; }
@media (min-width: 760px) { .svc { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1040px) { .svc { grid-template-columns: repeat(4,1fr); } }
.svc > div { background: #FBF8F4; padding: 28px 24px 32px; }
.s--alt .svc > div { background: #F3EDE5; }
.svc h3 { font-size: 18px; letter-spacing: -.02em; margin-bottom: 10px; }
.svc p { font-size: 15px; color: #6B5D52; line-height: 1.5; }

.gal { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-top: 40px; }
@media (min-width: 860px) { .gal { grid-template-columns: repeat(4,1fr); } }
.gal figure { margin: 0; }
.gal .im { aspect-ratio: 4/3; overflow: hidden; background: #E4DCD2; }
.gal figcaption { font-size: 14px; color: #6B5D52; padding-top: 10px; }
.two { display: grid; gap: 44px; }
@media (min-width: 900px) { .two { grid-template-columns: 1fr 1fr; gap: 64px; } }
.steps li { display: grid; grid-template-columns: 42px 1fr; gap: 18px; padding: 20px 0; border-top: 1px solid #E4DCD2; }
.steps b { font: 500 13px/1.6 ui-monospace, Menlo, monospace; color: var(--accent); }
.steps h3 { font-size: 18px; letter-spacing: -.02em; margin-bottom: 6px; }
.steps p { font-size: 15px; color: #6B5D52; }

.quote { border-left: 3px solid var(--accent); padding-left: 24px; }
.quote p { font-size: clamp(19px,2.2vw,25px); line-height: 1.4; letter-spacing: -.02em; }
.quote cite { display: block; margin-top: 16px; font-style: normal; font-size: 14px; color: #6B5D52; }

.form { display: grid; gap: 16px; margin-top: 28px; }
.form label { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; color: #6B5D52; display: block; margin-bottom: 8px; }
.form input, .form textarea { width: 100%; font: inherit; font-size: 16px; padding: 13px 14px; border: 1px solid #D8CCBE; background: #fff; border-radius: 0; }
.form textarea { min-height: 110px; resize: vertical; }
.form button { justify-self: start; background: var(--accent); color: #fff; border: 0; padding: 16px 30px; font: 600 16px/1 inherit; cursor: not-allowed; opacity: .85; }
.info li { padding: 16px 0; border-top: 1px solid #E4DCD2; display: flex; justify-content: space-between; gap: 20px; font-size: 16px; }
.info .lab { color: #6B5D52; font-size: 14px; }
.foot { background: #221C18; color: #B7ACA2; padding: 44px 0 36px; font-size: 14px; }
.foot .w { display: grid; gap: 20px; }
@media (min-width: 760px) { .foot .w { grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; } }
.foot b { color: #F5EFE8; display: block; margin-bottom: 12px; font-size: 17px; }
.foot a { color: #B7ACA2; text-decoration: none; } .foot a:hover { color: #F5EFE8; }
.foot li { margin-bottom: 8px; }
`;

const body = `
<div class="w">
  <nav class="nav">
    <div class="nav__b">Brunner <span>Malerarbeiten</span></div>
    <div class="nav__l">
      <a href="#leistungen">Leistungen</a><a href="#arbeiten">Arbeiten</a><a href="#ablauf">Ablauf</a><a href="#kontakt">Kontakt</a>
    </div>
    <a class="nav__t" href="#kontakt">044 000 00 00</a>
  </nav>

  <section class="hero">
    <div>
      <h1>Malerarbeiten in Zürich und Umgebung. Sauber, termingerecht, zum Fixpreis.</h1>
      <p>Familienbetrieb in dritter Generation. Innen- und Aussenanstrich, Gipserarbeiten, Fassaden. Offerte innert 48 Stunden.</p>
      <div>
        <a class="cta" href="#kontakt">Offerte anfordern</a>
        <a class="cta cta--g" href="#arbeiten">Arbeiten ansehen</a>
      </div>
    </div>
    <div class="swatches">
      <div class="sw">NCS S 4040</div><div class="sw">NCS S 7010</div><div class="sw">NCS S 2010</div>
      <div class="sw">NCS S 4005</div><div class="sw">NCS S 1002</div><div class="sw">NCS S 8005</div>
    </div>
  </section>
</div>

<div class="band"><div class="w"><ul>
  <li>Seit 1974</li><li>Festpreisgarantie</li><li>Versichert und SUVA-konform</li><li>Termin wird eingehalten</li>
</ul></div></div>

<section class="s" id="leistungen">
  <div class="w">
    <p class="k">Leistungen</p>
    <h2 class="h2">Was wir für Sie machen</h2>
    <p class="sub">Vom einzelnen Zimmer bis zur ganzen Fassade. Für Privathaushalte, Verwaltungen und Gewerbe.</p>
    <div class="svc">
      <div><h3>Innenanstrich</h3><p>Wände und Decken, Neubau wie Renovation. Möbel werden abgedeckt, die Wohnung bleibt bewohnbar.</p></div>
      <div><h3>Fassaden</h3><p>Reinigung, Grundierung, Anstrich. Inklusive Gerüst und Entsorgung.</p></div>
      <div><h3>Gipserarbeiten</h3><p>Risse, Löcher, neue Wände. Wir verputzen und streichen in einem Durchgang.</p></div>
      <div><h3>Tapeten</h3><p>Entfernen, Untergrund vorbereiten, neu tapezieren. Auch Raufaser und Vlies.</p></div>
    </div>
  </div>
</section>

<section class="s s--alt" id="arbeiten">
  <div class="w">
    <p class="k">Arbeiten</p>
    <h2 class="h2">Ausgeführte Projekte</h2>
    <p class="sub">Ein Auszug aus den letzten zwei Jahren. Auf Wunsch zeigen wir Ihnen Referenzen in Ihrer Nähe.</p>
    <div class="gal">
      <figure><div class="im">${photo({set:"maler",name:"g1",alt:"Reiheneinfamilienhaus, Wädenswil",tone:["#A98A6E","#6B4C34"]})}</div><figcaption>Reiheneinfamilienhaus, Wädenswil</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g2",alt:"Treppenhaus, Zürich Wiedikon",tone:["#8C9A92","#4C5B54"]})}</div><figcaption>Treppenhaus, Zürich Wiedikon</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g3",alt:"Fassade, Horgen",tone:["#C6A882","#8A6B45"]})}</div><figcaption>Fassade, Horgen</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g4",alt:"Büroräume, Thalwil",tone:["#8A7A6C","#514339"]})}</div><figcaption>Büroräume, Thalwil</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g5",alt:"Altbauwohnung, Zürich Enge",tone:["#AAB6AE","#6F7C74"]})}</div><figcaption>Altbauwohnung, Zürich Enge</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g6",alt:"Kellerabgang, Adliswil",tone:["#A0765E","#6B4635"]})}</div><figcaption>Kellerabgang, Adliswil</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g7",alt:"Gartenhaus, Kilchberg",tone:["#8F9B92","#59665E"]})}</div><figcaption>Gartenhaus, Kilchberg</figcaption></figure>
      <figure><div class="im">${photo({set:"maler",name:"g8",alt:"Ladenlokal, Zürich Oerlikon",tone:["#BBA88F","#7E6C55"]})}</div><figcaption>Ladenlokal, Zürich Oerlikon</figcaption></figure>
    </div>
  </div>
</section>

<section class="s" id="ablauf">
  <div class="w two">
    <div>
      <p class="k">Ablauf</p>
      <h2 class="h2">In vier Schritten zur fertigen Wand</h2>
      <ol class="steps" style="margin-top:32px">
        <li><b>01</b><div><h3>Anruf oder Formular</h3><p>Sie schildern kurz, worum es geht.</p></div></li>
        <li><b>02</b><div><h3>Besichtigung</h3><p>Kostenlos und unverbindlich, auch am Samstag.</p></div></li>
        <li><b>03</b><div><h3>Fixpreis-Offerte</h3><p>Innert 48 Stunden, schriftlich. Was drinsteht, gilt.</p></div></li>
        <li><b>04</b><div><h3>Ausführung</h3><p>Zum vereinbarten Termin. Besenrein übergeben.</p></div></li>
      </ol>
    </div>
    <div style="align-self:center">
      <div class="quote">
        <p>„Termin eingehalten, Preis eingehalten, Wohnung sauber hinterlassen. Mehr muss ich nicht sagen.“</p>
        <cite>M. Keller, Wädenswil — Innenanstrich, 3.5-Zimmer-Wohnung</cite>
      </div>
      <div class="quote" style="margin-top:36px">
        <p>„Wir lassen seit acht Jahren alle Treppenhäuser von Brunner machen.“</p>
        <cite>Liegenschaftenverwaltung, Zürich</cite>
      </div>
    </div>
  </div>
</section>

<section class="s s--alt" id="kontakt">
  <div class="w two">
    <div>
      <p class="k">Kontakt</p>
      <h2 class="h2">Offerte anfordern</h2>
      <p class="sub">Schreiben Sie kurz, was gemacht werden soll. Wir melden uns am selben Werktag.</p>
      <form class="form" onsubmit="return false">
        <div><label for="m-n">Name</label><input id="m-n" type="text" placeholder="Vor- und Nachname"></div>
        <div><label for="m-k">Telefon oder E-Mail</label><input id="m-k" type="text" placeholder="So erreichen wir Sie"></div>
        <div><label for="m-m">Was soll gemacht werden?</label><textarea id="m-m" placeholder="Zum Beispiel: 3.5-Zimmer-Wohnung streichen, ca. 80 m²"></textarea></div>
        <button type="button" disabled>Anfrage senden</button>
      </form>
    </div>
    <div style="align-self:start">
      <ul class="info" style="margin-top:56px">
        <li><span>Brunner Malerarbeiten GmbH</span><span class="lab">Betrieb</span></li>
        <li><span>Musterstrasse 12, 8820 Wädenswil</span><span class="lab">Adresse</span></li>
        <li><span>044 000 00 00</span><span class="lab">Telefon</span></li>
        <li><span>info@example.ch</span><span class="lab">E-Mail</span></li>
        <li><span>Mo–Fr 07:00–17:00</span><span class="lab">Erreichbar</span></li>
      </ul>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="w">
    <div><b>Brunner Malerarbeiten</b><p>Maler- und Gipserbetrieb für Zürich, Zimmerberg und Sihltal.</p></div>
    <div><b style="font-size:14px">Leistungen</b><ul><li><a href="#leistungen">Innenanstrich</a></li><li><a href="#leistungen">Fassaden</a></li><li><a href="#leistungen">Gipserarbeiten</a></li></ul></div>
    <div><b style="font-size:14px">Rechtliches</b><ul><li><a href="#">Impressum</a></li><li><a href="#">Datenschutz</a></li></ul></div>
  </div>
</footer>`;

export default {
  slug: "maler",
  render: ({ site, c }) =>
    demoShell({
      site, c, slug: "maler",
      name: "Brunner Malerarbeiten",
      title: "Brunner Malerarbeiten",
      description: "Designkonzept von Cantelo für einen Maler- und Gipserbetrieb: Galerie, Fixpreis-Offerte, Ablauf.",
      accent: "#C8553D",
      css, body,
    }),
};
