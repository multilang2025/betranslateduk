// Batch 2: American to British spelling in visible text.
// Explicit word list (reviewed against the corpus), not a pattern, so
// "por favor", "colour vs color" and CSS never get touched.
// Usage: node scripts/btvibe-uk/style/spelling.js [--write]
const { run, WRITE } = require('./lib');

const MAP = {
  centers: 'centres', fulfill: 'fulfil', prioritize: 'prioritise',
  synchronization: 'synchronisation', globalization: 'globalisation',
  localization: 'localisation', realized: 'realised', notarized: 'notarised',
  mischaracterizations: 'mischaracterisations', centralize: 'centralise',
  humanization: 'humanisation', licenses: 'licences', license: 'licence',
  judgment: 'judgement', skillful: 'skilful', program: 'programme',
  programs: 'programmes',
};
const RE = new RegExp(`\\b(${Object.keys(MAP).join('|')})\\b`, 'gi');

function fix(t, field) {
  if (field === 'bodyText') field = 'body';
  // Keep the comparison "colour vs color" and the Spanish "por favor" intact.
  return t.replace(RE, (m, _w, off) => {
    const out = MAP[m.toLowerCase()];
    if (m === m.toUpperCase() && m.length > 1) return out.toUpperCase();
    return m[0] === m[0].toUpperCase() ? out[0].toUpperCase() + out.slice(1) : out;
  });
}

const report = run(fix, { dry: !WRITE });
const total = report.reduce((a, r) => a + r.changes.length, 0);
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${report.length} files, ${total} text changes`);
