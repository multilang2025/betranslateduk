// Uploads the site's images to the public Supabase bucket betranslated-uk-images.
//
//   node tools/upload-images.mjs [--env-file <path>] [--dir public/images] [--dir public/img] [--dry-run]
//
// Object paths are the file paths under public/ (ASCII-normalised by objectKey in lib/site.js) ("images/wp-content/uploads/...", "img/en/..."), so the
// site's /images/... and /img/... URLs map to <bucket URL>/images/... with a plain prefix (lib/site.js).
// Credentials: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the environment, or from the .env file
// passed with --env-file (for example the one in your Valenciamove or BTvibe-es checkout). They are never
// printed, written or committed. Re-running is safe: every object is upserted.
import fs from "node:fs";
import path from "node:path";
import { objectKey } from "../lib/site.js";

const BUCKET = "betranslated-uk-images";
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const values = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));

const envFile = values("--env-file")[0];
if (envFile) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i > 0) process.env[line.slice(0, i).trim()] ||= line.slice(i + 1).trim();
  }
}
const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = flag("--dry-run");
if (!dryRun && (!url || !key)) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (environment or --env-file).");

const dirs = values("--dir").length ? values("--dir") : ["public/images", "public/img"];
const TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", gif: "image/gif", pdf: "application/pdf" };

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(dirs[0]);
for (const d of dirs.slice(1)) {
  (function walk(x) {
    for (const e of fs.readdirSync(x, { withFileTypes: true })) {
      const p = path.join(x, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(p);
    }
  })(d);
}

const objectPath = (file) => objectKey("/" + path.relative("public", file).split(path.sep).join("/")).slice(1);
const encode = (p) => p.split("/").map(encodeURIComponent).join("/");

let done = 0, failed = [], bytes = 0;
async function upload(file) {
  const obj = objectPath(file);
  const body = fs.readFileSync(file);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${encode(obj)}`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": TYPES[path.extname(file).slice(1).toLowerCase()] || "application/octet-stream",
          "x-upsert": "true",
          "cache-control": "max-age=31536000",
        },
        body,
      });
      if (res.ok) { done++; bytes += body.length; return; }
      if (attempt === 3) failed.push({ obj, status: res.status, error: (await res.text()).slice(0, 160) });
    } catch (err) {
      if (attempt === 3) failed.push({ obj, error: String(err.message || err).slice(0, 160) });
    }
  }
}

console.log(`${files.length} files from ${dirs.join(", ")}${dryRun ? " (dry run)" : ""}`);
if (!dryRun) {
  const queue = [...files];
  await Promise.all(Array.from({ length: 6 }, async () => { for (let f; (f = queue.shift()); ) await upload(f); }));
  console.log(JSON.stringify({ bucket: BUCKET, uploaded: done, megabytes: +(bytes / 1048576).toFixed(1), failed: failed.length }));
  for (const f of failed) console.log("FAILED", JSON.stringify(f));
  process.exitCode = failed.length ? 1 : 0;
}
