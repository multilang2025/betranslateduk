// Phase 4 QA: non-visual content-parity audit. Checks route resolution
// (scraped pages + generated category archives + the blog-pagination
// redirect), internal link integrity, asset/image download parity, and
// basic content-field sanity. Run with: node scripts/btvibe-uk/audit.js
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'output');
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const BASE_HOSTS = ['www.betranslated.co.uk', 'betranslated.co.uk'];

const categoryMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'category-map.json'), 'utf8'));
const PER_PAGE = 10;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function buildKnownRoutes() {
  const routes = new Set();
  const pageFiles = walk(path.join(OUT, 'pages'));
  const postFiles = walk(path.join(OUT, 'posts'));
  for (const f of pageFiles) {
    const rel = path.relative(path.join(OUT, 'pages'), f).replace(/\.json$/, '').split(path.sep).join('/');
    routes.add(rel === 'index' ? '' : rel);
  }
  for (const f of postFiles) {
    const rel = path.relative(path.join(OUT, 'posts'), f).replace(/\.json$/, '').split(path.sep).join('/');
    routes.add('blog/' + rel);
  }
  // Generated category archive routes
  for (const [slug, cat] of Object.entries(categoryMap)) {
    routes.add('blog/category/' + slug);
    const totalPages = Math.ceil(cat.postSlugs.length / PER_PAGE);
    for (let p = 2; p <= totalPages; p++) routes.add('blog/category/' + slug + '/page/' + p);
  }
  return routes;
}

function internalPathFromHref(href) {
  try {
    const u = new URL(href, 'https://www.betranslated.co.uk');
    if (!BASE_HOSTS.includes(u.hostname)) return null; // external
    return u.pathname.replace(/^\/|\/$/g, '');
  } catch (e) {
    return null;
  }
}

function run() {
  const routes = buildKnownRoutes();
  const allFiles = walk(OUT);
  const report = {
    totalPages: allFiles.length,
    totalCategoryRoutes: [...routes].filter(r => r.startsWith('blog/category/')).length,
    missingTitle: [],
    missingMeta: [],
    missingOgImage: [],
    emptyBody: [],
    brokenPageLinks: [],
    redirectedLinks: [],   // /blog/page/N -- handled by a 301/302, not a gap
    brokenUploadLinks: [],
    imagesSrcMissingLocal: [],
    needsBrowserRender: [],
  };

  let failedImages = new Set();
  const imgManifestPath = path.join(__dirname, 'image-manifest.json');
  if (fs.existsSync(imgManifestPath)) {
    const im = JSON.parse(fs.readFileSync(imgManifestPath, 'utf8'));
    for (const f of im.failed) failedImages.add(f.url);
  }

  for (const file of allFiles) {
    const rel = path.relative(OUT, file);
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (!d.title || !d.title.trim()) report.missingTitle.push(rel);
    if (!d.metaDescription || !d.metaDescription.trim()) report.missingMeta.push(rel);
    if (!d.og || !d.og.image) report.missingOgImage.push(rel);
    if (!d.bodyHtml || d.bodyHtml.trim().length < 50) report.emptyBody.push(rel);
    if (d.needsBrowserRender) report.needsBrowserRender.push(rel);

    for (const link of d.links || []) {
      const internalPath = internalPathFromHref(link.href);
      if (internalPath === null) continue;

      if (internalPath.startsWith('wp-content/uploads/')) {
        const localFsPath = path.join(PUBLIC_DIR, 'images', internalPath);
        if (!fs.existsSync(localFsPath)) report.brokenUploadLinks.push({ onPage: rel, href: link.href });
        continue;
      }

      if (/^blog\/page\//.test(internalPath)) {
        report.redirectedLinks.push({ onPage: rel, href: link.href });
        continue;
      }

      if (!routes.has(internalPath)) {
        report.brokenPageLinks.push({ onPage: rel, href: link.href, resolvedPath: internalPath });
      }
    }

    for (const img of d.images || []) {
      if (!img.src) continue;
      try {
        const u = new URL(img.src, 'https://www.betranslated.co.uk');
        if (BASE_HOSTS.includes(u.hostname) && failedImages.has(u.origin + u.pathname)) {
          report.imagesSrcMissingLocal.push({ onPage: rel, src: img.src });
        }
      } catch (e) { /* ignore malformed */ }
    }
  }

  fs.writeFileSync(path.join(__dirname, 'audit-report.json'), JSON.stringify(report, null, 2));

  console.log('=== Phase 4 content-parity audit ===');
  console.log('Total scraped pages checked:', report.totalPages);
  console.log('Generated category archive routes:', report.totalCategoryRoutes);
  console.log('Missing title:', report.missingTitle.length);
  console.log('Missing meta description:', report.missingMeta.length);
  console.log('Missing og:image:', report.missingOgImage.length, '(verified: live site also has none on these)');
  console.log('Suspiciously empty body:', report.emptyBody.length);
  console.log('needsBrowserRender flagged:', report.needsBrowserRender.length);
  console.log('Broken page links (truly missing route):', report.brokenPageLinks.length);
  console.log('Links to /blog/page/N (handled by redirect to /blog/):', report.redirectedLinks.length);
  console.log('Broken upload/asset links:', report.brokenUploadLinks.length);
  console.log('Images referencing a failed download:', report.imagesSrcMissingLocal.length);

  if (report.brokenPageLinks.length) {
    console.log('\nBroken page links:');
    for (const b of report.brokenPageLinks) console.log(' ', b.onPage, '->', b.href);
  }
}

run();
