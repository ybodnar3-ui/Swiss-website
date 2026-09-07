import { demoShell } from "./shell.mjs";

const css = `
body { background: #FAF6EE; color: #1B1A16; font: 400 17px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif; }
.w { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.serif { font-family: Georgia, "Times New Roman", Times, serif; }
.nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 20px 0; }
.nav__b { font-family: Georgia, serif; font-size: 22px; letter-spacing: .01em; }
.nav__l { display: none; gap: 26px; font-size: 15px; }
.nav__l a { text-decoration: none; color: #6E6A5E; } .nav__l a:hover { color: #1B1A16; }
@media (min-width: 860px) { .nav__l { display: flex; } }
.nav__t { border: 1px solid var(--accent); color: var(--accent); text-decoration: none; padding: 10px 20px; font-size: 15px; font-weight: 600; white-space: nowrap; }
.nav__t:hover { background: var(--accent); color: #FAF6EE; }

.hero { background: var(--accent); color: #F3EFE3; }
.hero .w { padding: clamp(60px,9vw,120px) 24px; text-align: center; }
.hero h1 { font-family: Georgia, serif; font-size: clamp(36px,6.5vw,72px); line-height: 1.05; letter-spacing: -.01em; font-weight: 400; }
.hero p { margin: 22px auto 0; font-size: clamp(17px,1.8vw,20px); color: rgba(243,239,227,.78); max-width: 48ch; }
.hero .row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 34px; }
.hb1 { background: #F3EFE3; color: var(--accent); text-decoration: none; padding: 15px 30px; font-weight: 600; }
.hb2 { border: 1px solid rgba(243,239,227,.5); color: #F3EFE3; text-decoration: none; padding: 15px 30px; font-weight: 600; }
.hb1:hover { background: #fff; } .hb2:hover { border-color: #F3EFE3; }
.hero .meta { margin-top: 40px; padding-top: 26px; border-top: 1px solid rgba(243,239,227,.22); display: flex; flex-wrap: wrap;
  gap: 10px 34px; justify-content: center; font-size: 14px; color: rgba(243,239,227,.78); }

.s { padding: clamp(52px,7vw,92px) 0; }
.s--alt { background: #F1EBDD; }
.k { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
.h2 { font-family: Georgia, serif; font-size: clamp(28px,3.8vw,42px); line-height: 1.12; font-weight: 400; }
.sub { margin-top: 15px; color: #6E6A5E; max-width: 54ch; }

.menu { display: grid; gap: 44px; margin-top: 44px; }
@media (min-width: 860px) { .menu { grid-template-columns: 1fr 1fr; gap: 60px; } }
.menu h3 { font-family: Georgia, serif; font-size: 24px; font-weight: 400; padding-bottom: 14px; border-bottom: 1px solid #DED5C2; }
.menu li { padding: 16px 0; border-bottom: 1px solid #E7DFCE; }
.menu .r { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
.menu .r b { font-weight: 600; font-size: 17px; }
.menu .r span { font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }
.menu .d { font-size: 14px; color: #6E6A5E; margin-top: 5px; }
.dayband { background: var(--accent); color: #F3EFE3; padding: 26px 28px; margin-top: 40px; display: grid; gap: 8px; }
@media (min-width: 700px) { .dayband { grid-template-columns: 1fr auto; align-items: center; } }
.dayband b { font-family: Georgia, serif; font-size: 22px; font-weight: 400; }
.dayband p { color: rgba(243,239,227,.78); font-size: 15px; }
.dayband .p { font-size: 30px; font-weight: 600; font-variant-numeric: tabular-nums; }

.two { display: grid; gap: 44px; }
@media (min-width: 900px) { .two { grid-template-columns: 1fr 1fr; gap: 60px; } }
.hours li { display: flex; justify-content: space-between; gap: 18px; padding: 14px 0; border-top: 1px solid #DED5C2; font-size: 16px; }
.hours span { color: #6E6A5E; font-variant-numeric: tabular-nums; }
.gal { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 40px; }
.gal div { aspect-ratio: 1; display: grid; place-items: center; color: rgba(255,255,255,.8);
  font: 500 11px/1 ui-monospace, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; }
.gal :nth-child(1) { background: #6B4A2E; } .gal :nth-child(2) { background: #1F5130; } .gal :nth-child(3) { background: #8A6A2E; }
.gal :nth-child(4) { background: #2E4A3A; } .gal :nth-child(5) { background: #9A5A32; } .gal :nth-child(6) { background: #4A3A2A; }
.form { display: grid; gap: 16px; margin-top: 26px; }
.form .g2 { display: grid; gap: 16px; } @media (min-width: 560px) { .form .g2 { grid-template-columns: 1fr 1fr; } }
.form label { font: 500 12px/1 ui-monospace, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; color: #6E6A5E; display: block; margin-bottom: 8px; }
.form input, .form select, .form textarea { width: 100%; font: inherit; font-size: 16px; padding: 13px 14px; border: 1px solid #D5C9B2; background: #fff; border-radius: 0; }
.form button { justify-self: start; background: var(--accent); color: #F3EFE3; border: 0; padding: 15px 32px; font: 600 16px/1 inherit; cursor: not-allowed; opacity: .85; }
.foot { background: #1B1A16; color: #A39D8E; padding: 44px 0 36px; font-size: 14px; }
.foot .w { display: grid; gap: 22px; }
@media (min-width: 760px) { .foot .w { grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; } }
.foot b { color: #F3EFE3; display: block; margin-bottom: 12px; font-size: 17px; font-family: Georgia, serif; font-weight: 400; }
.foot a { color: #A39D8E; text-decoration: none; } .foot a:hover { color: #F3EFE3; }
.foot li { margin-bottom: 8px; }
`;

const body = `
<div class="w">
  <nav class="nav">
    <div class="nav__b">Trattoria Bellavista</div>
    <div class="nav__l"><a href="#menu">Menü</a><a href="#mittag">Mittagsmenü</a><a href="#zeiten">Öffnungszeiten</a><a href="#reservation">Reservation</a></div>
    <a class="nav__t" href="#reservation">Tisch reservieren</a>
  </nav>
</div>

<section class="hero">
  <div class="w">
    <h1>Trattoria Bellavista</h1>
    <p>Italienische Küche in Luzern seit 1987. Hausgemachte Pasta, Fisch vom Markt, eine Weinkarte ohne Überraschungen beim Preis.</p>
    <div class="row">
      <a class="hb1" href="#reservation">Tisch reservieren</a>
      <a class="hb2" href="#mittag">Mittagsmenü ansehen</a>
    </div>
    <div class="meta">
      <span>Di – So geöffnet</span><span>60 Plätze, Terrasse 30</span><span>Gehminute vom Bahnhof</span><span>041 000 00 00</span>
    </div>
  </div>
</section>

<section class="s" id="mittag">
  <div class="w">
    <p class="k">Mittagsmenü</p>
    <h2 class="h2">Diese Woche</h2>
    <p class="sub">Von Dienstag bis Freitag, 11:30 bis 14:00. Inklusive Tagessuppe oder Salat.</p>
    <div class="dayband">
      <div><b>Menü des Tages</b><p>Wechselt täglich. Vegetarische Variante immer verfügbar.</p></div>
      <div class="p">24.50</div>
    </div>
    <div class="menu">
      <div>
        <h3>Vorspeisen</h3>
        <ul>
          <li><div class="r"><b>Vitello tonnato</b><span>18.50</span></div><p class="d">Kalbfleisch, Thunfischsauce, Kapern</p></li>
          <li><div class="r"><b>Bruschetta al pomodoro</b><span>12.50</span></div><p class="d">Tomaten, Basilikum, Knoblauch</p></li>
          <li><div class="r"><b>Insalata mista</b><span>9.50</span></div><p class="d">Blattsalate, Hausdressing</p></li>
          <li><div class="r"><b>Carpaccio di manzo</b><span>21.00</span></div><p class="d">Rindsfilet, Rucola, Parmesan</p></li>
        </ul>
      </div>
      <div>
        <h3>Hauptgänge</h3>
        <ul>
          <li><div class="r"><b>Tagliatelle al ragù</b><span>26.00</span></div><p class="d">Hausgemachte Pasta, Rindsragout</p></li>
          <li><div class="r"><b>Risotto ai funghi</b><span>28.00</span></div><p class="d">Steinpilze, Parmesan</p></li>
          <li><div class="r"><b>Branzino al forno</b><span>39.00</span></div><p class="d">Ganzer Wolfsbarsch aus dem Ofen, Gemüse</p></li>
          <li><div class="r"><b>Saltimbocca alla romana</b><span>36.00</span></div><p class="d">Kalbfleisch, Rohschinken, Salbei</p></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="s s--alt" id="menu">
  <div class="w">
    <p class="k">Das Lokal</p>
    <h2 class="h2">Bei uns</h2>
    <p class="sub">Zwei Räume und eine Terrasse zum Innenhof. Für Geburtstage und Firmenessen bis 30 Personen reservierbar.</p>
    <div class="gal">
      <div>Foto</div><div>Foto</div><div>Foto</div><div>Foto</div><div>Foto</div><div>Foto</div>
    </div>
  </div>
</section>

<section class="s" id="reservation">
  <div class="w two">
    <div>
      <p class="k">Reservation</p>
      <h2 class="h2">Tisch reservieren</h2>
      <p class="sub">Für Gruppen ab acht Personen rufen Sie uns bitte an, damit wir den passenden Raum freihalten können.</p>
      <form class="form" onsubmit="return false">
        <div class="g2">
          <div><label for="r-d">Datum</label><input id="r-d" type="date"></div>
          <div><label for="r-z">Zeit</label><input id="r-z" type="time" value="19:00"></div>
        </div>
        <div class="g2">
          <div><label for="r-p">Personen</label><select id="r-p"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7 oder mehr</option></select></div>
          <div><label for="r-t">Telefon</label><input id="r-t" type="tel" placeholder="Für die Bestätigung"></div>
        </div>
        <div><label for="r-n">Name</label><input id="r-n" type="text" placeholder="Auf welchen Namen?"></div>
        <button type="button" disabled>Reservation anfragen</button>
      </form>
    </div>
    <div id="zeiten">
      <p class="k">Öffnungszeiten</p>
      <ul class="hours">
        <li><b>Dienstag – Freitag</b><span>11:30 – 14:00 &nbsp;·&nbsp; 17:30 – 23:00</span></li>
        <li><b>Samstag</b><span>17:30 – 23:30</span></li>
        <li><b>Sonntag</b><span>11:30 – 22:00</span></li>
        <li><b>Montag</b><span>Ruhetag</span></li>
      </ul>
      <ul class="hours" style="margin-top:34px">
        <li><b>Adresse</b><span>Musterweg 8, 6003 Luzern</span></li>
        <li><b>Telefon</b><span>041 000 00 00</span></li>
        <li><b>E-Mail</b><span>tisch@example.ch</span></li>
      </ul>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="w">
    <div><b>Trattoria Bellavista</b><p>Italienische Küche in Luzern. Familienbetrieb seit 1987.</p></div>
    <div><b style="font-size:14px;font-family:inherit;font-weight:600">Gast</b><ul><li><a href="#mittag">Mittagsmenü</a></li><li><a href="#zeiten">Öffnungszeiten</a></li><li><a href="#reservation">Reservation</a></li></ul></div>
    <div><b style="font-size:14px;font-family:inherit;font-weight:600">Rechtliches</b><ul><li><a href="#">Impressum</a></li><li><a href="#">Datenschutz</a></li></ul></div>
  </div>
</footer>`;

export default {
  slug: "restaurant",
  render: ({ site, c }) =>
    demoShell({
      site, c, slug: "restaurant",
      name: "Trattoria Bellavista",
      title: "Trattoria Bellavista",
      description: "Designkonzept von Cantelo für ein Restaurant: Menükarte, Mittagsmenü, Öffnungszeiten, Tischreservation.",
      accent: "#1F5130",
      css, body,
    }),
};
