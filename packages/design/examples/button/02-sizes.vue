<!-- Toolbar and header buttons are the default 36 px; icon-only buttons are square, with a name and a tooltip. -->
<script setup>
import { PlusIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button>Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon-sm" variant="outline" aria-label="Add"><PlusIcon /></Button>
  <Button size="icon" variant="outline" aria-label="Add"><PlusIcon /></Button>
</template>
