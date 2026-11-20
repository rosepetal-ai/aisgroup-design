<!-- A task list, as in shadcn's tasks example: a search, filters whose choices show as chips, the visible columns, the table straight on the page with row selection and row actions, numbered pages. -->
<script setup>
import { computed, ref } from 'vue';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CircleCheckIcon, CircleDashedIcon, CircleIcon, CircleOffIcon, CopyIcon, EllipsisIcon, PencilIcon, PlusIcon, SearchIcon, StarIcon, TagIcon, TimerIcon, Trash2Icon, XIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Badge } from '@aisgroup/design/ui/badge';
import { Button } from '@aisgroup/design/ui/button';
import { DataTable, DataTableFacetedFilter, DataTableViewOptions } from '@aisgroup/design/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@aisgroup/design/ui/input-group';

const statuses = [
  { value: 'backlog', label: 'Backlog', icon: CircleDashedIcon },
  { value: 'todo', label: 'To do', icon: CircleIcon },
  { value: 'in-progress', label: 'In progress', icon: TimerIcon },
  { value: 'done', label: 'Done', icon: CircleCheckIcon },
  { value: 'canceled', label: 'Canceled', icon: CircleOffIcon },
];
const priorities = [
  { value: 'low', label: 'Low', icon: ArrowDownIcon },
  { value: 'medium', label: 'Medium', icon: ArrowRightIcon },
  { value: 'high', label: 'High', icon: ArrowUpIcon },
];
const labels = ['Bug', 'Feature', 'Documentation'];
const tasks = ref([
  ['TASK-1042', 'Bug', 'Recalibrate the line 3 camera after the lens change', 'in-progress', 'high'],
  ['TASK-1041', 'Feature', 'Export rejected images with their defect class', 'todo', 'medium'],
  ['TASK-1039', 'Documentation', 'Write the operator guide for the new reject gate', 'backlog', 'low'],
  ['TASK-1037', 'Bug', 'Fix the duplicated alarm after a PLC reconnect', 'done', 'high'],
  ['TASK-1036', 'Feature', 'Show the model version on the inspection screen', 'in-progress', 'medium'],
  ['TASK-1034', 'Bug', 'Keep the label tracker running after a dataset rename', 'todo', 'high'],
  ['TASK-1031', 'Feature', 'Compare two models on the same validation set', 'backlog', 'medium'],
  ['TASK-1030', 'Documentation', 'Update the installation checklist for blister lines', 'done', 'low'],
  ['TASK-1028', 'Bug', 'Stop the upload from skipping images with long names', 'canceled', 'medium'],
  ['TASK-1025', 'Feature', 'Schedule nightly retraining for the tortilla line', 'todo', 'low'],
  ['TASK-1023', 'Bug', 'Correct the shift totals on the production report', 'in-progress', 'high'],
  ['TASK-1020', 'Documentation', 'Describe the access roles for service partners', 'backlog', 'low'],
  ['TASK-1018', 'Feature', 'Filter the image gallery by reject reason', 'done', 'medium'],
  ['TASK-1016', 'Bug', 'Align the timestamps of camera and PLC events', 'todo', 'medium'],
].map(([id, label, title, status, priority]) => ({ id, label, title, status, priority })));

const columns = [
  { accessorKey: 'id', header: 'Task' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status', filterFn: 'arrHas' },
  { accessorKey: 'priority', header: 'Priority', filterFn: 'arrHas' },
  { id: 'actions', header: () => null, enableSorting: false, enableHiding: false },
];
const byValue = (list, value) => list.find((item) => item.value === value);
const open = computed(() => tasks.value.filter((task) => !['done', 'canceled'].includes(task.status)).length);
const search = ref('');
const selected = ref({});
const filtered = (table) => search.value || ['status', 'priority'].some((id) => table.getColumn(id)?.getFilterValue());
function reset(table) {
  search.value = '';
  for (const id of ['status', 'priority']) table.getColumn(id)?.setFilterValue(undefined);
}
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Tasks" :description="`${open} open tasks`">
      <template #actions>
        <Button><PlusIcon data-icon="inline-start" />New task</Button>
      </template>
      <DataTable v-model:global-filter="search" v-model:row-selection="selected" :columns="columns" :data="tasks" :page-size="8" :get-row-id="(row) => row.id" selectable>
        <template #toolbar="{ table }">
          <div class="flex flex-wrap items-center gap-2">
            <InputGroup class="w-full bg-card sm:max-w-xs">
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput v-model="search" placeholder="Search tasks" aria-label="Search tasks" />
            </InputGroup>
            <DataTableFacetedFilter :column="table.getColumn('status')" title="Status" :options="statuses" />
            <DataTableFacetedFilter :column="table.getColumn('priority')" title="Priority" :options="priorities" />
            <Button v-if="filtered(table)" variant="ghost" @click="reset(table)">Reset<XIcon data-icon="inline-end" /></Button>
            <DataTableViewOptions :table="table" class="bg-card sm:ml-auto" />
          </div>
        </template>
        <template #cell-id="{ getValue }"><span class="text-muted-foreground tabular-nums">{{ getValue() }}</span></template>
        <template #cell-title="{ row }">
          <span class="flex min-w-0 items-center gap-2">
            <Badge variant="outline">{{ row.original.label }}</Badge>
            <span class="max-w-md truncate font-medium">{{ row.original.title }}</span>
          </span>
        </template>
        <template #cell-status="{ getValue }">
          <span class="flex items-center gap-1.5 text-muted-foreground"><component :is="byValue(statuses, getValue()).icon" class="size-4" :class="getValue() === 'done' && 'text-success'" />{{ byValue(statuses, getValue()).label }}</span>
        </template>
        <template #cell-priority="{ getValue }">
          <span class="flex items-center gap-1.5 text-muted-foreground"><component :is="byValue(priorities, getValue()).icon" class="size-4" />{{ byValue(priorities, getValue()).label }}</span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger as-child><Button variant="ghost" size="icon-sm" :aria-label="`Actions for ${row.original.id}`"><EllipsisIcon /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><PencilIcon />Edit</DropdownMenuItem>
                <DropdownMenuItem><CopyIcon />Make a copy</DropdownMenuItem>
                <DropdownMenuItem><StarIcon />Favourite</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger><TagIcon />Label</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup v-model="row.original.label">
                      <DropdownMenuRadioItem v-for="label in labels" :key="label" :value="label">{{ label }}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><Trash2Icon />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
      </DataTable>
    </PageLayout>
  </div>
</template>
