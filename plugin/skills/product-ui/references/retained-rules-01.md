# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-4772e4b1ef42

<!-- AIS-4772e4b1ef42 -->
Install `@aisgroup/design` instead of copying its files. A fix to a component is made in the package (`packages/design`) and published as a new version.

Source: plugin/skills/product-ui/SKILL.md:14.

## AIS-e09671d75dea

<!-- AIS-e09671d75dea -->
Never add a Button or Badge variant, never override a component's radius, and never use `[&_…]` selectors to restyle a part.

Source: plugin/skills/product-ui/SKILL.md:15.

## AIS-8423d4948f04

<!-- AIS-8423d4948f04 -->
Icon-only buttons have an `aria-label` and a Tooltip.

Source: plugin/skills/product-ui/SKILL.md:16.

## AIS-ea10e269ff1c

<!-- AIS-ea10e269ff1c -->
Every async section has a loading state (Skeleton or Spinner), an empty state and a failure state with Retry.

Source: plugin/skills/product-ui/SKILL.md:17.

## AIS-0dd2942d71e6

<!-- AIS-0dd2942d71e6 -->
Use the stock shadcn-vue components from `@aisgroup/design` with their own variants and sizes. Classes are for page layout only: grid, flex, gap, width, position.

Source: plugin/skills/product-ui/SKILL.md:18.

## AIS-08f601f803ff

<!-- AIS-08f601f803ff -->
Every colour is a token from `@aisgroup/design/styles.css`. No palette classes such as `bg-gray-500` and no hex values in templates.

Source: plugin/skills/product-ui/SKILL.md:19.

## AIS-754481f2b70d

<!-- AIS-754481f2b70d -->
Status is a toned icon and a word (Finished, Pending, Failed). Never colour alone and never tinted pills.

Source: plugin/skills/product-ui/SKILL.md:20.

## AIS-e0c846b31642

<!-- AIS-e0c846b31642 -->
Sentence case for every title, label and button. No middle dots or Unicode arrows. Anything people read is at least 14 px; 12 px only for chart axes and keyboard keys.

Source: plugin/skills/product-ui/SKILL.md:21.

## AIS-0f838e0df7fe

<!-- AIS-0f838e0df7fe -->
`references/using-components.md`: Using the components

Source: plugin/skills/product-ui/SKILL.md:27.

## AIS-47cb174e5db2

<!-- AIS-47cb174e5db2 -->
`references/components.md`: every component and block of @aisgroup/design, the Node-RED widgets and the parts of the Profiler, with their source files

Source: plugin/skills/product-ui/SKILL.md:28.

## AIS-de84bbd1bd06

Historical wording: explicitly superseded by AIS-866552460e12. The package is public on npmjs as @aisgroup/design, under the name the imports use: no alias or private registry. Apply the current rule.

<!-- AIS-de84bbd1bd06 -->
Every component and brand block of `@aisgroup/design` 0.0.0 (`rosepetal-ai/aisgroup-design@dev:packages/design`), the Node-RED widgets and the Profiler's parts. Each entry gives what it is for and its source as `owner/repo@branch:path`. Apps install the package (`npm i @aisgroup/design`, from the company's Artifact Registry) and import `@aisgroup/design/styles.css` after Tailwind. The code of every component and block is also a shadcn-vue registry item: install it with `npx shadcn-vue@latest add https://design.aisgroup.ai/r/<id>.json` (the tokens are `r/theme.json`), read it with the MCP tool design_code, or open `brand/registry/<id>.json` in the AIS Group Design plugin. Live examples: /en/components/<id>/. When this index and the code disagree, the code is right about how a part works and the guide is right about how to use it. Brand rules: /en/brand.md.

Source: plugin/skills/product-ui/references/components.md:3.

## AIS-e66a0220aa10

<!-- AIS-e66a0220aa10 -->
Stock shadcn-vue in the Rosepetal look. Import: `import { Button } from '@aisgroup/design/ui/button'`.

Source: plugin/skills/product-ui/references/components.md:7.

## AIS-6df1fa031c25

<!-- AIS-6df1fa031c25 -->
**Alert** (`alert`): A status message inside a section: icon and text take the tone, the surface stays the card. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/alert/`

Source: plugin/skills/product-ui/references/components.md:9.

## AIS-6585bdd423bb

<!-- AIS-6585bdd423bb -->
**Alert dialog** (`alert-dialog`): A question that interrupts: it has to be answered to go on. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/alert-dialog/`

Source: plugin/skills/product-ui/references/components.md:10.

## AIS-e5fc954b7561

<!-- AIS-e5fc954b7561 -->
**Avatar** (`avatar`): The person signed in, as a picture or initials. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/avatar/`

Source: plugin/skills/product-ui/references/components.md:11.

## AIS-e3e0c9ac92ad

<!-- AIS-e3e0c9ac92ad -->
**Badge** (`badge`): Counts and short neutral labels. Status is an icon and a word, not a badge. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/badge/`

Source: plugin/skills/product-ui/references/components.md:12.

## AIS-0f28f74e8a14

<!-- AIS-0f28f74e8a14 -->
**Breadcrumb** (`breadcrumb`): Where a page sits. Every crumb navigates to its own page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/breadcrumb/`

Source: plugin/skills/product-ui/references/components.md:13.

## AIS-9d5e853ebb9a

<!-- AIS-9d5e853ebb9a -->
**Button** (`button`): Primary, secondary, outline, ghost, destructive and link, in every size. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/button/`

Source: plugin/skills/product-ui/references/components.md:14.

## AIS-65fd9f418ec6

<!-- AIS-65fd9f418ec6 -->
**Card** (`card`): Only for clickable entities, summaries and floating panels. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/card/`

Source: plugin/skills/product-ui/references/components.md:15.

## AIS-057246830850

<!-- AIS-057246830850 -->
**Carousel** (`carousel`): A row of items that moves one at a time. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/carousel/`

Source: plugin/skills/product-ui/references/components.md:16.

## AIS-23a190ad036d

<!-- AIS-23a190ad036d -->
**Checkbox** (`checkbox`): One option on or off, or several options from a list. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/checkbox/`

Source: plugin/skills/product-ui/references/components.md:17.

## AIS-00a3f5142e71

<!-- AIS-00a3f5142e71 -->
**Collapsible** (`collapsible`): A section that opens and closes. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/collapsible/`

Source: plugin/skills/product-ui/references/components.md:18.

## AIS-5f675374fc9a

<!-- AIS-5f675374fc9a -->
**Combobox** (`combobox`): Choosing from a long list, with search. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/combobox/`

Source: plugin/skills/product-ui/references/components.md:19.

## AIS-321457a5830c

<!-- AIS-321457a5830c -->
**Dialog** (`dialog`): Header band, body and full-width footer buttons: Cancel first, the action second. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/dialog/`

Source: plugin/skills/product-ui/references/components.md:20.

## AIS-4c9feffc1bec

<!-- AIS-4c9feffc1bec -->
**Dropdown menu** (`dropdown-menu`): Row actions behind the more button, with named items. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/dropdown-menu/`

Source: plugin/skills/product-ui/references/components.md:21.

## AIS-a68bd94bcf37

<!-- AIS-a68bd94bcf37 -->
**Empty** (`empty`): An empty container, with a clear action. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/empty/`

Source: plugin/skills/product-ui/references/components.md:22.

## AIS-94a3d480f61b

<!-- AIS-94a3d480f61b -->
**Field** (`field`): Label above the control, description and error under it. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/field/`

Source: plugin/skills/product-ui/references/components.md:23.

## AIS-a273a3df22d7

<!-- AIS-a273a3df22d7 -->
**Input** (`input`): Text, numbers and search, with units as input group addons. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/input/`

Source: plugin/skills/product-ui/references/components.md:24.

## AIS-b91d77572b33

<!-- AIS-b91d77572b33 -->
**Input group** (`input-group`): A field with icons, text or buttons inside. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/input-group/`

Source: plugin/skills/product-ui/references/components.md:25.

## AIS-c1f1d8b27752

<!-- AIS-c1f1d8b27752 -->
**Item** (`item`): Clickable entities: datasets, models, images. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/item/`

Source: plugin/skills/product-ui/references/components.md:26.

## AIS-91c97f45c77e

<!-- AIS-91c97f45c77e -->
**Kbd** (`kbd`): Keyboard shortcuts. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/kbd/`

Source: plugin/skills/product-ui/references/components.md:27.

## AIS-77497e6cdcca

<!-- AIS-77497e6cdcca -->
**Label** (`label`): The name of a field. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/label/`

Source: plugin/skills/product-ui/references/components.md:28.

## AIS-15d7d1dbcd59

<!-- AIS-15d7d1dbcd59 -->
**Navigation menu** (`navigation-menu`): A menu of links, with dropdown groups. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/navigation-menu/`

Source: plugin/skills/product-ui/references/components.md:29.

## AIS-67c262bb6c98

<!-- AIS-67c262bb6c98 -->
**Pagination** (`pagination`): Numbered pages under a table. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/pagination/`

Source: plugin/skills/product-ui/references/components.md:30.

## AIS-1539e4ad1d25

<!-- AIS-1539e4ad1d25 -->
**Popover** (`popover`): A panel anchored to its control. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/popover/`

Source: plugin/skills/product-ui/references/components.md:31.

## AIS-27b2f076634b

<!-- AIS-27b2f076634b -->
**Progress** (`progress`): How far a task has gone. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/progress/`

Source: plugin/skills/product-ui/references/components.md:32.

## AIS-83d4a0f856a7

<!-- AIS-83d4a0f856a7 -->
**Radio group** (`radio-group`): A choice between a few modes, as choice cards. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/radio-group/`

Source: plugin/skills/product-ui/references/components.md:33.

## AIS-14d2811c48fe

<!-- AIS-14d2811c48fe -->
**Scroll area** (`scroll-area`): A region with its own scroll. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/scroll-area/`

Source: plugin/skills/product-ui/references/components.md:34.

## AIS-80c29358e19c

<!-- AIS-80c29358e19c -->
**Select** (`select`): Choosing from a short list. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/select/`

Source: plugin/skills/product-ui/references/components.md:35.

## AIS-2d7d1b17c6d9

<!-- AIS-2d7d1b17c6d9 -->
**Separator** (`separator`): Between rows and in toolbars only. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/separator/`

Source: plugin/skills/product-ui/references/components.md:36.

## AIS-7bdacb2c9944

<!-- AIS-7bdacb2c9944 -->
**Sheet** (`sheet`): A side panel over the page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sheet/`

Source: plugin/skills/product-ui/references/components.md:37.

## AIS-57ff099ab081

<!-- AIS-57ff099ab081 -->
**Sidebar** (`sidebar`): The side navigation of a page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sidebar/`

Source: plugin/skills/product-ui/references/components.md:38.

## AIS-cef21ab3e488

<!-- AIS-cef21ab3e488 -->
**Skeleton** (`skeleton`): Content loading, in the shape of the content. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/skeleton/`

Source: plugin/skills/product-ui/references/components.md:39.

## AIS-9a75ae40aec8

<!-- AIS-9a75ae40aec8 -->
**Slider** (`slider`): A value in a range. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/slider/`

Source: plugin/skills/product-ui/references/components.md:40.

## AIS-3efcc5184e39

<!-- AIS-3efcc5184e39 -->
**Toast** (`sonner`): Short feedback after an action. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sonner/`

Source: plugin/skills/product-ui/references/components.md:41.

## AIS-eef6fa2ad8f4

<!-- AIS-eef6fa2ad8f4 -->
**Spinner** (`spinner`): Something working: in its button, or filling an empty area. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/spinner/`

Source: plugin/skills/product-ui/references/components.md:42.

## AIS-9168254074fb

<!-- AIS-9168254074fb -->
**Switch** (`switch`): A setting on or off, in a switch row. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/switch/`

Source: plugin/skills/product-ui/references/components.md:43.

## AIS-20dfe31e7adb

<!-- AIS-20dfe31e7adb -->
**Table** (`table`): Rows of facts with sortable headers. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/table/`

Source: plugin/skills/product-ui/references/components.md:44.

## AIS-a53a3e4f34a6

<!-- AIS-a53a3e4f34a6 -->
**Tabs** (`tabs`): Views of the same thing. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tabs/`

Source: plugin/skills/product-ui/references/components.md:45.

## AIS-e02d620001cb

<!-- AIS-e02d620001cb -->
**Textarea** (`textarea`): Longer text. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/textarea/`

Source: plugin/skills/product-ui/references/components.md:46.

## AIS-d832ed777d16

<!-- AIS-d832ed777d16 -->
**Toggle** (`toggle`): One button that stays on or off. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/toggle/`

Source: plugin/skills/product-ui/references/components.md:47.

## AIS-1f395b660690

<!-- AIS-1f395b660690 -->
**Toggle group** (`toggle-group`): One tool or option out of a few. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/toggle-group/`

Source: plugin/skills/product-ui/references/components.md:48.

## AIS-6afa10379b01

<!-- AIS-6afa10379b01 -->
**Tooltip** (`tooltip`): The name of an icon-only button. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tooltip/`

Source: plugin/skills/product-ui/references/components.md:49.

## AIS-b80e783f0a6a

<!-- AIS-b80e783f0a6a -->
Brand pieces built from the components, with no app logic: texts and data come from each app. Import: `import TopBar from '@aisgroup/design/blocks/TopBar.vue'`.

Source: plugin/skills/product-ui/references/components.md:53.

## AIS-40713849013c

<!-- AIS-40713849013c -->
**Top bar** (`top-bar`): The brand bar: colour, height and logo. Each app gives its links and actions. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/TopBar.vue`

Source: plugin/skills/product-ui/references/components.md:55.

## AIS-420de2048ba3

<!-- AIS-420de2048ba3 -->
**Login page** (`login-page`): The sign-in page. Each app gives its texts and checks the password. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/LoginPage.vue`

Source: plugin/skills/product-ui/references/components.md:56.

## AIS-b675b714efd6

<!-- AIS-b675b714efd6 -->
**Confirm dialog** (`confirm-dialog`): A question before an action: it runs the action, shows its progress and errors, and offers Retry. Each app gives its texts and the action. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/ConfirmDialog.vue`

Source: plugin/skills/product-ui/references/components.md:57.

## AIS-818d5128bace

<!-- AIS-818d5128bace -->
**Log terminal** (`log-terminal`): A console for logs. Each app gives its lines. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/LogTerminal.vue`

Source: plugin/skills/product-ui/references/components.md:58.

## AIS-9440d81d49bb

<!-- AIS-9440d81d49bb -->
Stock FlowFuse widgets in the Rosepetal theme.

Source: plugin/skills/product-ui/references/components.md:62.

## AIS-33111aafb463

<!-- AIS-33111aafb463 -->
**Button**: ui-button: text, icon left or right, icon only, disabled.

Source: plugin/skills/product-ui/references/components.md:64.

## AIS-55f55cd593e6

<!-- AIS-55f55cd593e6 -->
**Button group**: ui-button-group: one value out of a few, with text or icons.

Source: plugin/skills/product-ui/references/components.md:65.

## AIS-c9c37516109e

<!-- AIS-c9c37516109e -->
**Text input**: ui-text-input in every mode: text, password, email, textarea, date, time, colour.

Source: plugin/skills/product-ui/references/components.md:66.

## AIS-2b2172b2d990

<!-- AIS-2b2172b2d990 -->
**Number input**: ui-number-input with its three button layouts and an icon.

Source: plugin/skills/product-ui/references/components.md:67.

## AIS-2a007ce14f4a

<!-- AIS-2a007ce14f4a -->
**Dropdown**: ui-dropdown: one option, with search, several options.

Source: plugin/skills/product-ui/references/components.md:68.

## AIS-a1e5009f3dda

<!-- AIS-a1e5009f3dda -->
**Switch**: ui-switch in its layouts, with icons, the whole row clickable.

Source: plugin/skills/product-ui/references/components.md:69.

## AIS-c67f34a39021

<!-- AIS-c67f34a39021 -->
**Slider**: ui-slider with ticks, a number field and icons.

Source: plugin/skills/product-ui/references/components.md:70.

## AIS-ac5bdcaee681

<!-- AIS-ac5bdcaee681 -->
**Radio group**: ui-radio-group in one column or in a row.

Source: plugin/skills/product-ui/references/components.md:71.

## AIS-8a534808c257

<!-- AIS-8a534808c257 -->
**File input**: ui-file-input for one file or several.

Source: plugin/skills/product-ui/references/components.md:72.

## AIS-865076766f54

<!-- AIS-865076766f54 -->
**Form**: ui-form with every field type, in one or two columns.

Source: plugin/skills/product-ui/references/components.md:73.

## AIS-78c773b0c731

<!-- AIS-78c773b0c731 -->
**Text**: ui-text: a label and a live value, in each layout.

Source: plugin/skills/product-ui/references/components.md:74.

## AIS-0b09189fa47c

<!-- AIS-0b09189fa47c -->
**Markdown**: ui-markdown: headings, lists, tables, code and quotes.

Source: plugin/skills/product-ui/references/components.md:75.

## AIS-aacdd968590e

<!-- AIS-aacdd968590e -->
**Table**: ui-table with search, row click and checkbox selection.

Source: plugin/skills/product-ui/references/components.md:76.

## AIS-996979f4d344

<!-- AIS-996979f4d344 -->
**Chart**: ui-chart: line, area, scatter, bar, stacked, pie, doughnut and histogram, on the chart tokens.

Source: plugin/skills/product-ui/references/components.md:77.

## AIS-87ddd23f0525

<!-- AIS-87ddd23f0525 -->
**Gauge**: ui-gauge: half, three quarters, tile, battery and tank.

Source: plugin/skills/product-ui/references/components.md:78.

## AIS-22e17aa18aac

<!-- AIS-22e17aa18aac -->
**Progress**: ui-progress with live values.

Source: plugin/skills/product-ui/references/components.md:79.

## AIS-b95b1edf6f7b

<!-- AIS-b95b1edf6f7b -->
**Notification**: ui-notification: press a button to show one.

Source: plugin/skills/product-ui/references/components.md:80.

## AIS-b1a8a4f4d058

<!-- AIS-b1a8a4f4d058 -->
**Template**: ui-template: a widget written in Vue.

Source: plugin/skills/product-ui/references/components.md:81.

## AIS-eff784e2650a

<!-- AIS-eff784e2650a -->
Source: `rosepetal-ai/rosepetal-node-red-dashboard-contrib`.

Source: plugin/skills/product-ui/references/components.md:85.

## AIS-07ad78d6e78c

<!-- AIS-07ad78d6e78c -->
**Session status** (`rp-session-status`): The batch state as a large status block, such as Batch running.

Source: plugin/skills/product-ui/references/components.md:87.

## AIS-114ff9b9bb84

<!-- AIS-114ff9b9bb84 -->
**Session info** (`rp-session-info`): Last result, totals and NOKs of the running batch.

Source: plugin/skills/product-ui/references/components.md:88.

## AIS-98de8730f397

<!-- AIS-98de8730f397 -->
**Confirm button** (`rp-btn-confirm`): A button that asks before an action with effects, such as ending a batch.

Source: plugin/skills/product-ui/references/components.md:89.

## AIS-9efb983cec53

<!-- AIS-9efb983cec53 -->
**Button switch** (`rp-btn-switch`): Two states as a joined pair, such as bypass active or inactive.

Source: plugin/skills/product-ui/references/components.md:90.

## AIS-31a6f3bff198

<!-- AIS-31a6f3bff198 -->
**Last error** (`rp-last-error`): The last NOK image with its boxes and its class.

Source: plugin/skills/product-ui/references/components.md:91.

## AIS-56397368ada6

<!-- AIS-56397368ada6 -->
**Image queue** (`rp-image-queue`): The latest inspected images as thumbnails with OK or NOK.

Source: plugin/skills/product-ui/references/components.md:92.

## AIS-63e638de2aad

<!-- AIS-63e638de2aad -->
**Live view canvas** (`rp-canvas-fabric`): The live camera image with its result, boxes and view controls.

Source: plugin/skills/product-ui/references/components.md:93.

## AIS-f0e724097a04

<!-- AIS-f0e724097a04 -->
**Bar chart** (`rp-chart-bar`): Classes and OK and NOK counts, on the chart tokens.

Source: plugin/skills/product-ui/references/components.md:94.

## AIS-4d33bce9eb76

<!-- AIS-4d33bce9eb76 -->
**Line chart** (`rp-chart-line`): A value over time with its average, minimum and maximum, such as inference time.

Source: plugin/skills/product-ui/references/components.md:95.

## AIS-d32017d9eedc

<!-- AIS-d32017d9eedc -->
**Image grid** (`rp-image-grid`): Captured images in a grid that grows with the screen.

Source: plugin/skills/product-ui/references/components.md:96.

## AIS-e61719a4b85d

<!-- AIS-e61719a4b85d -->
**Image log** (`rp-image-log`): The inspected images with their result and time, newest first.

Source: plugin/skills/product-ui/references/components.md:97.

## AIS-eb6033781103

<!-- AIS-eb6033781103 -->
**Dataset save menu** (`rp-dataset-save-menu`): Where each kind of image is saved: its suffix and its dataset.

Source: plugin/skills/product-ui/references/components.md:98.

## AIS-8b3b0b4092d8

<!-- AIS-8b3b0b4092d8 -->
**Sessions header** (`rp-sessions-header`): The Sessions page header: session history and image saving.

Source: plugin/skills/product-ui/references/components.md:99.

## AIS-62c28ac2a17d

<!-- AIS-62c28ac2a17d -->
**Session details** (`rp-session-details`): The facts of one session: recipe, times and counts.

Source: plugin/skills/product-ui/references/components.md:100.

## AIS-801bb03dfc52

<!-- AIS-801bb03dfc52 -->
Source: `rosepetal-ai/rosepetal-node-red-profiler:src/domains/configurator/components/<file>`.

Source: plugin/skills/product-ui/references/components.md:104.

## AIS-1ff5ffe7279b

<!-- AIS-1ff5ffe7279b -->
**Format gallery** (`gallery`): Every product format as a card, with search, copy format and the first-use tour. `gallery/ConfigGalleryView.vue`

Source: plugin/skills/product-ui/references/components.md:106.

## AIS-918bf39fa774

<!-- AIS-918bf39fa774 -->
**Format card** (`config-card`): One format in the gallery: its image, name and actions. `gallery/ConfigCard.vue`

Source: plugin/skills/product-ui/references/components.md:107.

## AIS-65ff269f09c9

<!-- AIS-65ff269f09c9 -->
**Image picker** (`gallery-selector`): Choosing the reference image from the captured ones, as image items. `gallery/GallerySelector.vue`

Source: plugin/skills/product-ui/references/components.md:108.

## AIS-8842c7378e8a

<!-- AIS-8842c7378e8a -->
**Version history** (`recipe-history`): A sheet with the saved versions of a format. `gallery/RecipeHistoryDrawer.vue`

Source: plugin/skills/product-ui/references/components.md:109.

## AIS-111e401fddb5

<!-- AIS-111e401fddb5 -->
**Tour step** (`tour`): A popover that points at one control during the first-use tour. `gallery/TourPopover.vue`

Source: plugin/skills/product-ui/references/components.md:110.

## AIS-b9f00bd04205

<!-- AIS-b9f00bd04205 -->
**Format editor** (`configurator`): The whole editor: top bar, canvas and side panel for one format. `editor/ConfiguratorApp.vue`

Source: plugin/skills/product-ui/references/components.md:111.

## AIS-9e01e3c53647

<!-- AIS-9e01e3c53647 -->
**Editor top bar** (`editor-topbar`): The format name, the profile and the save actions. `editor/EditorTopbar.vue`

Source: plugin/skills/product-ui/references/components.md:112.
