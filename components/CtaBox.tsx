import { cta } from "@/content/home";
import { QUOTE_URL } from "@/lib/site";

/** Navy grey section holding the teal ombre box. Navy in both themes. */
export function CtaBox() {
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container-bt">
        <div className="cta-box">
          <div className="cta-person">
            <img src={cta.person.image} alt={cta.person.name} width={84} height={84} />
            <span>
              {cta.person.name}, {cta.person.role}
            </span>
          </div>
          <h2 id="cta-title">{cta.heading}</h2>
          <p>{cta.text}</p>
          <a className="btn-cta" href={QUOTE_URL}>
            {cta.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
