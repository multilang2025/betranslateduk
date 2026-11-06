import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF, EMAIL } from "@/lib/business";
import { imgUrl } from "@/lib/site";
import PAGE from "@/data/document-translation-page.json";
import { ICON } from "./industryIcons";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import DocumentHeroArt from "./DocumentHeroArt";
import QuoteForm from "./home/QuoteForm";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const Icon = ({ name, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name]} /></svg>
);

const Tick = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
);

// Rendered instead of the generic scraped layout for /document-translation-services/: hero, intro,
// document types, why us, sector links, process, the quote request form (same form and checklist as
// the quote page, with file upload) and the FAQ. Copy lives in data/document-translation-page.json.
export default function DocumentTranslationPage({ page, title }) {
  return (
    <main className="dt-page" data-page="document-translation" data-slug="document-translation-services">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<DocumentHeroArt />}>
        <Breadcrumbs pathname="/document-translation-services/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{page.metaDescription}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href="#quote">{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="dt-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section dt-intro">
        <div className="container">
          <div className="dt-intro__grid">
            <div className="dt-intro__text">
              <h2>{PAGE.intro.title}</h2>
              {PAGE.intro.paras.map((p) => <p key={p}>{p}</p>)}
              <ul className="dt-ticks">
                {PAGE.intro.checks.map((c) => <li key={c}><span><Tick /></span>{c}</li>)}
              </ul>
            </div>
            <figure className="dt-intro__photo">
              <img src={imgUrl(PAGE.intro.image.src)} alt={PAGE.intro.image.alt} width={PAGE.intro.image.width} height={PAGE.intro.image.height} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--tint dt-what">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.what.title}</h2>
            <p>{PAGE.what.lead}</p>
          </div>
          <ul className="dt-grid dt-grid--3">
            {PAGE.what.items.map((c) => (
              <li key={c.title} className="dt-card">
                <span className="dt-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
          <div className="dt-panel">
            <div className="dt-panel__row">
              <span className="dt-panel__title">{PAGE.what.formatsTitle}</span>
              <ul>{PAGE.what.formats.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <p className="dt-panel__note">{PAGE.what.note}</p>
          </div>
        </div>
      </section>

      <section className="section dt-why">
        <div className="container">
          <div className="section-head"><h2>{PAGE.why.title}</h2></div>
          <ul className="dt-grid dt-grid--4">
            {PAGE.why.items.map((c) => (
              <li key={c.title} className="dt-card dt-card--accent">
                <span className="dt-card__icon"><Icon name={c.icon} size={26} /></span>
                <h3>{c.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: c.text }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint dt-sectors">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.sectors.title}</h2>
            <p>{PAGE.sectors.lead}</p>
          </div>
          <ul className="dt-grid dt-grid--3">
            {PAGE.sectors.items.map((c) => (
              <li key={c.title}>
                <a className="dt-card dt-card--link" href={c.href}>
                  <span className="dt-card__icon"><Icon name={c.icon} /></span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="dt-card__more">Read more <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section dt-steps">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.steps.title}</h2>
            <p>{PAGE.steps.lead}</p>
          </div>
          <ol className="dt-steps__list">
            {PAGE.steps.items.map((s, i) => (
              <li key={s.title} className="dt-step">
                <span className="dt-step__n" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint dt-quote" id="quote">
        <div className="container">
          <div className="dt-quote__grid">
            <div className="dt-quote__intro">
              <h2>{PAGE.quote.title}</h2>
              <p className="dt-quote__lead">{PAGE.quote.lead}</p>
              <div className="quote-check">
                <h3>{PAGE.quote.checkTitle}</h3>
                <ul>{PAGE.quote.checks.map((c) => <li key={c}>{c}</li>)}</ul>
                <p>{PAGE.quote.note}</p>
              </div>
              <ul className="contact-list">
                <li><span>Phone</span><a href={PHONE_HREF}>{PHONE_NATIONAL}</a></li>
                <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              </ul>
            </div>
            <div className="form-card dt-quote__form"><QuoteForm /></div>
          </div>
        </div>
      </section>

      <section className="section dt-faq">
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
    </main>
  );
}
