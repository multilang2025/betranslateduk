// Phase 2b asset harvester: downloads every unique CSS/JS asset referenced
// across all scraped page/post JSON files into public/theme-assets/,
// mirroring the original site's path structure so original <link>/<script>
// references can be rewritten to local paths 1:1.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'output');
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public', 'theme-assets');
const BASE_HOST = 'www.betranslated.co.uk';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function localPathFor(assetUrl) {
  // assetUrl is absolute (https://www.betranslated.co.uk/...) or root-relative (/wp-content/...)
  let u;
  try {
    u = new URL(assetUrl, 'https://' + BASE_HOST);
  } catch (e) {
    return null;
  }
  if (u.hostname !== BASE_HOST) return null; // skip third-party scripts (GTM, ahrefs, clutch, etc.)
  const cleanPath = u.pathname.replace(/^\//, '');
  return { localFsPath: path.join(PUBLIC_DIR, cleanPath), publicUrlPath: '/theme-assets/' + cleanPath, remoteUrl: u.origin + u.pathname + u.search };
}

async function run() {
  const files = walk(ROOT);
  const seen = new Map(); // remoteUrl -> publicUrlPath
  const manifest = { downloaded: [], skippedThirdParty: new Set(), failed: [] };

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const refs = [
      ...(data.headStylesheets || []).map(s => s.href),
      ...(data.headScripts || []).map(s => s.src),
    ].filter(Boolean);

    for (const ref of refs) {
      const loc = localPathFor(ref);
      if (!loc) { manifest.skippedThirdParty.add(ref); continue; }
      if (seen.has(loc.remoteUrl)) continue;
      seen.set(loc.remoteUrl, loc.publicUrlPath);

      try {
        const res = await fetch(loc.remoteUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTvibe-uk-scraper/1.0)' } });
        if (!res.ok) { manifest.failed.push({ url: loc.remoteUrl, status: res.status }); continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        fs.mkdirSync(path.dirname(loc.localFsPath), { recursive: true });
        fs.writeFileSync(loc.localFsPath, buf);
        manifest.downloaded.push({ url: loc.remoteUrl, localPath: loc.publicUrlPath, bytes: buf.length });
        console.log('OK   ' + loc.remoteUrl + ' -> ' + loc.publicUrlPath);
      } catch (err) {
        manifest.failed.push({ url: loc.remoteUrl, error: err.message });
        console.log('FAIL ' + loc.remoteUrl + ': ' + err.message);
      }
    }
  }

  manifest.skippedThirdParty = Array.from(manifest.skippedThirdParty);
  fs.writeFileSync(path.join(__dirname, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nDownloaded:', manifest.downloaded.length, 'Failed:', manifest.failed.length, 'Third-party skipped:', manifest.skippedThirdParty.length);
}

run();
