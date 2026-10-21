import PairHeroArt from "./PairHeroArt";

// House hero: text column with breadcrumb, kicker, H1, tagline, text and
// CTAs, and an animated visual on the right. Pages pass their own text as
// children and may pass a bespoke visual; the default is the document ->
// translation animation.
export const KICKER = "Translation agency in the UK";
export const DEFAULT_ART = { src: "EN", tgt: "FR", from: "Hello", to: "Bonjour" };

export function kickerText() {
  return KICKER;
}

export function Kicker({ children }) {
  return <span className="ip-kicker">{children || KICKER}</span>;
}

export default function StdHero({ art, children }) {
  return (
    <section className="page-hero page-hero--split">
      <div className="container container--narrow">
        <div className="page-hero__text">{children}</div>
        {art || <PairHeroArt art={DEFAULT_ART} />}
      </div>
    </section>
  );
}
