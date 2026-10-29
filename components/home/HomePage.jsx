import Image from "next/image";
import Reveal from "../Reveal";
import Team from "../Team";
import HeroHighlight from "./HeroHighlight";
import ServiceArt from "./ServiceArt";
import HeroArt from "./HeroArt";
import { specialtyIconSrc } from "../serviceIcons";
import ProcessMap from "./ProcessMap";
import QuoteForm from "./QuoteForm";
import { HOME } from "./copy";
import FeaturedPosts from "./FeaturedPosts";
import GbpBadge from "./GbpBadge";
import FEATURED from "../../data/home-featured-posts.json";
import { blogCards, getHomePage } from "../../lib/content";
import PageSchema from "../PageSchema";

// Product name for the home page graphs (unused while product={false}). The
// home pages carry no Product: Google review stars belong to the business
// (ProfessionalService), not to a product (Mike, 2026-10-18).
const HOME_PRODUCT = { es: "Servicios de traducción e interpretación", en: "Translation and interpreting services", fr: "Services de traduction et d'interprétation" };

// Home page as native sections for es / en / fr. ES copy is condensed from
// the scraped betranslated.es home; EN and FR are translated from it and
// should be reviewed by a native speaker before launch.
const UP = "/wp-content/uploads";
const SERVICE_IMG = [
  // Branded images generated for the rebuild (no people, navy and orange accents).
  "/services/documentos.webp",
  "/services/web.webp",
  "/services/jurada.webp",
  "/services/audiovisual.webp",
  "/services/marketing-digital-foto.webp",
  "/services/interpretacion-remota.webp",
  "/services/maquetacion.webp",
  "/services/juridica.webp",
  "/services/transcripcion.webp",
];
const LANG = {
  espanol: ["ES", "Español"], ingles: ["EN", "Inglés"], frances: ["FR", "Francés"], aleman: ["DE", "Alemán"],
  neerlandes: ["NL", "Neerlandés"], portugues: ["PT", "Portugués"], italiano: ["IT", "Italiano"],
};
// Real UK client logos, from the live homepage's own .bt-marquee band
// (scripts/btvibe-uk/output/pages/index.json), already mirrored locally.
const CLIENTS = [
  ["/images/wp-content/uploads/2023/09/brandwatch-logo.png", "Brandwatch"],
  ["/images/wp-content/uploads/2023/09/UNESCO.svg", "UNESCO"],
  ["/images/wp-content/uploads/2023/09/barbados.svg", "Barbados"],
  ["/images/wp-content/uploads/2023/09/Kaspersky.svg", "Kaspersky"],
  ["/images/wp-content/uploads/2026/10/sideload-a5e2db05394c.svg", "Proxymity"],
  ["/images/wp-content/uploads/2026/10/sideload-d3d18b829129.svg", "Save the Children"],
  ["/images/wp-content/uploads/2026/10/sideload-4fe628da58d6.svg", "BIC"],
  ["/images/wp-content/uploads/2020/06/aspen.jpg", "Aspen Aerogels"],
  ["/images/wp-content/uploads/2020/06/wallonia.jpg", "AWEX"],
  ["/images/wp-content/uploads/2020/06/arrow.jpg", "Arrow"],
  ["/images/wp-content/uploads/2020/06/computercenter.jpg", "Computer Center"],
  ["/images/wp-content/uploads/2020/06/vinci.jpg", "Vinci"],
  ["/images/wp-content/uploads/2020/06/wonderbox.jpg", "Wonderbox"],
  ["/images/wp-content/uploads/2020/06/intersystem.jpg", "Intersystem"],
  ["/images/wp-content/uploads/2020/06/noosphere.jpg", "Noosphere"],
  ["/images/wp-content/uploads/2020/06/vanksen.jpg", "Vanksen"],
  ["/images/wp-content/uploads/2020/06/tms.jpg", "TMS"],
];

function Head({ eyebrow, title, children }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children ? <p className="lead">{children}</p> : null}
    </div>
  );
}

const MoreLabel = ({ children }) => (
  <>
    <span className="card__more-text">{children}</span>
    <span className="card__more-arrow" aria-hidden="true">→</span>
  </>
);

const lc = (t) => (/^[A-ZÁÉÍÓÚ][a-záéíóúñ]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

// Blog teaser copy (the posts themselves: data/home-featured-posts.json).
const POSTS_COPY = {
  es: { eyebrow: "Blog", title: "Artículos para encargar tu traducción", lead: "Lo que conviene saber antes de pedir una traducción jurada, traducir tu web o abrirte a otros mercados.", more: "Ver 3 artículos más", back: "Ver los anteriores", all: "Todos los artículos", allHref: "/blog/" },
  en: { eyebrow: "Blog", title: "Before you order a translation", lead: "Practical advice on what translation costs, how to reach new markets with a multilingual website, and how to work with a professional translator.", more: "See 3 more articles", back: "Back to the first three", all: "All articles", allHref: "/blog/" },
  fr: { eyebrow: "Blog", title: "À savoir avant de commander une traduction", lead: "Traduction assermentée, création de société et installation en Espagne : ce qu’il faut savoir.", more: "Voir 3 autres articles", back: "Revenir aux précédents", all: "Tous les articles", allHref: "/fr/blog/" },
};

function featuredSets(locale) {
  const cards = blogCards(locale);
  const picked = (FEATURED[locale] || []).map((slug) => cards.find((x) => x.slug === slug)).filter((x) => x && !x.sponsored).slice(0, 6);
  if (picked.length < 3) return null;
  // A second set only when it is full: no half-empty row.
  return picked.length >= 6 ? [picked.slice(0, 3), picked.slice(3, 6)] : [picked.slice(0, 3)];
}

export default function HomePage({ locale = "es" }) {
  const c = HOME[locale] || HOME.es;
  const postSets = featuredSets(locale);
  const pc = POSTS_COPY[locale] || POSTS_COPY.es;
  const meta = getHomePage(locale);
  return (
    <main className="home">
      <PageSchema schema={meta?.schema} />
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">{c.eyebrow}</span>
            <h1 className="display">
              {c.h1a} <HeroHighlight>{c.h1b}</HeroHighlight>{c.h1c ? ` ${c.h1c}` : null}
            </h1>
            <p className="lead">{c.lead}</p>
            <div className="hero__actions">
            <div className="hero__cta">
              <a href={c.quoteHref} className="bt-btn bt-btn--primary bt-btn--lg hero__quote">{c.cta1}</a>
            </div>
            <ul className="hero__proof">
              {c.proof.map(([n, label]) => (
                <li key={n}><strong>{n}</strong><span>{label}</span></li>
              ))}
            </ul>
            </div>
            <GbpBadge locale={locale} />
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__card hero__card--a">
              {/* The visual is hidden under 560px (home-refresh.css): the 1px size makes the priority preload fetch a 16px thumbnail there instead of the photo (no vw in sizes, or next/image would not offer widths under 640). */}
              <Image src="https://nlrpizplminaccqlaved.supabase.co/storage/v1/object/public/btvibe-images/team/office-work.webp" alt="" width={1000} height={549} priority sizes="(max-width: 560px) 1px, (max-width: 900px) 600px, 440px" quality={82} />
            </div>
            <div className="hero__card hero__card--b">
              <HeroArt />
            </div>
            <div className="hero__since-box">{c.since}</div>
          </div>
        </div>
      </section>

      <section className="clients" aria-label={c.clientsLabel}>
        <div className="container">
          <p className="clients__label">{c.clientsLabel}</p>
        </div>
        <div className="clients__marquee">
          <div className="clients__track">
            {[0, 1].map((g) => (
              <ul className="clients__group" key={g} aria-hidden={g === 1 ? "true" : undefined}>
                {[...CLIENTS, ...CLIENTS].map(([src, name], i) => (
                  <li key={src + i}>
                    <Image src={src} alt={g === 0 ? name : ""} width={160} height={70} sizes="160px" quality={90} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--services">
        <div className="container">
          <Reveal><Head eyebrow={c.servicesEyebrow} title={c.themesTitle || c.servicesTitle}>{c.servicesLead}</Head></Reveal>
          {c.serviceGroups ? (
            <div className="svc-groups">
              {c.serviceGroups.map((g, i) => (
                <Reveal key={g.kind} delay={i * 80}>
                  <article className="svc-group">
                    <div className="svc-group__art"><ServiceArt kind={g.kind} /></div>
                    <div className="svc-group__body">
                      <h3>{g.title}</h3>
                      <p>{g.lead}</p>
                      <ul>
                        {g.items.map(([label, href]) => (<li key={label}><a href={href}>{label}</a></li>))}
                      </ul>
                      {g.chips && (<ul className="svc-chips">{g.chips.map((c) => { const [t, href] = Array.isArray(c) ? c : [c]; return <li key={t}>{href ? <a href={href}>{t}</a> : t}</li>; })}</ul>)}
                      <a href={g.href} className="card__more"><MoreLabel>{c.more}</MoreLabel></a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
          <div className="grid grid--services">
            {c.services.slice(0, 6).map(([title, body, href, img], i) => (
              <Reveal key={title} delay={(i % 3) * 70}>
                <a href={href} className="card card--service">
                  <div className="card__media">
                    <Image src={SERVICE_IMG[img ?? i]} alt="" width={480} height={300} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px" />
                  </div>
                  <div className="card__body">
                    <h3>{title}</h3>
                    <p>{body}</p>
                    <span className="card__more"><MoreLabel>{c.moreAbout} {lc(title)}</MoreLabel></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          )}
          {c.servicesCtaTitle && (<Reveal delay={120}><div className="svc-cta"><div><h3>{c.servicesCtaTitle}</h3><p>{c.servicesCtaBody}</p></div><a href={c.quoteHref} className="bt-btn bt-btn--primary bt-btn--lg">{c.cta1}</a></div></Reveal>)}
        </div>
      </section>

      <section className="section section--slate">
        <div className="container">
          <Reveal>
            <Head eyebrow={c.teamEyebrow} title={c.teamTitle}>{c.teamLead}</Head>
          </Reveal>
          <Reveal delay={80}><Team locale={locale} className="team--home" /></Reveal>
          <p className="center" style={{ marginTop: 36 }}>
            <a href={c.aboutHref} className="bt-btn bt-btn--secondary">{c.aboutCta}</a>
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <Reveal><Head eyebrow={c.specEyebrow} title={c.specTitle} /></Reveal>
          <div className="grid grid--specialties">
            {c.specialties.map(([name, body, href], i) => (
              <Reveal key={name} delay={(i % 4) * 60}>
                <a href={href} className="card card--specialty">
                  <span className="card__icon card__icon--clay"><Image src={specialtyIconSrc(href, name)} alt="" width={68} height={68} loading="lazy" /></span>
                  <h3>{name}</h3>
                  <p>{body}</p>
                  <span className="card__more"><MoreLabel>{c.more}</MoreLabel></span>
                </a>
              </Reveal>
            ))}
          </div>
          {c.specCtaTitle && (<Reveal delay={120}><div className="svc-cta"><div><h3>{c.specCtaTitle}</h3><p>{c.specCtaBody}</p></div><a href={c.quoteHref} className="bt-btn bt-btn--primary bt-btn--lg">{c.specCtaBtn}</a></div></Reveal>)}
        </div>
      </section>

      <section className="section section--navy">
        <div className="container container--narrow center">
          <Reveal>
            <h2>{c.trustTitle}</h2>
            <p>{c.trustBody}</p>
          </Reveal>
          <p style={{ marginTop: 32 }}>
            <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xd6048f48e3c29d1:0xccf1dbee7b8d9ef4?sa=X&ved=1t:8290&hl=en" className="bt-btn bt-btn--secondary" target="_blank" rel="noopener noreferrer">
              {c.reviewCta}
            </a>
          </p>
        </div>
      </section>

      {postSets ? (
        <section className="section section--tint section--posts">
          <div className="container">
            <Reveal><Head eyebrow={pc.eyebrow} title={pc.title}>{pc.lead}</Head></Reveal>
            <FeaturedPosts sets={postSets} labels={pc} />
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <Reveal><Head eyebrow={c.pairsEyebrow} title={c.pairsTitle}>{c.pairsLead}</Head></Reveal>
          <Reveal>
            <ul className="pairs">
              {c.pairs.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </Reveal>
          {c.pairsAllHref ? <p className="lang-all"><a href={c.pairsAllHref} className="card__more"><MoreLabel>{c.pairsAll}</MoreLabel></a></p> : null}
        </div>
      </section>

      <section className="section section--tint" id="presupuesto">
        <div className="container process">
          <Reveal><h2 className="process__title">{c.stepsTitle}</h2></Reveal>
          <ProcessMap steps={c.steps} />
          <Reveal delay={80}>
            <div className="process__cta">
              <h3>{c.formTitle}</h3>
              <p>{c.formLead}</p>
            </div>
            <div className="form-card process__form"><QuoteForm locale={locale} /></div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
