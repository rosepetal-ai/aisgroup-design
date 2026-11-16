<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/utils'

// Not part of shadcn: the white `p-5` area of .rp-modal between header and buttons.
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="dialog-body"
    :class="cn('flex min-h-0 flex-col gap-4 overflow-y-auto px-5 pt-5 pb-4 last:pb-5', props.class)"
  >
    <slot />
  </div>
</template>
