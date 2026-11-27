<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui'
import { cn } from '../../lib/utils'

// `timeline`: a player's time line (PlayerBar): a 4 px track and a 4 × 16 px bar for the thumb, square, never a round
// thumb (guide, Live animations, the explainer's control bar).
const props = defineProps<SliderRootProps & {
  class?: HTMLAttributes['class']
  variant?: 'default' | 'timeline'
  /** Attributes for the thumb (the focusable slider): its aria-label and aria-valuetext. */
  thumbAttrs?: Record<string, string>
}>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'thumbAttrs')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SliderRoot
    v-slot="{ modelValue }"
    data-slot="slider"
    :data-variant="props.variant ?? 'default'"
    :data-vertical="props.orientation === 'vertical' ? '' : undefined"
    :class="cn(
      'data-vertical:min-h-40 relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col',
      props.variant === 'timeline' && 'h-9',
      props.class,
    )"
    v-bind="forwarded"
  >
    <SliderTrack
      data-slot="slider-track"
      :data-horizontal="props.orientation !== 'vertical' ? '' : undefined"
      :data-vertical="props.orientation === 'vertical' ? '' : undefined"
      :class="cn(
        'bg-primary/15 relative grow overflow-hidden data-horizontal:w-full data-vertical:h-full',
        props.variant === 'timeline' ? 'rounded-none data-horizontal:h-1 data-vertical:w-1' : 'rounded-full data-horizontal:h-1.5 data-vertical:w-1.5',
      )"
    >
      <SliderRange
        data-slot="slider-range"
        :data-horizontal="props.orientation !== 'vertical' ? '' : undefined"
        :data-vertical="props.orientation === 'vertical' ? '' : undefined"
        class="bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full"
      />
    </SliderTrack>

    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      v-bind="props.thumbAttrs"
      data-slot="slider-thumb"
      :data-vertical="props.orientation === 'vertical' ? '' : undefined"
      :class="cn(
        'ring-ring/15 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50',
        props.variant === 'timeline' ? 'h-4 w-1 rounded-none bg-primary' : 'border-primary size-4 rounded-full border bg-control-thumb shadow-sm',
      )"
    />
  </SliderRoot>
</template>
