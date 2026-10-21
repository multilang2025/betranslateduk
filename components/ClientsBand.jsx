// Dark rounded band with orange stars, real page copy and (when provided)
// real client logos -- no invented logos.
export default function ClientsBand({ title, html, logos = [] }) {
  if (!title && !html) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="clients-band">
          <div className="clients-band__head">
            <h2>{title}</h2>
            <span className="clients-band__stars" role="img" aria-label="5 / 5">★★★★★</span>
          </div>
          <div className="clients-band__body">
            {html ? <div className="clients-band__copy" dangerouslySetInnerHTML={{ __html: html }} /> : null}
            {logos.length ? (
              <ul className="clients-band__logos">
                {logos.map((l) => (<li key={l.src}><img src={l.src} alt={l.alt || ""} loading="lazy" /></li>))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
