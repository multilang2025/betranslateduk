---
description: Regenerate data/blog-updated.json, the "Updated" date shown on each betranslated.co.uk blog post, after post edits.
---

# /blog-dates

The date is the later of WordPress `dateModified` (from the post's schema) and the last git commit touching the post's file in `scripts/btvibe-uk/output/posts/`.

1. Confirm the edits are committed; the date reads git history, so uncommitted edits do not move it. Say so if the tree is dirty.
2. `node scripts/blog-updated-dates.mjs` (writes `data/blog-updated.json`).
3. `git diff --stat data/blog-updated.json` and list slugs whose date changed. A mechanical pass (links, formatting) should not look like a real update: flag any post changed only that way.
4. Leave 2018 to 2023 era draft posts untouched.

Never commit or push unless asked. Report: slugs changed / not verified / left for Mike.
