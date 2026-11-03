import DATA from "@/data/sector-cards.json";

// "Translation services for every sector" on /translation-services/: eight short cards, each with an icon
// and an orange link to the page that covers the sector in depth.

const ICONS = {
  doc: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4" />,
  web: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />,
  chart: <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" />,
  chip: <path d="M8 8h8v8H8zM10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />,
  hardhat: <path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 6v5M9 10V8M15 10V8" />,
  megaphone: <path d="M4 10v4h3l8 4V6L7 10H4zM18 9a4 4 0 0 1 0 6" />,
  plane: <path d="M10 14L3 11l1-2 8 1 5-5a2 2 0 0 1 3 3l-5 5 1 8-2 1-3-7z" />,
  scale: <path d="M12 4v16M6 20h12M5 8h14M5 8l-3 6a3 3 0 0 0 6 0L5 8zM19 8l-3 6a3 3 0 0 0 6 0l-3-6z" />,
};

export default function SectorCards() {
  const { eyebrow, heading, intro, cards } = DATA;
  return (
    <section className="sec sector-cards" aria-labelledby="sector-title">
      <div className="sec__in">
        <span className="sector-cards__eyebrow">{eyebrow}</span>
        <h2 id="sector-title">{heading}</h2>
        <p className="sector-cards__intro">{intro}</p>
        <ul className="sector-grid">
          {cards.map((c) => (
            <li key={c.href} className="sector">
              <span className="sector__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[c.icon]}</svg>
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <a className="sector__more" href={c.href}>{c.more} <span aria-hidden="true">→</span></a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
