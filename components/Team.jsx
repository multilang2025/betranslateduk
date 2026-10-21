// Real UK team roster, scraped verbatim from scripts/btvibe-uk/output/pages/translators.json
// (no individual photos on the live site, unlike BTvibe-es's team page).
export const MEMBERS = [
  { name: "Tony", role: "Professional French to English translator" },
  { name: "Nancy", role: "French to English translator specialising in aeronautics" },
  { name: "Lola", role: "English to French copywriter and translator" },
  { name: "Kerry", role: "French to English translator in the IT field" },
  { name: "Frédéric", role: "English to French IT translator" },
  { name: "Paul", role: "Technical and scientific translator" },
];

export default function Team({ className = "" }) {
  return (
    <ul className={"team team--no-photo " + className}>
      {MEMBERS.map((m) => (
        <li key={m.name} className="team__card">
          <div className="team__meta">
            <strong>{m.name}</strong>
            <span>{m.role}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
