<!-- An empty container says why, and offers the way out. -->
<script setup>
import { Button } from '@aisgroup/design/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@aisgroup/design/ui/empty';
</script>

<template>
  <Empty class="w-full max-w-xl">
    <EmptyHeader>
      <EmptyTitle>No images match the filters</EmptyTitle>
      <EmptyDescription>Try another tag or division, or clear the filters.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent><Button variant="outline">Clear filters</Button></EmptyContent>
  </Empty>
</template>
