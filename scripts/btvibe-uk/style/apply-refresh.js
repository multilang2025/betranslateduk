// Validates and applies refreshed blog posts (blog audit, October 2026).
// Usage: node scripts/btvibe-uk/style/apply-refresh.js <staging-dir> [--write]
// Reads NN-<slug>.body.html + NN-<slug>.meta.json from the staging dir, runs the
// house-style gate, and (with --write) updates the post JSON. Posts that fail
// the gate are reported and left untouched.
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];
const WRITE = process.argv.includes('--write');
const OUT = path.join(__dirname, '..', 'output');
const live = new Set(fs.readFileSync(path.join(dir, '..', 'live-urls.txt'), 'utf8').split('\n').filter(Boolean));
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const count = (s, re) => (s.match(re) || []).length;
// Authoritative sources a rewrite may add (government, universities, EU institutions).
const AUTH = /(^|\.)(gov\.uk|ons\.gov\.uk|ac\.uk|edu|europa\.eu|dcu\.ie|tcd\.ie)$/i;
// Slugs whose rewrite may drop inline images (reviewed by hand): ALLOW_IMG_DROP=slug1,slug2
const IMG_OK = new Set((process.env.ALLOW_IMG_DROP || '').split(',').filter(Boolean));
const SMALL = /^(a|an|the|and|or|but|of|in|on|to|for|vs|with|at|by|from)$/i;

const jobs = fs.readdirSync(dir).filter((f) => f.endsWith('.meta.json')).sort();
let ok = 0, bad = 0;
for (const mf of jobs) {
  const base = mf.replace('.meta.json', '');
  const slug = base.replace(/^\d+-/, '');
  const bodyF = path.join(dir, base + '.body.html');
  const errs = [];
  if (!fs.existsSync(bodyF)) { console.log(`FAIL ${base}: no body.html`); bad++; continue; }
  const meta = JSON.parse(fs.readFileSync(path.join(dir, mf), 'utf8'));
  const body = fs.readFileSync(bodyF, 'utf8');
  const src = fs.readFileSync(path.join(dir, base + '.src.html'), 'utf8');
  const text = strip(body);
  const all = body + ' ' + JSON.stringify(meta);

  if (/[–—]/.test(all)) errs.push('dash (en or em)');
  if (/&[mn]dash;|&#8211;|&#8212;/.test(body)) errs.push('dash entity');
  if (/!/.test(text.replace(/!=/g, ''))) errs.push('exclamation mark');
  if (/\b(the importance of|this guide|break(ing)? (down )?language barriers|24\/48)/i.test(text)) errs.push('banned phrase');
  if (/(^|[.?!]\s)By [a-z]+ing\b/.test(text)) errs.push('"By" + gerund opener');
  if (/FAQPage|application\/ld\+json|<script|\sstyle=/i.test(body)) errs.push('schema/script/inline style');
  if (!/\btitle\b/.test(Object.keys(meta).join(' '))) errs.push('meta: no title');
  if ((meta.title || '').length >= 60 || !meta.title) errs.push(`title ${(meta.title || '').length} chars`);
  const md = (meta.metaDescription || '').length;
  if (md < 130 || md > 160) errs.push(`meta description ${md} chars`);
  if (!meta.focusKeyword) errs.push('no focus keyword');

  // structure parity: same wrapper divs and the same images
  if (count(body, /<div\b/g) !== count(src, /<div\b/g) || count(body, /<\/div>/g) !== count(src, /<\/div>/g)) errs.push('div structure changed');
  const imgs = (s) => (s.match(/<img\b[^>]*>/g) || []).join('|');
  if (imgs(body) !== imgs(src) && !(IMG_OK.has(slug) && (src.match(/<img\b[^>]*>/g) || []).filter((t) => !body.includes(t)).length <= 2 && (body.match(/<img\b[^>]*>/g) || []).every((t) => src.includes(t)))) errs.push('images changed');

  // headings: sentence case, no numbering, one h1
  if (count(body, /<h1\b/g) !== 1) errs.push('h1 count ' + count(body, /<h1\b/g));
  for (const m of body.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const t = strip(m[2]);
    if (/^\d+[.)]\s/.test(t)) errs.push('numbered heading: ' + t);
    const w = t.split(' ').slice(1).filter((x) => /^[A-Z][a-z]+$/.test(x) && !SMALL.test(x));
    if (w.length >= 2 && w.length === t.split(' ').slice(1).filter((x) => /^[A-Za-z]/.test(x)).length) errs.push('title-case heading: ' + t);
  }
  // the runtime turns two or more consecutive question H2s into a second FAQ block
  { let run = 0; for (const m of body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)) { const t = strip(m[1]); if (/\?$/.test(t) && !/frequently/i.test(t)) { if (++run === 2) errs.push('consecutive question H2s: ' + t); } else run = 0; } }
  // FAQ: five h3 questions after the FAQ h2
  const fi = body.search(/<h2[^>]*>\s*(frequently asked|faq)/i);
  if (fi < 0) errs.push('no FAQ h2');
  else {
    const faq = body.slice(fi);
    const qs = [...faq.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => strip(m[1]));
    if (qs.length !== 5) errs.push('FAQ count ' + qs.length);
    qs.forEach((q) => { if (!q.endsWith('?') || q.length > 90) errs.push('FAQ question: ' + q); });
  }
  // links: internal must be live, no self link; outbound only if already in source
  const self = `/blog/${slug}/`;
  const srcOut = new Set([...src.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]));
  for (const m of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const h = m[1];
    if (h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
    if (/^https?:/.test(h)) {
      const u = new URL(h);
      if (/betranslated\.(co\.uk|com)$/.test(u.hostname.replace(/^www\./, ''))) { const p = u.pathname; if (p === self) errs.push('self link'); else if (!live.has(p) && u.hostname.endsWith('co.uk')) errs.push('dead internal: ' + p); }
      else if (!srcOut.has(h) && !AUTH.test(u.hostname)) errs.push('new outbound link: ' + h);
    } else {
      const p = h.split('#')[0].split('?')[0];
      if (p === self) errs.push('self link');
      else if (!live.has(p) && !p.startsWith('/images/') && !p.startsWith('/blog/category/')) errs.push('dead internal: ' + p);
    }
  }
  const wordsAfter = text.split(' ').length, wordsBefore = strip(src).split(' ').length;
  if (wordsAfter < wordsBefore * 0.8) errs.push(`shorter: ${wordsBefore} -> ${wordsAfter} words`);

  if (errs.length) { bad++; console.log(`FAIL ${base} (${wordsBefore} -> ${wordsAfter} words)\n   ${[...new Set(errs)].join('\n   ')}`); continue; }
  ok++;
  console.log(`ok   ${base} (${wordsBefore} -> ${wordsAfter} words)`);
  if (WRITE) {
    const f = path.join(OUT, 'posts', slug + '.json');
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    j.title = meta.title; j.metaDescription = meta.metaDescription; j.focusKeyword = meta.focusKeyword;
    j.bodyHtml = body;
    // bodyText = original lead-in (title, date, tags) + the new article text, one block per line
    const blocks = (h) => [...h.matchAll(/<(p|h[1-6]|li)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => strip(m[2])).filter(Boolean);
    const first = blocks(src).find((t) => t.length > 40);
    const at = first ? j.bodyText.indexOf(first.slice(0, 40)) : -1;
    j.bodyText = (at > 0 ? j.bodyText.slice(0, at) : '') + blocks(body).join('\n');
    if (j.og) { j.og = { ...j.og, title: meta.title, description: meta.metaDescription }; }
    fs.writeFileSync(f, JSON.stringify(j, null, 2));
  }
}
console.log(`\n${ok} passed, ${bad} failed${WRITE ? ' (passed posts written)' : ' (dry run)'}`);
