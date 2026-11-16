<!-- Loading content takes the shape of the content: here, item tiles. -->
<script setup>
import { Item, ItemContent, ItemHeader } from '@aisgroup/design/ui/item';
import { Skeleton } from '@aisgroup/design/ui/skeleton';
</script>

<template>
  <div class="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
    <Item v-for="n in 3" :key="n" variant="outline" size="sm">
      <ItemHeader><Skeleton class="aspect-video w-full" /></ItemHeader>
      <ItemContent class="gap-2"><Skeleton class="h-4 w-3/4" /><Skeleton class="h-4 w-1/2" /></ItemContent>
    </Item>
  </div>
</template>
