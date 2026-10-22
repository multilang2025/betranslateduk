// The one place that names the site origin. Every absolute URL the app emits
// (canonical, sitemap.xml, robots.txt, JSON-LD, Open Graph) is built from SITE.
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://betranslated.co.uk").replace(/\/$/, "");

export const LEGACY_HOST = /^https?:\/\/(?:www\.)?betranslated\.co\.uk(?=[/?#]|$)/i;

export function absUrl(pathOrUrl = "/") {
  const s = String(pathOrUrl);
  if (/^https?:\/\//i.test(s) && !LEGACY_HOST.test(s)) return s;
  const p = s.replace(LEGACY_HOST, "") || "/";
  return SITE + (p.startsWith("/") ? p : "/" + p);
}
