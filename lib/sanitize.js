// Rewrites scraped-HTML internal links/asset refs for the migrated site.
// This is our own vetted Phase 1 scrape output, not third-party input, so the
// original Divi markup/classes/animation-hook attributes are kept verbatim —
// only domain-specific references are repointed to local paths.
import * as cheerio from 'cheerio';
import { KNOWN_EMAIL_FIXES } from './contact-emails';

const OLD_HOSTS = ['www.betranslated.co.uk', 'betranslated.co.uk'];

function rewriteHref(href) {
  if (!href) return href;
  try {
    const u = new URL(href, 'https://www.betranslated.co.uk');
    if (OLD_HOSTS.includes(u.hostname)) {
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

  $('a[href]').each((_, el) => {
    $(el).attr('href', rewriteHref($(el).attr('href')));
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

  // Inline <script> tags inside dangerouslySetInnerHTML never execute in
  // React -- real interactivity is restored by loading the original theme/
  // plugin scripts (captured per-page in headScripts) via next/script.
  $('script').remove();

  // The site's email-obfuscation plugin reverses an address's characters in
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

  return $.html();
}
