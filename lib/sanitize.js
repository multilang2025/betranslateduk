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
    const rewritten = style.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, url) => `url(${q}${rewriteImgSrc(url)}${q})`);
    $(el).attr('style', rewritten);
  });

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