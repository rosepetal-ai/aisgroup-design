<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="dialog-header"
    :class="cn('bg-muted border-b flex shrink-0 flex-col gap-0.5 p-4 pr-14', props.class)"
  >
    <slot />
  </div>
</template>
