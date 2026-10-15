import { CONTACT, QUOTE_URL, live, main } from "@/lib/site";

/**
 * Footer content, modelled on the betranslated.com footer.
 * Every link goes to the page that answers the visitor's question: UK pages stay on betranslated.co.uk,
 * services that only exist on the main site (digital marketing, on-site interpreting) go to betranslated.com.
 * Only the first `visible` links show. The rest sit behind a "N more" expander so nothing is hidden for good.
 */

export type FooterIcon =
  | "Scale" | "HeartPulse" | "Wrench" | "Landmark" | "Megaphone" | "FileText" | "Globe" | "BadgeCheck" | "Plane"
  | "Cpu" | "Layers" | "Languages" | "Headphones" | "Mic" | "Users" | "Video" | "Search" | "Share2" | "Mail"
  | "Palette" | "ScanSearch" | "Info" | "Banknote" | "Clock" | "MapPin" | "UserCheck" | "Building2" | "Newspaper"
  | "MessageCircle" | "PenLine" | "Zap";

export type FooterLink = { label: string; href: string; icon: FooterIcon };
export type FooterGroup = { title: string; visible: number; links: FooterLink[] };

export const footerBrand = {
  /** Keywords and phrasing follow the homepage: UK translation agency, interpreting, multilingual SEO, global growth. */
  description:
    "BeTranslated is the UK translation agency that helps businesses win customers in every market. Expert translators and interpreters, plus multilingual SEO, for over 20 years.",
};

export const footerGroups: FooterGroup[] = [
  {
    title: "Translation Services",
    visible: 6,
    links: [
      { label: "Legal Translation", href: live("/industry/legal/"), icon: "Scale" },
      { label: "Medical Translation", href: live("/industry/medical/"), icon: "HeartPulse" },
      { label: "Technical Translation", href: live("/industry/technical/"), icon: "Wrench" },
      { label: "Business & Finance", href: live("/industry/business/"), icon: "Landmark" },
      { label: "Marketing Translation", href: live("/industry/marketing/"), icon: "Megaphone" },
      { label: "All Translation Services", href: live("/translation-services/"), icon: "Layers" },
      { label: "Document Translation", href: live("/document-translation-services/"), icon: "FileText" },
      { label: "Website Translation", href: live("/translation-services/website-translation/"), icon: "Globe" },
      { label: "High Tech & IT", href: live("/industry/it-telecom/"), icon: "Cpu" },
      { label: "Tourism & Travel", href: live("/industry/tourism/"), icon: "Plane" },
      { label: "Sworn & Certified", href: main("/sworn-translation-services/"), icon: "BadgeCheck" },
      { label: "Urgent Translation", href: main("/urgent-translation-services/"), icon: "Zap" },
    ],
  },
  {
    title: "Interpreting",
    visible: 6,
    links: [
      { label: "Remote Interpreting", href: live("/translation-services/remote-interpreting/"), icon: "Headphones" },
      { label: "On-Site Interpreting", href: main("/on-site-interpreting-services/"), icon: "Users" },
      { label: "Conference Interpreting", href: main("/on-site-interpreting-services/simultaneous/"), icon: "Mic" },
      { label: "Consecutive Interpreting", href: main("/on-site-interpreting-services/consecutive/"), icon: "MessageCircle" },
      { label: "Video Interpreting", href: main("/video-remote-interpreting-services/"), icon: "Video" },
      { label: "All Interpreting Services", href: main("/translation-services/interpreting-services/"), icon: "Layers" },
    ],
  },
  {
    title: "Digital Services",
    visible: 7,
    links: [
      { label: "Multilingual SEO", href: main("/digital/services/seo/"), icon: "Search" },
      { label: "Social Media", href: main("/digital/services/social-media/"), icon: "Share2" },
      { label: "Paid Ads", href: main("/digital/services/paid-ads/"), icon: "Megaphone" },
      { label: "Content Marketing", href: main("/digital/services/content-marketing/"), icon: "FileText" },
      { label: "Email Marketing", href: main("/digital/services/email-marketing/"), icon: "Mail" },
      { label: "Branding & Design", href: main("/digital/services/branding-design/"), icon: "Palette" },
      { label: "All Digital Services", href: main("/digital/services/"), icon: "Layers" },
      { label: "Free SEO Audit", href: main("/digital/free-seo-audit/"), icon: "ScanSearch" },
    ],
  },
  {
    title: "Languages",
    visible: 6,
    links: [
      { label: "French", href: live("/languages/french-translation-services/"), icon: "Languages" },
      { label: "English", href: live("/languages/english-translation-services/"), icon: "Languages" },
      { label: "Italian", href: live("/languages/italian-translation-services/"), icon: "Languages" },
      { label: "Spanish", href: live("/languages/spanish-translation-services/"), icon: "Languages" },
      { label: "German", href: live("/languages/german-translation-services/"), icon: "Languages" },
      { label: "Dutch", href: live("/languages/dutch-translation-services/"), icon: "Languages" },
      { label: "Portuguese", href: live("/languages/portuguese-translation-services/"), icon: "Languages" },
      { label: "Korean", href: live("/languages/korean-translation-services/"), icon: "Languages" },
      { label: "All Languages", href: live("/languages/"), icon: "Layers" },
    ],
  },
  {
    title: "Company",
    visible: 6,
    links: [
      { label: "About Us", href: live("/translation-agency/"), icon: "Info" },
      { label: "Translation Rates", href: live("/translation-agency/rates/"), icon: "Banknote" },
      { label: "Turnaround Time", href: live("/translation-agency/turnaround/"), icon: "Clock" },
      { label: "Blog", href: live("/blog/"), icon: "Newspaper" },
      { label: "Contact Us", href: live("/contact-us/"), icon: "MessageCircle" },
      { label: "Get a Free Quote", href: QUOTE_URL, icon: "PenLine" },
      { label: "Our Customers", href: live("/translation-agency/customers/"), icon: "Building2" },
      { label: "Our Translators", href: live("/translators/"), icon: "UserCheck" },
      { label: "Locations", href: live("/translation-agency/locations/"), icon: "MapPin" },
    ],
  },
];

export const footerContact = {
  title: "Contact Us",
  addressLines: ["International House, 24 Holborn Viaduct", "London EC1A 2BN, UK"],
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=International+House+24+Holborn+Viaduct+London+EC1A+2BN",
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
  email: CONTACT.email,
  emailHref: CONTACT.emailHref,
};

export const footerSocial = [
  { label: "Facebook", href: "https://www.facebook.com/BeTranslated", icon: "Facebook" },
  { label: "X", href: "https://x.com/BeTranslated_HQ", icon: "Twitter" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/betranslated/", icon: "Linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/betranslatedintl/", icon: "Instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@betranslated-intl", icon: "Youtube" },
] as const;

export const footerSites = {
  title: "BeTranslated around the world",
  links: [
    { label: "International (EN)", href: "https://betranslated.com/" },
    { label: "Canada (EN)", href: "https://www.betranslated.ca/" },
    { label: "France (FR)", href: "https://www.betranslated.fr/" },
    { label: "Belgique (FR)", href: "https://www.betranslated.be/fr/" },
    { label: "België (NL)", href: "https://www.betranslated.be/nl/" },
    { label: "España (ES)", href: "https://www.betranslated.es/" },
    { label: "Deutschland (DE)", href: "https://betranslated.com/de/" },
    { label: "Italia (IT)", href: "https://betranslated.com/it/" },
  ],
};

export const footerLegal = {
  company: "BeTranslated International",
  links: [
    { label: "Terms & Conditions", href: live("/terms-conditions/") },
    { label: "Privacy Policy", href: main("/privacy/") },
    { label: "Cookie Policy", href: main("/cookies/") },
  ],
};
