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
import { KICKER } from "./StdHero";
import NotFound from "./NotFoundView";

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

function Children({ items, title }) {
  if (items.length < 2) return null;
  return (
    <section className="section section--tint">
      <div className="container">
        <div className="section-head"><h2>{title}</h2></div>
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
  const posts = getAllPosts();
  return (
    <main>
      <PageFx />
      <section className="page-hero">
        <div className="container container--narrow">
          <div className="page-hero__text">
            <Breadcrumbs pathname="/blog/" current="Blog" />
            <span className="ip-kicker">{KICKER}</span>
            <h1>{UI.en.blogTitle}</h1>
            <p className="lead">{UI.en.blogLead}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><h2>Latest articles</h2></div>
          <div className="post-grid">
            {posts.map(({ slug, data, date }) => {
              const title = displayTitle(data);
              const img = data.og?.image; // already localized by lib/content.js at read time
              return (
                <a key={slug} href={`/blog/${slug}/`} className="post">
                  <div className="post__media">
                    {img ? <Image src={img} alt="" width={290} height={180} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 290px" /> : <span className="post__ph" aria-hidden="true">{title.charAt(0)}</span>}
                  </div>
                  <div className="post__body">
                    <h3>{title}</h3>
                    <p>{data.metaDescription}</p>
                    {date ? <time dateTime={date}>{new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</time> : null}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

function readMinutes(text = "") {
  return Math.max(1, Math.round(String(text).split(/\s+/).filter(Boolean).length / 200));
}

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
  const { html: tocBody, toc } = withToc(enhanceTables(body));
  body = restoreBlocks(tocBody, ex.blocks);
  const publishDate = postDate(data);
  const img = data.og?.image; // already localized by lib/content.js at read time
  const related = relatedPosts(slug, 4);

  return (
    <main className="blog-post">
      <PageSchema schema={data.schema} />
      <TocSpy />
      <PageFx />
      <section className="page-hero page-hero--split page-hero--post-split">
        <div className="container container--narrow">
          <div className="page-hero__text">
            <Breadcrumbs pathname={pathname} current={title} />
            <h1>{title}</h1>
            {data.metaDescription ? <p className="page-hero__sub">{data.metaDescription}</p> : null}
            <div className="post-hero__meta">
              {publishDate ? <span>{UI.en.published} {new Date(publishDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span> : null}
              <span>{readMinutes(data.bodyText)} {UI.en.minRead}</span>
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
            <div className="post-grid post-grid--related">
              {related.map((c) => (
                <a key={c.href} href={c.href} className="post">
                  <div className="post__media">
                    {c.img ? <Image src={c.img} alt="" width={c.imgW} height={c.imgH} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 290px" /> : <span className="post__ph" aria-hidden="true">{c.title.charAt(0)}</span>}
                  </div>
                  <div className="post__body">
                    <div className="post__top">{c.date ? <time dateTime={c.date} className="post__meta">{new Date(c.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</time> : <span />}</div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                  </div>
                </a>
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
  let sections = ctaCards(fixHeadingSkips(toSections(pageBody, { more: UI.en.readMore })));
  // /translators/: the name list becomes the filterable profile grid (components/TranslatorsGrid.jsx).
  if (key === "translators") sections = sections.replace(/<div class="mini-grid"[^>]*>.*?<\/div><\/div>(<p>CONTACT US<\/p>)?/s, "@@TRANSLATORS@@");

  const logos = isCustomers ? (page.images || []).filter((i) => /logo/i.test(i.alt || i.src || "")).slice(0, 12).map((i) => ({ src: i.src, alt: i.alt })) : []; // page.images[].src already localized by lib/content.js at read time

  return (
    <main className={isHub ? "hub" : undefined}>
      <PageSchema schema={page.schema} />
      <PageFx />
      <section className="page-hero page-hero--split">
        <div className="container container--narrow">
          <div className="page-hero__text">
            <Breadcrumbs pathname={pathname} current={title} />
            <span className="ip-kicker">{KICKER}</span>
            <h1>{title}</h1>
            {tagline ? <p className="lead page-hero__tagline">{tagline}</p> : page.metaDescription ? <p className="lead">{page.metaDescription}</p> : null}
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

      {isHub ? <Children items={children} title={HUB_TITLES[key] || "Explore"} /> : null}
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
      ) : <Sections html={sections} />}

      {!isHub ? <Children items={children} title={UI.en.related} /> : null}

      {isQuote ? null : <CtaBand />}
    </main>
  );
}
