// Downloads every image referenced by the scrape (img src + og:image) into
// public/images/, mirroring the original wp-content path, so the migrated
// site never depends on the old domain once it's retired.
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

function localPathFor(imgUrl) {
  let u;
  try {
    u = new URL(imgUrl, 'https://' + BASE_HOST);
  } catch (e) {
    return null;
  }
  if (!u.hostname.includes('betranslated.co.uk')) return null; // third-party image, skip
  const cleanPath = u.pathname.replace(/^\//, '');
  if (!cleanPath) return null;
  return { localFsPath: path.join(PUBLIC_DIR, cleanPath), publicUrlPath: '/images/' + cleanPath, remoteUrl: u.origin + u.pathname };
}

async function run() {
  const files = walk(ROOT);
  const seen = new Map();
  const manifest = { downloaded: [], failed: [], skippedThirdParty: new Set() };

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const refs = [
      ...(data.images || []).map(img => img.src),
      data.og && data.og.image,
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
        console.log('OK   ' + loc.remoteUrl);
      } catch (err) {
        manifest.failed.push({ url: loc.remoteUrl, error: err.message });
        console.log('FAIL ' + loc.remoteUrl + ': ' + err.message);
      }
    }
  }

  manifest.skippedThirdParty = Array.from(manifest.skippedThirdParty);
  fs.writeFileSync(path.join(__dirname, 'image-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nDownloaded:', manifest.downloaded.length, 'Failed:', manifest.failed.length, 'Third-party skipped:', manifest.skippedThirdParty.length);
}

run();
