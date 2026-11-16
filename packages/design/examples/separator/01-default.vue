<!-- Between toolbar groups and in menus. Never between sections of a page. -->
<script setup>
import { Separator } from '@aisgroup/design/ui/separator';
</script>

<template>
  <div class="flex h-6 items-center gap-4">
    <span>Zoom</span><Separator orientation="vertical" /><span>Brightness</span><Separator orientation="vertical" /><span>Masks</span>
  </div>
</template>
