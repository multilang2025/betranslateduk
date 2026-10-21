export default function InterpretingArt() {
  return (
    <svg className="interp-art" viewBox="0 0 360 260" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ia-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF6FA" />
          <stop offset="1" stopColor="#CDE5EE" />
        </linearGradient>
      </defs>
      <rect width="360" height="260" fill="url(#ia-bg)" />
      <circle cx="180" cy="130" r="96" fill="none" stroke="#5BA5B9" strokeOpacity=".25" />
      <circle cx="180" cy="130" r="64" fill="none" stroke="#5BA5B9" strokeOpacity=".35" />
      <g className="ia-wave ia-wave--l" fill="none" stroke="#5BA5B9" strokeWidth="5" strokeLinecap="round">
        <path d="M118 104 Q104 130 118 156" />
        <path d="M96 90 Q74 130 96 170" strokeOpacity=".6" />
        <path d="M74 76 Q44 130 74 184" strokeOpacity=".3" />
      </g>
      <g className="ia-wave ia-wave--r" fill="none" stroke="#5BA5B9" strokeWidth="5" strokeLinecap="round">
        <path d="M242 104 Q256 130 242 156" />
        <path d="M264 90 Q286 130 264 170" strokeOpacity=".6" />
        <path d="M286 76 Q316 130 286 184" strokeOpacity=".3" />
      </g>
      <g fill="none" stroke="#2F3143" strokeWidth="9" strokeLinecap="round">
        <path d="M134 138 V122 a46 46 0 0 1 92 0 V138" />
        <path d="M200 176 Q200 192 176 192" strokeWidth="5" />
      </g>
      <rect x="124" y="114" width="20" height="46" rx="10" fill="#5BA5B9" />
      <rect x="216" y="114" width="20" height="46" rx="10" fill="#5BA5B9" />
      <circle cx="172" cy="192" r="7" fill="#2F3143" />
      <g className="ia-bubble ia-bubble--a">
        <rect x="26" y="22" width="64" height="34" rx="17" fill="#fff" stroke="#5BA5B9" strokeWidth="2" />
        <text x="58" y="45" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="16" fill="#2F3143">ES</text>
      </g>
      <g className="ia-bubble ia-bubble--b">
        <rect x="272" y="30" width="64" height="34" rx="17" fill="#fff" stroke="#5BA5B9" strokeWidth="2" />
        <text x="304" y="53" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="16" fill="#2F3143">EN</text>
      </g>
      <g className="ia-bubble ia-bubble--c">
        <rect x="150" y="212" width="64" height="34" rx="17" fill="#fff" stroke="#5BA5B9" strokeWidth="2" />
        <text x="182" y="235" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="16" fill="#2F3143">FR</text>
      </g>
    </svg>
  );
}
