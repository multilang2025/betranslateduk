// Batch 1: remove em and en dashes from visible text (house style).
// Usage: node scripts/btvibe-uk/style/dashes.js [--write]
const { run, WRITE } = require('./lib');

const D = '[\\u2013\\u2014\\u2012\\u2015]';
const ENT = /&(?:#8211|#8212|#x2013|#x2014|ndash|mdash);/g;

function fix(t, field) {
  if (!new RegExp(D).test(t) && !ENT.test(t)) return t;
  ENT.lastIndex = 0;
  t = t.replace(ENT, (m) => (/8212|x2014|mdash/.test(m) ? '—' : '–'));
  // Bullet markers at the start of a node or line
  t = t.replace(new RegExp(`(^|\\n)(\\s*)${D}\\s*`, 'g'), '$1$2');
  // Numeric ranges
  t = t.replace(new RegExp(`(\\d)\\s*${D}\\s*(\\d)`, 'g'), '$1 to $2');
  if (field === 'title' || field === 'og.title') {
    return t.replace(new RegExp(`\\s*${D}\\s*`, 'g'), ' - ');
  }
  // After a comma or colon, drop the dash. Otherwise make it a comma.
  t = t.replace(new RegExp(`([,:;])\\s*${D}\\s*`, 'g'), '$1 ');
  t = t.replace(new RegExp(`\\s*${D}\\s*`, 'g'), ', ');
  return t;
}

const report = run(fix, { dry: !WRITE });
const total = report.reduce((a, r) => a + r.changes.length, 0);
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${report.length} files, ${total} text changes`);
if (!WRITE) {
  const seen = new Set();
  for (const r of report) for (const [a, b] of r.changes.slice(0, 2)) {
    const i = a.search(/[–—]|&#82|&[nm]dash/);
    if (i < 0 || seen.size > 25) continue;
    const j = b.indexOf(',', Math.max(0, i - 40));
    seen.add(`${r.file}\n  - ${a.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}\n  + ${b.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}`);
  }
  console.log([...seen].join('\n'));
}
