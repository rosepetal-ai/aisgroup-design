<script setup lang="ts" generic="TData extends RowData">
import type { Column, RowData } from '@tanstack/vue-table'
import type { Component, HTMLAttributes } from 'vue'
import { CirclePlusIcon } from '@lucide/vue'
import { computed } from 'vue'
import { cn } from '../../lib/utils'
import { Badge } from '../badge'
import { Button } from '../button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Separator } from '../separator'
import type { DataTableFeatures } from '.'

// A filter in a data table's toolbar, as in shadcn's tasks example: a dashed button that opens a searchable list of
// options with their row counts; the chosen options show as chips on the button. The column filters with 'arrHas'.
const props = defineProps<{
  column?: Column<DataTableFeatures, TData, unknown>
  title: string
  options: { label: string, value: string, icon?: Component }[]
  labels?: { selected?: string, empty?: string, clear?: string }
  class?: HTMLAttributes['class']
}>()

const text = computed(() => ({ selected: '{count} selected', empty: 'No results', clear: 'Clear filter', ...props.labels }))
const facets = computed(() => props.column?.getFacetedUniqueValues())
const selected = computed(() => (props.column?.getFilterValue() as string[] | undefined) ?? [])
const chosen = computed(() => props.options.filter(option => selected.value.includes(option.value)))

function update(values: unknown) {
  const list = (values as string[]) ?? []
  props.column?.setFilterValue(list.length ? list : undefined)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button data-slot="data-table-faceted-filter" variant="outline" :class="cn('border-dashed bg-card', props.class)">
        <CirclePlusIcon data-icon="inline-start" />{{ title }}
        <template v-if="chosen.length">
          <Separator orientation="vertical" class="mx-0.5 data-[orientation=vertical]:h-4" />
          <Badge variant="secondary" class="lg:hidden">{{ chosen.length }}</Badge>
          <span class="hidden gap-1 lg:flex">
            <Badge v-if="chosen.length > 2" variant="secondary">{{ text.selected.replace('{count}', String(chosen.length)) }}</Badge>
            <template v-else>
              <Badge v-for="option in chosen" :key="option.value" variant="secondary">{{ option.label }}</Badge>
            </template>
          </span>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56 p-0" align="start">
      <Command multiple :model-value="selected" @update:model-value="update">
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>{{ text.empty }}</CommandEmpty>
          <CommandGroup>
            <CommandItem v-for="option in options" :key="option.value" :value="option.value">
              <component :is="option.icon" v-if="option.icon" class="text-muted-foreground" />
              <span class="flex-1 truncate">{{ option.label }}</span>
              <span v-if="facets?.get(option.value)" class="text-muted-foreground tabular-nums">{{ facets.get(option.value) }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <template v-if="chosen.length">
          <CommandSeparator />
          <Button variant="ghost" class="m-1 w-[calc(100%-0.5rem)]" @click="update([])">{{ text.clear }}</Button>
        </template>
      </Command>
    </PopoverContent>
  </Popover>
</template>
