<script setup lang="ts">
import type { SeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Separator } from 'reka-ui'
import { cn } from '../../lib/utils'

const props = withDefaults(defineProps<
  SeparatorProps & { class?: HTMLAttributes['class'] }
>(), {
  orientation: 'horizontal',
  decorative: true,
})

const delegatedProps = reactiveOmit(props, 'class')
// Plain size classes, not `data-[orientation=…]:` ones: those win over any class passed in by specificity, so
// `mx-2 w-auto` stayed full width and ran into the border, and `h-4` kept `self-stretch` and sat at the top of a
// button. As plain classes `cn` merges them: `w-auto` replaces `w-full`, `h-4 self-center` centres a short divider.
</script>

<template>
  <Separator
    data-slot="separator"
    v-bind="delegatedProps"
    :class="
      cn(
        'shrink-0 bg-border',
        props.orientation === 'vertical' ? 'w-px self-stretch' : 'h-px w-full',
        props.class,
      )
    "
  />
</template>
