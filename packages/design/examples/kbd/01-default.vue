<!-- Shortcuts, in tooltips and help. -->
<script setup>
import { ArrowRightIcon } from '@lucide/vue';
import { Kbd, KbdGroup } from '@rosepetal/design/ui/kbd';
</script>

<template>
  <p class="flex items-center gap-2">Next image <KbdGroup><Kbd><ArrowRightIcon /><span class="sr-only">Right arrow</span></Kbd></KbdGroup></p>
  <p class="flex items-center gap-2">Save <KbdGroup><Kbd>Ctrl</Kbd><Kbd>S</Kbd></KbdGroup></p>
</template>
