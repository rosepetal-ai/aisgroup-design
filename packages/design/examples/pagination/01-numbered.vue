<!-- Under a table: «Page x of y» at the left, numbered pages at the right. -->
<script setup>
import { ref } from 'vue';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@rosepetal/design/ui/pagination';
const page = ref(1);
</script>

<template>
  <div class="flex w-full max-w-2xl items-center justify-between gap-4">
    <span class="text-muted-foreground">Page {{ page }} of 10</span>
    <Pagination v-slot="{ page: current }" v-model:page="page" :total="100" :items-per-page="10" :sibling-count="1" class="mx-0 w-auto">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />
        <template v-for="(item, i) in items" :key="i">
          <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === current">{{ item.value }}</PaginationItem>
          <PaginationEllipsis v-else :index="i" />
        </template>
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
