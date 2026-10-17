# betranslated.co.uk: templates and checklists

## 1. Standard deliverable set for a page or post

Deliver as separate, clearly labelled outputs:

1. **Article body**: HTML structure only, no wrapper tags, no `<section>`, no `<hr/>`. One sentence per line, blank line after each full stop.
2. **Excerpt**: two sentences, second one a CTA, one emoji.
3. **Meta title and meta description** with character counts, only when requested.
4. **JSON-LD** (FAQPage or HowTo on WordPress), only when requested.
5. **Internal link table**: anchor, target URL, where it was verified.
6. **Notes**: assumptions, facts to verify, items for Mike.

Social copy (Facebook, LinkedIn, X) is a separate optional output.

## 2. Page skeleton (service or blog)

```
H1: Main keyword plus one emoji (omit if the supplied text has no H1)
H2: Secondary keyword, UK context (add if the text does not start with an H2)
Intro: who it is for, what problem it solves, UK entity reference
H2: Sentence-case descriptive heading
  H3 as needed
...use-case sections with UK examples...
CTA box: quote request, one email link, one button, one phone line
H2: Frequently asked questions
  Five UK-relevant FAQs
```

CTA with grey background (betranslated.be convention): a `<figure>` block, light grey `#f5f5f5`, rounded corners, centred text, one H2, one email link, one blue button "Request a quote" (UK English), one phone line. Check the UK site's own CTA wording before reuse.

## 3. MEGA PROMPT for long articles

Use when producing a long article or any extensive content. Fill in the brackets.

```
ROLE: Senior UK SEO copywriter for BeTranslated (betranslated.co.uk).
GOAL: [page purpose and the quote-request action].
KEYWORDS: Focus: [x]. Secondary: [y, z]. UK intent.
AUDIENCE: [segment].
LENGTH: 800 to 1,200 words.
VOICE: British English, second person, active, no fluff.
STRUCTURE: H1 with keyword and one emoji; H2 with secondary keyword; sentence-case H2 to H6; no numbered headings; five UK FAQs; CTA.
UK ENTITIES TO USE (only where relevant and accurate): [HMRC, Home Office, Companies House, NHS, British Council, FCDO, UK courts, cities].
INTERNAL LINKS: only from this verified list: [list]. Never link to this page itself.
BANS: em and en dashes, "break language barriers", "The Importance of", "this guide", sentences starting "By" plus gerund, outbound links to competitors, invented statistics.
FORMAT: one sentence per line, blank line after each full stop, HTML structure only, no wrapper tags, no section tags, no hr.
OUTPUTS: body, excerpt. Meta and JSON-LD only if asked, as separate labelled blocks.
```

## 4. QA checklist (run on every piece before it reaches Mike)

Language
- [ ] British spellings only (scan for -ize, -or in favour, program, center, license as verb).
- [ ] No em dash and no en dash (search for the characters U+2014 and U+2013).
- [ ] No banned phrases (see style guide section 2).
- [ ] Second person, active voice.
- [ ] No drumming reference.

Structure
- [ ] H1 present only if the source had one, with keyword and one emoji.
- [ ] Starts with an H2 where required.
- [ ] H2 to H6 in sentence case, capitalised first letter, no numbers.
- [ ] Five FAQs.
- [ ] Word count 800 to 1,200 where applicable.
- [ ] No `<hr/>`, no `<section>`, no wrapper tags.
- [ ] One sentence per line, blank line after each full stop.

Metadata (when produced)
- [ ] Title under 60 characters, Chicago Title Case, hyphen separator.
- [ ] Description 130 to 160 characters including spaces, with a CTA.
- [ ] Excerpt: two sentences plus CTA plus one emoji, and not identical to the description.

Links and facts
- [ ] Every internal link verified live and returns 200.
- [ ] No link to the page itself.
- [ ] No outbound link to a competitor or industry-adjacent site.
- [ ] URLs only inside full sentences.
- [ ] Every statistic has a named neutral source and was checked (`fact_check` or a web search).
- [ ] Entities (HMRC, NHS and others) are used accurately.

Schema (when produced)
- [ ] FAQPage or HowTo only on WordPress. No duplicate of Rank Math output.
- [ ] BreadcrumbList positions are strings.
- [ ] Product has price and image.
- [ ] "X" not "Twitter".
- [ ] JSON-LD parses as valid JSON.

## 5. Character counting snippet

```bash
python3 - <<'EOF'
import sys
for label, text in [("title", "PASTE TITLE"), ("description", "PASTE DESCRIPTION")]:
    print(label, len(text))
EOF
```

Count characters, not bytes. Emoji count as one character in the content brief but may count as two bytes or more in MySQL `LENGTH()`. Use `CHAR_LENGTH()` in SQL checks.

## 6. Output hygiene

- Run the banned-character scan on the final file, not the draft.
- Keep the 2018 to 2023 era drafts untouched.
- Name output files by slug and date, for example `2026-10-06_translator-vs-interpreter.md`.
