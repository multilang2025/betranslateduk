// Content-access module: scraped JSON under scripts/btvibe-uk/output is the
// content database. No CMS dependency at runtime.
import fs from 'fs';
import path from 'path';

const OUTPUT_ROOT = path.join(process.cwd(), 'scripts', 'btvibe-uk', 'output');

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsonFiles(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function slugPartsToFsPath(slugParts) {
  if (!slugParts || slugParts.length === 0) {
    return path.join(OUTPUT_ROOT, 'pages', 'index.json');
  }
  const joined = slugParts.join(path.sep);
  // Pages and posts share the same route space (posts live under /blog/<slug>/,
  // which is already encoded in slugParts as ['blog', slug]).
  const pagesPath = path.join(OUTPUT_ROOT, 'pages', joined + '.json');
  if (fs.existsSync(pagesPath)) return pagesPath;

  if (slugParts[0] === 'blog' && slugParts.length === 2) {
    const postsPath = path.join(OUTPUT_ROOT, 'posts', slugParts[1] + '.json');
    if (fs.existsSync(postsPath)) return postsPath;
  }
  return null;
}

let cache = null;
function readJson(fsPath) {
  if (cache && cache[fsPath]) return cache[fsPath];
  const data = JSON.parse(fs.readFileSync(fsPath, 'utf8'));
  if (!cache) cache = {};
  cache[fsPath] = data;
  return data;
}

export function getPageBySlug(slugParts) {
  const fsPath = slugPartsToFsPath(slugParts);
  if (!fsPath) return null;
  return readJson(fsPath);
}

export function getHomePage() {
  return getPageBySlug([]);
}

export function getAllPageSlugs() {
  const pageFiles = walkJsonFiles(path.join(OUTPUT_ROOT, 'pages'));
  const postFiles = walkJsonFiles(path.join(OUTPUT_ROOT, 'posts'));

  const slugs = [];

  for (const f of pageFiles) {
    const rel = path.relative(path.join(OUTPUT_ROOT, 'pages'), f).replace(/\.json$/, '');
    if (rel === 'index') { slugs.push([]); continue; }
    slugs.push(rel.split(path.sep));
  }

  for (const f of postFiles) {
    const rel = path.relative(path.join(OUTPUT_ROOT, 'posts'), f).replace(/\.json$/, '');
    slugs.push(['blog', ...rel.split(path.sep)]);
  }

  return slugs;
}
