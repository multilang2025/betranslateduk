import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF, RATING } from "@/lib/business";
import PAGE from "@/data/translators-page.json";
import TEAM from "@/data/team.json";
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

// Rendered instead of the generic scraped layout for /translators/: team-photo hero, our story, the team,
// the company video, reasons to trust us, how we work, client logos and the quote band. Copy lives in
// data/translators-page.json, the team in data/team.json and the logos in data/clients.json (shared with
// the homepage).
export default function TranslatorsPage({ page }) {
  const title = PAGE.hero.title;
  const logos = PAGE.clients.names.map((n) => CLIENTS.find(([, name]) => name === n)).filter(Boolean);
  const reasons = [...PAGE.reasons.items, `Rated ${RATING.value.toFixed(1)} on Google by ${RATING.count} clients`];
  return (
    <main className="tr-page" data-page="translators" data-slug="translators">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={
        <div className="tr-hero-art">
          <span className="tr-hero-art__blob tr-hero-art__blob--teal" aria-hidden="true" />
          <span className="tr-hero-art__blob tr-hero-art__blob--orange" aria-hidden="true" />
          <span className="tr-hero-art__blob tr-hero-art__blob--navy" aria-hidden="true" />
          <span className="tr-hero-art__ring" aria-hidden="true" />
          <span className="tr-hero-art__dot tr-hero-art__dot--a" aria-hidden="true" />
          <span className="tr-hero-art__dot tr-hero-art__dot--b" aria-hidden="true" />
          <div className="tr-hero-photo"><img src="/team/about-team.webp" alt="Three members of the BeTranslated team smiling around a meeting table in the office" width="1200" height="675" fetchPriority="high" /></div>
        </div>
      }>
        <Breadcrumbs pathname="/translators/" current={title} />
        <span className="ip-kicker">{KICKER}</span>
        <h1>{title}</h1>
        <p className="lead">{PAGE.hero.lead}</p>
        <div className="page-hero__cta">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
          <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} on {PHONE_NATIONAL}</a>
        </div>
        <ul className="tr-facts">{PAGE.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </StdHero>

      <section className="section tr-story">
        <div className="container">
          <div className="tr-story__grid">
            <div className="tr-story__text">
              <h2>{PAGE.story.title}</h2>
              {PAGE.story.paras.map((s) => <p key={s}>{s}</p>)}
            </div>
            <figure className="tr-story__photo">
              <img src={PAGE.story.image.src} alt={PAGE.story.image.alt} width={PAGE.story.image.width} height={PAGE.story.image.height} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--tint tr-roster">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.roster.title}</h2>
            <p>{PAGE.roster.lead}</p>
          </div>
          <ul className="tr-pal">
            {TEAM.map((m) => (
              <li key={m.name} className="tr-pal__card">
                <span className="tr-pal__photo">
                  <img src={imgUrl(m.photo)} alt={m.name} width="640" height="800" loading="lazy" />
                </span>
                <strong>{m.name}</strong>
                <span className="tr-pal__role">{m.role}</span>
                <p>{m.bio}</p>
                {m.languages?.length ? <em className="tr-pal__langs">{m.languages.map((cc) => <img key={cc} src={`/flags/${cc}.svg`} alt="" width="22" height="16" loading="lazy" />)}</em> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tr-video">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.video.title}</h2>
            <p>{PAGE.video.lead}</p>
          </div>
          <VideoEmbed id={PAGE.video.id} title={PAGE.video.videoTitle} poster={PAGE.video.poster} />
        </div>
      </section>

      <section className="section section--tint tr-reasons">
        <div className="container container--narrow">
          <div className="section-head">
            <h2>{PAGE.reasons.title}</h2>
            <p>{PAGE.reasons.lead}</p>
          </div>
          <ul className="tr-checks">
            {reasons.map((r) => (
              <li key={r}><span className="tr-checks__tick"><Tick /></span>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tr-work">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.work.title}</h2>
            <p>{PAGE.work.lead}</p>
          </div>
          <ol className="tr-work__list">
            {PAGE.work.steps.map(([t, d], i) => (
              <li key={t} className="tr-work__step">
                <span className="tr-work__n" aria-hidden="true">{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint tr-clients" aria-label={PAGE.clients.title}>
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.clients.title}</h2>
            <p>{PAGE.clients.lead}</p>
          </div>
          <ul className="tr-clients__grid">
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
