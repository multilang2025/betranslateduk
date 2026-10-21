import { t } from "../lib/i18n";
import { PHONE, PHONE_HREF } from "../lib/business";

export default function CtaBand() {
  const ui = t("en");
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <p className="cta-band__title">{ui.ctaTitle}</p>
          <p>{ui.ctaBody}</p>
        </div>
        <div className="cta-band__actions">
          <a href={ui.quoteHref} className="bt-btn bt-btn--primary bt-btn--lg">{ui.ctaButton}</a>
          <a href={PHONE_HREF} className="bt-btn bt-btn--secondary bt-btn--lg">{ui.ctaSecondary} {PHONE}</a>
        </div>
      </div>
    </section>
  );
}
