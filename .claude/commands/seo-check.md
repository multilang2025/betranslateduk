---
description: Check one page's on-page SEO on betranslated.co.uk against this site's own rules.
argument-hint: <url path>
---

SEO check: $ARGUMENTS. Read-only audit of the built or live page.

1. Meta title under 60 characters in Chicago Title Case with a hyphen separator; description 130 to 160 characters with a CTA. Set through `set_seo`, not a Divi module.
2. Headings H2 to H6 in sentence case; known blocker: one shared Divi layout (section 4, item 1 of `docs/betranslated-co-uk/07-handoff-to-victoria-2026-10-13.md`).
3. Ahrefs project 1813246 and Search Console: impressions fell from about 190,000 a month (Aug 2025) to about 28,000 (Sep 2026) while clicks held; cause not found. Pull the data listed in section 4, items 14 to 16, and do not guess a cause.
4. Redirects are one hop, 301, destination on `https://www.betranslated.co.uk`.
5. Schema: Rank Math handles it; FAQPage is not used.

Work on a branch, never `main`; open a PR only when asked; content stays DRAFT until Mike approves; no commit unless asked. Report: findings in priority order / not verified / left for Mike. Read-only.
