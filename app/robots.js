import { SITE } from "@/lib/site";

// Crawlers are blocked everywhere (preview, local, any new host) unless the
// build sets SITE_ENV=production. Set it only when the site cuts over.
export default function robots() {
  if (process.env.SITE_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE}/sitemap.xml` };
}
