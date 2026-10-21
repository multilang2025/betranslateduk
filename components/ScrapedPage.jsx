import Image from "next/image";
import { flattenBodyHtml, sanitizeBody, splitHero, splitTagline, toSections, dropLeadingCtas, tidyWidgetDebris, questionRunsToFaq, faqSectionsToFaq, boldQuestionsToFaq, tidyHeadingLevels } from "@/lib/sanitize";
import { extractBlocks, restoreBlocks, withToc, enhanceTables, stripPostChrome, faqBlock } from "@/lib/blogEnhance";
import { listChildren, pathFromUrl, getAllPosts, postDate } from "@/lib/content";
import { toLocalImagePath } from "@/lib/local-image";
import { UI } from "@/lib/i18n";
import { PHONE, PHONE_HREF, EMAIL } from "@/lib/business";
import Breadcrumbs from "./Breadcrumbs";
import CtaBand from "./CtaBand";
import TrustStrip from "./TrustStrip";
import ClientsBand from "./ClientsBand";
import ShareBar from "./ShareBar";
import TocSpy from "./TocSpy";
import PageFx from "./PageFx";
import PageSchema from "./PageSchema";

const KICKER = "Translation agency in the UK";

// Hub pages: their children render as a card/pill grid instead of the
// generic prose body.
const HUB_SLUGS = new Set([
  "languages", "industry", "translation-services", "translation-agency",
  "translation-agency/locations", "translation-services/england",
]);
const QUOTE_SLUG = "translation-agency/quote";
const CUSTOMERS_SLUG = "translation-agency/customers";

function childLabel(title = "") {
  return title.split(/\s[·|–]\s|:\s/)[0]
    .replace(/^(translation services for|translation services|translation|services)\s+(in |for |of )?/i, "")
    .trim() || title;
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
                <h3>{childLabel(c.title)}</h3>
                {c.description ? <p>{c.description}</p> : null}
                <span className="card__more">{UI.readMore}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function enhanceBody(html, { timelineLists = true } = {}) {
  let body = sanitizeBody(html, { dropImageChips: true, timelineLists });
  body = boldQuestionsToFaq(faqSectionsToFaq(questionRunsToFaq(body, "en", faqBlock), faqBlock), faqBlock);
  body = tidyHeadingLevels(body, {});
  body = tidyWidgetDebris(body);
  return body;
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
            <h1>Translation news</h1>
            <p className="lead">Blogs about the translation industry.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="post-grid">
            {posts.map(({ slug, data, date }) => {
              const title = (data.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
              const img = toLocalImagePath(data.og?.image);
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
  const ex = extractBlocks(flattenBodyHtml(data.bodyHtml, { pageSlug: slug }));
  const { title: h1, body: cleanBody } = splitHero(ex.html);
  const title = (h1 || data.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
  const chrome = stripPostChrome(cleanBody);
  const { html: withQ, blocks } = { html: chrome.html, blocks: ex.blocks };
  let body = questionRunsToFaq(withQ, "en", faqBlock, { keepLead: true });
  body = faqSectionsToFaq(body, faqBlock);
  const { html: tocBody, toc } = withToc(enhanceTables(body));
  body = restoreBlocks(tocBody, blocks);
  const publishDate = postDate(data);
  const img = toLocalImagePath(data.og?.image);
  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 4);

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
              {publishDate ? <span>{UI.published} {new Date(publishDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span> : null}
              <span>{readMinutes(data.bodyText)} {UI.minRead}</span>
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
            <h3>{UI.ctaTitle}</h3>
            <a href={UI.quoteHref} className="bt-btn bt-btn--primary quote-card__btn">{UI.ctaButton}</a>
            <a href={PHONE_HREF} className="quote-card__call">Call us · {PHONE}</a>
          </div>
        </aside>
      </section>
      {related.length ? (
        <section className="section section--tint related-posts">
          <div className="container">
            <div className="section-head"><h2>{UI.relatedPosts}</h2></div>
            <div className="post-grid post-grid--related">
              {related.map((c) => {
                const t = (c.data.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
                return (
                  <a key={c.slug} href={`/blog/${c.slug}/`} className="post">
                    <div className="post__body"><h3>{t}</h3><p>{c.data.metaDescription}</p></div>
                  </a>
                );
              })}
            </div>
            <p className="related-posts__all"><a href={UI.blogHref} className="card__more">{UI.backToBlog}</a></p>
          </div>
        </section>
      ) : null}
      <CtaBand />
    </main>
  );
}

export default function ScrapedPage({ page, slug = [] }) {
  if (!page) return null;
  if (slug[0] === "blog" && slug.length === 2) return <BlogPostView data={page} slug={slug[1]} />;
  if (slug.length === 1 && slug[0] === "blog") return <BlogIndexView />;

  const key = slug.join("/");
  const pathname = pathFromUrl(page.url) + (slug.length ? "/" : "");
  const isHome = slug.length === 0;
  const isHub = HUB_SLUGS.has(key);
  const isQuote = key === QUOTE_SLUG;
  const isCustomers = key === CUSTOMERS_SLUG;

  const flat = flattenBodyHtml(page.bodyHtml, { pageSlug: key || "index" });
  const { title: scrapedH1, body: afterHero } = splitHero(enhanceBody(flat, { timelineLists: !isHub }));
  const { tagline, ctas, body: afterTagline } = isHub || isHome ? splitTagline(afterHero) : { tagline: "", ctas: "", body: afterHero };
  const title = (scrapedH1 || page.title || "").replace(/\s*[|·–]\s*BeTranslated.*$/i, "");
  let pageBody = dropLeadingCtas(afterTagline);

  const children = isHub ? listChildren(slug) : [];
  const sections = toSections(pageBody, { more: UI.readMore });

  const logos = isCustomers ? (page.images || []).filter((i) => /logo/i.test(i.alt || i.src || "")).slice(0, 12).map((i) => ({ src: toLocalImagePath(i.src), alt: i.alt })) : [];

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
                <a className="bt-btn bt-btn--primary" href={UI.quoteHref}>{UI.ctaButton}</a>
                <a className="bt-btn bt-btn--ghost" href={PHONE_HREF}>{UI.ctaSecondary} · {PHONE}</a>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {isHome ? <TrustStrip /> : null}

      {isQuote ? (
        <section className="section section--tint">
          <div className="container container--narrow">
            <ul className="contact-list">
              <li><span>Phone</span><a href={PHONE_HREF}>{PHONE}</a></li>
              <li><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>
        </section>
      ) : null}

      {isHub ? <Children items={children} title="Explore" /> : null}
      {isCustomers ? <ClientsBand title="Trusted by global brands" logos={logos} /> : null}

      <Sections html={sections} />

      {!isHub ? <Children items={children} title={UI.related} /> : null}

      {isQuote ? null : <CtaBand />}
    </main>
  );
}
