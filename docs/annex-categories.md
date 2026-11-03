# Blog annex categories (1 November 2026)

Mike's decision: develop extra themes to build authority beyond translation. These categories sit on top of the existing ones and feed the related-articles block, which favours a shared category so visitors keep reading. Same behaviour as betranslated.fr, .es and .nl.

To be proofread by Emma.

| Category | What it covers | Articles assigned |
|---|---|---|
| Productivity and remote work | organisation, tools, working rhythm away from the office | `top-spots-location-independent-professional`, `get-started-remote-freelancer`, `5-inspiring-freelance-jobs`, `vital-keyboard-shortcuts-translators` |
| Digital and cybersecurity | back-ups, passwords, email, data protection | `translation-services-need-vpn` |
| Everyday sustainability | habits, measuring, digital sobriety | no article yet |
| Teams and generations | teams, hiring, retention, generations | `benefits-multilingual-people-for-companies` |
| Living abroad | moving, work, housing, travel | `top-spots-location-independent-professional`, `8-british-habits-that-stand-out-abroad`, `blog-british-food-expats-miss`, `tips-learn-new-language-abroad` |
| Starting out and self-employment | status, setting up a business, first clients | `get-started-remote-freelancer`, `5-inspiring-freelance-jobs`, `reach-new-heights-with-startup-business`, `how-succeed-freelancer-translation-business` |
| Wellbeing at work | ergonomics, health, balance | no article yet |
| Society and language | inclusive language, languages and power, culture | `british-english`, `immigration-can-drive-business-growth`, `advantages-gifted-bilingual-kids`, `lazy-monolingual-english-speakers`, `guide-western-european-languages` |
| Paperwork and documents | official documents an authority asks for | `uk-visa-sponsorship-for-businesses`, `property-documentation-translation` |

## How it works

- `data/post-categories.json`: key = post slug, value = list of added categories. Applied in `blogCards()` (`lib/content.js`) without touching the posts.
- A hand-written post may declare `categories` in its own JSON; the scraped posts here carry no /category/ links, so the list starts from these extras.
- The card label is the post's first category. All of them count for related articles (+3 for a shared category, then shared title words).
