<!-- Icons are 16 px, before the label for actions and after it for menus. -->
<script setup>
import { ChevronDownIcon, DownloadIcon, PlusIcon } from '@lucide/vue';
import { Button } from '@rosepetal/design/ui/button';
</script>

<template>
  <Button><PlusIcon data-icon="inline-start" />New dataset</Button>
  <Button variant="outline"><DownloadIcon data-icon="inline-start" />Download</Button>
  <Button variant="outline">Details<ChevronDownIcon data-icon="inline-end" /></Button>
</template>
