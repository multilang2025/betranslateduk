import { UI } from "@/lib/i18n";
import { PHONE_NATIONAL, PHONE_HREF } from "@/lib/business";
import PAGE from "@/data/translators-page.json";
import TEAM from "@/data/team.json";
import Breadcrumbs from "./Breadcrumbs";
import StdHero, { KICKER } from "./StdHero";
import VideoEmbed from "./VideoEmbed";
import CtaBand from "./CtaBand";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";
import { imgUrl } from "@/lib/site";

const ICONS = {
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  badge: "M12 3l2.4 2.1 3.2-.2.9 3 2.7 1.8-1.1 3 1.1 3-2.7 1.8-.9 3-3.2-.2L12 21l-2.4-2.1-3.2.2-.9-3L2.8 14.3l1.1-3-1.1-3 2.7-1.8.9-3 3.2.2L12 3zM8.5 12.2l2.4 2.4 4.6-4.8",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
};
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

// Rendered instead of the generic scraped layout for /translators/: team-photo hero, our story, the team,
// the company video, how we work, how a project is matched, interpreting band and FAQ. Copy lives in data/translators-page.json
// (lifted from the live page); the team in data/team.json.
export default function TranslatorsPage({ page }) {
  const title = PAGE.hero.title;
  return (
    <main className="tr-page" data-page="translators" data-slug="translators">
      <PageSchema schema={page.schema} />
      <PageFx />
      <StdHero art={<div className="tr-hero-photo"><img src="/team/about-team.webp" alt="Three members of the BeTranslated team smiling around a meeting table in the office" width="1200" height="675" fetchPriority="high" /></div>}>
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
          <ul className="tr-team">
            {TEAM.map((m) => (
              <li key={m.name} className="tr-team__card">
                <img src={imgUrl(m.photo)} alt={m.name} width="640" height="800" loading="lazy" />
                <div className="tr-team__body">
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                  <p>{m.bio}</p>
                </div>
                {m.languages?.length ? <em className="tr-team__langs">{m.languages.map((cc) => <img key={cc} src={`/flags/${cc}.svg`} alt="" width="22" height="16" loading="lazy" />)}</em> : null}
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

      <section className="section section--tint tr-intro">
        <div className="container">
          <div className="section-head">
            <h2>{PAGE.intro.title}</h2>
            <p>{PAGE.intro.lead}</p>
          </div>
          <ul className="tr-feats">
            {PAGE.intro.cards.map((c) => (
              <li key={c.title} className="tr-feat">
                <span className="tr-feat__icon"><Icon d={ICONS[c.icon]} /></span>
                <h3>{c.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: c.html }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tr-steps">
        <div className="container">
          <div className="section-head"><h2>{PAGE.steps.title}</h2></div>
          <ol className="tr-steps__list" style={{ "--n": PAGE.steps.items.length }}>
            {PAGE.steps.items.map(([t, d], i) => (
              <li key={t}><span className="tr-steps__n" aria-hidden="true">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint tr-interp">
        <div className="container">
          <div className="tr-interp__card">
            <div>
              <h2>{PAGE.interp.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: PAGE.interp.html }} />
            </div>
            <div className="tr-interp__side">
              <ul className="tr-interp__tags">{PAGE.interp.tags.map((x) => <li key={x}>{x}</li>)}</ul>
              <a className="bt-btn bt-btn--ghost" href={PAGE.interp.href}>{PAGE.interp.cta}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section tr-faq">
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
