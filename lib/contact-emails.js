// Verified real contact addresses for pages where the live site's email
// obfuscation plugin reverses an address across many nested spans (relying
// on CSS direction:rtl to display correctly), so no working mailto href
// exists in the raw scraped markup. Decoded by reversing the captured
// bodyText fragment (consistent with the "dtcsfbob...betranslated.co.uk"
// garbage-token pattern this plugin injects) and cross-checked against the
// clean mailto: hrefs already found elsewhere on the site.
export const KNOWN_EMAIL_FIXES = {
  'contact-us': [
    { match: 'ku.oc.detalsnartebobfsctd-3a657b@vc', email: 'cv@betranslated.co.uk' },
    { match: 'ku.oc.detalsnartebobfsctd-5384d1@olleh', email: 'hello@betranslated.co.uk' },
  ],
};
