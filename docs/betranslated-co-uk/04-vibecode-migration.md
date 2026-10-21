# betranslated.co.uk: WordPress to vibecode migration

## 1. Context

betranslated.co.uk is WordPress today. It will be converted into a vibecode version, as already done for betranslated.com and in progress for betranslated.es.

Details of the vibecode stack were not captured in the Chat sessions this handoff was built from. Do not assume them. The first task of the migrator agent is to read the reference repos and write down the real stack here.

## 2. Step zero: learn from the sibling repos

Check these under `github.com/multilang2025` (see `00-handoff.md`, section 7):
- `betranslateduk`: may already contain UK site code. Read it before anything else.
- `BTvibe-es` and `btes`: the .es vibecode build, the closest template.
- `BT-Digital`: active today, possibly the .com build or shared base. Verify.
- `betranslatedbe`, `betranslatedfr`, `betranslatednl`, `betranslatedDE`: regional siblings.
- `dlvibe`, `dlvibe-cms`: other vibecode plus CMS patterns.

Fill in this table from what you find:

| Item | Finding (fill in) |
|---|---|
| Framework and version | |
| Styling approach and design tokens | |
| Content source (files, CMS, Supabase) | |
| Hosting and deploy (Vercel project, branch strategy) | |
| Metadata and SEO component | |
| JSON-LD component(s) | |
| Sitemap and robots generation | |
| Redirect mechanism and where the map lives | |
| i18n and hreflang approach | |
| Forms and quote request flow | |
| Analytics and consent | |
| Image handling | |
| Build, lint and test commands | |
| What the .com migration got wrong or had to fix | |

## 3. Migration principles

1. **No ranking loss.** Every indexed URL either keeps its path or gets a single-hop 301.
2. **Content parity first, redesign second.** Move the content as it is, with the quick wins already applied, then iterate.
3. **One source of truth for SEO fields.** Titles, descriptions, canonicals and schema live in code or content files, not hand-edited in the UI.
4. **Style guide enforced at build time** where possible (lint for em dashes, banned phrases, title length, description length).
5. **Preview before cutover.** Never point the production domain at the new build until the checklist below is green.
6. **Keep WordPress available** (read-only or staging) until 30 days after cutover as a rollback and reference.

## 4. Inventory (do before building)

1. Export all published URLs from `https://www.betranslated.co.uk/sitemap_index.xml` and its sub-sitemaps (809 URLs were crawled by Ahrefs, which includes non-indexable ones).
2. For each page capture: URL, post type, title, meta title, meta description, excerpt, focus keyword, H1, canonical, hreflang, indexability, last modified, word count, internal links out, images with alt text, schema present.
3. Pull current organic performance (GSC or Ahrefs) to rank pages by value. Top pages get a manual visual and content review after migration.
4. Capture all existing redirects (Rank Math Redirections, host rules, `.htaccess`).
5. Mark pages to drop, merge or leave: 2018 to 2023 drafts are not published and stay out of the build.
6. Capture Divi layouts that carry meaning (CTA boxes, FAQ accordions, blockquotes, forms) so they can be rebuilt as components.

Store the inventory as `data/inventory.csv` in the new repo.

## 5. Things Rank Math did that the build must now do

| Rank Math behaviour | Vibecode requirement |
|---|---|
| Title and meta description per page | Metadata component fed from content front matter |
| Canonical URLs | Self-referencing canonical on every page |
| Open Graph and X card tags | Generated from the same fields (use "X", not "Twitter", in labels) |
| Article, Organization, WebPage, BreadcrumbList JSON-LD | Emit exactly once each. BreadcrumbList `position` as strings. |
| FAQs (visible content) | FAQ component renders the dropdown only. No FAQPage JSON-LD (hard rule, 21 October 2026) |
| Product schema | Only where requested. Must include price and image. |
| XML sitemap | Generated at build, 200 indexable URLs only |
| Redirections module | Redirect map in config, tested in CI |
| Image alt checks | Build fails if a content image has no alt |

Do not output Organization or WebPage schema twice (once in a layout, once in a page). Validate in the Rich Results Test.

## 6. The six known 404s and the migration

The six commercial pages returning 404 (May 2026) must be fixed before or during migration. Targets confirmed by Mike:
- `/industry/marketing/`
- `/translation-services/website-translation/`
- `/translation-services/remote-interpreting/`
- `/blog/seo-translation/`
- Cross-domain to the .com Norwegian page
- Cross-domain to the .com Russian page

Re-pull the old URLs from Ahrefs (project 1813246), pair them with these targets, ask Mike to confirm uncertain pairs, then put them in the redirect map.

## 7. Cutover checklist

- [ ] Every inventory URL resolves 200 or a single-hop 301 on the preview build.
- [ ] No redirect chains or loops (script check).
- [ ] Titles under 60 characters, descriptions 130 to 160, one H1 per page.
- [ ] Canonicals correct. No `noindex` on indexable pages. Preview deploy is `noindex`, production is not.
- [ ] Sitemap and robots correct and submitted to GSC after cutover.
- [ ] Schema validates, no duplicates.
- [ ] Hreflang consistent with .com, .es and .fr siblings (skill: `hreflang-audit`).
- [ ] Forms deliver to the right inbox and a test lead arrives.
- [ ] Analytics and consent work.
- [ ] Core Web Vitals at or better than WordPress.
- [ ] Style guide lint passes (British English, no em or en dashes).
- [ ] Mike has reviewed the top 20 pages visually.
- [ ] DNS TTL lowered 24 hours before cutover. Rollback plan written.
- [ ] Post-cutover: Ahrefs re-crawl, GSC coverage and 404 monitoring daily for two weeks.

## 8. Phasing

1. Discovery and stack documentation (step zero, inventory).
2. Scaffold from the closest sibling repo. Design tokens from `brand-guidelines-betranslated`.
3. Migrate templates: service, industry, location, blog, home, contact and quote.
4. Migrate content in batches, running the QA agent on each batch.
5. Redirects, sitemap, schema, hreflang.
6. Staging review with Mike.
7. Cutover and monitoring.

Ask Mike before choosing any option that changes URLs.
