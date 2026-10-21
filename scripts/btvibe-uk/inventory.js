// Builds data/inventory.csv: one row per URL with the page-level SEO fields
// (migration doc section 4). Sources: the stored content for the 171 live
// sitemap pages, the Search Console query file in scripts/btvibe-uk/seo, and
// an optional Ahrefs crawl CSV for URLs that are not in the sitemap.
// Usage: node scripts/btvibe-uk/inventory.js [path/to/ahrefs-crawl.csv]
const fs = require('fs');
const path = require('path');
const { listJson } = require('./style/lib');

const gsc = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo', 'gsc-top-queries-2026-10-18.json'), 'utf8')).pages;
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const esc = (v) => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const cols = ['url_path', 'source', 'type', 'http_status', 'indexable', 'title', 'title_chars', 'meta_description', 'description_chars', 'h1', 'h1_count', 'focus_keyword', 'canonical', 'word_count', 'internal_links_out', 'external_links_out', 'images', 'images_missing_alt', 'has_faq', 'gsc_top_query', 'gsc_impressions', 'gsc_clicks', 'gsc_avg_position'];
const rows = [];
const seen = new Set();
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.url || !j.bodyHtml) continue;
  const p = new URL(j.url.trim()).pathname;
  seen.add(p);
  const h = j.bodyHtml;
  const hrefs = [...h.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]);
  const imgs = [...h.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const q = (gsc[p] || [])[0] || {};
  const type = p === '/' ? 'home' : p.startsWith('/blog/') ? 'post' : p.split('/')[1];
  rows.push({
    url_path: p, source: 'repo (sitemap)', type, http_status: 200, indexable: j.seoRobotsNoindex ? 'no' : 'yes',
    title: j.title, title_chars: (j.title || '').length, meta_description: j.metaDescription, description_chars: (j.metaDescription || '').length,
    h1: h1s[0] || '', h1_count: h1s.length, focus_keyword: j.focusKeyword || '', canonical: j.canonical || j.url.trim(),
    word_count: strip(h).split(' ').filter(Boolean).length,
    internal_links_out: hrefs.filter((x) => x.startsWith('/')).length, external_links_out: hrefs.filter((x) => /^https?:/.test(x)).length,
    images: imgs.length, images_missing_alt: imgs.filter((t) => !/\balt="[^"]+"/i.test(t)).length,
    has_faq: /<h[23][^>]*>[^<]*(frequently asked|faq)/i.test(h) ? 'yes' : 'no',
    gsc_top_query: q.k || '', gsc_impressions: q.i ?? '', gsc_clicks: q.c ?? '', gsc_avg_position: q.p ?? '',
  });
}
// Optional Ahrefs crawl: add every crawled URL that is not already in the list.
const crawl = process.argv[2];
if (crawl && fs.existsSync(crawl)) {
  const lines = fs.readFileSync(crawl, 'utf8').split(/\r?\n/).filter(Boolean);
  const parse = (l) => { const out = []; let cur = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; };
  const head = parse(lines[0]).map((x) => x.toLowerCase());
  const idx = (re) => head.findIndex((x) => re.test(x));
  const iUrl = idx(/^url$|^page url/), iCode = idx(/http|status/), iIdx = idx(/index|compliant/), iTitle = idx(/^title/), iDesc = idx(/meta desc|description/), iH1 = idx(/^h1/), iCan = idx(/canonical/);
  for (const l of lines.slice(1)) {
    const c = parse(l);
    let u; try { u = new URL(c[iUrl]); } catch { continue; }
    const p = u.pathname + (u.search || '');
    if (seen.has(p)) continue;
    seen.add(p);
    rows.push({ url_path: p, source: 'ahrefs crawl only', type: 'other', http_status: c[iCode] || '', indexable: c[iIdx] || '', title: c[iTitle] || '', title_chars: (c[iTitle] || '').length, meta_description: c[iDesc] || '', description_chars: (c[iDesc] || '').length, h1: c[iH1] || '', canonical: c[iCan] || '' });
  }
}
rows.sort((a, b) => a.url_path.localeCompare(b.url_path));
fs.mkdirSync(path.join(__dirname, '..', '..', 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'inventory.csv'), [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n');
console.log(`data/inventory.csv: ${rows.length} rows (${rows.filter((r) => r.source.startsWith('repo')).length} from the repo)`);
