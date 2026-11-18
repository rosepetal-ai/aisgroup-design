# Migration maps

What an agent reads to move a whole Vue app from PrimeVue or Vuetify onto `@aisgroup/design`, and from PrimeIcons, Material Design Icons or Font Awesome onto Lucide (`@lucide/vue`). The design MCP serves them as `design_code kind=migration`.

| File | Maps |
| --- | --- |
| `primevue.json` | Every PrimeVue 4 component, directive and service, the v3 names still found in apps, and the theme layer (preset, `pt`, `--p-*` tokens, primeicons) |
| `vuetify.json` | Every Vuetify 3 component, the labs ones apps use, directives, composables and the setup (`createVuetify`, themes, defaults, density, MDI, layout grid) |
| `icons.json` | All PrimeIcons (4.1 to 8.0.2), the common MDI icons and the common Font Awesome solid icons, to `@lucide/vue` exports |

## Entries

`primevue.json` and `vuetify.json` hold one `entries` list. Each entry has:

- `from`: the component, directive, service or setup piece.
- `import`: where the app imports it from.
- `to`: our registry names (`packages/design/catalog.ts`, blocks included).
- `status`: `direct` (swap it and map the props), `compose` (build it from the listed components or Tailwind layout), `gap` (no counterpart yet: the notes say what the library needs and how to compose a temporary version) or `remove` (library-only behaviour or setup: the notes say what replaces it under our rules).
- `props`: each library prop or usage, and what replaces it.
- `needs`: components being added to `packages/design` that the entry depends on (date-picker, data-table and others).
- `notes`: the rule that decides the mapping.
- `bridge` (only `useToast` and `useConfirm`): a file for the app, see below.

`icons.json` lists `{ from, set, to }`. `to` is the component name to import from `@lucide/vue`. Brand logos are `null`: Lucide has no brand icons, so write the brand name or use the brand's official asset. Names are the canonical exports of the installed Lucide, except the aliases our package imports itself (`HomeIcon`, `Trash2Icon`, `TriangleAlertIcon` and a few more, listed in the file); an older alias of the same icon renders the same icon.

## Redesign, not bridge

A full redesign removes PrimeVue or Vuetify, their themes and their icon sets. The adapters in `..` (`primevue.mjs`, `vuetify.mjs`) only bridge the screens not yet moved: they colour the old components, they do not make them compliant.

## Bridges for large apps

Notices are `toast()` from `vue-sonner`, with one `<Toaster />` in App. Confirmations asked from code are `useConfirm().ask()` from the `confirm-host` block, with one `<ConfirmHost />` in App. When an app calls PrimeVue's `useToast().add()` or `useConfirm().require()` from dozens of files, the `bridge` of those two entries is an allowed first step: a file that keeps PrimeVue's call shape over ours (`src/lib/toast.ts`, `src/lib/confirm.ts`), so every caller keeps its behaviour and changes only its import. New code calls `toast()` and `ask()`; the bridge goes once the callers have moved.

## Checks

`node --test scripts/tests/migration-maps.test.mjs` checks that every `to` is in the catalog or in the pending list (with `needs`), every Lucide name is an `@lucide/vue` export, no `from` repeats, and the writing rules hold. primeicons is not a dependency here: point `PRIMEICONS_CSS` at one or more `primeicons.css` files (path-delimited) to check that every PrimeIcons icon is covered.

When a pending component lands in the catalog, its entries stay valid; drop it from the test's pending list once none is left to add.
