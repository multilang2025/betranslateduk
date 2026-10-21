// Trail derived from the URL path. Parent segments use a proper label;
// anything unlisted falls back to the prettified slug.
const SEG = {
  "translation-services": "Translation services",
  languages: "Languages",
  industry: "Expertise",
  "translation-agency": "About",
  locations: "Locations",
  england: "England",
  blog: "Blog",
  quote: "Quote",
  customers: "Customers",
  rates: "Rates",
  turnaround: "Turnaround",
  "contact-us": "Contact us",
  translators: "Translators",
  "terms-conditions": "Terms & conditions",
  "document-translation-services": "Document translation",
  "website-translation": "Website translation",
  "remote-interpreting": "Remote interpreting",
};

export function breadcrumbTrail(pathname = "/", current) {
  const segs = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }];
  let acc = "";
  segs.forEach((s, i) => {
    acc += `/${s}`;
    const last = i === segs.length - 1;
    crumbs.push({
      label: last && current ? current : SEG[s] || s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()),
      href: last ? null : `${acc}/`,
    });
  });
  return crumbs;
}

export default function Breadcrumbs({ pathname = "/", current }) {
  const crumbs = breadcrumbTrail(pathname, current);
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
