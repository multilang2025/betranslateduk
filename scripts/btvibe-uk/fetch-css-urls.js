// Scans every CSS source (downloaded theme files under public/theme-assets
// AND each page's inline headInlineStyles stored in the scraped JSON) for
// url(...) references -- icon fonts, CSS background-images -- that neither
// the <link>/<script>/<img> scanners ever look for. Downloads anything
// pointing at the live domain and rewrites the reference to a local path.
const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = path.join(__dirname, '..', '..', 'public', 'theme-assets');
const OUTPUT_ROOT = path.join(__dirname, 'output');
const BASE_HOST = 'www.betranslated.co.uk';

const URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;

function resolveAssetUrl(ref, baseUrl) {
  if (!ref || ref.startsWith('data:')) return null;
  let u;
  try {
    u = new URL(ref, baseUrl);
  } catch (e) {
    return null;
  }
  if (u.hostname !== BASE_HOST) return null; // third-party, leave as-is
  return u;
}

function localFsAndPublicPath(u) {
  const cleanPath = u.pathname.replace(/^\//, '');
  return {
    localFsPath: path.join(ASSETS_ROOT, cleanPath),
    publicUrlPath: '/theme-assets/' + cleanPath,
  };
}

async function downloadOnce(u, cache) {
  const key = u.origin + u.pathname;
  if (cache.has(key)) return cache.get(key);
  const { localFsPath, publicUrlPath } = localFsAndPublicPath(u);
  if (fs.existsSync(localFsPath)) { cache.set(key, publicUrlPath); return publicUrlPath; }
  try {
    const res = await fetch(u.origin + u.pathname, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTvibe-uk-scraper/1.0)' } });
    if (!res.ok) { console.log('FAIL ' + res.status + ' ' + u.href); cache.set(key, null); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(localFsPath), { recursive: true });
    fs.writeFileSync(localFsPath, buf);
    console.log('OK   ' + u.href + ' -> ' + publicUrlPath);
    cache.set(key, publicUrlPath);
    return publicUrlPath;
  } catch (err) {
    console.log('FAIL ' + u.href + ': ' + err.message);
    cache.set(key, null);
    return null;
  }
}

async function rewriteCss(cssText, baseUrl, cache) {
  const matches = [...cssText.matchAll(URL_RE)];
  let out = cssText;
  for (const m of matches) {
    const [full, , ref] = m;
    const u = resolveAssetUrl(ref, baseUrl);
    if (!u) continue;
    const localPath = await downloadOnce(u, cache);
    if (localPath) out = out.split(full).join('url(' + localPath + ')');
  }
  return out;
}

function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

async function run() {
  const cache = new Map();

  // 1. Every downloaded theme/plugin CSS file: base URL is its own remote
  // path on the live site (mirrors 1:1 since we download with matching paths).
  const cssFiles = walkFiles(ASSETS_ROOT).filter(f => f.endsWith('.css'));
  for (const file of cssFiles) {
    const rel = path.relative(ASSETS_ROOT, file).split(path.sep).join('/');
    const baseUrl = 'https://' + BASE_HOST + '/' + rel;
    const text = fs.readFileSync(file, 'utf8');
    const rewritten = await rewriteCss(text, baseUrl, cache);
    if (rewritten !== text) fs.writeFileSync(file, rewritten);
  }

  // 2. Each page's inline headInlineStyles, stored directly in the JSON --
  // base URL is the page's own live URL.
  const pageFiles = walkFiles(OUTPUT_ROOT).filter(f => f.endsWith('.json'));
  for (const file of pageFiles) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.headInlineStyles || !data.headInlineStyles.length) continue;
    let changed = false;
    for (const style of data.headInlineStyles) {
      const rewritten = await rewriteCss(style.css, data.url, cache);
      if (rewritten !== style.css) { style.css = rewritten; changed = true; }
    }
    if (changed) fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  const downloaded = [...cache.values()].filter(Boolean).length;
  const failed = [...cache.values()].filter(v => v === null).length;
  console.log('\nDownloaded:', downloaded, 'Failed:', failed);
}

run();
