<script setup lang="ts">
import type { PaginationPrevProps } from 'reka-ui'

import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '../button'
import { ChevronLeftIcon } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import { PaginationPrev, useForwardProps } from 'reka-ui'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../button'

const props = withDefaults(defineProps<PaginationPrevProps & {
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  label?: string
}>(), {
  size: 'default',
  label: 'Previous',
})

const delegatedProps = reactiveOmit(props, 'class', 'size', 'label')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'pl-2!', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon data-icon="inline-start" class="cn-rtl-flip" />
      <span class="hidden sm:block">{{ label }}</span>
    </slot>
  </PaginationPrev>
</template>
