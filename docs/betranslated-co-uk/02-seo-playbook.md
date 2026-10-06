# betranslated.co.uk: SEO playbook

## 1. Objectives

Rank for and convert on:
- "Professional Translation Services UK"
- "Legal Translation UK"
- "Certified Translation UK"
- "Website Localisation UK"

Build topical authority around translation, localisation and multilingual SEO. Quality leads over volume.

## 2. Page types

| Type | Goal | Examples | Required elements |
|---|---|---|---|
| Service | Rank and convert | Translation services, legal translation, website localisation, remote interpreting | H1 with keyword, H2 variations, UK entities, five FAQs, CTA to quote, links to industries |
| Industry | Capture niche traffic | Legal, medical, marketing, technical | Industry vocabulary, use cases, links to services |
| Location (optional expansion) | Local SEO | Translation Services London, Manchester, Birmingham | Mention "translation agency" and "interpreting services" in the introduction, reference nearby cities, no thin duplicates |
| Blog | Long-tail, internal link support | Cultural, language, localisation topics | 800 to 1,200 words, five FAQs, links to services |

Interpretation pages: each H2 and H3 section carries at least 150 words.

## 3. Audit procedure (repeat quarterly)

1. Ahrefs Site Audit (project 1813246): issues list, 4xx pages, duplicate H1, meta length, missing alt, schema errors.
2. Ahrefs organic keywords for `betranslated.co.uk`, country `gb`, positions 4 to 20, volume 30 or more, sorted by volume. These are striking-distance targets.
3. Pages by traffic and by internal links. Flag orphan pages.
4. Pages with Google-rewritten titles (compare GSC query title behaviour with the Rank Math title).
5. Sitemap crawl: confirm every internal link target returns 200.
6. Hreflang check against the .com, .es and .fr network (skill: `hreflang-audit`).
7. Output a ranked fix list: impact, effort, risk. Ask Mike to approve before execution.

## 3b. Striking-distance workflow

For each keyword in positions 4 to 20:
1. Identify the ranking URL (`best_position_url`).
2. Check intent match: does the H1, first H2 and first 100 words answer it?
3. Check title and description include the keyword naturally.
4. Add a focused section or FAQ if the query is uncovered. Keep British spelling and UK entities.
5. Add contextual internal links from higher-authority pages.
6. Re-measure after four weeks.

Known targets from 26 May 2026: "international advertising", "translator vs interpreter", "british characters", plus two others from the same Ahrefs pull (re-run to retrieve them).

## 4. Redirect policy

- 301 only. Single hop. Never chain.
- Every removed or renamed URL gets a 301 to the closest equivalent.
- The six confirmed 404 fixes are in the backlog. Update internal links to point directly at the new target as well, so links do not rely on the redirect.
- Cross-domain redirects (Norwegian and Russian language pages to the .com site) are intentional.
- After the vibecode migration, carry the full redirect map across (see migration doc).

## 5. Schema

See style guide section 9. Validate with Google's Rich Results Test and Ahrefs after every change. The seven schema validation errors from the May audit are unresolved: identify them by re-running the audit, do not assume.

## 6. Technical checks

- One H1 per page.
- Alt text on every meaningful image.
- Title under 60 characters, description 130 to 160.
- Canonical present and self-referencing.
- Sitemap lists only 200 indexable URLs.
- Core Web Vitals checked after any theme or build change.
- Cache purge after writes (host-dependent, confirm for .co.uk).

## 7. Reporting

Report to Mike in a short note: what changed, which URLs, what to re-measure and when. No recap of steps. Include a Sources list when external facts were used.
