// Records the pixel size of every content image that ships without width/height,
// so the sanitizer can size it and the page does not shift when it loads.
// Run after a re-scrape: node tools/image-dims.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const out = "scripts/btvibe-uk/output";
const srcs = new Set();
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (p.endsWith(".json")) {
      const body = JSON.parse(fs.readFileSync(p, "utf8")).bodyHtml || "";
      for (const m of body.matchAll(/<img\b[^>]*>/g)) {
        if (/\bwidth=/.test(m[0]) && /\bheight=/.test(m[0])) continue;
        const s = m[0].match(/\bsrc="([^"]+)"/);
        if (s && s[1].startsWith("/images/")) srcs.add(s[1]);
      }
    }
  }
})(out);

const dims = {};
let missing = 0;
for (const s of [...srcs].sort()) {
  try {
    const m = await sharp(path.join("public", decodeURIComponent(s))).metadata();
    if (m.width && m.height) dims[s] = [m.width, m.height];
  } catch {
    missing++;
  }
}
fs.writeFileSync("data/image-dims.json", JSON.stringify(dims, null, 1) + "\n");
console.log("sized", Object.keys(dims).length, "of", srcs.size, "missing", missing);
