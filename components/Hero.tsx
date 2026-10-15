import { hero } from "@/content/home";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container-bt grid-hero">
        <p className="eyebrow eyebrow-text">{hero.eyebrow}</p>

        <div className="title">
          <h1 id="hero-title">
            {hero.headingBefore} <span className="mark">{hero.headingMark}</span> {hero.headingAfter}
          </h1>
        </div>

        <div className="bubble-wrap">
          <div className="bubble">
            <div className="dots" aria-hidden="true" />
            <div className="outline" aria-hidden="true" />
            <div className="shape">
              <img src="/images/home/hero-office.jpg" alt="The BeTranslated team in a meeting" width={760} height={760} />
            </div>
            <svg className="squiggle" viewBox="0 0 76 54" fill="none" stroke="#7EBEC5" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M2 10c6-8 10 8 16 0s10 8 16 0 10 8 16 0 10 8 16 0" />
              <path d="M2 26c6-8 10 8 16 0s10 8 16 0 10 8 16 0 10 8 16 0" />
              <path d="M2 42c6-8 10 8 16 0s10 8 16 0 10 8 16 0 10 8 16 0" />
            </svg>
          </div>
        </div>

        <div className="lede">
          <p>{hero.intro}</p>
          <p className="since">{hero.since}</p>
          <p style={{ marginTop: 12 }}>
            <strong>{hero.closingStrong}</strong>
            {hero.closingRest}
          </p>
        </div>

        <div className="btn-area">
          <a className="btn-primary" href={hero.buttonHref}>
            {hero.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
