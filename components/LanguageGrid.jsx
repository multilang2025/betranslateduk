import { HOME } from "@/components/home/copy";

// /languages/: one card per language we cover, with the flags of places where it is spoken (never a single
// "owner" country), then the other languages as chips. The language list and flags come from the home page
// copy (components/home/copy.js), so the two pages never disagree.
const NOTES = {
  English: "Proofreading and translation into English",
};
const OTHERS = [
  "Swedish", "Norwegian", "Danish", "Russian", "Arabic", "Chinese", "Japanese", "Polish", "Greek", "Turkish",
  "Czech", "Romanian", "Hungarian", "Bulgarian", "Ukrainian", "Finnish",
];

export default function LanguageGrid() {
  const c = HOME.en;
  return (
    <section className="section section--tint lang-hub">
      <div className="container">
        <div className="section-head">
          <h2>Languages we translate</h2>
          <p>Pick a language to see who translates it, which fields we cover and how to start.</p>
        </div>
        <ul className="lang-hub__grid">
          {c.pairs.map(([label, href, flags]) => (
            <li key={href}>
              <a href={href} className="lang-hub__card">
                <span className="lang-hub__flags" aria-hidden="true">
                  {flags.map(([code]) => (
                    <img key={code} src={`/flags/${code}.svg`} alt="" width="44" height="44" loading="lazy" />
                  ))}
                </span>
                <span className="lang-hub__name">{label}</span>
                <span className="lang-hub__note">{NOTES[label] || `${label} to English and English to ${label}`}</span>
                <span className="lang-hub__more">Read more <span aria-hidden="true">→</span></span>
              </a>
            </li>
          ))}
        </ul>
        <div className="lang-hub__others">
          <h3>And many more</h3>
          <p>We also translate into and from other European, Scandinavian, Middle Eastern and Asian languages.</p>
          <ul className="lang-hub__chips">
            {OTHERS.map((l) => (<li key={l}>{l}</li>))}
          </ul>
          <p className="lang-hub__ask">Not on the list? <a href="/translation-agency/quote/">Ask for a quote</a> and tell us your language.</p>
        </div>
      </div>
    </section>
  );
}
