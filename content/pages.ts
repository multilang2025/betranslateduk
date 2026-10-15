import { CONTACT, INTERPRETING_QUOTE_URL, QUOTE_URL, live, main } from "@/lib/site";

/**
 * Copy for every inner page, adapted from the live betranslated.co.uk pages (15 Oct 2026).
 * Edit the words here. Each page is a hero followed by blocks; the template adds "What Happens Next?" and the CTA box.
 * Emphasis is **double asterisks**, links are [text](url). Pages in this copy use local paths.
 */

export type PageIcon =
  | "Globe" | "Landmark" | "Cpu" | "HardHat" | "Megaphone" | "Plane" | "Scale" | "Zap" | "Clock" | "ShieldCheck"
  | "Users" | "Building2" | "Languages" | "Map" | "FolderKanban" | "UserCheck" | "PackageCheck" | "Wallet"
  | "Radio" | "Video" | "Phone" | "Mic" | "HeartPulse" | "GraduationCap" | "Headphones"
  | "MapPin" | "Mail" | "FileText" | "Leaf" | "Handshake" | "Accessibility";

export type CardItem = { icon: PageIcon; title: string; text: string; href?: string; bullets?: string[] };

export type Block =
  | { type: "prose"; eyebrow: string; heading: string; paragraphs: string[] }
  | { type: "cards"; eyebrow: string; heading: string; intro?: string; columns?: 2 | 3; items: CardItem[] }
  | { type: "chips"; eyebrow: string; heading: string; intro?: string; items: { label: string; href: string }[] };

export type InnerPage = {
  path: string; // no leading or trailing slash, matches the live URL
  crumbs: { label: string; href?: string }[];
  meta: { title: string; description: string };
  hero: { eyebrow: string; before: string; mark: string; after: string; intro: string; button: { label: string; href: string } };
  blocks: Block[];
};

const quote = { label: "Get a free Quote", href: QUOTE_URL };
const home = { label: "Home", href: "/" };

export const pages: InnerPage[] = [
  {
    path: "translation-services",
    crumbs: [home, { label: "Translation Services" }],
    meta: {
      title: "Professional Translation Services | BeTranslated UK",
      description:
        "Professional translation services for websites, legal, business, technical and marketing documents. Free, no-obligation quote from a UK translation agency.",
    },
    hero: {
      eyebrow: "Translation Services",
      before: "Professional",
      mark: "Translation Services",
      after: "for UK Businesses",
      intro:
        "Website, document, legal, technical and marketing translation from skilled linguists covering a multitude of languages and specialisms. We are here to get your message across clearly and accurately.",
      button: quote,
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Our Services",
        heading: "Translation Services for Every Part of Your Business",
        intro:
          "Whether you need a single page, an extensive PDF user manual or a presentation for a conference, our specialist translators know how to meet your business needs. Our pledge is high quality translations, delivered promptly, at a price that fits your budget.",
        items: [
          { icon: "Globe", title: "Website Translation Services", text: "Translating your website is vital for entering new markets. We make your web content and blog articles resonate with native speakers, so they attract customers and convert leads.", href: live("/translation-services/website-translation/") },
          { icon: "Landmark", title: "Business and Finance Translation", text: "Tenders, proposals, contracts, reports, balance sheets, due diligence reports, annual statements of accounts and investor information.", href: live("/industry/business/") },
          { icon: "Cpu", title: "High Tech and IT Translation", text: "Software strings, help files, interfaces, user guides, data sheets, app translations and online games, by translators who specialise in IT.", href: live("/industry/it-telecom/") },
          { icon: "HardHat", title: "Industry and Construction Translation", text: "Environmental studies, civil engineering and planning documents, technical manuals, tenders, safety notes and training documents.", href: live("/industry/technical/") },
          { icon: "Megaphone", title: "Marketing and Sales Translation", text: "Presentations, press releases, catalogues, packaging and advertising material, adapted for linguistic subtleties and cultural nuance.", href: live("/industry/marketing/") },
          { icon: "Plane", title: "Travel and Tourism Translation", text: "Guidebooks, visitor guides, tourism websites, brochures, and museum and exhibition guides that give travellers a real feel for local culture.", href: live("/industry/tourism/") },
          { icon: "Scale", title: "Legal Translation Services", text: "Contracts, immigration documents, patents and trademarks, property and insurance documents, backed by a database of specialised terminology.", href: live("/industry/legal/") },
        ],
      },
      {
        type: "cards",
        eyebrow: "Why BeTranslated",
        heading: "Why Choose Our Translation Agency?",
        intro:
          "Our network of experienced freelance translators means UK customers get professional translation at very reasonable rates. One BeTranslated representative is your point of contact and oversees every aspect of your project.",
        columns: 2,
        items: [
          { icon: "Clock", title: "Flexibility", text: "We work with freelancers in the UK and many other countries, across time zones, so large documents can be translated by a team working effectively around the clock." },
          { icon: "Zap", title: "Responsiveness", text: "You get a quick response to every request and query, and our UK team starts on your project as soon as terms are agreed." },
          { icon: "ShieldCheck", title: "Professionalism", text: "Every translator and project manager we work with is a longtime professional with many years of experience and strong qualifications." },
          { icon: "Building2", title: "References", text: `Our clients past and present span many sectors, including large international companies. See [our customers](${live("/translation-agency/customers/")}) for more.` },
        ],
      },
    ],
  },

  {
    path: "languages",
    crumbs: [home, { label: "Languages" }],
    meta: {
      title: "Multilingual Translation Agency | All Languages Covered",
      description:
        "Multilingual translation agency covering all major European, Asian, Middle Eastern and Slavic languages. Projects of up to 25 languages. Free quote.",
    },
    hero: {
      eyebrow: "Languages",
      before: "A Multilingual Translation Agency for",
      mark: "Every Market",
      after: "You Sell To",
      intro:
        "Precise, culturally aware translation across a wide range of languages. Expert linguists manage every language pair, so your message lands properly with international audiences.",
      button: quote,
    },
    blocks: [
      {
        type: "chips",
        eyebrow: "Languages we cover",
        heading: "Translation Into and From All Major Languages",
        intro:
          "We focus on English, French, Dutch, Spanish, German, Italian, Portuguese, Norwegian, Swedish, Danish, Arabic and Russian, plus all Eastern European, Scandinavian and Asian languages.",
        items: [
          { label: "French", href: live("/languages/french-translation-services/") },
          { label: "English", href: live("/languages/english-translation-services/") },
          { label: "Italian", href: live("/languages/italian-translation-services/") },
          { label: "Spanish", href: live("/languages/spanish-translation-services/") },
          { label: "German", href: live("/languages/german-translation-services/") },
          { label: "Dutch", href: live("/languages/dutch-translation-services/") },
          { label: "Portuguese", href: live("/languages/portuguese-translation-services/") },
          { label: "Korean", href: live("/languages/korean-translation-services/") },
        ],
      },
      {
        type: "cards",
        eyebrow: "Multilingual projects",
        heading: "Large Multilingual Translation Projects, Handled End to End",
        columns: 2,
        items: [
          { icon: "Map", title: "European languages", text: "European at heart, we have years of experience translating documents, websites and marketing material for every major European market, from engineering to cinema and law to tourism." },
          { icon: "Languages", title: "Asian, Middle Eastern and Slavic", text: "Our qualified freelancers translate from and into Chinese, Korean, Japanese and other Asian languages, and into scripts such as Russian and Arabic." },
          { icon: "FolderKanban", title: "Projects in up to 25 languages", text: "Our dedicated project managers guide your project from start to finish, choose the right translators for each subject and language, and keep communication flowing. You send the documents, we take care of the rest." },
          { icon: "UserCheck", title: "Native language professionals", text: "We work across marketing, construction, agriculture, logistics and law. Every translator specialises in at least one sector and translates into their native language." },
        ],
      },
    ],
  },

  {
    path: "translation-agency",
    crumbs: [home, { label: "About" }],
    meta: {
      title: "About BeTranslated | Professional Translation Agency UK",
      description:
        "BeTranslated is a premium UK translation agency with over 20 years of experience, serving businesses large and small across Europe and beyond.",
    },
    hero: {
      eyebrow: "About BeTranslated",
      before: "A Translation Agency",
      mark: "With a Difference",
      after: "",
      intro:
        "With over 20 years of experience, we provide punctual, precise and dependable language solutions for document translation, website localisation and interpreting.",
      button: quote,
    },
    blocks: [
      {
        type: "prose",
        eyebrow: "About us",
        heading: "A Professional Translation Company for Businesses Large and Small",
        paragraphs: [
          "BeTranslated is a **premium translation agency** dedicated to meeting the language needs of businesses across Europe and beyond. Our extensive network of skilled translators is at your service.",
          "Being a **fully remote** translation firm lets us offer quality language services at **competitive, affordable prices**.",
        ],
      },
      {
        type: "cards",
        eyebrow: "How we work",
        heading: "People Who Understand the Translation Process",
        columns: 2,
        items: [
          { icon: "Users", title: "Highly experienced project managers", text: "Every project manager is a current or former translator, so they understand the challenges of translation first hand. Clients value their responsiveness and attention to detail." },
          { icon: "PackageCheck", title: "Express delivery of quality translations", text: "From your first request to the finished file, you get a fast, professional service. Projects go only to skilled translators with real experience in the field, and every translation is edited by a qualified third party." },
          { icon: "Handshake", title: "Satisfied customers", text: `Clients value our reactivity, meticulousness and attention to detail. See who we work with on [our customers page](${live("/translation-agency/customers/")}).` },
          { icon: "Wallet", title: "Fair, transparent pricing", text: `Low overheads mean competitive rates without compromising quality. [See our translation rates](${live("/translation-agency/rates/")}) or ask for a free quote.` },
        ],
      },
    ],
  },

  {
    path: "contact-us",
    crumbs: [home, { label: "Contact Us" }],
    meta: {
      title: "Contact BeTranslated | Free, No-Obligation Quote",
      description: "Contact BeTranslated for a free, no-obligation translation or interpreting quote. London office and a reply within a couple of hours.",
    },
    hero: {
      eyebrow: "Contact Us",
      before: "Let us Talk About",
      mark: "Your Project",
      after: "",
      intro: "Tell us what you need and we will come back within a couple of hours with a free, no-obligation quote.",
      button: quote,
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Get in touch",
        heading: "Contact BeTranslated for a Free, No-Obligation Quote",
        items: [
          { icon: "MapPin", title: "Visit or write to us", text: "International House, 24 Holborn Viaduct, London EC1A 2BN, UK", href: "https://www.google.com/maps/search/?api=1&query=International+House+24+Holborn+Viaduct+London+EC1A+2BN" },
          { icon: "Phone", title: "Call us", text: CONTACT.phone, href: CONTACT.phoneHref },
          { icon: "Mail", title: "Email us", text: CONTACT.email, href: CONTACT.emailHref },
          { icon: "FileText", title: "Request a translation quote", text: "Send your documents and get a free quote from one of our regional managers.", href: QUOTE_URL },
          { icon: "Mic", title: "Request an interpreting quote", text: "Tell us the date, languages and format of your meeting or event.", href: INTERPRETING_QUOTE_URL },
          { icon: "Globe", title: "Free multilingual SEO audit", text: "Find out how your website performs in every market you sell to.", href: main("/digital/free-seo-audit/") },
        ],
      },
    ],
  },

  {
    path: "translation-services/remote-interpreting",
    crumbs: [home, { label: "Translation Services", href: "/translation-services/" }, { label: "Remote Interpreting" }],
    meta: {
      title: "Remote Interpreting Services | Video and Simultaneous",
      description:
        "Professional remote interpreting by video, telephone and RSI on Zoom, Microsoft Teams and Google Meet. Specialised interpreters in rare languages.",
    },
    hero: {
      eyebrow: "Remote Interpreting",
      before: "Remote Interpreting Services for",
      mark: "Meetings and Virtual Events",
      after: "",
      intro: "Professional interpretation via Zoom, Microsoft Teams and Google Meet, by video, telephone or remote simultaneous interpreting.",
      button: { label: "Get a free interpreting Quote", href: INTERPRETING_QUOTE_URL },
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Key benefits",
        heading: "Why Choose Remote Interpreting?",
        items: [
          { icon: "Wallet", title: "Cost effective", text: "Remove travel, accommodation and scheduling delays while keeping professional quality." },
          { icon: "Languages", title: "Immediate access", text: "Reach specialised interpreters in rare languages that may not be available locally, through our global network." },
          { icon: "Headphones", title: "Flexible solutions", text: "Choose the format that fits the meeting.", bullets: ["Telephone interpreting for quick calls", "Video interpreting for meetings", "RSI (Remote Simultaneous Interpreting) for conferences"] },
          { icon: "Leaf", title: "Lower environmental impact", text: "Less travel means a smaller carbon footprint for your organisation." },
          { icon: "Accessibility", title: "Increased accessibility", text: "Participants join from anywhere, which supports global collaboration and inclusion." },
          { icon: "Clock", title: "Quick set-up", text: "Schedule multilingual events across time zones with very little lead time." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Where it is used",
        heading: "Where Can Remote Interpreting Be Used?",
        items: [
          { icon: "Radio", title: "Business meetings and conferences", text: "Virtual team meetings, international negotiations and global conferences, with consecutive or simultaneous interpreting." },
          { icon: "HeartPulse", title: "Healthcare", text: "Accurate communication between medical professionals and patients, including sign language interpreters, on secure platforms." },
          { icon: "Scale", title: "Legal proceedings", text: "Virtual hearings, depositions and legal consultations." },
          { icon: "GraduationCap", title: "Education and training", text: "Online courses, webinars and training programmes in several languages." },
          { icon: "Headphones", title: "Customer support", text: "Multilingual help through video or phone support channels." },
          { icon: "Landmark", title: "Government services", text: "Better access to essential services for diverse populations, including people who are hard of hearing." },
        ],
      },
      {
        type: "prose",
        eyebrow: "Technology",
        heading: "Reliable Technology Behind Every Remote Interpreting Session",
        paragraphs: [
          "Advanced RSI technology delivers clear, real-time interpretation that keeps your message accurate, whatever the distance. Separate audio channels for each language let several languages be delivered at the same time.",
          "Platforms such as Zoom and Microsoft Teams make reliable, high-quality interpreting possible. Our interpreters are certified and specialise in your industry, so the message arrives precise and culturally sensitive.",
        ],
      },
    ],
  },
];

export function findPage(slug: string[]): InnerPage | undefined {
  return pages.find((p) => p.path === slug.join("/"));
}
