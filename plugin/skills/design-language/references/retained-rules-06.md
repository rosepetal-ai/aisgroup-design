# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-ad457caff0c0

<!-- AIS-ad457caff0c0 -->
'Every other colour is a step of the blue (50–950) or neutral (0–900) scale, or a status colour. Never use a colour outside the palette, an approximate blue or a gradient between unrelated colours. The black logo is only for black-only printing and AIS website headers on white.'

Source: guide/src/content/guide/en/colour.mdx:7.

## AIS-01d3ea76652d

<!-- AIS-01d3ea76652d -->
Ratios follow WCAG 2.2. Body text needs at least **4.5:1**; large text, 24 px or 18.7 px bold (14 pt), needs **3:1**. The app’s key pairs, in light and dark mode, are on [Light and dark themes](/en/themes/#contrast).

Source: guide/src/content/guide/en/colour.mdx:49.

## AIS-0e6e0245e535

<!-- AIS-0e6e0245e535 -->
<Contrast lang="en" pairs={[

Source: guide/src/content/guide/en/colour.mdx:51.

## AIS-bf0c7646fd2e

<!-- AIS-bf0c7646fd2e -->
['#FFFFFF', '#17356E', 'Primary buttons, reversed logo, text on brand blue'],

Source: guide/src/content/guide/en/colour.mdx:52.

## AIS-bb17224d51fd

<!-- AIS-bb17224d51fd -->
['#FFFFFF', '#10254C', 'Text on deep sections and footers'],

Source: guide/src/content/guide/en/colour.mdx:53.

## AIS-23aea97b616e

<!-- AIS-23aea97b616e -->
['#3664B3', '#FFFFFF', 'Links and text actions on white'],

Source: guide/src/content/guide/en/colour.mdx:54.

## AIS-c87802a84a8a

<!-- AIS-c87802a84a8a -->
['#3664B3', '#F1F5F9', 'Links on section grey'],

Source: guide/src/content/guide/en/colour.mdx:55.

## AIS-9db589e01a46

<!-- AIS-9db589e01a46 -->
['#A7BFE4', '#17356E', 'Highlights and links on brand blue'],

Source: guide/src/content/guide/en/colour.mdx:56.

## AIS-313b521592ca

<!-- AIS-313b521592ca -->
['#0F1729', '#F1F5F9', 'Text on section backgrounds'],

Source: guide/src/content/guide/en/colour.mdx:57.

## AIS-42608409f7b6

<!-- AIS-42608409f7b6 -->
['#4B5563', '#FFFFFF', 'Secondary text on white'],

Source: guide/src/content/guide/en/colour.mdx:58.

## AIS-f82eebb89814

<!-- AIS-f82eebb89814 -->
['#15803D', '#FFFFFF', 'Success messages'],

Source: guide/src/content/guide/en/colour.mdx:59.

## AIS-1f62f469a90f

<!-- AIS-1f62f469a90f -->
['#DC2626', '#FFFFFF', 'Error messages'],

Source: guide/src/content/guide/en/colour.mdx:60.

## AIS-c53387dc0fe3

<!-- AIS-c53387dc0fe3 -->
]} />

Source: guide/src/content/guide/en/colour.mdx:61.

## AIS-7fd6e0c93c40

<!-- AIS-7fd6e0c93c40 -->
Product interfaces, charts and dark mode need finer steps. They come from the same two scales, so they always stay in the family. Pick them by role first; the scales are the reference. Each role is a token of `@aisgroup/design`, shown here in both themes; every token, its contrast and where each theme applies are on [Light and dark themes](/en/themes/).

Source: guide/src/content/guide/en/colour.mdx:65.

## AIS-68f9ce734195

<!-- AIS-68f9ce734195 -->
Charts and product interfaces need more colours than the brand: chart series, tags, defect classes, dataset splits. Those are the six **data colours** (`--ais-data-1` to `-6`), validated for colour-blind readers and contrast and taken, like everything else, from the Rosepetal design system. They appear only in charts, product interfaces and data graphics, never in logos, layouts or as decoration. See [Data visualisation](/en/data/).

Source: guide/src/content/guide/en/colour.mdx:83.

## AIS-0fea0d982eee

<!-- AIS-0fea0d982eee -->
'Choose the chart by its job: bars to compare, lines for change over time, a single figure for one number, a table for exact values. Never pies with more than three parts, 3D, or two y-axes.'

Source: guide/src/content/guide/en/data.mdx:4.

## AIS-53bf9108c4d5

<!-- AIS-53bf9108c4d5 -->
'Series colours come from the six data colours in fixed order (--ais-data-1 to -6), never cycled or reordered. A seventh series becomes «Other» or small multiples.'

Source: guide/src/content/guide/en/data.mdx:5.

## AIS-d41b9fd3db2d

<!-- AIS-d41b9fd3db2d -->
'Magnitude uses one hue, light to dark (--ais-seq-*). Values above and below a reference use orange and blue around a neutral grey (--ais-div-*).'

Source: guide/src/content/guide/en/data.mdx:6.

## AIS-766079dbe724

<!-- AIS-766079dbe724 -->
'Status colours (success, warning, error) mean status only, with an icon or word, and are never a series colour.'

Source: guide/src/content/guide/en/data.mdx:7.

## AIS-bfcc2f67dd7a

<!-- AIS-bfcc2f67dd7a -->
'Text never takes a series colour; a legend appears from two series, direct labels on up to four, and every chart has a table view.'

Source: guide/src/content/guide/en/data.mdx:8.

## AIS-b431fa01dc53

<!-- AIS-b431fa01dc53 -->
**Live charts on websites** use the same spec and config with Vega-Embed, so they gain tooltips without changing the look. **The Rosepetal app** keeps its own JavaScript chart library, where `--chart-1`, `--chart-2` and `--chart-3` are the blue, orange and violet data colours (1, 2 and 5); [the ECharts theme](/downloads/charts/ais-echarts-theme.json) (with a dark version) and the data tokens give it the same colours, type and marks.

Source: guide/src/content/guide/en/data.mdx:60.

## AIS-7bde021474fd

<!-- AIS-7bde021474fd -->
'Use Lucide icons only, as shipped: 24 px grid, 2 px stroke, round caps and joins, no fill. Never redraw, edit or mix in another library.'

Source: guide/src/content/guide/en/icons.mdx:4.

## AIS-69cd8695880e

<!-- AIS-69cd8695880e -->
'Never type Unicode arrows, ticks or bullets (`→`, `✓`, `•`) or emoji as icons.'

Source: guide/src/content/guide/en/icons.mdx:5.

## AIS-b536675d1512

<!-- AIS-b536675d1512 -->
'Icons take the colour of their label (currentColor). Status colours only for status.'

Source: guide/src/content/guide/en/icons.mdx:6.

## AIS-f1998f6a0433

<!-- AIS-f1998f6a0433 -->
'Sizes are 16, 20 or 24 px; at 32 px and above, keep the stroke at 2 px with absoluteStrokeWidth.'

Source: guide/src/content/guide/en/icons.mdx:7.

## AIS-204bf6908b5c

<!-- AIS-204bf6908b5c -->
'An icon sits before its label, centred on the label’s cap height, 8 px apart. Icon-only buttons need an accessible name and a 44 px target; desktop product toolbars may use 36 px buttons with 16 px icons.'

Source: guide/src/content/guide/en/icons.mdx:8.

## AIS-08c70ce1b930

<!-- AIS-08c70ce1b930 -->
130 icons for interfaces, documents, video and infographics, grouped by topic, from Lucide 1.48.0. Download them all as [ais-icons.zip](/downloads/icons/ais-icons.zip); the full library of more than 2,000 icons is at [lucide.dev](https://lucide.dev/icons/).

Source: guide/src/content/guide/en/icons.mdx:15.

## AIS-9d758e5abb4d

<!-- AIS-9d758e5abb4d -->
'Use isometric technical illustrations to explain how something works; use photographs to prove that it works.'

Source: guide/src/content/guide/en/illustration.mdx:4.

## AIS-14b44eb2ff70

<!-- AIS-14b44eb2ff70 -->
'Draw real, buildable objects in depth order, with solid parts and no see-through edges. Never boxes with arrows.'

Source: guide/src/content/guide/en/illustration.mdx:5.

## AIS-b27f75596b43

<!-- AIS-b27f75596b43 -->
'Materials use the slate neutrals; colour carries meaning only: blue for the camera signal, green for a pass, amber `#D97706` for a part held for review, red for a reject.'

Source: guide/src/content/guide/en/illustration.mdx:6.

## AIS-d5aa1fec9a80

<!-- AIS-d5aa1fec9a80 -->
'Every figure uses one projection: 2:1 isometric, 45° azimuth and 30° elevation.'

Source: guide/src/content/guide/en/illustration.mdx:7.

## AIS-9a0840f694f8

<!-- AIS-9a0840f694f8 -->
Every figure comes in two versions: light for white and section grey, dark for the night blue `#0B1220` and dark cards. Both share the same drawing and frame, so either one can replace the other. Caption the figure with what it shows.

Source: guide/src/content/guide/en/illustration.mdx:13.

## AIS-7e86bf7c7364

<!-- AIS-7e86bf7c7364 -->
The drawings are SVG files. The bottling line is a 3D render, so it ships as WebP stills, taken through the same isometric camera as the drawings.

Source: guide/src/content/guide/en/illustration.mdx:15.

## AIS-9eff56774354

<!-- AIS-9eff56774354 -->
| Use an illustration to show | Use a photograph to show |

Source: guide/src/content/guide/en/illustration.mdx:21.

## AIS-3f7e9c380a8b

<!-- AIS-3f7e9c380a8b -->
| How an inspection decides, with the good part and the reject side by side | That a real machine runs at a real customer |

Source: guide/src/content/guide/en/illustration.mdx:23.

## AIS-6d4cdbd63e70

<!-- AIS-6d4cdbd63e70 -->
| Where a system runs: camera, cabinet, network | What the machine looks like |

Source: guide/src/content/guide/en/illustration.mdx:24.

## AIS-8b41933b07e8

<!-- AIS-8b41933b07e8 -->
| A process that is hidden, fast or inside an enclosure | A result with its figures |

Source: guide/src/content/guide/en/illustration.mdx:25.

## AIS-39e0b231338d

<!-- AIS-39e0b231338d -->
| **Real objects** | A control cabinet, a conveyor, a camera on its bracket. Every part sits on another part and could be built. |

Source: guide/src/content/guide/en/illustration.mdx:31.

## AIS-f1985745a3bd

<!-- AIS-f1985745a3bd -->
| **Solid, in depth order** | Parts are filled and drawn back to front, so near parts hide far parts. No see-through edges, no floating parts. |

Source: guide/src/content/guide/en/illustration.mdx:32.

## AIS-de0060c9371e

<!-- AIS-de0060c9371e -->
| **Projection** | 2:1 isometric for every figure: the camera sits at 45° azimuth and 30° elevation, so lines along the floor rise 1 in 2 (26.57°) and verticals stay vertical. One light direction: tops are lightest, the left face is lit and the right face is in shade. |

Source: guide/src/content/guide/en/illustration.mdx:33.

## AIS-0977e94ad2ab

<!-- AIS-0977e94ad2ab -->
| **Detail where it explains** | Many small, precise parts on what the figure is about; plain volumes elsewhere. |

Source: guide/src/content/guide/en/illustration.mdx:34.

## AIS-68397a4c5bd5

<!-- AIS-68397a4c5bd5 -->
| **Restrained motion** | When animated, parts move as they would in reality and signals travel along real cables. One loop, eased, no bounce. |

Source: guide/src/content/guide/en/illustration.mdx:35.

## AIS-d3aadd70e8dd

<!-- AIS-d3aadd70e8dd -->
Materials are drawn in the slate neutrals with four tones per surface: lit, side, shadow and edge. Colour is reserved for meaning. The dark version uses the dark-mode signal and status colours; the light version uses action blue and the solid status colours, which hold their contrast on white.

Source: guide/src/content/guide/en/illustration.mdx:39.

## AIS-1f85cf3f9a15

<!-- AIS-1f85cf3f9a15 -->
| Role | Dark version | Light version | Use |

Source: guide/src/content/guide/en/illustration.mdx:41.

## AIS-aa93eedf4b6c

<!-- AIS-aa93eedf4b6c -->
| **Materials** | `#0F1729` to `#334155`, lines `#64748B` | `#F1F5F9` to `#64748B`, lines `#334155` | Frames, enclosures, fixtures, shading |

Source: guide/src/content/guide/en/illustration.mdx:43.

## AIS-2925ff4aaa6f

<!-- AIS-2925ff4aaa6f -->
| **Subject** | `#94A3B8` to `#E2E8F0` | `#CBD5E1` to `#F1F5F9` | The part being inspected |

Source: guide/src/content/guide/en/illustration.mdx:44.

## AIS-1814600e2189

<!-- AIS-1814600e2189 -->
| **Signal** | `#7C9FD7` | `#3664B3` | Camera light, inference, data on a cable |

Source: guide/src/content/guide/en/illustration.mdx:45.

## AIS-1e81efd4e11c

<!-- AIS-1e81efd4e11c -->
| **Pass** | `#4ADE80` | `#15803D` | The good part, the green lamp |

Source: guide/src/content/guide/en/illustration.mdx:46.

## AIS-24692b5bb3cb

<!-- AIS-24692b5bb3cb -->
| **Warning** | `#F59E0B` | `#D97706` | A part held for review, the amber lamp |

Source: guide/src/content/guide/en/illustration.mdx:47.

## AIS-35bdeef5c395

<!-- AIS-35bdeef5c395 -->
| **Reject** | `#F87171` | `#DC2626` | The defect, the red lamp, the rejected part |

Source: guide/src/content/guide/en/illustration.mdx:48.

## AIS-cd62830609a9

<!-- AIS-cd62830609a9 -->
Every mark that carries meaning keeps at least 3:1 contrast against what it sits on. In the dark version, pass and reject marks on light parts get a night blue `#0B1220` keyline underneath. Pass and reject are never shown by colour alone: a lamp, a tick or a label goes with them.

Source: guide/src/content/guide/en/illustration.mdx:50.

## AIS-80efc9dfa54d

<!-- AIS-80efc9dfa54d -->
No other colours: no brand blue fills, no gradients between unrelated colours, no glow beyond a lamp.

Source: guide/src/content/guide/en/illustration.mdx:52.

## AIS-e178db05b226

<!-- AIS-e178db05b226 -->
**Fill the column with the subject**, not with empty floor: scale a figure until the machine or part fills its space.

Source: guide/src/content/guide/en/illustration.mdx:58.

## AIS-e4e1a390b8ff

<!-- AIS-e4e1a390b8ff -->
**Light versions of 3D renders** map tones with a continuous gradient from slate 500 `#64748B` to white, lifting the midtones. Never snap each pixel to the nearest token: on curved surfaces that turns shading into steps. Soften sun shadows, and match the lightness of the light isometric figures.

Source: guide/src/content/guide/en/illustration.mdx:59.

## AIS-c3e8a2d95230

<!-- AIS-c3e8a2d95230 -->
**A live overlay on a figure’s video** (a detection box and its chip, drawn to the overlay kit’s rules) is driven by the video’s own time through the same model, and positioned through the render camera, so it stays on the part.

Source: guide/src/content/guide/en/illustration.mdx:60.

## AIS-b670f3656755

<!-- AIS-b670f3656755 -->
**Switching theme without a reload** updates every media component: posters, loops and their light or dark files.

Source: guide/src/content/guide/en/illustration.mdx:61.

## AIS-1c872e3546a7

<!-- AIS-1c872e3546a7 -->
New figures are built with the same drawing kit as the library (`iso-kit` in the Rosepetal website code) and take their camera from its `brandProjection` function, which has no angle settings, so a new figure cannot drift from the set. AI agents use the **anatomy** skill with the rules on this page. The website’s `export-brand-illustrations.mjs` script, in `astro/scripts`, writes both versions and checks every colour against the palette.

Source: guide/src/content/guide/en/illustration.mdx:63.

## AIS-c9286b14c181

<!-- AIS-c9286b14c181 -->
'Choose every image from the six image types by what it has to say: Machine, In production, Detail and result, Interface, Industry subject, People.'

Source: guide/src/content/guide/en/imagery.mdx:4.

## AIS-5127688d060f

<!-- AIS-5127688d060f -->
'Start from real photographs and screenshots, product renders built to real dimensions, and exterior views of our machines from engineering models, every guard closed.'

Source: guide/src/content/guide/en/imagery.mdx:5.

## AIS-9d90eb3b38e2

<!-- AIS-9d90eb3b38e2 -->
'A generated or composited image is used only when the end result is credible at its final size: no garbled or invented-looking text, no impossible geometry or light, never a different machine than the one named, client brands blurred.'

Source: guide/src/content/guide/en/imagery.mdx:6.

## AIS-cf4e58fadc65

<!-- AIS-cf4e58fadc65 -->
'Never let an image model draw boxes, masks, labels, verdicts or text. Draw detections with overlay.mjs from a JSON spec, in the overlay kit colours only.'

Source: guide/src/content/guide/en/imagery.mdx:7.

## AIS-925a3c34f371

<!-- AIS-925a3c34f371 -->
'Overlay chips never cover what was inspected, and their text is centred on the cap height.'

Source: guide/src/content/guide/en/imagery.mdx:8.

## AIS-f9c5e45be224

<!-- AIS-f9c5e45be224 -->
'Never show floating holograms, glowing sci-fi light, robots with faces, invented brands or text baked into an image.'

Source: guide/src/content/guide/en/imagery.mdx:9.

## AIS-2aa037f3eba8

<!-- AIS-2aa037f3eba8 -->
'Never show a picture larger than its medium allows: 1.25× its native size in print and on carousel slides, 1.3× in a deck’s photo panel (deck covers always fill their panel) and 1.5× on a single post.'

Source: guide/src/content/guide/en/imagery.mdx:10.

## AIS-b3bb15603b3d

<!-- AIS-b3bb15603b3d -->
'Product renders sit on the section grey sweep with no conveyors or rails. Where a conveyor appears, its belt or chain is brown, grey or blue, never green, and its side guides are metallic.'

Source: guide/src/content/guide/en/imagery.mdx:11.

## AIS-629d0428a135

<!-- AIS-629d0428a135 -->
'Marketing screenshots carry no test or admin data and are cropped at panel borders.'

Source: guide/src/content/guide/en/imagery.mdx:12.

## AIS-e174fc2adc56

<!-- AIS-e174fc2adc56 -->
<DoDont doLabel="Use when it holds up" dontLabel="Reject"

Source: guide/src/content/guide/en/imagery.mdx:47.

## AIS-8594dfd2f4d2

<!-- AIS-8594dfd2f4d2 -->
dos={['Real photographs, footage and screenshots first', 'Product still lifes and Detail and result pairs rendered to real dimensions', 'A generated or composited image that is credible at its final size, client brands blurred']}

Source: guide/src/content/guide/en/imagery.mdx:48.

## AIS-7d66ae2379cc

<!-- AIS-7d66ae2379cc -->
donts={['Garbled, melted or invented-looking text on screens, labels or packs', 'Impossible geometry, light or reflections; parts that float, fuse or repeat', 'A machine that is not the AIS machine it is said to be, or a logo pasted onto another maker’s machine', 'Invented brands, or client brands left legible', 'Boxes, masks, labels or verdicts baked into the image']} />

Source: guide/src/content/guide/en/imagery.mdx:49.

## AIS-31bb9d49f52f

<!-- AIS-31bb9d49f52f -->
Boxes, masks, readings, measurements and verdicts are drawn on top of the image by one renderer, [`overlay.mjs`](/downloads/overlays/overlay.mjs), from a short JSON spec. The examples above are rendered by the same file; download their specs from each caption.

Source: guide/src/content/guide/en/imagery.mdx:69.

## AIS-d253fb311345

<!-- AIS-d253fb311345 -->
See the [decorative patterns](/en/patterns/) for every medium and their light and transparent variants. No glow or gradient fills. Fading line opacity is allowed. Keep the original geometry; never cut a cell edge into an odd shape.

Source: guide/src/content/guide/en/imagery.mdx:113.

## AIS-41145b8748c4

<!-- AIS-41145b8748c4 -->
'Use only the spacing tokens (--ais-space-050 to --ais-space-1600, a 4 px base on an 8 px rhythm). Never use values between them, such as 6, 10, 14, 18 or 22 px.'

Source: guide/src/content/guide/en/layout.mdx:4.

## AIS-8dbaa516d1a4

<!-- AIS-8dbaa516d1a4 -->
'On websites and documents, content stops at 1440 px with fluid side margins of 24 to 64 px, on a 12-column grid (8 below 900 px, 4 below 600 px), and sections sit 64 to 128 px apart. Product interfaces are full width.'

Source: guide/src/content/guide/en/layout.mdx:5.

## AIS-a48bd81a0009

<!-- AIS-a48bd81a0009 -->
'Websites and documents use the breakpoints 600, 900, 1200 and 1440 px, written mobile-first with min-width. Never add another. Product interfaces use the Tailwind breakpoints of the design system.'

Source: guide/src/content/guide/en/layout.mdx:6.

## AIS-08020027e6cc

<!-- AIS-08020027e6cc -->
'Websites are square everywhere: buttons, cards, menus, dropdowns, dialogs and notices. The one exception is a product screen shown as a window, which takes the window’s 4 px corner. Product interfaces take their corners from `@aisgroup/design` and never override them. Fully round only for avatars, dots and toggles.'

Source: guide/src/content/guide/en/layout.mdx:7.

## AIS-b998479e02d3

<!-- AIS-b998479e02d3 -->
'Borders separate content; shadows only for things that float (menus, dialogs, toasts). Cards never cast a shadow, not even on hover.'

Source: guide/src/content/guide/en/layout.mdx:8.

## AIS-d8707147e5b4

<!-- AIS-d8707147e5b4 -->
'Rules separate, they never frame: a line goes between the rows of a list or table, never after the last row and never above or below a block that already has one. Two lines with nothing between them are a fault. Text sits centred between its rules, with the same space above and below.'

Source: guide/src/content/guide/en/layout.mdx:9.

## AIS-6f37d13ff4b6

<!-- AIS-6f37d13ff4b6 -->
**Scope.** The grid, the breakpoints and the section spacing apply to websites and documents. Product interfaces (the Rosepetal app, the Profiler and the Node-RED panels) are full width and follow the [Using the components](/en/using-components/) page: Tailwind breakpoints, 36 px toolbar buttons and the product type scale. The spacing tokens, corners, shadows, borders and focus ring apply to both.

Source: guide/src/content/guide/en/layout.mdx:13.

## AIS-d0a96a8f4ad0

<!-- AIS-d0a96a8f4ad0 -->
A4 pages use their own grid: 15 mm margins, 12 columns of 10.4 mm with 5 mm gaps, and a 3 mm bleed on the PDF with text at least 5 mm inside the trim. Type is Inter 400, 500 and 600, body at 10.5 pt and nothing under 8.5 pt. Calm pages use white space instead of rules: a hairline only where a list needs one, one accent colour, no frame around a frame. The logo signs the piece at 20 mm (AIS Vision Systems) or 38 mm (Rosepetal); a business card carries it at 18 mm. A piece ends with one closing block. The parts of a brochure are in the [Marketing kit](/en/kit/#print-system).

Source: guide/src/content/guide/en/layout.mdx:60.

## AIS-6ee3471e28df

<!-- AIS-6ee3471e28df -->
'Use only the motion tokens: seven durations (--ais-duration-*), three curves (--ais-ease-standard, -enter, -exit) and the fixed distances. Never invent a duration or a curve.'

Source: guide/src/content/guide/en/motion.mdx:4.

## AIS-7525fc0cee63

<!-- AIS-7525fc0cee63 -->
'Animate transform and opacity only, plus grid-template-rows for accordions. Never animate layout, colour gradients or blur.'

Source: guide/src/content/guide/en/motion.mdx:5.

## AIS-61823aaddb49

<!-- AIS-61823aaddb49 -->
'Interfaces use durations up to 240 ms; only websites use 500 ms and above, for arrival, scroll reveals and headlines.'

Source: guide/src/content/guide/en/motion.mdx:6.

## AIS-9346416b4820

<!-- AIS-9346416b4820 -->
'Content is visible without JavaScript; motion only enhances it. Every animation stops under prefers-reduced-motion.'

Source: guide/src/content/guide/en/motion.mdx:7.

## AIS-de0ce95760a9

<!-- AIS-de0ce95760a9 -->
'No bounce, elastic, parallax, scroll smoothing libraries, hover lifts, decorative loops or animated logos on the web.'

Source: guide/src/content/guide/en/motion.mdx:8.

## AIS-86563b3329eb

<!-- AIS-86563b3329eb -->
Loops are seamless, silent and pause when off screen; anything that moves on its own for more than five seconds has a pause control, except purely decorative header effects and the logo strip. Show a still poster under reduced motion. Video sits behind a headline only under the dark scrim of a page opener, never behind body text. Video intros, outros, titles and captions follow [Video](/en/video/).

Source: guide/src/content/guide/en/motion.mdx:161.

## AIS-24b0ccdb0eed

<!-- AIS-24b0ccdb0eed -->
'Only the Rosepetal app has a dark theme. Websites, print, presentations, social media and email are light; dark appears there as deep-blue sections, brand-blue grounds and dark pieces built from the same palette, never as a theme switch.'

Source: guide/src/content/guide/en/themes.mdx:4.

## AIS-fb649af57fe0

<!-- AIS-fb649af57fe0 -->
'In the app, `.dark` on `<html>` switches the theme: the user''s choice first, then the system setting. Components take every colour from the `@aisgroup/design` tokens, so they need no colours of their own for dark mode.'

Source: guide/src/content/guide/en/themes.mdx:5.

## AIS-474aaaaecc95

<!-- AIS-474aaaaecc95 -->
'Dark mode: page `#0B1220`, cards `#111A2E`, borders `#1E293B`, text `#F1F5F9`, secondary text `#94A3B8`, actions and links `#7C9FD7` with ink `#0F1729` on filled buttons; success `#4ADE80`, warning `#F59E0B`, error `#F87171`.'

Source: guide/src/content/guide/en/themes.mdx:6.

## AIS-b220862f1bdd

<!-- AIS-b220862f1bdd -->
'Logos: blue on light grounds, white on dark ones. App icons keep the white mark on the brand-blue tile in both themes; website favicons are blue in light mode and white in dark mode.'

Source: guide/src/content/guide/en/themes.mdx:7.

## AIS-b83325b7fea8

<!-- AIS-b83325b7fea8 -->
'Brand blue, the solid status fills, overlays, tag colours and the orange and cyan data colours keep one value in both themes. Photographs are never recoloured for a theme.'

Source: guide/src/content/guide/en/themes.mdx:8.

## AIS-eb722eee14d5

<!-- AIS-eb722eee14d5 -->
'Product screens in marketing show the app in light mode; a dark screen appears only in a piece that is dark as a whole, and never next to a light one.'

Source: guide/src/content/guide/en/themes.mdx:9.

## AIS-d887ce791a1e

<!-- AIS-d887ce791a1e -->
| Surface | Light | Dark |

Source: guide/src/content/guide/en/themes.mdx:19.

## AIS-5f1f7a2178f1

<!-- AIS-5f1f7a2178f1 -->
| **Rosepetal app** | Default | The user’s choice, or the system setting until they choose. `.dark` on `<html>`. |

Source: guide/src/content/guide/en/themes.mdx:21.

## AIS-074b86fa7566

<!-- AIS-074b86fa7566 -->
| **Websites** | Always | No dark theme and no switch. AIS uses deep-blue `#10254C` sections and a brand-blue closing band; Rosepetal’s dark themes are previews only (`?theme=`). See [Web components](/en/web-components/#on-dark). |

Source: guide/src/content/guide/en/themes.mdx:22.

## AIS-082f802f9fc6

<!-- AIS-082f802f9fc6 -->
| **Print** | Always | Covers and bands in brand blue or navy, with the white logo. |

Source: guide/src/content/guide/en/themes.mdx:23.

## AIS-4ad8a4b24b07

<!-- AIS-4ad8a4b24b07 -->
| **Presentations** | White slides | Brand-blue openings and closings. No dark deck. |

Source: guide/src/content/guide/en/themes.mdx:24.

## AIS-faff2e7768d2

<!-- AIS-faff2e7768d2 -->
| **Social media** | White posts | Brand-blue posts and banners. See [Social media](/en/social/). |

Source: guide/src/content/guide/en/themes.mdx:25.

## AIS-7e4d44ea8a68

<!-- AIS-7e4d44ea8a68 -->
| **Email** | Always | None. |

Source: guide/src/content/guide/en/themes.mdx:26.

## AIS-9a79127a95b5

<!-- AIS-9a79127a95b5 -->
| **Charts** | White ground | Night `#0B1220` ground, in the app’s dark mode. See [Charts](themes.md#charts). |

Source: guide/src/content/guide/en/themes.mdx:27.

## AIS-24af7c492703

<!-- AIS-24af7c492703 -->
| **This guide** | Always | None: the guide is light, and shows the dark theme in its previews. |

Source: guide/src/content/guide/en/themes.mdx:28.
