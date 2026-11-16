<!-- How far a task has gone, with the number in words beside it. -->
<script setup>
import { Progress } from '@rosepetal/design/ui/progress';
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <div class="flex justify-between"><span>Uploading</span><span class="text-muted-foreground tabular-nums">62%</span></div>
    <Progress :model-value="62" />
  </div>
</template>
