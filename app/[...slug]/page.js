import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPageSlugs, NOINDEX_SLUGS } from '@/lib/content';
import ScrapedPage from '@/components/ScrapedPage';
import { ogMetadataFor } from '@/lib/og';

export async function generateStaticParams() {
  return getAllPageSlugs()
    .filter(slugParts => slugParts.length > 0)
    .map(slugParts => ({ slug: slugParts }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    ...(NOINDEX_SLUGS.has(slug.join('/')) ? { robots: { index: false, follow: false } } : {}),
    alternates: page.canonical ? { canonical: '/' + slug.join('/') + '/' } : undefined,
    ...ogMetadataFor(page, slug),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();
  return <ScrapedPage page={page} slug={slug} />;
}
