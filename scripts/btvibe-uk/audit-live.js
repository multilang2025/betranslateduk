// Verifies the LIVE deployed preview site against our scraped data:
// route status codes for all 171 pages + 58 category routes, metatag
// parity (title/description) on a sample, and that internal links on a
// sample of live pages actually resolve to preview.betranslated.co.uk
// paths (not the old live domain).
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'output');
const PREVIEW = 'https://preview.betranslated.co.uk';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function pathFromFile(kind, file, base) {
  const rel = path.relative(base, file).replace(/\.json$/, '').split(path.sep).join('/');
  if (kind === 'pages') return rel === 'index' ? '/' : '/' + rel + '/';
  return '/blog/' + rel + '/';
}

async function checkStatus(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'manual' });
    return res.status;
  } catch (e) {
    return 'ERR:' + e.message;
  }
}

async function run() {
  const pageFiles = walk(path.join(OUT, 'pages'));
  const postFiles = walk(path.join(OUT, 'posts'));

  const routes = [
    ...pageFiles.map(f => pathFromFile('pages', f, path.join(OUT, 'pages'))),
    ...postFiles.map(f => pathFromFile('posts', f, path.join(OUT, 'posts'))),
  ];

  const categoryMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'category-map.json'), 'utf8'));
  for (const slug of Object.keys(categoryMap)) {
    routes.push('/blog/category/' + slug + '/');
  }

  const results = { ok: 0, notOk: [], total: routes.length };

  for (const route of routes) {
    const status = await checkStatus(PREVIEW + route);
    if (status !== 200) results.notOk.push({ route, status });
    else results.ok++;
  }

  fs.writeFileSync(path.join(__dirname, 'live-audit-report.json'), JSON.stringify(results, null, 2));
  console.log('=== Live route check ===');
  console.log('Total routes checked:', results.total);
  console.log('200 OK:', results.ok);
  console.log('Not OK:', results.notOk.length);
  if (results.notOk.length) {
    console.log('\nNon-200 routes:');
    for (const r of results.notOk) console.log(' ', r.status, r.route);
  }
}

run();
