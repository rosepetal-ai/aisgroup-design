<!-- One tool out of a few. On a canvas the rail uses spacing, and the pressed tool is primary. -->
<script setup>
import { ref } from 'vue';
import { BrushIcon, EraserIcon, HandIcon, SquareDashedIcon } from '@lucide/vue';
import { ToggleGroup, ToggleGroupItem } from '@aisgroup/design/ui/toggle-group';
const tool = ref('box');
const view = ref('both');
</script>

<template>
  <ToggleGroup v-model="tool" type="single" :spacing="1" class="rounded-md border bg-card p-1 shadow-xs">
    <ToggleGroupItem value="pan" aria-label="Pan"><HandIcon /></ToggleGroupItem>
    <ToggleGroupItem value="box" aria-label="Box"><SquareDashedIcon /></ToggleGroupItem>
    <ToggleGroupItem value="brush" aria-label="Brush"><BrushIcon /></ToggleGroupItem>
    <ToggleGroupItem value="erase" aria-label="Eraser"><EraserIcon /></ToggleGroupItem>
  </ToggleGroup>
  <ToggleGroup v-model="view" type="single" variant="outline">
    <ToggleGroupItem value="raw">Raw</ToggleGroupItem>
    <ToggleGroupItem value="unwrap">Unwrapped</ToggleGroupItem>
    <ToggleGroupItem value="both">Both</ToggleGroupItem>
  </ToggleGroup>
</template>
