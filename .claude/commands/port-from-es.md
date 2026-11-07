---
description: Port a section, component or page design from betranslated.es (BTvibe-es) into this site, fed with this site's own content. Use when "do it as on betranslated.es".
argument-hint: <component, section or page to port>
---

# /port-from-es $ARGUMENTS

betranslated.es is the design source of truth for every BeTranslated site. In doubt, copy its solution. No commit or push unless I ask.

1. Locate the reference in `/home/user/BTvibe-es` (components in `components/`, styles in `app/*.css`, e.g. `bt-chrome.css`, `content.css`, `design-system.css`). If the checkout is missing, ask me before cloning `multilang2025/BTvibe-es` read-only. Read its current `main`; it changes often.
2. Find the equivalent here (`components/`, `app/*.css`, `lib/content.js`) and diff against ES. Port structure, spacing, colours, section order and mobile behaviour. Keep this site's locale, tokens, routes and loaders.
3. Never copy ES content: Spain-specific text, prices, offices, sworn-translation rules, ES slugs and `data/` files stay in ES. Feed the template with this site's live text. Do not invent facts, figures or claims.
4. Respect this site's hard rules in CLAUDE.md/README/docs (language register, banned wording, typography, no unverified claims) in every string you touch.
5. Build locally (`npm run build`), start it, and look at the page at desktop and 390 px, light and dark theme. Check headings do not skip levels and no new horizontal scroll.
6. One topic per change. Follow CLAUDE.md: British English, no em dashes, work on a branch, and a pull request for Mike, never `main`.

Traps: a CSS file copied whole drags ES-only classes; an ES component hard-codes Spanish strings and ES routes; a green build does not prove the layout.

Report: files changed, ES file used as reference, not verified (device, theme), what is left for me.
