# Blog audit: actions taken (22 October 2026)

Answers from Mike in the blog audit artifact: 27 refresh, 15 merge, 10 retire, 14 keep (66 posts).
Four posts moved from the recommended "retire" to "refresh" by Mike: advantages-gifted-bilingual-kids, top-spots-location-independent-professional, learn-english-idioms, reach-new-heights-with-startup-business.

## Merge and retire (25 posts)
- Each post moved to `scripts/btvibe-uk/output/retired-posts/` (content kept) and out of the sitemap.
- Permanent redirects in `data/blog-redirects.json`, read by `next.config.mjs` (Next sends 308, which Google treats like 301).
- Internal links: 268 links in 94 files rewritten to the target (merge) or unlinked (retire). Re-runnable: `node scripts/btvibe-uk/style/retire-posts.js [--write]`, rules in `retire-posts.txt`.
- Merged into a refreshed post and folded in: get-high-quality-translations (into differents-types), professional-translator-translation-app (into professional-translation), multilingual-chatbots (into why-choose-betranslated-and-not-ai), boost-reach-video-subtitling and dubbing-english-language-content (into movie-dubbing).
- Redirect only, not folded in (target is kept as is): benefits-multilingual-people-for-companies (to lazy-monolingual-english-speakers).

## Refresh (27 posts)
Rewritten around each post's own Search Console queries, five FAQs each, new title, meta description and focus keyword. Every post passed `scripts/btvibe-uk/style/apply-refresh.js` (dashes, lengths, FAQs, live links only, wrapper and images unchanged, no consecutive question H2s). All stay drafts for Mike's review.

## To confirm before publishing
- ISO 17100 requirements (professional-translation): ISO page not reachable, rests on secondary sources.
- Business.gov.uk commercial invoice point (logistics): page not fetched, rests on search summaries.
- "Over 20 years" and "founded in 2002": removed from seo-translation and insurance-translation-services because unverifiable. Restore if Mike stands behind them.
- "Every project is reviewed before delivery" (tips-for-b2b-translation) and similar process claims carried over from the old copy.
- ICO wording in why-choose-betranslated-and-not-ai: paraphrased, no dated ICO page retrieved.
- UK GDPR special category point (multilingual-healthcare-system): from general knowledge, no source fetched.
- top-spots-location-independent-professional was rebuilt around UK tax residence and remote-work visas. Colombia, Spain, Portugal and Malaysia visa rules not checked against primary sources.
- translation-schools-belgium: several 2017 claims removed as unverifiable. University pages returned 503, so some entries rest on search results.
- translations-universities-uk-ireland: only confirmed courses kept, linked to official course pages. Queen's Belfast, Surrey and London Met entries rest on listings.
- environmental-translation-services: BeTranslated oil and gas capability not confirmed (FAQ is hedged). Two decorative inline images dropped on purpose.
- Keyboard shortcuts post: two wrong shortcuts corrected (Ctrl+F2, Ctrl+Alt+PrtScn). Alt+Shift as language switch is not on Microsoft's page.

## Not done
- Keep posts (14) untouched. Latest-year facts on "keep" posts were not reviewed.
- Post 22 (lazy-monolingual) did not receive the merged content of post 24.
