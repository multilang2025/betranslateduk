// Data for the /blog/ hub: most popular posts, latest posts and a topic section per group of
// WordPress categories. Popularity is a checked-in file (data/blog-popularity.json) so the hub
// never depends on an analytics call at build time.
import fs from "node:fs";
import path from "node:path";
import { blogCards } from "./content.js";

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));

const POPULAR = 6;
const LATEST = 6;

export function getBlogHub() {
  const cards = blogCards();
  const bySlug = new Map(cards.map((c) => [c.slug, c]));

  const pop = readJson("data/blog-popularity.json");
  const popular = pop.posts
    .map((p) => (bySlug.has(p.slug) ? { ...bySlug.get(p.slug), sessions: p.sessions } : null))
    .filter(Boolean)
    .slice(0, POPULAR);
  const popularSlugs = new Set(popular.map((c) => c.slug));

  // blogCards() is already newest first. Latest skips anything shown under Most popular.
  const latest = cards.filter((c) => !popularSlugs.has(c.slug)).slice(0, LATEST);

  const categoryMap = readJson("scripts/btvibe-uk/category-map.json");
  const catsOfPost = new Map();
  for (const [catSlug, cat] of Object.entries(categoryMap)) {
    for (const postSlug of cat.postSlugs) {
      if (!catsOfPost.has(postSlug)) catsOfPost.set(postSlug, new Set());
      catsOfPost.get(postSlug).add(catSlug);
    }
  }

  const { topics } = readJson("data/blog-topics.json");
  const fallback = topics[topics.length - 1];
  const sections = topics.map((t) => ({ ...t, posts: [] }));
  for (const card of cards) {
    const cats = catsOfPost.get(card.slug) || new Set();
    const home = sections.find((s) => s.categories.some((c) => cats.has(c))) || sections.find((s) => s.id === fallback.id);
    home.posts.push({ ...card, topic: home.name });
  }
  // Biggest topics first, so the chips and sections lead with the most reading.
  sections.sort((a, b) => b.posts.length - a.posts.length);

  const topicOf = new Map();
  sections.forEach((s) => s.posts.forEach((p) => topicOf.set(p.slug, s.name)));
  const tag = (c) => ({ ...c, topic: topicOf.get(c.slug) || "" });

  return {
    popular: popular.map(tag),
    latest: latest.map(tag),
    sections: sections.filter((s) => s.posts.length),
    total: cards.length,
    range: pop.range,
  };
}

// Related posts for a post page: shared keywords, with a bonus for sharing its hub topic, so the
// four shown are about the same subject. Newest first on ties.
const STOP = new Set("about with from your what translation translations services and the for".split(" "));
const wordsOf = (s) => new Set(String(s).toLowerCase().match(/[a-z]{5,}/g)?.filter((w) => !STOP.has(w)) || []);
let hubCache = null;
export function relatedFor(slug, n = 4) {
  hubCache = hubCache || getBlogHub();
  const all = hubCache.sections.flatMap((s) => s.posts);
  const self = all.find((p) => p.slug === slug);
  if (!self) return hubCache.latest.slice(0, n);
  const mine = wordsOf(`${self.title} ${self.description}`);
  return all
    .filter((p) => p.slug !== slug)
    .map((p, i) => {
      let score = p.topic === self.topic ? 4 : 0;
      for (const w of wordsOf(`${p.title} ${p.description}`)) if (mine.has(w)) score += 1;
      return { p, score, i };
    })
    .sort((a, b) => b.score - a.score || String(b.p.date).localeCompare(String(a.p.date)))
    .slice(0, n)
    .map((x) => x.p);
}
