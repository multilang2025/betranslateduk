import { sanitizeBodyHtml } from '@/lib/sanitize';

function slugFromUrl(url) {
  try {
    return new URL(url).pathname.replace(/^\/|\/$/g, '');
  } catch (e) {
    return '';
  }
}

// Generic renderer for any scraped page: the real scraped content (verbatim,
// including its own on-page H1), restyled with the new design system's
// typography. sanitizeBodyHtml already bands the content into <section>s
// that mirror Divi's own section/row/column structure, so this just renders
// that output -- no extra wrapper needed.
export default function ScrapedPage({ page }) {
  const pageSlug = slugFromUrl(page.url);
  return <div dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(page.bodyHtml, { pageSlug }) }} />;
}
