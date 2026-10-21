// UI strings for chrome/labels. Page copy comes from the scrape; only
// chrome, labels and the home page live in code. Single locale (en) --
// unlike BTvibe-es's three-locale object.
const en = {
  home: "Home", search: "Search", searchPlaceholder: "Search services, languages, articles…",
  searchEmpty: "No results found.", searchHint: "Type at least 2 letters.",
  close: "Close", openMenu: "Open menu", closeMenu: "Close menu",
  ctaTitle: "Need a professional translation?",
  ctaBody: "Request a free, no-obligation quote.",
  ctaButton: "Get a free Quote", ctaSecondary: "Call us", quoteHref: "/translation-agency/quote/",
  related: "Related translation services", readMore: "Read more", allPosts: "All articles",
  blogTitle: "Translation news",
  blogLead: "Blogs about the translation industry.",
  published: "Published", backToBlog: "Back to the blog", moreArticles: "More articles", relatedPosts: "Related articles", minRead: "min read",
  notFound: "Page not found", notFoundBody: "There is no content for this address yet.",
  blogHref: "/blog/", servicesHref: "/translation-services/",
};
export const UI = { en, es: en, fr: en };
export const SUGGEST = {
  en: [
    ["Document translation", "/document-translation-services/"],
    ["Website translation", "/translation-services/website-translation/"],
    ["Remote interpreting", "/translation-services/remote-interpreting/"],
    ["Languages", "/languages/"],
    ["Rates", "/translation-agency/rates/"],
    ["Get a quote", "/translation-agency/quote/"],
  ],
};
export const KIND = { en: { page: "Page", blog: "Blog" } };
export const t = (locale) => UI[locale] || UI.en;
