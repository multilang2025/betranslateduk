// Hero visual for /translation-services/website-translation/: a browser window with a page being
// translated, an English bubble on one side and French, German and Spanish flags on the other.
// Pure SVG, shares the .pair-art sizing and float animations (height cap: .wt-art in
// app/website-translation-page.css).
export default function WebsiteHeroArt() {
  return (
    <div className="pair-art wt-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="wt-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
          <clipPath id="wt-f1"><circle cx="388" cy="92" r="17" /></clipPath>
          <clipPath id="wt-f2"><circle cx="402" cy="150" r="17" /></clipPath>
          <clipPath id="wt-f3"><circle cx="388" cy="208" r="17" /></clipPath>
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="140" cy="210" r="104" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="330" cy="110" r="110" fill="#F67618" opacity="0.1" />

        <g filter="url(#wt-shadow)" className="pair-art__doc--src">
          <rect x="52" y="52" width="270" height="200" rx="16" fill="#fff" stroke="#E4EEF0" />
          <path d="M52 68a16 16 0 0 1 16-16h238a16 16 0 0 1 16 16v20H52z" fill="#2F3143" />
          <circle cx="72" cy="70" r="5" fill="#F67618" />
          <circle cx="90" cy="70" r="5" fill="#7EBEC5" />
          <circle cx="108" cy="70" r="5" fill="#E4EEF0" />
          <rect x="128" y="63" width="170" height="14" rx="7" fill="#fff" opacity="0.15" />
          <rect x="70" y="106" width="110" height="12" rx="6" fill="#2F3143" />
          <rect x="70" y="128" width="170" height="8" rx="4" fill="#E5E7EB" />
          <rect x="70" y="144" width="150" height="8" rx="4" fill="#E5E7EB" />
          <rect x="70" y="160" width="160" height="8" rx="4" fill="#E5E7EB" />
          <rect x="70" y="184" width="64" height="24" rx="12" fill="#F67618" />
          <rect x="226" y="106" width="78" height="66" rx="10" fill="#EFF7F8" />
          <circle cx="265" cy="136" r="16" fill="none" stroke="#2F7C86" strokeWidth="2.2" />
          <ellipse cx="265" cy="136" rx="6.5" ry="16" fill="none" stroke="#2F7C86" strokeWidth="2.2" />
          <path d="M249 136h32" stroke="#2F7C86" strokeWidth="2.2" />
          <rect x="226" y="184" width="78" height="40" rx="10" fill="#EFF7F8" />
        </g>

        <g className="pair-art__chip--a" filter="url(#wt-shadow)">
          <rect x="22" y="22" width="62" height="34" rx="17" fill="#2F3143" />
          <text x="53" y="44" textAnchor="middle" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#fff">EN</text>
        </g>

        <path d="M326 150 C346 150 352 120 366 100 M326 150 L384 150 M326 150 C346 150 352 180 366 200" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />

        <g className="pair-art__chip--b" filter="url(#wt-shadow)">
          <circle cx="388" cy="92" r="21" fill="#fff" />
          <image href="/flags/fr.svg" x="371" y="75" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#wt-f1)" />
        </g>
        <g className="pair-art__chip--a" filter="url(#wt-shadow)">
          <circle cx="402" cy="150" r="21" fill="#fff" />
          <image href="/flags/de.svg" x="385" y="133" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#wt-f2)" />
        </g>
        <g className="pair-art__chip--b" filter="url(#wt-shadow)">
          <circle cx="388" cy="208" r="21" fill="#fff" />
          <image href="/flags/es.svg" x="371" y="191" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#wt-f3)" />
        </g>
      </svg>
    </div>
  );
}
