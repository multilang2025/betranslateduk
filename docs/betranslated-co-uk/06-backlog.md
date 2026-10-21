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
