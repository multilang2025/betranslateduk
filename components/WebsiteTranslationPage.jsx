import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF } from "@/lib/business";
import { imgUrl } from "@/lib/site";
import PAGE from "@/data/website-translation-page.json";
import { ICON } from "./industryIcons";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import WebsiteHeroArt from "./WebsiteHeroArt";
import CtaBand from "./CtaBand";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const Icon = ({ name, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name]} /></svg>
);

// Rendered instead of the generic scraped layout for /translation-services/website-translation/: browser-window
// hero, intro with languages, what we translate, how to send content, why, partial vs full and the FAQ.
// Copy lives in data/website-translation-page.json (lifted from the live page).
export default function WebsiteTranslationPage({ page, title }) {
  return (
    <main className="wt-page" data-page="website-translation" data-slug="translation-services/website-translation">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<WebsiteHeroArt />}>
        <Breadcrumbs pathname="/translation-services/website-translation/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{page.metaDescription}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="wt-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section wt-intro">
        <div className="container">
          <div className="wt-intro__grid">
            <div className="wt-intro__text">
              <h2>{PAGE.intro.title}</h2>
              {PAGE.intro.paras.map((p) => <p key={p}>{p}</p>)}
              <p className="wt-intro__label">{PAGE.intro.languagesTitle}</p>
              <ul className="wt-langs">
                {PAGE.intro.languages.map(([cc, name]) => (
                  <li key={name}><img src={`/flags/${cc}.svg`} alt="" width="22" height="16" loading="lazy" />{name}</li>
                ))}
              </ul>
              <p className="wt-intro__extra">{PAGE.intro.extra}</p>
            </div>
            <figure className="wt-intro__photo">
              <img src={imgUrl(PAGE.intro.image.src)} alt={PAGE.intro.image.alt} width={PAGE.intro.image.width} height={PAGE.intro.image.height} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--tint wt-what">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.what.title}</h2>
            <p>{PAGE.what.lead}</p>
          </div>
          <ul className="wt-grid wt-grid--3">
            {PAGE.what.items.map((c) => (
              <li key={c.title} className="wt-card">
                <span className="wt-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wt-how">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.how.title}</h2>
            <p>{PAGE.how.lead}</p>
          </div>
          <ul className="wt-grid wt-grid--4">
            {PAGE.how.items.map((c) => (
              <li key={c.title} className="wt-card">
                <span className="wt-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
          <div className="wt-formats">
            <span className="wt-formats__title">{PAGE.how.formatsTitle}</span>
            <ul>{PAGE.how.formats.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <p className="wt-note">{PAGE.how.note}</p>
        </div>
      </section>

      <section className="section section--tint wt-why">
        <div className="container">
          <div className="section-head"><h2>{PAGE.why.title}</h2></div>
          <ul className="wt-grid wt-grid--3">
            {PAGE.why.items.map((c) => (
              <li key={c.title} className="wt-card wt-card--accent">
                <span className="wt-card__icon"><Icon name={c.icon} size={28} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wt-scope">
        <div className="container container--narrow">
          <div className="section-head">
            <h2>{PAGE.scope.title}</h2>
            <p>{PAGE.scope.lead}</p>
          </div>
          <ul className="wt-grid wt-grid--2">
            {PAGE.scope.items.map((c) => (
              <li key={c.title} className={"wt-card" + (c.tag ? " wt-card--pick" : "")}>
                {c.tag ? <span className="wt-card__tag">{c.tag}</span> : null}
                <span className="wt-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint wt-faq">
        <div className="container container--narrow">
          <div className="section-head"><h2>{PAGE.faq.title}</h2></div>
          <div className="faq">
            {PAGE.faq.items.map(([q, a]) => (
              <details key={q} className="faq__item">
                <summary>{q}</summary>
                <div className="faq__a">{a.map((s) => <p key={s}>{s}</p>)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
