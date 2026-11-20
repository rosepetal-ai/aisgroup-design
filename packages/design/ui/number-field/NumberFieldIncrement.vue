<script setup lang="ts">
import type { NumberFieldIncrementProps } from 'reka-ui'

import type { HTMLAttributes } from 'vue'
import { PlusIcon } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '../../lib/utils'
import { NumberFieldIncrement, useForwardProps } from 'reka-ui'

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldIncrement data-slot="increment" v-bind="forwarded" :class="cn('absolute inset-y-0 right-0 flex items-center px-3 disabled:cursor-not-allowed disabled:opacity-20', props.class)">
    <slot>
      <PlusIcon class="h-4 w-4" />
    </slot>
  </NumberFieldIncrement>
</template>
