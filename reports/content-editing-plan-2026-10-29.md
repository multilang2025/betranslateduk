# Content editing plan, betranslated.co.uk (29 Oct 2026)

Branch: `content/editing-2026-10-27`. Content: `scripts/btvibe-uk/output/` (`pages/`, `posts/`). Rules: Mike's handoff of 26 Oct 2026. Never push to `main`; one PR per batch.

Baseline scan of 172 content files (106 pages, 66 posts) against the mechanical rules:

| Check | Result |
|-------|--------|
| Meta title 60 characters or more | 0 |
| Meta description outside 130 to 160 | 1 (`thank-you`, 128) |
| Em or en dashes | 0 |
| Banned words (important, vital, crucial, essential, "this guide") | 0 |
| Pipe in a title | 0 |
| Heading "Conclusion" | 0 |
| Numbered headings | 2 (`terms-conditions`, `posts/expressions-from-the-it-crowd`) |
| Possible prices | 12 files (to confirm, may be false positives) |
| Outbound links in posts | 214 links across 56 posts |

The mechanical rules are mostly clean, so the real work is accuracy, merging and link review.

## Before starting

- [ ] Pull the latest `main` and PR 16 (the 36 merged Korean, French, German and Spanish sector pages may not be in this checkout yet: it still has the old `french-*`, `german-*`, `korean-*`, `spanish-*` sector files).
- [ ] Read `08-handoff-content-editing-2026-10-26.md` and `01-style-guide.md` from the docs repo (not in this checkout).
- [ ] Add a check script (`tools/`) that runs the table above, so every batch is verified the same way.

## Priority 1: facts that can be wrong (accuracy)

Posts with several statistics or years, first in the editorial queue. For each figure: find the source, confirm the number, period and group, and set it in a blockquote with an inline source line. Replace or cut anything unsourced.

- [ ] `top-ten-translation-films` (14 figures or years)
- [ ] `insurance-translation-services` (11)
- [ ] `belgium-market-translation` (8)
- [ ] `lazy-monolingual-english-speakers` (8)
- [ ] `translation-services-for-optical-practices` (6, dated 2025)
- [ ] `british-footballers` (5, dated 2026)
- [ ] `environmental-translation-services-green-economy`, `latest-trends-translation-industry`, `translation-schools-belgium` (5 each)
- [ ] `boost-reach-video-subtitling`, `why-choose-betranslated-and-not-ai` (4 each)
- [ ] `best-translation-tools`, `guide-western-european-languages`, `specialised-healthcare-translation-services` (3 each)
- [ ] Refresh aged facts in the 2024 to 2026 posts first (13 posts), then 2016 and 2017 (10 posts: ask Mike whether the "leave 2018 to 2023 alone" rule covers these)

## Priority 2: rule fixes (quick wins, one small PR)

- [ ] Confirm the 12 possible-price files and remove any real prices: `industry/marketing/travel`, `languages/korean-translation-services/korean-business`, `korean-it-translation-services`, `translation-services/england` plus `leeds`, `nottingham`, `sheffield`, `southend-on-sea`, and posts `latest-trends-translation-industry`, `top-spots-location-independent-professional`, `translation-services-for-optical-practices`, `why-choose-betranslated-and-not-ai`
- [ ] Un-number the headings in `terms-conditions` and `expressions-from-the-it-crowd`
- [ ] Lengthen the `thank-you` meta description to 130 to 160 characters
- [ ] Check heading levels (no skipped levels) and sentence case on every page and post
- [ ] Check meta descriptions end with a call to action (lengths pass, CTAs not yet checked)

## Priority 3: the merged language pages

- [ ] French technical section on `/languages/french-translation-services/`: proofread, sentence-case headings, links, retired-URL redirects
- [ ] Merged German, Spanish and Korean pages: remove duplicated intros, check each merged section has a unique heading, check anchors (`#korean-audiovisual` and so on) match `data/retired-urls.json`
- [ ] Confirm every old sector URL has a redirect row and `tools/check-retired-redirects.mjs` passes

## Priority 4: location pages (41 pages)

England 21, plus Aberdeen, Bangor, Belfast, Cardiff, Edinburgh, Glasgow, Londonderry and Swansea.

- [ ] Rewrite the repeated template wording so each city page has local detail (no near-duplicate pages)
- [ ] Check every local fact (universities, industries, languages spoken)
- [ ] Fix meta: unique titles, descriptions with a CTA, and the nine pages with prices or links that need checking

## Priority 5: outbound links in posts (214 links, 56 posts)

- [ ] List every outbound domain and flag competitors or industry-adjacent sites
- [ ] Check that each link still loads
- [ ] Ask Mike how to treat paid placements before removing any link (on betranslated.com a removed link is a lost paid placement; the UK handoff only says "no links to competing or industry-adjacent sites")

## Priority 6: remaining pages and housekeeping

- [ ] Service and sector pages (`industry/*`, `translation-services/*`, `document-translation-services`, `languages/*` hubs): read for ageing facts and thin copy
- [ ] `/translators/` cards: check `data/translators.json` is complete and current
- [ ] FAQs: five per service page, shown collapsed, no FAQPage schema
- [ ] Add a `data/retired-urls.json` row for anything retired
- [ ] Draft posts from 2018 to 2023 (43 posts) stay untouched; content stays in draft until Mike approves

## How each batch runs

1. Branch from `main`, edit the JSON (`bodyHtml`, `title`, `metaDescription` only), keep it valid.
2. Run the check script, restart the dev server, look at the page.
3. Commit small, push the branch, open a PR, and open the Hostinger preview link.
4. Report: what changed, which URLs, what to re-measure. Add a Sources list for any external fact.

## Questions for Mike

1. Does "leave 2018 to 2023 alone" also cover the 2016 and 2017 posts?
2. May outbound links to competitors or industry-adjacent sites be removed if they are paid placements?
3. Is the French technical section new this week, and what is still missing from it?

## Progress log

### Priority 1, batch 1 (29 Oct 2026): fixed against primary sources

| Post | Was | Now | Source |
|------|-----|-----|--------|
| `guide-western-european-languages` | Welsh spoken by "nearly 30%" | 17.8% of people aged 3+ (538,000), down from 19.0% in 2011 | ONS, Census 2021 |
| `boost-reach-video-subtitling` | 11 million deaf or hard of hearing | More than 17 million with hearing loss (18 million incl. tinnitus) | RNID prevalence page |
| `why-choose-betranslated-and-not-ai` | "Economist study" 44% delay, 18% lost sales | EIU 2018, 403 US respondents, shares of respondents, 18% is "failure to close a sale" | EIU / Lucidchart report |
| `environmental-translation-services-green-economy` | "Renewables" 40.9% | 40.9% is low-carbon (renewables plus nuclear) | Ember, Global Electricity Review 2025 |

Checked and left as is: `latest-trends-translation-industry` (Nimdzi: USD 71.7bn in 2024, USD 75.7bn forecast for 2025, matches the Nimdzi 100 2025 page; a 2026 edition exists and may have a newer figure), `lazy-monolingual-english-speakers` (already sourced), `belgium-market-translation` (already cites Statbel and Eurostat).

### Still unverified (needs a primary source before changing)

- `guide-western-european-languages`: English 1.35 billion (likely outdated, Ethnologue now about 1.5 billion), Spanish 460 million native, Italian 67 million, Dutch 23 million, Portuguese 275 million, French "88% native". Ethnologue returned 403 to the fetch tool, so needs a manual check.
- `why-choose-betranslated-and-not-ai`: UK AI market "£17 billion, over £800 billion by 2035" (DSIT's AI sector study 2024 says £23.9 billion revenue; no official 2035 forecast found), HSBC "$10 million" rebrand.
- `boost-reach-video-subtitling`: Facebook "100 million hours a day" (a 2016 figure) and the 10%, 12%, 26% Facebook study.
- `insurance-translation-services` (Nov 2023): FT 33% rise, Brexit 60% and 100%, 65% of staff relocated to Hong Kong, 30% UK-based, 33% investing in technology.
- `translation-services-for-optical-practices`: IBISWorld GBP 5.4 billion and 5,400 businesses, lens market USD 2,015.6m to 2,811.8m.
- `environmental-translation-services-green-economy`: Sweden wind project "300,000 homes over 15 years".
- Still to scan: `best-translation-tools`, `immigration-can-drive-business-growth`, `tremendous-value-multilingual-website`, `zoom-interpreting` and the long tail of posts with one figure each.

### Correction to the blog index finding (29 Oct 2026)

The earlier note that the index shows only 9 of 66 posts was wrong. `blog.json` holds the old WordPress cards, but `/blog/` is rendered by `BlogIndexView` in `components/ScrapedPage.jsx`, which listed all 66 posts. The real problems were the plain hero, no topics or popularity, and clipped dates.

### Blog hub rebuild (29 Oct 2026)

- New hero: tailored copy and a blog SVG (`components/BlogHeroArt.jsx`).
- Topic chips under the hero, then "Most read" (top 6 by GA4 sessions, `data/blog-popularity.json`, 30 Oct 2025 to 29 Oct 2026), then "Latest" (6 newest), then six topic sections (`data/blog-topics.json`) showing 3 posts each with a native `<details>` dropdown for the rest.
- Card dates now sit in a meta row inside the card padding (they were clipped at the left edge).
- Rule fixes: numbered headings removed from `terms-conditions` and `posts/expressions-from-the-it-crowd`; `thank-you` meta description lengthened to 139 characters; `Belgium` and other countries kept capitalised in card titles (`lib/sentenceCase.js`).
- The 12 "possible price" files from the scan are economic statistics (city GDP, market size), not service prices. They stay in the Priority 1 fact-check queue instead.

### Priority 1, batch 2 (29 Oct 2026): insurance and optical posts

| Post | Claim | Result |
|------|-------|--------|
| `insurance-translation-services` | "65% of its staff in London relocated to Hong Kong" | No source found. Replaced with Prudential's own 2023 statement that its entire senior management team has moved to Asia (blockquote). |
| | Brexit hit "60%" worldwide and "100%" of UK insurers | Could not be checked (the CII page redirects to a verification wall). Numbers removed, link kept. "Experts unanimously agree" softened. |
| | London Market "only 30% UK-based", "only market with the top 20 reinsurers", "33% of insurers investing in technology" | No source found. Removed or softened. Added Lloyd's gross written premium: GBP 55.5bn in 2024, GBP 52.1bn in 2023 (Lloyd's results). |
| | FT "more than a 33% rise in two years" | FT page not reachable. Reworded as a forecast "at the time", link kept. Home insurance prices have since fallen (ABI tracker, secondary reports): the section still needs a rewrite if Mike wants this post current. |
| | "140 certified insurers in the City of London" | Left as is. The only source is a business directory page. |
| `translation-services-for-optical-practices` | IBISWorld GBP 5.4bn (2023) and "more than 5,400 businesses" | IBISWorld's pages disagree with each other (5.4, 5.7 and 5.8bn). Replaced with the one figure on the IBISWorld market-size page: GBP 5.8bn in 2026. Business count dropped. |
| | Prescription lens segment USD 2,015.6m to 2,811.8m (4.9% CAGR) | No source matches. Published reports put the global market at about USD 45 to 65bn. Sentence removed. |

**Note for Mike:** the insurance post is dated 4 Nov 2023, inside the "leave 2018 to 2023 era posts untouched" window. These edits remove or soften unverifiable statistics only. Revert that file if the rule covers published posts.

Still unverified from the earlier list: AI market figure and HSBC rebrand cost (`why-choose-betranslated-and-not-ai`), Facebook video figures (`boost-reach-video-subtitling`), Sweden wind project (`environmental-translation-services-green-economy`), English, Spanish, Dutch, Portuguese and French speaker counts (`guide-western-european-languages`).
