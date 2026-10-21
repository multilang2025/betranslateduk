# SEO audit scripts

Read-only scripts for betranslated.co.uk. They fetch the live site and write JSON files into the folder you run them from. Python 3, standard library only.

Run them in this order from one working folder:

| Script | What it does | Output |
|---|---|---|
| `crawl.py` | Reads the three sitemaps, fetches every URL, records status, title, description, H1 count, canonical, robots, image alt and schema types | `crawl.json` |
| `style.py` | Needs `crawl.json`. Fetches every page and tests the style guide: dashes, "By" openers, American spelling, numbered and Title Case headings, banned phrases, dated years | `style.json` |
| `linkaudit.py` | Fetches every page, collects all links and images, tests each target. External links that block scripts show as 403 | `linkaudit.json` |
| `chk.py` | Checks pages for broken heading markup (`&gt;` or `&lt;` inside headings) and visible template code. Pass paths without a leading slash, for example `chk.py translation-services/england/leeds/` | printed |

Notes:

- Title Case detection is a rough test (three or more words, most words after the first capitalised). Proper nouns trigger it, so triage before editing.
- Run `chk.py` after every batch of edits.
- These scripts only read. They never write to the site.
