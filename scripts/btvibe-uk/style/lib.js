// Shared helpers for scripted style passes over the scraped content JSON.
// Edits only visible text nodes (never script/style/svg/attributes) in
// bodyHtml, plus bodyText, title, metaDescription and og title/description.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'output');

function listJson(dir = OUT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) listJson(f, acc);
    else if (e.name.endsWith('.json')) acc.push(f);
  }
  return acc;
}

const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'textarea', 'code', 'pre']);

// Applies fn(text) to every visible text node, splitting the raw markup
// on tags so everything outside text nodes stays byte-identical.
// Returns [html, changes[]].
function mapHtml(html, fn, field = 'body') {
  const changes = [];
  let skip = 0;
  const parts = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i % 2 === 1) {
      const m = /^<(\/?)([a-zA-Z0-9]+)/.exec(p);
      if (m && SKIP.has(m[2].toLowerCase()) && !/\/>$/.test(p)) skip += m[1] ? -1 : 1;
    } else if (skip <= 0 && p) {
      const next = fn(p, field);
      if (next !== p) { changes.push([p, next]); parts[i] = next; }
    }
  }
  return [parts.join(''), changes];
}

// Runs fn over every text field of every page. Writes files unless dry.
function run(fn, { dry = false } = {}) {
  const report = [];
  for (const f of listJson()) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (!j.url) continue;
    const changes = [];
    if (j.bodyHtml) {
      const [h, c] = mapHtml(j.bodyHtml, fn, 'body');
      j.bodyHtml = h; changes.push(...c);
    }
    for (const k of ['bodyText', 'title', 'metaDescription']) {
      if (typeof j[k] === 'string') {
        const n = fn(j[k], k);
        if (n !== j[k]) { changes.push([j[k], n]); j[k] = n; }
      }
    }
    if (j.og) for (const k of ['title', 'description']) {
      if (typeof j.og[k] === 'string') {
        const n = fn(j.og[k], 'og.' + k);
        if (n !== j.og[k]) { changes.push([j.og[k], n]); j.og[k] = n; }
      }
    }
    if (changes.length) {
      report.push({ file: path.relative(OUT, f), url: j.url, changes });
      if (!dry) fs.writeFileSync(f, JSON.stringify(j, null, 2));
    }
  }
  return report;
}

// CLI helper: node pass.js [--write]
const WRITE = process.argv.includes('--write');

module.exports = { WRITE, run, mapHtml, listJson, OUT };
