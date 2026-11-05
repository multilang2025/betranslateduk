import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { IMAGES_BASE } from "./site.js";
import { SITE, cleanTitle, pathFromUrl, canonicalFor, getPageBySlug, getHomePage, getAllPageSlugs, postDate } from "./content";
import { sentenceCase } from "./sentenceCase.js";
import { HERO_IMAGE_SLUGS } from "./heroImages.js";
import { RATING } from "./business.js";

// Open Graph / Twitter metadata and share-card content for every page, as on
// betranslated.es (lib/og.js there): page-specific title and description,
// og:url = canonical, one 1200x630 image per page with a written alt text,
// og:type article (+ article:*) for blog posts and twitter:card
// summary_large_image. No twitter:site: BeTranslated UK links no X account.
//
// The images are rendered by app/og/[...path]/route.js from ogCard() below,
// at build time, to /og/<path>.jpg (home: /og/home.jpg).

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
// Bump when the card design changes: it is part of every image URL's ?v=
// hash, so social networks refetch the new design.
const DESIGN_VERSION = 1;

export const OG_LOCALE = "en_GB";

const HOME_H1 = "Your UK translation agency for business growth worldwide";
const HOME_SUB = "Certified, legal, business and technical translation and interpreting since 2002";
const PROOF = `${RATING.value.toFixed(1)} · ${RATING.count} Google reviews`;

// Published path of a page's share image (without the ?v= hash).
export function ogImagePath(parts) {
  return `/og/${parts.length ? parts.join("/") : "home"}.jpg`;
}

// Every page that gets a share image: the home page and every page and post
// the site renders (the same list as generateStaticParams in [...slug]).
export function ogAllPages() {
  return [[], ...getAllPageSlugs().filter((p) => p.length > 0)];
}

// Kicker: the page's section, by URL.
const TOP = {
  "translation-services": "Translation services",
  languages: "Language pairs",
  industry: "Industries",
  "translation-agency": "About BeTranslated",
  "document-translation-services": "Document translation",
  translators: "Our translators",
  "contact-us": "Contact",
  "terms-conditions": "Legal information",
  "thank-you": "BeTranslated",
  blog: "Blog",
};

function kickerFor(parts) {
  const [a, b, c] = parts;
  if (!parts.length) return "UK translation agency";
  if (a === "translation-services") {
    if (b === "england") return c ? "Translation in England" : "Translation across England";
    if (/interpret/.test(b || "")) return "Interpreting";
    return "Translation services";
  }
  if (a === "languages" && b) return "Language services";
  return TOP[a] || "Translation services";
}

// Language-pair motif (two documents with language chips) for cards without
// a photo; the target code comes from a language page's slug.
const LANG_CODE = { spanish: "ES", french: "FR", german: "DE", dutch: "NL", italian: "IT", portuguese: "PT", korean: "KO", english: "EN" };
const HELLO = { ES: "Hola", EN: "Hello", FR: "Bonjour", DE: "Hallo", NL: "Hallo", IT: "Ciao", PT: "Olá" };
function pairArt(parts) {
  let tgt = "ES";
  if (parts[0] === "languages" && parts[1]) {
    const w = parts[1].split("-")[0];
    if (LANG_CODE[w] && LANG_CODE[w] !== "EN") tgt = LANG_CODE[w];
  }
  return { src: "EN", tgt, from: HELLO.EN, to: HELLO[tgt] || null };
}

// A subtitle of at most ~max characters: the first sentence, cut at a clause
// break when it is longer. No trailing full stop (it reads as a tagline).
function shortSub(text, max = 96) {
  let s = String(text || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const first = s.match(/^.+?[.!?](?=\s|$)/);
  if (first && first[0].length >= 40) s = first[0];
  s = s.replace(/[.!?]+$/, "");
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const at = Math.max(cut.lastIndexOf(", "), cut.lastIndexOf(": "), cut.lastIndexOf(" - "), cut.lastIndexOf("; "));
  if (at > 50) return cut.slice(0, at);
  return cut.replace(/\s+\S*$/, "").replace(/\s+(for|and|or|the|of|to|in|with|a|an|on|at|by)$/i, "") + "…";
}

// "Translation Agency UK - Business and Technical Translation" -> head + tail.
function splitTitle(title) {
  const t = cleanTitle(title || "");
  const [head, ...rest] = t.split(/\s+[|–]\s+|\s+-\s+/);
  return { head, tail: rest.join(" - ").trim() };
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// The card photo: a local file under public/ (hero photo of a city page, or
// the page's og:image from the scrape); site logos and icons do not count.
function photoFor(parts, data) {
  const hero = HERO_IMAGE_SLUGS[parts.join("/")];
  const cand = hero ? hero.src : data?.og?.image;
  if (!cand || !cand.startsWith("/") || /logo|BeTranslated-h|favicon/i.test(cand)) return null;
  if (!IMAGES_BASE && !fs.existsSync(path.join(process.cwd(), "public", cand))) return null;
  return { src: cand, alt: hero?.alt || "" };
}

// Everything the share card and the alt text need for one page.
export function ogCard(parts) {
  const data = parts.length ? getPageBySlug(parts) : getHomePage();
  const isPost = parts[0] === "blog" && parts.length === 2;
  const title = data?.title || "";
  const description = data?.metaDescription || "";
  const { head, tail } = splitTitle(title);
  let headline, sub;
  if (!parts.length) {
    headline = HOME_H1; sub = HOME_SUB;
  } else {
    headline = sentenceCase(head);
    sub = (tail && !/betranslated|quote/i.test(tail) && tail.length > 12 ? tail : "") || shortSub(description);
  }
  headline = cap(String(headline || "BeTranslated").replace(/\s+/g, " ").trim());
  sub = shortSub(sub, 96);
  if (sub && sub.toLowerCase() === headline.toLowerCase()) sub = "";
  const kicker = kickerFor(parts);
  const photo = photoFor(parts, data);
  const image = photo?.src || null;
  const alt = photo?.alt ? `${photo.alt}: ${headline}` : sub ? `${headline} - ${sub}` : `${headline} - ${kicker}`;
  const art = pairArt(parts); // also the fallback when the photo cannot be fetched
  const interpreting = kicker === "Interpreting";
  const card = { headline, sub, kicker, image, art, interpreting, proof: PROOF };
  const v = crypto.createHash("sha1").update(JSON.stringify([DESIGN_VERSION, card])).digest("hex").slice(0, 10);
  return { ...card, alt, kind: isPost ? "post" : "page", published: isPost ? postDate(data) : null, title, description, version: v };
}

// --- Metadata ----------------------------------------------------------

// openGraph + twitter fragment for generateMetadata(). `data` carries the
// page's own title and metaDescription (the page's <title> and meta
// description, so og:title/og:description match them exactly).
export function ogMetadataFor(data, parts) {
  if (!data) return {};
  const card = ogCard(parts);
  const url = canonicalFor(data) || SITE + (parts.length ? "/" + parts.join("/") + "/" : "/");
  const title = data.title || card.title || card.headline;
  const description = data.metaDescription || card.description || card.sub;
  const imageUrl = `${SITE}${ogImagePath(parts)}?v=${card.version}`;
  const isPost = card.kind === "post";
  const toIso = (d) => (d ? new Date(d.length === 10 ? d + "T00:00:00Z" : d).toISOString() : undefined);

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: "BeTranslated",
      locale: OG_LOCALE,
      type: isPost ? "article" : "website",
      ...(isPost && card.published ? { publishedTime: toIso(card.published), modifiedTime: toIso(card.published) } : {}),
      images: [{ url: imageUrl, width: OG_WIDTH, height: OG_HEIGHT, alt: card.alt, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: card.alt }],
    },
  };
}

export { pathFromUrl };
