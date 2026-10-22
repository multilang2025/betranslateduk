// Blog audit, 22 October 2026: merge and retire answers.
// Usage: node scripts/btvibe-uk/style/retire-posts.js [--write]
// - moves each merged/retired post to output/retired-posts/ (content kept)
// - writes data/blog-redirects.json (301s, read by next.config.mjs)
// - rewrites internal links to a merged post to its target; links to a
//   retired post are unlinked (text kept); never leaves a self-link.
const fs = require('fs');
const path = require('path');
const { listJson, OUT } = require('./lib');

const WRITE = process.argv.includes('--write');
const ROOT = path.join(__dirname, '..', '..', '..');
const RULES = fs.readFileSync(path.join(__dirname, 'retire-posts.txt'), 'utf8').trim().split('\n').map((l) => {
  const [action, slug, target] = l.trim().split(/\s+/);
  return { action, slug, from: `/blog/${slug}/`, target };
});
const byFrom = new Map(RULES.map((r) => [r.from, r]));
const retiring = new Set(RULES.map((r) => path.join(OUT, 'posts', r.slug + '.json')));

const pathOf = (u) => { try { return new URL(u, 'https://www.betranslated.co.uk').pathname; } catch { return u; } };
const ANCHOR = /<a\b([^>]*?)href=(["'])([^"']*)\2([^>]*)>([\s\S]*?)<\/a>/gi;

let files = 0, links = 0;
for (const f of listJson()) {
  if (retiring.has(f) || f.includes(`${path.sep}retired-posts${path.sep}`)) continue;
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (typeof data.bodyHtml !== 'string') continue;
  const self = pathOf(data.url || '');
  let n = 0;
  const html = data.bodyHtml.replace(ANCHOR, (m, a, q, href, b, text) => {
    const p = pathOf(href);
    const r = byFrom.get(p.endsWith('/') ? p : p + '/');
    if (!r) return m;
    n++;
    if (r.action === 'retire' || r.target === self) return text;
    return `<a ${a.trim()}${a.trim() ? ' ' : ''}href=${q}${r.target}${q}${b}>${text}</a>`.replace('<a  ', '<a ');
  });
  if (n) { files++; links += n; if (WRITE) fs.writeFileSync(f, JSON.stringify({ ...data, bodyHtml: html }, null, 2)); }
}

if (WRITE) {
  const dest = path.join(OUT, 'retired-posts');
  fs.mkdirSync(dest, { recursive: true });
  for (const r of RULES) {
    const src = path.join(OUT, 'posts', r.slug + '.json');
    if (fs.existsSync(src)) fs.renameSync(src, path.join(dest, r.slug + '.json'));
  }
  fs.writeFileSync(path.join(ROOT, 'data', 'blog-redirects.json'),
    JSON.stringify(RULES.map((r) => ({ source: r.from, destination: r.target, action: r.action })), null, 2));
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${links} links in ${files} files, ${RULES.length} posts ${WRITE ? 'moved' : 'to move'}`);
