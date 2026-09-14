// Mirrors a contact-form submission into Telegram.
//
// Runs as a Vercel Serverless Function so the bot token stays in an
// environment variable. Sending straight from the page would put the token in
// the page source, where anyone could read it and take over the bot.
//
// E-mail via Web3Forms remains the system of record; this is a notification.
// A failure here must never surface to the visitor.

const ALLOWED_HOSTS = ["cantelo.tech", "www.cantelo.tech", "localhost:4173"];
const MAX = { name: 200, contact: 200, message: 4000, page: 300, lang: 8 };

const clip = (v, n) => String(v == null ? "" : v).slice(0, n).trim();
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

module.exports = async (req, res) => {
  // Always answer 200: the browser fires this alongside the real submission
  // and must not show an error if the notification fails.
  const done = (logged) => {
    if (logged) console.error(logged);
    res.status(200).json({ ok: true });
  };

  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return done("notify: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");

  // Only accept calls that came from our own pages. Not a real defence against
  // a determined sender — headers can be forged — but it stops the drive-by
  // scanners that probe every /api path they find.
  let host = "";
  try {
    host = new URL(req.headers.origin || req.headers.referer || "").host;
  } catch {}
  if (!ALLOWED_HOSTS.includes(host)) return done(`notify: rejected origin "${host}"`);

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (clip(body.botcheck, 10)) return done("notify: honeypot filled");

  const name = clip(body.name, MAX.name);
  const contact = clip(body.contact, MAX.contact);
  const message = clip(body.message, MAX.message);
  if (!name && !contact && !message) return done("notify: empty submission");

  const page = clip(body.page, MAX.page);
  const lang = clip(body.lang, MAX.lang);
  const isMail = contact.includes("@") && !contact.includes(" ");

  const text =
    `<b>Нова заявка — cantelo.tech</b>\n\n` +
    `<b>Ім'я:</b> ${esc(name) || "—"}\n` +
    `<b>Контакт:</b> ${
      contact ? (isMail ? `<a href="mailto:${esc(contact)}">${esc(contact)}</a>` : `<code>${esc(contact)}</code>`) : "—"
    }\n` +
    `<b>Мова:</b> ${esc(lang) || "—"}\n` +
    `<b>Сторінка:</b> <code>${esc(page) || "—"}</code>\n\n` +
    `${esc(message) || "—"}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!r.ok) return done(`notify: telegram HTTP ${r.status} ${await r.text()}`);
  } catch (e) {
    return done(`notify: ${e.message}`);
  }
  return done();
};
