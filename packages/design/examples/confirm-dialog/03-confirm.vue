<!-- Not only for deleting: another variant, and the action focused so Enter confirms. -->
<script setup>
import { ref } from 'vue';
import ConfirmDialog from '@aisgroup/design/blocks/ConfirmDialog.vue';
import { Button } from '@aisgroup/design/ui/button';

const open = ref(true);
const wait = () => new Promise(resolve => setTimeout(resolve, 1200));
</script>

<template>
  <Button variant="outline" @click="open = true">Restart Node-RED</Button>
  <ConfirmDialog
    v-if="open"
    title="Restart Node-RED"
    confirm-label="Restart"
    loading-label="Restarting..."
    variant="default"
    focus-confirm
    :action="wait"
    @close="open = false"
    @done="open = false"
  >
    <p class="text-sm">The panels will stop for a few seconds.</p>
  </ConfirmDialog>
</template>
