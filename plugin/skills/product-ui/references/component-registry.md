# Rosepetal design system: component index

Every component and brand block of `@aisgroup/design` 0.0.0 (`rosepetal-ai/aisgroup-design@dev:packages/design`), the Node-RED widgets and the Profiler's parts. Each entry gives what it is for and its source as `owner/repo@branch:path`. Apps install the package (`npm i @aisgroup/design`, from the company's Artifact Registry) and import `@aisgroup/design/styles.css` after Tailwind. The code of every component and block is also a shadcn-vue registry item: install it with `npx shadcn-vue@latest add https://design.aisgroup.ai/r/<id>.json` (the tokens are `r/theme.json`), read it with the MCP tool design_code, or open `brand/registry/<id>.json` in the AIS Group Design plugin. Live examples: /en/components/<id>/. When this index and the code disagree, the code is right about how a part works and the guide is right about how to use it. Brand rules: /en/brand.md.

## Components

Stock shadcn-vue in the Rosepetal look. Import: `import { Button } from '@aisgroup/design/ui/button'`.

- **Alert** (`alert`): A status message inside a section: icon and text take the tone, the surface stays the card. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/alert/`
- **Alert dialog** (`alert-dialog`): A question that interrupts: it has to be answered to go on. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/alert-dialog/`
- **Avatar** (`avatar`): The person signed in, as a picture or initials. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/avatar/`
- **Badge** (`badge`): Counts and short neutral labels. Status is an icon and a word, not a badge. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/badge/`
- **Breadcrumb** (`breadcrumb`): Where a page sits. Every crumb navigates to its own page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/breadcrumb/`
- **Button** (`button`): Primary, secondary, outline, ghost, destructive and link, in every size. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/button/`
- **Calendar** (`calendar`): One date from a month view, in the locale's language and first weekday. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/calendar/`
- **Card** (`card`): Only for clickable entities, summaries and floating panels. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/card/`
- **Carousel** (`carousel`): A row of items that moves one at a time. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/carousel/`
- **Chart** (`chart`): Area, bar, line and donut charts on Unovis, in the data colours, with tooltips and a legend. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/chart/`
- **Checkbox** (`checkbox`): One option on or off, or several options from a list. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/checkbox/`
- **Collapsible** (`collapsible`): A section that opens and closes. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/collapsible/`
- **Combobox** (`combobox`): Choosing from a long list, with search. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/combobox/`
- **Command** (`command`): A searchable list of options or actions, inline or as a palette. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/command/`
- **Context menu** (`context-menu`): An object's actions on right-click, as well as on a visible button. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/context-menu/`
- **Data table** (`data-table`): A table from columns and data: sorting, search, filters, pages, column visibility and selection. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/data-table/`
- **Date picker** (`date-picker`): A date or a range in a button with the formatted date, and a calendar in a popover. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/date-picker/`
- **Dialog** (`dialog`): Header band, body and full-width footer buttons: Cancel first, the action second. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/dialog/`
- **Dropdown menu** (`dropdown-menu`): Row actions behind the more button, with named items. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/dropdown-menu/`
- **Empty** (`empty`): An empty container, with a clear action. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/empty/`
- **Field** (`field`): Label above the control, description and error under it. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/field/`
- **File upload** (`file-upload`): A dashed drop zone with a button, and the list of files with progress and remove. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/file-upload/`
- **Input** (`input`): Text, numbers and search, with units as input group addons. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/input/`
- **Input group** (`input-group`): A field with icons, text or buttons inside. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/input-group/`
- **Item** (`item`): Clickable entities: datasets, models, images. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/item/`
- **Kbd** (`kbd`): Keyboard shortcuts. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/kbd/`
- **Label** (`label`): The name of a field. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/label/`
- **Multi select** (`multi-select`): Several options from a list, shown as tags in the field. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/multi-select/`
- **Navigation menu** (`navigation-menu`): A menu of links, with dropdown groups. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/navigation-menu/`
- **Number field** (`number-field`): A number with minus and plus buttons, formatted for the locale. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/number-field/`
- **Pagination** (`pagination`): Numbered pages under a table. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/pagination/`
- **Pin input** (`pin-input`): A short code, one character per box. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/pin-input/`
- **Popover** (`popover`): A panel anchored to its control. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/popover/`
- **Progress** (`progress`): How far a task has gone. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/progress/`
- **Radio group** (`radio-group`): A choice between a few modes, as choice cards. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/radio-group/`
- **Range calendar** (`range-calendar`): A start and an end date across one or more months. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/range-calendar/`
- **Scroll area** (`scroll-area`): A region with its own scroll. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/scroll-area/`
- **Select** (`select`): Choosing from a short list. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/select/`
- **Separator** (`separator`): Between rows and in toolbars only. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/separator/`
- **Sheet** (`sheet`): A side panel over the page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sheet/`
- **Sidebar** (`sidebar`): The side navigation of a page. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sidebar/`
- **Skeleton** (`skeleton`): Content loading, in the shape of the content. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/skeleton/`
- **Slider** (`slider`): A value in a range. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/slider/`
- **Toast** (`sonner`): Short feedback after an action. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/sonner/`
- **Spinner** (`spinner`): Something working: in its button, or filling an empty area. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/spinner/`
- **Status label** (`status-label`): A status as a toned icon and the word, in muted text. Never colour alone, never a badge. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/status-label/`
- **Stepper** (`stepper`): The steps of a task in order, with the current one marked. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/stepper/`
- **Switch** (`switch`): A setting on or off, in a switch row. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/switch/`
- **Table** (`table`): Rows of facts with sortable headers. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/table/`
- **Tabs** (`tabs`): Views of the same thing. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tabs/`
- **Tags input** (`tags-input`): Free values typed as tags. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tags-input/`
- **Textarea** (`textarea`): Longer text. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/textarea/`
- **Timeline** (`timeline`): Events in time order, each with its marker, title, details and time. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/timeline/`
- **Toggle** (`toggle`): One button that stays on or off. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/toggle/`
- **Toggle group** (`toggle-group`): One tool or option out of a few. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/toggle-group/`
- **Tooltip** (`tooltip`): The name of an icon-only button. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tooltip/`
- **Tree** (`tree`): Nested items as list rows that open and close, with optional checkboxes. `rosepetal-ai/aisgroup-design@dev:packages/design/ui/tree/`

## Blocks

Brand pieces built from the components, with no app logic: texts and data come from each app. Import: `import TopBar from '@aisgroup/design/blocks/TopBar.vue'`.

- **Top bar** (`top-bar`): The brand bar: colour, height and logo. Each app gives its links and actions. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/TopBar.vue`
- **Login page** (`login-page`): The sign-in page. Each app gives its logo, its texts and its sign-in. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/LoginPage.vue`
- **Confirm dialog** (`confirm-dialog`): A question before an action: it runs the action, shows its progress and errors, and offers Retry. Each app gives its texts and the action. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/ConfirmDialog.vue`
- **Confirm host** (`confirm-host`): Confirmations asked from code: useConfirm().ask() opens the confirm dialog in the one host App mounts. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/ConfirmHost.vue`
- **Figure cards** (`figure-cards`): The figures of an overview as cards: label, value and an optional detail line, up to four in a row. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/FigureCards.vue`
- **Page layout** (`page-layout`): A page under the top bar: its width, title and actions, and an optional side menu that stays while the content scrolls. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/PageLayout.vue`
- **Log terminal** (`log-terminal`): A console for logs. Each app gives its lines. `rosepetal-ai/aisgroup-design@dev:packages/design/blocks/LogTerminal.vue`

## Node-RED dashboard widgets

Stock FlowFuse widgets in the Rosepetal theme.

- **Button**: ui-button: text, icon left or right, icon only, disabled.
- **Button group**: ui-button-group: one value out of a few, with text or icons.
- **Text input**: ui-text-input in every mode: text, password, email, textarea, date, time, colour.
- **Number input**: ui-number-input with its three button layouts and an icon.
- **Dropdown**: ui-dropdown: one option, with search, several options.
- **Switch**: ui-switch in its layouts, with icons, the whole row clickable.
- **Slider**: ui-slider with ticks, a number field and icons.
- **Radio group**: ui-radio-group in one column or in a row.
- **File input**: ui-file-input for one file or several.
- **Form**: ui-form with every field type, in one or two columns.
- **Text**: ui-text: a label and a live value, in each layout.
- **Markdown**: ui-markdown: headings, lists, tables, code and quotes.
- **Table**: ui-table with search, row click and checkbox selection.
- **Chart**: ui-chart: line, area, scatter, bar, stacked, pie, doughnut and histogram, on the chart tokens.
- **Gauge**: ui-gauge: half, three quarters, tile, battery and tank.
- **Progress**: ui-progress with live values.
- **Notification**: ui-notification: press a button to show one.
- **Template**: ui-template: a widget written in Vue.

## Rosepetal widgets

Source: `rosepetal-ai/rosepetal-node-red-dashboard-contrib`.

- **Session status** (`rp-session-status`): The batch state as a large status block, such as Batch running.
- **Session info** (`rp-session-info`): Last result, totals and NOKs of the running batch.
- **Confirm button** (`rp-btn-confirm`): A button that asks before an action with effects, such as ending a batch.
- **Button switch** (`rp-btn-switch`): Two states as a joined pair, such as bypass active or inactive.
- **Last error** (`rp-last-error`): The last NOK image with its boxes and its class.
- **Image queue** (`rp-image-queue`): The latest inspected images as thumbnails with OK or NOK.
- **Live view canvas** (`rp-canvas-fabric`): The live camera image with its result, boxes and view controls.
- **Bar chart** (`rp-chart-bar`): Classes and OK and NOK counts, on the chart tokens.
- **Line chart** (`rp-chart-line`): A value over time with its average, minimum and maximum, such as inference time.
- **Image grid** (`rp-image-grid`): Captured images in a grid that grows with the screen.
- **Image log** (`rp-image-log`): The inspected images with their result and time, newest first.
- **Dataset save menu** (`rp-dataset-save-menu`): Where each kind of image is saved: its suffix and its dataset.
- **Sessions header** (`rp-sessions-header`): The Sessions page header: session history and image saving.
- **Session details** (`rp-session-details`): The facts of one session: recipe, times and counts.

## Profiler

Source: `rosepetal-ai/rosepetal-node-red-profiler:src/domains/configurator/components/<file>`.

- **Format gallery** (`gallery`): Every product format as a card, with search, copy format and the first-use tour. `gallery/ConfigGalleryView.vue`
- **Format card** (`config-card`): One format in the gallery: its image, name and actions. `gallery/ConfigCard.vue`
- **Image picker** (`gallery-selector`): Choosing the reference image from the captured ones, as image items. `gallery/GallerySelector.vue`
- **Version history** (`recipe-history`): A sheet with the saved versions of a format. `gallery/RecipeHistoryDrawer.vue`
- **Tour step** (`tour`): A popover that points at one control during the first-use tour. `gallery/TourPopover.vue`
- **Format editor** (`configurator`): The whole editor: top bar, canvas and side panel for one format. `editor/ConfiguratorApp.vue`
- **Editor top bar** (`editor-topbar`): The format name, the profile and the save actions. `editor/EditorTopbar.vue`
- **Editor canvas** (`editor-canvas`): The reference image with the element boxes and the overlays. `editor/EditorCanvas.vue`
- **Editor side panel** (`editor-sidebar`): Line tabs for elements, distances and rules beside the canvas. `editor/EditorSidebar.vue`
- **Editor warnings** (`editor-dialogs`): Dialogs the editor raises, such as missing models. `editor/EditorDialogs.vue`
- **Additional rules** (`basic-rules`): Rule groups built from conditions, with delete confirmation. `editor/BasicRuleBuilder.vue`
- **Add product type** (`format-dialog`): The multi-step dialog that creates a format: onboarding, models and the form. `dialogs/FormatDialog.vue`
- **Reference image field** (`creation-image`): Drop or browse the image a new format starts from. `dialogs/CreationImageField.vue`
- **Model selection** (`model-selection`): Line tabs per model type, choosing the models a format uses. `dialogs/ModelSelectionPanel.vue`
- **Model configuration** (`models-dialog`): The models of an existing format. `dialogs/ModelsDialog.vue`
- **New element** (`label-dialog`): Creating an element: its name, type and thresholds. `dialogs/LabelDialog.vue`
- **Select element** (`label-selector`): Choosing one element from the format. `dialogs/LabelSelectorDialog.vue`
- **Evaluation rules** (`rules-dialog`): Every check of a format and its thresholds, including top-view presence. `dialogs/RulesDialog.vue`
- **Apply NOK rules** (`batch-nok`): Applying the NOK rules to several elements at once. `dialogs/BatchNokDialog.vue`
- **Delete elements** (`batch-delete`): Confirming the deletion of the selected elements, naming how many. `dialogs/BatchDeleteDialog.vue`
- **Review cleaned image** (`inpainting`): Comparing the reference image before and after cleaning. `dialogs/InpaintingDialog.vue`
- **Notification** (`notification`): Short feedback after an action in the Profiler. `dialogs/NotificationSnackbar.vue`
- **Bottle mode panel** (`bottle-mode`): Settings of one element on a bottle: measurement, unwrapped view and OCR regions. `modes/BottleModePanel.vue`
- **Unwrap alignment** (`unwrap-viewer`): Aligning the unwrapped image of a round product. `canvas/UnwrapViewer.vue`
- **Element canvas** (`label-canvas`): The image with the element boxes, their thresholds and their labels. `canvas/LabelCanvas.vue`
- **Distance rules** (`link-overlay`): Selecting two elements to create a distance rule, with its popover. `canvas/LinkOverlay.vue`
- **Rulers** (`ruler`): Rulers along the canvas edges, in the image units. `canvas/RulerOverlay.vue`
- **Grid** (`grid`): The alignment grid over the canvas. `canvas/GridOverlay.vue`
- **Guides** (`guides`): Alignment guides while moving an element. `canvas/GuidesOverlay.vue`
- **Origin** (`origin`): The origin point the distances are measured from. `canvas/OriginOverlay.vue`
- **Custom rules panel** (`custom-rules`): The format's custom rules in the side panel. `rules/CustomRulesPanel.vue`
- **Distance rule preview** (`link-rule-preview`): A distance rule drawn on a thumbnail of the image. `rules/LinkRulePreview.vue`
- **Rule preview image** (`rule-preview`): One rule drawn on a thumbnail of the image. `rules/RulePreviewImage.vue`

## Websites

The website components and the site assets: /en/web-components/, /en/assets/. Brand rules for the sites: /en/brand.md.
