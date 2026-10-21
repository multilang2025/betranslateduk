// Rewrites meta descriptions that fall outside the 130 to 160 character
// house limit (style guide section 5). Each new text keeps the page's focus
// keyword, ends with a call to action and is checked for length here.
// Usage: node scripts/btvibe-uk/style/meta-descriptions.js [--write]
const fs = require('fs');
const { listJson, WRITE } = require('./lib');

const D = {
  '/contact-us/': 'Contact BeTranslated to request a quick translation proposal. Tell us about your project and a professional translator will reply promptly.',
  '/industry/legal/will-certified-translation-services/': 'Certified will translation services for UK probate and overseas estates. Accurate, confidential translators for legal documents. Request a free quote.',
  '/industry/marketing/': 'Marketing translation services for campaigns, websites and ad copy, by translators who understand brand voice and UK audiences. Request a free quote today.',
  '/languages/german-translation-services/german-technical/': 'German technical translation services from English to German and back. Precise, localised translations for engineering and IT. Request a free quote.',
  '/languages/korean-translation-services/korean-marketing/': 'Korean marketing translation services that adapt your brand, campaigns and websites for Korean audiences. Talk to our team and request a free quote.',
  '/translation-agency/locations/glasgow/': 'Translation services in Glasgow for legal, business and technical documents. Accurate work with cultural care from native translators. Request a free quote.',
  '/translation-agency/locations/londonderry/': 'Translation services in Londonderry for legal, medical and technical documents. Clear, accurate work from professional translators. Request a free quote.',
  '/translation-agency/locations/swansea/': 'Translation services in Swansea for business, legal and academic documents. Professional, accurate translators for every language. Request a free quote.',
  '/translation-agency/locations/': 'Find BeTranslated translation services across the UK, from Belfast to Cardiff. Professional translators for every language. Request your free quote today.',
  '/translation-agency/quote/': 'Request a translation quote from BeTranslated. Tell us your languages, document type and deadline and get a clear, fixed price for your translation.',
  '/translation-agency/rates/': 'Translation rates from BeTranslated, based on word count, language pair and content type. Get a clear price for your project with a free, no-obligation quote.',
  '/translation-services/england/birmingham/': 'Translation services in Birmingham for legal, business and technical documents. Accurate, confidential work from professional translators. Get a free quote.',
  '/translation-services/england/bournemouth/': 'BeTranslated offers Bournemouth translation services for legal, medical and technical documents. Clear communication in every language. Request a free quote.',
  '/translation-services/england/brighton/': 'Translation services in Brighton for business, legal and creative documents. Expert native translators and fast turnaround. Request your free quote today.',
  '/translation-services/england/cambridge/': 'Translation services in Cambridge for academic, legal and business documents. Accurate work from native translators you can trust. Request a free quote.',
  '/translation-services/england/leeds/': 'Translation services in Leeds for legal, financial and business documents. Accurate, confidential work from professional translators. Request a free quote.',
  '/translation-services/england/norwich/': 'Translation services in Norwich for business, legal and technical documents. Professional translators in every language. Request your free quote today.',
  '/translation-services/england/portsmouth/': 'Translation services in Portsmouth for legal, maritime and business documents. Accurate work from native translators. Request your free quote today.',
  '/translation-services/england/sheffield/': 'Translation services in Sheffield for business, legal and technical documents. Reach global markets with accurate translations. Request a free quote.',
  '/translation-services/england/southend-on-sea/': 'Translation services in Southend-on-Sea for legal, medical and business documents. Professional, confidential translators. Request your free quote today.',
  '/blog/betranslated-opens-its-doors-in-france/': 'BeTranslated, headquartered in Belgium with a branch in Spain, has opened its doors in France. Read the news and meet the French team behind our services.',
  '/blog/communication-agencies-translation/': 'Launching a communication agency on the global market starts with translated international documents. Find out why and how to get it right. Read more.',
  '/blog/get-started-remote-freelancer/': 'Getting started as a remote freelancer can feel like a mystery at first. Read our practical tips and tricks for freelance success and start today.',
  '/blog/good-translation-online-retail/': 'Learn how to check that the retail translation services you ordered have been delivered well, from product pages to checkout. Read our practical checklist.',
  '/blog/immigration-can-drive-business-growth/': 'Immigration has negative connotations for some, but it brings real benefits to business growth and innovation. Read the positives that rarely make the news.',
  '/blog/international-advertising-benefits/': 'Discover how international advertising helps global brands grow and why it matters to marketing professionals. Read the benefits and best practices.',
  '/blog/latest-trends-translation-industry/': 'Will machine translation replace human translators? See the translation industry trends for 2026 and beyond and what they mean for your business. Read more.',
  '/blog/translation-schools-belgium/': 'Translation schools in Belgium train hundreds of professional translators every year. Check out our list of the best schools and universities.',
  '/blog/tremendous-value-multilingual-website/': 'A multilingual website is an easy way to attract new international clients. Find out what to consider before you start and how to get the most from it.',
  '/blog/vital-keyboard-shortcuts-translators/': 'Translators often work to tight deadlines, so every minute counts. Learn the 10 vital keyboard shortcuts every translator needs to work faster. Read the list.',
};
for (const [p, d] of Object.entries(D)) if (d.length < 130 || d.length > 160 || /[–—]/.test(d)) console.log('LENGTH', p, d.length);
let n = 0;
for (const f of listJson()) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.url) continue;
  const p = new URL(j.url.trim()).pathname;
  if (!D[p] || j.metaDescription === D[p]) continue;
  n++;
  j.metaDescription = D[p];
  if (j.og && typeof j.og.description === 'string') j.og.description = D[p];
  if (WRITE) fs.writeFileSync(f, JSON.stringify(j, null, 2));
}
console.log(`${WRITE ? 'Wrote' : 'Dry run'}: ${n} descriptions`);
