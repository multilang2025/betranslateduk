import { Poppins } from "next/font/google";
import "./design-system.css";
import "./globals.css";
import "./bt-chrome.css";
import "./content.css";
import "./ui-extras.css";
import "./ui-pages.css";
import "./ui-fx.css";
import "./ui-polish.css";
import "./ui-tools.css";
import "./ui-motion.css";
import "./home-refresh.css";
import "./share.css";
import "./ui-orphans.css";
// Dark theme (prefers-color-scheme): last, so its overrides win over every file above.
import "./dark.css";
import SiteHeader from "@/components/chrome/SiteHeader";
import SiteFooter from "@/components/chrome/SiteFooter";
import CookieConsent from "@/components/chrome/CookieConsent";
import AttributionCapture from "@/components/AttributionCapture";
import ToneSections, { TONE_SCRIPT } from "@/components/ToneSections";
import FloatingTools from "@/components/chrome/FloatingTools";
import ArrivalTrail from "@/components/chrome/ArrivalTrail";
import { THEME_SCRIPT } from "@/lib/themeScript";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

// Preview, local and any new host stay out of search results until the build sets SITE_ENV=production (same switch as app/robots.js).
const NOINDEX = process.env.SITE_ENV !== "production";

export const metadata = {
  ...(NOINDEX ? { robots: { index: false, follow: false } } : {}),
  title: "BeTranslated UK",
  description: "UK translation agency for business, legal, technical and marketing documents.",
};

// The site has its own dark theme (app/dark.css): declaring both schemes stops
// Chrome and Samsung Internet from force-darkening (inverting) the pages.
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1726" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bt">
        <AttributionCapture />
        <SiteHeader />
        {children}
        <SiteFooter />
        <ToneSections />
        <FloatingTools />
        <ArrivalTrail />
        <CookieConsent />
        <script dangerouslySetInnerHTML={{ __html: TONE_SCRIPT }} />
      </body>
    </html>
  );
}
