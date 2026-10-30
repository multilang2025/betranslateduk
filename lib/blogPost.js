// Helpers for a single blog post page: tidy the scraped body, count reading time from what is
// actually shown, and look up the "Updated" date (data/blog-updated.json, written by
// scripts/blog-updated-dates.mjs).
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { splitLongParagraph } from "./sanitize.js";

const WORDS_PER_MINUTE = 230;

// The scrape ends every post with the same five linked thumbnails (a WordPress "related posts"
// widget) and a stray "CONTACT US" label. The related-articles section below the post replaces them.
export function dropRelatedWidget(html) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  const flat = (s) => s.replace(/\s+/g, " ").trim();
  $("#r p").each((_, p) => {
    const el = $(p);
    const a = el.children("a");
    const toPost = a.length === 1 && /^\/blog\/[^/]+\/?$/.test(a.attr("href") || "");
    if (toPost && a.find("img").length && flat(el.text()) === flat(a.text())) el.remove();
  });
  $("#r > p").each((_, p) => {
    if (/^contact us$/i.test(flat($(p).text()))) $(p).remove();
  });
  return $("#r").html();
}

// Long paragraphs are split at sentence ends so a post never reads as a wall of text.
export function splitLongParagraphs(html, opts = { max: 420, target: 300 }) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  $("#r > p").each((_, p) => {
    const inner = $(p).html() || "";
    const parts = splitLongParagraph(inner, opts);
    if (parts.length > 1) $(p).replaceWith(parts.map((x) => `<p>${x}</p>`).join(""));
  });
  return $("#r").html();
}

export function readingMinutes(html) {
  const $ = cheerio.load(`<div id="r">${html}</div>`, null, false);
  $("#r style, #r script").remove();
  const text = $("#r").text();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

let updated = null;
export function updatedDate(slug) {
  if (!updated) updated = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "blog-updated.json"), "utf8"));
  return updated[slug] || null;
}

// Sets dateModified in the post's schema so search engines see the same date as readers.
export function withModified(schema, iso) {
  if (!iso || !Array.isArray(schema)) return schema;
  return schema.map((s) => {
    const graph = s["@graph"];
    if (!graph) return s.dateModified ? { ...s, dateModified: iso } : s;
    return { ...s, "@graph": graph.map((n) => (n.dateModified ? { ...n, dateModified: iso } : n)) };
  });
}
