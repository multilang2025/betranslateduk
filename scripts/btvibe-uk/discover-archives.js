// Discovers every blog category archive URL (+ pagination) and the main
// blog index pagination, by checking real HTTP status rather than guessing
// page counts from post totals (accounts for sticky posts etc.). Writes
// incrementally so a timeout/interrupt doesn't lose progress.
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.betranslated.co.uk';
const OUT_PATH = path.join(__dirname, 'archive-urls.txt');

async function status(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTvibe-uk-scraper/1.0)' }, redirect: 'manual' });
  return res.status;
}

function append(urls) {
  fs.appendFileSync(OUT_PATH, urls.join('\n') + '\n');
}

async function discoverPagination(baseUrl) {
  const urls = [baseUrl];
  let page = 2;
  while (true) {
    const pagedUrl = baseUrl + 'page/' + page + '/';
    const s = await status(pagedUrl);
    if (s !== 200) break;
    urls.push(pagedUrl);
    page++;
    if (page > 50) break; // safety
  }
  return urls;
}

async function run() {
  fs.writeFileSync(OUT_PATH, '');

  const catRes = await fetch(BASE + '/wp-json/wp/v2/categories?per_page=100', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const cats = await catRes.json();
  const liveCats = cats.filter(c => c.count > 0);

  let total = 0;

  const blogPages = await discoverPagination(BASE + '/blog/');
  const blogExtra = blogPages.slice(1); // skip /blog/ itself, already in inventory
  append(blogExtra);
  total += blogExtra.length;
  console.log('blog pagination ->', blogExtra.length, 'extra page(s)');

  for (const cat of liveCats) {
    const catUrls = await discoverPagination(BASE + '/blog/category/' + cat.slug + '/');
    append(catUrls);
    total += catUrls.length;
    console.log(cat.slug, '->', catUrls.length, 'page(s)');
  }

  console.log('\nTotal archive URLs discovered:', total);
}

run();
