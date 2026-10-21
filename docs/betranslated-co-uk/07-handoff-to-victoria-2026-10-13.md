# betranslated.co.uk: handoff to Victoria

Written 13 October 2026. Covers 13 October 2026 to about 13 January 2027.
Owner of the site and approver of anything that changes URLs or publishes content: Mike (Michael Bastin).
You are in charge of day-to-day work on the .co.uk site for the next three months.

This document replaces nothing. Read it after `CLAUDE.md`, `00-handoff.md` and `01-style-guide.md`. The earlier docs describe the project, this one describes where it stands today and what to do next.

## 1. Read this first

1. The live site is healthy. No heading markup is broken, no page has template code showing, every internal link answers 200, and the six old 404 URLs redirect.
2. About three quarters of the sentence-case heading clean-up is done. The rest is blocked by one shared Divi layout (section 4, item 1).
3. A bulk edit on 8 October broke 37 pages for a few hours. It was repaired the same day. The cause is a quirk in the WordPress editing tool, and you must follow the safe method in section 6 before any edit.
4. Rankings and traffic have fallen. The cause is not found yet. Section 4, items 14 to 16, say what you need to pull.
5. Do not publish new content without Mike's approval. Edits to existing pages that follow the style guide are fine.

## 2. State of the site on 13 October 2026

| Check | Result |
|---|---|
| Pages in the sitemap | 171 HTML pages (66 posts, 105 pages) plus one KML |
| Broken heading markup | 0 pages |
| Template code visible on a page | 0 pages |
| Internal links returning 404 | 0 |
| Old 404 URLs (six) | all redirect, one hop |
| `/Good` stray URL | redirects to `/blog/vital-keyboard-shortcuts-translators/` |
| Rank Math redirect rules | about 100 active, no destination on `http://` or non-www |
| Footer privacy link | `https://betranslated.com/privacy/` |
| Hosting | Hostinger CDN, no page cache, homepage takes 4.7 to 6.2 seconds |
| Google Search Console, last 16 months | impressions fell from about 190,000 a month (August 2025) to about 28,000 (September 2026), clicks held at 120 to 230 a month |
| Ahrefs Site Audit (5 October) | health 98, 18 URLs with errors, 294 with warnings, 809 URLs crawled |

Style scan on 13 October (script in `tools/seo/style.py`, rough tests, treat as a guide):

| Rule | Pages flagged |
|---|---|
| Em or en dash in the body | 54 |
| Sentence opens with "By" plus a gerund | 34 |
| American spelling in visible text | 16 |
| Numbered headings | 8 |
| `<hr>` or `<section>` tags | 3 |
| "Twitter" | 2 |
| "this guide" | 2 |
| Title Case headings (three or more words) | 118, many are proper nouns or the shared service block, so triage before editing |

## 3. What happened between 6 and 13 October

| Area | What was done | Evidence |
|---|---|---|
| Audit | Crawled all 172 sitemap URLs, read Ahrefs and Search Console exports | `reports/seo-audit-2026-10-06.md` |
| Redirects | Fixed 193 rules that pointed at `http://betranslated.co.uk`. Deactivated 44 rules whose destinations return 404. Repointed the quote rule to the `.com` quote page. Added six 301s for the old 404s and `/Good` | Rank Math, Redirections |
| Quote links | All quote links now go to `https://betranslated.com/translation-quote/?utm_source=betranslated-couk` | live site |
| Builder URLs | Removed `?et_fb=1&PageSpeed=off` from 16 internal links on 8 pages | live site |
| French cluster | New titles and descriptions on the parent and four sub-pages, focus keywords on three, FAQ section plus FAQPage schema on the parent, internal links to all seven sub-pages | `reports/french-translation-page-2026-10-06.md` |
| Dead links | Unlinked 12 dead external links (visible text kept) | `reports/link-audit-2026-10-08.md` |
| Fact-check | Belfast and Korean business pages corrected and linked to NISRA and GOV.UK | pages 23949255 and 23946838 |
| Six priority pages | Fixed style breaches on chatbots, contract, French legal, German business, Korean business and Belfast | `reports/six-page-audit-2026-10-08.md` |
| Headings | 373 of 485 mechanical heading edits applied, 37 pages repaired after the incident | `reports/heading-casing-proposal-2026-10-08.csv` (status column, as of 8 October) |

## 4. What is not finished

Ordered by what I would do first. "Approval" means ask Mike before you do it.

| # | Item | Why it is open | How to finish it |
|---|---|---|---|
| 1 | Shared service block still in Title Case on 12 pages (homepage, medical, industry, customers, rates, turnaround, technical, IT-telecom, marketing, business, translation-services, document-translation) | The headings live in one Divi layout, "Our Service_new" (post ID 275983). Editing a page copy changes nothing. My edit to the layout was blocked by the permission system | Edit the layout once, in Divi Library or through `replace_in_post` on 275983. Eight headings: Professional translation services, Website translation services, Business & finance translation services, High tech & IT translation services, Industry & construction translation services, Marketing & sales translation services, Travel & tourism translation services, Legal translation services. Then check one page. "Translation of Professional Documents" is not a heading in that layout, find where it lives |
| 2 | Three headings on two pages | The lookups were blocked, so I never saw their markup. Marketing: "Marketing Translation Services Need the Right Style" and "Professional Translation Services for Commercial Documents: Ensuring Readability and Cultural Sensitivity". Document translation: "Professional Document Translation Solutions" | Find each heading, replace the whole element in sentence case |
| 3 | Rows in the CSV that did not match a live heading | The proposal text was wrong or the heading is built differently | `/industry/legal/` "Accurate Legal Translation Services", `/translation-services/` "Why Choose Our Translation Agency?", `/industry/` "Trust BeTranslated's Language Experts...", German e-commerce "Our Consumer and Retail Translation Service in German". Look at each page in Divi |
| 4 | 83 flagged headings | Need a human decision | Recommendations: leave TV, film and Belgian university titles as they are, sentence-case the visa, CV, VPN, advertising and optical headings (and "licence" not "license"), replace en dashes in the travel headings with colons, remove numbering on the M&A and patents headings, leave homepage blog-card titles (they mirror post titles). Approval |
| 5 | Two-word Title Case headings | The scan only flags three or more words | Examples: "Document Translations", "Legal Proceedings", "Industry Expertise". Sweep with the same method |
| 6 | Broken image on `/industry/` | I did not remove it | `wp-content/uploads/2023/09/specialised-translation.jpg` returns 404. Replace or remove in Divi |
| 7 | Unsourced figures after the dead links were removed | The links were the only source | Sunderland "over 500,000 residents speaking no English" (looks wrong, Sunderland has about 275,000 residents), Bath "over 110,000", Leicester "over 350,000" and "50% minority backgrounds", Manchester "sector valued over £5 billion", Leeds "contributing over £1.3 billion", Korean technical page "25% of South Korea's workforce". Find an ONS, NISRA, council or GOV.UK source, add the link or remove the claim |
| 8 | Unverified external links | They did not answer from the audit machine | StartupDonut (press-release post), Chatbots Magazine (chatbots post), Asia Fund Managers (Korean financial), Erudera (note-taking-interpreting). 31 more returned 403 (Forbes, Adobe, FT, Upwork and so on) which is bot-blocking, check a sample in a browser |
| 9 | Outbound links to industry sites | Style rule says none | `upwork.com`, `guru.com`, `reverso.net`, `lokalise.com` and its docs. The other 400 or so external links have not been reviewed domain by domain. Approval for each removal |
| 10 | Remaining style breaches | See section 2 | Dashes: many are en-dash bullets in "Related pages: – Korean Legal Translation Services" lists on the Korean and Spanish language pages, a template fix. "By" openers, American spellings and numbered headings are listed per page in `reports/site-style-audit-2026-10-08.csv` (re-run the scan for current data) |
| 11 | Meta descriptions | 38 pages were under 130 characters on 8 October. I fixed about ten | Re-run the scan, fix the rest with a call to action, 130 to 160 characters |
| 12 | Freshness | Not started beyond the chatbots post | The chatbots post (2018) needs a full rewrite. About 72 pages cite 2024 or earlier as their latest year (counted on 8 October, it includes displayed post dates). 20 posts were published between 2016 and 2019 and 11 in 2020. Build a refresh queue ranked by Search Console clicks |
| 13 | Schema | Only one FAQPage on the site | The playbook asks for five FAQs on every service page. Repeat the French parent pattern on the German, Spanish, Korean and main service pages. Check the Product plus AggregateRating markup on about 35 service pages against Google's review rules. The seven schema errors and four missing alt texts from May are still unidentified, re-run Ahrefs |
| 14 | Why rankings fell | Diagnosis is incomplete | Search Console shows commercial queries sit on pages 3 to 6 and traffic comes from blogs. Pull from Ahrefs: UK organic keywords with URL and position for today and 6 April, top pages, referring domains and lost backlinks. Also look at "french translation" (lost) and "international advertising" (lost) |
| 15 | Site speed | Not started | Turn on server-side page caching (LiteSpeed Cache or the Hostinger cache manager). Find what sends `Cache-Control: no-store` (security plugin, Formidable User Flow or a session cookie). Remove Broken Link Checker, trim Simple History. In Divi enable static CSS and dynamic assets. Run Imagify next-gen generation. Re-test with PageSpeed |
| 16 | Tool access | Two data sources are offline | Connect Google Search Console in AISA, Settings. The Ahrefs API had 28 units left on 6 October, check the plan resets. PageSpeed through AISA hit a daily quota |
| 17 | Ahrefs crawl scope | Unexplained | Ahrefs crawled 809 URLs, the sitemap lists 172. Find the other 637 (parameters, attachments, tags, redirects) |
| 18 | Repository | Not committed | The `reports/` folder and `tools/` folder are in the pull request that carries this document. Pull request 1 (the original handoff) is still open. `main` is an empty root commit |
| 19 | Security | Unconfirmed | Check that the WordPress Application Password pasted into a chat on 26 May 2026 was revoked (Users, Profile, Application Passwords) |
| 20 | Vibecode migration | Not started | `04-vibecode-migration.md`. Do not start before Mike gives the go-ahead |

## 5. Decisions waiting for Mike

1. Allow `replace_in_post` on layout 275983, or do item 1 yourself in Divi.
2. Which of the 83 flagged headings to change (recommendations in item 4).
3. Which outbound industry links to remove (item 9).
4. Whether to rewrite or retire the 2018 chatbots post.
5. The order for the freshness queue.
6. Go-ahead for the vibecode migration.

## 6. How to work safely

### The editing tool

- Connector: AISA (MCP server). The site is registered. Pass a `chat_id` on every call.
- `replace_in_post` can store a stray `>` or `</` as `&gt;` or `&lt;` when your replacement is not a complete element. This silently destroys headings.
- Safe method: find and replace the whole element, from `<h3 class="wp-block-heading">` to `</h3>`, with nothing left outside it. Never start or end a find with a bare `>`.
- After the first edit on any page, check the raw content with `find_in_post` for `&gt;` and `&lt;`, and load the live page. Do not run a batch until one page is verified.
- Repair method that worked: find the exact damaged element (including `&gt;`) and replace it with the correct complete element.
- `tools/seo/chk.py` scans live pages for this damage. Run it after every batch.

### Divi specifics

- Repeated sections use global modules. The page copy is ignored, edit the layout post. Known ones: 275983 "Our Service_new" (service cards), 275749 "New_quote" (button grid), 275916 "Contact_process" (quote section).
- Never link to a URL with `?et_fb=1` in it. That is the visual builder.
- Headings are either `<h2>` in a text module or `<h2 class="wp-block-heading">` in a block. Some are blurb `title="..."` attributes. A search shows one match per line, so a long line can hide several headings.

### Redirects and metadata

- Rank Math Redirections. Use `manage_redirect` and `list_redirects` when available, or the admin screen. Always one hop, 301, destination on `https://www.betranslated.co.uk`.
- Titles and descriptions: `set_seo`. Schema: `set_meta` with key `rank_math_schema_FAQPage`. Do not use a Divi code module for JSON-LD, the script tags are stripped and the JSON shows on the page.
- Raw SQL writes (`db_write`) need an approval click in wp-admin, AISA, Approvals. The permission system may block them.

### Style rules, short version

British English, no em or en dashes, second person. Meta title under 60 characters, Chicago Title Case, hyphen separator. Meta description 130 to 160 characters with a call to action. H2 to H6 in sentence case with proper nouns kept (BeTranslated, UK, languages, cities). No numbered headings. No "break language barriers", "this guide" or "The Importance of" in headings. Internal links only to URLs that return 200. No outbound links to competing or industry sites. Content stays in draft until Mike approves. Full rules: `01-style-guide.md`.

### Verification every time

1. Read before write, note the old value.
2. One edit, then read back raw content.
3. Load the live page with a cache-busting parameter.
4. Run `tools/seo/chk.py` on the pages you touched.
5. Write what changed in `reports/`.

## 7. Twelve-week plan

| Weeks | Focus | Output |
|---|---|---|
| 1 | Items 1, 2, 3, 6. Connect Search Console. Confirm the Application Password is revoked | Heading clean-up finished, image fixed |
| 2 | Items 7, 8, 9. Source or remove unsourced figures, check links, review outbound links with Mike | Link and fact report |
| 3 | Item 15 speed work and item 17 crawl scope. Item 14 data pulls | Speed baseline and after, ranking diagnosis |
| 4 (about 3 November) | Re-measure the French cluster in Search Console against 6 October. Decide item 4 and 10 with Mike | French cluster report |
| 5 to 6 | Items 10 and 11. Fix dashes, "By" openers, American spellings, numbered headings, short descriptions | Style scan down to near zero |
| 7 to 8 | Item 13 schema. FAQ sections on the main service and language parent pages | FAQPage on ten or more pages, schema errors cleared |
| 9 to 10 | Item 12 freshness. Rewrite the chatbots post, refresh the top ten pages by clicks | Drafts for Mike |
| 11 | Re-run the full audit (`tools/seo/`), compare with 6 October | Audit report |
| 12 | Handover note, decide on the vibecode migration timing with Mike | Updated `06-backlog.md` |

Quarterly audit procedure and the striking-distance workflow are in `02-seo-playbook.md`.

## 8. Measure these

| Metric | Baseline | Where |
|---|---|---|
| UK impressions, clicks, average position, last 16 months | 28,148 impressions in September 2026, 168 clicks, average position 26 | Search Console |
| French cluster: "french translation services" | 5,281 impressions at position 31 over 16 months, page at 35.6 | Search Console |
| Homepage load time | 4.7 to 6.2 seconds | PageSpeed or a browser |
| Ahrefs health | 98 | Site Audit project 1813246 |
| Tracked UK keywords | 22 on 6 October (64 on 6 April) | Ahrefs Rank Tracker |
| Style scan counts | section 2 | `tools/seo/style.py` |

## 9. Files and tools

| What | Where |
|---|---|
| Project instructions | `CLAUDE.md`, `.claude/agents/` (ten specialist agents) |
| Audit reports | `reports/` |
| Heading proposal and status | `reports/heading-casing-proposal-2026-10-08.csv` |
| Per-page style table | `reports/site-style-audit-2026-10-08.csv` |
| Scripts | `tools/seo/crawl.py` (sitemap crawl), `style.py` (style scan), `linkaudit.py` (all links and images), `chk.py` (damage and leak check) |
| Search Console export | the 6 October zip in Mike's Downloads |
| Ahrefs project | 1813246 |
| Sibling repositories | listed in `00-handoff.md`, section 7 |

The scripts write JSON next to themselves and expect Python 3. They only read the live site.

## 10. Access and security

- Never put passwords, tokens or Application Passwords in files, commits or chat. Use the connector authorisation links.
- AISA is registered for betranslated.co.uk. WPVibe is a fallback and was blocked for this site.
- The permission system sometimes blocks writes to shared resources. Do not retry the same call a different way, stop and ask Mike.

## 11. Known risks

| Risk | What to do |
|---|---|
| Another bulk edit damages markup | Follow section 6, verify the first page before the batch |
| An edit to a global module affects a dozen pages | Check which pages use the layout before you save |
| Removing a link leaves an unsourced claim | Find a source or remove the sentence |
| Ranking fall continues | Do items 14 and 15 early, they are the biggest unknowns |
| Content changes by others during the project | Re-run the scan before relying on numbers in this document |
