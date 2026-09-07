import { demoShell } from "./shell.mjs";

const css = `
body { background: #fff; color: #16242B; font: 400 17px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif; }
.w { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
.nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 20px 0; }
.nav__b { display: flex; align-items: center; gap: 11px; font-weight: 600; font-size: 19px; letter-spacing: -.02em; }
.nav__b i { width: 26px; height: 26px; border: 2px solid var(--accent); border-radius: 50%; display: block; position: relative; }
.nav__b i::after { content: ""; position: absolute; inset: 5px; background: var(--accent); border-radius: 50%; }
.nav__l { display: none; gap: 26px; font-size: 15px; }
.nav__l a { text-decoration: none; color: #5C7079; } .nav__l a:hover { color: #16242B; }
@media (min-width: 860px) { .nav__l { display: flex; } }
.nav__t { background: var(--accent); color: #fff; text-decoration: none; padding: 11px 20px; font-size: 15px; font-weight: 600; border-radius: 999px; white-space: nowrap; }

.hero { background: #F2F7F9; border-radius: 0 0 0 0; }
.hero .w { padding: clamp(48px,7vw,88px) 24px clamp(48px,7vw,80px); display: grid; gap: 44px; align-items: center; }
@media (min-width: 920px) { .hero .w { grid-template-columns: 1.02fr .98fr; gap: 60px; } }
.hero h1 { font-size: clamp(32px,5vw,54px); line-height: 1.08; letter-spacing: -.03em; }
.hero p { margin-top: 20px; font-size: clamp(17px,1.6vw,19px); color: #5C7079; max-width: 46ch; }
.hbtns { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.b1, .b2 { text-decoration: none; padding: 15px 26px; font-weight: 600; font-size: 16px; border-radius: 999px; display: inline-flex; align-items: center; gap: 9px; }
.b1 { background: var(--accent); color: #fff; } .b1:hover { background: #245A73; }
.b2 { border: 1px solid #C3D6DE; color: #16242B; } .b2:hover { border-color: var(--accent); }
.card-h { background: #fff; border: 1px solid #DCE8ED; padding: 26px 28px; }
.card-h h3 { font-size: 13px; font-family: ui-monospace, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: #5C7079; margin-bottom: 16px; }
.hours li { display: flex; justify-content: space-between; gap: 18px; padding: 11px 0; border-top: 1px solid #ECF2F5; font-size: 16px; }
.hours li:first-child { border-top: 0; }
.hours b { font-weight: 500; } .hours span { color: #5C7079; font-variant-numeric: tabular-nums; }
.emerg { margin-top: 22px; padding: 16px 18px; background: #FDF2EF; border-left: 3px solid #C8553D; font-size: 15px; }
.emerg b { display: block; color: #A8452F; margin-bottom: 3px; }

.s { padding: clamp(52px,7vw,90px) 0; }
.s--alt { background: #F2F7F9; }
.k { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
.h2 { font-size: clamp(26px,3.5vw,38px); line-height: 1.12; letter-spacing: -.028em; max-width: 22ch; }
.sub { margin-top: 15px; color: #5C7079; max-width: 56ch; }

.tr { display: grid; gap: 20px; margin-top: 42px; }
@media (min-width: 720px) { .tr { grid-template-columns: repeat(2,1fr); } }
@media (min-width: 1000px) { .tr { grid-template-columns: repeat(3,1fr); } }
.tr > div { border: 1px solid #DCE8ED; padding: 26px 26px 30px; background: #fff; }
.s--alt .tr > div { background: #fff; }
.tr .n { width: 34px; height: 34px; border-radius: 50%; background: #E4EFF3; color: var(--accent); display: grid; place-items: center;
  font: 600 14px/1 ui-monospace, Menlo, monospace; margin-bottom: 18px; }
.tr h3 { font-size: 19px; letter-spacing: -.02em; margin-bottom: 9px; }
.tr p { font-size: 15px; color: #5C7079; line-height: 1.55; }

.team { display: grid; gap: 26px; margin-top: 42px; }
@media (min-width: 700px) { .team { grid-template-columns: repeat(4,1fr); } }
.team .av { aspect-ratio: 1; border-radius: 50%; background: #DCE8ED; display: grid; place-items: center;
  font: 500 11px/1 ui-monospace, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; color: #7E959E; margin-bottom: 16px; }
.team h3 { font-size: 17px; letter-spacing: -.02em; }
.team p { font-size: 14px; color: #5C7079; margin-top: 4px; }

.two { display: grid; gap: 44px; }
@media (min-width: 900px) { .two { grid-template-columns: 1fr 1fr; gap: 60px; } }
.form { display: grid; gap: 16px; margin-top: 26px; }
.form label { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; color: #5C7079; display: block; margin-bottom: 8px; }
.form input, .form select, .form textarea { width: 100%; font: inherit; font-size: 16px; padding: 13px 14px; border: 1px solid #C3D6DE; background: #fff; border-radius: 0; }
.form textarea { min-height: 96px; resize: vertical; }
.form button { justify-self: start; background: var(--accent); color: #fff; border: 0; padding: 15px 30px; font: 600 16px/1 inherit; border-radius: 999px; cursor: not-allowed; opacity: .85; }
.map { aspect-ratio: 4/3; background: #E4EFF3; display: grid; place-items: center; color: #7E959E;
  font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; border: 1px solid #DCE8ED; }
.addr li { padding: 14px 0; border-top: 1px solid #DCE8ED; display: flex; justify-content: space-between; gap: 18px; font-size: 16px; }
.addr .lab { color: #5C7079; font-size: 14px; }
.foot { background: #16242B; color: #9DB0B8; padding: 44px 0 36px; font-size: 14px; }
.foot .w { display: grid; gap: 22px; }
@media (min-width: 760px) { .foot .w { grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; } }
.foot b { color: #fff; display: block; margin-bottom: 12px; font-size: 17px; }
.foot a { color: #9DB0B8; text-decoration: none; } .foot a:hover { color: #fff; }
.foot li { margin-bottom: 8px; }
`;

const body = `
<div class="w">
  <nav class="nav">
    <div class="nav__b"><i></i> Praxis am Lindenplatz</div>
    <div class="nav__l"><a href="#behandlungen">Behandlungen</a><a href="#team">Team</a><a href="#praxis">Praxis</a><a href="#termin">Kontakt</a></div>
    <a class="nav__t" href="#termin">Termin buchen</a>
  </nav>
</div>

<section class="hero">
  <div class="w">
    <div>
      <h1>Zahnmedizin am Lindenplatz. Ohne Wartezeit, ohne Druck.</h1>
      <p>Allgemeine Zahnmedizin, Prophylaxe und Implantologie für die ganze Familie. Neue Patientinnen und Patienten erhalten innert einer Woche einen Termin.</p>
      <div class="hbtns">
        <a class="b1" href="#termin">Termin online buchen</a>
        <a class="b2" href="tel:+41440000000">044 000 00 00</a>
      </div>
    </div>
    <div>
      <div class="card-h">
        <h3>Öffnungszeiten</h3>
        <ul class="hours">
          <li><b>Montag – Donnerstag</b><span>07:30 – 18:00</span></li>
          <li><b>Freitag</b><span>07:30 – 16:00</span></li>
          <li><b>Samstag</b><span>nach Vereinbarung</span></li>
          <li><b>Sonntag</b><span>geschlossen</span></li>
        </ul>
        <div class="emerg"><b>Notfall ausserhalb der Zeiten</b>Rufen Sie 044 000 00 01. Wir sind an den zahnärztlichen Notfalldienst angeschlossen.</div>
      </div>
    </div>
  </div>
</section>

<section class="s" id="behandlungen">
  <div class="w">
    <p class="k">Behandlungen</p>
    <h2 class="h2">Was wir anbieten</h2>
    <p class="sub">Wir behandeln, was nötig ist, und erklären vorher, warum. Bei Behandlungen über 500 Franken erhalten Sie immer einen schriftlichen Kostenvoranschlag.</p>
    <div class="tr">
      <div><div class="n">01</div><h3>Kontrolle und Prophylaxe</h3><p>Jährliche Kontrolle, professionelle Zahnreinigung, Versiegelung bei Kindern.</p></div>
      <div><div class="n">02</div><h3>Füllungen und Kronen</h3><p>Zahnfarbene Composite-Füllungen, Keramikinlays und Kronen aus eigener Fertigung.</p></div>
      <div><div class="n">03</div><h3>Wurzelbehandlung</h3><p>Mit Mikroskop und maschineller Aufbereitung. In der Regel in einer Sitzung.</p></div>
      <div><div class="n">04</div><h3>Implantate</h3><p>Planung mit 3D-Röntgen, Ausführung in der Praxis, Nachkontrolle inbegriffen.</p></div>
      <div><div class="n">05</div><h3>Kinderzahnmedizin</h3><p>Erste Kontrolle ab dem dritten Lebensjahr. Wir nehmen uns Zeit, damit es dabei bleibt.</p></div>
      <div><div class="n">06</div><h3>Angstpatienten</h3><p>Längere Termine, Lachgas auf Wunsch. Sie bestimmen das Tempo.</p></div>
    </div>
  </div>
</section>

<section class="s s--alt" id="team">
  <div class="w">
    <p class="k">Team</p>
    <h2 class="h2">Wer Sie behandelt</h2>
    <p class="sub">Vier Personen, seit Jahren dieselben. Sie werden nicht bei jedem Termin von jemand anderem empfangen.</p>
    <div class="team">
      <div><div class="av">Foto</div><h3>Dr. med. dent. A. Meier</h3><p>Praxisinhaberin, Implantologie</p></div>
      <div><div class="av">Foto</div><h3>Dr. med. dent. S. Frei</h3><p>Allgemeine Zahnmedizin</p></div>
      <div><div class="av">Foto</div><h3>N. Hofer</h3><p>Dentalhygienikerin</p></div>
      <div><div class="av">Foto</div><h3>C. Baumann</h3><p>Praxisassistenz, Empfang</p></div>
    </div>
  </div>
</section>

<section class="s" id="termin">
  <div class="w two">
    <div>
      <p class="k">Termin</p>
      <h2 class="h2">Termin vereinbaren</h2>
      <p class="sub">Online, telefonisch oder per E-Mail. Neue Patientinnen und Patienten erhalten innert einer Woche einen Termin.</p>
      <form class="form" onsubmit="return false">
        <div><label for="z-n">Name</label><input id="z-n" type="text" placeholder="Vor- und Nachname"></div>
        <div><label for="z-k">Telefon</label><input id="z-k" type="tel" placeholder="Für die Terminbestätigung"></div>
        <div><label for="z-g">Grund</label>
          <select id="z-g"><option>Kontrolle</option><option>Dentalhygiene</option><option>Schmerzen</option><option>Erstberatung Implantat</option><option>Anderes</option></select>
        </div>
        <div><label for="z-m">Bemerkung</label><textarea id="z-m" placeholder="Wann passt es Ihnen am besten?"></textarea></div>
        <button type="button" disabled>Termin anfragen</button>
      </form>
    </div>
    <div id="praxis">
      <div class="map">Karte</div>
      <ul class="addr">
        <li><span>Lindenplatz 4, 8004 Zürich</span><span class="lab">Adresse</span></li>
        <li><span>Tram 2 / 3, Haltestelle Lindenplatz</span><span class="lab">ÖV</span></li>
        <li><span>Parkplätze im Hof</span><span class="lab">Anfahrt</span></li>
        <li><span>044 000 00 00</span><span class="lab">Telefon</span></li>
        <li><span>praxis@example.ch</span><span class="lab">E-Mail</span></li>
      </ul>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="w">
    <div><b>Praxis am Lindenplatz</b><p>Zahnarztpraxis in Zürich Aussersihl. Alle Krankenkassen, alle Altersgruppen.</p></div>
    <div><b style="font-size:14px">Praxis</b><ul><li><a href="#behandlungen">Behandlungen</a></li><li><a href="#team">Team</a></li><li><a href="#termin">Termin</a></li></ul></div>
    <div><b style="font-size:14px">Rechtliches</b><ul><li><a href="#">Impressum</a></li><li><a href="#">Datenschutz</a></li></ul></div>
  </div>
</footer>`;

export default {
  slug: "zahnarzt",
  render: ({ site, c }) =>
    demoShell({
      site, c, slug: "zahnarzt",
      name: "Praxis am Lindenplatz",
      title: "Praxis am Lindenplatz",
      description: "Designkonzept von Cantelo für eine Zahnarztpraxis: Behandlungen, Team, Öffnungszeiten, Terminanfrage.",
      accent: "#2E6F8E",
      css, body,
    }),
};
