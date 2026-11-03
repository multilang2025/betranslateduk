// Hero illustration for /translation-services/: a globe ringed by language bubbles and the four things
// people ask us for most (documents, websites, interpreting, legal). Pure SVG. It shares the .pair-art
// sizing and float animations, and the CSS caps its height so the hero keeps the standard size.
export default function ServicesHeroArt() {
  return (
    <div className="pair-art services-art" aria-hidden="true">
      <svg viewBox="0 0 440 340" width="440" height="340" role="presentation">
        <defs>
          <filter id="sa-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
          <linearGradient id="sa-orbit" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7EBEC5" />
            <stop offset="1" stopColor="#F67618" />
          </linearGradient>
        </defs>

        <circle className="pair-art__blob pair-art__blob--a" cx="130" cy="210" r="112" fill="#EFF7F8" />
        <circle className="pair-art__blob pair-art__blob--b" cx="330" cy="130" r="118" fill="#FEF3E9" />

        {/* Orbit and connectors */}
        <ellipse cx="220" cy="170" rx="168" ry="64" transform="rotate(-16 220 170)" fill="none" stroke="url(#sa-orbit)" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
        <path d="M104 96 C150 112 170 128 192 146" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M338 92 C300 108 276 128 252 146" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M110 262 C150 244 172 214 194 196" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M332 268 C296 248 272 218 248 196" fill="none" stroke="#7EBEC5" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />

        {/* Globe */}
        <g filter="url(#sa-shadow)">
          <circle cx="220" cy="170" r="66" fill="#fff" stroke="#2F7C86" strokeWidth="3" />
          <ellipse cx="220" cy="170" rx="28" ry="66" fill="none" stroke="#7EBEC5" strokeWidth="2.2" />
          <path d="M154 170 H286 M164 138 C196 150 244 150 276 138 M164 202 C196 190 244 190 276 202" fill="none" stroke="#7EBEC5" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="220" cy="170" r="66" fill="none" stroke="#2F7C86" strokeWidth="3" />
        </g>

        {/* Service chips */}
        <g className="pair-art__chip--a" filter="url(#sa-shadow)">
          <rect x="22" y="66" width="124" height="42" rx="21" fill="#fff" stroke="#E4EEF0" />
          <rect x="38" y="76" width="16" height="22" rx="3" fill="none" stroke="#2F7C86" strokeWidth="2" />
          <path d="M42 84 H50 M42 89 H50 M42 94 H47" stroke="#2F7C86" strokeWidth="1.6" strokeLinecap="round" />
          <text x="62" y="92" fontSize="13.5" fontWeight="700" fill="#2F3143" fontFamily="Poppins, sans-serif">Documents</text>
        </g>
        <g className="pair-art__chip--b" filter="url(#sa-shadow)">
          <rect x="298" y="52" width="122" height="42" rx="21" fill="#fff" stroke="#E4EEF0" />
          <rect x="314" y="63" width="22" height="19" rx="3" fill="none" stroke="#F67618" strokeWidth="2" />
          <path d="M314 69 H336" stroke="#F67618" strokeWidth="2" />
          <circle cx="319" cy="66" r="1.2" fill="#F67618" />
          <text x="344" y="78" fontSize="13.5" fontWeight="700" fill="#2F3143" fontFamily="Poppins, sans-serif">Websites</text>
        </g>
        <g className="pair-art__chip--b" filter="url(#sa-shadow)">
          <rect x="18" y="246" width="134" height="42" rx="21" fill="#fff" stroke="#E4EEF0" />
          <rect x="39" y="255" width="8" height="15" rx="4" fill="none" stroke="#2F7C86" strokeWidth="2" />
          <path d="M35 266 C35 274 51 274 51 266 M43 274 V279" fill="none" stroke="#2F7C86" strokeWidth="2" strokeLinecap="round" />
          <text x="60" y="272" fontSize="13.5" fontWeight="700" fill="#2F3143" fontFamily="Poppins, sans-serif">Interpreting</text>
        </g>
        <g className="pair-art__chip--a" filter="url(#sa-shadow)">
          <rect x="304" y="256" width="114" height="42" rx="21" fill="#fff" stroke="#E4EEF0" />
          <path d="M327 262 V282 M319 266 H335 M319 266 L316 274 H322 Z M335 266 L332 274 H338 Z M322 282 H332" fill="none" stroke="#F67618" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="346" y="282" fontSize="13.5" fontWeight="700" fill="#2F3143" fontFamily="Poppins, sans-serif">Legal</text>
        </g>

        {/* Language bubbles */}
        <g className="pair-art__chip--a">
          <path d="M184 60 h54 a10 10 0 0 1 10 10 v14 a10 10 0 0 1-10 10 h-30 l-12 10 v-10 h-12 a10 10 0 0 1-10-10 V70 a10 10 0 0 1 10-10z" fill="#F67618" />
          <text x="199" y="83" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">Hello</text>
        </g>
        <g className="pair-art__chip--b">
          <path d="M262 108 h44 a9 9 0 0 1 9 9 v12 a9 9 0 0 1-9 9 h-26 l-10 9 v-9 h-8 a9 9 0 0 1-9-9 v-12 a9 9 0 0 1 9-9z" fill="#2F3143" stroke="#7EBEC5" strokeWidth="1.6" />
          <text x="272" y="129" fontSize="12.5" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">Hola</text>
        </g>
        <g className="pair-art__chip--a">
          <path d="M112 142 h58 a9 9 0 0 1 9 9 v12 a9 9 0 0 1-9 9 h-34 l-10 9 v-9 h-14 a9 9 0 0 1-9-9 v-12 a9 9 0 0 1 9-9z" fill="#7EBEC5" />
          <text x="124" y="163" fontSize="12.5" fontWeight="700" fill="#1F3A40" fontFamily="Poppins, sans-serif">Bonjour</text>
        </g>
        <g className="pair-art__chip--b">
          <path d="M268 206 h50 a9 9 0 0 1 9 9 v12 a9 9 0 0 1-9 9 h-26 l-10 9 v-9 h-14 a9 9 0 0 1-9-9 v-12 a9 9 0 0 1 9-9z" fill="#fff" stroke="#BFDDE1" strokeWidth="2" />
          <text x="281" y="227" fontSize="12.5" fontWeight="700" fill="#2F7C86" fontFamily="Poppins, sans-serif">Hallo</text>
        </g>
      </svg>
    </div>
  );
}
