<!-- Columns and data in: sortable headers, a search and a status filter in the toolbar, column visibility, row selection and numbered pages. Number columns align right; the name takes the free width and truncates, and the dataset and images columns appear when the table is wide enough, so it never scrolls sideways. -->
<script setup>
import { ref } from 'vue';
import { SearchIcon } from '@lucide/vue';
import { DataTable, DataTableViewOptions } from '@aisgroup/design/ui/data-table';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@aisgroup/design/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@aisgroup/design/ui/select';
import { StatusLabel } from '@aisgroup/design/ui/status-label';
const statuses = { finished: { label: 'Finished', tone: 'success' }, training: { label: 'Training', tone: 'running' }, failed: { label: 'Failed', tone: 'destructive' } };
const models = [
  ['m-inspection-01', 'PCB inspection', 'finished', 4210, 97.4], ['m-inspection-02', 'PCB inspection', 'finished', 4210, 98.1],
  ['m-inspection-03', 'PCB inspection', 'training', 5120, null], ['m-food-01', 'Tortilla line', 'failed', 1890, null],
  ['m-food-02', 'Tortilla line', 'finished', 2240, 95.2], ['m-blister-01', 'Blister packaging', 'finished', 3075, 99.0],
  ['m-label-01', 'Label packaging', 'finished', 2680, 96.7], ['m-label-02', 'Label packaging', 'training', 2930, null],
  ['m-expiry-01', 'Expiry dates', 'finished', 1460, 93.8], ['m-cable-01', 'Cable harness', 'finished', 3810, 97.9],
  ['m-cable-02', 'Cable harness', 'failed', 3810, null], ['m-blister-02', 'Blister packaging', 'finished', 3075, 99.3],
].map(([name, dataset, status, images, accuracy]) => ({ name, dataset, status, images, accuracy }));
const columns = [
  { accessorKey: 'name', header: 'Name', meta: { primary: true } },
  { accessorKey: 'dataset', header: 'Dataset', meta: { showFrom: 'xl' } },
  { accessorKey: 'status', header: 'Status', filterFn: 'equalsString' },
  { accessorKey: 'images', header: 'Images', meta: { numeric: true, showFrom: 'lg' }, cell: ({ getValue }) => getValue().toLocaleString('en-GB') },
  { accessorKey: 'accuracy', header: 'Accuracy', meta: { numeric: true }, cell: ({ getValue }) => (getValue() == null ? '' : `${getValue().toFixed(1)}%`) },
];
const search = ref('');
const selected = ref({});
const status = ref('all');
</script>

<template>
  <DataTable v-model:global-filter="search" v-model:row-selection="selected" :columns="columns" :data="models" :page-size="5" :get-row-id="(row) => row.name" selectable class="max-w-4xl">
    <template #toolbar="{ table }">
      <div class="flex items-center gap-2">
        <InputGroup class="max-w-xs">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput v-model="search" placeholder="Search models" aria-label="Search models" />
        </InputGroup>
        <Select v-model="status" @update:model-value="(v) => table.getColumn('status')?.setFilterValue(v === 'all' ? undefined : v)">
          <SelectTrigger class="w-40" aria-label="Status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem v-for="(s, key) in statuses" :key="key" :value="key">{{ s.label }}</SelectItem>
          </SelectContent>
        </Select>
        <DataTableViewOptions :table="table" class="ml-auto" />
      </div>
    </template>
    <template #cell-name="{ getValue }"><span class="font-medium">{{ getValue() }}</span></template>
    <template #cell-status="{ getValue }">
      <StatusLabel :tone="statuses[getValue()].tone">{{ statuses[getValue()].label }}</StatusLabel>
    </template>
  </DataTable>
</template>
