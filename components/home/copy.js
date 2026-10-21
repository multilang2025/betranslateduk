// UK homepage copy, pulled verbatim from scripts/btvibe-uk/output/pages/index.json
// (real scraped headings/body text) -- nothing invented. Single locale ("en"),
// unlike BTvibe-es's three-locale object; "es"/"fr" alias "en" so any stray
// HOME[locale] lookup with a different key never crashes.
const en = {
  eyebrow: "Professional language services",
  h1a: "Your UK translation agency for", h1b: "business growth", h1c: "Worldwide",
  lead: "BeTranslated is the translation company UK businesses, institutions and NGOs call when accuracy matters. We deliver corporate translation services, interpreting and multilingual SEO in a wide range of European and Asian languages.",
  cta1: "Get a free quote", quoteHref: "/translation-agency/quote/", servicesHref: "/translation-services/",
  since: "Since 2002",
  proof: [["4.9", "Google rating"], ["79", "Google reviews"]],
  clientsLabel: "Trusted by global brands",

  servicesEyebrow: "Our services",
  themesTitle: "Translation, Interpreting and Digital Marketing Services for UK Businesses Going Global",
  servicesLead: "Quality, deadlines and competitive prices for every kind of language project.",
  more: "Read more", moreAbout: "More about",
  serviceGroups: [
    {
      kind: "documents",
      title: "Legal, Business and Technical Translation Services",
      lead: "Contracts, accounts and technical manuals have to be right first time. Our specialist translators have worked with UK businesses for over 20 years, and you get a free quote before you commit.",
      items: [
        ["Legal document translation services", "/industry/legal/"],
        ["Business and financial translation", "/industry/business/"],
        ["Website translation services", "/translation-services/website-translation/"],
        ["Construction and engineering translation", "/industry/technical/"],
      ],
      href: "/document-translation-services/",
    },
    {
      kind: "interpreting",
      title: "Remote and On-Site Interpreting Services for Live Meetings",
      lead: "Professional interpreters for multilingual meetings, site visits and legal proceedings, online or in person.",
      items: [
        ["Legal interpreting services", "/translation-services/remote-interpreting/"],
        ["Business and finance interpreting", "/translation-services/remote-interpreting/"],
        ["Remote interpreting services", "/translation-services/remote-interpreting/"],
      ],
      href: "/translation-services/remote-interpreting/",
    },
    {
      kind: "marketing",
      title: "Multilingual SEO, GEO and Digital Marketing for Global Growth",
      lead: "Website language conversion, international paid advertising and multilingual branding for businesses going global.",
      items: [
        ["Website language conversion", "/translation-services/website-translation/"],
        ["IT and telecoms translation", "/industry/it-telecom/"],
        ["Marketing translation services", "/industry/marketing/"],
      ],
      href: "/translation-services/website-translation/",
    },
  ],

  specEyebrow: "Professional translation services", specTitle: "Translation of professional documents",
  specialties: [
    ["Document translation", "From a single page to a full manual. Quality, deadlines and a price that fits your budget.", "/document-translation-services/"],
    ["Website translation", "SEO translation for websites, blogs and online stores.", "/translation-services/website-translation/"],
    ["Business & finance", "Reports, accounts, tenders and corporate documents.", "/industry/business/"],
    ["High tech & IT", "Interfaces, documentation and support content, translated and localised.", "/industry/it-telecom/"],
    ["Industry & construction", "Manuals, data sheets and specifications in your sector's terminology.", "/industry/technical/"],
    ["Marketing & sales", "Campaigns, websites and social media in your brand's tone, in every language.", "/industry/marketing/"],
    ["Travel & tourism", "Websites, brochures and menus in your visitors' language.", "/industry/tourism/"],
    ["Legal translation", "Contracts, patents and certified documents.", "/industry/legal/"],
  ],

  trustTitle: "The UK translation agency that takes your business global",
  trustBody: "Over 20 years of experience delivering accurate, on-time translation, interpreting and multilingual marketing for UK businesses, institutions and NGOs.",
  reviewCta: "Leave us a Google review",

  pairsEyebrow: "Languages", pairsTitle: "Languages we translate",
  pairs: [
    ["French", "/languages/french-translation-services/"],
    ["English", "/languages/english-translation-services/"],
    ["Italian", "/languages/italian-translation-services/"],
    ["Spanish", "/languages/spanish-translation-services/"],
    ["German", "/languages/german-translation-services/"],
    ["Korean", "/languages/korean-translation-services/"],
    ["Dutch", "/languages/dutch-translation-services/"],
    ["Portuguese", "/languages/portuguese-translation-services/"],
  ],
  pairsAllHref: "/languages/", pairsAll: "All languages",

  stepsTitle: "Get your free, no-obligation quote",
  formTitle: "Start your project today",
  formLead: "Tell us what you need translated and we will send you a free, no-obligation quote.",
  steps: [
    ["Tell us what you need", "Send your document or describe your project."],
    ["We reply fast", "A project manager gets back to you with a fixed price and deadline."],
    ["We translate", "A specialist native translator handles your project."],
    ["We deliver", "You receive the translated content by the agreed date."],
  ],

  teamEyebrow: "Our translators", teamTitle: "Experienced & professional translators",
  teamLead: "Select professional translators for quality and affordability, serving clients across the UK and all over Europe.",
  aboutHref: "/translators/", aboutCta: "Meet our translators",
};

export const HOME = { en, es: en, fr: en };
