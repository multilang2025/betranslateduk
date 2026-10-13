# Dead and broken link audit, 8 October 2026

Scope: all 171 HTML pages in the sitemap (66 posts, 105 pages) and every link and image on them, header and footer included. 646 unique link targets and 322 unique images were tested. Read only, nothing was changed.

Method: direct requests from one machine, then DNS lookups and a browser-pane visit for anything that failed to connect. Links that block automated requests (403) cannot be confirmed from here.

## Summary

| Check | Result |
|---|---|
| Internal links to a 404 or error page | 0 (all 241 internal targets answer 200 except one redirect) |
| Internal links that redirect | 1: `https://betranslated.co.uk` (non-www) on `/blog/british-footballers/` |
| External links returning 404 or 410 | 9 |
| External links to domains that no longer exist | 2 |
| External links I could not verify | 4 failed to connect, 31 returned 403 (bot-blocked) |
| Broken images | 1: `/wp-content/uploads/2023/09/specialised-translation.jpg` on `/industry/` |
| External links that redirect | 97 (66 of them to betranslated.com, mostly the footer terms link) |

## Fix first

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | Broken image (404) | `/industry/` | Re-upload or replace the image, or remove it. |
| 2 | Dead domain `usaintlouis.be` | `/blog/translation-schools-belgium/` | Remove the link or replace with the current university page. |
| 3 | Dead domain `frenchtranslator.fr` | `/languages/french-translation-services/` | Remove the link. It is also a translation-industry site, so the no outbound links to industry sites rule applies. |
| 4 | Eight external 404s and one 410 | See table below | Replace with a live neutral source or remove the link. |
| 5 | Footer terms link goes to `https://www.betranslated.com/terms-conditions/` on every page and redirects | all 171 pages | Point it at `https://betranslated.com/terms-conditions/` in the Divi footer layout. |
| 6 | Non-www internal link | `/blog/british-footballers/` | Change `https://betranslated.co.uk` to `https://www.betranslated.co.uk/`. |

## External 404 and 410 links

| Status | URL | Found on |
|---|---|---|
| 404 | https://docs.lokalise.com/en/articles/1400453-free-plan | `/blog/best-translation-tools/` |
| 404 | https://porch.com/advice/eco-friendly-business | `/blog/environmental-translation-services-green-economy/` |
| 404 | https://worldpopulationreview.com/cities/united-kingdom/bath | `/translation-services/england/bath/` |
| 404 | https://www.nhs.uk/services/hospital/queen-elizabeth-hospital-birmingham/RRK15 | `/translation-services/england/birmingham/` |
| 404 | https://www.leicester.gov.uk/media/inmh1feq/living-in-leicester-infographic-summary-2023.pdf | `/translation-services/england/`, `/translation-services/england/leicester/` |
| 404 | https://www.conferenceleeds.co.uk/leading-the-way/ | `/translation-services/england/leeds/` |
| 404 | https://www.manchester.gov.uk/info/500002/council_policies_and_strategies/8356/manchester_digital_strategy_2021_%E2%80%93_2026/3 | `/translation-services/england/` |
| 404 | https://www.investopedia.com/articles/investing/091115/emerging-markets-analysing-south-koreas-gdp.asp | `/languages/korean-translation-services/korean-technical-translation-services/` |
| 410 | https://www.varbes.com/demographics/sunderland-demographics | `/translation-services/england/sunderland/` |

## Domains with no DNS record (dead)

| URL | Found on |
|---|---|
| https://www.usaintlouis.be/sl/1783.html | `/blog/translation-schools-belgium/` |
| https://frenchtranslator.fr | `/languages/french-translation-services/` |

## Could not verify (reachable DNS, but no response from this machine)

These resolve but did not answer my requests or the browser pane. Check them by hand.

| URL | Found on |
|---|---|
| https://www.startupdonut.co.uk/sales-and-marketing/promote-your-business/the-10-golden-rules-of-writing-press-releases | `/blog/press-release-translation/` |
| https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca | `/blog/multilingual-chatbots-shake-up-your-sales-strategy/` |
| https://asiafundmanagers.com/south-korean-economy/ | `/languages/korean-translation-services/korean-financial/` |
| https://erudera.com/study-programs/translation-interpreting/master-degree/ | `/blog/note-taking-interpreting/` |

## Links that returned 403 (bot-blocked, probably fine)

31 links on forbes.com, adobe.com, nytimes.com, ft.com, upwork.com, ucl.ac.uk and similar blocked automated requests. Open a sample in a browser. Full list is in the audit data, not repeated here.

## Cleared as false alarms

- `britishcouncil.org` (2 links) and `web.umons.ac.be` load correctly in a browser.
- Three images with accented file names (`français`) load correctly. My first test had an encoding bug.
- Two Facebook links returned 400 to a script. Facebook does this to automated requests.

## Style-rule flag: outbound links to industry-adjacent sites

Domains linked from the site that are translation, freelance or language-tool businesses and therefore fall under the no-outbound-links rule: `upwork.com`, `guru.com`, `reverso.net`, `docs.lokalise.com`, `frenchtranslator.fr`. The audit did not review every one of the 244 external domains. Most-linked external domains: `betranslated.com` (72), `betranslated.es` (8), `forbes.com` (7), `statista.com` (7), `betranslated.be` (6), `gov.uk` (6), `bbc.com` (6), `adobe.com` (5).

## Re-test

Re-run after fixes. Re-check the unverified links by hand.
