import { SOCIAL } from "../components/chrome/socialIcons";
// Company facts shared by the visible trust elements (TrustStrip) and the
// structured data (lib/schema.js). Change a figure here and both follow.
// No server-only imports: TrustStrip is a client component.
// Values scraped verbatim from the live site's own JSON-LD and footer copy
// (scripts/btvibe-uk/output/pages/index.json, contact-us.json) -- nothing
// here is invented.

export const RATING = { value: 4.9, count: 79, best: 5, worst: 1 };

export const GBP_URL = "https://www.google.com/maps/place//data=!4m2!3m1!1s0xd6048f48e3c29d1:0xccf1dbee7b8d9ef4?sa=X&ved=1t:8290&hl=en";

export const PHONE = "+44 20 3026 9848";
export const PHONE_HREF = "tel:+442030269848";
export const EMAIL = "hello@betranslated.co.uk";
export const QUOTE_HREF = "/translation-agency/quote/";

export const BUSINESS = {
  name: "BeTranslated",
  email: EMAIL,
  telephone: PHONE,
  foundingDate: "2002",
  address: {
    streetAddress: "International House, 24 Holborn Viaduct",
    postalCode: "EC1A 2BN",
    addressLocality: "London",
    addressCountry: "GB",
  },
  priceRange: "££",
  logo: { path: "/brand/logo-schema.png", width: 512, height: 512 },
  sameAs: [GBP_URL, ...SOCIAL.map(([, , url]) => url)],
};
