import * as cheerio from "cheerio";

// Blog post body upgrades that need the raw WordPress markup: the legacy
// quote box becomes a branded CTA card and Rank Math FAQ blocks become an
// accordion. Both are swapped for placeholders before sanitizeBody (which
// strips classes and styles) and restored afterwards with restoreBlocks.

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const clean = (t) => String(t).replace(EMOJI, "").replace(/\s+/g, " ").trim();
const token = (i) => `<p>@@BLOCK${i}@@</p>`;

function ctaCard($, box) {
  let head = clean(box.find("h2,h3,h4").first().text()) || clean(box.find("strong").first().text());
  const quote = box.find('a[href*="presupuesto"]').first();
  const tel = box.find('a[href^="tel:"]').first();
  const mail = box.find('a[href^="mailto:"]').first();
  let paras = box.find("p").toArray().filter((p) => !$(p).find('a[href*="presupuesto"],a[href^="tel:"],a[href^="mailto:"]').length && clean($(p).text()).length > 20).map((p) => $(p).html().replace(/\s+/g, " ").replace(EMOJI, "").trim());
  // No heading: a leading question becomes the title; a reply-time line the note.
  if (!head && paras.length && /\?\s*$/.test(clean(cheerio.load(paras[0]).text()))) head = clean(cheerio.load(paras.shift()).text());
  const noteAt = paras.findIndex((p) => /respond|8 horas|8 h|24 horas|24 h|reply|répond/i.test(p));
  const note = noteAt >= 0 ? paras.splice(noteAt, 1)[0] : "";
  // A box with no title or text is a leftover button row: the CTA card above
  // or the CTA band at the end of the post already covers it.
  if (!head && !paras.length) return "";
  const label = clean(quote.text()) || "Pide presupuesto";
  const ico = (d) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const PHONE = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";
  const MAIL = "M4 6h16v12H4zM4 7l8 6 8-6";
  return `<aside class="post-cta">
    <div class="post-cta__text">${head ? `<h3>${esc(head)}</h3>` : ""}${paras.map((p) => `<p>${p}</p>`).join("")}${note ? `<p class="post-cta__note">${note.replace(/\.?\s*$/, ".")}</p>` : ""}</div>
    <div class="post-cta__actions">
      <a class="bt-btn bt-btn--primary" href="/presupuesto-traduccion/">${esc(label)}</a>
      ${tel.length ? `<a class="post-cta__contact" href="${esc(tel.attr("href"))}">${ico(PHONE)}${esc(clean(tel.text()))}</a>` : ""}
      ${mail.length ? `<a class="post-cta__contact" href="${esc(mail.attr("href"))}">${ico(MAIL)}${esc(clean(mail.text()))}</a>` : ""}
    </div>
  </aside>`;
}

// The FAQPage structured data is not emitted here: lib/schema.js reads the
// questions back from the rendered accordion (faqFromHtml), one FAQPage per page.
export function faqBlock(items, title) {
  if (!items.length) return "";
  return `${title ? `<h2>${esc(title)}</h2>` : ""}<div class="faq post-faq">${items
    .map((i) => `<details class="faq__item"><summary>${esc(i.q)}</summary><div class="faq__a">${i.a}</div></details>`)
    .join("")}</div>`;
}

// Answer HTML limited to simple inline/block tags.
function answerHtml($, nodes) {
  const frag = cheerio.load("<div id=a></div>", null, false);
  nodes.forEach((n) => frag("#a").append($.html(n)));
  frag("#a *").each((_, el) => {
    const keep = el.tagName === "a" ? ["href"] : [];
    for (const k of Object.keys(el.attribs)) if (!keep.includes(k)) frag(el).removeAttr(k);
  });
  frag("#a div,#a span").each((_, el) => frag(el).replaceWith(frag(el).contents()));
  return frag("#a").html().replace(/\s+/g, " ").trim();
}

// "<p><strong>¿Pregunta?</strong><br>Respuesta</p>": question and answer in one
// paragraph. Returns { q, html } or null.
function inlineQA($, n) {
  if (!n.is("p")) return null;
  const first = n.contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first();
  if (!first.is("strong,b")) return null;
  const q = clean(first.text());
  if (!/\?$/.test(q)) return null;
  const rest = n.clone();
  rest.contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first().remove();
  while (rest.contents().first().is("br") || (rest.contents().first()[0]?.type === "text" && !rest.contents().first().text().trim())) rest.contents().first().remove();
  const body = rest.html()?.trim();
  if (!body || !clean(rest.text())) return null;
  return { q, nodes: [], html: `<p>${body}</p>` };
}

export function extractBlocks(raw) {
  if (!raw) return { html: raw, blocks: [] };
  const $ = cheerio.load(`<div id="root">${raw}</div>`, null, false);
  const blocks = [];
  // Divi Pixel TOC module: replaced by our own TOC (its heading would otherwise
  // be picked up as the CTA card title).
  $("#root .dipi_table_of_content, #root .dipi-toc").remove();

  // Legacy quote box: the smallest container holding both a quote link and a phone link.
  $('#root a[href^="tel:"]').each((_, a) => {
    let box = $(a).parent();
    while (box.length && box.attr("id") !== "root" && !(box.is("div,section,aside") && box.find('a[href*="presupuesto"]').length)) box = box.parent();
    if (!box.length || box.attr("id") === "root" || box.data("bt-done") || clean(box.text()).length > 900) return;
    box.data("bt-done", 1);
    blocks.push(ctaCard($, box));
    box.replaceWith(token(blocks.length - 1));
  });

  // Rank Math FAQ block.
  $("#root .rank-math-block, #root #rank-math-faq, #root .wp-block-rank-math-faq-block").each((_, el) => {
    const node = $(el);
    if (!node.closest("#root").length || node.parents(".rank-math-block, .wp-block-rank-math-faq-block").length) return;
    const items = node.find(".rank-math-list-item, .rank-math-faq-item").toArray().map((it) => ({
      q: clean($(it).find(".rank-math-question").text()),
      a: answerHtml($, $(it).find(".rank-math-answer").contents().toArray()),
    })).filter((i) => i.q && i.a);
    if (!items.length) return;
    // Keep the section heading that usually precedes the block.
    blocks.push(faqBlock(items, ""));
    node.replaceWith(token(blocks.length - 1));
  });

  // Q&A sections become collapsible FAQs (with FAQPage JSON-LD):
  //  - a "Preguntas frecuentes" H2/H3 followed by questions, or
  //  - any H2 section whose subheadings are (mostly) questions, e.g. interviews.
  // A question is a lower-level heading, or a paragraph that is only bold text
  // ending in "?". The section heading itself is kept.
  const FAQ_TITLE = /preguntas frecuentes|\bfaq\b|frequently asked|questions fr[ée]quentes/i;
  const isQ = (n, lvl) => n.is(lvl === 2 ? "h3,h4" : "h4") ||
    (n.is("p") && n.children("strong,b").length && clean(n.children("strong,b").text()) === clean(n.text()) && /\?$/.test(clean(n.text())));
  $("#root h2, #root h3").each((_, h) => {
    const head = $(h);
    if (!head.closest("#root").length) return;
    const lvl = h.tagName === "h2" ? 2 : 3;
    const faqTitle = FAQ_TITLE.test(head.text());
    if (lvl === 3 && !faqTitle) return;
    const stop = lvl === 2 ? "h2" : "h2,h3";
    const items = [];
    let cur = null;
    const used = [];
    let n = head.next();
    while (n.length && !n.is(stop) && !n.text().includes("@@BLOCK")) {
      const inline = inlineQA($, n);
      const boxed = n.is("div") ? n.children("h3,h4").first() : null;
      if (inline) { cur = null; items.push(inline); used.push(n); }
      else if (boxed && boxed.length && n.children().length > 1) {
        // <div><h3>¿…?</h3><div>answer</div></div>
        items.push({ q: clean(boxed.text()), nodes: n.children().not(boxed).toArray() }); cur = null; used.push(n);
      }
      else if (n.is("div") && n.children("div").length && n.children("div").toArray().every((c) => $(c).children("h3,h4").length)) {
        // Wrapper around several boxed items.
        n.children("div").each((_, c) => { const q = $(c).children("h3,h4").first(); items.push({ q: clean(q.text()), nodes: $(c).children().not(q).toArray() }); });
        cur = null; used.push(n);
      }
      else if (isQ(n, lvl)) { cur = { q: clean(n.text()), nodes: [] }; items.push(cur); used.push(n); }
      else if (cur && n.is("p,ul,ol,blockquote")) { cur.nodes.push(n[0]); used.push(n); }
      else if (!cur && n.is("p") && !clean(n.text())) { used.push(n); }
      else if (!cur && !faqTitle && n.is("p,ul,ol")) { /* intro text before the first question stays */ n = n.next(); continue; }
      else break;
      n = n.next();
    }
    const ready = items.filter((i) => i.q && (i.html || i.nodes.length)).map((i) => ({ q: i.q, a: i.html || answerHtml($, i.nodes) }));
    if (ready.length < 2) return;
    if (!faqTitle) {
      // Only when the section really is Q&A: at least 75% of its items are questions.
      const asked = ready.filter((i) => /\?$/.test(i.q)).length;
      if (asked < 2 || asked / ready.length < 0.75) return;
    }
    blocks.push(faqBlock(ready, ""));
    const first = used.find((u) => isQ(u, lvl)) || used[0];
    used.forEach((u) => (u === first ? u.replaceWith(token(blocks.length - 1)) : u.remove()));
  });

  return { html: $("#root").html(), blocks };
}

// Legacy post chrome that the new post hero already shows: the date line, the
// category link and the featured image (shrunk into a chip by the sanitizer)
// at the top of the body, plus the Divi Pixel TOC heading ("i 3 Tabla de
// contenidos": its icon-font glyphs leak as text). Our own TOC replaces it.
const TOC_TITLE = /^(?:i\s*3\s*)?(tabla de contenidos?|[íi]ndice|table of contents|contents|table des mati[èe]res|sommaire)$/i;
const DATE_LINE = /^(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{1,2} de [a-záéíóú]+ de \d{4}|[a-z]+ \d{1,2}, \d{4}|\d{1,2} [a-zéû]+ \d{4})$/i;
// "<a>Cat A</a> | <a>Cat B</a>": only category links and separators.
function isCategoryLine($, n) {
  const links = n.children("a").toArray();
  if (!links.length || !links.every((a) => /\/(category|categoria|categorie)\//.test($(a).attr("href") || ""))) return false;
  const rest = n.clone(); rest.children("a").remove();
  return !clean(rest.text()).replace(/[|,·/]/g, "").trim();
}

export function stripPostChrome(html) {
  if (!html) return { html, prev: null, next: null };
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  $("#r h2, #r h3").each((_, h) => { if (TOC_TITLE.test(clean($(h).text()))) $(h).remove(); });
  // Legacy "← Entrada anterior / Entrada siguiente →" line: lifted out so the
  // page can render it as proper cards with the post titles.
  const nav = {};
  $('#r a[rel="prev"], #r a[rel="next"]').each((_, a) => { nav[$(a).attr("rel")] = $(a).attr("href"); });
  $('#r a[rel="prev"], #r a[rel="next"]').closest("p,div").remove();
  for (const el of $("#r").children().toArray()) {
    const n = $(el);
    const text = clean(n.text());
    const lead =
      (n.is("p") && !text && !n.find("img").length) ||
      (n.is("p") && DATE_LINE.test(text)) ||
      (n.is("p") && isCategoryLine($, n)) ||
      (n.is("p.logo-chip") || (n.is("p,figure") && n.find("img").length && !text));
    if (!lead) break;
    n.remove();
  }
  return { html: $("#r").html(), prev: nav.prev || null, next: nav.next || null };
}

// The blocks skip sanitizeBody, so their links to the site (legacy absolute
// URLs, www or not) are made root-relative here.
const localLinks = (h) => h.replace(/href="https?:\/\/(?:www\.)?betranslated\.es(?=[/"?#])\/?/gi, 'href="/');

// Translator profiles (Divi row: photo, H5 name, H6 role, bio paragraph per column) become one card grid.
// The cards are held back as blocks so the sanitiser does not flatten them.
export function extractTranslators(raw, blocks = []) {
  if (!raw || !/<h5>[^<]*<\/h5>\s*<h6>/.test(raw)) return { html: raw, blocks };
  const $ = cheerio.load(`<div id="root">${raw}</div>`, null, false);
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const withRole = (root) => root.find("h5").filter((__, h) => $(h).next().is("h6"));
  $("#root h5").each((_, el) => {
    const h5 = $(el);
    if (!h5.closest("#root").length || !h5.next().is("h6")) return;
    // The smallest ancestor that holds two or more profiles is the row.
    let scope = h5.parent();
    while (scope.length && !scope.is("#root") && withRole(scope).length < 2) scope = scope.parent();
    if (!scope.length || scope.is("#root")) return;
    const people = [];
    withRole(scope).each((__, h) => {
      const name = $(h);
      const role = name.next("h6");
      // The column is the largest ancestor (below the row) that holds only this profile.
      let col = name.parent();
      while (col.parent().length && !col.parent().is(scope) && withRole(col.parent()).length === 1) col = col.parent();
      const img = col.find("img").first();
      const bio = role.nextAll("p").first();
      people.push({ name: name.text().trim(), role: role.text().trim(), bio: bio.html() || "", src: img.attr("src") || "", w: img.attr("width") || "150", h: img.attr("height") || "150" });
    });
    const cards = people.map((x) => `<article class="trans">${x.src ? `<img src="${esc(x.src)}" alt="${esc(x.name)}" width="${esc(x.w)}" height="${esc(x.h)}" loading="lazy">` : ""}<h5>${esc(x.name)}</h5><p class="trans__role">${esc(x.role)}</p>${x.bio ? `<p class="trans__bio">${x.bio}</p>` : ""}</article>`).join("");
    blocks.push(`<div class="trans-grid">${cards}</div>`);
    scope.replaceWith(token(blocks.length - 1));
  });
  return { html: $("#root").html(), blocks };
}

export function restoreBlocks(html, blocks) {
  if (!blocks.length) return html;
  return html.replace(/<p>\s*@@BLOCK(\d+)@@\s*<\/p>|@@BLOCK(\d+)@@/g, (_, a, b) => localLinks(blocks[Number(a ?? b)] || ""));
}

// Gives every H2 an id and returns the table of contents.
export function withToc(html) {
  const toc = [];
  const seen = new Set();
  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (m, attrs = "", inner) => {
    const text = clean(inner.replace(/<[^>]+>/g, ""));
    if (!text) return m;
    let id = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "seccion";
    while (seen.has(id)) id += "-2";
    seen.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}"${attrs.replace(/\sid="[^"]*"/, "")}>${inner}</h2>`;
  });
  return { html: out, toc };
}

// Tables: wrapped for horizontal scroll and labelled per cell so they can
// stack as cards on phones. The first column reads as the row header.
// Labels in a table's first column that name a document or field with its
// own page link to it (first match per URL per table). Order matters.
const J = "/servicios/traduccion-jurada/";
const TABLE_LINKS = [
  [/\b(acta|partida|certificado) de nacimiento/i, J + "partida-de-nacimiento/"],
  [/\b(certificado|acta) de matrimonio/i, J + "certificado-de-matrimonio/"],
  [/antecedentes penales/i, J + "antecedentes-penales/"],
  [/libro de familia/i, J + "libro-de-familia/"],
  [/permiso de residencia|tarjeta de residencia|\bTIE\b/i, J + "permiso-de-residencia/"],
  [/expediente(s)? acad[eé]mico/i, J + "expedientes-academicos/"],
  [/t[ií]tulo(s)? universitario|diploma/i, J + "titulos-universitarios/"],
  [/certificado(s)? de notas/i, J + "certificados-de-notas/"],
  [/escritura(s)? p[uú]blica/i, J + "escrituras-publicas/"],
  [/sentencia|demanda/i, J + "demandas-y-sentencias/"],
  [/cuentas anuales/i, J + "cuentas-anuales/"],
  [/registro mercantil/i, J + "certificados-del-registro-mercantil/"],
  [/apostill/i, J + "documentos-apostillados/"],
  [/acta de defunci[oó]n|certificado de defunci[oó]n/i, J + "acta-de-defuncion/"],
  [/testamento/i, J + "testamentos/"],
  [/poder(es)? notarial|acta(s)? notarial/i, J + "actas-notariales/"],
  [/informe(s)? m[eé]dico|historial(es)? cl[ií]nico/i, "/servicios/traduccion-medica/"],
  [/prospecto/i, "/servicios/traduccion-medica/prospectos-farmaceuticos/"],
  [/consentimiento(s)? informado/i, "/servicios/traduccion-medica/consentimientos-informados/"],
  [/declaraci[oó]n(es)? de (la renta|impuestos)|extracto(s)? bancario|n[oó]mina/i, "/servicios/traduccion-financiera/"],
  [/contrato/i, "/servicios/traduccion-legal/contratos/"],
  [/estatutos/i, "/servicios/traduccion-legal/estatutos-de-empresa/"],
  [/patente/i, J + "patentes-y-marcas/"],
];
function linkTableLabels($, table, here) {
  const used = new Set();
  table.find("tr").each((_, tr) => {
    const td = $(tr).children("td").first();
    if (!td.length || td.find("a").length) return;
    const text = td.text().trim();
    if (!text || text.length > 80) return;
    const hit = TABLE_LINKS.find(([re, url]) => re.test(text) && !used.has(url) && url !== here);
    if (!hit) return;
    used.add(hit[1]);
    td.html(`<a href="${hit[1]}">${td.html()}</a>`);
  });
}

export function enhanceTables(html, here = "") {
  if (!/<table/i.test(html)) return html;
  const $ = cheerio.load(`<div id="t">${html}</div>`, null, false);
  $("#t table").each((_, t) => {
    const table = $(t);
    linkTableLabels($, table, here);
    let heads = table.find("thead th").toArray().map((th) => clean($(th).text()));
    if (!heads.length) {
      // No <thead>: promote a first row made only of <th> cells.
      const first = table.find("tr").first();
      if (first.children("th").length && !first.children("td").length) heads = first.children("th").toArray().map((th) => clean($(th).text()));
    }
    table.find("tbody tr, tr").each((__, tr) => {
      $(tr).children("td").each((i, td) => {
        if (heads[i]) $(td).attr("data-label", heads[i]);
      });
    });
    // "Sí / No" answers become small pills (the rest of the cell stays as text).
    table.find("td").each((__, td) => {
      const c = $(td);
      if (c.children().length) return;
      // Only a real answer: the whole cell, or "Sí, …" / "No (…)". "No pierdes…"
      // or "Si hay…" are sentences, not answers.
      const m = c.text().trim().match(/^(Sí|Si|No|Yes)(?:$|[,.:]\s*|\s+(?=\())(.*)$/);
      if (!m) return;
      const yes = !/^No$/.test(m[1]);
      c.html(`<span class="tbl-pill tbl-pill--${yes ? "yes" : "no"}">${m[1]}</span>${m[2] ? ` <span class="tbl-note">${m[2].replace(/</g, "&lt;")}</span>` : ""}`);
    });
    table.addClass(heads.length ? "post-table" : "post-table post-table--plain");
    table.wrap('<div class="table-wrap"></div>');
  });
  return $("#t").html();
}
