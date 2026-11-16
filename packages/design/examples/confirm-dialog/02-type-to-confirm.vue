<!-- For what cannot be recovered: the action stays disabled until the text matches. -->
<script setup>
import { ref } from 'vue';
import ConfirmDialog from '@rosepetal/design/blocks/ConfirmDialog.vue';
import { Button } from '@rosepetal/design/ui/button';

const open = ref(true);
const wait = () => new Promise(resolve => setTimeout(resolve, 1200));
</script>

<template>
  <Button variant="outline" @click="open = true">Delete dataset</Button>
  <ConfirmDialog
    v-if="open"
    title="Delete dataset"
    confirm-label="Delete"
    loading-label="Deleting..."
    confirm-text="tapones-linea-3"
    confirm-prompt="To confirm deletion, please type the dataset ID:"
    confirm-placeholder="Type dataset ID"
    mismatch-text="The dataset ID does not match"
    :action="wait"
    @close="open = false"
    @done="open = false"
  />
</template>
