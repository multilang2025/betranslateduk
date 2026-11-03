// Inline photos for blog posts, from Wikimedia Commons. data/blog-images.json maps a post slug to
// one or two images, each with the author, licence and Commons page so the credit line is complete.
// Figures are inserted at render time, so the post content files stay untouched.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

let manifest = null;
function load() {
  if (!manifest) {
    const file = path.join(process.cwd(), "data", "blog-images.json");
    manifest = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  }
  return manifest;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function figureHtml(img) {
  const licence = img.licenceUrl
    ? `<a href="${esc(img.licenceUrl)}" target="_blank" rel="noopener">${esc(img.licence)}</a>`
    : esc(img.licence);
  return (
    `<figure class="post-figure"><img src="${esc(img.file)}" width="${img.width}" height="${img.height}" alt="${esc(img.alt)}" loading="lazy" decoding="async">` +
    `<figcaption>Photo: ${esc(img.author)}, ${licence}, via <a href="${esc(img.pageUrl)}" target="_blank" rel="noopener">Wikimedia Commons</a>. Resized from the original.</figcaption></figure>`
  );
}

// A safe place to put a figure is straight after a plain paragraph that does not introduce a list.
function isPlainParagraph($, el) {
  const n = $(el);
  if (!n.is("p") || n.text().trim().length < 60) return false;
  const next = n.next();
  return !(next.is("ul, ol") || next.is("blockquote"));
}

export function insertFigures(html, slug) {
  const images = load()[slug];
  if (!images || !images.length) return html;
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  const kids = $("#r").children().toArray();
  const plain = kids.map((el, i) => (isPlainParagraph($, el) ? i : -1)).filter((i) => i >= 0);
  if (!plain.length) return html;

  const place = (img, targetIndex) => {
    const i = plain.reduce((best, p) => (Math.abs(p - targetIndex) < Math.abs(best - targetIndex) ? p : best), plain[0]);
    $(kids[i]).after(figureHtml(img));
    plain.splice(plain.indexOf(i), 1); // never put two figures in the same spot
  };
  const intro = images.find((x) => x.slot === "intro");
  const mid = images.find((x) => x.slot === "mid");
  if (intro) place(intro, Math.min(2, kids.length - 1));
  if (mid && plain.length) place(mid, Math.round(kids.length * 0.6));
  return $("#r").html();
}
