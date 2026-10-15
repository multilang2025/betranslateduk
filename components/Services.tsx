import {
  Factory, Gavel, Globe, HardHat, Landmark, Languages, Megaphone, Palette, Presentation, Scale, ScanSearch, Video,
  type LucideIcon,
} from "lucide-react";
import { services, type ServiceIcon } from "@/content/home";

/** One consistent line-icon set. The tile colour comes from the card's theme (see .svc-card in globals.css). */
const ICONS: Record<ServiceIcon, LucideIcon> = {
  Scale, Gavel, Landmark, Globe, Languages, HardHat, Factory, Presentation, Video, ScanSearch, Megaphone, Palette,
};

export function Services() {
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="container-bt">
        <p className="eyebrow-text">{services.eyebrow}</p>
        <h2 id="services-title">{services.heading}</h2>

        <div className="svc-grid">
          {services.cards.map((card) => (
            <article className={`svc-card ${card.theme}`} key={card.theme}>
              <span className="svc-tag">{card.tag}</span>
              <h3>{card.heading}</h3>
              <p className="pitch">{card.pitch}</p>
              <ul>
                {card.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  return (
                    <li key={item.title}>
                      <span className="ic" aria-hidden="true">
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <a href={item.href}>{item.title}</a>
                      <span className="sub">{item.text}</span>
                    </li>
                  );
                })}
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
