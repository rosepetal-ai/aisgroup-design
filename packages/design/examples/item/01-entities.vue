<!-- Clickable entities are outline items: image first, title, muted lines, the state in the footer. -->
<script setup>
import { CircleCheckIcon, ClockIcon } from '@lucide/vue';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@aisgroup/design/ui/item';
const datasets = [
  { name: 'PCB inspection', meta: '1,248 images, 3 tags', image: `${import.meta.env.BASE_URL}samples/electronics.webp`, done: true },
  { name: 'Tortilla line', meta: '842 images, 2 tags', image: `${import.meta.env.BASE_URL}samples/food.webp`, done: false },
];
</script>

<template>
  <div class="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
    <Item v-for="d in datasets" :key="d.name" variant="outline" size="sm" as-child>
      <a href="#">
        <ItemHeader><img :src="d.image" alt="" class="aspect-video w-full rounded-sm bg-muted object-cover" /></ItemHeader>
        <ItemContent>
          <ItemTitle>{{ d.name }}</ItemTitle>
          <ItemDescription>{{ d.meta }}</ItemDescription>
        </ItemContent>
        <ItemFooter class="text-muted-foreground">
          <span v-if="d.done" class="flex items-center gap-1.5"><CircleCheckIcon class="size-4 text-success" />Labeled</span>
          <span v-else class="flex items-center gap-1.5"><ClockIcon class="size-4" />Pending</span>
        </ItemFooter>
      </a>
    </Item>
  </div>
</template>
