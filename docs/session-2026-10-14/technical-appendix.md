# betranslated.co.uk technical appendix (for whoever edits this next)

Companion to `2026-10-14-betranslated-co-uk-session.md`. The CSS blocks are in `css/`, the section markup is in `html/`, the dark mode script is `dark-mode-script.html`.

## 1. How this site is built

- **Live site today.** https://www.betranslated.co.uk/ is WordPress with the **Divi** theme (4.27) and the **Divi Pixel** plugin (modules named `dipi_*`: advanced tabs, carousel, timeline, text highlighter, image mask, button grid, breadcrumbs). SEO plugin is Rank Math. The Next.js `/digital/` build in the separate `BT-Digital` repo is a different project and its design rules (its CLAUDE.md) do not apply here unless this repo adopts them.
- **Working copy from now on.** This repo (`betranslateduk`) is an edited copy of the UK site, like `BT-Digital` and `ValenciaMove`. New work is done and reviewed here, and Mike decides later whether to merge or deploy it. Everything below describes how the live site worked when it was edited directly, which is the spec for building the copy.
- **How edits were made on 14 Oct.** Through the **AISA WordPress connector** (MCP). It can read and edit post content and SEO fields, upload media, run limited WP-CLI, and query Search Console and Google Analytics. It **cannot** edit theme files, plugin files or most options (Divi Theme Options are not on its allowlist), and it cannot run scripts. Page-level database writes need the site owner to approve a link.
- **Divi strips `<script>` and `<style>` from page content** for this user. Custom CSS therefore goes in a module's **Custom CSS > Free-form** field (stored as the shortcode attribute `custom_css_free_form`). JavaScript is only possible through Divi > Theme Options > Integration (done by the site owner).
- **Theme Builder.** One global header layout (post 275393) and footer layout (post 275985) are used on every page. Page bodies are normal Divi pages or the Theme Builder body layouts for posts and city pages.
- **Global modules.** Some Divi library blocks are "global" (`global_module="ID"`). While a section carries that attribute, **page-level edits to it are ignored on render**. Remove `global_module`, `saved_tabs` and `locked` from the shortcode to detach it before editing. Detached on the homepage: button grid 275749 (hero), old Services 275983 (replaced), old Contact 275916 (replaced). Other pages still use those library blocks, so never edit the library item without checking where it is used.

## 2. IDs worth knowing

| Item | ID |
|------|----|
| Homepage | 224563 |
| Header layout (menu, dark/light button and CSS) | 275393 |
| Footer layout | 275985 |
| Default Theme Builder template | 264984 |
| Customers page | 225100 (client section is hidden on the live page) |
| Other retitled pages | Liverpool 23948817, Technical 225015, Spanish 224883, German 225030, Manchester 23948757, Medical 23948254, London 23948802, French 225035, Marketing 224999, Remote interpreting 23947844, Rates 225072 |
| Uploaded: video thumbnail | media 23953467 (`sideload-1dd37a8f686a.jpg`) |
| Uploaded: BIC logo | media 23953511 (`sideload-4fe628da58d6.jpg`, actually an SVG, served as image/svg+xml) |
| Uploaded: Proxymity, Save the Children logos | `sideload-a5e2db05394c.jpg`, `sideload-d3d18b829129.jpg` (transparent images saved with a .jpg name) |

## 3. Design tokens used on the homepage

| Token | Value | Use |
|-------|-------|-----|
| Navy grey | `#2F3143` | dark sections (hero, About, CTA section), headings on light |
| Teal | `#7EBEC5` | eyebrows, blobs, CTA box, text links in dark mode |
| Orange | `#F67618` (hover `#D9610F`) | buttons, emphasis words, SINCE 2002, heading marker |
| Dark card | `#3A3D52` | cards in dark mode (border `#4C5070`) |
| Off-white | `#EDEEF4` body text on dark, `#F9F8FE` / `#F4F5FA` pale surfaces | |
| Heading font | **Fraunces** bold (loaded by setting the font on a Divi heading module, because a CSS `@import` inside the field is ignored) | H1, H2, H3 in new sections |
| Body font | **Poppins** | everything else |
| Button | orange pill, white bold text, 18 to 19px | primary calls to action |

Rule agreed with Mike: when a background becomes navy grey, black text on it becomes white.

## 4. Homepage anatomy, top to bottom

| # | Section | Class on section | Notes |
|---|---------|------------------|-------|
| 0 | Hero | (section index 0) | column `.bt-hero`, CSS grid, teal pills are the section's `::before` and `::after` |
| 1 | Client logo band | `bt-band` | column `.bt-clients`, CSS marquee, 17 logos |
| 2 | Services | `bt-svc` | column `.bt-svc-col`, three cards |
| 3 | (old Services, hidden) | none | hidden by the rule `.bt-svc + .et_pb_section`, safe to delete |
| 4 | About us | `bt-about` | eyebrow `.bt-eyebrow2`, `.bt-founded`, YouTube video |
| 5 | What Happens Next | `bt-ctasec bt-band` | white, Divi Pixel timeline |
| 6 | CTA box | `bt-ctabox` | navy grey, teal ombre box |
| 7 | Blog | none | untouched (light lavender, `#F9F8FE`) |

Class inventory: `bt-hero bt-eyebrow bt-eyebrow2 bt-eyebrow3 bt-h1 bt-mark bt-lede bt-since bt-bubble bt-clients bt-clients-title bt-marquee bt-track bt-logo (mono, navy) bt-svc bt-svc-col bt-svc-grid bt-svc-card (int, dig) bt-svc-tag bt-svc-btn bt-svc-more bt-ic bt-about bt-founded bt-ctasec bt-ctabox bt-cta bt-cta-contact bt-cta-btn bt-band bt-lb bt-mode-wrap bt-mode-btn bt-js bt-light`.

## 5. Icons (media library, two-tone navy and teal line icons)

`/wp-content/uploads/2023/09/` unless noted: `icon_03_blue` documents, `icon_04_blue` website, `icon_05_blue` business, `icon_06_blue` IT chip, `icon_07_blue` tools (industry, site visits), `icon_08_blue` marketing megaphone, `icon_09_blue` tourism, `icon_13` speech bubbles, `icon_15` conference podium, `icon_16` envelope, `icon_17` location pin, `icon_18` pen and notepad, `icon_19` clipboard clock, `icon_22` and `icon_26` people, `/2023/11/icon_25_blue` legal gavel. Icons 12, 14, 20, 21, 23, 24, 27 render blank (probably white versions).

## 6. Link map used in the Services cards

- **Translation:** `/industry/legal/`, `/industry/business/`, `/translation-services/website-translation/`, `/industry/technical/`. Footer line also links `/document-translation-services/`, `/industry/it-telecom/`, `/industry/marketing/`, `/industry/tourism/`.
- **Interpretation (betranslated.com):** `/on-site-interpreting-services/consecutive/`, `/simultaneous/`, `/liaison/`, UK page `/translation-services/remote-interpreting/`, quote `https://betranslated.com/interpretation-quote/`.
- **Digital marketing (betranslated.com):** `/digital/services/seo/`, `/digital/services/paid-ads/`, `/digital/services/branding-design/`, `/digital/free-seo-audit/`.
- Quote links carry `?utm_source=betranslated-couk`. All betranslated.com URLs were opened and confirmed live on 14 Oct 2026.

## 7. Search data behind the copy

- Search Console property: `https://www.betranslated.co.uk/` (13 Jul to 11 Oct 2026). With the AISA tools, pass `site: https://www.betranslated.co.uk/` and a full page URL. Using the default site returns the wrong property.
- Homepage terms with impressions but no clicks: translation agency (714, position 31.7), translation company (466, 46.1), uk translation (98), translation agency uk (47), corporate translation services (44).
- Technical page: technical translation services (1,303), engineering translation services (276), construction translation services (123, position 20.9), technical document translation services (183).
- Remote interpreting page: remote interpreting services (221), remote interpreting (191), video interpreting services (127), on-demand interpreting (107), remote simultaneous interpretation (60), live interpretation services (32). All positions 40 to 90, so this is a ranking opportunity, not a traffic story.
- Legal page: legal translation services (53), legal document translation (positions 15 to 27). Business page: business translation (160), business translations (93).
- Digital marketing has no UK data. Topics come from the betranslated.com digital pages.
- Full data and the earlier audit are in the Google Sheet (Search data tab).

## 8. Copy and style rules in force on the UK site

UK English, no em dashes, "BeTranslated" is singular ("BeTranslated is"), main email `global@betranslated.com`, avoid the AI-sounding words flagged in the audit (tailored, seamless, crucial, trusted partner, rest assured, in today's, not only but also), and never use "language barriers". Claims still to be confirmed by Mike are listed in the session brief.

## 9. Gotchas (these each cost time on 14 Oct)

1. **No square brackets, quotes or partial HTML tags inside any shortcode attribute**, including `custom_css_free_form`. A `]` ends the shortcode, so the rest of the CSS prints on the page as visible text. WordPress also curls single quotes. Use plain class selectors, unquoted font names (`Fraunces,Georgia,serif`) and no attribute selectors.
2. **Find/replace through the connector escapes bare `<` and `>`.** Do not start or end a find string in the middle of a tag. Include whole elements, or end at a shortcode `]`. If a partial tag slips through you will see `&lt;` in the stored content.
3. **Invisible characters.** Divi icon attributes can contain private-use glyphs (for example U+E059 in `font_icon`) that you cannot type back, so a find string covering them never matches. Work around by deleting around them, or by editing in the database.
4. **Global modules ignore page edits** (see section 1). `disabled_on` also does not hide a global section.
5. **Edits to the same post must run one at a time.**
6. A WebP plugin wraps images in `<picture>` and moves the `class` onto the wrapper. Style both `img.x` and `picture.x img`.
7. `et_pb_code` strips scripts and styles for this user. A test script left its text visible in the header until removed.
8. The preview pane throttles animations, so a screenshot can show a half-finished animation. Force the end state with `document.getAnimations().forEach(a => a.finish())` before judging.
9. Divi Pixel carousel autoplay stalled after one slide, so the logo band is plain CSS.
10. Divi Pixel text highlighter draws its underline on the first line box, which looks wrong when the text wraps. The hero heading is a plain `h1` with a CSS marker.

## 10. Useful checks (run in the browser console on the live page)

- Leaked CSS: `document.body.innerText.includes('.bt-svc-grid{')` should be false (swap in any class name).
- Section order and heights: `[...document.querySelectorAll('.et-l--post .et_pb_section')].map(s => Math.round(s.getBoundingClientRect().height) + ' ' + getComputedStyle(s).backgroundColor)`.
- Contrast scan for dark mode: walk `#et-main-area *`, compare each text colour with the first non-transparent ancestor background, list pairs under 3:1. Used to find the navy buttons and light cards.
- Simulate dark mode without installing the script: `document.documentElement.classList.add('bt-js')` (then run the card-tagging loop from the script). Toggle light with `classList.toggle('bt-light')`.

## 11. Backlog and good next prompts

- Install the dark mode script, then check ten page types (service, city, language, blog, quote, customers).
- Delete the hidden old Services section and the rule `.bt-svc + .et_pb_section` together.
- Add a phone and tablet dark mode button (the mobile header is a second row, `et_pb_row_1_tb_header`, hidden on desktop).
- Dark mega menus and dark forms (currently left white).
- Apply the new section style to the city, language and industry pages, one template at a time.
- Move the heading font to Divi Theme Options so every heading uses Fraunces without per-module settings.
- Rebuild the Translation Customers page logo block once Mike supplies the client list.
- Re-check the 12 retitled pages in Search Console around 14 November 2026.

Prompts that work well with Claude Code and the connector:

- "Read `briefs/uk-site/technical-appendix.md`, then restyle the Liverpool page hero to match the homepage hero. Detach any global module first, keep every link, and verify in the browser at 1440, 820 and 390 wide."
- "Add the Translation, Interpretation and Digital Marketing cards to the `/translation-services/` page using `html/services-grid.html` and `css/03-services-three-cards.css`."
- "Run the contrast scan from section 10 in dark mode on these five URLs and fix anything under 3:1 with rules added to the header layout CSS."
