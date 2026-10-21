// Single-locale (en-GB) UI chrome copy -- the site has no i18n routing, so
// this is a plain object instead of ES's per-locale t(locale) lookup.
import { PHONE, PHONE_HREF } from "./business";

export const UI = {
  home: "Home",
  related: "You may also be interested in",
  readMore: "Read more",
  ctaTitle: "Need a translation quote?",
  ctaBody: "Tell us what you need and one of our managers will reply within a couple of hours.",
  ctaButton: "Get a free Quote",
  ctaSecondary: "Call us",
  quoteHref: "/translation-agency/quote/",
  blogHref: "/blog/",
  backToBlog: "Back to the blog",
  relatedPosts: "Related articles",
  published: "Published",
  minRead: "min read",
  teamTitle: "Our translators",
  phone: PHONE,
  phoneHref: PHONE_HREF,
};

export function t() {
  return UI;
}
