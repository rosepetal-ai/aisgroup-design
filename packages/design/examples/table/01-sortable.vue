<!-- Sortable headers are ghost buttons; status is an icon and a word; row actions at the end. -->
<script setup>
import { ArrowUpDownIcon, CircleCheckIcon, CircleXIcon, EllipsisIcon, LoaderCircleIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@aisgroup/design/ui/table';
const rows = [
  { name: 'm-inspection-03', dataset: 'PCB inspection', date: '06/10/2026', status: 'Finished', icon: CircleCheckIcon, tone: 'text-success' },
  { name: 'm-inspection-04', dataset: 'PCB inspection', date: '07/10/2026', status: 'Training', icon: LoaderCircleIcon, tone: 'animate-spin' },
  { name: 'm-food-01', dataset: 'Tortilla line', date: '01/10/2026', status: 'Failed', icon: CircleXIcon, tone: 'text-destructive' },
];
</script>

<template>
  <Table class="max-w-3xl">
    <TableHeader>
      <TableRow>
        <TableHead><Button variant="ghost" size="sm" class="-ml-3">Name<ArrowUpDownIcon data-icon="inline-end" /></Button></TableHead>
        <TableHead>Dataset</TableHead>
        <TableHead><Button variant="ghost" size="sm" class="-ml-3">Date<ArrowUpDownIcon data-icon="inline-end" /></Button></TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="w-10"><span class="sr-only">Actions</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="r in rows" :key="r.name">
        <TableCell class="font-medium">{{ r.name }}</TableCell>
        <TableCell>{{ r.dataset }}</TableCell>
        <TableCell class="tabular-nums">{{ r.date }}</TableCell>
        <TableCell><span class="flex items-center gap-1.5 text-muted-foreground"><component :is="r.icon" class="size-4" :class="r.tone" />{{ r.status }}</span></TableCell>
        <TableCell><Button variant="ghost" size="icon-sm" :aria-label="`Actions for ${r.name}`"><EllipsisIcon /></Button></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
