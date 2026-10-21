import { siteEntries } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap() {
  const urls = new Set(["/"]);
  for (const e of siteEntries()) urls.add(e.href);
  return [...urls].map((href) => ({
    url: SITE + href,
    changeFrequency: /^\/blog\//.test(href) ? "monthly" : "weekly",
    priority: href === "/" ? 1 : 0.7,
  }));
}
