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
// typography instead of the original Divi theme/plugin CSS.
export default function ScrapedPage({ page }) {
  const pageSlug = slugFromUrl(page.url);
  return (
    <main className="page-body">
      <div className="container container--narrow">
        <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(page.bodyHtml, { pageSlug }) }} />
      </div>
    </main>
  );
}
