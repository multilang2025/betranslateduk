import "./globals.css";

export const metadata = {
  title: "BeTranslated UK",
  description: "UK translation agency for business, legal, technical and marketing documents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
