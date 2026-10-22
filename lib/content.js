// Content-access module: scraped JSON under scripts/btvibe-uk/output is the
// content database. No CMS dependency at runtime. Single-locale (UK,
// English) — unlike BTvibe-es this has no per-locale directories, pair
// overrides, sworn/interpreting virtual pages, or SEO-override layer: the
// scrape itself is the only source of title/description/body.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { SITE } from "./site.js";
import { sentenceCase } from "./sentenceCase.js";

const OUTPUT_ROOT = path.join(process.cwd(), "scripts", "btvibe-uk", "output");

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsonFiles(full, out);
    else if (entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

// Each page's bodyHtml is the FULL scraped document (header/nav/footer
// included, not just the content region -- confirmed against the live
// scrape), and every internal link/image still points at the old
// www.betranslated.co.uk host. Both are fixed here, once, at read time
// (mirrors BTvibe-es's own content.js pattern), so every consumer
// downstream (sanitize.js, the template components) sees clean, local,
// scope-correct markup.
const OLD_HOST = /^(?:https?:)?\/\/(?:www\.)?betranslated\.co\.uk/i;
function localizeUrl(u) {
  if (!u || !OLD_HOST.test(u)) return u;
  const rest = u.replace(OLD_HOST, "") || "/";
  return rest.startsWith("/wp-content/uploads/") ? "/images" + rest : rest;
}
// Scopes a page's bodyHtml down to its real content region (#main-content):
// the scrape captured the FULL document (header/nav/footer included), and
// every internal link/image still points at the old www.betranslated.co.uk
// host -- both fixed here, once, at read time (mirrors BTvibe-es's own
// content.js localUploads() pattern).
function localize(data) {
  if (data?.bodyHtml) {
    const $ = cheerio.load(data.bodyHtml);
    const main = $("#main-content");
    if (main.length) data.bodyHtml = main.html() || data.bodyHtml;
    const $$ = cheerio.load(`<div id="root">${data.bodyHtml}</div>`, null, false);
    $$("a[href]").each((_, el) => $$(el).attr("href", localizeUrl($$(el).attr("href"))));
    $$("img").each((_, el) => {
      const img = $$(el);
      if (img.attr("src")) img.attr("src", localizeUrl(img.attr("src")));
      if (img.attr("data-src")) img.attr("src", localizeUrl(img.attr("data-src")));
    });
    data.bodyHtml = $$("#root").html();
  }
  if (data?.og?.image) data.og.image = localizeUrl(data.og.image);
  if (Array.isArray(data?.images)) data.images = data.images.map((i) => ({ ...i, src: localizeUrl(i.src) }));
  return data;
}

let cache = null;
function readJson(absPath) {
  if (!fs.existsSync(absPath)) return null;
  if (cache?.[absPath]) return cache[absPath];
  const data = localize(JSON.parse(fs.readFileSync(absPath, "utf8")));
  cache = cache || {};
  cache[absPath] = data;
  return data;
}

export function pathFromUrl(url) {
  try { return new URL(url).pathname; } catch { return "/"; }
}

export function cleanTitle(t = "") {
  return (t || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "").trim();
}

// Titles shown on the page (cards, lists, search) are in sentence case; the
// meta title itself stays in Title Case and is only used for the <title> tag.
export function displayTitle(data) {
  return sentenceCase(cleanTitle(data?.title));
}

function pagesRoot() { return path.join(OUTPUT_ROOT, "pages"); }
function postsRoot() { return path.join(OUTPUT_ROOT, "posts"); }

export function getPageBySlug(slugParts = []) {
  if (!slugParts.length) return readJson(path.join(pagesRoot(), "index.json"));
  if (slugParts[0] === "blog" && slugParts.length === 2) {
    return readJson(path.join(postsRoot(), slugParts[1] + ".json"));
  }
  const base = path.join(pagesRoot(), ...slugParts);
  return readJson(base + ".json") || readJson(path.join(base, "index.json"));
}

export function getHomePage() {
  return readJson(path.join(pagesRoot(), "index.json"));
}

export function getAllPageSlugs() {
  const pages = walkJsonFiles(pagesRoot())
    .map((f) => path.relative(pagesRoot(), f).replace(/\.json$/, ""))
    .filter((rel) => rel !== "index")
    .map((rel) => rel.split(path.sep))
    .map((parts) => (parts[parts.length - 1] === "index" ? parts.slice(0, -1) : parts));
  const posts = walkJsonFiles(postsRoot())
    .map((f) => ["blog", path.relative(postsRoot(), f).replace(/\.json$/, "")]);
  return [...pages, ...posts];
}

// Immediate child pages of a hub slug (e.g. ['languages'] -> every
// languages/<x>.json one level deep), for the card/pill grid under a hub's
// intro. Title/description come from the child's own scraped fields, never
// invented.
export function listChildren(slugParts = []) {
  const dir = path.join(pagesRoot(), ...slugParts);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    let file = null;
    if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json") {
      file = path.join(dir, entry.name);
    } else if (entry.isDirectory()) {
      const idx = path.join(dir, entry.name, "index.json");
      if (fs.existsSync(idx)) file = idx;
      else { const f = path.join(dir, entry.name + ".json"); if (fs.existsSync(f)) file = f; }
    }
    const data = file && readJson(file);
    const href = data?.url && pathFromUrl(data.url);
    if (href && !out.some((c) => c.href === href)) out.push({ title: displayTitle(data), description: data.metaDescription || "", href });
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}

// The post's real publish date, from the site's own JSON-LD (Yoast), not invented.
export function postDate(data) {
  const graph = Array.isArray(data?.schema) ? data.schema.flatMap((s) => s["@graph"] || [s]) : [];
  const node = graph.find((n) => n.datePublished);
  return node?.datePublished || null;
}

export function getAllPosts() {
  return walkJsonFiles(postsRoot())
    .map((f) => {
      const slug = path.relative(postsRoot(), f).replace(/\.json$/, "");
      const data = readJson(f);
      return { slug, data, date: postDate(data) };
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

// Blog card excerpt: whole sentences ending in a full stop, about the same
// length on every card (no ellipsis).
const EXCERPT_TARGET = 140, EXCERPT_MIN = 105, EXCERPT_MAX = 175;
function sentencesOf(text) {
  const t = String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/\s*(\.{3}|…)\s*$/, "").trim();
  return (t.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || []).map((s) => s.trim().replace(/[!?]+$/, ".")).filter((s) => s.length > 12);
}
export function cardExcerpt(description, bodyText) {
  const seen = new Set();
  const sents = [...sentencesOf(description), ...sentencesOf(bodyText).slice(0, 8)].filter((s) => (seen.has(s) ? false : seen.add(s)));
  let best = "", bestScore = Infinity, acc = "";
  for (const s of sents.slice(0, 6)) {
    acc = acc ? acc + " " + s : s;
    if (!/\.$/.test(acc)) acc += ".";
    const score = Math.abs(acc.length - EXCERPT_TARGET) + (acc.length > EXCERPT_MAX ? 60 : 0) + (acc.length < EXCERPT_MIN ? 20 : 0);
    if (score < bestScore) { bestScore = score; best = acc; }
    if (acc.length > EXCERPT_MAX) break;
  }
  if (best.length > EXCERPT_MAX + 25) {
    const cut = best.slice(0, EXCERPT_MAX).replace(/[,;:]?\s*[^\s,;:]*$/, "").replace(/[,;:\s]+$/, "");
    best = cut.length > 60 ? cut + "." : best;
  }
  return best || String(description || "");
}

let blogCardsCache = null;
export function blogCards() {
  if (blogCardsCache) return blogCardsCache;
  blogCardsCache = getAllPosts().map(({ slug, data, date }) => {
    const href = pathFromUrl(data.url);
    const img = data.og?.image || null;
    return {
      img,
      imgW: 768,
      imgH: 512,
      category: "",
      title: displayTitle(data).replace(/\s+[-|]\s+BeTranslated$/i, ""),
      description: cardExcerpt(data.metaDescription, data.bodyText),
      date: date || "",
      href,
      slug,
      sponsored: false,
    };
  });
  return blogCardsCache;
}

// Posts related to `slug`: shared title keywords, newest first on ties.
const STOP = new Set("about with from your what translation translations services and the for".split(" "));
const words = (s) => new Set(String(s).toLowerCase().match(/[a-z]{5,}/g)?.filter((w) => !STOP.has(w)) || []);
export function relatedPosts(slug, n = 3) {
  const all = blogCards();
  const self = all.find((p) => p.slug === slug);
  if (!self) return all.slice(0, n);
  const mine = words(self.title + " " + self.description);
  return all
    .filter((p) => p.slug !== slug)
    .map((p, i) => {
      let score = 0;
      for (const w of words(p.title + " " + p.description)) if (mine.has(w)) score += 1;
      return { p, score, i };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, n)
    .map((x) => x.p);
}

export function searchIndex() {
  const items = [];
  const add = (data, kind) => {
    if (!data?.url) return;
    items.push({ title: displayTitle(data), description: data.metaDescription || "", text: (data.bodyText || "").replace(/\s+/g, " ").slice(0, 8000), href: pathFromUrl(data.url), kind });
  };
  for (const f of walkJsonFiles(pagesRoot())) add(readJson(f), "page");
  for (const f of walkJsonFiles(postsRoot())) add(readJson(f), "blog");
  return items;
}

function withSlash(href) {
  const clean = href.split(/[?#]/)[0];
  return clean.endsWith("/") ? clean : clean + "/";
}

export function siteEntries() {
  const seen = new Set();
  const out = [];
  const add = (data, kind) => {
    if (!data?.url) return;
    const href = withSlash(pathFromUrl(data.url));
    if (seen.has(href)) return;
    seen.add(href);
    out.push({ title: displayTitle(data), href, kind });
  };
  for (const f of walkJsonFiles(pagesRoot())) add(readJson(f), "page");
  for (const { data } of getAllPosts()) add(data, "blog");
  return out;
}

export { SITE };
export function canonicalFor(data) {
  if (!data) return null;
  const target = data.canonical || data.url;
  return target ? SITE + pathFromUrl(target) : null;
}
export function alternatesFor(data) {
  return { canonical: canonicalFor(data) };
}
export function metaFor(_locale, _slugParts, data) {
  if (!data) return { title: "", description: "" };
  return { title: data.title, description: data.metaDescription };
}
