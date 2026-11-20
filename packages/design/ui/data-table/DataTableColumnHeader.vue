<script setup lang="ts" generic="TData extends RowData, TValue extends CellData">
import type { CellData, Column, RowData } from '@tanstack/vue-table'
import type { HTMLAttributes } from 'vue'
import type { DataTableFeatures } from '.'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'

// A sortable header: a ghost button that sorts ascending, then descending. Number columns align it to the right.
const props = defineProps<{
  column: Column<DataTableFeatures, TData, TValue>
  title: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Button
    v-if="column.getCanSort()"
    data-slot="data-table-column-header"
    variant="ghost"
    size="sm"
    :class="cn(column.columnDef.meta?.numeric ? '-mr-2.5' : '-ml-2.5', props.class)"
    @click="column.toggleSorting(column.getIsSorted() === 'asc')"
  >
    {{ title }}
    <ArrowUpIcon v-if="column.getIsSorted() === 'asc'" data-icon="inline-end" />
    <ArrowDownIcon v-else-if="column.getIsSorted() === 'desc'" data-icon="inline-end" />
    <ArrowUpDownIcon v-else data-icon="inline-end" class="text-muted-foreground" />
  </Button>
  <span v-else data-slot="data-table-column-header" :class="props.class">{{ title }}</span>
</template>
