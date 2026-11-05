// The one place that names the site origin. Every absolute URL the app emits
// (canonical, sitemap.xml, robots.txt, JSON-LD, Open Graph) is built from SITE.
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://betranslated.co.uk").replace(/\/$/, "");

// Site images (the old WordPress uploads and the page illustrations) live in the public Supabase bucket
// betranslated-uk-images, under the same paths as public/ ("/images/..." and "/img/..."), so a plain prefix
// maps one to the other. NEXT_PUBLIC_IMAGES_URL overrides the base; set it to an empty string to serve
// /images and /img from public/ again (for example offline, or before the upload has run).
export const IMAGES_BASE = (process.env.NEXT_PUBLIC_IMAGES_URL ?? "https://nlrpizplminaccqlaved.supabase.co/storage/v1/object/public/betranslated-uk-images").replace(/\/$/, "");
const IMG_PATH = /^\/(?:images|img)\//;
// Object key of a site path in the bucket. Three old uploads have a "ç" in the file name and the content
// refers to them as "ç", "%C3%A7" or "%25C3%25A7"; Storage keys stay ASCII, so every form is decoded and
// maps to the same key ("fran_ais"). tools/upload-images.mjs uses this too, so both sides always agree.
export function objectKey(p) {
  let s = String(p);
  for (let i = 0; i < 3; i++) {
    try {
      const d = decodeURIComponent(s);
      if (d === s) break;
      s = d;
    } catch {
      break;
    }
  }
  return s.replace(/[^A-Za-z0-9._\/-]/g, "_");
}
export const imgUrl = (p) => (IMAGES_BASE && typeof p === "string" && IMG_PATH.test(p) ? IMAGES_BASE + objectKey(p) : p);
export const unImg = (src) => (IMAGES_BASE && typeof src === "string" && src.startsWith(IMAGES_BASE + "/") ? src.slice(IMAGES_BASE.length) : src);
// Every attribute value or CSS url() in a chunk of HTML that starts with /images/ or /img/.
export const imgHtml = (html) =>
  IMAGES_BASE && html ? html.replace(/(["'(\s,=])(\/(?:images|img)\/[^"'\s)<>,]*)/g, (_, pre, p) => pre + IMAGES_BASE + objectKey(p)) : html;

export const LEGACY_HOST = /^https?:\/\/(?:www\.)?betranslated\.co\.uk(?=[/?#]|$)/i;

export function absUrl(pathOrUrl = "/") {
  const s = String(pathOrUrl);
  if (/^https?:\/\//i.test(s) && !LEGACY_HOST.test(s)) return s;
  const p = s.replace(LEGACY_HOST, "") || "/";
  return SITE + (p.startsWith("/") ? p : "/" + p);
}
