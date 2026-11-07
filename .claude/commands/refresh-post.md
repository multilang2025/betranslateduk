---
description: Refresh existing posts on betranslated.co.uk with sourced figures and an honest update date.
argument-hint: <slugs or topic>
---

Refresh: $ARGUMENTS.

1. List the target posts. Live posts are WordPress (AISA `get_post`); build copies are `scripts/btvibe-uk/output/posts/`.
2. Every figure: find the primary source by live search and READ it (figure, period, cohort). An HTTP 200 is not a verified source; never use model memory.
3. Keep every existing external link unless the target is dead or spam. Never link to competitors.
4. Edit only where the substance changes. Re-run `/blog-dates` after the edit so the shown 'Updated' date follows.
5. Leave 2018 to 2023 era draft posts untouched.
6. Run the repo checks (`/verify`) and read the built post.

Work on a branch, never `main`; open a PR only when asked; content stays DRAFT until Mike approves; no commit unless asked. Report: done / not verified (and why) / left for Mike.
