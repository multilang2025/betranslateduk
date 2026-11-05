// Closing call-to-action card under a blog post. Copy lives in data/blog-cta/<slug>.json
// ({ heading, text, button }); posts without a file get no card (the sidebar quote card still shows).
import fs from "node:fs";
import path from "node:path";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function ctaCardHtml(slug, { quoteHref, phone, phoneHref }) {
  const file = path.join(process.cwd(), "data", "blog-cta", `${slug}.json`);
  if (!fs.existsSync(file)) return "";
  const cta = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!cta.heading || !cta.text) return "";
  return (
    `<aside class="post-cta"><div class="post-cta__text"><h3>${esc(cta.heading)}</h3><p>${esc(cta.text)}</p></div>` +
    `<div class="post-cta__actions"><a class="bt-btn bt-btn--primary" href="${esc(quoteHref)}">${esc(cta.button || "Get a free quote")}</a>` +
    `<a class="post-cta__contact" href="${esc(phoneHref)}">Call us on ${esc(phone)}</a></div></aside>`
  );
}
