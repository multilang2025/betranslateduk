# betranslated.co.uk: WordPress execution runbook

Applies while the site is still WordPress. Read fully before any write.

## 1. Connector order of preference

1. **AISA connector** (primary). Custom MCP bridge plugin. Endpoint pattern: `betranslated.us/php-mcp-bridge/mcp.php`. Intended scope: the same open-ended control as WPVibe, so Claude can execute whatever is asked, not just pre-coded functions: full CRUD on content, media, taxonomy and meta, bulk operations, site config reads.
2. WPVibe (`mcp.wpvibe.ai/mcp`, Mikebastin connector). Fallback only, currently blocked for .co.uk by a plan-tier cap.
3. Direct REST with an Application Password, only when the sandbox network allowlist permits the host. In the May session the sandbox could not reach betranslated.co.uk directly.

### AISA tools (as listed on 6 Oct 2026)

| Purpose | Tools |
|---|---|
| Site handling | `list_sites`, `get_current_site`, `switch_site`, `connect_site`, `check_approval_status` |
| Read content | `search_posts`, `get_post`, `find_in_post`, `get_page_html`, `get_schema` |
| Write content | `create_post`, `update_post`, `append_to_post`, `replace_in_post`, `bulk_replace_in_posts`, `publish_post` |
| SEO fields | `get_seo`, `set_seo`, `set_meta` |
| Media | `upload_media`, `search_images`, `generate_image` |
| Low level | `wp_cli_get`, `wp_cli_set`, `db_query`, `db_write`, `run_ability`, `discover_abilities` |
| Operations | `flush_caches`, `run_site_checkup`, `fact_check`, `load_skill` |
| Theme | `create_draft_theme`, `list_theme_files`, `read_theme_file`, `search_theme_files`, `write_theme_file`, `get_theme_preview_url`, `publish_draft_theme`, `delete_draft_theme` |
| Analytics | `gsc_list_properties`, `gsc_top_pages`, `gsc_page_report`, `gsc_page_queries`, `ga_list_properties`, `ga_top_pages`, `ga_traffic_overview`, `ahrefs_domain_metrics`, `ahrefs_top_pages`, `ahrefs_organic_competitors`, `seo_competitor_report` |

Tool behaviour must be confirmed on first use: parameter names, whether `set_seo` writes Rank Math keys, and whether `db_write` requires a confirmation flag. Record findings in this file.

### Registering betranslated.co.uk in AISA
1. `list_sites` and confirm `https://www.betranslated.co.uk` is absent.
2. `connect_site` with `https://www.betranslated.co.uk` and follow the authorisation flow it returns. Do not paste or store passwords in chat or repo.
3. `check_approval_status`, then `switch_site`, then `get_current_site` to confirm.
4. Prove read access: `search_posts` for one known page.
5. Prove write access on a throwaway draft: `create_post` as draft, `update_post`, then trash it.
6. Add the verified behaviour to this file.

The AISA scope must also be communicated to Andre (who works on the plugin).

## 2. Safety rules for writes

- Read first, write second. Snapshot the current value of any field before changing it (save to a dated file in `tmp/` or the PR description).
- Draft-first for content. Publishing requires Mike's explicit go-ahead.
- Ask for a recent backup confirmation before bulk or destructive operations.
- Prefer ability or REST writes over raw SQL. Use `db_write` only when nothing else reaches the data.
- Batch in small groups and verify each batch by reading back.
- After writes, flush caches (see section 4) and re-fetch the public URL to confirm.
- Never touch 2018 to 2023 era draft posts.
- Duplicate or orphan drafts go to the Bin (trash), not permanent delete.

## 3. Platform learnings (from the Chats)

### Rank Math
- `rank_math_title`, `rank_math_description`, `rank_math_focus_keyword` are not registered with `show_in_rest`. A REST PUT to `/wp/v2/pages/{id}` or `/wp/v2/posts/{id}` silently drops them. Write them with WP-CLI `post meta update {id} {key} '{value}'` (via AISA `wp_cli_set` or `set_seo` if verified), then read back.
- Rank Math injects Article, Organization, WebPage and BreadcrumbList JSON-LD. Add only FAQPage or HowTo.

### WP-CLI shell filtering (seen on WPVibe's `/wpvibe/v1/cli/run`; verify on AISA)
- Wrap values in single quotes. Escape an internal single quote as `'\''`.
- Semicolons inside values may be blocked. Rephrase (the house style bans em dashes, so use a comma or colon instead).
- Pipe characters in regex are blocked. Use several `LIKE '%x%'` clauses joined with `OR` instead of `RLIKE` with alternation.
- `&` passes through inside single quotes. Check emoji handling by reading back after a test write.
- WPVibe's `run_wp_cli` wrapper is read-only and silently drops writes. Writes there needed a direct REST POST with `confirm_write: true`.

### Divi
- Page body content sits in Divi shortcodes. Bulk spelling fixes in body content were done with REST PUT of the full content, not search-replace, to avoid breaking shortcodes. Test one page and view it before a batch. Load the `divi-json` skill for layout work.

### Caching and hosting
- On betranslated.es (Hostinger) the server cache does not purge on REST updates. Manual purge in hPanel, Performance, Clear cache, was always required.
- The .co.uk host is unconfirmed. Try AISA `flush_caches`, then fetch the public URL with a cache-busting query string to check.

### Security plugins
- On betranslated.es iThemes Security returns 403 for non-browser User-Agents on public GET requests. Fallback: send `User-Agent: Mozilla/5.0`. Check whether .co.uk behaves the same.

### WPML (confirmed on .es, unknown on .co.uk)
- On .es, REST post lookups need `lang=en` or `lang=all`, otherwise non-default-language posts return an empty array. Fallback chain: `?slug=X&lang=en`, then `?lang=all`, then `?status=any&lang=en`.

### Sandbox networking
- Use the bare domain where an allowlist matches exact hosts (on .es, `betranslated.es` worked and `www.` did not). For .co.uk the canonical host is `www.betranslated.co.uk`. Test both.

### WPVibe plan cap (history)
- Adding a new site connection hit a plan-tier cap even though existing sites were grandfathered. Disconnecting be/fr did not free a slot and cost the be/fr connection. Do not repeat that approach. If WPVibe is needed again, upgrade the plan or restore be/fr first.

## 4. Standard write recipes

### Update meta for one page
1. `get_seo` (or `wp_cli_get post meta get {id} rank_math_title`) and save the old values.
2. Draft new values per the style guide. Check lengths in code (title under 60, description 130 to 160).
3. Write via `set_seo` or `wp_cli_set`.
4. Read back and compare. Flush caches. Fetch the public URL and confirm the `<title>` and meta description.

### Update body content
1. `get_post` and save the raw content.
2. Produce the new content as a file, run the QA checklist (`05-templates-and-checklists.md`).
3. `update_post` as draft or in place as agreed. Never paste unverified internal links.
4. Read back, flush caches, view the public page.

### 301 redirects
1. Confirm the old URL still returns 404 and the target returns 200.
2. Use the site's redirect mechanism (Rank Math Redirections or the host-level tool). Identify which one is active first.
3. Create one 301 per old URL. Single hop.
4. Test each with `curl -sI`. Then update internal links that pointed at the old URLs.

### Bulk operations
Use `bulk_replace_in_posts` with a dry run first. Limit scope by post type and status. Log every changed ID.

## 5. Failure handling

- If a connector call fails twice with the same error, stop and report: what was attempted, the exact error, and options. Do not loop.
- If a write cannot be verified by read-back, treat it as failed.
- Report credentials exposure immediately (see handoff security note).
