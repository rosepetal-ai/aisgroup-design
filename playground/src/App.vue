<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'
import '@/composables/useTone'
import PlaygroundShell from '@/views/PlaygroundShell.vue'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <PlaygroundShell />
  </TooltipProvider>
</template>
