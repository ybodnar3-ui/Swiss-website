#!/usr/bin/env node
// Fetches photographs for the design-concept galleries from Pexels, crops them
// to each slot's aspect ratio and records where every file came from.
//
//   PEXELS_API_KEY=xxxx node scripts/photos.mjs          all slots
//   PEXELS_API_KEY=xxxx node scripts/photos.mjs maler    one set
//
// The key can also live in .env.local as PEXELS_API_KEY=xxxx (gitignored).
// Output: assets/demo/<set>/<name>.jpg plus assets/demo/credits.json.
//
// Pexels' licence allows commercial use without attribution. We record the
// photographer and source URL anyway, so the provenance of every image on a
// public page can be shown on demand.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "assets/demo");

let KEY = process.env.PEXELS_API_KEY;
if (!KEY && existsSync(join(root, ".env.local"))) {
  KEY = (readFileSync(join(root, ".env.local"), "utf8").match(/^PEXELS_API_KEY=(.+)$/m) || [])[1]?.trim();
}
if (!KEY) {
  console.error("  ✗ no PEXELS_API_KEY (env var or .env.local)");
  process.exit(1);
}

// Queries lean towards rooms, surfaces and food rather than people: a
// fictional business must not put an identifiable person's face on its page.
const SETS = {
  maler: {
    ratio: [4, 3], width: 720,
    slots: [
      ["g1", "modern house exterior facade"],
      ["g2", "staircase interior white wall"],
      ["g3", "apartment building facade renovation"],
      ["g4", "minimal office interior white walls"],
      ["g5", "living room interior painted wall"],
      ["g6", "hallway interior minimal"],
      ["g7", "garden shed wooden exterior"],
      ["g8", "small shop interior"],
    ],
  },
  restaurant: {
    ratio: [1, 1], width: 640,
    slots: [
      ["g1", "restaurant table setting"],
      ["g2", "restaurant interior warm"],
      ["g3", "fresh pasta dish"],
      ["g4", "restaurant terrace courtyard"],
      ["g5", "italian antipasti plate"],
      ["g6", "red wine glass table"],
    ],
  },
  zahnarzt: {
    ratio: [21, 9], width: 1400,
    slots: [["praxis", "modern clinic waiting room interior"]],
  },
};

const credits = existsSync(join(outRoot, "credits.json"))
  ? JSON.parse(readFileSync(join(outRoot, "credits.json"), "utf8"))
  : {};

const only = process.argv[2];
const sets = only ? { [only]: SETS[only] } : SETS;
if (only && !SETS[only]) { console.error(`  ✗ unknown set "${only}"`); process.exit(1); }

for (const [set, cfg] of Object.entries(sets)) {
  mkdirSync(join(outRoot, set), { recursive: true });
  const [rw, rh] = cfg.ratio;
  const height = Math.round((cfg.width * rh) / rw);
  const orientation = rw > rh ? "landscape" : rw === rh ? "square" : "portrait";

  for (const [name, query] of cfg.slots) {
    const url =
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
      `&per_page=8&orientation=${orientation}`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) { console.error(`  ✗ ${set}/${name}: HTTP ${res.status}`); continue; }
    const data = await res.json();

    // Skip anything already used, so the galleries do not repeat a photo.
    const used = new Set(Object.values(credits).map((c) => c.id));
    const pick = (data.photos || []).find((p) => !used.has(p.id)) || (data.photos || [])[0];
    if (!pick) { console.error(`  ✗ ${set}/${name}: no results for "${query}"`); continue; }

    const img = await fetch(pick.src.large2x || pick.src.large);
    const raw = join(outRoot, set, `${name}.src`);
    writeFileSync(raw, Buffer.from(await img.arrayBuffer()));

    const dest = join(outRoot, set, `${name}.jpg`);
    execFileSync("python3", ["-c", `
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open(${JSON.stringify(raw)})).convert("RGB")
im = ImageOps.fit(im, (${cfg.width}, ${height}), method=Image.LANCZOS, centering=(0.5, 0.42))
im.save(${JSON.stringify(dest)}, "JPEG", quality=78, optimize=True, progressive=True)
`]);
    execFileSync("rm", ["-f", raw]);

    credits[`${set}/${name}.jpg`] = {
      id: pick.id, query,
      photographer: pick.photographer, photographer_url: pick.photographer_url,
      source: pick.url, license: "Pexels License (commercial use, no attribution required)",
    };
    const kb = (readFileSync(dest).length / 1024).toFixed(0);
    console.log(`  ${set}/${name}.jpg  ${cfg.width}×${height}  ${kb} kB  — ${pick.photographer}`);
  }
}

writeFileSync(join(outRoot, "credits.json"), JSON.stringify(credits, null, 2) + "\n");
console.log(`\n  provenance recorded in assets/demo/credits.json\n`);
