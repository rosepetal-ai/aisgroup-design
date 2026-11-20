<!-- Nested folders as list rows: a click or Enter selects and opens; the arrow keys move, open and close. -->
<script setup>
import { ref } from 'vue';
import { FolderIcon, FolderOpenIcon, ImageIcon } from '@lucide/vue';
import { Tree, TreeItem } from '@aisgroup/design/ui/tree';
const items = [
  { id: 'pcb', title: 'PCB inspection', children: [
    { id: 'pcb-ok', title: 'Normal', children: [{ id: 'pcb-0412', title: 'board-0412.png' }, { id: 'pcb-0413', title: 'board-0413.png' }] },
    { id: 'pcb-nok', title: 'Anomaly', children: [{ id: 'pcb-0398', title: 'board-0398.png' }] },
  ] },
  { id: 'food', title: 'Tortilla line', children: [{ id: 'food-0021', title: 'tortilla-0021.png' }] },
];
const selected = ref();
</script>

<template>
  <Tree v-slot="{ flattenItems }" v-model="selected" :items="items" :get-key="(item) => item.id" :default-expanded="['pcb', 'pcb-ok']" class="w-full max-w-xs">
    <TreeItem v-for="item in flattenItems" :key="item._id" v-slot="{ isExpanded }" v-bind="item.bind" :has-children="item.hasChildren">
      <component :is="item.hasChildren ? (isExpanded ? FolderOpenIcon : FolderIcon) : ImageIcon" class="text-muted-foreground" />
      <span class="truncate">{{ item.value.title }}</span>
    </TreeItem>
  </Tree>
</template>
