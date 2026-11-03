import { getHomePage } from '@/lib/content';
import HomePage from '@/components/home/HomePage';
import { ogMetadataFor } from '@/lib/og';

export async function generateMetadata() {
  const page = getHomePage();
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    ...ogMetadataFor(page, []),
  };
}

export default function Home() {
  return <HomePage locale="en" />;
}
