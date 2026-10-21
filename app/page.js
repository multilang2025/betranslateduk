import { getHomePage } from '@/lib/content';
import { toLocalImagePath } from '@/lib/local-image';
import ScrapedPage from '@/components/ScrapedPage';

export async function generateMetadata() {
  const page = getHomePage();
  if (!page) return {};
  const ogImage = toLocalImagePath(page.og?.image);
  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.og?.title || page.title,
      description: page.og?.description || page.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function Home() {
  const page = getHomePage();
  return <ScrapedPage page={page} slug={[]} />;
}
