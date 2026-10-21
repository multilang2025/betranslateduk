const ICONS = [
  // 0 Comercial: briefcase
  <>
    <path className="si-lid" d="M17 15v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    <rect x="6" y="15" width="36" height="24" rx="4" />
    <path d="M6 26h36" />
    <rect className="si-ac" x="20" y="23" width="8" height="7" rx="2" />
  </>,
  // 1 Financiera: rising bars
  <>
    <path d="M6 41h36" />
    <rect className="si-ac si-bar si-bar--1" x="9" y="28" width="7" height="13" rx="2" />
    <rect className="si-ac si-bar si-bar--2" x="20.5" y="20" width="7" height="21" rx="2" />
    <rect className="si-ac si-bar si-bar--3" x="32" y="10" width="7" height="31" rx="2" />
  </>,
  // 2 Jurídica: scales
  <>
    <path d="M24 8v32M16 40h16" />
    <g className="si-beam">
      <path d="M9 14h30M9 14l-5 12M9 14l5 12M39 14l-5 12M39 14l5 12" />
      <path className="si-ac" d="M4 26q5 6 10 0zM34 26q5 6 10 0z" />
    </g>
  </>,
  // 3 Técnica e industrial: gear
  <g className="si-gear">
    <circle cx="24" cy="24" r="11" />
    <circle className="si-ac" cx="24" cy="24" r="4" />
    <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M37.4 10.6l-4.2 4.2M14.8 33.2l-4.2 4.2" />
  </g>,
  // 4 Tecnológica: chip
  <>
    <rect x="14" y="14" width="20" height="20" rx="4" />
    <rect className="si-ac si-core" x="20" y="20" width="8" height="8" rx="2" />
    <path className="si-pins" d="M20 8v6M28 8v6M20 34v6M28 34v6M8 20h6M8 28h6M34 20h6M34 28h6" />
  </>,
  // 5 Marketing: megaphone
  <>
    <path className="si-ac" d="M10 20h8l16-9v26l-16-9h-8z" />
    <path d="M14 29l2 9h5l-2-9" />
    <path className="si-wave si-wave--1" d="M38 19c2 3 2 7 0 10" />
    <path className="si-wave si-wave--2" d="M42 15c4 5 4 13 0 18" />
  </>,
  // 6 Turística: paper plane
  <g className="si-plane">
    <path d="M6 22L42 8 32 40 22 28z" />
    <path d="M22 28L42 8" />
    <path className="si-ac" d="M22 28l2 11 6-8z" />
  </g>,
  // 7 Científica: flask
  <>
    <path d="M19 8h10M21 8v12L10 38a3 3 0 0 0 2.6 4.5h22.8A3 3 0 0 0 38 38L27 20V8" />
    <path className="si-ac" d="M14 32h20l3 6a1.5 1.5 0 0 1-1.3 2.2H12.3A1.5 1.5 0 0 1 11 38z" />
    <circle className="si-bub si-bub--1" cx="22" cy="27" r="1.8" />
    <circle className="si-bub si-bub--2" cx="28" cy="25" r="1.4" />
  </>,
];

export default function SpecIcon({ index, fallback = null }) {
  if (index < 0) return fallback;
  return (
    <svg className="spec-icon" viewBox="0 0 48 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      {ICONS[index % ICONS.length]}
    </svg>
  );
}
