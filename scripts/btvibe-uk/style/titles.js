// Sentence case for page titles that appear as text elsewhere in the content
// (related post lists, previous and next post links, cards). The meta title
// field itself is not touched. Source of titles: every page's meta title and
// the H1 as it was before the sentence-case pass (git commit given as argv[2]).
// Usage: node scripts/btvibe-uk/style/titles.js <commit> [--write]
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { listJson, OUT, WRITE } = require('./lib');
const sc = require('./sentence-case');

const commit = process.argv[2];
const titles = new Set();
const clean = (t) => String(t || '').replace(/\s*[|·]\s*BeTranslated.*$/i, '').replace(/\s+/g, ' ').trim();
const h1Of = (html) => { const m = (html || '').match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i); return m ? m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : ''; };
const files = listJson().filter((f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')).url; } catch { return false; } });
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  titles.add(clean(j.title));
  try {
    const old = JSON.parse(execSync(`git show ${commit}:${path.relative(process.cwd(), f)}`, { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString());
    titles.add(h1Of(old.bodyHtml));
  } catch { /* new file */ }
  titles.add(h1Of(j.bodyHtml));
}
titles.delete('');
const map = new Map();
for (const t of titles) { const n = sc.fixHeading(t); if (n !== t) map.set(t, n); }
let changed = 0;
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const parts = j.bodyHtml.split(/(<[^>]+>)/);
  let n = 0;
  const out = parts.map((p, i) => {
    if (i % 2) return p;
    const [, lead, core, tail] = p.match(/^((?:\s|&nbsp;)*)([\s\S]*?)((?:\s|&nbsp;)*)$/);
    const t = core.replace(/&amp;/g, '&').trim();
    const to = map.get(t);
    if (!to) return p;
    n++;
    return lead + to.replace(/&/g, '&amp;') + tail;
  });
  if (n) { changed += n; if (WRITE) { j.bodyHtml = out.join(''); fs.writeFileSync(f, JSON.stringify(j, null, 2)); } }
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${changed} title texts in ${map.size} known titles`);
