// The component playground: for each component, its controls (every prop and variant it supports, the
// variants read from its source by variants.js) and the template they produce. The template is both what
// is rendered and the code shown, so they always match.
import * as icons from '@lucide/vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from '@/components/ui/combobox';
import { variantsOf } from './variants';

/** Every component a template may use, by its tag name. */
export const COMPONENTS = {
    ...Object.fromEntries(Object.entries(Object.assign({}, ...Object.values(import.meta.glob('../../../packages/design/ui/*/index.ts', { eager: true })))).filter(([, v]) => v && typeof v === 'object' && (v.render || v.setup || v.__name))),
    Collapsible, CollapsibleContent, CollapsibleTrigger,
    Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
    InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText,
    Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle,
    Kbd, KbdGroup, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious,
    Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger,
    ToggleGroup, ToggleGroupItem,
    Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
    Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxViewport,
    ...Object.fromEntries(Object.entries(icons).filter(([k]) => k.endsWith('Icon'))),
};

// Options the app keeps for one place only: listed apart, with the place, so nobody uses them by accident.
const APP_ONLY = {
    button: { topbar: 'on the top bar', 'topbar-tab': 'on the top bar', 'topbar-soft': 'on the top bar', 'topbar-outline': 'on the top bar', 'topbar-dashed': 'on the top bar', bar: 'on the top bar', pill: 'on the top bar', warning: 'solid amber', danger: 'solid red', 'outline-destructive': 'quiet delete', 'ghost-destructive': 'quiet delete', terminal: 'in a log terminal', inverse: 'on a dark bar', 'inverse-solid': 'on a dark bar', 'inverse-outline': 'on a dark bar', modal: 'dialog footers', 'icon-round': 'round icons', card: 'a whole card', inline: 'in a sentence' },
    badge: { warning: 'solid amber', danger: 'solid red', success: 'solid green', positive: 'soft green', info: 'soft blue', amber: 'soft amber', muted: 'quiet label', card: 'counter', overlay: 'over an image' },
    tabs: { nav: 'navigation' },
};
const fromCva = (folder, name, axis, appOnly = APP_ONLY[folder] ?? {}) =>
    (variantsOf(folder)[name]?.[axis] ?? []).map(value => ({ value, note: appOnly[value] }));

// Attribute helpers for the generated template: a default value is left out, as one writes it.
const attr = (name, value, fallback) => (value === fallback || value === '' || value === undefined ? '' : ` ${name}="${value}"`);
const flag = (name, on) => (on ? ` ${name}` : '');
const esc = s => String(s).replace(/[<>&"{}]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', '{': '&#123;', '}': '&#125;' })[c]);
const pick = (n, list) => list.slice(0, Number(n));

// usage: 'Tag.prop' in usage.json, so the options say which ones our apps use, and how often.
const select = (name, label, options, value, usage) => ({ name, label, type: 'select', options: options.map(o => (typeof o === 'string' ? { value: o } : o)), value, usage });
const toggle = (name, label, value = false) => ({ name, label, type: 'boolean', value });
const text = (name, label, value) => ({ name, label, type: 'text', value });
const number = (name, label, value, min, max, step = 1) => ({ name, label, type: 'number', value, min, max, step });

const ICONS = ['none', 'start', 'end'];
const TAGS = ['Component', 'Defect', 'Connector', 'Scratch', 'Label alignment'];

export const CONTROLS = {
    'alert-dialog': {
        controls: () => [select('size', 'Size', ['default', 'sm'], 'default'), toggle('media', 'Icon'), toggle('destructive', 'Destructive action', true), text('title', 'Title', 'Delete this dataset?'), text('description', 'Description', 'Its images and annotations are removed. This cannot be undone.'), text('action', 'Action', 'Delete')],
        template: p => `<AlertDialog>
  <AlertDialogTrigger as-child><Button variant="outline">Open</Button></AlertDialogTrigger>
  <AlertDialogContent${attr('size', p.size, 'default')}>
    <AlertDialogHeader>${p.media ? '\n      <AlertDialogMedia><Trash2Icon /></AlertDialogMedia>' : ''}
      <AlertDialogTitle>${esc(p.title)}</AlertDialogTitle>
      <AlertDialogDescription>${esc(p.description)}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction${p.destructive ? ' variant="destructive"' : ''}>${esc(p.action)}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    },
    carousel: {
        controls: () => [select('orientation', 'Orientation', ['horizontal', 'vertical'], 'horizontal'), select('align', 'Align', ['center', 'start', 'end'], 'center'), select('basis', 'Items in view', [{ value: 'basis-full' }, { value: 'basis-1/2' }, { value: 'basis-1/3' }], 'basis-full'), number('items', 'Items', 5, 1, 12), toggle('loop', 'Loop'), toggle('dragFree', 'Free drag'), toggle('arrows', 'Arrows', true)],
        template: (p) => {
            const opts = [p.align !== 'center' ? `align: '${p.align}'` : '', p.loop ? 'loop: true' : '', p.dragFree ? 'dragFree: true' : ''].filter(Boolean).join(', ');
            const vertical = p.orientation === 'vertical';
            return `<Carousel class="${vertical ? 'my-10 w-full max-w-xs' : 'mx-12 w-full max-w-xs'}"${attr('orientation', p.orientation, 'horizontal')}${opts ? ` :opts="{ ${opts} }"` : ''}>
  <CarouselContent${vertical ? ' class="h-56"' : ''}>
    <CarouselItem v-for="n in ${p.items}" :key="n"${p.basis === 'basis-full' ? '' : ` class="${p.basis}"`}>
      <Card><CardContent class="flex aspect-square items-center justify-center text-3xl font-semibold">{{ n }}</CardContent></Card>
    </CarouselItem>
  </CarouselContent>${p.arrows ? '\n  <CarouselPrevious />\n  <CarouselNext />' : ''}
</Carousel>`;
        },
    },
    collapsible: {
        controls: () => [text('label', 'Text', 'Details'), toggle('open', 'Open at the start'), toggle('disabled', 'Disabled'), toggle('chevron', 'Arrow', true)],
        template: p => `<Collapsible class="flex w-72 flex-col gap-2"${flag('default-open', p.open)}${flag('disabled', p.disabled)}>
  <CollapsibleTrigger as-child>
    <Button variant="outline" class="justify-between"${flag('disabled', p.disabled)}>${esc(p.label)}${p.chevron ? '<ChevronDownIcon data-icon="inline-end" />' : ''}</Button>
  </CollapsibleTrigger>
  <CollapsibleContent class="rounded-md border p-3 text-sm text-muted-foreground">More about this item.</CollapsibleContent>
</Collapsible>`,
    },
    'input-group': {
        controls: () => [select('align', 'Where the addon goes', ['inline-start', 'inline-end', 'block-start', 'block-end'], 'inline-start'), select('content', 'Addon', ['icon', 'text', 'button', 'icon button'], 'icon'), text('placeholder', 'Placeholder', 'Search...'), toggle('disabled', 'Disabled'), toggle('invalid', 'Invalid')],
        template: p => `<InputGroup class="w-80"${p.disabled ? ' data-disabled' : ''}>
  <InputGroupInput placeholder="${esc(p.placeholder)}"${flag('disabled', p.disabled)}${p.invalid ? ' aria-invalid="true"' : ''} />
  <InputGroupAddon${attr('align', p.align, 'inline-start')}>
    ${{ icon: '<SearchIcon />', text: '<InputGroupText>px</InputGroupText>', button: '<InputGroupButton>Apply</InputGroupButton>', 'icon button': '<InputGroupButton size="icon-sm" aria-label="Clear"><XIcon /></InputGroupButton>' }[p.content]}
  </InputGroupAddon>
</InputGroup>`,
    },
    label: {
        controls: () => [text('text', 'Text', 'Email'), toggle('field', 'With its field', true), toggle('checkbox', 'As a checkbox label'), toggle('disabled', 'Disabled')],
        template: p => (p.checkbox
            ? `<div class="flex items-center gap-2"${p.disabled ? ' data-disabled="true"' : ''}>
  <Checkbox id="pg-label"${flag('disabled', p.disabled)} />
  <Label for="pg-label">${esc(p.text)}</Label>
</div>`
            : `<div class="flex w-64 flex-col gap-2 group" data-disabled="${p.disabled}">
  <Label for="pg-label">${esc(p.text)}</Label>${p.field ? `\n  <Input id="pg-label"${flag('disabled', p.disabled)} />` : ''}
</div>`),
    },
    'navigation-menu': {
        controls: () => [number('groups', 'Dropdowns', 2, 1, 3), toggle('viewport', 'Shared panel'), toggle('link', 'Plain link', true), toggle('active', 'Mark the current page', true), select('side', 'Trigger', fromCva('navigation-menu', 'navigationMenuTriggerStyle', 'variant', { topbar: 'on the top bar' }), 'default')],
        template: p => `<div${p.side === 'topbar' ? ' class="rounded-md bg-topbar p-2"' : ''}>
<NavigationMenu${p.viewport ? '' : ' :viewport="false"'}>
  <NavigationMenuList>${pick(p.groups, ['Information', 'Tools', 'Services']).map(g => `
    <NavigationMenuItem>
      <NavigationMenuTrigger${attr('variant', p.side, 'default')}>${g}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul class="flex w-48 flex-col">
          <li><NavigationMenuLink as="button" class="w-full text-left"${flag('active', p.active)}>Dashboard</NavigationMenuLink></li>
          <li><NavigationMenuLink as="button" class="w-full text-left">Metrics</NavigationMenuLink></li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>`).join('')}${p.link ? `
    <NavigationMenuItem><NavigationMenuLink as="button"${p.side === 'topbar' ? ' class="text-topbar-foreground"' : ''}>Settings</NavigationMenuLink></NavigationMenuItem>` : ''}
  </NavigationMenuList>
</NavigationMenu>
</div>`,
    },
    'scroll-area': {
        controls: () => [select('orientation', 'Direction', ['vertical', 'horizontal'], 'vertical'), number('items', 'Items', 30, 1, 100), select('size', 'Size', ['h-32', 'h-48', 'h-72'], 'h-48'), select('type', 'Scrollbar shows', ['hover', 'scroll', 'auto', 'always'], 'hover')],
        template: p => (p.orientation === 'vertical'
            ? `<ScrollArea class="${p.size} w-56 rounded-md border p-3"${attr('type', p.type, 'hover')}>
  <p v-for="n in ${p.items}" :key="n" class="py-1 text-sm">Image {{ n }}</p>
</ScrollArea>`
            : `<ScrollArea class="w-80 rounded-md border p-3"${attr('type', p.type, 'hover')}>
  <div class="flex w-max gap-2">
    <div v-for="n in ${p.items}" :key="n" class="flex size-20 shrink-0 items-center justify-center rounded-md bg-muted text-sm">{{ n }}</div>
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>`),
    },
    sidebar: {
        controls: () => [select('variant', 'Item style', fromCva('sidebar', 'sidebarMenuButtonVariants', 'variant'), 'default'), select('size', 'Item size', fromCva('sidebar', 'sidebarMenuButtonVariants', 'size'), 'default'), number('items', 'Items', 3, 1, 4), toggle('label', 'Group title', true), toggle('icons', 'Icons', true), toggle('active', 'Mark the first', true), toggle('badge', 'Counter')],
        template: p => `<SidebarProvider class="min-h-64 w-full overflow-hidden rounded-md border">
  <Sidebar collapsible="none">
    <SidebarContent>
      <SidebarGroup>${p.label ? '\n        <SidebarGroupLabel>Platform</SidebarGroupLabel>' : ''}
        <SidebarGroupContent>
          <SidebarMenu>${pick(p.items, [['Dashboard', 'Home'], ['Datasets', 'Box'], ['Models', 'Cpu'], ['Settings', 'Settings']]).map(([name, icon], i) => `
            <SidebarMenuItem>
              <SidebarMenuButton${attr('variant', p.variant, 'default')}${attr('size', p.size, 'default')}${p.active && !i ? ' is-active' : ''}>${p.icons ? `<${icon}Icon />` : ''}${name}</SidebarMenuButton>${p.badge ? `\n              <SidebarMenuBadge>${i + 3}</SidebarMenuBadge>` : ''}
            </SidebarMenuItem>`).join('')}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset class="p-4 text-sm text-muted-foreground">Page content</SidebarInset>
</SidebarProvider>`,
    },
    toggle: {
        controls: () => [select('variant', 'Variant', fromCva('toggle', 'toggleVariants', 'variant'), 'default'), select('size', 'Size', fromCva('toggle', 'toggleVariants', 'size'), 'default'), text('label', 'Text', 'Annotations'), toggle('icon', 'Icon', true), toggle('pressed', 'On at the start'), toggle('disabled', 'Disabled')],
        template: p => `<Toggle${attr('variant', p.variant, 'default')}${attr('size', p.size, 'default')}${p.pressed ? ' :default-value="true"' : ''}${flag('disabled', p.disabled)}${p.label ? '' : ' aria-label="Annotations"'}>${p.icon ? '<EyeIcon />' : ''}${esc(p.label)}</Toggle>`,
    },
    alert: {
        controls: () => [select('variant', 'Variant', fromCva('alert', 'alertVariants', 'variant'), 'default', 'Alert.variant'), toggle('icon', 'Icon', true), text('title', 'Title', 'Validate before training'), text('description', 'Description', '12 images have no tag yet.'), toggle('action', 'Action')],
        template: p => `<Alert${attr('variant', p.variant, 'default')} class="max-w-xl">
  ${p.icon ? `<${{ default: 'Info', destructive: 'CircleX', success: 'CircleCheck', info: 'Info', warning: 'TriangleAlert' }[p.variant] ?? 'Info'}Icon />\n  ` : ''}<AlertTitle>${esc(p.title)}</AlertTitle>
  ${p.description ? `<AlertDescription>${esc(p.description)}</AlertDescription>` : ''}${p.action ? `
  <AlertAction><Button variant="outline" size="sm">Retry</Button></AlertAction>` : ''}
</Alert>`,
    },
    avatar: {
        controls: () => [select('size', 'Size', fromCva('avatar', 'avatarVariants', 'size'), 'default', 'Avatar.size'), text('initials', 'Initials', 'AM'), toggle('group', 'Group of people')],
        template: p => (p.group
            ? `<AvatarGroup>\n${['AM', 'JL', 'RS'].map(i => `  <Avatar${attr('size', p.size, 'default')}><AvatarFallback>${i}</AvatarFallback></Avatar>`).join('\n')}\n  <AvatarGroupCount>+4</AvatarGroupCount>\n</AvatarGroup>`
            : `<Avatar${attr('size', p.size, 'default')}>\n  <AvatarFallback>${esc(p.initials)}</AvatarFallback>\n</Avatar>`),
    },
    badge: {
        controls: () => [select('variant', 'Variant', fromCva('badge', 'badgeVariants', 'variant'), 'default', 'Badge.variant'), text('label', 'Text', '12'), select('icon', 'Icon', ICONS, 'none')],
        template: p => `<Badge${attr('variant', p.variant, 'default')}>${p.icon === 'start' ? '<CheckIcon data-icon="inline-start" />' : ''}${esc(p.label)}${p.icon === 'end' ? '<ChevronDownIcon data-icon="inline-end" />' : ''}</Badge>`,
    },
    breadcrumb: {
        controls: () => [number('depth', 'Levels', 3, 1, 5), toggle('ellipsis', 'Collapse the middle')],
        template: (p) => {
            const names = ['Datasets', 'PCB inspection', 'Images', 'Labeling', 'pcb_0007.jpg'].slice(-p.depth);
            const crumbs = names.map((n, i) => (i === names.length - 1 ? `    <BreadcrumbItem><BreadcrumbPage>${n}</BreadcrumbPage></BreadcrumbItem>` : `    <BreadcrumbItem><BreadcrumbLink href="#">${n}</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />`));
            if (p.ellipsis && crumbs.length > 2) crumbs.splice(1, crumbs.length - 2, '    <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>\n    <BreadcrumbSeparator />');
            return `<Breadcrumb>\n  <BreadcrumbList>\n${crumbs.join('\n')}\n  </BreadcrumbList>\n</Breadcrumb>`;
        },
    },
    button: {
        controls: () => [select('variant', 'Variant', fromCva('button', 'buttonVariants', 'variant'), 'default', 'Button.variant'), select('size', 'Size', fromCva('button', 'buttonVariants', 'size'), 'default', 'Button.size'), text('label', 'Text', 'Save'), select('icon', 'Icon', ICONS, 'none'), toggle('working', 'Working'), toggle('disabled', 'Disabled')],
        template: (p) => {
            const iconOnly = p.size.startsWith('icon');
            const inner = iconOnly ? '<PlusIcon />' : `${p.working ? '<Spinner data-icon="inline-start" />' : p.icon === 'start' ? '<PlusIcon data-icon="inline-start" />' : ''}${esc(p.label)}${p.icon === 'end' ? '<ChevronDownIcon data-icon="inline-end" />' : ''}`;
            return `<Button${attr('variant', p.variant, 'default')}${attr('size', p.size, 'default')}${iconOnly ? ` aria-label="${esc(p.label)}"` : ''}${flag('disabled', p.disabled || p.working)}>${inner}</Button>`;
        },
    },
    card: {
        controls: () => [text('title', 'Title', 'Training readiness'), toggle('description', 'Description', true), toggle('action', 'Header action'), toggle('footer', 'Footer', true), select('width', 'Width', ['max-w-sm', 'max-w-md', 'max-w-lg'], 'max-w-sm')],
        template: p => `<Card class="w-full ${p.width}">
  <CardHeader>
    <CardTitle>${esc(p.title)}</CardTitle>${p.description ? '\n    <CardDescription>PCB inspection</CardDescription>' : ''}${p.action ? '\n    <CardAction><Button variant="ghost" size="icon-sm" aria-label="More actions"><EllipsisIcon /></Button></CardAction>' : ''}
  </CardHeader>
  <CardContent>
    <dl class="grid grid-cols-2 gap-4">
      <div><dt class="text-muted-foreground">Labeled</dt><dd>1,236 of 1,248</dd></div>
      <div><dt class="text-muted-foreground">Tags</dt><dd>3</dd></div>
    </dl>
  </CardContent>${p.footer ? '\n  <CardFooter><Button class="w-full">New model</Button></CardFooter>' : ''}
</Card>`,
    },
    checkbox: {
        controls: () => [select('checked', 'State', ['true', 'false', 'indeterminate'], 'true'), text('label', 'Label', 'Include unlabeled images'), toggle('description', 'Description'), toggle('disabled', 'Disabled'), toggle('invalid', 'Invalid')],
        template: p => `<Field orientation="horizontal"${flag('data-disabled', p.disabled)}${flag('data-invalid', p.invalid)}>
  <Checkbox id="pg-check" :model-value="${p.checked === 'indeterminate' ? "'indeterminate'" : p.checked}"${flag('disabled', p.disabled)}${p.invalid ? ' aria-invalid="true"' : ''} />
  <FieldContent>
    <FieldLabel for="pg-check">${esc(p.label)}</FieldLabel>${p.description ? '\n    <FieldDescription>Images without a tag go to the test split.</FieldDescription>' : ''}
  </FieldContent>
</Field>`,
    },
    combobox: {
        controls: () => [text('placeholder', 'Placeholder', 'Search datasets'), toggle('create', '"Create new" row', true), number('count', 'Options', 6, 1, 12), toggle('disabled', 'Disabled')],
        template: p => `<Combobox open-on-click class="w-72"${flag('disabled', p.disabled)}>
  <ComboboxAnchor class="relative">
    <ComboboxInput placeholder="${esc(p.placeholder)}" class="pr-8" />
    <ComboboxTrigger class="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground" aria-label="Show options"><ChevronsUpDownIcon /></ComboboxTrigger>
  </ComboboxAnchor>
  <ComboboxList>
    <ComboboxViewport>${p.create ? '\n      <ComboboxGroup><ComboboxItem value="__new__"><PlusIcon />Create new dataset</ComboboxItem></ComboboxGroup>\n      <ComboboxSeparator />' : ''}
      <ComboboxEmpty>Nothing matches.</ComboboxEmpty>
      <ComboboxGroup>
${pick(p.count, ['PCB inspection', 'Tortilla line', 'Blister packaging', 'Label packaging', 'Expiry dates', 'Cable harness', 'Connector pins', 'Solder joints', 'Bake level', 'Cable colours', 'Neck bands', 'Caps']).map(d => `        <ComboboxItem value="${d}">${d}<ComboboxItemIndicator /></ComboboxItem>`).join('\n')}
      </ComboboxGroup>
    </ComboboxViewport>
  </ComboboxList>
</Combobox>`,
    },
    dialog: {
        controls: () => [select('kind', 'Kind', ['form', 'confirm', 'destructive', 'info'], 'form'), select('width', 'Width', ['sm:max-w-md', 'sm:max-w-lg', 'sm:max-w-2xl'], 'sm:max-w-md'), text('title', 'Title', 'Edit dataset'), toggle('description', 'Visible description')],
        state: () => ({ open: Vue.ref(false) }),
        template: p => `<Button variant="${p.kind === 'destructive' ? 'destructive' : 'outline'}" @click="open = true">${esc(p.title)}</Button>
<Dialog v-model:open="open">
  <DialogContent class="${p.width}">
    <DialogHeader>
      <DialogTitle>${esc(p.title)}</DialogTitle>
      <DialogDescription${p.description ? '' : ' class="sr-only"'}>${p.kind === 'destructive' ? 'PCB inspection and its 1,248 images will be deleted.' : 'Change the name of the dataset.'}</DialogDescription>
    </DialogHeader>
    <DialogBody>${p.kind === 'form' ? `
      <FieldGroup>
        <Field><FieldLabel for="pg-name">Name</FieldLabel><Input id="pg-name" model-value="PCB inspection" /></Field>
      </FieldGroup>` : p.kind === 'info' ? '\n      <p>Training runs on the workspace and takes about 40 minutes.</p>' : '\n      <p>This cannot be undone.</p>'}
    </DialogBody>
    <DialogFooter>${p.kind === 'info' ? '\n      <Button size="modal" @click="open = false">Got it</Button>' : `
      <Button variant="secondary" size="modal" @click="open = false">Cancel</Button>
      <Button${p.kind === 'destructive' ? ' variant="destructive"' : ''} size="modal" @click="open = false">${p.kind === 'destructive' ? 'Delete' : 'Save'}</Button>`}
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
    'dropdown-menu': {
        controls: () => [select('align', 'Align', ['start', 'center', 'end'], 'end', 'DropdownMenuContent.align'), toggle('icons', 'Icons', true), toggle('label', 'Group label'), toggle('checks', 'Checkbox items'), toggle('shortcut', 'Shortcuts'), toggle('destructive', 'Destructive item', true)],
        template: p => `<DropdownMenu>
  <DropdownMenuTrigger as-child><Button variant="ghost" size="icon-sm" aria-label="Actions"><EllipsisIcon /></Button></DropdownMenuTrigger>
  <DropdownMenuContent${attr('align', p.align, 'center')}>${p.label ? '\n    <DropdownMenuLabel>PCB inspection</DropdownMenuLabel>' : ''}
    <DropdownMenuItem>${p.icons ? '<PencilIcon />' : ''}Rename${p.shortcut ? '<DropdownMenuShortcut>F2</DropdownMenuShortcut>' : ''}</DropdownMenuItem>
    <DropdownMenuItem>${p.icons ? '<CopyIcon />' : ''}Duplicate${p.shortcut ? '<DropdownMenuShortcut>Ctrl D</DropdownMenuShortcut>' : ''}</DropdownMenuItem>${p.checks ? '\n    <DropdownMenuSeparator />\n    <DropdownMenuCheckboxItem :model-value="true">Show archived</DropdownMenuCheckboxItem>' : ''}${p.destructive ? `\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">${p.icons ? '<Trash2Icon />' : ''}Delete</DropdownMenuItem>` : ''}
  </DropdownMenuContent>
</DropdownMenu>`,
    },
    empty: {
        controls: () => [select('media', 'Media', ['icon', 'icon on a tile', 'spinner', 'none'], 'icon'), select('border', 'Border', ['dashed', 'solid', 'none'], 'dashed'), text('title', 'Title', 'No images match the filters'), text('description', 'Description', 'Try another tag or clear the filters.'), toggle('action', 'Action', true)],
        template: p => `<Empty class="w-full max-w-xl${p.border === 'dashed' ? ' border border-dashed' : p.border === 'solid' ? ' border' : ''}">
  <EmptyHeader>${p.media === 'icon' ? '\n    <EmptyMedia><SearchXIcon class="size-6 text-muted-foreground" /></EmptyMedia>' : p.media === 'icon on a tile' ? '\n    <EmptyMedia variant="icon"><SearchXIcon /></EmptyMedia>' : p.media === 'spinner' ? '\n    <EmptyMedia><Spinner class="size-6 text-muted-foreground" /></EmptyMedia>' : ''}
    <EmptyTitle>${esc(p.title)}</EmptyTitle>
    <EmptyDescription>${esc(p.description)}</EmptyDescription>
  </EmptyHeader>${p.action ? '\n  <EmptyContent><Button variant="outline">Clear filters</Button></EmptyContent>' : ''}
</Empty>`,
    },
    field: {
        controls: () => [select('orientation', 'Orientation', fromCva('field', 'fieldVariants', 'orientation'), 'vertical', 'Field.orientation'), select('control', 'Control, vertical fields', ['input', 'unit', 'select', 'textarea', 'switch'], 'input'), text('label', 'Label', 'Format name'), toggle('description', 'Description', true), toggle('error', 'Error'), toggle('disabled', 'Disabled')],
        template: (p) => {
            const control = {
                input: `<Input id="pg-field" model-value="Demo bottle"${flag('disabled', p.disabled)}${p.error ? ' aria-invalid="true"' : ''} />`,
                unit: `<InputGroup><InputGroupInput id="pg-field" model-value="70"${flag('disabled', p.disabled)}${p.error ? ' aria-invalid="true"' : ''} /><InputGroupAddon align="inline-end">mm</InputGroupAddon></InputGroup>`,
                select: `<Select model-value="small"${flag('disabled', p.disabled)}><SelectTrigger id="pg-field" class="w-full"${p.error ? ' aria-invalid="true"' : ''}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem></SelectContent></Select>`,
                textarea: `<Textarea id="pg-field" placeholder="What is wrong with this image?"${flag('disabled', p.disabled)}${p.error ? ' aria-invalid="true"' : ''} />`,
                switch: `<Switch id="pg-field"${flag('disabled', p.disabled)} />`,
            }[p.control];
            const words = `<FieldLabel for="pg-field">${esc(p.label)}</FieldLabel>${p.error ? '\n    <FieldError>Enter a value above 0.</FieldError>' : p.description ? '\n    <FieldDescription>Shown in the Profiler gallery.</FieldDescription>' : ''}`;
            return p.orientation === 'vertical'
                ? `<Field class="w-full max-w-sm"${flag('data-invalid', p.error)}${flag('data-disabled', p.disabled)}>\n  ${words.replace('\n    ', '\n  ')}\n  ${control}\n</Field>`.replace(/(<FieldLabel[^\n]*<\/FieldLabel>)\n {2}(<Field(?:Error|Description)[^\n]*)\n {2}(.*)\n<\/Field>$/s, '$1\n  $3\n  $2\n</Field>')
                : `<Field${attr('orientation', p.orientation, 'vertical')} class="w-full max-w-xl rounded-lg border p-4"${flag('data-invalid', p.error)}${flag('data-disabled', p.disabled)}>\n  <FieldContent>\n    ${words}\n  </FieldContent>\n  <Switch id="pg-field"${flag('disabled', p.disabled)} />\n</Field>`;
        },
    },
    input: {
        controls: () => [select('type', 'Type', ['text', 'number', 'email', 'password'], 'text'), text('placeholder', 'Placeholder', 'Dataset name'), select('addon', 'Addon', ['none', 'search', 'unit', 'clear button'], 'none'), toggle('disabled', 'Disabled'), toggle('invalid', 'Invalid')],
        template: (p) => {
            const a = `${flag('disabled', p.disabled)}${p.invalid ? ' aria-invalid="true"' : ''}`;
            if (p.addon === 'none') return `<Input type="${p.type}" placeholder="${esc(p.placeholder)}" aria-label="${esc(p.placeholder)}" class="max-w-sm"${a} />`;
            return `<InputGroup class="max-w-sm">${p.addon === 'search' ? '\n  <InputGroupAddon><SearchIcon /></InputGroupAddon>' : ''}
  <InputGroupInput type="${p.type}" placeholder="${esc(p.placeholder)}" aria-label="${esc(p.placeholder)}"${a} />${p.addon === 'unit' ? '\n  <InputGroupAddon align="inline-end">mm</InputGroupAddon>' : ''}${p.addon === 'clear button' ? '\n  <InputGroupAddon align="inline-end"><InputGroupButton size="icon-sm" aria-label="Clear"><XIcon /></InputGroupButton></InputGroupAddon>' : ''}
</InputGroup>`;
        },
    },
    item: {
        controls: () => [select('variant', 'Variant', fromCva('item', 'itemVariants', 'variant'), 'outline', 'Item.variant'), select('size', 'Size', fromCva('item', 'itemVariants', 'size'), 'default', 'Item.size'), select('media', 'Media', fromCva('item', 'itemMediaVariants', 'variant', APP_ONLY['item-media']).map(o => o).concat([{ value: 'header image' }, { value: 'none' }]), 'icon'), toggle('description', 'Description', true), toggle('actions', 'Actions', true), toggle('footer', 'Status footer'), toggle('link', 'Clickable')],
        template: (p) => {
            const media = p.media === 'none' ? '' : p.media === 'header image' ? `\n  <ItemHeader><img src="${import.meta.env.BASE_URL}samples/electronics.webp" alt="" class="aspect-video w-full rounded-sm object-cover" /></ItemHeader>`
                : p.media === 'image' ? `\n  <ItemMedia variant="image"><img src="${import.meta.env.BASE_URL}samples/electronics.webp" alt="" /></ItemMedia>`
                    : `\n  <ItemMedia${attr('variant', p.media, 'default')}><BoxIcon /></ItemMedia>`;
            const body = `${media}
  <ItemContent>
    <ItemTitle>PCB inspection</ItemTitle>${p.description ? '\n    <ItemDescription>1,248 images, 3 tags</ItemDescription>' : ''}
  </ItemContent>${p.actions ? '\n  <ItemActions><Button variant="ghost" size="icon-sm" aria-label="More actions"><EllipsisIcon /></Button></ItemActions>' : ''}${p.footer ? '\n  <ItemFooter class="text-muted-foreground"><span class="flex items-center gap-1.5"><CircleCheckIcon class="size-4 text-success" />Labeled</span></ItemFooter>' : ''}`;
            const open = `<Item${attr('variant', p.variant, 'default')}${attr('size', p.size, 'default')} class="max-w-md"${p.link ? ' as-child' : ''}>`;
            return p.link ? `${open}\n  <a href="#">${body.replace(/\n/g, '\n  ')}\n  </a>\n</Item>` : `${open}${body}\n</Item>`;
        },
    },
    kbd: {
        controls: () => [text('keys', 'Keys (space between)', 'Ctrl S'), text('label', 'Text', 'Save')],
        template: p => `<p class="flex items-center gap-2">${esc(p.label)} <KbdGroup>${p.keys.split(/\s+/).filter(Boolean).map(k => `<Kbd>${esc(k)}</Kbd>`).join('')}</KbdGroup></p>`,
    },
    pagination: {
        controls: () => [number('total', 'Pages', 10, 1, 40), number('siblings', 'Pages beside the current', 1, 0, 3), toggle('label', '"Page x of y"', true)],
        state: () => ({ page: Vue.ref(1) }),
        template: p => `<div class="flex w-full max-w-2xl items-center justify-between gap-4">${p.label ? `\n  <span class="text-muted-foreground">Page {{ page }} of ${p.total}</span>` : ''}
  <Pagination v-slot="{ page: current }" v-model:page="page" :total="${p.total * 10}" :items-per-page="10" :sibling-count="${p.siblings}" class="mx-0 w-auto">
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />
      <template v-for="(item, i) in items" :key="i">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === current">{{ item.value }}</PaginationItem>
        <PaginationEllipsis v-else :index="i" />
      </template>
      <PaginationNext />
    </PaginationContent>
  </Pagination>
</div>`,
    },
    popover: {
        controls: () => [select('side', 'Side', ['bottom', 'top', 'left', 'right'], 'bottom', 'PopoverContent.side'), select('align', 'Align', ['center', 'start', 'end'], 'center', 'PopoverContent.align'), toggle('header', 'Title and description', true), select('width', 'Width', ['w-64', 'w-72', 'w-80'], 'w-72')],
        template: p => `<Popover>
  <PopoverTrigger as-child><Button variant="outline"><SlidersHorizontalIcon data-icon="inline-start" />View options</Button></PopoverTrigger>
  <PopoverContent class="${p.width}"${attr('side', p.side, 'bottom')}${attr('align', p.align, 'center')}>${p.header ? '\n    <PopoverHeader>\n      <PopoverTitle>View options</PopoverTitle>\n      <PopoverDescription>How the canvas shows the image.</PopoverDescription>\n    </PopoverHeader>' : ''}
    <Field class="mt-4"><FieldLabel>Brightness</FieldLabel><Slider :default-value="[50]" :max="100" /></Field>
  </PopoverContent>
</Popover>`,
    },
    progress: {
        controls: () => [number('value', 'Value', 62, 0, 100), toggle('label', 'Label and number', true)],
        template: p => `<div class="flex w-full max-w-sm flex-col gap-2">${p.label ? `\n  <div class="flex justify-between"><span>Uploading</span><span class="text-muted-foreground tabular-nums">${p.value}%</span></div>` : ''}
  <Progress :model-value="${p.value}" />
</div>`,
    },
    'radio-group': {
        controls: () => [select('style', 'Style', ['choice cards', 'plain'], 'choice cards'), number('count', 'Options', 2, 2, 4), toggle('disabled', 'Disabled')],
        state: () => ({ mode: Vue.ref('supervised') }),
        template: (p) => {
            const opts = pick(p.count, [['supervised', 'Supervised', 'Learns from the tags you labeled.'], ['unsupervised', 'Unsupervised', 'Learns what a good product looks like.'], ['semi', 'Semi-supervised', 'Uses a few tags and many images.'], ['zero', 'Zero-shot', 'Describes the defects in words.']]);
            return p.style === 'plain'
                ? `<RadioGroup v-model="mode"${flag('disabled', p.disabled)}>\n${opts.map(([v, t]) => `  <Field orientation="horizontal"><RadioGroupItem id="rg-${v}" value="${v}" /><FieldLabel for="rg-${v}">${t}</FieldLabel></Field>`).join('\n')}\n</RadioGroup>`
                : `<RadioGroup v-model="mode" class="w-full max-w-md"${flag('disabled', p.disabled)}>\n${opts.map(([v, t, d]) => `  <FieldLabel for="rg-${v}">\n    <Field orientation="horizontal">\n      <FieldContent><FieldTitle>${t}</FieldTitle><FieldDescription>${d}</FieldDescription></FieldContent>\n      <RadioGroupItem id="rg-${v}" value="${v}" />\n    </Field>\n  </FieldLabel>`).join('\n')}\n</RadioGroup>`;
        },
    },
    select: {
        controls: () => [select('size', 'Size', ['default', 'sm'], 'default', 'SelectTrigger.size'), text('placeholder', 'Placeholder', 'Choose a size'), toggle('groups', 'Groups and labels'), toggle('disabled', 'Disabled'), toggle('invalid', 'Invalid')],
        template: p => `<Select${flag('disabled', p.disabled)}>
  <SelectTrigger class="w-56"${attr('size', p.size, 'default')} aria-label="Model size"${p.invalid ? ' aria-invalid="true"' : ''}><SelectValue placeholder="${esc(p.placeholder)}" /></SelectTrigger>
  <SelectContent>${p.groups ? `
    <SelectGroup>
      <SelectLabel>Fast</SelectLabel>
      <SelectItem value="nano">Nano</SelectItem>
      <SelectItem value="small">Small</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Accurate</SelectLabel>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="large">Large</SelectItem>
    </SelectGroup>` : `
    <SelectItem value="nano">Nano</SelectItem>
    <SelectItem value="small">Small</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="large">Large</SelectItem>`}
  </SelectContent>
</Select>`,
    },
    separator: {
        controls: () => [select('orientation', 'Orientation', ['horizontal', 'vertical'], 'vertical')],
        template: p => (p.orientation === 'vertical'
            ? '<div class="flex h-6 items-center gap-4">\n  <span>Zoom</span>\n  <Separator orientation="vertical" />\n  <span>Brightness</span>\n</div>'
            : '<div class="flex w-full max-w-sm flex-col gap-4">\n  <span>Images</span>\n  <Separator />\n  <span>Models</span>\n</div>'),
    },
    sheet: {
        controls: () => [select('side', 'Side', ['right', 'left', 'top', 'bottom'], 'right', 'SheetContent.side'), text('title', 'Title', 'Filters'), toggle('footer', 'Footer', true)],
        template: p => `<Sheet>
  <SheetTrigger as-child><Button variant="outline"><FilterIcon data-icon="inline-start" />${esc(p.title)}</Button></SheetTrigger>
  <SheetContent${attr('side', p.side, 'right')}>
    <SheetHeader>
      <SheetTitle>${esc(p.title)}</SheetTitle>
      <SheetDescription class="sr-only">Show only the images you need.</SheetDescription>
    </SheetHeader>
    <div class="flex-1 overflow-y-auto px-4">
      <FieldSet class="gap-3">
        <FieldLegend variant="label">State</FieldLegend>
        <FieldGroup class="gap-3">
          <Field orientation="horizontal"><Checkbox id="pg-sheet-labeled" :model-value="true" /><FieldLabel for="pg-sheet-labeled" class="font-normal">Labeled</FieldLabel></Field>
          <Field orientation="horizontal"><Checkbox id="pg-sheet-unlabeled" /><FieldLabel for="pg-sheet-unlabeled" class="font-normal">Not labeled</FieldLabel></Field>
        </FieldGroup>
      </FieldSet>
    </div>${p.footer ? '\n    <SheetFooter class="flex-row *:flex-1">\n      <SheetClose as-child><Button variant="secondary" size="modal">Cancel</Button></SheetClose>\n      <Button size="modal">Apply</Button>\n    </SheetFooter>' : ''}
  </SheetContent>
</Sheet>`,
    },
    skeleton: {
        controls: () => [select('shape', 'Shape of the content', ['rows', 'item', 'avatar and text', 'chart'], 'item'), number('count', 'Count', 3, 1, 6)],
        template: p => ({
            rows: `<div class="flex w-full max-w-md flex-col divide-y border-y">\n${Array.from({ length: p.count }, () => '  <div class="flex items-center gap-3 py-3"><Skeleton class="size-4 rounded-sm" /><Skeleton class="h-4 flex-1" /><Skeleton class="h-4 w-12" /></div>').join('\n')}\n</div>`,
            item: `<div class="grid w-full max-w-2xl gap-4 sm:grid-cols-3">\n${Array.from({ length: p.count }, () => '  <Item variant="outline" size="sm">\n    <ItemHeader><Skeleton class="aspect-video w-full" /></ItemHeader>\n    <ItemContent class="gap-2"><Skeleton class="h-4 w-3/4" /><Skeleton class="h-4 w-1/2" /></ItemContent>\n  </Item>').join('\n')}\n</div>`,
            'avatar and text': `<div class="flex flex-col gap-4">\n${Array.from({ length: p.count }, () => '  <div class="flex items-center gap-3"><Skeleton class="size-10 rounded-full" /><div class="flex flex-col gap-2"><Skeleton class="h-4 w-40" /><Skeleton class="h-4 w-24" /></div></div>').join('\n')}\n</div>`,
            chart: '<div class="flex h-40 w-full max-w-md items-end gap-2">\n  <Skeleton class="h-1/3 flex-1" /><Skeleton class="h-2/3 flex-1" /><Skeleton class="h-1/2 flex-1" /><Skeleton class="h-full flex-1" /><Skeleton class="h-3/4 flex-1" />\n</div>',
        }[p.shape]),
    },
    slider: {
        controls: () => [number('min', 'Minimum', 2, 0, 50), number('max', 'Maximum', 80, 10, 200), number('step', 'Step', 1, 1, 10), toggle('range', 'Range (two thumbs)'), toggle('disabled', 'Disabled')],
        state: () => ({ v: Vue.ref([24]), r: Vue.ref([20, 60]) }),
        template: p => `<Field class="w-full max-w-sm"${flag('data-disabled', p.disabled)}>
  <FieldLabel>${p.range ? 'Width, {{ r[0] }} to {{ r[1] }} px' : 'Brush size, {{ v[0] }} px'}</FieldLabel>
  <Slider v-model="${p.range ? 'r' : 'v'}" :min="${p.min}" :max="${p.max}" :step="${p.step}"${flag('disabled', p.disabled)} />
</Field>`,
    },
    sonner: {
        controls: () => [select('type', 'Type', ['success', 'error', 'warning', 'info', 'neutral'], 'success'), text('title', 'Title', 'Dataset saved'), toggle('description', 'Description', true), toggle('action', 'Action (Undo)')],
        state: () => ({ toast: window.__rpToast }),
        template: p => `<Button variant="outline" @click="toast${p.type === 'neutral' ? '' : `.${p.type}`}('${esc(p.title).replace(/'/g, "\\'")}'${p.description || p.action ? `, { ${[p.description ? "description: 'PCB inspection'" : '', p.action ? "action: { label: 'Undo', onClick: () => {} }" : ''].filter(Boolean).join(', ')} }` : ''})">Show toast</Button>`,
    },
    spinner: {
        controls: () => [select('size', 'Size', ['size-4', 'size-5', 'size-6', 'size-8'], 'size-4'), toggle('label', 'With its word', true)],
        template: p => (p.label ? `<span class="flex items-center gap-2 text-muted-foreground"><Spinner${p.size === 'size-4' ? '' : ` class="${p.size}"`} />Training</span>` : `<Spinner${p.size === 'size-4' ? '' : ` class="${p.size}"`} />`),
    },
    switch: {
        controls: () => [select('size', 'Size', ['default', 'sm'], 'default', 'Switch.size'), toggle('checked', 'On', true), select('layout', 'Layout', ['label beside', 'switch row'], 'label beside'), toggle('disabled', 'Disabled')],
        template: p => (p.layout === 'switch row'
            ? `<Field orientation="horizontal" class="w-full max-w-xl rounded-lg border p-4"${flag('data-disabled', p.disabled)}>
  <FieldContent><FieldLabel for="pg-sw">Sync with the controller</FieldLabel><FieldDescription>New images upload as they are captured.</FieldDescription></FieldContent>
  <Switch id="pg-sw"${attr('size', p.size, 'default')} :model-value="${p.checked}"${flag('disabled', p.disabled)} />
</Field>`
            : `<Field orientation="horizontal" class="w-auto"${flag('data-disabled', p.disabled)}>
  <Switch id="pg-sw"${attr('size', p.size, 'default')} :model-value="${p.checked}"${flag('disabled', p.disabled)} />
  <FieldLabel for="pg-sw">Legend</FieldLabel>
</Field>`),
    },
    table: {
        controls: () => [number('rows', 'Rows', 3, 1, 8), toggle('sortable', 'Sortable headers', true), toggle('status', 'Status column', true), toggle('actions', 'Row actions', true), toggle('caption', 'Caption'), toggle('empty', 'Empty')],
        template: (p) => {
            const data = pick(p.rows, Array.from({ length: 8 }, (_, i) => [`m-inspection-0${i + 1}`, ['PCB inspection', 'Tortilla line', 'Blister packaging'][i % 3], `0${(i % 9) + 1}/10/2026`, i % 4 === 2]));
            const th = (l, s) => (s && p.sortable ? `<TableHead><Button variant="ghost" size="sm" class="-ml-3">${l}<ArrowUpDownIcon data-icon="inline-end" /></Button></TableHead>` : `<TableHead>${l}</TableHead>`);
            const cols = 3 + (p.status ? 1 : 0) + (p.actions ? 1 : 0);
            return `<Table class="max-w-3xl">${p.caption ? '\n  <TableCaption>Models of the last 30 days.</TableCaption>' : ''}
  <TableHeader>
    <TableRow>
      ${th('Name', true)}
      ${th('Dataset', false)}
      ${th('Date', true)}${p.status ? '\n      <TableHead>Status</TableHead>' : ''}${p.actions ? '\n      <TableHead class="w-10"><span class="sr-only">Actions</span></TableHead>' : ''}
    </TableRow>
  </TableHeader>
  <TableBody>${p.empty ? `\n    <TableEmpty :colspan="${cols}">No models yet.</TableEmpty>` : data.map(([n, d, t, failed]) => `
    <TableRow>
      <TableCell class="font-medium">${n}</TableCell>
      <TableCell>${d}</TableCell>
      <TableCell class="tabular-nums">${t}</TableCell>${p.status ? `\n      <TableCell><span class="flex items-center gap-1.5 text-muted-foreground">${failed ? '<CircleXIcon class="size-4 text-destructive" />Failed' : '<CircleCheckIcon class="size-4 text-success" />Finished'}</span></TableCell>` : ''}${p.actions ? `\n      <TableCell><Button variant="ghost" size="icon-sm" aria-label="Actions for ${n}"><EllipsisIcon /></Button></TableCell>` : ''}
    </TableRow>`).join('')}
  </TableBody>
</Table>`;
        },
    },
    tabs: {
        controls: () => [select('variant', 'List variant', fromCva('tabs', 'tabsListVariants', 'variant'), 'line', 'TabsList.variant'), number('count', 'Tabs', 3, 2, 5), toggle('counts', 'Counts'), toggle('disabled', 'A disabled tab')],
        template: (p) => {
            const tabs = pick(p.count, [['overview', 'Overview', 0], ['images', 'Images', 1248], ['tags', 'Tags', 3], ['models', 'Models', 3], ['validate', 'Validate', 0]]);
            return `<Tabs default-value="overview" class="w-full max-w-xl">
  <TabsList${attr('variant', p.variant, 'default')}>
${tabs.map(([v, l, n], i) => `    <TabsTrigger value="${v}"${flag('disabled', p.disabled && i === tabs.length - 1)}>${l}${p.counts && n ? ` <Badge variant="secondary">${n}</Badge>` : ''}</TabsTrigger>`).join('\n')}
  </TabsList>
${tabs.map(([v, l]) => `  <TabsContent value="${v}" class="pt-2 text-muted-foreground">${l} of PCB inspection.</TabsContent>`).join('\n')}
</Tabs>`;
        },
    },
    textarea: {
        controls: () => [text('placeholder', 'Placeholder', 'What is wrong with this image?'), number('rows', 'Rows', 3, 2, 10), toggle('disabled', 'Disabled'), toggle('invalid', 'Invalid')],
        template: p => `<Field class="w-full max-w-sm"${flag('data-invalid', p.invalid)}>
  <FieldLabel for="pg-ta">Comment</FieldLabel>
  <Textarea id="pg-ta" placeholder="${esc(p.placeholder)}" rows="${p.rows}"${flag('disabled', p.disabled)}${p.invalid ? ' aria-invalid="true"' : ''} />${p.invalid ? '\n  <FieldError>Write at least 10 characters.</FieldError>' : ''}
</Field>`,
    },
    'toggle-group': {
        controls: () => [select('variant', 'Variant', fromCva('toggle', 'toggleVariants', 'variant'), 'default', 'ToggleGroup.variant'), select('size', 'Size', fromCva('toggle', 'toggleVariants', 'size'), 'default', 'ToggleGroup.size'), select('type', 'Type', ['single', 'multiple'], 'single', 'ToggleGroup.type'), number('spacing', 'Spacing', 1, 0, 4), select('content', 'Content', ['icons', 'text'], 'icons'), toggle('bar', 'Floating bar (canvas)', true), select('orientation', 'Orientation', ['horizontal', 'vertical'], 'horizontal')],
        state: () => ({ one: Vue.ref('box'), many: Vue.ref(['box']) }),
        template: (p) => {
            const items = p.content === 'icons'
                ? [['pan', 'Pan', 'HandIcon'], ['box', 'Box', 'SquareDashedIcon'], ['brush', 'Brush', 'BrushIcon'], ['erase', 'Eraser', 'EraserIcon']]
                : [['raw', 'Raw'], ['box', 'Unwrapped'], ['both', 'Both']];
            return `<ToggleGroup v-model="${p.type === 'single' ? 'one' : 'many'}" type="${p.type}"${attr('variant', p.variant, 'default')}${attr('size', p.size, 'default')}${p.spacing ? ` :spacing="${p.spacing}"` : ''}${attr('orientation', p.orientation, 'horizontal')}${p.bar ? ` class="rounded-md border bg-card p-1 shadow-xs${p.orientation === 'vertical' ? ' flex-col' : ''}"` : ''}>
${items.map(([v, l, ic]) => `  <ToggleGroupItem value="${v}" aria-label="${l}">${ic ? `<${ic} />` : l}</ToggleGroupItem>`).join('\n')}
</ToggleGroup>`;
        },
    },
    tooltip: {
        controls: () => [select('side', 'Side', ['top', 'bottom', 'left', 'right'], 'top', 'TooltipContent.side'), text('label', 'Text', 'Zoom in'), toggle('shortcut', 'Shortcut')],
        template: p => `<Tooltip>
  <TooltipTrigger as-child><Button variant="ghost" size="icon" aria-label="${esc(p.label)}"><ZoomInIcon /></Button></TooltipTrigger>
  <TooltipContent${attr('side', p.side, 'top')}>${esc(p.label)}${p.shortcut ? ' <Kbd>+</Kbd>' : ''}</TooltipContent>
</Tooltip>`,
    },
};

// The few templates with state need Vue's ref.
import * as Vue from 'vue';
import { toast } from 'vue-sonner';
window.__rpToast = toast;
