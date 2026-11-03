// Writes data/blog-updated.json: the "Updated" date shown on each blog post.
// Rule: the later of (a) the dateModified WordPress recorded in the post's schema and
// (b) the date of the last commit that touched the post's content file in this repo.
// Re-run after editing posts: node scripts/blog-updated-dates.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir = path.join("scripts", "btvibe-uk", "output", "posts");
const out = {};
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const slug = file.replace(/\.json$/, "");
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const graph = (data.schema || []).flatMap((s) => s["@graph"] || [s]);
  const wp = graph.find((n) => n.dateModified)?.dateModified?.slice(0, 10) || "";
  let git = "";
  try {
    git = execFileSync("git", ["log", "-1", "--format=%as", "--", path.join(dir, file)], { encoding: "utf8" }).trim();
  } catch {}
  out[slug] = [wp, git].filter(Boolean).sort().pop() || "";
}
fs.writeFileSync(path.join("data", "blog-updated.json"), JSON.stringify(out, null, 2) + "\n");
const dates = Object.values(out);
console.log(`${dates.length} posts; latest ${dates.slice().sort().pop()}`);
