export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 360 260" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EFF7F8" />
          <stop offset="1" stopColor="#CFE8EB" />
        </linearGradient>
        <radialGradient id="ha-globe" cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#A9D3D8" />
        </radialGradient>
        <clipPath id="ha-clip"><circle cx="180" cy="136" r="84" /></clipPath>
      </defs>
      <rect width="360" height="260" fill="url(#ha-bg)" />
      <circle cx="180" cy="136" r="84" fill="url(#ha-globe)" stroke="#2F3143" strokeWidth="5" />
      <g clipPath="url(#ha-clip)" fill="none" stroke="#5FA9B1" strokeWidth="2.5" strokeOpacity=".7">
        <g className="ha-spin">
          <ellipse cx="180" cy="136" rx="84" ry="30" />
          <ellipse cx="180" cy="136" rx="30" ry="84" />
          <ellipse cx="180" cy="136" rx="58" ry="84" />
          <path d="M96 136 H264" />
        </g>
        <path d="M110 100 Q180 82 250 100" strokeOpacity=".4" />
        <path d="M110 172 Q180 190 250 172" strokeOpacity=".4" />
      </g>
      <path className="ha-arc" d="M150 150 Q170 96 222 104" fill="none" stroke="#2F3143" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 9" />
      <path className="ha-arc" d="M222 104 Q236 128 204 168" fill="none" stroke="#2F3143" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 9" />
      <g fill="#5FA9B1" stroke="#fff" strokeWidth="3">
        <circle className="ha-pin" cx="150" cy="150" r="9" />
        <circle className="ha-pin ha-pin--b" cx="222" cy="104" r="9" />
        <circle className="ha-pin ha-pin--c" cx="204" cy="168" r="9" />
      </g>
      <g className="ha-bubble ha-bubble--a">
        <rect x="22" y="40" width="82" height="36" rx="18" fill="#fff" stroke="#5FA9B1" strokeWidth="2" />
        <text x="63" y="64" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="18" fill="#2F3143">Hola</text>
      </g>
      <g className="ha-bubble ha-bubble--b">
        <rect x="262" y="52" width="80" height="36" rx="18" fill="#fff" stroke="#5FA9B1" strokeWidth="2" />
        <text x="302" y="76" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="18" fill="#2F3143">Hello</text>
      </g>
      <g className="ha-bubble ha-bubble--c">
        <rect x="248" y="204" width="96" height="36" rx="18" fill="#fff" stroke="#5FA9B1" strokeWidth="2" />
        <text x="296" y="228" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="18" fill="#2F3143">Bonjour</text>
      </g>
    </svg>
  );
}
