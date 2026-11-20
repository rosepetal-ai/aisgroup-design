<!-- Choosing several branches: a parent's checkbox follows its children, and checking it checks them all. -->
<script setup>
import { ref } from 'vue';
import { Tree, TreeItem } from '@aisgroup/design/ui/tree';
const items = [
  { id: 'line-1', title: 'Line 1', children: [{ id: 'cam-1', title: 'Camera 1' }, { id: 'cam-2', title: 'Camera 2' }] },
  { id: 'line-2', title: 'Line 2', children: [{ id: 'cam-3', title: 'Camera 3' }, { id: 'cam-4', title: 'Camera 4' }, { id: 'cam-5', title: 'Camera 5' }] },
];
const checked = ref([items[0].children[0]]);
</script>

<template>
  <Tree v-slot="{ flattenItems }" v-model="checked" :items="items" :get-key="(item) => item.id" :default-expanded="['line-1', 'line-2']" multiple propagate-select bubble-select class="w-full max-w-xs">
    <TreeItem v-for="item in flattenItems" :key="item._id" v-bind="item.bind" :has-children="item.hasChildren" checkbox>
      {{ item.value.title }}
    </TreeItem>
  </Tree>
</template>
