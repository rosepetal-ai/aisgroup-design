<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/utils'
import { Separator } from '../separator'

// One event: a marker (a dot, or an icon in the marker slot) joined to the next event by a separator line, and its
// content beside it, usually Item's title and description and a muted time.
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <li data-slot="timeline-item" :class="cn('group/timeline-item flex gap-3', props.class)">
    <div class="flex flex-col items-center">
      <span data-slot="timeline-marker" class="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground [&_svg:not([class*=size-])]:size-3.5">
        <slot name="marker"><span class="size-2 rounded-full bg-muted-foreground" /></slot>
      </span>
      <div class="my-1 flex flex-1 justify-center group-last/timeline-item:hidden">
        <Separator orientation="vertical" />
      </div>
    </div>
    <div data-slot="timeline-content" class="flex min-w-0 flex-1 flex-col gap-1 pb-6 group-last/timeline-item:pb-0">
      <slot />
    </div>
  </li>
</template>
