#!/usr/bin/env node
// Renders each design concept to a real screenshot for the example cards.
// The concept banner is stripped first: the card should show the site as a
// client would see it, and the banner already appears on the page itself.
//
//   node build.mjs && node scripts/shots.mjs
//
// Requires Google Chrome and macOS `sips`. Output: assets/shots/<slug>.png

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const out = join(root, "assets/shots");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 4199;
const SHOT_W = 1600, SHOT_H = 1200, FINAL_W = 800;

if (!existsSync(CHROME)) { console.error("  ✗ Google Chrome not found"); process.exit(1); }
if (!existsSync(dist)) { console.error("  ✗ run `node build.mjs` first"); process.exit(1); }

const slugs = ["maler", "zahnarzt", "restaurant"];
const tmp = join(dist, "_shot");
mkdirSync(tmp, { recursive: true });
mkdirSync(out, { recursive: true });

for (const slug of slugs) {
  const html = readFileSync(join(dist, "beispiele", slug, "index.html"), "utf8")
    .replace(/<div class="cbar">[\s\S]*?<\/div>\n<\/div>/, "")
    .replace(/<div class="cfoot">[\s\S]*?<\/div>/, "");
  writeFileSync(join(tmp, `${slug}.html`), html);
}

const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", dist], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 900));

try {
  for (const slug of slugs) {
    const png = join(out, `${slug}.png`);
    execFileSync(CHROME, [
      "--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      `--window-size=${SHOT_W},${SHOT_H}`, `--screenshot=${png}`, "--virtual-time-budget=3000",
      `http://localhost:${PORT}/_shot/${slug}.html`,
    ], { stdio: "ignore" });
    execFileSync("sips", ["-Z", String(FINAL_W), png], { stdio: "ignore" });
    // Flat UI screenshots quantise to a 128-colour palette with no visible
    // loss and about a third of the bytes. JPEG would smear the text.
    execFileSync("python3", ["-c",
      `from PIL import Image; im=Image.open(${JSON.stringify(png)});` +
      `im.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=128)` +
      `.save(${JSON.stringify(png)}, optimize=True)`], { stdio: "ignore" });
    const kb = (readFileSync(png).length / 1024).toFixed(0);
    console.log(`  ${slug}.png  ${FINAL_W}px  ${kb} kB`);
  }
} finally {
  server.kill();
  rmSync(tmp, { recursive: true, force: true });
}
