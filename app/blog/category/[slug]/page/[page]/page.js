import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategorySlugs, getCategoryArchive, getCategoryPageCount } from '@/lib/categories';

export async function generateStaticParams() {
  const params = [];
  for (const slug of getAllCategorySlugs()) {
    const totalPages = getCategoryPageCount(slug);
    for (let p = 2; p <= totalPages; p++) {
      params.push({ slug, page: String(p) });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, page } = await params;
  const archive = getCategoryArchive(slug, Number(page));
  if (!archive) return {};
  return {
    title: archive.name + ' - Page ' + page + ' | BeTranslated Blog',
    robots: { index: false, follow: true },
  };
}

export default async function CategoryArchivePage({ params }) {
  const { slug, page } = await params;
  const pageNum = Number(page);
  const archive = getCategoryArchive(slug, pageNum);
  if (!archive || pageNum < 2 || pageNum > archive.totalPages) notFound();

  return (
    <main className="page-body">
      <div className="container container--narrow prose">
        <h1>{archive.name}</h1>
        <ul>
          {archive.posts.map(post => (
            <li key={post.url}>
              <Link href={post.url}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <p>
          {pageNum > 2 ? <Link href={'/blog/category/' + slug + '/page/' + (pageNum - 1) + '/'}>Previous page</Link> : <Link href={'/blog/category/' + slug + '/'}>Previous page</Link>}
          {pageNum < archive.totalPages ? <> | <Link href={'/blog/category/' + slug + '/page/' + (pageNum + 1) + '/'}>Next page</Link></> : null}
        </p>
      </div>
    </main>
  );
}
