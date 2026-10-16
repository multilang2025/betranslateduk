/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The original site uses trailing-slash URLs everywhere (WordPress
  // default), and every scraped internal link/slug matches that form.
  // Without this, Next.js 308-redirects every single page from its
  // scraped trailing-slash URL to a non-trailing-slash form -- same
  // destination, but it breaks exact URL parity and adds a redirect hop
  // on every request.
  trailingSlash: true,
  async redirects() {
    return [
      {
        // The live site's /blog/page/N/ URLs are a non-canonical WP rewrite
        // artifact: they never 404 regardless of N, and their content is an
        // inconsistent "related posts" widget, not real sequential post
        // pagination (verified: /blog/ itself exposes no pagination UI, and
        // the main blog grid is populated client-side, not server-paginated).
        // Redirecting to the real index instead of porting noise.
        source: '/blog/page/:page*',
        destination: '/blog/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;