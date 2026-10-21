import { GBP_URL, RATING } from "../../lib/business";

// Google Business Profile proof in the home hero: the real rating and review
// count (lib/business.js), linking to the profile. Initials are from real
// reviews shown in the reviews carousel.
const L = {
  es: { reviews: "reseñas en Google", see: "Ver opiniones", label: "Valoración en Google" },
  en: { reviews: "Google reviews", see: "Read the reviews", label: "Google rating" },
  fr: { reviews: "avis Google", see: "Lire les avis", label: "Note Google" },
};
const INITIALS = [["MC", "#5FA9B1"], ["IP", "#2F3143"], ["DL", "#F67618"]];

export default function GbpBadge({ locale = "es" }) {
  const l = L[locale] || L.es;
  const value = locale === "en" ? RATING.value.toFixed(1) : RATING.value.toFixed(1).replace(".", ",");
  return (
    <a className="gbp-badge" href={GBP_URL} target="_blank" rel="noopener noreferrer" aria-label={`${l.label}: ${value} / 5 · ${RATING.count} ${l.reviews}`}>
      <svg className="gbp-badge__g" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
      </svg>
      <span className="gbp-badge__score" aria-hidden="true">{value}</span>
      <span className="gbp-badge__body" aria-hidden="true">
        <span className="gbp-badge__stars">★★★★★</span>
        <span className="gbp-badge__count">{RATING.count} {l.reviews}</span>
      </span>
      <span className="gbp-badge__faces" aria-hidden="true">
        {INITIALS.map(([t, bg]) => <span key={t} style={{ background: bg }}>{t}</span>)}
      </span>
      <span className="gbp-badge__see" aria-hidden="true">{l.see} <span>→</span></span>
    </a>
  );
}
