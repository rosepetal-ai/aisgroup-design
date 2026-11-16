<!-- The app gives the lines. It follows new ones unless you have scrolled up to read. -->
<script setup>
import { ref } from 'vue';
import LogTerminal from '@rosepetal/design/blocks/LogTerminal.vue';
import { Button } from '@rosepetal/design/ui/button';

const lines = ref([
  { time: '10:02:11', text: 'Starting training' },
  { text: 'Loading dataset: 620 images' },
  { time: '10:02:14', text: 'Service restarted', highlight: true },
  { time: '10:02:20', text: 'CUDA out of memory', error: true },
]);
const add = () => lines.value.push({ time: new Date().toLocaleTimeString('en-GB'), text: `epoch ${lines.value.length}` });
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="overflow-hidden rounded-lg border"><LogTerminal class="max-h-48" :lines="lines" /></div>
    <Button variant="outline" class="w-fit" @click="add">Add a line</Button>
  </div>
</template>
