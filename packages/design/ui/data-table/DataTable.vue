<script setup lang="ts" generic="TData extends RowData">
import type { ColumnDef, RowData, RowSelectionState } from '@tanstack/vue-table'
import type { HTMLAttributes } from 'vue'
import { FlexRender, useTable } from '@tanstack/vue-table'
import { SearchXIcon } from '@lucide/vue'
import { computed, h } from 'vue'
import { cn } from '../../lib/utils'
import { Checkbox } from '../checkbox'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../empty'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '../pagination'
import { Skeleton } from '../skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table'
import { dataTableFeatures, type DataTableFeatures } from '.'
import DataTableColumnHeader from './DataTableColumnHeader.vue'

// shadcn-vue's data table as one component: columns and data in; sorting, filters, pages, column visibility and row
// selection inside. A string header becomes a sortable header; `meta: { numeric: true }` right-aligns a number column
// with tabular figures; a `cell-<column id>` slot renders that column's cells. Toolbar, summary and empty are slots.
// ponytail: client-side rows only; for server pages pass manual pagination through TanStack options when an app needs it.
const props = withDefaults(defineProps<{
  columns: ColumnDef<DataTableFeatures, TData, any>[]
  data: TData[]
  loading?: boolean
  selectable?: boolean
  pageSize?: number
  getRowId?: (row: TData, index: number) => string
  labels?: { selectAll?: string, selectRow?: string, empty?: string, previous?: string, next?: string, selected?: string, page?: string }
  class?: HTMLAttributes['class']
}>(), {
  pageSize: 10,
})

const rowSelection = defineModel<RowSelectionState>('rowSelection', { default: () => ({}) })
const globalFilter = defineModel<string>('globalFilter', { default: '' })

const text = computed(() => ({ selectAll: 'Select all', selectRow: 'Select row', empty: 'No results', previous: 'Previous', next: 'Next', selected: '{selected} of {total} selected', page: 'Page {page} of {pages}', ...props.labels }))
const fill = (template: string, values: Record<string, number>) => template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))

const selectColumn: ColumnDef<DataTableFeatures, TData, unknown> = {
  id: 'select',
  header: ({ table }) => h(Checkbox, {
    'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'aria-label': text.value.selectAll,
  }),
  cell: ({ row }) => h(Checkbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'aria-label': text.value.selectRow,
  }),
  enableSorting: false,
  enableHiding: false,
}

const table = useTable({
  features: dataTableFeatures,
  get data() { return props.data },
  get columns() { return props.selectable ? [selectColumn, ...props.columns] : props.columns },
  get enableRowSelection() { return props.selectable },
  get getRowId() { return props.getRowId },
  globalFilterFn: 'includesString',
  initialState: { pagination: { pageIndex: 0, pageSize: props.pageSize } },
  state: {
    get rowSelection() { return rowSelection.value },
    get globalFilter() { return globalFilter.value },
  },
  onRowSelectionChange: (updater) => { rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater },
  onGlobalFilterChange: (updater) => { globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater },
})

const pagination = computed(() => table.atoms.pagination.get())
const visibleColumns = computed(() => table.getVisibleLeafColumns())
const numeric = (meta?: { numeric?: boolean }) => (meta?.numeric ? 'text-right tabular-nums' : '')
const ariaSort = (sorted: false | 'asc' | 'desc') => (sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined)

defineExpose({ table })
</script>

<template>
  <div data-slot="data-table" :class="cn('flex w-full flex-col gap-4', props.class)">
    <slot name="toolbar" :table="table" />
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="numeric(header.column.columnDef.meta)"
            :aria-sort="header.column.getCanSort() ? ariaSort(header.column.getIsSorted()) : undefined"
          >
            <template v-if="!header.isPlaceholder">
              <DataTableColumnHeader v-if="typeof header.column.columnDef.header === 'string'" :column="header.column" :title="header.column.columnDef.header" />
              <FlexRender v-else :header="header" />
            </template>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow v-for="i in pagination.pageSize" :key="i">
            <TableCell v-for="column in visibleColumns" :key="column.id">
              <Skeleton :class="column.columnDef.meta?.numeric ? 'ml-auto h-4 w-12' : 'h-4 w-full max-w-40'" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="table.getRowModel().rows.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() ? 'selected' : undefined">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :class="numeric(cell.column.columnDef.meta)">
              <slot :name="`cell-${cell.column.id}`" v-bind="cell.getContext()">
                <FlexRender :cell="cell" />
              </slot>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else class="hover:bg-transparent">
          <TableCell :colspan="visibleColumns.length" class="p-0">
            <slot name="empty">
              <Empty class="p-10">
                <EmptyHeader>
                  <EmptyMedia><SearchXIcon class="size-6 text-muted-foreground" /></EmptyMedia>
                  <EmptyTitle>{{ text.empty }}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-if="!loading && (selectable || table.getPageCount() > 1)" class="flex items-center justify-between gap-4">
      <span class="text-muted-foreground">
        <slot name="summary" :table="table">
          <template v-if="selectable">{{ fill(text.selected, { selected: table.getFilteredSelectedRowModel().rows.length, total: table.getFilteredRowModel().rows.length }) }}</template>
          <template v-else>{{ fill(text.page, { page: pagination.pageIndex + 1, pages: table.getPageCount() }) }}</template>
        </slot>
      </span>
      <Pagination
        v-if="table.getPageCount() > 1"
        v-slot="{ page }"
        :page="pagination.pageIndex + 1"
        :total="table.getFilteredRowModel().rows.length"
        :items-per-page="pagination.pageSize"
        :sibling-count="1"
        class="mx-0 w-auto"
        @update:page="(page: number) => table.setPageIndex(page - 1)"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious :label="text.previous" />
          <template v-for="(item, i) in items" :key="i">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">{{ item.value }}</PaginationItem>
            <PaginationEllipsis v-else :index="i" />
          </template>
          <PaginationNext :label="text.next" />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
