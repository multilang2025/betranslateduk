// Blog hero illustration: a stack of article cards, a speech bubble with greetings in three
// languages and a bookmark. Pure SVG, static, in the brand teal, navy and orange.
export default function BlogHeroArt() {
  return (
    <div className="pair-art blog-art" aria-hidden="true">
      <svg viewBox="0 0 440 340" width="440" height="340" role="presentation">
        <defs>
          <filter id="ba-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>

        <circle cx="130" cy="210" r="112" fill="#7EBEC5" opacity="0.18" />
        <circle cx="330" cy="130" r="118" fill="#F67618" opacity="0.12" />

        {/* Back article card */}
        <g filter="url(#ba-shadow)" transform="rotate(-7 150 190)">
          <rect x="60" y="92" width="170" height="210" rx="16" fill="#fff" stroke="#ECEAE4" />
          <rect x="76" y="108" width="138" height="70" rx="10" fill="#EFF7F8" />
          <rect x="76" y="194" width="110" height="9" rx="4.5" fill="#E5E7EB" />
          <rect x="76" y="214" width="138" height="9" rx="4.5" fill="#E5E7EB" />
          <rect x="76" y="234" width="92" height="9" rx="4.5" fill="#E5E7EB" />
        </g>

        {/* Front article card */}
        <g filter="url(#ba-shadow)">
          <rect x="196" y="58" width="190" height="236" rx="18" fill="#fff" stroke="#ECEAE4" />
          <rect x="212" y="74" width="158" height="86" rx="12" fill="#2F3143" />
          <circle cx="258" cy="108" r="17" fill="none" stroke="#7EBEC5" strokeWidth="2.5" />
          <ellipse cx="258" cy="108" rx="7" ry="17" fill="none" stroke="#7EBEC5" strokeWidth="2.5" />
          <path d="M241 108h34" stroke="#7EBEC5" strokeWidth="2.5" />
          <rect x="288" y="98" width="62" height="8" rx="4" fill="#7EBEC5" />
          <rect x="288" y="114" width="42" height="8" rx="4" fill="#F67618" />
          <rect x="212" y="178" width="124" height="11" rx="5.5" fill="#2F3143" />
          <rect x="212" y="200" width="150" height="8" rx="4" fill="#E5E7EB" />
          <rect x="212" y="218" width="134" height="8" rx="4" fill="#E5E7EB" />
          <rect x="212" y="236" width="96" height="8" rx="4" fill="#E5E7EB" />
          <rect x="212" y="260" width="64" height="20" rx="10" fill="#EFF7F8" />
          <text x="244" y="274" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#2F7C86" fontFamily="Poppins, sans-serif">Read</text>
        </g>

        {/* Speech bubble */}
        <g filter="url(#ba-shadow)">
          <path d="M290 10h110a14 14 0 0 1 14 14v58a14 14 0 0 1-14 14h-58l-22 20v-20h-30a14 14 0 0 1-14-14V24a14 14 0 0 1 14-14z" fill="#F67618" />
          <text x="306" y="38" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">Hello · Hola</text>
          <text x="306" y="62" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">Ciao · Bonjour</text>
          <text x="306" y="86" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">Hallo · Olá</text>
        </g>

        {/* Bookmark */}
        <path d="M120 70h30v52l-15-11-15 11z" fill="#7EBEC5" />
      </svg>
    </div>
  );
}
