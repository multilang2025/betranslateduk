import { ICON, HERO_ORDER } from "./industryIcons";

// Hero visual for /industry/: a globe at the centre with the seven sector icons orbiting it. Pure SVG,
// shares the .pair-art sizing and float animations (height cap: .ind-art in app/industry-page.css).
const CX = 220;
const CY = 155;
const RX = 168;
const RY = 106;

export default function IndustryHeroArt() {
  return (
    <div className="pair-art ind-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="ind-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="150" cy="205" r="100" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="320" cy="115" r="108" fill="#F67618" opacity="0.1" />
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#7EBEC5" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
        <g filter="url(#ind-shadow)">
          <circle cx={CX} cy={CY} r="58" fill="#2F3143" />
          <circle cx={CX} cy={CY} r="58" fill="none" stroke="#7EBEC5" strokeWidth="3" />
          <g transform={`translate(${CX - 30} ${CY - 30}) scale(2.5)`} fill="none" stroke="#7EBEC5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON.website} />
          </g>
        </g>
        {HERO_ORDER.map((k, i) => {
          const a = (-90 + i * (360 / HERO_ORDER.length)) * (Math.PI / 180);
          const x = CX + RX * Math.cos(a);
          const y = CY + RY * Math.sin(a);
          return (
            <g key={k} className={i % 2 ? "pair-art__chip--a" : "pair-art__chip--b"} filter="url(#ind-shadow)">
              <circle cx={x} cy={y} r="29" fill="#fff" stroke="#E4EEF0" />
              <g transform={`translate(${x - 14} ${y - 14}) scale(1.17)`} fill="none" stroke="#2F7C86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICON[k]} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
