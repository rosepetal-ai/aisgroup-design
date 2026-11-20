<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { MultiSelectOption } from '.'
import { CheckIcon } from '@lucide/vue'
import { ComboboxInput } from 'reka-ui'
import { ref } from 'vue'
import { cn } from '../../lib/utils'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxViewport } from '../combobox'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '../tags-input'

// Several values from a list, shown as tags in the field: type to search, Enter or a click adds, Backspace or the
// cross removes. Only listed options can be added (shadcn-vue's tags input with combobox, as one component).
const props = withDefaults(defineProps<{
  id?: string
  options: MultiSelectOption[]
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  placeholder: 'Select',
  emptyText: 'No results',
})

const model = defineModel<string[]>({ default: () => [] })
// Cleared on every pick: reka's own reset does not reach an as-child input.
const search = ref('')
const labelOf = (value: AcceptableValue) => props.options.find(o => o.value === value)?.label ?? String(value)
</script>

<template>
  <Combobox v-model="model" multiple :disabled="disabled" data-slot="multi-select" :class="cn('w-full', props.class)" @update:model-value="search = ''">
    <ComboboxAnchor as-child>
      <TagsInput v-model="model" :display-value="labelOf" :disabled="disabled" class="min-h-9 w-full gap-1.5 px-1.5">
        <TagsInputItem v-for="value in model" :key="value" :value="value">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <ComboboxInput v-model="search" as-child>
          <TagsInputInput :id="id" :placeholder="model.length ? undefined : placeholder" class="min-w-24" @keydown.enter.prevent />
        </ComboboxInput>
      </TagsInput>
    </ComboboxAnchor>
    <ComboboxList align="start">
      <ComboboxViewport>
        <ComboboxEmpty>{{ emptyText }}</ComboboxEmpty>
        <ComboboxItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :text-value="option.label"
        >
          {{ option.label }}
          <ComboboxItemIndicator><CheckIcon /></ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>
