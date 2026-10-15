import { clients, clientsTitle } from "@/content/home";

/** White strip under the hero. The list is rendered twice so translateX(-50%) loops with no jump. Pauses on hover. */
export function ClientBand() {
  const loop = [...clients, ...clients];
  return (
    <section className="band" aria-label={clientsTitle}>
      <div className="container-bt">
        <p className="title">{clientsTitle}</p>
      </div>
      <div className="marquee">
        <div className="track">
          {loop.map((c, i) => (
            <div className="logo-slot" key={`${c.name}-${i}`} aria-hidden={i >= clients.length ? true : undefined}>
              <img
                src={c.src}
                alt={i >= clients.length ? "" : c.name}
                className={c.tone ?? "jpg"}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
