// Language pages whose sector "leaf" pages are merged into the parent page
// (/languages/<language>-translation-services/). Each leaf URL redirects to
// the parent's anchor, its content renders as a section of the parent, and the
// leaf is left out of the sitemap, the search index and the page list.
// Pure fs and path, so next.config.mjs can import it too.
import fs from "node:fs";
import path from "node:path";

export const MERGED_LANGUAGES = ["korean", "french", "german", "spanish"];
const PAGES = path.join(process.cwd(), "scripts", "btvibe-uk", "output", "pages");

let cached = null;
// [{ parent: "languages/korean-translation-services", slug, id, file, from, to }]
export function leafPages() {
  if (cached) return cached;
  cached = [];
  for (const lang of MERGED_LANGUAGES) {
    const parent = `languages/${lang}-translation-services`;
    const dir = path.join(PAGES, ...parent.split("/"));
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".json") && n !== "index.json").sort()) {
      const slug = f.replace(/\.json$/, "");
      const id = slug.startsWith(`${lang}-`) ? slug : `${lang}-${slug}`;
      cached.push({ parent, lang, slug, id, file: path.join(dir, f), from: `/${parent}/${slug}/`, to: `/${parent}/#${id}` });
    }
  }
  return cached;
}

export const leafFiles = () => new Set(leafPages().map((l) => l.file));
export const leavesOf = (parentKey) => leafPages().filter((l) => l.parent === parentKey);
export function leafHrefTarget(href) {
  if (!href) return null;
  const clean = href.split(/[?#]/)[0].replace(/\/?$/, "/");
  return leafPages().find((l) => l.from === clean)?.to || null;
}

// next.config.mjs redirects: permanent, leaf URL -> parent section.
export function leafRedirects() {
  return leafPages().map((l) => ({ source: l.from, destination: l.to, permanent: true }));
}
