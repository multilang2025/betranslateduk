# betranslated.co.uk edit session, 14 October 2026

This is a record for review. These edits were made **directly in WordPress (Divi)** on https://www.betranslated.co.uk/ through the AISA connector, before this repo held any site code, and **they are already live**. The files here document them and capture the CSS and markup so they can be moved into this repo, which is now the place future changes start (see `../../README.md`). This PR contains documentation only, so merging it changes nothing on the live site.

The full running record, with before and after wording, is the **Change log** tab of the Google Sheet "BT UK content review" (rows 2 to 35).

## Files in this folder

| File | What it is |
|------|------------|
| `technical-appendix.md` | How the site is built, IDs, design tokens, class names, link and keyword maps, Divi and connector gotchas, checks, backlog and starter prompts. **Read this first if you are going to edit the site.** |
| `css/01` to `css/06` | The actual CSS for each new section and for the header, dark and light mode, with comments on where each block lives in WordPress |
| `html/services-grid.html`, `html/hero-about-cta-copy.html` | The markup and final copy for the new blocks |
| `dark-mode-script.html` | The script that switches dark and light mode on |

## What to review (live pages)

| Area | Where | What changed |
|------|-------|--------------|
| Content review | 171 pages and posts | AI-sounding phrasing and "language barriers" rewritten, BeTranslated made singular, main email set to global@betranslated.com, excerpts cleaned |
| SEO titles | 12 pages | New titles, descriptions and headings from Search Console data (Home, Liverpool, Technical, Spanish, German, Manchester, Medical, London, French, Marketing, Remote interpreting, Rates) |
| Relocation line | 3 Spanish pages | MAEC sworn and certified translation line added |
| Homepage hero | `/` | Navy grey (#2F3143) background, teal blobs, white text, Fraunces heading, new H1 "Your UK Translation Agency for Business Growth Worldwide", orange "Get a free Quote" button, "SINCE 2002" line, orange marker on "Business Growth" |
| Client logo band | `/` | White strip under the hero, "Trusted by Global Brands", 17 logos, slow scroll that pauses on hover |
| Services | `/` | Eight tabs replaced by three cards: Translation, Interpretation, Digital Marketing, each with four icon listings |
| About us | `/` | New copy and heading, "Founded in 2002" above the video, YouTube video replaces the photo |
| What Happens Next and CTA | `/` | White "What Happens Next?" section, then a separate navy grey section with a teal ombre CTA box. The old Contact us block is removed |
| Header | every page | Menu centred, search icon kept at the right, second desktop menu hidden, dark and light mode button added (inactive until the script below is installed) |

## Needs a decision or action

1. **Dark and light mode script.** The page builder strips scripts, so the switch stays hidden until the script in `dark-mode-script.html` (same folder) is pasted into Divi > Theme Options > Integration > header code. Until then nothing changes for visitors. After pasting, check one page in each mode.
2. **Dark mode is a first pass** on the roughly 170 other pages. Tested on the homepage, Legal page and one blog post. No phone or tablet button yet.
3. **Hidden old Services section.** The old tabbed Services block is hidden with CSS but still in the homepage code. Deleting it needs a database edit that has not been approved.
4. **Wording to confirm**: "Client consultations, depositions and hearings", "Search and social ads built for each market", "delivers accurate, confidential work on time", and the claim "over 20 years".
5. **Heading font site-wide** (Fraunces) needs Divi > Theme Options > General > Typography. Not changed.
6. **Open from before:** primary London vs Leeds address and phone, Rates page euros and Korean heading, current client list, Malaria Consortium logo, which small city pages to merge.
7. **Logos:** Brandwatch, UNESCO and Barbados are shown navy because the library files are white-only. HL, ID Tech, Le Shuttle and Baron were left out because the names are unconfirmed.
8. **Search Console:** re-check the 12 retitled pages around 14 November 2026.

## Rollback

WordPress keeps a revision of every post and page edited, so any page can be restored from its Revisions panel. The header layout (post 275393) and the homepage (post 224563) are the two shared items to watch.

## Notes for future edits

- Do not put square brackets, quotes or partial HTML tags inside a Divi shortcode attribute such as the custom CSS field, or in find and replace strings. They end the tag early and the CSS prints on the page as text.
- When a background becomes navy grey, black text on it becomes white.
- Several Divi library blocks (the old Services block and the old Contact block) are "global modules". Page-level edits to them are ignored until the block is detached from the library.
