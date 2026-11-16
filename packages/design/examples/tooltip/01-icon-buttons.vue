<!-- Every icon-only button has a name and a tooltip saying it. -->
<script setup>
import { MaximizeIcon, RotateCcwIcon, ZoomInIcon } from '@lucide/vue';
import { Button } from '@rosepetal/design/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@rosepetal/design/ui/tooltip';
const actions = [{ label: 'Zoom in', icon: ZoomInIcon }, { label: 'Reset zoom', icon: RotateCcwIcon }, { label: 'Full screen', icon: MaximizeIcon }];
</script>

<template>
  <Tooltip v-for="a in actions" :key="a.label">
    <TooltipTrigger as-child><Button variant="ghost" size="icon" :aria-label="a.label"><component :is="a.icon" /></Button></TooltipTrigger>
    <TooltipContent>{{ a.label }}</TooltipContent>
  </Tooltip>
</template>
