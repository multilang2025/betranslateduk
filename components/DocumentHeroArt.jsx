// Hero visual for /document-translation-services/: a stack of documents with an English page on the
// left and translated pages (French, German, Spanish flags) fanning out on the right.
// Pure SVG, shares the .pair-art sizing and float animations (height cap: .dt-art in
// app/document-translation-page.css).
export default function DocumentHeroArt() {
  return (
    <div className="pair-art dt-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="dt-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
          <clipPath id="dt-f1"><circle cx="388" cy="92" r="17" /></clipPath>
          <clipPath id="dt-f2"><circle cx="402" cy="150" r="17" /></clipPath>
          <clipPath id="dt-f3"><circle cx="388" cy="208" r="17" /></clipPath>
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="140" cy="210" r="104" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="330" cy="110" r="110" fill="#F67618" opacity="0.1" />

        <g className="pair-art__doc--src" filter="url(#dt-shadow)">
          <rect x="84" y="44" width="200" height="226" rx="14" fill="#EFF7F8" stroke="#E4EEF0" transform="rotate(-6 184 157)" />
          <rect x="68" y="50" width="214" height="226" rx="14" fill="#fff" stroke="#E4EEF0" />
          <rect x="68" y="50" width="214" height="40" rx="14" fill="#2F3143" />
          <rect x="68" y="76" width="214" height="14" fill="#2F3143" />
          <rect x="88" y="62" width="76" height="10" rx="5" fill="#fff" opacity="0.85" />
          <rect x="88" y="108" width="120" height="10" rx="5" fill="#2F3143" />
          <rect x="88" y="130" width="172" height="8" rx="4" fill="#E5E7EB" />
          <rect x="88" y="146" width="160" height="8" rx="4" fill="#E5E7EB" />
          <rect x="88" y="162" width="168" height="8" rx="4" fill="#E5E7EB" />
          <rect x="88" y="178" width="120" height="8" rx="4" fill="#E5E7EB" />
          <rect x="88" y="204" width="76" height="46" rx="8" fill="#EFF7F8" />
          <path d="M98 240l14-18 12 12 10-8 14 14z" fill="#7EBEC5" />
          <rect x="176" y="208" width="84" height="8" rx="4" fill="#E5E7EB" />
          <rect x="176" y="224" width="70" height="8" rx="4" fill="#E5E7EB" />
          <rect x="176" y="240" width="76" height="8" rx="4" fill="#F67618" opacity="0.85" />
        </g>

        <g className="pair-art__chip--a" filter="url(#dt-shadow)">
          <rect x="22" y="22" width="62" height="34" rx="17" fill="#2F3143" />
          <text x="53" y="44" textAnchor="middle" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#fff">EN</text>
        </g>

        <path d="M286 150 C326 150 340 120 366 100 M286 150 L384 150 M286 150 C326 150 340 180 366 200" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />

        <g className="pair-art__chip--b" filter="url(#dt-shadow)">
          <circle cx="388" cy="92" r="21" fill="#fff" />
          <image href="/flags/fr.svg" x="371" y="75" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#dt-f1)" />
        </g>
        <g className="pair-art__chip--a" filter="url(#dt-shadow)">
          <circle cx="402" cy="150" r="21" fill="#fff" />
          <image href="/flags/de.svg" x="385" y="133" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#dt-f2)" />
        </g>
        <g className="pair-art__chip--b" filter="url(#dt-shadow)">
          <circle cx="388" cy="208" r="21" fill="#fff" />
          <image href="/flags/es.svg" x="371" y="191" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#dt-f3)" />
        </g>
      </svg>
    </div>
  );
}
