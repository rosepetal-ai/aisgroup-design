<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../lib/utils'

// The Rosepetal «o» turning, the one motion the mark allows: a long process running in the background (guide, Logos: App marks). Anything else that loads uses Spinner or Skeleton.
// The path is the official rosepetal-mark-*.svg; blue on light, white on dark; still under reduced motion.
const props = defineProps<{
  label?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <svg
    viewBox="8.88 1 20.82 20.82"
    fill="currentColor"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label"
    :aria-hidden="props.label ? undefined : 'true'"
    :class="cn('size-6 shrink-0 animate-spin text-brand animation-duration-[3s] motion-reduce:animate-none dark:text-brand-foreground', props.class)"
  >
    <path d="m19.29 1a10.41 10.41 0 1 0 10.41 10.45 10.41 10.41 0 0 0 -10.41-10.45m4.63 6.45a2.33 2.33 0 0 1 -.38 0 5.83 5.83 0 1 1 -4.25-1.84 5.75 5.75 0 0 1 2.86.75 1.94 1.94 0 0 1 -.15-.83 2 2 0 1 1 2 2" />
  </svg>
</template>
