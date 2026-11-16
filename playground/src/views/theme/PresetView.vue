<script setup lang="ts">
// Preset: every design token of packages/design/styles.css, editable live (light and dark), with a sample
// of the interface, contrast checks, saved presets and the CSS to paste back into styles.css.
import type { Mode, Token } from '@/composables/usePreset'
import { CheckIcon, ChevronRightIcon, FileCheckIcon, ChevronsDownUpIcon, ChevronsUpDownIcon, CopyIcon, CopyPlusIcon, WandSparklesIcon, DownloadIcon, ExternalLinkIcon, MoonIcon, RotateCcwIcon, SaveIcon, SearchIcon, SunIcon, Trash2Icon, TriangleAlertIcon } from '@lucide/vue'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import PresetPreview from '@/components/theme/PresetPreview.vue'
import ColorInput from '@/components/theme/ColorInput.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BASE, PALETTE_GROUPS, usePreset } from '@/composables/usePreset'
import { useRepo } from '@/composables/useRepo'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const preset = usePreset()
const { isDark } = useTheme()

// Which mode is being edited = the mode on screen, so the preview shows what is edited.
const mode = computed<Mode>({
  get: () => (isDark.value ? 'dark' : 'light'),
  set: m => (document.documentElement.dataset.theme = m),
})

// ─── Typography and shape (same in both modes) ─────────────────────────────────────────────────
const FONTS = ['Inter Variable', 'Roboto', 'Rubik', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito Sans', 'DM Sans', 'Manrope', 'Figtree', 'Work Sans', 'IBM Plex Sans', 'Source Sans 3']
const fontToken = computed(() => BASE.light.find(tk => tk.kind === 'font' && /family|sans/.test(tk.name) && !/^var\(/.test(tk.value)))
const font = computed({
  get: () => (fontToken.value ? preset.value('light', fontToken.value.name).split(',')[0]!.replace(/['"]/g, '').trim() : ''),
  set: (f: string) => fontToken.value && preset.set('light', fontToken.value.name, `'${f}', sans-serif`, true),
})
const RADII = [
  { name: '--radius', label: 'Corner radius', note: 'Cards, buttons, fields and menus take their corners from it.' },
  { name: '--radius-modal', label: 'Modal corners', note: 'Dialogs and confirmations.' },
].filter(r => BASE.light.some(tk => tk.name === r.name))
// Older presets saved rem; the slider works in px (1rem = 16px).
const px = (v: string) => Math.round((Number.parseFloat(v) || 0) * (v.trim().endsWith('rem') ? 16 : 1))
const radius = (name: string) => computed({
  get: () => [px(preset.value('light', name))],
  set: (v: number[]) => preset.set('light', name, `${v[0]}px`, true),
})
const radii = Object.fromEntries(RADII.map(r => [r.name, radius(r.name)]))

// ─── Colour tokens, grouped as in styles.css ────────────────────────────────────────────────────
const query = ref('')
// Colours: what the palette defines, one value for both modes. Tokens: what each use points to, per mode.
const section = ref<'colours' | 'tokens'>('colours')

// Each group folds like a dropdown; which ones are folded is remembered in this browser. While
// searching, every group with a match is open.
const FOLDED_KEY = 'playground-preset-folded'
const folded = ref<string[]>((() => {
  try {
    return JSON.parse(localStorage.getItem(FOLDED_KEY) ?? '[]')
  }
  catch {
    return []
  }
})())
const isOpen = (group: string) => !!query.value.trim() || !folded.value.includes(group)
function setOpen(group: string, open: boolean) {
  if (query.value.trim())
    return
  folded.value = open ? folded.value.filter(g => g !== group) : [...folded.value, group]
  try {
    localStorage.setItem(FOLDED_KEY, JSON.stringify(folded.value))
  }
  catch {}
}
const allFolded = computed(() => groups.value.every(([g]) => folded.value.includes(g)))
function foldAll() {
  const names = groups.value.map(([g]) => g)
  folded.value = allFolded.value ? folded.value.filter(g => !names.includes(g)) : [...new Set([...folded.value, ...names])]
  try {
    localStorage.setItem(FOLDED_KEY, JSON.stringify(folded.value))
  }
  catch {}
}
const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  // A search looks in both sections, so a token never seems missing for being in the other one.
  const list = BASE[mode.value].filter(tk => tk.kind !== 'font' && tk.kind !== 'radius'
    && (q || PALETTE_GROUPS.includes(tk.group) === (section.value === 'colours'))
    && (!q || tk.name.includes(q) || tk.note.toLowerCase().includes(q) || tk.group.toLowerCase().includes(q)))
  const map = new Map<string, Token[]>()
  for (const tk of list)
    map.set(tk.group, [...(map.get(tk.group) ?? []), tk])
  return [...map.entries()]
})

// The palette (PALETTE_GROUPS, styles.css's colour scales): the base colours, the same in
// both modes, so editing one changes both. Every other colour token points to one of them (var(--…))
// or has its own value.
const PALETTE = BASE.light.filter(tk => PALETTE_GROUPS.includes(tk.group))
// Each colour's "points to" Select lists the whole palette; mounting ~50 items in every closed Select
// made the page take seconds to open. Closed, a Select only renders its current option (what its
// trigger shows); the full list mounts when it opens.
const openTarget = ref<string | null>(null)
const paletteFor = (name: string) => openTarget.value === name ? PALETTE : PALETTE.filter(p => p.name === target(name))
const isPalette = (name: string) => PALETTE.some(p => p.name === name)
const CUSTOM = '__custom'
/** Palette colours and non-colour tokens are the same in light and dark mode. */
const bothModes = (name: string) => isPalette(name) || !isColor(name)
/** A colour: its own colour value, or a var() chain that ends in one (not e.g. a size). */
function isColor(name: string, seen = 0): boolean {
  const tk = BASE[mode.value].find(b => b.name === name)
  if (!tk || seen > 8)
    return false
  const to = /^var\((--[\w-]+)\)$/.exec(preset.value(mode.value, name))?.[1]
  return to ? isColor(to, seen + 1) : tk.kind === 'color'
}
/** The token another token points to (`var(--blue-600)` → `--blue-600`), or null for its own value. */
function target(name: string): string | null {
  return /^var\((--[\w-]+)\)$/.exec(preset.value(mode.value, name))?.[1] ?? null
}
function link(name: string, to: unknown) {
  if (to === CUSTOM)
    preset.set(mode.value, name, toHex(resolved(name)))
  else if (typeof to === 'string')
    preset.set(mode.value, name, `var(${to})`)
}

// Any CSS colour → #rrggbb for the native picker (alpha is kept in the text field).
const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
function toHex(value: string): string {
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = 'transparent' // an invalid value then reads as empty, not as the last colour
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map(n => n!.toString(16).padStart(2, '0')).join('')}`
}
// What a token resolves to right now (follows var() chains), for the swatch and the checks.
const resolvedTick = ref(0)
watch([() => preset.active.value, mode], () => nextTick(() => resolvedTick.value++), { deep: true })
function resolved(name: string): string {
  void resolvedTick.value
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// ─── Contrast (WCAG AA: 4.5:1 for text) ────────────────────────────────────────────────────────
function luminance(hex: string) {
  const c = [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255).map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!
}
const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(toHex(a)), luminance(toHex(b))].sort((p, q) => q - p)
  return (x! + 0.05) / (y! + 0.05)
}
const PAIRS: [string, string, string][] = [
  ['--foreground', '--background', 'Text on background'],
  ['--foreground', '--card', 'Text on cards'],
  ['--muted-foreground', '--card', 'Secondary text on cards'],
  ['--primary-foreground', '--primary', 'Primary button'],
  ['--secondary-foreground', '--secondary', 'Secondary button'],
  ['--fixed-light', '--brand', 'Text on brand'],
  ['--brand-muted', '--brand', 'Top bar inactive text'],
  ['--destructive', '--card', 'Error text on cards'],
]
const checks = computed(() => PAIRS
  .filter(([fg, bg]) => resolved(fg) && resolved(bg))
  .map(([fg, bg, label]) => ({ fg, bg, label, ratio: ratio(resolved(fg), resolved(bg)) })))
const failing = computed(() => checks.value.filter(c => c.ratio < 4.5))

// Fix: the text colour, darkened (on a light background) or lightened (on a dark one) in small steps
// of HSL lightness, keeping its hue, until it reaches 4.5:1. It becomes the token's own value in the
// mode on screen: one more change of the preset (↺ undoes it, Save keeps it).
function hsl(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min)
    return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h / 6, s, l]
}
function fromHsl(h: number, s: number, l: number) {
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
function fixed(fg: string, bg: string): string | null {
  const back = toHex(resolved(bg))
  const [h, s, l0] = hsl(toHex(resolved(fg)))
  const darker = luminance(back) > 0.18
  for (let i = 1; i <= 100; i++) {
    const l = Math.min(1, Math.max(0, l0 + (darker ? -i : i) * 0.005))
    const c = fromHsl(h, s, l)
    if (ratio(c, back) >= 4.5)
      return c
    if (l === 0 || l === 1)
      break
  }
  return null
}
function fix(c: { fg: string, bg: string, label: string }) {
  const v = fixed(c.fg, c.bg)
  if (v)
    preset.set(mode.value, c.fg, v)
  else toast.error(t('No shade of this colour reaches 4.5:1 on that background'), { description: t(c.label) })
}
function fixAll() {
  for (const c of failing.value)
    fix(c)
  toast.success(t('Contrast fixed'), { description: t('Adjusted in the mode on screen. Save the preset to keep it.') })
}

// ─── Saved presets ─────────────────────────────────────────────────────────────────────────────
// The preset being edited (kept with the preset, so it survives reloads). Save writes over it; Save
// as… creates a new one from the current values, which becomes the current preset.
const selected = computed(() => preset.current.value)
const saveOpen = ref(false)
const saveName = ref('')
function loadPreset(id: unknown) {
  preset.load(id === 'base' ? null : preset.saved.value.find(p => p.id === id) ?? null)
}
function saveCurrent() {
  const p = preset.save()
  if (p)
    toast.success(t('Preset saved'), { description: t(p.name) })
}
function save() {
  const name = saveName.value.trim()
  if (!name)
    return
  preset.saveAs(name)
  saveOpen.value = false
  saveName.value = ''
  toast.success(t('Preset saved'), { description: name })
}
function removeSelected() {
  const p = preset.saved.value.find(x => x.id === selected.value)
  if (!p)
    return
  preset.remove(p.id)
  toast(t('Preset deleted'), { description: p.name })
}

// ─── Export ────────────────────────────────────────────────────────────────────────────────────
const exportOpen = ref(false)

// Save to styles.css (dev server): the current values become the file's; the page reloads to read it.
const repo = useRepo()
const savingFile = ref(false)
const hasChanges = computed(() => preset.changedCount.value > 0 || preset.baseChanged.value)
async function saveToFile() {
  savingFile.value = true
  try {
    await repo.saveCss(preset.fileCss())
    preset.committedToFile()
    toast.success(t('Saved to styles.css'), { description: t('The page reloads with the new file.') })
    window.setTimeout(() => location.reload(), 900)
  }
  catch (e) {
    toast.error(t('styles.css could not be saved'), { description: String((e as Error).message ?? e) })
    savingFile.value = false
  }
}
const exported = ref('')
const copied = ref(false)
function openExport() {
  exported.value = preset.exportCss()
  exportOpen.value = true
}
async function copyExport() {
  try {
    await navigator.clipboard.writeText(exported.value)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1500)
  }
  catch {
    toast.error(t('The browser did not allow copying. Select the text and copy it.'))
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 xl:h-[calc(100svh-6.5rem)] xl:min-h-0">
    <!-- Wide screens: fits under the playground's header (3.5rem) and padding (2 × 1.5rem); the editor
         and the preview scroll on their own. Narrower: one column, the page scrolls. -->
    <!-- Header -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-heading">{{ $t('Preset') }}</h1>
        <p class="max-w-2xl text-sm text-muted-foreground">
          {{ $t('Font, corners and every colour of the interface, as declared in packages/design/styles.css. Changes apply at once everywhere in the playground.') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Select :model-value="selected" @update:model-value="loadPreset">
          <SelectTrigger class="w-56" size="sm" :aria-label="$t('Saved presets')"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="base">{{ $t('Rosepetal (styles.css)') }}<span v-if="preset.baseChanged.value" class="text-xs text-muted-foreground"> · {{ $t('modified') }}</span></SelectItem>
            </SelectGroup>
            <template v-if="preset.saved.value.length">
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>{{ $t('Saved') }}</SelectLabel>
                <SelectItem v-for="p in preset.saved.value" :key="p.id" :value="p.id">{{ p.name }}</SelectItem>
              </SelectGroup>
            </template>
          </SelectContent>
        </Select>
        <Badge v-if="preset.dirty.value" variant="amber">{{ $t('Unsaved') }}</Badge>
        <Button v-if="selected !== 'base'" variant="ghost" size="icon-sm" :aria-label="$t('Delete preset')" @click="removeSelected"><Trash2Icon /></Button>
        <!-- Save over the current preset (not styles.css: that one is only exported), or as a new one -->
        <Tooltip>
          <TooltipTrigger as-child>
            <span tabindex="-1">
              <Button size="sm" :variant="preset.dirty.value ? 'default' : 'outline'" :disabled="!preset.dirty.value" @click="saveCurrent"><SaveIcon data-icon="inline-start" />{{ $t('Save') }}</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{{ !preset.dirty.value ? $t('No unsaved changes') : selected === 'base' ? $t('Save the changes over the base preset (the playground\'s default). To change styles.css itself, use Export CSS.') : $t('Save the changes in {name}', { name: preset.saved.value.find(p => p.id === selected)?.name ?? '' }) }}</TooltipContent>
        </Tooltip>
        <Button variant="outline" size="sm" @click="saveOpen = true"><CopyPlusIcon data-icon="inline-start" />{{ $t('Save as…') }}</Button>
        <Button variant="outline" size="sm" :disabled="!preset.changedCount.value" @click="preset.resetAll()"><RotateCcwIcon data-icon="inline-start" />{{ $t('Reset all') }}</Button>
        <Button v-if="repo.available.value" size="sm" :disabled="!hasChanges || savingFile" @click="saveToFile">
          <Spinner v-if="savingFile" data-icon="inline-start" /><FileCheckIcon v-else data-icon="inline-start" />{{ $t('Save to styles.css') }}
        </Button>
        <Button size="sm" :variant="repo.available.value ? 'outline' : 'default'" @click="openExport"><DownloadIcon data-icon="inline-start" />{{ $t('Export CSS') }}</Button>
      </div>
    </div>

    <div class="grid items-start gap-6 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:grid-rows-[minmax(0,1fr)]">
      <!-- Editor -->
      <div class="flex min-w-0 flex-col gap-4 *:shrink-0 xl:h-full xl:overflow-y-auto">

        <!-- Typography and shape -->
        <Card class="gap-4 py-4">
          <CardHeader class="px-4">
            <CardTitle>{{ $t('Typography and shape') }}</CardTitle>
            <CardDescription>{{ $t('The same in light and dark mode.') }}</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-4 px-4 sm:grid-cols-2">
            <Field v-if="fontToken">
              <FieldLabel>{{ $t('Font') }} <code class="text-xs font-normal text-muted-foreground">{{ fontToken.name }}</code></FieldLabel>
              <Select v-model="font">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="f in FONTS" :key="f" :value="f" :style="{ fontFamily: `'${f}'` }">{{ f }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription class="text-xs">{{ $t('Loaded from Google Fonts.') }}</FieldDescription>
            </Field>
            <Field v-for="r in RADII" :key="r.name">
              <FieldLabel>{{ $t(r.label) }} <code class="text-xs font-normal text-muted-foreground">{{ r.name }} · {{ radii[r.name]!.value[0] }}px</code></FieldLabel>
              <Slider v-model="radii[r.name]!.value" :min="0" :max="24" :step="1" class="py-3" />
              <FieldDescription class="text-xs">{{ $t(r.note) }}</FieldDescription>
            </Field>
            <p v-if="!fontToken" class="text-xs text-muted-foreground">{{ $t('styles.css declares no font variable yet.') }}</p>
          </CardContent>
        </Card>

        <!-- Contrast -->
        <Card class="gap-3 py-4">
          <CardHeader class="px-4">
            <CardTitle class="flex items-center gap-2">
              {{ $t('Contrast') }}
              <Badge :variant="failing.length ? 'destructive' : 'success'">{{ failing.length ? $t('{n} below 4.5:1', { n: failing.length }) : $t('All pass') }}</Badge>
            </CardTitle>
            <CardAction v-if="failing.length > 1">
              <Button variant="outline" size="xs" @click="fixAll"><WandSparklesIcon data-icon="inline-start" />{{ $t('Fix all') }}</Button>
            </CardAction>
            <CardDescription>{{ $t('Text against its background in the mode on screen (WCAG AA asks 4.5:1).') }}</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-1.5 px-4 text-xs sm:grid-cols-2">
            <div v-for="c in checks" :key="c.fg + c.bg" class="flex items-center gap-2">
              <span class="flex size-6 shrink-0 items-center justify-center rounded border text-[0.625rem] font-semibold" :style="{ background: `var(${c.bg})`, color: `var(${c.fg})` }">Aa</span>
              <span class="min-w-0 flex-1 truncate">{{ $t(c.label) }}</span>
              <span class="tabular-nums" :class="c.ratio < 4.5 ? 'font-semibold text-destructive' : 'text-muted-foreground'">
                <TriangleAlertIcon v-if="c.ratio < 4.5" class="mr-0.5 inline size-3" />{{ c.ratio.toFixed(1) }}:1
              </span>
              <Tooltip v-if="c.ratio < 4.5">
                <TooltipTrigger as-child>
                  <Button variant="outline" size="xs" class="h-6 px-2" @click="fix(c)"><WandSparklesIcon data-icon="inline-start" />{{ $t('Fix') }}</Button>
                </TooltipTrigger>
                <TooltipContent>{{ $t('Darkens or lightens {token} just enough to reach 4.5:1', { token: c.fg }) }}</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <!-- Colours -->
        <Card class="gap-0 py-0">
          <CardHeader class="gap-3 border-b px-4 py-4 [.border-b]:pb-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <Tabs v-model="section">
                <TabsList>
                  <TabsTrigger value="colours">{{ $t('Colours') }}</TabsTrigger>
                  <TabsTrigger value="tokens">{{ $t('Tokens') }}</TabsTrigger>
                </TabsList>
              </Tabs>
              <div class="flex items-center gap-1">
                <Button variant="ghost" size="sm" :disabled="!!query.trim() || !groups.length" @click="foldAll">
                  <ChevronsUpDownIcon v-if="allFolded" />
                  <ChevronsDownUpIcon v-else />
                  {{ $t(allFolded ? 'Expand all' : 'Collapse all') }}
                </Button>
                <Tabs v-if="section === 'tokens' || query.trim()" v-model="mode">
                  <TabsList>
                    <TabsTrigger value="light"><SunIcon />{{ $t('Light') }}</TabsTrigger>
                    <TabsTrigger value="dark"><MoonIcon />{{ $t('Dark') }}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <InputGroup>
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput v-model="query" :placeholder="$t('Search token…')" />
            </InputGroup>
          </CardHeader>
          <CardContent class="flex flex-col px-0">
            <Collapsible v-for="[group, tokens] in groups" :key="group" as="section" :open="isOpen(group)" class="flex flex-col border-b last:border-b-0" @update:open="o => setOpen(group, o)">
              <CollapsibleTrigger as-child>
                <Button variant="ghost" class="h-auto justify-start gap-2 rounded-none bg-inset px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:bg-border">
                  <ChevronRightIcon class="transition-transform" :class="isOpen(group) && 'rotate-90'" />
                  <h3 class="flex-1 text-left">{{ $t(group) }}</h3>
                  <span class="font-normal tabular-nums">{{ tokens.length }}</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent class="flex flex-col">
                <div v-for="tk in tokens" :key="tk.name" class="flex items-center gap-3 px-4 py-2" :class="preset.isChanged(mode, tk.name) && 'bg-primary/5'">
                  <ColorInput
                    v-if="isColor(tk.name)"
                    :model-value="toHex(resolved(tk.name) || preset.value(mode, tk.name))"
                    :aria-label="tk.name"
                    @update:model-value="(v: string) => preset.set(mode, tk.name, v, bothModes(tk.name))"
                  />
                  <div class="flex min-w-0 flex-1 flex-col">
                    <code class="truncate text-xs font-medium text-heading">{{ tk.name }}</code>
                    <span v-if="tk.note" class="truncate text-xs text-muted-foreground" :title="tk.note">{{ tk.note }}</span>
                  </div>
                  <!-- Other colours: which palette colour (or other token) it points to, or its own value -->
                  <Select v-if="isColor(tk.name) && !isPalette(tk.name)" :model-value="target(tk.name) ?? CUSTOM" @update:model-value="v => link(tk.name, v)" @update:open="o => (openTarget = o ? tk.name : null)">
                    <SelectTrigger size="sm" class="w-40 font-mono text-xs" :aria-label="`${tk.name} ${$t('points to')}`"><SelectValue /></SelectTrigger>
                    <SelectContent class="max-h-80">
                      <SelectGroup v-if="target(tk.name) && !isPalette(target(tk.name)!)">
                        <SelectLabel>{{ $t('Token') }}</SelectLabel>
                        <SelectItem :value="target(tk.name)!" class="font-mono text-xs">{{ target(tk.name)!.slice(2) }}</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>{{ $t('Palette') }}</SelectLabel>
                        <SelectItem v-for="p in paletteFor(tk.name)" :key="p.name" :value="p.name" class="font-mono text-xs">
                          <span class="size-3 shrink-0 rounded-sm border" :style="{ background: `var(${p.name})` }" />{{ p.name.slice(2) }}
                        </SelectItem>
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectItem :value="CUSTOM" class="text-xs">{{ $t('Own value') }}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    v-if="isPalette(tk.name) || !target(tk.name) || !isColor(tk.name)"
                    :model-value="preset.value(mode, tk.name)"
                    class="h-8 font-mono text-xs" :class="isPalette(tk.name) || !isColor(tk.name) ? 'w-40' : 'w-32'"
                    :aria-label="`${tk.name} ${$t('value')}`"
                    @change="(e: Event) => preset.set(mode, tk.name, (e.target as HTMLInputElement).value, bothModes(tk.name))"
                  />
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button variant="ghost" size="icon-sm" :class="!preset.isChanged(mode, tk.name) && 'invisible'" :aria-label="$t('Reset {name}', { name: tk.name })" @click="preset.reset(mode, tk.name, bothModes(tk.name))">
                        <RotateCcwIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ $t('Back to styles.css: {value}', { value: BASE[mode].find(b => b.name === tk.name)?.value }) }}</TooltipContent>
                  </Tooltip>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <p v-if="!groups.length" class="px-4 py-6 text-center text-sm text-muted-foreground">{{ $t('No token matches the search.') }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Live preview -->
      <div class="flex min-w-0 flex-col gap-2 *:shrink-0 xl:h-full xl:overflow-y-auto">
        <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{{ $t('Preview · {mode}', { mode: $t(mode === 'dark' ? 'Dark' : 'Light') }) }}</span>
          <span v-if="preset.changedCount.value">{{ $t('{n} changed tokens', { n: preset.changedCount.value }) }}</span>
        </div>
        <PresetPreview />
        <p class="text-xs text-muted-foreground">
          {{ $t('Stored for everyone who opens the playground.') }}
          <Button as-child variant="link" size="inline">
            <a href="https://www.shadcn-vue.com/create?preset=aD8S" target="_blank" rel="noopener noreferrer">{{ $t('shadcn preset') }} aD8S<ExternalLinkIcon class="ml-0.5 inline size-3" /></a>
          </Button>
        </p>
      </div>
    </div>

    <!-- Save as -->
    <Dialog v-model:open="saveOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ $t('Save preset') }}</DialogTitle>
          <DialogDescription>{{ $t('Keeps the current changes under a name, to come back to them later.') }}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field>
            <FieldLabel for="preset-name">{{ $t('Name') }}</FieldLabel>
            <Input id="preset-name" v-model="saveName" :placeholder="$t('e.g. Brand manual')" @keydown.enter="save" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="modal" @click="saveOpen = false">{{ $t('Cancel') }}</Button>
          <Button size="modal" :disabled="!saveName.trim()" @click="save">{{ $t('Save') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Export -->
    <Dialog v-model:open="exportOpen">
      <DialogContent class="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{{ $t('Export CSS') }}</DialogTitle>
          <DialogDescription>{{ $t('The :root and .dark blocks of packages/design/styles.css with the current values. Paste them over the ones in the file.') }}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Textarea :model-value="exported" readonly class="h-96 font-mono text-xs" />
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="modal" @click="exportOpen = false">{{ $t('Close') }}</Button>
          <Button size="modal" @click="copyExport">
            <CheckIcon v-if="copied" data-icon="inline-start" /><CopyIcon v-else data-icon="inline-start" />{{ $t(copied ? 'Copied' : 'Copy') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
