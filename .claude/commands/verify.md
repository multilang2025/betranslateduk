---
description: Verify betranslated.co.uk locally (build, audits, a look at the built pages) before anything is pushed.
---

A green build is not proof. Check the built output.

1. `npm run build`; `node scripts/check-sector-pages.cjs`.
2. Read `docs/betranslated-co-uk/01-style-guide.md` and run the QA checklist in `docs/betranslated-co-uk/05-templates-and-checklists.md` before handing anything to Mike.
3. `data/retired-urls.json` entries redirect in one hop to a live page (`docs/retired-urls.md`).
4. Live WordPress checks use the AISA connector and `tools/seo/chk.py`; after two failed attempts at the same connector call, stop and report.

Work on a branch, never `main`; open a PR only when asked; content stays DRAFT until Mike approves; no commit unless asked. Report: done / not verified (and why) / left for Mike.
