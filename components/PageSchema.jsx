// Renders the page's own scraped JSON-LD graph verbatim (real structured
// data pulled from the live WordPress site at scrape time), rather than
// reconstructing a synthetic one -- avoids inventing pricing/offer data that
// does not apply to this site.
export default function PageSchema({ schema }) {
  if (!schema) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
