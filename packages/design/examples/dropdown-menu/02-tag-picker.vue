<!-- Changing the tag of a row: a ghost button with the swatch, name and chevron opens a radio list. -->
<script setup>
import { ref } from 'vue';
import { ChevronDownIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';
const tags = [{ id: 'component', name: 'Component', color: 'var(--chart-1)' }, { id: 'defect', name: 'Defect', color: 'var(--chart-2)' }, { id: 'connector', name: 'Connector', color: 'var(--chart-3)' }];
const tag = ref('defect');
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        <span class="size-3 shrink-0 rounded-sm" :style="{ background: tags.find(t => t.id === tag).color }" />
        {{ tags.find(t => t.id === tag).name }}<ChevronDownIcon data-icon="inline-end" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup v-model="tag">
        <DropdownMenuRadioItem v-for="t in tags" :key="t.id" :value="t.id"><span class="size-3 shrink-0 rounded-sm" :style="{ background: t.color }" />{{ t.name }}</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
