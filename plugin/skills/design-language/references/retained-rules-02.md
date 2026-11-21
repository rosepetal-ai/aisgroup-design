# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-7d23fe39f896

<!-- AIS-7d23fe39f896 -->
Never deliver a scanned or flattened document as the only version.

Source: plugin/skills/design-language/references/accessibility.md:80.

## AIS-6d84cdfc4f7f

<!-- AIS-6d84cdfc4f7f -->
Every release of a website, landing page or product screen passes these checks before it ships.

Source: plugin/skills/design-language/references/accessibility.md:84.

## AIS-434cc8b8e47b

<!-- AIS-434cc8b8e47b -->
| Check | How | Pass |

Source: plugin/skills/design-language/references/accessibility.md:86.

## AIS-98aeaf919a85

<!-- AIS-98aeaf919a85 -->
| **Automated** | axe-core on every page template, at desktop and phone widths | No violations |

Source: plugin/skills/design-language/references/accessibility.md:88.

## AIS-0066622cbf37

<!-- AIS-0066622cbf37 -->
| **Brand check** | The [brand check script](https://aisgroup-design.web.app/downloads/qa/brand-check.js) on every page template | No findings |

Source: plugin/skills/design-language/references/accessibility.md:89.

## AIS-585a10f89b6e

<!-- AIS-585a10f89b6e -->
| **Type and hover** | `type-check.mjs` and `hover-audit.mjs` on every template | No text outside the ten styles; one hover behaviour per kind of link |

Source: plugin/skills/design-language/references/accessibility.md:90.

## AIS-a71916c78c22

<!-- AIS-a71916c78c22 -->
| **States** | Screenshot every hover, open menu, focus state, mobile menu and overlay, in every theme | Every state matches the guide; the scripts cannot see states |

Source: plugin/skills/design-language/references/accessibility.md:91.

## AIS-4e47615c8279

<!-- AIS-4e47615c8279 -->
| **Keyboard** | Tab through every page and complete every task | Everything reachable, focus always visible |

Source: plugin/skills/design-language/references/accessibility.md:92.

## AIS-ec81bb774b1d

<!-- AIS-ec81bb774b1d -->
| **Screen reader** | NVDA with Firefox or Chrome; VoiceOver with Safari | Tasks complete, content in order |

Source: plugin/skills/design-language/references/accessibility.md:93.

## AIS-e6df8fa20632

<!-- AIS-e6df8fa20632 -->
| **Zoom and reflow** | 200% zoom and a 320 px wide window | Nothing lost or cut, no sideways scrolling |

Source: plugin/skills/design-language/references/accessibility.md:94.

## AIS-3cde741ab44d

<!-- AIS-3cde741ab44d -->
| **Reduced motion** | Turn on the system setting | No movement, nothing missing |

Source: plugin/skills/design-language/references/accessibility.md:95.

## AIS-d521f60209e0

<!-- AIS-d521f60209e0 -->
| **Colour** | Colour-blindness simulation on charts and status | Every meaning still readable |

Source: plugin/skills/design-language/references/accessibility.md:96.

## AIS-32be4c8155dc

<!-- AIS-32be4c8155dc -->
This guide is held to the same bar: every page passes axe-core with WCAG 2.2 AA rules at desktop and phone widths, and the brand check.

Source: plugin/skills/design-language/references/accessibility.md:98.

## AIS-d79bef2d7210

<!-- AIS-d79bef2d7210 -->
Eight colours carry the brand in every website, document, presentation, post and campaign: four blues and four neutrals. Every other colour in those pieces is a step of their scales or a status colour. Each blue has one job, so they never compete: brand blue says who we are, deep blue gives depth, action blue says «click», and light blue highlights on blue.

Source: plugin/skills/design-language/references/colour.md:5.

## AIS-e0a25025b0c7

<!-- AIS-e0a25025b0c7 -->
The four approved backgrounds and what goes on each. Every text pairing passes WCAG AA.

Source: plugin/skills/design-language/references/colour.md:9.

## AIS-59cc984ee3fd

<!-- AIS-59cc984ee3fd -->
On dark backgrounds, the same three states use their dark-mode steps:

Source: plugin/skills/design-language/references/colour.md:13.

## AIS-801f4527b3ae

<!-- AIS-801f4527b3ae -->
Status colours belong to interfaces, charts and inspection results. They always come with a word or an icon, so colour is never the only signal, and they never decorate.

Source: plugin/skills/design-language/references/colour.md:15.

## AIS-e5accd63a03d

<!-- AIS-e5accd63a03d -->
| Piece | Proportion |

Source: plugin/skills/design-language/references/colour.md:19.

## AIS-c87d097e6fb6

<!-- AIS-c87d097e6fb6 -->
| Light | About **70% white and section grey**, **30% blue**: brand blue for actions and bands, deep blue for closing sections. |

Source: plugin/skills/design-language/references/colour.md:21.

## AIS-73fff95692d8

<!-- AIS-73fff95692d8 -->
| Dark | About **70% deep blue or night**, **30% white text and light content**, with light blues for signals. |

Source: plugin/skills/design-language/references/colour.md:22.

## AIS-5ec4e5f6a5d1

<!-- AIS-5ec4e5f6a5d1 -->
These guide the graphic areas, not individual pixels; photographs do not count.

Source: plugin/skills/design-language/references/colour.md:24.

## AIS-a7e1e8d66f6a

<!-- AIS-a7e1e8d66f6a -->
Ratios follow WCAG 2.2. Body text needs at least **4.5:1**; large text, 24 px or 18.7 px bold (14 pt), needs **3:1**. The app’s key pairs, in light and dark mode, are on Light and dark themes.

Source: plugin/skills/design-language/references/colour.md:28.

## AIS-dfbc4852fcfd

<!-- AIS-dfbc4852fcfd -->
Product interfaces, charts and dark mode need finer steps. They come from the same two scales, so they always stay in the family. Pick them by role first; the scales are the reference. Each role is a token of `@aisgroup/design`, shown here in both themes; every token, its contrast and where each theme applies are on Light and dark themes.

Source: plugin/skills/design-language/references/colour.md:32.

## AIS-1e55e2451aab

<!-- AIS-1e55e2451aab -->
One slate family for text, lines and surfaces. Its cool cast belongs with the blue; never mix in warm or pure greys.

Source: plugin/skills/design-language/references/colour.md:40.

## AIS-af2eeeb038e4

<!-- AIS-af2eeeb038e4 -->
Charts and product interfaces need more colours than the brand: chart series, tags, defect classes, dataset splits. Those are the six **data colours** (`--ais-data-1` to `-6`), validated for colour-blind readers and contrast and taken, like everything else, from the Rosepetal design system. They appear only in charts, product interfaces and data graphics, never in logos, layouts or as decoration. See [Data visualisation](data.md).

Source: plugin/skills/design-language/references/colour.md:44.

## AIS-7e03668f0d3d

<!-- AIS-7e03668f0d3d -->
Illustrations use the neutrals for materials and colour only for meaning: blue for the camera signal, and the dark-mode success and error colours for pass and reject.

Source: plugin/skills/design-language/references/colour.md:46.

## AIS-854c5a4e889d

<!-- AIS-854c5a4e889d -->
HEX and sRGB are the digital reference. Print references: use the RGB and hex values; Pantone and CMYK equivalents are not defined. Specify a blue ink matched to `#17356E`. Black appears only as the black logo, when a job can print nothing else.

Source: plugin/skills/design-language/references/colour.md:50.

## AIS-d30bbbea2ad4

<!-- AIS-d30bbbea2ad4 -->
| The data’s job | Form |

Source: plugin/skills/design-language/references/data.md:5.

## AIS-9ba2920d3758

<!-- AIS-9ba2920d3758 -->
| Compare categories | Bars, sorted by value, horizontal when labels are long |

Source: plugin/skills/design-language/references/data.md:7.

## AIS-b6343ec282c8

<!-- AIS-b6343ec282c8 -->
| Show change over time | Line; columns for few, discrete periods |

Source: plugin/skills/design-language/references/data.md:8.

## AIS-7a7d399e8098

<!-- AIS-7a7d399e8098 -->
| Part of a whole | A single stacked bar; a pie only for two or three parts |

Source: plugin/skills/design-language/references/data.md:9.

## AIS-a47b70dcfb92

<!-- AIS-a47b70dcfb92 -->
| Show a distribution | Histogram or dot strip |

Source: plugin/skills/design-language/references/data.md:10.

## AIS-86c61507e75a

<!-- AIS-86c61507e75a -->
| One number that matters | A figure: value, label and the comparison it needs |

Source: plugin/skills/design-language/references/data.md:11.

## AIS-70b36d17cc2e

<!-- AIS-70b36d17cc2e -->
| Exact values to look up | A table with tabular figures |

Source: plugin/skills/design-language/references/data.md:12.

## AIS-cdae359a5ca4

<!-- AIS-cdae359a5ca4 -->
If one number carries the message, use a figure, not a chart. Never use 3D, two y-axes on one chart, or decorative charts without real data.

Source: plugin/skills/design-language/references/data.md:14.

## AIS-0fbfef042dd4

<!-- AIS-0fbfef042dd4 -->
Six data colours, validated for colour-blind readers and for contrast on white and on the dark surface. Every one comes from the Rosepetal design system; the dark column is the same hue family stepped for dark backgrounds.

Source: plugin/skills/design-language/references/data.md:18.

## AIS-456251f45bed

<!-- AIS-456251f45bed -->
**Categorical:** assign in order, starting with blue. The colour follows the entity: when a filter removes a series, the others keep their colour.

Source: plugin/skills/design-language/references/data.md:20.

## AIS-19d0472fdeb8

<!-- AIS-19d0472fdeb8 -->
**Sequential:** one hue, light to dark for more. On dark backgrounds the scale runs dark to light.

Source: plugin/skills/design-language/references/data.md:21.

## AIS-1ac3beb77afe

<!-- AIS-1ac3beb77afe -->
**Diverging:** orange below and blue above a reference, with a neutral grey at the centre.

Source: plugin/skills/design-language/references/data.md:22.

## AIS-42c9e00b271a

<!-- AIS-42c9e00b271a -->
**Status:** green, amber and red are reserved for status, always with a word or an icon, and never used as series colours.

Source: plugin/skills/design-language/references/data.md:23.

## AIS-87911ecc2633

<!-- AIS-87911ecc2633 -->
| Mark | Specification |

Source: plugin/skills/design-language/references/data.md:27.

## AIS-919adff636d9

<!-- AIS-919adff636d9 -->
| **Bars and columns** | At most 24 px thick, square ends, growing from one baseline at zero; 2 px of white between touching bars and stacked segments |

Source: plugin/skills/design-language/references/data.md:29.

## AIS-dce432edda13

<!-- AIS-dce432edda13 -->
| **Lines** | 2 px, rounded joins; an 8 px dot with a 2 px white ring marks the last point |

Source: plugin/skills/design-language/references/data.md:30.

## AIS-85c8ae54dc3c

<!-- AIS-85c8ae54dc3c -->
| **Areas** | The series colour at 10% opacity |

Source: plugin/skills/design-language/references/data.md:31.

## AIS-f03a432f06a7

<!-- AIS-f03a432f06a7 -->
| **Gridlines** | 1 px, `#E2E8F0`, solid, behind the data; the zero baseline in `#94A3B8` |

Source: plugin/skills/design-language/references/data.md:32.

## AIS-32750ec6bcc5

<!-- AIS-32750ec6bcc5 -->
| **Axis text** | Caption style (12 px), secondary text colour, tabular figures, rounded ticks (0, 10, 20 or 1K, 2K) |

Source: plugin/skills/design-language/references/data.md:33.

## AIS-76d9cd343f1c

<!-- AIS-76d9cd343f1c -->
One series needs no legend: the title names it. From two series, show a legend above the chart; with up to four, also label the lines or bars directly.

Source: plugin/skills/design-language/references/data.md:37.

## AIS-ef48704e03dc

<!-- AIS-ef48704e03dc -->
Label selectively: the last value, the maximum or the one series the story is about. Never a number on every point.

Source: plugin/skills/design-language/references/data.md:38.

## AIS-8f3774773fff

<!-- AIS-8f3774773fff -->
Values, labels and legends are set in text colours (ink and secondary text), never in a series colour. The coloured mark beside the text carries the identity.

Source: plugin/skills/design-language/references/data.md:39.

## AIS-6b5a053d9a7c

<!-- AIS-6b5a053d9a7c -->
Titles use Body Semibold and state what is plotted; a subtitle gives the unit, the period and, for illustrative data, says so.

Source: plugin/skills/design-language/references/data.md:40.

## AIS-ff754619f7ff

<!-- AIS-ff754619f7ff -->
Marketing pieces, landing pages, documents and slides use one toolkit, so a chart made by anyone, or by an AI agent, comes out on brand. The look lives in a [Vega-Lite](https://vega.github.io/vega-lite/) config; a chart is a short spec that only describes the data. Every chart below is rendered from its spec by the same command.

Source: plugin/skills/design-language/references/data.md:44.

## AIS-bd33509c8fe6

<!-- AIS-bd33509c8fe6 -->
**Live charts on websites** use the same spec and config with Vega-Embed, so they gain tooltips without changing the look. **The Rosepetal app** keeps its own JavaScript chart library, where `--chart-1`, `--chart-2` and `--chart-3` are the blue, orange and violet data colours (1, 2 and 5); [the ECharts theme](https://aisgroup-design.web.app/downloads/charts/ais-echarts-theme.json) (with a dark version) and the data tokens give it the same colours, type and marks.

Source: plugin/skills/design-language/references/data.md:46.

## AIS-22ca7700b014

<!-- AIS-22ca7700b014 -->
Web charts are interactive: hovering a bar or a point shows its exact value, line charts show a crosshair across all series, and every chart offers a table view with the same data. Filters sit in one row above the chart they control.

Source: plugin/skills/design-language/references/data.md:50.

## AIS-7e1d75e41fde

<!-- AIS-7e1d75e41fde -->
130 icons for interfaces, documents, video and infographics, grouped by topic, from Lucide 1.48.0. Download them all as [ais-icons.zip](https://aisgroup-design.web.app/downloads/icons/ais-icons.zip); the full library of more than 2,000 icons is at [lucide.dev](https://lucide.dev/icons/).

Source: plugin/skills/design-language/references/icons.md:5.

## AIS-4ebae5e886ad

<!-- AIS-4ebae5e886ad -->
| Where | How |

Source: plugin/skills/design-language/references/icons.md:9.

## AIS-c9dfc1639c13

<!-- AIS-c9dfc1639c13 -->
| **Rosepetal app (Vue)** | `npm install @lucide/vue`, then import by name: `import { DownloadIcon } from '@lucide/vue'`. This is what the Rosepetal design system uses. |

Source: plugin/skills/design-language/references/icons.md:11.

## AIS-f7c5df5e312f

<!-- AIS-f7c5df5e312f -->
| **Websites (Astro, HTML)** | `npm install lucide-static` and inline the SVG file, or paste it from the core set. Inline SVG inherits the text colour. |

Source: plugin/skills/design-language/references/icons.md:12.

## AIS-9aea27d01319

<!-- AIS-9aea27d01319 -->
| **React** | `npm install lucide-react`, then `import { Download } from 'lucide-react'`. |

Source: plugin/skills/design-language/references/icons.md:13.

## AIS-e9b09dcf90ef

<!-- AIS-e9b09dcf90ef -->
| **Figma** | The Lucide plugin from the Figma Community inserts icons as editable vectors at 24 px. |

Source: plugin/skills/design-language/references/icons.md:14.

## AIS-bf0a0a8724fb

<!-- AIS-bf0a0a8724fb -->
| **Documents and slides** | Insert the SVG from the core set; Word, PowerPoint, Keynote and Google Slides keep it sharp. Recolour it to the text colour, never to a new colour. |

Source: plugin/skills/design-language/references/icons.md:15.

## AIS-ee953ab01a05

<!-- AIS-ee953ab01a05 -->
Keep every project on the same Lucide release line, and update all of them together, so an icon never changes shape between the website and the product.

Source: plugin/skills/design-language/references/icons.md:17.

## AIS-fc126b1bd590

<!-- AIS-fc126b1bd590 -->
<script setup>

Source: plugin/skills/design-language/references/icons.md:20.

## AIS-6c9656210a02

<!-- AIS-6c9656210a02 -->
</script>

Source: plugin/skills/design-language/references/icons.md:22.

## AIS-6b800aeb6dd6

<!-- AIS-6b800aeb6dd6 -->
<button class="rp-btn"><DownloadIcon class="size-4" aria-hidden="true" /> Download</button>

Source: plugin/skills/design-language/references/icons.md:24.

## AIS-f06dceb55bea

<!-- AIS-f06dceb55bea -->
| Size | Use | Stroke |

Source: plugin/skills/design-language/references/icons.md:29.

## AIS-3db5878ffdf4

<!-- AIS-3db5878ffdf4 -->
| **16 px** | Buttons, table rows, inline with 14–16 px text, the product interface | 2 px on the grid (1.33 px rendered) |

Source: plugin/skills/design-language/references/icons.md:31.

## AIS-c5985562b5eb

<!-- AIS-c5985562b5eb -->
| **20 px** | Navigation, inputs, menus | 2 px on the grid (1.67 px rendered) |

Source: plugin/skills/design-language/references/icons.md:32.

## AIS-b5d8d69c3887

<!-- AIS-b5d8d69c3887 -->
| **24 px** | Standalone icons, cards, lists of features | 2 px |

Source: plugin/skills/design-language/references/icons.md:33.

## AIS-18edc4e22986

<!-- AIS-18edc4e22986 -->
| **32–48 px** | Large feature icons on websites and slides | 2 px fixed: set `absoluteStrokeWidth` |

Source: plugin/skills/design-language/references/icons.md:34.

## AIS-2b46beb18bf7

<!-- AIS-2b46beb18bf7 -->
Icons use `currentColor`, so they always match their label: ink for text, secondary text for metadata, action blue for links and actions, white on blue. Success, warning and error colours appear only when the icon means that status. Never fill an icon, never use two colours in one icon, never apply a gradient.

Source: plugin/skills/design-language/references/icons.md:38.

## AIS-a59bcd1fe18a

<!-- AIS-a59bcd1fe18a -->
The icon comes before its label, 8 px apart at every text size.

Source: plugin/skills/design-language/references/icons.md:42.

## AIS-cfcc3b60a750

<!-- AIS-cfcc3b60a750 -->
It is centred on the label’s cap height, not on the line box, the same rule as overlay chips.

Source: plugin/skills/design-language/references/icons.md:43.

## AIS-9a4c1534801d

<!-- AIS-9a4c1534801d -->
An icon with no label needs an accessible name (`aria-label`), a tooltip and a 44 px touch target; in desktop product toolbars, a 36 px button.

Source: plugin/skills/design-language/references/icons.md:44.

## AIS-a4ecf5262e4c

<!-- AIS-a4ecf5262e4c -->
One icon per action. Do not decorate headings or paragraphs with icons.

Source: plugin/skills/design-language/references/icons.md:45.

## AIS-e6775f25f203

<!-- AIS-e6775f25f203 -->
Icons in infographics name the topic of a figure; the figure itself carries the message.

Source: plugin/skills/design-language/references/icons.md:49.

## AIS-04689f5e12c7

<!-- AIS-04689f5e12c7 -->
Place the icon at 24 px in a 48 px square tile: blue-50 `#EDF2FA` with a brand blue `#17356E` icon on white, deep blue `#10254C` with a white icon on brand blue. Square corners, no border, no shadow.

Source: plugin/skills/design-language/references/icons.md:51.

## AIS-9e551b200dc7

<!-- AIS-9e551b200dc7 -->
Without a tile, use 32 or 48 px with `absoluteStrokeWidth`, so the line stays 2 px.

Source: plugin/skills/design-language/references/icons.md:52.

## AIS-52323418be7c

<!-- AIS-52323418be7c -->
One icon per figure; a set of three uses three icons of equal visual weight.

Source: plugin/skills/design-language/references/icons.md:53.

## AIS-03e9f20cfe2f

<!-- AIS-03e9f20cfe2f -->
The figure uses the Subheading style with tabular figures; its label uses Small in secondary text.

Source: plugin/skills/design-language/references/icons.md:54.

## AIS-8bd5225c2430

<!-- AIS-8bd5225c2430 -->
Figures follow the Voice page: real values with their conditions, never invented numbers.

Source: plugin/skills/design-language/references/icons.md:55.

## AIS-8959a9aff8b4

<!-- AIS-8959a9aff8b4 -->
| Icon | Means |

Source: plugin/skills/design-language/references/icons.md:59.

## AIS-09340ca40933

<!-- AIS-09340ca40933 -->
| `arrow-right` | Go to the next page or action; the arrow in text links and split buttons |

Source: plugin/skills/design-language/references/icons.md:61.

## AIS-b9b2179fcb66

<!-- AIS-b9b2179fcb66 -->
| `external-link` | Opens another website |

Source: plugin/skills/design-language/references/icons.md:62.

## AIS-e195da9d36d9

<!-- AIS-e195da9d36d9 -->
| `chevron-right`, `chevron-down` | Opens a level below, expands a section |

Source: plugin/skills/design-language/references/icons.md:63.

## AIS-eb450377161e

<!-- AIS-eb450377161e -->
| `arrow-up-right` | Opens a document in a new view, such as a PDF or a datasheet |

Source: plugin/skills/design-language/references/icons.md:64.

## AIS-9ce7a6545cfb

<!-- AIS-9ce7a6545cfb -->
| `download` | Saves a file |

Source: plugin/skills/design-language/references/icons.md:65.

## AIS-aeae1640314d

<!-- AIS-aeae1640314d -->
| `play`, `pause` | Starts or pauses a video; the button shows the action, not the state |

Source: plugin/skills/design-language/references/icons.md:66.

## AIS-385654700881

<!-- AIS-385654700881 -->
| `x` | Closes or removes |

Source: plugin/skills/design-language/references/icons.md:67.

## AIS-957beaf9a66b

<!-- AIS-957beaf9a66b -->
| `check`, `circle-check` | Done, passed |

Source: plugin/skills/design-language/references/icons.md:68.

## AIS-28e567492b7f

<!-- AIS-28e567492b7f -->
| `triangle-alert` | Warning that needs attention |

Source: plugin/skills/design-language/references/icons.md:69.

## AIS-36406d73763f

<!-- AIS-36406d73763f -->
| `circle-x` | Error or reject |

Source: plugin/skills/design-language/references/icons.md:70.

## AIS-188e72e98248

<!-- AIS-188e72e98248 -->
| `info` | Extra information |

Source: plugin/skills/design-language/references/icons.md:71.

## AIS-9243395d440a

<!-- AIS-9243395d440a -->
Unicode arrows, ticks and bullets (`→`, `✓`, `•`) or emoji: they change with every font.

Source: plugin/skills/design-language/references/icons.md:75.

## AIS-e0c4c7c4c409

<!-- AIS-e0c4c7c4c409 -->
Another icon library, or icons redrawn, cropped or edited by hand.

Source: plugin/skills/design-language/references/icons.md:76.

## AIS-dfbd79fef6b8

<!-- AIS-dfbd79fef6b8 -->
Filled, duotone or 3D icons.

Source: plugin/skills/design-language/references/icons.md:77.

## AIS-e20dae13c42c

<!-- AIS-e20dae13c42c -->
Icons as decoration, or more than one icon per action.

Source: plugin/skills/design-language/references/icons.md:78.

## AIS-728f2fa5f68e

<!-- AIS-728f2fa5f68e -->
Start from the message, not from the image bank. Each message has one image type that proves it.

Source: plugin/skills/design-language/references/imagery.md:5.

## AIS-de1df919ebef

<!-- AIS-de1df919ebef -->
| When you need to say | Use |

Source: plugin/skills/design-language/references/imagery.md:7.

## AIS-2c1776980be4

<!-- AIS-2c1776980be4 -->
| This is what we build | [Machine](imagery.md#type-machine) |

Source: plugin/skills/design-language/references/imagery.md:9.

## AIS-c0e39407cd68

<!-- AIS-c0e39407cd68 -->
| It works in a real factory | [In production](imagery.md#type-line) |

Source: plugin/skills/design-language/references/imagery.md:10.
