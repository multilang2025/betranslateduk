import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPageSlugs } from '@/lib/content';
import { toLocalImagePath } from '@/lib/local-image';
import ScrapedPage from '@/components/ScrapedPage';

export async function generateStaticParams() {
  return getAllPageSlugs()
    .filter(slugParts => slugParts.length > 0)
    .map(slugParts => ({ slug: slugParts }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  const ogImage = toLocalImagePath(page.og?.image);
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: page.canonical ? { canonical: '/' + slug.join('/') + '/' } : undefined,
    openGraph: {
      title: page.og?.title || page.title,
      description: page.og?.description || page.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();
  return <ScrapedPage page={page} />;
}
