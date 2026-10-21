import { getImageProps } from "next/image";
import ThemeToggle from "./ThemeToggle";
import { preload } from "react-dom";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";

// Same top-level links and hrefs as the live betranslated.co.uk header.
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/translation-services/",
    children: [
      { label: "Document translation", href: "/document-translation-services/" },
      { label: "Website translation", href: "/translation-services/website-translation/" },
    ],
  },
  {
    label: "Languages",
    href: "/languages/",
    children: [
      { label: "English", href: "/languages/english-translation-services/" },
      { label: "French", href: "/languages/french-translation-services/" },
      { label: "German", href: "/languages/german-translation-services/" },
      { label: "Italian", href: "/languages/italian-translation-services/" },
      { label: "Portuguese", href: "/languages/portuguese-translation-services/" },
      { label: "Spanish", href: "/languages/spanish-translation-services/" },
      { label: "Dutch", href: "/languages/dutch-translation-services/" },
    ],
  },
  {
    label: "Expertise",
    href: "/industry/",
    children: [
      { label: "Business & Finance", href: "/industry/business/" },
      { label: "High Tech & IT", href: "/industry/it-telecom/" },
      { label: "Industry & Construction", href: "/industry/technical/" },
      { label: "Legal", href: "/industry/legal/" },
      { label: "Marketing & Sales", href: "/industry/marketing/" },
      { label: "Tourism & Travel", href: "/industry/tourism/" },
    ],
  },
  {
    label: "About",
    href: "/translation-agency/",
    children: [
      { label: "Customers", href: "/translation-agency/customers/" },
      { label: "Locations", href: "/translation-agency/locations/" },
      { label: "Rates", href: "/translation-agency/rates/" },
      { label: "Turnaround", href: "/translation-agency/turnaround/" },
    ],
  },
  { label: "Translators", href: "/translators/" },
  { label: "Blog", href: "/blog/" },
];

const CTA_LABEL = "Get a Free Quote";
const CTA_HREF = "https://betranslated.com/translation-quote/?utm_source=betranslated-couk";

// Header logo: dark grey letters on light, white letters in dark mode. getImageProps
// keeps the optimised srcSets of next/image inside a <picture>.
const LOGO = { alt: "", width: 160, height: 32, priority: true };
const { props: LOGO_LIGHT } = getImageProps({ ...LOGO, src: "/brand/logo-horizontal.avif" });
const { props: LOGO_DARK } = getImageProps({ ...LOGO, src: "/brand/logo-on-dark.avif" });

export default function SiteHeader() {
  preload(LOGO_LIGHT.src, { as: "image", imageSrcSet: LOGO_LIGHT.srcSet, fetchPriority: "high", media: "(prefers-color-scheme: light)" });
  preload(LOGO_DARK.src, { as: "image", imageSrcSet: LOGO_DARK.srcSet, fetchPriority: "high", media: "(prefers-color-scheme: dark)" });

  return (
    <header className="bt-header">
      <div className="bt-header__inner">
        <a href="/" className="bt-header__logo" aria-label="BeTranslated">
          <img {...LOGO_LIGHT} className="bt-logo--light" alt="BeTranslated" fetchPriority="high" style={{ ...LOGO_LIGHT.style, height: 32, width: "auto" }} />
          <img {...LOGO_DARK} className="bt-logo--dark" alt="BeTranslated" style={{ ...LOGO_DARK.style, height: 32, width: "auto" }} />
        </a>

        <nav className="bt-header__nav" aria-label="Primary">
          {NAV_ITEMS.map((item) =>
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
          <a href={CTA_HREF} className="bt-btn bt-btn--primary bt-btn--sm bt-header__cta">
            {CTA_LABEL}
          </a>
          <MobileMenu items={[...NAV_ITEMS, { label: "Contact us", href: "/contact-us/" }]} ctaLabel={CTA_LABEL} ctaHref={CTA_HREF} />
        </div>
      </div>
    </header>
  );
}
