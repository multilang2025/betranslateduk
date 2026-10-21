// Rewrites scraped-HTML internal links/asset refs for the migrated site.
// This is our own vetted Phase 1 scrape output, not third-party input, so the
// original Divi markup/classes/animation-hook attributes are kept verbatim --
// only domain-specific references are repointed to local paths.
import * as cheerio from 'cheerio';
import { KNOWN_EMAIL_FIXES } from './contact-emails';

const OLD_HOSTS = ['www.betranslated.co.uk', 'betranslated.co.uk'];

function rewriteHref(href) {
  if (!href) return href;
  try {
    const u = new URL(href, 'https://www.betranslated.co.uk');
    if (OLD_HOSTS.includes(u.hostname)) {
      // Downloadable uploads (infographics, PDFs) were mirrored under
      // /images/, not served at their original /wp-content/ path.
      if (u.pathname.startsWith('/wp-content/uploads/')) {
        return '/images' + u.pathname + u.search + u.hash;
      }
      return u.pathname + u.search + u.hash;
    }
    return href; // external link (incl. mailto:) -- kept verbatim per playbook rule
  } catch (e) {
    return href; // relative path, mailto:, tel:, #anchor -- leave as-is
  }
}

function rewriteImgSrc(src) {
  if (!src) return src;
  try {
    const u = new URL(src, 'https://www.betranslated.co.uk');
    if (OLD_HOSTS.includes(u.hostname)) {
      return '/images' + u.pathname;
    }
    return src;
  } catch (e) {
    if (src.startsWith('/wp-content/') || src.startsWith('wp-content/')) {
      return '/images/' + src.replace(/^\//, '');
    }
    return src;
  }
}

// Unwraps every <div> under `root` (deepest first, so a parent unwrapped
// later still picks up its child's already-flattened contents), replacing
// Divi's page-builder div soup (section/row/column/module wrapper divs --
// none of them carry real content, only layout) with the real content tags
// they wrap (h1-h6, p, ul/ol/li, a, img, svg, strong, em, blockquote, table).
function unwrapDivs($, scope) {
  for (let pass = 0; pass < 25; pass++) {
    const divs = scope.find('div').toArray();
    if (!divs.length) break;
    divs
      .sort((a, b) => $(b).parents().length - $(a).parents().length)
      .forEach((el) => $(el).replaceWith($(el).contents()));
  }
}

// Divi lays out every page as section > row > column(s), with the real
// content several wrapper-div levels deep inside each column. This maps
// that same authored structure onto the new design system's own section
// primitives, with no change to the content or its order:
//  - each top-level section becomes a `.section` band (first one `.page-hero`,
//    the rest alternating white/`.section--tint`)
//  - a row with 2+ columns becomes a `.split` grid (one column per side);
//    a single-column row flattens straight into the section
function structureIntoSections($, root) {
  const sections = root.find('.et_pb_section').toArray();
  if (!sections.length) {
    // No Divi grid found (e.g. an already-flat page): one plain band.
    unwrapDivs($, root);
    const inner = root.html() || '';
    root.empty().append(`<section class="page-hero"><div class="container prose">${inner}</div></section>`);
    return;
  }

  const bands = [];
  let seenContent = false;
  sections.forEach((sectionEl) => {
    const $section = $(sectionEl);
    let inner = '';
    $section.children('.et_pb_row, [class*="et_pb_row_"]').each((_, rowEl) => {
      const $row = $(rowEl);
      const columns = $row.children('[class*="et_pb_column"]').toArray();
      if (columns.length > 1) {
        const cols = columns.map((col) => {
          unwrapDivs($, $(col));
          return `<div>${$(col).html() || ''}</div>`;
        }).join('');
        inner += `<div class="split">${cols}</div>`;
      } else {
        columns.forEach((col) => {
          unwrapDivs($, $(col));
          inner += $(col).html() || '';
        });
      }
    });
    if (!inner.replace(/<[^>]+>/g, '').trim() && !/<img|<svg/i.test(inner)) return; // skip empty decorative sections
    const isHero = !seenContent;
    seenContent = true;
    bands.push(`<section class="${isHero ? 'page-hero' : 'section' + (bands.length % 2 ? ' section--tint' : '')}"><div class="container prose">${inner}</div></section>`);
  });

  root.empty().append(bands.join(''));
}

export function sanitizeBodyHtml(bodyHtml, { pageSlug } = {}) {
  const $ = cheerio.load(bodyHtml, null, false);

  // The scrape captures the full body (header/nav/#main-content/footer); the
  // redesign supplies its own header/footer chrome (components/chrome), so
  // only the real per-page content area is kept.
  const main = $('#main-content');
  const root = main.length ? main : $.root();

  $('a[href]').each((_, el) => {
    $(el).attr('href', rewriteHref($(el).attr('href')));
  });

  // WP's search form (and any other <form action="...">) hardcodes an
  // absolute URL to the live site -- not an <a href>, so the rewrite above
  // never touches it. Submitting the header search box would otherwise
  // silently post to the old domain.
  $('form[action]').each((_, el) => {
    $(el).attr('action', rewriteHref($(el).attr('action')));
  });

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) $(el).attr('src', rewriteImgSrc(src));
    $(el).removeAttr('data-src');
    if ($(el).attr('srcset')) {
      const rewritten = $(el).attr('srcset').split(',').map(part => {
        const [u, size] = part.trim().split(/\s+/);
        return [rewriteImgSrc(u), size].filter(Boolean).join(' ');
      }).join(', ');
      $(el).attr('srcset', rewritten);
    }
  });

  // Divi's decorative SVG photo-masks embed the image via an <image href>
  // (and sometimes xlink:href), not an <img src> -- the loop above never
  // touches it, so these photos kept pointing at the live domain.
  $('image[href], image[xlink\\:href]').each((_, el) => {
    if ($(el).attr('href')) $(el).attr('href', rewriteImgSrc($(el).attr('href')));
    if ($(el).attr('xlink:href')) $(el).attr('xlink:href', rewriteImgSrc($(el).attr('xlink:href')));
  });

  // Inline <script> tags never execute in dangerouslySetInnerHTML, and the
  // per-module <style> tags duplicate what's already in headInlineStyles
  // (no longer loaded) -- both are dropped. Inline style="" attributes are
  // kept verbatim (SVG fills/patterns, decorative masks, etc. depend on
  // them); only a background-image pointing at the old domain is repointed.
  $('script, style').remove();
  $('[style*="url("]').each((_, el) => {
    const style = $(el).attr('style');
    // A bare "#id" is an in-page SVG reference (fill: url(#gradient), a
    // <pattern>/<mask> def), not an image -- only rewrite real asset URLs.
    const rewritten = style.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, url) =>
      url.startsWith('#') ? m : `url(${q}${rewriteImgSrc(url)}${q})`);
    $(el).attr('style', rewritten);
  });

  // Real CTA buttons (an <a class="et_pb_button">), not styled generic links.
  $('a.et_pb_button').addClass('bt-btn bt-btn--primary');

  structureIntoSections($, root);

  // The site email-obfuscation plugin reverses an address characters in
  // the DOM (relying on CSS direction:rtl to display it correctly), split
  // across many small spans -- unrecoverable by a generic string rewrite.
  // Known-broken instances are patched with the real, verified address.
  const fix = KNOWN_EMAIL_FIXES[pageSlug];
  if (fix) {
    for (const { match, email, label } of fix) {
      let smallest = null;
      $('*').each((_, el) => {
        const node = $(el);
        if (node.text().includes(match)) {
          if (!smallest || node.text().length < smallest.text().length) smallest = node;
        }
      });
      if (smallest) smallest.replaceWith('<a href="mailto:' + email + '">' + (label || email) + '</a>');
    }
  }

  return root.html() || '';
}