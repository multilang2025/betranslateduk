import { CONTACT, NAV } from "@/lib/site";

/** Simplified footer for the working copy. The live footer has more columns, reviews and language links. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-bt">
        <div className="cols">
          <div>
            <img src="/images/brand/logo.png" alt="BeTranslated" width={180} height={28} />
            <p style={{ marginTop: 14, lineHeight: 1.7 }}>
              BeTranslated is a translation agency with offices in the US, Belgium, Spain, France and Germany. Our global network of experienced translators provides professional language services to clients around the world.
            </p>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>
              {NAV.filter((n) => n.label !== "Home").map((n) => (
                <li key={n.label}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
              <li>
                <a href={CONTACT.emailHref}>{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="copy">Working copy of betranslated.co.uk. Not the live site.</p>
      </div>
    </footer>
  );
}
