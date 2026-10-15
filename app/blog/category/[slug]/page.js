import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategorySlugs, getCategoryArchive } from '@/lib/categories';

export async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const archive = getCategoryArchive(slug, 1);
  if (!archive) return {};
  return {
    title: archive.name + ' | BeTranslated Blog',
    // The live site marks these archive pages noindex (RankMath); matched
    // here rather than inventing different indexing behaviour.
    robots: { index: false, follow: true },
  };
}

export default async function CategoryArchive({ params }) {
  const { slug } = await params;
  const archive = getCategoryArchive(slug, 1);
  if (!archive) notFound();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1>{archive.name}</h1>
      <ul>
        {archive.posts.map(post => (
          <li key={post.url}>
            <Link href={post.url}>{post.title}</Link>
          </li>
        ))}
      </ul>
      {archive.totalPages > 1 ? (
        <p><Link href={'/blog/category/' + slug + '/page/2/'}>Next page</Link></p>
      ) : null}
    </div>
  );
}
