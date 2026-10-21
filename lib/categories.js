import fs from 'fs';
import path from 'path';
import { getPageBySlug, displayTitle } from './content';

const MAP_PATH = path.join(process.cwd(), 'scripts', 'btvibe-uk', 'category-map.json');
const PER_PAGE = 10;

let cache = null;
function loadMap() {
  if (!cache) cache = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  return cache;
}

export function getAllCategorySlugs() {
  return Object.keys(loadMap());
}

export function getCategoryPageCount(slug) {
  const cat = loadMap()[slug];
  if (!cat) return 0;
  return Math.ceil(cat.postSlugs.length / PER_PAGE);
}

// pageNum is 1-based
export function getCategoryArchive(slug, pageNum = 1) {
  const cat = loadMap()[slug];
  if (!cat) return null;
  const start = (pageNum - 1) * PER_PAGE;
  const slice = cat.postSlugs.slice(start, start + PER_PAGE);
  const posts = slice
    .map(postSlug => {
      const page = getPageBySlug(['blog', postSlug]);
      if (!page) return null;
      return {
        url: '/blog/' + postSlug + '/',
        title: displayTitle(page),
        metaDescription: page.metaDescription,
      };
    })
    .filter(Boolean);
  return {
    name: cat.name,
    slug,
    pageNum,
    totalPages: getCategoryPageCount(slug),
    posts,
  };
}
