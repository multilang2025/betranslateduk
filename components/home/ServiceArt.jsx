import InterpretingArt from "./InterpretingArt";

const Bg = ({ id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#EEF6FA" />
        <stop offset="1" stopColor="#CDE5EE" />
      </linearGradient>
    </defs>
    <rect width="360" height="260" fill={`url(#${id})`} />
    <circle cx="300" cy="40" r="70" fill="none" stroke="#5BA5B9" strokeOpacity=".25" strokeWidth="2" />
    <circle cx="300" cy="40" r="44" fill="none" stroke="#5BA5B9" strokeOpacity=".35" strokeWidth="2" />
  </>
);

function TranslationArt() {
  return (
    <svg className="svc-art" viewBox="0 0 360 260" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <Bg id="sa-t" />
      <g className="sa-float">
        <rect x="58" y="48" width="108" height="140" rx="10" fill="#fff" stroke="#5BA5B9" strokeWidth="3" />
        <text x="112" y="92" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="34" fill="#2F3143">Aa</text>
        <g fill="#5BA5B9" fillOpacity=".55"><rect x="76" y="112" width="72" height="6" rx="3" /><rect x="76" y="128" width="58" height="6" rx="3" /><rect x="76" y="144" width="68" height="6" rx="3" /><rect x="76" y="160" width="40" height="6" rx="3" /></g>
      </g>
      <g className="sa-float sa-float--b">
        <rect x="196" y="72" width="108" height="140" rx="10" fill="#fff" stroke="#2F3143" strokeWidth="3" />
        <text x="250" y="116" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="34" fill="#5BA5B9">Ab</text>
        <g fill="#2F3143" fillOpacity=".25"><rect x="214" y="136" width="72" height="6" rx="3" /><rect x="214" y="152" width="58" height="6" rx="3" /><rect x="214" y="168" width="68" height="6" rx="3" /><rect x="214" y="184" width="40" height="6" rx="3" /></g>
      </g>
      <g className="sa-arrow" fill="none" stroke="#5BA5B9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M150 220 H210" /><path d="M196 206 L212 220 L196 234" />
      </g>
    </svg>
  );
}

function MarketingArt() {
  return (
    <svg className="svc-art" viewBox="0 0 360 260" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <Bg id="sa-m" />
      <g fill="#5BA5B9">
        <rect className="sa-bar sa-bar--1" x="64" y="150" width="38" height="70" rx="8" fillOpacity=".45" />
        <rect className="sa-bar sa-bar--2" x="116" y="120" width="38" height="100" rx="8" fillOpacity=".65" />
        <rect className="sa-bar sa-bar--3" x="168" y="90" width="38" height="130" rx="8" fillOpacity=".85" />
        <rect className="sa-bar sa-bar--4" x="220" y="56" width="38" height="164" rx="8" />
      </g>
      <path className="sa-trend" d="M70 128 L128 104 L186 76 L240 42" fill="none" stroke="#2F3143" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 10" />
      <g className="ia-bubble">
        <rect x="26" y="24" width="72" height="34" rx="17" fill="#fff" stroke="#5BA5B9" strokeWidth="2" />
        <path d="M44 41 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 z" fill="#5BA5B9" transform="translate(-3 -3) scale(.9)" />
        <text x="78" y="47" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="16" fill="#2F3143">IA</text>
      </g>
      <g className="sa-float sa-float--b">
        <circle cx="270" cy="168" r="32" fill="#fff" fillOpacity=".7" stroke="#2F3143" strokeWidth="8" />
        <path d="M293 191 L322 220" stroke="#2F3143" strokeWidth="10" strokeLinecap="round" />
        <path d="M256 168 h28 M270 154 v28" stroke="#5BA5B9" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function ServiceArt({ kind }) {
  if (kind === "interpreting") return <InterpretingArt />;
  if (kind === "marketing") return <MarketingArt />;
  return <TranslationArt />;
}
