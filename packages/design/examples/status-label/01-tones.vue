<!-- Each tone with its icon: the word says the status, the icon's colour only helps to scan. A status may bring its own icon. -->
<script setup>
import { ClockIcon } from '@lucide/vue';
import { StatusLabel } from '@aisgroup/design/ui/status-label';
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
    <StatusLabel tone="success">Finished</StatusLabel>
    <StatusLabel tone="running">Training</StatusLabel>
    <StatusLabel tone="neutral" :icon="ClockIcon">Pending</StatusLabel>
    <StatusLabel tone="warning">Expires soon</StatusLabel>
    <StatusLabel tone="destructive">Failed</StatusLabel>
    <StatusLabel tone="info">Updated</StatusLabel>
  </div>
</template>
