// Pictographic figures for individual blog posts: inline SVG and HTML built at render time, so the
// post content files stay plain text. Each post lists its figures with the heading each one follows
// (the figure lands at the end of that section). Figures carry no statistics, so nothing here needs a
// source; they explain a concept visually. Colours come from CSS tokens (app/blog-graphics.css) so
// light and dark mode both work.
import * as cheerio from "cheerio";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const flag = (cc, label) => `<img class="cg-flag" src="/flags/${cc}.svg" width="28" height="21" alt="${esc(label)}" loading="lazy" decoding="async">`;

// Iceberg: the words are the tip, everything else sits under the waterline.
function iceberg() {
  const below = ["Tone and formality", "Humour and idioms", "References and imagery", "Formats and conventions", "Taboos and beliefs"];
  return (
    `<figure class="cg cg-iceberg"><figcaption>What a translation has to carry</figcaption>` +
    `<div class="cg-iceberg__grid">` +
    `<svg class="cg-iceberg__art" viewBox="0 0 280 270" role="img" aria-label="An iceberg: the words are the small tip above the waterline, while tone, humour, references, formats and taboos sit below it.">` +
    `<path class="cg-ice-tip" d="M122 92 L146 36 L158 58 L174 22 L198 92 Z"/>` +
    `<path class="cg-ice-body" d="M62 96 H238 L262 140 L228 196 L180 256 L116 240 L70 192 L34 140 Z"/>` +
    `<path class="cg-ice-wave" d="M0 94 q17 -9 35 0 t35 0 t35 0 t35 0 t35 0 t35 0 t35 0 t35 0 V270 H0 Z"/>` +
    `<path class="cg-ice-line" d="M0 94 q17 -9 35 0 t35 0 t35 0 t35 0 t35 0 t35 0 t35 0 t35 0"/>` +
    `<g class="cg-ice-dots"><circle cx="110" cy="132" r="5"/><circle cx="150" cy="150" r="5"/><circle cx="190" cy="128" r="5"/><circle cx="128" cy="180" r="5"/><circle cx="176" cy="196" r="5"/></g>` +
    `</svg>` +
    `<div class="cg-iceberg__key">` +
    `<div class="cg-key cg-key--top"><span class="cg-key__tag">Above the waterline</span><strong>The words</strong><span>What a literal translation carries.</span></div>` +
    `<div class="cg-key cg-key--deep"><span class="cg-key__tag">Below the waterline</span><ul>${below.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` +
    `</div></div></figure>`
  );
}

// Same word, two meanings: three mini cards with a flag on each side.
function sameWord() {
  const card = (word, a, b) =>
    `<li class="cg-word"><strong class="cg-word__term">${esc(word)}</strong>` +
    `<div class="cg-word__row">${flag(a[0], a[1])}<span class="cg-word__where">${esc(a[1])}</span><span class="cg-word__mean">${esc(a[2])}</span></div>` +
    `<svg class="cg-word__ne" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14M5 15h14M15 5l-6 14"/></svg>` +
    `<div class="cg-word__row">${flag(b[0], b[1])}<span class="cg-word__where">${esc(b[1])}</span><span class="cg-word__mean">${esc(b[2])}</span></div></li>`;
  return (
    `<figure class="cg cg-words"><figcaption>One word, two meanings</figcaption><ul>` +
    card("gosse", ["fr", "France", "a child"], ["ca", "Quebec", "a vulgar term for male anatomy"]) +
    card("pants", ["gb", "UK", "underwear"], ["us", "US", "trousers"]) +
    card("football", ["gb", "UK", "association football"], ["us", "US", "American football"]) +
    `</ul></figure>`
  );
}

// 11/05/2026 read two ways, plus how three countries write the same number.
function formats() {
  const cal = (cc, who, top, big, small) =>
    `<div class="cg-cal"><svg viewBox="0 0 120 120" aria-hidden="true"><rect class="cg-cal__page" x="8" y="14" width="104" height="98" rx="14"/><path class="cg-cal__head" d="M8 28a14 14 0 0 1 14-14h76a14 14 0 0 1 14 14v14H8z"/><rect class="cg-cal__ring" x="32" y="6" width="8" height="18" rx="4"/><rect class="cg-cal__ring" x="80" y="6" width="8" height="18" rx="4"/>` +
    `<text class="cg-cal__top" x="60" y="35" text-anchor="middle">${esc(top)}</text><text class="cg-cal__big" x="60" y="84" text-anchor="middle">${esc(big)}</text><text class="cg-cal__small" x="60" y="102" text-anchor="middle">${esc(small)}</text></svg>` +
    `<span class="cg-cal__who">${flag(cc, who)}${esc(who)} reader</span></div>`;
  const chip = (n, where, ccs) => `<li><span class="cg-num">${esc(n)}</span><span class="cg-num__where">${ccs.map(([c, l]) => flag(c, l)).join("")}<span>${esc(where)}</span></span></li>`;
  return (
    `<figure class="cg cg-formats"><figcaption>The same details, written differently</figcaption>` +
    `<div class="cg-formats__date"><span class="cg-date">11/05/2026</span>` +
    `<div class="cg-formats__cals">${cal("gb", "UK", "MAY", "11", "2026")}<span class="cg-formats__or" aria-hidden="true">or</span>${cal("us", "US", "NOV", "5", "2026")}</div></div>` +
    `<ul class="cg-formats__nums">` +
    chip("1,250.50", "UK and US", [["gb", "UK"], ["us", "US"]]) +
    chip("1.250,50", "Germany and Italy", [["de", "Germany"], ["it", "Italy"]]) +
    chip("1 250,50", "France", [["fr", "France"]]) +
    `</ul></figure>`
  );
}

// How far to adapt: a scale from staying close to the source to staying close to the reader.
function adaptScale() {
  const node = (n, title, what, best) =>
    `<li class="cg-scale__node"><span class="cg-scale__dot" aria-hidden="true">${n}</span><strong>${esc(title)}</strong><span class="cg-scale__what">${esc(what)}</span><span class="cg-scale__best"><b>Best for</b> ${esc(best)}</span></li>`;
  return (
    `<figure class="cg cg-scale"><figcaption>How far to adapt</figcaption>` +
    `<div class="cg-scale__axis" aria-hidden="true"><span>Stays close to the source</span><svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 6h192M184 1l8 5-8 5"/></svg><span>Stays close to the reader</span></div>` +
    `<ol class="cg-scale__nodes">` +
    node(1, "Translation", "Meaning and tone carried across faithfully.", "contracts, manuals and legal papers") +
    node(2, "Localisation", "Dates, units, currency, examples and references fitted to the market.", "websites, apps and online shops") +
    node(3, "Transcreation", "The idea is recreated, not converted, so it lands with the same feeling.", "slogans, campaigns and brand names") +
    `</ol></figure>`
  );
}

// Five-step checklist (same numbered-line look as the .com blog steps).
function checklist() {
  const items = ["Define the market and the audience", "Choose a native translator based in that market", "Brief with tone, purpose and a glossary", "Review the text in context, where readers will see it", "Test with a few local readers before launch"];
  return (
    `<figure class="cg cg-steps"><figcaption>A cultural checklist before you publish</figcaption>` +
    `<ol style="--n:${items.length}">${items.map((x, i) => `<li><span class="cg-steps__n" aria-hidden="true">${i + 1}</span><span>${esc(x)}</span></li>`).join("")}</ol></figure>`
  );
}

const FIGURES = {
  "cultural-understanding-in-translation": [
    { after: /what cultural understanding means/i, html: iceberg },
    { after: /when culture doesn.t translate/i, html: sameWord },
    { after: /what changes from one market/i, html: formats },
    { after: /localisation and transcreation/i, html: adaptScale },
    { after: /how to get cultural understanding right/i, html: checklist },
  ],
};

export function insertGraphics(html, slug) {
  const specs = FIGURES[slug];
  if (!specs) return html;
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  const root = $("#r");
  for (const spec of specs) {
    const h2 = root.find("h2").filter((_, el) => spec.after.test($(el).text())).first();
    if (!h2.length) continue;
    const next = h2.nextAll("h2").first();
    const fig = spec.html();
    if (next.length) next.before(fig);
    else root.append(fig);
  }
  return root.html();
}
