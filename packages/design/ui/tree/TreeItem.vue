<script setup lang="ts">
import type { TreeItemEmits, TreeItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { ChevronRightIcon } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import { TreeItem, useForwardPropsEmits } from 'reka-ui'
import { cn } from '../../lib/utils'
import { Checkbox } from '../checkbox'

// One row of a tree, as a list row: indented by its level, a chevron when it has children, the selected row in muted
// and medium weight. `checkbox` shows its selection as a checkbox (with Tree's multiple, propagate-select and bubble-select).
const props = defineProps<TreeItemProps<any> & {
  hasChildren?: boolean
  checkbox?: boolean
  class?: HTMLAttributes['class']
}>()
const emits = defineEmits<TreeItemEmits<any>>()

const delegatedProps = reactiveOmit(props, 'class', 'hasChildren', 'checkbox')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TreeItem
    v-slot="slotProps"
    data-slot="tree-item"
    v-bind="forwarded"
    :value="value"
    :style="{ paddingLeft: `calc(${level - 1} * 1.25rem + 0.5rem)` }"
    :class="cn(
      'flex h-9 cursor-pointer items-center gap-2 rounded-md pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/15 data-[selected]:bg-muted data-[selected]:font-medium data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
      checkbox && 'data-[selected]:bg-transparent data-[selected]:font-normal hover:data-[selected]:bg-muted',
      props.class,
    )"
  >
    <ChevronRightIcon v-if="hasChildren" class="text-muted-foreground transition-transform" :class="slotProps.isExpanded && 'rotate-90'" />
    <span v-else class="size-4 shrink-0" />
    <Checkbox
      v-if="checkbox"
      :model-value="slotProps.isIndeterminate ? 'indeterminate' : slotProps.isSelected"
      tabindex="-1"
      @click.stop
      @update:model-value="slotProps.handleSelect"
    />
    <slot v-bind="slotProps" />
  </TreeItem>
</template>
