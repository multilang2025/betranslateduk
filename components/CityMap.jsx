// A small "nearby cities" diagram: the page's city as a highlighted node,
// connected to a few neighbouring cities already mentioned in its copy.
// Not a surveyed map — coordinates are hand-placed, relative positions only,
// on a shared grid (see ENGLAND_CITY_COORDS) so the cluster's layout still
// reflects real relative geography.
export const ENGLAND_CITY_COORDS = {
  newcastle: { x: 230, y: 40 },
  york: { x: 238, y: 92 },
  leeds: { x: 218, y: 108 },
  liverpool: { x: 150, y: 132 },
  manchester: { x: 190, y: 126 },
  sheffield: { x: 224, y: 140 },
  nottingham: { x: 244, y: 168 },
  leicester: { x: 244, y: 194 },
  birmingham: { x: 200, y: 206 },
  coventry: { x: 224, y: 210 },
  norwich: { x: 328, y: 196 },
  cambridge: { x: 298, y: 226 },
  oxford: { x: 236, y: 250 },
  reading: { x: 250, y: 270 },
  london: { x: 280, y: 270 },
  bristol: { x: 166, y: 270 },
  bournemouth: { x: 206, y: 324 },
  southampton: { x: 234, y: 310 },
  portsmouth: { x: 250, y: 320 },
  brighton: { x: 284, y: 320 },
  exeter: { x: 130, y: 320 },
  plymouth: { x: 110, y: 344 },
};

const PAD = 40;

export default function CityMap({ city, label, neighbours = [] }) {
  const centre = ENGLAND_CITY_COORDS[city];
  if (!centre) return null;
  const points = neighbours
    .map((n) => ({ ...n, ...ENGLAND_CITY_COORDS[n.key] }))
    .filter((n) => n.x != null);

  const xs = [centre.x, ...points.map((p) => p.x)];
  const ys = [centre.y, ...points.map((p) => p.y)];
  const minX = Math.min(...xs) - PAD, maxX = Math.max(...xs) + PAD;
  const minY = Math.min(...ys) - PAD, maxY = Math.max(...ys) + PAD;
  const width = maxX - minX;
  // Font sizes are a fraction of the viewBox width so text reads the same
  // size on screen no matter how tight or wide a city's neighbour cluster is
  // (SVG text set via CSS px would scale with the viewBox instead).
  const nodeFont = width * 0.048;
  const labelFont = width * 0.058;

  return (
    <figure className="city-map">
      <svg viewBox={`${minX} ${minY} ${width} ${maxY - minY}`} role="img" aria-label={`${label} and nearby cities`}>
        {points.map((p) => (
          <line key={`l-${p.key}`} x1={centre.x} y1={centre.y} x2={p.x} y2={p.y} className="city-map__line" />
        ))}
        {points.map((p) => (
          <g key={`n-${p.key}`}>
            <circle cx={p.x} cy={p.y} r={width * 0.02} className="city-map__node" />
            <text x={p.x} y={p.y - width * 0.045} fontSize={nodeFont} className="city-map__node-label" textAnchor="middle">{p.label}</text>
          </g>
        ))}
        <circle cx={centre.x} cy={centre.y} r={width * 0.06} className="city-map__ring" />
        <circle cx={centre.x} cy={centre.y} r={width * 0.028} className="city-map__dot" />
        <text x={centre.x} y={centre.y - width * 0.09} fontSize={labelFont} className="city-map__label" textAnchor="middle">{label}</text>
      </svg>
    </figure>
  );
}
