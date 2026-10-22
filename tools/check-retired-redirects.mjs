// After launch: checks that every retired URL in data/retired-urls.json answers with a permanent redirect
// to its target. Usage: node tools/check-retired-redirects.mjs https://www.betranslated.co.uk
import fs from "node:fs";

const base = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const { entries } = JSON.parse(fs.readFileSync(new URL("../data/retired-urls.json", import.meta.url), "utf8"));
let bad = 0;
for (const e of entries) {
  const res = await fetch(base + e.from, { redirect: "manual" });
  const loc = res.headers.get("location") || "";
  const ok = [301, 308].includes(res.status) && loc.replace(/^https?:\/\/[^/]+/, "") === e.to;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${res.status} ${e.from} -> ${loc || "(none)"}`);
}
console.log(`${entries.length - bad}/${entries.length} redirects correct`);
process.exitCode = bad ? 1 : 0;
