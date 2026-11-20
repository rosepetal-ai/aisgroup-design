<script setup lang="ts">
import type { VueTable } from '@tanstack/vue-table'
import type { HTMLAttributes } from 'vue'
import type { DataTableFeatures } from '.'
import { Columns3Icon } from '@lucide/vue'
import { computed } from 'vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../dropdown-menu'

// The columns a person can show or hide, named by their header.
const props = withDefaults(defineProps<{
  table: VueTable<DataTableFeatures, any>
  label?: string
  class?: HTMLAttributes['class']
}>(), {
  label: 'Columns',
})

const columns = computed(() => props.table.getAllColumns().filter(column => column.accessorFn !== undefined && column.getCanHide()))
const nameOf = (header: unknown, id: string) => (typeof header === 'string' ? header : id)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button data-slot="data-table-view-options" variant="outline" :class="cn(props.class)">
        <Columns3Icon data-icon="inline-start" />{{ label }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        :model-value="column.getIsVisible()"
        @select.prevent
        @update:model-value="(value) => column.toggleVisibility(!!value)"
      >
        {{ nameOf(column.columnDef.header, column.id) }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
