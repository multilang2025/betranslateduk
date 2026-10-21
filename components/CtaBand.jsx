import { UI } from "../lib/i18n";
import { PHONE, PHONE_HREF } from "../lib/business";

export default function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <p className="cta-band__title">{UI.ctaTitle}</p>
          <p>{UI.ctaBody}</p>
        </div>
        <div className="cta-band__actions">
          <a href={UI.quoteHref} className="bt-btn bt-btn--primary bt-btn--lg">{UI.ctaButton}</a>
          <a href={PHONE_HREF} className="bt-btn bt-btn--secondary bt-btn--lg">{UI.ctaSecondary} {PHONE}</a>
        </div>
      </div>
    </section>
  );
}
