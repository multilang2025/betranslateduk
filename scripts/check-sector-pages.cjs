// Checks data/sector-pages/*.json: valid JSON, banned words/dashes, and that internal link targets exist.
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "data", "sector-pages");
const root = path.join(__dirname, "..");
const bad = /[\u2014\u2013]|\b(important|importance|vital|crucial|essential)\b|this guide|break language barriers|\u00a3/i;

function exists(h) {
  const p = h.replace(/^\/|\/$/g, "");
  const cands = [
    `scripts/btvibe-uk/output/pages/${p}.json`,
    `scripts/btvibe-uk/output/posts/${p.replace(/^blog\//, "")}.json`,
    `scripts/btvibe-uk/output/pages/${p}/index.json`,
  ];
  return cands.some((c) => fs.existsSync(path.join(root, c)));
}

for (const f of fs.readdirSync(dir)) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  JSON.parse(t);
  const m = t.match(bad);
  const hrefs = new Set();
  for (const x of t.matchAll(/href=\\"([^"\\]+)/g)) hrefs.add(x[1]);
  for (const x of t.matchAll(/"href":\s*"([^"]+)"/g)) hrefs.add(x[1]);
  const dead = [...hrefs].filter((h) => h.startsWith("/") && !exists(h));
  console.log(f.padEnd(20), "banned:", m ? m[0] : "none", "| links:", hrefs.size, "| unresolved:", dead.join(", ") || "none");
}
