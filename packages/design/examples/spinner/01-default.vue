<!-- Inline, in the button that is working; or filling an empty area. -->
<script setup>
import { Spinner } from '@aisgroup/design/ui/spinner';
</script>

<template>
  <Spinner />
  <Spinner class="size-6" />
  <span class="flex items-center gap-2 text-muted-foreground"><Spinner />Training</span>
</template>
