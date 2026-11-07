---
description: Edit a live betranslated.co.uk WordPress page through AISA with the safe method that avoids the 8 Oct 2026 breakage.
argument-hint: <page and edit>
---

A bulk edit on 8 Oct 2026 broke 37 pages for hours: `replace_in_post` stores a stray `>` or `</` as `&gt;` or `&lt;` when the replacement is not a complete element.

1. Pass a `chat_id` on every AISA call. Snapshot the old value first (read before write).
2. Find and replace the whole element, from `<h3 class="wp-block-heading">` to `</h3>`, with nothing left outside it. Never start or end a find with a bare `>`.
3. Divi global modules (for example 275983 'Our Service_new', 275749 'New_quote', 275916 'Contact_process') ignore the page copy: edit the layout post. Never link a URL containing `?et_fb=1`.
4. After the FIRST edit on a page: `find_in_post` for `&gt;` and `&lt;`, and load the live page. No batch until one page is verified.
5. After every batch run `python3 tools/seo/chk.py`. Titles and descriptions through `set_seo`; schema through `set_meta`, never a Divi code module.
6. Raw SQL (`db_write`) needs an approval click in wp-admin (AISA, Approvals).

Work on a branch, never `main`; open a PR only when asked; content stays DRAFT until Mike approves; no commit unless asked. Report: done / not verified (and why) / left for Mike.
