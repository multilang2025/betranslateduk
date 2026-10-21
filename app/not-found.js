import NotFoundView from "@/components/NotFoundView";

export const metadata = { title: "Page not found | BeTranslated", robots: { index: false, follow: true } };

export default function NotFoundPage() {
  return <NotFoundView />;
}
