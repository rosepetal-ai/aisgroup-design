<!-- No rows: the empty slot says why and offers the way out. -->
<script setup>
import { PlusIcon, BoxIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { DataTable } from '@aisgroup/design/ui/data-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@aisgroup/design/ui/empty';
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'dataset', header: 'Dataset' },
  { accessorKey: 'images', header: 'Images', meta: { numeric: true } },
];
</script>

<template>
  <DataTable :columns="columns" :data="[]" class="max-w-3xl">
    <template #empty>
      <Empty class="p-10">
        <EmptyHeader>
          <EmptyMedia><BoxIcon class="size-6 text-muted-foreground" /></EmptyMedia>
          <EmptyTitle>No models yet</EmptyTitle>
          <EmptyDescription>Train a model from a dataset with labelled images.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button><PlusIcon data-icon="inline-start" />New model</Button></EmptyContent>
      </Empty>
    </template>
  </DataTable>
</template>
