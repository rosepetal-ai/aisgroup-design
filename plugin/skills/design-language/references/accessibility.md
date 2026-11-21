# Accessibility

Apply these requirements to make content and controls usable by everyone.

## The standard

**WCAG 2.2 level AA** applies to everything we publish: websites, landing pages, the Rosepetal app, PDFs, slides, emails and videos. It is also the level that European accessibility law expects through EN 301 549. The rules below translate it into our brand; when in doubt, the WCAG success criterion wins.

| Principle | What it means for us |
| --- | --- |
| **Perceivable** | Contrast from the approved pairings, text alternatives, captions, nothing conveyed by colour alone |
| **Operable** | Keyboard access everywhere, a visible focus ring, generous targets, motion that respects the system setting |
| **Understandable** | Plain language in English, Spanish and Catalan, predictable navigation, clear form errors |
| **Robust** | Semantic HTML first, ARIA only to fill gaps, tested with real assistive technology |

## Contrast

Every pairing below is measured from the token values when the guide is built; a pairing below its minimum stops the build.

- **Text** needs 4.5:1, or 3:1 when it is at least 24 px, or 18.7 px bold (14 pt).
- **Controls and meaningful graphics** need 3:1: field borders, toggles, focus rings, chart lines, detection boxes and status icons.
- **Never colour alone.** A status pairs its colour with an icon and a word; chart series have a legend or direct labels; detections have a label and a verdict.
- Light blue `#A7BFE4` is for text on blue backgrounds only; on white it is decoration, not text.
- Form field borders are `#64748B` (`--ais-border-strong`), which reaches 3:1, in every product and site.
- Success text and icons use the success green `#15803D` (5:1 on white), which is also the fill under white text. The lighter `#16A34A` reaches only 3.3:1 on white and is never used for text or under it.

## Type and reading

- On websites, body text is 16 px and nothing is smaller than 12 px; in printed and PDF documents nothing is smaller than 8.5 pt. In product interfaces, anything people read is at least 14 px; 12 px is only for chart axes and keyboard keys.
- Pages reflow at 320 CSS px wide and at 200% zoom without horizontal scrolling or lost content.
- Layouts tolerate user text spacing: 1.5 line height, 2× paragraph spacing, 0.12 em letter spacing, 0.16 em word spacing.
- Number ranges, file and product names and hyphenated words never break across lines.
- Text stays real text: never an image of text, never text baked into a photograph.

## Keyboard and focus

- Every action works with a keyboard, in an order that follows the visual layout. Nothing traps focus.
- The focus ring (`--ais-focus-ring`, 2 px action blue with a 2 px white gap) appears on every interactive element and is never removed.
- Sticky headers never cover the focused element: pages set `scroll-padding-top` to the header height.
- Every page starts with a skip link to the main content.

## Targets

Interactive targets are at least **24 × 24 px**. On websites and operator screens, primary actions, navigation, touch targets, controls used by gloved operators and icon-only buttons are **44 × 44 px**. Desktop product toolbars may use 36 px buttons with 16 px icons. Inline text links are exempt but keep their underline.

## Motion and media

- All motion follows [Motion](motion.md) and stops when the system asks for reduced motion.
- Nothing flashes more than three times per second.
- Anything that moves or updates on its own for more than five seconds has a pause control, except purely decorative header effects and the logo strip, which pauses on hover and off screen.
- Video never plays sound by itself. Every video has captions; content carried only by the picture gets audio description or a transcript.

## Images, illustrations and charts

| Content | Text alternative |
| --- | --- |
| **Photograph that informs** | What the image proves, in one sentence: «AIS REV 360 inspecting wine bottles on a bottling line.» |
| **Detection or result** | The verdict and the finding: «Rejected: the lot number reads A2391, expected A2319.» |
| **Illustration** | What it explains, as in the library captions |
| **Chart** | Title and a one-sentence finding as the alternative, plus a table view with the data |
| **Logo** | The brand name only; never «logo of» |
| **Decorative image or icon next to its label** | Empty alternative (`alt=""`) or `aria-hidden="true"` |

## Forms

- Every field has a visible label above it; placeholders are examples, never labels.
- Help text sits under the label and is linked to the field.
- Errors appear next to the field in text with an error icon, are announced to screen readers, and say how to fix the problem.
- Required fields are marked in words, not only with an asterisk.

## Language and content

- Every page declares its language (`lang="en"`, `lang="es"`, `lang="ca"`), and passages in another language declare theirs.
- Headings run in order without skipping levels, and each page has one H1.
- Link text says where it goes: «Download the AIS REV 360 datasheet (PDF, 2 MB)», never «click here».
- Write in plain language, following [Voice](../../communications/references/voice.md).

## Documents and slides

- PDFs are tagged (PDF/UA), with a title, a language, headings, a reading order and alternatives for every informative image.
- Slides have a unique title each, use the type sizes in Typography, and keep reading order from top left.
- Never deliver a scanned or flattened document as the only version.

## Testing

Every release of a website, landing page or product screen passes these checks before it ships.

| Check | How | Pass |
| --- | --- | --- |
| **Automated** | axe-core on every page template, at desktop and phone widths | No violations |
| **Brand check** | The [brand check script](https://aisgroup-design.web.app/downloads/qa/brand-check.js) on every page template | No findings |
| **Type and hover** | `type-check.mjs` and `hover-audit.mjs` on every template | No text outside the ten styles; one hover behaviour per kind of link |
| **States** | Screenshot every hover, open menu, focus state, mobile menu and overlay, in every theme | Every state matches the guide; the scripts cannot see states |
| **Keyboard** | Tab through every page and complete every task | Everything reachable, focus always visible |
| **Screen reader** | NVDA with Firefox or Chrome; VoiceOver with Safari | Tasks complete, content in order |
| **Zoom and reflow** | 200% zoom and a 320 px wide window | Nothing lost or cut, no sideways scrolling |
| **Reduced motion** | Turn on the system setting | No movement, nothing missing |
| **Colour** | Colour-blindness simulation on charts and status | Every meaning still readable |

This guide is held to the same bar: every page passes axe-core with WCAG 2.2 AA rules at desktop and phone widths, and the brand check.
