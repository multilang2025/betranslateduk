// Writes the reviewed focus keywords (one per page, lowercase) into the
// content JSON. Input: a JSON array of { path, fk } produced from the Search
// Console review; see reports/focus-keywords-2026-10-21.csv for the rationale.
// Usage: node scripts/btvibe-uk/style/focus-keywords.js <focus-keywords.json> [--write]
const fs = require('fs');
const { listJson, WRITE } = require('./lib');
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const byPath = new Map(rows.map((r) => [r.path, r.fk]));
let changed = 0, missing = [];
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.url) continue;
  const p = new URL(j.url.trim()).pathname;
  if (!byPath.has(p)) { missing.push(p); continue; }
  if (j.focusKeyword !== byPath.get(p)) {
    changed++;
    j.focusKeyword = byPath.get(p);
    if (WRITE) fs.writeFileSync(f, JSON.stringify(j, null, 2));
  }
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${changed} focus keywords changed; pages without a mapping: ${missing.join(', ') || 'none'}`);
