import Image from "next/image";
import { BRAND, SOCIAL } from "./socialIcons";
import CookieSettingsLink from "./CookieSettingsLink";

// Same copy, links and columns as the live betranslated.co.uk footer.
const TAGLINE = "BeTranslated is a boutique translation agency with offices in the US, Belgium, Spain, France and Germany. Our global network of experienced translators provides professional language services to clients around the world.";
const RATING = { value: 5.0, count: 61 };
const GBP_URL = "https://admin.trustindex.io/api/googleReview?place-id=ChIJ0Sk8jvRIYA0R9J6Ne-7b8cw";

const QUICK_LINKS = [
  ["Our Services", "/translation-services/"],
  ["Expertise", "/industry/"],
  ["Languages", "/languages/"],
  ["About Us", "/translation-agency/"],
  ["Translation Rates", "/translation-agency/rates/"],
  ["Turnaround Time", "/translation-agency/turnaround/"],
];

const RECENT_ARTICLES = [
  ["10 Expressions from The IT Crowd Challenging for Non-Native Speakers", "/blog/expressions-from-the-it-crowd/"],
  ["From Beckham to Bellingham: Footballers Who Shaped a Nation", "/blog/british-footballers/"],
  ["7 Unconscious British Habits That Especially Stand Out Abroad", "/blog/8-british-habits-that-stand-out-abroad/"],
  ["AI Can’t Think for You! A Wake-Up Call for Businesses Relying Too Heavily on AI", "/blog/ai-disadvantages-for-businesses/"],
  ["Lost in translation? The Eccentric Differences within British English", "/blog/british-english/"],
];

// Other BeTranslated sites, as linked in the legacy footer's site switcher.
const ALSO_IN = [
  ["EN (INTL)", "https://betranslated.com/"],
  ["EN (CA)", "https://www.betranslated.ca/"],
  ["FR (FR)", "https://www.betranslated.fr/"],
  ["FR (BE)", "https://www.betranslated.be/fr/"],
  ["NL (BE)", "https://www.betranslated.be/nl/"],
  ["ES", "https://www.betranslated.es/"],
  ["DE", "https://betranslated.com/de/"],
  ["IT", "https://betranslated.com/it/"],
];

const Glyph = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

const Line = ({ d }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function SiteFooter() {
  return (
    <footer className="bt-footer">
      <div className="bt-footer__inner">
        <div className="bt-footer__brand">
          <a href="/" className="bt-footer__logo" aria-label="BeTranslated">
            <Image
              src="/brand/logo-horizontal.avif"
              alt="BeTranslated"
              width={140}
              height={28}
              style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)" }}
            />
          </a>
          <p className="bt-footer__tagline">{TAGLINE}</p>
          <a className="bt-footer__rating" href={GBP_URL} target="_blank" rel="noopener noreferrer">
            <span className="bt-footer__g" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.2-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg></span>
            <span className="bt-footer__rt"><span className="bt-footer__stars" aria-hidden="true">★★★★★</span><span>{RATING.value.toFixed(1)} · {RATING.count} reviews</span></span>
          </a>
          <div className="bt-footer__follow">
            <span className="bt-footer__col-title">Follow Us</span>
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

        <nav className="bt-footer__col" aria-label="Quick Links">
          <div className="bt-footer__col-title">Quick Links</div>
          {QUICK_LINKS.map(([label, href]) => (
            <a key={href} href={href} className="bt-footer__link">{label}</a>
          ))}
        </nav>

        <nav className="bt-footer__col" aria-label="Recent Articles">
          <div className="bt-footer__col-title">Recent Articles</div>
          {RECENT_ARTICLES.map(([label, href]) => (
            <a key={href} href={href} className="bt-footer__link">{label}</a>
          ))}
        </nav>

        <nav className="bt-footer__col" aria-label="Also available in">
          <div className="bt-footer__col-title">Also Available In</div>
          {ALSO_IN.map(([label, href]) => (
            <a key={href} href={href} className="bt-footer__link">{label}</a>
          ))}
        </nav>

        <div className="bt-footer__col bt-footer__contact">
          <div className="bt-footer__col-title">Contact</div>
          <a href="tel:+442030269848" className="bt-footer__link bt-footer__ci">
            <Line d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            <span className="bt-footer__nw">+44 20 3026 9848</span>
          </a>
          <a href="mailto:global@betranslated.com" className="bt-footer__link bt-footer__ci">
            <Line d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />
            <span>global@betranslated.com</span>
          </a>
          <a href="https://www.betranslated.co.uk/contact-us/" className="bt-footer__link bt-footer__ci">
            <Line d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <span>International House, 24 Holborn Viaduct<br />London EC1A 2BN, UK</span>
          </a>
        </div>
      </div>
      <div className="bt-footer__bottom">
        {/* shortcut: static year, cacheComponents forbids Date() at prerender; bump yearly */}
        <span>© 2026 BeTranslated · All rights reserved</span>
        <a href="/terms-conditions/" className="bt-footer__link">Terms & Conditions</a>
        <CookieSettingsLink label="Cookie settings" />
      </div>
    </footer>
  );
}
