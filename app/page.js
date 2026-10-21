import { getHomePage } from '@/lib/content';
import HomePage from '@/components/home/HomePage';

export async function generateMetadata() {
  const page = getHomePage();
  if (!page) return {};
  const ogImage = page.og?.image; // already localized by lib/content.js at read time
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
  return <HomePage locale="en" />;
}
