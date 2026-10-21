import Image from "next/image";
import { BRAND, SOCIAL, WHATSAPP } from "./socialIcons";
import { GBP_URL, RATING, PHONE, PHONE_HREF, EMAIL } from "../../lib/business";
import CookieSettingsLink from "./CookieSettingsLink";

// Real scraped betranslated.co.uk footer nav (single locale -- no es/fr).
const COPY = {
  en: {
    tagline: "UK translation agency for business, legal, technical and marketing documents, since 2002. Over 20 years of experience across a wide range of European and Asian languages.",
    rating: `${RATING.value.toFixed(1)} · ${RATING.count} Google reviews`,
    follow: "Follow us",
    columns: [
      {
        title: "Services",
        links: [
          ["Document translation", "/document-translation-services/"],
          ["Website translation", "/translation-services/website-translation/"],
          ["Remote interpreting services", "/translation-services/remote-interpreting/"],
        ],
      },
      {
        title: "Expertise",
        links: [
          ["Business & finance", "/industry/business/"],
          ["High tech & IT", "/industry/it-telecom/"],
          ["Industry & construction", "/industry/technical/"],
          ["Marketing & sales", "/industry/marketing/"],
          ["Tourism & travel", "/industry/tourism/"],
          ["Legal", "/industry/legal/"],
          ["Medical", "/industry/medical/"],
        ],
      },
      {
        title: "Languages",
        links: [
          ["French", "/languages/french-translation-services/"],
          ["English", "/languages/english-translation-services/"],
          ["Italian", "/languages/italian-translation-services/"],
          ["Spanish", "/languages/spanish-translation-services/"],
          ["German", "/languages/german-translation-services/"],
          ["Korean", "/languages/korean-translation-services/"],
          ["Dutch", "/languages/dutch-translation-services/"],
          ["Portuguese", "/languages/portuguese-translation-services/"],
        ],
      },
      {
        title: "About us",
        links: [
          ["Rates", "/translation-agency/rates/"],
          ["Turnaround", "/translation-agency/turnaround/"],
          ["Customers", "/translation-agency/customers/"],
          ["Translators", "/translators/"],
          ["Locations", "/translation-agency/locations/"],
          ["Contact us", "/contact-us/"],
        ],
      },
    ],
    contactTitle: "Contact",
    phone: "Phone",
    legal: "All rights reserved",
    cookies: "Cookie settings",
    bottomLinks: [
      ["Terms & conditions", "/terms-conditions/"],
      ["Blog", "/blog/"],
    ],
  },
};
const Glyph = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

const Line = ({ d }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function SiteFooter() {
  const c = COPY.en;
  const home = "/";

  return (
    <footer className="bt-footer">
      <div className="bt-footer__inner">
        <div className="bt-footer__brand">
          <a href={home} className="bt-footer__logo" aria-label="BeTranslated">
            <Image
              src="/brand/logo-horizontal.avif"
              alt="BeTranslated"
              width={140}
              height={28}
              style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)" }}
            />
          </a>
          <p className="bt-footer__tagline">{c.tagline}</p>
          <a className="bt-footer__rating" href={GBP_URL} target="_blank" rel="noopener noreferrer">
            <span className="bt-footer__g" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.2-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg></span>
            <span className="bt-footer__rt"><span className="bt-footer__stars" aria-hidden="true">★★★★★</span><span>{c.rating}</span></span>
          </a>
          <div className="bt-footer__follow">
            <span className="bt-footer__col-title">{c.follow}</span>
            <ul className="bt-footer__social">
              {SOCIAL.map(([k, name, href]) => (
                <li key={k}>
                  <a className={`bt-footer__soc bt-footer__soc--${k}`} href={href} target="_blank" rel="noopener noreferrer me" aria-label={`BeTranslated · ${name}`} title={name}>
                    <Glyph d={BRAND[k]} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {c.columns.map((col) => (
          <nav key={col.title} className="bt-footer__col" aria-label={col.title}>
            <div className="bt-footer__col-title">{col.title}</div>
            {col.links.map(([label, href]) => (
              <a key={href} href={href} className="bt-footer__link">{label}</a>
            ))}
          </nav>
        ))}

        <div className="bt-footer__col bt-footer__contact">
          <div className="bt-footer__col-title">{c.contactTitle}</div>
          <a href={PHONE_HREF} className="bt-footer__link bt-footer__ci">
            <Line d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            <span className="bt-footer__nw">{PHONE}</span>
          </a>
          <a href={`https://wa.me/${WHATSAPP}`} className="bt-footer__link bt-footer__ci" target="_blank" rel="noopener noreferrer">
            <Glyph d={BRAND.whatsapp} size={16} />
            <span>WhatsApp <span className="bt-footer__nw">{PHONE}</span></span>
          </a>
          <a href={`mailto:${EMAIL}`} className="bt-footer__link bt-footer__ci">
            <Line d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />
            <span>{EMAIL}</span>
          </a>
        </div>
      </div>
      <div className="bt-footer__bottom">
        <span>© 2026 BeTranslated · {c.legal}</span>
        {c.bottomLinks.map(([label, href, lang]) => (
          <a key={href} href={href} hrefLang={lang} className="bt-footer__link">{label}</a>
        ))}
        <CookieSettingsLink label={c.cookies} />
      </div>
    </footer>
  );
}
