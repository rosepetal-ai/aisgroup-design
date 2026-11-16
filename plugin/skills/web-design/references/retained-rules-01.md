# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-e07e608caf48

<!-- AIS-e07e608caf48 -->
Websites are Astro sites with their own components, styled on brand.css (the `--ais-*` tokens) through a short layer of site roles: action, link, ink, muted, line. A theme changes the roles, never a component. Never type a colour or a size, and never restyle a part per page.

Source: plugin/skills/web-design/SKILL.md:14.

## AIS-96e551658dfc

<!-- AIS-96e551658dfc -->
Websites do not use theme.css, the app’s registry or Vue: the app’s components carry its rounded corners and screen density.

Source: plugin/skills/web-design/SKILL.md:15.

## AIS-dc34a55153e4

<!-- AIS-dc34a55153e4 -->
Websites are square, except a product screen shown as a window (4 px). Form fields are 48 px with the 3:1 field border.

Source: plugin/skills/web-design/SKILL.md:16.

## AIS-4e722935a6bb

<!-- AIS-4e722935a6bb -->
Calls to action are split buttons: 52 px, square, label plus a separate arrow segment; 44 px compact in headers and cards; Rosepetal uses 44 px for every call to action. On a brand-blue band and on dark surfaces the button is white.

Source: plugin/skills/web-design/SKILL.md:17.

## AIS-230973a03060

<!-- AIS-230973a03060 -->
Text actions are action-blue links with a 20 px arrow that moves 3 px on hover; back links point left; links in running text are underlined, with no arrow.

Source: plugin/skills/web-design/SKILL.md:18.

## AIS-aff0edc1856f

<!-- AIS-aff0edc1856f -->
Cards are links with no box, shadow or lift, in four layouts: stack, row, text and featured. On hover the title turns action blue, the arrow nudges and the photograph eases to 103%.

Source: plugin/skills/web-design/SKILL.md:19.

## AIS-79ccfe4e11c7

<!-- AIS-79ccfe4e11c7 -->
A page’s H1 is Title size; Display is only for the home page and campaign openers.

Source: plugin/skills/web-design/SKILL.md:20.

## AIS-4e72b063b72e

<!-- AIS-4e72b063b72e -->
Use website images from the Web assets files, never saved from a live site or a screenshot.

Source: plugin/skills/web-design/SKILL.md:24.

## AIS-b6fb561490fd

<!-- AIS-b6fb561490fd -->
Never use blog or news photos as brand imagery.

Source: plugin/skills/web-design/SKILL.md:25.

## AIS-cd48711be535

<!-- AIS-cd48711be535 -->
`references/web.md`: Websites

Source: plugin/skills/web-design/SKILL.md:31.

## AIS-ab4fc962e466

<!-- AIS-ab4fc962e466 -->
`references/web-components.md`: Website components

Source: plugin/skills/web-design/SKILL.md:32.

## AIS-5c345077d52b

<!-- AIS-5c345077d52b -->
`references/assets.md`: Web assets

Source: plugin/skills/web-design/SKILL.md:33.

## AIS-5103f006e449

<!-- AIS-5103f006e449 -->
The final images of each website and its favicons, one file per picture in the largest size the site has. Logos for every brand are in [Downloads](../../brand-guidelines/references/downloads.md). Stock photographs are shown here, captioned as stock, but are left out of the zips: their licences let the sites show them, not pass the files on.

Source: plugin/skills/web-design/references/assets.md:3.

## AIS-f8d065e2f60a

<!-- AIS-f8d065e2f60a -->
Products, industries and the Sabadell building.

Source: plugin/skills/web-design/references/assets.md:7.

## AIS-b19e68fa9902

<!-- AIS-b19e68fa9902 -->
App screens and industries.

Source: plugin/skills/web-design/references/assets.md:11.

## AIS-154fa80de820

<!-- AIS-154fa80de820 -->
Photos of the companies, industries and solutions.

Source: plugin/skills/web-design/references/assets.md:15.

## AIS-310eada18d01

<!-- AIS-310eada18d01 -->
How the three sites are built. Each is an Astro site that takes its tokens and shared components from `@aisgroup/web` (`packages/web` in this repo), the website counterpart of the products’ `@rosepetal/design`, and keeps its own pages, header and content.

Source: plugin/skills/web-design/references/web-components.md:5.

## AIS-b8e4474055b1

<!-- AIS-b8e4474055b1 -->
`@aisgroup/web/styles.css` first: the brand’s tokens ([ais-tokens.css](../../../brand/downloads/ais-tokens.css), `--ais-*`), the site roles below (`--web-*`) and each brand’s settings, chosen with `data-brand` on `<html>` (`ais-group`, `ais-vision` or `rosepetal`): logo height, call-to-action size and the details that differ.

Source: plugin/skills/web-design/references/web-components.md:7.

## AIS-621452c33fc4

<!-- AIS-621452c33fc4 -->
Tailwind v4 for layout, with its text sizes pointed at the brand styles (`--text-base: var(--ais-text-body)` and so on). The components need no Tailwind.

Source: plugin/skills/web-design/references/web-components.md:8.

## AIS-971a3d6a393e

<!-- AIS-971a3d6a393e -->
A dark section or theme sets the roles again; the components never change. Rosepetal’s own CSS reads them through its `--rp-*` names.

Source: plugin/skills/web-design/references/web-components.md:9.

## AIS-5cbd82c68925

<!-- AIS-5cbd82c68925 -->
Inter, self-hosted (see [Typography](../../design-language/references/typography.md)), and Lucide icons (see [Icons](../../design-language/references/icons.md)): the arrow is 24 px in split buttons and 20 px in compact buttons and text links.

Source: plugin/skills/web-design/references/web-components.md:10.

## AIS-dd13b44f2da9

<!-- AIS-dd13b44f2da9 -->
| Role | Light | Token | Use |

Source: plugin/skills/web-design/references/web-components.md:12.

## AIS-522c36d982f0

<!-- AIS-522c36d982f0 -->
| Page (`--web-page`) | `#FFFFFF` | `--ais-neutral-0` | Page, header, menus |

Source: plugin/skills/web-design/references/web-components.md:14.

## AIS-a756ab108e64

<!-- AIS-a756ab108e64 -->
| Surface (`--web-surface`) | `#F8FAFC` | `--ais-neutral-50` | Behind pictures and films |

Source: plugin/skills/web-design/references/web-components.md:15.

## AIS-419d4c555862

<!-- AIS-419d4c555862 -->
| Section (`--web-section`) | `#F1F5F9` | `--ais-neutral-100` | Section grey |

Source: plugin/skills/web-design/references/web-components.md:16.

## AIS-df49c84b8e80

<!-- AIS-df49c84b8e80 -->
| Ink (`--web-ink`) | `#0F1729` | `--ais-neutral-900` | Text and titles |

Source: plugin/skills/web-design/references/web-components.md:17.

## AIS-09cc6a8505ee

<!-- AIS-09cc6a8505ee -->
| Muted (`--web-muted`) | `#4B5563` | `--ais-neutral-600` | Secondary text, card meta |

Source: plugin/skills/web-design/references/web-components.md:18.

## AIS-6ff3c5f7a9be

<!-- AIS-6ff3c5f7a9be -->
| Line (`--web-line`) | `#E2E8F0` | `--ais-neutral-200` | Rules, card rules, the header rule |

Source: plugin/skills/web-design/references/web-components.md:19.

## AIS-23ff97152949

<!-- AIS-23ff97152949 -->
| Line strong (`--web-line-strong`) | `#64748B` | `--ais-neutral-500` | Fields and outlined buttons (3:1) |

Source: plugin/skills/web-design/references/web-components.md:20.

## AIS-df33970c5690

<!-- AIS-df33970c5690 -->
| Action (`--web-action`) | `#17356E` | `--ais-blue-700` | Primary button, closing band |

Source: plugin/skills/web-design/references/web-components.md:21.

## AIS-7283d95ddc2a

<!-- AIS-7283d95ddc2a -->
| Action hover (`--web-action-hover`) | `#10254C` | `--ais-blue-800` | Primary button on hover |

Source: plugin/skills/web-design/references/web-components.md:22.

## AIS-998c72bbc9ec

<!-- AIS-998c72bbc9ec -->
| Link (`--web-link`) | `#3664B3` | `--ais-blue-500` | Links, text actions, focus ring |

Source: plugin/skills/web-design/references/web-components.md:23.

## AIS-e3ce9d2e8d05

<!-- AIS-e3ce9d2e8d05 -->
| Link hover (`--web-link-hover`) | `#1E4591` | `--ais-blue-600` | Links on hover |

Source: plugin/skills/web-design/references/web-components.md:24.

## AIS-946c369a020e

<!-- AIS-946c369a020e -->
| Hover fill (`--web-hover-fill`) | `#F1F5F9` | `--ais-neutral-100` | Outlined buttons and menu items on hover |

Source: plugin/skills/web-design/references/web-components.md:25.

## AIS-8874e63c8644

<!-- AIS-8874e63c8644 -->
The images each site uses are in [Web assets](assets.md).

Source: plugin/skills/web-design/references/web-components.md:27.

## AIS-a02066c35fa2

<!-- AIS-a02066c35fa2 -->
The components of `@aisgroup/web`, live and with their Astro code. Each site imports them as they are: `import SplitButton from '@aisgroup/web/components/split-button'`.

Source: plugin/skills/web-design/references/web-components.md:31.

## AIS-5c331ba4b73b

<!-- AIS-5c331ba4b73b -->
One filled call to action per view: the split button. The compact one goes in headers and cards. Text actions are links with an arrow. On a brand-blue band the button is white.

Source: plugin/skills/web-design/references/web-components.md:35.

## AIS-328aac7790f7

<!-- AIS-328aac7790f7 -->
| | Split button | Compact |

Source: plugin/skills/web-design/references/web-components.md:37.

## AIS-ecce29221fde

<!-- AIS-ecce29221fde -->
| **Height** | 52 px | 44 px |

Source: plugin/skills/web-design/references/web-components.md:39.

## AIS-2b708dbcc6f5

<!-- AIS-2b708dbcc6f5 -->
| **Label** | Label style, 24 px from the left edge, 24 px to the arrow segment | 16 px and 16 px |

Source: plugin/skills/web-design/references/web-components.md:40.

## AIS-2a6a919226ea

<!-- AIS-2a6a919226ea -->
| **Arrow segment** | 52 px square, 24 px arrow, a 1 px divider in the label colour at 20% | 44 px square, 20 px arrow |

Source: plugin/skills/web-design/references/web-components.md:41.

## AIS-9892232dd3db

<!-- AIS-9892232dd3db -->
**Primary:** brand blue with a white label; deep blue `#10254C` on hover and focus, blue-950 `#0B1220` while pressed. The segment stays put and the arrow inside moves 3 px (180 ms).

Source: plugin/skills/web-design/references/web-components.md:43.

## AIS-9c052a39dfc4

<!-- AIS-9c052a39dfc4 -->
**Secondary:** an outline for a second action beside the primary one: no fill, ink label, 1 px `#64748B` border; on hover the hover fill and an ink border.

Source: plugin/skills/web-design/references/web-components.md:44.

## AIS-881880f9d908

<!-- AIS-881880f9d908 -->
**White:** on a brand-blue band and on dark surfaces, with a brand-blue label; blue-50 `#EDF2FA` on hover.

Source: plugin/skills/web-design/references/web-components.md:45.

## AIS-d62a1484fcfb

<!-- AIS-d62a1484fcfb -->
**Without arrow:** the label centred, 16 px each side, for an action that goes nowhere, such as a form’s Reset.

Source: plugin/skills/web-design/references/web-components.md:46.

## AIS-873d094d7ed5

<!-- AIS-873d094d7ed5 -->
**Disabled:** 55% opacity, no hover. **Focus:** the 2 px focus ring with a 2 px gap.

Source: plugin/skills/web-design/references/web-components.md:47.

## AIS-fdea9446670a

<!-- AIS-fdea9446670a -->
Action blue in the Label style, with a 20 px arrow 8 px after the text; on hover and focus blue-600 `#1E4591`, a 1 px underline 4 px below and the arrow 3 px forward, without moving the layout. A back link puts the arrow on the left and moves it back. Inside running text (`p`, `li`, `dd`) a link takes the text’s size, has no arrow and is always underlined, at 40% of its colour, full on hover. Every standalone link has a 44 px target.

Source: plugin/skills/web-design/references/web-components.md:51.

## AIS-5575417f4aac

<!-- AIS-5575417f4aac -->
A square menu: the current language code with a chevron opens a 224 px list of every language in its own name, the current one in action blue with a check. Every link goes to the same page in the other language and carries `hreflang`. Only sites in more than one language show it.

Source: plugin/skills/web-design/references/web-components.md:55.

## AIS-da1ff4238c3a

<!-- AIS-da1ff4238c3a -->
The site’s name comes first; the current page is plain text.

Source: plugin/skills/web-design/references/web-components.md:59.

## AIS-ca4bff97ee53

<!-- AIS-ca4bff97ee53 -->
The H1 in Title size, never Display (Display is for the home page and campaign openers). Title on the left, intro on the right; they stack under 900 px. No eyebrow above the H1.

Source: plugin/skills/web-design/references/web-components.md:63.

## AIS-56ab906485d9

<!-- AIS-56ab906485d9 -->
A card is one link: no box, shadow or lift. Four layouts cover articles, resources, industries and lists.

Source: plugin/skills/web-design/references/web-components.md:67.

## AIS-044e2e832e52

<!-- AIS-044e2e832e52 -->
| Layout | Use | Parts |

Source: plugin/skills/web-design/references/web-components.md:69.

## AIS-d25260033101

<!-- AIS-d25260033101 -->
| **Stack** | Grids of articles, resources and industries | Photograph at 8:5, then 24 px below: meta (date, category) in Small and muted, the title in Subheading with the arrow, the description in Body and muted |

Source: plugin/skills/web-design/references/web-components.md:71.

## AIS-297a8a7f58b1

<!-- AIS-297a8a7f58b1 -->
| **Row** | Long lists | A 128 px thumbnail beside the title in Body, medium; 1 px rules between rows; two columns, one under 900 px |

Source: plugin/skills/web-design/references/web-components.md:72.

## AIS-781e722f037a

<!-- AIS-781e722f037a -->
| **Text** | Links without a picture | A 1 px rule on top, the title, the description and an optional text action |

Source: plugin/skills/web-design/references/web-components.md:73.

## AIS-d04dd8dfb234

<!-- AIS-d04dd8dfb234 -->
| **Featured** | One lead item | Photograph at 4:3 on 7 of 12 columns, the copy on 5, the title in Heading; stacked under 900 px |

Source: plugin/skills/web-design/references/web-components.md:74.

## AIS-bb24ecea4ad7

<!-- AIS-bb24ecea4ad7 -->
On hover and focus the title turns action blue, the arrow moves 3 px and the photograph eases to 103% (700 ms, enter curve). A product screen in a card is shown whole, in its window frame, and does not zoom. The grid has 2, 3 or 4 columns with 48 px gaps (32 px between columns under 1200 px); 4 and 3 columns drop to 2 under 1200 and 900 px, and every grid is one column under 600 px.

Source: plugin/skills/web-design/references/web-components.md:76.

## AIS-595521cdba97

<!-- AIS-595521cdba97 -->
Contact forms are our markup with Zoho’s field names, and they post straight to Zoho CRM: `action="https://crm.zoho.com/crm/WebToLeadForm"`, `method="POST"`, UTF-8 (the specimen posts nowhere). The fields are labelled inputs, a textarea and a native select, at 48 px, square, with the 3:1 field border; the consents are native checkboxes, so the browser can require them. Two columns from 600 px, a notice on the use of the data above the fields, the split button to send.

Source: plugin/skills/web-design/references/web-components.md:80.

## AIS-c55af7328ce6

<!-- AIS-c55af7328ce6 -->
**Required:** Name (`Last Name`; Zoho’s `First Name` goes empty), Company, Email, Phone, Sector (`Industry`, with the CRM’s Spanish values), Function (`LEADCF17`), City, Country, Message (`Description`) and the privacy consent, whose own words link the policy. The marketing consent is optional. A brand may add its own questions after the required fields, in the same style.

Source: plugin/skills/web-design/references/web-components.md:82.

## AIS-9c2a17a28587

<!-- AIS-9c2a17a28587 -->
**Filled in on submit:** subject (`LEADCF4`), language (`LEADCF1`), page URL, referrer and the two consents as Sí or No. A hidden anti-spam field stays empty.

Source: plugin/skills/web-design/references/web-components.md:83.

## AIS-25e2bec7c0fd

<!-- AIS-25e2bec7c0fd -->
**reCAPTCHA:** the Zoho form requires it. Render Google’s reCAPTCHA v2 in the `data-recaptcha` box with the form’s site key, and load it, with Zoho’s form statistics, only when the visitor first uses the form, as the notice says.

Source: plugin/skills/web-design/references/web-components.md:84.

## AIS-914fe00d795f

<!-- AIS-914fe00d795f -->
The browser blocks empty required fields, and a free or disposable address (gmail, hotmail and similar) shows the corporate email error under the field. AIS Vision Systems’ `ZohoLeadForm` adds these checks.

Source: plugin/skills/web-design/references/web-components.md:86.

## AIS-cdfaf606232c

<!-- AIS-cdfaf606232c -->
YouTube films load only when asked. The frame is 16:9 with our own still, saved on the site so nothing loads from YouTube before the click, and a 64 px brand-blue play square; on hover the square turns deep blue and the still eases to 103%. A click, Enter or Space replaces it with the autoplaying youtube-nocookie player. Put the video ID in `data-video-id` and the film’s title in `aria-label` and `alt`. The package’s `VideoEmbed` does this.

Source: plugin/skills/web-design/references/web-components.md:90.

## AIS-29f96b03ccd4

<!-- AIS-29f96b03ccd4 -->
Our own films are self-hosted mp4, never YouTube: muted, with a poster, `playsinline`, loaded with `preload="metadata"`.

Source: plugin/skills/web-design/references/web-components.md:94.

## AIS-73b7859a4f78

<!-- AIS-73b7859a4f78 -->
**Product film:** a screen recording shown as a window: 1 px neutral-200 `#E2E8F0` border, 4 px corner, the raised shadow. It loops.

Source: plugin/skills/web-design/references/web-components.md:96.

## AIS-c98b19378460

<!-- AIS-c98b19378460 -->
**Industry film:** real footage, square, 16:9 on neutral-50 `#F8FAFC`, with the detections drawn over it in the [overlay style](../../design-language/references/imagery.md#detection-overlays).

Source: plugin/skills/web-design/references/web-components.md:97.

## AIS-2732e865ad92

<!-- AIS-2732e865ad92 -->
A film plays only while at least 15% of it is on screen and the tab is visible, and never by itself with reduced motion. Under it, 16 px below: the current chapter on the left in Subheading, ending in a full stop, and a 44 px square play and pause button on the right, with an 18 px brand-blue icon and blue-50 `#EDF2FA` on hover.

Source: plugin/skills/web-design/references/web-components.md:99.

## AIS-3eba62a73c78

<!-- AIS-3eba62a73c78 -->
Brand blue, the invitation as a Heading, one white split button to the contact page. Every home page ends with it, and so does every page of the AIS sites.

Source: plugin/skills/web-design/references/web-components.md:103.

## AIS-210947d74674

<!-- AIS-210947d74674 -->
Rosepetal’s other pages end on the page: a 1 px rule, the invitation as a Heading with an optional line of muted text, and the brand-blue split button on the right; they stack on phones. They already close on product screens, so a blue band would compete with them.

Source: plugin/skills/web-design/references/web-components.md:105.

## AIS-b3be444ca8c8

<!-- AIS-b3be444ca8c8 -->
The cookie notice is one ink bar fixed to the bottom, the same in every theme: Settings as a quiet text action, then Reject all and Accept all, both white and of equal weight, so refusing takes no more effort than accepting. Settings opens Necessary (always on), Analytics and Marketing. Nothing that needs consent loads before the choice: analytics waits for Analytics, advertising and visitor tracking for Marketing, and films, maps and the form’s services load only when the visitor uses them. The choice is stored with the policy’s version and asked again after a year. A site that sets no such cookies shows no notice.

Source: plugin/skills/web-design/references/web-components.md:109.

## AIS-d4ab2892b152

<!-- AIS-d4ab2892b152 -->
The event card waits until the visitor has chosen, then appears bottom right: brand blue on light pages, a white tile on dark ones, never the footer’s colour.

Source: plugin/skills/web-design/references/web-components.md:111.

## AIS-064a15d5d990

<!-- AIS-064a15d5d990 -->
A dark theme sets the same roles to the night palette; the parts stay the same, and primary buttons turn white. The sites are light: AIS uses this on its deep-blue sections and closing band, and Rosepetal keeps its dark themes as previews only (`?theme=`). Which surfaces have a dark theme is on Light and dark themes.

Source: plugin/skills/web-design/references/web-components.md:115.

## AIS-d201922f305a

<!-- AIS-d201922f305a -->
| Element | Specification |

Source: plugin/skills/web-design/references/web.md:5.

## AIS-fbfdc6cf5d6c

<!-- AIS-fbfdc6cf5d6c -->
| **Grid** | Content up to 1440 px wide, fluid 24–64 px margins, 12 columns and four breakpoints. See [Layout and shape](../../design-language/references/layout.md). |

Source: plugin/skills/web-design/references/web.md:7.

## AIS-f91d2bf2ef4a

<!-- AIS-f91d2bf2ef4a -->
| **Split button** | The primary call to action: 52 px tall, square corners, label plus a separate 52 px arrow segment; 44 px compact in headers and cards (AIS sites). Rosepetal uses the 44 px size for every call to action, on pages too. |

Source: plugin/skills/web-design/references/web.md:8.

## AIS-f6f96882e24d

<!-- AIS-f6f96882e24d -->
| **Controls** | Header buttons and menus 44 px tall; form fields 48 px. Every target is at least 44 × 44 px. |

Source: plugin/skills/web-design/references/web.md:9.

## AIS-85e9ec87c26e

<!-- AIS-85e9ec87c26e -->
| **Header** | 76 px tall, in the page colour over a 1 px rule. Logo; navigation; on the right the actions: an optional secondary action as text, then the compact split button. No theme toggle. |

Source: plugin/skills/web-design/references/web.md:10.

## AIS-037f8c82e874

<!-- AIS-037f8c82e874 -->
| **Logo in the header** | The official file only. AIS lockups 44 px tall, in black; Rosepetal wordmark 27 px tall (140 px wide), 25 px (130 px, its minimum) on phones, in blue. See [Logos](../../brand-guidelines/references/logos.md#on-websites). |

Source: plugin/skills/web-design/references/web.md:11.

## AIS-cac3a61db94e

<!-- AIS-cac3a61db94e -->
| **Links and hovers** | One behaviour per kind, the same on every site. See [Motion](../../design-language/references/motion.md#links-and-hovers). |

Source: plugin/skills/web-design/references/web.md:12.

## AIS-73955a93c27c

<!-- AIS-73955a93c27c -->
| **Text styles** | The same role uses the same style on every site. See [Typography](../../design-language/references/typography.md#same-role-same-style). |

Source: plugin/skills/web-design/references/web.md:13.

## AIS-210301f46591

<!-- AIS-210301f46591 -->
| **Tables and text blocks** | `.ais-table`, `.ais-figures`, `.ais-quote` and `.ais-note` from `@aisgroup/web/styles.css`, as [Documents and presentations](../../communications/references/communications.md#table) sets them. Never a table on a blue band. |

Source: plugin/skills/web-design/references/web.md:14.

## AIS-f8c548bf8318

<!-- AIS-f8c548bf8318 -->
| **Headlines** | Display (44–72 px) on the home page and campaign openers only, Title on phones under 600 px; Title (34–56 px) on every other page. See [Typography](../../design-language/references/typography.md). |

Source: plugin/skills/web-design/references/web.md:15.

## AIS-8aee07b40762

<!-- AIS-8aee07b40762 -->
| **Section spacing** | `--ais-space-section` in total between two sections, never on both sides of each. |

Source: plugin/skills/web-design/references/web.md:16.

## AIS-d59819e4dfcd

<!-- AIS-d59819e4dfcd -->
| **Openers** | Full-bleed photo or video up to a 1920 px window, then centred; never cropping the subject. |

Source: plugin/skills/web-design/references/web.md:17.

## AIS-2369e3aeae1f

<!-- AIS-2369e3aeae1f -->
| **Footer** | Brand block, three link columns, legal row, and the «Part of AIS Group» line. Light sites use deep blue `#10254C`; dark sites continue the page background under a 1 px hairline, with no colour block. |

Source: plugin/skills/web-design/references/web.md:18.

## AIS-d123165b0b41

<!-- AIS-d123165b0b41 -->
| **Cookie notice** | One component on every site: the full-width ink bar (`#0F1729`) fixed at the bottom, with the same colours and buttons in every theme. See [Website components](web-components.md#cookie-notice-and-event-card). |

Source: plugin/skills/web-design/references/web.md:19.

## AIS-c610198622b1

<!-- AIS-c610198622b1 -->
| **Event and announcement cards** | On light sites, brand blue `#17356E` with a 1 px blue-600 `#1E4591` border, light-blue `#A7BFE4` eyebrow and icons, white title and neutral-200 `#E2E8F0` details. On dark sections and Rosepetal’s dark previews, a white tile. Square; never the footer colour. Shown only after the cookie choice, never together with it. |

Source: plugin/skills/web-design/references/web.md:20.

## AIS-07d752003a87

<!-- AIS-07d752003a87 -->
| **Tab titles** | «Page title \| Brand», for example «AIS REV 360 \| AIS Vision Systems». No dashes, middle dots or brand-first titles. |

Source: plugin/skills/web-design/references/web.md:21.

## AIS-a2db0bfbf802

<!-- AIS-a2db0bfbf802 -->
| **Favicons** | The bare mark from the website set: blue `#17356E` in light mode, white in dark mode, pixel-snapped at each size. See [Logos](../../brand-guidelines/references/logos.md#favicons). |

Source: plugin/skills/web-design/references/web.md:22.

## AIS-ea443534744e

<!-- AIS-ea443534744e -->
| **Corners** | Square: buttons, fields, cards, menus, notices, photographs and films. A product screen shown as a window takes the window’s 4 px corner. See [Layout and shape](../../design-language/references/layout.md#shape). |

Source: plugin/skills/web-design/references/web.md:23.

## AIS-004c37adc2aa

<!-- AIS-004c37adc2aa -->
| **Motion** | Headline reveals, a fixed header during page transitions, 3 px arrow hovers. See Motion. |

Source: plugin/skills/web-design/references/web.md:24.

## AIS-f187351826ca

<!-- AIS-f187351826ca -->
The sites differ in mood, not in parts. When the same element exists on more than one site, it is built the same way. All three are light.

Source: plugin/skills/web-design/references/web.md:26.

## AIS-50bf95502094

<!-- AIS-50bf95502094 -->
| | AIS Group | AIS Vision Systems | Rosepetal |

Source: plugin/skills/web-design/references/web.md:28.

## AIS-ee70a048ce35

<!-- AIS-ee70a048ce35 -->
| **Header logo** | AIS Group, black, 44 px | AIS Vision Systems, black, 44 px | Rosepetal, blue, 27 px |

Source: plugin/skills/web-design/references/web.md:30.

## AIS-cdd36c63c5a7

<!-- AIS-cdd36c63c5a7 -->
| **Header actions** | Contact | Language picker, Contact | Request access (text), Book a demo |

Source: plugin/skills/web-design/references/web.md:31.

## AIS-9171d04182c2

<!-- AIS-9171d04182c2 -->
| **Page ending** | Closing band in brand blue | Closing band in brand blue | Closing band on the home page; on the page, under a 1 px rule, elsewhere |

Source: plugin/skills/web-design/references/web.md:32.

## AIS-96a08fce2952

<!-- AIS-96a08fce2952 -->
| **Evidence** | The companies | Product photography, installations | Product films, screens, isometric figures |

Source: plugin/skills/web-design/references/web.md:33.

## AIS-6d7ed1b115a3

<!-- AIS-6d7ed1b115a3 -->
| **Languages** | English | English, Spanish, Catalan and more | English |

Source: plugin/skills/web-design/references/web.md:34.

## AIS-7a5356da436f

<!-- AIS-7a5356da436f -->
Hardware, presented as a precise industrial catalogue.

Source: plugin/skills/web-design/references/web.md:38.

## AIS-d80bdabceebe

<!-- AIS-d80bdabceebe -->
**Light:** white and section grey (`#F1F5F9`), with deep blue (`#10254C`) for dark sections and the footer, and brand blue (`#17356E`) for the closing band.

Source: plugin/skills/web-design/references/web.md:40.
