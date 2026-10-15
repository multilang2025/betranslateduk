# betranslated.co.uk (working copy)

An edited **working copy** of the UK site at https://www.betranslated.co.uk/, in the same way `BT-Digital` is the copy of betranslated.com and `ValenciaMove` is the copy of valenciamove.com. The live WordPress site is not touched by anything that happens here. Mike decides later whether and when to merge or deploy the copy.

## Working agreement (from 14 October 2026)

**New work on the UK site is done on this copy, not in the WordPress editor.** Make the change here, review it in a pull request, and leave publishing to Mike's decision. Do not edit live WordPress pages directly for new work. Anything urgent on the live site is agreed with Mike first and recorded here afterwards.

## Status

| Item | State |
|------|-------|
| Live site | WordPress + Divi 4.27 + Divi Pixel. Edited live until 14 Oct 2026 |
| This repo | Documentation and captured CSS and markup from the 14 Oct session, in `docs/session-2026-10-14/` |
| The copy itself | **Not built yet** |
| Merge and deploy | Mike's call, later. Not needed to start |

## Proposed first step (needs a yes)

Build the copy as a code project on the same stack as `BT-Digital` (Next.js 15, Tailwind, shadcn/ui, next-intl), so design rules, components and review habits carry over. The 14 Oct homepage maps cleanly onto it: the hero, logo band, three-card Services, About, "What Happens Next?" and CTA box each become one component, using the captured CSS and markup as the spec. Start with the header and the homepage. Every other page, and the blog, stays on WordPress until Mike decides.

Alternative if a full code copy is too much: a static HTML mirror of the current pages that we edit in place (quicker, harder to maintain).

## Open questions

1. **Stack for the copy:** Next.js like BT-Digital (proposed), or a static HTML mirror?
2. **Scope of the first copy:** homepage and header only (proposed), or the whole site?
3. **Reviewers:** Mike and Andre, as on BT-Digital?
4. **Public repo:** this repository is public. Do not commit passwords, API keys, customer data or unpublished business figures. The 14 Oct documentation includes page IDs, search impression counts and open internal questions. Make the repo private if that should not be public.

## Where to start

Read `docs/session-2026-10-14/technical-appendix.md`. It describes how the live site is built, the design tokens, class names, link and keyword maps, the Divi gotchas, and a backlog of next tasks. The real CSS is in `docs/session-2026-10-14/css/` and the markup is in `docs/session-2026-10-14/html/`.
