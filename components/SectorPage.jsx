import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF } from "@/lib/business";
import { imgUrl } from "@/lib/site";
import INDUSTRY from "@/data/industry-page.json";
import COMMON from "@/data/sector-pages/common.json";
import business from "@/data/sector-pages/business.json";
import itTelecom from "@/data/sector-pages/it-telecom.json";
import technical from "@/data/sector-pages/technical.json";
import marketing from "@/data/sector-pages/marketing.json";
import tourism from "@/data/sector-pages/tourism.json";
import legal from "@/data/sector-pages/legal.json";
import medical from "@/data/sector-pages/medical.json";
import { ICON } from "./industryIcons";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import SectorHeroArt from "./SectorHeroArt";
import CtaBand from "./CtaBand";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const DATA = {
  "industry/business": business,
  "industry/it-telecom": itTelecom,
  "industry/technical": technical,
  "industry/marketing": marketing,
  "industry/tourism": tourism,
  "industry/legal": legal,
  "industry/medical": medical,
};
export const SECTOR_KEYS = Object.keys(DATA);

const Icon = ({ name, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name] || ICON.documents} /></svg>
);
const Tick = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
);
const Html = ({ html }) => <p dangerouslySetInnerHTML={{ __html: html }} />;

// Rendered instead of the generic scraped layout for the seven Expertise sub-pages: hero with sector
// icon, intro with photo, what we translate, why, optional sub-pages and tags, how we work, FAQ and
// the other sectors. Copy lives in data/sector-pages/<slug>.json (lifted from the live page).
export default function SectorPage({ page, title, slug }) {
  const D = DATA[slug];
  const pathname = `/${slug}/`;
  const self = INDUSTRY.cards.items.find((c) => c.href === pathname);
  const image = self && self.image;
  const others = INDUSTRY.cards.items.filter((c) => c.href !== pathname && !c.href.startsWith("/document") && !c.href.startsWith("/translation-services"));
  return (
    <main className="sd-page" data-page="sector" data-slug={slug}>
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<SectorHeroArt icon={D.icon} />}>
        <Breadcrumbs pathname={pathname} current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{page.metaDescription}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="sd-facts">{D.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section sd-intro">
        <div className="container">
          <div className={"sd-intro__grid" + (image ? "" : " sd-intro__grid--solo")}>
            <div className="sd-intro__text">
              <h2>{D.intro.title}</h2>
              {D.intro.paras.map((p) => <Html key={p} html={p} />)}
              <ul className="sd-ticks">{D.intro.checks.map((c) => <li key={c}><span><Tick /></span><span dangerouslySetInnerHTML={{ __html: c }} /></li>)}</ul>
            </div>
            {image ? (
              <figure className="sd-intro__photo">
                <img src={imgUrl(image)} alt={self.alt} loading="lazy" decoding="async" />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section section--tint sd-what">
        <div className="container">
          <div className="section-head"><h2>{D.services.title}</h2><p>{D.services.lead}</p></div>
          <ul className="sd-grid sd-grid--3">
            {D.services.items.map((c) => (
              <li key={c.title} className="sd-card">
                <span className="sd-card__icon"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <Html html={c.text} />
              </li>
            ))}
          </ul>
          {D.tags ? (
            <div className="sd-panel">
              <div className="sd-panel__row"><span className="sd-panel__title">{D.tags.title}</span></div>
              <ul className="sd-tags" style={{ marginTop: 14 }}>{D.tags.items.map((t) => <li key={t} dangerouslySetInnerHTML={{ __html: t }} />)}</ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section sd-why">
        <div className="container">
          <div className="section-head"><h2>{D.why.title}</h2></div>
          <ul className={"sd-grid " + (D.why.items.length === 4 ? "sd-grid--4" : "sd-grid--3")}>
            {D.why.items.map((c) => (
              <li key={c.title} className="sd-card sd-card--accent">
                <span className="sd-card__icon"><Icon name={c.icon} size={26} /></span>
                <h3>{c.title}</h3>
                <Html html={c.text} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {D.children ? (
        <section className="section section--tint sd-children">
          <div className="container">
            <div className="section-head"><h2>{D.children.title}</h2><p>{D.children.lead}</p></div>
            <ul className="sd-grid sd-grid--3">
              {D.children.items.map((c) => (
                <li key={c.title}>
                  <a className="sd-card sd-card--link" href={c.href}>
                    <span className="sd-card__icon"><Icon name={c.icon} /></span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <span className="sd-card__more">Read more <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={"section sd-steps" + (D.children ? "" : " section--tint")}>
        <div className="container">
          <div className="section-head"><h2>{COMMON.steps.title}</h2><p>{COMMON.steps.lead}</p></div>
          <ol className="sd-steps__list">
            {COMMON.steps.items.map((s, i) => (
              <li key={s.title} className="sd-step">
                <span className="sd-step__n" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={"section sd-faq" + (D.children ? " section--tint" : "")}>
        <div className="container container--narrow">
          <div className="section-head"><h2>{D.faq.title}</h2></div>
          <div className="faq">
            {D.faq.items.map(([q, a]) => (
              <details key={q} className="faq__item">
                <summary>{q}</summary>
                <div className="faq__a">{a.map((s) => <p key={s}>{s}</p>)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={"section sd-more" + (D.children ? "" : " section--tint")}>
        <div className="container">
          <div className="section-head"><h2>{COMMON.more.title}</h2><p>{COMMON.more.lead}</p></div>
          <ul className="sd-grid sd-grid--3">
            {others.map((c) => (
              <li key={c.href}>
                <a className="sd-card sd-card--link" href={c.href}>
                  <span className="sd-card__icon"><Icon name={c.icon} /></span>
                  <h3>{c.title}</h3>
                  <span className="sd-card__more">Read more <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
