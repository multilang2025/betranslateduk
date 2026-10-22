# Retired URLs and 301 log

Every page or post we retire goes in `data/retired-urls.json` with the URL it redirects to.
The redirects are permanent and are built into the site (`next.config.mjs`), so they start working the moment the new site is live.

## How to log a retirement

Add a row to `entries` in `data/retired-urls.json`:

```json
{
  "from": "/blog/old-post-slug/",
  "to": "/blog/closest-post/",
  "type": "post",
  "reason": "Why it was retired",
  "retiredOn": "2026-10-22",
  "managed": "manual",
  "status": "pending post-launch check"
}
```

- Use `managed: "manual"` for rows you add: the redirect is added automatically.
- Rows with `managed: "leaf"` are the language sector pages merged into their parent page (`lib/leafPages.js`).
- `to` should be the closest live page, with an anchor when the content moved into a section.

## After launch

Check that every retired URL answers with a permanent redirect to the right place:

```bash
node tools/check-retired-redirects.mjs https://www.betranslated.co.uk
```

## Logged so far (22 October 2026)

36 sector pages merged into their language page.

| Language | Retired pages | Redirect target |
|---|---|---|
| Korean | 9 | `/languages/korean-translation-services/#korean-...` |
| French | 7 | `/languages/french-translation-services/#french-...` |
| German | 9 | `/languages/german-translation-services/#german-...` |
| Spanish | 11 | `/languages/spanish-translation-services/#spanish-...` |

The full list is in `data/retired-urls.json`. No blog posts have been retired yet.
