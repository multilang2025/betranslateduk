---
description: Retire a page or post on betranslated.co.uk with a 301 logged in data/retired-urls.json. Use for cannibalising or obsolete URLs.
argument-hint: <old path> <target path>
---

# /retire-page $ARGUMENTS

Read `docs/betranslated-co-uk/01-style-guide.md` first. Work on a branch; never push to `main`; content stays draft until Mike approves; no commit unless I ask.

1. Show why (GSC/Ahrefs project 1813246) and the closest live target. Verify the target is live in the sitemap and is not itself retired.
2. Add a row to `entries` in `data/retired-urls.json` (`from`, `to`, `type`, `reason`, `retiredOn`, `managed: "manual"`, `status`). See `docs/retired-urls.md`. `managed: "leaf"` rows come from `lib/leafP*`, do not duplicate them.
3. Fold useful content into the target first; keep every external link.
4. Fix internal links to the old URL (British English, no dashes in anything you write).
5. Local build: old URL gives one 301 to the target, target 200, absent from sitemap.

Report: row added, content moved, not verified, open for me.
