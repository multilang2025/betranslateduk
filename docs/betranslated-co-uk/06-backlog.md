# betranslated.co.uk: backlog

Status as of 6 October 2026. Nothing below was confirmed executed after 26 May 2026 unless stated. Re-verify before acting. Priority: P1 now, P2 next, P3 later.

| # | Pri | Task | Acceptance criteria | Agent |
|---|---|---|---|---|
| 1 | P1 | Register betranslated.co.uk in AISA | `get_current_site` returns the UK site, a read works, a draft write and trash works, behaviour documented in `03-wordpress-execution.md` | wp-executor |
| 2 | P1 | Check sibling repos (`betranslateduk`, `BTvibe-es`, `btes`, `BT-Digital`, others) | Findings table in `04-vibecode-migration.md` filled in | vibecode-migrator |
| 3 | P1 | Apply six 301 redirects | Old URLs return a single-hop 301 to confirmed targets, internal links updated, Ahrefs shows 0 of these as 404 | technical-seo, wp-executor |
| 4 | P1 | Verify April quick wins still hold | Spot check: 0 titles over 60, no American spellings in meta, brand name correct on the Plymouth page | seo-auditor |
| 5 | P1 | On-page housekeeping | One H1 on the affected page, two descriptions within 130 to 160, four images with alt text, seven schema errors identified and resolved | technical-seo, meta-schema |
| 6 | P2 | Review and publish two draft posts | Mike approves. Re-run QA and link verification. Publish. Share the IT Crowd post socially | content-writer, qa-editor, social-copy |
| 7 | P2 | Fix three Google-rewritten titles | New titles that match page intent and the H1, lengths valid, re-check in GSC after four weeks | meta-schema |
| 8 | P2 | Striking-distance keywords (five, positions 4 to 20) | Page updates shipped for each, internal links added, re-measure after four weeks | seo-auditor, content-writer |
| 9 | P2 | Location pages (London, Manchester, Birmingham and others) | Mike approves the list. Unique content per city, no thin duplicates | content-writer |
| 10 | P2 | Resolve WPVibe: restore be/fr or upgrade plan | betranslated.be/fr is reconnected if still needed | Mike |
| 11 | P2 | Confirm revocation of the Application Password pasted on 26 May | Confirmed in wp-admin | Mike |
| 12 | P3 | Full vibecode migration | Cutover checklist in `04-vibecode-migration.md` is green | vibecode-migrator |
| 13 | P3 | Inventory of all 809 URLs with page-level SEO data | `data/inventory.csv` exists and is accurate | seo-auditor |
| 14 | P3 | Quarterly audit loop | Report delivered every quarter | seo-auditor |
| 15 | P3 | Intern workflow for Victoria | Copy editing and social tasks run against the QA checklist | qa-editor, social-copy |
| 16 | P2 | Blog title and CTR plan (2 Nov 2026) | Titles of high-impression, low-CTR posts rewritten without clickbait, reviewed, applied as drafts, CTR re-measured after four weeks. See the section below | headline-copywriter, meta-schema, qa-editor |

## Decisions needed from Mike

1. Which old URL maps to which of the six redirect targets (if not recoverable from Ahrefs).
2. Is `multilang2025/betranslateduk` the intended home of the UK vibecode build?
3. Publish dates for the two draft posts.
4. Which UK cities get location pages.
5. Hosting provider and cache procedure for .co.uk.

## Known risks

- Connector drift: AISA tool parameters are unverified. Test on a draft first.
- Duplicate schema after migration if both layout and page emit Organization.
- Redirect loss on cutover, the biggest ranking risk.
- Cross-domain hreflang mismatches with .com and .es.

## 2 Nov 2026: Blog title and CTR plan (betranslated.co.uk)

Status: planned, nothing applied. No title, meta or post is modified by this entry.

**Why.** Mike (2 Nov 2026): make blog post titles more interesting and optimise CTR without clickbait. Done on betranslated.fr, ES follows, now planned here. Agent: `.claude/agents/bt-headline-copywriter.md`.

**Blog in this repo.** about 66 scraped posts (`scripts/btvibe-uk/output`), `app/blog/`, popularity data in `data/blog-popularity.json`.

**Method.**
1. Pull Search Console data from Ahrefs (project BT CO UK, `project_id` 1813246 (domain www.betranslated.co.uk)): `gsc-pages` for impressions, clicks, CTR, position per post; `gsc-keywords` per post for the reader's own queries. Task 7 of this backlog (three Google-rewritten titles) is the first case: handle it in this plan, not separately.
2. Rank posts: high impressions and low CTR first (positions 1 to 10 where a better title can win clicks), then posts at positions 11 to 20 with high impressions. Skip posts with almost no impressions; leave them for a later pass.
3. For each post, the agent reads the post, checks the focus keyword and neighbours (no cannibalisation), and writes 3 ranked title proposals (H1 and meta title, 60 characters at most), with the query that justifies each. Check the title against `01-style-guide.md` section 5 (Chicago Title Case, hyphen, under 60).
4. Proposals go into one review table (`docs/titles-ctr-review.md`, created at step 3, not before). Nothing ships before review.
5. Apply in small batches of 10 posts, as DRAFT through AISA (or the vibecode data layer once live), then re-run the QA checklist.
6. Re-measure after 4 weeks in Search Console: CTR per post against its baseline, keeping position stable.

**Order.** (a) Top 10 posts by impressions with CTR below the site median. (b) Next 10 by the same rule. (c) Remaining posts with 100+ impressions over 90 days. (d) Everything else only if Mike asks.

**Done when.** Every post in (a) to (c) has an approved title, applied, built and checked; no title over 60 characters, no forbidden wording (`node scripts/style-lint.mjs` equivalent in this repo is the QA checklist in `05-templates-and-checklists.md`); a baseline and a 4-week CTR table are filed; the agent's facts block is updated.

**Who reviews.** Victoria for the first pass with the QA checklist (`05-templates-and-checklists.md`), then Mike approves. Mike decides cases where the angle changes. Branch then pull request for Mike; never push to `main`; content stays DRAFT until Mike approves.

**Open points.**
1. Emoji: settled by Mike on 2 Nov 2026, no emoji in any title (H1 and meta title); existing ones go when the title is rewritten. The excerpt keeps its one emoji.
2. Do titles change on WordPress now, or only once the vibecode build is live? Options: (a) on WordPress via AISA as drafts (recommended, CTR gains start sooner), (b) wait for the build, (c) both, with a redirect-free title change only.
