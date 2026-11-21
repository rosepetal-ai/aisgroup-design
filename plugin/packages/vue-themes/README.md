# Vue theme adapters

`node packages/vue-themes/generate.mjs` generates both adapters and resolved light/dark tokens from `packages/design/styles.css`. `--check` fails on drift. `@aisgroup/design` remains the component source of truth; these are token adapters, not equivalent implementations of its blocks.

For PrimeVue, install `primevue@^4`, `@primeuix/themes@^2`, Vue and Tailwind v4. Both are MIT; PrimeVue 5 and `@primeuix/themes` 3 are under PrimeUI's commercial licence, so do not upgrade to them. Import `primevue.mjs` as `preset` and use `app.use(PrimeVue, { theme: { preset, options: { darkModeSelector: '.dark', cssLayer: { name: 'primevue', order: 'theme, base, primevue, utilities' } } } })`. Import Tailwind and `base.css`; put `.dark` on `html` when switching modes. `base.css` sets `color-scheme: dark` on `.dark`, which the button colours (`light-dark()`) need; an app with another dark class uses it as `darkModeSelector` and sets `color-scheme: dark` on it. Layout utilities stay in Tailwind. Do not import the shadcn component CSS into a PrimeVue app.

For Vuetify, install `vuetify` and Vue. Import `vuetify/styles`, `base.css`, and `theme` from `vuetify.mjs`; use `createVuetify({ theme, defaults: { VCard: { elevation: 0 } } })`. Switch `theme.global.name.value` between `aisLight` and `aisDark`. Vuetify geometry, control typography, density, icons and interaction behaviour still need an application adapter and visual review; a colour preset alone does not make a screen compliant. Use the exported radius CSS variables when implementing that adapter, not guessed values.

`node packages/vue-themes/check-build.mjs` installs real libraries (PrimeVue 4 with `@primeuix/themes` 2) into a disposable temporary project, builds a Vue application with both libraries and Tailwind, checks both modes against the product tokens, and removes the project. No workspace dependencies change.

## Component mapping

The reference is `packages/design/catalog.ts`, its source and examples, and the guide’s `using-components` page. These mappings select a counterpart; they do not authorize new variants. PrimeVue primary, secondary and danger button colours are mapped explicitly. Its stock info, success, warn and help severities are not additional AIS action variants; use the existing status icon-and-word rule and the exported AIS status tokens.

| AIS component / job | PrimeVue | Vuetify |
| --- | --- | --- |
| Button, toolbar actions | Button, Toolbar | VBtn, VToolbar |
| Input, Textarea, Field, Label | InputText, Textarea, label + Message | VTextField, VTextarea |
| Select, Combobox | Select, AutoComplete | VSelect, VAutocomplete |
| Checkbox, RadioGroup, Switch | Checkbox, RadioButton, ToggleSwitch | VCheckbox, VRadioGroup, VSwitch |
| Dialog, AlertDialog | Dialog, ConfirmDialog | VDialog |
| DropdownMenu, Popover, Tooltip | Menu, Popover, Tooltip directive | VMenu, VTooltip |
| Table, Pagination | DataTable, Paginator | VDataTable, VPagination |
| Tabs, ToggleGroup | Tabs, SelectButton | VTabs, VBtnToggle |
| Card, Item, Avatar | Card, list markup, Avatar | VCard, VListItem, VAvatar |
| Skeleton, Spinner, Progress | Skeleton, ProgressSpinner, ProgressBar | VSkeletonLoader, VProgressCircular, VProgressLinear |
| Alert, Toast, Empty | Message, Toast, empty-state markup | VAlert, VSnackbar, VEmptyState |
| Breadcrumb, Sidebar, Sheet | Breadcrumb, Drawer | VBreadcrumbs, VNavigationDrawer |
| Collapsible, Separator, Slider | Panel, Divider, Slider | VExpansionPanels, VDivider, VSlider |
| ScrollArea, Kbd, NavigationMenu, Carousel | semantic markup / Menubar / Carousel | markup / VMenu / VCarousel |
| TopBar and other brand blocks | Compose from reference source; no drop-in equivalent | Compose from reference source; no drop-in equivalent |

## Rules that survive the mapping

Use the existing page composition and loading, empty and failure states, including Retry. Icon actions have a name and tooltip. Status uses an icon and a word, never colour alone. Dialog footers put Cancel first. Tables align numeric values right with tabular figures. Product screens stay full width, with the product type scale and target sizes in the guide. Use Lucide icons; a library’s default icon set is not the AIS icon system.

Tokens `chart-1` through `chart-3` and dataset splits are exported in `tokens.json` in both modes and in Vuetify’s custom colours. Do not substitute a library’s stock chart palette. Neither adapter installs new software screens.

API references: [PrimeVue theming](https://primevue.org/theming/styled/), [Tailwind integration](https://primevue.org/tailwind/), [Vuetify themes](https://vuetifyjs.com/en/features/theme/).
