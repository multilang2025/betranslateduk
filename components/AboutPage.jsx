import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF, RATING } from "@/lib/business";
import PAGE from "@/data/about-page.json";
import TEAM from "@/data/about-team.json";
import CLIENTS from "@/data/clients.json";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import VideoEmbed from "./VideoEmbed";
import CtaBand from "./CtaBand";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";
import { imgUrl } from "@/lib/site";

// Logos drawn in white: they sit on a dark tile.
const WHITE_LOGOS = ["UNESCO", "Brandwatch", "Barbados"];

const Tick = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

// Rendered instead of the generic scraped layout for /translation-agency/: team-photo hero, our story, the team,
// the company video, reasons to trust us, how we work, client logos and the quote band. Copy lives in
// data/about-page.json, the team in data/about-team.json and the logos in data/clients.json (shared with
// the homepage).
export default function AboutPage({ page, children = [] }) {
  const title = PAGE.hero.title;
  const logos = PAGE.clients.names.map((n) => CLIENTS.find(([, name]) => name === n)).filter(Boolean);
  const reasons = [...PAGE.reasons.items, `Rated ${RATING.value.toFixed(1)} on Google by ${RATING.count} clients`];
  return (
    <main className="ab-page" data-page="translation-agency" data-slug="translation-agency">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={
        <div className="ab-hero-art">
          <span className="ab-hero-art__blob ab-hero-art__blob--teal" aria-hidden="true" />
          <span className="ab-hero-art__blob ab-hero-art__blob--orange" aria-hidden="true" />
          <span className="ab-hero-art__blob ab-hero-art__blob--navy" aria-hidden="true" />
          <span className="ab-hero-art__ring" aria-hidden="true" />
          <span className="ab-hero-art__dot ab-hero-art__dot--a" aria-hidden="true" />
          <span className="ab-hero-art__dot ab-hero-art__dot--b" aria-hidden="true" />
          <div className="ab-hero-photo"><img src="/team/about-team.webp" alt="Three members of the BeTranslated team smiling around a meeting table in the office" width="1200" height="675" fetchPriority="high" /></div>
        </div>
      }>
        <Breadcrumbs pathname="/translation-agency/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{PAGE.hero.lead}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="ab-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section ab-story">
        <div className="container">
          <div className="ab-story__grid">
            <div className="ab-story__text">
              <h2>{PAGE.story.title}</h2>
              {PAGE.story.paras.map((s) => <p key={s}>{s}</p>)}
            </div>
            <figure className="ab-story__photo">
              <img src={PAGE.story.image.src} alt={PAGE.story.image.alt} width={PAGE.story.image.width} height={PAGE.story.image.height} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--tint ab-roster">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.roster.title}</h2>
            <p>{PAGE.roster.lead}</p>
          </div>
          <ul className="ab-pal">
            {TEAM.map((m) => (
              <li key={m.name} className="ab-pal__card">
                <span className="ab-pal__photo">
                  <img src={imgUrl(m.photo)} alt={m.name} width="640" height="800" loading="lazy" />
                </span>
                <strong>{m.name}</strong>
                <span className="ab-pal__role">{m.role}</span>
                <p>{m.bio}</p>
                {m.languages?.length ? <em className="ab-pal__langs">{m.languages.map((cc) => <img key={cc} src={`/flags/${cc}.svg`} alt="" width="22" height="16" loading="lazy" />)}</em> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ab-video">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.video.title}</h2>
            <p>{PAGE.video.lead}</p>
          </div>
          <VideoEmbed id={PAGE.video.id} title={PAGE.video.videoTitle} poster={PAGE.video.poster} />
        </div>
      </section>

      <section className="section section--tint ab-reasons">
        <div className="container container--narrow">
          <div className="section-head">
            <h2>{PAGE.reasons.title}</h2>
            <p>{PAGE.reasons.lead}</p>
          </div>
          <ul className="ab-checks">
            {reasons.map((r) => (
              <li key={r}><span className="ab-checks__tick"><Tick /></span>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ab-work">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.work.title}</h2>
            <p>{PAGE.work.lead}</p>
          </div>
          <ol className="ab-work__list">
            {PAGE.work.steps.map(([t, d], i) => (
              <li key={t} className="ab-work__step">
                <span className="ab-work__n" aria-hidden="true">{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {children.length > 1 ? (
        <section className="section section--tint ab-explore">
          <div className="container">
            <div className="section-head">
              <h2>{PAGE.explore.title}</h2>
              <p>{PAGE.explore.lead}</p>
            </div>
            <div className="grid grid--services">
              {children.map((c) => (
                <a key={c.href} href={c.href} className="card card--link">
                  <h3>{(c.title.split(/\s[-·|–]\s|:\s/)[0] || c.title).trim()}</h3>
                  {c.description ? <p>{c.description}</p> : null}
                  <span className="card__more">{UI.en.readMore}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section ab-clients" aria-label={PAGE.clients.title}>
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.clients.title}</h2>
            <p>{PAGE.clients.lead}</p>
          </div>
          <ul className="ab-clients__grid">
            {logos.map(([src, name]) => (
              <li key={name} className={WHITE_LOGOS.includes(name) ? "is-dark" : undefined}><img src={imgUrl(src)} alt={name} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
