// Phase 1 verbatim scraper for betranslated.co.uk -> Btvibe-uk
// Usage: node scripts/btvibe-uk/scrape.js [pages|posts|all]
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'output');
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');
const BASE = 'https://www.betranslated.co.uk';

function urlToOutPath(url, kind) {
  const u = new URL(url);
  let p = u.pathname.replace(/^\/|\/$/g, '');
  if (kind === 'posts') p = p.replace(/^blog\//, '');
  if (p === '') return path.join(OUT, 'pages', 'index.json');
  return path.join(OUT, kind, p + '.json');
}

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  return {
    sourceDomain: BASE,
    scrapeMethod: 'raw fetch + cheerio DOM extraction',
    started: new Date().toISOString(),
    totals: { pages: { total: 0, done: 0 }, posts: { total: 0, done: 0 } },
    notes: [],
    skipped: [],
  };
}

function saveManifest(m) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

function extractField(html, url) {
  const $ = cheerio.load(html);

  const title = $('head > title').first().text().trim();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';

  const htmlLang = $('html').attr('lang') || '';
  const bodyClass = $('body').attr('class') || '';

  // Divi generates per-page dynamic CSS files + inline <style> blocks in <head>.
  // Capture all of it so Phase 2 can port the real visual/animation styling, not an approximation.
  const headStylesheets = [];
  $('head link[rel="stylesheet"], head link[rel="preload"][as="style"]').each((_, el) => {
    headStylesheets.push({ id: $(el).attr('id') || '', href: $(el).attr('href') || '' });
  });

  const headInlineStyles = [];
  $('head style').each((_, el) => {
    headInlineStyles.push({ id: $(el).attr('id') || '', css: $(el).contents().text() });
  });

  const headScripts = [];
  $('script[src]').each((_, el) => {
    headScripts.push({ id: $(el).attr('id') || '', src: $(el).attr('src') || '' });
  });

  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';

  const schema = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const txt = $(el).contents().text();
    try { schema.push(JSON.parse(txt)); } catch (e) { schema.push({ parseError: true, raw: txt }); }
  });

  // Capture the FULL body, not just an inner content area: Divi's Theme
  // Builder renders header/nav/footer/widgets as separate template regions
  // outside #content, and most of the theme's CSS is scoped to classes on
  // <body> itself (body.et_fixed_nav etc.) -- narrowing to a content
  // selector silently drops the entire chrome and most styling.
  const main = $('body');

  const bodyHtml = main.html() || '';

  const blockSelector = 'p,div,li,h1,h2,h3,h4,h5,h6,br,tr,blockquote';
  main.find(blockSelector).each((_, el) => {
    $(el).after('\n');
  });
  const bodyText = main.text().replace(/[ \t]+/g, ' ').split('\n').map(l => l.trim()).filter(Boolean).join('\n');

  const links = [];
  main.find('a[href]').each((_, el) => {
    links.push({ href: $(el).attr('href'), text: $(el).text().trim() });
  });

  const images = [];
  main.find('img').each((_, el) => {
    images.push({
      src: $(el).attr('src') || $(el).attr('data-src') || '',
      alt: $(el).attr('alt') || '',
      width: $(el).attr('width') || '',
      height: $(el).attr('height') || '',
    });
  });

  const needsBrowserRender = /cookie(bot|-notice|-law-info)|cmplz|cky-consent/i.test(html) && bodyHtml.length < 200;

  return {
    url,
    title,
    metaDescription,
    htmlLang,
    bodyClass,
    headStylesheets,
    headInlineStyles,
    headScripts,
    bodyHtml,
    bodyText,
    links,
    canonical,
    images,
    og: { image: ogImage, title: ogTitle, description: ogDescription, twitterCard },
    schema,
    needsBrowserRender,
  };
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTvibe-uk-scraper/1.0)' },
    redirect: 'follow',
  });
  const status = res.status;
  const finalUrl = res.url;
  const html = await res.text();
  return { status, finalUrl, html };
}

async function scrapeOne(url, kind, manifest) {
  const outPath = urlToOutPath(url, kind);
  try {
    const { status, finalUrl, html } = await fetchUrl(url);
    if (status >= 400) {
      manifest.skipped.push({ url, kind, reason: 'HTTP ' + status });
      console.log('SKIP ' + status + ' ' + url);
      return false;
    }
    if (finalUrl !== url && new URL(finalUrl).pathname !== new URL(url).pathname) {
      manifest.notes.push('Redirect: ' + url + ' -> ' + finalUrl + ' (' + new Date().toISOString() + ')');
    }
    const data = extractField(html, url);
    if (data.needsBrowserRender) {
      manifest.notes.push('needsBrowserRender flagged for ' + url + ' (' + new Date().toISOString() + ')');
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log('OK   ' + url);
    return true;
  } catch (err) {
    manifest.skipped.push({ url, kind, reason: 'fetch error: ' + err.message });
    console.log('FAIL ' + url + ': ' + err.message);
    return false;
  }
}

async function run() {
  const which = process.argv[2] || 'all';
  const manifest = loadManifest();

  const lists = {};
  if (which === 'all' || which === 'pages') {
    lists.pages = fs.readFileSync(path.join(ROOT, 'pages-urls.txt'), 'utf8').trim().split('\n').filter(Boolean);
  }
  if (which === 'all' || which === 'posts') {
    lists.posts = fs.readFileSync(path.join(ROOT, 'posts-urls.txt'), 'utf8').trim().split('\n').filter(Boolean);
  }

  for (const [kind, urls] of Object.entries(lists)) {
    manifest.totals[kind].total = urls.length;
    let done = 0;
    for (const url of urls) {
      const ok = await scrapeOne(url, kind, manifest);
      if (ok) done++;
      saveManifest(manifest);
    }
    manifest.totals[kind].done = done;
  }

  manifest.lastRun = new Date().toISOString();
  saveManifest(manifest);
  console.log('\nDone.', JSON.stringify(manifest.totals));
}

run();
