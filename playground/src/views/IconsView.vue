<script setup lang="ts">
// Resources › Icons: the icon library the shadcn preset uses (components.json iconLibrary), with the
// icons the playground imports (and from which files) and the whole library to pick new ones. A click
// copies the component name. The library is loaded only when this page opens.
import type { Component } from 'vue'
import { CheckIcon, SearchIcon } from '@lucide/vue'
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import icons from 'virtual:icon-usage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const { t } = useI18n()
const LIBRARY_NAMES: Record<string, string> = { lucide: 'Lucide', tabler: 'Tabler', phosphor: 'Phosphor', radix: 'Radix' }
const libraryName = LIBRARY_NAMES[icons.library] ?? icons.library

// Every icon of the library, once each (the package also exports aliases and Lucide-prefixed names).
const library = shallowRef<{ name: string, component: Component }[]>([])
/** Every exported icon name (aliases too), for the names the source imports. */
const byName = shallowRef(new Map<string, Component>())
const loading = ref(true)
onMounted(async () => {
  const mod = await import('@lucide/vue') as unknown as Record<string, unknown>
  const seen = new Map<unknown, string>()
  const names = new Map<string, Component>()
  for (const [name, value] of Object.entries(mod)) {
    if (!/Icon$/.test(name) || name.startsWith('Lucide') || !value || (typeof value !== 'object' && typeof value !== 'function'))
      continue
    names.set(name, value as Component)
    // Keep the shortest name of a component exported under several (an alias of a renamed icon)
    const prev = seen.get(value)
    if (!prev || name.length < prev.length)
      seen.set(value, name)
  }
  byName.value = names
  library.value = [...seen].map(([component, name]) => ({ name, component: component as Component })).sort((a, b) => a.name.localeCompare(b.name))
  loading.value = false
})
const used = computed(() => Object.entries(icons.usage)
  .map(([name, files]) => ({ name, files, component: byName.value.get(name) }))
  .sort((a, b) => b.files.length - a.files.length || a.name.localeCompare(b.name)))

const tab = ref<'used' | 'all'>('used')
const query = ref('')
const PAGE = 240
const shown = ref(PAGE)
const q = computed(() => query.value.trim().toLowerCase().replace(/[\s-]/g, ''))
const usedList = computed(() => used.value.filter(i => !q.value || i.name.toLowerCase().includes(q.value)))
const allList = computed(() => library.value.filter(i => !q.value || i.name.toLowerCase().includes(q.value)))
const usedNames = computed(() => new Set(Object.keys(icons.usage)))

const copied = ref<string | null>(null)
async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(name)
    copied.value = name
    window.setTimeout(() => copied.value === name && (copied.value = null), 1500)
    toast.success(t('Copied {name}', { name }))
  }
  catch {
    toast.error(t('The browser did not allow copying. Select the text and copy it.'))
  }
}
const label = (name: string) => name.replace(/Icon$/, '')
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-heading">{{ $t('Icons') }}</h1>
      <p class="text-sm text-muted-foreground">
        {{ $t('The icon library of the shadcn preset (iconLibrary in components.json): the icons the interface uses and the whole library. A click copies the name.') }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('Library') }}</CardDescription>
          <CardTitle class="text-xl">{{ libraryName }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('Package') }}</CardDescription>
          <CardTitle class="truncate font-mono text-base">{{ icons.pkg }} {{ icons.version }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('In use') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">{{ used.length }}</CardTitle>
        </CardHeader>
      </Card>
      <Card class="gap-1 py-4">
        <CardHeader class="px-4">
          <CardDescription>{{ $t('In the library') }}</CardDescription>
          <CardTitle class="text-xl tabular-nums">
            <Skeleton v-if="loading" class="h-7 w-16" />
            <template v-else>{{ library.length }}</template>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Tabs v-model="tab" @update:model-value="shown = PAGE">
        <TabsList>
          <TabsTrigger value="used">{{ $t('In use') }}<Badge variant="secondary" class="tabular-nums">{{ usedList.length }}</Badge></TabsTrigger>
          <TabsTrigger value="all">{{ $t('Whole library') }}<Badge variant="secondary" class="tabular-nums">{{ loading ? '…' : allList.length }}</Badge></TabsTrigger>
        </TabsList>
      </Tabs>
      <InputGroup class="w-full sm:w-72">
        <InputGroupAddon><SearchIcon /></InputGroupAddon>
        <InputGroupInput v-model="query" :placeholder="$t('Search icon…')" @update:model-value="shown = PAGE" />
      </InputGroup>
    </div>

    <!-- In use: each icon with the files that import it -->
    <div v-if="tab === 'used'" class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
      <Button
        v-for="i in usedList"
        :key="i.name"
        variant="outline"
        class="h-auto min-w-0 flex-col gap-2 px-2 py-3 font-normal"
        :title="i.files.join('\n')"
        @click="copy(i.name)"
      >
        <CheckIcon v-if="copied === i.name" class="size-6! text-success" />
        <component :is="i.component" v-else-if="i.component" class="size-6!" />
        <Skeleton v-else class="size-6" />
        <span class="w-full truncate text-xs text-heading">{{ label(i.name) }}</span>
        <span class="text-[0.6875rem] text-muted-foreground tabular-nums">{{ $t(i.files.length === 1 ? '1 file' : '{n} files', { n: i.files.length }) }}</span>
      </Button>
    </div>

    <!-- The whole library (a page at a time) -->
    <template v-else>
      <div v-if="loading" class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
        <Skeleton v-for="n in 24" :key="n" class="h-20" />
      </div>
      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
        <Button
          v-for="i in allList.slice(0, shown)"
          :key="i.name"
          variant="outline"
          class="h-auto min-w-0 flex-col gap-2 px-2 py-3 font-normal"
          :class="usedNames.has(i.name) && 'border-action-soft-border bg-action-soft'"
          :title="usedNames.has(i.name) ? $t('In use') : undefined"
          @click="copy(i.name)"
        >
          <CheckIcon v-if="copied === i.name" class="size-6! text-success" />
          <component :is="i.component" v-else class="size-6!" />
          <span class="w-full truncate text-xs">{{ label(i.name) }}</span>
        </Button>
      </div>
      <Button v-if="!loading && allList.length > shown" variant="outline" class="self-center" @click="shown += PAGE">
        {{ $t('Show more ({n} left)', { n: allList.length - shown }) }}
      </Button>
    </template>

    <p v-if="(tab === 'used' ? usedList : allList).length === 0 && !loading" class="py-6 text-center text-sm text-muted-foreground">{{ $t('No icon matches the search.') }}</p>
  </div>
</template>
