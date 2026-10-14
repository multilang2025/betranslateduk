# betranslated.co.uk

Source of truth for the UK site at https://www.betranslated.co.uk/.

## Working agreement (from 14 October 2026)

**Changes to the UK site start in this repo, not in the WordPress editor.** Make the change here, review it through a pull request, then publish it to the site. Do not edit live WordPress pages directly any more.

Until the open questions below are answered, the repo holds documentation and captured CSS and markup only. The live site is still WordPress with Divi.

## Status

| Item | State |
|------|-------|
| Live site | WordPress + Divi 4.27 + Divi Pixel, edited live until 14 Oct 2026 |
| This repo | Documentation and captured CSS and markup from the 14 Oct session, in `docs/session-2026-10-14/` |
| Site code in this repo | None yet |
| Publish path from repo to live site | **Not decided** |

## Open questions (need an answer before the first repo-only change)

1. **What does "repo version" mean for the site?** Options: (a) a code project that replaces WordPress for these pages, like the Next.js rebuild in the separate BT-Digital repo; (b) a child theme or small plugin in this repo that holds the CSS and templates while WordPress keeps the content; (c) an export of the WordPress pages kept here as files and pushed back through a script.
2. **How does a merged change reach the live site?** For (b) and (c) someone needs an upload or sync step. For (a) it needs a host and a domain switch. The connector used so far cannot edit theme files or run scripts.
3. **Who reviews and merges?** Mike and Andre are the reviewers on the BT-Digital repo, assumed the same here.
4. **Public repo.** This repository is public. Do not commit passwords, API keys, customer data or unpublished business figures. The 14 Oct documentation includes page IDs, search impression counts and open internal questions. If that is not wanted in public, make the repo private.

## Where to start

Read `docs/session-2026-10-14/technical-appendix.md`. It describes how the site is built, the design tokens, class names, link and keyword maps, the Divi and connector gotchas, and a backlog of next tasks. The real CSS is in `docs/session-2026-10-14/css/` and the markup is in `docs/session-2026-10-14/html/`.
