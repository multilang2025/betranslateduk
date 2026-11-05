import SHOWCASE from "@/data/services-showcase.json";
import { imgUrl } from "@/lib/site";

// "Our translation services" on /translation-services/: a featured England card (with every city we cover,
// linked), then three service cards that each carry a photo. Layout is 1 wide card + 3 equal cards, so no
// card is ever left alone on a row. Photo credits sit under the section.

const ICONS = {
  stamp: <path d="M9 3h6l1 6H8l1-6zM6 13h12v4H6zM5 21h14M12 9v4" />,
  headset: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1v-4zm16 0h-3v5h2a1 1 0 0 0 1-1v-4zM17 19c0 1.4-2 2-5 2" />,
  globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />,
  pin: <path d="M12 21s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const credit = (img) => (
  <>
    <a href={img.pageUrl} target="_blank" rel="noopener">{img.author}</a>
    {" ("}
    {img.licenceUrl ? <a href={img.licenceUrl} target="_blank" rel="noopener">{img.licence}</a> : img.licence}
    {")"}
  </>
);

export default function ServicesShowcase() {
  const { eyebrow, heading, intro, featured: f, cards } = SHOWCASE;
  const all = [f.image, ...cards.map((c) => c.image)];
  return (
    <section className="section section--tint svc-show" aria-labelledby="svc-show-title">
      <div className="container">
        <div className="svc-show__head">
          <span className="svc-show__eyebrow">{eyebrow}</span>
          <h2 id="svc-show-title">{heading}</h2>
          <p>{intro}</p>
        </div>

        <div className="svc-cards">
          {cards.map((c) => (
            <a key={c.href} href={c.href} className="svc-card">
              <span className="svc-card__media">
                <span className="svc-card__photo" style={c.image.bg ? { background: c.image.bg } : undefined}><img style={c.image.fit ? { objectFit: c.image.fit } : undefined} src={imgUrl(c.image.file)} width={c.image.width} height={c.image.height} alt={c.image.alt} loading="lazy" decoding="async" /></span>
                <span className="svc-card__icon"><Icon name={c.icon} /></span>
              </span>
              <span className="svc-card__body">
                <span className="svc-card__tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="svc-card__more">{c.button} <span aria-hidden="true">→</span></span>
              </span>
            </a>
          ))}
        </div>

        <article className="svc-feature">
          <div className="svc-feature__body">
            <span className="svc-feature__badge"><Icon name="pin" /> {f.eyebrow}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <ul className="svc-cities" aria-label="Cities in England we serve">
              {f.cities.map(([name, slug]) => (
                <li key={slug}><a href={`/translation-services/england/${slug}/`}>{name}</a></li>
              ))}
            </ul>
            <p className="svc-others">
              <strong>{f.otherLabel}:</strong>{" "}
              {f.others.map(([name, slug], i) => (
                <span key={slug}>
                  <a href={`/translation-agency/locations/${slug}/`}>{name}</a>
                  {i < f.others.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
            <div className="svc-feature__cta">
              <a className="bt-btn bt-btn--primary" href={f.href}>{f.button}</a>
              <a className="bt-btn bt-btn--ghost" href={f.secondaryHref}>{f.secondaryLabel}</a>
            </div>
          </div>
          <div className="svc-feature__media">
            <img src={imgUrl(f.image.file)} width={f.image.width} height={f.image.height} alt={f.image.alt} loading="lazy" decoding="async" />
          </div>
        </article>

        <p className="svc-credits">
          Photos via Wikimedia Commons:{" "}
          {all.map((img, i) => (
            <span key={img.file}>{credit(img)}{i < all.length - 1 ? "; " : "."}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
