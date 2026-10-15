import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { meta } from "@/content/home";

// Fonts are self-hosted (fonts/, SIL Open Font License) so builds and previews never depend on Google Fonts being reachable.
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const fraunces = localFont({
  src: [{ path: "../fonts/fraunces-latin-700-normal.woff2", weight: "700", style: "normal" }],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  // This is a working copy. Keep it out of search so it never competes with the live site.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#2F3143" };

/**
 * Runs before first paint so there is no flash. Dark is the default.
 * The choice is saved in localStorage under "bt-mode" ("light" or "dark").
 */
const themeScript = `(function(){try{var m=localStorage.getItem('bt-mode');document.documentElement.setAttribute('data-theme',m==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${poppins.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
