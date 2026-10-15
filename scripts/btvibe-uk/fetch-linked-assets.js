// Downloads uploads files referenced only via <a href> (infographics, PDFs)
// that the image harvester (img/og:image only) didn't catch. Mirrors them
// under public/images/ alongside the other downloaded assets.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'output');
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public', 'images');
const BASE_HOST = 'www.betranslated.co.uk';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

async function run() {
  const files = walk(ROOT);
  const seen = new Set();
  let downloaded = 0, failed = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const link of data.links || []) {
      if (!link.href) continue;
      let u;
      try { u = new URL(link.href, 'https://' + BASE_HOST); } catch (e) { continue; }
      if (u.hostname !== BASE_HOST) continue;
      if (!u.pathname.startsWith('/wp-content/uploads/')) continue;
      if (seen.has(u.pathname)) continue;
      const localFsPath = path.join(PUBLIC_DIR, u.pathname.replace(/^\//, ''));
      if (fs.existsSync(localFsPath)) { seen.add(u.pathname); continue; } // already downloaded by image harvester
      seen.add(u.pathname);

      try {
        const res = await fetch(u.origin + u.pathname, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTvibe-uk-scraper/1.0)' } });
        if (!res.ok) { console.log('FAIL ' + res.status + ' ' + u.pathname); failed++; continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        fs.mkdirSync(path.dirname(localFsPath), { recursive: true });
        fs.writeFileSync(localFsPath, buf);
        console.log('OK   ' + u.pathname);
        downloaded++;
      } catch (err) {
        console.log('FAIL ' + u.pathname + ': ' + err.message);
        failed++;
      }
    }
  }
  console.log('\nDownloaded:', downloaded, 'Failed:', failed);
}

run();
