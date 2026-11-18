<!-- While the rows load, Skeleton rows in the shape of the table; the header stays. -->
<script setup>
import { DataTable } from '@aisgroup/design/ui/data-table';
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'dataset', header: 'Dataset' },
  { accessorKey: 'images', header: 'Images', meta: { numeric: true } },
];
</script>

<template>
  <DataTable :columns="columns" :data="[]" :page-size="4" loading class="max-w-3xl" />
</template>
