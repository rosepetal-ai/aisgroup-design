<!-- Renders one example of @rosepetal/design by its path (button/01-variants) for the preview pages. Each frame loads only its own example. -->
<script setup>
import { defineAsyncComponent } from 'vue';
import { TooltipProvider } from '@rosepetal/design/ui/tooltip';
const examples = import.meta.glob('@rosepetal/design-src/examples/*/*.vue', { import: 'default' });
const props = defineProps({ example: { type: String, required: true } });
const key = Object.keys(examples).find((p) => p.endsWith(`/examples/${props.example}.vue`));
const component = defineAsyncComponent(examples[key]);
</script>

<!-- An app keeps one TooltipProvider at its root; the preview is that root. -->
<template>
  <TooltipProvider><component :is="component" /></TooltipProvider>
</template>
