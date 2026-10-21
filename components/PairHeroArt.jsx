// Animated hero illustration for a language-pair page: a source document, a
// flowing arrow and the translated document. Pure SVG + CSS (see .pair-art in
// ui-pages.css); static for reduced-motion users.
export default function PairHeroArt({ art }) {
  if (!art) return null;
  const lines = [0, 1, 2, 3];
  return (
    <div className="pair-art" aria-hidden="true">
      <svg viewBox="0 0 440 340" width="440" height="340" role="presentation">
        <defs>
          <linearGradient id="pa-arrow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7EBEC5" />
            <stop offset="1" stopColor="#5FA9B1" />
          </linearGradient>
          <filter id="pa-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.10" />
          </filter>
        </defs>

        <circle className="pair-art__blob pair-art__blob--a" cx="120" cy="200" r="110" fill="#EFF7F8" />
        <circle className="pair-art__blob pair-art__blob--b" cx="320" cy="140" r="120" fill="#FEF3E9" />

        {/* Source document */}
        <g className="pair-art__doc pair-art__doc--src" filter="url(#pa-shadow)">
          <rect x="30" y="86" width="168" height="206" rx="16" fill="#fff" stroke="#ECEAE4" />
          <rect x="48" y="104" width="46" height="26" rx="8" fill="#EFF7F8" />
          <text x="71" y="122" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2F3143" fontFamily="Poppins, sans-serif">{art.src}</text>
          {lines.map((i) => (
            <rect key={i} className="pair-art__line" style={{ animationDelay: `${0.25 + i * 0.12}s` }} x="48" y={150 + i * 24} width={[130, 108, 122, 84][i]} height="9" rx="4.5" fill="#E5E7EB" />
          ))}
          <rect className="pair-art__line" style={{ animationDelay: "0.75s" }} x="48" y="250" width="60" height="9" rx="4.5" fill="#E5E7EB" />
        </g>

        {/* Flowing arrow */}
        <path className="pair-art__flow" d="M196 150 C 226 96, 250 96, 262 132" fill="none" stroke="url(#pa-arrow)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
        <path className="pair-art__head" d="M252 122 l11 12 l5 -16" fill="none" stroke="#5FA9B1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Translated document */}
        <g className="pair-art__doc pair-art__doc--tgt" filter="url(#pa-shadow)">
          <rect x="242" y="56" width="168" height="206" rx="16" fill="#fff" stroke="#ECEAE4" />
          <rect x="260" y="74" width="46" height="26" rx="8" fill="#2F3143" />
          <text x="283" y="92" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Poppins, sans-serif">{art.tgt}</text>
          {lines.map((i) => (
            <rect key={i} className="pair-art__line" style={{ animationDelay: `${1.0 + i * 0.12}s` }} x="260" y={120 + i * 24} width={[124, 112, 130, 78][i]} height="9" rx="4.5" fill={i === 0 ? "#5FA9B1" : "#CFD3DA"} />
          ))}
          <g className="pair-art__check">
            <circle cx="378" cy="232" r="17" fill="#1F8A5B" />
            <path d="M370 232 l6 6 l11 -12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Floating words */}
        <g className="pair-art__chip pair-art__chip--a">
          <rect x="18" y="44" width="78" height="32" rx="16" fill="#fff" stroke="#ECEAE4" />
          <text x="57" y="65" textAnchor="middle" fontSize="14" fontWeight="600" fill="#2F3143" fontFamily="Poppins, sans-serif">{art.from}</text>
        </g>
        <g className="pair-art__chip pair-art__chip--b">
          <rect x="330" y="276" width="84" height="32" rx="16" fill="#5FA9B1" />
          <text x="372" y="297" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff" fontFamily="Poppins, sans-serif">{art.to}</text>
        </g>
      </svg>
    </div>
  );
}
