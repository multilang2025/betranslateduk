// Hero visual for /translation-services/remote-interpreting/: a video call window with an interpreter bubble and language flags.
// Pure SVG, shares the .pair-art sizing and float animations (height cap: .ri-art in
// app/document-translation-page.css).
export default function RemoteHeroArt() {
  return (
    <div className="pair-art ri-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="ri-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
          <clipPath id="ri-f1"><circle cx="388" cy="92" r="17" /></clipPath>
          <clipPath id="ri-f2"><circle cx="402" cy="150" r="17" /></clipPath>
          <clipPath id="ri-f3"><circle cx="388" cy="208" r="17" /></clipPath>
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="140" cy="210" r="104" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="330" cy="110" r="110" fill="#F67618" opacity="0.1" />

        <g className="pair-art__doc--src" filter="url(#ri-shadow)">
          <rect x="52" y="52" width="240" height="200" rx="16" fill="#fff" stroke="#E4EEF0" />
          <path d="M52 68a16 16 0 0 1 16-16h208a16 16 0 0 1 16 16v20H52z" fill="#2F3143" />
          <circle cx="72" cy="70" r="5" fill="#F67618" />
          <circle cx="90" cy="70" r="5" fill="#7EBEC5" />
          <circle cx="108" cy="70" r="5" fill="#E4EEF0" />
          <rect x="68" y="104" width="100" height="76" rx="10" fill="#EFF7F8" />
          <circle cx="118" cy="132" r="14" fill="#7EBEC5" />
          <path d="M92 176c2-16 14-22 26-22s24 6 26 22z" fill="#7EBEC5" />
          <rect x="176" y="104" width="100" height="76" rx="10" fill="#FDEBDD" />
          <circle cx="226" cy="132" r="14" fill="#F67618" opacity="0.8" />
          <path d="M200 176c2-16 14-22 26-22s24 6 26 22z" fill="#F67618" opacity="0.8" />
          <path d="M210 126a16 16 0 0 1 32 0" fill="none" stroke="#2F3143" strokeWidth="3" strokeLinecap="round" />
          <rect x="206" y="124" width="6" height="12" rx="3" fill="#2F3143" />
          <rect x="240" y="124" width="6" height="12" rx="3" fill="#2F3143" />
          <rect x="68" y="196" width="208" height="8" rx="4" fill="#E5E7EB" />
          <circle cx="146" cy="228" r="11" fill="#F67618" />
          <circle cx="178" cy="228" r="11" fill="#2F3143" />
          <path d="M142 228h8M174 228h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g className="pair-art__chip--a" filter="url(#ri-shadow)">
          <rect x="22" y="22" width="62" height="34" rx="17" fill="#2F3143" />
          <text x="53" y="44" textAnchor="middle" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#fff">EN</text>
        </g>

        <path d="M294 150 C330 150 342 120 366 100 M294 150 L384 150 M294 150 C330 150 342 180 366 200" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />

        <g className="pair-art__chip--b" filter="url(#ri-shadow)">
          <circle cx="388" cy="92" r="21" fill="#fff" />
          <image href="/flags/fr.svg" x="371" y="75" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#ri-f1)" />
        </g>
        <g className="pair-art__chip--a" filter="url(#ri-shadow)">
          <circle cx="402" cy="150" r="21" fill="#fff" />
          <image href="/flags/de.svg" x="385" y="133" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#ri-f2)" />
        </g>
        <g className="pair-art__chip--b" filter="url(#ri-shadow)">
          <circle cx="388" cy="208" r="21" fill="#fff" />
          <image href="/flags/es.svg" x="371" y="191" width="34" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#ri-f3)" />
        </g>
      </svg>
    </div>
  );
}
