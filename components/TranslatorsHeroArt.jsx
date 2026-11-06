import { imgUrl } from "@/lib/site";

// Hero visual for /translators/: the team portraits in circles around a soft ring. Pure SVG, shares the
// .pair-art sizing and float animations (see .tr-art in app/translators-page.css for the height cap).
const SPOTS = [
  // [name, cx, cy, r, float class]
  ["Michael Bastin", 220, 150, 62, ""],
  ["Annalisa", 92, 96, 42, "pair-art__chip--a"],
  ["Elena", 352, 90, 44, "pair-art__chip--b"],
  ["Caridad", 84, 226, 38, "pair-art__chip--b"],
  ["Suzy Torosyan", 364, 222, 40, "pair-art__chip--a"],
];

export default function TranslatorsHeroArt({ people }) {
  const by = Object.fromEntries(people.map((p) => [p.name, p]));
  return (
    <div className="pair-art tr-art" aria-hidden="true">
      <svg viewBox="0 0 440 310" width="440" height="310" role="presentation">
        <defs>
          <filter id="tr-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
          {SPOTS.map(([n, cx, cy, r], i) => (
            <g key={n}><clipPath id={`tr-clip-${i}`}><circle cx={cx} cy={cy} r={r} /></clipPath>{[0, 1].map((k) => <clipPath key={k} id={`tr-fclip-${i}-${k}`}><circle cx={cx + r * 0.72 - k * 24} cy={cy + r * 0.72} r="11" /></clipPath>)}</g>
          ))}
        </defs>
        <circle className="pair-art__blob pair-art__blob--a" cx="150" cy="200" r="104" fill="#7EBEC5" opacity="0.2" />
        <circle className="pair-art__blob pair-art__blob--b" cx="320" cy="120" r="110" fill="#F67618" opacity="0.1" />
        <ellipse cx="220" cy="155" rx="176" ry="104" fill="none" stroke="#7EBEC5" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
        {SPOTS.map(([n, cx, cy, r, cls], i) => {
          const p = by[n];
          if (!p) return null;
          return (
            <g key={n} className={cls || undefined} filter="url(#tr-shadow)">
              <circle cx={cx} cy={cy} r={r + 4} fill="#fff" />
              <image href={imgUrl(p.photo)} x={cx - r} y={cy - r} width={r * 2} height={r * 2} preserveAspectRatio="xMidYMin slice" clipPath={`url(#tr-clip-${i})`} />
              <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#5FA9B1" strokeWidth="3" />
              {(p.languages || []).slice(0, 2).map((cc, k) => (
                <g key={cc}>
                  <circle cx={cx + r * 0.72 - k * 24} cy={cy + r * 0.72} r="13" fill="#fff" />
                  <image href={`/flags/${cc}.svg`} x={cx + r * 0.72 - k * 24 - 11} y={cy + r * 0.72 - 11} width="22" height="22" preserveAspectRatio="xMidYMid slice" clipPath={`url(#tr-fclip-${i}-${k})`} />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
