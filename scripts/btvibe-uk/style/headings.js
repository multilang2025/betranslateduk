// Batches 3 and 4: sentence-case the shared service-block headings,
// remove numbering from the M&A and patents headings, and fix the
// banned phrases ("this guide", "Twitter").
// Heading ids (anchors) are left untouched so in-page links keep working.
// Blog-card titles, footer headings, listicle posts and the numbered
// clauses in the terms page are deliberately out of scope.
// Usage: node scripts/btvibe-uk/style/headings.js [--write]
const { run, WRITE } = require('./lib');

const HEADINGS = {
  'Professional Translation Services': 'Professional translation services',
  'Website Translation Services': 'Website translation services',
  'Business & Finance Translation Services': 'Business & finance translation services',
  'High Tech & IT Translation Services': 'High tech & IT translation services',
  'Industry & Construction Translation Services': 'Industry & construction translation services',
  'Marketing & Sales Translation Services': 'Marketing & sales translation services',
  'Travel & Tourism Translation Services': 'Travel & tourism translation services',
  'Legal Translation Services': 'Legal translation services',
  'Translation of Professional Documents': 'Translation of professional documents',
  'Professional Document Translation Solutions': 'Professional document translation solutions',
  'Industry Expertise': 'Industry expertise',
  'Translation Services for Optical Practices': 'Translation services for optical practices',
  // Numbered headings (M&A and patents pages)
  'Legal Document Translation': 'Legal document translation',
  'Financial Statement Translation': 'Financial statement translation',
  'Due Diligence Reports': 'Due diligence reports',
  'Cross-Border Communication': 'Cross-border communication',
  'Accurate, Industry-Specific Expertise': 'Accurate, industry-specific expertise',
  'Compliance with International Regulations': 'Compliance with international regulations',
  'Patent Translation Services': 'Patent translation services',
  'Confidentiality Guaranteed': 'Confidentiality guaranteed',
  'Maintaining Legal Precision': 'Maintaining legal precision',
  'Trademark Translation Services': 'Trademark translation services',
  'Global Reach': 'Global reach',
};
const NUMBERED_PAGES = /merger-and-acquisition|patents-and-trademarks/;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/&/g, '(?:&|&amp;|&#038;)');

const PHRASES = [
  [/through Twitter, Facebook/g, 'through X, Facebook'],
  [/such as Twitter, Instagram/g, 'such as X, Instagram'],
  [/this guide will equip businesses with the knowledge and tools needed to work through UK visa sponsorship\./g,
    'you will find the knowledge and tools you need to work through UK visa sponsorship.'],
  [/In this guide, we will share the most important factors to be considered when hiring a reliable translation service/g,
    'Here are the most important factors to consider when you hire a reliable translation service'],
];

// Heading pass runs on the raw html of each page (needs the tag context),
// so it is applied through a wrapper rather than the text-node callback.
const fs = require('fs');
const path = require('path');
const { listJson, OUT } = require('./lib');
const HRE = /(<h[2-6]\b[^>]*>)((?:\s|<\/?strong>)*)(?:\d+\.\s*)?((?:\s|<\/?strong>)*)([^<]*?)((?:\s|<\/?strong>)*<\/h[2-6]>)/gi;

const headingReport = [];
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.bodyHtml) continue;
  const numbered = NUMBERED_PAGES.test(j.url || '');
  let n = 0;
  const next = j.bodyHtml.replace(HRE, (all, open, pre, pre2, text, close) => {
    const decoded = text.replace(/&amp;|&#038;/g, '&').replace(/&nbsp;/g, ' ').trim();
    const key = decoded.replace(/\s*[^\x00-\x7F\u2019]+\s*$/, '').trim();
    const hadNumber = /^<h[2-6][^>]*>(?:\s|<\/?strong>)*\d+\.\s/i.test(all);
    if (hadNumber && !numbered) return all;
    if (!HEADINGS[key]) return all;
    if (hadNumber && !numbered) return all;
    const rest = decoded.slice(key.length);
    const out = open + pre + pre2 + HEADINGS[key].replace(/&/g, '&amp;') + rest + close;
    if (out !== all) n++;
    return out;
  });
  if (n) { j.bodyHtml = next; headingReport.push([path.relative(OUT, f), n]); if (WRITE) fs.writeFileSync(f, JSON.stringify(j, null, 2)); }
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: headings changed in ${headingReport.length} files (${headingReport.reduce((a, r) => a + r[1], 0)} headings)`);

const rep = run((t) => PHRASES.reduce((s, [re, to]) => s.replace(re, to), t), { dry: !WRITE });
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: phrase fixes in ${rep.length} files (${rep.reduce((a, r) => a + r.changes.length, 0)} text changes)`);
