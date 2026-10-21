// Bespoke 404, recycled from betranslated.com ("Lost in Translation"): a navy
// stage with "where?" drifting by in many languages, and a glass card with the
// way back. Teal glow on the number (orange stays for the CTA).
const COPY = {
  en: {
    eyebrow: "Lost in translation",
    title: ["This page got lost", "in translation"],
    lead: "We translate into a wide range of European and Asian languages every day. Somehow this URL is one we cannot decipher.",
    body: "It may have moved, been retired or arrived with a typo. Head back to the homepage, or pick a service below and we will get you sorted.",
    home: ["Take me home", "/"],
    services: ["Browse services", "/translation-services/"],
    try: "Try one of these instead",
    links: [
      ["Document translation", "/document-translation-services/"],
      ["Languages", "/languages/"],
      ["Get a quote", "/translation-agency/quote/"],
      ["Blog", "/blog/"],
    ],
  },
};

// [word, lang, left %, top %, size px, delay s, opacity]
const WORDS = [
  ["¿Dónde?", "es", 3, 70, 44, 0, 0.34], ["Où ?", "fr", 12, 64, 26, 2.5, 0.22], ["Wo?", "de", 9, 60, 22, 5, 0.2],
  ["Dove?", "it", 15, 62, 34, 1.2, 0.26], ["Onde?", "pt", 19, 58, 38, 3.4, 0.2], ["Hol?", "hu", 52, 2, 40, 0.6, 0.24],
  ["Kde?", "cs", 55, 9, 24, 4.2, 0.2], ["Waar?", "nl", 26, 34, 30, 2, 0.14], ["Gdzie?", "pl", 80, 14, 26, 6, 0.16],
  ["Verloren?", "de", 90, 40, 26, 1.6, 0.24], ["Perdu ?", "fr", 84, 70, 44, 3, 0.26], ["Lost?", "en", 78, 74, 26, 4.8, 0.24],
  ["أين؟", "ar", 70, 79, 30, 2.2, 0.2], ["איפה?", "he", 74, 76, 26, 5.6, 0.16], ["哪里？", "zh", 6, 18, 28, 3.8, 0.16],
  ["どこ？", "ja", 88, 88, 24, 0.9, 0.14], ["어디?", "ko", 30, 88, 24, 4.4, 0.14], ["Где?", "ru", 42, 92, 28, 2.8, 0.16],
];

export default function NotFoundView() {
  const c = COPY.en;
  return (
    <main className="nf">
      <div className="nf__words" aria-hidden="true">
        {WORDS.map(([w, lang, x, y, size, delay, op]) => (
          <span key={w + x} lang={lang} style={{ left: `${x}%`, top: `${y}%`, fontSize: size, animationDelay: `-${delay}s`, opacity: op }}>{w}</span>
        ))}
      </div>
      <section className="nf__card">
        <span className="nf__eyebrow">{c.eyebrow}</span>
        <p className="nf__code" aria-hidden="true">404</p>
        <h1 className="nf__title">{c.title[0]}<br />{c.title[1]}</h1>
        <p className="nf__lead">{c.lead}</p>
        <p className="nf__body">{c.body}</p>
        <div className="nf__actions">
          <a className="bt-btn bt-btn--primary bt-btn--lg" href={c.home[1]}>{c.home[0]}</a>
          <a className="nf__ghost" href={c.services[1]}>{c.services[0]}</a>
        </div>
        <nav className="nf__try" aria-label={c.try}>
          <span>{c.try}</span>
          <ul>
            {c.links.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </nav>
      </section>
    </main>
  );
}
