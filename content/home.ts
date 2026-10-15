import { INTERPRETING_QUOTE_URL, QUOTE_URL, SEO_AUDIT_URL, live, main } from "@/lib/site";

/**
 * All homepage copy lives here, copied from the live WordPress page as it stood on 14 Oct 2026.
 * Edit the words here, not inside the components.
 * Emphasis words are wrapped in **double asterisks** and links are written as [text](url).
 */

export const meta = {
  title: "Translation Agency UK | Business and Technical Translation",
  description:
    "UK translation agency for business, legal, technical and marketing documents. Over 20 years of experience. Request a free, no-obligation quote.",
};

export const hero = {
  eyebrow: "Professional Language Services",
  headingBefore: "Your UK Translation Agency for",
  headingMark: "Business Growth",
  headingAfter: "Worldwide",
  intro:
    "BeTranslated is the translation company UK businesses, institutions and NGOs call when accuracy matters. We deliver corporate translation services, interpreting and multilingual SEO in a wide range of European and Asian languages.",
  since: "Since 2002",
  closingStrong: "Tell us what you need",
  closingRest: " and get your free quote today.",
  buttonLabel: "Get a free Quote",
  buttonHref: QUOTE_URL,
};

export type Client = { name: string; src: string; tone?: "navy" | "mono" };

/** Order matters. The marquee repeats this list twice for a seamless loop. */
export const clients: Client[] = [
  // White-only source files, shown navy so they read on the white strip
  { name: "Brandwatch", src: "/images/clients/brandwatch.png", tone: "navy" },
  { name: "UNESCO", src: "/images/clients/unesco.svg", tone: "navy" },
  { name: "Barbados", src: "/images/clients/barbados.svg", tone: "navy" },
  { name: "Kaspersky", src: "/images/clients/kaspersky.svg", tone: "mono" },
  { name: "Proxymity", src: "/images/clients/proxymity.svg", tone: "mono" },
  { name: "Save the Children", src: "/images/clients/save-the-children.svg", tone: "mono" },
  { name: "BIC", src: "/images/clients/bic.svg", tone: "mono" },
  // White-background JPGs from the customers page, shown at their original colours
  { name: "Aspen Aerogels", src: "/images/clients/aspen-aerogels.jpg" },
  { name: "AWEX", src: "/images/clients/awex.jpg" },
  { name: "Arrow", src: "/images/clients/arrow.jpg" },
  { name: "Computer Center", src: "/images/clients/computer-center.jpg" },
  { name: "Vinci", src: "/images/clients/vinci.jpg" },
  { name: "Wonderbox", src: "/images/clients/wonderbox.jpg" },
  { name: "Intersystem", src: "/images/clients/intersystem.jpg" },
  { name: "Noosphere", src: "/images/clients/noosphere.jpg" },
  { name: "Vanksen", src: "/images/clients/vanksen.jpg" },
  { name: "TMS", src: "/images/clients/tms.jpg" },
];

export const clientsTitle = "Trusted by Global Brands";

/** Names of lucide-react icons, mapped to components in components/Services.tsx. */
export type ServiceIcon =
  | "Scale" | "Gavel" | "Landmark" | "Globe" | "Languages" | "HardHat" | "Factory"
  | "Presentation" | "Video" | "ScanSearch" | "Megaphone" | "Palette";
export type ServiceItem = { icon: ServiceIcon; title: string; text: string; href: string };
export type ServiceCard = {
  theme: "translation" | "interpretation" | "digital";
  tag: string;
  heading: string;
  pitch: string;
  items: ServiceItem[];
  buttonLabel: string;
  buttonHref: string;
};

export const services = {
  eyebrow: "Our Services",
  heading: "Translation, Interpreting and Digital Marketing Services for UK Businesses Going Global",
  cards: [
    {
      theme: "translation",
      tag: "Translation",
      heading: "Legal, Business and Technical Translation Services",
      pitch:
        "Contracts, accounts and technical manuals have to be right first time. Our specialist translators have worked with UK businesses for over 20 years, and you get a free quote before you commit.",
      items: [
        { icon: "Scale", title: "Legal document translation services", text: "Contracts, patents and certified documents.", href: live("/industry/legal/") },
        { icon: "Landmark", title: "Business and financial translation", text: "Reports, accounts, tenders and corporate documents.", href: live("/industry/business/") },
        { icon: "Globe", title: "Website translation services", text: "Speak to every market in its own language.", href: live("/translation-services/website-translation/") },
        { icon: "HardHat", title: "Construction and engineering translation", text: "Manuals, specifications and tender documents.", href: live("/industry/technical/") },
      ],
      buttonLabel: "Get a free translation quote",
      buttonHref: QUOTE_URL,
    },
    {
      theme: "interpretation",
      tag: "Interpretation",
      heading: "Remote and On-Site Interpreting Services for Live Meetings",
      pitch:
        "When the conversation is live, there is no second chance to get it right. We provide professional interpreters on site, by video or by phone, for your meeting, hearing or event.",
      items: [
        { icon: "Gavel", title: "Legal interpreting services", text: "Client consultations, depositions and hearings.", href: main("/on-site-interpreting-services/consecutive/") },
        { icon: "Presentation", title: "Business and finance interpreting", text: "Board meetings, negotiations and conferences.", href: main("/on-site-interpreting-services/simultaneous/") },
        { icon: "Video", title: "Remote interpreting services", text: "Video calls, webinars and live-streamed events.", href: live("/translation-services/remote-interpreting/") },
        { icon: "Factory", title: "Site visit interpreting", text: "Inspections, factory tours and technical briefings.", href: main("/on-site-interpreting-services/liaison/") },
      ],
      buttonLabel: "Get a free interpreting quote",
      buttonHref: INTERPRETING_QUOTE_URL,
    },
    {
      theme: "digital",
      tag: "Digital marketing",
      heading: "Multilingual SEO, GEO and Digital Marketing for Global Growth",
      pitch:
        "Translation gets your message across. Digital marketing gets it found. We help you rank in Google and appear in AI search answers in every market you sell to, then turn that traffic into enquiries.",
      items: [
        { icon: "ScanSearch", title: "Multilingual SEO and GEO", text: "Rank in Google and be cited by AI search tools.", href: main("/digital/services/seo/") },
        { icon: "Languages", title: "Website language conversion", text: "Launch and maintain your site in new languages.", href: live("/translation-services/website-translation/") },
        { icon: "Megaphone", title: "International paid advertising", text: "Search and social ads built for each market.", href: main("/digital/services/paid-ads/") },
        { icon: "Palette", title: "Multilingual branding and design", text: "Names, messages and visuals that work abroad.", href: main("/digital/services/branding-design/") },
      ],
      buttonLabel: "Get a free SEO audit",
      buttonHref: SEO_AUDIT_URL,
    },
  ] satisfies ServiceCard[],
  more: {
    lead: "Also available:",
    links: [
      { text: "document translation services", href: live("/document-translation-services/") },
      { text: "IT and telecoms translation", href: live("/industry/it-telecom/") },
      { text: "marketing translation services", href: live("/industry/marketing/") },
      { text: "travel and tourism translation", href: live("/industry/tourism/") },
    ],
  },
};

export const about = {
  eyebrow: "About us",
  heading: "The UK Translation Agency That Takes Your Business Global",
  /** Paragraph syntax: **emphasis** and [link text](url) */
  paragraphs: [
    `BeTranslated is a **UK translation agency** run by experienced linguists. Our global network of translators and interpreters delivers **accurate, confidential work** on time, from [corporate translation services](${live("/translation-services/")}) to live meetings.`,
    `We work between English, French, German, Dutch, Spanish, Italian, Scandinavian and Asian languages, and across all Central and Eastern [European languages](${live("/languages/")}). Add **multilingual SEO** and digital marketing, and your message does not just reach a new market. It ranks, and it **converts**.`,
    `As a fully distributed agency, we keep overheads low and pass the saving on with **competitive rates**, without compromising on quality.`,
  ],
  foundedLabel: "Founded in",
  foundedYear: "2002",
  videoId: "O67In8Hkyxc",
  videoTitle: "Your Professional Translation Agency - BeTranslated",
  videoPoster: "/images/home/video-thumb.jpg",
};

export const whatNext = {
  eyebrow: "How it works",
  heading: "What Happens Next?",
  steps: [
    { title: "Request a Quote", text: "One of our regional managers will receive your request for a translation quote." },
    { title: "Reply", text: "A member of BeTranslated will respond to you within a couple of hours." },
    { title: "Assessing Your Project", text: "We match your project to the translator who best meets your needs according to the details of your request." },
    { title: "Delivery", text: "You will receive the translated files within the agreed-upon deadline." },
    { title: "Follow-up & Invoicing", text: "Once you are satisfied with your translation, we will send you your invoice." },
  ],
};

export const cta = {
  heading: "Get Your Free, No-Obligation Quote",
  text: "Tell us what you need and one of our managers will reply within a couple of hours.",
  buttonLabel: "Get a free quote",
};
