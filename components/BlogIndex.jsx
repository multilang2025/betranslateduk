import { blogCards } from "../lib/content";
import { t } from "../lib/i18n";
import BlogList from "./BlogList";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { Kicker } from "./StdHero";
import CtaBand from "./CtaBand";
import PageSchema from "./PageSchema";

const MORE = { es: "Mostrar más artículos", en: "Show more articles", fr: "Afficher plus" };
const ALL = { es: "Todos", en: "All", fr: "Tous" };
const BROWSE = { es: "Explora el blog por temas", en: "Browse the blog by topic", fr: "Parcourir le blog par thème" };

export default function BlogIndex({ locale = "es", h1, title, description }) {
  const ui = t(locale);
  const cards = blogCards(locale);
  return (
    <main>
      <PageSchema locale={locale} path={ui.blogHref} title={title || ui.blogTitle} description={description} crumb={ui.blogTitle} pageType="CollectionPage" />
      <StdHero locale={locale}>
          <Breadcrumbs locale={locale} pathname={ui.blogHref} current={ui.blogTitle} />
          <Kicker locale={locale} path={ui.blogHref} />
          <h1>{h1 || ui.blogTitle}</h1>
          {ui.blogLead ? <p className="lead page-hero__tagline">{ui.blogLead}</p> : null}
          {ui.blogIntro ? <p className="page-hero__sub">{ui.blogIntro}</p> : null}
          {ui.blogTopics ? <ul className="blog-topics">{ui.blogTopics.map((x) => <li key={x}>{x}</li>)}</ul> : null}
      </StdHero>
      <section className="section">
        <div className="container">
          <BlogList
            cards={cards}
            locale={locale}
            labels={{ browse: BROWSE[locale] || BROWSE.es, latest: ui.blogLatest, filter: ui.blogFilter, countTpl: ui.blogCount("{n}"), none: ui.blogNone, all: ALL[locale] || ALL.es, more: ui.readMore, loadMore: MORE[locale] || MORE.es }}
          />
        </div>
      </section>
      <CtaBand locale={locale} />
    </main>
  );
}
