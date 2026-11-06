import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF, EMAIL } from "@/lib/business";
import { imgUrl } from "@/lib/site";
import PAGE from "@/data/remote-interpreting-page.json";
import { ICON } from "./industryIcons";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import RemoteHeroArt from "./RemoteHeroArt";
import QuoteForm from "./home/QuoteForm";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const Icon = ({ name, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name]} /></svg>
);

const Tick = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
);

// Rendered instead of the generic scraped layout for /translation-services/remote-interpreting/: hero, intro,
// formats, why remote, use cases, process, the interpreting quote form and the FAQ.
// Copy lives in data/remote-interpreting-page.json.
export default function RemoteInterpretingPage({ page, title }) {
  return (
    <main className="ri-page" data-page="remote-interpreting" data-slug="translation-services/remote-interpreting">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<RemoteHeroArt />}>
        <Breadcrumbs pathname="/translation-services/remote-interpreting/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{page.metaDescription}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href="#quote">{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="ri-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section ri-intro">
        <div className="container">
          <div className="ri-intro__grid">
            <div className="ri-intro__text">
              <h2>{PAGE.intro.title}</h2>
              {PAGE.intro.paras.map((p) => <p key={p}>{p}</p>)}
              <ul className="ri-ticks">
                {PAGE.intro.checks.map((c) => <li key={c}><span><Tick /></span>{c}</li>)}
              </ul>
            </div>
            <figure className="ri-intro__photo">
              <img src={imgUrl(PAGE.intro.image.src)} alt={PAGE.intro.image.alt} width={PAGE.intro.image.width} height={PAGE.intro.image.height} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--tint ri-what">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.options.title}</h2>
            <p>{PAGE.options.lead}</p>
          </div>
          <ul className="ri-grid ri-grid--3">
            {PAGE.options.items.map((c) => (
              <li key={c.title} className={"ri-card" + (c.tag ? " ri-card--pick" : "")}>
                {c.tag ? <span className="ri-card__tag">{c.tag}</span> : null}
                <span className="ri-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ri-why">
        <div className="container">
          <div className="section-head"><h2>{PAGE.why.title}</h2></div>
          <ul className="ri-grid ri-grid--4">
            {PAGE.why.items.map((c) => (
              <li key={c.title} className="ri-card ri-card--accent">
                <span className="ri-card__icon"><Icon name={c.icon} size={26} /></span>
                <h3>{c.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: c.text }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint ri-sectors">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.uses.title}</h2>
            <p>{PAGE.uses.lead}</p>
          </div>
          <ul className="ri-grid ri-grid--3">
            {PAGE.uses.items.map((c) => (
              <li key={c.title} className="ri-card">
                <span className="ri-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ri-steps">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.steps.title}</h2>
            <p>{PAGE.steps.lead}</p>
          </div>
          <ol className="ri-steps__list">
            {PAGE.steps.items.map((s, i) => (
              <li key={s.title} className="ri-step">
                <span className="ri-step__n" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint ri-quote" id="quote">
        <div className="container">
          <div className="ri-quote__grid">
            <div className="ri-quote__intro">
              <h2>{PAGE.quote.title}</h2>
              <p className="ri-quote__lead">{PAGE.quote.lead}</p>
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
            <div className="form-card ri-quote__form"><QuoteForm initialType="interpreting" /></div>
          </div>
        </div>
      </section>

      <section className="section ri-faq">
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
