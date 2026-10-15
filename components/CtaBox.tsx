import { cta } from "@/content/home";
import { CONTACT, QUOTE_URL } from "@/lib/site";

/** Navy grey section holding the teal ombre box. Navy in both themes. */
export function CtaBox() {
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container-bt">
        <div className="cta-box">
          <h2 id="cta-title">{cta.heading}</h2>
          <p>{cta.text}</p>
          <p className="contact">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          </p>
          <a className="btn-cta" href={QUOTE_URL}>
            {cta.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
