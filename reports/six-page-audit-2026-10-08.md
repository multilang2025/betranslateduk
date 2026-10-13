# Audit of six priority pages: freshness, style, links, 8 October 2026

Read only. Nothing on the site was changed for this audit.
Data: live crawl of each page on 8 October 2026, the 8 October link audit (all links and images), publish dates from the WordPress database.

## Summary

| Page | Freshness | Style breaches | Links |
|---|---|---|---|
| `/blog/multilingual-chatbots-shake-up-your-sales-strategy/` | Stale: published 25 Sept 2018, no mention of generative AI or ChatGPT, one source link unverifiable | 2 em or en dashes, first person "I mean", description 127 characters with no call to action | 1 source unverified (`chatbotsmagazine.com`), 1 source bot-blocked (Medium) |
| `/industry/legal/contract-translation-services/` | Not dated | Numbered headings (1 to 4), `<hr>`, "By assigning" opener, 9 Title Case H2s, description 127 characters with no CTA | Clean |
| `/languages/french-translation-services/legal-translation/` | Not dated | 1 Title Case H2. Description was 109 characters, now 145 after the change on 6 Oct | Clean |
| `/languages/german-translation-services/german-business/` | Not dated | 3 Title Case headings, description 138 characters with no CTA | Clean |
| `/languages/korean-translation-services/korean-business/` | One dated claim in the wrong tense | 2 "By" openers | Clean |
| `/translation-agency/locations/belfast/` | Census and population figures unsourced | "break down language barriers", 8 Title Case H2s, description 116 characters with no CTA | Clean |

On every page the only non-200 links are the same two site-wide ones: Facebook (returns 400 to scripts, a bot block) and YouTube (a harmless 302). No page has a broken internal link or a broken image.

## 1. Multilingual chatbots post

Published 25 September 2018, last modified 14 October 2025.

- **Freshness:** the article calls chatbots "one of the major advances in artificial intelligence" and never mentions generative AI, large language models or ChatGPT. It has no statistics to date. The only named product is IBM Watson. It needs a rewrite, not a tweak.
- **Links:** `chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-…` resolves in DNS but did not answer from this machine or the browser pane, so check it by hand. The Medium article on Watson (2018) returned 403 and is probably alive but old. Both are sources from the same era.
- **Style:**
  - Two em dashes: "to learn new languages — train it" and "customer service department—all with one chatbot".
  - First person: "And by this, I mean hundreds".
  - Description is 127 characters and has no call to action.
  - Title is 56 characters, under the limit.
- **Schema:** BlogPosting, BreadcrumbList, Person, Organization. Fine.

## 2. Contract translation services

- **Style:**
  - Four numbered headings: "1. Legal Contracts", "2. Commercial Contracts", "3. Financial Contracts", "4. Personal Contracts". The style guide bans numbered headings.
  - One `<hr class="wp-block-separator">` in the content, which the style guide bans.
  - One sentence opens "By assigning translators with relevant industry knowledge, we ensure...".
  - Nine H2 or H3 headings are in Title Case, for example "Why Choose BeTranslated for Contract Translation?" and "Languages We Cover". The guide asks for sentence case.
  - The contents block is labelled "Table Of Content".
  - Description is 127 characters, with no call to action, and lacks a comma after "individuals".
- **Links:** all internal links return 200. Footer and social links as noted above.

## 3. French legal translation

- **Style:** one Title Case heading, "Our Legal Translation Services in French". The page is short at 646 words.
- **Description:** was 109 characters. I rewrote title and description on 6 October. Both are now within limits.
- **Links:** clean. The page has 6 body links from the rest of the site after the link work on 6 to 8 October.

## 4. German business translation

- **Style:** Title Case headings: "Our Business Translation Service in German", "German Subtitling Services", "German Business Interpreting Services". Description is 138 characters, in range but with no call to action. "We understand the importance of clear, accurate communication" is body text, not a heading, so it is not a breach of the headings rule.
- **Schema:** AggregateRating, Offer and ItemPage, the Product-style markup flagged in the main audit.
- **Links:** clean.

## 5. Korean business translation

- **Freshness:** "The UK and South Korea have signed a trade agreement in 2023, that will see South Korean businesses invest £21 billion in renewable energy and infrastructure across the UK." The tense is out of date, the comma is wrong, and the figure should be checked against the gov.uk source the page already links.
- **Style:** two sentences open with "By" plus a gerund: "By considering cultural nuances..." and "By working with native Korean translators...". The headings are fine. Description is 148 characters with a call to action, the best of the six.
- **Links:** clean, including the gov.uk source (200).

## 6. Belfast location page

- **Freshness:** "The 2021 Census revealed that around 80,000 people in Northern Ireland speak a language other than English." The figure has no visible source and should be checked. "Around 6% of the country's population identifying as non-UK born" is unsourced, and "the country" is ambiguous on a Northern Ireland page.
- **Style:**
  - "help you break down language barriers", a close variant of the banned phrase "break language barriers".
  - Eight Title Case H2s, for example "Why Belfast needs BeTranslated" is fine but "Translation Services in Belfast" and "Get Started with BeTranslated" are not.
  - Description is 116 characters and has no call to action.
  - Title is 28 characters, with room to include "UK".
- **Links:** clean.

## Suggested fixes, in order

1. Rewrite the chatbots post for 2026 and replace the two old sources.
2. On the contract page, remove the numbering from the four headings, delete the `<hr>`, rewrite the "By assigning" sentence, and put the H2s in sentence case.
3. Add a call to action and bring each description into range on the contract, German, Belfast and chatbots pages.
4. Sentence-case the Title Case headings on the German, Belfast and French legal pages.
5. Update the Korean trade agreement sentence and verify the figure.
6. Source or remove the Belfast population figures.
7. Rewrite the "By" openers on the Korean and contract pages and the "break down language barriers" line on Belfast.

## Method notes

- "Title Case heading" is a rough test: three or more words with most words after the first capitalised. A few proper nouns may be flagged wrongly.
- Dated claims were found by scanning the visible text for years and for words like "currently" and "recently". The check cannot judge whether a figure is correct.
- External links that block automated requests (403, or Facebook's 400) could not be confirmed from this machine.

## Fixes applied on 8 October 2026

| Page | Changes |
|---|---|
| Chatbots post | Replaced two dashes ("abilities: train it", "department, all with one chatbot"), changed "I mean" to "we mean", wrote a new 137-character description with a call to action. The article itself still needs a rewrite. |
| Contract translation | Sentence case on all 15 headings, removed the numbering from four H4s, deleted the `<hr>`, rewrote the "By assigning" sentence, new 141-character description with a CTA. |
| French legal | Sentence case on one H2. Description already fixed on 6 October. |
| German business | Sentence case on four headings, new 135-character description with a CTA. |
| Korean business | Rewrote two "By" openers. The 2023 trade agreement sentence and the £21 billion figure are untouched and need your check. |
| Belfast | Sentence case on eight headings, replaced "break down language barriers", new 135-character description with a CTA. The unsourced census and population figures are untouched. |

Re-scanned the live pages afterwards: no dashes, no "By" openers, no numbered headings, no `<hr>`, no shortcode leaks, descriptions 135 to 148 characters.
Left alone on purpose: facts that need a source (Belfast figures, the Korean trade figure) and the chatbots rewrite.
