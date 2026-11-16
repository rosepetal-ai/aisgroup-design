<!-- A region with its own scroll. -->
<script setup>
import { ScrollArea } from '@aisgroup/design/ui/scroll-area';
</script>

<template>
  <ScrollArea class="h-48 w-56 rounded-md border p-3">
    <p v-for="n in 30" :key="n" class="py-1 text-sm">Image {{ n }}</p>
  </ScrollArea>
</template>
