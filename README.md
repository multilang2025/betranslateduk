# betranslated.co.uk handoff package for Claude Code

## Contents

```
CLAUDE.md                                  Root instructions for Claude Code
.claude/agents/                            Ten specialist agents
  bt-uk-orchestrator.md
  bt-uk-seo-auditor.md
  bt-uk-content-writer.md
  bt-uk-meta-schema.md
  bt-uk-internal-linker.md
  bt-uk-qa-editor.md
  bt-uk-wp-executor.md
  bt-uk-technical-seo.md
  bt-uk-vibecode-migrator.md
  bt-uk-social-copy.md
docs/betranslated-co-uk/
  00-handoff.md                            Summary of what was done, current state, tools, other repos
  01-style-guide.md                        Language, format, metadata and schema rules
  02-seo-playbook.md                       Objectives, page types, audit procedure
  03-wordpress-execution.md                AISA and WPVibe runbook, platform gotchas
  04-vibecode-migration.md                 Migration plan and cutover checklist
  05-templates-and-checklists.md           Deliverable set, MEGA PROMPT, QA checklist
  06-backlog.md                            Prioritised tasks and decisions needed
```

## Install

Copy `CLAUDE.md`, `.claude/` and `docs/` into the repo that will carry the UK work (check `github.com/multilang2025/betranslateduk` first). If that repo already has a `CLAUDE.md`, merge the "Read first", "Other BeTranslated repositories" and "Non-negotiables" sections instead of overwriting.

```bash
git checkout -b docs/bt-uk-handoff
git add CLAUDE.md .claude docs
git commit -m "Add betranslated.co.uk handoff docs and Claude Code agents"
git push -u origin docs/bt-uk-handoff
```

Then open a pull request.

## Before the first run

1. Make sure the AISA MCP server is configured for Claude Code and that it lists `betranslated.co.uk` (it did not on 6 October 2026).
2. Ahrefs MCP connected (project 1813246).
3. `gh` authenticated with access to the `multilang2025` organisation, so agents can read the sibling repos.
4. Agent tool lists use server-level MCP names (`mcp__AISA`, `mcp__Ahrefs` and so on). If your Claude Code version needs explicit tool names, replace them with the exact `mcp__<server>__<tool>` names.
5. Confirm the Application Password pasted in the 26 May 2026 chat was revoked.
