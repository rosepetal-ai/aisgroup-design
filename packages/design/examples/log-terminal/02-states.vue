<!-- Loading, empty and error, with Retry. -->
<script setup>
import LogTerminal from '@aisgroup/design/blocks/LogTerminal.vue';
</script>

<template>
  <div class="grid w-full gap-3 md:grid-cols-3">
    <div class="overflow-hidden rounded-lg border"><LogTerminal loading /></div>
    <div class="overflow-hidden rounded-lg border"><LogTerminal empty-label="No logs yet." /></div>
    <div class="overflow-hidden rounded-lg border"><LogTerminal error="Cannot reach the service." /></div>
  </div>
</template>
