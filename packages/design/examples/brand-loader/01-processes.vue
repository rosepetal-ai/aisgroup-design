<!-- Only for long processes running in the background, as the button of an app's processes; a working button or a loading section uses Spinner or Skeleton. -->
<script setup>
import BrandLoader from '@aisgroup/design/blocks/BrandLoader.vue';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <Button variant="outline" size="icon-round" aria-label="Processes in progress: 2">
    <BrandLoader class="size-5" />
  </Button>
</template>
