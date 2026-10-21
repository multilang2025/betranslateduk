// Removes legacy WordPress/Divi code from the stored content:
//  - page chrome outside #main-content (header, nav, footer, search form)
//  - head scripts/styles/stylesheets and other WP-only fields
//  - comments, scripts, styles, svg, iframes and form controls
//  - classes except the few the renderer keys on, data-* attributes, inline
//    styles (except on divs, which the renderer's widget detection reads),
//    ids except on headings and the Rank Math FAQ block, microdata, srcset
// Internal URLs are localised the same way lib/content.js does at read time.
// Usage: node scripts/btvibe-uk/style/clean-wp.js [--write]
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { listJson, OUT, WRITE } = require('./lib');

const DROP_FIELDS = ['bodyClass', 'headScripts', 'headInlineStyles', 'headStylesheets', 'htmlLang', 'needsBrowserRender', 'seoRobotsNoindex', 'links'];
const REMOVE = '.dipi_breadcrumbs,.dipi-breadcrumbs,[class*=dipi-breadcrumb],[itemtype*=BreadcrumbList],script,style,noscript,svg,iframe,video,audio,form,input,select,textarea,.et_parallax_bg_wrap,.et_parallax_bg';
const KEEP_CLASS = /^(rank-math|wp-block-rank-math|dipi-faq|dipi_table_of_content$|dipi-toc|dipi_button_grid_child$|dipi_button_grid__button$|et_pb_button$|et_pb_code(_inner)?$|et-pb-icon$|cta-row$|sec__more$|bt-btn)/;
const KEEP_ATTR = new Set(['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan', 'data-icon']);
const OLD_HOST = /^(?:https?:)?\/\/(?:www\.)?betranslated\.co\.uk/i;
const local = (u) => {
  if (!u || !OLD_HOST.test(u)) return u;
  const rest = u.replace(OLD_HOST, '') || '/';
  return rest.startsWith('/wp-content/uploads/') ? '/images' + rest : rest;
};

function clean(html) {
  const $0 = cheerio.load(html);
  const main = $0('#main-content');
  const scoped = main.length ? main.html() || html : html;
  const $ = cheerio.load(`<div id="root">${scoped}</div>`, null, false);
  $('#root').find('*').contents().filter((_, n) => n.type === 'comment').remove();
  $('#root').contents().filter((_, n) => n.type === 'comment').remove();
  $(REMOVE).remove();
  $('#root *').each((_, el) => {
    const a = el.attribs || {};
    if (el.name === 'img' && a['data-src']) a.src = a['data-src'];
    for (const name of Object.keys(a)) {
      const v = a[name];
      let keep = KEEP_ATTR.has(name);
      if (name === 'class') {
        const cls = v.split(/\s+/).filter((c) => KEEP_CLASS.test(c));
        if (cls.length) a.class = cls.join(' '); else delete a.class;
        continue;
      }
      if (name === 'id') keep = /^h[1-6]$/.test(el.name) || /^rank-math-faq$/.test(v);
      if (name === 'style') keep = el.name === 'div';
      if (!keep) delete a[name];
    }
    if (a.href) a.href = local(a.href);
    if (a.src) a.src = local(a.src);
  });
  return $('#root').html().replace(/\n\s*\n\s*\n+/g, '\n\n').trim();
}

let before = 0, after = 0, files = 0;
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.url || !j.bodyHtml) continue;
  before += Buffer.byteLength(JSON.stringify(j));
  j.bodyHtml = clean(j.bodyHtml);
  for (const k of DROP_FIELDS) delete j[k];
  if (j.og && j.og.image) j.og.image = local(j.og.image);
  if (Array.isArray(j.images)) j.images = j.images.map((i) => ({ ...i, src: local(i.src) }));
  const out = JSON.stringify(j, null, 2);
  after += Buffer.byteLength(out);
  files++;
  if (WRITE) fs.writeFileSync(f, out);
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${files} files, ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
