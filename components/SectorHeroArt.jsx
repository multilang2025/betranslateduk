import { ICON } from "./industryIcons";

// Hero visual for the Expertise sub-pages: the sector icon on a large tile inside a dashed ring, with
// language flags floating round it. Pure SVG; shares the .pair-art sizing and float animations.
export default function SectorHeroArt({ icon = "documents" }) {
  return (
    <div className="pair-art sd-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="sd-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
          <clipPath id="sd-f1"><circle cx="110" cy="62" r="17" /></clipPath>
          <clipPath id="sd-f2"><circle cx="352" cy="78" r="17" /></clipPath>
          <clipPath id="sd-f3"><circle cx="338" cy="248" r="17" /></clipPath>
          <clipPath id="sd-f4"><circle cx="96" cy="240" r="17" /></clipPath>
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="150" cy="200" r="104" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="300" cy="120" r="110" fill="#F67618" opacity="0.1" />
        <circle cx="220" cy="155" r="112" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="3 8" strokeLinecap="round" />
        <g filter="url(#sd-shadow)" className="pair-art__doc--src">
          <rect x="150" y="85" width="140" height="140" rx="32" fill="#2F3143" />
          <g transform="translate(176 111) scale(3.2)" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={ICON[icon] || ICON.documents} /></g>
        </g>
        <g className="pair-art__chip--a" filter="url(#sd-shadow)"><circle cx="110" cy="62" r="21" fill="#fff" /><image href="/flags/gb.svg" x="93" y="45" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#sd-f1)" /></g>
        <g className="pair-art__chip--b" filter="url(#sd-shadow)"><circle cx="352" cy="78" r="21" fill="#fff" /><image href="/flags/fr.svg" x="335" y="61" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#sd-f2)" /></g>
        <g className="pair-art__chip--a" filter="url(#sd-shadow)"><circle cx="338" cy="248" r="21" fill="#fff" /><image href="/flags/de.svg" x="321" y="231" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#sd-f3)" /></g>
        <g className="pair-art__chip--b" filter="url(#sd-shadow)"><circle cx="96" cy="240" r="21" fill="#fff" /><image href="/flags/es.svg" x="79" y="223" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#sd-f4)" /></g>
      </svg>
    </div>
  );
}
