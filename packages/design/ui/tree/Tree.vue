<script setup lang="ts">
import type { TreeRootEmits, TreeRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TreeRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '../../lib/utils'

// reka-ui's tree: arrow keys move and open, Enter or Space selects, type-ahead finds. The slot gets the visible rows
// (flattenItems) to render as TreeItem. For checkboxes: `multiple`, `propagate-select` (a parent selects its children)
// and `bubble-select` (a parent shows its children's state).
const props = defineProps<TreeRootProps<any, any, boolean> & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<TreeRootEmits<any, boolean>>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TreeRoot
    v-slot="slotProps"
    data-slot="tree"
    v-bind="forwarded"
    :class="cn('flex flex-col gap-0.5 text-sm select-none', props.class)"
  >
    <slot v-bind="slotProps" />
  </TreeRoot>
</template>
