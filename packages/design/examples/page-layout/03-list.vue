<!-- A list page: the toolbar and the table straight on the page, numbered pages under it. A role is a word; a status is an icon and a word. -->
<script setup>
import { ref } from 'vue';
import { BanIcon, ClockIcon, EllipsisIcon, PencilIcon, PlusIcon, SearchIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { DataTable } from '@aisgroup/design/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@aisgroup/design/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@aisgroup/design/ui/select';
import { StatusLabel } from '@aisgroup/design/ui/status-label';

const statuses = { active: { label: 'Active', tone: 'success' }, pending: { label: 'Pending', icon: ClockIcon }, disabled: { label: 'Disabled', icon: BanIcon } };
const roles = ['Owner', 'Administrator', 'HR administrator', 'Worker', 'Viewer'];
const users = [
  ['Laura Vidal', 'laura.vidal@example.com', 'Owner', 'active'], ['Marc Puig', 'marc.puig@example.com', 'Administrator', 'active'],
  ['Núria Soler', 'nuria.soler@example.com', 'HR administrator', 'active'], ['Jordi Ferrer', 'jordi.ferrer@example.com', 'Worker', 'active'],
  ['Anna Roca', 'anna.roca@example.com', 'Worker', 'pending'], ['Pau Serra', 'pau.serra@example.com', 'Viewer', 'active'],
  ['Clara Mas', 'clara.mas@example.com', 'Worker', 'disabled'], ['Oriol Font', 'oriol.font@example.com', 'Worker', 'active'],
].map(([name, email, role, status]) => ({ name, email, role, status }));
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role', filterFn: 'equalsString' },
  { accessorKey: 'status', header: 'Status', filterFn: 'equalsString' },
  { id: 'actions', header: () => null, enableSorting: false },
];
const search = ref('');
const role = ref('all');
const status = ref('all');
const filter = (table, column, value) => table.getColumn(column)?.setFilterValue(value === 'all' ? undefined : value);
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Users" description="8 people can sign in">
      <template #actions>
        <Button><PlusIcon data-icon="inline-start" />Invite user</Button>
      </template>
      <DataTable v-model:global-filter="search" :columns="columns" :data="users" :page-size="5" :get-row-id="(row) => row.email">
        <template #toolbar="{ table }">
          <div class="flex flex-wrap items-center gap-2">
            <InputGroup class="w-full bg-card sm:max-w-xs">
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput v-model="search" placeholder="Search users" aria-label="Search users" />
            </InputGroup>
            <Select v-model="role" @update:model-value="(v) => filter(table, 'role', v)">
              <SelectTrigger class="min-w-0 flex-1 bg-card sm:w-48 sm:flex-none" aria-label="Role"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem v-for="r in roles" :key="r" :value="r">{{ r }}</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="status" @update:model-value="(v) => filter(table, 'status', v)">
              <SelectTrigger class="min-w-0 flex-1 bg-card sm:w-40 sm:flex-none" aria-label="Status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem v-for="(s, key) in statuses" :key="key" :value="key">{{ s.label }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </template>
        <template #cell-name="{ getValue }"><span class="font-medium">{{ getValue() }}</span></template>
        <template #cell-email="{ getValue }"><span class="text-muted-foreground">{{ getValue() }}</span></template>
        <template #cell-status="{ getValue }">
          <StatusLabel :tone="statuses[getValue()].tone" :icon="statuses[getValue()].icon">{{ statuses[getValue()].label }}</StatusLabel>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger as-child><Button variant="ghost" size="icon-sm" :aria-label="`Actions for ${row.original.name}`"><EllipsisIcon /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><PencilIcon />Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><BanIcon />Disable</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
      </DataTable>
    </PageLayout>
  </div>
</template>
