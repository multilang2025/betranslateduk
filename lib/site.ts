/** Site-wide constants. Every link to a page that is not in this copy yet points at the live site. */
export const LIVE_ORIGIN = "https://www.betranslated.co.uk";
export const MAIN_ORIGIN = "https://betranslated.com";

/** Build a link to the live UK site, e.g. live("/translation-services/"). */
export function live(path: string): string {
  return `${LIVE_ORIGIN}${path}`;
}

/** Build a link to betranslated.com, e.g. main("/digital/services/seo/"). */
export function main(path: string): string {
  return `${MAIN_ORIGIN}${path}`;
}

/** Quote links carry the UK campaign source. */
export const QUOTE_URL = `${MAIN_ORIGIN}/translation-quote/?utm_source=betranslated-couk`;
export const INTERPRETING_QUOTE_URL = `${MAIN_ORIGIN}/interpretation-quote/?utm_source=betranslated-couk`;
export const SEO_AUDIT_URL = `${MAIN_ORIGIN}/digital/free-seo-audit/?utm_source=betranslated-couk`;

export const CONTACT = {
  phone: "+44 20 3026 9848",
  phoneHref: "tel:+442030269848",
  email: "global@betranslated.com",
  emailHref: "mailto:global@betranslated.com",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/translation-services/" },
  { label: "Languages", href: "/languages/" },
  { label: "About", href: "/translation-agency/" },
  { label: "Blog", href: live("/blog/") },
  { label: "Contact", href: "/contact-us/" },
  { label: "Quote", href: QUOTE_URL },
] as const;
