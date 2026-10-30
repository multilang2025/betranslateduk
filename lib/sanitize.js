import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";

let dims;
function imageDims() {
  if (!dims) {
    try {
      dims = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "image-dims.json"), "utf8"));
    } catch {
      dims = {};
    }
  }
  return dims;
}

// UK content has no language-pair-tile widget (ES-only feature): the call
// site below already falls back to a plain pill list when this returns "".
function langTilesHtml() {
  return "";
}

// Turns scraped Divi/WordPress markup (nested et_pb_* wrappers, inline
// animation hooks, duplicate light/dark icon pairs) into flat, semantic HTML
// that the .prose styles in content.css can lay out. The scrape is this
// project's own content, so the output is safe to inject.

const BLOCK = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "blockquote",
  "table", "thead", "tbody", "tr", "th", "td", "figure", "figcaption", "hr", "div",
]);
const KEEP = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "img",
  "strong", "b", "em", "i", "blockquote", "br", "hr", "table", "thead",
  "tbody", "tr", "th", "td", "figure", "figcaption", "sup", "sub", "cite",
]);
// .et-pb-icon: Divi/ET icon-font glyphs (e.g. blurb bullet icons). The scrape
// kept the private-use-area character but not the ETmodules font, so without
// this it renders as a stray ASCII fallback letter ("w") or a tofu box.
// .et_parallax_bg(_wrap): Divi's decorative section-background layers
// (dot/wave/texture SVGs set as an empty div's background-image, sized and
// positioned by Divi's own CSS, which this rebuild doesn't carry over) --
// this site's scrape (unlike BTvibe-es's) still has them; without this they
// render as oversized empty blocks in the content flow.
const REMOVE = "script,style,noscript,form,svg,input,button,select,textarea,iframe,video,audio,nav,.dipi_breadcrumbs,.dipi-breadcrumbs,[class*=dipi-breadcrumb],[itemtype*=BreadcrumbList],.et_pb_code,.et-pb-icon,.et_parallax_bg_wrap,.et_parallax_bg";
const ATTRS = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
  ul: ["data-k"],
};

// Shared with lib/featured-images.js so "real photo" vs. "decorative icon"
// is judged the same way the page body itself is rendered.
export function isDecorativeImageSrc(src) {
  if (!src || src.startsWith("data:") || /_white|\.betranslated\.com/i.test(src)) return true;
  if (/\.svg(\?|$)/i.test(src) || /icon_\d+/i.test(src)) return true;
  return false;
}

// Links to betranslated.es stay as they are. (This helper was copied from the Spanish site, where it
// turned its own absolute links into local paths. Here it made valid links to the Spanish site's
// pages, such as its sworn translation pages, point at UK paths that do not exist.)
function localHref(href) {
  return href;
}

export function sanitizeBody(html, { dropImageChips = false, timelineLists = false } = {}) {
  const $ = cheerio.load(`<div id="root">${html || ""}</div>`, null, false);
  const root = $("#root");

  // Broken WordPress markup: a heading that swallowed the paragraphs after it
  // (<h2>Title<p>…</p><p>…</p></h2>) renders the whole section as a heading.
  // The heading keeps its own text; everything from the first block on moves
  // out after it. An inline link right before a paragraph that starts
  // mid-sentence ("<a>Le Point</a><p> es una revista…") opens that paragraph.
  root.find("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const kids = [...el.children];
    const idx = kids.findIndex((n) => n.type === "tag" && /^(p|ul|ol|div|table|blockquote|figure|h[1-6])$/.test(n.name));
    if (idx < 0) return;
    const rest = kids.slice(idx);
    const firstP = rest.find((n) => n.type === "tag" && n.name === "p" && $(n).text().trim());
    const last = kids.slice(0, idx).reverse().find((n) => !(n.type === "text" && !n.data.trim()));
    if (firstP && last && last.type === "tag" && /^\s*[a-záéíóúñ,;:.]/.test($(firstP).text())) $(firstP).prepend(last);
    $(el).after(rest);
    rest.forEach((n) => { if (n.type === "tag" && n.name === "p" && !$(n).text().trim() && !$(n).find("img").length) $(n).remove(); });
  });

  // Hand-built stat grids (a box of cells, each a big figure plus a short label,
  // laid out with inline styles that are stripped below) become the stat row.
  root.find("div").each((_, el) => {
    const cells = $(el).children("div").toArray();
    if (cells.length < 2 || $(el).children().length !== cells.length) return;
    const pairs = cells.map((c) => {
      const k = $(c).children().toArray();
      if (k.length !== 2) return null;
      const num = $(k[0]).text().replace(/\s+/g, " ").trim(), label = $(k[1]).text().replace(/\s+/g, " ").trim();
      return num.length <= 10 && /\d/.test(num) && label && label.length <= 90 ? [num, label] : null;
    });
    if (pairs.some((x) => !x)) return;
    const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    $(el).replaceWith(`<ul data-k="stats">${pairs.map(([n, l]) => `<li><strong>${esc(n)}</strong><span>${esc(l)}</span></li>`).join("")}</ul>`);
  });
  // Hand-built card grids (a box of 3+ short cells, each an icon span plus a
  // label span, laid out with inline styles that are stripped below) become a
  // bullet list; without it each label renders as a loose paragraph.
  root.find("div").each((_, el) => {
    const cells = $(el).children("div").toArray();
    if (cells.length < 3 || $(el).children().length !== cells.length) return;
    const ok = cells.every((c) => {
      const k = $(c).children().toArray();
      return k.length && k.length <= 2 && k.every((x) => x.name === "span" && !$(x).children().not("strong, em, b, i, a").length) && $(c).text().trim().length <= 110;
    });
    if (!ok) return;
    const items = cells.map((c) => $(c).children("span").toArray().filter((s) => $(s).text().replace(/[\s✓✔→•]/g, "")).map((s) => $(s).html().replace(/^\s*[✓✔→•]\s*/, "").trim()).join(" ")).filter(Boolean);
    $(el).replaceWith(`<ul>${items.map((t) => `<li>${t}</li>`).join("")}</ul>`);
  });
  // List items that start with their own marker ("→ ", "✓ ") get the list's bullet only.
  root.find("li").each((_, el) => {
    const first = el.children && el.children[0];
    if (first && first.type === "text") first.data = first.data.replace(/^\s*[→✓✔►▶•]\s*/, "");
  });

  // Divi FAQ module (accordion): each entry becomes an H3 question followed by
  // its answer, so the FAQ pass can rebuild the dropdown. The open/closed icon
  // glyphs (<i>) are icon-font codes and must not leak into the text.
  root.find(".dipi-faq-entry").each((_, el) => {
    const d = $(el);
    const title = d.find(".dipi-faq-title").first();
    title.find("i").remove();
    const q = title.text().replace(/\s+/g, " ").trim();
    const a = d.find(".dipi-faq-content").first().html() || "";
    if (q && a.trim()) d.replaceWith(`<h3>${q.replace(/</g, "&lt;")}</h3>${a}`);
  });

  // Native <details> Q&A would be unwrapped to bare text below: keep the
  // question as an H3 so the FAQ pass can rebuild the dropdown.
  root.find("details").each((_, el) => {
    const d = $(el);
    const sum = d.children("summary").first();
    if (!sum.length) return;
    const q = sum.text().replace(/\s+/g, " ").trim();
    sum.remove();
    d.replaceWith(`<h3>${q.replace(/</g, "&lt;")}</h3>${d.html() || ""}`);
  });

  // Divi "code" modules are usually embeds, but some only carry plain
  // paragraphs and images (e.g. the MOVES III funding notice): keep those.
  root.find(".et_pb_code").each((_, el) => {
    const node = $(el);
    const hasContent = node.find("p,img").length > 0;
    const hasEmbed = node.find("script,style,iframe,form,video,audio,svg").length > 0;
    if (hasContent && !hasEmbed) node.replaceWith(node.find(".et_pb_code_inner").html() || node.html());
  });

  root.find(REMOVE).remove();

  // Inline-styled legacy widgets (no Divi classes) would be flattened into
  // run-on text below: link rows become pills, numbered step bubbles an <ol>
  // (the timeline pass picks it up), and card grids H3 + text cards.
  const txt = (n) => n.text().replace(/\s+/g, " ").trim();
  // Inline "¿Necesitas …?" contact boxes (phone, WhatsApp, quote button)
  // duplicate the CTA band every page ends with, and promise reply times.
  root.find("div[style]").toArray().filter((el) => {
    const d = $(el);
    const hrefs = d.find("a").toArray().map((a) => $(a).attr("href") || "");
    return !d.find("h2,h3,ul,ol,table").length && txt(d).length < 500 && hrefs.length && hrefs.every((h) => /^(tel:|mailto:)|wa\.me|presupuesto/i.test(h));
  }).forEach((el) => { if (!$(el).parents("div[style]").filter((_, p) => $(p).data("cta-drop")).length) $(el).data("cta-drop", 1); });
  root.find("div[style]").filter((_, el) => $(el).data("cta-drop")).remove();
  // Unrendered WordPress shortcodes ("Última actualización: [bt_last_modified]").
  root.find("p").filter((_, el) => /\[[a-z_]+\]/.test($(el).text())).remove();
  root.find('div[style*="display:grid"]').each((_, el) => {
    const cards = $(el).children("div").toArray();
    if (cards.length < 2 || cards.length !== $(el).children().length) return;
    const html = cards.map((c) => {
      const ps = $(c).children("p").toArray().map((p) => $(p)).filter((p) => txt(p));
      if (!ps.length) return "";
      const a = ps[0].find("a").first();
      const head = a.length ? `<a href="${a.attr("href")}">${txt(a)}</a>` : txt(ps[0]);
      return `<h3>${head}</h3>${ps.slice(1).map((p) => `<p>${p.html()}</p>`).join("")}`;
    }).join("");
    if (html) $(el).replaceWith(html);
  });
  root.find('div[style*="flex-direction:column"]').each((_, el) => {
    const steps = $(el).children("div").toArray().map((s) => {
      const kids = $(s).children("div").toArray().map((k) => $(k));
      if (!kids.some((k) => /^\d{1,2}$/.test(txt(k)))) return null;
      const body = kids.filter((k) => !/^\d{1,2}$/.test(txt(k)) && txt(k));
      if (!body.length) return null;
      const ps = body[0].children("p").toArray().map((p) => $(p));
      const strong = ps[0] && ps[0].children("strong,b").length === 1 && txt(ps[0]) === txt(ps[0].children("strong,b")) ? txt(ps[0]) : "";
      const rest = (strong ? ps.slice(1) : ps).map((p) => p.html()).join(" ") || body[0].html();
      return `<li>${strong ? `<strong>${strong}</strong> ` : ""}${rest}</li>`;
    });
    if (steps.length >= 2 && steps.every(Boolean)) $(el).replaceWith(`<ol>${steps.join("")}</ol>`);
  });
  // Stat rows: boxes of "2002" + "Año de fundación" (3+) -> a stat strip.
  const isNum = (t) => t.length <= 8 && /^[+]?[\d.,]+\s?(\+|%|h)?$/i.test(t);
  root.find("div").toArray().reverse().forEach((el) => {
    const boxes = $(el).children().toArray();
    if (boxes.length < 3 || !boxes.every((b) => b.tagName === "div" && $(b).children("p").length === 2 && $(b).children().length === 2 && isNum(txt($(b).children("p").first())))) return;
    $(el).replaceWith(`<ul data-k="stats">${boxes.map((b) => `<li><strong>${txt($(b).children("p").first())}</strong><span>${txt($(b).children("p").last())}</span></li>`).join("")}</ul>`);
  });
  // Language boxes: "EN" + "Inglés" (3+), optionally ending with "+40 Idiomas"
  // -> the language tiles (linked to the pair page when one exists).
  const PAIR = new Set(["ingles", "frances", "aleman", "italiano", "portugues", "arabe", "neerlandes", "rumano"]);
  const fold = (x) => x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  root.find("div").toArray().reverse().forEach((el) => {
    const boxes = $(el).children().toArray();
    const pairsOf = boxes.map((b) => { const k = $(b).children("div"); return b.tagName === "div" && k.length === 2 && $(b).children().length === 2 ? [txt(k.first()), txt(k.last())] : null; });
    if (boxes.length < 3 || pairsOf.some((p) => !p)) return;
    const langs = pairsOf.filter(([code]) => /^[A-Z]{2,3}$/.test(code));
    if (langs.length < 3 || langs.length < pairsOf.length - 1) return;
    const links = langs.map(([, name]) => [name, PAIR.has(fold(name)) ? `/traduccion/espanol-${fold(name)}/` : ""]);
    if (pairsOf.length > langs.length) links.push(["Más idiomas", "/traduccion/"]);
    // Emitted as a pill row: the post-flatten pass turns it into the tiles.
    $(el).replaceWith(`<ul data-k="pills">${links.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("")}</ul>`);
  });
  const sitePath = (h) => h || "";
  // A paragraph of nothing but links separated by <br> (3+): a link list, not
  // a stack of bare links. Language pairs become the language tiles.
  root.find("p").each((_, el) => {
    const kids = $(el).contents().toArray().filter((c) => !(c.type === "text" && !c.data.trim()));
    const links = kids.filter((c) => c.tagName === "a");
    if (links.length < 3 || !kids.every((c) => c.tagName === "a" || c.tagName === "br")) return;
    $(el).replaceWith(`<ul data-k="pills">${links.map((a) => `<li><a href="${sitePath($(a).attr("href"))}">${txt($(a))}</a></li>`).join("")}</ul>`);
  });
  root.find('div[style*="flex-wrap:wrap"]').each((_, el) => {
    const kids = $(el).children().toArray().filter((k) => k.tagName !== "br");
    if (kids.length < 2 || !kids.every((k) => k.tagName === "a")) return;
    $(el).replaceWith(`<ul data-k="pills">${kids.map((k) => `<li><a href="${sitePath($(k).attr("href"))}">${txt($(k))}</a></li>`).join("")}</ul>`);
  });

  // Light/dark icon pairs ship both; keep one. Drop images that are hidden
  // duplicates from the .com domain or "_white" variants.
  root.find("img").each((_, el) => {
    const img = $(el);
    const src = img.attr("src") || img.attr("data-src") || img.attr("data-lazy-src") || "";
    if (isDecorativeImageSrc(src)) {
      img.remove(); // hidden dupes/icon-font glyphs: layout noise outside the original Divi CSS
      return;
    }
    img.attr("src", src);
    // Unsized images shift the page when they load: size them from tools/image-dims.mjs.
    if (!img.attr("width") || !img.attr("height")) {
      const dim = imageDims()[src];
      if (dim) img.attr("width", String(dim[0])).attr("height", String(dim[1]));
    }
  });

  // Remember CTA buttons before class attributes are stripped.
  root.find("a.et_pb_button, a.dipi_button_grid_child, a.dipi_button_grid__button").each((_, el) => {
    $(el).attr("data-btn", "1");
  });

  // Deepest elements first so wrappers see already-cleaned children.
  const all = root.find("*").get().reverse();
  for (const el of all) {
    const node = $(el);
    const tag = el.tagName.toLowerCase();
    if (KEEP.has(tag)) continue;

    if (tag === "div") {
      const hasBlockChild = node.children().toArray().some((c) => BLOCK.has(c.tagName.toLowerCase()));
      if (hasBlockChild) {
        // Loose text and inline runs next to blocks ("El <a>turismo</a> es …<p></p>")
        // become paragraphs, or they would vanish between the sections.
        const runs = [];
        let run = [];
        const close = () => { if (run.length) runs.push(run); run = []; };
        node.contents().toArray().forEach((c) => {
          if (c.type === "tag" && BLOCK.has(c.tagName.toLowerCase())) close();
          else if (c.type === "text" || c.type === "tag") run.push(c);
        });
        close();
        runs.forEach((r) => {
          const text = r.map((c) => $(c).text()).join("").trim();
          if (!text) return;
          $(r[0]).before(`<p>${r.map((c) => $.html(c)).join("")}</p>`);
          r.forEach((c) => $(c).remove());
        });
        node.replaceWith(node.contents());
      } else if (node.text().trim() || node.find("img,a").length) {
        node.replaceWith(`<p>${node.html()}</p>`);
      } else {
        node.remove();
      }
    } else {
      node.replaceWith(node.contents());
    }
  }

  root.find("*").each((_, el) => {
    const node = $(el);
    const tag = el.tagName.toLowerCase();
    const allowed = ATTRS[tag] || [];
    const isBtn = node.attr("data-btn") === "1";
    const isIcon = node.attr("data-icon") === "1";
    for (const name of Object.keys(el.attribs)) {
      if (!allowed.includes(name)) node.removeAttr(name);
    }
    if (tag === "a") {
      node.attr("href", localHref(node.attr("href")));
      if (isBtn) node.attr("class", "bt-btn bt-btn--primary");
      if (/^https?:\/\//i.test(node.attr("href") || "")) {
        // External links open in a new window.
        node.attr("target", "_blank");
        node.attr("rel", "noopener noreferrer");
      }
    }
    if (tag === "img") {
      node.attr("loading", "lazy");
      node.attr("decoding", "async");
      if (isIcon) node.attr("class", "icon");
    }
  });

  // Legacy Divi button rows (Mike, 2026-10-20): a "quote" button right after text
  // that already links to the quote page is a duplicate and goes; a "watch our
  // video" button becomes a quiet play link instead of a second orange CTA.
  const QUOTE = /\/(presupuesto-traduccion|fr\/devis-de-traduction|en\/translation-quote)\/?$/;
  root.find("a.bt-btn").each((_, el) => {
    const a = $(el);
    const href = a.attr("href") || "";
    if (/youtube\.com\/watch|youtu\.be\//.test(href)) { a.attr("class", "bt-video"); return; }
    if (!QUOTE.test(href)) return;
    // Climb through wrappers that hold only buttons/links (the Divi grid) until
    // one has text before it; that text decides whether the button repeats it.
    const linkText = (n) => n.find("a").toArray().map((x) => $(x).text()).join("").replace(/\s+/g, "");
    let block = a, prev = $();
    for (let n = a; n.length && !n.is("#root"); n = n.parent()) {
      if (n.text().replace(/\s+/g, "") !== (n.is("a") ? n.text().replace(/\s+/g, "") : linkText(n))) break;
      block = n;
      prev = n.prevAll().filter((__, s) => $(s).text().trim()).first();
      if (prev.length) break;
    }
    const prevLinks = prev.is("a") ? prev.toArray() : prev.find("a").toArray();
    if (prevLinks.some((x) => QUOTE.test($(x).attr("href") || ""))) a.remove();
  });

  // Empty blocks and paragraphs holding nothing but whitespace.
  root.find("p,li,h1,h2,h3,h4,h5,h6,blockquote").each((_, el) => {
    const n = $(el);
    if (!n.text().trim() && !n.find("img").length) n.remove();
  });
  // Paragraphs that wrap only a single logo/partner image (e.g. "Clientes
  // satisfechos" carousels): give them a chip so a light or white-background
  // source logo stays legible regardless of the page background.
  root.find("p").each((_, el) => {
    const n = $(el);
    const kids = n.contents().toArray().filter((c) => c.type !== "text" || c.data.trim());
    if (kids.length === 1 && kids[0].type === "tag" && kids[0].tagName === "img") {
      // Outside blog posts, single-image paragraphs are legacy decoration
      // (stock photos, portraits, icons): drop them unless they are logos.
      const img = $(kids[0]);
      if (dropImageChips && !/logo/i.test((img.attr("src") || "") + " " + (img.attr("alt") || ""))) { n.remove(); return; }
      n.addClass("logo-chip");
    }
  });
  // "<p><strong>¿Pregunta?</strong><br>Respuesta</p>" runs (2+) become H3 +
  // paragraph, so the FAQ passes rebuild them as the collapsible FAQ.
  const qa = (el) => {
    const n = $(el);
    const first = n.contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first();
    return el.tagName === "p" && first.is("strong,b") && /\?\s*$/.test(first.text().trim()) && first.next().is("br") ? first : null;
  };
  root.find("p").toArray().filter((el) => {
    if (!qa(el)) return false;
    const prev = $(el).prev()[0], next = $(el).next()[0];
    return (prev && qa(prev)) || (next && qa(next));
  }).forEach((el) => {
    const first = qa(el);
    const q = first.text().trim();
    first.next().remove(); first.remove();
    $(el).replaceWith(`<h3>${q}</h3><p>${$(el).html().trim()}</p>`);
  });
  // Testimonials: «…» paragraphs (one or several) followed by
  // "<strong>Name</strong><br>role" become a blockquote with the author in <cite>.
  const opensQ = (el) => el && el.tagName === "p" && /^[«“"]/.test($(el).text().trim());
  const closesQ = (el) => el && el.tagName === "p" && /[»”"][.]?$/.test($(el).text().trim());
  const byline = (el) => el && el.tagName === "p" && $(el).children().first().is("strong") && $(el).contents().first().is("strong") && $(el).text().trim().length < 220;
  root.find("p").toArray().filter(opensQ).forEach((el) => {
    if (!$(el).parent().length) return;
    const run = [el];
    let n = el;
    while (!closesQ(n)) { n = $(n).next()[0]; if (!n || n.tagName !== "p" || run.length > 4) return; run.push(n); }
    const by = $(n).next()[0];
    if (!byline(by)) return;
    const name = $(by).children("strong").first().text().trim();
    const role = ($(by).html() || "").replace(/^\s*<(strong|b)>[\s\S]*?<\/\1>\s*(<br\s*\/?>\s*)*/i, "").trim();
    // The blockquote draws its own quote marks: drop the legacy « » / “ ”.
    const parts = run.map((p) => $(p).html().trim());
    parts[0] = parts[0].replace(/^[«“"]\s*/, "");
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\s*[»”"](\.?)$/, "$1");
    $(el).before(`<blockquote>${parts.map((h) => `<p>${h}</p>`).join("")}<cite><strong>${name}</strong>${role ? ` · ${role}` : ""}</cite></blockquote>`);
    [...run, by].forEach((p) => $(p).remove());
  });
  // Quotes: the source ("Fuente: …", in a <cite> or its own paragraph) moves
  // to a <cite> at the end, and the last quoted paragraph gets the closing mark.
  root.find("blockquote").each((_, el) => {
    const q = $(el);
    // A quote box with no source that is not a quotation stays body text
    // (wrapping quote marks dropped) instead of a quote band: our own statement
    // ("siempre utilizamos la normativa de la AVL"), an unsourced paraphrase
    // wrapped in «…», or a call to action. Sourced quotes, verbatim extracts
    // (an article of a regulation) and fact boxes keep the band.
    const qt = q.text().replace(/\s+/g, " ").trim();
    const ownVoice = /\b(nuestr[oa]s?|utilizamos|trabajamos|ofrecemos|traducimos|contamos con|garantizamos|revisamos|aplicamos|ayudamos|we|our)\b/i.test(qt);
    const wrapped = /^[«“"]/.test(qt) && /[»”"]\.?$/.test(qt);
    const cta = q.find('a[href*="presupuesto"], a[href*="quote"], a[href*="devis"]').length > 0 || /\b(p[íi]de(nos)?|solicita(r)?) (un |tu )?presupuesto|demande[zr]? (un )?devis|get a (free )?quote/i.test(qt);
    if (!q.find("cite, footer").length && !/\b(fuentes?|sources?)\s*:/i.test(qt) && (ownVoice || wrapped || cta)) {
      const paras = q.children("p").length ? q.children("p").toArray() : null;
      const unquote = (h) => h.trim().replace(/^(\s*(?:<[^>]+>\s*)*)[«“"]\s*/, "$1").replace(/\s*[»”"]((?:\s*<\/[^>]+>)*\s*)$/, "$1");
      q.replaceWith(paras ? paras.map((p) => `<p>${unquote($(p).html() || "")}</p>`).join("") : `<p>${unquote(q.html() || "")}</p>`);
      return;
    }
    q.find("p").each((_, p) => {
      const n = $(p);
      if (!n.find("cite").length && /^(fuentes?|sources?)\s*:/i.test(n.text().trim())) n.replaceWith(`<cite>${n.html()}</cite>`);
    });
    const cites = q.find("cite").toArray().map((c) => $(c).html().trim().replace(/^(fuentes?|sources?)\s*:\s*/i, (m, w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}: `));
    q.find("cite").each((_, c) => { const p = $(c).parent("p"); $(c).remove(); if (p.length && !p.text().trim()) p.remove(); });
    q.children("p").last().addClass("q-end");
    if (cites.length) q.append(cites.map((c) => `<cite>${c}</cite>`).join(""));
  });
  // Runs of link-only minor headings (h4-h6 "Sitios web multilingües",
  // "Folletos, mapas, guías" …) become a pill list.
  root.find("h5,h6").each((_, el) => { if ($(el).next().is("p,ul")) el.tagName = "h4"; });
  root.find("p").each((_, el) => {
    const n = $(el);
    if (n.text().trim() || n.children().length !== 1) return;
    const a = n.children("a");
    if (a.length && a.children().length === 1 && a.children("img").length && !/logo/i.test(a.find("img").attr("src") || "")) n.remove();
  });
  const linkHead = (el) => /^h[4-6]$/i.test(el.tagName) && $(el).children("a").length === 1 && $(el).text().trim() === $(el).children("a").text().trim();
  root.find("h4,h5,h6").toArray().filter(linkHead).forEach((el) => {
    if (!$(el).parent().length || (el.prev && $(el).prev()[0] && linkHead($(el).prev()[0]))) return;
    const run = [el];
    let n = $(el).next();
    while (n.length && linkHead(n[0])) { run.push(n[0]); n = n.next(); }
    if (run.length < 3) return;
    $(el).before(`<ul data-k="pills">${run.map((h) => `<li>${$.html($(h).children("a"))}</li>`).join("")}</ul>`);
    run.forEach((h) => $(h).remove());
  });
  // Legacy reviewer bylines and "Última actualización: …" stamps: removed at
  // the owner's request (also when both sit in one paragraph).
  root.find("p").each((_, el) => { if (/^(P[áa]gina revisada por\b|[ÚU]ltima actualizaci[óo]n\s*:|Last updated\s*:|Derni[èe]re mise [àa] jour\s*:)/i.test($(el).text().trim())) $(el).remove(); });
  root.find('ul[data-k="stats"]').each((_, el) => { $(el).removeAttr("data-k").addClass("stat-row"); });
  root.find('ul[data-k="pills"]').each((_, el) => {
    const ul = $(el);
    const tiles = langTilesHtml(ul.find("a").toArray().map((a) => [$(a).text().trim(), $(a).attr("href") || ""]));
    if (tiles) ul.replaceWith(tiles);
    else ul.removeAttr("data-k").addClass("pills");
  });
  // "<strong>Term</strong> — definition" lists (3+ items) become a grid of
  // small definition cards (.term-list); the separator dash/colon is dropped.
  root.find("ul").each((_, el) => {
    const ul = $(el);
    const lis = ul.children("li").toArray();
    if (lis.length < 3) return;
    const parts = lis.map((li) => {
      const first = $(li).contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first();
      if (!first.is("strong,b")) return null;
      const rest = $(li).clone();
      rest.contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first().remove();
      const raw = (rest.html() || "").trim();
      // "Term, continuation…" is one sentence, not a term + definition.
      if (!/^[—–:\-]/.test(raw)) return null;
      const def = raw.replace(/^[—–:\-]\s*/, "");
      return def ? { term: first.text().trim().replace(/[:：]\s*$/, ""), def } : null;
    });
    if (parts.some((p) => !p)) return;
    ul.replaceWith(`<ul class="term-list">${parts.map((p) => `<li><strong>${p.term}</strong><span>${p.def}</span></li>`).join("")}</ul>`);
  });

  // Outside blog posts, numbered step lists (3-8 items) become the alternating
  // timeline used on the sworn-translation hub. A leading <strong> becomes the
  // card title; otherwise the card carries the step text alone.
  if (timelineLists) root.find("ol").each((_, el) => {
    const ol = $(el);
    if (ol.closest("li, table, .faq, details").length) return;
    const lis = ol.children("li").toArray();
    if (lis.length < 3 || lis.length > 8) return;
    const items = lis.map((li, i) => {
      const n = $(li);
      const first = n.contents().filter((_, c) => !(c.type === "text" && !c.data.trim())).first();
      let title = "";
      if (first.is("strong,b")) { title = first.text().trim().replace(/[:.]\s*$/, ""); first.remove(); }
      const body = (n.html() || "").trim().replace(/^[—–:\-]\s*/, "");
      return `<li class="timeline__item"><span class="timeline__n">${i + 1}</span><div class="timeline__card">${title ? `<strong class="timeline__title">${title}</strong>` : ""}<p>${body}</p></div></li>`;
    });
    ol.replaceWith(`<ol class="timeline timeline--list">${items.join("")}</ol>`);
  });

  // Legacy Divi buttons arrive as bare links split by <br>s ("Solicitar
  // presupuesto", "Contactar por email"): a paragraph made only of short CTA
  // links becomes a button row, first link primary, the others secondary.
  const CTA_HREF = /presupuesto|translation-quote|devis|contact|^mailto:|^tel:/i;
  root.find("p").each((_, el) => {
    const n = $(el);
    const kids = n.contents().toArray().filter((c) => (c.type !== "text" || c.data.trim()) && !(c.type === "tag" && c.tagName === "br"));
    if (!kids.length || !kids.every((c) => c.type === "tag" && c.tagName === "a")) return;
    const links = kids.map((c) => $(c));
    if (!links.every((a) => CTA_HREF.test(a.attr("href") || "") && a.text().trim().length <= 40)) return;
    n.replaceWith(`<p class="cta-row">${links.map((a, i) => `<a href="${a.attr("href")}" class="bt-btn ${i ? "bt-btn--ghost" : "bt-btn--primary"}">${a.text().trim()}</a>`).join(" ")}</p>`);
  });
  // Paragraphs that wrap only a button-link: mark for centering/spacing.
  root.find("p").each((_, el) => {
    const n = $(el);
    const kids = n.contents().toArray().filter((c) => c.type !== "text" || c.data.trim());
    if (kids.length && kids.every((c) => c.type === "tag" && c.tagName === "a" && $(c).hasClass("bt-btn"))) {
      n.addClass("cta-row");
    }
  });

  // Headings with stray whitespace/icon text from Divi widgets.
  root.find("h1,h2,h3,h4,h5,h6").each((_, el) => {
    const n = $(el);
    if (!n.children().length) n.text(n.text().replace(/\s+/g, " ").trim());
  });

  // Empty table-of-contents widgets leave just their title behind.
  root.find("h2,h3,h4,h5").each((_, el) => {
    if (/^(table of contents|table des mati.res|tabla de contenidos?|[ií]ndice)$/i.test($(el).text().trim())) $(el).remove();
  });

  // Comments and empty paragraphs left behind by the Divi modules.
  root.find("*").addBack().contents().each((_, n) => {
    if (n.type === "comment") $(n).remove();
  });
  root.find("p").each((_, el) => {
    if (!$(el).text().trim() && !$(el).find("img").length) $(el).remove();
  });

  // Every scraped page ends with the same sitewide block (specialties teaser,
  // contact details, process timeline). The page template supplies its own
  // call to action, so cut from the first of these headings onward.
  // The teaser's lead-in label ("Áreas en las que destacamos") goes with it,
  // even when additions were inserted between the label and the heading.
  root.find("p").filter((_, el) => $(el).text().replace(/\s+/g, " ").trim() === "Áreas en las que destacamos").remove();
  const TAIL = /sin compromiso|no-obligation|free,? no|free quote|without commitment|sans engagement|devis gratuit|areas de especializaci|áreas de especializaci|areas of specialization|domaines de sp|main available languages|principales langues/i;
  const kids = root.children().toArray();
  // Long headings are page content that happens to mention a free quote (the FR
  // rates page: "Tarifs de traduction transparents … devis gratuit, sans
  // engagement…"); the sitewide tail headings are short.
  const cut = kids.findIndex((el) => /^h2$/i.test(el.tagName) && TAIL.test($(el).text()) && $(el).text().replace(/\s+/g, " ").trim().length <= 100);
  if (cut > 0) {
    const prev = $(kids[cut - 1]);
    const from = /^p$/i.test(kids[cut - 1].tagName) && !prev.find("img").length && prev.text().trim().length < 60 ? cut - 1 : cut;
    kids.slice(from).forEach((el) => $(el).remove());
  }
  // CTA figures (with presupuesto/quote links) contain their own H2; promote
  // the H2 to a top-level sibling so toSections creates a separate section.
  root.find("figure").each((_, el) => {
    const fig = $(el);
    const h2 = fig.find("h2");
    const hrefs = fig.find("a").toArray().map((a) => $(a).attr("href") || "");
    if (h2.length && hrefs.some((h) => /presupuesto|translation-quote|devis/i.test(h))) {
      h2.remove();
      root.append(h2);
      root.append(fig);
    }
  });

  // Trailing buttons / stray paragraphs that belonged to the removed blocks.
  const left = root.children().toArray();
  for (let i = left.length - 1; i >= 0; i--) {
    const n = $(left[i]);
    const keepsFundingLogos = n.find("img").toArray().some((im) => /MOVES|IDAE|IVACE/i.test($(im).attr("src") || ""));
    // Closing contact lines (quote link, phone, e-mail) duplicate the CTA band
    // that follows every page, so drop them when they end the copy.
    const links = n.find("a").toArray().map((a) => $(a).attr("href") || "");
    const contactOnly = links.length > 0 && n.text().trim().length < 200 &&
      links.every((h) => /^(tel:|mailto:)|presupuesto|translation-quote|devis|contact/i.test(h));
    if (contactOnly) { n.remove(); continue; }
    if (n.hasClass("cta-row") || (!n.text().trim() && !keepsFundingLogos)) n.remove();
    else break;
  }

  // Legacy markup sometimes leaves a <strong>/<b>/<em>/<i> open around whole
  // paragraphs, so entire articles render bold or italic: such a tag holding
  // block content is unwrapped, and so is one that is a heading's whole text.
  root.find("strong, b, em, i").toArray().reverse().forEach((el) => {
    const n = $(el);
    if (n.children("p, ul, ol, h1, h2, h3, h4, h5, h6, div, table, figure, blockquote, section").length) { n.replaceWith(n.contents()); return; }
    const parent = n.parent();
    if (/^h[1-6]$/i.test(parent.prop("tagName") || "") && /^(em|i)$/i.test(el.tagName) && parent.text().trim() === n.text().trim()) n.replaceWith(n.contents());
  });

  // Legacy contact lines ("+34 962 02 22 22 | hello@…"): a paragraph holding
  // only phone / e-mail links and separators becomes two icon chips, and a
  // figure that closes with the quote button plus those chips is a CTA card.
  root.find("p").each((_, el) => {
    const n = $(el);
    if (n.attr("class")) return;
    const links = n.children("a").toArray();
    if (!links.length || !links.every((a) => /^(tel:|mailto:)/i.test($(a).attr("href") || ""))) return;
    const rest = n.clone(); rest.children("a").remove();
    if (rest.text().replace(/\b(tel[eé]fono|tel|phone|t[eé]l[eé]phone|e-?mail|correo( electr[oó]nico)?|courriel)\b\.?:?/gi, "").replace(/[\s\u00a0|·•\/–:-]/g, "")) return;
    const chips = links.map((a) => {
      const href = $(a).attr("href");
      const kind = /^tel:/i.test(href) ? "tel" : "mail";
      return `<a class="cta-contact__link cta-contact__link--${kind}" href="${href}">${$(a).text().trim()}</a>`;
    });
    n.replaceWith(`<p class="cta-contact">${chips.join("")}</p>`);
  });
  root.find("figure").each((_, el) => {
    const f = $(el);
    if (f.children(".cta-row").length && f.children(".cta-contact").length) f.addClass("cta-close");
  });

  // Walls of text: long paragraphs are split at sentence boundaries into
  // shorter ones (see splitLongParagraph).
  root.find("p").each((_, el) => {
    const n = $(el);
    // WordPress block classes (wp-block-paragraph, has-…) don't count as a styled
    // paragraph; FAQ answers are split too (Mike, 2026-10-18: "split long paragraphs").
    const cls = (n.attr("class") || "").split(/\s+/).filter((c) => c && !/^(wp-block-paragraph|has-[\w-]+)$/.test(c));
    if (n.closest("li,td,th,blockquote,figure").length || cls.length) return;
    const parts = splitLongParagraph(n.html() || "");
    if (parts.length > 1) n.replaceWith(parts.map((h) => `<p>${h}</p>`).join(""));
  });

  return root.html();
}

// Keeps the first two paragraphs of a long run visible and folds the rest
// into a <details> toggle, so bands do not read as walls of text. Content
// stays in the DOM. Runs of three paragraphs or fewer are left alone.
function collapse(html, label = "Leer más") {
  if (!html) return html;
  const $ = cheerio.load(`<div id="c">${html}</div>`, null, false);
  const kids = $("#c").children().toArray();
  const isText = (el) => /^(p|ul|ol)$/i.test(el.tagName) && !$(el).attr("class") && !$(el).find("img").length;
  const textCount = kids.filter(isText).length;
  if (textCount <= 3) return html;
  let seen = 0, cut = -1;
  for (let i = 0; i < kids.length; i++) {
    if (isText(kids[i])) seen++;
    if (seen === 2) { cut = i + 1; break; }
  }
  // Fold only the run of plain text right after the cut: a sub-heading, pill
  // list, buttons or images end it, and what follows stays visible, in order.
  const fold = [];
  for (const el of kids.slice(cut)) { if (!isText(el)) break; fold.push(el); }
  if (fold.length < 2) return html;
  const foldHtml = fold.map((el) => $.html(el)).join("");
  fold.forEach((el) => $(el).remove());
  const esc = String(label).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  $(kids[cut - 1]).after(`<details class="sec__more"><summary>${esc}</summary><div class="sec__more-body">${foldHtml}</div></details>`);
  return $("#c").html();
}

// Keeps a timeline step short: whole opening paragraphs stay visible up to
// STEP_SHOW characters (at least STEP_MIN when the text allows), else a teaser
// of whole sentences; the rest folds behind a toggle. Mike (2026-10-19): show a
// bit more text before the "+".
const STEP_MAX = 320;
const STEP_SHOW = 360;
const STEP_MIN = 200;
function trimStep(body, label = "Leer más") {
  const $ = cheerio.load(`<div id="s">${body}</div>`, null, false);
  // Legacy steps pack several paragraphs into one <p> with <br>s.
  $("#s > p").each((_, el) => {
    const parts = $(el).html().split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) $(el).replaceWith(parts.map((s) => `<p>${s}</p>`).join(""));
  });
  const kids = $("#s").children().toArray();
  const text = (el) => $(el).text().replace(/\s+/g, " ").trim();
  if (!kids.length) return body;
  const first = kids[0];
  const all = $("#s").html();
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const fold = (inner) => `<details class="timeline__more"><summary>${esc(label)}</summary><div>${inner}</div></details>`;
  // A step that opens with a list stays a list: a plain-text teaser would run its items together.
  if (first.name === "ul" || first.name === "ol") return body;
  let shown = 0, total = 0;
  while (shown < kids.length && kids[shown].name === "p" && total + text(kids[shown]).length <= STEP_SHOW) total += text(kids[shown++]).length;
  // A short lead-in ("… include:") followed by a list: show the first items, fold the rest.
  const list = kids[shown];
  if (shown && total < STEP_MIN && list && (list.name === "ul" || list.name === "ol") && $(list).children("li").length > 4) {
    const items = $(list).children("li").toArray();
    const k = $(list).hasClass("term-list") ? 2 : 3; // term cards are tall: two are enough
    const open = $.html($(list).clone().empty().append(items.slice(0, k).map((li) => $.html(li)).join("")));
    const more = $.html($(list).clone().empty().append(items.slice(k).map((li) => $.html(li)).join("")));
    const rest = more + kids.slice(shown + 1).map((el) => $.html(el)).join("");
    return kids.slice(0, shown).map((el) => $.html(el)).join("") + open + fold(rest);
  }
  if (shown && (total >= STEP_MIN || shown === kids.length || kids[shown].name !== "p")) {
    const rest = kids.slice(shown).map((el) => $.html(el)).join("");
    return kids.slice(0, shown).map((el) => $.html(el)).join("") + (rest ? fold(rest) : "");
  }
  // Teaser: whole sentences up to the limit, plain text.
  // Sentences end at . ! ? followed by a space and a capital (or the end), never
  // inside "4.8", "p. ej.", "art.", "n.º": the old pattern cut teasers at decimals.
  const ABBR = /\b(p|ej|pp|art|arts|núm|n\.º|etc|aprox|sr|sra|dr|dra|vol|cap|fig|ed|e\.g|i\.e)\.$/i;
  const lead = kids.slice(0, Math.max(1, shown + 1)).filter((el) => el.name === "p").map(text).join(" ");
  const sentences = lead.split(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÜÑ¿¡«"(])/).reduce((acc, piece) => {
    if (acc.length && ABBR.test(acc[acc.length - 1].trim())) acc[acc.length - 1] += piece + " ";
    else acc.push(piece + " ");
    return acc;
  }, []);
  let teaser = "";
  for (const s of sentences) {
    if (teaser && (teaser + s).length > STEP_MAX) break;
    teaser += s;
  }
  teaser = teaser.trim();
  if (teaser.length > STEP_MAX + 60) teaser = teaser.slice(0, STEP_MAX).replace(/\s+\S*$/, "") + "…";
  return `<p class="timeline__teaser">${esc(teaser)}</p>${fold(all)}`;
}

// Links the first mention of each file format to its format page (ES pages).
const FORMAT_LINKS = [
  [/\b(PDF)\b/, "pdf"], [/\b(Word)\b/, "word"], [/\b(Excel)\b/, "excel"], [/\b(PowerPoint)\b/, "powerpoint"],
  [/\b(InDesign)\b/, "indesign"], [/\b(IDML)\b/, "idml"], [/\b(XLIFF)\b/, "xliff"], [/\b(HTML)\b/, "html"],
  [/\b(CSV)\b/, "csv"], [/\b(SRT)\b/, "srt"], [/\b(Photoshop)\b/, "photoshop"], [/\b(Illustrator)\b/, "illustrator"],
];
export function linkFormats(html) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const done = new Set();
  $("#root p, #root li").each((_, el) => {
    if (done.size === FORMAT_LINKS.length) return false;
    $(el).contents().each((__, node) => {
      if (node.type !== "text") return;
      let text = node.data;
      let changed = false;
      for (const [re, slug] of FORMAT_LINKS) {
        if (done.has(slug) || !re.test(text)) continue;
        text = text.replace(re, `<a href="/formatos-de-traduccion/${slug}/">$1</a>`);
        done.add(slug);
        changed = true;
      }
      if (changed) $(node).replaceWith(text);
    });
  });
  return $("#root").html();
}

// Short plain bullet lists (3 to 6 one-line items) read as a row of tick cards
// instead of a dull bulleted column; longer or nested lists stay as they are.
function featureLists(html) {
  if (!html || !/<ul[\s>]/i.test(html)) return html;
  const $ = cheerio.load(`<div id="b">${html}</div>`, null, false);
  $("#b > ul").each((_, el) => {
    const ul = $(el);
    if (ul.attr("class")) return;
    const items = ul.children("li");
    const n = items.length;
    if (n < 3 || (n > 6 && n !== 8) || ul.find("ul,ol,p").length) return;
    if (items.toArray().some((li) => $(li).text().replace(/\s+/g, " ").trim().length > 75)) return;
    ul.addClass("feat-list").attr("data-count", String(n));
  });
  return $("#b").html();
}

// Groups the flat article into <section> bands (one per H2), and turns runs
// of three or more repeated H3/H4 blocks into a card grid.
export function toSections(html, opts = {}) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  const groups = [{ head: null, nodes: [] }];
  for (const el of kids) {
    if (/^h2$/i.test(el.tagName)) groups.push({ head: el, nodes: [] });
    else groups[groups.length - 1].nodes.push(el);
  }
  const out = [];
  groups.forEach((g, i) => {
    if (!g.head && !g.nodes.length) return;
    if (g.head && /table of contents|table des mati|tabla de contenido/i.test($(g.head).text())) return;
    if (opts.dropTeam && g.head && /equipo|team|équipe/i.test($(g.head).text())) return;
    const frag = cheerio.load("<div id=\"g\"></div>", null, false);
    const box = frag("#g");
    g.nodes.forEach((n) => box.append($.html(n)));
    // Pull quotes (stats, sources, regulations) leave the section and become a
    // separator band right after it, when the section has other content.
    const qs = box.children("blockquote");
    const quotes = qs.length && box.children().length > qs.length ? qs.toArray().map((q) => frag.html(q)) : [];
    if (quotes.length) qs.remove();
    // A section that mixes H3 and H4 topics (four or more in all) reads as one set of topics: H4s become H3s,
    // so they become cards together instead of half of them staying loose text.
    if (box.children("h3").length >= 1 && box.children("h4").length >= 1 && box.children("h3,h4").length >= 4 && !box.find(".faq").length) {
      box.children("h4").each((_, el) => { const n = frag(el); const id = n.attr("id"); n.replaceWith(`<h3${id ? ` id="${id}"` : ""}>${n.html()}</h3>`); });
    }
    // A merged language section (its H2 carries a leaf id) is an accordion from two topics up.
    const minTopics = g.head && /^(korean|french|german|spanish)-/.test($(g.head).attr("id") || "") ? 2 : 3;
    let level = ["h3", "h4"].find((l) => box.children(l).length >= minTopics);
    // Headings over a collapsible FAQ are FAQ topics, not cards: they stay in
    // place, and every answer stays with its question.
    if (level && box.children(level).next(".faq").length) level = undefined;
    if (level) {
      // A heading with nothing under it ("Casos de uso más frecuentes" right
      // before the cards) is a sub-heading for the grid, not an empty card.
      box.children(level).each((_, el) => {
        const next = frag(el).next();
        if (!next.length || next[0].tagName.toLowerCase() === level) frag(el).replaceWith(`<p class="sec__subhead">${frag(el).html()}</p>`);
      });
      if (box.children(level).length < minTopics) level = undefined;
    }
    if (level) {
      // Legacy cards put their icon above the title: move it after the title
      // so the card picks it up instead of leaving it stranded in the intro.
      box.children("p").each((_, el) => {
        const p = frag(el);
        const onlyImg = p.children().length === 1 && p.children("img").length === 1 && !p.text().trim();
        const next = p.next();
        if (onlyImg && next.length && next[0].tagName.toLowerCase() === level) next.after(p);
      });
    }
    let body;
    if (level) {
      const seen = new Set();
      let intro = "", cards = "", tail = "";
      const steps = [];
      let total = 0;
      let card = null, count = 0;
      const list = [];
      const flush = () => { if (card) list.push(card); card = null; };
      const render = (card) => {
        card.body = card.parts.join("");
        const key = card.title.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          total++;
          // Numbered titles ("1. Confirmamos...") are process steps.
          const step = card.title.match(/^(\d+)[.)]\s*(.+)$/s);
          if (step) steps.push({ n: step[1], title: step[2], body: card.body });
          // Variants: CTA card or card with its own icon.
          // Long card text: a short teaser stays visible, the rest folds behind "Leer más".
          const plainLen = card.body.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().length;
          const wide = /class="trans-grid"/.test(card.body); // translator profiles: full width, never folded
          const html = card.head + (plainLen > 200 && !wide && !/data-cta=/.test(card.head + card.body) ? trimStep(card.body, opts.more) : card.body);
          const cls = wide ? " mini--wide" : /data-cta=/.test(html) ? " mini--cta" : /data-icon=/.test(html) ? " mini--icon" : "";
          // A scraped icon image goes to the top-left corner, above the title.
          let inner = html;
          const img = inner.match(/<p[^>]*>\s*<img[^>]*>\s*<\/p>/i);
          if (img && !cls) inner = `<p class="mini__img">${img[0].replace(/^<p[^>]*>|<\/p>$/gi, "")}</p>` + inner.replace(img[0], "");
          cards += `<div class="mini${cls}">${inner}</div>`;
        }
      };
      box.children().each((_, el) => {
        const n = frag(el);
        if (el.tagName.toLowerCase() === level) {
          flush();
          card = { title: n.text().trim(), head: frag.html(el), parts: [] };
          count = 0;
        } else if (card && count === 0 && n.hasClass("cta-row") && /^(tel|mailto):/i.test(n.find("a").first().attr("href") || "")) {
          // A phone or email button straight after its label ("Call us at") is that card's value.
          const a = n.find("a").first();
          card.parts.push(`<p><a href="${a.attr("href")}">${a.text().trim()}</a></p>`);
          count++;
        } else if (card && count < 3 && !n.hasClass("cta-row") || card && count < 4 && n.hasClass("cta-row") && count > 0) {
          card.parts.push(frag.html(el));
          count++;
        } else if (card) {
          flush();
          tail += frag.html(el);
        } else {
          intro += frag.html(el);
        }
      });
      flush();
      // A card often swallows the loose paragraphs after it (mid-grid or at the
      // end of the section): every card keeps the grid's usual length (the most
      // common part count) and the extra paragraphs go below the grid, in order.
      const freq = {};
      list.forEach((k) => { freq[k.parts.length] = (freq[k.parts.length] || 0) + 1; });
      const usual = Math.max(1, +Object.keys(freq).sort((x, y) => freq[y] - freq[x] || x - y)[0] || 1);
      let extra = "";
      list.forEach((k) => { if (k.parts.length > usual && list.length > 2) extra += k.parts.splice(usual).join(""); });
      tail = extra + tail;
      list.forEach(render);
      const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
      if (steps.length >= 3 && steps.length === total) {
        // A numbered process becomes a timeline that alternates left and right.
        const items = steps.map((st) => `<li class="timeline__item"><span class="timeline__n">${esc(st.n)}</span><div class="timeline__card"><h3>${esc(st.title.replace(/\s+/g, " "))}</h3>${trimStep(st.body, opts.more)}</div></li>`).join("");
        body = `${intro}<ol class="timeline">${items}</ol>${tail}`;
      } else {
        // The Call us / Email / Office address cards repeat the contact CTA band below.
        const contactOnly = list.length > 0 && list.every((k) => /^(call us|phone|telephone|email|e-mail|office address|address)/i.test(k.title));
        // Question cards under a "Questions about..." heading read as an accordion: the question shows, the answer opens on click.
        // A merged language leaf (its H2 carries the leaf id, e.g. "german-legal") shows its topics as an accordion.
        const leafSection = g.head && /^(korean|french|german|spanish)-/.test($(g.head).attr("id") || "");
        const faqLike = !contactOnly && list.length >= 2 && g.head && (leafSection || (/questions|faq/i.test($(g.head).text()) && list.every((k) => /\?\s*$/.test(k.title))));
        const faqItems = faqLike ? list.map((k) => `<details class="faq__item"><summary>${esc(k.title)}</summary><div class="faq__a">${k.parts.join("")}</div></details>`) : [];
        const faqHtml = faqItems.length > 5 && !leafSection
          ? `${faqItems.slice(0, 5).join("")}<details class="faq__more"><summary>More questions</summary><div class="faq__more-in">${faqItems.slice(5).join("")}</div></details>`
          : faqItems.join("");
        body = contactOnly ? `${collapse(intro, opts.more)}${tail}`
          : faqLike ? `${collapse(intro, opts.more)}<div class="faq post-faq">${faqHtml}</div>${tail}`
          : `${collapse(intro, opts.more)}<div class="mini-grid" data-count="${total}">${cards}</div>${tail}`;
      }
    } else {
      body = collapse(box.html(), opts.more);
    }
    body = featureLists(body);
    const head = g.head ? $.html(g.head) : "";
    out.push(`<section class="sec${i % 2 ? " sec--alt" : ""}"><div class="sec__in">${head}${body}</div></section>`);
    if (quotes.length) out.push(`<aside class="sec-quote"><div class="sec__in">${quotes.join("")}</div></aside>`);
  });
  return out.join("");
}

// Splits the first <h1> off the sanitized body so the page template can
// render it in a proper hero band.
export function splitHero(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const h1 = $("#root h1").first();
  const title = h1.text().trim();
  h1.remove();
  return { title, body: $("#root").html() };
}

const TEAM_RE = /equipo|team|équipe|equipe/i;
const CLIENTS_RE = /clientes satisfechos|satisfied (customers|clients)|clients satisfaits/i;

// Splits the sanitized About body into the blocks the page lays out in
// legacy order: the intro groups, the team text and funding notice, the
// satisfied-clients copy and everything else. Returns null when the page has
// no recognisable team and clients groups (e.g. the FR archive).
export function splitAbout(html, fallback = null) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  // A legacy text module that only repeats the page name under the hero buttons.
  $("#root > p").filter((_, el) => /^(sobre nosotros|about us|à propos)$/i.test($(el).text().trim())).remove();
  const groups = [{ head: null, nodes: [] }];
  $("#root").children().each((_, el) => {
    if (/^h2$/i.test(el.tagName)) groups.push({ head: $(el), nodes: [] });
    else groups[groups.length - 1].nodes.push($(el));
  });
  const textOf = (n) => n.text().replace(/\s+/g, " ").trim();
  const team = groups.find((g) => g.head && TEAM_RE.test(textOf(g.head)));
  const clients = groups.find((g) => g.head && CLIENTS_RE.test(textOf(g.head)));
  if (!team || !clients) {
    // Archives without these sections (FR) get the same blocks from
    // hand-written copy: first group as intro, the rest after the team.
    if (!fallback) return null;
    const html = (g) => (g.head ? $.html(g.head) : "") + g.nodes.map((n) => $.html(n)).join("");
    const parts = groups.map(html).filter((h) => h.trim());
    return {
      teamTitle: fallback.teamTitle,
      teamEyebrow: fallback.teamEyebrow,
      teamIntro: fallback.teamIntro,
      funding: "",
      clientsTitle: fallback.clientsTitle,
      clientsCopy: fallback.clientsCopy,
      leading: parts.slice(0, 1),
      trailing: parts.slice(1).join(""),
      clientsLast: true,
    };
  }

  const outer = (nodes) => nodes.map((n) => $.html(n)).join("");

  // Clients: stars, copy, then logo-only paragraphs and a trailing eyebrow
  // ("NUESTRO EQUIPO") that belongs to the team block.
  let eyebrow = "";
  const clientsCopy = [];
  for (const n of clients.nodes) {
    const t = textOf(n);
    if (/^[☆★\s]+$/.test(t)) continue;
    if (!t && n.find("img").length) continue;
    if (n.is("p") && t && t === t.toUpperCase() && t.length < 40) { eyebrow = t; continue; }
    clientsCopy.push(n);
  }

  // Team: intro paragraphs before the first member heading; the member
  // names/roles are rendered by <Team/>; anything after the last role is the
  // funding notice.
  const intro = [];
  const after = [];
  let seenMember = false;
  let roleSkip = 0;
  for (const n of team.nodes) {
    if (n.is("h4")) { seenMember = true; roleSkip = 1; continue; }
    if (seenMember && roleSkip > 0 && n.is("p")) { roleSkip = 0; continue; }
    // Short all-caps paragraphs are the next section's eyebrow label.
    if (seenMember && n.is("p") && textOf(n) && textOf(n) === textOf(n).toUpperCase() && textOf(n).length < 40) continue;
    (seenMember ? after : intro).push(n);
  }

  const used = new Set([team, clients]);
  const rest = groups.filter((g) => !used.has(g));
  return {
    teamTitle: textOf(team.head),
    teamEyebrow: eyebrow,
    teamIntro: outer(intro),
    funding: outer(after),
    clientsTitle: textOf(clients.head),
    clientsCopy: outer(clientsCopy),
    // Groups ahead of the clients block, one HTML string each (the intro,
    // then the "difference" copy), and everything that follows it.
    leading: rest.filter((g) => groups.indexOf(g) < groups.indexOf(clients)).map((g) => (g.head ? $.html(g.head) : "") + outer(g.nodes)).filter((h) => h.trim()),
    trailing: rest.filter((g) => groups.indexOf(g) > groups.indexOf(clients) && groups.indexOf(g) > groups.indexOf(team)).map((g) => (g.head ? $.html(g.head) : "") + outer(g.nodes)).join(""),
  };
}

const PAIRS_RE = /combinaciones de idiomas|language combinations|combinaisons de langues/i;

// Divi heroes ship a tagline H2 followed only by CTA buttons. Lifts that group
// out of the body so the page hero can show it: { tagline, ctas, body }.
export function splitTagline(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  if (!kids.length || !/^h2$/i.test(kids[0].tagName)) return { tagline: "", ctas: "", body: html };
  let i = 1;
  const ctas = [];
  while (i < kids.length && $(kids[i]).hasClass("cta-row")) { ctas.push($.html(kids[i])); i++; }
  if (!ctas.length || (i < kids.length && !/^h2$/i.test(kids[i].tagName) && !$(kids[i]).is("ul.stat-row"))) return { tagline: "", ctas: "", body: html };
  const tagline = $(kids[0]).text().replace(/\s+/g, " ").trim();
  kids.slice(0, i).forEach((el) => $(el).remove());
  return { tagline, ctas: ctas.join(""), body: $("#root").html() };
}

// Removes the scraped "language combinations" group (an empty widget) so the
// page can render its own list. Returns { body, removed }.
export function dropPairsGroup(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  const start = kids.findIndex((el) => /^h2$/i.test(el.tagName) && PAIRS_RE.test($(el).text()));
  if (start < 0) return { body: html, removed: false };
  let end = start + 1;
  while (end < kids.length && !/^h2$/i.test(kids[end].tagName)) end++;
  kids.slice(start, end).forEach((el) => $(el).remove());
  return { body: $("#root").html(), removed: true };
}

// Swaps the H3 blocks of the first H2 group with three or more H3 for the
// given cards ([{ title, body }]). Leaves the html untouched when there is no
// such group, so a stale override can never break a page.
export function replaceCards(html, cards) {
  if (!cards || !cards.length) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  let h2 = -1;
  for (let i = 0; i < kids.length; i++) {
    if (!/^h2$/i.test(kids[i].tagName)) continue;
    let end = i + 1, h3 = 0;
    while (end < kids.length && !/^h2$/i.test(kids[end].tagName)) { if (/^h3$/i.test(kids[end].tagName)) h3++; end++; }
    if (h3 >= 3) { h2 = i; break; }
  }
  const esc0 = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const build = () => cards.map((c) => {
    const attr = c.cta ? ' data-cta="1"' : c.icon ? ` data-icon="${esc0(c.icon)}"` : "";
    const cta = c.cta
      ? `<p class="cta-row"><a class="bt-btn bt-btn--primary" href="${esc0(c.cta.href)}">${esc0(c.cta.label)}</a>` +
        (c.cta.tel ? `<a class="mini__tel" href="tel:${esc0(c.cta.tel.replace(/\s/g, ""))}">${esc0(c.cta.telLabel || c.cta.tel)}</a>` : "") +
        "</p>"
      : "";
    return `<h3${attr}>${esc0(c.title)}</h3><p>${c.body}</p>${cta}`;
  }).join("");
  if (h2 < 0) {
    // No card group in the scraped copy: add the cards at the end of the first H2 group.
    const first = kids.findIndex((el) => /^h2$/i.test(el.tagName));
    if (first < 0) return html;
    let stop = first + 1;
    while (stop < kids.length && !/^h2$/i.test(kids[stop].tagName)) stop++;
    $(kids[stop - 1]).after(build());
    return $("#root").html();
  }
  let end = h2 + 1;
  let firstH3 = -1;
  while (end < kids.length && !/^h2$/i.test(kids[end].tagName)) {
    if (firstH3 < 0 && /^h3$/i.test(kids[end].tagName)) firstH3 = end;
    end++;
  }
  kids.slice(firstH3, end).forEach((el) => $(el).remove());
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const markup = cards.map((c) => {
    const attr = c.cta ? ' data-cta="1"' : c.icon ? ` data-icon="${esc(c.icon)}"` : "";
    const cta = c.cta
      ? `<p class="cta-row"><a class="bt-btn bt-btn--primary" href="${esc(c.cta.href)}">${esc(c.cta.label)}</a>` +
        (c.cta.tel ? `<a class="mini__tel" href="tel:${esc(c.cta.tel.replace(/\s/g, ""))}">${esc(c.cta.telLabel || c.cta.tel)}</a>` : "") +
        "</p>"
      : "";
    return `<h3${attr}>${esc(c.title)}</h3><p>${c.body}</p>${cta}`;
  }).join("");
  const anchor = kids[firstH3 - 1];
  $(anchor).after(markup);
  return $("#root").html();
}

// Replaces the first paragraph that follows the first H2 with one or more
// paragraphs ([string] or string, HTML allowed).
export function replaceIntro(html, intro) {
  const paras = (Array.isArray(intro) ? intro : [intro]).filter(Boolean);
  if (!paras.length) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  const h2 = kids.findIndex((el) => /^h2$/i.test(el.tagName));
  if (h2 < 0) return html;
  const p = kids.slice(h2 + 1).find((el) => /^p$/i.test(el.tagName));
  if (!p) return html;
  $(p).replaceWith(paras.map((t) => `<p>${t}</p>`).join(""));
  return $("#root").html();
}

// Legacy Divi tab / icon widgets leave debris once flattened: tab labels as
// loose one-line paragraphs, orphan card images, "Leer más" buttons pointing at
// unrelated pages, and runs of heading-only labels (h4/h5 with no text under
// them). A band is treated as a flattened widget when it has three or more
// orphan top-level images. Its labels, images and buttons are dropped (the
// cards under the H3s carry the content) and runs of heading-only labels
// elsewhere become a pill list.
// Core values on /translation-services/, wording from the scraped page.
const CORE_VALUES = [
  ["Flexibility", "We work with freelancers from the UK and many other countries, in multiple time zones. Our team approach lets us translate large documents around the clock."],
  ["Responsiveness", "We guarantee a quick response to your requests and queries. Our experienced UK team starts work on your translation project as soon as terms are agreed."],
  ["Professionalism", "Every translator and project manager we work with is a qualified professional with many years of experience in translation services."],
  ["References", "Our clients past and present span many professional sectors, including large international companies and corporations."],
];

export function tidyWidgetDebris(html) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  const groups = [[]];
  for (const el of kids) {
    if (/^h2$/i.test(el.tagName)) groups.push([el]);
    else groups[groups.length - 1].push(el);
  }
  const words = (el) => $(el).text().replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  // Social "follow" buttons from a flattened widget ("Seguir" × 5): the footer has them.
  $("#root a").filter((i, a) => /^(seguir|follow|suivre)$/i.test($(a).text().trim()) && /facebook|linkedin|instagram|youtube|tiktok|x\.com|twitter/i.test($(a).attr("href") || "")).each((i, a) => {
    const li = $(a).parent("li");
    (li.length ? li : $(a)).remove();
  });
  $("#root > li:empty, #root ul:empty").remove();
  for (const g of groups) {
    const orphanImgs = g.filter((el) => /^img$/i.test(el.tagName));
    if (orphanImgs.length >= 3) {
      for (const el of g) {
        const tag = el.tagName.toLowerCase();
        const n = $(el);
        const label = tag === "p" && !n.attr("class") && !n.find("a,strong,em").length && words(el) <= 5 && !/[.:?!]\s*$/.test(n.text().trim());
        const orphanBtn = tag === "p" && n.hasClass("cta-row");
        if (tag === "img" || label || orphanBtn || (tag === "details" && n.hasClass("sec__more"))) n.remove();
      }
    }
  }
  // Heading-only labels in a row (h4/h5 with another heading right after).
  const isLabel = (el) => el && /^h[45]$/i.test(el.tagName);
  const top = $("#root").children().toArray();
  for (let i = 0; i < top.length; i++) {
    if (!isLabel(top[i])) continue;
    let j = i;
    while (j + 1 < top.length && isLabel(top[j + 1])) j++;
    if (j > i) {
      const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const labels = top.slice(i, j + 1).map((el) => esc($(el).text().replace(/\s+/g, " ").trim()));
      // The core values run (the descriptions were lost with the widget): a heading plus four cards.
      if (labels.length === CORE_VALUES.length && CORE_VALUES.every(([l], k) => labels[k] === l)) {
        $(top[i]).replaceWith(`<h2>Our core values</h2><ul class="values">${CORE_VALUES.map(([l, d]) => `<li class="card"><h3>${l}</h3><p>${d}</p></li>`).join("")}</ul>`);
        top.slice(i + 1, j + 1).forEach((el) => $(el).remove());
        i = j;
        continue;
      }
      // Sentence-length labels read as a check list; round pills only suit short ones.
      $(top[i]).replaceWith(labels.some((l) => l.length > 40)
        ? `<ul class="feat-list" data-count="${labels.length}">${labels.map((l) => `<li>${l}</li>`).join("")}</ul>`
        : `<ul class="pills pills--static">${labels.map((l) => `<li><span>${l}</span></li>`).join("")}</ul>`);
      top.slice(i + 1, j + 1).forEach((el) => $(el).remove());
    }
    i = j;
  }
  return $("#root").html();
}

// Removes every H2 group whose heading matches `re` (heading plus its content).
export function dropGroups(html, re, tag = "h2") {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const kids = $("#root").children().toArray();
  let i = 0;
  while (i < kids.length) {
    if (kids[i].tagName.toLowerCase() === tag && re.test($(kids[i]).text())) {
      let end = i + 1;
      while (end < kids.length && !(tag === "h2" ? /^h2$/i : /^h[23]$/i).test(kids[end].tagName)) end++;
      kids.slice(i, end).forEach((el) => $(el).remove());
      i = end;
    } else i++;
  }
  return $("#root").html();
}

// Minimal body for a pair page that has no usable scraped copy: one H2 and a
// placeholder paragraph that replaceIntro() and replaceCards() then fill.
export function pairScaffold(sectionTitle) {
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<h2>${esc(sectionTitle)}</h2><p></p>`;
}

// Splits a long paragraph's inner HTML into shorter paragraphs of two or three
// sentences. Cuts only between sentences, outside any inline tag (<a>,
// <strong>...), before a capital letter, ¿ or ¡, and never after a common
// abbreviation or a number. Short paragraphs come back unchanged.
const ABBR = /(?:\b(?:Sr|Sra|Srta|Dr|Dra|Ud|Uds|etc|ej|pág|núm|nº|aprox|vs|art|EE\.UU|Mr|Mrs|Ms|St|M|Mme|cf|p\.ej)|\d)$/i;
const VOID = /^(br|img|wbr|hr|input|source)$/i;
export function splitLongParagraph(html, { max = 380, target = 300 } = {}) {
  const text = (h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (text(html).length <= max) return [html];
  const sentences = [];
  let depth = 0, start = 0;
  for (let i = 0; i < html.length; i++) {
    const ch = html[i];
    if (ch === "<") {
      const end = html.indexOf(">", i);
      if (end < 0) break;
      const tag = html.slice(i + 1, end).trim();
      const name = tag.replace(/^\//, "").split(/[\s/>]/)[0];
      if (!VOID.test(name) && !tag.endsWith("/")) depth += tag.startsWith("/") ? -1 : 1;
      i = end;
      continue;
    }
    if (depth !== 0 || !".?!".includes(ch)) continue;
    let j = i + 1;
    while (j < html.length && /["»”')]/.test(html[j])) j++;
    if (!/\s/.test(html[j] || "")) continue;
    let k = j;
    while (k < html.length && /\s/.test(html[k])) k++;
    const next = html.slice(k, k + 12).replace(/^<[^>]+>/, "")[0] || "";
    if (!/[A-ZÁÉÍÓÚÑÜ¿¡«"“]/.test(next)) continue;
    if (ch === "." && ABBR.test(text(html.slice(Math.max(0, i - 12), i)))) continue;
    sentences.push(html.slice(start, j).trim());
    start = k;
    i = k - 1;
  }
  sentences.push(html.slice(start).trim());
  const out = [];
  let cur = "";
  for (const s of sentences.filter(Boolean)) {
    if (cur && text(cur).length >= 140 && text(cur + " " + s).length > target) { out.push(cur); cur = s; }
    else cur = cur ? cur + " " + s : s;
  }
  if (cur) {
    if (out.length && text(cur).length < 90) out[out.length - 1] += " " + cur;
    else out.push(cur);
  }
  return out.length ? out : [html];
}

// Runs of two or more consecutive H2 sections whose heading is a question
// ("¿…?") become one collapsible FAQ (with FAQPage JSON-LD) under a single
// "Preguntas frecuentes" heading. A bare FAQ heading right before the run is
// reused rather than duplicated.
const FAQ_HEADING = { es: "Preguntas frecuentes", en: "Frequently asked questions", fr: "Questions fréquentes" };
const FAQ_RE = /preguntas frecuentes|frequently asked|questions fr[ée]quentes|\bfaq\b/i;
// With { keepLead }, a run that opens the body stays as sections: blog posts open
// with question headings that are the article itself, not its FAQ.
export function questionRunsToFaq(html, locale = "es", faqBlock, { keepLead = false } = {}) {
  if (!html || !faqBlock) return html;
  const $ = cheerio.load(`<div id="q">${html}</div>`, null, false);
  const h2s = $("#q > h2").toArray();
  const isQ = (h) => /\?\s*$/.test($(h).text().trim());
  let i = 0;
  while (i < h2s.length) {
    if (!isQ(h2s[i])) { i++; continue; }
    let j = i;
    while (j + 1 < h2s.length && isQ(h2s[j + 1])) j++;
    if (j > i && !(keepLead && i === 0)) {
      const items = [];
      for (let k = i; k <= j; k++) {
        const nodes = [];
        let n = $(h2s[k]).next();
        while (n.length && !n.is("h2")) { if (n.is("p,ul,ol,blockquote,table")) nodes.push(n); n = n.next(); }
        items.push({ q: $(h2s[k]).text().trim(), a: nodes.map((x) => $.html(x)).join(""), nodes });
      }
      const ready = items.filter((it) => it.a);
      if (ready.length >= 2) {
        const prev = $(h2s[i]).prevAll("h2").first();
        const reuse = prev.length && FAQ_RE.test(prev.text()) && !prev.nextUntil(h2s[i]).filter((_, e) => $(e).text().trim()).length;
        const block = (reuse ? "" : `<h2>${FAQ_HEADING[locale] || FAQ_HEADING.es}</h2>`) + faqBlock(ready.map(({ q, a }) => ({ q, a })), "");
        items.forEach((it, k) => { it.nodes.forEach((x) => x.remove()); if (k) $(h2s[i + k]).remove(); });
        $(h2s[i]).replaceWith(block);
      }
    }
    i = j + 1;
  }
  return $("#q").html();
}

// A "Preguntas frecuentes" heading (H2 or H3) followed by questions becomes the
// collapsible FAQ (instead of a card grid). Questions can be lower-level
// headings or native <details>/<summary> blocks; widgets in between are
// skipped. A FAQ heading with no questions under it is removed.
export function faqSectionsToFaq(html, faqBlock) {
  if (!html || !faqBlock) return html;
  const $ = cheerio.load(`<div id="f">${html}</div>`, null, false);
  $("#f h2, #f h3").each((_, h) => {
    const head = $(h);
    if (!head.closest("#f").length || !FAQ_RE.test(head.text())) return;
    const lvl = h.tagName.toLowerCase();
    const stop = lvl === "h2" ? "h2" : "h2";
    const isQ = (n) => (lvl === "h2" ? n.is("h3,h4") : n.is("h3,h4") && /\?\s*$/.test(n.text().trim()));
    const items = [];
    const used = [];
    let cur = null;
    let n = head.next();
    while (n.length && !n.is(stop) && !(lvl === "h3" && n.is("h3") && !isQ(n))) {
      if (n.is("details") && n.children("summary").length) {
        const sum = n.children("summary").first();
        items.push({ q: sum.text().trim(), parts: [n.children().not(sum).toArray().map((x) => $.html(x)).join("")] });
        cur = null; used.push(n);
      } else if (isQ(n)) { cur = { q: n.text().trim(), parts: [] }; items.push(cur); used.push(n); }
      else if (cur && n.is("p,ul,ol,blockquote,table")) { cur.parts.push($.html(n)); used.push(n); }
      n = n.next();
    }
    const ready = items.filter((i) => i.q && i.parts.join("").trim()).map((i) => ({ q: i.q, a: i.parts.join("") }));
    if (ready.length >= 2) {
      used.forEach((u, i) => (i === 0 ? u.replaceWith(faqBlock(ready, "")) : u.remove()));
      if (lvl === "h3") head.replaceWith(`<h2>${head.text().trim()}</h2>`);
    } else if (!items.length && !head.nextUntil(stop).filter((_, e) => $(e).text().trim()).length) {
      head.remove();
    }
  });
  return $("#f").html();
}

// Runs of two or more questions written as bold-only paragraphs
// ("<p><strong>Question ?</strong></p>", with <em>/<i> inside or beside),
// each followed by its answer, become one collapsible FAQ in place, so every
// answer stays with its question (toSections would otherwise cut the run into
// cards and move paragraphs around). Topic headings between runs are kept.
export function boldQuestionsToFaq(html, faqBlock) {
  if (!html || !faqBlock) return html;
  const $ = cheerio.load(`<div id="b">${html}</div>`, null, false);
  const isQ = (n) => n.is("p") && n.find("strong,b").length > 0 && !n.clone().find("strong,b,em,i").remove().end().text().trim() && /\?\s*$/.test(n.text().trim());
  const isA = (n) => n.is("p,ul,ol,blockquote,table") && !isQ(n);
  const done = new Set();
  $("#b p").toArray().forEach((el) => {
    if (done.has(el) || !isQ($(el)) || $(el).closest("li,td,th,details,.faq").length) return;
    const items = [];
    const used = [];
    let n = $(el);
    while (n.length && isQ(n)) {
      const q = n;
      const nodes = [];
      n = n.next();
      while (n.length && isA(n)) { nodes.push(n); n = n.next(); }
      if (!nodes.length) break;
      items.push({ q: q.text().replace(/\s+/g, " ").trim(), a: nodes.map((x) => $.html(x)).join("") });
      used.push(q, ...nodes);
      done.add(q[0]);
    }
    if (items.length < 2) return;
    used.forEach((u, i) => (i === 0 ? u.replaceWith(faqBlock(items, "")) : u.remove()));
  });
  return $("#b").html();
}

// FAQ hub page: every H3 question (with its answer) is regrouped by topic,
// following data/faq-groups.json ([{ title, match: [regex source...], rest }]).
// Each topic becomes an H2 with an id plus one collapsible list; a pill row of
// anchors comes first; the page graph (lib/schema.js) has one FAQPage for all.
// Questions are matched in document order, accents and case ignored; a group
// flagged "rest" collects what no other group claimed.
export function groupFaq(html, groups, faqBlock) {
  if (!html || !groups || !groups.length || !faqBlock) return html;
  const $ = cheerio.load(`<div id="g">${html}</div>`, null, false);
  const root = $("#g");
  const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const items = [];
  const marker = "<!--faq-groups-->";
  let placed = false;
  const touched = [];
  root.children("h3").toArray().forEach((h) => {
    const q = $(h).text().replace(/\s+/g, " ").trim();
    if (!/\?\s*$/.test(q)) return;
    const parts = [];
    const used = [];
    let n = $(h).next();
    while (n.length && !n.is("h2,h3") && n.is("p,ul,ol,blockquote,table")) { parts.push($.html(n)); used.push(n); n = n.next(); }
    if (!parts.length) return;
    const prev = $(h).prevAll("h2").first();
    if (!placed) { (prev.length && !prev.nextUntil(h).length ? prev : $(h)).before(marker); placed = true; }
    items.push({ q, a: parts.join("") });
    used.forEach((u) => u.remove());
    $(h).remove();
    if (prev.length) touched.push(prev);
  });
  if (items.length < 2) return html;
  // Topic headings left without content once their questions moved.
  touched.forEach((h) => { if (h.parent().length) { const nx = h.next(); if (!nx.length || nx.is("h2")) h.remove(); } });
  const res = groups.map((g) => ({ ...g, res: (g.match || []).map((m) => new RegExp(m, "i")), items: [] }));
  const restG = res.find((g) => g.rest);
  items.forEach((it) => {
    const key = fold(it.q);
    const g = res.find((x) => x.res.some((r) => r.test(key))) || restG;
    if (g) g.items.push(it);
  });
  const slug = (s) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const live = res.filter((g) => g.items.length);
  const nav = `<nav aria-label="Temas de las preguntas"><ul class="pills faq-nav">${live.map((g) => `<li><a href="#${slug(g.title)}">${g.title}</a></li>`).join("")}</ul></nav>`;
  // One FAQPage for all the questions comes from the page graph (lib/schema.js).
  const blocks = live.map((g) => `<h2 id="${slug(g.title)}">${g.title}</h2>` + faqBlock(g.items, "")).join("");
  // The topic list opens with its own H2, so the page leads with a heading.
  return root.html().replace(marker, `<h2>Preguntas frecuentes por tema</h2>${nav}` + blocks);
}

// Legacy pages repeat the hero buttons at the top of the body ("Presupuesto
// de traducción", "Reproduce nuestro vídeo"): drop leading button rows.
export function dropLeadingCtas(html) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="c">${html}</div>`, null, false);
  for (const el of $("#c").children().toArray()) {
    if ($(el).is("p.cta-row")) $(el).remove();
    else break;
  }
  return $("#c").html();
}

// Leading H2 under the hero (Mike, 2026-10-17): every page opens its body with an
// H2. When the body starts with anything else (intro paragraphs, an H3), the
// page's heading from data/lead-h2.json goes on top. A leading table of contents
// heading does not count: toSections drops it.
export function withLeadH2(html, text) {
  if (!text || !html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const first = $("#root").children().first();
  if (first.is("h2") && !/table of contents|table des mati|tabla de contenido/i.test(first.text())) return html;
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<h2>${esc(text)}</h2>${html}`;
}

// No skipped heading levels in the final section HTML: an H4 straight after an H2 becomes an H3,
// an H5 after an H3 an H4, and so on (run after the sections are built and reordered).
export function fixHeadingSkips(html) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  let prev = 1;
  const moved = {}; // original level -> promoted level, while the run of siblings lasts
  $("#root").find("h1,h2,h3,h4,h5,h6").each((_, h) => {
    const orig = +h.tagName[1];
    Object.keys(moved).forEach((k) => { if (+k > orig) delete moved[k]; });
    let lvl = moved[orig] || orig;
    if (lvl > prev + 1) { lvl = prev + 1; moved[orig] = lvl; }
    if (lvl !== orig) {
      const n = $(h);
      const id = n.attr("id");
      n.replaceWith(`<h${lvl}${id ? ` id="${id}"` : ""}>${n.html()}</h${lvl}>`);
    }
    prev = lvl;
  });
  return $("#root").html();
}

// A closing "Contact us today for a free quote" paragraph becomes a graphic call-to-action card.
export function ctaCards(html) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  $("#root .sec__in > p").each((_, el) => {
    const p = $(el);
    const text = p.text().replace(/\s+/g, " ").trim();
    // The closing line of a section that invites you to get in touch.
    if (p.attr("class") || text.length > 360) return;
    if (!/^(contact|get in touch|reach out|ready|if you.re ready|don.t miss|request|let us|call)/i.test(text)) return;
    if (!/(today|quote|get started|in touch)/i.test(text)) return;
    const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    p.replaceWith(`<aside class="cta-card"><span class="cta-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 9h8M8 12h5"/></svg></span><p class="cta-card__text">${esc(text)}</p><a class="bt-btn bt-btn--primary" href="/translation-agency/quote/">Get a free quote</a></aside>`);
  });
  // A bare "CONTACT US" label: dropped when the section already ends in a call-to-action card, otherwise it becomes one.
  $("#root p").each((_, el) => {
    const p = $(el);
    if (p.attr("class") || !/^contact us$/i.test(p.text().replace(/\s+/g, " ").trim())) return;
    if (!p.parent().is(".sec__in") || p.parent().children(".cta-card").length) { p.remove(); return; } // inside a card, or the section already has a CTA card
    p.replaceWith(`<aside class="cta-card"><span class="cta-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 9h8M8 12h5"/></svg></span><p class="cta-card__text">Contact us today for a free, no-obligation quote.</p><a class="bt-btn bt-btn--primary" href="/translation-agency/quote/">Get a free quote</a></aside>`);
  });
  return $("#root").html();
}

// Merges language leaf pages into their parent: each leaf (already sanitised, hero split off) becomes an
// H2 section with its own headings one level down, placed before the parent's FAQ. The leaf FAQs
// are merged into one accordion by tidyHeadingLevels.
export function mergeLeaves(parentHtml, leaves) {
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const parts = leaves.map(({ id, title, html }) => {
    const $ = cheerio.load(`<div id="root">${dropGroups(html, /contact us|free, no-obligation|cont[aá]ctanos/i)}</div>`, null, false);
    $("#root h2").filter((_, h) => !$(h).text().trim()).remove();
    // Sibling-page link lists and per-leaf contact blurbs repeat what the parent page already has.
    $("#root h2,#root h3,#root h4,#root h5,#root h6").filter((_, h) => /^(contact us|related pages|get in touch)\b/i.test($(h).text().trim())).each((_, h) => {
      $(h).nextUntil("h1,h2,h3,h4,h5,h6").remove();
      $(h).remove();
    });
    // Every heading inside a leaf becomes an H3 under the leaf's H2, so the topics form one card grid
    // (the FAQ heading stays an H2 so the accordions merge).
    $("#root h2,#root h3,#root h4,#root h5,#root h6").each((_, h) => {
      const el = $(h);
      if (h.tagName.toLowerCase() === "h2" && FAQ_RE.test(el.text())) return;
      const hid = el.attr("id");
      el.replaceWith(`<h3${hid ? ` id="${hid}"` : ""}>${el.html()}</h3>`);
    });
    return `<h2 id="${id}">${esc(title)}</h2>${$("#root").html()}`;
  });
  const $p = cheerio.load(`<div id="root">${parentHtml}</div>`, null, false);
  // The parent's own "Related pages" link lists point at the sections that are now on this page (see the jump links).
  $p("#root h2,#root h3,#root h4,#root h5,#root h6").filter((_, h) => /^related pages/i.test($p(h).text().trim())).each((_, h) => {
    $p(h).nextUntil("h1,h2,h3,h4,h5,h6").remove();
    $p(h).remove();
  });
  const faqH2 = $p("#root > h2").filter((_, h) => FAQ_RE.test($p(h).text())).first();
  if (faqH2.length) faqH2.before(parts.join("")); else $p("#root").append(parts.join(""));
  return tidyHeadingLevels($p("#root").html(), {});
}

// Heading levels under the lead H2 (Mike, 2026-10-18):
// - an H2 inside a box (<figure>, the legacy "En pocas palabras" summary) that
//   follows a section's own H2 is a subsection: H3;
// - a bare "Preguntas frecuentes" names the page's subject.
export function tidyHeadingLevels(html, { faqSubject } = {}) {
  if (!html) return html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  let seenH2 = false;
  $("#root").children().each((_, el) => {
    if (/^h2$/i.test(el.tagName)) { seenH2 = true; return; }
    if (!seenH2) return;
    $(el).find("h2").each((__, h) => {
      if (!$(h).parents("figure").length) return;
      const n = $(h); n.replaceWith(`<h3${n.attr("id") ? ` id="${n.attr("id")}"` : ""}>${n.html()}</h3>`);
    });
  });
  if (faqSubject) {
    const own = new Set($("h2").toArray().map((h) => $(h).text().trim().toLowerCase()));
    const label = `Preguntas frecuentes sobre ${faqSubject}`;
    if (!own.has(label.toLowerCase())) $("h2").filter((_, h) => /^preguntas frecuentes$/i.test($(h).text().trim())).each((_, h) => { $(h).text(label); });
  }
  // One FAQ per page: a recycled FAQ (data/page-additions.json) lands before the
  // page's own one. Its questions join the last accordion and its heading goes.
  // A single recycled question stays plain (H3 + answer), so it is read here too.
  const faqs = $("h2").toArray().filter((h) => FAQ_RE.test($(h).text())).map((h) => {
    const rest = $(h).nextUntil("h2");
    const list = rest.filter(".faq").first();
    const loose = !list.length && rest.length && rest.first().is("h3") && rest.toArray().every((e) => $(e).is("h3,p,ul,ol")) ? rest : null;
    return { h: $(h), list, loose };
  }).filter((f) => f.list.length || f.loose);
  const target = [...faqs].reverse().find((f) => f.list.length)?.list;
  if (faqs.length > 1 && target) {
    const seen = new Set(target.find("summary").toArray().map((s) => $(s).text().trim().toLowerCase()));
    const add = (q, a) => { if (!q || seen.has(q.toLowerCase())) return; seen.add(q.toLowerCase()); target.append(`<details class="faq__item"><summary>${q}</summary><div class="faq__a">${a}</div></details>`); };
    faqs.filter((f) => f.list[0] !== target[0]).forEach(({ h, list, loose }) => {
      if (list.length) list.children("details").each((_, d) => add($(d).children("summary").html().trim(), $(d).children(".faq__a").html() || ""));
      else {
        let q = null, a = "";
        loose.each((_, e) => { if ($(e).is("h3")) { if (q) add(q, a); q = $(e).html().trim(); a = ""; } else a += $.html(e); });
        if (q) add(q, a);
        loose.remove();
      }
      list.remove(); h.remove();
    });
  }
  // Five FAQs stay open to scan; any further ones fold into a "More questions" disclosure.
  $("#root .faq").each((_, el) => {
    const items = $(el).children("details.faq__item").toArray();
    if (items.length <= 5) return;
    const more = $('<details class="faq__more"><summary>More questions</summary><div class="faq__more-in"></div></details>');
    items.slice(5).forEach((it) => more.find(".faq__more-in").append(it));
    $(el).append(more);
  });
  return $("#root").html();
}

// EN and FR pages: legacy debris the Spanish archive no longer has, so the
// pages read like their ES twins (run after the FAQ conversion and before
// toSections). `mapHref` turns a Spanish path into the same page in `locale`
// (data/hreflang.json) or returns null; `self` is the page's own path.
// - links to Spanish pages point at the localised twin when there is one
//   (otherwise they keep the Spanish page and say so with hreflang="es");
// - buttons that link to the page itself are dropped, and a run of three or
//   more one-button rows (a wall of orange "Translation from…" buttons) becomes
//   one pill list: orange is for calls to action only;
// - list items stranded outside a list are wrapped in one;
// - short all-caps labels (Divi eyebrows such as "CONTACT US") are dropped and
//   all-caps button labels are written in sentence case;
// - numbered FAQ questions ("1. Do I need…") lose the number (the accordion is the list);
// - "Address: … Email: … Phone/WhatsApp: …" lines become the contact chips.
const CAPS_KEEP = /\b(seo|wpml|pdf|uk|usa|nie|tie|dtp|faq|maec|acro)\b/gi;
export function localeTidy(html, locale, { mapHref, self } = {}) {
  if (!html || locale === "es") return html;
  const $ = cheerio.load(`<div id="lt">${html}</div>`, null, false);
  const root = $("#lt");
  const norm = (h) => (h || "").replace(/[?#].*$/, "").replace(/\/?$/, "/");
  root.find("a[href^='/']").each((_, el) => {
    const a = $(el);
    const href = a.attr("href");
    if (/^\/(en|fr)(\/|$)|^\/(wp-content|audio|flags|brand|_next)\//.test(href)) return;
    const to = mapHref ? mapHref(norm(href)) : null;
    if (to) a.attr("href", to + (href.match(/#.*$/) || [""])[0]);
    else a.attr("hreflang", "es");
  });
  if (self) root.find("p.cta-row").each((_, el) => {
    const links = $(el).find("a");
    if (links.length && links.toArray().every((a) => norm($(a).attr("href")) === norm(self))) $(el).remove();
  });
  // Runs of one-link button rows become a pill list.
  const rows = root.find("p.cta-row").toArray();
  const seen = new Set();
  rows.forEach((el) => {
    if (seen.has(el)) return;
    const run = [el];
    let n = $(el).next();
    while (n.length && n.is("p.cta-row") && n.find("a").length === 1) { run.push(n[0]); n = n.next(); }
    run.forEach((r) => seen.add(r));
    if (run.length < 3 || run.some((r) => $(r).find("a").length !== 1)) return;
    const items = run.map((r) => { const a = $(r).find("a"); return `<li><a href="${a.attr("href")}"${a.attr("hreflang") ? ` hreflang="${a.attr("hreflang")}"` : ""}>${a.text().trim()}</a></li>`; });
    $(run[0]).replaceWith(`<ul class="pills">${items.join("")}</ul>`);
    run.slice(1).forEach((r) => $(r).remove());
  });
  // Stranded list items.
  root.find("li").each((_, el) => {
    const li = $(el);
    if (li.parent().is("ul,ol")) return;
    const run = [el];
    let n = li.next();
    while (n.length && n.is("li")) { run.push(n[0]); n = n.next(); }
    $(run[0]).before(`<ul>${run.map((r) => $.html(r)).join("")}</ul>`);
    run.forEach((r) => $(r).remove());
  });
  root.find("p").each((_, el) => {
    const p = $(el);
    const t = p.text().replace(/\s+/g, " ").trim();
    if (!p.attr("class") && !p.find("a,img").length && t.length < 40 && (t.match(/\p{L}/gu) || []).length >= 8 && t === t.toUpperCase()) p.remove();
  });
  root.find("a.bt-btn").each((_, el) => {
    const a = $(el);
    const t = a.text().replace(/\s+/g, " ").trim();
    if (a.children().length || t.length < 4 || !/\p{Lu}{4}/u.test(t) || t !== t.toUpperCase()) return;
    const s = t.toLowerCase().replace(/^./, (c) => c.toUpperCase()).replace(CAPS_KEEP, (w) => w.toUpperCase());
    a.text(s);
  });
  root.find("details.faq__item > summary").each((_, el) => {
    const s = $(el);
    if (!s.children().length) s.text(s.text().replace(/^\s*\d{1,2}[.)]\s+/, ""));
  });
  // Labelled contact lines.
  const LABEL = /\b(address|adresse|e-?mail|courriel|phone|t[ée]l[ée]phone|tel|whatsapp)\b\s*(\/\s*\w+)?\s*:/gi;
  root.find("p").each((_, el) => {
    const p = $(el);
    if (p.attr("class") || p.closest("li,details,.faq,figure,table").length) return;
    const t = p.text();
    const labels = t.match(LABEL) || [];
    if (labels.length < 2) return;
    const links = p.find("a").toArray().filter((a) => /^(tel:|mailto:|https:\/\/wa\.me\/)/i.test($(a).attr("href") || ""));
    if (!links.length || p.find("a").length !== links.length) return;
    const chips = links.map((a) => {
      const href = $(a).attr("href");
      return `<a class="cta-contact__link cta-contact__link--${/^mailto:/i.test(href) ? "mail" : "tel"}" href="${href}">${$(a).text().trim()}</a>`;
    });
    p.replaceWith(`<p class="cta-contact">${chips.join("")}</p>`);
  });
  // List items written as headings: three or more H3/H4 in a row with nothing
  // between them ("Balance sheets, income statements…", "Audit reports…")
  // become a list instead of bold sub-headings.
  root.find("h3, h4").each((_, el) => {
    const h = $(el);
    if (!h.parent().is("#lt") || h.prev().is(el.tagName)) return;
    const run = [h];
    let n = h.next();
    while (n.length && n.is(el.tagName)) { run.push(n); n = n.next(); }
    const sentence = (x) => /[.;]$/.test(x.text().trim());
    // The last one keeps its heading role when text follows it, unless it reads like the others (a sentence).
    if (run.length && n.length && !sentence(run[run.length - 1])) run.pop();
    if (run.length < 3) return;
    run[0].before(`<ul>${run.map((x) => `<li>${x.html().trim()}</li>`).join("")}</ul>`);
    run.forEach((x) => x.remove());
  });
  // Label + description pairs (<p><strong>Banking</strong></p><p>Financial institutions…</p>),
  // three or more in a row, become one list ("Banking: Financial institutions…").
  const isLabel = (n) => n.is("p") && !n.attr("class") && n.children("strong,b").length === 1 && n.text().trim() === n.children("strong,b").text().trim() && n.text().trim().length < 70 && !/[?:]$/.test(n.text().trim());
  root.find("p").toArray().forEach((el) => {
    const p = $(el);
    if (!p.parent().length || !isLabel(p) || isLabel(p.prev())) return;
    const pairs = [];
    let n = p;
    while (n.length && isLabel(n) && n.next().is("p") && !n.next().attr("class") && !isLabel(n.next())) { pairs.push([n, n.next()]); n = n.next().next(); }
    if (pairs.length < 3) return;
    p.before(`<ul>${pairs.map(([l, d]) => `<li><strong>${l.text().trim()}</strong>: ${d.html().trim()}</li>`).join("")}</ul>`);
    pairs.forEach(([l, d]) => { l.remove(); d.remove(); });
  });
  return root.html();
}
