# Preview content QA, 21 October 2026

Scope: the 171 pages and posts stored in `scripts/btvibe-uk/output/`, checked against the QA checklist in `docs/betranslated-co-uk/05-templates-and-checklists.md`. Every fix below is a re-runnable script in `scripts/btvibe-uk/style/`.

## Done on this branch

| Check | Result |
|---|---|
| Em and en dashes | 0 left (body, titles, descriptions, schema, alt text) |
| American spellings | 0 left except the deliberate "colour vs color" comparison |
| Headings in sentence case | 320 headings converted. Names, titles and places kept |
| Numbered headings | Removed on the M&A and patents pages. Listicle posts and the terms clauses left on purpose |
| "Twitter" and "this guide" | Fixed |
| `<hr>` and `<section>` | Removed (2 and 2 occurrences) |
| Duplicate H1 | One page fixed (`/blog/latest-trends-translation-industry/`) |
| Self links | 19 removed, text kept |
| "By" plus gerund openers | 41 sentences rewritten in second person, active voice |
| Meta descriptions outside 130 to 160 | 30 rewritten, all within range, each with the focus keyword and a call to action |
| Meta titles over 60 characters | 0 |
| Legacy WordPress and Divi code | Stripped. Rendered HTML of all 236 pages is unchanged |
| Focus keywords | One per page, from Search Console data via the Ahrefs project. See `reports/focus-keywords-2026-10-21.csv` |

## Still open (needs a writer or Mike)

1. ~~Sentences that open "By" plus a gerund~~: 41 sentences on 32 pages rewritten (script `by-gerund.js`).
2. ~~Images without alt text~~: 4 fixed.
3. **`/thank-you/` description** is 128 characters. The page should be `noindex`, so it was left alone.
4. **Meta titles are in Title Case** by design (style guide section 5). Say if you want them in sentence case too.
5. **Outbound links** to review against the no-competitors rule: upwork.com, guru.com, reverso.net, lokalise.com and the other external domains. Needs Mike's approval per domain.
6. **Rates page** description no longer quotes euro prices. The euro figures and the Korean heading on the page body are still open from the Victoria handoff.
7. **FAQs**: only one page has FAQPage schema. The playbook asks for five FAQs per service page.
8. **Focus keyword vs title**: 18 pages have a focus keyword whose words are not all in the meta title (for example `/translation-agency/locations/`, `/blog/best-translation-tools/`). Titles were left unchanged. Review them with the CSV.

## Visual check, 21 October 2026 (local build and live preview)

Fixed:
- The empty Divi "Table of content" band (visible as "i 3 Table Of Content") is removed from 400 content blocks.
- All visible text is in sentence case: stored headings and short labels, card and list titles (rendered from the meta title through `lib/sentenceCase.js`, while the `<title>` tag stays in Title Case), footer and nav labels, and the homepage copy.

Still open:
- **Client logo band** on the homepage shows broken images for 3 of the logos on the local build. Check the `/images/...` paths on the live preview.
- The live preview at the time of the check was an older build (it still showed the Sunderland "500,000" sentence), so it needs another look once Hostinger has built the latest commit.

## Follow-up, 21 October 2026
- Client logos are not broken: all files exist and return 200 on the Hostinger preview. The broken images in the headless screenshot were lazy loading.
- The Manchester "over £5 billion" and Leeds "over £1.3 billion" claims are removed. No trusted source supports either figure (published estimates range from £671 million to £15 billion for Leeds, and from £3.4 billion to £5 billion for Manchester).
- Still open for Mike: Rates page euro figures and Korean heading, five FAQs with FAQPage schema on service pages (content to be written and approved), outbound links (left as they are).

## Decisions by Mike, 21 October 2026 (applied)
- **FAQs:** five per page on all 101 service, industry, language, location and agency pages (the French parent already had its own). Visible dropdown only. **No FAQPage schema anywhere** (hard rule): the two stored FAQPage nodes were removed and `PageSchema` now strips any FAQPage at render. FAQ copy is a draft for review. Statements about glossaries and translation memory, confidentiality and certification wording should be checked against how the team really works.
- **Rates page:** the per-word prices are replaced by "We quote each project individually, so you see a clear price before any work starts." Euro figures are gone from the page and the meta description.
- **Inventory:** `data/inventory.csv` (784 rows: the 171 sitemap pages with title, description, H1, focus keyword, links, images, FAQ flag and the best Search Console query, plus 613 other URLs from the Ahrefs crawl, 102 of them HTML). Ahrefs reports 785 internal URLs for the project, not 809. Regenerate with `node scripts/btvibe-uk/inventory.js <ahrefs-crawl.csv>`.
- Main contact email is hello@betranslated.co.uk everywhere (Mike, 21 October 2026). It replaces global@betranslated.com in the stored content (757 occurrences on 171 pages).
