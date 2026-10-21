import { t } from "../lib/i18n";

// Trail derived from the URL path. Parent segments use a proper label;
// anything unlisted falls back to the prettified slug.
const SEG = {
  "translation-services": "Services", languages: "Languages", "translation-agency": "About",
  industry: "Expertise", blog: "Blog", "document-translation-services": "Document translation",
  locations: "Locations", england: "England", posts: "Posts",
  "it-telecom": "High tech & IT", business: "Business & finance", legal: "Legal", marketing: "Marketing & sales",
  medical: "Medical", technical: "Industry & construction", tourism: "Tourism & travel",
};
// Crumbs for a path: [{ label, href }], the current page last (href null).
export function breadcrumbTrail(_locale, pathname = "/", current) {
  const ui = t("en");
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: ui.home, href: "/" }];
  let acc = "";
  parts.forEach((s, i) => {
    acc += `/${s}`;
    const last = i === parts.length - 1;
    crumbs.push({
      label: last && current ? current : SEG[s] || s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()),
      href: last ? null : `${acc}/`,
    });
  });
  return crumbs;
}

export default function Breadcrumbs({ pathname = "/", current }) {
  const crumbs = breadcrumbTrail(null, pathname, current);
  if (crumbs.length < 2) return null;
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={i}>
            {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
