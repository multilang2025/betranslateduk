// Mechanical QA fixes from the style guide checklist:
//  - remove <hr> and unwrap <section> in body content
//  - demote a second <h1> to <h2>
//  - unlink links that point to the page itself (text is kept)
// Usage: node scripts/btvibe-uk/style/qa-fixes.js [--write]
const fs = require('fs');
const { listJson, WRITE } = require('./lib');
let n = { hr: 0, section: 0, h1: 0, self: 0 };
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.url || !j.bodyHtml) continue;
  const here = new URL(j.url.trim()).pathname;
  let h = j.bodyHtml;
  h = h.replace(/<hr\b[^>]*\/?>/gi, () => { n.hr++; return ''; });
  h = h.replace(/<\/?section\b[^>]*>/gi, () => { n.section++; return ''; });
  let seen = 0;
  h = h.replace(/<(\/?)h1\b/gi, (m, slash) => { if (!slash) seen++; if (seen > 1) { if (!slash) n.h1++; return `<${slash}h2`; } return m; });
  h = h.replace(/<a\b[^>]*\bhref="([^"#]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, inner) => {
    const p = href.replace(/^https?:\/\/(www\.)?betranslated\.co\.uk/i, '');
    if (p && p.startsWith('/') && p.replace(/\/?$/, '/') === here) { n.self++; return inner; }
    return m;
  });
  if (h !== j.bodyHtml && WRITE) { j.bodyHtml = h; fs.writeFileSync(f, JSON.stringify(j, null, 2)); }
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}:`, n);
