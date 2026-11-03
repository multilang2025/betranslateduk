import Image from "next/image";
import { sanitizeBody, splitHero, splitTagline, toSections, dropLeadingCtas, tidyWidgetDebris, questionRunsToFaq, faqSectionsToFaq, boldQuestionsToFaq, tidyHeadingLevels, fixHeadingSkips, mergeLeaves, ctaCards, dropGroups } from "@/lib/sanitize";
import { extractBlocks, extractTranslators, restoreBlocks, withToc, enhanceTables, stripPostChrome, faqBlock } from "@/lib/blogEnhance";
import { listChildren, getLeafPages, pathFromUrl, getAllPosts, relatedPosts, postDate, displayTitle } from "@/lib/content";
import { UI } from "@/lib/i18n";
import { PHONE, PHONE_HREF, EMAIL } from "@/lib/business";
import Breadcrumbs from "./Breadcrumbs";
import TranslatorsGrid from "./TranslatorsGrid";
import TRANSLATORS from "@/data/translators.json";
import CtaBand from "./CtaBand";
import ClientsBand from "./ClientsBand";
import ShareBar from "./ShareBar";
import QuoteForm from "./home/QuoteForm";
import TocSpy from "./TocSpy";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";
import StdHero, { KICKER } from "./StdHero";
import BlogHub from "./BlogHub";
import BlogHeroArt from "./BlogHeroArt";
import BlogCard from "./BlogCard";
import { getBlogHub, relatedFor } from "@/lib/blogHub";
import { dropRelatedWidget, splitLongParagraphs, readingMinutes, updatedDate, withModified } from "@/lib/blogPost";
import { insertFigures } from "@/lib/blogImages";
import { ctaCardHtml } from "@/lib/blogCta";
import ServicesHeroArt from "./ServicesHeroArt";
import ServicesShowcase from "./ServicesShowcase";
import SectorCards from "./SectorCards";
import HERO_OVERRIDES from "@/data/page-heroes.json";
import NotFound from "./NotFoundView";
import EnglandMap from "./EnglandMap";

// Hub pages: their children render as a card/pill grid instead of the
// generic prose body.
// H2 over each hub's card grid, so the heading says what the cards are.
const HUB_TITLES = {
  "translation-services": "Our translation services",
  "translation-services/england": "Cities we serve in England",
  languages: "Languages we translate",
  industry: "Industries we serve",
  "translation-agency": "About BeTranslated",
  "translation-agency/locations": "Our offices",
};

const HUB_SLUGS = new Set([
  "languages", "industry", "translation-services", "translation-agency",
  "translation-agency/locations", "translation-services/england",
]);

// England city pages: no "Read more" (+) fold on long sections, and a real
// photo in the hero's second column (reusing each page's own unique photo;
// the hero automatically goes back to a two-column layout once it has a
// second child — see the :only-child rule in ui-fx.css). Exeter, Oxford and
// Reading have no unique photo yet, so they're left out of HERO_IMAGE_SLUGS.
const ENGLAND_CITY_SLUGS = [
  "birmingham", "bournemouth", "brighton", "bristol", "cambridge", "coventry",
  "exeter", "leeds", "leicester", "liverpool", "london", "manchester",
  "newcastle", "norwich", "nottingham", "oxford", "plymouth", "portsmouth",
  "reading", "sheffield", "southampton", "york",
];
const NO_FOLD_SLUGS = new Set([
  "translation-services/england",
  ...ENGLAND_CITY_SLUGS.map((c) => `translation-services/england/${c}`),
]);

const HERO_IMAGE_SLUGS = Object.fromEntries(Object.entries({
  birmingham: ["/images/wp-content/uploads/2025/10/Birmingham-3-1024x579.jpg", "Birmingham city centre"],
  bournemouth: ["/images/wp-content/uploads/2024/11/bournemouth-pier-dawn-bournemouth-3419367-e1732805720456.jpg", "Bournemouth pier at dawn"],
  brighton: ["/images/wp-content/uploads/2024/10/brighton-pier-arcade-beach-5643723-e1728640815917.jpg", "Brighton pier"],
  bristol: ["/images/wp-content/uploads/2024/10/translation-services-in-bristol.webp", "Bristol city"],
  cambridge: ["/images/wp-content/uploads/2024/10/cambridge-translation-services.jpg", "Cambridge"],
  coventry: ["/images/wp-content/uploads/2024/11/coventry-city-england-cathedral-2979432-e1732016010941.jpg", "Coventry Cathedral"],
  exeter: ["/images/wp-content/uploads/2025/11/exeter-cathedral-1024x579.jpg", "Exeter Cathedral", { author: "Simon Burchell", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/" }],
  leeds: ["/images/wp-content/uploads/2024/10/1-leeds-e1729070002851.jpg", "Leeds city centre"],
  leicester: ["/images/wp-content/uploads/2024/10/leicester-translation-service.jpg", "Leicester city centre"],
  liverpool: ["/images/wp-content/uploads/2024/10/beatle-liverpool-raining-3819228-e1729071249160.jpg", "Liverpool waterfront"],
  london: ["/images/wp-content/uploads/2024/10/london-translation-services.jpg", "London"],
  manchester: ["/images/wp-content/uploads/2024/09/manchester-manhole-cover-metal-1631200-e1727351820924.jpg", "Manchester"],
  newcastle: ["/images/wp-content/uploads/2024/11/sage-gateshead-newcastle-4331425-e1732895511280.jpg", "Sage Gateshead, Newcastle"],
  norwich: ["/images/wp-content/uploads/2024/11/Norwich-translation-services.jpg", "Norwich"],
  nottingham: ["/images/wp-content/uploads/2024/10/nottingham-translation-services.webp", "Nottingham city centre"],
  oxford: ["/images/wp-content/uploads/2025/11/oxford-radcliffe-square-1024x579.jpg", "Radcliffe Square, Oxford", { author: "Txllxt TxllxT", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/", pageUrl: "https://commons.wikimedia.org/wiki/File:Oxford_-_Radcliffe_Square_-_View_South_towards_University_Church_of_St_Mary_the_Virgin_along_(right)_the_Radcliffe_Camera_1737-48_by_James_Gibbs_%26_(left)_All_Souls_College_1438.jpg" }],
  plymouth: ["/images/wp-content/uploads/2024/11/harbour-night-reflection-283491-e1732879809448.jpg", "Plymouth harbour at night"],
  portsmouth: ["/images/wp-content/uploads/2024/11/Portsmouth-Translation-services-1-e1732796352615.jpg", "Portsmouth"],
  reading: ["/images/wp-content/uploads/2025/11/reading-the-blade-1024x579.jpg", "The Blade, Reading", { author: "Matt Buck", licence: "CC BY-SA 2.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0/" }],
  sheffield: ["/images/wp-content/uploads/2024/10/translation-services-in-sheffield.jpg", "Sheffield city centre"],
  southampton: ["/images/wp-content/uploads/2024/11/ships-port-lights-dusk-england-1804340-e1732018889626.jpg", "Southampton docks at dusk"],
  york: ["/images/wp-content/uploads/2024/11/cliffords-tower-castle-landmark-5950952-e1732896084721.jpg", "Clifford's Tower, York"],
}).map(([city, [src, alt, credit]]) => [`translation-services/england/${city}`, { src, alt, credit }]));

// CC BY-SA photos from Wikimedia Commons need the author, licence and source named next to the image.
function PhotoCredit({ credit }) {
  const { author, licence, licenceUrl, pageUrl } = credit;
  return (
    <p className="page-hero__credit">
      Photo: {author}, <a href={licenceUrl} target="_blank" rel="noopener">{licence}</a>, via{" "}
      <a href={pageUrl || "https://commons.wikimedia.org/"} target="_blank" rel="noopener">Wikimedia Commons</a>
    </p>
  );
}

const QUOTE_SLUG = "translation-agency/quote";
const CUSTOMERS_SLUG = "translation-agency/customers";

// "Korean audiovisual translation services" -> "Audiovisual"
function leafLabel(title = "") {
  const s = title.replace(/^(korean|french|german|spanish)\s+/i, "").replace(/\s+(translation|subtitling)?\s*services.*$/i, "").replace(/\s+translation$/i, "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : title;
}

function childLabel(title = "") {
  return title.split(/\s[-·|–]\s|:\s/)[0]
    .replace(/^(translation services for|translation services|translation|services)\s+(in |for |of )?/i, "")
    .trim() || title;
}

// Cards keep the full page name ("Translation Services in England"); pills use the short form.
function cardLabel(title = "") {
  return title.split(/\s[-·|–]\s|:\s/)[0].trim() || title;
}

function Children({ items, title, afterTitle }) {
  if (items.length < 2) return null;
  return (
    <section className="section section--tint">
      <div className="container">
        <div className="section-head"><h2>{title}</h2></div>
        <div className={afterTitle ? "hub-aside-layout" : undefined}>
          {afterTitle}
          {items.length > 7 ? (
            <ul className="pills">
              {items.map((c) => (<li key={c.href}><a href={c.href}>{childLabel(c.title)}</a></li>))}
            </ul>
          ) : (
            <div className="grid grid--services">
              {items.map((c) => (
                <a key={c.href} href={c.href} className="card card--link">
                  <h3>{cardLabel(c.title)}</h3>
                  {c.description ? <p>{c.description}</p> : null}
                  <span className="card__more">{UI.en.readMore}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function enhanceBody(html, { timelineLists = true } = {}) {
  const tr = extractTranslators(html);
  let body = sanitizeBody(tr.html, { dropImageChips: true, timelineLists });
  body = boldQuestionsToFaq(faqSectionsToFaq(questionRunsToFaq(body, "en", faqBlock), faqBlock), faqBlock);
  body = tidyHeadingLevels(body, {});
  body = tidyWidgetDebris(body);
  return restoreBlocks(body, tr.blocks);
}

function Sections({ html }) {
  if (!html) return null;
  return <div className="sections" dangerouslySetInnerHTML={{ __html: html }} />;
}

function BlogIndexView() {
  const hub = getBlogHub();
  return (
    <main>
      <PageFx />
      <StdHero art={<BlogHeroArt />}>
        <Breadcrumbs pathname="/blog/" current="Blog" />
        <span className="ip-kicker">{KICKER}</span>
        <h1>Translation blog for languages, business and culture</h1>
        <p className="lead page-hero__tagline">Practical advice, industry trends and cultural insight from a UK translation agency.</p>
        <p className="page-hero__sub">
          Read how AI is changing translation, what sets British English apart, how to work with a professional translator, and why healthcare, insurance and legal teams turn to specialist linguists. {hub.total} articles, written by the BeTranslated team.
        </p>
        <div className="page-hero__ctas">
          <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>Get a free quote</a>
          <a className="bt-btn bt-btn--ghost" href="#most-read">Start with the most read</a>
        </div>
      </StdHero>
      <BlogHub hub={hub} />
      <CtaBand />
    </main>
  );
}

const longDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

function BlogPostView({ data, slug }) {
  const pathname = `/blog/${slug}/`;
  const ex = extractBlocks(data.bodyHtml);
  const { title: h1, body: cleanBody } = splitHero(sanitizeBody(ex.html));
  const title = (h1 || data.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
  const chrome = stripPostChrome(cleanBody);
  let body = questionRunsToFaq(chrome.html, "en", faqBlock, { keepLead: true });
  body = faqSectionsToFaq(body, faqBlock);
  // The legacy contact widget at the foot of a post (heading, phone, email, address) repeats the page's CTA card.
  body = dropGroups(body, /^contact us/i, "h4");
  // The scrape ends every post with the same five thumbnails; the related articles below replace them.
  body = splitLongParagraphs(dropRelatedWidget(body));
  const { html: tocBody, toc } = withToc(enhanceTables(body));
  body = insertFigures(restoreBlocks(tocBody, ex.blocks), slug);
  const publishDate = postDate(data);
  const modified = updatedDate(slug);
  const showUpdated = modified && (!publishDate || modified > publishDate.slice(0, 10));
  const minutes = readingMinutes(body);
  // Closing call-to-action card for posts that have copy in data/blog-cta/ (added after the reading time is counted).
  body += ctaCardHtml(slug, { quoteHref: UI.en.quoteHref, phone: PHONE, phoneHref: PHONE_HREF });
  const img = data.og?.image; // already localized by lib/content.js at read time
  const related = relatedFor(slug, 4);

  return (
    <main className="blog-post">
      <PageSchema schema={withModified(data.schema, modified)} />
      <TocSpy />
      <PageFx />
      <section className="page-hero page-hero--split page-hero--post-split">
        <div className="container container--narrow">
          <div className="page-hero__text">
            <Breadcrumbs pathname={pathname} current={title} />
            <h1>{title}</h1>
            {data.metaDescription ? <p className="page-hero__sub">{data.metaDescription}</p> : null}
            <div className="post-hero__meta">
              {publishDate ? <span>{UI.en.published} <time dateTime={publishDate}>{longDate(publishDate)}</time></span> : null}
              {showUpdated ? <span className="post-hero__updated">Updated <time dateTime={modified}>{longDate(modified)}</time></span> : null}
              <span>{minutes} {UI.en.minRead}</span>
            </div>
            <ShareBar path={pathname} title={title} compact />
          </div>
          {img ? <figure className="post-hero__media post-hero__media--split"><Image src={img} alt="" width={1200} height={630} sizes="(max-width: 900px) 100vw, 520px" priority /></figure> : null}
        </div>
      </section>
      <section className="post-layout container">
        <div className="post-main">
          <article className="prose" dangerouslySetInnerHTML={{ __html: body }} />
          <ShareBar path={pathname} title={title} />
        </div>
        <aside className="post-aside">
          {toc.length > 2 ? (
            <nav className="post-toc" aria-label="In this article">
              <span className="post-toc__title">In this article</span>
              <ol>{toc.map((h) => (<li key={h.id}><a href={"#" + h.id}>{h.text}</a></li>))}</ol>
            </nav>
          ) : null}
          <div className="quote-card">
            <span className="quote-card__eyebrow">Free quote</span>
            <h3>{UI.en.ctaTitle}</h3>
            <a href={UI.en.quoteHref} className="bt-btn bt-btn--primary quote-card__btn">{UI.en.ctaButton}</a>
            <a href={PHONE_HREF} className="quote-card__call">Call us · {PHONE}</a>
          </div>
        </aside>
      </section>
      {related.length ? (
        <section className="section section--tint related-posts">
          <div className="container">
            <div className="section-head"><h2>{UI.en.relatedPosts}</h2></div>
            <div className="bgrid bgrid--four">
              {related.map((c) => (
                <BlogCard key={c.slug} card={c} />
              ))}
            </div>
            <p className="related-posts__all"><a href={UI.en.blogHref} className="card__more">{UI.en.backToBlog}</a></p>
          </div>
        </section>
      ) : null}
      <CtaBand />
    </main>
  );
}

export default function ScrapedPage({ page, slug = [] }) {
  if (!page) return <NotFound />;
  if (slug[0] === "blog" && slug.length === 2) return <BlogPostView data={page} slug={slug[1]} />;
  if (slug.length === 1 && slug[0] === "blog") return <BlogIndexView />;

  const key = slug.join("/");
  const heroOverride = HERO_OVERRIDES[key] || {};
  const pathname = pathFromUrl(page.url) + (slug.length ? "/" : "");
  const isHub = HUB_SLUGS.has(key);
  const isQuote = key === QUOTE_SLUG;
  const isCustomers = key === CUSTOMERS_SLUG;

  const { title: scrapedH1, body: afterHero } = splitHero(enhanceBody(page.bodyHtml, { timelineLists: !isHub }));
  const { tagline, ctas, body: afterTagline } = isHub ? splitTagline(afterHero) : { tagline: "", ctas: "", body: afterHero };
  const title = (scrapedH1 || page.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
  let pageBody = dropLeadingCtas(afterTagline);
  // Language pages with merged sector pages: each leaf becomes a section of this page.
  const leaves = getLeafPages(key).map(({ id, data }) => {
    const { title, body } = splitHero(enhanceBody(data.bodyHtml, { timelineLists: true }));
    return { id, title: title || displayTitle(data), html: body };
  });
  if (leaves.length) pageBody = mergeLeaves(pageBody, leaves);

  const children = isHub ? listChildren(slug) : [];
  // The services hub leads with certified translation (no dedicated page yet: links to the certified will service).
  if (key === "translation-services") {
    children.unshift({
      title: "Certified translation for companies and individuals",
      description: "Certified translations of contracts, company documents, wills and personal papers, with a free quote before you commit.",
      href: "/industry/legal/will-certified-translation-services/",
    });
  }
  let sections = ctaCards(fixHeadingSkips(toSections(pageBody, { more: UI.en.readMore, noFold: NO_FOLD_SLUGS.has(key), cardIcons: NO_FOLD_SLUGS.has(key) })));
  // /translators/: the name list becomes the filterable profile grid (components/TranslatorsGrid.jsx).
  if (key === "translators") sections = sections.replace(/<div class="mini-grid"[^>]*>.*?<\/div><\/div>(<p>CONTACT US<\/p>)?/s, "@@TRANSLATORS@@");

  // /translation-services/: the "every sector" accordion grid becomes the icon cards (components/SectorCards.jsx).
  if (key === "translation-services") sections = sections.replace(/<section(?:(?!<section).)*?every sector.*?<[/]section>/s, "@@SECTORS@@");

  const logos = isCustomers ? (page.images || []).filter((i) => /logo/i.test(i.alt || i.src || "")).slice(0, 12).map((i) => ({ src: i.src, alt: i.alt })) : []; // page.images[].src already localized by lib/content.js at read time

  return (
    <main className={isHub ? "hub" : undefined} data-page={key} data-slug={key}>
      <PageSchema schema={page.schema} />
      <PageFx />
      <section className="page-hero page-hero--split">
        <div className="container container--narrow">
          <div className="page-hero__text">
            <Breadcrumbs pathname={pathname} current={title} />
            <span className="ip-kicker">{KICKER}</span>
            <h1>{title}</h1>
            {heroOverride.lead ? <p className="lead">{heroOverride.lead}</p> : tagline ? <p className="lead page-hero__tagline">{tagline}</p> : page.metaDescription ? <p className="lead">{page.metaDescription}</p> : null}
            {isQuote ? (
              <ul className="quote-hero__ticks">
                <li>Fixed price and deadline before we start</li>
                <li>Specialised native translators</li>
                <li>Reply within a couple of hours</li>
              </ul>
            ) : null}
            {ctas ? (
              <div className="page-hero__cta" dangerouslySetInnerHTML={{ __html: ctas }} />
            ) : !isQuote ? (
              <div className="page-hero__cta">
                <a className="bt-btn bt-btn--primary" href={UI.en.quoteHref}>{UI.en.ctaButton}</a>
                <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.en.ctaSecondary} · {PHONE}</a>
              </div>
            ) : null}
          </div>
          {HERO_IMAGE_SLUGS[key] ? (
            <div className="page-hero__photo">
              <img src={HERO_IMAGE_SLUGS[key].src} alt={HERO_IMAGE_SLUGS[key].alt} width="640" height="480" />
              {HERO_IMAGE_SLUGS[key].credit ? <PhotoCredit credit={HERO_IMAGE_SLUGS[key].credit} /> : null}
            </div>
          ) : null}
          {heroOverride.art === "services" ? <ServicesHeroArt /> : null}
        </div>
      </section>

      {isQuote ? (
        <section className="section section--tint">
          <div className="container container--narrow">
            <ul className="contact-list">
              <li><span>Phone</span><a href={PHONE_HREF}>{PHONE}</a></li>
              <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
            <div className="form-card quote-page__form"><QuoteForm locale="en" /></div>
          </div>
        </section>
      ) : null}

      {isHub && key === "translation-services" ? <ServicesShowcase /> : null}
      {isHub && key !== "translation-services" ? (
        <Children
          items={children}
          title={HUB_TITLES[key] || "Explore"}
          afterTitle={key === "translation-services/england" ? <EnglandMap /> : null}
        />
      ) : null}
      {isCustomers ? <ClientsBand title="Trusted by global brands" logos={logos} /> : null}

      {leaves.length ? (
        <section className="section section--tint leaf-nav">
          <div className="container">
            <p className="leaf-nav__label">Jump to a specialism</p>
            <ul className="pills">
              {leaves.map((l) => (<li key={l.id}><a href={`#${l.id}`}>{leafLabel(l.title)}</a></li>))}
            </ul>
          </div>
        </section>
      ) : null}

      {key === "translators" && sections.includes("@@TRANSLATORS@@") ? (
        <>
          <Sections html={sections.split("@@TRANSLATORS@@")[0] + "</div></section>"} />
          <section className="sec"><div className="sec__in sec__in--wide"><TranslatorsGrid people={TRANSLATORS} /></div></section>
          <Sections html={sections.split("@@TRANSLATORS@@")[1].replace(/^<\/div><\/section>/, "")} />
        </>
      ) : key === "translation-services" && sections.includes("@@SECTORS@@") ? (
        <>
          <Sections html={sections.split("@@SECTORS@@")[0]} />
          <SectorCards />
          <Sections html={sections.split("@@SECTORS@@")[1]} />
        </>
      ) : <Sections html={sections} />}

      {!isHub ? <Children items={children} title={UI.en.related} /> : null}

      {isQuote ? null : <CtaBand />}
    </main>
  );
}
