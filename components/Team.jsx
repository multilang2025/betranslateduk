// Real UK team roster, scraped verbatim from scripts/btvibe-uk/output/pages/translators.json
// with the small portraits from the legacy site (already in public/images/wp-content/uploads).
export const MEMBERS = [
  { name: "Tony", photo: "/images/wp-content/uploads/2021/09/tony.jpg", role: "Professional French to English translator" },
  { name: "Nancy", photo: "/images/wp-content/uploads/2014/07/nancy-150x150.jpg", role: "French to English translator specialising in aeronautics" },
  { name: "Lola", photo: "/images/wp-content/uploads/2019/02/lola-french-marketing-translator-150x150.jpg", role: "English to French copywriter and translator" },
  { name: "Kerry", photo: "/images/wp-content/uploads/2019/07/kerry-traducteur-professionnel-fran%25C3%25A7ais-anglais-4.jpg", role: "French to English translator in the IT field" },
  { name: "Frédéric", photo: "/images/wp-content/uploads/2020/06/frederic-150x150.jpg", role: "English to French IT translator" },
  { name: "Paul", photo: "/images/wp-content/uploads/2017/11/paul-traducteur-technique.jpg", role: "Technical and scientific translator" },
];

export default function Team({ className = "" }) {
  return (
    <ul className={"team team--no-photo " + className}>
      {MEMBERS.map((m) => (
        <li key={m.name} className="team__card">
          <img className="team__face" src={m.photo} alt={m.name + ", " + m.role.toLowerCase()} width="150" height="150" loading="lazy" />
          <div className="team__meta">
            <strong>{m.name}</strong>
            <span>{m.role}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
