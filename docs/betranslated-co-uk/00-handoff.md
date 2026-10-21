# betranslated.co.uk: handoff

Prepared 6 October 2026 from the claude.ai Project "BT CO UK", project memory and the Chat sessions of April to May 2026.
Owner: Michael Bastin (Mike), founder of BeTranslated.

## 1. What this project is

betranslated.co.uk is the UK site of BeTranslated, a multilingual translation and interpretation agency (BeTranslated SL in Valencia, BeTranslated International SRL in Belgium).

Business goal: a lead generation engine for high-value UK clients, not traffic volume. Position BeTranslated as an expert provider, never the cheap one.

Audience:
- UK SMEs expanding internationally
- Law firms and legal professionals
- E-commerce and marketing teams
- Corporates needing multilingual communication
- Public sector and institutions
- Secondary: international companies entering the UK market

Core services to rank and convert: Professional Translation Services UK, Legal Translation UK, Certified / Sworn Translation UK, Website Localisation UK, Multilingual SEO Translation.
Support services: interpreting (remote and on-site), technical translation, marketing localisation.

## 2. Current state of the site

- Platform today: WordPress, Divi page builder, Rank Math for SEO metadata.
- Ahrefs Site Audit project ID `1813246`. Last recorded health score 98/100 across 809 URLs (26 May 2026).
- Hosting provider for .co.uk: not confirmed in the Chats. betranslated.es is on Hostinger. Confirm before relying on any cache-purge assumption.
- Planned: convert the site to a vibecode version, following betranslated.com (done) and betranslated.es (in progress). See `04-vibecode-migration.md`.

## 3. Tooling

Two WordPress bridges exist. Use AISA as the primary connector going forward.

| Tool | Role | Status for .co.uk |
|---|---|---|
| AISA connector | Custom MCP bridge plugin giving Claude open-ended control of WordPress: full CRUD on content, media, taxonomy and meta, bulk operations, site config reads. Built so Claude is not limited to a fixed set of pre-coded functions. | The AISA site list seen on 6 Oct 2026 showed 6 sites (api.c21perdomo.com, bemelmanspuiterij.nl, delaguialuzon.com, mikebastin.com, betranslated.ca, txintlfreight.com). betranslated.co.uk was NOT in that list. Registering it is step one. |
| WPVibe (Mikebastin connector, `mcp.wpvibe.ai/mcp`) | Earlier bridge. Worked for .co.uk in April 2026 (OAuth link flow). | Broken since 26 May 2026: .co.uk could not be re-registered because of a plan-tier cap on adding new sites, and betranslated.be/fr was disconnected in the failed attempt. Treat as fallback only. |
| Ahrefs MCP | Site audit, organic keywords, striking-distance queries, 404 discovery. | Working. Project ID 1813246. |
| Semrush, Supermetrics, GSC via Ahrefs | Secondary research and performance data. | Available. |
| Vercel and Supabase MCP | Likely deployment and data layer for the vibecode build. | Confirm stack against betranslated.com before use. |

Technical gotchas are in `03-wordpress-execution.md`. Read it before any write.

## 4. What was done in the Chat sessions

### 20 April 2026: WPVibe connection and meta clean-up (done, live)
Audit of Rank Math titles, descriptions and excerpts across all published pages and posts, then eight ordered quick wins executed on the live site:
1. Nine live typos fixed, including the misspelled brand name "BeTransalted" on the Plymouth page.
2. Missing Rank Math metadata backfilled on seven pages.
3. American spellings replaced by British across all meta fields and excerpts.
4. HTML-encoded ampersands stripped, separators unified to hyphens.
5. Leading and trailing whitespace trimmed from 22 rows.
6. 19 meta titles over 60 characters rewritten. Zero remained afterwards.
7. 20 commercial pages with no excerpt received fresh excerpts.
8. 23 identical meta description / excerpt pairs differentiated.

Follow-up: American -ize spellings replaced inside Divi body content on 15 published pages and posts (via REST PUT, not search-replace). Three duplicate or orphan drafts moved to trash (two Italian Translation Services duplicates, one untitled).

Two blog drafts fully rewritten and left as DRAFT for Mike's review:
- "10 Expressions from The IT Crowd That Baffle Non-Native Speakers"
- "Why Multilingual Websites Win: Localisation, Trust and Growth"

Three Facebook post variants were also written for the IT Crowd article.

### 24 April 2026: blog optimisation workflow
Post `/blog/lazy-monolingual-english-speakers` rewritten: first person to second person, UK named entities layered in (HMRC, Home Office, Companies House, NHS, British Council, APPG for Modern Languages, FCDO, UK cities), target keywords integrated, 800 to 1,200 words, five UK FAQs. Internal links verified against `https://www.betranslated.co.uk/sitemap_index.xml`. Four meta title and description variants were produced with exact character counts. This is the reference workflow now codified in `05-templates-and-checklists.md`.

### 29 April 2026: cultural translation post (betranslated.es, same workflow)
Established the standing rule: no outbound links to competing or industry-adjacent sites. Also produced the Hostinger cache and WPML learnings now in `03-wordpress-execution.md`.

### 26 May 2026: audit and blocked execution
Ahrefs audit findings (not yet fixed on the site):
- Six commercial service pages return 404 while internal links still point to them.
- Five striking-distance keywords at positions 4 to 20, including "international advertising", "translator vs interpreter" and "british characters".
- Three page titles rewritten by Google.
- On-page housekeeping: one duplicate H1, two meta descriptions needing length correction, four images missing alt text, seven schema validation errors.

Mike confirmed the redirect targets for the six 404s:
- `/industry/marketing/`
- `/translation-services/website-translation/`
- `/translation-services/remote-interpreting/`
- `/blog/seo-translation/`
- Two cross-domain redirects to the .com Norwegian and Russian language pages

The mapping of each old URL to its target was not preserved in the Chats. Re-pull the six 4xx URLs from Ahrefs (`site-audit-page-explorer`, project 1813246) and match them to the targets above. Ask Mike to confirm any ambiguous pair.

Execution was blocked by the WPVibe plan cap (see section 3). Nothing from this audit has been applied.

## 5. Open items (priority order)

See `06-backlog.md` for the full list with acceptance criteria. Headlines:
1. Register betranslated.co.uk in AISA and prove a read, then a write on a draft.
2. Apply the six 301 redirects.
3. Apply on-page housekeeping (duplicate H1, two meta descriptions, four alt texts, seven schema errors).
4. Review and publish the two draft blog posts.
5. Rewrite the three titles Google is rewriting.
6. Target the five striking-distance keywords.
7. Plan and run the vibecode migration, with redirects and schema carried over.

## 6. Security note

During the 26 May session a WordPress Application Password for the account mike@betranslated.com was pasted into the chat. Mike said he would revoke it. Confirm it has been revoked in wp-admin (Users, Profile, Application Passwords). Never write credentials into this repo, into agent files or into commit messages. Use the connector's own authorisation flow.

## 7. Where things live

### Other BeTranslated repositories (check them for further information)

Several BeTranslated repos exist under the GitHub organisation `multilang2025`. Before starting any task, Claude Code must look in the relevant ones for existing conventions, components, redirect maps, content, schema code and past decisions. Do not reinvent what a sibling repo already solved. Treat sibling repos as read-only references unless Mike asks for a change there.

| Repo | Visibility | Likely relevance (verify by reading it) |
|---|---|---|
| `multilang2025/betranslateduk` | public | Probably the UK site code or an earlier start of it. Check first, last push 20 Jul 2026. |
| `multilang2025/BTvibe-es` | private | The vibecode build of betranslated.es, active (pushed 6 Oct 2026). Closest template for the UK migration. |
| `multilang2025/btes` | public | Spanish site repo. Compare with BTvibe-es. |
| `multilang2025/BT-Digital` | private | Active today (6 Oct 2026). Possibly the betranslated.com vibecode or a shared base. Verify. |
| `multilang2025/BT-Tools` | private | Internal tools, `.claude/skills`, intern boards and onboarding. |
| `multilang2025/betranslatedbe`, `betranslatedfr`, `betranslatednl`, `betranslatedDE` | private | Regional sibling sites. Useful for shared components, hreflang and translation structure. |
| `multilang2025/dlvibe`, `dlvibe-cms`, `dlcom`, `dlfr` | mixed | Other vibecode builds with a CMS layer. Useful patterns for headless content and deployment. |

Other repos in the organisation (txintlfreight, ValenciaMove, mikebastin, MatoSurf and similar) belong to other properties. Only look there for reusable patterns.

How to check: `gh repo view`, `gh repo clone`, then read `README`, `CLAUDE.md`, `.claude/`, `docs/`, the redirect and sitemap config, the schema components and the content directories. Record anything useful in `docs/betranslated-co-uk/` rather than relying on memory.

### Other resources

- Private repo: `github.com/multilang2025/BT-Tools` (internal tools, `.claude/skills`, intern boards).
- Brand skills available in Claude: `brand-guidelines-betranslated`, `canvas-design-betranslated`.
- Other skills worth loading: `seo-onpage`, `seo-technical`, `hreflang-audit`, `gsc-seo-optimizer`, `wp-bulk-content-deploy`, `wp-cli-remote`, `wpvibe-mcp`, `divi-json`.
- Intern Victoria (from September 2026) handles copy editing and social media tasks. The QA agent and checklists are written so she can run them.
