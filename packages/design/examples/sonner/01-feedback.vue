<!-- Short feedback after an action, stock Sonner. -->
<script setup>
import { toast } from 'vue-sonner';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <Button variant="outline" @click="toast.success('Dataset saved', { description: 'PCB inspection' })">Success</Button>
  <Button variant="outline" @click="toast.error('The model could not start', { description: 'The controller is offline.' })">Error</Button>
  <Button variant="outline" @click="toast('Copied to the clipboard')">Neutral</Button>
</template>
