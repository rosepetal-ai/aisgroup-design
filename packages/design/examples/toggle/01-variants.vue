<!-- One button that stays on or off. -->
<script setup>
import { BoldIcon } from '@lucide/vue';
import { Toggle } from '@aisgroup/design/ui/toggle';
</script>

<template>
  <Toggle aria-label="Bold"><BoldIcon /></Toggle>
  <Toggle variant="outline" aria-label="Bold"><BoldIcon />Bold</Toggle>
  <Toggle variant="outline" size="sm" :default-value="true">Annotations</Toggle>
</template>
