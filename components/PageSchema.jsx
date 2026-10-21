// Renders the page's own already-scraped JSON-LD verbatim (RankMath/Yoast
// output captured at scrape time) rather than reconstructing a schema graph:
// BTvibe-es's lib/schema.js builds bespoke Product/Offer/sworn-city/
// interpreting-city schema this site has no equivalent content for, and
// inventing pricing/offer data would misrepresent the business.
export default function PageSchema({ schema }) {
  if (!schema) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
