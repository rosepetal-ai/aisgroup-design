import type { CellData, RowData, TableFeatures } from '@tanstack/vue-table'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrHas,
  filterFn_arrIncludes,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_weakEquals,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table'

export { default as DataTable } from './DataTable.vue'
export { default as DataTableColumnHeader } from './DataTableColumnHeader.vue'
export { default as DataTableFacetedFilter } from './DataTableFacetedFilter.vue'
export { default as DataTableViewOptions } from './DataTableViewOptions.vue'

// What every DataTable can do (TanStack Table v9 registers features one by one). Columns pick their filter and sort
// functions by these names, or leave them on 'auto'.
export const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
    equals: filterFn_equals,
    weakEquals: filterFn_weakEquals,
    // A faceted filter's choice: the row's value is one of the chosen values.
    arrHas: filterFn_arrHas,
    arrIncludes: filterFn_arrIncludes,
    arrIncludesSome: filterFn_arrIncludesSome,
    inNumberRange: filterFn_inNumberRange,
    inDateRange: filterFn_inDateRange,
  },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime, basic: sortFn_basic },
})

export type DataTableFeatures = typeof dataTableFeatures

declare module '@tanstack/vue-table' {
  interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
    /** A number column: header and cells right-aligned, with tabular figures. */
    numeric?: boolean
  }
}
