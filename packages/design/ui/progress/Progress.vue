<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import type { ProgressIndicatorVariants } from '.'
import { cn } from '../../lib/utils'
import { progressIndicatorVariants } from '.'

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes['class'], variant?: ProgressIndicatorVariants['variant'] }>(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'variant')
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-primary/15 h-1.5 rounded-full relative flex w-full items-center overflow-x-hidden',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      :class="progressIndicatorVariants({ variant })"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
