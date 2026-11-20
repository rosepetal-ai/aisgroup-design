<!-- Clickable entities are outline items: image first, title, muted lines, the state in the footer. -->
<script setup>
import { ClockIcon } from '@lucide/vue';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@aisgroup/design/ui/item';
import { StatusLabel } from '@aisgroup/design/ui/status-label';
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
          <StatusLabel v-if="d.done" tone="success">Labelled</StatusLabel>
          <StatusLabel v-else :icon="ClockIcon">Pending</StatusLabel>
        </ItemFooter>
      </a>
    </Item>
  </div>
</template>
