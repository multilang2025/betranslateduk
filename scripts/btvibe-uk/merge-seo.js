// Merges authoritative RankMath SEO data (pulled via AISA get_seo) into each
// scraped page/post JSON: adds focusKeyword + seoRobotsNoindex (not visible
// in public HTML, so never captured by the Phase 1 scraper), and cross-
// checks meta_title/meta_description against what we scraped from the live
// <title>/<meta name=description> tags -- flagging any mismatch as a gap
// rather than silently trusting either source.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'output');
const wpIds = JSON.parse(fs.readFileSync(path.join(__dirname, 'wp-ids.json'), 'utf8'));
const seoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo', 'seo-data.json'), 'utf8'));

function slugToOutPath(entry) {
  const u = new URL(entry.link);
  const p = u.pathname.replace(/^\/|\/$/g, '');
  if (entry.type === 'post') {
    return path.join(ROOT, 'posts', entry.slug + '.json');
  }
  if (p === '') return path.join(ROOT, 'pages', 'index.json');
  return path.join(ROOT, 'pages', p + '.json');
}

const mismatches = [];
let merged = 0;

for (const entry of wpIds) {
  const seo = seoData[String(entry.id)];
  if (!seo) { console.log('NO SEO DATA for', entry.id, entry.slug); continue; }

  const outPath = slugToOutPath(entry);
  if (!fs.existsSync(outPath)) { console.log('NO SCRAPE FILE for', entry.id, entry.slug, outPath); continue; }

  const page = JSON.parse(fs.readFileSync(outPath, 'utf8'));

  // Cross-check: scraped <title>/<meta description> should already match
  // RankMath's stored meta_title/meta_description, since RankMath writes
  // directly into those tags at render time.
  if (page.title && seo.meta_title && page.title.trim() !== seo.meta_title.trim()) {
    mismatches.push({ slug: entry.slug, field: 'title', scraped: page.title, rankmath: seo.meta_title });
  }
  if (page.metaDescription && seo.meta_description && page.metaDescription.trim() !== seo.meta_description.trim()) {
    mismatches.push({ slug: entry.slug, field: 'metaDescription', scraped: page.metaDescription, rankmath: seo.meta_description });
  }

  page.focusKeyword = seo.focus_keyword || '';
  page.seoRobotsNoindex = !!seo.robots_noindex;

  fs.writeFileSync(outPath, JSON.stringify(page, null, 2));
  merged++;
}

console.log('\nMerged SEO data into', merged, 'pages.');
console.log('Title/description mismatches found:', mismatches.length);
if (mismatches.length) {
  fs.writeFileSync(path.join(__dirname, 'seo-mismatches.json'), JSON.stringify(mismatches, null, 2));
  for (const m of mismatches.slice(0, 20)) {
    console.log(' ', m.slug, '[' + m.field + ']');
    console.log('    scraped: ', m.scraped);
    console.log('    rankmath:', m.rankmath);
  }
}
