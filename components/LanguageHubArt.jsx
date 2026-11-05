// Hero visual for the languages hub (/traduccion/ and its EN/FR roots): a globe
// with orbiting greeting bubbles in different languages and a "50+" badge.
// Own artwork on purpose, so it never reads as the document-pair art used on
// the other pages. Motion reuses the .pair-art keyframes (static for reduced motion).
const BUBBLES = [
  { t: "Hola", x: 40, y: 70, w: 74, tone: "light", d: "-1s" },
  { t: "Hello", x: 292, y: 36, w: 86, tone: "navy", d: "-2.5s" },
  { t: "Bonjour", x: 330, y: 168, w: 98, tone: "teal", d: "-4s" },
  { t: "Hallo", x: 22, y: 214, w: 78, tone: "teal", d: "-3s" },
  { t: "Ciao", x: 136, y: 288, w: 70, tone: "light", d: "-5s" },
  { t: "你好", x: 262, y: 276, w: 66, tone: "navy", d: "-2s" },
];
const FILL = { light: ["#fff", "#2F3143", "#ECEAE4"], navy: ["#2F3143", "#fff", "#2F3143"], teal: ["#7EBEC5", "#0f2b33", "#7EBEC5"] };

export default function LanguageHubArt({ badge = "50+" }) {
  const meridians = [-52, -26, 0, 26, 52];
  return (
    <div className="pair-art lang-art" aria-hidden="true">
      <svg viewBox="0 0 440 340" width="440" height="340" role="presentation">
        <defs>
          <radialGradient id="la-globe" cx="38%" cy="32%" r="80%">
            <stop offset="0" stopColor="#9bd0d6" />
            <stop offset="0.6" stopColor="#5FA9B1" />
            <stop offset="1" stopColor="#2c6f78" />
          </radialGradient>
          <filter id="la-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>
        <ellipse className="pair-art__blob pair-art__blob--b" cx="220" cy="168" rx="170" ry="120" fill="#FEF3E9" />
        <circle cx="220" cy="168" r="140" fill="none" stroke="#7EBEC5" strokeOpacity="0.35" strokeDasharray="3 9" strokeWidth="2" />
        <g filter="url(#la-shadow)">
          <circle cx="220" cy="168" r="84" fill="url(#la-globe)" />
        </g>
        <g fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6">
          <ellipse cx="220" cy="168" rx="84" ry="30" />
          <ellipse cx="220" cy="168" rx="84" ry="62" strokeOpacity="0.3" />
          {meridians.map((o) => <ellipse key={o} cx="220" cy="168" rx={Math.abs(o) + 8} ry="84" strokeOpacity="0.4" />)}
        </g>
        <g className="pair-art__chip--a">
          <rect x="176" y="146" width="88" height="44" rx="22" fill="#F67618" />
          <text x="220" y="176" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="Poppins, sans-serif">{badge}</text>
        </g>
        {BUBBLES.map((b) => {
          const [bg, fg, stroke] = FILL[b.tone];
          return (
            <g key={b.t} className="pair-art__doc--src" style={{ animationDelay: b.d, animationDuration: "6s" }} filter="url(#la-shadow)">
              <rect x={b.x} y={b.y} width={b.w} height="34" rx="17" fill={bg} stroke={stroke} />
              <text x={b.x + b.w / 2} y={b.y + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill={fg} fontFamily="Poppins, sans-serif">{b.t}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
