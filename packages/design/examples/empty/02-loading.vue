<!-- An area that is loading: Empty with a spinner, and progress when it is known. -->
<script setup>
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@aisgroup/design/ui/empty';
import { Progress } from '@aisgroup/design/ui/progress';
import { Spinner } from '@aisgroup/design/ui/spinner';
</script>

<template>
  <Empty class="w-full max-w-xl">
    <EmptyHeader>
      <EmptyMedia><Spinner class="size-6 text-muted-foreground" /></EmptyMedia>
      <EmptyTitle>Getting images</EmptyTitle>
      <EmptyDescription>412 of 1,248</EmptyDescription>
    </EmptyHeader>
    <Progress :model-value="33" class="max-w-xs" />
  </Empty>
</template>
