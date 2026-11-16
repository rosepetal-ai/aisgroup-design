<!-- A long list: the input searches it, «Create new» is its own row at the top. -->
<script setup>
import { ref } from 'vue';
import { ChevronsUpDownIcon, PlusIcon } from '@lucide/vue';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from '@aisgroup/design/ui/combobox';
const datasets = ['PCB inspection', 'Tortilla line', 'Blister packaging', 'Label packaging', 'Expiry dates', 'Cable harness'];
const value = ref('PCB inspection');
</script>

<template>
  <Combobox v-model="value" open-on-click class="w-72">
    <ComboboxAnchor class="relative">
      <ComboboxInput placeholder="Search datasets" class="pr-8" />
      <ComboboxTrigger class="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground" aria-label="Show datasets"><ChevronsUpDownIcon /></ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxViewport>
        <ComboboxGroup><ComboboxItem value="__new__"><PlusIcon />Create new dataset</ComboboxItem></ComboboxGroup>
        <ComboboxSeparator />
        <ComboboxEmpty>No dataset matches.</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem v-for="d in datasets" :key="d" :value="d">{{ d }}<ComboboxItemIndicator /></ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>
