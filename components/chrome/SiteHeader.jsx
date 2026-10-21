import { getImageProps } from "next/image";
import ThemeToggle from "./ThemeToggle";
import { preload } from "react-dom";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";

// Real scraped betranslated.co.uk header nav (single locale -- no es/fr).
const NAV_ITEMS = {
  en: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/translation-services/",
      children: [
        { label: "Website translation", href: "/translation-services/website-translation/" },
        { label: "Document translation", href: "/document-translation-services/" },
        { label: "Remote interpreting", href: "/translation-services/remote-interpreting/" },
      ],
    },
    { label: "Languages", href: "/languages/" },
    {
      label: "Expertise",
      href: "/industry/",
      children: [
        { label: "Business & finance", href: "/industry/business/" },
        { label: "High tech & IT", href: "/industry/it-telecom/" },
        { label: "Industry & construction", href: "/industry/technical/" },
        { label: "Marketing & sales", href: "/industry/marketing/" },
        { label: "Tourism & travel", href: "/industry/tourism/" },
        { label: "Legal", href: "/industry/legal/" },
        { label: "Medical", href: "/industry/medical/" },
      ],
    },
    {
      label: "About",
      href: "/translation-agency/",
      children: [
        { label: "Turnaround", href: "/translation-agency/turnaround/" },
        { label: "Rates", href: "/translation-agency/rates/" },
        { label: "Customers", href: "/translation-agency/customers/" },
        { label: "Translators", href: "/translators/" },
        { label: "Locations", href: "/translation-agency/locations/" },
        { label: "Contact us", href: "/contact-us/" },
      ],
    },
    { label: "Blog", href: "/blog/" },
  ],
};

const CTA_LABEL = { en: "Get a free quote" };
const CTA_HREF = { en: "/translation-agency/quote/" };

// Header logo: dark grey letters on light, white letters in dark mode. getImageProps
// keeps the optimised srcSets of next/image inside a <picture>.
const LOGO = { alt: "", width: 160, height: 32, priority: true };
const { props: LOGO_LIGHT } = getImageProps({ ...LOGO, src: "/brand/logo-horizontal.avif" });
const { props: LOGO_DARK } = getImageProps({ ...LOGO, src: "/brand/logo-on-dark.avif" });

export default function SiteHeader() {
  // Each scheme preloads only its own logo (what priority did for the single image).
  preload(LOGO_LIGHT.src, { as: "image", imageSrcSet: LOGO_LIGHT.srcSet, fetchPriority: "high", media: "(prefers-color-scheme: light)" });
  preload(LOGO_DARK.src, { as: "image", imageSrcSet: LOGO_DARK.srcSet, fetchPriority: "high", media: "(prefers-color-scheme: dark)" });
  const items = NAV_ITEMS.en;
  const home = "/";
  const ctaLabel = CTA_LABEL.en;
  const ctaHref = CTA_HREF.en;

  return (
    <>
    <header className="bt-header">
      <div className="bt-header__inner">
        <a href={home} className="bt-header__logo" aria-label="BeTranslated">
          {/* Dark mode swaps in the white-lettered logo (same size, no layout shift). */}
          {/* Both logos are in the page; app/dark.css shows the white one in dark mode (system or switch). */}
          <img {...LOGO_LIGHT} className="bt-logo--light" alt="BeTranslated" fetchPriority="high" style={{ ...LOGO_LIGHT.style, height: 32, width: "auto" }} />
          <img {...LOGO_DARK} className="bt-logo--dark" alt="BeTranslated" style={{ ...LOGO_DARK.style, height: 32, width: "auto" }} />
        </a>

        <nav className="bt-header__nav" aria-label="Principal">
          {items.map((item) =>
            item.children ? (
              <div key={item.href} className="bt-header__item">
                <a href={item.href} className="bt-header__link bt-header__link--parent" aria-haspopup="true">
                  {item.label}
                </a>
                <div className="bt-header__sub">
                  {item.children.map((c) => (
                    <a key={c.href} href={c.href} className="bt-header__sublink">{c.label}</a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href} className="bt-header__link">
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="bt-header__right">
          <SearchBox />
          <ThemeToggle />
          <a href={ctaHref} className="bt-btn bt-btn--primary bt-btn--sm bt-header__cta">
            {ctaLabel}
          </a>
          <MobileMenu items={items} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        </div>
      </div>
    </header>
    </>
  );
}
