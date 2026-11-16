# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-df264e620767

<!-- AIS-df264e620767 -->
Use the eight core colours for their roles: brand `#17356E` for the logo, primary buttons and closing bands; blue-800 `#10254C` for deep sections, footers and primary buttons on hover or press; action blue `#3664B3` for links and text actions, which turn blue-600 `#1E4591` on hover; light blue `#A7BFE4` for highlights and links on blue backgrounds.

Source: plugin/skills/design-language/SKILL.md:14.

## AIS-2125f2a13e1f

<!-- AIS-2125f2a13e1f -->
Text is ink `#0F1729`; secondary text is `#4B5563`. On dark backgrounds use `#F1F5F9` and `#94A3B8`.

Source: plugin/skills/design-language/SKILL.md:15.

## AIS-dc9a6798ef4d

<!-- AIS-dc9a6798ef4d -->
Success `#15803D`, warning `#D97706` and error `#DC2626` mean status only, always with a word or icon. The same success green carries success text and icons and is the fill under white text; `#16A34A` is not used (3.3:1 on white).

Source: plugin/skills/design-language/SKILL.md:16.

## AIS-bb2e06d7e0e6

<!-- AIS-bb2e06d7e0e6 -->
Every other colour is a step of the blue (50–950) or neutral (0–900) scale, or a status colour. Never use a colour outside the palette, an approximate blue or a gradient between unrelated colours. The black logo is only for black-only printing and AIS website headers on white.

Source: plugin/skills/design-language/SKILL.md:17.

## AIS-874c646ec370

<!-- AIS-874c646ec370 -->
Set all text in Inter (weights 400, 500 and 600) and code or machine values in JetBrains Mono. Use Arial only where Inter cannot be installed, and then for the whole piece.

Source: plugin/skills/design-language/SKILL.md:21.

## AIS-4a83760c8735

<!-- AIS-4a83760c8735 -->
Websites and documents use only the ten text styles (`--ais-text-display` to `--ais-text-caption`), in documents at the point sizes below. Product interfaces use the product scale and video its own title sizes. Never invent a size, tracking or weight between them.

Source: plugin/skills/design-language/SKILL.md:22.

## AIS-62901396e59e

<!-- AIS-62901396e59e -->
Headlines are weight 500, sentence case, at most three lines, never all capitals. Semibold 600 is allowed only for video titles, document headings and chart titles; Bold 700 is never used for headings, except Arial Bold in email, which has no Medium.

Source: plugin/skills/design-language/SKILL.md:23.

## AIS-a8613c720666

<!-- AIS-a8613c720666 -->
Body text is 16 px on 1.6 leading, 68 characters per line by default and 75 at most, left aligned, never justified.

Source: plugin/skills/design-language/SKILL.md:24.

## AIS-548e6901487e

<!-- AIS-548e6901487e -->
Use tabular figures (`font-variant-numeric: tabular-nums`) wherever numbers line up in a column: table number cells, counters and prices. Not in running text or specification values.

Source: plugin/skills/design-language/SKILL.md:25.

## AIS-5aafd7f71027

<!-- AIS-5aafd7f71027 -->
Text in chips, badges and buttons is centred on its cap height, never on the font box.

Source: plugin/skills/design-language/SKILL.md:26.

## AIS-08eb270e1df7

<!-- AIS-08eb270e1df7 -->
Use only the spacing tokens (--ais-space-050 to --ais-space-1600, a 4 px base on an 8 px rhythm). Never use values between them, such as 6, 10, 14, 18 or 22 px.

Source: plugin/skills/design-language/SKILL.md:30.

## AIS-97ad84e8383f

<!-- AIS-97ad84e8383f -->
On websites and documents, content stops at 1440 px with fluid side margins of 24 to 64 px, on a 12-column grid (8 below 900 px, 4 below 600 px), and sections sit 64 to 128 px apart. Product interfaces are full width.

Source: plugin/skills/design-language/SKILL.md:31.

## AIS-657ccb2fb5e8

<!-- AIS-657ccb2fb5e8 -->
Websites and documents use the breakpoints 600, 900, 1200 and 1440 px, written mobile-first with min-width. Never add another. Product interfaces use the Tailwind breakpoints of the design system.

Source: plugin/skills/design-language/SKILL.md:32.

## AIS-6e64710e173e

<!-- AIS-6e64710e173e -->
Websites are square everywhere: buttons, cards, menus, dropdowns, dialogs and notices. The one exception is a product screen shown as a window, which takes the window’s 4 px corner. Product interfaces take their corners from `@rosepetal/design` and never override them. Fully round only for avatars, dots and toggles.

Source: plugin/skills/design-language/SKILL.md:33.

## AIS-fd0820b252b9

<!-- AIS-fd0820b252b9 -->
Borders separate content; shadows only for things that float (menus, dialogs, toasts). Cards never cast a shadow, not even on hover.

Source: plugin/skills/design-language/SKILL.md:34.

## AIS-c8e18e3310a3

<!-- AIS-c8e18e3310a3 -->
Rules separate, they never frame: a line goes between the rows of a list or table, never after the last row and never above or below a block that already has one. Two lines with nothing between them are a fault. Text sits centred between its rules, with the same space above and below.

Source: plugin/skills/design-language/SKILL.md:35.

## AIS-388e14cdd8c0

<!-- AIS-388e14cdd8c0 -->
Choose every image from the six image types by what it has to say: Machine, In production, Detail and result, Interface, Industry subject, People.

Source: plugin/skills/design-language/SKILL.md:39.

## AIS-07586a477e5e

<!-- AIS-07586a477e5e -->
Start from real photographs and screenshots, product renders built to real dimensions, and exterior views of our machines from engineering models, every guard closed.

Source: plugin/skills/design-language/SKILL.md:40.

## AIS-cb5ed8e720d0

<!-- AIS-cb5ed8e720d0 -->
A generated or composited image is used only when the end result is credible at its final size: no garbled or invented-looking text, no impossible geometry or light, never a different machine than the one named, client brands blurred.

Source: plugin/skills/design-language/SKILL.md:41.

## AIS-ad46cf5d15ab

<!-- AIS-ad46cf5d15ab -->
Never let an image model draw boxes, masks, labels, verdicts or text. Draw detections with overlay.mjs from a JSON spec, in the overlay kit colours only.

Source: plugin/skills/design-language/SKILL.md:42.

## AIS-7e5dcfa1ddfe

<!-- AIS-7e5dcfa1ddfe -->
Overlay chips never cover what was inspected, and their text is centred on the cap height.

Source: plugin/skills/design-language/SKILL.md:43.

## AIS-bbf7ecfa5bf8

<!-- AIS-bbf7ecfa5bf8 -->
Never show floating holograms, glowing sci-fi light, robots with faces, invented brands or text baked into an image.

Source: plugin/skills/design-language/SKILL.md:44.

## AIS-295966df15b8

<!-- AIS-295966df15b8 -->
Never show a picture larger than its medium allows: 1.25× its native size in print and on carousel slides, 1.3× in a deck’s photo panel (deck covers always fill their panel) and 1.5× on a single post.

Source: plugin/skills/design-language/SKILL.md:45.

## AIS-a08ff5efbf5c

<!-- AIS-a08ff5efbf5c -->
Product renders sit on the section grey sweep with no conveyors or rails. Where a conveyor appears, its belt or chain is brown, grey or blue, never green, and its side guides are metallic.

Source: plugin/skills/design-language/SKILL.md:46.

## AIS-dda2b5159e7b

<!-- AIS-dda2b5159e7b -->
Marketing screenshots carry no test or admin data and are cropped at panel borders.

Source: plugin/skills/design-language/SKILL.md:47.

## AIS-f7c4414ce87e

<!-- AIS-f7c4414ce87e -->
Use Lucide icons only, as shipped: 24 px grid, 2 px stroke, round caps and joins, no fill. Never redraw, edit or mix in another library.

Source: plugin/skills/design-language/SKILL.md:51.

## AIS-3a70b0d2a98a

<!-- AIS-3a70b0d2a98a -->
Never type Unicode arrows, ticks or bullets (`→`, `✓`, `•`) or emoji as icons.

Source: plugin/skills/design-language/SKILL.md:52.

## AIS-88b87739db99

<!-- AIS-88b87739db99 -->
Icons take the colour of their label (currentColor). Status colours only for status.

Source: plugin/skills/design-language/SKILL.md:53.

## AIS-bcd8c72d915c

<!-- AIS-bcd8c72d915c -->
Sizes are 16, 20 or 24 px; at 32 px and above, keep the stroke at 2 px with absoluteStrokeWidth.

Source: plugin/skills/design-language/SKILL.md:54.

## AIS-7963ca0fd59f

<!-- AIS-7963ca0fd59f -->
An icon sits before its label, centred on the label’s cap height, 8 px apart. Icon-only buttons need an accessible name and a 44 px target; desktop product toolbars may use 36 px buttons with 16 px icons.

Source: plugin/skills/design-language/SKILL.md:55.

## AIS-134570f34882

<!-- AIS-134570f34882 -->
Choose the chart by its job: bars to compare, lines for change over time, a single figure for one number, a table for exact values. Never pies with more than three parts, 3D, or two y-axes.

Source: plugin/skills/design-language/SKILL.md:59.

## AIS-7707c101e860

<!-- AIS-7707c101e860 -->
Series colours come from the six data colours in fixed order (--ais-data-1 to -6), never cycled or reordered. A seventh series becomes «Other» or small multiples.

Source: plugin/skills/design-language/SKILL.md:60.

## AIS-07fa83ed8d77

<!-- AIS-07fa83ed8d77 -->
Magnitude uses one hue, light to dark (--ais-seq-*). Values above and below a reference use orange and blue around a neutral grey (--ais-div-*).

Source: plugin/skills/design-language/SKILL.md:61.

## AIS-25383c7417a7

<!-- AIS-25383c7417a7 -->
Status colours (success, warning, error) mean status only, with an icon or word, and are never a series colour.

Source: plugin/skills/design-language/SKILL.md:62.

## AIS-9ed4ea3e0d54

<!-- AIS-9ed4ea3e0d54 -->
Text never takes a series colour; a legend appears from two series, direct labels on up to four, and every chart has a table view.

Source: plugin/skills/design-language/SKILL.md:63.

## AIS-45308bef027e

<!-- AIS-45308bef027e -->
Use only the motion tokens: seven durations (--ais-duration-*), three curves (--ais-ease-standard, -enter, -exit) and the fixed distances. Never invent a duration or a curve.

Source: plugin/skills/design-language/SKILL.md:67.

## AIS-bac3fa2da51e

<!-- AIS-bac3fa2da51e -->
Animate transform and opacity only, plus grid-template-rows for accordions. Never animate layout, colour gradients or blur.

Source: plugin/skills/design-language/SKILL.md:68.

## AIS-224fd99a22b8

<!-- AIS-224fd99a22b8 -->
Interfaces use durations up to 240 ms; only websites use 500 ms and above, for arrival, scroll reveals and headlines.

Source: plugin/skills/design-language/SKILL.md:69.

## AIS-8175238ba727

<!-- AIS-8175238ba727 -->
Content is visible without JavaScript; motion only enhances it. Every animation stops under prefers-reduced-motion.

Source: plugin/skills/design-language/SKILL.md:70.

## AIS-02bcfa055551

<!-- AIS-02bcfa055551 -->
No bounce, elastic, parallax, scroll smoothing libraries, hover lifts, decorative loops or animated logos on the web.

Source: plugin/skills/design-language/SKILL.md:71.

## AIS-054872487932

<!-- AIS-054872487932 -->
Meet WCAG 2.2 level AA on every website, product interface, document and video.

Source: plugin/skills/design-language/SKILL.md:75.

## AIS-0e49fd6a6c7f

<!-- AIS-0e49fd6a6c7f -->
Text reaches 4.5:1 against its background, or 3:1 at 24 px or 18.7 px bold (14 pt); control borders, focus rings and meaningful graphics reach 3:1. Use the approved pairings only.

Source: plugin/skills/design-language/SKILL.md:76.

## AIS-b842473fa9e5

<!-- AIS-b842473fa9e5 -->
Never use colour alone to carry meaning: status, chart series and detections also carry a word, an icon, a label or a pattern.

Source: plugin/skills/design-language/SKILL.md:77.

## AIS-0ea1ef6ef832

<!-- AIS-0ea1ef6ef832 -->
Everything works with a keyboard, shows the brand focus ring, and offers targets of at least 24 × 24 px. Touch, gloved-operator and icon-only targets on websites and operator screens are 44 × 44 px; desktop product toolbars may use 36 px buttons.

Source: plugin/skills/design-language/SKILL.md:78.

## AIS-a0455fdcd424

<!-- AIS-a0455fdcd424 -->
Every informative image, chart and illustration has a text alternative; decorative ones are hidden from assistive technology. Videos have captions.

Source: plugin/skills/design-language/SKILL.md:79.

## AIS-8cfb23802bad

<!-- AIS-8cfb23802bad -->
Pages declare their language, use headings in order, and keep text as real text, never as images of text.

Source: plugin/skills/design-language/SKILL.md:80.

## AIS-80f4819ee4c0

<!-- AIS-80f4819ee4c0 -->
`references/tokens.md`: every colour value and role

Source: plugin/skills/design-language/SKILL.md:86.

## AIS-88161f465255

<!-- AIS-88161f465255 -->
`references/colour.md`: Colour

Source: plugin/skills/design-language/SKILL.md:87.

## AIS-90211f0acad6

<!-- AIS-90211f0acad6 -->
`references/typography.md`: Typography

Source: plugin/skills/design-language/SKILL.md:88.

## AIS-d98188694390

<!-- AIS-d98188694390 -->
`references/layout.md`: Layout and shape

Source: plugin/skills/design-language/SKILL.md:89.

## AIS-a5fe81d54e81

<!-- AIS-a5fe81d54e81 -->
`references/imagery.md`: Imagery

Source: plugin/skills/design-language/SKILL.md:90.

## AIS-7614b27f9dce

<!-- AIS-7614b27f9dce -->
`references/patterns.md`: Patterns

Source: plugin/skills/design-language/SKILL.md:91.

## AIS-a6db6f9b092b

<!-- AIS-a6db6f9b092b -->
`references/icons.md`: Icons

Source: plugin/skills/design-language/SKILL.md:92.

## AIS-86eb62ef5abf

<!-- AIS-86eb62ef5abf -->
`references/data.md`: Data visualisation

Source: plugin/skills/design-language/SKILL.md:93.

## AIS-004031dca641

<!-- AIS-004031dca641 -->
`references/motion.md`: Motion

Source: plugin/skills/design-language/SKILL.md:94.

## AIS-1598f98216b8

<!-- AIS-1598f98216b8 -->
`references/accessibility.md`: Accessibility

Source: plugin/skills/design-language/SKILL.md:95.

## AIS-730edfca3385

<!-- AIS-730edfca3385 -->
**WCAG 2.2 level AA** applies to everything we publish: websites, landing pages, the Rosepetal app, PDFs, slides, emails and videos. It is also the level that European accessibility law expects through EN 301 549. The rules below translate it into our brand; when in doubt, the WCAG success criterion wins.

Source: plugin/skills/design-language/references/accessibility.md:5.

## AIS-fbe67d893eed

<!-- AIS-fbe67d893eed -->
| Principle | What it means for us |

Source: plugin/skills/design-language/references/accessibility.md:7.

## AIS-2d400d881de2

<!-- AIS-2d400d881de2 -->
| **Perceivable** | Contrast from the approved pairings, text alternatives, captions, nothing conveyed by colour alone |

Source: plugin/skills/design-language/references/accessibility.md:9.

## AIS-629b6701703b

<!-- AIS-629b6701703b -->
| **Operable** | Keyboard access everywhere, a visible focus ring, generous targets, motion that respects the system setting |

Source: plugin/skills/design-language/references/accessibility.md:10.

## AIS-fa56eb7f8db1

<!-- AIS-fa56eb7f8db1 -->
| **Understandable** | Plain language in English, Spanish and Catalan, predictable navigation, clear form errors |

Source: plugin/skills/design-language/references/accessibility.md:11.

## AIS-af56bb7fa635

<!-- AIS-af56bb7fa635 -->
| **Robust** | Semantic HTML first, ARIA only to fill gaps, tested with real assistive technology |

Source: plugin/skills/design-language/references/accessibility.md:12.

## AIS-31ae382c4d81

<!-- AIS-31ae382c4d81 -->
Every pairing below is measured from the token values when the guide is built; a pairing below its minimum stops the build.

Source: plugin/skills/design-language/references/accessibility.md:16.

## AIS-8a4e27be9983

<!-- AIS-8a4e27be9983 -->
**Text** needs 4.5:1, or 3:1 when it is at least 24 px, or 18.7 px bold (14 pt).

Source: plugin/skills/design-language/references/accessibility.md:18.

## AIS-49a1ec57bf32

<!-- AIS-49a1ec57bf32 -->
**Controls and meaningful graphics** need 3:1: field borders, toggles, focus rings, chart lines, detection boxes and status icons.

Source: plugin/skills/design-language/references/accessibility.md:19.

## AIS-08e18c5a4beb

<!-- AIS-08e18c5a4beb -->
**Never colour alone.** A status pairs its colour with an icon and a word; chart series have a legend or direct labels; detections have a label and a verdict.

Source: plugin/skills/design-language/references/accessibility.md:20.

## AIS-62d39c59cc5c

<!-- AIS-62d39c59cc5c -->
Light blue `#A7BFE4` is for text on blue backgrounds only; on white it is decoration, not text.

Source: plugin/skills/design-language/references/accessibility.md:21.

## AIS-f720ce51f56e

<!-- AIS-f720ce51f56e -->
Form field borders are `#64748B` (`--ais-border-strong`), which reaches 3:1, in every product and site.

Source: plugin/skills/design-language/references/accessibility.md:22.

## AIS-b3bcd68a368c

<!-- AIS-b3bcd68a368c -->
Success text and icons use the success green `#15803D` (5:1 on white), which is also the fill under white text. The lighter `#16A34A` reaches only 3.3:1 on white and is never used for text or under it.

Source: plugin/skills/design-language/references/accessibility.md:23.

## AIS-8b4a367db385

<!-- AIS-8b4a367db385 -->
On websites, body text is 16 px and nothing is smaller than 12 px; in printed and PDF documents nothing is smaller than 8.5 pt. In product interfaces, anything people read is at least 14 px; 12 px is only for chart axes and keyboard keys.

Source: plugin/skills/design-language/references/accessibility.md:27.

## AIS-fe20fbe07d78

<!-- AIS-fe20fbe07d78 -->
Pages reflow at 320 CSS px wide and at 200% zoom without horizontal scrolling or lost content.

Source: plugin/skills/design-language/references/accessibility.md:28.

## AIS-8a81adfec287

<!-- AIS-8a81adfec287 -->
Layouts tolerate user text spacing: 1.5 line height, 2× paragraph spacing, 0.12 em letter spacing, 0.16 em word spacing.

Source: plugin/skills/design-language/references/accessibility.md:29.

## AIS-8c51d00a7e03

<!-- AIS-8c51d00a7e03 -->
Number ranges, file and product names and hyphenated words never break across lines.

Source: plugin/skills/design-language/references/accessibility.md:30.

## AIS-478c1ce1beb0

<!-- AIS-478c1ce1beb0 -->
Text stays real text: never an image of text, never text baked into a photograph.

Source: plugin/skills/design-language/references/accessibility.md:31.

## AIS-b9845ac68ffc

<!-- AIS-b9845ac68ffc -->
Every action works with a keyboard, in an order that follows the visual layout. Nothing traps focus.

Source: plugin/skills/design-language/references/accessibility.md:35.

## AIS-be45e0a5b7b0

<!-- AIS-be45e0a5b7b0 -->
The focus ring (`--ais-focus-ring`, 2 px action blue with a 2 px white gap) appears on every interactive element and is never removed.

Source: plugin/skills/design-language/references/accessibility.md:36.

## AIS-f67bdf702c4e

<!-- AIS-f67bdf702c4e -->
Sticky headers never cover the focused element: pages set `scroll-padding-top` to the header height.

Source: plugin/skills/design-language/references/accessibility.md:37.

## AIS-40eee0a6e0a4

<!-- AIS-40eee0a6e0a4 -->
Every page starts with a skip link to the main content.

Source: plugin/skills/design-language/references/accessibility.md:38.

## AIS-78c22fc28ce1

<!-- AIS-78c22fc28ce1 -->
Interactive targets are at least **24 × 24 px**. On websites and operator screens, primary actions, navigation, touch targets, controls used by gloved operators and icon-only buttons are **44 × 44 px**. Desktop product toolbars may use 36 px buttons with 16 px icons. Inline text links are exempt but keep their underline.

Source: plugin/skills/design-language/references/accessibility.md:42.

## AIS-ddf086b63990

<!-- AIS-ddf086b63990 -->
All motion follows [Motion](motion.md) and stops when the system asks for reduced motion.

Source: plugin/skills/design-language/references/accessibility.md:46.

## AIS-73400e730424

<!-- AIS-73400e730424 -->
Nothing flashes more than three times per second.

Source: plugin/skills/design-language/references/accessibility.md:47.

## AIS-a87729217b00

<!-- AIS-a87729217b00 -->
Anything that moves or updates on its own for more than five seconds has a pause control, except purely decorative header effects and the logo strip, which pauses on hover and off screen.

Source: plugin/skills/design-language/references/accessibility.md:48.

## AIS-88020382c572

<!-- AIS-88020382c572 -->
Video never plays sound by itself. Every video has captions; content carried only by the picture gets audio description or a transcript.

Source: plugin/skills/design-language/references/accessibility.md:49.

## AIS-19ec0149b762

<!-- AIS-19ec0149b762 -->
| Content | Text alternative |

Source: plugin/skills/design-language/references/accessibility.md:53.

## AIS-2c8aa0bb4156

<!-- AIS-2c8aa0bb4156 -->
| **Photograph that informs** | What the image proves, in one sentence: «AIS REV 360 inspecting wine bottles on a bottling line.» |

Source: plugin/skills/design-language/references/accessibility.md:55.

## AIS-4f2882523e76

<!-- AIS-4f2882523e76 -->
| **Detection or result** | The verdict and the finding: «Rejected: the lot number reads A2391, expected A2319.» |

Source: plugin/skills/design-language/references/accessibility.md:56.

## AIS-4db8f22f42f8

<!-- AIS-4db8f22f42f8 -->
| **Illustration** | What it explains, as in the library captions |

Source: plugin/skills/design-language/references/accessibility.md:57.

## AIS-80beaf119fd9

<!-- AIS-80beaf119fd9 -->
| **Chart** | Title and a one-sentence finding as the alternative, plus a table view with the data |

Source: plugin/skills/design-language/references/accessibility.md:58.

## AIS-1139841b379a

<!-- AIS-1139841b379a -->
| **Logo** | The brand name only; never «logo of» |

Source: plugin/skills/design-language/references/accessibility.md:59.

## AIS-64b256821816

<!-- AIS-64b256821816 -->
| **Decorative image or icon next to its label** | Empty alternative (`alt=""`) or `aria-hidden="true"` |

Source: plugin/skills/design-language/references/accessibility.md:60.

## AIS-5e1f65fd091a

<!-- AIS-5e1f65fd091a -->
Every field has a visible label above it; placeholders are examples, never labels.

Source: plugin/skills/design-language/references/accessibility.md:64.

## AIS-e902ce8efcf4

<!-- AIS-e902ce8efcf4 -->
Help text sits under the label and is linked to the field.

Source: plugin/skills/design-language/references/accessibility.md:65.

## AIS-e4848dfe5c73

<!-- AIS-e4848dfe5c73 -->
Errors appear next to the field in text with an error icon, are announced to screen readers, and say how to fix the problem.

Source: plugin/skills/design-language/references/accessibility.md:66.

## AIS-30959b27fc99

<!-- AIS-30959b27fc99 -->
Required fields are marked in words, not only with an asterisk.

Source: plugin/skills/design-language/references/accessibility.md:67.

## AIS-631f64e3632f

<!-- AIS-631f64e3632f -->
Every page declares its language (`lang="en"`, `lang="es"`, `lang="ca"`), and passages in another language declare theirs.

Source: plugin/skills/design-language/references/accessibility.md:71.

## AIS-b8b545d1bd17

<!-- AIS-b8b545d1bd17 -->
Headings run in order without skipping levels, and each page has one H1.

Source: plugin/skills/design-language/references/accessibility.md:72.

## AIS-03ee96423c87

<!-- AIS-03ee96423c87 -->
Link text says where it goes: «Download the AIS REV 360 datasheet (PDF, 2 MB)», never «click here».

Source: plugin/skills/design-language/references/accessibility.md:73.

## AIS-880fd6d57144

<!-- AIS-880fd6d57144 -->
Write in plain language, following [Voice](../../communications/references/voice.md).

Source: plugin/skills/design-language/references/accessibility.md:74.

## AIS-5549fe3f229b

<!-- AIS-5549fe3f229b -->
PDFs are tagged (PDF/UA), with a title, a language, headings, a reading order and alternatives for every informative image.

Source: plugin/skills/design-language/references/accessibility.md:78.

## AIS-0cf014d46972

<!-- AIS-0cf014d46972 -->
Slides have a unique title each, use the type sizes in Typography, and keep reading order from top left.

Source: plugin/skills/design-language/references/accessibility.md:79.
