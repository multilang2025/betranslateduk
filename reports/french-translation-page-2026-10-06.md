# French translation services page: diagnosis and changes, 6 October 2026

Page: `https://www.betranslated.co.uk/languages/french-translation-services/` (post ID 225035)

## What the data says

| Source | Finding |
|---|---|
| Ahrefs positions CSV, 6 Oct 2026 | "french translation" (UK, volume 20,000) moved from position 29 to lost. |
| Search Console, 16 months to 6 Oct 2026 | The page has 46,804 impressions and 17 clicks at an average position of 35.6. Queries: "french translation services" 5,281 impressions at 31.1, "french translation agency" 1,874 at 35.0, "professional french translation" 1,571 at 24.4, "french translation" 818 at 27.1. |
| Reading | The page has sat on pages 3 and 4 for every French commercial query throughout. Position 29 for the head term was a short high, not a stable ranking, so there is no single defect that caused a drop. The page needs to be stronger for the whole French cluster. |
| Live page, 6 Oct 2026 | One H1, 1,224 words, no dashes, no FAQ section, no FAQPage schema, and Product plus AggregateRating schema. Title ended in "French Translator", which does not match the queries. Description was 125 characters with no call to action. "UK" did not appear in the title. |

## Applied today (live, Rank Math fields only)

| Field | Before | After |
|---|---|---|
| Meta title | Professional French Translation Services \| French Translator | Professional French Translation Services UK - BeTranslated (58 characters) |
| Meta description | Professional French translation services for business content & documents in the UK, France, Belgium, Switzerland and Québec. (125 characters) | Professional French translation agency for UK businesses. Native-speaking translators for France, Belgium, Switzerland and Québec. Get a free quote today. (154 characters) |

To roll back, paste the "Before" values into Rank Math for post 225035.
Re-measure in Search Console after four weeks. A title change can take a few weeks to settle, and Google may rewrite it.

## FAQ section and schema (applied on Mike's approval, 6 October 2026)

The FAQ section is live as its own Divi section above the global quote call to action, headed "Questions about French translation".
The FAQPage schema was saved through Rank Math (`rank_math_schema_FAQPage` on post 225035). It renders nested under the Service entity as `subjectOf`.
A first attempt using a Divi code module with a script tag failed: the script tags were stripped and the JSON showed as visible text for a few minutes. That module was removed and the page was checked afterwards.
A copy of the page content from before the FAQ was added is kept in the working scratch folder, not in the repo.
To roll back, delete the "Questions about French translation" section in the Divi builder and remove the FAQ schema in the Rank Math Schema tab.

### FAQ copy

**How much does a French translation cost in the UK?**

Price depends on word count, subject matter and turnaround.

You can see the pricing basis on our [rates page](https://www.betranslated.co.uk/translation-agency/rates/).

Send us your document for a free, no-obligation quote.

**How long does a French translation take?**

Turnaround depends on the length and complexity of your document.

Our [turnaround page](https://www.betranslated.co.uk/translation-agency/turnaround/) explains the options.

Tell us your deadline when you request a quote.

**Can you provide a certified French translation for UK use?**

Yes, for documents that need a certified translation, such as legal and official paperwork.

Tell us which organisation will receive the document, for example a court, the Home Office or a university.

They set the requirements, and we match them.

Our [legal translation team](https://www.betranslated.co.uk/industry/legal/) can advise.

**Do you translate into Canadian French as well as French from France?**

Yes.

We match the translator to your audience, whether that is France, Belgium, Switzerland or Québec.

**Can you translate and localise my website into French?**

Yes.

Our [website translation service](https://www.betranslated.co.uk/translation-services/website-translation/) covers content, metadata and multilingual SEO.

### FAQPage JSON-LD (separate output, add only after approval)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "How much does a French translation cost in the UK?", "acceptedAnswer": {"@type": "Answer", "text": "Price depends on word count, subject matter and turnaround. Send us your document for a free, no-obligation quote."}},
    {"@type": "Question", "name": "How long does a French translation take?", "acceptedAnswer": {"@type": "Answer", "text": "Turnaround depends on the length and complexity of your document. Tell us your deadline when you request a quote."}},
    {"@type": "Question", "name": "Can you provide a certified French translation for UK use?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, for documents that need a certified translation, such as legal and official paperwork. Tell us which organisation will receive the document and we match its requirements."}},
    {"@type": "Question", "name": "Do you translate into Canadian French as well as French from France?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. We match the translator to your audience, whether that is France, Belgium, Switzerland or Québec."}},
    {"@type": "Question", "name": "Can you translate and localise my website into French?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Our website translation service covers content, metadata and multilingual SEO."}}
  ]
}
```

Facts to confirm before publishing: that certified French translation is offered as described, and the exact rates and turnaround wording.
The answers avoid prices and timings I could not verify.

## Further steps for the French cluster (not done)

1. Internal links: link to this page from the French sub-pages and from relevant blog posts with the anchor "French translation services".
2. The French sub-pages sit at positions 10 to 45 with almost no clicks. `french-marketing` (9.8) and `french-financial` (10.2) are closest to page 1.
3. Tell Mike if the Product and AggregateRating markup on this page should be reviewed (audit finding 6).
4. Add a section on "French translation agency" intent. The query has 1,874 impressions at position 35 and the page uses "agency" four times.

## Internal links to the French sub-pages (applied 6 October 2026)

| Change | Pages |
|---|---|
| Removed Divi builder parameters (`?et_fb=1&PageSpeed=off`) from internal links. These are why Search Console showed builder URLs for the French sub-pages. | Eight pages: `/industry/it-telecom/`, `/industry/legal/`, `/languages/french-translation-services/`, `/languages/spanish-translation-services/`, `/languages/korean-translation-services/`, and three blog posts (`commercial-translation-professionals`, `business-need-financial-translation`, `good-translation-online-retail`). 16 links in total. |
| Added a sixth FAQ, "Which areas of French translation do you cover?", linking to all seven sub-pages, and added the matching question to the FAQPage schema. | `/languages/french-translation-services/` |
| Linked "French" to `french-business` | `/industry/business/` |
| Retargeted the "French" link to `french-marketing` | `/blog/press-release-translation/` |

Body links to each sub-page after the change (excluding the menu and footer): business 4, financial 3, legal 6, IT 4, marketing 2 before the press-release link, e-commerce 3, audiovisual 3.
Re-measure in Search Console after four weeks.
