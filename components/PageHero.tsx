import type { InnerPage } from "@/content/pages";

/** Inner-page hero: the homepage hero's navy, teal blobs, Fraunces heading and orange marker, without the photo bubble. */
export function PageHero({ page }: { page: InnerPage }) {
  const { hero, crumbs } = page;
  return (
    <section className="phero" aria-labelledby="page-title">
      <div className="container-bt">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => (
              <li key={c.label}>
                {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true"> / </span>}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow-text">{hero.eyebrow}</p>
        <h1 id="page-title">
          {hero.before} <span className="mark">{hero.mark}</span> {hero.after}
        </h1>
        <p className="lede">{hero.intro}</p>
        <a className="btn-primary" href={hero.button.href}>
          {hero.button.label}
        </a>
      </div>
    </section>
  );
}
