<!-- An empty container says why, and offers the way out. -->
<script setup>
import { SearchXIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@aisgroup/design/ui/empty';
</script>

<template>
  <Empty class="w-full max-w-xl border border-dashed">
    <EmptyHeader>
      <EmptyMedia><SearchXIcon class="size-6 text-muted-foreground" /></EmptyMedia>
      <EmptyTitle>No images match the filters</EmptyTitle>
      <EmptyDescription>Try another tag or division, or clear the filters.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent><Button variant="outline">Clear filters</Button></EmptyContent>
  </Empty>
</template>
