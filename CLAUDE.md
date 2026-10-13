# CLAUDE.md: betranslated.co.uk

Project: SEO, content and WordPress work for betranslated.co.uk (UK site of BeTranslated), and its conversion into a vibecode build.
Owner: Michael Bastin (Mike). Working style: decisive and fast. Write through, he corrects afterwards, except where noted below.

## Read first

1. `docs/betranslated-co-uk/00-handoff.md`: what happened so far and current state.
2. `docs/betranslated-co-uk/01-style-guide.md`: mandatory language and format rules.
3. `docs/betranslated-co-uk/06-backlog.md`: what to do next.
4. `docs/betranslated-co-uk/07-handoff-to-victoria-2026-10-13.md`: current state, unfinished work, the safe editing method and a twelve-week plan.
Then the doc relevant to your task (SEO playbook, WordPress runbook, migration, templates).

## Other BeTranslated repositories

Several BeTranslated repos exist under `github.com/multilang2025` and must be checked for further information before you build or decide anything. Key ones: `betranslateduk`, `BTvibe-es`, `btes`, `BT-Digital`, `BT-Tools`, `betranslatedbe`, `betranslatedfr`, `betranslatednl`, `betranslatedDE`, `dlvibe`, `dlvibe-cms`. See the table in the handoff doc. Use `gh repo view` and `gh repo clone` into a scratch directory outside this repo. Treat them as read-only references. Write useful findings back into `docs/`.

## Tools

- **AISA connector** (MCP server `AISA`): primary WordPress bridge. Register betranslated.co.uk first if `list_sites` does not show it.
- WPVibe (MCP server `Mikebastin`): fallback, currently blocked for .co.uk.
- Ahrefs MCP: project ID 1813246. Also Semrush, Supermetrics.
- Skills worth loading: `brand-guidelines-betranslated`, `seo-onpage`, `seo-technical`, `hreflang-audit`, `gsc-seo-optimizer`, `wp-bulk-content-deploy`, `wp-cli-remote`, `divi-json`.

## Platform

The site is WordPress (Divi, Rank Math) today and will be converted to a vibecode version, like betranslated.com (done) and betranslated.es (in progress). Plan: `docs/betranslated-co-uk/04-vibecode-migration.md`.

## Non-negotiables

- British English. No em dashes or en dashes anywhere. Second person, active voice.
- One sentence per line in content, blank line after each full stop.
- Meta title under 60 characters, Chicago Title Case, hyphen separator. Meta description 130 to 160 characters with a CTA. Excerpt: two sentences plus CTA plus one emoji.
- H2 to H6 in sentence case, no numbered headings. No "The Importance of", "this guide" or "break language barriers".
- Internal links only to URLs verified live in the sitemap. Never link a page to itself.
- No outbound links to competing or industry-adjacent sites.
- Metadata and JSON-LD only when requested, as separate labelled outputs.
- FAQPage and HowTo are the only schema added on WordPress (Rank Math handles the rest). The vibecode build must emit the rest itself, once.
- Leave 2018 to 2023 era draft posts untouched.
- Never write credentials, tokens or Application Passwords into files, commits or chat. Use connector authorisation flows.
- Content stays as DRAFT until Mike approves publishing.

## Workflow

1. Plan with the orchestrator agent for multi-step work. Single tasks can go straight to the specialist agent in `.claude/agents/`.
2. Read before write. Snapshot old values. Verify every write by reading back.
3. Run the QA checklist (`05-templates-and-checklists.md`) before handing anything to Mike.
4. Report briefly: what changed, which URLs, what to re-measure. Add a Sources list when external facts were used.
5. After two failed attempts at the same connector call, stop and report.

## Git

Work on a branch. Small commits with clear messages. No secrets. Open a pull request for Mike to review. Do not push to `main` directly.
