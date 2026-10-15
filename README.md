# betranslated.co.uk (working copy)

An edited **working copy** of the UK site at https://www.betranslated.co.uk/, in the same way `BT-Digital` is the copy of betranslated.com and `ValenciaMove` is the copy of valenciamove.com. The live WordPress site is not touched by anything that happens here. Mike decides later whether and when to merge or deploy the copy.

## Run it on your computer

```bash
npm install
npm run dev      # http://localhost:3100
npm run check    # type check + production build
```

Needs Node 20 or newer. The copy is set to `noindex`, so it can never compete with the live site in search.

## What is built so far

**The homepage and header**, in Next.js 15 (App Router), Tailwind CSS 4 and TypeScript, the same stack as `BT-Digital`. Every other page, and the blog, still lives only on WordPress. Links to pages that are not in the copy go to the live site.

| Piece | File |
|-------|------|
| All homepage copy (edit words here) | `content/home.ts` |
| Colours, dark and light themes, section styles | `app/globals.css` |
| Page order | `app/page.tsx` |
| Header with centred menu, search and dark/light button | `components/SiteHeader.tsx`, `components/ThemeToggle.tsx` |
| Hero with the orange highlighter marker and the photo bubble | `components/Hero.tsx` |
| "Trusted by Global Brands" logo strip (CSS marquee, pauses on hover) | `components/ClientBand.tsx` |
| Three service cards (Translation, Interpretation, Digital Marketing) | `components/Services.tsx` |
| About us with the click-to-play video | `components/About.tsx`, `components/VideoPoster.tsx` |
| What Happens Next (white) and the CTA box (navy grey, teal ombre box) | `components/WhatHappensNext.tsx`, `components/CtaBox.tsx` |
| Footer (simplified) | `components/SiteFooter.tsx` |
| Fonts, self-hosted (Poppins and Fraunces, SIL Open Font License) | `fonts/` |
| Images, logos and icons copied from the live site | `public/images/` |

Dark mode is the default. The button in the header swaps to light and remembers the choice in the browser. The white logo strip and the white "What Happens Next?" section stay white in both modes, and the CTA section stays navy grey, as on the live site.

## How to suggest an edit

1. Change the words in `content/home.ts`, or the look in `app/globals.css`.
2. Check it at http://localhost:3100.
3. Open a pull request for Mike and Andre to review. Nothing here changes the live site.

## Working agreement (from 14 October 2026)

New work on the UK site is done on this copy, not in the WordPress editor. Make the change here, review it in a pull request, and leave publishing to Mike's decision. Anything urgent on the live site is agreed with Mike first and recorded here afterwards.

## Known gaps in the copy

- Header: no dropdown or mega menus yet, only the six main links.
- Footer: simplified. The live footer has more columns, Google reviews and language links.
- The latest-blog-posts section at the bottom of the live homepage is not in the copy.
- The photo bubble is an approximation of the Divi image mask shape.
- No tests yet, and the first-load size has not been checked against the Core Web Vitals targets on a real device.

## Open questions

1. **Scope:** build the next pages (Services, Contact, a city page) or stop at the homepage until Mike has reviewed it?
2. **Reviewers:** Mike and Andre, as on BT-Digital?
3. **Public repo:** this repository is public. Do not commit passwords, API keys, customer data or unpublished business figures. The documentation in `docs/` includes page IDs, search impression counts and open internal questions. Make the repo private if that should not be public.

## Documentation

`docs/session-2026-10-14/` records the 14 Oct 2026 edits made directly in WordPress, with the captured CSS and markup, a technical appendix, and a backlog. Start with `docs/session-2026-10-14/technical-appendix.md`.
