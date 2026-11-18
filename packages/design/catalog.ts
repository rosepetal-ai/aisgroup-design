// What the package holds: its components and blocks, each with what it is for and its source file.
export interface CatalogItem {
  id: string
  name: string
  description?: string
  file?: string
  ready: boolean
}

export const componentItems: CatalogItem[] = [
  { id: "alert", name: "Alert", description: "A status message inside a section: icon and text take the tone, the surface stays the card.", file: `packages/design/ui/alert`, ready: true },
  { id: "alert-dialog", name: "Alert dialog", description: "A question that interrupts: it has to be answered to go on.", file: `packages/design/ui/alert-dialog`, ready: true },
  { id: "avatar", name: "Avatar", description: "The person signed in, as a picture or initials.", file: `packages/design/ui/avatar`, ready: true },
  { id: "badge", name: "Badge", description: "Counts and short neutral labels. Status is an icon and a word, not a badge.", file: `packages/design/ui/badge`, ready: true },
  { id: "breadcrumb", name: "Breadcrumb", description: "Where a page sits. Every crumb navigates to its own page.", file: `packages/design/ui/breadcrumb`, ready: true },
  { id: "button", name: "Button", description: "Primary, secondary, outline, ghost, destructive and link, in every size.", file: `packages/design/ui/button`, ready: true },
  { id: "card", name: "Card", description: "Only for clickable entities, summaries and floating panels.", file: `packages/design/ui/card`, ready: true },
  { id: "carousel", name: "Carousel", description: "A row of items that moves one at a time.", file: `packages/design/ui/carousel`, ready: true },
  { id: "checkbox", name: "Checkbox", description: "One option on or off, or several options from a list.", file: `packages/design/ui/checkbox`, ready: true },
  { id: "collapsible", name: "Collapsible", description: "A section that opens and closes.", file: `packages/design/ui/collapsible`, ready: true },
  { id: "combobox", name: "Combobox", description: "Choosing from a long list, with search.", file: `packages/design/ui/combobox`, ready: true },
  { id: "dialog", name: "Dialog", description: "Header band, body and full-width footer buttons: Cancel first, the action second.", file: `packages/design/ui/dialog`, ready: true },
  { id: "dropdown-menu", name: "Dropdown menu", description: "Row actions behind the more button, with named items.", file: `packages/design/ui/dropdown-menu`, ready: true },
  { id: "empty", name: "Empty", description: "An empty container, with a clear action.", file: `packages/design/ui/empty`, ready: true },
  { id: "field", name: "Field", description: "Label above the control, description and error under it.", file: `packages/design/ui/field`, ready: true },
  { id: "input", name: "Input", description: "Text, numbers and search, with units as input group addons.", file: `packages/design/ui/input`, ready: true },
  { id: "input-group", name: "Input group", description: "A field with icons, text or buttons inside.", file: `packages/design/ui/input-group`, ready: true },
  { id: "item", name: "Item", description: "Clickable entities: datasets, models, images.", file: `packages/design/ui/item`, ready: true },
  { id: "kbd", name: "Kbd", description: "Keyboard shortcuts.", file: `packages/design/ui/kbd`, ready: true },
  { id: "label", name: "Label", description: "The name of a field.", file: `packages/design/ui/label`, ready: true },
  { id: "navigation-menu", name: "Navigation menu", description: "A menu of links, with dropdown groups.", file: `packages/design/ui/navigation-menu`, ready: true },
  { id: "pagination", name: "Pagination", description: "Numbered pages under a table.", file: `packages/design/ui/pagination`, ready: true },
  { id: "popover", name: "Popover", description: "A panel anchored to its control.", file: `packages/design/ui/popover`, ready: true },
  { id: "progress", name: "Progress", description: "How far a task has gone.", file: `packages/design/ui/progress`, ready: true },
  { id: "radio-group", name: "Radio group", description: "A choice between a few modes, as choice cards.", file: `packages/design/ui/radio-group`, ready: true },
  { id: "scroll-area", name: "Scroll area", description: "A region with its own scroll.", file: `packages/design/ui/scroll-area`, ready: true },
  { id: "select", name: "Select", description: "Choosing from a short list.", file: `packages/design/ui/select`, ready: true },
  { id: "separator", name: "Separator", description: "Between rows and in toolbars only.", file: `packages/design/ui/separator`, ready: true },
  { id: "sheet", name: "Sheet", description: "A side panel over the page.", file: `packages/design/ui/sheet`, ready: true },
  { id: "sidebar", name: "Sidebar", description: "The side navigation of a page.", file: `packages/design/ui/sidebar`, ready: true },
  { id: "skeleton", name: "Skeleton", description: "Content loading, in the shape of the content.", file: `packages/design/ui/skeleton`, ready: true },
  { id: "slider", name: "Slider", description: "A value in a range.", file: `packages/design/ui/slider`, ready: true },
  { id: "sonner", name: "Toast", description: "Short feedback after an action.", file: `packages/design/ui/sonner`, ready: true },
  { id: "spinner", name: "Spinner", description: "Something working: in its button, or filling an empty area.", file: `packages/design/ui/spinner`, ready: true },
  { id: "switch", name: "Switch", description: "A setting on or off, in a switch row.", file: `packages/design/ui/switch`, ready: true },
  { id: "table", name: "Table", description: "Rows of facts with sortable headers.", file: `packages/design/ui/table`, ready: true },
  { id: "tabs", name: "Tabs", description: "Views of the same thing.", file: `packages/design/ui/tabs`, ready: true },
  { id: "textarea", name: "Textarea", description: "Longer text.", file: `packages/design/ui/textarea`, ready: true },
  { id: "toggle", name: "Toggle", description: "One button that stays on or off.", file: `packages/design/ui/toggle`, ready: true },
  { id: "toggle-group", name: "Toggle group", description: "One tool or option out of a few.", file: `packages/design/ui/toggle-group`, ready: true },
  { id: "tooltip", name: "Tooltip", description: "The name of an icon-only button.", file: `packages/design/ui/tooltip`, ready: true },
]

/** Brand pieces built from the components, with no app logic: texts and data come from outside. */
export const blockItems: CatalogItem[] = [
  { id: 'top-bar', name: 'Top bar', description: 'The brand bar: colour, height and logo. Each app gives its links and actions.', file: 'packages/design/blocks/TopBar.vue', ready: true },
  { id: 'login-page', name: 'Login page', description: 'The sign-in page. Each app gives its texts and checks the password.', file: 'packages/design/blocks/LoginPage.vue', ready: true },
  { id: 'confirm-dialog', name: 'Confirm dialog', description: 'A question before an action: it runs the action, shows its progress and errors, and offers Retry. Each app gives its texts and the action.', file: 'packages/design/blocks/ConfirmDialog.vue', ready: true },
  { id: 'page-layout', name: 'Page layout', description: 'A page under the top bar: its width, title and actions, and an optional side menu that stays while the content scrolls.', file: 'packages/design/blocks/PageLayout.vue', ready: true },
  { id: 'log-terminal', name: 'Log terminal', description: 'A console for logs. Each app gives its lines.', file: 'packages/design/blocks/LogTerminal.vue', ready: true },
]
