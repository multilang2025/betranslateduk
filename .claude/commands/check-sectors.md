---
description: Check the sector page data (data/sector-pages) for valid JSON, banned wording and dead internal links on betranslated.co.uk.
argument-hint: [sector file, or all]
---

# /check-sectors $ARGUMENTS

Read `docs/betranslated-co-uk/01-style-guide.md` first. Content stays draft until Mike approves; no commit unless I ask; work on a branch, never `main`.

1. `node scripts/check-sector-pages.cjs`: valid JSON in `data/sector-pages/*.json`, banned words and dashes (em/en dash, important, vital, crucial, essential, "this guide", "break language barriers", the pound sign), and internal link targets that exist in `scripts/btvibe-uk/output/`.
2. Beyond the script: British English, H2 to H6 in sentence case with no numbering, no `FAQPage` schema, five FAQs per service page, no outbound links to competing or industry-adjacent sites, no link to the page itself.
3. Internal links only to URLs verified live in the sitemap; the script checks the scraped archive, not the live site.
4. Run the QA checklist in `docs/betranslated-co-uk/05-templates-and-checklists.md` for anything handed to Mike.

Read-only. Report: script output / not verified / pages to fix.
