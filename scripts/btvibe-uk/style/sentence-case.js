// Sentence case for headings (h1 to h6) in the stored content.
// Only Title Case segments are converted (70% or more of the content words
// capitalised), so names and titles such as "Alan Partridge in I'm Alan
// Partridge" are left alone. Acronyms, words with inner capitals, listed
// proper nouns and words the corpus capitalises in running text keep their
// capital. The first word of a sentence keeps it; text after a colon is
// lowercased.
// Meta titles (the `title` field) stay in Title Case per the style guide.
// Usage: node scripts/btvibe-uk/style/sentence-case.js [--write] [--list]
const fs = require('fs');
const cheerio = require('cheerio');
const { listJson, WRITE } = require('./lib');

const files = listJson().map((f) => [f, JSON.parse(fs.readFileSync(f, 'utf8'))]).filter(([, j]) => j.url && j.bodyHtml);

// Corpus statistics from the body text of paragraphs and list items.
const lower = new Map(), upper = new Map(), vocab = new Set();
for (const [, j] of files) {
  const text = j.bodyHtml.replace(/<(h[1-6])[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&');
  for (const line of text.split('\n')) {
    const words = line.match(/[A-Za-z][A-Za-z'’-]*|[.!?:]/g) || [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (/^[.!?:]$/.test(w)) continue;
      const prev = words[i - 1];
      const k = w.toLowerCase();
      if (w === k) vocab.add(k);
      if (i === 0 || /^[.!?:]$/.test(prev)) continue; // sentence start, no capitalisation evidence
      if (w === k) lower.set(k, (lower.get(k) || 0) + 1);
      else if (w[0] === w[0].toUpperCase() && w.slice(1) === w.slice(1).toLowerCase()) upper.set(k, (upper.get(k) || 0) + 1);
    }
  }
}
// Proper nouns that must keep their capital: languages and nationalities,
// UK places, organisations and brands. Anything else that is capitalised
// mid-heading in a Title Case heading is lowercased unless the corpus shows
// it is capitalised in running text.
const PROPER = new Set(('english french german spanish korean dutch italian portuguese british belgian european welsh scottish irish brit brits ' +
  'england britain scotland wales ireland ulster europe asia africa america american canada canadian ' +
  'london manchester birmingham liverpool leeds sheffield bristol newcastle nottingham leicester coventry southampton portsmouth plymouth brighton ' +
  'bournemouth cambridge oxford york bath norwich sunderland edinburgh glasgow cardiff swansea belfast aberdeen bangor londonderry derry southend ' +
  'betranslated google zoom facebook instagram linkedin youtube pinterest brexit christmas monday tuesday wednesday thursday friday saturday sunday ' +
  'asian middle eastern slavic arabic chinese japanese russian polish turkish indian african latin western northern beckham bellingham city faculty institut universit katholieke université ' +
  'dominican republic cabarete sosua costa rica valencia spain spain’s ' +
  'puerto escondido chiang mai bali ubud ' +
  'nhs hmrc gov covid brexit whatsapp skype teams microsoft apple amazon netflix disney').split(' '));
const FORCE_LOWER = new Set(['expansion', 'monolingual', 'keyboard', 'shortcuts', 'reservation', 'shake', 'eccentric']);
const SKIP_PAGES = /\/(british-characters|british-footballers|top-ten-translation-films|translation-schools-belgium|expressions-from-the-it-crowd)\/?$/;
const SMALL = new Set('a an the and or but of in on at to for with by from as vs is are be your you how what why do does can into than that this it its if so nor per via'.split(' '));
const isProperByCorpus = (k) => (upper.get(k) || 0) >= 3 && (lower.get(k) || 0) < 0.2 * ((lower.get(k) || 0) + (upper.get(k) || 0));

const SKIP = [/\(\s*[^)]*\b(19|20)\d\d\s*\)/, /^[\s\d.]*[“"]/, /\b(in|as) (The |A )?[A-Z][a-z]+( [A-Z][a-z’']+)*\s*$/, /Universit|Institut|Faculty|Katholieke|School of Translation|Centre for Translation/];

function fixHeading(inner) {
  const plain = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (/^[•·]/.test(plain)) return inner;
  if (SKIP.some((re) => re.test(plain)) && !/^(How|Why|What)\b/.test(plain)) return inner;
  inner = inner.replace(/Betranslated/g, 'BeTranslated');
  const numeralLead = /^\s*\d+\s+[A-Za-z]/.test(plain);
  const parts = inner.split(/(<[^>]+>)/);
  const toks = []; // {part, start, end, w}
  const stops = []; // per token: separator before it ('start', 'colon', 'stop', '')
  let pending = 'start';
  parts.forEach((p, pi) => {
    if (pi % 2) return;
    const re = /[A-Za-z][A-Za-z'’-]*|[:.!?]/g;
    let m;
    while ((m = re.exec(p))) {
      if (/^[:.!?]$/.test(m[0])) { pending = m[0] === ':' ? 'colon' : 'stop'; continue; }
      toks.push({ pi, start: m.index, end: m.index + m[0].length, w: m[0], lead: pending });
      pending = '';
    }
  });
  // Segments run from a stop (or the start) to the next stop.
  const out = toks.map((t) => t.w);
  let segStart = 0;
  for (let i = 0; i <= toks.length; i++) {
    if (i < toks.length && (i === segStart || !(toks[i].lead === 'stop'))) continue;
    // close segment [segStart, i)
    const seg = toks.slice(segStart, i);
    const base = (w) => w.replace(/[’']s$/, '');
    const elig = seg.map((t, j) => ({ t, j })).filter(({ t, j }) => j > 0 && !SMALL.has(base(t.w).toLowerCase()) && base(t.w).length >= 3 && base(t.w) !== base(t.w).toUpperCase() && !/[a-z][A-Z]/.test(t.w));
    const caps = elig.filter(({ t }) => t.w[0] === t.w[0].toUpperCase());
    const isTitle = (elig.length >= 2 || (elig.length === 1 && seg.length >= 3)) && caps.length >= 0.7 * elig.length;
    seg.forEach((t, j) => {
      const b = base(t.w), tail = t.w.slice(b.length);
      const k = b.toLowerCase();
      const idx = segStart + j;
      if (!isTitle) return;
      if (b === 'A' && (j > 0 || t.lead === 'colon')) { out[idx] = 'a'; return; }
      if (b[0] !== b[0].toUpperCase() || b === b.toUpperCase() || /[a-z][A-Z]/.test(b)) return;
      const afterColon = t.lead === 'colon';
      if (j === 0 && !afterColon && !(segStart === 0 && numeralLead)) return; // sentence start keeps its capital
      if (FORCE_LOWER.has(k)) { out[idx] = k + tail; return; }
      if (PROPER.has(k) || isProperByCorpus(k)) return;
      if (tail === '' && b.includes('-') && b.split('-').some((x) => PROPER.has(x.toLowerCase()))) return;
      out[idx] = (b.includes('-') ? b.split('-').map((x, n) => (n === 0 || PROPER.has(x.toLowerCase()) ? (n === 0 ? x.toLowerCase() : x) : x.toLowerCase())).join('-') : k) + tail;
    });
    segStart = i;
  }
  const byPart = new Map();
  toks.forEach((t, i) => { (byPart.get(t.pi) || byPart.set(t.pi, []).get(t.pi)).push([t, out[i]]); });
  return parts.map((p, pi) => {
    const list = byPart.get(pi);
    if (!list) return p;
    let res = '', pos = 0;
    for (const [t, w] of list) { res += p.slice(pos, t.start) + w; pos = t.end; }
    return res + p.slice(pos);
  }).join('');
}

const FIXES = new Map(Object.entries({
  "Office Address": "Office address",
  "Language Expertise": "Language expertise",
  "Don’t Let a Reservation get Lost in Translation": "Don’t let a reservation get lost in translation",
  "English Is the most common international language": "English is the most common international language",
  "Translation Customers": "Translation customers",
  "Our Locations": "Our locations",
  "Translation Quote": "Translation quote",
  "Wire Transfer": "Wire transfer",
  "Satisfied Customers": "Satisfied customers",
  "Legal Translation": "Legal translation",
  "Medical Translation": "Medical translation",
  "Technical Translation": "Technical translation",
  "Business Translation": "Business translation",
  "Interpretation Services": "Interpretation services",
  "Get Started": "Get started",
  "Document Translations": "Document translations",
  "Legal Proceedings": "Legal proceedings",
  "Patient-Related Documents": "Patient-related documents",
  "Translation Company in England": "Translation company in England",
  "Key Benefits": "Key benefits",
  "Critical Applications": "Critical applications",
  "Technical Reliability": "Technical reliability",
  "7 Note-Taking Hints and Tips in Interpreting": "7 note-taking hints and tips in interpreting",
  "BeTranslated Opens its Doors in France": "BeTranslated opens its doors in France",
  "Following its arrival in Spain and Belgium, BeTranslated Opens its Doors in France": "Following its arrival in Spain and Belgium, BeTranslated opens its doors in France",
  "Network Security": "Network security",
  "Bypass Geo-blocking": "Bypass geo-blocking",
  "Best Universities for Translation Degrees in The UK and Ireland": "Best universities for translation degrees in the UK and Ireland",
  "Best Practices in Healthcare Localisation": "Best practices in healthcare localisation",
  "Thank You!": "Thank you!",
  "Contact Us": "Contact us",
  "Belgium’s languages: Official data": "Belgium’s languages: official data",
  "What are the advantages of dubbing your English-Language content?": "What are the advantages of dubbing your English-language content?",
  "What is international advertising? 3 Benefits and 5 practices": "What is international advertising? 3 benefits and 5 practices",
  "Europe’s Languages": "Europe’s languages",
  "Professional French translation services": "Professional French translation services"
}));
// Exact-text fixes for short headings the Title Case detector cannot see.
function applyFixes(inner) {
  const plain = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  const to = FIXES.get(plain);
  if (!to) return inner;
  const tokens = (x) => x.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  const a = tokens(plain), b = tokens(to);
  let i = 0;
  return inner.split(/(<[^>]+>)/).map((p, n) => (n % 2 ? p : p.replace(/[A-Za-z][A-Za-z'’-]*/g, (w) => { const r = a[i] === w && b[i] ? b[i] : w; i++; return r; }))).join('');
}

// Short labels outside headings (link text, list items, captions): converted
// only when every capitalised word is a listed proper noun or a word the
// corpus uses in lower case, so names and places are never touched.
const isCommonWord = (k) => (lower.get(k) || 0) >= 3 && !isProperByCorpus(k);
const NAMEISH_PHRASES = /Sign Language|Standards Authority|Intellectual Property|Trade Organisation|Government|Heritage|City of Film|Microsoft|Recovery Programme|Oil Capital|Port of|Acuitas|Patent Office|Advertising Standards|Prior Art/;
const NAMEISH = /\b(University|House|Street|Road|Square|Court|Hospital|College|School)\b/;
function fixLabel(text) {
  const lead = text.match(/^\s*/)[0], tail = text.match(/\s*$/)[0], t = text.trim();
  if (NAMEISH_PHRASES.test(t) || /[,(]$/.test(t) || /^[a-z]/.test(t) || t.length < 5 || t.length > 70 || /[.!?]\s+\S/.test(t) || NAMEISH.test(t) || /\d{4,}/.test(t)) return text;
  const words = t.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (words.length < 2) return text;
  const base = (w) => w.replace(/[’']s$/, '');
  const elig = words.slice(1).filter((w) => !SMALL.has(base(w).toLowerCase()) && base(w).length > 2 && base(w) !== base(w).toUpperCase() && !/[a-z][A-Z]/.test(w));
  const caps = elig.filter((w) => /^[A-Z]/.test(w));
  if (!elig.length || caps.length < Math.max(1, 0.6 * elig.length)) return text;
  const fixed = fixHeading(t);
  // every word that would stay capitalised must be a known proper noun, an acronym or the first word
  const left = (fixed.match(/[A-Za-z][A-Za-z'’-]*/g) || []).slice(1).filter((w) => /^[A-Z][a-z]/.test(w) && !PROPER.has(base(w).toLowerCase()));
  if (left.length) return text;
  const unknown = caps.filter((w) => !isCommonWord(base(w).toLowerCase()) && !PROPER.has(base(w).toLowerCase()) && !SMALL.has(base(w).toLowerCase()));
  if (unknown.length) return text;
  return lead + fixed + tail;
}

module.exports = { fixHeading };

if (require.main === module) {
let nFiles = 0, nHeads = 0;
const sample = [];
for (const [f, j] of files) {
  let n = 0;
  const next = j.bodyHtml.replace(/(<h([1-6])\b[^>]*>)([\s\S]*?)(<\/h\2>)/gi, (all, open, lvl, inner, close) => {
    const out = SKIP_PAGES.test(j.url.trim()) ? inner : applyFixes(fixHeading(inner));
    if (out !== inner) { n++; if (sample.length < 400) sample.push([inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), out.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()]); }
    return open + out + close;
  });
  let labels = 0;
  let next2 = next;
  if (!SKIP_PAGES.test(j.url.trim())) {
    const $ = cheerio.load(`<div id="root">${next}</div>`, null, false);
    // Only elements that are a whole label: short text, and no other text in the parent block.
    $('#root').find('a, li, p, td, th, strong, b, span, em, summary, button, figcaption').each((_, el) => {
      if (el.children.some((c) => c.type === 'tag' && !/^(strong|b|em|span|br)$/.test(c.name))) return;
      const own = $(el).text().replace(/\s+/g, ' ').trim();
      if (!own || own.length > 70) return;
      const block = $(el).closest('li, p, td, th, div');
      const blockText = block.length ? block.text().replace(/\s+/g, ' ').trim() : own;
      const isLead = /^(strong|b)$/.test(el.name) && own.length <= 60;
      if (!isLead && blockText.length > own.length + 6) return;
      if ($(el).closest('h1,h2,h3,h4,h5,h6').length) return;
      $(el).contents().each((__, c) => {
        if (c.type !== 'text') return;
        const o = fixLabel(c.data);
        if (o !== c.data) { c.data = o; labels++; if (sample.length < 2000) sample.push(['L: ' + c.data.trim(), o.trim()]); }
      });
    });
    if (labels) next2 = $('#root').html();
  }
  if (labels) n += labels;
  if (n) { nFiles++; nHeads += n; if (WRITE) { j.bodyHtml = next2; fs.writeFileSync(f, JSON.stringify(j, null, 2)); } }
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${nHeads} headings in ${nFiles} files`);
if (process.argv.includes('--list')) {
  const seen = new Set();
  for (const [a, b] of sample) if (!seen.has(a)) { seen.add(a); console.log(a + '\n   -> ' + b); }
}

}
