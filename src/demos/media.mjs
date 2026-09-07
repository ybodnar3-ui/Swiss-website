// Image slots for the design concepts.
//
// A slot renders a real photograph when the file exists under
// assets/demo/<set>/<name>.jpg, and a designed tonal placeholder when it does
// not. Dropping photos into that folder is therefore the only step needed to
// fill the concepts in — no markup changes.

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const hasPhoto = (set, name) => existsSync(join(root, "assets/demo", set, `${name}.jpg`));

/**
 * @param set   folder under assets/demo (one per concept)
 * @param name  file basename without extension
 * @param alt   alternative text
 * @param tone  two palette colours for the placeholder, light to dark
 * @param cls   extra class on the wrapper
 */
export function photo({ set, name, alt, tone = ["#D9D4CC", "#A79E92"], cls = "" }) {
  const klass = `ph-img${cls ? " " + cls : ""}`;
  if (hasPhoto(set, name)) {
    return `<img class="${klass}" src="/assets/demo/${set}/${name}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  }
  return `<span class="${klass} ph-img--empty" role="img" aria-label="${esc(alt)}"
    style="--a:${tone[0]};--b:${tone[1]}"></span>`;
}

/** Initials stand in for a portrait: honest, and it looks deliberate. */
export function monogram(name, tone) {
  const initials = name
    .replace(/^(Dr\.|med\.|dent\.)\s*/g, "")
    .split(/\s+/)
    .filter((w) => /^[A-ZÄÖÜ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return `<span class="mono-av" style="--a:${tone}" aria-hidden="true">${esc(initials)}</span>`;
}

/** A drawn street map beats a grey box labelled "Karte". */
export function mapSvg(accent) {
  return `<svg class="map-svg" viewBox="0 0 400 300" role="img" aria-label="Lage" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="300" fill="#EEF3F5"/>
  <g fill="#E982" opacity="0"><rect width="1" height="1"/></g>
  <g fill="#DDE7EB">
    <rect x="24" y="26" width="86" height="58"/><rect x="126" y="26" width="120" height="58"/>
    <rect x="262" y="26" width="114" height="94"/><rect x="24" y="100" width="86" height="76"/>
    <rect x="126" y="100" width="120" height="76"/><rect x="24" y="192" width="150" height="82"/>
    <rect x="190" y="192" width="86" height="82"/><rect x="292" y="136" width="84" height="138"/>
  </g>
  <g stroke="#fff" stroke-width="9" fill="none">
    <path d="M0 92h400"/><path d="M0 184h400"/><path d="M118 0v300"/><path d="M254 0v300"/><path d="M284 92 400 20"/>
  </g>
  <g stroke="#C6D6DD" stroke-width="1" fill="none">
    <path d="M0 92h400"/><path d="M0 184h400"/><path d="M118 0v300"/><path d="M254 0v300"/>
  </g>
  <circle cx="186" cy="138" r="34" fill="${accent}" opacity=".14"/>
  <path d="M186 112a17 17 0 0 0-17 17c0 12 17 29 17 29s17-17 17-29a17 17 0 0 0-17-17z" fill="${accent}"/>
  <circle cx="186" cy="129" r="6" fill="#fff"/>
</svg>`;
}
