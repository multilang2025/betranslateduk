# betranslated.co.uk: style guide

Single source of truth for every agent. Where two earlier rules conflicted, the resolution is marked **Resolved**.

## 1. Language and voice

- British English throughout: specialise, localisation, organisation, favour, programme, licence (noun).
- Second person: "you" and "your business". Never first person in commercial copy.
- Active voice. Clear, concise, professional. Direct, no fluff.
- No clichés, buzzwords or corporate jargon.
- Ask thoughtful, relevant questions to engage the reader.
- Tone: expert, confident, client-focused. Position as premium, never cheap.

## 2. Hard bans

| Rule | Detail |
|---|---|
| Dashes | No em dashes or en dashes anywhere. Use a comma, colon or full stop. Hyphens in compound words and in meta title separators are fine. |
| Phrases | Never "break language barriers". Never "The Importance of" in headings. Never "this guide". |
| Sentence openers | Never start a sentence with "By" plus a gerund. |
| Headings | No numbered headings. Headings start with a capital letter. |
| Personal | Never mention drumming, drums or percussion in any bio or profile. |
| Social naming | Use "X", never "Twitter", in copy and structured data. |
| Links | No outbound links to competing or industry-adjacent sites. Name the source in text without a hyperlink, or use a neutral source (news outlet, government, academic) when a link is needed. |
| Old content | Draft posts from the 2018 to 2023 era: leave untouched. |
| HTML | No `<hr/>`, no `<section>` tags, no wrapper tags (`<!DOCTYPE>`, `<html>`, `<head>`, `<meta>`, `<body>`) unless a single combined file is explicitly requested. |

## 3. Layout of body copy

- One sentence per line.
- Every full stop is followed by two hard returns (a blank line between sentences).
- URLs only inside full sentences, never standalone.
- Lists of keywords or items: one item per line, each line grammatically correct, no bullets.
- Long articles: use a MEGA PROMPT (see `05-templates-and-checklists.md`).

## 4. Headings

| Element | Rule |
|---|---|
| H1 | Contains the main keyword and one relevant emoji. British spelling. If the supplied text has no H1, do not add one. |
| First H2 | Secondary or related keyword, UK tone. If the supplied text does not start with an H2, add one. |
| H2 to H6 | Sentence case. Clear and descriptive. |
| Word count | 800 to 1,200 words for blog and service copy. |
| FAQs | Exactly five, UK-relevant (for example legal certification in the UK, localisation for UK markets). |

## 5. Metadata

| Field | Rule |
|---|---|
| Meta title | Title Case following Chicago Style. Hyphen separator, never a pipe. Under 60 characters. One emoji where the brief calls for it (new copy). UK-optimised keyword. |
| Meta description | 130 to 160 characters including spaces. Hard maximum 160. Brief, clear, action-oriented, with a CTA. Never identical to the excerpt. |
| Excerpt | Two sentences, the second acting as the CTA, plus one emoji. UK context. |
| Canonical | Set to the page's own specific path. |
| Focus keyword | One per page, in Rank Math (or the vibecode metadata field). |

**Resolved:** metadata and JSON-LD are produced only when explicitly requested, and always as separate, clearly labelled outputs, never mixed into article content. In pipeline runs the orchestrator makes that request explicitly.

## 6. Keywords (UK search intent)

Primary set:
- Professional Translation Services UK
- Legal Translation UK / Legal Translation in the UK
- Certified Translation UK / Certified Sworn Translation UK
- Website Localisation UK
- UK SEO Translation Services (multilingual SEO)

Integrate naturally. No stuffing. One focus keyword per page.

## 7. UK entities and examples

Layer in real UK named entities: HMRC, Home Office, Companies House, NHS, British Council, FCDO, UK courts, APPG for Modern Languages, UK cities (London, Manchester, Birmingham and others that have live location pages).

Example bank by service:
- Legal: contracts for UK courts, HMRC documents, UK visas
- Marketing: UK SEO copy, branding localisation for British campaigns
- Technical: NHS documentation, UK product manuals
- Sworn: UK marriage and birth certificates, Home Office papers
- Interpreting: remote meetings, UK business events
- Dubbing and localisation: UK-specific audiovisual content
- SEO services: on-page and off-page SEO for UK multilingual websites

Never invent statistics. Every figure needs a verifiable neutral source, named in text.

## 8. Internal linking

- Only link to URLs verified live in `https://www.betranslated.co.uk/sitemap_index.xml` and its sub-sitemaps. Never guess a URL.
- The project brief also references `sitemap-BT-COM-EN.txt` for cross-domain .com links. Use it only for deliberate cross-domain links to betranslated.com.
- Never link a page to itself.
- Links are contextual and natural, with descriptive anchor text.
- Structure: services link to industries, industries link to services, blog posts link to relevant services.
- **Resolved:** blog posts link to services and industries. Do not add links to other blog posts in optimised content unless Mike asks.
- Links to the external .es or .com domains must be intentional and flagged in the output.

## 9. Structured data (JSON-LD)

- While on WordPress with Rank Math: inject only `FAQPage` and `HowTo` in body content. Rank Math already outputs Article, Organization, WebPage and BreadcrumbList. Duplicating them causes Google Search Console warnings.
- On pages that sell a service, `Product` schema is allowed if Mike requests it. Every Product must carry both a price and an image.
- `BreadcrumbList` `position` values are strings: `"position": "1"`.
- Use "X" not "Twitter" in `sameAs` and descriptions.
- **After the vibecode migration** there is no Rank Math. The build must emit Organization, WebSite, WebPage, BreadcrumbList and per-page Product / FAQPage / HowTo itself, exactly once each. See `04-vibecode-migration.md`.

Organisation facts to reuse:
- Social profiles: instagram.com/betranslatedintl, x.com/betranslated, linkedin.com/company/betranslated, facebook.com/BeTranslated, youtube.com/@betranslated-intl
- Location: use the Google Maps link held in the Claude Project brief. Do not alter it.

## 10. Conversion logic

Every commercial page must:
1. Address a specific need or industry.
2. Build trust with expertise, experience and use cases.
3. Push to a quote request or contact.

## 11. Embedded design elements (WordPress phase)

Blockquotes, CTA boxes and FAQ accordions use inline CSS that matches the existing site. Keep any CSS in the element itself. Quotes are paraphrased from authoritative sources and attributed in text (British Council, APPG and similar) without a hyperlink to a competitor.
