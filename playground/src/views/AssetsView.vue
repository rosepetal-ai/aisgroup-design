<script setup lang="ts">
import type { Asset } from '@/data/assets'
import {
  CheckIcon,
  CloudIcon,
  CopyIcon,
  EllipsisIcon,
  FileIcon,
  FolderIcon,
  FolderInputIcon,
  FolderPlusIcon,
  GitCommitHorizontalIcon,
  HardDriveIcon,
  LayersIcon,
  ListChecksIcon,
  PencilIcon,
  PlayIcon,
  RotateCcwIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from '@lucide/vue'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAssetStore } from '@/composables/useAssetStore'
import { useRepo } from '@/composables/useRepo'
import { adviceFor, adviceHint, adviceLabel, assets as allAssets, formatBytes, usage } from '@/data/assets'
import { formatNumber } from '@/i18n'

const { t } = useI18n()
const store = useAssetStore()

// ---- Folders: rosepetal-ui's own folders + the user's custom ones ("rp:<name>" / "c:<id>" keys)
const RP_FOLDERS = [...new Set(allAssets.map(a => a.folder))]
const folderKey = (a: Asset) => store.state.value.placement[a.path] ?? `rp:${a.folder}`
const live = computed(() => allAssets.filter(a => !store.deleted.value.has(a.path)))
const trash = computed(() => allAssets.filter(a => store.deleted.value.has(a.path)))
const countIn = (key: string) => live.value.filter(a => folderKey(a) === key).length

const rpFolders = computed(() => RP_FOLDERS.map(f => ({ key: `rp:${f}`, name: f, count: countIn(`rp:${f}`) })))
const customFolders = computed(() => store.state.value.folders.map(f => ({ key: `c:${f.id}`, id: f.id, name: f.name, count: countIn(`c:${f.id}`) })))
const allFolders = computed(() => [...rpFolders.value, ...customFolders.value])
const folderName = (key: string) => allFolders.value.find(f => f.key === key)?.name ?? key.slice(2)

// ---- Save to the repo (dev server): the moves and deletions become real in rp-assets/
const repo = useRepo()
const slug = (name: string) => name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'folder'
const targetFolder = (key: string) => key.startsWith('rp:') ? key.slice(3) : slug(folderName(key))
const pending = computed(() => {
  const moves = allAssets
    .filter(a => !store.deleted.value.has(a.path) && store.state.value.placement[a.path])
    .map(a => ({ from: a.url, to: `rp-assets/${targetFolder(folderKey(a))}/${a.name}` }))
    .filter(m => m.from !== m.to)
  // Deleting a file the playground still uses would break it: those stay
  const deletes = trash.value.filter(a => !a.usedHere.length).map(a => a.url)
  const kept = trash.value.filter(a => a.usedHere.length).map(a => a.name)
  return { moves, deletes, kept }
})
const pendingCount = computed(() => pending.value.moves.length + pending.value.deletes.length)
const savingRepo = ref(false)
async function saveToRepo() {
  savingRepo.value = true
  try {
    const { moves, deletes, kept } = pending.value
    const r = await repo.saveAssets({ moves, deletes })
    store.clearApplied()
    toast.success(t('Saved to the repo'), {
      description: [
        t('{n} moved', { n: r.moved.length }),
        t('{n} deleted', { n: r.removed.length }),
        r.references.length ? t('references updated in {files}', { files: r.references.join(', ') }) : '',
        kept.length ? t('kept (in use): {names}', { names: kept.join(', ') }) : '',
      ].filter(Boolean).join(' · '),
    })
  }
  catch (e) {
    toast.error(t('The repo could not be updated'), { description: String((e as Error).message ?? e) })
  }
  finally {
    savingRepo.value = false
  }
}

const current = ref<string>('all') // 'all' | 'trash' | folder key
const query = ref('')
const usageFilter = ref<'all' | 'new' | 'used' | 'unused'>('all')
const backdrop = ref<'checker' | 'light' | 'dark'>('checker')
const dims = reactive<Record<string, string>>({})

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  const base = current.value === 'trash'
    ? trash.value
    : current.value === 'all' ? live.value : live.value.filter(a => folderKey(a) === current.value)
  return base.filter(a =>
    (usageFilter.value === 'all' || (usageFilter.value === 'new' ? !!a.isNew : usage(a) === usageFilter.value))
    && (!q || a.name.toLowerCase().includes(q)))
})

const stats = computed(() => {
  const list = live.value
  const unused = list.filter(a => usage(a) === 'unused')
  return {
    total: list.length,
    bytes: list.reduce((s, a) => s + a.bytes, 0),
    unused: unused.length,
    unusedBytes: unused.reduce((s, a) => s + a.bytes, 0),
    vector: list.filter(a => ['icon', 'svg-logo', 'svg-illustration'].includes(adviceFor(a))).length,
    svg: list.filter(a => a.format === 'svg').length,
  }
})

const backdropClass = computed(() => ({ checker: 'bg-checker', light: 'bg-backdrop-light', dark: 'bg-backdrop-dark' }[backdrop.value]))

function onLoad(a: Asset, e: Event) {
  const el = e.target as HTMLImageElement | HTMLVideoElement
  const w = 'naturalWidth' in el ? el.naturalWidth : el.videoWidth
  const h = 'naturalHeight' in el ? el.naturalHeight : el.videoHeight
  if (w)
    dims[a.path] = `${w} × ${h}`
  if (el instanceof HTMLImageElement && isLight(el))
    light[a.path] = true
}

// Images that are almost all white (white logos, light illustrations) vanish on the checker: there
// they get the dark backdrop (the Background toggle still applies to every image when chosen).
const light = reactive<Record<string, boolean>>({})
const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
function isLight(img: HTMLImageElement) {
  if (!probe)
    return false
  probe.canvas.width = probe.canvas.height = 24
  probe.clearRect(0, 0, 24, 24)
  try {
    probe.drawImage(img, 0, 0, 24, 24)
    const d = probe.getImageData(0, 0, 24, 24).data
    let sum = 0
    let weight = 0
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3]! / 255
      sum += a * (0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]!) / 255
      weight += a
    }
    return weight > 4 && sum / weight > 0.85
  }
  catch {
    return false // a cross-origin image can't be read: keep the chosen backdrop
  }
}
const cardBackdrop = (a: Asset) => (backdrop.value === 'checker' && light[a.path] ? 'bg-backdrop-dark' : backdropClass.value)

// ---- Selection
const selected = ref<Set<string>>(new Set())
const selectedAssets = computed(() => allAssets.filter(a => selected.value.has(a.path)))
const selectedBytes = computed(() => selectedAssets.value.reduce((s, a) => s + a.bytes, 0))
function toggle(a: Asset, on?: boolean) {
  const next = new Set(selected.value)
  const want = on ?? !next.has(a.path)
  if (want)
    next.add(a.path)
  else next.delete(a.path)
  selected.value = next
}
const clearSelection = () => (selected.value = new Set())
const selectVisible = () => (selected.value = new Set(visible.value.map(a => a.path)))
function selectUnused() {
  const unused = visible.value.filter(a => usage(a) === 'unused')
  selected.value = new Set(unused.map(a => a.path))
  if (!unused.length)
    toast(t('No unused assets in this view'))
}
function setFolder(key: string) {
  current.value = key
  clearSelection()
}

// ---- Actions on the selection
function moveSelected(key: string) {
  const items = selectedAssets.value.map(a => ({ path: a.path, original: a.folder }))
  store.move(items, key)
  toast.success(t('{n} assets moved to {folder}', { n: items.length, folder: folderName(key) }))
  clearSelection()
}
const confirmDelete = ref(false)
function deleteSelected() {
  const n = selectedAssets.value.length
  store.remove(selectedAssets.value.map(a => a.path))
  toast.success(t('{n} assets deleted from the playground', { n }), { description: formatBytes(selectedBytes.value) })
  clearSelection()
}
function restoreSelected() {
  const n = selectedAssets.value.length
  store.restore(selectedAssets.value.map(a => a.path))
  toast.success(t('{n} assets restored', { n }))
  clearSelection()
}

// ---- Folder dialogs
const folderDialog = reactive({ open: false, mode: 'create' as 'create' | 'rename', id: '', name: '', moveSelection: false })
const folderNameInvalid = ref(false)
function openCreateFolder(moveSelection = false) {
  Object.assign(folderDialog, { open: true, mode: 'create', id: '', name: '', moveSelection })
  folderNameInvalid.value = false
}
function openRenameFolder(id: string, name: string) {
  Object.assign(folderDialog, { open: true, mode: 'rename', id, name, moveSelection: false })
  folderNameInvalid.value = false
}
function submitFolder() {
  const name = folderDialog.name.trim()
  folderNameInvalid.value = !name
  if (!name)
    return
  if (folderDialog.mode === 'rename') {
    store.renameFolder(folderDialog.id, name)
  }
  else {
    const key = store.createFolder(name)
    if (folderDialog.moveSelection && selected.value.size)
      moveSelected(key)
    else toast.success(t('Folder “{name}” created', { name }))
  }
  folderDialog.open = false
}
const folderToDelete = ref<{ id: string, name: string, count: number } | null>(null)
const deleteFolderOpen = computed({ get: () => !!folderToDelete.value, set: v => !v && (folderToDelete.value = null) })
function confirmDeleteFolder() {
  const f = folderToDelete.value!
  store.deleteFolder(f.id)
  if (current.value === `c:${f.id}`)
    current.value = 'all'
  folderToDelete.value = null
}

// ---- Detail
const detail = ref<Asset | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: v => !v && (detail.value = null) })
const copied = ref(false)
async function copyPath(path: string) {
  try {
    await navigator.clipboard.writeText(`rosepetal-ui/${path}`)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1500)
  }
  catch {}
}

const usageVariant = { used: 'secondary', unused: 'destructive' } as const
const usageLabel = (a: Asset) => ({ used: a.usedHere.length === 1 ? '1 use' : '{n} uses', unused: 'No references' })[usage(a)]
const isVideo = (a: Asset) => a.format === 'mp4' || a.format === 'webm'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-heading">Assets</h1>
        <p class="text-sm text-muted-foreground">
          {{ $t('Images, logos and videos in rosepetal-ui/src/assets, with where each one is used.') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Button v-if="repo.available.value" size="sm" :disabled="!pendingCount || savingRepo" @click="saveToRepo">
          <Spinner v-if="savingRepo" data-icon="inline-start" /><GitCommitHorizontalIcon v-else data-icon="inline-start" />{{ $t('Save to the repo') }}<Badge v-if="pendingCount" variant="secondary" class="tabular-nums">{{ pendingCount }}</Badge>
        </Button>
      <Badge variant="outline" class="gap-1.5">
        <CloudIcon v-if="store.mode.value === 'db'" />
        <HardDriveIcon v-else />
        {{ $t(store.mode.value === 'db' ? 'Saved in the artifact' : store.mode.value === 'loading' ? 'Connecting…' : 'Saved in this browser') }}
      </Badge>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('Total') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">{{ stats.total }} · {{ formatBytes(stats.bytes) }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('No references') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">{{ stats.unused }} · {{ formatBytes(stats.unusedBytes) }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('Could be SVG or icon') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">{{ stats.vector }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('Already SVG') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">{{ stats.svg }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <!-- Folder navigation -->
      <nav class="flex flex-col gap-1 rounded-lg border bg-card p-2 text-sm lg:sticky lg:top-18" :aria-label="$t('Folders')">
        <Button variant="ghost" class="justify-start" :class="current === 'all' && 'bg-secondary'" @click="setFolder('all')">
          <LayersIcon data-icon="inline-start" />
          <span class="flex-1 text-left">{{ $t('All') }}</span>
          <span class="text-xs text-muted-foreground tabular-nums">{{ live.length }}</span>
        </Button>

        <p class="px-2 pt-3 pb-1 text-xs font-medium text-muted-foreground">{{ $t('rosepetal-ui folders') }}</p>
        <Button v-for="f in rpFolders" :key="f.key" variant="ghost" class="justify-start" :class="current === f.key && 'bg-secondary'" @click="setFolder(f.key)">
          <FolderIcon data-icon="inline-start" />
          <span class="flex-1 truncate text-left">{{ f.name }}</span>
          <span class="text-xs text-muted-foreground tabular-nums">{{ f.count }}</span>
        </Button>

        <p class="px-2 pt-3 pb-1 text-xs font-medium text-muted-foreground">{{ $t('My folders') }}</p>
        <div v-for="f in customFolders" :key="f.key" class="group/folder flex items-center">
          <Button variant="ghost" class="min-w-0 flex-1 justify-start" :class="current === f.key && 'bg-secondary'" @click="setFolder(f.key)">
            <FolderIcon data-icon="inline-start" class="text-primary" />
            <span class="flex-1 truncate text-left">{{ f.name }}</span>
            <span class="text-xs text-muted-foreground tabular-nums">{{ f.count }}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon-sm" :aria-label="$t('Folder options')"><EllipsisIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem @select="openRenameFolder(f.id, f.name)"><PencilIcon />{{ $t('Rename') }}</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" @select="folderToDelete = { id: f.id, name: f.name, count: f.count }"><Trash2Icon />{{ $t('Delete folder') }}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="ghost" class="justify-start text-muted-foreground" @click="openCreateFolder()">
          <FolderPlusIcon data-icon="inline-start" />
          {{ $t('New folder') }}
        </Button>

        <Separator class="my-2" />
        <Button variant="ghost" class="justify-start" :class="current === 'trash' && 'bg-secondary'" @click="setFolder('trash')">
          <Trash2Icon data-icon="inline-start" />
          <span class="flex-1 text-left">{{ $t('Deleted') }}</span>
          <span class="text-xs text-muted-foreground tabular-nums">{{ trash.length }}</span>
        </Button>
      </nav>

      <div class="flex min-w-0 flex-col gap-4">
        <div class="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Field class="w-full sm:w-56">
            <FieldLabel for="asset-search">{{ $t('Search') }}</FieldLabel>
            <div class="relative">
              <SearchIcon class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="asset-search" v-model="query" :placeholder="$t('File name')" class="pl-8" />
            </div>
          </Field>
          <Field class="w-44">
            <FieldLabel for="asset-usage">{{ $t('Usage') }}</FieldLabel>
            <Select v-model="usageFilter">
              <SelectTrigger id="asset-usage" class="w-full" size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{{ $t('All') }}</SelectItem>
                  <SelectItem value="used">{{ $t('Used') }}</SelectItem>
                  <SelectItem value="unused">{{ $t('No references') }}</SelectItem>
                  <SelectItem value="new">{{ $t('New') }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field class="w-auto">
            <FieldLabel>{{ $t('Background') }}</FieldLabel>
            <ToggleGroup v-model="backdrop" type="single" variant="outline" size="sm">
              <ToggleGroupItem value="checker">{{ $t('Transparent') }}</ToggleGroupItem>
              <ToggleGroupItem value="light">{{ $t('Light') }}</ToggleGroupItem>
              <ToggleGroupItem value="dark">{{ $t('Dark') }}</ToggleGroupItem>
            </ToggleGroup>
          </Field>
        </div>

        <!-- Selection bar -->
        <div class="sticky top-14 z-10 flex flex-wrap items-center gap-2 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur">
          <template v-if="selected.size">
            <span class="px-2 text-sm font-medium tabular-nums">
              {{ $t('{n} selected', { n: selected.size }) }} · {{ formatBytes(selectedBytes) }}
            </span>
            <div class="ml-auto flex flex-wrap gap-2">
              <template v-if="current === 'trash'">
                <Button size="sm" @click="restoreSelected"><RotateCcwIcon data-icon="inline-start" />{{ $t('Restore') }}</Button>
              </template>
              <template v-else>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm"><FolderInputIcon data-icon="inline-start" />{{ $t('Move to') }}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="max-h-80">
                    <DropdownMenuLabel>{{ $t('rosepetal-ui folders') }}</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem v-for="f in rpFolders" :key="f.key" @select="moveSelected(f.key)"><FolderIcon />{{ f.name }}</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <template v-if="customFolders.length">
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{{ $t('My folders') }}</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem v-for="f in customFolders" :key="f.key" @select="moveSelected(f.key)"><FolderIcon class="text-primary" />{{ f.name }}</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </template>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem @select="openCreateFolder(true)"><FolderPlusIcon />{{ $t('New folder…') }}</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm" @click="confirmDelete = true"><Trash2Icon data-icon="inline-start" />{{ $t('Delete') }}</Button>
              </template>
              <Button variant="ghost" size="sm" @click="clearSelection"><XIcon data-icon="inline-start" />{{ $t('Clear') }}</Button>
            </div>
          </template>
          <template v-else>
            <span class="px-2 text-sm text-muted-foreground tabular-nums">
              {{ $t('{n} of {total} assets', { n: visible.length, total: current === 'trash' ? trash.length : live.length }) }}
            </span>
            <div class="ml-auto flex flex-wrap gap-2">
              <Button variant="outline" size="sm" :disabled="!visible.length" @click="selectVisible"><ListChecksIcon data-icon="inline-start" />{{ $t('Select all') }}</Button>
              <Button v-if="current !== 'trash'" variant="outline" size="sm" @click="selectUnused"><Trash2Icon data-icon="inline-start" />{{ $t('Select unused') }}</Button>
            </div>
          </template>
        </div>

        <div v-if="visible.length" class="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-4">
          <div
            v-for="a in visible"
            :key="a.path"
            class="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
            :class="selected.has(a.path) && 'ring-2 ring-primary'"
          >
            <Checkbox
              :id="`sel-${a.path}`"
              :model-value="selected.has(a.path)"
              :aria-label="$t('Select {name}', { name: a.name })"
              class="absolute top-2 left-2 z-1 size-5 bg-background shadow-sm"
              @update:model-value="v => toggle(a, !!v)"
            />
            <Button variant="ghost" size="card" @click="selected.size ? toggle(a) : (detail = a)">
              <span class="relative flex aspect-square items-center justify-center" :class="cardBackdrop(a)">
                <span v-if="isVideo(a)" class="flex flex-col items-center gap-2 text-muted-foreground">
                  <PlayIcon class="size-8" />
                  <span class="text-xs">{{ $t('Video') }}</span>
                </span>
                <img v-else :src="a.url" :alt="a.name" loading="lazy" class="absolute inset-0 size-full object-contain p-3" @load="onLoad(a, $event)">
              </span>
              <span class="flex flex-col gap-1.5 border-t p-3">
                <span class="truncate text-sm font-medium" :title="a.name">{{ a.name }}</span>
                <span class="text-xs text-muted-foreground tabular-nums">
                  {{ a.format.toUpperCase() }} · {{ formatBytes(a.bytes) }}<template v-if="dims[a.path]"> · {{ dims[a.path] }}</template>
                </span>
                <span class="flex flex-wrap gap-1">
                  <Badge :variant="usageVariant[usage(a)]">{{ $t(usageLabel(a), { n: a.usedHere.length }) }}</Badge>
                  <Badge v-if="a.isNew" variant="default">{{ $t('New') }}</Badge>
                  <Badge v-if="current === 'all' || current === 'trash' || folderKey(a) !== `rp:${a.folder}`" variant="outline" class="max-w-full">
                    <FolderIcon /><span class="truncate">{{ folderName(folderKey(a)) }}</span>
                  </Badge>
                </span>
              </span>
            </Button>
          </div>
        </div>
        <Empty v-else class="border">
          <EmptyHeader>
            <EmptyTitle>{{ $t(current === 'trash' ? 'Nothing deleted' : 'No assets here') }}</EmptyTitle>
            <EmptyDescription>
              {{ $t(current === 'trash' ? 'Deleted assets appear here and can be restored.' : current.startsWith('c:') ? 'Select assets and use “Move to” to put them in this folder.' : 'Change the folder, the usage or the search.') }}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>

    <!-- Delete confirmation -->
    <AlertDialog v-model:open="confirmDelete">
      <AlertDialogContent class="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{{ $t('Delete {n} assets?', { n: selectedAssets.length }) }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ $t('They are removed from this playground only: rosepetal-ui does not change. You can restore them from “Deleted”.') }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea class="h-72 rounded-md border">
          <ul class="flex flex-col">
            <li v-for="a in selectedAssets" :key="a.path" class="flex items-center gap-3 border-b px-3 py-2 last:border-b-0">
              <div class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-checker">
                <img v-if="!isVideo(a)" :src="a.url" alt="" loading="lazy" class="max-h-full max-w-full object-contain">
                <PlayIcon v-else class="size-4 text-muted-foreground" />
              </div>
              <div class="flex min-w-0 flex-1 flex-col">
                <span class="truncate text-sm font-medium">{{ a.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ folderName(folderKey(a)) }} · {{ $t(usageLabel(a), { n: a.usedHere.length }) }}</span>
              </div>
              <span class="shrink-0 text-xs text-muted-foreground tabular-nums">{{ formatBytes(a.bytes) }}</span>
            </li>
          </ul>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>{{ $t('Cancel') }}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="deleteSelected">
            {{ $t('Delete {n} ({size})', { n: selectedAssets.length, size: formatBytes(selectedBytes) }) }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Create / rename folder -->
    <Dialog v-model:open="folderDialog.open">
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{{ $t(folderDialog.mode === 'rename' ? 'Rename folder' : 'New folder') }}</DialogTitle>
          <DialogDescription class="sr-only">{{ $t('Folder name') }}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id="folder-form" @submit.prevent="submitFolder">
            <Field :data-invalid="folderNameInvalid || undefined">
              <FieldLabel for="folder-name">{{ $t('Name') }}</FieldLabel>
              <Input id="folder-name" v-model="folderDialog.name" :placeholder="$t('E.g. Brand, Icons, To review')" :aria-invalid="folderNameInvalid || undefined" />
            </Field>
          </form>
          <p v-if="folderDialog.moveSelection && selected.size" class="text-sm text-muted-foreground">
            {{ $t('The {n} selected assets will be moved into it.', { n: selected.size }) }}
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="modal" @click="folderDialog.open = false">{{ $t('Cancel') }}</Button>
          <Button size="modal" type="submit" form="folder-form">{{ $t(folderDialog.mode === 'rename' ? 'Save' : 'Create folder') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete folder -->
    <AlertDialog v-model:open="deleteFolderOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ $t('Delete folder “{name}”?', { name: folderToDelete?.name ?? '' }) }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ $t('Its {n} assets go back to their rosepetal-ui folder. No asset is deleted.', { n: folderToDelete?.count ?? 0 }) }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{{ $t('Cancel') }}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="confirmDeleteFolder">{{ $t('Delete folder') }}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Detail -->
    <Dialog v-model:open="detailOpen">
      <DialogContent v-if="detail" class="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle class="truncate">{{ detail.name }}</DialogTitle>
          <DialogDescription class="sr-only">{{ $t('Asset details') }}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div class="flex max-h-80 min-h-40 items-center justify-center rounded-md border p-4" :class="cardBackdrop(detail)">
            <video v-if="isVideo(detail)" :src="detail.url" controls preload="metadata" class="max-h-72 max-w-full" @loadedmetadata="onLoad(detail, $event)" />
            <img v-else :src="detail.url" :alt="detail.name" class="max-h-72 max-w-full object-contain">
          </div>
          <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt class="text-muted-foreground">{{ $t('Path') }}</dt>
            <dd class="flex min-w-0 items-center gap-1">
              <code class="truncate text-xs">rosepetal-ui/{{ detail.path }}</code>
              <Button variant="ghost" size="icon-xs" :aria-label="$t('Copy path')" @click="copyPath(detail.path)">
                <CheckIcon v-if="copied" />
                <CopyIcon v-else />
              </Button>
            </dd>
            <dt class="text-muted-foreground">{{ $t('Folder') }}</dt>
            <dd>{{ folderName(folderKey(detail)) }}<span v-if="folderKey(detail) !== `rp:${detail.folder}`" class="text-muted-foreground"> · {{ $t('originally in {folder}', { folder: detail.folder }) }}</span></dd>
            <dt class="text-muted-foreground">{{ $t('Format') }}</dt>
            <dd class="tabular-nums">{{ detail.format.toUpperCase() }} · {{ formatBytes(detail.bytes) }} ({{ formatNumber(detail.bytes) }} B)<template v-if="dims[detail.path]"> · {{ dims[detail.path] }} px</template></dd>
            <dt class="text-muted-foreground">{{ $t('Recommendation') }}</dt>
            <dd class="flex flex-col gap-1">
              <span class="font-medium">{{ $t(adviceLabel[adviceFor(detail)]) }}</span>
              <span class="text-muted-foreground">{{ $t(adviceHint[adviceFor(detail)]) }}</span>
            </dd>
          </dl>
          <Separator />
          <div class="flex flex-col gap-2 text-sm">
            <span class="font-medium text-heading">{{ $t('Used in the playground') }}</span>
            <ul v-if="detail.usedHere.length" class="flex flex-col gap-1">
              <li v-for="f in detail.usedHere" :key="f" class="flex items-center gap-2 text-muted-foreground">
                <FileIcon class="size-4 shrink-0" />
                <code class="truncate text-xs">{{ f }}</code>
              </li>
            </ul>
            <p v-else class="text-muted-foreground">{{ $t('No file of the playground uses it now.') }}</p>
          </div>
          <Separator />
          <div class="flex flex-col gap-2 text-sm">
            <span class="font-medium text-heading">{{ $t('Used in rosepetal-ui') }}</span>
            <ul v-if="detail.usedIn.length" class="flex flex-col gap-1">
              <li v-for="f in detail.usedIn" :key="f" class="flex items-center gap-2 text-muted-foreground">
                <FileIcon class="size-4 shrink-0" />
                <code class="truncate text-xs">{{ f }}</code>
              </li>
            </ul>
            <p v-else-if="detail.dynamic" class="text-muted-foreground">
              {{ $t('Not referenced by name: this folder is loaded with a template path (per account or sample data).') }}
            </p>
            <p v-else class="text-muted-foreground">
              {{ $t('No file in rosepetal-ui references it. It could probably be deleted.') }}
            </p>
            <p v-if="detail.registered" class="text-xs text-muted-foreground">
              {{ $t('Also listed in src/assets/index.js (require registry).') }}
            </p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  </div>
</template>
