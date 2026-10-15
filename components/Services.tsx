import { services } from "@/content/home";

export function Services() {
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="container-bt">
        <p className="eyebrow-text eyebrow-center">{services.eyebrow}</p>
        <h2 id="services-title">{services.heading}</h2>

        <div className="svc-grid">
          {services.cards.map((card) => (
            <article className={`svc-card ${card.theme}`} key={card.theme}>
              <span className="svc-tag">{card.tag}</span>
              <h3>{card.heading}</h3>
              <p className="pitch">{card.pitch}</p>
              <ul>
                {card.items.map((item) => (
                  <li key={item.title}>
                    <img src={`/images/icons/${item.icon}.svg`} alt="" width={44} height={44} />
                    <a href={item.href}>{item.title}</a>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <a className="svc-btn" href={card.buttonHref}>
                {card.buttonLabel}
              </a>
            </article>
          ))}
        </div>

        <p className="svc-more">
          {services.more.lead}{" "}
          {services.more.links.map((l, i, all) => (
            <span key={l.href}>
              <a href={l.href}>{l.text}</a>
              {i < all.length - 2 ? ", " : i === all.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
