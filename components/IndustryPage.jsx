import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF } from "@/lib/business";
import { imgUrl } from "@/lib/site";
import PAGE from "@/data/industry-page.json";
import { ICON } from "./industryIcons";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import IndustryHeroArt from "./IndustryHeroArt";
import CtaBand from "./CtaBand";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const Icon = ({ name, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name]} /></svg>
);

const Tick = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

// Two overlapping circles: native speaker x sector expert = specialist translator.
function Venn({ labels }) {
  return (
    <svg className="ind-venn" viewBox="0 0 420 300" role="img" aria-label={`${labels[0]} and ${labels[1]} overlap to make a ${labels[2].toLowerCase()}`}>
      <circle className="ind-venn__a" cx="150" cy="140" r="104" />
      <circle className="ind-venn__b" cx="270" cy="140" r="104" />
      <path className="ind-venn__core" d="M210 52a104 104 0 0 1 0 176a104 104 0 0 1 0-176z" />
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ind-venn__ico">
        <g transform="translate(78 92) scale(1.5)"><path d={ICON.website} /></g>
        <g transform="translate(306 92) scale(1.5)"><path d={ICON.finance} /></g>
        <g transform="translate(192 118) scale(1.5)"><path d={ICON.documents} /></g>
      </g>
      <text className="ind-venn__t" x="104" y="204" textAnchor="middle">{labels[0]}</text>
      <text className="ind-venn__t" x="336" y="204" textAnchor="middle">{labels[1]}</text>
      <text className="ind-venn__t ind-venn__t--core" x="210" y="262" textAnchor="middle">{labels[2]}</text>
    </svg>
  );
}

// Rendered instead of the generic scraped layout for /industry/: sector hero, language-experts intro and a
// photo-and-icon card for every sector. Copy lives in data/industry-page.json.
export default function IndustryPage({ page, title }) {
  return (
    <main className="ind-page" data-page="industry" data-slug="industry">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<IndustryHeroArt />}>
        <Breadcrumbs pathname="/industry/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{page.metaDescription}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="ind-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section ind-intro">
        <div className="container">
          <div className="ind-intro__grid">
            <div className="ind-intro__text">
              <h2>{PAGE.intro.title}</h2>
              {PAGE.intro.paras.map((p) => <p key={p}>{p}</p>)}
              <ul className="ind-checks">
                {PAGE.intro.checks.map((c) => (
                  <li key={c}><span className="ind-checks__tick"><Tick /></span><span dangerouslySetInnerHTML={{ __html: c }} /></li>
                ))}
              </ul>
            </div>
            <div className="ind-intro__art"><Venn labels={PAGE.intro.venn} /></div>
          </div>
        </div>
      </section>

      <section className="section section--tint ind-cards">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.cards.title}</h2>
            <p>{PAGE.cards.lead}</p>
          </div>
          <ul className="ind-grid">
            {PAGE.cards.items.map((c) => (
              <li key={c.href} className="ind-card">
                <a href={c.href} className="ind-card__link">
                  <span className="ind-card__media">
                    {c.image ? (
                      <img src={imgUrl(c.image)} alt={c.alt || ""} width="795" height="530" loading="lazy" decoding="async" />
                    ) : (
                      <span className="ind-card__panel" aria-hidden="true"><Icon name={c.icon} size={74} /></span>
                    )}
                  </span>
                  <span className="ind-card__body">
                    <span className="ind-card__badge"><Icon name={c.icon} size={24} /></span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <span className="ind-card__tags">{c.tags.map((t) => <em key={t}>{t}</em>)}</span>
                    <span className="card__more">{UI.en.readMore}</span>
                  </span>
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
