# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-f9a5b9ae507e

<!-- AIS-f9a5b9ae507e -->
**Optional.** Every page reads perfectly with motion off, and every animation respects the system’s reduced-motion setting.

Source: plugin/skills/design-language/references/motion.md:8.

## AIS-a4353031a8b1

<!-- AIS-a4353031a8b1 -->
**Productive and expressive.** Product interfaces are productive: they use the fast and moderate durations only, so work never waits for an animation. Websites may also be expressive in three moments: page arrival, scroll reveals and headlines.

Source: plugin/skills/design-language/references/motion.md:10.

## AIS-64cf410864c7

<!-- AIS-64cf410864c7 -->
| `--ais-duration-fast-1` | 80 ms | Press and active states |

Source: plugin/skills/design-language/references/motion.md:16.

## AIS-55e631cf4fb9

<!-- AIS-55e631cf4fb9 -->
| `--ais-duration-fast-2` | 120 ms | Tooltips, toggles, checkboxes |

Source: plugin/skills/design-language/references/motion.md:17.

## AIS-2f8fe227f0ac

<!-- AIS-2f8fe227f0ac -->
| `--ais-duration-moderate-1` | 180 ms | Hover: colour, underline, arrow; anything closing |

Source: plugin/skills/design-language/references/motion.md:18.

## AIS-f8769315abd8

<!-- AIS-f8769315abd8 -->
| `--ais-duration-moderate-2` | 240 ms | Menus, dropdowns, accordions, dialogs opening |

Source: plugin/skills/design-language/references/motion.md:19.

## AIS-7e4180bf1b15

<!-- AIS-7e4180bf1b15 -->
| `--ais-duration-slow-1` | 500 ms | Page arrival, large panels |

Source: plugin/skills/design-language/references/motion.md:20.

## AIS-cb0fa363c8c8

<!-- AIS-cb0fa363c8c8 -->
| `--ais-duration-slow-2` | 700 ms | Scroll reveals, image zoom on hover |

Source: plugin/skills/design-language/references/motion.md:21.

## AIS-bf84c27db1f8

<!-- AIS-bf84c27db1f8 -->
| `--ais-duration-expressive` | 1100 ms | Headline line reveal, numbers counting up |

Source: plugin/skills/design-language/references/motion.md:22.

## AIS-718a19591d7b

<!-- AIS-718a19591d7b -->
Closing is faster than opening: a menu opens in 240 ms and closes in 180 ms.

Source: plugin/skills/design-language/references/motion.md:24.

## AIS-850b982f4ced

<!-- AIS-850b982f4ced -->
Three curves cover everything.

Source: plugin/skills/design-language/references/motion.md:28.

## AIS-26c41f6a7107

<!-- AIS-26c41f6a7107 -->
Linear is used only for continuous loops and progress bars.

Source: plugin/skills/design-language/references/motion.md:30.

## AIS-e477afc214a7

<!-- AIS-e477afc214a7 -->
| `--ais-distance-nudge` | 3 px | Arrow on hover, forward or back |

Source: plugin/skills/design-language/references/motion.md:36.

## AIS-478248d31e2a

<!-- AIS-478248d31e2a -->
| `--ais-distance-menu` | 8 px | Menus and dropdowns entering |

Source: plugin/skills/design-language/references/motion.md:37.

## AIS-02e7bcc5ce07

<!-- AIS-02e7bcc5ce07 -->
| `--ais-distance-reveal` | 16 px | Blocks entering on scroll |

Source: plugin/skills/design-language/references/motion.md:38.

## AIS-2616e97a56b6

<!-- AIS-2616e97a56b6 -->
| `--ais-stagger` | 60 ms | Between items of a list, up to six items |

Source: plugin/skills/design-language/references/motion.md:39.

## AIS-1bd3462a1da9

<!-- AIS-1bd3462a1da9 -->
| `--ais-stagger-lines` | 100 ms | Between lines of a headline |

Source: plugin/skills/design-language/references/motion.md:40.

## AIS-1b230c3ff878

<!-- AIS-1b230c3ff878 -->
Image zoom on hover is 1.03. Page content enters 16 px (`--ais-distance-reveal`) and leaves 8 px.

Source: plugin/skills/design-language/references/motion.md:42.

## AIS-bd19ba6fae9b

<!-- AIS-bd19ba6fae9b -->
Every site uses these patterns with these exact values.

Source: plugin/skills/design-language/references/motion.md:46.

## AIS-99013c771e8d

<!-- AIS-99013c771e8d -->
<div id="motion-demos"></div>

Source: plugin/skills/design-language/references/motion.md:48.

## AIS-5379eb459fb6

<!-- AIS-5379eb459fb6 -->
| Pattern | Trigger | Animation | Duration | Curve |

Source: plugin/skills/design-language/references/motion.md:50.

## AIS-60d2170b2e29

<!-- AIS-60d2170b2e29 -->
| **Text link** | Hover, focus | Underline appears, colour to blue-600 | 180 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:52.

## AIS-f3c6cfae5f5c

<!-- AIS-f3c6cfae5f5c -->
| **Arrow** | Hover on its link or button | Moves 3 px forward (back links: back) | 180 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:53.

## AIS-7e7ce8486d32

<!-- AIS-7e7ce8486d32 -->
| **Button** | Hover / press | Background to the hover colour / 80 ms darker; never scales | 180 / 80 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:54.

## AIS-71cd5579c90f

<!-- AIS-71cd5579c90f -->
| **Focus ring** | Keyboard focus | Appears instantly | 0 ms | None |

Source: plugin/skills/design-language/references/motion.md:55.

## AIS-7466bcf6b706

<!-- AIS-7466bcf6b706 -->
| **Menu, dropdown, mega menu** | Open / close | Fade and 8 px down / fade out | 240 / 180 ms | Enter / exit |

Source: plugin/skills/design-language/references/motion.md:56.

## AIS-d062c012132a

<!-- AIS-d062c012132a -->
| **Accordion** | Open / close | Height through `grid-template-rows`, chevron turns 180° | 240 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:57.

## AIS-dbfe8abfe7a2

<!-- AIS-dbfe8abfe7a2 -->
| **Dialog** | Open / close | Backdrop fades; panel fades and scales from 0.98 / reverse | 240 / 180 ms | Enter / exit |

Source: plugin/skills/design-language/references/motion.md:58.

## AIS-5f6b94e2cb6e

<!-- AIS-5f6b94e2cb6e -->
| **Tooltip** | Hover for 400 ms | Fades in | 120 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:59.

## AIS-385db228be1d

<!-- AIS-385db228be1d -->
| **Toast** | Appears / leaves | Fade and 16 px up / fade out | 240 / 180 ms | Enter / exit |

Source: plugin/skills/design-language/references/motion.md:60.

## AIS-0a668e38dceb

<!-- AIS-0a668e38dceb -->
| **Scroll reveal** | Block 10% in view, once | Fade and 16 px up, items 60 ms apart | 700 ms | Enter |

Source: plugin/skills/design-language/references/motion.md:61.

## AIS-e673ae0af0d1

<!-- AIS-e673ae0af0d1 -->
| **Headline reveal** | Page arrival, section in view | Lines rise from a mask, 100 ms apart, after the font loads | 1100 ms | Enter |

Source: plugin/skills/design-language/references/motion.md:62.

## AIS-f9ac57aee4f2

<!-- AIS-f9ac57aee4f2 -->
| **Card image** | Hover on the card | Image scales to 1.03; the card does not lift or cast a shadow | 700 ms | Enter |

Source: plugin/skills/design-language/references/motion.md:63.

## AIS-7c2f5f4ec7be

<!-- AIS-7c2f5f4ec7be -->
| **Page transition** | Navigation | Old page fades and lifts 8 px; header stays; new page fades and rises 16 px | 180 / 500 ms | Exit / enter |

Source: plugin/skills/design-language/references/motion.md:64.

## AIS-fbafbacaba05

<!-- AIS-fbafbacaba05 -->
| **Number** | Section in view | Counts up to a real value, tabular figures | 1100 ms | Enter |

Source: plugin/skills/design-language/references/motion.md:65.

## AIS-48f30c34d6c0

<!-- AIS-48f30c34d6c0 -->
| **Logo strip** | Continuous | Scrolls at 40 s per loop; pauses on hover and off screen | 40 s | Linear |

Source: plugin/skills/design-language/references/motion.md:66.

## AIS-45adc35712b2

<!-- AIS-45adc35712b2 -->
| **Detection overlay** | In view | Boxes and masks draw in 60 ms apart; the verdict appears last | 500 ms, verdict 240 ms | Enter |

Source: plugin/skills/design-language/references/motion.md:67.

## AIS-f38cf307f881

<!-- AIS-f38cf307f881 -->
| **Signal** | Continuous in illustrations | A pulse travels along the real cable; the receiver answers with a light | 1100 ms | Standard |

Source: plugin/skills/design-language/references/motion.md:68.

## AIS-245d754f51d4

<!-- AIS-245d754f51d4 -->
Each kind of link has one behaviour, identical on every site: 180 ms on the standard curve. An interactive element with no hover state is a defect.

Source: plugin/skills/design-language/references/motion.md:72.

## AIS-587167bafea5

<!-- AIS-587167bafea5 -->
| Kind | At rest | On hover |

Source: plugin/skills/design-language/references/motion.md:74.

## AIS-dca77b60cfe0

<!-- AIS-dca77b60cfe0 -->
| **Text action with arrow** | Action blue `#3664B3` | blue-600 `#1E4591`, underline, arrow 3 px forward |

Source: plugin/skills/design-language/references/motion.md:76.

## AIS-06faffc8fd82

<!-- AIS-06faffc8fd82 -->
| **Inline link** | Action blue, underlined | blue-600 `#1E4591` |

Source: plugin/skills/design-language/references/motion.md:77.

## AIS-55dcf9003983

<!-- AIS-55dcf9003983 -->
| **Navigation link** | Ink `#0F1729` | Action blue |

Source: plugin/skills/design-language/references/motion.md:78.

## AIS-d770e15ca17f

<!-- AIS-d770e15ca17f -->
| **Menu item** | Ink | Action blue; the arrow moves 3 px where there is one |

Source: plugin/skills/design-language/references/motion.md:79.

## AIS-609e4b87fcf5

<!-- AIS-609e4b87fcf5 -->
| **Card link** | Title in ink | Title in action blue, arrow 3 px forward, image to 1.03; no underline |

Source: plugin/skills/design-language/references/motion.md:80.

## AIS-a0c101ef38c5

<!-- AIS-a0c101ef38c5 -->
| **Split button** | Brand blue `#17356E` | Deep blue, blue-800 `#10254C` |

Source: plugin/skills/design-language/references/motion.md:81.

## AIS-485e70251553

<!-- AIS-485e70251553 -->
| **Neutral button** | Section grey `#F1F5F9` | neutral-200 `#E2E8F0` |

Source: plugin/skills/design-language/references/motion.md:82.

## AIS-16529cb91c1a

<!-- AIS-16529cb91c1a -->
| **Links on dark surfaces** | Light blue `#A7BFE4` or slate `#94A3B8` | `#F1F5F9` |

Source: plugin/skills/design-language/references/motion.md:83.

## AIS-ba27d55af334

<!-- AIS-ba27d55af334 -->
**Reveal only what deserves it.** Scroll reveals apply to section-level blocks: a card row, a figure, a quote. Never to running text, navigation, forms or anything above the fold on load except the headline.

Source: plugin/skills/design-language/references/motion.md:85.

## AIS-d7aad145feb3

<!-- AIS-d7aad145feb3 -->
Bounce, elastic, spring overshoot or wobble.

Source: plugin/skills/design-language/references/motion.md:89.

## AIS-7e57eff8606e

<!-- AIS-7e57eff8606e -->
Parallax, scroll-jacking or smooth-scrolling libraries; scrolling stays native.

Source: plugin/skills/design-language/references/motion.md:90.

## AIS-3c5755c5a931

<!-- AIS-3c5755c5a931 -->
Hover lifts, growing shadows or scaling buttons.

Source: plugin/skills/design-language/references/motion.md:91.

## AIS-d9f28137156d

<!-- AIS-d9f28137156d -->
Decorative loops: floating glows, drifting shapes, pulsing backgrounds.

Source: plugin/skills/design-language/references/motion.md:92.

## AIS-98d3f8e82535

<!-- AIS-98d3f8e82535 -->
Animated logos on websites. Logo animation belongs to video intros and outros only.

Source: plugin/skills/design-language/references/motion.md:93.

## AIS-4bf51e2951dc

<!-- AIS-4bf51e2951dc -->
Animating width, height, top, left, margins, colour gradients or blur.

Source: plugin/skills/design-language/references/motion.md:94.

## AIS-ae34b6745f40

<!-- AIS-ae34b6745f40 -->
Content that stays hidden until a script runs.

Source: plugin/skills/design-language/references/motion.md:95.

## AIS-09be01051683

<!-- AIS-09be01051683 -->
Video with sound that plays by itself, or video behind body text. A film sits behind a headline only under the dark scrim of a page opener.

Source: plugin/skills/design-language/references/motion.md:96.

## AIS-a55b98b87423

<!-- AIS-a55b98b87423 -->
When the system asks for reduced motion, every transition and animation is removed, not shortened: content is simply there. Loops stop, videos show their poster, and counters show their final value.

Source: plugin/skills/design-language/references/motion.md:100.

## AIS-eff6fb6c7011

<!-- AIS-eff6fb6c7011 -->
@media (prefers-reduced-motion: reduce) {

Source: plugin/skills/design-language/references/motion.md:103.

## AIS-d2fe915cb8d6

<!-- AIS-d2fe915cb8d6 -->
*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }

Source: plugin/skills/design-language/references/motion.md:104.

## AIS-d10b36aa74a5

<!-- AIS-d10b36aa74a5 -->
}

Source: plugin/skills/design-language/references/motion.md:105.

## AIS-fb46fa684469

<!-- AIS-fb46fa684469 -->
Every site imports `brand.css` and uses the tokens directly. The scroll reveal is progressive: the page is complete without JavaScript, and the hidden state only exists once the script has marked the page.

Source: plugin/skills/design-language/references/motion.md:110.

## AIS-83bbd364407d

<!-- AIS-83bbd364407d -->
.has-motion [data-reveal] { opacity: 0; transform: translateY(var(--ais-distance-reveal)); }

Source: plugin/skills/design-language/references/motion.md:113.

## AIS-74c507316d5a

<!-- AIS-74c507316d5a -->
.has-motion [data-reveal].is-in {

Source: plugin/skills/design-language/references/motion.md:114.

## AIS-694e73dfc47a

<!-- AIS-694e73dfc47a -->
opacity: 1; transform: none;

Source: plugin/skills/design-language/references/motion.md:115.

## AIS-8f97252c8e0d

<!-- AIS-8f97252c8e0d -->
transition: opacity var(--ais-duration-slow-2) var(--ais-ease-enter),

Source: plugin/skills/design-language/references/motion.md:116.

## AIS-fb5b4494342a

<!-- AIS-fb5b4494342a -->
transform var(--ais-duration-slow-2) var(--ais-ease-enter);

Source: plugin/skills/design-language/references/motion.md:117.

## AIS-d57ec25d9d9b

<!-- AIS-d57ec25d9d9b -->
transition-delay: calc(var(--i, 0) * var(--ais-stagger));

Source: plugin/skills/design-language/references/motion.md:118.

## AIS-a592f6b4da44

<!-- AIS-a592f6b4da44 -->
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {

Source: plugin/skills/design-language/references/motion.md:123.

## AIS-623eb9323b00

<!-- AIS-623eb9323b00 -->
document.documentElement.classList.add('has-motion');

Source: plugin/skills/design-language/references/motion.md:124.

## AIS-141591986451

<!-- AIS-141591986451 -->
const io = new IntersectionObserver((entries) => entries.forEach((e) => {

Source: plugin/skills/design-language/references/motion.md:125.

## AIS-d3fc28699c37

<!-- AIS-d3fc28699c37 -->
if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }

Source: plugin/skills/design-language/references/motion.md:126.

## AIS-58b707402974

<!-- AIS-58b707402974 -->
}), { threshold: 0.1 });

Source: plugin/skills/design-language/references/motion.md:127.

## AIS-106dfe062291

<!-- AIS-106dfe062291 -->
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

Source: plugin/skills/design-language/references/motion.md:128.

## AIS-04436ec99c5e

<!-- AIS-04436ec99c5e -->
Sites that animate with GSAP register the same curves by name, so code and CSS stay identical:

Source: plugin/skills/design-language/references/motion.md:132.

## AIS-de359f3765ea

<!-- AIS-de359f3765ea -->
gsap.registerPlugin(CustomEase);

Source: plugin/skills/design-language/references/motion.md:137.

## AIS-1cd2b0ec93c8

<!-- AIS-1cd2b0ec93c8 -->
CustomEase.create('ais-standard', '.2,0,0,1');

Source: plugin/skills/design-language/references/motion.md:138.

## AIS-f54d85bacbe5

<!-- AIS-f54d85bacbe5 -->
CustomEase.create('ais-enter', '.16,1,.3,1');

Source: plugin/skills/design-language/references/motion.md:139.

## AIS-fb6926e0979c

<!-- AIS-fb6926e0979c -->
CustomEase.create('ais-exit', '.4,0,1,1');

Source: plugin/skills/design-language/references/motion.md:140.

## AIS-6c4189c8d903

<!-- AIS-6c4189c8d903 -->
// gsap.to(lines, { yPercent: 0, duration: 1.1, ease: 'ais-enter', stagger: 0.1 });

Source: plugin/skills/design-language/references/motion.md:141.

## AIS-15ff64123f2b

<!-- AIS-15ff64123f2b -->
Page transitions use the browser’s View Transitions (Astro’s `ClientRouter`), with the old page leaving in 180 ms on the exit curve and the new page arriving in 500 ms on the enter curve.

Source: plugin/skills/design-language/references/motion.md:144.

## AIS-ab2ceeda8f55

<!-- AIS-ab2ceeda8f55 -->
Loops are seamless, silent and pause when off screen; anything that moves on its own for more than five seconds has a pause control, except purely decorative header effects and the logo strip. Show a still poster under reduced motion. Video sits behind a headline only under the dark scrim of a page opener, never behind body text. Video intros, outros, titles and captions follow [Video](../../communications/references/video.md).

Source: plugin/skills/design-language/references/motion.md:148.

## AIS-64b405205ec8

<!-- AIS-64b405205ec8 -->
The five patterns are decorative grounds and accents for slides, documents, web, video, posts and stands. Use one per piece. Keep them clear of body text, tables, logos and the subject of a photograph.

Source: plugin/skills/design-language/references/patterns.md:3.

## AIS-b16649a8b217

<!-- AIS-b16649a8b217 -->
Use white lines on brand blue or deep blue. On white and section grey, use quiet brand-blue lines. Transparent versions contain lines only: white for dark grounds, brand blue for light grounds.

Source: plugin/skills/design-language/references/patterns.md:5.

## AIS-3a58d76d67cf

<!-- AIS-3a58d76d67cf -->
No glow or gradient fills. Fading line opacity is allowed. Keep the original geometry; never cut a cell edge into an odd shape.

Source: plugin/skills/design-language/references/patterns.md:7.

## AIS-548f20bf21b0

<!-- AIS-548f20bf21b0 -->
Each set contains SVG and PNG at 1080 × 1350, 1080 × 1080 (square tile), 1584 × 396, 1512 × 256, 1920 × 1080 and A4 portrait (1240 × 1754 px). The A4 SVG scales to print size. Transparent PNGs retain alpha.

Source: plugin/skills/design-language/references/patterns.md:9.

## AIS-31855c191fc4

<!-- AIS-31855c191fc4 -->
[hexagon-landscape-rolling, all variants](../../../brand/downloads/linkedin-patterns/ais-linkedin-background-hexagon-landscape-rolling.zip)

Source: plugin/skills/design-language/references/patterns.md:11.

## AIS-e1bad0991ae2

<!-- AIS-e1bad0991ae2 -->
[hexagon-landscape-dramatic, all variants](../../../brand/downloads/linkedin-patterns/ais-linkedin-background-hexagon-landscape-dramatic.zip)

Source: plugin/skills/design-language/references/patterns.md:12.

## AIS-7cadbbe5fc9d

<!-- AIS-7cadbbe5fc9d -->
[circuit-globe, all variants](../../../brand/downloads/linkedin-patterns/ais-linkedin-background-circuit-globe.zip)

Source: plugin/skills/design-language/references/patterns.md:13.

## AIS-de60a66462d2

<!-- AIS-de60a66462d2 -->
[circuit-traces, all variants](../../../brand/downloads/linkedin-patterns/ais-linkedin-background-circuit-traces.zip)

Source: plugin/skills/design-language/references/patterns.md:14.

## AIS-5482c63071fa

<!-- AIS-5482c63071fa -->
[scan-profiles, all variants](../../../brand/downloads/linkedin-patterns/ais-linkedin-background-scan-profiles.zip)

Source: plugin/skills/design-language/references/patterns.md:15.

## AIS-26865de51ce4

<!-- AIS-26865de51ce4 -->
Exact values, version 1.0. Token files: [ais-tokens.css](../../../brand/downloads/ais-tokens.css) (CSS custom properties), [ais-theme.css](../../../brand/downloads/ais-theme.css) (the Tailwind v4 theme, the tokens of the Rosepetal products, from @rosepetal/design/styles.css: import it after tailwindcss and use the same classes as the app, bg-primary, text-muted-foreground) and [ais-tokens.json](../../../brand/downloads/ais-tokens.json) (W3C design tokens).

Source: plugin/skills/design-language/references/tokens.md:3.

## AIS-ed065c7578bf

<!-- AIS-ed065c7578bf -->
Primary button (`--primary`): `#17356E` light, `#7C9FD7` dark

Source: plugin/skills/design-language/references/tokens.md:7.

## AIS-9171675abdc1

<!-- AIS-9171675abdc1 -->
Primary button, hover (`--primary-hover`): `#10254C` light, `#A7BFE4` dark

Source: plugin/skills/design-language/references/tokens.md:8.

## AIS-6a498ebe88d1

<!-- AIS-6a498ebe88d1 -->
Links, text actions and focus rings (`--info`): `#3664B3` light, `#7C9FD7` dark

Source: plugin/skills/design-language/references/tokens.md:9.

## AIS-45428f0cf0ba

<!-- AIS-45428f0cf0ba -->
Text (`--foreground`): `#0F1729` light, `#F1F5F9` dark

Source: plugin/skills/design-language/references/tokens.md:10.

## AIS-18c3c9ca0016

<!-- AIS-18c3c9ca0016 -->
Secondary text (`--muted-foreground`): `#4B5563` light, `#94A3B8` dark

Source: plugin/skills/design-language/references/tokens.md:11.

## AIS-8d6a7c4f18ee

<!-- AIS-8d6a7c4f18ee -->
Page background (`--background`): `#FFFFFF` light, `#0B1220` dark

Source: plugin/skills/design-language/references/tokens.md:12.

## AIS-ce83139f44d5

<!-- AIS-ce83139f44d5 -->
Page behind the cards (`--page`): `#F1F5F9` light, `#0B1220` dark

Source: plugin/skills/design-language/references/tokens.md:13.

## AIS-a49722eeace0

<!-- AIS-a49722eeace0 -->
Cards, popovers and menus (`--card`): `#FFFFFF` light, `#111A2E` dark

Source: plugin/skills/design-language/references/tokens.md:14.
