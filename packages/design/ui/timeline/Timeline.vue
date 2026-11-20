<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/utils'

// A vertical list of events, newest or oldest first as the page needs. Each event is a TimelineItem.
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ol data-slot="timeline" :class="cn('flex w-full flex-col', props.class)">
    <slot />
  </ol>
</template>
